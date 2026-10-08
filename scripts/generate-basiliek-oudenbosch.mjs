// Genereert een gesloten 3D-model van de Basiliek van de HH. Agatha en Barbara
// in Oudenbosch (P.J.H. Cuypers en G.J. van Swaay, 1867-1880), de verkleinde
// kopie van de Sint-Pieter met de voorgevel van de Sint-Jan van Lateranen: de
// voorgevel met halfzuilen in reuzenorde, vijf boognissen, de kroonlijst, de
// attiek met het middenfronton, het middenblok en de beelden; het schip met
// de balustrade met piedestals en vensternissen; de vierkante viering met een
// balustrade; de trommel met zestien steunberen en vensters ertussen; de
// koepel met zestien ribben en dakkapellen, en de lantaarn; de drie armen met
// halfronde apsissen met vensters (west, oost en het koor in het noorden), de
// lagere hoekvolumes en de sacristieën. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-basiliek-oudenbosch.mjs              # 1:1000 (standaard)
//   node scripts/generate-basiliek-oudenbosch.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of worden naar boven toe smaller; de nissen hebben een boog
// tot 40 graden met een spitse sluiting van 50 graden, de ribben lopen aan de
// voet uit in het koepelvlak. Alleen de kroonlijst van de voorgevel kraagt
// 0,3 m uit; die vlakke onderkant laat de export de nissen behouden (zie de
// controle onderaan).
//
// Assenstelsel: oorsprong onder het hart van de koepel op RD (95519,15,
// 400427,87), op het maaiveld aan de noordkant (NAP +2,0 m), Z omhoog. +Y loopt
// langs de as van de kerk naar het koor in het noorden (RD-richting 85 graden),
// +X naar het oosten; de voorgevel aan het voorplein ligt aan de -Y-kant. Het
// terrein loopt van NAP +2,0 m aan de koorzijde op tot +6,0 m op het voorplein;
// het model heeft één vlakke onderkant en zakt aan de voorkant in het
// PDOK-terrein, de hoogtes in NAP blijven kloppen.
//
// Bronnen: BAG-pand 1655100000541882 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// een stelsel langs de as: de nok en goten van het schip (NAP +30,6 en
// +26,5 m), de voorgevel (kroonlijst +29,5 m, attiek +34 m, fronton tot +38 m,
// middenblok +39 m), de pieken van de beelden (+36 tot +42 m) en de
// piedestals op de balustrade (+27,5 m), de viering (+31,0 m), de armen en
// apsissen (nok +30,5 m), de hoekvolumes (+27,0 m), de sacristieën (+13,5 m),
// ringen rond de trommel (zestien steunberen tot een straal van 12,7 m, kern
// 11,0 m) en het radiale profiel van koepel en lantaarn (koepel tot +58,7 m,
// lantaarn tot +66 m, het kruis tot +69,8 m) en het maaiveld; de PDOK
// 3D-reconstructie (LoD2.2) ter vergelijking; foto's op Wikimedia Commons
// (RCE); Wikipedia. Geschat: de indeling van de voorgevel, de vorm van de
// beelden, de vensters en de dakkapellen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "basiliek-oudenbosch");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(96);

