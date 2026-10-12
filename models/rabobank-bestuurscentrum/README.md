# Rabobank Bestuurscentrum (Utrecht)

Hoofdkantoor van de Rabobank aan de Croeselaan 18 in Utrecht. De torens zijn ontworpen door Rob Ligtvoet (Kraaijvanger Architects) en zijn sinds juni 2011 in gebruik. Ze heten ook wel de Verrekijker en zijn 105 m hoog.

De toren bestaat uit twee elliptische torens die over de volle hoogte met een holle taille aan elkaar vastzitten. Elke toren heeft een eigen zinken kroon. Tussen de twee kronen blijft boven het tailledak een open uitsparing van ruim 10 m. De zuidtoren staat 26,9° gedraaid ten opzichte van de noordtoren.

Het BAG-pand omvat het hele complex:

- de onderbouw van 2011 met een raster van ronde daklichten;
- de glazen hal onder een luifel langs de Croeselaan;
- het kantoor van 1984: glazen vleugels die in terrassen van één laag aflopen, met schuine glazen overgangen en een hoge kop;
- het zuidblok met installatiehuizen en de loopbrug naar het zuiden;
- een tuindek met glazen piramide en een plint rondom.

Het model bestaat uit benoemde ellipsen, prisma's, hulls en vlakken in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-provinciehuis-noord-brabant.mjs` (gevelnissen per laag op `efteling-kit.mjs`). Reproductie: `node scripts/generate-rabobank-bestuurscentrum.mjs`.

## Bestanden en plaatsing

