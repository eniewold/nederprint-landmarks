# Catharinakerk Goedereede

De Catharinakerk is een zaalkerk met vijfzijdige sluitingen, noordkapel en een forse vrijstaande toren met vlakke bovenzijde. Het model vervangt kerkpand `0511100001944595` en torenpand `0511100001945109`. Kerk en toren zijn twee afzonderlijke, elk op het terrein rustende gesloten volumes; de vrije ruimte ertussen is gehandhaafd.

## Bronnen en schattingen

- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0511100001944595) en [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0511100001945109): contouren en dakvlakken; kerkgebouw nok circa 20,08 m NAP, toren bovenzijde circa 40,99 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 1,5 m NAP bij de kerk; hoogte toren circa 39,5 m boven maaiveld.
- [Monumenten in Nederland](https://www.ensie.nl/monumenten-in-zuid-holland/de-herv-catharinakerk-in-goedereede): kerk met vrijstaande toren en noordkapel.
- [Foto's kerk](https://commons.wikimedia.org/wiki/Category:Exterior_of_Catharinakerk_(Goedereede)) en [foto's toren](https://commons.wikimedia.org/wiki/Category:Toren_van_Goedereede): kapvorm, gevels, hoeksteunberen en torenindeling.

De vensters, diepte van de nissen, steunberen en kleine aanbouw zijn geschat naar de foto's. Het torenlichaam is gesloten gehouden, met blinde galmgaten; fijn maaswerk, hekwerk en windvanen zijn weggelaten. Het lage bouwdeel en de noordkapel zijn vereenvoudigd. Oorsprong RD (57717, 426478), lokale x-as (1, 0); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-catharinakerk-goedereede.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing van beide panden, twee gesloten en apart dragende volumes, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met de PDOK-reconstructie en schuine foto's.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
