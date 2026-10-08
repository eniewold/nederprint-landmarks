// Genereert een vereenvoudigd, gesloten 3D-model van Fata Morgana (1986), de
// boot-darkride in het themagebied Anderrijk van de Efteling in Kaatsheuvel:
// de witte "verboden stad" aan de zuidoever van de Vonderplas. Het complex is
// één BAG-pand van 180 bij 60 m met platte daken op vijf hoogtes en
// gekanteelde borstweringen rondom; erop staan de torens en koepels die het
// silhouet maken. De boten varen helemaal binnen (instap op een draaischijf),
// dus er is geen echte waterpoort; de "poorten" aan het water zijn de
// arcadepaviljoens tegen de gevel. Alle maten in het script zijn meters op
// ware grootte. Uitvoer via scripts/efteling-kit.mjs: een GLB in meters (Y
// omhoog, nodes `klasse:label`), de catalogus-JSON en een binaire STL op
// 1:<schaal>.
//
//   node scripts/generate-efteling-fata-morgana.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-fata-morgana.mjs --scale 500
//
// Onderdelen (nodes):
// - building:paleis: de daken per zone op de BAG-contour (AHN-DSM-mediaan per
//   zone): de westhal +16,9 m, het hogere zuidwestblok +18,8 m, het
//   middendeel +14,1 m, de oostelijke hallen en de oostvleugel +13,3 m, de
//   bazaar +11,4/+12,3 m en de noordvleugel van de oostvleugel +11,8 m, plus
//   de tonhal (goot +17,2 m, kruin +19,05 m). Elke zone heeft een
//   borstwering van 0,9 m dik en 0,7 m hoog met kantelen van 0,9 m om de 2 m.
//   Aan het water (noordgevel, van west naar oost): de hoektoren met de witte
//   koepel, het erkertorentje met de blauwe uikoepel, de witte koepel, de
//   grote poorttoren (onderbouw 6,2 bij 6,7 m tot +20,8 m met een spitse
//   nis, bovenbouw 4,6 m tot +24,2 m, blauwe uikoepel tot +27,4 m), het
//   paviljoen met de groene schilddakarcade (vier spitse bogen) voor een
//   gekanteeld blok, de grijze koepel op een zeshoekige trommel (+21,6 m) en
//   de gouden koepel op een vierkant torenblok (+21,9 m) met het
//   poortpaviljoen met vier hoge spitse bogen ervoor. Verder de witte
//   koepeltoren (+22,6 m) en de koepels op het middendeel, de bazaar en de
//   zuidhoeken, en spitse nissen in de gevels aan het water en aan het plein.
// - building:minaret: de minaret op het plein (+34,3 m in het AHN): vierkante
//   onderbouw van 4,2 m tot +18,35 m met een galerij op een kraag van 45
//   graden, een achtkante schacht van 3 m, de bovengalerij (+29,85 m), de
//   lantaarn en de geribde koepel met de top.
// - building:kade: de witte balustrade langs de waterkant voor het paleis
//   (0,9 m dik, 1,05 m boven de kade, pijlers om de ~6 m met een knop), tot
//   onder het wateroppervlak.
// - building:oase: het oosterse paviljoen (BAG 0809100000017608, 1986) op het
//   terras aan het water met een tentdak tot +14,3 m.
// Het water zelf zit in het PDOK-terrein en niet in het model.
//
// Printbaar op 1:1000 zonder steun: de daken en torens staan recht op hun
// onderbouw, koepels zijn omwentelingen zonder uitkraging behalve de uien
// (flank onder 34 graden), de galerijen van de minaret en het erkertorentje
// rusten op een kraag van 45 graden, nissen hebben een spitse top van 60
// graden en kantelen zijn blokken van 0,9 m. Alle onderdelen beginnen op
// dezelfde vlakke onderkant op NAP +7,65 m (1 m onder het maaiveld, onder het
// water van de Vonderplas).
//
// Assenstelsel: oorsprong op RD (131365,0, 406522,0), midden op het BAG-pand,
// op het maaiveld (NAP +8,65 m), Z omhoog. +X loopt langs de lange
// zuidgevel naar het oost-zuidoosten (RD-richting (0,99357, -0,11318), 6,5
// graden rechtsom van het oosten), +Y naar het noord-noordoosten, naar het
// water. Alle coördinaten hieronder staan in dat stelsel.
//
// Bronnen: BAG-pand 0809100000017609 (contour, bouwjaar 1984) en
// 0809100000017608 (oase); BGT waterdeel (de oever langs de gevel); AHN
// DSM/DTM 0,5 m (PDOK WCS, als raster per 0,5 m in het stelsel van het
// gebouw): dakhoogtes per zone, de tonhal, de plaats en hoogte van elke toren
// en koepel, de minaret; PDOK luchtfoto 8 cm (zeshoekige trommel, kantelen,
// koepelkleuren); Wikimedia Commons-foto's (Category:Fata Morgana (Efteling))
// voor de opstand: de gevel aan het water, de poorttoren, de arcades en de
// minaret; nl.wikipedia (opening 1986, rit binnen met draaischijf).
// Geschat uit foto's: de vorm van de koepels en uien, de bovenbouw van de
// poorttoren (verhoudingen uit een frontale foto met de AHN-top als maat), de
// minaretgeledingen (idem), de nissen en arcades (aantal uit de foto's, maten
// geschat), de kantelmaat (grover dan echt) en de balustrade.
import {
  CrossSection,
  Manifold,
  box,
  circle,
  ccw,
  downFaces,
  hull,
  prism,
  rect,
  ring3,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- maten ----------
const ORIGIN = [131365.0, 406522.0];
const X_AXIS = [0.993575, -0.113178];
const GROUND_NAP = 8.65;
const Z = (nap) => nap - GROUND_NAP;
const BASE = -1.0;

// BAG-pand 0809100000017609 in het lokale stelsel (op 0,01 m).
const FOOT = [
  [-90.29, 21.96], [-90.28, 16.13], [-87.86, 16.11], [-87.79, -19.94], [-58.19, -19.91], [-58.18, -22.76], [-51.18, -22.75],
  [-51.19, -19.9], [-47.57, -16.26], [-40.27, -16.27], [-34.0, -22.5], [-31.28, -22.46], [-31.27, -24.16], [-21.48, -24.15],
  [-21.46, -25.55], [-4.68, -25.52], [-4.68, -24.11], [2.78, -24.08], [2.87, -26.94], [89.15, -26.94], [88.79, -3.4],
  [89.14, -2.36], [87.99, -2.36], [88.0, -2.79], [58.63, -2.95], [58.57, 8.08], [60.37, 8.07], [60.41, 14.79], [56.77, 14.76],
  [56.7, 21.35], [46.02, 21.27], [46.13, 2.19], [52.33, 2.23], [52.36, -2.78], [45.9, -2.81], [45.94, -10.58], [34.06, -10.65],
  [34.02, -9.99], [6.54, -10.39], [6.65, 1.18], [-1.78, 0.95], [-1.79, 13.03], [7.01, 12.95], [6.98, 25.58], [-7.39, 25.45],
  [-7.35, 16.02], [-31.1, 15.88], [-31.12, 22.12], [-27.62, 22.15], [-27.65, 31.98], [-37.48, 31.96], [-37.47, 28.65],
  [-60.46, 28.79], [-60.29, 21.16], [-84.45, 21.17], [-84.44, 21.94], [-90.29, 21.96],
].slice(0, -1);
// BAG-pand 0809100000017608 (oase), een vierkant van 6,5 m dat 45 graden op het stelsel staat.
const OASE = [[15.85, 56.84], [11.12, 52.41], [15.58, 47.71], [20.28, 52.3]];
// Oever van de Vonderplas (BGT waterdeel): y = 24,4 tot x = -63, dan naar het
// noorden tot y = 37,35 en verder naar het oosten tot x = -21,5.
const SHORE = [[-94, 24.4], [-63.0, 24.4], [-63.0, 37.35], [-21.5, 37.4]];

// Dakzones (rechthoeken, afgesneden op de BAG-contour) met de dakhoogte (NAP)
// als mediaan van het AHN-DSM per zone.
const ZONES = [
  { name: "westhal", top: 16.9, rects: [[-91, -21, -37, 33], [-37, -11, -31, 33], [-31, 4.5, -17.8, 17]] },
  { name: "zuidwestblok", top: 18.8, rects: [[-88.5, -20.5, -63.3, -6]] },
  { name: "middendeel", top: 14.1, rects: [[-31, -27, 2, 4.5]] },
  {
    name: "oostelijke hallen",
    top: 13.3,
    rects: [[-37, -27, -31, -11], [-17.8, 4.5, -1.8, 16], [2, -27.2, 90, -10.3], [36, -27.2, 90, -2.2], [45.8, -3.5, 61, 9]],
  },
  { name: "zuidstrook", top: 11.6, rects: [[2, -27.2, 36, -22]] },
  { name: "doorgang minaret", top: 11.5, rects: [[2, -10.3, 6.8, 1.3]] },
  { name: "bazaar west", top: 11.4, rects: [[-7.6, 16, 1, 26], [-1.8, 12.8, 1, 16]] },
  { name: "bazaar oost", top: 12.3, rects: [[1, 12.8, 7.2, 26]] },
  { name: "oostvleugel noord", top: 11.8, rects: [[45.8, 9, 61, 21.5]] },
];
const PARAPET = { thick: 0.9, high: 0.7, merlon: 0.9, merlonHigh: 0.8, pitch: 2.0 };
// Tonhal in het oosten (AHN: goot +17,2 m, kruin +19,05 m over 10,4 m breed).
const BARREL = { x0: 53.6, x1: 86.0, y0: -19.6, y1: -9.2, eave: 17.2, crown: 19.05 };

// Torens en koepels (plaats en top uit het AHN-DSM, vorm uit foto's).
const GATE_TOWER = { x0: -60.4, x1: -54.2, y0: 23.6, y1: 30.3, top: 20.8, upper: 4.6, upperTop: 24.2, domeR: 1.9, domeTop: 27.4, finial: 29.0 };
const MINARET = { c: [5.35, -0.8], base: 4.2, baseTop: 18.35, balcony: 4.9, balconyTop: 19.7, shaft: 3.0, shaftTop: 28.15, gallery: 4.1, galleryTop: 29.85, lantern: 2.5, lanternTop: 31.6, domeR: 1.32, domeTop: 34.3, finial: 35.0 };

// Maaiveld: punten op het plein, langs de zuid- en westgevel en bij de
// oostvleugel (AHN-DTM NAP +8,57 tot +8,73 m), niet op de kade of het water.
const GROUND_SAMPLES = [[18, 4], [-45, -25], [40, -30], [-94, -8], [66, 10]];

// ---------- hulpfuncties ----------
const cs = (pts) => new CrossSection([ccw(pts)]);
const csRect = ([x0, y0, x1, y1]) => cs(rect(x0, y0, x1, y1));
const FOOT_CS = cs(FOOT);
const extrudeCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const deg = Math.PI / 180;

// Spitse nis: breedte w, rechte hoogte h vanaf z0 (NAP), spits van 60 graden,
// diepte d de muur in. (x, y) ligt op het gevelvlak, `normal` is de richting
// van de buitennormaal in graden (0 = +X, 90 = +Y).
function niche(x, y, normal, z0, w, h, d = 0.4) {
  const apex = (w / 2) * Math.tan(60 * deg);
  const prof = [[-w / 2, 0], [w / 2, 0], [w / 2, h], [0, h + apex], [-w / 2, h]];
  const pts = [];
  for (const v of [-d, 0.3]) for (const [u, z] of prof) pts.push([u, v, Z(z0) + z]);
  return hull(pts)
    .rotate([0, 0, (normal - 90)])
    .translate([x, y, 0]);
}
// Rij van n nissen langs een gevel van (ax, ay) naar (bx, by).
function nicheRow([ax, ay], [bx, by], normal, n, z0, w, h, d) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    out.push(niche(ax + (bx - ax) * t, ay + (by - ay) * t, normal, z0, w, h, d));
  }
  return out;
}
// Kantelen langs de contouren van een doorsnede: blokken van m langs de rand,
// `thick` naar binnen, op een onderlinge afstand van ongeveer `pitch`.
function merlons(section, z0, z1, { merlon, thick, pitch }) {
  const out = [];
  for (const poly of section.toPolygons()) {
    const pts = poly.map((p) => [p[0], p[1]]);
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < merlon + 0.2) continue;
      const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      // Contouren van toPolygons zijn linksom (buiten) of rechtsom (gat): links is binnen.
      const n = [-d[1], d[0]];
      const count = Math.max(1, Math.round((len - merlon) / pitch) + 1);
      const step = count > 1 ? (len - merlon) / (count - 1) : 0;
      for (let k = 0; k < count; k++) {
        const s = count > 1 ? k * step : (len - merlon) / 2;
        const p0 = [a[0] + d[0] * s, a[1] + d[1] * s];
        const p1 = [p0[0] + d[0] * merlon, p0[1] + d[1] * merlon];
        out.push(prism([p0, p1, [p1[0] + n[0] * thick, p1[1] + n[1] * thick], [p0[0] + n[0] * thick, p0[1] + n[1] * thick]], z0, z1));
      }
    }
  }
  return out;
}
// Dak met borstwering en kantelen voor een doorsnede op hoogte top (NAP).
function roofZone(section, top) {
  const t = Z(top);
  const inner = section.offset(-PARAPET.thick, "Miter", 2);
  const ringTop = t + PARAPET.high;
  return union([
    extrudeCs(section, BASE, t),
    extrudeCs(section.subtract(inner), t - 0.05, ringTop),
    // Kantelen afgesneden op de zone, zodat ze bij scherpe hoeken niet over de gevel hangen.
    union(merlons(section, ringTop - 0.05, ringTop + PARAPET.merlonHigh, PARAPET)).intersect(extrudeCs(section, ringTop - 0.1, ringTop + PARAPET.merlonHigh + 0.1)),
  ]);
}
// Vierkant blok (rechthoek) van z0 tot z1 (NAP) met kantelen.
function crenBlock(x0, y0, x1, y1, z0, z1, m = { merlon: 0.9, thick: 0.9, pitch: 1.8, high: 0.8 }) {
  const s = csRect([x0, y0, x1, y1]);
  return union([extrudeCs(s, Z(z0), Z(z1)), ...merlons(s, Z(z1) - 0.05, Z(z1) + m.high, m)]);
}
// Koepel als omwenteling: profiel [[r, zNAP], ...] van onder naar boven. De
// voet zakt 6 cm in wat eronder staat, zodat de delen overlappen.
function domeAt(c, profile, segments = 32) {
  const z0 = Z(profile[0][1]) - 0.06;
  const pts = [[0, z0], [profile[0][0], z0], ...profile.map(([r, z]) => [r, Z(z)]), [0, Z(profile[profile.length - 1][1])]];
  return Manifold.revolve(new CrossSection([ccw(pts)]), segments).translate([c[0], c[1], 0]);
}
// Halfbolkoepel met een licht spitse top, straal r, van z0 tot top (NAP).
const roundDome = (c, r, z0, top, segments = 32) => {
  const h = top - z0;
  const prof = [];
  for (let i = 0; i <= 8; i++) {
    const t = (i / 8) * (Math.PI / 2);
    prof.push([Math.max(0.05, r * Math.cos(t)), z0 + h * Math.sin(t)]);
  }
  return domeAt(c, prof, segments);
};
// Uikoepel: hals, bol (breedste punt r op 30 % van de hoogte), punt.
const onionDome = (c, r, z0, top, segments = 32) => {
  const h = top - z0;
  return domeAt(
    c,
    [[0.8 * r, z0], [0.97 * r, z0 + 0.18 * h], [r, z0 + 0.3 * h], [0.93 * r, z0 + 0.48 * h], [0.7 * r, z0 + 0.66 * h], [0.38 * r, z0 + 0.82 * h], [0.12, z0 + 0.97 * h], [0.05, top]],
    segments,
  );
};
// Top met halve maan als slanke kegel van 0,35 m straal.
const finial = (c, z0, top) => Manifold.cylinder(Z(top) - Z(z0), 0.35, 0.05, 12).translate([c[0], c[1], Z(z0)]);
// Ronde trommel (n zijden) van z0 tot z1 (NAP).
const drum = (c, r, z0, z1, n = 32, phase = 0) => prism(circle(c, r, n, phase), Z(z0), Z(z1));
// Kraag van 45 graden: van een vierkant/veelhoek met straal r0 op z0 naar r1 op z0 + (r1 - r0).
const corbel = (c, r0, r1, z0, n = 4, phase = Math.PI / 4) =>
  hull([...ring3(circle(c, r0, n, phase), Z(z0)), ...ring3(circle(c, r1, n, phase), Z(z0) + (r1 - r0) + 0.02)]);

