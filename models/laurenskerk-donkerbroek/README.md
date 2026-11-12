# Laurenskerk Donkerbroek

Zaalkerk met afgeschuinde sluiting en houten geveltoren met naaldspits. Het model omvat BAG-pand 0085100000003581. De vrijstaande houten klokkenstoel naast de kerk behoort niet tot dit BAG-pand en is vanwege zijn open, fijne constructie niet gemodelleerd.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0085100000003581): grondvorm, maaiveld NAP +5,259 m en nok NAP +16,565 m.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torencel NAP +27,005 m. De gebruikte AHN5-opname uit 2023 heeft circa 0,31% ontbrekende cellen op het pand.
- [Schuin exterieurbeeld](https://www.begraafplaats.nl/begraafplaatsen/kerkhof-donkerbroek-36/): geveltoren, kerkschip en vrijstaande klokkenstoel.
- [Kerkenvisie Ooststellingwerf](https://www.kerkenvisieonline.nl/pdf-download/): bouwjaar 1714 en rijksmonumentstatus.

## Model en schattingen

De kerk en toren zijn als afzonderlijke bouwdelen met dakvlakken opgebouwd en vormen één gesloten volume. De vierzijdige vergelijking met PDOK en een schuine foto bevestigt de hoofdvorm; PDOK mist de slanke torenspits. Vensters, galmgaten en spits zijn geschat op basis van foto en AHN, en de spits is aan de top voor printbaarheid verbreed. Het kruis en het open maaswerk van de losse klokkenstoel zijn weggelaten. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `laurenskerk-donkerbroek.glb`: kaartmodel
- `laurenskerk-donkerbroek.json`: catalogus en plaatsing
- `laurenskerk-donkerbroek-1-100.stl`: printmodel 1:100
- `laurenskerk-donkerbroek-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-laurenskerk-donkerbroek.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
