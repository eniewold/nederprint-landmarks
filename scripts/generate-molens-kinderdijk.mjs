// Genereert vereenvoudigde, gesloten 3D-modellen van de negentien molens van
// Kinderdijk (Werelderfgoed): de acht ronde stenen grondzeilers van de
// Nederwaard (1738), de acht achtkante grondzeilers van de Overwaard (1740),
// de Hoge en de Kleine Molen van Nieuw-Lekkerland (1740 en 1761) en de
// wipmolen De Blokker van de Blokweer (Alblasserdam). Elke molen heeft een
// romp, een kap, een staart naar het maaiveld en een wiekenkruis als dikke
// plaat in X-stand. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per molen met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met alle molens
// naast elkaar en een printsteun onder de onderste wiekpunten.
//
//   node scripts/generate-molens-kinderdijk.mjs              # 1:1000 (standaard)
//   node scripts/generate-molens-kinderdijk.mjs --scale 500
//
// Assenstelsel: oorsprong centraal tussen de molengangen van de Nederwaard en
// de Overwaard (RD 104070, 432835), Z omhoog, +X naar het oosten en +Y naar het
// noorden (de assen van RD; geen draaiing). z = 0 ligt op het water van de
// boezem van de Nederwaard, het vlakke peil waarop het maaiveld bemonsterd
// wordt (NAP -1,10 m volgens het PDOK-terrein).
//
// Bronnen: BAG (pand-id, bouwjaar en contour per molen: de rondgang van 21 tot
// 24 hoekpunten bij de Nederwaard, de achtkanten van de Overwaard, het
// vierkant van de wipmolen); AHN DSM 0,5 m (PDOK WCS) voor de kaphoogte, de
// romp per hoogte, de richting van de as (het wiekenvlak ligt als een lijn in
// het DSM) en de afstand van het wiekenvlak tot de romp; het PDOK-terrein voor
// de voet van elke molen en het peil van de boezem; Wikipedia voor de vlucht
// (Nederwaard 27,5 tot 28 m, Overwaard 28,6 tot 29,5 m) en de typen;
// Wikimedia Commons-foto's voor de vorm van romp, kap en staart.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molens-kinderdijk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const hull = (points) => Manifold.hull(points);
const deg = Math.PI / 180;
// Regelmatige veelhoek (straal tot de hoekpunten) in het XY-vlak.
const ring = (n, r, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot * deg + (2 * Math.PI * i) / n;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Afgeknotte piramide/kegel tussen twee veelhoeken op z0 en z1.
const frustum = (bottom, z0, top, z1) => hull([...at(bottom, z0), ...at(top, z1)]);
// Doos in lokale coördinaten (u langs de as, v dwars, z omhoog).
const box = (u0, u1, v0, v1, z0, z1) => {
  const pts = [];
  for (const u of [u0, u1]) for (const v of [v0, v1]) for (const z of [z0, z1]) pts.push([u, v, z]);
  return pts;
};

// ---------- maten per type ----------
// Hoogtes boven de voet (het maaiveld bij de molen). Romp en kap uit het AHN
// (gemiddelde van de molens waarvan het DSM de kap zonder wiek erboven toont),
// vlucht uit Wikipedia (Nederwaard en Overwaard) of geschat.
const TYPES = {
  // Ronde stenen grondzeiler (Nederwaard): romp van baksteen, rietgedekte kap.
  rond: { rompTop: 12.5, rTop: 3.3, kapTop: 15.9, as: 13.9, vlucht: 27.8, kapBack: 3.4, kapFront: 3.45 },
  // Achtkante grondzeiler (Overwaard): stenen voet en rietgedekt achtkant.
  achtkant: { voet: 1.0, rompTop: 13.2, aTop: 3.2, kapTop: 16.1, as: 14.1, vlucht: 29.0, kapBack: 3.4, kapFront: 3.45 },
  hoog: { voet: 1.0, rompTop: 13.4, aTop: 3.3, kapTop: 16.3, as: 14.3, vlucht: 28.0, kapBack: 3.4, kapFront: 3.45 },
  klein: { voet: 1.0, rompTop: 12.6, aTop: 3.0, kapTop: 15.4, as: 13.4, vlucht: 27.0, kapBack: 3.2, kapFront: 3.45 },
  // Wipmolen (De Blokker): rietgedekte ondertoren en draaibaar bovenhuis.
  wip: { torenTop: 7.0, torenTopHalf: 1.3, huisBottom: 9.0, huisTop: 13.2, nok: 14.9, huisHalfU: 2.5, huisHalfV: 1.7, as: 12.9, vlucht: 25.0 },
};
// Wiekenkruis: platen van 2,4 m breed en 1,0 m dik, in X-stand onder 50 graden
// met de horizontaal (zo hangen de ondervlakken van de schuine wieken onder
// 50 graden en niet vlakker dan 45). Het midden van de plaat ligt 4,4 m voor de
// rompas (het wiekenvlak in het AHN ligt 3,6 tot 4,7 m voor de romp), zodat de
// onderste wieken vrij van het achtkant blijven; bij de wipmolen 3,1 m. De kap
// houdt 5 cm afstand tot de plaat; de as verbindt ze.
const WIEK = { breedte: 2.4, dikte: 1.0, hoek: 50, vlak: 4.4, vlakWip: 3.1 };
// Staart: balk van 0,9 m van de achterkant van de kap naar het maaiveld,
// 3,5 m achter de romp.
const STAART = { dikte: 0.9, uit: 3.5 };
// Fundering: elke molen loopt 1,5 m onder zijn voet door, zodat hij op een
// iets afwijkend maaiveld niet zweeft. Dat is de vlakke onderkant per molen.
const FUNDERING = 1.5;

// ---------- de molens ----------
// Hart van de BAG-contour (lokale x, y), voet boven het boezempeil (PDOK),
// oppervlakte van de BAG-contour, draaiing van het achtkant of vierkant (BAG),
// richting van de as naar de wieken (graden linksom vanaf het oosten, AHN) en
// het bemonsteringspunt op het water van de Nederwaardboezem.
const MILLS = [
  { label: "Nederwaard 1", pand: "0571100000001018", type: "rond", c: [-559.25, 336.31], foot: 1.95, area: 83.9, as: -119, sample: [-541.5, 339.5] },
  { label: "Nederwaard 2", pand: "0571100000001581", type: "rond", c: [-516.4, 190.96], foot: 2.32, area: 81.1, as: -142, sample: [-496.5, 187.5] },
  { label: "Nederwaard 3", pand: "0571100000000241", type: "rond", c: [-417.71, 81.86], foot: 2.3, area: 88.8, as: -140, sample: [-401.5, 78.5] },
  { label: "Nederwaard 4", pand: "0571100000000460", type: "rond", c: [-384.23, -55.89], foot: 2.12, area: 86.3, as: -127, sample: [-369.5, -59.5] },
  { label: "Nederwaard 5", pand: "0571100000001489", type: "rond", c: [-282.82, -169.51], foot: 2.08, area: 81.3, as: -101, sample: [-279.5, -183.5] },
  { label: "Nederwaard 6", pand: "0571100000000418", type: "rond", c: [-445.6, -202.47], foot: 1.97, area: 87.1, as: -109, sample: [-434.5, -214.5] },
  { label: "Nederwaard 7", pand: "0571100000000105", type: "rond", c: [-545.2, -290.39], foot: 2.05, area: 85.3, as: -77, sample: [-532.5, -302.5] },
  { label: "Nederwaard 8", pand: "0571100000001406", type: "rond", c: [-600.62, -400.34], foot: 1.92, area: 70.6, as: 143, sample: [-587.5, -409.5] },
  { label: "Overwaard 1", pand: "0571100000000222", type: "achtkant", c: [-342.8, 280.6], foot: 2.22, area: 82, rot: 36.2, as: -129, sample: [-442.5, 233.5] },
  { label: "Overwaard 2", pand: "0571100000001592", type: "achtkant", c: [-206.94, 24.96], foot: 2.24, area: 80.7, rot: 42.8, as: -88, sample: [-304.5, -23.5] },
  { label: "Overwaard 3", pand: "0571100000001583", type: "achtkant", c: [-127.67, -121.64], foot: 2.51, area: 81.0, rot: 34.2, as: 163, sample: [-219.5, -179.5] },
  { label: "Overwaard 4", pand: "0571100000000462", type: "achtkant", c: [-48.58, -243.17], foot: 2.49, area: 86.2, rot: 9.9, as: -145, sample: [-74.5, -314.5] },
  { label: "Overwaard 5", pand: "0571100000001129", type: "achtkant", c: [112.62, -290.54], foot: 2.21, area: 82.1, rot: 20.7, as: -135, sample: [75.5, -366.5] },
  { label: "Overwaard 6", pand: "0571100000000125", type: "achtkant", c: [280.51, -345.67], foot: 2.14, area: 84.4, rot: 13.6, as: -153, sample: [249.5, -424.5] },
  { label: "Overwaard 7", pand: "0571100000000969", type: "achtkant", c: [441.09, -402.06], foot: 2.15, area: 75.9, rot: 1.8, as: -124, sample: [417.5, -486.5] },
  { label: "Overwaard 8", pand: "0571100000000514", type: "achtkant", c: [599.62, -460.99], foot: 2.12, area: 76.7, rot: 29.8, as: -132, sample: [556.5, -534.5] },
  // Hoge Molen: de BAG-contour (62 m²) is kleiner dan de romp in het AHN; als
  // de molens van de Overwaard aangenomen.
  { label: "Hoge Molen", pand: "0571100000001196", type: "hoog", c: [111.59, 457.69], foot: 2.56, area: 82, rot: 2.5, as: 167 },
  // Kleine Molen: de BAG-contour bevat een aanbouw; achtkant uit het AHN.
  { label: "Kleine Molen", pand: "0571100000000668", type: "klein", c: [310.0, 230.6], foot: 0.78, area: 70, rot: 40.4, as: -84 },
  { label: "Blokweer", pand: "0482100001254237", type: "wip", c: [-73.48, -366.08], foot: 0.73, area: 58.0, rot: 76.0, as: -161, sample: [-73.5, -351.5] },
];

// ---------- één molen in lokale coördinaten ----------
// u langs de as naar de wieken, v 90 graden linksom, z absoluut (boven het
// boezempeil); daarna gedraaid naar de asrichting en verschoven naar het hart.
function wieken(t, foot, vlak) {
  const R = t.vlucht / 2;
  const zAs = foot + t.as;
  const u0 = vlak - WIEK.dikte / 2;
  const u1 = vlak + WIEK.dikte / 2;
  const half = WIEK.breedte / 2;
  const arms = [];
  const tips = [];
  for (const a of [WIEK.hoek, 180 - WIEK.hoek, 180 + WIEK.hoek, 360 - WIEK.hoek]) {
    const d = [Math.cos(a * deg), Math.sin(a * deg)];
    const n = [-d[1], d[0]];
    const corners = [
      [-half * n[0], -half * n[1]],
      [half * n[0], half * n[1]],
      [R * d[0] + half * n[0], R * d[1] + half * n[1]],
      [R * d[0] - half * n[0], R * d[1] - half * n[1]],
    ].map(([v, z]) => [v, z + zAs]);
    arms.push(hull(corners.flatMap(([v, z]) => [[u0, v, z], [u1, v, z]])));
    if (d[1] < 0) tips.push({ corners: corners.slice(2), d });
  }
  return { cross: union(arms), tips, zAs, u0, u1 };
}

// Staart van de achterkant van de kap naar het maaiveld, met een paal tot de
// onderkant.
function staart(uTop, zTop, uFoot, foot, base) {
  const h = STAART.dikte / 2;
  return union([
    hull([...box(uTop - h, uTop + h, -h, h, zTop - h, zTop + h), ...box(uFoot - h, uFoot + h, -h, h, foot, foot + STAART.dikte)]),
    hull(box(uFoot - h, uFoot + h, -h, h, base, foot + STAART.dikte)),
  ]);
}

// Kap: van de bovenkant van de romp met een schuine onderrand (50 graden)
// naar een langwerpige onderkant en dan als gebogen rieten kap naar de nok.
function kap(top, rTop, t, foot) {
  const z0 = foot + t.rompTop;
  const z1 = z0 + 0.6;
  const zn = foot + t.kapTop;
  const w = rTop + 0.15;
  const stadium = [];
  for (let i = 0; i <= 8; i++) {
    const a = -90 + (180 * i) / 8;
    stadium.push([t.kapFront - w + w * Math.cos(a * deg), w * Math.sin(a * deg)]);
    stadium.push([-t.kapBack + w - w * Math.cos(a * deg), w * Math.sin(a * deg)]);
  }
  const mid = stadium.map(([u, v]) => [u * 0.92, v * 0.78]);
  return hull([
    ...at(top, z0),
    ...at(stadium, z1),
    ...at(mid, z0 + 0.55 * (zn - z0)),
    ...box(-t.kapBack + 1.0, t.kapFront - 1.2, -0.4, 0.4, zn - 0.01, zn),
  ]);
}

// As: van binnen de kap naar de wiekenplaat, met een schuine onderkant (53
// graden).
function asBlok(zAs, u1) {
  return hull([...box(1.8, 1.9, -0.7, 0.7, zAs - 3.2, zAs + 0.7), ...box(u1 - 0.6, u1, -0.7, 0.7, zAs - 0.7, zAs + 0.7)]);
}

function buildMill(mill) {
  const t = TYPES[mill.type];
  const foot = mill.foot;
  const base = foot - FUNDERING;
  const parts = [];
  let rotPlan = 0;
  let rTop;
  let rBase;
  if (mill.type === "rond") {
    // Romp als afgeknotte kegel op de straal van de BAG-contour.
    rBase = Math.sqrt(mill.area / Math.PI);
    rTop = t.rTop;
    const n = 48;
    parts.push(frustum(ring(n, rBase), base, ring(n, rBase), foot));
    parts.push(frustum(ring(n, rBase), foot, ring(n, rTop), foot + t.rompTop));
    parts.push(kap(ring(n, rTop), rTop, t, foot));
  } else if (mill.type === "wip") {
    // Ondertoren: vierkante piramide op de BAG-contour, bovenhuis met een
    // schuine onderkant (50 graden) en een zadeldak met de nok langs de as.
    const half = Math.sqrt(mill.area) / 2;
    rBase = half;
    const sq = (h) => ring(4, h * Math.SQRT2, mill.rot + 45 - mill.as);
    parts.push(frustum(sq(half), base, sq(half), foot));
    parts.push(frustum(sq(half), foot, sq(t.torenTopHalf), foot + t.torenTop));
    const hu = t.huisHalfU;
    const hv = t.huisHalfV;
    parts.push(
      hull([
        ...at(sq(t.torenTopHalf), foot + t.torenTop - 0.01),
        ...box(-hu, hu, -hv, hv, foot + t.huisBottom, foot + t.huisTop),
        ...box(-hu, hu, -0.3, 0.3, foot + t.nok - 0.01, foot + t.nok),
      ]),
    );
    rTop = hu;
  } else {
    // Achtkant: stenen voet (iets breder), rietgedekt achtkant naar de kap.
    const apothem = Math.sqrt(mill.area / (8 * Math.tan(22.5 * deg)));
    const toR = (a) => a / Math.cos(22.5 * deg);
    rotPlan = mill.rot + 22.5 - mill.as;
    const oct = (a) => ring(8, toR(a), rotPlan);
    rBase = apothem;
    rTop = t.aTop;
    parts.push(frustum(oct(apothem + 0.15), base, oct(apothem + 0.15), foot + t.voet));
    parts.push(frustum(oct(apothem), foot + t.voet - 0.01, oct(t.aTop), foot + t.rompTop));
    parts.push(kap(oct(t.aTop), toR(t.aTop), t, foot));
  }
  const vlak = mill.type === "wip" ? WIEK.vlakWip : WIEK.vlak;
  const w = wieken(t, foot, vlak);
  parts.push(w.cross, asBlok(w.zAs, w.u0 + 0.3));
  // Staart vanaf de achterkant van de kap (of het bovenhuis).
  const zTop = mill.type === "wip" ? foot + t.huisBottom + 0.6 : foot + t.rompTop + 0.6;
  const uTop = mill.type === "wip" ? -t.huisHalfU + 0.5 : -t.kapBack + 0.8;
  parts.push(staart(uTop, zTop, -(rBase + STAART.uit), foot, base));
  const local = union(parts);
  // Printsteun onder de punten van de onderste wieken (alleen in de STL):
  // de punt recht naar beneden doorgetrokken tot de onderkant.
  const steun = union(
    w.tips.map(({ corners, d }) => {
      const pts = corners.flatMap(([v, z]) => [-0.3, 0.05].map((k) => [v + k * d[0], z + k * d[1]]));
      return hull(pts.flatMap(([v, z]) => [[w.u0, v, z], [w.u1, v, z], [w.u0, v, base], [w.u1, v, base]]));
    }),
  );
  const place = (s) => s.rotate([0, 0, mill.as]).translate([mill.c[0], mill.c[1], 0]);
  return {
    mill,
    t,
    base,
    zAs: w.zAs,
    lowTipZ: Math.min(...w.tips.flatMap(({ corners }) => corners.map(([, z]) => z))),
    local,
    localPrint: union([local, steun]),
    solid: place(local),
    rBase,
  };
}

const built = MILLS.map(buildMill);
const parts = built.map((b) => [`building:${b.mill.label}`, b.solid]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant van de
// molen: in het model alleen de punten van de onderste wieken (op 1:1000 vult
// de export daaronder een paaltje op), in de printversie geen.
function overhangs(solid, base) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < base + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    found.push(p);
  }
  return { area, found };
}
for (const b of built) {
  for (const [name, solid] of [["model", b.local], ["print", b.localPrint]]) {
    if (solid.status() !== "NoError") throw new Error(`${b.mill.label} ${name}: ${solid.status()}`);
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - b.base) > 1e-6) throw new Error(`${b.mill.label} ${name}: onderkant op ${bb.min[2]}`);
  }
  const { area, found } = overhangs(b.local, b.base);
  for (const p of found) {
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (zMid > b.lowTipZ + 2.2) {
      throw new Error(`${b.mill.label}: overhang buiten de wiekpunten op z ${zMid.toFixed(2)}: ${JSON.stringify(p.map((q) => q.map((c) => +c.toFixed(2))))}`);
    }
  }
  if (area > 6) throw new Error(`${b.mill.label}: te veel overhang (${area.toFixed(1)} m2)`);
  const print = overhangs(b.localPrint, b.base);
  if (print.area > 0.05) throw new Error(`${b.mill.label}: printversie heeft overhang (${print.area.toFixed(2)} m2)`);
  b.tipOverhang = +area.toFixed(2);
  if (b.lowTipZ < b.mill.foot + 1) throw new Error(`${b.mill.label}: onderste wiek bij het maaiveld`);
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
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
const report = { molens: {} };
for (const b of built) {
  const bb = b.solid.boundingBox();
  report.molens[b.mill.label] = {
    status: b.solid.status(),
    genus: b.solid.genus(),
    triangles: b.solid.numTri(),
    volumeM3: Math.round(b.solid.volume()),
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
    hoogteBovenVoet: +(bb.max[2] - b.mill.foot).toFixed(2),
    asBovenVoet: +(b.zAs - b.mill.foot).toFixed(2),
    wiekpuntBovenVoet: +(b.lowTipZ - b.mill.foot).toFixed(2),
    wiekpuntOverhangM2: b.tipOverhang,
  };
}
const glbFile = path.join(outDir, "molens-kinderdijk.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-molens-kinderdijk.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL zet alle molens naast elkaar op het printbed (vijf per rij, het
// wiekenvlak langs X), elk met de onderkant van zijn fundering op z = 0 en een
// printsteun onder de onderste wiekpunten.
const PITCH = [34, 24];
const printSolid = union(
  built.map((b, i) =>
    b.localPrint
      .rotate([0, 0, 90])
      .translate([(i % 5) * PITCH[0], -Math.floor(i / 5) * PITCH[1], -b.base]),
  ),
);
const stlName = `molens-kinderdijk-1-${scale}.stl`;
const { buffer, triangles } = toStl(printSolid, `NederPrint Molens van Kinderdijk 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
const samplePoints = MILLS.filter((m) => m.sample).map((m) => m.sample);
await writeFile(
  path.join(outDir, "molens-kinderdijk.json"),
  JSON.stringify(
    {
      name: "Molens van Kinderdijk",
      file: "molens-kinderdijk.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [104070, 432835],
      xAxis: [1, 0],
      groundOffsetMetres: 0,
      // Op het water van de Nederwaardboezem bij elke molen van de Nederwaard,
      // de Overwaard en de Blokweer: overal hetzelfde vlakke peil.
      groundSamplePoints: samplePoints,
      // PDOK-hoogte van dat peil, voor een uitsnede zonder een van die punten.
      groundHeight: 42.49,
      replacesBuildings: MILLS.map((m) => `NL.IMBAG.Pand.${m.pand}`),
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong centraal tussen de molengangen van de Nederwaard en de Overwaard (RD 104070, 432835) op het water van de Nederwaardboezem (z = 0, NAP -1,10 m volgens het PDOK-terrein), +X naar het oosten en +Y naar het noorden. Negentien nodes building:<molen>, één per molen: de acht ronde stenen grondzeilers van de Nederwaard aan de westkant (twee gangen langs de boezem, nummer 1 in het noorden), de acht achtkante grondzeilers van de Overwaard aan de oostkant (nummer 1 in het noorden, nummer 8 in het zuidoosten), de Hoge en de Kleine Molen van Nieuw-Lekkerland in het noordoosten en de wipmolen De Blokker van de Blokweer in het zuiden. Elke molen staat op zijn eigen voet (PDOK-maaiveld, z = 0,7 tot 2,6 m) met een fundering tot 1,5 m daaronder, en heeft een romp (kegel of achtkant op de BAG-contour), een rietgedekte kap, een staart naar het maaiveld en een wiekenkruis als plaat van 1,0 m dik en 2,4 m breed in X-stand onder 50 graden, voor de kap in de richting van de as uit het AHN. Het maaiveld wordt op het water van de Nederwaardboezem bemonsterd. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        molens: MILLS.length,
        vluchtM: Object.fromEntries(Object.entries(TYPES).map(([k, t]) => [k, t.vlucht])),
        kapBovenVoetM: Object.fromEntries(Object.entries(TYPES).map(([k, t]) => [k, t.kapTop ?? t.nok])),
        asBovenVoetM: Object.fromEntries(Object.entries(TYPES).map(([k, t]) => [k, t.as])),
        wiekStandGraden: WIEK.hoek,
        wiekPlaatM: { breedte: WIEK.breedte, dikte: WIEK.dikte },
        boezempeilNapM: -1.1,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Kinderdijkse_molens",
        "https://en.wikipedia.org/wiki/Kinderdijk_windmills",
        "PDOK BAG (panden en adressen van de negentien molens), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor romp, kap, asrichting en wiekenvlak",
        "PDOK 3D Basisvoorziening-terrein voor de voet per molen en het boezempeil",
        "Wikimedia Commons: Kinderdijk - Molen Nederwaard 3.jpg, Kinderdijk, Overwaard molens no8tm3 RM30558tm3 en Nederwaard molens no5en4 RM30547+6 IMG 9372 2021-06-13 11.20.jpg, Wipmolen van de Blokweer, van de polder Alblasserdam - Kinderdijk - 20125314 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
