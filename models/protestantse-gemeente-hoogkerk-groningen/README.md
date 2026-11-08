# Protestantse gemeente Hoogkerk Groningen

De Olle Kerk is een romaanse zaalkerk met smaller, recht gesloten koor en een achtkante dakruiter. De middeleeuwse vrijstaande toren ging in 1514 verloren.

## Bronnen en maten

- [Rijksmonumentenregister 18750](https://monumentenregister.cultureelerfgoed.nl/monumenten/18750), [Groninger Kerken](https://www.groningerkerken.nl/) en [restauratiehistorie](https://www.dewesterkrant.nl/cultuur/cultuur/81821/deze-drie-pareltjes-zijn-te-bewonderen-op-open-monumentendag): middeleeuwse kerk en herstel.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010911095): BAG-contour, daken, maaiveld NAP +1,237 m, schipnok circa 13,7 m en koornok circa 12,7 m boven maaiveld; de reconstructie vlakt de dakruiter af.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): op de dakruiter een groep punten tot NAP +22,0 m; de hoogste dunne punt kan van de windvaan zijn. Modeltop 19,5 m boven maaiveld is geschat uit de punten, de lagere dakruiter en foto's; de dunne windvaan is weggelaten.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:De_Olle_Kerk) en [Staat in Groningen](https://staatingroningen.nl/collectie/nederlands-hervormde-kerk-hoogkerk): foto's van langsgevels, dakruiter en restauratie.

Het model gebruikt gesloten bouwdelen en afzonderlijke dakschilden voor schip en koor. Geschat zijn de precieze dakruiterhoogte zonder windvaan, lisenen, gevelopeningen en de afgeronde bekroning. Fijn boogfries, glaswerk en windvaan zijn op printschaal weggelaten.

## Controle

Eén gesloten component met 1048 driehoeken. De webshoptest controleert plaatsing en ondersteuning op 1:1000. Twee echte 150 bij 150 m exports met en zonder landmark zijn geslaagd en vier aanzichten zijn naast PDOK en foto's vergeleken. [Controlekaart](http://localhost:3000/kaart/53.21641/6.50104/200/1x1/0): controleer dakruiter, het lagere koor en de zijingang.

Generator: `node scripts/generate-protestantse-gemeente-hoogkerk-groningen.mjs`.
