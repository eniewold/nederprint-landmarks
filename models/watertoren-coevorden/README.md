# Watertoren (Coevorden)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-coevorden.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: één omwentelingsprofiel voor voet, schacht, fries, kraag en reservoir, een tentdak als omhulsel van twee zestienhoeken, dakkapellen en lantaarn als prisma's en omhulsels.

De watertoren is in 1914 gebouwd naar ontwerp van J.P. Hazeu, 32,2 m hoog met een reservoir van 150 m³, en staat op het hoogste punt van het Van Heutszpark binnen de vestinggracht (rijksmonument 468592).

## Bestanden

- `watertoren-coevorden.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse reservoir- of daknode zou een voet tot de grondplaat krijgen.
- `watertoren-coevorden.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-coevorden-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [246787.11, 520566.99], het middelpunt van de ronde BAG-contour van pand 0109100000006543 (straal 3,9 m), op maaiveld (NAP +11,4 m). De deur met de stoep ligt naar -Y, op 242 graden linksom van RD-oost (zuidwest), waar de stoep op de luchtfoto naast de voet ligt; `xAxis` [0.8829, -0.4695]. De dakkapellen staan boven de deur en op 90, 180 en 270 graden daarvan, zoals op de luchtfoto. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:voet-schacht-reservoir-en-tentdak`

- Donkere plint (straal 4,0 m) tot +0,5, gepleisterde licht verjongende voet van 7,8 naar 7,5 m tot de cordonlijst (+6,0 tot +6,45, schuin naar de schacht op +6,85). Deur met boog en een stoep van twee treden aan de voorzijde, kleine vensters boven in de voet voor en opzij.
- Verjongende bakstenen schacht van 6,9 naar 6,0 m doorsnede tot +16,5, met smalle getoogde vensters (nissen van 0,8 m met spitse top) verspringend zoals het trappenhuis: midden voor en achter op +9,9, op ±50 graden op +7,0 en +13,8.
- Fries van twintig boognissen tussen een band op +16,5 en een lijst tot +18,95 (de vier in de windrichtingen zijn in het echt vensters).
- Kwartholle kraag van straal 3,15 naar 4,1 m tussen +18,95 en +20,45, reservoir van 8,2 m met acht langwerpige vensters (+23,2 tot +25,0) tot +25,95, kroonlijst van 9,1 m tot +26,7.
- Zinken tentdak in zestien banen naar de lantaarn op +30,4, vier frontonvormige dakkapellen van 1,8 m met een venster in het fronton (top +30,05), lantaarn van 2,3 m met acht vensters, uitlopende kap tot +32,2 en de naald als spits tot +34,8.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Coevorden)) en [Rijksmonumentenregister 468592](https://monumentenregister.cultureelerfgoed.nl/monumenten/468592): bouwjaar, architect, 32,2 m, 150 m³, beschrijving van basement, verjongende schacht met getoogde vensters, fries van boognissen, kwarthol uitkragend reservoir, tentdak met vier frontonvormige dakkapellen en lantaarn met opengewerkte naald.
- BAG-pand 0109100000006543: ronde contour van 7,8 m.
- Frontale RCE-foto [20322147](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_voorzijde_-_Coevorden_-_20322147_-_RCE.jpg), van veraf met rechte verticalen, geschaald op de BAG-doorsnede van de voet (50 px/m bij 1028 px breed): alle hoogtes en stralen. De lantaarnkap komt daarmee op 32,2 m, gelijk aan het AHN.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP +11,36, top NAP +43,6 (32,2 m boven maaiveld). De rest van het DSM is rond de toren vervuild door parkbomen en heeft gaten op het zinken dak; het is alleen als controle van de top en de reservoirstraal (circa 4,1 m) gebruikt.
- Luchtfoto 8 cm (PDOK): richting van de stoep, de vier dakkapellen en de banen van het zinken dak.
- Verder [Watertoren Coevorden.jpg](https://commons.wikimedia.org/wiki/File:Watertoren_Coevorden.jpg) en [Watertoren Coevorden 2.JPG](https://commons.wikimedia.org/wiki/File:Watertoren_Coevorden_2.JPG).

## Geschat en weggelaten

Geschat uit foto's: alle hoogtes en stralen (één schaalfactor), de vorm van de kwartholle kraag (kwart ellips), het aantal boognissen in het fries (twintig) en reservoirvensters (acht), de plaats van de schachtvensters aan de achterzijde (gespiegeld van de voorzijde), het aantal dakbanen (zestien, van de luchtfoto), de maat van dakkapellen en lantaarn. Vensters van 0,5 tot 0,6 m zijn als nis van 0,6 tot 0,8 m breed gemaakt, met een spitse top in plaats van een rondboog.

Weggelaten (kleiner dan 0,9 m of te dun): windwijzer en het open werk van de naald, de gevelsteen, schijnvoegen in het pleisterwerk, de rode hanekammen boven de vensters, deur- en raamroeden, lantaarnpaal en hekjes.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 5 % (onder het steile deel van de kraag, de kroonlijst en de lantaarnkap) en blijven de doorsneden op 3, 12, 17,5 en 23,5 m gelijk. In een preview-export op 1:1000 (100 × 100 m rond de toren) staat alleen een dunne rand onder de kraag als ondersteuning. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,22 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.66481/6.74397/200/1x1/0
