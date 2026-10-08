# Sint-Janskathedraal ('s-Hertogenbosch)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `sint-janskathedraal.glb` | Catalogusbron in meters: één node `building:kathedraal` met zijbeuken, schip, transept, koor, beide torens en pinakels |
| `sint-janskathedraal-1-1000.stl` | De kathedraal in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (116 × 63 × 70 mm) |
| `sint-janskathedraal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de BAG-contour op het
maaiveld (NAP +6,2 m) en de glTF-conventie Y omhoog. +X loopt langs de as van de
kerk naar het koor (RD-richting (0,993, 0,118), 6,8 graden boven het oosten),
+Y naar het noorden. Het maaiveld wordt op drie punten op de Parade en de straat
ten westen bemonsterd (`groundSamplePoints`). Het catalogusitem vervangt
BAG-pand `NL.IMBAG.Pand.0796100000237576`.

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN):

- Zijbeuken, kapellen en kooromgang als de hele BAG-contour tot 16 m (AHN: 15
  tot 17 m), met de steunberen in de contour.
- Middenschip van de westtoren tot de viering en koor tot u = 33 m: muren 17 m
  breed, goot 26 m, nok 37 m (koor 37,5 m); de koorsluiting als halve achthoek
  met een piramidedak tot de nok.
- Transept van 13 m breed over 53 m, goot 26 m, nok 37,5 m, met topgevels.
- Vieringtoren: achthoekige trommel tot 50 m, een vlak tentdak en een slanke
  lantaarn met spits tot 59,6 m.
- Westtoren: onderbouw 15,8 × 16,2 m tot 47 m, bovengeleding 10 × 9,7 m tot
  62 m, achthoekige lantaarn tot 66 m met koepel en spits tot 69,5 m.
- Twintig pinakels van de luchtbogen langs de zijbeuken: 1,2 m in het vierkant
  tot 22 m, op 1:1000 staafjes van 1,2 mm.

Alles staat op elkaar zonder vrije overhang, zodat de export verticaal opvult;
de export van een uitsnede van 300 mm met de kathedraal duurt circa 3 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Sint-Janskathedraal_(%27s-Hertogenbosch)),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: goot- en nokhoogtes,
zijbeuken, pinakels, de omhullende per hoogte van beide torens en het maaiveld)
en de PDOK luchtfoto. De luchtbogen zelf, de traceringen, de vensters, de
dakruiters en het beeldhouwwerk zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
