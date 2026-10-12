# Pontsteigergebouw (Amsterdam)

Woongebouw op de kop van de pier aan het IJ in de Houthavens (Arons en Gelauff Architecten; ontwerp 2007, gebouwd 2015–2019), 92 m hoog. Het is een vierkant blok van 87,1 × 85,0 m:

- een lage ring van zes woonlagen om een open binnenhof;
- aan de IJ-zijde twee torens die bovenin met een brug van tien lagen zijn verbonden;
- daaronder een poort van 43,5 m breed en 59 m hoog, open van het maaiveld tot de onderkant van de brug.

Door de poort kijk je over de binnenhof naar de zuidwestvleugel. In de onderste drie lagen van de brug zit aan beide langsgevels een stalen V-vakwerk achter glas. Ring en torens staan op een open onderbouw met kolommen en golvende glazen paviljoens.

In plattegrond is het gebouw geen L: vanaf het noorden of zuidwesten gezien lijkt het een omgekeerde L (toren en brug boven de lage ring), maar de ring sluit de binnenhof aan drie kanten.

Het model bestaat uit benoemde prisma's in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-nhow-amsterdam-rai.mjs` (gevelnissen per laag op `efteling-kit.mjs`). Reproductie: `node scripts/generate-pontsteiger.mjs`.

## Bestanden en plaatsing

- `pontsteiger.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 5, 27.488 driehoeken).
- `pontsteiger.json`: catalogusitem.
  - RD-oorsprong `[120896.405, 489606.24]`: het hart van het vierkant (BAG-pand 0363100012244556, hoeken haaks op 0,01°).
  - `xAxis` 129,84°: langs de IJ-gevel naar het noordwesten. −Y wijst naar het IJ (de poort), +Y naar de pier.
  - De zuidoosttoren staat op −X, de noordwesttoren op +X.
- `pontsteiger-1-1000.stl`: millimeters, Z omhoog, 89,1 × 86,9 × 94,6 mm, vlakke voet.

z = 0 ligt op NAP +1,7 m: pier en binnenhof (AHN-DTM +1,6 tot +1,7). De onderkant ligt op −2,3, net onder het IJ-peil (PDOK-water NAP −0,4). Zo zweven de gevels aan de kademuren nergens boven het water. `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op de pier ten zuidwesten van het gebouw (`[−30,47] [−15,50] [0,46]`) en in de binnenhof en de poort (`[0,0] [0,−30]`). Het water aan de drie andere kanten (PDOK 42,48) blijft erbuiten.
- `groundHeight` 44,59 is de laagste PDOK-terreinhoogte op die punten (ellipsoïdisch, gemeten op 12 oktober 2026 in de terreintegel).

Het model vervangt vijf BAG-panden:

- `0363100012244556`: het gebouw;
- `0363100012244579`: de parkeergarage onder pier en gebouw; PDOK legt die als vlakke plaat onder het maaiveld en als blok tot de dakhoogte;
- `0363100012253421`, `0363100012253422` en `0363100012253423`: de drie paviljoens. PDOK trekt die op tot +73 en +94 m, het AHN ziet hun daken op +5,93.

Het dichtstbijzijnde andere pand (`0363100012254563`) staat 25 m ten zuidwesten van de ring, aan de overkant van het water. Het model raakt geen ander pand en geen ander landmarkmodel.

## Onderdelen (hoogtes NAP)

### Ring, torens en poort

- **Plattegrond** (BAG en AHN5-randen):
  - vierkant van 87,1 × 85,0 m;
  - binnenhof van 43,5 × 41,85 m;
  - torens van 21,8 × 21,9 m, in het verlengde van de zijvleugels (hun binnengevels liggen in lijn met die van de binnenhof).
- **Ring** van **+9,0** tot **+27,3** (AHN5-mediaan 27,27–27,33): zes lagen van 3,05 m.
- **Torens** van +9,0 tot de onderkant van de brug, **+60,85**: 17 lagen.
- **Poort**: 43,5 m breed, de volle diepte van 21,9 m, open van het maaiveld tot +60,85. Alleen de paviljoens steken aan de voet tot 7 m de poort in.

### Brug

- Van **+60,85** tot **+91,0** (AHN5 91,0 tussen de zonnepanelen, rand 91,2) over de volle breedte, met een vlakke onderkant.
- **Vakwerk** in de onderste drie lagen (tot **+70,0**) op de IJ-gevel en de binnenhofgevel:
  - van de binnenzijde van de zuidoosttoren tot het einde van de noordwesttoren, zoals op de foto's;
  - glas 0,45 m terug, acht velden met V-diagonalen van 1,0 m.
