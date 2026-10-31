# Q Residences (Amsterdam)

Vereenvoudigd, printbaar model van Q Residences aan de Buitenveldertselaan, op de hoek met de Van Nijenrodeweg aan de zuidrand van de Zuidas (Studio Gang met Bureau Rijnboutt, opgeleverd in december 2022). Het complex staat op één BAG-pand en bestaat uit twee gebouwen: de toren Quartz (23 lagen, circa 74 m) met afgeronde hoeken en een witbetonnen gevel van schuine vinnen en golvende vloerranden, waardoor de balkons per laag in en uit het gevelvlak schuiven, en ten zuiden daarvan het blok Qube (acht lagen op een hoge begane grond) met brede vloerranden met een schuin ondervlak. Tussen de twee ligt een plein boven de parkeergarage.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `q-residences.glb` | Model in meters, Y omhoog, twee nodes: `building:q-residences-quartz` en `building:q-residences-qube` |
| `q-residences.json` | Catalogusitem |
| `q-residences-1-1000.stl` | Los te printen op 1:1000 (35 × 77 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[119614.9, 482272.6]`, in het hart van de BAG-contour op het plein tussen de twee gebouwen. De lokale X-as loopt langs de korte gevels naar het oosten, 0,2° rechtsom van RD-oost (de BAG-randen staan op −0,18° en −0,26°); Y wijst naar het noorden. Lokaal z = 0 is NAP −0,72 m (3D BAG-maaiveld); `groundHeight` is 42,34 m (ellipsoïdisch: NAP −0,72 plus de NLGEO2018-geoïde 43,056 ter plekke) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Quartz | 21,7 × 35,4 m, hoeken met 3,0 m straal | dak +72,80 m | 3D BAG LoD2.2 (dakvlak 72,73–72,88; AHN5 2023); west- en noordgevel op de BAG-contour; hoekstraal uit de luchtfoto |
| Installatie op Quartz | 1,9 × 2,3 m | +73,99 m | 3D BAG (73,63–73,99) |
| Qube | 33,0 × 22,6 m (BAG-contour) | dak +30,24 m | BAG, 3D BAG (30,24–30,25) |
| Verhoogd middendeel van Qube | 10,4 × 10,2 m | +32,18 m | 3D BAG (32,14–32,20) |
| Vloerranden van Qube | 1,2 m buiten de gevel, 0,9 m dik, ondervlak onder 45° | op elke vloer en langs de dakrand | foto's, luchtfoto (dakrand steekt 1–2 m buiten de BAG-contour) |

Gevelreliëf van Quartz: een begane grond van 5,4 m met de pui 0,8 m achter kolommen van 0,9 m, daarboven 22 lagen van 3,10 m. Op de lange gevels zes traveeën tussen de hoekbalkons, op de korte drie; per laag en travee een loggia als blinde nis met een plafond onder 45°, achter een borstwering van 0,9 m. De diepte van de loggia's (0,4 / 0,8 / 1,2 m) golft diagonaal over de gevel en de vinnen van 0,9 m slingeren zijdelings tot 0,7 m mee in een golf over vier lagen, als benadering van de schuine, golvende vinnen. In de afgeronde hoeken wisselen per laag een diepe (1,2 m) en een ondiepe (0,4 m) gebogen loggia.

## Geschat en weggelaten

- Het AHN4 van de PDOK-WCS toont hier nog de bouwput (DSM binnen de contour NAP −6 tot −1); alle hoogtes en de plattegrond van Quartz komen uit de 3D BAG, die de AHN5-puntwolk van 2023 gebruikt.
- Oost- en zuidgevel van Quartz komen uit de 3D BAG (de oostwand loopt daar 1,2 m scheef; het gemiddelde is genomen). De BAG-contour loopt over de parkeergarage oostelijk van de toren en tot aan Qube door; daar staat op maaiveld niets.
- Verdiepingshoogtes, het traveeraster, de golf van loggiadieptes en vinnen, de hoekstraal en de uitsteek van de vloerranden van Qube zijn geschat uit foto's en de luchtfoto. Het echte vinnenpatroon is niet per vin nagetekend.
- Weggelaten: balkonhekken, de dunne vloerranden en vinnen op hun werkelijke dikte (0,3–0,4 m, kleiner dan 0,9 m; hier verbreed tot 0,9 m), de zonnepanelen en de looprand op de daken (kleiner dan 0,9 m), en het beeld van Studio Job op het plein (los kunstwerk van dunne kaders, geen deel van het gebouw).

## Controle

`node scripts/generate-q-residences.mjs` geeft voor beide gebouwen `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de daken en installaties via rayCast, de afgeronde hoek, dat de loggia's in de westgevel van Quartz verschillend diep zijn en na de printcorrectie op 45° blijven, dat de vloerranden van Qube 1,2 m uitsteken, dat de printcorrectie minder dan 1 % volume toevoegt, en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0363100012089779` (bouwjaar 2022); actuele orthoHR; AHN-DTM 0,5 m; 3D BAG LoD2.2 (puntwolk AHN5, 2023); NLGEO2018-geoïde.
- [Q Residences op Wikipedia](https://nl.wikipedia.org/wiki/Q_Residences).
- [Dezeen: Studio Gang's Q Residences](https://www.dezeen.com/2022/12/16/studio-gangs-q-residences-amsterdam/) en [Studio Gang: Q Residences](https://studiogang.com/projects/amsterdam-tower/).
- Foto's op Wikimedia Commons (niet meegeleverd): [Category:Q Residences](https://commons.wikimedia.org/wiki/Category:Q_Residences).
