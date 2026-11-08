# Heilige Antonius van Padua-Sint Annakerk (Nijmegen)

Landmark voor de Groenestraatkerk, de neogotische kruisbasiliek van Albert Margry uit 1909-1910 aan de Groenestraat (rijksmonument 524836, BAG-pand `0268100000013467`). Het model toont het brede schip met lichtbeuk, de zijbeuken met lessenaarsdaken, het dwarsschip met roosvensters, het koor met driezijdige apsis, de dakruiter op de viering en de twee ongelijke torens in de voorgevel: de hoge oosttoren met wimbergen, pinakels en naaldspits tot 56 m en de lagere westtoren met achtkante klokkenverdieping bij de pastorie.

## Bestanden

- `heilige-antonius-van-padua-sint-annakerk-nijmegen.glb`: één node `building:kerk`, meters, Y omhoog.
- `heilige-antonius-van-padua-sint-annakerk-nijmegen.json`: catalogusitem.
- `heilige-antonius-van-padua-sint-annakerk-nijmegen-1-1000.stl`: printbestand op 1:1000 in mm, Z omhoog.
- Generator: `scripts/generate-heilige-antonius-van-padua-sint-annakerk-nijmegen.mjs`.

## Oorsprong en oriëntatie

De oorsprong (RD 186741,73; 427039,77) ligt op de kerkas in de voorgevel aan de Groenestraat, op maaiveld NAP +23,47 m (3DBAG). De lokale x-as loopt langs de kerkas naar het koor in het zuiden (`xAxis` [-0,1305; -0,9914], 7,5 graden van het noorden, gemeten aan de nokken van schip en dwarsschip in het AHN); +y wijst naar het oosten.

## Onderdelen en maten

- Schip en koor: 11 m breed, goot 17,6 m, nok 24,3 m (AHN); dwarsschip 30,7 m lang en 11,4 m breed met dezelfde nok; topgevels met borstwering en hoekpinakels.
- Apsis: halve achthoek met binnenstraal 5,5 m en een steiler kegeldak; steunberen op de hoeken.
- Zijbeuken: lessenaarsdak van 9,0 naar 12,3 m, steunberen met pinakels tussen de traveeën; voorste traveeën met een dwars zadeldak (nok 15,5 m); koorkapellen aan beide zijden.
- Oosttoren: schacht 6,4 × 6,0 m tot 30,5 m, hoeksteunberen, klok, galmgaten, vier wimbergen en hoekpinakels, achtkante naaldspits tot 56 m (Wikipedia; het AHN raakt de spits tot 52,7 m).
- Westtoren: schacht 4,8 × 4,6 m tot 20,5 m, achtkante klokkenverdieping, naaldspits tot 34 m (AHN tot 31,2 m, de top uit de foto geschat).
- Dakruiter: achtkante lantaarn met naald tot 36 m (AHN tot 33,8 m).
- Aanbouwen binnen hetzelfde BAG-pand: de oostelijke aanbouw met afgeschuind plat dak (8,4 m), het portaal bij de oosttoren, de westelijke gang en sacristie (8,9 m), de lage vleugel achter het koor en de gang naar het zuidelijke gebouw.

## Geschat en weggelaten

Hellingen, goten en nokken komen uit het AHN-DSM (0,5 m) in het eigen stelsel van de kerk; de traveeën, gevelindeling, vensters, wimbergen en spitsvormen zijn uit foto's van Commons en de RCE geschat. Vensters, portalen, klokken en roosvensters zijn blinde nissen van 0,35 m. Kruisen en windvanen zijn tot stompjes van 0,9 m verbreed; maaswerk, hogels, de kruisbloemen en de friezen onder de goten zijn weggelaten. De pastorie (BAG-pand `0268100000013468`) blijft als PDOK-pand staan.

## Controle

De generator maakt één gesloten volume met vlakke voet (genus 0). De test plaatst het model op een uitsnede van 200 × 200 m en controleert de printbaarheid zonder extra steun op 1:1000. Het model is van vier kanten vergeleken met de 3DBAG-reconstructie (LoD2.2) en met schuine foto's.

Controleer op [de kaart](http://localhost:3000/kaart/51.83078/5.84765/200/1x1/0) de aansluiting van de westtoren op de pastorie en de hoogte van de oosttoren.

## Bronnen

- [Wikipedia: Groenestraatkerk](https://nl.wikipedia.org/wiki/Groenestraatkerk) (architect, bouwjaar, torenhoogte 56 m)
- [Rijksmonumentenregister 524836](https://monumentenregister.cultureelerfgoed.nl/monumenten/524836)
- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000013467): contour, maaiveld en dakvlakken
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0) en de PDOK-luchtfoto
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Groenestraatkerk_(Nijmegen)), waaronder de RCE-opnamen van voorgevel, zijgevels en koorpartij
