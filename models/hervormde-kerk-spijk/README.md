# Hervormde Kerk Spijk

Model van de Hervormde Kerk aan de Zuiderlingedijk 185 in Spijk, gemeente West Betuwe. Kerk en toren zijn afzonderlijke rijksmonumenten 22001 en 22002 en afzonderlijke BAG-panden 0733100000007251 en 0733100000008661. Het koor dateert uit de veertiende eeuw, het schip van rond 1500; de voet van de toren is ouder.

## Bronnen en maten

- [Rijksmonumentenregister kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/22001) en [toren](https://monumentenregister.cultureelerfgoed.nl/monumenten/22002), en [Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0189.php).
- [Wikimedia Commons: foto's van kerk en toren](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Spijk_(Lingewaal)).
- BAG voor de plattegrond, 3DBAG LoD2.2 voor dakvlakken en AHN DSM voor de hoogtecontrole. Maaiveld circa NAP +3,06 m; de hoogste AHN-punten NAP +39,26 tot +39,60 m liggen bij de top van de toren, waarschijnlijk aan de bekroning. Het raster heeft 43 lege cellen boven de toren en mist delen van de steile naald.
- [Historische opmeting met schaalbalk](https://www.dbnl.org/tekst/gron052vijf01_01/gron052vijf01ill0513.gif), afkomstig uit [De Vijfheerenlanden](https://www.dbnl.org/tekst/gron052vijf01_01/gron052vijf01_01_0018.php): de vergrote rastertekening geeft bij benadering 33,7 m tot de dakpunt en 37 m tot de bekroning. De punt van het model ligt op 33,7 m; tussen gemeten schouder en punt lopen de spitsvlakken recht zoals op de tekening en foto's. Deze aflezing heeft circa een meter onzekerheid.

Het model bevat de toren met ingesnoerde naald, het middenschip, de twee zijbeuken met elk drie dwarskapjes, het lagere driezijdige koor en kleine aanbouwen. Hoogten van de schouder, vensters, steunberen en kleine aanbouwen zijn geschat uit AHN en foto's. De spitspunt is verbreed voor 1:1000; windvaan, kruis, wijzerplaat, dunne venstertraceringen en kleine ornamenten zijn weggelaten. Voetafdruk circa 24,7 bij 12,7 m.

## Productie en controle

Het model is één gesloten volume en bedoeld voor afdruk op 1:1000 zonder steunmateriaal. Genereer GLB, JSON en STL met `node scripts/generate-hervormde-kerk-spijk.mjs` in de landmarks-repository. De webshop bevat een catalogus- en printtest in `tests/landmark-models.test.ts`. Een uitsnede van 150 bij 150 m is geëxporteerd en het model is van vier zijden met beide PDOK-gebouwreconstructies en foto's vergeleken. Controleer de ligging via [de kaart](http://localhost:3000/kaart/51.85670/5.00847/200/1x1/0).
