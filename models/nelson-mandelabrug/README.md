# Nelson Mandelabrug (Arnhem)

Vereenvoudigd model van de betonnen rivierbrug en het volledige noordelijke viaduct, inclusief de westelijke lus. De geometrie bestaat uit dekvlakken, twee kokerlofts en afzonderlijke pijlers; er zijn geen gestapelde AHN-hoogtelagen.

## Bestanden en regenereren

- `nelson-mandelabrug.glb`: meters, glTF met Y omhoog; 16 verkeersoppervlakken en één constructienode.
- `nelson-mandelabrug.json`: RD-plaatsing, waterbemonstering, vervangen BGT-dekdelen en bronnen.
- `nelson-mandelabrug-1-1000.stl`: millimeters, Z omhoog, met geïntegreerde printvoet; 451,8 × 300,3 × 18,2 mm. Geen losse slicersteun nodig. Voor een stadskaart gebruikt de webshop de GLB en zijn eigen overhangopvulling.

```sh
node scripts/generate-nelson-mandelabrug.mjs
node scripts/generate-nelson-mandelabrug.mjs --out /absolute/lege/controlemap --scale 1000
```

De generator bevat alle broncontouren en maten en gebruikt geen netwerk. `--out` is de modelmap zelf, niet de catalogusroot.

## Oorsprong, richting en hoogte

Oorsprong RD `[190231.098, 443540.899]`, nabij het hart van de rivieroverspanning. +X loopt naar het noordoosten, `xAxis = [0.5790130018829376, 0.8153183081781675]`; +Y ligt links daarvan, naar het noordwesten. Z = 0 is de Rijnwaterspiegel, gemodelleerd op NAP +8,25 m. De eigen PDOK-uitsnede gaf waterhoogtes rond 51,8555 m ellipsoïdisch; de catalogus bemonstert het water naast de brug. Pijlers lopen tot deze vlakke voet en zijn op de oevers in het bestaande terrein verankerd.

## Onderdelen

De twee actuele BGT-dekvlakken geven de gehele buitencontour, inclusief de lusopening en beide noordelijke uitlopers. Het rivierdek heeft een doorlopende plaat van 1,35 m en twee afzonderlijke kokerliggers met schuine flanken. De kokerdiepte varieert continu van 2,4 m in het veld tot 6,2 m boven de pijlers op lokale x ≈ −39 en +97 m. Het noordelijke viaduct is een doorgaande plaat op de actuele BGT-pijlers, met de volledige lus. De zuidelijke rivierpijler is als twee blokken gemodelleerd binnen de BGT-voetafdruk. Kolommen smaller dan 0,9 m worden in hun eigen richting verbreed tot minstens 0,9 m.

Vijftien BGT-wegdelen krijgen ieder een `road:`-node met `bgt_functie`, `bgt_fysiekvoorkomen` en `plus_fysiekvoorkomen`: regionale rijbaan, OV-baan, fietspad en voetpad, met asfalt waar de bron dat aangeeft. Overige dekranden zijn een afzonderlijke verhardingsnode. De bovenste 0,5 m komt uit dezelfde dekgeometrie; de wegdelen worden eerst in het plattegrondvlak van elkaar gescheiden. De constructie bevat geen coplanair bovenste wegvlak. De som van alle nodevolumes wijkt minder dan 10⁻⁶ m³ af van het gehele model.

Deze dekdelen vervangen hun platte PDOK-reconstructie:

- `G0202.2af034b7ca6712c4e05343604191f184`
- `G0202.2af034b8d4ac12c4e05343604191f184`

De STL bevat doorlopende wanden van minstens 1 mm met schouders van 43° onder beide kokers, het rechte viaduct en de lus. De schouders volgen het dekprofiel en delen hun dwarsdoorsnede bij bochten. Ze worden op de echte dekcontour begrensd en zijn in de GLB afwezig. De lage lus heeft noodzakelijk een bredere printvoet. Numerieke nulvolumevlakken worden verwijderd. De generator weigert losse printonderdelen en overhangslivers breder dan 0,05 mm; de resterende zes snijslivers zijn maximaal 0,039 mm breed.

## Gemeten, geschat en weggelaten

