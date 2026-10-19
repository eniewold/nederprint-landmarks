# Zurichtoren (Den Haag)

Vereenvoudigd, printbaar model van de Zurichtoren aan het Muzenplein naast de Hoftoren (kantoortoren, 1999), bijgenaamd De Citruspers: een zeshoekige toren met vensters per verdieping en een naar binnen lopende groene kap van stalen ribben en glas, met een lage westvleugel met golvende zuidgevel, een zuidvleugel en een oostelijke aanbouw.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `zurichtoren.glb` | Model in meters, Y omhoog, één node `building:zurichtoren-zeshoekige-toren-ribbenkap-en-vleugels` |
| `zurichtoren.json` | Catalogusitem |
| `zurichtoren-1-1000.stl` | Los te printen op 1:1000 (87 × 50 × 85 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81876.84, 455205.32]` (een punt van het BAG-pand; het hart van de toren ligt op (29, −1) in het gebouwstelsel). De lokale X-as loopt langs de westvleugel, 62,6° linksom op RD-oost. Lokaal z = 0 is NAP +0,47 m. `groundSamplePoints` liggen op straat en stoep rondom, `groundHeight` is 43,902 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Toren | regelmatige zeshoek, omgeschreven straal 16,6 m | +70,0 m |
| Kap | zeshoekige ringen: R 16,6 / 15,6 / 14,0 / 12,3 / 8,0 m | +70 / +74 / +78 / +81 / +84,6 m |
| Ribben | twaalf (hoeken en zijmiddens), 1,0 m breed, 0,6 m buiten het kapvlak | tot +85,1 m |
| Westvleugel met golvende zuidgevel | BAG-contour | +23,4 m |
| Twee koppen op de westvleugel | 6,7 × 9,8 m en 5,7 × 5,7 m | +27,0 m en +26,6 m |
| Zuidvleugel | BAG-contour | +23,2 m |
| Oostelijke aanbouw | BAG-contour | +16,4 m |

De torenplattegrond komt uit het AHN-DSM: de straal van alles boven +60 m wisselt per 5° tussen 14,0 en 16,8 m met maxima om de 60°, een zeshoek met omgeschreven straal 16,6 m en ingeschreven straal 14,4 m. De kapringen volgen de ringvormige dakvlakken van de 3D BAG (+70 tot +76 m, +81 m, top +84,6 m) en de stralen uit het DSM op +72, +78 en +82 m.

## Geschat en weggelaten

- Het profiel van de kap tussen de gemeten ringen en de doorsnede van de ribben zijn geschat; de kap is dicht gemodelleerd, de glazen vlakken en het open vakwerk tussen de ribben zijn niet als openingen te printen.
- Verdiepingen: begane grond van 4,5 m en 20 lagen van circa 3,25 m tot de kap. Vensters als blinde nissen van 0,35 m op een travee van 2,8 m met hoekpenanten van 1,2 m; in de vleugels zes lagen met een travee van 3,2 m. Elke nis heeft minstens 1 m materiaal achter zich.
- De bovenrand van de zuidvleugel is 1 m onder de toren doorgetrokken, omdat de BAG-contour de zeshoek daar niet precies volgt. Kleine lagere dakdelen (+19,7 m) langs de noordgevel van de westvleugel zijn niet apart gemodelleerd.

## Controle

`node scripts/generate-zurichtoren.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van kap en vleugels, dat de kap naar boven smaller wordt, dat een torenvenster na de printcorrectie op 45° een blinde nis blijft, genus 0, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,05 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0518100000269583` (bouwjaar 1999); actuele orthoHR; AHN-DSM 0,5 m (PDOK WCS).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000269583).
- [Wikipedia: Zurichtoren](https://nl.wikipedia.org/wiki/Zurichtoren).
- Foto's op Wikimedia Commons (niet meegeleverd): [Zurichtoren Den Haag](https://commons.wikimedia.org/wiki/File:Zurichtoren_Den_Haag.JPG), [Den Haag Zurichtoren 1](https://commons.wikimedia.org/wiki/File:Den_Haag_Zurichtoren_1.jpg), [Den Haag Zurichtoren 3](https://commons.wikimedia.org/wiki/File:Den_Haag_Zurichtoren_3.jpg), [Den Haag - Zurichtoren](https://commons.wikimedia.org/wiki/File:Den_Haag_-_Zurichtoren_(39789937282).jpg).
