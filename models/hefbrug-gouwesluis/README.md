# Hefbrug Gouwesluis (Alphen aan den Rijn)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hefbrug-gouwesluis.glb` | Catalogusbron in meters: `building:hefbrug-gouwesluis` (landhoofden, het val in de laagste stand, de twee heftorens en het brugwachtershuisje) en vijf `road:`-nodes met BGT-attributen (de bovenste 0,5 m van dek en landhoofden) |
| `hefbrug-gouwesluis-1-1000.stl` | De brug in één stuk op 1:1000 met printvormen (blinde nissen in plaats van de vakwerkopeningen) en een printvoet onder het val, met de onderkant (0,8 m onder het water) op het printbed (55,0 × 19,1 × 44,2 mm, 6,4 cm³) |
| `hefbrug-gouwesluis.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand en BGT-dekvlak, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (106134,89, 459048,07) (WGS84
52,11749 N, 4,67375 O), in het midden van het BGT-brugdek, op het water van de
Gouwe zoals het PDOK-terrein het legt (43,00 m ellipsoïdisch; het PDOK-terrein
ligt hier 43,39 m boven het AHN, dus NAP -0,39 m) en de glTF-conventie Y
omhoog. +X loopt langs de weg (Goudse Schouw) naar het oostzuidoosten, naar de
oostelijke oever met het brugwachtershuisje (`xAxis` (0,95589, -0,29372),
-17,08 graden vanaf het oosten), +Y naar het noordnoordoosten, naar de
keersluis. De as van de constructie (hoofdliggers en torens) ligt 0,25 m ten
noorden van het midden van het BGT-dek. Het maaiveld wordt op zes punten op het
water bemonsterd, 16 m naast de as op x = -6, 0 en 6 (noord in de keersluis);
`groundOffsetMetres` is 0 en `groundHeight` (43,00) is de PDOK-hoogte van het
water als vaste terugval.

Het model vervangt het BAG-pand van het brugwachtershuisje
(`NL.IMBAG.Pand.0484100000003746`, 1938, 17 m²), dat PDOK als een blok van
het maaiveld tot NAP +8,7 m reconstrueert, en het BGT-dekvlak
`P0028.80717001cf8d43f9b56f60dbd2decdc0` (relatieve hoogteligging 1), dat PDOK
als plaat op het water legt (`replacesTerrain`, met
`node scripts/replaces-terrain.mjs hefbrug-gouwesluis --write`). De
landhoofden (BGT-overbruggingsdelen met hoogteligging 0) blijven in het
PDOK-terrein staan; ze liggen binnen het model.

Wegdek met PDOK-attributen: de bovenste 0,5 m van dek en landhoofden is per
combinatie van BGT-attributen een eigen node, met de waarden van het BGT-wegdeel
eronder in `extras.attributes`, zodat de kleurregels van een thema op de brug
werken zoals op de PDOK-wegdelen ernaast:

| Node | Attributen | BGT-wegdeel |
| --- | --- | --- |
| `road:rijbaan` | `bgt_functie` rijbaan regionale weg, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | `P0028.610ae080a9024dad9d1a9fbab85964c5` (hoogteligging 1), tussen de hoofdliggers |
| `road:fietspad` | `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding | `P0028.415a49959f2e4097b86838c592082911` (zuid) en `P0028.78922c9ac3aa48fc91b2d9a31ec62d65` (noord), buiten de hoofdliggers (hoogteligging 1) |
| `road:rijbaan-landhoofden` | rijbaan lokale weg, gesloten verharding, asfalt | `G0484.3794f416feb66ea8e05370f9200ac4e9` (west), `G0484.3794f416fed16ea8e05370f9200ac4e9` (oost) |
| `road:fietspad-landhoofden` | fietspad, gesloten verharding, asfalt | `G0484.3794f41c46446ea8e05370f9200ac4e9` (west), `G0484.69a49eb9c78e7eede05370f9200a9e2f` en `G0484.3794f416fed26ea8e05370f9200ac4e9` (oost), zuidkant |
| `road:voetpad-landhoofden` | voetpad, open verharding, tegels | `G0484.3794f416feb16ea8e05370f9200ac4e9` (west, noord), `G0484.3794f41a0cdd6ea8e05370f9200ac4e9` (oost, noord), `G0484.69a49eb9c79e7eede05370f9200a9e2f` en `G0484.69a49eb9c7ae7eede05370f9200a9e2f` (oost, langs de rijbaan) |
| `building:hefbrug-gouwesluis` | geen | de rest van het kunstwerk |

