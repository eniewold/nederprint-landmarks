# Toren Noord (Apeldoorn)

Vereenvoudigd, printbaar model van Toren Noord aan de Boogschutterstraat in Apeldoorn-Noord (2002, UNStudio; eerst La Tour, van 2014 tot 2022 HNK), met 75 m het hoogste gebouw van Apeldoorn. De toren van 21 lagen staat met de zuid- en westgevel aan een vijver. Zijn gevels zijn een lappendeken van witte vlakken met een vensterraster en schermen van horizontale aluminium lamellen die ongeveer een meter voor de gevel staan en als open kader tot boven het dak doorlopen; het noordelijke deel van de oostgevel buigt in de bovenste lagen naar binnen. Aan de oostkant hangt een laagbouwvleugel van één kantoorlaag op een open parkeerlaag, die bij hetzelfde BAG-pand hoort.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `toren-noord-apeldoorn.glb` | Model in meters, Y omhoog, twee nodes: `building:toren-noord-apeldoorn-toren` en `building:toren-noord-apeldoorn-laagbouw` |
| `toren-noord-apeldoorn.json` | Catalogusitem |
| `toren-noord-apeldoorn-1-1000.stl` | Los te printen op 1:1000 (57 × 39 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[195494.87, 472523.45]`, het hart van de toren. De X-as loopt langs de zuidgevel naar het oostnoordoosten (19,0° op RD-oost; de BAG-randen liggen op 18,8–19,2°), de Y-as haaks erop naar het noordnoordwesten. In het script is (u, v) = (0, 0) de zuidwesthoek van de BAG-contour (RD 195490,28 472502,53); model-x = u − 11,15, model-y = v − 18,29.

Lokaal z = 0 is NAP +9,1 m, het entreeplein aan de oostkant (AHN-DTM 9,1–9,2). De vijver ligt op circa +8,7, het parkeerterrein aan de noordkant op +10,8. `groundSamplePoints` liggen op het entreeplein; `groundHeight` is 52,23 m: NAP +9,1 plus 43,13, de NLGEO2018-geoïde ter plekke (43,24) min 0,1 m, zoals bij de Peperbus, MAC³PARK en de Walburgiskerk (offset 0,0–0,1 m onder de geoïde). `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (kern) | BAG-rechthoek 22,3 × 36,6 m | dak +80,7 m | BAG, 3D BAG (80,71–80,76), AHN-DSM (80,7) |
| Lamellenschermen | 1,0 m voor de BAG-gevel (oost 0,7 m), onderkant onder 45° | kader tot +84,0 m | AHN-DSM-randen (west −1,0…−1,5, noord +1,2, oost +0,5…+0,7), 3D BAG (83,95–84,03), foto's |
| Witte gevelvlakken | 0,6 m voor de BAG-gevel | tot het dak | AHN-DSM-randen (zuid −0,6…−1,0; west-midden dakrand +80,5 op −0,5…−1,0), foto's |
| Indeling per gevel | zuid: lamellenblok u 0–11 in lagen 1–11, verder wit; west: lamellenbanden v < 9,2 en v > 25,3, midden wit vanaf laag 12; noord: lamellen; oost: wit in lagen 1–11 tot de vleugel, verder lamellen | — | foto's |
| Kader achter het witte westvlak | 0,6 m breed | +84,0 m | AHN-DSM (83,6 op u 0…0,5) |
| Schuin deel oostgevel (v > 25,3) | buigt van 0,7 m voor de gevel op +55 m naar u = 20,5 op het dak | — | AHN-DSM (helling 80 → 60 m over u 20,5–22,5), foto |
| Kader noordoosthoek | 3,1 × 11,8 m | +84,0 m | 3D BAG, AHN-DSM (84,0 op u 17,5–20) |
| Installatieopbouw | 7,7 × 22,2 m met een uitbouw van 1,9 × 7,8 m | +84,28 m | 3D BAG |
| Kastje naast de opbouw | 2,2 × 1,6 m | +82,1 m | 3D BAG |
| Laagbouwvleugel | BAG-contour 34,1 × 22,1 m | +19,6 m | BAG, 3D BAG (19,60–19,65) |
| Opbouw op de vleugel | 2,0 × 3,1 m | +21,0 m | 3D BAG |

Gevelreliëf: begane grond 5,0 m, daarboven 20 lagen van 3,33 m. Witte vlakken: per laag vensters van 0,9 m op 1,8 m als blinde nissen van 0,35 m met een plafond onder 45°. Lamellenschermen: per laag een doorlopende band van 0,35 m diep achter een dichte strook van 1,0 m, ook op het schuine deel van de oostgevel. Begane grond: aan de zuidkant en de entreekant (oost, tot de vleugel) een glazen pui 1,5 m achter de gevel tussen kolommen van 1,0 m, met een vrijstaande hoekkolom op de zuidoosthoek en een plafond onder 45°; west en noord een pui van 0,35 m diep tussen penanten. Vleugel: zuidkant een colonnade van 1,5 m diep met zeven kolommen van 1,0 m, oost- en noordkant een dichte pui (hekwerk parkeerlaag) als nis, daarboven vensters van 1,6 m op 2,8 m.

## Geschat en weggelaten

- De verdeling van witte en lamellenvlakken komt van vijf foto's (west, zuid, oost en twee schuine); de noordgevel staat op geen enkele foto en is als lamellengevel aangenomen (de DSM-rand ligt daar 1,2 m buiten de BAG-lijn, zoals bij de andere lamellenvlakken).
- Verdiepingshoogtes (begane grond 5,0 m, daarboven 3,33 m), het vensterraster, de banddiepte, de kolommen en de grens tussen de onderste en bovenste gevelvlakken (na laag 11) zijn geschat.
- De schuine noordoostgevel is als één vlak vanaf +55 m gemodelleerd; in het DSM is de overgang iets bol.
- Het lamellenkader boven het dak is in werkelijkheid open; het staat erin als dichte rand van 0,6–1,5 m breed.
- Weggelaten: de reclameletters op het dak (dunner dan 0,9 m), de losse lamellen zelf (kleiner dan 0,9 m), vlaggenmasten, hekwerken langs het water en een kastje op de noordoosthoek van de vleugel (kleiner dan 0,9 m boven het dak). Het terras en de trappen tussen toren en Boogschutterstraat horen bij het terrein.

## Controle

`node scripts/generate-toren-noord-apeldoorn.mjs` geeft voor beide nodes `NoError` en één gesloten deel (toren genus 1 door de vrijstaande hoekkolom, vleugel genus 0). In de webshop controleert de test de daken, het kader, de installatieopbouw en de vleugel, dat de noordoostgevel naar binnen buigt, de vensternissen, de lamellenbanden en de colonnade (ook na de printcorrectie op 45°), dat de printcorrectie het volume met minder dan 1 % laat groeien, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0200100000700217` (bouwjaar 2002); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG (LoD2.2), pand `NL.IMBAG.Pand.0200100000700217`, puntenwolk AHN4 (2022).
- NLGEO2018 (geoïde) voor `groundHeight`.
- [Toren Noord op Wikipedia](https://nl.wikipedia.org/wiki/Toren_Noord).
- Foto's op Wikimedia Commons (niet meegeleverd): [Category:Toren Noord](https://commons.wikimedia.org/wiki/Category:Toren_Noord).
