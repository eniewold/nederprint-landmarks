# Walburgakerk, Ried

De Walburgakerk staat aan Kerkpad 1 in Ried (rijksmonument 15865). De kerkelijke gemeente dateert de oorsprong rond 1100, beschrijft een verbouwing in 1653 en de vernieuwing van de torenspits in 1926. De BAG noemt 1900 als bouwjaar.

## Bronnen en maten

- [3D BAG, pand 0070100000315736](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000315736): voetafdruk, de richting van de nok en dakvlakken. Maaiveld NAP +1,941 m, nok NAP +14,05 m.
- [PDOK AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste gemeten punt van de spits NAP +30,535 m; de spits loopt tot ongeveer 28,6 m boven maaiveld.
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Walburgakerk,_Ried): spits met ingesnoerde voet, vijf zuidelijke vensters, torenopeningen, koorsluiting en noordelijke consistorie.
- [PKN Ried-Skingen](https://pkn.ried-skingen.nl/ried-walburgakerk/) en [rijksmonument 15865](https://monumentenregister.cultureelerfgoed.nl/monumenten/15865): naam en historie.

De vorm van de torenspits en de plaats en afmetingen van de vensternissen zijn aan de hand van de foto's geschat; de dakvlakken en de twee lage noordelijke delen zijn gebaseerd op BAG en AHN. De kleine schoorsteen, windvanen en dakgoot zijn kleiner dan 0,9 m en weggelaten voor de schaal 1:1000. De ronde bogen zijn in het model als spitse blinde nissen uitgevoerd voor printbaarheid.

## Model en print

De oorsprong ligt op RD (168536,7; 581859,4), +X loopt naar het koor, +Y naar de noordkant. Het model is opgebouwd uit een schilddak met vlakke dakvlakken, een vierkante toren met vierzijdige spits en twee lage aanbouwdelen. De onderkant ligt 0,6 m onder het maaiveld. Het GLB bevat één gesloten `building:kerk`-node en vervangt het BAG-pand. De STL is schaal 1:1000.

Genereren: `node scripts/generate-walburgakerk-ried.mjs`.
