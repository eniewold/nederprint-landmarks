# Merwedebrug (Gorinchem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `merwedebrug-gorinchem.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het wegdek met de BGT-attributen, zie hieronder) en `building:merwedebrug-gorinchem` met de rest van het dek, de twee bogen met trekband (elk twee boogribben met de hangers), de drie rivierpijlers, de vier zuidelijke en vijf noordelijke aanbruggen met hun wandpijlers, de basculeklep, de basculekelder met het bedieningshuis en de twee landhoofden |
| `merwedebrug-gorinchem-1-2250.stl` | De brug als geheel in één stuk (constructie en wegdelen samen, ongewijzigd) op 1:2250 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (365 × 17 × 18 mm; met `--scale` een andere schaal, op 1:1000 is hij 822 mm lang) |
| `merwedebrug-gorinchem.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (124340,0, 426609,4) (WGS84
51,82725 N, 4,94245 O), op de as van het BGT-dek boven de middelste
rivierpijler, op de waterspiegel van de Boven-Merwede zoals het PDOK-terrein
die legt (NAP +0,55 m) en de glTF-conventie Y omhoog. +X loopt langs de brug
naar het noordnoordoosten, naar Gorinchem (`xAxis` (0,22495, 0,97437), 77,0
graden linksom vanaf het oosten, uit de BGT-randen van het dek), +Y
stroomafwaarts naar het westnoordwesten. Het zuidelijke landhoofd bij
Sleeuwijk ligt op x = -380 tot -357, de aanbrugpijlers op x = -314 (geschat),
-267,3 en -222,2, de rivierpijlers op x = -173,2, 0 en 173,2 (harten, BGT),
de basculeklep op x = 178,6 tot 209,5, de basculekelder op x = 209,5 tot
230,5, de noordelijke aanbrugpijlers op x = 276,3, 321,8, 366,8 (BGT) en 413
(geschat) en het noordelijke landhoofd op x = 430,5 tot 442. Het maaiveld wordt
op veertien punten op het water bemonsterd (`groundSamplePoints`: twaalf 25 m
naast de as op x = -280, -170, -85, 0, 85 en 170, en twee 25 m oostelijk van
de noordelijke aanbrug op x = 320 en 380); `groundOffsetMetres` is 0, want het
PDOK-terrein legt het water daar op 44,07 tot 44,12 m ellipsoïdisch.
`groundHeight` is 44,07 m, de laagste PDOK-hoogte op die punten, zodat een
uitsnede die alleen een aanbrug raakt het model niet laat wegvallen.
`replacesBuildings` bevat het bedieningshuis
(`NL.IMBAG.Pand.0512100000046976`, 7 × 3,7 m aan de westrand van de kelder),
dat PDOK als plat blok op het water reconstrueert; het pandje van 3 × 3 m
naast de noordelijke toerit (`NL.IMBAG.Pand.0512100000200239`, x = 458) ligt
buiten het model en blijft staan.

Er staat één brug (1961): de A27 is hier nog niet verbreed. De twee
vervangende betonnen bruggen naast de bestaande (bouw 2026 tot 2031) zitten
niet in het model; op de nieuwste luchtfoto is alleen grondwerk op de
noordoever te zien.

Wegdelen met PDOK-attributen: de bovenste 0,5 m van het wegdek is per
BGT-functie een eigen node van klasse `road` met de attributen van het
actuele BGT-wegdeel erop (relatieve hoogteligging 1, zonder
`eind_registratie`) in `extras.attributes`, zodat de kleurregels van een
thema (fietspaden rood) op de brug werken zoals op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan autosnelweg | gesloten verharding | `L0002.4a58589c94d0482fa1122d24ed1135bb` (oost) en `L0002.d16fa89b9372472a8dec20bef16557c4` (west), gesloten verharding; `L0002.7913201533ba46dc85c10066ef4472af`, open verharding, de strook langs het westelijke fietspad van x = 176,6 tot 431,5 | het midden van het dek tussen de fietspaden, onder de bogen tussen de ribben, met de bermen ertussen |
| `road:fietspad` | fietspad | gesloten verharding | `L0002.3432c715f819407b91b0450bb8cc29cb` (oost) en `L0002.86ba0191d2c84652aa5510895491b912` (west), gesloten verharding; `L0002.e98ae840f64c491ea0ad9199041b2f5f` en `L0002.cf65a676e9644309b5de3de305215753` (smalle randstroken tot x = 210), `L0002.00079d4b75094a3c9511f897cad01b51` (oost, x = 176,6 tot 414) en `L0002.b97c63ed218f4b8dae297fcf7711d7ea` (west, x = -358 tot -177), open verharding | aan beide kanten tussen rijbaan en dekrand: over de zuidelijke aanbruggen vanaf y = -9,0 en 6,9 tot 7,2, onder de bogen buiten de ribben, ten noorden van de bogen vanaf y = -7,4 tot -6,8 en 8,8 tot 9,2 |

De BGT heeft geen `plus_fysiek_voorkomen` op deze wegdelen. Eén node per
functie: de smalle stroken open verharding krijgen het fysieke voorkomen van
het hoofdvlak (gesloten verharding). De bermen (BGT ondersteunend wegdeel,
open verharding) tussen rijbaan en fietspad over de zuidelijke aanbruggen en
bij x = 414 tot 431,5 horen bij de rijbaan; die naast de basculekelder liggen
buiten het dek en blijven, net als de kelder zelf (tot 2 cm onder het
wegdek) en het bedieningshuis, constructie. De grens tussen rijbaan en
fietspad volgt de binnenrand van de BGT-fietspaden (vereenvoudigd tot 5 cm),
met sprongen bij x = -176,9, 176,6 en 414,1 waar de BGT-vlakken wisselen;
onder de bogen legt de BGT hem 0,2 tot 0,9 m naast het midden van de rib, in
het model ligt hij op de rib, zodat er geen strookje rijbaan tussen rib en
fietspad overblijft. Op de landhoofden (BGT-hoogteligging 0) loopt de grens
van het dekeinde door. De laag is een snijstrook over de volle breedte en
0,5 m voorbij de landhoofden, van 0,5 m onder tot 1 m boven het wegdek over
de stations van het dek (om de 2 m en de voegen tussen de dekdelen); de hele
strook van elke boogrib (ook onder de openingen van het hangerscherm) en de
delen van de kelder buiten het dek blijven met 2 cm vrij constructie. De
volumes tellen op tot die van de brug als geheel (constructie 85.072 m³,
rijbaan 6.504 m³, fietspad 3.286 m³, samen 94.862 m³, geen overlap; het
script controleert dat). Verticale stralen over het dek en over het hele
model vinden geen samenvallende bovenvlakken en geen vlakken zonder dikte,
net als in het model zonder wegdelen. De STL is ongewijzigd: het hele
brugmodel in één stuk.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 787,5 m tussen de voorkanten van de landhoofden (822 m met de
  landhoofden), 24,5 m breed over de zuidelijke aanbruggen, 25,55 m over de
  bogen, 25,45 m over de basculeklep en 24,6 m over de noordelijke aanbruggen
  (BGT), met het wegdek volgens het AHN-DSM om de 2 m: +12,4 m bij Sleeuwijk,
  +17,6 m boven de middelste pijler en +10,7 m bij Gorinchem. Een plaat van
  1,0 m over de volle breedte (de fiets- en voetpaden kragen 2,3 tot 3,7 m
  uit) op een kokerligger van y = -9,5 tot 9,0 onder de hoofdliggers: onder de
  bogen 3,8 m diep (onderkant +13,35 m bij de toppen, doorvaarthoogte volgens
  Wikipedia +13,3 m), over de aanbruggen 3,2 m.
- Twee bogen met trekband van 173,2 m tussen de pijlerharten, elk met twee
  boogribben van 1,4 × 2,0 m boven de hoofdliggers, 8,4 m naast het midden van
  het dek (y = -8,65 en 8,15, AHN; de BGT-liggers van de basculeklep liggen
  op dezelfde lijnen). De bovenrand is per boog een parabool boven de koorde
  tussen de opleggingen (2,6 m boven het wegdek) met de top op +40,8 m (het
  hoogste punt, 40,3 m boven het water); boven de middelste pijler komen de
  ribben van beide bogen in een V op het dek samen.
- De hangers: per boog 15 op velden van 10,8 m (foto's); tussen dek en rib een
  scherm met stijlen van 1,2 m en 16 spitse openingen per rib (zijden van 55
  graden) tot net onder de rib, de hoogste tot +38,7 m, bij de opleggingen
  versmald tot de rib (laagste top +20,4 m).
- De drie rivierpijlers: caissons met ronde koppen volgens de BGT (11 × 38 m
  onder de bogen, 8,5 × 33,6 m in het midden) tot +6,4 en +6,3 m (AHN naast
  het dek), daarop een schacht van 6 en 5 m met ronde koppen onder de
  kokerligger.
- Vier aanbruggen aan de zuidkant (velden van 43 tot 49 m, voegen op de
  luchtfoto) en vijf aan de noordkant (40 tot 46 m) op wandpijlers van 2,5 tot
  3,7 × 29 m met ronde koppen (BGT) tot +5,6 en +6,1 m, daarboven een smallere
  schacht onder de kokerligger.
- De basculeklep van 30,9 m (BGT-liggers), met de onderkant van +11,9 m bij de
  boogpijler tot +10,1 m bij het draaipunt (doorvaarthoogte volgens Wikipedia
  +10,45 m); de basculekelder als blok van 21 × 27,6 m tot het wegdek (BGT-dek
  en luchtfoto); het bedieningshuis (BAG) als toren van 7 × 4,1 m aan de
  westrand van de kelder met het platte dak op +21,5 m (AHN), 6,2 m boven het
  wegdek.
- De twee landhoofden als blokken tot het wegdek: het zuidelijke tot waar het
  AHN-maaiveld van de dijk het wegdek bereikt, het noordelijke vanaf de
  BGT-voorkant tot de dijk.

Wat er niet in zit: het windverband (dwarsbalken met kruisen) en de portalen
tussen de twee ribben van elke boog, de seinportalen bij de basculekelder, de
lichtmasten, leuningen en geleiderails, de kraagplaat van het dak van het
bedieningshuis en de contragewichten en het val van de basculeklep in de kelder.
Het windverband en de portalen zijn horizontale vrije overspanningen van 16,5
m tussen de ribben die op 1:1000 niet zonder steun printen (de export zou ze
tot op het dek opvullen); de rest is kleiner dan 0,9 m. De echte hangers zijn
staven van circa 0,1 m en zitten alleen als scherm in het model. Het
aanbrugviaduct van 550 m verder naar het noorden (over het Kanaal van
Steenenhoek en het spoor, 380 m voorbij het noordelijke landhoofd) is een
apart kunstwerk en hoort niet bij dit model.

Binnen het dek (22 m brede strook, AHN-DSM 0,5 m) ligt 81 % van de cellen
binnen 1 m van het wegdek van het model (85 % binnen 2 m, mediaan +0,02 m);
over de aanbruggen 94 %, over de bogen minder omdat het DSM daar de ribben,
het windverband en de lantaarns ziet. De bovenste DSM-cel per 8 m op de
ribben ligt in 38 van 42 vakken binnen 2 m van de bovenrand van het model
(mediaan 1,1 m lager: het DSM is op de smalle ribben dun bezet).

Printbaarheid op 1:1000: het windverband en de hangers zijn te dun of liggen
horizontaal. De ribben zijn banden van 1,4 m die via het scherm met spitse
openingen op het dek staan, zodat de onderkant van de rib nergens vrij hangt.
Alleen de onderkant van de kokerligger en van de uitkragende plaat hangt vrij
(18 611 m²); het script controleert dat alleen die naar beneden wijzen, dat
alles op dezelfde onderkant begint en dat de printversie geen overhang heeft
(0,08 m² aan losse facetjes). Met 822 m past de brug op 1:1000 niet in één
uitsnede. In de printcheck (gesloten solid met overhangopvulling, status
NoError voor alle onderdelen): een uitsnede van 380 × 380 m rond de bogen op 1:1000 in 4,5 s
(122,0 naar 85,4 cm³ ten opzichte van de rechte opvulling; onder het dek komt
een wig met een smal scherm tot de onderplaat, de spitse openingen blijven
open), een uitsnede van 280 × 280 m over de basculebrug en de noordelijke
aanbruggen op 1:1000 in 2,0 s (30,0 naar 51,8 cm³, +73 %) en het hele model
(1:2092, 400 mm) in 6,0 s (19,5 naar 19,8 cm³, +2 %; met de wegdelen
gescheiden: constructie 18,4 naar 18,8 cm³, +1,8 %, rijbaan 0,69 en fietspad
0,36 cm³ zonder eigen opvulling). De STL op 1:2250 heeft
dezelfde printvoet (wig van 50 graden vanaf de randen van de plaat, die bij de
basculeklep steiler wordt zodat hij onder de diepere ligger door loopt, en een
scherm van 0,9 m). Het PDOK-terrein ligt op het water op de waterspiegel van
het model, onder de aanbruggen 1 tot 4 m hoger (NAP +1,2 tot +4,5 m); aan het
noordeinde sluit het wegdek binnen 0,3 m op de PDOK-weg op de dijk aan, aan
het zuideinde ligt de PDOK-toerit 3,2 m lager dan het wegdek (het AHN ziet de
dijk daar wel op wegdekhoogte), zodat daar het kopvlak van het landhoofd
zichtbaar is.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Merwedebrug_(Boven-Merwede))
(1961, dubbele boogbrug met basculebrug, lengte 790 m, breedte 25,3 m, twee
bogen van 170 m, grootste overspanning 173 m, doorvaarthoogte NAP +13,3 m onder
de bogen en NAP +10,45 m onder de basculebrug van 30 m, vervanging 2026 tot
2031), PDOK BGT (overbruggingsdeel: dek, rivierpijlers, aanbrugpijlers,
liggers van de basculeklep), PDOK BAG (pand 0512100000046976, het
bedieningshuis), PDOK AHN (dsm en dtm 0,5 m via WCS: wegdek, boogribben,
pijlerkoppen, bedieningshuis, landhoofden), de PDOK-luchtfoto (voegen van de
aanbruggen, ligging van de ribben, kelder) en het PDOK-terrein
(waterspiegel), en Wikimedia Commons-foto's (Merwedebrug - RWS 364426.jpg;
Merwedebrug bridge Gorinchem 1.JPG; Merwedebrug bridge Gorinchem 2.JPG;
Merwedebrug (01).JPG; Merwede, Merwedebrug.jpg; Merwedebrug Sleeuwijk.jpg;
Merwedebrug bedieningshuis (01).JPG; Herstelwerk aan de Merwedebrug over de
Boven-Merwede (02).jpg) voor de ribben, het windverband, de hangers, de
pijlers met caissons, de kelder en het bedieningshuis. Geschat zijn de
waterspiegel (NAP +0,55 m: PDOK-water 44,08 m ellipsoïdisch min 43,55 m, het
verschil tussen PDOK-terrein en AHN op de oevers), de doorsnede van de ribben
(1,4 × 2,0 m) en hun hoogte boven het dek bij de opleggingen (2,6 m), het
aantal hangervelden (16 per boog, foto's), de dikte van de dekplaat (1,0 m),
de diepte van de kokerligger (3,8 en 3,2 m) en van de basculeklep (4,0 tot
5,3 m), de schachten van de pijlers, de lengte van de basculekelder (x = 209,5
tot 230,5, voegen op de luchtfoto), de twee aanbrugpijlers die niet in de BGT
staan (x = -314 en 413, bij voegen op de luchtfoto) en de achterkant van de
landhoofden (waar het AHN-maaiveld het wegdek bereikt).

Licentie van het model: eigen werk op basis van open bronnen.
