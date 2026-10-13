# UP Office Building (IJ-toren) (Amsterdam)

## Bestanden en plaatsing

`ij-toren.glb` in meters met Y omhoog, `ij-toren.json` voor de catalogus en `ij-toren-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-ij-toren.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [122941, 487872], X-as [0.9602936856769431, -0.2789911060392292], Z=0 op NAP 1.4 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.426876 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012090447.

## Bouwdelen, gemeten maten en aannames

De UP Office Building heeft twee rechte glasgevelschijven, een hoge centrale installatiekern, een westelijke glasvin en een doorlopend kroonvlak. Het hoofddak ligt op NAP 81.096 m, de gemeten kern op 89.086 m, de dakterrasbodem op 79.834 m en de zuidelijke slanke kantoorvleugel op 32.697 m. De backlog beschreef een gebogen toren; de boog hoort bij de lagere Passenger Terminal Amsterdam, die samen met de toren in BAG 0363100012090447 zit. Foto's van de andere IJ-toren bij de Verbindingsdam zijn bewust niet als maatbron gebruikt.

Het terminaldak is één doorlopend geëxtrudeerd dwarsprofiel. AHN4-metingen over drie vrije dakstroken geven de hoge afgeronde kop tot NAP 26.11 m, het aflopende vlak tot circa 16.91 m en de lage eindgoot op 16.525 m. Dakvlakken zijn tot circa 0.5 m benaderd, geen gestapelde hoogteplakken. De gemeten terminalplint op 12.564 m, oostelijke foyer op 12.574 m en entreeblok op 18.094 m vormen de volledige lage bouwgroep; de openbare verhoogde plein-/garagevoet aan de Piet Heinkade is niet dubbel gemodelleerd.

De lange glazen kadepassage heeft volgens BAG een lengte van 305.81 m, breedte circa 4 m en dakhoogte 11.774 m. Zij hoort bij dit pand, ook waar ze langs een afzonderlijk warehouse loopt. Het glazen binnenvolume is massief met blinde nissen van 0.3 m. Onder de passage staan minimaal 1.2 m brede vereenvoudigde pijlers en spitse onderbogen van circa 50 graden, zodat de openingen printbaar blijven zonder externe steun. De exacte pijlerafstand, glasnaden en boogvorm zijn uit foto's geschat; het horizontale hoofdvolume en zijn maatvoering zijn gemeten.

Maaiveld NAP 1.4 m, gevelas -16.2 graden en terugvalhoogte 44.426876 m ellipsoïdisch volgen metingen van de straatzijde. De torengevel heeft een geschat raster van 2.5 m bij 3.75 m met 0.35 m blinde nissen en circa 1.1 m material tussen vensters. Kroonhoogte 82.0 m en het onderste begin van de glasvin op 59.2 m zijn circa 1-2 m onzeker. De onderste kroonrand ondersteunt de circa 2 m uitkraging met een geïntegreerd vlak van 45 graden. De gemeten kern, dakput en kantoorvleugel volgen 3DBAG/AHN.

Mövenpick Hotel en Muziekgebouw (BAG 0363100012118833) en de oostelijke warehouses (0363100012239869) blijven behouden via hun bestaande modellen. Een verkeerd AHN-dakvlak op een scheepsmast in het eigen pand wordt niet als een extra 66 m hoge kademuur overgenomen.

## Weggelaten

Publieke verhoogde pleinen/garagevoet, schepen en foutieve mastvlakken vallen buiten het gebouw. Glasinterieur, fijne antennes, onderhoudsgieken, logoletters, lamellen en metalen roedes kleiner dan 0.9 m zijn massief vereenvoudigd of weggelaten. De kadepassage krijgt spitse printbogen en verdikte piers in plaats van open horizontale overspanningen. Het naburige hotel/Muziekgebouw en oostelijke warehouses blijven afzonderlijk.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 26,430 driehoeken. Printcontrole per node: NoError, 0.76% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De volledige terminalplint, gebogen/aflopende doorlopende dakvlakken en blinde gevelnissen voegen herkenbare bouwdelen toe.; 55 graden: De twee rechte glasgevelschijven, hoge centrale kern, westelijke glasvin en open onderbogen van de hele passage vervangen vlakke reconstructies.; 145 graden: De gemeten dakput en dakkoppen, zuidelijke kantoorvleugel en geordende terminalgevel volgen bronfoto en AHN.; 235 graden: De afgeronde hoge terminalkop en lange kadepassage blijven samenhangend; geen fictieve scheepsmastmuur of dubbele publieke plateauplaat..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 380 bij 380 mm, 360 objecten, 366,080 driehoeken, 90.9 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://upofficebuilding.nl/ (eigenaar, Piet Heinkade55,19verdiepingen)
- https://www.tgm.nl/projecten/ij-toren/ (gevelrenovatie)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012090447 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:PietHeinKade2015.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:%27IJ-Toren%27_Amsterdam_(5619892436).jpg (FaceMePLS CC BY2.0)
- https://commons.wikimedia.org/wiki/File:A_photo_of_climbing-hall,_Passenger_terminal_and_waterfront_of_the_IJ_in_Amsterdam,_Oosterdok_2005.jpg (Fons Heijnsbroek CC0)
