# Galghenwert (Utrecht)

## Bestanden en plaatsing

`galghenwert.glb` in meters met Y omhoog, `galghenwert.json` voor de catalogus en `galghenwert-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-galghenwert.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [138285, 454425], X-as [0.9245809425679573, -0.3809856698619355], Z=0 op NAP 3.45 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 46.85064793 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000005765.

## Bouwdelen, gemeten maten en aannames

De hogere witte hoofdschijf ligt op NAP 85.949 m en de lagere westschouder op 80.890 m; afzonderlijke gemeten machines lopen tot 88.498 m. De hoofdas -22.394750686 graden volgt de lange rechte gevel-/dakrand, met behoud van de afwijkende contour van de schouder. De twee ronde kroonvensters zijn blinde nissen; diameter 1.64 m, hoogte NAP 82.9 m en plaats zijn geschat uit eigen Conclusion-fotos. De twee torengevels hebben eigen vensterbreedtes en een zware gesloten kern onder glasentreepui. Het complete eigen BAG-pand 0344100000005765 omvat ook DOS (dak 18.073 m), Velox (21.669 m), Elinkwijk (16.221 m) en de hogere Elinkwijk-achtervleugel (17.197 m), met glasfoyer 10.916 m en verbonden corridor 11.062 m. De grote parkeerplaat in de PDOK-reconstructie is ondergronds en is volledig weggelaten, zodat de eigen parkeerhof open blijft. De binnenste Elinkwijk-dakpatch is in PDOK foutief schuin; AHN toont 16.129-16.164 m en het model houdt hier een doorlopend vlak dak 16.221 m aan. De afzonderlijke 3D BAG-itemservice gaf HTTP 502; de echte openbare PDOK LoD2.2-dakvlakken zijn daarom als contourevidence gebruikt en ieder dak is tegen het AHN-raster gecontroleerd. Geen gestapelde rastergebieden. De gevelverdeling, glasentrees, diameter kroonvensters, corridorbreedte 2.9 m en onderkant NAP 5.1 m zijn geschat uit de openbare Ans de Wijn-verhuurbrochure en schuine eigen Conclusion- en Donker Utrecht-fotos. De corridor is in drie doorsneden op minimaal 0.8 mm materiaal op 1:1000 getest. Stadion en Apollo Residence hebben aparte BAG-panden en blijven staan.

## Weggelaten

Antenne tot circa NAP 110.2 m, letters/kleuren, ondergrondse garage en parkeerplaat, interieurs en fijn glas. Transparante ruimten zijn blinde nissen tegen gesloten kernen; onder de lange corridor maakt de export eigen 45-graden opvulling.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 17,566 driehoeken. Printcontrole per node: NoError, 1.35% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Hogere witte schijf met vensterassen, glasentreepui en afzonderlijke machines.; 55 graden: Lagere westschouder met brede glasvelden, liftnaad en twee ronde kroonvensters op de kop.; 145 graden: Alle eigen lage kantoorvleugels op hun afzonderlijk gemeten daken, met afgesloten Elinkwijk-dak.; 235 graden: Verbonden lange glasbrug met sterke printkern en open parkeerhof zonder ondergrondse plaat..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 280 bij 280 mm, 381 objecten, 233,550 driehoeken, 89 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0344100000005765: complete kantoren inclusief ondergrondse garage; stadion 0344100000056854 wordt behouden
- PDOK openbare LoD2.2-gebouwtegels: afzonderlijke vlakke daken en gevelrand voor hoofdas -22.394751 graden; 3D BAG-itemservice gaf HTTP 502
- AHN DSM/DTM 0.5 m en actuele orthoHR: dakhoogtes van ieder bovengronds bouwdeel, ondergrondse plaat en antenne uitgesloten
- https://www.conclusion.nl/en/contact-us/ (eigen gebruikerfotos: verschillende torenfronten en ronde kroonvensters)
- https://donkerutrecht.nl/foto/kantorencomplex-galgenwaard/ (eigen schuine foto Donker Utrecht: liftnaad en lage kantoren)
- https://ventu.nl/media/objects/88/16/7F/C3/88167FC3-77EB-4360-8234-DF1D8C2A1458/docs/VI-Utrecht-Herculesplein-2-116.pdf (Ans de Wijn-verhuurbrochure: naam/samenhang eigen kantoren; fotos pp.11-13, gevels, entrees en glasbruggen)
- https://www.skyscrapercenter.com/building/kantoortoren-galghenwert/6962 (CVU: Cees Dam, 22 verdiepingen, 85.6 m inclusief architectonische top)
