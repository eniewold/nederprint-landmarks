# Watertoren Bontebrug (Ulft)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bontebrug.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een cilinder met zes geëxtrudeerde lisenen, balkons en loggia zijn cilinderschijven, reservoir, rand, dakrand en kegeldak één omwentelingsprofiel; deur en vensters zijn nissen.

De watertoren in Bontebrug, ook wel watertoren van Ulft genoemd (gemeente Oude IJsselstreek), is in 1938 gebouwd naar ontwerp van G.J. Postel Hzn, 37,6 m hoog met één reservoir van 400 m³. Hij staat in een bosje ten zuidoosten van het pompgebouw.

## Bestanden

- `watertoren-bontebrug.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-bontebrug.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-bontebrug-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [224406.85, 433990.75], het hart van het reservoir in het AHN (cirkelfit op de dakrand van 12,9 m), op maaiveld (NAP +18,0 m, AHN-DTM op 7 tot 8 m van het hart). De BAG-contour van pand 1509100000188838 (27 punten, straal 4,3 tot 5,2 m) ligt 0,6 m noordelijker. Assen in RD-richting (`xAxis` [1, 0]). De zes lisenen staan op 30 + k·60 graden, één naar het zuiden (luchtfoto: de voeten onder de scheefgeprojecteerde toren); de deur staat in de westelijke travee, aan het pad en de stoep op de luchtfoto. Vervangt alleen het BAG-pand van de toren; het pompgebouw (1509100000205676) op 19 m blijft PDOK.

## Onderdeel `building:schacht-met-lisenen-loggia-reservoir-en-kegeldak`

- Ronde bakstenen kern van 7,4 m met zes lisenen van 1,24 m breed en 1,6 m diep tot 5,3 m uit het hart (10,6 m over de voorvlakken), van het maaiveld tot onder de reservoirrand op +23,05. Deur (1,3 × 2,5 m) in de westelijke travee, een trapvenster (0,7 × 1,25 m op +15,6) in elke travee.
- Loggia tussen de lisenen: balkonplaat tot 5,2 m van +20,1 tot +20,6, daarboven de teruggelegen glaswand (straal 4,5) met per travee een glaspui van 2,2 m breed tot onder de reservoirrand.
- Uitkragende onderrand van het reservoir (12,44 m) van +23,05 tot +23,7, glad reservoir van 11,34 m tot +32,65 met twaalf kleine vensters (0,7 × 0,7 m op +31,2, 15 graden naast elke lisene).
- Uitkragende dakrand met omloop (12,9 m) van +32,65 tot +33,4 en een rond koperen kegeldak van 11,6 m (helling 36 graden) tot +37,65.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Bontebrug)): architect, bouwjaar, 37,6 m, 400 m³.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +18,0 aan de voet, hoogste punt NAP +55,67 (37,7 m boven de voet), dakrand van 12,9 m (cirkelfit op halve hoogte van de rand), kegeldak van circa 36 graden. Bomen rond de toren vervuilen de sectoren naar het noordwesten en oosten onder 25 m.
- BAG-pand 1509100000188838 en luchtfoto (PDOK): ligging, rond koperen dak met naden en zonder graten, de zes lisenen aan de zuidkant van de scheefgeprojecteerde schacht, de stoep aan de westkant.
- Foto [Bontebrug Watertoren](https://commons.wikimedia.org/wiki/File:Bontebrug_Watertoren.JPG), frontaal van afstand: breedtes van dakrand, kegelvoet, reservoir, reservoirrand en schacht en de hoogtes van dakrand, vensters en reservoirrand, geschaald op de dakrand in het AHN (10,85 px/m).
- Foto [2024-08-29 Watertoren Bontebrug](https://commons.wikimedia.org/wiki/File:2024-08-29_Watertoren_Bontebrug.jpg), met een lisene recht naar de camera: breedte en stand van de lisenen (zes, op 60 graden), loggia, balkons met hekwerk, trapvensters en de twaalf vensters onder de dakrand.
- Foto [2013-06 Watertoren Bontebrug](https://commons.wikimedia.org/wiki/File:2013-06_Watertoren_Bontebrug.jpeg): een lisene vrijwel van opzij, diepte 1,6 m en de kern tussen de lisenen; het balkon ligt in de travee.
- Foto [Bontebrug Watertoren 2006](https://commons.wikimedia.org/wiki/File:Bontebrug_Watertoren_2006.JPG): loggia en dakrand van een andere kant.

## Geschat en weggelaten

Geschat: de stand van de lisenen (één naar het zuiden, uit de luchtfoto, op een paar graden na), hun diepte en de straal van de kern (uit één schuine foto), de diepte van de loggia (glaswand op 4,5 m) en van de balkons, de richting van de deur (west, aan het pad en de stoep) en zijn maten, de hoogte en breedte van de trapvensters (alleen in twee travees te zien, hier in alle zes), de diepte van de vensternissen, en de dikte van reservoirrand en dakrand uit de frontale foto. De top is de AHN-top; de Wikipedia-hoogte van 37,6 m klopt daarmee.

Weggelaten (kleiner dan 0,9 m of te dun): het hekwerk om de balkons en om de omloop op de dakrand, de spitse makelaar op de kegel, de smalle sleufvensters in het reservoir (0,4 m), de donkere teruggelegen band onder de dakrand (0,4 m), de antennes, schotels en kabelgoten, en de lage stoep voor de deur (in het AHN lager dan 1 m).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 3,3 %: onder de balkonplaten, in de loggia onder de reservoirrand en onder de dakrand, alle drie echte overhang. De doorsneden op 1,2, 10, 16,2, 28, 31,5 en 35 m (deur, lisenen, trapvensters, reservoir, vensters, kegeldak) blijven gelijk; de loggia (21,5 m) wordt in de export dicht. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) zet de export de loggia onder de reservoirrand dicht en komen er dunne schoren langs de lisenen; het model zelf blijft open. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,1–0,24 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.89011/6.39546/200/1x1/0
