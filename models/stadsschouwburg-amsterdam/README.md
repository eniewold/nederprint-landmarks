# Stadsschouwburg Amsterdam

Vereenvoudigd landmark van de Stadsschouwburg aan het Leidseplein, ontworpen door Jan Springer en A.L. van Gendt en geopend in 1894. Het model omvat de historische voorbouw, zaal, zijvleugels en toneeltoren. De Rabozaal wordt al door het bestaande landmark **Melkweg** geleverd: diens voetcontouren zijn met 0,15 m marge uit dit model gesneden, zodat de volumes elkaar niet doorsnijden. Samen vervangen de modellen de historische schouwburg en het Rabozaal-pand.

## Bestanden en plaatsing

- `stadsschouwburg-amsterdam.glb`: één gesloten node `building:schouwburg`, meters, glTF Y omhoog.
- `stadsschouwburg-amsterdam.json`: RD-oorsprong (120600, 486350), lokale +X langs de voorgevel richting noordoost en +Y naar de achterzijde, 37° ten opzichte van de RD-X-as. Vervangt `NL.IMBAG.Pand.0363100012168738`.
- `stadsschouwburg-amsterdam-1-1000.stl`: model in millimeters op 1:1000, Z omhoog.
- Generator: `scripts/generate-stadsschouwburg-amsterdam.mjs`; uitvoeren met `node scripts/generate-stadsschouwburg-amsterdam.mjs` in de landmarkrepo. `--out <map>` kiest een andere uitvoermap.

## Bronnen en maten

De plattegrond komt uit de BAG en de richting uit dakranden in de actuele PDOK-luchtfoto. De AHN5- en 3D-BAG-gegevens geven maaiveld circa NAP +1,27 m; het zaalgebouw heeft goten rond NAP +27,5 m en nok rond +33,6 m. Het toneelhuis en de belendende zaal reiken tot circa NAP +37 m. De westelijke toneeldakhelft volgt een gemeten 3D-BAG-dakpolygoon; het achterste vlak ligt volgens AHN op circa NAP +35,4 m. Bij de Rabozaal begrenzen de contouren van Melkweg deze aanvulling om dubbele volumes te voorkomen. De bovenste torendaken en kleine lantaarns zijn vereenvoudigd naar foto en 3D-BAG; maten en ritme van de entree-nissen, zijvensters, pilasters en dakkapellen zijn geschat. De lantaarns zijn gesloten en vergroot tot minimaal 0,9 m voor printbaarheid. De fijne beeldhouwwerken, balustrades en letters zijn weggelaten omdat ze op 1:1000 te klein zijn; de open bogen van de lantaarns zijn gesloten. De Rabozaal-uitsparing volgt de contouren in `generate-melkweg.mjs`; wijzig die contouren alleen samen met de aansluiting van dit model.

- [3D BAG: historisch pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012168738)
- [3D BAG: Rabozaal](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012173457)
- PDOK BAG, AHN-DSM 0,5 m en actuele orthofoto, EPSG:28992.
- [Wikimedia Commons: Stadsschouwburg Amsterdam](https://commons.wikimedia.org/wiki/Category:Stadsschouwburg_Amsterdam)
- [Arcam: Rabozaal Melkweg](https://arcam.nl/architectuur-gids/rabozaal-melkweg/)

De generator controleert de manifoldstatus. De webshoptest controleert de plaatsing, aangesloten delen, overhang en de afwezigheid van volume-overlap met het bestaande Melkweg-model.
