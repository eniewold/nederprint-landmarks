# Sint-Petrusbasiliek (Oirschot)

Vereenvoudigd gesloten model van de laatgotische kruisbasiliek met stompe westtoren, schip met zijbeuken, dwarsschip, hoogkoor, kooromgang, straalkapellen en de uivormige dakruiter. Het model is gebouwd uit dakvlakken en verbonden bouwdelen.

- `sint-petrusbasiliek-oirschot.glb`: één node `building:kerk`, in meters.
- `sint-petrusbasiliek-oirschot.json`: RD-plaatsing en vervanging van BAG-pand `0823100000000096`.
- `sint-petrusbasiliek-oirschot-1-1000.stl`: losse print in millimeters, Z omhoog, circa 89,8 × 52,6 × 63,3 mm.
- Genereer met `node scripts/generate-sint-petrusbasiliek-oirschot.mjs --components`.

De oorsprong ligt op RD (149440, 390505); de X-as [0,900, 0,435] volgt de kerk naar het oosten. De onderzijde ligt 0,5 m onder maaiveld. De 3D BAG geeft maaiveld NAP +16,871 m, een hoofdnok rond NAP +47 m en de kooromgang onder lagere schilden. De AHN-top ligt bij NAP +79,31 m; de hoogste torenonderdelen liggen in het model op circa 62,8 m boven maaiveld. De vroegere torenspits is niet meer aanwezig.

De exacte afmetingen van de straalkapellen, steunberen, raam- en dubbele galmgatnissen, torenlisenen, traptoren, torenbekroning en dakruiter zijn geschat uit de beschikbare dakvlakken en foto's. Kleine ornamenten, raamtraceringen en de open balustrade zijn voor schaal 1:1000 weggelaten; openingen zijn als blinde nissen gemaakt.

De generator controleert geslotenheid, Float32-rondgang en neerwaartse vlakken. Eén samenhangend volume heeft genus 0. De 45°-printcontrole vergelijkt volumes en doorsneden; volledige uitsneden van 150 × 150 m zijn met en zonder landmark geëxporteerd en vier aanzichten met PDOK en foto's vergeleken.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0823100000000096), [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonument 31282](https://monumentenregister.cultureelerfgoed.nl/monumenten/31282), [parochie: dakruiter](https://www.odulphusvanbrabant.nl/petrus/cultuur-historie/bezichtiging-van-de-st-petruskerk/), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petrusbasiliek_(Oirschot)).

