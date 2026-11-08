# Sint-Joriskerk (Venlo)

De Sint-Joriskerk bestaat uit een laatmiddeleeuwse gasthuiskapel en een haaks daarop gebouwde uitbreiding van 1719. Het model heeft twee afzonderlijke kappen met driezijdige sluitingen, steunberen, vensternissen en een vereenvoudigde achtkantige dakruiter. Het vervangt BAG-pand 0983100000006052.

## Ligging en bestanden

Oorsprong RD (209500, 375940), de X-as wijst langs de oude kap naar het oosten [0,99863, -0,05234]. Het model is één gesloten bouwdeel. Het GLB en JSON zijn voor de kaart; de STL's zijn op 1:100 en 1:1000. Genereer met `node scripts/generate-sint-joriskerk-venlo.mjs --scale 1000` en `--scale 100`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0983100000006052): voetafdruk en dakvlakken; maaiveld +18,33 m NAP.
- [AHN](https://www.ahn.nl/dataroom): hoogte van de kappen en samenhangende torenmetingen tot circa +40,9 m NAP, zonder groot gat op de top. Gemodelleerde hoogte 22,6 m boven het maaiveld.
- [Visit Noord-Limburg](https://www.visitnoordlimburg.nl/nl/joriskerk): bouwgeschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Joriskerk,_Venlo): schuine aanzichten en gevels.

De precieze steunbeermaten, vensters, dakruiter en de aansluitingen tussen de kappen zijn vereenvoudigd naar foto's geschat. De kleine lantaarnopeningen en het torenornament zijn voor printbaarheid op 1:1000 weggelaten, de top is ten minste 0,9 m breed. De gevelvensters zijn blinde nissen. Het AHN en de 3DBAG plaatsen de top ongeveer een halve meter uiteen; de kleinere ornamenten zijn niet gemodelleerd.

## Controle

De plaatsing en vervanging zijn te bekijken via [de kaart](http://localhost:3000/kaart/51.37004/6.16997/200/1x1/0). Een uitsnede van 150 m is met en zonder landmark geëxporteerd; beide bevatten het complete gebouw. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
