// Genereert een vereenvoudigd, gesloten 3D-model van de Waterpoort in Sneek:
// de waterpoort over de Hoogendsterpijp tussen De Kolk en de Stadsgracht
// (circa 1492, in 1613 tot sierpoort verbouwd, in 1877 door Gosschalk
// gerestaureerd). Twee achtkante bakstenen torens met een kraag en een hoge
// achtkante leien spits flankeren het middendeel: onderin de waterboog, daarboven
// de doorloop van het looppad over de waterboog, dwars door het middendeel
// achter de torens met aan elke zijgevel twee bogen, aan de waterzijde de
// galerij met twee kleinere bogen boven een borstwering, en daarop de
// poortwachterswoning met een zadeldak tussen twee trapgevels, aan de
// waterzijde (De Kolk) en de stadszijde. Het water zit in het PDOK-terrein en
// niet in het model. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-waterpoort-sneek.mjs              # 1:1000 (standaard)
//   node scripts/generate-waterpoort-sneek.mjs --scale 200
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en
// spitsen lopen schuin omhoog, de waterboog, de doorloop en de galerijbogen
// hebben een spitse top (de ronde boog gaat op 40 graden over in rechte stukken onder 50
// graden), de kraag onder de spitsen loopt onder 45 graden uit en de
// trapgevels springen telkens 1 m in. Alleen de blinde vensternissen in de
// torens hebben een vlakke bovenkant van 0,35 m diep.
//
// Assenstelsel: oorsprong op RD (173239,79, 560300,33), midden tussen de twee
// torens, op het maaiveld van de kades (NAP +1,0 m), Z omhoog. +X loopt langs
// de torens naar het zuidzuidoosten (RD-richting -60,05 graden, van de
// noordelijke naar de zuidelijke toren), +Y naar het oostnoordoosten: de
// stadszijde met de brug over de gracht. -Y is de waterzijde aan De Kolk.
//
// Bronnen: BAG-pand 0091100000004105 (de poort, met beide torens als achthoek
// van 8 punten); AHN DSM/DTM 0,5 m (PDOK WCS): nok, torens, kades en water;
// Wikipedia; foto's op Wikimedia Commons (waterzijde en stadszijde); PDOK
// luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "waterpoort-sneek");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,0 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [173239.79, 560300.33];
const AXIS_DEG = -60.05;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.0;
const NAP = (h) => h - GROUND_NAP;
// Alles begint op NAP -2,0 m, onder het water van De Kolk (circa NAP -0,5 m).
const BASE = NAP(-2.0);
// Torens: achthoek met de omgeschreven straal uit de BAG-bochten (cirkelfit
// 2,26 en 2,29 m), een hoekpunt op elke as. Romp tot de kraag (AHN-DSM rand
// NAP +12 tot +13 m), kraag onder 45 graden 0,33 m uit, spits tot NAP +24 m
// (foto's: de spits is 0,9 keer zo hoog als de romp; het DSM haalt op 0,5 m
// nog NAP +21,9 m).
const TOWERS = [
  { name: "noord", c: [-5.34, 0], r: 2.27 },
  { name: "zuid", c: [5.34, 0], r: 2.27 },
];
const TOWER = { collar: 11.6, eave: 12.0, out: 0.33, tip: 24.0 };
// Middendeel tussen de torens (BAG): voorgevel op y = 0,3 aan De Kolk, de
// achtergevel scheef van (-2,75, 7,7) naar (4,63, 6,77).
const MIDDLE = [[-3.6, 0.3], [3.6, 0.3], [4.63, 6.77], [-2.75, 7.7]];
// Steil zadeldak met de nok dwars op de torens (langs Y), goot NAP +8,8 m
// (foto's: de kroonlijst net boven de bogen; AHN-DSM aan de dakranden 8,6 tot
// 10,8 m) en nok NAP +13,6 m (AHN-DSM 13 tot 14 m), nok op x = 0,5.
const ROOF = { eave: 8.8, ridge: 13.6, ridgeX: 0.5, half: 4.2 };
// Trapgevels aan beide kanten, 1,0 m dik, treden van 1 m hoog en 1 m in
// (foto's: vier treden tot circa NAP +15 m).
const GABLE = { thick: 1.0, steps: [[3.6, 12.0], [2.6, 13.0], [1.6, 14.0], [0.6, 15.2]] };
// Waterboog over de pijp: 4,2 m breed, top op NAP +2,9 m (kruin
// 3,4 m boven het water, op foto's circa 3,6 m, zodat het dek onder de doorloop
// 0,9 m dik blijft), tot de onderkant open zodat het water uit het
// PDOK-terrein erdoor loopt.
const WATER_ARCH = { x: 0, w: 4.2, apex: 2.9, floor: null };
// Doorloop: het looppad over de waterboog (AHN-DSM NAP +3,2 m aan de buitenkant
// van het middendeel, +3,9 m op de bult achter de poort) loopt langs X dwars
// door het middendeel, achter de torens. Twee bogen naast elkaar van 1,8 m
// breed met een middenpijler van 0,9 m, vloer NAP +3,8 m (een drempel boven
// het looppad), top NAP +7,4 m,
// evenwijdig aan de scheve achtergevel met daarachter een muur van 0,9 m.
const WALKWAY = { w: 1.8, pier: 0.9, back: 0.9, floor: 3.8, apex: 7.4 };
// Galerij aan de waterzijde: twee kleinere bogen van 1,5 m boven de waterboog
// met een middenpijler van 1,0 m,
// met een borstwering tot NAP +4,6 m en de top op NAP +7,0 m, die uitkomen in
// de doorloop.
const GALLERY = [-1.25, 1.25].map((x) => ({ x, w: 1.5, apex: 7.0, floor: 4.6 }));
// Blinde vensters in de torens: nissen van 0,8 m breed en 0,35 m diep in de
// vier buitenste vlakken, op twee verdiepingen.
const WINDOWS = [[3.6, 5.2], [7.4, 9.2]];
// Maaiveld (AHN-DTM NAP +1 tot +2 m): de kade aan De Kolk ten noorden en de
// straat ten zuiden van de poort; niet het water.
const GROUND_SAMPLES = [[-12, 8], [13, 4], [13, 12]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const box = (xr, yr, z0, z1) => prism(rect(xr, yr), z0, z1);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Achthoek met de omgeschreven straal r, hoekpunten op de assen.
const octagon = ([cx, cy], r) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = (45 * k * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
// Doorgang langs Y als boog met spitse top; zonder vloer tot onder de onderkant.
const passage = ({ x, w, apex, floor }, [ya, yb] = [-12, 15]) => {
  const r = w / 2;
  const kink = (40 * Math.PI) / 180;
  const rise = r * Math.cos(kink) * Math.tan((50 * Math.PI) / 180);
  const spring = NAP(apex) - rise - r * Math.sin(kink);
  const z0 = floor === null ? BASE - 1 : NAP(floor);
  const profile = [[x - r, z0], [x + r, z0]];
  for (let k = 0; k <= 8; k++) {
    const a = (kink * k) / 8;
    profile.push([x + r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  profile.push([x, NAP(apex)]);
  for (let k = 8; k >= 0; k--) {
    const a = (kink * k) / 8;
    profile.push([x - r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  const pts = [];
  for (const y of [ya, yb]) for (const [px, z] of profile) pts.push([px, y, z]);
  return { solid: Manifold.hull(pts), spring };
};

// ---------- poort ----------
const middleOutline = prism(MIDDLE, BASE, 100);
const middleBody = prism(MIDDLE, BASE, NAP(ROOF.eave));
const roof = Manifold.intersection(
  Manifold.hull([
    ...[-5, 15].flatMap((y) => [
      [ROOF.ridgeX - ROOF.half, y, NAP(ROOF.eave) - 0.01],
      [ROOF.ridgeX + ROOF.half, y, NAP(ROOF.eave) - 0.01],
      [ROOF.ridgeX, y, NAP(ROOF.ridge)],
    ]),
  ]),
  middleOutline,
);
// Trapgevel: treden als blokken binnen een strook van 1 m langs de voor- of
// achtergevel, afgesneden op de contour van het middendeel.
const gable = (yBand) =>
  Manifold.intersection(
    Manifold.union(GABLE.steps.map(([half, top]) => box([ROOF.ridgeX - half, ROOF.ridgeX + half], yBand, NAP(ROOF.eave) - 0.01, NAP(top)))),
    middleOutline,
  );
const front = gable([0.3, 0.3 + GABLE.thick]);
// Achtergevel: strook van 1 m binnen de scheve achterkant.
const back = (() => {
  const [p1, p2] = [MIDDLE[3], MIDDLE[2]];
  const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  const d = [(p2[0] - p1[0]) / len, (p2[1] - p1[1]) / len];
  const n = [d[1] * GABLE.thick, -d[0] * GABLE.thick];
  const q1 = [p1[0] - 3 * d[0], p1[1] - 3 * d[1]];
  const q2 = [p2[0] + 3 * d[0], p2[1] + 3 * d[1]];
  const band = [[q1[0] + n[0], q1[1] + n[1]], [q2[0] + n[0], q2[1] + n[1]], [q2[0] - n[0], q2[1] - n[1]], [q1[0] - n[0], q1[1] - n[1]]];
  return Manifold.intersection(gable([-20, 20]), prism(band, BASE, 100));
})();
const tower = ({ c, r }) => {
  const body = prism(octagon(c, r), BASE, NAP(TOWER.collar) + 0.01);
  // Kraag onder 45 graden en de rechte rand tot de voet van de spits.
  const collar = Manifold.hull([
    ...at(octagon(c, r), NAP(TOWER.collar)),
    ...at(octagon(c, r + TOWER.out), NAP(TOWER.collar) + TOWER.out),
    ...at(octagon(c, r + TOWER.out), NAP(TOWER.eave)),
  ]);
  const spire = Manifold.hull([...at(octagon(c, r + TOWER.out), NAP(TOWER.eave) - 0.01), [c[0], c[1], NAP(TOWER.tip)]]);
  // Nissen in de vier vlakken die van het middendeel af wijzen.
  const side = Math.sign(c[0]);
  const niches = [];
  const faceAngles = (side > 0 ? [-22.5, 22.5, -67.5, 67.5] : [157.5, 202.5, 112.5, 247.5]).map((d) => (d * Math.PI) / 180);
  const apothem = r * Math.cos(Math.PI / 8);
  for (const fa of faceAngles) {
    for (const [z0, z1] of WINDOWS) {
      const n = box([apothem - 0.35, apothem + 1], [-0.4, 0.4], NAP(z0), NAP(z1)).rotate([0, 0, (fa * 180) / Math.PI]).translate([c[0], c[1], 0]);
      niches.push(n);
    }
  }
  return Manifold.union([body, collar, spire]).subtract(Manifold.union(niches));
};
const waterArch = passage(WATER_ARCH);
// Doorloop langs X: in een stelsel gedraaid naar de achtergevel liggen de twee
// bogen op vaste afstand van die gevel; als doorgang langs Y gebouwd en dan een
// kwartslag plus de hoek van de achtergevel gedraaid.
const backAngle = Math.atan2(MIDDLE[2][1] - MIDDLE[3][1], MIDDLE[2][0] - MIDDLE[3][0]);
const backOffset = -MIDDLE[3][0] * Math.sin(backAngle) + MIDDLE[3][1] * Math.cos(backAngle);
const walkwayCentres = [0, 1].map((k) => backOffset - WALKWAY.back - WALKWAY.w / 2 - k * (WALKWAY.w + WALKWAY.pier));
const walkways = walkwayCentres.map((c) => {
  // Profiel op x = c; na +90 graden draaien ligt de doorgang op y = c.
  const p = passage({ x: c, w: WALKWAY.w, apex: WALKWAY.apex, floor: WALKWAY.floor }, [-15, 15]);
  return { ...p, solid: p.solid.rotate([0, 0, 90 + (backAngle * 180) / Math.PI]) };
});
// De galerijbogen lopen van de waterzijde tot in de voorste doorloop.
const galleries = GALLERY.map((g) => passage(g, [-12, walkwayCentres[1]]));
// De stadszijde (de scheve achtergevel) is ook open: twee bogen van 1,8 m
// breed loodrecht door de achtermuur, in lijn met de doorloop (vloer NAP +3,8
// m, top +7,4 m), op 1,25 m weerszijden van het midden van de muur. Zo is het
// galerijniveau aan vier kanten open: de waterzijde, de stadszijde en de twee
// uiteinden van de doorloop.
const CITY_ARCHES = { xs: [-1.25, 1.25], w: 1.8, apex: 7.4, floor: 3.8 };
const backMid = [(MIDDLE[2][0] + MIDDLE[3][0]) / 2, (MIDDLE[2][1] + MIDDLE[3][1]) / 2];
const cityArches = CITY_ARCHES.xs.map((x) => {
  const p = passage({ x, w: CITY_ARCHES.w, apex: CITY_ARCHES.apex, floor: CITY_ARCHES.floor }, [-4.5, 4]);
  return { ...p, solid: p.solid.rotate([0, 0, (backAngle * 180) / Math.PI]).translate([backMid[0], backMid[1], 0]) };
});
const middle = Manifold.union([middleBody, roof, front, back])
  .subtract(waterArch.solid)
  .subtract(Manifold.union([...walkways, ...galleries, ...cityArches].map((g) => g.solid)));
const gate = Manifold.union([middle, ...TOWERS.map(tower)]);

const nodes = [["building:poort", gate]];
const all = gate;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de bovenkanten van de vensternissen en de galerijvloer.
  const allowed = new Set([...WINDOWS.map(([, z1]) => NAP(z1).toFixed(2))]);
  for (const [name, solid] of nodes) {
    const mesh = solid.getMesh();
    const v = mesh.vertProperties;
    const s = mesh.numProp;
    const levels = new Map();
    const where = new Map();
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
      if (!allowed.has(z)) where.set(z, [0, 1].map((a) => +((p[0][a] + p[1][a] + p[2][a]) / 3).toFixed(2)));
    }
    console.log(`${name}: ondervlakken (lokale z: m2)`, Object.fromEntries(levels));
    for (const [z, area] of levels) if (!allowed.has(z) && area > 0.01) throw new Error(`${name}: overhang op z ${z} bij x, y ${where.get(z)}`);
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  }
  console.log("aanzet waterboog NAP", +(waterArch.spring + GROUND_NAP).toFixed(2), "galerij NAP", +(galleries[0].spring + GROUND_NAP).toFixed(2), "doorloop NAP", +(walkways[0].spring + GROUND_NAP).toFixed(2));
  console.log("doorloop: hoek", +((backAngle * 180) / Math.PI).toFixed(2), "middens loodrecht op de achtergevel", walkwayCentres.map((c) => +c.toFixed(2)));
}
// Het galerijniveau (NAP +5,5 m) is aan vier kanten open: een vrije doorgang
// van de waterzijde naar de stadszijde (langs de bogen) en een vrije doorgang
// van de westkant naar de oostkant (door de doorloop).
{
  const polys = gate.slice(NAP(5.5)).toPolygons();
  const solidAt = (x, y) => {
    let hits = 0;
    for (const poly of polys) {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) hits++;
    }
    return hits % 2 === 1;
  };
  const freeLine = (from, to) => {
    for (let t = 0; t <= 1; t += 0.01) if (solidAt(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t)) return false;
    return true;
  };
  // Doorgang van het water naar de stad: loodrecht op de achtermuur door een
  // boog (u = 1,25 van het midden) en door de galerijboog erachter.
  const d = [Math.cos(backAngle), Math.sin(backAngle)];
  const n = [-d[1], d[0]];
  const through = (u) => freeLine([backMid[0] + d[0] * u - n[0] * 9, backMid[1] + d[1] * u - n[1] * 9], [backMid[0] + d[0] * u + n[0] * 6, backMid[1] + d[1] * u + n[1] * 6]);
  const sides = {
    "water-stad": CITY_ARCHES.xs.some((u) => through(u)),
    "west-oost": walkwayCentres.some((c) => freeLine([backMid[0] - d[0] * 12 + n[0] * c, backMid[1] - d[1] * 12 + n[1] * c], [backMid[0] + d[0] * 12 + n[0] * c, backMid[1] + d[1] * 12 + n[1] * c])),
  };
  console.log("open op galerijniveau:", sides);
  if (!sides["west-oost"]) console.log("let op: de doorloop is aan een uiteinde dicht (toren)");
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
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "waterpoort-sneek.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-waterpoort-sneek.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `waterpoort-sneek-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Waterpoort Sneek 1:${scale} mm Z-up`);
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

const gateBox = gate.boundingBox();
await writeFile(
  path.join(outDir, "waterpoort-sneek.json"),
  JSON.stringify(
    {
      name: "Waterpoort",
      file: "waterpoort-sneek.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0 in plaats van -0,3: de muren beginnen al onder het water en de
      // waterboog is tot de onderkant open.
      groundOffsetMetres: 0,
      // Op de kade aan De Kolk en de straat ten zuiden van de poort (NAP +1 tot
      // +2 m), niet in het water.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0091100000004105"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (173239,79, 560300,33), midden tussen de twee torens, op het maaiveld van de kades (NAP +1,0 m), +X langs de torens naar het zuidzuidoosten (-60,05 graden vanaf het oosten) en +Y naar het oostnoordoosten, de stadszijde; -Y is de waterzijde aan De Kolk. Eén node building:poort met twee achtkante torens (straal 2,27 m) met blinde vensters, een kraag van 45 graden op NAP +11,6 m en een achtkante spits tot NAP +24 m, en daartussen het middendeel met de waterboog van 4,2 m breed (spitse top op NAP +2,9 m), de doorloop van het looppad langs X achter de torens met aan elke zijgevel twee bogen van 1,8 m (vloer NAP +3,8 m, top +7,4 m), aan de waterzijde de galerij met twee kleinere bogen van 1,5 m boven een borstwering (+4,6 m, top +7,0 m) die in de doorloop uitkomen, en de poortwachterswoning met een steil zadeldak (goot +8,8 m, nok +13,6 m) tussen twee trapgevels tot NAP +15,2 m. Alles begint op NAP -2,0 m, onder het water, dat in het PDOK-terrein zit; de waterboog is tot de onderkant open. Alles staat recht op of loopt schuin omhoog, behalve de vlakke bovenkant van de vensternissen, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand van de poort. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`waterpoort-sneek-1-${scale}.stl`],
      realWorld: {
        lengthM: +(gateBox.max[0] - gateBox.min[0]).toFixed(2),
        widthM: +(gateBox.max[1] - gateBox.min[1]).toFixed(2),
        highestPointNapM: +(gateBox.max[2] + GROUND_NAP).toFixed(2),
        towerRadiusM: TOWERS[0].r,
        towerCollarNapM: TOWER.collar,
        spireTipNapM: TOWER.tip,
        roofEaveNapM: ROOF.eave,
        roofRidgeNapM: ROOF.ridge,
        gableTopNapM: GABLE.steps.at(-1)[1],
        waterArchWidthM: WATER_ARCH.w,
        waterArchApexNapM: WATER_ARCH.apex,
        galleryArchWidthM: GALLERY[0].w,
        galleryFloorNapM: GALLERY[0].floor,
        galleryApexNapM: GALLERY[0].apex,
        walkwayArchWidthM: WALKWAY.w,
        walkwayFloorNapM: WALKWAY.floor,
        walkwayApexNapM: WALKWAY.apex,
        groundNapM: GROUND_NAP,
        waterNapM: -0.5,
        baseNapM: -2.0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Waterpoort_(Sneek)",
        "PDOK BAG pand 0091100000004105 (de poort met beide torens), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: nok, torens, kades en water",
        "Straatfoto vanaf het looppad op de westoever (Google Maps, Rob Groenen, september 2020) en foto vanaf De Kolk, aangeleverd door de gebruiker: doorloop en galerijbogen",
        "Wikimedia Commons: Sneek Waterpoort 06.jpg, Waterpoort Sneek 1.jpg (waterzijde); Waterpoort, stadszicht - Sneek - 20201723 - RCE.jpg, Sneek, watergate.jpg, 20190529 Waterpoort1 Sneek.jpg (stadszijde)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
