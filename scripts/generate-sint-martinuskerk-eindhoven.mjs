// Sint-Martinuskerk in Tongelre (Eindhoven), Emmanuel Corbey 1888-1891, rijksmonument 518790.
// Neogotische driebeukige kruisbasiliek met de voorgevel op het westzuidwesten aan
// 't Hofke: twee onvoltooide vierkante torens met een leien tentdak, schip en koor
// onder één steile kap, zijbeuken met lessenaarsdaken, korte transeptarmen met een
// lage portaalbouw ervoor, een vijfzijdig gesloten koor, sacristie rechts achter het
// koor, een achtzijdige dakruiter op de viering en de pastorie (zelfde BAG-pand)
// ten zuiden van de kerk.
//
// Gebouwstelsel (u, v): u langs de as van de voorgevel naar het koor (22,5 graden
// in RD), v 90 graden linksom (noordnoordwest). Hoogtes in meters boven NAP +18,30 m.
// Maten: BAG-contour van pand 0772100000302308 en AHN5-DSM (0,5 m, PDOK-WCS):
// dakhellingen uit dwarsprofielen (mediaan over 17 m schip), torens en dakruiter
// uit het raster; vensters, portalen, dakkapellen en steunberen van Wikimedia
// Commons-foto's.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (n, f) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : f; };
const slug = "sint-martinuskerk-eindhoven";
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), slug);
const wasm = await Module(); wasm.setup();
const { Manifold, CrossSection } = wasm;

const BASE = -0.5;
const GROUND_NAP = 18.3;
// RD-oorsprong op het hart van de viering; X_AXIS is de u-as (naar het koor).
const ORIGIN = [164133.3, 384365.87], X_AXIS = [0.9239, 0.3827];
const ORIGIN_UV = [16.45, 4.95]; // ORIGIN in het (u, v)-stelsel van de metingen

const prism = (p, z0, z1) => Manifold.extrude(new CrossSection([p]), z1 - z0).translate([0, 0, z0]);
const box = (u0, u1, v0, v1, z0, z1) => prism([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], z0, z1);
// Houd alles onder het vlak z = a u + b v + c.
const plane = (s, a, b, c) => { const n = Math.hypot(a, b, 1); return s.trimByPlane([a / n, b / n, -1 / n], -c / n); };
// Dak op een linksom georiënteerde convexe veelhoek: per rand een dakvlak dat vanaf de
// goot (eave) met helling slopes[i] naar binnen oploopt; null = topgevel.
function roofed(poly, eave, slopes, top = 40) {
  let s = prism(poly, BASE, top);
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length], k = Array.isArray(slopes) ? slopes[i] : slopes;
    if (k == null) return;
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = -(q[1] - p[1]) / len, ny = (q[0] - p[0]) / len;
    s = plane(s, k * nx, k * ny, eave - k * (nx * p[0] + ny * p[1]));
  });
  return s;
}
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Zadeldak met de nok langs u (op v = vc) of langs v (op u = uc), topgevels aan de koppen.
const saddleU = (s, vc, ridge, k) => plane(plane(s, 0, k, ridge - k * vc), 0, -k, ridge + k * vc);
const saddleV = (s, uc, ridge, k) => plane(plane(s, k, 0, ridge - k * uc), -k, 0, ridge + k * uc);
// Blinde nis met spitse top (50 graden) in een gevel: punt op het gevelvlak, naar buiten wijzende normaal.
function niche(pu, pv, nu, nv, z0, w, h, d = 0.35) {
  const poly = [[-w / 2, 0], [w / 2, 0], [w / 2, h - w * 0.6], [0, h], [-w / 2, h - w * 0.6]];
  const ang = Math.atan2(nv, nu) * 180 / Math.PI - 90;
  return prism(poly, 0, d + 1).rotate([90, 0, 0]).translate([0, 1, 0]).rotate([0, 0, ang]).translate([pu, pv, z0]);
}
// Rechthoekige nis (pastorievensters) met een spitse bovenkant van 50 graden.
const sqNiche = (pu, pv, nu, nv, z0, w, h) => niche(pu, pv, nu, nv, z0, w, h + w * 0.6);
// Achthoekig roosvenster als nis, met een punt boven zodat het plafond niet vlak is.
function rose(pu, pv, nu, nv, zc, r, d = 0.35) {
  const pts = [];
  for (let i = 0; i < 8; i++) { const a = Math.PI / 2 + i * Math.PI / 4; pts.push([r * Math.cos(a), r * Math.sin(a)]); }
  pts[0] = [0, r * 1.5];
  const ang = Math.atan2(nv, nu) * 180 / Math.PI - 90;
  return prism(pts, 0, d + 1).rotate([90, 0, 0]).translate([0, 1, zc]).rotate([0, 0, ang]).translate([pu, pv, 0]);
}
// Steunbeer met een afdekking die onder 50 graden naar buiten afloopt; top = hoogte aan de buitenkant.
const buttress = (u0, u1, v0, v1, top, outU, outV) => {
  const k = 1.2, face = outU > 0 ? u1 : outU < 0 ? -u0 : outV > 0 ? v1 : -v0;
  return plane(box(u0, u1, v0, v1, BASE, top + 3), -k * outU, -k * outV, top + k * face);
};
const pinnacle = (cu, cv, w, z0, z1, tip) => Manifold.union([
  box(cu - w / 2, cu + w / 2, cv - w / 2, cv + w / 2, z0, z1),
  Manifold.hull([box(cu - w / 2, cu + w / 2, cv - w / 2, cv + w / 2, z1 - 0.01, z1), box(cu - 0.02, cu + 0.02, cv - 0.02, cv + 0.02, tip - 0.01, tip)]),
]);

