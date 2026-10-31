# Toren van Siza (Maastricht)

Vereenvoudigd, printbaar model van de Toren van Siza (Álvaro Siza Vieira met A+D+P Architecten, 2001) op de kop van de Avenue Céramique, aan het Plein 1992 bij de Hoge Brug. De woontoren van 17 lagen bestaat uit twee verticale volumes die ten opzichte van elkaar gedraaid zijn: west een volume met zinken gevels op een witmarmeren sokkel, oost een volume van wit Thassos-marmer op een sokkel van grijze hardsteen, met één laag minder en daarop het dakterras. In de nissen tussen de volumes staat glas over de volle hoogte; in de noordoosthoek steekt het trappenhuis boven alles uit.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `toren-van-siza.glb` | Model in meters, Y omhoog, één node `building:toren-van-siza` |
| `toren-van-siza.json` | Catalogusitem |
| `toren-van-siza-1-1000.stl` | Los te printen op 1:1000 (28 × 26 × 56 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[177158.37, 317457.0]`, het zwaartepunt van de BAG-contour. De X-as loopt langs de gemeenschappelijke zuidgevel van beide volumes (−3,9° op RD-oost; de BAG-randen liggen op −3,93° en −3,86°), de Y-as haaks erop naar het noorden. Het zinken volume staat op −7,8°, het witte op +11°; hun gevels volgen de BAG-contour. Lokaal z = 0 is NAP +48,1 m, het maaiveld aan de noordkant (AHN-DTM 47,9–48,3; 3D BAG-maaiveld 48,08); het plein aan de zuidkant ligt op +49,0 en de straat aan de oostkant op +49,15. `groundSamplePoints` liggen op de stoep aan de noordkant, buiten de hellingbaan naar de parkeergarage (NAP +46,2) in het noordoosten. `groundHeight` is 93,95 m: NAP +48,1 plus 45,85 m, de NLGEO2018-geoïde ter plekke (45,745) plus 0,1 m, zoals bij de landmarkmodellen van de Maastrichtse Maasbruggen (PDOK-Maas 89,8–89,9 bij NAP +44,0, geoïde + 0,05 tot 0,15). `groundOffsetMetres` is −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Zinken volume (west) en middenstuk | BAG-contour, zinken volume 10,6 × 23,8 m | +98,97 m | 3D BAG LoD2.2 (98,95–98,99), AHN-DSM-mediaan 98,97 |
| Dakrand zinken volume | 0,9 m breed rondom | +99,9 m | 3D BAG (99,87–99,90), foto |
| Uitsparing in de westgevel | 7,8 × 3,5 m, 5,3 m vanaf de zuidwesthoek | +95,7 m | 3D BAG (95,60–95,84), AHN-DSM, foto |
| Uitkragende dakrand boven de uitsparing | 2,1 m over de uitsparing, 2,2 m breed | +99,9 m | 3D BAG (99,87), foto |
| Liftopbouw | 2,3 × 3,5 m | +102,9 m | 3D BAG (102,58–103,0) |
| Leidingkoker | 1,0 × 8 m | +101,2 m | AHN-DSM (100,9–101,7), ortho |
| Dakterras op het witte volume en de zuidelijke nis | BAG-contour tot het middenstuk, met een strook langs de oostgevel | +95,7 m | 3D BAG (95,68–95,78), AHN-DSM |
| Borstwering dakterras | 0,9 m breed (boven de glazen nis tot +96,6) | +97,8 m | foto (1,2 m onder de zinken dakrand) |
| Trappenhuis noordoost | BAG-contour, circa 8 × 7 m | +102,7 m | 3D BAG (102,64–102,79) |
| Luifel zinken volume | langs de zuidgevel, 1,5 m uit de gevel, tot 1 m in de nis | bovenkant +55,3 m | foto |
| Luifel wit volume | rond de zuidoosthoek en over de zuidelijke nis, 1,8 m uit de gevel | bovenkant +53,5 m | foto |

Gevelreliëf (blinde nissen met een plafond onder 45°; vensters 0,35 m diep, loggia's 0,9 m, hoekloggia's 1,2 m):

- Zinken volume: 15 woonlagen van 2,80 m vanaf +57,3 m boven een sokkel van twee lagen; zuidgevel per laag een venster van 3,7 m en een loggia van 2,9 m; westgevel drie vensters, een loggia en een venster per laag; noordgevel vier vensters per laag. In de sokkel hoge glazen puien op de zuid-, west- en noordgevel.
- Wit volume: 15 lagen van 2,89 m vanaf +53,7 m; zuidgevel per laag een hoekloggia van 3,9 m die de zuidwesthoek uitsnijdt (open naar zuid en west) en een venster van 3,8 m; westgevel in de nis een smal venster per laag; oostgevel drie vensters per laag en aan de noordkant een loggiakolom.
- Trappenhuis: loggia's op de zuidkant van de sprong in de oostgevel en twee boven het dak; één klein venster per laag op de noordgevel.
- Glazen nissen tussen de volumes (zuid en noord): per laag een glasvlak achter een vloerrand van 0,9 m.

## Geschat en weggelaten

- De naam klopt met de opdracht en Wikipedia (Toren van Siza, Avenue Céramique 22–40); het BAG-pand (bouwjaar 2001, wonen en kantoor) is dit gebouw. Wikipedia geeft 54 m tot de top; de 3D BAG geeft 50,9 m tot het dak (70e percentiel), 54,6 m tot het trappenhuis en 55,8 m tot de hoogste installatie. Een aparte "kroon" heeft de toren niet: wat boven het silhouet uitsteekt zijn het trappenhuis, de liftopbouw en de uitgesneden zinken dakrand.
- Geschat uit foto's: de laaghoogtes (2,80 en 2,89 m) en de hoogte van de sokkels, de plaats en maat van vensters en loggia's per gevel, de hoogte van de borstwering rond het dakterras, de luifels (hoogte, uitsteek) en de diepte en lengte van de uitsparing in de westgevel (het DSM toont 1 tot 4,5 m; als rechthoek van 3,5 m).
- Luifels en borstwering zijn dikker dan in het echt (platen van 0,4–0,5 m en een borstwering van ca. 0,3 m): de luifels als band van 1,5 m met een kraag onder 45°, de borstwering 0,9 m breed. De uitkragende dakrand boven de uitsparing heeft een ondervlak onder 45° in plaats van een vlakke onderkant.
- Weggelaten: de glazen liftschacht in de noordelijke nis (glas met stenen stijlen van ca. 0,6 m; het DSM ziet erdoorheen, bovenkant niet meetbaar), de hekken van balkons, loggia's en dakterras, de zonneschermen, de antenne en de roosters op de liftopbouw (kleiner dan 0,9 m), de dakrand van ca. 0,3 m op het trappenhuis en de kleine kasten van 0,9 m hoog op het zinken dak.

## Controle

`node scripts/generate-toren-van-siza.mjs` geeft `NoError`, genus 1 (de luifel over de zuidelijke nis) en één gesloten deel met 320 nissen. In de webshop controleert de test in `tests/landmark-models.test.ts` de dakhoogtes (zinken dak, dakrand, dakterras, trappenhuis, liftopbouw, uitsparing en uitkragende rand), dat een zinken loggia en een hoekloggia van het witte volume na de printcorrectie op 45° open blijven, dat de print minder dan 1 % groeit, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0935100000023758` (bouwjaar 2001); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (puntwolk AHN5 2024).
- NLGEO2018-geoïde voor de maaiveldoffset.
- [Toren van Siza](https://nl.wikipedia.org/wiki/Toren_van_Siza) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [categorie Toren van Siza](https://commons.wikimedia.org/wiki/Category:Toren_van_Siza_(Maastricht)), onder meer [vanaf het plein](https://commons.wikimedia.org/wiki/File:Toren_van_Siza,_Maastricht-40468.jpg), [vanaf het zuidwesten](https://commons.wikimedia.org/wiki/File:Toren_van_Siza,_Maastricht-40464.jpg) en [vanaf het zuiden](https://commons.wikimedia.org/wiki/File:20150312_Maastricht;_Siza%27s_Tower.jpg).
