# Sint Martinuskerk Zwartewaal

Middeleeuwse dorpskerk met een eenbeukig schip, hoger vijfzijdig gesloten koor en in het schip opgenomen toren uit 1597. Het model vervangt BAG-pand 0501100001988185.

## Bronnen en maatvoering

- [Rijksmonumentenregister 41506](https://monumentenregister.cultureelerfgoed.nl/monumenten/41506) en [Voorne-Putten, Kerken, kloosters en kapellen](https://www.dbnl.org/tekst/don_003voor01_01/don_003voor01_01_0008.php): geschiedenis en opbouw.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0501100001988185) voor de contour, richting en kapvlakken; AHN DSM 0,5 m voor hoogten. Het onderzochte torenvenster van 5 × 5 m bevat geen ontbrekende AHN-cellen; de hoogste cel is NAP +24,77 m.
- [Commons](https://commons.wikimedia.org/wiki/Category:Martinuskerk,_Zwartewaal) voor gevels, steunberen, schip en spits.

Het model heeft als oorsprong RD (74860, 433463), met de lokale X-as (0,9949874, −0,1) richting koor. 3DBAG geeft maaiveld NAP −0,356 m. De koornok is circa 17,75 m en de toren circa 25,1 m boven dit maaiveld. De onderkant ligt op −0,5 m voor een goede aansluiting op het terrein; er is geen grondplaat.

## Interpretatie en printbaarheid

De spits is een benadering op basis van AHN en foto's, waarvan de uiterste punt voor 1:1000 tot 0,9 m is verbreed. Raamposities en maatvoering van steunberen en kapvlakken zijn benaderd; maaswerk en dunne sierdetails zijn weggelaten. Het model is opgebouwd uit bouwdelen en dakvlakken en bestaat uit één gesloten volume. De 1:1000-export meet circa 36,9 × 13,7 × 25,6 mm; de generator controleert Float32-geslotenheid en ondersteunde ondervlakken.

## Genereren

```sh
node scripts/generate-sint-martinuskerk-zwartewaal.mjs --scale 1000 --components
node scripts/generate-sint-martinuskerk-zwartewaal.mjs --scale 100
```
