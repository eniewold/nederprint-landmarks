# Watertoren Leur (Leur)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-leur.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, kraag, kegel, dakrand, dak en dakopbouw zijn één omwentelingsprofiel; de ribben van de kegel zijn 72 V-groeven, deur en vensters zijn nissen.

De watertoren in Leur (gemeente Wijchen) is ontworpen door Brouwer en Deurvorst en in 1960 gebouwd, 40 m hoog met een reservoir van 800 m³. Hij staat op een eilandje in een vijver: een ronde betonnen schacht met horizontale banden en een grijs beklede plint, daarop een omgekeerde, geribde kegel met een witte dakrand en een plat dak met een ronde dakopbouw.

## Bestanden

- `watertoren-leur.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-leur.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-leur-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [176832.1, 425308.2], het hart van de ronde BAG-contour van pand 0296100000021710 (straal 2,5 m, de schacht), op maaiveld (NAP +7,45 m, AHN-DTM op het eilandje rond de voet). Het hart van het reservoir en van de dakopbouw ligt in het AHN 0,15 tot 0,3 m naar het zuiden; de toren staat in het model recht. Assen in RD-richting (`xAxis` [1, 0]). De deur staat naar het zuiden, naar het pad. Vervangt alleen het BAG-pand van de toren; er staan geen andere panden in de buurt.

## Onderdeel `building:schacht-kegelreservoir-en-dakopbouw`

- Ronde schacht van 5,0 m met een plint van grijze plaatbekleding tot +3,8 (0,08 m dikker), een deur (1,2 × 2,4 m) naar het zuiden en zeven betonbanden van 0,35 m (op +7,0 en dan elke 2,95 m), die 0,12 m uitsteken met een onderkant van 56 graden.
- Vensterband van +27,6 tot +28,3 met twaalf kleine vensters (0,4 × 0,35 m).
- Gladde kraag van r 2,5 op +28,3 naar r 3,5 op +30,0.
- Omgekeerde kegel onder 50 graden tot r 9,76 op +37,45, met 72 scherpe kammen en V-groeven; de groeven worden 0,17 m diep en lopen onder 47 graden uit onder de dakrand.
- Witte dakrand van 20,2 m: schuine onderkant van 55 graden tot +37,9 en een rechte rand tot +38,05. Daarbinnen een dakring die naar binnen oploopt tot het platte dak op +38,45 (r 8,1).
- Ronde dakopbouw van 6,7 m tot +39,15 met een kegelvormig dak tot r 2,1 op +39,85 en een ventilatiekap van 1,2 m tot +40,1.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Leur)): architecten, bouwjaar, 40 m, 800 m³.
- BAG-pand 0296100000021710 (PDOK): ronde contour van 5,0 m, bouwjaar 1958 in de BAG.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +7,45 rond de voet, top van de dakopbouw NAP +47,58 (40,1 m boven maaiveld), reservoirbreedte 20,0 tot 20,4 m. Het metalen dak geeft in het DSM alleen losse punten van 20 tot 33 m boven maaiveld en is daarom niet gebruikt voor de dakhoogte.
- 3D BAG (LoD2.2): alleen een cilinder van 5 m tot NAP +47,35, zonder reservoir.
- Foto [Leur Watertoren 2006](https://commons.wikimedia.org/wiki/File:Leur_Watertoren_2006.JPG): hoogtes van plint, banden, vensterband, kraag, kegel en dakrand met een cameramodel (licht omhoog gericht) geschaald op de schachtbreedte (5,0 m) en de reservoirbreedte (20,2 m); het aantal ribben uit de groefafstand op de voorkant.
- Luchtfoto (PDOK, 8 cm): dakring, plat dak, dakopbouw met kegeldak en kap; de dakring en het kegeldak zijn aan de zonkant lichter (aflopend naar buiten); de slagschaduw van de dakopbouw op het dak geeft een opbouw van circa 2 m boven het dak.

## Geschat en weggelaten

Geschat: de dakhoogte (de foto geeft de dakrand op 37,9 tot 38,6 m, de schaduw een opbouw van circa 2 m onder de AHN-top; het model neemt de rand op 38,05 en het dak op 38,45), de helling van de dakring en van het dak van de opbouw, de hoogte van de opbouwwand, de richting en maat van de deur (aan de zichtbare noordkant is geen deur), de maat van de vensters in de vensterband en hun aantal (12 uit de onderlinge afstand op de foto), het aantal ribben (72; de foto geeft 70 tot 85), de diepte van de groeven en het uitsteken van de banden en de plint.

Weggelaten (kleiner dan 0,9 m of te dun): de antennepanelen op de bovenste schacht, de witte radarkoepel en de mast op het dak, de reling op het dak, twee lage dakluiken naast de opbouw, de ladder, en het hekwerk met kasten ten westen van de voet.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vult de 45-gradenopvulling per node, zoals de export die doet, niets op (volumeverhouding 1,0000): de kegel staat op 50 graden, de groeven lopen onder 47 graden uit, de dakrand heeft een onderkant van 55 graden en banden, vensters en deur hebben plafonds van 56 graden. De doorsneden op 1,5, 15, 27,9, 33 en 39,5 m (deur, schacht, vensterband, kegel, dakopbouw) blijven gelijk. Controlebeelden blijven buiten de repo. De preview-export (1:1000, support v2) heeft geen steun, ook niet onder het kegelreservoir; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0–0,16 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.81583/5.70361/200/1x1/0
