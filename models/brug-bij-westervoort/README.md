# Brug bij Westervoort (Westervoort)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `brug-bij-westervoort.glb` | Catalogusbron in meters: nodes `building:spoorbrug-noord` en `building:spoorbrug-zuid` (de twee enkelsporige spoorbruggen met hun gebogen vakwerkligger en de betonnen aanbruggen), `building:verkeersbrug` (veelhoekige vakwerkligger, rijvloer met inspectiepad, aanbruggen op stalen vakwerkliggers), `building:fietsbrug` (A-vakwerk, aanbrugplaat op smalle wanden, oostelijk landhoofd) en `building:pijlers` (twee rivierpijlers, negen aanbrugpijlers met betonnen opleggers, landhoofden), plus de wegdelen `road:spoor`, `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van de dekken met de BGT-attributen in `extras.attributes`, zie hieronder) |
| `brug-bij-westervoort-1-2500.stl` | De vier bruggen in één stuk (alle onderdelen samen, ongewijzigd door de wegdelen) op 1:2500 met een printvoet onder de dekken, met de onderkant (0,8 m onder de waterspiegel) op het printbed (223 × 15 × 11 mm; `--scale 1000` geeft 558 mm) |
| `brug-bij-westervoort.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, hoofdmaten en bronnen |

De Brug bij Westervoort is volgens Wikipedia de combinatie van vier losse
bruggen naast elkaar over de IJssel tussen Arnhem en Westervoort: twee
enkelsporige spoorbruggen (1980 en 1984), de verkeersbrug (1971) en de
fietsbrug (1981). Alle vier zitten in het model, elk als eigen node, omdat
ze samen de herkenbare oversteek vormen: vier vakwerken naast elkaar op
dezelfde rivierpijlers. De A12-brug een kilometer stroomafwaarts is een
apart bouwwerk en zit er niet in.

De GLB is in meters met de oorsprong op RD (194314,0, 442496,8), midden
tussen de twee rivierpijlers op de grens tussen de verkeersbrug en de
zuidelijke spoorbrug, op de waterspiegel van de IJssel (NAP +8,3 m, AHN) en
de glTF-conventie Y omhoog. +X loopt langs de brug naar Westervoort
(`xAxis` (0,68327, -0,73016), -46,9 graden vanaf het oosten, langs de
sporen in de BGT), +Y stroomafwaarts naar het noordoosten. De spoorbruggen
liggen op +Y (sporen op y = 3,76 en 10,7), de verkeersbrug op y = -12,3 tot
-0,5 en de fietsbrug op y = -18,5 tot -12,6. Het westelijke landhoofd
(Arnhem) ligt op x = -213 tot -206, de rivierpijlers op x = -62,3 tot -56,2
en 56,4 tot 62,2, het oostelijke landhoofd op x = 329,4 tot 341 en het
landhoofd van de fietsbrug tot x = 345. Het maaiveld wordt op zes punten op
het water van de IJssel naast de hoofdoverspanning bemonsterd
(`groundSamplePoints`, 28 m stroomafwaarts en 30 m stroomopwaarts van de
as op x = -20, 0 en 20; de uiterwaarden liggen 2,5 tot 3,5 m hoger en
zouden het model optillen). `groundOffsetMetres` is 0, want het
PDOK-terrein legt de IJssel binnen 0,01 m op de waterspiegel van het model;
`groundHeight` 51,48 (ellipsoïdisch, de PDOK-waterhoogte op die punten) is
de terugval voor een uitsnede die alleen een aanbrug raakt. Geen BAG-pand
onder de brug.

Wegdelen met PDOK-attributen: de bovenste 0,5 m van elk dek is een eigen
node van klasse `road` met de attributen van het actuele BGT-wegdeel erop
(relatieve hoogteligging 1, zonder `eind_registratie`), zodat de
kleurregels van een thema (fietspaden rood, spoor zwart) op de brug werken
zoals op de PDOK-wegdelen ernaast:

| Node | Attributen | Waar | BGT-wegdelen (`lokaal_id`) |
| --- | --- | --- | --- |
| `road:spoor` | `bgt_functie` spoorbaan, `bgt_fysiekvoorkomen` gesloten verharding | beide spoordekken, over de rivier tussen de vakwerkwanden | `L0004.aa8fedb55d820c8fe05332a1e90a2c91` (zuid) en `L0004.aa8fedb55e540c8fe05332a1e90a2c91` (noord), gesloten verharding, x = -146,7 tot 322; `L0004.aa8fedb55d9e0c8fe05332a1e90a2c91` en `L0004.aa8fedb55e2d0c8fe05332a1e90a2c91`, half verhard, beide sporen van het westelijke landhoofd tot x = -146,7 en van x = 322 tot het oostelijke landhoofd |
| `road:rijbaan` | `bgt_functie` rijbaan regionale weg, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | het wegdek van de verkeersbrug, over de rivier tussen de vakwerkwanden | `L0002.8f05055e0db0404eb7873f0e5834944f` |
| `road:fietspad` | `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | het dek van de fietsbrug, over de rivier tussen de zijvlakken van het A-vakwerk | `L0002.1bbf84598b5442638fcc3145627ba8ed` |