// ---- Schip, koor en dwarsschip ---------------------------------------------
// Eén kap over schip en koor: muren v 1,2 en 8,7, nok NAP +38,65 (20,35 m), 56,7 graden.
const AXIS_V = 4.95, NAVE_V = [1.2, 8.7], RIDGE = 20.35, K = 1.52;
const EAVE = RIDGE - K * (AXIS_V - NAVE_V[0]); // 14,65 m
const FRONT_U = -14.29, CHOIR_END = 26.0;
const nave = saddleU(box(FRONT_U, CHOIR_END, ...NAVE_V, BASE, 30), AXIS_V, RIDGE, K);
// Dwarsschip u 12,65..20,24 tot de topgevels op v -3,4 en 13,3, zelfde nok en helling.
const TR_U = [12.65, 20.24], TR_C = (TR_U[0] + TR_U[1]) / 2;
const transept = saddleV(box(...TR_U, -3.4, 13.3, BASE, 30), TR_C, RIDGE, K);
// Zijbeuken met lessenaarsdak: 10,45 m tegen de lichtbeuk, 0,65 per meter omlaag (33 graden).
const AISLE_U = [-8.6, TR_U[0] + 0.1];
const aisleN = plane(box(...AISLE_U, NAVE_V[1] - 0.1, 13.05, BASE, 12), 0, -0.65, 10.45 + 0.65 * NAVE_V[1]);
const aisleS = plane(box(...AISLE_U, -3.2, NAVE_V[0] + 0.1, BASE, 12), 0, 0.65, 10.45 - 0.65 * NAVE_V[0]);
// Vijfzijdige koorsluiting (halve tienhoek, straal 3,67 m) met een lager dak: goot 12,8 m, nok 18,3 m.
const AC = [26.95, AXIS_V], AR = 3.67;
const apsePoly = [[CHOIR_END - 0.1, AXIS_V - AR]];
for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; apsePoly.push([AC[0] + AR * Math.cos(a), AC[1] + AR * Math.sin(a)]); }
apsePoly.push([CHOIR_END - 0.1, AXIS_V + AR]);
const apse = roofed(apsePoly, 12.8, [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, null]);
// Koorsteunberen op de hoeken van de sluiting.
const buttresses = [];
for (let i = 1; i <= 4; i++) {
  const a = -Math.PI / 2 + i * Math.PI / 5, cu = Math.cos(a), cv = Math.sin(a);
  const b = buttress(-0.45, 0.45, 0, AR * 0.25 + 0.9, 9.5, 0, 1).rotate([0, 0, a * 180 / Math.PI - 90]);
  buttresses.push(b.translate([AC[0] + AR * 0.8 * cu, AC[1] + AR * 0.8 * cv, 0]));
}

