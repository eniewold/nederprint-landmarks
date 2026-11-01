# Watertoren Rimburg (Landgraaf)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-rimburg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, kop en dak zijn achthoekige prisma's en een tentdak (`hull`), de bakstenen vakken, vensters en deuren nissen, de consoles wiggen en de cortenstalen uitbouw schuine en rechte blokken.

De watertoren in het Rimburgerbos (Ubach over Worms, gemeente Landgraaf) is in 1925-1926 gebouwd door de steenkolenmijn Laura en Vereeniging naar ontwerp van het eigen bouwbureau, 35,7 m hoog met een reservoir van 200 m³. Toren en reinwaterkelder zijn rijksmonument (521662). Na de verbouwing door architectenbureau Ton Vandenbergh is hij uitkijktoren, met een brasserie ernaast; daarbij kwamen het cortenstalen balkon en de trap.

## Bestanden

- `watertoren-rimburg.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los balkon of een losse trap zou een eigen voet tot de grondplaat krijgen.
- `watertoren-rimburg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-rimburg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [202957.5, 324501.25], het hart van de reservoirkop in het AHN, op maaiveld (NAP +125,75 m). De BAG-contour van pand 0882100000000477 (61 m², 8,6 m over de vlakken) is de kop, niet de voet, en ligt 0,8 m naar het noordwesten. `xAxis` [0.9903, 0.1392]: +X wijst naar het oostvlak op 8 graden linksom van RD-oost (richting van de BAG-zijden en de dakgraten op de luchtfoto); de vlakken staan op 0, 45, ... graden in het modelstelsel. De ingang staat naar het noordoosten (terras van de brasserie), het balkon naar het zuidoosten, de trap naar het noordwesten. Vervangt alleen het BAG-pand van de toren; de brasserie (pand 0882100000028401) raakt het model niet.

