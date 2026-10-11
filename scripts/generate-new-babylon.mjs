// New Babylon (Koningin Julianaplein, Den Haag; Meyer en Van Schooten, 2011-2013):
// het winkel- en kantorencomplex Babylon (1978) naast Den Haag Centraal, deels
// gesloopt, gerenoveerd en uitgebreid met twee woontorens en een kantoorschijf.
//
// - City Tower (zuidwesthoek, +142,5): een schacht van 19 x 36 m met een lager
//   L-vormig bouwdeel tot +121,6 om de oosthoek, en een inham van 6,5 x 7 m in
//   de noordhoek (verspringende hoeken). Witte verdiepingsbanden die per vak
//   op en neer verspringen; over de zuidwestgevel loopt een wit
//   driehoeksvakwerk dat bovenaan de hele gevel beslaat en naar beneden
//   smaller wordt; boven het lagere bouwdeel een vakwerkkroon.
// - Park Tower (noordoosthoek, +102,3): een schacht met een schuine oostgevel
//   (11 graden, BAG en AHN) die van de vijfde verdieping tot het dak in het
//   driehoeksvakwerk staat, een L-vormig lager bouwdeel tot +87,4 om de west-
//   en noordkant en daarboven een vakwerkkroon.
// - De kantoorschijf langs de Bezuidenhoutseweg (+45,9): drie lagen van +33
//   tot +45,9, twee in een wit driehoeksvakwerk, op V-kolommen boven het oude
//   Babylon Hotel; de gevel eronder ligt 1,5 m terug.
// - Het oude Babylon: de kantoorvleugels van +36,6 tot +54,8 (zuidvleugel en
//   oostvleugel als U, de westvleugel en de oude kantoortoren in het midden),
//   met daartussen het winkelcentrum (+9,4 tot +23,1) en een open binnenhof.
//
// Alles staat in één BAG-pand (0518100000237257), dus het model vervangt het
// hele complex. Het BAG-vlak loopt onder de grond verder naar het zuiden en
// oosten (parkeerkelders onder het busplatform en het Anna van Buerenplein);
// daar staat boven het maaiveld niets van dit pand en het model laat het weg.
//
// Benoemde bouwdelen met de maten als constanten in een eigen gebouwstelsel,
// geen gestapelde DSM-lagen: platte daken als prisma's op hun AHN-hoogte,
// gevelreliëf (verdiepingsbanden, vakwerkdriehoeken, vensterbanden) als
// blinde nissen van 0,35 m. Voorbeeld per rij: generate-evoluon.mjs (aanpak
// primitieven), generate-haagse-toren.mjs, generate-hoftoren.mjs en
// generate-castalia.mjs (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-new-babylon.mjs              # 1:1000 (standaard)
//
// Meetstelsel (u, v): oorsprong RD (82200, 455380), +u op 37,45 graden in RD
// langs de gevels (BAG-randen 37,4-37,6 en 127,4-127,6 graden), +v naar het
// noordwesten (127,45 graden, de Bezuidenhoutseweg). Het modelhart ligt op
// (u, v) = (30, 54), midden in het complex; het model wordt aan het eind
// daarheen verschoven. z = 0 op NAP +0,6 m (3D BAG-maaiveld 0,63; straten
// rondom AHN-DTM +0,47 tot +0,82). +X is de u-as: de Koningin Julianaplein ligt
// aan -X (west), de Bezuidenhoutseweg aan +Y (noord), het Anna van Buerenplein
// aan -Y (zuid).
//
// Bronnen: BAG-pand 0518100000237257, AHN DSM/DTM 0,5 m (PDOK WCS, in dit
// stelsel uitgelezen: contouren en hoogtes van alle bouwdelen), 3D BAG LoD2.2
// (TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes en -contouren),
// Actueel_orthoHR, Wikipedia (141,8 m/45 lagen en 101,6 m/31 lagen) en
// Commons-foto's van alle kanten (vakwerk, banden, V-kolommen, hotel).
import { Manifold, prism, hull, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "new-babylon";
const M0 = [82200, 455380];
const AXIS_DEG = 37.45;
const RAD = (AXIS_DEG * Math.PI) / 180;
const HEART = [30, 54];
const rd = (u, v) => [M0[0] + u * Math.cos(RAD) - v * Math.sin(RAD), M0[1] + u * Math.sin(RAD) + v * Math.cos(RAD)];
const ORIGIN = rd(...HEART).map((c) => +c.toFixed(2));
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 0.6;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  city: 142.5, // dak City Tower (AHN 142,2-142,6; 3D BAG 142,4; Wikipedia 141,8 m boven maaiveld)
  cityLow: 121.6, // L-vormig lager bouwdeel (AHN 121,5-121,8; 3D BAG 121,6)
  park: 102.3, // dak Park Tower (AHN 102,0-102,4; 3D BAG 102,1-102,4; Wikipedia 101,6 m)
  parkLow: 87.4, // L-vormig lager bouwdeel (AHN 87,3-87,5; 3D BAG 87,3)
  parkRim: 104.2, // opstand langs de westrand van het dak (AHN 103,6-104,8)
  parkBox: 103.1, // installatie op het dak (AHN 102,9-103,1)
  slab: 45.9, // kantoorschijf langs de Bezuidenhoutseweg (AHN/3D BAG 45,9)
  slabBottom: 33.0, // onderkant van de schijf (foto's: drie lagen boven de V-kolommen)
  slabBox: 47.7, // dakopbouw op de schijf (3D BAG 47,7)
  south: 41.8, // zuid- en oostvleugel van het oude Babylon (AHN/3D BAG 41,7-41,8)
  southBoxA: 44.3, // dakopbouwen op de zuidvleugel (AHN 44,0-44,5)
  southBoxB: 42.8, // (3D BAG 42,8)
  west: 36.6, // westvleugel (AHN/3D BAG 36,6)
  office: 50.1, // oude kantoortoren in het midden (AHN 50,1)
  officeMid: 52.6, // (AHN 52,2-52,8)
  officeTop: 54.8, // (AHN/3D BAG 54,8)
  north: 36.6, // middenvleugel naar het noorden (3D BAG 36,6)
  northBoxA: 39.7, // (3D BAG 39,7)
  northBoxB: 39.0, // (3D BAG 39,0)
  shopsW: 23.0, // winkelblok achter de City Tower (AHN/3D BAG 23,0)
  shopsE: 23.1, // winkelblok aan de oostkant (AHN/3D BAG 23,1)
  podiumW: 13.4, // laagbouw langs de Koningin Julianaplein (AHN/3D BAG 13,4)
  podiumN: 12.8, // laagbouw aan de binnenkant (AHN/3D BAG 12,8)
  podiumE: 13.4, // laagbouw onder de Park Tower (AHN/3D BAG 13,5)
  low: 9.4, // laagste daken van het winkelcentrum en de plint (AHN/3D BAG 9,4-9,5)
};