// ---- Torens -----------------------------------------------------------------
// Twee vierkante torens van 5,5 x 5 m voor de zijbeuken, muren tot 21,3 m, leien
// tentdak tot 23,6 m (AHN), hoekpinakels; nooit voltooid, dus zonder spits.
const TOWER_U = [-13.85, -8.3], TOWER_TOP = 21.3, TENT_TOP = 23.6;
const towers = [], towerParts = [];
for (const [v0, v1] of [[8.3, 13.3], [-3.6, 1.6]]) {
  const cu = (TOWER_U[0] + TOWER_U[1]) / 2, cv = (v0 + v1) / 2, hu = (TOWER_U[1] - TOWER_U[0]) / 2, hv = (v1 - v0) / 2;
  towers.push({ v0, v1, cu, cv });
  towerParts.push(box(...TOWER_U, v0, v1, BASE, TOWER_TOP - 0.6));
  // Kroonlijst met een kraag van 45 graden, 0,3 m uit de gevel.
  towerParts.push(Manifold.hull([
    box(...TOWER_U, v0, v1, TOWER_TOP - 0.9, TOWER_TOP - 0.6),
    box(TOWER_U[0] - 0.3, TOWER_U[1] + 0.3, v0 - 0.3, v1 + 0.3, TOWER_TOP - 0.3, TOWER_TOP),
  ]));
  // Tentdak vanaf de kroonlijst.
  const k = (TENT_TOP - TOWER_TOP) / (Math.min(hu, hv) + 0.3);
  towerParts.push(roofed(rect(TOWER_U[0] - 0.3, TOWER_U[1] + 0.3, v0 - 0.3, v1 + 0.3), TOWER_TOP, k).trimByPlane([0, 0, 1], TOWER_TOP - 0.05));
  // Hoekpinakels op de kroonlijst.
  for (const pu of [TOWER_U[0] + 0.15, TOWER_U[1] - 0.15]) for (const pv of [v0 + 0.15, v1 - 0.15]) towerParts.push(pinnacle(pu, pv, 0.9, TOWER_TOP - 0.3, TOWER_TOP + 0.7, TOWER_TOP + 2.0));
  // Hoeksteunberen aan voor- en buitenkant tot 15,5 m (balustrade van de klokkenverdieping).
  const outer = v0 > 4 ? v1 : v0, sgn = v0 > 4 ? 1 : -1;
  const vb = sgn > 0 ? [outer - 1.0, outer] : [outer, outer + 1.0];
  towerParts.push(buttress(TOWER_U[0] - 0.45, TOWER_U[0] + 0.1, ...vb, 15.5, -1, 0));
  const vInner = sgn > 0 ? [v0, v0 + 1.0] : [v1 - 1.0, v1];
  towerParts.push(buttress(TOWER_U[0] - 0.45, TOWER_U[0] + 0.1, ...vInner, 13.0, -1, 0));
  const vs = sgn > 0 ? [outer - 0.1, outer + 0.45] : [outer - 0.45, outer + 0.1];
  towerParts.push(buttress(TOWER_U[0], TOWER_U[0] + 1.0, ...vs, 15.5, 0, sgn));
  towerParts.push(buttress(TOWER_U[1] - 1.0, TOWER_U[1], ...vs, 13.0, 0, sgn));
}
// Topgevel van het schip tussen de torens met een pinakel op de top (beeld), en het portaal.
const frontFinial = pinnacle(FRONT_U + 0.5, AXIS_V, 0.9, RIDGE - 1.2, RIDGE + 0.6, RIDGE + 1.8);
const PORCH = { u0: FRONT_U - 0.75, v0: AXIS_V - 2.4, v1: AXIS_V + 2.4 };
const porch = saddleU(box(PORCH.u0, FRONT_U + 0.1, PORCH.v0, PORCH.v1, BASE, 12), AXIS_V, 10.2, 1.55);
const porchPins = [PORCH.v0 + 0.45, PORCH.v1 - 0.45].map(v => pinnacle(PORCH.u0 + 0.45, v, 0.9, 5, 7.6, 9.0));

