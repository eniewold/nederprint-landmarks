# NS Hoofdgebouw IV (Utrecht)

## Bestanden en plaatsing

`ns-hoofdgebouw-iv.glb` in meters met Y omhoog, `ns-hoofdgebouw-iv.json` voor de catalogus en `ns-hoofdgebouw-iv-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-ns-hoofdgebouw-iv.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [136190, 455560], X-as [0.8853936257544159, 0.46484204572461957], Z=0 op NAP 2.580899953842163 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.95250790129434 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000081994.

## Bouwdelen, gemeten maten en aannames

Het NS-hoofdkantoor aan Laan van Puntenburg 100 (BAG 1990) heeft een langgerekte torenschijf met verspringende glasgevels, twee volledige lage kantoorvleugels en hellende glasvlakken rond het zuidelijke hof. BAG, AHN en 3D BAG geven de afzonderlijke continue polygonen en dakvlakken. Torendak NAP 74.129 m, centrale dakopstand 79.216 m, noordvleugel 18.419 m en zuidvleugel 18.470 m. Het centrale glasdak stijgt over zijn lengte van circa NAP 19.435 tot 23.589 m en heeft twee schuine zijvlakken; de polygonen worden rechtstreeks door hun planvergelijkingen begrensd, zonder hoogtelagen. Hoofdas 27.7 graden is uit de lange gevel gemeten. Twee geldige terreinpunten buiten alle BAG-panden geven grond NAP 2.5809 en 3.777 m, met corresponderende PDOK 45.952508 en 47.150854 m. Het laagste geldige anker bepaalt de plaatsing en 0.15 m verzinking. Het horizontale gevelritme circa 3.85 m, blind vensterreliëf 0.35–0.4 m, glasbandverdeling, robuuste penanten en gesloten entreevelden zijn uit de drie schuine Commons-opnamen geschat. De laagbouw krijgt dezelfde karakteristieke glasbanden. Naburige historische HGB-gebouwen en de Inktpot blijven bestaande afzonderlijke panden.

## Weggelaten

Losse dakhekwerken, dunne antennes, letters, fijne kozijnroeden en transparantie zijn niet afzonderlijk geprint. De plint blijft gesloten in plaats van dunne losse kolommen. Onbetrouwbare steile glasrand-reconstructies 188 en 203 uit 3D BAG zijn niet als onwaarschijnlijke daken overgenomen; de door AHN bevestigde eigenlijke dakvlakken blijven behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 13,722 driehoeken. Printcontrole per node: NoError, 2.89% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: horizontale glasbanden op de verspringende torengevel en volledige lage zuidvleugel; 55 graden: gesloten hoekglazing, twee lage vleugels en schuine centrale dakopstand; 145 graden: noordelijke kantoorbanden en behouden smalle middengeleding; 235 graden: doorlopend hellend hofdak, straatentrees en herkenbare hoge schijf.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 170 bij 170 mm, 320 objecten, 77,942 driehoeken, 79.1 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0344100000081994 (1990), AHN DSM/DTM 0.5 m en actuele orthoHR: eigen voet en straat
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000081994
- https://www.ns.nl/bedrijfsinformatie (adres Laan van Puntenburg 100)
- https://www.up-construction.nl/hoofdkantoor-ns (verbouwing, 18 verdiepingen)
- https://commons.wikimedia.org/wiki/File:NS-Groep_NV.JPG
- https://commons.wikimedia.org/wiki/File:NS-kantoor_20061019.jpg
- https://commons.wikimedia.org/wiki/File:NS_Stationsgebied_Utrecht.jpg
