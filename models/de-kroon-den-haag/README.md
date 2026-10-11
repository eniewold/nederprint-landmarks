# De Kroon (Den Haag)

Woontoren van 131,5 m aan het Lage Zand en de Turfmarkt in het Wijnhavenkwartier (Rapp+Rapp, 2011), naast de twee torens van JuBi. Eén BAG-pand omvat het hele bouwblok: een onderbouw van acht lagen met een glazen binnenhof, een lage vleugel, een brede schijf en de toren met zijn drie "kronen" per lange gevel. Het model bestaat uit benoemde prisma's, trappen, een zaagtand en lamellenwanden in een eigen gebouwstelsel, zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-castalia.mjs` en `generate-hoftoren.mjs`. Reproductie: `node scripts/generate-de-kroon-den-haag.mjs`.

## Bestanden en plaatsing

- `de-kroon-den-haag.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 45.236 driehoeken).
- `de-kroon-den-haag.json`: catalogusitem.
  - RD-oorsprong `[81919.85, 455016.24]`: midden onder de toren.
  - `xAxis` −52,6°: langs de zuidwestgevel van de BAG-contour; de gevels van toren, schijf en erkers in het AHN lopen langs dezelfde assen.
  - +X loopt langs de lange gevels naar het zuidoosten. +Y wijst naar het noordoosten, naar de binnenhof en JuBi. −Y is de zuidwestgevel aan het Lage Zand.
- `de-kroon-den-haag-1-1000.stl`: millimeters, Z omhoog, 71,8 × 47,3 × 132,4 mm, vlakke voet.

z = 0 ligt op NAP +0,75 m: de straten rondom zijn vlak (AHN-DTM +0,65 tot +0,81). De voet loopt door tot −1,2 m. `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de straten aan de zuidwest-, noordwest- en zuidoostkant: `[−30,−13] [0,−13] [20,−13] [−49,12] [28,25]`.

Het model vervangt alleen BAG `0518100000299585` (bouwjaar 2011). Dat pand is het hele blok van 72 × 47 m: onderbouw, vleugel, schijf en toren. Wat er níet bij hoort:

- JuBi (`0518100001635181`, 2012) grenst aan de noordoostkant met een schijf tot NAP +42 en twee torens tot +146. De noordoostgevel van de onderbouw is daarom een blinde scheidingsmuur.
- De Hoftoren en Castalia (eigen landmarks) liggen 160 tot 220 m noordelijker; het model overlapt ze niet.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Onderbouw, vleugel en schijf

- **Onderbouw** op de BAG-contour tot +24,3 (3D BAG 24,33), met een hoge winkelpui op de begane grond.
- **Glazen kap van de binnenhof**: 14 × 12 m, 0,6 m verdiept. Het AHN heeft daar geen punten (glas), de 3D BAG zet het dak op +24–25.
- **Opbouwen op de onderbouw**: twee hogere stroken tot +27,7 en twee installatieblokken tot +25,05 en +25,4 (3D BAG).
- **Noordwestvleugel** naast de toren: 11,8 m breed, tot +36,15, met een opbouw tot +37,3.
- **Schijf** onder de toren: 40,5 m lang, van de kopgevel van de vleugel tot de zuidoostrand van het pand, tot +54,1. Aan de zuidoostkant blijft een strook van 5,5 m op +54,1 vrij naast de toren.

### Toren

- **Romp**: 35,0 × 20,9 m boven de schijf. De kopgevels liggen op de AHN-rand, de lange gevels op de gevels van de schijf.
- **Erkers**: drie per lange gevel, op x = −11,5, 0 en 11,5 (AHN: −11,9 / −0,4 / 11,1 en −10,9 / −1,4 / 10,6). Ze hebben een voorkant van 3,1 m (twee ramen) en schuine zijkanten van 45° (één raam).
- **Trappen**: de vakken tussen en naast de erkers springen in drie trappen terug.
  - Vanaf +54,1: 0,6 m.
  - Vanaf +87,13: 1,2 m.
  - Vanaf +105,13: 1,8 m.
  - Het AHN toont richels op +54, op +85 tot +90 en op +93 tot +106, 0,7, 1,4 en 2,0 m achter de gevel. De trappen liggen hier op een vloer.
  - Daardoor steken de erkers naar boven steeds verder uit, en schuiven hun binnenhoeken bij elke trap op, zoals de knikken op de foto's.
