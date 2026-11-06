# Watertoren Oldenzaal (Oldenzaal)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oldenzaal.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, band, schacht, ring, kraag, rand en kop zijn omwentelingsvormen van een radiaal profiel (96 segmenten), de ribben, consoles, kantelen, deuromlijsting en dakopbouw convexe omhullenden en blokken, de vensters en de deur blinde nissen met een schuin plafond.

De watertoren aan de Watertorenstraat werd in 1905 gebouwd naar ontwerp van J.P. Hazeu; volgens Wikipedia is hij 31,7 m hoog met een reservoir van 250 m³. In 2003 moest de kop op last van de gemeente worden verwijderd omdat er brokstukken afvielen; in 2006 is hij herbouwd met vier woonlagen (BAG-bouwjaar 2004). Sindsdien heeft de kop kantelen met een hek op het dakterras; de foto van de RCE uit 1987 toont de oude kop met een vlakke rand. Een ronde toren van rode baksteen: een gebatterde voet met een donkere plint, een deur met natuurstenen omlijsting en een rondboogvenster; een zware natuurstenen band met een profiellijst; een licht taps toelopende schacht met een kolom trapvensters en paren rondboogvensters; een natuurstenen ring en daarboven een uitlopende kraag met witte ribben en oculi onder een overstekende witte rand. Op die rand de bredere kop met een gele zigzagband, witte banden, twaalf hoge vensters, een boogfries met hangende consoles en een borstwering met twaalf kantelen.

## Bestanden

