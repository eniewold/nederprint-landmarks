# WTC Utrecht (Utrecht)

Vereenvoudigd, printbaar model van het World Trade Center Utrecht op het Stadsplateau naast het Stadskantoor (2018, MVSA): een langgerekte kantoorschijf met afgeschuinde en afgeronde hoeken, een knik in de westgevel, horizontale glasbanden per verdieping, een verhoogd middendak en drie verspringende verticale vides in de westgevel.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `wtc-utrecht.glb` | Model in meters, Y omhoog, één node `building:wtc-utrecht-schijf-met-glasbanden-en-vides` |
| `wtc-utrecht.json` | Catalogusitem |
| `wtc-utrecht-1-1000.stl` | Los te printen op 1:1000 (31 × 68 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[135803.59, 455733.43]`, het hart van het BAG-pand. De lokale X-as wijst naar de oostgevel, 30,5° linksom op RD-oost; +Y loopt langs de lange as naar het noordnoordwesten. Lokaal z = 0 is NAP +2,4 m. Het PDOK-terrein rond het gebouw is vlak (ellipsoïdisch 45,75–46,05 m); `groundSamplePoints` liggen op de stoepen, `groundHeight` is 45,75 m, `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Schijf | BAG-contour (31 × 68 m), afrondingen als facetten | +73,82 m |
| Verhoogd middendak met installaties en zonnepanelen | 14,1 × 43,6 m | +77,7 m |
| Drie vides in de westgevel | 3,4–3,5 m breed, 1,5 m diep | lagen 1–8 (twee) en 7–18 (één) |

Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023).

## Geschat en weggelaten

- Bouwlagen: een begane grond van 5 m en 19 kantoorlagen (circa 3,5 m), geteld op foto's. Per laag een glasband van 0,4 m diep achter een borstwering van 0,9 m, plafond onder 45°, hoekpenanten van 0,95 m.
- Positie, breedte en hoogte van de vides komen uit twee foto's van de westgevel; van de oostgevel waren geen foto's beschikbaar, daar zijn geen vides gemodelleerd.
- De afgeronde glazen hoeken zijn facetten; logo en belettering zijn weggelaten.

## Controle

`node scripts/generate-wtc-utrecht.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes, dat een glasband en een vide na de printcorrectie op 45° blijven, genus 0, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,07 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0344100000144323` (bouwjaar 2018); actuele orthoHR.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000144323).
- [Lijst van hoogste gebouwen van Utrecht](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)).
- Foto's op Wikimedia Commons (niet meegeleverd): [WTC Utrecht in 2026](https://commons.wikimedia.org/wiki/File:WTC_Utrecht_in_2026.jpg), [WTC Utrecht in 2026 (2)](https://commons.wikimedia.org/wiki/File:WTC_Utrecht_in_2026_2.jpg).
