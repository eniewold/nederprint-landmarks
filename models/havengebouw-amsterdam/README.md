# Havengebouw (Amsterdam)

Vereenvoudigd, printbaar model van het Havengebouw aan de De Ruijterkade 7 (W.M. Dudok en R. Magnée, geopend 1960), de eerste hoogbouw aan het IJ en sinds 2007 gemeentelijk monument. Een kantoorschijf van dertien verdiepingen staat haaks op de kade met de smalle noordoostkop naar het water: elf lagen kantoor tot een dakterras, daarop een teruggezette kroon van twee lagen (oorspronkelijk restaurant, café en bar) met een glasband rondom. Kenmerkend zijn de donkere lisenen op de lange gevels die boven het terras doorlopen in rode stalen beugels met een arm over de dakrand van de kroon, de horizontale vensterbanden tussen de lisenen, de donkere bakstenen koppen met een uitspringende strook loggia's, en de lage paviljoens aan de spoorzijde.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `havengebouw-amsterdam.glb` | Model in meters, Y omhoog, één node `building:havengebouw-schijf-met-kroon-beugels-loggiastroken-en-paviljoens` |
| `havengebouw-amsterdam.json` | Catalogusitem |
| `havengebouw-amsterdam-1-1000.stl` | Los te printen op 1:1000 (60,2 × 54,6 × 54,7 mm), Z omhoog |

Gegenereerd door `scripts/generate-havengebouw-amsterdam.mjs`.

## Oorsprong en oriëntatie

RD-oorsprong `[121522.8, 488299.2]`, midden in de BAG-contour van pand 0363100012179689 (de oostelijke 35,6 m van de schijf). De lokale X-as staat 59,2° op RD-oost, langs de lange gevels naar de kade en het IJ (noordoost); +Y wijst naar het noordwesten. Lokaal z = 0 is NAP +0,735 m (3D BAG `b3_h_maaiveld`). `groundSamplePoints` liggen op straat, stoep en parkeerterrein rond de schijf (niet op het spoortalud), `groundHeight` is 43,737 m (ellipsoïdisch, laagste PDOK-terrein op de stoep ten noordoosten), `groundOffsetMetres` −0,15. Het water van het IJ ligt circa 60 m verderop, achter de De Ruijterkade.

## Onderdelen en maten

| Onderdeel | Plattegrond (lokaal) | Hoogte (NAP) |
| --- | --- | --- |
| Schijf | u −27,93 … 17,78, v −11,05 … 11,13 (BAG-panden 0363100012179689 en 0363100012179691) | dakterras +43,05 m |
| Borstwering | 0,9 m breed langs de rand van het terras | +44,15 m |
| Kroon, onderlaag | 0,9 m binnen de dakrand van de kroon | tot +45,0 m |
| Kroon | dakrand u −25,45 … 16,55, v −8,65 … 10,20 (2,5 m terug van de zuidwestkop, 1,2 m van de noordoostkop, 2,4 m van de zuidoostgevel, 0,9 m van de noordwestgevel); kraag van 45° vanaf de onderlaag | dak +51,35 m |
| Glasband kroon | rondom, blinde nis van 0,35 m | +46,9 tot +50,7 m |
| Installatieopbouw | u −17,8 … 12,7, v −4,4 … 5,05 (3D BAG-vlak 116) | +53,78 m |
| Twee opbouwen | 1,8 × 5,0 m en 1,9 × 2,8 m (3D BAG-vlakken 109 en 111) | +54,65 m |
| Lisenen | tien per lange gevel, om de 4,98 m, de buitenste op de hoeken; 0,9 m breed, 0,3 m voor de gevel, onderkant onder 45° | +5,0 tot +43,05 m |
| Rode beugels | 24 staanders van 0,9 × 0,9 m: acht per lange gevel op de lisenen, twee per kop naast de loggiastrook en één diagonaal op elke hoek; arm van 0,9 m tot 0,5 m over de dakrand van de kroon, schoor van 45° eronder | +51,9 m |
| Loggiastroken | beide koppen, v −4,0 … 4,5, 1,42 m voor de kopgevel; omlijsting 0,9 m, per laag een loggia van 1,0 m diep boven een balkonband van 1,0 m, plafond onder 45°; entreenis op de begane grond aan de noordoostkop | +42,5 m |
| Entreeluifel | halfrond, straal 1,9 m, aan de zuidoostgevel bij u −10,25 | +3,35 m |
| Paviljoen | BAG-contour van pand 0363100012179691 ten zuidwesten van de schijf | +4,95 m |
| Lage vleugel | BAG-contour van pand 0363100012170978 (1960), langs het spoor | +9,75 m |

Verdiepingen: begane grond tot +5,0 m, daarboven tien kantoorlagen van 3,805 m tot het terras (Wikipedia: dertien verdiepingen, waarvan de bovenste twee in de kroon).

