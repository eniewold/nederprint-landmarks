# Dr. W. Hupkesbrug (Zaltbommel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hupkesbrug.glb` | Catalogusbron in meters met twee nodes: `road:spoor`, de bovenste 0,5 m van het dek in de twee spoorbedden tussen de liggers, met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` half verhard; en `building:hupkesbrug` met de rest van het dek, de vier vakwerkliggers van de twee enkelsporige bruggen (drie gebogen rivieroverspanningen en acht velden over de uiterwaard), de drie stenen rivierpijlers, de zeven pijlers in de uiterwaard en de twee landhoofden |
| `hupkesbrug-1-2500.stl` | De brug in één stuk (constructie en spoor samen) op 1:2500 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (350 × 16 × 12 mm) |
| `hupkesbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (146323,06, 425598,58) (WGS84
51,81894 N, 5,26136 O), op de as tussen de twee sporen midden in de
middelste rivieroverspanning, op de waterspiegel van de Waal (NAP +2,9 m) en
de glTF-conventie Y omhoog. +X loopt langs de brug naar het noorden, naar
Waardenburg (`xAxis` (-0,11022, 0,99391), 96,33 graden linksom vanaf het
oosten, langs de BGT-sporen), +Y stroomafwaarts naar het westen. Het
zuidelijke landhoofd in Zaltbommel ligt op x = -194,7 tot -187, de
rivierpijlers op x = -68,1 tot -57,8, 58,6 tot 67,3 en 185,8 tot 194,4, de
pijlers in de uiterwaard om de circa 61 m van x = 252,7 tot 619,6 en het
noordelijke landhoofd op x = 676,6 tot 680,2. Het hart van het model (de
controle-URL, 51,82112 N, 5,26096 O) ligt op x = 244,6. Het maaiveld wordt op
acht punten op het water naast de eerste twee rivieroverspanningen bemonsterd
(`groundSamplePoints`, 25 m naast de as op x = -170, -120, 0 en 50);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de Waal op 46,51 m
ellipsoïdisch, de waterspiegel van het model. Omdat de brug 875 m lang is,
staat die hoogte ook als vaste terugval in `groundHeight` (46,51), zodat een
uitsnede die alleen de uiterwaard of een landhoofd raakt het model niet laat
wegvallen. Geen BAG-pand onder de brug (de PDOK-dump van de uitsnede bevat
geen panden).

Er liggen twee gelijke enkelsporige bruggen naast elkaar, elk met twee
vakwerkliggers en windverbanden tussen de bovenranden (luchtfoto; AHN: vier
lijnen op 6,6 en 1,0 m oostelijk en 0,8 en 6,5 m westelijk van de as). Het
model bevat beide samen in de constructienode; alleen de spoorbedden zijn een
eigen node. De Martinus Nijhoffbrug (A2) ligt 74 m
stroomafwaarts en hoort er niet bij; het model reikt tot 20,4 m naast de as
en raakt hem niet. De restanten van de pijlers van de oude Bommelse brug in de
rivier horen ook niet bij het model.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 870,7 m van landhoofd tot landhoofd, 15,7 m breed (van de
  buitenkant van de oostelijke buitenligger tot de dienstweg buiten de
  westelijke), met de spoorstaaf volgens het AHN: +17,9 m op het zuidelijke
  landhoofd, +18,45 m over de eerste twee rivieroverspanningen, 0,37 % dalend
  over de derde en 0,78 % over de uiterwaard naar +14,3 m op het noordelijke
  landhoofd. De onderkant van de dwarsdragers ligt 1,6 m onder de
  spoorstaaf.
- Vier vakwerkliggers van 1,0 m dik, met tussen de twee bruggen een spleet
  van 0,8 m. Elke ligger is een dichte plaat met een onderrand tot 0,5 m
  boven de spoorstaaf, een bovenregel van 1,0 tot 1,2 m, diagonalen van
  1,0 m, verticalen van 0,9 m en eindstijlen van 1,2 m.
- Drie rivieroverspanningen van 126,3, 123,0 en 124,4 m (Wikipedia: drie
  overspanningen van 125 m) met elk 20 vakken van circa 6,2 m. De bovenrand
  is gebogen: +31,0 m in het midden (AHN 30,9 tot 31,1 m), 7,7 m boven de
  spoorstaaf op 2 m van de oplegging en daartussen een parabool; de korte,
  steile eindstijl loopt van 3 m boven de spoorstaaf op de oplegging naar
  dat knooppunt.
- Acht velden van 59,2 tot 61,2 m over de noordelijke uiterwaard (Wikipedia:
  acht overspanningen van 61 m) met evenwijdige randen 6,6 m boven de
  spoorstaaf (+24,5 m bij de derde rivierpijler, +20,9 m bij het noordelijke
  landhoofd), tien vakken van circa 5,9 m en verticale eindstijlen.
- In de liggers 1120 doorgaande driehoekige openingen met de punt omhoog
  (twee per vak, aan weerszijden van de verticaal, flanken van 59 graden of
  steiler) en 516 blinde nissen van 0,35 m voor de driehoeken met een vlakke
  bovenkant (aan de buitenkant van de buitenste en aan de spoorkant van de
  binnenste liggers).
- Drie stenen rivierpijlers van 8,7 tot 10,3 m dik en 32 tot 39 m lang met een
  spitse kop stroomopwaarts en een ronde stroomafwaarts (BGT), tot onder het
  dek.
- Zeven pijlers in de uiterwaard van circa 6 × 23 m met dezelfde koppen
  (BGT), tot onder het dek.
- Het zuidelijke landhoofd als pijlervormig blok met ronde koppen tot 20 m
  naast de as (BGT) en een middendeel tot de spoorstaaf, en het noordelijke
  landhoofd (BGT) tot de spoorstaaf.
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van het dek in de
  twee spoorbedden tussen de buitenste en de binnenste ligger van elke brug
  (y = -6,08 tot -1,52 en 1,32 tot 5,98, 4,6 m breed, 2 cm vrij van de
  vakwerkplaten), over de hele lengte van het dek (x = -191,1 tot 680,2, met
  0,5 m over het zuidelijke landhoofd), met in de GLB `extras.attributes`
  `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" }`, zodat
  de kleurregels van een thema (bijvoorbeeld spoor zwart) op de brug werken
  zoals op de BGT-wegdelen ernaast. Bron: de twee actuele BGT-wegdelen op het
  dek (relatieve hoogteligging 1, van x = -190,6 tot 680,1),
  L0004.e98e9ba5544848b8a5e7cfdeebf671da (oostelijke brug, y = -5,2 tot
  -2,4) en L0004.e607835fefa341edaa47d39c3203746f (westelijke brug, y = 2,2
  tot 5,1), beide spoorbaan, half verhard, zonder plus-fysiek voorkomen; hun
  contouren (vereenvoudigd tot 5 cm) staan in het script, dat controleert dat
  ze helemaal binnen de spoorbedden liggen. Het hele bed is spoor, niet alleen
  het BGT-vlak van 2,7 tot 2,9 m, zodat de constructie tussen de liggers geen
  eigen vlak op het dek houdt. De spleet tussen de bruggen, de rand buiten de
  oostelijke ligger, de dienstweg buiten de westelijke (geen BGT-wegdeel) en
  de liggers zelf blijven constructie. De strook loopt over dezelfde
  loftstations als het dek, van 0,5 m onder tot 1 m boven de spoorstaaf;
  spoor = strook ∩ brug, constructie = brug − strook (samen 68.773 m³:
  constructie 64.757, spoor 4.017). Het script controleert dat de volumes
  optellen; er liggen geen samenvallende bovenvlakken van de twee nodes op
  het dek.

