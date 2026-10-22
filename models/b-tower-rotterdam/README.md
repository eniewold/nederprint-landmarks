# B'Tower (Rotterdam)

Vereenvoudigd, printbaar model van de B'Tower aan de Hennekijnstraat achter de Lijnbaan (2012, Wiel Arets): een woontoren van 15 lagen op een sokkel van vier lagen met een winkel en een parkeergarage, naast De Bijenkorf. De toren heeft een gevel van horizontale witte vloerranden met glas ertussen; aan de noordkant steekt een kern uit. De sokkel is bij de toren en langs de oostrand lager dan aan de achterkant.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `b-tower-rotterdam.glb` | Model in meters, Y omhoog, één node `building:b-tower-rotterdam` |
| `b-tower-rotterdam.json` | Catalogusitem |
| `b-tower-rotterdam-1-1000.stl` | Los te printen op 1:1000 (24 × 58 × 70 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[92450.09, 437250.8]`, het hart van de BAG-contour. De lokale X-as loopt langs de korte zuidgevel naar het oostnoordoosten, 17,4° linksom op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y loopt langs de lange gevels naar het noordnoordwesten. Lokaal z = 0 is NAP −0,8 m, het maaiveld rondom; `groundHeight` is 42,5 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 18,7 × 30,8 m op het zuidelijke deel van de sokkel | +68,5 m | AHN-DSM (68–69), PDOK |
| Kern aan de noordkant | 5,0 × 2,2 m | +54,0 m | AHN-DSM (50–54) |
| Sokkel, voorkant en oostrand | BAG-contour, 24,3 × 58 m | +22,0 m | BAG, AHN-DSM |
| Sokkel, achterkant | 18,4 × 11,2 m | +25,0 m | AHN-DSM |

Gevelreliëf: elke woonlaag (3,1 m) heeft een glasband van 0,4 m diep achter een doorlopende witte vloerrand van 0,9 m, met een plafond onder 45°; de sokkel heeft per laag (winkel 5,0 en 4,6 m, parkeren 6,6 m) een band achter een rand van 1,2 m.

## Geschat en weggelaten

- Verdiepingshoogtes en de diepte van de banden zijn geschat; de balkons en verspringende vloerranden op de hoeken zijn vereenvoudigd tot doorlopende banden.
- De kern aan de noordkant komt uit het DSM (50–54 m); de werkelijke vorm is niet op foto's te zien.
- Weggelaten: de reclame en de luifels van de winkel aan de Lijnbaan (kleiner dan 0,9 m).

## Controle

`node scripts/generate-b-tower-rotterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de hoogtes van toren, kern en sokkel, dat de glasbanden na de printcorrectie op 45° achter de vloerranden blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0599100000766719` (bouwjaar 2012); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Wikipedia: B'Tower](https://nl.wikipedia.org/wiki/B%27Tower).
- Foto's op Wikimedia Commons (niet meegeleverd): [toren naast De Bijenkorf](https://commons.wikimedia.org/wiki/File:B%E2%80%99Tower_Rotterdam.jpg), [Aert van Nesstraat](https://commons.wikimedia.org/wiki/File:2024_Aert_van_Nesstraat,_Rotterdam_met_zondagmiddag_drukte.jpg).
