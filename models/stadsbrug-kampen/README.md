# Stadsbrug (Kampen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadsbrug-kampen.glb` | Catalogusbron in meters met vier nodes: `road:rijbaan`, `road:fietspad` en `road:voetpad`, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in `extras.attributes` (`bgt_functie` rijbaan lokale weg, fietspad of voetpad, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt), en `building:stadsbrug-kampen` met de rest van het kunstwerk: de aanbruggen met kolompijlers en landhoofden, het hefdeel, de rivierpijlers met dienstplatforms, de vier heftorens met wielen en contragewichten, het bedieningsgebouw en de vijf schanscaissons |
| `stadsbrug-kampen-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder het dek, met de onderkant (1,0 m onder de waterspiegel) op het printbed (219 × 87 × 24 mm) |
| `stadsbrug-kampen.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, het vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (191081,64, 508147,19) (WGS84
52,55975 N, 5,91929 O), op de as van het BGT-dek midden tussen de twee
rivierpijlers, op de waterspiegel van de IJssel zoals het PDOK-terrein die
legt (ellipsoïdisch 42,32 m, NAP -0,31 m; z = NAP + 0,31) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar het noordoosten, naar de
oostoever bij het station (`xAxis` (0,81379, 0,58111), 35,53 graden linksom
vanaf het oosten), +Y naar het noordwesten, stroomafwaarts. Het dek loopt van
x = -140,2 (boven de lage kade aan de IJsselkade) tot 79,2 (op de dijk aan de
oostkant); de rivierpijlers staan op x = -20,55 tot -15,35 en 15,4 tot 20,6,
het hefdeel ligt tussen de voegen op x = ±15,5, de torens op x = ±18,25. Het
maaiveld wordt op acht punten op het water bemonsterd (`groundSamplePoints`,
25 m naast de as op x = -100, -60, 0 en 40, tussen de schanscaissons door);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de IJssel binnen 0,02 m
op de waterspiegel van het model. Omdat de brug 219 m lang is, staat er een
ellipsoïdische `groundHeight` van 42,31 m (de laagste PDOK-terreinhoogte op
die punten) als terugval voor een uitsnede die alleen een uiteinde raakt.
`replacesBuildings` bevat het bedieningsgebouw (BAG-pand 0166100000030487,
in de PDOK-reconstructie een kolom vanaf het water tot NAP +13,4 m); er ligt
geen ander pand onder de brug.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 219,4 m, 20,2 m breed (BGT), met het wegdek volgens het AHN-DSM
  om de 4 m: +4,05 m aan de IJsselkade, +7,33 m bij de westelijke pijler,
  +6,67 m bij de oostelijke en +4,66 m op de dijk. Bij de AHN-opname stond het
  hefdeel open; daar loopt het wegdek lineair tussen de pijlers. De
  aanbruggen als betonplaat van 0,9 m met liggers tot 1,5 m onder het wegdek
  (binnen 7,0 m van de as), het stalen hefdeel als plaat van 0,8 m met
  hoofdliggers tot 1,8 m (binnen 8,8 m). Langs beide randen een schampkant van
  0,9 × 0,6 m in plaats van de glazen leuningen, en tussen fietspad en voetpad
  een band van 0,95 m breed en 0,3 m hoog (de BGT-strook tussen beide). Voegen
  van 0,4 × 0,3 m over het dek aan de uiteinden van het hefdeel.
- Het hefdeel van 31,0 m in gesloten stand tussen de rivierpijlers.
- Vier heftorens, op elke pijler één aan elke dekrand, 4,0 m langs de brug en
  4,25 m dwars (y = ±6,95 tot ±11,2: de binnenste poot staat op de band
  tussen fietspad en voetpad, de buitenste buiten de dekrand). Het raamwerk
  van poten en dwarsregels heeft de openingen als blinde nissen van 0,35 m:
  vier rijen van 2,0 × 1,8 m op de zijvlakken (NAP +9,8 tot +18,7 m), drie op
  het kopvlak aan de kant van het hefdeel en één aan de landzijde. Het voetpad
  loopt tussen de poten door, onder een doorgang van 2,25 m breed met een
  spitse top van 55 graden (top 4,1 m boven het wegdek). Boven de schouder
  (+19,3 m) een kop die naar de as smaller wordt met de naaf, en aan
  weerszijden een wiel van 3,6 m en 0,9 m dik met acht spaken als nissen van
  0,3 m op het buitenvlak, top +22,9 m (AHN). Aan de landzijde het
  contragewicht van 5,2 × 1,6 m van +15,3 tot +18,6 m (hoog, want de brug is
  dicht), met een afgeschuinde bovenrand en een schuine onderkant van 45
  graden naar de toren.
- De rivierpijlers (BGT, 5,2 × 34,1 m met afgeschuinde punten) tot +3,9 m, met
  onder het einde van elke aanbrug de bovenbouw tot onder de plaat.
