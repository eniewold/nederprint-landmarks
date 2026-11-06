# Watertoren Enschede, Menkotoren (Enschede)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-enschede-menkotoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het opslaggebouw, de penthouse, de zuidvleugel en de toren zijn prisma's en convexe omhullenden in een eigen stelsel langs de gevels, de zaagtanddaken van de glazen aanbouw dakvlakken uit planvergelijkingen, vensters en velden blinde nissen met een schuin plafond.

De watertoren van de textielfabriek van N.J. Menko in Roombeek (Bosuilstraat) werd in 1912 gebouwd en voorzag de spinnerij, weverij en ververij van water. Van het complex staan alleen het opslaggebouw met de toren en enkele delen nog overeind. Na schade bij de vuurwerkramp van 2000 is het geheel gerestaureerd en verbouwd tot woningen; hoogte en inhoud van het reservoir zijn onbekend (Wikipedia). De toren staat in de zuidgevel van een vierkant bakstenen opslaggebouw van vier verdiepingen: een vierkante schacht, een witte betonnen plaat op gebogen consoles en een bredere vierkante reservoirbak met hoeklisenen, vensters en de tegelfries "N.J. MENKO.".

## Bestanden

- `watertoren-enschede-menkotoren.glb`: één node, `building:menko-opslaggebouw-met-watertoren-penthouse-vleugel-en-glazen-aanbouw`.
- `watertoren-enschede-menkotoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-enschede-menkotoren-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [258141.0, 472752.0] (52,23317 N, 6,89708 O), het hart van de toren (reservoirbak in het AHN-DSM en op de luchtfoto, scheefstand verrekend), op maaiveld NAP +40,67 (3D BAG; AHN-DTM 40,7 tot 41,6, aan de noordkant 0,8 m hoger). Lokale +X wijst naar RD-richting -5,2 graden (oost), +Y naar 84,8 graden (noord); de gevels van het BAG-pand en de bak in het DSM lopen evenwijdig aan dit stelsel.

`groundSamplePoints` liggen op 13 m oost (twee punten), 9,5 m zuid en aan de westkant voor de glazen aanbouw; `groundHeight` 84,24 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (84,24 tot 84,44, gemeten 2026-11-06). Aan de noordkant ligt het PDOK-terrein op 85,05; daar staat geen punt. `groundOffsetMetres` is -0,1.

`replacesBuildings`: BAG-pand 0153100000286271, het hele gebouw (opslaggebouw, toren, zuidvleugel en glazen aanbouw; BAG-bouwjaar 2007 na de verbouwing). De buurpanden in de PDOK-tegel (0153100000240365, 0153100000248843 en twee schuurtjes 0153100000511253/511254) raken het model niet en staan op hun eigen hoogte.

## Onderdelen

Hoogtes boven het maaiveld (NAP +40,67).

- Opslaggebouw: u -8,2 tot 11,2, v -2,4 tot 18,6 (BAG), dakterras op 14,1 m (AHN NAP +54,8; 3D BAG 50p 54,81), kroonlijst 0,25 m uit van 13,1 tot 14,1 m. Vier verdiepingen met vensters van 1,4 × 1,8 m in paren (vijf paren per gevel), achter de aanbouw en de vleugel alleen de bovenste verdiepingen.
- Penthouse: u -5,5 tot 8,5, v 2,4 tot 16,0, wanden tot 16,25 m met glasvlakken als nissen, dak met 0,5 m overstek tot 17,0 m (AHN NAP +57,7).
- Zuidvleugel: u -15,74 tot 5,62, lessenaarsdak van 6,0 m aan de zuidgevel tot 7,2 m (AHN), met vensters; het oostelijke deel (u 5,62 tot 8,3) plat op 3,3 m.
- Glazen aanbouw aan de westkant: het trapezium uit de BAG, zes lessenaarsdaken in een zaagtand van 5,9 tot 7,3 m, glaspuien als nissen.
- Toren: schacht 5,6 × 4,8 m, gelijk met de zuidgevel, met een venster van 1,6 m per verdieping en per vrije zijde boven het dakterras (14,55 tot 15,5 m); schuine onderkant van de plaat vanaf 16,3 m, witte plaat 7,8 × 7,0 m van 18,0 tot 18,45 m op acht consoles van 0,9 m (twee per hoek, onderkant van 15,3 m aan de schacht tot 17,5 m aan de rand); reservoirbak 7,2 × 6,4 m met per zijde een verdiept veld tussen hoeklisenen van 0,9 m en een venster van 1,3 m, metselwerklijst 0,15 m uit en bovenkant op 22,8 m (AHN NAP +63,5; 3D BAG max 63,51).

Kroonlijst en penthouse-overstek hebben een onderkant van 50 graden, de plaat 57 graden over de zijden en 47 over de hoeken, de consoles 63 graden, de lijst van de bak 53 graden; de nissen een plafond van 56 graden (de vensters in de schacht 66 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Enschede_Menkotoren)): 1912, Menko-complex, Bosuilstraat in Roombeek, nu woningen, hoogte en inhoud onbekend.
- BAG-pand 0153100000286271 (PDOK, 2026-11-06): voetafdruk en gevelrichting (-5,2 graden).
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06), gelezen in het stelsel van de gevels: maaiveld, dakterras, penthouse, bak, zuidvleugel, laag deel en aanbouw.
- 3D BAG (CC BY 4.0, TU Delft 3D geoinformation en 3DGI): maaiveld 40,67, dak 50p 54,81, max 63,51.
- PDOK-luchtfoto: dakrand van de bak (7,2 × 6,4 m), penthouse, aanbouw.
- Foto's op Wikimedia Commons: "Menko Building.JPG" en "Roombeek Enschede - 4034724764.jpg" (vanaf de vijver: opslaggebouw, penthouse, glazen aanbouw met zaagtand, toren), "Menko building, tower.JPG" (schacht, plaat op consoles, bak met hoeklisenen, vensters en tegelfries), "Enschede - 2021 - Menko.jpg".

## Geschat en weggelaten

Geschat: de breedte van de schacht (5,6 × 4,8 m) en de overstek van plaat en bak uit de foto's, verankerd op de bak in luchtfoto en DSM (circa 0,3 m); de hoogtes van plaat (18,0 tot 18,45 m) en consoles uit de foto's (circa 0,5 m); de verdiepingshoogte, het aantal en de maat van de vensters; de positie van de penthousewanden (DSM en luchtfoto); de zaagtand van de aanbouw (zes eenheden van 5,9 tot 7,3 m, het DSM ziet alleen 6 tot 7 m).

Weggelaten: de tegelfries met de letters (vlak, alleen kleur), de witte banden in de gevels, het hekwerk van het dakterras en de penthouse (leuningen), de overstekende punten van de witte daken van de aanbouw (dunne platen), de rand op het dak van de bak (in het DSM niet meetbaar), de hemelwaterafvoeren en de schoorsteen op de penthouse (kleiner dan 0,9 m). De onderkant van de plaat is in het echt vlak tussen de consoles; voor 1:1000 zonder steun is hij schuin.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet (eerst vulde de export een randje van 0,1 m³ op onder de plafonds van de schachtvensters; daarom 66 graden). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (dozen, de toren als kolom met een schuin dak) de vensterparen en de kroonlijst van het opslaggebouw, de penthouse met overstek, de vensters in de zuidvleugel, de glaspuien, de schacht met vensters, de plaat op consoles en de bak met velden, vensters en lijst.

Controle-URL: http://localhost:3000/kaart/52.23317/6.89708/200/1x1/0
