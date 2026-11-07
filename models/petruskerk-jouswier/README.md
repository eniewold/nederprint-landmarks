# Petruskerk Jouswier

Vereenvoudigd model van de Petruskerk aan de Bergsmawei in Jouswier, rijksmonument 31575. De kerk uit 1557 heeft een driezijdige koorsluiting en een oudere zadeldaktoren. Het model bestaat uit gesloten bouwdelen met vlakke dakvlakken en blinde venster- en galmgaten.

## Bronnen en maatvoering

- [BAG en 3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000203079): contour, asrichting, dakvlakken en hoogten; maaiveld circa NAP +1,96 m.
- [PDOK AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogtecontrole van schip en toren.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/31575) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Petruskerk,_Jouswier): bouwgeschiedenis en gevelaanzichten.

De gevelindeling, venster- en galmgaten, hun diepte en de toegang zijn geschat op foto's. Kleine details, metselwerk en windvaan zijn weggelaten omdat ze op 1:1000 te klein zijn. De blinde nissen vervangen de niet printbare openingen.

## Gebruik

Draai `node scripts/generate-petruskerk-jouswier.mjs` vanuit de modellenrepository. Het GLB gebruikt meters en Y omhoog; de STL is in millimeters op schaal 1:1000. De oorsprong is RD (200701,78; 596180,81), de voet ligt 0,5 m onder het maaiveld. De catalogus vervangt BAG-pand `0058100000203079`.
