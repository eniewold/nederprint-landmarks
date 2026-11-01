// Nieuwe Watertoren aan de Groningerstraatweg in Leeuwarden (Bredasche Beton
// Maatschappij, 1925), in 1973 verhoogd met een groter reservoir en in spuitbeton
// gezet, sinds 2002 woontoren Aquastate met negen appartementen.
// Plattegrond: een verjongende ster van acht bakstenen penanten (vlakken van
// 3,3 m) met acht travees ertussen. Onder de 19,8 m liggen de travees in het vlak
// van de penanten (zestienhoek); daarboven springen ze 1,1 m in, met zink en de
// vensters van de bovenste vijf woonlagen. Daarop een zinken dakrand en een
// vlakke kegel met een verdiept dakterras aan de zuidwestzijde.
// Oorsprong op het hart van de BAG-contour (pand 0080100000337268, 18,0 m over
// de penanten) op maaiveld (NAP +1,0 m), assen in RD-richting. Penanten op
// 12 + k*45 graden en de inspringing uit de BAG-contour; verjonging, de
// inspringing boven 19,8 m, dakrand, dak en terras uit het AHN; de woonlagen uit
// de foto "Watertoren Leeuwarden 08cw" (15 px/m, geschaald op de dakrand in het AHN).
import { Manifold, hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [183444.5, 580597.7];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  sill: 19.8, // dorpel van de inspringende travees, aan de gevel van de travee
  sillOuter: 18.95, // dezelfde dorpel 2,3 m verder naar buiten (zakt naar buiten af)
  corniceFoot: 35.6, // begin van de schuine zinken dakrand op de penanten
  roofEdge: 37.8, // dakrand in het AHN
  apex: 40.6, // midden van het kegeldak (AHN-top NAP +41,65)
  terrace: 37.1, // vloer van het dakterras
};
const R = { pier: 9.0, bay: 7.85 }; // hoekstraal van penant en travee aan de voet (BAG)
const PIER_HALF = 10.5; // halve hoek van een penantvlak in graden
const PIER0 = 12; // eerste penant, graden linksom van RD-oost; elke 45 graden
const TAPER = 0.0028; // straal schaalt met 1 - TAPER*z: 9,0 m aan de voet, 8,05 m op de dakrand
const BLIND = [305]; // dichte zinken travee (zuidoost) op de foto, zonder vensters
const DOOR = 125; // ingang naar het pad van de Groningerstraatweg (noordwest)

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const piers = Array.from({ length: 8 }, (_, k) => PIER0 + 45 * k);
const bays = piers.map((p) => p + 22.5);

// ---------- schacht: zestienhoek door de hoeken van de penanten ----------
const corners = piers.flatMap((p) => [polar(R.pier, p - PIER_HALF), polar(R.pier, p + PIER_HALF)]);
const lowerApothem = R.pier * Math.cos(rad(22.5 - PIER_HALF)); // vlak van een travee onder de dorpel
const shaft = prism(corners, BASE, H.roofEdge);

// Inspringing van elke travee boven de dorpel. Lokaal: +X naar buiten door het
// midden van de travee. De zijwanden lopen van de hoek van de travee (r 7,85 op
// 10 graden) naar de hoek van het penant (r 9,0 op 12 graden) en verder naar buiten.
const bayFace = R.bay * Math.cos(rad(10));
const inner = [bayFace, R.bay * Math.sin(rad(10))];
const outerC = [lowerApothem, R.pier * Math.sin(rad(22.5 - PIER_HALF))];
const t = (10 - inner[0]) / (outerC[0] - inner[0]);
const far = [10, inner[1] + t * (outerC[1] - inner[1])];
const recess = hull([
  [inner[0], -inner[1], H.sill], [inner[0], inner[1], H.sill], [far[0], -far[1], H.sillOuter], [far[0], far[1], H.sillOuter],
  [inner[0], -inner[1], 45], [inner[0], inner[1], 45], [far[0], -far[1], 45], [far[0], far[1], 45],
]);

