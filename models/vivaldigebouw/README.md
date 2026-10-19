# Vivaldigebouw (Amsterdam)

Vereenvoudigd, printbaar model van het Vivaldigebouw aan de Domenico Scarlattilaan 6 op de Zuidas (2019), het hoofdkantoor van het Europees Geneesmiddelenbureau (EMA): een kantoorblok met glasvakken tussen bronskleurige verticale vinnen, dakrand en installatieopbouw, op een onderbouw die het blok aan de west-, noord- en zuidkant omsluit en aan de noordkant schuin afloopt.

Let op: de controle-URL in de backlog lag circa 260 m westelijker, bij een ander gebouw. De nieuwe controle-URL wijst naar het pand op de Domenico Scarlattilaan.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `vivaldigebouw.glb` | Model in meters, Y omhoog, één node `building:vivaldigebouw-blok-en-onderbouw` |
| `vivaldigebouw.json` | Catalogusitem |
| `vivaldigebouw-1-1000.stl` | Los te printen op 1:1000 (52 × 80 × 83 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[120827.59, 483407.62]`, het hart van het BAG-pand. De gevels staan bijna op RD: lokale X wijst 0,5° rechtsom van RD-oost, Y naar het noorden. Lokaal z = 0 is NAP −0,7 m. `groundSamplePoints` liggen op de verharding rondom, `groundHeight` is 42,358 m (ellipsoïdisch), `groundOffsetMetres` −0,15. Aan de oostkant ligt het terrein (bouwterrein) circa 1 m hoger; daar staat de voet dieper in het maaiveld.

## Onderdelen en maten

| Onderdeel | Plattegrond | Hoogte (NAP) |
| --- | --- | --- |
| Kantoorblok (4 + 16 lagen) | 37,4 × 51,7 m | +76,13 m |
| Dakrand | 1,6 m rondom | +77,9 m |
| Installatieopbouw | 22,5 × 36,3 m, met kop van 4,8 × 3,2 m | +80,6 m, +81,5 m |
| Onderbouw | BAG-contour, schuine noordoostgevel | +17,0 m |
| Borstwering onderbouw | 1,0 m langs de buitenrand | +18,3 m |
| Twee trappenhuiskoppen op de onderbouw | 4,8 × 9,0 m en 3,0 × 5,9 m | +21,8 m |

Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023).

## Geschat en weggelaten

- Bouwlagen: vier hoge lagen in de onderbouw en zestien kantoorlagen erboven (circa 3,7 m), uit foto's geteld. Glasvakken per laag tussen vinnen op een travee van 2,7 m: blinde nis van 0,4 m diep, vin/penant 0,9 m, borstwering 0,9 m, latei met plafond onder 45°. De werkelijke vinnen zijn smaller en dieper; dat is vereenvoudigd tot penanten van 0,9 m.
- Het lage glazen paviljoen voor de ingang en de entreeluifel zijn aparte of te kleine onderdelen en niet gemodelleerd; ze blijven in PDOK.
- Antennes en kleine dakapparatuur zijn weggelaten.

## Controle

`node scripts/generate-vivaldigebouw.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van alle delen, dat een glasvak na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,04 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0363100012251798` (bouwjaar 2020); actuele orthoHR; PDOK Locatieserver (Domenico Scarlattilaan 6).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012251798).
- [Wikipedia: Vivaldigebouw](https://nl.wikipedia.org/wiki/Vivaldigebouw).
- Foto's op Wikimedia Commons (niet meegeleverd): [2019-10-24](https://commons.wikimedia.org/wiki/File:Vivaldigebouw_2019.10.24_(1).jpg), [2020-04-23 (1)](https://commons.wikimedia.org/wiki/File:Vivaldigebouw_2020.04.23_(1).jpg), [2020-04-23 (2)](https://commons.wikimedia.org/wiki/File:Vivaldigebouw_2020.04.23_(2).jpg).
