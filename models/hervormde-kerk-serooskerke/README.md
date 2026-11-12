# Hervormde kerk Serooskerke (Schouwen)

De Sint-Alardskerk in Serooskerke op Schouwen-Duiveland bestaat uit een eenbeukig schip met westtoren en lagere oostelijke consistorie. Schip, toren en aanbouw staan in BAG-pand `1676100000525850` en vormen in dit model één gesloten volume. Gevelnissen en steunberen geven de buitenzijde reliëf.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000525850): BAG-contour, schipnok en dakvlakken.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 0,65 m NAP, schipnok circa 11,14 m NAP en hoogste torenpunt circa 21,82 m NAP.
- [Rijksmonument 38841](https://monumentenregister.cultureelerfgoed.nl/monumenten/38841) en [Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0088.php): identificatie en bouwgeschiedenis. BAG vermeldt 1872; de kerk en toren hebben oudere middeleeuwse delen.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Alardskerk,_Serooskerke_(Schouwen-Duiveland)): foto's van gevels, consistorie en toren.

De naald is geschat op 21,2 m boven maaiveld uit AHN en foto's, met een top van 0,9 mm op schaal 1:1000. Gevelnissen, steunberen, galmgaten en rond oostvenster zijn naar foto's geschat en vereenvoudigd. Fijn metselwerk en de windvaan zijn weggelaten. Oorsprong RD (46317, 413755), lokale x-as (0,9986; -0,053); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-hervormde-kerk-serooskerke.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. Het model is van vier richtingen vergeleken met PDOK en schuine foto's; PDOK reconstrueert de spits lager dan de AHN-punten en foto's.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
