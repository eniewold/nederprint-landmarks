# JuBi (Den Haag)

Rijkskantoor aan de Turfmarkt in het Wijnhavenkwartier (Hans Kollhoff, 2012) voor de ministeries van Justitie en Veiligheid (rode toren) en Binnenlandse Zaken en Koninkrijksrelaties (witte toren). Twee torens van 146 m met 37 lagen staan op een gezamenlijke onderbouw, met tussen de torens een glazen atrium met de hoofdingang aan het plein aan de Turfmarkt. Eén BAG-pand omvat het hele complex. Het model bestaat uit benoemde prisma's, terugsprongen, kantelen en nissen in een eigen gebouwstelsel, zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-hoftoren.mjs` en `generate-de-kroon-den-haag.mjs` (de buurman). Reproductie: `node scripts/generate-jubi.mjs`.

## Bestanden en plaatsing

- `jubi.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 67.818 driehoeken).
- `jubi.json`: catalogusitem.
  - RD-oorsprong `[81975, 455072]`: in het atrium, bij de noordoosthoek van de witte toren.
  - `xAxis` 37,4°: langs de zuidoostgevel van de BAG-contour. De haakse gevels van beide torens en de onderbouw lopen langs dezelfde assen (BAG 37,4° en 127,4°).
  - +X loopt naar het noordoosten, naar de rode toren en het water. +Y wijst naar het noordwesten, naar het plein aan de Turfmarkt. −X is de muur met De Kroon.
- `jubi-1-1000.stl`: millimeters, Z omhoog, 83,5 × 71,8 × 150,5 mm, vlakke voet.

z = 0 ligt op NAP +0,72 m: de straten rondom liggen op +0,69 tot +0,98 (AHN-DTM), het plein aan de Turfmarkt loopt op tot +1,5. De voet loopt door tot −1,2 m. `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de straten aan de zuidoost- en noordoostkant en op het plein: `[−30,−39] [10,−39] [45,0] [45,30] [10,38] [−25,25]`.

Het model vervangt alleen BAG `0518100001635181` (bouwjaar 2012). Dat pand is het hele complex van 84 × 72 m: beide torens, de onderbouw en het atrium. Er vallen geen andere panden onder.

- De Kroon (`0518100000299585`, eigen landmark `de-kroon-den-haag`) grenst aan de westkant. De gemeenschappelijke muur ligt op de BAG-lijn x = −40,79..−40,89; dit model blijft 0,03 m daarbinnen (x ≥ −40,86) en overlapt De Kroon niet.
- De Hoftoren en Castalia (eigen landmarks) liggen 130 tot 180 m noordelijker.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Torens

Geen van beide torens is een rechthoek: elk heeft twee haakse en twee schuine gevels, gemeten op de AHN-rand per meter.

- **Witte toren (BZK)**, aan −X: zuid- en oostgevel haaks, de westgevel loopt 9° schuin (x = −29,4 − 0,1625 y) en de noordgevel volgt de schuine BAG-lijn naar het plein.
  - **Onderdeel tot +88,1**: de westgevel staat 2,2 m verder naar buiten en de noordgevel loopt aan de westkant door tot de BAG-lijn (3D BAG-terras 88,12, AHN 88).
  - **Romp tot +139,4**: boven +88,1 de smallere schacht. De noordgevel buigt 17 m van de westhoek naar binnen en ligt aan de westkant 1 tot 3 m achter de BAG-lijn (AHN).
  - **Zuidoosthoek**: boven +123,5 springt een strook van 2,8 × 14,8 m terug (3D BAG 123,5, AHN 123).
- **Rode toren (Justitie)**, aan +X: noord- en oostgevel haaks. De zuidgevel loopt 18° schuin en de westgevel naar het plein 26°; daardoor wijst de toren met een spitse hoek van 64° naar het plein.
  - **Onderdeel tot +105,9**: de oostgevel staat op de BAG-gevel aan het water. Boven +105,9 springt de oostgevel 3,1 m terug en de noordgevel naast de oostgevel 2,5 m (3D BAG 105,4–105,9, AHN 106). Daardoor heeft de schacht een inspringende noordoosthoek, de donkere verticale sleuf op de foto's.

### Kronen

Beide torens hebben dezelfde kroon (AHN langs de gevels, 3D BAG):

