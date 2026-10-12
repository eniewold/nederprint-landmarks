# Wonderwoods (Utrecht)

Gebouwencomplex met twee groene torens aan de Jaarbeursboulevard en de Croeselaan in het Beurskwartier, gebouwd van 2020 tot 2025 (hoogste punt januari 2024).

- **Introvert**, het oostelijke gebouw aan de hoek met de Croeselaan, is van Stefano Boeri Architetti. Het is een verticaal bos van ca. 105 m met verspringende balkons vol plantenbakken.
- **Extrovert**, het westelijke gebouw, is van MVSA Architects. Het is een donkere woontoren van ca. 73 m in een witte kantoorvleugel van elf lagen, die in afgeronde terrassen afloopt naar de boulevard.

Beide gebouwen staan op één BAG-pand. Een smalle doorgang scheidt ze en is aan de noordkant op parkniveau overkapt. Op de onderbouwen ligt een dakpark op ca. 25 m.

Het model bestaat uit benoemde prisma's, hulls en vlakken in een eigen gebouwstelsel, met gevelbanden, nissen en balkonplaten. Er zijn geen gestapelde DSM-lagen gebruikt. Al het groen is weggelaten; de plantenbakken zijn dichte platen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-rabobank-bestuurscentrum.mjs` (gevelbanden op `efteling-kit.mjs`). Reproductie: `node scripts/generate-wonderwoods.mjs`.

## Bestanden en plaatsing

