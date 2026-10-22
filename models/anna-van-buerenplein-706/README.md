# Kantoor Anna van Buerenplein (Den Haag)

Vereenvoudigd, printbaar model van het kantoorgebouw aan het Anna van Buerenplein bij Den Haag Centraal (2013), naast de Koninklijke Bibliotheek en onder de aanlanding van de RandstadRail: een toren van 19 lagen aan de oostzijde, een middenblok van 13 lagen met een glazen atriumkap, een lager blok van vier lagen aan de zuidzijde met een smalle strook naast de toren, en onder het viaduct een begane-grondvolume over de rest van de kavel. De gevels hebben een glasband per laag.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `anna-van-buerenplein-706.glb` | Model in meters, Y omhoog, één node `building:anna-van-buerenplein-706` |
| `anna-van-buerenplein-706.json` | Catalogusitem |
| `anna-van-buerenplein-706-1-1000.stl` | Los te printen op 1:1000 (55 × 43 × 74 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82256.63, 455350.73]`, het hart van de BAG-contour. De lokale X-as loopt langs de zuidgevel naar het noordoosten, 37,4° linksom op RD-oost (de BAG-randen zijn binnen 0,1° evenwijdig of haaks); +Y wijst naar het noordwesten. Lokaal z = 0 is NAP +0,8 m, het maaiveld rondom; `groundHeight` is 44,2 m (ellipsoïdisch, PDOK-terrein) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 18,6 × 42,6 m (oostelijk deel van de BAG-contour) | +72,0 m | AHN-DSM (71–73), PDOK (71,6) |
| Installatieopbouw | 6 × 5 m | +74,0 m | AHN-DSM |
| Middenblok | 20,7 × 18,3 m | +50,8 m | AHN-DSM (50–52), PDOK |
| Glazen atriumkap | 20,7 × 8,3 m, drie zaagtanden | +50,8 tot +53,3 m | PDOK (52,8–53,8); het AHN kijkt door het glas |
| Laag blok | 12 × 24,4 m | +17,0 m | AHN-DSM, PDOK |
| Strook naast de toren | 2,7 × 24,4 m | +13,0 m | AHN-DSM, PDOK |
| Begane-grondvolume | hele BAG-contour, 54,6 × 42,6 m | +4,0 m | PDOK (4,0–4,3); het AHN ziet daar het viaduct op +7 à 8 m |

Elke laag heeft een doorlopende glasband van 0,35 m diep met een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is.

## Geschat en weggelaten

- Naam nakijken: het gebouw staat niet in de Haagse hoogbouwlijst en heeft geen eigen Wikipedia-pagina. Een foto op Commons toont de Universiteit Leiden (University College The Hague) in een gebouw met dezelfde glasbanden aan het plein; of dat dit pand is, is niet bevestigd.
- De west- en zuidwestkant van de kavel ligt onder de aanlanding van de RandstadRail; het begane-grondvolume komt uit de PDOK-reconstructie, de hoogte onder het viaduct is niet te meten.
- Verdiepingshoogte (begane grond 4,6 m, daarboven 3,5 m) en de vorm van de atriumkap zijn geschat.
- Weggelaten: het viaduct zelf (geen onderdeel van het pand), luifels en dakranden kleiner dan 0,9 m.

## Controle

`node scripts/generate-anna-van-buerenplein-706.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de hoogtes van toren, opbouw, middenblok, atriumkap, laag blok, strook en begane-grondvolume, dat de glasbanden na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd en het model is op de kaart en in een preview-export op 1:1000 bekeken.

## Bronnen

- PDOK BAG, pand `0518100001643163` (bouwjaar 2013); actuele orthoHR; AHN-DSM en -DTM 0,5 m; PDOK 3D-gebouwtegel (LoD2.2).
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag).
- Foto's op Wikimedia Commons (niet meegeleverd): [Universiteit Leiden aan het plein](https://commons.wikimedia.org/wiki/File:Den_Haag_-_Universiteit_Leiden_(39835418041).jpg), [hoogbouw vanaf het Anna van Buerenplein](https://commons.wikimedia.org/wiki/File:Den_Haag,_hoogbouw_vanaf_het_Anna_van_Buerenplein_IMG_5984_2024-11-03_15.41.jpg).
