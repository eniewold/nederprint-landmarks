# Coolse Poort (Rotterdam)

## Bestanden en plaatsing

`coolse-poort.glb` in meters met Y omhoog, `coolse-poort.json` voor de catalogus en `coolse-poort-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-coolse-poort.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92549, 437025], X-as [0.963630453208623, 0.26723837607825685], Z=0 op NAP 0.45 m. De X-as is een referentie-as nabij de gemeten hoofdgevels; de bouwdeelcontouren behouden hun eigen hoeken. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.02135966 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000700138.

## Bouwdelen, gemeten maten en aannames

De complete eigen BAG-voetafdruk omvat drie doorlopende glasvolumes en hun hogere staalplaatkernen, lage winkelstroken, terugliggende glazen onderbouw, servicewand en kapiteelkolommen. DTM aan Coolsingel ligt NAP 0,466 m; het Binnenwegplein ligt circa 0,5 m lager. Modelnul is NAP 0,45 m. Gemeten westelijk glasdak NAP 58,149 m en kern 62,379 m; noordelijk glasdak 67,297 m en kern 73,693 m; zuidelijk glasdak 61,213 m en kern 65,438 m; losse gemeten dakmachines tot 78,408 m. Beide lage winkelstroken liggen op NAP 11,817/11,830 m. De BAG-plaat is volledig meegenomen; de lage entree-bouwdelen volgen eigen dakvlakken tot 5,403/6,368/8,026 m. De X-as is een referentie-as van 15,5 graden, nabij de gemeten hoofdgevels; alle contouren volgen de echte bouwdelen, met afronding binnen 0,125 m naar een 0,25 m raster (maximaal 0,125 mm afwijking op 1:1000). Gevelritme, blind glasrelief, terugliggende entree op 2,15 m, de acht verbrede betonnen vuisten, smalle servicewand op NAP 47,8 m en dakrandrelief zijn schattingen op basis van de openbare Groosman-gevelaanzichten en recente schuine fotos. De vuisten zijn vereenvoudigd tot verbonden 45-graden kapitelen op 1,4 mm kolommen bij 1:1000. De acht echte doorgangen onder de entree blijven open; alle vensters hebben een gesloten achterwand en veroorzaken geen extra gaten. De renovatie heeft de hoofdvolumes behouden en de vroegere borstwering vervangen door meer glas: er is geen gesloopte toren of nieuw Hart 010-volume gemodelleerd. Dit zijn continue gebouwvolumes en afzonderlijke kern- en dakdelen, geen gestapelde hoogtekaartlagen.

## Weggelaten

Letters, kleuren, fijne staalplaatribben, smalle kozijntransoms, dunne hekwerken, vlaggen/antennes en interieurs zijn weggelaten. Het losstaande ronde paviljoen BAG 0599100000700253 ligt ten minste circa tien meter buiten de eigen torenvoetafdruk en blijft PDOK, evenals de overige buurgebouwen; het is geen onverborgen rest in dit model. Op de kaart zijn de lage plinten gedeeltelijk door voorliggende buurgebouwen afgedekt, daarom zijn ook de volledige losse renders en de preview-export beoordeeld.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 23,906 driehoeken. Printcontrole per node: NoError, 1.98% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: alle drie herkenbare glasvolumes, gemeten kernen, nieuwe blinde glazen gevelvelden en verbonden betonnen kapiteelmotieven; 55 graden: volledige lange glasvleugel en lage winkelplint met vensters en maatvaste hoofdvorm; 145 graden: gemeten verschillende glas- en kerndaken, dakmachinegroepen, open entree en dichte vensterhoeken; 235 graden: huidige gevelgrid, hogere kernspines, lage plint en herkenbare uitspringende kapitelen.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 325 objecten, 135,782 driehoeken, 80.9 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG pand 0599100000700138, volledige contour EPSG:28992
- 3D BAG LoD 2.2: drie glasvolumes, kernen en machines; PDOK AHN DSM/DTM 0.5 m
- PDOK actuele orthoHR: behouden Coolse Poort en huidige plint
- PDOK 3D Basisvoorziening maaiveld 43.6177/44.0214 m ellipsoidisch
- https://architectenweb.nl/projecten/project.aspx?id=50256 (GROOSMAN eigen projectbeschrijving, foto’s Aiste Rakauskaite en vier gevelaanzichten; oplevering 2025)