// ---------- plattegrond (m, meetstelsel; contouren uit het AHN en de 3D BAG) ----------
// City Tower: schacht A met de inham in de noordhoek, lager bouwdeel B om de oosthoek.
const CITY = [[-28.9, 7.5], [-10.0, 7.5], [-10.0, 36.5], [-16.5, 36.5], [-16.5, 43.5], [-28.9, 43.5]];
const CITY_LOW = [[-17.3, 0.8], [-4.4, 0.8], [-4.4, 37.0], [-10.0, 37.0], [-10.0, 7.5], [-17.3, 7.5]];
// Park Tower: schacht C met de schuine oostgevel (BAG 83,8/65,3 - 89,5/94,0),
// lager bouwdeel D om de west- en noordkant.
const PARK = [[68.6, 65.5], [84.3, 65.3], [90.4, 97.6], [68.6, 99.6]];
const parkNorth = (u) => 99.6 + ((u - 68.6) * (97.6 - 99.6)) / (90.4 - 68.6);
const PARK_LOW = [[62.6, 69.6], [68.6, 69.6], [68.6, 99.6], [74.7, +parkNorth(74.7).toFixed(3)], [74.7, 106.4], [62.6, 106.4]];
// Kantoorschijf langs de Bezuidenhoutseweg; west van u = 8,75 loopt hij door
// tot v = 78,5 (het hotel), oost daarvan tot v = 89,25.
const SLAB = [[-27.6, 78.5], [8.75, 78.5], [8.75, 89.25], [62.6, 89.25], [62.6, 106.4], [-27.6, 106.4]];
const SLAB_BOX = [[30.4, 89.4], [33.4, 89.4], [33.4, 99.4], [30.4, 99.4]];
// Open binnenhof tussen het hotel en het winkelcentrum (AHN-DSM 0,8).
const COURT = [[8.75, 78.5], [14.3, 78.5], [14.3, 89.25], [8.75, 89.25]];
// Oude Babylon: U van zuid- en oostvleugel, westvleugel, middenvleugel,
// oude kantoortoren, winkelblokken en laagbouw.
const SOUTH = [[-4.4, 0.8], [71.0, 0.8], [71.0, 45.0], [54.5, 45.0], [54.5, 18.0], [-4.4, 18.0]];
const SOUTH_BOX_A = [[7.0, 9.0], [24.0, 9.0], [24.0, 15.0], [7.0, 15.0]];
const SOUTH_BOX_B = [[40.0, 9.3], [64.0, 9.3], [64.0, 18.3], [40.0, 18.3]];
const WEST = [[-4.4, 18.0], [14.3, 18.0], [14.3, 36.8], [20.4, 36.8], [20.4, 50.5], [-4.4, 50.5]];
const OFFICE = [[20.4, 32.0], [37.8, 32.0], [37.8, 65.5], [20.4, 65.5]];
const OFFICE_MID = [[23.1, 35.0], [34.5, 35.0], [34.5, 44.5], [23.1, 44.5]];
const OFFICE_TOP = [[23.1, 44.5], [34.5, 44.5], [34.5, 63.8], [23.1, 63.8]];
const NORTH = [[37.8, 46.5], [45.5, 46.5], [45.5, 81.2], [28.0, 81.2], [28.0, 65.5], [37.8, 65.5]];
const NORTH_BOX_A = [[37.6, 47.5], [42.5, 47.5], [42.5, 68.0], [37.6, 68.0]];
const NORTH_BOX_B = [[31.0, 66.7], [42.0, 66.7], [42.0, 77.6], [31.0, 77.6]];
const SHOPS_W = [[-11.0, 37.0], [-4.4, 37.0], [-4.4, 50.5], [6.5, 50.5], [6.5, 66.0], [-11.0, 66.0]];
const SHOPS_E = [[45.5, 61.0], [62.6, 61.0], [62.6, 89.25], [45.5, 89.25]];
const PODIUM_W = [[-26.4, 43.5], [-16.5, 43.5], [-16.5, 36.8], [-11.0, 36.8], [-11.0, 66.0], [-12.2, 66.0], [-12.2, 75.4], [-26.4, 75.4]];
const PODIUM_N = [[-9.3, 66.0], [6.5, 66.0], [6.5, 50.5], [20.4, 50.5], [20.4, 65.5], [28.0, 65.5], [28.0, 78.5], [20.8, 78.5], [20.8, 89.25], [14.3, 89.25], [14.3, 78.5], [-9.3, 78.5]];
const PODIUM_S = [[14.3, 18.0], [20.8, 18.0], [20.8, 36.8], [14.3, 36.8]]; // +12,8 (3D BAG)
const PODIUM_E = [[68.0, 45.0], [78.8, 45.0], [83.0, 65.4], [68.0, 65.4]];
const PODIUM_E2 = [[45.5, 56.0], [68.0, 56.0], [68.0, 69.6], [62.6, 69.6], [62.6, 61.0], [45.5, 61.0]]; // +12,8
const PLINTH_N = [[-28.0, 106.4], [8.75, 106.4], [8.75, 110.4], [-28.0, 110.4]]; // glazen plint langs de Bezuidenhoutseweg
const PLINTH_W = [[-28.0, 43.5], [-26.4, 43.5], [-26.4, 75.4], [-9.3, 75.4], [-9.3, 78.5], [-28.0, 78.5]];
// Voetafdruk boven het maaiveld (vult alles tot +9,4).
const FOOT = [
  [-17.3, 0.8], [71.0, 0.8], [71.0, 45.0], [78.8, 45.0], [84.3, 65.3], [90.4, 97.6], [74.7, +parkNorth(74.7).toFixed(3)], [74.7, 106.4],
  [8.75, 106.4], [8.75, 110.4], [-28.0, 110.4], [-28.0, 43.5], [-28.9, 43.5], [-28.9, 7.5], [-17.3, 7.5],
];