// ---------- paleis ----------
const parts = [];
const cuts = [];
for (const zone of ZONES) {
  const section = CrossSection.union(zone.rects.map(csRect)).intersect(FOOT_CS);
  parts.push(roofZone(section, zone.top));
}
// De poorttoren en het gekanteelde blok achter de arcade steken buiten de
// BAG-contour naar het water uit (AHN: tot y = 30,3 en 31,0).
// Tonhal: wanden tot de goot en een cirkelsegment tot de kruin.
{
  const { x0, x1, y0, y1, eave, crown } = BARREL;
  const w = y1 - y0;
  const rise = crown - eave;
  const R = (w * w) / 4 / (2 * rise) + rise / 2;
  const yc = (y0 + y1) / 2;
  const arc = [];
  for (let i = 0; i <= 16; i++) {
    const y = y0 + (w * i) / 16;
    const dz = Math.sqrt(Math.max(0, R * R - (y - yc) ** 2)) - (R - rise);
    arc.push([y, Z(eave) + Math.max(0, dz)]);
  }
  parts.push(box(x0, y0, Z(13.3) - 0.1, x1, y1, Z(eave)));
  parts.push(hull([...arc.map(([y, z]) => [x0, y, z]), ...arc.map(([y, z]) => [x1, y, z]), [x0, y0, Z(eave) - 0.05], [x1, y0, Z(eave) - 0.05], [x0, y1, Z(eave) - 0.05], [x1, y1, Z(eave) - 0.05]]));
}

