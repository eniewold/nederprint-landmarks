// Laakhaventoren (Stamkartplein, Laakhavens, Den Haag, 2001–2003, atelier PRO): ronde woontoren van
// 21 lagen in rode baksteen, 25,4 m doorsnede, naast station Hollands Spoor. Per laag vensters in een
// dambordpatroon (hoge Franse balkons en lage vensters om en om), op het zuiden een stapel van twee
// loggia's naast elkaar, een bovenste laag met brede openingen met liggende leuningen; achter die
// openingen ligt in het zuidwesten een dakterras één laag lager, binnen de doorlopende bakstenen ring.
// Op het dak een installatieopbouw en een krans dakluiken.
// Tegen de oostkant staat de laagbouw van hetzelfde complex (eigen BAG-pand), die de cilinder op de
// begane grond insnijdt; de PDOK-reconstructie van dat pand loopt in die inham tot NAP +63,5 m door
// en steekt tot 0,65 m buiten de cilinder, daarom zit de laagbouw als eenvoudig blok in het model.
// Contouren uit de BAG, hoogtes uit de 3D BAG (AHN5) en het AHN-DSM, gevelindeling uit een foto.
import { Manifold, circle, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "laakhaventoren";
// Stelsel: x naar RD-oost, y naar RD-noord; oorsprong in het middelpunt van de cilinder (cirkelfit op
// de 31 boogpunten van de BAG-contour, restfout < 0,04 m).
const ORIGIN = [82021.65, 453602.25];
const AXIS = [1, 0];
const GROUND = 1.82; // NAP, AHN-DTM aan de voet (1,79–1,88), 3D BAG-maaiveld 1,81
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [+(x - ORIGIN[0]).toFixed(2), +(y - ORIGIN[1]).toFixed(2)];
const rad = (deg) => (deg * Math.PI) / 180;

// ---------- Hoogtes (NAP) ----------
const ROOF = 63.43; // hoofddak (3D BAG 63,42–63,47; AHN-DSM mediaan 63,38; 70e percentiel 3D BAG 63,45)
const TERRACE = 60.75; // dakterras in het zuidwesten (3D BAG 60,73–60,78; DSM 60,7)
const PLANT = 65.17; // installatieopbouw (3D BAG 65,15–65,20; DSM 65,1–65,3)
const SKYLIGHT = 0.5; // dakluiken boven het dak (geschat, ortho)
const WING_ROOF = 17.5; // laagbouw (DSM 17,4–17,5; 3D BAG 50e percentiel 17,54)
const WING_EDGE = 18.2; // verhoogde rand langs de noordwestgevel van de laagbouw (DSM 18,1–18,2)
const WING_TUBE = 17.95; // lichtstraat op de as van de laagbouw (DSM 17,9)

// ---------- Plattegrond ----------
const R = 12.706; // straal uit de BAG-cirkelfit (doorsnede 25,4 m; Wikipedia: 25 m)
const SEG = 108; // 4 segmenten per venstertravee
const CYL = circle([0, 0], R, SEG, 0);
// Dakterras: deel van het dak dat één laag lager ligt (3D BAG-dakvlak), randen buiten de cilinder verlengd.
// De gevel loopt er als ring met brede openingen omheen (foto); in het AHN is die ring te dun om te zien.
// In het model is hij 1,25 m dik, zodat er achter de nissen nog 0,9 m staat.
const RING = 1.25;
const TERRACE_POLY = [[-15.9, -2.33], [-5.86, -0.95], [-6.09, -2.3], [-0.73, -6.34], [0.67, -5.69], [3.4, -15.85], [-16, -16]];
const PLANT_POLY = [[-1.41, -2.66], [3.4, 1.21], [2.96, 1.88], [0.86, 3.49], [-3.35, -0.15]].reverse(); // 3D BAG
// Dakluiken (ortho, 1 × 1 m, 40° gedraaid), op het hoofddak rond de opbouw.
const SKYLIGHTS = [[-1.2, 8.4], [1.95, 8.4], [5.3, 6.9], [7.95, 4.1], [8.8, -0.9], [7.6, -4.5], [-5.05, 6.75], [-7.05, 4.5], [-8.4, 0.5]];
// Laagbouw 0518100000242823: rechthoek van 19,0 × 50,9 m langs de Laakhaven (randen op 42,0° en 132,0°);
// de zuidwesthoek ligt binnen de cilinder.
const WING = [[82024.53, 453598.78], [82037.22, 453584.64], [82075.06, 453618.67], [82062.32, 453632.8]].map(local);
// Inham van de laagbouw in de BAG-contour van de toren: boog van -50,4° tot 19,4°.
const NOTCH = [-50.4, 19.4];

// ---------- Verdiepingen ----------
// 21 lagen (Wikipedia): begane grond 4,4 m (foto: anderhalve verdieping), 19 woonlagen van 2,857 m tot
// de vloer van de bovenste laag, die met het dakopbouwpakket tot het dak 2,93 m hoog is.
const GF = 4.4;
const STOREY = 2.857;
const floorZ = (s) => (s === 0 ? 0 : GF + (s - 1) * STOREY);
const TOP = 20;

// ---------- Gevelraster ----------
// 27 traveeën van 13,33° (2,96 m langs de gevel). Foto vanuit het zuidwesten (de kopgevel van de
// laagbouw staat er recht van voren op): van de zuidhoek van de laagbouw naar het westen eerst één
// vensterkolom (k = 1), dan de loggiastapel (k = 0 en 26), en vier en vijf kolommen verder de twee
// entreetraveeën (k = 22 en 21). De naad van het dambord (27 is oneven) valt tussen de twee loggia's.
const N = 27;
const colAngle = (k) => -74.3 + (360 / N) * k;
const LOGGIA = new Set([0, 26]);
const ENTRANCE = new Set([21, 22]); // over begane grond en 1e laag
const DEPTH = 0.35;

const tower = (() => {
  const cyl = prism(CYL, BASE, z(ROOF));
  const terrace = prism(TERRACE_POLY, z(TERRACE), z(ROOF) + 1).intersect(prism(circle([0, 0], R - RING, SEG, 0), z(TERRACE) - 1, z(ROOF) + 2));
  const skylights = SKYLIGHTS.map(([x, y]) => {
    const c = Math.cos(rad(40)) * 0.5, s = Math.sin(rad(40)) * 0.5;
    return prism([[x + c - s, y + s + c], [x - c - s, y - s + c], [x - c + s, y - s - c], [x + c + s, y + s - c]], z(ROOF) - 0.1, z(ROOF) + SKYLIGHT);
  });
  return union([cyl.subtract(terrace), prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)), ...skylights]);
})();

