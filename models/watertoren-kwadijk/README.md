# Watertoren Kwadijk (Kwadijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-kwadijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: sokkel, kolommen, banden en bekroning zijn achthoekige prisma's en omhullenden met schuine onderkanten, de verdiepte vlakken, de wig en de vensters zijn uitsparingen met schuine plafonds, en de kap is de omhullende van de achthoek op de bekroning en de top (acht dakvlakken, graten op de hoeken).

De watertoren is in 1925 gebouwd voor het Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. B.F. van Nievelt (rijksmonument 508231; Wikipedia schrijft "Niefelt"). Hij ligt teruggelegen aan de zuidzijde van de Kwadijk en is via een rechte oprijlaan bereikbaar; tegenwoordig is hij een woning. Volgens het register is hij 45,50 m hoog, achthoekig, in rode baksteen rond een betonskelet van vier kolommen binnen en acht langs de omtrek, met twee reservoirs van 500 m³ (diameter 10,2 m) boven elkaar; de architectuur is verwant aan de art deco. Het achthoek is een vierkant met afgeschuinde hoeken: vier lange gevels van circa 7,5 m en vier schuine hoeken van circa 4 m. De acht kolommen staan op de hoeken, het muurwerk ertussen is teruggemetseld, en op de hoogte van de reservoirbodems lopen twee betonnen banden rond. De noord- en zuidgevel hebben in het midden wigvormig teruggemetseld muurwerk met drie reeksen van zes ramen, de oost- en westgevel drie kleinere vensters, de schuine hoeken een liggend venster op de parterre. In de reservoirgeledingen hebben de lange gevels drie gekoppelde smalle vensters en de schuine hoeken elk één. Bovenaan een betonnen bekroning met art-deco-punten en een lage achtzijdige kap van gewapend beton met een metalen spits. De ingang met art-deco-omlijsting ligt op het noorden, aan de oprijlaan; op het zuiden geeft een glazen dubbele deur toegang tot het terras.

## Bestanden

- `watertoren-kwadijk.glb`: één node `building:achtkante-schacht-reservoirs-bekroning-en-kap`, op maaiveld.
- `watertoren-kwadijk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-kwadijk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [127053.34, 504637.55] (52,52868 N, 4,97538 O), het hart van BAG-pand 0478100000003103: een vierkant van 13,28 m over de lange gevels met schuine hoeken op 7,35 m van het hart (de tien hoekpunten passen binnen 4 cm). De lange gevels staan op RD -17,65 graden. Lokale +X is de normaal van de westgevel (RD 162,35 graden; `xAxis` [-0.95293, 0.3032]), +Y die van de zuidgevel; de ingang op het noorden kijkt naar -Y, naar de oprijlaan. Maaiveld AHN-DTM NAP -0,26 in een ring van 7 tot 9 m (gebruikt -0,3); de oostkant ligt lager (NAP -0,45), de noordkant hoger (-0,05 tot -0,26). `groundSamplePoints` liggen op 9 m ten westen, zuiden en noorden van het hart; `groundHeight` 42,37 is de laagste PDOK-terreinhoogte (ellipsoïdisch) daarop. De oostkant telt niet mee, anders zakt de trede van de noordingang in het terrein; de voet loopt daarom tot 0,6 m onder het hart door, zodat hij ook aan de oostkant (PDOK tot 0,5 m lager) in het terrein staat. Het model vervangt BAG-pand 0478100000003103, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:achtkante-schacht-reservoirs-bekroning-en-kap`

Achthoeken als apothema van de lange gevels / de schuine hoeken; hoogtes boven maaiveld.

- Sokkel: 6,64 / 7,35 m (BAG) tot 1,9 m, bovenkant onder 45 graden naar de kolommen.
- Schacht: kolommen 6,5 / 7,21 m (AHN 12,9 tot 13,0 m over de lange gevels op 20 tot 30 m), 1,1 m langs het vlak vanaf elke hoek. Het muurwerk ertussen ligt 0,3 m terug van 1,9 tot 25,6 m, plafond onder 45 graden. Op de noord- en zuidgevel een wig over de hele breedte tussen de kolommen, in de middellijn 0,3 m dieper, met een plafond van 69 graden.
- Vensters in de schacht: noord en zuid drie nissen van 2,75 × 1,3 m (8,9 tot 10,1, 16,4 tot 17,7, 23,5 tot 24,6 m) in de wig; oost en west drie nissen van 1,1 × 1,2 m op dezelfde hoogtes; op de schuine hoeken een liggend venster van 1,0 × 0,7 m van 2,25 tot 2,95 m. Nissen 0,3 m diep met een plafond van 63 graden.
- Betonnen banden op de reservoirbodems: 6,7 / 7,41 m van 25,8 tot 27,4 m en van 33,5 tot 34,9 m, onderkant onder 45 graden.
- Reservoirgeledingen: muurwerk tussen de kolommen 0,25 m terug (27,4 tot 33,3 en 34,9 tot 40,6 m); per lange gevel een nis van 2,2 m voor de drie gekoppelde vensters, per schuine hoek een nis van 0,7 m (27,9 tot 32,0 en 35,4 tot 39,3 m).
- Bekroning: 6,6 / 7,31 m van 40,7 tot 42,3 m, onderkant onder 45 graden; midden op elke lange gevel een art-deco-punt van 2,2 m breed tot 42,9 m, op elke hoekkolom een opstand van 1,2 m langs beide vlakken tot 42,6 m.
- Kap: achtzijdig, vanaf 6,2 / 6,91 m op 42,3 m tot de top op 45,8 m (circa 29 graden).
- Ingang noord: art-deco-omlijsting 4,2 m breed, 0,2 m voor de kolommen, tot 4,8 m met een afgeschuinde voorkant; dubbele deur 1,8 × 2,7 m als nis van 0,4 m; trede tot 0,25 m. Zuid: glazen dubbele deur 2,7 × 2,3 m als nis door de sokkel en een trede tot 0,3 m.

