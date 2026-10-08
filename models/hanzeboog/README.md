# Hanzeboog (Zwolle)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hanzeboog.glb` | Catalogusbron in meters met drie nodes: `road:spoor` en `road:fietspad`, de bovenste 0,5 m van het dek binnen de BGT-wegdelen met hun attributen (zie hieronder), en `building:hanzeboog` met de rest: het spoordek, de vakwerkligger met gebogen bovenrand over drie velden (twee vakwerken die naar binnen hellen), de betonnen aanbruggen, de achttien V-vormige pijlers, het fietspad aan de zuidkant en de twee landhoofden |
| `hanzeboog-1-2500.stl` | De brug in één stuk op 1:2500 met een printvoet onder het dek en het fietspad, met de onderkant (0,8 m onder de waterspiegel) op het printbed (374 × 34 × 12 mm; met `--scale` een andere schaal, op 1:1000 is hij 936 mm lang) |
| `hanzeboog.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De Hanzeboog is de dubbelsporige spoorbrug van de Hanzelijn (2011, Quist
Wintermans Architekten) over de IJssel tussen Hattem en Zwolle. Er staat op
deze plek maar één brug: de oude spoorbrug uit 1864, 50 m stroomafwaarts, is
in 2011 gesloopt; alleen een stenen pijlerrestant staat nog in de rivier (niet
in het model). Het fietspad hoort bij de Hanzeboog (een ‘losse’ fietsbrug die
aan de spoorbrug hangt) en zit in hetzelfde model. De IJsselbrug van de weg
Zwolle-Hattem, 800 m stroomafwaarts, is een eigen catalogusitem
(`ijsselbrug-zwolle`), net als de Nieuwe IJsselbrug van de A28.

De GLB is in meters met de oorsprong op RD (200833,13, 500456,87), op de as
van het spoor midden boven de hoofdoverspanning, op de waterspiegel van de
IJssel zoals het PDOK-terrein die legt (NAP +1,4 m) en de glTF-conventie Y
omhoog. +X loopt langs de rechte hoofdoverspanning naar het oosten, naar
Zwolle (`xAxis` (0,93105, 0,36489), 21,40 graden linksom vanaf het oosten), +Y
stroomafwaarts naar het noordnoordwesten. De brug is tot x = 118 recht en
buigt daarna naar links (een overgangsboog en een bocht met een straal van
circa 1300 m, tot 17,3 graden aan het oostelijke landhoofd, waar de as 53 m
links van de rechte as ligt). Het script bouwt alles in een recht stelsel (s
langs de as, y links ervan) en buigt het model aan het eind langs de as
(`warp`). Het westelijke landhoofd bij Hattem ligt op x = -350 tot -334, de
pijlers onder de vakwerkligger op x = -150, -75, 75 en 150 en het oostelijke
landhoofd bij Zwolle langs de as op 581 tot 589. Het maaiveld wordt op zes
punten op het water naast de hoofdoverspanning bemonsterd
(`groundSamplePoints`, 30 m naast de as op x = -40, 0 en 40);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de IJssel op NAP +1,4 m
(ellipsoïdisch 44,18 tot 44,22 m). `groundHeight` is 44,18 m, de laagste
PDOK-hoogte op die punten, zodat een uitsnede die alleen een aanbrug raakt het
model niet laat wegvallen. Geen BAG-pand onder de brug. Het hart van het model
ligt op 52,48990 N, 6,06202 O, circa 120 m westzuidwest van de controle-URL.

Onderdelen in het model (hoogtes in NAP):

- Het spoordek met het spoor volgens het AHN-DSM om de 10 m: +11,6 m aan het
  westelijke landhoofd, +15,3 m midden boven de rivier en +7,7 m aan het
  oostelijke landhoofd. Over de aanbruggen een plaat van 1,4 m op een koker
  die 1,0 m terugligt, 2,8 m onder het spoor; aan de westkant 15 m breed, aan
  de oostkant 13 m (AHN; aan de westkant waaieren de sporen uit). Onder het
  vakwerk een koker van 3,0 m met de onderranden van de vakwerken, 19,4 m
  breed.
- De vakwerkligger van 300 m over drie velden (75, 150 en 75 m; pijlers op
  x = ±75 en ±150, de oostelijke uit de BGT) als twee vakwerken die 14,3 graden
  naar binnen hellen: op spoorhoogte 8,8 m naast de as, in de top 5,05 m
  (AHN). De bovenkant van de bovenrand ligt h = 14,7 (1 - (d/150)²)^1,8 boven
  het spoor (d = afstand tot het midden): NAP +30,0 m in het midden, +23,8 m
  boven de rivierpijlers, en vloeiend tot op het dek bij de eindpijlers. Een
  W-vakwerk met velden van 30 m (de schaduw van het vakwerk op de luchtfoto van
  2021 en foto's): onderknopen boven de pijlers en op 15 + 30k m van het
  midden, bovenknopen midden daartussen. Elk vakwerk is een plaat van 1,2 m
  met een bovenrand van 2,0 m breed en 2,4 m hoog (met een kraag van 62 graden
  onder de overstekende rand), diagonalen van 1,6 m, 13 doorgaande openingen
  (spitse openingen in de driehoeken met de punt omhoog, ruiten in de
  driehoeken met de punt omlaag) en 19 blinde nissen van 0,35 m aan de
  buitenkant voor de rest van elke driehoek.
- De aanbruggen met velden van 40 m: vier aan de kant van Hattem (pijlers op
  x = -310, -270, -230 en -190; de eerste staat als sloof in de BGT) en tien
  aan de kant van Zwolle (x = 190 tot 550 langs de as; de eerste twee in de
  BGT), met eindvelden van 24 en 31 m naar de landhoofden; samen achttien
  pijlers, zoals Wikipedia noemt.
- De pijlers als V-vormige wanden dwars op de brug (de ‘Y-vorm’ uit de
  projectbeschrijving): de voet uit de BGT (aanbruggen 2,1 × 10 m, eindpijlers
  van het vakwerk 2,6 × 10,5 m, rivierpijlers 3,6 × 11,2 m), de bovenkant zo
  breed als de koker eronder en een inkeping van boven tot 55 % van de
  zichtbare hoogte.
- Het fietspad van 3,6 m aan de zuidkant, 0,95 m onder het spoor (onder het
  vakwerk 0,7 m), met een plaat van 1,0 m en een spleet van 1,2 tot 2,2 m naar
  het spoordek, die 0,5 tot 0,6 m diep is boven een strook consoles.
- De landhoofden als blokken tot het spoor, over de breedte van spoordek en
  fietspad.
- Spoor en fietspad als eigen onderdelen (verplicht voor bruggen): de
  bovenste 0,5 m van het dek binnen de actuele BGT-wegdelen met relatieve
  hoogteligging 1, met de BGT-attributen in `extras.attributes` van de node,
  zodat de kleurregels van een thema (spoor zwart, fietspaden rood) op de brug
  werken zoals op de PDOK-wegdelen ernaast. `road:spoor` (`bgt_functie`
  spoorbaan, `bgt_fysiekvoorkomen` half verhard) komt uit wegdeel
  `L0004.02e1f991b8964282ab0022f4498a7749`, de spoorbaan van x = -347,4 (op
  het westelijke landhoofd) tot het oostelijke landhoofd, circa 8 m breed rond
  de as; het spoordek erbuiten blijft constructie. `road:fietspad`
  (`bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding, geen
  plus-fysiek voorkomen) komt uit `G0244.3f20b822907e4b64b585a571a15f08dd`
  (Hattem) en `G0193.ea6ec72403ab4a1d87e3b75f934d51a6` (Zwolle), die op de
  gemeentegrens bij x = 4,3 op elkaar aansluiten; waar de BGT-contour smaller
  is dan het fietspad van het model (tot 0,4 m aan de buiten- of binnenrand)
  blijft die rand constructie. Op de landhoofden, die tot 1 cm onder het spoor
  reiken, zijn beide lagen de bovenste 0,5 m van het blok. De contouren staan
  vereenvoudigd tot 5 cm in het script. De snijstroken lopen van 0,5 m onder
  tot 1 m boven spoor en fietspad over dezelfde loftstations als het dek; de
  vakwerken (plaat en bovenrand, openingen dicht) en de kopse kanten van de
  landhoofden boven het fietspad blijven met 2 cm vrij constructie. Bij x =
  ±150, waar het fietspad 0,25 m verspringt, loopt de laag onder het vakwerk
  de laatste 0,5 m dieper door (0,75 m), zodat geen vlak zonder dikte
  overblijft. De volumes tellen op tot die van de brug als geheel (51 694 m³
  constructie, 3 967 m³ spoor, 1 413 m³ fietspad; samen 57 074 m³) en
  verticale stralen over het dek vinden geen samenvallende bovenvlakken van
  verschillende onderdelen (de 11 vlakken zonder dikte in de vakwerken zaten al
  in het model zonder wegdeklaag). De STL is ongewijzigd: het hele model in
  één stuk.