- **Kroonstijlen**: een ring van 1,0 m langs de gevels van +139,4 tot +147,2 (AHN, 98e percentiel 146,8–147,3), met per travee een open sleuf boven een borstwering tot +140,6. Zo staat op elke liseen een stenen stijl, zoals de "tanden" op de foto's.
- **Terras** op +139,4 achter de stijlen (3D BAG 139,4, AHN 139,3–139,4).
- **Dakopbouw** 2,5 m achter de gevel tot +144,67 (3D BAG 144,67, AHN 144,6).
- **Kleinere opbouw** tot +147,27 (3D BAG-vlakken, AHN 147).
- **Installatieblokje** tot +150,0 (3D BAG 149,95–150,2).
- **Terugsprongen**: dezelfde stijlen, 3,0 m hoog met een borstwering van 1,0 m, op de terugsprongen van +88,1, +105,9 en +123,5.

### Onderbouw en atrium

- **Onderbouw** tot +42,1 (3D BAG 42,05–42,16): het westdeel tussen De Kroon en de witte toren, en het oostdeel tussen de twee torens aan de zuidoostkant. Langs de zuidoostgevel staat de onderbouw boven +24,0 2,65 m terug (3D BAG 23,3–24,25), en het noordelijke uiteinde van het westdeel aan het plein is +24,0.
- **Daktuin** op het oostdeel: een rand tot +46,4 rond een tuin op +45,7 (3D BAG). De bomen zijn weggelaten.
- **Installatieblok** op het westdeel tot +43,5 (3D BAG).
- **Atrium** tussen de torens, tot +19,3 (3D BAG 19,16–19,35).
  - De glazen voorgevel staat aan het plein op de BAG-lijn x = 1,63.
  - Hij heeft zeven velden met een gouden kader. De velden zijn nissen van 0,35 m; kader en stijlen van 0,9 m blijven staan.
  - Het glazen dak ligt 0,6 m verdiept binnen een rand van 1,0 m.

### Gevelreliëf

37 lagen: een hoge begane grond tot +7,4 en 36 lagen van 3,55 m tot +135,2. Daarboven zit de kroon.

- **Torens**: één venster van 1,3 × 2,15 m per travee van 2,7 m per laag, als nis van 0,35 m. De stijlen ertussen blijven als lisenen staan.
  - De travees liggen per gevellijn op één raster, zodat de vensters boven en onder een terugsprong op één lijn staan.
  - Nissen staan alleen waar de gevel over de hele nis vrij ligt, dus niet achter de onderbouw of het atrium.
- **Plint**: de natuurstenen plint van beide torens eindigt met een doorlopende lijst van 0,3 m diep op +28,45 tot +29,3.
- **Begane grond**: ingangen en winkelpuien van 2,0 m breed van +1,1 tot +6,4 op alle straatgevels.
- **Onderbouw**: ramen van 1,5 m op hetzelfde raster.

## Geschat en weggelaten

Geschat:

