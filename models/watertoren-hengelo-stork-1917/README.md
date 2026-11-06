# Watertoren Stork 1917 (Hengelo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hengelo-stork-1917.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren bestaat uit prisma's en convexe omhullenden (kraag, kroonlijst, schilddak, lantaarnkap), de hal en de vleugels uit prisma's van de BAG-contour met platte daken op hun AHN-hoogte, en vensters zijn blinde nissen.

De watertoren aan de Lansinkesweg is in 1917 gebouwd naar ontwerp van A.G. Beltman, met een reservoir van 125 m³, voor het drinkwater van het Stork-terrein. Sinds 2000 is hij met de aangebouwde voormalige modelmakerij de brandweerkazerne (rijksmonument 511480). Het is een vierkante, wit gepleisterde toren in de zuidgevel van de bakstenen modelmakerij: in de zuidgevel twee kolommen vensters boven de ingang, aan de andere kanten boven de hal blinde velden en drie grote vensters; daarop een iets bredere bovenverdieping op consoles, met afgeschuinde hoeken, licht bolle gevels en een rij vensters, een kroonlijst, een schilddak en een vierkante lantaarn.

## Bestanden

- `watertoren-hengelo-stork-1917.glb`: één node `building:watertoren-stork-met-modelmakerij-en-vleugels`, op maaiveld, onderkant 0,9 m eronder.
- `watertoren-hengelo-stork-1917.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hengelo-stork-1917-1-1000.stl`: alles samen op 1:1000 (141 × 42 × 37 mm).

## Oorsprong, oriëntatie en vervangen pand

