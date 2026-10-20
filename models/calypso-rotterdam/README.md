# De Calypso (Rotterdam)

Vereenvoudigd, printbaar model van De Calypso aan de Mauritsweg en het Kruisplein (woon- en kantoorcomplex, 2008–2013, Will Alsop met Van der Laan Bouma Architekten), samen met de Pauluskerk (Alsop, 2013) die er aan de zuidkant tegenaan staat. Het complex is één BAG-pand van ruim 4.600 m²: een plint van vijf lagen met daarop aan het Kruisplein een rode toren met rood-oranje panelen en een zuilengalerij, en aan de Mauritsweg drie witte, gefacetteerde torens die naar het zuiden in hoogte afnemen. De noordelijke witte toren heeft een kop met een schuine onderkant boven de glazen tussenbouw; de zuidelijke helt naar buiten over de Pauluskerk.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `calypso-rotterdam.glb` | Model in meters, Y omhoog, één node `building:calypso-rode-toren-witte-torens-plint-en-pauluskerk` |
| `calypso-rotterdam.json` | Catalogusitem |
| `calypso-rotterdam-1-1000.stl` | Los te printen op 1:1000 (59 × 139 × 74 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[92070.0, 437290.0]` (in de middelste witte toren). De lokale X-as staat loodrecht op de westgevel aan de Mauritsweg, 6,15° op RD-oost; de Y-as loopt langs die gevel naar het noorden (96,15°, gemeten op de BAG-hoekpunten van de west- en plintgevel). Lokaal z = 0 is NAP −1,06 m (3D BAG-maaiveld). `groundSamplePoints` liggen op de stoep langs de Mauritsweg en op het Kruisplein, `groundHeight` is 42,403 m (laagste PDOK-terrein op de stoep, ellipsoïdisch), `groundOffsetMetres` −0,15.

`replacesBuildings` bevat De Calypso (`0599100010072083`) en de Pauluskerk (`0599100100001761`). De zuidtoren hangt 1,7 m over de kerk; de PDOK-reconstructie van de kerk heeft die strook meegenomen en zou als wand van NAP +14 tot +48 m tegen het model blijven staan. De kerk is daarom meegemodelleerd. De buurpanden aan de oostkant (`0599100000650755`, `0599100010015739`, Pathé `0599100000423926`) steken in PDOK niet meer dan 2 m boven het AHN uit en blijven staan. De Doelen (eigen model) ligt ruim 100 m noordelijker aan de overkant van het Kruisplein.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Plint | hele BAG-contour, vijf lagen (begane grond 5,0 m, vier lagen van 3,625 m) | +18,45 m |
| Glazen tussenbouw | tussen de rode toren en de noordelijke witte toren | +19,2 m (glasdak +18,9 tot +19,5 m) |
| Rode toren | noordgevel en oostgevel op de BAG-contour, zuidgevel schuin in plan (21,4° tegen 12,8° van de noordgevel) | +68,57 m |
| Installaties rode toren | twee blokken | +71,3 en +71,0 m |
| Zuilengalerij | begane grond langs noord- en westgevel 2,0 m teruggezet, 11 ronde zuilen van 1,0 m | tot +3,94 m |
| Middelste witte toren | circa 26 × 43 m, afgeschuinde hoeken, diepe knik in de westgevel naar de noordtoren (2 m diep, 5 m breed) | +68,75 m |
| Terras | 3,1 m diep aan de zuidrand van de middelste toren | +65,6 m |
| Installaties middelste toren | vier blokken | +70,0 tot +71,7 m |
| Noordelijke witte toren | circa 24 × 23 m; kop op de noordwesthoek 2,6 m uit de noordgevel | +56,77 m |
| Schuine onderkant | noordgevel staat op +19,2 m 2,4 m terug en staat vanaf +25,5 m op het dakvlak (24° uit het lood) | +19,2 tot +25,5 m |
| Zuidelijke witte toren | westgevel helt van u = −15,8 m op de plint naar −13,9 m op het dak; zuidgevel helt 1,7 m over de kerk (3,8°) | +45,0 m |
| Installatie zuidtoren | blok aan de zuidrand | +47,93 m |
| Opbouwen op de oostelijke plint | twee blokken | +21,3 en +22,4 m |
| Pauluskerk | koperen veelvlak op de BAG-contour; begane grond 1,5 m terug tot +2,2 m, gevels op de contour van +4,5/+5,5 tot +11,0/+12,0 m, dakrand 1,2 m ingesprongen, vier pijlers tot de grond | dak +14,3 m, punt aan de westkant +16,4 m |

Contouren uit de BAG. Hoogtes en dakvlakken uit de 3D BAG LoD2.2 (AHN5, 2023) en het AHN-DSM 0,5 m; de bovenste doorsnede van elke witte toren is zijn dakvlak uit de 3D BAG, vereenvoudigd tot een bolle veelhoek. De 3D BAG maakt van de hellende westgevel van de zuidtoren een schouder van +31,2 tot +34,9 m; het DSM (op u = −16 de plint, op −15 een strook op +34 tot +40 m, op −14 de toren) wijst op een gevel die naar binnen helt, en zo is hij gemodelleerd. Het overhangende dakvlak van de zuidtoren boven de kerk staat in de 3D BAG en in de PDOK-reconstructie van de kerk (tot RD y 437234,1). Het model komt voor 80 % binnen 1 m van het AHN-DSM; de afwijkingen liggen op gevelranden.

## Geschat en weggelaten

- Verdiepingen: plint als hierboven, torens in lagen van 3,14 m vanaf +18,45 m (de bovenste laag houdt de dakrand). Per laag blinde nissen van 0,35 m tussen verdiepingsranden van 0,9 m, met een plafond onder 45°: in de plint brede glasvlakken (2,6–4,6 m) tussen stijlen van 0,9–1,3 m, in de rode toren ramen en loggia's (1,1–2,6 m) tussen panelen van 0,9–1,5 m, in de witte torens balkons (2,4–3,8 m) tussen panelen van 1,0–2,4 m, per laag verspringend zoals de onregelmatige gevels op de foto's. Het patroon is niet per raam nagemeten. De kleuren van de rode toren (rood, oranje) zijn niet in het model te maken.
- De facetten van de witte torens: de lagere doorsneden springen op enkele hoeken 0,9–1,3 m in, zodat de gevels in schuine vlakken knikken; de werkelijke vouwlijnen zijn niet gemeten. Niets springt buiten het dakvlak uit, behalve de zuidtoren boven de kerk.
- De schuine onderkant van de noordtoren, de diepte van de zuilengalerij (2,0 m), de zuilafstand (circa 6 m) en de hoogte van de begane grond (5,0 m) zijn geschat uit foto's.
- Pauluskerk: de vorm met teruggezette begane grond, pijlers en ingesprongen dakrand is een benadering van het koperen veelvlak; de driehoekige ramen zijn 19 nissen van 0,4 m (basis 2,6 m, hoogte 2,2 m, punt om en om boven en onder) op de west-, zuid- en oostgevel, niet per raam nagemeten. De verhoogde strook op het dak (+15,0 tot +15,2 m, minder dan 0,9 m) en de klok zijn weggelaten.
- Glazen balustrades, gondels, antennes en de lift- en trappenkoker in de tussenbouw zijn kleiner dan 0,9 m of glas en zijn weggelaten. Een uitkraging boven de straat is op de BAG, de 3D BAG en de foto's niet te zien; de uitstekende delen zijn de kop van de noordtoren en de zuidtoren boven de kerk.

## Controle

`node scripts/generate-calypso-rotterdam.mjs` geeft `NoError`, één gesloten deel, 22196 driehoeken en genus 11: de elf zuilen van de galerij. In de webshop controleert `tests/landmark-models.test.ts` de daken van de vier torens, het terras en de installaties, de plint en de tussenbouw, het dak en de punt van de Pauluskerk, de overhang van de zuidtoren boven de kerk en haar hellende westgevel, de schuine onderkant van de noordtoren, de zuilengalerij, dat een raam in de rode toren na de printcorrectie op 45° een nis blijft, en de plaatsing; de printcorrectie voegt 0,18 % volume toe. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0599100010072083` (2013) en `0599100100001761` (2013); actuele orthoHR; AHN-DSM 0,5 m.
- 3D BAG: [De Calypso](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100010072083), [Pauluskerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100001761).
- [Wikipedia: Calypso (Rotterdam)](https://nl.wikipedia.org/wiki/Calypso_(Rotterdam)).
- Foto's op Wikimedia Commons (niet meegeleverd): [De Calypso in Rotterdam 2021 1](https://commons.wikimedia.org/wiki/File:De_Calypso_in_Rotterdam_2021_1.jpg), [De Calypso in Rotterdam 2021 2](https://commons.wikimedia.org/wiki/File:De_Calypso_in_Rotterdam_2021_2.jpg), [Rotterdam - De Calypso (3)](https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Calypso_(3).jpg), [Rotterdam - De Calypso (7)](https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Calypso_(7).jpg), [De Calypso vanaf het Groothandelsgebouw](https://commons.wikimedia.org/wiki/File:De_Calypso_-_Rotterdam_-_View_of_the_building_as_seen_from_the_Groothandelsgebouw_in_the_northwest.jpg), [Rotterdam mauritsweg calypsoflat](https://commons.wikimedia.org/wiki/File:Rotterdam_mauritsweg_calypsoflat.jpg), [Pauluskerk vanuit het zuidwesten](https://commons.wikimedia.org/wiki/File:Pauluskerk_-_Cool_-_Rotterdam_-_View_of_the_church_from_the_southwest.jpg), [Rotterdam nieuwe Pauluskerk](https://commons.wikimedia.org/wiki/File:Rotterdam_nieuwe_Pauluskerk.jpg).
