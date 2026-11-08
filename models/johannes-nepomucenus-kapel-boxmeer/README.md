# Johannes Nepomucenus Kapel (Boxmeer)

De Nepomukkapel is een zaalkapel uit 1737 met een gezwenkte halsgevel, driezijdige sluiting en kleine dakruiter. Het model bevat de vlakke daken, halsgevel, blinde vensternissen en ingang en vervangt BAG-pand 0756100000006877.

## Ligging en bestanden

Oorsprong RD (194340, 407148), X-as [0,967, 0,256] wijst vanaf de voorgevel naar de sluiting. Het GLB en JSON dienen voor de kaart, de STL's voor 1:100 en 1:1000. Genereer met `node scripts/generate-johannes-nepomucenus-kapel-boxmeer.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0756100000006877): grondvlak 92,42 m², contour en dakvlakken; maaiveld circa +12,95 m NAP, nok +23,23 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): dakruitertop AHN4 +25,02 m en AHN5 +25,20 m NAP, met samenhangende metingen zonder topgat. Modeltop +25,20 m NAP.
- [Historische Vereniging Nepomuk](https://www.nepomukboxmeer.nl/home/de-nepomukkapel/), [rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/10041) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:R.K._Kapel_van_St._Jan_Nepomuk): geschiedenis en foto's van gevels en dakruiter.

De gebogen halsgevel is als vlak profiel benaderd; venster- en ingangsafmetingen en de kleine dakruiter zijn geschat naar foto's. De ruiter is tot minimaal 0,9 m verbreed voor printbaarheid; kruis, glasroeden en fijn reliëf ontbreken.

## Controle

Bekijk de gevel, dakruiter en positie op [de kaart](http://localhost:3000/kaart/51.65178/5.95567/200/1x1/0). Twee uitsneden van 150 m met het hele gebouw zijn met en zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
