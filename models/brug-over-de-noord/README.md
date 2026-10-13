# Brug over de Noord (Alblasserdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `brug-over-de-noord.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het dek met BGT-attributen) en `building:brug-over-de-noord` met de rest: het westelijke landhoofd, de aanbrug, de twee rivierpijlers, de boogbrug met trekband (twee vakwerkbogen met hangers), de rolbasculebrug in gesloten stand, de basculekelder en de brugwachterspost |
| `brug-over-de-noord-1-1000.stl` | De brug in één stuk (alle onderdelen samen) op 1:1000 met printvormen (blinde nissen in de bogen, spitse openingen tussen de hangers) en een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (318,6 × 27,9 × 49,8 mm) |
| `brug-over-de-noord.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (104498,00, 430004,50) (WGS84
51,85632 N, 4,65414 O), op de as van de brug midden tussen de twee
rivierpijlers, op de waterspiegel van de Noord (NAP +0,05 m zoals het
PDOK-terrein het water legt) en de glTF-conventie Y omhoog. +X loopt langs de
brug naar het oosten, naar Alblasserdam (`xAxis` (0,92519, 0,37951), 22,30
graden linksom vanaf het oosten), +Y naar het noordnoordwesten,
stroomafwaarts. Het westelijke landhoofd op de dijk van Hendrik-Ido-Ambacht
ligt op x = -157,7 tot -143,9, de rivierpijlers op x = -96,4 tot -90,0 en 90,1
tot 96,6 (hart ±93,3, de opleggingen van de boog), de basculekelder op
x = 140,0 tot 160,9. Het maaiveld wordt op acht punten op het water naast de
brug bemonsterd (`groundSamplePoints`, 25 m naast de as op x = -60, 0, 60 en
118); `groundOffsetMetres` is 0, want het PDOK-terrein legt de Noord op 43,48
tot 43,50 m ellipsoïdisch, de waterspiegel van het model. Omdat de brug 319 m
lang is, staat de laagste van die hoogtes ook als vaste terugval in
`groundHeight` (43,48), zodat een uitsnede die alleen een uiteinde raakt het
model niet laat wegvallen. Het model vervangt het BAG-pand van de
brugwachterspost (`NL.IMBAG.Pand.0482100001254422`), dat PDOK als een kolom
van 6 × 4,5 m van het water tot NAP +21 m reconstrueert.

De controle-URL (51,85650, 4,65600) valt naast de basculebrug, 31 m ten zuiden
van de as; het hart van het model ligt op 51,85632 N, 4,65414 O. Ten oosten
van de kelder loopt de betonnen aanbrug op kolommen (geen deel van het
monument) over het werfterrein verder; die zit niet in het model en ook niet
in de PDOK-reconstructie (daar ligt alleen de gedrapeerde wegstrook).

Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek tussen de
schampkanten (op de kelder tussen de borstweringen) is per BGT-functie een
eigen node, met de attributen van het BGT-wegdeel eronder in
`extras.attributes`, zodat de kleurregels van een thema op het brugdek werken
zoals op de PDOK-wegdelen ernaast:

| Node | Attributen | BGT-wegdeel (relatieve hoogteligging 1) |
| --- | --- | --- |
| `road:rijbaan` | `bgt_functie` rijbaan regionale weg, `bgt_fysiekvoorkomen` gesloten verharding | `L0002.e5e275a5ac5840229d45c31ae13c0102`, y = -6,1 tot 6,3 |
| `road:fietspad` | `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding | `L0002.2ad2a960307a4673966b760fa408bad6` (zuidkant) en `L0002.7d9eda94570945d1a9b75da4e452e8cf` (noordkant) |
| `building:brug-over-de-noord` | geen | de rest van het kunstwerk |

De drie wegdelen lopen van het westelijke landhoofd (x = -144,2) tot de
oostkant van de kelder (x = 160,9); geen van de drie heeft een
plus-fysiek voorkomen. Volgens de BGT begint het fietspad op de boogbrug op
de rand van de rijbaan (y = ±6,0), 0,3 m binnen de boog; in het model staat
daar de boog, dus binnen de bogen is het dek rijbaan en ligt het fietspad
buiten de bogen tot de schampkant. Aan de oostkant lopen de fietspaden over
de kleine inhammen van de BGT-vlakken (0 tot 14 cm voor de kopse kant van de
kelder) door tot het einde. De schampkanten, de borstweringen, de bogen met
hun hangers (ook onder de openingen) en de voegen van de klep blijven
constructie, met 2 cm vrij rond het wegdek; ook het landhoofd (op de dijk
liggen BGT-wegdelen met hoogteligging 0) en het bordes aan de zuidkant van de
kelder (buiten de borstwering) blijven constructie. De wegdelen zijn de strook
van 0,5 m onder tot 1 m boven het wegdek binnen de brug, de constructie de
brug min die strook, zodat er geen samenvallende bovenvlakken zijn; de
volumes tellen op tot die van de brug als geheel (33 308 + 1 888 + 607 m³ =
35 803 m³). De rijbaan bestaat uit drie stukken en elk fietspad uit drie,
onderbroken door de voegen van de klep.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek volgens het AHN-DSM om de 4 m: +13,8 m op het landhoofd, +15,1 m
  midden in de boog en +13,8 m op de kelder, met een schampkant van 0,9 × 0,5 m
  langs de randen.
