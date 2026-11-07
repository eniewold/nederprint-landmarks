// Watertoren aan de Sammersweg in Rijswijk (Zuid-Holland), naast de afslag naar de Strijplaan bij de Sammersbrug.
// Een tuinderswatertoren: een vierkante ijzeren bak op vier stalen poten, gebouwd voor de bevloeiing van gewassen in een
// tuindersbedrijf; bouwjaar, hoogte en inhoud onbekend (Wikipedia). Hij doet geen dienst meer en staat er als herinnering
// aan de kassenbouw langs de Sammersweg. Op de Commons-foto's (2009, 2015): vier hoekpoten die naar boven toe naar binnen
// lopen, twee horizontale ringen van hoekstaal, gekruiste trekstangen met spanschroeven in de twee bovenste vakken,
// schoren in het onderste vak, een stijgbuis in het midden en een geklonken bak zonder dak (de AHN-punten vallen in de
// bak op de bodem). De toren staat er nog: hij staat op elke luchtfoto van 2016 tot en met 2026.
//
// De toren is geen BAG-pand: in de BAG-WFS, de 3D BAG en de PDOK-gebouwtegels staat op deze plek niets (het enige pand in
// de buurt, 0603100000001329, ligt 15 m noordelijker aan de overkant van de Sammersweg). replacesBuildings blijft leeg.
//
// Alle maten uit de AHN5-puntenwolk (2023, GeoTiles 30DZ2_25; het DSM van 0,5 m laat de dunne toren bijna niet zien):
//   maaiveld NAP +1,45 (grondpunten bij de vier voeten 1,38 tot 1,48; west van de toren zakt de oever naar de sloot);
//   onderste ring NAP +3,49 (2,05 m), bovenste ring NAP +5,50 (4,05 m), bodem in de bak NAP +7,52, rand van de bak
//   NAP +9,0 à +9,17 (7,65 m); bak 2,1 à 2,15 m in het vierkant, ringen 2,65 à 2,7 m (onder) en 2,25 à 2,3 m (boven).
//   Hart (79897,73; 450806,92) en hoofdas 18 graden linksom van RD-oost uit de randen van de bak en de ringen (circa 3
//   graden onzeker). Spreiding van de voeten (3,0 m) uit de lijn door de ringen en de bak, en uit de foto van 2009
//   (voeten 1,4 maal de bak).
import { Manifold, CrossSection, ccw, hull, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [79897.73, 450806.92];
const AXIS_DEG = 18;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.45;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 44,79, noord 44,74, zuid 44,80,
// noordwest 44,84), gemeten 2026-11-07. Niet aan de westkant: daar ligt de slootoever (43,99 op 3 m).
const GROUND_ELLIPSOID = 44.74;

// ---------- maten (m boven het maaiveld) ----------
const H = {
  ring1: 2.05, // onderste ring (AHN NAP +3,49); alleen ter documentatie, de ringen vallen weg
  ring2: 4.05, // bovenste ring (AHN NAP +5,50); idem
  tank: 6.0, // onderkant van de bak (bodem binnenin NAP +7,52)
  rim: 7.65, // rand van de bak (AHN NAP +9,0 à +9,17)
};
const HALF = {
  foot: 1.5, // voeten 3,0 m in het vierkant (buitenkant)
  tank: 1.075, // bak 2,15 m (AHN 2,1 à 2,15)
};
const LEG = 0.9; // poot 0,9 m in het vierkant (in het echt hoekstaal; 0,9 m minimum op 1:1000)
const ARCH_DEG = 50; // spitse bovenkant van de vakopeningen
const TOP_BEAM = 0.4; // onder de bak: de doorgangen eindigen 0,4 m onder de bodem (drager van de bak)

// Buitenkant van het vakwerk: half-breedte lineair van het maaiveld naar de bak; onder het maaiveld loodrecht, zodat de
// voeten niet naar buiten uitlopen waar de export ze in het terrein laat zakken.
const hw = (z) => HALF.foot + ((HALF.tank - HALF.foot) * Math.max(z, 0)) / H.tank;
const inner = (z) => hw(z) - LEG;
const tanA = Math.tan((ARCH_DEG * Math.PI) / 180);

// ---------- vakwerk: afgeknotte piramide met vier hoekpoten ----------
const square = (h, z) => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];
const shell = hull([...square(HALF.foot, BASE), ...square(HALF.foot, 0), ...square(HALF.tank, H.tank)]);
// Holte binnen de poten, met een piramidevormig plafond onder de printhoek (50 graden).
const voidTop = H.tank - TOP_BEAM;
const voidApex = voidTop + inner(voidTop) * tanA;
const hollow = hull([...square(inner(0), BASE - 0.01), ...square(inner(0), 0), ...square(inner(voidTop), voidTop), [0, 0, voidApex]]);