// ---------- schuine zinken dakrand: de bovenkant van de penanten loopt onder 64 graden naar binnen ----------
const sixteen = (apothem, z) => ring3(circle([0, 0], apothem / Math.cos(Math.PI / 16), 16, rad(PIER0) + Math.PI / 16), z);
const corniceKeep = union([
  hull([...sixteen(12, BASE - 1), ...sixteen(12, H.corniceFoot)]),
  hull([...sixteen(R.pier * Math.cos(rad(PIER_HALF)) + 0.05, H.corniceFoot), ...sixteen(7.85, H.roofEdge), ...sixteen(7.85, H.roofEdge + 1)]),
]);

// ---------- vlak kegeldak, zestienzijdig, tot het knopje in het midden ----------
const roof = hull([...sixteen(7.5, H.roofEdge - 0.05), ...ring3(circle([0, 0], 0.5, 16, rad(PIER0) + Math.PI / 16), H.apex)]);

// Verdiept dakterras aan de zuidwestzijde (205 tot 250 graden, na verjonging r 4,7 tot 6,0).
const sTop = 1 - TAPER * 37.5;
const terrace = prism([
  ...Array.from({ length: 10 }, (_, k) => polar(4.7 / sTop, 205 + (k * 45) / 9)),
  ...Array.from({ length: 10 }, (_, k) => polar(6.0 / sTop, 250 - (k * 45) / 9)),
], H.terrace, 45);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const UPPER = [35.4, 32.2, 29.0, 25.8, 22.6]; // bovenkant van de vensters boven de dorpel, 1,8 m hoog
const LOWER = [18.2, 14.7, 11.2, 7.7]; // en eronder, 1,9 m hoog
const cuts = [
  ...bays.map((deg) => place(recess, { deg })),
  ...bays.filter((deg) => !BLIND.includes(deg)).flatMap((deg) => [
    ...UPPER.map((z) => place(niche(bayFace, 2.2, z - 1.8, z), { deg })),
    ...LOWER.map((z) => place(niche(lowerApothem, 2.1, z - 1.9, z), { deg })),
  ]),
  place(niche(lowerApothem, 2.0, 0, 2.6, 0.4), { deg: DOOR }),
  terrace,
];

// Verjonging: alles is gebouwd op de maten aan de voet en krimpt lineair met de hoogte.
const tower = union([shaft.intersect(corniceKeep), roof]).subtract(union(cuts)).warp((v) => {
  const s = 1 - TAPER * v[2];
  v[0] *= s;
  v[1] *= s;
});

await writeLandmark({
  slug: "watertoren-leeuwarden-groningerstraatweg",
  base: BASE,
  // Eén node: de export vult elke node apart op.
  nodes: [["building:schacht-met-penanten-travees-en-kegeldak", tower]],
  catalog: {
    name: "Watertoren Groningerstraatweg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10.5, 0], [-10.5, 0], [0, 10.5], [0, -10.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0080100000337268"],
    description:
      "Oorsprong op het hart van de BAG-contour op maaiveld (NAP +1,0 m), assen in RD-richting. Verjongende ster van acht bakstenen penanten (18,0 m over de penanten aan de voet, 16,1 m op de dakrand) met acht travees die boven 19,8 m 1,1 m inspringen, vensters van negen woonlagen als nissen, een dichte travee naar het zuidoosten en de ingang naar het noordwesten, een schuine zinken dakrand van 35,6 tot 37,8 m en een zestienzijdig kegeldak tot 40,6 m met een verdiept dakterras aan de zuidwestzijde. Maten uit AHN, BAG en één foto.",
    realWorld: {
      built: 1925,
      raised: 1973,
      apartments2002: 9,
      publishedHeightM: 36,
      ahnGroundNapM: 1.0,
      ahnTopNapM: 41.65,
      acrossPiersFootM: 18.0,
      acrossPiersRoofEdgeM: 16.1,
      bayRecessM: 1.1,
      sillM: 19.8,
      corniceFootM: 35.6,
      roofEdgeM: 37.8,
      terraceFloorM: 37.1,
      modelTopM: 40.6,
      photoScalePxPerM: 15,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Leeuwarden_Groningerstraatweg)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Leeuwarden_08cw.JPG (foto vanaf het zuiden, woonlagen en gevelindeling)",
      "PDOK BAG-pand 0080100000337268, AHN DSM/DTM 0,5 m en luchtfoto, 3D BAG LoD2.2, 2026-11-01",
    ],
  },
});
