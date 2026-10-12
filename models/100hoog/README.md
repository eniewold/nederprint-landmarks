# 100Hoog (Rotterdam)

Woontoren aan de Wijnhaven, op de hoek van de Posthoornstraat en de Wijnstraat, ontworpen door Klunder Architecten en geopend in 2013 (aannemer BAM). De toren is 105,5 m hoog en telt 33 lagen met 152 koopappartementen. In de onderbouw zitten een parkeergarage en tien winkels en horecazaken.

Het hele complex is één BAG-pand van 84,6 × 42,6 m. De toren (30 × 24 m) staat aan de westkant. Zijn west-, noord- en oostgevel zijn van baksteen met verspringende vensters; de zuidgevel naar de Wijnhaven heeft een wit raster van vloerbanden en kolommen met loggia's en glas. Langs de kade ligt een lager blok met winkels, twee parkeerlagen achter baksteen, vier woonlagen in hetzelfde witte raster en een teruggelegen bovenste laag onder uitkragende bruine dakplaten. Daarachter ligt de parkeergarage met een dakhof.

Het model bestaat uit benoemde prisma's en vlakken in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden: `generate-evoluon.mjs` (aanpak primitieven), `generate-vestedatoren.mjs` en `generate-westpoint-tilburg.mjs` (woontorens met gevelnissen op `efteling-kit.mjs`). Reproductie: `node scripts/generate-100hoog.mjs`.

## Bestanden en plaatsing

