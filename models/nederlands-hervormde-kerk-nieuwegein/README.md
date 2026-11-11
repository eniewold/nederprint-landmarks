# Nederlands Hervormde Kerk Nieuwegein

De Dorpskerk van Jutphaas is een zaalkerk met tweezijdig schilddak, centraal klokkentorentje en zijportaal. Het model vervangt BAG-pand 0356100000079618; het aangrenzende pand 0356100000079608 blijft afzonderlijk.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0356100000079618): contour, ligging en AHN5-gegevens uit 2023, maaiveld NAP +1,838 m en nok NAP +14,883 m.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torenmeting circa 22,90 m boven maaiveld; modeltop 23 m. De PDOK-mesh mist de dakruiter.
- [Rijksmonumentenregister 30404](https://monumentenregister.cultureelerfgoed.nl/monumenten/30404) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Dorpskerk_(Jutphaas)): monument en foto's van de gevels.

Het schip met dakschilden, portaal en lage gang zijn gesloten bouwdelen; de dakruiter is toegevoegd als afzonderlijk verbonden onderdeel. Gevelnissen, portaal en ruitervorm zijn naar foto's geschat. De dunne open klokkenstoel is voor schaal 1:1000 vervangen door een gesloten dragende kern van 0,96 m; spitsvoet en top zijn verbreed, klok, wijzerplaat en weerhaan weggelaten. De spitsboogvensters zijn ondiep ingesneden.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, plaatsing, BAG-vervanging, verbinding, genus en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn naast PDOK en foto's van de langsgevels en kopzijden bekeken; de hoofdvorm en dakschilden komen overeen en de dakruiter is naar AHN en foto's toegevoegd. Een miniem raakvlak met naastgelegen pand 0356100000079608 is gecorrigeerd; er resteert circa 0,04 m tussenruimte en geen overlap. De lokale AHN-waarden bij dit pand zijn gecontroleerd.

Regenereren: `node scripts/generate-nederlands-hervormde-kerk-nieuwegein.mjs` vanuit de landmarks-repository.
