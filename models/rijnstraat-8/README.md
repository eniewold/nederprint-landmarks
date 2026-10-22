# Rijnstraat 8 (Den Haag)

Vereenvoudigd, printbaar model van Rijnstraat 8, het voormalige VROM-gebouw naast Den Haag Centraal (Jan Hoogstad, 1992; verbouwd door OMA, 2017): een blok van 140 bij 56 m waarin over de lengte vier witte kantoorschijven afwisselen met drie travees met glazen gevelserres aan beide langsgevels en een middenatrium onder een verhoogde glazen kap. Aan de zuidoostkant staat een kantoorblok met glasgevel en lichtkap, aan de noordwestgevel een trappenhuis, en aan het plein twee lage vleugels. Onder de schijven een open plint met Λ-vormige kolommen, onder de serres een inspringende donkere plint en in de Rijnstraatgevel de poort van de verhoogde tramlijn.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `rijnstraat-8.glb` | Model in meters, Y omhoog, één node `building:rijnstraat-8` |
| `rijnstraat-8.json` | Catalogusitem |
| `rijnstraat-8-1-1000.stl` | Los te printen op 1:1000 (144 × 78 × 63 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82053.81, 455166.13]`, het hart van de BAG-contour. De lokale X-as loopt langs de lange as naar het noordwesten, 127,4° linksom op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y wijst naar het plein aan de zuidwestkant, −Y naar de Rijnstraat. Lokaal z = 0 is NAP +0,7 m, het maaiveld rondom; de Rijnstraat ligt 0,5–0,9 m lager. `groundSamplePoints` liggen op het plein en aan de zuidoostkant, `groundHeight` is 44,2 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Ligging langs de as (u) | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Kantoorblok zuidoost | −69,9 … −34,5 m | +60,4 m, lichtkap 21 × 22,5 m tot +62,8 m | AHN-DSM, luchtfoto |
| Witte schijven | −34,5 … −24,3, −2,4 … 8,6, 30,6 … 40,6 m | +61,0 m | AHN-DSM (vlak dak) |
| Kopschijf noordwest | 62,4 … 69,9 m | +60,8 m | AHN-DSM |
| Travees met serres | −24,3 … −2,4, 8,6 … 30,6, 40,6 … 62,4 m | dak +60,4 m, middenkap +61,9 tot +62,5 m | AHN-DSM |
| Trappenhuis noordwestgevel | 4 × 12 m | +57,3 m | BAG, AHN-DSM |
| Lage vleugels aan het plein | 47 × 21,7 m en 40 × 21,6 m | +13,8 en +14,0 m | BAG, AHN-DSM |

Per travee: aan beide langsgevels een gevelserre van 6 m diep onder drie glazen zaagtanden (goot +60,4, nok +61,4 m), daarachter kantoren met een plat dak en in het midden een atrium van 22 m breed onder een verhoogde glazen kap met vier zaagtanden. De glasgevels van de serres liggen 1,2 m achter de schijven; zij en het kopblok hebben per laag een doorlopende glasband (blinde nis van 0,35 m met een plafond onder 45°), de schijven één verticale vensterstrook van 1,4 m en de kopgevel noordwest vensters per travee.

Plint: onder de schijven 3 m diep tot +9,0 m met per schijf een Λ-kolom van twee benen van 1 m; onder de serres 2,5 m diep tot +13,0 m; onder het kopblok 2 m diep tot +8,0 m. Alle plafonds lopen onder 45° naar binnen, zodat de overstekken zonder steun printen. De trampoort is een blinde doorgang van 12 m breed en 18 m diep met wanden tot +10,5 m en een spitse top tot +16,5 m.

## Geschat en weggelaten

- De serres zijn van glas en het AHN kijkt erdoorheen; hun diepte (6 m) en de zaagtanden (drie per serre, nok +61,4 m) zijn op de luchtfoto en foto's geschat. In werkelijkheid verspringen de serres per gevel iets ten opzichte van de schijven; het model houdt per travee één indeling aan.
- Plinthoogtes, de Λ-kolommen (één per schijf en gevel) en de trampoort zijn op foto's geschat. De werkelijke trampoort is rechthoekig en loopt verder het gebouw in; een vlak plafond van 12 m zou in de print worden dichtgezet, vandaar de spitse top.
- Verdiepingen: begane grond 4,5 m, daarboven 3,6 m (16 lagen volgens Wikipedia).
- Weggelaten: de daktuinen en het sportveld op de zuidoostelijke vleugel (vlak), installaties op de schijfdaken (lager dan 0,9 m boven het dak) en de luifels aan het plein.

## Controle

`node scripts/generate-rijnstraat-8.mjs` geeft `NoError`, genus 1 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de daken van schijven, travees, kopblok, trappenhuis en vleugels, de middenkap, de open plint met kolom, de diepte van de trampoort, dat de glasbanden na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0518100000274290` (bouwjaar 1993); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Wikipedia: VROM-gebouw](https://nl.wikipedia.org/wiki/VROM-gebouw).
- Foto's op Wikimedia Commons (niet meegeleverd): [entree, 2020](https://commons.wikimedia.org/wiki/File:Rijnstraat_8_The_Hague_2020.jpg), [Rijnstraatgevel](https://commons.wikimedia.org/wiki/File:Rijksgebouw_Den_Haag.jpg), [kopblok vanaf de Lekstraat](https://commons.wikimedia.org/wiki/File:Rijkskantoor_Rijnstraat_8_gezien_vanaf_de_Lekstraat.jpg), [kopblok](https://commons.wikimedia.org/wiki/File:Rijkskantoorgebouw_Rijnstraat_8.jpg), [plint](https://commons.wikimedia.org/wiki/File:Former_VROM_building_The_Hague.jpg).
