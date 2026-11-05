# Watertoren Borne (Borne)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-borne.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, band en reservoirdeel zijn ronde prisma's (64 zijden), lisenen, consoles, sluitstenen en luifel zijn blokken met een schuine onderkant, en het dak is de convexe omhullende van een zestienhoek en de top.

De watertoren aan de Watertorenstraat in Borne is in 1932 gebouwd naar ontwerp van J.H.J. Kording, door de plaatselijke aannemer Groothengel (volgens Wikipedia mede gekozen om in de crisis werk in Borne te houden). Hij is 36,5 m hoog met een reservoir van 240 m³ en is gemeentelijk monument. Een ronde bakstenen toren van 10,1 m doorsnede: een lage plint, een gladde schacht met op vier assen een smalle lichtstrook, een sluitsteen onder een uitkragende band, en het reservoirdeel met op elke as een groep van drie lisenen met twee hoge vensters die boven de borstwering uitsteekt, geflankeerd door bredere lisenen, en blokvormige consoles langs de bovenrand. Daarbinnen een zestienzijdig koperen tentdak met een makelaar; aan de zuidzuidwestkant de ingang met een luifel.

## Bestanden

- `watertoren-borne.glb`: één node `building:ronde-schacht-reservoirdeel-lisenen-dak-en-ingang`, op maaiveld.
- `watertoren-borne.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-borne-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [248908.68, 479836.94] (52,29848 N, 6,76394 O), het hart van BAG-pand 0147100000011259 (cirkelfit op 38 hoekpunten, straal 5,05 m, afwijking hooguit 5 cm). De coördinaten op Wikipedia (52,29833 N, 6,76361 O) liggen 28 m zuidwestelijk. Maaiveld AHN-DTM NAP +15,7 (ring van 6 tot 9,5 m: 15,66 tot 15,97, mediaan 15,77; 3D BAG 15,65). Lokale +X wijst naar RD -24 graden, een van de vier assen met een lisenengroep; de assen staan op RD -24, 66, 156 en 246 graden. Die richting volgt uit twee Commons-foto's met bekende standplaats ("Watertoren Borne.jpg" vanuit het oosten en "Watertoren aan de Watertorenstraat te Borne.jpg" vanuit het noordnoordwesten), die de lichtstroken elk op circa 45 graden links en rechts van de kijkrichting tonen, en uit het AHN-DSM, dat de hoogste randpunten (de groepen boven de borstwering) op 330-345 en 60-75 graden heeft. De ingang zit op de as naar -Y (RD 246 graden), aan de kant van het pad naar het pompgebouw in het zuiden. `groundHeight` 58,8 is NAP +15,7 plus de geoïdehoogte (circa 43,1 m, zoals gemeten bij Watertoren Almelo 1924). Het model vervangt BAG-pand 0147100000011259, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:ronde-schacht-reservoirdeel-lisenen-dak-en-ingang`

Stralen vanaf het hart, hoogtes boven maaiveld.

