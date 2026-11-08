# Nieuwe Kerk Groningen

Zeventiende-eeuwse kruiskerk aan het Nieuwe Kerkhof in Groningen met vier zadeldaken en een centrale vieringtoren. Het model vervangt BAG-pand `0014100010921060`.

## Bronnen en werkwijze

- [3DBAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010921060), voor omtrek, richting en dakhoogten.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/18583) en [geschiedenis van de kerk](https://nieuwekerkgroningen.nl/geschiedenis-van-het-gebouw/).
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Nieuwe_Kerk_(Groningen)), voor het kruisvormige gebouw, vieringtoren en gevels.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 5,471 m NAP; topcel 49,796 m NAP met rondom geldige lagere cellen. OSM noemt 42 m zonder gespecificeerd referentiepunt; het model volgt AHN, circa 44,32 m boven maaiveld.

Vier dwarskappen, lager afgeschuinde hoekvolumes en de vereenvoudigde vieringtoren zijn afzonderlijke bouwdelen en verenigd tot één gesloten volume. Hoogte en vorm van de torenverdiepingen, vensternissen en lage hoekdaken zijn geschat naar foto's en voor 1:1000 vereenvoudigd. De fijne open zuiltjes, ornamenten en windvaan zijn weggelaten.

## Bestanden en controle

`nieuwe-kerk-groningen.glb` en de JSON plaatsen het model in RD-coördinaten; `nieuwe-kerk-groningen-1-1000.stl` is de printversie in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Het model is als één gesloten volume gecontroleerd met de 45-graden ondersteuningstoets en tien doorsneden.

Genereren: `node scripts/generate-nieuwe-kerk-groningen.mjs` vanuit de landmark-repository.
