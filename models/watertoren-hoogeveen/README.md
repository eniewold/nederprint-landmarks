# Watertoren (Hoogeveen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hoogeveen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de band, de bovenste schacht en de goot zijn elk een omhulsel van twee twaalfhoeken, de kap een twaalfzijdige piramide; deur en vensters zijn ondiepe nissen.

De watertoren is in 1927 gebouwd voor het Gemeentelijk Waterbedrijf Hoogeveen naar ontwerp van A. Kool en J. Wildeboer, 38,3 m hoog met een reservoir van 300 m³, en staat aan de Vos van Steenwijklaan. Het is de enige watertoren in Drenthe die nog als zodanig in gebruik is (WMD Drinkwater).

## Bestanden

- `watertoren-hoogeveen.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse band- of kapnode zou een voet tot de grondplaat krijgen.
- `watertoren-hoogeveen.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-hoogeveen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [229750.7, 527264.8], het hart van de twaalfzijdige schacht: het midden van de begrenzing van BAG-pand 0118100000059573 en het zwaartepunt van het AHN boven 8 m (die twee vallen samen; het zwaartepunt van de slordig getekende BAG-contour ligt 0,9 m zuidelijker). Maaiveld NAP +12,4 m. Assen in RD-richting (`xAxis` [1, 0]). De BAG-contour volgt zijden om de 30 graden, dus de vlakken van de twaalfhoek hebben hun normaal op noord, oost, zuid en west. De deur met de vensterkolom erboven ligt op het zuidvlak (-Y): op de Commons-foto staat de container van de luchtfoto (westzuidwest van de voet) linksvoor en het kantoor ten oosten rechts. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-band-en-kap`

- Bakstenen twaalfhoek van 9,1 m over de vlakken aan de voet, licht verjongend tot 8,8 m op +27,9. Blauwe dubbele deur van 1,6 × 2,4 m op het zuidvlak en daarboven een kolom van vier lamellenvensters (0,7 × 1,3 tot 1,4 m) op +12,2, +17,0, +21,8 en +26,2.
- Band met witte betonranden en rode consoles op de hoeken van +27,9 tot +30,8, 9,1 m over de vlakken (iets uitkragend), met vensters in de vlakken naast de voor- en achterzijde (+28,9 tot +29,8).
- Bovenste schacht rond het reservoir van 8,8 naar 8,7 m tot de blauwe goot op +36,9 (goot 8,9 m, van +36,65 tot +37,0).
- Lage twaalfzijdige kap van de goot tot de top op +38,3 (circa 18 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Hoogeveen)): bouwjaar, architecten, 38,3 m, 300 m³.
- BAG-pand 0118100000059573 (60,8 m², bouwjaar in de BAG 1977): oppervlakte (twaalfhoek van 9,1 m over de vlakken geeft 68 m², het AHN aan de voet iets meer; de BAG-contour is grof getekend), richting van de vlakken.
- [Watertoren Hoogeveen.JPG](https://commons.wikimedia.org/wiki/File:Watertoren_Hoogeveen.JPG): twaalf vlakken met lisenen op de hoeken (de breedte van het middelste vlak is een kwart van de silhouetbreedte), deur, vensterkolom, band en kap. Hoogtes geschaald op de AHN-top (57 px/m van maaiveld tot top).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP +12,38, top NAP +50,68 (38,3 m boven maaiveld), oppervlakte per hoogte (van circa 80 m² op 8 m naar 62 m² op 33 m, met de randbloei van het 0,5 m-raster), straal van de kap op 37,6 m (circa 2 m).
- Luchtfoto 8 cm (PDOK): twaalfzijdige kap met blauwe goot, ligging van container, parkeerterrein en kantoor.

## Geschat en weggelaten

Geschat: de verjonging (AHN wijst op circa 0,6 m over de hoogte, de foto op minder; gekozen is 0,4 m), de hoogtes van band, goot en vensters (één schaalfactor op een schuin van onder genomen foto), de plaats van de bandvensters op de niet gefotografeerde zijden (gespiegeld van de voorzijde) en de helling van de kap uit het AHN. Er is maar één bruikbare foto; de noordzijde is niet gezien.

Weggelaten (kleiner dan 0,9 m of te dun): de lisenen op de hoeken (circa 0,1 m), de rode consoles en witte randen van de band als los reliëf, de ankergaten, het dakluik en de antenne op de top, deur- en raamroeden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 2 % (dunne randen onder de band en de goot) en blijven de doorsneden op 1,5, 13 en 29,3 m (door deur en vensters) gelijk; de nisplafonds lopen naar binnen onder 45 graden op. In een preview-export op 1:1000 (100 × 100 m) is de ondersteuning 0,02 mm³ in de vensternissen. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,5 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.72754/6.49374/200/1x1/0
