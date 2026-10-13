# Tasmantoren (Groningen)

## Bestanden en plaatsing

`tasmantoren.glb` in meters met Y omhoog, `tasmantoren.json` voor de catalogus en `tasmantoren-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-tasmantoren.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [235921, 582706], X-as [0.7975839288252285, -0.6032079877452825], Z=0 op NAP 0.6 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 41.37303118 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0014100010982651.

## Bouwdelen, gemeten maten en aannames

De lange gevelas is -37,1 graden; de westtoren staat in het plan circa 15 graden scheef ten opzichte van de oosttoren. Beide torendaken liggen op NAP +72,796 m, de lage woonvleugel op +16,471 m en de entree op +7,771 m. Drie technische dakvolumes volgen +74,316, +74,339 en +76,205 m uit 3D BAG/AHN. De brugonderzijde (+58,2 m), lage entree, raamnissen, dakframe en zonnepaneelvelden zijn uit schuine foto’s en de ortho geschat. De eigen vaste printkragen verkleinen de bovenste poortzone; de centrale opening blijft tot minstens 45 m vrij. Het landschapsdek blijft terrein. De backlogbeschrijving van één toren aan de Oosterhaven is gecorrigeerd naar het complex aan de Regattaweg.

## Weggelaten

Dunne glasroedes, balkonhekken, kabels, rode/witte entreekleuren en kleine dakapparatuur. Het witte frame is tot 1 m verdikt. De nog te bouwen Hunzetoren valt buiten dit model.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 25,432 driehoeken. Printcontrole per node: NoError, 1.17% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Glazen serrevelden en volledige lage woonvleugel met zonnepaneelprofielen; 55 graden: Vrije poort, penthousebrug en open dakframe in plaats van dichte PDOK-middenwand; 145 graden: Gevelnissen, afzonderlijke technische dakvolumes en gedraaide westtoren; 235 graden: Entreepui, verschil tussen de twee torenplannen en blijvend open poort.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 190 bij 190 mm, 118 objecten, 113,956 driehoeken, 79 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://architectenweb.nl/projecten/project.aspx?id=15950 (Solarlux: twee gedraaide torens en triomfboog)
- https://nieuwinstad.nl/projects/tasmantoren/
- https://www.tasmantoren.nl/contact/
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010982651 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:20110521_Tasmantoren_Groningen_NL.jpg (Wutsje CC BY-SA3.0)
- https://commons.wikimedia.org/wiki/File:Groningen_Tasmantoren_5.jpg (Zairon CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Tasmantoren_-_vooraanzicht.jpg (Hardscarf CC BY-SA4.0)
