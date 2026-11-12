# Sint Maartenskerk Heenvliet

De Sint Maartenskerk is een kerk met een vijfzijdig gesloten koor, lage noordbeuk en westelijke geveltoren met slanke spits. Het model vervangt BAG-pand `0568100000100348`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0568100000100348): BAG-contour, dakvlakken, kerkhoogte en lage noordelijke kap. De nok ligt rond 15,53 m NAP; de dunne torenspits wordt maar deels gereconstrueerd.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa -0,58 m NAP en hoogste gemeten punt circa 24,81 m NAP.
- [Rijksmonument 9381](https://monumentenregister.cultureelerfgoed.nl/monumenten/9381): identificatie en geschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Heenvliet): foto's van koor, westgevel, zuidgevel, noordbeuk en toren.

De spits is circa 27,6 m boven maaiveld geschat uit de fotoverhoudingen; AHN registreert circa 25,4 m boven maaiveld maar mist vermoedelijk de smalle top. De vorm en breedte zijn geschat naar foto's; de top is op circa 1 mm op 1:1000 gehouden. Koorvensters, galmgaten, steunberen en de kleine noordelijke aanbouw zijn vereenvoudigd naar foto's en de BAG; dun maaswerk, klokdetails en windvaan zijn weggelaten. Oorsprong RD (76250, 431267), lokale x-as (0,9732; -0,2299); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-sint-maartenskerk-heenvliet.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, een gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met de PDOK-reconstructie en schuine foto's; de smalle spits wordt door PDOK afgeknot.


Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
