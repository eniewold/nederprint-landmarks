# Sint-Barbarakerk Culemborg

Landmark voor de rooms-katholieke Sint-Barbarakerk aan de Markt, gebouwd in 1885–1886 naar ontwerp van P.J. van Genk. Dit is een andere kerk dan de Grote of Barbarakerk en de oud-katholieke Barbara-en-Antoniuskerk. Het model vervangt BAG-pand `0216100000002222` en omvat de basilicale kerk, zijbeuken, dwarsbeuk, vieringsspits en asymmetrische westtoren. De roosvensters en galmgaten zijn als blinde nissen uitgevoerd.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0216100000002222): maaiveld NAP +4,852 m en kerkelijke nok circa NAP +29,97 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste gemeten punt rond de toren NAP +64,12 m, circa 59,27 m boven maaiveld. De top is dun en kan in AHN onderschat zijn.
- [Culemborgse publicatie](https://www.seniorencollectiefculemborg.nl/wp-content/uploads/2023/11/Kijker-2023-05-32s.pdf) noemt een torenhoogte van 62 m; dit model volgt die waarde.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/11576), [bouwbeschrijving](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0049.php) en [foto's van de kerk](https://commons.wikimedia.org/wiki/Category:Sint-Barbarakerk_(Culemborg)).

De maatvoering van de daken, zijbeuken, achteraanbouw, vieringsspits, galmgaten en vensternissen is geschat op basis van 3DBAG, AHN en foto's. De dunne spitsen en hoekspitsjes zijn voor schaal 1:1000 verbreed. Maastracering, windvanen en fijn metselwerk zijn weggelaten.

## Controle

De generator maakt één gesloten volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert plaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m met en zonder landmark is als preview en 3MF geëxporteerd en uit vier gelijke richtingen met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer de plaatsing en de aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.95683/5.22658/200/1x1/0).
