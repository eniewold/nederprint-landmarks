# Alpha Tower (Amsterdam)

## Bestanden en plaatsing

`alpha-tower-amsterdam.glb` in meters met Y omhoog, `alpha-tower-amsterdam.json` voor de catalogus en `alpha-tower-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-alpha-tower-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [124480, 480513], X-as [0.9947743374368467, 0.10209807822423742], Z=0 op NAP -3.5 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 39.843656 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012079391.

## Bouwdelen, gemeten maten en aannames

Rechte SOM/ZZDP-natuursteenschijf, geen gebogen glazen toren. BAG-adres De Entree11-97 corrigeert de oorspronkelijke backlogpositie; de Oval Tower en Villa Arena zijn aparte panden. Hoofdgevel16,5 bij59,9m, met de noordelijke kopverlenging en volledige eigen BAG-plint op6,376NAP. Hoofddak86,435NAP, lift89,971NAP en vijf afzonderlijke ventilatie-/machineblokken88,946/88,752/88,272/88,951/88,112NAP zijn uit3DBAG gehaald en met AHN4/ortho gecontroleerd. De eigen sokkel heeft grondniveau-3,5NAP; de straat/pleinzijden verschillen circa.7m.

Steengevel met vensterpitch3.55m en kolomraster3.3m, blind2.1m hoog/.35m diep, steenpiers≥1.05m: aantallen uit fotos geschat
Glaserkers horizontaal op48.1/56/67.4/73NAP en verticale eindspines72.3/74.3 tot87.4NAP uit schuine fotos geschat ±2-3m,1m projectie met45graden ondersnijding
Hoge oostentreeglasnis tot17.2NAP en plintglasbanden.45m blind uit beheerderfoto geschat
Rechte hoofdcontour16.5x59.9m en noordkop31.08m volgen gemeten gevelassen; kleine LoD2.2gevelruis geregulariseerd, eigen volledigeBAGplint behouden
Dakhoogten uit3DBAG gecontroleerdmetAHN4; kleine installaties met schuine randen vereenvoudigd tot gesloten rechthoekige bouwdelen, geen vrijstaande roedes onder.9m

## Weggelaten

Geen dunne glasroedes, losse zonwering, glazenwasrail, letters of onzichtbaar interieur. Geen openbare pleinplaat, ondergrondse P5-garage of losstaande pleinkiosk in de GLB. De lage oostelijke straattoegang buiten de eigen BAG is geen torenvleugel en blijft behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 16,084 driehoeken. Printcontrole per node: NoError, 0.16% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: rechte natuursteenschijf en ritmisch blind vensterraster; 55 graden: noordelijke glasband en hoge eindspine met gesloten printprofiel; 145 graden: complete plint en gemeten daklift/machineblokken; 235 graden: zuidelijke horizontale glasuitbouw en noordelijke eindspine.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 132 objecten, 83,692 driehoeken, 103.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.alphatower.nl/ (gebouwbeheerder,23verdiepingen,SOM/ZZDP,DeEntree11-97)
- https://www.breeam.nl/projecten/alpha-tower-amsterdam-10189 (DGBC,BREEAM,22verdiepingen)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012079391 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- https://commons.wikimedia.org/wiki/File:Alpha_Tower_Amsterdam_Zuidoost.jpg (Choinowski CC BY-SA4.0)
- https://www.alphatower.nl/fotos/7_foto1_slider_groot.jpg (beheerderfoto,alleenvisuele referentie buitenrepo)
