# Intermezzo (Amsterdam)

## Bestanden en plaatsing

`intermezzo-zuidas.glb` in meters met Y omhoog, `intermezzo-zuidas.json` voor de catalogus en `intermezzo-zuidas-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-intermezzo-zuidas.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119883, 483277], X-as [0.9999976312561755, -0.002176575759790689], Z=0 op NAP -0.5882 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.42551558182622 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012244546, NL.IMBAG.Pand.0363100012244545.

## Bouwdelen, gemeten maten en aannames

Intermezzo op de via PDOK adressen bevestigde locatie, circa 190 m oostelijk van de oude backlogpin. Volledige afgeronde straatgevel, oostelijke terrasvleugel, lage westvleugel en opgetilde binnenhofplint. BAG/3DBAG meten as en fysieke terrascontouren; AHN meet daken en maaiveld. Afgeronde gevelhoeken, blinde brede woonramen, balkonloggias met blijvende vloerbanden en bovenste dakrand geschat uit gemeentelijke eigen schuine fotos van Jan Vonk. De gedeelde kelder wordt verborgen; het afzonderlijke Ella 0363100012242878 en omliggende Mahler/Summertime blijven behouden. De oude backlogpin is circa 190 m te ver westelijk en viel bij Summertime; de eigen PDOK-adressen bevestigen de gecorrigeerde locatie. Gevelas -0,124709 graden uit de lange gemeten hoofddakrand. Maaiveld RD 119853,483298 NAP -0,5882 m, ellipsoide 42,425516 m. NAP-daken: straatkop 80,823 m, dakrand 81,428 m, eigen dakmachine 82,619 m, lage westvleugel 24,484 m, hofpodium 4,859 m. De oostelijke terrasvleugel is een doorlopend volume met een enkel zijprofiel dat de echte terrasvlakken volgt (17,826; 20,962; 23,812; 27,524; 31,023; 38,595; 47,473; 58,960; 67,270; 70,574; 73,933; 77,481; 80,823 m NAP). Coherente horizontale AHN-daken gebruikt, gemengde glas-/boomcellen op kleine terrasstukjes uitgesloten. Foto-schattingen: hoekradius 3,1 m, woonraamritme 3,305 m, 0,35 m blind raamreliëf, grote balkonloggias 1,75 tot 3,25 m diep met 1,155 m doorlopende vloerbanden en brede blijvende rugwand; laagbouwloggias 2,42 m diep. Alle bouwdelen lopen vanaf hun voet door; geen gestapelde hoogteplakken. 15.858 brontriangles en 843 blinde gevelsneden. Gedeelde kelder-ID verborgen zonder het aparte Ella-pand te vervangen.

## Weggelaten

Opschriften, interieur, transparante tuin-/balkonhekjes, dakrailwerk en zonnepaneelstaven kleiner dan 0,9 m; dakapparatuur vereenvoudigd tot de eigen gemeten opbouw, terrasranddetails en planten vereenvoudigd voor de print.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 15,858 driehoeken. Printcontrole per node: NoError, 3.68% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Eigen dakterrassen, volledige oostgevel en blinde woonramen.; 55 graden: Afgeronde straatkop en doorlopende hoekglasvelden met vaste vloerbanden.; 145 graden: Lage westvleugel en eigen balkonvelden aan de hofzijde.; 235 graden: Binnenhofpodium en brede blinde balkonloggias naast de echte dakterrassen..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 324 objecten, 147,554 driehoeken, 108.1 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012244546: volledige bovengrondse Intermezzo; 0363100012244545 is de gedeelde kelderregistratie, afzonderlijk Ella 0363100012242878 behouden
- PDOK Locatieserver: Leonard Bernsteinstraat 62A en Gustav Mahlerlaan 547B bevestigen circa 190 m correctie ten opzichte van backlogpin
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012244546 (LoD2.2 afzonderlijke terras-/vleugeldaken en lange dakrandas -0.124709 graden)
- AHN DSM/DTM 0.5 m en actuele orthoHR: hoofddak 80.823 m, eigen plant 82.619 m, westvleugel 24.484 m en binnenhofplint 4.859 m NAP; maaiveld RD 119853,483298 NAP -.5882 m, PDOK ellipsoide 42.425516 m
- https://zuidas.nl/construction-project/intermezzo/ (gemeente, eigen fotos Jan Vonk: afgeronde straatgevel, grote zuid/westbalkons, Inbo en oplevering 2017)
- https://www.nibostone.nl/zakelijk/projecten/intermezzo-zuidas (uitvoerend natuursteenspecialist: plint van 8 m, Inbo/ERA Contour, materialen en oplevering 2017)
