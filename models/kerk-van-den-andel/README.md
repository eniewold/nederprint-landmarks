# Kerk van Den Andel

Eenbeukige middeleeuwse zaalkerk met een apart staande toren op de wierde, Streekweg 91, rijksmonument 8582. Het model bestaat uit twee losse, gesloten bouwdelen: de kerk met zadeldak en de bakstenen toren met afgeknot tentdak en dakruiter. Het vervangt BAG-panden 0053100000007247 (kerk) en 0053100000007207 (toren). Beide onderdelen zijn printbaar op 1:1000 zonder steun; een losse STL bevat beide onderdelen zonder kunstmatige verbinding.

## Plaats en maten

Oorsprong RD (229727,24; 600460,18), +X (0,987; 0,160) loopt langs de nok. De kerk heeft volgens BAG een voetafdruk van circa 19,9 × 7,5 m; de vrijstaande toren meet circa 5,1 × 4,8 m. DTM-punten rond de kerk liggen rond NAP +2,4 m, rondom de toren circa +2,1 m. De torenvoet ligt daarom 0,3 m lager in het model. Aparte grondmonsterpunten bij beide gebouwen helpen de plaatsing op de wierde; de kaart en preview moeten altijd worden nagekeken op hun aansluiting met het terrein.

AHN-DSM meet de kerknok op NAP +13,01 m en de torentop op +18,499 m, met nabije cellen +18,2, +17,9 en +17,4 m. Een NoData-cel ligt op de dakruiterflank ongeveer 1 m van de hoogste cel; de hoogste cel zelf en zijn directe topburen hebben waarden. De gemodelleerde top is 16,1 m boven het referentieniveau van de kerk; de dunne windvaan is weggelaten. Door rasterresolutie kan het precieze topje iets hoger zijn.

Dakvlakken en hoofdafmetingen volgen BAG, AHN en 3DBAG. De vorm van het tentdak, de ruiter, nissen en vensterverdeling volgen de foto's; hun precieze verhoudingen zijn geschat. De open dakruiter is vereenvoudigd tot een gesloten printbare massa.

## Bronnen en controle

- [Rijksmonumentenregister 8582](https://monumentenregister.cultureelerfgoed.nl/monumenten/8582)
- [Groninger Kerken: kerk en toren](https://www.groningerkerken.nl/downloads/den_andel_kerkbeschrijving_tz_sw2025.pdf)
- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0053100000007247) en [3DBAG toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0053100000007207)
- [PDOK AHN WCS: DSM en DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Wikimedia Commons: kerk en vrijstaande toren](https://commons.wikimedia.org/wiki/File:Den_Andel_Kerk_%2B_Toren.JPG)

Genereer met `node scripts/generate-kerk-van-den-andel.mjs`, en voor een grote afdruk met `--scale 100`. Controleer op [de kaart](http://localhost:3000/kaart/53.38524/6.51029/200/1x1/0) de losse toren, dakruiter en aansluiting van beide voeten op het terrein.