// ---------- maten (lokaal stelsel, z = NAP - 2,0 m) ----------
const ORIGIN = [95519.15, 400427.87];
const ANGLE = (-5.0 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 2.0;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour (lokaal, vereenvoudigd tot 0,3 m).
const OUTLINE = [
  [0.8, 29.9], [-2.8, 29.0], [-3.1, 29.4], [-4.7, 28.4], [-4.3, 28.0], [-5.8, 26.4], [-12.2, 26.5],
  [-12.3, 21.0], [-20.0, 20.9], [-20.4, 8.7], [-23.6, 7.9], [-25.9, 6.3], [-27.5, 4.1], [-28.2, -0.0],
  [-27.5, -2.7], [-25.9, -5.0], [-23.6, -6.6], [-21.0, -7.3], [-21.3, -19.4], [-19.4, -19.8],
  [-19.4, -19.3], [-14.1, -19.5], [-15.1, -45.7], [-17.7, -45.7], [-17.9, -51.5], [-9.6, -51.8],
  [-9.6, -52.5], [5.5, -53.0], [5.5, -52.4], [13.7, -52.6], [14.3, -47.3], [11.0, -47.2], [10.8, -46.6],
  [11.0, -41.6], [11.7, -41.4], [11.8, -37.6], [11.1, -37.4], [11.3, -32.3], [12.0, -32.1], [12.1, -28.3],
  [11.4, -28.1], [11.6, -23.0], [12.3, -22.8], [12.6, -20.2], [17.4, -20.5], [17.6, -21.2], [19.5, -21.0],
  [20.0, -8.7], [20.2, -8.2], [23.0, -7.5], [25.5, -5.6], [26.0, -5.8], [26.9, -4.5], [26.5, -4.2],
  [27.2, -1.5], [26.7, 2.1], [27.1, 2.3], [26.4, 3.8], [25.9, 3.5], [24.2, 5.3], [20.8, 6.6], [20.9, 7.1],
  [20.2, 7.4], [20.3, 10.4], [20.8, 10.4], [20.8, 12.3], [20.1, 12.5], [20.3, 17.4], [21.0, 17.5],
  [20.8, 19.7], [18.9, 19.8], [18.7, 19.1], [14.1, 19.3], [13.9, 19.9], [13.4, 20.0], [13.8, 25.7],
  [7.2, 25.9], [6.0, 27.6], [6.3, 28.0], [4.8, 29.2], [4.5, 28.8],
];
const CORNER_TOP = 27.0; // hoekvolumes en de basis onder de daken
const SACRISTIES = [
  { x: [-12.6, -5.6], y: [20.6, 27.0], top: 13.5 },
  { x: [7.0, 14.2], y: [19.6, 26.2], top: 13.5 },
];
const CROSSING = { x: [-14.2, 15.0], y: [-13.0, 13.0], top: 31.0 };
const NAVE = { x: [-14.6, 12.0], y: [-46.5, -12.0], axis: -1.3, eave: 26.5, ridge: 30.6 };
const FACADE = { x: [-18.0, 14.3], y: [-53.0, -46.0], top: 29.2, pediment: { x: [-8.0, 5.4], front: -52.3, top: 38.0 } };
// Armen met apsis: richting, as, breedte, lengte tot het hart van de apsis.
const ARMS = [
  { name: "west", dir: [-1, 0], apse: [-21.0, 0.0], radius: 7.2, half: 7.0, eave: 28.2, ridge: 30.5 },
  { name: "oost", dir: [1, 0], apse: [20.0, -0.4], radius: 7.2, half: 7.0, eave: 28.2, ridge: 30.5 },
  { name: "koor", dir: [0, 1], apse: [0.4, 22.6], radius: 7.3, half: 9.0, eave: 26.5, ridge: 30.6 },
];
// Trommel, koepel en lantaarn (straal, NAP), naar het radiale DSM-profiel.
const DOME_PROFILE = [
  [11.0, 31.0], [11.0, 45.6], [10.5, 48.0], [10.0, 50.0], [9.0, 52.2], [8.0, 54.1],
  [7.0, 55.2], [6.0, 56.3], [5.0, 57.3], [4.0, 58.0], [3.0, 58.7], [2.3, 58.7], [2.3, 63.0],
  [1.0, 66.0], [0, 67.0],
];
// Voorgevel naar de Sint-Jan van Lateranen: drie delen (links, het naar voren
// springende middendeel en rechts) met halfzuilen in reuzenorde tot de
// kroonlijst, boognissen in de traveeën, de attiek met de balustrade (+34 m)
// waarop het fronton staat, het middenblok erachter (+39 m) en de beelden.
const FRONT = {
  sections: [
    { x: [-17.9, -9.6], front: -51.6, columns: [-17.2, -10.3], arches: [[-13.75, 3.4, 22.0]] },
    { x: [-9.6, 5.5], front: -52.7, columns: [-9.0, -4.3, 0.2, 4.9], arches: [[-6.65, 3.0, 23.0], [-2.05, 3.0, 25.0], [2.55, 3.0, 23.0]] },
    { x: [5.5, 13.7], front: -52.5, columns: [6.2, 13.0], arches: [[9.6, 3.4, 22.0]] },
  ],
  column: { width: 1.1, depth: 0.5 },
  archSill: 6.5,
  cornice: { bottom: 29.2, top: 29.8, overhang: 0.3 },
  attic: { x: [-17.6, 13.9], y: [-51.0, -46.0], centre: { x: [-9.6, 5.5], front: -52.3 }, top: 34.0 },
  block: { x: [-6.5, 2.5], y: [-50.5, -47.0], top: 39.0 },
};
// Beelden op de attiek (x, y, NAP top), uit de pieken in het AHN.
const STATUES = [
  [-16.75, -50.3, 36.4], [-14.75, -50.6, 36.8], [-8.25, -50.8, 37.4], [-6.25, -50.8, 37.8],
  [2.75, -50.8, 37.7], [4.25, -50.8, 36.0], [10.75, -50.5, 36.6], [12.75, -50.5, 36.9],
  [-16.25, -47.3, 35.9], [12.75, -48.2, 36.4],
];
const MAIN_STATUE = [-2.0, -48.8, 42.0];
// Balustrade met piedestals langs de goten van het schip en rond de viering.
const NAVE_BALUSTRADE = { x: [[-14.6, -13.7], [11.1, 12.0]], y: [-46.0, -13.0], top: 27.5, piers: 28.0 };
const CROSSING_BALUSTRADE = 32.3;
// Rondboogvensters (nissen) in de zijgevels van het schip.
const NAVE_WINDOWS = { y: [-44.1, -34.85, -25.55], z: [13.0, 22.0], width: 2.6 };
const APSE_WINDOW = { z: [12.0, 21.0], width: 2.4 };
// Trommel: zestien steunberen met gekoppelde zuilen, vensters ertussen; de
// koepel met zestien ribben en zestien dakkapellen tussen de ribben.
const DRUM = { core: 11.0, buttress: { from: 10.5, to: 12.7, width: 2.2, top: 45.0, cap: 46.5 }, phaseDeg: 9, window: { z: [35.0, 43.0], width: 2.0 } };
const RIB = { width: 0.9, proud: 0.5, from: 10.5, to: 3.0 };
const DORMER = { front: 10.3, back: 8.6, width: 1.6, sill: 48.6, top: 50.8, apex: 51.6 };
// Maaiveld (lokaal) aan de lage noord-, west- en oostkant.
const GROUND_SAMPLES = [[0, 34], [-32, 12], [31, 6], [-32, -10]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = Manifold.extrude(new CrossSection([ccw(OUTLINE)]), 200).translate([0, 0, BASE - 1]);
const revolve = (profile) => Manifold.revolve(new CrossSection([ccw(profile)]), 0);

// Rondboognis in een gevel: breedte w van z0 tot z1 (NAP); de boog loopt tot 40
// graden en sluit dan met rechte stukken van 50 graden, zodat hij zonder steun
// print. `at` is het midden onderaan op het gevelvlak, `normal` naar buiten.
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth) => {
  const r = w / 2;
  const top = NAP(z1);
  const rad = (d) => (d * Math.PI) / 180;
  const spring = top - (r * Math.sin(rad(40)) + r * Math.cos(rad(40)) * Math.tan(rad(50)));
  const arc = [0, 20, 40].map((d) => [r * Math.cos(rad(d)), spring + r * Math.sin(rad(d))]);
  const profile = [[-r, NAP(z0)], [r, NAP(z0)], ...arc, [0, top], ...arc.map(([u, z]) => [-u, z]).reverse()];
  const pts = [];
  for (const d of [-depth, 1.5]) {
    for (const [u, z] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, z]);
  }
  return Manifold.hull(pts);
};
// Beeld op een sokkel: vierkante sokkel, smallere figuur met een punt.
const statue = ([x, y], base, top) => {
  const sq = (h) => [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]];
  const at = (pts, z) => pts.map(([px, py]) => [px, py, z]);
  return Manifold.union(
    box([x - 0.6, x + 0.6], [y - 0.6, y + 0.6], BASE, NAP(base + 0.8)),
    Manifold.hull([...at(sq(0.45), BASE), ...at(sq(0.45), NAP(top) - 0.5), [x, y, NAP(top)]]),
  );
};
const polar = (r, deg) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];

