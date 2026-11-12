# Agneskerk, Goutum

Middeleeuwse zaalkerk op de terp van Goutum met vijfzijdig gesloten koor en zadeldaktoren. Rijksmonument 24509.

## Bronnen en maten

- [3DBAG, BAG-pand 0080100000350006](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000350006) voor plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP 2,356 m; de torennok ligt ongeveer op NAP 33,3 m. De nok heeft bruikbare hoogtewaarden. De modelnok is 30,95 m boven maaiveld.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/24509), [Friesland.nl](https://www.friesland.nl/nl/locaties/2976227454/agneskerk) en [Tsjerkepaad-foto](https://tsjerkepaad.nl/ckfinder/userfiles/images/Goutum%20NH%20ext4.JPG).
- Vier zijden naast de PDOK-reconstructie en twee schuine foto's gecontroleerd; zaal, koorsluiting en zadeldaktoren zijn herkenbaar.

## Model en schattingen

Oorsprong RD (183055, 576953,5), lengteas west-oost. Totaal circa 38,7 × 11,5 m, schipnok 14,45 m boven maaiveld. De zaal, koorschilden, toren en steunberen zijn als afzonderlijke bouwdelen met vlakken gevormd en verenigd. De plaats en breedte van vensters, galmgaten en steunberen zijn geschat naar de foto's; de historische details en windwijzer zijn op 1:1000 te dun en weggelaten.

## Export en controle

Genereer met `node scripts/generate-agneskerk-goutum.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 38,7 × 11,5 × 31,5 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