// ---------- gevelritme (foto's) ----------
const NICHE = 0.35; // diepte van alle nissen en groeven
const CITY_FLOOR = { first: 5.6, pitch: 3.1, count: 44 }; // 45 lagen (Wikipedia), entree tot +5,6
const PARK_FLOOR = { first: 5.6, pitch: 3.2, count: 30 }; // 31 lagen
const JOG = 0.3; // verspringing van de witte banden (op en neer per vak)
const MEMBER = 0.45; // halve breedte van de vakwerkstaven (0,9 m)
const OLD_PITCH = 3.6; // vensterbanden van het oude Babylon en de laagbouw
// Recess en V-kolommen onder de schijf.
const RECESS = 1.5;
const V_WEST = [81.8, 103.2]; // v van de voet van de twee V's in de westgevel (hotel)
const V_NORTH = [-21.5, 2.0, 55.5]; // u van de V's in de noordgevel
const PILLAR_NORTH = [27.0]; // losse kolom in de noordgevel

// ---------- hulpfuncties ----------
const inside = (poly, [u, v]) => {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ui, vi] = poly[i], [uj, vj] = poly[j];
    if (vi > v !== vj > v && u < ((uj - ui) * (v - vi)) / (vj - vi) + ui) ins = !ins;
  }
  return ins;
};
const BLOCKS = []; // { name, poly, top, scheme }
const block = (name, poly, top, scheme = null) => BLOCKS.push({ name, poly, top, scheme });
// Hoogste dak op een punt (NAP); de binnenhof en het maaiveld eromheen op +0,6.
const topAt = (p) => {
  if (inside(COURT, p)) return GROUND_NAP;
  let t = inside(FOOT, p) ? H.low : GROUND_NAP;
  for (const b of BLOCKS) if (b.top > t && inside(b.poly, p)) t = b.top;
  return t;
};
// Prisma van een convexe veelhoek (s, z) in het gevelvlak van de rand a→b
// (buitenkant rechts bij een veelhoek tegen de klok in): van `depth` de gevel
// in tot `out` erbuiten. z in NAP.
const facePrism = (a, b, pts, depth = NICHE, out = 1.0) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n = [d[1], -d[0]];
  const P = [];
  for (const [s, h] of pts) for (const o of [-depth, out]) P.push([a[0] + d[0] * s + n[0] * o, a[1] + d[1] * s + n[1] * o, z(h)]);
  return hull(P);
};
const edgesOf = (poly) => {
  const P = ccw(poly);
  return P.map((a, i) => [a, P[(i + 1) % P.length]]);
};
// Hoogte buiten de gevel tussen s0 en s1 (maximum over drie punten, 0,8 m buiten de gevel).
const outsideTop = (a, b, s0, s1) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n = [d[1], -d[0]];
  return Math.max(...[s0 + 0.2, (s0 + s1) / 2, s1 - 0.2].map((s) => topAt([a[0] + d[0] * s + n[0] * 0.8, a[1] + d[1] * s + n[1] * 0.8])));
};
// Convexe veelhoek (s, z) afknippen op s0 <= s <= s1.
const clipS = (pts, s0, s1) => {
  const cut = (poly, keep, lerpAt) => {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      if (keep(p)) out.push(p);
      if (keep(p) !== keep(q)) {
        const t = (lerpAt - p[0]) / (q[0] - p[0]);
        out.push([lerpAt, p[1] + t * (q[1] - p[1])]);
      }
    }
    return out;
  };
  return cut(cut(pts, (p) => p[0] >= s0, s0), (p) => p[0] <= s1, s1);
};
const area2 = (pts) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;

