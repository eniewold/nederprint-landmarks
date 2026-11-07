# Johanneskerk Lichtenvoorde

Landmark voor de Johanneskerk, BAG-pand `1586100000022893`. Het model toont de zeventiende-eeuwse zaalkerk met de oudere gotische koorsluiting, de toren en het aangebouwde kerkcentrum Johanneshof. Dat centrum maakt volgens BAG en 3DBAG deel uit van hetzelfde pand en is daarom met vereenvoudigde hoofdvolumes opgenomen. De kerkvensters, galmgaten en het portaal zijn blinde nissen.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1586100000022893): gebouwcontouren, dakvlakken en maaiveld NAP +20,229 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torenpixel rond NAP +41,23 m; de dunne spits wordt niet volledig geraakt.
- [Achterhoeknieuws, 2025](https://www.achterhoeknieuws.nl/nieuws/religie/528139/winnares-donateursactie-plaatst-gerestaureerde-windhaan-op-ke) noemt een torenhoogte van 35 m. Het model volgt die hoogte.
- [Rijksmonumentenregister 25819](https://monumentenregister.cultureelerfgoed.nl/monumenten/25819), [bouwgeschiedenis](https://www.oudheidkundelichtenvoorde.nl/lemma/johannes-kerk-58396) en [foto's uit verschillende richtingen](https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Lichtenvoorde).

Dakhellingen, goten, torengeleding en afmetingen van vensternissen zijn geschat uit 3DBAG, AHN en foto's. Het kerkcentrum is vereenvoudigd tot twee vleugels en een tussenlid; de exacte geveldetails en aansluitingen zijn geschat op basis van contour en dakvlakken, met een beperkt zichtbaar zijaanzicht als fotocontrole. De spitstop is voor 1:1000 verbreed; de windvaan en fijne raamtracering zijn weggelaten.

## Controle

De generator maakt één gesloten volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert plaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m is met en zonder landmark als preview en 3MF geëxporteerd en uit vier gelijke richtingen met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer op [de kaart](http://localhost:3000/kaart/51.98834/6.56909/200/1x1/0) de plaatsing en de aansluiting van de vleugels van het kerkcentrum op de kerk.
