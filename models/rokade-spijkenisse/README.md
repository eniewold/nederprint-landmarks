# De Rokade (Spijkenisse)

Vereenvoudigd, printbaar model van De Rokade aan de Hongerlandsedijk in Spijkenisse (woontoren, 2010, Klunder Architecten): een toren van 33 lagen met een zwarte en een witte helft op een plint van zes lagen met parkeren en daarboven de evenementendekken. De toren heeft een plattegrond als parallellogram: de lange gevels liggen in de lijn van de plint, de kopgevels lopen schuin. Tussen de twee helften loopt een inspringende naad met gekleurde balkonpanelen; op het dak staan een installatiekast en een mastkroon.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `rokade-spijkenisse.glb` | Model in meters, Y omhoog, één node `building:rokade-spijkenisse` |
| `rokade-spijkenisse.json` | Catalogusitem |
| `rokade-spijkenisse-1-1000.stl` | Los te printen op 1:1000 (106 × 23 × 115 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[83005.63, 429862.36]`, het hart van de BAG-contour. De lokale X-as loopt langs de lange gevels naar het zuidoosten, −50,4° op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y wijst naar het noordoosten (de Hongerlandsedijk). Lokaal z = 0 is NAP +5,6 m, het maaiveld aan de zuidwestkant; de dijk aan de noordoostkant ligt op +8,5 m. `groundSamplePoints` liggen daarom aan de zuidwestkant, `groundHeight` is 49,3 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Plint | BAG-contour 103,3 × 22,5 m, met de kleine uitbouwen aan de koppen en de inham bij de entree | +27,9 m | BAG, AHN-DSM (27,8–28,0) |
| Toren | parallellogram, 40,0 m langs de gevel, 22,5 m diep, kopgevels onder 55° | +110,3 m | AHN-DSM (dakranden bij v = −10…10, dak 110,2–110,4) |
| Naad tussen de helften | 3,0 m breed, 1,2 m diep, in beide lange gevels | plint tot dak | foto's |
| Installatiekast | 3,6 × 8,4 m | +114,4 m | AHN-DSM |
| Mastkroon | 3,6 × 4,8 m | +120,0 m | AHN-DSM (116–122), foto's |

Gevelreliëf: in de lange torengevels vensters per travee van 2,7 m (1,4 m breed), in de noordwestelijke (zwarte) kopgevel loggia's van 3,2 m en in de zuidoostelijke (witte) kopgevel een doorlopende glasband per laag; in de naad een balkonband per laag. De plint heeft vensters op de vijf woonlagen en winkelpuien op de begane grond. Alle nissen zijn 0,35 m diep met een plafond onder 45°.

## Geschat en weggelaten

- De vorm van de toren komt uit de dakranden in het AHN-DSM; de BAG geeft alleen de rechthoek van de plint.
- Verdiepingshoogtes: plint begane grond 4,6 m en vijf lagen van 3,56 m, toren 27 lagen van 3,05 m (33 lagen in totaal volgens Wikipedia).
- De naad, de kopgevels en het vensterstramien zijn op foto's geschat. De gevel is in werkelijkheid zwart en wit; het model heeft één kleur.
- De mastkroon is een open stalen frame en is als dicht blok gemodelleerd.
- Weggelaten: de tuinen, bomen en bruggen op de evenementendekken en de losse balkons aan de hoek van de zwarte helft (kleiner dan 0,9 m of niet uit de foto's te maten). De naastgelegen torens (BAG-panden 0612100000039418 en 0612100000040014) zijn aparte panden en horen niet bij dit model.

## Controle

`node scripts/generate-rokade-spijkenisse.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de daken van plint, toren, installatiekast en kroon, de schuine kopgevels, de diepte van de naad, dat de vensternissen na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0612100000000569` (bouwjaar 2010); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Wikipedia: De Rokade (Spijkenisse)](https://nl.wikipedia.org/wiki/De_Rokade_(Spijkenisse)).
- Foto's op Wikimedia Commons (niet meegeleverd): [zwarte en witte helft](https://commons.wikimedia.org/wiki/File:Spijkenisse_DSCF1949.JPG), [vanaf de Oude Maas](https://commons.wikimedia.org/wiki/File:Hooge_flats_kant_oude_maas_Spijkenisse.jpg), [met De Vier Werelden](https://commons.wikimedia.org/wiki/File:Vier_Werelden_en_De_Rokade_Spijkenisse_2016.jpg), [vanaf De Stoep](https://commons.wikimedia.org/wiki/File:Spijkenisse_uitzicht_De_Stoep_richting_De_Elementen_2013.jpg).
