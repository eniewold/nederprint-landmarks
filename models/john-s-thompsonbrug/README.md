# John S. Thompsonbrug (Grave)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `john-s-thompsonbrug.glb` | Catalogusbron in meters met drie nodes: `road:rijbaan` en `road:fietspad`, de bovenste 0,5 m van de rijbaan tussen de wanden en van het fietspad met de attributen van het BGT-wegdeel erop (zie hieronder), en `building:john-s-thompsonbrug` met de rest: het dek met fietspad en dienstpad, de negen vakwerkoverspanningen (twee wanden elk), de acht pijlers, de twee landhoofden, de stuwwand met jukken onder de twee stuwvakken, de twee kraanwagens en het bedieningshuis op de stroompijler |
| `john-s-thompsonbrug-1-1500.stl` | De hele brug (alle drie nodes samen) in één stuk op 1:1500 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel benedenstrooms) op het printbed (354 × 22 × 16 mm) |
| `john-s-thompsonbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (179049,05, 420081,79) (WGS84
51,76890 N, 5,73561 O), op de as van de rijbaan (midden tussen de twee
vakwerkwanden) boven het hart van de stroompijler met de vistrap tussen de
twee stuwvakken, op de waterspiegel benedenstrooms van de stuw (NAP +5,2 m)
en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
oostnoordoosten, naar Nederasselt (`xAxis` (0,87705, 0,4804), 28,71 graden
linksom vanaf het oosten, langs de randen van het BGT-dek), +Y stroomafwaarts
naar het noordnoordwesten. Het Graafse landhoofd ligt op x = -227,8 tot
-215,0 (dagzijde), de pijlers op x = -163,0, -109,0, -55,2, 0 (stroompijler),
66,6, 131,7, 195,0 en 249,7 (harten) en het landhoofd van Nederasselt op
x = 300,0 (dagzijde) tot 302,5; de dagzijden liggen 515 m uit elkaar. Het
maaiveld wordt op vier punten op het water benedenstrooms van de stuw
bemonsterd (`groundSamplePoints`, 22 m naast de as op x = -35, -15, 20 en
45); `groundOffsetMetres` is 0, want het PDOK-terrein legt de Maas daar op
48,88 m ellipsoïdisch, de waterspiegel van het model. Omdat de brug 530 m
lang is, staat die hoogte ook als vaste terugval in `groundHeight` (48,88),
zodat een uitsnede die alleen een uiteinde raakt het model niet laat
wegvallen. Het stuwpand bovenstrooms ligt in PDOK 2,6 m hoger (51,5 m), de
uiterwaarden op circa 52,3 m; pijlers, landhoofden en stuwwand beginnen
allemaal op de vlakke onderkant 0,8 m onder het benedenwater en verdwijnen
daar in het terrein. Het model vervangt één BAG-pand:
`NL.IMBAG.Pand.0786100000132726`, het bedieningshuis van de stuw op de
stroomopwaartse kop van de stroompijler (PDOK reconstrueert het als een
kolom van het benedenwater tot NAP +18,1 m).

Onderdelen in het model (hoogtes in NAP):

- Het dek van 530,3 m van landhoofd tot landhoofd, 17,96 m breed (BGT): de
  rijbaan tussen de wanden (8,3 m) met de rijvloer en dwarsdragers 2,0 m
  diep, aan de stroomafwaartse kant het fietspad (de aangehangen brug, 5,1 m,
  0,2 m boven de rijbaan) en aan de stroomopwaartse kant het dienstpad
  (2,6 m, 0,25 m onder de rijbaan), boven de twee stuwvakken verbreed tot het
  bordes van 4,7 m voor de kraanwagens. De rijbaan volgt het AHN: NAP +16,1 m
  bij Grave, 1:80 omhoog naar de vlakke stuwvakken op +17,65 m (x = -110 tot
  64) en 1:82 omlaag naar +14,75 m bij Nederasselt.
- Negen vakwerkoverspanningen met twee wanden van 1,0 m, 9,25 m hart op hart
  (AHN), van 52,0, 54,0, 53,8, 55,2, 66,6, 65,0, 63,3, 54,7 en 50,3 m tussen
  de opleggingen (50 m en 60 m tussen de pijlerkoppen, zoals in het
  monumentenregister). De bovenrand is een veelhoek door de bovenknopen op
  een halve ellips (h = H √(1 − u²); die vorm past op het AHN), met H = 8,0,
  7,7, 8,8, 8,7, 10,6, 9,2, 9,2, 7,8 en 8,0 m boven de rijbaan (bovenkant
  NAP +24,6, 25,0, 26,4, 26,3, 28,1, 26,4, 25,6, 23,5 en 23,1 m). De eerste
  en laatste bovenknoop liggen 3 m van de oplegging op 0,55 H: de schuine
  eindstijl, en boven elke pijler vormen de eindstijlen van twee
  overspanningen een V. Vijf velden per overspanning van 50 m en zes per
  overspanning van 60 m, met een verticaal onder elke bovenknoop.
- In elke wand doorgaande driehoekige openingen met de punt omhoog aan
  weerszijden van elke verticaal (96 per wandlijn, flanken minstens 55
  graden) en blinde nissen van 0,35 m aan beide kanten voor de driehoeken
  met de vlakke kant boven (39 per wandlijn): het W-patroon van diagonalen
  met verticalen van de foto's. Bovenrand 1,1 m, diagonalen 1,0 m,
  verticalen 0,9 m, onderrand tot 0,6 m boven de rijbaan.
- Acht pijlers: zeven uit de BGT, met lange ronde koppen die stroomopwaarts
  4 tot 9 m buiten het dek steken, en de achtste (bij x = 249,7, 3,4 m breed,
  tussen de laatste twee overspanningen) uit het AHN, want die ontbreekt in
  de BGT. Het deel onder het dek loopt tot onder de rijvloer, de koppen
  erbuiten tot NAP +12,3 m (AHN, foto's). De stroompijler met de vistrap is
  7,4 × 33,4 m.
- Het bedieningshuis op de stroomopwaartse kop van de stroompijler, 3,6 ×
  3,6 m tot NAP +18,0 m (AHN).
- De stuw onder de twee stuwvakken (x = -53,0 tot -3,7 en 3,7 tot 64,4):
  aan de stroomopwaartse rand een wand van schuiven van 1,2 m dik tot
  NAP +9,6 m (AHN), met de schuiven 0,3 m terug tussen 20 jukken (tien per
  opening, 1,0 m breed) die als stijlen doorlopen tot onder het bordes.
- Twee kraanwagens op het bordes boven de stuw, 8 × 4,5 m tot NAP +24,4 m
  (AHN, foto Bridge grave2.jpg).
- De twee landhoofden van de onderkant tot de rijbaan over de volle
  breedte van het dek.
- Rijbaan en fietspad als eigen onderdelen (verplicht voor bruggen): de
  bovenste 0,5 m van het dek, gesneden met een strook van 0,5 m onder tot
  1 m boven het wegdek over dezelfde loftstations als het dek; de
  vakwerkwanden blijven over hun hele strook constructie, met 2 cm vrij.
  `road:rijbaan` (`bgt_functie` rijbaan regionale weg,
  `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt)
  is het dek tussen de wanden (y = -4,11 tot 4,11) en boven de landhoofden
  tot de paden (y = ±4,62), van x = -227,8 tot 302,5; BGT-wegdelen
  P0030.00f6f9687601f68ae050120a080440dd, P0030.00f6f9687602f68ae050120a080440dd,
  P0030.00f6f9687603f68ae050120a080440dd, P0030.00f6f9687604f68ae050120a080440dd,
  P0025.4e18b3228bcf424db1507fdef2a6fbfa en P0025.dd81973b2c454989ad200a04e5d9cd96
  (relatieve hoogteligging 1, x = -217,2 tot 302,5; boven het Graafse
  landhoofd ligt dezelfde functie op maaiveldniveau). `road:fietspad`
  (`bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding,
  `plus_fysiekvoorkomen` asfalt) is de bovenkant van de aangehangen brug
  binnen de BGT-vlakken P0030.00f6f9688cbdf68ae050120a080440dd,
  P0030.00f6f9688cbef68ae050120a080440dd en P0025.ecb727e816e240c49aab6e28d845c6d1
  (y = 5,0 tot 9,2, buiten de wand vanaf 5,15); de buitenste meter van het
  pad (tot de dekrand op 10,22) heeft geen wegdeel en blijft constructie. Twee
  smalle BGT-stroken rijbaan regionale weg in cementbeton
  (P0030.00f6f968feb7f68ae050120a080440dd en
  P0030.00f6f968feb8f68ae050120a080440dd, y = 4,1 tot 5,0) liggen onder de
  noordelijke wand en blijven constructie; het dienstpad en het bordes aan de
  stroomopwaartse kant hebben geen wegdeel in de BGT en blijven ook
  constructie. Het script controleert dat de as van rijbaan en fietspad in
  die BGT-vlakken ligt en dat de volumes van de drie nodes optellen tot de
  brug als geheel (32 206 m³: constructie 28 953, rijbaan 2 187, fietspad
  1 066 m³). Geen samenvallende bovenvlakken tussen de nodes (verticale
  stralen over het hele model); de 20 punten met een vlak zonder dikte in de
  constructie liggen in de vakwerkwanden en zaten al in het model zonder
  wegdeklaag.

Wat er niet in zit: de echte staven (geklonken profielen van circa 0,5 tot
0,8 m, vervangen door de plaat met openingen en nissen; de extra
tussendiagonalen en -verticalen van de stuwbruggen zijn op 1:1000 niet te
onderscheiden), de windverbanden met andreaskruisen en de portalen tussen de
wanden boven de rijbaan (vrije horizontale overspanningen van 9 m die op
1:1000 niet zonder steun printen), de verrijdbare schildersbruggen onder het
dek (vakwerkbakken van circa 2,5 m die vrij onder het dek hangen; de export
vult daar toch al een wig met een scherm op), leuningen, lantaarnpalen en
verkeersborden (dunner dan 0,9 m), de vistrap, de stuwvloer en de damwanden
(onder water) en de twee sluizen met hun kolken, hoofden en
bedieningsgebouw (een eigen complex naast en onder de brug; de kolkmuren
staan in het PDOK-terrein).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug
alleen een grijze strook op maaiveldhoogte onder de brug (het wegdeel van
de N324, van NAP +15,6 m bij de landhoofden doorhangend tot +7,7 m) met het bedieningshuis als
kolom; boven de uiterwaarden en de sluizen ontbreekt de brug helemaal. Het
model heeft van noord en zuid de negen vakwerkoverspanningen met hun
gebogen bovenranden, schuine eindstijlen, openingen en nissen en de V's boven
de pijlers, van de stroomopwaartse kant (zuid) bovendien de stuwwand met
jukken, de kraanwagens, het bedieningshuis en de lange pijlerkoppen, van de
stroomafwaartse kant (noord) het fietspad over de volle lengte, en van oost
en west de twee wanden boven het dek met fietspad en dienstpad ernaast en de
landhoofden.

Pasvorm op het AHN: de hoogste DSM-cel per 4 m op de twee vakwerklijnen ligt
in 78 % van de 114 vakken binnen 1 m en in 93 % binnen 2 m van de bovenrand
van het model (mediaan +0,04 m; de zevende overspanning niet meegerekend). In
het AHN zat de zevende overspanning (boven de sluizen, x = 131,7 tot 195,0)
onder een steigerkap tot NAP +28,2 m; daar is de hoogte gelijk aan de zesde
genomen (9,2 m boven de rijbaan), die even lang is.

Printbaarheid op 1:1000: open vakwerk is op 1:1000 niet te printen, daarom
zijn de wanden dichte platen van 1,0 m met openingen waarvan de flanken
minstens 55 graden steil zijn (de andere zijde is de verticaal) en nissen
van 0,35 m voor de driehoeken met een vlakke bovenkant. Alleen de onderkant
van het dek en de paden (9104 m²) en de plafonds van de nissen (507 m²)
hangen vrij; het script controleert dat alleen die naar beneden wijzen, dat
de openingen steil genoeg zijn, dat alles op dezelfde onderkant begint en dat
de printversie geen overhang heeft. De kraanwagens staan op het bordes, het
bedieningshuis op de pijlerkop en de jukken op de schuivenwand, dus zonder
overhang. Met 530 m past de brug op 1:1000 niet in één uitsnede van 400 mm;
in een uitsnede van 504 m (1:1259) gaat het model in de printcheck als
gesloten solid met overhangopvulling door (status NoError voor alle drie
onderdelen, 14,1 s, samen 36,2 naar 35,5 cm³ ten opzichte van de rechte
opvulling; rijbaan en fietspad krijgen geen eigen opvulling, `extraPct` 0,
de constructie draagt alles), en in een uitsnede van 350 m rond de stuw op
1:1000 ook (NoError, 22,4 s, 60,3 naar 54,2 cm³, rijbaan en fietspad
`extraPct` 0):
onder het dek komt een wig met een smal scherm tot de onderplaat, de
openingen in de wanden blijven open. De STL op 1:1500 heeft dezelfde
printvoet (wig van 50 graden en een scherm van 0,9 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/John_S._Thompsonbrug)
(1927-1929, 9 overspanningen, 515 m, doorvaarthoogte NAP +15,55 m, in
september 1944 tijdens Operatie Market Garden veroverd door luitenant John
S. Thompson, naam sinds 2004),
[Stuw- en sluizencomplex Grave](https://nl.wikipedia.org/wiki/Stuw-_en_sluizencomplex_Grave)
(twee stuwopeningen, 20 jukken met 60 schuiven, stuwpeil NAP +7,1 tot +8,5 m,
benedenwater +4,6 tot +6,45 m), het
[Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/514153)
(ontwerp ir. C.F. Egelie, negen segmenten van 50 en 60 m, vakwerkliggers met
gebogen bovenranden, schuine eindstijlen, verticalen en stijgende en vallende
diagonalen, rijvloer van 7,5 m, aangehangen brug aan de stroomafwaartse
zijde, bordes met kraanwagens aan de stroomopwaartse zijde, jukken met drie
rijen schuiven), PDOK BGT (overbruggingsdeel: dek, landhoofden, pijlers),
PDOK AHN (dsm en dtm 0,5 m via WCS: rijbaan, vakwerklijnen en hun
bovenranden, de achtste pijler, pijlerkoppen, kraanwagens, bedieningshuis),
de PDOK-luchtfoto (stuw, pijlers, slagschaduwen van de overspanningen), het
PDOK-terrein (waterspiegels) en de Wikimedia Commons-foto's Bridge
grave1.jpg, Bridge grave2.jpg, 2006-05-17 13.37 Grave, brug over de
Maas.JPG, Grave brug schip michelangelo.jpg, Nederasselt (Heumen)
Rijksmonument 523934 verkeersbrug met stuw en sluis.JPG, Grave (N-Br, NL)
fietspad van de Maasbrug.JPG en de RCE-foto's 20346217, 20346254, 20346256
en 20346260 (Overzicht verkeersbrug ... - Grave) voor het vakwerkpatroon, de
eindstijlen, de pijlers, de jukken, de kraanwagens en het fietspad. Geschat
zijn de waterspiegel benedenstrooms (NAP +5,2 m: PDOK-water 48,9 m
ellipsoïdisch min 43,7 m, het verschil tussen PDOK-terrein en AHN in de
uiterwaard), de constructiehoogte van het dek (2,0 m) en de paden (1,0 m),
de dikte van de wanden (1,0 m) en de staafbreedtes, het aantal velden (5
per overspanning van 50 m, 6 per overspanning van 60 m, uit de
windverbanden in het AHN en de foto's), de plaats en hoogte van de eerste
bovenknoop (3 m, 0,55 H), de hoogte van de zevende overspanning (gelijk aan
de zesde), de hoogte van de pijlerkoppen (NAP +12,3 m, uit enkele
AHN-cellen), de vorm van de achtste pijler (rechthoek met ronde koppen naar
de BGT-vorm van de eerste), de hoogte van de schuivenwand (NAP +9,6 m) en de
verdeling van de jukken (tien gelijke per opening).

Licentie van het model: eigen werk op basis van open bronnen.
