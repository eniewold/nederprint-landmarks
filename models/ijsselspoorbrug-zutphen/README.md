# IJsselspoorbrug (Zutphen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ijsselspoorbrug-zutphen.glb` | Catalogusbron in meters, twee nodes: `building:ijsselspoorbrug-zutphen` met de betonnen aanbrug (wandpijlers, schampkanten), het stalen veld, de hefbrug met heftorens, contragewichten en langsliggers, de vakwerkbrug met windverband, het oostelijke veld, de pijlers en de landhoofden; `road:spoor` (`bgt_functie` spoorbaan, `bgt_fysiekvoorkomen` gesloten verharding): de bovenste 0,5 m van het dek binnen de BGT-spoorbaanvlakken |
| `ijsselspoorbrug-zutphen-1-1000.stl` | De brug in één stuk (beide nodes samen) op 1:1000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (344 × 13,4 × 20,6 mm) |
| `ijsselspoorbrug-zutphen.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De IJsselspoorbrug is de dubbelsporige spoorbrug van de lijn Arnhem - Zutphen
over de IJssel tussen De Hoven (west) en Zutphen (oost). Ze ligt direct ten
noorden van de Oude IJsselbrug, die een eigen catalogusmodel heeft
(`oude-ijsselbrug-zutphen`); de hefbrugpijlers en de boogpijler zijn gedeeld.
Dit model gebruikt hetzelfde bouwstelsel als dat van de verkeersbrug en begint
waar dat ophoudt: het dek op 0,2 m en de pijlers op 2 cm ten noorden van de
noordrand van de verkeersbrug. De twee modellen raken elkaar nergens (in een
PDOK-dump met beide modellen houdt de verkeersbrug op 5,38 m en deze brug op
5,36 m ten zuiden van de as van dit model).

De GLB is in meters met de oorsprong op RD (209855,34, 462003,53) (WGS84
52,14349 N, 6,18859 O), midden tussen de twee vakwerkliggers onder de top van
de bovenrand, op de waterspiegel van de IJssel zoals het PDOK-terrein die legt
(48,09 m ellipsoïdisch, circa NAP +5,2 m) en de glTF-conventie Y omhoog. +X
loopt langs de brug naar het oosten, naar Zutphen (`xAxis` (0,93155, 0,36360),
21,32 graden linksom vanaf het oosten, dezelfde as als de verkeersbrug), +Y
naar het noordnoordwesten. Het westelijke landhoofd ligt op x = -285,35 tot
-281,35, de wandpijlers van de aanbrug op x = -249,4 tot -84,85, de heftorens
op x = -66,75 tot -62,55 en -45,95 tot -42,55, de opleggingen van de
vakwerkbrug op x = -43,55 en 43,45 en het oostelijke landhoofd op x = 54,65 tot
58,65. De controle-URL valt midden op de aanbrug (x = -112,9, op de as van het
spoor). Het maaiveld wordt op acht punten bemonsterd (`groundSamplePoints`):
zes op de uiterwaard en het water 15 m ten noorden van de as (x = -222, -152,
-82, -30, 0 en 30) en twee op de rivier 31 m ten zuiden ervan, voorbij de
verkeersbrug (x = -30 en 30). `groundOffsetMetres` is 0; het PDOK-terrein legt
het water op die punten op 48,09 m, de uiterwaard hoger. `groundHeight` is
48,09 m, zodat een uitsnede die alleen een aanbrug raakt het model niet laat
wegvallen; beide Zutphense bruggen staan zo op dezelfde hoogte.
`replacesBuildings` ontbreekt: er ligt geen BAG-pand onder de brug, en de
PDOK-reconstructie (`?landmarks=0`) heeft hier alleen vlakke wegstroken voor
spoor en dek.

Onderdelen in het model (hoogtes in NAP):

- Het dek met het spoor volgens het AHN-DSM om de 10 m (mediaan over de twee
  sporen): +11,96 m aan het westelijke landhoofd, +12,03 m over de aanbrug,
  +12,18 m op de hefbrug, +12,32 m midden op de vakwerkbrug en +11,92 m aan het
  oostelijke landhoofd. De zuidrand ligt overal op t = 12,5 (0,2 m van de
  verkeersbrug); de noordrand over de aanbrug 10,6 m van de zuidrand (BGT en
  AHN), vanaf het einde van de aanbrug 12,1 m (het looppad naar de heftoren),
  op het beweegbare dek 11,95 m en over de vakwerkbrug 12,5 m.
- De betonnen aanbrug (1980) over de uiterwaard in zes gelijke velden van
  32,9 m: een plaat van 0,9 m met een smallere onderbouw tot 1,9 m onder het
  spoor, op vijf wandpijlers van 2 m dik met een kop van 2,6 m en de BGT-pijler
  op x = -84,85. De voegen in het dek op de luchtfoto liggen om de twee velden
  (65,7 m), dus de pijlers op 32,9 m, gelijk met die van de verkeersbrug.
  Schampkanten van 0,9 × 0,6 m langs beide randen (AHN: de zuidrand staat
  0,9 m boven het spoor).
- Het stalen veld van het einde van de aanbrug tot de westelijke hefbrugpijler
  (x = -85,65 tot -61,85), 2,5 m diep, met plaatliggers op de vakwerklijnen tot
  1,2 m boven het spoor (AHN NAP +13,4 m) en het looppad aan de noordkant.
- De hefbrug: het beweegbare dek tussen de voegen van 0,4 m op x = -61,85 en
  -45,65 (BGT, gelijk met de verkeersbrug), 2,0 m diep met dezelfde
  plaatliggers. Twee heftorens (AHN x = -66,75 tot -62,55 en -45,95 tot
  -42,55) met elk twee poten van 1,2 m langs de dekranden tot NAP +22,4 en
  +22,7 m, met een spits zijraam (55 graden, schouders op +18,0 m) in elke poot;
  ertussen het contragewicht als dwarsbalk tot +21,2 en +21,0 m met een
  V-onderkant van 50 graden. Tussen de torens twee langsliggers van 1,0 m met
  een V-onderkant langs de randen (AHN +19,55 m zuid, +19,2 m noord).
- De vakwerkbrug met gebogen bovenrand (de opleggingen op x = -43,55 en 43,45,
  87 m uit elkaar): twee platen van 1,0 m op de vakwerklijnen (AHN 9,25 m uit
  elkaar), met de bovenrand als veelhoek door 14 knopen om de 5,97 m op een
  parabool met de top op NAP +25,0 m bij x = -0,05 en +20,1 m aan de einden
  (AHN, kleinste kwadraten), en eindstijlen van 4,7 m naar de opleggingen.
  Warren-vakwerk zoals op de foto's: vanaf elk eind een diagonaal per vak met
  stijlen op de bovenknopen (0, 2, 4, 6 en 7, 9, 11, 13) en een kruis in het
  middelste vak. Per ligger 24 doorgaande openingen, alle driehoeken tussen de
  staven: naast de stijlen met het plafond langs de diagonaal (49 tot 63
  graden) en tussen de diagonalen met een vlakke bovenkant onder de bovenrand.
  Een stalen dek van 2,3 m onder het spoor en een looppad buiten
  de noordelijke ligger tot de noordrand van het BGT-dek. Het windverband
  tussen de bovenranden: een dwarsregel op elke knoop en een diagonaal per
  vak, afwisselend van richting (luchtfoto), als balken van 0,9 × 0,9 m,
  0,15 m onder de bovenkant van de bovenrand. De dwarsregels op de eerste en
  de laatste knoop, boven de eindstijlen, zijn de eindportalen.
- Het oostelijke veld (x = 43,95 tot 54,65) als betonnen plaat zoals de
  aanbrug, met schampkanten.
- De hefbrugpijlers en de boogpijler op de BGT-omtrek met hun ronde koppen aan
  de noordkant (tot 8,1 m ten noorden van de as), aan de zuidkant afgesneden
  bij de verkeersbrug; ze staan ook in het model van de verkeersbrug, dat het
  deel tot zijn noordrand heeft.
- De landhoofden als blokken tot onder het spoor.
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van het dek binnen
  de drie actuele BGT-wegdelen spoorbaan op de brug (relatieve hoogteligging 1,
  gesloten verharding, zonder plus-fysiek voorkomen):
  L0004.dfd15597101f1ec3e0530b29a8c0df95 (aanbrug, 7,4 m breed),
  L0004.dfd1559710201ec3e0530b29a8c0df95 (stalen veld, hefbrug en vakwerkbrug,
  6,2 tot 7,0 m) en L0004.dfd15597101c1ec3e0530b29a8c0df95 (oostelijk veld),
  vereenvoudigd tot 5 cm, met in de GLB `extras.attributes`
  `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" }`.
  De looppaden langs de randen staan niet als eigen wegdeel in de BGT en
  blijven constructie. De strook loopt over dezelfde loftstations als het dek,
  van 0,5 m onder tot 1 m boven het spoor; spoor = strook ∩ BGT-vlak ∩ brug,
  met 2 cm vrij van schampkanten, plaatliggers, vakwerkplaten, torenpoten en
  voegen; constructie = brug − strook (samen 10 935 m³: constructie 9 739,
  spoor 1 196 m³; het script controleert dat de volumes optellen).