// Noordwesthoektoren met witte koepel.
parts.push(crenBlock(-89.9, 16.8, -84.8, 21.95, GROUND_NAP - 1, 18.6));
parts.push(drum([-87.35, 19.35], 2.1, 18.5, 19.0));
parts.push(roundDome([-87.35, 19.35], 2.1, 19.0, 20.6));
parts.push(finial([-87.35, 19.35], 20.5, 21.3));
// Erkertorentje met blauwe uikoepel op de muur (kraag van 45 graden naar het water).
parts.push(box(-75.1, 19.2, Z(14.5), -72.5, 22.0, Z(19.2)));
parts.push(hull([[-75.1, 21.16, Z(13.66)], [-72.5, 21.16, Z(13.66)], [-75.1, 21.16, Z(14.52)], [-72.5, 21.16, Z(14.52)], [-75.1, 22.0, Z(14.52)], [-72.5, 22.0, Z(14.52)]]));
parts.push(drum([-73.8, 20.6], 0.95, 19.15, 19.5, 16));
parts.push(onionDome([-73.8, 20.6], 1.1, 19.5, 20.9, 24));
parts.push(finial([-73.8, 20.6], 20.8, 21.4));
cuts.push(niche(-73.8, 22.0, 90, 16.8, 0.9, 1.3, 0.35));
// Witte koepel achter de muur.
parts.push(drum([-66.0, 18.8], 2.2, 16.8, 17.5));
parts.push(roundDome([-66.0, 18.8], 2.2, 17.5, 19.9));
parts.push(finial([-66.0, 18.8], 19.8, 20.6));
// Spitse vensternissen in de lange muur aan het water.
cuts.push(...nicheRow([-84.4, 21.17], [-60.3, 21.16], 90, 4, 13.6, 0.9, 1.5, 0.35));

