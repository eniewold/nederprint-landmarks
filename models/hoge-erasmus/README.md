# Hoge Erasmus (Rotterdam)

## Bestanden en plaatsing

`hoge-erasmus.glb` in meters met Y omhoog, `hoge-erasmus.json` voor de catalogus en `hoge-erasmus-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-hoge-erasmus.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92685, 436104], X-as [0.8923639323642293, 0.4513165321760873], Z=0 op NAP 2.965 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 46.56198360355458 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000691772, NL.IMBAG.Pand.0599100000690103.

## Bouwdelen, gemeten maten en aannames

Hoge Erasmus staat aan het Willemsplein; de Westblaak/Churchillplein-omschrijving in de backlog was verkeerd. Beide eigen BAG-panden omvatten woontoren, kantoorplint, volledige zeslaagse garage en westelijke lage kantoren. Elk bouwdeel is een doorlopend volume met eigen gemeten dak; terrassen zijn uitsparingen in het torenvolume. Gevelas 26,828183 graden uit de lange LoD2.2-plintrand. AHN: hoofddak NAP 92,263 m, dakmachines 96,496/96,515 m, podium 17,686/21,083 m, garage 28,815 m, lage kantoren 17,933/15,797 m en terras 83,134 m. Glazen open borstweringen hebben gemengde DSM-cellen; daar zijn coherente LoD2.2-vlakken gebruikt: balkonrand 89,471 m, tweede terras 83,370 m. Maaiveld RD 92733,436114 NAP 2,965 m, PDOK ellipsoide 46,561984 m. De vloeiende gevel tussen gemeten randpunten, 3,02 m vensterritme, 1,25 m blinde loggias, 0,45 m linker glasstrook, minimaal 1,12 m vloerbanden, stijlen, drie V-kolommen (1,2 bij 1,4 m; 4,6 m spreiding) en frontonderkant NAP 8,4 m zijn uit schuine eigen fotos Steven Lek en Zairon geschat. 64 galerijsneden aanvaard, twee die een smalle hoek zouden openen weggelaten; alle 619 overige blinde velden aanvaard. Bron en print elk een gesloten verbonden positief materiaalvolume; print heeft ook negatieve rekenholtes kleiner dan 0,2 mm. Alle bronfotos rechtstreeks in de eigen browser bekeken en met paginacontext opgeslagen; losse downloads werden door de bronserver geweigerd. Vier kaartstanden bekeken; bij 145 graden staat Zalmhaven deels voor de toren, vier vrije renders en GLTFLoader bevestigen alle zijden.

## Weggelaten

Letters, hekwerk en zeer dunne decoratieve dakstaven, interieur, omliggende Zalmhaven en Hoge Heren; kleine dakdetails vereenvoudigd bij de gemeten dakmachines.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 20,240 driehoeken. Printcontrole per node: NoError, 1.76% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Golvende glasvelden en open V-kolommenplint.; 55 graden: Blinde loggias, vaste verticale stijlen en bovenste terrassen.; 145 graden: Gesloten achterkern en complete eigen garage.; 235 graden: Lage kantoorvleugels en parkeerlagen met blind ventilatierelief..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 240 bij 240 mm, 365 objecten, 202,286 driehoeken, 216.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0599100000691772 en 0599100000690103: eigen toren/plint en volledige garage/westelijke laagbouw
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000691772 (LoD2.2 golvende dakcontouren en afzonderlijke terrassen)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000690103 (LoD2.2 complete eigen garage en lage kantoren)
- AHN DSM/DTM 0.5 m en actuele orthoHR: afzonderlijke fysieke daken; open glazen borstweringen hebben weinig bruikbare DSM-cellen, coherent LoD2.2 vlak gebruikt waar nodig
- https://commons.wikimedia.org/wiki/File:Hoge_Erasmus_2018_1.jpg (Steven Lek eigen foto, CC BY-SA 4.0: V-kolommen en kantoorplint; in browser bekeken)
- https://commons.wikimedia.org/wiki/File:Hoge_Erasmus_2018_2.jpg (Steven Lek eigen foto, CC BY-SA 4.0: golvende woontoren en plint; in browser bekeken)
- https://commons.wikimedia.org/wiki/File:Rotterdam_Hoge_Erasmus.jpg (Zairon eigen foto, CC BY-SA 4.0: terrassen en zijgevel; in browser bekeken)
- https://www.skyscrapercenter.com/building/hoge-erasmus/5407 (CVU: 93 m, 28 verdiepingen, 68 appartementen, Klunder, Willemsplein 500/569)
- https://sprank.nl/en/projecten/hoge-erasmus-rotterdam/ (renovatieontwerper: eigen entreeproject en fotos)
- https://www.colliers.com/nl-nl/news/fyeo-opent-oogkliniek-in-hoge-erasmus-offices-in-rotterdam (verhuuradviseur: kantoorplint en huidige eigenaar/gebruik 2026)
