# Rijkskantoor Kempkensberg (Groningen)

Kantoor van DUO en de Belastingdienst aan de Kempkensberg (UNStudio, opgeleverd maart 2011, 92 m). Het gebouw bestaat uit twee in elkaar overlopende lobben met een eivormige plattegrond: een hoge lob van 24 lagen en een lage lob van 11 lagen, met per verdieping een doorlopende witte band. Het model bestaat uit benoemde bouwdelen in een eigen gebouwstelsel: elke verdieping is één vloerplaat met band, de plattegronden zijn gladde krommen gefit op de AHN-dakranden. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs` en `generate-cooltoren.mjs`. Reproductie: `node scripts/generate-kempkensberg.mjs`.

De backlog noemt een golvende toren met een lage ronde onderbouw aan de Europaweg. Metingen en foto's tonen iets anders:

- Het zijn twee lobben (hoog en laag), geen enkele golvende toren.
- De Europaweg ligt 1 km oostelijker.
- De lage onderbouw is een plint van één laag volgens de BAG-contour, met een uitbouw van 7 lagen aan de zuidwestzijde van de hoge lob en een vleugel van 2 lagen naast de lage lob.

De banden zijn uitstekende ribben vóór het glas. Het model volgt de metingen.

## Bestanden en plaatsing

- `kempkensberg.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 24.970 driehoeken).
- `kempkensberg.json`: catalogusitem.
  - RD-oorsprong `[234655.0, 580548.0]` in het hart van de hoge lob.
  - `xAxis` 124° (`[-0.55919, 0.82904]`): de lange as van beide lobben (AHN-dakranden, hoofdas 124° ± 1°).
  - +X wijst van de hoge lob naar de lage lob (noordwest), +Y naar het zuidwesten (bos), −Y naar de tuin op de parkeergarage.
- `kempkensberg-1-1000.stl`: millimeters, Z omhoog, 135,4 × 68,0 × 94,1 mm, vlakke voet.

z = 0 ligt op NAP +6,2 m: het maaiveld rondom (AHN-DTM +6,1 tot +6,4; aan de noordkop +5,1). De voet loopt door tot −1,5 m (NAP +4,7). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen aan de tuinzijde, de westzijde en bij de zuidkop, niet aan de lagere noordkop: `[−30,−20] [0,−20] [40,−42] [10,20] [−20,26] [−58,10]`.

Het model vervangt één BAG-pand: `0014100022187068` (toren, lage lob en plint, 4.224 m²).

Andere panden bij het complex:

- **`0014100022187265`**: de ondergrondse parkeergarage onder de tuin (Kempkensberg 14). Hij heeft geen 3D BAG-reconstructie. In de PDOK-export is hij een vlakke plaat onder het maaiveld; hij steekt nergens boven het AHN uit en blijft staan.
- **`0014100022188162`** (Helperzoom 3, paviljoen met groendak, +14,8): een los gebouw 60 m ten oosten. Het hoort niet bij de UNStudio-toren en blijft PDOK. Zijn 3D BAG-hoogte klopt met het AHN.
- **Woonblokken ten zuiden** (`0014100040016467`, `…031346`, `…031347`): +23,1, gelijk aan het AHN. Ze raken het model niet.
- **Andere landmarkmodellen**: binnen 700 m ligt er geen. Euroborg ligt 800 m oostelijker.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

| Onderdeel | Hoogte |
| --- | --- |
| Plint | +10,45 |
| Vleugel | +17,9 |
| Uitbouw | +34,3 |
| Lage lob | +48,26 |
| Hoge lob | +91,27 |
| Dakopbouw | +94,5 en +98,8 |

### Verdiepingen en banden

Er zijn 24 lagen boven het plintdak met een steek van 3,372 m (91,27 − 10,35 = 24 × 3,372). Met deze steek vallen de daken van vleugel, uitbouw en lage lob op het raster, met een dakrand van 0,4 tot 0,8 m.

