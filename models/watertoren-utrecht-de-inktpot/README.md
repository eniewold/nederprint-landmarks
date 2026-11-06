# De Inktpot (watertoren) Utrecht

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-utrecht-de-inktpot.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de bouwmassa's zijn de BAG-plattegrond binnen rechthoeken tot hun dakhoogte, borstweringen en lisenen zijn blokken, spaarvelden en vensters uitsparingen (hulls met een plafond onder 50 graden), de UFO is een omwentelingslichaam.

De Inktpot aan het Moreelsepark is Hoofdadministratiegebouw III van de Nederlandse Spoorwegen (1918-1921, G.W. van Heukelom, rijksmonument 46955), het grootste bakstenen gebouw van Nederland en nu het hoofdkantoor van ProRail. In de toren boven de hoofdingang zit de watertoren van 1921 (reservoir 27 m³). Het model vervangt het hele BAG-pand.

Let op: de Kanzo-taak noemde BAG-pand 0344100000042112; dat is Hoofdgebouw II (De Tulpenburgh, 1893-1895) ten noorden ervan. Het pand van De Inktpot met de toren is 0344100000012848 (bouwjaar 1921, 8907 m² grondvlak); alleen dat pand wordt vervangen.

## Bestanden

- `watertoren-utrecht-de-inktpot.glb`: twee nodes, beide op maaiveld (onderkant -0,3 m):
  - `building:watertoren-schacht-pylonen-en-middenveld`: de toren, van het maaiveld door het torenblok tot 61,5 m.
  - `building:inktpot-vleugels-risalieten-torenblok-en-ufo`: de rest van het gebouw met de open binnenplaats, het torenblok en de UFO.
- `watertoren-utrecht-de-inktpot.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-utrecht-de-inktpot-1-1000.stl`: alles samen op 1:1000 (100,5 × 108,2 × 61,8 mm).

## Oorsprong en oriëntatie

RD-oorsprong [136367.28, 455491.55] (52,08738 N, 5,11535 O), op de as van de toren, op het maaiveld (AHN-DTM langs de zij- en achtergevel NAP +2,45). Lokale +X wijst naar de hoofdingang aan het Moreelsepark (RD-richting 28,0 graden, `xAxis` [0.88295, 0.46947]), loodrecht op de gevels; de BAG-gevels liggen binnen 0,1 m evenwijdig. +Y wijst naar het noordwesten. `groundHeight` 45,8 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de drie `groundSamplePoints` op de straat langs de zij- en achtergevel: (-27, 57) 45,88, (-27, -57) 45,80, (-78, 0) 45,86. Voor de hoofdingang ligt PDOK hoger (46,3 à 46,4); daar steekt de stoep boven het maaiveld uit. `groundOffsetMetres` -0,1.

## Opbouw (hoogtes boven maaiveld, NAP +2,45)