- Het westelijke landhoofd (BGT, 13,8 × 19,1 m) tot het wegdek.
- De aanbrug (47,5 m, register: opening 45 m) en de rolbasculebrug (43,4 m,
  register: doorvaartwijdte 42 m) in gesloten stand: een kokerdek van 18,5 en
  18,2 m breed (BGT) tot de onderrand van de V-liggers, 6,5 m onder het wegdek,
  met de evenwijdige V-liggers met verticalen als blinde nissen van 0,35 m in
  de zijwanden (8 velden van 5,9 m en 7 velden van 6,2 m, staven 0,9 m). Over
  de basculeklep twee voegen van 0,5 m in het wegdek, bij de punt en de hiel.
- Twee gemetselde rivierpijlers van 6,4 × 25 m met ronde koppen (BGT): een
  voet tot +3,0 m, een schacht die 0,5 m terugspringt en een dekplaat die onder
  50 graden weer uitkraagt tot de omtrek van de voet, tot onder het dek.
- De boogbrug met trekband van pijlerhart tot pijlerhart (186,6 m; register:
  178 m tussen de pijlers): een dek van 20,6 m breed (BGT; rijdek 12 m met
  zijpaden van 2,5 m) met een constructiehoogte van 2,4 m tussen de
  hoofdliggers en 0,8 m onder de zijpaden. Twee vakwerkbogen van 1,3 m dik,
  7,0 m naast de as (AHN), met de bovenrand volgens het AHN (top +49,0 m,
  34 m boven het wegdek; register: 33 m hoog) en een vakwerk van 7,0 m hoog in
  de top dat bij de opleggingen dichtloopt, zodat boven- en onderrand bij de
  pijlers samenkomen (register, foto's). 21 velden van 8,886 m met per veld een
  verticaal en een diagonaal die naar het midden toe daalt, in het middelste
  veld een V, met staven van 0,9 m; de 41 vakwerkdriehoeken zijn doorgaande
  openingen.
- De 20 hangers (foto's: geen hanger in het midden) als stijlen van 1,0 m
  tussen dek en onderrand. In alle 21 velden is de ruimte tussen de hangers
  open tot de onderrand (in het buitenste veld vanaf waar de onderrand boven
  het dek komt), in het midden tot +42,0 m; zie de printbaarheid.
- De betonnen basculekelder (BGT, 20,9 × 20,6 m) tot het wegdek, met een
  borstwering van 0,9 × 1,0 m langs de randen, aan de lange zijden een rij
  smalle vensters onder het dek en twee hoge vensters lager (blinde nissen van
  0,35 m, foto's), een bordes op dekhoogte aan de zuidkant (BGT) en een bordes
  met een console van 50 graden aan de noordkant (AHN).
- De brugwachterspost (BAG-pand, foto's): een kantoortje van 6,0 × 4,5 m en
  3,2 m hoog met het dak op +21,2 m (AHN), op een ronde kolom van 1,1 m naast de
  kelder, met een kraag van 50 graden onder het kantoortje.

Wat er niet in zit: het K-vormige stabiliteitsverband tussen de bovenranden
van de bogen (staven, te dun voor 1:1000), het open vakwerk van de V-liggers
(blinde nissen in de zijwanden van het kokerdek: het model heeft onder het
wegdek een dicht kokerdek in plaats van losse liggers, en hoeveel liggers er
onder het dek liggen en waar, is niet bekend), de echte hangers van circa
0,6 m (vervangen door stijlen van 1,0 m), leuningen,
lantaarns, slagbomen, de trap van de brugwachterspost (smaller dan 0,9 m), het
remmingwerk en de dukdalven bij de doorvaart (losse palen in het water, geen
deel van de brug) en de betonnen aanbrug ten oosten van de kelder (geen deel
van het rijksmonument).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
gedrapeerde wegstrook zonder boog en zonder pijlers, met de brugwachterspost
als een kolom van het water tot +21 m. Het model heeft van alle vier kanten de
vakwerkboog met hangers (van zuid en noord de hangers met de open velden en
het open vakwerk, van oost en west de twee bogen achter elkaar), de
rivierpijlers met voet en dekplaat, de V-liggers onder aanbrug en
basculebrug, de kelder met vensters en borstwering en de post op zijn kolom.

Pasvorm op het AHN: van de DSM-cellen binnen 5,5 m van de as ligt 80 % binnen
1 m van het wegdek van het model (mediaan +0,03 m; de rest zijn auto's,
schampkanten, het windverband en de bogen). De omhullende per 8 m (hoogste
DSM-cel binnen 9 m van de as) ligt in 19 van de 22 vakken binnen 1 m van de
bovenrand van de boog en in alle vakken binnen 2 m (mediaan +0,12 m). Het dak
van de brugwachterspost ligt in het AHN op +21,2 m.

Printbaarheid op 1:1000: de echte hangers, staven en het windverband zijn te
dun. De bogen zijn banden van 1,3 m die via de hangerstijlen op het dek
staan. Wat zonder steun niet print, laat het model aan de export over: de
onderkant van het dek en van de kokerdekken (5577 m²), de vlakke kanten van
de vakwerkdriehoeken en de onderrand boven de open velden (samen met de
andere ondervlakken op de bogen 1212 m²) en de bovenkant van de nissen in de
V-liggers en de vensters; het script controleert dat alles op dezelfde
onderkant begint. In de meettest van de webshop (`scripts/overhang-lab`, het
model op 1:1000) gaat het volume met "Ondersteuning v2.0" van 35,8 naar
59,8 cm³ (v1.0: 62,9 cm³), zonder ongedragen lagen waar een printlijn in
past, in 19 s; het vorige model met spitse openingen in de dertien middelste
velden kwam op 59,7 cm³. Onder het dek komt een wig met een smal scherm tot
de onderplaat. In de vakwerkdriehoeken vult de export een deel op als scherm
midden in de boog, met aan de buitenkant alleen dunne stroken; in het derde
en vierde veld aan elke oplegging blijft onder de onderrand een smalle band,
de twee buitenste velden (in de STL dicht) vult ze grotendeels. In de
dertien middelste velden komen onder de vlakke onderrand schoren onder
45 graden vanaf beide hangers met een spitse opening ertussen; onder de
knopen van het vakwerk in het vijfde en zevende veld aan elke kant zet ze
daarnaast smalle schermen tot op het dek, maar geen veld vult ze helemaal.
De STL op 1:1000, die zonder export wordt geprint, heeft printvormen:
de vakwerkdriehoeken van de bogen als blinde nissen van 0,3 m aan beide
kanten, in de velden spitse openingen (in de twee buitenste velden aan elke
kant is het scherm dicht) en een printvoet (wig van 50 graden en een scherm
van 0,9 m; onder de kokerdekken een trapezium tot de onderplaat); ze is
ongewijzigd.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Brug_over_de_Noord)
(geopend 14 november 1939, sinds de Noordtunnel van 1992 de N915),
[Rijksmonumentenregister 516075](https://monumentenregister.cultureelerfgoed.nl/monumenten/516075)
(boogbrug met trekband, rolbasculebrug en aanbrug van geklonken staal; 178 m
tussen de pijlers, vakwerkbogen van 33 m hoog met samenkomende randen bij de
opleggingen, K-vormig stabiliteitsverband, rijdek 12 m met zijpaden van 2,5 m,
basculebrug 42 m, aanbrug 45 m, V-liggers met verticalen, gemetselde pijlers
en landhoofden met betonnen dekplaten), Wikidata (lengte 295 m), PDOK BGT
(overbruggingsdeel: dek, landhoofd, pijlers, kelder; pand: brugwachterspost;
wegdeel: rijbaan en fietspaden op het dek),
PDOK AHN (dsm 0,5 m via WCS: wegdek, bogen, brugwachterspost), de
PDOK-luchtfoto en het PDOK-terrein (waterspiegel), en de Wikimedia
Commons-foto's Brug over de Noord Alblasserdam 2018 1 tot en met 4.jpg,
Alblasserdam Brug over de Noord seen from the southeast.jpg (en de open
variant), Geopende Alblasserdamse brug (01).jpg, Monument id 516075
alblasserdam (29).jpg en Alblasserdam (28) - Flickr - bertknot (1).jpg voor het
vakwerk, de hangers, de V-liggers, de pijlers, de kelder en de post. Geschat
zijn de waterspiegel (NAP +0,05 m: PDOK-water 43,49 m ellipsoïdisch min
43,45 m, het verschil tussen PDOK-terrein en AHN op dijk en uiterwaard), de
vakwerkhoogte van de bogen (7,0 m in de top, uit foto's), het aantal velden
(21, uit foto's), de diepte van de V-liggers (6,5 m), de constructiehoogte
van het boogbrugdek (2,4 m), de pijlervoet (+3,0 m), de vensters van de
kelder, de hoogte en de kolom van de brugwachterspost (de kolom loopt in het
model tot het water) en de console onder het noordelijke bordes.

Licentie van het model: eigen werk op basis van open bronnen.
