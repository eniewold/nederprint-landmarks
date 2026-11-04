# Watertoren Castricum (Castricum)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-castricum.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: basement, schacht, kraag, mantel en dak zijn prisma's en kegels op gemeten stralen, het dak heeft zestien vlakken, deur en vensters zijn nissen.

De watertoren van het voormalige psychiatrisch ziekenhuis Duin en Bosch (Watertorenpad) is in 1908-1909 gebouwd naar ontwerp van J. Scholtens, hoofdingenieur van de Provinciale Waterstaat van Noord-Holland; het reservoir kwam van F.A. Neuman uit Eschweiler. Rijksmonument 524182. Volgens het register 33,5 m hoog: een achthoekig, taps basement van bruinrode waalsteen met een getoogde deur in de zuidzijde en getoogde vensters aan drie zijden, een gepleisterde waterlijst boven een fries, een taps toelopende ronde schacht met tien kleine getoogde vensters, een geklonken ijzeren reservoir van 5 m doorsnede en 50 m³ (bodem type Intze) in een stalen ommanteling uit 1936 met een omloop uit 1965, en een flauw kegeldak met overstek en lantaarn. Na de restauratie van 2019-2021 is de toren een hotelkamer; het dak is daarvoor opgetild, met een glazen strook tussen mantel en dak.

## Bestanden

