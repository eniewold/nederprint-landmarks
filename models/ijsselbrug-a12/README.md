# IJsselbrug A12 (Westervoort)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ijsselbrug-a12.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:rijbaan-lokaal` (de bovenste 0,5 m van het wegdek met de BGT-attributen, zie hieronder) en `building:ijsselbrug-a12` met de rest van het kunstwerk: de dekken van de drie bruggen met schouwpaden, schampkanten, geleiders, scheiding en randbalken, de stalen hoofdliggers, de betonnen koker, de bakstenen pijlers met kappen en opleggingsblokken, de betonnen rivierschijven, de dwarsregels met kolommen en de landhoofden met vleugelwanden |
| `ijsselbrug-a12-1-1500.stl` | De brug als geheel in één stuk (constructie en wegdelen samen, ongewijzigd) op 1:1500 met een printvoet onder de dekken, met de onderkant (0,8 m onder de waterspiegel) op het printbed (376 × 35 × 13 mm; met `--scale` een andere schaal, op 1:1000 is hij 565 mm lang) |
| `ijsselbrug-a12.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

De IJsselbrug in de A12 tussen Arnhem (knooppunt Velperbroek) en
Westervoort/Duiven bestaat uit drie bruggen naast elkaar: aan de zuidwestkant
twee stalen liggerbruggen voor het verkeer richting Duitsland (de oostelijke
uit 1961, de westelijke uit 1964; de landhoofden en aardebanen werden vanaf
1941 gebouwd, het werk lag van 1943 tot na de oorlog stil), aan de
noordoostkant de betonnen brug van circa 1970 voor het verkeer richting
Arnhem en Utrecht, met vier rijstroken en daarnaast een lokale weg (fiets- en
dienstweg). De Brug bij Westervoort (eigen model, `brug-bij-westervoort`)
ligt 2,1 km stroomopwaarts; de modellen overlappen niet.

De GLB is in meters met de oorsprong op RD (196332,97, 443156,92) (WGS84
51,97528 N, 5,98877 O, op de controle-URL), midden op de lengte van de brug
(tussen de BGT-einden van de dekken) op de as van de middelste (oostelijke
stalen) brug, op de waterspiegel van de IJssel zoals het PDOK-terrein die legt
(51,30 m ellipsoïdisch, NAP +7,47 m) en de glTF-conventie Y omhoog. +X loopt
langs de brug naar het zuidoosten, naar Westervoort en Duiven (`xAxis`
(0,61418, -0,78916), 52,11 graden rechtsom vanaf het oosten, uit de
BGT-randen van de dekken), +Y naar het noordoosten (stroomafwaarts), de kant
van de betonnen brug. De rivier ligt tussen x = 70 en 175; de noordwestelijke
uiterwaard (NAP +10,35 m) beslaat bijna de hele noordwestelijke helft, de
zuidoostelijke (NAP +12,0 m) het stuk van x = 180 tot de dijk. Het maaiveld
wordt op zes punten op de IJssel bemonsterd (`groundSamplePoints`: y = -29,
8 m naast de stalen bruggen, op x = 90, 115 en 140, en y = 41, 9 m naast de
betonnen brug, op x = 115, 140 en 165); `groundOffsetMetres` is 0, want het
PDOK-terrein legt het water daar op 51,29 tot 51,32 m ellipsoïdisch.
`groundHeight` is 51,30 m, de PDOK-waterspiegel op die punten, zodat een
uitsnede die alleen een aanbrug raakt (waar de uiterwaarden 3 tot 4,5 m hoger
liggen) het model niet laat wegvallen of optillen. `replacesBuildings` is
leeg: onder de brug ligt geen BAG-pand, en PDOK reconstrueert de brug niet
(de BGT-dekken liggen in de PDOK-tegels als wegvlak op het maaiveld).

Wegdelen met PDOK-attributen: de bovenste 0,5 m van het wegdek is per
BGT-functie een eigen node van klasse `road` met de attributen van de
actuele BGT-wegdelen erop (relatieve hoogteligging 1, zonder
`eind_registratie`) in `extras.attributes`, zodat de kleurregels van een
thema op de brug werken zoals op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`, noordwestelijke en zuidoostelijke helft) | Waar |
| --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan autosnelweg | gesloten verharding | zuidwestelijke stalen brug `L0002.…a70cf5c2` en `L0002.…3f51efdf`; middelste `L0002.…c4e9ce13` en `L0002.…755c3737`; betonnen brug `L0002.…af572188` en `L0002.a67252847527443691ef8abdb2bc9327` | op elk dek tussen de schampkanten en geleiders: y = -17,23 tot -8,87, -3,83 tot 3,83 en 6,62 tot 26,78 (BGT -17,23 tot -8,65, -4,1 tot 3,95 en 6,76 tot 26,84) |
| `road:rijbaan-lokaal` | rijbaan lokale weg | gesloten verharding | `L0002.…90c65326` en `L0002.d5c57ddeae24442291344f91adc6e721` | aan de noordoostrand van de betonnen brug tussen de scheiding en de randbalk: y = 27,72 tot 30,83 (BGT 27,65 tot 31,22) |

