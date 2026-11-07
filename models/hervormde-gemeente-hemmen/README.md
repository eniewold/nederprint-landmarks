# Hervormde Gemeente Hemmen

Landmark voor de hervormde kerk van Hemmen, BAG-pand `1734101000026483`. Het model omvat het schip met driezijdige koorsluiting, de aangebouwde lage ruimten en de ingebouwde westtoren. De toreningang, galmgaten en kerkvensters zijn als blinde nissen vereenvoudigd.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1734101000026483): maaiveld NAP +9,197 m en dakcontour.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torenpixel NAP +30,61 m, circa 21,42 m boven maaiveld.
- Rijksmonumentenregister [kerk 36737](https://monumentenregister.cultureelerfgoed.nl/monumenten/36737) en [toren 36738](https://monumentenregister.cultureelerfgoed.nl/monumenten/36738); [historie van de gemeente](https://hervormdegemeentehemmen.nl/Kerkgebouw.html) en [foto's rondom](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Hemmen).

Dakhellingen, goten, vorm en afmetingen van de zijaanbouwen, torengeleding en nissen zijn geschat op basis van 3DBAG, AHN en foto's. De galmgaten zijn met puntige bovenzijde uitgevoerd voor steunvrij printen; de spits is aan de punt verbreed. Fijne kozijnen, windvaan en het hekwerk zijn weggelaten.

## Controle

De generator maakt één gesloten volume met vlakke onderzijde. De test in `tests/landmark-models.test.ts` controleert plaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000, inclusief doorsneden van de toren. Een uitsnede van 150 × 150 m met en zonder landmark is als preview en 3MF geëxporteerd en vanuit vier gelijke richtingen met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer de plaatsing en de aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.93423/5.70041/200/1x1/0).
