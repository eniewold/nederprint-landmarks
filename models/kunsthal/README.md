# Kunsthal (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kunsthal.glb` | Catalogusbron in meters: node `building:kunsthal` (het vierkante gebouw met de dakgarden, het torenblok en de luifel) |
| `kunsthal-1-1000.stl` | Het gebouw op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (60 × 60 × 25 mm) |
| `kunsthal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (92123,08, 436195,19), het hart van
het BAG-pand, op het maaiveld aan de parkzijde (NAP −0,5 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels naar het noordoosten (26,75
graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht daarop naar het
noordwesten, het park in. Het maaiveld wordt op drie punten aan de parkzijde
bemonsterd (`groundSamplePoints`, NAP −0,5 m); aan de zuidkant ligt de
Westzeedijk op NAP +4,3 m, dus daar zit de voet in het talud. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0599100000690180`.

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM):

- Het vierkant van 60 bij 60 m op de BAG-contour met een schuine zuidgevel;
  het westelijke deel en de noordstrook hebben een vlak dak op +12,6 m.
- De hal met lichtstraten in het oosten: het dak loopt van +14,6 m bij de
  garden naar +12,6 m aan de oostgevel (helling 5,6 %).
- De driehoekige dakgarden tussen het westelijke deel en de hal (35 m lang,
  naar het zuiden smaller): de vloer loopt van +6,6 m in het noordwesten naar
  +11,6 m in het zuidoosten op (vlak door het DSM gefit, afwijking 0,3 m).
- Het torenblok aan de westrand van de garden (4,5 bij 14,8 m) op +24,5 m.
- De luifel langs de dijk (43 bij 10 m, buiten de BAG-contour) op +10,9 m, als
  massief blok tot het maaiveld.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
81,6 % ligt binnen 1 m en 90,6 % binnen 2 m. De afwijkingen zitten in de
dakranden, de lichtstraten van de hal en de verdiepte put aan het zuideinde
van de garden.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, dus de
export vult op 1:1000 en 1:1500 niets op (0,00 % volume); op 1:2500 komt er
0,9 % bij. De STL is 48 cm³ en het model één samenhangend deel.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kunsthal), PDOK BAG (het
pand), PDOK AHN (dsm en dtm 0,5 m via WCS) en de PDOK luchtfoto. Geschat zijn
de begrenzing van de garden en de hal (op 1 m afgelezen uit het DSM) en de
massieve luifel (in het echt rust die op kolommen). Weggelaten: de
lichtstraten en installaties op het dak, de gevelbekleding, de put aan het
zuideinde van de garden en de hellingen en trappen in het gebouw.
