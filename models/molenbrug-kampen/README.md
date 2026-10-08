# Molenbrug (Kampen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `molenbrug-kampen.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:rijbaan-lokaal` (de bovenste 0,5 m van het dek tussen de verhoogde stroken, met de attributen van het BGT-wegdeel in `extras.attributes`: `bgt_functie` `rijbaan regionale weg` voor de twee rijstroken van de N764 en `rijbaan lokale weg` voor de parallelweg, beide `bgt_fysiekvoorkomen` `gesloten verharding` en `plus_fysiekvoorkomen` `asfalt`; zo werken de kleurregels van een thema op het brugdek) en `building:molenbrug-kampen` met de kokerligger, de verhoogde stroken, twee H-pylonen met dwarsregel en schoren, vier tuivlakken per pyloon, vijf kolompijlers en twee landhoofden |
| `molenbrug-kampen-1-2000.stl` | De brug in één stuk op 1:2000 met een printvoet onder het dek, met de onderkant (NAP -0,7 m) op het printbed (315 × 13 × 29 mm) |
| `molenbrug-kampen.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (191971,79, 506178,92) (WGS84
52,54200 N, 5,93219 O), op de as van het BGT-dek midden tussen de twee
pylonen, op de waterspiegel van de IJssel zoals het PDOK-terrein die legt
(z = 0 is NAP +0,10 m; het PDOK-terrein legt de IJssel op 42,70 m
ellipsoïdisch, het verschil NAP-ellipsoïde is daar 42,61 m) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar het noordoosten, naar
IJsselmuiden (`xAxis` (0,6932, 0,72075), 46,12 graden linksom vanaf het
oosten, uit de evenwijdige randen van het BGT-overbruggingsdeel), +Y naar het
noordwesten (stroomafwaarts). Het dek loopt van het landhoofd aan de Kamper
kant op x = -238,2 tot dat bij IJsselmuiden op x = 392,4 (BGT), de pylonen
staan op x = ±96,8. Het maaiveld wordt op achttien punten bemonsterd
(`groundSamplePoints`): 20 m aan beide kanten van de as op x = -170, -100,
-40, 10, 60, 120, 200, 280 en 350 (uiterwaarden, bij de pylonen en op de
IJssel). `groundOffsetMetres` is 0; omdat de brug 631 m lang is, staat de
laagste PDOK-hoogte op die punten (42,70 m ellipsoïdisch, de IJssel) ook als
vaste terugval in `groundHeight`, zodat een uitsnede die alleen een aanbrug
raakt het model niet laat wegvallen. De onderkant ligt op NAP -0,7 m, net
onder de waterspiegel. `replacesBuildings` bevat
`NL.IMBAG.Pand.0166100000032251` (2016, 4,2 × 7,1 m), dat onder het dek op de
plek van de pijler aan de Kamper kant ligt. Andere PDOK-panden raken het
model niet.

De brug (1983, ontwerp Stahlton AG) draagt de N764 tussen Kampen en
IJsselmuiden en heet in de volksmond "de nieuwe brug"; de naam komt van de
molen D' Olde Zwarver ernaast. Het is een tuibrug: een
betonnen kokerligger aan twee H-pylonen met tuien in harpvorm langs beide
randen van het dek.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek volgens het AHN-DSM om de 4 m (40e percentiel op de rijbanen,
  bij de pylonen lineair): +11,8 m bij het landhoofd aan de Kamper kant,
  +14,6 m tussen de pylonen en +8,6 m bij IJsselmuiden.
- De kokerligger van 19,8 m breed (BGT) over de hele lengte: randen van
  0,9 m dik, een schuine onderkant van de uitkraging naar een bodem van 11 m
  breed, 3,0 m onder het wegdek.
- Verhoogde stroken van 0,5 m langs beide randen en als middenberm tussen
  de parallelweg en de N764 (y = -2,9 tot -0,7, BGT), in plaats van de
  leuningen en geleiderails.
- De rijbaan van de N764 (twee rijstroken, y = -0,7 tot 7,0) en de
  parallelweg aan de zuidoostkant (y = -7,6 tot -2,9) als eigen
  `road:`-nodes, de bovenste 0,5 m van het dek tussen de verhoogde stroken.
- Twee H-pylonen, elk twee vierkante kolommen 10,95 m naast de as (AHN),
  boven het dek 2,5 m langs de as en 2,2 m dwars, met een schuine top op
  +57,25 m aan de kant van de hoofdoverspanning en 1 m lager aan de kant van
  de zijoverspanning; onder het dek verbreed tot 3,4 × 2,8 m met een schuine
  kraag naar het slanke deel en een voet van 4,4 × 3,8 m tot +1,5 m.
  Hoofdoverspanning 193,6 m (AHN; Wikipedia 193,50 m).
- De dwarsregel tussen de kolommen (bovenkant +43,7 m, 1,3 m hoog, 1,9 m
  langs de as) die aan beide einden in een schoor omhoog (tot +46,4 m) en een
  schoor omlaag (tot +40,9 m) naar de kolom splitst, zoals op de foto's.
  Eronder een 0,35 m verdiept vlak van 1,2 m dik met een spitse onderkant van
  50 graden vanaf de kolommen (top +30,2 m), zodat de regel niet vrij boven
  het dek hangt.
- Per kolom zes tuien naar de hoofd- en zes naar de zijoverspanning in
  harpvorm (foto's): ankers in de kolom van +22,6 tot +51,7 m om de 5,82 m,
  voeten op de randstrook van het dek van 9 tot 51,5 m van de pyloon om de
  8,5 m. Elk tuivlak is een plaat van 0,9 m met de tuien als ribben van
  1,0 m die 0,3 m uitsteken en daartussen 23 tot 24 doorgaande driehoekige
  openingen (verticale zijde aan de kant van de pyloon, bovenzijde van
  55 graden). Het tuivlak loopt van 9,15 m naast de as op het dek naar
  10,6 m bij het bovenste anker.
- Vijf kolompijlers onder de aanbruggen (luchtfoto, de Kamper pijler op het
  BAG-pand): x = -188,2 aan de Kamper kant en 188,9, 239,9, 291,4 en 342,4 bij
  IJsselmuiden, kolommen van 3,6 × 7,0 m met een kop die over 2 m verbreedt
  tot 4,2 × 10 m onder de bodem van de ligger.
- Twee massieve landhoofden van 6 m aan de uiteinden van het dek.

Wat er niet in zit: de echte tuien van circa 0,2 m (vervangen door de
tuivlakken met ribben en openingen), leuningen, geleiderails, lantaarns en
verkeersborden (dunner dan 0,9 m), de ankerkoppen op de kolommen (kleiner dan
0,9 m) en de dilatatievoegen (vlak in het wegdek).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke grijze wegstrook op dekhoogte met losse spijlen waar de tuien en de
dwarsregel in de puntenwolk zaten, zonder pylonen, pijlers of ligger. Het
model heeft van noordwest en zuidoost (325 en 145 graden) de twee pylonen met
de harp van tuivlakken, de kolompijlers onder de aanbruggen en de
kokerligger met zijn schuine onderkant; van noordoost en zuidwest (55 en
235 graden) de H-vorm met de dwarsregel en de schoren, de verbrede
kolomvoeten naast het dek en de tuivlakken achter elkaar; van alle kanten de
middenberm tussen de N764 en de parallelweg en de verhoogde randstroken.

Pasvorm op het AHN: op de rijbanen buiten 60 m van de pylonen ligt 96,9 % van
de DSM-cellen binnen 1 m van het wegdek van het model (18 144 cellen, mediaan
+0,01 m; de rest zijn auto's en lantaarns). De hoogste DSM-cel op de vier
kolommen ligt op +57,08 tot +57,28 m tegen +57,25 m in het model. De
dwarsregel staat in het DSM bij de pyloon aan de IJsselmuider kant op
+43,58 m (model +43,7 m); bij de Kamper pyloon ziet het AHN maar +42,2 m.

Printbaarheid op 1:1000: de tuien zijn te dun en hangen te flauw. De
tuivlakken zijn dichte platen van 0,9 m met ribben van 1,0 m; elke opening
heeft een bovenzijde van 55 graden, zodat boven het dek geen vlak flauwer dan
50 graden vrij hangt. De dwarsregel rust op het verdiepte vlak met de spitse
onderkant. Alleen de onderkant van het dek en de pijlerkoppen hangen vrij
(12 632 m²); het script controleert dat er boven het wegdek niets vrij hangt
en dat alles op dezelfde onderkant begint. Printcheck op 1:1000 in een
uitsnede van 400 m: status NoError voor alle drie onderdelen, 103,2 naar
72,5 cm³ (de printbare opvulling is 30 % minder dan de rechte opvulling tot
de onderplaat), de `road:`-onderdelen zonder eigen opvulling (`extraPct` 0),
10,5 s. De hele brug past niet in 400 mm: in een uitsnede van 499 m (1:1247)
gaat het model ook als gesloten solid door (status NoError, 57,1 naar
45,4 cm³, 11,7 s). De STL op 1:2000 heeft dezelfde printvoet onder het dek
(wig van 50 graden en een scherm van 0,8 mm); op die schaal zijn de
tuivlakken 0,45 mm en de ribben 0,5 mm, dus te dun om los te printen: print
de pylonen met de export op 1:1000. Z-fighting-controle (30 000 verticale
stralen over het dek): geen samenvallende vlakken tussen de onderdelen en
geen vlak zonder dikte.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Molenbrug_(Kampen))
(1983, Stahlton AG, hoofdoverspanning 193,50 m, pylonen van 57 m, dek 19,40 m
breed), PDOK BGT (overbruggingsdeel: dekranden en landhoofden; wegdeel:
P0023.9bf579d393d04ceca7ca2243659a860e en
P0023.e835b40aa4674bdeb6b86a102e7d6c4f, rijbaan regionale weg, en
P0023.51b102d581b14a1fa8325ca8ddfbc684, rijbaan lokale weg), PDOK BAG (pand
0166100000032251), PDOK AHN (dsm en dtm 0,5 m via WCS: wegdek, kolommen,
dwarsregel), de PDOK-luchtfoto (pijlers, rijstroken) en het PDOK-terrein
(waterspiegel), en de Wikimedia Commons-foto's Kampen, Molenbrug.
28-02-2022. (actm.) 01 tot en met 08.jpg (pylonen, dwarsregel met schoren,
tuien, pijlers), Molenbrug bridge Kampen 2019.jpg (en 2 en 3), Wobbly bridge,
Kampen, Overijssel.jpg, 20150909 Molenbrug1 tot en met 4 over de IJssel bij
Kampen.jpg en Molenbrug, Kampen.jpg. Geschat zijn de plaats van de tuivoeten
op het dek (gelijke steek van 8,5 m uit de foto's), de doorsnede van de
kokerligger (3,0 m diep, bodem 11 m), de maten van de dwarsregel langs de as
(1,9 m) en van de schoren, het verbrede onderste deel en de voet van de
kolommen, de doorsnede van de pijlers en hun koppen, en de lengte van de
landhoofden (6 m).

Licentie van het model: eigen werk op basis van open bronnen.
