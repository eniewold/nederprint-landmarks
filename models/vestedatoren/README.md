# Vestedatoren (Eindhoven)

Woontoren van Vesteda aan de Vestdijk en de Smalle Haven, ontworpen door Jo Coenen & Co Architekten en voltooid in 2006 (Gebouw van het Jaar 2007). De toren is 90 m hoog en telt 27 lagen. De plattegrond is een ruit met twee scherpe, afgeronde punten, een verwijzing naar het Flatiron Building in New York. De ene punt wijst naar het centrum (noordwest), de andere naar het zuidoosten.

In de punten zitten ronde balkons voor glazen gevels. De vier lange gevels hebben een raster van loggia's tussen lisenen en vloerbanden. Op de stompe hoeken loopt een gesloten band van natuursteen over de volle hoogte. De toren staat op een stenen plint met hoge vensters, die aan de zuidoostpunt terugligt onder een uitkragende kop.

Het model bestaat uit benoemde prisma's, hulls en vlakken in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-toren-op-zuid.mjs` (gevelnissen op `efteling-kit.mjs`). Reproductie: `node scripts/generate-vestedatoren.mjs`.

## Bestanden en plaatsing

- `vestedatoren.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 1, 17.888 driehoeken).
- `vestedatoren.json`: catalogusitem.
  - RD-oorsprong `[161620.19, 383171.39]`: het hart van de ruit.
  - `xAxis` 128,0°: over de lange diagonaal naar de punt richting het centrum (noordwest). +Y wijst naar het plein (zuidwest), de Vestdijk ligt aan −Y.
- `vestedatoren-1-1000.stl`: millimeters, Z omhoog, 51,1 × 14,8 × 94,5 mm, vlakke voet.

z = 0 ligt op NAP +16,8 m, het niveau van het plein aan de zuidwestzijde en de stoep rond de punten (AHN4-DTM +16,76 tot +16,84). De onderkant ligt op −1,0 (NAP +15,8), onder de stoep aan de Vestdijk (+16,05 tot +16,5). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op het plein en bij de zuidoostpunt (`[−12,9] [0,11] [12,9] [−24,5]`). PDOK geeft daar 60,70 tot 60,73 (ellipsoïdisch). De lagere stoep aan de Vestdijk (60,0 tot 60,5) blijft erbuiten.
- `groundHeight` 60,7 is de PDOK-terreinhoogte op die punten (gemeten op 12 oktober 2026 in de terreintegel). PDOK-maaiveld is hier ongeveer NAP + 43,9 m.

Het model vervangt twee BAG-panden:

- `0772100000284714` (bouwjaar 2006): de toren zelf. PDOK reconstrueert hem als een gladde prisma tot +105,4 met één blok op het dak.
- `0772100001047014` (bouwjaar 2006, 840 m²): een pand onder de toren en het plein ten westen ervan, vermoedelijk de kelder; het staat niet in de 3D BAG. PDOK zet er een tweede kopie van de toren op (tot NAP +107,4) die anders door de loggia's heen zou steken. Boven het plein heeft dit pand alleen een vlak op maaiveldhoogte.

Het lagere buurpand aan de noordwestpunt (`0772100001003302`, de gebogen bebouwing aan de Smalle Haven, ook 2006) blijft PDOK. Het staat 0,4 m van de punt, en de PDOK-hoogte (dak tot NAP +30,0) past bij het AHN (+27,8, met opbouwen hoger).

## Onderdelen (hoogtes NAP)

### Plattegrond

- **Ruit**: gevels op 15,08° van de lange diagonaal (BAG: −36,9° en −67,1° in RD), de halve korte diagonaal van de scherpe ruit is 7,87 m.
- **Punten**: afgerond met r = 2,5 m, de toppen op u = ±22,10 (BAG ±22,13). De punten zijn 30° scherp.
- **Stompe hoeken**: afgerond met R = 13,66 m, de toppen op v = ±7,38 (BAG +7,32 en −7,44).
- De afmetingen zijn 44,2 × 14,8 m. Het AHN5-dak valt binnen 0,25 m samen met de BAG-contour, dus de toren is over de volle hoogte prismatisch.

### Plint

- Stenen plint van de begane grond tot de eerste woonlaag op **+30,2** (vier lagen). De hoogte komt uit foto's.
- Op elke lange gevel twee hoge vensters bij de stompe hoek, 2,6 m breed tot +27,4, als nissen van 0,35 m.
- **Zuidoostpunt**: de plint ligt 4,6 m terug (op u = −17,5, met drie glasstroken als nis) onder een uitkragende stenen kop. De onderkant van de kop ligt op +28,2; de stenen borstwering loopt tot de eerste woonlaag op +30,2.
- **Luifel** boven de ingang op **+20,4** (AHN5 +20,3 tot +20,5), 0,6 m dik. Hij loopt van de plint tot 6,9 m voorbij de punt en staat aan het eind op twee kolommen van 0,9 m.
- **Noordwestpunt**: de plint loopt tot de punt door; het lagere buurpand staat ertegen.

### Woonlagen

- 22 lagen van 3,15 m vanaf +30,2 en een hogere bovenste laag van +99,5 tot +104,9. Op elk vloerniveau ligt een vloerband of balkonplaat van 0,9 m.
- **Loggia's**: op elke lange gevel vier traveeën van 2,7 m tussen lisenen van 0,9 m, 0,8 m diep, per laag tussen de vloerbanden.
- **Punten**: ronde balkons voor een glazen gevel die 1,1 m terugligt, per laag tussen de balkonplaten, vanaf 19 m langs de gevel (u = ±18,35) rond de punt.
- **Stompe hoeken**: een gesloten stenen band van de plint tot de kroon. Aan de pleinzijde zit er een kolom ventilatieroosters in (1,0 × 1,4 m per laag, 0,35 m diep).

### Kroon en dak

- **Kroonband** van natuursteen van +104,9 tot de rand op **+106,88** (AHN5 106,84 tot 106,95 rondom).
- **Dak** binnen een rand van 0,7 m op **+105,32** (AHN5 105,29 tot 105,35; 3D BAG 105,34).
- **Installaties** (AHN5):
  - een blok van 5,5 × 2,0 m tot **+107,45**;
  - lagere installaties tot +106,45 en een ketel tot +107,1;
  - een blok tot **+108,3** bij de noordwestpunt met een schoorsteen van 1,0 m tot **+110,3**.

## Geschat en weggelaten

- **Lagen**: de plint van vier lagen tot +30,2 en de laaghoogte van 3,15 m komen uit foto's. In de punten zijn 22 balkonplaten te tellen tussen de plint en de bovenste laag, en die laag is ongeveer 1,7 keer zo hoog. Samen met de kroonrand uit het AHN5 sluit dat aan op de 27 lagen uit Wikipedia.
- **Loggia's**: in het echt per travee wisselend glas, houten panelen en een loggia met hekwerk. Het model maakt er overal nissen van 0,8 m van.
- **Vloerbanden en balkonplaten** zijn 0,9 m dik in plaats van ongeveer 0,3 m, zodat ze op 1:1000 printen. De ronde stenen kolommen voor de gevels zijn lisenen van 0,9 m.
- **Zuidoostpunt**: hoe ver de plint terugligt (4,6 m) en de hoogte van de kop komen uit foto's. De luifel komt uit het AHN5; de twee kolommen onder het eind zijn geschat.
- **Ventilatieroosters en plintvensters**: plaats en maat uit foto's.
- **Noordwestpunt**: de onderkant is achter het buurpand niet te zien. Het model neemt aan dat de plint daar tot de punt doorloopt.
- **Weggelaten**:
  - de balkonhekken, de stijlen in de glazen gevels en de gevelonderhoudsinstallatie (dunner dan 0,9 m);
  - losse installaties op het dak kleiner dan 0,9 m;
  - de fietsenstalling langs de Vestdijk en de bomen.

## Controle

- `node scripts/generate-vestedatoren.mjs` geeft een gesloten, verbonden model. Twee keer draaien geeft byte-identieke bestanden.
- In `tests/landmark-models.test.ts` van de webshop staat de test "places the Vestedatoren's rounded lozenge with sharp balcony tips, …". Die controleert:
  - de oorsprong, de twee BAG-panden en de maaiveldhoogte;
  - de kroonrand op beide punten en beide stompe hoeken, het dak en dat niets buiten de punten steekt behalve de luifel;
  - loggia's in alle vier lange gevels in de eerste en de bovenste laag;
  - de teruggelegen glazen gevels in beide punten;
  - de teruggelegen plint en de kop aan de zuidoostpunt, en de luifel;
  - de installaties en de schoorsteen.
- **Printcontrole op 1:1000** (`supportedSolid`, 45°): 35.167 → 35.747 mm³, dat is +1,65 %.
  - De export vult onder de vloerbanden, de balkonplaten en de plafonds van de loggia's (tot +41 mm² per doorsnede), onder de kop aan de zuidoostpunt (+19 mm²) en onder de luifel (+8,5 mm²).
  - De loggia's en de balkons blijven als nis zichtbaar.
- **Renders**: van vier kanten naast de PDOK-reconstructie en tegen Commons-foto's vergeleken. Die renders horen niet in deze repo.

## Bronnen

- PDOK: BAG-panden 0772100000284714 en 0772100001047014, Actueel_orthoHR, gebouwtegels en terrein (12 oktober 2026).
- AHN5 DSM 0,5 m (opname 2023), `ahn.arcgisonline.nl` Hoogtebestand/AHN5_DSM_50cm; AHN4 DTM 0,5 m (PDOK WCS); 3D BAG LoD2.2.
- https://nl.wikipedia.org/wiki/Vestedatoren
- https://de.wikipedia.org/wiki/Vesteda-Turm
- Wikimedia Commons:
  - `Vestedatoren,_Eindhoven.jpg`
  - `Eindhoven,_de_Vestedatoren_IMG_8577_2019-01-20_10.34.jpg`
  - `Vestedatoren_2015.jpg`
  - `Vestedatoren,_Eindhoven_-_zijkant.jpg`
  - `Vestedatoren.jpg`
  - `Binnenstad,_5611_Eindhoven,_Netherlands_-_panoramio_(30).jpg`
  - `2007-09-16_09.34_Eindhoven,_modern_bedrijfspand.JPG`
  - `Strijkijzer_Look_a_Like_(2250918602).jpg`
