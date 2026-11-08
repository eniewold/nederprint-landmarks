# Titus Brandsma Gedachteniskerk (Nijmegen)

Vereenvoudigd printbaar model van de voormalige Sint-Jozefkerk aan het Keizer Karelplein, opgebouwd uit gesloten bouwdelen met afzonderlijke dakvlakken.

## Bestanden

- `titus-brandsma-gedachteniskerk-nijmegen.glb`: model in meters voor de kaart.
- `titus-brandsma-gedachteniskerk-nijmegen.json`: catalogusgegevens en bronverwijzingen.
- `titus-brandsma-gedachteniskerk-nijmegen-1-1000.stl`: model in millimeters op schaal 1:1000.
- Generator: `scripts/generate-titus-brandsma-gedachteniskerk-nijmegen.mjs`.

## Plaatsing en vorm

De oorsprong ligt bij de viering op RD (187501,5; 428106,5); de lokale X-as is (0,9755; -0,22), de lokale +Y-as wijst naar de hoofdgevel. Het maaiveld is circa NAP +30,01 m; de onderzijde ligt 0,5 m lager. Het model vervangt BAG-pand 0268100000019937. Het hoogste punt van het model is circa 37,35 m boven dit maaiveld. De plattegrond, richting en de hoofdhoogten zijn afgeleid uit 3DBAG, AHN en PDOK-luchtfoto; de daken zijn als afzonderlijke vlakken gemaakt.

De kruisbasiliek bevat middenschip, dwarsschip, zijbeuken, achthoekige vieringtoren, twee hoge geveltorens, ronde apsissen en lagere aangebouwde delen. De hoofdvorm is uit de luchtfoto en het AHN afgeleid; detaillering en verhoudingen van gevelnissen, deuren, de roosvensters, dakkapellen en het kleine torentje zijn vereenvoudigd en op foto's geschat. Dunne kruisen, ornamenten, glasverdeling en goten zijn vanwege de printschaal weggelaten. Ook de kleine details van de aanbouwen zijn vereenvoudigd.

## Controle

De generator controleert een vlakke voet en één gesloten manifold. De catalogustest controleert positie, BAG-vervanging en de vorm na overhangopvulling op schaal 1:1000. Een volledige uitsnede is met en zonder landmark geëxporteerd; de gezichtspunten zijn naast de bestaande PDOK-reconstructie en bronfoto's gelegd. De gebruiker controleert de plaatsing en herkenbaarheid via de kaart, in het bijzonder de aansluiting van de aanbouwen en de torendaken.

## Bronnen

- [3DBAG, pand 0268100000019937](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000019937), contour, maaiveld en dakgegevens.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m.
- [PDOK luchtfoto WMS](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0), ligging en dakvormen.
- [Rijksmonumentenregister 522992](https://monumentenregister.cultureelerfgoed.nl/monumenten/522992), gebouwidentificatie.
- [Wikimedia Commons: Titus Brandsma Memorial](https://commons.wikimedia.org/wiki/Category:Titus_Brandsma_Memorial), gevels en opstanden.
