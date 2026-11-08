# Sint-Petrus' Bandenkerk (Bergeijk)

De Hofkerk is een gotische kruiskerk zonder grote westtoren: die stortte in 1650 in. Het model bestaat uit schip, zijbeuken, dwarsschip, koor, dakruiter, steunberen en blinde vensternissen. Het vervangt BAG-pand 1724100000000528.

## Ligging en bestanden

Oorsprong RD (153012, 370230), de X-as [0,999, 0,04] loopt naar het koor. Het GLB en JSON zijn voor de kaart; de STL's voor 1:100 en 1:1000. Genereer met `node scripts/generate-sint-petrus-bandenkerk-bergeijk.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1724100000000528): voetafdruk en helling van kapvlakken; maaiveld circa +32,3 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN4 meet dakruitertop tot +55,63 m NAP, AHN5 geeft een samenhangend profiel tot +56,66 m NAP zonder topgat. Het model reikt tot +56,65 m NAP.
- [Open Monumentendag](https://www.openmonumentendag.nl/monument/hofkerk-3/), [rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/9258) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petrus%27_Bandenkerk_(Bergeijk)): bouwgeschiedenis en schuine aanzichten.

De vensternissen, steunberen en dakruiter zijn naar foto's geschat. Kleine dakkapellen, pinakels, maaswerk en het kruis zijn weggelaten; de dakruiter is bovenaan 0,9 m breed voor printbaarheid. Het losstaande historische luihuis naast de kerk heeft een eigen plek en is niet in dit kerkmodel opgenomen.

## Controle

Bekijk de kerk op [de kaart](http://localhost:3000/kaart/51.32131/5.35871/200/1x1/0). Twee uitsneden van 150 m met het hele model zijn met en zonder landmark geëxporteerd. De gerichte test controleert plaatsing, gesloten verbinding en printvorm na overhangopvulling.
