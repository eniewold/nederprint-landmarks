# Maastoren (Rotterdam)

Kantoortoren aan de Nieuwe Maas op de Kop van Zuid (Dam & Partners Architecten met Odile Decq Benoit Cornette, 2009), 164,75 m en tot 2021 het hoogste gebouw van Nederland. Het gebouw bestaat uit een hoge schijf (Deloitte) met een knik in de plattegrond, een glazen liftschacht met de mast, de lagere AKD-toren van 105 m, een plint met parkeerlagen, een lage glazen uitbouw aan het water en een gevouwen luifel boven de entree.

Het model bestaat uit benoemde prisma's en vlakken (planvergelijkingen) in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-rembrandttoren.mjs` en `generate-hoftoren.mjs`. Reproductie: `node scripts/generate-maastoren.mjs`.

## Bestanden en plaatsing

- `maastoren.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 52.228 driehoeken).
- `maastoren.json`: catalogusitem.
  - RD-oorsprong `[93497, 435966]`, in het zuidelijke deel van de hoge schijf.
  - `xAxis` 54,8°: langs de zuidoostgevel van de schijf en de gevels van de AKD-toren en de plint (BAG 54,6–54,9°).
  - +Y wijst naar het noordwesten, naar de Nieuwe Maas. De AKD-toren ligt aan −X, de glazen uitbouw aan +X, de plint aan −Y.
- `maastoren-1-1000.stl`: millimeters, Z omhoog, 67,3 × 61,3 × 176,6 mm, vlakke voet.

z = 0 ligt op NAP +3,9 m, op het plein en de straat rondom (AHN-DTM +3,7 tot +4,2). De voet loopt door tot −2,8 m (NAP +1,1), omdat het AHN aan de waterkant (uitbouw en noordoostgevel van de schijf) op +1,6 ligt. `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op het plein aan de zuidwestkant (`[−42,−20] [−42,10]`) en op de straat aan de zuidkant (`[−20,−34] [0,−34]`), niet aan het water.

Het model vervangt alleen BAG `0599100000754173` (bouwjaar 2011 in de BAG). Dat ene pand omvat de schijf, de AKD-toren, de plint en de uitbouw. Het loopt aan de rivierzijde ook onder het plein door (v 20 tot 30,7). Daar staat niets boven het maaiveld: het AHN ziet het plein op +4,2, en de 3D BAG heeft er geen vlakken.

Wat er niet bij hoort:

- Het witte havengebouwtje op poten ten noordwesten (`0599100000691008`, 3D BAG tot +21,8) is een apart pand. De luifel blijft er 20 m vandaan.
- De Rotterdam (`models/de-rotterdam`) staat 430 m naar het zuidwesten. De kantoren aan de Wilhelminakade (`0599100000754536` en verder) zijn aparte panden. Het model raakt geen ander pand.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Hoge schijf

- **Plattegrond met knik**: een zuidelijk deel van 15,5 m breed (u −7,9 tot 7,6 vanaf de zuidoostgevel op v = −17,2) en een noordelijk deel dat 21° gedraaid staat. Dat volgt de BAG-gevels (159,0° en 69,5°) en de noordwestgevel van 15,56 m aan de rivier. De knikpunten liggen op (7,60; 2,29) en (−7,90; 5,35). Het AHN (oostrand 7,5 tot v = 3, daarna 8,75 → 16,5 tot v = 24,5) en de ortho tonen dezelfde knik.
- **Dak +162,05** (AHN-fit, 811 punten, rms 0,10) binnen een **glazen kroon** van drie lagen. De kroonwanden steken tot +164,7 boven het dak uit (AHN-randen 163,8–164,7) en zijn 1,2 m dik. De kroon loopt van +154,0 tot +164,7, met stijlen van 0,6 m op 1,7 m en een kalf op de vloer.
- **Gevels**:
  - vensterkolommen van 1,7 m op 3,4 m met witte lisenen ertussen;
  - het paneelraster op alle vrije gevels: een verticale voeg van 0,5 m midden in elke liseen (doorlopend tot de kroon) en een verdiepingsband van 0,4 m per laag, beide 0,3 m diep; vensters 0,35 m;
  - 30 kantoorlagen van 3,62 m boven de parkeerlagen (+45,4 tot +154,0). Wikipedia: hoogste vloer 154,1 m boven maaiveld;
  - aan de rivier (noordwestgevel) drie vensterkolommen aan de westkant. Het oostelijke derde heeft geen vensters, alleen paneelvoegen; dat tonen de foto's van het noordwesten (Maastoren_IMG_5117.jpg en Bovenkant_van_Maastoren.jpg);
  - onder +45 zes rijen grote parkeerroosters (2,2 × 4 m op 6 m) boven een glazen entreelaag.
