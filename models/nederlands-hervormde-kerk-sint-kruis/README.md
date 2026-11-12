# Nederlands Hervormde Kerk Sint Kruis

Eenbeukige kerk met de forse westtoren De Peperbusse, zware hoekberen en een tentdak. Schip en toren zijn opgenomen in BAG-pand `1714100000735229` en zijn in het model één gesloten printbaar volume. De spitsboogvensters en galmgaten zijn als ondiepe nissen weergegeven.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1714100000735229): BAG-contour en dakvlakken.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 3 m NAP, schipnok 16 m NAP, torendak tot 30,4 m NAP.
- [Rijksmonument 6934](https://monumentenregister.cultureelerfgoed.nl/monumenten/6934) en [historische beschrijving](https://www.dbnl.org/tekst/_voo016voor11_01/_voo016voor11_01_0056.php): schip en westtoren met hoekberen.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_(Sint_Kruis)): foto's van schip, toren en detailindeling.

De tentdaktop is geschat op 27,4 m boven maaiveld; de top heeft een printbare breedte van 0,9 mm op 1:1000. De details van hoekberen, galmgaten, spitsboognissen en toegang zijn geschat uit foto's en vereenvoudigd. Windvaan, maaswerk en dakventilatie zijn te fijn om op deze schaal betrouwbaar weer te geven. Oorsprong RD (23013; 366487,1), x-as (0,9992; -0,04); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

`node scripts/generate-nederlands-hervormde-kerk-sint-kruis.mjs` genereert GLB, JSON en STL's op 1:100 en 1:1000. De gerichte test in `tests/landmark-models.test.ts` controleert plaatsing, één gesloten volume en de benadering van 45-graden ondersteuning. De vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's.

De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
