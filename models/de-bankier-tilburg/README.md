# De Bankier (Tilburg)

Vereenvoudigd, printbaar model van woontoren De Bankier op de hoek van de Spoorlaan en de Magazijnstraat in de Spoorzone van Tilburg (Diederendirrix, opgeleverd 2023). De toren heeft 23 lagen en zandkleurige gevels: de onderste dertien woonlagen met horizontale vloerbanden, aan de Spoorlaan een doorlopende balkonzone en op de zuidhoeken balkonstapels; de bovenste negen lagen met vensters tussen penanten. In het dak liggen op de zuidhoeken twee verdiepte dakterrassen met een kader eromheen, langs de noordgevel staat een hogere attiek. De naam verwijst naar het bankgebouw van Van Mierlo en Zoon (Kraaijvanger, 1954) op de kavel ernaast; dat gebouw is een eigen BAG-pand en zit niet in het model.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `de-bankier-tilburg.glb` | Model in meters, Y omhoog, twee nodes: `building:de-bankier-tilburg-toren` (toren met balkons en de aanbouw zuidoost) en `building:de-bankier-tilburg-onderbouw` (lage onderbouw en strook aan de westkant) |
| `de-bankier-tilburg.json` | Catalogusitem |
| `de-bankier-tilburg-1-1000.stl` | Los te printen op 1:1000 (45 × 39 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[134300.0, 396763.0]`, midden in de toren. De X-as loopt langs de zuidgevel naar het oosten, −8,2° op RD-oost (de BAG-randen zijn evenwijdig binnen 0,4°); Y loopt langs de oost- en westgevel naar de Spoorlaan. Lokaal z = 0 is NAP +14,45 m (AHN-DTM rondom, 3D BAG-maaiveld 14,33–14,65); `groundHeight` is 58,25 m (ellipsoïdisch, NAP + circa 43,8 m) en `groundOffsetMetres` −0,15.

De toren staat op drie BAG-panden, die alle drie in `replacesBuildings` staan: `0855100000715598` (noordelijk deel van de toren en de strook tegen het bankgebouw), `0855100000715596` (zuidelijk deel van de toren en de lage onderbouw aan de westkant) en `0855100000715597` (zuidoosthoek met de aanbouw). Zonder de laatste twee zou de PDOK-reconstructie van de zuidelijke 7,5 m van de toren tegen het model aan blijven staan.

## Onderdelen en maten

Het PDOK-AHN (AHN4) is van vóór de oplevering (DSM-mediaan binnen de contour NAP +28,6 m, bouwfase); alle hoogtes komen daarom uit de dakvlakken van de 3D BAG, die op AHN5 (2024) is gereconstrueerd.

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 22,5 × 32,0 m | +87,85 m | BAG (oost- en noordgevel), 3D BAG (westgevel, dakvlak 87,71–87,93) |
| Dakrand en kader rond de terrassen | 0,9 m breed | +88,8 m | 3D BAG (88,64–88,94), ortho |
| Attiek langs de noordgevel | 0,9 m breed | +90,04 m | 3D BAG (strook 90,03–90,05) |
| Dakterrassen zuidwest en zuidoost | 7,0 × 2,45 en 6,9 × 2,45 m | vloer +84,2 m | 3D BAG (84,17–84,24), ortho |
| Balkonzone noord (Spoorlaan) | hele breedte, 1,5 m uitstekend, drie balkons per laag | +19,65 tot +60,15 m | foto's; bovenkant gelijk aan de stapel zuidoost |
| Balkonstapel zuidoost | 8,4 m breed, 2,15 m uitstekend | tot +60,15 m | 3D BAG (vlak 60,11–60,22 van 2,1 m diep), foto |
| Balkonstapel zuidwest | 7,7 m breed, 2,15 m uitstekend | +19,65 tot +60,15 m | foto (balkons op de zuidwesthoek), gespiegeld van zuidoost |
| Vloerbanden onderste zone (oost, west, zuid midden) | 0,4 m uitstekend, 0,6 m hoog | tot +60,15 m | foto's |
| Aanbouw zuidoost | 5,0 × 3,6 m en 3,2 × 3,0 m | +27,15 en +17,82 m | BAG, 3D BAG (27,04–27,31 en 17,74–17,94) |
| Onderbouw west | BAG-contour, circa 22 × 17,5 m | +30,87 m, zuidwestdeel +28,2 m, installatiezone +31,71 m | BAG, 3D BAG |
| Strook tegen het bankgebouw | 1,25 × 24,7 m | +30,3 m | BAG, 3D BAG (30,02–30,60) |

Gevelreliëf: begane grond 5,2 m, daarboven 22 lagen van 3,1 m (samen 73,4 m, gelijk aan het gemeten dak). Vensters op een travee van 2,7 m (elf op de lange, acht op de korte gevels) als blinde nissen van 0,35 m met een plafond onder 45°: in de bovenste zone 1,4 m breed en 1,95 m hoog tussen penanten van 1,3 m, in de onderste zone tussen de vloerbanden, op de begane grond 2,0 m breed. De vloerbanden zijn een mantel van 0,4 m met per laag een groef tot op de gevel, zodat een band van 0,6 m met een schuine onderkant (45°) blijft staan. De balkons zijn per laag een open balkon van 0,9 m diep achter een borstwering van 1,0 m; onder de balkonzones loopt een kraag onder 45° naar de gevel. Entree aan de Magazijnstraat als portiek van 3,0 × 1,2 m. De onderbouw heeft aan het parkeerterrein vier lagen vensters.

## Geschat en weggelaten

- De bovenkant van de onderste zone en van de balkons (+60,15 m) is gemeten aan de stapel zuidoost; dat de noordelijke balkonzone even hoog is en 1,5 m uitsteekt, komt uit foto's. Die zone valt buiten de BAG-contour en daarom niet in de 3D BAG.
- De balkonstapel zuidwest staat op foto's van opzij, niet van voren; breedte en uitsteek zijn gespiegeld van zuidoost. Van de zuidgevel is geen foto gevonden.
- Verdiepingshoogtes, vensterraster, uitsteek van de vloerbanden en de plaats en maat van de entree zijn geschat.
- De westgevel van de toren ligt 1,2 m binnen de BAG-contour, op de dakrand uit de 3D BAG; de BAG-strook ertussen is als lage strook op +30,3 m gemodelleerd.
- Weggelaten: de glazen balkonhekken (als dichte borstwering), de zonnepanelen, ventilatiekasten en de gevelonderhoudsinstallatie op het dak, een kleine opbouw midden op het dak (0,6 m hoog), de omlijsting boven de entree (circa 0,6 m) en de inrit van de parkeergarage in de aanbouw (alle kleiner dan 0,9 m), en de geribde gevelpanelen.

## Controle

`node scripts/generate-de-bankier-tilburg.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de dakhoogtes, de terrassen, de aanbouw en de onderbouw, dat de balkons in de noordzone, de vensternissen en de vloerbanden na de printcorrectie op 45° blijven staan (het volume van de toren groeit daarbij minder dan 0,001 %, de grens in de test is 1 %), één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0855100000715598`, `0855100000715596` en `0855100000715597` (bouwjaar 2023); actuele orthoHR; AHN-DTM 0,5 m.
- 3D BAG LoD2.2 op AHN5 (2024), bijvoorbeeld <https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000715598>.
- [De Bankier (gebouw)](https://nl.wikipedia.org/wiki/De_Bankier_(gebouw)) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [Woontoren De Bankier](https://commons.wikimedia.org/wiki/File:Woontoren_De_Bankier.jpg), [De Bankier Tilburg2](https://commons.wikimedia.org/wiki/File:De_Bankier_Tilburg2.jpg), [De Bankier](https://commons.wikimedia.org/wiki/File:De_Bankier.jpg), [Magazijnstraat](https://commons.wikimedia.org/wiki/File:Magazijnstraat.jpg).
