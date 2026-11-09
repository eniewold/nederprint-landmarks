# DePetrus Vught

Voormalige Sint-Petruskerk, in 1884 gebouwd naar ontwerp van Carl Weber, sinds 2018 ontmoetingscentrum DePetrus. Het model toont het langschip, zijbeuken, rond gesloten koor, dwarsbeuken met ronde afsluitingen, hoektorentjes en de centrale vieringtoren.

- BAG-pand `0865100000009197` omvat kerk en aangrenzende lage paviljoen- en luifeldelen: [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0865100000009197), [monument 521327](https://monumentenregister.cultureelerfgoed.nl/monumenten/521327), [gevel- en koorfoto's](https://commons.wikimedia.org/wiki/Category:Sint_Petrus,_Vught), [geschiedenis](https://www.vughtsmuseum.nl/2017/09/03/sint-petruskerk/).
- BAG-contour, PDOK-luchtfoto en AHN5 DSM/DTM 0,5 m bepalen de positie en dakprofielen. Maaiveld NAP +5,52 m; schipnok circa NAP +38 m. De beheerder vermeldt een [torenhoogte van 57,9 m](https://www.depetrus.nl/praktische-informatie/); de PDOK-reconstructie kapt de spitse bekroning af.
- Oorsprong RD (148832, 407706), X-as (0,880, 0,475); onderkant 0,5 m onder maaiveld. Vorm en hoogten van lantaarn, ronde afsluitingen en hoektorentjes zijn geschat op basis van foto's. De lage, deels open paviljoens en luifels zijn ter wille van 1:1000-printbaarheid vereenvoudigd tot gesloten volumes; de omtrek is benaderd. Vensters zijn ondiepe nissen; maaswerk ontbreekt.
- Generator: `node scripts/generate-depetrus-vught.mjs --scale 1000` en `--scale 100`. De 1:1000-STL meet circa 67 × 47 × 58 mm, heeft één verbonden vlakke voet en is op printbaarheid zonder extra ondersteuning getoetst.
- Controle: http://localhost:3000/kaart/51.65812/5.29799/200/1x1/0
