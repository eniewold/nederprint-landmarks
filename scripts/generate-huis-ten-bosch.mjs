// Genereert een gesloten 3D-model van Paleis Huis ten Bosch in Den Haag uit
// dakvlakken en bouwdelen: het vierkante hoofdgebouw van Pieter Post (1645-1652)
// met de Oranjezaal onder de achtkantige koepel (trommel met vensters, koepel,
// lantaarn en kroon), de vier grote schoorstenen om de koepel, de omlopende
// schilddaken met de hoekrisalieten en het fronton aan de tuinzijde, het
// zandstenen voorhuis van Marot en Coulon (1734-1737) met vier pilasters,
// kroonlijst, balustrade en de bordestrap aan het voorplein, de bordes aan de
// tuinzijde, de lage zijkamers naast het hoofdgebouw, en de twee vleugels van
// Marot: per kant een binnenpaviljoen, een schuin naar voren geplaatste vleugel
// van 23 m en een eindpaviljoen met schilddak, met dakkapellen, schoorstenen,
// kroonlijsten en vensternissen. Elk dak is een vlak z = a u + b v + c uit het
// AHN en de LoD2.2-vlakken van de 3D BAG. Het Mapbox-model is niet gebruikt.
// Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-huis-ten-bosch.mjs              # 1:1000 (standaard)
//   node scripts/generate-huis-ten-bosch.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (83497,4, 456603,5), het hart van de koepel
// boven de Oranjezaal, op het maaiveld aan de tuinzijde (NAP +0,3 m), Z
// omhoog. +X loopt langs de gevels van het hoofdgebouw naar het oostnoordoosten
// (27,6 graden linksom vanaf de RD-X-as, gemeten aan de nokken en goten) en +Y
// loodrecht daarop naar het voorplein (noordnoordwest). Het voorhuis en de
// bordestrap staan aan de +Y-kant, de tuin met de vijver aan de -Y-kant; de
// vleugels lopen vanaf de binnenpaviljoens onder 20,5 graden naar voren. Het
// voorplein ligt 0,8 m hoger (NAP +1,1 m): daar zakt de voet in het terrein.
//
// Bronnen: PDOK BAG-pand 0518100000204917; AHN DSM/DTM 0,5 m (PDOK WCS) voor
// de nokken, goten, het dakplat met de schoorstenen, de koepel, het voorhuis,
// de vleugels en het maaiveld; 3D BAG LoD2.2 (api.3dbag.nl) voor de hellingen
// van de leien daken waar het AHN gaten heeft; Wikipedia; PDOK luchtfoto;
// foto's op Wikimedia Commons van het voorplein (frontaal en schuin), de
// tuinzijde en de koepel. Geschat zijn de koepel boven de trommel (leien en
// lood, in het AHN grotendeels zonder meting), de lantaarn en de kroon, de
// helling van de lage dakvlakken rond het voorhuis, de dakkapellen (plaats uit
// het AHN, maat van foto's), de vensternissen, pilasters en kroonlijsten, de
// trappen en de bordes. Weggelaten: de vazen en hekken op de trappen, de
// beelden en vazen op de balustrade, het alliantiewapen en de ornamenten, de
// luiken, de windvaan en de vlaggenmast op de koepel (kleiner dan 0,9 m), de
// Pieter Posthuizen en de bijgebouwen (eigen BAG-panden) en de glazen kas
// naast de westvleugel (geen apart bouwdeel).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "huis-ten-bosch");
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
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Vlak door de gevellijn u = u0 (of v = v0) op hoogte z0, stijgend met helling t naar de kant 'dir' (+1 of -1).
const riseU = (u0, z0, t, dir) => [dir * t, 0, z0 - dir * t * u0];
const riseV = (v0, z0, t, dir) => [0, dir * t, z0 - dir * t * v0];
const flat = (z) => [0, 0, z];
// Kroonlijst rond een rechthoek: een kraag onder 50 graden van de gevel tot 'out' buiten de gevel, dan recht tot z + top.
const cornice = ([u0, u1, v0, v1], z, out, top = 0.25) =>
  Manifold.hull([
    ...at(rect(u0, u1, v0, v1), z - out * 1.2),
    ...at(rect(u0 - out, u1 + out, v0 - out, v1 + out), z),
    ...at(rect(u0 - out, u1 + out, v0 - out, v1 + out), z + top),
  ]);
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const oct = ([cx, cy], a) =>
  Array.from({ length: 8 }, (_, k) => {
    const r = a / Math.cos(Math.PI / 8);
    const ang = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  });
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek].
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...at(p0, z0), ...at(p1, z1)]);
    }),
  );
