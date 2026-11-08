# Martinuskerk ('s Gravenmoer)

Gotische zaalkerk met koor en oudere vierkante westtoren. Het model heeft vlakke kapvlakken, driezijdige koorsluiting, achtkantige spits, steunberen, blinde vensternissen en een vereenvoudigde aanbouw. Het vervangt BAG-pand 0766100000009313.

## Bestanden en ligging

De oorsprong ligt op RD (123939,6, 407767,9), de X-as wijst naar het koor [0,996, 0,089]. Het GLB en JSON dienen voor de kaart, de STL's zijn op schaal 1:100 en 1:1000. Genereer met `node scripts/generate-martinuskerk-s-gravenmoer.mjs --scale 1000` en opnieuw met `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0766100000009313): grondvlak en kapvlakken; maaiveld circa +2 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN4 heeft twee aangrenzende hoge topmetingen tot +31,41 m NAP; AHN5 heeft een samenhangend spitsprofiel tot +30,48 m zonder NoData rond de top. De gemodelleerde top ligt op +31,4 m NAP; de top zelf is ten minste 0,9 m breed voor printbaarheid.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/18148) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Martinuskerk_(%27s_Gravenmoer)): bouwgeschiedenis en aanzichten.

De verschillen tussen beide AHN-opnames geven onzekerheid aan de exacte top; kleine puntornamenten ontbreken in het model. Steunberen, aanbouw, vensternissen en de exacte spitsvorm zijn naar foto's vereenvoudigd en geschat. Maaswerk en kleinere ornamenten zijn weggelaten.

## Controle

Controleer plaatsing en vervanging op [de kaart](http://localhost:3000/kaart/51.65789/4.93857/200/1x1/0). Een uitsnede van 150 m met het volledige gebouw is zowel met als zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