- `rabobank-bestuurscentrum.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 16, 62.234 driehoeken).
- `rabobank-bestuurscentrum.json`: catalogusitem.
  - RD-oorsprong `[135934.345, 455317.08]`: midden tussen de middelpunten van de twee kronen (AHN5-ellipsfit).
  - `xAxis` 29,81°: langs het raster van het complex (BAG-gevels). +Y wijst naar het noordnoordwesten, waar de noordtoren staat. De Croeselaan ligt aan −X.
- `rabobank-bestuurscentrum-1-1000.stl`: millimeters, Z omhoog, 170,9 × 172,3 × 107,1 mm, vlakke voet.

z = 0 ligt op NAP +2,3 m, de stoep aan de Croeselaan (AHN-DTM +2,27 tot +2,31). De onderkant ligt op −1,5 (NAP +0,8), onder het plein aan de zuidzijde (+1,4) en het maaiveld aan de noordzijde (+1,6). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op de stoep langs de luifel (`[−30,−50] [−30,0] [−30,50] [−30,90]`). Het lagere plein aan de zuidzijde (PDOK 44,86) blijft erbuiten.
- `groundHeight` 45,65 is de PDOK-weghoogte op die punten (ellipsoïdisch, 45,65 tot 45,68, gemeten op 12 oktober 2026 in de terreintegel).

Het model vervangt één BAG-pand, `0344100000018495`: torens, onderbouw, hal, kantoor van 1984, zuidblok en dekken zijn samen één pand (bouwjaar 1984, 19.500 m²). PDOK reconstrueert het als LoD2.2.

De twee opgangen op het plein zijn eigen panden en blijven PDOK:

- `0344100000136506`: PDOK +6,5, AHN +6,5;
- `0344100000136505`: PDOK +2,6, AHN +6,4. PDOK is hier te laag, niet te hoog, dus het pand is niet overgenomen.

De buurpanden ten zuiden (`0344100000001671` en `0344100000074678`) kloppen met het AHN. De loopbrug houdt 0,5 m voor de gevel van `0344100000074678` op.

## Onderdelen (hoogtes NAP)

### Torens

- **Plattegrond** (AHN5-contourfit):
  - twee ellipsen met halve assen van 20,5 × 13,45 m (41,0 × 26,9 m), 40,1 m uit elkaar;
  - noordtoren op 29,04° in RD, zuidtoren op 55,97°;
  - de holle tailles zijn cirkelbogen (oost R 16,57 m, west R 15,8 m), die vrijwel raken aan de ellipsen.
- **Glas**: 27 lagen van 3,51 m van +2,3 tot **+97,1**. Glasbanden liggen 0,35 m terug tussen borstweringsbanden van 0,9 m. De bovenste band loopt door tot de lijst onder de kroon.
- **Tailledak** op **+97,1** met een rand van 2 m langs de holle gevels tot **+98,0** (AHN5 97,7 tot 98,0).
- **Kronen**: ellipsen van 19,9 × 12,85 m, 0,6 m achter de glasgevel (de witte lijst), van +97,1 tot **+107,45**:
  - een wand van 1,2 m;
  - een donkere voeg van +101,4 tot +102,3, 0,35 m diep;
  - binnenin het dak op **+104,4** met per toren zes installatieblokken tot +107,13 à **+107,94**, puntsymmetrisch tussen de torens (AHN5).
- **Uitsparing**: tussen de kronen is boven het tailledak niets. De opening is 10,35 m hoog en aan de smalste kant ca. 13 m breed.

### Onderbouw, hal en luifel (2011)

- **Onderbouw** tot **+13,9** (AHN5 13,6 tot 14,1) rond de torens, met drie glasbanden in de gevels aan het plein.
- **42 ronde daklichten** van 5,6 m op een raster van 8,1 m (AHN5). Ze zijn 0,9 m hoog gemaakt voor de print; in het AHN zijn ze ca. 0,4 m.
- **Schuine glazen overgangen** van het onderbouwdak naar de westgevel van de middenvleugel van 1984, met afgeronde einden (AHN5: van +14 op 4,6 m voor de gevel tot ca. +33,5).
- **Glazen hal** langs de Croeselaan tot +9,2, met een glasband.
- **Luifel** van +9,2 tot **+10,2** over 27 × 166 m. De luifel steekt 7,8 m buiten de hal uit en loopt om de noordwesthoek. Hij staat op kolommen van 0,9 m op 8,1 m langs de buitenrand en op twee ronde kolommen van 2,4 m voor de taille (BAG-halfcirkels).

### Kantoor van 1984

- **Omtrek** uit het AHN5 boven +19,5, met de BAG waar die samenvalt. Pijlpunten aan de west-, zuid- en haakvleugel.
- **Terrassen** van één laag (3,6 m), elk met een schuine glazen overgang van 1,5 tot 4,6 m naar het lagere terras (AHN5-profielen langs de vleugelassen):
  - midden **+41,2**;
  - westvleugel +37,6, +34,0, +30,4 (punt);
  - noordstrook langs de westvleugel +28,6, +24,75, +21,15 (aflopend naar de kop);
  - middenvleugel naar het zuiden +37,6, +34,0, +30,4;
  - zuidvleugel +26,8, +25,0, met twee opbouwen van +25,9 en +27,5;
  - oostvleugel +37,6, +34,0, +30,4;
  - haak naar het zuiden +26,8, +25,0.
- **Kop** tot **+47,0** met schuine zijden van 45° naar het middendeel en een lichthof tot +41,2.
- **Glasgevels**: per laag een glasband van 2,0 m, 0,35 m diep, tot de bovenste volle laag onder elk terras.

### Zuidblok, loopbrug, dekken en plint

- **Zuidblok** tot **+17,85** (47,5 × 32 m, afgeschuinde hoeken) met glasbanden. Op het dak staan twee installatiehuizen tot **+21,8** en een installatiestrook tot +19,5.
- **Loopbrug** van 6,0 m breed naar het zuiden met een tonvormig dak (rand **+12,6**, midden **+13,7**). De onderkant ligt op +8,0, met twee pijlers.
- **Tuindek** naast de oostvleugel. Het dak volgt het AHN5-vlak (+10,6 tot +11,3), 4 m binnen de schuine BAG-gevel. Daarop staat een **glazen piramide** op een driehoek tot **+16,3**.
- **Laag dek** tussen de middenvleugel en de binnentuin (+10,2).
- **Lage daken** van +8,8 langs de noordzijde van de westvleugel, aan de punt van de zuidvleugel en aan de punt van de haak.
- **Plint** tot **+5,9** rondom, binnen de BAG-omtrek. Aan de noordwestzijde ligt een hellingbaan (+3,5).

## Geschat en weggelaten

Geschat:

- **Torenlagen**: 27 lagen van 3,51 m. Wikipedia noemt een brand op de 25e en 26e etage; de foto's tonen drie lagen hoogte in de kroon. De glasbanden staan 0,35 m terug tussen banden van 0,9 m.
- **Kroon**: de rand ligt 0,6 m terug van de glasgevel (verschil tussen de AHN5-contouren). De wand van 1,2 m komt uit het AHN5, de voeg uit foto's.
- **Holle tailles**: de cirkelbogen zijn op het middendeel gefit. Bij de aansluiting op de ellipsen ligt een smalle strook van hooguit 1 m buiten de AHN-contour; de oppervlakken komen binnen 3 % overeen.
- **Luifel en hal**: de plaatdikte en de kolommen komen uit foto's. De hal is een dicht volume met een glasband.
- **Daklichten**: hoogte vergroot tot 0,9 m. Positie en doorsnede komen uit het AHN5.
- **Kantoor van 1984**: de terrashoogtes en overgangen komen uit het AHN5, de glasbanden uit foto's (RCE 20339908). De kleine knik boven aan elke schuine overgang (+0,5 m) is weggelaten.
- **Loopbrug**: de onderkant (+8,0) en de pijlers zijn geschat.
- **Tuindek**: één dakvlak. De piramide komt uit de AHN5-omtrek op +12,8 en de top.

Weggelaten:

- **Verticale stijlen** van de torengevels en het rasterwerk van de glasgevels van 1984: dunner dan 0,9 m.
- **Rabobank-letters en logo's** op de kroon en de gevels: reliëf dunner dan 0,9 m.
- **Baksteen pylonen bij de ingang** aan de binnentuin (RCE-foto): positie en maten niet uit het AHN af te leiden.
- **Twee ronde daklichten op het tuindek** en een lage opbouw op het plein (+4,0): lager dan 0,9 m boven hun dak, of los van het gebouw.
- **De binnentuin met de waterloop** en het plein aan de zuidzijde: maaiveld, staat in het PDOK-terrein.
- **De opgangen op het plein**: eigen BAG-panden (zie boven).

## Controle (12 oktober 2026)

- **Generator**: `NoError`, één deel, genus 16, 496.183 m³. Twee keer draaien geeft byte-identieke bestanden.
  - Ondervlakken: de luifel (1.171 m² op +9,2), de loopbrug, de plafonds van de glasbanden en de lijst onder de kroon.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`. De eigen test controleert:
  - catalogus, vervangen pand, `groundHeight`, voet (−1,5) en top (+107,94);
  - beide kronen (ellipsen tot +107,45, gedraaid op −0,77° en 26,16°) en de schacht tot +97,1;
  - de open uitsparing tussen de kronen boven de tailledakrand (+98,0);
  - het kroondak, de voeg en de borstweringsbanden van 27 lagen;
  - de terrassen en de kop van het kantoor van 1984;
  - de onderbouw met 42 daklichten en de luifel;
  - zuidblok, loopbrug (open eronder) en piramide.
