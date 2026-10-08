# IJsselbrug (Zwolle)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ijsselbrug-zwolle.glb` | Catalogusbron in meters, drie nodes: `building:ijsselbrug-zwolle` met het dek, de stalen boog van 138 m (twee vakwerkbogen met hangers, eindstijlen, windverband en schoren onder het dek), de rivierpijlers, de negen betonnen aanbrugbogen op pijlers met ronde koppen en de twee landhoofden; `road:rijbaan` (`bgt_functie` rijbaan lokale weg, `bgt_fysiekvoorkomen` gesloten verharding) en `road:fietspad` (`bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding), de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder |
| `ijsselbrug-zwolle-1-1250.stl` | De brug in één stuk (alle drie de nodes samen) op 1:1250 met een printvoet onder het dek en de bogen, met de onderkant (0,8 m onder de waterspiegel) op het printbed (350 × 18 × 28 mm; met `--scale 1000` 437 mm lang) |
| `ijsselbrug-zwolle.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De IJsselbrug is de verkeersbrug van de Zuiderzeestraatweg over de IJssel
tussen Zwolle en Hattem (1930; na de vernielingen van 1940 en 1945 in 1947
hersteld). Op deze plek ligt één brug. De Hanzeboog (spoorbrug van de
Hanzelijn) 800 m stroomopwaarts en de Nieuwe IJsselbrug van de A28 300 m
stroomafwaarts zijn eigen catalogusitems en zitten er niet in.

De GLB is in meters met de oorsprong op RD (200533,94, 501238,24), op de as
van het dek midden tussen de twee rivierpijlers, op de waterspiegel van de
IJssel zoals het PDOK-terrein die legt (NAP +1,3 m) en de glTF-conventie Y
omhoog. +X loopt langs de brug naar het oosten, naar Zwolle (`xAxis`
(0,87568, 0,48288), 28,87 graden linksom vanaf het oosten, langs de BGT-randen
van het dek), +Y stroomafwaarts naar het noordnoordwesten. Het westelijke
landhoofd bij Hattem ligt op x = -262 tot -253,8, de rivierpijlers op x = ±69,1
en het oostelijke landhoofd bij Zwolle op x = 159,2 tot 175,5 (BGT). Het
maaiveld wordt op zes punten op het water naast de boog bemonsterd
(`groundSamplePoints`, 30 m naast de as op x = -40, 0 en 40);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de IJssel op NAP +1,3 m
(ellipsoïdisch 44,10 tot 44,11 m). `groundHeight` is 44,10 m, de PDOK-hoogte
op die punten, zodat een uitsnede die alleen een aanbrug raakt het model niet
laat wegvallen. Geen BAG-pand onder de brug. Het hart van het model ligt op
52,49695 N, 6,05772 O, circa 40 m van de controle-URL.

Onderdelen in het model (hoogtes in NAP):

- Het dek met het wegdek volgens het AHN-DSM om de 10 m: +8,4 m aan het
  westelijke landhoofd, +12,05 m onder de boog en +9,6 m aan het oostelijke
  landhoofd. Over de aanbruggen 15 m breed (BGT), een betonnen dek van 1,8 m
  boven de kruin van de bogen; onder de boog 17,1 m breed (de fietspaden liggen
  buiten de bogen), een stalen rijvloer van 2,0 m.
- Het wegdek als eigen onderdelen met PDOK-attributen (glTF
  `extras.attributes`), zodat de kleurregels van een thema (bijvoorbeeld
  fietspaden rood) op het brugdek werken zoals op de PDOK-wegdelen ernaast:
  `road:rijbaan` en `road:fietspad` zijn de bovenste 0,5 m van het dek over de
  hele lengte, van landhoofd tot landhoofd. Bron: de actuele BGT-wegdelen met
  relatieve hoogteligging 1 op het dek, alle drie gesloten verharding zonder
  plus-fysiek voorkomen: de rijbaan `G0244.208cd15963e34fc3ab9d4d0d7859962c`
  (rijbaan lokale weg, 7,1 tot 7,8 m breed in het midden) en de fietspaden
  `G0244.0235022d100f471d9aad7ebe42e7bf07` (zuidkant) en
  `G0244.597d21f733c04a8395e1958bb3ededdd` (noordkant), samen één node. Over de
  aanbruggen volgt de grens tussen rijbaan en fietspad het BGT-vlak van de
  rijbaan (vereenvoudigd tot 5 cm); de fietspaden lopen door tot de dekrand,
  ook waar de BGT-fietspaden die net niet halen. Onder de boog ligt de
  BGT-grens aan de noordkant 0,4 m binnen de boog en aan de zuidkant 0,2 m in
  de boog; daar is alles tussen de bogen rijbaan en alles erbuiten fietspad,
  zodat er geen strookje van 0,4 m langs een boog overblijft. De bogen (de hele
  plaat met de eindstijlen, ook onder de openingen tussen de hangers, met 2 cm
  vrij) blijven constructie. De wegdeklaag is gesneden met een strook van
  0,5 m onder tot 1 m boven het wegdek over de loftstations van de dekdelen,
  breder dan het dek en voorbij de landhoofden; de constructie houdt zo
  nergens een vlak op het wegdek over. De drie nodes tellen samen op tot het
  volume van de brug als geheel (26 882 m³: constructie 23 633, rijbaan 1 567,
  fietspad 1 682 m³); de STL is ongewijzigd.
- De stalen boog van 138 m tussen de rivierpijlers als twee rechtopstaande
  vakwerkbogen 4,3 m naast de as (AHN: de bovenranden liggen op alle hoogtes
  op dezelfde plaats). De bovenkant is een parabool met de top op +35,7 m
  (AHN) die bij de eindstijlen (x = ±69,6) op +18,4 m uitkomt; de binnenrand
  heeft de top 7,0 m lager (+28,7 m), kruist het wegdek 55 m uit het midden en
  loopt onder het dek door naar de oplegging op de rivierpijler (+4,5 m). 22
  velden van 6,27 m: op elke knoop een stijl in de boog en een hanger naar het
  dek. Elke boog is een plaat van 1,2 m met randen van 1,4 m; tussen dek en
  binnenrand doorgaande openingen met een spitse top van 55 graden (de
  hangers als stijlen van 1,0 m), in het vakwerk doorgaande driehoeken onder
  de diagonalen met een flank van 53 graden of steiler (samen 36 openingen per
  boog), en 40 blinde nissen van 0,35 m aan de buitenkant voor de driehoeken
  onder de bovenrand en de rest van de vakwerkdriehoeken.
- Het windverband tussen de bovenranden over de middelste 100 m: dwarsstaven
  op elke knoop en kruisen daartussen (49 staven van 0,9 m met een
  V-onderkant van 50 graden).
- Onder het dek per boog twee schoren van 1,2 m van de oplegging op de
  rivierpijler naar de eindstijl en naar het dek binnen de pijler, op een
  opleggingsblok.
- De rivierpijlers van 6,1 × 22,6 m met ronde koppen tot +4,5 m (de oostelijke
  uit de BGT, de westelijke gespiegeld), met daarop de aanzet van de eerste
  betonnen boog.
- De aanbruggen: zes betonnen bogen aan de kant van Hattem (vijf pijlers op
  gelijke afstand, overspanningen van 27 tot 29 m) en drie aan de kant van
  Zwolle (pijlers op x = 102,65 en 132,85 uit de BGT, overspanningen van 29, 27
  en 25 m). Elke boog is een halve ellips van de aanzet op +3,5 m tot de kruin
  1,8 m onder het wegdek (+7,1 tot +9,4 m), dicht tot het dek, met de boogring
  van 1,0 m aan beide kanten 0,3 m voor het boogvlak. De pijlers hebben voeten
  van 3 × 15 m met ronde koppen (BGT) tot de aanzet.
- De landhoofden als blokken tot het wegdek.

Wat er niet in zit: het eindportaal tussen de bogen (een horizontale balk van
8,6 m vrij boven de rijbaan, die de export tot op het dek zou opvullen);
leuningen, lantaarns en het inspectiebordes onder het dek (dunner dan 0,9 m);
de open ruimte onder de betonnen bogen tussen de boogribben (de bogen zijn
dichte trommels); de dijken achter de landhoofden (die zitten in het
PDOK-terrein). De PDOK-reconstructie (`?landmarks=0`) heeft van de brug alleen
een vlakke wegstrook op het maaiveld; die blijft onder het model liggen.

Binnen het dek (strook van 14 m, AHN-DSM 0,5 m) ligt 84 % van de cellen binnen
1 m van het wegdek van het model (86 % binnen 2 m, mediaan +0,01 m); de rest
zijn de bogen, hangers, het windverband en de lantaarns boven het dek. De
bovenkant van de bogen ligt in 81 % van de doorsneden binnen 1 m van het
hoogste DSM-punt in de strook van elke boog (87 % binnen 1,5 m, mediaan
-0,20 m).

Printbaarheid op 1:1000: het open vakwerk en de hangers zijn niet als staven
te printen; elke boog is een plaat met doorgaande openingen waarvan de
bovenflanken minstens 53 graden steil zijn (de openingen tussen de hangers
met een spitse top van 55 graden, de driehoeken in het vakwerk onder de
diagonalen alleen waar die steil genoeg zijn, de rest als nis). De staven van
het windverband hebben een V-onderkant van 50 graden en printen zonder steun.
Vrij hangen de onderkant van het dek en de bogen van de aanbruggen (samen
6 300 m²); de STL heeft daaronder een printvoet (een wig van 50 graden vanaf de
randen die uitloopt in een scherm van 0,9 m tot de onderplaat, de bovenkant
volgt de bogen), waarna 221 m² aan nisplafonds en randjes overblijft. In de
export (printcheck, gesloten solid met overhangopvulling, status NoError): een
uitsnede van 400 × 400 m rond de boog op 1:1000 in 62 s (47,6 naar 52,7 cm³,
+11 %; de openingen tussen de hangers blijven open), het hele model (420 m,
1:1051) in 61 s (41,4 naar 48,4 cm³, +17 %; de constructie 38,6 naar
45,6 cm³, +18 %, de rijbaan 1,35 en het fietspad 1,45 cm³ zonder eigen
opvulling). Met 437 m past de brug op 1:1000
net niet in één uitsnede; de STL staat daarom op 1:1250. Het PDOK-terrein ligt
op het water op de waterspiegel van het model; in de uiterwaarden ligt het
maaiveld op NAP +1 tot +2 m, onder de aanzet van de betonnen bogen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/IJsselbrug_(Zwolle))
(1930, vernield 1940 en 1945, heropend 1947, lengte 412 m, breedte 17 m,
langste overspanning 138 m, doorvaarthoogte 10,9 m), PDOK BGT
(overbruggingsdeel: dek, oostelijke rivierpijler, twee aanbrugpijlers,
landhoofden), PDOK AHN (dsm en dtm 0,5 m via WCS: wegdek, bovenrand en
ligging van de bogen), PDOK BGT-wegdelen (rijbaan en fietspaden op het dek,
zie hierboven), het PDOK-terrein (waterspiegel), PDOK Luchtfoto voor de
plattegrond en Wikimedia Commons-foto's (Zwolle IJsselbrug.jpg; Zwolle
IJsselbrug 02.JPG; 20151217 IJsselbrug Zwolle.jpg; 20150819 IJsselbrug
Zwolle.jpg; The old roadbridge across the IJssel at Zwolle - panoramio.jpg;
Old steel roadbridge over the IJssel at Zwolle - panoramio.jpg; 2007-04-23
10.40 Zwolle, brug over de IJssel op de weg naar Hattem.JPG) voor het vakwerk
van de bogen, de hangers, het windverband, de schoren onder het dek en de
betonnen bogen. Geschat zijn de binnenrand van de bogen (top 7,0 m onder de
bovenkant, op het wegdek 55 m uit het midden, op foto's), het aantal velden
(22), de staafmaten (randen 1,4 m, stijlen en hangers 1,0 m, plaat 1,2 m), de
constructiehoogtes van het dek (2,0 m onder de boog, 1,8 m boven de betonnen
bogen), de aanzet van de betonnen bogen (+3,5 m) en de hoogte van de
rivierpijlers (+4,5 m), de plaats van de westelijke aanbrugpijlers (zes gelijke
bogen; niet in de BGT) en de westelijke rivierpijler (gespiegeld). De
waterspiegel is de PDOK-waarde van NAP +1,3 m, die met de rivierstand
meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
