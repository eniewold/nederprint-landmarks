# Andrej Sacharovbrug (Arnhem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `andrej-sacharovbrug.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het wegdek met de BGT-attributen, zie hieronder) en `building:andrej-sacharovbrug` met de rest van het kunstwerk: de twee kokerliggers met schampkanten, scheiding en geleiderrail, de twee V-pijlers op hun poeren, de twintig schijven van de tien schijfpijlers en de twee landhoofden met de koppen van de vleugelwanden |
| `andrej-sacharovbrug-1-2000.stl` | De brug als geheel in één stuk (constructie en wegdelen samen, ongewijzigd) op 1:2000 met een printvoet onder het dek en dichtgezette V-openingen, met de onderkant (0,8 m onder de waterspiegel) op het printbed (386 × 21 × 11 mm; met `--scale` een andere schaal, op 1:1000 is hij 772 mm lang) |
| `andrej-sacharovbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (192809,19, 441243,80) (WGS84
51,95834 N, 5,93727 O, vrijwel op de controle-URL), op de as van het dek
midden in de hoofdoverspanning, op de waterspiegel van de Nederrijn zoals het
PDOK-terrein die legt (51,83 m ellipsoïdisch, NAP +8,17 m) en de
glTF-conventie Y omhoog. +X loopt langs het rechte middendeel van de brug naar
het oostnoordoosten, naar Huissen en Velperbroek (`xAxis` (0,88788, 0,46007),
27,39 graden linksom vanaf het oosten, uit de BGT-randen van het dek), +Y naar
het noordnoordwesten, de kant van het fietspad. Het dek is recht tussen
x = -122 en 122 en buigt daarbuiten aan beide kanten in een boog met een
straal van 2447 m naar +Y af (fit op de BGT-dekranden, restfout 8 cm; aan de
einden ligt de as 13,7 m naast de rechte lijn); dek, schampkanten, wegdek en
pijlers volgen die boog. De V-pijlers staan op x = -66,4 en 66,4 (hart van de
BGT-poer aan de zuidwestkant, gespiegeld), de schijfpijlers op x = ±146,9,
±195,9, ±245,0, ±293,7 (BGT, zuidwestkant, gespiegeld) en ±342,7 (geschat,
in het dijktalud), de landhoofden van x = ±380,2 tot ±384,5. Het maaiveld
wordt op zes punten op de rivier bemonsterd (`groundSamplePoints`: 25 m
naast de as op x = -40, 0 en 40); `groundOffsetMetres` is 0, want het
PDOK-terrein legt het water daar op 51,83 tot 51,87 m ellipsoïdisch.
`groundHeight` is 51,83 m, de PDOK-waterspiegel op die punten, zodat een
uitsnede die alleen een aanbrug raakt (waar de uiterwaarden 1 tot 3 m hoger
liggen) het model niet laat wegvallen of optillen. `replacesBuildings` is
leeg: onder de brug ligt geen BAG-pand, en PDOK reconstrueert de brug niet
(het BGT-wegdek ligt daar op het maaiveld).

Wegdelen met PDOK-attributen: de bovenste 0,5 m van het wegdek is per
BGT-functie een eigen node van klasse `road` met de attributen van de
actuele BGT-wegdelen erop (relatieve hoogteligging 1, zonder
`eind_registratie`) in `extras.attributes`, zodat de kleurregels van een
thema (fietspaden rood) op de brug werken zoals op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`, voorbeelden boven de rivier) | Waar |
| --- | --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan regionale weg | gesloten verharding | asfalt | `P0025.1e5d4f27df2c4413bb5afa46ecc68594`, `P0025.544096d6531340ef9cf6b0993c097cc1`, `P0025.7af509baa3384949817531452266385b`, `P0025.7e4c15861a614b0ca187a5f35c9c2586` (vier rijstroken, per 100 m een eigen vlak) | tussen de zuidoostelijke schampkant (y = -12,7) en de scheiding met het fietspad (8,5), met de vluchtstroken (berm asfalt) en de middenberm (berm cementbeton) behalve de geleiderrail |
| `road:fietspad` | fietspad | gesloten verharding | asfalt | `P0025.3d3a78b1426a4875a942a63f091f5376` (en per 100 m de volgende) | aan de noordwestrand tussen de scheiding (9,4) en de schampkant (13,1); BGT 9,1 tot 13,1 m naast de as |