// Vensternis in een gevel: breedte w, van z0 tot z1 en dan een spitse bovenkant van 60 graden,
// 'depth' diep achter het gevelvlak. p is het midden onderaan op de gevel, n de richting naar buiten.
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth = 0.35, out = 1.0) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [0, z1 + rise], [-w / 2, z1]];
  const pts = [];
  for (const d of [-depth, out]) for (const [s, z] of profile) pts.push([cx + nx * d - ny * s, cy + ny * d + nx * s, z]);
  return Manifold.hull(pts);
};
// Rij vensternissen gelijk verdeeld over de gevel van p0 naar p1 (normaal n naar buiten), in elke rij [z0, z1].
const nicheRow = (p0, p1, n, count, w, rows, cuts) => {
  for (let k = 0; k < count; k++) {
    const f = (k + 0.5) / count;
    const p = [p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f];
    for (const [z0, z1] of rows) cuts.push(niche(p, n, w, z0, z1));
  }
};
// Dakkapel op een dakvlak: gevellijn (goot) door p met de richting 'inward' (graden) het dak in, goot op zEave,
// helling t; de voorkant staat 'inset' m achter de goot. Bak van w breed, wangen 'cheek' hoog, zadeldakje van 45 graden.
const dormer = (p, inward, zEave, t, inset = 1.0, w = 1.6, depth = 3.0, cheek = 1.5) => {
  const sill = zEave + inset * t;
  const top = sill + cheek;
  const body = cutBelow(cutBelow(prism(rect(-w / 2, w / 2, inset, inset + depth), sill - 0.6, top + w), [1, 0, top + w / 2]), [-1, 0, top + w / 2]);
  return body.rotate([0, 0, inward - 90]).translate([p[0], p[1], 0]);
};
const chimney = ([cu, cv], hu, hv, z0, z1) => prism(rect(cu - hu, cu + hu, cv - hv, cv + hv), z0, z1);
const deg = (a) => (a * Math.PI) / 180;

const SLUG = "huis-ten-bosch";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld aan de tuinzijde op NAP +0,3 m) ----------
const GROUND_NAP = 0.3;
const ORIGIN = [83497.4, 456603.5];
const ANGLE = 27.6;
const X_AXIS = [+Math.cos(deg(ANGLE)).toFixed(6), +Math.sin(deg(ANGLE)).toFixed(6)];
const BASE = -0.5;

// Hoofdgebouw van Post (BAG en AHN): kern u -15,2..15,2, tuingevel v -7,9, voorgevel v 12,6; hoekrisalieten aan de
// tuinzijde (u 5,2..15,2 tot v -11,6). Goot +12,7 m, dakplat om de koepel op +18,7 m (NAP +19,0 m), dakvlakken 50 graden.
const MAIN = { u: 15.2, back: -7.9, front: 12.6, eave: 12.7, deck: 18.7, deckU: 10.2, deckV: 4.3, tSide: 1.2, tBack: 1.4, tFront: 1.25 };
const RISALIT = { u0: 5.2, u1: 15.2, v0: -11.6, v1: -4.3, eave: 12.8, t: 1.14 }; // nok +18,5 m
const FRONT_HIP = { u0: 7.1, u1: 15.2, v0: 4.3, v1: 12.6, eave: 12.7, t: 1.2 }; // nok +17,6 m
// Fronton boven het middendeel van de tuingevel: top +15,1 m.
const PEDIMENT = { half: 5.2, z0: 12.95, top: 15.1 };
// Vier schoorstenen op de hoeken van het dakplat (AHN NAP +22,7 m).
const CHIMNEYS = { u: 10.3, v: [3.7, -4.0], top: 22.4 };
// Koepel (Oranjezaal): achtkantige trommel met apothema 4,1 m tot +21,9 m, kraag, koepel tot +24,9 m,
// lantaarn tot +26 m en de kroon tot +27,5 m (AHN NAP +27,8 m), spits tot +28,4 m.
const DOME = { a: 4.1, drumTop: 21.9 };
// Zijkamers naast het hoofdgebouw (u 15,2..18,7, v -4,4..5,4): flauw zadeldak (24 graden), nok +15 m.
const SIDE = { u0: 15.2, u1: 18.7, v0: -4.4, v1: 5.4, ridgeV: 0.3, ridge: 15.0, t: 0.45 };
// Voorhuis (u -7,1..7,1 tot v 18,4): kroonlijst +15,3 m, balustrade tot +16,1 m, dak met plat op +17,7 m.
const PORCH = { u: 7.1, v0: 5.0, v1: 18.4, wall: 14.55, corniceTop: 15.5, balTop: 16.3, roof: 17.7, roofU: 4.8, roofV: 15.6, t: 1.4 };
// Binnenpaviljoen (u 14,5..25,8, v 8,8..20,6) met de nok op v 14,4 (+15,5 m); de vleugel buigt bij P af
// onder 20,5 graden naar het eindpaviljoen (u 46,55..57,75, v 11,6..29,7).
const PAV = { u0: 14.5, u1: 25.8, v0: 8.8, v1: 20.6, ridgeV: 14.4, ridge: 15.5, t: 1.13 };
const WING = { P: [25.0, 14.4], ang: 20.5, len: 28.99, front: 5.2, back: -5.0, ridge: 15.5, t: 1.33 };
const END = { u0: 46.55, u1: 57.75, v0: 11.6, v1: 29.7, ridge: 15.5, eave: 8.7 };
END.uc = (END.u0 + END.u1) / 2;
END.tSide = (END.ridge - END.eave) / ((END.u1 - END.u0) / 2);
END.tEnd = 1.3;

