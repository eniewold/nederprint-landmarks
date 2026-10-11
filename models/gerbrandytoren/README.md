# Gerbrandytoren — IJsselstein

Cilindrische betontoren met zes omgangen, drie glazen ringruimten, vensternissen en schotels. Daarboven de gesloten 2 m buismast met reportagecabine, bordessen, samengevoegde antennevelden en digitale top. Drie aaneengesloten lage dienstruimten westelijk van de toren volgen de BAG-contour, met drie dakopbouwen. Alle bouwdelen zijn prisma's, cilinders en afgeknotte kegels; geen AHN-hoogtelagen.

## Bronnen

- [RCE monument 532229](https://monumentenregister.cultureelerfgoed.nl/monumenten/532229): televisietoren en drie tuiblokken.
- [Saval, installateur](https://www.saval.nl/cases/gerbrandytoren/): circa 100 m betontoren, 2 m mastdiameter en beperkte werkruimte in de mast.
- [Omroep Zender Museum](https://www.omroepzendermuseum.nl/nieuws-archief/17-uhf-tv-antenne-gerbrandy-toren-vervangen): de in 2007 vervangen top; de huidige totale hoogte bedraagt volgens deze primaire bron 366 m. Andere bronnen noemen 372 m; het model volgt het concrete verslag van de topvervanging.
- [Constructiebeschrijving](https://nl.wikipedia.org/wiki/Gerbrandytoren): grootste diameter 17,6 m, bovenvloer 96 m, reportagecabine op 218 m en masttop 356 m.
- PDOK BAG-panden 0353100000007975 en 0353100000008108, AHN DSM/DTM 0,5 m en Actueel_orthoHR, 11 oktober 2026. Lage daken NAP circa +6,42 m bij maaiveld circa +1,6 m. AHN-top circa +247 m: smalle bovenbouw wordt onvolledig geraakt en is uit de constructiebeschrijving en foto's opgebouwd.
- [Commons: Gerbrandytoren](https://commons.wikimedia.org/wiki/Category:Gerbrandytoren), met de schuine RCE-opname en de detailfoto's `Gerbrandytoren, centraal deel.jpg` en `Gerbrandytoren, mast.jpg`. Foto's blijven buiten de repository.

## Plaatsing en schattingen

Oorsprong RD [132092,7; 446906,0], x-as oost. PDOK-terugval 44,975235 m ellipsoïdisch, offset −0,1 m; modelvoet −0,25 m. Vier terreinpunten op 12 m van de toren voorkomen bemonstering op de bouwmassa. Alleen de twee genoemde BAG-panden worden vervangen.

De omgangen op +60, +66, +72, +78, +84 en +90 m en de glazen ruimten zijn uit foto's met het AHN vergeleken, maar hun exacte afzonderlijke hoogtes blijven geschat. De cabinevorm, antennevelden, raamritme, schotels en dakopbouwen zijn vereenvoudigd. Vensternissen zijn 0,35 m diep. Antennestaven en leuningen zijn samengevoegd tot elementen van minstens 0,9 m. Tuikabels van circa 0,075 m, losse dunne schotelbeugels, ladders, gaas en kabels zijn weggelaten wegens de schaal. De drie veraf gelegen tuiblokken behoren tot de terreininstallatie en vallen buiten dit torenmodel.

## Print- en beeldcontrole

`node scripts/generate-gerbrandytoren.mjs` levert drie verbonden, positieve nodes met `NoError`; toren en mast vormen samen één volume, de dienstruimten een tweede. STL op 1:1000: 62,6 × 21,8 × 366,3 mm. Deze schaal vraagt dus een printer met circa 369 mm vrije bouwhoogte voor de terreinexport. De 2 mm mast blijft een zeer slank onderdeel; de geometrie is steunvrij gecontroleerd, de mechanische sterkte is niet met een fysieke proefdruk bevestigd.

Gemeenschappelijke 45° opvulling voegt 1,73% volume toe, vooral rond kleine antenne-uitkragingen; de secties op +60,2, +89 en +218 m blijven behouden. De volledige 150 × 150 m terreinexport met expliciete 45° overhangoptie is als 150 mm preview en 3MF bekeken. De omgangen en cabine blijven herkenbaar; standaard verticale opvulling zou ze dichttrekken.

Vier schuine zijden op 30° zijn naast PDOK en bronfoto's beoordeeld: −35° en 55° tonen de omgangen en westelijke dienstruimten; 145° de glazen ringen en volledige antennetop; 235° de andere torenwand en mastbordessen. Elke kant voegt de ontbrekende volledige mast en karakteristieke ringen toe aan de onvolledige, hoekige PDOK-reconstructie. De kaartcontrole toont de toren op het eigen terrein met de dienstruimten westelijk ervan.

[Controlekaart](http://localhost:3000/kaart/52.01007/5.05358/1100/1x1/0?size=150): controleer de geschatte ringhoogtes en antennevelden en beoordeel of de slanke mast op 1:1000 voor de beoogde printer bruikbaar is.