- Het bedieningsgebouw (BAG) op de noordwestpunt van de oostelijke pijler:
  een kolom die van de BAG-contour (3,5 × 5,1 m) naar 4,5 × 5,9 m breder
  wordt, de glazen kabine als terugliggende band van 0,3 m (+10,4 tot
  +11,6 m), een ronde dakrand van 6,4 m onder 45 graden en een lage koepel tot
  +13,36 m (PDOK-hoogte).
- Dienstplatforms op de drie andere pijlerpunten: ellipsen van 3,2 × 4,4 m tot
  +6,4 m (AHN +6,0 tot +7,0 m), binnen de contour van de pijler.
- De kolompijlers van de aanbruggen: drie aan de westkant (x = -110,3, -80,4 en
  -50,5, vier gelijke velden) en één aan de oostkant (x = 46,0), elk een kesp
  van 1,8 × 16 × 1,2 m op vier ronde kolommen van 1,3 m.
- Landhoofden onder de uiteinden van het dek (x = -140,2 tot -137,2 en 75,7
  tot 79,2).
- De vijf schanscaissons in de rivier (BGT kunstwerkdeel, 3,1 × 6,6 tot
  3,1 × 11,4 m, in het verlengde van de pijlers en bij x = -51): wanden tot NAP
  0 en een schuine bovenkant tot een nok op +1,2 m.

Wegdek met PDOK-attributen: op het dek liggen vijftien actuele BGT-wegdelen
met relatieve hoogteligging 1, alle met fysiek voorkomen `gesloten verharding`
en plus fysiek voorkomen `asfalt`, gesplitst op x = ±15,5 bij het hefdeel:
rijbaan lokale weg (G0166.e9c72eb0812643aeb8b2f3d4143c63aa,
G0166.9016eadf254f489b9f91c7ced0f66f07, G0166.c12000fd3fe941b58fd2c40a3c826527;
y = -3,35 tot 3,35), fietspad (G0166.048af3508d2b4762a1b0485d1e8acb4e,
G0166.1fab09c04a5f4be093dceefdc63d67ee, G0166.438d75b2c1324ab6920bfc9200312968
aan de noordwestkant, G0166.aea049646b8b4e7684e239455fbeaf0d,
G0166.870c7fc4075d4aa2bafba14f6ba69f59, G0166.5a8f1e3045d1439b8adc3de79d4c4a2a
aan de zuidoostkant; 3,8 tot 6,9 m naast de as) en voetpad
(G0166.0ac7af8f051c4c0b8844179dc560bacf, G0166.c56d685e1bdc4cc19b8041715311e040,
G0166.0d3947f48a2b4e6f83c5f074de5e4729, G0166.7ba0741ffa3646688fc5f9ef53c3b783,
G0166.f5ad403484054f028d5efbf45d88daa8, G0166.cdd1c7eba5d94dd59266cb5e9e49e651;
7,85 tot 10,0 m naast de as). Het model maakt daarvan de nodes `road:rijbaan`,
`road:fietspad` en `road:voetpad` met in `extras.attributes` `bgt_functie`,
`bgt_fysiekvoorkomen` en `plus_fysiekvoorkomen`. Elk wegdeel is de laag van
0,5 m onder het wegdek: een snijstrook tussen de buitenste schampkanten van
0,5 m onder tot 1 m boven het wegdek, met fietspad en voetpad als strook ∩ de
BGT-vlakken (lokaal, vereenvoudigd tot 5 cm; de voetpaden die 0,7 m voor het
dekeinde ophouden lopen door tot het dekeinde) en de rijbaan als de rest
(inclusief de 0,45 m tussen rijbaan en fietspad). De schampkanten, de band
tussen fietspad en voetpad, de torens (behalve de doorgang van het voetpad)
en de voegen blijven met 2 cm vrij constructie. Het voetpad loopt dus door de
torens heen en houdt aan de buitenrand 9,2 m naast de as op (de schampkant).
Volumes: brug 10.674 m³, constructie 8804 m³, rijbaan 931 m³, fietspad
655 m³, voetpad 284 m³; samen precies de brug (het script controleert het).
De verticale-stralencontrole (30.000 punten over het dek) vindt geen
samenvallende vlakken tussen de nodes; alleen één punt in de knik onder een
wiel van de oostelijke noordwesttoren, waar de onderkant van het wiel de
schuine kop raakt.

Wat er niet in zit: de glazen windschermen en leuningen, lantaarnpalen,
verkeerslichten, portalen en slagbomen, de kabels van de wielen naar het
hefdeel en de contragewichten (alle dunner dan 0,9 m), de stalen frames en
leuningen op de pijlerpunten (buizen), het houten remmingwerk langs de
pijlers en de meerpalen in de rivier (losse palen en balken), de spaken als
open wiel (op 1:1000 een vrij hangende velg; nu nissen) en de open stand van
het hefdeel. De torens zijn in het echt een open raamwerk; op 1:1000 worden
de openingen nissen, omdat de dwarsregels anders vrije horizontale
overspanningen van 2 m zijn.

