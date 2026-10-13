# Weenatoren (Rotterdam)

## Bestanden en plaatsing

`weenatoren.glb` in meters met Y omhoog, `weenatoren.json` voor de catalogus en `weenatoren-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-weenatoren.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92249, 437705], X-as [0.9539266505673936, 0.30003990624127624], Z=0 op NAP -0.23 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.11189843 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000689019.

## Bouwdelen, gemeten maten en aannames

De gevelas17,46graden volgt de rechte dakranden. De halfronde voorgevel is een doorlopend prisma met radius14,97m, met blinde vensters. Het voorste dak ligt op NAP +97,186m, twee achterste schouders op +101,689/+101,693m en de liftkern op +105,380m. De eigen lage kantoorachterbouw heeft een dak op +41,449m, techniek op +46,647/+50,824/+43,147m. De ramen(.38m diep), entrees en twee kleine dakinstallaties zijn geschat uit schuine foto’s; BAG/AHN bepaalt het silhouet. De omliggende glazen Weenahuis/Weena200-panden blijven behouden. Geen hellend dak: de gemeten daken zijn vlak.

## Weggelaten

Dunne roedes, antennestangen, reclames en kleine dakventilatoren onder0,9m. De circa2020 verwijderde Diamant is volgens BKOR niet meer aanwezig en wordt daarom niet toegevoegd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 35,386 driehoeken. Printcontrole per node: NoError, 0.17% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Ronde ponskaartgevel, entreenissen en dakinstallaties; 55 graden: Vensterraster over rechte achtergevel en eigen lage kantoorvleugel; 145 graden: Gemeten liftkern, twee schouders en drie technische achterdakvolumes; 235 graden: Halfronde voorgevel met doorlopende vensters en duidelijke plint.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 130 bij 130 mm, 165 objecten, 88,662 driehoeken, 106.9 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://movares.com/projecten/weenatoren/ (constructeur,rondeplattegrond)
- https://www.bkor.nl/beeld/diamant/ (Diamant rond2020 verwijderd)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000689019 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:Rotterdam_Weena_Tower_1.jpg (Zairon CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Weenatoren_in_Rotterdam.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Rotterdam_-_Weenatoren.jpg (Fred Romero CC BY2.0)
