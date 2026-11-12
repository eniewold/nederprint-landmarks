# Dorpskerk Pijnacker

De Dorpskerk is een neogotische kerk uit 1892 met vrijstaande herbouwde dorpstoren. De oude scheve toren stortte in 1940 in; de huidige toren is in 2001 geopend. Het model vervangt kerk-BAG-pand `1926100000478240` en torenpand `1926100000488627`. Ze zijn afzonderlijke gesloten, elk op het terrein rustende volumes, met hun werkelijke tussenruimte.

## Bronnen en schattingen

- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1926100000478240) en [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1926100000488627): contouren en dakvlakken; kerknok circa 16,4 m NAP en bovenzijde torenschacht circa 28,3 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa -0,5 m NAP; de gemeten torenpunt circa 39,3 m NAP is door de smalle spits onvolledig.
- [Rijksmonument 32257](https://monumentenregister.cultureelerfgoed.nl/monumenten/32257) en [beschrijving van de herbouw](https://www.telstar-online.nl/nieuws/kerkbericht/168757/25-jaar-jubileum-nieuwe-scheve-toren-dorpskerk-pijnacker): identificatie, herbouw en torenhoogte van circa 45,6 m.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Dorpskerk,_Pijnacker): foto's van de kerk van verschillende kanten en een foto van de huidige toren; historische torenfoto's zijn alleen gebruikt voor overeenkomstige geveldetails.

De torenhoogte van 45,6 m boven maaiveld volgt de bron; de spitsvorm is geschat naar foto's en de top is verbreed tot 1 mm op 1:1000. Vensternissen, galmgaten, kleine portaal en achterbouw zijn vereenvoudigd; maaswerk en windvaan zijn weggelaten. Oorsprong RD (89501,72; 447628,91), lokale x-as (0,999; -0,04); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-dorpskerk-pijnacker.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, twee gesloten en afzonderlijk dragende volumes, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met de PDOK-reconstructie en foto's; PDOK kapt de torenspits af.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