// Verdiepingsbanden: per vak (seg) en per laag een glasgroef; `jog` laat de
// groeven per vak op en neer verspringen (de witte banden springen mee),
// `lattice(t, h)` slaat vakken in het vakwerk over. Alleen boven wat er buiten
// de gevel staat en onder het eigen dak.
function bands(a, b, { rows, seg, gap = 0, jog = null, skip = null, top, margin = 0.5, endMargin = 0.6 }) {
  const out = [];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len < 2 * endMargin + 1.0) return out;
  const n = Math.max(1, Math.round((len - 2 * endMargin) / seg));
  const w = (len - 2 * endMargin) / n;
  for (let j = 0; j < n; j++) {
    const s0 = endMargin + j * w + gap / 2;
    const s1 = endMargin + (j + 1) * w - gap / 2;
    const outside = outsideTop(a, b, s0, s1);
    rows.forEach(([z0, z1], k) => {
      const dz = jog ? jog(k, j) : 0;
      const lo = z0 + dz, hi = z1 + dz;
      if (lo < outside + 0.3 || hi > top - margin) return;
      if (skip && skip((s0 + s1) / 2, (lo + hi) / 2)) return;
      out.push(facePrism(a, b, [[s0, lo], [s1, lo], [s1, hi], [s0, hi]]));
    });
  }
  return out;
}
// Driehoeksvakwerk: rijen van `rowH` vanaf `z0`, driehoeken met basis ~W, om
// de rij een halve driehoek verschoven zodat de schuine staven doorlopen;
// elke driehoek is een nis binnen staven van 2 x MEMBER. `zone(t, h)` met t
// de afstand langs de gevel kiest waar het vakwerk staat.
function lattice(a, b, { z0, z1, rowH, W, zone, top, endMargin = MEMBER, member = MEMBER }) {
  const out = [];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.round(len / W));
  const w = len / n;
  for (let r = 0; z0 + (r + 1) * rowH <= z1 + 0.01; r++) {
    const lo = z0 + r * rowH, hi = lo + rowH;
    if (hi > top - 0.2) continue;
    const shift = r % 2 ? w / 2 : 0;
    for (let i = -1; i <= n; i++) {
      const x = shift + i * w;
      for (const tri of [[[x, lo], [x + w, lo], [x + w / 2, hi]], [[x + w / 2, hi], [x + 1.5 * w, hi], [x + w, lo]]]) {
        // Inzetten vanuit het middelpunt van de ingeschreven cirkel.
        const sides = tri.map((p, k) => Math.hypot(tri[(k + 1) % 3][0] - p[0], tri[(k + 1) % 3][1] - p[1]));
        const per = sides[0] + sides[1] + sides[2];
        const I = [0, 1].map((c) => (sides[1] * tri[0][c] + sides[2] * tri[1][c] + sides[0] * tri[2][c]) / per);
        const rIn = (2 * area2(tri)) / per;
        const f = 1 - member / rIn;
        const inset = tri.map((p) => [I[0] + (p[0] - I[0]) * f, I[1] + (p[1] - I[1]) * f]);
        const c = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3];
        if (c[0] < 0 || c[0] > len || !zone(c[0], c[1])) continue;
        const clipped = clipS(inset, endMargin, len - endMargin);
        if (clipped.length < 3 || area2(clipped) < 0.8) continue;
        const outside = outsideTop(a, b, Math.max(0, Math.min(...clipped.map((p) => p[0]))), Math.min(len, Math.max(...clipped.map((p) => p[0]))));
        if (Math.min(...clipped.map((p) => p[1])) < outside + 0.3) continue;
        out.push(facePrism(a, b, clipped));
      }
    }
  }
  return out;
}
const lerp = (h, h0, v0, h1, v1) => v0 + ((Math.min(Math.max(h, Math.min(h0, h1)), Math.max(h0, h1)) - h0) * (v1 - v0)) / (h1 - h0);
const floorRows = ({ first, pitch, count }) => {
  const rows = [[1.2, first - 0.8]]; // entree: één hoge glasstrook
  for (let k = 0; k < count; k++) rows.push([+(first + k * pitch + 1.0).toFixed(2), +(first + k * pitch + pitch - 0.1).toFixed(2)]);
  return rows;
};
const jogged = (k, j) => (k === 0 ? 0 : (k + j) % 4 < 2 ? JOG : -JOG);
const oldRows = (top) => {
  const rows = [];
  for (let b = 1.6; b + 1.8 <= top - 1.0; b += OLD_PITCH) rows.push([+b.toFixed(2), +(b + 1.8).toFixed(2)]);
  return rows;
};

