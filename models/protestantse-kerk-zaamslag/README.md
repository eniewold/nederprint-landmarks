# Protestantse kerk Zaamslag

Neoromaanse kerkzaal met lage dwarskapjes, oostelijke aanbouw en een zijdelings aangesloten oudere toren met achtkantige galmgeleding. Samen vormen zij BAG-pand `0715100000038515` en één gesloten modelvolume.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0715100000038515): BAG-omtrek, kerkzaal en dakvlakken. De 3DBAG- en PDOK-reconstructies missen de torenspits.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 3 m NAP, nok circa 19,7 m NAP en hoogste torenmeting circa 38,4 m NAP.
- [Rijksmonument 35026](https://monumentenregister.cultureelerfgoed.nl/monumenten/35026) en [Open Monumentendag](https://www.openmonumentendag.nl/monument/protestantse-kerk-10/): toren uit 1877–1878, zaal uit 1898–1899, naast de oudere toren gebouwd.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Zaamslag): foto's van de gevels en toren.

De achtkantige spits is geschat op 35,4 m boven maaiveld uit AHN en foto's; de top is 0,96 mm breed op schaal 1:1000. De hoogte en vorm van de galmgeleding, geveldammen, lage dwarskappen en vensternissen zijn naar foto's en dakvlakken vereenvoudigd; fijne ornamenten en windvaan zijn weggelaten. Oorsprong RD (52228,5; 370273), x-as (0,9981; -0,061). Het model zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-protestantse-kerk-zaamslag.mjs` genereert GLB, JSON en STL's voor 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. De vier zijden zijn vergeleken met PDOK en schuine foto's.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