Eén node per functie; de BGT vult `plus_fysiek_voorkomen` hier niet. De BGT
deelt elk wegdeel en elk dek op x = -58 in tweeën. De schouwpaden op de
consoles aan de buitenrand van de zuidwestelijke brug (1,4 m), de geleiders
aan de binnenranden van de stalen bruggen (0,9 m breed, 0,8 m hoog), de
schampkant met geleider aan de zuidwestrand van de betonnen brug (1,07 m),
de scheiding tussen rijbaan en lokale weg (0,9 m, BGT 0,81 m) en de randbalk
met leuning aan de noordoostrand (0,9 m, 0,6 m hoog) blijven constructie. De
laag is per dek een snijstrook tussen de dekranden en 0,5 m voorbij de
dekeinden, van 0,5 m onder tot 1 m boven het wegdek over de stations van de
dekken (om de 2 m en op elke pijlerlijn); de schampkanten en geleiders
blijven over hun hele hoogte met 2 cm vrij constructie. De volumes tellen op
tot die van de brug als geheel (constructie 51.115 m³, rijbaan 9.749 m³,
lokale weg 838 m³, samen 61.702 m³, geen overlap; het script controleert dat).
De rijbaan bestaat uit drie stukken, één per brug. Verticale stralen
(`zfight.py`, 30.000 punten over de dekken) vinden geen samenvallende
bovenvlakken en geen vlakken zonder dikte. De STL is ongewijzigd: het hele
brugmodel in één stuk.

Onderdelen in het model (hoogtes in NAP):

- Drie dekken van landhoofd tot landhoofd (x = -268,6 tot 268,5 tussen de
  BGT-einden, over de landhoofden doorgetrokken tot -269,4 en 269,5): de
  zuidwestelijke stalen brug 10,7 m breed (y = -18,65 tot -7,95), de
  middelste 9,5 m (-4,75 tot 4,75), de betonnen brug 26,22 m (5,53 tot
  31,75), met spleten van 3,2 en 0,78 m ertussen (BGT). Samen 52,4 m breed.
- Het wegdek volgt het AHN-DSM als regelmatig lengteprofiel, gelijk voor de
  drie bruggen: één topboog met een straal van 16.000 m en de top op
  +24,60 m bij x = 125 (boven de rivier), daarbuiten 2,35 % naar het
  noordwesten (+19,75 m aan het dekeinde) en 1,0 % naar het zuidoosten
  (+23,95 m; de zuidoostelijke dijk ligt 4 m hoger); restfout 7 cm op de
  betonnen brug. De stalen dekken zijn in dwarsrichting vlak, de betonnen
  brug helt 2,5 % naar het noordoosten (AHN: 24,83 m aan de zuidwestrand van
  de rijbaan, 24,36 m aan de noordoostrand).
- De pijlerlijnen: zeven aanbrugvelden over de noordwestelijke uiterwaard,
  voor de drie bruggen op dezelfde lijnen x = -228,3, -188,2, -148,1, -107,9,
  -67,8 en -27,7 (40,12 m hart op hart, uit de onderbrekingen in de
  AHN-punten op de stalen dekken en de voegen in de luchtfoto) en 18,0 (45,7 m
  verder); de rivieroverspanning (staal 104,9 m tussen de bakstenen
  rivierpijlers op x = 67,7 en 172,6, beton 105,3 m tussen de betonnen
  schijven op 84,2 en 189,5, alle vier BGT); een pijlerlijn op de
  zuidoostelijke uiterwaard op x = 223,2 en het laatste veld van 45 m tot het
  landhoofd.
- Stalen bruggen: een dek met consoles van 0,6 m en per brug twee
  hoofdliggers (als dichte wanden van 0,9 m, 1,4 m binnen de dekranden). Over
  de aanbruggen zijn de liggers 2,6 m hoog (onderkant +18,1 m bij x = -228);
  van x = 18,0 tot 223,2 is het een doorgaande vouten-ligger met een
  boogvormige onderkant: 5,8 m hoog boven de rivierpijlers (onderkant
  +18,7 m) en 3,0 m midden in de rivieroverspanning (+21,6 m, 14 m boven de
  waterspiegel), in de zijvelden parabolisch terug naar 2,6 m.
