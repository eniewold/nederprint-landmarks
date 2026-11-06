# Nieuwe watertoren (Oostburg)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oostburg-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, kroonlijst, schacht, afdeklijst en dekplaat zijn één omwentelingsprofiel, de lantaarn een twaalfzijdig prisma onder een omwentelingsdak, ingang en aanbouw prisma's en omhulsels, en de vensters en de deur nissen.

De nieuwe watertoren aan de Bredestraat 67/69 in Oostburg is tussen 1948 en 1950 gebouwd naar ontwerp van A.J. van Eck. Volgens Wikipedia is hij 55 m hoog, met vijf reservoirs van 320, 715, 425, 325 en 375 m³ (samen 2160 m³); nu zijn het twee woningen. Sinds 1995 staat op de schacht de schildering "De Bron" van Johnny Beerens (een scheur met waterdruppels). Een ronde, licht verjongende gepleisterde schacht met een holle voet op een lage ronde onderbouw met een bakstenen plint, een krans van hoge vensters tussen stenen penanten en een holle kroonlijst; bovenaan kleine vierkante vensters, een afdeklijst, een uitkragende dekplaat met omgang, een glazen lantaarn onder een overstekend koperen dak en een ventilatietrommel.

## Bestanden

- `watertoren-oostburg-nieuwe-watertoren.glb`: één node `building:watertoren-onderbouw-schacht-dek-en-lantaarn`, op maaiveld.
- `watertoren-oostburg-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-oostburg-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [23331.03, 372995.83] (51,330856 N, 3,497829 O), het hart van de ronde contour van BAG-pand 1714100000725735 (bouwjaar 1949; kleinste kwadraten op 22 punten, straal 8,99 m, restfout tot 0,015 m). Het hart van de lantaarn in het AHN-DSM ligt er binnen 0,1 m naast. Maaiveld AHN-DTM NAP +2,05 (rond de toren 1,9 tot 2,4; naar de sloot in het zuidwesten zakt het tot 1,3). Ronde toren: +X naar RD-oost, +Y naar RD-noord; de ingang staat in het zuiden, de aanbouw in het noordwesten.

`groundHeight` 46,245 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de acht `groundSamplePoints` op 9,5 m van het hart: oost 46,64, noordoost 46,51, noord 46,41, noordwest 46,34, west 46,25, zuidwest 46,30, zuid 46,38, zuidoost 46,53. De PDOK-reconstructie van het pand is een rond prisma met een plat dak en een blok erop, van 46,15 tot 100,76 (NAP +56,6); de buurpanden (onder meer 1714100000725733, 25 m noordelijker) raken het model niet.

## Onderdeel `building:watertoren-onderbouw-schacht-dek-en-lantaarn`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Onderbouw: rond, straal 8,15 m, bakstenen plint tot 1,4 m, daarboven een krans van vensters van 1,8 m breed tot 3,7 m op twintig assen om de 18 graden (penanten van 0,75 m), behalve achter de ingang en de aanbouw; vensters als nissen van 0,3 m met een plafond van 63 graden.
- Kroonlijst: holle kraag vanaf 3,95 m met een onderkant van 50 graden tot de rand op 8,99 m (BAG), rand tot 5,3 m (AHN 5,3 à 5,6).
- Schacht: van 8,6 m op de kroonlijst met een holle voet (8,35 op 7 m, 8,2 op 9 m) naar 8,05 m op 12 m, 7,75 op 20 m, 7,42 op 30 m en 7,0 m op 44,06 m (AHN).
- Kleine vensters: zestien nissen van 0,9 × 0,9 m van 42,95 tot 43,85 m.
- Afdeklijst: 0,2 m uitstekend (onderkant 50 graden) tot 44,6 m.
- Dekplaat: straal 6,35 m (AHN, foto), groef van 50 graden eronder, dek op 46,0 m (AHN NAP +48,05).
- Lantaarn: twaalfhoek met omgeschreven straal 2,3 m, borstwering tot 46,9 m, twaalf glasvelden van 1,0 m breed (nissen van 0,2 m), dak met een onderkant van 50 graden tot de rand op 3,35 m, rand tot 51,6 m en een vlakke kegel tot 52,25 m (AHN).
- Ventilatietrommel: achthoek met straal 0,75 m tot 53,0 m, kap met straal 1,15 m (onderkant 50 graden), rand tot 53,8 m, top 54,3 m (AHN NAP +56,5).
- Ingang (zuid): portiek van 4,4 m breed met afgeronde voorhoeken tot 9,6 m van het hart en 4,3 m hoog, deurnis van 2,0 × 2,0 m (0,35 m diep) op de vloer van 0,9 m, luifel op 3,6 m (onderkant 50 graden), bordes en vier treden van 0,4 m diep tot 11,8 m, tussen twee stenen muren van 0,9 m dik en 2,0 m hoog.
- Aanbouw (noordwest): bakstenen blok met plat dak in de BAG-sector van 104 tot 138,7 graden, tot 13,3 m van het hart, 4,3 m hoog (AHN), met drie vensters in de gebogen buitenwand en twee in de zuidwestelijke zijwand (nissen van 1,0 × 1,3 m).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Oostburg)): 1948-1950, A.J. van Eck, 55 m, 320 + 715 + 425 + 325 + 375 m³, schildering "De Bron", twee woningen.
- BAG-pand 1714100000725735 (PDOK, 2026-11-06): ronde contour (straal 8,99 m) en de aanbouw. Het id uit de taak klopt; het pand van 1949 is het enige dat de toren omvat.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, straal van de schacht per hoogte, dek, lantaarndak, trommel, aanbouw.
- PDOK-luchtfoto (2026-11-06): koperen lantaarndak met radiale naden, omgang, aanbouw met plat dak.
- PDOK-gebouw- en terreintegels (2026-11-06): reconstructie van het pand, terreinhoogtes op de bemonsteringspunten.
- Foto's op Wikimedia Commons, categorie "Watertoren (Oostburg)": RCE-foto's van 2000 (ingangspartij, onderbouw, overzicht), "Oostburg watertoren met beschildering.jpg" (2013, top met dekplaat, lantaarn en trommel), "Oostburg, watertoren foto3 2015-08-10 16.54.jpg", "Oostburg - Watertoren met schildering.jpg" en "Oostburg - Watertoren met wolken.jpg" (2008).

## Geschat en weggelaten

Geschat: de richting van de ingang (zuid, uit een verhoging van 3 à 5 m in het AHN-DSM net buiten de kroonlijst en een gat in het DTM; geen foto toont de richting); de maten van portiek, deur, luifel, trap en muren (één frontale foto); de straal van de vensterkrans (8,15 m) en de hoogtes van plint, vensters en het begin van de kroonlijst (foto's, geschaald op de AHN-hoogte van de rand); het aantal vensterassen (twintig) en kleine vensters (zestien, met een geschatte fase); de stralen van lantaarn (2,3 m) en trommel uit de verhoudingen op de foto van 2013. De straal van de schacht per hoogte uit het AHN is circa 0,2 m nauwkeurig.

Aangepast om zonder steun te printen: de holle kroonlijst, de dekplaat, het lantaarndak en de kap hebben een onderkant van 50 graden in plaats van een vlakke of holle; daardoor begint het lantaarndak al op 49,7 m en lijkt het dikker dan op de foto. De smalle ingesprongen trommel met kleine ramen tussen de afdeklijst en de dekplaat is een groef onder de dekplaat geworden.

Weggelaten: de schildering (alleen verf), de spleetvensters in de schacht (0,25 m breed), de ramen in de ingesprongen trommel onder de dekplaat (0,3 m), het hekwerk van de omgang, de stijlen van de lantaarn als losse onderdelen, de antennes en vlaggenmasten, de lantaarns naast de ingang, de schoorsteenpijp van de aanbouw en het hek rond het terrein.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 (ondersteuning v2, 45 graden) van een uitsnede van 80 m bevat het model, niet meer het PDOK-pand, en geen ondersteuning onder het model. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een glad rond prisma met een vlak dak en een blok) aan elke kant de verjongende schacht met holle voet, de vensterkrans, de kroonlijst, de kleine vensters, de afdeklijst, de dekplaat, de glazen lantaarn met dak en de trommel; aan de zuidkant ook de ingang met trap en muren en aan de noordwestkant de aanbouw met vensters.

Controle-URL: http://localhost:3000/kaart/51.33086/3.49783/200/1x1/0
