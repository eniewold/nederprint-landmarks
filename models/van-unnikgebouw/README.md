# Willem C. van Unnikgebouw (Utrecht)

Vereenvoudigd, printbaar model van het Van Unnikgebouw (voorheen Transitorium II, 1967–1969, Lucas & Niemeijer) in het Utrecht Science Park: een kantoorschijf met doorlopende horizontale vensterbanden onder de vloerranden, een teruggelegen installatieverdieping met twee liftkoppen, en de laagbouw van hetzelfde BAG-pand: de verbindingsvleugel van drie lagen, het dek met de open patio en de lage vleugels aan de westkant.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `van-unnikgebouw.glb` | Model in meters, Y omhoog, één node `building:van-unnikgebouw-schijf-en-laagbouw` |
| `van-unnikgebouw.json` | Catalogusitem |
| `van-unnikgebouw-1-1000.stl` | Los te printen op 1:1000 (114 × 65 × 84 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[140277.04, 455239.79]`, het hart van het BAG-pand. De gevels staan op RD: lokale X is RD-oost, Y RD-noord. Lokaal z = 0 is NAP +2,0 m. `groundSamplePoints` liggen op de paden rondom, `groundHeight` is 45,856 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Plattegrond | Hoogte (NAP) |
| --- | --- | --- |
| Schijf (begane grond + 21 lagen) | 53,8 × 22,9 m | +79,1 m |
| Dakrand | 1,0 m rondom | +80,1 m |
| Installatieverdieping | 35,0 × 11,8 m | +83,36 m |
| Twee liftkoppen | 4,2 × 5,1 m en 5,2 × 4,8 m | +84,85 m |
| Verbindingsvleugel (3 lagen) | 14,5 × 65,4 m | +10,77 m |
| Dek met open patio (36,8 × 20,9 m) | 50 × 65 m | +3,85 m |
| Lage vleugels west en noord, aanbouw westkop | — | +6,0 m |

Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023), inclusief het gat van de patio in het dekvlak.

Het lage aanbouwpand tegen de westkop (`0344100000074170`, 2002) staat in de 3D BAG en het AHN op +6,0 m, maar PDOK reconstrueert er een dunne wand tot +75 m van naast de schijf. Het staat daarom ook in `replacesBuildings` en is als laag blok op de BAG-contour gemodelleerd.

## Geschat en weggelaten

- Verdiepingen: een begane grond van 4,5 m en 21 gelijke lagen (circa 3,46 m), geteld op foto's. Per laag een blinde vensterband van 0,45 m diep achter een vloerrand van 0,9 m, plafond onder 45°, hoekpenanten van 0,95 m. De zonweringslamellen en kozijnen zijn kleiner dan 0,9 m.
- De belettering "Universiteit Utrecht" op de dakrand, antennes en kleine dakapparatuur zijn weggelaten.

## Controle

`node scripts/generate-van-unnikgebouw.mjs` geeft `NoError`, genus 1 (de patio) en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van alle delen, de open patio, dat een vensterband na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,1 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, panden `0344100000027739` (1970) en `0344100000074170` (2002); actuele orthoHR.
- 3D BAG: [hoofdpand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000027739), [aanbouw](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000074170).
- [Wikipedia: Willem C. van Unnikgebouw](https://nl.wikipedia.org/wiki/Willem_C._van_Unnikgebouw).
- Foto's op Wikimedia Commons (niet meegeleverd): [2011](https://commons.wikimedia.org/wiki/File:Willem_C._van_Unnikgebouw_in_2011.jpg), [Utrecht](https://commons.wikimedia.org/wiki/File:Willem_C_van_Unnikgebouw_Utrecht.jpg), [2009](https://commons.wikimedia.org/wiki/File:WC_van_Unnikgebouw_2009.jpg), [Uithof](https://commons.wikimedia.org/wiki/File:UithofVanUnnik.jpg).
