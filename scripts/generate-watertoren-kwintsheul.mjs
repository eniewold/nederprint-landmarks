// Watertoren van tuinderij Sonnehoeck aan de Hollewatering 26 in Kwintsheul (Westland). Een kleine ijzeren watertoren
// uit circa 1900 (Wikipedia; het register: "begin van de twintigste eeuw") voor de besproeiing van de druivenkassen,
// rijksmonument 518154 binnen complex 518153 (Sonnehoeck). Register: een driedelig vakwerkstalen frame met trekstangen
// draagt een vierkant ijzeren reservoir met klinknagels; een ijzeren ladder leidt naar het reservoir; binnen het frame
// staat een vernieuwd motorhuisje voor de elektrische pomp, van rabatdelen met een flauw hellend lessenaarsdak.
// De toren staat er nog (luchtfoto Actueel_orthoHR en AHN) op de kade aan de sloot, tussen de boerderij en de
// zuidwestpunt van de druivenkas.
//
// De toren is geen BAG-pand: in de BAG-WFS en in de PDOK-gebouwtegels staat op deze plek niets (de kas, pand
// 1783100000040899, begint 2,7 m oostelijker; het woonhuis, 1783100000040898, ligt 7 m westelijker). replacesBuildings
// blijft dus leeg; zonder dit model toont de kaart hier alleen terrein.
//
// Oorsprong op het hart van het reservoir: het zwaartepunt van de vlakke top van het AHN-DSM 0,5 m (NAP +6,58 à +6,66
// over circa 2,0 bij 2,0 m), op het maaiveld (AHN-DTM NAP +0,6 op de kade). Het frame staat recht onder het reservoir.
// Lokale X-as 33 graden linksom van RD-oost, evenwijdig aan het woonhuis en de kas (BAG-randen 32,6 en 33 graden), zoals
// het frame op de foto's met het huis meeloopt; -Y wijst naar de sloot (zuidoost), +X naar de kas.
// Maten: bovenkant van het reservoir uit het AHN-DSM (NAP +6,63, dus 6,0 m boven de kade); breedte van het reservoir uit
// de vlakke top in het AHN en de luchtfoto (2,0 tot 2,4 m, aangenomen 2,2 m). De verhoudingen (reservoir een kwart van
// de hoogte, frame onderaan 1,35 keer zo breed als bovenaan, ringen op een en twee derde, motorhuisje een kwart van de
// hoogte) uit de RCE-foto's 20389997 en 20390019 (2004, vanaf de sloot) en "Watertoren holle watering.jpg" (2009).
import { Manifold, CrossSection, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [76953.6, 449071.1];
const AXIS_DEG = 33;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.6;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (+X 44,23, -X 44,07, +Y 44,12, -Y aan de
// slootkant 43,85), gemeten 2026-11-06; onder het hart ligt het PDOK-terrein op 44,09.
const GROUND_ELLIPSOID = 43.85;

const TAN50 = Math.tan((50 * Math.PI) / 180);

// ---------- hoogtes boven het maaiveld (NAP +0,6) ----------
const H = {
  shedLow: 1.35, // motorhuisje aan de slootkant (-Y), lessenaarsdak
  shedHigh: 1.6, // motorhuisje aan de huiskant (+Y)
  tier2: 1.75, // onderkant van het middelste vak (net boven het motorhuisje; ring op een derde)
  tier2Top: 2.5, // zijkant van het middelste vak; de top loopt onder 50 graden tot de ring op twee derde (2,94)
  tier3: 3.25, // onderkant van het bovenste vak
  tier3Top: 3.8, // zijkant van het bovenste vak; top op 4,10 onder de dragers van het reservoir
  tank: 4.4, // onderkant van het reservoir
  top: 6.0, // bovenkant van het reservoir (AHN NAP +6,63)
};
const R = {
  frameFoot: 1.5, // halve breedte van het frame op het maaiveld (foto: 1,35 keer de bovenkant)
  frameTop: 1.1, // halve breedte onder het reservoir, gelijk aan het reservoir
  leg: 0.9, // hoekstijl 0,9 m (in het echt een hoekprofiel van circa 0,15 m; 0,9 m minimum op 1:1000)
  shed: 1.45, // motorhuisje 2,9 bij 2,9 m, binnen het frame
  tank: 1.1, // reservoir 2,2 m in het vierkant
  tankCorner: 0.25, // afgeronde hoeken van het reservoir
};
// Halve breedte van het frame op hoogte z.
const w = (z) => R.frameFoot - ((R.frameFoot - R.frameTop) * z) / H.tank;
const square = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]];

