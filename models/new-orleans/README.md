# New Orleans (Rotterdam)

Woontoren op de Wilhelminapier (Álvaro Siza, 2010), 158,35 m hoog met 45 lagen en een gevel van natuursteen. De toren is een vierkant blok van 30,1 × 28,4 m. Elke gevel heeft drie beuken, twee terugliggende verticale sleuven en twee hoekzones. Bovenin eindigen die op verschillende hoogtes, als een getrapte kroon rond een kern en een opbouw. Tegen de zuidwesthoek staat een lagere schijf tot +41,7. De bovenste lagen daarvan kragen als stenen 'snavel' met een terras uit voorbij de westgevel. In hetzelfde BAG-pand ligt de lage stenen onderbouw met LantarenVenster, een glazen foyerstrook langs de Rijnhaven en het parkeerdek.

De backlog noemde een hogere en een lagere schijf en een terugliggende kop. Bij meting bleek de toren één blok met een getrapte kroon. De 'lagere schijf' is de uitbouw tot +41,7 tegen de zuidwesthoek, en de kop springt in vijf treden terug.

Het model bestaat uit benoemde prisma's in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs` en `generate-montevideo.mjs`. Reproductie: `node scripts/generate-new-orleans.mjs`.

## Bestanden en plaatsing

- `new-orleans.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 25.438 driehoeken).
- `new-orleans.json`: catalogusitem.
  - RD-oorsprong `[93112.96, 435563.81]`, midden in de toren.
  - `xAxis` 36,5°: langs de lange gevels van het pand (BAG 36,3–36,6°), van de onderbouw naar de toren.
  - +Y wijst naar 126,5° (noordwest), naar de Otto Reuchlinweg en de Maas. De Rijnhaven ligt aan −Y.
- `new-orleans-1-1000.stl`: millimeters, Z omhoog, 97,8 × 30,7 × 161,4 mm, vlakke voet.

z = 0 ligt op NAP +3,5 m: kade, Otto Reuchlinweg en plein rondom (AHN-DTM +3,4 tot +3,7, 3D BAG-maaiveld 3,50). De voet loopt door tot −1,2 m (NAP +2,3), `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op:

- de kade aan de Rijnhaven: `[0,−20]` en `[−45,−20]`;
- de Otto Reuchlinweg: `[0,19]` en `[−45,19]`;
- het plein aan de westkop: `[−88,0]`;
- de straat oostelijk van de toren: `[20,0]`.

Het model vervangt alleen BAG `0599100000753300` (2010). Toren, lagere schijf en onderbouw zijn één pand. Het pand met de LantarenVenster-adressen aan de Otto Reuchlinweg 996/998 hoort erbij. De buren raakt het model niet:

- `0599100000435130` aan de Wilhelminakade ligt 20 m noordelijk, over de Otto Reuchlinweg.
- `0599100100010084` ligt 28 m oostelijk.
- Montevideo (`models/montevideo`) ligt 75 m naar het zuidwesten, De Rotterdam (`models/de-rotterdam`) 170 m naar het noorden, Hotel New York nog verder.

Er is geen overlap met andere landmarkmodellen. Geen enkel buurpand ligt binnen 20 m, dus een PDOK-buur die punten van de toren heeft meegenomen is niet te verwachten.

## Onderdelen (hoogtes NAP, AHN-DSM 0,5 m en 3D BAG)

### Toren

- **Plattegrond** 30,1 × 28,4 m, uit de AHN-randen van de kroon. De BAG-contour is de begane grond en ligt aan de noordkant 1,4 m terug.
- **Indeling van elke gevel**, uit AHN-profielen 1 m achter de gevel van alle vier de kanten:
  - zuid- en noordgevel: hoekzone 3,55 m, beuk 5,0, sleuf 4,0, middenbeuk 5,0, sleuf 4,0, beuk 5,0, hoekzone 3,55;
  - west- en oostgevel: hoekzone 3,65 m, beuken van 4,6 m en sleuven van 3,65 m.
- **Getrapte kroon** (ring van 3,2–3,45 m rond de kern):
  - hoekzones tot **+138,2** (AHN 138,2–138,8);
  - sleuven tot **+141,5**;
  - beuken tot **+151,5** (AHN 151,5–152,6);
  - achter de middelste beuk een tussentrede van 3,6 × 2,7 m tot **+154,8**;
  - kern 23,2 × 22,0 m tot **+158,3** met een dakrand van 0,9 m tot +159,6;
  - opbouw 13,4 × 7,3 m tot **+161,8** (158,35 m boven maaiveld);
  - installaties tot **+163,7**.