- **Dakopbouw** naast de schacht tot +164,7 (3D BAG) met de **mast**: 1,5 m dik tot +171, daarna 1,0 m tot +177,7 (het hoogste AHN-punt).

### Glazen liftschacht

- Aan de zuidwestgevel, 4,9 × 20,1 m (ortho met kruisverband, 3D BAG). Dak +168,9 en een open stalen frame tot +169,6 (AHN), dus 5 m boven de kroon.
- Glazen ruiten van 1,2 m op 1,7 m per laag, zichtbaar boven de AKD-toren en boven de plint.
- Zuidelijk van de schacht loopt de plint door tot de schacht. Het AHN heeft in die spleet van 3 × 4 m tussen de torens geen punten; de 3D BAG geeft daar het plintdak.

### AKD-toren

- **Plattegrond** 15,8 × 44,3 m (BAG-zuidwest- en zuidoostgevel, AHN-oost- en noordgevel). **Dak +108,85** (AHN-fit, 2043 punten, rms 0,09) met een dakrand tot +109,4.
- **Gevels**:
  - brede donkere lisenen met daartussen per kolom een verdiepte strook van 1,9 m (0,2 m diep) met per laag een venster van 1,4 m (0,45 m diep) en een borstwering; onderin de parkeerroosters in dezelfde stroken (De_Maastoren_in_Rotterdam_in_2021.jpg, Maastoren_2012.jpg);
  - zuidwestgevel aan het plein met 15 stroken op 2,95 m;
  - kopgevels met vier stroken op 3,9 m;
  - 15 lagen van 3,67 m boven de parkeerlagen.
- **Glazen kopband** van +100,4 tot +108,9 over de noordwestgevel, de noordwestelijke helft van de zuidwestgevel en het stuk noordoostgevel aan de rivierzijde. Het zuidoostelijke deel met het akd-logo heeft nog één vensterrij.
- **Glazen liften** in de BAG-uitstulping van de zuidwestgevel (v 5,4–15,3), tot +45.
- **Entree** onder de luifel: een nis van 6 m breed tot +8,4.
- **Verbinding met de schijf** bij de knik (AHN 108,8 tot u −7,5) en een **glazen tussenlid** tot +45 (3D BAG) tussen de torens aan de rivierzijde, met een glazen gevel.

### Parkeerplint

- **Plattegrond** 21,4 × 12,7 m (BAG), zuidelijk van de schijf. **Dak +44,8** (AHN-fit) met een rand tot +45,5.
- Zes rijen parkeerroosters en de entreelaag in de zuidgevel; in de oostgevel boven de uitbouw.

### Glazen uitbouw aan het water

- **Plattegrond**: de BAG-contour tussen de schijf, de plint en het water, 19 × 49 m.
- **Gevouwen glazen dak van vier vlakken** (z = c + a·x + b·y):
  - A (noordelijke driehoek): 20,01 − 0,1323 x − 0,0423 y, 7,9° (AHN-fit, 450 punten, rms 0,04);
  - S (zuidelijk deel): 14,31 − 0,0682 x − 0,0897 y, 6,4° (AHN-fit, 619 punten, rms 0,05);
  - B (langs de schijf, AHN-gat): vlak door de nok R0 (9,42; −17,2; +19,49), de vouw R1 (25; 9) en de noordwesthoek tegen de schijf op +13,0. Dat valt samen met de vlakpunten van de 3D BAG (16,2 / 15,1 / 14,0);
  - C (noordoosthoek): sluit A en B aan.
- **Trede**: tussen A (hoog) en S loopt een glazen trede van 3 tot 4 m langs de lijn van de nok naar (28,75; −7,5), zoals in het AHN en op de ortho.
- **Gevels**: glazen gevels met stijlen op 1,9 m tot 1 m onder het dak.

### Luifel

