# Sint-Caeciliakerk (Berkel-Enschot)

Neogotische driebeukige kruisbasiliek uit 1898–1899, ontworpen door Caspar Franssen. Het model bestaat uit schip, zijbeuken, dwarsschip, koor, westtoren met achthoekige lantaarn en zeszijdige spits, vier pinakels, dakruiter, steunberen en vensternissen. De pastorie en verbinding zijn opgenomen omdat zij in hetzelfde te vervangen BAG-pand 0855100000647781 liggen.

## Ligging en bestanden

De oorsprong ligt op RD (137555, 398848), de X-as [0,292, -0,956] wijst vanaf de toren naar het koor. Het GLB en JSON zijn voor de kaart; STL's zijn voor 1:100 en 1:1000. Genereer met `node scripts/generate-sint-caeciliakerk-berkel-enschot.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000647781): contour en de dakvlakken van kerk en pastorie; maaiveld circa +12,24 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN4 meet de top tot +59,44 m NAP; AHN5 geeft samenhangende metingen tot +59,97 m NAP met twee kleine nabije NoData-cellen.
- [Open Monumentendag](https://www.openmonumentendag.nl/wp-content/uploads/2019/01/20-403-RUI-Uitingen-OMD-def-low-5aug_Corr.pdf) noemt onafhankelijk een torenhoogte van 47 m; modeltop is +59,24 m NAP. Deze bron geeft tevens de zeszijdige spits en vier pinakels.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/526156) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Caeciliakerk_(Enschot)): details, historie en schuine aanzichten.

Pastorieaansluiting, dakruiter, pinakels, steunberen en vensternissen zijn vereenvoudigd naar foto's geschat. Kleine dakkapellen, kruis en maaswerk zijn weggelaten; de spits is op de top minimaal 0,9 m breed voor printbaarheid.

## Controle

Controleer plaatsing van de kerk en pastorie op [de kaart](http://localhost:3000/kaart/51.57823/5.13544/200/1x1/0). Uitsneden van 150 m met het hele model zijn met en zonder landmark geëxporteerd. De gerichte test controleert de plaatsing, gesloten verbinding en printvorm na overhangopvulling.
