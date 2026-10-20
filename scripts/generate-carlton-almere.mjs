// Carlton (WTC Almere; P.J. Oudweg / Stationsplein, Almere-Centrum, 2010): kantoorcomplex van drie
// aan elkaar geschakelde gebouwen van 6, 12 en 32 verdiepingen op één BAG-pand, onderdeel van
// L'Hermitage aan de noordkant van station Almere Centrum. Geen ronde toren maar een rechthoekige
// schijf van 48 × 16 m tot NAP +112,7 m, met een vooruitspringende glazen strook in de zuidgevel die
// als donkere kroon tot +116,4 m doorloopt en een witte antennemast tot circa 141 m boven straat.
// Kenmerkend zijn de gevels die naar beneden toe in treden van drie verdiepingen naar buiten
// springen: de oostkop en de noordoosthoek van de toren, de westkop, en alle zijden van de
// twaalflaagse zuidwestvleugel en de zeslaagse noordvleugel. Rond de voet een oranje luifel boven de
// entree aan het Stationsplein en een teruggezette begane grond.
// Contouren uit de BAG, hoogtes en treden uit de 3D BAG (AHN5, 2023) en het AHN-DSM 0,5 m; het
// verdiepingsraster van 3,6 m vanaf NAP +1,1 m valt samen met alle gemeten dakranden.
import { Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "carlton-almere";
// Gebouwstelsel: u langs de lange gevels van de toren (13,76° linksom op RD-oost, BAG-zuidgevel van
// de zuidwestvleugel en noordgevel van de noordvleugel: 13,76° en 13,75°), v haaks erop naar het
// noorden. Oorsprong in de toren.
const ORIGIN = [143410.0, 487545.0];
const ANGLE = 13.76;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -3.51; // NAP, AHN-DTM op straat en stoep rondom (−3,45 tot −3,61; 3D BAG −3,70)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// BAG-contour van pand 0034100000051481 in het gebouwstelsel (ter controle; de bouwdelen hieronder
// volgen de buitenste lijnen ervan op de begane grond).
const BAG_CARLTON = [[8.6, 22.89], [-9.61, 22.89], [-9.61, 10.68], [-20.7, 10.68], [-20.7, -4.41], [-26.25, -4.41], [-26.25, -5.21], [-32.65, -5.21], [-32.65, -4.12], [-43.2, -4.11], [-43.2, -21.35], [4.05, -21.36], [4.05, -6.34], [6.03, -6.34], [6.03, -7.61], [14.99, -7.61], [14.99, -6.34], [17.84, -6.34], [17.84, -8.06], [32.85, -8.06], [32.85, 7.83], [48.74, 7.83], [48.74, 22.88]];

// Verdiepingsraster: begane grond tot NAP +1,1 m, daarboven lagen van 3,6 m. Dakranden en treden uit
// de 3D BAG en het DSM vallen erop: noordvleugel +18,99 (laag 5), luifel +8,3 (laag 2), +11,8 (3),
// zuidwestvleugel +22,6 (6), +37,03 (10), +44,2 (12), toren +51,5 (14), +76,7 (21), +83,9 (23),
// +94,7 (26) en het dak +112,7 (31).
const FLOOR0 = 1.1, STOREY = 3.6;
const level = (k) => FLOOR0 + STOREY * k;

// ---------- Toren (32 lagen) ----------
const TOWER_ROOF = 112.7; // 3D BAG 112,48–113,03, DSM-mediaan 112,6 (west) en 112,9 (oost)
const CROWN_TOP = 116.4; // 3D BAG 116,35–116,51, DSM 116,4 (kroon op de glazen strook)
const MAST_TOP = 137.5; // Wikipedia: 141 m met de antenne (boven straat); DSM raakt de mast tot +130,8
const MAST_AT = [10.8, 1.5]; // DSM-piek op de kroon
// Treden in de gevels, als [bovenkant (NAP), positie] van onder naar boven. Oostkop: van u = 32,85
// (BAG) onder +51,5 m naar 29,1 bij het dak, elke drie lagen 0,6 m terug (3D BAG-randen op +51,5,
// +76,6 en +94,6 m; DSM-profiel van 32,0 op +52 m tot 29,0 op +110 m).
const EAST = [[level(14), 32.85], [level(17), 32.0], [level(20), 31.4], [level(23), 30.8], [level(26), 30.2], [level(29), 29.6], [TOWER_ROOF, 29.1]];
// Noordoosthoek (u ≥ 19,5): de noordgevel springt naar beneden toe van 9,15 naar 10,4 uit
// (DSM: 9,0–9,25 aan de top, 10,4–10,5 onder +40 m; 3D BAG-randen op +51,5, +76,6 en +94,6 m).
const NE_FROM = 19.5;
const NORTH_NE = [[level(14), 10.4], [level(17), 10.15], [level(20), 9.9], [level(23), 9.65], [level(26), 9.4], [TOWER_ROOF, 9.15]];
const NORTH_MID = 9.15; // DSM: noordgevel 9,0–9,25 over de hele lengte
// Noordwesthoek (u ≤ −9,61, vrij tot de grond): rand op +51,6 m (DSM 51,5–51,9 op v = 9,75).
const NORTH_NW = [[level(14), 9.85], [TOWER_ROOF, 9.15]];
// Westkop: springt minder ver uit dan de oostkop, van u = −20,7 (BAG) onder +29,9 m naar −18,8 bij
// het dak, met de duidelijkste rand op +83,9 m (3D BAG 83,42–83,95; DSM-profiel: −20,25 op +41 m,
// −20,0 op +60 m, rand 83,6 op −19,75 tot −19,5, −19,0 op +95 tot +110 m).
const WEST = [[level(8), -20.7], [level(14), -20.35], [level(20), -20.0], [level(23), -19.7], [level(26), -19.3], [level(29), -19.0], [TOWER_ROOF, -18.8]];
// Zuidgevel west van de glazen strook boven de zuidwestvleugel (DSM: −7,5 op +51 m, −7,0 op +57 m,
// −6,85 boven +76 m); oostelijk deel −6,9 over de hele hoogte.
const SOUTH_W = [[level(14), -7.5], [level(20), -7.15], [TOWER_ROOF, -6.9]];
const SOUTH_E = -6.9;
// Glazen strook in de zuidgevel (BAG u 6,03–14,99 op v −7,61; DSM-rand −7,6 tot −8,0) en de kroon
// erboven tot v = 5,6 (DSM 116–117 m van v −7,9 tot 5,5).
const STRIP = { u0: 6.0, u1: 15.0, v0: -7.75, crownV1: 5.6 };

// ---------- Zuidwestvleugel (12 lagen) ----------
const SW_ROOF = 44.2; // 3D BAG 44,21–44,25, DSM 44,24
// Treden: 3D BAG-randen op +22,6 en +37,03 m langs west- en noordkant; DSM-profielen van de west-,
// zuid-, noord- en oostgevel (bijvoorbeeld west: 44,2 tot u = −40,0, 36,9 op −41,1, 22,5 op −42,25,
// maaiveld voorbij −43,4).
const SW_WEST = [[22.6, -43.2], [level(8), -42.3], [37.03, -41.6], [SW_ROOF, -40.4]];
const SW_SOUTH = [[level(2), -21.35], [22.6, -21.0], [37.03, -20.6], [SW_ROOF, -20.0]];
const SW_NORTH = [[level(2), -4.2], [22.6, -4.75], [37.03, -5.2], [SW_ROOF, -5.7]];
const SW_EAST = [[22.6, 4.05], [37.03, 3.8], [SW_ROOF, 3.3]];
// Kop van 2,3 m op de vleugel tegen de westkop van de toren (3D BAG-vlak 252, DSM 46,5).
const SW_HEAD = { poly: [[-25.7, -7.1], [-20.5, -7.1], [-20.5, -5.7], [-25.7, -5.7]], top: 46.5 };
// Entree in de noordgevel: nis in de BAG-contour (u −32,65 tot −26,25, 1,1 m diep).
const SW_ENTRANCE = { u0: -32.65, u1: -26.25, v: -5.21 };

// ---------- Noordvleugel (6 lagen) ----------
const N_ROOF = 18.99; // 3D BAG 18,98–18,99, DSM 18,98
const N_WEST = -9.61, N_SOUTH = 7.9; // BAG −9,61 en 7,83; DSM-rand 7,9–8,0
const N_NORTH = [[level(2), 22.89], [level(4), 22.6], [N_ROOF, 22.3]]; // DSM: 22,3 aan de top, 23,0 op +8 m
const N_EAST = [[11.8, 48.74], [N_ROOF, 47.2]]; // 3D BAG-vlak 251: strook van 1,7 m op +11,8 m
const N_PLANT = [
  { poly: [[19.7, 10.2], [23.7, 10.2], [23.7, 13.9], [19.7, 13.9]], top: 20.4 }, // 3D BAG-vlak 275
  { poly: [[29.4, 16.5], [31.6, 16.5], [31.6, 19.5], [29.4, 19.5]], top: 20.4 }, // 3D BAG-vlak 245
];

// ---------- Luifels en entrees ----------
// Oranje luifel boven de hoofdentree aan het Stationsplein: van de zuidgevel tot v = −8,06 (BAG),
// bovenkant +8,3 m (DSM 7,3–8,5 op v −8,0 tot −7,25), voorkant 1,2 m hoog, onderkant onder 45°.
// Daaronder een teruggezette, hoge entreehal tot v = −5,4 met twee ronde kolommen van 1,2 m
// (foto's; diepte en kolommen geschat).
const SE_CANOPY = { u0: 17.84, u1: 32.85, front: -8.06, top: 8.3, lobby: -5.4, columns: [21.5, 26.5], columnD: 1.2 };
// Luifel aan de noordwestkant (DSM 8–11 m op v 10,25–10,5): tot v = 10,68 (BAG), bovenkant +9,5 m.
const NW_CANOPY = { u0: -20.7, u1: N_WEST, front: 10.68, top: 9.5, lobby: 8.35 };
// Teruggezette begane grond van de noordvleugel achter de oranje band (foto's; 1,2 m geschat).
const N_RECESS = 1.2;

// ---------- Opbouw ----------
const box = (u0, u1, v0, v1, z0, z1) => prism([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], z0, z1);
const at = (steps, nap) => (typeof steps === "number" ? steps : steps.find(([top]) => nap < top - 1e-6)?.[1] ?? steps.at(-1)[1]);
// Getrapt volume: rechthoek per laag tussen de breekpunten van alle treden; elke laag loopt 2 cm in
// de volgende door zodat de lagen één geheel vormen.
function stepped({ u0, u1, v0, v1, from = GROUND, top }) {
  const cuts = new Set([from, top]);
  for (const s of [u0, u1, v0, v1]) if (typeof s !== "number") s.forEach(([t]) => t > from && t < top && cuts.add(t));
  const zs = [...cuts].sort((a, b) => a - b);
  return union(zs.slice(1).map((t, i) => {
    const b = zs[i], mid = (b + t) / 2;
    return box(at(u0, mid), at(u1, mid), at(v0, mid), at(v1, mid), b === GROUND ? BASE : z(b), z(t) + (t === top ? 0 : 0.02));
  }));
}

const tower = union([
  // Westdeel tot de noordwesthoek, middendeel, glazen strook, deel oost van de strook, oostkop.
  stepped({ u0: WEST, u1: N_WEST + 0.01, v0: SOUTH_W, v1: NORTH_NW, top: TOWER_ROOF }),
  stepped({ u0: N_WEST, u1: STRIP.u0 + 0.01, v0: SOUTH_W, v1: NORTH_MID, top: TOWER_ROOF }),
  box(STRIP.u0, STRIP.u1, STRIP.v0, NORTH_MID, BASE, z(TOWER_ROOF)),
  box(STRIP.u0, STRIP.u1, STRIP.v0, STRIP.crownV1, z(TOWER_ROOF) - 0.1, z(CROWN_TOP)),
  stepped({ u0: STRIP.u1 - 0.01, u1: NE_FROM + 0.01, v0: SOUTH_E, v1: NORTH_MID, top: TOWER_ROOF }),
  stepped({ u0: NE_FROM, u1: EAST, v0: SOUTH_E, v1: NORTH_NE, top: TOWER_ROOF }),
]);
// Antennemast: voet van 1,6 m over 2 m en een schacht van 1,0 m (op de foto's circa 0,8 m; verdikt tot
// het minimum voor 1:1000).
const mast = union([
  Manifold.cylinder(2.1, 0.8, 0.8, 24).translate([MAST_AT[0], MAST_AT[1], z(CROWN_TOP) - 0.1]),
  Manifold.cylinder(z(MAST_TOP) - z(CROWN_TOP) - 1.9, 0.5, 0.5, 16).translate([MAST_AT[0], MAST_AT[1], z(CROWN_TOP) + 1.9]),
]);

const swWing = union([
  stepped({ u0: SW_WEST, u1: SW_EAST, v0: SW_SOUTH, v1: SW_NORTH, top: SW_ROOF }),
  prism(SW_HEAD.poly, z(SW_ROOF) - 0.1, z(SW_HEAD.top)),
]);
const northWing = union([
  stepped({ u0: N_WEST, u1: N_EAST, v0: N_SOUTH, v1: N_NORTH, top: N_ROOF }),
  ...N_PLANT.map((p) => prism(p.poly, z(N_ROOF) - 0.1, z(p.top))),
]);

// Luifels als (v, z)-doorsnede, langs u geëxtrudeerd: voorkant 1,2 m hoog, onderkant onder 45° terug
// naar de gevel.
function profileU(points, u0, u1) {
  // Prisma met doorsnede in het (v, z)-vlak, van u0 tot u1.
  const pts = [];
  for (const [v, h] of points) pts.push([u0, v, h], [u1, v, h]);
  return Manifold.hull(pts);
}
const seFront = SE_CANOPY.front, seTop = z(SE_CANOPY.top), seDrop = SOUTH_E - seFront;
const seCanopy = profileU([[seFront, seTop - 1.2], [seFront, seTop], [SOUTH_E + 0.1, seTop], [SOUTH_E + 0.1, seTop - 1.2 - seDrop - 0.1]], SE_CANOPY.u0, SE_CANOPY.u1);
const nwFront = NW_CANOPY.front, nwTop = z(NW_CANOPY.top), nwFace = at(NORTH_NW, 0), nwDrop = nwFront - nwFace;
const nwCanopy = profileU([[nwFront, nwTop - 1.2], [nwFront, nwTop], [nwFace - 0.1, nwTop], [nwFace - 0.1, nwTop - 1.2 - nwDrop - 0.1]], NW_CANOPY.u0, NW_CANOPY.u1);

let body = union([tower, mast, swWing, northWing, seCanopy, nwCanopy]);

// Teruggezette begane grond onder de luifels: plafond onder 45° in het verlengde van de luifel.
const seLobbyTop = seTop - 1.2 - (SE_CANOPY.lobby - seFront); // waar de 45°-lijn de hal raakt
const seLobby = profileU([[-14, BASE - 1], [SE_CANOPY.lobby, BASE - 1], [SE_CANOPY.lobby, seLobbyTop], [-14, seLobbyTop + (SE_CANOPY.lobby + 14)]], SE_CANOPY.u0, SE_CANOPY.u1 + 1.5);
const nwLobbyTop = nwTop - 1.2 - (nwFront - NW_CANOPY.lobby);
const nwLobby = profileU([[NW_CANOPY.lobby, BASE - 1], [16, BASE - 1], [16, nwLobbyTop + (16 - NW_CANOPY.lobby)], [NW_CANOPY.lobby, nwLobbyTop]], NW_CANOPY.u0 - 1.5, NW_CANOPY.u1);
// Noordvleugel: begane grond 1,2 m terug langs de noord- en oostgevel, plafond onder 45° tot de
// oranje band op de eerste verdieping.
const recessTop = z(FLOOR0) - N_RECESS; // binnenkant van het plafond
const nRecessNorth = profileU([[22.89 - N_RECESS, BASE - 1], [30, BASE - 1], [30, recessTop + 30 - (22.89 - N_RECESS)], [22.89 - N_RECESS, recessTop]], N_WEST - 1.5, 48.74 + 1.5);
const nRecessEast = (() => {
  const pts = [];
  for (const v of [N_SOUTH - 1.5, 22.89 + 1.5]) for (const [u, h] of [[48.74 - N_RECESS, BASE - 1], [56, BASE - 1], [56, recessTop + 56 - (48.74 - N_RECESS)], [48.74 - N_RECESS, recessTop]]) pts.push([u, v, h]);
  return Manifold.hull(pts);
})();
// Entreenis in de noordgevel van de zuidwestvleugel (BAG), plafond onder 45°.
const swEntrance = (() => {
  const top = z(FLOOR0), pts = [];
  for (const u of [SW_ENTRANCE.u0, SW_ENTRANCE.u1]) for (const [v, h] of [[SW_ENTRANCE.v, BASE - 1], [0, BASE - 1], [0, top + 0 - SW_ENTRANCE.v], [SW_ENTRANCE.v, top]]) pts.push([u, v, h]);
  return Manifold.hull(pts);
})();
body = body.subtract(union([seLobby, nwLobby, nRecessNorth, nRecessEast, swEntrance]));
// Kolommen onder de zuidelijke luifel.
body = body.add(union(SE_CANOPY.columns.map((u) => Manifold.cylinder(seTop - 1.2 - BASE + 0.2, SE_CANOPY.columnD / 2, SE_CANOPY.columnD / 2, 20).translate([u, seFront + SE_CANOPY.columnD / 2 + 0.05, BASE]))));

// ---------- Gevelreliëf: vensterbanden als blinde nissen per verdieping ----------
// Per laag van 3,6 m een vensterband van 2,0 m hoog (borstwering 0,9 m, plafond onder 45°) en
// 0,35 m diep, in vakken van circa 7,2 m met penanten van 0,9 m: de doorlopende glasbanden tussen de
// donkere borstweringen (de rode lamellen ertussen zijn dunner dan 0,9 m). Elke nis wordt op de
// werkelijke gevel gezet (stralen vanuit het gebouwstelsel), alleen waar de gevel over de hele nis
// plus een penant aan beide kanten vlak en vrij ligt en er ≥ 1 m materiaal achter zit. De dichte
// donkere panelen naast de glazen strook (zuidgevel, u −2,4 tot 6,0 en 15,0 tot 17,84) en de glazen
// strook zelf krijgen geen nissen.
const DEPTH = 0.35, SILL = 0.9, HEAD = 0.35, BAY = 7.2, PIER = 0.9;
const cuts = [];
function windows(a, b, kmin, kmax, skip = []) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n wijst naar buiten (gebouw links)
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const face = (s, h) => {
    const from = P(s, -6, h), hits = body.rayCast(from, P(s, 12, h));
    if (!hits.length) return null;
    const dist = (p) => Math.hypot(p.position[0] - from[0], p.position[1] - from[1]);
    return { f: dist(hits[0]) - 6, back: hits[1] ? dist(hits[1]) - dist(hits[0]) : Infinity };
  };
  const STEP = 0.5;
  for (let k = kmin; k <= kmax; k++) {
    const zf = z(level(k - 1));
    const lo = zf + SILL, hi = zf + STOREY - HEAD - DEPTH;
    // Gevel per 0,5 m aftasten op de hoogte van de onder- en bovenkant van de nis; aaneengesloten
    // stukken van één vlak (getrapte gevels verspringen per drie lagen) worden in vakken verdeeld,
    // met een penant van 0,9 m tegen elk einde en tussen de nissen.
    const runs = [];
    let run = null;
    for (let s = 0; s <= L + 1e-9; s += STEP) {
      const r = [lo + 0.05, hi + DEPTH - 0.05].map((h) => face(s, h));
      const ok = r.every((x) => x && x.f > -0.05 && x.f < 4.5 && x.back >= DEPTH + 1) && Math.abs(r[0].f - r[1].f) < 0.03 && !skip.some(([x0, x1]) => s > x0 && s < x1);
      if (ok && run && Math.abs(r[0].f - run.f) < 0.03) run.s1 = s;
      else { if (run) runs.push(run); run = ok ? { f: r[0].f, s0: s, s1: s } : null; }
    }
    if (run) runs.push(run);
    for (const { f, s0: r0, s1: r1 } of runs) {
      const a0 = r0 + PIER, a1 = r1 - PIER, len = a1 - a0;
      if (len < 0.9) continue;
      const bays = Math.max(1, Math.round((len + PIER) / BAY)), w = (len - (bays - 1) * PIER) / bays;
      if (w < 0.9) continue;
      for (let j = 0; j < bays; j++) {
        const s0 = a0 + j * (w + PIER), s1 = s0 + w;
        cuts.push(Manifold.hull([
          P(s0, f - 0.3, lo), P(s1, f - 0.3, lo), P(s0, f + DEPTH, lo), P(s1, f + DEPTH, lo),
          P(s0, f - 0.3, hi + DEPTH + 0.3), P(s1, f - 0.3, hi + DEPTH + 0.3), P(s0, f + DEPTH, hi), P(s1, f + DEPTH, hi),
        ]));
      }
    }
  }
}
// Toren: zuidgevel west (boven de zuidwestvleugel) en oost, oostkop, noordgevel, westkop.
windows([-20.7, -7.5], [STRIP.u0, -7.5], 13, 31, [[-2.4 + 20.7, 99]]);
windows([STRIP.u1, SOUTH_E], [32.85, SOUTH_E], 3, 31, [[0, 17.84 - STRIP.u1]]);
windows([32.85, SOUTH_E], [32.85, 10.4], 1, 31);
windows([32.85, 10.4], [NE_FROM, 10.4], 6, 31);
windows([NE_FROM, NORTH_MID], [N_WEST, NORTH_MID], 6, 31);
windows([N_WEST, 9.85], [-20.7, 9.85], 3, 31);
windows([-20.7, 9.85], [-20.7, -7.5], 1, 31);
// Zuidwestvleugel.
windows([-20.7, -4.2], [-43.2, -4.2], 1, 12);
windows([-43.2, -4.2], [-43.2, -21.35], 1, 12);
windows([-43.2, -21.35], [4.05, -21.35], 1, 12);
windows([4.05, -21.35], [4.05, -7.5], 1, 12);
// Noordvleugel.
windows([48.74, 22.89], [N_WEST, 22.89], 1, 5);
windows([48.74, N_SOUTH], [48.74, 22.89], 1, 5);
windows([N_WEST, 22.89], [N_WEST, 9.85], 1, 5);
windows([32.85, N_SOUTH], [48.74, N_SOUTH], 1, 5);

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Carlton: ${parts.length} losse delen`);
console.log("Carlton", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:carlton-getrapte-toren-glazen-strook-mast-en-vleugels", building]],
  catalog: {
    name: "Carlton (WTC Almere)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 39.194, // laagste PDOK-terrein op de groundSamplePoints (ellipsoïdisch), op straat aan de oostkant
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-48, -12], [0, -25], [38, 0], [52, 15], [20, 27], [-15, 15]],
    replacesBuildings: ["NL.IMBAG.Pand.0034100000051481"],
    description:
      "Carlton (WTC Almere) aan het Stationsplein: rechthoekige toren van 32 lagen tot NAP +112,7 m met een vooruitspringende glazen strook in de zuidgevel, een kroon tot +116,4 m en een antennemast tot +137,5 m; oostkop, noordoosthoek en westkop springen naar beneden toe in treden van drie lagen uit. Zuidwestvleugel van 12 lagen tot +44,2 m en noordvleugel van 6 lagen tot +18,99 m, eveneens getrapt; oranje luifel met kolommen boven de entree aan het Stationsplein, luifel aan de noordwestkant en een teruggezette begane grond onder de noordvleugel; vensterbanden als blinde nissen per verdieping. Contouren uit de BAG, hoogtes en treden uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong in de toren, X-as langs de lange gevels (13,76° op RD-oost). Tredenposities tussen de gemeten randen, de luifels, kolommen, de mastdikte en het vensterraster zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      crownTopNapM: CROWN_TOP,
      mastTopNapM: MAST_TOP,
      towerTopSizeM: [47.9, 16.05],
      eastEndSteps: EAST,
      northEastSteps: NORTH_NE,
      westEndSteps: WEST,
      southWestWingRoofNapM: SW_ROOF,
      southWestWingSteps: { west: SW_WEST, south: SW_SOUTH, north: SW_NORTH, east: SW_EAST },
      northWingRoofNapM: N_ROOF,
      northWingSteps: { north: N_NORTH, east: N_EAST },
      storeyGrid: { firstFloorNapM: FLOOR0, storeyM: STOREY },
      southCanopyTopNapM: SE_CANOPY.top,
      northWestCanopyTopNapM: NW_CANOPY.top,
      facadeAngleDegrees: ANGLE,
      estimatedSteps: true,
      estimatedCanopies: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0034100000051481 (bouwjaar 2010), actuele orthoHR, AHN DSM/DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0034100000051481",
      "https://nl.wikipedia.org/wiki/Carlton_(gebouw)",
      "https://commons.wikimedia.org/wiki/File:Carlton_Almere.jpg",
      "https://commons.wikimedia.org/wiki/File:CarltonAlmere.jpg",
      "https://commons.wikimedia.org/wiki/File:20150316_Almere_09.JPG",
      "https://commons.wikimedia.org/wiki/File:20150316_Almere_35.JPG",
      "https://commons.wikimedia.org/wiki/File:20150316_Almere_289.JPG",
      "https://commons.wikimedia.org/wiki/File:Almere_World_Trade_Centre_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Almere_World_Trade_Centre_2.jpg",
    ],
  },
});