// Arm met zadeldak langs zijn as en een halve kegel over de apsis: het omhulsel
// van de rechthoek tot de goot, de nok van de viering tot het hart van de apsis
// en de halve cirkel van de apsis op goothoogte.
function arm({ dir, apse, radius, half, eave, ridge }) {
  const [dx, dy] = dir;
  const [nx, ny] = [-dy, dx];
  const len = Math.hypot(...apse);
  const pts = [];
  for (const s of [0, len]) {
    for (const u of [-half, half]) {
      const p = [dx * s + nx * u, dy * s + ny * u];
      pts.push([...p, BASE], [...p, NAP(eave)]);
    }
    pts.push([dx * s, dy * s, NAP(ridge)]);
  }
  const roof = Manifold.hull(pts);
  const apseSolid = Manifold.hull([
    ...Array.from({ length: 33 }, (_, i) => {
      const a = (Math.PI * i) / 32 - Math.PI / 2;
      const [cx, cy] = [Math.cos(a), Math.sin(a)];
      const p = [apse[0] + (dx * cx + nx * cy) * radius, apse[1] + (dy * cx + ny * cy) * radius];
      return [[...p, BASE], [...p, NAP(eave)]];
    }).flat(),
    [apse[0] + nx * radius, apse[1] + ny * radius, BASE],
    [apse[0] - nx * radius, apse[1] - ny * radius, BASE],
    [...apse, NAP(ridge)],
  ]);
  return Manifold.union(roof, apseSolid);
}

