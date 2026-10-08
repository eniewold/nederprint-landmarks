// Genereert een gesloten 3D-model van de Sint-Janskerk (Grote Kerk) in Gouda,
// met 123 m de langste kerk van Nederland, uit dakvlakken en bouwdelen: een
// schip en koor onder één nok (+28,4 m, 55 graden) met een 3/8-sluiting, een
// dwarsschip met topgevels en een dakruiter op de viering, en de kenmerkende
// 'kappen': rijen dwarse zadeldaken op de zijbeuken, elk met een schild naar het
// schip en een topgevel met een groot venster naar buiten (vier grote kappen per
// kant tussen de westpartij en het dwarsschip, drie kleinere in de westpartij,
// vier per kant langs het koor), een langsdak op de binnenste zijbeuken tussen de
// kappen, een kooromgang met vijf straalsgewijze kappen, lage kapellen en
// bijgebouwen, en de smalle westtoren met een omgang, een achtkantige lantaarn
// en een spits tot +49 m. Elk dak is een vlak z = a u + b v + c uit het AHN en de
// LoD2.2-vlakken van de 3D BAG. Het Mapbox-model is niet gebruikt. Alle maten in
// het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-sint-janskerk-gouda.mjs              # 1:1000 (standaard)
//   node scripts/generate-sint-janskerk-gouda.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (108610, 447146,5), in het schip vlak voor het
// dwarsschip, op het maaiveld (NAP +0,1 m), Z omhoog. +X loopt langs de nok van
// schip en koor naar het oosten (2 graden linksom vanaf de RD-X-as) en +Y
// loodrecht daarop naar het noorden. De toren staat in het westen (u -65 tot
// -57,4 m), het koor eindigt op u = 50,5 m en het oostelijke bijgebouw op 76,3 m.
//
// Bronnen: PDOK BAG-pand 0513100011121085; AHN DSM/DTM 0,5 m (PDOK WCS) voor
// nokken, kappen, de toren en het maaiveld; 3D BAG LoD2.2 (api.3dbag.nl) voor
// hellingen en richting; Wikipedia; PDOK luchtfoto. Geschat zijn de lantaarn en
// de spits van de toren tussen de AHN-punten, de dakruiter, de hellingen van de
// binnenste zijbeuken, de kooromgang, de steunberen en de vensternissen.
// Weggelaten: maaswerk, de glazen, dakkapellen en schoorstenen onder 0,9 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-janskerk-gouda");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor een veelhoek met apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: goot z0, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Doorsnede van een of meer veelhoeken en een rand (borstwering) van breedte w langs de omtrek, van z0 tot z1.
const section = (...polys) => CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
const band = (cs, w, z0, z1) => Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);

const SLUG = "sint-janskerk-gouda";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +0,1 m) ----------
const GROUND_NAP = 0.1;
const ORIGIN = [108610.0, 447146.5];
const X_AXIS = [0.999391, 0.034899]; // RD-richting 2 graden, langs de nok van schip en koor
const BASE = -0.8;

