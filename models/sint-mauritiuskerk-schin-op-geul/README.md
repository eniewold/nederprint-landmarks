# Sint-Mauritiuskerk (Schin op Geul)

Kerk op een helling met een oud driebeukig schip, de toren uit 1768 en een hoger, halfrond gesloten koor met kruisuitbreiding uit 1926. De uitbreiding heeft een kenmerkende dakruiter.

## Bestanden en plaatsing

- `sint-mauritiuskerk-schin-op-geul.glb` en `.json`: kaartmodel en catalogusplaatsing; vervangt BAG-pand `0994100002017570`.
- `sint-mauritiuskerk-schin-op-geul-1-100.stl` en `sint-mauritiuskerk-schin-op-geul-1-1000.stl`: gesloten printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-sint-mauritiuskerk-schin-op-geul.mjs`.

Oorsprong RD `[189074, 318485]` bij de westtoren; X-as `[0.99, -0.14]` richting koor. Richtmaaiveld NAP +90,7 m; de voet is 0,9 m ingegraven. `groundSamplePoints` liggen rond het gebouw op het verhoogde kerkhof, zodat een lager punt onder aan de heuvel de kerk niet naar beneden trekt.

## Vorm en aannames

Het oude schip, de zijbeuken, de kruisvormige uitbreiding, de halfronde koorsluiting, de lage aanbouwen en de toren zijn losse bouwdelen met vlakke daken. De dakruiter is op printschaal een gesloten achthoekig bouwdeel met blinde nissen en vereenvoudigde kap. De toren heeft een ingesnoerde achtzijdige spits, afgeknot op 22,7 m boven het richtmaaiveld. AHN5 geeft daar samenhangende hoogtes tot NAP +113,38 m; AHN4 meet +113,75 m naast enkele lege cellen. Plattegrond en lagere daken komen uit de 3D BAG. Vensters, steunberen, lage aanbouwen en de dakruiter zijn vereenvoudigd; kleine kruizen en maaswerk zijn weggelaten. Het model is één gesloten manifold en is op 1:1000 getest met overhangopvulling.

## Controle en bronnen

Controlekaart: http://localhost:3000/kaart/50.85515/5.87134/200/1x1/0. Controleer de maaiveldaansluiting op het kerkhof, het hoge ronde koor en de dakruiter.

- [3D BAG pand 0994100002017570](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0994100002017570): plattegrond en dakvlakken.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN5-DSM en vergelijking AHN4-DSM/DTM.
- [Heilige Mauritius Parochie](https://kerkschinopgeul.nl/historie/): historische opbouw.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/schin-op-geul/mauritius): bouwfasen en ligging op de helling.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Mauritiuskerk_(Schin_op_Geul)): exterieurfoto's.