Gevelopbouw: op de lange gevels per laag tussen elk paar lisenen een vensterband als blinde nis van 0,35 m (borstwering 1,0 m, venster 1,9 m, plafond onder 45°) en op de begane grond een hogere glasband; op de bakstenen koppen per laag aan weerszijden van de loggiastrook één liggend venster van 2,6 × 1,1 m. Paviljoen en lage vleugel hebben vensterbanden in vakken van circa 3,6 m.

Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM 0,5 m (dakrand van de kroon, terras en borstwering, loggiastroken, de beugels langs de noordwestgevel om de 5,0 m), gevelopbouw uit foto's.

## Geschat en weggelaten

- De verdiepingshoogtes zijn afgeleid uit het terras (+43,05 m) en het aantal lagen; de begane grond is 4,3 m.
- De kroon: op de foto's helt de glasband iets naar buiten boven een witte band, met daaronder een lage teruggezette laag achter het hekwerk van het terras. Hier staat de glasband verticaal op de dakrand uit het DSM, met de onderlaag 0,9 m terug en een kraag van 45°. De terugsprong aan de zuidoostkant (2,4 m) volgt het DSM en de 3D BAG, die daar een schuin vlak van +43 naar +47 m tonen; wat dat vlak precies is (glas, beugels, interieur door het glas) is niet vast te stellen.
- De rode beugels zijn in werkelijkheid circa 0,5 m breed en lopen als een J met een korte arm over de dakrand; hier zijn ze 0,9 m dik met een dichte arm en een schoor, zodat ze printbaar zijn. De hoogte (+51,9 m) is op de foto's geschat; het DSM ziet ze op 0,5 m-pixels tot 51,2 m. De hoekbeugels staan diagonaal.
- De borstwering van het terras is op de foto's een hekwerk op een witte rand; hier een dichte band van 0,9 m tot de DSM-hoogte +44,15 m.
- De loggia's in de kopstroken (diepte, balkonband) en de vensterbanden zijn op de foto's geschat; de witte stijlen tussen de vensters, de hekwerken van de balkons en het terras, de antennes en masten op de installatieopbouw en een trapje op het dak (3D BAG-vlak 110) zijn dunner dan 0,9 m of te klein en weggelaten.
- De entreeluifel aan de zuidoostgevel staat in de BAG-contour en is hier een dicht halfrond volume tot de luifelhoogte.
- Het paviljoen ligt aan de westkant tegen het spoortalud; het PDOK-terrein ligt daar tot 1,7 m hoger dan aan de straatkant, zodat de onderkant van die gevel in het talud verdwijnt.
- De lage vleugel (pand 0363100012170978, bouwjaar 1960) sluit aan op het paviljoen en is meegenomen als lagere vleugel van het complex; of hij tot het gemeentelijk monument behoort, is niet nagegaan.

## Controle

`node scripts/generate-havengebouw-amsterdam.mjs` geeft `NoError`, één gesloten deel en genus 24 (7.054 driehoeken, 307 nissen, 24 beugels): elke beugel sluit tussen borstwering en kroon een lus. In de webshop controleert `tests/landmark-models.test.ts` de hoogtes van kroondak, installatieopbouw, opbouw, terras, borstwering, een beugel, loggiastrook, entreeluifel, paviljoen en lage vleugel, de terugsprong van de kroon aan de zuidoostkant, de uitsprong van de loggiastrook, dat een vensterband in de zuidoostgevel na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing; de printcorrectie voegt 0,007 % volume toe. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd. De dichtstbijzijnde andere landmarkmodellen (Amsterdam Centraal, EYE, A'DAM Toren) liggen meer dan 470 m verderop.

## Bronnen

- PDOK BAG, panden `0363100012179689`, `0363100012179691` en `0363100012170978` (bouwjaar 1960); actuele orthoHR; AHN DSM 0,5 m.
- 3D BAG: [pand 0363100012179689](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012179689), [pand 0363100012179691](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012179691), [pand 0363100012170978](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012170978).
- [Wikipedia: Havengebouw (Amsterdam)](https://nl.wikipedia.org/wiki/Havengebouw_(Amsterdam)).
- Foto's op Wikimedia Commons (niet meegeleverd): [Havengebouw De Ruijterkade 7](https://commons.wikimedia.org/wiki/File:Havengebouw_De_Ruijterkade_7,_Amsterdam.JPG) (vanaf het IJ, zuidoostgevel en noordoostkop), [Amsterdam Havengebouw 001](https://commons.wikimedia.org/wiki/File:Amsterdam_Havengebouw_001.JPG) en [002](https://commons.wikimedia.org/wiki/File:Amsterdam_Havengebouw_002.JPG) (vanaf het spoor, zuidwestkop en zuidoostgevel), [Havengebouw Amsterdam](https://commons.wikimedia.org/wiki/File:Havengebouw_Amsterdam.jpg), [Amsterdam 20050827 (21)](https://commons.wikimedia.org/wiki/File:Amsterdam_20050827_(21).jpg) (noordoostkop met loggiastrook), [luchtfoto Amsterdam Centraal](https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Amsterdam_Central_Station_and_the_surrounding_area.jpg).
