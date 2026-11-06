# Watertoren Steenwijkerwold (Steenwijkerwold)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-steenwijkerwold.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één prisma van de BAG-achthoek, de gootrand, de rechtstandige onderste dakschilden en het tentdak zijn omhulsels van die achthoek (verschoven) en de top, en hoeken, lisenen, dakkapel en nissen zijn losse bouwdelen.

De watertoren van Steenwijkerwold (ook: watertoren van Tuk) aan de Oldemarktseweg is in 1931 gebouwd als eerste bouwwerk van de N.V. Waterleidingmaatschappij "Noord Overijssel", naar een ontwerp van ingenieurs van de NV v/h Butzers Beton en Waterbouw, en is verwant aan de torens van Sint Jansklooster en Raalte. Rijksmonument 508646: 35,20 m hoog, een rechte bakstenen schacht met art-decomotieven en een betonnen vlakbodemreservoir van 208 m³; de toren is nog in gebruik. Volgens het register een "gebroken, met geglazuurde pannen gedekt tentdak op rechtstandige onderste dakschilden met een in de hoeken verspringende onderrand", afgeschuinde hoeken die in tweeën zijn gedeeld met een uitgemetselde verticale vertanding over de hele schacht, een dubbele deur onder een latei in de voorgevel, drie stalen vensters op de begane grond in de overige gevels, smalle staande vensters aan alle zijden en een reeks van vijf vensters onder de dakrand.

## Bestanden

