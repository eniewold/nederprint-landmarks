# 400 Beethoven (Amsterdam)

Vereenvoudigd, printbaar model van 400 Beethoven aan de Beethovenstraat op de Zuidas (kantoren, 2016, 14 lagen): een gebouw op een smalle, schuine kavel met een sokkel van acht lagen met afgeronde hoeken over de hele BAG-contour, aan de zuidoostkant in twee treden aflopend, en daarop een smallere toren waarvan het westelijke deel twee lagen lager is. Bovenop staat een technische opbouw. De gevels hebben per laag witte vensterkaders en blauwe borstweringen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `400-beethoven.glb` | Model in meters, Y omhoog, één node `building:400-beethoven` |
| `400-beethoven.json` | Catalogusitem |
| `400-beethoven-1-1000.stl` | Los te printen op 1:1000 (66 × 26 × 61 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[120227.43, 483277.0]`, het hart van de BAG-contour van de toren. De lokale X-as loopt langs de lange gevels naar het oostzuidoosten, −63,2° op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig); +Y wijst naar het noordnoordoosten. Lokaal z = 0 is NAP −0,7 m, het maaiveld rondom; `groundHeight` is 42,4 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

`replacesBuildings` bevat de toren (pand `0363100012242448`) en het pand van de parkeerkelder (`0363100012242865`), dat de toren omsluit en in PDOK tot het torendak wordt opgetrokken. Het lage gebouw aan de zuidoostkant (`0363100012242866`) en de stadsvilla's in het midden van het blok hebben een eigen PDOK-reconstructie en blijven staan.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Sokkel | BAG-contour, 65,6 × 25,6 m, afgeronde hoeken | +30,0 m | BAG, AHN-DSM (29,8–30,3) |
| Treden aan de zuidoostkant | zuidstrook u = 8…16 m en u > 16 m | +26,0 en +22,0 m | AHN-DSM |
| Toren | sokkelcontour vanaf v = −6,5 m en u = −25 m | +55,2 m | AHN-DSM (54,6–55,8) |
| Westdeel toren | u = −25…−15 m | +50,0 m | AHN-DSM (49,9–50,5) |
| Technische opbouw | 24 × 4 m | +59,5 m | AHN-DSM (57–60) |

Gevelreliëf: per laag vensters van 1,6 m op een travee van 2,7 m als blinde nissen van 0,35 m met een plafond onder 45°, op alle randen van sokkel, treden en toren waar de gevel op die hoogte buitengevel is.

## Geschat en weggelaten

- De terugsprongen komen uit het AHN-DSM; de afgeronde hoeken van de toren volgen de BAG-contour waar die samenvalt met de torengevel.
- Verdiepingen: begane grond 4,4 m en daarboven 3,95 m (14 lagen volgens de hoogbouwlijst). Het vensterstramien en de witte kaders zijn vereenvoudigd tot één nis per venster.
- Weggelaten: de gebogen witte vensterkaders, de V-vormige kolommen aan de Beethovenstraat en de dakterrasinrichting (kleiner dan 0,9 m).

## Controle

`node scripts/generate-400-beethoven.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de hoogtes van sokkel, treden, toren, westdeel en opbouw, dat de vensternissen na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, panden `0363100012242448` en `0363100012242865` (bouwjaar 2017); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam) (Beethoven 400: 65 m, 2016, 14 lagen).
- Foto's op Wikimedia Commons (niet meegeleverd): [gevel](https://commons.wikimedia.org/wiki/File:Amsterdam_-_400_Beethovenstraat_(30003120410).jpg), [vanaf de Beethovenstraat](https://commons.wikimedia.org/wiki/File:Amsterdam_-_400_Beethovenstraat_(30299782305).jpg), [hoek George Gershwinlaan](https://commons.wikimedia.org/wiki/File:Beethovenstraat_hoek_George_Gershwinlaan_foto_1.jpg).
