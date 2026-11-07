# Sint Vituskerk (Stiens)

Vereenvoudigd, gesloten landmarkmodel van de middeleeuwse Sint-Vituskerk met de hoge zadeldaktoren, het schip, het smallere vijfzijdig gesloten koor en de lage zuidaanbouw. De dakvlakken zijn vlakke hellingen, geen gestapelde hoogtelagen. De spitsboogvensters en galmgaten zijn blinde nissen voor printbaarheid.

- `sint-vituskerk-stiens.glb`: kaart- en exportmodel in meters, glTF Y omhoog, node `building:kerk`.
- `sint-vituskerk-stiens.json`: cataloguspositie en BAG-vervanging.
- `sint-vituskerk-stiens-1-1000.stl`: los printbaar model in millimeters op schaal 1:1000.
- Generator: `scripts/generate-sint-vituskerk-stiens.mjs`.

De oorsprong ligt bij RD (179704, 586259,3), +X langs de nok oostwaarts (0,998270, 0,058798); de bodem ligt 0,5 m onder het gemeten maaiveld. Het model vervangt BAG-pand `0081100000004723`. BAG/3D BAG leveren de voetafdruk en daklijnen, het AHN DSM de hoogte en de maaiveldschatting NAP +2,611 m. De hoogte van de torennok is in het model 37,55 m boven maaiveld.

De ovale blinde nissen in de koorsluiting zijn zichtbaar op de foto's. De maten en posities van vensters, galmgaten, portaal en lage zuidaanbouw zijn geschat aan de hand van foto's. Raamroeden, wijzers, fijn metselreliëf en windvaan zijn weggelaten omdat zij op 1:1000 te dun zijn. De hoeken en de kappen zijn als regelmatige vlakken gebouwd; de BGT-omtrek en het AHN kunnen iets verschillen van de idealisatie.

De generator controleert een gesloten verbonden onderdeel. De catalogus- en printtest controleert de plaatsing, geslotenheid en 45°-overhang op schaal 1:1000. Een volledige uitsnede van 150 m is met en zonder landmark geëxporteerd en vanuit vier hoeken naast PDOK en bronfoto's bekeken.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0081100000004723), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/24542), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Vituskerk,_Stiens) en [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0).
