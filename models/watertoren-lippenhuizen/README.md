# Watertoren Lippenhuizen

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-lippenhuizen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een geëxtrudeerde achthoek, onder de luifels met vier afgeschuinde hoeken; luifels, ribben, plint en portaal zijn losse vlakke vormen, het dak een opstand, een uitgebogen dakvoet en een achtzijdige piramide; vensters en deur zijn nissen.

De watertoren van Lippenhuizen is in 1932 gebouwd door de I.W.G.L. en de Bredasche Beton Mij., 44,25 m hoog met twee reservoirs van 300 m³ (dezelfde inhoud als de watertoren van Harlingen). Bakstenen achthoekige toren met een koperen achtzijdig tentdak. Rijksmonument 513162.

## Bestanden

- `watertoren-lippenhuizen.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los dak of een losse luifel zou een voet tot de grondplaat krijgen.
- `watertoren-lippenhuizen.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-lippenhuizen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [202884.75, 559849.75], het hart van de BAG-contour van pand 0086100000354476, 0,1 m bijgesteld op het AHN, op maaiveld (NAP +2,28 m). Assen in RD-richting (`xAxis` [1, 0]): de achthoek heeft zijn hoeken op k·45 graden, dus in de hoofdrichtingen en op de diagonalen (acht graten van het tentdak op de luchtfoto, BAG-vlakken op 45,4, 135,3, −134,7 en −44,7 graden). De vier diagonale hoeken dragen de panelen, luifels en raamparen; de deur zit in het paneel naar het zuidoosten, aan het pad naar de weg. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:achthoekige-schacht-met-panelen-luifels-en-tentdak`

- Achthoekige schacht met de hoeken op 7,3 m van het hart (14,6 m over de hoeken, vlakken 5,6 m), recht zonder verjonging, met een plint van 0,25 m tot +2,6 m (bovenkant onder 54 graden).
- Op de vier diagonale hoeken een plat afgeschuind paneel op 6,0 m van het hart, 6,3 m breed, van het maaiveld tot de luifel. In elk paneel drie smalle hoge vensters (0,45 m) en net onder de luifel een raampaar (2 × 1,0 m, penant 0,9 m).
- Boven elk paneel een V-vormige gelede luifel tot +24,6 m die 0,15 m voor de volle hoek uitsteekt; de onderkant loopt onder 52 graden van het paneel (+22,2 m) naar de voorkant (+24,0 m) en staat voor de drie getrapte platen. Daarboven springt de volle hoek terug.
- Boven de luifels op elke diagonale hoek drie rijen liggende vensters (1,8 × 0,7 m) aan weerszijden van de hoek, op +27,8, +31,5 en +35,15 m, met op de hoek een rib van 0,9 m breed die 0,5 m uitsteekt (onderkant onder 54 graden); de bovenste rib loopt door tot de muurrand op +36,7 m.
- Portaal voor de deur in het zuidoostelijke paneel: 4,6 m breed, 0,8 m diep, tot +4,0 m, met een deuropening van 2,8 × 2,65 m tussen wangen van 0,9 m.
- Donkere koperen opstand 0,35 m binnen de muur tot +37,9 m, uitgebogen dakvoet tot de muurlijn op +38,45 m, koperen rand tot +38,6 en een achtzijdige piramide tot +43,5 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Lippenhuizen)): bouwjaar, ontwerp, 44,25 m, 2 × 300 m³, achtzijdig koperen tentdak, rijksmonument.
- [Rijksmonument 513162](https://monumentenregister.cultureelerfgoed.nl/monumenten/513162).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +2,28, hoogste punt NAP +45,75 (43,5 m boven maaiveld), straal naar de hoeken op 8 tot 20 m hoogte 7,1 tot 7,6 m, geen verjonging. Langs de wanden en op het koperen dak geeft het DSM randwaarden van wandpunten; de omhullende boven 26 m is daarom niet gebruikt.
- 3D BAG (LoD2.2) van het pand: dakvoet rond NAP +40,2 en top NAP +46,0.
- BAG-pand 0086100000354476 (bouwjaar 1932, in gebruik): ligging, hart en de afgeschuinde diagonale hoeken (vlakken van 5,45 m op 6,05 m van het hart).
- Luchtfoto (PDOK, 8 cm): achthoekige dakvoet met acht graten, hoeken op 7,1 tot 7,5 m; pad naar het zuidoosten.
- Foto [Watertoren Lippenhuizen.jpg](https://commons.wikimedia.org/wiki/File:Watertoren_Lippenhuizen.jpg) (telelens, 22,9 px/m op de breedte over de hoeken): hoogtes van muurrand, raamparen, ribben, luifel, raampaar en bovenste smalle venster, breedte van paneel en luifel, de inspringende silhouetlijn onder de luifel (1,2 m) en de opstand onder het dak.
- Foto [Watertoren Lippenhuizen 2019.jpg](https://commons.wikimedia.org/wiki/File:Watertoren_Lippenhuizen_2019.jpg) en de RCE-foto's [65865](https://commons.wikimedia.org/wiki/File:Watertoren_van_Lippenhuizen_Industrieel_Erfgoed,_signatuur_65865.jpg), [65871](https://commons.wikimedia.org/wiki/File:Watertoren_in_Lippenhuizen_Industrieel_Erfgoed,_signatuur_65871.jpg) en [65872](https://commons.wikimedia.org/wiki/File:Watertoren_in_Lippenhuizen_Industrieel_erfgoed_1932,_signatuur_65872.jpg): verdiept vlak paneel met slagschaduw, V-vormige getrapte luifel, ribben op de hoek, portaal met wangen en latei, plint.

## Geschat en weggelaten

Geschat: de straal naar de hoeken (7,3 m als gemiddelde van luchtfoto, AHN en BAG, die 7,1 tot 7,6 m geven), de diepte van de panelen (6,0 m, tussen de BAG en de sprong van 1,2 m in de silhouetlijn), de hoogtes van de twee onderste smalle vensters (de foto van dichtbij vertekent, de telelensfoto ziet ze niet door het maïs), de vorm van de luifel (één schuine onderkant in plaats van drie getrapte platen), de maten van portaal en plint (foto van de deur), de opstand en de dakvoet onder het tentdak, en de uitsteek van de ribben (0,5 m, op de foto 0,3 tot 0,5 m bij 0,45 m breed; verbreed tot 0,9 m).

Weggelaten (kleiner dan 0,9 m of te dun): de lichte hoekstrips aan de muurrand op de gewone hoeken, de afgeronde voorkant van de portaalwangen, de stalen deur, de spijlen in de vensters, de nok en de dakbeschotten van het koper, het toegangshek met de gemetselde pijlers aan de weg (los en ver van de toren) en het metselwerkverband.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,2 % (gemeten 1,0001): luifels, ribben, dakvoet en nisplafonds zijn steiler dan 45 graden. De doorsneden op 1,5, 7, 21,4, 23,5, 28, 35 en 38,2 m (deur, smalle vensters, raampaar, luifel, raamparen met ribben, opstand) blijven gelijk. Een deuropening waarvan het schuine plafond boven het portaal in de schacht doorliep, werd in een eerste versie helemaal opgevuld; de nis loopt nu tot het paneel. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) zitten alleen splinters ondersteuning in een paar nisplafonds. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,2 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/53.02333/6.10083/200/1x1/0