- Op de noordwestgevel op dat niveau een hoge glazen strook.
- Erboven zeven lagen van 3,0 m.

### Gevels

Nissen per laag, om de laag een halve steek verspringend:

- loggia's van 5,6 m op 7,0 m, 0,4 m diep: de ring en de noordwestgevel;
- ponsvensters van 1,9 m op 3,5 m: de zuidoosttoren;
- smalle vensters van 1,3 m op 2,3 m: de noordwesttoren;
- vensters van 3,0 m op 4,4 m: de brug boven het vakwerk.

### Onderbouw

- **Drie paviljoens** (BGT-panden, vereenvoudigd tot 0,25 m) met een plat dak op **+5,93** (AHN5) en glasvakken.
  - Het zuidoostelijke steekt 2 m buiten de gevel uit.
  - Paviljoens steken de binnenhof en de poort in.
- **Teruggelegen glazen kern** boven de paviljoens tot +9,0, 2 m binnen hun rand.
- **Ronde lobby** onder de zuidwestvleugel (BGT) tot +9,0.
- **38 kolommen** op hun BGT-plek, 0,9 m in het vierkant, tot +9,0.

### Daken

- **Brug**:
  - velden zonnepanelen tot **+91,7** (AHN5 91,68), met looppaden;
  - twee installatiehuizen van 5,5 × 9,5 m tot **+94,0** (AHN5 93,96), boven de torenkernen, met louvrevakken;
  - twee verdiepte patio's van 5,5 × 5,5 m met de vloer op **+86,75** (AHN5 86,73–86,81).
- **Ring**:
  - zonnepanelen op de zuidwestvleugel tot **+28,3** (AHN5 28,28);
  - twee trappenhuizen van 6,5 × 7,5 m tot **+30,2**;
  - vier kleine opbouwen van 2,2 m tot **+28,9** op de zijvleugels.

## Geschat en weggelaten

Geschat:

- **Onderkant van de brug (+60,85), het vakwerk (tot +70,0) en de laaghoogtes**: uit een frontale foto vanaf het IJ. Het DSM ziet alleen de daken.
  - De schaal komt uit de breedte (87,1 m) en de hoogte (AHN).
  - De schuin geziene onderzijde (een donkere band van 2,8 m) is met de perspectief verrekend.
  - Er zijn 17 lagen van 3,05 m onder de brug geteld, wat +9,0 + 17 × 3,05 = +60,85 geeft.
- **Onderkant van ring en torens (+9,0)**: eerste vensterrij 7,5 m boven het maaiveld op foto's; zes lagen van 3,05 m tot het AHN-dak.
- **Vakwerk**: het aantal velden (acht) en de breedte van de diagonalen (1,0 m) uit foto's. De echte diagonalen zijn smaller.
- **Kern boven de paviljoens en hoogte van de ronde lobby**: niet te zien in AHN of BGT.
- **Gevelritme vereenvoudigd**: zie hierboven. Werkelijk wisselen breedtes per raam.
- **Kolommen**: 0,9 m in het vierkant voor de print, in werkelijkheid 0,54 en 0,8 m (BGT).

Weggelaten:

- **Glazen balustrades** van de loggia's en de **antennemast** op het brugdak (AHN5 tot +95,9): dunner dan 0,9 m.
- **Trappen en terrassen** onder de poort naar de lagere kade aan het IJ: maaiveld, staat in het PDOK-terrein.
- **De parkeergarage** onder de pier: ondergronds.
- **Steigers en de jachthaven** ten noordwesten: geen deel van het gebouw.

## Controle (12 oktober 2026)