- **Lagen en vensterritme**: 37 lagen (Wikipedia) verdeeld over een begane grond van 6,7 m en 36 lagen van 3,55 m. De travee van 2,7 m komt uit de afstand van de kroonstijlen in het AHN (2,75–2,9 m) en uit de foto's. De ramen zijn 1,3 × 2,15 m.
- **Kroon**: stijlen van 1,0 m op elke travee met een borstwering van 1,2 m. In werkelijkheid zijn de stijlen slanker en staan op de hoeken open portalen; 1,0 m is het minimum voor 1:1000.
- **Dakopbouw**: 2,5 m achter de gevel, zoals het AHN langs de meeste gevels toont (terras 1,5–2,5 m breed). Op de zuidgevel van de witte toren staat hij in werkelijkheid dichter op de gevel.
- **Stijlen op de terugsprongen**: 3,0 m hoog, uit foto's.
- **Plint**: natuursteen tot circa +29,3 (acht lagen op de foto's), hier als lijst.
- **Atrium**: het glazen dak heeft geen AHN-punten, dus de hoogte komt uit de 3D BAG. De zeven velden zijn geteld op een foto.
- **Schuine gevels**: afgeleid uit de AHN-rand per meter (pixels van 0,5 m). De noordgevel van de witte toren boven +88,1 bestaat uit twee rechte stukken.

Weggelaten:

- **Hekwerk** rond het voorplein, kozijnen, de gouden stijlen van het atrium en de horizontale banden tussen de vensters: kleiner dan 0,9 m.
- **Rand van 0,7 m** aan de zuidoostgevel van het westdeel tot +7 (3D BAG): smaller dan 0,9 m.
- **Bomen in de daktuin**: vegetatie, geen bouwwerk.
- **Kleine opbouwen** op de onderbouw (3D BAG +42,6 tot +42,9): lager dan 0,9 m.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 468.028 m³ (3D BAG LoD2.2: 483.733 m³), 4.017 nissen. De ondervlakken zijn alleen de bovenkanten van de nissen.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 392 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand en uitersten, ook dat het model niet over de muur met De Kroon komt;
  - de daken van atrium, onderbouw, installatieblok, daktuin, de drie terugsprongen, terras, opbouwen, kroonstijlen en installatieblokje;
  - de terugsprong van de westgevel van de witte toren, de zuidoosthoek boven +123,5 en de oostgevel en inspringende noordoosthoek van de rode toren;
  - de spitse hoek van de rode toren en de velden van het atrium;
  - de kantelen langs de noordgevel van de rode toren en de vensternissen in alle 36 lagen.
- **Printcheck** op 1:1000 bij 45°: 0,05 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[81900,454995,82050,455145]`, 150 × 150 mm. Duur 11,0 s, 210 objecten, 246.970 driehoeken, zes vellen, modelhoogte 151,5 mm. Het model staat op het terrein naast De Kroon.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, en dichtbij op 20°, 160°, 200° en 300°. De 3D BAG heeft de juiste massa met de terugsprongen, maar zonder ramen, lisenen, kroonstijlen en plint; de daken zijn rafelig en de westgevel van de witte toren heeft schuine vlakken die er niet zijn. Het model heeft per kant meer:
  - **Noordwest (300°, het plein aan de Turfmarkt)**: de spitse hoek van de rode toren, het atrium met zeven velden, de getrapte noordgevel van de witte toren, de kroonstijlen en de vensterrijen.
  - **Noordoost (55°, 20°, het water)**: de terugsprong van de rode toren op +105,9 met stijlen, de inspringende noordoosthoek, de plintlijst en de winkelpuien.
  - **Zuidoost (145°, 160°)**: de onderbouw die boven +24 terugspringt, de daktuin, de zuidoosthoek van de witte toren op +123,5 en de vensterrijen.
  - **Zuidwest (235°, 200°)**: de terugsprong van de witte toren op +88,1 en de kronen boven De Kroon uit.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.07910/4.32191/350/1x1/0)): beide torens met de kroonstijlen en de onderbouw liggen op de PDOK-reconstructie van het pand, naast De Kroon zonder overlap. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-blok (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0518100001635181`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001635181), CC BY 4.0: dakhoogtes (19,3 / 24,0 / 42,1 / 43,5 / 45,7 / 46,4 / 88,1 / 105,9 / 123,5 / 139,4 / 144,67 / 147,27 / 150,0), terugsprongen en opbouwen.
- [Wikipedia: JuBi-gebouw](https://nl.wikipedia.org/wiki/JuBi-gebouw), [JuBi Building](https://en.wikipedia.org/wiki/JuBi_Building) en [Wijnhavenkwartier](https://nl.wikipedia.org/wiki/Wijnhavenkwartier): 146 m, 37 lagen, Kollhoff, 2012, rode en witte toren, atrium met hoofdingang.
- Commons, alleen als visuele referentie:
  - [Den Haag Skyscrapers 5](https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_5.jpg) (terugsprong en inspringende hoek van de rode toren, kroon)
  - [Turfmarkt, high rise offices (2017)](https://commons.wikimedia.org/wiki/File:Turfmarkt,_The_Hague_-_high_rise_offices_and_urban_housing_(2017).jpg) (witte toren met terugsprong en kroonstijlen)
  - [Government office … Ministry of Justice and Security (2019)](https://commons.wikimedia.org/wiki/File:Government_office_in_The_Hague_housing_the_Dutch_Ministry_of_Justice_and_Security_(2019).jpg) (zuidoosthoek van de witte toren)
  - [Uilebomen (2)](https://commons.wikimedia.org/wiki/File:Uilebomen,_Den_Haag,_Netherlands_-_panoramio_(2).jpg) (plint en atrium)
  - [Uilebomen (38)](https://commons.wikimedia.org/wiki/File:Uilebomen,_Den_Haag,_Netherlands_-_panoramio_(38).jpg) (atrium tussen de torens)
  - [Den Haag Skyscrapers 1a (Kollhoff)](https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_1a_(Kollhoff).jpg) (beide kronen vanaf het Plein)
  - [Den Haag Skyscrapers 4](https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_4.jpg) (terugsprong van de rode toren)
  - [Den Haag Skyscrapers 6](https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_6.jpg) (spitse hoek van de rode toren)
  - [Straatzicht Turfmarkt](https://commons.wikimedia.org/wiki/File:Den_Haag,_straatzicht_Turfmarkt_IMG_8931_2019-03-24_16.04.jpg) (onderbouw en torens vanaf de Turfmarkt)