- Bakstenen pijlers onder de twee stalen bruggen samen: in de rivier de
  BGT-contouren (6,6 × 28 m met ronde koppen), op de uiterwaarden 4,0 m dik
  en even lang (y = -20,3 tot 7,8) met ronde koppen; daarop een betonnen kap
  van 1,05 m met een schuine onderrand (0,2 m uitstek) en per hoofdligger een
  opleggingsblok van 2,0 × 1,8 × 1,55 m.
- Betonnen brug: een dekplaat met uitkragingen van 6,6 m (0,7 m aan de rand,
  0,9 m bij de lijven), randbalken van 0,6 × 1,1 m en een koker van 13 m breed
  aan de onderkant (y = 12,14 tot 25,14, lijven 0,5 m schuin). Over de
  aanbruggen 2,4 m hoog (onderkant +18,4 m bij x = -228); van x = 18,0 tot
  223,2 een vouten-ligger, 6,5 m hoog boven de rivierschijven (onderkant
  +18,2 m) en 2,8 m midden in de rivieroverspanning (+21,9 m).
- De betonnen rivierschijven volgens de BGT (2,0 × 19,1 m met ronde koppen),
  tot 0,3 m in de koker.
- Onder de betonnen aanbruggen per pijlerlijn een dwarsregel van 2,0 m dik en
  1,6 m hoog over 21,7 m (y = 8,8 tot 30,5) op vijf ronde kolommen van 1,3 m
  (y = 10,0 tot 28,0, 4,5 m hart op hart).
- De landhoofden als wand over de volle breedte van de voorkant (x = -266,8 en
  266,25, BGT) tot het einde van de dekken, tot onder de dekplaten, en de
  vleugelwanden langs de buitenranden in de dijk (BGT, tot x = -282,6 en
  -278,7 aan de noordwestkant, 282,0 en 281,9 aan de zuidoostkant; 0,9 m dik,
  0,6 m boven het wegdek).

Wat er niet in zit: lantaarnpalen (in een rij op de betonnen brug op y = 14
en langs de geleiders), leuningen en geleiderails op palen (kleiner dan
0,9 m); de verstijvingen op de liggers en de dwarsdragers en windverbanden
tussen de stalen liggers (kleiner dan 0,9 m of onzichtbaar onder het dek);
de twee seinportalen (boven de betonnen brug bij x = 84 en op de dijk bij
x = -293: vakwerk van buizen dat op 1:1000 niet zonder steun print, en een
dichte balk over de rijbaan zou de export tot op het wegdek opvullen);
dilatatievoegen, afwatering, de peilschalen op de rivierpijlers en de
bekleding van de dijktaluds en de betonnen strook op de uiterwaard naast de
betonnen brug (PDOK-terrein). De wegdelen sluiten aan beide einden op de
PDOK-wegdelen op de dijk aan.

Pasvorm op het AHN-DSM (0,5 m, binnen de wegdelen van de drie dekken): boven
de rivier (x = 70 tot 175) ligt 93 % (zuidwest), 94 % (midden), 96 %
(betonnen brug) en 79 % (lokale weg) van de cellen binnen 1 m van het wegdek
van het model, mediaan -0,01 tot -0,14 m. Over de hele lengte is dat 73 %
(mediaan -0,11 m): de betonnen rijbaan 97 %, maar op de stalen dekken
ontbreken over de uiterwaarden de AHN-punten tussen de pijlerlijnen (het DSM
vult daar met lagere waarden; de onderbrekingen gaven juist de pijlerlijnen),
en de lokale weg ligt in het DSM over de uiterwaarden 2 tot 4 m lager dan de
rijbaan en springt bij de betonnen rivierschijf (x = 84) terug naar het
niveau van het dek. Een lagere lokale weg naast de rijbaan is op de
luchtfoto niet te zien (één doorgaande leuning, geen schaduw van een trede);
het model legt hem op het dek. Nakijken op de kaart.

