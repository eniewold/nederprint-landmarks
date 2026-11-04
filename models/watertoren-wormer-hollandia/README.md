# Watertoren Hollandia (Wormer)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-wormer-hollandia.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en reservoirdeel zijn rechthoekige prisma's, de kraag en de lijsten zijn convexe omhullenden met schuine onderkanten, de vensters en openingen blinde nissen, en de rest van de fabriek bestaat uit de dakvlakken van de 3D BAG als prisma's onder hun eigen vlak.

De watertoren van de Hollandia-fabriek aan de Veerdijk stamt uit 1888 en voedde de sprinklerinstallatie van de fabriek. Hij staat midden in het complex aan de Zaan, dat sinds 1980 door Stichting Hollandia wordt beheerd en verbouwd tot kantoor- en bedrijfsruimte, en bestaat nog (RCE-opnamen, Commons-foto, AHN en luchtfoto). Het is een rechthoekige bakstenen toren die boven het fabrieksdak (NAP +19,3) uitsteekt. Aan de noordkant staat hij vrij boven de lagere hal aan het Pakhuisplein, met twee rechthoekige verdiepte panelen en daarboven twee hoge rondboognissen. Boven het dak kraagt het reservoirdeel rondom uit op een gemetselde kraag, met een rondboogfries (vijf boogjes op de lange, drie op de korte zijden), een lijst, een band van lisenen met smalle spleten, een tweede lijst en een borstwering met rondboogvormige openingen (vijf en drie) onder een afdeklijst. Op het dak heeft de toren rondboogvensters en een deur.

## Bestanden

