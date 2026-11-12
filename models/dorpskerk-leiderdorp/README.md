# Dorpskerk Leiderdorp

De Dorpskerk van Leiderdorp is een rechthoekige kerk met een hoog zadeldak en kleine dakruiter. Bij de restauratie is de negentiende-eeuwse westtoren verwijderd; het model toont de huidige dakruiter. Het vervangt BAG-pand `0547100000288641`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0547100000288641): contour en kapvorm; nok rond 18,02 m NAP. De dunne dakruiter ontbreekt grotendeels in de reconstructie.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 0,94 m NAP en hoogste geregistreerde dakruiterpunt circa 21,47 m NAP; de dunne spits is niet volledig bemonsterd.
- [Rijksmonument 25693](https://monumentenregister.cultureelerfgoed.nl/monumenten/25693) en [restauratiegeschiedenis](https://centraalplus.nl/2026/09/22/27-jaar-restaureren-de-bijzondere-geschiedenis-van-de-dorpskerk-in-leiderdorp/): identificatie en verwijdering van de oude toren.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Leiderdorp): actuele dakruiter en beelden van beide zijgevels en kopgevels; historische foto's met de inmiddels verwijderde toren zijn niet voor de huidige torenvorm gebruikt.

De spits en totale hoogte van circa 26,3 m boven maaiveld zijn geschat naar fotoverhoudingen, omdat AHN de smalle punt mist. De zeshoekige dakruiter is voor stevigheid gesloten met ondiepe nissen en bovenaan verbreed tot circa 1 mm op 1:1000. Vensters en kleine aanbouwen zijn vereenvoudigd naar foto's en BAG; hekwerk, maaswerk en windvaan zijn weggelaten. Oorsprong RD (95878,18; 462880,23), lokale x-as (0,9891; 0,1471); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-dorpskerk-leiderdorp.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, een gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met PDOK en foto's; de huidige dakruiter ontbreekt in PDOK.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
