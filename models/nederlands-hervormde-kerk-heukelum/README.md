# Nederlands Hervormde Kerk Heukelum

Landmark voor de Hervormde Kerk in Heukelum, BAG-pand `0733100000000301`. Het model bevat het lagere westschip, het hogere koor, de dwarsarmen, de kleine grafkelder en de dakruiter met spits. Grote kerkvensters en de galmgaten zijn als blinde nissen weergegeven.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0733100000000301): omtrek en maaiveld NAP +3,62 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste punt bij de dakruiter NAP +30,36 m, circa 26,74 m boven maaiveld.
- [Rijksmonumentenregister 21988](https://monumentenregister.cultureelerfgoed.nl/monumenten/21988), de [geschiedenis van de gemeente](https://www.kerkheukelum.nl/geschiedenis), [torengeschiedenis](https://www.kerkheukelum.nl/de_toren/) en [schuine foto's](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Heukelum).

De goten, dakhellingen, nokken, grafkelder en vensternissen zijn geschat uit 3DBAG, AHN en foto's. De twee dwarsgevels hebben verschillende vensterindeling. De spits en de dakruiternissen zijn voor een 1:1000-print verbreed; de windvaan en het fijne maaswerk zijn weggelaten.

## Controle

De generator maakt één gesloten volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m is met en zonder landmark als preview en 3MF geëxporteerd en vanuit vier gelijke richtingen met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer de plaatsing en de aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.87397/5.07849/200/1x1/0).
