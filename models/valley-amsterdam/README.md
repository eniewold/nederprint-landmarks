# Valley (Amsterdam)

Woon- en kantoorcomplex aan de Beethovenstraat op de Zuidas (MVRDV, opgeleverd 2021/2022): drie torens op een gezamenlijke onderbouw met parkeergarage. De buitenkant is een gladde glazen kantoorgevel, de binnenkant (de "vallei") een rotsachtige berg van natuurstenen bakken die per verdieping verspringen en uitkragen, met terrassen en beplanting. Het model bestaat uit terrasvlakken als veelhoekige prisma's op het verdiepingsraster, gevelreliëf als nissen en kragen, trappen en dakinstallaties, in een eigen gebouwstelsel en zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-zalmhaven.mjs` (nieuwbouw uit AHN5) en `generate-haagse-toren.mjs`. Reproductie: `node scripts/generate-valley-amsterdam.mjs`.

De torens heten hier naar hun ligging:

- **Noordtoren**: 100 m, tegen de oostgevel aan de noordkant.
- **Zuidtoren**: 80 m, aan de zuidkant.
- **Westtoren**: 67 m, aan de Beethovenstraat tussen de twee andere.

## Bestanden en plaatsing

- `valley-amsterdam.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 264, één deel, 103.906 driehoeken).
- `valley-amsterdam.json`: catalogusitem.
  - RD-oorsprong `[120262.5, 483407.0]`, midden in de bovengrondse voetafdruk.
  - `xAxis` −0,3°: langs de rechte noord- en zuidgevel van het BAG-pand. +Y wijst naar het noorden.
  - De Beethovenstraat ligt aan −X, de sloot langs de sportvelden van AFC aan +X.
- `valley-amsterdam-1-1000.stl`: millimeters, Z omhoog, 44,6 × 139,4 × 105,2 mm, vlakke voet.

z = 0 ligt op NAP −0,7 m, op de straten en paden rondom (AHN5-DTM −0,5 tot −0,95). De voet loopt door tot −1,2 m (NAP −1,9). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de Beethovenstraat en het pad langs de zuidgevel (AHN5-DTM −0,5 tot −0,7): `[−31,55] [−31,30] [−31,0] [0,−75] [15,−75]`. De lagere hoek bij de schuine zuidwestgevel (−0,9) is bewust niet gebruikt.

Het model vervangt BAG-pand `0363100012250045` (2021). De BAG-contour omvat ook de ondergrondse garage: aan de oost- en westkant ligt hij 3,5 tot 4,5 m buiten de bovengrondse gevels. De 3D BAG trekt die strook op als een schuin vlak van −6 tot +32 m langs de oostgevel. Het model volgt de gevels zoals het AHN5 en de luchtfoto ze tonen:

- oostgevel op u = 21,85 (BAG-noord- en zuiddeel);
- westgevel op u = −22,75;
- noordgevel, zuidgevel en de schuine zuidwestgevel volgens BAG.

Het ABN AMRO-hoofdkantoor aan de overkant van de Beethovenstraat, The Rock en het WTC zijn aparte gebouwen. De nieuwbouw ten zuiden (BAG 2017–2020) raakt het model niet.

## Hoogtebron: AHN5, niet het PDOK-AHN

Het AHN op PDOK (AHN4) toont Valley nog in aanbouw: torens tot circa NAP +70 m, bouwkranen tot +112 m. Alle hoogtes en terrasvlakken komen daarom uit AHN5 (opname 2023), DSM/DTM 0,5 m via de ImageServer `Hoogtebestand/AHN5_DSM_50cm` van ahn.arcgisonline.nl, per 0,25 m in het gebouwstelsel uitgelezen. De 3D BAG (LoD2.2, gebaseerd op dezelfde AHN5-opname, `b3_pw_bron` ahn5 2023) diende als controle. Uit de 3D BAG komen ook de hellende vlakken van de trappen.

## Opbouw

### Verdiepingsraster

Het histogram van het AHN5 binnen de voetafdruk heeft scherpe pieken: de terrasvloeren en 0,8 m daarboven de plantenbakken en borstweringen. Daaruit volgt het raster:

- kantoorlagen per 3,8 m: +6,2, +10,0, +13,8, +17,6, +21,4, +25,2, +29,0, +32,8;
- woonlagen per 3,3 m: +36,2, +39,4, +42,8, +46,0, +49,4, +52,6, +56,0, +59,2, +62,6, +66,0, +69,2, +72,4, +75,8, +79,4, +82,3, +85,6, +88,8;
- daken:
  - Westtoren +66,0 met een verhoogd deel van +67,2;
  - Zuidtoren +79,4 met een dakopbouw van +82,3;
  - Noordtoren: oostelijke trede +93,0, hoofddak +99,4, dakopbouw +100,8.

### Terrassen

Per niveau is er één veelhoek: de vloer die op die hoogte ligt, met alles wat hoger ligt erbinnen. Elk terras is een prisma van het niveau eronder tot zijn eigen vloer. In totaal zijn het 86 vlakken, als tabel `valleyData()` onderaan het script, per niveau en per toren of vallei.

Ze zijn zo afgeleid uit het AHN5:

1. Per niveau de cellen boven de vloer min 0,6 m.
2. Gaten en uitsteeksels kleiner dan 2 m weggefilterd (sluiten en openen met ronde hoeken). Daarmee vallen ook de meeste bomen en struiken weg.
3. Vereenvoudigd tot facetten op 0,5 m, zodat de randen schuine, rotsachtige facetten worden en geen pixeltrap.
4. Bij de gevels op de voetafdruk getrokken.
5. Genest van boven naar beneden.
6. Treden smaller dan 0,9 m opgeheven.

Er is geen DSM per meter gestapeld: elke trede is een echte verdiepingsvloer van het gebouw.

### Gevels

Elke wand van een terras staat bloot tussen de vloer eronder en zijn eigen vloer. Per wand bepaalt het model of die glas of natuursteen is. Zo'n wand wordt eerst per 0,5 m bemonsterd en dan in stukken glas en natuursteen verdeeld.

- **Glas** (de gladde buitenhuid):
  - wanden van de Noord- en Zuidtoren die van de vallei af kijken en minstens twee verdiepingen recht doorlopen;
  - de buitengevel van de onderbouw;
  - de begane grond;
  - de Westtoren onder +17,5;
  - het grote glasvlak met loggia's midden in de westgevel van de Westtoren, tot +52,6 (foto vanaf de Beethovenstraat).

  Per verdieping een glasband tussen borstweringen van 0,7 m, stijlen per 3,0 m, nissen van 0,3 m.
- **Natuursteen**:
  - alles wat naar de vallei kijkt;
  - wat per verdieping terugspringt (de cascade van bakken langs de randen);
  - de kronen van de Noordtoren (boven +88,8) en de Zuidtoren (boven +72,4);
  - de Westtoren boven de onderbouw.

  Per verdieping:
  - een naad op de vloer;
  - op 60 % van de verdiepingen een terugliggend stuk van 40 tot 90 % van de wand, 1,8 m diep onder een kraag van 45 graden: de bak erboven kraagt uit. Waar de vloer smal is, is het 0,8 m diep;
  - daarnaast bakken met grote vensters (nissen van 0,35 m).

  Welk stuk terugligt, verschilt per verdieping en wand. Dat is vast bepaald (deterministisch), dus bij elke run gelijk.
- **Plantenbakken en borstweringen**: 0,9 m breed en 0,9 m hoog langs elke open terrasrand, niet waar de wand van het niveau erboven staat.

### Trappen

De openbare route door de vallei bestaat uit 13 hellende vlakken uit de 3D BAG, als treden van circa 0,9 m. Daarbij hoort de buitentrap aan de Beethovenstraat van de straat naar het terras op +6,2.

### Dakinstallaties

Gevelonderhoudsinstallaties, elk een mast en een geparkeerde arm van 1 m breed op het dak:

- **Noordtoren**: mast tot +103,3 (AHN5 +103 op u 18, v 67), arm tot +101,6.
- **Westtoren**: arm tot +69,4 langs u = −8 (AHN5 +69 tot +70).
- **Zuidtoren**: mast tot +83,6, arm tot +83,0.

## Geschat en weggelaten

Geschat:

- **De bakken en vensters op de natuurstenen wanden**. Ze zijn niet per bak gemeten, want het AHN ziet alleen de bovenkant van de bovenste bak. Ritme, diepte en vensterbreedte komen uit foto's van alle kanten. De echte uitkragingen hebben een vlakke onderkant; hier zijn het kragen van 45 graden, zodat het model zonder steun printbaar is.
- **Glasbanden en stijlen** op de glazen gevels, uit foto's.
- **De grens tussen glas en natuursteen** per toren, uit foto's.
- **De terrasvlakken zelf**: uit het AHN5 gefilterd en vereenvoudigd tot facetten. Kleine bakken en terrasjes onder 2 m vallen weg of gaan op in hun buur.
- **Gevelonderhoudsinstallaties**: maten van mast en arm. Alleen de toppen staan in het AHN5.

Weggelaten:

- **Groen**: bomen, struiken en beplanting op de terrassen en in de vallei. Volgens de opdracht weggelaten; ook uit het AHN gefilterd waar ze kleiner dan 2 m waren.
- **Glazen balustrades** op de plantenbakken en dunne leuningen: dunner dan 0,9 m.
- **De uitkragende arm van de Noordtoren voorbij de dakrand** (AHN5 +101 boven de trede op +93): een vrije arm van 1 m zou in de export een dichte wig worden. De arm stopt op het dak.
- **Interne holtes**: 40 nissen die achter een plantenbak of trap dichtvallen, worden opgevuld, plus twee splinters van samen 0,07 m³ bij de Westtoren.

Wikipedia noemt 100, 66 en 76 m. Volgens het AHN5 is de Zuidtoren hoger: dak 80,1 m boven de straat, dakopbouw 83 m. Het model volgt het AHN5.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 264, 250.384 m³. De 3D BAG LoD2.2 heeft 252.477 m³; die telt de garagestrook langs de oostgevel mee. De ondervlakken zijn de bovenkanten van de glasnissen en de kragen.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 365 geslaagd. De eigen test controleert:
  - catalogus en vervangen pand;
  - voet, bovengrondse voetafdruk en de mast van de Noordtoren;
  - de daken van alle drie de torens;
  - 23 terrasniveaus met plantenbakken;
  - de kragen van de bakken;
  - de glasbanden op de oostgevel van de Noordtoren;
  - de buitentrap en een valleitrap.
- **Printcheck** op 1:1000 bij 45°: 0,22 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[120200,483310,120320,483510]`. Duur 35,6 s, 133 objecten, 342.120 driehoeken, drie vellen. Het model staat compleet in de 3MF en op het terrein.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, plus foto-hoeken vanaf de Beethovenstraat (275°) en de sportvelden (60°). De 3D BAG heeft de juiste massa's, maar verticale rafelige wanden zonder verdiepingen, het schuine garagevlak langs de oostgevel en geen trappen, bakken of dakinstallaties. Het model heeft per kant meer:
  - **Noordwest (−35°)**: de glazen noordgevel met verdiepingsbanden en stijlen, de cascade van stenen bakken langs de noordwesthoek, de getrapte vallei met plantenbakken en de stenen kroon van de Noordtoren.
  - **Noordoost (55°)**: de glazen oostgevels van de Noord- en Zuidtoren en de onderbouw, de terugspringende stenen bakken naar de vallei en de dakopbouwen met gevelonderhoudsinstallaties.
  - **Zuidoost (145°)**: de glazen zuidgevel, de stenen kroon en de cascade van de Zuidtoren, en de terrassen in de vallei met trappen.
  - **Zuidwest (235°)**: de vallei vanaf de Beethovenstraat met de verspringende bakken op elke verdieping, de Westtoren met zijn glasvlak, de buitentrap en de trappen naar de terrassen.
