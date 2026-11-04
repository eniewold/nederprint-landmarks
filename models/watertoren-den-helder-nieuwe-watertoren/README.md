# Nieuwe watertoren (Den Helder)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-den-helder-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, friezen, kraag, kuip en borstwering zijn één omwentelingsprofiel, en pendanten, ribben, lateien, topgevels, pinakels, de opbouw en het ingangshuisje zijn convexe bouwdelen met schuine onderkanten.

De watertoren bij rotonde De Vijfsprong is in 1907 ontworpen door Jan Schotel en op 27 december 1907 in gebruik genomen, als vervanger van de toren van 1856 in Huisduinen. Het reservoir van 400 m³ werd bij de verbouwing van 1959-1961 vergroot tot 500 m³; de betonlaag van die verbouwing is in 2005 weer van de baksteen gehaald. Volgens Wikipedia is de toren 40,15 m hoog. Een ronde, sterk tapse bakstenen schacht in twee geledingen (een brede onderbouw met een rondboogfries onder een stenen band, daarboven een slankere schacht met verspringende trapvensters), een rondboogfries en stenen ring onder een geribde kraag, een kuip van lichtere steen met vensters, en daarboven een borstwering met een rij open vensters rond een dakterras, onderbroken door vier topgevels met schouders en twee pinakels. Op het terras staat een ronde metalen opbouw met een antennemast; aan de westkant een ingangshuisje met zadeldak.

## Bestanden

