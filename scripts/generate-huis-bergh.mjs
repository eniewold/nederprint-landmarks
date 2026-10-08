// Genereert een gesloten 3D-model van het hoofdkasteel van Huis Bergh in
// 's-Heerenberg uit dakvlakken en bouwdelen: de vierkante donjon op de
// noordwesthoek met een borstwering met kantelen en vier hoektorentjes op een
// kraag met koepels, de west-, noord- en oostvleugel met zadeldaken (nokken +17,5
// tot +18 m boven het eiland) met dakkapellen en schoorstenen, de schuine
// zuidoostvleugel langs de gracht, de binnenplaats onder een glazen dak met een
// achtkantig traptorentje met spits en uitje, de lage zuidvleugel en een vierkant
// traptorentje. De voorburcht, de ronde torens op het voorplein en de
// grachtmuren zijn eigen BAG-panden of geen pand en blijven PDOK-terrein of
// PDOK-model. Elk dak is een vlak z = a u + b v + c uit het AHN en de
// LoD2.2-vlakken van de 3D BAG. Het Mapbox-model is niet gebruikt. Alle maten
// in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-huis-bergh.mjs              # 1:1000 (standaard)
//   node scripts/generate-huis-bergh.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (213827, 432079), midden in het hoofdkasteel, op
// het maaiveld van het kasteeleiland (NAP +19,8 m), Z omhoog. +X loopt langs de
// noordvleugel naar het oostnoordoosten (21 graden linksom vanaf de RD-X-as) en
// +Y loodrecht daarop; de donjon staat op u -18,4 tot -7,6 m, v 8,4 tot 21,2 m.
// De gevels aan de oost- en noordkant staan in de slotgracht (water NAP +13,8 tot
// +14,4 m), daarom begint het model 6,2 m onder het eiland.
//
// Bronnen: PDOK BAG-pand 1955100000024260; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// vleugels, de donjon, de gracht en het maaiveld; 3D BAG LoD2.2 (api.3dbag.nl);
// Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons vanaf de zuid- en
// westkant. Geschat zijn de kantelen, de hoektorentjes en hun koepels, het
// achtkantige traptorentje (op de foto's te zien, in het AHN niet: plaats en
// hoogte geschat), de dakkapellen, schoorstenen en vensternissen en de hellingen
// van de zuidoostvleugel. Weggelaten: de grote borstweringsmuur langs de gracht
// aan de zuidkant (geen pand), de trap aan de oostgevel en de luiken.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "huis-bergh");
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

const SLUG = "huis-bergh";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld van het kasteeleiland op NAP +19,8 m) ----------
const GROUND_NAP = 19.8;
const ORIGIN = [213827.0, 432079.0];
const X_AXIS = [0.93358, 0.358368]; // RD-richting 21 graden, langs de noordvleugel
// De gevels aan de oost- en noordkant staan in de slotgracht (water NAP +13,8 tot +14,4 m).
const BASE = -6.2;

// Vleugels met zadeldaken (AHN: nokken +17,5 tot +18 m boven het eiland, 50 tot 52 graden).
const WEST = { u0: -7.7, u1: 4.5, v0: -23.0, v1: 19.5, ridgeU: -1.0, ridge: 18.0, t: 1.2 };
const NORTH = { u0: -7.7, u1: 18.3, v0: 10.0, v1: 21.2, ridgeV: 16.6, ridge: 17.5, t: 1.2 };
const EAST = { u0: 11.0, u1: 18.4, v0: -10.0, v1: 21.2, ridgeU: 14.6, ridge: 17.8, t: 1.3 };
// De donjon op de noordwesthoek: muren tot +21,4 m met kantelen en vier ronde hoektorentjes met koepels.
const KEEP = { u0: -18.4, u1: -7.6, v0: 8.4, v1: 21.2, top: 21.4 };

// Maaiveld op het kasteeleiland (NAP +19,8 m) ten westen van de vleugels.
const GROUND_SAMPLES = [[-25, 0], [-20, -15], [-10, 0]];

