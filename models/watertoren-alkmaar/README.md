# Watertoren Alkmaar (Alkmaar)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-alkmaar.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de dikke band en de fries zijn omwentelingsvormen (`hull` van ringen), de bovenbouw een zestienzijdig prisma op een kegelvormig plafond, de ribben en pilasters prisma's per hoek, de dakopbouw prisma's met een zadeldak uit twee vlakken, en de vensters en de deur nissen.

De watertoren staat aan de Bergerweg in Alkmaar, op de hoek van de Van Teylingenstraat. Hij is gebouwd in 1900 naar een ontwerp van J.C. Franken en A. Holmberg de Beckfelt, heeft een reservoir van 800 m³ en is volgens Wikipedia 31,4 m hoog; hij is gemeentelijk monument en is sinds 2014 in gebruik als kantoor. De oorspronkelijke kantelen (naar het kasteel in het stadswapen) zijn in 1955 verwijderd. Een ronde, licht tapse bakstenen schacht met gele banden, een dikke band boven de begane grond, rondboogvensters die verspringend omhoog lopen en een rondboogfries met consoles draagt een zestienzijdige bovenbouw. Die kraagt uit op betonnen ribben, heeft bakstenen vlakken tussen betonnen hoekpilasters die als paaltjes boven de deklijst uitsteken, en kreeg bij de verbouwing kantoorvensters en een dakopbouw met een glazen zadeldak.

## Bestanden

- `watertoren-alkmaar.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-alkmaar.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 0361100000105882).
- `watertoren-alkmaar-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [110951.45, 516758.88] (WGS84 52.636550, 4.736506), het midden van de ronde BAG-contour van pand 0361100000105882 (bouwjaar 1900, straal 6,62 m: de bovenbouw met pilasters). Op het maaiveld NAP +0,6 m (AHN-DTM 8 m uit het hart 0,44 tot 0,87; PDOK-maaiveld NAP +0,40). `xAxis` [0.9397, -0.342]: +X loopt langs RD -20 graden, de lange as van het dakblok (randen van de PDOK-reconstructie op -19 tot -22 graden, de luchtfoto -21). Een kompasrichting k ligt in het model op 110 - k graden linksom van +X. De deur staat op kompas 225 (zuidwest, de Bergerweg); de vlakken van de bovenbouw staan op kompas 264 + 22,5k. `groundHeight` 43,2 (NAP 0,60 + 42,60, NLGEO2018-geoïde op de oorsprong) is de terugval als er geen maaiveld is; de `groundSamplePoints` liggen op 8 m rondom.

## Onderdeel `building:schacht-bovenbouw-en-dakopbouw`

- Schacht: rond, van 10,16 m doorsnede aan de voet tot 8,84 m onder de fries op 16,4 m.
- Dikke band van 5,0 tot 6,0 m, 0,2 m uitspringend op een kraag van 45 graden.
- Deur in een rondboog van 1,6 m breed tot 3,9 m op kompas 225; rondboogvensters van 1,2 × 2,7 m op de begane grond op kompas 126 en 320 en een rechthoekig venster van 1,1 × 1,3 m rechts van de deur (kompas 186).
- Rondboogvensters van 1,2 × 2,2 m in twee rijen: van 7,0 tot 9,2 m op kompas 225, 161, 288 en 50, van 12,0 tot 14,2 m op kompas 194, 258, 130, 317 en 15.
- Rondboogfries van 16,4 tot 17,4 m (9,5 m doorsnede) op een kraag van 45 graden, met 28 consoles van 0,55 m breed die tot 15,5 m naar beneden steken (onderkant 53 graden).
- Bovenbouw: zestienhoek van 12,7 m over de vlakken van 19,4 tot 31,0 m, op een kegelvormig plafond vanaf de fries (51 graden) met op elke hoek een betonnen rib van 0,6 m (onderkant 47 graden) die doorloopt in een pilaster van 0,6 m, 0,25 m buiten de hoek, tot een paaltje op 31,5 m.
- Kantoorvensters van 1,3 m breed in elk vlak, van 22,2 tot 24,2 m en van 26,4 tot 28,8 m.
- Borstwering van 0,4 m tot de deklijst op 31,0 m; dakvloer en dakterras op 30,5 m.
- Dakopbouw: aan de noordkant (lokaal v > 2,6 m) het dakterras; de rest binnen een zestienhoek van 10,8 m een platte opbouw tot 33,4 m, met een blok van lokaal u -2,1 tot de rand en v -2,2 tot 2,6 m tot 34,3 m, met een glazen zadeldak met de nok langs u tot 36,8 m.

## Bronnen en maten

