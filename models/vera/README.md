# Vera (Groningen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `vera.glb` | Catalogusbron in meters: één node `building:vera` met het voorhuis (lijstgevel, ingangstravee met kuif en stoep, schilddak) en de zalen erachter |
| `vera-1-1000.stl` | Vera in één stuk op 1:1000, met de onderkant (2,8 m onder de straat) op het printbed (63 × 11 × 18 mm) |
| `vera.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Poppodium Vera in het rijksmonument aan de Oosterstraat 44. De GLB is in
meters met de oorsprong midden voor de gevel op RD (234010.5, 581807.4) op
het maaiveld van de Oosterstraat (NAP +8,2 m) en de glTF-conventie Y omhoog.
+X loopt het perceel in (RD-richting 24,6 graden linksom vanaf het oosten), +Y
naar het noordnoordwesten. Achter het pand ligt het maaiveld tot 2,3 m lager
(NAP +5,9 m); de onderkant ligt daarom 2,8 m onder de straat. Het maaiveld
wordt op twee punten op de Oosterstraat voor de gevel bemonsterd
(`groundSamplePoints`); `groundHeight` (48,81 m, ellipsoïdisch) is de laagste
PDOK-terreinhoogte op die punten. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0014100010953685`; de PDOK-hoogtes van de buurpanden kloppen
binnen ruim 1 m met het AHN.

Onderdelen in het model (hoogtes boven de straat, uit het AHN tenzij anders
vermeld):

- Voorhuis van 10,4 m breed en 13 m diep, goten op 9,3 m en een schilddak met
  de nok dwars op de straat op 14,8 m (NAP +23,0 m), van 3 tot 10 m achter de
  gevel.
- Lijstgevel tot 12,5 m met een kroonlijst die 0,5 m uitsteekt op een kraag van
  45 graden (foto).
- Ingangstravee van 2,6 m breed aan de zuidkant, 0,25 m vóór de gevel, met een
  kuif tot 13,4 m, de deur 0,5 m terug en een stoep van twee treden (foto).
- Drie raamassen met ramen in het souterrain, op de bel-etage, de verdieping
  en de zolderverdieping als nissen van 0,3 m achter de kroonlijst (foto,
  verdiepingshoogtes geschat).
- Zalen achter het voorhuis met platte daken op 8,0 m (NAP +16,2 m, met een
  installatieblok tot 9,4 m) en 6,8 m (NAP +15,0 m) tot de achtergrens op 63 m.

Weggelaten: de consoles onder de kroonlijst, de luifels boven de ramen, het
snijwerk in de kuif, de ijzeren hekken en de Ichthus-visgraat (kleiner dan
0,9 m). De zij- en achtergevels van de zalen grenzen aan buren of liggen aan
binnenterreinen en zijn vlak gelaten.

Printbaarheid: alles staat op dezelfde onderkant; de kroonlijst en de
nissen hebben een onderkant of plafond van 45 graden. Met de optie ‘Printbare
overhang’ vult de export op 1:1000 2,6 % op en op 1:1500 3,9 % (minder dan 0,1
seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Vera_(Groningen)), PDOK BAG
(contour), PDOK AHN (dsm en dtm 0,5 m via WCS: nok, goten, gevel, platte daken,
installatieblok en maaiveld), de PDOK luchtfoto en foto's van Wikimedia
Commons (`Groningen - Vera.jpg`, `Vera-Groningen.JPG`,
`Voorgevel - Groningen - 20094105 - RCE.jpg`).

Licentie van het model: eigen werk op basis van open bronnen.
