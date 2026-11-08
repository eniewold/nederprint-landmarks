# Groot Tuighuis ('s-Hertogenbosch)

Het Groot Tuighuis is de voormalige Sint-Jacobskerk, later arsenaal en tegenwoordig erfgoedcentrum. Het model heeft een verhoogd middenschip, lagere zijbeuken, een driezijdig gesloten koor, steunberen en blinde gevelnissen. Het vervangt BAG-pand 0796100000227151.

## Bestanden en ligging

Oorsprong RD (149890, 410924), X-as langs het gebouw naar het koor [0,9999, 0,012]. Het GLB en JSON zijn voor de kaart, de STL's zijn op 1:100 en 1:1000. Maak ze opnieuw met `node scripts/generate-groot-tuighuis-s-hertogenbosch.mjs --scale 1000` en `--scale 100`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0796100000227151): contour en dakvlakken; maaiveld circa +5,64 m NAP, daknok circa +29,2 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): in het DSM ligt de hoogste nok op circa +29,28 m NAP; het dak heeft geen groot meetgat.
- [Erfgoed 's-Hertogenbosch](https://www.erfgoedshertogenbosch.nl/verhalen/geschiedenis-van-het-groot-tuighuis) en [rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/21585): de geschiedenis en bouwvorm.
- [Wikimedia Commons, Groot Tuighuis](https://commons.wikimedia.org/wiki/Category:Groot_Tuighuis_(%27s-Hertogenbosch)): schuine aanzichten van gevels, koor en dak.

De details van de gevelnissen, steunberen en de precieze aansluiting tussen de zijbeuken en het koor zijn op basis van foto's geschat en vereenvoudigd. Het ronde westvenster en de ingang zijn weergegeven; klein lijstwerk en maaswerk zijn weggelaten. De nok ligt in het model 23,5 m boven maaiveld.

## Controle

Bekijk de plaatsing op [de kaart](http://localhost:3000/kaart/51.68708/5.31330/200/1x1/0). Een uitsnede van 150 m met het gehele gebouw is met en zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, de gesloten verbinding en de printvorm na overhangopvulling.
