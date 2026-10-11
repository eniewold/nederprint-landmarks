# New Babylon (Den Haag)

Winkel-, kantoor- en woncomplex naast Den Haag Centraal (Meyer en Van Schooten, 2011-2013). Het is gebouwd op en om het Babylon-complex uit 1978, dat deels gesloopt en gerenoveerd is. De twee woontorens zijn de City Tower (141,8 m, 45 lagen) en de Park Tower (101,6 m, 31 lagen). Langs de Bezuidenhoutseweg ligt een kantoorschijf met een wit driehoeksvakwerk. Die rust op V-kolommen boven het oude Babylon Hotel.

Het model bestaat uit benoemde prisma's in een eigen gebouwstelsel. Elk plat dak ligt op zijn AHN-hoogte. Er zijn geen gestapelde DSM-lagen gebruikt. Het gevelreliëf is uitgevoerd als blinde nissen van 0,35 m. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-hoftoren.mjs` en `generate-castalia.mjs`. Reproductie: `node scripts/generate-new-babylon.mjs`.

## Bestanden en plaatsing

- `new-babylon.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 34.608 driehoeken).
- `new-babylon.json`: catalogusitem.
  - RD-oorsprong `[82190.98, 455441.11]`, midden in het complex.
  - `xAxis` 37,45°, langs de gevels (BAG-randen 37,4-37,6° en 127,4-127,6°). +X wijst naar de Park Tower.
  - +Y wijst naar het noordwesten, naar de Bezuidenhoutseweg. De Koningin Julianaplein ligt aan -X, het Anna van Buerenplein aan -Y.
- `new-babylon-1-1000.stl`: millimeters, Z omhoog, 119,3 × 109,6 × 143,1 mm, vlakke voet.

z = 0 ligt op NAP +0,6 m (3D BAG-maaiveld 0,63; straten rondom AHN-DTM +0,47 tot +0,82). De voet loopt door tot -1,2 m en `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de straten rondom:

- Bezuidenhoutseweg: `[-30,58]` en `[0,58]`;
- Koningin Julianaplein: `[-63,-24]`;
- Anna van Buerenplein: `[10,-57]`;
- oostkant: `[55,1]`.

Het model vervangt BAG `0518100000237257`. Dat ene pand omvat beide torens, de schijf, het hotel en het hele oude Babylon. In het generatorscript staan de maten in een meetstelsel (u, v) met de oorsprong in RD (82200, 455380). Het modelhart ligt daar op (30, 54).

Wat er niet bij hoort:

- **Ondergrondse delen van het BAG-vlak.** Het BAG-vlak loopt naar het zuiden (onder het busplatform) en naar het oosten verder dan het gebouw. Daar staat boven het maaiveld niets van dit pand: in het AHN zijn het straat en het busplatform op +7,5. De 3D BAG heeft er ook geen daken. Het model laat die delen weg.
- **Buurpanden.** Den Haag Centraal (`models/den-haag-centraal`), de Hoftoren en de Castalia staan meer dan 50 m verderop. Ook de toren van 2013 aan het Anna van Buerenplein (`0518100001643163`, +71,5) valt erbuiten. Het model komt nergens aan deze panden.
- **Geen punten van de torens in de buren.** De 3D BAG-buren blijven op hun eigen hoogte: 243790 tot 52,6, 1643163 tot 78,3, 271819 tot 63,0, 215029 tot 34,9 en 321931 tot 37,5. Ze hebben dus geen punten van de torens meegenomen.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### City Tower (zuidwesthoek)

- **Schacht** van 18,9 × 36 m tot +142,5 (AHN 142,2-142,6). In de noordhoek zit een inham van 6,5 × 7 m.
- **Lager L-vormig bouwdeel tot +121,6.** Het loopt om de oosthoek: een strook van 5,6 m langs de noordoostgevel en 6,7 m voor de zuidoostgevel. Dit zijn de verspringende hoeken van de torenplattegrond.
- **Verdiepingsbanden**: 44 lagen van 3,1 m boven een entree tot +5,6. Elke laag is een glasgroef van 2 m. Per vak van circa 6 m springen de groeven 0,3 m op en neer, zodat de witte banden verspringen zoals op de foto's.
- **Driehoeksvakwerk op de zuidwestgevel**: rijen van twee lagen met driehoeken van circa 6 m en staven van 0,9 m. Bovenaan (vanaf +118) beslaat het vakwerk de hele gevel. Naar beneden wordt het een baan van circa 13 tot 26,5 m vanaf de zuidhoek.
- **Vakwerkkroon** vanaf +118 op de noordwest- en noordoostgevel, boven het lagere deel. De zuidoostgevel heeft geen vakwerk (foto).
- **Dak**: op beide smalle einden een goot van 2 m binnen een rand van 0,9 m, vanaf +139,4. Dit zijn de open vakwerkkaders (AHN 137-139).

