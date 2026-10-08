# Koppelpoort (Amersfoort)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `koppelpoort.glb` | Catalogusbron in meters: node `building:poort` (land- en waterpoort met de torentjes als gesloten solid) |
| `koppelpoort-1-1000.stl` | De poort in één stuk op 1:1000, met de onderkant (NAP -1,5 m, onder het water) op het printbed (41 × 9 × 19,5 mm) |
| `koppelpoort.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (154869,26, 463423,65), het
zwaartepunt van het BAG-pand, op het maaiveld van de kade en de straat
(NAP +2,5 m), en de glTF-conventie Y omhoog. +X loopt langs de poort naar het
noordoosten (RD-richting 47,5 graden, evenwijdig aan de lange gevels); +Y
wijst naar het noordwesten, de veldzijde met de kom van de Eem. Het maaiveld
wordt alleen op de straat aan beide kanten van de landpoort en op de kade aan
de stadszijde van de zuidwestvleugel bemonsterd (`groundSamplePoints`, AHN
NAP +2,4 tot +2,6 m), niet in het water en niet op het hogere plein voor de
waterpoort (NAP +3,5 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0307100000334171` (de poort) en
`NL.IMBAG.Pand.0307100000522091` (de noordoostkant van de landpoort).

Onderdelen (hoogtes in NAP; het water van de Eem staat op circa NAP 0 m),
van noordoost naar zuidwest:

- De landpoort (x = 10 tot 22): poortlichaam tot +8,5 m met kantelen tot
  +9,6 m aan beide gevels, en aan de veldzijde twee achtkante torentjes
  (straal 1,75 m) met een bovenbouw die op +7,0 m 0,3 m uitkraagt, goot op
  +11,4 m en een naald tot +15,5 m. De landdoorgang tussen de twee BAG-panden
  is 3,4 m breed met een spitse top op +7,3 m.
- De weermuur (x = 2 tot 10,4) met de weergang op +7,9 m, kantelen aan beide
  gevels en het aanbouwtje aan de veldzijde tot +5,9 m.
- Het poortgebouw van de waterpoort (x = -8,6 tot 2) met schilddak, goot
  +10,8 m en nok +14,6 m, de mezekouw boven de boog aan de veldzijde (tot
  +9,8 m, 0,75 m uit de gevel op een schuine onderkant) en de waterboog van
  6,6 m breed over de BGT-waterloop van 7,3 m, met de spitse top op +4,0 m.
- De zuidwestvleugel (x = -19,5 tot -8,6) met schilddak, goot +9,6 m en nok
  +13,5 m, en het zuidwesttorentje aan de overkant van het Spui (straal
  1,85 m, uitkraging op +9,8 m, goot +12,0 m, naald tot +18,0 m, het hoogste
  punt, 15,5 m boven het maaiveld).

Alle onderdelen beginnen op NAP -1,5 m, onder het water, dat in het
PDOK-terrein zit; beide doorgangen zijn tot de onderkant open, zodat het
water en de straat uit het PDOK-terrein erdoor lopen.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 88 % van
de 941 DSM-cellen binnen 2 m (mediaan +0,25 m, mediane absolute afwijking
0,43 m): de waterpoort 96 % (+0,35 m), de weermuur 90 % (+0,07 m), de
landpoort 85 % (+0,21 m) en de zuidwestvleugel met het torentje 83 %
(+0,52 m); de grootste afwijkingen zitten in randcellen naast de
torentjes. Het model dekt 901 van de 995 DSM-cellen boven NAP +6 m langs de
poort.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en de
naalden lopen onder 50 graden of steiler omhoog, beide doorgangen zijn een
boog met een spitse top (de ronde boog gaat op 40 graden over in rechte
stukken onder 50 graden) en de mezekouw rust op een onderkant van 55 graden;
alleen de bovenbouw van de drie torentjes kraagt 0,3 m vlak uit. Het script
controleert dat er buiten die uitkragingen geen vlak vlakker dan 45 graden
naar beneden wijst en dat alles op dezelfde onderkant begint. De export van
een uitsnede van 120 m op 1:1000 duurt circa 1,4 seconden; de poort gaat er
als gesloten solid met overhangopvulling doorheen (2,34 naar 2,41 cm³, vooral
de voet tot de onderplaat), beide doorgangen blijven open en de twee
vervangen panden zitten niet meer in de export. Het model staat op het
laagste bemonsteringspunt (de kade aan de stadszijde); het PDOK-terrein rond
de voet ligt 0,1 tot 1,2 m hoger en het water 2,5 m lager, zodat de voet
overal 1,5 tot 5,2 m in het terrein of het water staat.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Koppelpoort) (land- en
waterpoort, circa 1380-1425, gerestaureerd door Cuypers in 1885-1886),
[Rijksmonumentenregister 7928](https://monumentenregister.cultureelerfgoed.nl/monumenten/7928)
(twee kleine achtkante torens die halverwege uitkragen en de landpoort
flankeren, de waterpoort met schilddak over het Spui en een derde torentje
aan de overkant), PDOK BAG (de twee panden), PDOK BGT (waterdeel en
overbruggingsdeel: de waterloop van 7,3 m onder de poort), PDOK AHN (dsm en
dtm 0,5 m via WCS: dak-, muur- en torenhoogtes, kade, straat en water), de
PDOK luchtfoto en foto's op Wikimedia Commons (de veldzijde vanaf de Eem, de
stadszijde vanaf het Spui). Geschat zijn de breedte en de kruinhoogte van
beide bogen (uit frontale foto's), de hoogte van de uitkragingen en de
naalden van de torentjes (het DSM mist de dunne spitsen), de waterstand en
de plaats en maat van de mezekouw. Weggelaten zijn de dakkapel, de
spitsboogfries aan de stadszijde, de vensters, de wapens, de windvanen en de
volmolen; de bogen hebben een spitse in plaats van een ronde top, de
torentjes zijn regelmatige achthoeken en de daken zijn eenvoudige
schilddaken op de BAG-contour.

Licentie van het model: eigen werk op basis van open bronnen.