- `watertoren-steenwijkerwold.glb`: één node `building:schacht-met-schuine-hoeken-lisenen-vensters-deur-en-gebroken-tentdak`, op maaiveld.
- `watertoren-steenwijkerwold.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-steenwijkerwold-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [201853.14, 534860.69] (52,79899 N, 6,08191 O), het zwaartepunt van BAG-pand 1708100000024661; de top van het dak ligt in het AHN-DSM 0,1 m ernaast. Maaiveld AHN NAP +17,0 (DTM rondom 16,9 à 17,0). Lokale +X wijst naar RD-richting -15,93 graden (oost-zuidoost, het gemiddelde van de vier lange BAG-zijden; `xAxis` [0.9616, -0.27446]), +Y naar 74,07 graden (noord-noordoost): naar de Oldemarktseweg, de voorgevel met de deur. `groundHeight` 59,08 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 7 m (oost 59,13, west 59,09, noord 59,13, zuid 59,08); het PDOK-pand begint op 59,02. Het model vervangt BAG-pand 1708100000024661; het dichtstbijzijnde buurpand (het pomphuisje 1708100000024663, 3 m hoog) staat 12 m verderop en raakt het model niet.

## Onderdeel `building:schacht-met-schuine-hoeken-lisenen-vensters-deur-en-gebroken-tentdak`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Schacht: BAG-achthoek, zijden op 4,34 m van het hart (8,68 m breed), schuine hoeken van (4,34; 2,81) via een knik op (3,72; 3,72) naar (2,81; 4,34): de hoek is in tweeën gedeeld, zoals het register beschrijft. Metselwerk tot 29,7 m.
- Vertanding: op de knik van elke hoek een strook van 0,3 m breed en 0,12 m vooruit, van maaiveld tot onder de dakschilden.
- Lisenen: op elke hoek twee van 0,55 m breed op de buitenste einden van de twee helften, 0,25 m vooruit, van 22,4 m (onderkant schuin onder 54 graden naar de gevel, voorkant op 22,75 m) tot onder de dakschilden.
- Gootrand: 0,15 m rondom vooruit, van 29,7 tot 30,0 m, onderkant onder 45 graden.
- Rechtstandige onderste dakschilden: van 30,0 m op de gevellijn tot de knik op 31,85 m, 0,24 m ingesprongen (circa 83 graden). Boven de hoeken springt de onderrand omlaag naar 28,9 m en staat het schild 0,25 m voor de gevel, op de lisenen (onderkant 50 graden naar de gevel).
- Tentdak: van de knik op 31,85 m tot de top op 35,14 m (AHN NAP +52,14); vlakken van circa 39 graden boven de zijden en 34 graden boven de hoeken (AHN-vlakfit per sector: 40,7 tot 42,4 en 35 tot 39 graden).
- Dakkapel (luik) midden in de westgevel (-X): 1,0 m breed, voorkant 0,06 m voor de gevellijn, van de gootrand tot 31,5 m, zadeldakje van 45 graden tot 32,0 m, raam van 0,5 × 0,7 m als nis.
- Per gevel: vijf vensters onder de dakrand (0,4 × 0,6 m op 28,7 m, 0,65 m uit elkaar), drie smalle vensters (0,3 × 0,9 m op 23,35 m), vier staande vensters (0,4 m breed op 6,9, 11,7, 16,4 en 20,6 m, 1,7 à 1,8 m hoog); op de begane grond in de noordgevel (+Y) de deur (1,8 × 2,6 m), in de andere drie gevels drie vensters (0,5 × 1,1 m op 1,5 m).
- Vensters en deur zijn nissen van 0,3 à 0,35 m diep met een plafond van 56 graden.

## Bronnen en maten

- [Rijksmonumentenregister 508646](https://monumentenregister.cultureelerfgoed.nl/monumenten/508646): bouwjaar, ontwerper, hoogte 35,20 m, reservoir 208 m³, dakvorm, hoeken, deur, vensters.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Steenwijkerwold)): 1931, 35,2 m, 208 m³, nog in gebruik.
- BAG-pand 1708100000024661 (PDOK, 2026-11-06; BAG-bouwjaar 1954, dat is fout): achthoek van 8,68 m met tweedelige schuine hoeken op RD -15,93 graden.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +17,0, top +52,14, knik van de dakschilden +48,8 à 49,0, breedte van de top gelijk aan de BAG-voet (geen tapsheid), dakvlakken per sector.
- Luchtfoto (PDOK, 2026-11-06): achtzijdig tentdak met graten naar de hoeken, de weg ten noorden van de toren.
- Foto's op Wikimedia Commons: "20140416 Zicht op watertoren van Tuk2" (telelens vanuit het zuidwesten, 44,5 px/m in de uitsnede, op de AHN-top gezet: dakschilden, knik op 31,8 m, gootrand op 29,7 à 30,0 m, vensters, lisenen van 22,4 tot 28,9 m), "Overzicht watertoren - Tuk - 20350297 - RCE" (vanuit het zuidwesten: geledingen, staande vensters, dakkapel), "Overzicht watertoren - Tuk - 20350476 - RCE" (vensters op de begane grond) en "Watertoren Steenwijkerwold 07" (2007).

## Geschat en weggelaten

Geschat: alle hoogtes van de geveldelen (gootrand, onderrand van de schilden, lisenen, vensters) uit de telelensfoto en de RCE-foto, geschaald op de AHN-top en -knik (op circa 0,5 m nauwkeurig); de maten van de lisenen en de vertanding; de maat en plaats van de deur en de vensters op de begane grond (de voet is op geen enkele foto te zien; de deur staat volgens het register in de voorgevel, hier aangenomen aan de weg, +Y); dat alle vier de gevels dezelfde vensters hebben (op foto's zijn alleen de zuid-, west- en één oostelijke gevel te zien); de vensters als nissen van 0,3 à 0,5 m breed (in het echt deels smaller); de dakkapel (alleen aan de westzijde gezien, vergroot tot 1,0 m).

Weggelaten: de antennemast naast de dakkapel, de regenpijpen en de bliksemafleider, latei en raamindelingen, en het lage ondergrondse reservoir en het pomphuisje naast de toren (aparte bouwwerken).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (120 × 120 m rond de toren, `createModelBundle`) heeft geen ondersteuning bij de toren (het torenobject is precies de GLB plus de kolom van de voetafdruk tot de onderplaat) en geen PDOK-pand meer op zijn plek. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de BAG-achthoek met een tentdak tot 35,3 m) de tweedelige hoeken met vertanding en lisenen, de gootrand, de rechtstandige dakschilden met de verspringende onderrand op de hoeken, de knik naar het tentdak, de dakkapel, en op elke gevel de vijf vensters onder de dakrand, de staande en smalle vensters en op de begane grond de deur of drie vensters.

Controle-URL: http://localhost:3000/kaart/52.79899/6.08191/200/1x1/0