- Plint: straal 5,05 m (de BAG-contour) tot 1,2 m, met een schuine bovenkant naar de schacht.
- Schacht: straal 4,9 m tot 23,0 m. Op de vier assen een lichtstrook van 0,5 m breed van 3,6 tot 22,2 m, als nis van 0,3 m. Daarboven een sluitsteen van 1,0 m breed die 0,25 m uitsteekt, met een onderkant van 50 graden, tot onder de band.
- Band: straal 5,2 m van 23,0 tot 24,0 m, met een onderkant van 45 graden vanaf de schacht.
- Reservoirdeel: straal 5,0 m van 24,0 tot de borstwering op 32,0 m.
- Lisenengroepen (vier): 2,6 m breed, voorvlak 0,25 m voor de gevel, 0,95 m dik, vanaf de band (onderkant 45 graden) tot 33,0 m. Twee vensters van 0,45 m tussen de lisenen van 25,2 tot 31,2 m, als nis van 0,35 m; boven de borstwering tussen de lisenen een inkeping van 0,45 m breed en 0,3 m diep vanaf 32,4 m.
- Flankerende lisenen (acht): 0,9 m breed en dik, 0,15 m voor de gevel, op 20 graden naast elke as, van 24,0 tot 32,4 m.
- Consoles (acht): 0,9 m breed, 0,25 m uit, onderkant 45 graden, van 31,3 tot 32,3 m, op 35 en 55 graden van elke as.
- Dak: zestienzijdige piramide, apothema 4,3 m op 32,0 m, top op 35,65 m (circa 40 graden, zoals het AHN-DSM).
- Makelaar: zestienzijdige voet van 1,0 m doorsnede tot 35,8 m en een punt op 36,5 m (de hoogte op Wikipedia).
- Ingang (-Y): deurnis van 2,0 m breed tot 2,3 m en 0,4 m diep; luifel van 3,0 m breed die 0,7 m voor de plint uitsteekt, met een onderkant van 56 graden van 2,9 m aan de gevel tot 3,95 m aan de voorkant en een bovenkant op 4,2 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Borne)): 1932, J.H.J. Kording, aannemer Groothengel, 36,5 m, 240 m³, Watertorenstraat 28.
- BAG-pand 0147100000011259 (PDOK, 2026-11-05): ronde plattegrond, straal 5,05 m, bouwjaar 1930 in de BAG.
- 3D BAG NL.IMBAG.Pand.0147100000011259: maaiveld NAP +15,65, hellend dak, h_dak_max NAP +51,24.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): maaiveld NAP +15,7, borstwering NAP +47,7 (32,0 m), dakprofiel van 31,9 m op 4 m tot 35,9 m in het midden, en de hoogste randpunten op de assen van de groepen.
- Luchtfoto's (actueel, 2023, 2022, 2021): ronde borstwering met consoles, zestien dakvlakken binnen een goot, lisenengroep op de wand, het pad naar het zuiden.
- Foto's op Wikimedia Commons: RCE 20297461 en 20297462 (1987: lichtstrook, ingang met luifel, band, sluitsteen, lisenengroep met twee vensters, flankerende lisenen, consoles, makelaar), RCE 20427884 (1983, van afstand: geledingen en tentdak), "Watertoren Borne" (2007) en "Watertoren aan de Watertorenstraat te Borne" (2016) voor de richting van de assen.

## Geschat en weggelaten

Geschat: de hoogtes van plint, band, vensters, consoles, inkepingen en luifel uit schuine foto's met de schaal uit de doorsnede van de toren (onzekerheid circa een halve meter); de straal van schacht en reservoirdeel (4,9 en 5,0 m) en de uitsprong van band en lisenen; de richting van de assen (circa 10 graden onzeker) en welke as de ingang heeft; de vorm van de makelaar. De consoles zijn grover dan in het echt: twee van 0,9 m per kwadrant in plaats van een rij kleinere blokjes, en de lisenen in de groep zijn als één blok met verdiepte vensters en inkepingen gemodelleerd omdat ze in het echt circa 0,55 m breed zijn. De luifel zit 0,6 m boven de deur, zodat hij niet boven de deurnis hangt.

Weggelaten: de antennemasten op het dak (dunner dan 0,9 m), het hekwerk voor de ingang, de goot tussen borstwering en dak en de kleinere vensterroeden. Het pompgebouw ten zuiden is een eigen BAG-pand en blijft de PDOK-reconstructie.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: band, lisenengroepen en consoles met een onderkant van 45 graden, sluitstenen en luifel steiler, nissen met een plafond van 63 graden, dak en makelaar verjongend. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een kegeldak) de plint, de lichtstroken met sluitstenen, de band, de lisenengroepen met vensters boven de borstwering, de flankerende lisenen, de consoles, het zestienzijdige dak met makelaar en de ingang met luifel.

Controle-URL: http://localhost:3000/kaart/52.29848/6.76394/200/1x1/0
