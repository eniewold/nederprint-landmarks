# Martinitoren (Groningen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `martinitoren.glb` | Catalogusbron in meters: nodes `building:toren` (natuursteen), `building:lantaarn` (koperen bovenbouw) |
| `martinitoren-1-1000.stl` | Toren en lantaarn in één stuk op 1:1000 (17 × 17 × 97 mm) |
| `martinitoren.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De STL is in millimeters met Z omhoog en de oorsprong in het hart van de
onderbouw (de BAG-voetafdruk) op het maaiveld van de Grote Markt (circa
NAP +6,8 m); de GLB gebruikt dezelfde oorsprong in meters met de
glTF-conventie Y omhoog. +X loopt langs de gevels naar de Martinikerk
(RD-richting (0,944, 0,330), azimut 70,75 graden), +Y naar het noordnoordwesten;
de Grote Markt ligt aan -X. Het maaiveld wordt op 13 m uit het hart bemonsterd
aan de drie vrije zijden (`groundSamplePoints`), niet aan de kerkzijde.

Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0014100010924795`
(`replacesBuildings`). De PDOK-reconstructie daarvan is een LoD2.2-blok op de
voetafdruk met een puntig dak tot circa NAP +94 m, zonder geledingen, omgangen
of lantaarn. Het kleine pand `0014100010931999` tussen toren en kerk blijft
staan: het PDOK-dak (17 m) klopt met het AHN.

Onderdelen in het model (hoogtes boven het maaiveld):

- Onderbouw (eerste en tweede geleding) tot 38,7 m op de BAG-voetafdruk van
  16,5 × 17 m, naar boven versmallend tot 13,9 × 13,5 m, met de nissen van de
  drie doorgangen (2,8 m breed, circa 2 m diep, sinds 1938 grotendeels dicht)
  aan west-, noord- en zuidzijde en drie hoge spitsboognissen per gevel vanaf
  13 m.
- Eerste omgang op een uitkragende kraag tot 41,3 m, met pinakels op de hoeken
  en twee per gevel.
- Derde geleding van 13,2 × 13,7 m met drie nissen per gevel en de tweede omgang
  tot 57,4 m, ook met pinakels.
- Vierde geleding (de uurwerkgeleding) van 10,8 × 11,3 m met twee hoge
  galmgaten per gevel en een kroonlijst tot 70 m.
- Koperen achthoekige lantaarn: onderste laag (7,5 m over de vlakken) met
  omgang tot 78,6 m, bovenste laag (5,2 m) met kroonlijst tot 84,5 m; een
  spitsboognis per vlak (in het echt open, hier voor de printbaarheid een nis).
- Trommel, opengewerkte kroon (als dichte bol van 3,8 m), bol, makelaar en
  windvaan tot 96,8 m.

Volgens het AHN staat het hart van de bovenbouw niet boven dat van de
onderbouw: de derde geleding ligt 0,6 m, de vierde 0,9 m en de lantaarn 1,1 m
naar de Grote Markt (en 0,4 m naar het noorden). Een frontale foto uit de verte
laat dezelfde verschuiving zien; het model neemt haar over.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Martinitoren),
[Rijksmonumentenregister 18553](https://monumentenregister.cultureelerfgoed.nl/monumenten/18553),
PDOK BAG (voetafdruk met de doorgangsnissen), PDOK AHN (dsm en dtm 0,5 m via
WCS: omhullende en hart per geleding, hoogtes van de omgangen, de lantaarn en
de kroon, in een stelsel langs de gevels) en de PDOK luchtfoto, plus Wikimedia
Commons-foto's (`Groningen, Martinitoren RM-18553-WLM.jpg`,
`Martinitoren from Grote Markt.jpg`,
`Martinitoren in Groningen, bezien vanuit NOK, op de bovenste verdieping van Forum.jpg`)
voor de opstand. Totale hoogte en de indeling in geledingen zijn
gedocumenteerd; de maten en hoogtes van geledingen, omgangen en lantaarnlagen
komen uit BAG en AHN (een frontale foto bevestigt de verhoudingen); de nissen,
pinakels, kraag, kroonvorm, bol en windvaan zijn uit foto's geschat.

Licentie van het model: eigen werk op basis van open bronnen.
