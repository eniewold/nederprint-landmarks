# Watertoren Barendrecht (Barendrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-barendrecht.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: erkers, schacht, balkons, consoles, dakkapellen, reservoir, hoekpijlers, daken, filtertoren en trouwzaal zijn benoemde prisma's, hulls en omwentelingsvormen; vensters en deuren zijn blinde nissen.

De watertoren werd in 1912 gebouwd naar ontwerp van Roelof Kuipers, in overgangsstijl met elementen uit de Italiaanse renaissance: een betonskelet met baksteen, 36 m hoog, met een betonnen vlakbodemreservoir van 120 m³. Hij is rijksmonument 520878 en sinds 1981 buiten gebruik; de trouwzaal is later aangebouwd. De toren staat er nog (BAG-pand 0489100000194910 in gebruik, bouwjaar 1912; AHN en luchtfoto). De taak noemde geen BAG-pand: dit pand is via de BAG-WFS gevonden en omvat de toren, de erkers, het bordes, de ronde filtertoren en de trouwzaal.

## Bestanden

- `watertoren-barendrecht.glb`: één node, `building:watertoren-erkers-schacht-balkons-reservoir-dak-filtertoren-en-trouwzaal`.
- `watertoren-barendrecht.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-barendrecht-1-1000.stl`: het model op 1:1000 (15,5 × 15,5 × 36,7 mm).

## Oorsprong en oriëntatie

RD-oorsprong [96200.9, 430314.6] (51,858290 N, 4,533655 O): het hart van de schacht (AHN-DSM-dakrand x 96198,4 tot 96203,55 en y 430311,85 tot 430317,3; de BAG-erkers x 96197,13 tot 96204,59), op het maaiveld. De zijden van het BAG-pand lopen noord-zuid en oost-west: `xAxis` [1, 0], +X is oost, +Y noord, de ingang met het bordes ligt op −Y (zuid).

`groundSamplePoints` liggen west (−6, 0), zuid (0, −6,5), oost (13, 0, voorbij de trouwzaal) en noord (0, 11,5, voorbij de filtertoren). `groundHeight` 43,06 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (west 43,173, zuid 43,226, oost 43,232, noord 43,06; gemeten 2026-11-06). PDOK-terrein min AHN-DTM is hier 43,63 tot 43,67, dus z = 0 ligt op NAP −0,59 (AHN-DTM rond de voet NAP −0,4 tot −0,8). `groundOffsetMetres` is −0,1. Het buurpand in het westen (0489100000213956) staat in PDOK op de AHN-hoogte en raakt het model niet.

## Onderdelen

Hoogtes boven het maaiveld (NAP −0,59).

- Schacht: 5,8 × 5,8 m tot 27,0 m, per gevel drie smalle vensters (nissen van 0,5 × 1,4 m rond 12,8, 17,5 en 21,5 m).
- Erkers: driezijdig op west, oost en noord (register), voorvlak 2,75 m, 0,85 m uit de schacht, zijden onder 45 graden, tot 4,2 m (met de balustrade). De westerker heeft een segmentboogvenster; boven de west- en de oosterker een getoogd venster in de schacht (5,0 tot 6,4 m). De oosterker zit in de trouwzaal, de noorderker in het tussenlid.
- Ingang (zuid): symmetrische dubbele bordestrap, 6,5 m breed en 1,7 m diep, met de traparmen als hellingen van 1,0 m aan de buitenkant naar het bordes op 3,2 m, een borstwering van 0,9 m diep tot 4,0 m, een deur onder het bordes (1,0 × 2,0 m) en de rondboogdeur op het bordes in de schacht (1,2 m breed tot 5,4 m).
- Balkons: op alle vier de gevels, 3,5 m breed en 0,7 m uit de gevel, onderkant van 45 graden vanaf 24,35 m, borstwering tot 27,3 m, met vier consoles van 0,45 m breed (onderkant 48 graden, van 23,0 m).
- Dakkapellen: de terugliggende rondboogdeuren naar de balkons, 1,6 m breed, tot 0,5 m voor de gevel, onder een fronton tot 29,8 m, met de rondboogopening als nis.
- Reservoir: een cilinder met straal 2,9 m (de convex gewelfde gevels die samen een door de hoeken onderbroken cirkel vormen) van 27,0 m tot de profielrand op 33,74 m (AHN NAP +33,15), 0,15 m uit de cilinder met een onderkant van 45 graden; vier hoekpijlers van 0,9 × 0,9 m tot 34,5 m (de hoger opgaande hoekaccenten).
- Dak: kegel van de profielrand tot 36,39 m (AHN NAP +35,8).
- Filtertoren (noord): rond, straal 2,45 m (BAG-boog), tot 10,79 m (AHN NAP +10,2) met een kroonlijst van 0,15 m en een achtkant kegeldak tot 13,39 m (AHN NAP +12,8); zes vensternissen van 0,5 × 1,2 m.
- Tussenlid tussen schacht en filtertoren: plat, 2,2 m breed, tot 10,64 m (AHN NAP +10,05).
- Trouwzaal (oost): cirkelsegment uit de BAG (cirkelfit op de boog: hart (1,4; 3,61), straal 10,34 m) met diagonale zijwanden, plat dak op 3,84 m (AHN NAP +3,25) en een gemetselde rand van 0,9 m breed langs de boog tot 4,49 m (AHN NAP +3,7 tot +4,1), met vijf vensternissen van 0,6 × 0,6 m.

