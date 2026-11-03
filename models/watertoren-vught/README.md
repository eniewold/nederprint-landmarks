# Watertoren Vught (Vught)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-vught.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, voetstuk, schacht en reservoirkop zijn geëxtrudeerde en verlopende achthoeken, de lijsten en friezen achthoekige banden met schuine kanten, de diamantkoppen piramides en het dak één achtzijdige tent; deur en ronde vensters zijn nissen.

De watertoren aan de Watertorenlaan 7A in Vught staat op het terrein van de voormalige inrichting Voorburg (nu Reinier van Arkel) en is in 1903 gebouwd naar ontwerp van H.J. van Tulder, als bluswatervoorziening voor de inrichting; rijksmonument 521293, in 2005 gerestaureerd en niet meer als watertoren in gebruik. Volgens het register een achtkante bakstenen schacht van circa 27 m in drie delen: een naar boven versmallend voetstuk met de ingang, afgesloten door een fries met forse natuurstenen diamantkoppen; een hoog middendeel met kleine spleetvensters onder een rondboogfries; en een bovenste zone met ronde vensters. Daarop een overkragende achtkante kop met verticale houten beschieting om het ijzeren reservoir (op 22 m), met een laag tentdak.

## Bestanden

- `watertoren-vught.glb`: één node `building:achtkante-schacht-en-reservoirkop`, op het maaiveld.
- `watertoren-vught.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-vught-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [149332.3, 406058.65] (51,64334 N, 5,30532 O), het hart van de reservoirkop in het AHN-DSM, op maaiveld (AHN-DTM NAP +5,9 tot +6,25; gebruikt +6,05). Het zwaartepunt van de BAG-contour van pand 0865100000008150 ligt 0,8 m oostelijker; de stand van de achthoek komt wel uit die contour: de vlakken staan op 11,5 + k·45 graden van RD-oost, dus lokale +X is de normaal van de oost-noordoostgevel (`xAxis` [0.97992, 0.19937]) en de ingang ligt op -Y (RD -78,5 graden, zuid), waar de BAG-contour de deurnis heeft. `groundHeight` 49,57 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 6 m van het hart (49,57 tot 49,87). Het model vervangt het pand, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:achtkante-schacht-en-reservoirkop`

- Plint: achthoek van 7,1 m over de vlakken (BAG) tot 1,0 m, bovenrand 0,1 m onder 45 graden.
- Voetstuk: versmalt van 6,9 m boven de plint tot 5,94 m op 7,3 m.
- Friezone van 7,3 tot 8,9 m, afgesloten door twee lijsten (7,05 tot 7,35 m en 8,6 tot 8,75 m) die 0,15 m uitsteken onder 45 graden, met twee diamantkoppen per vlak: piramides van 0,8 m in het vierkant en 0,25 m uit op 8,02 m.
- Schacht van 5,4 m over de vlakken van 8,9 tot 20,6 m.
- Rondboogfries met lijst van 17,65 tot 19,05 m, 0,25 m uit onder 45 graden.
- Bovenste zone: per vlak een rond venster als nis van 0,9 m breed (19,5 tot 20,25 m, 0,25 m diep).
- Reservoirkop: van de schacht op 20,6 m onder 45 graden uitkragend tot 7,4 m over de vlakken op 21,6 m, recht tot de dakrand; onderrand van de beschieting 0,12 m uit (21,6 tot 22,1 m) en dakrand 0,15 m uit tot 27,2 m.
- Laag achtzijdig tentdak van 27,2 tot 28,0 m (helling 11 graden).
- Ingang aan de voorzijde (-Y): deurnis van 1,35 m breed en 0,5 m diep (BAG-contour), top op 3,05 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Vught)): bouwjaar, ontwerper, functie en restauratie.
- [Rijksmonumentenregister 521293](https://monumentenregister.cultureelerfgoed.nl/monumenten/521293): achtkante schacht in drie delen, voetstuk met ingang, diamantkopfries, rondboogfries, ronde vensters, overkragende beschoten kop, circa 27 m, reservoir op 22 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld NAP +6,05, top van het tentdak NAP +33,96 tot +34,1 (28,0 m), dak NAP +33,45 op r 2,5 m; vlakken van de kop op 3,6 tot 3,8 m van het hart.
- BAG-pand 0865100000008150 (PDOK): de achthoek van het voetstuk (7,1 m over de vlakken), de stand en de deurnis. Luchtfoto (PDOK) voor het achtzijdige tentdak.
- Foto "Vught Watertoren 4648" (2006, frontaal op de ingang) op Wikimedia Commons: hoogtes van plint, voetstuk, friezen, bovenste zone en kop, en de breedtes van voetstuk, schacht en kop, geschaald op de BAG-breedte van het voetstuk en de AHN-dakrand. RCE-foto 20347871 en "Voorburg watertoren" (2010) voor de opstand en het tentdak.

## Geschat en weggelaten

Geschat: alle tussenhoogtes (plint, bovenkant voetstuk, friezen, onderkant en onderrand van de kop) en de breedtes van voetstuk, schacht en kop uit één frontale foto; de diepte en het uitsteken van lijsten, friezen, diamantkoppen en nissen; de ronde vensters op alle acht vlakken (op de foto's zijn er drie te zien); de deur als rechte nis in plaats van met een halfrond bovenlicht. De plaats volgt het AHN-DSM, niet de BAG-contour (0,8 m verschil).

Weggelaten: de spleetvensters en de lange witte strook in het middendeel en de kleine ronde en ovale openingen in de beschieting (kleiner dan 0,9 m), de afzonderlijke boogjes van de rondboogfries (kleiner dan 0,9 m, als band), de oranje hoeklisenen (vlak in het metselwerk), de verticale beschieting en het topje op het tentdak (kleiner dan 0,9 m). De gebouwen rond de toren zijn eigen BAG-panden en blijven van PDOK.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: lijsten, rondboogfries, onderzijde van de kop, onderrand en dakrand staan onder 45 graden, de diamantkoppen onder 58 en de nisplafonds onder 56 graden. Via de exportlader op een uitsnede van 80 m staat het model compleet op het PDOK-maaiveld (voet 0,1 tot 0,4 m in het terrein). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte achtkante kolom ter breedte van het voetstuk tot 28 m) het versmallende voetstuk met plint, de diamantkopfries tussen twee lijsten, de smallere schacht met rondboogfries en ronde vensters, de overkragende reservoirkop met onder- en dakrand, het tentdak en de deurnis.

Controle-URL: http://localhost:3000/kaart/51.64334/5.30532/200/1x1/0
