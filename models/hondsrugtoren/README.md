# Hondsrugtoren (Emmen)

Vereenvoudigd, printbaar model van de Hondsrugtoren aan de Weerdingerstraat in het centrum van Emmen (2021, Attika Architekten), met circa 61 m tot de liftopbouw het hoogste gebouw van Drenthe. Een woontoren van 17 lagen: een rechthoekige hoofdmassa met aan de west- en oostkant lagere vleugels die in twee stappen naar de zuidhoeken aflopen, een blinde kern met reliëfpanelen die uit de noord- en zuidgevel steekt, balkonstapels op de hoeken en een installatieopbouw op het dak. De onderste twee lagen zijn van baksteen; aan de zuid- en westkant ligt een uitbouw van één laag.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `hondsrugtoren.glb` | Model in meters, Y omhoog, één node: `building:hondsrugtoren-toren` |
| `hondsrugtoren.json` | Catalogusitem |
| `hondsrugtoren-1-1000.stl` | Los te printen op 1:1000 (34 × 23 × 62 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[256503.0, 534525.0]`, in de hoofdmassa 3 m ten westen van de kern. De lokale X-as loopt langs de lange gevels, 4,9° op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig), Y naar het noorden langs de korte gevels. Lokaal z = 0 is NAP +22,3 m, het maaiveld rondom (AHN-DTM 22,2–22,4; 3D BAG 22,27). `groundHeight` is 64,15 m: NAP 22,3 plus 41,85, net onder de NLGEO2018-geoïde op deze plek (41,89), zoals de modellen in Groningen en Zwolle 0,05–0,1 m onder de geoïde liggen. `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Hoofdmassa | 18,5 × 15 m (plus 4,2 × 7,7 m aan de oostkant) | +79,6 m | BAG, AHN-DSM (79,45–79,73), 3D BAG 70e percentiel 79,62 |
| Installatieopbouw | 11,9 × 7,1 m | +82,3 m | AHN-DSM (82,38), 3D BAG 82,29 |
| Rug over de noordkern | 1,5 × 5,2 m | +82,3 m | AHN-DSM (82,24) |
| Liftopbouw | 2,5 × 4 m | +83,4 m | AHN-DSM (83,2–83,6), 3D BAG 83,5 |
| West- en oostvleugel boven de loggia's | 4,8 en 4,2 m breed | +75,45 m | AHN-DSM (75,42 en 75,47) |
| Dakterrassen op de zuidhoeken | 3,4 m diep | +68,4 m | AHN-DSM (68,33 en 68,50) |
| Kern aan de noordgevel | 4,6 m breed, 2,8 m uit de gevel | +79,6 m | BAG, AHN-DSM |
| Kern aan de zuidgevel | 4,05 m breed, 1,75 m uit de gevel | +79,6 m | AHN-DSM (79,73) |
| Balkonstapels zuidwest en zuidoost | 4,9 en 4,35 m breed, 2,1 m uit de gevel | +64,8 m | AHN-DSM (64,74 en 64,85) |
| Balkonstapels west- en oostgevel | 3,5 m breed, 1,9 en 2,3 m uit de gevel | +55,0 m | AHN-DSM (54,4–55,2), foto |
| Lage uitbouw zuid en west | BAG-contour | +26,77 m | 3D BAG (26,73–26,79), AHN-DSM |
| Strook voor de zuidkern | 5 × 3,3 m | +30,22 m | 3D BAG (30,20–30,26), AHN-DSM |

Lagen: begane grond 4,45 m (gelijk met het dak van de uitbouw), daarboven 16 lagen van 3,2 m. Zo eindigen de vleugels na 13 lagen op het dakterras en na 15 lagen onder het vleugeldak, en de hoofdmassa na 16 lagen met een dakrand van 1,65 m; dat klopt met de 17 lagen uit Wikipedia en met de gemeten dakhoogtes.

Gevelreliëf: per laag vensters in paren (twee ramen in één kader) als blinde nissen van 2,2 m op een travee van 3,1 m, 0,35 m diep met een plafond onder 45°; op de begane grond een winkelpui als nis vanaf 0,4 m. In de twee lagen onder het vleugeldak loggia's van 2,6 m breed, 1,2 m diep, met een borstwering van 1,0 m en een plafond onder 45°; op de hoeken lopen ze om de hoek door, met een hoekkolom van circa 1 m. In de balkonstapels per laag een open balkon van 1,2 m diep. De stapels zuidoost, west en oost beginnen op de eerste verdieping op een kraag onder 45°; de stapel zuidwest staat op het dak van de uitbouw. De kernen hebben geen vensters.

## Geschat en weggelaten

- Verdiepingshoogtes (4,45 m en 3,2 m) zijn afgeleid uit de dakhoogtes en het aantal lagen op de foto; het vensterraster (paren op 3,1 m) en de loggiaverdeling zijn vereenvoudigd uit foto's.
- Diepte van de balkons en loggia's (1,2 m), de onderkant van de balkonstapels (eerste verdieping) en de breedtes van de stapels zijn geschat uit foto's en de randen in het DSM.
- De zuidgevel van de bovenbouw ligt op 0,2 m buiten de BAG-contour (DSM); kleine knikjes in de BAG-contour (< 0,9 m) zijn weggelaten.
- Weggelaten: de labyrintpanelen op de kernen, de vensterkaders en de bakstenen plint als apart materiaal (reliëf kleiner dan 0,9 m), glazen balkonhekken en dakrelingen, de Franse balkons in de noordgevel, de schoorsteenpijpen op de installatieopbouw en de zonnepanelen (kleiner dan 0,9 m). De losse hoekloggia's in de lagere lagen van de westgevel staan er als vensternis in.

## Controle

`node scripts/generate-hondsrugtoren.mjs` geeft `NoError`, genus 4 (de loggia's die om de hoek doorlopen) en één gesloten deel. In de webshop controleert de test in `tests/landmark-models.test.ts` de daken, opbouwen, vleugels, terrassen, balkonstapels en de uitbouw, dat de weststapel uitsteekt en zijn open balkons na de printcorrectie op 45° houdt, dat het volume daarbij minder dan 1 % groeit, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0114100000405358` (bouwjaar 2021); actuele orthoHR; AHN-DSM en -DTM 0,5 m (AHN4, opname 2022, na de oplevering).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0114100000405358) LoD2.2 (TU Delft/3DGI, CC BY 4.0).
- [Hondsrugtoren](https://nl.wikipedia.org/wiki/Hondsrugtoren) op Wikipedia (17 lagen, bouwhoogte 65 m, Attika Architekten).
- Foto's op Wikimedia Commons (niet meegeleverd): [Hondsrugtoren Emmen 2021](https://commons.wikimedia.org/wiki/File:Hondsrugtoren_Emmen_2021.jpg) en [Hondsrugtoren in aanbouw](https://commons.wikimedia.org/wiki/File:Hondsrugtoren.jpg).
- NLGEO2018-geoïde voor `groundHeight`.
