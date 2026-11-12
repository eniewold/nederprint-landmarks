# Dorpskerk Moordrecht

De Dorpskerk van Moordrecht is een eenbeukige kruiskerk met vijfzijdige koorsluiting, westtoren en kleine dakruiter. Kerk en toren vallen binnen BAG-pand `1892100000644736`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1892100000644736): contour, dakvlakken en kerknok rond 16,80 m NAP; de dunne torenspits en dakruiter ontbreken grotendeels in de reconstructie.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa -0,67 m NAP en hoogste torenmeting circa 32,51 m NAP.
- [Rijksmonument kerk 30093](https://monumentenregister.cultureelerfgoed.nl/monumenten/30093) en [toren 30094](https://monumentenregister.cultureelerfgoed.nl/monumenten/30094): identificatie van kerk en toren.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Moordrecht): schuine beelden van beide dwarsgevels, toren en de dakruiter.

De torenspits reikt naar fotoverhoudingen geschat circa 35,6 m boven maaiveld; AHN meet circa 33,2 m en mist vermoedelijk het smalle bovendeel. de dakruiter en zijn hoogte van circa 23,2 m zijn geschat naar foto's. De spitsen hebben een top van circa 1 mm op 1:1000 en de open geleding van de dakruiter is gesloten voor stevigheid. Raamverdeling, galmgaten en de aanbouw zijn vereenvoudigd naar foto's en BAG; maaswerk, hekwerk en windvanen zijn weggelaten. Oorsprong RD (105793,5; 444486,8), lokale x-as (0,9863; 0,1647); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-dorpskerk-moordrecht.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, één gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met PDOK en schuine foto's; PDOK kapt de torenspits af en mist de dakruiter.


Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
