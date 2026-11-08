# Kerk van Garmerwolde

Romano-gotische kerk met vrijstaande zadeldaktoren aan Dorpsweg 69 in Garmerwolde. Het model vervangt BAG-panden `0009100007677186` (kerk) en `0009100007680336` (toren).

## Bronnen en werkwijze

- [3DBAG: kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0009100007677186) en [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0009100007680336), voor omtrek, richting en dakhoogte.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/9780) en [geschiedenis van de kerk](https://www.kerkgarmerwolde.nl/historie).
- [Wikimedia Commons: foto's van kerk en toren](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Garmerwolde)), voor gevels en zadeldaken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa −0,05 m NAP; de torennok is over meerdere punten zichtbaar circa 19,8 m NAP. Enkele hogere losse punten zijn waarschijnlijk nabijgelegen boomtakken.

Het westelijke schip is in 1859 gesloopt en is niet gemodelleerd. De resterende kerk en toren zijn twee vrijstaande, gesloten onderdelen; koor, dwarspanden en zadeldaken zijn afzonderlijke bouwdelen. Vensternissen, steunberen en toegang zijn op basis van foto's geschat en voor 1:1000 vereenvoudigd.

## Bestanden en controle

`kerk-van-garmerwolde.glb` en de JSON plaatsen beide onderdelen in RD-coördinaten; `kerk-van-garmerwolde-1-1000.stl` bevat de twee losse printonderdelen in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Beide delen zijn als gesloten volumes gecontroleerd met de 45-graden ondersteuningstoets en meerdere doorsneden.

Genereren: `node scripts/generate-kerk-van-garmerwolde.mjs` vanuit de landmark-repository.
