# Allianz Tower (Robeco-toren) (Rotterdam)

## Bestanden en plaatsing

`allianz-tower-rotterdam.glb` in meters met Y omhoog, `allianz-tower-rotterdam.json` voor de catalogus en `allianz-tower-rotterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-allianz-tower-rotterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92699, 437057], X-as [0.990170666273471, -0.13986440451934407], Z=0 op NAP 1.5 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.839939 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000617946.

## Bouwdelen, gemeten maten en aannames

De voormalige Robeco-/Allianz-toren bestaat uit drie rechthoekige kantoorvolumes: granieten hoofdmassa met dak94,676NAP, lagere middenvleugel49,132NAP en lage noordelijke glasvleugel25,422NAP. De hoofdkop is gesloten graniet met een blanco kroon, geen witte glazen top. De eigen volledige bouwcontour en lobby/arcade zijn meegenomen; aangrenzende erfgoedpanden blijven behouden. De hoofdroofmachine heeft96,835NAP, de kleinere velden96,849/96,838/96,83/96,873NAP en de westelijke servicekop96,311NAP. De noordelijke dakrand is binnen het hoge dak gehouden en tot1m dikke gesloten rand op96,758NAP vereenvoudigd.

Twee meetartefacten zijn gecontroleerd en gecorrigeerd. Het93,59m² LoD2.2-vlak boven de noordvleugel krijgt foutief96,758NAP, terwijl225AHN4cellen buiten de hoofdmassa mediaan25,36NAP en p9025,42NAP meten; de huidige luchtfoto bevestigt de lage glasvleugel. Er staat daarom geen zwevend97m-dak of hoog glazen scherm boven die vleugel. Een.67m brede zuidelijke dakspur naar het49m-bouwdeel is ook weggelaten:20AHN4cellen hebben p9049,6NAP, geen94,676NAP. De echte49m-vleugel blijft compleet.

Horizontale venstergroepen circa7,3m op4,15m verdiepingen,1,65m hoog en.35m blind houden minstens1,3m doorgaande pilasters; het lage/middenraster is4,5–5,8m met2,1–2,7m hoog glas. Dit raster, de5,2m hoge/.6m blinde lobby/arcade en twee kleine kroonventilatievelden zijn uit historische en actuele renovatiefoto's geschat, circa1m onzeker. Dakhoogtes en hoofdmaten volgen BAG/3DBAG/AHN4; meetafrondingen in aansluitingen zijn met.035m gedicht.

## Weggelaten

Geen dun vrijstaand glazen kopframe, dakspur, oude Robeco-letters, kleine antennes, glaswasinstallatiearmen of machinerasters onder.9m. Geen openbare straat/pleinplaat of eigen ondergrondse garage in de GLB. De laagbouw en erfgoedburen staan apart; alleen BAG0599100000617946 wordt vervangen.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 5,928 driehoeken. Printcontrole per node: NoError, 0.13% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: gesloten granieten hoofdvolume en horizontale venstergroepen; 55 graden: complete lage glasvleugel25,4m zonder foutieve97m-dakwand; 145 graden: middenvleugel49m en gerenoveerde blinde lobby, zonder dunne hoge zuidspur; 235 graden: gemeten dakmachines, gesloten kroon en verbonden bouwdelen.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 334 objecten, 149,706 driehoeken, 114.7 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.bimandbeyond.nl/en/projects/allianz-toren (renovatie/BIM,Colliers/Constructif,2020)
- https://www.barcol-air.nl/projecten/allianz-tower (projectleverancier,WimQuist,21verdiepingen/97m,Coolsingel120)
- https://nl.linkedin.com/posts/quist-wintermans-architekten_wimquist-rotterdam-architectuur-activity-7478024692927270913-vlJL (architectQWA,drievolumes/natuursteen,2026)
- https://www.cbre.nl/press-releases/group-of-investors-acquires-allianz-tower-in-rotterdam (beheer/transactie,2023,renovatie2018-2020)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000617946 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- https://commons.wikimedia.org/wiki/File:Rotterdam_toren_robecogebouw.jpg (Wikifrits publicdomain)
- Bim&Beyond renovatieprojectfoto, auteursrecht, alleen visuele referentie buitenrepo