- `wonderwoods.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, ca. 21.500 driehoeken).
- `wonderwoods.json`: catalogusitem.
  - RD-oorsprong `[135700, 455440]`: in de doorgang tussen de twee gebouwen.
  - `xAxis` 49,9°: langs de Jaarbeursboulevard naar de Croeselaan (BAG-gevels op 49,7 tot 50,1°). +Y wijst naar het Jaarbeursplein (noordwest).
- `wonderwoods-1-1000.stl`: millimeters, Z omhoog, 135 × 77 × 108 mm, vlakke voet.

z = 0 ligt op NAP +2,2 m, de stoep rondom (AHN5-DTM +2,0 tot +2,4; aan de Croeselaan +2,5). De onderkant ligt op −0,8 (NAP +1,4). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op de stoep langs de Jaarbeursboulevard, het Jaarbeursplein en de westgevel. PDOK geeft daar 45,43 tot 45,61 (ellipsoïdisch). De iets hogere Croeselaan (45,8 tot 45,9) blijft erbuiten.
- `groundHeight` 45,45 is de PDOK-terreinhoogte op die punten (gemeten op 12 oktober 2026). PDOK-maaiveld is hier ongeveer NAP + 43,25 m.

Het model vervangt één BAG-pand: `0344100000151919` (bouwjaar 2025, status "Pand in gebruik (niet ingemeten)" in de PDOK-tegel). PDOK reconstrueert het als één vlak blok tot ca. NAP +50, de bouwfase uit het AHN5. Geen buurpand raakt het model.

## Bronnen en hun ouderdom

- **AHN4** (PDOK): een leeg bouwterrein.
- **AHN5** (opname 2023) en de **3D BAG** (op het AHN5): de bouwfase. De onderbouwen met het parkdak (+26,4 tot +27,4), de terrassen van de kantoorvleugel en de westvleugel van de Introvert staan erin. De torens zijn pas tot ca. +48 gebouwd, met kranen ertussen.
- **Luchtfoto's 2025 en 2026** (`2025_orthoHR`, `Actueel_orthoHR` = 2026): de daken van de afgebouwde torens. Beide foto's laten de daken scheef staan:
  - 2026: ca. 0,065 m per m hoogte naar +X en 0,02 naar +Y;
  - 2025: ca. 0,07 naar −X en 0,09 naar −Y.

  Dat is afgeleid uit het verschil tussen de twee jaren, de AHN5-randen van de torenschachten en de zichtbare gevelstroken naast de daken. In 2026 staan de toren ernaast (BAG 0344100000148526) en het Rabobank Bestuurscentrum vrijwel recht. De plattegronden van beide torens zijn hiervoor gecorrigeerd; de onzekerheid is ca. 2 m.
- **Hoogtes van de torens**: gepubliceerd door Stefano Boeri Architetti (ca. 105 m) en MVSA (ca. 73 m). Wikipedia noemt 107 m.

## Onderdelen (hoogtes NAP)

### Introvert (oost)

- **Onderbouw** tot het **parkdak op +27,0**. De buitenrand komt uit het AHN5 en de luchtfoto: de westrand op u = 8,0, de noordwestrand op v = 34,2, de noordoostrand evenwijdig aan de Croeselaan en een schuine zuidoostrand evenwijdig aan de BAG. Die rand ligt 3,5 tot 5 m buiten de BAG-gevels.
  - De gevel zelf ligt 3,0 m binnen die rand.
  - Rondom zit per laag (3,3 m, begane grond 5 m) een plantenbak als plaat van 1,2 m.
  - Achter de bakken lopen glasbanden.
- **Toren** op een trapezium: de zuidwestgevel op u = 27,5, de noordoostgevel op u = 50,0 en de noordwestgevel op v = 24,0. De zuidoostgevel staat schuin, op 18,2° van +X.
  - **Middenmoot** tot **+45,5**: aan de zuidoostkant 7,8 m dieper, tot de schuine AHN5-rand van 2023. Op die trede ligt een terras met een plantenbak tot +46,5.
  - **Toren** daarboven tot het **dak op +105,7**, met een **dakrand op +107,2**.
- **Lagen**: 6 lagen in de middenmoot (3,08 m) en 19 in de toren (3,17 m). Met de onderbouw zijn dat 31 lagen.
- **Balkons** met plantenbakken op de zuidwest-, noordoost- en noordwestgevel. Het zijn platen van 1,2 m die 2,6 m uitsteken, 5,4 m breed op traveeën van 6,4 m, per laag verspringend in een dambordpatroon.
- **Zuidoostgevel**: vlak, met losse ramen als nissen van 0,35 m (1,6 × 1,8 m), per laag verspringend.
- **Westvleugel** tot **+46,0** (AHN5 +45 tot +47), met balkons op de zuidwest- en noordwestgevel en glasbanden.
- **Dakinstallaties** (luchtfoto 2026) tot +107,6, +108,2 en een opbouw tot **+109,0**.

### Extrovert (west)

- **Witte kantoorvleugel**: buitenrand u −58,5 tot 1,0 en v −27,4 tot 32,8, met afgeronde hoeken (r = 3 m).
  - Bovenkant **+50,0** aan de west- en zuidkant van de donkere toren.
  - Afgeronde terrassen naar de Jaarbeursboulevard op **+39,5, +33,0, +28,0, +23,0 en +20,0**, en een lage strook langs de boulevard op **+15,0**.
  - Het glazen atriumdak ligt op +23,0, de doorgangskant op +19,0 en de westrand op +23,5.
  - Aan de westgevel staat een opbouw tot +39,0.
  - Alle hoogtes komen uit het AHN5.
  - Glasbanden per kantoorlaag van 3,6 m.
- **Parkdak +27,0** aan de noord- en oostkant.
- **Donkere toren**: u −44,5 tot −11,5 en v −5,0 tot 23,0, met afgeronde hoeken (r = 4 m).
  - Dakrand **+75,2**, groen dak +74,0, opbouwen tot +76,5 en **+77,0**.
  - Lagen van 3,15 m met vloerbanden.
  - Op de rechte gevels bruine stijlen van 0,9 m op 3,0 m, zodat de glasbanden ramen worden.

### Doorgang

De doorgang ligt tussen u = 1,0 en 8,0 en is op straatniveau open. Aan de noordkant (v 15 tot 31) is ze overkapt op parkniveau, van **+23,5 tot +27,0**: dat is de verbinding van het dakpark tussen de twee gebouwen.

## Geschat en weggelaten

- **Torenhoogtes**: de ronde gepubliceerde maten van ca. 105 m en ca. 73 m boven maaiveld; geen AHN-meting. De dakrand van de Introvert ligt daarom op +107,2 en die van de Extrovert op +75,2.
- **Plattegronden van de torens** komen uit de daken op de luchtfoto's 2025 en 2026, gecorrigeerd voor de scheefstand (ca. ±2 m). De schuine zuidoostgevel en de trede komen uit het AHN5 en de luchtfoto's.
- **Trede van de Introvert op +45,5**: uit het AHN5 en de verhouding op de foto van 2024 (ca. 43 m boven maaiveld).
- **Lagen**: 6 + 6 + 19, wat past bij de 31 lagen uit de vakpers.
- **Balkons**: in het echt elk anders, met plantenbakken en bomen. Het model maakt er een regelmatig dambord van dichte platen van.
- **Plantenbakken van de onderbouw**: 3,0 m diep rondom en per laag gelijk. Het AHN5 en de luchtfoto liggen 3,5 tot 5 m buiten de BAG-gevels.
- **Glasbanden en stijlen**: per laag van 3,6 m (kantoor) en 3,15 m (donkere toren), uit foto's geschat.
- **Overkapping van de doorgang**: een laag dik geschat.
- **Dakopbouwen**: plaats uit de luchtfoto 2026, hoogtes geschat.
- **Weggelaten**:
  - alle bomen, struiken en het groen in de bakken;
  - balkonhekken, gevelstijlen van de Introvert en kleine plantenbakken (kleiner dan 0,9 m);
  - de bouwkranen in het AHN5;
  - een smalle opbouw op het atriumdak (AHN5 +41, alleen in de bouwfase te zien).

## Controle

- `node scripts/generate-wonderwoods.mjs` geeft een gesloten, verbonden model (één deel). Twee keer draaien geeft byte-identieke bestanden.
- In `tests/landmark-models.test.ts` van de webshop staat de test "places Wonderwoods with the Introvert's planter podium, stepped trapezoid tower and staggered balconies, …". Die controleert:
  - de oorsprong, het BAG-pand en de maaiveldhoogte;
  - de dakrand en het dak van de Introvert op het trapezium, de trede met plantenbak en dat daarboven niets op de trede staat;
  - de balkons op drie gevels en de ramen in de zuidoostgevel;
  - de westvleugel, het parkdak en de gevel binnen de plantenbakken;
  - de donkere toren met dak en opbouw, de kantoorvleugel en alle terrassen, en de glasbanden met stijlen;
  - de open doorgang onder de overkapping.
- **Printcontrole op 1:1000** (`supportedSolid`, 45°): 304.529 → 315.308 mm³, dat is +3,5 %.
  - De export vult onder de balkons en de plantenbakken met wiggen.
  - Onder de overkapping van de doorgang (7 m breed, vlak plafond) groeit vanaf de open einden een wig en blijft in het midden een dunne wand tot de onderplaat. Onder +15,5 m blijft de doorgang verder open.
- **Renders**: van vier kanten naast de PDOK-reconstructie (één blok) en tegen Commons-foto's vergeleken. Die renders horen niet in deze repo.

## Bronnen

- PDOK: BAG-pand 0344100000151919, Actueel_orthoHR (2026), 2025_orthoHR en 2024_orthoHR, gebouwtegels en terrein (12 oktober 2026).
- AHN5 DSM/DTM 0,5 m (opname 2023, bouwfase), `ahn.arcgisonline.nl` Hoogtebestand; AHN4 DSM/DTM 0,5 m (PDOK WCS, leeg terrein); 3D BAG (AHN5, bouwfase).
- https://nl.wikipedia.org/wiki/Wonderwoods
- https://stefanoboeriarchitetti.net/en/?p=62973 (ca. 105 m en ca. 73 m)
- https://mvsa-architects.com/project/wonderwoods/
- Wikimedia Commons:
  - `Wonderwoods_Utrecht_in_2024.jpg`
  - `Woontoren_Introvert_September_2024.jpg`
  - `Woontoren_Introvert_Utrecht_2026.jpg`
  - `Woontoren_Introvert_Utrecht.jpg`
  - `Woontoren_Extrovert.jpg`
  - `Wonderwoods_Utrecht.jpg`
  - `Balkons_van_woontoren_Introvert_Utrecht.jpg`
