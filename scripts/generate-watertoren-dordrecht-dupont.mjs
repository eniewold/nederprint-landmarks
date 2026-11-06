// Watertoren van DuPont de Nemours in Dordrecht, op het fabrieksterrein aan de Baanhoekweg (nu Chemours). Gebouwd in
// 1961 naar ontwerp van Vries Robbé & Co N.V. (Gorinchem); 46,5 m hoog, reservoir van 570 m³ (Wikipedia). Een stalen
// vakwerktoren van het Amerikaanse type: acht verticale buispoten in een regelmatige achthoek met per vak gekruiste
// windverbanden en horizontale ringen, een middenbuis (stijgleiding) tot in de bodem van het reservoir, een ronde stalen
// ketel met een bolle bodem, een rondlopende omloop met leuning op de voet van de ketel en een vlak kegeldak met een
// leuning en een ontluchting in het midden (Commons-foto 2010, luchtfoto).
//
// De toren staat niet als BAG-pand geregistreerd: in de BAG-WFS en in de PDOK-gebouwtegels staat op deze plek niets
// (het dichtstbijzijnde pand, 0505100000012784, is een hokje van 2,6 bij 1,8 m op 12 m ten noorden). replacesBuildings
// blijft dus leeg.
//
// Oorsprong op het hart van de achthoek van de poten: de cirkel door de drie poten die op de luchtfoto (Actueel_orthoHR,
// 8 cm) op het maaiveld te zien zijn, (109222,2; 425677,9), (109226,1; 425676,9) en (109229,4; 425679,1), straal 4,9 m.
// De poten staan op 6,4, 9,9 en 12,6 graden plus k maal 45 graden; lokale X-as 9,6 graden linksom van RD-oost, door een
// poot. Op de luchtfoto lopen de linker- en rechterrand van het vakwerk evenwijdig omhoog: de poten staan loodrecht.
// Maaiveld AHN-DTM NAP +3,8.
// Hoogtes uit het AHN-DSM 0,5 m (het vakwerk geeft verspreide punten, de ketel weinig): dak NAP +50,75 in het midden en
// +50,4 à +50,6 op 3,5 à 4,5 m van het hart (dus 46,6 tot 46,95 m boven het maaiveld), omloop met leuning tot NAP +41,9
// op 5,25 tot 6 m, niets boven NAP +40 buiten 6,75 m. Doorsnede van de ketel (9,9 m) en de omloop (12,6 m) van de
// luchtfoto; de verhouding ketel/omloop (0,79) klopt met de foto. Hoogte van de ketelmantel, de bodem en de vakverdeling
// geschat uit de foto (sterk perspectief van onderaf).
import { Manifold, CrossSection, ccw, hull, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [109225.26, 425681.73];
const AXIS_DEG = 9.6;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.8;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 47,45, west 47,46, noord 47,38, zuid 47,48),
// gemeten 2026-11-06; het PDOK-terrein rond de toren ligt vlak.
const GROUND_ELLIPSOID = 47.38;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts, seg = SEG) => Manifold.revolve(new CrossSection([ccw(pts)]), seg);

// ---------- maten (m boven het maaiveld) ----------
const H = {
  panel: 5.15, // zeven vakken van 5,15 m tot de bodem (foto: zes gelijke vakken onder de bodem en één tussen de bodem en de omloop)
  bowl: 31.7, // onderkant van de bodem, waar de middenbuis erin gaat (foto: net boven de bovenste ring op 30,9 m)
  fascia: 37.4, // onderkant van de omloop: de bodem loopt onder 45 graden van de middenbuis naar de rand
  deck: 38.1, // vloer van de omloop (AHN: hoogste punt op 5,25 tot 6 m van het hart)
  eaves: 46.5, // bovenkant van de ketelmantel (AHN 46,6 à 46,8 op 3,5 à 4,5 m)
  apex: 46.95, // midden van het dak (AHN NAP +50,75)
  vent: 47.4, // ontluchting (AHN max NAP +51,36 met leuning)
};
const R = {
  legs: 4.9, // hart van de poten (luchtfoto)
  leg: 0.5, // poot 1,0 m dik (in het echt dunner; 0,9 m minimum op 1:1000)
  brace: 0.45, // windverband 0,9 m dik
  pipe: 0.6, // middenbuis 1,2 m
  tank: 4.95, // ketelmantel, 9,9 m (luchtfoto)
  deck: 6.3, // omloop, 12,6 m (luchtfoto)
  vent: 0.6,
};
const PANELS = 7;

