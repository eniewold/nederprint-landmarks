# Johanneskerk (Weidum)

Het model omvat de romano-gotische eenbeukige kerk met een ronde koorsluiting en de oudere tufstenen toren. Het hoofdvolume heeft twee vlakke dakhellingen en een waaiervormig schild boven de apsis; de toren heeft een ingesnoerde, hoekige spits. Rondboogvensters, siernissen, deuren en galmgaten zijn blinde nissen.

## Bestanden en plaatsing

- `johanneskerk-weidum.glb`: gesloten model in meters, node `building:kerk-en-toren`, glTF Y omhoog.
- `johanneskerk-weidum.json`: RD-oorsprong (178580, 573318), +X langs het schip richting koor, as (0,9889; 0,1486), maaiveld NAP +3,39 m; vervangt BAG-pand 0140100000168429.
- `johanneskerk-weidum-1-1000.stl`: 1:1000 in mm, zonder grondplaat.
- Generator: `scripts/generate-johanneskerk-weidum.mjs`.

## Maten, aannames en weglatingen

De BAG/3D BAG levert contour en dakvlakken, met daknok NAP +17,15 m en goten circa +10,85 m. AHN-DSM meet de torenspits tot circa NAP +32,83 m; de uiterste tip is verbreed tot 0,9 m op ware grootte voor schaal 1:1000. De voet, vorm en detaillering van de ingesnoerde spits, portalen, toren- en vensternissen en blinde spaarvelden zijn uit de foto's geschat. De afsluiting van de apsis is als regelmatige ronde waaier gemodelleerd. Windvaan, klok, raamroeden, dakornamenten en details kleiner dan 0,9 m zijn weggelaten.

## Controle

De generator maakt een gesloten manifold en controleert de geometrie; de lokale modeltest controleert catalogusplaatsing, geslotenheid, componenten en 45-graden ondersteuning op 1:1000. De complete 150 m uitsnede is via de preview-export gecontroleerd; vier aanzichten worden vergeleken met PDOK en de onderstaande foto's. Kaartcontrole door de hoofdsessie via `/kaart/53.14609/5.73981/200/1x1/0`.

## Bronnen

- [3D BAG pand 0140100000168429](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0140100000168429): plattegrond, dakvlakken en maaiveld.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m, torenhoogte.
- [Rijksdienst voor het Cultureel Erfgoed, monument 8518](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/8518): bouwgeschiedenis en siernissen.
- [Wikimedia Commons: Johanneskerk Weidum](https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Weidum): foto's van verschillende kanten.