// ---- Dwarsschipportalen, sacristie en aanbouw bij het koor -------------------
// Lage portaalbouw voor de noordelijke transeptgevel (lessenaarsdak 7,0 -> 4,8 m)
// met twee dwarse topgeveltjes boven ronde vensters; zuidelijk alleen het lessenaarsdak.
const porchN = plane(box(...TR_U, 13.2, 15.78, BASE, 10), 0, -0.88, 7.0 + 0.88 * 13.3);
const gablets = [[13.55, 16.05], [16.85, 19.35]].map(([a, b]) => saddleV(box(a, b, 13.2, 15.78, BASE, 10), (a + b) / 2, 7.5, 1.3));
const porchS = plane(box(TR_U[0] + 0.08, 20.94, -5.73, -3.3, BASE, 10), 0, 0.75, 7.0 + 0.75 * 3.4);
for (const u of [12.95, 16.45, 19.95]) buttresses.push(buttress(u - 0.45, u + 0.45, 15.7, 16.42, 5.0, 0, 1));
for (const u of [13.0, 16.45, 19.97]) buttresses.push(buttress(u - 0.45, u + 0.45, -6.41, -5.68, 4.6, 0, -1));
// Sacristie rechts achter het koor: zadeldak dwars op de as, goot 6,2 m, nok 9,2 m.
const sacristy = saddleV(box(21.24, 26.05, -6.87, NAVE_V[0] + 0.2, BASE, 12), 23.645, 9.2, 1.25);
// Lage tussenbouw tussen dwarsschip en sacristie, plat op 7,7 m (AHN).
const stair = box(TR_U[1] - 0.1, 21.3, -3.04, NAVE_V[0] + 0.2, BASE, 7.7);
// Aanbouw aan de noordzijde van het koor met lessenaarsdak en de hoge schoorsteen.
const annexN = plane(box(TR_U[1] - 0.1, CHOIR_END, NAVE_V[1] - 0.1, 13.13, BASE, 12), 0, -0.55, 8.8 + 0.55 * NAVE_V[1]);
const chimney = box(25.8, 26.8, 9.35, 10.45, BASE, 20.5);

// ---- Steunberen langs de zijbeuken ------------------------------------------
const BAY_EDGES = [-8.3, -3.9, 0.35, 4.45, 8.65, TR_U[0]];
for (const u of BAY_EDGES.slice(1, -1)) {
  buttresses.push(buttress(u - 0.45, u + 0.45, 12.95, 14.2, 6.8, 0, 1));
  buttresses.push(buttress(u - 0.45, u + 0.45, -4.3, -3.1, 6.8, 0, -1));
}

// ---- Dakkapellen en dakruiter -----------------------------------------------
const dormer = (uc, vBack, vFront, eave, peak, hw = 0.7) => {
  let d = box(uc - hw, uc + hw, Math.min(vBack, vFront), Math.max(vBack, vFront), eave - 3, peak + 0.5);
  const k = (peak - eave) / hw;
  return plane(plane(d, k, 0, peak - k * uc), -k, 0, peak + k * uc);
};
const BAYS = BAY_EDGES.slice(0, -1).map((a, i) => (a + BAY_EDGES[i + 1]) / 2);
const dormers = [];
// Twee dakkapelletjes per dakvlak van het schip (u -1,8 en 6,55) op ~16,5 m.
for (const u of [BAYS[1], BAYS[3]]) {
  dormers.push(dormer(u, AXIS_V + 0.5, AXIS_V + 3.12, 16.4, 17.5));
  dormers.push(dormer(u, AXIS_V - 0.5, AXIS_V - 3.12, 16.4, 17.5));
}
// Drie op elk zijbeukdak.
for (const u of [BAYS[0], BAYS[2], BAYS[4]]) {
  dormers.push(dormer(u, NAVE_V[1], 12.2, 8.6, 9.6, 0.6));
  dormers.push(dormer(u, NAVE_V[0], -2.35, 8.6, 9.6, 0.6));
}
// Achtzijdige dakruiter: lantaarn (apotheem 0,85 m) tot 24,0 m, naald tot 30,5 m (AHN 29,6 op 0,5 m).
const octR = a => a / Math.cos(Math.PI / 8);
const RUITER = { u: TR_C, v: AXIS_V, a: 0.85, lantern: 24.0, top: 30.5 };
const ruiter = Manifold.union([
  Manifold.cylinder(RUITER.lantern - 18.0, octR(RUITER.a), octR(RUITER.a), 8).rotate([0, 0, 22.5]).translate([RUITER.u, RUITER.v, 18.0]),
  Manifold.cylinder(RUITER.top - RUITER.lantern, octR(RUITER.a), 0.04, 8).rotate([0, 0, 22.5]).translate([RUITER.u, RUITER.v, RUITER.lantern]),
]);
// Pinakels op de toppen van de transeptgevels.
const gableFinials = [12.85, -2.95].map(v => pinnacle(TR_C, v, 0.9, RIDGE - 1.0, RIDGE + 0.5, RIDGE + 1.6));

