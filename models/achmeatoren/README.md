# Achmeatoren (Leeuwarden)

Kantoortoren aan de Sophialaan bij het station (Bonnema Architecten, Abe Bonnema en Jan van der Leij, 2002), 114,6 m en het hoogste gebouw van Noord-Nederland. Het complex bestaat uit twee in elkaar geschoven vierkante torens op een glazen voet:

- de zwarte hoofdtoren met natuursteen, losse vierkante vensters en een glazen band om de observatieruimte onder de bovenrand;
- daartegen aan de noordwestkant een lichtgrijze lagere toren van 68 m (Deloitte);
- een glazen hal van twee à drie lagen onder en rond beide torens;
- aan de zuidkant een glazen entreeluifel met een schuin naar buiten hellende glaswand.

Het model bestaat uit benoemde prisma's en vlakken in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-hoftoren.mjs` en `generate-maastoren.mjs`. Reproductie: `node scripts/generate-achmeatoren.mjs`.

## Bestanden en plaatsing

- `achmeatoren.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 18.674 driehoeken).
- `achmeatoren.json`: catalogusitem.
  - RD-oorsprong `[182048, 579124]`, in de overlap van beide torens.
  - `xAxis` −4,8°: langs de gevels van beide torens en de hal (BAG −4,6 tot −5,0° en 85,3°).
  - +Y wijst naar het noorden. De lagere toren ligt aan −X/+Y, de entreeluifel aan −Y, de Sophialaan aan +X.
- `achmeatoren-1-1000.stl`: millimeters, Z omhoog, 36,8 × 48,9 × 116 mm, vlakke voet.

z = 0 ligt op NAP +1,3 m, op de straten en het plein rondom (AHN-DTM +1,15 tot +1,48). De voet loopt door tot −1,2 m (NAP +0,1). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de Sophialaan (`[20,−5] [20,5]`), op de straat aan de noordkant (`[2,18] [−12,18]`) en op het plein naast de luifel (`[24,−25]`).

Het model vervangt alleen BAG `0080100000352634` (bouwjaar 2002). Dat ene pand omvat beide torens, de glazen hal en de strook naar het stenen kantoor ten zuiden.

Wat er niet bij hoort:

- Het stenen kantoor ten zuiden (`0080100000494206`, 1967, Avéro Achmea) is een apart pand. De 3D BAG geeft het +24,5 tot +26; het AHN ook (mediaan +24,5). De luifel staat ernaast, niet erop.
- Het kantoorcomplex ten westen (`0080100011101617`, 1984) is een apart pand. De 3D BAG-daken naast het model liggen op +12 tot +20, het AHN ook. Er staat dus geen PDOK-kolom naast de toren.
- De entreeluifel is geen BAG-pand; PDOK heeft daar niets.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Hoofdtoren

- **Plattegrond** 20,4 × 19,0 m (u −3,8 tot 16,6, v −13,1 tot 5,9): BAG-oost- en zuidgevel, AHN-west- en noordgevel.
- **Dakrand +116,05** (AHN-rand 116,0–116,07; 3D BAG 116,02), 1 m dik, met het **dak op +112,44** (AHN-fit, 536 punten, rms 0,20).
- **Installatieopbouwen** tot +115,0 (AHN 114,5–115,5; 3D BAG 114,8–115,1): een oostelijk blok van 3,8 × 13,6 m en een blok van 6,6 × 6,6 m midden op het dak.
- **Glazen band** van de observatieruimte rondom (+106,9 tot +111,0), 2,2 m van de hoeken:
  - een kozijn van 0,2 m diep;
  - ruiten van 1,2 m, 0,45 m diep, tussen stijlen van 0,5 m.
- **Roosterband** (+96,3 tot +97,5) boven de bovenste vensterrij, over de breedte van de vensters.
- **Vensters**: 22 rijen van 1,3 × 1,3 m, 0,35 m diep. De bovenste rij ligt op +92,3 tot +93,6, de verdiepingshoogte is 3,72 m. Per gevel:
  - noord- en oostgevel: tien vensters op 1,7 m;
  - zuidgevel: twee smalle vensterkolommen aan de westkant en een groep van vier aan de oostkant;
  - westgevel: twee vensters aan de noordkant (boven de lagere toren). Verder is deze gevel dicht, met een verticale voeg van 0,5 m.
- **Plaatvoegen** per verdieping rondom: 0,3 m hoog en 0,25 m diep.
- **Open kolommen aan de straat**: oostgevel en het oostelijke deel van de noordgevel. Een glazen pui ligt 1,2 m terug tot +12,2, tussen kolommen van 1,6 m op de hoeken en op een derde.

### Lagere toren

- **Plattegrond** 18,2 × 17,8 m (u −12,6 tot 5,6, v −3,6 tot 14,2), uit de AHN-contour van het dak. **Dak +67,90** (AHN-fit, 486 punten, rms 0,10; 3D BAG 67,9), vlak en zonder opstaande rand (het AHN ziet die niet).
- **Vensters**: 14 rijen (+14,2 tot +63,9) op dezelfde verdiepingen als de hoofdtoren. Per gevel:
  - noord- en westgevel: acht vensters op 1,84 m;
  - de vrije delen van de zuid- en oostgevel: twee;
  - plaatvoegen per verdieping.

### Glazen hal en strook

- **Plattegrond**: de BAG-contour van het pand, met de schuine noordoostrand.
- **Hoogte**: dak +12,2 (3D BAG 12,1–12,3; het AHN ziet door het glas: 10 tot 14).
- **Glazen pui** met stijlen op 1,8 m aan de straatkanten (noord en noordoost). De west- en zuidrand grenzen aan het kantoor van 1984.
- **Strook** van 2 m tussen de zuidgevel van de hoofdtoren en het stenen kantoor, ook +12,2.

### Glazen entreeluifel

- **Dakrand** uit de ortho: een scheve vierhoek van de zuidgevel van de toren (u 10,6–16,6) tot het plein (v −33,4, u 13,2–20,4).
- **Dak +12,2** (AHN-glas 12,0–12,3 op v −16 tot −31), met negen glasvelden tussen de spanten, 0,25 m verdiept.
- **Oostwand** helt 1,6 m naar buiten (foto); de west- en zuidwand staan recht. Op alle wanden glasstijlen op 1,8 m.
- **Kolomzone**: de onderste 2,4 m ligt als nis van 0,5 m rondom terug.

## Backlog-hint tegen de metingen

- **"Rechthoekige kantoortoren"**: niet helemaal. Het zijn twee vierkante torens van 20 en 18 m die 9 × 9 m in elkaar steken: de zwarte hoofdtoren (116 m) en een lichtgrijze lagere toren (68 m). Beide torens en de hal zijn één BAG-pand. Op foto's van het noorden en westen staat de lagere toren pal voor de hoofdtoren.
- **"Uitstekende glazen kop"**: klopt niet. De top is een rechte doos tot +116,05, met een glazen band (observatieruimte, +106,9 tot +111) in het gevelvlak, 2,2 m van de hoeken. Foto's van alle kanten tonen een rechte bovenrand. Het AHN geeft dezelfde contour op +112 tot +116 als de BAG-voet op maaiveld; er kraagt niets uit. Er is dus geen kraag nodig.
- **"Lage aanbouw"**: dat is de glazen hal van +12,2 onder en rond beide torens, met aan de zuidkant de glazen entreeluifel langs het stenen kantoor. De hoofdtoren staat aan de straat op open kolommen tot +12,2.

## Geschat en weggelaten

Geschat:

- **Vensterritme per gevel** uit foto's: aantallen per rij, steek 1,7 m (hoofdtoren) en 1,84 m (lagere toren), vensters van 1,3 m.
- **Verdiepingen**: 22 rijen van 3,72 m in de hoofdtoren en 14 in de lagere toren. Gemeten op een frontale foto van de noordkant (Achmeatoren_Leeuwarden_1.jpg) en geschaald op de AHN-dakhoogtes van beide torens (+116,05 en +67,9). Wikipedia noemt 26 verdiepingen; de rest zijn de hal, technische lagen en de observatieruimte.
- **Banden**: de glazen band (+106,9 tot +111), de roosterband (+96,3 tot +97,5) en de bovenste vensterrij (+93,6) komen van dezelfde foto.
- **Gevelreliëf**: plaatvoegen als groeven van 0,3 m; de verticale voeg in de westgevel komt uit een foto.
- **Kolommen**: 1,6 m dik, de pui 1,2 m terug (foto's van de entree).
- **Entreeluifel**: de helling van de oostwand (1,6 m) en de open kolomzone tot 2,4 m komen uit een foto; de dakrand uit de ortho, de hoogte uit het AHN.
- **Hal**: de hoogte komt uit de 3D BAG.

Weggelaten:

- **Antennes en masten** op het dak (AHN tot +118,5): dunner dan 0,9 m.
- **De rode neoncontour** rond de top: licht, geen vorm.
- **Open luifel**: de entreeluifel is in het echt een glazen kap op kolommen met een open voet. In het model is hij een dichte glasdoos met een verdiepte voet, zodat hij zonder steun printbaar is.
- **De V-kolommen** onder de lagere toren in de hal: ze staan binnen het glas.
- **Logo's** (Deloitte, Achmea) en het kleurverschil tussen de zwarte en de lichtgrijze toren: materiaal, geen vorm.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 62.745 m³. Nissen die een ander bouwdeel afdekt (toren tegen toren, toren tegen hal), worden ingesloten holtes; die vallen weg. De ondervlakken zijn de bovenkanten van de nissen, het plafond van de kolomzone en de voet van de luifel.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 373 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet (−1,2) en top (+116,05);
  - de dakrand op de vier hoeken, het dak (+112,44) en de installaties (+115);
  - dat alleen de hoofdtoren boven +68 uitkomt, en de lagere toren op +67,9;
  - de glazen band en de roosterband;
  - 22 vensterrijen in de oostgevel;
  - de open kolommen;
  - de hal (+12,2) en de luifel met de hellende oostwand.
- **Printcheck** op 1:1000 bij 45°: 0,16 % extra volume (plafond van de kolomzone, nissen, voet van de luifel).
- **Export**: `createModelBundle` op 1:1000, RD `[181990,579060,182110,579180]`. Duur 4,7 s, 150 objecten, 59.998 driehoeken, vijf vellen, modelhoogte 117,3 mm. Het model staat compleet tussen de buren; de luifel ligt naast het stenen kantoor.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, plus 30°, 120°, 0°, 180° en 270° en twee lage hoeken. De 3D BAG heeft de goede massa's, maar vlakke wanden en een gerafelde top. Het model heeft per kant meer:
  - **Noordwest (−35°)**:
    - de lagere toren met vensters en plaatvoegen voor de hoofdtoren;
    - de glazen band en de roosterband;
    - de glazen pui van de hal.
  - **Noordoost (55°)**:
    - de noord- en oostgevel met tien vensters per rij;
    - de open kolommen aan de straat;
    - de schuine noordoostrand van de hal;
    - de luifel.
  - **Zuidoost (145°)**:
    - de zuidgevel met de smalle vensterkolommen en de groep van vier;
    - de luifel met de hellende oostwand en de kolomzone;
    - de installaties op het dak.
  - **Zuidwest (235°)**:
    - de dichte westgevel met de voeg en twee vensters bovenin;
    - de zuidgevel van de lagere toren;
    - de glazen band rondom.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk; de luifel ligt naast het pand op de plek van het glas in de ortho.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/53.19806/5.79194/350/1x1/0)): beide torens liggen op de PDOK-reconstructie van het pand met het vensterraster en de glazen band zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0080100000352634`, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026. Het gebouw (2002) is ouder dan het AHN4, dus AHN5 was niet nodig.
