# Europlaza (Amsterdam)

Vereenvoudigd, printbaar model van Europlaza aan de Hoogoorddreef in Amsterdam-Zuidoost (1991–1992, ZZ+P), de kantoortoren aan het water naast station Bijlmer ArenA en AFAS Live. De plattegrond is een vierkant van circa 31 × 31 m dat diagonaal is gedeeld: de noordwestelijke driehoek is een hoge natuurstenen schijf met in de spitse zuidwestpunt twee kolommen ronde vensters, de zuidoostelijke helft een getrapt blok met lintvensters, een loggialaag met kolommen en een teruggezette glazen opbouw.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `europlaza-amsterdam.glb` | Model in meters, Y omhoog, één node `building:europlaza-amsterdam` |
| `europlaza-amsterdam.json` | Catalogusitem |
| `europlaza-amsterdam-1-1000.stl` | Los te printen op 1:1000 (40 × 36 × 60 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[124915.0, 480455.0]`, midden in het vierkant. De lokale X-as loopt langs de zuidgevel naar het oostzuidoosten (−16,1° op RD-oost; de BAG-randen zijn binnen 0,2° evenwijdig of haaks), Y haaks erop naar het noordnoordoosten. In dit stelsel loopt de diagonaal tussen schijf en blok onder 45°. Lokaal z = 0 is NAP −1,9 m, het plein aan de oostkant (3D BAG −1,91, AHN-DTM −1,76 tot −1,91); `groundHeight` is 41,1 m (ellipsoïdisch, NAP + 43,0) en `groundOffsetMetres` −0,2. Aan de west- en noordkant ligt water, daarom bemonsteren `groundSamplePoints` alleen het plein aan de oostkant.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf (driehoek, rechte hoek in het noordwesten) | rechthoekszijden 30,8 m | +55,68 m | BAG, 3D BAG 55,67, AHN-DSM 55,69 |
| Installatiestroken op de schijf | 2,3 × 10,3 m langs de westrand, 1,9 × 11 m evenwijdig aan de diagonaal | +57,52 m | 3D BAG, AHN-DSM 57,5–57,6, luchtfoto |
| Onderste blok (negen lagen) | 30,9 × 30,9 m min de schijf; oostelijke strook 7,3 m breed | +28,39 m | BAG, 3D BAG 28,4, AHN-DSM 28,39 |
| Dakkast op de oostelijke strook | 2,2 × 2,7 m | +30,8 m | luchtfoto, AHN-DSM 30,7–30,9 |
| Bovenste blok (loggialaag en vijf lagen) | tot 13,55 m van het hart naar het oosten | +48,17 m | 3D BAG 48,15, AHN-DSM 48,18 |
| Glazen opbouw | 2,2 m teruggezet van zuid- en oostgevel | +51,5 m | 3D BAG, AHN-DSM 51,5 |
| Naden tussen schijf en blok | 2,4 m diep, aan beide uiteinden van de diagonaal | volle hoogte | BAG-contour, foto |

Gevelreliëf: begane grond 4,0 m, daarboven lagen van 3,29 m (laag 8 eindigt op het dak van de oostelijke strook, laag 14 op het bovenste blok). Per laag een lintvenster van 1,35 m als blinde nis van 0,35 m met een plafond onder 45°, met 0,95 m dicht aan de hoeken; de begane grond als hoge glasband. De loggialaag (laag 9) op de zuid- en oostgevel van het bovenste blok is 1,0 m diep achter kolommen van circa 1 m op circa 7,1 m. De glazen opbouw heeft één band rondom. In de spitse zuidwestpunt van de schijf zitten twee kolommen ronde vensters van 1,3 m (lagen 1–13) als achthoekige nissen met de bovenkant onder 45°; daarboven een dichte attiek.

## Geschat en weggelaten

- Naam: de opdracht noemde het pand "Dreeftoren"; die naam hoort bij een ander pand (`0363100012139556`, Haaksbergweg, naast de Dreef Live Tower). BAG-pand `0363100012088788` (Hoogoorddreef 54–58) is Europlaza.
- Verdiepingshoogte, hoogte van de lintvensters, de loggiadiepte en de kolomafstand zijn geschat (kolommen uit één foto).
- De gevels aan het water (west en noord) staan op geen bruikbare foto; ze hebben hier dezelfde lintvensters als het blok. Ook de ingang en de begane grond aan de oostkant zijn niet op een foto nagekeken.
- Weggelaten: de vakwerkmast op de schijf, de dakhekken en de letters "EUROPLAZA" (kleiner dan 0,9 m), het natuurstenen voegenraster (reliëf onder 0,3 m) en de overdekte loopbrug naar het lage buurpand in het zuiden (geen deel van dit BAG-pand). Het lage buurpand `0363100012150150` zit niet in het model.

## Controle

`node scripts/generate-europlaza-amsterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de dakhoogtes van schijf, installaties, opbouw, bovenste blok, oostelijke strook en dakkast, dat de loggia en een lintvenster na de printcorrectie op 45° hun diepte houden, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto gelegd.

## Bronnen

- PDOK BAG, pand `0363100012088788` (bouwjaar 1991); 3D BAG LoD2.2 (AHN5, 2023); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [PSS-archi: Europlaza](https://www.pss-archi.eu/immeubles/NL-363-68916.html) (naam, architect, 15 bouwlagen boven de begane grond).
- Foto op Wikimedia Commons (niet meegeleverd): [Europlaza Amsterdam](https://commons.wikimedia.org/wiki/File:Europlaza_Amsterdam.jpg).
