# Delftse Poort (Rotterdam)

Kantoorcomplex van Nationale-Nederlanden aan het Weena 505, naast Rotterdam Centraal (Abe Bonnema, 1991). Twee schijven van spiegelglas op een plint van vier lagen: toren I (151,35 m, 41 lagen, tot 2009 het hoogste gebouw van Nederland) en toren II (93 m, 25 lagen). Het model bestaat uit benoemde prisma's, een bolkap en twee omhulsels (de granieten wiggen) in een eigen gebouwstelsel, zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs` en `generate-zalmhaven.mjs`. Reproductie: `node scripts/generate-delftse-poort.mjs`.

## Bestanden en plaatsing

- `delftse-poort.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 69.240 driehoeken).
- `delftse-poort.json`: catalogusitem.
  - RD-oorsprong `[92050, 437680]`, midden op de plint tussen de koepel en het glazen blok.
  - `xAxis` 17,5°: de BAG-gevels lopen op 17,495°, de AHN-dakranden van alle schijven liggen langs deze as.
  - +Y wijst naar het noordnoordwesten (spoorzijde), het Weena ligt aan −Y, het Stationsplein aan −X en het Delftseplein aan +X.
- `delftse-poort-1-1000.stl`: millimeters, Z omhoog, 102,4 × 89,9 × 155,9 mm, vlakke voet.

z = 0 ligt op NAP −0,7 m, het Weena (AHN-DTM −0,75 tot −0,65). Het Stationsplein (−0,4), de spoorzijde (−0,3) en het Delftseplein (−0,5) liggen iets hoger en bedekken de voet. De voet loopt door tot −1,2 m (NAP −1,9). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen rondom op straat: `[−20,−54] [20,−54]` (Weena), `[−62,0]`, `[0,43]` en `[50,0]`; de lader neemt de laagste, het Weena.

Het model vervangt één BAG-pand: `0599100000701251` (1991), dat het hele complex omvat: beide torens, de plint, het glazen blok en de koepel. Binnen 8 m ligt geen ander BAG-pand; het pand aan de overkant van het Delftseplein (`0599100000701493`) en de panden aan de zuidkant van het Weena (FIRST Rotterdam, Millenniumtoren) zijn aparte modellen of rijen en raken het model niet.

## Onderdelen (hoogtes NAP)

### Toren I en de lagere schijf

- **Toren I**: schijf van 56,5 × 16,1 m tot +149,3 m (AHN vlak binnen 0,1 m, 3D BAG 149,3). Een dakrand van 1 m breed tot +150,4 m op de noord-, oost- en westzijde; de zuidzijde heeft er geen (AHN). De noordgevel staat tot op straat.
- **Dakopbouwen** (3D BAG en AHN): voet van de in 2012 verwijderde zendmast met een paal tot +154,0, twee rails van de gevelonderhoudsinstallatie, koelunits en een technische ruimte, 1,3 tot 3,5 m boven het dak.
- **Roosterband** in de zuidgevel (installatierooster, 0,6 m diep): u 15,4–40,7, +139,4 tot +145,7, twee lagen onder het dak, rechts van het logo (foto's).
- **Slanke granieten wig** voor de zuidoosthoek van toren I, vlak met de oostgevel, op de plint. Op plinthoogte (+15,95) 3,2 m breed en 4,6 m voor de zuidgevel, taps toelopend tot een vlakke top van 1,5 × 1,7 m op +55 m. Onder de plinthoogte loopt ze met dezelfde tapsheid door tot de lage strook (+10,9).
- **Lagere schijf** ervoor: 55,7 × 15,8 m tot +69,4 m, 32 m naar het westen en 8 m naar het zuiden verschoven ten opzichte van toren I. Dakrand +70,0 op de zuid- en westzijde (3D BAG), een trappenhuiskop tot +72,3.

### Toren II, het L-blok en de wig

- **Toren II**: schijf van 58,2 m lang tot +91,75 m. De zuidgevel verspringt: het westelijke deel ligt op v = −43,1, het oostelijke deel boven het L-blok 1,3 m verder naar buiten op −44,4 (AHN).
  - Verhoogde dakrand tot +92,9 m: de zuidstrook vanaf v = −41 en 1 m op de westzijde (3D BAG, AHN 92,4–93).
  - Dakopbouwen tot +93,3 à +93,8 (koelunits, rails, technische ruimte).
  - Roosterband in de zuidgevel, +81,0 tot +88,1, van 5 tot 32 m vanaf de westkop (foto's).
- **L-blok aan het Weena** tot +44,3 m: een strook langs de straat (met een verspringing van 1,1 m op u = −13, BAG) en het oostdeel tegen toren II. Langs het Weena een verhoogde strook tot +44,9 en een dakopbouw tot +45,4 (3D BAG).
- **Zuilengalerij** onder het L-blok langs het Weena: 3 m diep tot +9,0 m, open aan beide koppen, met 12 ronde zuilen van 1,2 m op de rooilijn. Dit is de overdekte ingangszone aan het Weena.
- **Granieten wig** voor de zuidwesthoek van toren II, vlak met de westgevel. Aan de voet 7,0 m breed en 5,1 m voor de zuidgevel, taps toelopend tot een vlakke top van 4,5 × 1,9 m op +58 m. Naast de wig de terugliggende entree onder toren II (BAG-contour 1,2 m achter de gevel), tot +4,4 m.

### Plint, glazen blok en koepel

- **Plint** van vier lagen tot +15,95 m. De westgevel is een boog om de koepel (AHN-rand: middelpunt (12,8, −4,5), straal 63,9 m).
- **Lage randstroken** tot +10,9 m: langs de schuine westgevel aan het Stationsplein, langs de noordgevel west van toren I en langs de oostgevel aan het Delftseplein (3D BAG 10,85).
- **Glazen blok** op de plint: 31,5 × 29,4 m tot +35,25 m met een rand van 1,2 m tot +35,9.
- **Koepel**: bolkap met straal 11,7 m, top +22,87 m (bolfit op 1355 AHN-punten boven de plint), met een verdiepte glazen oculus van 5,2 m.
- **Glazen driehoek** in het plintdak tussen de torens (orthofoto's 2021–2024): ondiepe nis van 0,3 m.

### Gevels

Alle glasgevels hebben een raster van blinde groeven van 0,3 m diep:

- verticale stijlen van 0,4 m breed per 3,6 m;
- verdiepingsbanden van 0,5 m hoog per 3,6 m (kantoorvloeren vanaf +16,6, 37 lagen in toren I en 21 in toren II boven de plint, zoals Wikipedia);
- de hoeken blijven 1 m vrij, zodat elke schijf lisenen op de hoeken heeft.

## Geschat en weggelaten

Geschat uit foto's en bronnen:

- **Gevelraster**: het spiegelglas heeft vierkante vakken van circa 1,8 m (twee per laag). Het model heeft stijlen en banden per 3,6 m; een raster van 1,8 m gaf 240.000 driehoeken en een GLB van 11 MB.
- **Granieten wig van toren II**: het gepolijste zwarte graniet geeft geen AHN-punten. De strook zuid van toren II heeft geen meetpunten, het Weena op v = −48 wel. Daarom staat de voet maximaal 5,1 m voor de gevel. De top (+58 m) en de tapsheid komen uit foto's vanuit het westen, zuidwesten en zuiden. De wig staat op de foto's aan de zuidwesthoek van toren II, naast het L-blok.
- **Slanke wig van toren I**: te zien op de foto's vanaf het Weena (westzuidwesten) als donkere spits tussen de lagere schijf en toren II, precies onder de zuidoosthoek van toren I. Vanuit het zuidwesten en zuiden staat ze achter toren II. Het AHN heeft op die plek een gat van 2,5 × 3,5 m in het plintdak (u 42,5–45, v 19–22,5), dat de voet begrenst. De top (+55 m, uit twee foto's 53 tot 61 m) en de tapsheid zijn geschat.
- **Roosterbanden**: plaats en hoogte uit foto's (Commons).
- **Zuilengalerij**: diepte, hoogte en zuilafstand uit foto's. De BAG-contour en het DTM (geen maaiveld onder de rand) bevestigen alleen de overstekende rand.
- **Lage plint**: 0,45 m binnen de BAG-contour, zodat de torengevels die op de BAG-rand staan (noordgevel van toren I, westgevel van toren II) vrij tot op straat lopen.

Weggelaten:

- **Schuine koppen**: de daken zijn plat (AHN binnen 0,1 m, 3D BAG helling 0,0°). Het "afgeschuinde" silhouet uit de opdracht is het verspringen van de schijven en de taps toelopende wig.
- **Logo's en lichtreclame** ("The Delftse Poort", het voormalige NN-logo): plat.
- **Kleine ramen in de koepel** en de naad in het koepeldak: kleiner dan 0,9 m.
- **Daktuin en bomen** op de plint.
- **Fijne rasterlijnen** tussen de stijlen en banden: zie hierboven.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 32 (de zuilen en de galerij), 420.130 m³. De ondervlakken zijn de bovenkanten van de groeven, het plafond van de galerij en de entree.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 360 geslaagd. De eigen test controleert:
  - catalogus en vervangen pand, voet en hoogste punt;
  - toren I met rand op drie zijden en zonder rand op de zuidgevel;
  - de lagere schijf en toren II met de verspringende zuidgevel en de dakranden;
  - het L-blok, het glazen blok, de plint met de boog en de lage strook;
  - beide granieten wiggen (top, voet en vrije ruimte boven de slanke wig);
  - de open galerij met zuilen;
  - de koepel met oculus;
  - de roosterband en 20 verdiepingsbanden in de zuidgevel van toren I, en de stijlen in de noordgevel van toren II.
- **Printcheck** op 1:1000 bij 45°: 0,12 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[91960,437595,92130,437755]`. Duur 14,5 s, 165 objecten, 437.522 driehoeken, zes vellen, modelhoogte 162,9 mm. Het landmarkobject staat compleet in de 3MF.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf. De 3D BAG (LoD2.2) heeft de juiste massa's maar vlakke wanden: geen gevelraster, geen wig, geen galerij, geen roosterbanden, en de koepel als veelvlak. Het model heeft per kant meer:
  - **Noordwest (−35°)**: het gevelraster op de noord- en westgevels van toren I en de lagere schijf, de boogvormige glasgevel van de plint om de koepel en de lage strook aan het Stationsplein.
  - **Noordoost (55°)**: de dakranden en dakopbouwen van beide torens, het raster van het glazen blok en de lage strook langs het Delftseplein.
  - **Zuidoost (145°)**: de zuilengalerij langs het Weena, de verspringende zuidgevel van toren II, de roosterbanden en de verhoogde strook van het L-blok.
  - **Zuidwest (235°)**: de granieten wig voor de zuidwesthoek van toren II, de slanke wig onder de zuidoosthoek van toren I, de koepel met oculus en de verspringing tussen toren I en de lagere schijf.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk van het pand.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.92403/4.47206/350/1x1/0)): het model ligt op de PDOK-reconstructie van het pand, de verspringende schijven met het gevelraster zijn zichtbaar en de voet sluit aan het Weena aan. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0599100000701251`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR met de jaarorthofoto's 2021–2024; 11 oktober 2026.
- [3D BAG, pand 0599100000701251](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000701251) (TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes en dakopbouwen.
- [Wikipedia: Delftse Poort (gebouw)](https://nl.wikipedia.org/wiki/Delftse_Poort_(gebouw)) en [Delftse Poort (Engels)](https://en.wikipedia.org/wiki/Delftse_Poort): 151,35 m en 93 m, 41 en 25 lagen, plint van vier lagen, mast tot 2012.
- Commons, alleen als visuele referentie:
  - [Kantorencomplex Delftse Poort](https://commons.wikimedia.org/wiki/File:Kantorencomplex_Delftse_Poort.jpg) (vanuit het westzuidwesten)
  - [Delftse Poort October 2016](https://commons.wikimedia.org/wiki/File:Delftse_Poort_October_2016.jpg)
  - [View ENE on De Delftse Poort](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Weena_-_View_ENE_on_De_Delftse_Poort_1991_Abe_Bonnema_-_151.35_m_(164_with_Pylon).jpg)
  - [Centraal Station en gebouw Delftse Poort](https://commons.wikimedia.org/wiki/File:Centraal_Station_en_gebouw_Delftse_Poort_-_City_of_Rotterdam.jpg)
  - [Delftse Poort Skyscraper Rotterdam](https://commons.wikimedia.org/wiki/File:Delftse_Poort_Skyscraper_Rotterdam.jpg)
  - [Rotterdam – Delftse Poort](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Delftse_Poort.jpg) (Stationsplein, wig en galerij)
  - [Rotterdam Delftse Poort Tower 1](https://commons.wikimedia.org/wiki/File:Rotterdam_Delftse_Poort_Tower_1.jpg) (wig en roosterbanden)
  - [Gebouw Delftse Poort, Rotterdam](https://commons.wikimedia.org/wiki/File:Gebouw_Delftse_Poort,_Rotterdam.jpg)
  - [Central Station Rotterdam (rooftop)](https://commons.wikimedia.org/wiki/File:Central_Station_Rotterdam_(rooftop).jpg)
  - [Delftse Poort Tower I close-up](https://commons.wikimedia.org/wiki/File:Delftse_Poort_Tower_I_close-up.jpg)