- **Bovenste laag**: van het terras op +123,13 tot het dak op +126,06 (3D BAG). Ze volgt een zaagtand: van elke erkervoorkant lopen twee schuine wanden terug naar een inkeping midden tussen twee erkers.
  - De inkepingen zijn 6,0 m diep aan de zuidwestkant (3D BAG 5,3 m, AHN-lamellen tot 7,9 m) en 4,3 m aan de noordoostkant.
  - De koppen van de bovenste laag staan 1,4 m terug.
  - De driehoeken ervoor zijn terrassen op +123,13.
- **Kronen**: 1,2 m dikke lamellenwanden op alle randen van de zaagtand, drie per lange gevel.
  - De bovenkant loopt van +126,6 in de inkeping naar +130,2 op de erkerhoek en tot +132,0 in het midden van de erkervoorkant (3D BAG-nok 132,0; Wikipedia 131,5 m boven maaiveld).
  - Verticale groeven van 0,3 m in de buitenkant laten de wanden als losse stijlen met een getande bovenrand lezen.
- **Installatiestrook** op het dak: 32 × 3,9 m tot +129,07 (3D BAG 129,07, AHN 128–130).

### Gevelreliëf

41 lagen: een hoge begane grond tot +6,13 en 40 lagen van 3,0 m tot de vloer van de bovenste laag op +123,13. Zo vallen de daken op +24,3, +36,15 en +54,1 en de trappen telkens in een borstwering.

- **Toren**: ramen van 1,0 × 1,9 m op 1,55 m als nissen van 0,35 m in elk gevelvlak van elke trap: erkervoorkant, schuine zijkanten, vakken en kopgevels. De stijlen ertussen blijven als lisenen staan. De bovenste laag heeft één rij ramen in de zaagtand.
- **Schijf en vleugel**: ramen van 1,3 × 1,9 m op 1,9 m. Aan de straatkanten lopen ze vanaf de begane grond door, boven de onderbouw en de vleugel alleen waar de gevel vrij ligt.
- **Onderbouw**: één venster van 1,5 m per 2,7 m per laag, en winkelpuien van +1,05 tot +5,3. Er zijn geen ramen in de scheidingsmuur met JuBi.

## Geschat en weggelaten

Geschat:

- **Trappen**: de dieptes (0,6 / 1,2 / 1,8 m) en de hoogtes (+87,13 / +105,13) zijn afgerond uit AHN-richels op pixels van 0,5 m en uit de knikken op de foto's. De erkerzijkanten staan op 45°.
- **Erkerbreedte en vensterritme**: twee ramen voor, één per zijkant en vakken op 1,55 m. Geteld op frontale foto's van de lange gevel. De verdiepingshoogte van 3,0 m volgt uit 41 lagen tussen de begane grond en het terras.
- **Kronen**: werkelijk losse natuurstenen stijlen met open tussenruimtes en V-vormige schoren. Ze zijn hier gesloten wanden van 1,2 m met groeven, zodat ze op 1:1000 printbaar zijn. De Λ-vorm komt uit foto's, de top uit de 3D BAG.
- **Zaagtand aan de noordoostkant**: het AHN geeft 3,1 m inkeping. Die is verdiept tot 4,3 m, zodat de schuine wanden minstens 45° maken en de bovenste laag niet over de trap eronder hangt.
- **Glazen kap van de binnenhof** als 0,6 m verdiept vlak: het AHN ziet het glas niet.

Weggelaten:

- **Balkonhekjes, terrasrelingen, kozijnen en de horizontale banden** tussen de lagen: kleiner dan 0,9 m.
- **V-schoren en open tussenruimtes in de kronen**: kleiner dan 0,9 m, en vrije stijlen zouden op 1:1000 niet printbaar zijn.
- **Entrees en luifels**: de entrees liggen in de winkelpui. Op de foto's is geen luifel van ≥ 0,9 m te zien.
- **Daken van de onderbouw zonder opbouwen**: de onderbouw is plat gemaakt, op de vier opbouwen uit de 3D BAG na.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 159.985 m³, 2.759 nissen. De ondervlakken zijn alleen de bovenkanten van de nissen.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 380 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet, top en uitersten;
  - de daken van onderbouw, stroken, vleugel, schijf, terras, bovenste laag en installatiestrook;
  - de drie trappen naast alle zes erkers;
  - de zes kroontoppen op +132,0 en de erkerhoeken op +130,2;
  - de vier inkepingen van de zaagtand;
  - de vensterrijen in de middelste erker van de schijf tot de bovenste laag.