### Park Tower (noordoosthoek)

- **Schacht** tot +102,3 met een schuine oostgevel (11°, BAG en AHN), 21,8 × 34,1 m.
- **Lager L-vormig bouwdeel tot +87,4** om de west- en noordkant.
- **Vakwerk op de oostgevel** van +18 tot het dak; een vakwerkkroon vanaf +84 op de andere gevels.
- **Verdiepingsbanden**: 30 lagen van 3,2 m, verspringend zoals bij de City Tower.
- **Op het dak** een opstand langs de westrand (+104,2) en een installatieblok (+103,1).

### Kantoorschijf langs de Bezuidenhoutseweg

- **Schijf van +33 tot +45,9**, 90 m lang. Ze is 28 m diep boven het hotel en 17 m oostelijker.
  - twee lagen driehoeksvakwerk (3,95 m hoog, driehoeken van 4,6 m);
  - een glaslaag erboven;
  - een dakopbouw tot +47,7.
- **Terugliggende gevel**: onder de schijf ligt de west- en noordgevel 1,5 m terug, met vensterbanden op 3,3 m. Bij het hotel begint dit boven de glazen plint (+9,4), oostelijker vanaf de straat.
- **V-kolommen** van 1,2 m:
  - twee V's in de westgevel, aan de Koningin Julianaplein;
  - drie V's en één losse kolom in de noordgevel.
- **Glazen plint** van +9,4 langs de Bezuidenhoutseweg en de Koningin Julianaplein.

### Oude Babylon

- **U van zuid- en oostvleugel** tot +41,8, met dakopbouwen tot +44,3 en +42,8.
- **Westvleugel** tot +36,6.
- **Oude kantoortoren** in het midden: +50,1, +52,6 en +54,8.
- **Middenvleugel** tot +36,6, met opbouwen tot +39,7 en +39,0.
- **Winkelblokken** op +23,0 en +23,1.
- **Laagbouw** van het winkelcentrum op +9,4 tot +13,4.
- **Open binnenhof** van 5,5 × 10,75 m tussen het hotel en het winkelcentrum (AHN-DSM 0,8).
- **Vensterbanden** op alle vrije gevels: 1,8 m hoog op 3,6 m, in vakken van 7,2 m.

## Backlog-hint tegen de metingen

"Twee torens van 142 m en 100 m (2011)": klopt in grote lijnen. De Park Tower is 101,6 m en werd in 2011 opgeleverd, de City Tower pas in 2013.

"Glazen gevels met verspringende hoeken": de gevels zijn grotendeels glas met witte verdiepingsbanden. De opvallende vorm komt echter van het witte driehoeksvakwerk, en dat staat niet in de hint. De verspringing zit op twee plaatsen:

- in de plattegrond: de L-vormige lagere delen en de inham;
- in de banden zelf.

Het oude Babylon is niet apart te houden. Het staat in hetzelfde BAG-pand en wordt daarom meegemodelleerd.

## Geschat en weggelaten

Geschat:

- **Verdiepingsbanden**: 44 lagen van 3,1 m (City Tower) en 30 van 3,2 m (Park Tower), met een verspringing van 0,3 m per vak van circa 6 m, uit foto's.
- **Vakwerkzones**: de zone op de zuidwestgevel van de City Tower, de kronen (vanaf +118 en +84) en de oostgevel van de Park Tower (vanaf +18) komen uit frontale foto's. De driehoeksmaat (6 m, rijen van twee lagen) en de staafbreedte (0,9 m, werkelijk smaller) zijn vergroot zodat ze op 1:1000 zichtbaar zijn.
- **Kantoorschijf**: de onderkant (+33,0), de twee vakwerklagen en de driehoeken van 4,6 m komen uit een frontale foto van de westgevel. De terugligging van 1,5 m en de plaats van de kolommen in de noordgevel komen uit schuine foto's.
- **Open vakwerkkaders op het dak van de City Tower**: als goten van 2 m.
- **Vensterbanden van het oude Babylon en de laagbouw**: regelmatig, 1,8 m hoog op 3,6 m.

Weggelaten:

