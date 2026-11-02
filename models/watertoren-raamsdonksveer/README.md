# Watertoren Raamsdonksveer (Raamsdonksveer)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-raamsdonksveer.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, overgang en behuizing zijn geëxtrudeerde en verlopende zeshoeken, de beren en erkers convexe blokken, de bekroning een twaalfhoek en de koepel één convex omhulsel van twaalfhoeken; panelen, uitsparing, vensterspleet en ingang zijn nissen.

De watertoren aan de Oosterhoutseweg 18 in Raamsdonksveer is in 1925 gebouwd naar ontwerp van H. Sangster (Hendrik Sangster) voor de N.V. Waterleiding Maatschappij Noord-West-Brabant: 43,85 m hoog met een cilindrisch betonnen reservoir van 300 m³ (hoogwater op 36 m), rijksmonument 520055. Een betonskelet met bepleisterde baksteen op een zeshoekige plattegrond, in vier delen: plint, smallere schacht, een reservoirbehuizing die via trapsgewijs uitkragende lagen uitsteekt (het verst aan de oost- en westzijde) met een ondiepe erker in elk vlak, en een twaalfzijdige bekroning met een iets spits koepeldak. Steunberen staan op de noord- en zuidhoek en twee tegen de oost- en de westgevel van de schacht. Sinds 2024 wordt de toren bij een nieuw hotel betrokken; de eenlaagse aanbouwen uit 1992 zijn daarvoor gesloopt.

## Bestanden

- `watertoren-raamsdonksveer.glb`: één node `building:zeshoekige-schacht-reservoir-en-koepel`, op het maaiveld.
- `watertoren-raamsdonksveer.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-raamsdonksveer-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [119685.67, 410817.23], het hart van de toren uit het AHN5-DSM (de BAG-contour van pand 0779100000000227 is "niet ingemeten" en ligt circa 1,5 m te noordelijk), op maaiveld (AHN5-DTM NAP +2,09 tot +2,33; 3D BAG 2,19; gebruikt +2,2). De zeshoek staat met de hoeken op noord en zuid (register, BAG-contour, luchtfoto): lokale +X is de normaal van de oostgevel (`xAxis` [1, 0]). `groundHeight` 45,96 is NAP +2,2 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,76 m). Het model vervangt het pand, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:zeshoekige-schacht-reservoir-en-koepel`

