# Eurotoren (Breda)

Vereenvoudigd, printbaar model van de Eurotoren aan het Luchtmachtplein (2000–2001), met circa 71 m het hoogste gebouw van Breda en samen met het complex ernaast het hoofdkwartier van de Koninklijke Luchtmacht. De toren bestaat uit drie delen naast elkaar: in het westen een sikkel met een gebogen gevel van rode baksteen met vensterbanden en een witte dakrand, in het midden een glazen schijf die als glazen kroon boven de rest uitsteekt, en in het oosten een blok van rode baksteen met losse vensters.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `luchtmachtplein-breda.glb` | Model in meters, Y omhoog, één node: `building:luchtmachtplein-breda-toren` |
| `luchtmachtplein-breda.json` | Catalogusitem |
| `luchtmachtplein-breda-1-1000.stl` | Los te printen op 1:1000 (26 × 43 × 74 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[108916.0, 402231.0]`, in de glazen schijf. De X-as loopt langs de noord- en zuidgevels, 3,0° linksom van RD-oost (BAG-randen 2,9–3,2° en 93,0°); Y loopt langs de oostgevel naar het noorden. Lokaal z = 0 is NAP +2,9 m (AHN-DTM rondom, mediaan 2,88; 3D BAG-maaiveld 2,94). `groundHeight` is 46,76 m: NAP 2,9 plus 43,86, de NLGEO2018-geoïde op deze plek (43,97) geijkt op het Rat Verlegh Stadion. `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Sikkel (west) | BAG-boog, straal 33,2 m, 42 m van punt tot punt, tot 6,3 m breed naast de schijf | +67,97 m | BAG, 3D BAG (67,94–68,00), DSM |
| Witte dakrand op de sikkel | 1,0 m buiten de gevel, 0,67 m dik, kraag onder 45° | tot +67,97 m | foto's (geschat) |
| Glazen schijf (midden) | 10,3 × 28,4 m | +74,35 m | BAG, 3D BAG (74,28–74,43), DSM |
| Dakrand rond de kroon | 0,9 m uitstekend, 0,9 m dik, kraag onder 45° | tot +74,35 m | foto's, DSM (rand ten zuiden van de gevel) |
| Embleem met draagframe | 4,7 × 1,6 m op de westrand van de schijf | +75,77 m | 3D BAG, foto's (kroon van de luchtmacht) |
| Installaties op de schijf | veelhoek circa 3,7 × 7 m | +75,88 m | 3D BAG (75,76–75,95), DSM |
| Oostblok van baksteen | 10,0 × 30,1 m | +64,37 m | BAG, 3D BAG (64,34–64,39), DSM |
| Installatiekast op het oostblok | 1,6 × 3,1 m | +66,89 m | 3D BAG, DSM |
| Nis met betonnen kader | één boogsegment op het westen, 4,8 m breed, 1,5 m diep, vier lagen | +41,0 tot +55,1 m | foto's (geschat) |
| Terugliggende begane grond onder de sikkel | 2,5 m terug, plafond onder 45° van 6,5 tot 9,0 m boven maaiveld | tot +11,9 m | foto's (geschat) |
| Ronde kolommen | acht, doorsnede 1,0 m, op de knikken van de boog | tot +11,9 m | foto's (geschat), BAG-knikken |

Verdiepingen: een begane grond van 9,0 m en daarboven lagen van 3,6 m: 14 in het oostblok, 15 in de sikkel en 17 in de schijf, samen 18 lagen. Gevelreliëf: in de sikkel per laag een vensterband van 1,35 m glas per boogsegment (0,9 m pijler op elke knik); in de schijf per laag een glasband van 0,35 m diep achter een vloerrand van 0,9 m, op de begane grond een glazen hal tot 8,1 m; in het oostblok per laag vensters van 4,2 × 1,55 m, vier op het oosten en één op het noorden en zuiden, en op de begane grond vensters per travee onder een glasband. Alle nissen hebben een plafond onder 45°.

## Geschat en weggelaten

- Naam: de opdracht noemt het gebouw "Kantoortoren Luchtmachtplein"; het heet de Eurotoren (Commons, SkyscraperPage). De architect is niet eenduidig (SkyscraperPage noemt PBV, een andere databank G. Lanting) en staat daarom niet in het model.
- Verdiepingshoogtes (begane grond 9,0 m, lagen 3,6 m) zijn afgeleid uit foto's en de 18 lagen; vensterbreedtes en de plaats en hoogte van de nis komen uit foto's.
- De dakranden, de diepte van de terugliggende begane grond en de kolomdoorsnede (op foto's circa 0,7 m, voor 1:1000 op 1,0 m gezet) zijn geschat.
- De noordpunt van de sikkel loopt in het model tot het dak door; de 3D BAG heeft daar een klein schuin vlak (67°), het DSM is er onduidelijk.
- Weggelaten: de glasstijlen van de schijf, de horizontale vinnen in de glazen kroon, de gevelreling en de dunne buizen op de dakrand en het embleem zelf boven het draagframe (alle kleiner dan 0,9 m), de kleine kasten op het dak van het oostblok (kleiner dan 1 m²), en het witte paviljoen en de parkeerplaatsen ten noorden van de toren (ander object, op maaiveldhoogte).

## Controle

`node scripts/generate-luchtmachtplein-breda.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de daken, het embleem en de installaties, dat de nis op het westen en de terugliggende begane grond na de printcorrectie op 45° blijven, een volumegroei van minder dan 1 % en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0758100000003827` (bouwjaar 2001, kantoorfunctie); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG LoD2.2, `NL.IMBAG.Pand.0758100000003827` (puntenwolk AHN5, 2024).
- [SkyscraperPage: Eurotoren](https://skyscraperpage.com/b9552).
- Foto's op Wikimedia Commons (niet meegeleverd): [Eurotoren Breda](https://commons.wikimedia.org/wiki/File:Eurotoren_Breda.jpg), [Eurotoren Breda DSCF5141](https://commons.wikimedia.org/wiki/File:Eurotoren_Breda_DSCF5141.jpg), [P1010384Eurotoren](https://commons.wikimedia.org/wiki/File:P1010384Eurotoren.JPG).
