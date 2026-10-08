# Westkapelle Hoog — Westkapelle

Eigen reconstructie van de voormalige Sint-Willibrorduskerktoren met het Hoge Licht. De BAG-voet van pand 0717100000010360 bepaalt romp, oriëntatie en acht haakse steunberen. AHN4 DSM/DTM (0,5 m, 8 oktober 2026) geeft maaiveld circa NAP +1,6 m, het torenplat circa +39,5 m en hoogste punt +53,27 m. RWS noemt de kerktoren 38 m hoog; de gemodelleerde bekroning is 51,7 m boven de voet. Publieke vermeldingen van 53 m worden niet als exacte lokale bouwhoogte gebruikt.

RD-oorsprong [20387.1, 395149.14], +X [0.99124, -0.13208] vrijwel oost. GLB in meters, Y omhoog; onderkant 0,6 m onder bemonsterd maaiveld. Alleen dit BAG-pand wordt vervangen. Het omringende kerkterrein blijft PDOK.

De romp bestaat uit één gevelvolume; steunberen hebben elk een doorlopend profiel met bouwkundige versnijdingen. Vier geledingen zijn aangegeven door lijsten en gepaarde blinde spitsboognissen. De westdeur is blind. IJzeren cilindermantel, schuine omgangkraag, gesloten omlooprand, lichthuis, koepel en bekroning zijn aparte bouwdelen die tot één gesloten solid verenigd zijn. Geen hoogtelagen of gekopieerde modellen.

Geschat uit twee schuine foto's: geledinghoogtes, steunbeerprofielen, nisverdeling en maten van de lichtopbouw. Nissen 0,35–0,4 m diep; klein maaswerk, baksteenverband, dunne antennes en smalle buitenste nissen vervallen. Hekwerk en bekroning zijn minimaal 0,9 m dik voor 1:1000.

Genereren: `node scripts/generate-westkapelle-hoog.mjs`. STL 1:1000 in millimeters, Z omhoog: circa 13,8 × 13,8 × 52,3 mm, één solid, genus 0, 4630 driehoeken, Manifold NoError. De export op 45° vraagt minder dan 0,1% extra volume. Vergeleken met de PDOK-reconstructie van vier kanten, bron-GLB geladen met GLTFLoader, volledige preview/3MF van RD [20345,395115,20425,395195] op 1:1000 en kaart met landmarkschakelaar gecontroleerd. De voet ligt op alle gecontroleerde punten minstens 0,62 m in het gereconstrueerde terrein.

[Controlekaart](http://localhost:3001/kaart/51.52917/3.44694/350/1x1/0): controleer de westelijke entree, steunberen en verhouding kerktoren/lichtopbouw.

Bronnen:

- [RCE, monument 38855](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/38855), omschrijving en geschiedenis.
- [Rijkswaterstaat, het Hoge Licht](https://www.rijkswaterstaat.nl/over-ons/onze-organisatie/onze-historie/onze-monumenten/vuurtoren-hoge-licht), kerktorenhoogte.
- [Foto R01](https://commons.wikimedia.org/wiki/File:Lighthouse_Westkapelle_Hoog_R01.jpg) en [foto R03](https://commons.wikimedia.org/wiki/File:Lighthouse_Westkapelle_Hoog_R03.jpg), twee schuine aanzichten.
- PDOK BAG WFS, AHN4 DSM/DTM en actuele orthoHR; bbox 20300,395080,20440,395220.
