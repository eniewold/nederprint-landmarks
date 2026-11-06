# Watertoren Turfmarkt (Zwolle)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zwolle-turfmarkt.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de plint en de schacht zijn een omwentelingsvorm van een radiaal profiel (96 segmenten), de schuine onderkant, de opbouw, de dakrand en het tentdak convexe omhullenden van tienhoeken, de consoles convexe omhullenden, de aanbouw een prisma op de BGT-contour, de vensters blinde nissen met een schuin plafond.

De voormalige watertoren aan de Turfmarkt werd in 1892 gebouwd naar een ontwerp van Jan Schotel, 36 m hoog met een reservoir van 500 m³. In 1935 gerenoveerd, in 1959 omgeven door een tienhoekige stenen mantel en sinds 1996 buiten gebruik. Tussen juli 2017 en november 2018 is hij omgebouwd tot 21 appartementen: het onderste deel is in de oorspronkelijke staat hersteld, het bovenste deel is nieuwbouw (Erfgoedprijs Zwolle en Kampen 2019). Het model toont de toestand sinds 2018: de ronde, onderaan uitlopende bakstenen schacht op een natuurstenen plint, met een natuurstenen band, vensters en gekoppelde rondboogvensters met een medaillon op de begane grond; tien donkere consoles op de hoeken; een tienhoekige opbouw van vijf lagen in rode gevelplaten met lichte banden; een terugliggende glazen bovenste laag onder een overstekende, naar buiten hellende dakrand; een flauw tienzijdig tentdak van zink; aan de noordkant een lage aanbouw met een plat dak.

## Bestanden

