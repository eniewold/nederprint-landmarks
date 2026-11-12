# Hervormde Gemeente, Gerkesklooster

Het voormalige brouwhuis van klooster Jeruzalem werd in 1629 als kerk ingericht. De slanke westtoren dateert uit 1854; de voormalige pastorie is een deel van hetzelfde gebouw. Rijksmonument 7045.

## Bronnen en maten

- [3DBAG, BAG-pand 0059100000822204](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000822204): plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP 1,689 m, hoogste torenpixel NAP 19,138 m. Het raster rond de top is compleet. De modeltop is 17,45 m boven maaiveld; PDOK modelleert de spits niet volledig.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumentkenmerken/7045), [Friesland.nl met foto](https://www.friesland.nl/nl/locaties/3328348392/hervormde-kerk-gerkesklooster) en [Historische Wandelpaden met foto](https://www.historischepaden.nl/upload/Gerkesklooster%20HK.JPG).
- Vier zijden naast de PDOK-reconstructie en de twee schuine foto's gecontroleerd; zaal, dakschild en toren zijn herkenbaar.

## Model en schattingen

Oorsprong RD (209243, 584154,5), lengteas west-oost. Het gebouw is circa 26,7 × 8,65 m; de schipnok is circa 11,7 m boven maaiveld. De zaal, het schilddak en de toren zijn uit afzonderlijke bouwdelen en vlakken opgebouwd en verenigd. De naaldspits is op basis van AHN en foto's gereconstrueerd en bovenaan tot 0,9 m verbreed. Venster- en galmgatposities en -maten zijn uit foto's geschat; klein ornament en windwijzer zijn te dun op 1:1000 en weggelaten.

## Export en controle

Genereer met `node scripts/generate-hervormde-gemeente-gerkesklooster.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 26,7 × 8,7 × 18 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
