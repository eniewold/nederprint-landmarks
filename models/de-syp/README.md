# De Syp (Utrecht)

## Bestanden en plaatsing

`de-syp.glb` in meters met Y omhoog, `de-syp.json` voor de catalogus en `de-syp-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-de-syp.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135825, 455885], X-as [0.8698515473097966, 0.49331357739550685], Z=0 op NAP 2.3 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.84547508 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000146741, NL.IMBAG.Pand.0344100000079418.

## Bouwdelen, gemeten maten en aannames

Continue toren op de gemeten gevelas 29.558607 graden; hoofddak NAP 91.285 m, lager hoekgebouw 26.403 m, afzonderlijke terrasschermen 93.401-93.565 m en machines tot 95.901 m. Het lagere hoekgebouw loopt niet door tot de torenkroon. Afwisselende brede vensternissen en diepere blinde loggias zijn gesloten tegen de kern; verticale betonribben lopen door. De behouden klassieke entree heeft drie lagen, vier vensterassen en vijf pilasters met een schuine, verbonden kroonlijst. De eigen entree-BAG 0344100000079418 is in PDOK foutief tot circa 94 m gereconstrueerd en wordt eveneens vervangen; de naastgelegen De Steyn en Central Park blijven staan. De BAG meet de positie en licht afwijkende richting van de entree; circa 12 m hoogte, kroonlijst, pilasterbreedtes, vensters en onderkant van de torenprojectie op NAP 14.65 m zijn geschat uit de openbare OZ-geveltekening, schuine architectfotos en Oud-Utrecht. Gevelritme, loggiadiepte en fijne dakrandbreedtes zijn vereenvoudigde schattingen. Geen gestapelde hoogtegebieden. Kaartcontrole identificeerde de resterende vlakke hoge zijwand als buur-BAG 0344100000150819 (2022), buiten deze footprint: PDOK geeft dit grotendeels 27.11 m hoge buurgebouw een foutieve piek 93.563 m. Het blijft als buurpand staan en is geen restobject van De Syp.

## Weggelaten

Fijn glas, balustrades, kozijnen, beplanting en interieur; Forum-trappen en verhoogd omliggend terrein blijven PDOK. Balkonruimten zijn blinde nissen voor stevigheid op 1:1000.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 25,642 driehoeken. Printcontrole per node: NoError, 1.04% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Doorlopend gevelraster, gemeten verticale ribben en afzonderlijke dakterrasdelen.; 55 graden: Afwisselende diepe loggias en breedtenissen rond een gesloten kern.; 145 graden: Drie-laagse monumentale entree met vier vensterassen, vijf pilasters en verbonden kroonlijst.; 235 graden: Eigen lagere hoekbouw en correcte uitschakeling van de dubbele torenhoge entree-reconstructie..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 370 objecten, 115,490 driehoeken, 99.5 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0344100000146741; AHN DSM/DTM 0.5 m, actuele orthoHR en 3D BAG LoD2.2 voor contouren, gevelas en afzonderlijke dakvlakken
- PDOK Locatieserver Van Sijpesteijnkade 25: RD 135817.297/455900.314; PDOK maaiveld 45.8455/45.9228 m ellipsoidisch
- https://ozarchitect.nl/syp-and-steyn/ (OZ: gevelpatroon, conservatories, balkons, monumentale entree; fotos Valentijn Kortekaas en openbaar gevelaanzicht TEK02)
- https://amvest.nl/nieuws/woontoren-de-syp-in-utrecht-bereikt-hoogste-punt/ (eigenaar: 29 verdiepingen, toren vanaf de vijfde etage om het monument)
- https://www.monumenten.nl/monument/514459 (RCE-beschrijving: drie lagen, vier vensterassen, vijf Dorische pilasters en platte kroonlijst)
- https://oud-utrecht.nl/images/pdf-bestanden/Bijlagen/2009-02-CceOudUtrechtVisieVanSijpesteijnkade.pdf (historische entree circa 12 m hoog)
- https://www.hanab.nl/installation-technology/installation-technology/nl/projecten/woontoren-westflank (installateur: monument in entree, oplevering 15 maart 2019)
