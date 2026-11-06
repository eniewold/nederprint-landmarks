# Watertoren Wateringsevest (Delft)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-delft-wateringsevest.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, onderste geleding, lijst, schacht, banden, overkraging, reservoirmantel, lijsten, kroonlijsten en het platte dak zijn één omwentelingsprofiel (96 segmenten), de kantelen sectorvormige prisma's, de traptoren een cilinder met kegeldakje en kantelen, de stoep twee blokken, en de vensters, deur, arcadevelden, ronde openingen en de velden van de overkraging blinde nissen.

De watertoren aan de Wateringsevest (Kalverbos 22) werd in 1895 gebouwd naar ontwerp van gemeentearchitect M.A.C. Hartman, in neorenaissancestijl. Hij is 29 m hoog en heeft een Intze-reservoir van 600 m³ van geklonken stalen platen (rijksmonument 525246). Het pompgebouw ernaast (1918-1919, eigen BAG-pand) en het ondergrondse bassin zijn sinds 2022 kunstcentrum RADIUS. De toren staat er nog (BAG-pand in gebruik, AHN, luchtfoto, foto 2020). Een ronde toren in baksteen op een hardstenen plint: een onderste geleding met de deur en drie rondboogvensters, een hardstenen lijst, een licht verjongende schacht, de schuine overkraging van gemetselde gewelfjes tussen ijzeren liggers, de bredere reservoirmantel met arcade en hoge kroonlijst, kantelen rond een plat dak en een gemetseld traptorentje in het midden.

## Bestanden

- `watertoren-delft-wateringsevest.glb`: één node, `building:watertoren-plint-schacht-overkraging-reservoir-kantelen-en-traptoren`.
- `watertoren-delft-wateringsevest.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-delft-wateringsevest-1-1000.stl`: het model op 1:1000 (11,3 × 11,3 × 30,3 mm).

## Oorsprong en oriëntatie

RD-oorsprong [83877.12, 448109.35] (52,016776 N, 4,351101 O): het hart van de cirkel van BAG-pand 0503100000024873 (straal 5,63 m; de BAG-contour is het bovenaanzicht van de kroonlijst), op het maaiveld: AHN-DTM NAP +2,15 (2,08 tot 2,32 tussen 4,5 en 7 m). Het AHN ligt hier circa 1 m zuidwestelijker dan de BAG; het pompgebouw verschuift even ver, dus het is een verschuiving tussen de bronnen en niet van de toren. Het model staat op de BAG, net als de PDOK-reconstructie.

De lokale X-as is RD-oost (`xAxis` [1, 0]), Y is noord. Hoeken hieronder in graden linksom vanaf oost: de deur op 225 graden (zuidwest).

`groundSamplePoints` liggen op 7 m in de vier asrichtingen, net buiten de kroonlijst; `groundHeight` 45,59 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 45,63, noord 45,79, west 45,68, zuid 45,59, gemeten 2026-11-06). Het PDOK-pand staat op 45,45. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +2,15).

- Hardstenen plint: straal 4,65 m tot 0,9 m, afgeschuind tot 4,5 m op 1,05 m.
- Onderste geleding: straal 4,5 m tot 4,35 m op 5,0 m. De deur (1,4 m breed, 0,9 tot 2,6 m plus spitse boog tot 3,4 m) aan de zuidwestkant met een stoep van twee treden (2,2 m breed); drie boogvensters (1,0 m, 1,7 tot 3,3 m) op 45, 135 en 315 graden.
- Hardstenen lijst: kraag van 45 graden naar straal 4,5 m, tot 5,45 m, afdekking naar de schacht op 5,75 m.
- Schacht: verjongt van straal 4,08 m op 5,75 m tot 3,72 m op 14,2 m. Vier boogvensters (0,9 m, 7,0 tot 9,2 m) op de diagonalen, acht lancetvensters (0,9 m, 11,4 tot 13,3 m) om de 45 graden.
- Band: straal 3,85 m van 14,35 tot 14,85 m (metselwerklijst tussen twee hardstenen banden).
- Overkraging: rechte kegel van straal 3,85 m op 14,85 m tot 5,4 m op 17,4 m (31 graden uit het lood), met 24 velden tussen de liggers die 0,2 m terugliggen, met een plafond van 48 graden.
- IJzeren band: straal 5,5 m van 17,54 tot 17,8 m, kraag van 45 graden.
- Reservoirmantel: straal 5,36 m van 17,9 tot 23,6 m, met een lijst (straal 5,45 m, 19,2 tot 19,4 m) boven de sierband, zestien arcadevelden van 1,55 m breed die 0,25 m terugliggen (19,75 tot 22,45 m met een spitse boog tot 23,4 m), elk met een venster (0,9 m, 20,1 tot 22,2 m).
- Kroonlijst: kraag van 45 graden naar straal 5,65 m, tot 24,55 m.
- Hoge kroonlijst: straal 5,48 m van 24,7 tot 25,78 m, met zestien ronde openingen als nissen van 0,9 × 0,65 m, en een dekplaat van straal 5,56 m tot het dak.
- Dak: plat op 26,1 m (AHN NAP +28,25), met 16 kantelen (buiten 1,09 m breed, binnen 0,93 m, 0,8 m diep) tot 26,95 m (AHN NAP +29,1).
- Traptoren: straal 1,45 m, 1,1 m noordoostelijk van het hart (zoals in het AHN), tot 29,25 m, met een deurnis aan de zuidkant, een kegeldakje en vijf kantelen tot 29,95 m (AHN NAP +31,5 à +32,2).