Wat er niet in zit: de bovenleiding met portalen, de hekwerken van rvs-gaas,
leuningen en lantaarns (allemaal dunner dan 0,9 m); de ronde koppen van de
pijlers (in plattegrond 1 m straal; de wanden zijn recht afgesneden); het
stenen pijlerrestant van de oude spoorbrug in de rivier (geen deel van de
Hanzeboog); de spoordijken achter de landhoofden (die zitten in het
PDOK-terrein). De PDOK-reconstructie (`?landmarks=0`) heeft van de brug alleen
een vlakke wegstrook op het maaiveld; die blijft onder het model liggen.

Binnen het spoordek (strook van 5 m tussen de sporen) ligt 98 % van de
DSM-cellen binnen 1 m van het spoor van het model (99 % binnen 2 m, mediaan
+0,01 m). De bovenkant van de bovenranden ligt tussen x = -102 en 144 in 78 %
van de doorsneden binnen 1 m van het hoogste DSM-punt in de strook van elk
vakwerk (87 % binnen 1,5 m, mediaan -0,09 m); de oostelijke helft ligt in het
DSM tot 1 m lager dan de westelijke, het model is symmetrisch.

Printbaarheid op 1:1000: het open vakwerk is niet als staven te printen; elk
vakwerk is een hellende plaat met doorgaande openingen waarvan de bovenflanken
53 graden steil zijn (gemeten in het vlak van de plaat, door de helling 51,6
graden), terwijl de echte diagonalen circa 40 graden staan. Daarom is elke
driehoek met de punt omhoog alleen in zijn spitse kern doorgaand open en zijn
de zijstukken blinde nissen, en is in elke driehoek met de punt omlaag een
ruit onder een spitse top uitgespaard. De kraag onder de bovenrand blijft ook
aan de binnenkant van het hellende vakwerk steiler dan 45 graden. Vrij hangen
de onderkant van het dek, het fietspad, de kokers van de aanbruggen en de
plafonds van de inkepingen in de pijlers (samen 18 900 m²); de STL heeft
daaronder een printvoet (een wig van 50 graden vanaf de randen van spoordek en
fietspad die uitloopt in een scherm van 0,9 m tot de onderplaat), waarna 468 m²
aan nisplafonds en inkepingen overblijft (op 1:2500 hooguit 0,6 mm breed). In
de export (printcheck, gesloten solid met overhangopvulling, status NoError):
een uitsnede van 400 × 400 m rond de vakwerkligger op 1:1000 in 6,5 s (109,0
naar 80,5 cm³, -26 %: minder dan de verticale opvulling; de openingen in de
vakwerken blijven open), en het hele model (884 m, 1:2212) in 8,7 s (11,6 naar
14,0 cm³, +20 %; de constructie 11,1 naar 13,5 cm³, spoor 0,37 en fietspad
0,13 cm³ zonder eigen opvulling). Met 936 m past de brug op 1:1000 niet in één uitsnede; de
STL staat daarom op 1:2500. Het PDOK-terrein ligt op het water op de
waterspiegel van het model; in de uiterwaarden ligt het maaiveld op NAP +1 tot
+2,5 m (de pijlers en het landhoofd steken er tot 3 m in).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Hanzeboog) (2011, lengte
920 m, breedte 24 m, langste overspanning 150 m, doorvaarthoogte 9 m, 18
pijlers, oude brug uit 1864 in 2011 gesloopt), de
[projectbeschrijving van de Nationale Staalprijs](https://www.nationalestaalprijs.nl/sites/default/files/imported_files/396/projectbeschrijving.pdf)
(Y-vormige pijlers dwars op de brug, fietsbrug ‘los’ aan de spoorbrug
gehangen), PDOK BGT (overbruggingsdeel: rand van het dek, pijlervoeten op
x = 75, 150, 190 en 230, sloof op -310, landhoofden; wegdeel: spoorbaan en
fietspaden op het dek), PDOK AHN (dsm en dtm
0,5 m via WCS: as, spoor, fietspad, randen van het dek, bovenranden en helling
van de vakwerken), PDOK Luchtfoto (actueel en 2021: schaduw van het vakwerk
voor de velden van 30 m), het PDOK-terrein (waterspiegel) en Wikimedia
Commons-foto's (Hanzeboog.jpg; Hanzeboog vanuit de lucht.jpg; New bridge,
Zwolle, Overijssel.jpg; 20151027 Hanzeboog1 IJssel Zwolle.jpg; Spoorbrug
Hanzelijn IJssel.jpg; Zwolle Hanzeboog IRM 9450 richting Zwolle
(20294000598).jpg; New built 75-150-75 m mainspan railwaybridge in the
Hanzelijn ... - panoramio.jpg) voor het vakwerk, de pijlers en het fietspad.
Geschat zijn de staafmaten (plaat 1,2 m, bovenrand 2,0 × 2,4 m, diagonalen
1,6 m), de vormfunctie van de bovenrand (gefit op het DSM), de
constructiehoogtes van het dek (3,0 m onder het vakwerk, 2,8 m over de
aanbruggen, plaat 1,4 m), de plaats van de pijlers die niet in de BGT staan
(velden van 40 m vanaf de BGT-pijlers en de sloof), de V-vorm van de pijlers
(bovenkant zo breed als de koker, inkeping tot 55 % van de zichtbare hoogte),
de dikte van het fietspad en de diepte van de spleet; de waterspiegel is de
PDOK-waarde van NAP +1,4 m, die met de rivierstand meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
