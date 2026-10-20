# De Rotterdam (Rotterdam)

Vereenvoudigd, printbaar model van De Rotterdam op de Wilhelminapier (OMA, 2013): de "verticale stad" van drie torens op een gezamenlijke plint. Elke toren bestaat uit een onderblok en een bovenblok die op NAP +87 tot +89 m ten opzichte van elkaar verspringen; de uitkragingen, de richels, de sleuf onder de oosttoren en de nis aan de Maaszijde zijn het kenmerk. Het model is in oktober 2026 opnieuw opgebouwd uit benoemde blokken; de vorige versie was uit het AHN-DSM per meter bemonsterd en naar hoogteniveaus gekwantiseerd.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `de-rotterdam.glb` | Model in meters, Y omhoog, één node `building:de-rotterdam-drie-verspringende-torens-op-de-plint` |
| `de-rotterdam.json` | Catalogusitem |
| `de-rotterdam-1-1000.stl` | Los te printen op 1:1000 (109 × 52 × 152 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93136.02, 435733.86]`, het midden van het BAG-pand (ongewijzigd ten opzichte van de vorige versie). De lokale X-as loopt langs de lange gevel naar het noordoosten (richting Erasmusbrug en Toren op Zuid), 39,1° linksom op RD-oost; +Y wijst naar de Nieuwe Maas, −Y naar de straatzijde. De westtoren (richting Hotel New York) ligt aan de −X-kant. Lokaal z = 0 is NAP +3,3 m (3D BAG-maaiveld 3,26, AHN-DTM 3,3–3,5). `groundSamplePoints` liggen op de rijbaan aan de straatzijde, 3,2 m voor de plint; `groundHeight` is 46,89 m (ellipsoïdisch, laagste PDOK-terrein daar), `groundOffsetMetres` −0,15.

## Onderdelen en maten

Maten in het gebouwstelsel (x langs de lange gevel, y naar de Maas), hoogtes in NAP.

| Onderdeel | Plattegrond (x; y) | Hoogte |
| --- | --- | --- |
| Plint, lamellenzone | BAG-rechthoek −53,55…53,55; −24,8…24,8 | +21,2 tot +31,45 (dakterras), rand 1,0 m breed tot +32,5 |
| Plint, banden en colonnade | 1,0 m buiten de BAG-rand | tot +21,2 |
| Westtoren, onderblok | −46,3…−20,95; −12,9…21,8 | +87,26 |
| Westtoren, bovenblok | −53,55…−27,8; −12,9…21,8 | +87,26 tot +148,4 |
| Middentoren, kolom | −21,0…−4,4; −21,7…14,0 | plint tot +148,4 |
| Middentoren, onderblok | −4,45…21,6; −13,6…24,8, met een nis x −4,45…2,5, y 14,0…24,8 | +89,4 |
| Middentoren, bovenblok | −4,45…13,6; −13,6…24,8 | +89,4 tot +148,4 |
| Oosttoren, onderblok | 24,9…53,55; −13,6…22,2, met een uitsprong x 27,6…53,55 tot y −21,0 | +86,9 |
| Oosttoren, bovenblok | 19,5…53,55; −13,6…22,2 | +86,9 tot +148,4 |
| Dakrand van de drie bovenblokken | 1,0 m breed langs de dakrand | +150,55 |
| Dakopbouw west | kader −46,6…−32,0; −5,5…8,6 (schermen 1,0 m) rond installaties | +154,6 en +151,6 |
| Dakopbouw midden | −12,5…0,6; −6,4…6,8 | +154,8 |
| Dakopbouw oost | blok 35,0…45,0; −6,6…7,2 in een schermkader vanaf x 28,0 | +154,8 en +153,0 |
| Opbouw op het plintdak voor de sleuf | 21,0…28,0; −17,5…−13,6 | +32,4 |

Wat daaruit volgt (de kenmerken op de foto's):

- Westtoren: het bovenblok kraagt 7,25 m uit aan de kopse kant richting Hotel New York (vlakke onderkant op +87,26) en laat aan de binnenkant een richel van 6,85 m op het onderblok.
- Middentoren: de westkolom loopt van de plint tot het dak en springt aan de straatzijde 8 m voor de rest uit; aan de Maaszijde ligt hij 10,8 m terug, zodat daar een inkeping tot op de plint ontstaat. Het onderblok loopt 8 m verder naar het oosten dan het bovenblok (richel op +89,4); het bovenblok kraagt aan de Maaszijde 10,8 m uit over een nis van 6,9 m breed in het onderblok.
- Oosttoren: het onderblok steekt 7,4 m naar de straat uit (richel op +86,9); het bovenblok ligt over de sleuf van 3,3 m (x 21,6–24,9) tussen de onderblokken van midden- en oosttoren, die van de plint tot de verspringing door de hele diepte loopt (het genus 1 van het model).
- Gevels: per verdieping glasvakken als blinde nissen van 0,35 m (2,65 tot 2,7 m breed, 1,9 tot 2,4 m hoog, kop onder 45°) tussen stijlen van 0,9 m en vloerbanden van 1,0 m: westtoren en het hotel in het oostelijke onderblok 3,0 m per laag (19 en 20 lagen), kantoren 3,4 m (17 + 17 in de middentoren, 18 in het oostelijke bovenblok). De dichte dakrand van 2,15 m boven het dak en de bovenste band vormen een kroon van 2,65 m zonder vensters.
- Plint: colonnade op de begane grond (glas 2,5 m achter kolommen van 0,9 m om de circa 8,9 m, hoekkolommen 3,0 m, tot +12,1), drie banden met elk een plaat van 1,0 m en een glasstrook van 2,0 m die 0,4 m terugligt (+12,1 tot +21,2) en die samen 1,0 m buiten de lamellenzone uitsteken, en drie lagen lamellenzone (+21,2 tot +31,45) met vakken van 1,8 m.

Bovenkanten (daken, dakrand, richels, dakopbouwen, plintdak) komen uit de 3D BAG LoD2.2 en het AHN-DSM 0,5 m. Langs de naar het zuidoosten en zuidwesten gerichte glasgevels heeft het DSM een strook van 4 tot 8 m met spiegelpunten op alle hoogtes; de gevels volgen daar de 3D BAG en de BAG. De onderblokken onder de bovenblokken, de sleuf, de nis, de verdiepingshoogtes (periode van het gevelraster) en de plintgevel zijn gemeten op een frontale foto van de Maaszijde (8,13 px/m, geschaald op de gevellengte en de dakhoogte) en gecontroleerd op een foto van de straatzijde.

## Geschat en weggelaten

- Geschat: de x-maten van de onderblokken onder de bovenblokken (westelijk onderblok tot −46,3, sleuf 21,6–24,9, nis −4,45 tot 2,5; ±0,5 m uit de foto), de diepte van de nis (tot y 14,0, gelijk aan de westkolom) en de y-maten van de onderblokken waar het AHN ze niet ziet (gelijk aan de bovenblokken genomen); de verdiepingshoogtes en het vensterraster; de hoogte en het uitsteken van de banden en de diepte van de colonnade; de schermkaders op de daken.
- Vereenvoudigd: het fijne raster van aluminium lamellen om de circa 0,9 m is op 1:1000 niet te printen en is een raster van vakken van circa 2,7 m geworden; de banden van de plint steken in werkelijkheid naar boven toe iets verder uit, in het model liggen ze in één vlak; de lichtere panelen in het middelste onderblok zijn niet apart gemodelleerd.
- Weggelaten: de schuine donkere luifel boven de hoofdingang aan de straatzijde (een dunne plaat die op 1:1000 niet zonder steun print en waarvan de plaats op de foto's niet goed te meten is), de losse kolommen en glaspuien van de entree (achter de colonnade), het rode logo op de plint en de beplanting op het plintdak (kleiner dan 0,9 m of geen bouwdeel). Een richel van circa 4 × 7 m op +87 m die het DSM en de 3D BAG aan de Maaszijde tussen westtoren en middenkolom tonen (x −21 tot −17), staat niet op de frontale foto en is weggelaten.

## Controle

`node scripts/generate-de-rotterdam.mjs` geeft `NoError`, genus 1 (de sleuf), één gesloten deel en 69.668 driehoeken met 4.342 nissen. In de webshop controleert `tests/landmark-models.test.ts` de daken, dakrand en dakopbouwen, de drie richels van de verspringing, het plintdak met de inkeping aan de Maaszijde en de uitstekende banden, de vlakke onderkanten van de westelijke uitkraging, van het bovenblok boven de sleuf en boven de nis, dat de sleuf door de hele diepte open is (ook na de printcorrectie op 45°), een vensternis die na de printcorrectie een nis blijft, en de plaatsing en bemonstering op straat. Met de printcorrectie op 45° komen er wiggen onder de uitkragingen (onder de westelijke uitkraging tot 3,5 m onder de onderkant); het volume neemt met 0,2 % toe en de sleuf blijft open. Vier schuine aanzichten zijn naast de PDOK-reconstructie (met de buurmodellen Toren op Zuid, Maastoren, Hotel New York, Montevideo en New Orleans) en frontale foto's van de Maas- en straatzijde gelegd.

## Bronnen

- PDOK BAG, pand `0599100100002429` (bouwjaar 2013); AHN-DSM en -DTM 0,5 m (PDOK WCS); PDOK-terreintegels voor `groundHeight`.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100002429).
- [Wikipedia: De Rotterdam](https://nl.wikipedia.org/wiki/De_Rotterdam).
- Foto's op Wikimedia Commons (niet meegeleverd): [De Rotterdam, September 2019 - 01](https://commons.wikimedia.org/wiki/File:De_Rotterdam,_September_2019_-_01.jpg) (frontaal vanaf de Maas), [DeRotterdam.JPG](https://commons.wikimedia.org/wiki/File:DeRotterdam.JPG) (straatzijde), [De Rotterdam south side](https://commons.wikimedia.org/wiki/File:De_Rotterdam_south_side.jpg), [Kantoorgebouw De Rotterdam 02](https://commons.wikimedia.org/wiki/File:Kantoorgebouw_De_Rotterdam_02.jpg) (colonnade en banden), [Rotterdam - De Rotterdam (2)](https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Rotterdam_(2).jpg).
