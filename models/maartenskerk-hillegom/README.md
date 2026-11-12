# Maartenskerk Hillegom

De Maartenskerk bestaat uit een middeleeuwse westtoren en een in 1929 vernieuwde kruiskerk. Het lage aangebouwde deel aan de zuidzijde hoort bij hetzelfde BAG-pand `0534100000001714` en is in vereenvoudigde vorm opgenomen.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0534100000001714): contour, nokken, dwarskap, toren en aanbouwen. De hoofdnok ligt circa 18,5 m NAP en de torenvoet van de spits circa 23,4 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 3,2 m NAP nabij de kerk en hoogste spitsmeting circa 38,8 m NAP.
- [Rijksmonument 22136](https://monumentenregister.cultureelerfgoed.nl/monumenten/22136) en [Protestantse Gemeente Hillegom](https://pghillegom.nl/maartenskerk/): identificatie en bouwgeschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Maartenskerk_(Hillegom)): foto's van de toren, topgevels en delen van de kerk, waaronder beelden na de verbouwing.

De spits is circa 35,6 m hoog boven het plaatselijke maaiveld, afgeleid uit AHN; het dunne siersmeedwerk bovenop is weggelaten en de top is verbreed tot 1 mm op 1:1000. Gevelnissen, galmgaten en de vorm van de drie topgevels zijn geschat uit foto's; lage bouwdelen zijn vereenvoudigd op basis van de BAG en de 3D-reconstructie. Fijn metselwerk, wijzerplaat, kozijnen en hekwerk zijn weggelaten. Oorsprong RD (99781,49; 478459,4), lokale x-as (0,9729; 0,2312); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-maartenskerk-hillegom.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, een gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met de PDOK-reconstructie en de beschikbare foto's; delen van de kerk zijn op straatfoto's door bebouwing of bomen aan het zicht onttrokken.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
