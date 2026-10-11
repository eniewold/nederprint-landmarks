# Cooltoren (Rotterdam)

Woontoren van 51 lagen aan de Baan (V8 Architects, 2018–2022, circa 154 m) met een plint van vijf lagen en de bovengrondse parkeergarage met daktuin aan de oostzijde. Het model bestaat uit benoemde prisma's in een eigen gebouwstelsel, zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-zalmhaven.mjs` en `generate-haagse-toren.mjs`. Reproductie: `node scripts/generate-cooltoren.mjs`.

De backlog noemt een bakstenen gevel met lamellen. Foto's en Wikipedia tonen iets anders: witte prefab betonbanden en balkons met gevelbrede glasstroken. Het model volgt de foto's.

## Bestanden en plaatsing

- `cooltoren.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 17.580 driehoeken).
- `cooltoren.json`: catalogusitem.
  - RD-oorsprong `[92644.5, 436604.0]` in het hart van de schacht.
  - `xAxis` −0,8°: de BAG-gevels en de AHN-randen van schacht en kroon lopen langs deze as.
  - +X wijst naar het oosten (garage), +Y naar het noorden. De Baan ligt aan −X.
- `cooltoren-1-1000.stl`: millimeters, Z omhoog, 45,4 × 125,3 × 161,2 mm, vlakke voet.

z = 0 ligt op NAP +0,5 m, de straat rondom (AHN5-DTM +0,4 tot +0,65). De voet loopt door tot −1,2 m (NAP −0,7). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de Baan, ten zuiden van de plint en oostelijk van de garage: `[−21,−30] [−21,0] [−21,25] [0,−30] [31,−20] [31,0]`.

Het model vervangt twee BAG-panden (beide bouwjaar 2023 in de BAG):

- `0599100100017348`: de toren met de plint.
- `0599100100017388`: de parkeergarage met daktuin (1.807 m², Wikipedia: daktuin van 1.770 m² en 211 parkeerplaatsen). De PDOK/3D BAG-reconstructie van dit pand bevat stukken van de kroon tot NAP +86 m langs de torengevel. Zonder vervanging zou daar een wand naast het model blijven staan.

Buren die het model raken, met hun 3D BAG-daken, alle gelijk aan het AHN:

- `0599100000641661` (zuid, +17,4).
- `0599100000635978` en `0599100000635980` (zuid van de garage, +14,2 en +13,8).
- De BaanTower (`0599100110009741`, ten noorden van de toren) ligt los van het model; in AHN5 was het daar nog een bouwput.
- Er ligt geen ander landmarkmodel binnen 450 m; De Zalmhaven ligt 470 m zuidelijker.

## Hoogtebron: AHN5, niet het PDOK-AHN

Het AHN op PDOK (AHN4) toont de toren nog in aanbouw (maximaal NAP +75 m). Alle hoogtes en plattegronden komen daarom uit AHN5 (opname 2023). Dat is DSM/DTM 0,5 m via de ImageServer `Hoogtebestand/AHN5_DSM_50cm` van ahn.arcgisonline.nl, per 0,5 m in het gebouwstelsel uitgelezen.

Als controle diende de 3D BAG (LoD2.2 op dezelfde AHN5-opname):

| Onderdeel | NAP |
| --- | --- |
| Dakopbouw | +155,0 |
| Dak | +151,2 |
| Hoekterrassen | +136,5 |
| Gleufdaken | +92,1 |
| Kroon | +83,3 |
| Plint | +21,7 |
| Garage | +12,85 |
| Trappenhuizen | +15,9 |

## Onderdelen (hoogtes NAP)

### Schacht

- **Kern** van 27,9 × 27,6 m (BAG-voetafdruk op maaiveld en de AHN-hoekblokken).
- **Verdiepingen**: dubbelhoge onderbouw tot +9,0, daarboven 49 woonlagen van 2,90 m tot het dak op +151,2. Met deze steek vallen de AHN-hoogtes van kroon, gleufdak en hoekterrassen op het raster.
- **Balkonstapels**: twee per gevel, 1,5 m uitgebouwd tot ±15,4. Per laag een witte plaat van 1,72 m en een balkon van 0,9 m diep.
  - West en oost: v ±1,8..6,35.
  - Noord en zuid: u ±1,8..7,9.
  - Ze beginnen boven de entree (west, +9,0), de garage (oost, +12,85) en de plint (noord en zuid, +21,7).
- **Gleuf** van 3,6 m midden op elke gevel, tot 1,0 m (oost/west) of 0,5 m (noord/zuid) in de kern, met vloerranden.
  - Drie lagen onder en drie lagen boven de kroon lopen de balkonplaten over de gleuf door (+64,1 tot +92,0, foto's).
  - Het dak van de doorlopende platen ligt op +92,0 (AHN +92,1).
- **Terugliggende hoeken** ("inkepingen"): tussen de stapels ligt de kern in glas met witte vloerranden van 0,55 m en glasbanden van 0,35 m diep. Van buiten gezien springen de hoeken 1,5 m terug achter de stapels en 2,4 m achter de kroon.
- **Hoekterrassen** op +136,7. Daarboven zijn de hoeken weggesneden en zijn de bovenste vijf lagen een kruis (AHN5: armen u ±7,9 en v ±6,35).
- **Dakopbouw** tot +155,0: een kruis van 21,75 × 11,5 en 14 × 18,5 m (AHN5), met een 1,0 m teruggezette donkere laag onder de dakplaat.
- **Antenne**: paal van 1,0 m tot +160,5 (AHN-maximum +161,7 op één punt).

### Middenkroon

Vier lagen van +72,8 tot +83,3. De kroon is een volle vierkante band van 32,5 × 32,4 m (AHN5) die rondom uitkraagt. Tussen de vier witte banden liggen terrassen van 1,5 m diep, ook op de hoeken (Wikipedia: per laag vier hoekappartementen met balkons van 72 m²).

### Plint

- Zuid- en noordvleugel aan de Baan tot +21,7 (BAG-contour, 3D BAG +21,7).
- Een pui met openingen van 4,8 m en vier lagen vensters op een steek van 3,0 m.
- Tussen de vleugels staat de westgevel van de toren met een dubbelhoge entreehal (1,0 m terug).

### Parkeergarage

- 118 m lang langs de oostzijde, dak (daktuin) op +12,85.
- Borstweringen langs de lange zijden tot +14,45 (AHN5 +14,3 tot +14,7).
- Een rond trappenhuis (Ø 5,4 m) en een trappenhuis van 5 × 5,5 m tot +16,0.
- Vier parkeerdekken als open gevel op de oost-, zuid- en noordgevel.

## Geschat en weggelaten

Geschat uit foto's en bronnen:

- **Verdiepingsteek** 2,90 m (49 woonlagen boven +9,0): uit de 51 lagen van Wikipedia en de AHN-hoogtes van kroon, gleufdak en hoekterrassen.
- **Balkonritme**:
  - plaat 1,72 m, balkonruimte 1,18 m en 0,9 m diep;
  - vloerranden van 0,55 m in de hoekzones;
  - terrassen tussen de kroonbanden 1,5 m diep.
- **Stapels en gleuven onder de kroon**: gelijk aan die erboven. Het AHN ziet alleen het bovenste deel; de foto's van alle kanten tonen onder en boven hetzelfde ritme.
- **Dakopbouw**: de terugzetting van 1,0 m komt uit een foto. De antenne is als paal van 1,0 m gemodelleerd, dikker dan echt.
- **Plint en garage**: het vensterraster van de plint en de open dekken van de garage. Van de garagegevel is geen foto gevonden.

Weggelaten:

- **Glazen balkonhekken en vensterstijlen**: kleiner dan 0,9 m.
- **Het T-vormige antenneframe en de dunne tweede mast** op het dak: kleiner dan 0,9 m. Alleen de hoofdpaal staat erin.
- **Zonnepanelen** op de plint en **beplanting** op de daktuin: plat of groen, onder 0,9 m.
- **Hellingbaan en inrit** aan de westzijde van de garage: in het AHN onduidelijk (+7,6 tot +11,8).
- **Schuin element op het noordoostelijke hoekterras**: in de 3D BAG een vlak van 18 m² van +136,6 tot +145,2. De vorm is op foto's niet te herkennen, mogelijk een gevelonderhoudsinstallatie.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 157.821 m³. De ondervlakken zijn de plafonds van balkons, terrassen en de onderkant van de kroon.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 376 geslaagd. De eigen test controleert:
  - catalogus en vervangen panden, voet en top;
  - de kroon met zijn hoeken en terrassen;
  - de stapels tot het dak en de hoekterrassen, met daarboven alleen het kruis;
  - de gleuf met zijn dak op +92,0;
  - 44 balkonlagen in een weststapel;
  - dakopbouw en antenne;
  - plint, garage met borstwering en trappenhuizen.
- **Printcheck** op 1:1000 bij 45°: 0,87 % extra volume, vooral onder de kroon en de balkonplafonds.
- **Export**: `createModelBundle` op 1:1000, RD `[92585,436555,92705,436725]`. Duur 10,1 s, 164 objecten, 97.204 driehoeken, drie vellen. Het landmarkobject staat compleet in de 3MF en de twee vervangen panden ontbreken.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf. De 3D BAG (LoD2.2) heeft de schachtmassa met de hoektrap bovenin, maar vlakke wanden. Er zit geen kroonband in en geen plint, en de garage is een scheve wig. Het model heeft per kant meer:
  - **Noordwest (−35°)**: de noordvleugel van de plint met vensterraster, de weststapels vanaf de entreehal, de uitkragende kroon en de weggesneden hoeken bovenin.
  - **Noordoost (55°)**: de garage met open dekken, borstwering en trappenhuis, en de doorlopende balkonplaten boven en onder de kroon.
  - **Zuidoost (145°)**: de stapels van de oostgevel boven het garagedak, de gleuven tot het dak en de terrassen van de kroon.
  - **Zuidwest (235°)**: de zuidvleugel van de plint, de terugliggende glazen hoeken met vloerranden en de dakopbouw met antenne.
- **Bovenaanzicht**: het model ligt op de BAG-voetafdruk van beide panden. De 3D BAG-garage wijkt af: die is een wig in plaats van de strook van 118 m.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.91443/4.48090/400/1x1/0)): de toren ligt op de PDOK-reconstructie met de middenkroon, de gleuven en de balkonstapels zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0599100100017348` en `0599100100017388`, Actueel_orthoHR en AHN4 (WCS, ter vergelijking); 11 oktober 2026.
- AHN5 DSM/DTM 0,5 m (opname 2023) via ahn.arcgisonline.nl, `Hoogtebestand/AHN5_DSM_50cm` en `AHN5_DTM_50cm`.
- 3D BAG, TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes ter controle.
  - [Pand 0599100100017348](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100017348)
  - [Pand 0599100100017388](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100017388)
