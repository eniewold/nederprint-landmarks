# Hervormde kerk Hei- en Boeicop

Deze kerk heeft een lang schip, een schilddak aan de oostzijde, steunberen en een open dakruiter. De oorspronkelijke westtoren is tussen 1781 en 1830 verdwenen; het model toont de huidige situatie met de lage bijbouw van BAG-pand 0707100000374815.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0707100000374815): omtrek, ligging en AHN5-maten uit 2023; maaiveld NAP +1,042 m en nok NAP +17,344 m.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): dakruitermeetpunt circa 26,12 m boven maaiveld, in het model 26,1 m; de PDOK-reconstructie mist de ruiter.
- [Rijksmonumentenregister 21330](https://monumentenregister.cultureelerfgoed.nl/monumenten/21330) en [beschrijving bouwgeschiedenis](https://www.dbnl.org/tekst/gron052vijf01_01/gron052vijf01_01_0017.php): oorspronkelijke toren en wijzigingen aan het koor.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Hei-_en_Boeicop): schuine foto's van oost, west en beide langsgevels en een detail van de dakruiter.

Schip, schilddak, bijbouw en steunberen bestaan uit gesloten bouwdelen met dakvlakken. De afmetingen van dak en ligging volgen BAG en AHN; de ramen, steunberen, bijbouw en dakruiter zijn naar foto's en PDOK geschat. De dunne open klokkenstoel is vervangen door een 0,96 m brede gesloten drager met verbrede voet van de spits. De top is op 0,94 m afgevlakt voor schaal 1:1000; fijne klok, uurwerk, weerhaan en maaswerk zijn weggelaten. Ronde raamvormen zijn als printbare spitsboognissen vereenvoudigd.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, verbinding en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn vergeleken met PDOK en foto's van alle gevelzijden; de oostkap is na vergelijking gecorrigeerd tot schilddak. Hoofdgebouw, steunberen en bijbouw komen overeen; de dakruiter is op basis van AHN en foto's toegevoegd. Buurpand 0707100000374823 ligt 6,68 m weg zonder overlap, pand 0707100000370291 9,34 m; beide zijn ook met het lokale AHN vergeleken.

Regenereren: `node scripts/generate-hervormde-kerk-hei-en-boeicop.mjs` vanuit de landmarks-repository.
