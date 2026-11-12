# Witte Kerkje van Simonshaven

Het Witte Kerkje is een rechthoekige zaalkerk met een westelijke geveltoren, vierkante klokkengeleding en kleine lantaarn. Het staat op een verhoging in de polder en vervangt BAG-pand `0568100000100798`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0568100000100798): contour en dakvlakken; scheepsnok circa 10,74 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld bij de kerk circa -0,10 m NAP en hoogste gemeten torenpunt circa 19,07 m NAP.
- [Rijksmonument 9410](https://monumentenregister.cultureelerfgoed.nl/monumenten/9410) en [de kerkelijke website](https://www.kerksimonshaven.nl/): identificatie en geschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Simonshaven): schuine foto's van de voor-, achter- en zijgevels en de torenbekroning.

De toren is circa 19,18 m boven maaiveld volgens AHN. De verhoudingen en nissen van de klokkengeleding en lantaarn zijn geschat naar foto's; de open lantaarn is voor stevigheid gesloten met ondiepe nissen en de kleinste bovenzijde is 1 mm op 1:1000. De vensters zijn vereenvoudigd; kozijnen, hekwerk en windvaan zijn weggelaten. Oorsprong RD (79434,43; 426738), lokale x-as (0,998; 0,063); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-witte-kerkje-van-simonshaven.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, één gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met PDOK en schuine foto's.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