- [Wikipedia: Cooltoren](https://nl.wikipedia.org/wiki/Cooltoren): 50/51 lagen, prefab beton met witte banden en balkons, middenkroon met hoekbalkons van 72 m², daktuin en parkeergarage.
- Commons, alleen als visuele referentie:
  - [Cooltoren – september 2022](https://commons.wikimedia.org/wiki/File:Cooltoren_-_september_2022.jpg) (vanaf de voet, hoekzicht)
  - [Cooltoren (Rotterdam)](https://commons.wikimedia.org/wiki/File:Cooltoren_(Rotterdam).jpg) (vanaf het oosten, over het water)
  - [De Cooltoren in de skyline van Rotterdam – cropped](https://commons.wikimedia.org/wiki/File:De_Cooltoren_in_de_skyline_van_Rotterdam_-_cropped.jpg) (verre telelens, kroon en dakopbouw)
  - [Cooltoren gezien vanaf Terwenakker](https://commons.wikimedia.org/wiki/File:Cooltoren_gezien_vanaf_Terwenakker.jpg)
  - [CoolToren en BaanTower](https://commons.wikimedia.org/wiki/File:CoolToren_en_BaanTower.jpg) (vanaf het zuidoosten)
  - [Cool Tower](https://commons.wikimedia.org/wiki/File:Cool_Tower.jpg) (detail van de kroon)