// Maaiveld aan de tuinzijde en naast de vleugels (NAP +0,2 tot +0,5 m); het voorplein ligt 0,8 m hoger.
const GROUND_SAMPLES = [[0, -16], [-22, -8], [22, -8]];

// Ramen: rijen [onderkant, aanzet van de spitse bovenkant].
const ROWS_MAIN = [[0.9, 2.3], [4.2, 6.6], [8.2, 10.4]];
const ROWS_WING = [[0.9, 2.6], [4.0, 5.9]];

// ---------- wingstelsel: s langs de vleugel naar buiten, d naar de voorkant ----------
const wc = Math.cos(deg(WING.ang));
const ws = Math.sin(deg(WING.ang));
const wingPt = (s, d) => [WING.P[0] + s * wc - d * ws, WING.P[1] + s * ws + d * wc];
const toWing = (solid) => solid.rotate([0, 0, WING.ang]).translate([WING.P[0], WING.P[1], 0]);
// Verstek tussen binnenpaviljoen en vleugel: de bissectrice van de knik door P.
const MITRE = [Math.cos(deg(WING.ang / 2)), Math.sin(deg(WING.ang / 2))];
const mitreOff = MITRE[0] * WING.P[0] + MITRE[1] * WING.P[1];

// ---------- rechterhelft (+u), later gespiegeld ----------
const half = [];
const halfCuts = [];

// Hoekrisaliet aan de tuinzijde met schilddak en een dakkapel naar de tuin.
half.push(roofed(rect(RISALIT.u0, RISALIT.u1, RISALIT.v0, RISALIT.v1), [riseV(RISALIT.v0, RISALIT.eave, RISALIT.t, 1), riseU(RISALIT.u0, RISALIT.eave, RISALIT.t, 1), riseU(RISALIT.u1, RISALIT.eave, RISALIT.t, -1)]));
half.push(cornice([RISALIT.u0, RISALIT.u1, RISALIT.v0, RISALIT.v1 - 0.3], RISALIT.eave, 0.3));
half.push(dormer([10.2, RISALIT.v0], 90, RISALIT.eave, RISALIT.t, 1.2));
// Voorste hoeken van het hoofdgebouw: schilddak met de nok in de lengte en een dakkapel naar het voorplein.
half.push(roofed(rect(FRONT_HIP.u0, FRONT_HIP.u1, FRONT_HIP.v0, FRONT_HIP.v1), [riseV(FRONT_HIP.v1, FRONT_HIP.eave, FRONT_HIP.t, -1), riseU(FRONT_HIP.u0, FRONT_HIP.eave, FRONT_HIP.t, 1), riseU(FRONT_HIP.u1, FRONT_HIP.eave, FRONT_HIP.t, -1)]));
half.push(cornice([FRONT_HIP.u0 + 0.3, FRONT_HIP.u1, FRONT_HIP.v0 + 0.3, FRONT_HIP.v1], FRONT_HIP.eave, 0.3));
half.push(dormer([11.15, FRONT_HIP.v1], -90, FRONT_HIP.eave, FRONT_HIP.t, 1.2));
// Twee schoorstenen op de hoeken van het dakplat.
for (const v of CHIMNEYS.v) half.push(chimney([CHIMNEYS.u, v], 0.9, 0.7, 15.5, CHIMNEYS.top));
// Zijkamer met flauw zadeldak en een schild naar buiten.
half.push(roofed(rect(SIDE.u0 - 0.5, SIDE.u1, SIDE.v0, SIDE.v1), [riseV(SIDE.ridgeV, SIDE.ridge, SIDE.t, -1), riseV(SIDE.ridgeV, SIDE.ridge, SIDE.t, 1), riseU(SIDE.u1, SIDE.ridge - 4.6 * SIDE.t, SIDE.t, -1)]));
// Verbindingsstuk tussen zijkamer en binnenpaviljoen met een lessenaarsdak naar buiten.
half.push(roofed(rect(MAIN.u - 0.5, 18.2, SIDE.v1 - 0.2, PAV.v0 + 0.5), [[-0.6, 0, 12.1 + 0.6 * MAIN.u]]));

