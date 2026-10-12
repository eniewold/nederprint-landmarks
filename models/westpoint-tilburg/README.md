# Westpoint (Tilburg)

Wooncomplex op de hoek van de Hart van Brabantlaan en de Ringbaan-West, ontworpen door Margriet Eugelink (Van Aken Architektuur) en opgeleverd in 2004. De woontoren is ruim 140 m hoog en telt 47 verdiepingen; bij oplevering was het de hoogste woontoren van Nederland. Aan de toren vast liggen de lagere Westpoint Wing (elf woonlagen) en een onderbouw met winkels en een parkeergarage onder een daktuin. Het hele complex is één BAG-pand.

De toren is een doos van 30,0 × 27,5 m op een glazen plint van twee lagen. De noord- en zuidgevel zijn donkere vlakken met een regelmatig raster van kleine vensters tussen lichte hoekbanden. De oost- en westgevel hebben een wit betonraster van vier traveeën en cellen van twee lagen, dat voor de glasgevel staat; de beeldend kunstenaar Herman Kuijer gaf de elementen kleur.

Het model bestaat uit benoemde prisma's en vlakken in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-vestedatoren.mjs` (gevelnissen op `efteling-kit.mjs`). Reproductie: `node scripts/generate-westpoint-tilburg.mjs`.

## Bestanden en plaatsing

