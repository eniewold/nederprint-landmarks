# Romboutstoren (Andel)

De Romboutstoren is een laatmiddeleeuwse toren met gemetselde spits; van de vroegere kerk resteren muurdelen. Het model bestaat uit een vierkante schacht, spits, ruïnemuur, ingang, blinde galmgaten en ondiepe klokvelden. Het vervangt BAG-pand 0874100000007662.

## Ligging en bestanden

De oorsprong ligt op RD (131978,3, 421748,05); X-as [0,985, 0,174] loopt langs een torengevel. Het GLB en JSON zijn voor de kaart, de STL's voor 1:100 en 1:1000. Genereer met `node scripts/generate-romboutstoren-andel.mjs --scale 1000` en `--scale 100`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0874100000007662): voetafdruk en maaiveld circa +2,2 m NAP. De reconstructie is een doos en mist de spits.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN4-piek +24,93 m NAP, AHN5 toont een samenhangende spits tot +25,74 m NAP zonder NoData-gat bij de top. De gemodelleerde top ligt op +25,70 m NAP.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/39622), [Tankens restauratie](https://www.tankens.nl/over-tankens/actueel/romboutstoren-andel) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Romboutstoren,_Andel): bouwgeschiedenis, foto's en torenvorm.
- PDOK actuele luchtfoto: plaatsing van het aangrenzende muurrestant.

Lengte, dikte en aflopende bovenkant van de ruïnemuur zijn naar foto's geschat en voor 1:1000 minstens 0,9 m breed uitgevoerd. De klokvelden en vensternissen zijn vereenvoudigd; kleine wijzers, kruis en maaswerk ontbreken. De spits is bovenaan 0,9 m breed gemaakt, in plaats van een te dunne punt.

## Controle

Bekijk de plaatsing en de richting van de ruïnemuur op [de kaart](http://localhost:3000/kaart/51.78391/5.05357/200/1x1/0). Twee uitsneden van 150 m zijn met en zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