// Binnenpaviljoen: zadeldak met een schild naar het hoofdgebouw; boven de goot afgesneden op het verstek.
{
  const p = rect(PAV.u0, PAV.u1, PAV.v0, PAV.v1);
  const eF = PAV.ridge - PAV.t * (PAV.v1 - PAV.ridgeV);
  const roof = roofed(p, [riseV(PAV.ridgeV, PAV.ridge, PAV.t, -1), riseV(PAV.ridgeV, PAV.ridge, PAV.t, 1), riseU(PAV.u0, eF, PAV.t, 1)]);
  const keep = roof.trimByPlane([-MITRE[0], -MITRE[1], 0], -mitreOff);
  half.push(Manifold.union([keep, prism(p, BASE, eF)]));
  half.push(cornice([PAV.u0, PAV.u1 - 1.2, PAV.v0, PAV.v1], eF, 0.3).trimByPlane([-MITRE[0], -MITRE[1], 0], -mitreOff - 0.3));
  // Schoorsteen op de nok (AHN NAP +18,1 m) en dakkapellen aan voor- en achterkant.
  half.push(chimney([20.2, 15.2], 0.75, 0.55, 12.0, 17.8));
  half.push(dormer([19.8, PAV.v1], -90, eF, PAV.t, 1.2));
  half.push(dormer([21.5, PAV.v0], 90, PAV.ridge - PAV.t * (PAV.ridgeV - PAV.v0), PAV.t, 1.2));
  nicheRow([15.6, PAV.v1], [24.6, PAV.v1], [0, 1], 3, 1.2, ROWS_WING, halfCuts);
  nicheRow([19.0, PAV.v0], [24.6, PAV.v0], [0, -1], 2, 1.2, ROWS_WING, halfCuts);
}

// Schuine vleugel in het eigen stelsel, afgesneden op het verstek en binnen het eindpaviljoen.
{
  const eF = WING.ridge - WING.t * WING.front;
  const eB = WING.ridge + WING.t * WING.back;
  const parts = [];
  parts.push(roofed(rect(-3, WING.len, WING.back, WING.front), [riseV(0, WING.ridge, WING.t, -1), riseV(0, WING.ridge, WING.t, 1)]));
  parts.push(cornice([-3, WING.len, WING.back, WING.front], Math.min(eF, eB), 0.3));
  // Platte uitbouw aan de achterkant (AHN NAP +13,3 m).
  parts.push(prism(rect(6.0, 11.5, -6.3, -2.0), BASE, 13.0));
  // Dakkapellen: vijf aan de voorkant, een aan de achterkant; twee schoorstenen op de nok.
  for (const s of [4.8, 9.1, 13.3, 18.1, 22.6]) parts.push(dormer([s, WING.front], -90, eF, WING.t, 1.2));
  parts.push(dormer([16.0, WING.back], 90, eB, WING.t, 1.2));
  for (const s of [6.8, 20.9]) parts.push(chimney([s, 0], 0.55, 0.75, 12.0, 17.6));
  const wing = toWing(Manifold.union(parts)).trimByPlane([MITRE[0], MITRE[1], 0], mitreOff);
  const inside = Manifold.union([prism(rect(0, END.u0, -50, 60), BASE - 1, 100), prism(rect(END.u0, END.u1, END.v0, END.v1), BASE - 1, 100)]);
  half.push(wing.intersect(inside));
  // Vensternissen aan voor- en achterkant.
  for (let k = 0; k < 8; k++) {
    const s = 3.85 + k * 2.55;
    for (const [z0, z1] of ROWS_WING) halfCuts.push(niche(wingPt(s, WING.front), [-ws, wc], 1.2, z0, z1));
  }
  for (const s of [1.6, 4.2, 13.4]) for (const [z0, z1] of ROWS_WING) halfCuts.push(niche(wingPt(s, WING.back), [ws, -wc], 1.2, z0, z1));
}

