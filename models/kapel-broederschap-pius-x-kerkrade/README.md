# Kapel Broederschap Pius X (Kerkrade)

Model van de voormalige kloosterkapel van de Broeders Franciscanen en de haakse kloostervleugel in Bleijerheide. Beide delen vallen onder hetzelfde BAG-pand en zijn daarom samen gemodelleerd. De kapel uit 1891 heeft een vijfzijdig koor en een naaldvormige dakruiter.

## Bestanden en plaatsing

- `kapel-broederschap-pius-x-kerkrade.glb` en `.json`: kaartmodel en catalogusplaatsing; vervangt BAG-pand `0928100000116638`.
- `kapel-broederschap-pius-x-kerkrade-1-100.stl` en `kapel-broederschap-pius-x-kerkrade-1-1000.stl`: gesloten printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-kapel-broederschap-pius-x-kerkrade.mjs`.

Oorsprong RD `[203199.4, 317876.7]` op het knooppunt van de twee vleugels; de X-as `[0.705, -0.709]` loopt naar het koor. Het richtmaaiveld ligt op NAP +165,2 m; de voet is 0,7 m ingegraven.

## Vorm en aannames

Kapel, kloostervleugel, koor, aanbouw, steunberen, dakruiter, twee topgevels en dakkapellen zijn afzonderlijke bouwdelen met vlakke daken. De kapelnok is circa 19,2 m boven maaiveld; de gemodelleerde afgeknotte dakruiter reikt tot 31,4 m. Het AHN meet een piek van NAP +196,9 m. De 3D BAG mist de dakruiter, maar levert de hoofdvorm van de daken en de plattegrond. Vensters, steunberen, dakkapellen, achteraanbouw en de dakruiter zijn naar foto's vereenvoudigd; het dunne kruis is weggelaten. De dakkapellen en hun puntjes zijn vergroot en afgeknot op minstens 0,9 m voor 1:1000; de fijnere gevelornamenten en kruizen zijn te dun om vrijstaand te printen en daarom weggelaten. Eén gesloten manifold is getoetst met overhangopvulling.

## Controle en bronnen

Controlekaart: http://localhost:3000/kaart/50.84878/6.07183/200/1x1/0. Controleer positie van kapel en klooster, dakruiter en aansluiting op maaiveld.

- [3D BAG pand 0928100000116638](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0928100000116638): contour en dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM en DTM.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/bleijerheide/kloosterkapel-broeders-franciscanen-thans-kerk-st-maria-ter-engelen): bouwgeschiedenis en beschrijving.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Klooster_der_Broeders_Franciscanen_(Kerkrade)): foto's van het complex.
