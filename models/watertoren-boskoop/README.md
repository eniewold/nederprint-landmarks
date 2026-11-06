# Watertoren Boskoop (Boskoop)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-boskoop.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: basement, geledingen, fries, band, kraag en portaal zijn benoemde omwentelingsvormen, prisma's en hulls; vensters en de deur zijn blinde nissen.

De watertoren aan de Zijde werd in 1908 gebouwd naar ontwerp van J. Schotel en op 30 maart 1909 in gebruik genomen; hij is rijksmonument 511321 en was tot 1976 in gebruik ("De hoge hoed"). Oorspronkelijk was hij 32,5 m hoog, met een sterk uitkragende bovenbouw van gele verblendsteen met kantelen en Art-Nouveauhekwerken rond een Intze-reservoir van 150 m³. Die bovenbouw is bij een restauratie in februari 1999 afgebroken en het reservoir is neergelaten; de restauratie liep vast en de toren staat sindsdien zonder kop (DBNL; Rodi, 28 januari 2026). **Dit model is de huidige toestand**: de schacht tot de dichtgemetselde, met cement afgedekte uitkraging (de gele band), 23,3 m hoog volgens het AHN. Een nieuwe eigenaar heeft plannen voor woningen in de toren (Rodi, juni 2025); op de luchtfoto staan bouwwerkzaamheden rond de voet.

De taak noemde geen BAG-pand: pand 0499100002023098 (bouwjaar 1908, in gebruik, woonfunctie) is via de BAG-WFS gevonden. Het omvat alleen de ronde toren met het portaal.

## Bestanden

- `watertoren-boskoop.glb`: één node, `building:watertoren-basement-schacht-gele-band-en-portaal`.
- `watertoren-boskoop.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-boskoop-1-1000.stl`: het model op 1:1000 (8,8 × 9,5 × 23,6 mm).

## Oorsprong en oriëntatie

RD-oorsprong [103630.19, 454412.08] (52,075602 N, 4,637884 O): het hart van de ronde BAG-contour (cirkelfit op 58 punten, straal 4,42 m, rest onder 1 mm; de top in het AHN-DSM valt er binnen 0,2 m op), op het maaiveld. `xAxis` wijst naar RD-richting −4,5 graden (oost), +Y naar 85,5 graden (noord): de as van het portaal aan de Zijde (BAG: voorgevel 2,71 m breed op 5,07 m van het hart).

`groundSamplePoints` liggen op 6 m rond de toren (oost, west, zuid, zuidoost, zuidwest, noordoost, noordwest) en op 7,5 m voor het portaal. `groundHeight` 41,73 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (zuidwest 41,726; de andere 41,77 tot 41,97; gemeten 2026-11-06). PDOK-terrein min AHN-DTM is hier 43,24 tot 43,57 (gemiddeld 43,42), dus z = 0 ligt op NAP −1,69 (AHN-DTM rond de voet NAP −1,5 tot −1,75). `groundOffsetMetres` is −0,1. De buurpanden staan los van de toren.

## Onderdelen

Hoogtes boven het maaiveld (NAP −1,69).

- Basement: straal 4,42 m (BAG) tot 1,7 m met de cordonband, onder 45 graden afgeschuind naar de schacht.
- Eerste geleding: conisch van straal 4,25 m (register: 8,5 m aan de voet) tot 4,0 m op 7,3 m, met drie langgerekte vensters (nissen van 0,9 × 2,8 m, 3,1 tot 5,9 m) op oost, zuid en west.
- Segmentboogfries en natuurstenen band met tandlijst: elk 0,1 m uitkragend met een onderkant van 50 graden, tot de richel op 9,19 m (AHN NAP +7,5).
- Tweede geleding: springt terug naar straal 3,6 m (AHN-richel tussen 3,3 en 3,9 m) en loopt conisch tot 2,87 m op 20,0 m, met zes vensters van 0,9 m breed, afwisselend laag (11,7 tot 16,6 m, op west, noordoost en zuidoost) en hoog (13,9 tot 18,6 m, op oost, noordwest en zuidwest).
- Gele band (dichtgemetselde uitkraging): kraag van 50 graden naar straal 3,0 m vanaf 20,2 m, tot de bovenrand op 23,29 m (AHN NAP +21,5 tot +21,7, buitenstraal 2,9 tot 3,0 m), met binnen de rand (straal 2,05 m) het platte dak op 21,59 m (AHN NAP +19,9).
- Portaal (noord): het trapezium uit de BAG (voorgevel 2,71 m, zijwanden naar de schacht), vlak gedekt tot 4,2 m (AHN NAP +2,4 tot +3,1), met pinakels van 0,9 × 0,9 m op de voorhoeken tot 5,0 m en een spits tot 5,5 m, en de deur als rondboognis van 1,2 m breed (aanzet 2,6 m, 0,35 m diep).

