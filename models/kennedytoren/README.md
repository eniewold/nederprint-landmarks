# Kennedytoren (Eindhoven)

Vereenvoudigd, printbaar model van de Kennedytoren aan het Kennedyplein naast het station (kantoortoren, 2002, Van Aken Architectuur): een toren met een parallellogram als plattegrond waarvan de oostkant over de volle lengte uitkraagt boven een vlakke onderkant, met een lamellenkroon en een teruggezette dakrand, en het lagere complex in hetzelfde BAG-pand: een westvleugel, een hal met glazen dak en een zuidvleugel langs het spoor. Een tweede node bevat wat boven de straat uitsteekt op de parkeergarage eronder: een hellend plein en twee hellende ingangen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `kennedytoren.glb` | Model in meters, Y omhoog, twee nodes: `building:kennedytoren-toren-met-uitkraging-hal-en-vleugels` en `building:kennedytoren-garagedek-en-hellingbanen` (drie losse delen) |
| `kennedytoren.json` | Catalogusitem |
| `kennedytoren-1-1000.stl` | Los te printen op 1:1000, Z omhoog; het garagedek en de hellingbanen zijn losse delen naast het gebouw |

## Oorsprong en oriëntatie

RD-oorsprong `[161492.9, 383881.1]`, in het midden van de toren. De lokale X-as loopt langs de zuid- en westgevels van de vleugels, 12,6° linksom op RD-oost (gemeten op de BAG-hoekpunten). Lokaal z = 0 is NAP +15,91 m (3D BAG `b3_h_maaiveld`). `groundSamplePoints` liggen op het voorplein en de straat aan de zuidkant en op het plein aan de noordkant, `groundHeight` is 59,831 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

`replacesBuildings` bevat het pand zelf (`0772100000354498`) en de parkeergarage eronder (`0772100000936704`, 2005): de PDOK-reconstructie van de garage neemt de toren mee tot circa NAP +100,8 m en zou door het model en onder de uitkraging heen steken. Wat de garage werkelijk boven de straat heeft, staat daarom in de tweede node (zie hieronder). De PDOK-reconstructie van de garage is verder een vlak op NAP +16,14 m (op straatniveau; het PDOK-terrein ligt daar 0,3 tot 0,9 m lager) met schuine wanden naar de daken van de buurpanden; die zijn niet nagebouwd.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Toren | parallellogram 24,45 m breed (west- en oostgevel langs de v-as), noord- en zuidgevel schuin onder 26,7°, 38,1 m lang | lamellenkroon tot +95,5 m |
| Dakrand | 1,0 m brede rand, 0,8 m terug van de gevel | +98,85 m |
| Dak | verdiept binnen de dakrand | +98,07 m |
| Dakopbouwen | 4,0 × 1,7 m en 2,5 × 2,5 m | +99,92 m en +100,6 m |
| Uitkraging | oostelijke 7,9 m van de toren over de volle lengte, vlakke onderkant | onderkant +40,2 m |
| Onderbouw van de toren | westelijke 16,6 m van het parallellogram, oostgevel in lijn met de zuidvleugel | tot de toren |
| Westvleugel | BAG-contour, noordgevel op de schuine lijn | +38,6 m |
| Zuidvleugel | BAG-contour tot de zuidgevel van de toren | +38,55 m |
| Hal tussen westvleugel en toren | glazen dak met liggers om de 4,5 m (0,9 m breed, 0,5 m hoog), voorrand afhellend | +35,15 m, voorrand +34,45 m |
| Installatiekasten op de vleugels | 2,4 × 2,8 m en 2,4 × 3,0 m | +40,6 m en +40,1 m |
| Garagedek: plein tussen de westelijke buurpanden (`0772100000354500` en `0772100000354499`) | 16,4 × 46 m, vlak dat 0,068 per m naar het noorden oploopt en 0,035 per m naar het oosten afloopt | +16,4 m aan de straat tot +19,7 m aan de noordrand |
| Hellende ingang ten zuidwesten van de westvleugel | tienhoek van circa 18 × 14 m, vlak dat naar het noordoosten oploopt | van straatniveau tot +21,3 m |
| Rode hellingbaan voor de noordgevel | vijfhoek van circa 16 × 15 m, vlak dat van de hoge zuidkant naar de straat afloopt | +22,2 m tot +17,8 m (straat) |

De noordgevels van toren, hal en westvleugel liggen op één rechte lijn in de BAG-contour; de zuidgevel van de toren loopt evenwijdig daaraan. De plattegrond van de top is in het AHN-DSM en op de luchtfoto (na correctie voor de scheefstand van circa 12 m) hetzelfde parallellogram. Langs de gevels ligt een strook van 0,8 m op +95,0 tot +96,1 m: de bovenkant van de lamellenkroon voor de teruggezette dakrand (98,8–98,9 m). Dakhoogtes van de lage delen uit de 3D BAG (AHN5, 2024) en het AHN-DSM. De drie garagedelen liggen binnen de BAG-contour van de garage; hun bovenvlakken zijn planvergelijkingen gefit op het AHN-DTM (plein, dat het AHN als maaiveld heeft) en het AHN-DSM (ingangen), met een afwijking van minder dan 0,3 m. Ten westen van het plein ligt de verdiepte inrit van de garage (+13,1 tot +15,7 m), onder straatniveau en dus niet gemodelleerd.

