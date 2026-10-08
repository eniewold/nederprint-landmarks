# Baanhoekbrug (Sliedrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `baanhoekbrug.glb` | Catalogusbron in meters met drie nodes: `road:spoor`, de bovenste 0,5 m van het dek binnen de BGT-spoorbaanvlakken, met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` gesloten verharding; `road:fietspad`, de bovenste 0,5 m van het fietsdek binnen het BGT-fietspadvlak, met `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding en `plus_fysiekvoorkomen` asfalt; en `building:baanhoekbrug` met de rest: de twee vakwerkliggers, de drie stenen pijlers, de basculebrug met kelder, machinehuis, bedieningshuis en dukdalven, de twee aanbruggen met hun pijlers en de landhoofden |
| `baanhoekbrug-1-1250.stl` | De brug in één stuk (constructie, spoor en fietspad samen) op 1:1250 met een printvoet onder de dekken, met de onderkant (0,8 m onder het water) op het printbed (379 × 42 × 21 mm; `--scale 1000` geeft 473 mm) |
| `baanhoekbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De Baanhoekbrug ligt op de MerwedeLingelijn (Dordrecht - Geldermalsen),
tussen de stations Dordrecht Stadspolders en Sliedrecht Baanhoek. Ze wordt
soms een brug van de Betuweroute genoemd; volgens Wikipedia loopt de
Betuweroute er niet overheen (die blijft ten noorden van de Merwede).

De GLB is in meters met de oorsprong op RD (110500,73, 426163,54) (WGS84
51,82231 N, 4,74176 O), op de as van het spoor (BGT-spoorhartlijn) in het hart
van de middelste stenen pijler, op het water van de Beneden-Merwede (NAP
+0,07 m) en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
noorden, naar Sliedrecht (`xAxis` (-0,02644, 0,99965), 91,52 graden linksom
vanaf het oosten), +Y naar het westen (stroomafwaarts); het fietspad ligt aan
de oostkant (y < 0). Het zuidelijke landhoofd ligt op x = -290,95, de
basculekelder op x = -170 tot -151,5, de klep op x = -152,4 tot -119, de
stenen pijlers op x = -113,3 tot -108 (met de kop van de klepkelder vanaf
-120,5), -3,6 tot 3,7 en 108,1 tot 113 (met een aanbouw tot 115,5), de
gemetselde pijler van de noordelijke aanbrug op x = 137,7 tot 145,4 en het
noordelijke landhoofd op x = 182,3. De controle-URL valt op de zuidelijke
vakwerkligger, 49 m ten zuiden van de oorsprong en 5 m van het midden van het
model. Het maaiveld wordt op zes punten op het water naast de vakwerkliggers
bemonsterd (`groundSamplePoints`, 25 m naast de as op x = -60, 0 en 60);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de rivier op 43,67 m
ellipsoïdisch, het water van het model. Omdat de brug 473 m lang is, staat die
hoogte ook als vaste terugval in `groundHeight` (43,67), zodat een uitsnede die
alleen een uiteinde raakt het model niet laat wegvallen. De zuidelijke aanbrug
staat in de uiterwaard (PDOK-terrein circa NAP +2,2 m) en de noordelijke
overspant de Rivierdijk (NAP +1 tot +4 m); de pijlers daar beginnen ook op de
gemeenschappelijke onderkant en steken in het terrein. `replacesBuildings`
bevat het bedieningshuis (`NL.IMBAG.Pand.0505100000001555`), dat PDOK als blok
van het water tot NAP +22,4 m reconstrueert; de andere panden in de buurt
(huizen aan de Rivierdijk, een laag gebouwtje onder de noordelijke aanbrug)
liggen niet onder het model en zijn niet te hoog.

Onderdelen in het model (hoogtes in NAP):

- Het spoordek van y = -3,0 (schampkant) tot 3,8 (westrand) met de
  spoorstaaf volgens het AHN: +13,07 m bij het zuidelijke landhoofd, +13,72 m
  bij de basculekelder, +14,07 m bij het vakwerk, +14,3 m boven de middelste
  pijler, +14,03 m aan het noordelijke einde van het vakwerk en +13,58 m bij
  het noordelijke landhoofd (lineair tussen deze punten).
- Het fietsdek aan de oostkant als uitkraging van 0,8 m dik aan de rand met
  een schuin ondervlak van 50 graden naar de koker of het vakwerkdek, met het
  fietspad volgens het AHN (+12,85 m zuid, +14,62 m bij het vakwerk, +14,4 m
  over de rivier, +12,87 m noord) en de oostrand op y = -7,9 (zuidelijke
  aanbrug), -8,6 (basculedeel), -9,0 (vakwerk) en -8,3 (noordelijke aanbrug).
- Een schampkant van 1,2 m breed tussen spoor en fietspad (y = -4,2 tot -3,0,
  0,9 m boven het hoogste van de twee), over het vakwerk vast aan de oostelijke
  ligger; een borstwering van 0,9 m aan de westrand van de aanbruggen en het
  basculedeel; een dichte borstwering langs het fietspad op het basculedeel en
  de klep (y = -8,6 tot -7,7, 0,9 m boven het fietspad) met een onderbreking
  voor de loopbrug.
- Twee gelijke vakwerkliggers van 110,7 m (x = -111,35 tot -0,65 en 0,65 tot
  111,35; Wikipedia: overspanning 110 m) met twee lijnen van 1,0 m dik (AHN:
  hartlijnen 2,5 m oost en 2,75 m west van de as). Elke ligger heeft 7 vakken
  van 15,8 m, evenwijdige randen met de bovenkant 10,8 m boven de spoorstaaf
  (NAP +24,96 tot +25,08 m), schuine eindstijlen van de oplegging naar de
  eerste bovenknoop (7,9 m) en diagonalen als W met stijlen bij de
  bovenknopen (foto's). Elke plaat heeft 14 doorgaande openingen (de vakken
  met de punt omhoog, door de stijl in twee rechthoekige driehoeken gedeeld,
  plafond 52 graden) en 6 blinde nissen van 0,35 m aan de buitenkant voor de
  driehoeken met een vlakke bovenkant; samen 56 openingen en 24 nissen.
- Onder het vakwerk dwarsdragers tot 1,5 m onder de spoorstaaf, op
  opleggingen van 1,6 × 1,6 m onder elke vakwerklijn op de stenen pijlers.
- Drie stenen pijlers op de BGT-omtrek (ronde koppen, 24,4 tot 24,6 m lang,
  gebouwd voor dubbelspoor en dus ver naar het westen uitstekend), met een voet
  tot NAP +2,5 m, daarboven 0,3 m teruggezet, een kraag van 0,3 m op een
  schuine rand van 53 graden en de bovenkant op +12,3 m (AHN). De zuidelijke
  heeft aan de zuidkant de betonnen kop van de klepkelder (+10,45 m, onder het
  dek tot de klep), de noordelijke aan de noordkant een aanbouw tot +7,8 m met
  een kopblok onder de aanbrug. Op de noordelijke pijlerkop staat een witte
  installatiekast (cilinder van Ø 2,4 m tot +14,4 m).
- De basculebrug: de klep van 33,4 m in gesloten stand (x = -152,4 tot -119,
  waar het BGT-spoorvlak wisselt; draaipunt bij de stenen pijler) met
  dwarsdragers tot 1,8 m onder de spoorstaaf; op het vaste deel (x = -170 tot
  -152,4) twee plaatliggers van 1,0 m langs de vakwerklijnen, 2,0 m boven de
  spoorstaaf (AHN +15,9 m) van x = -166 tot -157 en daarna aflopend naar
  0,9 m boven de spoorstaaf, als lage hoofdliggers over de klep tot het
  draaipunt.
- De basculekelder onder het vaste deel (x = -170 tot -151,5, y = -8,6 tot
  12,5), aan de westkant als machinehuis met het dak op +13,55 m (AHN).
- Het bedieningshuis (BAG-pand) van 5,8 × 5,0 m op een ronde kolom van Ø 2,6 m
  in het water ten oosten van het basculedeel, met een kraag naar de kolom (50
  graden of steiler), ramen die 0,4 m naar buiten lopen tot de dakrand op
  +21,8 m en het dak op +22,4 m (AHN); een loopbrug van 1,2 m op
  fietspadhoogte van het fietspad naar de kolom (BGT: het fietspadvlak steekt
  daar uit tot y = -10,2).
- Negen dukdalven van Ø 1,6 m tot +4,8 m langs de doorvaart, aan beide kanten
  van de klep (luchtfoto, AHN).
- De zuidelijke aanbrug (x = -290,95 tot -170) en de noordelijke (x = 113 tot
  182,3) als kokerligger tot 3,5 m onder de spoorstaaf met het uitkragende
  fietsdek, op de pijlers met ronde koppen van de BGT (zuidelijk landhoofd
  +6,85 m, pijlers op x = -231,7 en -172,35 tot +7,2 en +7,5 m naast het dek,
  AHN) met kopblokken onder de koker; de gemetselde pijler van de noordelijke
  aanbrug tot onder de koker; het noordelijke landhoofd met de bovenkant op
  +7,45 m naast het dek.
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van het dek binnen
  de drie actuele BGT-wegdelen spoorbaan op de brug (relatieve hoogteligging
  1, gesloten verharding, zonder plus-fysiek voorkomen):
  L0004.c31ed14fa98445d0af253f32541f070f (zuidelijke aanbrug en vast
  basculedeel, 3,7 m breed, op het basculedeel 2 m),
  L0004.705289e5ecb740b69be8c573b9472a71 (de klep, 2 m) en
  L0004.fa0975d28ec54d05836039261895d524 (vakwerk 2 m, noordelijke aanbrug
  4,1 m), vereenvoudigd tot 5 cm, met in de GLB `extras.attributes`
  `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" }`.
