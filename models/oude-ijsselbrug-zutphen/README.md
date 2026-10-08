# Oude IJsselbrug (Zutphen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `oude-ijsselbrug-zutphen.glb` | Catalogusbron in meters, vier nodes: `building:oude-ijsselbrug-zutphen` met de aanbrug (vakwerkliggers, wandpijlers), de trap, de hefbrug met heftorens en bedieningshuis, de boogbrug (ribben met hangers en windverband), de pijlers en de landhoofden; `road:rijbaan` (`bgt_functie` rijbaan lokale weg), `road:fietspad` (`bgt_functie` fietspad) en `road:voetpad` (`bgt_functie` voetpad), alle drie met `bgt_fysiekvoorkomen` gesloten verharding en `plus_fysiekvoorkomen` asfalt: de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder |
| `oude-ijsselbrug-zutphen-1-1000.stl` | De brug in één stuk (alle vier de nodes samen) op 1:1000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (344 × 29 × 21 mm) |
| `oude-ijsselbrug-zutphen.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De Oude IJsselbrug is de verkeersbrug over de IJssel tussen De Hoven (west) en
Zutphen (oost), na de vernielingen van 1940 en 1945 hersteld. De
IJsselspoorbrug ligt er direct ten noorden naast, 0,6 m van de noordrand van
het verkeersdek; die hoort niet in dit model. De gedeelde pijlers (BGT) houden
in het model op aan de noordrand van het verkeersdek.

De GLB is in meters met de oorsprong op RD (209859,23, 461993,56), op de as
tussen de twee boogribben midden tussen de boogpijlers, op de waterspiegel van
de IJssel zoals het PDOK-terrein die legt (48,09 m ellipsoïdisch, circa NAP
+5,2 m) en de glTF-conventie Y omhoog. +X loopt langs de brug naar het oosten,
naar Zutphen (`xAxis` (0,93155, 0,36360), 21,32 graden linksom vanaf het
oosten, langs de zuidrand van het BGT-dek), +Y naar het noordnoordwesten (de
spoorbrug). Het westelijke landhoofd ligt op x = -285,4 tot -281,4, de
hefbrugpijlers op x = -64,95 en -44,85, de boogpijler op x = 44,85 en het
oostelijke landhoofd (de kade van Zutphen) op x = 54,65 tot 58,65. Het
maaiveld wordt op acht punten bemonsterd (`groundSamplePoints`): zes op de
uiterwaard en het water 20 m ten zuiden van de as (x = -222, -152, -82, -30, 0
en 30) en twee op de rivier 30 m ten noorden ervan, voorbij de spoorbrug
(x = -30 en 30). `groundOffsetMetres` is 0; het PDOK-terrein legt het water op
48,09 m en de uiterwaard onder de brug op 48,11 m. `groundHeight` is 48,09 m,
zodat een uitsnede die alleen een aanbrug raakt het model niet laat wegvallen.
`replacesBuildings` is het bedieningshuis (BAG-pand 0301100000025223), dat
PDOK als blok van 4,7 m op het water zet. Het hart van de boog ligt op
52,14340 N, 6,18864 O; de controle-URL valt 79 m westelijker, 16 m ten zuiden
van de as bij de trap.

Onderdelen in het model (hoogtes in NAP):

- Het dek met het wegdek volgens het AHN-DSM om de 10 m: +11,6 m aan het
  westelijke landhoofd, +12,4 m bij de hefbrug, +12,72 m onder de boog en
  +11,9 m aan de kade. Over de aanbrug 12,9 m breed (AHN), een dekplaat van
  0,6 m met dwarsdragers tot 1,4 m onder het wegdek; bij de trap en het
  bedieningshuis (x = -89,35 tot -69,35) 4,9 m breder naar het zuiden; over
  de rivier met het voetpad buiten de zuidelijke rib 16,1 m breed, een stalen
  dek van 2,0 m met trekbanden van 2,2 m onder de ribben en het voetpad als
  uitkraging (1,2 m diep aan de rand, 2,0 m bij de rib).
- Het wegdek als eigen onderdelen met PDOK-attributen (glTF
  `extras.attributes`), zodat de kleurregels van een thema (bijvoorbeeld
  fietspaden rood) op het brugdek werken zoals op de PDOK-wegdelen ernaast:
  `road:rijbaan`, `road:fietspad` en `road:voetpad` zijn de bovenste 0,5 m van
  het dek van landhoofd tot landhoofd. Bron: de actuele BGT-wegdelen met
  relatieve hoogteligging 1 op het dek, alle drie gesloten verharding met
  plus-fysiek voorkomen asfalt: de rijbaan
  `G0301.7604c86a0ccd4cd5bd1ac854efea368a` (rijbaan lokale weg), het fietspad
  `G0301.21e9827c52814cc69be8c3e2dcfc9233` (zuidkant) en het voetpad
  `G0301.d8cb67c78a3f4138b4fb84289bc026a0` (noordkant). De grenzen volgen de
  constructie: tussen de vakwerkliggers, de poten van de heftorens en de
  boogribben ligt de rijbaan (6,7 tot 7,4 m breed, ook op het beweegbare dek),
  ten zuiden daarvan tot de zuidrand van het BGT-fietspad het fietspad, ten
  noorden ervan het voetpad (circa 1 m). Het voetpad buiten de boog en de
  verbreding bij de trap staan niet als eigen wegdeel in de BGT; volgens
  Wikipedia is dat het zuidelijke voetpad dat aan de westkant op de trap
  uitkomt, dus zit het in `road:voetpad`. Schampkanten, vakwerkliggers,
  boogribben (de hele plaat, ook onder de hangeropeningen), torenpoten en de
  voegen blijven constructie, met 2 cm vrij. De wegdeklaag is gesneden met een
  strook van 0,5 m onder tot 1 m boven het wegdek over dezelfde loftstations
  als het dek; de constructie houdt zo nergens een vlak op het wegdek over. De
  vier nodes tellen samen op tot het volume van de brug als geheel (12 483 m³:
  constructie 10 478, rijbaan 1 113, fietspad 519, voetpad 373 m³); de STL
  bevat de brug als geheel.
- De aanbrug over de uiterwaard op zeven velden: het westelijke landhoofd,
  vijf wandpijlers op gelijke afstand (x = -249,4 tot -117,8, geschat) en de
  BGT-pijler op x = -84,85 (2 m dik), daarna het veld tot de hefbrugpijler.
  De wandpijlers lopen van t = 1,6 m tot de noordrand met een kop van 2,6 m.
  Langs de rijbaan twee stalen vakwerkliggers (AHN 7,65 m uit elkaar, 0,9 m
  breed), de bovenrand 2,55 m boven het wegdek; Warren-vakwerk met velden van
  2,4 m: 88 doorgaande driehoeken met de punt omhoog (flanken van 52 graden,
  scherpe hoeken 0,12 m afgekapt) en 87 blinde nissen van 0,3 m aan de
  buitenkant voor de driehoeken met een vlakke bovenkant.
- De trap naar de oever aan de zuidkant (x = -89,35 tot -83,35, tot 23,5 m
  naast de as) als gesloten trappenhuis: een loop die van het bordes op
  dekhoogte naar NAP +9,5 m bij het dek daalt en een loopbrug op dekhoogte
  naar het bordes (AHN).
- De hefbrug: voegen van 0,4 m over het wegdek op x = -61,85 en -45,65 (het
  beweegbare dek van de spoorbrug in de BGT ligt op dezelfde plaats), twee
  heftorens tot +22,8 m (AHN; x = -67,35 tot -62,35 en -47,35 tot -44,75) als
  poorten over de rijbaan met poten van 1,2 m en een spitse doorgang van 6,1 m
  breed met schouders op +17,3 m en de top op +21,7 m; het bedieningshuis
  (BAG-pand) aan de zuidkant van de westelijke toren, 4,0 × 4,7 m van +15,0
  tot +18,6 m (AHN) met een raamband als nis van 0,35 m aan de zuidgevel.
- De boogbrug met trekband van 89,7 m tussen de boogpijlers als twee verticale
  ribben van 1,0 m breed, 7,65 m uit elkaar (AHN). De bovenrand is een
  parabool met de top op +25,25 m bij x = -0,45 (AHN, kleinste kwadraten op de
  hoogste DSM-cellen per meter), aan de einden +13,5 en +13,0 m; de rib is
  1,5 m hoog. Twaalf velden van 7,475 m met een verticale hanger op elke
  knoop: tussen dek en rib acht doorgaande openingen met een spitse top van
  55 graden (de hangers als stijlen van 1,0 m; in de twee buitenste velden aan
  elke kant is de ruimte te laag). Het windverband tussen de toppen over de
  middelste 45 m: zeven dwarsstaven en zes kruisen (19 staven van 0,9 m met
  een V-onderkant van 50 graden).
- De pijlers met ronde koppen aan de zuidkant (BGT): de hefbrugpijlers van
  6,0 m dik (tot 7,07 m ten zuiden van de as) en de boogpijler van 3,8 m, tot
  in het stalen dek.
- Schampkanten van 0,9 × 0,6 m aan de zuidrand in plaats van de leuningen
  (aan de noordrand is het voetpad daar te smal voor), ook dwars langs de
  randen van de verbreding.
- De landhoofden als blokken tot het wegdek.

Wat er niet in zit: de bovenregel tussen de heftorens (een ligger van 13 m
vrij boven de rijbaan op +21,5 m, die de export tot op het dek zou opvullen)
en de machines op de torens; het eindportaal van de boog; leuningen,
lantaarns, slagbomen en de wenteltrap onder het bedieningshuis (dunner dan
0,9 m); de open ruimte onder de trap (het trappenhuis is dicht); het deel van
de pijlers onder de spoorbrug en de spoorbrug zelf. De PDOK-reconstructie
(`?landmarks=0`) heeft van de brug alleen vlakke wegstroken en het
bedieningshuis als blok op het water.

Binnen het dek (rijbaan t = 4,5 tot 9,5, zonder de hefbrug; AHN-DSM 0,5 m)
ligt 93 % van de cellen binnen 1 m van het wegdek van het model (mediaan
+0,01 m). De bovenkant van de ribben ligt in 71 % van de doorsneden binnen 1 m
van het hoogste DSM-punt in de strook van elke rib (81 % binnen 1,5 m, mediaan
-0,31 m; het windverband en de hangers verstoren het DSM).

Printbaarheid op 1:1000: het vakwerk van de aanbrug en de hangers zijn niet
als staven te printen; de liggers en ribben zijn platen met doorgaande
openingen met een spitse top (52 en 55 graden) en nissen. De staven van het
windverband hebben een V-onderkant van 50 graden, de heftorens een spitse
doorgang. Vrij hangen de onderkant van het dek en de uitkraging (samen
4 675 m² in het model); de STL heeft daaronder een printvoet (een wig van 50
graden vanaf de randen die uitloopt in een scherm van 0,9 m tot de onderplaat),
waarna 211 m² aan nisplafonds, het bedieningshuis en randjes overblijft. In de
export (printcheck, gesloten solid met overhangopvulling, status NoError): het
hele model in een uitsnede van 356 m op 1:1000 in 11 s, de constructie
24,5 naar 25,9 cm³ (+5,6 %), de rijbaan 1,11 cm³ (+0,1 %), het fietspad
0,51 cm³ (0 %) en het voetpad 0,37 cm³ (+0,8 %). Geen samenvallende vlakken
(verticale stralen op 100 000 punten over het hele model).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Oude_IJsselbrug_(Zutphen))
(lengte 345 m, doorvaarthoogte 10,92 m, indeling van het dek, de trap aan de
westkant), [Wikipedia IJsselspoorbrug](https://nl.wikipedia.org/wiki/IJsselspoorbrug_(Zutphen))
(westelijke aanbrug met zeven velden over circa 218 m, hoofdoverspanning
89 m), PDOK BGT (overbruggingsdeel: dek, pijlers, beweegbaar dek; wegdeel:
rijbaan, fietspad, voetpad), PDOK BAG (pand 0301100000025223), PDOK AHN (dsm
en dtm 0,5 m via WCS: wegdek, dekranden, vakwerkliggers, boogribben,
heftorens, bedieningshuis, trap), PDOK luchtfoto (Actueel_orthoHR) en Wikimedia
Commons-foto's (Zutphen ijsselbruecke.jpg, IJsselbrug, Zutphen.jpg, Zutphen,
IJsselbrug.jpg, Enormous quantities of water passing through the IJselriver at
the colourfull bridges of Zutphen - panoramio.jpg, Oude Ijsselbrug in 2019.jpg,
Zutphen, de Oude IJsselbrug IMG 8024 2021-02-12 12.40.jpg, Zutphen Oude
IJsselbrug seen from Badhuisweg.jpg). Geschat zijn de vijf aanbrugpijlers
(gelijke velden van 32,9 m, zodat de aanbrug net als de spoorbrug zeven velden
heeft; niet in de BGT en onder het dek niet in het AHN), het aantal hangers
(twaalf velden), de ribhoogte (1,5 m), het vakwerk van de aanbrug (velden van
2,4 m), de constructiehoogtes (1,4 m aanbrug, 2,0 m hefbrug en boog, 2,2 m
trekbanden), de vorm van de heftorens en de spitse doorgang, de onderkant van
het bedieningshuis (+15,0 m), de vorm van de trap, de pijlerkoppen (tot in het
dek) en de ellipsoïdische hoogte van NAP 0 (42,9 m, uit de vergelijking van
PDOK-terrein en AHN-DTM). De vakwerkliggers en ribben liggen volgens het AHN
0,55 m zuidelijker dan de randen van het BGT-dek; het model volgt het AHN
(dat op de BAG-panden ernaast binnen 0,25 m klopt).

Licentie van het model: eigen werk op basis van open bronnen.