// Eindpaviljoen: schilddak met de nok in de lengte (v), schoorstenen aan beide einden van de nok,
// drie dakkapellen aan de buitenkant en een aan voor- en achterkant.
{
  const E = END;
  half.push(roofed(rect(E.u0, E.u1, E.v0, E.v1), [riseU(E.u0, E.eave, E.tSide, 1), riseU(E.u1, E.eave, E.tSide, -1), riseV(E.v0, E.eave, E.tEnd, 1), riseV(E.v1, E.eave, E.tEnd, -1)]));
  half.push(cornice([E.u0, E.u1, E.v0, E.v1], E.eave, 0.3));
  for (const v of [16.8, 24.3]) half.push(chimney([E.uc, v], 0.75, 0.55, 12.0, 18.2));
  for (const v of [16.5, 20.65, 24.8]) half.push(dormer([E.u1, v], 180, E.eave, E.tSide, 1.2));
  half.push(dormer([E.uc, E.v1], -90, E.eave, E.tEnd, 1.2));
  half.push(dormer([E.uc, E.v0], 90, E.eave, E.tEnd, 1.2));
  nicheRow([E.u0, E.v1], [E.u1, E.v1], [0, 1], 3, 1.2, ROWS_WING, halfCuts);
  nicheRow([E.u1, E.v0], [E.u1, E.v1], [1, 0], 5, 1.2, ROWS_WING, halfCuts);
  nicheRow([E.u0, E.v0], [E.u1, E.v0], [0, -1], 3, 1.2, ROWS_WING, halfCuts);
}

// Vensters van het hoofdgebouw in de rechterhelft.
nicheRow([RISALIT.u0, RISALIT.v0], [RISALIT.u1, RISALIT.v0], [0, -1], 3, 1.3, ROWS_MAIN, halfCuts);
nicheRow([MAIN.u, RISALIT.v0], [MAIN.u, SIDE.v0], [1, 0], 2, 1.3, ROWS_MAIN, halfCuts);
nicheRow([FRONT_HIP.u0, MAIN.front], [FRONT_HIP.u1 - 0.8, MAIN.front], [0, 1], 2, 1.3, ROWS_MAIN, halfCuts);
nicheRow([SIDE.u1, SIDE.v0], [SIDE.u1, SIDE.v1], [1, 0], 2, 1.3, ROWS_MAIN.slice(0, 2), halfCuts);
nicheRow([PORCH.u, MAIN.front], [PORCH.u, PORCH.v1], [1, 0], 1, 1.4, [[4.3, 7.2], [9.4, 11.6]], halfCuts);

