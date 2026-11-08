# Sint-Ludgerkerk Garnwerd

Romano-gotische zaalkerk op een wierde, met vijfzijdig koor en een grote zadeldaktoren. De kerk is in oorsprong middeleeuws; het BAG-bouwjaar 1859 beschrijft niet haar oorspronkelijke bouwperiode.

## Bronnen en maten

- [Rijksmonumentenregister 15559](https://monumentenregister.cultureelerfgoed.nl/monumenten/15559) en [Groninger Kerken](https://www.groningerkerken.nl/downloads/sogk_folder_kerk_garnwerd_lr.pdf): middeleeuwse zaalkerk, koor en zadeldaktoren.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0053100000007921): BAG-contour, dakvlakken en maaiveld NAP +2,337 m. Hoofdnok circa 15 m en torennok circa 26,5 m boven maaiveld.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): meerdere cellen op de torennok rond NAP +28,8 m, circa 26,5 m boven maaiveld. Een enkele hogere cel NAP +30,73 m is mogelijk de dunne bekroning; de modelnok 26,55 m is gebaseerd op het dak en laat die bekroning weg.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Ludgerkerk_(Garnwerd)): opnamen van het torendak, de noord- en zuidgevel en het koor.

Het model is samengesteld uit bouwdelen en vlakke daken. De maten van steunberen, vensternissen en kleine galmgaten zijn geschat. Dunne windvaan, uurwerk en fijn glaswerk zijn voor deze schaal weggelaten.

## Controle

Eén gesloten component, 1086 driehoeken. De webshoptest controleert plaatsing en ondersteuning op 1:1000. Echte 150 bij 150 m exports met en zonder landmark zijn geslaagd; vier aanzichten zijn naast PDOK en bronfoto's vergeleken. [Controlekaart](http://localhost:3000/kaart/53.30475/6.49077/200/1x1/0): controleer het zadeldak van de toren en de vijfzijdige koorsluiting.

Generator: `node scripts/generate-sint-ludgerkerk-garnwerd.mjs`.
