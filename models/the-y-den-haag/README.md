# The Y (Den Haag)

Vereenvoudigd, printbaar model van The Y bij station Den Haag HS (AA architecten, 2017; de getransformeerde en uitgebreide Sigma-locatie): een plint van zes bouwlagen langs het spoor, een woonstrook van zestien bouwlagen die onder 45° van de plint wegloopt, en een toren van 24 bouwlagen met een open kroon. Samen vormen ze in plattegrond de Y.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `the-y-den-haag.glb` | Model in meters, Y omhoog, één node `building:the-y-plint-strook-en-toren` |
| `the-y-den-haag.json` | Catalogusitem |
| `the-y-den-haag-1-1000.stl` | Los te printen op 1:1000 (111 × 52 × 77 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82125.69, 454186.33]`, het hart van de BAG-contour. De lokale X-as loopt langs het spoor, 34,1° linksom op RD-oost; +Y wijst naar het noordwesten (Hofwijckstraat), −Y naar het spoor. Lokaal z = 0 is NAP −0,2 m. `groundSamplePoints` liggen op de straten rondom; het verdiepte erf ten noorden van de toren (circa 1,2 m lager) telt bewust niet mee. `groundHeight` is 43,57 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Strook langs het spoorviaduct | 103,5 × 4,0 m | +9,3 m |
| Galerijstrook | 42,9 × 2,0 m | +18,25 m |
| Plint (6 lagen) | 83,9 × 12,8 m | +21,55 m |
| Woonstrook (16 lagen) | parallellogram onder 45°, 12,8 m breed, met trappenhuiskop | +51,6 m, kop +52,7 m |
| Toren (24 lagen) | 26,5 × 23,5 m | +72,45 m |
| Kroon | rand van 1,8 m rondom | +75,75 m |
| Dakinstallatie in de kroon | 16,5 × 6,3 m | +74,8 m |
| Ronde erker noordgevel | westhelft vlak, oosthelft hellend dak | +69,2 m; +61,0 → +68,3 m |
| Spitse erker noordgevel | driehoek, 2,2 m diep | +69,2 m |
| Kern aan de westkant van de toren | 2,6 × 4,2 m | +73,7 m |
| Luifel oostgevel (Stationsplein) | boogsegment | +4,7 m |

Contouren uit de BAG, hoogtes en het hellende erkerdak (planvergelijking) uit de 3D BAG (LoD2.2, AHN5 2023). De aantallen bouwlagen komen uit de projectbeschrijving van Knauf.

## Geschat en weggelaten

- Er waren geen schuine foto's van het gebouw zelf beschikbaar op Wikimedia Commons; de vorm komt uit BAG, 3D BAG, orthofoto en de PDOK-reconstructie. Het vensterstramien (travee circa 3 m, nis 0,35 m diep, borstwering en latei samen 1,2 m, penanten minstens 1,0 m) is een schatting en geeft het ritme van de bouwlagen, niet de werkelijke gevelindeling.
- De begane grond blijft dicht; entrees, balkons en de verdiepte bovenste laag achter de kroon zijn kleiner dan het stramien of niet te controleren.
- Zonnepanelen en kleine dakapparatuur (< 0,9 m) zijn weggelaten.

## Controle

`node scripts/generate-the-y-den-haag.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van alle delen, het hellende erkerdak, dat een vensternis na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,04 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0518100001649070` (bouwjaar 2017); actuele orthoHR.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001649070).
- [Knauf: The Y, Sigmalocatie Den Haag](https://knauf.com/nl-NL/projectreferenties/sigma-the-y): architect, bouwlagen.
- [Holland2Stay: The Y](https://www.holland2stay.com/building/they).
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag).
