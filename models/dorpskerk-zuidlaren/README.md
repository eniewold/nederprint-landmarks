# Dorpskerk Zuidlaren

Middeleeuwse dorpskerk met een lage eenbeukige romp, hoger gotisch koor met driezijdige sluiting en een westtoren met ingesnoerde naaldspits. Het model vervangt BAG-pand 1730100000008006.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1730100000008006): grondvorm en maaiveld NAP +5,021 m, hoogste koornok NAP +20,093 m.
- [AHN4 DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): schipnok circa NAP +16,1 m en hoogste torencel NAP +43,06 m; de top is dun en daarom is de exacte hoogte onzeker.
- [Schuine exterieurfoto](https://kerkfotografie.nl/dorpskerk-zuidlaren/): verhoudingen toren en spits, ramen en steunberen.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/41091) en [Monumenten in Nederland: Drenthe](https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0107.php): bouwgeschiedenis, toren en koorvorm.

## Model en schattingen

De zaalkerk en het hogere koor zijn afzonderlijke massa's met dakvlakken; steunberen en toren met achthoekige naald vormen aanvullende bouwdelen. Het geheel is één gesloten volume. De vierzijdige vergelijking met PDOK en een schuin exterieurbeeld toont dat PDOK de torenspits afkapt; het model volgt daar AHN en foto. Vensters, galmgaten, steunberen en hoogte en diameter van de spits zijn geschat. De bovenkant van de spits is voor 1:1000 verbreed en het kruis is weggelaten. Controle van de 1:1000-STL vond geen naar beneden gerichte vlakken steiler dan 45° boven het grondvlak.

- `dorpskerk-zuidlaren.glb`: kaartmodel
- `dorpskerk-zuidlaren.json`: catalogus en plaatsing
- `dorpskerk-zuidlaren-1-100.stl`: printmodel 1:100
- `dorpskerk-zuidlaren-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-dorpskerk-zuidlaren.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
