# IJsselspoorbrug (Deventer)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ijsselspoorbrug-deventer.glb` | Catalogusbron in meters met zes nodes: `road:spoor` (de bovenste 0,5 m van het dek binnen de BGT-spoorbaanvlakken met gesloten verharding, `bgt_functie` spoorbaan, `bgt_fysiekvoorkomen` gesloten verharding), `road:spoor-ballastbed` (idem op de vlakken met half verharding op de landhoofden en het veld over de weg), `road:fietspad` en `road:voetpad` (fietspad en voetpad, gesloten verharding), `road:voetpad-op-trap` (de bovenste 0,5 m van de trap naar de uiterwaard, voetpad op trap, gesloten verharding, `plus_fysiekvoorkomen` cementbeton) en `building:ijsselspoorbrug-deventer` met de rest: de vakwerkbrug, de pijlers en poeren, de betonnen dekken, de landhoofden, de schampkanten en randbalken en de trap |
| `ijsselspoorbrug-deventer-1-1500.stl` | De brug in één stuk (constructie en wegdelen samen) op 1:1500 met een printvoet onder de dekken, de onderkant (0,8 m onder het water) op het printbed (346 × 21 × 15 mm; `--scale 1000` geeft 519 mm) |
| `ijsselspoorbrug-deventer.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De IJsselspoorbrug is de dubbelsporige brug van de spoorlijn Apeldoorn -
Deventer over de IJssel, gebouwd van 1979 tot 1982 op de fundamenten van de
brug van 1887 en op 7 mei 1982 geopend. Ze heeft een fietspad aan de
zuidkant (deel van snelfietsroute F344) en een voetpad aan de noordkant.

## Oorsprong, assen en maaiveld

De GLB is in meters met de oorsprong op RD (206809,90, 474439,11) (WGS84
52,25555 N, 6,14600 O), op de spooras (midden tussen de twee
BGT-spoorhartlijnen) midden tussen de harten van de twee rivierpijlers, en de
glTF-conventie Y omhoog. Na omzetting naar Z omhoog loopt +X langs de brug
naar het noordoosten, naar Deventer (`xAxis` (0,66128, 0,75014), 48,60 graden
linksom vanaf het oosten, langs de spoorhartlijnen), +Y naar het noordwesten
(stroomafwaarts, de kant van het voetpad); het fietspad ligt aan de
zuidoostkant (y < 0). z = 0 is het water van de nevengeul zoals het
PDOK-terrein het legt (46,22 m ellipsoïdisch, NAP +2,98 m; het PDOK-terrein
ligt hier 43,24 m boven het AHN).

Het westelijke landhoofd ligt op de dijk (x = -416,89 tot -404,61), het veld
over de weg langs de dijk tot de voeg op x = -385,6, de betonnen aanbrug tot
de westelijke rivierpijler (x = -47,93), de vakwerkbrug tot de oostelijke
rivierpijler (x = 47,93), het oostelijke veld over de IJsselkade tot het
oostelijke landhoofd (x = 89,3 tot 102,13). Het midden van het model ligt op
x = -157,4 (52,25450 N, 6,14446 O); daar valt ook de controle-URL.

Het maaiveld wordt op twaalf punten op het water bemonsterd
(`groundSamplePoints`, 25 m naast de as op x = -290, -252 en -213 in de
nevengeul en x = -30, 0 en 30 op de IJssel). `groundOffsetMetres` is 0 en
`groundHeight` (46,22) is de laagste PDOK-hoogte op die punten, als vaste
terugval voor een uitsnede die alleen een uiteinde raakt. De pijlers op de
uiterwaard en de landhoofden beginnen op de gemeenschappelijke onderkant en
steken in het terrein. Er ligt geen BAG-pand onder de brug, dus geen
`replacesBuildings`. De Wilhelminabrug (`wilhelminabrug-deventer`) ligt
circa 1 km zuidoostelijker (dichtstbijzijnde punten ruim 900 m uit elkaar); de modellen raken elkaar niet.

## Onderdelen (hoogtes in NAP)

- **Dek**: bovenkant (dwarsliggers en paden) volgens het AHN: +12,6 m op het
  westelijke landhoofd, oplopend tot +14,9 m bij de westelijke rivierpijler,
  +15,0 m over het vakwerk en +14,8 m op het oostelijke landhoofd. Dekranden
  uit de BGT: 15,6 tot 16 m breed, over het vakwerk 17,8 m.
- **Vakwerkbrug** van 95,9 m tussen de pijlerharten (Wikipedia: overspanning
  95,7 m): twee vakwerklijnen van 1,0 m dik, 4,7 m ten zuidoosten en 5,0 m ten
  noordwesten van de as (AHN). Warrenligger met negen vakken van 10,65 m,
  alleen diagonalen (geen stijlen), schuine eindstijlen van de oplegging naar
  de eerste bovenknoop een half vak verder, bovenrand op +24,3 m (AHN), de
  onderrand tot 0,9 m boven het dek. Op 1:1000 is elk vakwerk een dichte plaat
  van 1,0 m: de driehoeken met de punt omhoog zijn doorgaande openingen
  (flanken van 57,6 graden, negen per ligger), de driehoeken met een vlakke
  bovenkant blinde nissen van 0,35 m aan de buitenkant (acht per ligger).
  Vakwerkdek: plaat van 0,8 m met dwarsdragers tot 1,6 m onder het dek tussen
  de liggers.
- **Rivierpijlers** met spitse koppen (BGT: 5,6 × 21,8 m) tot 2,4 m onder het
  vakwerkdek, met een kop van 1,0 m die 0,35 m uitsteekt boven een kraag van
  52 graden, en opleggingen van 2,0 × 1,2 m onder elke vakwerklijn.
- **Westelijke aanbrug**: kokerligger van 3,6 m (dekplaat 1,0 m over de hele
  breedte, koker van 8 m onder en 10 m boven), doorlopend van x = -385,6 tot
  -47,93 op negen wandpijlers op een steek van 38,2 m (x = -385,6, -347,45,
  -309,31, -271,12, -232,93, -194,75, -156,76, -118,52 en -80,44): wanden
  van 3,7 × 11,6 m met spitse koppen (BGT op de uiterwaard) en een kop van
  1,0 m onder de koker. De vier pijlers in de nevengeul staan op brede
  achthoekige poeren (BGT, 19 × 25 m) tot +4,3 m.
- **Veld over de weg** langs de dijk (x = -404,61 tot -385,6) en het
  **oostelijke veld** over de IJsselkade (x = 47,93 tot 89,3): kokerligger
  van 2,6 m.
- **Landhoofden**: massieve blokken op de BGT-contour tot het dek.
- **Schampkanten** van 0,9 m breed en 0,9 m hoog tussen het spoor en de paden
  (AHN 0,8 tot 0,9 m boven het dek), tegen de binnenrand van het fietspad en
  het voetpad; over het vakwerk tot tegen de liggers. **Randbalken** van 0,6 m
  breed en 0,5 m hoog aan de buitenranden in plaats van de leuningen.
- **Trap** van het voetpad naar de uiterwaard bij de pijler op x = -118,5
  (BGT voetpad op trap, x = -121,29 tot -117,05, tot 18,35 m naast de as):
  een dicht blok met een bordes op dekhoogte en vijf treden van 1,0 m tot
  +9,5 m (AHN: de bovenste trap daalt tot circa +9,5 m, de rest ligt eronder).

## Wegdelen (BGT, relatieve hoogteligging 1)

De wegdelen zijn de bovenste 0,5 m van het dek binnen de actuele BGT-vlakken,
min de schampkanten, randbalken en vakwerkliggers met 2 cm marge.

| Node | BGT-wegdeel (lokaal_id) | Attributen |
| --- | --- | --- |
| `road:spoor` | L0004.b1b292607e1b29a1e0530b29a8c08503, L0004.b1b292607e3429a1e0530b29a8c08503 (de twee sporen op de westelijke aanbrug), L0004.b1b292607e3329a1e0530b29a8c08503 (vakwerk en oostelijk veld) | spoorbaan, gesloten verharding |
| `road:spoor-ballastbed` | L0004.b1b292607e4629a1e0530b29a8c08503 (westelijk landhoofd en veld over de weg), L0004.b1b292607e4429a1e0530b29a8c08503 (oostelijk landhoofd) | spoorbaan, half verhard |
| `road:fietspad` | L0004.b1b292607e2b29a1e0530b29a8c08503, G0150.e789cd936553481c8245ab67058b9af3 | fietspad, gesloten verharding |
| `road:voetpad` | L0004.b1b292607e3f29a1e0530b29a8c08503 | voetpad, gesloten verharding |
| `road:voetpad-op-trap` | G0150.83ad087fda7c49ad94a6af5cc35edcc5 (relatieve hoogteligging 0) | voetpad op trap, gesloten verharding, cementbeton |

Op de westelijke aanbrug liggen alleen de twee sporen zelf in de BGT; de
strook tussen de sporen en die tussen spoor en schampkant blijven constructie.

## Weggelaten

- Het windverband (kruisen tussen de bovenranden) en de eindportalen: vrije
  horizontale staven van 9,7 m boven het spoor, die de export op 1:1000 tot
  het dek zou opvullen.
- Het looppad met leuning op de bovenrand, de leuningen langs de paden (open
  hekwerk, vervangen door randbalken), de bovenleiding met portalen en de
  lantaarns: kleiner dan 0,9 m.
- De trappen langs de landhoofden (BGT voetpad op trap, relatieve
  hoogteligging 0): ze liggen in de taluds, die in het PDOK-terrein zitten.
- Het monument voor de Katherine Millerspoorbrug op de oostoever: los
  beeld naast de brug.

## Pasvorm en controle

- Volumes: de zes onderdelen tellen op tot het volume van de brug als geheel
  (verschil 0,05 m3 op 31 854 m3); elke node is een gesloten manifold.
- Geen samenvallende vlakken (z-fighting-controle met 30 000 verticale
  stralen over het dek).
- In het model hangen alleen de onderkant van de dekken en de plafonds van
  de blinde nissen vrij; de doorgaande openingen hebben een spitse top.
- Printcontrole van de catalogus (uitsnede rond het hele model, 400 mm,
  effectief 1:1075): alle onderdelen NoError, de wegdelen zonder eigen
  opvulling (`extraPct` 0).

## Geschat

De dekdiktes (vakwerkdek 1,6 m met randen van 0,8 m, westelijke aanbrug
3,6 m, de twee korte velden 2,6 m, uit foto's), de pijlers op x = -347,45 en
-385,6 (niet in de BGT, op de steek van 38,2 m en bij de voeg in het dek),
de vorm van de wandpijlers op de poeren en op die twee plaatsen (als de
gemeten wandpijlers), de koppen van de pijlers, de bovenkant van de poeren
(+4,3 m) en van de rivierpijlers (2,4 m onder het dek), de staafbreedte
(1,0 m) en de hoogte van de onderrand (0,9 m boven het dek), de randbalken,
en de trap als dicht blok met zes treden.

## Bronnen

- [Wikipedia: IJsselspoorbrug (Deventer)](https://nl.wikipedia.org/wiki/IJsselspoorbrug_(Deventer))
- PDOK BGT overbruggingsdeel, wegdeel en spoor (EPSG:28992)
- PDOK AHN DSM en DTM 0,5 m (WCS)
- PDOK luchtfoto (Actueel_orthoHR)
- Wikimedia Commons: IJsselspoorbrug Deventer, 2011.jpg; IJsselspoorbrug
  Deventer.JPG; IJsselspoorbrug - Deventer.jpg; Spoorbrug rail bridge Deventer
  2019.jpg (en 2019 2, 2019 3); Railway bridge across the IJssel river at
  Deventer from the Northside - panoramio.jpg; Hoogwater Deventer december
  2023 03.jpg en 04.jpg; Deventer brug over de IJssel (50143597592).jpg;
  Spoorviaduct Deventer 2024.jpg; Spoorbrug rail bridge Deventer train 2019
  1.jpg; Spoorbrug rail bridge Deventer VIRM train 2019.jpg; Deventer - Ijssel
  - morning with mist - 8 nov 2020 - DJI mavic mini drone - aerial imagery -
  break of the day - 20.jpeg