- **Gevelreliëf**, 44 lagen van 3,26 m boven een begane grond van 4,4 m:
  - buitenste beuken: per laag een loggia van 3,4 m (W/O 3,0 m), 0,45 m diep;
  - middenbeuk: per laag een vensterpaar van 1,6 m, 0,35 m diep;
  - sleuven: doorlopende groef van 0,45 m met per laag een venster;
  - hoekzones: hoekloggia's van 2,4 m die om de hoek lopen;
  - kern boven de ring: vensters boven hoekzones, sleuven en beuken; tussentreden met een hoog venster; opbouw met een vensterband;
  - begane grond: glazen lobby, aan de noordkant 1,4 m terug.

### Lagere schijf met snavel

- **Uitbouw** van 2,0 m voor de zuidgevel (BAG-contour, x −15,05 tot −5,85) tot **+41,7** (3D BAG).
- **Gevel**: tot x = −2,5 (hoekzone, beuk en sleuf) brede vensters zonder loggia's of sleuf, zoals op de foto vanaf de Rijnhaven. Ook de westgevel tot de hoekzone heeft deze gevel.
- **Snavel**: de bovenste lagen kragen 3,6 m uit voorbij de westgevel (5,9 m breed). De onderkant ligt op +34,6 (geschat). Erin een terras van 1,2 m diep op +38,3, open naar het zuiden en westen, onder de dakplaat van +40,8 tot +41,7.

### Onderbouw (LantarenVenster en parkeerdek)

- **Glazen foyerstrook** langs de Rijnhaven tot **+11,7**, 2,7 m diep, met stijlen per 2,6 m.
- **Stenen massa** tot **+18,4**.
- **Daklichtstroken** aan de westkop tot **+21,0**.
- **Vier verhoogde dakdelen** tot **+20,0**.
- **Zaal** tot **+22,35** en een opbouw tegen de toren tot **+25,1**.
- **Terras aan de westkop** op **+15,2** achter een borstwering van +16,0.
- **Gevels**:
  - zuidgevel: een vensterband boven de glazen strook;
  - zaal: een vensterband aan beide zijden;
  - noordgevel: de glazen entree van LantarenVenster en een vensterband;
  - westgevel: de parkeeringang en een hoog venster.

## Geschat en weggelaten

Geschat:

- **Verdeling van de gevels.** De verdeling in hoekzone, beuk en sleuf komt uit de kroon in het AHN. Dat die tot de grond doorloopt, volgt uit foto's.
- **Gevelritme.** Het ritme van loggia's, vensterparen en sleufvensters komt uit foto's en is regelmatig gemaakt. Het werkelijke patroon wisselt per laag iets.
- **Lagere schijf.** De gevel tot x = −2,5 komt uit de foto vanaf de Rijnhaven. De uitbouw zelf volgt de BAG-contour.
- **Snavel.** De uitkraging is beperkt tot 3,6 m: verder westelijk ziet het AHN alleen het dak van de zaal op +22,35. De onderkant (+34,6), het terras en de breedte zijn uit foto's geschat. Het AHN heeft rond de voet van de toren een schaduwgat.
- **Onderbouw.** De dakhoogtes komen uit AHN en 3D BAG. Vensters, de entree en de parkeeringang zijn uit foto's geschat.

Weggelaten:

- **Uitstekende balkonplaten en balkonhekken**: de balkons zijn als loggianissen gemodelleerd, de hekken zijn dunner dan 0,9 m.
- **De kleine verspringing in de bovenkant van de beuken** (AHN 148,2 op de flanken): kleiner dan 1 m en niet eenduidig.
- **De schuine elementen op het terras van de westkop**: AHN-hellingen van 38° over 2 m, te klein en onduidelijk.
- **Paviljoen, ventilatiebuizen en bomen op het plein**: geen onderdeel van het pand.
- **Gevelonderhoudsinstallaties, antennes en de balustrade van het snavelterras**: dun.
- **Kleurverschillen in de natuursteen.**

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 2, 159.882 m³. Nissen die een ander bouwdeel afdekt (de westgevel van de toren achter de onderbouw), worden ingesloten holtes; die vallen weg.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 398 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet (−1,2) en top (+163,7);
  - de torenmaat 30,1 × 28,4 m;
  - de vier hoekzones op +138,2 en dat daarboven niets in de hoeken staat;
  - sleuven (+141,5), beuken (+151,5), tussentrede (+154,8), kern (+158,3) en opbouw (+161,8);
  - loggia's en sleufvensters;
  - de lagere schijf (+41,7) met de snavel tot 3,6 m voorbij de westgevel, de onderkant op +34,6 en niets eronder tot het dak van de onderbouw;
  - glazen strook, stenen massa, daklichtstroken, zaal en het terras aan de westkop.
