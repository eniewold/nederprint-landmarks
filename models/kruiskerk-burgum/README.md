# Kruiskerk Burgum

Driebeukige kruiskerk met lage zijbeukdaken, dwarspanden, vijfzijdig koor en een smalle toren met ingesnoerde spits. De kerk is rijksmonument 35634. Het model vervangt BAG-pand 0737100000015999.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000015999): grondvorm en maaiveld NAP +2,477 m; de gebruikte AHN5 uit 2023 heeft circa 0,29% ontbrekende cellen op het pand.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): kerknok circa NAP +19,6 m, hoogste torencel NAP +36,537 m.
- [Schuine exterieurfoto](https://www.friesland.nl/nl/routes/1118250434/cultuurhistorische-wandelroute-burgum): toren, zijbeukdaken en dwarspand.
- [Monumenten in Nederland: Fryslân](https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0036.php) en [monumentinformatie](https://rijksmonumenten.nl/monument/35634/kruiskerk-hervormde-kerk/burgum/): kerktypen en bouwgeschiedenis.

## Model en schattingen

Schip, zijbeuken, dwarspand, koor, toren en spits zijn als afzonderlijke bouwdelen met dakvlakken gevormd en samen één gesloten volume. In vier richtingen is vergeleken met PDOK en de schuine foto; PDOK kapt de spits grotendeels af. De afmetingen van de zijbeukdaken, spits en vensternissen zijn geschat naar AHN en foto. De spits is aan de top voor 1:1000 verbreed; zeer fijne decoratie en de windvaan ontbreken. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `kruiskerk-burgum.glb`: kaartmodel
- `kruiskerk-burgum.json`: catalogus en plaatsing
- `kruiskerk-burgum-1-100.stl`: printmodel 1:100
- `kruiskerk-burgum-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-kruiskerk-burgum.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
