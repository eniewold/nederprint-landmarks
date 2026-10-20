# HAUT (Amsterdam)

Vereenvoudigd, printbaar model van HAUT in het Amstelkwartier aan de Amstel (Team V Architectuur met Arup, opgeleverd 2021): een houten woontoren van 21 lagen en 73 m, met op hetzelfde BAG-pand een plint van drie lagen en een lage vleugel van negen lagen. Kenmerkend zijn de witte vloerranden per verdieping met glas ertussen, de balkons die per laag verspringen, dubbelhoge loggia's, een verspringing in de noordgevel onder een doorlopende dakrand en de scherpe zuidoostpunt van de vijfhoekige plattegrond.

De BAG noemt bouwjaar 2017 (begin bouw); de toren is in 2021 opgeleverd. Het AHN-DSM dat hier gebruikt is toont de toren al af (dak +72,2 m, balkons op de bovenste laag) en komt overeen met de 3D BAG op AHN5 (2023), die geen mutatie tussen AHN4 en AHN5 meldt.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `haut-amsterdam.glb` | Model in meters, Y omhoog, één node `building:haut-toren-met-verspringende-balkons-plint-en-vleugel` |
| `haut-amsterdam.json` | Catalogusitem |
| `haut-amsterdam-1-1000.stl` | Los te printen op 1:1000 (47,5 × 36,8 × 73,8 mm), Z omhoog |

Gegenereerd door `scripts/generate-haut-amsterdam.mjs`.

## Oorsprong en oriëntatie

RD-oorsprong `[123120, 483716]`, midden in het BAG-pand. De lokale X-as staat −28,7° op RD-oost, langs de zuidgevel van toren en plint (BAG-zijde A–B; de west- en noordgevel staan daar haaks op); +Y wijst naar het noordnoordoosten. Lokaal z = 0 is NAP +0,61 m (3D BAG `b3_h_maaiveld`; AHN-DTM op straat en plein rondom 0,4–0,8). `groundSamplePoints` liggen op straat en stoep rondom, `groundHeight` is 43,494 m (ellipsoïdisch, laagste PDOK-terrein ten noordoosten), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Plattegrond (lokaal) | Hoogte (NAP) |
| --- | --- | --- |
| Toren | vijfhoek: zuidgevel v = 0,80 → 0,40, westgevel u = −18,15, noordgevel v = 17,45, noordoostgevel 0,6 m binnen de BAG-lijn C–D (50° gedraaid) | dak +72,23 m |
| Dakrand | 0,9 m breed rondom | +73,6 m |
| Dakframe | vijfhoek van circa 5 × 5 m (3D BAG-vlak 85) | +73,65 m |
| Verspringing noordgevel | van de noordoosthoek tot u = −3,0 staan de lagen 1,5 m terug, verbindingsstuk onder 45° tot u = −4,5; de dakrand loopt recht door met een onderkant onder 45° | tot +71,33 m |
| Dakterras bovenste laag | u 4,9–10,0, 1,5 m de toren in | vloer +68,9 m |
| Oostpunt | strook u 23,6–25,0 en scherpe punt (40°) tot (27,34; 0,41) | +60,0 en +57,0 m |
| Plint | BAG-contour ten zuiden van de toren | +12,85 m |
| Lage vleugel | tussen toren, BAG-zijde B–C en de lijn (4,03; −0,29)–(17,39; −12,63) | +30,65 m |
| Trappenhuis | twee blokjes op de hoek van plint en vleugel | +27,4 en +18,5 m |

Verdiepingen: begane grond tot +6,2 m, daarboven 20 lagen van 3,3 m tot de bovenste vloer op +68,9 m (3D BAG-vlak 93 en het DSM op de balkons). Plint en vleugel volgen hetzelfde raster.