- `watertoren-oldenzaal.glb`: één node, `building:watertoren-voet-schacht-kraag-en-kop`.
- `watertoren-oldenzaal.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-oldenzaal-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [260344.31, 481191.385] (52,30858 N, 6,93195 O), het hart van het ronde BAG-pand 0173100000132934 (30 punten, straal 4,31 m), op het maaiveld: AHN-DTM NAP +50,2 (50,1 tot 50,4 tussen 4 en 10 m). Het vlakke dak in het AHN-DSM ligt 0,5 m ten noorden van het hart, binnen de randruis. Het lokale stelsel valt samen met RD: +X oost, +Y noord, `xAxis` [1, 0]. Hoeken hieronder zijn RD-richtingen (0 = oost, 90 = noord).

`groundSamplePoints` liggen op 6,5 m oost, west, noord en zuid; `groundHeight` 93,54 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (93,54 tot 93,62, gemeten 2026-11-06; het PDOK-pand begint op 93,45). `groundOffsetMetres` is -0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +50,2).

- Voet: plint 4,33 m tot 1,0 m, gebatterde gevel van 4,28 m op 1,0 m tot 4,12 m op 6,0 m. Deur naar 275 graden: rondboognis van 1,3 m tot 2,65 m in een natuurstenen omlijsting van 2,2 m breed en 0,15 m uit, schuin afgedekt tot 3,4 m. Rondboogvenster van 0,9 m van 1,5 tot 3,9 m naar 145 graden.
- Natuurstenen band: profiellijst 4,42 m van 6,0 tot 6,6 m, vlakke band 4,24 m tot 7,45 m, schuin terug naar de schacht op 7,75 m.
- Schacht: taps van 3,72 m op 7,75 m tot 3,64 m op 21,03 m. Kolom trapvensters naar het noorden (0,9 m breed, 11,4 tot 19,85 m); paren rondboogvensters van 0,7 m (hart op hart 1,1 m) van 12,6 tot 14,4 m naar 139 en 229 graden en van 18,3 tot 20,0 m naar 229 graden.
- Natuurstenen ring: 3,88 m van 21,03 tot 21,73 m.
- Kraag: uitlopend onder 50 graden van 3,85 m op 21,73 m tot 4,85 m op 22,93 m, met twaalf ribben van 0,4 m breed en 0,12 m uit (op 15 + 30k graden).
- Rand: 5,0 m van 23,12 tot 23,8 m, schuin naar de kop op 23,94 m.
- Kop: 4,45 m van 23,94 tot 31,85 m. Witte banden 0,1 m uit op 24,9–25,2, 29,6–29,9 en 30,55–30,85 m; twaalf vensters van 0,7 m breed (nis) van 25,35 tot 28,2 m op 15 + 30k graden; boogfries 0,12 m uit van 28,85 tot 29,45 m met twaalf hangende consoles van 0,5 m tot 28,15 m op 30k graden.
- Dakterras op 31,5 m (AHN NAP +81,7) binnen een borstwering van 0,9 m dik tot 31,85 m; twaalf kantelen van 1,0 m breed tot 32,75 m op 30k graden; dakopbouw van 1,5 bij 1,3 m ten noorden van het hart tot 32,2 m (AHN NAP +82,4).

Profiellijst, ring, banden en fries hebben een onderkant van 50 graden, de kraag en ribben lopen onder 50 graden uit, de nissen hebben een schuin plafond.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Oldenzaal)): 1905, J.P. Hazeu, 31,7 m, 250 m³; kop in 2003 verwijderd en in 2006 herbouwd als woning.
- BAG-pand 0173100000132934 (PDOK, 2026-11-06): ronde voetafdruk, straal 4,31 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +50,2, dakterras NAP +81,7 (31,5 m; vlak tot circa 3 m van het hart), dakopbouw NAP +82,4, kop en rand tot circa 4,4 à 5 m in de randruis (oppervlak boven NAP +70: equivalente straal 4,43 m).
- Foto's op Wikimedia Commons: "Oldenzaal, de watertoren foto2 2013-04-22 18.16.jpg" (vanuit het noordwesten van onderaf; schaal per beeldregel 43 tot 53 px/m uit de schachtbreedte, verankerd op de BAG-voet en de kantelen: hoogtes van alle geledingen en breedteverhoudingen), "Oldenzaal, de watertoren IMG 7374 2020-08-10 17.41.jpg" (GPS-standpunt 39 m west, 34 m noord: richting van de trapkolom, het vensterpaar, de twaalf vensters en kantelen), "Watertoren (water tower) - panoramio.jpg" (2007, vanuit het zuiden: deur, tweede vensterpaar), "2006-07-15 14.53 Oldenzaal,toren.JPG" (nieuwe kop) en "Exterieur OVERZICHT - Oldenzaal - 20297190 - RCE.jpg" (1987, oude kop).

## Geschat en weggelaten

Geschat: de stralen van voet (4,28 tot 4,12 m), schacht (3,72 tot 3,64 m), kop (4,45 m) en rand (5,0 m) uit breedteverhoudingen op foto's van onderaf, verankerd op de BAG-cirkel en gecontroleerd tegen de randruis in het AHN (onzekerheid circa 0,2 m); alle hoogtes tussen de voet en de kantelen uit één foto met een lineair verlopende schaal (circa 0,3 m); de kantelen (in het echt circa 0,7 m hoog, hier 0,9 m voor de print); het aantal en de richting van de vensters, ribben en kantelen (twaalf, uit twee foto's met bekend standpunt); de plaats van de deur en het tweede vensterpaar (foto zonder betrouwbaar standpunt).

Weggelaten: de oculi in de kraag (circa 0,5 m), het hek op het dakterras en het hekje van de deur (leuningen, te dun voor 1:1000), de gele zigzagband en de gele bogen van het fries (alleen kleur, vlak in de gevel), de getrapte uiteinden van de hangende consoles, de kozijnen en roeden.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling het volume niet. Een export op 1:1000 (90 bij 90 m rond de toren) verbergt het PDOK-pand en geeft een ondersteuningsobject met een volume van vrijwel nul (een randje aan de deuromlijsting). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte cilinder van 4,3 m tot 31,6 m) de gebatterde voet met plint, deur en venster, de natuurstenen band, de dunnere schacht met trapvensters en vensterparen, de ring, de uitlopende kraag met ribben, de overstekende rand, de bredere kop met banden, vensters en boogfries, het dakterras met dakopbouw en de twaalf kantelen.

Controle-URL: http://localhost:3000/kaart/52.30858/6.93195/200/1x1/0
