# Heilige Maria Hemelvaartkerk (Bavel)

Neogotische driebeukige kruisbasiliek uit 1886–1887 met westtoren, slanke spits en dakruiter. Het model bestaat uit schip, zijbeuken, dwarsschip, koor, zijkapel, toren, dakruiter, steunberen en blinde vensternissen. Het vervangt BAG-pand 0758100000070064.

## Ligging en bestanden

De oorsprong ligt op RD (116352, 397541), de X-as [0,866, -0,5] wijst vanaf de toren naar het koor. Het GLB en JSON dienen voor de kaart; STL's zijn op 1:100 en 1:1000. Genereer met `node scripts/generate-heilige-maria-hemelvaartkerk-bavel.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000070064): contour en kerkelijke dakvlakken; maaiveld circa +6,8 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN4-top +52,87 m NAP en AHN5 samenhangend profiel tot +56,15 m NAP; op de smalle spits ligt een klein NoData-gat en de top wordt niet volledig gemeten.
- [Kunst in Breda](https://kunstinbreda.nl/religieus/kerken/bavel/) geeft onafhankelijk een torenhoogte van 55,6 m boven maaiveld. Die bron bepaalt de modelhoogte van +62,4 m NAP; dit is circa 6,25 m boven de hoogste AHN5-rastermeting. De extrapolatie van de dunne top is onzeker.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/30494) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Heilige_Maria_Hemelvaartkerk_(Bavel)) voor historie en schuine gevelaanzichten.

De dakruiter, torengeleding, steunberen, zijkapel en vensternissen zijn naar foto's geschat en vereenvoudigd. Kleine dakkapellen, kruis en maaswerk zijn weggelaten; de spits is bovenaan 0,9 m breed voor printbaarheid.

## Controle

Controleer de plaatsing en torenhoogte op [de kaart](http://localhost:3000/kaart/51.56539/4.83002/200/1x1/0). Twee uitsneden van 150 m met het gehele model zijn met en zonder landmark geëxporteerd. De gerichte test controleert plaatsing, gesloten verbinding en de printvorm na overhangopvulling.