## Bronnen en maten

- [Rijksmonumentenregister 508231](https://monumentenregister.cultureelerfgoed.nl/monumenten/508231): ontwerper, 45,50 m, achthoekig grondplan, skelet met acht buitenkolommen, twee reservoirs van 500 m³ met diameter 10,2 m, de banden op de reservoirbodems, het teruggemetselde muurwerk, de wig met drie vensterreeksen op noord en zuid, de vensters oost en west en op de schuine hoeken, de vensters van de reservoirgeledingen, de art-deco-ornamentiek, de kap van gewapend beton met metalen spits en de ingang op het noorden.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Kwadijk)): bouwjaar, hoogte en reservoirs.
- BAG-pand 0478100000003103 (PDOK, 2026-11-04): plattegrond, hart en stand.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP -0,3, rand van de kap NAP +42,7 op 5 m van het hart, +43,8 op 3 m, +45,0 op 1 m, hoogste punt +45,8; breedte van de schacht. Luchtfoto voor de achtzijdige kap, de oprijlaan op het noorden en het terras op het zuiden.
- Foto's op Wikimedia Commons: "Kwadijk Watertoren 5409" (telelens, frontaal op de zuidgevel; schaal 43,6 px/m uit de top van de bekroning op het AHN: hoogtes van sokkel, vensterreeksen, banden, reservoirvensters en bekroning, breedtes van kolommen en vensters) en "Watertoren Kwadijk 20250704 152811" (van het zuidoosten: oost- en zuidgevel, vensters per gevel).

## Geschat en weggelaten

Geschat: alle hoogtes van de geledingen uit één frontale foto met één schaal (onzekerheid circa een halve meter); de diepte van het teruggemetselde muurwerk (0,3 en 0,25 m) en van de wig (0,3 m); de kolombreedte (1,1 m); de vorm van de art-deco-punten en hoekopstanden, vereenvoudigd tot één punt per lange gevel en een blok per hoek; de noordingang en de omlijsting, die op geen enkele beschikbare foto staan (alleen het register beschrijft ze); de kap uit het DSM-profiel, waarbij het hoogste punt de voet van de spits kan bevatten. Het DSM ziet de bovenkant van de toren 0,8 m zuidelijker dan de BAG (randvervaging of scheefstand in de opname); het model staat op de BAG.

Weggelaten: de metalen spits en de antennes op de kap (dunne staven, kleiner dan 0,9 m), het hekwerk rond het dak, de art-deco-ornamenten op de kolommen (getrapte en puntige profielen van een paar decimeter), de afzonderlijke ramen van de vensterreeksen en de penanten tussen de drie gekoppelde reservoirvensters (kleiner dan 0,9 m: één nis per groep), de rode bakstenen lijnen in de schacht, en de houten terrassen, schuurtjes en het bijgebouw aan de zuidkant (eigen BAG-panden of geen pand). De liggende vensters op de schuine hoeken zijn breder (1,0 m) en de reservoirvensters zijn als één nis gegroepeerd.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,001 %: alleen vier stukjes van 0,02 m³ boven de liggende vensters op de schuine hoeken. Een diepere noorddeur (tot in de wig) en een venster tot in de bovenste band lieten de export de dunne latei ervoor opvullen; beide zijn daarom ondiep gehouden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export met een ondersteuningsobject van 0,08 mm³; de PDOK-reconstructie van het pand is verborgen en het PDOK-terrein rond de voet ligt tussen 0,5 m onder en 0,4 m boven het hart, dus de voet (tot -0,6 m) staat overal in het terrein. De PDOK-buurpanden 0478100000004241 en 0478100000003077 (op 15 en 25 m) liggen binnen 0,5 m van het AHN en namen geen hoogte van de toren mee. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde achtkant tot de kap met een achtzijdige punt) de sokkel, de kolommen met teruggemetseld muurwerk, de wig met drie vensterreeksen op noord en zuid, de vensters oost en west, de twee betonnen banden, de reservoirgeledingen met vensternissen, de bekroning met punten en hoekopstanden, de noordingang met omlijsting en de zuiddeur met trede.

Controle-URL: http://localhost:3000/kaart/52.52868/4.97538/200/1x1/0
