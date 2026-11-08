# Oude Kerk Oosterbeek

Model van de Oude Kerk aan de Benedendorpsweg 134 in Oosterbeek, rijksmonument 32432 en BAG-pand 0274100000000610. De eenbeukige romaanse zaalkerk ontstond rond het jaar 1000. Na oorlogsschade in 1944 werden kerk en toren hersteld en het versmalde, ronde koor in 1949 opnieuw gebouwd.

## Bronnen en maten

- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/32432) en [bouwgeschiedenis van de kerk](https://www.oudekerkoosterbeek.nl/architectuur/).
- [Wikimedia Commons, foto's](https://commons.wikimedia.org/wiki/Category:Oude_Kerk,_Oosterbeek).
- BAG voor de voetafdruk, 3DBAG LoD2.2 voor dakvlakken en nokken en AHN DSM voor hoogtecontrole. Maaiveld circa NAP +13,19 m; hoogste AHN-punt NAP +37,84 m, vermoedelijk inclusief de fijne bekroning. De dakpunt van de toren ligt volgens 3DBAG rond 23,2 m boven maaiveld en de scheepsnok op 12,8 m.

Het model omvat het schip, zadeldak, versmalde koor met halfronde apsis, toren met vierzijdig tentdak, schoorsteen, noordportaal en lage aanbouwen. De posities en afmetingen van vensters, galmgaten, portaal en aanbouwen zijn vereenvoudigd en geschat uit foto's en BAG. De torenpunt is verbreed tot 1 m. Windvaan, kruis, klokwijzers en klein metselwerkreliëf zijn vanwege de printschaal weggelaten. De voetafdruk is circa 32,8 bij 16,5 m, de hoogte boven maaiveld circa 23,2 m.

## Productie en controle

Het model is één gesloten volume voor afdruk op 1:1000 zonder steunmateriaal. Genereer GLB, JSON en STL opnieuw met `node scripts/generate-oude-kerk-oosterbeek.mjs` in de landmarks-repository. De plaatsings- en printcontrole staat in de webshop in `tests/landmark-models.test.ts`. Een uitsnede van 150 bij 150 m is geëxporteerd en het model is van vier zijden vergeleken met PDOK en foto's. Controleer de ligging via [de kaart](http://localhost:3000/kaart/51.97797/5.83781/200/1x1/0).
