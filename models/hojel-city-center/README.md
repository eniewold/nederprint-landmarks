# Hojel City Center (Utrecht)

## Bestanden en plaatsing

`hojel-city-center.glb` in meters met Y omhoog, `hojel-city-center.json` voor de catalogus en `hojel-city-center-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-hojel-city-center.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135520, 455610], X-as [0.8685921925388065, 0.49552760070517654], Z=0 op NAP 2.624 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 46.020245263508855 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000006173, NL.IMBAG.Pand.0344100000010157, NL.IMBAG.Pand.0344100000013695, NL.IMBAG.Pand.0344100000014361, NL.IMBAG.Pand.0344100000025114, NL.IMBAG.Pand.0344100000041778, NL.IMBAG.Pand.0344100000043312, NL.IMBAG.Pand.0344100000043313, NL.IMBAG.Pand.0344100000051481, NL.IMBAG.Pand.0344100000069238, NL.IMBAG.Pand.0344100000137660, NL.IMBAG.Pand.0344100000137661, NL.IMBAG.Pand.0344100000137662, NL.IMBAG.Pand.0344100000137663.

## Bouwdelen, gemeten maten en aannames

Volledige fysiek verbonden Hojel I-kantoorstrook met hoge torenschijf, lagere achterkern, grote blinde tweezijdige glasnissen, aparte dakchamber, drie haakse hoge kantoorspines, lagere glazen vleugels, eigen paviljoens en facettenkristalverbinding. BAG/3DBAG meten contouren en gevelas; AHN meet ieder fysiek dak. Vensterritme, grote glasnissen, glasstijl en kristalfacetten zijn uit eigen aannemerfotos en de publieke Commons-foto geschat. Het afzonderlijke Hojel II/Utrecht Central Plaza, de bestaande terreinparkeerplaatsen en toekomstige herontwikkeling blijven behouden. Het gehele complex bestaat uit veertien verbonden BAG-registraties; de circa 280 m lange strook is meegenomen om losse PDOK-bouwdelen te voorkomen. Elk fysiek bouwdeel loopt door vanaf de fundering tot zijn gemeten dak. Dakhoogtes NAP: hoofdtoren 69,374 m, achterkern 60,929 m, dakchamber 75,367 m, dwarsspines 38,064 tot 38,081 m, lage glazen vleugels 26,264 tot 26,294 m, paviljoens 5,345 tot 6,073 m. De smalle einddakband gebruikt LoD2.2 70,840 m wegens gemengde DSM-cellen. Maaiveld NAP 2,624 m en vaste PDOK-ellipsoide 46,020245 m op RD 135646,455641. Gevelas 29,704547 graden uit een gemeten lange torenrand. Uit eigen bronfotos geschat: vensterritme, blinde grote glasnis op hoofd- en zijgevel tussen NAP 43,7 en 57,2 m, aansluitende glasstijl en facettenkristal (gemeten maximum NAP 14,478 m). De circa 280 m lange strook blijft een gesloten verbonden materiaalvolume; de blinde nis heeft een vaste achterwand, geen open glasplaat. 42.526 driehoeken en 2.581 blinde gevelsneden. Eigen parkeerterrein en apart Hojel II blijven buiten het model.

## Weggelaten

Interieurs, opschriften, dunne kozijnstaven, toekomstige herontwikkeling, het afzonderlijke Hojel II/Utrecht Central Plaza en losse terreinparkeergebouwen.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 42,526 driehoeken. Printcontrole per node: NoError, 1.88% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Gesloten hoofdtoren met blinde grote glasnissen, achterkern en dakchamber.; 55 graden: Drie doorlopende haakse kantoorvolumes en hun lage verbindingsvleugels.; 145 graden: Volledige verbonden kantoorstrook en de eigen paviljoens.; 235 graden: Afgeronde gemeten eindgevel, glazen vleugels en facettenkristalverbinding..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 400 bij 400 mm, 1179 objecten, 415,976 driehoeken, 109.3 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG: alle veertien verbonden registraties van Hojel I; zelfstandig Hojel II/Utrecht Central Plaza 0344100000016139 blijft behouden
- 3DBAG openbare itemservice, LoD2.2: afzonderlijke gevel- en dakvlakken van de veertien eigen BAG-objecten
- AHN DSM/DTM 0.5 m en actuele orthoHR: afzonderlijke fysieke dakhoogtes en maaiveld; de open smalle einddakrand gebruikt coherent LoD2.2 70.840 m in plaats van gemengd DSM
- https://berghegeheerkens.nl/projecten/hoofdkantoor-sns-utrecht/ (aannemer: eigen schuine luchtfoto, kristalgevel, verbinding en renovatie van A/B)
- https://architectenweb.nl/projecten/project.aspx?id=769 (Broekbakema publicatie: Hojel I en II als twee afzonderlijke bouwfasen)
- https://commons.wikimedia.org/wiki/File:Hoogbouw_Hojel_City_Center_Utrecht.jpg (eigen bronfoto: grote glasnis in hoofd- en zijgevel, kozijnritme en entree; in eigen browser bekeken)
- https://www.skyscrapercenter.com/utrecht/hojel-city-center/5948/ (CVU: Van den Broek en Bakema, 72 m, 20 verdiepingen)
