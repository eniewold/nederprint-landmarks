# Hoftoren (Den Haag)

Kantoortoren van het Rijk naast Den Haag Centraal (Kohn Pedersen Fox, 2003), 141,86 m, bijnaam "de Vulpen". De plattegrond is een druppel. Boven de laatste verdieping loopt de gevel door als open stalen kroon onder een schuin dakvlak. Een steiler scherm langs de zuidwestgevel loopt uit in de witte punt: de penpunt. In hetzelfde BAG-pand hangt aan de toren een lagere vleugel in de vorm van een boemerang, plus een lage strook langs het stationsgebouw.

Het model bestaat uit benoemde prisma's die met dakvlakken (planvergelijkingen) zijn afgesneden, in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs`, `generate-castalia.mjs` en `generate-delftse-poort.mjs`. Reproductie: `node scripts/generate-hoftoren.mjs`.

## Bestanden en plaatsing

- `hoftoren.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 52.906 driehoeken).
- `hoftoren.json`: catalogusitem.
  - RD-oorsprong `[81975, 455237]`, midden in de toren.
  - `xAxis` 37,3°: haaks op de rechte zuidwestgevel (BAG 127,3°) en langs de zuidrand van het pand aan het stationsgebouw (BAG 37,4°).
  - +Y wijst naar het noordwesten, naar de noordwestkop met de punt. De vleugel ligt aan +X, het stationsgebouw aan −Y.
- `hoftoren-1-1000.stl`: millimeters, Z omhoog, 82,3 × 75,6 × 143,0 mm, vlakke voet.

z = 0 ligt op NAP +0,6 m, op de straten rondom (AHN-DTM +0,55 tot +0,75). De voet loopt door tot −1,2 m. `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de Rijnstraat aan de oostkant (`[66,0] [66,20]`) en op de straat aan de westkant (`[−16,12] [−16,25]`). Het binnenterrein ten noorden van de toren ligt op +3,7 tot +4,2; daar dekt het PDOK-terrein de voet.

Het model vervangt alleen BAG `0518100001749878` (2003). Dat ene pand omvat de toren, de vleugel en de lage strook langs het stationsgebouw.

Wat er niet bij hoort:

- Het stationsgebouw ten zuiden (`0518100000274290`) is een apart pand, met een eigen inham van 12 × 4 m in de strook (u 21,2–33,2). Het model stopt 0,1 m voor de grens.
- De Castalia (`models/castalia`, 50 m naar het zuidwesten) is een apart model. De Zurichtoren en het Strijkijzer zijn aparte gebouwen.

In de 3D BAG blijven de buren op hun eigen hoogte (stationsgebouw tot 62,9, de panden ten noordwesten tot 24,7 en 35,9). Ze hebben dus geen punten van de toren meegenomen.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Toren

- **Plattegrond** (52 hoekpunten), 26 × 55 m:
  - rechte zuidwestgevel van natuursteen (BAG u = −11,4);
  - licht schuine noordoostgevel (BAG) met een ronde noordhoek;
  - smalle noordwestkop van 7,4 m tussen de twee vinnen;
  - ronde glazen zuidoostkop. Deze volgt de AHN-contour van de torenkop in facetten van 1,8 m en steekt boven de lage strook uit.
- **Laatste verdieping op +95,5.** Daaronder 27 lagen van 3,3 m boven een entree van 4,5 m.
- **Dakvlak** (de "schuin oplopende" kant): z = 111,55 − 0,187 x + 0,5445 y, 30° (kleinste-kwadratenfit op 2370 AHN-punten; 3D BAG 32,5°). Het loopt op van +94,7 bij de glazen kop tot circa +124 bij de noordwestkop en loopt licht af naar de noordoostgevel.
- **Scherm langs de zuidwestgevel**, 1,45 m dik, steiler dan het dak: 0,8 per m (38°). De AHN-maxima op de gevel zijn 112,7 / 122,3 / 132,2 / 137,7 / 141,2 op y = −12 / 0 / 12 / 20 / 24. Het scherm begint 5 m boven het dak bij de glazen kop.
- **De punt (+142,4)**: het scherm loopt door tot de witte vin op de westhoek van de noordwestkop. Die vin staat 1,9 m voor de kop uit (BAG-voet).
- **Tweede vin** op de noordhoek van de kop: 1,1 m breed, schuine top tot +133,0 (AHN 132,6).
- **Open kroon**:
  - een goot van 1,4 m tussen scherm en dakvlak (AHN, 3D BAG-terrassen 106,8 / 107,3 / 109,7);
  - het terras achter de noordwestkop op +104,5 (3D BAG 104,4–104,8). Wanden van 1,4 m blijven staan;
  - verticale sleuven van 0,9 m op 1,8 m in alle gevels boven +96,6.
