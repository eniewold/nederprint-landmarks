# John Frostbrug (Arnhem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `john-frostbrug.glb` | Catalogusbron in meters: nodes `road:rijbaan`, `road:ov-baan`, `road:fietspad` en `road:fietspad-viaduct` (de bovenste 0,5 m van het wegdek met PDOK-attributen, zie onder) en `building:john-frostbrug` met de rest: het stalen dek (hoofdliggers, rijweg, consoles met fiets- en voetpaden), de verstijfde staafboog met de hangers als scherm met spitse openingen, de twee rivierpijlers met opleggingen, de zuidelijke aanbrug (vijf pijlers met opleggingen, twee op een funderingsplaat), de overgangspijler met bordestrappen, de landhoofden, de twee torens met trappen en bordes op het noordelijke landhoofd, en het betonnen viaduct met liggers, dwarsbalken, kolommen en wand |
| `john-frostbrug-1-1600.stl` | De brug in één stuk op 1:1600 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (381 × 27 × 22 mm; met `--scale` een andere schaal, op 1:1000 is hij 609 mm lang) |
| `john-frostbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (191034,70, 443068,40), op de as
van het dek midden tussen de twee rivierpijlers, op de waterspiegel van de
Rijn zoals het PDOK-terrein die legt (NAP +8,25 m) en de glTF-conventie Y
omhoog. +X loopt langs de brug naar het noordnoordoosten, naar de binnenstad
(`xAxis` (0,50843, 0,8611), 59,43 graden linksom vanaf het oosten, uit de
randen van het BGT-dek), +Y stroomafwaarts naar het westnoordwesten. Het
zuidelijke landhoofd ligt op x = -378 tot -371,9 (in de toerit), de
rivierpijlers op x = -63,0 tot -56,5 en 56,4 tot 63,3, het noordelijke
landhoofd aan de Rijnkade op x = 109,1 tot 117,0 en het landhoofd van het
viaduct op x = 222,3 tot 231,1. Het maaiveld wordt op zes punten op de Rijn
bemonsterd, 22 m naast de hoofdoverspanning op x = -45, -15 en 15
(`groundSamplePoints`); `groundOffsetMetres` is 0, want het PDOK-terrein legt
de Rijn op de waterspiegel van het model (ellipsoïdisch 51,86 tot 51,90 m).
`groundHeight` is 51,86 m, de laagste PDOK-hoogte op die punten, zodat een
uitsnede die alleen de aanbrug of het viaduct raakt het model niet laat
wegvallen. Op de strang en de uiterwaard ligt het PDOK-terrein 0,5 tot 4 m
hoger en aan de Rijnkade 5,7 m; daarom liggen de punten alleen op de Rijn.
Geen BAG-pand onder de brug (de dichtstbijzijnde panden aan de Rijnkade
liggen 6 m of meer naast het viaduct).

Onderdelen in het model (hoogtes in NAP):

- Het wegdek als vier eigen nodes van klasse `road`, de bovenste 0,5 m van
  het dek, met de attributen van het BGT-wegdeel eronder in
  `extras.attributes`, zodat de kleurregels van een thema (fietspaden rood,
  busbaan) op de brug werken zoals op de PDOK-wegdelen ernaast:

  | Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`, hoogteligging 1) |
  | --- | --- | --- | --- | --- |
  | `road:rijbaan` | rijbaan regionale weg | gesloten verharding | asfalt | G0202.2af034b6819e12c4e05343604191f184, G0202.2af034b9c9ae12c4e05343604191f184 |
  | `road:ov-baan` | OV-baan | gesloten verharding | asfalt | G0202.bdb74c88fe9f1488e0537260419161d0, G0202.bdb74c88fe971488e0537260419161d0 |
  | `road:fietspad` | fietspad | gesloten verharding | asfalt | G0202.2af034b7b8aa12c4e05343604191f184, G0202.2af034b9cbb712c4e05343604191f184, G0202.2af034b9c9ad12c4e05343604191f184, G0202.2af034b9465712c4e05343604191f184, G0202.2af034b6457c12c4e05343604191f184 |
  | `road:fietspad-viaduct` | fietspad | gesloten verharding | (leeg in de BGT) | G0202.2af034b9c9af12c4e05343604191f184 |

  Over de stalen brug scheiden de hoofdliggers de rijweg van de fiets- en
  voetpaden op de consoles; de BGT-randen liggen daar 0,1 tot 0,6 m naast de
  liggers van het model, dus is het fietspad daar alles buiten de liggers. De
  OV-baan (de busbaan aan de oostkant van de rijweg) loopt van de oostelijke
  ligger tot de BGT-grens met de rijbaan (2,8 tot 3,1 m oost van de as); de
  rijbaan is de rest tussen de liggers. Op het noordelijke landhoofd en het
  viaduct (zonder liggers, vanaf x = 112) gelden de binnenranden van de
  BGT-fietspaden (5,85 m west en 6,2 m oost van de as); hun buitenrand ligt
  naast de torens 0,1 tot 0,4 m binnen de dekrand en loopt hier tot de
  dekrand door. Het fietspad aan de westkant van landhoofd en viaduct heeft
  in de BGT geen materiaal en is daarom een eigen node zonder
  `plus_fysiekvoorkomen`. Het wegdek begint 0,5 m op het zuidelijke
  landhoofd (de BGT-wegdelen op de brug beginnen bij x = -371,9; het
  landhoofd daarvoor ligt in de toerit) en loopt tot het einde van het
  viaduct. De liggers met de bogen en het hangerscherm, de bordestrappen, de
  torens en de trappen naast het dek blijven constructie (2 cm vrij); onder
  het wegdek houdt de constructie op 0,5 m onder het wegdek op. Volumes:
  rijbaan 2 749 m³, OV-baan 1 035 m³, fietspad 2 376 m³, fietspad-viaduct
  347 m³, constructie 52 019 m³; samen precies het volume van de brug als
  geheel (58 527 m³).