- [Wikipedia, Watertoren (Alkmaar)](https://nl.wikipedia.org/wiki/Watertoren_(Alkmaar)): 1900, Franken en Holmberg de Beckfelt, 31,4 m, 800 m³, kantelen in 1955 verwijderd, kantoren sinds 2014.
- BAG-pand 0361100000105882: ronde contour, straal 6,62 m.
- PDOK-gebouwtegel van het pand (reconstructie uit het AHN, `rf_roof_type` slanted): borstwering en terras op 30,3 tot 31,4 m, dakopbouw op 33,5 en 34,4 m boven maaiveld, randen van de opbouw op -19 tot -22 graden.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld NAP +0,4 tot +0,9, dakterras NAP +30,8 tot +31,8 in het noorden en noordoosten, platte opbouw NAP +33,9 tot 5 à 5,3 m uit het hart, blok NAP +34,8, nok en antennes tot NAP +38,2 (het glazen dak geeft weinig punten).
- Luchtfoto (PDOK, 8 cm): de zestienhoek met de rechthoekige dakopbouw op -21 graden.
- Foto [IMG 3329](https://commons.wikimedia.org/wiki/File:Alkmaar,_watertoren_GM036-WN012_IMG_3329_2024-06-23_18.01.jpg) (2024, evenwijdige verticalen, vanaf kompas 264): breedtes van schacht, fries en bovenbouw (257 : 224 : 232 : 334 px), de hoogtes van band, vensters, fries, ribvoet en deklijst, de zestienhoek, de ribben, pilasters en paaltjes, de kantoorvensters en het glazen zadeldak.
- Foto's [Bergerweg 62](https://commons.wikimedia.org/wiki/File:Bergerweg_62,_Alkmaar.JPG) (vanaf kompas 225), [Alkmaar - Watertoren](https://commons.wikimedia.org/wiki/File:Alkmaar_-_Watertoren.jpg), [Water tower in Alkmaar](https://commons.wikimedia.org/wiki/File:Water_tower_in_Alkmaar_(Watertoren_)_-_The_Netherlands.jpg) en [Alkmaar Watertoren 0606](https://commons.wikimedia.org/wiki/File:Alkmaar_Watertoren_0606.JPG): deur, vensters, fries met consoles, plafond met ribben.
- Foto [RAA011000262](https://commons.wikimedia.org/wiki/File:Bergerweg_62,_hoek_Van_Teylingenstraat,_watertoren._Gebouwd_in_1900._-_RAA011000262_-_RAA_Elsinga.jpg) (Regionaal Archief Alkmaar, voor de verbouwing, vanaf kompas 196): vensters, deur en paaltjes.
- NLGEO2018-geoïdehoogte op de oorsprong (42,60 m) voor `groundHeight`.

## Geschat en weggelaten

Geschat:

- De hoogtes van band, vensters, fries en ribvoet (±0,7 m) en de doorsnedes van schacht en fries (±0,3 m): uit één foto met gecorrigeerde verticalen, geschaald op de deklijst en de BAG-cirkel; die foto is van onderen genomen, dus de verticale schaal is niet overal gelijk.
- De deklijst op 31,0 m (PDOK 30,3 tot 31,4, Wikipedia 31,4).
- De richtingen van deur en vensters uit drie straatfoto's (±10 graden); de vensters op kompas 50 en 15 (noordoostkant, niet op de foto's) zijn aangenomen. De vlakrichting van de zestienhoek (±5 graden).
- De dakopbouw: hoogtes en randen uit PDOK en AHN, de terugwijking van de platte opbouw (zestienhoek van 10,8 m) uit het AHN; het zadeldak (nok 36,8 m, richting langs het blok) uit de foto en enkele AHN-punten, de lengte van het zadeldak (over het hele blok) aangenomen.
- De kantoorvensters in alle zestien vlakken (op de foto's in alle zichtbare vlakken).

Weggelaten:

- de stalen brandtrap langs de schacht, de reling op het dak, de antennes en de zendmast (kleiner dan 0,9 m);
- de boogjes van de fries (circa 0,6 m), de gele banden en de bogen boven de vensters (vlak in het metselwerk), de gevelsteen boven de deur;
- het betonnen kozijn onder de bovenbouw en de deklijst als uitspringende lijst (circa 0,1 m), de ronde patrijspoorten in de vlakken;
- de glazen ruimte onder één vlak van het plafond (zuidoostkant, op twee foto's).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export dat doet, vrijwel niets op (volume na/voor < 1,0005): de kragen onder band en fries lopen onder 45 graden, de consoles onder 53, het plafond onder 51 en de ribben onder 47 graden, de nisplafonds onder 56 graden. In een export op 1:1000 van een uitsnede van 80 m staat het model compleet (tot 36,8 m boven de voet) met de voet 0,3 m in het PDOK-maaiveld en zonder zwevende delen; het PDOK-pand is verborgen. PDOK toont de toren als een rechte cilinder van 13,3 m tot 30,5 m met daarop de dakopbouw in twee platte blokken; het model voegt de tapse schacht met band, deur en vensters, de rondboogfries met consoles, de uitkraging op het plafond met ribben, de zestien vlakken met pilasters, paaltjes en kantoorvensters, de borstwering met het dakterras en het glazen zadeldak toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.63655/4.73651/200/1x1/0
