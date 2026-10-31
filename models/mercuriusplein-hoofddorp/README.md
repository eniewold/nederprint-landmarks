# Pharos (Hoofddorp)

Vereenvoudigd, printbaar model van Pharos, de kantoortoren aan het Mercuriusplein naast station Hoofddorp (2003, Kohn Pedersen Fox). De toren is een wig van 19 lagen met een rechte noordwestgevel en een cirkelvormige zuidgevel die op een zuilengalerij boven een vijver staat; boven het dak loopt de gebogen gevel door als kroon rond een installatiezone onder een stalen kader. Uit de toren loopt een lensvormige laagbouw van vijf lagen naar het noordoosten, met een rechte zuidoostgevel en een flauw gebogen noordwestgevel; de kop kraagt aan de zuidoostkant 6 m uit boven een gang op kolommen. Tussen toren en laagbouw liggen een hoger blok en een lagere hal met een patio. Alle gevels hebben doorlopende lintramen per laag.

De taak noemde het gebouw "Kantoortoren Mercuriusplein"; de naam is Pharos (Mercuriusplein 1).

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `mercuriusplein-hoofddorp.glb` | Model in meters, Y omhoog, één node: `building:mercuriusplein-hoofddorp-pharos` |
| `mercuriusplein-hoofddorp.json` | Catalogusitem |
| `mercuriusplein-hoofddorp-1-1000.stl` | Los te printen op 1:1000 (127 × 33 × 83 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[107950.0, 478590.0]`, midden in de BAG-contour. De X-as loopt langs de rechte noordwestgevel naar het noordoosten (48,0° op RD-oost; de BAG-randen liggen op 47,93–48,02°), de Y-as haaks erop naar het noordwesten. Lokaal z = 0 is NAP −5,0 m, het maaiveld aan de zuid- en oostkant (3D BAG −5,02; AHN-DTM −5,0); de weg langs de noordwestgevel ligt 2 tot 3 m hoger. `groundHeight` is 38,15 m (NAP −5,0 plus de geoïdehoogte 43,15 m uit NLGEO2018), `groundOffsetMetres` −0,15, en `groundSamplePoints` liggen op het plein aan de zuidoostkant, zodat de vijver en de verdiepte toegangen bij de toren het model niet laten zakken.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | wig, rechte noordwestgevel 32 m, zuidgevel cirkelboog met straal 67,04 m | +69,7 m | BAG (boog door de BAG-punten, afwijking < 5 cm), 3D BAG 69,63–69,70, AHN-DSM 70 |
| Kroonzone | toren ten zuiden van een lijn 8,4 m achter de noordwestgevel | +76,6 m | 3D BAG 76,53–76,70, AHN-DSM 76–77 |
| Kroonrand | 1,2 m breed langs de gebogen gevel, de westpunt en de oostgevel | +77,3 m | 3D BAG 77,27–77,33 |
| Zuilengalerij | begane grond 4 m teruggezet, plafond tot +2,5 m met een kraag onder 45°, zes ronde kolommen van 1,2 m | tot +2,5 m | foto's (Commons); diepte en hoogte geschat |
| Erker | houten kast tussen twee kolommen, 5 × 2,8 m | tot +0,5 m | foto (Commons), maten geschat |
| Laagbouw | lens: rechte zuidoostgevel, noordwestgevel cirkelboog met straal 178,9 m | +20,6 m | BAG, 3D BAG 20,60–20,71, AHN-DSM 20,5–20,6 |
| Uitkragende kop | verdiepingen 6,25 m voorbij de teruggezette begane grond, kraag onder 45°, drie kolommen van 1,0 m | onderkant +2,5 m | BAG (begane grond), AHN-DSM (dakrand), kolommen geschat |
| Hoger blok | 8,5 × 17 m naast de toren | +25,55 m | AHN-DSM (randen), 3D BAG 25,50–25,65 (hoogte) |
| Hal | 7,5 × 7,3 m tussen toren en blok | +16,5 m | AHN-DSM 16–17 |
| Patio | 5,7 × 5,8 m met ronde daklichten (ortho) | +3,5 m | AHN-DSM 3–4 |
| Lijst | 1,4 m uit de hele noordwestgevel, 1,0 m dik, kraag onder 45° | +21,3 m | AHN-DSM 21,3–21,4 buiten de gevel |
| Luifel | 2,7 m uit de noordwestgevel, 1,5 m dik, kraag onder 45° | +1,4 m | AHN-DSM 1,4 op 1,5–2,5 m buiten de gevel |
| Installaties op de laagbouw | zes kasten, 1,0–6,4 m breed | +21,85 tot +23,3 m | 3D BAG LoD2.2 (AHN5 2023; niet in het AHN4) |

Gevelreliëf: per laag een doorlopende raamband als blinde nis van 0,35 m met een plafond onder 45° (borstwering 1,2 m, latei 0,5 m), op alle gevels waar de gevel buitengevel is, ook in de kroon (twee banden); de begane grond aan de zuidoostgevel heeft één hoge glasband. Begane grond 7,5 m, daarboven 19 lagen van 3,537 m tot het torendak.

## Geschat en weggelaten

- Verdiepingshoogte, raambanden, de hoogte (+2,5 m) en diepte (4 m) van de zuilengalerij, het aantal en de plaats van de kolommen, en de erker zijn geschat uit twee foto's van de zuidgevel; van de noordwest- en oostkant zijn geen bruikbare foto's gevonden.
- De kroonzone is een stalen kader boven installaties; het AHN ziet het als een vrijwel dicht vlak op 76–77 m en het is als dicht blok gemodelleerd. De installaties eronder (+72,6 tot +76,2) zitten daarin.
- Het hogere blok: het AHN4-DSM en de 3D BAG verschillen 2,5 m in de ligging (zelfde breedte); het model volgt het DSM, dat bij de ortho past.
- De kolommen onder de uitkragende kop zijn aangenomen (zoals bij de toren); het DSM laat onder de rand alleen losse lage punten zien.
- De luifel langs de noordwestgevel is uit het DSM afgeleid (een strook op +1,4 m, 3,4 m boven de weg); wat het precies is, is niet op een foto gezien.
- Weggelaten: de antennemast op het torendak (dunner dan 0,9 m), het stalen vakwerk van de kroon, de ventilatoren op het hogere blok en de ronde daklichten in de patio (kleiner dan 0,9 m), de punt van de BAG-contour voorbij de kop (u > 63,6 m; ligt in het DSM op maaiveld), en de vijver en de verhoogde stoep aan de zuidoostkant (terrein, zit in het PDOK-maaiveld).
- Niet in dit pand: de lage overkapping (+2 m) en de wand (+13 tot +16 m) ten zuiden van de hal; de Zuidtoren aan de Taurusavenue (pand `0394100000242103`) staat 200 m verder aan de andere kant van het spoor en raakt dit model niet.

## Controle

`node scripts/generate-mercuriusplein-hoofddorp.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de daken van toren, kroon, kroonrand, laagbouw, blok, hal, patio, lijst en installaties, dat de zuilengalerij, de gang onder de kop en een raamband na de printcorrectie op 45° open blijven, dat het volume daarbij minder dan 1 % groeit, en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0394100000242475` (bouwjaar 2003, Mercuriusplein 1–23); actuele orthoHR; AHN-DSM en -DTM 0,5 m (AHN4); 3D BAG LoD2.2 (AHN5 2023).
- [BAG-viewer van het pand](https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0394100000242475).
- [Pharos op SkyscraperPage](https://skyscraperpage.com/b5526) en [CTBUH Skyscraper Center](https://www.skyscrapercenter.com/building/pharos/6660) (naam, architect, circa 80 m).
- Foto's op Wikimedia Commons (niet meegeleverd): [pic1](https://commons.wikimedia.org/wiki/File:Pharos_toren,_Van_Heuven-Goedhartlaan_pic1.jpg), [pic2](https://commons.wikimedia.org/wiki/File:Pharos_toren,_Van_Heuven-Goedhartlaan_pic2.jpg).
