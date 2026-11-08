# Jacobskerk Winterswijk

Gotische Jacobskerk aan de Markt in Winterswijk, met hoge westtoren, lager schip en hoger veelhoekig gesloten koor. Het model vervangt BAG-pand `0294100000414172`.

## Bronnen en werkwijze

- [3DBAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0294100000414172), voor omtrek, richting en dakvormen.
- [Rijksmonumentenregister kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/39053) en [toren](https://monumentenregister.cultureelerfgoed.nl/monumenten/39054).
- [Stichting Vrienden van de Jacobskerk](https://www.jacobskerkwinterswijk.nl/) geeft de torenhoogte als 57 m en de omloop op 34 m.
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Jacobskerk_(Winterswijk)), voor toren, koor en gevels.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), maaiveld circa 34,481 m NAP; hoogste meetcel 92,65 m NAP, mogelijk inclusief windvaan.

Schip, koor, toren en ingesnoerde spits zijn afzonderlijke bouwdelen tot één gesloten solide verenigd. De top is gebaseerd op de genoemde torenhoogte; het spitsprofiel, steunberen, blinde vensternissen en toegang zijn uit foto's geschat en voor 1:1000 vereenvoudigd. De open omloop en windvaan zijn weggelaten.

## Bestanden en controle

`jacobskerk-winterswijk.glb` en de JSON plaatsen het model in RD-coördinaten; `jacobskerk-winterswijk-1-1000.stl` is de printversie in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Het model is als één gesloten volume gecontroleerd met de 45-graden ondersteuningstoets en twaalf doorsneden.

Genereren: `node scripts/generate-jacobskerk-winterswijk.mjs` vanuit de landmark-repository.
