# Merwedebrug (Papendrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `merwedebrug-papendrecht.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van de dekken, met de attributen van het BGT-wegdeel in `extras.attributes`: `bgt_functie` `rijbaan regionale weg` of `fietspad`, `bgt_fysiekvoorkomen` `gesloten verharding`, het fietspad ook `plus_fysiekvoorkomen` `asfalt`; zo werken de kleurregels van een thema op het brugdek) en `building:merwedebrug-papendrecht` met de boogbrug met trekband (twee boogribben met het hangerscherm), de rivierpijlers, de basculeklep in gesloten stand, de basculekelder met het bedieningsgebouw, de zuidelijke aanbrug met het fietsdek, de noordelijke aanbrug, alle pijlers en de twee landhoofden |
| `merwedebrug-papendrecht-1-3000.stl` | De brug in één stuk op 1:3000 met een printvoet onder de dekken, met de onderkant (NAP -2,0 m) op het printbed (350 × 19 × 15 mm) |
| `merwedebrug-papendrecht.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (108025,67, 426267,50) (WGS84
51,82304 N, 4,70585 O), op de as van het dek midden onder de boog, op NAP 0
(z is de NAP-hoogte; het PDOK-terrein legt de Beneden-Merwede op 43,66 m
ellipsoïdisch, 43,65 m boven het AHN) en de glTF-conventie Y omhoog. +X loopt
langs de brug naar het noorden, naar Papendrecht (`xAxis` (-0,07665, 0,99706),
94,40 graden linksom vanaf het oosten), +Y naar het westen (stroomafwaarts).
Het zuidelijke landhoofd in Dordrecht ligt op x = -568 tot -552,6, de
rivierpijlers van de boog op x = -105,9 tot -99,4 en 99,4 tot 105,9, de
basculeklep op 102,9 tot 137,2, de basculekelder op 137,2 tot 160,5 en het
noordelijke landhoofd in Papendrecht op 455,4 tot 482,9. Het maaiveld wordt
op tien punten op het water bemonsterd (`groundSamplePoints`): twee in de
Wantijhaven 22 m ten westen van de as (x = -490 en -440) en acht op de rivier
25 m naast de as (x = -60, 0, 60 en 180). `groundOffsetMetres` is 0; omdat de
brug 1051 m lang is, staat de laagste PDOK-hoogte op die punten (43,64 m
ellipsoïdisch) ook als vaste terugval in `groundHeight`, zodat een uitsnede
die alleen een aanbrug raakt het model niet laat wegvallen. De onderkant ligt
op NAP -2,0 m, onder de polderslootjes bij Papendrecht (AHN tot NAP -1,8 m).
`replacesBuildings` bevat de basculekelder met het bedieningsgebouw
(`NL.IMBAG.Pand.0590100000018081`, 1967), die PDOK als plaat van 0,6 m op het
water reconstrueert. Het kleine pand onder de noordelijke aanbrug
(0590100000019520, 2,3 m hoog) blijft staan: het ligt onder het dek en raakt
het model niet.

De brug ligt in de N3. Het is een boogbrug, maar het is
meer: aan de noordkant van de boog ligt een basculebrug met kelder en
bedieningstoren, en de zuidelijke aanbrug heeft een eigen fietsdek dat
onder het wegdek afdaalt.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek volgens het AHN-DSM om de 4 m: +10,6 m bij het zuidelijke
  landhoofd, +14,9 m onder de boog en +6,1 m bij het noordelijke landhoofd;
  20,9 m breed over de aanbruggen, 21,6 m onder de boog en 20,8 m over de klep
  (BGT). Ten zuiden van x = -335 buigt de rijbaan naar het zuidoosten af
  (BGT-randen om de 5 m).
- De boog met trekband van 203 m tussen de opleggingen: twee verticale
  ribben van 1,8 m breed en 2,2 m hoog, 6,4 m ten oosten en 10,1 m ten westen
  van de as (AHN; het fietspad ligt buiten de oostelijke rib), met de
  bovenrand als parabool met de top op +43,0 m (28,1 m boven het wegdek) die
  het wegdek 103,6 m uit het midden raakt (AHN). Het boogdek is een dekplaat
  van 0,8 m met trekbanden van 3,0 m onder de ribben, dwarsdragers van 2,4 m
  ertussen en het fietspad als uitkraging.
- Het netwerk van schuine hangers: acht knopen op het dek op velden van
  22,56 m (foto's: negen velden), van elke knoop een hanger naar de boog een
  half veld links en een half veld rechts. Tussen dek en rib een scherm met
  de hangers als stroken van 1,0 m en 17 openingen per rib: driehoeken met de
  punt omhoog tussen twee hangers waar die steiler staan dan 50 graden, en
  overal waar een bovenkant flauwer helt (de boog boven een dekknoop, de
  hangers bij de opleggingen) een spitse top van 55 graden. De hoogste
  opening reikt tot +40,5 m.
- Twee rivierpijlers met ronde koppen van 6,5 × 29,6 m tot +6,2 m (BGT, AHN),
  met drie kolommen van 4,5 × 3,0 m onder de trekbanden en de as.
- De basculeklep van 34,3 m in gesloten stand (stalen dekplaat van 0,6 m op
  een koker van 2,0 m) met voegen van 0,4 m over het wegdek bij de punt en
  het draaipunt.
- De basculekelder volgens de BAG-contour (23,4 × 18,6 m met afgeronde
  hoeken) tot onder het wegdek, met een plint van 1,0 m breder tot +1,2 m en
  drie ramen als nissen van 0,35 m in de westgevel; aan de zuidwesthoek de
  toren van het bedieningsgebouw van 5,9 × 3,5 m tot +20,0 m (AHN) met een
  raamband als nis rond de cabine. Het fietspad loopt als uitkraging langs de
  oostkant van de kelder.
- De zuidelijke aanbrug: een kokerligger (dekplaat 1,0 m, koker 2,6 m diep)
  op tien velden van circa 45 m, met per pijler zes kolommen van 2,2 × 0,9 m
  (BGT: x = -240,1, -194,9 en -149,4; geschat op dezelfde steek: -375,7,
  -330,5 en -285,3) en in de Wantijhaven drie poeren van 3 m dik tot +1,0 m
  met vijf of zes kolommen (BGT: x = -421,3, -466,6 en -511,5).
- Het fietsdek aan de oostkant: tot x = -122 gelijk met het wegdek, daarna
  een eigen plaat van 1,2 m die afdaalt tot +9,6 m op x = -408 en +5,5 m aan
  het einde (AHN), ten zuiden van x = -335 los van de rijbaan met een sterkere
  bocht (BGT), op eigen poeren met één kolom in de haven.
- De noordelijke aanbrug: dezelfde kokerligger op zes velden van 49,1 m met
  vijf kolompijlers (geschat).
- Schampkanten van 0,9 × 0,6 m langs de randen in plaats van de leuningen.
- Twee massieve landhoofden tot waar het wegdek het PDOK-maaiveld bereikt
  (zuid +10,6 m, noord +6,1 m), en een kort landhoofd onder het einde van het
  fietsdek.

Wat er niet in zit: het windverband en de portalen tussen de boogribben
(vrije horizontale overspanningen van 16,5 m, die op 1:1000 niet zonder steun
printen), de echte hangers van circa 0,1 m (vervangen door het scherm),
leuningen, lantaarns, seinpalen, slagbomen en verkeersborden (dunner dan
0,9 m), het remmingwerk en de geleidewerken in de rivier (niet in BGT of AHN
te plaatsen; laag bij het water), de trappen aan de kelder (dunner dan
0,9 m), de geluidsschermen van de foto uit 2018 (niet in het AHN) en de
open stand van de klep.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke wegstrook op dekhoogte zonder boog, pijlers of kelder, en de kelder
een plaat op het water. Het model heeft van alle vier kanten de boog: van
oost en west het scherm met de driehoekige en spitse openingen, van noord en
zuid de twee ribben achter elkaar; verder de rivierpijlers met ronde koppen
en kolommen, de kelder met de toren (vooral van west en noordwest
herkenbaar, zoals op de foto vanaf de noordoever), de rijen kolompijlers
onder beide aanbruggen, de poeren in de Wantijhaven, de bocht van de
zuidelijke aanbrug en het lager liggende fietsdek dat ervan losraakt (van
oost en zuidoost), en de schampkanten.

Pasvorm op het AHN: over de rijbaan van x = -330 tot 450 ligt 91 % van de
DSM-cellen binnen 1 m van het model (93 % binnen 2 m, mediaan +0,02 m; de
rest zijn auto's, lantaarns en hangers). Op de smalle boogribben ziet het AHN
per cel vaak het dek of het water; de hoogste DSM-cel per 8 m op elke rib ligt
in 33 van de 50 vakken binnen 1 m van de bovenrand van het model en in alle
vakken binnen 2 m (mediaan -0,64 m). De landhoofden sluiten op het
PDOK-maaiveld aan (zuid 54,17 m tegen 54,26 m ellipsoïdisch, noord 49,59 m
tegen 49,75 m).

Printbaarheid op 1:1000: de echte hangers en het windverband zijn te dun of
liggen horizontaal. De ribben staan via het scherm op het dek; elke opening
heeft een bovenkant van minstens 50 graden of een spitse top van 55 graden,
openingen kleiner dan 2 m² blijven dicht. Alleen de onderkant van de dekken
(met de uitkragingen) hangt vrij (18 961 m²), plus de bovenkant van de
raamnissen (6,6 m²); het script controleert dat er boven het wegdek niets
vrij hangt, dat alles op dezelfde onderkant begint en dat de printversie
buiten de nissen geen overhang heeft (1,9 m² aan splinters waar fietsdek en
rijbaan elkaar raken). Printcheck op 1:1000 in een uitsnede van 395 m rond de
boog, de klep en de kelder: status NoError, 61,0 naar 68,8 cm³ (+12,7 %),
11,7 s; de openingen in het scherm blijven open en onder de dekken komt een
wig met een smal scherm. De hele brug past niet in 400 mm: in een uitsnede van
1078 m (1:2694) gaat het model ook als gesloten solid door (status NoError,
9,8 naar 8,5 cm³, 4,2 s). De STL op 1:3000 heeft dezelfde printvoet (wig van
50 graden en een scherm van 0,8 mm); op die schaal zijn de hangerstroken
0,33 mm en de kolommen 0,3 mm breed, dus te dun om los te printen: print de
boog met de export op 1:1000.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Merwedebrug_(Beneden-Merwede))
(1967, stalen boogbrug met een basculebrug aan de noordkant, 1032 m lang,
hoofdoverspanning 203 m, de boog gebouwd door Penn & Bauduin en ingevaren),
[Structurae](https://structurae.net/en/structures/merwede-bridge-papendrecht)
(boog met trekband, 202 m), PDOK BGT (overbruggingsdeel: dekranden, fietsdek,
kolommen en poeren, rivierpijler, landhoofden), PDOK BAG (pand
0590100000018081), PDOK AHN (dsm en dtm 0,5 m via WCS: wegdek, fietsdek,
boogribben, pijlerkoppen, toren), de PDOK-luchtfoto (klep, kelder, fietspad)
en het PDOK-terrein (waterspiegel), en de Wikimedia Commons-foto's
Papendrecht, brug tussen Papendrecht en Dordrecht foto5 2010-06-27
17.06.JPG (boog en hangers vanaf de westoever), Papendreschtsebrug over de
Beneden Merwede, gezien van noord naar zuid.JPG (kelder, toren, klep en
rivierpijler), Papendrechtse brug 2018 1, 2 en 3.jpg (fietsdek, ribben,
klep) en PapendrechtMerwedebrug01 tot en met 04.JPG (noordelijke aanbrug,
klep open). Geschat zijn de plaats van de drie zuidelijke pijlers op het land
(BGT-steek van 45,2 m) en van de vijf noordelijke pijlers (gelijke velden,
niet in BGT of AHN), de knopen van het hangernetwerk (uit de foto met een
perspectieffit: negen velden), de doorsneden (ribben 1,8 × 2,2 m, aanbruggen
2,6 m, boogdek 2,4 m met trekbanden van 3,0 m, klep 2,0 m, fietsdek 1,2 m),
de kolommen op de rivierpijlers, de poeren tot NAP +1,0 m, het fietsdek
tussen x = -122 en -408 (het AHN is daar onrustig; lineair) en de ramen van
de kelder.

Licentie van het model: eigen werk op basis van open bronnen.