Het maaiveld loopt rond de voet op van NAP +125,65 (zuidwest) tot +126,1 (noordoost). De acht `groundSamplePoints` liggen 5,7 m uit het hart (1,5 m buiten de voet); de laagste bepaalt de hoogte, zodat de voet aan de lage kant niet zweeft. `BASE` is −0,5 m, zodat de onderkant ook daar onder het PDOK-maaiveld blijft; aan de hoge kant zakt de voet 0,5 m in. `groundHeight` 171,51 (NAP 125,75 + 45,76, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:schacht-kop-tentdak-en-cortenstalen-trap`

- Verjongende achthoekige schacht van 7,7 m over de vlakken aan de voet tot 6,5 m op +26,8, met witte hoeklisenen (0,4 m per vlak) en banden van 0,4 m op 5, 10, 15, 20 en 25 m; daartussen bakstenen vakken 0,15 m verdiept, met een plafond onder 56 graden. Kleine vensters (0,6 × 1,0 m) op wisselende vlakken per verdieping, deur (1,2 × 2,4 m) naar het noordoosten.
- Acht consoles van 0,6 m breed op de hoeken, met een onderkant onder 56 graden van de schacht naar de ring.
- Reservoirkop van 8,5 m over de lisenen: betonnen ring (8,7 m) van +26,8 tot +27,5, bakstenen vakken met een hoog smal venster (0,6 × 1,8 m) per vlak, op het noordwesten de glazen deur naar de trap (1,6 × 2,7 m), dakrand van 8,7 m tot de dakvoet op +33,35 met een schuine onderkant.
- Achtzijdig tentdak tot +35,7.
- Cortenstalen balkon naar het zuidoosten: 2,0 m breed, 2,6 m uit het vlak, van +27,6 tot +29,45.
- Cortenstalen trap naar het noordwesten: de bovenste trap (2,2 m breed, onder 41 graden) van de glazen deur (+29,3) naar een bordes van 2,8 × 5,3 m (+23,9 tot +26,3, tot 10,4 m uit het hart), en daarnaast, 0,9 m ervandaan, de onderste trap (2,2 m breed, onder 30 graden) terug tot in de schacht op 18 tot 20 m. Tussen de twee trappen en de schacht zit een echte doorkijk; daarom heeft de node genus 1.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Rimburg)): bouwjaren, opdrachtgever, 35,7 m, 200 m³, monument, verbouwing tot uitkijktoren.
- [Rijksmonument 521662](https://monumentenregister.cultureelerfgoed.nl/monumenten/521662).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +125,65 tot +126,1 rond de voet, hoogste punt NAP +161,45 (35,7 m boven NAP +125,75), dakvoet rond 33,35 m uit de helling van het tentdak, kop van 8,0 tot 8,5 m over de vlakken en het hart van de kop, het balkon met de bovenkant op 29,45 m. De trap staat niet in het AHN (daar alleen bomen tot 23 m); vermoedelijk is hij later gebouwd.
- BAG-pand 0882100000000477 en luchtfoto (PDOK, 8 cm): stand van de achthoek (8 graden), kop van 8,6 tot 9,0 m, voet van 7,9 m, ligging en breedte van balkon, trap en bordes (gecorrigeerd voor de scheefstand van de luchtfoto, 0,28 m naar het noorden per meter hoogte).
- Foto [Water tower (Rimburg) 06](https://commons.wikimedia.org/wiki/File:Water_tower_(Rimburg)_Watertoren_(Rimburg)_06.jpg), van het noorden: hoogtes van de banden, ring, vensters, balkon, trap en bordes, geschaald op de dakvoet in het AHN (32,8 px/m); verhouding kop, voet en bovenkant schacht.
- Foto [Rimburg - Watertoren](https://commons.wikimedia.org/wiki/File:Rimburg_-_Watertoren.jpg), van het noordnoordoosten: consoles, vensters, de onderste trap die de schacht raakt.
- Foto [Watertoren Rimburg](https://commons.wikimedia.org/wiki/File:Watertoren_Rimburg.jpg), van ver: verhoudingen van kop en schacht met weinig perspectief.
- Foto [Landgraaf Watertoren 6235](https://commons.wikimedia.org/wiki/File:Landgraaf_Watertoren_6235.JPG), vóór de verbouwing: banden, vakken en consoles zonder cortenstaal.

## Geschat en weggelaten

Geschat: de breedtes van voet (7,7 m) en bovenkant van de schacht (6,5 m) uit verhoudingen op twee foto's, geschaald op de kop; de hoogtes uit één foto (±0,5 m); de breedte van lisenen en banden en de diepte van de vakken; welke vlakken vensters hebben (alleen de noord- en oostkant staan op foto's); de stand en breedte van de trappen en het bordes (de luchtfoto geeft 5 m breed, de trappen naast elkaar; de ligging in de dwarsrichting is 1 m opgeschoven zodat de onderste trap in de schacht uitkomt) en waar de onderste trap de schacht raakt (achter bomen en de schacht).

Weggelaten (kleiner dan 0,9 m of te dun): de borstweringen en treden in de cortenstalen trappen en het balkon (als dichte blokken), kozijnen, de lamp en de deurluifel, de reinwaterkelder (laag en grotendeels onder het terras) en de brasserie (eigen BAG-pand).

## Controle

Eén gesloten NoError-node met genus 1 (de doorkijk tussen trappen en schacht). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 24 %: een smalle wig onder de ring van de kop en, onder het vrij uitkragende balkon (3,6 m buiten de schacht) en de trap met bordes (tot 7 m), wanden tot de onderplaat, omdat hun wig smaller wordt dan de steunbreedte voor hij de schacht bereikt. De doorsneden op 28, 31 en 34 m (kop, vensters, balkon, dak) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt een wig onder de ring van de kop, maar het vulalgoritme zet ook het balkon en de trap met bordes op wanden tot de grondplaat; het model zelf blijft open. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,11–0,59 m in de helling.

Controle-URL: http://localhost:3000/kaart/50.90827/6.06903/200/1x1/0
