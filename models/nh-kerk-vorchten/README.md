# N.H. Kerk Vorchten

De Johannes de Doperkerk aan Kerkweg 17 in Vorchten heeft een romaanse toren met zadeldak, een lager schip en een hoger gotisch koor met driezijdige sluiting. Het model vervangt BAG-pand `0246100000012183`.

## Bronnen en werkwijze

- [3DBAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0246100000012183), voor omtrek, oriëntatie en dakvormen.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/21157) en [geschiedenis van de kerk](https://kerkvorchten.nl/geschiedenis).
- [Wikimedia Commons: foto's kerk Vorchten](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Vorchten), gebruikt voor toren, dakvormen en gevels.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), maaiveld circa 4,164 m NAP; de torennok is goed meetbaar circa 23,3 m NAP.

Schip, westtoren, koor en steunberen zijn afzonderlijke bouwdelen die tot één gesloten solide zijn verenigd. Afmetingen van steunberen, blinde vensternissen en de toegang zijn geschat en voor schaal 1:1000 vereenvoudigd; de nokhoogten zijn op basis van BAG en AHN afgestemd. De windvaan is op deze schaal weggelaten.

## Bestanden en controle

`nh-kerk-vorchten.glb` en de JSON plaatsen het model in RD-coördinaten; `nh-kerk-vorchten-1-1000.stl` is de printversie in millimeters. Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Het model is als één gesloten volume gecontroleerd met de 45-graden ondersteuningstoets en meerdere doorsneden.

Genereren: `node scripts/generate-nh-kerk-vorchten.mjs` vanuit de landmark-repository.
