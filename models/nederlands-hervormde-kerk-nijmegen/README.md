# Nederlands Hervormde Kerk Nijmegen (Witte Kerkje Neerbosch)

Landmarkmodel van de kerk aan de Dorpsstraat in Neerbosch, met westtoren en driezijdig gesloten koor. De kerk en toren zijn afzonderlijke rijksmonumenten (31205 en 31206); het BAG-pand 0268100000045592 omvat het geheel. De vermelding 1888 in de BAG is geen bouwdatum van de middeleeuwse kerk.

## Bronnen en maatvoering

- [Rijksmonumentenregister kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/31205) en [toren](https://monumentenregister.cultureelerfgoed.nl/monumenten/31206).
- [Beschrijving in Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0157.php) en [foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_kerk_Neerbosch).
- BAG en 3DBAG/PDOK voor ligging, grondvlak en reconstructie; AHN voor hoogtecontrole. Gemeten maaiveld circa NAP +9,23 m, hoogste beschikbare AHN-punt NAP +45,07 m. De spits is daarom circa 35,8 m boven maaiveld gemodelleerd.

Het model is gebaseerd op de bouwdelen en zichtbare dakvlakken: schip met zijbeuken, koor, westtoren, portaal en steunberen. Het grondvlak is circa 25,4 bij 15,1 m; de exporthoogte inclusief inbedding bedraagt circa 36,3 m. De precieze hoogten en verhoudingen van goten, nok, portaal en steunberen en de afmetingen en diepte van de venster- en galmgatnissen zijn geschat uit foto's en de reconstructie. Het kruis en kleine ornamenten zijn wegens de printschaal weggelaten; de spitspunt is verbreed.

## Afdruk en controle

Het gesloten model vormt één verbonden volume, bedoeld voor afdruk op 1:1000 zonder ondersteuning. De spits heeft een verbrede top en kleine details zijn vereenvoudigd. Genereer de bestanden met `node scripts/generate-nederlands-hervormde-kerk-nijmegen.mjs` vanuit de landmarks-repository. De bijbehorende catalogus- en printcontrole staat in de webshop in `tests/landmark-models.test.ts`.

Controleer de plaatsing via [de kaart](http://localhost:3000/kaart/51.83511/5.81048/200/1x1/0). Een preview-export van een uitsnede van 150 bij 150 m is gecontroleerd, evenals aanzichten van vier zijden naast de PDOK-reconstructie en foto's. De hoogte van de PDOK-reconstructie is aan de spits zichtbaar afgekapt; de AHN-hoogte en foto's zijn voor de spits leidend.
