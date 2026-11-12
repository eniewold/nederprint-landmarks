# Nederlands Hervormde Kerk Middelharnis

De Nederlands Hervormde Kerk, ook Sint-Michaelskerk, is een laatgotische kruiskerk met een vijfzijdig gesloten koor en een forse westelijke toren. De historische spits werd in 1811 verwijderd; de huidige toren heeft een vlakke afsluiting. Kerk en toren vallen in BAG-pand `0559100000010478`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0559100000010478): BAG-contour en dakvlakken; nok circa 19,15 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 0,89 m NAP en bovenkant van de toren circa 32,46 m NAP.
- [Rijksmonument kerk 29750](https://monumentenregister.cultureelerfgoed.nl/monumenten/29750) en [toren 29751](https://monumentenregister.cultureelerfgoed.nl/monumenten/29751): identificatie van kerk en toren.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Middelharnis): recente schuine foto's van toren, schip, dwarsbeuk en koor, alsmede bouwgeschiedenis en verwijdering van de spits.

De toren is gemodelleerd op circa 31,55 m boven maaiveld. Steunberen, vensters, galmgaten en kapel zijn naar foto's en BAG vereenvoudigd en geschat. Het maaswerk en het dunne hekwerk langs de torenrand zijn weggelaten; de toren heeft een gesloten bovenvlak voor printbaarheid. Oorsprong RD (70613,87; 419492,54), lokale x-as (0,998; 0,0648); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-nederlands-hervormde-kerk-middelharnis.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, één gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met PDOK en recente foto's.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