- Plattegrond: de BAG-contour met de binnenplaats als gat. De steunberen staan in de BAG 1,7 m (buiten) of 1,04 m (binnenplaats) voor de gevel; in het model verjongen ze tot 1,1 m vanaf 7 m en tot 0,5 m vanaf 12 m. De gevellijn zelf is de BAG-contour na een opening van 0,5 m.
- Vleugels rond de binnenplaats: plat dak op 22,7 m, borstwering aan de buitengevel tot 24,25 m, kilgoot van 2,5 m breed en 0,6 m diep midden over de vleugeldaken (AHN-DSM).
- Middenrisalieten: zijgevels 27,15 m (borstwering 28,55, trappenhuis 29,85 en 29,7 m), achtergevel 29,45 m (30,65), voorgevel 29,7 m (30,95), zijdelen naast het torenblok 28,65 m (30,95).
- Binnenplaats open; daarin de hal op 8,95 m met een lantaarn tot 10,9 m en lage verbindingen (3,75 à 3,85 m), zoals in AHN en 3D BAG.
- Gevels: tussen de steunberen spaarvelden van 0,3 m diep tot 2,2 m onder het dak, met per verdieping (3,0 tot 37,2 m in stappen van 4,4 m) een venstergroep van één tot drie vensters, nog 0,25 m dieper. Boven de lagere daken eigen lisenen van 0,9 m.
- Hoofdingang: stoep met bordes (3,15 m) en vier treden naar het Moreelsepark, drie ingangen in verdiepende nissen in het voorrisaliet; achteringang op 3,8 m achter een borstwering.
- Torenblok: tot 41,6 m met borstwering tot 42,85 m, twee vensterverdiepingen (31,0 tot 38,8 m) en hoekpenanten aan de voorkant.
- Toren: schacht 9,3 × 6,0 m (AHN-DSM) tot 60,0 m met borstwering tot 60,95 m, twee pylonen opzij (3,8 m breed, 1,4 m uit de schacht) tot 61,5 m (NAP +63,95; 3D BAG 63,91). In de voor- en achtergevel een verdiept middenveld met drie spleten en bovenin vier nissen, in de pylonen twee spleten.
- UFO 'Zover' (Marc Ruygrok, 2000): schotel van 12 m, rand 44,15 tot 44,65 m, top 46,62 m, half over de voor- en noordwestgevel van het torenblok (3D BAG-dakvlakken van de schotel).

## Wat geschat is

- De hoogte van de toren: Wikipedia noemt 60 m; het AHN-DSM geeft de pylonen op NAP +63,95, dus 61,5 m boven maaiveld; de schacht zelf op 60,0 m.
- Verdiepingshoogtes en vensterverdeling (venstergroepen per verdieping, 3,4 m hoog, 1,0 m tussenruimte) naar de foto's van de RCE; het aantal vensters per veld is niet per travee nagemeten.
- Diepte van spaarvelden en vensters (0,3 en 0,25 m) en de verjonging van de steunberen (7 en 12 m) naar de foto's.
- De spleten en nissen in de toren naar de foto's.
- De UFO: de onderkant is een kegel van 48 graden waarvan de punt in het torenblok ligt, zodat hij zonder steun print; in werkelijkheid is de schotel vlakker en staat hij op een poot. Daarvoor staat de as 0,6 m achter de gemeten plek (x 9,3 in plaats van 9,9).

## Wat weggelaten is

- Afzonderlijke vensters, kozijnen en beeldhouwwerk; de ramen zijn venstergroepen per verdieping.
- Dakopbouwen kleiner dan 0,9 m, installaties en hekwerken op de daken.
- De poot van de UFO (zie boven).
- Hoofdgebouw I en II en de andere panden van het complex: die blijven de PDOK-reconstructie.

## Printbaarheid

Op 1:1000 zijn alle delen ten minste 0,9 m. Overhangen zijn hooguit 45 graden: plafonds van spaarvelden, vensters en nissen 50 graden of steiler, de onderkant van de UFO 48 graden. Een preview-export (createModelBundle, 1:1000, ondersteuning v2, 45 graden) geeft hetzelfde volume als zonder ondersteuning: er komt geen steun bij.

## Bronnen

- https://nl.wikipedia.org/wiki/De_Inktpot (1918-1921, G.W. van Heukelom, watertoren 1921 met reservoir van 27 m³, UFO van Marc Ruygrok, 12 m)
- https://monumentenregister.cultureelerfgoed.nl/monumenten/46955 (vijf bouwlagen, binnenplaats, middenrisalieten, steunberen, spaarvelden, toren boven de hoofdingang)
- Wikimedia Commons, RCE-foto's 20235288, 20235289, 20235292, 20235293 (gevels, steunberen, spaarvelden, toren) en 20350262 (UFO op het torenblok)
- Wikimedia Commons, NIMH 2011-3666, luchtfoto van Utrecht uit de bouwtijd (binnenplaats en daken)
- PDOK: BAG-pand 0344100000012848, AHN DSM/DTM 0,5 m en luchtfoto, opgehaald 2026-11-06
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0344100000012848, LoD2.2-dakvlakken als controle, opgehaald 2026-11-06