- Plint: zeshoek van 10,2 m over de vlakken tot 7,0 m, bovenrand 0,3 m onder 45 graden naar de schacht.
- Schacht: zeshoek van 9,6 m over de vlakken (11,1 m over de hoeken), recht tot 28,4 m.
- Hoekberen op de noord- en zuidhoek: 1,0 m breed, 0,5 m voorbij de hoek, tot 37,2 m met een schuine kop (45 graden).
- Twee steunberen tegen de oost- en de westgevel: 0,9 m breed, 0,6 m uit de gevel, op 1,75 m uit het midden, tot 29,6 m met een schuine kop.
- Overgang: van 28,4 tot 28,75 m kraagt de behuizing onder 45 graden uit tot 10,3 m over oost en west en 9,9 m over de schuine vlakken.
- Erker in elk vlak van de behuizing: 2,6 m breed, 0,25 m uit, van 30,0 tot 36,8 m met een onderkant onder 45 graden.
- Bovenkant van de behuizing op 37,6 m.
- Twaalfzijdige bekroning van 9,4 m over de hoeken tot 40,4 m met per vlak een paneel van 1,4 m (nis van 0,25 m) en een kroonlijst 0,2 m uit tot 41,0 m.
- Koepel: iets spits, twaalf vlakken, van de rand op r 4,6 (41,0 m) via r 4 (41,9), r 3 (42,7), r 2 (43,35) en r 1 (43,85) tot de top op 44,05 m.
- Oostzijde: de ingang in de plint (1,8 m breed, spitse top op 3,8 m), de dichtgezette vensterspleet tussen de steunberen (1,0 m breed, 8,0 tot 27,2 m) en de uitsparing in de behuizing tussen de koppen van de beren (2,0 m breed, 28,2 tot 29,8 m), alle als nis.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Raamsdonksveer)): bouwjaar, ontwerper, 43,85 m, 300 m³, restauraties en de hotelplannen.
- [Rijksmonumentenregister 520055](https://monumentenregister.cultureelerfgoed.nl/monumenten/520055): zeshoekige plattegrond, de vier delen, de steunberen (noord- en zuidhoek, oost- en westgevel), de uitkragende overgang, de erkers, de uitsparing en de ingang aan de oostzijde, de twaalfzijdige bekroning en het iets spitse koepeldak.
- AHN5 DSM/DTM 0,5 m (PDOK, 2024; opgehaald 2026-11-02): maaiveld NAP +2,09 tot +2,33, top NAP +46,25 (44,05 m), koepel r 4 op 41,7 en r 3 op 42,6, rand circa 41 m, bovenkant behuizing 37 tot 38 m; oost-west 10,4 tot 10,8 m en noord-zuid 12 m boven 36 m.
- 3D BAG (LoD2.2, AHN5 2024) van pand 0779100000000227: maaiveld 2,19, dak tot 46,04 (NAP); ter controle.
- BAG-pand 0779100000000227 en luchtfoto 2025 (PDOK): de zeshoek, de stand (een koepelrib en de zuidhoek wijzen recht naar het zuiden) en de twaalf vlakken van de koepel.
- RCE-foto's 20346871 (frontaal over een berengevel) en 20335216 (bekroning en koepel), foto "Raamsdonksveer - watertoren" (2007) en "Raamsdonkveer, de watertoren RM520055" (2020) op Wikimedia Commons: plint, beren, overgang, erkers, bekroning en koepel, geschaald op de breedte van de bekroning en de AHN-top.

## Geschat en weggelaten

Geschat: de hoogte van de plint (foto's 6,8 tot 7,9 m), de overgang (28,4 m) en de koppen van de beren (foto's), de breedte en het uitsteken van de beren en de erkers, de hoogte van de bekroning (37,6 tot 41,0 m) tussen de AHN-punten, het koepelprofiel tussen de AHN-punten (de koepel is met 0,5 m-cellen vervaagd), de breedte van de panelen, de vorm van de ingang (achter de gesloopte aanbouw niet te zien), de vensterspleet en de uitsparing alleen aan de oostzijde (register) en de diepte van de nissen. De stand van de zeshoek (hoeken precies noord-zuid) komt uit de luchtfoto; de BAG-contour wijkt 0 tot 6 graden af.

Weggelaten: de eenlaagse aanbouwen uit 1992 (gesloopt voor de hotelbouw; in BAG niet meer aanwezig) en het nieuwe hotel ernaast (eigen BAG-pand, blijft van PDOK); de dichtgezette gekoppelde vensters en lichtopeningen (dichtgemetseld, kleiner dan 0,9 m), het rechthoekige venster in de oostelijke erker en de kleine vensters in de behuizing (kleiner dan 0,9 m), de koepelribben en de stappen in de uitkragende lagen (minder dan 0,9 m), de dunne lisenen langs de erkers, de antennes, het reclamebord en de tuidraden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan een miljoenste: plint, overgang, erkers, beerkoppen en kroonlijst staan onder 45 graden, de nisplafonds onder 56 en de koepel is convex. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (3D BAG LoD2.2: een zeshoekige kolom met een scheef puntdak en een restje aanbouw) de plint, de hoek- en gevelberen, de uitkragende behuizing met erkers, de twaalfzijdige bekroning met panelen en kroonlijst, de spitse koepel en de ingang, vensterspleet en uitsparing aan de oostzijde.

Controle-URL: http://localhost:3000/kaart/51.68505/4.87659/200/1x1/0
