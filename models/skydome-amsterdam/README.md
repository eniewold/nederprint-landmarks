# Skydome (Amsterdam)

Vereenvoudigd, printbaar model van de Skydome aan de KNSM-laan op het KNSM-eiland (Wiel Arets, 1994–1996), een woontoren van 22 lagen en circa 62 m die het enige hoge punt van het Oostelijk Havengebied is. De toren bestaat uit vier verticale volumes van gelijke hoogte; in de west-, zuid- en oostgevel scheiden diepe sleuven ze, met daarin per laag een kubusvormig balkon van staalgaas. De noordgevel heeft geen sleuven en knikt in het midden. De gevels van antracietgrijze betonpanelen hebben per laag loggia's en raambanden. De toren staat op het dek van een half verdiepte parkeergarage.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `skydome-amsterdam.glb` | Model in meters, Y omhoog, één node: `building:skydome-amsterdam` |
| `skydome-amsterdam.json` | Catalogusitem |
| `skydome-amsterdam-1-1000.stl` | Los te printen op 1:1000 (40 × 24 × 65 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[124655.0, 487818.0]`, in het hart van de BAG-contour. De X-as loopt langs de zuidgevels naar het oosten, 2,6° op RD-oost (de BAG-randen liggen tussen 2,4 en 2,9°); Y wijst naar het noorden. Lokaal z = 0 is NAP +1,7 m, de straat (KNSM-laan) en de kade; `groundHeight` is 44,7 m (NAP + 42,98, NLGEO2018 geijkt op Havengebouw en Bercylaan), `groundOffsetMetres` −0,2. `groundSamplePoints` liggen op de KNSM-laan en de kade, buiten het parkeerdek (NAP +3,3 m) dat om de toren ligt; dat dek is geen BAG-pand en zit niet in het model.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren, vier volumes (pand `0363100012126867`) | BAG-contour, 39,8 × 24 m | +63,78 m | 3D BAG, 70e percentiel van het dak (AHN5 2023); AHN-DSM p70 63,80 |
| Sleuven west en oost | 1,4 m breed, 1,8 m diep | volle hoogte | BAG, AHN-DSM (dak open boven de sleuf) |
| Sleuf zuidwest | 1,6 m breed, 5,0 m diep | volle hoogte | BAG, AHN-DSM |
| Sleuf zuidoost | 1,4 m breed, 1,8 m diep | volle hoogte | BAG, AHN-DSM |
| Liftopbouw | 5,5 × 3,6 m | +65,27 m | 3D BAG-dakvlak (65,25), AHN-DSM |
| Ventilatiekappen | vijf, circa 1 × 1,5 m | +65,9 m | AHN-DSM (65,9–66,0), orthofoto |
| Begane grond | glazen pui 0,5 m terug | dek +3,3 tot +6,3 m | AHN-DTM (dek), foto's |
| Kubusbalkons | per sleuf 20 stuks, sleufbreed, 1,2 m diep, 1,5 m hoog | tweede tot bovenste woonlaag | foto's |

Gevelreliëf (blinde nissen met een plafond onder 45°, vanaf de tweede verdieping; de eerste verdieping heeft geen ramen):

- loggia's, 0,6 m diep, borstwering 1,0 m: westkop en oostkop van het noordvolume, oosthelft van de zuidgevel van het westvolume, westhelft van de zuidgevel van het zuidvolume, de westgevel van het zuidvolume buiten de sleuf en de zuidgevel van het oostvolume;
- raambanden, 0,35 m diep: beide vlakken van de noordgevel, westhelft van de zuidgevel van het westvolume, oosthelft van de zuidgevel van het zuidvolume;
- vensterkolommen naast de sleuven: 1,0 m breed op de westgevel van het westvolume, 2,6 m breed op de oostgevel van het oostvolume.

De kubusbalkons hebben een onderkant als spitsboog onder 45° tussen de sleufwanden en printen zo zonder steun.

## Geschat en weggelaten

- Verdiepingshoogte: begane grond 3,3 m op het dek, daarboven 21 lagen van 2,7 m tot onder de dakrand (22 bouwlagen volgens Wikipedia).
- De verdeling van loggia's, raambanden en vensterkolommen per gevel is uit foto's afgeleid; welke foto welke gevel toont is niet overal zeker, vooral bij de zuidgevels.
- Plaats, maat en vorm van de kubusbalkons (in de monding van de sleuf, 1,2 m diep) zijn geschat; in werkelijkheid zijn het open kooien van staalgaas.
- Weggelaten: de dakrand (circa 0,6 m hoog en dunner dan 0,9 m), de 2 × 2 m-reliëfpanelen van de gevel en de balkonhekken (kleiner dan 0,9 m), en het parkeerdek met de golvende bestrating (geen BAG-pand; in het AHN-DTM maaiveld op NAP +3,3 m).

## Controle

`node scripts/generate-skydome-amsterdam.mjs` geeft `NoError`, genus 80 (de balkons tussen de sleufwanden) en één gesloten deel. In de webshop controleert de test de dakhoogte, de liftopbouw en een ventilatiekap, dat de zuidwestelijke sleuf na de printcorrectie op 45° zijn open ladder van balkons houdt en een loggia 0,6 m diep blijft, dat de printcorrectie het volume met minder dan 1 % laat groeien, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0363100012126867` (bouwjaar 1995); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, AHN5 2023).
- [Skydome (Amsterdam)](https://nl.wikipedia.org/wiki/Skydome_(Amsterdam)) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [Skydome (03)](https://commons.wikimedia.org/wiki/File:2023_Amsterdam,_KNSM-eiland,_Skydome_(03).jpg), [Skydome (10)](https://commons.wikimedia.org/wiki/File:2023_Amsterdam,_KNSM-eiland,_Skydome_(10).jpg), [Skydome (13)](https://commons.wikimedia.org/wiki/File:2023_Amsterdam,_KNSM-eiland,_Skydome_(13).jpg), [Skydome (1)](https://commons.wikimedia.org/wiki/File:Skydome_(1).jpg).
