# Dafne Schippersbrug (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `dafne-schippersbrug.glb` | Catalogusbron in meters: nodes `road:fietspad`, `road:voetpad` en `road:voetpad op trap` met de bovenste 0,5 m van het dek, de plaat op de school en de oprit, met de BGT-attributen in `extras.attributes`; node `building:brug` met de rest van het dek, de westpyloon, de oostkolommen, de kabelvlakken met hangers, de tuien, het landhoofd, de pijlers en de oprit over de school; node `building:school` met de school onder het dek; node `vegetation:daktuin` met het groene dak van de laagbouw |
| `dafne-schippersbrug-1-1000.stl` | Brug en school in één stuk op 1:1000 met een printvoet onder de overspanning, met de onderkant (0,6 m onder het maaiveld van de oostoever) op het printbed (232 × 49 × 36 mm) |
| `dafne-schippersbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (133887,25, 455478,79), op de as
van het BGT-dek midden tussen de voeten van de westpyloon en de
oostkolommen, op het maaiveld van de oostoever (NAP +1,83 m) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar het oosten, naar Oog in
Al (`xAxis` (0,99359, 0,11307), 6,49 graden linksom vanaf het oosten), +Y naar
het noordnoordwesten. Het landhoofd in Leidsche Rijn ligt op x = -86,1, de
westpyloon op x = -55, de oostkolommen op x = 55, de westgevel van de school
op x = 86,5 en de oprit op x = 138,3 tot 145,1. Het maaiveld wordt op zeven
punten op de oostoever bemonsterd (`groundSamplePoints`: twee langs de
Kanaalweg naast het dek, drie in de straat langs de zuidgevel van de school
en twee op het schoolplein, NAP +1,83 tot +1,97 m); `groundOffsetMetres` is 0.
Het jaagpad aan de westkant ligt 1 m hoger en het water lager, dus daar staan
geen punten; een uitsnede die alleen de westkant raakt, valt terug op
`groundHeight` 45,19 (ellipsoïdisch, de laagste PDOK-terreinhoogte op de
punten). Het model vervangt het BAG-pand van de school
(`NL.IMBAG.Pand.0344100000141216`, 2016, onderwijs- en sportfunctie), waarvan
PDOK een blok met een schuin dak langs de zuidkant maakt.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 7,4 m breed (BGT) van het landhoofd (+8,65 m) over het
  Amsterdam-Rijnkanaal, met het lengteprofiel uit het AHN om de 4 m: omhoog
  naar +10,1 m tussen x = -13 en 19, omlaag naar +8,6 m bij de school en
  +6,5 m bij de draai. Doorsnede met een rand van 0,5 m en een onderkant van
  4 m breed, 1,4 m onder het dek (onderkant +8,7 m: doorvaarthoogte 9 m).
- De westpyloon: twee poten van 1,6 m (voet) tot 1,9 m (dekhoogte) en 1,2 m
  (top), met de voeten 10,9 m uit elkaar op het jaagpad (BGT) en de top 5 m
  naar achteren boven de as op +36,8 m (AHN; bijna 35 m boven het water
  volgens de bron). Daarachter twee tuien van 1,1 m naar de ankers op de
  westoever (BGT, x = -74,5).
- De oostkolommen: twee losse vierkante kolommen van 1,7 tot 1,5 m naast het
  dek (voeten BGT, y = ±4,25), licht naar buiten hellend tot +21,0 m op
  y = ±5,7 (AHN), met tuien van 1,1 m naar de pijlers onder het dek op de
  oostoever (BGT, x = 67 tot 71).
- De hoofdkabels: parabool van de pyloontop via een laagste punt van +12,8 m
  op x = 12 (2,7 m boven het dek, AHN) naar de kolomtoppen, in plattegrond van
  de as bij de pyloon naar 5,7 m naast de as bij de kolommen (AHN). Kabel en
  hangers zijn per kant één plaat van 1 m van de dekrand naar de kabel, met
  een dichte strook van 1 m boven het dek en tien spitse openingen (zijden van
  55 graden) tussen hangers van 0,9 m op 5,8 m (19 velden, foto's); de hoogste
  opening naast de pyloon reikt tot +30,9 m. Waar de kabel minder dan 2,7 m
  boven de leuning hangt, is de plaat dicht.
- Het landhoofd in Leidsche Rijn met de vleugels (BGT, 13,6 m breed).
- Op de school: het dek als plaat tot x = 138, dan een kwartslag naar het
  noorden met de buitenbocht van het BAG-pand, de oprit van 6,9 m (BGT) over
  de oostrand van de laagbouw als twee dakvlakken (+6,55 m in de draai, in
  26 m omlaag naar +5,9 m, AHN) en daarna een bakstenen viaduct over het
  schoolplein tot het landhoofd op de grondwal (BGT, y = 42,7), met aan
  beide kanten een blinde nis van 4 × 2,7 m voor de doorgang naar de
  sportkuil (foto).
- De school (BAG-contour): de strook van 10,4 m onder het dek langs de
  zuidgevel met het dak 0,15 m onder het dek, de gymzaal (x = 86,5 tot 109,
  dak +9,15 m) met een veld zonnepanelen van 0,35 m, en de laagbouw tot de
  oprit (dak +6,4 m aan de zuidkant en +5,9 m aan de noordkant, AHN). Smalle
  verticale ramen als blinde nissen van 0,35 m (1 m breed, om de 2,7 tot
  3 m) in de zuidgevel onder het dek, de westgevel en de noordgevel van de
  gymzaal, en klaslokaalramen van 1,8 m in de noordgevel van de laagbouw.
- Het groene dak van de laagbouw als daktuin van 0,4 m, 0,9 m van de gevels.

Wegdek met PDOK-attributen: waar de actuele BGT-wegdelen met relatieve
hoogteligging 1 liggen, is de bovenste 0,5 m van het dek, de plaat op de
school en de oprit per functie een eigen node van klasse `road`, met in
`extras.attributes` `bgt_functie` en `bgt_fysiekvoorkomen` (`gesloten
verharding`; `plus_fysiekvoorkomen` is in de BGT leeg). Zo werken de
kleurregels van een thema (fietspaden rood) op de brug zoals op de
PDOK-wegdelen ernaast. Een rijbaan is er niet: het is een fiets- en voetbrug.

| Node | `bgt_functie` | BGT-wegdelen (`lokaal_id`) | Volume |
| --- | --- | --- | --- |
| `road:fietspad` | `fietspad` | G0344.31d3477fa17e4f998b38f137686880c7 (dek, noordhelft tot y = 3,28), G0344.f665b5201c874178a4c4650a2314ccef (op de school en door de draai), G0344.52a5b4973b9340eda8701f2e16c91973 (viaduct tot de grondwal) | 553 m³ |
| `road:voetpad` | `voetpad` | G0344.66068976d5db4c1a9c028165a0c935b1 (dek, zuidrand vanaf y = -3,21), G0344.60d9f356673e4d62b16af4940985a169 (op de school en langs de buitenkant van de draai), G0344.69478982fd36490594efbd6df349c381 (oostrand van het viaduct) | 228 m³ |
| `road:voetpad op trap` | `voetpad op trap` | G0344.7caef7a48c5644c6883bbce0470853ef (trapje aan de zuidrand bij de draai, 0,6 × 2,2 m) | 0,6 m³ |

De contouren zijn omgezet naar het lokale stelsel en tot 5 cm vereenvoudigd
met gedeelde randen (Douglas-Peucker per stuk rand tussen de knooppunten).
De laag is een snijstrook van 0,5 m onder tot 1 m boven het wegdek over
dezelfde loftstations als het dek en de plaat en met dezelfde knikken als de
oprit. De kabelvlakken (over hun hele strook, ook onder de openingen), de
pyloonpoten, de kolommen en de tuien blijven constructie met 2 cm vrij; omdat
ze hellen, gaat hun hele schaduw binnen de strook eruit, zodat de grens
tussen wegdeel en constructie verticaal is. De dekranden buiten de
wegdelen (0,4 m aan elke kant) blijven constructie. Wegdeel = strook ∩ brug,
constructie = brug − strook; samen precies het volume van de brug als geheel
(4.872,4 m³, constructie 4.091 m³, geen overlap). De oprit is daarvoor
opgebouwd uit twee overlappende stukken in plaats van drie die precies tegen
elkaar lagen (die hielden op de knikken een inwendige naad); de vorm is
gelijk. Langs de rand van het kabelvlak, waar het schuin over het dek hangt,
liggen in de constructie al enkele vlakken zonder dikte (ook in het eerdere
model); tussen de onderdelen liggen geen samenvallende vlakken.

Weggelaten: de lus en de S-bocht over de grondwal in het Victor
Hugoplantsoen met de sportkuil erin (zitten in het AHN-maaiveld en dus in het
PDOK-terrein en de PDOK-wegen; een tweede laag in de GLB zou er plaatselijk
doorheen steken), de leuningen van gaas en buis (1,2 m hoog maar enkele
centimeters dik), de lantaarns, de letters OOG IN AL op de oprit, de
speeltoestellen op het groene dak en de bomen. Het dek sluit aan het
landhoofd 0,35 m boven het PDOK-terrein van het pad op de dijk aan (in het
AHN loopt het in enkele meters van +8,65 naar +8,4 m), en het einde van de
oprit ligt 0,35 tot 0,55 m boven de PDOK-grondwal, die de top van de wal
afvlakt.

Op het AHN (DSM 0,5 m): binnen het dek over het kanaal ligt 93 % van de
cellen binnen 0,5 m van het model (96 % binnen 1 m, mediaan +0,01 m; de rest
zijn treffers op kabels en leuningen), op het dek over de school 99 %, op de
gymzaal 100 % (mediaan +0,16 m door de zonnepanelen), op de laagbouw 92 tot
98 % en op de oprit 88 %. De top van de pyloon komt in het AHN tot +37,2 m.

Printbaarheid op 1:1000: het dek hangt vrij over 170 m. De pyloonpoten hellen
9 graden, de kabelvlakken ten hoogste 14 graden, de tuien staan onder 55 tot
67 graden en de openingen hebben een spitse top, dus boven het dek print
alles zonder steun; hangers, poten, tuien en kolommen zijn minstens 0,9 mm.
In de export gaat het model als gesloten solids door de
overhangopvulling; omdat de wegdelen attributen hebben, worden alle
onderdelen samen opgevuld en gaat de opvulling naar de constructie: onder
het dek komt een wig met een smal scherm tot de onderplaat. Printcontrole op
1:1000 (uitsnede van 260 m, 6,4 s): status NoError voor alle onderdelen;
brug 11,3 cm³ bij verticale opvulling tegen 7,9 cm³ met de printbare
opvulling (-30 %), fietspad 0,55 cm³, voetpad 0,23 cm³ en trapje 0,001 cm³
zonder eigen opvulling (0 %), school 11,5 cm³ (0 %) en daktuin 0,17 cm³
(0 %). De STL heeft
dezelfde printvoet (wig van 50 graden en een scherm van 0,9 m, 3.439 m³) en
alleen de bovenkanten van de nissen hangen nog over (23 m², 0,35 m diep).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Dafne_Schippersbrug)
(fiets- en voetbrug over het Amsterdam-Rijnkanaal, hangbrug met een
overspanning van 110 m, geopend april 2017, de oprit over het dak van de
tegelijk gebouwde school), [NEXT architects](https://www.nextarchitects.com/?p=447)
(grondverankerde hangbrug tussen twee asymmetrische stalen pylonen, dek 9 m
boven het water, hoogste punt bijna 35 m boven het water, de lus over het dak
van de gymzaal), PDOK BGT (overbruggingsdeel: dek, pyloon- en kolomvoeten,
landhoofden, pijlers, ankers en oprit), PDOK BAG (pand 0344100000141216), PDOK
AHN (dsm en dtm 0,5 m via WCS: dek, pyloon, kolommen, kabels, daken, oprit en
maaiveld), de PDOK-luchtfoto (plattegrond van school, oprit en lus) en
Wikimedia Commons-foto's (Dafne Schippersbrug wide shot looking north.jpg;
Dafne Schippersbrug east end with school.jpg; Dafne Schippersbrug, Utrecht,
the Netherlands.jpg; Dafne Schippersbrug Utrecht 2019 (1 tot 3).jpg; Dafne
Schippers bridge.jpeg). Geschat zijn de doorsnede van het dek, de dikte van
pyloonpoten en kolommen, de hangerafstand (19 velden), de vorm van de kabel in
plattegrond tussen de AHN-punten, de ramen en de doorgang onder het viaduct
(plaats, maat en ritme van foto's), het veld zonnepanelen en de grens tussen
de twee daken van de laagbouw; de kabels, hangers en tuien zijn veel dikker
dan in werkelijkheid.

Licentie van het model: eigen werk op basis van open bronnen.
