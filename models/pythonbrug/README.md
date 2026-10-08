# Pythonbrug (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `pythonbrug.glb` | Catalogusbron in meters: node `road:voetpad` (de bovenste 0,5 m van het looppad, met BGT-attributen) en node `building:pythonbrug` met de rest: de trog van twee liggers, de poer en de twee landhoofden |
| `pythonbrug-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder de overspanningen, met de onderkant (0,8 m onder de waterspiegel) op het printbed (94 × 10 × 13 mm) |
| `pythonbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (125151,08, 487327,5), in het
midden van de as van het BGT-dek, op de waterspiegel van het Spoorwegbassin
(NAP -0,4 m) en de glTF-conventie Y omhoog. +X loopt langs de brug naar de
Panamakade op Sporenburg (`xAxis` (-0,17219, 0,98506), 99,9 graden linksom
vanaf het oosten, dus naar het noordnoordwesten), +Y naar het
westzuidwesten. De lage boog met de poer ligt aan de zuidkant bij de
Stuurmankade op Borneo, de hoge boog aan de noordkant. Het maaiveld wordt op
zes punten op het water naast de brug bemonsterd (`groundSamplePoints`, 10 m
naast de as, 15, 45 en 75 m van de zuidkade). Het PDOK-terrein legt het water
op circa NAP 0,0 m, 0,4 m boven de echte waterspiegel; `groundOffsetMetres`
-0,4 zet de waterspiegel van het model daarom terug op NAP -0,4 m, zodat de
uiteinden van het looppad op de kades (NAP +1,45 m) aansluiten. De
Pythonbrug is geen BAG-pand en vervangt dus niets.

Onderdelen in het model (hoogtes in NAP):

- Het looppad over 91,5 m van kade tot kade (BGT; 93 m volgens de bron),
  volgens het AHN-DSM om de 2 m: van +1,55 m aan de Stuurmankade in 10 m
  omhoog naar een lage boog van +4,7 tot +4,9 m boven de poer, dan omhoog
  naar de top van +10,4 m op 52 m van de zuidkade (x = 6) en in 40 m terug
  naar +1,5 m aan de Panamakade.
- De trog: twee liggers met de balustrade 1,1 m boven het looppad (AHN) en
  de onderrand 1,3 m eronder (doorvaarthoogte 9,5 m onder de top: onderrand
  op +9,1 m), die naar boven 0,6 m uitwaaieren; breedte over de balustraden
  4,2 m aan de kades en 5 m in het midden (AHN), het looppad ertussen 2 tot
  2,8 m breed. De onderrand buigt bij de poer en de landhoofden af tot op het
  beton, zoals op de foto's.
- De ovale poer van 9,6 × 4,6 m dwars op de brug, 26 m van de zuidkade
  (BGT), met de bovenkant op +0,2 m (AHN).
- Twee landhoofden aan de kades (BGT, 6 tot 6,6 m breed) tot net onder het
  kadeniveau (+1,35 m).
- Het looppad als eigen node `road:voetpad` met in `extras.attributes`
  `bgt_functie` `voetpad op trap` en `bgt_fysiekvoorkomen` `gesloten
  verharding` (geen plus-fysiek voorkomen in de BGT), zodat de kleurregels
  van een thema er net zo op werken als op de PDOK-wegdelen ernaast. Bron:
  het enige actuele BGT-wegdeel op het dek (relatieve hoogteligging 1),
  `G0363.ea9911faf7f643fbb1a0f44a50ccc507`, van kade tot kade (x = -45,8 tot
  45,7), vereenvoudigd tot 5 cm; de oudere versies en de losse treden van
  vóór 2019 zijn beëindigd. De laag is de bovenste 0,5 m van het looppad
  tussen de wanden, met verticale zijkanten 3 cm binnen de voet van de
  wanden; de wanden gaan er 2 cm groter uit. `building:pythonbrug` is de
  rest van het kunstwerk (brug − strook); de volumes tellen op tot de brug
  als geheel (937,9 m³: 821 + 117 m³). Geen samenvallende bovenvlakken
  tussen de nodes (verticale stralen over het dek).

Binnen de voetafdruk van de trog ligt 96 % van de DSM-cellen binnen 2 m van
het model (86 % binnen 1 m, mediaan +0,03 m, mediaan absoluut 0,08 m). De
lantaarns (‘vogels’ op hoge masten aan de westkant) zijn weggelaten; het AHN
ziet ze tot circa 2 m boven de balustrade.

Printbaarheid op 1:1000: het vakwerk is een dichte wand van 0,9 m (boven)
tot 1,1 m (op het looppad), zodat de trog met een groef van 2 tot 2,8 mm
breed en 1,1 mm diep herkenbaar blijft; de wanden waaieren onder circa 15 graden
uit en de binnenkant hangt niet over. Alleen de onderrand van de trog hangt
vrij (307 m²); de overspanningen van 26 en 62 m zijn zonder steun niet te
printen. Het script controleert dat alleen de onderrand naar beneden wijst,
dat alles op dezelfde onderkant begint en dat de printversie geen overhang
heeft. In de export gaat het model als gesloten solid met overhangopvulling
door: onder de onderrand komt een wig die in een smal scherm tot de
onderplaat uitloopt, zodat de brug van opzij een dichte golvende wand wordt
met de trog erbovenop. Dat is voor een vrij overspannende voetbrug niet te
vermijden en houdt het silhouet (lage boog, poer, hoge boog) leesbaar. Een
uitsnede van 160 m op 1:1000 duurt circa 2 seconden met de PDOK-tegels in de
cache. In de printcheck op 1:1000 (uitsnede van 123 m, 2,5 s) gaat de
constructie van 0,83 naar 1,54 cm³ en krijgt het looppad geen eigen
opvulling (0,12 cm³, +0 %); samen 0,94 naar 1,66 cm³, net als het model in
één stuk. De STL heeft dezelfde printvoet (wig van 50
graden en een scherm van 0,9 m). Het PDOK-terrein ligt op het water onder de
brug mediaan 0,4 m boven de waterspiegel van het model (de poer steekt er
0,2 m bovenuit) en op de kades circa 0,1 m onder de uiteinden van het
looppad; de landhoofden zitten net onder het kadeniveau.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Pythonbrug) (brug 1998,
Hoge Brug, West 8, 2001, lengte 93 m, doorvaarthoogte 9,5 m, vakwerk van
stalen T-profielen op twee betonnen poeren en landhoofden), PDOK BGT
(overbruggingsdeel: dek, poer, landhoofden; wegdeel
G0363.ea9911faf7f643fbb1a0f44a50ccc507 voor het looppad), PDOK AHN (dsm en dtm 0,5 m via
WCS: looppad, balustraden, poer, kades) en Wikimedia Commons-foto's
(Pythonbrug, Amsterdam.jpg; 2021 Brug 1998 Pythonbrug, Asd (1).jpg;
Pythonbrug.JPG) voor de uitwaaierende vakwerkwanden en de onderrand die naar
de poer afbuigt. Geschat zijn de diepte van de liggers onder het looppad
(uit de doorvaarthoogte), de vorm van de onderrand bij de poer en de
landhoofden, de helling van de wanden en de hoogte van de landhoofden; het
vakwerk is dicht, het looppad is een helling zonder treden, de breedte over
de balustraden verloopt geleidelijk van de kades naar het midden en de
lantaarns zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
