# Sint-Christoffelkathedraal (Roermond)

Vereenvoudigd model van de kathedraal met vijfbeukig schip, driezijdig gesloten dwarsschip, driebeukig hallenkoor en westtoren met hoekpinakels en tweeledige lantaarn. Het model bestaat uit vlakke dakvlakken en verbonden bouwdelen.

- `sint-christoffelkathedraal-roermond.glb`: één gesloten node `building:kathedraal` in meters.
- `sint-christoffelkathedraal-roermond.json`: ligging en vervanging van BAG-pand 0957100000261721.
- `sint-christoffelkathedraal-roermond-1-1000.stl`: print in millimeters, Z omhoog, 69,8 × 55,2 × 75,3 mm.
- Genereer met `node scripts/generate-sint-christoffelkathedraal-roermond.mjs --components`.

De oorsprong is RD (196738,5, 356518,3) bij de westtoren; de X-as [0,9986, -0,0523] volgt de nok naar het oosten. De onderzijde ligt 0,5 m onder maaiveld. 3D BAG geeft maaiveld NAP +25,81 m en de daknokken circa NAP +54 m; AHN DSM meet het hoogste torenpunt tot NAP +100,76 m. De toren is inclusief een vereenvoudigd topje circa 74,8 m hoog boven maaiveld.

De precieze vorm en afmetingen van de lantaarn en hoekpinakels, vensternissen, traptoren, dakramen en lage oostelijke aanbouw zijn geschat naar foto's en dakvlakken. Openingen in de toren zijn als blinde nissen uitgevoerd; fijn maaswerk, relingen, kruis en afzonderlijke beeldhouwwerken zijn voor de printschaal weggelaten. De oostelijke aanbouw en zijn aansluiting zijn vereenvoudigd om het gedeelde BAG-pand te vervangen.

De generator controleert geslotenheid, Float32-rondgang en overhang. Het volume is één component met genus 0; de 45°-ondersteuning geeft geen relevante volumetoename en de doorsneden blijven gelijk. Een 150 × 150 m uitsnede is met en zonder landmark geëxporteerd; vier aanzichten zijn vergeleken met de PDOK-reconstructie en schuine foto's.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0957100000261721), [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [bouwgeschiedenis bisdom](https://bisdom-roermond.org/KathedraalHistorie), [toren bisdom](https://bisdom-roermond.org/beklimmingtoren), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Christoffelkathedraal_(Roermond)).