// ---------- bouwdelen ----------
block("City Tower", CITY, H.city, "city");
block("City Tower lager deel", CITY_LOW, H.cityLow, "cityLow");
block("Park Tower", PARK, H.park, "park");
block("Park Tower lager deel", PARK_LOW, H.parkLow, "parkLow");
block("kantoorschijf", SLAB, H.slab, "slab");
block("zuid- en oostvleugel", SOUTH, H.south, "old");
block("westvleugel", WEST, H.west, "old");
block("oude kantoortoren", OFFICE, H.office, "old");
block("middenvleugel", NORTH, H.north, "old");
block("winkelblok west", SHOPS_W, H.shopsW, "old");
block("winkelblok oost", SHOPS_E, H.shopsE, "old");
block("laagbouw west", PODIUM_W, H.podiumW, "old");
block("laagbouw midden", PODIUM_N, H.podiumN, "old");
block("laagbouw zuid", PODIUM_S, H.podiumN, "old");
block("laagbouw oost", PODIUM_E, H.podiumE, "old");
block("laagbouw oost 2", PODIUM_E2, H.podiumN, "old");
block("plint noord", PLINTH_N, H.low, "old");
block("plint west", PLINTH_W, H.low, "old");
// Dakopbouwen (geen gevelreliëf).
block("opbouw schijf", SLAB_BOX, H.slabBox);
block("opbouw zuidvleugel A", SOUTH_BOX_A, H.southBoxA);
block("opbouw zuidvleugel B", SOUTH_BOX_B, H.southBoxB);
block("kantoortoren midden", OFFICE_MID, H.officeMid);
block("kantoortoren top", OFFICE_TOP, H.officeTop);
block("opbouw middenvleugel A", NORTH_BOX_A, H.northBoxA);
block("opbouw middenvleugel B", NORTH_BOX_B, H.northBoxB);
block("opstand Park Tower", [[68.6, 77.0], [70.8, 77.0], [70.8, 96.0], [68.6, 96.0]], H.parkRim);
block("installatie Park Tower", [[72.5, 83.0], [76.0, 83.0], [76.0, 88.5], [72.5, 88.5]], H.parkBox);

