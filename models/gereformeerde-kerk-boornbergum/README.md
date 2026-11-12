# Gereformeerde Kerk Boornbergum

Zaalkerk uit 1911 met geveltoren en naaldspits, gebouwd aan de Easterbuorren. De kerk is een gemeentelijk monument. Het model omvat ook de gekoppelde achterbouwen van BAG-pand 0090100000600459.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0090100000600459): grondvorm en maaiveld NAP +0,608 m; AHN5 2023 heeft circa 0,34% ontbrekende cellen.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): schipnok circa NAP +12,7 m en hoogste cel van de torenspits NAP +23,546 m.
- [Schuine exterieurfoto](https://gk-boornbergum.wixsite.com/gk-boornbergum/kerkgebouw): voorgevel en torenspits.
- [Dorpshistorie](https://www.boornbergum-kortehemmen.nl/onze-dorpen/historie) en [gemeentelijk bestemmingsplan](https://www.planviewer.nl/imro/files/NL.IMRO.0090.BP2010DPW001-0401/t_NL.IMRO.0090.BP2010DPW001-0401_index.pdf): bouwjaar 1911 en monumentstatus.

## Model en schattingen

Het schip, de geveltoren, spits en achterbouwen zijn afzonderlijke bouwdelen met dakvlakken; samen vormen zij één gesloten volume. De vierzijdige vergelijking met PDOK en het schuine exterieurbeeld toont de hoofdvorm; PDOK reconstrueert de spits niet volledig. De toren en spits volgen de foto en AHN, met geschatte details en een voor 1:1000 verbrede punt. De daken van de uitgestrekte achterbouw zijn uit AHN en PDOK vereenvoudigd. Vensters en deur zijn geschat; het kruis en dun sierwerk zijn weggelaten. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `gereformeerde-kerk-boornbergum.glb`: kaartmodel
- `gereformeerde-kerk-boornbergum.json`: catalogus en plaatsing
- `gereformeerde-kerk-boornbergum-1-100.stl`: printmodel 1:100
- `gereformeerde-kerk-boornbergum-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-gereformeerde-kerk-boornbergum.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
