# Jheronimus ('s-Hertogenbosch)

Vereenvoudigd, printbaar model van woontoren Jheronimus (Hofvijver 1) in het Paleiskwartier naast het station, ontworpen door Baumschlager Eberle en opgeleverd in 2014. De toren van 74 m staat aan drie kanten in de Hofvijver en aan de oostkant aan de promenade. Op een vierkante schacht met een hoge begane grond (winkels, café) staat een kroon van zes lagen die rondom ruim een meter terugspringt. Elke gevel heeft per laag vier vensters en bij beide hoeken een diepe loggia; op het dak staan installaties.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `hofvijver-den-bosch.glb` | Model in meters, Y omhoog, één node: `building:hofvijver-den-bosch-jheronimus` |
| `hofvijver-den-bosch.json` | Catalogusitem |
| `hofvijver-den-bosch-1-1000.stl` | Los te printen op 1:1000 (24 × 24 × 77 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[148182.44, 410774.87]`, het hart van de BAG-contour. De X-as loopt langs de zuidgevel naar het oostzuidoosten (−14,43° op RD-oost; de BAG-randen zijn evenwijdig binnen 0,15°), de Y-as haaks erop naar het noordnoordoosten. Lokaal z = 0 is NAP +6,89 m, de promenade aan de oostkant (3D BAG-maaiveld). `groundHeight` is 50,43 m (ellipsoïdisch: NAP + 43,54, de offset van het Provinciehuis Noord-Brabant) en `groundOffsetMetres` −0,15. Omdat de toren aan drie kanten in het water staat, bemonsteren `groundSamplePoints` alleen de promenade (drie punten 15 m oostelijk van het hart), en loopt de voet 1,6 m door onder z = 0, zodat hij boven een lager wateroppervlak niet zweeft.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schacht (pand `0796100000434078`) | BAG-contour, 24,3 × 24,35 m | +62,72 m | BAG; 3D BAG-dakvlakjes op de hoeken (62,72–62,76); frontale foto (circa 63,3) |
| Kroon, zes lagen | rondom 1,15 m terug, 22,0 × 22,05 m | +80,63 m | 3D BAG-dakvlak (80,62–80,64), AHN-DSM (mediaan 80,64); terugsprong uit de frontale foto (1,1–1,2 m) en de DSM-rand |
| Installatieblok | 3,8 × 3,7 m | +82,0 m | 3D BAG-dakvlak (81,91–82,10), AHN-DSM |
| Kleinere installaties en kanalen | drie blokken van 1,4–3 × 1,6–1,9 m | +82,6 m | AHN-DSM (82,3–83,8 in kleine plekken), ortho |

Gevelreliëf, op elke gevel gelijk, op een stramien van 3,9 m (architect):

- Begane grond 6,18 m hoog met zes glaspuien van 2,4 m per gevel als blinde nissen van 0,4 m diep.
- Daarboven 23 lagen van 2,92 m (17 in de schacht, 6 in de kroon): per laag vier vensters van 2,4 m (kroon 2,2 m) als nissen van 0,35 m en bij beide hoeken een loggia van 2,4 m (kroon 2,2 m) als nis van 0,9 m diep. Alle nissen hebben een plafond onder 45°. Tussen de twee loggia's van een hoek blijft een hoekpijler van 1,2 m (kroon 0,9 m).

## Geschat en weggelaten

- Naam: de taak noemde de toren "Woontoren Hofvijver" (naar het adres); de architect en makelaarsteksten noemen hem Jheronimus. De slug blijft `hofvijver-den-bosch`.
- De architect noemt 22 woonlagen boven de begane grond; op de frontale foto zijn 23 vensterrijen te tellen (17 + 6). Het model volgt de foto.
- Verdiepingshoogtes (6,18 m en 2,92 m) volgen uit de gemeten hoogtes (terugsprong +62,72, dak +80,63) en het aantal lagen op de foto; de terugsprong van de kroon (1,15 m) en de vensterbreedtes zijn van foto's geschat.
- De loggia's zijn in het echt dieper dan 0,9 m; voor de print zijn ze als nis met een plafond onder 45° gemaakt.
- De installaties zijn blokken op de plekken waar het DSM boven het dak uitkomt; hun vorm is grof.
- Weggelaten: de donkere vloerranden en de kleine verspringingen per laag, de glazen balustrades in de loggia's en de dakrand (kleiner dan 0,9 m). De stalen pergola langs de promenade aan de oostkant en het lage paviljoen ten zuiden horen bij andere objecten.

## Controle

`node scripts/generate-hofvijver-den-bosch.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test het dak, de terugsprong en de installaties via stralen in NAP, dat een hoekloggia en een vensternis in de zuidgevel na de printcorrectie op 45° blijven, dat de printcorrectie het volume met minder dan 1 % laat groeien, één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0796100000434078` (bouwjaar 2014, Hofvijver 1); [BAG-viewer](https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0796100000434078); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, puntwolk AHN4 2021).
- [Baumschlager Eberle, Jheronimus](https://baumschlager-eberle.com/en/work/projects/projekte-details/jheronimus/): hoogte 74 m, stramien 3,9 m, kroon, loggia's en foto's (niet meegeleverd).