// ---------- opbouw ----------
const sacristyZone = Manifold.union(SACRISTIES.map(({ x, y }) => box(x, y, BASE - 1, 200)));
const parts = [
  Manifold.intersection(outline.subtract(sacristyZone), box([-100, 100], [-100, 100], BASE, NAP(CORNER_TOP))),
  ...SACRISTIES.map(({ x, y, top }) => Manifold.intersection(outline, box(x, y, BASE, NAP(top)))),
  box(CROSSING.x, CROSSING.y, BASE, NAP(CROSSING.top)),
  Manifold.hull(
    NAVE.y.flatMap((y) => [
      [NAVE.x[0], y, BASE], [NAVE.x[1], y, BASE],
      [NAVE.x[0], y, NAP(NAVE.eave)], [NAVE.x[1], y, NAP(NAVE.eave)],
      [NAVE.axis, y, NAP(NAVE.ridge)],
    ]),
  ),
  Manifold.intersection(outline, box(FACADE.x, FACADE.y, BASE, NAP(FACADE.top))),
  Manifold.hull(
    [FACADE.pediment.front, FACADE.y[1]].flatMap((y) => [
      [FACADE.pediment.x[0], y, NAP(FRONT.attic.top) - 0.01],
      [FACADE.pediment.x[1], y, NAP(FRONT.attic.top) - 0.01],
      [(FACADE.pediment.x[0] + FACADE.pediment.x[1]) / 2, y, NAP(FACADE.pediment.top)],
    ]),
  ),
  ...ARMS.map(arm),
  revolve([[0, BASE], [DOME_PROFILE[0][0], BASE], ...DOME_PROFILE.map(([r, h]) => [r, NAP(h)])]),
];
// ---------- details ----------
const details = [];
const cutouts = [];
// Voorgevel: halfzuilen, kroonlijst, attiek, middenblok en beelden.
for (const sec of FRONT.sections) {
  const { width, depth } = FRONT.column;
  for (const x of sec.columns) {
    details.push(box([x - width / 2, x + width / 2], [sec.front - depth, sec.front + 1], BASE, NAP(FRONT.cornice.bottom)));
  }
  details.push(
    box(sec.x, [sec.front - FRONT.cornice.overhang, sec.front + 1], NAP(FRONT.cornice.bottom), NAP(FRONT.cornice.top)),
  );
  for (const [x, w, top] of sec.arches) cutouts.push(niche([x, sec.front], [0, -1], w, FRONT.archSill, top, 0.8));
}
details.push(
  box(FRONT.attic.x, FRONT.attic.y, BASE, NAP(FRONT.attic.top)),
  box(FRONT.attic.centre.x, [FRONT.attic.centre.front, FRONT.attic.y[1]], BASE, NAP(FRONT.attic.top)),
  box(FRONT.block.x, FRONT.block.y, BASE, NAP(FRONT.block.top)),
  ...STATUES.map(([x, y, top]) => statue([x, y], FRONT.attic.top, top)),
  statue(MAIN_STATUE.slice(0, 2), FRONT.block.top, MAIN_STATUE[2]),
);
// Balustrade met piedestals langs het schip en rond de viering.
for (const xs of NAVE_BALUSTRADE.x) {
  details.push(box(xs, NAVE_BALUSTRADE.y, BASE, NAP(NAVE_BALUSTRADE.top)));
  const x = (xs[0] + xs[1]) / 2;
  for (let y = NAVE_BALUSTRADE.y[0] + 1.5; y < NAVE_BALUSTRADE.y[1]; y += 3.3) {
    details.push(box([x - 0.5, x + 0.5], [y - 0.5, y + 0.5], BASE, NAP(NAVE_BALUSTRADE.piers)));
  }
}
{
  const [x0, x1] = CROSSING.x;
  const [y0, y1] = CROSSING.y;
  const top = NAP(CROSSING_BALUSTRADE);
  details.push(
    box([x0, x1], [y0, y0 + 0.9], BASE, top),
    box([x0, x1], [y1 - 0.9, y1], BASE, top),
    box([x0, x0 + 0.9], [y0, y1], BASE, top),
    box([x1 - 0.9, x1], [y0, y1], BASE, top),
  );
}
// Vensters in de zijgevels van het schip (de westgevel loopt licht schuin).
for (const y of NAVE_WINDOWS.y) {
  const west = -14.1 - ((y + 19.5) / -26.2) * 1.0;
  const east = y < -41.5 ? 10.9 : y < -32.3 ? 11.2 : 11.5;
  cutouts.push(niche([west, y], [-1, 0], NAVE_WINDOWS.width, NAVE_WINDOWS.z[0], NAVE_WINDOWS.z[1], 0.5));
  cutouts.push(niche([east, y], [1, 0], NAVE_WINDOWS.width, NAVE_WINDOWS.z[0], NAVE_WINDOWS.z[1], 0.5));
}
// Drie vensters in elke apsis: recht vooruit en 45 graden opzij.
for (const { dir, apse, radius } of ARMS) {
  const base = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI;
  for (const off of [-45, 0, 45]) {
    const n = polar(1, base + off);
    cutouts.push(niche([apse[0] + n[0] * radius, apse[1] + n[1] * radius], n, APSE_WINDOW.width, APSE_WINDOW.z[0], APSE_WINDOW.z[1], 0.5));
  }
}
// Trommel: steunberen met een schuine kap, vensters ertussen.
for (let k = 0; k < 16; k++) {
  const deg = DRUM.phaseDeg + 22.5 * k;
  const b = DRUM.buttress;
  const [ux, uy] = polar(1, deg);
  const [vx, vy] = [-uy, ux];
  const pts = [];
  for (const side of [-b.width / 2, b.width / 2]) {
    for (const [r, z] of [[b.from, NAP(CROSSING.top) - 1], [b.to, NAP(CROSSING.top) - 1], [b.to, NAP(b.top)], [b.from, NAP(b.cap)]]) {
      pts.push([ux * r + vx * side, uy * r + vy * side, z]);
    }
  }
  details.push(Manifold.hull(pts));
  const wdeg = deg + 11.25;
  cutouts.push(niche(polar(DRUM.core, wdeg), polar(1, wdeg), DRUM.window.width, DRUM.window.z[0], DRUM.window.z[1], 0.5));
}
// Ribben over de koepel: per stuk van het profiel het omhulsel van een strook
// van 0,9 m breed die 0,5 m boven het koepelvlak uitsteekt.
const domeAt = (r) => {
  for (let i = 0; i + 1 < DOME_PROFILE.length; i++) {
    const [r0, z0] = DOME_PROFILE[i];
    const [r1, z1] = DOME_PROFILE[i + 1];
    if (r0 !== r1 && (r - r0) * (r - r1) <= 0) return z0 + ((r - r0) / (r1 - r0)) * (z1 - z0);
  }
  throw new Error(`geen koepelhoogte bij r ${r}`);
};
const ribProfile = DOME_PROFILE.filter(([r]) => r <= RIB.from && r >= RIB.to);
// Normaal per profielpunt (gemiddelde van de aangrenzende stukken, naar buiten
// en omhoog), zodat de stukken van een rib naadloos op elkaar aansluiten.
const segmentNormal = ([r0, z0], [r1, z1]) => {
  const len = Math.hypot(r1 - r0, z1 - z0);
  const n = [(z1 - z0) / len, -(r1 - r0) / len];
  return n[0] < 0 || n[1] < 0 ? [-n[0], -n[1]] : n;
};
const ribNormals = ribProfile.map((_, i) => {
  const ns = [];
  if (i > 0) ns.push(segmentNormal(ribProfile[i - 1], ribProfile[i]));
  if (i + 1 < ribProfile.length) ns.push(segmentNormal(ribProfile[i], ribProfile[i + 1]));
  const [nr, nz] = [ns.reduce((a, n) => a + n[0], 0), ns.reduce((a, n) => a + n[1], 0)];
  const len = Math.hypot(nr, nz);
  return [nr / len, nz / len];
});
for (let k = 0; k < 16; k++) {
  const deg = DRUM.phaseDeg + 22.5 * k;
  const [ux, uy] = polar(1, deg);
  const [vx, vy] = [-uy, ux];
  // Overlappende stukken over drie profielpunten; aan de voet loopt de rib uit
  // in het koepelvlak, zodat hij daar geen ondervlak heeft.
  for (let i = 0; i + 1 < ribProfile.length; i++) {
    const pts = [];
    for (const j of [i, i + 1, i + 2].filter((j) => j < ribProfile.length)) {
      const [r, h] = ribProfile[j];
      const [nr, nz] = ribNormals[j];
      for (const off of [-0.4, j === 0 ? -0.1 : RIB.proud]) {
        const rr = r + nr * off;
        const zz = NAP(h) + nz * off;
        for (const side of [-RIB.width / 2, RIB.width / 2]) pts.push([ux * rr + vx * side, uy * rr + vy * side, zz]);
      }
    }
    details.push(Manifold.hull(pts));
  }
}
// Dakkapellen tussen de ribben.
for (let k = 0; k < 16; k++) {
  const deg = DRUM.phaseDeg + 11.25 + 22.5 * k;
  const [ux, uy] = polar(1, deg);
  const [vx, vy] = [-uy, ux];
  const d = DORMER;
  const pts = [];
  for (const side of [-d.width / 2, d.width / 2]) {
    for (const [r, z] of [[d.front, d.sill], [d.front, d.top], [d.back, d.sill], [d.back, domeAt(d.back) - 0.3]]) {
      pts.push([ux * r + vx * side, uy * r + vy * side, NAP(z)]);
    }
  }
  pts.push([ux * d.front, uy * d.front, NAP(d.apex)]);
  details.push(Manifold.hull(pts));
}
parts.push(...details);
const basilica = Manifold.union(parts).subtract(Manifold.union(cutouts));
const nodes = [["building:basiliek-oudenbosch", basilica]];

