# Magnuskerk Bellingwolde

Laatgotische kerk aan de Hoofdweg in Bellingwolde met een afzonderlijk staande klokkentoren. Het model vervangt zowel BAG-pand `0007100000002920` (kerk) als `0007100000002921` (toren).

## Bronnen en werkwijze

- [3DBAG: kerk en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0007100000002920), voor omtrek, richting en dakhoogte.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/8898) en [beschrijving vrijstaande toren](https://groningen.erfgoedcms.nl/lemma/bellingwolde).
- [Wikimedia Commons: foto's van kerk en toren](https://commons.wikimedia.org/wiki/Category:Magnuskerk), voor westelijke aanbouw, lantaarn en gevels.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld bij kerk circa 1,439 m NAP; topcel toren 28,952 m NAP met meetbare aangrenzende cellen.

Kerk en toren zijn twee vrijstaande, gesloten onderdelen. Schip, schilddak, aanbouw, steunberen, toren, lantaarn en spits zijn opgebouwd uit bouwdelen en dakvlakken. Spitsprofiel, steunberen, vensternissen en toegang zijn naar foto's geschat en vereenvoudigd; de fijne omloop en windvaan zijn weggelaten.

## Bestanden en controle

`magnuskerk-bellingwolde.glb` en de JSON plaatsen beide onderdelen in RD-coördinaten; `magnuskerk-bellingwolde-1-1000.stl` bevat de twee losse printonderdelen in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Beide delen zijn als gesloten volumes gecontroleerd met de 45-graden ondersteuningstoets en meerdere doorsneden.

Genereren: `node scripts/generate-magnuskerk-bellingwolde.mjs` vanuit de landmark-repository.
