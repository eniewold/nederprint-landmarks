# Open Hofkerk, Burum

Torenloze zaalkerk aan Herestraat 62, met zadeldak, twee dakschilden en lage aanbouw. Het BAG registreert 1920; in 2014 kreeg de voormalige gereformeerde kerk de naam Open Hofkerk.

## Bronnen en maatvoering

- [3DBAG, BAG-pand 0079100000357789](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0079100000357789): plattegrond, maaiveld en dakvlakken.
- PDOK AHN DSM 0,5 m: hoogste punt NAP 13,538 m, maaiveld NAP 1,361 m. Modelnok 12,19 m boven maaiveld.
- Twee gevel- en zijfoto's op [Gereformeerde Kerken, deel 2](https://gereformeerdekerken.info/2018/12/29/de-geref-kerk-te-burum-de-eerste-in-friesland-2/) en [deel 3](https://gereformeerdekerken.info/2019/01/01/de-geref-kerk-te-burum-de-eerste-in-friesland-3/). Vierzijdige vergelijking met de PDOK-reconstructie gecontroleerd.

## Modellering en schattingen

Oorsprong RD (211360, 587910), lengteas naar het noordwesten. De zaalkerk is circa 23,9 × 12,5 m; met aanbouw is het geheel circa 38 × 15,2 m. De zaal is opgebouwd uit dakvlakken en de aanbouw uit een afzonderlijk bouwdeel. De gevelvensters zijn als ondiepe puntboognissen weergegeven; breedte en plaatsing zijn uit de foto's geschat. Dakvlakhellingen en aansluiting van de aanbouw zijn vereenvoudigd volgens AHN en PDOK. Kleine dakversieringen en maaswerk zijn op 1:1000 te dun en weggelaten.

## Export en controle

Genereer met `node scripts/generate-open-hofkerk-burum.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel, genus 0; de generator controleert de ondervlakken op de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. Het model op 1:1000 meet circa 38 × 15,2 × 12,7 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