// ---------- controles ----------
if (basilica.status() !== "NoError") throw new Error(basilica.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de kroonlijst van de voorgevel hoort erbij.
  const mesh = basilica.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(2);
    levels.set(z, (levels.get(z) ?? 0) + len / 2);
  }
  console.log("ondervlakken (lokale z: m2):", Object.fromEntries(levels));
  const allowed = NAP(FRONT.cornice.bottom).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "basiliek-oudenbosch.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-basiliek-oudenbosch.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `basiliek-oudenbosch-1-${scale}.stl`);
const printSolid = basilica.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Basiliek Oudenbosch 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "basiliek-oudenbosch.json"),
  JSON.stringify(
    {
      name: "Basiliek van de HH. Agatha en Barbara",
      file: "basiliek-oudenbosch.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het lage maaiveld aan de koor-, west- en oostkant (NAP +2,0 tot
      // +3,4 m), niet op het hogere voorplein (+6,0 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.1655100000541882"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong onder het hart van de koepel op RD (95519,15, 400427,87), op het maaiveld aan de koorzijde (NAP +2,0 m), +Y langs de as naar het koor in het noorden (RD-richting 85 graden) en +X naar het oosten; de voorgevel ligt aan de -Y-kant. Eén node building: de voorgevel met halfzuilen, vijf boognissen, de kroonlijst (NAP +29,5 m), de attiek (+34 m) met het fronton (+38 m), het middenblok (+39 m) en elf beelden (tot +42 m); het schip (nok +30,6 m) met balustrade, piedestals en vensternissen; de viering (+31,0 m) met balustrade; de trommel (+45 m) met zestien steunberen en vensters; de koepel (+58,7 m) met zestien ribben en dakkapellen en de lantaarn (+67 m); de drie armen met apsissen en vensters (nok +30,5 m), de hoekvolumes (+27,0 m) en de sacristieën (+13,5 m). Het terrein loopt naar het voorplein op tot NAP +6,0 m; daar zakt de vlakke onderkant in het terrein. Alles staat recht op of wordt naar boven toe smaller, behalve de kroonlijst die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 1655100000541882. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`basiliek-oudenbosch-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        widthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        facadeTopNapM: FRONT.attic.top,
        mainStatueNapM: MAIN_STATUE[2],
        dome: { drumRadiusM: DRUM.core, drumButtressRadiusM: DRUM.buttress.to, drumTopNapM: 45.0, domeTopNapM: 58.7, lanternTopNapM: 67.0, crossNapM: 69.8 },
        groundNapM: { north: GROUND_NAP, forecourt: 6.0 },
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Basiliek_van_de_H.H._Agatha_en_Barbara",
        "PDOK BAG pand 1655100000541882 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: schip, voorgevel, viering, armen, apsissen, radiaal profiel van trommel, koepel en lantaarn, maaiveld",
        "PDOK AHN DSM 0,5 m: pieken van beelden en piedestals, ringen rond de trommel (steunberen) en de koepel (ribben)",
        "PDOK 3D Basisvoorziening gebouwen (LoD2.2), ter vergelijking",
        "Wikimedia Commons: foto's van de voorgevel, de koepel en de trommel (RCE en anderen)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