- **Vlaggenmast** van 16 m op de City Tower: dunner dan 0,9 m.
- **Balkonranden en de fijne staven** van het vakwerk: kleiner dan 0,9 m. Ze zijn als banden en driehoeksnissen weergegeven.
- **Glazen atriumdaken van het winkelcentrum** (gaten in het DSM): opgevuld op +9,4.
- **Schuin glasdak** tussen middenvleugel en winkelblok oost (3D BAG 5,4-21,2): het AHN ziet daar een vlak dak op +9,5.
- **Ondergrondse delen van het BAG-pand** en het busplatform (+7,5, geen deel van dit pand boven het maaiveld).
- **Doorgang onder de schijf** naar de binnenhof: niet zeker uit de foto's. De schijf staat daar dicht tot de straat.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 17, 493.586 m³, 2.082 nissen. Ter vergelijking: de 3D BAG heeft 474.813 m³. Nissen die een aangrenzend bouwdeel afdekt, worden ingesloten holtes; die vallen weg.
- **AHN-vergelijking** van de dakhoogtes per 0,25 m: 84 % binnen 1 m en 88 % binnen 2 m. De afwijkingen zijn gevelranden en het rooster van installaties en terrassen op de daken.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 400 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet en top (+142,5);
  - de hoekpunten van beide torens en hun L-delen, en de inham;
  - de opstand van de Park Tower;
  - de schijf met de terugligging en de V-kolommen;
  - het oude Babylon en de open binnenhof;
  - de verspringende verdiepingsbanden en het vakwerk onderaan en in de kroon van de zuidwestgevel.
- **Printcheck** op 1:1000 bij 45°: 0,13 % extra volume (de schijf boven de terugligging en de nissen).
- **Export**: `createModelBundle` op 1:1000, RD `[82090,455345,82295,455540]`. Duur 12,8 s, 141 objecten, 135.774 driehoeken, vijf vellen, modelhoogte 147,2 mm. Het model staat compleet op het terrein.
- **Renders** naast de 3D BAG op -35°, 55°, 145° en 235° en van bovenaf, plus lage hoeken als de foto's (-55°, 200° en 70°, 12° hoog). De 3D BAG heeft de juiste massa's, maar vlakke wanden en geen vakwerk, banden of kolommen. Het model heeft per kant meer:
  - **Noordwest (-35°)**:
    - de schijf met vakwerk, terugliggende gevel en V-kolommen;
    - de vakwerkkroon van de Park Tower boven het L-deel;
    - de verdiepingsbanden van de City Tower.
  - **Noordoost (55°)**:
    - de schuine oostgevel van de Park Tower in het vakwerk;
    - de vakwerkkroon van de City Tower boven het lagere deel;
    - de vensterbanden van het oude Babylon.
  - **Zuidoost (145°)**:
    - de zuidoostgevel van de City Tower met het L-deel en de verspringende banden;
    - de kroon van de Park Tower;
    - de zuidvleugel met vensterbanden.
  - **Zuidwest (235°)**:
    - het vakwerk over de zuidwestgevel van de City Tower, bovenaan breed en onderaan een baan;
    - de westgevel van de schijf met de V-kolommen boven de plint.
- **Bovenaanzicht**: het model ligt op de BAG- en 3D BAG-voetafdruk. Alleen de open binnenhof is leeg, net als in de 3D BAG.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.08245/4.32498/350/1x1/0)): de twee torens met het driehoeksvakwerk, de schijf en het oude Babylon liggen op de PDOK-reconstructie van het pand naast Den Haag Centraal. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-blok (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0518100000237257`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, pand 0518100000237257](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000237257) (TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes en -contouren van alle bouwdelen.
- [Wikipedia: Babylon (Den Haag)](https://nl.wikipedia.org/wiki/Babylon_(Den_Haag)) en [New Babylon, The Hague](https://en.wikipedia.org/wiki/New_Babylon,_The_Hague): 141,8 m/45 lagen en 101,6 m/31 lagen, Meyer en Van Schooten, V-kolommen voor het hotel.
- Commons, alleen als visuele referentie:
  - [City Tower The Hague](https://commons.wikimedia.org/wiki/File:City_Tower_The_Hague.jpg) en [Den Haag Nieuw Babylon 08](https://commons.wikimedia.org/wiki/File:Den_Haag_Nieuw_Babylon_08.jpg) (zuidwestgevel met vakwerk en het L-deel)
  - [Park Tower The Hague 2026](https://commons.wikimedia.org/wiki/File:Park_Tower_The_Hague_2026.jpg) (oostgevel in het vakwerk, kroon van de City Tower)
  - [Den Haag New Babylon 2025-06-12](https://commons.wikimedia.org/wiki/File:Den_Haag_New_Babylon_2025-06-12.jpg) (schijf en Park Tower vanaf de Koekamp)
  - [Den Haag Nieuw Babylon 05](https://commons.wikimedia.org/wiki/File:Den_Haag_Nieuw_Babylon_05.jpg) en [Park Tower Den Haag](https://commons.wikimedia.org/wiki/File:Park_Tower_Den_Haag.jpg) (hotel, V-kolommen en schijf)
  - [Den Haag Nieuw Babylon 03](https://commons.wikimedia.org/wiki/File:Den_Haag_Nieuw_Babylon_03.jpg)
  - [Nieuw Babylon The Hague 2017 4](https://commons.wikimedia.org/wiki/File:Nieuw_Babylon_The_Hague_2017_4.jpg)
