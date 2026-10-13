# Hourglass (Amsterdam)

## Bestanden en plaatsing

`hourglass-amsterdam.glb` in meters met Y omhoog, `hourglass-amsterdam.json` voor de catalogus en `hourglass-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-hourglass-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119606, 483413], X-as [0.9987105118390394, 0.05076724871611646], Z=0 op NAP -0.35 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.660322 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012249957.

## Bouwdelen, gemeten maten en aannames

Drie doorgaande schuine natuursteenvolumes vormen een L met een lagere hofplint. De gemeten dakvlakken liggen op NAP 69.472, 79.665 en 69.472 m, niet drie even hoge dozen. De versmalling is uit schuine architectuur- en straatfoto's geschat, met een taille op NAP 32.8 m en circa 1-2 m onzekerheid in hoogte en inspringing. De vlakken verbinden gemeten voet- en dakcontouren met vierhoekige doorsneden; geen gestapelde AHN-hoogtelagen.

Het maaiveld is NAP -0.35 m, gevelas 2.91 graden. De voet blijft binnen de eigen BAG 0363100012249957. Glazen verbindingsnaden tussen de waisted volumes zijn massief gevuld zodat het gehele gebouw een gesloten, verbonden print is. Het aangrenzende NoMA House, BAG 0363100012247112, blijft als zijn afzonderlijke PDOK-model zichtbaar.

Het vensterraster is geschat: 3.7 m per rij en circa 2.65 m per kolom, nissen 0.45 m blind en plaatselijk wisselende breedtes tot 1.65 m. De vensters staan rechtop binnen de schuine gevelvlakken. Minstens circa 0.9 m materiaal blijft tussen de vensters. Brede publieke plintramen zijn maximaal 0.55 m blind; geen open glazen wand of vrijhangende raamroedes.

De gemeten noordwestelijke dakput heeft een gesloten bodem op NAP 64.161 m. De hoge noordoostelijke dakterrassen liggen op 79.257 en 77.948 m; servicekoppen liggen op 71.183 en 70.446 m. De volledige lage zuidwestelijke hofgebouwen liggen op 4.677 en 11.395 m, het glaslichtdak op 5.654 m en de zuidelijke plint op 9.903 m. Deze dakvlakken komen uit 3DBAG/AHN4 en zijn vereenvoudigd tot benoemde bouwdelen. Er is geen publieke plein-/straatplaat onder het model.

## Weggelaten

Losse zonnepanelen, lamellen, letters, onderhoudsgieken, glas-/metaalroedes en leidingen kleiner dan 0.9 m zijn samengevoegd of weggelaten. Atriuminterieurs blijven massief; glazen naden en plintramen zijn ondiepe blinde nissen. De exacte raamwisseling en taille zijn uit fotos geschat. NoMA House valt buiten het eigen BAG en blijft behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 22,456 driehoeken. Printcontrole per node: NoError, 0.18% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De drie ongelijke dakhoogtes, versmallende gevelvlakken en volledige lage hofplint vervangen rechte PDOK-dozen.; 55 graden: Het doorgaande natuursteenraster met rechtopstaande blinde vensters en de lagere zuidvleugel volgen schuine fotos.; 145 graden: Gemeten dakput, terrassen en techniekdelen blijven herkenbaar; de taille krijgt echte doorgaande schuine vlakken.; 235 graden: De volledige zuidwestelijke hofgebouwen, glaslichtdak en massieve verbindingsnaden houden de bouwgroep verbonden..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 174 objecten, 111,396 driehoeken, 88.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://damenpartners.com/projecten/hourglass/ (architect, schuine gevels en rechtopstaande ramen)
- https://damenpartners.com/hourglass-receives-award-of-excellence/ (architect, drie volumes inL)
- https://www.hurks.nl/projecten/hourglass/ (bouwer,2020)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012249957 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Zuidas_Kenniskwartier_25.jpg (MrAronymous CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Zuidas_Kenniskwartier_17.jpg (MrAronymous CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Zuidas_Kenniskwartier_07.jpg (MrAronymous CC BY-SA4.0)