- Per laag een witte band van 1,25 m over de hele omtrek. Het glas daaronder ligt 0,4 m terug.
- De 11e laag (+44,1 tot +47,4) is in beide lobben de doorlopende glazen laag met verticale lamellen: de "taille" van de hoge lob loopt over in de bovenste laag van de lage lob. Daar is de band 0,9 m en ligt het glas 0,6 m terug.
- De holle hoek tussen de lobben, de uitbouw en de vleugel is per laag afgerond met 3 m. Op foto's loopt daar een S-bocht.

### Hoge lob

- Eivormige plattegrond van 53,7 × 22,7 m op het dak (Fourierreeks op de AHN-dakrand, rms 0,27 m, bol gemaakt).
- De koppen steken onder +60 m verder uit, tot 63,6 m lang. Boven +60 m wijken ze per laag geleidelijk terug. AHN/3D BAG: zuidoostkop −32,3 op +71,7, −31 op +81 en −28,2 op +88; noordwestkop +31,5 tot +25,8 op het dak.
- De zijgevels staan loodrecht (AHN ±11,5 m op alle hoogtes).
- Dakopbouwen naar het AHN-raster: +94,5 (zuidoost), +98,8 met een trede van +95,6 (noordwest).
- Een druppelvormige rand van 0,9 m, 1,9 m hoog en 4 m binnen de dakrand: de rail van de gevelonderhoudsinstallatie met het hekwerk.

### Lage lob

- Eivormige plattegrond van 50 × 22 m op het dak (rms 0,23 m). De hoek tegen de hoge lob is aangevuld met een rechte zijde en een boog van 5 m.
- Beide koppen wijken van +18 m tot het dak terug: de noordkop van 79,6 naar 73,4, de kop tegen de hoge lob van 18,2 naar 23,4 (3D BAG-vlakken op 22,9/31/34,4/37,8/41,2/44,4 m).
- Dakopbouwen van +49,6 tot +50,6.

### Uitbouw, vleugel en plint

- **Uitbouw** aan de zuidwestzijde van de hoge lob: 7 lagen tot +34,3, als sikkel (superellips, tot 8 m voor de gevel; AHN v 14–19,5). De zuidoostpunt wijkt per laag 0,45 m terug (3D BAG).
- **Vleugel** van 2 lagen tot +17,9 tussen de lage lob en de plintrand (AHN).
- **Plint** van één laag tot +10,45 over de hele BAG-contour:
  - een glasstrook rondom van 0,4 m diep onder een witte dakrand van 0,9 m;
  - bij de zuidkop een glazen dakveld van 0,35 m diep. Het AHN heeft daar geen waarde; de ortho toont een staal-glasraster.

## Geschat en weggelaten

Geschat:

- **Verdiepingsteek** 3,372 m: uit het aantal lagen op foto's (7 in de uitbouw, 17 daarboven, 11 in de lage lob) en de AHN-hoogtes.
- **Banden**: hoogte 1,25 m en uitsteek 0,4 m uit foto's. Voor de glazen 11e laag 0,9 m en 0,6 m.
- **Terugwijken van de koppen**: een gladde functie tussen de gemeten randen. De lobben onder de lage lob en de vleugel volgen de breedste AHN-omtrek; het AHN ziet daar niets.
- **Afronding** tussen de lobben (3 m), de **vorm van de uitbouw** (superellips) en die van de **vleugel** (veelhoek uit het AHN).
- **Glazen dakveld** bij de zuidkop: de vorm komt uit de ortho; het AHN heeft daar geen waarde.
- **Gevelonderhoudsrail met hekwerk**: als dichte rand.

Weggelaten:

