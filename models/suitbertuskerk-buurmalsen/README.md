# Suitbertuskerk Buurmalsen

Landmark voor de middeleeuwse Suitbertuskerk, BAG-pand `0236100000008480`. De driebeukige kerk is als schip met lagere goten gemodelleerd, met een hoger koor met driezijdige sluiting en een westtoren met spits. Koorsteunberen, galmgaten, torennissen en vensters zijn vereenvoudigd tot printbare bouwdelen en blinde nissen.

## Bronnen en schattingen

- [3DBAG: pandcontour en maaiveld](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000008480): maaiveld NAP +4,95 m, kerkelijke nok circa NAP +19,66 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogte nabij de spits NAP +37,82 m, circa 32,87 m boven maaiveld.
- Rijksmonumentenregister: [kerk 16492](https://monumentenregister.cultureelerfgoed.nl/monumenten/16492) en [toren 16493](https://monumentenregister.cultureelerfgoed.nl/monumenten/16493).
- [Foto's rondom de kerk](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Buurmalsen) en [bouwbeschrijving](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0048.php).

Dakhellingen, goothoogten, geleding en exacte afmetingen van toren, steunberen en nissen zijn geschat uit AHN, 3DBAG en foto's. De smalle spitstop is voor schaal 1:1000 verbreed; windvaan en fijn maaswerk zijn weggelaten. AHN meet niet noodzakelijk het uiteinde van de windvaan.

## Controle

De generator maakt één gesloten volume met een vlakke voet. De test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m met en zonder landmark is als 3MF en preview geëxporteerd en vanuit vier gelijke richtingen naast de PDOK-reconstructie en schuine foto's bekeken.

Controleer de plaatsing en aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.89009/5.29454/200/1x1/0).