// Vakopening in een zijvlak: zijkanten langs de binnenkant van de poten, spitse bovenkant onder 50 graden.
// Polygoon in (s, z) van het vlak, door beide tegenover elkaar liggende zijvlakken heen getrokken.
const opening = (z0, zApex) => {
  // Aanzet van de spitse top zs: zApex - zs = inner(zs) * tan(50°), met inner lineair in z.
  const k = (HALF.tank - HALF.foot) / H.tank;
  const zs = (zApex - (HALF.foot - LEG) * tanA) / (1 + k * tanA);
  const w0 = inner(z0) + 0.005, ws = inner(zs) + 0.005;
  // Het onderste vak begint onder het maaiveld: daar loodrecht tot z = 0.
  const foot = z0 < 0 ? [[-w0, z0], [w0, z0], [w0, 0]] : [[-w0, z0], [w0, z0]];
  const poly = [...foot, [ws, zs], [0, zApex], [-ws, zs], ...(z0 < 0 ? [[-w0, 0]] : [])];
  const depth = 2 * HALF.foot + 2;
  return Manifold.extrude(new CrossSection([ccw(poly)]), depth).translate([0, 0, -depth / 2]).rotate([90, 0, 0]);
};
// Eén doorgang per zijvlak van de voet tot onder de bak: de ringen en trekstangen zijn in het echt hoekstaal en
// rondstaal van 0,1 à 0,15 m en vallen weg (als ringen van 0,9 m maakten ze van het open vakwerk een gesloten toren).
const panels = [[BASE - 0.01, H.tank - TOP_BEAM]];
const cutsY = union(panels.map(([z0, z1]) => opening(z0, z1)));
const cuts = union([cutsY, cutsY.rotate([0, 0, 90]), hollow]);
const frame = shell.subtract(cuts);

// ---------- bak ----------
const tank = Manifold.cube([2 * HALF.tank, 2 * HALF.tank, H.rim - H.tank]).translate([-HALF.tank, -HALF.tank, H.tank]);

const all = union([frame, tank]);

await writeLandmark({
  slug: "watertoren-rijswijk-sammersweg",
  base: BASE,
  nodes: [["building:watertoren-poten-en-bak", all]],
  catalog: {
    name: "Watertoren Sammersweg Rijswijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[3, 0], [0, 3], [0, -3], [-2.2, 2.2]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: [],
    description:
      "Oorsprong op het hart van de tuinderswatertoren op het maaiveld (NAP +1,45 m), X-as 18 graden linksom van RD-oost langs een zijde van de bak. Vier hoekpoten van 0,9 m die van 3,0 m in het vierkant op de grond naar 2,15 m onder de bak lopen, per zijde één doorgang van de grond tot 5,6 m met een spitse bovenkant (50 graden), vierkante ijzeren bak van 2,15 m van 6,0 tot 7,65 m. Ringen en trekstangen (dunner dan 0,9 m) weggelaten. Geen BAG-pand. Maten uit de AHN5-puntenwolk, voetspreiding uit foto en AHN.",
    realWorld: {
      built: null,
      use: "bevloeiing tuindersbedrijf, nu herinnering aan de kassenbouw",
      ahnGroundNapM: GROUND_NAP,
      ahnRing1NapM: 3.49,
      ahnRing2NapM: 5.5,
      ahnTankFloorNapM: 7.52,
      ahnRimNapM: 9.1,
      footSquareM: 2 * HALF.foot,
      tankSquareM: 2 * HALF.tank,
      ringsOmittedM: [H.ring1, H.ring2],
      tankBottomM: H.tank,
      topM: H.rim,
      legM: LEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Rijswijk_Sammersweg) (vierkante ijzeren bak op vier poten, tuindersbedrijf; bouwjaar, hoogte en inhoud onbekend)",
      "https://commons.wikimedia.org/wiki/File:Rijswijk_-_Watertoren_Sammersweg.jpg (Quistnix, 2009, CC BY-SA 2.5)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Sammersbrug.JPG (2015, CC BY-SA 4.0)",
      "AHN5-puntenwolk 2023 (GeoTiles 30DZ2_25), PDOK BAG-WFS, 3D BAG (geen pand op de toren) en luchtfoto's 2016-2026 (Actueel_orthoHR en jaargangen), 2026-11-07",
    ],
  },
});
