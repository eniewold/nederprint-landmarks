# Nesciobrug (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `nesciobrug.glb` | Catalogusbron in meters: node `building:nesciobrug` met het slingerende kokerdek, de lus en de noordelijke helling, de twee pylonen, de hoofdkabel met het hangerscherm, de vier tuien, de ovale trappen, de kolommen en de landhoofden; de bovenste 0,5 m van dek en trappen als nodes `road:fietspad`, `road:voetpad`, `road:voetpad-op-trap-zuid` en `road:voetpad-op-trap-noord` met de BGT-attributen (zie hieronder) |
| `nesciobrug-1-2500.stl` | De brug in één stuk op 1:2500 met een printvoet onder het dek, met de onderkant (1 m onder de waterspiegel) op het printbed (206 × 100 × 15 mm) |
| `nesciobrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (126542,98, 485475,68), midden
tussen de voeten van de twee pylonen, op de waterspiegel van het
Amsterdam-Rijnkanaal (NAP -0,5 m) en de glTF-conventie Y omhoog. +X loopt van
pylon naar pylon naar het noordoosten (`xAxis` (0,73349, 0,6797), 42,8 graden
linksom vanaf het oosten), +Y naar het noordwesten. De pylonen staan op
x = ±83,56 (y = 0), het fietsdek ligt in het midden op y = 1,0 tot 5,0 met het
voetpad aan de noordwestkant ernaast (tot y = 7,7); de lus ligt ten
zuidwesten (x = -229 tot -152, begin op het maaiveld bij x = -153, y = 22) en
de noordelijke helling eindigt op x = 285,8, y = -212. Het maaiveld wordt op
zes punten op het kanaal naast de hoofdoverspanning bemonsterd
(`groundSamplePoints`, x = -40, 0 en 40, y = -22 en 28; PDOK-water 42,46 tot
42,55 m ellipsoïdisch); `groundOffsetMetres` is 0. Een uitsnede zonder kanaal
(alleen de lus of de helling) valt terug op `groundHeight` 42,46 m
(ellipsoïdisch, het PDOK-water), zodat het model daar op dezelfde hoogte staat
en niet op het maaiveld van de oever (0,5 tot 1 m hoger) of de sloten in het
Diemerpark (NAP -2 m). De Nesciobrug is geen BAG-pand en vervangt dus niets;
geen PDOK-pand raakt het model.

Onderdelen in het model (hoogtes in NAP):

- Het kokerdek, in plattegrond de BGT-wegdelen op de brug plus 0,4 m rand, in
  de hoofdoverspanning aan de zuidoostkant 1,0 m (AHN: dekrand op y = 1,0,
  fietspad vanaf 2,06; daar hangen de hangers). Rand 0,6 m dik, kern 1,2 m,
  0,8 m binnen de rand. In het midden vormen fietspad en voetpad één dek van
  6,7 m; 53 m uit het midden splitst het voetdek zich af naar het noordwesten
  en loopt het fietsdek onder de kabel door naar het zuidoosten, zodat elke
  pylon tussen de twee dekken staat.
- Het wegdek in de hoofdoverspanning volgt een parabool (AHN) van +11,95 m in
  het midden tot +10,5 m op x = ±72 en +9,85 m op x = 86. Het fietsdek stijgt
  vanaf het begin van de lus (+1,86 m) 4,1 % tot een bordes op +4,9 m, dan
  3,6 % tot een tweede bordes op +7,2 m en 3,7 % tot de pylon; aan de
  noordkant daalt het 3,2 % en dan 2,0 % tot +3,55 m aan het eind. Het
  voetdek ligt na de splitsing iets hoger (verkanting, 0,15 m bij de pylon,
  0,43 m bij de trap: +9,5 m).
- Twee pylonen: ronde buizen van 1,8 m aan de voet (BGT 2,64 m²) tot 1,0 m in
  de top op +35,8 m, met een bolle kap.
- De hoofdkabel (AHN) in één vlak: +16,0 m in het midden, 4 m boven het dek
  en net buiten de dekrand (y = 0,95), oplopend tot +35,2 m bij de pylonen
  (z = 16 + 3,144·10⁻³ x² − 5,6·10⁻⁸ x⁴), in plattegrond naar y = 0 bij de
  pylonen. Daaronder het hangerscherm van 0,95 m dik als regelvlak van de
  kabel naar de zuidoostrand van het fietsdek: de hangers hangen aan de
  dekrand, en omdat het fietsdek onder de kabel door zwaait, staan ze tot 21
  graden schuin (foto's: oren aan de buitenrand van het gebogen fietsdek).
  Twaalf velden van 6,96 m per helft met staanders van 0,9 m en 24 openingen
  met een vlakke onderkant 0,4 m boven het dek, staande zijden en een spitse
  top (55 graden) 0,3 m onder de kabelband; in het midden, waar het scherm
  maar 4 m hoog is, zijn het driehoeken.
- Vier tuien van 0,9 m van de pylontop (+35,3 m): één naar de
  noordwestrand van het fietsdek bij het zware steunpunt op de lus en de
  helling (BGT 1,27 en 1,55 m² op x = ±107,6) en één naar het eind van het
  voetdek boven de trap (BGT-steunpunt x = ±102,6, y = 9,8).
- De ovale trappen aan het eind van het voetdek (luchtfoto, BGT): 10,4 × 8,4 m
  met de lange as langs het voetdek, om het tuisteunpunt heen. Het voetdek
  loopt over de rug tot de landwaartse punt; aan weerszijden daalt een
  trapgoot van 1,55 m breed onder 33 graden naar de kanaalkant (tot +2,3 m),
  met een wang van 0,9 m dik die 1,1 m boven de tredelijn meedaalt.
- 36 ronde kolommen onder de lus en de noordelijke helling (BGT, 0,65 m²:
  0,91 m) en de twee zware steunpunten (1,27 en 1,55 m²), en een landhoofd
  aan beide einden (het dek binnen 3,5 m van het eind dicht tot de
  onderkant). Pylonen, kolommen, trappen en landhoofden staan op dezelfde
  onderkant, 1 m onder de waterspiegel.

Wegdelen met PDOK-attributen: de bovenste 0,5 m van dek en trappen is per
BGT-functie een eigen `road:`-node met de attributen van de actuele
BGT-wegdelen in `extras.attributes` (`plus_fysiekvoorkomen` is in de BGT
leeg), zodat de kleurregels van een thema op de brug werken zoals op de
wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | BGT-wegdeel (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- |
| `road:fietspad` | fietspad | gesloten verharding | G0363.293837356f464d01a489f7c71035c6e8, G0363.22cee56329b74430b9bfe89df3082bdd, G0363.c92a17218bbb4651826088d83823545d, G0363.db10d2efe3a1472ebffe565c6b2e81da, G0363.5f2a1d53d8984df49d22231296ae9912, G0363.97c496fd01034b5892ec0694e0a37dd1 (relatieve hoogteligging 2) | het hele fietsdek van het begin van de lus tot het eind van de noordelijke helling |
| `road:voetpad` | voetpad | gesloten verharding | G0363.6bd66cf0451f48bb8f97459403714dc5, G0363.f5857352a3584beba30b8dbff75a4609 (2) | het voetpad naast het fietspad in het midden en het voetdek tot over de rug van de trappen (x = -105,1 tot 105,2) |
| `road:voetpad-op-trap-zuid` | voetpad op trap | open verharding | G0363.b1cf75f04eb84fa6ac4668157c41b8c2, G0363.d579833168d6434caf84540f71523788 (1) | de twee trapgoten van de zuidelijke trap, binnen de BGT-contour |
| `road:voetpad-op-trap-noord` | voetpad op trap | gesloten verharding | G0363.d944871e1996401e9a71f1c036f795eb, G0363.5e219ae571ce4fb9aef8662655689ca0 (1) | de twee trapgoten van de noordelijke trap |

De twee trappen zijn aparte nodes omdat de BGT ze een ander fysiek voorkomen
geeft. De BGT-contouren zijn vereenvoudigd tot 5 cm; het voetpad is het
BGT-voetpad min het fietspad (geen overlap). De laag is een snijstrook binnen
de BGT-contour van 0,5 m onder tot 1 m boven het wegdek (dezelfde
hoogtefunctie als het dek); het hangerscherm, de tuien en de pylonen blijven
met 2 cm marge constructie, de trapstrook blijft 2 cm binnen de wanden van de
trapgoot en volgt de trapvloer. De volumes tellen op tot die van de brug als
geheel (constructie 5090 m³, fietspad 1448 m³, voetpad 272 m³, de trappen 4 en
4 m³, samen 6818 m³). Verticale stralen over het hele dek (30000 punten,
`zfight.py`) vinden geen samenvallende bovenvlakken tussen de onderdelen;
alleen één punt in de constructie op de scherpe rand waar de top van een
opening het schuine hangerscherm snijdt. De STL is ongewijzigd: het hele
brugmodel in één stuk.

Wat er niet in zit: het hekwerk langs dek en trappen (open gaas tussen
staanders, dunner dan 0,9 m), de lantaarns, de oren van de hangers onder de
dekrand, het knooppunt met het ronde gat onder de splitsing, de kabel zelf
(circa 0,15 m) en de hangers (circa 0,05 m), die het scherm met openingen zijn,
en de treden (0,17 m; de trap is een helling). De ovale trap is in het echt
een open stalen kooi; hier is het een gesloten blok met een rug onder het
voetdek en twee dalende trapgoten.

Pasvorm op het AHN: in de hoofdoverspanning, waar het DSM boven het water
schoon is, volgt het wegdek de mediaan op de as binnen 0,05 m (10,50 tegen
10,49 m op x = -72, 9,89 tegen 9,84 m op x = 86), het eerste stuk van de lus
binnen 0,05 m (3,94 tegen 3,90 m op s = 50). Op de rest van de lus en de
noordelijke helling geeft het DSM een onrustig beeld (veel cellen 2 tot 4 m
onder het dek, door het open hekwerk en het groen eronder); daar volgt het
model rechte hellingen door de bovenste DSM-cellen, die 0,0 tot 0,5 m onder
het model liggen. De kabel ligt binnen 0,4 m van de DSM-punten op de kabel
(x = 0 tot ±26 en ±62 tot ±80), in plattegrond binnen 0,3 m. De pylontop op
+35,8 m ligt boven het hoogste DSM-punt (+34,8 m, de buis is te dun voor een
volle cel).

Printbaarheid op 1:1000: het dek zweeft 9 tot 12 m boven het kanaal en de
oevers en hangt aan het scherm, dus zonder steun is het niet te printen. Het
hangerscherm staat op het dek en loopt in de vlakken van de hangers hooguit 21
graden uit het lood; de openingen hebben een spitse top van 55 graden, de
kabelband draagt zichzelf. De tuien lopen onder 47,7 en 50,4 graden (de
fietsdektui is daarvoor 4,6 m naar de pylon geschoven); pylonen (1,0 tot
1,8 m), kolommen (0,91 m), trapwangen (0,9 m) en de rug van de trap zijn dik
genoeg. Alleen de onderkant van dek (4218 m²), de voet van scherm en tuien in
het dek hangen over; in de printversie met voet blijven alleen de randen van
0,8 m naast de kern over (1445 m², op 1:2500 een richel van 0,3 mm). In de
printcontrole gaat het model met overhangopvulling door: hele model (uitsnede
560 m, op 1:1400 omdat 1:1000 niet in 400 mm past) status NoError voor alle
onderdelen, constructie 13,3 naar 6,1 cm³ (-54 % tegen de verticale
opvulling), fietspad, voetpad en trappen zonder eigen opvulling (`extraPct`
0,2, 0,3, 0 en 0), 21,6 s; de hoofdoverspanning op 1:1000 (uitsnede 270 m)
idem, constructie 19,5 naar 10,3 cm³ (-47 %). Onder dek, lus en helling komt
een wig met een smal scherm tot de onderplaat; de openingen in het
hangerscherm blijven open. De STL op 1:2500 heeft dezelfde soort printvoet
(wig van 50 graden vanaf de kern en een scherm van 0,9 m onder de fietsas en
de losse stukken voetdek); op die schaal zijn scherm, tuien en kolommen 0,36
tot 0,38 mm, dus alleen geschikt voor een fijne nozzle. PDOK tekent de
BGT-wegdelen van de brug als een vlakke weg op het maaiveld en over het water;
die strook blijft onder de brug zichtbaar.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Nesciobrug) (2006,
ontwerp WilkinsonEyre, hangbrug voor fietsers en voetgangers over het
Amsterdam-Rijnkanaal; volgens de beschrijvingen op Commons een
hoofdoverspanning van 168 m, een totale lengte van circa 790 m en een
fietspad van 3,5 m met een voetpad van 1,5 m), PDOK BGT (wegdeel: fietspad,
voetpad en voetpad op trap op de brug; overbruggingsdeel: pylon, kolommen,
steunpunten), PDOK AHN (dsm en dtm 0,5 m via WCS: lengteprofiel van fiets- en
voetdek, dekranden, hoofdkabel, pylontoppen, maaiveld), de PDOK-luchtfoto
(pylonvoeten, richting van de tuien, ovale trappen) en Wikimedia
Commons-foto's (Nesciobrug 2.jpg, Nesciobrug 3.jpg, Nesciobrug 4.jpg,
Nesciobrug Amsterdam 2017 1.jpg en 2.jpg, Nesciobrug - panoramio.jpg,
Nesciobrug north ramp.JPG en andere) voor de opbouw: één kabelvlak, hangers
aan de buitenrand van het fietsdek, de splitsing van het voetpad, de trappen,
het kokerdek met afgeronde onderkant en de kolommen.
Geschat zijn de pylondiameter in de top (1,0 m) en de pylonhoogte (+35,8 m),
de hangerafstand (6,96 m, op foto's geteld), de dikte van het kokerdek (rand
0,6 m, kern 1,2 m), de vorm van de trappen (ovaal rond de BGT-trapdelen,
helling 33 graden, rug onder het voetdek), het dekprofiel op de lus na het
eerste bordes en op de noordelijke helling (rechte hellingen door de bovenste
DSM-cellen), de verkanting van het voetdek, de ligging van de tuien op het
dek en de landhoofden; kabel, hangers en tuien zijn veel dikker dan in
werkelijkheid.

Licentie van het model: eigen werk op basis van open bronnen.
