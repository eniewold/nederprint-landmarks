# Rembrandttoren (Amsterdam)

Kantoortoren aan het Amstelplein (ZZDP Architecten met SOM, 1995), 150 m met mast. Benoemde prisma's en omwentelingsvormen in een eigen gebouwstelsel; geen gestapelde DSM-lagen. Voorbeeld per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-haagse-toren.mjs`. Reproductie: `node scripts/generate-rembrandttoren.mjs`.

## Bestanden en plaatsing

- `rembrandttoren.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 43.070 driehoeken).
- `rembrandttoren.json`: RD-oorsprong `[122963.34, 484231.45]` in het hart van de schacht, `xAxis` 20,1° (BAG-gevels 20,10°/110,10°, AHN-contour symmetrisch), +Y naar het noordnoordwesten; de zuidgevel (−Y) is de entreezijde aan het plein.
- `rembrandttoren-1-1000.stl`: millimeters, Z omhoog, 48,1 × 48,1 × 151,1 mm, vlakke voet.

z = 0 ligt op NAP −0,5 m: de straat aan de noord- en oostzijde (AHN-DTM −0,5 tot −0,6). De voet loopt door tot −1,2 m (NAP −1,7). Het plein aan de zuidzijde ligt op NAP +2,8 en de westkant op +1,9; daar bedekt het PDOK-terrein de voet. `groundOffsetMetres` 0, `groundSamplePoints` op de straat: `[27,−8] [27,8] [12,29] [20,29]`.

Vervangt alleen BAG `0363100012113758`. Dat pand omvat de hele kruisvormige plint en de dekhoeken aan de noordzijde. Het dichtstbijzijnde andere pand ligt 17 m verder. De Mondriaan- en Breitnertoren zijn aparte modellen.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

- **Dek** in de twee noordhoeken op +2,8: de hoogte van het plein, 3,3 m boven de straat.
- **Plint**: vier vleugels tot +21,5, samen een kruis van 48 m met armen van 25,6 m breed, met de koppen op de BAG-gevels. Elke gevel heeft 14 vensters op 1,8 m en vier lagen. Op het plein staat de entree als begane-grondnissen tussen stenen penanten.
- **Ring van uitbouwen** tot +36,4, ±19,3 m. De hoeken springen in volgens de BAG-zigzag (14,6 m). Midden in elke gevel zit een sleuf van 5,4 m tot op de plint, waar de schachtgevel doorloopt (AHN). De ring heeft drie vensterlagen en een bovenlaag met loggia's als blinde nissen van 0,4 m.
- **Schacht** van 33,2 m in het vierkant tot +106,3. Elke hoek springt twee keer 2 m terug (AHN-contour per 0,25 m: ±16,6 / ±14,6 / ±12,6). De hoofdgevels hebben 14 × 21 vensternissen (1,0 × 1,9 m, 0,35 m diep, laaghoogte 3,33 m). De verspringende hoeken hebben per laag glasstroken.
- **Colonnade** tot +109,5: een rand van 1 m langs de hele contour met blinde loggia's van 2,7 m tussen posten op 3,6 m. Schotten van 0,9 m (de pergolabalken) lopen naar de paviljoens en het middenkruis. Daartussen liggen open putten tot op het terras, zoals op de luchtfoto.
- **Vier glazen hoekpaviljoens** (3,4–14,6 m uit het hart) tot +119,9, met glasvakken per laag en elk een davit (radiale arm met dwarsstuk, +121,5).
- **Middenkruis** tot +131,7: armen van 11,6 m breed tot 10,6 m uit het hart, met vensterrijen (bovenste rij hoger).
- **Gevelonderhoudsinstallatie**: een ronde rail (Ø 11,7 m, 0,9 m breed, +133,2) en een giek van 1,2 m breed langs de oost-westarm tot +135,8.
- **Mast**: een witte voet van Ø 3,8 m met twee ringgroeven tot +140,3, een kegel naar het middenstuk van Ø 2,2 m tot +143,6, en een naald van Ø 1,2 m tot +149,4 (AHN-top 149, Wikipedia 150 m boven straat). De naald is dik genoeg voor 1:1000 en is niet verdikt.

## Geschat en weggelaten

Geschat uit foto's:

- Het vensterritme: 1,8 m en 21 kantoorlagen tussen ring en colonnade, geteld op een frontale foto van de zuidgevel. Alle lagen zijn even hoog gemaakt.
- De laagindeling van plint, ring en middenkruis.
- De mastdiameters en de hoogtes van de geledingen, met de AHN-top als maat.
- De davits en de breedte van de giek, uit de ortho.

Weggelaten:

- **Glazen entreeluifel** aan de zuidzijde: circa 19 × 16 m op slanke kolommen, op NAP +8,5–9,5. Hij valt buiten het BAG-pand en het AHN ziet hem nauwelijks. Een vrijdragende glasplaat zou de export tot een dichte doos opvullen. De entree zelf staat erin als nissen.
- **Leuningen** in de loggia's: kleiner dan 0,9 m.
- **Pergolabalken als vrije overspanning**: ze staan erin als volle schotten tot het terras.
- **Borstweringen** op de daken (circa 0,5 m) en de wagen van de installatie bij de mast (onzeker, < 2 m).

De giek kan in werkelijkheid om de mast draaien. Hij is gemodelleerd in de stand op de luchtfoto, het AHN en de foto's van 2007 tot 2021.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 151.558 m³ (3D BAG LoD2.2: 153.735 m³). Ondervlakken zijn alleen de bovenkanten van de nissen.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts` gaf 353 geslaagd. De eigen test controleert de catalogus, het vervangen pand, de voet, de top, de plint, de ring, het terras, de colonnade, de paviljoens, het middenkruis, de verspringende hoeken, de ringsleuf, 21 vensterrijen, de naald, de rail en de giek.
- **Printcheck** op 1:1000 bij 45°: 0,09 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[122913,484181,123013,484281]`, 100 × 100 mm. Duur 9,5 s, 77 objecten, 122.768 driehoeken, modelhoogte 151,2 mm. Het model staat op het terrein en het plein bedekt de voet aan de zuidzijde.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf. De 3D BAG heeft de juiste massa's, maar de wanden zijn vlak, de kroon is ruw gefacetteerd en de mast ontbreekt. Het model heeft daarbovenop per kant:
  - het vensterraster van schacht, ring en plint;
  - de glasstroken in de verspringende hoeken;
  - de sleuven in de ring;
  - de colonnade met putten;
  - glasvakken en davits op de paviljoens;
  - het middenkruis met vensters;
  - rail, giek en mast.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.34508/4.91701/350/1x1/0)): positie en oriëntatie vallen samen met de PDOK-reconstructie, het vensterraster, de colonnade, de paviljoens en de mast zijn zichtbaar, en de voet staat aan de straat en op het plein op het maaiveld. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0363100012113758`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012113758), CC BY 4.0: dakhoogtes 2,8 / 21,5 / 36,4 / 106,3 / 109,5 / 119,9 / 131,7 m, regelmatig herbouwd.
- [Wikipedia: Rembrandttoren](https://nl.wikipedia.org/wiki/Rembrandttoren): hoogte 150 m met antenne van 15 m, 35 lagen, architecten, entree aan de zuidgevel.
- Commons, alleen als visuele referentie:
  - [Rembrandt toren vanuit het noordwesten](https://commons.wikimedia.org/wiki/File:Rembrandt_toren_vanuit_het_noordwesten.jpg)
  - [Rembrandttoren in 2021](https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2021.jpg)
  - [Rembrandttoren in 2019 (1)](https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2019_(1).jpg)
  - [Rembrandt Toren in 2016](https://commons.wikimedia.org/wiki/File:Rembrandt_Toren_in_2016.jpg)
  - [Rembrandttoren2](https://commons.wikimedia.org/wiki/File:Rembrandttoren2.jpg)
  - [Rembrandttoren3](https://commons.wikimedia.org/wiki/File:Rembrandttoren3.jpg)
  - [Rembrandttoren in 2019 (2)](https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2019_(2).jpg) (luifel)
