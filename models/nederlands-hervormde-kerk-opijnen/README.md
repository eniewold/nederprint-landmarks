# Nederlands Hervormde Kerk, Opijnen

De kerk aan de Stoepstraat is een witgepleisterde zaalkerk met een driezijdig gesloten oostgevel. Aan de westzijde staat een bakstenen toren met ingesnoerde achtzijdige spits. Het schip en de toren hebben afzonderlijke dakvlakken; tegen de zijgevels en torenaansluiting staan steunberen. De ingang, galmgaten en vensters zijn ondiepe nissen. De delen vormen één gesloten volume voor afdrukken zonder ondersteuning op 1:1000.

## Bronnen en plaatsing

- [Kerk, rijksmonument 30337](https://monumentenregister.cultureelerfgoed.nl/monumenten/30337) en [toren, rijksmonument 30338](https://monumentenregister.cultureelerfgoed.nl/monumenten/30338). De kerk dateert uit circa 1860; de neogotische toren is later aangebouwd.
- [Gemeente Opijnen, schuine luchtfoto](https://image.protestantsekerk.net/uploads/klant661/%285%29kerk_opijnen_informatie.jpeg) en [foto vanaf de andere zijde](https://img.kerkdienstgemist.nl/90901091/images/large_61068011_361007864620187_2489800951037165568_n.jpeg?v=1735468273): dakvorm, steunberen, entree en torengevels. [Foto Archimon](https://www.archimon.nl/gelderland/opijnenherv21.jpg) en [historische foto](https://www.olzheim.nl/images/oud%20varik/7872379.jpg) tonen de voorzijde.
- [3DBAG-pand 0304100000002758](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0304100000002758): BAG-contour en kap van de zaal, maar de gereconstrueerde toren is te laag. Het pand omvat het complex.
- [PDOK AHN-WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM en DTM met celgrootte 0,5 m. Het maaiveld naast de kerk ligt circa +4,0 m NAP, de zaalnok rond +16,99 m NAP en de hoogste cel bij de spits op +28,04 m NAP. Direct om de spits zijn geldige cellen aanwezig; twee lage cellen nabij de zuidrand van de toren bevatten NoData. De exacte bovenpunt en fijne onderdelen zijn niet met zekerheid uit één rastercel af te leiden.

De RD-oorsprong is 149034, 426616; de lokale X-as loopt langs de nok naar het oosten. De totale modelafmetingen zijn ongeveer 27,4 × 10,35 × 24,35 m, inclusief de ingegraven voet. Goot- en topwaarden zijn op het AHN gebaseerd; torenromp, de verhoudingen van de ingesnoerde spits, afmetingen en locaties van steunberen, toegang en vensters zijn uit luchtfoto's en het raster geschat. Dun metselreliëf, wijzerplaat en windvaan zijn vanwege de schaal vereenvoudigd of weggelaten.

## Genereren en controleren

Voer `node scripts/generate-nederlands-hervormde-kerk-opijnen.mjs` uit voor GLB, JSON en STL 1:1000; met `--scale 100` ontstaat de losse STL op 1:100. Het resultaat heeft één component en genus 0. De printtest op 1:1000 en twee werkelijke 150 × 150 m-uitsneden met en zonder landmark zijn geslaagd. Vier richtingen zijn vergeleken met de PDOK-reconstructie en schuine foto's. Controleer op de kaart de positie en hoogte van de toren, de steunberen en de aansluiting van de kerkvoet op het maaiveld.