- [3D BAG, pand 0080100000352634](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000352634) (TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes van beide torens, installaties, glazen hal.
- [Wikipedia: Achmeatoren](https://nl.wikipedia.org/wiki/Achmeatoren): 114,6 m, 26 verdiepingen, Bonnema Architecten, 2002, zwarte natuursteenplaten.
- Commons, alleen als visuele referentie:
  - [Achmeatoren Leeuwarden 1](https://commons.wikimedia.org/wiki/File:Achmeatoren_Leeuwarden_1.jpg) (vanaf het noorden: beide torens, vensterritme, glazen band, kolommen)
  - [Achmeatoren FvL](https://commons.wikimedia.org/wiki/File:Achmeatoren_FvL.jpg) (oost- en noordgevel, lagere toren)
  - [Sophialaan 2-50 (Achmeatoren)](https://commons.wikimedia.org/wiki/File:20100707_Sophialaan_2-50_(Achmeatoren)_Leeuwarden_NL.jpg) (zuidgevel)
  - [Leeuwarden, de Achmeatoren foto3](https://commons.wikimedia.org/wiki/File:Leeuwarden,_de_Achmeatoren_foto3_2016-06-05_15.57.jpg) (vanaf het westen)
  - [20180721 545 leeuwarden](https://commons.wikimedia.org/wiki/File:20180721_545_leeuwarden.jpg) (entreeluifel en kolommen)
  - [Achmeatoren closeup](https://commons.wikimedia.org/wiki/File:Achmeatoren_closeup.JPG) (glazen band, plaatvoegen, diepe vensters)
  - [Office buildings in the city of Leeuwarden (2023)](https://commons.wikimedia.org/wiki/File:Office_buildings_in_the_city_of_Leeuwarden_(2023).jpg)
  - [Achmeatoren van onderen 1](https://commons.wikimedia.org/wiki/File:Achmeatoren_van_onderen_1.JPG) (luifel tegen de toren)