- **Gevels**: één venster per travee van 1,8 m per verdieping (nissen van 0,35 m). De natuurstenen gevels hebben vensters van 1,0 m, de glazen kop van 1,4 m en de noordwestkop van 1,6 m. In de entreelaag zit één hoge nis per travee.

### Vleugel

- **Plattegrond**: de BAG-contour, een boemerang. De noordarm loopt langs de Rijnstraat, de diagonale arm naar de toren. Ze is samen 57 m lang en 14 tot 43 m breed.
- **Dak met twee vlakken** (AHN-fit, rms 0,16–0,18 m), samen een flauw getordeerd dak dat naar de noordpunt oploopt:
  - P1 over de noordarm en de oostkant: 63,97 − 0,0548 x + 0,1525 y, 9,2°, tot +67,1 op de noordpunt (3D BAG 67,05);
  - P2 over de diagonale arm: 56,37 + 0,1002 x + 0,0898 y, met een vlak deel van +56,8 bij de toren;
  - ze snijden elkaar in een nok op x = 49,03 + 0,4045 y.
- **Dakrand**: het dak ligt 0,8 m onder een rand van 0,9 m.
- **Verhoogde rand** van +58,6 langs het stationsgebouw.
- **Installatieopbouw** van 9 × 10 m tot +62,8.
- **Gevels**: vensters van 1,1 m per travee van 1,8 m in 18 verdiepingen van 3,3 m, boven een glazen entreelaag.
- **Luifel** langs de Rijnstraat: 4 m diep en 36 m lang, bovenkant +8,0 (AHN), 0,9 m dik.

### Lage strook

- **Strook langs het stationsgebouw**: +9,2 (3D BAG), het oostelijke deel +52,4 (AHN 50,0–52,8).

## Backlog-hints tegen de metingen

- **"Schuin oplopende noordgevel"**: het dakvlak loopt op naar het noordwesten (127°), en het steile scherm staat langs de zuidwestgevel. Er is geen aparte schuine noordgevel. De noordwestkop is een smalle, verticale gevel tussen twee vinnen.
- **"Spitse top"**: klopt. De top is een punt, geen mes. Het hoogste punt is de witte vin op de westhoek van de kop. De tweede vin op de noordhoek is 9 m lager. Foto's van alle kanten en het AHN (141,2 op één cel) bevestigen dat.

## Geschat en weggelaten

Geschat:

