# De Zalmhaven (Rotterdam)

Woontorencomplex tussen de Houtlaan en de Gedempte Zalmhaven (2022): Zalmhaven I (Dam & Partners Architecten, 215 m met mast, het hoogste gebouw van Nederland) en de woontorens Zalmhaven II en III (KAAN Architecten, circa 70 m) op een gezamenlijke onderbouw met parkeergarage, daktuin en herenhuizen. Het model bestaat uit benoemde prisma's en een omwentelingsvorm in een eigen gebouwstelsel, zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-rembrandttoren.mjs` en `generate-haagse-toren.mjs`. Reproductie: `node scripts/generate-zalmhaven.mjs`.

## Bestanden en plaatsing

- `zalmhaven.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 66.278 driehoeken).
- `zalmhaven.json`: catalogusitem.
  - RD-oorsprong `[92632.06, 436135.17]` in het hart van de schacht van Zalmhaven I, waar ook de mast staat.
  - `xAxis` 27,2°: de gevels van beide BAG-panden en de AHN-contouren van alle drie de torens lopen langs deze as.
  - +Y wijst naar het noordnoordwesten (Gedempte Zalmhaven), de Houtlaan ligt aan −Y.
  - De onderbouw loopt 142 m naar het westzuidwesten (−X).
- `zalmhaven-1-1000.stl`: millimeters, Z omhoog, 165,0 × 62,8 × 216,3 mm, vlakke voet.

z = 0 ligt op NAP +3,0 m, de straat rondom (AHN5-DTM +2,9 tot +3,1). De voet loopt door tot −1,2 m (NAP +1,8). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de Houtlaan en de Gedempte Zalmhaven: `[−120,−21] [−60,−21] [0,−25] [−60,41] [0,40]`.

Het model vervangt twee BAG-panden:

- `0599100100020122`: Zalmhaven I met de onderbouw rond de toren.
- `0599100100020123`: de onderbouw met de herenhuizen en Zalmhaven II en III.

De oostgrens is een gemeenschappelijke muur met de buurpanden `0599100100016903` (2019) en `0599100000067051` (1979). In de 3D BAG reiken hun daken niet hoger dan NAP +44,4 en +34,5 m, dus de toren zit niet in hun reconstructie. De Hoge Heren en de Schielandtoren zijn aparte modellen.

## Hoogtebron: AHN5, niet het PDOK-AHN

Het AHN op PDOK (AHN4, kaartblad 37HN1) toont het complex nog in aanbouw. De toren staat daarin op NAP +20 tot +40 m, II en III op +40 tot +60 m en er staat een bouwkraan op +101 m. Alle hoogtes en plattegronden komen daarom uit AHN5 (opname 2023). Dat is DSM/DTM 0,5 m via de ImageServer `Hoogtebestand/AHN5_DSM_50cm` van ahn.arcgisonline.nl, per 0,25 m in het gebouwstelsel uitgelezen. Als controle diende de 3D BAG (LoD2.2 op dezelfde AHN5-opname): dakhoogtes 181,8 / 190,8 / 205,9 / 206,9 en 73,0 m.

## Onderdelen (hoogtes NAP)

### Zalmhaven I

- **Voet** tot +20,0, ±17,5 m: een rand van 1,65 m rond de schacht (AHN).
  - Aan de Houtlaan een galerij van acht nissen tussen penanten, tot +8,4 (BAG-penanten op de rooilijn).
  - Op de zuid- en oostgevel drie lagen vensters.
- **Schacht** van 31,7 m in het vierkant tot +182,0. Op elke gevel staat links van het midden (vanaf buiten gezien) een uitgebouwde balkonstapel van 11 m breed en 1,65 m diep, vier keer rond gedraaid.
  - AHN-uitbouwen: zuid u −11,5..−0,5, oost v −12,5..−1,75, noord u 0,25..12,25, west v 2..12,25.
  - Per gevel, van links naar rechts:
    - een glashoek met een glasband per laag;
    - de balkonstapel met twee loggia's per laag (0,9 m diep, gescheiden door een stenen penant), plus een dichte kop;
    - het natuurstenen veld met tien vensters per laag;
    - een glasstrook.
  - 51 woonlagen van 3,18 m. De bovenste vier lagen zijn een doorlopende glasband, zoals op de foto's.
- **Restaurantlaag** (57e en 58e verdieping): ±14,0 m, dak +191,0, glazen borstwering van 1 m breed tot +193,0. Twee hoge glasbanden met stijlen per 4,7 m.
- **Gevelonderhoudsinstallatie** op de westhelft van de restaurantlaag: arm van 1,7 × 10,2 m tot +196,5 (AHN +195 tot +197, foto vanuit het westen).
- **Technische top** (59e tot 62e verdieping): u −6,25..6,5 bij v ±7,6, dak +206,0, rand tot +207,0. Vier glasbanden met stijlen per vak.
- **Mast**:
  - voet Ø 2,4 m;
  - paal Ø 1,0 m;
  - schroefantenne Ø 1,4 m;
  - top op +218,1 (AHN-maximum, Wikipedia 215 m boven de straat).

### Zalmhaven II en III

Twee gelijke torens die 48 m uit elkaar staan (AHN). Dak +72,0 met een rand van 1 m tot +73,0.

- **Plattegrond**: twee overlappende rechthoeken van 26 × 17 m (zuidwest) en 25 × 16,65 m (noordoost).
- **Balkonstapels** tot +63,5:
  - in de twee open hoeken;
  - één uitgebouwde stapel op elke gevel, 2,2 tot 2,8 m diep.
  - De noordelijke stapel kraagt vanaf de onderbouw onder 45° uit boven de Gedempte Zalmhaven.
- **Ingesneden hoeken** van de bovenste lagen tot +66,0.
- **Verdiepte installatievloer** van 11,5 × 7 m op +71,0.
- **Gevels**: vensterraster van 18 lagen met vakken van 2,45 m. De stapels hebben per laag een loggia van 0,7 m.

### Onderbouw

- **Dak** op +16,0. De gevels aan de Houtlaan, de Gedempte Zalmhaven en de westkop hebben drie lagen vensters.
- **Daktuin**: verdiept tot +15,2 tussen de herenhuizen en de torens.
- **Herenhuizen aan de Houtlaan**: per 28 m een verdiept dakterras (+13,0) en een dakopbouw (+19,0). Het oostelijke blok tegen de toren staat geheel op +19,0.
- **Westkop**: een lagere strook op +10,0 en een garage-uitlaat tot +24,0.
- **Rond Zalmhaven I**:
  - de oostvleugel (entree) op +9,0;
  - het noordblok op +17,0 met een verhoogd deel (lichtkap) tot +20,5.

## Geschat en weggelaten

Geschat uit foto's en bronnen:

- **Verdiepingshoogte van Zalmhaven I**: 3,18 m, 51 lagen tussen voet en schacht. Afgeleid uit de verdiepingtelling van Bouwen met Staal (wonen tot de 56e, restaurant 57–58, techniek tot de 62e) en uit foto's.
- **Gevelzones van de schacht**: gemeten op een frontale foto vanuit het westen (glashoek 3,75 m, stenen veld met tien vensters, glasstrook 3,1 m). De breedte van de balkonstapel komt uit de AHN-uitbouwen.
- **Glasbanden** van de bovenste vier woonlagen, de restaurantlaag en de top.
- **Mastdiameters**: uit foto's, maar dikker dan in werkelijkheid zodat ze op 1:1000 printbaar zijn.
- **Vensterraster** van II en III en van de onderbouw.
- **Noordelijke balkonstapels van II en III**: in het AHN alleen als bovenkant buiten de BAG-contour te zien. Ze beginnen hier met een kraag van 45° op de hoogte van de onderbouw, en niet op straat.

Weggelaten:

- **Lamellenluifel langs de Houtlaan** voor de voet van Zalmhaven I: circa 4 m diep op NAP +9, in het AHN een raster van lamellen. Een open luifel zou in de export een dichte plaat met opvulling worden.
- **Pergola** op de oostvleugel: zelfde reden.
- **Kleine objecten op de daktuin**: bomen, paden, paviljoentjes van 3 tot 5 m (AHN +18 tot +21). De vorm is niet eenduidig en het is grotendeels groen.
- **Zonnepanelen** op de daken van II en III: circa 1 m hoog en plat.
- **Balkonhekken en vensterstijlen**: kleiner dan 0,9 m.
- **Bouwbanner**: de reclamebanner op de voet staat alleen op foto's uit de bouwtijd.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 389.248 m³. De ondervlakken zijn alleen de bovenkanten van de nissen en loggia's.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 354 geslaagd. De eigen test controleert:
  - catalogus en vervangen panden, voet en top;
  - de voet op +20 en de schacht met de rondgedraaide balkonstapels;
  - de restaurantlaag met rand, de top en de mast;
  - de gevelonderhoudsinstallatie;
  - 47 vensterlagen in het stenen veld;
  - II en III met de balkonstapels;
  - onderbouw, herenhuisterrassen en dakopbouwen, westkop en oostvleugel.
- **Printcheck** op 1:1000 bij 45°: 0,28 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[92475,436035,92675,436195]`. Duur 35,4 s, 223 objecten, 238.528 driehoeken, vier vellen, modelhoogte 243,9 mm. Het landmarkobject staat compleet in de 3MF.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf. De 3D BAG (LoD2.2) heeft de juiste massa's en kroontrappen, maar vlakke wanden: geen balkonstapels, geen mast, geen terrassen en geen dakopbouwen van de herenhuizen. Het model heeft per kant meer:
  - **Noordwest (−35°)**: de vensterrasters van de onderbouw en van II en III, de uitkragende balkonstapels boven de Gedempte Zalmhaven, de loggia's en uitbouwen van de schacht, en de kroon met rand, gevelonderhoudsinstallatie en mast.
  - **Noordoost (55°)**: de rondgedraaide balkonstapels op de noord- en oostgevel en de glasbanden van de bovenste lagen, de restaurantlaag en de top.
  - **Zuidoost (145°)**: de galerij aan de Houtlaan, de herenhuisterrassen met dakopbouwen en de verdiepte daktuin.
  - **Zuidwest (235°)**: de schuine westkop met de lagere strook en de uitlaat, en de west- en zuidstapels van II en III.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk van beide panden.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.91022/4.48080/350/1x1/0)): het complex ligt op de PDOK-reconstructie van beide panden, de vensterrasters, balkonstapels en de getrapte top met mast zijn zichtbaar en de voet staat aan de Houtlaan op het maaiveld. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnen de PDOK-panden (vlakke wanden) op dezelfde plek en aan weer verdwijnen ze.

