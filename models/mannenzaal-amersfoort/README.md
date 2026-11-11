# Mannenzaal Amersfoort

Het bewaarde Sint Pieters- en Bloklandsgasthuis bestaat uit een kapel aan de Westsingel en de haaks daarop aangesloten Mannenzaal. Beide bouwdelen zijn met dakvlakken en gesloten volumes opgebouwd. De dakruiter is vereenvoudigd tot een gesloten schacht met ondiepe nissen en een spits; ramen en deuren zijn blinde nissen.

## Maten en print

- BAG-pand 0307100000311511; oorsprong RD (154910, 463287), X-as (0,445; 0,895); maaiveld circa NAP +2,28 m. Oppervlak circa 370,5 m² en het dak is ruim hoger dan 6 m: het pand valt niet af.
- Nokhoogte circa 13,7 m boven maaiveld uit 3DBAG; de AHN-metingen missen de smalle top van de dakruiter. De top is op circa 18,4 m geschat uit foto's, net als de afmetingen en posities van vensters en steunberen.
- GLB in meters en STL 1:1000 circa 19,0 × 32,3 × 18,9 mm. De voet ligt 0,5 m onder maaiveld; één gesloten volume zonder verboden ondervlakken.

## Bronnen

- [Rijksmonument 8066](https://monumentenregister.cultureelerfgoed.nl/monumenten/8066)
- [3DBAG, BAG en AHN](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0307100000311511)
- [Foto's van het gasthuis](https://commons.wikimedia.org/wiki/Category:Sint_Pieters-_en_Bloklandsgasthuis)
- [Mannenzaal en kapel: geschiedenis](https://pietersenbloklands.nl/mannenzaal/)

## Controle en onzekerheid

Model en PDOK zijn vanuit vier richtingen vergeleken met beschikbare schuine foto's. De kleine dakruiter ontbreekt in PDOK en is naar foto's toegevoegd. Maaswerk, windvaan en fijne dakdetails zijn op printschaal weggelaten; de gevels en nissen zijn vereenvoudigd. De foto's van de achterzijde zijn beperkt door bebouwing.

Drie naburige PDOK-panden zijn lokaal tegen het AHN-DSM vergeleken. Hun mediane dakafwijking bedraagt −0,05 tot −0,12 m, maar grote complexen 0307100000374052 en 0307100000332867 hebben plaatselijk uitschieters; bij 374052 ligt een gebied nabij RD 154884 / 463276 circa 4 m boven DSM. De oorzaak is niet vastgesteld en de panden zijn niet vervangen; controleer de omgeving op de kaart.

`node scripts/generate-mannenzaal-amersfoort.mjs --components` maakt GLB, metadata en STL. De gerichte webshoptest controleert de plaatsing, geslotenheid en ondersteuningsberekening.