## Geschat en weggelaten

- De onderkant van de uitkraging (+40,2 m) is geteld op foto's: zes lagen onder en vijftien lagen plus de kroon boven de uitkraging. De uitkraging zelf is 7,9 m (BAG-hoekpunt van de oostgevel van de zuidvleugel tot de oostgevel van de toren) en heeft op de foto's een vlakke, donker beklede onderkant; de printexport vult eronder op onder 45°.
- Verdiepingen: begane grond 4,0 m en daarboven lagen van 3,38 m, in de toren vijftien lagen tot de kroon op +90,9 m. Vensters als blinde nissen van 0,35 m: in de toren dertien traveeën op de schuine gevels en achttien op de lange gevels (circa 2,07 m, penanten 0,9 m), in de kroon twee liggende stroken per travee, in de onderbouw en de vleugels een travee van 2,6 m. Op de begane grond alleen nissen aan de noord- en zuidkant, omdat het maaiveld aan de west- en oostkant hoger ligt (straat en verhoogd plein tot NAP +19,1 m). Elke nis heeft minstens 1 m materiaal erachter.
- Het rooster van het glazen haldak is vereenvoudigd tot liggers om de 4,5 m; de glazen vlakken ertussen zijn dicht.
- Weggelaten: de twee antennemasten op het dak en het hijsgestel voor de glazenwassers (dunner dan 0,9 m), dakranden en kleine installaties op de vleugels onder 0,9 m, en kleine inspringingen bovenin de zuidgevel van de zuidvleugel. Het verhoogde plein ten oosten van de zuidvleugel (+19,1 m) en de helling tussen toren en oostelijk buurpand staan al in het PDOK-terrein en zijn niet gemodelleerd.
- Garagedelen: alleen wat meer dan 0,5 m boven de straat uitsteekt. De randen van de hellende ingangen zijn op het 1 m-raster van het DSM gelegd en de hoge kant van de zuidwestelijke ingang (DSM tot 22,7 m) is afgetopt op +21,3 m; de borstweringen langs de rode hellingbaan (leuningen) zijn weggelaten. De rode hellingbaan valt deels onder pand `0772100001018431`, dat geen PDOK-model heeft.
- Het AHN-DSM ten zuiden van de toren (tussen de dakrand en de zuidvleugel) bevat verspreide hoogtes van 40 tot 95 m; de luchtfoto en de 3D BAG tonen daar de verticale zuidgevel op de BAG-lijn, en zo is hij gemodelleerd.

## Controle

`node scripts/generate-kennedytoren.mjs` geeft `NoError`; het gebouw is één gesloten deel met genus 0, de garagenode drie gesloten delen. In de webshop controleert `tests/landmark-models.test.ts` de hoogtes van dak, dakrand, kroonrand, dakopbouwen, vleugels, installatiekasten en haldak (met een ligger en de afhellende voorrand), de vlakke onderkant van de uitkraging op +40,2 m en de terugliggende oostgevel van de onderbouw, dat een torenvenster na de printcorrectie op 45° een blinde nis blijft, genus 0, één component, de volumeverhouding print/model (1,011), de drie garagedelen met hoogtes op plein en hellingbanen, en de plaatsing van beide nodes. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0772100000354498` (bouwjaar 2002) en `0772100000936704` (2005, parkeergarage); actuele orthoHR; AHN-DSM en -DTM 0,5 m (PDOK WCS).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000354498).
- [Wikipedia: Kennedytoren](https://nl.wikipedia.org/wiki/Kennedytoren).
- Foto's op Wikimedia Commons (niet meegeleverd): [Kennedytoren Eindhoven in 2019](https://commons.wikimedia.org/wiki/File:Kennedytoren_Eindhoven_in_2019.jpg), [Kennedytoren Eindhoven 2021](https://commons.wikimedia.org/wiki/File:Kennedytoren_Eindhoven_2021.jpg), [Kennedytoren Eindhoven](https://commons.wikimedia.org/wiki/File:Kennedytoren_Eindhoven.JPG), [Kennedy tower Eindhoven](https://commons.wikimedia.org/wiki/File:Kennedy_tower_Eindhoven_-_panoramio.jpg), [Buildings Kennedyplein Eindhoven](https://commons.wikimedia.org/wiki/File:Buildings_Kennedyplein_Eindhoven.jpg), [Kennedytoren01](https://commons.wikimedia.org/wiki/File:Kennedytoren01.jpg).
