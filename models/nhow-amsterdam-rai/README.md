# nhow Amsterdam RAI (Amsterdam)

Hotel aan de Europaboulevard bij de RAI (OMA, Reinier de Graaf en Rem Koolhaas; bouw 2016–2019, open januari 2020), 91 m hoog met 650 kamers. Drie gestapelde gelijkzijdige driehoekige volumes om één kern: het onderste en het bovenste hebben dezelfde plattegrond, het middelste staat 30 graden gedraaid. Zijn punten kragen tot 15 m uit boven het onderste volume en onder het bovenste. Tussen de volumes ligt telkens een terugliggende glazen verdieping op de zeshoekige doorsnede van de twee driehoeken. Het geheel staat op een ronde glazen voet van twee lagen met vijf losse kolommen.

Het model bestaat uit benoemde prisma's in een eigen gebouwstelsel, met glasvakken per laag in de gevels. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-montevideo.mjs` (stapeling van volumes op `efteling-kit.mjs`). Reproductie: `node scripts/generate-nhow-amsterdam-rai.mjs`.

## Bestanden en plaatsing

- `nhow-amsterdam-rai.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 2, 33.336 driehoeken).
- `nhow-amsterdam-rai.json`: catalogusitem.
  - RD-oorsprong `[121178.6, 483505.55]`: het gemeenschappelijke zwaartepunt van de drie driehoeken (lijnfit op de AHN5-randen; de zwaartepunten van de bovenste en de middelste driehoek liggen 0,07 m uit elkaar).
  - `xAxis` 3,6°: langs de noordgevel van het onderste en het bovenste volume, naar de RAI-hallen. Hun derde punt wijst naar −Y (de A10).
  - Het middelste volume heeft punten naar het westen (180°), het noordnoordoosten (60°) en het zuidoosten (−60°, lokaal).
- `nhow-amsterdam-rai-1-1000.stl`: millimeters, Z omhoog, 64,1 × 64,1 × 91,3 mm, vlakke voet.

z = 0 ligt op NAP +0,4 m, op het plein rondom (AHN-DTM +0,3 tot +1,0). De voet loopt door tot −1,0 m. `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op het plein onder de uitkragingen, 20 m van het hart (`[0,21] [19,8] [−19,8] [14,−14] [−14,−14]`). Het lage fietspad aan de zuidkant langs de A10 (PDOK-terrein 42,45) blijft erbuiten.
- `groundHeight` 43,37 is de laagste PDOK-terreinhoogte op die punten (ellipsoïdisch, gemeten op 12 oktober 2026 in de terreintegel van de export).

Het model vervangt BAG `0363100012247941` (bouwjaar 2019). De BAG-contour omvat ook de ondergrondse garage met de ronde hellingbaan; PDOK legt dat deel als vlakke plaat op het maaiveld en dat verdwijnt mee. Het dichtstbijzijnde andere pand is de RAI-vleugel `0363100012153887`, 94 m naar het noorden. Het model raakt geen ander pand en geen ander landmarkmodel.

## Onderdelen (hoogtes NAP)

### Drie driehoekige volumes

- **Plattegrond** (AHN5, lijnfit per gevel met een spreiding van 0,16–0,39 m):
  - onder en boven een gelijkzijdige driehoek van 59,7 m zijde (fit 59,5–59,9), gevels op 3,6°, 63,6° en 123,6° (fit 3,9°, 63,5° en 123,5°);
  - midden 59,3 m zijde (fit 59,2–59,5), gevels op 33,6° (fit 33,4°, 93,6° en 153,6°), dus 30° gedraaid, om hetzelfde hart.
- **Onderste volume** van +9,0 tot **+36,2**: 8 lagen van 3,4 m. De onderkant ligt vlak boven de voet; de punten kragen tot 18 m uit voorbij de voet.
- **Middelste volume** van **+39,5** tot **+59,8** (AHN5 59,74–59,78 op de punten): 6 lagen van 3,38 m.
  - Een rand van 0,9 m tot **+61,0** (lamellen en glas om de dakterrassen; AHN5 90e percentiel 61,0).
  - De punten kragen 14,3 m uit voorbij het onderste en het bovenste volume, met vlakke onderkanten.
- **Bovenste volume** van **+64,7** tot **+87,9** (AHN5-mediaan 87,89): 7 lagen van 3,31 m.
- **Gevels**: per laag glasvakken van 1,2 m breed en 0,35 m diep op 1,95 m, met een verdiepingsregel. Ze staan voor de verticale V-lamellen en het glas.

