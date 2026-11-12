# Pypketsjerke Augustinusga

Voormalige gereformeerde kerk met kruisende zadeldaken en een lage aanbouw. De oorspronkelijke kerk uit 1916 is in 1971 sterk verbouwd, waarbij de toren werd gesloopt. Het model toont het huidige gebouw en vervangt BAG-pand 0059100000824880.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000824880): grondvorm, maaiveld NAP +1,547 m en nok NAP +12,961 m. De gebruikte AHN5 heeft circa 0,05% ontbrekende cellen in het pand.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): metingen van beide nokken en de lage achterbouw.
- [Exterieurfoto en huidige bestemming](https://gereformeerdekerken.info/2023/10/19/v-m-kerk-augustinusga-herbergt-oekrainers/): het gebouw na verbouwing en gebruik als opvanglocatie.
- [Geschiedenis Pypketsjerke](https://gereformeerdekerken.info/2016/01/22/laatste-kerkdienst-in-pypketsjerke-augustinusgasurhuizum/): bouwjaar 1916, verbouwing en sloop toren in 1971.

## Model en schattingen

De kruisende daken en lagere achterbouw bestaan uit afzonderlijke bouwdelen met dakvlakken; samen zijn deze één gesloten volume. De vierzijdige vergelijking met PDOK en een schuin exterieurbeeld bevestigt de hoofdvorm. De kleine geveldetails zijn geschat: vensternissen zijn vereenvoudigd en hun bovenzijde is voor steunvrij printen schuin gemaakt. De achterbouw is aan de hand van de AHN-hoogten en PDOK benaderd. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `pypketsjerke-augustinusga.glb`: kaartmodel
- `pypketsjerke-augustinusga.json`: catalogus en plaatsing
- `pypketsjerke-augustinusga-1-100.stl`: printmodel 1:100
- `pypketsjerke-augustinusga-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-pypketsjerke-augustinusga.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
