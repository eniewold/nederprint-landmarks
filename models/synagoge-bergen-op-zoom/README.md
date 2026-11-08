# Synagoge (Bergen op Zoom)

De voormalige synagoge aan de Koevoetstraat is in 1832 ingewijd. Het model heeft een rechthoekig volume met schilddak, drie straatvensters, een centrale ingang en zijvensters. Het vervangt BAG-pand 0748100000002259.

## Ligging en bestanden

Oorsprong RD (78819,55, 390026,9), X-as [0,813, -0,582] langs de lange as vanaf de straatgevel. Het GLB en JSON zijn voor de kaart; de STL's zijn voor 1:100 en 1:1000. Genereer met `node scripts/generate-synagoge-bergen-op-zoom.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0748100000002259): contour, nok en vlakke schilddakvlakken; maaiveld circa +7,07 m NAP en nok circa +19,48 m NAP.
- [AHN](https://www.ahn.nl/dataroom): dakprofiel en nok gecontroleerd; geen groot NoData-gat.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/9181), [Open Monumentendag](https://www.openmonumentendag.nl/monument/synagoge-5/) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Synagoge_(Bergen_op_Zoom)): geschiedenis en voor-, zij- en achteraanzichten.

Maten en exacte vorm van de vensternissen en ingang zijn naar foto's geschat. De ronde venstertoppen zijn voor printbaarheid als spitse nissen vereenvoudigd; het smalle opschrift en glasroeden zijn weggelaten. De lange gevels hebben vereenvoudigde nissen; de gedeelde muur met het aangrenzende pand moet op de kaart worden gecontroleerd.

## Controle

Controleer de oriëntatie en drie vensters op [de kaart](http://localhost:3000/kaart/51.49411/4.29019/200/1x1/0). Uitsneden van 150 m met het hele model zijn met en zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
