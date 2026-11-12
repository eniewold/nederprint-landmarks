# Martelaren van Gorcumkerk Brielle

Waterstaatskerk aan de Nobelstraat 24 met classicistische voorgevel, fronton en achteraanbouw. De kerk en achtervleugel zijn BAG-pand `0501100001988075` en als één volume uitgevoerd. Dit is niet de gelijknamige bedevaartkerk aan De Rik.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0501100001988075): BAG-voetafdruk, schilddak en achtervleugel.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 2,7 m NAP en schipnok circa 17,1 m NAP.
- [Rijksmonument 10826](https://monumentenregister.cultureelerfgoed.nl/monumenten/10826) en [kerkpagina](https://hhnicolaaspieckengezellen.nl/kerken/brielle/): identificatie van de kerk aan de Nobelstraat.
- [Wikimedia Commons en RCE](https://commons.wikimedia.org/wiki/Category:Martelaren_van_Gorcum,_Brielle): voorgevel en schuin aanzicht van de achtergevel. De zijmuren worden deels aan het zicht onttrokken door aangrenzende bebouwing.

De voorgevel met drie grote rondboogvensters, de achteraanbouw en afzonderlijke vensternissen zijn op basis van foto's en 3DBAG vereenvoudigd en geschat. Het kruis en fijne versieringen zijn te klein voor 1:1000 en weggelaten. Oorsprong RD (70803,89; 435476,83), x-as (0,8718; -0,4898); de onderzijde zakt 0,5 m in de terreinplaat. De aangrenzende panden blijven afzonderlijk.

## Productie en controle

`node scripts/generate-martelaren-van-gorcumkerk-brielle.mjs` genereert GLB, JSON en STL's voor 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. Vier modelaanzichten zijn naast PDOK en foto's van voor- en achtergevel gecontroleerd, met aangrenzende panden weergegeven.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
