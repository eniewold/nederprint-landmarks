# Terraced Tower (Rotterdam)

Vereenvoudigd, printbaar model van de Terraced Tower aan de Boompjes (woontoren, 2021): een sokkel van tien lagen langs de hele kavel, daarop een brede middentoren en een smallere bovenste schijf, zodat de toren aan beide koppen naar boven toe terugtrapt. Elke verdieping heeft een blinde glasband achter de doorlopende vloerrand; op de trappen staan de terrasopbouwen en op het dak de installatieruimte.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `terraced-tower.glb` | Model in meters, Y omhoog, één node `building:terraced-tower` |
| `terraced-tower.json` | Catalogusitem |
| `terraced-tower-1-1000.stl` | Los te printen op 1:1000 (82 × 28 × 108 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93213.95, 436782.39]`, het hart van de BAG-contour. De lokale X-as loopt langs de lange gevel, 47,0° linksom op RD-oost (naar het noordoosten); +Y wijst naar de Scheepmakershaven, −Y naar de Boompjes en de Maas. Lokaal z = 0 is NAP +2,5 m, het maaiveld aan de lage achterstraat. De Boompjes ligt circa 3 m hoger op de dijk; daar loopt de gevel door tot onder het maaiveld. `groundSamplePoints` liggen daarom aan de achterstraat, `groundHeight` is 45,677 m (ellipsoïdisch, PDOK-terrein op die punten) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Plattegrond (u × v) | Dak (NAP) | Bron |
| --- | --- | --- | --- |
| Sokkel west en oost | 14,0 × 17,0 m en 18,2 × 17,0 m | +34,15 m | BAG-contour, 3D BAG |
| Middentoren | 50,0 × 25,4 m, met terrasranden tot 1,6 m over de sokkel | +76,05 m | BAG, 3D BAG |
| Bovenste schijf | 34,3 × 25,4 m, middendeel 32,0 × 28,4 m | +106,05 m | BAG, 3D BAG |
| Dakinstallatie | 19,1 × 12,1 m | +109,25 m | 3D BAG |
| Terrasopbouwen | zeven blokken op de trappen, 0,45–1,15 m hoog | +35,25 tot +77,2 m | 3D BAG |

Alle hoogtes komen uit de 3D BAG (LoD2.2, puntenwolk AHN5 uit 2023). Het AHN in de PDOK-WCS is ouder en toont de toren nog in aanbouw; dat is niet gebruikt.

## Geschat en weggelaten

- Verdiepingsritme: elk trapdeel is in gelijke lagen verdeeld (sokkel 10, middentoren 13, bovenste schijf 9, circa 3,2 m). Per laag een glasband van 0,4 m diep tussen vloerranden van 0,9 m, met een plafond onder 45°; hoeken blijven als penant van 0,95 m staan. De werkelijke balkonplaten zijn dunner en kragen per verdieping verschillend uit; dat verspringende patroon is kleiner dan 0,9 m en vereenvoudigd tot de doorlopende band.
- Balkonuitkragingen boven de sokkel tot 1,9 m zijn alleen boven de sokkel meegenomen (terrasrand), niet als vrije uitkraging boven straat.
- Glazen balustrades, plantenbakranden en zonnepanelen (< 0,9 m) zijn weggelaten.

## Controle

`node scripts/generate-terraced-tower.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes per trapdeel, dat een glasband na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,1 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0599100100016464` (bouwjaar 2021); actuele orthoHR.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100016464): dakhoogtes en trapdelen.
- [Wikipedia: Terraced Tower](https://nl.wikipedia.org/wiki/Terraced_Tower).
- Foto's op Wikimedia Commons (niet meegeleverd): [vanaf de Maas, 2026](https://commons.wikimedia.org/wiki/File:Terraced_Tower_Rotterdam_2026.jpg), [vanaf de Maas](https://commons.wikimedia.org/wiki/File:Terraced_Tower.jpg), [zijaanzicht](https://commons.wikimedia.org/wiki/File:Terraced_Tower_Zij-aanzicht.jpg), [Scheepmakershaven](https://commons.wikimedia.org/wiki/File:2025_Scheepmakershaven,_Rotterdam_gezien_vanaf_de_Punt_met_achterzijden_van_hoogbouw_aan_De_Boompjes.jpg).
