# Watertoren Bergambacht (Bergambacht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bergambacht.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een prisma, hoekmuurtjes, lisenen, liggers, rondboog en trap zijn blokken en hulls, de steunberen hulls met een schuine kop, trommel, witte schijf, kroonlijst en helmdak één omwenteling van een radiaal profiel, vensters en deuren blinde nissen.

Watertoren "De Vijf Gemeenten" (Dijklaan 71) is in 1937 gebouwd naar een ontwerp van P.D. Stuurman; volgens Wikipedia 40 m hoog met een reservoir van 360 m³, volgens het monumentenregister (rijksmonument 509521) 45 m. Een zakelijk-expressionistische toren op een met gras begroeid talud: vierkante schacht van baksteen om een betonskelet, een rond reservoir op uitkragende witte betonnen liggers en een helmdak met koperen platen. Buiten gebruik sinds 1988; de toren staat er nog (AHN, luchtfoto, foto's 2007 en 2010).

BAG-pand 0491100001310888 (bouwjaar 1960 in de BAG, 120 m² grondvlak in de 3D BAG) is de toren; het id uit de taak klopt. Het model vervangt dat pand. De buurpanden in de PDOK-tegel (0491100001310853, het filtergebouw uit 1935 29 m ten zuiden, en 0491100001317044, 2013, 31 m ten zuidwesten) raken het model niet en blijven staan.

## Bestanden

- `watertoren-bergambacht.glb`: één node, `building:watertoren-schacht-steunberen-lisenen-liggers-reservoir-kroonlijst-en-helmdak`.
- `watertoren-bergambacht.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-bergambacht-1-1000.stl`: het model op 1:1000 (15,3 × 12,5 × 45,6 mm).

## Oorsprong en oriëntatie

RD-oorsprong [113510.65, 437634.03] (51,925634 N, 4,784031 O): het hart van de vierkante schacht in de BAG-contour; het hart van de koepel in het AHN-DSM ligt op [113510.6 à 113510.7, 437634.0 à 437634.1].

De BAG-contour staat op RD -2,66 graden (alle 36 zijden binnen 0,1 graad). In het stelsel van de toren is het een vierkant van 9,85 m met hoekblokken die 0,7 à 0,9 m uitsteken en 2,75 m langs elke gevel lopen, een smalle steunbeer (0,6 m breed, 1,3 m diep) midden op de west- en zuidgevel, een blok van 3,5 × 1,26 m midden op de noordgevel en een blok van 3,8 × 0,5 m midden op de oostgevel. De lokale X-as is de normaal van de oostgevel met de hoofdingang op RD -2,7 graden (`xAxis` [0.99889, -0.04711]); +Y is noord.

`groundSamplePoints` liggen op 7 m van het hart langs de vier hoofdassen. `groundHeight` 42,482 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten: (7, 0) 43,915, (0, 7) 42,482, (-7, 0) 43,602, (0, -7) 43,47 (gemeten 2026-11-06). Het laagste punt ligt in de ingegraven doorgang naar de noordingang. Het verschil met het AHN-DTM is 43,53 tot 43,65 m, dus z = 0 ligt op NAP -1,12, het peil van de doorgang en van de polder rond het talud (3D BAG-maaiveld -0,97). Het talud bedekt de voet aan de andere zijden 1,3 à 1,6 m; dat zit in het PDOK-terrein en niet in de GLB. `groundOffsetMetres` is −0,1.

## Onderdelen

Hoogtes boven z = 0 (NAP -1,12).

- Schacht: vierkant van 9,85 m, van de voet tot de schachtkop op 28,02 m.
- Hoekmuurtjes: 0,8 m buiten de gevels en 2,75 m langs elke gevel, tot 3,22 m (circa 2 m boven het talud).
- Liseen van 1,0 m breed en 0,3 m dik midden op elke gevel, van de voet tot onder de ligger; vensterstroken van 0,45 m breed en 0,3 m diep langs beide zijden, van 6,9 tot 24,3 m.
- Steunbeer op de west-, zuid- en noordgevel: 0,9 m breed en 1,3 m voor de gevel, vol tot 5,12 m en dan onder 60 graden terug naar de liseen; ernaast twee vensters van 0,9 m op de begane grond (3,6 tot 5,1 m).
- Oostgevel: uitgemetselde rondboog van 3,7 m breed en 0,5 m diep (top 5,97 m) met een deur van 1,2 m vanaf 2,72 m, en een trap van een bordes en drie treden van 0,35 m die in het talud verdwijnt.
- Noordgevel: blok van de lagere ingang (3,5 × 1,26 m, tot 3,42 m) met een rechtgesloten deur van 1,0 × 2,3 m. Zuidgevel: een lagere deur van 1,0 × 2,3 m naast de steunbeer.
- Witte liggers: één van 1,2 m breed op elke liseen, 0,67 m voor de liseen, van 26,92 tot 30,32 m met een onderkant van 47 graden; één blok van 1,2 × 1,2 m op elke schachthoek van 28,0 tot 30,32 m.
- Trommel: rond, 10,8 m, op een uitkraging van 47 graden vanaf de schachtkop; witte schijf van 11,1 m van 29,42 tot 29,92 m; vier lisenen van 0,9 m op de diagonalen (boven de hoekliggers); acht vensterstroken van 0,5 m, twee per gevel 14 graden naast het midden, van 31,1 tot 35,3 m.
- Kroonlijst van 12,0 m met een onderkant van 47 graden van 36,3 m, bovenkant 37,52 m.
- Koperen helmdak van 10,6 m aan de voet tot de top op 45,34 m.

## Bronnen en maten

- [Wikipedia, Watertoren (Bergambacht)](https://nl.wikipedia.org/wiki/Watertoren_(Bergambacht)): 1937, P.D. Stuurman, 40 m, 360 m³, rijksmonument 509521.
- [Rijksmonumentenregister 509521](https://monumentenregister.cultureelerfgoed.nl/monumenten/509521): 45 m, vierkante schacht van vier verdiepingen op een talud, steunbeer midden op elke gevel die op de verdieping overgaat in een liseen, vensterstroken langs de liseen, hoekmuurtjes van circa 2 m, rondboog met trap in het oosten, lagere ingangen in noord en zuid, reservoir op uitkragende witte liggers met witte schijven, helmdak met koperen platen.
- BAG-pand 0491100001310888 (PDOK, 2026-11-06) en 3D BAG: maaiveld NAP -0,97, nok 44,03, dak-min 36,35.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): koepeltop NAP +44,22; kroonlijst +36,4 met een straal van circa 6,0 m; koepelrand r 5,25 op 38, r 4,45 op 40 en r 2,85 op 42; talud NAP 0 à +0,3 rond de voet, polder -1,0, doorgang noord -1,1.
- Luchtfoto (PDOK, Actueel_orthoHR): koperen helmdak, kroonlijst circa 13 m.
- Foto's op Wikimedia Commons: "Watertoren Bergambacht.jpg" (2010, vanuit het oosten), "Bergambacht - Watertoren m park.jpg" (2007) en "Exterieur OVERZICHT - Bergambacht - 20302396 - RCE.jpg".

## Geschat en weggelaten

Geschat: alle maten van de opstand tussen de voet en de kroonlijst, uit de foto van 2010 met de kroonlijst en de top uit het AHN als schaal en een perspectiefcorrectie: de schachtkop (28,0 m), de liggers (26,9 tot 30,3 m, 1,2 m breed), de witte schijf, de trommel (circa 0,9 maal de kroonlijst: 10,8 m), de onderkant van de kroonlijst, de vensterstroken in schacht en trommel, de rondboog, de deur en de trap, en de hoogte van de steunberen (op de begane grond). De diameter van de koepelvoet en het profiel van het helmdak zijn uit de DSM-hoogtelijnen afgeleid. De BAG-contour is niet helemaal symmetrisch (gevels -4,67/5,18 en -4,90/4,96 van het bbox-midden); hier een regelmatig vierkant met de gemiddelde maten. De steunbeer op west en zuid is in de BAG 0,6 m breed; hier 0,9 m, de minimale breedte voor 1:1000. De noord- en zuidkant zijn alleen van de BAG, het register en de schuine RCE-foto bekend; de plaats van de zuiddeur is aangenomen.

Weggelaten: de witte betonnen lateien boven de vensters (vlak in de gevel), de kleine dakluiken in het helmdak en de bliksemafleider (kleiner dan 0,9 m), de witte blok in de top van de rondboog, de vensterverdeling, de onderste trap over het talud en de keermuren van de ingegraven doorgangen (die volgen het terrein), en het hek rond de toren.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; het volume van het model is gelijk aan dat van een export zonder steun. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een getrapt prisma tot de kroonlijst met een gefacetteerde koepel) aan elke kant de lisene met vensterstroken, de witte liggers, de ronde trommel met schijf, lisenen en vensters, de uitstekende kroonlijst en het ronde helmdak; daarnaast de hoekmuurtjes, aan de oostkant de rondboog met deur en trap, aan de noordkant de lagere ingang en op west, zuid en noord de steunbeer.

Controle-URL: http://localhost:3000/kaart/51.92563/4.78403/200/1x1/0
