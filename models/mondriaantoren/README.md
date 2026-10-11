# Mondriaantoren (Amsterdam)

Kantoortoren aan het Amstelplein op de Omval (ZZ+P Architecten, ontwerp Peter Ellis, 2002), 120 m en 31 lagen, naast de Rembrandttoren. Benoemde prisma's en convexe bouwdelen in een eigen gebouwstelsel; geen gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-rembrandttoren.mjs` en `generate-haagse-toren.mjs`. Reproductie: `node scripts/generate-mondriaantoren.mjs`.

## Bestanden en plaatsing

- `mondriaantoren.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 16.674 driehoeken).
- `mondriaantoren.json`: catalogusitem.
  - RD-oorsprong `[122993.62, 484117.13]`: het hart van de vierkante schacht.
  - `xAxis` 20,1°: de BAG-gevels lopen op 20,1° en 110,1°, dezelfde as als de Rembrandttoren. +X loopt langs de middenschijf naar het oostnoordoosten (spoorzijde), +Y naar het noordnoordwesten (Amstelplein). De westvleugel en de onderbouw liggen aan −X, richting de Amstel.
- `mondriaantoren-1-1000.stl`: millimeters, Z omhoog, 60,4 × 31,1 × 123,7 mm, vlakke voet.

z = 0 ligt op NAP +0,5 m: de straat aan de oost- en zuidoostzijde (AHN-DTM +0,5 tot +0,8; 3D BAG-maaiveld 0,41). De voet loopt door tot −1,2 m (NAP −0,7). Rondom de rest van de toren ligt een dek op NAP +1,9 tot +2,0; daar bedekt het PDOK-terrein de voet. `groundOffsetMetres` is 0, `groundSamplePoints` liggen op de straat: `[22,−14] [25,−10] [12,−18] [20,−18]`.

Vervangt alleen BAG `0363100012097541` (bouwjaar 2001): schacht, westvleugel, onderbouw, de noorderker en de ronde aanbouw liggen allemaal in dat pand. Het enige pand dat het model raakt is het kantoor ten westen (`0363100012085009`): de 3D BAG geeft het 32,4 m, gelijk aan het AHN (31–32), dus het heeft geen punten van de toren meegenomen. Het paviljoen ten noorden (`0363100012092758`, 12,0 m) ligt 20 m verder. De Breitnertoren (`0363100012070861`) en de Rembrandttoren (eigen model, 114 m noordelijker) zijn aparte gebouwen en overlappen niet.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

- **Schacht** van 27,6 × 26,2 m (BAG) tot +106,5. De hoeken zijn glazen: per laag één glasvak tussen stenen penanten van 0,9 m, 28 lagen boven een hal tot +6,2.
- **Rastererkers** midden op de noord- en zuidgevel: 17,2 m breed, 1,84 m uit de gevel, tot +101,0 (3D BAG 97,3–101,9). Ze dragen het vierkante Mondriaan-raster: vier vakken van 2,8 × 2,5 m per laag, 25 lagen, als nissen van 0,35 m. De zijkanten hebben een smalle glasstrook per laag. De noorderker staat op het maaiveld (BAG) met een hoge glazen pui in de hal. De zuiderker begint boven de hal op +6,2, met een ondervlak van 45°.
- **Ronde aanbouw** tegen de noorderker: Ø 3,8 m tot +12,5 (BAG-boog, AHN 12–19).
- **Middenschijf** oost-west, 14 m breed, van x −7,75 tot 19,41, tot +117,35. Aan de oostkant steekt hij 5,6 m uit de schacht en loopt hij 15 m breed tot het maaiveld (BAG), met stenen penanten en één venster per laag.
- **Gelede glazen erker** midden in de oostkop: 7,5 m breed en 1,2 m uit de gevel, in vier delen van zes lagen (+20 tot +104). Elk deel heeft een ondervlak van 45°, laagvoegen en twee stijlen.
- **Kroon** van de schijf boven het schachtdak. Hij is van steen en heeft twee grote vierkante vensters (3,8 × 6 m) in de oostgevel en twee hoge vensters aan het oosteinde van de noord- en zuidgevel; daar hangt in werkelijkheid ook de naam van de huurder. De westgevel heeft twee vensters naast de glazen opbouw.
- **Glazen opbouw** aan de westkant van het dak, 9,5 × 5 m tot +120,6, met stijlen op 1,5 m.
- **Gevelonderhoudsinstallatie**: een wagen tot +121,9 met een kop tot +122,95 (3D BAG) en de giek oost-west tot boven de glazen opbouw. De giek is een gesloten schot van 1 m dik, zoals bij de Rembrandttoren.
- **Westvleugel** van 10,6 × 15 m tot +92,3, met drie vensters per laag in de zijgevels en glasvakken in de hoeken naast de kern. De **trappenhuiskern** van 8,6 × 9,75 m komt 2,2 m uit de vleugel en loopt tot +94,8.
- **Onderbouw** aan de westkant tot +11,3, met twee rijen ramen. Een **strook** tegen het buurpand loopt tot +9,0.

## Geschat en weggelaten

Geschat:

- De laagindeling: een hal tot +6,2 en lagen van 3,55 m, uit foto's en de 31 lagen van Wikipedia.
- Het raster en de vensterbreedtes, uit foto's van het plein en de Amstel.
- De glazen erker in de oostkop: indeling, breedte, uitsprong en de grenzen van de delen (+20/41/62/83/104), uit foto's vanaf het spoor.
- De zuiderker is gespiegeld van de noorderker. De BAG tekent hem niet (de hal ligt terug), maar het AHN heeft wandpunten op 1,5 m voor de zuidgevel en de luchtfoto toont de uitgebouwde stenen erker.
- De kroonvensters, de glazen opbouw en de plaats van de giek, uit foto's en de luchtfoto. Alle hoogtes komen uit AHN/3D BAG.

Weggelaten:

- **Open stalen kroon** uit de backloghint: die bestaat niet. Foto's (2004–2021) en de luchtfoto tonen een gesloten stenen kroon met een glazen opbouw en een gevelonderhoudsinstallatie. Het open stalen frame op de foto's hoort bij de Breitnertoren.
- **Opschrift** van de huurder (Delta Lloyd, Nationale Nederlanden, Rabobank): dat is reclame, geen bouwvorm.
- **Leuningen** op de daken en de rails van de installatie: kleiner dan 0,9 m.
- **Raamstijlen** in de rastervakken: smaller dan 0,3 m.
- **Glazen entreeluifel** op het plein: de AHN-schaduw aan de noordzijde laat de vorm onbepaald en hij valt grotendeels buiten het BAG-pand.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 115.373 m³ (3D BAG LoD2.2: 112.955 m³). Ondervlakken zijn alleen de bovenkanten van nissen en de schuine onderkanten van de erkers.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts` gaf 397 geslaagd. De eigen test controleert:
  - de catalogus, de oorsprong en het vervangen pand;
  - voet, top en uitersten;
  - de hoogtes van strook, onderbouw, vleugel, kern, erker, schacht, schijf en opbouw;
  - de vier erkerdelen en het schuine ondervlak van de zuiderker;
  - 25 rasterlagen, de kroonvensters en de giek.
