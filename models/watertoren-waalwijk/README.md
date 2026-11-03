# Watertoren Waalwijk (Waalwijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-waalwijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de plint, de schacht, de band, de boogfries en het reservoir zijn omwentelingsvormen (`hull` van ringen), het dak een zestienkantig tentdak, de kraag onder het overstek een kegelstomp van 45 graden, de schoren en het lantaarntje prisma's, en de bogen, de deur en de galmgaten nissen.

De watertoren staat aan de Kloosterweg in Waalwijk. Hij is gebouwd in 1901-1902 naar een ontwerp van Visser en Smit, is gemeentelijk monument en is sinds 2018 buiten gebruik (Brabant Water levert de druk nu vanuit Vlijmen). Volgens Wikipedia is hij 34 m hoog met een reservoir van 200 m³. Een donkere, licht tapse plint draagt een ronde betonnen schacht. Bovenaan staan rondbogen tussen lisenen die als druppels naar beneden eindigen, daarboven een geprofileerde band en een uitkragende fries van kleine rondbogen. Daarop staat een stalen cilinderreservoir met verticale ribbels onder een zestienkantig koperen tentdak met een ver overstek op schoren en een lantaarntje met een spits.

## Bestanden

- `watertoren-waalwijk.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-waalwijk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 0867100000027518).
- `watertoren-waalwijk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [133022.91, 409638.42] (WGS84 51.675117, 5.069474), het middelpunt van een cirkelfit op de ronde BAG-contour van pand 0867100000027518 (37 m², straal 3,42 m; het BAG-bouwjaar 2008 is een registratiedatum). Het maaiveld ligt op NAP +2,90 m (AHN-DTM in een ring van 5 tot 10 m: mediaan 2,93, aan de zuidkant 2,7, aan de noordkant 3,1). De toren is rond: `xAxis` [1, 0], +X loopt langs RD-oost. De deur staat aan de westkant (-X), waar het pad op de luchtfoto uitkomt. De `groundSamplePoints` liggen op 4 m uit het hart, want verder naar het westen zakt het PDOK-maaiveld naar een lager pad. `groundHeight` 46,56 (NAP 2,90 + 43,66, NLGEO2018-geoïde op de oorsprong) is de terugval als er geen maaiveld is.

## Onderdeel `building:schacht-reservoir-en-tentdak`

- Donkere plint: rond, van 6,84 m (BAG) op maaiveld tot 6,6 m op 7,0 m, met een schuine overgang naar de schacht.
- Deur aan de westkant als nis van 1,2 m breed, 2,4 m hoog en 0,3 m diep met een rondboog.
- Schacht: rond, van 6,24 m boven de plint tot 6,08 m onder de arcade.
- Arcade: twaalf rondbogen van 1,1 m breed (kruin op 23,8 m) tussen lisenen van 0,66 m die 0,3 m voor de schacht staan en op 21,9 m eindigen met een druppel van 45 graden. De boogvelden zijn van onder open tot op de schacht en hebben een plafond van 56 graden.
- Geprofileerde band van 7,1 m van 24,55 tot 25,6 m op een kraag van 45 graden.
- Boogfries: een kraag van 45 graden naar 7,8 m, van 25,95 tot 26,9 m, met zestien kleine rondbogen van 1,0 m als nis van 0,25 m.
- Stalen reservoir van 7,9 m vanaf 26,9 m. Tot 29,6 m is de wand vrij, daarboven zit de kraag onder het overstek.
- Overstek: een kraag van 45 graden van de reservoirwand naar 10,0 m op 30,65 m, een zestienkantige dakrand van 10,5 m over de hoeken (luchtfoto) van 30,65 tot 31,0 m, en zestien schoren van 0,4 m breed onder 46 graden op de hoeken.
- Tentdak van 31 graden (helling 0,6, AHN) met zestien vlakken tot 34,15 m in het hart.
- Achtkantig lantaarntje van 1,4 m over de hoeken van 33,4 tot 34,4 m met vier galmgaten als nis en een lage kap tot 34,75 m (het AHN-maximum op NAP +37,66).