- **Vensters per verdieping** van 3,3 m (27 lagen boven een entree van 4,5 m; Wikipedia noemt 29 lagen) in travees van 1,8 m, uit foto's. De glazen kop en de noordwestkop hebben bredere ruiten.
- **Kroonsleuven**: het open staalwerk boven +95,5 als verticale sleuven van 0,9 m op 1,8 m (foto's).
- **Tweede vin**: breedte en schuine bovenkant uit foto's. De top komt uit het AHN.
- **Hoogte van de punt**: +142,4 = 141,86 m (Wikipedia) boven het maaiveld van +0,6. Het AHN ziet de dunne vin tot 141,2.
- **Lage strook langs het stationsgebouw** op +9,2 uit de 3D BAG. In die smalle strook tussen twee gebouwen van 60 m heeft het AHN geen punten.
- **Vleugelgevels**: vensters en verdiepingen uit een frontale foto van de oostgevel. De luifel is 0,9 m dik gemaakt.

Weggelaten:

- **Gebogen schoor tussen de twee vinnen** en de leuningen van de gevelonderhoudsinstallatie op de kroon: dunner dan 0,9 m en vrij overspannend.
- **Licht uitkragende bovenste vijf lagen** in de oostgevel van de vleugel. Dakrand en BAG-voet liggen binnen 0,5 m van elkaar, dus de uitkraging is kleiner dan 1 m.
- **De twee ronde kolommen** onder de oostgevel van de vleugel (Ø 1,5 m, BAG).
- **Lager terras langs de noordoostgevel in de kroon**: de 3D BAG heeft daar een vlak op +112,2, maar het AHN ziet het dakvlak. Waarschijnlijk zag de 3D BAG door het staalwerk heen.
- **Hellingbaan bij de westhoek van de strook** (3D BAG 0,6–6,4): onder het maaiveldniveau van het model.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 20 (de luifel tegen de vensternissen), 209.053 m³. Nissen die de vleugel of de strook afdekken, worden ingesloten holtes; die vallen weg. De ondervlakken zijn de bovenkanten van de nissen en de onderkant van de luifel.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 363 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet en punt (+142,4);
  - het scherm (0,8 per m) en de tweede vin;
  - dat niets boven het dakvlak uitsteekt en dat de glazen kop op het dakvlak eindigt;
  - de goot en het terras in de kroon;
  - 27 vensterrijen en de kroonsleuven in de zuidwestgevel;
  - vleugeldak, installatieopbouw, luifel en lage strook;
  - dat niets voorbij de grens met het stationsgebouw komt.
- **Printcheck** op 1:1000 bij 45°: 0,24 % extra volume (de luifel en de nissen).
- **Export**: `createModelBundle` op 1:1000, RD `[81940,455190,82045,455315]`. Duur 19,4 s, 78 objecten, 209.990 driehoeken, drie vellen, modelhoogte 158,1 mm. Het model staat compleet op het terrein; de luifel krijgt een wig naar de gevel.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, plus lage hoeken als de foto's. De 3D BAG heeft de juiste massa's, maar vlakke wanden, een rafelige schuine top met losse pieken en de vleugel als vlakke dozen. Het model heeft per kant meer:
  - **Noordwest (−35°)**:
    - de noordwestkop met beide vinnen en de punt;
    - de holle westgevel van de vleugel met vensterrijen en dakrand;
    - het dak met twee vlakken.
  - **Noordoost (55°)**:
    - de noordoostgevel met vensters en kroonsleuven onder het schuine dakvlak;
    - de oostgevel van de vleugel met vensters en luifel;
    - de installatieopbouw.
  - **Zuidoost (145°)**:
    - de ronde glazen kop met bredere ruiten;
    - het dakvlak dat oploopt naar het scherm;
    - de verhoogde rand van de vleugel en de lage strook.
  - **Zuidwest (235°)**:
    - de rechte natuurstenen gevel met 27 vensterrijen;
    - het scherm dat met 38° oploopt tot de punt, met kroonsleuven;
    - de goot erachter.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.08071/4.32209/350/1x1/0)): toren en vleugel liggen op de PDOK-reconstructie van het pand naast de Castalia, de schuine kroon met de vin en het vensterraster zijn zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (ruwe kroon, vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0518100001749878`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, pand 0518100001749878](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001749878) (TU Delft/3D geoinformatie, CC BY 4.0): dakhelling, terrassen in de kroon, platte delen en de lage strook.
- [Wikipedia: Hoftoren](https://nl.wikipedia.org/wiki/Hoftoren) en [Hoftoren (Engels)](https://en.wikipedia.org/wiki/Hoftoren): 141,86 m, 29 lagen, KPF, de Vulpen, open bovenste deel.
- Commons, alleen als visuele referentie:
  - [Den Haag Hoftoren 4](https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_4.jpg) (noordwestkop met beide vinnen)
  - [Den Haag Hoftoren 6](https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_6.jpg) (kroon en vin)
  - [Den Haag Hoftoren 2](https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_2.jpg) en [3](https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_3.jpg) (vleugel en toren vanaf het noorden)
  - [Ministerie OCW](https://commons.wikimedia.org/wiki/File:Ministerie_OCW.jpg) (glazen zuidoostkop)
  - [Hoftoren vanaf Laan van Reagan en Gorbatsjov](https://commons.wikimedia.org/wiki/File:Den_Haag,_Hoftoren_vanaf_Laan_van_Reagan_en_Gorbatsjov_IMG_8945_2019-03-24_17.46_(cropped).jpg) (vleugel en kroon)
  - [Den Haag – De Hoftoren](https://commons.wikimedia.org/wiki/File:Den_Haag_-_De_Hoftoren_(25949001308).jpg) (zuidwestgevel met scherm)
  - [Den Haag Hoftoren & Zurichtoren 3](https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_%26_Zurichtoren_3.jpg)