// ---------- middendeel (symmetrisch) ----------
const center = [];
const centerCuts = [];
// Kern van het hoofdgebouw met de dakvlakken naar het dakplat om de koepel.
center.push(
  roofed(rect(-MAIN.u, MAIN.u, MAIN.back, MAIN.front), [
    riseU(MAIN.u, MAIN.eave, MAIN.tSide, -1),
    riseU(-MAIN.u, MAIN.eave, MAIN.tSide, 1),
    riseV(-MAIN.deckV, MAIN.deck, MAIN.tBack, 1),
    riseV(MAIN.deckV, MAIN.deck, MAIN.tFront, -1),
    flat(MAIN.deck),
  ]),
);
// Kroonlijst en fronton boven het middendeel van de tuingevel, met vier pilasters.
center.push(Manifold.hull([...at(rect(-RISALIT.u0, RISALIT.u0, MAIN.back, MAIN.back + 1), PEDIMENT.z0 - 0.42), ...at(rect(-RISALIT.u0, RISALIT.u0, MAIN.back - 0.35, MAIN.back + 1), PEDIMENT.z0), ...at(rect(-RISALIT.u0, RISALIT.u0, MAIN.back - 0.35, MAIN.back + 1), PEDIMENT.z0 + 0.25)]));
center.push(profileY([[-PEDIMENT.half, PEDIMENT.z0], [PEDIMENT.half, PEDIMENT.z0], [PEDIMENT.half, PEDIMENT.z0 + 0.3], [0, PEDIMENT.top], [-PEDIMENT.half, PEDIMENT.z0 + 0.3]], MAIN.back - 0.35, MAIN.back + 3.0));
for (const x of [-4.7, -1.8, 1.8, 4.7]) center.push(prism(rect(x - 0.45, x + 0.45, MAIN.back - 0.3, MAIN.back + 0.2), BASE, PEDIMENT.z0 - 0.42));
// Bordes aan de tuinzijde (+3,6 m) met twee trappen naar de tuin.
center.push(prism(rect(-5.0, 5.0, -10.4, MAIN.back + 0.1), BASE, 3.6));
{
  const steps = 8;
  const pts = [[-10.4 + 0.05, BASE], [-10.4 - 3.2, BASE]];
  for (let k = 0; k < steps; k++) pts.push([-10.4 - 3.2 + (k * 3.2) / steps, ((k + 1) * 3.6) / steps], [-10.4 - 3.2 + ((k + 1) * 3.2) / steps, ((k + 1) * 3.6) / steps]);
  for (const [u0, u1] of [[-5.0, -3.1], [3.1, 5.0]]) center.push(profileX(pts.map(([v, z]) => [v, z]), u0, u1));
}
// Voorhuis: wanden tot de kroonlijst, vier pilasters, kroonlijst, balustrade en het dak met plat.
{
  const P = PORCH;
  const r = [-P.u, P.u, P.v0, P.v1];
  center.push(prism(rect(...r), BASE, P.wall + 0.05));
  for (const x of [-6.6, -2.4, 2.4, 6.6]) center.push(prism(rect(x - 0.5, x + 0.5, P.v1 - 0.2, P.v1 + 0.3), BASE, P.wall));
  center.push(Manifold.hull([...at(rect(...r), P.wall), ...at(rect(-P.u - 0.55, P.u + 0.55, P.v0, P.v1 + 0.55), P.wall + 0.66), ...at(rect(-P.u - 0.55, P.u + 0.55, P.v0, P.v1 + 0.55), P.corniceTop)]));
  const inner = new CrossSection([ccw(rect(-P.u + 0.9, P.u - 0.9, P.v0 - 1, P.v1 - 0.9))]);
  center.push(Manifold.extrude(new CrossSection([ccw(rect(...r))]).subtract(inner), P.balTop - P.corniceTop + 0.02).translate([0, 0, P.corniceTop - 0.02]));
  center.push(
    roofed(rect(-P.u + 0.85, P.u - 0.85, P.v0, P.v1 - 0.85), [riseU(P.roofU, P.roof, P.t, -1), riseU(-P.roofU, P.roof, P.t, 1), riseV(P.roofV, P.roof, P.t, -1), flat(P.roof)]),
  );
  // Bordestrap naar de bel-etage (+3,7 m) met wangen.
  const steps = 8;
  const run = 0.45;
  const pts = [[P.v1 - 0.05, BASE], [P.v1 + steps * run, BASE]];
  for (let k = 0; k < steps; k++) pts.push([P.v1 + (steps - k) * run, 0.9 + (k + 1) * (2.8 / steps)], [P.v1 + (steps - k - 1) * run, 0.9 + (k + 1) * (2.8 / steps)]);
  center.push(profileX(pts, -4.6, 4.6));
  for (const [u0, u1] of [[-5.5, -4.55], [4.55, 5.5]]) center.push(profileX([[P.v1 - 0.05, BASE], [P.v1 + steps * run + 0.3, BASE], [P.v1 + steps * run + 0.3, 1.4], [P.v1, 4.5], [P.v1 - 0.05, 4.5]], u0, u1));
  // Vensters: deur en twee hoge vensters op de bel-etage, drie vensters daarboven.
  for (const x of [-4.5, 0, 4.5]) {
    centerCuts.push(niche([x, P.v1], [0, 1], x === 0 ? 1.7 : 1.5, x === 0 ? 3.8 : 4.6, 7.2));
    centerCuts.push(niche([x, P.v1], [0, 1], 1.5, 9.4, 11.6));
  }
}
// Vensters en deur in het middendeel van de tuingevel (boven de bordes).
for (const x of [-3.25, 0, 3.25]) {
  centerCuts.push(niche([x, MAIN.back], [0, -1], 1.3, x === 0 ? 3.6 : 4.2, 6.6));
  centerCuts.push(niche([x, MAIN.back], [0, -1], 1.3, 8.2, 10.4));
}
// Koepel: trommel met acht vensters, kraag, koepel, lantaarn, kroon en spits.
{
  const c = [0, 0];
  center.push(prism(oct(c, DOME.a), 15.0, DOME.drumTop));
  center.push(
    loft([
      [DOME.drumTop - 0.02, oct(c, DOME.a)],
      [DOME.drumTop + 0.33, oct(c, DOME.a + 0.3)],
      [22.45, oct(c, DOME.a + 0.3)],
      [23.0, oct(c, 4.05)],
      [23.7, oct(c, 3.45)],
      [24.3, oct(c, 2.6)],
      [24.75, oct(c, 1.6)],
      [24.9, oct(c, 1.0)],
    ]),
  );
  center.push(loft([[24.7, oct(c, 0.95)], [26.0, oct(c, 0.95)], [26.3, oct(c, 1.2)], [26.75, oct(c, 1.2)], [27.4, oct(c, 0.6)], [27.5, oct(c, 0.45)], [28.4, [c]]]));
  for (let k = 0; k < 8; k++) {
    const a = deg(45 * k);
    const n = [Math.cos(a), Math.sin(a)];
    centerCuts.push(niche([n[0] * DOME.a, n[1] * DOME.a], n, 1.3, 19.4, 20.4, 0.3, 0.6));
  }
}