// ---- Pastorie (zelfde BAG-pand), ten zuiden van de kerk -----------------------
// Hoofdhuis met een mansardekap: steil deel van 8,6 m, flauw tentdak tot 14,2 m.
const PAST = rect(-11.4, 1.6, -21.6, -8.8);
const pastMain = Manifold.intersection(roofed(PAST, 8.6, 2.6), roofed(PAST, 11.3, 0.45));
// Topgevel naar 't Hofke aan de westzijde, nok 12,6 m.
const pastGable = saddleU(box(-11.62, -6.0, -14.55, -8.8, BASE, 14), -11.675, 12.6, 1.4);
const pastChimneys = [[-4.0, -13.6, 15.8], [-3.8, -16.3, 15.8], [3.5, -17.7, 11.8]].map(([u, v, h]) => box(u - 0.45, u + 0.45, v - 0.45, v + 0.45, BASE, h));
// Dakkapellen in het steile mansardevlak naar 't Hofke (west) en naar de tuin (zuid).
const dormerU = (vc, uBack, uFront, eave, peak, hw = 0.8) => {
  const d = box(Math.min(uBack, uFront), Math.max(uBack, uFront), vc - hw, vc + hw, eave - 3, peak + 0.5), k = (peak - eave) / hw;
  return plane(plane(d, 0, k, peak - k * vc), 0, -k, peak + k * vc);
};
const pastDormers = [dormerU(-17.6, -8.5, -11.25, 8.9, 10.6), dormerU(-20.2, -8.5, -11.25, 8.9, 10.6),
  dormer(-7.5, -18.0, -21.45, 8.9, 10.6, 0.8), dormer(-1.5, -18.0, -21.45, 8.9, 10.6, 0.8)];
const pastEast = box(1.5, 7.47, -14.49, -8.74, BASE, 4.5);
const pastMid = box(1.5, 6.42, -17.31, -14.4, BASE, 8.0);
const pastWing = saddleU(box(1.5, 18.72, -22.72, -17.26, BASE, 10), -19.99, 8.15, 0.5);
// Lage verbinding tussen de zuidtoren en de pastorie, plat op 3,8 m.
const link = prism([[-11.42, -9.0], [-7.93, -9.0], [-8.4, -3.4], [-12.07, -3.4]], BASE, 3.8);

let church = Manifold.union([nave, transept, aisleN, aisleS, apse, ...towerParts, frontFinial, porch, ...porchPins,
  porchN, ...gablets, porchS, sacristy, stair, annexN, chimney, ...buttresses, ...dormers, ruiter, ...gableFinials,
  pastMain, pastGable, ...pastDormers, ...pastChimneys, pastEast, pastMid, pastWing, link]);