let model = union([prism(FOOT, BASE, z(H.low)), ...BLOCKS.map((b) => prism(b.poly, BASE, z(b.top)))]);

// Open binnenhof.
model = model.subtract(prism(COURT, 0.0, z(60)));
// City Tower: open vakwerkkaders aan beide smalle einden van het dak (AHN
// 137-139 tegen 142,5 op het dak), 2 m diep binnen een rand van 0,9 m.
model = model.subtract(union([
  prism([[-28.0, 40.6], [-17.4, 40.6], [-17.4, 42.6], [-28.0, 42.6]], z(139.4), z(150)),
  prism([[-28.0, 8.4], [-10.9, 8.4], [-10.9, 10.4], [-28.0, 10.4]], z(139.4), z(150)),
]));

// Schijf op V-kolommen: onder +33 ligt de west- en noordgevel 1,5 m terug,
// boven de glazen plint (+9,4) bij het hotel en vanaf de straat oostelijker.
{
  const W = -27.6, N = 106.4;
  const recess = [
    prism([[W - 1, 78.5 - 1], [W + RECESS, 78.5 - 1], [W + RECESS, N + 1], [W - 1, N + 1]], z(H.low), z(H.slabBottom)),
    prism([[W - 1, N - RECESS], [8.75, N - RECESS], [8.75, N + 1], [W - 1, N + 1]], z(H.low), z(H.slabBottom)),
    prism([[8.75, N - RECESS], [61.0, N - RECESS], [61.0, N + 1], [8.75, N + 1]], 0, z(H.slabBottom)),
  ];
  // Het hotel tot aan de westgevel van de schijf ligt niet verder terug dan de schijfvoet.
  // Hotel en lagere gevels in de terugligging: vensterbanden op 3,3 m (foto's),
  // vóór de V-kolommen uitgesneden zodat die de banden niet insnijden.
  const hotelRows = [];
  for (let b = 10.4; b + 2.0 <= H.slabBottom - 0.6; b += 3.3) hotelRows.push([+b.toFixed(2), +(b + 2.0).toFixed(2)]);
  const inner = [];
  const back = (a, c, from) => {
    const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const n = Math.round((len - 1.2) / 3.6);
    const w = (len - 1.2) / n;
    for (let j = 0; j < n; j++)
      for (const [z0, z1] of hotelRows.concat(from < H.low ? [[1.6, 3.4], [5.2, 7.0]] : []))
        if (z0 >= from) inner.push(facePrism(a, c, [[0.6 + j * w + 0.45, z0], [0.6 + (j + 1) * w - 0.45, z0], [0.6 + (j + 1) * w - 0.45, z1], [0.6 + j * w + 0.45, z1]], NICHE, 0.05));
  };
  back([W + RECESS, N - RECESS], [W + RECESS, 78.5], H.low); // westgevel (hotel), naar het zuiden
  back([8.75, N - RECESS], [W + RECESS, N - RECESS], H.low); // noordgevel boven de plint
  back([61.0, N - RECESS], [8.75, N - RECESS], 0.6); // noordgevel vanaf de straat
  model = model.subtract(union([...recess, ...inner]));
  const legs = [];
  const leg = (foot, head, z0, axis, face) => {
    // axis 'v': gevel u = face (diepte +u), anders gevel v = face (diepte -v).
    const sec = (c, h0, h1) =>
      axis === "v"
        ? [[face, c - 0.6, h0], [face + RECESS, c - 0.6, h0], [face, c + 0.6, h0], [face + RECESS, c + 0.6, h0], [face, c - 0.6, h1], [face + RECESS, c - 0.6, h1], [face, c + 0.6, h1], [face + RECESS, c + 0.6, h1]]
        : [[c - 0.6, face, h0], [c - 0.6, face - RECESS, h0], [c + 0.6, face, h0], [c + 0.6, face - RECESS, h0], [c - 0.6, face, h1], [c - 0.6, face - RECESS, h1], [c + 0.6, face, h1], [c + 0.6, face - RECESS, h1]];
    const p = [...sec(foot, z0 - 0.05, z0 + 0.3), ...sec(head, z(H.slabBottom) - 0.3, z(H.slabBottom) + 0.3)];
    return hull(p.map(([a, b, c]) => [a, b, c]));
  };
  for (const c of V_WEST) for (const s of [-1, 1]) legs.push(leg(c, c + s * 2.6, z(H.low), "v", W));
  for (const c of V_NORTH) {
    const z0 = c < 8.75 ? z(H.low) : 0;
    for (const s of [-1, 1]) legs.push(leg(c, c + s * 2.6, z0, "u", N));
  }
  for (const c of PILLAR_NORTH) legs.push(leg(c, c, 0, "u", N));
  model = union([model, ...legs]);
}

