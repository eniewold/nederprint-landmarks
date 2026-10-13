# Witte Anna (De Keukenrol) (Den Haag)

## Bestanden en plaatsing

`witte-anna.glb` in meters met Y omhoog, `witte-anna.json` voor de catalogus en `witte-anna-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-witte-anna.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [82370, 455161], X-as [0.9904614256966512, -0.13779029068463808], Z=0 op NAP 1.2 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.190224 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100000354187.

## Bouwdelen, gemeten maten en aannames

De volledige Witte Anna is een woontoren, geen kantoortoren. De vernieuwde witte ronde schacht (radius11,09m,96vlakken) heeft een glazen kop vanaf geschatte68,65NAP, een hoofdplatdak73,975NAP en een gemeten zeskantige dakopbouw77,42NAP; kleine dakmachines74,791 en75,132NAP. Het eigen BAG-pand omvat ook de volledige geknikte lage woonvleugel met62woningen, dak22,67NAP, galerijdaken19,996/19,988NAP, eindtrappenhuis17,185NAP en lage entree3,829NAP. De lage vleugel sluit constructief op de toren aan; een kleine meetkier bij de aansluiting is binnen de eigen bouwcontour gedicht.

De hoge westelijke passage bij de toren/vleugelaansluiting is circa3m diep, deels doorlopend in de smalle westelijke vleugel, met een45graden bovenzijde en1m dikke sokkel, geen los open spiraaltrappenhuis. Ronde vensters zijn1,15m breed/1,55m hoog op2,85m laagsteek, .35m diep; lage woningvensters1,45m breed op2,7m steek/3m verdiepingen. Op1:1000 blijven de gesloten banden minstens.9mm. Deze gevelritmes, de ondergrens van de glazen kop en de doorgang zijn uit schuine foto's geschat, circa1–2m onzeker; dakhoogtes en de geknikte lage contour volgen3DBAG/AHN4. De actuele2025foto's tonen de afgeronde renovatie; oudere foto's dienen alleen voor de passage en dakvorm.

## Weggelaten

Losse spiraaltraptreden, relingen, antennes, hekken en open frames onder.9m zijn weggelaten of gesloten vereenvoudigd. Geen eigen straat/viaductplaat: het publieke PDOK-terrein blijft. La Fenêtre, het noordelijke wooncomplex en het driehoekige aangrenzende BAG-pand0518100000289095 blijven behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 18,972 driehoeken. Printcontrole per node: NoError, 0.30% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: ronde gesloten schacht met glasvelden en gemeten dakopbouw; 55 graden: volledige geknikte woonvleugel in plaats van alleen een cilindertoren; 145 graden: galerijdaken, lage eindkern en echte westelijke passage met schuine bovenzijde en dikke sokkel; 235 graden: achterzijde en vernieuwde kroon met dicht gevelmateriaal.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 277 objecten, 94,468 driehoeken, 78 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.dvda-denhaag.nl/portfolio/145/ (Groep5/architectuurdocumentatie)
- https://haagwonen.nl/projecten/iconische-haagse-woontoren-witte-anna-weer-als-nieuw/ (eigenaar,renovatie2024,toren166 enlagevleugel62woningen)
- https://haagwonen.nl/feest-eerste-deel-renovatie-en-verduurzaming-woontoren-witte-anna-klaar/ (vernieuwdegevels)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000354187 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- https://commons.wikimedia.org/wiki/File:Den_Haag_Witte_Anna_2025-06-16-1.jpg (Renee Kools CC BY4.0)
- https://commons.wikimedia.org/wiki/File:Den_Haag_Witte_Anna_2025-06-16-2.jpg (Renee Kools CC BY4.0)
- https://commons.wikimedia.org/wiki/File:Witte_Anna2.JPG (Steven Lek publicdomain)
- https://commons.wikimedia.org/wiki/File:De_Witte_Anna_(373123617).jpg (FaceMePLS CC BY2.0)