- **Printcheck** op 1:1000 bij 45°: 0,08 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[122935,484060,123055,484180]`, 120 × 120 mm. Duur 6,3 s, 124 objecten, 86.536 driehoeken, modelhoogte 125,3 mm. Het PDOK-pand is verborgen en het model staat op het terrein.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235°, van bovenaf en vanuit de hoeken van de foto's (135°, 200°, 45°, 250°, en 20–30° naast elke gevel). De 3D BAG heeft dezelfde massa's met vlakke wanden. Wat het model per kant méér heeft:
  - **Noord (−35°)**: het raster op de erker, de glazen hoeken, de ronde aanbouw en de kroonvensters.
  - **Oost (55°)**: de gelede glazen erker in de oostkop, de penanten met vensters en de grote kroonvensters.
  - **Zuid (145°)**: de zuiderker met raster en schuin ondervlak; die ontbreekt in de 3D BAG.
  - **West (235°)**: de vleugel met kern en vensters, de onderbouw, de glazen opbouw met stijlen en de giek.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk. Alleen de zuiderker steekt er 1,84 m voorbij, boven de hal.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.34404/4.91752/350/1x1/0)): de toren ligt op de PDOK-reconstructie van het pand naast de Rembrandttoren, met het raster van de erkers en de kroon zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0363100012097541`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012097541), CC BY 4.0 (AHN-opname 2023). Dakhoogtes 11,3 / 92,3 / 94,8 / 106,5 / 117,35 / 120,6 / 121,9 / 122,95 m en de omtrek van elk dakvlak, regelmatig herbouwd.
- [Wikipedia: Mondriaantoren](https://nl.wikipedia.org/wiki/Mondriaantoren): 120 m, 31 lagen, ZZ+P/Peter Ellis, voltooid 2001–2002.
- Commons, alleen als visuele referentie:
  - [Mondriaantoren](https://commons.wikimedia.org/wiki/File:Mondriaantoren.jpg) (zuidoost, glazen erker en kroon)
  - [Mondriaantoren2](https://commons.wikimedia.org/wiki/File:Mondriaantoren2.jpg)
  - [Mondriaantoren in 2019 (1)](https://commons.wikimedia.org/wiki/File:Mondriaantoren_in_2019_(1).jpg) en [(2)](https://commons.wikimedia.org/wiki/File:Mondriaantoren_in_2019_(2).jpg) (plein, raster)
  - [Mondriaan Tower – panoramio](https://commons.wikimedia.org/wiki/File:Mondriaan_Tower_-_panoramio.jpg)
  - [Amsterdam omval rembrandt breitner mondriaan toren](https://commons.wikimedia.org/wiki/File:Amsterdam_omval_rembrandt_breitner_mondriaan_toren.jpg) (zuidzijde, kroon en giek)
  - [Amstelplein](https://commons.wikimedia.org/wiki/File:Amstelplein.jpg)
  - [Breitnertoren in 2019 (4)](https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(4).jpg) (open stalen kroon van de buurman)
