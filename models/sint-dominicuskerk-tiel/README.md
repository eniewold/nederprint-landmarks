# Sint-Dominicuskerk, Tiel

De kerk aan het Sint-Walburgkerkpad is een driebeukige basiliek met lagere zijbeuken, een hoger dwarsbouwdeel en een driezijdig gesloten apsis. De deels ingebouwde toren draagt een laag tentdak. Het model heeft afzonderlijke vlakke daken, steunberen en ondiepe nissen voor de gevelramen en galmgaten. De volumes vormen één gesloten model voor afdrukken zonder ondersteuning op 1:1000.

## Bronnen en plaatsing

- [Rijksmonument 520655](https://monumentenregister.cultureelerfgoed.nl/monumenten/520655) en [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Complexen/520654): de kerk dateert uit 1939–1940 en is ontworpen door J.J.M. van Halteren. De BAG-datering 1900 is geen bouwjaar van de huidige kerk.
- [Raad van State, uitspraak 200905155/1/R2](https://www.raadvanstate.nl/uitspraken/%4050698/200905155-1-r2/): de toren is circa 40 m hoog.
- [3DBAG-pand 0281100000019337](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0281100000019337): contour, ligging en dakvlakken.
- [AHN-WCS van PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM en DTM op 0,5 m. Het maaiveld direct om de kerk ligt rond +6–7 m NAP; het torendak geeft circa +41,7 tot +46,5 m NAP en is zonder rastergat gemeten. Een hogere cel van +48,87 m NAP nabij de top kan het kruis bevatten. De nok van het schip ligt rond +28 m NAP.
- [Foto parochie](https://suitbertusparochie.nl/blog/portfolio/h-dominicuskerk-tiel/), [foto apsis en toren](https://commons.wikimedia.org/wiki/File:Tiel_Dominicuskerk.JPG), [foto zijgevel](https://commons.wikimedia.org/wiki/File:Sint_Dominicuskerk_-1_Tiel_1306_-_056.jpg) en [Open Monumentendag Tiel 2021, p. 14](https://www.oudheidkamer-tiel.nl/docs/omd2021.pdf): vormen en gevelverdeling.

De RD-oorsprong is 158026 / 433128; de X-as volgt de nok naar de toren. Het model meet ongeveer 53,1 × 28,3 × 40,8 m inclusief de ingegraven voet. Verhoudingen van kapellen, steunberen, lichtbeuk en nissen zijn uit AHN, 3DBAG en foto's geschat. Dun metselwerk, glasindeling en het kruis zijn vereenvoudigd of weggelaten vanwege de printschaal.

## Genereren en controleren

`node scripts/generate-sint-dominicuskerk-tiel.mjs` schrijft GLB, JSON en STL 1:1000; met `--scale 100` wordt de losse STL 1:100 gemaakt. Het model bestaat uit één gesloten component met genus 0. De plaatsing en printbaarheid op 1:1000 zijn getest. Twee echte 150 × 150 m-uitsneden, met en zonder landmark, zijn geëxporteerd; vier richtingen zijn vergeleken met de PDOK-reconstructie en schuine foto's. Controleer in de kaart de toren, het hogere dwarsbouwdeel en de lichtbeuk langs de zijgevels.
