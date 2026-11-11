# H. Johannes de Doperkerk (Westbeemster)

Rooms-katholieke kerk aan de Jisperweg 55, gebouwd in 1878–1879 naar ontwerp van H. Bijvoets (rijksmonument 511342): een neogotische kruisbasiliek met een gedrukte lichtbeuk met kleine bovenvensters, een driezijdig gesloten koor, een dakruiter op de viering en een voortoren met vier frontalen en een achtkante naaldspits.

## Bestanden

- `h-johannes-de-doperkerk-westbeemster.glb`: het model in meters, Y omhoog, één node `building:kerk`.
- `h-johannes-de-doperkerk-westbeemster.json`: catalogusitem.
- `h-johannes-de-doperkerk-westbeemster-1-1000.stl`: binaire STL in millimeters op 1:1000, Z omhoog.
- Generator: `scripts/generate-h-johannes-de-doperkerk-westbeemster.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (121909,24; 509860,66) op de as van de kerk, op de lijn van de zijbeukmuren, op maaiveld (NAP −3,13 m). De X-as (0,93728; −0,34857) wijst langs de nok naar het oostzuidoosten, naar de toren aan de Jisperweg; +Y wijst naar het noordnoordoosten. De as volgt de evenwijdige zijbeukmuren van de BAG-contour (−20,4 graden).

`groundSamplePoints` liggen 1 tot 2 m buiten de gevels: de hoeken van de bounding box vallen in de sloot langs de weg en lieten het model in de export 1,8 m zakken. `groundHeight` 39,68 is de laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export bemonstert.

## Onderdelen

- Schip en koor onder één zadeldak (goot 13,0 m, nok 20,2 m, 56,7 graden uit de 3D BAG en het AHN), koor driezijdig gesloten met schilddakvlakken, steunberen en hoge spitsboogvensters.
- Zijbeuken met lessenaarsdak van 8,4 naar 10,6 m tegen de lichtbeuk, steunberen op de BAG-posities, spitsboogvensters en kleine bovenvensters in de lichtbeuk.
- Transept met dezelfde goot en nok, topgevels die boven het dak uitsteken met een kruisblok, groot venster en drie lancetten, en een portaal met topgevel tegen elke transeptgevel.
- Dakruiter op de viering: achtkante lantaarn en naaldspits tot 30 m.
- Dakkapellen op het schip en de zijbeuken.
- Driezijdig gesloten doopkapel aan de zuidzijbeuk naast de toren, met schilddak en steunberen.
- Lage aanbouwen bij het koor: kapel met zadeldak en schild aan de zuidkant, platte sacristie aan de westkant, kapel met schilddak aan de noordkant.
- Toren: schacht van 6,2 m met haakse hoeksteunberen (versprong op 14 m) tot de lijst op 19,6 m, klokverdieping met galmgaten en klokken tot 29,3 m, kruisdak met vier frontalen tot 34,8 m, vier hoekpinakels, achtkante naaldspits tot 55,9 m, traptoren in de noordwesthoek en het hoofdportaal met topgevel.

## Geschat en weggelaten

Geschat: de traveeverdeling en vensterhoogten (zuidfoto RCE 20253759), de torengeledingen (lijsten, frontalen en pinakels) uit foto's naast de AHN-hoogten van de lijst (circa 29,5 m) en spits (NAP +52,83 m), de dakruiter (alleen één AHN-punt op 30 m), de hoogte en vorm van de traptoren (BAG-contour en AHN rond 22–23 m; niet op een foto gecontroleerd) en de dakvormen van de lage aanbouwen (3D BAG). Weggelaten: tracering, windwijzers en kruisen (dunner dan 0,9 m), de dakkapelletjes in de torenspits, de open bogen van de dakruiter (dicht gelaten) en de pastorie, die een eigen BAG-pand is.

## Controle

Generator: status NoError, genus 0, één samenhangende solid van 53,7 × 23,9 × 56,4 m. De test in `tests/landmark-models.test.ts` plaatst het model, controleert de enige node en vult op 1:1000 met de overhangcontrole op 45 graden zonder meer dan 3 % extra volume. Een tijdelijke export op een uitsnede van 160 m plaatste de voet overal 0,3 tot 0,5 m in het PDOK-maaiveld. Renders van vier kanten zijn naast de 3D BAG-reconstructie gelegd en vergeleken met de foto's van Wikimedia Commons; de buurpanden (pastorie, woonhuis) staan in PDOK niet hoger dan het AHN.

## Bronnen

- [Rijksmonumentenregister 511342](https://monumentenregister.cultureelerfgoed.nl/monumenten/511342): bouwjaar, architect, kruisbasiliek met toren, frontalen en naaldspits.
- [PDOK BAG](https://service.pdok.nl/lv/bag/wfs/v2_0): pand `0370100000002738` (kerk met toren) en de contour.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0370100000002738): LoD2.2-dakvlakken, hellingen en nokhoogte.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) `dsm_05m` en `dtm_05m`: controle van nok, goten en torenomhullende.
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Wikimedia Commons, Johannes de Doper (Westbeemster)](https://commons.wikimedia.org/wiki/Category:Johannes_de_Doper_(Westbeemster)) en [Wikidata Q17462935](https://www.wikidata.org/wiki/Q17462935).

Controleer op de [kaart](http://localhost:3000/kaart/52.57534/4.89906/200/1x1/0) de oriëntatie van toren en koor, de traptoren naast de toren en de aansluiting op de pastorie.