// ---------- kasteel ----------
const solids = [];

// Westvleugel met een schild aan de zuidkant.
solids.push(roofed(rect(WEST.u0, WEST.u1, WEST.v0, WEST.v1), [...ridgeU(WEST.ridgeU, WEST.ridge, WEST.t), [0, WEST.t, 11.4 - WEST.t * WEST.v0]]));
// Noordvleugel en oostvleugel.
solids.push(roofed(rect(NORTH.u0, NORTH.u1, NORTH.v0, NORTH.v1), ridgeV(NORTH.ridgeV, NORTH.ridge, NORTH.t)));
solids.push(roofed(rect(EAST.u0, EAST.u1, EAST.v0, EAST.v1), [...ridgeU(EAST.ridgeU, EAST.ridge, EAST.t), [0, EAST.t, 11.5 - EAST.t * EAST.v0]]));
// Topgevels aan de kopse kanten van noord- en oostvleugel.
solids.push(roofed(rect(EAST.u0, EAST.u1, EAST.v1 - 0.8, EAST.v1), ridgeU(EAST.ridgeU, EAST.ridge + 0.6, EAST.t)));
// Schuine zuidoostvleugel langs de gracht, met de nok van (6, -21) naar (14,5, -8).
{
  const p = [[4.0, -8.0], [4.0, -24.2], [6.7, -24.4], [10.6, -21.9], [17.6, -7.7], [18.4, -5.0], [11.0, -5.0]];
  const r0 = [6.0, -21.0];
  const r1 = [14.5, -8.0];
  solids.push(roofed(p, [facet(r0, r1, 16.5, -1.2, [4.0, -8.0]), facet(r0, r1, 16.5, -1.2, [10.6, -21.9])]));
}
// Binnenplaats met een glazen dak (+12,8 m) en een achtkantig traptorentje met een spits en een uitje.
solids.push(prism(rect(4.0, 11.2, -8.2, 10.2), BASE, 12.8));
solids.push(loft([[BASE, oct([10.4, 8.6], 3.0)], [21.5, oct([10.4, 8.6], 3.0)], [21.8, oct([10.4, 8.6], 3.4)], [22.2, oct([10.4, 8.6], 3.4)], [26.0, oct([10.4, 8.6], 1.4)], [26.2, oct([10.4, 8.6], 1.8)], [27.2, oct([10.4, 8.6], 1.8)], [29.0, oct([10.4, 8.6], 0.9)]]));
// Lage zuidvleugel (+10,5 m) en een vierkant traptorentje met een tentdak op de hoek.
solids.push(prism([[-16.3, -25.0], [-15.7, -31.0], [-2.8, -30.1], [4.1, -26.0], [4.1, -24.0], [-5.0, -23.6]], BASE, 10.5));
solids.push(loft([[BASE, sq([-6.4, -25.2], 1.4)], [18.0, sq([-6.4, -25.2], 1.4)], [21.0, tip([-6.4, -25.2])]]));
// Dakkapellen op de westvleugel (naar het voorplein) en de noordvleugel.
for (const v of [-14.0, -6.0, 2.0]) solids.push(roofed(rect(-5.0, -2.6, v - 0.9, v + 0.9), ridgeV(v, 15.6, 1.6)));
for (const u of [2.0, 8.0]) solids.push(roofed(rect(u - 0.9, u + 0.9, 18.2, 20.2), ridgeU(u, 15.4, 1.6)));
// Schoorstenen.
for (const [u, v] of [[-1.0, -10.0], [-1.0, 6.0], [14.6, 14.0]]) solids.push(prism(sq([u, v], 0.6), BASE, 19.6));

