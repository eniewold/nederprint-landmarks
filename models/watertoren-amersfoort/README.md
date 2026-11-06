# Watertoren Amersfoort (Amersfoort)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-amersfoort.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schil, lijsten, balustrade en dak zijn omwentelingsvormen van een radiaal profiel; spaarvelden, vensters, deuren, klossen, hoge balustradedelen en de dakopbouw zijn losse bouwdelen.

De watertoren aan de Utrechtseweg 174 staat op het hoogste punt van de Amersfoortse Berg (NAP +44,75). Hij is in 1912 gebouwd voor het Gemeente Waterleiding Bedrijf, naar een ontwerp van Gemeentewerken (gemeentearchitect C.G. Beltman), en uitgevoerd door T. van Hoogevest. Rijksmonument 517738. Door de hoge ligging is de toren maar 17 m hoog en breed: een bakstenen schil in overgangsarchitectuur met neoromaanse motieven rond een stalen Intze-reservoir van 700 m³. Volgens het register: een voet van één bouwlaag op een lage plint met dubbele rondboogvensters en twee ingangspartijen, een cordonlijst, acht spaarvelden met een rondboogfries tussen lisenen met een zeer langwerpig venster, een door klossen gedragen gootlijst met kleine vensters en een verspringende balustrade, met de hoogste delen boven de lisenen.

## Bestanden

