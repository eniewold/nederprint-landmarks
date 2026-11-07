# Nicolaaskerk Ellecom

Landmark voor de Nicolaas- of Dorpskerk in Ellecom, BAG-pand `0275100000022702`. Het model toont de romaanse westtoren, het brede schip, het driezijdige laatgotische koor en de zijaanbouw. De deur, vensters en galmgaten zijn als blinde nissen vereenvoudigd.

De kerk gaat terug op de middeleeuwen; het BAG-bouwjaar 1870 beschrijft niet de gehele ouderdom van het gebouw. De tufstenen toren is twaalfde-eeuws en het schip werd later vervangen.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0275100000022702): maaiveld NAP +12,057 m en kerknok circa NAP +26,93 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torenpixel NAP +38,46 m, circa 26,4 m boven maaiveld.
- [Rijksmonumentenregister 42128](https://monumentenregister.cultureelerfgoed.nl/monumenten/42128), [gemeente over de kerk](https://kerkrhedenellecomdesteeg.nl/nicolaaskerk-ellecom/) en [foto's uit verschillende richtingen](https://commons.wikimedia.org/wiki/Category:Dutch_Reformed_Church,_Ellecom).

Dakhellingen, goothoogten, afmetingen van de aanbouw, steunberen en nissen zijn geschat uit AHN, 3DBAG en foto's. De kleine spitstop is voor de 1:1000-print verbreed. De windvaan en het fijne maaswerk zijn weggelaten. Het smalle uiteinde kan in AHN te laag zijn gemeten.

## Controle

De generator maakt een gesloten en samenhangend volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert plaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m is met en zonder landmark als preview en 3MF geëxporteerd en vanuit vier gelijke richtingen vergeleken met de PDOK-reconstructie en schuine foto's.

Controleer de plaatsing en de aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/52.03165/6.09233/200/1x1/0).
