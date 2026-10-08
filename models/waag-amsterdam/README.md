# De Waag (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `waag-amsterdam.glb` | Catalogusbron in meters: node `building:waag` (hoofdblok, zuidblok en de zeven torens als gesloten solid) |
| `waag-amsterdam-1-1000.stl` | De Waag in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (23,3 × 26,5 × 26,3 mm) |
| `waag-amsterdam.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121842,13, 487324,42), het hart
van de achtkante middentoren (tevens het hoogste DSM-punt), op het maaiveld
van de Nieuwmarkt (NAP +2,2 m), en de glTF-conventie Y omhoog. +X loopt langs
de lange gevels naar het oost-noordoosten (RD-richting 25,5 graden); +Y wijst
naar het noord-noordwesten. Het maaiveld wordt alleen op de Nieuwmarkt 15 m
ten westen en oosten en 18 m ten zuiden van het hart bemonsterd
(`groundSamplePoints`, AHN NAP +2,15 tot +2,4 m), niet aan de iets lagere
noordkant (NAP +2,0 m). `groundOffsetMetres` is 0, want alles begint al 0,5 m
onder het maaiveld. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012171850`.

Onderdelen (hoogtes in NAP; het maaiveld ligt op circa NAP +2,2 m):

- Het hoofdblok tussen en ten noorden van de grote torens (14,1 m breed, de
  BAG-contour) met een plat dak op +15,0 m, en daarop de achtkante
  middentoren (10,6 m over de vlakken) met muren tot +16,8 m en een
  achtkante spits van 64 graden tot +28,0 m, het hoogste punt (25,8 m boven
  het maaiveld).
- De twee grote ronde torens aan de west- en oostkant (straal 3,5 m, op de
  BAG-bogen gefit) met een gootlijst die op +13,6 m 0,25 m uitkraagt tot de
  goot op +14,3 m en een achtkante spits tot +22,6 m.
- Het lagere zuidblok tussen de kleine torens (12,4 m breed, y = -7,5 tot
  -14,1) met de goot op +12,5 m en een schilddak met een korte nok op
  +18,5 m.
- De twee kleine ronde torens op de zuidhoeken (straal 1,7 m) met een
  gootlijst die op +11,5 m 0,15 m uitkraagt tot +12,0 m en een achtkante spits
  tot +19,0 m.
- De twee achtkante traptorentjes aan de noordkant (de BAG-contour) tot
  +13,0 m met een achtkante spits tot +17,2 m.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 88 % van
de 1572 DSM-cellen binnen 2 m (mediaan +0,06 m, mediane absolute afwijking
0,45 m): de middentoren 99 % (+0,14 m), het zuidblok 88 % (-0,06 m), de grote
torens 87 % (+0,26 m), de kleine torens 86 % (+0,13 m) en de traptorentjes
85 % (+0,06 m); de grootste afwijkingen zitten in randcellen langs de gevels
en de kegels. Het model dekt 1401 van de 1447 DSM-cellen boven NAP +12 m
binnen 14 m van het hart.

Printbaar op 1:1000 zonder steun: de muren en torens staan recht op, de
daken, kegels en spitsen lopen onder 50 graden of steiler omhoog (het
schilddak van het zuidblok onder 54 tot 55 graden) en de middentoren staat
op het platte dak; alleen de gootlijsten van de vier ronde torens kragen 0,15
tot 0,25 m vlak uit. Het script controleert dat er buiten die gootlijsten
geen vlak vlakker dan 45 graden naar beneden wijst, dat alles op dezelfde
onderkant begint en dat de hele BAG-contour bebouwd is. De export van een
uitsnede van 120 m op 1:1000 duurt circa 4,3 seconden; de Waag gaat er als
gesloten solid met overhangopvulling doorheen (5809 naar 6484 mm³, gemeten
met de eerdere ronde kegels; vrijwel alleen de voet tot de onderplaat) en het vervangen pand zit niet meer in de
export. Het model staat op het laagste bemonsteringspunt; het PDOK-terrein
rond de voet ligt 0,2 tot 0,4 m (noordkant) tot 0,9 m (zuidkant) hoger dan
de onderkant, zodat de voet overal in het terrein staat.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Waag_%28Amsterdam%29)
(Sint Antoniespoort, eerste steen 1488, in 1617-1618 verbouwd tot waag, het
koepelgewelf en de middentoren uit 1690-1691),
[Rijksmonumentenregister 3848](https://monumentenregister.cultureelerfgoed.nl/monumenten/3848),
PDOK BAG (het pand met de zes buitentorens), PDOK AHN (dsm en dtm 0,5 m via
WCS: het platte dak, de middentoren, de kegels, het schilddak en het
maaiveld), de PDOK luchtfoto en een foto op Wikimedia Commons (de zuid- en
westkant vanaf de Nieuwmarkt). Geschat zijn de hoogtes van de gootlijsten en
de toppen van de kegels en spitsen (het DSM mist de dunne punten; uit het
DSM-profiel en de foto), de muurhoogte van de middentoren, de nok van het
zuidblok en de hoogtes van de traptorentjes. Vereenvoudigd: het hoofdblok
heeft één plat dak rond de middentoren, de middentoren is een regelmatige
achthoek met de vlakken op de assen, de ronde torens zijn cilinders met een
regelmatig achtkante spits met graten (zoals op foto en luchtfoto; de hoeken
op de cirkel van de gootlijst, zodat de spits niet buiten de romp uitsteekt),
en de dakkapellen, de windvanen, de vensters, de deuren, de
luifel en het terras aan de zuidkant zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