Elk wegdeel ligt op één dek, dus elk dek krijgt als geheel één functie. De
randen van de BGT-vlakken wijken tot 3 m af van de dekken (over de rivier is
het spoor in de BGT maar 1,9 m breed en loopt de rijbaan tot y = -11,8,
buiten de zuidelijke vakwerkwand; op de aanbruggen is de rijbaan 5,8 m van de
9 m van het dek); het script controleert alleen dat de as van elk dek over
de hele lengte in een wegdeel van zijn functie ligt. Eén node per functie:
de twee stukken spoor van 61 en 17 m bij de landhoofden die de BGT als half
verhard (ballast) registreert, krijgen hetzelfde fysieke voorkomen als de
469 m gesloten verharding daartussen. Het inspectiepad buiten de zuidelijke
wand van de verkeersbrug blijft constructie. De wegdelen zijn een snijstrook
van 0,5 m onder tot 1 m boven het wegdek over de stations van de
aanbrugplaten en de vloer over de rivier; de vakwerkwanden (de hele strook,
ook onder de openingen) en de zijvlakken van het A-vakwerk (een verticaal
blok tot 2 cm voorbij de binnenkant van de wand op 1 m boven het wegdek)
blijven met 2 cm vrij constructie. Per brug tellen constructie en wegdeel op
tot het volume van de brug als geheel (spoorbruggen 10.737 + 1.545 en
10.707 + 1.534 m³, verkeersbrug 6.653 + 2.403 m³, fietsbrug 4.313 +
1.485 m³; de pijlers ongewijzigd 19.440 m³), en de stralencontrole vindt
geen samenvallende bovenvlakken tussen de onderdelen; de enkele vlakken
zonder dikte in de constructie (voet van de wanden, vakwerkliggers) zaten al
in het model zonder wegdelen.

Onderdelen in het model (hoogtes in NAP):

