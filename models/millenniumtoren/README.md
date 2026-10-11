# Millenniumtoren (Rotterdam)

Kantoor- en hoteltoren aan het Weena tegenover Delftse Poort (WZMH Architects met AGS Architekten & Planners, 2000). De toren heeft 34 lagen, een dak op 131 m en een antennemast tot 149,1 m boven de straat. In de onderste lagen zit het Marriott-hotel.

De romp is een rechthoek van 28,6 bij 37,2 m met granieten lisenen en blauwe glasvelden. Midden op beide smalle gevels staat een gebogen glazen erker. Bovenin stoppen de vier hoeken lager dan de rest, en aan beide lange zijden ligt een glazen mansarde. Op het dak staan twee pylonen per smalle gevel, installaties en een vakwerkmast. Aan de voet liggen een gebogen glazen entreepaviljoen aan het Weena, een lage oostvleugel en een loopbrug naar De Doelen.

Het model bestaat uit benoemde prisma's, hulls en vlakken in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-rembrandttoren.mjs` en `generate-cooltoren.mjs`. Reproductie: `node scripts/generate-millenniumtoren.mjs`.

## Bestanden en plaatsing

- `millenniumtoren.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 0, 20.684 driehoeken).
- `millenniumtoren.json`: catalogusitem.
  - RD-oorsprong `[92015,10, 437507,06]`, in het hart van de romp.
  - `xAxis` 17,5°: langs de smalle gevels (BAG-gevels 17,5° en 107,5°).
  - +Y wijst naar het noordnoordwesten, naar het Weena en Rotterdam Centraal. De oostvleugel ligt aan +X, de loopbrug aan −Y.
- `millenniumtoren-1-1000.stl`: millimeters, Z omhoog, 38 × 54 × 150,3 mm, vlakke voet.

z = 0 ligt op NAP −0,7 m, op de straat aan de west- en noordkant (AHN-DTM −0,5 tot −0,75). Aan de zuidkant ligt de straat op −1,0. De voet loopt door tot −1,2 m (NAP −1,9). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de straat aan de westkant (`[−18,−10] [−18,10]`) en aan het Weena (`[−12,22] [12,22]`).

Het model vervangt alleen BAG `0599100000689030` (bouwjaar 2000). Dat pand omvat de romp, het entreepaviljoen, de oostvleugel en het eerste stuk van de loopbrug (BAG-deel tot 10,4 m voor de zuidgevel).

Wat er niet bij hoort:

- Het kantoor ten oosten van de vleugel (`0599100000700053`, 3D BAG 38–42 m bij het model) grenst aan de vleugel, maar zijn reconstructie neemt geen punten van de toren mee. Het hoogste 3D BAG-punt binnen 30 m van het model is +41,6, gelijk aan het AHN.
- De Doelen (`0599100000700228`) begint waar de loopbrug ophoudt. De reconstructie loopt daar tot +43,1, gelijk aan de grote zaal in het AHN.
- FIRST Rotterdam (`0599100100002428`) en de Weenatoren zijn aparte backlogrijen. Geen hoekpunt van FIRST ligt binnen 30 m van het model.
- Delftse Poort (`models/delftse-poort`, 175 m naar het noorden) en Rotterdam Centraal (`models/rotterdam-centraal`, 200 m naar het noordwesten) overlappen niet.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Romp

- **Plattegrond** 28,6 × 37,2 m: de BAG-westgevel (u −17,41), zuidgevel (v −15,47) en noordgevel (v 21,75), en de oostgevel uit het AHN (11,2).
- **Hoekblokken**: de vier hoeken stoppen op **+103,1** (3D BAG 102,5–103,5, AHN 103). Ze zijn 5,7 m diep langs de lange gevels.
- **Lange gevels** tot **+113,3** tussen de hoekblokken (AHN en 3D BAG 113,1–113,4).
- **Glazen mansarde** op beide lange zijden: een vlak van de gevel op +113,3 naar de dakrand op ±8,8 m, met een helling van 67,5°. De glasvelden liggen per laag en kolom 0,3 m verdiept.
- **Trapezium op de smalle gevels**: tussen de hoekblokken loopt de gevel door tot het dak, met steile schuine zijkanten (82°) van ±12,0 op +103,1 naar ±8,8 op het dak. Boven de hoekblokken is de 10 m hogere schouder van de lange gevel te zien.
- **Plat dak +126,5** (AHN 126–127; 3D BAG 125,6–127,1).
- **Gevelreliëf**:
  - granieten lisenen met vensterkolommen als nissen van 0,35 m;
  - 30 lagen van 3,4 m tussen +11,3 en +113,3, met een stenen borstwering van 0,5 m per laag en elke vierde laag een band van 1,3 m;
  - op de smalle gevels per kant twee kolommen van 3,0 m naast een pijler van 1,2 m bij de erker, met een hoekpijler van 2 m;
  - op de lange gevels zeven kolommen van 2,6 m op 3,66 m en één kolom per hoekblok;
  - de dubbelhoge onderbouw met pui en eerste verdieping.

### Erkers

- Op beide smalle gevels een gebogen glazen erker met een koorde van 8 m. Hij staat 1,7 m voor de gevel en is opgebouwd uit 9 facetten. Hij loopt van +11,3 tot **+116,8** (3D BAG).
- Per laag een glasregel als groef van 0,3 m.
- Stenen ringen op de banden en een kap bovenop: 0,4 m uitkragend, met een onderkant van 45°.

### Dak

- **Pylonen**: twee per smalle gevel naast de erkeras, 2 × 3,6 m, tot **+130,3** (3D BAG 130,2–130,4), met een glasstrook aan de gevelkant.
- **Langsschermen** tussen de pylonen tot +129,2 (AHN-ruggen 128–130 over de hele lengte).
- **Installatieblokken** tot +128,1 (3D BAG 127,9–128,2).
- **Vakwerkmast** aan de noordkant tussen de pylonen:
  - voet van 1,8 m, smaller wordend tot 1,3 m op +135,5;
  - middendeel van 1,0 m tot +141;
  - antenne van 0,9 m tot **+148,4** (Wikipedia: 149,1 m boven de straat).

### Voet

- **Entreepaviljoen** aan het Weena: de BAG-contour met twee bogen en een kleine ronde neus, tot **+13,0** (3D BAG). Glazen pui van drie lagen als nis van 0,35 m onder een stenen dakrand.
- **Oostvleugel**: de BAG-contour tot **+17,5** (AHN 17–18, 3D BAG 16,7–18,3), met vier rijen ramen in de oost- en zuidgevel. Het noordelijke deel ligt lager, op **+8,2** (3D BAG).
- **Loopbrug** naar De Doelen: het BAG-deel van 2,9 m breed tot 10,4 m voor de zuidgevel. De bovenkant ligt op **+11,0** (AHN 10–11), de onderkant op +6,5, met een glasband op beide zijgevels.

## Backlog-hint tegen de metingen

- **"Puntige glazen spits"**: die is er niet. Het dak is plat (+126,5, AHN 126–127 over het hele middendeel). De puntige indruk komt van drie dingen:
  - de trapeziumvormige top van de smalle gevels, met hoekblokken op +103,1 en steile schuine zijkanten;
  - de glazen mansardes op de lange zijden;
  - de pylonen en de vakwerkmast.

  De foto's van alle kanten tonen hetzelfde.
- **"Vierkante romp"**: de romp is rechthoekig, 28,6 × 37,2 m.
- **"131 m"**: dat is de dakhoogte boven de straat. Het AHN geeft +126,5 tot +127 NAP met de dakrand. De mast loopt tot 149,1 m.

## Geschat en weggelaten

Geschat:

- **Mansarde**: het AHN ziet aan beide lange zijden een vlak op +113,3 dat 5,5 m doorloopt, en daarna direct het dak. De 3D BAG maakt daar een verticale sprong van. De foto's (onder andere `Millenniumtoren in Rotterdam, 2005 02` en `Rotterdam Millenium Tower 3`) tonen een schuin glasvlak van de gevel naar de dakrand. Dat vlak is dus gemodelleerd van de gevel op +113,3 naar de AHN-dakrand. Het vlak op +113,3 in het AHN is vermoedelijk de vloer onder het glas.
- **Trapezium op de smalle gevels**: de zijkanten (82°) komen uit de AHN-overgang bij de noordgevel (103 → 126 over 3,3 m) en een frontale foto. De zuidkant is gespiegeld. Het AHN is daar verstoord: in de schaduw achter de toren staan losse punten van 125 tot 133 m tot 15 m buiten de gevel. Dat zijn spookpunten op glas of de gevelonderhoudsinstallatie.
- **Gevelritme uit frontale foto's**:
  - verdiepingsteek 3,4 m: 30 lagen tussen +11,3 en +113,3. De hoekblokken vallen dan precies op laag 27;
  - een band elke vierde laag;
  - kolom- en pijlerbreedtes.
- **Erker**: koorde en uitsprong uit de 3D BAG en foto's; de onderkant op +11,3 komt uit foto's.
- **Mast**: de geledingen en diktes komen uit foto's, de top uit Wikipedia. Het AHN ziet het vakwerk niet.
- **Langsschermen en installatieblokken** uit de AHN-ruggen en de 3D BAG.
- **Loopbrug**: de onderkant (+6,5, de eerste verdieping) is geschat.

Weggelaten:

- **Logopanelen** (Marriott) boven de erkers: vlak in de gevel.
- **Vakwerkkaders met verlichting** op de hoeken van het dak en de gevelonderhoudsinstallatie: open vakwerk en dunne armen, dunner dan 0,9 m.
- **Kleine luifel** (+3,8) bij de ingang van het paviljoen: dunner dan 0,9 m.
- **De rest van de loopbrug** boven de straat: valt buiten het BAG-pand.
- **De fijne glasstijlen** in de erker en de mansarde: elk paneel is één nis.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 139.040 m³. De ondervlakken zijn de bovenkanten van de nissen, de onderkant van de loopbrug (31 m²) en de ringen van de erkers.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 396 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet (−1,2) en masttop (+148,4);
  - de hoekblokken op +103,1 met niets erboven buiten het trapezium;
  - de lange gevels op +113,3 met niets erboven aan de gevel;
  - het dak op +126,5 binnen ±9,2 m;
  - de pylonen op beide smalle gevels;
  - de mansardevlakken op beide lange zijden;
  - beide erkers, het paviljoen en de loopbrug;
  - 30 lagen vensternissen in de westgevel.
- **Printcheck** op 1:1000 bij 45°: 0,14 % extra volume, vooral onder de loopbrug en de erkerringen.
- **Export**: `createModelBundle` op 1:1000, RD `[91955,437440,92080,437565]`.
  - Duur 3,4 s, 138 objecten, 66.864 driehoeken, twee vellen, modelhoogte 150,5 mm.
  - De toren staat op het terrein.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235°, op 10°, 100°, 190° en 280°, en van bovenaf. De 3D BAG heeft de goede massa met de lagere hoeken, maar vlakke wanden, een verticale sprong in plaats van de mansarde, en geen erkers, pylonen of mast. Het model heeft per kant meer:
  - **Noord (−35°, 10°)**:
    - het gebogen entreepaviljoen;
    - de erker met ringen;
    - het trapezium met de hoekblokken;
    - de pylonen en de mast;
    - het vensterraster.
  - **Oost (55°, 100°)**:
    - de glazen mansarde met panelen;
    - de lisenen met vensterkolommen;
    - de schouder boven de hoekblokken;
    - de oostvleugel met ramen.
  - **Zuid (145°, 190°)**:
    - de zuidelijke erker;
    - het trapezium;
    - de pylonen;
    - de loopbrug naar De Doelen;
    - het vensterraster.
  - **West (235°, 280°)**:
    - de mansarde en het vensterraster van de lange gevel;
    - de dubbelhoge onderbouw.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.
- Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.92248/4.47159/350/1x1/0)): de toren met mansarde, erkers en mast ligt op de PDOK-reconstructie van het pand, met het vensterraster zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0599100000689030`, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026. Het gebouw (2000) is ouder dan het AHN4, dus AHN5 was niet nodig.
- [3D BAG, pand 0599100000689030](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000689030) (TU Delft/3D geoinformatie, CC BY 4.0): hoogtes van hoekblokken, stroken, dak, pylonen, erkertop, paviljoen, vleugel en loopbrug.
- [Wikipedia: Millenniumtoren (Rotterdam)](https://nl.wikipedia.org/wiki/Millenniumtoren_(Rotterdam)) en [Millennium Tower (Rotterdam)](https://en.wikipedia.org/wiki/Millennium_Tower_(Rotterdam)): 149,1 m, dak 131 m, 34 lagen, Marriott, loopbrug naar De Doelen.
- Commons, alleen als visuele referentie:
  - [Millennium Tower aan het Weena in Rotterdam](https://commons.wikimedia.org/wiki/File:Millennium_Tower_aan_het_Weena_in_Rotterdam.jpg) (zuid- en oostgevel vanaf De Doelen, mansarde)
  - [Millenniumtoren in Rotterdam, 2005 01](https://commons.wikimedia.org/wiki/File:Millenniumtoren_in_Rotterdam,_2005_01.jpg) (noordgevel frontaal: trapezium, pylonen, mast)
  - [Millenniumtoren in Rotterdam, 2005 02](https://commons.wikimedia.org/wiki/File:Millenniumtoren_in_Rotterdam,_2005_02.jpg) (mansarde en hoekblok)
  - [Rotterdam Millenium Tower 3](https://commons.wikimedia.org/wiki/File:Rotterdam_Millenium_Tower_3.jpg) (noord- en westgevel vanaf het station)
  - [Rotterdam toren millenniumtoren2](https://commons.wikimedia.org/wiki/File:Rotterdam_toren_millenniumtoren2.jpg) (kop met erker)
  - [Rotterdam – Weena – View SSE on Milleniumtower](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Weena_-_View_SSE_on_Milleniumtower_2000_Webb,_Zerafa,_Menkes,_Housden_Partnership_-_131,85_m_high_(141_with_Pylon).jpg) (entreepaviljoen en erker)
