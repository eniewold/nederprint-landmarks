# Laakhaventoren (Den Haag)

Vereenvoudigd, printbaar model van de Laakhaventoren aan het Stamkartplein in de Laakhavens, bij station Hollands Spoor (2001–2003, atelier PRO): een ronde woontoren van 21 lagen in rode baksteen met studentenwoningen. De gevel heeft per laag vensters in een dambordpatroon (hoge vensters met een Frans balkon en lage vensters om en om), op het zuiden een stapel van twee loggia's naast elkaar en een bovenste laag met brede openingen met liggende leuningen; achter die openingen ligt in het zuidwesten een dakterras één laag lager. Tegen de oostkant staat de laagbouw van hetzelfde complex, die in het model als eenvoudig blok is meegenomen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `laakhaventoren.glb` | Model in meters, Y omhoog, twee nodes: `building:laakhaventoren-toren` en `building:laakhaventoren-laagbouw` |
| `laakhaventoren.json` | Catalogusitem |
| `laakhaventoren-1-1000.stl` | Los te printen op 1:1000 (66 × 48 × 64 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82021.65, 453602.25]`, het middelpunt van de cilinder (cirkelfit op de 31 boogpunten van de BAG-contour, restfout onder 0,04 m); de lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden). Lokaal z = 0 is NAP +1,82 m, het maaiveld aan de voet; `groundHeight` is 45,25 m (NAP-maaiveld plus de plaatselijke geoïde van 43,44 m, in lijn met het Beatrixlaan-model) en `groundOffsetMetres` −0,15. Omdat de laagbouw tot de kade van de Laakhaven reikt, staan er `groundSamplePoints` op vier punten aan de voet van de toren.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0518100000325303`) | cilinder, doorsnede 25,4 m | +63,43 m (61,6 m boven maaiveld) | BAG-cirkelfit; 3D BAG-dakvlak 63,42–63,47 (70e percentiel 63,45), AHN-DSM 63,38 |
| Dakterras | zuidwestdeel van het dak, binnen een ring van 1,25 m | +60,75 m | 3D BAG-dakvlak 60,73–60,78, foto (doorlopende ring met openingen) |
| Installatieopbouw | vijfhoek van circa 6,2 × 3,5 m | +65,17 m | 3D BAG-dakvlak 65,15–65,20, DSM |
| Dakluiken | negen van 1 × 1 m | dak + 0,5 m | ortho (plaats), hoogte geschat |
| Laagbouw (pand `0518100000242823`) | BAG-rechthoek 19,0 × 50,9 m, minus de cilinder | +17,5 m | BAG, DSM 17,4–17,5, 3D BAG 17,54 |
| Lichtstraat op de laagbouw | 2,0 m breed, circa 37 m lang | +17,95 m | ortho, DSM 17,9 |
| Verhoogde rand laagbouw (noordwest) | 0,9 m breed | +18,2 m | DSM 18,1–18,2 |

Verdiepingen (21 lagen volgens Wikipedia): begane grond 4,4 m, 19 woonlagen van 2,857 m en een bovenste laag van 2,9 m tot het dak. Gevelreliëf op 27 traveeën van 2,96 m langs de gevel:

- woonlagen: vensters van 1,8 m breed als blinde nissen van 0,35 m met een plafond onder 45°, om en om hoog (1,94 m, Frans balkon) en laag (1,15 m), verspringend per laag;
- loggiastapel op het zuiden: twee traveeën met per laag een nis van 2,0 m breed en 1,0 m diep, borstwering 0,95 m;
- twee entreetraveeën op het zuidwesten: nis van 1,8 m over de begane grond en de eerste laag;
- bovenste laag: veertien openingen van 4,6 × 1,4 m met penanten van 1,1 m en een latei van 0,9 m, ook voor het dakterras;
- glazen deuren van de bovenste laag naar het dakterras als nissen van 1,5 m;
- begane grond elders: vensters van 1,8 × 2,7 m als nis.

In de inham van de laagbouw (boog van −50° tot +19°) loopt de cilinder door tot het maaiveld, verborgen in de laagbouw; daar staan pas vensters boven het dak van de laagbouw.

## Geschat en weggelaten

- Er is maar één bruikbare foto (vanuit het zuidwesten); het vensterraster is op de noord- en oostgevel doorgetrokken. Of daar ook loggia's zitten, is niet te zien.
- Verdiepingshoogtes, de begane grond buiten de entree, de vensterhoogtes en de plaats van de traveeën zijn geschat uit de foto.
- De ring om het dakterras is in werkelijkheid circa 0,3 m dik met open gaten; in het model 1,25 m met blinde nissen, zodat hij op 1:1000 printbaar is. In het AHN is de ring niet te zien (te dun).
- Hoogte en maat van de dakluiken zijn geschat; hun plaats komt uit de ortho.
- Laagbouw: alleen massa, lichtstraat en noordwestrand; de gevels (beige pleisterwerk, glazen trappenhuis tegen de toren, kolommen op de begane grond) zijn niet gedetailleerd. Hij staat in het model omdat de PDOK-reconstructie van dit pand in de inham tot NAP +63,5 m doorloopt en tot 0,65 m buiten de cilinder steekt.
- Weggelaten: de liggende leuningen in de openingen, de Franse balkons en de grijze balkonplaten voor enkele vensters, de dakrand (0,25 m hoog), de ontluchtingen op het dak en de zonnepanelen op de laagbouw (alle kleiner dan 0,9 m), en de diagonale lijnen in het metselwerk (vlak).

## Controle

`node scripts/generate-laakhaventoren.mjs` geeft per node `NoError`, genus 0 en één gesloten deel; de STL is genus 0. In de webshop controleert een test de daken van toren, terras, opbouw en laagbouw, de doorsnede van de cilinder, dat een loggia en een vensternis hun diepte houden na de printcorrectie op 45°, dat het volume daarbij minder dan 1 % groeit, en de plaatsing op het maaiveld. Vier schuine aanzichten en het standpunt van de foto zijn naast de 3D BAG LoD2.2 gelegd.

## Bronnen

- PDOK BAG, panden `0518100000325303` (toren, bouwjaar 2002) en `0518100000242823` (laagbouw); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG (AHN5, 2023), dakvlakken LoD2.2 van beide panden.
- [Laakhaventoren](https://nl.wikipedia.org/wiki/Laakhaventoren) op Wikipedia (63 m, 25 m doorsnede, 21 lagen, atelier PRO).
- Foto op Wikimedia Commons (niet meegeleverd): [Laakhaventoren.jpg](https://commons.wikimedia.org/wiki/File:Laakhaventoren.jpg).
