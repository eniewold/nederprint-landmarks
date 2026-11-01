# Nieuwe watertoren (Roermond)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-roermond-1930.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en reservoir zijn één omwentelingsprofiel, de voeg een omgewenteld V-profiel, balkon, ladder en lichtkap hulls; vensters en deuren zijn nissen.

De spoorwegwatertoren naast station Roermond is in 1928-1930 gebouwd naar een ontwerp van Sybold van Ravesteyn en voorzag de stoomlocomotieven van water. Het is een ronde toren van drie bouwlagen in baksteen met een plat gedekt, wit geschilderd betonnen reservoir. In de oorlog beschadigd en daarna deels hersteld. Rijksmonument 506153.

## Bestanden

- `watertoren-roermond-1930.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los reservoir of een losse ladder zou een eigen voet tot de grondplaat krijgen.
- `watertoren-roermond-1930.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-roermond-1930-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [197377.20, 355989.79], het hart van het dak in het AHN-DSM (0,13 m oost en 0,08 m noord van het hart van de cirkel door de BAG-contour van pand 0957100000217594, r 3,88 m, afwijking ≤ 0,13 m), op maaiveld (NAP +27,9 m, AHN-DTM op 4,5 tot 8 m uit het hart). Assen in RD-richting (`xAxis` [1, 0]); de toren is rond, alleen vensters, deuren, balkon, ladder en lichtkap hebben een stand. `groundSamplePoints` liggen op 5,4 m (r + 1,5) naar oost, west en zuid en op het noordwesten; het noordoosten ligt 1 m van de fietsenstalling (pand 0957100000260772, 3D BAG tot NAP +34,0, raakt het model niet). `groundHeight` 72,63 = NAP 27,9 + 44,73 (NLGEO2018-geoïde op de oorsprong).

## Onderdeel `building:schacht-reservoir-en-ladder`

- Ronde bakstenen schacht van 7,75 m doorsnede van de voet tot +9,7 en het betonnen reservoir van dezelfde doorsnede tot het platte dak op +14,35 (NAP +42,25). Tussen beide een V-voeg van 0,15 m diep met flanken onder 56 graden (op foto's een schaduwlijn).
- Op het dak een ondiepe ring van 0,2 m tussen r 2,7 en 3,55 binnen de dakrand (luchtfoto: witte rand, donkere ring, lichte middenschijf) en een glazen zadelvormige lichtkap van 1,8 × 2,8 m, nok 0,3 m boven het dak.
- Zuid (193 graden): vensterparen (twee stalen vensters van 0,9 m, één nis van 2,1 m) op de bovenste laag (+7,5 tot +8,85) en de eerste verdieping (+4,6 tot +6,0), beneden een hoog paar (+1,0 tot +3,6).
- Oostnoordoost (77,5 graden): vensterparen op de bovenste twee lagen, beneden een deur met bovenlicht (1,0 × 3,4 m).
- Oost en zuidoost: losse vensters van 0,9 m op de eerste verdieping (114,5 en 150 graden) en op de begane grond (131,5 graden, +1,95 tot +3,4).
- Noord (15,5 graden): deur op de begane grond (1,0 × 2,15 m) en een balkondeur (+4,0 tot +6,15) op een balkon van 1,6 × 0,9 m op +3,7 met een dichte borstwering tot +4,7 en een onderkant onder 56 graden.
- Noordnoordoost (32 graden): kooiladder als dichte strook van 0,9 × 0,75 m vanaf het balkon tot 0,9 m boven de dakrand, onderkant onder 56 graden.
- West (275 graden): deur aan de straat (1,0 × 2,3 m).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Roermond)): bouwjaar, ontwerper, spoorwegfunctie.
- [Rijksmonumentenregister 506153](https://monumentenregister.cultureelerfgoed.nl/monumenten/506153): ronde plattegrond, drie bouwlagen, gele baksteen en gewapend beton, plat gedekt wit reservoir, drie deuren, stalen vier- en achtruits vensters, stalen trap aan de noordzijde van de tweede verdieping tot de dakrand.
- BAG-pand 0957100000217594 (PDOK, ‘Pand in gebruik’, bouwjaar 1928, 46,6 m²): de cirkel van 7,75 m.
- 3D BAG (AHN5, 2024): plat dak op NAP +42,24 (70e percentiel +42,28, maximum +42,49).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): dak NAP +42,2 tot +42,3, lager in het midden (glas), maaiveld NAP +27,9.
- Luchtfoto 8 cm (PDOK): dakrand, donkere ring, lichtkap en de bovenkant van de ladder op het noordnoordoosten.
- RCE-foto's [20291317](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291317_-_RCE.jpg) (noordkant, 31,4 px/m geschaald op de dakhoogte: overgang +9,7, vensters, balkon, ladder, deuren), [20291318](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291318_-_RCE.jpg) (zuidoostkant, 26,2 px/m op de BAG-diameter: reservoir 4,6 tot 4,7 m, vensters), [20291316](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291316_-_RCE.jpg) en [20291319](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291319_-_RCE.jpg) (zuid- en oostkant), en [Watertoren Roermond](https://commons.wikimedia.org/wiki/File:Watertoren_Roermond.jpeg) (westdeur en zuidkant).

## Geschat en weggelaten

Geschat: de standen van de vensterkolommen (uit de onderlinge hoeken op vier foto's die elk twee kolommen tonen, ±5 graden), de hoogtes en breedtes van vensters en deuren (op foto's geschaald, ±0,2 m), het vensterpaar als één nis (het middenstijltje is dunner dan 0,9 m), de diepte van de ring binnen de dakrand (het AHN ziet hem niet; de luchtfoto toont hem), de vorm en hoogte van de lichtkap (het DSM ziet door het glas; nok uit het 3D BAG-maximum), het balkon met een dichte borstwering in plaats van een stalen hek, en de ladder als dichte strook van 0,9 m (in het echt een kooi van ongeveer 0,7 m). De voeg is dieper dan de werkelijke schaduwlijn, zodat de overgang op 1:1000 zichtbaar blijft. De derde deur die het register noemt, staat op geen enkele foto duidelijk; het model heeft er drie (west, noord en oostnoordoost, die laatste met bovenlicht).

Weggelaten (kleiner dan 0,9 m of te dun): de overloopbuizen aan het reservoir, de lampen op beugels aan de schacht en de stralen op de dakrand, de kleine raampjes naast de deuren (ongeveer 0,3 × 0,5 m), de klok of het rond plaatje op de oostkant, kabels en hekwerk rond de toren.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (factor 1,00000): schacht en reservoir hebben dezelfde doorsnede, en de voeg, de nisplafonds en de onderkanten van balkon en ladder lopen onder 56 graden. De doorsneden op 1,5, 2,3, 3, 4, 5,3, 8,2, 9,6, 9,8, 12, 14,25, 14,4 en 15 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,10–0,36 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.19173/5.99339/200/1x1/0