- Het stalen dek van 22,6 m breed over de zuidelijke aanbrug en 23,7 m over
  de hoofdbrug (BGT; register 23,2 m), met het wegdek volgens het AHN-DSM om
  de 4 m: +17,2 m bij het zuidelijke landhoofd, met 2,5 % stijgend tot
  +25,4 m boven de hoofdoverspanning en dalend tot +23,7 m op het noordelijke
  landhoofd. De twee doorgaande hoofdliggers (hoedprofiel) op 6,85 m naast de
  as als ribbels van 1,0 m breed en 0,9 m boven het wegdek (AHN 0,6 tot
  0,8 m), over de hele stalen brug; de onderkant van liggers en rijweg 2,9 m
  onder het wegdek (register: liggers van 3,4 tot 4 m hoog). Buiten de
  liggers de fiets- en voetpaden van 4 m op consoles, aan de rand 0,7 m dik
  met een schuine onderkant naar de onderkant van de ligger.
- De verstijfde staafboog over de hoofdoverspanning van 120 m (register):
  twee bogen op de liggers, 1,0 m breed en 1,2 m hoog, met de bovenrand als
  parabool met de top op +42,5 m (17,1 m boven het wegdek; register 17,5 m)
  die bij de rivierpijlers in de ligger uitkomt. De 15 hangers (16 velden
  van 7,5 m, foto's) als stijlen van 1,0 m in een scherm tussen ligger en
  boog met 12 doorgaande spitse openingen (zijden van 55 graden, top van
  +33,2 tot +41,2 m); in de twee eindvelden aan elke kant is de ruimte te
  laag en is het scherm dicht.
- De twee rivierpijlers met spitse koppen (BGT, "spitsbogig" volgens het
  register): 6,5 en 6,9 m dik, recht tot 9 m naast de as en spits tot 15,9
  en 16,2 m, bovenkant +18,9 m (AHN), met per ligger een stalen oplegging van
  2,0 × 1,6 m tot de onderkant van het dek.
- De zuidelijke aanbrug: zes velden van circa 42 m (register, BGT) op vijf
  pijlers met spitse koppen van 4,2 tot 4,5 m dik en 24,4 m lang (BGT), die
  met het dek in hoogte afnemen: de gemetselde pijler eindigt 2,5 m onder de
  liggers, daar staan twee stalen opleggingen van 1,6 × 1,6 m. De twee
  pijlers in de strang staan op een funderingsplaat met spitse koppen van
  12,8 tot 13,7 × 42,5 m, bovenkant +10,0 m (BGT, luchtfoto, AHN).
- De zuidelijke overgangspijler (12,2 × 24,8 m, BGT) tot onder de liggers,
  met aan beide kanten een bordestrap: een traplichaam van 6,2 m breed van
  de rand van het dek tot 20,5 m naast de as met een halfronde kop, het
  bordes naast het dek op +23,5 m en de kop op +21,0 m (AHN, luchtfoto).
- Het zuidelijke landhoofd (6 m lang, tot het wegdek) en het granieten
  noordelijke landhoofd (7,9 m, tot het wegdek).
- De twee vierkante torens op het noordelijke landhoofd (5,2 × 4,5 m naast
  het dek): een voet tot 1,3 m boven het fietspad, een schacht die aan de
  buitenkanten 0,3 m terugspringt, en een bekroning van 1,2 m met een schuine
  onderkant tot +28,6 m (AHN), met blinde nissen van 0,35 m voor de vensters
  in de drie buitengevels en de deur naar het fietspad. Aan de rivierkant de
  lage trapwangen (+16,0 m), aan de noordkant de trappen van 3 m breed die
  van +19,0 m tot het wegdek op x = 131 stijgen, en aan de westkant het
  bordes van de herdenkingsplaats op dekhoogte.
- Het betonnen viaduct over de Rijnkade en de Oranjewachtstraat (23,8 m
  breed): dekplaat van 1,0 m, vier liggers van 1,2 m tot 1,8 m onder het
  wegdek, op vier rijen van vier vierkante kolommen van 0,96 m (BGT) met
  dwarsbalken tot 2,8 m onder het wegdek, de wand van 4 × 16,7 m en twee rijen
  kolommen van 1,6 m langs de onderdoorgang (BGT), en het landhoofd tot
  x = 231,1, waar de toerit in het PDOK-terrein doorloopt.

Wat er niet in zit: het windverband (K-verband) tussen de bogen en de
eindportalen (horizontale staven boven het dek, niet zonder steun te printen;
op de kaart zou de opvulling eronder een dichte tent geven), de leuningen en
borstweringen, de lantaarns en de bovenleiding van de trolleybus, de
onderhoudstrappen bij de boogaanzetten en de verfwagenrails (allemaal kleiner
dan 0,9 m), de S-vormige trappen met zeshoekige bordessen achter het viaduct
(buiten het brugdek en onder bomen, ze liggen in het PDOK-terrein) en de
toeritten op een dijklichaam achter de landhoofden (PDOK-terrein). De
hangers zijn in werkelijkheid open staven met rechthoekige velden; op
1:1000 zijn ze een scherm met spitse openingen.

Binnen de rijweg (12 m brede strook over 600 m, AHN-DSM 0,5 m) ligt 92 % van
de cellen binnen 1 m van het wegdek van het model (mediaan +0,01 m). De
bovenrand van de bogen ligt voor |x| < 50 op de bovenste DSM-cellen (90e
percentiel van het verschil +0,04 m); het DSM is op de dunne bogen dun bezet.

Printbaarheid op 1:1000: de bogen, de ribbels van de liggers, de stijlen van
het hangerscherm en de kolommen van het viaduct zijn minstens 0,96 m; de
openingen in het scherm hebben een spitse top van 55 graden en de bekroning
van de torens een onderkant van 50 graden; de nissen in de torens zijn blinde
nissen van 0,35 m. Vrij hangen alleen de onderkant van het dek, de consoles,
de liggers en dwarsbalken van het viaduct (samen circa 13 900 m²); de STL heeft
daaronder een printvoet (een wig van 50 graden vanaf de randen van het dek
die uitloopt in een scherm van 0,9 m tot de onderplaat), waarna in de
printversie alleen de bovenkanten van de nissen in de torens (6,6 m²)
overblijven. Met 609 m past de brug op 1:1000 niet in één uitsnede. In de
export (printcheck, gesloten solid met overhangopvulling, status NoError):
het hele model op 1:1416 in 5 s (+13,5 % over alle onderdelen samen; de
opvulling zit in de constructie, +14,4 % op haar eigen volume, de vier
wegdelen krijgen niets), een uitsnede van 400 × 400 m rond
de boog op 1:1000 in 6 s (+2,5 %; de openingen in het scherm blijven open) en
een uitsnede van 400 × 400 m over de zuidelijke aanbrug op 1:1000 in 3 s
(+20,2 %). Het PDOK-terrein ligt op de Rijn op de waterspiegel van het model;
onder de aanbrug ligt het maaiveld in de uiterwaard op +10 tot +12 m en de
strang op +8,7 m, onder het viaduct de Rijnkade op +14,0 m. Aan het noordeinde
sluit het wegdek binnen 0,3 m op de PDOK-toerit aan; aan het zuideinde ligt de
PDOK-toerit circa 1 m lager dan het wegdek, zodat daar het kopvlak van het
landhoofd zichtbaar is. PDOK zelf tekent de brug alleen als een vlakke
wegstrook op het maaiveld en het water.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/John_Frostbrug) (1935,
herbouwd 1950, lengte 601 m, breedte 23,8 m, overspanning 120 m),
[Rijksmonumentenregister 529907](https://monumentenregister.cultureelerfgoed.nl/monumenten/529907)
(verstijfde staafboogbrug op doorgaande liggers over 50 + 120 + 50 m, liggers
van 3,4 tot 4 m, boog van 17,5 m, ellipsvormige rivierpijlers met spitse
koppen, overgangspijler met bordestrappen, aanbrug van zes velden van 42 m op
vijf pijlers, noordelijk landhoofd met twee torens, betonnen viaduct met vier
liggers op rijen vierkante kolommen en dwarsbalken), PDOK BGT
(overbruggingsdeel: dek, pijlers, funderingsplaten, landhoofden, kolommen en
wand van het viaduct; wegdeel: rijbaan, OV-baan en fietspaden op het dek),
PDOK AHN (dsm en dtm 0,5 m via WCS: lengteprofiel van
het wegdek, liggers, bogen, rivierpijlers, torens, trappen, maaiveld), PDOK
luchtfoto (torens, trappen, funderingsplaten), het PDOK-terrein
(waterspiegel) en Wikimedia Commons-foto's (Arnhem, de John Frostbrug
RM529907 vanaf Arnhem Zuid IMG 8947 2019-03-31 20.13.jpg; Arnhem, de John
Frostbrug RM529907 met uiterwaarden IMG 3811 2024-07-15 13.08.jpg; John
Frostbrug Arnhem vanaf het noorden 22-04-2019.jpg; Overzicht van de brug met
brugwachtershuizen - Arnhem - 20420259 - RCE.jpg; Overzicht van de John
Frostbrug over de Nederrijn - Arnhem - 20420263 - RCE.jpg; Arnhem, John
Frost Bridge 2025-07-09 01.jpg) voor de hangers, de boogdoorsnede, de
liggers, de pijlers met stalen opleggingen en de torens. Geschat zijn de
doorsnede van de boogrib (1,0 × 1,2 m), het aantal hangervelden (16, van
foto's), de onderkant van de liggers (2,9 m onder het wegdek), de dikte van
de consoles aan de rand (0,7 m), de hoogte van de opleggingen op de
aanbrugpijlers (2,5 m; de bovenkant van die pijlers is onder het dek niet te
meten), de onderkant van het viaduct (liggers 1,8 m, dwarsbalken 2,8 m onder
het wegdek), de vensters en de deur in de torens, en de trappen ten noorden
van de torens (als stijgend traplichaam); de waterspiegel is de PDOK-waarde
van NAP +8,25 m, die met de rivierstand meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
