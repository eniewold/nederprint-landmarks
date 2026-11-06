# Watertoren Doorn (Doorn)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-doorn.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, friezen, uitkraging en reservoir zijn omwentelingsvormen van een radiaal profiel (96 segmenten), de aanbouw is een blok met een zadeldak, tuitgevel, dekplaat en tuit als convexe omhullenden, de vensters, de deur en de bogen van de friezen zijn blinde nissen met een schuin plafond.

De watertoren aan de Woestduinlaan 55 (kadastraal Mariniersweg 1) staat op het terrein van het pompstation van de Doornse Waterleiding, op een kunstmatige aarden verhoging. Hij werd in 1902-1903 gebouwd naar ontwerp van de firma Visser & Smit; rijksmonument 508750 (complex 508749, met het pomphuis ernaast), volgens Wikipedia 30 m hoog met één reservoir van 150 m³, in 1959 gerenoveerd. Een ronde, taps toelopende bakstenen toren met natuurstenen accenten in drie geledingen: de voet tot een brede, uitkragende natuurstenen band, met de ingang in een aanbouw onder zadeldak met een uitkragende tuitgevel en een deur met rondboogbovenlicht; de hoge schacht met kleine rondboogvensters, afgesloten door een rondboogfries; daarboven kraagt de toren uit met bloktandlijsten, platte natuurstenen banden en een tweede, kleinere rondboogfries naar het reservoir met een vlakke gevel en staande zesruitsvensters. De kantelen zijn in 1959 verwijderd; op het platte dak staat een ijzeren reling.

## Bestanden

