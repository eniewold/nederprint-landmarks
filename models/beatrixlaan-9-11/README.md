# Torens Prinses Beatrixlaan 9 en 11 (Den Haag)

Vereenvoudigd, printbaar model van de twee woontorens aan de Prinses Beatrixlaan in het Beatrixkwartier (2019), naast de Zilveren Toren. Beide torens staan op een plattegrond van vier hoeken met één schuine gevel, hebben 22 lagen met een wit raster van vensters en per toren twee stapels balkons die buiten de gevel uitsteken; op het dak staat een installatiekast.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `beatrixlaan-9-11.glb` | Model in meters, Y omhoog, twee nodes: `building:beatrixlaan-toren-11` en `building:beatrixlaan-toren-9` |
| `beatrixlaan-9-11.json` | Catalogusitem |
| `beatrixlaan-9-11-1-1000.stl` | Los te printen op 1:1000 (67 × 62 × 75 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82784.0, 455167.0]`, tussen de twee torens; de lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden), omdat de torens niet evenwijdig staan. Lokaal z = 0 is NAP +0,8 m, het maaiveld aan de Prinses Beatrixlaan; `groundHeight` is 44,2 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15. Tussen de torens ligt een verhoogd dek op circa +4 m dat bij een ander pand hoort en niet in het model zit.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren 11 (noordoost, pand `0518100001753745`) | BAG-contour, circa 25 × 24 m | +73,0 m | BAG, AHN-DSM (mediaan 73,0) |
| Toren 9 (zuidwest, pand `0518100001753747`) | BAG-contour, circa 25 × 24 m | +73,0 m | BAG, AHN-DSM (mediaan 73,0) |
| Installatiekasten | 4 × 8 m en 5 × 4 m | +75,0 m | AHN-DSM (74,5–75,5) |
| Balkonstapels | twee per toren, 6–9,5 m breed, 1,4 m uitstekend | +5,0 tot +70,0 m | AHN-DSM (balkonranden buiten de gevel), foto |

Gevelreliëf: per laag vensters van 1,5 m op een travee van 2,4 m als blinde nissen van 0,35 m met een plafond onder 45°; in de balkonstapels per laag een open balkon van 0,9 m diep. Onder elke stapel loopt een kraag onder 45° naar de gevel.

## Geschat en weggelaten

- Naam nakijken: de rij noemt de torens naar hun adres; ze staan zonder eigen pagina in de hoogbouwlijst.
- De plaats van de balkonstapels komt uit de randen die het DSM buiten de gevel meet; hun bovenkant (+70 m), breedte en uitsteek zijn geschat. Welk huisnummer bij welke toren hoort is niet nagekeken.
- Verdiepingshoogte (begane grond 5,0 m, daarboven 3,15 m) en het vensterraster zijn geschat.
- Weggelaten: de balkonhekken en de entreeluifels (kleiner dan 0,9 m).

## Controle

`node scripts/generate-beatrixlaan-9-11.mjs` geeft per toren `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de daken en installatiekasten, dat een balkonstapel uitsteekt en zijn open balkons na de printcorrectie op 45° houdt, één component per toren en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, panden `0518100001753745` en `0518100001753747` (bouwjaar 2019); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegels (LoD2.2).
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag).
- Foto op Wikimedia Commons (niet meegeleverd): [Prinses Beatrixlaan](https://commons.wikimedia.org/wiki/File:Monarch_III,_Prinses_Beatrixlaan_Den_Haag_(49900924528).jpg).
