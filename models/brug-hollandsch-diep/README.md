# Brug Hollandsch Diep (Moerdijk)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `brug-hollandsch-diep.glb` | Catalogusbron in meters, twee nodes: `road:spoor`, de bovenste 0,5 m van het dek tussen de kabelgoten met in `extras.attributes` `bgt_functie` `spoorbaan` en `bgt_fysiekvoorkomen` `gesloten verharding` (BGT-wegdelen `L0004.14b0a8e412104aa1980f017b714a3ce0` en `L0004.7ba3aa82e68245efa6d327db98f11f12`); en `building:brug-hollandsch-diep` met de rest: het rivierdeel (stalen kokerligger op elf Y-pijlers), de twee overgangspijlers, de twee betonnen aanlandingsviaducten met hun kolommen, de kabelgoten en de landhoofden |
| `brug-hollandsch-diep-1-5000.stl` | De brug in één stuk op 1:5000 met een printvoet onder het dek en de schoorpoten, met de onderkant (0,8 m onder de waterspiegel) op het printbed (382 × 4,2 × 4,9 mm; `--scale 2500` geeft 763 mm) |
| `brug-hollandsch-diep.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, hoofdmaten en bronnen |

Dit is de spoorbrug van de HSL-Zuid (Benthem Crouwel, gebouwd 2000-2004,
geopend 2005), enkele tientallen meters ten westen van de oude
Moerdijkspoorbrug. Het Wikipedia-artikel "Brug Hollandsch Diep" (HSL-brug, koker op
Y-pijlers) gaat alleen over deze brug; de oude
Moerdijkspoorbrug en de A16-brug ernaast hebben eigen artikelen en zitten
niet in het model. De controle-URL valt op de middelste rivierpijler, op
1,4 m van de oorsprong.

De GLB is in meters met de oorsprong op RD (103640,90, 414712,68), op de as
van de brug in het hart van de middelste (zesde) rivierpijler, op de
waterspiegel van het Hollandsch Diep (NAP +0,2 m, PDOK-terrein) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar het noordnoordwesten,
naar Willemsdorp (`xAxis` (-0,36933, 0,9293), 111,67 graden linksom vanaf het
oosten), +Y stroomafwaarts naar het westzuidwesten. Het zuidelijke landhoofd
bij Moerdijk ligt op x = -950 tot -945, de overgangspijlers tussen rivierdeel
en aanlandingsviaducten op x = -603,1 en 604,1, het noordelijke landhoofd bij
Willemsdorp op x = 953,4 tot 958,4. Het model houdt op waar de BGT het dek
laat eindigen: daar ligt het spoor op een talud (NAP +9,0 m bij Moerdijk,
+5,9 m bij Willemsdorp, binnen 0,1 m van het AHN-maaiveld ernaast). Het
maaiveld wordt op twaalf punten op het water bemonsterd (`groundSamplePoints`,
20 m naast de as midden tussen de rivierpijlers op x = -472 tot 472,5);
`groundOffsetMetres` is 0, want het PDOK-terrein legt het water binnen
0,05 m op de waterspiegel van het model. `groundHeight` is 43,95
(ellipsoïdisch, de laagste PDOK-waterhoogte op die punten), zodat een
uitsnede die alleen een aanlandingsviaduct raakt het model op de goede hoogte
zet. Geen BAG-pand onder de brug.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 1908 m, 14,9 m breed (BGT 14,7 tot 15 m), met het spoor
  volgens het AHN-DSM om de 10 m: +9,0 m bij Moerdijk, +23,4 m boven de
  middelste pijler en +5,9 m bij Willemsdorp. Een randbalk van 0,8 m aan
  beide zijden en kabelgoten met looppaden op 4,4 tot 5,6 m uit de as,
  0,45 m boven het spoor (AHN). Het noordelijke viaduct buigt in de laatste
  214 m 1,8 m naar het westen af (BGT).
- Het rivierdeel van 1207 m als doorgaande stalen kokerligger (Reusink): de
  lijven staan onder 1:10 en bovenaan 6 m uit elkaar, ook langs de
  schoorpoten; in het veld ligt de onderkant 5,5 m onder het spoor en is
  5,1 m breed. Daarboven de betonplaat met een uitkraging van 4,4 m.
- Elf rivierpijlers op 105 m hart op hart, het eerste veld 104,1 m (BGT,
  Reusink), en eindvelden van 79 m naar de overgangspijlers (BGT; Reusink
  noemt ca. 70 m). Elke pijler heeft een betonnen schacht van 6,0 × 4,6 m op
  de waterlijn (BGT) die naar boven verloopt tot 6,8 × 5,2 m, met de kop
  11,7 m onder het spoor (+11,7 m in het midden, +4,9 m bij de oevers).
- Op elke schacht een stalen hamerstuk van 47 m (Reusink: 46 m): twee
  schoorpoten die vanaf de hamervoet onder circa 17 graden oplopen naar de
  onderkant van de veldligger 23,5 m uit het hart, en daartussen de
  driehoekige Y-opening van 26 m breed onder de steunpuntligger (3,6 m onder
  het spoor) met de punt 9,3 m onder het spoor (+14,1 m in het midden).
- Twee overgangspijlers van 5 × 21,2 m (BGT) tot de onderkant van de
  randbalk, die aan beide zijden 3,2 m naast het dek uitsteken.
- Twee betonnen aanlandingsviaducten van 343 en 350 m: een ligger van 8,4 m
  breed met de onderkant 4,0 m onder het spoor, een gebogen uitkraging (kwart
  ellips) naar de dekrand en boven elke kolom een blinde nis van 1,4 × 1,6 m
  en 0,35 m diep in de zijkant van de ligger. Elk viaduct heeft twaalf
  velden (28,6 en 29,2 m) op kolommen van 6,0 m breed die naar boven
  verlopen van 3,0 tot 4,0 m.
- De landhoofden als blokken tot het spoor.
- Het spoorbed als eigen node `road:spoor`: de bovenste 0,5 m van het dek
  tussen de kabelgoten, 8,76 m breed (|y| tot 4,38 m, 2 cm vrij van de
  goten), van het zuidelijke tot het noordelijke landhoofd (x = -950 tot
  958,4; op de landhoofden 2 cm lager, zoals hun bovenkant), met de
  attributen van de BGT-wegdelen op het dek: `bgt_functie` `spoorbaan`,
  `bgt_fysiekvoorkomen` `gesloten verharding` (geen plus-fysiek voorkomen).
  Op het dek liggen twee actuele BGT-wegdelen met relatieve hoogteligging 1
  over de hele lengte, één per spoor: `L0004.14b0a8e412104aa1980f017b714a3ce0`
  (westelijk spoor, y = 1,0 tot 4,4) en `L0004.7ba3aa82e68245efa6d327db98f11f12`
  (oostelijk spoor, y = -4,5 tot -1,1). Omdat beide dezelfde functie hebben,
  is het hele bed tussen de goten, ook de strook tussen de sporen, één node.
  De kabelgoten, de looppaden erbuiten, de dekranden en alles onder de laag
  blijven constructie; de onderdelen tellen samen op tot het volume van de
  brug (85817 + 8360 m³). De twee BGT-vlakken `voetpad op trap`
  (`L0004.5a7da182ec8d4950bfbf454f2e0b49c9`, `L0004.ac1ccb679ff04d73af733cf4da7e989b`,
  `L0004.651bfe132ab84902987819979f325eef`, `L0004.d951e527532b46769b2a821d5f957c9f`)
  naast de overgangspijlers liggen buiten het dek en zitten niet in het model.

Wat er niet in zit: de oude Moerdijkspoorbrug en de A16-brug, de
bovenleidingmasten van de HSL (met hun gebogen toppen, 0,3 tot 0,5 m dik),
de leuningen en hekken, de werkplatforms met leuningen rond de
pijlerschachten en de sloofbakken onder water. De windschermen die in 2016
werden aangekondigd staan niet in het AHN en niet op recente foto's. Het
talud waarop het spoor aan beide kanten verder loopt is PDOK-terrein.

Binnen de voetafdruk van het dek ligt 97 % van de DSM-cellen binnen 1 m van
de bovenkant van het model (99 % binnen 2 m, mediaan +0,04 m, mediaan
absoluut 0,11 m); over het rivierdeel 98 %, over het zuidelijke viaduct 96 %
en over het noordelijke 97 %. De onderbouw (pijlers, Y, viaducten) ziet het
AHN niet; die komt uit Reusink, de BGT en foto's.

Printbaarheid op 1:1000: de schoorpoten lopen onder circa 17 graden en de
veldliggers en uitkragingen hangen vrij, zoals bij elke balkbrug. Dragende
delen zijn dik genoeg (schachten 4,6 m, schoorpoten 4 tot 5 m, Y-voet
2,4 m, kolommen 3 m); leuningen en masten zijn weggelaten. Het script
controleert dat alles op dezelfde onderkant begint en dat in de printversie
alleen het vlakke plafond van de Y-openingen (een brug van 26 m tussen twee
schoorpoten, 1567 m²) en de uitkraging van het dek naast de hamers
(4623 m², 4,4 m) nog vrij hangen. Met 1908 m past de brug op 1:1000 niet in
één uitsnede. De printcheck op de automatische schaal (uitsnede van 1808 m,
1:4521) is NoError voor beide onderdelen (7,5 s): de constructie van 958 naar
2470 mm³ (+158 %), het spoor 89 naar 90 mm³ (+0,3 %, de opvulling gaat naar
de constructie); in het model van één node was dat 1048 naar 2501 mm³
(+139 %). Op een uitsnede van
400 × 400 m rond de middelste drie pijlers op 1:1000 is hij NoError (34 s, nog met één node;
de printbare opvulling is met 39359 mm³ 15 % kleiner dan de rechte
opvulling van 46356 mm³). In de export komt onder het dek en onder de
schoorpoten een wig met een smal scherm tot de onderplaat; daardoor zie je de
Y op de print vooral als reliëf, en de Y-openingen blijven aan de zijkanten
open maar raken van binnen vanaf beide open einden half gevuld. De STL op
1:5000 heeft dezelfde printvoet (wig van 50 graden en een scherm van 1 mm),
onder de schoorpoten vanaf de onderkant van de poot, zodat de Y-openingen
open blijven. Het PDOK-terrein ligt op het water op de waterspiegel van het
model; naast de aanlandingsviaducten ligt het tot NAP +7,2 m, boven de
onderkant van de ligger in de eerste en laatste 100 tot 150 m, zodat de
viaducten daar met hun onderkant in het terrein lopen. De PDOK-reconstructie
van de brug is een vlakke wegstrook (NAP +0,8 tot +8 m) die onder het dek
blijft liggen; alleen in de laatste 70 m bij Willemsdorp ligt die strook tot
4 m boven het spoor en steekt hij door het model heen (geen BAG-pand, dus
niet te verbergen).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Brug_Hollandsch_Diep)
(lengte 1992 m, breedte 14,2 m, elf pijlers en twee landhoofden, langste
overspanning 105 m, Benthem Crouwel, 2000-2004), J.H. Reusink,
[Spoorbrug over het Hollandsch Diep](https://www.bruggenstichting.nl/images/bruggen2002/sep-HollandschDiep.pdf),
Bruggen 10 (2002) nr. 3 (doorgaande staal-betonligger, 10 velden van ca.
105 m en twee eindvelden, veldsecties van 59 m en hamerstukken van 46 m,
lijven onder 1:10 en 6 m uit elkaar, staalhoogte 4,5 m in het veld en ca.
2,5 m boven de schoorpoten, schoorpoten met een verlopende doorsnede,
pijlerkoppen die het alignement volgen), [Benthem Crouwel](https://benthemcrouwel.com/projects/bridge-hst)
(foto's van de Y-pijlers), PDOK BGT (overbruggingsdeel: dek, rivierpijlers,
overgangspijlers), PDOK AHN (dsm 0,5 m via WCS: spoorniveau en
dwarsprofiel), PDOK-terrein (waterspiegel) en Wikimedia Commons-foto's
(Brug Hollandsch Diep.jpg; Thalys op de Moerdijk.jpg; Intercity Direct train
Moerdijkbrug.jpg; Thalys train Moerdijkbrug.jpg; Moerdijkbrug Thalys THA 9364
naar Paris Nord (18282382411).jpg; Nederland Moerdijk 8 januari 2003
ID297071.jpg; Moerdijkbruggen bij Willemsdorp.jpg; Moerdijk Slow meets fast
(46954209694).jpg) voor de schachten, de Y en de aanlandingsviaducten.
Geschat zijn de hoogte van de pijlerkoppen (11,7 m onder het spoor), de punt
van de Y-opening (9,3 m), de onderkant van de steunpuntligger (3,6 m) en van
de veldligger (5,5 m onder het spoor), de breedte van de Y-opening (26 m),
de verloop van de schachten, de hoogte van de overgangspijlers, en de
doorsnede, de nissen en de kolomafstand (twaalf velden van circa 29 m) van de
aanlandingsviaducten; de waterspiegel is de PDOK-waarde van NAP +0,2 m.

Licentie van het model: eigen werk op basis van open bronnen.
