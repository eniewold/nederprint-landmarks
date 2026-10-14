# Cross Towers (Amsterdam)

## Bestanden en plaatsing

`cross-towers.glb` in meters met Y omhoog, `cross-towers.json` voor de catalogus en `cross-towers-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-cross-towers.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [120774, 483411], X-as [0.9999862922474267, -0.00523596383141958], Z=0 op NAP -0.57 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.40364998 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012061407.

## Bouwdelen, gemeten maten en aannames

Twee verschoven doorlopende kantoorvleugels, de terugliggende glazen kern, het lange restaurantpaviljoen en de lage westelijke galerij vormen een enkel gesloten gebouwvolume. De gevelas van -0,30 graden volgt de lange dakranden. BAG, actuele ortho en AHN/3D BAG bepalen de contouren; glas veroorzaakt gaten en ruis in de reconstructie, daarom zijn de torenranden tot continue rechte gevels geregulariseerd. Gemeten westelijk dak NAP 86,257 m, oostelijk dak 86,243 m en kern 85,436 m; restaurantdak 7,405 m en westelijk paviljoen 5,116 m. Modelnul NAP -0,57 m sluit op beide straatzijden aan, PDOK maaiveld 42,40365/42,47916 m ellipsoidisch. De ondergrondse parkeerlagen van de BAG-voetafdruk en de open vijverhof worden niet als gebouwplaat gemodelleerd. De diagrid op de vier lange gevels heeft vijf traveeen en zes driehoekbanden met circa 0,95 m brede, aan de glazen achterwand verbonden ribben. Alle glasvelden zijn blind, 0,36-0,40 m diep, met ondiepe horizontale glasnaden en een doorlopende achterwand. De bovenste kopgevels hebben een continu hellend glasvlak van circa 0,95 naar 0,36 m terugsprong tussen NAP 77,1 m en de dakrand. Gevelritme, ribdikte, glashelling, dakranddikte van 0,18 m en paviljoenvensters zijn schattingen uit de openbare Arcam- en Edge-fotos. Dakvlakken zijn ononderbroken en niet opgebouwd uit hoogtelagen. De test toetst beide torendaken, de lagere kern, beide paviljoens, daadwerkelijk uitspringende diagridribben, de hellende kopglazing, een lege vijverhof en een enkel printbaar materiaalvolume.

## Weggelaten

Ondergrondse parkeerlagen, kleuren, EY-letters, fijne kozijnen, dunne dakonderhoudsgiek op de westelijke dakrand, glastransparantie, interieurs en zonnepaneeltexturen zijn weggelaten. De vijver en bestrating blijven PDOK-terrein. Niet elke glasnis van de overlappende servicegevel is uitgeboord: onzichtbare interne gevelvelden en twee lage terugliggende hoekvelden zijn behouden om de gesloten massa te bewaken. De aanliggende Vivaldi-toren en andere buurgebouwen blijven PDOK; zij dekken sommige paviljoenaanzichten op de kaart af.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 27,024 driehoeken. Printcontrole per node: NoError, 1.17% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: de doorlopende gevelkruisen, horizontale glasnaden, kopglazing en complete paviljoens rond de lege vijverhof; 55 graden: de twee verschoven torens, lagere verbindingskern en het doorlopende schuine bovenste kopglas; 145 graden: de echte lange geveldiagrid met dichte achterwand, afzonderlijke dakhoogtes en lage galerij; 235 graden: de complete podiumvorm, verbonden diagonaalribben, blinde raamvelden en open vijverhof.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 250 bij 250 mm, 310 objecten, 203,360 driehoeken, 89.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012061407, 3D BAG LoD2.2 en AHN DSM/DTM 0.5 m voor contouren, dakranden, daken en maaiveld; actuele orthoHR
- https://www.aronsohn.nl/project/vivaldi/ (constructeur: twee verschoven bouwdelen, centrale kern, diagrid en ondergrondse garage)
- https://edge.tech/portfolio/cross-towers (eigenaar: twee torens, kern en podiumvoorzieningen; overzichtsfotos)
- https://arcam.nl/architectuur-gids/kantoor-ernst-young/ (Doriann Kransberg/Stadsarchief Amsterdam: drie schuine fotos en schuin bovenste kopglas)
