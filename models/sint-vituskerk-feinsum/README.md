# Sint-Vituskerk, Feinsum

Romaanse zaalkerk op de terp van Feinsum met een later recht gesloten koor en een slanke zadeldaktoren. Rijksmonument 24529.

## Bronnen en maten

- [3DBAG, BAG-pand 0081100000005276](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0081100000005276) voor plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP 1,445 m, torennok circa NAP 20,6 m. Het AHN-raster rond de nok is intact; de modelnok is 19,2 m boven maaiveld.
- [Monumenten.nl](https://www.monumenten.nl/monument/24529) en [Stichting Monumentenzorg Leeuwarderadeel](https://stichtingmonumentenzorgleeuwarderadeel.nl/feinsum) voor beschrijving en twee schuine foto's.
- Vier aanzichten vergeleken met de PDOK-reconstructie en de foto's: zaal, rechte koorgevel en zadeldaktoren zijn herkenbaar.

## Model en schattingen

Oorsprong RD (179558, 588044,5), lengteas west-oost. De kerkzaal meet circa 26,2 × 8,6 m; het gehele model is circa 29 m lang en de schipnok circa 10,85 m boven maaiveld. Dakvlakken van zaal en toren zijn afzonderlijk gevormd en verenigd. Venster- en galmgatposities en de toegangsnissen zijn geschat uit de foto's, de raamvormen vereenvoudigd; siermetselwerk en windwijzer zijn te dun voor 1:1000 en weggelaten.

## Export en controle

Genereer met `node scripts/generate-sint-vituskerk-feinsum.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 29 × 8,6 × 19,7 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
