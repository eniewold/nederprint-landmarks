# Watertoren Groenendaal (Heemstede)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:100. Generator: `scripts/generate-watertoren-groenendaal-heemstede.mjs`; uitvoeren met Node vanuit nederprint-landmarks met `--scale 100`. Geen hoogteplakken: het pomphuis is een prisma op de BAG-contour met twee dakvlakken als planvergelijking, de ruïnemuur en de nissen zijn convexe bouwdelen.

De Wikipedia-lijst van watertorens in Noord-Holland noemt "Groenendaal (Heemstede)" zonder plaats, jaar of maten. Het enige waterbouwwerk met die naam in het wandelbos Groenendaal is de ruïne van het pomphuis van de buitenplaats Meer en Berg, die in 1948 met Groenendaal is samengevoegd: rijksmonument 529181 ("BY Glipper Dreef 199", onderdeel 7 van complex 522623 Meer en Berg/Mariënheuvel), gebouwd in of kort na 1730 om de vijf fonteinen in de Marot-aanleg van waterdruk te voorzien. Het register van het complex noemt het restant "de watertoren die hierbij de benodigde druk leverde", foto's op Commons heten "Ruine van Groenendaal park". Volgens het register een rechthoekig bouwdeel van één hoge bouwlaag met een zadeldak tussen topgevels; sinds 1951 in gebruik bij de scouting.

## Bestanden

- `watertoren-groenendaal-heemstede.glb`: één node `building:pomphuis-met-zadeldak-en-ruinemuur`, op het maaiveld.
- `watertoren-groenendaal-heemstede.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-groenendaal-heemstede-1-100.stl`: alles samen op 1:100.

## Oorsprong en oriëntatie

RD-oorsprong [102253.47, 483091.11] (52,33322 N, 4,61334 O), het hart van het pomphuis, op maaiveld (AHN-DTM NAP +0,27 tot +0,74; gebruikt +0,55). Lokale +X loopt langs de nok naar het zuidoosten, evenwijdig aan de noordoostgevel van de BAG-contour (`xAxis` [0.71059, -0.7036], RD -44,7 graden); +Y is de normaal van de noordoostgevel. `groundHeight` 43,59 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de acht `groundSamplePoints` rond het pand (43,59 tot 43,79). Het model vervangt BAG-pand 0397100000001033 (bouwjaar 1730); er staan geen andere PDOK-panden binnen 20 m.

## Onderdeel `building:pomphuis-met-zadeldak-en-ruinemuur`

- Pomphuis op de BAG/BGT-contour: noordwesttopgevel 8,86 m, noordoostgevel 7,16 m, zuidwestgevel 10,0 m en een scheve zuidoosttopgevel (het AHN-DSM loopt daar mee).
- Zadeldak met de nok in het midden op 10,65 m (AHN-DSM NAP +11,1 tot +11,2), twee vlakken met helling 0,78 (38 graden), goot op 7,19 m.
- Schoorsteen van 1,0 x 1,0 m op het zuidwestvlak bij de zuidoostgevel, tot 11,45 m (luchtfoto 2021 en 2025, foto van de zuidwestgevel).
- Blinde nissen van 0,35 m met een plafond dat onder 56 graden naar binnen oploopt: de grote boogpoort in de noordoostgevel bij de noordhoek (2,5 m breed, spitse top op 5,0 m), in de noordwesttopgevel de deur (1,1 m, spitse top), het venster erboven (spitse top) en de luikdeur bij het balkonnetje, in de zuidwestgevel het grote venster hoog in het midden en het getraliede venster bij de zuidhoek.
- Ruïnemuur van 0,9 m in het verlengde van de zuidwestgevel, 6 m naar het noordwesten: de eerste 2 m op 7,0 m met een vlakke kruin, dan aflopend tot 1,8 m op 4 m en daarna laag (luchtfoto's 2021, 2022 en 2025 zonder blad, gat in het AHN-DTM tot 5,5 à 6 m, foto's van de topgevel en de zuidwestgevel).

## Bronnen en maten

- [Rijksmonumentenregister 529181](https://monumentenregister.cultureelerfgoed.nl/monumenten/529181): ruïne van het pomphuis, 1730 of kort daarna, rechthoekig bouwdeel van één hoge bouwlaag met zadeldak tussen topgevels.
- [Monument 522629 (Meer en Berg)](https://www.monumenten.nl/monument/522629): de watertoren die de druk voor de fonteinen leverde is als ruïne bewaard.
- [Lijst van watertorens in Noord-Holland](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Noord-Holland): "Groenendaal (Heemstede)", maten onbekend.
- BAG/BGT-pand 0397100000001033 (BGT G0397.41cdc9b35ac6466a9258668df3ee4949, PDOK, 2026-11-04): plattegrond.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld, goot, nok en helling in het stelsel langs de nok; gaten in het DTM voor de ruïnemuur. Luchtfoto's 2021 tot en met 2025 voor schoorsteen en ruïnemuur.
- Foto's op Wikimedia Commons: "Ruine van Groenendaal park" en "Newcomen steam engine at landgoed groenedaal (2)" (noordwesttopgevel met deur, venster en luikdeur, noordoostgevel met boogpoort, kop van de ruïnemuur), "Newcomen steam engine at landgoed groenedaal (3)" (zuidwestgevel met vensters, schoorsteen en aflopende ruïnemuur).

## Geschat en weggelaten

Geschat: de plaats en maten van de nissen en de schoorsteen uit schuine foto's, met de goot (7,19 m) en de gevelbreedtes als schaal; het verloop van de ruïnemuur (hoogte naast de westhoek, waar hij afloopt, het lage deel op 1,8 m) uit foto's en de luchtfoto's; de dikte van de muur (0,9 m, de printmaat). De identificatie als "Watertoren Groenendaal" volgt uit het register van Meer en Berg; de Wikipedia-lijst geeft geen plaats.

Weggelaten: het stalen balkonnetje en de regenpijp aan de noordwesttopgevel, de kleine kelderopening in de zuidwestgevel en de afzonderlijke rookkanalen op de schoorsteen (kleiner dan 0,9 m); de zuidoosttopgevel zonder openingen, omdat geen foto hem toont. Een object van zo'n 3 x 3 m 9 m voor de noordwestgevel (gat in het AHN-DTM, lichte vlek op de luchtfoto's 2021 en 2022, onder de boomkruinen) is niet gemodelleerd: geen foto toont er een muur, het kan een scoutingopslag zijn.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: dak en muurkruin zijn bovenvlakken, nisplafonds lopen onder 56 graden op en spitse nistoppen onder 50 graden. Via `createModelBundle` op een uitsnede van 80 m (1:1000) staat het model compleet op het PDOK-maaiveld (voet 0,2 tot 0,5 m in het terrein) en is het PDOK-pand verdwenen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de BAG-contour met een glad zadeldak) de boogpoort in de noordoostgevel, de deur, het venster en de luikdeur in de noordwesttopgevel, de vensters in de zuidwestgevel, de schoorsteen en de aflopende ruïnemuur.

Controle-URL: http://localhost:3000/kaart/52.33322/4.61334/200/1x1/0