// ---- Vensters, roosvensters en galmgaten als blinde nissen ---------------------
const niches = [];
for (const c of BAYS) {
  niches.push(niche(c, 13.05, 0, 1, 1.8, 1.3, 4.2), niche(c, -3.2, 0, -1, 1.8, 1.3, 4.2));
  niches.push(niche(c, NAVE_V[1], 0, 1, 11.0, 1.8, 3.2), niche(c, NAVE_V[0], 0, -1, 11.0, 1.8, 3.2));
}
// Koor: twee vensters per zijde boven de aanbouwen, vijf hoge vensters in de sluiting.
for (const u of [22.2, 24.4]) niches.push(niche(u, NAVE_V[1], 0, 1, 9.6, 1.3, 4.2), niche(u, NAVE_V[0], 0, -1, 10.0, 1.3, 3.8));
for (let i = 0; i < 5; i++) {
  const a = -Math.PI / 2 + (i + 0.5) * Math.PI / 5, ap = AR * Math.cos(Math.PI / 10);
  niches.push(niche(AC[0] + ap * Math.cos(a), AC[1] + ap * Math.sin(a), Math.cos(a), Math.sin(a), 3.0, 1.1, 7.6));
}
// Transeptgevels: roosvenster boven de portaalbouw, twee lancetten ernaast en een venster in de top.
for (const [v, s] of [[13.3, 1], [-3.4, -1]]) {
  niches.push(rose(TR_C, v, 0, s, 11.6, 1.75));
  niches.push(niche(TR_C, v, 0, s, 15.6, 0.9, 2.2));
  niches.push(niche(TR_C - 2.4, v, 0, s, 8.0, 0.9, 3.6), niche(TR_C + 2.4, v, 0, s, 8.0, 0.9, 3.6));
}
// Portaalbouw noord: ronde vensters onder de topgeveltjes.
for (const u of [14.8, 18.1]) niches.push(rose(u, 15.78, 0, 1, 3.6, 0.95));
// Voorgevel: ingang in het portaal, roosvenster en lancetten in de torens.
niches.push(niche(PORCH.u0, AXIS_V, -1, 0, BASE, 2.2, 4.6));
niches.push(rose(FRONT_U, AXIS_V, -1, 0, 12.6, 1.6));
niches.push(niche(FRONT_U, AXIS_V - 2.2, -1, 0, 9.2, 0.9, 3.2), niche(FRONT_U, AXIS_V + 2.2, -1, 0, 9.2, 0.9, 3.2));
for (const t of towers) {
  niches.push(niche(TOWER_U[0], t.cv, -1, 0, 1.0, 1.2, 3.4));
  niches.push(niche(TOWER_U[0], t.cv, -1, 0, 9.0, 1.6, 4.2));
  // Galmgaten: twee per zijde in de klokkenverdieping.
  for (const k of [-0.95, 0.95]) {
    niches.push(niche(TOWER_U[0], t.cv + k, -1, 0, 16.4, 0.9, 3.6));
    niches.push(niche(TOWER_U[1], t.cv + k, 1, 0, 16.4, 0.9, 3.6));
    niches.push(niche(t.cu + k, t.v1, 0, 1, 16.4, 0.9, 3.6));
    niches.push(niche(t.cu + k, t.v0, 0, -1, 16.4, 0.9, 3.6));
  }
  const side = t.v0 > 4 ? [t.v1, 1] : [t.v0, -1];
  niches.push(niche(t.cu, side[0], 0, side[1], 9.0, 1.4, 4.0));
}
// Pastorie: twee rijen vensters aan de west- en noordgevel.
for (const v of [-10.2, -13.2, -17.4, -20.2]) for (const z of [1.2, 4.9]) niches.push(sqNiche(v > -14.6 ? -11.62 : -11.4, v, -1, 0, z, 1.0, 1.8));
for (const u of [-4.5, -1.5]) for (const z of [1.2, 4.9]) niches.push(sqNiche(u, -21.6, 0, -1, z, 1.0, 1.8));
for (const u of [4.5, 8.5, 12.5, 16.5]) niches.push(sqNiche(u, -22.72, 0, -1, 1.2, 1.0, 1.8));
church = church.subtract(Manifold.union(niches));
church = church.translate([-ORIGIN_UV[0], -ORIGIN_UV[1], 0]);

const parts = [["building:kerk", church]];
const bb0 = church.boundingBox();
const META = {
  name: "Sint-Martinuskerk Eindhoven",
  origin: ORIGIN, xAxis: X_AXIS, groundHeight: GROUND_NAP, groundOffsetMetres: BASE,
  replacesBuildings: ["NL.IMBAG.Pand.0772100000302308"],
  description: "Neogotische kruisbasiliek van Emmanuel Corbey (1888-1891) in Tongelre met twee onvoltooide torens en de pastorie in hetzelfde BAG-pand; oorsprong in de viering, X-as van de voorgevel naar het koor.",
  realWorld: { groundNapM: GROUND_NAP, ahn5NaveRidgeNapM: 38.65, ahn5RoofTurretNapM: 47.85, naveRidgeM: RIDGE, naveEaveM: +EAVE.toFixed(2), roofPitchDeg: 56.7, towerWallM: TOWER_TOP, towerTentRoofM: TENT_TOP, apseRidgeM: 18.3, pastorieRidgeM: 14.2 },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Martinuskerk_(Tongelre)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/518790",
    "https://www.openstreetmap.org/way/272118491",
    "https://www.wikidata.org/wiki/Q2492219",
    "https://commons.wikimedia.org/wiki/Category:Sint_Martinuskerk,_Eindhoven",
    "https://www.ahn.nl/dataroom",
  ],
};

