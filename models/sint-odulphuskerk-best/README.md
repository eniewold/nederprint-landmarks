# Sint-Odulphuskerk (Best)

Neogotische driebeukige kruisbasiliek uit 1882 met westtoren. Het model heeft schip, zijbeuken, dwarsarmen, koor, kapellen, toren met achtkantige spits, hoekpinakels, dakruiter, steunberen en blinde vensternissen. Het vervangt BAG-pand 0753100000002070.

## Ligging en bestanden

Oorsprong RD (155287, 391391,5), X-as [0,45, -0,893] loopt van de toren naar het koor. Het GLB en JSON zijn voor de kaart, de STL's voor 1:100 en 1:1000. Genereer met `node scripts/generate-sint-odulphuskerk-best.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0753100000002070): contour en dakvlakken; maaiveld circa +15,91 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN4 meet torentop tot +82,32 m NAP, AHN5 een samenhangend topgebied tot +82,88 m, met een klein naburig NoData-gat.
- [Stichting Behoud Odulphuskerk](https://www.sbodulphus.nl/index.php?cat=5&site=www.sbodulphus.nl&subcat=39) noemt onafhankelijk een torenhoogte van 64,6 m, galerij op 37 m en nok van de kerk op 23 m. De modeltop ligt daarmee op +80,51 m NAP; het verschil met AHN5 kan mede samenhangen met het kleine topornament en rastermeting.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/512321) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Odulphuskerk_(Best)): geschiedenis en schuine aanzichten.

Torensteunberen, pinakels, dakruiter, aanbouwen en vensternissen zijn naar foto's geschat en vereenvoudigd. De galerij en fijne versieringen, het kruis, de haan en glasroeden zijn voor printbaarheid weggelaten; de spits is bovenaan minstens 0,9 m breed.

## Controle

Controleer plaatsing en torensilhouet op [de kaart](http://localhost:3000/kaart/51.51129/5.39148/200/1x1/0). Twee uitsneden van 150 m met het hele model zijn met en zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