- Het fietspad als eigen node `road:fietspad`: de bovenste 0,5 m van het
  fietsdek binnen het BGT-wegdeel G0505.98caa47166e237fbe0533162500ab4d5
  (fietspad, gesloten verharding, asfalt, relatieve hoogteligging 1) met de
  uitstulping naar het bedieningshuis, met `{ bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" }`.
  De stroken lopen over dezelfde loftstations als de dekken, van 0,5 m onder
  tot 1 m boven het wegdek; wegdeel = strook ∩ BGT-vlak ∩ brug, met 2 cm vrij
  van schampkant, borstweringen, vakwerkplaten, plaatliggers en de kolom van
  het bedieningshuis; constructie = brug − stroken (samen 32.699 m³:
  constructie 31.193, fietspad 875, spoor 631). Het script controleert dat de
  volumes optellen; `zfight.py` vindt op 30.000 punten geen samenvallende
  bovenvlakken tussen de nodes (alleen één punt in de scherpe punt van een
  vakwerkopening, waar boven- en ondervlak samenkomen).

Wat er niet in zit: de echte staven (circa 0,5 m, vervangen door de plaat met
openingen en nissen), de windverbanden en portalen tussen de liggers boven het
spoor (vrije horizontale overspanningen van 5 m die op 1:1000 niet zonder steun
printen), de leuning en loopbrug op de bovenrand, de radar op het noordelijke
portaal, de bovenleiding met haar portalen, de seinen en slagbomen, de
leuningen langs het fietspad op de aanbruggen en het vakwerk, de stalen
loopbruggen tussen de dukdalven (allemaal dunner dan 0,9 m), de klep in open
stand (het model toont de gesloten brug) en een laag bijgebouwtje naast de
kelder (x = -152 tot -150,5, NAP +10,2 m, kleiner dan de kelder ernaast).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke strook met de pijlerkoppen en een hoog blok voor het bedieningshuis,
zonder liggers. Het model heeft van het westen de westelijke vakwerkligger met
openingen en nissen, de ronde westkoppen van de stenen pijlers met voet en
kraag, het machinehuis op de basculekelder, de lagere pijlerkoppen van de
aanbruggen met de kokers erboven, de borstwering en de dukdalven; van het
oosten de oostelijke ligger achter het uitkragende fietsdek met zijn schuine
ondervlak, de schampkant en borstwering, het bedieningshuis op zijn kolom met
de loopbrug en de dukdalven; van het noorden en zuiden de twee liggers met de
schuine eindstijlen en de stijlen, de dwarsdoorsnede van spoordek en fietsdek,
de plaatliggers op het basculedeel en de landhoofden.

