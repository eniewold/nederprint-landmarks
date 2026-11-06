# Watertoren Heuveloord (Utrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-utrecht-heuveloord.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, uitkraging, reservoir, borstwering, paviljoen en dak zijn omwentelingsvormen van een radiaal profiel (96 segmenten), de consoles en de kantelen convexe omhullenden, de installatiekasten blokken, de vensters, velden en de deur blinde nissen met een schuin plafond.

De watertoren staat in Tolsteeg (Utrecht-Zuid) tussen de straat Heuveloord en de Vaartsche Rijn, op de oude gemeentegrens met Jutphaas. Hij werd in 1906-1907 gebouwd als derde toren van de Utrechtsche Waterleiding Maatschappij: 37 m hoog, reservoir van 1000 m³, gemeentelijk monument. In 1977 werden schacht en reservoir met Luxalon-panelen bekleed, in 1996 is hij in de oorspronkelijke staat hersteld. Sinds 2015 zit er een restaurant in de top, met een glazen paviljoen op het dakterras binnen de kantelen, en op de begane grond een café met terras. Een ronde, licht verjongende schacht op een bredere plint, met kleine rondboogvensters en bovenaan een boogfries; een kegelvormige uitkraging van siermetselwerk met stalen ribben naar het veel bredere reservoir met een stalen onderrand, lichte banden en kroonlijsten, een rij kleine vensters en zestien rondboogvelden met elk een hoog smal venster; daarboven een borstwering met kantelen.

## Bestanden

