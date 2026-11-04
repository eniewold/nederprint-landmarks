# Watertoren Assendelft (Assendelft)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-assendelft.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, waterlijst, fries en lijst zijn omwentelingsvormen met kragen van 45 graden, de kop is een twaalfzijdig prisma met pilasters en banden als convexe bouwdelen, en het dak bestaat uit twaalf vlakken.

De watertoren van Assendelft (Zaanstad) is in 1885 gebouwd naar ontwerp van D. de Leeuw, oorspronkelijk 31,4 m hoog met een reservoir van 540 m³. In de jaren twintig zijn het reservoir en het dak verwijderd en kreeg de toren een veel grotere en hogere kop met een betonnen reservoir van 1200 m³ (Wikipedia: 41,85 m). Nu zitten er kantoren in, met bovenin horeca. Een ronde bakstenen schacht met lisenen, een waterlijst boven de onderbouw, drie rijen rondboogvensters en bovenaan een fries van gele boogjes onder een uitkragende lijst; daarop de twaalfzijdige kop met betonnen hoekpilasters, twee betonnen banden, smalle lichtspleten en een zwaar overstekende kroonlijst.

## Bestanden

- `watertoren-assendelft.glb`: één node `building:ronde-schacht-met-twaalfzijdige-kop`, op het maaiveld.
- `watertoren-assendelft.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-assendelft-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [112673.82, 497676.12] (52,46520 N, 4,76438 O), het middelpunt van de ronde BAG-contour (cirkelfit straal 8,12 m op 1 cm), op maaiveld (AHN-DTM in een ring van 10 tot 16 m NAP -0,06 tot +0,99, mediaan +0,46; gebruikt +0,3). Lokale +X is RD-oost (`xAxis` [1, 0]); de kop heeft een gevel recht op elke hoofdrichting (luchtfoto), dus hoekpilasters op 15 + 30k graden. Het PDOK-maaiveld aan de noordzijde (parkeerterrein) ligt 0,3 m lager dan aan de andere kanten; de `groundSamplePoints` liggen daarom oost, west, zuid en zuidwest op 11 m van het hart, en `groundHeight` 43,10 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (43,10 tot 43,85; noordzijde 42,81). De voet loopt 0,8 m door onder het nulpunt, zodat hij ook aan de noordzijde in het terrein staat. Het model vervangt BAG-pand 0479100000003917, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:ronde-schacht-met-twaalfzijdige-kop`

- Onderbouw r 8,12 m (BAG) tot 6,0 m, daarboven de schacht r 7,95 m (foto: 3,4 % smaller) tot de lijst.
- Waterlijst r 8,42 m van 6,0 tot 7,3 m met een kraag van 45 graden.
- Tien lisenen van 0,6 m breed en 0,2 m uit, over onderbouw en schacht tot het fries, tussen de traveeën.
- Per travee drie vensters als nis van 0,3 m diep met een plafond onder 56 graden: 0,9 m breed, van 1,0 tot 3,2, 9,1 tot 12,2 en 15,8 tot 18,8 m; in één travee onderin de deur van 1,7 m breed van 1,2 tot 4,1 m.
- Fries r 8,1 m van 21,2 tot 24,0 m en lijst r 8,3 m van 24,0 tot 24,8 m, elk met een kraag van 45 graden.
- Kop: twaalfhoek van 8,3 m over de hoeken van de lijst tot de kroonlijst; twaalf hoekpilasters van 1,3 m breed en 0,3 m uit met een voet van 45 graden; smalle band (0,2 m uit) van 26,1 tot 27,0 m en brede band (0,42 m uit) van 28,3 tot 30,0 m, beide met een kraag van 45 graden.
- Kroonlijst: twaalfhoek van 9,7 m over de hoeken (19,4 m, luchtfoto en DSM), overstek onder 45 graden vanaf 37,1 m, voorkant van 38,5 tot 39,4 m.
- Twaalfzijdig tentdak met helling 0,30 van 9,2 m over de hoeken op 39,3 m tot 1,5 m op 41,71 m, en een rond opbouwtje van 2,6 m doorsnede tot 43,3 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Assendelft)): bouwjaar, architect, 41,85 m, 1200 m³, de oorspronkelijke toren van 31,4 m en de nieuwe kop uit de jaren twintig.
- BAG-pand 0479100000003917 (BGT G0479.2e2bbf7742ff00fee0530a324301a3ef, PDOK, 2026-11-04): ronde voet van 16,24 m.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld; kroonlijst NAP +39,4 tot +40,0 op 9 tot 10 m van het hart; tentdak NAP +40,44 op 6,5 m en +41,76 op 2,5 m; opbouwtje NAP +43,6 binnen 1 m (3D BAG `b3_h_dak_max` 43,55). Aan de west- en zuidwestzijde heeft het DSM geen data bij de kop. Luchtfoto (8 cm): twaalf zijden van de kop, kroonlijst 19,4 m over de hoeken, de graten van het tentdak en het ronde opbouwtje.
- Foto's op Wikimedia Commons: "Fiat Topolino C Giardiniera" (Joost J. Bakker; vrijwel frontaal met een gevel van de kop recht naar de camera: alle geledingen, lineair geschaald tussen maaiveld en kroonlijst op 23,35 px/m, en de stand van vensters en lisenen), "Watertoren Assendelft.JPG" en "Watertoren assendelft2.jpg" (schuin van onderen: pilasters, banden, fries, kroonlijst en de opbouw op het dak).

## Geschat en weggelaten

Geschat: alle hoogtes van geledingen, vensters en deur uit één frontale foto met een lineaire schaal tussen maaiveld en kroonlijst; de diameter van de schacht boven de waterlijst en van de kop; de uitsteek van lisenen, banden, pilasters en fries; de hoek van het overstek (45 graden, de foto toont het overstek van 37,1 tot 38,5 m). De draaiing van de tien traveeën ten opzichte van de kop (vensters op -2,5 + 36k graden) en de travee met de deur volgen uit de stand op de foto, maar de kijkrichting van die foto is niet bekend; ook de stand van de kop (gevels op de RD-assen) is binnen enkele graden geschat uit de luchtfoto.

Weggelaten: de smalle lichtspleten in de kop (circa 0,55 m breed) en de kleine luikjes in de schacht (smaller dan 0,9 m), de gele boogjes en sierblokken in het fries (reliëf van enkele centimeters, het fries staat als band), de kapitelen van de pilasters onder de kroonlijst (in het overstek), het hekwerk op de dakrand, antennes en de stalen buitentrap naar de deur. Het lage gebouwtje aan de voet op oudere foto's staat niet meer in de BAG.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: waterlijst, fries, lijst, banden en kroonlijst met een kraag van 45 graden, pilasters met een voet van 45 graden en nisplafonds onder 56 graden. Via `createModelBundle` op een uitsnede van 80 m staat het model compleet op het PDOK-maaiveld (voet 0,4 m in het terrein aan de noordzijde tot 1,5 m aan de zuidwestzijde, top op ellipsoïdisch 86,40, gelijk aan het PDOK-dak), zonder ondersteuningsobject; de PDOK-reconstructie van het pand is verborgen en de buurpanden (0479100000003110 en 0479100000003114) zijn lage loodsen die niets van de toren meenamen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rond prisma met een tentdak en een blokje) de waterlijst, de lisenen en vensternissen, het fries met lijst, de twaalfzijdige kop met pilasters en twee banden, en de overstekende kroonlijst.

Controle-URL: http://localhost:3000/kaart/52.46520/4.76438/200/1x1/0
