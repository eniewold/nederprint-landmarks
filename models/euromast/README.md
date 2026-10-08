# Euromast (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `euromast.glb` | Catalogusbron in meters: nodes `building:paviljoen`, `building:toren` |
| `euromast-1-1000.stl` | Paviljoen en toren in één stuk op 1:1000 (26 × 28 × 185 mm) |
| `euromast.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De STL is in millimeters met Z omhoog en de oorsprong in het hart van de
schacht op de vloer van het entreepaviljoen (maaiveld, circa NAP +3,0 m); de
GLB gebruikt dezelfde oorsprong in meters met de glTF-conventie Y omhoog. Het
model is noord-georiënteerd (+X oost, +Y noord). Het maaiveld wordt op 13 m uit
het hart bemonsterd (`groundSamplePoints`), omdat de standaardpunten rond de
voetafdruk van 32 m het talud naar de parkvijver ten oosten kunnen raken.

Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0599100000661084`
(`replacesBuildings`). De PDOK-reconstructie daarvan is een cilinder met de
voetafdruk van het paviljoen (straal 11,8 m), opgetrokken tot circa 109 m, met
een spriet tot 165 m: een uitkragend Kraaiennest kan die reconstructie niet
maken, omdat ze alleen verticale wanden op de voetafdruk kent.

Onderdelen in het model:

- Rond entreepaviljoen van 4,2 m: bakstenen plint op de BGT-voetafdruk
  (straal 10,5 m) met daarboven de glazen ring tot de BAG-voetafdruk (11,8 m).
- Betonnen schacht van 9 m doorsnede tot 107 m, met de scheepsbrug op 32 m
  (7 m breed, 3,7 m uitstekend) aan de zuidkant.
- Asymmetrisch Kraaiennest, dak op 93 m, 28,5 m in de langste richting
  (15-16 m uit het hart naar het zuiden en zuidwesten, 11-12 m naar het noorden
  en oosten), met een naar buiten hellende glaswand vanaf 84,3 m en een
  schuine onderkant die op 81,8 m op de schacht aansluit.
- Glazen bovenverdieping tot 96,5 m, trappenhuis aan de zuidzuidwestkant en
  het uitkijkplatform (straal 6,2 m) tot 107,3 m.
- Space Tower van 2,5 m doorsnede met topbehuizing (162-167 m), schotelring,
  antenneframe tot 172,3 m en antennespits tot 185 m.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Euromast),
[architectuur.org](https://www.architectuur.org/bouwwerk/321/Euromast.html),
[Wederopbouw Rotterdam](https://wederopbouwrotterdam.nl/en/articles/euromast),
PDOK BAG en BGT (pand en voetafdruk van het paviljoen), PDOK AHN (dsm en dtm
0,5 m via WCS: maaiveld, dak en plattegrond van het Kraaiennest,
bovenverdieping, platform en top van het antenneframe) en Wikimedia
Commons-foto's (`Euromast @ Rotterdam (30546199846).jpg`,
`Euromast @ Parkhaven @ Rotterdam (30604597745).jpg`,
`Euromast @ Rotterdam (29972520534).jpg`, `Euromast @ Rotterdam (29970699683).jpg`)
voor de opstand. Schacht, scheepsbrug, doorsnede van het Kraaiennest, Space
Tower en totale hoogte zijn gedocumenteerd; plattegrond en hoogtes van
Kraaiennest, bovenverdieping, platform en antenneframe komen uit het AHN; de
hoogte van het paviljoen, de glaswand en onderkant van het Kraaiennest, maat
en richting van de scheepsbrug, het trappenhuis en de topbehuizing zijn uit
foto's geschat.

Licentie van het model: eigen werk op basis van open bronnen.