Wat er niet in zit: de echte staven (circa 0,5 m, vervangen door de plaat met
openingen en nissen), de windverbanden en portalen tussen de liggers boven
het spoor (vrije horizontale overspanningen van 4 tot 5 m die op 1:1000 niet
zonder steun printen), de bovenleiding met portalen, leuningen en de
leuning van de dienstweg (kleiner dan 0,9 m), de opleggingen op de pijlers
(op 1:1000 opgaand in het dek) en de Martinus Nijhoffbrug.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke strook met de omtrekken van de pijlers op het water en in het gras,
zonder liggers of hoogte. Het model heeft van oost en west de vier
vakwerkliggers met openingen en nissen, de drie karakteristieke bogen over de
rivier en de lange rij evenwijdige velden over de uiterwaard, van noord en
zuid de twee bruggen naast elkaar met de spleet ertussen en de steile
eindstijlen van de rivieroverspanningen, en van alle kanten de stenen pijlers
met spitse en ronde koppen die breder zijn dan het dek.

Pasvorm op het AHN: de omhullende per 8 m (hoogste DSM-cel op de vier
vakwerklijnen) ligt in 107 van de 109 vakken binnen 1 m en in alle 109 binnen
2 m van de bovenrand van het model (mediaan +0,05 m); de twee uitschieters
liggen bij het zuidelijke landhoofd en naast de tweede rivierpijler, waar de
eindstijlen in het AHN steiler of juist lager uitkomen dan in het model.