- **Printcheck** op 1:1000 bij 45°: 0,18 % extra volume (onder de snavel, het terras, de loggia's en de terugliggende lobby).
- **Export**: `createModelBundle` op 1:1000, RD `[93010,435470,93160,435620]`. Duur 10,9 s, 111 objecten, 107.564 driehoeken, zes vellen, modelhoogte 161,6 mm. Het model staat compleet op het maaiveld.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235°, op 120°, 215°, 300° en 30° (20–30° naast de gevels), een zoom op de kroon en een op de onderbouw, en van bovenaf. De 3D BAG heeft de goede kroonhoogtes, maar vlakke wanden met alleen de sleuven als smalle stroken, de onderbouw als blokken zonder gevels, en geen snavel. Het model heeft per kant meer:
  - **Rijnhaven (145°/120°)**:
    - loggia's en vensters in alle beuken;
    - de lagere schijf met brede vensters;
    - de snavel met het terras;
    - de glazen foyerstrook met stijlen.
  - **Westkop (235°/215°)**:
    - de uitkragende snavel;
    - het terras op +15,2 met de borstwering;
    - de parkeeringang;
    - de daklichtstroken.
  - **Otto Reuchlinweg (−35°/300°)**:
    - de getrapte kroon met hoekzones, sleuven, beuken en tussentreden;
    - de noordgevel met de glazen entree van LantarenVenster;
    - de terugliggende lobby.
  - **Oost (55°/30°)**:
    - de oostgevel met loggia's en sleuven;
    - de kroon met opbouw en installaties.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk. Alleen de toren steekt aan de noordkant 1,4 m buiten de BAG-contour (de bovenbouw, volgens het AHN), en de snavel 3,6 m aan de westkant.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/51.90513/4.48789/350/1x1/0)): de toren met de getrapte kroon en de onderbouw liggen op de PDOK-reconstructie van het pand, naast Montevideo zonder overlap. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0599100000753300`, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026. Het gebouw (2010) is ouder dan het AHN4: de kroon staat er volledig in, dus AHN5 was niet nodig.
- [3D BAG, pand 0599100000753300](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000753300) (TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes van kroon, kern en opbouw, de lagere schijf (41,7) en de onderbouw.
- [Wikipedia: New Orleans (gebouw)](https://nl.wikipedia.org/wiki/New_Orleans_(gebouw)): 158,35 m, 45 lagen, LantarenVenster in de onderbouw, Siza.
- Commons, alleen als visuele referentie:
  - [Rotterdam - New Orleans](https://commons.wikimedia.org/wiki/File:Rotterdam_-_New_Orleans.jpg) en [GraphyArchy 00317](https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00317.jpg) (kroon, beuken, loggia's)
  - ['New Orleans' Rotterdam](https://commons.wikimedia.org/wiki/File:%27New_Orleans%27_Rotterdam_(7657650598).jpg) en [Architecture in Rotterdam](https://commons.wikimedia.org/wiki/File:Architecture_in_Rotterdam_(28384615199).jpg) (sleuven en hoeken van onderaf)
  - [Rotterdam New Orleans Tower 1 (cropped)](https://commons.wikimedia.org/wiki/File:Rotterdam_New_Orleans_Tower_1_(cropped).jpg) (zuidgevel vanaf de Rijnhaven: lagere schijf, onderbouw, glazen strook)
  - [Rotterdam - New Orleans (3)](https://commons.wikimedia.org/wiki/File:Rotterdam_-_New_Orleans_(3).jpg), [GraphyArchy 00031](https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00031.jpg), [Kop van Zuid panoramio (14)](https://commons.wikimedia.org/wiki/File:Kop_van_Zuid,_Rotterdam,_Netherlands_-_panoramio_(14).jpg) en [New Orleans 2010](https://commons.wikimedia.org/wiki/File:New_Orleans_2010.JPG) (snavel, westkop, foyer)
  - [Woontoren New Orleans in Rotterdam](https://commons.wikimedia.org/wiki/File:Woontoren_New_Orleans_in_Rotterdam.jpg) (noordwest)