- `westpoint-tilburg.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 0, 28.784 driehoeken).
- `westpoint-tilburg.json`: catalogusitem.
  - RD-oorsprong `[132692.5, 396853.5]`: bij het hart van de toren.
  - `xAxis` −5,27°: langs de noordgevel van de toren naar het oosten. +Y wijst naar de Hart van Brabantlaan (noord); de Wing ligt aan −X, −Y langs de Ringbaan-West.
- `westpoint-tilburg-1-1000.stl`: millimeters, Z omhoog, 71,0 × 89,0 × 143,1 mm, vlakke voet.

z = 0 ligt op NAP +15,4 m, het maaiveld rond het complex (AHN4-DTM +15,2 tot +15,5). De onderkant ligt op −1,5 (NAP +13,9), onder de stoep aan de zuidkant (+14,3 tot +15,0). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op het plein ten westen van de toren, bij de passage en naast de onderbouw (`[−20,8] [−20,−2] [20,15] [20,−60] [−44,−65]`). PDOK geeft daar 59,24 tot 59,38 (ellipsoïdisch). De rijbaan aan de noordkant (59,09) en de lagere straat aan de zuidkant (56,9 tot 58,5) blijven erbuiten.
- `groundHeight` 59,25 is NAP +15,4 plus 43,85, het verschil tussen het PDOK-terrein en het AHN-maaiveld hier (gemeten op 12 oktober 2026 in de terreintegel).

Het model vervangt BAG-pand `0855100000310704` (bouwjaar 2002): toren, Wing en onderbouw. PDOK reconstrueert het als een gladde doos tot +156,9 met één blok op het dak, een blok voor de Wing en een plat dak over de onderbouw. Het oostelijke buurpand `0855100000397837` blijft PDOK; de PDOK-hoogte (+35,0) past bij het AHN5 (mediaan +34,5).

## Onderdelen (hoogtes NAP)

### Toren

- **Doos** van 30,0 × 27,5 m (AHN5-rand), met de gevels op −5,27° in RD (BAG). De BAG-voetlijn ligt 0,4 tot 0,6 m binnen de doos: dat is de glazen plint.
- **Glazen plint** van twee lagen tot **+24,0**, 0,6 m terug onder de doos, met glasvakken van 2,4 m als nissen van 0,3 m. De onderkant van de toren ligt gelijk met de daktuin.
- **Noord- en zuidgevel**: lichte hoekbanden van 2,2 m over de volle hoogte. Daartussen een donker vlak dat 0,3 m terugligt, met 12 vensters per laag van 1,0 × 1,3 m als nissen van 0,35 m, in 44 lagen van 2,92 m.
- **Oost- en westgevel**: een betonraster van vijf lisenen en een band per cel, 1,6 m buiten de doos (AHN5: 1,5 tot 1,75 m), van +24,0 tot **+152,3**. Er zijn vier traveeën van 5,75 m en 22 cellen van twee lagen (5,83 m). De glasgevel ligt in elke cel 0,6 m terug in de doos.
- **Kroon en dak**:
  - een kroonrand van 1,0 m rondom tot **+153,85** (AHN5 153,8 tot 153,9), het dak op **+152,5**;
  - midden op het dak een verhoogd vlak op +153,5 met een strook tot +154,4 en een installatieopbouw van 10,25 × 10,25 m tot **+157,0** (AHN5 156,9 tot 157,1; 3D BAG max 156,93);
  - in de zuidwesthoek een verhoging tot +153,8 met een liftopbouw van 1,0 m breed tot **+155,9**.

### Wing

- Schijf van 15,4 × 54,8 m langs de Ringbaan-West, dak op **+49,95** binnen een rand van 0,9 m tot **+50,75** (AHN5).
- **Winkelplint** tot +21,2 aan de west- en zuidgevel, 0,6 m terug.
- **Elf woonlagen** van 2,61 m. Op de lange gevels raambanden van 1,4 m hoog en 0,35 m diep (aan de tuinzijde boven de daktuin), met witte balkons van 2,0 × 1,0 m, drie per laag en gevel, om de laag verspringend. In de kopgevels zes vensters per laag.
- **Dak**: twee groepen luchtkanalen tot +51,35 en drie schachten tot +55,95, +56,5 en +55,4 (AHN5).

### Onderbouw en passage

- **Onderbouw** op de BAG-voetafdruk, met lage daken op **+21,2** aan de noord- en zuidkop van de Wing (rand +22,3 aan de Ringbaan-West).
- **Daktuin** op **+24,2** tussen de Wing en de oostrand, met een rand van 1,0 m tot +24,6 aan de west-, oost- en zuidkant.
- **Rijstrook** op **+21,2** langs de oostkant, met een borstwering tot +22,3.
- In de zuid- en oostgevel hoge vensters van 1,4 × 2,8 m als nissen.
- **Glazen passage** tussen de toren en het oostelijke buurpand, dak op **+21,9** (AHN5 21,7 tot 22,0), ruim 13 m breed (van de toren tot het buurpand) en 31 m lang, met glasvakken in de noordgevel. De passage heeft geen eigen BAG-pand; ze loopt tot 0,1 m van het buurpand.

## Geschat en weggelaten

- **Lagen**: op een verre foto vallen twee vensterrijen in de dichte gevels op één rastercel, en één vensterrij komt op ongeveer 3,0 m. Het model heeft 44 lagen van 2,92 m tussen de plint en de bovenkant van het raster; met de plint van twee lagen en het dak sluit dat aan op de 47 verdiepingen uit Wikipedia.
- **Onderkant van de toren** (+24,0) en de plint van twee lagen komen uit foto's; de hoogte valt samen met de daktuin uit het AHN5.
- **Betonraster**: lisenen en banden zijn 0,9 m in plaats van ongeveer 0,4 m, zodat ze op 1:1000 printen. De gekleurde schuine wangen per laag en de balkonplaten tussen de twee lagen van een cel zijn weggelaten; de cel is één open vak voor de glasgevel.
- **Vensters** in de dichte gevels en de hoekbanden: aantal uit foto's, maat geschat.
- **Wing**: de plinthoogte, de laaghoogte, de raambanden, het aantal en de plaats van de balkons en de vensters in de kopgevels komen uit foto's of zijn geschat.
- **Onderbouw**: de vensters in de zuid- en oostgevel zijn geschat. De glazen passage is een gesloten blok; in het echt is het een glazen hal of overkapping.
- **Weggelaten**:
  - de antennes op de installatieopbouw (tot +161,1) en de paaltjes op de liftopbouw (dunner dan 0,9 m);
  - een dunne opstand van 0,5 m rond het dak op +154,7, vermoedelijk de rail van de gevelonderhoudsinstallatie;
  - de lage glazen trappenhuizen tussen de Wing en de daktuin, de paden in de tuin, fietsenstallingen en bomen.

## Controle

- `node scripts/generate-westpoint-tilburg.mjs` geeft een gesloten, verbonden model. Twee keer draaien geeft byte-identieke bestanden.
- In `tests/landmark-models.test.ts` van de webshop staat de test "places Westpoint's tower with the concrete raster on the east and west faces, …". Die controleert:
  - de oorsprong, het BAG-pand en de maaiveldhoogte;
  - de kroonrand op alle vier hoeken, het dak, de installatieopbouw en de liftopbouw;
  - het betonraster aan beide kanten tot +152,3, de glasgevel in de onderste en bovenste cel, en dat niets ten westen van het raster steekt buiten de Wing en de onderbouw;
  - vensters in de noord- en zuidgevel in de onderste en bovenste laag, en de teruggelegen glazen plint;
  - de rand en het dak van de Wing, een schacht en een balkon;
  - de daktuin met rand, de rijstrook met borstwering en de glazen passage.
- **Printcontrole op 1:1000** (`supportedSolid`, 45°): 172.328 → 175.019 mm³, dat is +1,56 %.
  - De export vult onder de banden van het raster (tot +92 mm² per doorsnede), onder de balkons van de Wing en onder de overstek van de toren boven de plint.
  - De rastercellen en de balkons blijven als nis zichtbaar.
- **Renders**: van vier kanten naast de PDOK-reconstructie en tegen Commons-foto's vergeleken. Die renders horen niet in deze repo.

## Bronnen

- PDOK: BAG-pand 0855100000310704, Actueel_orthoHR, gebouwtegels en terrein (12 oktober 2026).
- AHN5 DSM 0,5 m, `ahn.arcgisonline.nl` Hoogtebestand/AHN5_DSM_50cm; AHN4 DTM 0,5 m (PDOK WCS); 3D BAG.
- https://nl.wikipedia.org/wiki/Westpoint_(Tilburg)
- Wikimedia Commons:
  - `Tilburg_westpoint.jpg`
  - `Tilburg_westpoint2.jpg`
  - `Tilburg_westpoint3.jpg`
  - `Westpoint_toren_Tilburg_2014_-_1.JPG`
  - `Westpoint_toren_Tilburg_2014_-_2.JPG`
  - `Westpoint_toren_Tilburg_2014_-_3.JPG`
  - `Westpoint-woontoren_-_Tilburg_-_2009_-_panoramio.jpg`
  - `2022RedheadDays-13.jpg`