function toStl(solid, label, mmPerMetre) {
  const m = solid.getMesh(), v = m.vertProperties, tri = m.triVerts, s = m.numProp, n = tri.length / 3, b = Buffer.alloc(84 + n * 50);
  b.write(label.slice(0, 79), 0, 80, "ascii"); b.writeUInt32LE(n, 80); let o = 84;
  for (let t = 0; t < n; t++) {
    const p = [0, 1, 2].map(k => { const i = tri[t * 3 + k] * s; return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre]; });
    const a = p[1].map((c, i) => c - p[0][i]), d = p[2].map((c, i) => c - p[0][i]);
    const q = [a[1] * d[2] - a[2] * d[1], a[2] * d[0] - a[0] * d[2], a[0] * d[1] - a[1] * d[0]], l = Math.hypot(...q) || 1;
    for (const c of [...q.map(x => x / l), ...p[0], ...p[1], ...p[2]]) { b.writeFloatLE(c, o); o += 4; }
    b.writeUInt16LE(0, o); o += 2;
  }
  return b;
}
function toGlb(named) {
  const chunks = [], views = [], acc = [], meshes = [], nodes = []; let length = 0;
  const push = (a, target) => { const b = Buffer.from(a.buffer, a.byteOffset, a.byteLength), p = Buffer.concat([b, Buffer.alloc((4 - b.length % 4) % 4)]); views.push({ buffer: 0, byteOffset: length, byteLength: b.length, target }); chunks.push(p); length += p.length; return views.length - 1; };
  for (const [name, solid] of named) {
    const m = solid.calculateNormals(0, 40).getMesh(), s = m.numProp, n = m.vertProperties.length / s;
    const pos = new Float32Array(n * 3), norm = new Float32Array(n * 3), min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < n; i++) {
      const v = m.vertProperties, p = [v[i * s], v[i * s + 2], -v[i * s + 1]], q = s >= 6 ? [v[i * s + 3], v[i * s + 5], -v[i * s + 4]] : [0, 1, 0];
      for (let j = 0; j < 3; j++) { pos[i * 3 + j] = p[j]; norm[i * 3 + j] = q[j]; min[j] = Math.min(min[j], p[j]); max[j] = Math.max(max[j], p[j]); }
    }
    const pi = push(pos, 34962), ni = push(norm, 34962), ii = push(Uint32Array.from(m.triVerts), 34963), a = acc.length;
    acc.push({ bufferView: pi, componentType: 5126, count: n, type: "VEC3", min, max }, { bufferView: ni, componentType: 5126, count: n, type: "VEC3" }, { bufferView: ii, componentType: 5125, count: m.triVerts.length, type: "SCALAR" });
    meshes.push({ name, primitives: [{ attributes: { POSITION: a, NORMAL: a + 1 }, indices: a + 2, mode: 4 }] });
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(JSON.stringify({ asset: { version: "2.0", generator: `NederPrint generate-${slug}.mjs` }, scene: 0, scenes: [{ nodes: nodes.map((_, i) => i) }], nodes, meshes, buffers: [{ byteLength: length }], bufferViews: views, accessors: acc }));
  const jp = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]), bin = Buffer.concat(chunks), h = Buffer.alloc(12);
  h.writeUInt32LE(0x46546c67, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(12 + 8 + jp.length + 8 + bin.length, 8);
  const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
  return Buffer.concat([h, ch(jp.length, 0x4e4f534a), jp, ch(bin.length, 0x004e4942), bin]);
}

if (church.status() !== "NoError") throw new Error(church.status());
if (Math.abs(bb0.min[2] - BASE) > 1e-5) throw new Error("modelvoet is niet vlak");
const pieces = church.decompose();
console.log(JSON.stringify({ slug, status: church.status(), genus: church.genus(), components: pieces.length, triangles: church.numTri(), volume: +church.volume().toFixed(1), bounds: { min: bb0.min, max: bb0.max }, size: bb0.max.map((v, i) => +(v - bb0.min[i]).toFixed(2)) }, null, 2));
if (pieces.length !== 1) throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir, { recursive: true });
const glb = `${slug}.glb`;
await writeFile(path.join(outDir, glb), toGlb(parts));
const printSolid = church.translate([0, 0, -BASE]);
for (const scale of [100, 1000]) await writeFile(path.join(outDir, `${slug}-1-${scale}.stl`), toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`, 1000 / scale));
await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify({ ...META, file: glb, unitsPerMetre: 1, className: "building", crs: "EPSG:28992", printFiles: [`${slug}-1-100.stl`, `${slug}-1-1000.stl`], realWorld: { ...META.realWorld, highestPointM: +bb0.max[2].toFixed(2) } }, null, 2) + "\n");
