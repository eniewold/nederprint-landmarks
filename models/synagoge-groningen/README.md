# Synagoge Groningen

Synagoge uit 1906 aan de Folkingestraat in Groningen, met twee ronde hoektorens en lage koepels. Het model vervangt BAG-pand `0014100010937344`.

## Bronnen en werkwijze

- [3DBAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010937344), voor omtrek, richting en dakhoogten.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/18452) en [Synagoge Groningen: het gebouw](https://www.synagogegroningen.nl/het-gebouw).
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Synagogue,_Groningen), voor straatgevel, entree en koepeltorens. De zij- en achtergevel zijn door de aansluitende stadsbebouwing minder goed op foto's zichtbaar.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 2,837 m NAP; koepeltoppen 22,072 en 22,036 m NAP met nabijgelegen geldige meetpunten.

Gebedsruimte, zadeldak met achterste dwarskap volgens 3DBAG, entree, bijgebouwen, torens en koepels zijn afzonderlijke bouwdelen verenigd tot één gesloten volume. Achter- en zijgevels, entreedetails en koepelprofielen zijn geschat en voor 1:1000 vereenvoudigd; het roosvenster is als blinde nis uitgevoerd.

## Bestanden en controle

`synagoge-groningen.glb` en de JSON plaatsen het model in RD-coördinaten; `synagoge-groningen-1-1000.stl` is de printversie in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Het model is als één gesloten volume gecontroleerd met de 45-graden ondersteuningstoets en zeven doorsneden.

Genereren: `node scripts/generate-synagoge-groningen.mjs` vanuit de landmark-repository.