Wat er niet in zit: de bovenleiding met haar portalen en masten, seinen,
leuningen langs de looppaden en de trappen op de torens (de BGT-vlakjes
`voetpad op trap` van 0,8 m breed), allemaal dunner dan 0,9 m; de machines en
kabelschijven op de torens en het open vakwerk van de torenpoten (de poten zijn
dichte platen met een zijraam); de echte staafbreedtes van circa 0,5 m (de
staven zijn 0,9 m). De PDOK-reconstructie (`?landmarks=0`) heeft van de brug
alleen vlakke wegstroken.

Vergelijking met de PDOK-reconstructie: van het noorden (vanaf de uiterwaard
en de rivier) heeft het model de noordelijke vakwerkligger met de gebogen
bovenrand, de stijlen, diagonalen, het kruis en de driehoekige openingen, de
heftorens met zijramen, contragewicht en langsligger, het stalen veld met
plaatligger, de betonnen aanbrug met schampkant en zes wandpijlers en de ronde
pijlerkoppen; van het zuiden staat de verkeersbrug ervoor, maar boven de
boog van de verkeersbrug zijn de zuidelijke ligger, de torens en het
windverband te zien; van het westen en oosten de dwarsdoorsnede met de twee
liggers, het windverband, de torenportalen en de landhoofden. In een
PDOK-dump met beide catalogusmodellen staan de twee bruggen naast elkaar op
dezelfde onderkant (47,29 m ellipsoïdisch) zonder overlap.

