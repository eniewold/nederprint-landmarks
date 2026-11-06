# Watertoren Sint Philipsland (Sint Philipsland)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-sint-philipsland.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en reservoir zijn prisma's op een vierkant met afgeschuinde hoeken, de uitkraging een hull tussen twee van die plattegronden, het dak een hull van de dakrand naar de top (acht vlakken), lisenen, console-blokken, tussentredes en ribben hulls, sleuven en deur blinde nissen.

De watertoren van Sint Philipsland is in 1925 gebouwd naar een ontwerp van H. Sangster; volgens Wikipedia is hij 27,7 m hoog met een reservoir van 125 m³. Het is een betonnen toren in een expressionistische vorm met een koperen tentdak. De toren staat er nog (AHN, luchtfoto, foto's 2002 tot 2015; er hangen antennes aan).

BAG-pand 0716100000282375 (bouwjaar 1930 in de BAG, 38 m², overige gebruiksfunctie) is de toren; het model vervangt dat pand. De buurpanden in de PDOK-tegel (0716100000140396, een bedrijfshal 11 m ten oosten, en 0716100000179425, een schuurtje 22 m ten noordoosten) raken het model niet en blijven staan.

## Bestanden

- `watertoren-sint-philipsland.glb`: één node, `building:watertoren-schacht-lisenen-consoles-reservoir-en-tentdak`.
- `watertoren-sint-philipsland.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-sint-philipsland-1-1000.stl`: het model op 1:1000 (7,0 × 7,0 × 28,0 mm).

## Oorsprong en oriëntatie

RD-oorsprong [70815.2, 404033.95] (51,618855 N, 4,171587 O): het hart van de BAG-contour (gemiddelde [70815.15, 404033.96]) en van het dak in het AHN-DSM (achthoekfit [70815.2 à 70815.3, 404033.9]), op het maaiveld.

De BAG-contour is een vierkant met afgeschuinde hoeken: vier hoofdgevels met apothema 3,2 tot 3,48 m (gemiddeld 3,37) en vier hoekvlakken van 2,1 tot 2,4 m breed met apothema 3,5 tot 3,82 m (gemiddeld 3,61). De normalen van de gevels liggen gemiddeld op -21,4 + k·45 graden vanaf RD-oost; de achthoekfit op het dak geeft -22,5 tot -18. De lokale X-as is de normaal van de oostzuidoostgevel op RD -21,5 graden (`xAxis` [0.93042, -0.36650]); de hoekvlakken staan op 45 + k·90 graden lokaal, de deur zit in de -Y-gevel (zuidzuidwest).

`groundSamplePoints` liggen op 5,5 m van het hart langs de vier hoofdassen. `groundHeight` 45,859 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (45,859 tot 45,941, gemeten 2026-11-06); het PDOK-pand staat op 45,72. Het verschil met het AHN-DTM is daar 44,05 tot 44,15 m, dus z = 0 ligt op NAP +1,76. `groundOffsetMetres` is −0,1.

## Onderdelen

Hoogtes boven het maaiveld (NAP +1,76).

- Schacht: vierkant met afgeschuinde hoeken, hoofdgevels 6,2 m uit elkaar, hoekvlakken 6,64 m, van de voet tot het reservoir.
- Lisene van 0,9 m breed en 0,3 m dik op het midden van elke hoofdgevel, van de voet tot het console-blok.
- Console-blok van 2,0 m breed boven elke lisene, 0,12 m voor de reservoirgevel, van 17,0 tot 19,1 m, met een onderkant van 47 graden naar de schacht.
- Tussentrede van 2,9 m breed op elke hoofdgevel met de onderkant op 17,55 m; daarnaast de onderkant van het reservoir op 18,1 m. Samen de getrapte onderkant die van het console-blok naar de hoeken omhoog loopt.
- Uitkraging van 0,3 m onder 47 graden naar het reservoirdeel: hoofdgevels 6,8 m uit elkaar, hoekvlakken 7,24 m, van 18,1 tot 25,95 m.
- Sleuf van 0,5 m breed en 0,3 m diep op elk hoekvlak over de hele hoogte (schacht vanaf 0,6 m, reservoirdeel tot 25,35 m), plafonds van 63 graden.
- Twee ribben van 0,3 m breed en 0,15 m dik naast elke sleuf op het reservoirdeel, met een voet van 47 graden op de schacht, tot 26,2 m: ze steken als tanden door de dakrand.
- Deur van 0,9 × 2,1 m in de zuidzuidwestgevel, aan de westkant naast de lisene.
- Achtzijdig tentdak van de dakrand op 25,95 m tot de top op 27,7 m (27 graden boven de hoofdgevels).

## Bronnen en maten

- [Wikipedia, Watertoren (Sint Philipsland)](https://nl.wikipedia.org/wiki/Watertoren_(Sint_Philipsland)): 1925, H. Sangster, 27,7 m, 125 m³.
- BAG-pand 0716100000282375 (PDOK, 2026-11-06): vierkant met afgeschuinde hoeken, 38 m². 3D BAG: maaiveld NAP +1,61, nok 29,30, dak 27,78 tot 29,39, één nok en vier dakvlakken.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +1,71 tot 1,86 op 5 tot 6 m van het hart; dak NAP +29,42 in het midden (maximum 29,52), 27,8 à 28,1 op 3 m langs de hoofdgevels, een gelijkmatige helling van 27 à 28 graden.
- Luchtfoto (PDOK, Actueel_orthoHR): achtzijdig koperen tentdak met acht graten, de deur aan de zuidkant.
- Foto's op Wikimedia Commons: "Sint Philipsland 6521.JPG" (2005), "Sint Philipsland, de watertoren foto6 2015-05-24 14.39.jpg" (2015) en "Overzicht watertoren - Sint Philipsland - 20352486 - RCE.jpg" (2002).

## Geschat en weggelaten

Geschat: alle maten van de opstand onder het dak, uit de drie foto's met de tophoogte uit het AHN als schaal: de uitkraging van het reservoir (circa 10 % breder dan de schacht, hier 0,3 m), de onderkant van het reservoir (18,1 m bij de hoeken, 17,55 m in de tussentrede, 17,0 m onder het console-blok; foto 2005 en 2015 verschillen 0,2 à 0,5 m), het console-blok (2,0 m breed tot 19,1 m), de lisene (0,9 m, op de foto circa 0,8 m), sleuven (0,5 m) en ribben (0,3 m), de deur en de dakrand (25,95 m, uit de dakhelling in het AHN). De BAG-contour is onregelmatig (apothema's 3,2 tot 3,82 m); hier een regelmatige vorm met de gemiddelde maten. De getrapte onderkant van het reservoir heeft in werkelijkheid meer en vlakke treden; hier één tussentrede en onderkanten van 47 graden, zodat alles zonder steun te printen is. Op de foto's lijkt het koperen dak onderaan steiler; het AHN toont een rechte helling van 27 à 28 graden, en die is gevolgd.

Weggelaten: de kleine lichtopeningen in de hoeksleuven en het venstertje aan de voet (kleiner dan 0,9 m), de knop op de top van het dak, de antennes en kabelgoten aan het reservoirdeel en het hek rond de toren.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; het volume is gelijk aan dat van een export zonder steun. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde achtkant kolom met een puntdak) aan elke kant de lisenen, de breder uitkragende reservoirkop met getrapte onderkant en console-blokken, de hoeksleuven met ribben die door de dakrand steken, en aan de zuidzuidwestkant de deur.

Controle-URL: http://localhost:3000/kaart/51.61886/4.17159/200/1x1/0
