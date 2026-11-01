# Watertoren Steyl (Tegelen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-tegelen-1908.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, banden, kraag, kop en dakrand zijn één omwentelingsprofiel; deur en vensters zijn nissen.

De watertoren van het Missiehuis St. Michaël van de Missionarissen van Steyl (SVD) staat op een zandheuvel in het oostelijke deel van de kloostertuin aan de Parkstraat. Ontwerp van pater P.M. Scholl SVD, gebouwd in 1909-1910 (BAG-bouwjaar 1909, bouwvergunning februari 1910) voor de stoommachines van de eigen stroomcentrale; hij levert nog steeds drinkwater aan de drie kloosters. De ronde bakstenen schacht is gemetseld als een Tegelse fabrieksschoorsteen, naar boven smaller; de kop is ijzervakwerk met steengaas en stucwerk om een stalen ketel, in 1946 na oorlogsschade hersteld. Rijksmonument 528364.

## Bestanden

- `watertoren-tegelen-1908.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een losse kop zou een eigen voet tot de grondplaat krijgen.
- `watertoren-tegelen-1908.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-tegelen-1908-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [206300.40, 372105.25], het hart van de kop: het midden tussen de cirkel door de BAG-contour van pand 0983100000000104 (r 3,2 m) en de cirkel door de rand van de kop in het AHN-DSM (r 3,3 tot 3,5 m door gemengde randpixels; de harten liggen 0,2 m uit elkaar), op maaiveld (NAP +29,45 m, AHN-DTM rond de voet; 3D BAG NAP +29,33). Assen in RD-richting (`xAxis` [1, 0]); de toren is rond, alleen deur en vensters hebben een stand. `groundSamplePoints` liggen op 4,2 m (voet r 2,65 + 1,5) in de vier windrichtingen; de toren staat vrij in het bos, er ligt geen ander BAG-pand binnen 35 m. `groundHeight` 74,16 = NAP 29,45 + 44,71 (NLGEO2018-geoïde op de oorsprong).

## Onderdeel `building:schacht-kraag-en-kop`

- Gemetselde voet van 5,3 m doorsnede tot +0,6 met een afzaat onder 55 graden.
- Ronde, taps toelopende bakstenen schacht van 5,11 m aan de voet tot 4,36 m op +22,95.
- Omlopende waterlijst halverwege: twee banden van 0,12 en 0,08 m uitsprong (+15,9 tot +16,25 en +16,45 tot +16,65), onderkanten onder 55 graden.
- Band onder de kraag (+22,6 tot +22,95, 0,1 m uitsprong) en de holle kraag (kwart-ellips) die van de schacht naar de kop uitkraagt tot +24,5.
- Gepleisterde cilindrische kop van 6,2 m tot +30,3, kroonlijst van 6,42 m (onderkant onder 55 graden) en een lage dakrand tot +31,1 (NAP +60,55, het 3D BAG-maximum) met een schuin binnenvlak naar het platte dak op +30,85 (NAP +60,3).
- Deur van 1,1 × 2,3 m op het westen, naar het klooster.
- Twee smalle vensters van 0,7 × 1,6 m per verdieping, tegenover elkaar: oost en west op +4,6 en +19,4, noord en zuid op +11,4 (de trap draait per verdieping).
- Vier raampjes van 0,7 × 1,0 m in de kop (+26,7), op elke windrichting één.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Steyl)): ontwerper, bouw, hoogte 31 m, kop met vier raampjes op de windrichtingen, twee raampjes per verdieping, kruis op het platte dak.
- [Rijksmonumentenregister 528364](https://monumentenregister.cultureelerfgoed.nl/monumenten/528364): taps toelopend op een ronde voet, omlopende waterlijst halverwege, segmentboogdeur en smalle segmentboogvensters, uitkragend reservoir met plat dak en enkele rechthoekige vensters, getuid opengewerkt kruis. Het register noemt een reservoir van ongeveer 5 m; BAG, AHN en de maattekening geven 6,2 tot 6,4 m.
- Maattekening op het informatiebord bij de toren ([Commons](https://commons.wikimedia.org/wiki/File:Watertoren_met_uitleg_werking_2024.jpg)): voet Ø 5,11, schacht boven Ø 4,36, waterlijst Ø 4,54, kop Ø 6,20, dakrand Ø 6,42; hoogteverhoudingen verticaal geschaald op het dak in het AHN (21,65 px/m).
- BAG-pand 0983100000000104 (PDOK, ‘Pand in gebruik’, bouwjaar 1909, 32,6 m²): de omtrek van de kop.
- 3D BAG (AHN5, 2024): dak mediaan NAP +60,31, maximum +60,56.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): dak NAP +60,3, maaiveld NAP +29,4 tot +29,5; de schacht zit in het DSM onder de kop en in de bomen.
- Luchtfoto 8 cm (PDOK): lichte dakrand om het platte dak met het kruis.
- Foto's [Tegelen Steyl Watertoren 5893](https://commons.wikimedia.org/wiki/File:Tegelen_Steyl_Watertoren_5893.JPG) (kop, holle kraag, band eronder, waterlijst, venster en raampje op dezelfde as) en RCE [20321110](https://commons.wikimedia.org/wiki/File:Exterieur_watertoren_Missiehuis_-_Steijl_-_20321110_-_RCE.jpg) (deur, verhoudingen, zandheuvel).

## Geschat en weggelaten

Geschat: de hoogtes van voet, banden, kraag, kop en vensters (uit de maattekening op een schuin gefotografeerd bord, verticaal geschaald op het AHN-dak, ±0,3 m), de vorm van de holle kraag (kwart-ellips naar de foto), de uitsprong van de banden en de kroonlijst (vergroot tot 0,08 tot 0,12 m zodat ze op 1:1000 zichtbaar blijven), de hoogte van de dakrand (3D BAG-maximum), de standen van deur en vensters (deur naar het klooster op het westen; vensters tegenover elkaar, per verdieping een kwartslag gedraaid zoals de trap op de tekening; het venster op de bovenste verdieping staat op de foto op dezelfde as als een raampje van de kop) en de maten van vensters en raampjes (±0,2 m).

Weggelaten (kleiner dan 0,9 m of te dun): het getuide, opengewerkte metalen kruis met lichtband op het dak en het hek op de dakrand, de verticale naad en de leiding langs de kop, de bliksemafleider. Ook de zandheuvel staat niet in de GLB: die zit al in het PDOK-terrein.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met factor 1,0041: alleen het bovenste deel van de holle kraag (+23,7 tot +24,5), waar die bijna vlak naar de kop uitkraagt. De doorsneden op 1, 5,4, 12,2, 16,1, 16,55, 20,2, 22,8, 23,2, 23,6, 25, 27,2, 30,4, 30,9 en 31 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt steun onder het bovenste deel van de holle kraag en splinters in de vensternissen. Op de kaart staat de toren op de zandheuvel met de voet 0,09–0,24 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.33585/6.12336/200/1x1/0
