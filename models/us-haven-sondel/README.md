# Us Haven (Sondel)

Vereenvoudigd model van de protestantse kerk De Haven (1870) in Sondel, voor NederPrint. De GLB is de bron voor de kaart; de STL is op schaal 1:1000 in millimeters.

- `us-haven-sondel.glb`: gebouw in meters, één gesloten node `building:kerk`.
- `us-haven-sondel.json`: catalogus, RD-oorsprong en BAG-vervanging.
- `us-haven-sondel-1-1000.stl`: gesloten printmodel.

## Plaatsing en opbouw

De oorsprong ligt op RD (169178,50; 542688,95); de +X-as loopt langs de nok naar de oostelijke ingang (0,996187; 0,087243). Het gebouw volgt de BAG-contour met de driezijdige koorsluiting in het westen. Een gebouwdeel met vlakke dakvlakken vormt het schip, een vierkant bouwdeel de dakruiter. Gevelstroken markeren de traveeën; rondboogvensters, ingangsdeur en galmgaten zijn blinde nissen.

## Gemeten, geschat en weggelaten

De contour, richting en de dakvlakken komen uit de 3D BAG LoD2.2 (maaiveld NAP +4,713 m, dakgoot circa +11 m, nok circa +15 m); AHN-DSM 0,5 m meet op de dakruiter tot NAP +21,36 m. De dakruiter en de top zijn geschat op basis van hoogtegegevens en foto's; de hoogste modelpunt is +17,0 m boven maaiveld. Nissen, deur en sierdetails zijn op foto's geschat en vereenvoudigd, en de top is tot 0,9 m verbreed voor printbaarheid. De kleine windvaan, het open houten raamwerk en fijn metselwerk zijn te dun op schaal 1:1000 en weggelaten; de galmgaten zijn blinde nissen.

## Controle

De generator maakt een gesloten onderdeel zonder losse componenten en schrijft de STL op 1:1000. De modeltest controleert de catalogus, plaatsing, geslotenheid en de 45-graden printopvulling. De kaart en volledige preview-export moeten worden nagekeken op positie en aansluiting op het maaiveld.

## Bronnen

- [3D BAG pand 0653100000148978](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0653100000148978)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Rijksmonument 15935](https://monumentenregister.cultureelerfgoed.nl/monumenten/15935)
- [Wikimedia Commons: De Haven, Sondel](https://commons.wikimedia.org/wiki/Category:De_Haven,_Sondel)
- [Protestantse gemeente: kerkgebouwen](https://pkn-ons.nl/kerkgebouwen.htm)

