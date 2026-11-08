# Voormalige Hervormde kerk, Stevensweert

Kleine driezijdig gesloten zaalkerk uit 1819 met houten geveltoren en tentdak. Het model is opgebouwd uit een kerkzaal met vlakke dakvlakken, een toren, schuine dakrand en gevelaccenten. De toren is integraal verbonden met het kerkvolume. De kerk vervangt BAG-pand 1641100001080817.

## Bronnen en aannames

- [3DBAG, pand en reconstructie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1641100001080817): ligging, oriëntatie, omtrek en dakhoogte.
- [AHN dataroom](https://www.ahn.nl/dataroom): maaiveld circa +25,23 m NAP; AHN4 meet op de toren circa +40,41 m NAP en AHN5 circa +41,57 m NAP. Er is geen NoData-gat in het torengebied.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/stevensweert/hervormde-kerk-voormalige) en [foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Stevensweert)): bouwvorm, toren en gevels.

Het hoogste gemodelleerde punt ligt op circa +40,33 m NAP, ongeveer 15,1 m boven maaiveld. Het verschil tussen AHN4 en AHN5 aan de top kan samenhangen met het kleine ornament en de rastermeting; dat detail is te dun voor 1:1000 en is weggelaten. De exacte toren- en dakrandbreedte, vensternissen en details zijn naar foto's geschat. Kleine ornamenten zijn vereenvoudigd; de spits is bovenaan ten minste 0,9 m breed voor printbaarheid.

## Genereren en controleren

Voer `node scripts/generate-voormalige-hervormde-kerk-stevensweert.mjs --scale 1000` en opnieuw met `--scale 100` uit. Het model vormt één gesloten volume. Controleer de positie en vervanging op [de kaart](http://localhost:3000/kaart/51.13155/5.84450/200/1x1/0). Een uitsnede van 150 m is met en zonder landmark geëxporteerd; het landmark valt volledig binnen de uitsnede.
