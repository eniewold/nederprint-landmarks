# CasaNova (Rotterdam)

## Bestanden en plaatsing

`casanova-rotterdam.glb` in meters met Y omhoog, `casanova-rotterdam.json` voor de catalogus en `casanova-rotterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-casanova-rotterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [93092, 437006], X-as [0.966433363887945, 0.25691740533531565], Z=0 op NAP 2.54 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.97028124 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100100018533.

## Bouwdelen, gemeten maten en aannames

De eigen BAG-contour en driehoekige torencontour zijn uit BAG/3D BAG gemeten. Het podiumdak ligt op NAP 19,38 m, het torendak op 111,489 m, de dakrand op 112,48 m en de machinekern op 113,71 m; AHN5 2023 bevestigt de voltooide toren. Een continu hellende voet verbindt de smalle nek met de volle driehoekige toren. Nekfactor 0,70 en overgangshoogte NAP 31,9 m zijn uit schuine foto's geschat. De drie vlakke torengevels hebben negen traveeën met blinde raam- en loggianissen van respectievelijk 0,34 en 0,72 m diep; hoektraveeën zijn ondiep gehouden om doorsneden aan twee gevels te voorkomen. Venstermaat, verdiepingsritme, loggiadiepte, plintpuien en galerijvouwen zijn fotoschattingen, voor 1:1000 vereenvoudigd. De hele eigen onderbouw heeft een terugliggende kern, dragende buitenkolommen, drie gevouwen galerijvloeren met 45-graden onderzijden en een verbonden dak met drie verhoogde tuinbedden. De westelijke gedeelde gevel blijft dicht. The Muse (BAG 0599100100015965) is een afzonderlijk gebouw en blijft PDOK; zijn circa NAP 78 m hoge dak klopt met AHN5. Alle bouwdelen zijn verenigd tot één verbonden model. De open plint heeft echte doorgangen, terwijl de torennissen geen doorgaande gaten vormen. De backlogomschrijving 'gebogen gevel met horizontale balkonbanden' is gecorrigeerd naar een driehoekige toren met taps toelopende voet.

## Weggelaten

Losse balkonhekken, gevelkleur, beplanting, kleine dakinstallaties en fijn glasprofiel zijn weggelaten; er zijn geen losse zwevende delen. De aangrenzende toren The Muse en zijn onderbouw blijven het bestaande PDOK-model.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 17,062 driehoeken. Printcontrole per node: NoError, 1.10% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: continu versmallende voet en blind raamritme boven de gevouwen plint, waar PDOK alleen een rechte dichte toren toont; 55 graden: driehoekige scherpe hoek met gesloten hoeknissen en werkelijk open galerijen in de onderbouw; 145 graden: achtergevel met blinde vensters, volledige dakcontour en een gemeten machinekern; The Muse blijft afzonderlijk behouden; 235 graden: schuine voet en dakgardenbedden naast de behouden The Muse, met een complete aansluiting van de onderbouw op het maaiveld.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 306 objecten, 165,306 driehoeken, 122.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100018533
- PDOK BAG 0599100100018533 EPSG:28992, actuele contour
- PDOK AHN5 DSM 0.5 m (2023); PDOK AHN DTM 0.5 m en actuele orthoHR
- PDOK 3D Basisvoorziening: maaiveld op Wijnhaven 45.9703/46.0340 m ellipsoïdisch
- https://barcodearchitects.com/projects/casanova/ (schuine foto’s Hans Wilschut, uitsluitend visuele referentie; maten uit open data)
- https://commons.wikimedia.org/wiki/File:CasaNova_Rotterdam.jpg Dinx, CC BY-SA 4.0
- https://nl.wikipedia.org/wiki/CasaNova_(Rotterdam)
