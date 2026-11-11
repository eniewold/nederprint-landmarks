# Kapel van Isselt Amersfoort

Kapel en voormalige boerderij vormen samen BAG-pand 0307100000322798. Het rijksmonumentenregister dateert de grafkapel en boerderij in de 15e eeuw; BAG vermeldt 1717 als bouwjaar. De kapel heeft een driezijdige sluiting met dakruiter en is met de boerderij verbonden.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0307100000322798): BAG-omtrek, ligging, grondoppervlak 161,8 m², maaiveld NAP +1,884 m en nok NAP +9,898 m (AHN5, 2023).
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): dakvorm en plaatselijke metingen bij de dakruiter; bomen beïnvloeden een aanzienlijk deel van het hoogtebeeld.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/7900) voor geschiedenis en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Kapel_van_Isselt) voor foto's van de kapelsluiting, dakruiter en woonzijde.

De hoofd- en zijkap zijn als dakvlakken uit profielen opgebouwd, de driezijdige kapelsluiting als afzonderlijk volume. Nok en contour volgen 3DBAG; vensterposities, schoorsteen en vorm van de dakruiter zijn naar foto's geschat. De dakruiter heeft een gesloten kern van 0,96 m in plaats van het dunne open houtwerk en een geschatte top op 10,25 m; de windvaan is weggelaten. De dakruiter en schoorsteen ontbreken in de PDOK-reconstructie. Het model behoudt de uitbouw van het BAG-pand.

## Controle

De taak valt niet af: de oppervlakte is 161,8 m² en de nok circa 8,01 m boven maaiveld, boven de taakgrenzen van 40 m² en ongeveer 6 m. De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, plaatsing, vervanging, verbinding en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve modelaanzichten zijn naast de PDOK-mesh bekeken; hoofdvolumes, kapelsluiting en uitbouw komen overeen, dakruiter en schoorsteen zijn toegevoegd op basis van foto's. De beschikbare schuine foto's tonen vooral de woonzijde en kapelsluiting; andere zijden zijn met BAG, AHN en PDOK beoordeeld. Buurpand 0307100000524563 ligt circa 2,1 m weg zonder overlap. De lokale AHN-waarde bij dit pand is door bomen verstoord en niet bruikbaar als dakhoogtecontrole.

Regenereren: `node scripts/generate-kapel-van-isselt-amersfoort.mjs` vanuit de landmarks-repository.