// De donjon.
const keepRect = rect(KEEP.u0, KEEP.u1, KEEP.v0, KEEP.v1);
solids.push(prism(keepRect, BASE, KEEP.top));
solids.push(band(section(keepRect), 0.9, KEEP.top - 0.5, KEEP.top + 1.2));
// Kantelen op de borstwering (1,0 m breed, tussenruimtes 1,2 m).
for (let u = KEEP.u0 + 2.2; u < KEEP.u1 - 1.8; u += 2.2) {
  for (const v of [KEEP.v0 + 0.45, KEEP.v1 - 0.45]) solids.push(prism(rect(u - 0.5, u + 0.5, v - 0.45, v + 0.45), KEEP.top, KEEP.top + 2.2));
}
for (let v = KEEP.v0 + 2.3; v < KEEP.v1 - 1.8; v += 2.2) {
  for (const u of [KEEP.u0 + 0.45, KEEP.u1 - 0.45]) solids.push(prism(rect(u - 0.45, u + 0.45, v - 0.5, v + 0.5), KEEP.top, KEEP.top + 2.2));
}
// Vier hoektorentjes (2,8 m) op een kraag, tot +24 m met een koepel en een pinakel.
for (const [u, v] of [[KEEP.u0 + 0.9, KEEP.v0 + 0.9], [KEEP.u0 + 0.9, KEEP.v1 - 0.9], [KEEP.u1 - 0.9, KEEP.v0 + 0.9], [KEEP.u1 - 0.9, KEEP.v1 - 0.9]]) {
  solids.push(loft([[18.4, oct([u, v], 1.6)], [19.8, oct([u, v], 2.8)], [24.0, oct([u, v], 2.8)], [24.8, oct([u, v], 2.2)], [25.3, oct([u, v], 1.2)], [26.4, oct([u, v], 0.9)]]));
}

let castle = Manifold.union(solids);

// Vensternissen en de poort in de donjon.
const cuts = [];
for (const v of [-18.0, -10.0, -2.0, 6.0]) cuts.push(niche([0, v], 180, -WEST.u0, 0, 1.4, 3.0, 6.0, 0.4), niche([0, v], 180, -WEST.u0, 0, 1.4, 7.5, 9.8, 0.4));
for (const v of [-6.0, 2.0, 10.0, 18.0]) cuts.push(niche([0, v], 0, EAST.u1, 0, 1.4, 3.0, 6.0, 0.4), niche([0, v], 0, EAST.u1, 0, 1.4, 7.5, 9.8, 0.4));
for (const u of [-2.0, 4.0, 10.0]) cuts.push(niche([u, 0], 90, NORTH.v1, 0, 1.4, 3.0, 6.0, 0.4), niche([u, 0], 90, NORTH.v1, 0, 1.4, 7.5, 9.8, 0.4));
for (const [ang, a, c] of [[270, -KEEP.v0, [-13.0, 0]], [180, -KEEP.u0, [0, 14.8]], [90, KEEP.v1, [-13.0, 0]]]) {
  for (const z of [4.0, 9.5, 15.0]) cuts.push(niche(c, ang, a, 0, 1.2, z, z + 2.4, 0.4));
}
castle = castle.subtract(Manifold.union(cuts));

const nodes = [["building:kasteel", castle]];
const all = castle;

const META = {
  name: "Huis Bergh",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 63.6,
  replacesBuildings: ["1955100000024260"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (213827, 432079), midden in het hoofdkasteel, op het maaiveld van het kasteeleiland (NAP +19,8 m), +X langs de noordvleugel (21 graden vanaf de RD-X-as) en +Y loodrecht daarop. Een node building:kasteel uit dakvlakken en bouwdelen: de donjon met kantelen en vier hoektorentjes, de west-, noord- en oostvleugel met zadeldaken, dakkapellen en schoorstenen, de schuine zuidoostvleugel, de binnenplaats met een glazen dak en een achtkantig traptorentje met spits, de lage zuidvleugel en een vierkant traptorentje. Onderkant 6,2 m onder het eiland, tot in de slotgracht; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het hoofdkasteel. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { keepTopM: KEEP.top, ridgeM: WEST.ridge, stairTowerTopM: 29.0, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Huis_Bergh",
    "PDOK BAG pand 1955100000024260 (het hoofdkasteel), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: vleugels, donjon, gracht en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de zuid- en westkant",
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
