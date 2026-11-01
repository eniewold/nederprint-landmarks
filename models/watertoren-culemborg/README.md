# Watertoren Culemborg

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-culemborg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: basement, schacht, fries, kraaglijst, stoel en reservoir zijn één omwentelingsprofiel, de lisenen zijn prisma's met een schuine afdekking; deur, vensters en de rondboogfries zijn nissen.

De watertoren in Culemborg is in 1911 gebouwd naar ontwerp van Visser & Smit, 35 m hoog met een reservoir van 200 m³. Bij de renovatie van 1972 is de stenen bovenbouw vervangen door een wand van aluminium; sinds 2018 is de toren in particuliere handen.

## Bestanden

- `watertoren-culemborg.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-culemborg.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-culemborg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [144398.55, 439979.09], het hart van de ronde BAG-contour van pand 0216100000016390 (straal 4,24 m, het basement), op maaiveld aan de voet (NAP +2,70 m; het terrein loopt binnen 10 m af naar NAP +2,4). Het midden van het reservoir in het AHN ligt binnen 0,35 m van dat hart; een scheefstand is niet aan te tonen. Assen in RD-richting (`xAxis` [1, 0]). De acht lisenen staan op 25 + k·45 graden (linksom vanaf RD-oost): op de luchtfoto zijn de voeten op 250 en 295 graden te zien, en de foto toont een venster midden tussen twee lisenen. De deur staat in het vak op 227,5 graden, naar het verharde erf in het zuidwesten. Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde andere pand ligt 22 m verder.

## Onderdeel `building:basement-schacht-stoel-en-reservoir`

- Rond basement van 8,48 m tot +7,0 met een schuine waterlijst naar de schacht en acht lisenen van 1,0 m breed tot r 4,6, met een schuine afdekking onder de waterlijst. In zeven vakken een hoog venster (0,9 × 1,9 m) onder de waterlijst, in het achtste een deur (1,2 × 2,5 m) met een bovenlicht.
- Bakstenen schacht, verjongend van 7,8 m op +7,45 naar 7,0 m op +22,9, met drie trapvensters boven de deur.
- Rondboogfries van 7,3 m tot +24,0 als krans van veertien blinde nissen, kraaglijst van 7,8 m tot +24,6.
- Holle, uitlopende stoel van 7,5 m op +24,6 naar 9,5 m op +26,35 (hoogstens 42,5 graden overhang).
- Reservoir: onderste band van 9,5 m tot +27,0, golfaluminium (9,04 m) tot de bovenste band van 9,2 m van +34,0 tot de dakrand op +35,0; plat dak op +34,65 binnen een rand van 0,9 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Culemborg)): ontwerper, bouwjaar, 35,00 m, 200 m³, renovatie van 1972.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld aan de voet NAP +2,70, dak op NAP +37,36 (34,65 m boven de voet) over een schijf van 6,4 m, reservoir circa 9,5 m breed met randbloei. Op de rest van het dak geeft het AHN geen punten; de luchtfoto toont daar een donkere plas binnen de rand.
- BAG-pand 0216100000016390 (cirkel van 4,24 m) en luchtfoto 8 cm (PDOK): ligging, dakrand van 9,2 m buitenmaat en 8,0 m binnenmaat met slagschaduw binnen de rand, voeten van de lisenen, erf en paden.
- Foto [Culemborg Watertoren](https://commons.wikimedia.org/wiki/File:Culemborg_Watertoren.JPG) (2006, Olympus C-8080, 12,1 mm): de opbouw en alle overige hoogtes en breedtes. De camerastand is teruggerekend op de top (35,0 m) en de voet, circa 58 m van de toren; de breedtes zijn geschaald op de dakrand van 9,2 m.

## Geschat en weggelaten

Geschat: alle hoogtes behalve dak en top (uit één schuine foto met een teruggerekende camera, onzekerheid circa 0,5 m), de verjonging van de schacht (de foto geeft 7,8 en 7,0 m), de vorm van de holle stoel, de diepte van de lisenen (0,36 m), de richting van de deur (geen foto van die kant; naar het erf), het aantal en de plaats van vensters en trapvensters (de foto toont één venster in het basement en één spleetvenster onder de fries), de rondboogfries als veertien nissen in plaats van circa veertig kleine boogjes, de hoogte van de dakrand boven het dak (0,35 m; het AHN geeft het dak, de luchtfoto een slagschaduw).

Weggelaten (kleiner dan 0,9 m of te dun): de antennes en schotels op het dak, de consoles in de stoel (circa 0,3 m), de ribbels van het golfaluminium, het ronde venstertje in het basement (0,55 m), de lijst boven de vensters en de kleine aanbouwtjes en bomen rond de voet.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,000001): de stoel, de fries en de kraaglijst hangen hoogstens 42,5 graden over en de nissen hebben plafonds van 56 graden. De doorsneden op 1,5, 5,5, 15, 20,5, 23,5, 25,5, 30 en 34,8 m (deur, vensters, schacht, trapvenster, fries, stoel, reservoir en dakrand) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt alleen een splintertje steun in één friesnis; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,04–0,17 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.94816/5.23302/200/1x1/0