- **Bovenaanzicht**: het model ligt binnen de 3D BAG-voetafdruk. Die is aan oost- en westkant breder door de garage.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.33749/4.87752/350/1x1/0)): de drie torens liggen op de PDOK-reconstructie van het pand en de getrapte vallei met de glazen buitengevels is zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (ruwe verticale wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0363100012250045` en Actueel_orthoHR; AHN4 (WCS, ter vergelijking); 11 oktober 2026.
- AHN5 DSM/DTM 0,5 m (opname 2023) via ahn.arcgisonline.nl, `Hoogtebestand/AHN5_DSM_50cm` en `AHN5_DTM_50cm`.
- [3D BAG, pand 0363100012250045](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012250045) (TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes ter controle en de hellende vlakken van de 13 trappen.
- [Wikipedia: Valley (Amsterdam)](https://nl.wikipedia.org/wiki/Valley_(Amsterdam)): MVRDV, drie torens van 100, 66 en 76 m, de vallei van terrassen, natuursteen en de glazen gevel met loggia's aan de Beethovenstraat.
- Commons, alleen als visuele referentie:
  - [2022 Valley, Amsterdam-Zuidas (02)](https://commons.wikimedia.org/wiki/File:2022_Valley,_Amsterdam-Zuidas_(02).jpg) (Noordtoren en vallei vanaf de Beethovenstraat)
  - [2022 Valley, Amsterdam-Zuidas (03)](https://commons.wikimedia.org/wiki/File:2022_Valley,_Amsterdam-Zuidas_(03).jpg) (drie torens vanuit het westen)
  - [2022 Valley, Amsterdam-Zuidas (06)](https://commons.wikimedia.org/wiki/File:2022_Valley,_Amsterdam-Zuidas_(06).jpg) (glazen gevel met stenen kroon)
  - [2022 Valley, Amsterdam-Zuidas (11)](https://commons.wikimedia.org/wiki/File:2022_Valley,_Amsterdam-Zuidas_(11).jpg) (drie torens vanaf de sportvelden in het oosten)
  - [Valley Noordtoren Amsterdam-Zuid](https://commons.wikimedia.org/wiki/File:Valley_Noordtoren_Amsterdam-Zuid.jpg) (glas en cascade van bakken)
  - [AmsterdamZuidAsDeValley](https://commons.wikimedia.org/wiki/File:AmsterdamZuidAsDeValley.jpeg) (bakken en vensters van dichtbij)
  - [AmsterdamZuidAsDeValley 11 48 53 857000](https://commons.wikimedia.org/wiki/File:AmsterdamZuidAsDeValley_11_48_53_857000.jpeg)
  - [Valley Amsterdam 22](https://commons.wikimedia.org/wiki/File:Valley_Amsterdam_22.jpg) (buitentrap aan de Beethovenstraat, bouwtijd)