### Glazen tussenlagen en voet

- **Tussenlagen**: zeshoekig, de doorsnede van de twee driehoeken, 2,0 m terugliggend.
  - Tussen het onderste en het middelste volume van +36,2 tot +39,5.
  - Tussen het middelste en het bovenste volume van +59,8 tot +64,7.
  - Eromheen liggen de dakterrassen.
  - Glasvakken per gevelvak.
- **Ronde glazen voet** (BGT-pand op het maaiveld, vereenvoudigd tot 0,25 m) tot +9,0, met twee rijen glasvakken (begane grond met winkels, eerste verdieping met lounge en bar). Twee halfronde uitstulpingen aan de noordkant zijn uit de BGT overgenomen.
- **Vijf kolommen** van 1,0 m (BGT-vlakjes van 0,6–0,9 m²) rond de voet, onder het onderste volume.

### Dak en logo

- **Installatieopbouw** op het bovenste dak tot **+90,7** (AHN5 90,3–90,8; convex omhulsel, zes hoeken).
  - Een goot van 1,2 m tot +89,0 tussen de westelijke strook en het hoofdblok.
  - Een lager zuidelijk deel tot +90,2.
  - Louvrevakken in de wanden.
- **Verdiept dakterras** aan de noordgevel van het bovenste volume: 10,4 × 5,3 m, vloer **+83,75** (AHN5-mediaan), met een borstwering van 0,9 m langs de gevel.
- **Letter n** van het nhow-logo op het dakterras in de zuidoostpunt van het middelste volume.
  - 4,0 × 4,5 m en 0,9 m dik, tot **+64,3**.
  - Evenwijdig aan de zuidzuidwestgevel, 3 m achter de gevel.
  - De opening heeft een spitse top van 51°.

## Geschat en weggelaten

Geschat:

- **Onderkanten en tussenlagen**: het DSM ziet alleen de daken. Het dak van het onderste volume ligt helemaal onder het middelste en het bovenste.
  - Het dak van het onderste volume (+36,2) en de onderkanten van het middelste (+39,5) en het bovenste volume (+64,7) komen uit een fit van de slagschaduw op de luchtfoto. Daarvoor zijn de drie driehoeken en de tussenlagen geprojecteerd op het AHN-maaiveld ten noorden van het hotel. Het maaiveld daar varieert van +0,7 tot +4,6 (de verhoogde Europaboulevard).
  - De fit gaf een zonvector van 0,077/1,325 m per m hoogte en 9 % afwijking van het donkere vlak. Gevoeligheid: dak onder 36,0–36,5, onderkant boven 64,5–65,0, onderkant midden zwak bepaald (38–41).
  - Dat klopt met het aantal lagen op foto's en op de constructietekening van OMA: 8, 6 en 7 lagen, twee tussenlagen en een voet van twee. Schüco en ENR noemen 24–25 lagen.
- **Bovenkant van de voet** (+9,0, twee lagen): uit foto's. De schaduw van de voet valt binnen de schaduw van het gebouw.
- **Onderste volume = bovenste volume** in plattegrond: Wikipedia en foto's. In het DSM steekt het nergens buiten het bovenste uit.
- **Terugligging van de tussenlagen** (2,0 m): uit foto's. De schaduwfit gaf 1,9 m.
- **Gevelritme vereenvoudigd**: glasvakken van 1,2 m op 1,95 m in plaats van ca. 4000 V-lamellen op ongeveer 1 m.
- **Letter n**: plaats, stand en maat uit foto's.

Weggelaten:

- **Glazen balustrades** om de dakterrassen op het onderste en het middelste volume: glas, dunner dan 0,9 m.
- **V-lamellen** afzonderlijk: dunner dan 0,9 m. Ze zijn vervangen door het ritme van glasvakken.
- **Kleine installaties** op de opbouw (AHN5 tot +91,0): minder dan 0,9 m boven de opbouw.
- **De ondergrondse garage** en de ronde hellingbaan ten noorden van het hotel: ondergronds of op het maaiveld.
- **Het fietstunneltje** onder de Europaboulevard aan de zuidoostkant: geen deel van het pand.
- **De lichtere band** van dichte panelen in de onderste lagen van het middelste volume: materiaal, geen vorm.

## Controle (12 oktober 2026)

