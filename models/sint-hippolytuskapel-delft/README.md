# Sint Hippolytuskapel Delft

De Sint Hippolytuskapel is een lang eenbeukig gebouw met een hoog zadeldak, afgeschuinde achterzijde en een slanke dakruiter aan de voorgevel. Het model vervangt uitsluitend BAG-pand `0503100000022708`; de naastgelegen panden blijven afzonderlijke PDOK-gebouwen.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0503100000022708): plattegrond en kap, met nok circa 14,58 m NAP en dakvoet circa 8,75 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 1,3 m NAP en hoogste punt van de dakruiter circa 20,58 m NAP.
- [Rijksmonument 12090](https://monumentenregister.cultureelerfgoed.nl/monumenten/12090) en [geschiedenis van de kapel](https://www.hippolytuskapel.nl/geschiedenis/): identificatie en context.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hippolytuskapel_(Delft)): schuine lucht- en straatfoto's van voorgevel, zijgevel en achterzijde.

De torenhoogte van circa 19,28 m boven maaiveld is afgeleid uit AHN; de zeszijdige dakruiter, spitsvorm en raamverdeling zijn geschat naar foto's. De open klokkengeleding is voor stevigheid gesloten uitgevoerd met ondiepe nissen en een spits die bovenaan circa 1 mm dik is op 1:1000. De spitsboogvensters zijn als reliëf vereenvoudigd; metselwerk, kozijnen en het kruis zijn weggelaten. De achterzijde en dakvlakken zijn vereenvoudigd naar BAG en foto's. Oorsprong RD (84242,34; 447481,21), lokale x-as (0,8997; 0,4365); het model zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-sint-hippolytuskapel-delft.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, één gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met de PDOK-reconstructie en schuine foto's; de dakruiter ontbreekt in PDOK.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