Printbaarheid op 1:1000: dragende delen zijn minstens 0,9 m (stalen
hoofdliggers), 1,3 m (kolommen) en 2,0 m (rivierschijven, dwarsregels);
alle pijlers en wanden staan verticaal, de kappen hebben een onderrand van
51 graden. Vrij hangen de onderkanten van de dekken, de liggers en de koker
(24.209 m²). Het script controleert dat alles op dezelfde onderkant begint en
dat de printversie (met per brug een wig van minstens 50 graden vanaf de
dekranden onder de liggerhoeken door en een scherm van minstens 0,9 m in het
midden) geen overhang heeft (0 m²). Met 565 m past de brug op 1:1000 niet in
één uitsnede. In de printcheck (de hele brug in een uitsnede van 506 m op
1:1266, 400 mm, gesloten solid met overhangopvulling, status `NoError` voor
alle drie de nodes, 89 s): constructie 182.939 → 87.955 mm³ (−52 %; de
opgevulde print valt binnen het volume dat zonder opvulling tot de
onderplaat wordt doorgetrokken), rijbaan +0,8 % en lokale weg +0,1 %: de
wegdelen krijgen geen eigen opvulling, de constructie draagt alles.

Bronnen: [Lijst van oeververbindingen over de (Gelderse) IJssel](https://nl.wikipedia.org/wiki/Lijst_van_oeververbindingen_over_de_%28Gelderse%29_IJssel)
(IJsselbrug, liggerbrug, A12/E35, rivierkilometer 883,0);
[imsafe.wikixl.nl, IJsselbrug Arnhem](https://imsafe.wikixl.nl/index.php/IJsselbrug_Arnhem)
(een betonnen en twee stalen bruggen, aardebanen en landhoofden vanaf 1941,
oostelijke stalen brug 1961, westelijke 1964, consoles met schouwpaden 1975);
[Rijkswaterstaat](https://www.rijkswaterstaat.nl/wegen/projectenoverzicht/a12-groot-onderhoud-aan-betonnen-ijsselbrug-in-2026)
en de Arnhemse Koerier (onderhoud 2025-2026: twee stalen bruggen richting
Duitsland, de betonnen brug richting Arnhem met vier rijstroken en een
fietspad ernaast); PDOK BGT overbruggingsdeel (de zes dekdelen, de
rivierpijlers `L0002.61324ffd2670441c915e7ff76176fda5`,
`L0002.33ce51bfed9540bdaec2fdaff8a2a179`, `L0002.75a746717ba0454eb9639b55f324f86f`
en `L0002.a434af09335d46aebee5430dd38383aa`, de landhoofden
`L0002.60d70d0401184ce2ad91a7f4a1e6c011` en
`L0002.eda9b58469e14d6e94d2ca56c0eddc3a`) en wegdeel; AHN DSM/DTM 0,5 m (PDOK
WCS) voor het lengte- en dwarsprofiel, de pijlerlijnen en de uiterwaarden;
PDOK-luchtfoto voor de voegen en de indeling van de dekken; PDOK-terrein
voor de waterspiegel (PDOK = NAP + 43,83 m op de uiterwaarden); Wikimedia
Commons-foto's: *IJsselbrug A12 Velp.jpg* (Apdency, CC0), *Brug A12.jpg*
(Koos de Geest, CC BY-SA 3.0), *Old steel girderbridge across the IJsselriver
at Arnhem-Westervoort - panoramio.jpg* en twee panoramio-foto's van de
betonnen brug (*Less creepdeflections at Westervoort bridge…* en *Too little
creepdeflections…*, Henk Monster, CC BY 3.0). Structurae noemt een "Nieuwe
IJsselbrug" (1968-1970, 644 m, hoofdoverspanning 150,5 m, 34,2 m breed)
tussen Arnhem en Westervoort; die maten passen niet bij de BGT (dekken van
537 m, rivieroverspanning 105 m, betonnen dek 26,2 m) en zijn niet gebruikt.

Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek en
maaiveld): de liggerhoogtes (staal 2,6, 5,8 en 3,0 m; beton 2,4, 6,5 en
2,8 m) en het begin van de vouten-liggers op de pijlerlijnen x = 18,0 en
223,2; de plaats en breedte van de stalen hoofdliggers; de kokerbreedte
(13 m), de dekplaat en de randbalken van de betonnen brug; de bakstenen
pijlers op de uiterwaarden (4,0 m dik, even lang als de rivierpijlers, kap
1,05 m, opleggingsblokken 1,55 m); de dwarsregels en het aantal (vijf),
de plaats en de dikte (1,3 m) van de kolommen onder de betonnen aanbruggen,
op dezelfde pijlerlijnen als de stalen bruggen; de hoogtes van schouwpaden,
schampkanten, geleiders, scheiding en randbalk (0,6 tot 0,8 m) en de
vleugelwanden.

Licentie van het model: eigen werk op basis van open bronnen.