- **Printcheck** op 1:1000 bij 45° (`supportedSolid`, gedeeld zoals in de export): 496.177 → 501.637 mm³, 1,1 % opvulling.
  - De opvulling zit vrijwel helemaal onder 9 mm: wiggen onder de luifel naar de kolommen en een wand onder de loopbrug.
  - **De uitsparing tussen de kronen blijft open.** Doorsneden dwars op de torenas (v = −2,7, 0,3 en 3,3 mm, van het tailledak tot de kroonrand) zijn 3,3 % gevuld, en dat is alleen de rand op +98,0. De opening wijst omhoog, dus de export hoeft er niets onder te vullen.
  - De kronen, de torenbanden en de terrassen printen zonder opvulling (doorsneden boven 9 mm voor en na gelijk, op de 0,35 m-wig onder de plafonds van de glasbanden na).
- **Renders** naast de PDOK-reconstructie op −35°, 55°, 145° en 235° (30° hoogte) en naast Commons-foto's.
  - PDOK heeft de twee torens met kronen, de installaties en de terrassen van 1984, maar gladde gevels zonder lagen. De luifel, de daklichten, de kroonvoeg en de loopbrug ontbreken.
  - Het model heeft per kant meer:
    - **Zuidzijde (−35°)**: de 27 glasbanden op de zuidtoren, de daklichten op de onderbouw, het zuidblok met installatiehuizen en de loopbrug.
    - **Westzijde (55°)**: de luifel op kolommen langs de Croeselaan, de holle taille met banden, de open uitsparing tussen de kronen en de getrapte westvleugel met glasbanden.
    - **Noordzijde (145°)**: de terrassen van de westvleugel en de noordstrook met schuine overgangen, de kop met lichthof, de plint en de lage daken.
    - **Oostzijde (235°)**: de oostvleugel en de haak in terrassen, het tuindek met de piramide, de schuine overgangen van de onderbouw naar de middenvleugel en de kroonvoeg.