Pasvorm op het AHN: de bovenrand van het vakwerk ligt in 41 van de 44 blokken
van 8 m (95e percentiel van het DSM op elk van de twee vakwerklijnen) binnen
1 m en in alle 44 binnen 2 m van het model (mediaan -0,17 m; het DSM ziet ook
de leuning op de bovenrand). De spoorstaaf volgt de mediaan van het DSM over
het spoor per meter met een mediaan verschil van 0,01 m.

Printbaarheid op 1:1000: open vakwerk is op 1:1000 niet te printen, daarom
zijn de liggers dichte platen van 1,0 m met openingen waarvan het plafond
minstens 52 graden steil is en nissen van 0,35 m voor de driehoeken met een
vlakke bovenkant. Alleen de onderkant van de dekken (4633 m²), de plafonds
van de nissen (117 m²) en de onderkant van de loopbrug (2,7 m²) hangen vrij;
het script controleert dat verder niets naar beneden wijst, dat de openingen
steil genoeg zijn, dat alles op dezelfde onderkant begint en dat de
printversie buiten nissen en loopbrug geen overhang heeft. Met 473 m past de
brug op 1:1000 niet in één uitsnede; in een uitsnede van 504 m (1:1259,
400 mm) gaan alle drie onderdelen in de printcheck als gesloten solid met
overhangopvulling door (status NoError, 5,8 s): de constructie van 39,1 naar
24,3 cm³ ten opzichte van de rechte opvulling (-38 %), fietspad 0,44 cm³ en
spoor 0,32 cm³ zonder eigen opvulling (`extraPct` 0). Een uitsnede van 395 m op
1:1000 rond de liggers en de basculebrug geeft ook NoError (9,7 s, constructie
73,0 naar 40,2 cm³, wegdelen `extraPct` 0). Onder de dekken komt een wig met een
smal scherm tot de onderplaat, de openingen in de liggers blijven open. De STL
op 1:1250 heeft dezelfde printvoet (wig van 50 graden en een scherm van
0,9 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Baanhoekbrug) (1880-1885,
herbouwd 1947, 1978-1983 verbouwd met basculebrug en fietspad aan de
oostzijde, 466,5 m lang, overspanning 110 m, beweegbaar deel 30 m en vaste
delen 75 m wijd, doorvaarthoogte 11,53 m, enkelsporig op pijlers voor
dubbelspoor), PDOK BGT (overbruggingsdeel: dekken, pijlers, landhoofd;
wegdeel: spoorbaan en fietspad op het dek voor de contouren en attributen;
spoor: hartlijn voor de as), PDOK AHN (dsm en dtm 0,5 m via WCS: spoorstaaf,
fietspad, vakwerklijnen, einden en bovenrand van de liggers, pijlerkoppen,
plaatliggers, kelder, bedieningshuis, dukdalven), PDOK BAG (bedieningshuis),
het PDOK-terrein (water), de PDOK-luchtfoto (vakwerk, klep, kelder,
dukdalven) en de Wikimedia Commons-foto's Sliedrecht Baanhoekbrug 002.jpg tot
006.jpg, Open baanhoekbrug (01).JPG en (02).JPG, Spoorbrug Sliedrecht -
panoramio.jpg, Trein over de Baanhoekbrug in 2020.jpg, Spoorbrug bij
Biesbosch.jpg, Beneden-Merwede Sliedrecht 004.jpg en ENI 02320501 STOLT MOSEL
(02).JPG voor de vorm en het aantal vakken van de liggers, de pijlers met voet
en kraag, de kokers van de aanbruggen, de klep, het bedieningshuis en de
installatiekast. Geschat zijn het water (NAP +0,07 m: PDOK-water 43,67 m
ellipsoïdisch min 43,6 m, het verschil tussen PDOK-terrein en AHN op het
land), de diepte van de kokers van de aanbruggen (3,5 m onder de spoorstaaf,
uit de foto's; de pijlers naast het dek liggen lager), de dwarsdragers onder
vakwerk, klep en basculedeel (1,5, 1,8 en 2,0 m), de staafbreedte (0,9 m) en
de dikte van de liggers (1,0 m), het W-patroon met stijlen als dichte plaat,
de grens tussen klep en vast deel (uit de BGT), de maten van de basculekelder,
de kolom (Ø 2,6 m), de kraag en de schuine ramen van het bedieningshuis, de
breedte van de loopbrug, de voet (tot NAP +2,5 m, 0,3 m) en kraag (0,3 m) van
de stenen pijlers, de schampkant en borstweringen, het profiel van de
uitkraging van het fietsdek en de diameter van de dukdalven en de
installatiekast.

Licentie van het model: eigen werk op basis van open bronnen.