Vensternissen hebben een plafond dat naar binnen onder 56 graden oploopt, de rondboog van de deur 63 graden.

## Bronnen en maten

- [Rijksmonumentenregister 511321](https://monumentenregister.cultureelerfgoed.nl/monumenten/511321): 1908, J. Schotel; ronde watertoren van 32,5 m met een conische schacht van rode baksteen, 8,5 m aan de voet en 4,5 m aan de top; gemetseld basement met natuurstenen cordonband; twee geledingen, de eerste met vier langgerekte vensters en een segmentboogfries met natuurstenen band en uitkragende tandlijst, de tweede met rode banden en vensters op twee niveaus en een rondboogfries; rechthoekig vlak gedekt portaal naar de Zijde met afdekbalk, pinakels en rondboogvormige entree; de uitkraging later dichtgemetseld en met cement afgedekt; bovenbouw met kantelen en Intze-reservoir van 150 m³ en 8 m.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Boskoop)): de toren "had" een hoogte van 32,5 m; "De hoge hoed".
- [DBNL](https://dbnl.org/tekst/sten009monu10_01/sten009monu10_01_0024.php) en [Rodi, 28 januari 2026](https://www.rodi.nl/alphenaandenrijn/historie/482006/is-de-watertoren-het-mooiste-monument-van-boskoop-): de bovenbouw is na 1994 afgebroken; in februari 1999 ging de kop eraf en werd het reservoir neergelaten. [Rodi, 8 juni 2025](https://www.rodi.nl/alphenaandenrijn/nieuws/448908/nieuwe-toekomst-voor-boskoopse-watertoren): nieuwe eigenaar, plannen voor woningen.
- BAG-pand 0499100002023098 (PDOK, 2026-11-06): 68 hoekpunten, een cirkel met het portaal.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): zie de hoogtes hierboven.
- PDOK-luchtfoto (Actueel_orthoHR): open ring met plat dak bovenop, bouwwerkzaamheden rond de voet.
- Foto's op Wikimedia Commons (categorie "Watertoren (Boskoop)"): "Watertoren Boskoop 2019.jpg" (Steven Lek, vanaf het westen) en "Boskoop watertoren - panoramio.jpg" (2005).

## Geschat en weggelaten

Geschat: de hoogtes van het basement, het fries, de band, de vensters, de onderkant van de gele band en het portaal zijn geschat van de foto van 2019 (40,8 px/m tussen de AHN-richel en de AHN-bovenrand, 47,8 px/m eronder). De stralen van de geledingen komen uit de foto (breedteverhoudingen) en het AHN; het register noemt 4,5 m aan de top, maar het AHN en de foto geven onder de gele band circa 5,7 m. Het register noemt vier vensters in de eerste geleding; op de foto's is er één te zien (west), dus drie zijn er gezet (oost, zuid, west) en de vierde, naast of achter het portaal, ontbreekt. De volgorde van de hoge en lage vensters in de tweede geleding volgt de foto's (laag op west); hun precieze hoeken zijn geschat. De vensters (in het echt circa 0,6 m breed) zijn nissen van 0,9 m.

Weggelaten: de oorspronkelijke bovenbouw met kantelen en hekwerken (afgebroken in 1999), de ronde gaten in de gele band en de stalen stompen op de rand (onder 0,9 m), het segmentboog- en rondboogfries als reliëf (vrijwel vlak in de gevel; het segmentboogfries is als band gemodelleerd), de rode banden van de tweede geleding (alleen kleur), het smeedijzeren hek tussen de pinakels, de gevelsteen met het wapen van Boskoop en de gedenkplaat (onder 0,9 m).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand en is gelijk aan de export zonder steun. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte kolom met een uitstulping, zonder verjonging) de conische schacht met de richel tussen de geledingen, het basement, het fries en de band, de vensters op drie niveaus, de gele band met het verdiepte platte dak en het portaal met pinakels en deur.

Controle-URL: http://localhost:3000/kaart/52.07560/4.63788/200/1x1/0