- `watertoren-castricum.glb`: één node `building:basement-schacht-reservoir-en-kegeldak`, op de voet van de toren.
- `watertoren-castricum.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-castricum-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [104731.91, 508169.17] (52,55882 N, 4,64594 O), het midden van de ronde BAG-contour van pand 0383100000005733 (straal 3,93 m: de hoeken van het achtkant), op de voet van de toren (AHN-DTM NAP +4,4 tot +4,5 op 4 tot 6 m uit het hart; gebruikt +4,45). `xAxis` [1, 0]: +X is RD-oost; de vlakken van het achtkant staan op de windrichtingen, met de deur in de zuidzijde (-Y). `groundHeight` 47,21 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de acht `groundSamplePoints` op 4,5 m van het hart (47,21 tot 47,87); PDOK heeft daar een bult van tot 1 m rond de voet, die het AHN-DTM (0,4 m) niet zo hoog ziet. Het model vervangt BAG-pand 0383100000005733, zodat de PDOK-cilinder verdwijnt. De buurpanden (0383100000005645, 0383100000005690) liggen op meer dan 4 m afstand en zijn in PDOK niet hoger dan in het AHN.

## Onderdeel `building:basement-schacht-reservoir-en-kegeldak`

- Basement: achtkant van 7,26 m over de vlakken (7,86 m over de hoeken, BAG), taps naar 7,1 m op 4,35 m. Getoogde deur in de zuidzijde als nis van 1,3 m breed tot 2,7 m hoog en 0,4 m diep; vensters van 1,1 m (1,3 tot 3,4 m) aan de noord-, oost- en westzijde als nissen van 0,3 m.
- Waterlijst: 0,1 m uit het achtkant met een onderkant van 45 graden, tot 4,6 m, en een schuine afdekking naar de schacht op 5,0 m.
- Schacht: taps rond van 6,4 m boven de waterlijst naar 3,95 m op 24,1 m. Bovenste fries van 22,25 tot 24,1 m, 0,12 m uit de schacht op een kraag van 45 graden. Tien vensters (oost en west op 8,5, 13,5 en 18,5 m, noord en zuid op 11,0 en 16,0 m) als nissen van 0,85 m breed en 1,1 m hoog met een spitse top van 55 graden.
- Reservoir: de bolle Intze-bodem en de omloop samen als één kraag van 45 graden van de schachttop (r 2,09 op 24,1 m) naar de buitenrand van de omloop (r 3,8 op 25,81 m), vloer van de omloop op 25,95 m; stalen mantel van 6,15 m tot de dakrand.
- Dak: onderkant onder 45 graden van de mantel (28,66 m) naar de dakrand (r 4,3 op 29,88 m), dakrand tot 30,3 m, kegeldak in zestien vlakken tot 32,15 m en een achtkante lantaarn van 0,9 m tot 32,55 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Castricum)): 1908, 33,4 m, 50 m³.
- [Rijksmonumentenregister 524182](https://monumentenregister.cultureelerfgoed.nl/monumenten/524182): ontwerper, achthoekig taps basement met deur zuid en vensters aan drie zijden, waterlijst en fries, schacht met tien vensters (oost en west drie, noord en zuid twee), reservoir 5 m en 50 m³ type Intze, ommanteling 1936, omloop 1965, kegeldak met overstek en lantaarn, 33,5 m.
- BAG-pand 0383100000005733 (PDOK, 2026-11-04): ronde contour r 3,93 m = achtkant over de hoeken.
- Luchtfoto 8 cm (PDOK, actueel): dakrand r 4,3 m in zestien vlakken, het dak 5,1 m naar het noorden verschoven (circa 30 m hoog); 6,3 m baksteen van de schachtvoet.
- AHN DSM/DTM 0,5 m (PDOK): maaiveld NAP +4,45; het DSM is van tijdens de restauratie (reservoir en dak weg, steigers), maar ziet de ring van de schachttop op NAP +28,5 = 24,1 m boven de voet. Voor het dak is het DSM niet bruikbaar.
- 3D BAG (AHN5, 2022): 70e percentiel van het dak 31,9 m boven maaiveld (model op r 2,1: 31,4 m).
- Foto's: "Castricum Watertoren 1394" op Wikimedia Commons (2006: basement, waterlijst, schacht; de schaal is boven en onder vrijwel gelijk, 32 px/m, schachttop 24,3 m, basement 4,5 m), RCE-foto 20284731 "Exterieur OVERZICHT - Castricum" (Intze-bodem, omloop 1,3 m boven de schachttop, mantel en dak vóór de restauratie) en de dronefoto bij het artikel van NH Nieuws van 14 juli 2026 (opgetild dak met glazen strook: verhoudingen van mantel 6,15 m = 1,56 maal de schachttop, omloop 1,23 en dakrand 1,40 maal de mantel, mantel, glas, dakrand, dak en lantaarn).

## Geschat en weggelaten

Geschat: de tapsheid van basement en schacht en de diameter van de schachtvoet (luchtfoto en foto 1394); de hoogtes van waterlijst, fries, omloop, dakrand, dak en lantaarn uit foto's, geschaald op de mantel; de mantel zelf (6,15 m) uit de verhouding tot de dakrand op de luchtfoto; de hoogtes van de schachtvensters (register: aantallen per zijde; foto's: alleen de oost- of westzijde); de deur- en vensternissen. De omloop ligt 0,35 m hoger dan op de foto's, zodat de kraag van Intze-bodem en omloop onder 45 graden blijft. Het register noemt 33,5 m; het model komt met de lantaarn op 32,55 m (de bliksemafleider en de schaal op de foto's verklaren het verschil niet volledig).

Weggelaten: de reling van de omloop en de dunne schoren eronder (kleiner dan 0,9 m), de dunne gemetselde banden om de schacht om de 1,5 m, de kleine vensters en de airco in de mantel, de glazen strook onder de dakrand (valt achter de schuine dakonderkant van 45 graden), de fries van gesmoorde baksteen onder de waterlijst en de bliksemafleider.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: waterlijst, fries, kraag van bodem en omloop en de dakonderkant onder 45 graden, nissen met een plafond van 56 graden of een spitse top van 55 graden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export (8,6 × 8,6 × 33,8 mm boven de onderplaat), zonder ondersteuning; het extra volume is alleen de voet tot de onderplaat. De voet staat op het laagste PDOK-maaiveld en zakt daardoor gemiddeld 0,6 m (hooguit 1,1 m) in de PDOK-bult rond de toren. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder van 7,9 m tot 31,9 m) het achthoekige basement met deur, vensters en waterlijst, de tapse schacht met vensternissen en fries, de kraag met omloop, de smallere mantel en het overstekende kegeldak met lantaarn.

Controle-URL: http://localhost:3000/kaart/52.55882/4.64594/200/1x1/0 (de taak gaf 52.55861/4.64583 uit Wikipedia, circa 25 m zuidelijker)
