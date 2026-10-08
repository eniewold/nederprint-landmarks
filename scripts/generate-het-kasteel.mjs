// Genereert een gedetailleerd, gesloten 3D-model van Het Kasteel in Rotterdam
// (Sparta Stadion Het Kasteel, thuisstadion van Sparta Rotterdam, Spangen).
// Het model vervangt de PDOK-reconstructie van de vier tribunepanden en bestaat
// uit: de ring van tribunes rond het veld met per zijde een eigen doorsnede
// (een dakplaat van 1,7 tot 3,2 m dik met een aflopende voorrand en een ruglijn,
// op een achterwand met steunberen, een glazen band en schuin uitlopende voet,
// boven de opgetrokken zitrang in zes treden die onder het dak open blijft),
// vijf waaiervormige dakvakken per hoek, het trapsgewijze dak van de noord- en
// zuidtribune, de consoles langs de achterwand, de nis met de hal in de
// zuidtribune, het Kasteel zelf (bakstenen poortgebouw met twee tentdaken,
// twee torentjes, spits, poort en de kantelen van de poortbekroning), het
// clubgebouw aan de noordkant (houten volume op kolommen boven een glazen
// onderbouw, glazen toren met entreehal, 28 raamnissen, dakranden, trappenhuizen
// en dakopbouwen) en de vier vakwerk-lichtmasten buiten de hoeken. Alles is
// opgebouwd uit blokken, prisma's en convexe rompen van vlakken (geen
// hoogteveld); het Mapbox-model is niet gebruikt. Alle maten in het script zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-het-kasteel.mjs              # 1:1000 (standaard)
//   node scripts/generate-het-kasteel.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (NAP -1,2 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// noordoosten (RD-richting (0,8712, 0,4909), 29,4 graden), +Y dwars daarop
// naar het noordwesten, naar de clubgebouwen.
//
// Overhang: de dakplaten, de overstek van het houten volume, de kappen van het
// Kasteel en de lampenbanken hangen uit (ondervlakken onder 45 graden boven
// OVERHANG_MIN_Z); onder die hoogte blijft elk ondervlak steiler dan 45 graden.
// De export vult de uitkragingen op bij het printen.
//
// Bronnen: de vier BAG-panden van de ring (0599100000675996, 675997, 675998 en
// 676003; vervangen panden); AHN DSM/DTM 0,5 m (PDOK WCS, ook op 0,25 m
// opgevraagd) voor de voorrand van de tribunes (oost 63,35 m, west -63,3 m,
// noord 43,95 m, zuid -42,8 m, in de hoeken schuin afgesneden), de achterwand
// (76,2, -76,1, 58,9 en -55,9 m, hoekstraal 20,5 m) en per zijde het dakprofiel
// (voorrand op +8,4 m oost, +7,9 west, +10,3 noord en +7,8 zuid, de ruglijn op
// +11,8, +11,8, +15,1 en +11,7 m, de achterrand op +10,9, +10,9, +14,3 en
// +10,35 m), de schuine voet van de achterwand (1,3 m), het clubgebouw (+19,4 m
// in de vleugels, +22,7 m in het midden met een schuin dak van v 59,4 tot
// 61,4 m, de noordgevel van de vleugels op v = 68,95 m, het glazen torendeel
// tot 71,4 m, trappenhuizen tegen de uiteinden), het Kasteel (nok +11,1 m, de
// tentdaken +14,7 m, de torentjes +11,9 m), de hal erachter (+9,5 m) en de
// masten (tot +24,2 m); PDOK luchtfoto (0,03 tot 0,1 m) voor de dakvakken van
// 9 m, de waaiervormige hoekvakken en de plaats van de dakopbouwen; Wikimedia
// Commons-foto's (Sparta Stadion Het Kasteel 01 tot 05, Sparta stadion Spangen
// 2020) voor de zitrang onder het dak, de glazen band tegen de achterwand, het
// poortgebouw, de houten gevel met glazen toren en de consoles; Wikipedia
// (11.000 plaatsen). Geschat: de plaats en hoogte van de treden van de zitrang,
// de onderkant van de dakplaten (dikte 1,7 tot 3,2 m), de steunberen (1,0 m),
// de doorsnede van de masten en de bouw van de entreehal en de onderbouw van
// het clubgebouw. Weggelaten: de dakgoten tussen de vakken, de zonnepanelen, de
// reclameborden, het veldhek, de stoelen, de leuningen en de trappen op de
// zitrang, het tegelwerk en de leeuwen op het poortgebouw (te fijn voor
// 1:1000). Het Kasteel heeft in werkelijkheid geen kantelen langs de dakrand;
// alleen de poortbekroning heeft ze.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "het-kasteel");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const hull = (pts) => Manifold.hull(pts);
// Convexe romp van twee rechthoeken (x0, x1, y0, y1) op de hoogtes z0 en z1.
const frustum = (r0, z0, r1, z1) =>
  hull([
    ...[[r0[0], r0[2]], [r0[1], r0[2]], [r0[1], r0[3]], [r0[0], r0[3]]].map(([x, y]) => [x, y, z0]),
    ...[[r1[0], r1[2]], [r1[1], r1[2]], [r1[1], r1[3]], [r1[0], r1[3]]].map(([x, y]) => [x, y, z1]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);
// Lineaire interpolatie van een polylijn (ns stijgend) op positie n.
const lerpAt = (ns, zs, n) => {
  if (n <= ns[0]) return zs[0];
  for (let i = 1; i < ns.length; i++) {
    if (n <= ns[i]) return zs[i - 1] + ((zs[i] - zs[i - 1]) * (n - ns[i - 1])) / (ns[i] - ns[i - 1]);
  }
  return zs[zs.length - 1];
};

const SLUG = "het-kasteel";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP -1,2 m) ----------
const GROUND_NAP = -1.2;
const ORIGIN = [89395.2, 437202.8];
const X_AXIS = [0.871214, 0.490904]; // RD-richting 29,4 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;

// De ring loopt van de voorrand (veldzijde) naar de achterwand, uit de rand van
// het AHN-DSM (0,25 m): oost 63,35 en 76,2 m, west -63,3 en -76,1 m, noord 43,95
// en 58,9 m, zuid -42,8 en -55,9 m. De voorrand is een rechthoek [midden u,
// midden v, halve u, halve v] met schuin afgesneden hoeken (45 graden, benen van
// 4,6 m in het noordoosten, 4,5 in het noordwesten, 5,7 in het zuidwesten en 5,6
// in het zuidoosten); de achterwand is een afgeronde rechthoek met hoekstraal 20,5 m.
const INNER = { cu: 0.025, cv: 0.575, hu: 63.325, hv: 43.375, chamfer: [4.6, 4.5, 5.7, 5.6] };
const BACK = { cu: 0.05, cv: 1.5, hu: 76.15, hv: 57.4, r: 20.5 };
const ARC_SEGMENTS = 5; // vijf waaiervormige dakvakken per hoek, zoals op de luchtfoto
// Dwarsdoorsnede per zijde, afstanden n in meters vanaf de voorrand: breedte
// tot de achterwand `w`, de bovenkant van het dak (roofN, roofZ: voorrand,
// einde van de voorlip, ruglijn, achterrand), de onderkant van de dakplaat
// (underZ op dezelfde punten) en de zitrang `rake` = [n begin, n einde (voorvlak
// van de achterwand), z eerste trede, z laatste trede], zes treden.
const SIDE = {
  east: {
    w: 12.85,
    roofN: [0, 1.8, 3.9, 12.85],
    roofZ: [8.4, 8.6, 11.8, 10.85],
    underZ: [6.6, 6.8, 8.6, 9.15],
    rake: [0.2, 10.85, 1.1, 6.8],
  },
  north: {
    w: 14.95,
    roofN: [0, 3.0, 6.0, 14.95],
    roofZ: [10.3, 10.3, 15.1, 14.3],
    underZ: [8.4, 8.5, 11.9, 12.6],
    rake: [0.2, 7.5, 1.1, 5.6],
  },
  west: {
    w: 12.8,
    roofN: [0, 1.8, 3.9, 12.8],
    roofZ: [7.9, 8.2, 11.8, 10.85],
    underZ: [6.1, 6.4, 8.6, 9.15],
    rake: [0.2, 10.8, 1.1, 6.6],
  },
  south: {
    w: 13.1,
    roofN: [0, 1.9, 4.3, 13.1],
    roofZ: [7.8, 7.6, 11.7, 10.35],
    underZ: [6.0, 5.8, 8.5, 8.65],
    rake: [0.2, 10.5, 1.1, 6.4],
  },
};
const RAKE_STEPS = 6;
// Steunberen (1,0 bij 1,0 m) tegen de achterwand en consoles aan de buitenzijde
// op de scheidingen van de dakvakken (9 m): [zijde, langscoördinaat].
const BAY_LINES = {
  east: [-30.4, -21.7, -13.0, -4.3, 4.5, 13.2, 21.9, 30.6],
  west: [-30.4, -21.7, -13.0, -4.3, 4.5, 13.2, 21.9, 30.6],
  north: [-49.5, -40.5, -31.5, -22.5, -13.5, -4.5, 4.5, 13.5, 22.5, 31.5, 40.5, 49.5],
  south: [-50.8, -41.8, -32.8, -23.8, 24.2, 33.2, 42.2, 51.2],
};
const CONSOLE = { width: 1.3, out: 1.25, bottom: 2.0, bottomOut: 0.8, top: 8.8 };
const PIER = { width: 1.0, depth: 1.0 };
const BATTER = 1.3;
const BAND_DEPTH = 0.6;

// De nis van 28 m breed aan de zuidkant (de speelsters- en spelersingang) met de hal erachter.
const NICHE = { u: [-13.8, 14.2], front: -48.0, hallTop: 9.5, hallBack: -58.2, sloped: [-51.0, 3.0] };
// Lagere buitenstrook van de zuidtribune achter de ring (+8,65 m, AHN).
const SOUTH_EXTRA = { u: [-41, 41], v: [-58.7, -55.5], top: 8.65 };
// Het Kasteel: bakstenen poortgebouw (u -14,2 tot 14,2 m): gevel op v = -63,0 m, de twee erkers onder de tentdaken
// op v = -64,3 m, een geveldeel ertussen op v = -63,3 m, de dakrand op +8,7 m, een steil zadeldak met de nok
// op +11,1 m (AHN 0,25 m, doorsneden bij u = -6 en 0,2 m).
const CASTLE = {
  u: [-14.2, 14.2],
  v: [-63.0, -58.0],
  eave: 8.7,
  ridge: { v: -61.5, z: 11.1, eaves: [-59.7, -63.3] },
  middle: { u: [-2.3, 2.5], front: -63.3 },
  pyramids: [{ c: [-6.0, -61.55], half: [3.7, 2.75], apex: 14.0 }, { c: [6.2, -61.55], half: [3.7, 2.75], apex: 14.0 }],
  turrets: [[-13.2, -61.5], [13.6, -61.5]],
  turretTop: 11.9,
  spire: { c: [0.2, -61.5], z: [10.8, 13.0] },
  gate: { u: [-2.9, 3.3], v: [-65.0, -61.0], top: 7.0 },
  portal: { u: [-1.1, 1.5], depth: 1.1, top: 4.2 },
};
// Clubgebouw (BAG-contour, u -41 tot 41 m): houten volume van v = 58,0 tot 68,95 m op +19,4 m, in het midden
// (u -18 tot 18 m) +22,7 m met een schuin dak van v 59,4 tot 61,4 m, boven een glazen onderbouw tot v = 66,2 m
// (onder de overstek op +8,0 m), met een glazen toren (u -7 tot 7 m) tot v = 71,4 m.
const CLUB = {
  wings: [[-40.7, -17.98], [17.98, 40.7]],
  center: [-18, 18],
  south: 58.0,
  north: 68.95,
  glass: 66.2,
  deck: 8.0,
  wingTop: 19.4,
  centerTop: 22.7,
  ramp: [[59.4, 19.4], [61.4, 22.7]],
  tower: { u: [-7, 7], front: 71.4 },
  atrium: { u: [-15, 15], front: 70.2 },
  columns: [-39.8, -21.5, 21.5, 39.8],
  parapet: 0.9,
};
// Raamnissen in de noordgevel (twee rijen, 2,0 m breed, 2,4 m hoog, 0,5 m diep): per kolom het midden u.
const WINDOWS = { cols: [-38.2, -33.7, -29.2, -24.7, -20.2, -14, -9.5, 9.5, 14, 20.2, 24.7, 29.2, 33.7, 38.2], rows: [[10.8, 13.2], [14.4, 16.8]], width: 2.0, depth: 0.5 };
// Lichtmasten buiten de hoeken: vakwerkpilaren op 3,0 m, die naar boven versmallen.
const MASTS = [
  { at: [-90.7, 51.5], top: 24.2 },
  { at: [90.5, 51], top: 23.9 },
  { at: [-90.8, -48.2], top: 23.9 },
  { at: [90.8, -48.5], top: 22.1 },
];
// Maaiveld (AHN NAP -1,2 tot -1,4 m) op het plein en de straten rond het stadion.
const GROUND_SAMPLES = [[85, 0], [0, 78], [0, -70], [-85, 50]];
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen
// (dakplaten, overstekken, kappen); daaronder blijft elk ondervlak steiler dan 45 graden.
const OVERHANG_MIN_Z = 4.0;

// ---------- de ring ----------
// Afgeronde rechthoek met `ARC_SEGMENTS` stappen per hoek, tegen de klok in vanaf
// de oostzijde.
const roundedRect = ({ cu, cv, hu, hv, r }) => {
  const pts = [];
  const corners = [[hu - r, hv - r, 0], [-(hu - r), hv - r, 90], [-(hu - r), -(hv - r), 180], [hu - r, -(hv - r), 270]];
  for (const [x, y, a0] of corners) {
    for (let s = 0; s <= ARC_SEGMENTS; s++) {
      const a = ((a0 + (90 * s) / ARC_SEGMENTS) * Math.PI) / 180;
      pts.push([cu + x + r * Math.cos(a), cv + y + r * Math.sin(a)]);
    }
  }
  return pts;
};
// Rechthoek met schuine hoeken, tegen de klok in vanaf de oostzijde, met evenveel punten per hoek.
const chamferRect = ({ cu, cv, hu, hv, chamfer }) => {
  const pts = [];
  const corners = [
    [[hu, hv - chamfer[0]], [hu - chamfer[0], hv]],
    [[-(hu - chamfer[1]), hv], [-hu, hv - chamfer[1]]],
    [[-hu, -(hv - chamfer[2])], [-(hu - chamfer[2]), -hv]],
    [[hu - chamfer[3], -hv], [hu, -(hv - chamfer[3])]],
  ];
  for (const [a, b] of corners) {
    for (let s = 0; s <= ARC_SEGMENTS; s++) {
      const t = s / ARC_SEGMENTS;
      pts.push([cu + a[0] + (b[0] - a[0]) * t, cv + a[1] + (b[1] - a[1]) * t]);
    }
  }
  return pts;
};
const inner = chamferRect(INNER);
const back = roundedRect(BACK);
const SIDE_ORDER = ["east", "north", "west", "south"];
// Doorsnede in een hoek (AHN: de waaiervormige hoekvakken hebben geen voorlip; het dak begint vlak achter
// de voorrand op de ruglijn en loopt vandaar langzaam omlaag): de zitrang en de breedte lopen lineair van
// de ene zijde naar de volgende, de ruglijn en achterrand ook (de ruglijn 0,3 m hoger dan het gemiddelde).
const cornerParams = (a, b, t) => {
  const A = SIDE[a];
  const B = SIDE[b];
  const mix = (x, y) => x + (y - x) * t;
  const peak = mix(A.roofZ[2], B.roofZ[2]) + 0.3;
  const rear = mix(A.roofZ[3], B.roofZ[3]);
  return {
    w: mix(A.w, B.w),
    roofN: [0, 0.8, 1.6, mix(A.w, B.w)],
    roofZ: [peak - 0.4, peak - 0.4, peak, rear],
    underZ: [peak - 2.2, peak - 2.2, peak - 3.0, rear - 1.7],
    rake: A.rake.map((x, i) => mix(x, B.rake[i])),
  };
};
// Per punt van de ring de doorsnede voor het hoekstuk dat daar begint (hoek 0 = oost naar noord, ...),
// en per rechte zijde de doorsnede van die zijde.
const params = inner.map((_, k) => {
  const corner = Math.floor(k / (ARC_SEGMENTS + 1));
  return cornerParams(SIDE_ORDER[corner], SIDE_ORDER[(corner + 1) % 4], (k % (ARC_SEGMENTS + 1)) / ARC_SEGMENTS);
});
// Punt op afstand n van de voorrand op de straal door ringpunt k.
const at = (k, n, p) => {
  const f = n / p.w;
  return [inner[k][0] + (back[k][0] - inner[k][0]) * f, inner[k][1] + (back[k][1] - inner[k][1]) * f];
};
// Onderkant van de dakplaat op afstand n.
const underAt = (p, n) => lerpAt(p.roofN, p.underZ, n);
const topAt = (p, n) => lerpAt(p.roofN, p.roofZ, n);
// De convexe stukken van de doorsnede [n, z] (vier hoeken per stuk): de treden van de
// zitrang, de achterwand en de drie delen van de dakplaat. Elk stuk loopt 2 cm
// over in zijn buur.
const profileQuads = (p) => {
  const e = OVERLAP;
  const quads = [];
  const [rn0, rn1, rz0, rz1] = p.rake;
  for (let j = 0; j < RAKE_STEPS; j++) {
    const a = rn0 + ((rn1 - rn0) * j) / RAKE_STEPS - (j > 0 ? e : 0);
    const b = rn0 + ((rn1 - rn0) * (j + 1)) / RAKE_STEPS + e;
    const z = rz0 + ((rz1 - rz0) * j) / (RAKE_STEPS - 1);
    quads.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
  }
  const nb = rn1 - e;
  quads.push([[nb, BASE], [p.w, BASE], [p.w, underAt(p, p.w) + 0.3], [nb, underAt(p, nb) + 0.3]]);
  // De achterwand loopt aan de buitenzijde schuin uit naar de grond (1,3 m op de onderkant, AHN).
  quads.push([[p.w - 0.1, BASE], [p.w + BATTER, BASE], [p.w, underAt(p, p.w) - 0.2], [p.w - 0.1, underAt(p, p.w) - 0.2]]);
  for (let i = 0; i < 3; i++) {
    const a = p.roofN[i] - (i > 0 ? e : 0);
    const b = p.roofN[i + 1] + (i < 2 ? e : 0);
    quads.push([[a, underAt(p, a)], [b, underAt(p, b)], [b, topAt(p, b)], [a, topAt(p, a)]]);
  }
  return quads;
};
// Het stuk van ringpunt k naar het volgende punt `nx`: de romp van beide doorsneden, 2 cm langer.
const sweep = (k, nx, pk, pn, quadK, quadN) => {
  const dx = inner[nx][0] - inner[k][0];
  const dy = inner[nx][1] - inner[k][1];
  const l = Math.hypot(dx, dy) || 1;
  const pts = [];
  for (const [n, z] of quadK) {
    const [x, y] = at(k, n, pk);
    pts.push([x - (dx / l) * OVERLAP, y - (dy / l) * OVERLAP, z]);
  }
  for (const [n, z] of quadN) {
    const [x, y] = at(nx, n, pn);
    pts.push([x + (dx / l) * OVERLAP, y + (dy / l) * OVERLAP, z]);
  }
  return hull(pts);
};
const ringPieces = [];
for (let k = 0; k < inner.length; k++) {
  const nx = (k + 1) % inner.length;
  // Het stuk tussen twee hoeken is een rechte zijde met de doorsnede van die zijde; binnen een hoek loopt de doorsnede mee.
  const straight = k % (ARC_SEGMENTS + 1) === ARC_SEGMENTS;
  const pk = straight ? SIDE[SIDE_ORDER[(Math.floor(k / (ARC_SEGMENTS + 1)) + 1) % 4]] : params[k];
  const pn = straight ? pk : params[nx];
  const qk = profileQuads(pk);
  const qn = profileQuads(pn);
  qk.forEach((q, i) => ringPieces.push(sweep(k, nx, pk, pn, q, qn[i])));
}

// Kader per rechte zijde: (langs, n) naar (x, y) met n vanaf de voorrand naar buiten.
const FRAME = {
  east: (a, n) => [INNER.cu + INNER.hu + n, a],
  west: (a, n) => [INNER.cu - INNER.hu - n, a],
  north: (a, n) => [a, INNER.cv + INNER.hv + n],
  south: (a, n) => [a, INNER.cv - INNER.hv - n],
};
const sideHull = (side, pts) => hull(pts.map(([a, n, z]) => [...FRAME[side](a, n), z]));
const structure = [];
for (const side of SIDE_ORDER) {
  const p = SIDE[side];
  const nb = p.rake[1];
  for (const a of BAY_LINES[side]) {
    // Steunbeer tegen de voorkant van de achterwand, van de bovenste trede tot in de dakplaat.
    const n0 = nb - PIER.depth;
    const half = PIER.width / 2;
    structure.push(
      sideHull(side, [
        [a - half, n0, p.rake[3] - 0.3],
        [a + half, n0, p.rake[3] - 0.3],
        [a - half, nb + OVERLAP, p.rake[3] - 0.3],
        [a + half, nb + OVERLAP, p.rake[3] - 0.3],
        [a - half, n0, underAt(p, n0) + 0.3],
        [a + half, n0, underAt(p, n0) + 0.3],
        [a - half, nb + OVERLAP, underAt(p, nb) + 0.3],
        [a + half, nb + OVERLAP, underAt(p, nb) + 0.3],
      ]),
    );
    // Console aan de buitenzijde van de achterwand (draagt de dakrand, steil, geen uitkraging onder 45 graden).
    if (side === "north" && Math.abs(a) < 41) continue;
    const c = CONSOLE.width / 2;
    const topZ = p.roofZ[3] - 0.4;
    structure.push(
      sideHull(side, [
        [a - c, p.w - 0.1, CONSOLE.bottom],
        [a + c, p.w - 0.1, CONSOLE.bottom],
        [a - c, p.w + CONSOLE.bottomOut, CONSOLE.bottom],
        [a + c, p.w + CONSOLE.bottomOut, CONSOLE.bottom],
        [a - c, p.w + CONSOLE.out, CONSOLE.top],
        [a + c, p.w + CONSOLE.out, CONSOLE.top],
        [a - c, p.w - 0.1, topZ],
        [a + c, p.w - 0.1, topZ],
        [a - c, p.w + CONSOLE.out, topZ],
        [a + c, p.w + CONSOLE.out, topZ],
      ]),
    );
  }
}
// De glazen band in de achterwand tussen de steunberen (0,6 m diep, AHN-foto's: een lichte band onder het dak).
const bands = [];
for (const side of SIDE_ORDER) {
  const p = SIDE[side];
  const nb = p.rake[1];
  const lines = BAY_LINES[side];
  const z0 = p.rake[3] + (side === "north" ? 0.9 : 0.5);
  const z1 = underAt(p, nb + BAND_DEPTH) - (side === "north" ? 1.4 : 0.4);
  for (let i = 0; i + 1 < lines.length; i++) {
    if (lines[i + 1] - lines[i] > 10) continue;
    const a0 = lines[i] + PIER.width / 2 + 0.2;
    const a1 = lines[i + 1] - PIER.width / 2 - 0.2;
    bands.push(
      sideHull(side, [
        ...[a0, a1].flatMap((a) => [[a, nb - 0.05, z0], [a, nb - 0.05, z1], [a, nb + BAND_DEPTH, z0], [a, nb + BAND_DEPTH, z1]]),
      ]),
    );
  }
}
const ring = Manifold.union([...ringPieces, ...structure])
  .subtract(Manifold.union(bands))
  .subtract(box(NICHE.u[0], NICHE.u[1], -60, -40, BASE - 1, 40));

// ---------- de zuidzijde: hal in de nis, buitenstrook en het Kasteel ----------
const hall = profileX(
  [[NICHE.front, BASE], [NICHE.front, NICHE.sloped[1]], [NICHE.sloped[0], NICHE.hallTop], [NICHE.hallBack, NICHE.hallTop], [NICHE.hallBack, BASE]],
  NICHE.u[0],
  NICHE.u[1],
);
const southExtra = box(SOUTH_EXTRA.u[0], SOUTH_EXTRA.u[1], SOUTH_EXTRA.v[0], SOUTH_EXTRA.v[1], BASE, SOUTH_EXTRA.top);
const castleParts = [];
const castleCuts = [];
{
  const { u, v, eave, ridge, middle, pyramids, turrets, turretTop, spire, gate, portal } = CASTLE;
  // Het gebouw tot de dakrand, de erkers onder de tentdaken en het zadeldak daarop (nok langs u).
  castleParts.push(box(u[0], u[1], v[0], v[1], BASE, eave));
  castleParts.push(box(middle.u[0], middle.u[1], middle.front, v[0] + OVERLAP, BASE, eave));
  for (const { c, half } of pyramids) castleParts.push(box(c[0] - half[0], c[0] + half[0], c[1] - half[1], c[1] + half[1], BASE, eave));
  castleParts.push(profileX([[ridge.eaves[0], eave - 0.02], [ridge.eaves[1], eave - 0.02], [ridge.v, ridge.z]], u[0] - 0.2, u[1] + 0.2));
  // De twee tentdaken van de erkers en hun schoorstenen.
  for (const { c, half, apex } of pyramids) {
    castleParts.push(
      frustum([c[0] - half[0], c[0] + half[0], c[1] - half[1], c[1] + half[1]], eave - 0.02, [c[0] - 0.6, c[0] + 0.6, c[1] - 0.6, c[1] + 0.6], apex),
    );
    castleParts.push(box(c[0] - 0.6, c[0] + 0.6, c[1] - 0.6, c[1] + 0.6, apex - 0.05, apex + 0.9));
  }
  // De torentjes aan de uiteinden van de gevel: achthoekig, met een kegeldak.
  for (const [cx, cy] of turrets) {
    castleParts.push(Manifold.cylinder(eave - BASE - 0.3, 1.9, 1.9, 8).translate([cx, cy, BASE]));
    castleParts.push(Manifold.cylinder(turretTop - eave + 0.3, 2.0, 0.55, 8).translate([cx, cy, eave - 0.3]));
  }
  // De spits op de nok.
  castleParts.push(frustum([spire.c[0] - 0.7, spire.c[0] + 0.7, spire.c[1] - 0.7, spire.c[1] + 0.7], spire.z[0], [spire.c[0] - 0.5, spire.c[0] + 0.5, spire.c[1] - 0.5, spire.c[1] + 0.5], spire.z[1]));
  // De poorttoren met de kantelen van zijn bekroning.
  castleParts.push(box(gate.u[0], gate.u[1], gate.v[0], gate.v[1], BASE, gate.top));
  const gateMid = (gate.u[0] + gate.u[1]) / 2;
  for (const du of [-2.0, 0, 2.0]) {
    castleParts.push(box(gateMid + du - 0.5, gateMid + du + 0.5, gate.v[0], gate.v[0] + 1.0, gate.top - OVERLAP, gate.top + 1.0));
  }
  castleParts.push(box(gate.u[0] - 0.3, gate.u[1] + 0.3, gate.v[0], gate.v[1], gate.top - 0.3, gate.top));
  // De poort zelf.
  castleCuts.push(box(portal.u[0], portal.u[1], gate.v[0] - 0.5, gate.v[0] + portal.depth, 0, portal.top));
}
const castle = Manifold.union(castleParts).subtract(Manifold.union(castleCuts));

// ---------- het clubgebouw ----------
const clubParts = [];
{
  const { wings, center, south, north, glass, deck, wingTop, centerTop, ramp, tower, atrium, columns, parapet } = CLUB;
  const wingProfile = [[south, BASE], [glass, BASE], [glass, deck], [north, deck], [north, wingTop], [south, wingTop]];
  for (const [u0, u1] of wings) clubParts.push(profileX(wingProfile, u0, u1));
  clubParts.push(
    profileX([[south, BASE], [glass, BASE], [glass, deck], [north, deck], [north, centerTop], [ramp[1][0], centerTop], [ramp[0][0], ramp[0][1]], [south, wingTop]], center[0], center[1]),
  );
  // Glazen entreehal en toren voor het midden.
  clubParts.push(box(atrium.u[0], atrium.u[1], glass - 0.1, atrium.front, BASE, deck));
  clubParts.push(box(tower.u[0], tower.u[1], glass - 0.1, tower.front, BASE, centerTop));
  // Kolommen onder de overstek van het houten volume.
  for (const u of columns) clubParts.push(box(u - 0.5, u + 0.5, north - 1.3, north - 0.3, BASE, deck + 0.3));
  // Dakranden langs de noordgevel en de zijkanten.
  const p = parapet;
  for (const [u0, u1] of wings) {
    clubParts.push(box(u0, u1, north - p, north, wingTop - OVERLAP, wingTop + p));
  }
  clubParts.push(box(wings[0][0], wings[0][0] + p, south, north, wingTop - OVERLAP, wingTop + p));
  clubParts.push(box(wings[1][1] - p, wings[1][1], south, north, wingTop - OVERLAP, wingTop + p));
  clubParts.push(box(center[0], center[1], north - p, north, centerTop - OVERLAP, centerTop + p));
  clubParts.push(box(center[0], center[0] + p, ramp[1][0], north, centerTop - OVERLAP, centerTop + p));
  clubParts.push(box(center[1] - p, center[1], ramp[1][0], north, centerTop - OVERLAP, centerTop + p));
  // Trappenhuizen tegen de uiteinden van de vleugels (AHN: +13,5 m west, +13,0 m oost).
  clubParts.push(box(-44.0, wings[0][0] + OVERLAP, south, 64.0, BASE, 13.5));
  clubParts.push(box(wings[1][1] - OVERLAP, 43.5, south, 64.0, BASE, 13.0));
  // Dakopbouwen: de lichtkap op het midden en de koelinstallatie op de westvleugel.
  clubParts.push(box(-6.5, 2.0, 67.0, 69.0 - p, centerTop - OVERLAP, centerTop + 1.4));
  clubParts.push(box(-26.5, -20.5, 64.5, 67.5, wingTop - OVERLAP, wingTop + 1.6));
}
const windows = [];
for (const u of WINDOWS.cols) {
  for (const [z0, z1] of WINDOWS.rows) {
    windows.push(box(u - WINDOWS.width / 2, u + WINDOWS.width / 2, CLUB.north - WINDOWS.depth, CLUB.north + 1, z0, z1));
  }
}
const club = Manifold.union(clubParts).subtract(Manifold.union(windows));

// ---------- de lichtmasten ----------
// Vakwerkpilaar: vier poten van 0,9 m, die van 3,6 naar 2,8 m versmallen, ringbalken
// op vier niveaus en kruisdiagonalen (steiler dan 45 graden), bovenaan een
// lampenbank die naar het veld wijst.
const mast = ([cx, cy], top) => {
  const leg = 0.9;
  const baseW = 3.6;
  const topW = 2.8;
  const zHead = top - 4.5;
  const levels = [BASE, 6.0, 12.0, zHead - 1.0];
  const off = (z) => (baseW + ((topW - baseW) * (z - BASE)) / (zHead - BASE)) / 2 - leg / 2;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const cube = (x, y, z, s) => corners.flatMap(([dx, dy]) => [[x + dx * s, y + dy * s, z - s], [x + dx * s, y + dy * s, z + s]]);
  const parts = [];
  for (const [sx, sy] of corners) {
    const pts = [];
    for (const z of [BASE, zHead]) for (const [dx, dy] of corners) pts.push([cx + sx * off(z) + (dx * leg) / 2, cy + sy * off(z) + (dy * leg) / 2, z]);
    parts.push(hull(pts));
  }
  // Ringbalken (0,9 m breed en hoog) op de vier niveaus.
  for (const z of levels) {
    const o = off(z);
    const z0 = z === BASE ? BASE : z - 0.45;
    const outer = box(cx - o - 0.45, cx + o + 0.45, cy - o - 0.45, cy + o + 0.45, z0, z0 + 0.9);
    parts.push(outer.subtract(box(cx - o + 0.45, cx + o - 0.45, cy - o + 0.45, cy + o - 0.45, z0 - 1, z0 + 2)));
  }
  // Kruisdiagonalen (0,9 m) op de vier zijden tussen de niveaus.
  for (let i = 0; i + 1 < levels.length; i++) {
    const zA = levels[i] + (i === 0 ? 0.9 : 0.45);
    const zB = levels[i + 1] - 0.45;
    for (let c = 0; c < 4; c++) {
      const a = corners[c];
      const b = corners[(c + 1) % 4];
      for (const [from, to] of [[a, b], [b, a]]) {
        const oa = off(zA);
        const ob = off(zB);
        parts.push(hull([...cube(cx + from[0] * oa, cy + from[1] * oa, zA, 0.45), ...cube(cx + to[0] * ob, cy + to[1] * ob, zB, 0.45)]));
      }
    }
  }
  // Lampenbank: een romp van de pilaarkop naar een brede kast die naar het veld wijst.
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI;
  const half = [1.3, 3.1];
  const oh = off(zHead) + leg / 2;
  const flare = hull([
    ...corners.map(([dx, dy]) => [dx * oh, dy * oh, zHead]),
    ...corners.map(([dx, dy]) => [dx * half[0], dy * half[1], zHead + 2.6]),
  ]);
  const bank = Manifold.union([flare, box(-half[0], half[0], -half[1], half[1], zHead + 2.55, top)]).rotate([0, 0, facing]).translate([cx, cy, 0]);
  parts.push(bank);
  return Manifold.union(parts);
};
const masts = MASTS.map(({ at: p, top }) => mast(p, top));

// Naar beneden gerichte vlakken: de dakplaten, overstekken en kappen mogen hoger dan OVERHANG_MIN_Z
// vlakker dan 45 graden hangen; onder die hoogte blijft elk ondervlak steil.
const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([ring, hall, southExtra, castle, club, ...masts]);
// BAG-panden van het stadion: de westtribune, de zuid- en oosttribune, de noordtribune met de clubgebouwen.
const REPLACED_BUILDINGS = ["0599100000675996", "0599100000675997", "0599100000675998", "0599100000676003"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Het Kasteel",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (89395,20, 437202,80) in het hart van de veldopening op het maaiveld (NAP -1,2 m), +X langs het veld naar het noordoosten (29,4 graden) en +Y naar het noordwesten. Eén node building:stadion: de ring van tribunes (voorrand 127 bij 87 m, achterwand 152 bij 115 m) met per zijde een eigen dakdoorsnede (een dakplaat van 1,7 tot 3,2 m dik met een aflopende voorrand, op een achterwand met steunberen en consoles) boven een zitrang van zes treden die onder het dak zichtbaar blijft, vijf waaiervormige dakvakken per hoek, het trapsgewijze dak van de noordtribune (+15,1 m) en de zuidtribune (+11,7 m), de nis met hal in de zuidtribune, het Kasteel (bakstenen poortgebouw met twee tentdaken tot +14,7 m, twee torentjes, spits, poort en kantelen), het clubgebouw (+19,4 m in de vleugels, +22,7 m in het midden met schuin dak, houten volume op kolommen boven een glazen onderbouw, glazen toren, 28 raamnissen, dakranden en dakopbouwen) en vier vakwerk-lichtmasten buiten de hoeken. Onderkant op 0,5 m onder het maaiveld; de dakplaten en overstekken hangen uit (de export vult ze op). Vervangt de PDOK-reconstructie van de BAG-panden van het stadion. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 11000,
    fieldOpeningM: [127, 87],
    roofM: Object.fromEntries(SIDE_ORDER.map((s) => [s, [SIDE[s].roofZ[0], SIDE[s].roofZ[2], SIDE[s].roofZ[3]]])),
    clubBuildingM: [CLUB.wingTop, CLUB.centerTop],
    castleM: [CASTLE.ridge[1], CASTLE.pyramids[0].apex + 0.9],
    mastTopM: MASTS.map((m) => m.top),
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Spartastadion_Het_Kasteel",
    "PDOK BAG panden van het stadion (zie replacesBuildings), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS (ook op 0,25 m opgevraagd): de ring, de dakprofielen per zijde, het clubgebouw, het Kasteel, de hal en de lichtmasten",
    "PDOK luchtfoto (Actueel_orthoHR): dakvakken, hoekvakken en dakopbouwen",
    "Wikimedia Commons: Sparta Stadion Het Kasteel 01 tot 05 en Sparta stadion Spangen 2020 (zitrang onder het dak, achterwand, poortgebouw, houten gevel, consoles)",
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

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
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
