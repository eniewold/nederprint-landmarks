# Watertoren Tilburg (Tilburg)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-tilburg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, schacht, reservoir, banden en lijsten zijn omwentelingsvormen en kegelstompen (`hull`), de consoles en het installatieblok prisma's, het traptorentje een cilinder op een schuine console met een kegeldak, en de poort, de vensters en de deur nissen.

De watertoren staat aan de Bredaseweg in Tilburg. Hij is in 1897 gebouwd voor de Tilburgsche Waterleiding Maatschappij naar een ontwerp van H.P.N. Halbertsma en is rijksmonument 521153. Volgens Wikipedia is hij 50,50 m hoog en houdt het reservoir 1000 m³. Op 26 oktober 1944 probeerden de Duitsers hem op te blazen; bij het herstel werd de bovenbouw vereenvoudigd, met een hekwerk in plaats van de oorspronkelijke kantelen. Een brede ronde onderbouw met banden, een poort met een natuurstenen portiek (jaartal 1896-97) en hoge rondboogvensters draagt een licht tapse schacht met twee rijen rondboogvensters. Daarboven een consolelijst met een boogfries onder een kroonlijst, het ronde reservoir met gekoppelde rondboogvensters, een band, een rij vierkante venstertjes, een daklijst en een borstwering om een plat dak. Aan de oostkant hangt een rond traptorentje op een console, met een omgang en een koperen kegeldak.

## Bestanden

- `watertoren-tilburg.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-tilburg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 0855100000293803).
- `watertoren-tilburg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [132912.67, 396410.06] (WGS84 51.556208, 5.068713), het hart van de ronde BAG-contour van pand 0855100000293803 (bouwjaar 1897, 167 m², straal 7,33 m). Op het maaiveld NAP +15,90 m (AHN-DTM 9 tot 11 m uit het hart NAP +15,6 tot +16,0; aan de straatkant in het zuiden zakt het naar +15,0, daarom staan de `groundSamplePoints` op het grasveld 9,5 m uit het hart). `xAxis` [1, 0]: +X is RD-oost; de richtingen hieronder zijn azimuts in graden linksom van oost. `groundHeight` 59,77 (NAP 15,90 + 43,87, NLGEO2018-geoïde op de oorsprong) is de terugval als er geen maaiveld is.

## Onderdeel `building:ronde-schacht-reservoir-en-traptorentje`

- Onderbouw: plint van 14,66 m (BAG) tot 0,9 m met een schuine bovenkant, wand van 14,4 m tot 6,9 m, fries van 14,64 m op een kraag van 45 graden tot 7,8 m en een schuine waterlijst naar de schacht op 8,7 m.
- Poort op -126 graden (zuidwest): natuurstenen boogomlijsting 3,4 m breed en 0,15 m voor de wand tot 6,0 m, poortnis 2,6 m breed tot 5,6 m, daarin een portiek van 1,9 m met een puntgevel tot 4,8 m en een deur van 1,3 × 2,7 m als nis; trap van drie treden van 3,0 m breed tot 0,45 m.
- Zeven rondboogvensters van 1,6 m breed van 0,9 tot 5,1 m als nissen, op stappen van 45 graden vanaf de poort.
- Schacht: 12,2 m op de waterlijst tot 11,9 m op 24,6 m, doorlopend tot de kroonlijst.
- Vensterassen op 228 + 60k graden: rondboogvensters van 0,9 m van 10,2 tot 12,5 m en van 18,2 tot 20,3 m (de bovenste niet onder het traptorentje op 348 graden), vierkante vensters van 0,9 × 0,8 m op 23,5 m, 30 graden verschoven.
- Consolelijst: boogfries van 13,2 m met een schuine onderkant (45 graden) van 26,2 tot 27,8 m, twintig consoles van 0,9 m breed tot 13,24 m met een onderkant van 37 graden (24,6 m tegen de schacht, 25,6 m aan de voorkant), één in de as van het traptorentje; kroonlijst van 13,5 m tot 29,1 m.
- Reservoir van 13,0 m van 29,1 tot 38,1 m met zes paar gekoppelde rondboogvensters (0,85 m breed, 31,4 tot 34,2 m) op de vensterassen behalve onder het traptorentje, een band van 13,24 m van 36,0 tot 36,35 m en elf vierkante venstertjes van 0,9 × 0,75 m.
- Daklijst van 13,36 m van 37,9 tot 38,6 m en een borstwering van 13,1 m tot 39,3 m, binnen 6,0 m uit het hart het platte dak op 38,1 m; installatieblok van 2,6 × 1,0 m tot 39,6 m.
- Traptorentje op -10,5 graden, 7,0 m uit het hart: console van een strook van 0,9 m op 19,9 m tegen de schacht naar een kelk van 2,8 m (23,8 tot 24,9 m), schacht van 2,2 m tot 41,0 m, omgang van 2,8 m op een kraag van 45 graden van 41,3 tot 42,8 m en een kegeldak tot 45,3 m (32 zijden).

