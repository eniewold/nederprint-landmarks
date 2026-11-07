# Sint Egbertkapel (Schiermonnikoog)

Kleine kruiskerk aan de Badweg, volgens het Rijksmonumentenregister in 1915 gebouwd. De generator `scripts/generate-sint-egbertkapel-schiermonnikoog.mjs` maakt het GLB, de catalogus-JSON en de losse STL op 1:1000. Het model is één gesloten bouwvolume in meters, verdeeld in benoemde bouwdelen.

## Plaatsing en bouwdelen

De oorsprong is RD (205978, 611415) op maaiveld, X-as [0,733114, 0,680106] loopt naar de ingang in het noordoosten. De BAG-contour en 3D BAG LoD2.2 bepalen de maatvoering van de twee kruisende zadeldaken (nok respectievelijk +9,12 en +7,88 m boven het maaiveld), de kruisarmen en het voorportaal. Het AHN-maaiveld ligt rond NAP +4,36 m; het AHN meet de dakruiter tot NAP +16,01 m. Het model vervangt BAG-pand 0088100000137791.

De kerk omvat het kruisvormige schip, de vijfzijdige koorsluiting met schildvlakken, de sacristie naast het koor, het voorportaal met zadeldak en toegangsnis, de dakruiter, schoorsteen en vensternissen. De gesloten dakruiter is een printbare vereenvoudiging van de open houten klokkenstoel.

## Geschat en weggelaten

De begrenzing van de apsis en de bijgebouwen, dakruiter en schoorsteen zijn uit 3D BAG en foto's benaderd; de raam- en deuropeningen, hun diepte en de exacte schilden van de apsis zijn geschat. De kleine ramen en galmgaten zijn iets vereenvoudigd. De losse windhaan, houten kruis, hekwerk, glas-in-lood en klein metselreliëf zijn weggelaten als te dun op 1:1000. Het open portaal is een blinde toegangsnis zodat de dakrand zonder steun printbaar blijft.

## Controle en bronnen

De generator geeft één gesloten manifold met een afmeting van circa 21,26 × 11,65 × 12,08 m. De gerichte catalogus- en printtest controleert de gesloten vorm en de 45°-overhangondersteuning. Vergelijk de kaart en de volledige preview op locatie; de dakruiter en aansluiting op het heuvelige maaiveld verdienen daarbij aandacht.

- [3D BAG, pand 0088100000137791](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0088100000137791)
- [PDOK AHN DSM en DTM, 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Rijksmonumentenregister 512350](https://monumentenregister.cultureelerfgoed.nl/monumenten/512350)
- [Wikimedia Commons: Sint Egbert](https://commons.wikimedia.org/wiki/Category:Sint_Egbert_(Schiermonnikoog))
- [Monumenten.nl: beschrijving van exterieur en bouwdelen](https://www.monumenten.nl/monument/512350)

De preview-export op 150 × 150 m en 1:1000 slaagde met het landmark volledig binnen de uitsnede. De reguliere export selecteerde vier terreintegels maar geen gebouwtegels: de noordgrens van de PDOK-roottegel ligt ten zuiden van de kapel, terwijl de onderliggende tegel de gebouwen wel bevat. Daardoor ontbreken in deze preview ook de omringende gebouwen. De daadwerkelijke PDOK-kindtegel is afzonderlijk uitgelezen en het PDOK-pand is vanuit vier gelijke hoeken naast het landmarkmodel en foto's vergeleken.

