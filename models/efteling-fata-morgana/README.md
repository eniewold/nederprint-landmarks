# Fata Morgana (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-fata-morgana.glb` | Catalogusbron in meters: nodes `building:paleis` (het complex met de daken, borstweringen, torens en koepels), `building:minaret`, `building:kade` (de balustrade langs het water) en `building:oase` (het paviljoen op het terras) |
| `efteling-fata-morgana-1-1000.stl` | Het model op 1:1000 met de onderkant (1 m onder het maaiveld) op het printbed (184 × 84 × 27 mm) |
| `efteling-fata-morgana.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-fata-morgana.mjs`](../../scripts/generate-efteling-fata-morgana.mjs)
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131365,0, 406522,0), midden op het
BAG-pand, op het maaiveld (NAP +8,65 m), en de glTF-conventie Y omhoog. +X
loopt langs de lange zuidgevel naar het oost-zuidoosten (RD-richting
(0,99357, -0,11318), 6,5 graden met de klok mee vanaf de RD-X-as), +Y naar de
Vonderplas. Het maaiveld wordt op vijf punten bemonsterd
(`groundSamplePoints`: het plein, langs de zuid- en westgevel en bij de
oostvleugel, AHN-DTM NAP +8,57 tot +8,73 m), niet op de kade of het water.
`groundOffsetMetres` is 0. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0809100000017609` (het complex, bouwjaar 1984) en
`NL.IMBAG.Pand.0809100000017608` (het oosterse paviljoen op het terras,
1986).

Onderdelen (hoogtes in NAP; maaiveld +8,65 m):

- Daken per zone op de BAG-contour (mediaan van het AHN-DSM per zone): de
  westhal +16,9 m, het zuidwestblok +18,8 m, het middendeel +14,1 m, de
  oostelijke hallen en de oostvleugel +13,3 m, de zuidstrook +11,6 m, de
  bazaar +11,4 en +12,3 m en het noordeinde van de oostvleugel +11,8 m. Elke
  zone heeft een borstwering van 0,9 m dik en 0,7 m hoog met kantelen van
  0,9 m om de 2 m (grover dan echt). De tonhal in het oosten: goot +17,2 m,
  kruin +19,05 m.
- De gevel aan het water, van west naar oost: de hoektoren met de witte
  koepel (+20,6 m), het erkertorentje op een kraag van 45 graden met de
  blauwe uikoepel, de witte koepel achter de muur, de grote poorttoren
  (onderbouw 6,2 × 6,7 m tot +20,8 m met de spitse poortnis, bovenbouw
  4,6 m tot +24,2 m met twee vensters per zijde, blauwe uikoepel tot +27,4 m,
  top +29 m), het gekanteelde blok met de arcade met het groene schilddak
  (vier spitse bogen), de grijze koepel op de zeshoekige trommel (+21,6 m) en
  de gouden koepel op een vierkant torenblok (+21,9 m) met het poortpaviljoen
  met vier hoge spitse bogen ervoor.
- Verder de witte koepeltoren op de westhal (+22,6 m), een torentje met
  koepeltje, de koepel op de achtkante trommel achter de bazaar (+17,2 m), de
  bazaarkoepel (+14,9 m), koepeltorentjes op de zuidhoeken en spitse nissen
  (0,35 tot 0,45 m diep) aan het water, aan het plein (bazaar en ingang) en
  in de west- en zuidgevel.
- De minaret op het plein: vierkante onderbouw van 4,2 m tot +18,35 m met
  een galerij op een kraag van 45 graden, achtkante schacht van 3 m, de
  bovengalerij tot +29,85 m, de lantaarn en de geribde koepel tot +34,3 m
  (top +35 m).
- De kade: de witte balustrade langs de BGT-oever voor het paleis (0,9 m dik,
  1,05 m boven de kade, pijlers met een knop om de ~6 m), tot onder het
  wateroppervlak.
- De oase: het paviljoen van 6,5 m in het vierkant op het terras met een
  tentdak tot +14,3 m.

Het water van de Vonderplas zit in het PDOK-terrein en niet in het model;
alle onderdelen beginnen op NAP +7,65 m, onder het water. De boten varen
helemaal binnen (instap op een draaischijf); de "poorten" aan het water zijn
de arcadepaviljoens tegen de gevel, er is geen echte waterpoort.

Printbaar op 1:1000 en 1:500: de export vult niets wezenlijks op (paleis
0,00 %, minaret 0,14 en 0,12 %, kade 0,00 %, oase 0,00 en 0,01 %). De STL is
49,5 cm³ op 1:1000.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Fata_Morgana_%28Efteling%29),
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Fata_Morgana_(Efteling)),
PDOK BAG (de twee panden), PDOK BGT (waterdeel, de oever), PDOK AHN (dsm en
dtm 0,5 m via WCS: dakhoogtes per zone, tonhal, plaats en hoogte van elke
toren en koepel, minaret) en de PDOK luchtfoto (zeshoekige trommel,
kantelen). Geschat uit foto's: de vorm van de koepels en uien, de bovenbouw
van de poorttoren en de geledingen van de minaret (verhoudingen uit frontale
foto's met de AHN-top als maat), aantal en maat van de nissen en arcades, de
kantelmaat en de balustrade. Weggelaten: de lichtkoepels op de daken, de
lantaarns, de cipressen, de fontein en de bloembakken op het plein.
