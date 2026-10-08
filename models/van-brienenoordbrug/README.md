# Van Brienenoordbrug (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `van-brienenoordbrug.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het dek, met de attributen van het BGT-wegdeel in `extras.attributes`: `bgt_functie` `rijbaan autosnelweg` of `fietspad`, `bgt_fysiekvoorkomen` `gesloten verharding`; zo werken de kleurregels van een thema op het brugdek) en `building:van-brienenoordbrug` met de twee boogbruggen met trekband (elk twee boogribben met het hangerscherm), de rivierpijlers, de basculekleppen in gesloten stand, de basculekelder met de trapkoker, de bedieningstoren, de zuidelijke en noordelijke aanbrug met alle pijlers en de twee landhoofden |
| `van-brienenoordbrug-1-3500.stl` | De brug in één stuk op 1:3500 met een printvoet onder het dek, met de onderkant (NAP -2,0 m) op het printbed (386,5 × 40,6 × 20,0 mm) |
| `van-brienenoordbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (96917,61, 435328,02) (WGS84
51,90343 N, 4,54322 O), midden onder de bogen op de voeg tussen de twee
bruggen, op NAP 0 (z is de NAP-hoogte; het PDOK-terrein legt de Nieuwe Maas
op 43,67 m ellipsoïdisch) en de glTF-conventie Y omhoog. +X loopt langs de
brug naar het noorden, naar Kralingen (`xAxis` (-0,38774, 0,92177), 112,81
graden linksom vanaf het oosten), +Y naar het westen-zuidwesten
(stroomafwaarts). De westboog (1990) ligt op y = 0 tot 30,9, de oostboog
(1965) met het fietspad op y = 0 tot -33,6. Het zuidelijke landhoofd in
IJsselmonde ligt schuin in de bocht op x = -636 tot -597, de rivierpijlers van
de bogen op x = -156,1 tot -141,8 en 140,7 tot 154,7, de basculekleppen op
152 tot 206, de basculekelder op 206,1 tot 241,1 en het noordelijke
landhoofd in Kralingen op 705,6 tot 716,7. Het maaiveld wordt op acht punten
op het water bemonsterd (`groundSamplePoints`), 15 m buiten de dekranden: in
de geul ten zuiden van het Eiland van Brienenoord (x = -330) en op de Nieuwe
Maas naast de bogen (x = -80, 60 en 200). Over land ligt het PDOK-maaiveld
tot 5 m hoger (NAP +1 tot +5,6 m), daar staan bewust geen punten.
`groundOffsetMetres` is 0; omdat de brug 1353 m lang is, staat de laagste
PDOK-hoogte op die punten (43,67 m ellipsoïdisch) ook als vaste terugval in
`groundHeight`, zodat een uitsnede die alleen een aanbrug raakt het model
niet laat wegvallen. De onderkant ligt op NAP -2,0 m, onder de waterspiegel.
`replacesBuildings` bevat de bedieningstoren (`NL.IMBAG.Pand.0599100000670512`,
1965), die PDOK als ronde kolom tot 92,0 m ellipsoïdisch reconstrueert. Onder
het dek liggen geen andere BAG-panden; de basculekelder is geen BAG-pand.

De brug ligt in de A16. Het zijn twee boogbruggen naast
elkaar met een basculedeel en aanbruggen; volgens Wikipedia is de
westboog in de zomer van 2026 door een nieuwe boog met dezelfde vorm
vervangen. Het model volgt het AHN (opname vóór die wissel) en de foto's,
die voor beide bogen dezelfde vorm laten zien.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek als vlak per station (AHN-DSM, om de 8 m, z = a + b · y):
  +12,3 tot +14,6 m bij het zuidelijke landhoofd (dwarshelling), +28,6 m onder
  de bogen en +10,8 m bij
  het noordelijke landhoofd, met 4 % dwarshelling in de bocht van de
  zuidelijke aanbrug en 0,5 % onder de bogen. De dekrand volgt het
  BGT-overbruggingsdeel (64,3 m breed onder de bogen, 64,3 m over de
  noordelijke aanbrug, in het zuiden met de bocht naar het zuidoosten); de
  middenbermen tussen de vier rijbanen en langs het fietspad volgen de
  BGT-wegdelen (om de 5 m).
- Twee bogen met trekband van 296,6 m tussen de pijlerharten: per brug twee
  verticale ribben van 2,0 m breed en 2,8 m hoog (AHN: westboog 2,6 en 29,6 m
  ten westen van de voeg, oostboog 3,4 en 27,4 m ten oosten; het fietspad
  ligt buiten de oostelijke rib), met de bovenrand als parabool met de top op
  +68,0 m (39,4 m boven het wegdek) die het wegdek op de pijlerharten raakt
  (AHN: top 66,0 tot 68,4 m per rib, parabool binnen 0,8 m). Het boogdek is een
  dekplaat van 0,8 m met trekbanden van 4,5 m onder de ribben, dwarsdragers
  van 3,0 m ertussen en het fietspad als uitkraging.
- Het netwerk van kruisende schuine hangers: twintig velden van 14,83 m
  (foto's), van elke dekknoop een hanger naar de boog een veld links en een
  veld rechts, zodat de hangers van buurknopen elkaar halverwege kruisen (36
  hangers per rib). Tussen dek en rib een scherm met de hangers als stroken
  van 1,0 m en 55 openingen per rib: driehoeken met de punt omhoog boven het
  dek, ruiten tussen de kruisingen en overal waar een bovenkant flauwer helt
  (de boog boven een kruising, de hangers bij de opleggingen) een spitse top
  van 55 graden. De hoogste opening reikt tot +65,1 m.
- Twee rivierpijlers volgens de BGT-sloven met ronde koppen (14,3 en 14,0 m
  dik, 86,8 en 100,2 m lang) tot +3,0 m, met erop een wand met ronde koppen
  tot 0,3 m onder het wegdek en aan beide lange zijden zes blinde nissen van
  0,35 m tussen de kolommen; de westelijke koppen staan naast het dek (zoals
  de ronde pijlerkop op de foto's en in het AHN).
- De basculekleppen van 54 m in gesloten stand (stalen koker van 2,5 m) met
  voegen van 0,4 m over het wegdek bij de punt en het draaipunt (luchtfoto).
- De basculekelder van 35 m (BGT-muren op het dek, foto) over de hele
  brugbreedte tot onder het wegdek, met een plint tot +2,0 m en aan beide
  lange gevels drie raambanden als nissen van 0,35 m (+5,9 tot +23,1 m); aan
  de oostgevel de ronde trapkoker van Ø 3,4 m tot +31,1 m (AHN).
- De bedieningstoren naast de noordpijler op de sloof: schacht van Ø 5,4 m
  (BGT-pand), kanzel van zestien vlakken die naar buiten helt (Ø 10,8 tot
  11,4 m, +41,0 tot +45,6 m) op een kraag van 50 graden, raamband als nis van
  0,3 m, dakrand tot +46,4 m en de dakkoker tot +49,6 m (AHN).
- De zuidelijke aanbrug: dekplaat met twee kokers per brug (3,2 m diep) op
  negen velden van circa 51 m; per pijlerlijn twee sloven met ronde einden
  (BGT, 3,5 tot 5,0 m dik, tot +2,5 m) met vier of zes ronde kolommen van
  Ø 2,6 m (foto).
- De noordelijke aanbrug: dezelfde doorsnede op velden van 50,75 m, met per
  pijlerlijn vijf wandkolommen van 1,7 × 6,0 m en een kolom van 1,1 m onder de
  rand van het fietspad (BGT, x = 340,9 tot 645,4; de lijn op de noordoever op
  x = 290,1 uit de BGT-muur en de steek).
- Schampkanten van 0,9 × 0,6 m langs de randen en geleiderails van dezelfde
  maat in de middenbermen in plaats van de leuningen.
- Twee landhoofden volgens de BGT tot onder het wegdek.

Wat er niet in zit: het windverband tussen de ribben van elke boog en de
portalen bij de opleggingen (vrije horizontale overspanningen van 24 tot
27 m, die op 1:1000 niet zonder steun printen; de export zou eronder een
wand tot het dek opvullen), de echte hangers van circa 0,1 m (vervangen door
het scherm), de portaalborden en seinportalen boven de rijbanen (horizontaal
vrij overspannend), leuningen, lantaarns, slagbomen en verkeersborden
(dunner dan 0,9 m), de loopbruggen en trappen op de ribben en aan de toren
(dunner dan 0,9 m), het doorschijnende geluidsscherm langs het fietspad van
de zuidelijke aanbrug (in het AHN alleen ruis), het remmingwerk en de
dukdalven (niet in BGT of AHN te plaatsen; laag bij het water) en de open
stand van de kleppen.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug
alleen een vlakke wegstrook (over de rivier op dekhoogte, over land op het
maaiveld), zonder bogen, pijlers of kelder, en de toren een kale ronde kolom.
Het model heeft van alle vier kanten de twee bogen: van oost en west de
schermen met de kruisende hangers en de ruitvormige en spitse openingen, van
noord en zuid de vier ribben naast elkaar; verder de rivierpijlers met de
ronde koppen en nissen, de toren met de kanzel en de kelder met de trapkoker
en raambanden (vooral van oost en noordoost herkenbaar, zoals op de foto's
vanaf de Esch en het water), de rijen kolommen en wandkolommen onder beide
aanbruggen, het aanbrugdek op hoogte met de bocht naar IJsselmonde, en de
schampkanten en geleiderails tussen de vier rijbanen.

Pasvorm op het AHN: over de vier rijbanen (1,5 m binnen de BGT-randen) van
x = -600 tot 700 ligt 94,0 % van de DSM-cellen binnen 1 m van het wegdek van
het model (94,7 % binnen 2 m, mediaan +0,02 m; de rest zijn auto's,
lantaarns, portalen en hangers). Op de smalle boogribben ziet het AHN per cel
vaak het dek; de hoogste DSM-cel per 8 m op elke rib ligt in 85 van de 140
vakken binnen 1 m van de bovenrand van het model en in 123 binnen 2 m
(mediaan -0,30 m).

Printbaarheid op 1:1000: de echte hangers en het windverband zijn te dun of
liggen horizontaal. De ribben staan via het scherm op het dek; elke opening
heeft een bovenkant van minstens 50 graden of een spitse top van 55 graden,
openingen kleiner dan 2 m² blijven dicht. De kraag onder de kanzel helt 50
graden. Alleen de onderkant van het dek (met de uitkraging van het fietspad)
hangt vrij (70 714 m²), plus de bovenkant van de nissen (80,2 m²); het script
controleert dat er boven het wegdek niets vrij hangt, dat alles op dezelfde
onderkant begint, dat de printversie buiten de nissen geen overhang heeft
(0 m²) en dat de volumes van de drie onderdelen optellen tot het volume van
de brug als geheel (392 051 m³). Printcheck op 1:1000 in een uitsnede van
394 m rond de bogen, de kleppen en de kelder: status NoError voor alle drie onderdelen; constructie 334,7 naar 537,9 cm³ (+60,7 %, vooral de wig met het scherm onder het 64 m brede dek), rijbaan en fietspad +0 %, 63,6 s; de openingen in de schermen blijven open en onder het dek komt een wig met een smal scherm. De hele brug past
niet in 400 mm: in een uitsnede van 1276 m (1:3190) gaat het model als
gesloten solid door (status NoError voor alle drie onderdelen; constructie
30,5 naar 38,1 cm³, +25,0 %, rijbaan en fietspad +0 %, 84,7 s). De STL op
1:3500 heeft een printvoet: een wig van 50 graden vanaf de onderkant van de
dekranden (onder de bogen aan de westrand vanaf de trekband) tot de
onderplaat; op die schaal zijn de hangerstroken 0,29 mm en de kolommen
0,5 tot 0,7 mm breed, dus te dun om los te printen: print de bogen met de
export op 1:1000.

Z-fighting: `zfight.py` met 30 000 verticale stralen over het hele dek vindt
geen samenvallende vlakken; de wegdeklaag (van 0,5 m onder tot 1 m boven het
wegdek) houdt 2 cm vrij rond schampkanten, geleiderails, ribben en voegen, en
boven de ribben bij de opleggingen (waar de bovenkant van de rib op de hoogte
van het wegdek ligt) de hele hoogte.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Van_Brienenoordbrug)
voor bouwjaren, lengte (1320 m) en overspanning van de westboog (287,5 m);
PDOK BGT overbruggingsdeel (dekrand, landhoofden, sloven, wandkolommen,
rivierpijlers), wegdeel (rijbanen en fietspad), scheiding (muren op de
kelder) en pand; BAG-pand 0599100000670512; AHN DSM/DTM 0,5 m via de PDOK-WCS
voor het wegdek, de boogribben, de toren, de trapkoker en de pijlerkoppen;
PDOK-luchtfoto (8 cm) voor de voegen van de kleppen en de rijbanen; Wikimedia
Commons-foto's: *Rotterdam - Oud-IJsselmonde - Eiland van Brienenoord - View
of Van Brienenoordbrug from southeast/southwest*, *Rotterdam Van
Brienenoordbrug seen from Capelle ad IJssel Rivium ferry terminal*, *Van
Brienenoordbrug - Rotterdam - Basement for bascule from the east*, *Bridge
operator's house from the east*, *Open bascule bridge - View from the bridge
towards the west*, *Van Brienenoordbrug Rotterdam 2018 1 en 2*, *Van
Brienenoordbrug (2025)-1 en -2*, *Van Brienenoordbrug dubbele boog*, *Van
Brienenoordbrug Rotterdam 2020*, *Van brienenoordbrug - Kralingen - Rotterdam
- Bonn-Mees' Sheerlegs Matador passing opened bascule bridge*, *Van
Brienenoordbrug.jpg* en *1e Eiland van Brienoordbrug - View of the bridge
from the northeast*.

Geschat: de constructiehoogtes (aanbruggen 3,2 m met twee kokers per brug,
boogdek 3,0 m met trekbanden van 4,5 m, kleppen 2,5 m, dekplaat 0,8 m), de
ribhoogte (2,8 m), het aantal hangervelden (twintig, op foto's geteld), de
kolommen op de sloven (Ø 2,6 m om de circa 6 m, sloven tot +2,5 m), de
pijlerlijn op de noordoever (x = 290,1), de hoogte van de pijlerkoppen (0,3 m
onder het wegdek), de maten van de kanzel en de raambanden van de kelder.

Licentie van het model: eigen werk op basis van open bronnen.
