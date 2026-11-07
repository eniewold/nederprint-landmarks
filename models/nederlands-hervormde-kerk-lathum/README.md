# Nederlands Hervormde Kerk Lathum

Landmark voor de gotische Nederlands Hervormde Kerk, ook Onze Lieve Vrouwekerk genoemd, BAG-pand `0299100000405445`. Het model omvat de eenbeukige kerk, de driezijdige koorsluiting en de westtoren met ingesnoerde spits. Het portaal, de spitsboogvensters en galmgaten zijn als blinde nissen vereenvoudigd.

De kerk is ouder dan het BAG-bouwjaar 1608: volgens de monumentbeschrijving dateren schip en toren uit de vijftiende eeuw en is het koor ouder.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0299100000405445): omtrek en maaiveld NAP +10,686 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torenpixel NAP +32,84 m, circa 22,15 m boven maaiveld; de smalle punt is in het raster vermoedelijk onderschat.
- [Gelderlander, 2006](https://www.stopumts.nl/doc.php/Berichten%20Nederland/1021/__zo_n_mast_is_moeilijk_tegen_te_houden___%28lathum%29_de_gelderlander): de kerktoren wordt beschreven als ongeveer 25 m hoog. Het model volgt die hoogte.
- [Rijksmonumentenregister 8149](https://monumentenregister.cultureelerfgoed.nl/monumenten/8149), de [monumentopmeting en bouwbeschrijving](https://www.dbnl.org/tekst/kuil005kwar01_01/kuil005kwar01_01_0005.php) en [schuine foto's](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Lathum).

De goten, dakhelling, torengeleding en nismaten zijn geschat uit 3DBAG, AHN en foto's. Het koor is deels afgeschermd op de foto's; de sluiting en oorspronkelijke vensters volgen de monumentopmeting. De torenspits is aan de punt verbreed en de galmgaten hebben printbare puntbogen; windvaan en raamtracering zijn weggelaten.

## Controle

De generator maakt één gesloten volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert plaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m is met en zonder landmark als preview en 3MF geëxporteerd en vanuit vier gelijke richtingen met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer de plaatsing, de koorsluiting en aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.98605/6.02117/200/1x1/0).
