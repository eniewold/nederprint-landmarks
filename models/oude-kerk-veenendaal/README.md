# Oude Kerk Veenendaal

De Oude Kerk heeft een lang schip, drie dwarskappen met schildvormige uiteinden, veelhoekig koor, twee zijportalen en een vierkante klokkenruiter. De STL meet 40,5 × 29,2 × 20,9 mm op schaal 1:1000 inclusief 0,5 mm onder maaiveld. De generator bouwt een samenhangend, gesloten genus-0-volume uit dakvlakken en controleert ondervlakken. De webshoptest controleert plaatsing, steunvolume en meerdere doorsneden.

## Bronnen en plaatsing

- [Rijksmonumentenregister 36887](https://monumentenregister.cultureelerfgoed.nl/monumenten/36887) en [Dit is Veenendaal](https://www.ditisveenendaal.nl/ontdekken/monumenten/oude-kerk-op-de-markt): de kerk werd in 1566 in gebruik genomen en is daarna uitgebreid.
- [3DBAG pand 0345100002004401](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0345100002004401): contour, dakvlakken en maaiveld NAP +11,63 m. Kerk en ruiter delen één BAG-pand; 3DBAG mist de ruiter grotendeels.
- AHN DSM 0,5 m: hoogste ruiterpixel NAP +32,06 m, circa 20,42 m boven maaiveld.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Oude_Kerk_(Veenendaal)): foto's van westgevel, noord- en zuidgevel en koor. Een historische foto toont een vroegere slanke ruiter; de huidige kleine lantaarn is gemodelleerd.
- PDOK 3D Basisvoorziening: vergelijking van reconstructie en vervanging van het ene BAG-pand. Omliggende daken zijn lokaal met AHN vergeleken: geen stelselmatig te hoge kolom vastgesteld; losse randpunten kunnen verschillen door interpolatie.

Oorsprong RD (166408, 448636), X-as (0,99253, -0,122), maaiveld NAP +11,63 m. [Controleer op de kaart](http://localhost:3000/kaart/52.02595/5.55343/200/1x1/0).

## Geschat en vereenvoudigd

Breedte en hoogte van de lantaarn, gevelopeningen, portalen en afgeschuinde koorsluiting zijn naar foto's en hoogtegegevens geschat. De open lantaarn is voor 1:1000 massief met blinde nissen; kruisen, windvaan en fijn maaswerk ontbreken. De samengestelde daken zijn vereenvoudigd. Controleer de drie dwarskappen, de lantaarn en het koor op de kaart.

Generator: `node scripts/generate-oude-kerk-veenendaal.mjs --components`.
