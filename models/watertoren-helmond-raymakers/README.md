# Watertoren Raymakers (Helmond)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-helmond-raymakers.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren bestaat uit prisma's, een bolkap en `hull`-vleugels, de fabriek uit prisma's op de BAG-contour met vlakke daken, drie sheddaktanden en een zadeldak als planvergelijkingen.

De watertoren staat op het terrein van textielfabriek Raymakers aan de Kanaaldijk N.W. in Helmond, ten noorden van het oude fabrieksgebouw (rijksmonument 21445). Hij is in 1948 gebouwd naar ontwerp van S.L.A. Orie en heeft twee reservoirs van 150 en 35 m³ (Wikipedia; hoogte "onbekend", geen coördinaten). Het is een vierkante schacht met grijze hoekpenanten, wit gepleisterde panelen met een ruitpatroon en een vensterband onder een ver overstekende dakplaat. Op de dakplaat staat een uurwerklantaarn met vier wijzerplaten, een kap, een lage koepel en een nest met een groene adelaar. De toren staat nog: de actuele luchtfoto en het AHN tonen hem met lantaarn en koepel.

De opdracht noemde een OSM-watertoren zonder naam (way 1565252045, 25 m). Dat is deze toren, maar de 25 m klopt niet: de dakplaat ligt op 31,8 m en de adelaar reikt tot ongeveer 39,7 m.

## Bestanden