## Bronnen

- PDOK BAG `0344100000018495` en Actueel_orthoHR; PDOK-gebouwtegels en terrein; 12 oktober 2026.
- AHN5 DSM 0,5 m (opname 2023), [ahn.arcgisonline.nl](https://ahn.arcgisonline.nl/arcgis/rest/services/Hoogtebestand/AHN5_DSM_50cm/ImageServer). Daaruit komen de ellipsen, kronen en installaties, het tailledak, de terrassen en overgangen van 1984, de kop, de onderbouw met daklichten, de luifel, de plint, het zuidblok, de loopbrug en het tuindek. AHN4 DSM/DTM 0,5 m (PDOK WCS) is gebruikt ter controle en voor het maaiveld; het AHN4 heeft ruis op de torens.
- [Wikipedia: Rabobank Bestuurscentrum](https://nl.wikipedia.org/wiki/Rabobank_Bestuurscentrum): 105 m, in gebruik sinds juni 2011, Kraaijvanger Architects; het complex van 1984 aan de Croeselaan 18.
- Commons-foto's:
  - [Rabotoren](https://commons.wikimedia.org/wiki/File:Rabotoren.jpg): taille, kronen met voeg, lagen;
  - [Rabotoren Utrecht in augustus 2026 2](https://commons.wikimedia.org/wiki/File:Rabotoren_Utrecht_in_augustus_2026_2.jpg);
  - [hoofdkantoor van de Rabobank foto4](https://commons.wikimedia.org/wiki/File:Utrecht,_hoofdkantoor_van_de_Rabobank_foto4_2015-11-01_12.03.jpg): luifel op kolommen;
  - [Glazen torens aan de Croeselaan](https://commons.wikimedia.org/wiki/File:Glazen_torens_aan_de_Croeselaan.jpg);
  - [Rabobank Bestuurscentrum Utrecht](https://commons.wikimedia.org/wiki/File:Rabobank_Bestuurscentrum_Utrecht.jpg);
  - [Utrecht6](https://commons.wikimedia.org/wiki/File:Utrecht6.JPG): kantoor van 1984 vanaf het station met de schuine overgangen;
  - [RCE 20339908](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_VOORGEVEL_-_Utrecht_-_20339908_-_RCE.jpg): kantoor van 1984.