- `watertoren-wormer-hollandia.glb`: twee nodes, `building:watertoren-schacht-kraag-en-borstwering` (de toren tot het maaiveld) en `building:fabriek-hollandia` (de rest van het BAG-pand).
- `watertoren-wormer-hollandia.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-wormer-hollandia-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [114906.45, 500648.3] (52,49208 N, 4,79687 O), het hart van de bovenkant van de toren in het AHN-DSM (6,7 × 4,4 m boven NAP +24), op het maaiveld NAP +0,3 (AHN-DTM rond de fabriek 0,24 tot 0,52; 3D BAG-maaiveld 0,23). Lokale +X loopt langs de noordgevel van het fabrieksblok waartegen de toren staat (RD-richting 3,5 graden, uit de randen van het BAG-pand en de 3D BAG; `xAxis` [0.99813, 0.06105]), +Y wijst naar het noorden (Pakhuisplein). `groundHeight` 43,05 is de terugval (NAP +0,3 plus een geoïdehoogte van circa 42,75 m); de PDOK-reconstructie van het pand staat in de gebouwtegel op precies die hoogte. `groundOffsetMetres` is -0,1.

De toren is geen eigen BAG-pand: hij hoort bij pand 0880100000004206 (bouwjaar 1877, 1760 m²), het grootste deel van het complex, met de kloktoren aan de kade. De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model het hele pand, en `building:fabriek-hollandia` neemt de rest ervan over uit de 3D BAG (zie hieronder), zoals bij de watertoren van de Kweekschool in Maastricht.

## Onderdeel `building:watertoren-schacht-kraag-en-borstwering`

Maten als hele breedtes langs x × y, hoogtes boven het maaiveld (NAP +0,3).

- Schacht: 6,0 × 3,7 m van -0,3 tot 20,15 m. Onder het fabrieksdak zit hij in de fabriek; aan de noordkant staat hij vrij boven de hal (dak 7 tot 10,7 m).
- Noordgevel: twee verdiepte panelen van 1,4 m breed (0,25 m diep) van 8,0 tot 14,3 m, daarboven twee hoge rondboognissen van 1,4 m (0,3 m diep) van 15,0 tot 19,6 m, 2,5 m uit elkaar.
- Op het fabrieksdak (19,0 m): in de zuidgevel twee vensternissen van 0,9 m, in de oostgevel een deurnis van 1,0 m (zuidelijk van het midden), in de westgevel een vensternis, alle tot 20,0 m.
- Kraag: van 20,15 tot 20,7 m 0,35 m rondom uit (58 graden).
- Reservoirdeel: 6,7 × 4,4 m van 20,7 tot 26,05 m, met een rondboogfries van nissen van 0,6 m (vijf en drie, 1,2 m uit elkaar) van 21,0 tot 22,1 m; een lijst 0,1 m uit van 22,25 tot 22,55 m; spleten van 0,45 m tussen de lisenen (negen en zes, 0,7 m uit elkaar) van 22,6 tot 23,15 m; een lijst 0,12 m uit van 23,75 tot 24,05 m; rondboogvormige openingen van 0,6 m (vijf en drie, 1,2 m uit elkaar) als blinde nis van 24,8 tot 25,35 m.
- Afdeklijst: 0,08 m uit van 26,05 tot 26,45 m (AHN NAP +26,8, 3D BAG +26,75). De bovenkant is vlak, zoals in het AHN.

Alle nissen hebben een plafond dat naar binnen onder 63 graden oploopt, de lijsten een onderkant van 45 graden.

## Onderdeel `building:fabriek-hollandia`

De zestien dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0880100000004206 staan als constante in de generator (`hollandiaBag3d()`): per vlak een prisma vanaf de onderkant tot het vlak z = a x + b y + c (kleinste kwadraten door de hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen. Het dakvlak van de watertoren zelf ligt als vlak op het fabrieksdak (19,0 m), en de schacht is eruit gesneden, zodat de fabriek als ring om de toren ligt (genus 1). Hoogste punt is de kloktoren aan de kade (27,09 m). Waar de PDOK-gebouwtegel op het platte dak van 24,3 m aan de oostkant en op het blok van 19,3 m ten westen van de toren schuine driehoeksvlakken heeft, is de 3D BAG vlak, zoals het AHN.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Wormer_Hollandia)): bouwjaar, functie (sprinklerinstallatie), Stichting Hollandia.
- BAG-pand 0880100000004206 (PDOK, 2026-11-04): plattegrond en richting van het complex.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0880100000004206, opgehaald 2026-11-04: dakvlakken van de fabriek, maaiveld 0,23, toren tot NAP +26,75.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): de bovenkant van de toren (6,7 × 4,4 m, NAP +26,8), het fabrieksdak rond de toren (NAP +19,2 tot 19,3), de hal ten noorden (7,2 tot 10,7), maaiveld 0,24 tot 0,52. Luchtfoto voor de ligging.
- Foto's op Wikimedia Commons: "Wormer Hollandia Watertoren 2" (noordgevel vrijwel frontaal met evenwijdige verticalen; schaal 73,6 px/m uit de breedte van de bovenkant: hoogtes van panelen, nissen, kraag, fries, lijsten, spleten en openingen, en de breedte van de schacht als 0,88 × de bovenkant), "Zicht op toren, vanaf het dak - Wormer - 20386711 - RCE" (zuid- en oostgevel boven het dak: kraag, vensters, deur, aantallen boogjes en openingen per gevel), "Achterzijdel, overzicht - 20387156 - RCE", "Overzicht van de achterzijde - 20386716 - RCE" en de overige RCE-opnamen van het complex.

## Geschat en weggelaten

Geschat: de hoogtes van alle geledingen uit één frontale foto met een schaal uit de breedte van de bovenkant (onzekerheid circa een halve meter; de foto vanaf het dak geeft de kraag tot een meter hoger, maar de onderkant van de toren is daar niet te zien); de breedte van de schacht (6,0 × 3,7 m) en de uitkraging (0,35 m) uit dezelfde foto en het verschil met de bovenkant in het AHN; de positie van de toren 0,5 m ten noorden van de noordgevel van het fabrieksblok (AHN-rand van de bovenkant min de uitkraging; de 3D BAG legt de toren op de gevellijn); de plaats van de vensters in de zuid- en westgevel en van de deur in de oostgevel; het aantal spleten tussen de lisenen; de richting (3,5 graden, van het complex, het DSM laat 0 tot 5 graden toe).

Weggelaten: de doorgaande gaten in de borstwering (als blinde nis van 0,6 m; ze zijn circa 0,4 tot 0,6 m), de kleine ventilatieroosters onder de openingen (kleiner dan 0,9 m), de regenpijp, de antenne en de schotels op het dak, het groene houten hok en het betonnen blok naast de toren op het dak. De rest van de fabriek is niet verfijnd ten opzichte van de 3D BAG.

## Controle

Twee gesloten NoError-nodes met elk één component: de toren genus 0, de fabriek genus 1 (ring om de schacht); ze raken elkaar zonder overlap. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staan beide nodes compleet in de export, zonder ondersteuningsobject, en is de PDOK-reconstructie van pand 0880100000004206 verborgen; de voet van het model ligt 0,2 tot 0,5 m in het PDOK-terrein (de laagste bemonstering is de kade aan de Zaan). De buurpanden 0880100000000593, 0880100000005985, 0880100000005984, 0880100000002893 en 0880100000002894 steken in PDOK hooguit 0,6 m boven het AHN-maximum binnen hun contour uit en blijven staan. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een kale doos tot NAP +26,8) de kraag met het bredere reservoirdeel, de rondboogfries, twee lijsten, de spleten, de openingen in de borstwering en de afdeklijst op alle vier gevels, aan de noordkant de panelen en hoge rondboognissen, en op het dak de vensters (zuid, west) en de deur (oost).

Controle-URL: http://localhost:3000/kaart/52.49208/4.79687/200/1x1/0