// Ligt de gevel op deze plek op de cilinder?
const onCylinder = (deg, h) => {
  const d = [Math.cos(rad(deg)), Math.sin(rad(deg))];
  const hit = tower.rayCast([d[0] * (R + 3), d[1] * (R + 3), h], [0, 0, h])[0];
  return hit && Math.abs(Math.hypot(hit.position[0], hit.position[1]) - R) < 0.1;
};
// Nis in de ronde gevel: middenhoek, breedte langs de gevel, diepte, onderkant en bovenkant van de
// achterwand; het plafond loopt onder 45° naar de gevel (bovenkant in de gevel = hi + diepte).
// Brede nissen in stukken van hoogstens 1,2 m, zodat de achterwand de kromming volgt.
function niche(deg, width, depth, lo, hi) {
  const pieces = Math.ceil(width / 1.2);
  const half = width / 2 / R;
  return Array.from({ length: pieces }, (_, i) => {
    const a0 = rad(deg) - half + (2 * half * i) / pieces, a1 = rad(deg) - half + (2 * half * (i + 1)) / pieces;
    return Manifold.hull([a0, a1].flatMap((a) => {
      const c = Math.cos(a), s = Math.sin(a), out = R + 0.2, inn = R - depth;
      return [[c * out, s * out, lo], [c * inn, s * inn, lo], [c * out, s * out, hi + depth + 0.2], [c * inn, s * inn, hi]];
    }));
  });
}
// Raakt een opening van deze breedte (plus 0,3 m marge) de inham van de laagbouw?
const inNotch = (deg, width) => {
  const half = (((width / 2 + 0.3) / R) * 180) / Math.PI;
  return deg + half > NOTCH[0] && deg - half < NOTCH[1];
};