- `watertoren-den-helder-nieuwe-watertoren.glb`: één node `building:tapse-schacht-kraag-kuip-en-topgevels`, op het maaiveld.
- `watertoren-den-helder-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-den-helder-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [112785.62, 552447.98] (52,95741 N, 4,75902 O), het middelpunt van de cirkel door de BAG-contour van pand 0400100000022072 zonder het ingangshuisje (straal 5,85 m, 2 cm spreiding), op maaiveld (AHN-DTM NAP +0,86 tot +1,17 rond de voet; gebruikt +0,95). Lokale +X staat 6 graden linksom op RD-oost (`xAxis` [0.99452, 0.10453]): de richting van de oostelijke topgevel. De westelijke topgevel staat op foto's recht boven het ingangshuisje, dat in de BAG gecentreerd op RD 186 graden ligt. `groundHeight` 43,05 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 9 m van het hart (43,05 tot 43,17). Het model vervangt BAG-pand 0400100000022072 (toren en ingangshuisje), zodat de PDOK-cilinder verdwijnt; de buurpanden liggen 17 m of verder weg en hebben een eigen hoogte.

## Onderdeel `building:tapse-schacht-kraag-kuip-en-topgevels`

- Onderbouw: van 5,85 m straal aan de voet (BAG) naar 4,86 m op 10,65 m; rondboogfries van 10,1 tot 10,8 m, 0,12 m uit, met 24 pendanten tot 9,4 m; stenen band van 10,8 tot 11,5 m, 0,2 m uit. Alle onderkanten onder 45 graden.
- Bovenschacht: van 4,62 m op 11,5 m naar 4,05 m onder de bovenste fries; rondboogfries tot 25,1 m met 20 pendanten tot 24,6 m; stenen ring van 4,35 m van 25,6 tot 26,2 m.
- Kraag: onder 45 graden van de ring naar de stenen lijst van 6,25 m op 28,1 m (op foto's circa 40 graden en hol), met 24 ribben van 0,4 m die 0,15 m uit het kraagvlak staan; lijst tot 28,8 m.
- Kuip: 6,05 m straal tot de borstwering op 37,8 m; een dubbel venster van 1,4 m onder elke topgevel en een enkel venster daartussen (32,1 tot 35,5 m), als nissen van 0,35 m met een plafond onder 56 graden en een stenen latei met een onderkant onder 45 graden.
- Dakterras op 35,9 m (AHN, PDOK en 3D BAG), binnen een borstwering van 1,5 m dik (aan de binnenkant dikker dan in het echt, zodat de export de wand achter de nissen niet verdikt); per kwart twee van de open vensters als nissen van 0,9 m van 36,6 tot 36,85 m met een spitse top onder 60 graden tot 37,63 m.
- Vier topgevels met een koorde van 4,6 m: rechte zijden tot 39,0 m, schouders naar 2,4 m breed op 39,45 m, en twee pinakels van 0,9 m (hart 0,75 m uit het midden) tot 40,15 m.
- Metalen opbouw op het terras, 1,1 m naar het noordoosten uit het hart (AHN en PDOK): 4,8 m doorsnede tot 38,7 m, een kraag onder 45 graden naar een bovenste deel van 2,8 m tot 40,4 m (PDOK 40,5).
- Ingangshuisje aan de westkant (BAG): voorgevel 7,3 m uit het hart, 3,6 m breed, goot op 4,6 m en nok op 5,8 m (3D BAG), de nok naar buiten, met de dubbele deur als nis.
- Vensters in de schacht: vier in de onderbouw (4,0 tot 7,6 m) en acht trapvensters in de bovenschacht die per 45 graden 1,2 m hoger liggen (12,6 tot 24,8 m), als nissen van 0,9 m met een latei.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Den_Helder)): ontwerper, 1907, 40,15 m, reservoir 400 en later 500 m³, verbouwingen.
- BAG-pand 0400100000022072 (PDOK, 2026-11-04): ronde voet van 11,7 m en het ingangshuisje aan de westkant.
- AHN DSM/DTM 0,5 m, PDOK 3D-gebouwtegel en 3D BAG (2026-11-04): maaiveld NAP +0,95; dakterras NAP +36,8 (35,9 m); opbouw 38,7 m en het bovenste deel 40,5 m, uit het hart naar het noordoosten; kuip 12,2 tot 12,8 m over de rand in het DSM (randvervaging); ingangshuisje NAP +5,4 tot +6,7. Op de rand van de kuip (borstwering en topgevels) hebben AHN en PDOK geen bruikbare punten: het DSM interpoleert daar tussen het terras en de straat en PDOK zet het hele dak op 35,9 m.
- Foto's op Wikimedia Commons: "Den Helder, watertoren 2006-08-06 10.28" (evenwijdige verticalen; alle hoogtes en doorsnedes, op één schaal uit de BAG-voet van 11,7 m, die de kuip 12,1 m en de pinakels 40,6 m geeft; alle fotohoogtes zijn met 0,989 geschaald op 40,15 m), "Watertoren Den Helder" (westkant: topgevel boven het ingangshuisje), "Den Helder Watertoren 01" en "Den Helder - Watertoren" (borstwering met vensterrij, topgevels met pinakels, metalen opbouw, kraag met ribben), en verder "Den Helder - Nieuwe Watertoren", "Watertoren van Den Helder", "Watertower in Den Helder" en "Den Helder, de watertoren GM0400 IMG 9504".

## Geschat en weggelaten

Geschat: alle hoogtes boven het terras (borstwering, vensterrij, topgevels en pinakels) en de geledingen van schacht, kraag en kuip uit één foto met evenwijdige verticalen, geschaald op de BAG-voet en op de 40,15 m van Wikipedia voor de pinakels; de doorsnedes van onderbouw, bovenschacht en kuip uit dezelfde foto (de kuip klopt met het AHN); de stand van de topgevels uit de foto van de westkant (topgevel boven het ingangshuisje) en de onderlinge hoek van 90 graden uit de foto's van voren; de kraag onder 45 graden in plaats van hol en circa 40 graden; de vorm van de metalen opbouw (AHN/PDOK-hoogtes, doorsnede uit de luchtfoto); de plaats en hoogte van de vensters in de schacht (de trapvensters verspringen in werkelijkheid onregelmatiger); de goot van het ingangshuisje.

Weggelaten: de antennemast met tuidraden en de naald, de rode banden in de schacht, de stenen blokjes en lijsten in de kuip, de rode lisenen op de topgevels en de dekstenen van de pinakels (kleiner dan 0,9 m of alleen kleur), de stijlen tussen de dubbele vensters, drie van de vijf open vensters per kwart in de borstwering (de penanten zouden smaller dan 1 m worden), een ronde dakluik op het terras (onder de borstwering, van de straat niet te zien) en de kleine vensters in het ingangshuisje.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: kraag en ribben onder 45 graden, friezen, pendanten en lateien met een onderkant onder 45 graden, nisplafonds onder 56 graden, de nissen in de borstwering met een spitse top (met een schuin plafond liepen die lage nissen in de bovenste printlagen vol), de opbouw met een kraag van 45 graden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet en zonder ondersteuning op het PDOK-maaiveld (voet 0,2 tot 0,3 m in het terrein) en is het PDOK-pand verborgen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder van 11,7 m met een plat dak op 35,9 m en een blok erop) de tapse schacht in twee geledingen met friezen en stenen band, de vensters, de uitkragende geribde kraag en de bredere kuip, de borstwering met vensterrij rond het verdiepte terras, de vier topgevels met pinakels, de ronde opbouw en het ingangshuisje met zadeldak.

Controle-URL: http://localhost:3000/kaart/52.95742/4.75896/200/1x1/0
