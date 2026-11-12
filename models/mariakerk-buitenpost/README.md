# Mariakerk Buitenpost

Laatgotische kerk met een zware westtoren, tentdak, lang schip en vijfzijdig gesloten koor. De kerk werd na een brand in 1611–1613 herbouwd en is rijksmonument 7036. Het model vervangt BAG-pand 0059100000837071.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000837071): grondvorm en maaiveld NAP +1,246 m; AHN5 2023 heeft geen ontbrekende cellen binnen het pand.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): schipnok circa NAP +18,1 m en hoogste torencel NAP +38,414 m.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/7036): schuine exterieurfoto en monumentbeschrijving.
- [Dorpsgeschiedenis](https://www.binnenbuitenpost.nl/verhalen/geschiedenis/de-mariakerk-aan-de-oude-havenstraat/): herbouw en kerktoren.

## Model en schattingen

Schip met vijfzijdig koor, toren, tentdak en steunberen zijn opgebouwd uit bouwdelen en dakvlakken; samen vormen zij één gesloten volume. De vierzijdige vergelijking met PDOK en de schuine foto bevestigt de hoofdvorm. De steunberen, vensters en galmgaten zijn geschat en voor 1:1000 verbreed waar nodig. De punt van het tentdak is verdikt en de windvaan weggelaten. Controle van de 1:1000-STL vond geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `mariakerk-buitenpost.glb`: kaartmodel
- `mariakerk-buitenpost.json`: catalogus en plaatsing
- `mariakerk-buitenpost-1-100.stl`: printmodel 1:100
- `mariakerk-buitenpost-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-mariakerk-buitenpost.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