Nissen hebben een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Barendrecht)): 1912, Roelof Kuipers, overgangsstijl met Italiaanse renaissance, 36 m, 120 m³, trouwzaal later aangebouwd, buiten gebruik sinds 1981.
- [Rijksmonumentenregister 520878](https://monumentenregister.cultureelerfgoed.nl/monumenten/520878): betonskelet met baksteen, 36 m; ronde kleine toren (filtergebouw) met achtkant kegeldak, op twee niveaus verbonden; onderbouw met driezijdige erkers op drie zijden, dubbele bordestrap met deur eronder en rondboogdeur op het bordes; hoeken van betonblokken; smalle boven elkaar staande vensters; vier balkons op consoles met opengewerkte balustrades en terugliggende rondboogdeuren onder een fronton; reservoirgeleding met convex gewelfde gevels; profielrand met hoger opgaande hoekaccenten; plat tussenlid.
- BAG-pand 0489100000194910 (PDOK, 2026-11-06): bouwjaar 1912, 55 hoekpunten; erkers, bordes, filtertoren en de boog van de trouwzaal.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): zie de hoogtes hierboven; de cel met NAP +37,3 boven het hart is de antennemast.
- PDOK-luchtfoto (Actueel_orthoHR): vierkante top met kegeldak, glazen dak van de trouwzaal, filtertoren.
- Foto's op Wikimedia Commons (categorie "Watertower, Barendrecht"): "Overzicht watertoren - Barendrecht - 20341693 - RCE.jpg" (frontaal van het zuiden), "Overzicht watertoren - Barendrecht - 20341692 - RCE.jpg" en "...20341694 - RCE.jpg", "Barendrecht, de Watertoren RM520878 IMG 0738 2022-03-28 10.43.jpg" (van het oosten, met de trouwzaal) en "2008-06-29 17.16 Barendrecht, de watertoren.JPG".

## Geschat en weggelaten

Geschat: de breedte van de schacht (5,8 m) komt uit de frontale RCE-foto, geschaald op de profielrand uit het AHN; het AHN-raster meet aan de dakrand maar 5,2 tot 5,45 m, maar verzacht de randen, en de foto geeft over de erkers 7,25 m tegen 7,46 m in de BAG. Alle hoogtes onder de profielrand behalve de filtertoren, het tussenlid en de trouwzaal (erkers, bordes, vensters, deuren, balkons, consoles, dakkapellen, overgang naar het reservoir op 27,0 m, hoekpijlers) zijn uit de foto's geschat. De erkers zijn even groot gemaakt (maat van de westerker in de BAG). De vensters (in het echt circa 0,3 m breed) zijn nissen van 0,5 m. Het kegeldak volgt het AHN, dat een rechte helling toont.

Aangepast voor het printen zonder steun: de balkons en kroonlijsten zijn in het echt vlakke uitkragingen; hier hebben ze een onderkant van 45 graden. De balustrades zijn dicht.

Weggelaten: de antennemast en de bliksemafleider (dun), de opengewerkte balustrades van het bordes en de balkons (onder 0,9 m, hier dicht), het wapen van Barendrecht en de bloklijst boven de deur, de witte hoekblokken als reliëf (in het echt vlak met de baksteen; alleen kleur), de lage schijnvoegen van de onderbouw, en de korte muurstompjes aan de uiteinden van de boog van de trouwzaal.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand en is gelijk aan de export zonder steun. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een prisma met een spits dak, een rond blok en een plat segment) de erkers, het bordes met trappen en deuren, de vensters, de balkons met consoles en dakkapellen, het ronde reservoir tussen de hoekpijlers met de profielrand en het kegeldak, het achtkante dak van de filtertoren en de rand en vensters van de trouwzaal.

Controle-URL: http://localhost:3000/kaart/51.85829/4.53366/200/1x1/0