// Grote poorttoren: onderbouw met spitse nis, bovenbouw met twee vensters per
// zijde, kantelen, blauwe uikoepel en top.
{
  const g = GATE_TOWER;
  const c = [(g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2];
  parts.push(crenBlock(g.x0, g.y0, g.x1, g.y1, GROUND_NAP - 1, g.top, { merlon: 0.9, thick: 0.9, pitch: 1.6, high: 0.8 }));
  const u = g.upper / 2;
  parts.push(crenBlock(c[0] - u, c[1] - u, c[0] + u, c[1] + u, g.top - 0.1, g.upperTop, { merlon: 0.9, thick: 0.9, pitch: 1.5, high: 0.7 }));
  parts.push(drum(c, 1.75, g.upperTop - 0.05, g.upperTop + 0.4, 24));
  parts.push(onionDome(c, g.domeR, g.upperTop + 0.4, g.domeTop, 32));
  parts.push(finial(c, g.domeTop - 0.1, g.finial));
  // Spitse nis in de noordgevel (de poortboog) en twee vensters per zijde boven.
  cuts.push(niche(c[0], g.y1, 90, 10.4, 2.8, 5.0, 0.45));
  cuts.push(niche(c[0], g.y1, 90, 17.0, 1.0, 1.6, 0.35));
  for (const [dx, dy, nrm] of [[0, u, 90], [0, -u, 270], [u, 0, 0], [-u, 0, 180]]) {
    const along = nrm === 90 || nrm === 270 ? [1, 0] : [0, 1];
    for (const s of [-0.9, 0.9]) cuts.push(niche(c[0] + dx + along[0] * s, c[1] + dy + along[1] * s, nrm, 21.6, 0.9, 1.3, 0.35));
  }
}
// Gekanteeld blok met twee vensters achter de arcade, en de arcade met het
// groene schilddak (vier spitse bogen) aan het water.
parts.push(crenBlock(-54.25, 28.0, -47.5, 31.0, GROUND_NAP - 1, 16.6));
cuts.push(...nicheRow([-53.6, 31.0], [-50.4, 31.0], 90, 2, 13.4, 0.9, 1.4, 0.35));
parts.push(box(-55.5, 30.9, BASE, -46.7, 33.3, Z(11.4)));
parts.push(hull([[-55.5, 33.3, Z(11.35)], [-46.7, 33.3, Z(11.35)], [-55.5, 30.95, Z(11.35)], [-46.7, 30.95, Z(11.35)], [-54.6, 30.95, Z(12.55)], [-47.6, 30.95, Z(12.55)]]));
cuts.push(...nicheRow([-55.5, 33.3], [-46.7, 33.3], 90, 4, 8.65, 1.4, 1.6, 0.45));
// Grijze koepel op een zeshoekige trommel.
parts.push(drum([-43.6, 24.6], 4.4, 16.8, 17.8, 6, 0));
parts.push(roundDome([-43.6, 24.6], 3.8, 17.8, 21.6, 40));
parts.push(finial([-43.6, 24.6], 21.5, 22.5));
// Gouden koepel op een vierkant torenblok, met het poortpaviljoen (vier hoge
// spitse bogen) ervoor aan het water.
parts.push(crenBlock(-36.0, 23.0, -29.2, 29.8, GROUND_NAP - 1, 18.9));
parts.push(drum([-32.6, 26.4], 2.7, 18.85, 19.3));
parts.push(roundDome([-32.6, 26.4], 2.7, 19.3, 21.9));
parts.push(finial([-32.6, 26.4], 21.8, 22.8));
parts.push(crenBlock(-37.45, 28.6, -27.65, 32.0, GROUND_NAP - 1, 13.0));
cuts.push(...nicheRow([-37.45, 32.0], [-27.65, 32.0], 90, 4, 8.65, 1.5, 2.6, 0.45));
// Witte koepeltoren en het torentje ernaast op de westhal.
parts.push(crenBlock(-21.8, 11.8, -17.2, 16.2, GROUND_NAP - 1, 18.6));
parts.push(onionDome([-19.5, 14.0], 2.0, 18.6, 22.6));
parts.push(finial([-19.5, 14.0], 22.5, 23.3));
parts.push(box(-18.6, 6.0, BASE, -16.4, 8.0, Z(18.4)));
parts.push(roundDome([-17.5, 7.0], 0.95, 18.4, 20.3, 20));
// Koepel op de trommel achter de bazaar en de bazaarkoepel.
parts.push(drum([-7.7, 12.5], 2.3, 13.3, 15.2, 8, Math.PI / 8));
parts.push(roundDome([-7.7, 12.5], 2.1, 15.2, 17.2));
parts.push(drum([4.8, 16.2], 2.0, 12.25, 12.9));
parts.push(roundDome([4.8, 16.2], 2.0, 12.9, 14.9));
parts.push(finial([4.8, 16.2], 14.8, 15.5));
// Bazaar: arcade van vier spitse bogen aan het plein (oostgevel).
cuts.push(...nicheRow([6.98, 14.0], [6.98, 25.0], 0, 4, 8.65, 1.5, 1.6, 0.4));
// Ingang aan het plein (noordgevel van de oostelijke hallen): zes spitse nissen.
cuts.push(...nicheRow([8.0, -10.4], [33.0, -10.6], 90, 6, 8.65, 1.6, 2.2, 0.4));
// Koepeltorentjes op de zuidhoeken.
for (const [cx, cy, top, h] of [[-87.2, -18.8, 21.0, 19.6], [-64.4, -19.0, 21.0, 19.6], [3.5, -19.6, 16.8, 15.3]]) {
  parts.push(box(cx - 1.3, cy - 1.3, BASE, cx + 1.3, cy + 1.3, Z(h)));
  parts.push(roundDome([cx, cy], 1.2, h, top, 24));
}
// Spitse nissen in de westgevel en de zuidgevel van het zuidwestblok.
cuts.push(...nicheRow([-87.8, -18.0], [-87.86, 14.0], 180, 6, 11.0, 1.0, 2.0, 0.35));
cuts.push(...nicheRow([-85.0, -19.93], [-60.0, -19.91], 270, 5, 11.0, 1.0, 2.0, 0.35));


// Nissen uitsparen; de rest is één massief.
const paleis = union(parts).subtract(union(cuts));

// ---------- minaret ----------
const minaret = (() => {
  const m = MINARET;
  const c = m.c;
  const sq = (s) => (s / 2) * Math.SQRT2; // straal van het vierkant op de hoekpunten
  const oct = (f) => f / 2 / Math.cos(Math.PI / 8); // straal van de achthoek op de hoekpunten
  const out = [];
  // Vierkante onderbouw met een kraag van 45 graden onder de galerij.
  out.push(prism(circle(c, sq(m.base), 4, Math.PI / 4), BASE, Z(m.baseTop) - 0.6));
  out.push(corbel(c, sq(m.base), sq(m.balcony), m.baseTop - 0.6));
  out.push(prism(circle(c, sq(m.balcony), 4, Math.PI / 4), Z(m.baseTop) - 0.6 + (sq(m.balcony) - sq(m.base)), Z(m.balconyTop)));
  // Knoppen op de hoeken van de galerij.
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    const r = sq(m.balcony) - 0.45;
    const p = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
    out.push(Manifold.cylinder(0.6, 0.4, 0.05, 12).translate([p[0], p[1], Z(m.balconyTop) - 0.02]));
  }
  // Achtkante schacht, kraag van 45 graden en bovengalerij.
  out.push(prism(circle(c, oct(m.shaft), 8, Math.PI / 8), Z(m.balconyTop) - 0.1, Z(m.shaftTop) - 0.4));
  out.push(corbel(c, oct(m.shaft), oct(m.gallery), m.shaftTop - 0.4, 8, Math.PI / 8));
  out.push(prism(circle(c, oct(m.gallery), 8, Math.PI / 8), Z(m.shaftTop) - 0.4 + (oct(m.gallery) - oct(m.shaft)), Z(m.galleryTop)));
  // Lantaarn en geribde koepel (16 vlakken).
  out.push(prism(circle(c, oct(m.lantern), 8, Math.PI / 8), Z(m.galleryTop) - 0.1, Z(m.lanternTop)));
  out.push(drum(c, m.lantern / 2, m.lanternTop - 0.05, m.lanternTop + 0.32, 16));
  out.push(domeAt(c, [[m.lantern / 2, m.lanternTop + 0.25], [m.domeR, m.lanternTop + 0.9], [m.domeR * 0.9, m.lanternTop + 1.5], [m.domeR * 0.6, m.lanternTop + 2.1], [0.25, m.domeTop - 0.1], [0.05, m.domeTop]], 16));
  out.push(finial(c, m.domeTop - 0.1, m.finial));
  const solid = union(out);
  // Spitse deur aan het plein (oost), vensters in de onderbouw en de schacht.
  const h = m.base / 2;
  const holes = [
    niche(c[0] + h, c[1], 0, 8.65, 1.5, 2.2, 0.45),
    niche(c[0], c[1] + h, 90, 8.65, 1.5, 2.2, 0.45),
    ...[0, 90, 180, 270].map((n) => niche(c[0] + h * Math.cos(n * deg), c[1] + h * Math.sin(n * deg), n, 13.6, 1.0, 1.8, 0.35)),
    ...[0, 90, 180, 270].map((n) => niche(c[0] + (m.shaft / 2) * Math.cos(n * deg), c[1] + (m.shaft / 2) * Math.sin(n * deg), n, 23.0, 0.9, 1.5, 0.35)),
    ...[0, 90, 180, 270].map((n) => niche(c[0] + (m.lantern / 2) * Math.cos(n * deg), c[1] + (m.lantern / 2) * Math.sin(n * deg), n, 30.2, 0.7, 0.8, 0.25)),
  ];
  return solid.subtract(union(holes));
})();

