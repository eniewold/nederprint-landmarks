# Hofpoort (Shell-gebouw) (Rotterdam)

## Bestanden en plaatsing

`hofpoort.glb` in meters met Y omhoog, `hofpoort.json` voor de catalogus en `hofpoort-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-hofpoort.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92502, 437802], X-as [0.9563047559630354, 0.29237170472273677], Z=0 op NAP -0.05 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.290304 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000702496.

## Bouwdelen, gemeten maten en aannames

Eén verbonden gesloten bouwgroep omvat de volledige Hofpoorttoren en de bijbehorende parkeergarage binnen BAG 0599100000702496. De toren heeft een gemeten rechte voet van circa 25 bij 34 m, langs de gevelas van 17 graden. Het hoofddak ligt op NAP 93.441 m, de grote lift-/techniekopbouw op 94.606 m, twee hogere hoekkoppen op 96.126 en 95.694 m. De gemeten grillige dakput blijft open tot zijn gesloten bodem op 89.052 m. De toren is een doorlopend volume met een brede blinde bovenkop, geen donkere glasdoos of willekeurige smalle extra torenspits.

De betonnen gevel heeft een regelmatig vensterraster met ondiepe afgeschuinde neggen. Het raster is geschat uit de bronfoto's: circa 3.25 m per rij en 2.1 m per kolom. Vensters zijn 0.42 m diepe blinde nissen; hun beperkte bevel laat minstens circa 0.9 m materiaal tussen de vensters. De in 2016 gerenoveerde dubbelhoge publieke plint is als een gesloten terugliggende glasgevel met nissen tot 0.6 m diep vereenvoudigd.

Beide posities van Marc Ruygroks De parel zijn herkenbaar gemaakt met een blinde vierkante omlijsting en een ondiep bolreliëf dat met de gevel is versmolten. De bronmaat van de omlijsting is 5 bij 5 m; posities, bolstraal circa 1.85 m en de beperkte diepte zijn uit foto's geschat. Er zijn geen los zwevende bollen of vrijstaande dunne kaders.

De hoofddaken van de volledige garage liggen op NAP 12.765 m, de hogere oostvleugel op 14.396 m en de lagere noordoosthoek op 11.142 m. Hun brede horizontale openingen zijn blinde bandnissen van 0.7 m diep, met massief parkeerinterieur. De garage-dakvoeg is binnen de BAG-footprint circa 0.8 m vereenvoudigd zodat de blijvende bouwdelen één verbonden lichaam vormen. De kantoorpenthouse op 17.563 m, verticale trap-/liftkoppen en de oostelijke servicekop op 16.812 m blijven benoemde bouwdelen. Alle hoofdhoogtes komen uit 3DBAG/AHN; de contouren zijn tot doorgaande gevel- en dakvlakken vereenvoudigd.

Het oude glazen Shell-I-pand (0599100000634843) en de kleine zelfstandige panden 0599100010051672 en 0599100100012982 worden niet verborgen. De actuele BAG-contouren hebben geen overlap met de Hofpoort-footprint. De generator bouwt alleen het eigen complex, zonder publieke straat-/pleinplaat en zonder gestapelde AHN-hoogtelagen.

## Weggelaten

Losse dakantennes, vlaggenmasten, logoletters, lampen, dunne glas-/metaalroedes en installatieleidingen kleiner dan 0.9 m zijn weggelaten of met de grotere dakkoppen samengevoegd. De gele Luchtsingel en de oudere Shell-vleugel buiten het eigen BAG-pand zijn geen onderdeel van deze landmark. Garage-interieur, entreevides en interne trappen blijven massief of blind om zonder steun te printen. De Parel-kaders en bollen zijn ondiepe geïntegreerde reliëfs in plaats van los hangende onderdelen. Fijne afgeronde betonhoeken zijn tot doorgaande afgeschuinde gevelranden vereenvoudigd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 24,644 driehoeken. Printcontrole per node: NoError, 0.28% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De hele parkeergarage krijgt brede bandnissen, verticale kernen en de afzonderlijke hogere oost- en lagere noordoostdaken; de toren blijft een gesloten gevelvolume.; 55 graden: De betonnen vensterneggen en de brede blinde kop met het Parel-reliëf vervangen vlakke PDOK-facetten; de echte dakput en installatiekoppen blijven herkenbaar.; 145 graden: De garage-penthouse en achterste vleugels volgen eigen dakhoogtes; geen platte uniforme doos onder de hoofdtoren.; 235 graden: De volledige torenvoet sluit aan op de garage, met dubbelhoge blinde glasplint, doorlopend raster en het tweede Parel-reliëf boven in de gevel..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 372 objecten, 125,358 driehoeken, 98.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.rotterdamarchitectuurprijs.nl/archief/spaces-hofplein.html (renovatie2016, ZZDP/SevilPeach)
- https://www.shell.nl/over-ons/nieuws/shell-venster-2024/verleden-heden-toekomst.html (historische opdrachtgever,26lagen/95m)
- https://www.bkor.nl/beeld/de-parel/ (collectiebeheerder,Marc Ruygrok,5x5m)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702496 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Rotterdam_-_Hofpoort.jpg (Fred Romero CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Rotterdam_-_Hofpoort_(1).jpg (Fred Romero CC BY2.0)