- `watertoren-helmond-raymakers.glb`: één node van klasse `building` met de toren en de rest van de fabriek.
- `watertoren-helmond-raymakers.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings`.
- `watertoren-helmond-raymakers-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [173291.55, 388053.45] (WGS84 51,48123 N, 5,65052 O), het hart van de schacht: de BAG-uitsprong van de toren loopt van x 173289,0 tot 173294,1 en van y 388050,9 tot de noordwand in de 3D BAG op 388056,0. De oorsprong ligt op maaiveld (AHN-DTM NAP +17,12, rond de toren 17,09 tot 17,15). `xAxis` [1, 0]: +X wijst naar RD-oost. De vier `groundSamplePoints` liggen op het fabrieksplein ten zuiden van de toren. `groundHeight` 61,06 (NAP 17,12 + 43,94, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Waarom het hele pand

De toren is geen eigen BAG-pand. Hij hoort bij pand 0794100000396381 (bouwjaar 1926), het hele fabriekscomplex van 106 bij 90 m. PDOK reconstrueert de toren daarin als een blok tot NAP +48,9 met een piramide tot 55,5 m. Dat blok zou door de lantaarn en de koepel van het model steken. Daarom vervangt het model het hele pand en bouwt het de fabriek opnieuw op de BAG-contour. Het bakstenen bijgebouwtje voor de toren (pand 0794100000364583, 4 m hoog) is een eigen pand en blijft van PDOK.

## Onderdeel `building:watertoren-en-fabriek`

Toren (hoogtes boven maaiveld):

- Schacht van 5,1 bij 5,1 m (BAG) met hoekpenanten van 0,8 m tot de dakplaat. Tussen de penanten liggen de vlakken terug: 0,2 m voor de baksteen tot 18,0 m (de dakrand van het oostblok, waar op de foto de witte panelen beginnen), 0,3 m voor de panelen en de baksteenband tot 28,9 m, en 0,45 m voor de vensterband tot 31,2 m.
- Dakplaat van 6,8 bij 6,8 m van 31,2 tot 31,8 m (AHN NAP 48,9 tot 49,1, 3D BAG 48,87 tot 48,93).
- Uurwerklantaarn van 3,4 m met hoekpenanten van 0,6 m en wijzerplaatnissen van 0,2 m, tot 35,5 m. Daarop een kap van 3,9 m tot 36,03 m (AHN-rand NAP 53,1 tot 53,4).
- Lage koepel met een voet van 3,6 m tot 37,33 m, een iets uitlopend nest (1,3 tot 1,6 m) tot 38,13 m en een schematische adelaar van 0,9 m dik met de vleugels in een V tot 39,68 m.

Fabriek (de rest van het BAG-pand, hoogtes uit het AHN-profiel en de dakvlakken van de 3D BAG):

- Sheddakhal ten westen van de toren met drie tanden. Het steile, glazen vlak wijst naar het noorden; de rug ligt op 16,08 m (NAP 33,2), de kiel op 13,03 m (NAP 30,15). De ruggen liggen op y 388058,0, 388065,2 en 388072,4, en de tanden lopen net als de gevels 0,65 graad linksom.
- Lessenaar van 5,2 m langs de westgevel en een noordstrook van 6,6 tot 7,65 m.
- Oostblok van vier lagen, plat op 18,03 m (NAP 35,15), met een trappenhuis tot 26,03 m en een dakopbouw tot 20,38 m. Ten zuidoosten een lager blok van 10,0 m.
- Zuidvleugel met een zadeldak, de nok noord-zuid op x 173292,7 (nok NAP 37,19, goten 32,51 en 32,75). Het noordeinde is plat op het niveau van het oostblok.
- De fabriek is rond de schacht uitgespaard, zodat de toren zijn eigen gevels houdt.

## Bronnen en maten

- [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Watertoren_(Helmond_Raymakers)): 1948, S.L.A. Orie, 150 + 35 m³.
- Foto [Helmond Watertoren 2485](https://commons.wikimedia.org/wiki/File:Helmond_Watertoren_2485.JPG) (Willemjans, 2007, CC BY-SA 3.0), vanaf het zuidwesten, en de [foto](https://web.archive.org/web/20070929083555/http://afrit13.tweakdsl.nl/watertorens/Nederland/Noord-Brabant/Helmond2.jpg) uit de externe link van Wikipedia (hetzelfde aanzicht). Daaruit komen de penanten, panelen, vensterband, dakplaat, lantaarn, kap, koepel, het nest en de adelaar, en de verhoudingen van de lantaarn (3,4 m), de kap (3,9 m) en de dakplaat (6,7 m).
- BAG (PDOK WFS): pand 0794100000396381 met de toren als uitsprong in de zuidgevel; de contour staat als constante in de generator.
- 3D BAG (CC BY 4.0), pand 0794100000396381: de dakhoogtes van de fabriek en de PDOK-vorm van de toren.
- AHN DSM/DTM 0,5 m (PDOK): maaiveld NAP +17,12; dakplaat 48,9 tot 49,1; kap 53,1 tot 53,4; koepel 54,5 tot 54,6; hoogste punt 55,55; profielen van het sheddak op x 173245, 173265 en 173285.
- Luchtfoto (PDOK, 8 cm): toren met lantaarn en koepel, sheddaken, groen dak van het oostblok. De top van de toren staat op de luchtfoto ongeveer 5 m te ver naar het zuiden (scheefstand); de plaats komt uit het AHN en de BAG.
- [OpenStreetMap way 1565252045](https://www.openstreetmap.org/way/1565252045): dezelfde plek, hoogte 25 m klopt niet.

## Geschat en weggelaten

Geschat: de grenzen van de hoogtebanden op de schacht (18,0, 28,9 en 31,2 m, ±0,5 m) en de diepte van de nissen. Ook geschat: de maten van de lantaarn en de kap (foto, ±0,2 m), de vorm van de koepel en het nest, en de adelaar (op de foto circa 1,5 m hoog en 2 tot 2,4 m breed; de stand van de vleugels ten opzichte van de windrichtingen is niet bekend en staat oost-west). De fabriek is per dakvlak één blok of vlak; de dakhoogtes komen uit de 3D BAG en het AHN, de grenzen tussen de blokken uit het AHN-raster (±0,5 m).

Weggelaten, omdat ze kleiner zijn dan 0,9 m: het ruitpatroon in de panelen, de wijzerplaten en wijzers, de leuning op de dakplaat, de regenpijpen en de lisenen op de onderste baksteen van de schacht. Verder weggelaten: de gevelindeling, ramen en dakranden van de fabriek, de leidingen tussen de toren en het bijgebouwtje, en een smalle lichtkoker in de zuidvleugel (circa 4 bij 8 m, 3D BAG op 30,7 tot 35,1).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, 0,02 % op: de wig onder de overstekende dakplaat (op 30 m 7 % meer doorsnede) en smalle randjes onder de kap en de nisplafonds. De sheddaken, het zadeldak, de koepel en de vleugels van de adelaar staan op hun onderbouw. Vergeleken met de PDOK-reconstructie heeft de toren aan alle vier de kanten de penanten, de verdiepte panelen en vensterband, de overstekende dakplaat, de lantaarn met kap, de koepel, het nest en de adelaar, waar PDOK een blok met een piramide heeft. De fabriek volgt PDOK in vorm en hoogtes. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.48118/5.65053/200/1x1/0
