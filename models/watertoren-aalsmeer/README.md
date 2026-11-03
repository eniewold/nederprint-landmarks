# Watertoren Aalsmeer (Aalsmeer)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-aalsmeer.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een prisma op de BGT-plattegrond, hoekkolommen, koppelbalken, parabolen en reliëfvlakken zijn convexe bouwdelen met schuine onderkanten, en de kap bestaat uit acht vlakken met een knik.

De watertoren aan de oever van de Westeinderplassen is in 1926-1928 gebouwd voor het Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. H. Sangster (hoofdingenieur B.F. van Nievelt), in art-decostijl; rijksmonument 524249, sinds 1994 buiten gebruik en sinds 1997 van de gemeente. Volgens het register een vierkante toren van 50 m uit een zichtbaar gelaten betonskelet: vier zware hoekkolommen en vier lichtere kolommen halverwege de gevels, verbonden door koppelbalken, met paarsrode baksteen ertussen en smalle lichtopeningen naast de hoekkolommen. Ter hoogte van de twee hoogreservoirs (480 en 520 m³) hebben de gevels reliëf van drie naar boven toe verbredende betonvlakken; de deur (oostzijde) en de vensters zitten in een geknikte parabool van beton. Bovenop een mutsvormige koperen kap van acht geknikte vlakken met een naald.

## Bestanden

- `watertoren-aalsmeer.glb`: één node `building:betonskelet-met-reliefgevels-en-koperen-kap`, op het maaiveld.
- `watertoren-aalsmeer.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-aalsmeer-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [111996.55, 474283.69] (52,25491 N, 4,75740 O), het hart van de BGT-contour van het pand (spiegelsymmetrisch op 1 cm), op maaiveld (AHN-DTM NAP +1,0 tot +1,2; gebruikt +1,05). De BGT-contour is symmetrisch in een stelsel dat 8 graden linksom op RD staat: lokale +X is de normaal van de oostgevel met de deur (`xAxis` [0.99027, 0.13917]). De BAG-contour is een grove achthoek door de gevelmiddens en de voeten van de hoekkolommen en is niet gebruikt voor de vorm. `groundHeight` 43,96 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 10 m van het hart (43,96 tot 44,25). Het model vervangt BAG-pand 0358100019103003, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:betonskelet-met-reliefgevels-en-koperen-kap`

- Schacht (BGT): gevels op 6,2 m van het hart tot 3,93 m opzij, daar een sprong van 0,47 m naar binnen (de lichtspleten naast de hoekkolommen), afgeschuinde hoeken (u + v = 9,66); tot de gevelrand en omgang op 42,0 m.
- Vier diagonale hoekkolommen van 1,1 m breed: voet tot 9,1 m uit het hart tot 1,6 m hoogte (BGT), verlopend tot 7,85 m op 8,6 m, recht tot de gevelrand en dan onder 49 graden naar binnen oplopend tot 44,6 m tegen de kap.
- Koppelbalken op 7,9, 16,2, 24,1 en 32,4 m: 3,2 m breed over de hoek, 0,9 m hoog, 0,3 m voor de kolom, onderzijde onder 45 graden.
- Per gevel een middenkolom van 1,35 m (0,5 m uit de gevel) van de parabool tot een punt op 43,8 m.
- Geknikte parabool aan de voet: van 5,8 m breed op het maaiveld naar de middenkolom op 6,4 m, 0,5 m uit de gevel (BGT 0,49), met de deur aan de oostzijde (2,1 m breed, 2,8 m hoog) en vensters van 1,6 m (0,6 tot 2,2 m) aan de andere zijden als nissen tot het gevelvlak.
- Reliëf ter hoogte van de reservoirs: smal vlak van 2,9 m van 24,1 tot 32,4 m en breed vlak van 4,6 m van 32,4 m tot boven de gevelrand (43,0 m in het midden), beide met een V-vormige onderkant onder 50 graden; daaroverheen een rib van 0,9 m, 0,25 m uit.
- Kap: achthoekige opstand (5,8 m uit het hart, 6,3 m in de diagonalen) van de omgang tot de kapvoet op 44,66 m, acht kapvlakken met helling 0,8 tot een knik op 1,8 m van het hart op 47,86 m en daarboven steiler tot de top op 49,9 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Aalsmeer)): bouwjaar, ontwerper, 50 m, reservoirs.
- [Rijksmonumentenregister 524249](https://monumentenregister.cultureelerfgoed.nl/monumenten/524249): betonskelet met hoek- en middenkolommen en koppelbalken, lichtopeningen naast de hoekkolommen, reliëf van drie verbredende vlakken, parabool om deur en vensters, kap van acht geknikte koperen vlakken met naald, reservoirs van 10,2 en 10,5 m doorsnede.
- BGT-pand G0362.ae876bd6028f4e65bd3afe91a4b883f8 (PDOK, 2026-11-03): plattegrond op de grond, stand van de toren, voeten van de hoekkolommen, parabolen en deurnis.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-03): maaiveld NAP +1,05; gevelrand en omgang 42,0 m; punt van de middenkolommen 43 tot 44 m; kap 45,06 m op 5,5 m en 47,88 m op 2,0 m van het hart; top NAP +51,13 (met de naald); hoekkolommen 7,6 tot 7,85 m in de diagonalen boven 20 m. Luchtfoto voor de acht kapvlakken.
- Foto's op Wikimedia Commons: "Watertoren Aalsmeer - panoramio - Rokus C" (frontaal op de oostgevel: geledingen, parabool, reliëfvlakken, breedtes, met een projectieve schaal tussen maaiveld en gevelrand), RCE-foto 20349697 en "Watertoren in Aalsmeer" en "Watertoren Aalsmeer (4)" (schuin op de hoeken: hoekkolommen, koppelbalken en kap).

## Geschat en weggelaten

Geschat: de hoogtes van de koppelbalken, de parabool, de reliëfvlakken en de deur uit één frontale foto met een projectieve schaal; de breedte en het uitsteken van middenkolom, reliëfvlakken, rib en koppelbalken; de hoekkolom boven de voet (AHN-DSM en schuine foto's); de knik in de kap (AHN-DSM, de foto's tonen hem lager); de vensters aan de noord-, zuid- en westzijde als gelijke nissen.

Weggelaten: de smalle lichtspleten in de gevels en de kleine vensters en luiken in de reliëfvlakken en onder de gevelrand (kleiner dan 0,9 m, de spleten staan als sprong in de plattegrond), het driehoekige ornament boven de deur (in het vlak van de parabool), de naald, de bol en de antennes op de kap en de hoeken (kleiner dan 0,9 m), en de valkenkast. De dienstwoning naast de toren is een eigen BAG-pand en blijft van PDOK.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: koppelbalken en rib onder 45 graden, reliëfvlakken met een V onder 50 graden, nisplafonds onder 56 graden. Via de exportlader en `createModelBundle` op een uitsnede van 80 m staat het model compleet op het PDOK-maaiveld (voet 0,1 tot 0,5 m in het terrein), zonder ondersteuning. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achtkant prisma met een grof dak) de diagonale hoekkolommen met verlopende voet en koppelbalken, de lichtspleten, de parabolen met deur en vensters, de middenkolommen met punt, de verbredende reliëfvlakken met rib en de geknikte achtzijdige kap.

Controle-URL: http://localhost:3000/kaart/52.25491/4.75740/200/1x1/0
