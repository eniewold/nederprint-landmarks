# Laurentiuskerk, Folsgare

Zaalkerk uit 1875/76 met driezijdige koorsluiting en een zestiende-eeuwse zadeldaktoren. Kerk en toren zijn rijksmonumenten 39762 en 39763.

## Bronnen en maten

- [3DBAG, BAG-pand 0683100000290393](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000290393) voor plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP 1,055 m, torennok circa NAP 23,5 m; het raster op de nok is compleet. De modelnok is 22,5 m boven maaiveld.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/39762), [torenbeheerder met foto](https://www.stichtingmonumentenswf.nl/monumenten/kerktoren-folsgare/Kerktoren%20Folsgare) en [protestantse gemeente](https://www.protestantsegemeenteoosthemcs.nl/kerken/laurentius-kerk-folsgare/).
- Vier aanzichten naast de PDOK-reconstructie en twee schuine foto's gecontroleerd; zaal, afgeschuind koor en zadeldaktoren zijn herkenbaar.

## Model en schattingen

Oorsprong RD (169609, 561204), lengteas west-oost. Totaal circa 31,5 × 11,3 m; schipnok 13,05 m boven maaiveld. De kerk met koorschilden en de toren zijn uit afzonderlijke dakvlakken en bouwdelen opgebouwd en verenigd. Posities en breedte van de gevelvensters en galmgaten zijn uit de foto's geschat en als ondiepe nissen uitgewerkt. Raamtracering en vlaggenmast zijn te dun voor 1:1000 en weggelaten.

## Export en controle

Genereer met `node scripts/generate-laurentiuskerk-folsgare.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 31,5 × 11,3 × 23 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