Gevelopbouw: per laag een witte vloerrand van 0,9 m en daartussen een glasband als blinde nis van 0,35 m met een plafond onder 45°, rondom doorlopend en om de buitenhoeken. Balkons zijn dichte platen op de vloerrand (voorkant 0,9 m) met een onderkant onder 47° terug naar het glas: zuidgevel 1,8 m diep, noordoostgevel 1,6 m, westgevel en het westelijke deel van de noordgevel 1,0 m, per laag een tot drie van 3,5–9 m op wisselende plaatsen. Op de bovenste laag van de zuidgevel staan ze op de plaatsen die het DSM toont (u −4,5…−1, 5,5…9 en 17…20,5, tot 2 m buiten de gevel). Dubbelhoge loggia's van 1,4 m diep over twee lagen: drie bij de noordwesthoek, twee in de westgevel en twee in de noordoostgevel.

Contouren uit de BAG, dakhoogtes uit de 3D BAG (LoD2.2, AHN5 2023), dakranden en balkons op de bovenste laag uit het AHN-DSM 0,5 m, gevelopbouw uit de foto vanaf metrostation Spaklerweg.

## Geschat en weggelaten

- Het balkonpatroon onder de bovenste laag is geschat: de foto laat per laag verspringende balkons zien op de noordoost- en zuidgevel, het DSM ziet alleen de bovenste laag en losse platen op 40–66 m langs de noord- en westgevel. Diepte en lengte zijn op de foto en het DSM geschat.
- De verspringing in de noordgevel (1,5 m, tot u = −3,0) is op de foto geschat: de vloerranden maken daar een binnenhoek met een schuin verbindingsstuk, terwijl de dakrand recht doorloopt. Het DSM ziet alleen het dak.
- Ligging en aantal van de dubbelhoge loggia's zijn geschat; alleen die bij de noordwesthoek is op de foto te zien.
- Het dakframe is op de foto een open portaal; het is hier een dicht blok op de 3D BAG-hoogte.
- De 3D BAG-terrassen op +57,0 en +60,0 m bij de oostpunt zijn klein (2–3 m²); het model volgt ze, het DSM ziet daar lagere punten.
- Glazen balustrades, stijlen en regels van de glasgevels en de zonnepanelen op plint en dak zijn dunner dan 0,9 m en weggelaten; de lage hoek van het trappenhuis (3D BAG-vlak 91, +69,7 tot +70,6 m, 1,7 m²) is niet overgenomen.
- De verdiepingshoogtes zijn afgeleid uit de bovenste vloer (+68,9 m) en het aantal lagen; de begane grond is 5,6 m.

## Controle

`node scripts/generate-haut-amsterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel (5.366 driehoeken, 154 nissen, 84 balkons). In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van toren, dakrand, dakframe, dakterras, oostpunt, plint, vleugel en trappenhuis, de verspringing van de noordgevel onder de doorlopende dakrand, een balkon op de bovenste laag van de zuidgevel, dat een glasband in de plint na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing; de printcorrectie voegt 0,005 % volume toe. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto gelegd. De dichtstbijzijnde andere landmarkmodellen (Mondriaantoren, Breitnertoren, Rembrandttoren, Amstel Tower) liggen meer dan 400 m verderop.

## Bronnen

- PDOK BAG, pand `0363100012246300` (bouwjaar 2017); actuele orthoHR; AHN DSM en DTM 0,5 m.
- 3D BAG: [pand 0363100012246300](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012246300).
- [Wikipedia: HAUT](https://nl.wikipedia.org/wiki/HAUT).
- Foto's op Wikimedia Commons (niet meegeleverd): [HAUT Amsterdam2](https://commons.wikimedia.org/wiki/File:HAUT_Amsterdam2.jpg) (Tim Bindels, november 2021, vanaf metrostation Spaklerweg), [HAUT Amsterdam](https://commons.wikimedia.org/wiki/File:HAUT_Amsterdam.jpg) (bouwbord met ontwerpimpressie, 2019).