## Bronnen en maten

- [Wikipedia, Watertoren (Waalwijk)](https://nl.wikipedia.org/wiki/Watertoren_(Waalwijk)): 1901-1902, Visser en Smit, 34 m, 200 m³, buiten gebruik sinds 2018, gemeentelijk monument.
- BAG-pand 0867100000027518: een cirkel van 3,42 m straal.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): het maaiveld; de bovenkant van het dak daalt van NAP +35,95 op 1,75 m uit het hart naar +34,04 op 5,0 tot 5,5 m (helling 0,6); het maximum op NAP +37,66 is het lantaarntje. Rond de schacht staan in het DSM veel gevelpunten (10 tot 30 m) die het dak plaatselijk onderbreken.
- Luchtfoto (PDOK, 8 cm, sterk schuin opgenomen): een zestienkantig dak van circa 10,4 m, de donkere plint van 6,7 m, het pad naar de westkant en een venster in het zuidvlak.
- Foto [Waalwijk Watertoren 5998](https://commons.wikimedia.org/wiki/File:Waalwijk_Watertoren_5998.JPG): de opbouw, de verhoudingen en, met een perspectieffit op de plintbreedte en de dakrand, de hoogtes van de plint (6,9), de druppels (21,9), de boogkruinen (23,8), de band (24,6 tot 25,6), de fries (26,0 tot 26,9) en de onderkant van het reservoir (26,9 m).
- NLGEO2018-geoïdehoogte op de oorsprong (43,66 m) voor `groundHeight`.
- De 3D BAG was bij het meten niet bereikbaar.

## Geschat en weggelaten

Geschat:

- De hoogtes van de plint, de arcade, de band, de fries en het reservoir (±0,5 m, uit één foto van onderen met een perspectieffit) en de doorsneden van de schacht, de band en het reservoir (±0,2 m, uit verhoudingen op dezelfde foto).
- Het aantal bogen: twaalf in de arcade, zestien in de fries. Op de foto zijn de friesbogen kleiner en talrijker (circa 24), maar die zouden smaller dan 0,9 m zijn. Het reliëf van de arcade (0,3 m) is iets dieper dan in het echt.
- Het overstek is in het echt open, met een schuin beschot op schoren. In het model is het een kraag van 45 graden met de schoren als ribben ervoor, zodat het zonder steun te printen is. Daardoor is van de reservoirwand 1,4 m minder vrij dan in het echt.
- De richting van de deur (west, uit het pad en een lichte rand op de luchtfoto). Zijn maten zijn ook geschat.

Weggelaten, omdat ze kleiner zijn dan 0,9 m:

- de kleine vierkante vensters in de plint en de schacht, en het luik in het dak;
- de ribbels van het reservoir, de groeven in de band en de felsnaden van het dak;
- de spits op het lantaarntje.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node vrijwel niets op (volume minder dan 1 % meer). Kragen van 45 graden, nisplafonds van 56 graden en schoren van 46 graden houden de opvulling klein. Alleen de vlakke dakrand van 0,25 m buiten de kraag en de kap van het lantaarntje krijgen een randje, en de dunne schoren worden aan de wand iets verdikt. In een exporttest op 1:1000 (80 × 80 m) staat de toren in zijn geheel in de export. Het PDOK-pand is daar verborgen, en de voet zakt 0,1 tot 0,3 m in het maaiveld (het PDOK-maaiveld loopt van west naar oost op). PDOK toont de toren als een ronde zuil van 7 m tot de dakrand met een plat kegeldakje. Het model voegt de tapse plint met de deur, de smallere schacht, de arcade met lisenen, de band, de boogfries, het bredere reservoir, het zestienkantige overstek met kraag en schoren en het lantaarntje toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.67512/5.06947/200/1x1/0
