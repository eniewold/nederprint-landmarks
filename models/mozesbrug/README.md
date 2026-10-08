# Mozesbrug (Halsteren)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `mozesbrug.glb` | Catalogusbron in meters: node `building:mozesbrug` (de trog van twee damwanden met de treden eronder), node `road:voetpad` (de bovenste 0,5 m van de twee bordessen) en node `road:voetpad-op-trap` (de bovenste 0,5 m van de westtrap, het looppad door de gracht en de oosttrap), beide wegnodes met BGT-attributen |
| `mozesbrug-1-1000.stl` | De brug in één stuk op 1:1000, met de vlakke onderkant (NAP -1,0 m) op het printbed (51,6 × 2,8 × 10,8 mm) |
| `mozesbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (79635,82, 393875,645), op de as
van de trog midden boven de vestinggracht van Fort de Roovere (het midden van
het BGT-wegdeel `G0748.bc4b29ae`), op de waterspiegel van de gracht
(NAP +0,5 m), en de glTF-conventie Y omhoog. +X loopt langs de brug naar de
buitenoever (`xAxis` (0,95473, -0,29746), 17,3 graden rechtsom vanaf het
oosten, dus naar het oostzuidoosten), +Y naar het noordnoordoosten. De trap
in de wal van het fort ligt aan de westkant (x < -11,2), de trap naar het pad
op de buitenoever aan de oostkant (x > 11,2). Het maaiveld wordt op drie
punten op de as van de trog boven de gracht bemonsterd (`groundSamplePoints`
(-8, 0), (0, 0) en (8, 0)): daar ligt het PDOK-looppad, het vlak waarboven het
model moet blijven. Het laagste punt (x = -8) ligt op NAP -0,171 m
(ellipsoïdisch 44,309 m, de `groundHeight` als terugval);
`groundOffsetMetres` 0,671 zet z = 0 daarmee op de waterspiegel. De
Mozesbrug is geen BAG-pand en vervangt dus niets.

Waterniveau en PDOK-terrein: de brug ligt grotendeels onder de waterspiegel
en een landmarkmodel kan niet in het PDOK-terrein snijden. Dat terrein heeft
de trog echter al: de BGT-wegdelen in de trog zijn wegvlakken op de hoogte van
het AHN (over de gracht een scheef vlak van NAP -0,30 tot +0,01 m, de trappen
als hellingen), de damwanden zijn dunne scheidingswanden tot net boven het
water en het water ernaast ligt op NAP +0,5 m (de export trekt aansluitend
water vlak op die hoogte). Het model legt daarom elke trede 6 cm boven het
hoogste PDOK-wegvlak eronder en de bovenkant van de wanden 5 tot 40 cm boven
het PDOK-terrein en de PDOK-scheidingswanden onder hun voetafdruk. Zo prikt er
nergens PDOK-terrein door het model (4000 verticale stralen over de
voetafdruk: kleinste marge 5 cm, bij de PDOK-scheidingswand aan de westkant
van de gracht), zit de dunne PDOK-wand helemaal in de modelwand en staat de
wand over de gracht 0,35 m boven het water. Wat onder het PDOK-terrein ligt
(de treden tot NAP -1,0 m, de wanden in de wal) is niet te zien.

Onderdelen in het model (hoogtes in NAP):

- De trog: twee damwanden van 51,6 m (BGT-muren `G0748.04144a2e` en
  `G0748.2586284e`, x = -32,49 tot 19,13), binnen 1,0 m uit elkaar
  (BGT-looppad 1,12 m; de binnenkant staat op |y| = 0,50 zodat de
  PDOK-scheidingswanden op |y| 0,53 tot 0,74 erin vallen) en voor het
  printen 0,9 m dik in plaats van 0,15 m, naar buiten verdikt (2,8 m breed
  over de wanden). Bovenkant in rechte stukken: bovenaan in de wal op +9,8 m,
  langs de westtrap evenwijdig aan de trap tot +1,75 m bij het
  benedenbordes, over de gracht vlak op +0,85 m (AHN +0,72 m, water +0,5 m),
  langs de oosttrap omhoog tot +3,6 m aan het pad, zodat de wanden zoals op
  de foto's net boven de glooiing uitsteken.
- Het bovenbordes in de wal, 4,8 m lang op +8,8 m (AHN +8,65 tot +8,97 m),
  aansluitend op het pad over de wal.
- De westtrap in de glooiing van de wal: 14 treden van 0,95 m met elk 0,54 m
  stijging, van +8,54 tot +1,52 m over 13,3 m (in het echt circa 44 treden;
  BGT `voetpad op trap`).
- Het benedenbordes aan de gracht in twee treden (+0,99 en +0,76 m; AHN
  +0,66 m) en een trede naar het looppad (+0,33 m).
- Het looppad door de gracht, 22,5 m lang op +0,08 m (AHN -0,30 m, zie
  hierboven), 0,42 m onder het water en 0,77 m onder de bovenkant van de
  wanden.
- De oosttrap naar het pad op de buitenoever: drie lage treden boven de oever
  (+0,75, +0,95 en +1,16 m) en vijf steile tot +3,4 m, over 7,9 m.
- Het looppad als twee eigen nodes met in `extras.attributes` de waarden van
  de BGT-wegdelen in de trog: `road:voetpad` (`bgt_functie` `voetpad`,
  `bgt_fysiekvoorkomen` `onverhard`; de bordessen, `G0748.e3db4a25` en
  `G0748.fe36048e`) en `road:voetpad-op-trap` (`voetpad op trap`,
  `onverhard`; de trappen en het looppad, `G0748.fa354147`, `G0748.09de3f50`,
  `G0748.bc4b29ae`, `G0748.95430c6c`, `G0748.98c14b78` en `G0748.5cd32659`).
  Geen plus-fysiek voorkomen in de BGT. Alle wegdelen in de trog hebben
  relatieve hoogteligging 0, want de brug ligt in het maaiveld en het water;
  een wegdeel met hoogteligging 1 is er niet. De grenzen tussen de nodes
  volgen de BGT-wegdelen langs de as. Elke laag is de bovenste 0,5 m van een
  trede, 3 cm vrij van de binnenkant van de wanden; `building:mozesbrug` is
  de rest (brug − strook). De volumes tellen op tot de brug als geheel
  (576,0 m³: 551,8 + 3,4 + 20,8 m³); geen samenvallende bovenvlakken tussen de
  nodes (`zfight.py`, 30 000 verticale stralen). De trapnode bestaat uit
  losse lagen per trede, want de stijging (0,54 m) is groter dan de laag.

Niet in het model: de damwanden als planken (Accoya-damwand met een lichte
kraag bovenop, kleiner dan 0,9 m), de losse treden van circa 0,3 m (gegroepeerd
tot treden van 0,95 m), de lage muurtjes langs het pad bovenop de wal en de
elektriciteitskast bij de oosttrap (geen deel van de brug), riet en
waterlelies.

Printbaarheid op 1:1000: de trog is een groef van 1,0 mm breed tussen wanden
van 0,9 mm, over de gracht 0,77 mm diep; de treden zijn 0,95 mm diep met
0,54 mm stijging. Alles staat op dezelfde vlakke onderkant en er is geen
enkel ondervlak boven die onderkant (het script controleert dat), dus geen
overhang en geen steun. In de printcheck op 1:1000 (uitsnede van 80 m, 89 ms)
krijgt geen enkel onderdeel opvulling: constructie 612 mm³, voetpad 3 mm³,
trap 21 mm³, alle drie +0 %, status NoError. In een kaartprint steekt over
de gracht alleen de bovenste 0,35 m van de wanden boven het water uit (0,35
mm); de groef ertussen blijft open tot het looppad.

Bronnen: [Fort de Roovere (Wikipedia)](https://nl.wikipedia.org/wiki/Fort_De_Roovere);
BGT scheiding (de twee muren van de trog) en wegdeel (de bordessen, de
trappen en het looppad met functie en fysiek voorkomen) via de PDOK OGC API;
AHN DSM 0,5 m (PDOK WCS) voor de waterspiegel (NAP +0,5 m), het looppad
(-0,30 m), de bovenkant van de wanden (+0,72 m), het bovenbordes en de
trappen; de PDOK 3D-terreintegels voor de wegvlakken, scheidingswanden en het
terrein in en naast de trog; Wikimedia Commons: *Digital Eye 2015 Moses's
Bridge at Fort de Roovere-1.jpg* en *-7.jpg* (de westtrap en de trog van de
oostoever), *Loopgraafbrug.JPG* (de oosttrap vanaf de wal),
*SaillantZOBastionNOBastionGrachtLoopgraafbrugBuitenwerk.JPG* (de ligging in
de gracht).

Geschat: de hoogte van elke trede en van het looppad (6 cm boven het
PDOK-wegvlak in plaats van de AHN-hoogte; over de gracht 0,38 m hoger dan in
het echt), de bovenkant van de wanden langs de trappen (evenwijdig aan de
trap, boven het PDOK-terrein; over de gracht 0,13 m boven het AHN, omdat de
PDOK-wand tot +0,80 m komt), de wanddikte (0,9 m voor het printen, echt
0,15 m) en de indeling in treden van 0,95 m.

Licentie van het model: eigen werk op basis van open bronnen.
