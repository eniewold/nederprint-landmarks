# Watertoren Dokkum

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-dokkum.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de kern is een geëxtrudeerde achthoek met acht losse ribben, het reservoir één omwentelingsprofiel en de dakopbouw een zeshoek.

De watertoren van Dokkum is in 1958 gebouwd naar ontwerp van J.J.M. Vegter, 37 m hoog (met antennes) met een reservoir van 1000 m³. Bij het ontwerp is rekening gehouden met een restaurant boven in de toren, vandaar de raamband onder het dak. Rijksmonument 530878 sinds 2010.

## Bestanden

- `watertoren-dokkum.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-dokkum.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-dokkum-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [195144.4, 593637.27], het middelpunt van de ronde BAG-contour van pand 0058100000215831 (cirkelfit, straal 7,78 m), op maaiveld (NAP +0,8 m). Assen in RD-richting (`xAxis` [1, 0]). De BAG-contour is het bovenaanzicht van het reservoir. De stand van de achthoekige kern is uit de bronnen niet af te leiden en staat met de vlakken op de RD-assen. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-met-ribben-reservoir-en-dak`

- Achthoekige betonnen kern (vlakken van 2,4 m, apothema 2,93) tot +20,0, met op elke hoek een rib van 0,9 m breed tot 4,5 m uit het hart (8,9 m over de ribben), tot in de onderkant van het reservoir.
- Reservoir: kegelvormige onderkant van r 3,2 op +19,8 naar de onderrand op +21,6, cilinder met tegelbekleding van 15,56 m (BAG) tot +30,6.
- Raamband van het (beoogde) restaurant van +30,6 tot +31,6, 0,5 m verdiept; daarboven een schuine dakrand (49 graden) naar de dakrand van 15,96 m op +32,4 en het platte dak op +32,6.
- Zeszijdige dakopbouw met de lichtkoepel (2,3 m) tot +33,6, iets uit het midden zoals in het AHN.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Dokkum)) en [Rijksmonumentenregister 530878](https://monumentenregister.cultureelerfgoed.nl/monumenten/530878): architect, bouwjaar, 37 m, 1000 m³, restaurant.
- BAG-pand 0058100000215831 (PDOK, opgehaald 2026-10-31): ronde contour van 15,56 m.
- AHN DSM/DTM 0,5 m (PDOK): maaiveld NAP +0,79, plat dak rond 32,5 m boven maaiveld, dakopbouw tot circa 33,5 m iets ten noordoosten van het hart, antennes tot NAP +36,24.
- RCE-foto [20421405](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Dokkum_-_20421405_-_RCE.jpg), met rechte camera: hoogtes van onderrand, tegelbekleding en dak op de raakpunten aan de zijkant, breedte van kern en ribben, geschaald op de reservoirbreedte (24,7 px/m).
- RCE-foto [20421409](https://commons.wikimedia.org/wiki/File:Zicht_op_het_bovenste_gedeelte_van_de_watertoren_-_Dokkum_-_20421409_-_RCE.jpg): ribben op de hoeken van de kern, kegelvormige onderkant met radiale balken.
- RCE-foto [20421380](https://commons.wikimedia.org/wiki/File:Interieur,_dakraam_-_Dokkum_-_20421380_-_RCE.jpg): zeszijdige lichtkoepel.

## Geschat en weggelaten

Geschat: de stand van de achthoekige kern (op de RD-assen), de maten van kern en ribben (uit één foto, ribdiepte 1,3 m, breedte afgerond naar 0,9 m), de kegelhelling van de onderkant (begin op de kern op 19,8 m), de hoogte en diepte van de raamband, de schuine dakrand (in werkelijkheid een vlakke dakplaat met overstek; schuin gemaakt zodat de export de raamband niet opvult) en de maat van de dakopbouw.

Weggelaten (kleiner dan 0,9 m of te dun): de radiale balken onder het reservoir, de V-vormige stijlen in de raamband, antennes en schotels op het dak, de deur en het trappenhuis in de kern, de tegelstructuur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 6 %: alleen onder de kegelvormige onderkant, de echte vorm. De doorsneden op 5, 15, 26 en 31 m (ribben, reservoir, raamband) blijven gelijk. In een preview-export op 1:1000 (100 × 100 m) zit de ondersteuning onder de kegel en als dunne schoren in de groeven tussen de ribben. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,4 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/53.32771/5.98969/200/1x1/0