- `watertoren-amersfoort.glb`: één node `building:watertoren-voet-spaarvelden-lisenen-gootlijst-en-balustrade`, op maaiveld.
- `watertoren-amersfoort.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-amersfoort-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [153551.1, 461702.53] (52,14351 N, 5,36604 O), het hart van de BAG-cirkel van pand 0307100000343441 (straal 7,40 m); het platte dak ligt in het AHN-DSM concentrisch. Maaiveld AHN NAP +44,75 (DTM rondom 44,74 à 44,85). Lokale +X wijst naar RD-richting 45 graden (noordoost), +Y naar 135 graden (noordwest): naar de Utrechtseweg (op 43 graden) en de inrit (op 140 graden), met de hoofdingang. `groundHeight` 87,92 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 9 m (noordwest 87,92, noordoost 88,03, zuidoost 88,09, zuidwest 88,17); het PDOK-pand begint op 87,84. Het model vervangt BAG-pand 0307100000343441; de buurpanden (het voormalige pomphuis en de bijgebouwen aan de oostkant) staan 10 m of verder van de toren, zijn 3 tot 11 m hoog en raken het model niet.

## Onderdeel `building:watertoren-voet-spaarvelden-lisenen-gootlijst-en-balustrade`

Maten in het lokale stelsel, hoogtes boven maaiveld. Acht traveeën met het midden van een veld op 90 + 45k graden (de ingang +Y midden in een veld).

- Plint: straal 7,2 m tot 0,45 m, schuin afgezet naar de voet.
- Voet: straal 7,1 m tot de cordonlijst. Per travee een dubbel rondboogvenster (2 × 1,2 m breed op ±0,8 m, borstwering 1,1 m, kruin 3,7 m). In de hoofdingang (+Y) en de tweede ingang (-Y) een deur onder een grote rondboog (1,6 m breed, kruin van het bovenlicht 3,4 m) tussen twee kleine rondboogvensters (0,55 m, kruin 2,8 m); een stoep van 2,4 × 1,0 m voor de hoofdingang.
- Cordonlijst: tot straal 7,28 m, van 5,6 tot 6,1 m, onderkant onder 50 graden.
- Schil rond het reservoir: straal 7,0 m tot 15,0 m. Acht spaarvelden van 4,5 m breed, 0,2 m diep, van 6,5 m tot de rondboogfries (vijf boogjes van 0,9 m per veld, aanzet 13,2 m, kruin 13,65 m); lisenen van 1,0 m ertussen. In elk veld twee kleine vierruitsvensters (0,6 × 0,7 m op 7,0 m) en daarboven twee dichtgezette rondboogvensters (0,6 m, 9,2 m tot kruin 11,8 m), op ±0,9 m van het midden. In elke lisene een langwerpig rondboogvenster van 0,45 m, van 7,2 tot 12,2 m.
- Zestien klossen (0,5 m breed, tot straal 7,4 m, van 14,0 tot 15,0 m, onderkant 50 graden) boven de lisenen en de veldmiddens, onder de gootlijst (tot straal 7,45 m, van 15,0 tot 15,35 m, onderkant 50 graden).
- Balustrade: ring van 6,45 tot 7,35 m tot 16,05 m (AHN NAP +60,8), met hoge delen van 1,2 m breed boven de lisenen tot 16,6 m (AHN NAP +61,35).
- Dak: plat, van 15,4 m aan de balustrade tot 15,6 m in het midden (AHN NAP +60,1 tot +60,35).
- Dakopbouw: een vierkant hokje van 3,6 m in het midden met een tentdak tot 17,2 m (3D BAG max NAP +61,94) en ten noordoosten ervan een installatieblok van 1,4 × 3,0 m tot 16,5 m.
- Vensters en deuren zijn nissen van 0,25 tot 0,35 m diep met een plafond van 56 tot 63 graden; de rondboogfries snijdt de velden met een schuin oplopend boogplafond.

## Bronnen en maten

- [Rijksmonumentenregister 517738](https://monumentenregister.cultureelerfgoed.nl/monumenten/517738): bouwjaar, ontwerper, cilinder van 12 m doorsnede en 17 m hoog, Intze-reservoir, indeling van voet, schil, gootlijst en balustrade, twee ingangspartijen.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Amersfoort)): Utrechtseweg 174, 1912, 17 m, 700 m³.
- BAG-pand 0307100000343441 (PDOK, 2026-11-06): cirkel met straal 7,40 m (de dakrand; de 12 m uit het register is te klein: AHN en luchtfoto geven circa 15 m over de gootlijst en balustrade).
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, dak, balustrade.
- 3D BAG (2026-11-06): dak 50p NAP +60,44, max +61,94 (de dakopbouw).
- Luchtfoto (PDOK, 2026-11-06): dakopbouw met tentdak, installaties en zonnepanelen; inrit en weg aan de noordwestkant.
- PDOK-gebouwtegel (2026-11-06): cilinder met een blok van circa 5 × 5 m tot 17,4 m op het dak.
- Foto's op Wikimedia Commons: "Overzicht van de watertoren - Amersfoort - 20536320 - RCE" (geledingen, 50,9 px/m op de voorkant, op de AHN-balustrade gezet), "Overzicht van de watertoren - Amersfoort - 20536319 - RCE", "Amersfoort - Watertoren 1" en "Amersfoort - Watertoren 2" (frontaal op de hoofdingang), "Amersfoort4840" (cordonlijst, reliëf, bovenlicht), "Amersfoort4839" (tweede deur) en "Amersfoort4830".

## Geschat en weggelaten

Geschat: alle hoogtes van de geveldelen (cordonlijst, velden, vensters, rondboogfries, klossen, gootlijst) uit de RCE-foto, geschaald op de AHN-balustrade (op circa 0,3 m nauwkeurig); de stralen van voet (7,1), schil (7,0) en velden (6,8) uit de foto's en de BAG-dakrand; de richting van de hoofdingang uit de weg en de inrit (op circa 5 graden); de plaats van de tweede ingang (tegenover de hoofdingang aangenomen, alleen van dichtbij gefotografeerd); de dakopbouw (maat en richting uit de luchtfoto en de PDOK-reconstructie, hoogte uit de 3D BAG; het AHN-DSM toont hem nog niet); de balustrade 0,9 m dik in plaats van circa 0,4 m, zodat hij op 1:1000 printbaar is.

Weggelaten: de kleine vensters in de fries tussen de klossen (circa 0,45 × 0,4 m; tussen de rondboogfries en de 50-gradenonderkant van de gootlijst is geen ruimte voor een nis met een schuin plafond), het reliëf "Gemeente-Waterleiding" boven de hoofdingang (0,05 m reliëf), het meanderfries onder de cordonlijst, roedenverdelingen en lateien, de zonnepanelen, schotelantennes en de antennemast op het dak (kleiner dan 0,9 m), en het voormalige pomphuis en de bijgebouwen (aparte panden).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder tot 15,8 m met een blok op het dak) aan elke kant de plint, de vensters en deuren in de voet, de cordonlijst, de spaarvelden met rondboogfries en vensters, de lisenen met de langwerpige vensters, de klossen, de gootlijst en de verspringende balustrade.

Controle-URL: http://localhost:3000/kaart/52.14351/5.36604/200/1x1/0
