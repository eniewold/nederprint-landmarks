# Watertoren Harderwijk

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-harderwijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de wand is één cilinder op de lisenen waaruit de velden als snijders met schuine plafonds zijn weggenomen, plint, band, kroonlijst en afdekband zijn omwentelingsringen, deur, vensters en luik zijn rondboognissen.

De watertoren in Harderwijk is in 1895 gebouwd naar ontwerp van D. de Leeuw, 15,85 m hoog met een reservoir van 336 m³. Hij staat in het bos aan de Stort en is gemeentelijk monument. Een lage, brede bakstenen toren zonder aparte schacht: tien lisenen met verdiepte velden in drie geledingen en een plat dak.

## Bestanden

- `watertoren-harderwijk.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; losse delen zouden een eigen voet tot de grondplaat krijgen.
- `watertoren-harderwijk.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-harderwijk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [173216.65, 482906.48], het hart van de dakrand in het AHN (cirkelfit op de rand van het dak, NAP +34,25 m), binnen 0,3 m van het hart van BAG-pand 0243100001326183 (80,2 m²); op maaiveld aan de voet (NAP +19,30 m, rondom binnen 0,1 m gelijk). Assen in RD-richting (`xAxis` [1, 0]). De tien lisenen staan op 18 + k·36 graden vanaf de deur; de deur staat midden in het vak op 270 graden (linksom vanaf RD-oost), naar het zuiden. Die richting is geschat: geen bron toont de ligging van de deur. Op de foto staat een grote spar rechts achter de toren en de luchtfoto's tonen er een ten noorden ervan; aan de zuidkant ligt de open plek met het pad. Vervangt alleen het BAG-pand van de toren; binnen 35 m staat geen ander pand.

## Onderdeel `building:toren-met-lisenen-banden-en-dakrand`

- Plint van 10,4 m tot +0,45 met een schuine waterlijst naar de velden.
- Tien lisenen van 0,7 m breed op een wand van 10,1 m; de velden ertussen liggen 0,25 m terug (9,6 m), met plafonds die onder 56 graden naar binnen oplopen.
- Onderste geleding (+0,62 tot +5,45): in negen velden een blind rondboogvenster van 0,82 m (+1,27 tot +3,43), in het tiende de deur van 1,4 m met een rondboog tot +3,21 in een omlijsting van 1,9 m tot +3,48.
- Natuurstenen band van 10,34 m met een schuine onderkant van +5,45 tot +6,2.
- Middelste geleding (+6,2 tot +8,72): velden onder segmentbogen van +7,78 aan de lisenen tot +8,32 in de kruin.
- Bovenste geleding (+8,72 tot +12,45): vlakke velden, dan een kroonlijst van 10,4 m met een schuine onderkant tot +12,95.
- Gladde attiek tot +14,75 met een rondboogluik van 0,69 m (+12,96 tot +14,03) boven de deur, afdekband van 10,26 m tot +14,95 en een plat dak op +14,53 binnen een borstwering van 0,85 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Harderwijk)): ontwerper, bouwjaar, 15,85 m, 336 m³.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +19,30 rondom, dak op NAP +33,83 (14,53 m), dakrand op circa NAP +34,25 (14,95 m), cirkelfit van de dakrand met straal 5,03 m (celmiddens) tot 5,28 m (rand), binnenrand van de borstwering tussen r 4,25 en 4,6 m. De bomen staan rondom vrij van de toren, het silhouet is schoon.
- BAG-pand 0243100001326183 (bouwjaar 1895, in gebruik, 80,2 m², straal 5,05 m) en luchtfoto's 8 cm van 2021 tot 2025 (PDOK): ligging, dakrand van circa 9,7 m, plat dak met een luik en een paar kleine opbouwen.
- Foto [Harderwijk Watertoren 2007](https://commons.wikimedia.org/wiki/File:Harderwijk_Watertoren_2007.JPG) (Olympus C-8080, frontaal op de deur): de opbouw en alle overige hoogtes en breedtes. De camera is teruggerekend als cilinder op de voet, de dakrand (14,95 m uit het AHN) en de breedte onder en boven; dat gaf een straal van 5,09 m en een camera op circa 26 m van het hart, 14 graden omhoog. De lisenen liggen op die foto 36,0 graden uit elkaar (tien vakken).

## Geschat en weggelaten

Geschat: alle hoogtes behalve dak en dakrand (uit één frontale foto met een teruggerekende camera, onzekerheid circa 0,3 m), de richting van de deur (zuid, zie hierboven), de diepte van de velden (0,25 m; in werkelijkheid circa een steen, maar zo blijft het reliëf op 1:1000 zichtbaar), de breedte van de lisenen (foto 0,6 m, model 0,7 m), de blinde vensters in alle negen andere velden (de foto toont er drie), één luik in de attiek (alleen boven de deur te zien), de dikte van de borstwering (0,85 m: het AHN geeft een binnenrand tussen r 4,25 en 4,6 m; dunner zou de export hem verdikken tot de afdekband), de schuine onderkanten van band, kroonlijst en afdekband (56 graden).

Weggelaten (kleiner dan 0,9 m of te dun): de leuning op de dakrand, de consoles aan de lisenen in de middelste geleding (circa 0,3 m), de getrapte voeten van de bovenste lisenen en het getrapte fries onder de kroonlijst, de gevelsteen boven de deur (0,65 × 0,45 m, vlak), de dorpelstenen, de regenpijp, het dakluik en de ventilatieopbouwen op het dak (lager dan 0,3 m).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume vrijwel niet (gemeten 1,00008): alleen een strookje achter in de deurnis en in de kruinen van de segmentbogen. De doorsneden op 1,5, 2,5, 5,6, 7, 10, 12,6, 13,5 en 14,7 m (plint, vensters, band, middelste velden, bovenste velden, kroonlijst, luik en borstwering) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen alleen splinters steun in de kruinen van de segmentbogen; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,11–0,26 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.33381/5.65436/200/1x1/0