Op het dek liggen volgens de BGT ook twee smalle stroken fietspad tussen de
rijbaan en de hoofdliggers (`P0028.03fa6ca26150481d827e86dbfc7b2629` en
`P0028.22d8bc4df8bf4e488e24ee1618e1ff19`, 0,6 m breed). In het model staan daar
grotendeels de hoofdliggers (0,9 m); wat over is (0,25 en 0,3 m) hoort bij de
rijbaan. Het noordelijke pad op het dek is in werkelijkheid het voetpad
(Wikipedia: fietspad 2,5 m, voetpad 2,0 m), maar de BGT noemt beide fietspad;
het model volgt de BGT. De wegdelen op de landhoofden hebben hoogteligging 0:
de PDOK-versies zakken met het terrein weg tot op het water (het AHN-maaiveld
kent de landhoofden niet) en liggen dus onder het model; in het model lopen ze
door tot de waterkant (x = ±13,5), over de randstrook van 0,3 tot 0,5 m die de
BGT als landhoofd tekent. De bermen van betonstraatstenen onder de torens en de
kleine stukken voetpad van cementbeton en trap (samen 8 m²) blijven
constructie, net als de voeten van de torenzijvlakken en de hoofdliggers (2 cm
vrij rond het wegdek). De wegdelen zijn de strook van 0,5 m onder tot 1 m
boven het wegdek binnen de brug, de constructie de brug min die strook: geen
samenvallende bovenvlakken (stralencontrole over 7236 punten), de volumes
tellen op tot die van de brug als geheel (4133,4 + 122,0 + 61,2 + 118,8 + 19,4
+ 25,5 = 4480,3 m³).

Onderdelen in het model (hoogtes in NAP):

- Twee betonnen landhoofden van de waterkant (x = ±13,5, BGT) tot x = ±27,5 over
  de hele breedte van het dek (15,5 m), van 0,8 m onder het water tot het
  wegdek: rijbaan NAP +4,73 m (west) tot +4,65 m (oost), paden 0,07 tot 0,1 m
  hoger (AHN).
- Het val in de laagste stand: rijvloer van x = -13,5 tot 13,5 met de
  onderkant op NAP +3,89 m (register: doorvaarthoogte 4,5 m gesloten boven
  het boezempeil NAP -0,61 m; Wikipedia 4,30 m), rijbaan op +4,77 m tussen de
  hoofdliggers, fiets- en voetpad erbuiten op +4,85 m (AHN). Twee
  vakwerkhoofdliggers van 29,2 m met hartlijnen op y = -4,73 en 5,25 (de
  spleten tussen de BGT-wegdelen, 10 m uit elkaar), evenwijdige randen met de
  bovenkant op +9,1 m (AHN 8,8 tot 9,2 m), eindstijlen op x = ±14,15 en een
  Warren-vakwerk met stijlen in elke knoop (foto's: bovenknopen op 0 en ±9,2 m,
  onderknopen op ±4,6 en ±13,8 m, zes diagonalen onder 39 graden), staven van
  0,9 m, alle twaalf velden open; eindportalen van 0,9 × 0,9 m tussen de
  liggers boven de eindstijlen.
- Twee heftorens van open vakwerk, elk met twee zijvlakken van 0,9 m dik aan
  weerszijden van de weg (AHN: y = -6,5 tot 7,0) met een verticale binnenstijl
  aan de kant van het val (x = ±12,9 tot ±13,8, met een voetblok voor de
  waterkant) en een schuine buitenstijl (buitenkant van x = ±23,4 op het
  landhoofd tot ±16,0 onder het topplatform, AHN), acht velden van 4,46 m met
  regels en kruisen. Het schuine buitenvlak boven de weg heeft een portaal op
  4,5 m boven het wegdek (foto vanaf de Steekterweg) en daarboven regels met
  kruisen over twee velden; aan de kant van het val is de toren open tot onder
  het topplatform (daar beweegt het val). Bovenop een platform van
  4,1 × 13,9 m (NAP +40,5 tot +41,4 m) met per zijvlak een groot kabelwiel
  (Ø 2,6 m, top NAP +43,0 m: het hoogste AHN-punt van beide torens) en een
  kleiner wiel aan de kant van het val (Ø 2,0 m); boven in de toren het betonnen
  ballastblok (4 × 1,3 m over de hele breedte, NAP +33,6 tot +37,6 m) in de
  stand met het val beneden.
- Het brugwachtershuisje (BAG-pand) op het oostelijke landhoofd aan de
  noordkant, x = 13,54 tot 18,55, y = 7,45 tot 11,05: een betonnen onderbouw
  van de kade tot het looppad, daarop een veelhoekig huisje (afgeschuinde
  hoeken van 0,8 m) met een plint tot +5,95 m, een terugliggende band met ramen
  (nis van 0,3 m) tot +7,55 m, een koperen boeiboord met 0,2 m overstek en een
  laag schilddak tot +8,9 m (AHN).

Geschat zijn: de constructiehoogte van het val (onderkant uit de
doorvaarthoogte van het register), de vakwerkindeling van de hoofdliggers en de
torens (uit foto's; de torens hebben in werkelijkheid ook K-verbanden en
tussenstijlen), de plaats en maten van de kabelwielen en het ballastblok
(foto's), de hoogte van het topplatform, de binnenkant van de torens (AHN
12,5 tot 12,9 m; 12,9 m gekozen zodat de binnenstijl bijna boven het
landhoofd staat), het portaal op 4,5 m en de opbouw van het
brugwachtershuisje. Het hoogste punt ligt volgens het AHN op NAP +43,0 m, 38 m
boven het wegdek en 43 m boven het water; Wikipedia noemt 37 m.