// Schip en koor onder één nok (+28,4 m, 55 graden), 11 m breed tussen de muren.
const T = 1.43;
const RIDGE = 28.4;
const RV = 1.25;
const HW = 5.5;
const NS = RV - HW; // zuidmuur van het schip
const NN = RV + HW; // noordmuur
const EAVE = RIDGE - T * HW;
// Koor: 3/8-sluiting rond AC.
const AC = [45.0, RV];
const PHIS = [-90, -45, 0, 45, 90];
const apsePoly = (c, apo, phis) =>
  phis.slice(1).map((p, i) => {
    const a = ((p + phis[i]) / 2) * (Math.PI / 180);
    const r = apo / Math.cos(((p - phis[i]) / 2) * (Math.PI / 180));
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
// Dwarsschip: nok langs v op u = 13 m.
const TR = { u0: 7.4, u1: 19.6, ridge: 13.0, v0: -22.6, v1: 26.2, t: 1.35 };
// Zijbeuken: rijen dwarse zadeldaken (de 'kappen'), elk met een schild naar het schip en een topgevel naar buiten.
const KAP = { ridge: 19.8, t: 1.32, hipEave: 13.6, hipT: 1.35 };
// Toren: smalle westtoren tot +33,5 m, een achtkantige lantaarn en een spits tot +49 m.
const TC = [-61.2, 0.3];
const TOWER_HALF = 3.8;

// Maaiveld (AHN NAP -0,1 tot +0,5 m): west, noord en noordoost.
const GROUND_SAMPLES = [[-70, 0], [-20, 31], [40, 22]];

// ---------- kerk ----------
const solids = [];

// Schip en koor met de sluiting.
const naveChoir = [[-57.6, NS], ...apsePoly(AC, HW, PHIS), [-57.6, NN]];
solids.push(roofed(naveChoir, PHIS.map((p) => facetPhi(AC, p, HW, EAVE, T))));
// Dwarsschip met topgevels.
solids.push(roofed(rect(TR.u0, TR.u1, TR.v0, TR.v1), ridgeU(TR.ridge, RIDGE + 0.2, TR.t)));
for (const [v0, v1] of [[TR.v0, TR.v0 + 0.9], [TR.v1 - 0.9, TR.v1]]) solids.push(roofed(rect(TR.u0, TR.u1, v0, v1), ridgeU(TR.ridge, RIDGE + 1.0, TR.t)));
// Dakruiter op de viering met een spits tot +39,3 m.
solids.push(loft([[26.0, oct([TR.ridge, RV], 2.8)], [32.0, oct([TR.ridge, RV], 2.8)], [39.3, oct([TR.ridge, RV], 0.9)]]));

// Dwarse kappen op de zijbeuken: [u0, u1] per kap, de nok in het midden; de kap loopt van de schipmuur tot de buitenmuur.
const kap = (u0, u1, vWall, vOut, ridge = KAP.ridge) => {
  const s = Math.sign(vOut - vWall);
  const um = (u0 + u1) / 2;
  const planes = [...ridgeU(um, ridge, KAP.t), [0, s * KAP.hipT, KAP.hipEave - s * KAP.hipT * vWall]];
  solids.push(roofed(rect(u0, u1, vWall - s * 0.05, vOut), planes));
  // Topgevel aan de buitenkant, 0,6 m boven het dak.
  solids.push(roofed(rect(u0, u1, vOut - s * 0.8, vOut), ridgeU(um, ridge + 0.6, KAP.t)));
};
// Westelijk deel van het schip (tot de grote kappen): smallere zijbeuken.
for (const [u0, u1] of [[-61.1, -50.8], [-50.8, -42.2], [-42.2, -34.0]]) {
  kap(u0, u1, NS, -14.2, 19.6);
  kap(u0, u1, NN, 18.0, 19.6);
}
// Vier grote kappen per kant tot het dwarsschip.
for (const [u0, u1] of [[-34.0, -23.4], [-23.4, -13.1], [-13.1, -2.9], [-2.9, TR.u0 + 0.1]]) {
  kap(u0, u1, NS, -22.8);
  kap(u0, u1, NN, 25.5);
}
// Binnenste zijbeuken: een langsdak met de nok op 3,6 m van de schipmuur (+18,6 m) tussen de kappen, zodat de kilgoten
// naast het schip hoog blijven (AHN: +15,6 tot +18,4 m tussen de kappen).
const inner = (u0, u1, vWall, vOut) => {
  const s = Math.sign(vOut - vWall);
  const vr = vWall + s * 3.6;
  solids.push(roofed(rect(u0, u1, vWall - s * 0.05, vOut), [[0, s * 1.35, 18.6 - s * 1.35 * vr], [0, -s * 0.9, 18.6 + s * 0.9 * vr]]));
};
inner(-61.1, TR.u0 + 0.1, NS, -13.0);
inner(-61.1, TR.u0 + 0.1, NN, 15.5);
inner(TR.u1 - 0.1, 46.2, NS, -12.5);
// Zuiderzijbeuk van het koor: vier kappen (nok +18,3 m), daarbuiten lage kapellen (+9 m).
for (const [u0, u1] of [[TR.u1 - 0.1, 25.5], [25.5, 32.4], [32.4, 39.3], [39.3, 46.2]]) kap(u0, u1, NS, -13.5, 18.3);
solids.push(roofed(rect(24.0, 46.1, -18.2, -13.4), [[0, 0.8, 9.8 + 0.8 * 13.4]]));
// Noorderzijbeuk van het koor: ook vier kappen tot de buitenmuur op v = 16,5 m.
inner(TR.u1 - 0.1, 47.0, NN, 15.5);
for (const [u0, u1] of [[TR.u1 - 0.1, 25.5], [25.5, 32.4], [32.4, 39.3], [39.3, 47.0]]) kap(u0, u1, NN, 16.5, 18.3);
// Kooromgang rond de sluiting: een lage rand (+13,5 m) met vijf straalsgewijze kappen (nok +18,5 m) met topgevels naar buiten.
solids.push(prism([[45.5, -13.5], [53.6, -9.4], [58.6, -3.2], [58.8, 5.3], [56.7, 9.3], [58.8, 10.1], [58.8, 15.0], [56.0, 15.2], [53.6, 13.4], [47.0, 16.5], [45.5, 16.5]], BASE, 13.5));
for (const phi of [-60, -30, 0, 30, 60]) {
  const r = 13.6 / Math.cos(Math.PI / 12);
  const a0 = ((phi - 15) * Math.PI) / 180;
  const a1 = ((phi + 15) * Math.PI) / 180;
  const wedge = [AC, [AC[0] + r * Math.cos(a0), AC[1] + r * Math.sin(a0)], [AC[0] + r * Math.cos(a1), AC[1] + r * Math.sin(a1)]];
  const sp = Math.sin((phi * Math.PI) / 180);
  const cp = Math.cos((phi * Math.PI) / 180);
  // Nok langs de straal door AC onder hoek phi: z = 18,5 - 1,3 * afstand tot die lijn.
  const ridgePlanes = [1, -1].map((k) => [k * 1.3 * sp, -k * 1.3 * cp, 18.5 - k * 1.3 * (sp * AC[0] - cp * AC[1])]);
  solids.push(roofed(wedge, ridgePlanes));
  solids.push(roofed(wedge, ridgePlanes.map(([x, y, c]) => [x, y, c + 0.6])).intersect(prism(wedge, BASE, 30).subtract(Manifold.extrude(new CrossSection([ccw(ngon(AC, 12.8, [-90, -75, -45, -15, 15, 45, 75, 90], 30))]), 40).translate([0, 0, BASE - 1]))));
}
// Lage aanbouwen: oostelijk bijgebouw met zadeldak (nok +12 m) en een lage aanbouw aan de noordwestkant.
solids.push(roofed(rect(58.6, 76.3, 10.2, 16.9), ridgeV(13.5, 12.0, 1.2)));
solids.push(prism(rect(-45.9, -33.9, 17.9, 20.8), BASE, 8.0));
// Steunberen langs de buitenmuren van de grote kappen.
for (const u of [-23.4, -13.05, -2.85, 7.75]) {
  solids.push(buttress([u, -22.8], 0, 1.3, 1.8, 13.0, 11.5));
  solids.push(buttress([u, 25.5], 180, 1.3, 1.9, 13.0, 11.5));
}

// De westtoren.
solids.push(prism(sq(TC, TOWER_HALF), BASE, 33.5));
solids.push(band(section(sq(TC, TOWER_HALF)), 0.9, 32.5, 34.4));
for (const [du, dv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  solids.push(pinnacle([TC[0] + du * (TOWER_HALF - 0.45), TC[1] + dv * (TOWER_HALF - 0.45)], 0.45, 34.3, 0.8, 1.4));
}
solids.push(
  loft([
    [33.0, oct(TC, 5.4)],
    [40.5, oct(TC, 5.4)],
    [40.8, oct(TC, 4.6)],
    [43.5, oct(TC, 3.6)],
    [45.5, oct(TC, 2.6)],
    [47.5, oct(TC, 1.4)],
    [49.0, oct(TC, 0.9)],
  ]),
);

let church = Manifold.union(solids);

// Vensternissen en galmgaten (spitsbogen).
const cuts = [];
// Topgevels van de grote kappen: een groot venster per kap.
for (const [u0, u1] of [[-34.0, -23.4], [-23.4, -13.1], [-13.1, -2.9], [-2.9, TR.u0]]) {
  const um = (u0 + u1) / 2;
  cuts.push(niche([um, 0], 270, 22.8, 0, 4.0, 3.5, 12.5, 0.5), niche([um, 0], 90, 25.5, 0, 4.0, 3.5, 12.5, 0.5));
}
for (const [u0, u1] of [[-61.1, -50.8], [-50.8, -42.2], [-42.2, -34.0]]) cuts.push(niche([(u0 + u1) / 2, 0], 270, 14.2, 0, 3.2, 3.5, 11.5, 0.5));
// Dwarsschip, lichtbeuk van schip en koor, sluiting.
cuts.push(niche([TR.ridge, 0], 270, -TR.v0, 0, 5.0, 5.0, 17.5, 0.5), niche([TR.ridge, 0], 90, TR.v1, 0, 5.0, 5.0, 17.5, 0.5));
for (const phi of [-45, 0, 45]) cuts.push(niche(AC, phi, HW, 0, 2.4, 18.0, 19.6, 0.5));
// Toren: galmgaten en een hoog westvenster.
for (const ang of [0, 90, 180, 270]) cuts.push(niche(TC, ang, TOWER_HALF, 0, 1.8, 26.0, 30.5, 0.5));
cuts.push(niche(TC, 180, TOWER_HALF, 0, 2.4, 8.0, 19.0, 0.5));
for (const ang of [0, 90, 180, 270]) cuts.push(niche(TC, ang, 2.7, 0, 1.2, 35.5, 39.0, 0.4));
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]];
const all = church;

const META = {
  name: "Sint-Janskerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 43.4,
  replacesBuildings: ["0513100011121085"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (108610, 447146,5), in het schip vlak voor het dwarsschip, op het maaiveld (NAP +0,1 m), +X langs de nok van schip en koor naar het oosten (2 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Een node building:kerk uit dakvlakken en bouwdelen: schip en koor onder één nok op +28,4 m met een 3/8-sluiting, dwarsschip met topgevels en dakruiter, rijen dwarse kappen (zadeldaken met een schild naar het schip en een topgevel naar buiten) op de zijbeuken, een kooromgang met straalsgewijze kappen, lage kapellen en bijgebouwen, en de westtoren met lantaarn en spits tot +49 m. Onderkant 0,8 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de kerk. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { naveRidgeM: RIDGE, aisleGableRidgeM: KAP.ridge, towerTopM: 49.0, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Janskerk_%28Gouda%29",
    "PDOK BAG pand 0513100011121085 (kerk met toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, kappen, toren en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR)",
  ],
};
// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
