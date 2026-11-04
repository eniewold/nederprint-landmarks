# Oude watertoren (Hilversum)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hilversum-oude-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: basement, schacht, banden en kroonlijsten zijn één omwentelingsprofiel, de lisenen, kapitelen en nissen zijn bouwdelen in een afgerold gevelstelsel die op de ring worden gebogen, en het tentdak is een twaalfzijdige piramide.

De watertoren aan de Jacobus Pennweg 16 op de Trompenberg is in 1893 gebouwd voor de Utrechtsche Waterleiding Maatschappij naar ontwerp van de Compagnie Générale des Conduites d'Eau uit Luik, in neoromaanse stijl; rijksmonument 522815, één reservoir van 600 m³ en 10 m doorsnede, 24,5 m hoog (Wikipedia). In 1944 beschadigd, in 2000 in de oude staat hersteld. Een ronde bakstenen toren: een iets breder basement met deur en getoogde vensters onder een natuurstenen kroonlijst; daarboven tien lisenen met kapitelen die rondbogen dragen (een blinde arcade van tien traveeën met om en om een smal rondboogvenster), een tandlijst, een rondboogfries, een band met oculi en een kroonlijst; bovenop een twaalfzijdig leien tentdak achter een vlakke rand, met een zinken makelaar.

## Bestanden