// ---------- kade ----------
// Balustrade langs de waterkant: wand van 0,9 m aan de landzijde van de
// oeverlijn, tot 1,05 m boven de kade, met pijlers van 1,3 m om de ~6 m.
const kade = (() => {
  const out = [];
  const top = Z(GROUND_NAP + 1.05);
  for (let i = 0; i + 1 < SHORE.length; i++) {
    const a = SHORE[i];
    const b = SHORE[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    // Landzijde: rechts van de looprichting (de oever loopt met het water links).
    const n = [d[1], -d[0]];
    const off = (p, s, t) => [p[0] + d[0] * s + n[0] * t, p[1] + d[1] * s + n[1] * t];
    const s0 = i === 0 ? 0 : -0.9;
    out.push(prism([off(a, s0, 0), off(a, len, 0), off(a, len, 0.9), off(a, s0, 0.9)], BASE, top));
    const count = Math.max(2, Math.round(len / 6) + 1);
    for (let k = 0; k < count; k++) {
      const s = (len * k) / (count - 1);
      out.push(prism([off(a, s - 0.65, -0.2), off(a, s + 0.65, -0.2), off(a, s + 0.65, 1.1), off(a, s - 0.65, 1.1)], BASE, top + 0.5));
      const p = off(a, s, 0.45);
      out.push(Manifold.cylinder(0.55, 0.45, 0.05, 12).translate([p[0], p[1], top + 0.48]));
    }
  }
  return union(out);
})();

// ---------- oase ----------
// Paviljoen van 6,5 m in het vierkant (BAG), wanden tot +11,0 m met een
// spitse deur per zijde en een groen tentdak tot +14,3 m.
const oase = (() => {
  const c = OASE.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  const walls = prism(OASE, BASE, Z(11.0));
  const roof = hull([...ring3(OASE, Z(11.0) - 0.02), [c[0], c[1], Z(14.3)]]);
  const holes = OASE.map((p, i) => {
    const q = OASE[(i + 1) % 4];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const nrm = (Math.atan2(m[1] - c[1], m[0] - c[0]) * 180) / Math.PI;
    return niche(m[0], m[1], nrm, 8.65, 1.4, 1.5, 0.4);
  });
  return union([walls, roof, finial(c, 14.2, 14.9)]).subtract(union(holes));
})();

// ---------- controle en wegschrijven ----------
const nodes = [
  ["building:paleis", paleis],
  ["building:minaret", minaret],
  ["building:kade", kade],
  ["building:oase", oase],
];
for (const [name, solid] of nodes) {
  const df = downFaces(solid, BASE).filter((g) => g.area > 0.5);
  console.log(name, "ondervlakken boven de onderkant (> 0,5 m2):", JSON.stringify(df));
}
const all = Manifold.union(nodes.map(([, s]) => s));
const bb = all.boundingBox();
await writeLandmark({
  slug: "efteling-fata-morgana",
  nodes,
  base: BASE,
  catalog: {
    name: "Fata Morgana (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: GROUND_SAMPLES,
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017609", "NL.IMBAG.Pand.0809100000017608"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131365,0, 406522,0), midden op het BAG-pand van Fata Morgana, op het maaiveld (NAP +8,65 m); +X loopt langs de lange zuidgevel naar het oost-zuidoosten (6,5 graden rechtsom van het oosten), +Y naar de Vonderplas. Node building:paleis: de daken per zone op de BAG-contour (+11,4 tot +18,8 m) met gekanteelde borstweringen, de tonhal, de hoektoren, het erkertorentje, de grote poorttoren met blauwe uikoepel (+27,4 m), de arcade met het groene dak, de grijze koepel op de zeshoekige trommel, de gouden koepel met het poortpaviljoen, de witte koepeltoren en de koepels op de bazaar en de zuidhoeken, met spitse nissen. Node building:minaret: de minaret op het plein tot +34,3 m (top +35 m). Node building:kade: de balustrade langs het water. Node building:oase: het paviljoen met het tentdak op het terras. Onderkant op NAP +7,65 m, onder het water. Vervangt de PDOK-reconstructie van de twee BAG-panden. Het water zit in het PDOK-terrein.",
    realWorld: {
      lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
      widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
      highestPointNapM: +(bb.max[2] + GROUND_NAP).toFixed(2),
      minaretDomeNapM: MINARET.domeTop,
      gateTowerDomeNapM: GATE_TOWER.domeTop,
      roofHeightsNapM: Object.fromEntries(ZONES.map((z) => [z.name, z.top])),
      barrelHallCrownNapM: BARREL.crown,
      groundNapM: GROUND_NAP,
      baseNapM: GROUND_NAP + BASE,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Fata_Morgana_(Efteling)",
      "https://commons.wikimedia.org/wiki/Category:Fata_Morgana_(Efteling)",
      "PDOK BAG panden 0809100000017609 (Fata Morgana) en 0809100000017608 (paviljoen op het terras), EPSG:28992",
      "PDOK BGT waterdeel (oever van de Vonderplas)",
      "PDOK AHN DSM/DTM 0,5 m via WCS: dakhoogtes per zone, tonhal, torens, koepels en minaret",
      "PDOK luchtfoto (Actueel_orthoHR)",
    ],
  },
});
