# Hervormde Kerk Rouveen

De Hervormde Kerk uit 1641 is een rechthoekige zaalkerk met schilddak, vierkante westtoren en tentdak. Dit model heeft steunberen, vensternissen, galmgaten, een aanbouw aan de noordgevel en vereenvoudigde uurwerken.

## Bronnen en schattingen

- [Rijksmonument kerk 47070](https://monumentenregister.cultureelerfgoed.nl/monumenten/47070) en [toren 34405](https://monumentenregister.cultureelerfgoed.nl/monumenten/34405).
- [3D BAG pand 0180100000006906](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0180100000006906): omtrek, dakvlakken en nokrichting.
- PDOK AHN DSM 0,5 m: maaiveld circa NAP +1,24 m, nok circa NAP +15,8 m en hoogste punt torendak circa NAP +27,7 m.
- [RCE-foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Rouveen)): voor- en zijgevels, torendak, vensters en bijgebouw.

Vensternissen, steunberen, galmgaten, dakluiken, torenuurwerken en kleine aanbouw zijn uit foto's vereenvoudigd en hun afmetingen zijn geschat. De uurwerken zijn ruitvormige nissen om zonder steun te kunnen printen. De punt van het tentdak is verbreed tot 0,9 m; windvaan en fijn glaswerk zijn kleiner dan 0,9 m en weggelaten.

Het nabijgelegen BAG-pand `0180100000009877` ligt circa 3,8 m van de kerk; zijn PDOK-top is niet hoger dan de AHN-waarden, zodat het behouden blijft.

## Model en print

Het GLB bevat één gesloten node `building:kerk` in meters met Y omhoog. De oorsprong is RD (209173, 514472), met +X oostwaarts langs de nok. Het vervangt `NL.IMBAG.Pand.0180100000006906`. De STL is op 1:1000 circa 39,3 × 17,1 × 27,0 mm. De generator controleert de ondervlakken en gesloten geometrie.

```sh
node scripts/generate-hervormde-kerk-rouveen.mjs
```