// ---------- gevelreliëf ----------
const cuts = [];
const cityRows = floorRows(CITY_FLOOR);
const parkRows = floorRows(PARK_FLOOR);
// Vakwerkzones (t = afstand langs de gevel vanaf het begin van de rand).
// City Tower, zuidwestgevel (rand van noordwest naar zuidoost, t vanaf de
// noordhoek): bovenaan de hele gevel, naar beneden smaller tot t 9,5..23 vanaf
// de noordhoek (foto's frontaal op de gevel: 13..26,5 m vanaf de zuidhoek).
const piecewise = (h, pts) => {
  for (let i = 0; i + 1 < pts.length; i++) if (h <= pts[i + 1][0]) return lerp(h, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  return pts[pts.length - 1][1];
};
const CITY_SW_FROM = [[5, 14], [40, 10.5], [80, 10], [117, 2], [142, 0]]; // zuidrand van het vakwerk (m vanaf de zuidhoek)
const CITY_SW_TO = [[5, 26.5], [104, 25], [118, 36], [142, 36]]; // noordrand
const citySW = (t, h) => {
  const fromSouth = 36 - t;
  return fromSouth >= piecewise(h, CITY_SW_FROM) - 0.5 && fromSouth <= piecewise(h, CITY_SW_TO) + 0.5;
};
const CITY_CROWN = 118.0; // vakwerkkroon boven het lagere bouwdeel (noordoost) en op de noordwestgevel
const PARK_CROWN = 84.0; // vakwerkkroon boven het lagere bouwdeel
const PARK_EAST_FROM = 18.0; // vakwerk op de oostgevel vanaf de vijfde verdieping
for (const b of BLOCKS) {
  if (!b.scheme) continue;
  for (const [a, c] of edgesOf(b.poly)) {
    const dir = [c[0] - a[0], c[1] - a[1]];
    const n = [dir[1], -dir[0]];
    const facing = Math.abs(n[0]) > Math.abs(n[1]) ? (n[0] > 0 ? "NE" : "SW") : n[1] > 0 ? "NW" : "SE";
    if (b.scheme === "city") {
      const lat =
        facing === "SW" ? citySW : facing === "NE" || facing === "NW" ? (t, h) => h >= CITY_CROWN : () => false;
      cuts.push(...bands(a, c, { rows: cityRows, seg: 6.0, jog: jogged, skip: lat, top: b.top }));
      cuts.push(...lattice(a, c, { z0: CITY_FLOOR.first, z1: H.city - 0.5, rowH: 2 * CITY_FLOOR.pitch, W: 6.0, zone: lat, top: b.top }));
    } else if (b.scheme === "cityLow") {
      cuts.push(...bands(a, c, { rows: cityRows, seg: 6.0, jog: jogged, top: b.top }));
    } else if (b.scheme === "park") {
      const east = facing === "NE";
      const lat = east ? (t, h) => h >= PARK_EAST_FROM : (t, h) => h >= PARK_CROWN;
      cuts.push(...bands(a, c, { rows: parkRows, seg: 6.0, jog: jogged, skip: lat, top: b.top }));
      cuts.push(...lattice(a, c, { z0: PARK_FLOOR.first, z1: H.park - 0.5, rowH: 2 * PARK_FLOOR.pitch, W: 6.0, zone: lat, top: b.top }));
    } else if (b.scheme === "parkLow") {
      cuts.push(...bands(a, c, { rows: parkRows, seg: 6.0, jog: jogged, top: b.top }));
    } else if (b.scheme === "slab") {
      // West- en noordgevel liggen onder de schijf terug: daar geen banden onder +33.
      const recessed = facing === "SW" || facing === "NW";
      if (!recessed) cuts.push(...bands(a, c, { rows: oldRows(H.slabBottom), seg: 7.2, gap: 0.9, top: H.slabBottom + 0.5 }));
      // Twee lagen driehoeksvakwerk en de bovenste glaslaag.
      cuts.push(...lattice(a, c, { z0: 33.4, z1: 41.3, rowH: 3.95, W: 4.6, zone: () => true, top: b.top, member: 0.4 }));
      cuts.push(...bands(a, c, { rows: [[41.8, 44.2]], seg: 8.0, gap: 0.9, top: b.top, margin: 0.3 }));
    } else if (b.scheme === "old") {
      cuts.push(...bands(a, c, { rows: oldRows(b.top), seg: 7.2, gap: 0.9, top: b.top, margin: 1.0 }));
    }
  }
}
model = model.subtract(union(cuts));
// Nissen die door een aangrenzend bouwdeel worden afgedekt, worden ingesloten
// holtes: die vallen weg.
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
model = model.translate([-HEART[0], -HEART[1], 0]);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 20);
console.log("ondervlakken > 20 m2:", JSON.stringify(down));
console.log("nissen:", cuts.length, "origin", ORIGIN, "xAxis", X_AXIS);

