# Brug bij Keizersveer (Raamsdonksveer)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `brug-bij-keizersveer.glb` | Catalogusbron in meters met vier nodes: `road:rijbaan`, `road:rijbaan-lokaal` en `road:fietspad`, de bovenste 0,5 m van de rijbanen van de A27, de dienstweg en de fietspaden met de attributen van het BGT-wegdeel erop (zie hieronder), en `building:brug-bij-keizersveer` met de rest: het dek, de twee vakwerkbruggen met elk drie overspanningen (vier wanden), de twee rivierpijlers en de twee landhoofden |
| `brug-bij-keizersveer-1-1000.stl` | De hele brug (alle vier nodes samen) in één stuk op 1:1000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (307,5 × 43,4 × 23,9 mm) |
| `brug-bij-keizersveer.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (120686,35, 414657,15) (WGS84
51,71961 N, 4,89063 O), op de as van het BGT-dek (midden tussen de twee
bruggen, op de dienstweg) midden tussen de twee rivierpijlers, op de
waterspiegel van de Bergsche Maas (NAP +0,55 m) en de glTF-conventie Y
omhoog. +X loopt langs de brug naar het noordnoordoosten, naar het Land van
Altena (`xAxis` (0,23769, 0,97134), 76,25 graden linksom vanaf het oosten,
langs de randen van het BGT-dek), +Y stroomafwaarts naar het
westnoordwesten. De oostelijke (stroomopwaartse) brug ligt op y = -18,0 tot
-2,6, de dienstweg op y = -2,6 tot 3,9 en de westelijke brug op y = 3,9 tot
19,75. Het zuidelijke landhoofd (Raamsdonksveer) ligt op x = -153,6 tot
-145,2, het noordelijke op x = 145,4 tot 153,9, de pijlers op x = -45,8 en
45,7 (harten). Het maaiveld wordt op zes punten op het water bemonsterd
(`groundSamplePoints`, 32 m naast de as aan beide kanten op x = -30, 0 en
30); `groundOffsetMetres` is 0, want het PDOK-terrein legt de Bergsche Maas
op 43,95 tot 43,99 m ellipsoïdisch, de waterspiegel van het model. Omdat de
brug 307 m lang is, staat de laagste van die hoogtes ook als vaste terugval in
`groundHeight` (43,95), zodat een uitsnede die alleen een uiteinde raakt het
model niet laat wegvallen. Pijlers en landhoofden beginnen op de vlakke
onderkant 0,8 m onder het water en verdwijnen in de oevers en de dijken in het
terrein (de dijken liggen in PDOK op NAP +11,2 tot +11,8 m, het dek eindigt
op +11,75 m). Er ligt geen BAG-pand onder de brug, dus geen
`replacesBuildings`.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 297 m (BGT, x = -148,4 tot 148,6), 37,78 m breed, boven de
  landhoofden doorgetrokken tot hun achterkant in de dijk (307,5 m). Dwars,
  met de grenzen op de harten van de vakwerkwanden: het oostelijke fietspad
  (y = -18,03 tot -15,15, 0,24 m lager dan de rijbaan, 0,9 m dik), de rijbaan
  van de oostelijke brug (2,0 m constructiehoogte), de dienstweg tussen de
  bruggen (0,08 m lager, 1,5 m dik), de rijbaan van de westelijke brug en het
  westelijke fietspad (y = 16,6 tot 19,75). De rijbanen volgen het AHN: een
  flauwe bolling van NAP +12,22 m in het midden naar +11,8 m bij de
  landhoofden.
- Twee vakwerkbruggen met elk drie overspanningen van de oude Moerdijkbrug:
  100,0 m (x = -147,6 tot -47,6), 87,2 m (-43,6 tot 43,6) en 100,0 m (47,6
  tot 147,6), boven elke pijler 4,0 m tussen de eindstijlen. Vier wanden van
  1,0 m op y = -15,15, -2,55, 3,9 en 16,6 (12,6 en 12,7 m hart op hart, AHN).
  Evenwijdige randen: de bovenrand 11,45 m boven de rijbaan (NAP +23,67 m in
  het midden, +23,25 m bij de landhoofden), verticale eindstijlen van 1,2 m,
  verticalen van 0,9 m op een steek van 12,5 m (acht velden in de buitenste,
  zeven van 12,46 m in de middelste overspanning; de dwarse bovenregels in het
  AHN) en per veld een kruis van twee diagonalen van 0,9 m. Bovenrand 1,0 m,
  onderrand tot 0,6 m boven de rijbaan.
- In elke wand per veld de vier driehoeken van het kruis als doorgaande
  openingen (32 per wand in een overspanning van 100 m); de diagonalen staan
  op 38 graden, de bovenste driehoek heeft een vlakke bovenkant.
- Twee rivierpijlers uit de BGT, 6,4 m breed met spitse koppen tot 21,7 m
  naast de as; de koppen buiten het dek lopen af van NAP +4,2 m aan het dek
  naar +3,0 m op de punt (AHN), de schacht loopt over de breedte van het dek
  tot onder elke strook.
- De twee landhoofden (BGT) van de onderkant tot onder het dek.
- Rijbanen, dienstweg en fietspaden als eigen onderdelen (verplicht voor
  bruggen): de bovenste 0,5 m van het dek, gesneden met een strook van 0,5 m
  onder tot 1 m boven het wegdek over dezelfde loftstations als het dek, van
  x = -148,5 tot 148,7 (0,1 m voorbij de BGT-wegdelen); de vakwerkwanden
  blijven over de hele lengte van het dek constructie, met 2 cm vrij. Alle
  vijf BGT-wegdelen (relatieve hoogteligging 1, x = -148,4 tot 148,6) hebben
  `fysiek_voorkomen` gesloten verharding en geen `plus_fysiek_voorkomen`.
  `road:rijbaan` (`bgt_functie` rijbaan autosnelweg) is het dek tussen de
  wanden van beide bruggen (y = -14,63 tot -3,07 en 4,42 tot 16,08);
  BGT-wegdelen L0002.2bfb85a9af1d44b49b7f7b8718ba8382 en
  L0002.f96a81f881234d76984e6034d51a4d37 (y = -14,3 tot -2,9 en 4,7 tot 16,2).
  `road:rijbaan-lokaal` (`bgt_functie` rijbaan lokale weg) is de dienstweg
  tussen de bruggen (y = -2,03 tot 3,38); BGT-wegdeel
  L0002.4bcedd3c0f824dd0a42f4be7822ba335 (y = -1,2 tot 3,0). `road:fietspad`
  (`bgt_functie` fietspad) is het dek buiten de wanden aan beide kanten
  (y = -18,03 tot -15,67 en 17,12 tot 19,75); BGT-wegdelen
  L0002.74f34babd49e4729898e2f311db7c452 en
  L0002.e353ee43986a4f12b171eaf2416d5880 (y = -18,0 tot -15,7 en 17,1 tot
  19,7). Het script controleert dat de as van elke strook over de hele lengte
  in een wegdeel van zijn functie ligt en dat de volumes van de vier nodes
  optellen tot de brug als geheel (38 835 m³: constructie 33 839, rijbanen
  3 451, dienstweg 804, fietspaden 742 m³). Geen samenvallende bovenvlakken
  tussen de nodes (`zfight.py`, 30 000 verticale stralen, gemeten met de
  vorige versie met nissen).

Wat er niet in zit: de echte staven (geklonken vakwerkstaven met
uitsparingen van circa 0,6 tot 0,8 m, vervangen door de plaat met
openingen), de portalen met schoren boven de eindstijlen, de dwarse
bovenregels en de windverbanden tussen de wanden (de export vond onder een
balk van 0,9 m tussen de wanden geen dichte wand om tegen te schoren en zette
er een wand tot het dek onder), de bordessen en kooiladders op de
portalen, leuningen, geleiderails, betonnen barriers langs de dienstweg,
lantaarnpalen en verkeersborden (dunner dan 0,9 m), de dwarsdragers onder het
dek (de export vult daar toch een wig met een scherm op) en de meerpalen bij
de pijlers (kleiner dan 0,9 m op de luchtfoto).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug
alleen een grijze strook wegdeel die van het dek bij de landhoofden
(NAP +11,8 m) doorhangt naar het water, met losse strepen erboven; er staat
geen enkel bouwdeel. Het model heeft van oost en west (de lange zijden) de
drie overspanningen per brug met hun vakwerkwanden, kruisen en openingen en
de opening van 4 m boven elke pijler, de fietspaden buiten de wanden
en de spitse pijlerkoppen in het water; van noord en zuid (langs de A27) de
vier wanden met de rechthoekige eindstijlen, de twee rijbanen, de dienstweg
ertussen en de landhoofden in de dijken.

Pasvorm op het AHN: de hoogste DSM-cel per 4 m op de vier vakwerklijnen ligt
in 83 % van de 268 vakken binnen 1 m en in 69 % binnen 0,5 m van de bovenrand
van het model (mediaan -0,09 m; de dalen zijn cellen tussen de dwarsregels).
De rijbanen liggen binnen 0,05 m van het 25e percentiel van het DSM per 10 m.

Printbaarheid op 1:1000: de echte staven zijn op 1:1000 te dun, daarom zijn
de wanden dichte platen van 1,0 m met staven van 0,9 m en openingen. Wat
zonder steun niet print, laat het model aan de export over: de plafonds van
de openingen (de diagonalen op 38 graden en de vlakke bovenkant van de
bovenste driehoek, samen met de randen 3 447 m²) en de onderkant van het dek
(10 509 m²); het script controleert dat verder niets naar beneden wijst. In
de meettest van de webshop (`scripts/overhang-lab`, het model op 1:1000) gaat
het volume met "Ondersteuning v2.0" van 37,5 naar 116,6 cm³ (v1.0 ook
116,6 cm³), zonder ongedragen lagen waar een printlijn in past; de export
vult de openingen onder de flauwe diagonalen grotendeels op en onder het dek
komt een wig met een scherm tot de onderplaat. De STL op 1:1000, die zonder
export wordt geprint, heeft printvormen: blinde nissen van 0,35 m voor de
driehoeken met alleen in de onderste en de zijdriehoeken een opening met
plafonds van 56 graden, en onder het dek een printvoet (een wig van 50 graden
vanaf de dekranden met blokken tot de hogere onderkant van de fietspaden en de
dienstweg); ze is ongewijzigd.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Brug_bij_Keizersveer)
(eerste brug 1931, in de oorlog opgeblazen en hersteld, eind jaren zeventig
vervangen door zes overspanningen van de oude Moerdijkbrug, drie per brug naast
elkaar, heropend op 1 december 1978, sinds 2003 geheel wit), PDOK BGT
(overbruggingsdeel: dek, pijlers, landhoofden; wegdeel: de vijf wegdelen op het
dek), PDOK AHN (dsm 0,5 m via WCS: lengteprofiel, vakwerklijnen, bovenrand,
dwarsregels op de knopen, pijlerkoppen), de PDOK-luchtfoto (plattegrond,
velden, pijlers), het PDOK-terrein (waterspiegel) en de Wikimedia
Commons-foto's Keizersveersebrug.jpg, Old bridge by Raamsdonksveer
(9415010697).jpg, Vernieuwde brug over Bergse Maas open voor verkeer,
Bestanddeelnr 930-0247.jpg en 930-0248.jpg, Bergsemaas.jpg en Keizersveer, brug
over de Bergsche Maas bij Raamsdonkveer.jpg voor het vakwerkpatroon (kruizen
tussen de verticalen, rechthoekige eindstijlen), de dienstweg tussen de
bruggen en de pijlers. Geschat zijn de waterspiegel (NAP +0,55 m: PDOK-water
43,96 m ellipsoïdisch min 43,45 m, het verschil tussen de PDOK-rijbaan en het
AHN bij de landhoofden), de constructiehoogte van het dek (2,0 m onder de
rijbanen, 1,5 m onder de dienstweg, 0,9 m onder de fietspaden), de dikte van
de wanden (1,0 m) en de staafbreedtes, de hoogte van de onderrand (0,6 m boven
de rijbaan), de schachten van de pijlers onder het dek (over de volle breedte
van het dek) en de diepte van de nissen.

Licentie van het model: eigen werk op basis van open bronnen.
