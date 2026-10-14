# Cité (Rotterdam)

## Bestanden en plaatsing

`cite-rotterdam.glb` in meters met Y omhoog, `cite-rotterdam.json` voor de catalogus en `cite-rotterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-cite-rotterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [93670, 435720], X-as [0.8171037246092491, -0.5764906792218696], Z=0 op NAP 3.9 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 47.54438725 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000766718.

## Bouwdelen, gemeten maten en aannames

De volledige eigen BAG-contour omvat beide woontorens, het gedeelde atrium, de lage glazen voorvleugel, beide hogere schouders en de hogere middenkern. Maaiveld NAP 3,90 m volgt het DTM aan de noord- en westzijde; de verhoogde weg aan de zuidzijde is geen nulhoogte voor het model. De gemeten hoofddaken liggen op NAP 77,082 en 88,898 m, schouders 44,684/44,718 m, middenkern 53,435 m, atrium 21,369 m en lage voorvleugel 9,253 m; afzonderlijke machinecontouren volgen 3D BAG tot NAP 91,284 m. De X-as volgt de gemeten gevel met -35,2041 graden. Bijna samenvallende gevelvlakken zijn op 0,25 m afgerond (0,25 mm op 1:1000) om exportflinters te voorkomen. Beide torens bestaan uit een doorlopende smalle kern en een uitkragende kop; de aanvang van die kop op NAP 44,70 m is uit schuine fotos geschat. De circa vijf meter uitstekende kop krijgt een doorlopende 45-graden ondersnijding voor printbaarheid. De wisselende raamformaten met enkele dubbele velden en Franse-balkonreliëfs zijn fotoschattingen en blinde uitsparingen; twee gekleurde verticale stroken zijn diepere gesloten sleuven. Het ritme is een herkenbare vereenvoudiging, geen reconstructie van elk individueel raam. Gedeelde gevels en hoekranden worden bewaakt; de permanente topologiecontrole voorkomt ingesloten kamers, doorgaande gaten en losse stukken. Het hoofdvolume bestaat uit echte aansluitende bouwdelen, niet uit gestapelde hoogtekaartlagen.

## Weggelaten

Gevelkleuren, dunne balkonhekken, letters, fijn betonreliëf en atriuminterieurs zijn weggelaten. De interne zwevende workshopruimten en trappen zijn niet nagebouwd. Kleine dakfacetten en atriuminstallaties zijn vereenvoudigd. Alle andere BAG-panden, waaronder het aangrenzende schoolgebouw en kantoren, blijven aanwezig als PDOK. De achterzijde op de kaart wordt deels door behouden buurgebouwen afgedekt; de losse vierzijderender is volledig beoordeeld.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 29,116 driehoeken. Printcontrole per node: NoError, 0.70% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: maatvaste complete zijcontour met hogere schouder, torenkop, machinerelief en blinde venstervelden; 55 graden: beide torens, hogere middenkern, gehele gedeelde onderbouw en afwisselend raamritme; 145 graden: gemeten torendaken en hogere aansluitende vleugel; doorlopend 45-graden verloop onder de torenkop; 235 graden: uitkragingen, verticale reliëfsleuven, atrium en lage voorvleugel met dichte vensterhoeken.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 240 bij 240 mm, 349 objecten, 190,438 driehoeken, 89.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG pand 0599100000766718, complete eigen contour EPSG:28992
- 3D BAG LoD 2.2: beide torendaken, hogere vleugels en dakmachines
- PDOK AHN DSM/DTM 0.5 m en orthoHR
- PDOK 3D Basisvoorziening maaiveld 47.5444/47.7334 m ellipsoïdisch
- https://www.rotterdamarchitectuurprijs.nl/2012/cite.html (Tangram; John Lewis Marshall, nachtbeeld en atriumfoto)
- https://www.stadswonenrotterdam.nl/nl/over-ons/begeleid-wonen-in-cite (schuine dagfoto uitkraging)
- https://www.hibex.nl/cite-kop-van-zuid-rotterdam/ (gevelbouwer, twee woontorens)