- `watertoren-utrecht-heuveloord.glb`: één node, `building:watertoren-plint-schacht-reservoir-kantelen-en-restaurant`.
- `watertoren-utrecht-heuveloord.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-utrecht-heuveloord-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [136735.42, 454168.87] (52,07550 N, 5,12079 O): het hart van het ronde BAG-pand 0344100000127759 (cirkel door 62 hoekpunten, straal 7,37 m; dat is de omtrek van het reservoir, niet van de schacht), op het maaiveld: AHN-DTM NAP +1,95 aan de straat-, noord- en zuidzijde. De rand van de top in het AHN-DSM (per sector van 30 graden) en het dak van het restaurant liggen op dat hart.

+X wijst naar het oosten (RD-richting 0), +Y naar het noorden. De toren is rond; de deur staat in het model aan de straatzijde (+X).

`groundSamplePoints` liggen op 8,5 m oost, noord en zuid en op (6, -6); `groundHeight` 45,30 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (45,30 tot 45,43, gemeten 2026-11-06). Aan de westkant, naar de kade van de Vaartsche Rijn, ligt het PDOK-terrein op 44,35; die kant is bewust niet bemonsterd, anders zakt de toren bijna een meter in de straat. `groundOffsetMetres` is -0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +1,95).

- Plint: 5,4 m tot 2,7 m, lichte waterlijst van 5,5 m tot 2,95 m. Deur aan de straatzijde: rondboognis van 1,6 m breed en 0,4 m diep tot 2,35 m.
- Schacht: taps van 5,15 m op 2,95 m tot 4,95 m op 15,1 m. Kleine rondboogvensters als nis van 0,9 m: vier van 5,6 tot 7,2 m en vier van 13,3 tot 14,6 m op 45 graden naast de deur, vier van 9,6 tot 11,4 m boven de deur en rondom.
- Boogfries: band van 5,1 m van 15,7 tot 16,5 m op zestien consoles van 0,9 m breed vanaf 15,1 m; lichte band van 5,15 m van 16,6 tot 17,1 m.
- Uitkraging: kegel van 5,15 m op 17,1 m tot 7,25 m op 20,0 m (54 graden).
- Reservoir: trommel van 7,25 m; stalen onderrand van 7,37 m (BAG) van 20,0 tot 20,35 m, kroonlijst van 7,33 m tot 21,0 m; zestien kleine vensters van 0,9 m van 21,4 tot 22,3 m; lichte banden van 7,35 m op 22,95 tot 23,2 m en 23,6 tot 23,9 m; zestien rondboogvelden van 1,9 m breed en 0,2 m diep van 24,3 m tot een boogkruin op 30,85 m, elk met een hoog venster van 0,9 m van 25,0 tot 29,7 m; band van 7,35 m van 31,9 tot 32,3 m en kroonlijst van 7,4 m van 33,3 tot 33,9 m.
- Kantelen: borstwering van 7,2 m (0,9 m dik) tot 34,7 m rond het dakterras op 34,0 m, met zestien kantelen van 1,9 m breed (tussenruimte 0,93 m) boven de vensters tot 35,6 m (AHN NAP +37,5 à +37,6).
- Restaurant: glazen paviljoen van 4,6 m tot 37,5 m, plat dak tot 37,8 m (AHN NAP +39,7 à +39,8) dat tot 5,3 m overkraagt; drie installatiekasten tot 39,1 m (oost, PDOK-top 84,37 ellipsoïdisch), 38,7 m en 38,8 m.

Alle banden, lijsten, de stalen rand en de dakrand hebben een onderkant van 50 graden, de consoles 48 graden, de uitkraging 54 graden en de nissen een plafond dat naar binnen onder 56 tot 63 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Heuveloord)): 1906-1907, Utrechtsche Waterleiding Maatschappij, 37 m, 1000 m³, rond en licht verjongend, overstekend reservoir, Luxalon-bekleding 1977, herstel 1996, restaurant sinds 2015.
- BAG-pand 0344100000127759 (PDOK, 2026-11-06): ronde voetafdruk van 7,37 m, de omtrek van het reservoir.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld, kantelen, dakterras, dak van het restaurant en installaties.
- PDOK-luchtfoto (8 cm): borstwering, dakterras met tafels, het restaurant met donkere dakrand en installatiekasten.
- PDOK-gebouwtegel: top van de reconstructie 84,37 (ellipsoïdisch).
- Foto's op Wikimedia Commons: "Watertoren Utrecht Heuveloord.jpg" (2015, vanaf de Vaartsche Rijn): geledingen, banden, vensters, rondboogvelden, uitkraging, kantelen en restaurant, geschaald op de breedte van het reservoir en de hoogte van de kantelen; "Vaartsche-Rijn Pastoe watertoren Utrecht Nederland.JPG": reservoir en kantelen vóór het restaurant.

## Geschat en weggelaten

Geschat: alle hoogtes tussen het maaiveld en de kroonlijst van het reservoir (plint, banden, vensters, boogfries, uitkraging, velden) uit één schuin omhoog genomen foto, geschaald op de breedte van het reservoir en de kantelen in het AHN (onzekerheid circa een halve meter); de stralen van plint en schacht (5,4 en 5,15 tot 4,95 m) uit breedteverhoudingen op die foto, want de BAG geeft alleen het reservoir; de deur (plaats aan de straatzijde en maat; op de foto's niet te zien); het aantal en de verdeling van de schachtvensters; de straal van het glazen paviljoen en de dakrand (luchtfoto en foto) en de plaats en maat van de installatiekasten (AHN-DSM en luchtfoto).

Weggelaten: de open lamellenrand rond het dak van het restaurant (op de foto tot circa 7 m uit het hart, in de luchtfoto en het AHN doorzichtig), de glazen balustrade op de kantelen, de stalen ribben en het ruitpatroon op de uitkraging, de kleine venstertjes in de borstwering, de sierankers en het siermetselwerk (alleen kleur), de vlaggenmast en antennes, en de tafels en parasols op het dakterras en het caféterras (lager of dunner dan 0,9 m).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een eerste versie liet de export opvullen onder een vlak randje van de stalen rand naast de kegel en in lage nissen met een te vlak plafond. Een export op 1:1000 (80 m uitsnede, v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; boven de onderkant van het model is het volume gelijk aan dat van de GLB (verschil 0,1 %). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte cilinder op de omtrek van het reservoir tot het maaiveld, met een blok bovenop) de smallere schacht met plint, vensters en boogfries, de uitkraging naar het bredere reservoir, de banden, kleine vensters, rondboogvelden met hoge vensters, kroonlijsten, de kantelen en het restaurant met dakrand en installaties.

Controle-URL: http://localhost:3000/kaart/52.0755/5.12079/200/1x1/0
