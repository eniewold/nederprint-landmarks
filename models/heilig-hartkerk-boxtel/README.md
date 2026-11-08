# Heilig Hartkerk (Boxtel)

De voormalige Heilig Hart van Jezuskerk is een neogotische kruisbasiliek uit 1899–1901. Het model bevat schip, zijbeuken, dwarsschip, koor, twee slanke voorste hoektorentjes, dakruiter, steunberen en blinde vensternissen. De via een lage gang verbonden pastorie is opgenomen omdat zij samen met de kerk in BAG-pand 0757100001429688 ligt; dat pand wordt vervangen.

## Ligging en bestanden

Oorsprong RD (150135, 400084), X-as [0,87, 0,493] langs het schip. Het GLB en JSON dienen voor de kaart, de STL's voor 1:100 en 1:1000. Genereer met `node scripts/generate-heilig-hartkerk-boxtel.mjs --scale 1000` en `--scale 100`.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0757100001429688): contour en kapvlakken van kerk en pastorie; maaiveld circa +8,1 m NAP.
- [AHN dataroom](https://www.ahn.nl/dataroom): dakruiter AHN4 +48,07 m en AHN5 +47,63 m NAP, met samenhangende metingen zonder groot topgat; modeltop +47,6 m NAP.
- [Open Monumentendag](https://www.openmonumentendag.nl/monument/heilig-hartkerk-voormalig/), [rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/516624) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:516624_Heilig_Hart_van_Jezuskerk.jpg): geschiedenis en foto's. [Beleef Boxtel](https://www.beleefboxtel.nl/locaties/1804027036/heilig-hartkerk) vermeldt de herbestemming tot woningen.

De pastorie, verbindingsgang, torentjes, steunberen en vensternissen zijn vereenvoudigd naar foto's geschat. De dunne topornamenten, glasroeden en dakkapellen ontbreken; de spitsjes zijn bovenaan minimaal 0,9 m breed voor printbaarheid.

## Controle

Bekijk de kerk en de pastorie op [de kaart](http://localhost:3000/kaart/51.58979/5.31755/200/1x1/0). Twee uitsneden van 150 m met het gehele model zijn met en zonder landmark geëxporteerd. De gerichte test controleert plaatsing, gesloten verbinding en printvorm na overhangopvulling.
