# Aquaduct Veluwemeer (Harderwijk)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `aquaduct-veluwemeer.glb` | Catalogusbron in meters: node `building:aquaduct` (de waterbak over de verdiepte N302 met de drie kokers, de portalen en de vier vleugelwanden), node `water:waterbak` (het water in de bak, `bgt_type` `watervlakte`), node `road:rijbaan` (de bovenste 0,5 m van de vloer van de twee rijbaankokers) en node `road:fietspad` (idem in de fietskoker), de wegnodes met BGT-attributen |
| `aquaduct-veluwemeer-1-1000.stl` | Bak, kokers, vleugelwanden en water in één stuk op 1:1000, met de vlakke onderkant (NAP -8,83 m) op het printbed (85,9 × 48,2 × 10,3 mm) |
| `aquaduct-veluwemeer.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (170754,742, 485919,072), midden in
de bak op het snijpunt van de as van de vaargeul en de as van de N302, en de
glTF-conventie Y omhoog. +X loopt langs de vaargeul naar het noordoosten, naar
het Wolderwijd (`xAxis` (0,70711, 0,70711), 45 graden linksom vanaf het
oosten, evenwijdig aan de BGT-randen van de bakwanden), +Y naar het
noordwesten. De weg kruist scheef, onder RD -35 graden (lokaal -80 graden,
naar het zuidoosten); maten dwars op de weg staan in het script als `t`, de
afstand tot de wegas langs (cos 10°, sin 10°), positief naar het noordoosten.
De kopgevels van de bak boven de weg liggen op y = ±12,75, de bak loopt dwars
over de weg tot de buitenkant van de buitenste tunnelwanden (t = ±13,73,
27,5 m). Het maaiveld wordt op vier punten midden in de rijbaankokers 1,75 m
buiten de portalen bemonsterd (`groundSamplePoints` (-5,1, 14,5),
(5,06, 14,5), (0,02, -14,5) en (10,17, -14,5)), op het PDOK-wegdek in de
verdiepte bak naast het aquaduct. Het laagste punt (noordoostkoker,
zuidoostkant) ligt ellipsoïdisch op 34,616 m (NAP -8,41 m); dat is z = 0
(`groundOffsetMetres` 0) en ook de `groundHeight` als terugval. Hoogtes in
het script zijn NAP met z = NAP + 43,03 - 34,616; 43,03 m is het verschil
tussen PDOK (ellipsoïdisch) en AHN, gemeten op de dijk en de rijbaan naast de
bak. Het aquaduct is geen BAG-pand en vervangt dus niets.

Waterspiegel en PDOK-terrein: de PDOK-terreintegels hebben op de plek van de
bak alleen het water (ellipsoïdisch 42,54 tot 42,63 m, NAP circa -0,43 m) en
de BGT-bakwanden als scheidingen, die vanaf het wegdek schuin oplopen tot
42,3 à 43,2 m; de weg onder de bak ontbreekt, zodat de verdiepte N302 in de
PDOK-reconstructie tegen een grijze helling doodloopt. Het model:

- legt het water in de bak (`water:waterbak`) 7 cm boven het hoogste
  PDOK-water (ellipsoïdisch 42,70 m, NAP -0,33 m), zodat de twee vlakken niet
  samenvallen; buiten de bak sluit het PDOK-water van het meer er 7 tot 16 cm
  lager op aan;
- zet de bak- en vleugelwanden op NAP +1,52 m (AHN), 1,0 m boven de
  PDOK-scheidingen (+0,5 m), en de kopgevels 5 cm voor de BGT-rand
  (y = ±12,70), zodat de PDOK-scheidingen binnen het model vallen. De
  vleugelwanden zijn 5 cm rondom breder dan de BGT;
- legt de rijbanen op NAP -8,23 m (AHN bij beide portalen; het PDOK-wegdek ligt
  daar met zijn dwarshelling 0,2 m hoger of lager, gemiddeld gelijk) en het
  fietspad op NAP -5,95 m (AHN). Bij het noordwestportaal stapt het fietspad
  0,2 tot 0,7 m op naar het model; bij het zuidoostportaal helt het
  PDOK-fietspad zelf scheef op tot 3,5 m te hoog (al zo in de
  PDOK-reconstructie).

Een landmarkmodel kan niet in het PDOK-terrein snijden: in de tunnelmonden
blijft op de kaart de schuine PDOK-scheiding staan, 0,1 tot 1,5 m achter de
kopgevel, en in een kaartprint vult het PDOK-terrein (een hoogteveld op de
waterspiegel) de kokers op. Alleen het losse STL-model heeft doorgaande
kokers. 8000 verticale stralen over het model in een verse PDOK-dump: op 8
punten ligt PDOK hoger dan het model, allemaal in de hoeken waar de schuine
kolommen aan de buitenste tunnelwanden in de PDOK-keermuren en het groen op de
dijk staan (het model valt daar dus in PDOK, niet andersom).

Onderdelen in het model (hoogtes in NAP):

- De waterbak: een betonnen U-bak dwars over de verdiepte weg, aan beide
  kopse kanten open naar het meer. Vaargeul 19,3 m breed tussen de
  binnenkanten van de wanden (BGT-vleugelwandstrook langs de bak, Wikipedia
  19 m), wanden van 3,1 m (|y| 9,65 tot 12,75; BGT-bakwanden
  `P0025.7da7890b`, `.17a5a4c0`, `.95534231`, `.6ac5668d` plus de strook van
  de vleugelwanden) tot +1,52 m (AHN), bakvloer op -2,6 m.
- Drie kokers onder de bak tussen vier tunnelwanden (BGT, relatieve
  hoogteligging -1): buitenwanden van 1,64 en 1,73 m (`P0025.5a75dd90`,
  `.a33789d5`), de tussenwand naast de fietskoker (`.8eccf91b`, 0,58 m) en de
  middenwand (`.2ca6f3c4`, 0,83 m), beide verdikt tot 0,9 m. De fietskoker
  aan de zuidwestkant (4,2 m breed) met het fietspad op -5,95 m, de twee
  rijbaankokers (9,0 m breed) met de rijbanen op -8,23 m; het plafond op
  -3,5 m (vrije hoogte 4,7 m boven de rijbaan, 2,45 m boven het fietspad).
- In beide portalen: een randbalk van 0,9 m onder het plafond over de
  rijbaankokers (onderkant -4,0 m), een verdiepte gevelstrook van 0,35 m
  (-2,9 tot +0,9 m, de bovenrand onder 45 graden) onder de 0,6 m hoge
  wandkop, en voor elke tunnelwand een schuine kolom (0,9 m uitsprong aan de
  voet, 0,4 m bovenaan, tot -2,0 m), zoals de wigvormige kolommen op de
  foto's.
- De vier lensvormige vleugelwanden (BGT `P0025.a687a766` aan de
  noordwestkant en `P0025.37ef7a18` aan de zuidoostkant, ruim 1 m dik,
  vereenvoudigd tot 5 cm) die de vaargeul aan beide kanten naar het meer
  verbreden, met punten op x = -42,9 en 42,85, tot +1,52 m (AHN +1,50).
  Ze lopen tot de vlakke onderkant van het model en verdwijnen op de kaart in
  het water en de PDOK-eilandjes.
- Het water in de bak tot -0,33 m (zie boven), 2,3 m diep.
- Het wegdek als twee eigen nodes met in `extras.attributes` de waarden van
  de BGT-wegdelen onder de bak (relatieve hoogteligging -1): `road:rijbaan`
  (`bgt_functie` `rijbaan regionale weg`, `bgt_fysiekvoorkomen` `gesloten
  verharding`, `plus_fysiekvoorkomen` `asfalt`; vier wegdelen
  `P0025.fd1d608460f7`, `.fd1d608460fa`, `.fd1d608460fc`, `.fd1d60846100` in
  de twee rijbaankokers) en `road:fietspad` (`fietspad`, gesloten verharding,
  asfalt; `P0025.fd1d608460f5`). Elke laag is de bovenste 0,5 m van de vloer
  van een koker, 2 cm vrij van de tunnelwanden; er steekt verder niets boven
  het wegdek uit. Het water heeft als `water:waterbak` het attribuut
  `bgt_type` `watervlakte` van het BGT-waterdeel `L0002.86f5ff7b` dat over de
  bak loopt. De volumes tellen op tot brug en water samen (6062,3 m³:
  constructie 4561,7 + water 1213,6 + rijbaan 232,8 + fietspad 54,3 m³);
  geen samenvallende vlakken tussen de nodes (`zfight.py`, 30 000 verticale
  stralen over het wegdek en 30 000 over het hele model).

Waarom de weg wel een node heeft en de bak geen fietspad: het aquaduct draagt
water, geen weg. Op en langs de bak ligt geen BGT-wegdeel (de looprand met
leuning op de wanden is in de BGT kunstwerkdeel), dus geen `road:`-node
bovenop; de weg die eronderdoor gaat zit wel in het model (de
kokers) en krijgt de BGT-attributen van de wegdelen onder de bak, zodat een
kleurregel voor rijbanen of fietspaden er net zo op werkt als op de PDOK-weg
ernaast. Het water krijgt een eigen node, omdat het PDOK-water anders door de
open bak van het model zou samenvallen met een modelvlak of 2,3 m dieper zou
liggen dan de wanden suggereren.

Niet in het model: de blauwe leuningen op de wanden en langs het fietspad,
de lantaarnpalen en de matrixborden aan de randbalk (dunner dan 0,9 m), de
oranje bekleding van de keermuren langs de verdiepte weg (die keermuren horen
niet bij de bak en staan in PDOK), de trapjes van de wanden naar de eilandjes
(treden kleiner dan 0,9 m, in het PDOK-terrein), en de vier hoekblokken van
0,9 × 1,2 m aan de uiteinden van de bakwanden (BGT; in het AHN niet hoger dan
de wandkop, dus niet te onderscheiden van de wand).

Printbaarheid op 1:1000: wanden en kolommen zijn minstens 0,9 mm dik, de
kokers hebben een vlak plafond van 4,2 en 9,0 mm breed. In de printcheck op
1:1000 (uitsnede van 115 m, 379 ms) zijn alle onderdelen NoError; de
constructie krijgt +39,5 % opvulling (5339 naar 7447 mm³): de export zet onder
de vlakke plafonds van de drie kokers wiggen en wanden (te zien in de
printrender). Water, rijbaan en fietspad krijgen +0 %. In een kaartprint
liggen de kokers onder het PDOK-water en zijn ze toch gevuld; daar steken de
wanden 1,85 mm boven het water uit.

Bronnen: [Aquaduct Veluwemeer (Wikipedia)](https://nl.wikipedia.org/wiki/Aquaduct_Veluwemeer)
(25 m lang, 19 m breed, 3 m water, 2 × 2 rijstroken en een fietskoker);
BGT kunstwerkdeel (bakwanden, tunnelwanden en vleugelwanden), wegdeel
(rijbanen en fietspad onder de bak) en waterdeel via de PDOK OGC API; AHN DSM
en DTM 0,5 m (PDOK WCS) voor de wandkoppen (+1,52 m), de rijbaan (-8,23 m bij
de portalen) en het fietspad (-5,95 m); PDOK-luchtfoto (Actueel_orthoHR, 8 cm) voor de
plattegrond; de PDOK 3D-terreintegels voor het water, het wegdek en de
scheidingen in en naast de bak; Wikimedia Commons: *Aquaduct Veluwemeer
(1).jpg* en *(2).jpg* (het noordwestportaal vanaf de dijk), *(3).jpg* (de
vleugelwanden en de wandkop) en *Veluwemeer Aquaduct.jpg* (het portaal vanaf
de rijbaan).

Geschat: het plafond van de kokers (-3,5 m) en de randbalk (-4,0 m) uit de
foto's en de minimale vrije hoogte van het fietspad, de bakvloer (-2,6 m;
daardoor 2,3 m water in plaats van 3 m, anders past het plafond niet boven de
fietskoker), de verdiepte gevelstrook en de maten van de schuine kolommen
(foto's), het water 7 cm boven het PDOK-water, en de dikte van de twee
binnenste tunnelwanden (0,9 m voor het printen, echt 0,58 en 0,83 m).

Licentie van het model: eigen werk op basis van open bronnen.
