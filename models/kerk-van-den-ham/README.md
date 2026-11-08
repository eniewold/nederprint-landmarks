# Kerk van Den Ham

Zaalkerk uit 1729 op de wierde van Den Ham (Groningen), met driezijdig gesloten koor en houten dakruiter op de westgevel.

## Bronnen en maten

- [Rijksmonumentenregister 7081](https://monumentenregister.cultureelerfgoed.nl/monumenten/7081) en [lokale kerkgeschiedenis](https://www.kerkdenham.nl/historie): bouwjaar en oorspronkelijke indeling.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0056100000002008): gebouwcontour, dakvlakken en grondhoogte NAP +1,801 m; daknok ongeveer 10,7 m boven maaiveld. De automatische reconstructie mist een groot deel van de dakruiter.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): de hoogste cel op de dakruiter is circa NAP +20,3 m, 18,5 m boven maaiveld, met omliggende cellen die de spitshelling volgen. Het model eindigt op 18,25 m zonder dunne bekroning.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Den_Ham,_Zuidhorn)): foto's van voorzijde, noord- en zuidgevel en de koorsluiting.

De maatvoering van de dakruiter, de lisenen en de vensternissen is uit foto's en hoogtemetingen benaderd. Het dak bestaat uit hellende vlakken. Fijn glaswerk, galmborden en de dunne windvaan zijn vanwege de schaal weggelaten.

## Controle

Eén gesloten component met 716 driehoeken. De webshoptest controleert plaatsing en ondersteuning op 1:1000. Beide echte 150 bij 150 m exports met en zonder landmark zijn geslaagd en vier richtingen zijn vergeleken met PDOK en foto's. [Controlekaart](http://localhost:3000/kaart/53.27019/6.42713/200/1x1/0): controleer de dakruiter, zijingang en koorsluiting.

Generator: `node scripts/generate-kerk-van-den-ham.mjs`.