const halfSolid = Manifold.union(half);
const solids = [...center, halfSolid, halfSolid.mirror([1, 0, 0])];
const cutsHalf = Manifold.union(halfCuts);
const cuts = Manifold.union([...centerCuts, cutsHalf, cutsHalf.mirror([1, 0, 0])]);
let palace = Manifold.union(solids).subtract(cuts);

// Platte aanbouw achter het oostelijke eindpaviljoen (AHN NAP +8,8 m, hier +8,75 m zodat de kroonlijsten erin verdwijnen), alleen aan de rechterkant.
palace = Manifold.union([palace, prism([[40.0, 17.5], [40.0, 11.8], [42.6, 9.2], [46.9, 8.3], [57.9, 8.3], [57.9, 12.0], [46.9, 12.0], [46.9, 17.5]], BASE, 8.75)]);

const nodes = [["building:paleis", palace]];
const all = palace;

const META = {
  name: "Paleis Huis ten Bosch",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 43.6,
  replacesBuildings: ["0518100000204917"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (83497,4, 456603,5), het hart van de koepel boven de Oranjezaal, op het maaiveld aan de tuinzijde (NAP +0,3 m), +X langs de gevels van het hoofdgebouw (27,6 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het voorplein. Een node building:paleis uit dakvlakken en bouwdelen: het hoofdgebouw met de hoekrisalieten, het fronton en de bordes aan de tuinzijde, het dakplat met vier schoorstenen en de achtkantige koepel met trommel, lantaarn en kroon (+28,4 m), het voorhuis met pilasters, kroonlijst, balustrade en bordestrap, de zijkamers, en per kant een binnenpaviljoen, een schuine vleugel en een eindpaviljoen met schilddaken, dakkapellen, schoorstenen, kroonlijsten en vensternissen. Onderkant 0,5 m onder het maaiveld; alle vlakken wijzen omhoog, staan verticaal of hangen niet vlakker dan 50 graden. Vervangt de PDOK-reconstructie van het paleis. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { domeTopM: 28.4, deckM: MAIN.deck, wingRidgeM: WING.ridge, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Paleis_Huis_ten_Bosch",
    "PDOK BAG pand 0518100000204917 (het paleis), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, dakplat, schoorstenen, koepel, voorhuis, vleugels en maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen van de leien daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's van het voorplein, de tuinzijde en de koepel",
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
