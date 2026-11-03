# Watertoren Spaklerweg (Amsterdam)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-amsterdam-spaklerweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint en schacht zijn één omwenteling van een radiaal profiel, de kraag, behuizing en kroonlijst verlopende tienhoeken, de koepel en die van het torentje convexe omhulsels van tienhoeken, frontons en dakkapellen convexe blokken met een spitse top; vensters, wijzerplaten, de vakken van het torentje en de deur zijn nissen.

De watertoren van de Zuidergasfabriek aan de Spaklerweg (nu in het Bella Vistapark) is in 1910-1911 gebouwd door aannemer J.L. Seeuwen; of hij hem ook ontwierp, wordt betwijfeld (mogelijk Publieke Werken). Rijksmonument 526948, 41,5 m hoog volgens het register (Wikipedia: 45 m, met de bliksemafleider), oorspronkelijk 210 m³ in drie compartimenten. Eclectische neorenaissance in helderrode baksteen met natuursteen en gele siersteen: een ronde, taps toelopende schacht op een natuurstenen plint, een uitkragende tienzijdige reservoirbehuizing, vier wijzerplaten, een tienzijdige loodgedekte koepel met een koepeltorentje op pilasters en een bol met een sierlijke kroon. De toren staat leeg.

## Bestanden

- `watertoren-amsterdam-spaklerweg.glb`: één node `building:ronde-schacht-tienzijdige-behuizing-en-koepel`, op het maaiveld.
- `watertoren-amsterdam-spaklerweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-amsterdam-spaklerweg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [122905.04, 483489.12]: het midden van BAG-pand 0363100012189540 (een cirkel van 9,8 m) 0,1 m naar het westen en 0,3 m naar het zuiden geschoven naar het midden van de behuizing en de top in het AHN-DSM, op maaiveld (AHN-DTM NAP +0,76 tot +0,90 in een ring van 6 tot 12 m; gebruikt +0,86). De tienhoek staat met een vlak op noord en zuid (luchtfoto: de zuidrand van de kroonlijst ligt recht oost-west), dus met de hoeken op oost en west; lokale +X is oost (`xAxis` [1, 0]). `groundHeight` 43,89 is NAP +0,86 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,03 m); de PDOK-terreintegel geeft rond de toren 43,86 tot 43,93. Het model vervangt het pand, zodat het PDOK-blok (een cilinder met een scheef afgeknipte top) verdwijnt.

## Onderdeel `building:ronde-schacht-tienzijdige-behuizing-en-koepel`

- Natuurstenen plint: rond, 9,9 m, tot 2,3 m met een bovenrand onder 45 graden naar de schacht.
- Schacht: rond, van 9,4 m op 2,55 m taps naar 8,4 m op 26,0 m.
- Banden 0,08 tot 0,12 m uit met een onderkant onder 45 graden: siertegelfries 6,4 tot 7,6 m, smalle band 17,4 tot 17,8 m, boogfries 24,6 tot 25,4 m.
- Vensters in acht richtingen (om de 45 graden vanaf de ingang) als nis van 0,3 m: rondboogvensters 1,0 bij 2,6 m (3,0 tot 5,6 m; niet boven de deur), middelste laag 11,6 tot 14,4 m en bovenste laag 21,8 tot 24,0 m; de rondbogen als spitse top onder 50 graden.
- Kraag van de ronde schacht (r 4,2 op 26,0 m) naar de tienhoek (hoekstraal 4,7 m) op 27,3 m.
- Tienzijdige behuizing tot 32,0 m met een rechthoekig venster van 1,3 bij 2,2 m per vlak (28,4 tot 30,6 m) en een kroonlijst die onder 45 graden uitkraagt tot hoekstraal 4,9 m, bovenkant 32,6 m.
- Vier frontons met wijzerplaat (oost-noordoost, noord, west-zuidwest en zuid): 2,4 m breed, 0,1 m voor de behuizing, van 31,0 tot 33,9 m met een spitse top tot 34,8 m; wijzerplaat als twaalfhoekige nis van 1,6 m op 33,0 m.
- Tienzijdige koepel van de kroonlijst tot 36,55 m (hoekstraal 4,6 op 32,55, 3,05 op 35,2, 1,55 op 36,45) met op de zes andere vlakken een dakkapelletje van 1,0 m breed (34,0 tot 35,2 m, puntdakje tot 35,8 m).
- Koepeltorentje: tienhoek met hoekstraal 1,5 m van 36,45 tot 38,8 m, tien open vakken van 0,5 m tussen de pilasters als nis, kroonlijst tot 39,2 m en een koepeltje tot 40,55 m.
- Bekroning: hals van 0,84 m, bol (onderkant onder 45 graden) van 1,1 m en een kroon tot de top op 42,28 m.
- Hoofdingang: natuurstenen portaal van 3,0 m breed, 0,35 m voor de plint, tot 4,6 m met een spitse top tot 5,4 m, en een deur van 1,8 m breed met een spitse top tot 3,8 m (nis van 0,6 m), naar het zuidwesten.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Amsterdam_Spaklerweg)): bouwjaar, aannemer, 45 m, 210 m³ in drie compartimenten, materialen.
- [Rijksmonumentenregister 526948](https://monumentenregister.cultureelerfgoed.nl/monumenten/526948): 41,5 m, ronde voet, taps toelopend, uitkragende tienzijdige reservoirbehuizing, tienzijdige loden koepel, koepeltorentje op pilasters met bol en kroon, vier wijzerplaten, rondboogvensters onderaan, rechthoekige vensters elders, friezen en blokkenkroonlijst.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld NAP +0,86, top NAP +43,14 (42,28 m), buitenring van de kroonlijst 32,3 tot 33,1 m, koepel r 3 op 35,1 en r 2 op 36,3 m, torentje r 1 op 40,2 m; behuizing 9,0 tot 9,5 m breed.
- BAG-pand 0363100012189540 (cirkel van 9,8 m) en luchtfoto (PDOK): diameter van de voet en de stand van de tienhoek.
- Foto's op Wikimedia Commons: "BellavistaPark - Watertoren Zuidergasfabriek" (frontaal: vensterlagen, friezen, kraag, verhouding schacht en behuizing), "WATERTOREN van de Zuidergasfabriek", "Watertoren van de Zuidergasfabriek" (frontons, dakkapellen, torentje), "51 watertoren, spaklerweg - WLM 2011 - drobm" (behuizing, koepel) en "2021 Bella Vistapark, Asd-Watertoren" (ingang met natuurstenen portaal), geschaald op de BAG-diameter en de AHN-hoogtes.

## Geschat en weggelaten

Geschat: de hoogtes van plint, banden, vensterlagen en kraag en de versmalling van de schacht (foto's, gecorrigeerd voor het perspectief), de hoekstraal van de behuizing tussen DSM en foto's, het koepelprofiel tussen de AHN-punten, de maten van frontons, dakkapellen, torentje en bol, en de richtingen: de frontons met wijzerplaat (vier van de tien vlakken, zo goed als mogelijk om de 90 graden), de dakkapellen op de zes andere vlakken, de hoofdingang naar het zuidwesten (het pad op de luchtfoto) en de vensters om de 45 graden vanaf de ingang. Het torentje is open op pilasters; in het model zijn de vakken nissen.

Weggelaten: de consoles onder de kraag en de blokjes van de kroonlijst, de gele sierpanelen in de behuizing, de pinakels op de hoeken van de kroonlijst en de voluten van de frontons (kleiner dan 0,9 m), de kleine houten deur in de plint, de bliksemafleider, de windvaan en de antennes.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet merkbaar (gemeten 1,0000000): plint, banden, kraag, kroonlijsten en bol staan onder 45 graden, de nisplafonds onder 56 en de koepels zijn convex. Een exportcontrole met `loadLocalLandmarkMeshes` op een uitsnede van 90 m plaatste het model compleet op het PDOK-maaiveld. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een scheef afgeknipt dak) de plint, de taps toelopende schacht met vensterlagen en banden, de kraag, de tienzijdige behuizing met vensters en kroonlijst, de frontons met wijzerplaat, de koepel met dakkapellen, het torentje met bol en kroon en de ingang.

Controle-URL: http://localhost:3000/kaart/52.33839/4.91626/200/1x1/0