## Bronnen en maten

- [Wikipedia, Watertoren (Tilburg)](https://nl.wikipedia.org/wiki/Watertoren_(Tilburg)): Halbertsma, 1897, 50,50 m, 1000 m³, vereenvoudigde bovenbouw met hekwerk na 1944.
- [Rijksmonumentenregister 521153](https://monumentenregister.cultureelerfgoed.nl/monumenten/521153).
- BAG-pand 0855100000293803: ronde contour, straal 7,33 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld, plat dak op NAP +54,0 (38,1 m) binnen 6,0 m uit het hart, borstwering NAP +55,0 tot +55,2, traptorentje tot NAP +59,9 op 7 m oost (-10 graden), installatieblok tot NAP +55,5. Het DSM heeft ten zuiden van de toren een gat en een losse piek van NAP +60,9 net buiten de dakrand; die is niet gebruikt.
- PDOK-gebouwtegels: het pand is een cilinder tot het dak met een vin tot 45,5 m boven maaiveld op 7,2 m oost, het traptorentje. Buurpanden steken niet boven het AHN uit.
- Luchtfoto (PDOK, 8 cm): dakrand 13,6 m en onderbouw 14,2 m doorsnede, traptorentje met groene kegel aan de oostkant, installaties op het dak; de toren hangt naar het zuiden over.
- Foto [Overzicht watertoren met dienstgebouw (RCE 20343564)](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_dienstgebouw_-_Tilburg_-_20343564_-_RCE.jpg) (evenwijdige verticalen, vanaf het zuidzuidwesten): hoogtes van onderbouw, consolelijst en reservoir (27,7 px/m aan de silhouetrand), stralen onderbouw : reservoir : schacht = 194 : 173 : 158 px, de posities van de poort, de vensters en het traptorentje.
- Foto's [Tilburg watertoren](https://commons.wikimedia.org/wiki/File:Tilburg_watertoren.jpg), [Tilburg - Watertoren](https://commons.wikimedia.org/wiki/File:Tilburg_-_Watertoren.jpg), [Tilburg - Watertoren (2)](https://commons.wikimedia.org/wiki/File:Tilburg_-_Watertoren_(2).jpg) en [detail beeld en ingangspartij (RCE 20343567)](https://commons.wikimedia.org/wiki/File:Watertoren,_detail_beeld_en_ingangspartij_-_Tilburg_-_20343567_-_RCE.jpg): consolelijst, gekoppelde vensters, venstertjes, traptorentje met console en kegeldak, poort met portiek en trap.
- NLGEO2018-geoïdehoogte op de oorsprong (43,87 m) voor `groundHeight`.

## Geschat en weggelaten

Geschat:

- De hoogtes van de geledingen, banden en vensters (±0,7 m, uit één foto met evenwijdige verticalen) en de stralen van schacht, consolelijst en reservoir (±0,3 m). De Wikipedia-hoogte van 50,50 m klopt niet met het AHN: dak 38,1 m, borstwering 39,3 m en de kegel van het traptorentje 45,3 m boven maaiveld.
- De richtingen van de poort, de vensters en de vensterassen (±15 graden, uit drie foto's tegen de richting van het traptorentje) en het aantal vensters per rij (zes) en in de onderbouw (acht openingen op 45 graden).
- Het aantal consoles (twintig; in het echt dichter) en de vorm van de console onder het traptorentje.

Weggelaten, omdat ze kleiner zijn dan 0,9 m:

- het hekwerk op de borstwering, de vlaggenmast en het pironnetje op het traptorentje;
- de spleetvensters in het traptorentje, de boogjes tussen de consoles en de driehoekjes in de fries van de onderbouw;
- de lichte banden in het metselwerk van de onderbouw (vlak in de gevel) en de versieringen van de portiek.

Het dienstgebouw naast de toren is een eigen BAG-pand en blijft PDOK.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export dat doet, vrijwel niets op (volume 1,0000033): kragen onder 45 graden, consoles onder 37, de console van het traptorentje onder 27, nisplafonds onder 56 graden. Via de exportroute (`loadLocalLandmarkMeshes` op een uitsnede van 80 m) staat het model compleet en 0,4 tot 0,7 m in het PDOK-maaiveld. PDOK toont de toren als een gladde cilinder tot het dak met een vin voor het traptorentje; het model voegt van elke kant de brede onderbouw met poort, portiek en vensters, de vensters in de schacht, de consolelijst, het reservoir met vensters, banden, daklijst en borstwering en het traptorentje met console, omgang en kegeldak toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.55621/5.06871/200/1x1/0