- `watertoren-zwolle-turfmarkt.glb`: één node, `building:watertoren-schacht-consoles-opbouw-dak-en-aanbouw`.
- `watertoren-zwolle-turfmarkt.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-zwolle-turfmarkt-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [203684.3, 503011.32] (52,51261 N, 6,10437 O): het hart van de ronde schacht, de cirkel door de actuele BGT-contour van pand 0193100000026499 (straal 6,38 m, de plint), die samenvalt met het hart van de tienhoekige BAG-contour (straal 8,54 m, de opbouw, 6 cm ernaast). Maaiveld NAP +1,6 (AHN-DTM rondom 1,5 à 1,6). Lokale +X wijst naar RD-richting 5,92 graden, naar een hoek van de tienhoek (de BAG-hoekpunten liggen op 5,92 + 36k graden, de dakrand op de luchtfoto ook); +Y naar 95,92 graden (noord). De aanbouw ligt lokaal tussen 36 en 110 graden.

`groundSamplePoints` liggen op 7,5 m oost, west en zuid en op 7,5 m noordwest, buiten de aanbouw; `groundHeight` 44,24 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 44,24, noordwest 44,27, west 44,45, zuid 44,67; gemeten 2026-11-06). Aan de zuidkant loopt het grastalud naar het water 0,4 m hoger op; de plint zakt daar verder in. `groundOffsetMetres` is -0,1.

## Onderdelen

Hoogtes boven het maaiveld (NAP +1,6), stralen vanaf het hart.

- Plint: 6,38 m tot 1,15 m, schuin naar de schacht van 6,2 m op 1,4 m.
- Schacht: uitlopend van 6,2 m op 1,4 m via 5,9 m op 3,8 m en 5,75 m op 5,85 m naar 5,45 m op 8,0 m, daarboven recht verjongend tot 5,13 m op 19,1 m. Natuurstenen band van 5,78 m van 6,8 tot 8,0 m (onderkant 50 graden).
- Begane grond: vier ondiepe rondboogvelden van 2,3 m (tot 6,0 m) met elk twee rondboogvensters van 0,75 m (1,45 tot 4,2 m), op de even hoekpunten (0, 144, 216 en 288 graden; niet aan de kant van de aanbouw).
- Vensters in de schacht: tien van 0,9 m van 6,75 tot 8,8 m (door de band) en tien van 12,1 tot 14,6 m tussen de consoles (18 + 36k graden); vijf gekoppelde van 1,1 m van 9,5 tot 12,0 m op de even hoekpunten; tien smalle van 0,7 m van 14,9 tot 15,6 m onder de consoles.
- Schuine onderkant: omhullende van de schacht op 17,0 m en de onderrand van de gevel (0,1 m buiten de tienhoek) op 20,8 tot 21,15 m; 50,6 graden midden op de zijden, 47 graden onder de hoeken.
- Consoles: tien van 0,9 m breed op de hoeken, van de schacht op 16,25 m tot de hoek van de tienhoek, onderkant 50 graden.
- Opbouw: gevelplaten op de BAG-tienhoek (apothema 8,12 m, hoek 8,54 m) van 20,8 tot 33,6 m, lichte band 0,1 m uit van 27,05 tot 27,35 m en bovenrand van 33,25 tot 33,6 m. Op zes zijden een kolom vensters van 1,75 m breed (21,6 tot 26,7 en 27,6 tot 32,5 m, elk twee lagen).
- Glazen bovenste laag: tienhoek met apothema 7,75 m van 33,6 tot 34,95 m.
- Dakrand: schuine onderkant (48 graden) van het glas naar 8,6 m op 35,9 m, naar buiten hellend profiel tot de dakrand van 8,85 m (hoek 9,31 m) op 36,84 m (AHN NAP +38,44).
- Tentdak: tien vlakken van de dakrand tot de top op 40,7 m (AHN NAP +42,3; circa 23,5 graden, het AHN geeft 0,42 à 0,45 m per m).
- Aanbouw: de BGT-contour buiten de schacht, plat dak op 5,5 m (AHN NAP +7,1).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Zwolle)): 1892, Jan Schotel, 36 m, 500 m³, mantel 1959, buiten gebruik 1996, appartementen 2017-2018.
- BAG-pand 0193100000026499 (PDOK, 2026-11-06): tienhoek met straal 8,54 m (de mantel van 1959, nu de opbouw).
- BGT-pand (OGC API, actuele versie, 2026-11-06): ronde schacht met straal 6,38 m en de aanbouw aan de noordkant.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld, dakprofiel per halve meter straal (dakrand NAP +38,4 op 9 m, top +42,3), aanbouw NAP +7,1.
- PDOK-luchtfoto: tienzijdig tentdak met staande naden, dakrand, richting van de hoeken.
- Foto op Wikimedia Commons "Voormalige watertoren Turfmarkt Zwolle.jpg" (2020, vanuit het zuid-zuidwesten over het water): de geledingen van schacht, consoles, opbouw en dakrand. Horizontaal 46,4 px/m (de breedte van de opbouw, 16,6 m, klopt met de BAG-tienhoek; de plint met de BGT-cirkel), verticaal 47,5 px/m in de opbouw (verankerd op de dakrand in het AHN) en 49,5 px/m in de schacht (vanaf het maaiveld).
- Oudere foto's op Commons: "Overzicht watertoren voorzijde - Zwolle - 20329066 - RCE.jpg" en "Zwolle Watertoren 1907.jpg" (de oorspronkelijke ronde schacht), "Watertoren Zwolle.JPG" en "20150819 Watertoren Zwolle.jpg" (de mantel van 1959).

## Geschat en weggelaten

Geschat: alle hoogtes tussen het maaiveld en de dakrand en de stralen van de schacht boven de plint komen uit één schuin omhoog genomen foto (onzekerheid circa een halve meter, vooral de onderkant van de opbouw op 20,8 m); er is maar één recente foto, dus de vensters op de zijden die niet te zien zijn (vensterkolommen op zes van de tien zijden, het ritme van de vensters in de schacht rondom, de vier vensterparen op de begane grond) zijn doorgetrokken van de zichtbare zuid- en zuidwestkant; de diepte van de terugliggende glazen laag en het profiel van de dakrand uit de foto en de luchtfoto. De schuine onderkant van de opbouw is een keuze voor de print: in werkelijkheid hangt de opbouw met een vlakke onderkant op de tien gebogen consoles; met de schuine onderkant print hij zonder steun, en de bovenste vensterrij van de schacht (18,2 tot 20,2 m) en het zigzagmetselwerk daarboven vallen erachter weg.

Weggelaten: de ronde schijven op de consoles, de gedecoreerde lateien en het zigzagmetselwerk (kleiner dan 0,9 m), het medaillonpatroon, de kozijnen en borstweringen (vlak, alleen kleur), het balkon met glazen borstwering aan de zuidkant van de bovenste laag, de drie lichtkoepels en het ventilatiekastje op het dak (circa 1 m breed en 0,3 m hoog), de bliksemafleider, het kleine ronde portaal aan de noordwestkant van de plint (BGT, binnen de plint op 0,1 m na) en de deur van de aanbouw (plaats onbekend).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een losse onderrand van de gevel met een eigen schuine kant (0,12 m hoog, 0,1 m uit) liet de export eerst de hele schuine onderkant in lagen van 0,2 mm opvullen (7,8 m³); nu is die rand het bovenste stuk van de schuine onderkant. In een export op 1:1000 (120 × 120 m) staat het model erin zonder ondersteuningsobject en is het PDOK-pand weg. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte tienhoekige zuil met een flauw dak) de plint, de smallere ronde, onderaan uitlopende schacht met band en vensters, de consoles en de uitkragende opbouw, de banden en vensterkolommen, de terugliggende glazen bovenste laag, de overstekende dakrand en de aanbouw.

Controle-URL: http://localhost:3000/kaart/52.51261/6.10437/200/1x1/0