- `watertoren-hilversum-oude-watertoren.glb`: één node `building:basement-arcade-friezen-en-tentdak`, op het maaiveld.
- `watertoren-hilversum-oude-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hilversum-oude-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [139746.22, 471809.12] (52,23414 N, 5,16391 O), het hart van de ronde BAG-contour van pand 0402100001485425 (cirkel r 5,94 m, afwijking 6 cm; de BGT-contour is gelijk), op maaiveld (AHN-DTM NAP +25,65 tot +25,84 tussen 9 en 12 m van het hart, gebruikt +25,77; 3D BAG 25,74). Lokale +X wijst naar de deur, naar het westen: 174 graden linksom vanaf RD-oost (`xAxis` [-0.99452, 0.10453]). Die richting is geschat uit de RCE-foto 20284790, genomen vanaf het kruispunt in het noordwesten (het BP-station staat rechts): de deur staat 30 graden rechts van het hart, en de stand van de lisenen en vensters volgt daaruit; onzeker op circa 15 graden. `groundHeight` 68,97 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de acht `groundSamplePoints` op 7,5 m van het hart (68,97 tot 69,12). Het model vervangt BAG-pand 0402100001485425; de PDOK-panden ernaast (0402100001485419, 0402100001485424, 0402100001503982, 12 m en verder van de toren) liggen op hun AHN-hoogte en hebben niets van de toren meegenomen.

## Onderdeel `building:basement-arcade-friezen-en-tentdak`

- Basement r 5,94 m (BAG) tot 3,94 m, kroonlijst r 6,08 m op een kraag van 45 graden tot 4,55 m, waterslag naar de schacht op 4,78 m.
- Deur in de westelijke travee: 1,6 m breed, 3,1 m hoog met rondboog (bovenlicht), 0,35 m diep. Getoogde vensters van 1,1 m (0,5 tot 2,55 m), 0,3 m diep, in de vijf traveeën ertussen.
- Schacht r 5,65 m (lisenen en wand boven de bogen) met tien lisenen van 1,1 m; daartussen een blinde arcade 0,2 m diep (achterwand r 5,45) met rondbogen van 4,78 tot de aanzet op 11,77 m en de top op 13,0 m.
- Kapitelen op de lisenen: 1,3 m breed, 0,15 m voor de lisene, van 10,55 tot 11,77 m, kraag van 45 graden eronder.
- Smalle rondboogvensters (0,6 m breed, 7,1 tot 10,15 m, 0,25 m diep) in de achterwand van de deurtravee en om en om de travee (vijf).
- Tandlijst r 5,75 m van 13,55 tot 14,2 m; rondboogfries van twintig nissen van 0,85 m (14,35 tot 15,58 m, 0,2 m diep); band r 5,73 m van 15,76 tot 15,95 m; tien achthoekige oculi van 0,84 m boven het hart van de traveeën op 16,4 m.
- Kroonlijst r 5,85 m op een kraag van 45 graden van 16,95 tot 17,15 m, tot de gevelrand op 17,77 m (3D BAG NAP +43,54).
- Tentdak: twaalfhoek met hoekpunten op r 4,95 m op de gevelrand (vlakke rand van 0,9 m tot de kroonlijst), helling 45 graden tot de top op 22,55 m (NAP +48,32); achtkante makelaar van 0,9 m dik tot 23,7 m en een punt tot 25,25 m (AHN NAP +51,07).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Oude_watertoren_(Hilversum)): bouwjaar, ontwerper, 24,5 m, reservoir van 600 m³ en 10 m, herstel in 2000.
- [Rijksmonumentenregister 522815](https://monumentenregister.cultureelerfgoed.nl/monumenten/522815).
- BAG-pand 0402100001485425 en BGT-pand G0402.410674483c8e459fac56575b5a7fa756 (PDOK, 2026-11-04): ronde contour r 5,94 m.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP +25,77; gevelrand en vlakke rand NAP +43,5 tot 43,6; tentdak 1,0 m per m tussen r 1 en 4,5 m (45 graden); makelaar tot NAP +51,07; de buitenrand in het DSM op r 6,05 (0,25 m uitloop van de 0,5 m-cellen). 3D BAG (AHN5 2023): dak_min 43,54, dak_max 48,2, maaiveld 25,74. Luchtfoto: twaalf dakvlakken en de vlakke rand.
- Foto's op Wikimedia Commons: "Exterieur OVERZICHT - Hilversum - 20284790 - RCE" (frontaal vanaf het noordwesten met de deur: geledingen met een lineaire schaal tussen maaiveld en gevelrand, breedteverhoudingen schacht 0,944 en kroonlijst 0,978 van het basement, stand van lisenen, vensters en deur), "Hilversum Watertoren 8441" en "522815-Oude watertoren" (schuin: basement met kroonlijst, arcade, friezen, oculi, tentdak en makelaar).

## Geschat en weggelaten

Geschat: de stand van de deur en de traveeën (uit één foto, circa 15 graden), de straal van schacht en kroonlijst uit breedteverhoudingen op die foto, alle hoogtes van de geledingen tussen maaiveld en gevelrand uit dezelfde foto (lineair geschaald op de gevelrand van de 3D BAG), de maten van deur, vensters, nissen en kapitelen, het uitsteken van lisenen (0,2 m), kapitelen, tandlijst en banden, de stand van de twaalf dakvlakken (een hoekpunt naar de deur) en de vorm van de makelaar. De smalle vensters zijn 0,6 m breed gemaakt (in het echt circa 0,45 m) en het rondboogfries heeft twintig nissen van 0,85 m in plaats van circa veertig van 0,5 m, zodat de penanten 0,93 m breed blijven.

Weggelaten: de natuurstenen banden in de lisenen, de panelen in de kapitelen, het visgraatfries en de waterlijst onder de kroonlijst van het basement, de tandjes van de tandlijst, de smeedijzeren ankers tussen de oculi en de windvaan en bol op de makelaar (alle kleiner dan 0,9 m of in het vlak van de gevel), en het hek rond het terrein.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (verhouding 1,0000000): kroonlijsten, banden en kapitelen staan op een kraag van 45 graden, de nisplafonds lopen onder 56 graden op, tentdak en makelaar lopen naar binnen op. Via de exportlader en `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet op het PDOK-maaiveld (voet 0,3 tot 0,6 m in het terrein), zonder ondersteuning. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een grof kegeldak) het bredere basement met kroonlijst, deur en vensters, de blinde arcade met lisenen, kapitelen en smalle vensters, de tandlijst, het rondboogfries, de oculi, de kroonlijst met de vlakke rand en het twaalfzijdige tentdak met makelaar.

Controle-URL: http://localhost:3000/kaart/52.23414/5.16391/200/1x1/0
