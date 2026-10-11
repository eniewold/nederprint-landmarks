# Montevideo (Rotterdam)

Woontoren op de Wilhelminapier (Mecanoo, Francine Houben, 2005), 139,5 m hoog en met de letter M op het dak 152,32 m. De toren is een stapeling van volumes in verschillende gevelmaterialen: een rode bakstenen kolom aan de Rijnhaven, een witte toren met loggia's en patrijspoorten, een donker bakstenen en een glazen volume tot +92, een lager rood volume aan de noordgevel, en bovenop de rode kubus met een glazen gevel in een rood kader die naar het westen uitkraagt. Op het dak staat de M als windvaan. In hetzelfde BAG-pand liggen een lagere strook langs de Rijnhaven en het oostblok met de watertoren, dat 16 m over de kade uitkraagt.

Het model bestaat uit benoemde prisma's, kragen en omhulsels in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-hoftoren.mjs` en `generate-maastoren.mjs`. Reproductie: `node scripts/generate-montevideo.mjs`.

## Bestanden en plaatsing

- `montevideo.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 36.002 driehoeken).
- `montevideo.json`: catalogusitem.
  - RD-oorsprong `[92950, 435440]`, midden in de toren.
  - `xAxis` 36,45°: langs de lange gevels van het pand (BAG 36,4–36,5°), naar het oostblok.
  - +Y wijst naar 126,45° (noordwest), naar de Otto Reuchlinweg en de Maas. De Rijnhaven ligt aan −Y, Hotel New York aan −X/+Y.
- `montevideo-1-1000.stl`: millimeters, Z omhoog, 93,7 × 45,3 × 153,4 mm, vlakke voet.

z = 0 ligt op NAP +3,4 m, op de kade en de straten rondom (AHN-DTM +3,3 tot +3,6). De voet loopt door tot −1,2 m (NAP +2,2). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op het Landverhuizersplein (`[−22,0]`), de kade aan de Rijnhaven (`[0,−20] [40,−20]`), de Otto Reuchlinweg (`[40,22]`) en de straat oostelijk van het oostblok (`[85,0]`).

Het model vervangt alleen BAG `0599100000750601` (bouwjaar 2005): toren, strook en oostblok zijn één pand. Wat er niet bij hoort:

- Hotel New York (`models/hotel-new-york`, pand `0599100000642881`) ligt 30 m naar het westen; het World Port Center (`0599100000691020`) en de bouwplaats ten noorden van de Otto Reuchlinweg (`0599100110022000`) zijn aparte panden. De Rotterdam (`models/de-rotterdam`) en de Maastoren liggen verder naar het oosten. Het model raakt geen ander pand en geen ander landmarkmodel.
- De twee paviljoens op het Landverhuizersplein (`0599100110026465`, `0599100100015977`) liggen 55 m westelijk.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Rode kubus

- **Plattegrond** 18,8 × 15,75 m (u −14,8..4,0, v −10,75..5,0; AHN-randen). Van +89,5 (gevel- en doorsnedetekening, foto's) tot **+143,1** (3D BAG 143,07–143,18).
- **Uitkraging naar het westen**: 1,7 m voorbij de witte toren en 3,8 m voorbij de rode kolom, aan de zuidkant 0,46 m. Eronder een **kraag van 45°** in twee stappen, zoals de schuine oranje onderkant op de foto's.
- **Glazen westgevel in een rood kader** van 1,4 m: per laag vier vakken (0,4 m diep) tussen vloerranden en stijlen van 0,5 m.
- **Zuidgevel** rood baksteen met verspringende brede en smalle vensters.
- **Terrassen in het dak** (3D BAG): +141,6 aan de westkant, +140,3 aan de noordkant, +140,7 in de zuidwesthoek, met een rand van 0,9–2,3 m tot +143,1.

### Windvaan met de M

- **Voet** 1,4 × 1,4 m van het dak tot +145,6, een **arm** langs X van 15 m (1,0 × 1,6 m, +145,6..+146,6) en de **letter M** van 7,8 × 9,05 m, 1,6 m diep, tot **+155,6** (Wikipedia: 152,32 m boven maaiveld +3,4; tekening 152,1 m).
- Poten van 1,6 m en schuine halen van ca. 1,6 m; de onderkant van de V helt 52°, dus de letter print zonder steun.
- De arm volgt het AHN (punten 144–146,2 van u −3,6 tot 8,3). De liftopbouw (+145,7) draagt het oosteinde.

### Witte toren

- **L-vorm** boven het donkere en glazen volume en naast de kubus (u −13,1..14,2, v −9,0..13,1), dak **+137,3** (3D BAG 137,2–137,5) met een rand van 0,9 m tot +138,6.
- **Dakopbouwen**: installatie tot +139,7 (3D BAG), een verhoogd deel tot +139,6 en de liftopbouw tot +145,7.
- **Lage witte toren** aan de westkant (u −13,1, v −3,5..13,1) van de grond tot onder de kubus: per laag twee **loggia's** van 6,7 m (0,45 m diep) met een wit balkonfront ertussen.
- **Noordgevel** met vierkante vensters en **patrijspoorten** (rond, 1,2 m; Wikipedia: ronde ramen aan de noordzijde): een kolom in de inham bij het Landverhuizersplein tot op de grond, en kolommen boven het rode noordvolume en boven +92,3.

### Rode kolom, rood noordvolume, donker en glazen volume

- **Rode kolom** aan de Rijnhaven (u −10,97..3,0, v −10,29..−3,5; BAG) tot onder de kubus: verspringende vensters.
- **Rood noordvolume** (u −11..3, v 13,1..17,18) tot **+75,4** (3D BAG).
- **Donker volume** (noordoost) en **glazen volume** (zuidoost, 2,2 m voor de rode gevel; BAG v −12,47) tot **+92,3** met een rand van 0,9 m tot +92,9.
  - Donker: brede liggende vensters in de noordgevel, verspringende vensters in de oostgevel boven de strook.
  - Glas: donker kader van 1,2 m met per laag drie vakken; eronder een bakstenen plint met een vensterband tot +13,6.

### Strook langs de Rijnhaven

- **Voorstrook** (v −10,27..−2,5) tot **+18,1** met een borstwering van +19,4 aan de kade; rood baksteen met twee vensterbanden.
- **Achterstrook** (v −2,5..15,3) tot **+32,1** met een rand van +32,7; donker baksteen met drie rijen liggende vensters.
- **Rode plint** aan de noordgevel (v 15,3..16,7) tot **+21,5** (AHN 21,5–21,8), met twee vensterbanden.
- **Dakopbouw** met een schuin dak (3D BAG 32,9 en 34,7).

### Oostblok

- **Plattegrond** 23,2 × 43,8 m (BAG), dak **+40,8** met een rand van +41,5.
- **Uitkraging over de kade**: het zuidelijke deel (v −10,27..−26,63, 16,4 m) begint op +12,8 en staat op **vier schuine stempels** van 1 × 1 m. Die lopen van de kade schuin omhoog naar de onderkant (52° steil, printbaar).
- **Gevels**:
  - zuidgevel aan de Rijnhaven: glas en balkons in een rood kader van 1,4 m, vier vakken per laag (0,5 m diep);
  - oranje westgevel van de uitkraging en de gevels boven de strook: verspringende vensters.
- **Dakopbouw** (3D BAG): terugliggende laag tot +43,7 met delen tot +45,3, +45,9 en +46,3, met vensterband.
- **Installaties**: vier **schoorstenen** van 1 m tot +50,5 en de **watertoren** (diameter 4 m, tank +47,2..+49,8, kegeldak tot +51,5; 3D BAG) op poten en een middenkolom, met een bodem onder 45°.

### Luifels en begane grond

- **Luifel van +8,1** langs de zuid- en noordgevel van strook en oostblok (AHN 8,0–8,1, 2,2 en 2,0 m diep).
- **Luifel van +10,6** langs de noordgevel van de toren (AHN 10–11, 1,35 m).
- Alle luifels zijn 0,8 m dik met een kraag van 45° tegen de gevel.
- Glazen begane grond (+3,9..+7,4) als vensterband rondom.

## Geschat en weggelaten

Geschat:

- **Onderkant van de kubus** (+89,5) uit de geveltekening en de foto's (88,7–89,7). De kraag eronder volgt de schuine onderkant op de foto's.
- **Grenzen tussen de volumes** onder de kubus uit de BAG-contour, het AHN (dakhoogtes per deel) en foto's van alle kanten. De grens tussen het donkere en het glazen volume op de oostgevel (v = −0,5) is geschat.
- **Gevelritme uit foto's**: 43 lagen van 3,12 m. Verspringende vensters in de bakstenen gevels, loggia's in de witte westgevel, patrijspoorten in de noordgevel en glas in een kader. Het aantal vakken per laag is vereenvoudigd.
- **Windvaan**: de M draait met de wind. Op de foto's staat hij in verschillende standen, en in het AHN lijkt de letter dwars op de arm te staan; vermoedelijk draaide hij tussen twee vliegstroken. Het model zet de letter vast in het vlak van de arm, naar de Rijnhaven gericht, zoals op de gevel- en doorsnedetekening van Mecanoo. Maten uit de tekening: 7,8 × 8–9 m, arm 15–16 m. De bovenkant komt uit Wikipedia.
- **Uitkraging van het oostblok**: onderkant +12,8 en de vier stempels (plaats en helling) uit foto's.
- **Dakopbouw, schoorstenen en watertoren**: uit de 3D BAG, het AHN en foto's. De plaats van de schoorstenen is geschat.

Weggelaten:

- **Gevelonderhoudsinstallaties** op de kubus en het oostblok: dunne kranen.
- **Stalen terrasoverkapping** van het restaurant in de noordwesthoek (AHN +10–11, u −17..−11,5). Een open frame op dunne kolommen, buiten de BAG-contour, met een vrije horizontale overspanning.
- **Kleine balkons** aan de oostkant van de witte toren en de noordwesthoek van het oostblok, en balkonhekken. Dunner dan 0,9 m of minder dan 1 m diep.
- **Antennes en de vlaggenmast**.
- **Logo's en de letter M boven de kantoorentree**.
- **Kleurverschillen** tussen rood, oranje, donker en wit baksteen of panelen: dat is materiaal, geen vorm. Het model heeft één `building:`-node.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 20, 168.418 m³. Nissen die een ander bouwdeel afdekt, worden ingesloten holtes; die vallen weg. De ondervlakken zijn de bovenkanten van de nissen, de onderkant van de uitkraging van het oostblok (+12,8) en de luifels.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 370 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet (−1,2) en de top van de M (+155,6);
  - de kubus (+143,1) met de drie terrassen, de uitkraging tot u −14,8 en dat er onder +87 niets westelijk van u −13,2 staat;
  - de witte toren (+137,3), het donker/glazen volume (+92,3) en het rode noordvolume (+75,4);
  - dat boven +146,7 alleen de M staat, en de arm;
  - strook (+18,1 en +32,1), oostblok (+40,8), de onderkant van de uitkraging (+12,8), de stempels en de watertoren (+51,5);
  - de vensters in de rode kolom en het glas in het kader van de kubus.
- **Printcheck** op 1:1000 bij 45°: 1,17 % extra volume. Dat is vooral de opvulling onder de uitkraging van het oostblok, de luifels en de arm van de windvaan.
- **Export**: `createModelBundle` op 1:1000, RD `[92860,435350,93060,435550]`. Duur 13,2 s, 119 objecten, 148.586 driehoeken, vijf vellen, modelhoogte 153,7 mm. Het model staat compleet op de kade; onder de uitkraging van het oostblok vult de export op naar de stempels.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, plus 20–30° naast elke gevel (170°, 260°, 350°, 80°) en de hoeken van de foto's (165°, 215°, 285°, 20°). De 3D BAG heeft de goede dakhoogtes, maar vlakke wanden tot de grond: geen uitkraging van de kubus, het oostblok als dichte wand tot op de kade, geen M. Het model heeft per kant meer:
  - **Rijnhaven (145°/170°)**:
    - de rode kolom en kubus met vensters;
    - de M;
    - het glazen volume met kader;
    - de witte toren erboven;
    - de strook met vensterbanden en luifel;
    - het oostblok met glazen zuidgevel, open uitkraging en stempels.
  - **Landverhuizersplein (235°/260°)**:
    - de uitkragende kubus met kraag en glazen westgevel in het kader;
    - de witte loggia's;
    - de rode kolom;
    - de terrassen op de kubus.
  - **Otto Reuchlinweg en Maas (−35°/350°)**:
    - de trap rood noordvolume (+75,4) → donker volume (+92,3) → witte toren (+137,3) → kubus;
    - patrijspoorten;
    - de strook met plint en luifel;
    - het oostblok met dakopbouw, schoorstenen en watertoren.
  - **Oost (55°/80°)**:
    - de donkere oostgevel boven de strook;
    - de glazen gevel;
    - de kopgevel van het oostblok;
    - de dakopbouw.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk; alleen de kubus steekt aan de westkant 1,7 m buiten de BAG-contour (de uitkraging).

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.90415/4.48595/350/1x1/0)): toren, strook en oostblok liggen op de PDOK-reconstructie van het pand naast Hotel New York, met het gevelraster zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0599100000750601`, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026. Het gebouw (2005) is ouder dan het AHN4, dus AHN5 was niet nodig.
- [3D BAG, pand 0599100000750601](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000750601) (TU Delft/3D geoinformatie, CC BY 4.0): dakvlakken van de kubus, de witte toren en het oostblok, en de watertoren.
- [Wikipedia: Montevideo (gebouw)](https://nl.wikipedia.org/wiki/Montevideo_(gebouw)): 139,5 m, met de M 152,32 m, M van 12 m, ronde ramen aan de noordzijde, Mecanoo.
- Commons, alleen als visuele referentie:
  - [Montevideo Residential Tower 9](https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_9.jpg) en [10](https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_10.jpg) (gevel- en doorsnedetekening: hoogtes van de kubus, het glazen volume en de M)
  - [Rotterdam montevideotoren](https://commons.wikimedia.org/wiki/File:Rotterdam_montevideotoren.jpg), [Montevideo Residential Tower 7](https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_7.jpg) en [Montevideo(Rotterdam)](https://commons.wikimedia.org/wiki/File:Montevideo(Rotterdam).jpg) (Rijnhaven: volumes, strook, oostblok met stempels)
  - [Woontoren Montevideo in Rotterdam](https://commons.wikimedia.org/wiki/File:Woontoren_Montevideo_in_Rotterdam.jpg) en [Skyscraper in Rotterdam](https://commons.wikimedia.org/wiki/File:Skyscraper_in_Rotterdam_(28384617249).jpg) (zuidwest: kubus, loggia's, rode kolom)
  - [Montevideo 2010](https://commons.wikimedia.org/wiki/File:Montevideo_2010.JPG) en [View of Montevideo vanaf de Euromast](https://commons.wikimedia.org/wiki/File:Euromast_-_Scheepvaartkwartier_-_Rotterdam_-_View_of_Montevideo.jpg) (noordwest: patrijspoorten, trap van de volumes, M)
  - [Rotterdam - Montevideo (1)](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Montevideo_(1).jpg) en [(2)](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Montevideo_(2).jpg) (noord en noordoost: donker en rood volume, strook)
  - [Montevideo Residential Tower 3](https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_3.jpg) en [4](https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_4.jpg) (uitkraging van het oostblok met stempels)
