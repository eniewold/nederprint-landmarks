# Nieuwe Kerk Zierikzee

Neoclassicistische zaalkerk uit 1848 met schilddak, zuilenfront en fronton. Het model vervangt BAG-pand `1676100000432167`. De Sint-Lievensmonstertoren of Dikke Toren is een vrijstaand afzonderlijk monument met BAG-pand `1676100000432370` en blijft als zelfstandig PDOK-pand aanwezig.

## Bronnen en schattingen

- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000432167): BAG-contour, nok en schildvlakken.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 2,6 m NAP en kerknok circa 30,25 m NAP.
- [Rijksmonument 40634](https://monumentenregister.cultureelerfgoed.nl/monumenten/40634) en [Architectuur Zeeland](https://architectuurzeeland.nl/nieuwe-kerk-zierikzee/): beschrijving van het fronton en de Dorische zuilen.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Nieuwe_Kerk_Zierikzee): foto's van portiek, schip en de afstand tot de toren.

Om de portiek op 1:1000 zonder steun te kunnen printen, zijn de vier zuilen als reliëf met drie diepe blinde nissen in een gesloten portiekvlak uitgevoerd; de open ruimten en het vrij overspannende hoofdgestel van het origineel zijn vereenvoudigd. Hoogte en breedte van de nissen en ramen zijn uit foto's geschat. Trappen, hekwerk en kleine ornamenten zijn weggelaten. De oorsprong is RD (53138; 407859), x-as (0,99955; 0,0296); de onderzijde zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-nieuwe-kerk-zierikzee.mjs` genereert GLB, JSON en STL's op 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, afzonderlijke toren, één gesloten volume en de benadering van 45-graden ondersteuning. De vier richtingen zijn vergeleken met PDOK en schuine foto's; de vrijstaande Dikke Toren is als naburig gebouw zichtbaar in de vergelijking.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
