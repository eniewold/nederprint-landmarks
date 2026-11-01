# Watertoren Oranje Nassaumijnen (Heerlen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-heerlen-oranje-nassaumijnen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, band, kroonlijst, kegeldak en kap zijn één omwentelingsprofiel; vensters, boogjes, panelen en deur zijn nissen.

De Watertoren Oranje Nassaumijnen, ook Nieuwe Watertoren, staat op het terrein van de voormalige steenkolenmijn Oranje Nassau I, naast station Heerlen Woonboulevard. Hij is in 1952 gebouwd, 35 m hoog met een reservoir van 630 m³, en sinds 2006 buiten bedrijf.

## Bestanden

- `watertoren-heerlen-oranje-nassaumijnen.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een losse kroonlijst of kap zou een voet tot de grondplaat krijgen.
- `watertoren-heerlen-oranje-nassaumijnen.json`: catalogusitem met RD-oorsprong, `xAxis`, acht maaiveldpunten, `groundHeight` en het vervangen BAG-pand.
- `watertoren-heerlen-oranje-nassaumijnen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [195339.08, 323001.34], het hart in het AHN (cirkelfit per hoogte), op maaiveld aan de lage zuidkant van de voet (NAP +107,5 m). De BAG-contour van pand 0917100000030863 is een zuivere cirkel met straal 6,48 m (de kroonlijst) en ligt 0,27 m daarvandaan. Assen in RD-richting (`xAxis` [1, 0]). De toren staat op een licht hellend terrein: de voet loopt op tot NAP +107,8 aan de noordkant en verder naar het noordoosten zakt het terrein tot circa NAP +105,3. Daarom staan er acht `groundSamplePoints` op 7,9 m van het hart (de lader neemt de laagste) en loopt de schacht 1,0 m onder het maaiveld door (`BASE` −1,0), zodat de voet aan de lage kant niet zweeft. `groundHeight` 153,23 is het ellipsoïdische maaiveld (NAP +107,5 plus de NLGEO2018-geoïdehoogte 45,73 m). Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-boogfries-kroonlijst-en-dak`

- Ronde bakstenen schacht, licht verjongend van 12,7 m aan de voet naar 12,0 m onder de band (0,011 m per m).
- Trappenhuisvensters: kleine rondboogvensters van 0,65 × 1,3 m in vier kolommen (oost, zuid, west, noord), om en om 3,1 m verspringend: oost en west op 10,5, 16,6 en 22,8 m, zuid en noord op 7,2, 13,3, 19,5 en 25,9 m.
- Deur van 1,3 × 2,5 m naar het zuidzuidwesten, naar het pad langs het spoor.
- Bovenaan een 0,15 m uitkragende band (onderkant onder 56 graden, 32,46 m) met een rondboogfries van dertig boogjes van 1,0 m (steek 1,26 m, aanzet 32,67 m). Elk derde boogje heeft een getralied rondboogvenster van 0,75 m breed (31,54 tot 32,79 m), met daaronder een blind paneel van 29,57 tot 31,6 m.
- Kroonlijst van 12,96 m, onderkant onder 56 graden van 33,33 tot 33,85 m, rand tot 34,1 m (AHN-dakrand NAP +141,6).
- Vlak kegeldak van circa 9 graden (AHN 0,157 m per m) naar een ventilatiekap van 1,1 m met een deksel van 1,74 m, onderkant onder 56 graden, tot 36,32 m (AHN-top NAP +143,82).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Heerlen_Oranje_Nassaumijnen)): bouwjaar 1952, 35 m, 630 m³, buiten bedrijf sinds 2006.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de voet NAP +107,45 tot +107,84, dakrand NAP +141,6 (34,1 m), kegeldak van 9 graden, kap met top NAP +143,82 (36,3 m), buitenstraal van de dakrand 6,4 tot 6,5 m (de rand is in het DSM over circa 1 m uitgesmeerd).
- BAG-pand 0917100000030863 (PDOK): cirkel met straal 6,48 m, bouwjaar 1960 in de BAG.
- Luchtfoto (PDOK, 8 cm): rond dak met radiale naden en de kap, trappenhuisvensters in schuine rijen aan de zuid- en oostkant.
- Foto [Heerlen Watertoren 3808](https://commons.wikimedia.org/wiki/File:Heerlen_Watertoren_3808.JPG), bijna frontaal: kroonlijst, rondboogfries met dertig boogjes en tien vensters, blinde panelen, trappenhuisvensters, kap en verjonging, geschaald op de kroonlijst van 12,96 m en de dakrand in het AHN (30,5 px/m).
- NLGEO2018: geoïdehoogte 45,73 m op de oorsprong.

## Geschat en weggelaten

Geschat: de verjonging van de schacht (de foto is van onderen genomen; de breedte onder de band, 12,0 m, is geschaald op de kroonlijst, de voet is doorgetrokken), de stand van het fries en de tien vensters (niet bekend, gelijk aan de oostelijke vensterkolom), de kolommen van de trappenhuisvensters (de foto toont er twee, circa 95 graden uit elkaar en 3,1 m verspringend; de andere twee zijn gespiegeld aangenomen), de richting en maat van de deur (geen foto van de voet; naar het pad langs het spoor), het profiel van de kroonlijst (op de foto een zware ronde lijst van circa 0,6 m) en de maten van de kap.

Weggelaten (kleiner dan 0,9 m of te dun): de antennes en kabelgoten op de schacht, de paaltjes op de dakrand, de kraagsteentjes van het fries als losse vormen (ze blijven als 0,26 m brede strookjes tussen de boogjes staan), de tralies in de vensters, de geschilderde plint en een kastje aan de zuidoostkant van de voet.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,00000): band, kroonlijst en deksel hebben onderkanten van 56 graden en alle nissen een plafond dat onder 56 graden naar binnen oploopt. De doorsneden op 1,5, 10,5, 19,5, 30,5, 32, 32,3, 32,6, 33, 33,6, 34,05 en 36 m (deur, vensters, panelen, band, boogjes, kroonlijst, kap) blijven gelijk. Geen buurpanden die het model raken (het dichtstbijzijnde BAG-pand ligt circa 50 m verder). Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,15–0,38 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/50.89528/5.96028/200/1x1/0