- **Printcheck** op 1:1000 bij 45°: 0,07 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[81860,454965,81990,455095]`, 130 × 130 mm. Duur 6,0 s, 120 objecten, 124.024 driehoeken, vier vellen, modelhoogte 154,3 mm (met JuBi). Het model staat op het terrein, de buurpanden staan op hun plek.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, en schuin op 200°, 260°, 20° en 80°. De 3D BAG heeft de juiste massa met de erkers als vlakke stroken, maar zonder trappen, kronen, ramen en vleugelopbouwen; het dak is rafelig. Het model heeft per kant meer:
  - **Zuidwest (235°, 200°)**, de straatgevel aan het Lage Zand:
    - drie erkers met drie trappen ernaast;
    - de zaagtand met terrassen;
    - drie kronen met lamellen;
    - vensterrijen over de hele hoogte;
    - de vleugel en de onderbouw met winkelpui.
  - **Noordoost (55°, 20°)**: de drie erkers en kronen aan de hofzijde, de schijf boven de onderbouw met ramen, de glazen kap van de binnenhof en de opbouwen op de onderbouw.
  - **Zuidoost (145°)**: de kopgevel met vensterrijen, de vrije strook van de schijf op +54,1 en de profielen van de trappen en kronen.
  - **Noordwest (−35°, 260°)**: de getrapte opbouw van onderbouw, vleugel en schijf naar de toren, de ramen van de onderbouw aan de Turfmarkt en de kopgevel van de bovenste laag met terras.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.07859/4.32112/350/1x1/0)): toren en onderbouw liggen op de PDOK-reconstructie van het pand, met de kronen, trappen en vensterrijen zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-blok (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0518100000299585`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000299585), CC BY 4.0: dakhoogtes (24,33 / 27,7 / 36,15 / 54,1 / 123,13 / 126,06 / 129,07), nok 132,0 en de zaagtand van de bovenste laag.
- [Wikipedia: De Kroon (The Hague)](https://en.wikipedia.org/wiki/De_Kroon_(The_Hague)): 131,5 m, 41 lagen, Rapp+Rapp, 2008–2011.
- Commons, alleen als visuele referentie:
  - [Den Haag – De Kroon](https://commons.wikimedia.org/wiki/File:Den_Haag_-_De_Kroon_(24952721807).jpg) (kronen en erkers frontaal)
  - [De Kroon The Hague 2019](https://commons.wikimedia.org/wiki/File:De_Kroon_The_Hague_2019.jpg) (schijf en toren)
  - [Kantoorgebouwen aan de Turfmarkt vanaf de Nieuwe Haven](https://commons.wikimedia.org/wiki/File:Den_Haag,_de_kantoorgebouwen_aan_de_Turfmarkt_vanaf_de_Nieuwe_Haven_101IMG_8919_2019-03-24_15.35.jpg) (zuidwestgevel met trappen en kronen)
  - [Woontoren De Kroon in het Haagse Wijnhavenkwartier](https://commons.wikimedia.org/wiki/File:Woontoren_De_Kroon_in_het_Haagse_Wijnhavenkwartier.jpg) (getrapte opbouw)
  - [De Kroon – Den Haag](https://commons.wikimedia.org/wiki/File:De_Kroon_-_Den_Haag.JPG) (kronen in de skyline)
  - [TheHague-LE-part-deux](https://commons.wikimedia.org/wiki/File:TheHague-LE-part-deux_(8044146720).jpg) (schijf frontaal)
  - [Uilebomen (36)](https://commons.wikimedia.org/wiki/File:Uilebomen,_Den_Haag,_Netherlands_-_panoramio_(36).jpg) (onderbouw aan de Turfmarkt)
  - [BZK, J&V and De Kroon](https://commons.wikimedia.org/wiki/File:Den_Haag_-_BZK,_J%26V_and_De_Kroon_(24951610687).jpg) (onderbouw en toren vanaf de hoek)
