# Bolero (Den Haag)

## Bestanden en plaatsing

`bolero-den-haag.glb` in meters met Y omhoog, `bolero-den-haag.json` voor de catalogus en `bolero-den-haag-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-bolero-den-haag.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [81795, 454860], X-as [0.7557391838264477, 0.654872725061393], Z=0 op NAP 0.6 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.11613 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100001756999, NL.IMBAG.Pand.0518100001754313.

## Bouwdelen, gemeten maten en aannames

De volledige Bolero-woontorenBAG0518100001756999, langsas40,91graden,36,11bij22,55m, gemeten plateau86,205NAP, terraskoppen82,932/82,913NAP, dikke dakrand87,1NAP en machinehoofden89,948/89,378NAP; AHN5 bevestigt laatste89,88NAPp90 en89,92p99. Twee visuele schijven door een6m brede centrale verdiepteloggiastrook, gesloten zijloggia’s. Loggiadieptes.95-1.2m, raamritme3.8m/3.04m,2.3x2.05m/.4mblind, kroonribben.95m tot87,4NAP en penthouseband82,95-85,3NAP uit fotos geschat ±1-2m.

De volledige eigen hoge plint10,65NAP, arcade/lobbypuien.6m blind tot9,8NAP uit aannemer- en architectbeelden geschat; kolomruimte gesloten voor1:1000. Geen uitkragende balkonlagen, geen openbare pleinplaat.

PDOK schrijft twee Bolero-schijven op87-89NAP toe aan buurpand Amare0518100001754313. Volgens handleiding PDOK-panden-tegen-het-model vervangen en het hele echte buurgebouw behouden als eenvoudig model: gemeten3DBAGdakvlakken28-43NAP, maximale echte buurkroon42,725NAP, en gehele eigenvoet zonder afzonderlijke Bolerotoren. Fijne Amare-gevelboomstructuur/atriumglas niet gedetailleerd; deze eenvoudige buurcorrectie is geen apart Amare-landmark. De overige garage0518100001774714 met spookschijf wordt al door het bestaande Stadhuis vervangen. Adagio, Turfmarktgarage en losse entreebouw0518100001781280 blijven behouden.

Er zijn twee afzonderlijke gebouw-nodes. Naast de gewone1:1000STL levert de generator bolero-den-haag-grondplaat-1-1000.stl met1mm verbindende grondplaat: één gesloten printdeel. Deze plaat staat niet in GLB/kaart.

## Weggelaten

Geen open/dunne loggiabalustrades, glasroedes, interieur of zelfstandige arcadepilaren. Amare als noodzakelijke eenvoudige buurmassa met gemeten daken; geen fijne Amare-gevelboomstructuur. Geen openbare ruimte/ondergrondse garage inGLB.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 12,578 driehoeken. Printcontrole per node: NoError, 0.67% extra volume; NoError, 0.00% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: centrale loggiastrook en gesloten zijloggias van twee visuele schijven; 55 graden: gemeten lagere terraskoppen, penthouseband, stevige kroonribben en machines; 145 graden: hele dubbelhoge eigen plint en stadsbalkonzijde; 235 graden: Amare behouden op echte28-43m dakvlakken zonder89mspookschijven, extra verbonden printSTL.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 340 bij 340 mm, 1324 objecten, 490,716 driehoeken, 134.5 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.klunderarchitecten.nl/klunder_portfolio/sonate-den-haag/ (architect2022,188woningen,Bolero/Cantate apart)
- https://www.boele.nl/nl/nieuws/oplevering-woontoren-bolero (aannemer,19sept2022,actuelegevels enplint)
- https://www.westo.nl/nl/projecten/sonate-bolero (prefabgevelproducent,10mplint/inpandigeloggiavorm)
- https://stedenbouw.nl/woningbouw-en-utiliteitsbouw/bolero-als-haagse-blikvanger/ (interviewarchitect:loggias,tweeschijven,penthousebalkon,10mplint)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001756999 (TU Delft/3DGI CC BY4.0,AHN5)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001754313 (Amare,CCBY4.0,echte28-43NAP dakdelen zonderspookkolommen)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://www.ahn.nl/ahn5 (AHN5DSM2023 CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- Boele&VanEesteren:fotosoplevering2022©,alleenvisuelereferentie buitenrepo; geenbeeldtextures inmodel
