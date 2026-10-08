# Hedelse spoorbrug (Hedel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hedelse-spoorbrug.glb` | Catalogusbron in meters met twee nodes: `road:spoor`, de bovenste 0,5 m van het dek in de twee spoorbedden tussen de liggers, met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` half verhard; en `building:hedelse-spoorbrug` met de rest van het dek, de vier vakwerkliggers van de twee bruggen (de doorgaande ligger over de rivier en vier velden in de uiterwaarden), de stenen rivierpijlers, de pijlers in de uiterwaarden en de twee landhoofden |
| `hedelse-spoorbrug-1-1500.stl` | De brug in één stuk (constructie en spoor samen) op 1:1500 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (330 × 20 × 16 mm) |
| `hedelse-spoorbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (147197,04, 416821,90) (WGS84
51,74006 N, 5,27423 O), op de as van het BGT-dek midden tussen de twee
rivierpijlers, op de waterspiegel van de Maas (NAP +1,1 m) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar het noorden, naar Hedel
(`xAxis` (-0,06925, 0,9976), 93,97 graden linksom vanaf het oosten), +Y
stroomafwaarts naar het westen. Het zuidelijke landhoofd ligt op x = -186,8
tot -174, de pijler aan de zuidoever op x = -117,2 tot -113,1, de
rivierpijlers op x = -57,4 tot -49,4 en 48,8 tot 56,7, de pijlers in de
noordelijke uiterwaard op x = 109,8 tot 115,5, 171,1 tot 176,3 en 231,6 tot
238,4 en het noordelijke landhoofd op x = 296 tot 308,7. Het maaiveld wordt op
zes punten op het water naast de hoofdoverspanning bemonsterd
(`groundSamplePoints`, 25 m naast de as op x = -30, 0 en 30);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de Maas op 44,63 m
ellipsoïdisch, de waterspiegel van het model. Omdat de brug 495 m lang is,
staat die hoogte ook als vaste terugval in `groundHeight` (44,63), zodat een
uitsnede die alleen een uiteinde raakt het model niet laat wegvallen. Geen
BAG-pand onder de brug.

Sinds de verdubbeling van 1978 liggen er twee gelijke spoorbruggen naast
elkaar, elk met twee vakwerkliggers (AHN: vier lijnen op 6,25 en 1,0 m naast
de as; foto HUA-170350). Het model bevat beide samen in de constructienode;
alleen de spoorbedden zijn een eigen node. De Hedelse brug
(weg) ligt 400 m stroomafwaarts en heeft een eigen model (`hedelse-brug`); de
twee modellen overlappen niet.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 495,5 m van landhoofd tot landhoofd, 15,4 m breed (BGT), met de
  spoorstaaf volgens het AHN: +11,6 m op het zuidelijke talud, +12,25 m over
  de rivier en +10,25 m op het noordelijke talud. De onderkant van de
  dwarsdragers ligt 1,5 m onder de spoorstaaf.
- Vier vakwerkliggers van 1,0 m dik: de buitenste 6,25 m en de binnenste
  1,0 m naast de as, met tussen de twee bruggen een spleet van 1,0 m. Elke
  ligger is een dichte plaat met een onderrand tot 0,6 m boven de spoorstaaf,
  een bovenrand en diagonalen van 0,9 m (W-vakwerk) en bij de opleggingen een
  schuine eindstijl.
- De doorgaande ligger over de rivier over drie velden (61,8, 106,1 en
  59,9 m; Wikipedia: langste overspanning 107,16 m) met 8, 14 en 8 vakken. De
  bovenrand is een veelhoek door de bovenknopen: +21,1 m in het midden van de
  hoofdoverspanning (over 30 m vlak, daarbuiten kwadratisch oplopend), +24,5
  tot +24,7 m naast de rivierpijlers en in de zijvelden 50 m lang lineair
  dalend naar +17,6 m (AHN).
- Een veld van 61,4 m aan de zuidkant en drie velden van 61,1, 61,3 en
  63,3 m in de noordelijke uiterwaard, met evenwijdige randen 5,9 m boven de
  spoorstaaf (AHN) en 8 vakken.
- In de liggers 62 doorgaande driehoekige openingen met de punt omhoog
  (flanken van 53 graden of steiler) en 57 blinde nissen van 0,35 m voor de
  driehoeken met een vlakke bovenkant (aan de buitenkant van de buitenste en
  aan de spoorkant van de binnenste liggers).
- Twee stenen rivierpijlers van 8 × 29,6 m met spitse koppen (BGT); de
  koppen houden 2,5 m onder de oplegbank op, het middendeel loopt tot onder
  het dek.
- De pijler aan de zuidoever (4,1 × 22,5 m, ronde koppen) en drie pijlers in
  de noordelijke uiterwaard (5,2 tot 6,8 × 23 tot 24 m) volgens de BGT, tot
  onder het dek.
- De twee landhoofden tot de spoorstaaf, met de twee ronde pijlertjes naast
  het zuidelijke landhoofd (BGT).
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van het dek in de
  twee spoorbedden tussen de buitenste en de binnenste ligger van elke brug
  (y = -5,73 tot -1,52 en 1,52 tot 5,73, 4,2 m breed, 2 cm vrij van de
  vakwerkplaten), over de hele lengte van het dek, met in de GLB
  `extras.attributes` `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen:
  "half verhard" }`, zodat de kleurregels van een thema (bijvoorbeeld spoor
  zwart) op de brug werken zoals op de BGT-wegdelen ernaast. De spleet tussen
  de bruggen, de randen buiten de liggers en de liggers zelf blijven
  constructie. Op het dek ligt sinds 7 april 2025 geen actueel BGT-wegdeel
  meer (de spoorbaanvlakken L0004.3a7dc2ebf4a044ec82857246e028c348 en
  L0004.3388baf14d964a1b9e809e9a43d4e895, gesloten verharding, zijn toen
  beëindigd); daarom zijn volgens de uitwijkregel de attributen van de
  wegdelen op de landhoofden genomen: L0004.ebfcd0d53e654ee9b36794cc5d3028a8
  (relatieve hoogteligging 1, op het zuidelijke landhoofd, x = -186,8 tot
  -177,7) en L0004.62130dec3e044e82b25c960e2f536f77 (op het noordelijke
  talud vanaf x = 308,6), beide spoorbaan, half verhard, zonder plus-fysiek
  voorkomen. De strook loopt over dezelfde loftstations als het dek, van
  0,5 m onder tot 1 m boven de spoorstaaf; spoor = strook ∩ brug, constructie
  = brug − strook (samen 31.921 m³: constructie 29.835, spoor 2.086). Het
  script controleert dat de volumes optellen; er liggen geen samenvallende
  bovenvlakken van de twee nodes op het dek.

Wat er niet in zit: de echte staven (kruisende diagonalen en stijlen van
circa 0,5 m, vervangen door de plaat met openingen en nissen in een
W-patroon), de windverbanden en portalen tussen de liggers boven het spoor
(vrije horizontale overspanningen van 5 m die op 1:1000 niet zonder steun
printen), de bovenleiding, leuningen en loopbruggen, en het kleine
viaduct over het fietspad 85 m ten zuiden van het landhoofd (een los
BGT-dek).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke strook met pijlerkoppen zonder liggers. Het model heeft van oost en
west de vier vakwerkliggers met openingen en nissen en de karakteristieke
bulten van de doorgaande ligger boven de rivierpijlers, van noord en zuid de
twee bruggen naast elkaar met de spleet ertussen en de schuine eindstijlen,
en van alle kanten de stenen pijlers met spitse koppen en de pijlers in de
uiterwaarden.

Pasvorm op het AHN: de omhullende per 8 m (hoogste DSM-cel op elk van de vier
vakwerklijnen) ligt in 55 van de 60 vakken binnen 1 m en in 58 binnen 2 m van
de bovenrand van het model (mediaan +0,09 m). Per cel ziet het AHN door het
open dek en het open vakwerk heen: over het spoor ligt 58 % van de cellen
binnen 2 m (mediaan +0,11 m).

Printbaarheid op 1:1000: open vakwerk is op 1:1000 niet te printen, daarom
zijn de liggers dichte platen van 1,0 m met openingen waarvan de flanken
minstens 53 graden steil zijn en nissen van 0,35 m voor de driehoeken met een
vlakke bovenkant. Alleen de onderkant van het dek (6666 m²) en de plafonds van
de nissen (486 m²) hangen vrij; het script controleert dat alleen die naar
beneden wijzen, dat de openingen steil genoeg zijn, dat alles op dezelfde
onderkant begint en dat de printversie buiten de nissen geen overhang heeft.
Met 495 m past de brug op 1:1000 niet in één uitsnede; in een uitsnede van
525 m (1:1313, 400 mm) gaan beide onderdelen in de printcheck als gesloten
solid met overhangopvulling door (status NoError, 13,2 s): de constructie van
36,9 naar 25,5 cm³ ten opzichte van de rechte opvulling, het spoor 0,9 cm³
zonder eigen opvulling (`extraPct` 0), samen 26,4 cm³ zoals voor de
opsplitsing. Onder het dek komt een wig met een smal scherm tot de
onderplaat, de openingen in de liggers blijven open. De STL op
1:1500 heeft dezelfde printvoet (wig van 50 graden en een scherm van 0,9 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Hedelse_spoorbrug) (1870,
herbouwd na de oorlog, verdubbeld tot twee sporen in 1978, circa 470 m lang,
langste overspanning 107,16 m, doorvaartbreedte 100 m, doorvaarthoogte
11,52 m), PDOK BGT (overbruggingsdeel: dek, pijlers, sloven, landhoofden;
wegdeel: de spoorbaan op de landhoofden voor de attributen van het spoor),
PDOK AHN (dsm en dtm 0,5 m via WCS: spoorstaaf, vakwerklijnen en hun
bovenrand), het PDOK-terrein (waterspiegel) en de Wikimedia Commons-foto's
Hedel spoorbrug 1.jpg, Hedel spoorbrug 2.jpg, Hedel spoorbrug 3.jpg, Hedelse
spoorbrug.jpg, Hedelse Brug.jpg (toont de spoorbrug) en HUA-170350-Gezicht op
de spoorbrug over de Maas bij Hedel, na de verdubbeling van de brug.jpg voor
de vorm van de liggers, de verdubbeling en de stenen pijlers. Geschat zijn de
waterspiegel (NAP +1,1 m: PDOK-water 44,63 m ellipsoïdisch min 43,55 m, het
verschil tussen PDOK-terrein en AHN in de uiterwaard), de diepte onder de
spoorstaaf (1,5 m), de staafbreedte (0,9 m), de dikte van de liggers (1,0 m),
het aantal vakken (8 per veld van 60 m, 14 in de hoofdoverspanning), het
W-patroon in plaats van de kruisende diagonalen, de vorm van de bovenrand
tussen de AHN-punten (kwadratisch in de hoofdoverspanning, lineair in de
zijvelden), de hoogte waarop de spitse koppen van de rivierpijlers ophouden
(2,5 m onder de oplegbank) en de spoorstaafhoogte op de velden in de
uiterwaard (lineair tussen de pijlers, AHN in stappen van 0,25 m).

Licentie van het model: eigen werk op basis van open bronnen.
