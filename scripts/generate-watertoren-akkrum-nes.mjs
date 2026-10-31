// Watertoren van Nes bij Akkrum (A.P. Wesselman van Helmond, 1957), sinds 2016
// een hotel met twee kamers in het reservoir. Gelijk aan de toren van Sint
// Jacobiparochie.
// Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP -0,15 m),
// assen in RD-richting. De BAG-contour (10,33 m) is het bovenaanzicht van het
// reservoir, niet de voet. Hoogtes en stralen uit de frontale RCE-foto 20419892,
// geschaald op die reservoirbreedte (41,3 px/m); de reservoirtop komt daarmee op
// 38,4 m. De hotelramen uit de foto van 2018, de trap naar de deur op de
// luchtfoto aan de zuidzuidoostkant.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [186264.59, 563191.05];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  plate: 1.0, // betonnen voetplaat met afgeschuinde rand
  footRing: 1.9,
  collar: 29.6, // kraag boven aan de schacht
  tankFoot: 30.3, // vlakke onderkant van het reservoir
  tankRoll: 31.4, // ronde onderrand
  tankTop: 38.2,
  rim: 38.45, // dakrand
  lanternTop: 39.6,
  capTop: 39.8,
};
const R = { plateFoot: 3.85, plateTop: 3.05, ring: 2.5, shaft: 2.38, flat: 4.1, tank: 5.17, rim: 5.22, lantern: 1.1 };
const DOOR = -60; // trap en deur naar het zuidzuidoosten

// ---------- voetplaat, voetring, kraag en reservoir als omwentelingsprofiel ----------
const roll = Array.from({ length: 6 }, (_, k) => {
  const t = ((k + 1) / 6) * (Math.PI / 2);
  return [R.flat + (R.tank - R.flat) * Math.sin(t), H.tankFoot + (H.tankRoll - H.tankFoot) * (1 - Math.cos(t))];
});
const lower = Manifold.revolve(new CrossSection([[[0, BASE], [R.plateFoot, BASE], [R.plateFoot, 0], [R.plateTop, H.plate], [R.ring, H.plate], [R.ring, H.footRing], [0, H.footRing]]]), 64);
const upper = Manifold.revolve(new CrossSection([[[0, H.collar], [R.ring, H.collar], [R.ring, H.tankFoot], [R.flat, H.tankFoot], ...roll, [R.tank, H.tankTop], [R.rim, H.tankTop], [R.rim, H.rim], [0, H.rim]]]), 96);
// Schacht als twintighoek: de vlakke lisenen van de cannelures.
const shaft = hull([...ring3(circle([0, 0], R.shaft / Math.cos(Math.PI / 20), 20, Math.PI / 20), H.plate - 0.05), ...ring3(circle([0, 0], R.shaft / Math.cos(Math.PI / 20), 20, Math.PI / 20), H.collar + 0.05)]);
const lantern = union([
  hull([...ring3(circle([0, 0], R.lantern / Math.cos(Math.PI / 8), 8, Math.PI / 8), H.rim - 0.05), ...ring3(circle([0, 0], R.lantern / Math.cos(Math.PI / 8), 8, Math.PI / 8), H.lanternTop)]),
  hull([...ring3(circle([0, 0], (R.lantern + 0.15) / Math.cos(Math.PI / 8), 8, Math.PI / 8), H.lanternTop - 0.05), ...ring3(circle([0, 0], (R.lantern + 0.15) / Math.cos(Math.PI / 8), 8, Math.PI / 8), H.capTop)]),
]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = [
  place(niche(R.ring, 1.0, 1.9, 4.0, 0.3), { deg: DOOR }), // deur boven de trap
  // Twaalf hoge hotelramen rondom het reservoir.
  ...Array.from({ length: 12 }, (_, k) => place(niche(R.tank, 0.9, 33.6, 36.7), { deg: DOOR + 15 + k * 30 })),
];

await writeLandmark({
  slug: "watertoren-akkrum-nes",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:voetplaat-schacht-reservoir-en-lantaarn", union([lower, shaft, upper, lantern]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Akkrum-Nes",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    replacesBuildings: ["NL.IMBAG.Pand.0055100000257787"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour (het reservoir) op maaiveld (NAP -0,15 m), assen in RD-richting. Betonnen voetplaat van 7,7 m tot 1,0 m, schacht met cannelures (twintighoek van 4,8 m) tot de kraag op 30,3 m, reservoir van 10,33 m met vlakke onderkant en ronde onderrand, twaalf hotelramen en dakrand op 38,45 m, kleine achthoekige lantaarn tot 39,8 m. Deur boven de trap naar het zuidzuidoosten. Maten uit BAG, een RCE-foto en de luchtfoto.",
    realWorld: {
      publishedHeightM: 41,
      reservoirM3: 515,
      ahnGroundNapM: -0.15,
      ahnTopNapM: 41.75,
      bagTankDiameterM: 10.33,
      plateDiameterM: 7.7,
      shaftDiameterM: 4.76,
      tankFootM: 30.3,
      rimM: 38.45,
      modelTopM: 39.8,
      photoScalePxPerM: 41.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Akkrum)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Akkrum_-_20419892_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:20181005_Watertoren1_van_Nes.jpg (hotelramen)",
      "https://commons.wikimedia.org/wiki/File:Detail_watertoren,_ingangspartij_-_Akkrum_-_20419893_-_RCE.jpg",
      "PDOK BAG-pand 0055100000257787, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});