- **Gevouwen glazen luifel** langs de zuidwestgevel van de AKD-toren (11,4 m diep, v −30,2 tot 18,8) en voor de zuidoostgevel (5,8 m diep).
- Onderkant +8,9, dalen op +10,2 bij de bomen en vouwen op +11,4 halverwege. Het AHN ziet het glas op +9,5 tot +11.
- **Zeven boomkolommen** van 1 m op 7,6 m (ortho, foto's).

## Backlog-hint tegen de metingen

- **"Schuin afgesneden top"**: klopt niet. Het dak is vlak (+162,05, rms 0,10 over 811 punten) binnen een glazen kroon tot +164,7. Daarboven staan alleen de liftschacht (+169,6) en de mast. Foto's van alle kanten tonen een rechte bovenrand. De indruk van een schuine top komt van de knik: het noordelijke deel van de schijf staat 21° gedraaid, waardoor de kroon vanuit sommige hoeken schuin lijkt af te lopen. Er is ook geen getrapte kop. De enige trap in het silhouet is schijf (+164,7) → schacht (+169,6) → mast.
- **"Lage plint met kantoor- en parkeerlagen"**: klopt. De parkeerlagen (3 tot 11) zitten niet alleen in de plint van +45 aan de zuidkant, maar ook in de onderste 45 m van beide torens. Dat is te zien aan de grote roosters op de foto's.
- **Wikipedia** noemt de AKD-toren "licht gedraaid" tegen de hoge toren. Volgens de metingen staan de AKD-toren, de plint en het zuidelijke deel van de schijf op dezelfde as. Het noordelijke deel van de schijf is gedraaid.

## Geschat en weggelaten

Geschat:

- **Gevelritme uit foto's**:
  - schijf met vensterkolommen op 3,4 m en 30 lagen van 3,62 m;
  - paneelvoegen en verdiepingsbanden van de schijf (breedte 0,5/0,4 m, uit de voegen op de foto's);
  - AKD-toren met stroken op 2,95 m (zuidwestgevel) en 3,9 m (kopgevels) en 15 lagen van 3,67 m;
  - parkeerlagen als zes rijen roosters van 4 m op 6 m, naar een frontale foto van de noordwestgevel.
- **Kroon en kopband**: de onderkant van de glazen kroon (+154,0) en van de kopband (+100,4) komt uit foto's; de bovenkant uit het AHN.
- **Liftschacht en mast**: de maten van de schacht komen uit de ortho en de 3D BAG. De mast is 1,5/1,0 m dik. De top is het hoogste AHN-punt (+177,7); Wikipedia geeft 177,7 m boven maaiveld (NAP circa +181,6), maar de dunne antennepunt ziet het AHN niet.
- **Uitbouwdak**: vlak B komt uit de 3D BAG (AHN-gat op schuin glas). Vlak C is geschat als aansluiting van A en B; daardoor ligt de noordoosthoek op +11,5.
- **Luifel**: diepte en glashoogte uit het AHN; vouwen en boomkolommen uit foto's en ortho.
- **Hoogtes**: het glazen tussenlid (+45) komt uit de 3D BAG. De liften (+45) komen uit een foto van de noordwestgevel.

Weggelaten:

- **Witte masten en trekstangen boven de luifel** (AHN tot +17..+22): dunner dan 0,9 m.
- **Gevelonderhoudsinstallatie** op het dak van de schijf (AHN-pieken tot +176 op twee plekken): dunne armen, en tijdelijk.
- **Dunne leuningen en frames**: de leuning van de kroon en het overstekende frame op de schacht zijn dunner dan 0,9 m.
- **Logo's** van Deloitte en AKD.
- **Kleurverloop** van donker natuursteen onderin naar zilverwit bovenin: dat is materiaal, geen vorm.
- **Damwanden, remmingen en de aanlegsteiger** in het water.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 1, 234.311 m³. Nissen die een ander bouwdeel afdekt, worden ingesloten holtes; die vallen weg. De ondervlakken zijn de bovenkanten van de nissen en de onderkant van de luifel.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 366 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet (−2,8) en masttop (+177,7);
  - de kroon op beide knikpunten en de noordhoek, het dak binnen de kroon, en dat alleen de schacht, de dakopbouw en de mast boven +165 uitkomen;
  - de schacht met het frame (+169,6), de AKD-toren met dakrand, de plint, het tussenlid;
  - de nok (+19,49) en het lagere vlak S van het uitbouwdak;
  - de luifel met vouwen en een boomkolom;
  - 30 vensterrijen en 29 verdiepingsbanden in de noordwestgevel;
  - de verdiepte stroken en vensters in de zuidwestgevel van de AKD-toren.
- **Printcheck** op 1:1000 bij 45°: 1,17 % extra volume. Dat is vooral de wig onder de luifel en de nissen.
- **Export**: `createModelBundle` op 1:1000, RD `[93430,435895,93560,436030]`. Duur 26,3 s, 106 objecten, 160.454 driehoeken, twee vellen, modelhoogte 182,2 mm. Het model staat compleet op het terrein. Aan de noordoost- en noordwestkant grenst het aan het water; de luifel wordt een wig naar de gevel.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, plus lage hoeken als de foto's van het noordwesten en zuidwesten. De 3D BAG heeft de goede massa's, maar vlakke wanden, een gerafelde top rond de schacht (losse stroken tussen 120 en 169 m) en de knik als zaagtand. Het model heeft per kant meer:
  - **Noordwest (−35°)**:
    - de rivierkop met vensterkolommen en de dichte oostelijke strook;
    - de glazen kroon;
    - de schacht met het frame en de mast;
    - het glazen tussenlid tussen de torens;
    - het gevouwen dak van de uitbouw.
  - **Noordoost (55°)**:
    - de geknikte noordoostgevel met vensterkolommen boven de uitbouw;
    - de nok en de trede in het uitbouwdak;
    - de kroon.
  - **Zuidoost (145°)**:
    - de plint met parkeerroosters;
    - de schacht boven de plint met glasruiten;
    - de zuidoostgevel van de AKD-toren;
    - de luifel met boomkolommen.
  - **Zuidwest (235°)**:
    - de AKD-toren met vensterkolommen, de kopband, de liften, de entree en de gevouwen luifel;
    - daarboven de schijf, de schacht en de mast (zoals op de foto's vanaf het plein).
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk met dezelfde knik.
- **Close-ups** op 3000 px vanuit 215°, 265° en 30°: het paneelraster van de schijf en de lisenen met vensterstroken van de AKD-toren staan op elke vrije gevel. Recht van voren (bijvoorbeeld 235° op de zuidwestgevels) toont de software-render het reliëf nauwelijks, omdat de wanden van de nissen dan op hun kant staan.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.90876/4.49336/350/1x1/0)): de hoge schijf en de AKD-toren liggen op de PDOK-reconstructie van het pand en het gevelraster is zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0599100000754173`, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026. Het gebouw (2009) is ouder dan het AHN4, dus AHN5 was niet nodig.
- [3D BAG, pand 0599100000754173](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000754173) (TU Delft/3D geoinformatie, CC BY 4.0): kroon, dak van de liftschacht, dakvlak van de uitbouw langs de schijf, tussenlid.
- [Wikipedia: Maastoren](https://nl.wikipedia.org/wiki/Maastoren) en [Maastoren (Engels)](https://en.wikipedia.org/wiki/Maastoren): 164,75 m, mast tot 177,7 m, 44 lagen, twee hoofddelen van 165 en 105 m, parkeerlagen 3 tot 11, glazen kroon, lage glazen uitbouw.
- Commons, alleen als visuele referentie:
  - [Bovenkant van Maastoren](https://commons.wikimedia.org/wiki/File:Bovenkant_van_Maastoren.jpg) (kroon, schacht met frame en mast)
  - [Maastoren 2012](https://commons.wikimedia.org/wiki/File:Maastoren_2012.jpg) en [Rotterdam toren maastoren](https://commons.wikimedia.org/wiki/File:Rotterdam_toren_maastoren.jpg) (zuidwestkant: schijf, schacht, AKD-toren, luifel)
  - [Maastoren IMG 5117](https://commons.wikimedia.org/wiki/File:Maastoren_IMG_5117.jpg) (noordwestgevels, tussenlid, liften, parkeerroosters)
  - [Maastoren entrance](https://commons.wikimedia.org/wiki/File:Maastoren_entrance.jpg) (entree en luifel)
  - [Rotterdam (NL), Maastoren 2023](https://commons.wikimedia.org/wiki/File:Rotterdam_(NL),_Maastoren_--_2023_--_0105.jpg) (vanaf de rivier)
  - [De Maastoren in Rotterdam in 2021](https://commons.wikimedia.org/wiki/File:De_Maastoren_in_Rotterdam_in_2021.jpg)
  - [Maastoren Rotterdam](https://commons.wikimedia.org/wiki/File:Maastoren_Rotterdam.jpg)
