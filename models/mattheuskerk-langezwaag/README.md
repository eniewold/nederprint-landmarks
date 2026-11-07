# Mattheuskerk Langezwaag

Vereenvoudigd model van de Mattheuskerk in Langezwaag, rijksmonument 31858: een eenbeukige kerk met driezijdige koorsluiting en grotendeels ingebouwde toren met achtzijdige spits. De dakvlakken en bouwdelen vormen een gesloten model met blinde gevelnissen.

## Bronnen en maatvoering

- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0086100000351002): contour en dakvlakken; maaiveld circa NAP +0,90 m.
- [PDOK AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogtecontrole, hoogste spitsmeting NAP +27,33 m.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/31858), [gemeente Opsterland](https://www.opsterland.nl/17-mattheustsjerke) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Matthe%C3%BCskerk,_Langezwaag): bouwgeschiedenis, achtkantige spits en gevelaanzichten.

Afmetingen en plaatsen van de blinde vensters en galmgaten en de toegang zijn geschat op foto's. De top van de smalle spits is benaderd met AHN en foto's. Ramen, raamroeden en windvanen zijn te klein op 1:1000 en weggelaten; de galmgaten hebben voor printbaarheid spitse bovenkanten.

## Gebruik

Draai `node scripts/generate-mattheuskerk-langezwaag.mjs` vanuit de modellenrepository. Het GLB gebruikt meters en Y omhoog; de STL is in millimeters op schaal 1:1000. De oorsprong is RD (196345; 555234,5), de voet ligt 0,5 m onder het maaiveld. De catalogus vervangt BAG-pand `0086100000351002`.
