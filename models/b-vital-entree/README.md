# B Vital (De Entree 201) (Amsterdam)

## Bestanden en plaatsing

`b-vital-entree.glb` in meters met Y omhoog, `b-vital-entree.json` voor de catalogus en `b-vital-entree-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-b-vital-entree.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [124565, 480536], X-as [0.9323238012155122, 0.36162457008209226], Z=0 op NAP -3.7 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 39.525523 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012067060.

## Bouwdelen, gemeten maten en aannames

Twee geknikte kantoorvleugels in een L, hoofddak70,687NAP, rand71,38NAP, eigen gehele plint2,262NAP met ronde westentree en machinekoppen71,417/73,479/73,262/73,269/73,449/73,282NAP. De zuidoostrand is een doorlopend gemeten hellend vlak z=.039997u-.035450v+71.013361NAP (residu<.001m), werkelijke .79m rand versterkt tot .95m. Geen hoogtelagen. De open buitenhoek blijft buiten de eigen voet.

Gevelritme van achttien brede glasgroepen op3.65m pitch,1.8m hoog/.35m blind,1.05m piers geschat uit actuele eigenaarsfoto; verticale glashoek circa4.5m en bovenste glasband68.65-70.1NAP circa1m onzeker. Gesloten gerenoveerde lobbypuien.45m blind tot2.6NAP. Machines tot gesloten gemeten hoofdvolumes vereenvoudigd, nieuwere warmtepompdetails circa.5-1m onzeker. Alleen eigen pand0363100012067060 wordt vervangen; Oval,Alpha,DeEntreeII en VillaArena behouden hun modellen. Een Commonsfoto van DeEntreeII is uitgesloten.

## Weggelaten

Geen los glas, dunne roedes, warmtepompleidingen, labels, interieur of ondergrondse bouwdelen. Openbare ruimte blijft buiten het GLB.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 9,382 driehoeken. Printcontrole per node: NoError, 0.18% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: L-vormige hoofdmassa met twee geknikte schijven en doorlopende glashoek; 55 graden: hellend zuidoostelijk dakvlak en afzonderlijke gemeten machineblokken; 145 graden: horizontale glasgroepen en glazen hoogste kantoorlaag; 235 graden: gehele lage eigen lobby, ronde entree en open buitenhoek.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 135 objecten, 152,606 driehoeken, 101.8 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.bvital-amsterdam.nl/ (gebouwbeheerder,18verdiepingen,actuelegevelfoto/overzicht)
- https://www.flowrealestate.nl/investment/b-vital (eigenaar,renovatie2022)
- https://www.bosmanbedrijven.nl/projecten/b-vital/ (installateur,renovatie2022,hergebruik/nieuwewarmtepompen)
- https://inbo.com/nl/projects/b-vital-amsterdam/ (architectinterieur2023,actueleL-plattegrond)
- https://www.breeam.nl/projecten/b-vital-18311 (DGBC,DeEntree201/18verdiepingen)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012067060 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- BVital/Flow,BosmanenINBO/JordiHuisman:gevel/overzicht/plattegrond uitsluitendvisuelereferentie buitenrepo
