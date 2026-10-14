# Ito-toren (Amsterdam)

## Bestanden en plaatsing

`ito-toren.glb` in meters met Y omhoog, `ito-toren.json` voor de catalogus en `ito-toren-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-ito-toren.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119919, 483382], X-as [0.9999957726015372, -0.002907710276956493], Z=0 op NAP -0.5813 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.5709661114952 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012112073.

## Bouwdelen, gemeten maten en aannames

Volledige eigen Ito-kantoorvleugels en lage binnenhofplint met doorlopende volumes, afzonderlijke dakmachines, verhoogde westelijke daklichtstrook, horizontale blinde glasbanden en vier diepe blinde atriumgevels. BAG/3DBAG meten contouren en gevelas; AHN meet hoofddak, westelijk daklicht, lage plint en machines. Grote glazen vides, terugliggende glasruggen, tweezijdige bovenste vide, plintkolommen en raamritme geschat uit eigen eigenaarfoto Union Investment en fotos Bart van Hoek. De aparte Viñoly/SOM-registratie 0363100012107681 en omringende torens blijven behouden. De backloghint over een licht gebogen gevel klopt niet: de primaire eigenaar- en fotografenbeelden tonen rechte, hoekige gevels en horizontale aluminium-/glasbanden. Gevelas -0,166600 graden uit de gemeten lange zuidgeveldakrand. Maaiveld RD 119971,483350 NAP -0,5813 m en PDOK ellipsoide 42,570966 m. NAP-daken: hoge schijf 96,715 m, middelste schijf 64,972 m (coherent LoD2.2 in plaats van begroeide DSM 64,632 m), lage eigen hofvleugels 26,493 m, westelijk daklicht 30,329 m, hoge machines 100,094/98,606/98,482/97,473 m, middelste machine 69,507 m. Het hoogste volume, middelste trapezoïde en hele lage hofplint zijn afzonderlijke doorlopende bouwdelen. De middenschijf volgt de echte rechte geveldelen tussen gemeten hoekpunten; vegetatiekartels op het dak zijn geen gevelvorm. Uit primaire schuine fotos geschat: glasbanden 0,35 m blind, 1,6 m hoog, 3,82 m verdiepingritme; vier blinde videvelden met 2,6 m glasrug (drie oostelijke op NAP 68,1-83,5; 30,3-49,8 en 8-19 m, plus de teruglopende bovenste zuidgevel) en twee ronde plintkolommen 1,4 m diameter. De grote velden hebben echte externe uitsparingen, geen geïsoleerde interne rekenholtes. Bron/print elk een gesloten verbonden positief volume; dakhof en eigen glasstijlen vormen open ruimten, glasruggen blijven dicht. 12.500 driehoeken, 715 blinde glasbandsneden, 0,141 procent extra printvolume.

## Weggelaten

Opschriften, interieur, transparant los hekwerk, tuinbomen en dunne antenne-/dakstaven kleiner dan 0,9 m; de eigen grotere dakmachines en plintkolommen zijn wel opgenomen.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 12,500 driehoeken. Printcontrole per node: NoError, 0.14% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Grote oostelijke glasvides met blijvende rugwand en horizontale glasbanden.; 55 graden: Teruglopende bovenste vide, middelste glazen atrium en eigen lage hofvleugels.; 145 graden: Volledige eigen binnenhof, verhoogd westelijk daklicht en verbonden dakmachines.; 235 graden: Blinde glasbanden rond de hofzijde en op de hoge schijf..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 250 bij 250 mm, 428 objecten, 257,600 driehoeken, 107.8 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012112073: volledige eigen Ito met binnenhofvleugels; naastgelegen 0363100012107681 wordt niet vervangen
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012112073 (LoD2.2 fysieke dak- en gevelvlakken, zuidgevelas -0.166600 graden)
- AHN DSM/DTM 0.5 m en actuele orthoHR: hoofddak NAP 96.715 m, laag dak 26.493 m, westelijk daklicht 30.329 m, machines 98.482/97.473/98.606/100.094 m; middelste begroeide dakterras gebruikt coherent LoD2.2-vlak 64.972 m in plaats van gemengde DSM 64.632 m
- https://www.ito-som.nl/en_GB/offices-ito (Union Investment eigenaar: eigen schuine foto, 100 m, vier glazen atria, gekoppelde lage binnenhofvleugels)
- https://www.architectuur.org/bouwwerk/281/Toyo_Ito_toren.html (eigen fotos Bart van Hoek ito01_1/ito01_2: rechthoekige glazen vides en horizontale aluminium/glasbanden)
- https://www.hunterdouglasarchitectural.com/interiordesign/index.jsp?id=8a4383491a0d1127011a3b41c29201ac (gevelleverancier: uitgesneden vides op verschillende hoogtes)
- https://www.graziosi-progetti.nl/projecten/ito/ (entree-architect: gerealiseerde transparante pleinlobby en binnentuin)
- https://www.skyscrapercenter.com/building/ito-toren/5666 (CVU: 100 m, 25 verdiepingen, Toyo Ito/ZZDP)