RD-oorsprong [250579.41, 475713.82] (52,26115 N, 6,78725 O), het hart van de toren: het midden van de AHN-omhullende boven NAP +45 m, met de zuidgevel op de BAG-gevel. Maaiveld NAP +18,2 (AHN-DTM ten zuiden van de toren 18,18 tot 18,33; 3D BAG 17,72). +X langs de zuidgevel van toren en hal, onder -10,5 graden (`xAxis` [0.98325, -0.18224], de richting van de BAG-gevels), +Y naar het noordnoordoosten; de ingang ligt aan -Y. `groundHeight` 61,74 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` voor de zuidgevel (61,74 tot 61,78), gemeten met de terreintegels van de export. Het PDOK-maaiveld daalt naar het oosteinde van de oostvleugel tot circa 61,15; daarom loopt de vlakke onderkant 0,9 m onder het maaiveld door, zodat de vleugel daar niet zweeft.

De toren is geen eigen BAG-pand: hij hoort met de modelmakerij en een lage oost- en westvleugel bij pand 0164100000013444 (3023 m², bouwjaar 1920, 1011 hoekpunten). De PDOK-reconstructie van dat pand bevat de toren al (tot NAP +54,1). Een model van alleen de toren zou in die reconstructie steken, en het pand vervangen zonder de hal liet een gat van 140 m. Daarom staat het pand in `replacesBuildings` en bevat het model het hele pand. Andere panden raken het model niet: het dichtstbijzijnde (0164100000041891, een blok van 11 × 11 m uit 1919) staat 9 m ten westen van de hal, het pand ten noordoosten (0164100000013198) 17,5 m en het grote pand ten zuiden (0164100000013331) 23,5 m van het model.

## Onderdeel `building:watertoren-stork-met-modelmakerij-en-vleugels`

Maten in het lokale stelsel, hoogtes boven maaiveld (NAP +18,2).

Toren (hart van de schacht op (-0,05, -0,04)):

- Schacht: 9,3 × 10,2 m tot 27,95 m. Zuidgevel: twee kolommen vensters van 2,9 m breed (middenpijler 1,0 m) in zes rijen (3,6–6,4, 7,4–10,6, 11,6–14,8, 15,8–19,0, 20,0–23,2, 24,4–27,4 m), 0,35 m diep; de ingang (2,2 × 3,0 m, 0,5 m diep) onder de westelijke kolom. Oost-, noord- en westgevel boven het dak van de hal: drie blinde velden (18,2–23,6 m, 0,2 m diep) en drie grote vensters (24,4–27,4 m).
- Kraag: van de schacht naar de bovenverdieping, hoogstens 0,55 m uit over 0,95 m (consoles).
- Bovenverdieping: 28,9 tot 31,8 m, plattegrond een achthoek van 9,7 × 10,6 m tussen de hoeken met 1,0 m afgeschuinde hoeken en 0,3 m bolle gevels; per gevel vijf vensters van 1,1 m (29,6–31,2 m) en per schuine hoek één van 0,6 m.
- Kroonlijst: 0,3 m uit, onderkant van 31,8 tot 32,25 m, bovenkant 32,5 m (AHN NAP +50,5 tot 51 langs de dakrand).
- Schilddak met acht vlakken van de dakrand naar de lantaarn op 34,7 m (AHN NAP +52,9 op 2,1 m van het hart).
- Lantaarn: 4,2 m in het vierkant tot 35,6 m, met per kant een vensterband van 3,0 m (34,95–35,4 m); kap 0,15 m uit tot 35,95 m (NAP +54,15; AHN 54,1 tot 54,4, 3D BAG h_nok 54,38).

Modelmakerij en vleugels (BAG-contour, Douglas-Peucker 0,25 m):

- Hal: de contour van de modelmakerij met de torenvoet tot 11,45 m (AHN NAP +29,65), met drie rijen vensters op 4,2 m steek (2,6 m breed; 1,2–3,4, 4,6–6,8, 8,0–10,4 m).
- Bovenbouw: 3,5 m achter de zuidgevel, 3,4 tot 4,7 m achter de andere gevels, tot 17,56 m (AHN NAP +35,73), met twee rijen vensters (12,4–14,4 en 15,2–16,9 m); een lichtstraat van 25 × 3 m met de nok op 18,5 m (AHN NAP +36,7).
- Oostvleugel tot 6,1 m (AHN NAP +24,28) en westvleugel tot 6,3 m (NAP +24,49), elk met één hoge rij vensters (1,0–5,2 m); een lage strook van 2,3 m voor de zuidwesthoek van de hal.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Hengelo_Stork,_1917)): 1917, A.G. Beltman, 125 m³, rijksmonument 511480, brandweerkazerne sinds 2000; hoogte onbekend.
- BAG-pand 0164100000013444 (PDOK, 2026-11-06): contour van toren, hal en vleugels; de richting van de gevels.
- 3D BAG (CC BY 4.0, TU Delft 3D geoinformation en 3DGI): maaiveld 17,72, h_nok 54,38, h_dak_max 52,63.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): de omhullende van de toren boven NAP +45 (10,1 × 11,1 m), dakrand, dak en lantaarn; per zone de mediaan van de hal (29,65), de bovenbouw (35,73), de lichtstraat (36,7) en de vleugels (24,28 en 24,49); de inspringing van de bovenbouw per rij.
- Luchtfoto (PDOK, 2026-11-06): de achthoekige bovenverdieping met bolle gevels, het schilddak en de lantaarn, de lichtstraat en de zonnepanelen.
- Foto's op Wikimedia Commons: "Hengelo Watertoren 8745" (oostgevel, circa 46 px/m: velden, grote vensters, consoles, vensterband, kroonlijst, dak en lantaarn), "Hengelo-nl-stork-04 (9437555889)" (zuid- en oostgevel: vensterkolommen, ingang, aansluiting op de hal), "Hengelo-Lansinkesweg 59" en "P1090510 (4276094215)" (de hal en de vleugels van het zuidwesten en oosten).

## Geschat en weggelaten

Geschat: de breedte en diepte van de schacht en de bovenverdieping (uit de AHN-omhullende en de BAG-zuidgevel, die elkaar circa 0,3 m tegenspreken); de hoogtes van de kraag, de vensterrijen, de bovenverdieping en de kroonlijst (uit één foto met de AHN-dakrand als schaal); de bolling van 0,3 m en de afschuining van 1,0 m (luchtfoto); de lantaarn van 4,2 m (foto 3,9 m, DSM 5 m); de vensterindeling van de zuidgevel (zes rijen, foto in sterk perspectief) en de ingang onder de westelijke kolom; de vensterrasters van hal en vleugels (schematisch op 4,2 m steek, niet per gevel geteld); de lichtstraat als laag zadeldak.

Weggelaten: de antennemast met het stalen platform op het dak (staven dunner dan 0,9 m), de luifel boven de ingang (dunne plaat), de kleine vensters van de lantaarn afzonderlijk (één band), het tandlijstje en de consoles afzonderlijk (de kraag), de installaties en zonnepanelen op de daken van hal en oostvleugel (lager dan 0,9 m) en de dakranden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: kraag 30 graden, kroonlijst 0,3 m uit over 0,45 m, lantaarnkap 45 graden, nissen met een plafond van 56 graden. Een export op 1:1000 van een uitsnede van 160 × 160 m rond het pand neemt het model op zonder ondersteuning en verbergt het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten naast de PDOK-reconstructie van het pand heeft het model dezelfde massa's (hal met lagere rand, bovenbouw, lichtstraat, vleugels) en daarbij de vensters aan alle kanten, en aan de toren de bredere bovenverdieping met kraag, afgeschuinde hoeken en vensterband, de kroonlijst, het achtvlaks schilddak en de lantaarn waar PDOK een blok met een rommelige top heeft.

Controle-URL: http://localhost:3000/kaart/52.26114/6.78716/200/1x1/0