Nissen zijn 0,25 à 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt; boognissen hebben een spits plafond van 50 tot 60 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Delft_Wateringsevest)): 1895, M.A.C. Hartman, neorenaissance, 29 m, reservoir 600 m³; kunstcentrum RADIUS in het pompgebouw en het bassin sinds 2022.
- [Rijksmonumentenregister 525246](https://monumentenregister.cultureelerfgoed.nl/monumenten/525246): ronde toren van 29 m op een hardstenen plint, licht taps, twee geledingen gescheiden door een hardstenen lijst; deur met rondboogbovenlicht en drie rondboogvensters; vier rondboogvensters en acht kleine lancetvensters; metselwerklijst tussen twee hardstenen banden; overkraging van schuin liggende gewelfjes met ijzeren liggers; ijzeren band, zestien rondboogvensters, hoge kroonlijst met zestien ronde openingen, borstwering van 32 kantelen; plat dak met een gemetseld traptorentje met deur, houten dakje en kantelborstwering.
- BAG-pand 0503100000024873 (PDOK, 2026-11-06): cirkel met straal 5,63 m, bouwjaar 1895.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +2,15; plat dak NAP +28,25; kantelen NAP +29,1; traptoren NAP +31,5 tot +32,2; antennemast tot NAP +34,15.
- PDOK-luchtfoto (Actueel_orthoHR): erg schuin opgenomen, alleen gebruikt om de vorm (rond, plat dak met torentje) te bevestigen.
- Foto's op Wikimedia Commons (categorie "Water tower in Delft"): "Watertoren, exterieur - Delft - 20050547 - RCE.jpg" (vrijwel frontaal vanaf het zuiden), "Delft, de watertoren aan het Kalverbos RM525246 foto6 2016-03-13 11.48.jpg", "Water tower Delft 2020.jpg", "Delft - Watertoren (2010).jpg", "525246 Delft Watertoren.jpg", "525246 watertoren delft.jpg", "Watertoren, Delft.jpg", "Watertoren Delft 21juni2006.jpg", "Delft Water tower seen from the railway tunnel portal.jpg".

## Geschat en weggelaten

Geschat: alles onder het dak. De hoogtes van plint, lijst, banden, overkraging, mantel, arcade en kroonlijsten komen uit de RCE-foto langs de middellijn, geschaald op de kantelen uit het AHN (26,95 m); de stralen uit de breedteverhoudingen op die foto, geschaald op de kroonlijst (BAG 5,63 m; schacht boven/mantel 0,69). De richting van de deur (zuidwest), de vensters en de fase van de arcade zijn afgeleid uit de RCE-foto, waarvan de kijkrichting (vanaf het zuiden) volgt uit de plaats van het pompgebouw erachter; de voet staat op recente foto's achter struiken. De stoep voor de deur is geschat (de drempel ligt op de foto circa 1 m boven het maaiveld; er is een kelder). De traptoren (vorm rond, straal 1,45 m) is geschat uit het AHN en het register. Het aantal kantelen is in het model 16 in plaats van 32, zodat kantelen en openingen minstens 0,9 m breed zijn. Ronde bogen staan als spitse bogen in het model, de smalle lancetvensters (circa 0,4 m) en ronde openingen (circa 0,5 m) als nissen van 0,9 m.

Weggelaten: de ijzeren liggers zelf (alleen de velden ertussen liggen terug), de kleurbanden van gele en rode verblendsteen, de sierankers en rozetankers, de hoek- en sluitstenen, de antennemast met tuidraden op het torentje (dunner dan 0,9 m), het hekwerk achter de kantelen en het pompgebouw (eigen BAG-pand, PDOK-reconstructie blijft staan).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2 en zonder steun even groot, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder met de straal van de kroonlijst van maaiveld tot dak, met een blokje als torentje) de plint met deur en stoep, de onderste geleding met lijst, de verjongende schacht met vensters, de schuine overkraging met velden, de mantel met arcade, de kroonlijsten met ronde openingen, de kantelen en de traptoren met kantelen.

Controle-URL: http://localhost:3000/kaart/52.01678/4.35110/200/1x1/0