Eén node per functie. De bermen (BGT ondersteunend wegdeel) in asfalt naast
de rijstroken en de middenberm (cementbeton, 2,8 m) horen bij de rijbaan; de
schampkanten aan beide randen (cementbeton, 1,1 en 1,5 m), de scheiding tussen
fietspad en rijbaan (BGT 0,55 m, in het model 0,9 m breed en 0,8 m hoog) en
de geleiderrail midden op de middenberm (1,0 × 0,8 m) blijven constructie.
De grens tussen rijbaan en fietspad is het midden van de scheiding, op
constante afstand van de gebogen as. De laag is een snijstrook over de volle
breedte en 0,5 m voorbij de landhoofden, van 0,5 m onder tot 1 m boven het
wegdek over de stations van het dek (om de 2 m); de schampkanten, de
scheiding, de geleiderrail en de koppen op de landhoofden blijven over hun
hele hoogte met 2 cm vrij constructie. De volumes tellen op tot die van de
brug als geheel (constructie 70.616 m³, rijbaan 7.743 m³, fietspad 1.412 m³,
samen 79.771 m³, geen overlap; het script controleert dat). De rijbaan bestaat
uit twee stukken (de geleiderrail scheidt de rijrichtingen). Verticale
stralen (`zfight.py`, 30.000 punten over het dek en over het hele model)
vinden geen samenvallende bovenvlakken en geen vlakken zonder dikte. De STL
is ongewijzigd: het hele brugmodel in één stuk.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 764 m tussen de BGT-einden (769 m met de landhoofden), 28,36 m
  breed, als twee kokerliggers naast elkaar met de grens midden in de
  middenberm (y = -2,3): de zuidoostelijke van 11,9 m (twee rijstroken), de
  noordwestelijke van 16,5 m (twee rijstroken en het fietspad). Het wegdek
  volgt het AHN-DSM als regelmatig lengteprofiel: top +28,22 m in het midden,
  een topboog met een straal van 7000 m tot x = ±140 en daarbuiten 2,0 %
  naar +21,9 m bij de landhoofden (restfout 9 cm). Per ligger een dekplaat
  van 0,6 m aan de rand tot 1,0 m bij de lijven, daaronder een koker met
  licht schuine lijven (0,5 m) zo breed als de schijven.
- De toog: de onderkant van de kokers ligt over de aanbruggen 3,8 m onder
  het wegdek (+22,9 m), boven de V-pijlers 4,6 m (+23,3 m) en loopt in de
  hoofdoverspanning parabolisch op naar 2,6 m in het midden (+25,6 m); in de
  zijoverspanningen loopt hij in 22 m terug naar 3,8 m.
- De twee V-pijlers aan de oevers (hoofdoverspanning 132,8 m, Wikipedia
  133 m): per ligger een V in het vlak van de ligger, 18 m breed onder het
  dek en 4,2 m aan de voet, met poten van 4 m (horizontaal) en een V-vormige
  opening tot 2,2 m boven de voet; de V's staan 11,8 m hoog op een gezamenlijke
  poer volgens de BGT (4,8 × 27,1 m met ronde koppen, bovenkant +11,5 m).
- Tien schijfpijlers (zijoverspanningen 80,5 m, Wikipedia 80 m, en aan elke
  kant vijf aanbrugvelden van 49 m, het laatste 37,5 m): per ligger een schijf
  van 1,4 m dik (BGT) zo breed als de koker (7,9 en 12,5 m, samen de 23 m van
  de BGT-pijler) met 2,6 m ertussen, loodrecht op de gebogen as.
- De twee landhoofden als blokken onder het dekeinde in het dijktalud, en op
  de schampkanten erboven de koppen van de vleugelwanden (3,5 m lang, 1,6 m
  boven het wegdek, foto).