const cuts = [];
for (let k = 0; k < N; k++) {
  const deg = ((colAngle(k) + 540) % 360) - 180;
  for (let s = 0; s < TOP; s++) {
    const zf = floorZ(s), next = floorZ(s + 1);
    let w, d, lo, top; // top = bovenkant van de opening in de gevel
    if (s === 0) {
      if (ENTRANCE.has(k)) [w, d, lo, top] = [1.8, 0.4, 0, floorZ(1) + 2.55];
      else if (LOGGIA.has(k)) [w, d, lo, top] = [1.8, 0.4, 0, 3.4];
      else [w, d, lo, top] = [1.8, DEPTH, 0.9, 3.6];
    } else if (s === 1 && ENTRANCE.has(k)) continue;
    else if (LOGGIA.has(k)) [w, d, lo, top] = [2.0, 1.0, zf + 0.95, next];
    else if ((k + s) % 2 === 0) [w, d, lo, top] = [1.8, DEPTH, zf + 0.42, zf + 2.36]; // hoog venster met Frans balkon
    else [w, d, lo, top] = [1.8, DEPTH, zf + 1.21, zf + 2.36]; // laag venster
    // Achter de laagbouw: alleen boven het dak daarvan.
    if (inNotch(deg, w) && lo < z(WING_EDGE) + 0.3) continue;
    cuts.push(...niche(deg, w, d, lo, top - d));
  }
}
// Bovenste laag: 14 brede openingen van 4,6 × 1,4 m met penanten van 1,1 m en een latei van 0,9 m (foto:
// 4,7 × 1,4 m, latei 0,75 m), rondom, ook voor het dakterras.
const topTop = z(ROOF) - 0.9, topLo = topTop - 1.4;
for (let i = 0; i < 14; i++) {
  const deg = -74.3 + (360 / 14) * (i + 0.5);
  const span = ((2.4 / R) * 180) / Math.PI;
  if (![deg - span, deg, deg + span].every((a) => onCylinder(a, topLo + 0.05) && onCylinder(a, topTop - 0.05))) continue;
  cuts.push(...niche(deg, 4.6, DEPTH, topLo, topTop - DEPTH));
}
// Glazen deuren van de bovenste laag naar het dakterras: rechte wanden, nis van 1,5 m op 2,9 m.
for (let i = 0; i < 5; i++) {
  const a = TERRACE_POLY[i], b = TERRACE_POLY[i + 1];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 3) continue;
  const dir = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  const lo = z(TERRACE) + 0.1, hi = z(ROOF) - 0.9 - DEPTH;
  const pitch = 2.9, width = 1.5, n = Math.floor((L - 0.9) / pitch), m = (L - n * pitch) / 2;
  for (let j = 0; j < n; j++) {
    const s0 = m + j * pitch + (pitch - width) / 2, s1 = s0 + width;
    // Wandnormaal naar het terras: de kant waar de straal vanaf het terras de wand op afstand 3 raakt.
    for (const sign of [1, -1]) {
      const nrm = [dir[1] * sign, -dir[0] * sign];
      const P = (s, depth, h) => [a[0] + dir[0] * s - nrm[0] * depth, a[1] + dir[1] * s - nrm[1] * depth, h];
      const exposed = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = tower.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const towerSolid = tower.subtract(union(cuts));

// ---------- Laagbouw ----------
// Blok op de BAG-rechthoek tot NAP +17,5 m, minus de cilinder; op de as een lichtstraat van 2,0 m breed
// (ortho, 0,45 m hoog), langs de noordwestgevel een verhoogde rand van 0,9 m tot +18,2 m.
const wing = (() => {
  const [A, B, C, D] = WING;
  const L = Math.hypot(C[0] - B[0], C[1] - B[1]);
  const u = [(C[0] - B[0]) / L, (C[1] - B[1]) / L];
  const W = Math.hypot(A[0] - B[0], A[1] - B[1]);
  const v = [(A[0] - B[0]) / W, (A[1] - B[1]) / W];
  const Q = (s, t, h) => [B[0] + u[0] * s + v[0] * t, B[1] + u[1] * s + v[1] * t, h];
  const block = prism(WING, BASE, z(WING_ROOF));
  const edge = prism([Q(0, W - 0.9), Q(L, W - 0.9), Q(L, W), Q(0, W)].map(([x, y]) => [x, y]), z(WING_ROOF) - 0.1, z(WING_EDGE));
  const r0 = z(WING_ROOF) - 0.1, top = z(WING_TUBE);
  const tube = Manifold.hull([12.5, L - 1.0].flatMap((s) => [
    Q(s, W / 2 - 1.0, r0), Q(s, W / 2 + 1.0, r0), Q(s, W / 2 - 1.0, z(WING_ROOF)), Q(s, W / 2 + 1.0, z(WING_ROOF)),
    Q(s, W / 2 - 0.7, z(WING_ROOF) + 0.32), Q(s, W / 2 + 0.7, z(WING_ROOF) + 0.32), Q(s, W / 2, top),
  ]));
  return union([block, edge, tube]).subtract(prism(CYL, BASE - 1, z(ROOF) + 5));
})();

const nodes = [["building:laakhaventoren-toren", towerSolid], ["building:laakhaventoren-laagbouw", wing]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [name, m];
});
console.log("nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Laakhaventoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.25, // NAP-maaiveld + plaatselijke geoïde (43,44; Beatrixlaan-model 43,40 bij geoïde 43,43)
    groundOffsetMetres: -0.15,
    // Maaiveld aan de voet van de toren; de laagbouw reikt tot de kade van de Laakhaven.
    groundSamplePoints: [[-14.5, 0], [-10.3, -10.3], [0, -14.5], [7.3, -12.6]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000325303", "NL.IMBAG.Pand.0518100000242823"],
    description:
      "Ronde woontoren aan het Stamkartplein (2003, atelier PRO): cilinder van 25,4 m doorsnede op de BAG-cirkel tot NAP +63,43 m (61,6 m boven maaiveld), een installatieopbouw tot +65,17 m en negen dakluiken; per laag vensters als blinde nissen in een dambordpatroon van hoge en lage vensters op 27 traveeën, op het zuiden een stapel van twee loggia's naast elkaar, twee hoge entreenissen op het zuidwesten en een bovenste laag met veertien brede openingen, waarachter in het zuidwesten een dakterras op +60,75 m binnen de doorlopende ring ligt. De laagbouw van hetzelfde complex (eigen BAG-pand) staat erbij als blok tot +17,5 m met een lichtstraat en een verhoogde noordwestrand, omdat de PDOK-reconstructie ervan in de inham tot +63,5 m doorloopt en buiten de cilinder steekt; in die inham loopt de cilinder door tot het maaiveld. Oorsprong in het middelpunt van de cilinder, X-as naar RD-oost. Hoogtes uit de 3D BAG (AHN5) en het AHN-DSM; verdiepingshoogtes, het vensterraster (uit één foto vanuit het zuidwesten; noord- en oostgevel doorgetrokken), de begane grond, de ringdikte van 1,25 m rond het terras en de dakluiken zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      heightAboveGroundM: +(ROOF - GROUND).toFixed(2),
      terraceNapM: TERRACE,
      plantNapM: PLANT,
      diameterM: +(2 * R).toFixed(2),
      floors: 21,
      groundFloorHeightM: GF,
      storeyHeightM: STOREY,
      bays: N,
      wingRoofNapM: WING_ROOF,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0518100000325303 (toren, bouwjaar 2002) en 0518100000242823 (laagbouw), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG (AHN5, 2023): dakvlakken LoD2.2 van beide panden",
      "https://nl.wikipedia.org/wiki/Laakhaventoren",
      "https://commons.wikimedia.org/wiki/File:Laakhaventoren.jpg",
    ],
  },
});
