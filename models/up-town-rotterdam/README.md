# Up:Town (Rotterdam)

Vereenvoudigd, printbaar model van Up:Town op het Wijnhaveneiland (woontoren, hoogste punt november 2018, opgeleverd 2019): een toren van 34 verdiepingen met rondom doorlopende balkonbanden, op een plint van vijf lagen met een verdiepte daktuin.

Let op: de backlog noemde de Laan op Zuid bij de Rijnhaven en 2013. Wikipedia en de BAG plaatsen Up:Town op het Wijnhaveneiland (bouwjaar 2019); het model volgt de BAG.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `up-town-rotterdam.glb` | Model in meters, Y omhoog, één node `building:up-town-toren-en-plint` |
| `up-town-rotterdam.json` | Catalogusitem |
| `up-town-rotterdam-1-1000.stl` | Los te printen op 1:1000 (26 × 80 × 107 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93035.85, 436814.01]`, het hart van de twee BAG-panden. De lokale X-as staat 18,1° linksom op RD-oost; +Y wijst naar het noordnoordwesten, de toren staat aan de +Y-kant, de plint loopt naar −Y. Lokaal z = 0 is NAP +2,6 m. `groundSamplePoints` liggen op de straten rondom, `groundHeight` is 46,105 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Plattegrond (u × v) | Hoogte (NAP) |
| --- | --- | --- |
| Toren | 25,8 × 21,0 m | +106,27 m |
| Liftopbouw | 3,8 × 5,2 m | +108,5 m |
| Balkonzone zuidkant boven de plint | 22,4 × 1,9 m | +102,7 m |
| Plint (5 lagen) | 23,0 × 59,4 m | +17,8 m |
| Verdiepte daktuin in de plint | 7,3 × 48,2 m | +14,63 m |
| Lage vleugel westkant | 2,0 × 9,2 m | +13,9 m |
| Installatie op de plint | 3,9 × 3,0 m | +19,05 m |

Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023), 34 verdiepingen uit Wikipedia (circa 3,05 m per laag: 5 in de plint, 29 erboven).

## Geschat en weggelaten

- De balkons kragen in werkelijkheid per verdieping verschillend uit (golvende randen); dat patroon is kleiner dan 0,9 m en vereenvoudigd tot een doorlopende band per verdieping: een blinde nis van 0,4 m diep tussen vloerranden van 0,9 m, plafond onder 45°, hoekpenanten van 0,95 m.
- De glaspuien van de plint zijn traveeën van circa 4,2 m met penanten van 1,0 m; de begane grond blijft dicht.
- De kleuraccenten van de gevel (groen, geel, wit), balustrades en de witte dakrand (< 0,9 m) zijn niet gemodelleerd.

## Controle

`node scripts/generate-up-town-rotterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes, dat een balkonband na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,1 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, panden `0599100100015923` (toren) en `0599100100015922` (plint), bouwjaar 2019; actuele orthoHR.
- 3D BAG: [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015923), [plint](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015922).
- [Wikipedia: Up:Town](https://nl.wikipedia.org/wiki/Up:Town).
- Foto's op Wikimedia Commons (niet meegeleverd): [Up;Town in Rotterdam](https://commons.wikimedia.org/wiki/File:Up;Town_in_Rotterdam.jpg), [Rotterdam UpTown](https://commons.wikimedia.org/wiki/File:Rotterdam_UpTown.jpg).