De dekcontouren, ligging, verkeersfuncties en pijlerplaatsen komen uit de actuele BGT. Het AHN-DSM levert het doorlopende hoogteprofiel: het rechte dek stijgt van circa NAP +25,1 m naar +26,45 m en daalt naar +19,96 m. De lus daalt van circa +22,6 m via +21,6 en +20,2 m naar +17,84 m. Het analytische lusvlak wijkt op de gebruikte controlepunten circa 0,01–0,21 m af van de AHN-medianen; rond de terugtak is dat circa 0,18 m. Geen auto's of leuningen zijn als dekhoogte gebruikt.

De plaatdikte, kokerbreedten, kokeronderranden, verloop van de verdiepingen, opleggingen en landhoofdhoogte zijn uit schuine foto's geschat. De gesloten kokerdoorsneden tonen de buitenvorm; interne cellen zijn weggelaten. Dunne leuningen, lichtmasten, de belettering en dilatatievoegen zijn weggelaten voor schaal 1:1000. De losse voetgangerstrap buiten het noordelijke BGT-dek en de omliggende wegen, kaden en taluds horen bij de bestaande omgeving en zijn niet opgenomen.

## Controle

Alle GLB-nodes en de STL zijn gesloten Manifold-solids met status `NoError`; de STL is één verbonden deel met vlakke onderkant. De brug, kokers, lus en verkeersvlakken zijn uit vier schuine richtingen bekeken en vergeleken met de PDOK-reconstructie zonder landmark en met onderstaande schuine foto's. De kaart toont het verhoogde dek boven de vlakke PDOK-terreindelen. De gerichte test controleert RD-plaatsing, gehele lus, vervangen dek-id's en verticale ray-hits op fiets-, OV- en rijbanen, zonder coplanair constructievlak.

`npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`: 342 tests geslaagd. Een volledige uitsnede RD `[189990,443355]`–`[190590,443955]` is met `createModelBundle` op 1:1000 geëxporteerd, als matrix van 2 × 2 tegels van 300 mm, en als preview bekeken. `supportedSolid` levert een gesloten model; horizontale doorsneden en de doorlopende printvoet zijn gecontroleerd. Controlebestanden en foto's staan buiten de modelrepo.

[Kaartcontrole](http://localhost:3000/kaart/51.980176/5.900871/900/1x1/0): controleer vooral de geschatte kokeronderranden boven de rivierpijlers, de lushoogte en de verkeerskleuren.

## Bronnen

- [Wikipedia: Nelson Mandelabrug](https://nl.wikipedia.org/wiki/Nelson_Mandelabrug_(Arnhem)).
- [Cement: Constructieve renovatie Nelson Mandelabrug](https://www.cementonline.nl/artikelen/constructieve-renovatie-nelson-mandelabrug): constructieve beschrijving van de twee kokers en het noordelijke viaduct.
- [PDOK BGT OGC API](https://api.pdok.nl/lv/bgt/ogc/v1/collections): actuele `overbruggingsdeel` en `wegdeel`, opgevraagd 10 oktober 2026, EPSG:28992.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor de dekprofielen.
- [PDOK luchtfoto WMS](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): `Actueel_orthoHR`, plattegrondcontrole.
- [Nelson Mandelabrug.jpg](https://commons.wikimedia.org/wiki/File:Nelson_Mandelabrug.jpg), Apdency, CC0: rivierzijde en kokervorm.
- [Onder Nelson Mandelabrug.jpg](https://commons.wikimedia.org/wiki/File:Onder_Nelson_Mandelabrug.jpg), Marion Golsteijn, CC BY-SA 4.0: noordelijke rivierpijlers en kokeronderzijde.
- [Nelson Mandelabrug Arnhem.JPG](https://commons.wikimedia.org/wiki/File:Nelson_Mandelabrug_Arnhem.JPG), Kounitsyn, CC BY 3.0: tegenoverliggende rivierzijde.
- [Arnhem Blick von der Grote Kerk Sint Eusebius 02.jpg](https://commons.wikimedia.org/wiki/File:Arnhem_Blick_von_der_Grote_Kerk_Sint_Eusebius_02.jpg), Zairon, CC BY-SA 4.0: schuine overzichtsfoto van brug en lus.
