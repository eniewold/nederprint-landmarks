# Watertoren Enschede Hoog & Droog (Enschede)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-enschede-hoog-en-droog.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, schacht, rondlijst, reservoir en lantaarn zijn omwentelingsvormen van een radiaal profiel (96 segmenten), het dak een rechte kegel van 24 vlakken uit het AHN, de stoep blokken, de vensters, oculi, deur en reservoirvelden blinde nissen met een schuin plafond.

De watertoren aan Hoog en Droog (nr. 28) in de wijk De Bothoven werd in 1890 (tot 1891) gebouwd naar ontwerp van N. Biezeveld. Hij is gemeentelijk monument, volgens Wikipedia 40 m hoog, met een ijzeren hangbodemreservoir van 300 m³ (andere bronnen: 600 m³), in 1956 gerenoveerd en sinds 2019 in gebruik als kantoor. Een ronde toren van rode baksteen met lichte natuurstenen banden: een onderbouw met plint, rondboogvensters, een deur met waaierlicht en een kroonlijst; een vrijwel rechte schacht met banden en drie rijen vensters; bovenaan een krans van ronde venstertjes met muurankers en een zware rondlijst; een ommanteld reservoir met verdiepte velden tussen lisenen in twee rijen, kleine vensters en een kroonlijst; een vlak koperen kegeldak met een kleine ronde lantaarn.

## Bestanden