- **Generator**: `NoError`, één deel, genus 2 (de letter n en de goot), 122.966 m³. Twee keer draaien geeft byte-identieke bestanden.
  - Ondervlakken: de onderkanten van de drie volumes (+9,0, +39,5 en +64,7), de bovenkanten van de glasvakken en de onderkant van het installatieblok.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`. De eigen test controleert:
  - catalogus, vervangen pand, `groundHeight`, voet (−1,0) en top (+90,7);
  - de hoekpunten van de onderste en bovenste driehoek op +9,0, +36,2, +64,7 en +87,9;
  - het middelste volume (30° gedraaid) op +39,5 en +61,0, met het dak op +59,8;
  - dat onder de punten van het middelste volume niets staat tussen de voet en +39,4, en boven de punten van het onderste volume niets tussen +36,3 en +64,6;
  - de terugliggende tussenlagen en de ronde voet;
  - de installatieopbouw met goot en zuiddeel, het verdiepte terras en de letter n;
  - de glasvakken in de noordgevel van het bovenste volume.
- **Printcheck** op 1:1000 bij 45° (`supportedSolid`, gedeeld over de onderdelen zoals in de export): 122.966 → 128.307 mm³, 4,34 % opvulling.
  - Onder de uitkragende punten groeit een dichte wig van 45° die op de gevel van het volume eronder uitkomt: onder de punten van het middelste volume van +39,5 tot ca. +34, onder die van het bovenste tot ca. +58.
  - Onder het onderste volume loopt de wig tot de voet en de kolommen.
  - De GLB zelf houdt de vlakke donkere onderkanten.
- **Renders** naast de PDOK-reconstructie op −35°, 55°, 145° en 235° (30° hoogte) en naast Commons-foto's. PDOK heeft één prisma met de omtrek van het dak tot op de grond: geen uitkragingen, geen tussenlagen, geen voet. Het model heeft per kant meer:
  - **Noordwest (−35°)**: de westpunt van het middelste volume die over de westgevel uitkraagt, de terugliggende glazen tussenlagen, de noordgevel van het bovenste volume met het verdiepte dakterras, de ronde voet met kolommen en de glasvakken.
  - **Noordoost (55°)**: de stapeling onder–midden–boven met de noordnoordoostpunt van het middelste volume, de vlakke onderkanten, de dakopbouw en het terras.
  - **Zuidoost (145°)**: de zuidoostpunt van het middelste volume met de letter n, de zuidpunten van onder en boven die boven elkaar liggen, de voet en kolommen.
  - **Zuidwest (235°)**: de zuidzuidwestgevel van het middelste volume tussen de twee punten van onder en boven, de letter n en de dakterrassen.

## Bronnen

- PDOK BAG `0363100012247941`, BGT-pand `G0363.2b6cc0b35634488284232e7570eafed0` (voet en kolommen) en Actueel_orthoHR (plattegrond en slagschaduw); 12 oktober 2026.
- AHN5 DSM 0,5 m (opname 2023), [ahn.arcgisonline.nl](https://ahn.arcgisonline.nl/arcgis/rest/services/Hoogtebestand/AHN5_DSM_50cm/ImageServer): daken, randen, opbouw en terras. AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle en voor het maaiveld. Het AHN4 heeft aan de noordkant ruis van de bouw.
- [Wikipedia: Nhow Amsterdam RAI](https://nl.wikipedia.org/wiki/Nhow_Amsterdam_RAI): 91 m, middelste blok gedraaid.
- [Schüco, Dynamically stacked](https://www.schueco.com/eg/architects/magazine/dynamically-stacked): 24 lagen, ronde voet van twee lagen, twee glazen tussenlagen met zeshoekige plattegrond, ca. 4000 V-profielen.
- [Metalocus: three shifted volumes](https://www.metalocus.es/en/news/three-shifted-volumes-nhow-amsterdam-rai-hotel-oma): constructietekening van OMA met de lagen per volume.
- Commons-foto's van alle kanten: [NHOW Hotel Amsterdam RAI (1)](https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(1).jpg), [Q64040941](https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_-_Q64040941.jpg), [(3)](https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(3).jpg), [(4)](https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(4).jpg), [(5)](https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(5).jpg), [Nhow Amsterdam RAI](https://commons.wikimedia.org/wiki/File:Nhow_Amsterdam_RAI.jpg), [NhowRAI](https://commons.wikimedia.org/wiki/File:NhowRAI.jpg).