Pasvorm op het AHN: de bovenrand van beide liggers ligt in alle doorsneden van
1 m tussen x = -38 en 38 (hoogste DSM-punt binnen 0,5 m van de vakwerklijn)
binnen 0,5 m van het model (mediaan 0,00 en 0,01 m). Het spoor volgt de mediaan
van het DSM over de twee sporen per meter met een mediaan verschil van 0,00 m
(92 % binnen 0,25 m; zonder het stalen veld en de hefbrug, waar het DSM door
het open dek kijkt).

Printbaarheid op 1:1000: de echte staven van circa 0,5 m zijn op 1:1000 te
dun, daarom zijn de liggers dichte platen van 1,0 m met openingen. Wat zonder
steun niet print, laat het model aan de export over: de vlakke bovenkant van
de openingen tussen de diagonalen, de onderkant van het windverband, van het
dek en van de pijlerkoppen (samen 3 878 m² in het model). Het contragewicht
en de langsliggers tussen de torens houden een V-onderkant van 50 graden en
de zijramen van de torens een spitse top van 55 graden: met een vlakke
onderkant vult de export onder de langsliggers (16,6 m tussen de torens, 7 m
boven het spoor) een wand tot het dek op. In de meettest van de webshop
(`scripts/overhang-lab`, het model op 1:1000) gaat het volume met
"Ondersteuning v2.0" van 10,9 naar 21,6 cm³ (v1.0: 21,6 cm³; het vorige
model 11,1 naar 21,6 cm³): de openingen tussen de diagonalen vult de export
op, onder elke staaf van het windverband komt een wand of kolom tot het dek
(in het vorige model ook, onder de staven met een V-onderkant, die smaller
dan een steunbreedte uitlopen), onder het dek een wig met een smal scherm tot
de onderplaat.
Ongedragen blijven vier plekjes van samen 0,9 mm² in het vakwerk (het vorige
model 0,35 mm²). De STL, die zonder export wordt geprint, heeft printvormen:
in de liggers alleen doorgaande openingen met een plafond van minstens 54
graden (tussen de diagonalen een ruit met een spitse top) en daarboven blinde
nissen van 0,35 m aan de buitenkant, staven met een V-onderkant van 50 graden
in het windverband en onder het dek een printvoet (een wig van 50 graden vanaf
de randen die uitloopt in een scherm van 0,9 m tot de onderplaat), waarna
377 m² aan onderkanten van de onderbouw, pijlerkoppen en nisplafonds
overblijft; ze is ongewijzigd.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/IJsselspoorbrug_(Zutphen))
(westelijke aanbrug met zeven velden over circa 218 m, hefbrug, vakwerkbrug
met gebogen bovenrand van circa 89 m, aanbrug van circa 12 m, 348 m lang,
geschiedenis), PDOK BGT (overbruggingsdeel: dekken, beweegbaar dek, pijlers;
wegdeel: spoorbaan op het dek voor de contouren en attributen), PDOK AHN (dsm
en dtm 0,5 m via WCS: spoor, dekranden, vakwerklijnen en bovenrand,
eindstijlen, plaatliggers, heftorens, contragewichten, langsliggers), PDOK
luchtfoto (Actueel_orthoHR: knopen van het windverband, voegen van de aanbrug,
overgang naar het stalen veld), het PDOK-terrein (water) en de Wikimedia
Commons-foto's Zutphen brug VIRMm 8676 (51090754448).jpg, Zutphen de Hoven brug
VIRM 8642 naar Roosendaal (14208095504).jpg, Zutphen IRM duo op de brug lente
(14384272235).jpg, Zutphen Arriva 367 Guus Hiddink op de brug
(14384272795).jpg, Zutphen omgeleide ICE 123 naar Frankfurt Main gereden door
stel 4654 (24161262772).jpg, Zutphen Arriva Spurt 369 Apeldoorn
(10375891664).jpg, Zutphen ICMm 4087-4219 r.Arnhem 4040-4213 r.Zwolle
(10375887414).jpg, Zutphen ijsselbruecke.jpg en Enormous quantities of water
passing through the IJselriver at the colourfull bridges of Zutphen -
panoramio.jpg voor het vakwerkpatroon, de heftorens, de aanbrugpijlers en het
dek. Geschat zijn de constructiehoogtes (aanbrug 1,9 m, stalen veld 2,5 m,
hefbrug 2,0 m, vakwerkbrug 2,3 m onder het spoor), de staafbreedte (0,9 m) en
de dikte van de liggers (1,0 m) en de bovenrand (1,0 m), de plaats van de vijf
aanbrugpijlers (uit de voegen; onder het dek niet in de BGT en niet in het
AHN), de pijlerkoppen, de zijramen en de maten van het contragewicht, de
langsliggers (1,0 m) en de schampkanten. De zuidrand van het dek volgt het AHN
(t = 12,5), 0,4 tot 0,7 m zuidelijker dan de BGT, net als bij de verkeersbrug.

Licentie van het model: eigen werk op basis van open bronnen.