// ---------- frame: afgeknotte piramide met vier hoekstijlen en twee ringen ----------
// De vakken tussen de stijlen zijn open: per vak twee doorgangen dwars door het frame (langs X en langs Y). De vlakke
// onderkant is de ring eronder, de zijden volgen de binnenkant van de stijlen (5 graden uit het lood) en de top loopt
// onder 50 graden naar het midden; waar de twee doorgangen elkaar kruisen ontstaat een kruisgewelf met vlakken van
// 50 graden, zodat er niets vrij overhangt. Boven elk vak blijft de ring als dichte plaat staan.
const frame = hull([...square(w(BASE)).map(([x, y]) => [x, y, BASE]), ...square(R.frameTop).map(([x, y]) => [x, y, H.tank])]);
// Doorgang langs X, van z0 tot de zijkant z1, met een spitse top.
const opening = (z0, z1) => {
  const g0 = w(z0) - R.leg, g1 = w(z1) - R.leg, apex = z1 + g1 * TAN50, X = R.frameFoot + 1;
  return hull([-X, X].flatMap((x) => [[x, -g0, z0], [x, g0, z0], [x, -g1, z1], [x, g1, z1], [x, 0, apex]]));
};
const panels = union([opening(H.tier2, H.tier2Top), opening(H.tier3, H.tier3Top)].flatMap((m) => [m, place(m, { deg: 90 })]));

// ---------- motorhuisje: rabatdelen, lessenaarsdak aflopend naar de sloot ----------
const shedPrism = prism(square(R.shed), BASE, 3);
// Dakvlak z = a y + c door (y = -1,45, 1,35) en (y = 1,45, 1,6).
const a = (H.shedHigh - H.shedLow) / (2 * R.shed), c = (H.shedHigh + H.shedLow) / 2;
const n = Math.hypot(a, 1);
const shed = shedPrism.trimByPlane([0, -a / n, 1 / n].map((v) => -v), -c / n);

// ---------- reservoir: vierkant met afgeronde hoeken ----------
const tank = Manifold.extrude(CrossSection.square([2 * (R.tank - R.tankCorner), 2 * (R.tank - R.tankCorner)], true).offset(R.tankCorner, "Round", 2, 24), H.top - H.tank).translate([0, 0, H.tank]);

const all = union([frame.subtract(panels), shed, tank]);

await writeLandmark({
  slug: "watertoren-kwintsheul",
  base: BASE,
  nodes: [["building:watertoren-frame-motorhuisje-en-reservoir", all]],
  catalog: {
    name: "Watertoren Kwintsheul",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[2.2, 0], [-2.2, 0], [0, 2.2], [0, -2.2]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: [],
    description:
      "Oorsprong op het hart van het reservoir (vlakke top in het AHN-DSM) op de kade (NAP +0,6 m), X-as 33 graden linksom van RD-oost evenwijdig aan woonhuis en kas, -Y naar de sloot. Taps vakwerkframe van 3,0 m op het maaiveld tot 2,2 m onder het reservoir met vier hoekstijlen van 0,9 m, ringen op een en twee derde en open vakken met een spitse top (kruisgewelf); motorhuisje van 2,9 m in het vierkant met lessenaarsdak (1,35 tot 1,6 m) in het frame; vierkant reservoir van 2,2 m met afgeronde hoeken van 4,4 tot 6,0 m. Geen BAG-pand. Hoogte uit het AHN, verhoudingen uit de foto's.",
    realWorld: {
      built: 1900,
      rijksmonument: 518154,
      complex: "Sonnehoeck (518153)",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 6.63,
      frameFootWidthM: 2 * R.frameFoot,
      frameTopWidthM: 2 * R.frameTop,
      legM: R.leg,
      ringsM: [H.tier2, 2.94],
      shedM: [H.shedLow, H.shedHigh],
      shedWidthM: 2 * R.shed,
      tankWidthM: 2 * R.tank,
      tankBottomM: H.tank,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Kwintsheul) (1900, voor een tuinderij, vierkant ijzeren reservoir op een driedelig vakwerkstalen frame, nu voor de besproeiing van de kassen)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/518154 (Bij Hollewatering 26; driedelig vakwerkstalen frame met trekstangen, vierkant geklonken ijzeren reservoir, ijzeren ladder, vernieuwd motorhuisje met rabatdelen en flauw hellend lessenaarsdak binnen het frame)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Kwintsheul) (Watertoren holle watering.jpg 2009; RCE 20389997 en 20390019, 2004, vanaf het water)",
      "PDOK BAG-WFS en gebouwtegels (geen pand op de toren), AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});