Wat er niet in zit: het bovenwindverband tussen de bovenranden van de
hoofdliggers (kruisen van hoekstaal van circa 0,3 m, horizontaal 4,3 m boven de
rijbaan; met staven van 0,9 m zou de export er een wand van steunen op de
rijbaan onder zetten, zoals bij de windverbanden van eerdere bruggen
weggelaten), de staalkabels van het val naar de wielen en de ballastblokken
(dunner dan 0,9 m), leuningen (met de cirkels en het opschrift "Gouwesluis
Anno 1938"), ladders, bordessen en de trap in de torens, slagbomen, seinen,
lantaarns, de kleine vensters in het oostelijke landhoofd (circa 0,4 m), het
houten remmingwerk voor de landhoofden (losse palen in het water, geen deel van
de brug), de betonnen trappen op de dijktaluds (die zitten als BGT-trap in het
PDOK-terrein) en de keersluis met puntdeuren schuin onder de brug (hoort bij het
rijksmonument, maar valt buiten de hefbrug en ligt op waterhoogte).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke plaat op het water met het brugwachtershuisje als blok en zakken de
wegen op de landhoofden weg tot het water. Het model heeft van alle vier kanten
de twee heftorens met open vakwerk, platform en wielen (van zuid en noord de
zijvlakken met de schuine buitenstijlen, van oost en west het buitenvlak met
portaal en kruisen boven de weg), het val met de twee vakwerkliggers tussen de
torens, de betonnen landhoofden en het brugwachtershuisje.

Pasvorm op het AHN: van de DSM-cellen op dek en landhoofden buiten de torens
ligt 80 % binnen 1 m van het model (mediaan -0,01 m; de rest zijn de
hoofdliggers, auto's en leuningen). De top van beide torens ligt in het AHN op
NAP +43,0 m, het dak van het brugwachtershuisje op +8,6 tot +8,9 m.

Printbaarheid op 1:1000: de echte staven (circa 0,5 m) zijn te dun; het model
heeft staven van 0,9 m en laat de vakwerkopeningen open. Wat zonder steun niet
print, laat het model aan de export over: de onderkant van het val, de vlakke
plafonds van de vakwerkopeningen in liggers en torens, de portalen, het
platform, de wielen, het ballastblok en het dak (samen 1190 m² ondervlak
vlakker dan 45 graden). In de controle met `shareModelSupport` en
`supportedSolid` op 1:1000 gaat het volume met "Ondersteuning v2.0" van 4,48
naar 7,05 cm³ (+57 %, v1.0: 6,96 cm³) in 30 s; de wegdelen krijgen geen eigen
opvulling (`extraPct` 0,00 tot -0,08 %), de constructie draagt alles. Onder het
val komt één doorlopende plaat van het dek tot de onderplaat. In een export van
100 × 100 m rond de brug op 1:1000 (`createModelBundle`) is het landmark
4,33 cm³ plus 2,44 cm³ ondersteuning; het PDOK-dekvlak en het BAG-pand zijn
weg. De STL op 1:1000, die zonder export wordt geprint, heeft printvormen:
dichte vakwerkvlakken met de openingen als blinde nissen van 0,35 m aan de
buitenkant en onder het val een printvoet (wig van 50 graden die op een
trapezium tot de onderplaat uitloopt).

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Hefbrug_Gouwesluis)
(Kloos en Zn., geopend 14 september 1938; rijweg 8,5 m, fietspad 2,5 m,
voetpad 2,0 m, doorvaartwijdte 25 m, doorvaarthoogte gesloten 4,30 m),
[Rijksmonumentenregister 516141](https://monumentenregister.cultureelerfgoed.nl/monumenten/516141)
(konische heftorens van open geklonken vakwerk, het val met twee
vakwerkhoofdliggers en een bovenwindverband, betonnen ballastblokken via
kabelwielen boven in de torens, doorvaartwijdte 25 m, breedte tussen de
leuningen 15 m, doorvaarthoogte 4,5 m gesloten en 35 m open, betonnen
landhoofden, veelhoekig brugwachtershuisje met koperen dak aan de noordkant op
de oostelijke oever, keersluis schuin onder de brug), PDOK BGT
(overbruggingsdeel: dek en landhoofden; wegdeel: wegdelen op dek en
landhoofden), PDOK BAG (pand 0484100000003746), PDOK AHN (dsm 0,5 m via WCS:
wegdek, hoofdliggers, torens, brugwachtershuisje), de PDOK-luchtfoto en het
PDOK-terrein (waterhoogte), en de Wikimedia Commons-foto's 200407 Hefbrug
Gouwesluis.jpg, Gouwsluis-hefbrug nrd..JPG, Gouwsluis-hefbrug zd..JPG, Hefbrug
Gouwesluis - Het beweegbare deel.jpg, - Oostelijk landhoofd.jpg, - Westelijk
landhoofd.jpg, - Vanaf de Steekterweg.jpg, - Brugwachtershuisje.jpg, Overzicht
hefbrug over de Gouwe - Alphen aan den Rijn - 20396221 - RCE.jpg en Alphen aan
den Rijn - hefbrug.jpg.

Licentie van het model: eigen werk op basis van open bronnen.