- **Generator**: `NoError`, één deel, genus 5, 197.209 m³. Twee keer draaien geeft byte-identieke bestanden.
  - Ondervlakken: de onderkant van ring en torens (+9,0) boven de open onderbouw, en de onderkant van de brug (+60,85, 953 m²).
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`. De eigen test controleert:
  - catalogus, vervangen panden, `groundHeight`, voet (−2,3) en top (+94,0);
  - de hoekpunten van torens (+9,0), brug (+60,85 en +91,0) en ring (+27,3);
  - dat de poort leeg is tussen +6,0 en +60,8 en de binnenhof boven +6,0;
  - het vakwerk in de IJ-gevel, met zijn begin bij de zuidoosttoren;
  - de installatiehuizen, patio's, zonnepanelen, trappenhuizen en het uitstekende paviljoen;
  - de vensters in de IJ-gevel van de torens.
- **Printcheck** op 1:1000 bij 45° (`supportedSolid`, gedeeld zoals in de export): 197.209 → 214.342 mm³, 8,69 % opvulling.
  - **Poort**: in de export blijft de poort in beide gevelvlakken open tot de onderkant van de brug. Onder de vlakke onderkant van de brug (43,5 × 21,9 mm) groeit vanaf de IJ-gevel en de binnenhofgevel een wig van 45° naar binnen. De twee wiggen vormen een omgekeerd zadeldak dat in het midden 11 mm onder de brug reikt (ongeveer NAP +49,9).
  - Vanaf die nok loopt een wand van 1,0 mm dik over de volle breedte van de poort tot de onderplaat, halverwege de diepte (10,4 mm achter de IJ-gevel).
  - In doorsneden dwars op de poort: in de gevelvlakken 0,2 en 0,7 % gevuld (de paviljoens), 5 mm achter de gevels 10–11 %, in het midden 100 %. **De doorkijk door de poort is in de print dus dicht (0 % open)**; van voren is het een nis van 10,4 mm diep.
  - Een schuine of spitse onderkant die open blijft, zou bij deze overspanning ruim 25 m hoog moeten zijn. Dat verandert het silhouet, dus de vlakke onderkant is gehouden. In de GLB (kaart en preview) is de poort helemaal open.
  - Onder de ring groeien vanaf paviljoens, kern en kolommen wiggen in de open onderbouw.
- **Renders** naast de PDOK-reconstructie op −35°, 55°, 145° en 235° (30° hoogte) en naast Commons-foto's. PDOK maakt van de vijf panden dichte blokken tot het dak: een volle toren over het hele vierkant, met een schuine wand door de binnenhof. Er is geen poort, geen ring en geen onderbouw. Het model heeft per kant meer:
  - **Noordwest (−35°)**: de noordwestvleugel van zes lagen met loggia's onder de noordwesttoren, de binnenhof met de paviljoens, de zonnepanelen en trappenhuizen op de ring, het brugdak met installatiehuizen en patio's.
  - **Noordoost (55°, vanaf de pier)**: de zuidwestvleugel met paviljoen en lobby op kolommen, de binnenhof, de poort waar je door de brug heen kijkt, het vakwerk in de binnenhofgevel van de brug.
  - **Zuidoost (145°)**: de zuidoostvleugel met het uitstekende paviljoen, de zuidoosttoren met ponsvensters, het brugdak.
  - **Zuidwest (235°, vanaf het IJ)**: de poort tussen de twee torens met het vakwerk en de vlakke onderkant, de paviljoens met hun luifel aan de voet, de zuidwestvleugel achter de binnenhof.

## Bronnen

- PDOK BAG `0363100012244556`, `0363100012244579`, `0363100012253421`, `0363100012253422` en `0363100012253423`; BGT-panden op het maaiveld (paviljoens, ronde lobby, kolommen) en Actueel_orthoHR; 12 oktober 2026.
- AHN5 DSM 0,5 m (opname 2023), [ahn.arcgisonline.nl](https://ahn.arcgisonline.nl/arcgis/rest/services/Hoogtebestand/AHN5_DSM_50cm/ImageServer): daken, randen, opbouwen, paviljoens. AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle; het AHN4 heeft ruis op het brugdak.
- [Wikipedia: Pontsteigergebouw](https://nl.wikipedia.org/wiki/Pontsteigergebouw): 92 m, Arons en Gelauff, opgeleverd 2019.
- Commons-foto's van alle kanten: [Gebouw aan het IJ](https://commons.wikimedia.org/wiki/File:Gebouw_aan_het_IJ.jpg) (frontaal vanaf het IJ: lagen, vakwerk, onderkant brug), [Pontsteiger in 2022](https://commons.wikimedia.org/wiki/File:Pontsteiger_in_2022.jpg), [juli 2018](https://commons.wikimedia.org/wiki/File:Pontsteigergebouw;_juli_2018.jpg), [Houthavens 2020-07-24 (09)](https://commons.wikimedia.org/wiki/File:Pontsteigergebouw,_Houthavens_(Amsterdam);_2020-07-24_(09).jpg), [foto 2](https://commons.wikimedia.org/wiki/File:Pontsteiger_foto_2.JPG), [2018.08.26 (2)](https://commons.wikimedia.org/wiki/File:Pontsteigergebouw_2018.08.26_(2).jpg), [mei 2020 (10)](https://commons.wikimedia.org/wiki/File:2020_Gebouw_Pontsteiger_mei_2020_(10).jpg).
