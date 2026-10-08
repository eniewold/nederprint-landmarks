# Blauwbrug (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `blauwbrug.glb` | Catalogusbron in meters: nodes `building:blauwbrug`, `road:rijbaan`, `road:ov-baan`, `road:fietspad`, `road:voetpad` (de wegdelen met BGT-attributen) |
| `blauwbrug-1-300.stl` | Brug met pijlers, pylonen en eindblokken in één stuk op 1:300, met de onderkant op het printbed (181 × 93 × 37 mm) |
| `blauwbrug.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

Generator: [`scripts/generate-blauwbrug.mjs`](../../scripts/generate-blauwbrug.mjs)
(`node scripts/generate-blauwbrug.mjs`, standaard 1:300; op 1:100 zou de brug
54 cm lang worden).

De GLB is in meters met de oorsprong in het hart van het BGT-dek (RD
121876,64, 486608,20) op de waterspiegel van de Amstel (NAP -0,4 m) en de
glTF-conventie Y omhoog; de STL ligt 0,8 m hoger, zodat de onderkant op z = 0
staat. +X loopt langs de brug naar het Waterlooplein (RD-richting (0,9321,
0,3622), 21,2 graden boven het oosten), +Y stroomafwaarts naar het
noordnoordwesten. Net als bij de Magere Brug ligt z = 0 op het water en is
`groundOffsetMetres` 0; het maaiveld wordt op zes punten op het water naast de
brug bemonsterd (`groundSamplePoints` op y = ±14,5 m voor de drie bogen), met
`groundHeight` 43,02 (de ellipsoïdische PDOK-waterhoogte op die punten) als
terugval. De brug is geen BAG-pand en er staat geen pand onder het model, dus
`replacesBuildings` blijft leeg. In een verse PDOK-dump staat de voet van het
model op 42,22 m en het wegdek in het midden op 46,95 m (ellipsoïdisch), dus
op het water (43,02 m) en op het AHN-wegdek (NAP +3,53 m).

Onderdelen in het model (hoogtes boven de waterspiegel):

- Dek van 49,0 × 20,9 m volgens de BGT (`overbruggingsdeel`
  `G0363.c6a9ce7c02a34df1934c2efa0aaa351f`), met een wegdek dat volgens het
  AHN-DSM van NAP +2,94 m aan de kades oploopt tot NAP +3,53 m in het midden
  (rechtlijnig 2,95 %, afgerond binnen x = ±8 m).
- Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek, uitgesneden met
  een strook van 0,5 m onder tot 1 m boven het wegdek over dezelfde
  loftstations als het dek. De BGT heeft op het dek (`relatieve_hoogteligging`
  1, zonder `plus_fysiek_voorkomen`) van het midden naar buiten:
  - `road:ov-baan` (`bgt_functie` OV-baan, `bgt_fysiekvoorkomen` gesloten
    verharding): de trambaan in het midden, circa 5,4 m breed, wegdeel
    `G0363.379fb9a415cd414cb01ae9c903dc7ae8`. De BGT-sporen (`spoor`, functie
    tram) zijn lijnen zonder eigen vlak; de OV-baan is het wegdeel eronder.
  - `road:rijbaan` (`bgt_functie` rijbaan lokale weg, gesloten verharding):
    `G0363.ba9ae59f7f274c73bc542154a8c455f8` en
    `G0363.e28d6fe618a542daa70853c36c143d01`, plus de bermen van 0,4 m tussen
    rijbaan en OV-baan (ondersteunend wegdeel `G0363.0181b4e7...` en
    `G0363.2ea62624...`, functie berm, die niet in de PDOK-waardelijst voor
    wegen staat): de rest van de strook.
  - `road:fietspad` (fietspad, gesloten verharding):
    `G0363.2f44751d94934318b1322a051611c437` en
    `G0363.ff6ad275cbb1453d856752f891271f6a`.
  - `road:voetpad` (voetpad, open verharding):
    `G0363.4d0ec58c0d6149e5a6f51ac1e0fe66dc` en
    `G0363.6740aa61a71d450794ad9a1508aab5db`, tot de binnenkant van de
    balustrade (y = ±9,8 m).

  De kopse kanten van de BGT-contouren zijn tot voorbij het dek doorgetrokken
  en de voetpaden tot voorbij de balustrade, zodat er geen randjes van een
  ander wegdeel overblijven. De balustrade, de voetstukken van de pylonen en
  de eindblokken steken door het wegdek en blijven met 2 cm vrij constructie.
  Samen vormen de vijf onderdelen precies de brug als geheel (4627,5 m³, geen
  overlap). `zfight.py` over de wegdelen (30.000 stralen): geen samenvallende
  vlakken; over het hele model (`--all`) alleen 5 punten "vlak zonder dikte"
  in `building:blauwbrug` op snijlijnen onder een kleine hoek (boogrib tegen
  de lijst, nis tegen de pijlervoet, bol op de kroon), geen samenvallende
  vlakken tussen nodes.
- Drie segmentbogen tussen de pijlers en de landhoofden (x = ±24,0 m): zijbogen
  van 14,3 m met pijl 1,45 m, middenboog van 14,2 m met pijl 1,83 m, aanzet
  0,9 m boven water en kruin 1,2 m onder het wegdek (NAP +1,95 en +2,33 m).
  De doorvaarten zijn blinde bogen: een nis vanaf beide gevels waarvan het
  plafond onder 45 graden naar binnen afloopt (op de waterspiegel 2,3 tot
  2,7 m diep, doorlopend tot de onderkant onder het PDOK-water), zodat er geen
  vrije overspanning onder het dek is. Om elke boog een rib van 0,15 m in het
  vlak van de lijst.
- Lijst langs het dek tot 0,85 m onder het wegdek (0,15 m voor de boogvlakken,
  met een schuine onderkant van 45 graden) en daarop een balustrade van 1,0 m
  hoog en 0,9 m breed (BGT 0,63 m; naar buiten verbreed op een kraag van 45
  graden) met per veld vijf blinde vakken van 0,3 m diep tussen posten van
  0,45 m.
- Twee pijlers van 2,56 m breed (BGT `G0363.593d3c79...` en
  `G0363.a8d8eac9...`) met spitse koppen tot y = ±13,1 m, een voet van drie
  treden (0,4 m hoog, 0,2 m diep) tot 1,2 m boven water, en op beide koppen een
  scheepsboeg: bovenkant 0,6 m boven het wegdek bij de gevel, aflopend naar
  0,6 m eronder op de punt, met een liggende krul (0,9 m) tegen het voetstuk.
- Acht granieten pylonen: vier op de pijlers (voetstuk 1,45 × 1,45 m volgens de
  BGT, middelpunt x = ±8,39, y = ±10,055 m) en vier op de eindblokken aan de
  kades (afgeronde blokken van circa 2,7 × 2,7 m volgens de BGT-kademuur,
  0,9 m boven het wegdek, voetstuk op x = ±25,75, y = ±10,75 m). Elke pylon:
  voetstuk met kroonlijst tot 2,0 m boven het wegdek, getrapte basis, zuil van
  0,9 m (in het echt circa 0,55 m, verdikt voor 1:1000) tot 5,1 m, halverwege
  een V-vormige scheepsarm (onder 45 graden) met twee lantaarns van 0,8 m langs
  de brug (tot 5,3 m), kapiteel en een keizerskroon met bol tot 6,5 m boven
  het wegdek (op de pijlers NAP +9,9 m; het AHN-DSM geeft NAP +9,7 m op een
  pixel van 0,5 m).

Niet in het model:

- Balusters, de gietijzeren versieringen in de zwikken (ovale openingen van
  circa 0,6 × 1,0 m), het stadswapen op de lijst, de beelden op de boegen
  (boegbeeld, vis, ketting), de meerringen en de lantaarnkappen in detail:
  kleiner dan 0,9 m; de balustrade is een dichte wand met blinde vakken.
- De bovenleiding en de masten van de tram: dunner dan 0,9 m.
- De gebogen kadebalustrades met de kroonpaaltjes aan de hoeken: horen bij de
  kade buiten het BGT-dek (BGT-kademuur), niet bij de brug.
- De doorvaarten als open bogen: onder een plat dek van 21 m breed zouden ze
  op 1:1000 een vrije overspanning zijn; daarom blinde bogen met een
  zelfdragend plafond.

Pasvorm op het AHN: het wegdek volgt het DSM binnen 0,05 m (mediaan over het
dek per 2 m); balustrade (DSM 0,5 tot 1,0 m boven het wegdek), boegen (DSM tot
NAP +4,2 m op y = ±12 m) en pylonen (DSM NAP +9,3 tot +9,7 m) kloppen met het
model. In de voor/na-renders ligt het dek op de PDOK-reconstructie en staan de
eindblokken op de ronde scheidingselementen van PDOK op de kadehoeken.

Printbaarheid op 1:1000: printcheck (uitsnede 89 mm) alle onderdelen NoError;
`building:blauwbrug` 4534 → 4568 mm³ (+0,8 %), `road:rijbaan` +0,4 %,
`road:fietspad` +0,1 %, `road:ov-baan` en `road:voetpad` 0 %, in 2,0 s.
Overhang boven het water zit alleen in randen van 0,15 tot 0,3 m (boogrib,
lijst, blinde vakken). De STL op 1:300 is één gesloten stuk (genus 0,
175 cm³).

Per kant meer dan PDOK (PDOK: een vlak dek met lage randen en ronde
scheidingselementen op de hoeken):

- Gevels (kijkrichting 325 en 145 graden): drie bogen met rib, lijst,
  balustrade met vakken, pijlers met treden, boeg en krul, vier pylonen met
  lantaarns en kroon, de eindblokken.
- Langs de brug (55 en 235 graden): het gebogen wegdek met de vijf wegdelen
  (OV-baan, rijbanen, fietspaden, voetpaden), de rij van vier pylonen aan
  elke kant en de eindblokken.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Blauwbrug) (brug 236,
1883-1884, De Greef en Springer; acht granieten pylonen met keizerskronen,
kalkstenen balustrades; tram over de brug), PDOK BGT (`overbruggingsdeel`:
dek en pijlers; `scheiding`: muur en kademuur; `wegdeel` en
`ondersteunendwegdeel`: de wegdelen op het dek; `spoor`: de tramsporen), PDOK
AHN (dsm 0,5 m via WCS: dek, balustrade, boegen, pylonen), Wikimedia Commons
(Blauwbrug NW side from river Amstel 2016-09-12-6577.jpg, Column Blauwbrug
Amstel 2016-09-12-6584.jpg, Amsterdam, Blauwbrug in 2007.jpg, De Blauwbrug
over de Amstel (2020).jpg, Amsterdam - Blauwbrug 1883 B.de Greef &
W.Springer - View West.jpg, Blauwbrug over de Amstel (1884) - Amsterdam -
20011031 - RCE.jpg).

Geschat op foto's: aanzet (0,9 m boven water) en kruin (1,2 m onder het
wegdek) van de bogen, de rib, de lijst (0,85 m), de hoogte van de balustrade
(1,0 m) en de vakken, de treden van de pijlervoet, de boeg met krul, en de
opbouw van de pylonen (voetstuk 2,0 m, arm 3,0-4,2 m, kroon tot 6,5 m boven
het wegdek, met een voetganger als maat). Waterpeil NAP -0,4 m (Amstel, als
bij de Magere Brug).

Het model is een eigen vereenvoudiging op basis van open data (PDOK BGT en
AHN) met foto's van Wikimedia Commons als referentie; er is geen geometrie uit
andere 3D-modellen overgenomen.
