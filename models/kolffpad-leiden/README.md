# Studententoren Kolffpad (Leiden)

Vereenvoudigd, printbaar model van de studententoren aan het Kolffpad op het Leiden Bio Science Park, aan de LUMC-kant van Leiden Centraal (DUWO, ontwerp Klunder Architecten, bouw Waal, opgeleverd 2023, geopend april 2024). Een vierkante toren van 21 lagen in donkergrijs metselwerk met vensters in witte kaders en 289 studio's; aan de zuidoost- en noordoostkant staat een L-vormige sokkel van vijf lagen met een groen dak, een glazen trappenhuisopbouw en installaties. In de bovenste twee lagen lopen de vensterkolommen als verdiepte sleuven door de dakrand, zodat de penanten ertussen als kroon boven het dak staan.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `kolffpad-leiden.glb` | Model in meters, Y omhoog, twee nodes: `building:kolffpad-leiden-toren` en `building:kolffpad-leiden-sokkel` |
| `kolffpad-leiden.json` | Catalogusitem |
| `kolffpad-leiden-1-1000.stl` | Los te printen op 1:1000 (29 × 36 × 69 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[92695.34, 464932.15]`, in het hart van de toren. De lokale X-as loopt langs de zuidoostgevel naar het oostnoordoosten (33,0° op RD-oost; de BAG-randen zijn evenwijdig binnen 0,2°), Y haaks erop naar het noordnoordwesten. Lokaal z = 0 is NAP +0,2 m (3D BAG-maaiveld 0,18, AHN-DTM rondom 0,1–0,5); `groundHeight` is 43,65 m (ellipsoïdisch, NAP plus de Leidse offset van circa 43,45) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

Het AHN4 van de PDOK-WCS (circa 2020–2022) is van vóór de bouw en meet binnen de contour alleen het bouwterrein (NAP +0,3); alle hoogtes komen daarom uit de 3D BAG, die dit pand op de AHN5-puntwolk van 2023 reconstrueert.

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 22,16 × 22,12 m op de BAG-contour | dak +67,5 m | BAG, 3D BAG (dakvlak 67,44–67,59; 70e percentiel 67,52) |
| Dakrand en kroonpenanten | rand 0,9 m breed | +68,1 m | geschat (0,6 m boven het dak), luchtfoto |
| Liftopbouw | 6,2 × 3,7 m | +68,8 m | 3D BAG (68,68–68,89), luchtfoto |
| Sokkel | L-vorm, 16,4 m breed langs de zuidoostkant en 6,7 m langs de noordoostkant, 36,3 m lang | +16,6 m | BAG, 3D BAG (16,61–16,63) |
| Glazen trappenhuisopbouw op de sokkel | 3,0 × 3,3 m | +19,3 m | 3D BAG (19,25–19,30), foto |
| Installatiekast op de sokkel | 1,7 × 1,9 m | +18,7 m | 3D BAG (18,67–18,70), luchtfoto |
| Installatiekader op de sokkel | 3,0 × 3,3 m | +17,6 m | luchtfoto, hoogte geschat |

Lagen: begane grond 3,8 m en twintig woonlagen van 3,15 m tot circa 0,3 m onder het dak; de sokkel volgt dezelfde lagen tot de vijfde. Gevelreliëf:

- Toren: zes traveeën van 3,69 m per gevel met per laag een venster van 1,9 m als blinde nis van 0,35 m met een plafond onder 45°. Aan de zuidoostgevel alleen de vier oostelijke kolommen; het westelijke derde deel is blind metselwerk (foto). Waar de sokkel tegen de toren staat, beginnen de vensters boven de sokkel.
- Kroon: in de bovenste twee lagen sleuven van 1,9 m breed en 1,0 m diep boven elke vensterkolom, open naar boven en door de dakrand heen, met de penanten (≥ 0,9 m) ertussen.
- Begane grond van de toren: glazen plint in nissen van 2,7 m en 0,6 m diep tussen penanten, met hoekpenanten van 0,9 m.
- Sokkel: zuidoostgevel met twee vensterkolommen van 2,0 m aan de oostkant (foto), zuidwestgevel met vier smalle vensters van 1,0 m (foto), noordoostgevel langs de singel met elf en de noordkop met twee traveeën (geschat); de begane grond met grote vensters van 2,0 m in nissen van 0,6 m.

## Geschat en weggelaten

- Naam: de taak noemt het gebouw "Woontoren Kolffpad"; de Universiteit Leiden en DUWO noemen het de studententoren of het studentencomplex Kolffpad, de DUWO-beelden heten "Schilperoortpark". Een andere projectnaam is niet gevonden.
- De 3D BAG zet de grens tussen toren- en sokkeldak op het oostelijke deel van de zuidoostgevel 1,8–2,6 m verder naar het zuidoosten dan de BAG-gevel van de toren; op de luchtfoto (gecorrigeerd voor de scheefstand) is het torendak een zuiver vierkant, dus de toren staat op de BAG-maat.
- Verdiepingshoogtes (21 lagen volgens de Universiteit Leiden), de hoogte van de dakrand en de kroonpenanten, de diepte van de kroonsleuven en de plint zijn geschat.
- Het vensterraster van de noordwest- en noordoostgevel (geen foto's van die kanten) en van de noordoostgevel en de noordkop van de sokkel is geschat; de zuidwest- en zuidoostgevel van de toren komen uit de luchtfoto en één foto uit het zuiden.
- De hoogte van het installatiekader op de sokkel is geschat (de 3D BAG ziet het niet).
- Weggelaten: de ronde dakventilatoren en het dakluik op het torendak, de zonnepanelen, de leidingen en ventilatorkappen op de sokkel (kleiner dan 0,9 m), de witte vensterkaders en Franse balkons (vlak in de gevel of kleiner dan 0,9 m) en de groene gevels.

## Controle

`node scripts/generate-kolffpad-leiden.mjs` geeft voor toren en sokkel `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de daken van toren, kroon, liftopbouw, sokkel en opbouwen, een kroonsleuf en het blinde deel van de zuidoostgevel, een vensternis die na de printcorrectie op 45° blijft, de volumegroei van de printcorrectie (minder dan 1 %) en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0546100000061036` (bouwjaar 2023, [BAG-viewer](https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0546100000061036)); actuele orthoHR; AHN-DTM 0,5 m.
- [3D BAG `NL.IMBAG.Pand.0546100000061036`](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0546100000061036) (LoD2.2, AHN5 2023).
- Universiteit Leiden, [studententoren Kolffpad officieel geopend](https://www.universiteitleiden.nl/nieuws/2024/04/een-waanzinnig-uitzicht-relaxruimte-en-cafe-studententoren-kolffpad-officieel-geopend) (april 2024) en [bouw studentencomplex Kolffpad start](https://www.universiteitleiden.nl/nieuws/2021/10/bouw-leids-studentencomplex-kolffpad-start) (oktober 2021).
- DUWO, [projectpagina Kolffpad](https://www.duwo.nl/en/about-duwo/our-buildings/we-build/project-details/item/44).