- **Golvende banden in de holle hoek**: op foto's buigen de banden van de lage lob daar een halve laag op of neer. In het model lopen alle banden horizontaal op dezelfde hoogte. De golf is kleiner dan een halve verdieping en zou op 1:1000 een trap van losse randjes geven.
- **Verticale lamellen in de glazen laag en de vensterstijlen**: kleiner dan 0,9 m.
- **Smalle schuine strook op het plintdak** bij de zuidkop: 3D BAG-vlak van 2 m breed op circa +15, op foto's niet te herkennen.
- **Sculptuur, vlaggenmasten en antennes** op de daken: kleiner dan 0,9 m.
- **Tuin, vijvers en de inrit van de parkeergarage**: terrein, zit in PDOK.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 170.080 m³. De ondervlakken zijn de onderkanten van de banden (0,4 m boven het glas, 52–113 m² per laag) en de dakrand van de plint.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 395 geslaagd. De eigen test controleert:
  - catalogus, oorsprong en het vervangen pand;
  - voet, dakopbouw en de daken van plint, vleugel, uitbouw, lage en hoge lob;
  - de koppen: breed onder +60 m, smal op het dak, de noordkop van de lage lob;
  - alle 24 banden op de tuingevel van de hoge lob met het glas eronder.
- **Printcheck** op 1:1000 bij 45°: 0,22 % extra volume, onder de banden.
- **Export**: `createModelBundle` op 1:1000, RD `[234580,580480,234725,580645]`. Duur 3,1 s, 85 objecten, 93.860 driehoeken, drie vellen. Het landmarkobject staat compleet in de 3MF en het vervangen pand ontbreekt.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf. De 3D BAG (LoD2.2) heeft de juiste massa van beide lobben, maar vlakke gevels zonder banden. De koppen zijn er grillige kolommen en de vleugel een blok. Het model heeft per kant meer:
  - **Noordwest (−35°)**: de lage lob met 11 banden en teruglopende noordkop, de vleugel van 2 lagen met dakrand, en daarachter de hoge lob met zijn ronde kop.
  - **Noordoost (55°, tuinzijde)**: 24 doorlopende banden over beide lobben, de glazen 11e laag, de afgeronde overgang tussen de lobben en de naar boven smaller wordende koppen.
  - **Zuidoost (145°)**: de smalle kop van de hoge lob met de uitbouw van 7 lagen ernaast, de dakopbouwen en de rail.
  - **Zuidwest (235°)**: de sikkelvormige uitbouw, de plint met glasstrook en het glazen dakveld bij de zuidkop.
- **Bovenaanzicht**: het model ligt op de BAG-voetafdruk en op de 3D BAG-daken van beide lobben.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/53.20570/6.57936/350/1x1/0)): beide lobben met de banden per laag en de plint liggen op de PDOK-reconstructie van het pand. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke gevels) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0014100022187068` en `0014100022187265`, BGT, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- 3D BAG, TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes en kopvlakken. [Pand 0014100022187068](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100022187068).
- [Wikipedia: Kempkensberg (kantoorgebouw)](https://nl.wikipedia.org/wiki/Kempkensberg_(kantoorgebouw)): 92 m, UNStudio, opgeleverd maart 2011.
- Commons, alleen als visuele referentie:
  - [Groningen Kempkensberg 04](https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_04.jpg) (vanaf het oosten, beide lobben met uitbouw en plint)
  - [Groningen Kempkensberg 07](https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_07.jpg) (zuidoost, uitbouw en glazen laag)
  - [Groningen Kempkensberg 10](https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_10.jpg) (tuinzijde, terugwijkende koppen)
  - [Groningen Kempkensberg 12](https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_12.jpg) (holle hoek tussen de lobben)
  - [Groningen Kempkensberg 03](https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_03.jpg) (westzijde, door de bomen)
  - [20120315 Kantorencomplex Kempkensberg](https://commons.wikimedia.org/wiki/File:20120315_Kantorencomplex_Kempkensberg_Groningen_NL.jpg) (kopaanzicht vanuit het zuidoosten, telling van de lagen)
  - [New Wave – Flickr – Rob Oo](https://commons.wikimedia.org/wiki/File:New_Wave_-_Flickr_-_Rob_Oo.jpg) (detail van de golvende banden)
