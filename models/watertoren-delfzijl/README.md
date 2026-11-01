# Watertoren Delfzijl

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-delfzijl.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het reservoir is één omwentelingsprofiel (halfbolle bodem, cilinder, vlak kegeldak), de omloop een tweede profiel met een kegelvormige onderkant, poten en stijgbuis zijn prisma's en de verbanden balken en `hull`-schoren.

De watertoren van Delfzijl (1966) staat op het terrein van de aluminiumfabriek (Aldel, nu Klesch Aluminium Delfzijl), aan het spoor naar Oosterhorn. Hij is geheel van staal: een reservoir van het type Barkhausen op vier buispoten met windverbanden, met een stijgbuis in het midden. Op de luchtfoto en in het AHN staat hij er nog.

## Bestanden

- `watertoren-delfzijl.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-delfzijl.json`: catalogusitem met RD-oorsprong, `xAxis`, maaiveldpunten en `groundHeight`; zonder `replacesBuildings`.
- `watertoren-delfzijl-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [260814.1, 592166.8], het hart van het reservoir in het AHN (cirkelfit op de DSM-pixels boven 20 m), op maaiveld (NAP +0,6 m). Assen in RD-richting (`xAxis` [1, 0]). De vier poten staan op 23,5 + k·90 graden: de voeten van twee poten zijn op de luchtfoto te zien (op 4,3 m van het hart, de toren zelf helt op de luchtfoto naar het noorden), en de stand klopt met de Commons-foto (poten op ±141 en ±71 px, foto vanuit het zuidoosten).

De toren staat niet in de BAG en dus ook niet als pand in de PDOK-gebouwtegels; er wordt niets vervangen. Het enige pand in de buurt, 0010100000008450 (1997, een schakelhuisje van 2,7 m hoog), ligt 1,6 m buiten de omloop en blijft staan. `groundHeight` 41,17 is het ellipsoïdische maaiveld: NAP +0,6 plus de NLGEO2018-geoïdehoogte van 40,57 m op de oorsprong (in het noordoosten lager dan elders in het land).

## Onderdeel `building:poten-stijgbuis-en-reservoir`

- Vier poten van 0,9 m (achtkant) op 4,2 m van het hart, van de voet tot in de omloop.
- Ringen tussen de poten op 7,0, 13,4 en 19,8 m (balken van 0,9 m), met in elk vlak van de onderste drie verdiepingen een omgekeerde V van de twee poten naar het midden van de ring erboven (65 tot 67 graden), zodat elke ring in het midden steun heeft. Boven de bovenste ring alleen de poten, zodat de bolle bodem zichtbaar blijft.
- Stijgbuis van 1,24 m in het midden, van de voet tot in de bodem.
- Reservoir van 7,8 m: halfbolle (iets afgeplatte) bodem van 23,6 tot 27,2 m, cilinder tot 30,3 m en een vlak kegeldak tot 30,9 m in het midden.
- Omloop van 9,7 m met de vloer op 27,9 m, een rand van 0,4 m en een kegelvormige onderkant onder 56 graden tot in de bodem.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Delfzijl)): bouwjaar, geheel metalen ronde toren, reservoir van het type Barkhausen, op het fabrieksterrein.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +0,6, dak tot NAP +31,4 à +31,6 (30,8 tot 31,0 m boven maaiveld), dakrand rond 30,2 tot 30,5 m, omloop rond 27,5 tot 29 m (met het hekwerk), buitenrand van de omloop op 4,8 m van het hart.
- Luchtfoto (PDOK, 8 cm): de voeten van twee poten, het schakelhuisje ten oosten, het spoor ten zuiden.
- BAG (PDOK WFS): geen pand onder de toren; pand 0010100000008450 ernaast.
- Foto [Delfzijl Watertoren Aldel](https://commons.wikimedia.org/wiki/File:Delfzijl_Watertoren_Aldel.JPG), bijna frontaal van onderaf: geschaald op de omloop van 9,7 m (38,5 px/m) met het maaiveld zo gekozen dat de dakrand op 30,3 m komt. Cilinder 7,8 m, stijgbuis 1,24 m, poten 0,31 m, ringen op 7,0, 13,4 en 19,8 m (midden tussen de voor- en achterring), omloopvloer 27,9 m, onderkant van de bodem 23,6 m.

## Geschat en weggelaten

Geschat: de hoek van de poten (±5 graden, uit twee potvoeten op de luchtfoto en de foto), de hoogtes uit één foto van onderaf (randen op de raakpunten aan de zijkant gemeten, ±0,3 m), de afplatting van de bodem (3,6 m diep bij 3,9 m straal), de helling van het dak en de vorm van de onderkant van de omloop. Verdikt: de poten (0,31 m) en verbanden (circa 0,2 m) zijn 0,9 m dik, het printminimum op 1:1000. Geschematiseerd: de echte windverbanden zijn dunne kruisschoren per vlak met radiale balken naar de stijgbuis; in het model een omgekeerde V per vlak, omdat kruisschoren onder 50 graden en vrije ringen in de export dichtgezet worden. Het model heeft daardoor genus 36 (de openingen in het vakwerk), wel één gesloten deel.

Weggelaten (kleiner dan 0,9 m of te dun): de dunne kruisschoren in de bovenste verdieping en de radiale balken naar de stijgbuis, het hekwerk rond de omloop, het tussenbordes op 21,8 m tussen de stijgbuis en de poot aan de oostnoordoostkant (een vloerplaat van circa 0,2 m die in de export een wand tot de grondplaat zou worden), de kooiladders langs de poot en op het dak, de antennes en schotels aan de poten, en de belettering.

## Controle

Eén gesloten NoError-node (genus 36 door het vakwerk). In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 3,6 %: onder de vlakke onderkant van de bolle bodem boven de stijgbuis (de echte overhang, circa 8,7 m³) en als kleine spitse schoren onder de ringen, waar die tussen poot en V 1,8 m vrij overspannen (circa 4,1 m³ per ring). De doorsneden op 1, 4, 10, 16, 22, 25,5, 27,7 en 29,5 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt een kegel steun onder de bolle bodem en dunne randen onder de drie ringen en langs de schoren, zoals verwacht. Op de kaart staat de toren (zonder PDOK-pand) met de voet 0,10–0,29 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/53.30533/6.97434/200/1x1/0
