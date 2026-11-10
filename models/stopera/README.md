# Stopera, Amsterdam

Het stadhuis en het muziektheater aan de Amstel vormen samen de Stopera. Het model bevat de L-vormige stadhuisvleugel, de lagere tussenbouw, de operazaal met de halfronde foyer en het hoge toneelhuis. Raampartijen zijn vereenvoudigd tot verticale gevelstijlen en ondiepe vensternissen aan de lange stadhuisvleugel; fijne raamroeden, letters, zonnepanelen en losse terrasmeubels zijn op deze schaal weggelaten.

## Maten en plaatsing

- Oorsprong: RD (121875, 486775); lokale X wijst naar RD-oost, Y naar RD-noord. Maaiveld is NAP +0,871 m.
- Het complex is circa 209,8 × 195,8 m groot. De stadhuisvleugel heeft een dakhoogte rond NAP +23,82 m, de foyer +16,07 m, de zaal +23,13 m, de halfronde toneelaanbouw +22,44 m en het toneelhuis +32,64 m.
- De BAG-voetafdruk en dakcontouren zijn gebruikt voor de plattegrond. Hoogtes zijn afgelezen uit AHN5 en gecontroleerd tegen 3D BAG. Een onregelmatig 3D-BAG-vlak bij het toneelhuis is vervangen door een afzonderlijk rechthoekig bouwdeel volgens het AHN; zes lagere dakvlakken eromheen volgen de gemeten hoogtes NAP +13,7, +16,8 en +19,7 m.
- De glazen galerijkap is als zadeldak gemodelleerd; breedte en dakhoogtes (goot NAP +10 m, nok +12 m) zijn geschat op basis van ortho en foto's, omdat glas in het AHN ontbreekt. De galerij is voor de print tot op de grond gevuld.
- Raamverdeling, hoogte en breedte van de ondiepe vensternissen en de gevelstijlen zijn vereenvoudigd naar foto's en geschat. Kleine technische installaties en details onder circa 0,9 m zijn weggelaten.
- De app vervangt `NL.IMBAG.Pand.0363100012186092`; de BAG-contour omvat het complex.

## Bestanden en bronnen

De GLB bevat één gesloten `building:stopera`-node en wordt in meters geplaatst. De STL is op schaal 1:1000. Maak de bestanden opnieuw met `node scripts/generate-stopera.mjs` vanuit de landmarkrepo; `--out <map>` schrijft een proefuitvoer elders.

- [PDOK BAG](https://service.pdok.nl/lv/bag/wfs/v2_0) en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), geraadpleegd 10 november 2026.
- [3D BAG, pand 0363100012186092](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012186092).
- [Arcam: Stopera](https://arcam.nl/architectuur-gids/stopera/) en [Wikimedia Commons: Stopera](https://commons.wikimedia.org/wiki/Category:Stopera).