- Twee spoorbruggen, elk met een vakwerkligger van 117,2 m tussen de
  opleggingen (rivierpijlers 118,5 m hart op hart, BGT): twee wanden van
  1 m dik op 5,4 m van elkaar, symmetrisch om het spoor, met een gebogen
  bovenrand van +34,0 m in het midden die met een ronde eindstijl naar de
  oplegging zakt (+30,6 m op 36,6 m en +27,5 m op 51,3 m uit het midden,
  AHN), acht velden van 14,65 m met verticalen (foto's), en een vloer van
  1,8 m met het spoor op +21,45 m. Op de aanbruggen een betonnen ligger van
  3,8 m hoog onder elk spoor, met het spoor van +20,5 m op het westelijke
  landhoofd tot +21,45 m en +20,5 m op het oostelijke (AHN, om de 4 m).
- De verkeersbrug met een vakwerkligger van dezelfde lengte: wanden van
  1 m op 8,6 m van elkaar met een veelhoekige bovenrand (knikken op de
  bovenknopen, +33,25 m in het midden, +28,3 m op de eerste knoop, rechte
  eindstijlen), acht velden met verticalen, een rijvloer van 1,65 m met het
  wegdek op +20,97 m en het inspectiepad buiten de zuidelijke wand. Op de
  aanbruggen een rijvloer van 0,9 m (wegdek +19,5 m op het westelijke
  landhoofd, +20,7 m in het oosten) op twee stalen vakwerkliggers per
  overspanning tot +15,8 m, met doorgaande driehoeken tussen de diagonalen.
- De fietsbrug als driehoekig A-vakwerk over het fietspad: twee zijvlakken
  van 0,95 m die 16 graden naar binnen hellen van de randen van het dek
  (y = -18,5 en -12,6) naar een bovenregel van 1,6 m breed met de top op
  +31,3 m boven het midden (y = -15,55, AHN), elk vlak een Warren-vakwerk
  van acht velden met eindstijlen; het fietspad op +21,0 m loopt er
  doorheen. Op de aanbruggen een plaat van 1,2 m (fietspad van +19,25 m op
  het westelijke landhoofd tot +20,6 m in het oosten, AHN) op wanden van
  0,9 × 4,8 m (BGT) en het oostelijke landhoofd.
- Twee gemetselde rivierpijlers van 6,1 en 5,8 m breed van y = -11,5 tot
  18,4 met ronde koppen en een smalle uitbouw van 1,6 m onder de fietsbrug
  tot y = -19,7 (BGT), tot +19,35 m, met opleggers onder de vakwerkvloeren.
- Negen aanbrugpijlers (drie aan de Arnhemse kant op ongelijke afstanden,
  zes aan de Westervoortse kant op 43,6 m), 3,3 tot 6,4 m breed met ronde
  koppen (BGT): metselwerk tot +15,2 m en daarop betonnen opleggers onder
  elk spoordek en onder het wegdek. De landhoofden als blokken tot onder de
  dekken.
- Alle vakwerken zijn dichte wanden met doorgaande driehoekige openingen met
  de punt omhoog (binnen elke Λ van twee diagonalen, gedeeld door de
  verticaal) en blinde nissen van 0,35 m aan beide kanten voor de
  driehoeken met de vlakke kant boven (tussen twee Λ's onder de bovenregel):
  16 openingen en 14 nissen per wand bij de spoor- en verkeersbrug, 8 en 7
  per zijvlak bij de fietsbrug, en 98 openingen in de 22 vakwerkliggers
  onder het wegdek.

Wat er niet in zit: de windverbanden (X-verbanden in het bovenvlak) en de
eindportalen tussen de vakwerkwanden, omdat het horizontale vrije
overspanningen van 4,6 tot 8,6 m zijn die op 1:1000 niet zonder steun
printen (de export zou ze tot op de vloer opvullen); de loopbruggen met
leuningen boven op de spoorvakwerken, de bovenleiding met masten, de
lantaarns en alle leuningen (dunner dan 0,9 m); de buizen en ladder van de
bovenregel van de fietsbrug als losse staven (één dichte regel); en de
spoordijk en de dijk achter de landhoofden (die zitten in het
PDOK-terrein). Het PDOK-terrein heeft onder de brug een vlakke wegstrook
over het water op circa NAP +10,5 m; die blijft onder het model zichtbaar.

Binnen de dekken van de aanbruggen ligt 92 % van de DSM-cellen onder de
sporen binnen 2 m van het model (87 % binnen 1 m, mediaan +0,03 m), onder
het wegdek 85 % (81 %, mediaan +0,01 m) en onder het fietspad 90 % (82 %,
mediaan 0,00 m); de rest zijn de randen, leuningen en lantaarns. Op de
vakwerken ziet het AHN door het open vakwerk heen; het hoogste DSM-punt per
3 m ligt over de hoofdoverspanning op de spoorvakwerken in 25 en 31 van 34
vakken binnen 1,5 m van de bovenrand van het model (mediaan +0,16 en
+0,10 m, de leuningen van de loopbruggen), op de verkeersbrug in 25 van 34
(mediaan -0,21 m) en op de fietsbrug in 30 van 34 (mediaan -0,30 m).

Printbaarheid op 1:1000: het open vakwerk is op 1:1000 niet te printen. Elke
vakwerkwand is daarom een dichte plaat van 1 m (fietsbrug 0,95 m) met
staven van 0,9 tot 1,3 m, doorgaande openingen met zijden van minstens 55
graden en een spitse top, en blinde nissen waar de bovenkant vlak is. De
zijvlakken van de fietsbrug hellen 16 graden; de zijden van hun openingen
blijven ook gekanteld steiler dan 50 graden. De vloeren over de rivier en
de aanbruggen hangen tussen de pijlers vrij (spoorbruggen elk 3460 m²,
verkeersbrug 5751 m² met de rijvloer tussen de vakwerkliggers, fietsbrug
3342 m²); alle nodes zijn gesloten manifolds (genus 32, 32, 130 en 17 door
de openingen en de tunnel van het A-vakwerk; de pijlers zijn 13 losse
delen; van de wegdelen is het spoor twee losse delen). Met 558 m past de
brug op 1:1000 niet in één uitsnede; de printcontrole draait daarom op een
uitsnede van 461 m (1:1153, 400 mm, 123 seconden): alle acht nodes gaan als
gesloten solid door (status NoError). De export vult de onderdelen samen op
en geeft de opvulling aan de eerste constructienode (spoorbrug-noord 82,5
naar 43,6 cm³ met de opvulling van de hele brug, de andere constructienodes
ongewijzigd: spoorbrug-zuid 7,0, verkeersbrug 4,4, fietsbrug 2,8 en pijlers
12,7 cm³); de wegdelen krijgen geen eigen opvulling (`extraPct` 0: spoor
2,0, rijbaan 1,6 en fietspad 0,9 cm³). Samen 75,1 cm³, minder dan de
81,4 cm³ toen elke brug apart werd opgevuld, en de openingen in de vakwerken
blijven open. Onder de dekken komt een wig van 45
graden met een smal scherm tot de onderplaat. De STL op 1:2500 heeft
dezelfde printvoet per dek (wig van 50 graden en een scherm van 0,8 mm);
wat daarin nog vlak hangt, zijn de rijvloer tussen de twee vakwerkliggers
onder het wegdek (een overbrugging van 7 m, 2,8 mm op 1:2500) en de
bovenkanten van de blinde nissen. Het PDOK-terrein ligt op het water op de
waterspiegel van het model, in de uiterwaarden circa 3,5 m hoger (de
pijlers en wanden steken daar tot 4,5 m het maaiveld in) en op de dijk bij
het oostelijke landhoofd tot NAP +18,4 m, tegen de liggers aan.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Brug_bij_Westervoort)
(vier losse bruggen naast elkaar: spoorbruggen 1980 en 1984, verkeersbrug
1971, fietsbrug 1981; Rkm 881,3), PDOK BGT (overbruggingsdeel: dekken,
rivierpijlers, aanbrugpijlers, wanden onder de fietsbrug, landhoofden; spoor:
as en spoorhartlijnen; wegdeel: functie en verharding van de dekken), PDOK AHN (dsm en dtm 0,5 m via WCS: dekken,
bovenranden van de vakwerken, ligging van de wanden, waterspiegel,
maaiveld), PDOK Luchtfoto (8 cm) voor de plattegrond en Wikimedia
Commons-foto's (Brug bij Westervoort (1).jpg; Brug bij Westervoort (2).jpg;
Westervoort, de Westervoortse Brug foto4 2015-08-20 09.24.jpg; Westervoort,
de Westervoortse Brug IMG 8427 2021-02-28 14.22.jpg;
Gelderland-26-Bruecke-2010-gje.jpg; The 4 ugly bridges over the IJssel at
Westervoort (panoramio); Froma distance the 4 bridges Westervoort are
symmetric (panoramio)) voor de vakwerkpatronen, de bovenranden, het
A-vakwerk, de aanbruggen en de pijlers. Geschat zijn het aantal velden
(acht, op foto's van opzij), de constructiehoogtes van de vakwerkvloeren
(1,2 tot 1,8 m), van de betonnen spoorliggers (3,8 m) en van de stalen
liggers onder het wegdek (onderkant NAP +15,8 m), de hoogte van het
metselwerk van de aanbrugpijlers (+15,2 m) en de rivierpijlers (+19,35 m),
de staafbreedtes, de breedte van de bovenregel van de fietsbrug en de
landhoofden (blokken waar de dekken eindigen); welke spoorbrug uit 1980 en
welke uit 1984 is, staat niet in de bronnen, daarom heten de nodes noord
en zuid. De waterspiegel is de AHN-waarde van NAP +8,3 m, die met de
rivierstand meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
