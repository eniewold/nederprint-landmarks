# Sint-Willibrordkerk Olst (Boskamp)

Vereenvoudigd model van de neogotische Willibrorduskerk in Boskamp met aangesloten tussenbouw en pastorie, die samen onder hetzelfde BAG-pand vallen. De kerk heeft een schip met zadeldak, dwarsschip, vijfzijdige koorsluiting, lage aanbouwen en een westtoren met zeskantige klokkenkamer en spits. Steunberen, enkele fialen en blinde spitsboogvensters zijn opgenomen.

## Bronnen en schattingen

- [Rijksmonumentenregister 508567](https://monumentenregister.cultureelerfgoed.nl/monumenten/508567): bouwvorm, zeskantige torenopbouw, ingang en aanbouwen.
- [3D BAG pand 1773100000005941](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1773100000005941): BAG-contour en dakvlakken van kerk en pastorie. De 3D BAG noemt 1830 als oorspronkelijk bouwjaar; Commons vermeldt voor de huidige kerk bouw in 1858–1860.
- PDOK AHN DSM 0,5 m: maaiveld NAP circa +4,05 m, kerknok NAP circa +20,2 m en torenpunten tot NAP circa +39,0 m.
- [Commons-foto's Willibrorduskerk Boskamp](https://commons.wikimedia.org/wiki/Category:Willibrorduskerk_(Boskamp)): dwarsschip, steunberen, dakruiter, spits, koor en zijaanbouwen.

De spits is boven de AHN-punten doorgetrokken en verbreed tot 1 m bovenaan; de precieze hoogte en de doorsneden van de toren, de vensters, fialen, portaal, lage aanbouwen en de aansluitende pastorie zijn vereenvoudigd en geschat uit foto's en BAG. Kleine maaswerken en de windvaan zijn dunner dan 0,9 m en weggelaten; de vlakke wijzerplaten zijn niet als reliëf weergegeven.

De dichtstbijzijnde aparte BAG-buur 1773100000013628 ligt circa 1,5 m van de kerkcontour en de PDOK-dakhoogte is niet boven de AHN-waarden; dit pand blijft behouden.

## Model en print

Het GLB is één gesloten node `building:kerk`, in meters met Y omhoog. De JSON heeft oorsprong RD (205640, 482890), +X langs de nok naar het oosten en vervangt `NL.IMBAG.Pand.1773100000005941`. De STL is op 1:1000 en meet circa 54,7 × 33,6 × 35,5 mm. De generator controleert de geometrie en ondervlakken.

```sh
node scripts/generate-sint-willibrordkerk-olst.mjs
```