- `watertoren-enschede-hoog-en-droog.glb`: één node, `building:watertoren-onderbouw-schacht-reservoir-dak-en-lantaarn`.
- `watertoren-enschede-hoog-en-droog.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-enschede-hoog-en-droog-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [258635.31, 471443.9] (52,22132 N, 6,90391 O), het hart van het ronde BAG-pand 0153100000204953 (cirkel van 60 punten, straal 6,17 m; dezelfde cirkel staat sinds 2016 in de BGT), op het maaiveld: AHN-DTM NAP +46,88 (46,75 tot 46,95 tussen 6,5 en 12 m; een vlak plein). Lokale +X wijst naar het oosten, +Y naar het noorden. De deur staat op -116 graden (zuid-zuidwest).

Het hoge deel van het AHN-DSM (reservoir, dak en lantaarn) ligt 1,1 m westelijker dan de BAG-cirkel. De schuine luchtfoto's van 2022 tot 2026 tonen het dak recht boven de voet en het lage pand ten zuiden ligt in hetzelfde DSM wel op zijn BAG-contour; de toren staat daarom op de BAG-cirkel en de maten van het dak komen uit het DSM rond zijn eigen top (RD 258634,25 471444,0).

`groundSamplePoints` liggen op 8 m oost, noord, west en zuid; `groundHeight` 90,40 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (90,40 tot 90,46, gemeten 2026-11-06). `groundOffsetMetres` is -0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +46,88).

- Onderbouw: plint 6,17 m (BAG) tot 0,8 m, gevel 6,1 m, kroonlijst 6,3 m van 5,6 tot 6,0 m. Zes rondboogvensters van 0,9 m (1,9 tot 3,9 m) op -86 + 60k graden; de deur van 1,6 m met een rondboog tot 4,2 m op -116 graden, met een stoep van twee treden van 2,2 m breed.
- Schacht: 6,0 m op 6,0 m tot 5,85 m op 23,9 m. Zes natuurstenen banden van 0,3 m, 0,12 m uit, op 9,65, 12,45, 16,3, 18,4, 20,7 en 21,9 m. Rondboogvensters van 0,9 m: zes van 6,8 tot 9,3 m boven de deur en elke 60 graden, zes van 13,5 tot 15,8 m 30 graden verspringend, zes kleine rechte van 18,9 tot 20,2 m boven de onderste. Twaalf oculi van 0,9 m rond 22,85 m.
- Rondlijst: van 5,85 m op 23,9 m onder 42,5 graden uit het lood naar 6,4 m op 24,5 m, tot 24,75 m.
- Reservoir: 6,3 m van 24,75 tot de kroonlijst, zestien verdiepte velden van 1,9 m breed en 0,2 m diep tussen lisenen van circa 0,55 m, onder van 25,15 tot 27,75 m en boven van 28,75 tot 32,0 m; band 6,42 m van 28,1 tot 28,4 m; kleine vensters van 0,9 m om en om, acht onder (25,6 tot 26,6 m) en acht boven (30,8 tot 31,75 m); kroonlijst 6,55 m van 32,6 tot 33,0 m (AHN NAP +80,0).
- Dak: rechte kegel van 24 vlakken z = 36,49 - 0,57 r (30 graden) uit het AHN-DSM (p50 per halve meter straal: 82,12 op 2,25 m, 81,51 op 3,25, 80,92 op 4,25, 80,36 op 5,25), van de kroonlijst tot de lantaarn.
- Lantaarn: voetring 1,3 m van 35,3 tot 36,1 m, trommel 1,15 m tot 38,9 m met acht rondboogopeningen als nis, kap 1,4 m tot 39,2 m, koepeltje tot 39,6 m (AHN NAP +86,5) en makelaar tot 40,4 m (AHN-piek NAP +87,25).

Alle banden, lijsten en de kap hebben een onderkant van 50 graden, de nissen een plafond dat naar binnen onder 56 tot 68 graden oploopt en onder de lijsten blijft.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Enschede_Hoog_%26_Droog)): 1890, N. Biezeveld, 40 m, ijzeren hangbodemreservoir van 300 m³, renovatie 1956, gemeentelijk monument, sinds 2019 kantoor.
- BAG/BGT-pand 0153100000204953 (PDOK, 2026-11-06): ronde voetafdruk, straal 6,17 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld, kroonlijst, dakprofiel, lantaarn en piek. 3D BAG: h_dak_max NAP +86,60, maaiveld 46,81.
- PDOK-luchtfoto's 2022, 2024, 2025 en actueel: koperen kegeldak met circa 24 banen, lantaarn, dakrand van 12,8 tot 13,3 m.
- Foto op Wikimedia Commons: "Watertoren Enschede.jpg" (publiek domein, 268 x 376 px, vanaf het west-zuidwesten): geledingen, banden, vensters, oculi, rondlijst, reservoirvelden, lantaarn; schaal 9,5 px/m tussen het maaiveld en de kroonlijst uit het AHN.

## Geschat en weggelaten

Geschat: alle hoogtes tussen het maaiveld en de kroonlijst en de vorm van de lantaarn uit één kleine foto met een vaste schaal (circa een halve meter); de stralen van schacht (6,0 tot 5,85 m) en reservoir (6,3 m, kroonlijst 6,55 m) uit breedteverhoudingen op die foto, de luchtfoto en het DSM (onzekerheid circa 0,3 m); het aantal en de plaats van de vensters (zes per rij, twaalf oculi, zestien velden, acht kleine vensters per rij in het reservoir), want er is maar één kant op foto; de richting van de deur (zuid-zuidwest) uit de stand van het lage pand ten zuiden op de foto.

Weggelaten: de muurankers tussen de oculi, de glasroeden en de lichte strepen in het metselwerk (kleiner dan 0,9 m of alleen kleur), het hek om het grasveld (terrein) en een glazen bouwwerk of steiger aan de oostkant op de luchtfoto van 2026 (pand in verbouwing, BAG-uitbreiding van juli 2026, niet in het AHN en vorm onbekend).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; met oculi waarvan het plafond onder 63 graden oploopt, vulde de export boven elk oculus een randje op, daarom 68 graden en de rondlijst pas boven de binnenkant van de oculi. Een export op 1:1000 van 100 x 100 m rond de toren bevat het model zonder ondersteuningsobject. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte veelhoekige zuil met een plat afgeschuind dak en een blok als lantaarn) de plint, de onderbouw met vensters, deur, stoep en kroonlijst, de schacht met banden, drie rijen vensters en oculi, de uitkragende rondlijst, het reservoir met velden, band, vensters en kroonlijst, het kegeldak van 24 vlakken en de ronde lantaarn met kap, koepeltje en makelaar.

Controle-URL: http://localhost:3000/kaart/52.22136/6.90368/200/1x1/0