## Bronnen

- PDOK BAG `0599100100020122` en `0599100100020123`, Actueel_orthoHR en AHN4 (WCS, ter vergelijking); 11 oktober 2026.
- AHN5 DSM/DTM 0,5 m (opname 2023) via ahn.arcgisonline.nl, `Hoogtebestand/AHN5_DSM_50cm` en `AHN5_DTM_50cm`.
- 3D BAG, TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes ter controle.
  - [Pand 0599100100020122](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100020122)
  - [Pand 0599100100020123](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100020123)
- [Wikipedia: De Zalmhaven](https://nl.wikipedia.org/wiki/De_Zalmhaven): 215 m met een mast van 12 m, dak op 203 m, architecten, glazen top als machinekamer.
- Bouwen met Staal, "Het neusje van de Zalm": verdiepingsindeling (wonen tot de 56e, restaurant 57–58, techniek tot de 62e).
- Commons, alleen als visuele referentie:
  - [Zalmhaventoren](https://commons.wikimedia.org/wiki/File:Zalmhaventoren.jpg) (frontaal vanuit het westen)
  - [Zalmhaventoren in 2026](https://commons.wikimedia.org/wiki/File:Zalmhaventoren_in_2026.jpg)
  - [De Zalmhaven I – View from the Veerhaven](https://commons.wikimedia.org/wiki/File:De_Zalmhaven_I_-_Rotterdam_-_View_from_the_Veerhaven.jpg)
  - [De Zalmhaven I, II and III – View from the Veerhaven](https://commons.wikimedia.org/wiki/File:De_Zalmhaven_I,_II_and_III_-_Rotterdam_-_View_from_the_Veerhaven.jpg)
  - [De Zalmhaven I – View from the Westerkade](https://commons.wikimedia.org/wiki/File:De_Zalmhaven_I_-_Rotterdam_-_View_from_the_Westerkade.jpg)
  - [De Zalmhaven I – View from the Willemsplein](https://commons.wikimedia.org/wiki/File:De_Zalmhaven_I_-_Rotterdam_-_View_from_the_Willemsplein.jpg)
  - [Rotterdam toren zalmhaven](https://commons.wikimedia.org/wiki/File:Rotterdam_toren_zalmhaven.jpg)
  - [Rotterdam De Zalmhaven I and Hoge Erasmus seen from Erasmus Bridge](https://commons.wikimedia.org/wiki/File:Rotterdam_De_Zalmhaven_I_and_Hoge_Erasmus_seen_from_Erasmus_Bridge.jpg)
  - [Model of De Zalmhaven](https://commons.wikimedia.org/wiki/File:Model_of_De_Zalmhaven.jpg) (maquette)
