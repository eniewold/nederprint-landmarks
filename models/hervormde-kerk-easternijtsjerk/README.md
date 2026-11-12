# Hervormde kerk Easternijtsjerk

De Caeciliatsjerke is een gotische zaalkerk met een driezijdig koor en een oudere romaanse toren met zadeldak. De kerk is rijksmonument 31588. Het model vervangt BAG-pand 0058100000204631.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000204631): grondvorm, maaiveld NAP +1,972 m en torennok NAP +25,394 m. De gebruikte AHN5 uit 2023 heeft geen ontbrekende cellen binnen het pand.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): schipnok circa NAP +15,1 m en torendak rond NAP +25,2 m.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/31588): schuine exterieurfoto en monumentinformatie.
- [Stichting Monumentenbehoud Noardeast-Fryslân](https://monumentenbehoudnef.nl/kerktorens/oosternijkerk-sint-ceciliakerk): geschiedenis van de kerk en de romaanse toren.

## Model en schattingen

Schip en toren zijn afzonderlijke bouwdelen met zadeldakvlakken; steunberen vormen aanvullende bouwdelen. Samen vormen zij één gesloten volume. De vierzijdige vergelijking met PDOK en de schuine foto bevestigt de grondvorm en het zadeldak op de toren. Steunberen, vensters en galmgaten zijn voor de schaal verbreed of geschat. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `hervormde-kerk-easternijtsjerk.glb`: kaartmodel
- `hervormde-kerk-easternijtsjerk.json`: catalogus en plaatsing
- `hervormde-kerk-easternijtsjerk-1-100.stl`: printmodel 1:100
- `hervormde-kerk-easternijtsjerk-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-hervormde-kerk-easternijtsjerk.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