- `100hoog.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 0, 9.842 driehoeken).
- `100hoog.json`: catalogusitem.
  - RD-oorsprong `[92951.41, 436966.04]`: het hart van de toren.
  - `xAxis` 17,83°: langs de Wijnhaven (oost). +Y wijst naar de Wijnstraat (noord); de Posthoornstraat ligt aan −X.
- `100hoog-1-1000.stl`: millimeters, Z omhoog, 84,7 × 43,9 × 106,2 mm, vlakke voet.

Het script bouwt in een stelsel (u, v) vanaf de zuidwesthoek van het BAG-pand (RD 92946,32, 436932,89) en verschuift het model aan het eind naar het hart van de toren (u 15, v 30).

z = 0 ligt op NAP +3,3 m, het niveau van de Posthoornstraat en de Wijnstraat (AHN4-DTM +3,3 tot +3,4). De onderkant ligt op −1,0 (NAP +2,3), onder de kade aan de Wijnhaven (+2,45 tot +3,2, aflopend naar het oosten). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op de Posthoornstraat en de Wijnstraat (`[−18,−20] [−18,0] [0,14] [25,14]`). PDOK geeft daar 46,84 tot 46,94 (ellipsoïdisch). De lagere kade (46,0 tot 46,7) blijft erbuiten.
- `groundHeight` 46,85 is de PDOK-terreinhoogte op die punten (gemeten op 12 oktober 2026 in de terreintegel). PDOK-maaiveld is hier ongeveer NAP + 43,55 m.

Het model vervangt BAG-pand `0599100100004790` (bouwjaar 2013). PDOK reconstrueert het als een gladde toren tot +105,8 met één opbouw, een blok aan de kade tot +28,6 met inkepingen en de dekken van de garage. De buurpanden binnen 15 m blijven PDOK: `0599100000690598` (tegen de garage aan de oostkant, PDOK tot +27,9, AHN5 99e percentiel +27,9) en woontoren The Muse (`0599100100015965`, PDOK +77,6, AHN5 +77,6), die een eigen backlogrij heeft.

## Onderdelen (hoogtes NAP)

### Toren

- **Plattegrond** u 0..30, v 17,7..42,6, met een noordgevel die volgens het BAG 2,6° schuin loopt. Boven de onderbouw (+25,5) bestaat hij uit:
  - het **hoofdvolume** (u 5,4..24,5) tot het dak op **+105,8** (AHN5 105,7 tot 105,9);
  - het **oostblok** (u 24,5..30, v 20,5..35,5) tot +105,8, het zuidelijke deel tot **+106,4**;
  - de **voorste zuidgevel** (v 17,7, 2,8 m vóór de rest) en een **weststrook** van 2,5 m, beide tot **+96,5**: de toren springt drie lagen onder het dak terug;
  - daarachter een terras op **+99,2** langs de westgevel en het zuidwestdak op **+105,3**.
- **Borstweringen** van 0,6 m rond hoofdvolume en oostblok tot **+106,45** (AHN5 106,3 tot 106,6). **Installatieopbouw** van 8,5 × 6 m tot **+108,5**.
- **Inkepingen**: op de noordwest- (5,4 × 2,1 m) en noordoosthoek (5,5 × 6,9 m) is de toren boven de onderbouw open. AHN5 en PDOK zien daar +25,5.
- **Gevels**, 23 lagen van 3,09 m van +25,5 tot +96,5 en drie lagen daarboven:
  - zuid, voorste deel: wit raster met kolommen van 0,9 m en vloerbanden van 0,9 m, per laag loggia's van 1,2 m in de buitenste traveeën en glas van 0,4 m in de middelste;
  - zuid, achterste deel (u 19,5..30): een loggia en een glasvlak per laag, ook in de vier lagen tussen de dakhof en de onderbouw; de bovenste lagen boven de trap glas;
  - west, noord en oost: baksteen met vensters van 2,2 tot 2,4 m breed en 1,6 m hoog als nissen van 0,35 m, per laag verspringend; op de noordgevel twee vensterbanden per laag en bovenin de glazen hoek;
  - **hoekloggia's**: per laag een hoek van 2,4 × 2,3 m uitgespaard, op de noordoosthoek van het oostblok tot **+90,3** en op de noordwesthoek van de weststrook tot **+71,8**.

### Onderbouw van de toren

- Baksteen tot **+25,5** (AHN5 25,4 tot 25,7) over de westkant van het pand, met:
  - glaspuien van de winkels op de begane grond (tot +7,3);
  - twee parkeerlagen en vier woonlagen met vensterbanden van 0,35 m;
  - een dubbelhoge **hoekloggia** op de zuidwesthoek aan de Wijnhaven (+16,9 tot +22,6);
  - een **open hoek** aan de Wijnstraat (buiten het BAG-pand) tot +10,85, met de onderbouw erboven.
- Aan de noordkant (u 17..28,5) een **balkonzone** van 1,2 m voor de gevel tot **+22,8** (AHN5 22,3 tot 23,8), met per laag een balkon als nis van 0,6 m.

### Blok aan de kade

- u 9..84,6, v 0..15,3 (het oosteinde tot v 20). Winkels op de begane grond met glaspuien van 0,4 m tussen penanten om de 8,4 m, twee parkeerlagen met een donkere sleuf, en vier woonlagen van 2,9 m van de dakhof (+13,9) tot +25,5.
- **Wit raster**: kolommen van 0,6 m om de 8,39 m; per laag en travee afwisselend een loggia van 1,2 m en glas van 0,4 m.
- **Bovenste laag** van +25,5 tot +27,9, 0,4 m terug, onder **dakplaten** van 0,7 m tot **+28,6** (AHN5 28,5 tot 28,7) die 1,0 m uitkragen.
- **Dakterrassen** op +25,5 (AHN5) aan de kade bij u 9..17,5, 30..37,5, 50..57,5 en 70..75: daar ligt de bovenste laag 4,0 m terug.
- **Opbouw** aan de oostkant tot **+30,4** (AHN5 30,3; PDOK 30,4).
- Hofgevel en oostgevel met glas of vensters als nis per woonlaag.

### Parkeergarage

- BAG-voetafdruk tot de **dakhof op +13,9** (AHN5 13,4 tot 14,0) tussen het blok en de toren en oostelijk van de toren.
- **Dek op +16,5** (AHN5 16,5 tot 16,6) aan de Wijnstraat (u 30..50,3), met een pui en sleuven per parkeerlaag in de noordgevel.

## Geschat en weggelaten

- **Lagen**: 23 torenlagen van 3,09 m tussen de onderbouw en de trap op +96,5 en drie lagen daarboven, samen met de acht lagen van de onderbouw de 33 lagen uit Wikipedia. De winkellaag tot +7,8, de twee parkeerlagen en de vier woonlagen van 2,9 m in het blok komen uit foto's.
- **Wit raster**: kolommen en vloerbanden van 0,6 tot 0,9 m, loggia's van 1,2 m en glas van 0,4 m. In het echt zijn ze slanker en wisselt het per travee.
- **Vensters** in de bakstenen gevels: aantal, maat en het verspringende patroon zijn geschat uit foto's.
- **Hoekloggia's**: AHN4 ziet in de noordoostinkeping platen tot +91,8 à +92,5, maar het AHN5 en de PDOK-tegel zien daar alleen de onderbouw (+25,5). Het model zet de loggia's daarom in de hoek van het oostblok, met de bovenste tot +90,3, en laat de inkeping zelf open. De hoogte van de bovenste noordwestloggia (+71,8) komt uit foto's.
- **Open hoek aan de Wijnstraat**: het BAG-pand laat de noordwesthoek op de grond weg, het AHN5 ziet er +25,5. De hoogte van de doorgang (+10,85) is geschat.
- **Balkonzone aan de noordkant** en de dakplaten van het blok (0,7 m dik, 1,0 m uitkragend): diepte en dikte uit het AHN5 en foto's.
- **Weggelaten**:
  - de bomen op de dakhof en langs de kade (vegetatie, geen deel van het pand);
  - de gevelonderhoudsinstallatie (rails en arm) op het dak, de glazen balkonhekken en de witte stijlen tussen de ramen: dunner dan 0,9 m;
  - de kolommen onder de zuidoosthoek van de toren op de dakhof (kleiner dan 0,9 m, niet goed te zien).

## Controle

- `node scripts/generate-100hoog.mjs` geeft een gesloten, verbonden model. Twee keer draaien geeft byte-identieke bestanden.
- In `tests/landmark-models.test.ts` van de webshop staat de test "places 100Hoog with the brick tower and its white loggia raster, …". Die controleert:
  - de oorsprong, het BAG-pand, de maaiveldhoogte en de BAG-voetafdruk;
  - de borstwering op de hoeken van het hoofdvolume, het dak, het oostdeel en de installaties;
  - de trappen op +96,5, +99,2 en +105,3;
  - dat de inkepingen boven de onderbouw open zijn, en de bovenste hoekloggia's;
  - de loggia's in het witte raster en de vensters in de westgevel;
  - de dakplaten, terrassen en opbouw van het blok, de winkelpuien en beide garagedekken.
- **Printcontrole op 1:1000** (`supportedSolid`, 45°): 109.190 → 109.864 mm³, dat is +0,62 %. De export vult onder de plafonds van de loggia's en balkons (tot +68 mm² per doorsnede) en onder de dakplaten van het blok; de nissen blijven zichtbaar.
- **Renders**: van vier kanten naast de PDOK-reconstructie en tegen Commons-foto's vergeleken. Die renders horen niet in deze repo.

## Bronnen

- PDOK: BAG-pand 0599100100004790, Actueel_orthoHR, gebouwtegels en terrein (12 oktober 2026).
- AHN5 DSM 0,5 m (opname 2023), `ahn.arcgisonline.nl` Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM en DTM 0,5 m (PDOK WCS).
- https://nl.wikipedia.org/wiki/100Hoog
- Wikimedia Commons:
  - `100hoog.jpg`
  - `100HoogRotterdam.jpg`
  - `Rotterdam_-_100_Hoog_(26954136536).jpg`
  - `Pijp_-_Glashaven_Rotterdam_(36352765903).jpg`
  - `Woontoren_The_Muse_aan_de_Wijnhaven_met_op_de_voorgrond_de_Grote_Wijnbrug,_rechts_de_Zwartehondstraat_en_de_Wijnstraat_2019.jpg`
  - `100_hoog_in_aanbouw_RDAM.JPG`