Wat er niet in zit: lantaarnpalen, leuningen en geleiderails op palen (kleiner
dan 0,9 m), het seinportaal boven de rijbaan bij x = 146 (een vrije overspanning
van 28 m van buizen en een balk die op 1:1000 niet zonder steun print),
dilatatievoegen, afwateringsgoten en de bekleding van de dijktaluds onder de
landhoofden (PDOK-terrein). Het fietspad sluit aan beide einden op de
PDOK-wegdelen op de dijk aan.

Binnen het dek (24 m brede strook, AHN-DSM 0,5 m) ligt 88 % van de cellen
binnen 1 m van het wegdek van het model (92 % binnen 2 m, mediaan +0,04 m; de
rest is verkeer, lantaarns en gaten in het DSM).

Printbaarheid op 1:1000: dragende delen zijn minstens 1,4 m (schijven) en
4 m (V-poten); de buitenkant van de V-poten helt 30 graden, de binnenkant 24
graden ten opzichte van de verticaal. Vrij hangen alleen de onderkant van de
kokers en van de uitkragende dekplaat, en de bovenkant van de V-openingen (de
onderkant van het dek, 10 m breed); samen 19.697 m². Het script controleert dat
alles op dezelfde onderkant begint en dat de printversie (met een wig van
minstens 50 graden vanaf de dekrand onder de kokerhoeken door, een scherm van
0,9 m in de spleet tussen de schijven en dichtgezette V-openingen) geen
overhang heeft (0,45 m² aan losse facetjes). Met 772 m past de brug op
1:1000 niet in één uitsnede. In de printcheck (gesloten solid met
overhangopvulling, status `NoError` voor alle drie de nodes): de hele brug op
1:2000 (363 mm) +121 % opvulling (wig en scherm onder 764 m dek), op de
grootste uitsnede (400 mm, 1:1814) +156 %; een uitsnede van 380 m rond de
hoofdoverspanning op 1:1000 −12 % (de opvulling valt binnen het al gevulde
volume onder het dek). De wegdelen krijgen geen eigen opvulling (+0,3 % en
0 %): de constructie draagt alles.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Andrej_Sacharovbrug)
(lengte 760 m, hoofdoverspanning 133 m, zijoverspanningen 80 m,
kokerliggerbrug van BVN, in gebruik sinds 3 november 1987); PDOK BGT
overbruggingsdeel (dekdelen `P0025.98afc1c078bc4528b6090e4430c65a6e` en
`P0025.533a27f4388b44bfb501ea5188bc4e5d`, landhoofden, de V-poer
`L0002.ae1b308a8fc64eab8572a9f8560f4ea5` en vier schijfpijlers), wegdeel en
ondersteunend wegdeel; AHN DSM/DTM 0,5 m (PDOK WCS) voor het wegdek en de
uiterwaarden; PDOK-luchtfoto voor het dwarsprofiel; PDOK-terrein voor de
waterspiegel (PDOK = NAP + 43,66 m op de uiterwaarden); Wikimedia
Commons-foto's: *Andrej Sacharovbrug.jpg*, *Andrej Sacharovbrug 2015-1.jpg*,
*Andrej Sacharovbrug 2015-2.jpg* (Apdency, CC0), *Andrej Sacharovbrug
(Arnhem).jpg* (Erik Wannee, CC0) en *Arnhem 27 Januari 2014 Andrej Sacharov
bridge at sumdawn - panoramio.jpg*.

Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek en
maaiveld): de constructiehoogtes (3,8, 4,6 en 2,6 m), de V-vorm (18 m breed,
voet 4,2 m, poten 4 m, opening tot 2,2 m boven de voet) en de bovenkant van
de poer (+11,5 m), de kokerbreedtes en de spleet tussen de schijven, de
vijfde schijfpijler bij elk landhoofd (in het dijktalud, niet in de BGT),
de hoogtes van schampkanten (0,6 m), scheiding en geleiderrail (0,8 m) en de
koppen op de landhoofden. De vorm van de noordoostelijke helft is de
gespiegelde zuidwestelijke (BGT-pijlers en de V-poer alleen aan de
zuidwestkant ingemeten; de dekranden zijn symmetrisch).

Licentie van het model: eigen werk op basis van open bronnen.