- `watertoren-doorn.glb`: één node, `building:watertoren-voet-aanbouw-schacht-friezen-en-reservoir`.
- `watertoren-doorn.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-doorn-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [151128.99, 450416.04] (52,04205 N, 5,33078 O): het hart van de cirkel door de 21 ronde punten van BAG-pand 1581100000018088 (straal 3,55 m, afwijking ten hoogste 0,06 m), op het maaiveld van de verhoging: AHN-DTM NAP +8,55 (8,50 tot 8,57 tussen 3 en 6 m; de verhoging zakt naar NAP +7,0 op 15 m). Het AHN valt hier op de BAG: het gat in het DTM en de DSM-cellen van de toren liggen rond hetzelfde hart.

Lokale +X wijst naar RD-richting -24 graden (oost-zuidoost): de as van de aanbouw met de ingang (BAG: 3,06 m breed, voorgevel 6,03 m uit het hart). +Y wijst naar 66 graden.

`groundSamplePoints` liggen op 4 m voor het hart (onder de aanbouw) en op 5 m opzij en achter; `groundHeight` 51,83 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (51,83 tot 51,97, gemeten 2026-11-06). Voor de aanbouw zakt het PDOK-terrein naar 51,3 op 7 m (AHN NAP +7,9, de trap naar de deur); met dit punt staat de voorgevel van de aanbouw (terrein 51,4 à 51,5) nog op het terrein zonder dat de toren in de verhoging wegzakt. `groundOffsetMetres` is -0,1. De verhoging zelf zit in het PDOK-terrein en staat niet in het model.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +8,55).

- Voet: taps van 3,55 m (BAG) aan de onderkant tot 3,42 m op 4,95 m, met drie rondboogvensters van 0,9 m als nis (links, rechts en achter, 2,2 tot 3,95 m). Natuurstenen band van 3,72 m van 4,95 tot 5,4 m.
- Aanbouw (+X): 3,06 m breed, voorgevel op 6,03 m, goot 3,0 m, nok 3,85 m (AHN 3,8 à 3,9); tuitgevel tot 4,75 m (AHN-piek 4,6) met een dekplaat van 0,3 m die aan de hoeken 0,17 m uitkraagt, op de top een tuit van 0,8 m tot 5,35 m met een piramidedakje tot 5,6 m; deur met rondboogbovenlicht van 1,1 m breed tot 2,6 m als nis van 0,35 m.
- Schacht: taps van 3,22 m op 5,4 m tot 3,07 m op 15,5 m, met zes rondboogvensters van 0,9 m als nis: boven de ingang en achter van 6,5 tot 8,2 m, op 45 en -135 graden van 10,1 tot 11,7 m, op -45 en 135 graden van 13,2 tot 14,5 m.
- Rondboogfries: ring van 3,32 m van 15,5 tot 18,25 m met twaalf van onderen open rondboognissen van 0,9 m (kruin 17,85 m); ertussen twaalf lisenen van 0,85 m met een console van 50 graden.
- Uitkraging: bloktandlijst naar 3,57 m op 18,95 m, kraag naar de kleinere rondboogfries van 3,87 m (19,86 tot 21,0 m) met zestien van onderen open rondboognissen van 0,7 m (kruin 20,55 m), bloktandlijst van 3,97 m tot 21,45 m en de platte natuurstenen band van 4,1 m van 21,63 tot 22,1 m.
- Reservoir: trommel van 4,0 m met twaalf staande vensters van 0,9 m als nis van 24,1 tot 25,6 m (om de 30 graden, 10 graden naast de as), dekplaat van 4,07 m van 27,88 tot 28,2 m, plat dak op 28,36 m (AHN NAP +36,91).

Band, lisenen en kraag hebben een onderkant van 50 graden, bloktandlijsten en natuurstenen band 40 tot 46 graden, de nissen een plafond dat naar binnen onder 56 tot 63 graden oploopt.

## Bronnen en maten

- [Rijksmonumentenregister 508750](https://monumentenregister.cultureelerfgoed.nl/monumenten/508750): 1902-1903 op een kunstmatige aarden verhoging, firma Visser & Smit, taps toelopende cilinder in baksteen met natuurstenen accenten, drie geledingen, aanbouw onder zadeldak met uitkragende tuitgevel en deur met rondboogvormig bovenlicht, brede uitkragende natuurstenen band, kleine rondboogvensters, rondboogfries, bloktandlijsten, platte natuurstenen banden en een kleinere rondboogfries, reservoir met staande zesruitsvensters, kantelen in 1959 verwijderd, ijzeren reling.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Doorn)): Woestduinlaan, 1902, Visser & Smit Hanab, 30 m, 150 m³, gerenoveerd 1959, rijksmonument sinds 1998.
- BAG-pand 1581100000018088 (PDOK, 2026-11-06): ronde voetafdruk van 3,55 m en de aanbouw.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld en verhoging, plat dak (NAP +36,91; reling tot +37,3), straal van het reservoir, dak en tuitgevel van de aanbouw.
- Foto's op Wikimedia Commons: "Doorn - Watertoren Woestduinlaan 55 RM508750.JPG" (recht op de ingang: geledingen, aanbouw met tuitgevel en tuit, vensters, friezen, banden, reservoir), "Doorn Watertoren 9587.JPG" en "Doorn Woestduinlaan 55.jpg" (andere zijden, vensters in voet en schacht, de verhoging).

## Geschat en weggelaten

Geschat: alle hoogtes tussen het maaiveld en de dekplaat (band, vensters, friezen, bloktandlijsten, natuurstenen band, reservoirvensters) als fractie van de hoogte tussen dorpel en dakrand op de frontale foto (die verticaal uitgerekt lijkt; onzekerheid circa een halve meter); de stralen van schacht, friezen en banden als verhouding tot de voet (BAG) en het reservoir (4,0 m, tussen het DTM-gat van 3,65 m en de DSM-rand van 3,8 à 4,1 m); het aantal bogen (twaalf en zestien, op de foto circa dertien en 26) en reservoirvensters (twaalf); de vensters op de zijden die niet op de foto staan; de dakhelling van de aanbouw (31 graden) uit het DSM. De bovenste schachtvensters staan 0,6 m lager dan op de foto, zodat hun plafond onder de consoles van de rondboogfries blijft.

Weggelaten: de ijzeren reling en de bliksemafleider op het dak (dunner dan 0,9 m), de witgeschilderde banden rond het reservoir (alleen kleur), de oculi in de velden van de rondboogfries, de bloktanden zelf (alleen de lijst), de eerste steen boven de deur, de trap voor de deur (in het terrein), de vensterdorpels en de verhoging (zit in het PDOK-terrein). Het pomphuis (rijksmonument 508751) is een apart pand en hoort niet bij dit model.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een eerste versie met een naar voren uitkragende dekplaat en tuit en met vensterplafonds tot in de band en de consoles liet de export daar opvullen. Een export op 1:1000 (80 m uitsnede) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte cilinder tot 29 m met een blokje als aanbouw) de verjongende voet met band en vensters, de aanbouw met zadeldak, tuitgevel, tuit en deur, de taps toelopende schacht met vensters, de rondboogfries op lisenen, de uitkraging met de kleinere rondboogfries en de banden, en het bredere reservoir met vensters en dekplaat.

Controle-URL: http://localhost:3000/kaart/52.04208/5.33079/200/1x1/0
