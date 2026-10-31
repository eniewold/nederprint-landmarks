// Xavier (Zuidas, Amsterdam, KENK architecten, 2016–2019): woongebouw van 159 appartementen in een U-vorm
// aan de Gustav Mahlerlaan. Voorop een woontoren van 21 verdiepingen in donkere baksteen, opgebouwd uit drie
// gestapelde blokken die naar boven toe insnoeren (elke overgang een stoere rand met terras) en een kroon
// van vier lagen met getrapte terrassen op de zuidhoeken; achterop, aan de George Gershwinlaan, twee lagere
// woonvleugels van zes lagen met verspringende balkons, verbonden door een onderbouw rond een binnenhof.
// Contouren uit de BAG, blokranden uit het AHN-DSM rond de gevels (de blokken kragen tot 2 m buiten de
// BAG-contour van de begane grond uit), kroon- en vleugelhoogtes uit de 3D BAG (AHN5), gevelindeling uit foto's.
import { Manifold, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "xavier-amsterdam";
// RD-assen: u naar het oosten, v naar het noorden; oorsprong midden in het complex (tussen toren en vleugels).
const ORIGIN = [120123.6, 483277.0];
const AXIS = [1, 0];
const GROUND = -0.68; // NAP, maaiveld (3D BAG -0,68; AHN-DTM rond het pand -0,67)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
// Rechthoek in RD (west, zuid, oost, noord) naar het lokale stelsel, linksom.
const R = (w, s, e, n) => [[w - ORIGIN[0], s - ORIGIN[1]], [e - ORIGIN[0], s - ORIGIN[1]], [e - ORIGIN[0], n - ORIGIN[1]], [w - ORIGIN[0], n - ORIGIN[1]]];
const block = (rect, z0, z1) => prism(rect, z0, z1);

// ---------- Toren: verdiepingen (NAP) ----------
// Terrassen van de kroon op 59,7 / 63,0 / 66,3 / 69,6 (3D BAG) geven een verdiepingshoogte van 3,3 m;
// begane grond tot +3,6, eerste verdieping (bovenkant plint) tot +6,9.
const STOREY = 3.3;
const level = (n) => 3.6 + STOREY * (n - 1); // vloer van verdieping n (n ≥ 1)
const ROOF = 73.6; // hoofddak, 70e percentiel 3D BAG (AHN-DSM 73,6–73,8)
const UPSTAND = 74.6; // L-vormige installatieschermen op het dak (3D BAG 74,5–74,7)
const B1_TOP = level(10); // +33,3: bovenkant blok 1 (verdiepingen 2–9)
const B2_TOP = level(15); // +49,8: bovenkant blok 2 (10–14)
const B3_TOP = level(18); // +59,7: bovenkant blok 3 (15–17), voet van de kroon (18–21)
const PLINTH_TOP = level(2); // +6,9
const RIM = 0.4; // uitsteek van de randen boven de blokken (foto's)

// ---------- Toren: plattegronden (RD) ----------
// Begane grond: BAG-contour x 120101,1–120146,1, y tot 483304,1. De blokken erboven kragen uit; hun gevels uit
// de buitenste DSM-cellen per hoogteklasse (mediaan over de gevel).
const PLINTH = R(120099.4, 483283.6, 120147.9, 483306.1); // rand met hekwerk boven de plint (DSM 5–12 m)
const B1 = R(120099.5, 483285.5, 120147.6, 483305.6);
const B2 = R(120100.1, 483285.5, 120147.6, 483304.8);
const B3 = R(120101.3, 483285.5, 120146.6, 483303.9);
// Kroon (verdiepingen 18–21) met de terrassen uit de 3D BAG.
const CW = 120101.6, CE = 120145.9, CS = 483285.9, CN = 483303.2;
const CROWN = [
  [R(CW, CS, 120108.8, 483289.4), level(19)], // zuidwestterras +63,0
  [R(CW, 483289.4, 120108.8, 483293.0), level(20)], // +66,3
  [R(CW, 483293.0, 120108.8, CN), level(21)], // westrand +69,6
  [R(120138.6, CS, CE, 483289.5), level(19)], // zuidoostterras +63,0
  [R(120138.6, 483289.5, CE, 483292.6), level(20)],
  [R(120138.6, 483292.6, CE, CN), level(21)],
  [R(120117.6, CS, 120131.2, 483287.8), level(20)], // terras midden zuid +66,3
  [R(120117.6, 483287.8, 120131.2, 483290.8), level(21)], // +69,6
  [R(120108.8, CS, 120117.6, 483290.8), ROOF], // westelijk kroonblok tot de zuidgevel
  [R(120131.2, CS, 120138.6, 483290.8), ROOF], // oostelijk kroonblok
  [R(120108.8, 483290.8, 120138.6, CN), ROOF], // hoofddak
];
const ROOF_NOTCH = R(120125.5, 483302.0, 120130.7, CN + 1); // loggia in de bovenste laag aan de noordgevel (+69,4)
const UPSTANDS = [
  R(120114.0, 483296.2, 120116.2, 483302.8), R(120109.0, 483296.2, 120114.0, 483297.7),
  R(120131.0, 483296.2, 120133.2, 483302.8), R(120133.2, 483296.2, 120138.0, 483297.7),
];
// Onderbouw tussen toren en vleugels (+2,9), met de inham van de binnenhof (BAG).
const PODIUM = [
  [[120101.7, 483274.3], [120115.3, 483274.3], [120115.3, 483277.65], [120131.9, 483277.65], [120131.9, 483274.3], [120146.1, 483274.3], [120146.1, 483284.0], [120101.7, 483284.0]]
    .map(([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]]),
  2.9,
];

// ---------- Vleugels (BAG; hoogtes 3D BAG) ----------
// Begane grond tot +4,96, dan vijf lagen van 3,3 m (balkonbovenkanten +6,06 en +19,2 in de 3D BAG); dak +22,7,
// de noordkop (5,8 m) een laag lager met een dakterras op +16,1.
const WING_LEVELS = [4.96, 8.26, 11.56, 14.86, 18.16];
const WING_TOP = 22.7, WING_NORTH_TOP = 16.1;
const WINGS = [
  { name: "westvleugel", pand: "0363100012246554", main: R(120101.0, 483249.9, 120116.1, 483268.5), north: R(120101.0, 483268.5, 120116.1, 483274.8), lift: R(120103.5, 483263.9, 120107.0, 483266.4) },
  { name: "oostvleugel", pand: "0363100012246555", main: R(120131.1, 483249.8, 120146.1, 483268.5), north: R(120131.1, 483268.5, 120146.1, 483274.8), lift: R(120140.4, 483264.0, 120143.5, 483265.9) },
];
const LIFT_TOP = 23.42;
// Verspringende balkons aan de zuidgevel: per laag [van, tot] langs de gevel (m vanaf de westhoek).
const WING_BALCONIES = [[9.9, 15.0], [0.6, 5.6], [5.0, 10.5], [9.9, 15.0], [4.8, 10.6]];

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
// Rand van een rechthoek (linksom): punt op afstand s langs de rand, t naar buiten.
const edges = (rect) => rect.map((a, i) => {
  const b = rect[(i + 1) % rect.length];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { a, d, n, L, P: (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h] };
});
// Ligt de gevel op dit stuk vrij (straal van 3 m buiten de gevel raakt op 3 m)?
const exposed = (body, e, s, h) => {
  const from = e.P(s, 3, h), hit = body.rayCast(from, e.P(s, -1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
// Blinde nis met een plafond onder 45°: van s0 tot s1, vloer lo, bovenkant achterin hi, diepte depth.
const nis = (e, s0, s1, lo, hi, depth) => Manifold.hull([
  e.P(s0, 0.2, lo), e.P(s1, 0.2, lo), e.P(s0, -depth, lo), e.P(s1, -depth, lo),
  e.P(s0, 0.2, hi + depth + 0.2), e.P(s1, 0.2, hi + depth + 0.2), e.P(s0, -depth, hi), e.P(s1, -depth, hi),
]);
// Vensterraster op alle randen van `rect` voor de verdiepingen [vloer, hoogte] binnen [z0, z1].
function windows(body, rect, floors, z0, z1, { pitch, width, sill, head, special = () => null }) {
  const cuts = [];
  edges(rect).forEach((e, ei) => {
    if (e.L < 3) return;
    const bays = Math.floor((e.L - 0.9) / pitch), w = (e.L - bays * pitch) / 2;
    for (const [zf, fh] of floors) {
      if (zf < z0 - 0.01 || zf + fh > z1 + 0.01) continue;
      for (let k = 0; k < bays; k++) {
        const c = w + (k + 0.5) * pitch;
        const sp = special(ei, k, bays, zf);
        const ww = sp?.width ?? width;
        const s0 = c - ww / 2, s1 = c + ww / 2;
        const lo = zf + (sp?.sill ?? sill), top = zf + fh - (sp?.head ?? head), depth = sp?.depth ?? DEPTH;
        const ok = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, top - 0.05].every((h) => exposed(body, e, s, h)));
        if (ok) cuts.push(nis(e, s0, s1, lo, top - depth - 0.2, depth));
      }
    }
  });
  return cuts;
}

// Balkonstapel buiten de gevel (rand e, van s0 tot s1, OUT naar buiten) met per laag een open balkon van 0,9 m.
function balconyStack(e, s0, s1, zb, zt, out, floors) {
  const stack = Manifold.hull([s0, s1].flatMap((s) => [e.P(s, -0.1, zt), e.P(s, out, zt), e.P(s, -0.1, zb - out), e.P(s, out, zb)]));
  const cuts = [];
  for (const [zf, fh] of floors) {
    if (zf < zb - 0.01 || zf + fh > zt + 0.01) continue;
    const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
    cuts.push(Manifold.hull([s0 + 0.9, s1 - 0.9].flatMap((s) => [e.P(s, out + 0.2, lo), e.P(s, out - 0.9, lo), e.P(s, out + 0.2, hi + 0.9 + 0.2), e.P(s, out - 0.9, hi)])));
  }
  return { stack, cuts };
}

// ---------- Toren ----------
function tower() {
  const towerFloors = [[z(-0.68), z(3.6) - z(-0.68)], ...Array.from({ length: 21 }, (_, i) => [z(level(i + 1)), STOREY])];
  const parts = [
    prism(PLINTH, BASE, z(PLINTH_TOP)),
    block(B1, z(PLINTH_TOP) - 0.1, z(B1_TOP)),
    block(B2, z(B1_TOP) - 0.1, z(B2_TOP)),
    block(B3, z(B2_TOP) - 0.1, z(B3_TOP)),
    ...CROWN.map(([r, top]) => block(r, z(B3_TOP) - 0.1, z(top))),
    ...UPSTANDS.map((r) => block(r, z(ROOF) - 0.1, z(UPSTAND))),
    prism(PODIUM[0], BASE, z(PODIUM[1])),
  ];
  // Balkonstapels aan de zuidgevel (achterzijde), per blok verspringend; 1,4 m buiten de gevel.
  const south = (rect) => edges(rect)[0]; // eerste rand = zuidgevel (van west naar oost)
  const stackCuts = [];
  const groups = [
    [B1, B1_TOP, PLINTH_TOP, [[6.7, 13.5], [20.4, 27.2], [34.1, 40.9]]],
    [B2, B2_TOP, B1_TOP, [[0.9, 7.7], [13.6, 20.4], [27.2, 34.0], [40.0, 46.6]]],
  ];
  for (const [rect, top, bottom, spans] of groups) {
    for (const [s0, s1] of spans) {
      const { stack, cuts } = balconyStack(south(rect), s0, s1, z(bottom), z(top), 1.4, towerFloors);
      parts.push(stack);
      stackCuts.push(...cuts);
    }
  }
  const body = union(parts);
  // Voor de vrije-gevelcontrole tellen de aangrenzende vleugels mee (geen nissen achter een buurnode).
  const occ = union([body, ...WINGS.flatMap((w) => [prism(w.main, BASE, z(WING_TOP)), prism(w.north, BASE, z(WING_NORTH_TOP))])]);
  // Loggia's: aan de noordgevel per blok een groep van vijf traveeën, per blok één travee naar het oosten
  // verschoven; aan de oost- en westgevel een kolom open balkons (1,2 m diep) in de gevel.
  const LOGGIA = { width: 2.6, sill: 0.15, head: 0.35, depth: 1.2 };
  const loggiaCols = (zf) => (zf < z(B1_TOP) ? [3, 7] : zf < z(B2_TOP) ? [4, 8] : zf < z(B3_TOP) ? [5, 9] : [6, 9]);
  const special = (ei, k, bays, zf) => {
    if (zf < z(PLINTH_TOP)) return null;
    if (ei === 2) { const [a, b] = loggiaCols(zf); const kk = bays - 1 - k; if (kk >= a && kk <= b) return LOGGIA; } // noord (oost→west)
    if (ei === 1 && k === 3) return { ...LOGGIA, width: 3.0 }; // oost: vierde travee vanaf zuid
    if (ei === 3 && k === bays - 4) return { ...LOGGIA, width: 3.0 }; // west: idem
    return null;
  };
  const opts = { pitch: 3.4, width: 1.9, sill: 0.5, head: 0.45, special };
  const cuts = [...stackCuts];
  cuts.push(...windows(occ, PLINTH, towerFloors, z(3.6), z(PLINTH_TOP), { ...opts, special: () => null }));
  cuts.push(...windows(occ, B1, towerFloors, z(PLINTH_TOP), z(B1_TOP), opts));
  cuts.push(...windows(occ, B2, towerFloors, z(B1_TOP), z(B2_TOP), opts));
  cuts.push(...windows(occ, B3, towerFloors, z(B2_TOP), z(B3_TOP), opts));
  for (const [r, top] of CROWN) cuts.push(...windows(occ, r, towerFloors, z(B3_TOP), z(top), opts));
  // Galerij onder de plint: pijlers van 1,0 m op de buitenlijn, winkelpuien 1,2 m terug (plafond onder 45°).
  edges(PLINTH).forEach((e, ei) => {
    if (ei === 0) return; // zuidzijde: onderbouw
    const pitch = 3.4, bays = Math.floor((e.L - 1.0) / pitch), w = (e.L - bays * pitch) / 2;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + 0.5, s1 = s0 + pitch - 1.0;
      if ([s0 + 0.1, s1 - 0.1].every((s) => exposed(body, e, s, 1.0))) cuts.push(nis(e, s0, s1, 0, z(3.2) - 1.2 - 0.2, 1.2));
    }
  });
  // Ramen in de onderbouw (binnenhof en zijkanten).
  cuts.push(...windows(occ, PODIUM[0], [[0, z(2.9)]], 0, z(2.9), { pitch: 3.0, width: 1.6, sill: 0.6, head: 0.6 }));
  cuts.push(block(ROOF_NOTCH, z(level(21)) + 0.0, z(ROOF) + 1));
  // Stoere randen boven elk blok: band van 0,9 m die 0,4 m buiten de gevel eronder steekt, met een kraag onder 45°.
  const grow = ([[x0, y0], , [x1, y1]], d) => [[x0 - d, y0 - d], [x1 + d, y0 - d], [x1 + d, y1 + d], [x0 - d, y1 + d]];
  const rims = [[B1, B1_TOP], [B2, B2_TOP], [B3, B3_TOP]].map(([r, top]) => Manifold.hull([
    ...grow(r, RIM).map(([x, y]) => [x, y, z(top) - 0.6]), ...grow(r, RIM).map(([x, y]) => [x, y, z(top) + 0.3]),
    ...r.map(([x, y]) => [x, y, z(top) - 0.6 - RIM]),
  ]));
  return union([body.subtract(union(cuts)), ...rims]);
}

// ---------- Vleugels ----------
function wing({ main, north, lift }) {
  const floors = [[0, z(4.96)], ...WING_LEVELS.map((f) => [z(f), 3.3])];
  const parts = [prism(main, BASE, z(WING_TOP)), prism(north, BASE, z(WING_NORTH_TOP)), prism(lift, z(WING_TOP) - 0.1, z(LIFT_TOP))];
  const s = edges(main)[0]; // zuidgevel aan de George Gershwinlaan
  WING_LEVELS.forEach((f, i) => {
    const [s0, s1] = WING_BALCONIES[i], zb = z(f) - 0.3, zt = z(f) + 1.1, out = 1.2;
    parts.push(Manifold.hull([s0, s1].flatMap((q) => [s.P(q, -0.1, zt), s.P(q, out, zt), s.P(q, out, zb), s.P(q, -0.1, zb - out)])));
  });
  const body = union(parts);
  const occ = union([body, prism(PLINTH, BASE, z(PLINTH_TOP)), prism(PODIUM[0], BASE, z(PODIUM[1]))]);
  const opts = { pitch: 3.0, width: 1.5, sill: 0.6, head: 0.45 };
  const cuts = [
    ...windows(occ, main, floors, 0, z(WING_TOP), opts),
    ...windows(occ, north, floors, 0, z(WING_NORTH_TOP), opts),
  ];
  return body.subtract(union(cuts));
}

const nodes = [
  ["building:xavier-amsterdam-toren", tower()],
  ...WINGS.map((w) => [`building:xavier-amsterdam-${w.name}`, wing(w)]),
];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Xavier",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.36, // NAP -0,68 + geoïde NLGEO2018 43,04 (Q Residences en Rechtbank Amsterdam: 43,04–43,06)
    groundOffsetMetres: -0.15,
    replacesBuildings: [
      "NL.IMBAG.Pand.0363100012246555",
      "NL.IMBAG.Pand.0363100012246554",
      "NL.IMBAG.Pand.0363100012246556",
    ],
    description:
      "Woongebouw Xavier (KENK architecten, 2019) aan de Gustav Mahlerlaan op de Zuidas: een U-vormig complex met voorop een toren van 21 verdiepingen en achterop twee vleugels van zes lagen aan de George Gershwinlaan, verbonden door een onderbouw (+2,9) rond de binnenhof. De toren staat op een plint met een galerij (bovenkant +6,9) en bestaat uit drie gestapelde blokken die tot 2 m buiten de BAG-contour van de begane grond uitkragen en naar boven insnoeren (randen op +33,3, +49,8 en +59,7, uit het AHN-DSM rond de gevels), met een kroon van vier lagen tot NAP +73,6 en getrapte terrassen op +63,0, +66,3 en +69,6 (3D BAG). Gevels met een vensterraster per laag (3,3 m), loggiagroepen aan de noordgevel die per blok verspringen, een kolom open balkons in de oost- en westgevel en balkonstapels aan de zuidgevel; de vleugels (+22,7, noordkop +16,1) hebben verspringende balkons aan de zuidgevel. Oorsprong midden in het complex, X-as naar RD-oost. Vervangt ook de parkeerkelder (pand 0363100012246556), waarvan de 3D BAG-reconstructie het hele complex dubbelt. Verdiepingshoogtes, de galerij, de plaats van loggia's en balkons en de blokgrenzen per gevel zijn geschat uit foto's en het DSM.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      upstandNapM: UPSTAND,
      plinthTopNapM: PLINTH_TOP,
      blockTopsNapM: [B1_TOP, B2_TOP, B3_TOP].map((v) => +v.toFixed(2)),
      crownTerracesNapM: [level(19), level(20), level(21)].map((v) => +v.toFixed(2)),
      podiumNapM: PODIUM[1],
      wingRoofNapM: WING_TOP,
      wingNorthRoofNapM: WING_NORTH_TOP,
      storeyHeightM: STOREY,
      towerFloors: 21,
      apartments: 159,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0363100012246555, 0363100012246554 en 0363100012246556 (bouwjaar 2019), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG (LoD2.2, puntwolk AHN5 2023): https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012246555",
      "https://nl.wikipedia.org/wiki/Xavier_(Amsterdam)",
      "https://commons.wikimedia.org/wiki/Category:Xavier_(Amsterdam)",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Xavier_(1).jpg",
    ],
  },
});
