# Engelmunduskerk (Velsen-Zuid)

Een printbaar model van de romaanse eenbeukige dorpskerk aan het Kerkplein in Velsen-Zuid (rijksmonument 37067): het tufstenen schip met zadeldak, de westtoren van rond 1200 (in de 14e eeuw in baksteen verhoogd) met tentdak en gebogen steunberen, de noordelijke aanbouw en de consistorie met wijkcentrum uit de restauratie van 1966-'69.

## Bestanden

- `engelmunduskerk-velsen-zuid.glb`: gesloten model in meters, Y omhoog, één node `building:kerk`.
- `engelmunduskerk-velsen-zuid.json`: catalogusitem; vervangt BAG-pand `NL.IMBAG.Pand.0453100000025845` (kerk, toren, aanbouw en consistorie zijn één pand).
- `engelmunduskerk-velsen-zuid-1-100.stl` en `-1-1000.stl`: printmodellen in millimeters, Z omhoog, vlakke onderkant.
- Generator: `scripts/generate-engelmunduskerk-velsen-zuid.mjs` (`--scale 100` voor de 1:100-STL).

## Oorsprong en oriëntatie

Oorsprong RD (104702,7; 497309,9), midden in het schip op maaiveld. De lokale X-as loopt langs de nok van het schip naar het oosten (RD-richting 4,9 graden, `xAxis` [0,99635; 0,08542]); de nok ligt in de 3D BAG op 1 cm na op de as. Z = 0 is maaiveld NAP +2,95 m (3D BAG `b3_h_maaiveld` 2,94, AHN-DTM aan de westzijde 2,98). `groundOffsetMetres` is +0,2: het PDOK-maaiveld rond de kerk loopt van west naar oost 0,4 m op en de lader neemt het laagste punt; zo staat de westgevel op het maaiveld en zakken de oost- en zuidzijde tot 0,4 m in, terwijl de onderkant (z = −0,5) overal onder het PDOK-terrein blijft.

## Onderdelen

- **Schip** 31,0 × 10,94 m, goot NAP +9,9 en nok NAP +16,4 (3D BAG LoD2.2, AHN-DSM 16), dakhelling circa 50 graden. Oostgevel 0,35 m boven het dak opgetrokken met een pinakel van 0,9 m op de top.
- **Westtoren** 4,63 × 4,63 m, goot NAP +24,0 op een kraag van 45 graden met 0,25 m overstek, tentdak tot NAP +27,8 (AHN-DSM 27,9). Rondboogfries als band op een kraag van 45 graden op 11,9 m.
- **Gebogen steunberen** aan de westzijde volgens de BAG-contour: per hoek een arm voor de westgevel en een arm langs de zijgevel, holle bovenkant van 4,5 m bij de toren tot 0,9 m aan het eind.
- **Noordelijke aanbouw** 5,26 × 3,0 m met zadeldak haaks op het schip (goot 5,25, nok 6,92 m) en een 0,3 m opstaande noordgevel.
- **Consistorie en wijkcentrum** (1966-'69) aan de zuidoostzijde: twee evenwijdige zadeldaken met de nok noord-zuid (west: nok 7,0 m, oost: nok 8,85 m), die met een kilgoot in het schipdak lopen.
- **Gevelreliëf** als blinde nissen van 0,25 tot 0,55 m: drie spitsbogige spaarvelden in de zuidgevel (twee met rondboogvenster), drie rondboogvensters in de noordgevel, twee vensters, deur en topvenster in de oostgevel, westdeur tussen de steunberen, hoge nis in het tufstenen torendeel, tweelingnissen en galmgaten in de toren, vensters en deur in de consistorie.

## Geschat en weggelaten

Geschat uit foto's: de plaats en maat van alle vensters, nissen en spaarvelden, de hoogte van de rondboogfries, de vorm van de steunberen (alleen de contour komt uit de BAG) en de pinakel op de oostgevel. De tweelingopeningen van de galmgaten zijn samengenomen tot één nis per gevel, de wijzerplaten en het dakvenstertje in het tentdak zijn weggelaten (kleiner dan 0,9 m), net als de windwijzer, de dakgoten en het 0,3 m overstek van het schipdak. De kerkhofmuur met hek ten zuiden van de kerk staat niet in het model: de muur is dunner dan 0,9 m en geen deel van het BAG-pand.

## Controle

De generator levert één gesloten component met genus 0 (1380 driehoeken). De catalogustest in `tests/landmark-models.test.ts` van de webshop plaatst het model en geeft met `supportedSolid` bij 45 graden een volumeverhouding van 1,00: de export hoeft niets op te vullen. Een plaatsing op de echte PDOK-terreintegels (via `loadCatalogLandmarkMeshes` met het PDOK-maaiveld als `groundSampler`) zet de modelvoet tussen 0,04 m boven en 0,39 m onder het maaiveld rond de gevels. Renders van vier kanten naast de 3D BAG-reconstructie en Commons-foto's zijn vergeleken; het model heeft aan elke kant de steunberen, de torenfries, de spaarvelden of vensters en de opstaande oostgevel extra.

## Bronnen

- [3D BAG pand 0453100000025845](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0453100000025845) (dakvlakken, goten, nokken)
- [BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0) (contour en steunberen)
- [AHN-DSM en -DTM 0,5 m via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0) (controle torenhoogte en maaiveld)
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0)
- [Rijksmonumentenregister 37067](https://monumentenregister.cultureelerfgoed.nl/monumenten/37067)
- [Wikipedia](https://nl.wikipedia.org/wiki/Engelmunduskerk_(Velsen-Zuid))
- [Wikimedia Commons, foto's van alle gevels](https://commons.wikimedia.org/wiki/Category:Engelmunduskerk,_Velsen-Zuid)
