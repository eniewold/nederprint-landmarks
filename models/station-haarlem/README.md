# Station Haarlem

Margadants entreegebouwen en het samengestelde kapcomplex, op de gehele
contour van BAG **0392100000039313**. De moderne Kennemerpleinbouw
0392100000037572 blijft een zelfstandig PDOK-pand.

## Maten en bronnen

- RD-oorsprong 104057, 489144; spooras `[.985,-.173]`, Stationsplein naar -Y.
- Maaiveld NAP +1,20 m uit het AHN-DTM van het Stationsplein; spoorvloeren
  liggen hoger. Alle onderstaande hoogtes zijn ten opzichte van dit maaiveld.
- Zuidkap west 23,63 m en oost 20,93 m; noordkap west 21,65 m en oost
  18,95 m. Dwarsprofielen gemeten als P90 per meter over afzonderlijke
  blokken van 20 m in AHN-DSM 0,5 m. De sprong ligt bij lokaal X=-60 m.
- BAG en PDOK Actueel_orthoHR: bbox 103760,489050,104360,489310,
  geraadpleegd 2026-10-09. Afzonderlijke kapuitlopers volgen de BAG-contour.
- [RCE 19786](https://monumentenregister.cultureelerfgoed.nl/monumenten/19786),
  [entree schuin](https://commons.wikimedia.org/wiki/File:Haarlem_station_buiten.jpg),
  [entree frontaal](https://commons.wikimedia.org/wiki/File:Haarlem_Central_Station_(1).jpg),
  [complex schuin van boven](https://commons.wikimedia.org/wiki/File:StationHaarlem-APR2018.jpg),
  [lange gevel](https://commons.wikimedia.org/wiki/File:Achterzijde_-_Haarlem_-_20095942_-_RCE.jpg),
  [perrongebouw](https://commons.wikimedia.org/wiki/File:Station_Haarlem_2024_3.jpg).

## Bouw en vereenvoudiging

Vier doorlopende gebogen kapextrusies, een middentonnenkap met westelijke
uitloper, een lage oostelijke uitloper, twee entreegebouwen met schild- en
zadeldaken, trapfrontons, hoekpijlers, dakkapellen en schoorstenen. De
glasgevels, bogen en kapkoppen hebben blinde nissen; een volle kern maakt
de kap steunvrij printbaar. Geen gestapelde DSM-hoogtelagen.

Geschat: glas- en vensterritme, trapfrontons, hoekbekroningen, dakdetails
en de lage smalle oostelijke kap. Railstaal, glasroeden en hekjes onder
0,9 m ontbreken. De grotere westelijke kapvakken zijn afzonderlijk gemeten.

## Controle

Eén gesloten `building:`-node, NoError, 6698 driehoeken, 327045,5 m³;
462,74 × 82,75 × 24,43 m. STL 1:1000 is 462,7 mm lang en vraagt een
grote printer of verdeling; de aanvullende STL 1:2000 is 231,4 mm lang.
Geometrie op **echte schaal 1:1000** door de export-opvulling gecontroleerd:
336048 → 337231 mm³ (+0,4%), NoError, zonder losse steunconstructie.
De volledige uitsnede RD 103760,488940,104360,489540 is als preview en
3MF geëxporteerd op 1:2000 (300 × 300 mm): 3925 objecten, 1139012 driehoeken.

Vier renders (-35°, 55°, 145°, 235°) naast PDOK en schuine foto's bekeken:
aan elke kant verbeteren gebogen dakvlakken, kapkoppen en glasnissen de
blokreconstructie; aan de pleinzijde voegen beide entreegebouwen trapfrontons,
vensters en schoorstenen toe. GLB ook met de echte three.js GLTFLoader bekeken.
De kaartcontrole gebruikt een eigen server op poort 3022; vervangen pand,
oriëntatie, kleur en maaiveld gecontroleerd met de landmarkschakelaar.
Controlebeelden en exports blijven buiten beide repository's.

[Controlekaart](http://localhost:3022/kaart/52.38778/4.63889/600/1x1/0).
Generator: `node scripts/generate-station-haarlem.mjs`, aanvullend `--scale 2000`.