Pasvorm op het AHN: het wegdek volgt het DSM binnen 0,05 m (25e percentiel
per 4 m over rijbaan en fietspaden; de voetpaden zijn roosters waar het AHN
0,8 m lager doorheen kijkt, het model houdt ze op de hoogte van het wegdek).
De torens vallen in de DSM-cellen boven NAP +14 m (x = -20,5 tot -16,0 en
16,5 tot 21,0; y = ±7 tot ±11,5), de wieltoppen op de hoogste cellen (+22,8
tot +22,9 m), de contragewichten op de cellen van circa +17 m aan de
landzijde, de pijlerkoppen op +3,8 tot +3,9 m, de platforms op +6,0 tot +7,0 m
en de koepel van het bedieningsgebouw op +13 m (PDOK +13,36 m). Op de
luchtfoto staan de torentoppen 4 m naar het zuidoosten en 2 m naar het
zuidwesten verschoven (scheefstand van 0,18 m per meter hoogte); het model
volgt het DSM.

Printbaarheid op 1:1000: de koppen van de torens lopen onder 48 tot 50 graden
naar de as, de doorgang van het voetpad heeft een spitse top van 55 graden,
de onderkant van de contragewichten en de dakrand van het bedieningsgebouw
staan op 45 graden; de openingen van de torens en de spaken zijn blinde nissen
van 0,3 tot 0,35 m. Vrij hangen alleen de onderkant van het dek (4099 m²),
de bovenkant van de nissen (81 m²), de onderkant van de wielen boven de kop
(16 m²) en wat kleine randen (5 m²). In de export gaan de constructie
(genus 3 over zes stukken: de brug en de vijf losse schanscaissons) en de
wegdelen samen met overhangopvulling door, die naar de constructie gaat: de
printcheck op 1:1000 (uitsnede 220 m, 220 mm) geeft status NoError voor alle
vier onderdelen, constructie 9,0 cm³ tegen 24,4 cm³ met opvulling (+172 %, de
wig met scherm onder het vrij hangende dek), rijbaan +0,3 %, fietspad +1,3 %,
voetpad 0 %, 3,4 seconden. De STL heeft dezelfde soort printvoet (wig van 50
graden vanaf de dekrand die uitloopt in een scherm van 0,9 m tot de
onderplaat; 27,7 cm³ in totaal). Het PDOK-weglint van de Stadsbrug hangt in
de reconstructie als een lint over het water door (NAP 0 tot +1,6 m) en blijft
onder het dek zichtbaar; dat is geen pand en wordt niet vervangen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Stadsbrug_(Kampen))
(hefbrug van Zwarts & Jansma Architecten, geopend in 1999, 210 m lang, 20 m
breed, hefdeel 30 m; vijf schuin oplopende schanscaissons uit 2016 als
aanvaarbeveiliging, grotendeels onder water),
PDOK BGT (overbruggingsdeel G0166.07fb9aff438644b99882747a967d0a24 voor het
dek, G0166.2e83d8ec5b0744c4a841353ff9676f11 en
G0166.c824ea6509294b57a088c613661e184d voor de rivierpijlers; de wegdelen
hierboven; kunstwerkdeel voor de schanscaissons), PDOK BAG (pand
0166100000030487, bedieningsgebouw), PDOK AHN (dsm en dtm 0,5 m via WCS:
wegdek, torens, contragewichten, pijlers, platforms, bedieningsgebouw), de
PDOK-luchtfoto (8 cm: wielen, contragewichten, platforms, dak van het
bedieningsgebouw), het PDOK-terrein (waterspiegel) en Wikimedia
Commons-foto's (Kampen, stadsbrug. 10-01-2022. (actm.) 01 en 02.jpg; Kampen,
de Stadsbrug foto10 2016-02-17 10.35.jpg; Kampen - stadsbrug - 2017.jpg;
Stadsbrug bridge Kampen 2019.jpg, 2019 3.jpg en 2019 5.jpg; Kampen stadsbrug
hefgedeelte.jpg; Kampen Hefbrug.jpg; Kampen - stadsbrug.JPG; Stadsbrug Kampen
- schanscaissons oostzijde.jpg; Stadbrug Kampen - Schanscaisson -
westzijde.jpg) voor het raamwerk van de torens, de wielen met acht spaken, de
vorm van de contragewichten, het bedieningsgebouw, de kolompijlers en de
schanscaissons. Geschat zijn de plaats van de kolompijlers (niet in de BGT en
onder het dek niet in het AHN; op de foto's drie aan de westkant en één aan
de oostkant, hier op gelijke velden), de kolommen (vier van 1,3 m) en de kesp,
de constructiehoogtes (aanbruggen 1,5 m, hefdeel 1,8 m), de maten van het
raamwerk en de rijen openingen, de wielen (3,6 m, 0,9 m dik), de
contragewichten (5,2 × 1,6 × 3,3 m), de vorm van de kolom en de kabine van het
bedieningsgebouw, de vorm van de platforms en de hoogte van de schanscaissons
(+1,2 m); de waterspiegel is die van het PDOK-terrein (NAP -0,31 m), die met
de stand van de IJssel meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