// ---------- ketel, omloop, bodem, dak en middenbuis: één omwentelingsprofiel ----------
// Middenbuis van de onderkant tot in de bodem; bodem onder 45 graden tot de rand van de omloop; rand 0,7 m; omloopvloer;
// ketelmantel; vlak kegeldak (6 graden) met ontluchting.
const tank = rev([
  [0, BASE], [R.pipe, BASE], [R.pipe, H.bowl], [R.deck, H.bowl + (R.deck - R.pipe)], [R.deck, H.deck], [R.tank, H.deck],
  [R.tank, H.eaves], [R.vent, H.apex - (H.apex - H.eaves) * (R.vent / R.tank)], [R.vent, H.vent], [0, H.vent],
]);
if (Math.abs(H.bowl + (R.deck - R.pipe) - H.fascia) > 1e-9) throw new Error("bodem niet onder 45 graden");

// ---------- vakwerk: acht poten en gekruiste windverbanden ----------
const legAt = (k) => polar(R.legs, 45 * k);
// Poten tot in de bodem (de bovenkant zit binnen de ketel).
const legs = union(Array.from({ length: 8 }, (_, k) => Manifold.cylinder(H.fascia - 0.4 - BASE, R.leg, R.leg, 16).translate([...legAt(k), BASE])));
// Windverband: capsule tussen twee pootharten; de bollen aan de einden (0,45 m) vallen binnen de poot (0,5 m), dus de
// onderkant van een windverband loopt overal onder 90 - atan(5,15 / 3,75) = 36 graden met de verticaal.
const ball = Manifold.sphere(R.brace, 16);
const brace = (a, za, b, zb) => hull([ball.translate([...a, za]), ball.translate([...b, zb])]);
const braces = [];
for (let k = 0; k < 8; k++) {
  const a = legAt(k), b = legAt(k + 1);
  for (let p = 0; p < PANELS; p++) {
    const z0 = p * H.panel, z1 = (p + 1) * H.panel;
    braces.push(brace(a, z0, b, z1), brace(b, z0, a, z1));
  }
}
const frame = union([legs, ...braces]).trimByPlane([0, 0, 1], BASE);

const all = union([tank, frame]);

await writeLandmark({
  slug: "watertoren-dordrecht-dupont",
  base: BASE,
  nodes: [["building:watertoren-vakwerk-middenbuis-ketel-omloop-en-dak", all]],
  catalog: {
    name: "Watertoren DuPont Dordrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: [],
    description:
      "Oorsprong op het hart van de achthoek van de acht stalen poten (straal 4,9 m, luchtfoto) op het maaiveld (NAP +3,8 m), X-as 9,6 graden linksom van RD-oost door een poot. Vakwerk van acht loodrechte poten met gekruiste windverbanden in zeven vakken van 5,15 m en een middenbuis; ketel met bodem onder 45 graden van 31,7 tot 37,4 m, omloop van 12,6 m doorsnede op 38,1 m, ketelmantel van 9,9 m tot 46,5 m, vlak kegeldak tot 46,95 m met ontluchting tot 47,4 m. Geen BAG-pand. Maten uit AHN en luchtfoto, vakverdeling en bodem geschat uit de foto.",
    realWorld: {
      built: 1961,
      architect: "Vries Robbé & Co N.V.",
      publishedHeightM: 46.5,
      reservoirM3: 570,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 50.75,
      legs: 8,
      legCircleRadiusM: R.legs,
      panels: PANELS,
      panelHeightM: H.panel,
      bowlBottomM: H.bowl,
      deckM: H.deck,
      deckDiameterM: R.deck * 2,
      tankDiameterM: R.tank * 2,
      eavesM: H.eaves,
      roofApexM: H.apex,
      topM: H.vent,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Dordrecht_DuPont) (1961, Vries Robbé & Co N.V., 46,5 m, 570 m³)",
      "https://commons.wikimedia.org/wiki/File:Dordrecht_Watertoren_Dupont_2010.JPG (vanaf de weg, 2010)",
      "PDOK BAG-WFS (geen pand op de toren), AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});