Printbaarheid op 1:1000: open vakwerk is op 1:1000 niet te printen, daarom
zijn de liggers dichte platen van 1,0 m met openingen waarvan de flanken
minstens 59 graden steil zijn en nissen van 0,35 m voor de driehoeken met een
vlakke bovenkant. Alleen de onderkant van het dek met de pijlerkoppen ernaast
(12 542 m²) en de plafonds van de nissen (883 m²) hangen vrij; het script
controleert dat alleen die naar beneden wijzen, dat de openingen steil genoeg
zijn, dat alles op dezelfde onderkant begint en dat de printversie buiten de
nissen geen overhang heeft. Met 875 m past de brug op 1:1000 niet in één
uitsnede: in een uitsnede van 902 m (1:2255, 400 mm) gaan beide onderdelen
in de printcheck als gesloten solid met overhangopvulling door (status
NoError, 86 s): de constructie van 13,3 naar 11,1 cm³ ten opzichte van de
rechte opvulling (-16,5 %), het spoor 0,35 cm³ zonder eigen opvulling
(`extraPct` 0), samen 13,6 naar 11,4 cm³ zoals voor de opsplitsing.
Op 1:1000 zelf ging een uitsnede van 200 m over de middelste
rivieroverspanning (200 mm, gemeten voor de opsplitsing) ook als gesloten
solid door (status NoError, 110 s, 60,2 naar 28,0 cm³, -54 %): onder het dek komt een wig met een smal
scherm tot de onderplaat, de openingen in de liggers blijven open en de
gebogen bovenranden printen zonder steun. De STL op 1:2500 heeft dezelfde printvoet (wig van 50 graden
en een scherm van 0,8 mm op printschaal).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Dr._W._Hupkesbrug) (1869,
863 m, 10 pijlers, 15 m breed, drie overspanningen van 125 m over het zomerbed
en acht van 61 m aan de kant van Waardenburg), PDOK BGT (overbruggingsdeel:
dekken, pijlers, landhoofden; spoor: as en richting; wegdeel: de twee
spoorbaanvlakken op het dek voor de attributen van het spoor), PDOK AHN (dsm en dtm
0,5 m via WCS: spoorstaaf, vakwerklijnen en hun bovenrand), de PDOK-luchtfoto
(twee bruggen, windverbanden, vakverdeling), het PDOK-terrein (waterspiegel)
en de Wikimedia Commons-foto's Zaltbommel Waalbruggen 001.jpg, Bommelse brug
en Dr. W. Hupkesbrug.jpg, The cable stayed 256 m span Waalbridge at Zaltbommel
from 1992-1996. Behind it the old steel railway bridges - panoramio.jpg,
Spoorbrug bij Zaltbommel 001.jpg en Spoorbrug bij Zaltbommel 002.jpg voor de
vorm van de liggers, het vakwerkpatroon en de stenen pijlers. De opdracht
noemde een boogbrug uit 2012; de bronnen tonen de brug uit 1869 (later
vernieuwd) met drie gebogen vakwerkliggers over de rivier en acht evenwijdige
velden, en het model volgt de metingen. Geschat zijn de waterspiegel (NAP
+2,9 m: PDOK-water 46,51 m ellipsoïdisch min 43,6 m, het verschil tussen
PDOK-terrein en AHN in de uiterwaard), de diepte onder de spoorstaaf (1,6 m),
de staafbreedtes (0,9 tot 1,2 m), de dikte van de liggers (1,0 m), het aantal
vakken (20 per rivieroverspanning, 10 per veld, uit de afstand van de
windverbanden op de luchtfoto), het W-patroon met verticalen, de vorm van de
bovenrand tussen de AHN-punten (parabool) en de steile eindstijl, de
breedte van de dienstweg aan de westkant (1,6 m) en de hoogte van de pijlers
(tot onder het dek, zonder aparte opleggingen).

Licentie van het model: eigen werk op basis van open bronnen.
