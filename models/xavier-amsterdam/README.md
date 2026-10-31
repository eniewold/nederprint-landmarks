# Xavier (Amsterdam)

Vereenvoudigd, printbaar model van Xavier (KENK architecten, 2016–2019), een woongebouw van 159 appartementen aan de Gustav Mahlerlaan op de Zuidas. Het complex is U-vormig: voorop een toren van 21 verdiepingen in donkere baksteen, achterop aan de George Gershwinlaan twee woonvleugels van zes lagen, verbonden door een lage onderbouw rond een binnenhof. De toren is opgebouwd uit drie gestapelde blokken die tot 2 m buiten de begane grond uitkragen en naar boven toe insnoeren, elk met een stoere rand en een terras; daarboven een kroon van vier lagen met getrapte terrassen op de zuidhoeken.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `xavier-amsterdam.glb` | Model in meters, Y omhoog, drie nodes: `building:xavier-amsterdam-toren` (toren met plint en onderbouw), `building:xavier-amsterdam-westvleugel` en `building:xavier-amsterdam-oostvleugel` |
| `xavier-amsterdam.json` | Catalogusitem |
| `xavier-amsterdam-1-1000.stl` | Los te printen op 1:1000 (49 × 58 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[120123.6, 483277.0]`, midden in het complex tussen toren en vleugels; de lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden), want de gevels staan op 0,1° na noord-zuid en oost-west. Lokaal z = 0 is NAP −0,68 m (3D BAG-maaiveld, AHN-DTM −0,67); `groundHeight` is 42,36 m (NAP plus de geoïde NLGEO2018 ter plekke, 43,04, gelijk aan Q Residences en de Rechtbank Amsterdam) en `groundOffsetMetres` −0,15.

`replacesBuildings` bevat drie panden: de toren met onderbouw en oostvleugel (`0363100012246555`), de westvleugel (`0363100012246554`) en de parkeerkelder (`0363100012246556`). De kelder ligt als rechthoek van 60 × 59 m onder het hele complex; de 3D BAG reconstrueert hem met alle daken van de toren en de vleugels, zodat hij anders als kopie door het model zou steken. De binnenhof en de strook ten oosten van het complex liggen op maaiveld en blijven aan het PDOK-terrein.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Plint (begane grond en 1e verdieping) | 48,5 × 22,5 m, tot 2 m buiten de BAG-contour | +6,9 m | AHN-DSM rond de gevels, foto's |
| Blok 1 (verdiepingen 2–9) | 48,1 × 20,1 m | +33,3 m | AHN-DSM (buitenste cellen 28–39 m), foto's |
| Blok 2 (10–14) | 47,5 × 19,3 m | +49,8 m | AHN-DSM (39–52 m), foto's |
| Blok 3 (15–17) | 45,3 × 18,4 m | +59,7 m | AHN-DSM (52–61 m), 3D BAG |
| Randen boven de blokken | 0,9 m hoog, 0,4 m buiten de gevel, kraag onder 45° | +33,3 / +49,8 / +59,7 m | foto's |
| Kroon (18–21) | 44,3 × 17,3 m | hoofddak +73,6 m | 3D BAG (70e percentiel 73,6; AHN-DSM 73,6–73,8) |
| Kroonterrassen | zuidwest- en zuidoosthoek, oost- en westrand, midden zuid | +63,0 / +66,3 / +69,6 m | 3D BAG (LoD2.2, AHN5 2023) |
| Installatieschermen op het dak | twee L-vormen van 2,2 m breed | +74,6 m | 3D BAG (74,5–74,7), AHN-DSM |
| Onderbouw tussen toren en vleugels | BAG-contour met de inham van de binnenhof | +2,9 m | 3D BAG, AHN-DSM |
| Westvleugel (pand `0363100012246554`) | 15,1 × 18,6 m, noordkop 15,1 × 5,8 m | +22,7 m, noordkop +16,1 m | BAG, 3D BAG (AHN4) |
| Oostvleugel (deel van pand `0363100012246555`) | 15,0 × 18,7 m, noordkop 15,0 × 5,7 m | +22,7 m, noordkop +16,1 m | BAG, 3D BAG |
| Liftopbouwen op de vleugels | 3,5 × 2,5 m en 3,1 × 1,9 m | +23,4 m | 3D BAG |

Gevelreliëf: in de toren per laag (3,3 m) vensters van 1,9 m op een travee van 3,4 m als blinde nissen van 0,35 m met een plafond onder 45°. Aan de noordgevel per blok een groep van vijf loggia's (1,2 m diep, plafond onder 45°) die per blok één travee naar het oosten verspringt; in de oost- en westgevel een kolom open balkons in de gevel. Aan de zuidgevel per blok drie of vier balkonstapels van 6,8 m breed die 1,4 m uitsteken, met per laag een open balkon van 0,9 m en een kraag onder 45°; die van blok 2 staan verspringend tussen die van blok 1. Onder de plint een galerij: pijlers van 1,0 m op de buitenlijn en de puien 1,2 m terug. De vleugels hebben per laag (begane grond 5,64 m, daarboven 3,3 m) vensters op een travee van 3,0 m en aan de zuidgevel per laag één balkon van 1,2 m diep, afwisselend links, midden en rechts, elk met een kraag onder 45°.

## Geschat en weggelaten

- De blokgrenzen: de BAG geeft alleen de begane grond. Dat de blokken uitkragen en naar boven insnoeren, staat op de foto's; hoe ver per gevel en per blok komt uit de buitenste cellen van het AHN-DSM per hoogteklasse (mediaan over de gevel). Een zijdelingse verschuiving van de blokken, zoals de foto's suggereren, is niet meetbaar en niet gemodelleerd.
- De verdiepingshoogte van 3,3 m volgt uit de terrassen van de kroon; de indeling in blokken (2–9, 10–14, 15–17, kroon 18–21) is geteld op foto's.
- De galerij onder de plint (pijlers op de buitenlijn, puien op de BAG-contour) is uit foto's afgeleid; diepte en pijlerbreedte zijn geschat.
- Plaats en aantal van de loggia's, de balkonkolommen en de balkonstapels zijn geschat; de foto's tonen het patroon, niet de exacte traveeën.
- De verdiepingshoogtes van de vleugels volgen uit de balkonbovenkanten in de 3D BAG (+6,06 en +19,2); de volgorde van de verspringende balkons is geschat.
- De naam Xavier klopt (Wikipedia, het opschrift op de gevel); de taak noemde het een kantoortoren, maar het is een woongebouw (de BAG geeft woon- en bijeenkomstfunctie).
- Weggelaten: balkonhekken, glazen balustrades en de leidingen op het dak (kleiner dan 0,9 m), de pergola's op de dakterrassen van de vleugels (open latwerk) en een glasdak of lichtstraat in de onderbouw (nodata in het DSM, op de ortho niet te herkennen).

## Controle

`node scripts/generate-xavier-amsterdam.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de daken, terrassen, onderbouw en vleugels, dat blok 1 meer dan 1,3 m buiten de BAG-lijn uitkraagt terwijl de galerij open blijft, dat de balkonstapels uitsteken en hun open balkons na de printcorrectie op 45° houden, dat de printcorrectie het volume met minder dan 1 % laat groeien, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0363100012246555`, `0363100012246554` en `0363100012246556` (bouwjaar 2019); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012246555) (LoD2.2, puntwolk AHN5 2023).
- [Xavier (Amsterdam)](https://nl.wikipedia.org/wiki/Xavier_(Amsterdam)) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [Woontoren Xavier](https://commons.wikimedia.org/wiki/File:Woontoren_Xavier_(1).jpg) en [Category:Xavier (Amsterdam)](https://commons.wikimedia.org/wiki/Category:Xavier_(Amsterdam)).
