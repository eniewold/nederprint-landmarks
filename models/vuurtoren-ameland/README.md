# Vuurtoren Bornrif (Hollum)

Bestanden: `vuurtoren-ameland.glb` (meters, Y omhoog), catalogus-JSON en
`vuurtoren-ameland-1-1000.stl` (millimeters, Z omhoog). Generator:
`scripts/generate-vuurtoren-ameland.mjs`.

Hart RD **170846,40; 607024,90**, maaiveld NAP +9,28 m. +X is RD-oost
−5°, ingang op −Y aan de zuidzijde. Onderkant −0,5 m; terrein wordt op
6 m rond het hart bemonsterd. BAG **0060100000125111** wordt vervangen.
Het adrespunt Oranjeweg 57 ligt circa 250 m verderop en is niet gebruikt.

Eén verbonden gesloten node met ronde conische romp, blinde rechthoekige
raamnissen, entreeplint, twee omgangen met dichte 0,9 m parapetten,
lichtkuip, blinde glasnissen, koepel en radar. De romp is één conisch
oppervlak; de koepel volgt een radiaal profiel. De rood-witte banden zijn
schilderwerk, geen geometrische ribben: de kaart volgt de gebouwkleur
van het gekozen NederPrint-thema.

BAG en AHN geven hart, straal en versmalling. NVV geeft 55,3 m totale
hoogte; AHN-top NAP +65,10 m geeft circa 55,8 m, binnen raster-/antenne-
onzekerheid. Gebruikt: romp +46,55 m, koepel +54,35 m, radar +55,30 m.
Geschat: omgang-/lichtkuiphoogtes, koepelprofiel, raamritme en nisdiepte
0,35 m, entreeplint 2,8 × 1,25 m en radarvorm. Omgangconsoles zijn
schuine printkragen, balustrades dichte ringen. Bouten, plaatnaden,
glasstijlen, interieur, dunne antennes en bomen weggelaten. Losse
lichtwachterswoningen blijven PDOK-panden en vallen buiten dit model.

Controle: NoError, één volume, 6532 driehoeken; 9,4 × 9,9 × 55,8 mm
op 1:1000. Plaatsingstest controleert de juiste toren en beide omgangen.
Hele toren in 90 × 90 m preview-/3MF-export op 1:1000; printbare overhang
45° geeft circa 0,1% extra volume. GLTFLoader en vier schuine renders
naast PDOK gecontroleerd: conische romp, omgangen en lichtkap vervangen
het te brede verticale PDOK-blok; voet sluit aan op het duinplateau.
Controlebeelden blijven buiten de repo.

Bronnen, geraadpleegd 8 oktober 2026:

- PDOK BAG, AHN4 DSM/DTM 0,5 m en actuele orthoHR; bbox 170800,606980,170890,607070.
- [RCE monument 7693](https://monumentenregister.cultureelerfgoed.nl/monumenten/7693).
- [NVV, coördinaten en objecthoogte](https://www.vuurtorens.org/vuurtorenoverzicht-ameland/).
- [NVV/Peter Kouwenhoven, beschrijving juni 2023](https://www.vuurtorens.org/wp-content/uploads/2023/08/De-vuurtoren-van-Ameland-juni-2023.pdf).
- [Schuine foto Ameland-site](https://www.ameland-site.nl/een-adembenemend-uitzicht-vanaf-de-bornrif).
- Depositphotos/Melanie Lemahieu, aerial view Ameland lighthouse 214991400: uitsluitend visuele referentie, geen geometrie of afbeelding overgenomen.

Eigen vereenvoudigde geometrie; bronfoto's niet meegeleverd.