// Hulp voor de catalogus: meetstelsel -> modelstelsel.
const m = ([u, v]) => [+(u - HEART[0]).toFixed(2), +(v - HEART[1]).toFixed(2)];
await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:New Babylon met City Tower Park Tower kantoorschijf en het oude Babylon", model]],
  catalog: {
    name: "New Babylon",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straten rondom: Bezuidenhoutseweg (AHN-DTM +0,5..+0,6), Koningin
    // Julianaplein (+0,7), Anna van Buerenplein (+0,75) en de oostkant (+0,7).
    groundSamplePoints: [m([0, 112]), m([30, 112]), m([-33, 30]), m([40, -3]), m([85, 55])],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000237257"],
    description:
      "Oorsprong midden in het complex op straatniveau NAP +0,6 m, +X op 37,45 graden in RD langs de gevels (naar de Park Tower), +Y naar het noordwesten (Bezuidenhoutseweg); City Tower (+142,5, lager L-deel +121,6, inham in de noordhoek) met verspringende verdiepingsbanden en een driehoeksvakwerk over de zuidwestgevel en de kroon, Park Tower (+102,3, schuine oostgevel in het vakwerk, lager L-deel +87,4), kantoorschijf (+33..+45,9) met vakwerk op V-kolommen boven het hotel, en het oude Babylon (+9,4..+54,8) met binnenhof; gevelritme, vakwerkzones en de onderkant van de schijf uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      cityTowerNapM: H.city,
      cityTowerLowNapM: H.cityLow,
      parkTowerNapM: H.park,
      parkTowerLowNapM: H.parkLow,
      slabNapM: [H.slabBottom, H.slab],
      oldBabylonNapM: [H.low, H.podiumN, H.podiumW, H.shopsW, H.west, H.south, H.office, H.officeTop],
      cityTowerPlanM: [18.9, 36.0],
      parkTowerPlanM: [21.8, 34.1],
      storeyPitchM: { city: CITY_FLOOR.pitch, park: PARK_FLOOR.pitch },
      axisDegrees: AXIS_DEG,
      estimates: [
        "verdiepingsbanden: 44 lagen van 3,1 m (City Tower) en 30 van 3,2 m (Park Tower) boven een entree tot +5,6, per vak van circa 6 m 0,3 m op en neer verspringend, uit foto's",
        "driehoeksvakwerk: rijen van twee lagen, driehoeken van circa 6 m breed, staven van 0,9 m; de zone op de zuidwestgevel van de City Tower (onderaan 13-26,5 m vanaf de zuidhoek, vanaf +118 de hele gevel), de kronen vanaf +118 en +84 en de oostgevel van de Park Tower vanaf +18 uit foto's",
        "kantoorschijf: onderkant +33,0 en twee vakwerklagen van 3,95 m met driehoeken van 4,6 m uit een frontale foto; de gevel eronder 1,5 m terug met V-kolommen van 1,2 m",
        "open vakwerkkaders op beide smalle einden van het dak van de City Tower als goten van 2 m (AHN 137-139 tegen 142,5)",
        "vensterbanden van het oude Babylon en de laagbouw: 1,8 m hoog op 3,6 m, vakken van 7,2 m",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100000237257, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000237257 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes en -contouren van alle bouwdelen",
      "https://nl.wikipedia.org/wiki/Babylon_(Den_Haag)",
      "https://en.wikipedia.org/wiki/New_Babylon,_The_Hague",
      "https://commons.wikimedia.org/wiki/File:City_Tower_The_Hague.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Nieuw_Babylon_08.jpg",
      "https://commons.wikimedia.org/wiki/File:Park_Tower_The_Hague_2026.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_New_Babylon_2025-06-12.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Nieuw_Babylon_05.jpg",
      "https://commons.wikimedia.org/wiki/File:Park_Tower_Den_Haag.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Nieuw_Babylon_03.jpg",
      "https://commons.wikimedia.org/wiki/File:Nieuw_Babylon_The_Hague_2017_4.jpg",
    ],
  },
});
