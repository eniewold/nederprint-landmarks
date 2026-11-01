# Zuidertoren (Schiermonnikoog)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-schiermonnikoog-zuidertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, fries, kroonlijsten en lantaarnhuis zijn één omwentelingsprofiel, de koepel een twaalfzijdige omwenteling; deur, vensters en boogjes zijn nissen.

De Zuidertoren is in 1854 samen met de Noordertoren gebouwd als vuurtoren. Na 1910 was zijn licht overbodig; in 1950 kreeg hij een waterreservoir van 44 m³ in de schacht en was hij tot 1992 de watertoren van het eiland. Daarna antennetoren van KPN, sinds 2018 van een stichting die er een museum van maakt. Rijksmonument 398179. Volgens Wikipedia 31,5 m hoog.

## Bestanden

- `watertoren-schiermonnikoog-zuidertoren.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse koepel of kroonlijst zou een voet tot de grondplaat krijgen.
- `watertoren-schiermonnikoog-zuidertoren.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-schiermonnikoog-zuidertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [206213.86, 610862.86], het middelpunt van de cirkel door de BAG-contour van pand 0088100000138176 (straal 3,86 m, 36 punten), op maaiveld (NAP +13,33 m in het AHN-DTM, op de duintop). Het hart van de toren in het AHN ligt minder dan 0,1 m daarvandaan. Assen in RD-richting (`xAxis` [1, 0]). De deur staat op het zuiden, aan het eind van het schelpenpad op de luchtfoto; de tweede vensterrij staat een kwartslag verder op het westen (op drie foto's vanuit het zuiden en zuidwesten links van de deurrij). Vervangt alleen het BAG-pand van de toren; de lichtwachterswoning en het olieschuurtje zijn aparte panden en blijven PDOK.

## Onderdeel `building:schacht-omloop-lantaarn-en-koepel`

- Plint van 7,72 m (BAG) tot +0,7, daarboven de gepleisterde schacht van 7,56 m, recht taps naar 4,4 m op +27,55.
- Rondboogdeur op het zuiden (1,65 m breed, boog tot +3,0, 0,4 m diep). Ronde vensters van 0,7 m langs de trap: drie boven de deur (+10,5, +19,0, +26,7) en drie op het westen (+5,7, +14,6, +22,5).
- Ringband (4,7 m) met een schuine onderkant van +27,55 tot +28,0, fries van +28,0 tot +28,8 met twaalf blinde rondboogjes (0,7 m breed, penanten 0,45 m).
- Omloopkroonlijst: schuine onderkant onder 51 graden van de fries naar 5,6 m op +29,55, rand tot de omloop op +29,8 (AHN).
- Lantaarnhuis van 3,0 m tot +30,3 met een kroonlijst van 3,78 m (onderkant onder 55 graden) tot +31,05 (AHN).
- Geribde koepel: twaalfzijdige halve ellipsoïde van 2,6 m breed en 1,8 m hoog tot +32,85.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Zuidertoren_(Schiermonnikoog)): geschiedenis, 1854, watertoren 1950-1992, 44 m³, 31,5 m.
- [Rijksmonument 398179](https://monumentenregister.cultureelerfgoed.nl/monumenten/398179).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +13,33 rond de voet, omloop vlak op 29,8 m boven maaiveld met een oppervlak dat bij een straal van 2,82 m hoort, ring van de lantaarnkroonlijst rond 31 m (straal 1,85 tot 1,9 m), koepel tot 32,6 tot 33,2 m en de windvaan tot 33,44 m; de straal van de schacht op 8 tot 14 m (3,0 tot 3,3 m) past bij een rechte kegel van 7,56 naar 4,4 m.
- BAG-pand 0088100000138176 en luchtfoto (PDOK): ronde contour, schelpenpad naar de deur op het zuiden.
- Foto [Zuidertoren Schiermonnikoog](https://commons.wikimedia.org/wiki/File:Zuidertoren_Schiermonnikoog.jpg), frontaal op de deur: verhoudingen van schacht, fries, kroonlijsten, lantaarn en koepel, geschaald op de omloop in het AHN (5,6 m = 22,3 px/m); de deur en de vensters boven de deur.
- Foto's [Torenstreek22 Zuidertoren](https://commons.wikimedia.org/wiki/File:Torenstreek22_Zuidertoren_Schiermonnikoog.jpg), [Watertoren Schiermonnikoog 15m](https://commons.wikimedia.org/wiki/File:Watertoren_Schiermonnikoog_15m.JPG) en [RCE 20273297](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Schiermonnikoog_-_20273297_-_RCE.jpg): vensterhoogtes en de tweede vensterrij, het boogjesfries, het lantaarnhuis.
- Foto [RCE 20273300](https://commons.wikimedia.org/wiki/File:Exterieur_ENTREE_-_Schiermonnikoog_-_20273300_-_RCE.jpg): deur met bovenlicht en omlijsting, plint.

## Geschat en weggelaten

Geschat: de hoogtes van ringband, fries en de onderkant van de omloopkroonlijst (foto's van onderaf, geschaald op de omloop), de hoogte van het lantaarnhuis (het AHN geeft alleen de bovenkant van zijn kroonlijst), de vorm van de koepel (halve ellipsoïde tussen de foto en de AHN-top), de vensterhoogtes (gemiddelde van vier foto's, binnen circa 0,8 m), het aantal boogjes (twaalf, uit de afstand van de penanten op de frontale foto) en de richting van de tweede vensterrij. Of er op het noorden en oosten ook vensters zitten is op geen foto te zien; daar staan er geen. Om printbaar te blijven hangen de kroonlijsten onder 51 en 55 graden in plaats van met een holle onderkant, en zijn de vensters en boogjes nissen met een plafond dat naar binnen oploopt.

Weggelaten (kleiner dan 0,9 m of te dun): de windvaan met figuur op de koepel, de antennes en kabelgoten van KPN, de gedenkplaat boven de deur en de verhoogde deuromlijsting met sluitsteen (reliëf onder 0,1 m), de ramen in het lantaarnhuis en de ring onder de ringband.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,03 %; de doorsneden op 1,5, 10,5, 28,4, 29,2, 30,1 en 31,5 m (deur, venster, boogjesfries, kroonlijst, lantaarn, koepel) blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) vult de ondersteuning alleen de kruinen van de rondboogjes in het fries een beetje op; de penanten ertussen blijven staan. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,5 m in het PDOK-maaiveld van het duin.

Controle-URL: http://localhost:3000/kaart/53.48150/6.15867/200/1x1/0
