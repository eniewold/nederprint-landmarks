# Kerk van Holwierde

Kruiskerk met veelhoekig koor en dakruiter aan Kerkpad 1 in Holwierde. Het model vervangt BAG-pand `0010100000017534`. De oude vrijstaande Juffertoren is in de negentiende eeuw verdwenen en maakt geen deel uit van het huidige model.

## Bronnen en werkwijze

- [3DBAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0010100000017534), voor omtrek, richting en dakhoogten.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/9474) en [geschiedenis van de kerk](https://www.kerkholwierde.nl/historie).
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Kerk_van_Holwierde), met recente foto's voor de huidige dakruiter; oudere foto's tonen een eerdere vorm.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 1,235 m NAP; topcel dakruiter 31,272 m NAP met geldige cellen direct noord, zuid, oost en west; zuidoostelijk zit een gat in de flank.

Schip, dwarspand, koor, dakvlakken en dakruiter zijn afzonderlijke bouwdelen verenigd tot één gesloten volume. Het profiel van de dakruiter, steunberen, vensternissen en toegang zijn geschat naar foto's en voor 1:1000 vereenvoudigd.

## Bestanden en controle

`kerk-van-holwierde.glb` en de JSON plaatsen het model in RD-coördinaten; `kerk-van-holwierde-1-1000.stl` is de printversie in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Het model is als één gesloten volume gecontroleerd met de 45-graden ondersteuningstoets en zeven doorsneden.

Genereren: `node scripts/generate-kerk-van-holwierde.mjs` vanuit de landmark-repository.
