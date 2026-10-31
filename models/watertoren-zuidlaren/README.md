# Watertoren (Zuidlaren)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zuidlaren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: één omwentelingsprofiel voor plint, voet, schacht, boogfries, reservoir, kroonlijst en dak; het dakhuisje als prisma en piramide, vensters en rondboogjes als ondiepe nissen. De scheefstand is een afschuiving langs de hoogte van het geheel.

De watertoren is in 1895 gebouwd voor de psychiatrische inrichting Dennenoord (nu Lentis), volgens Wikipedia 32 m hoog (met windwijzer), rijksmonument 510918. De gevel heeft een spiraalvormige band van gele baksteen. In 1934 stond de toren door graafwerk ongeveer een meter uit het lood.

## Bestanden

- `watertoren-zuidlaren.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse daknode zou een voet tot de grondplaat krijgen.
- `watertoren-zuidlaren.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-zuidlaren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [241219.18, 567344.79], het middelpunt van de ronde BAG-contour van pand 1730100000012721, op maaiveld (NAP +7,8 m). Assen in RD-richting (`xAxis` [1, 0]). De top van het dak staat in het AHN 0,3 m oostelijk en 0,8 m zuidelijk van dat middelpunt; het model helt daarom over met 0,85 m op 28,3 m (1,7 graden, naar het zuidzuidoosten). Vervangt alleen het BAG-pand van de toren.

De BAG-contour heeft een doorsnede van 7,0 m, maar de toren is smaller: het AHN laat een dak van circa 6,2 m zien en op de frontale RCE-foto is de plint even breed als de kroonlijst (275 en 282 px). Het model volgt foto en AHN (plint 6,1 m) en is daarmee 0,9 m smaller dan het verborgen PDOK-blok.

## Onderdeel `building:voet-schacht-boogfries-reservoir-en-dak`

- Donkere plint van 6,1 m tot +0,8, voet van 5,66 m met drie rondboogvensters tot +4,55 en een lijst van 6,0 m tot +4,8.
- Slanke ronde schacht van 5,0 m tot +19,2 met rondboogvensters langs de trap (nissen van 0,8 m met spitse top).
- Boogfries: onder 45 graden uitkragend naar 5,62 m, met zestien rondboogjes, tot +20,9.
- Reservoir van 5,74 m met twee vensters tot +24,55, kroonlijst met holle onderkant (kwart ellips over 0,9 m) naar 6,26 m tot +26,1.
- Lage kegel tot +28,3 en een vierkant dakhuisje van 1,2 m met een piramide tot +29,4.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Zuidlaren)) en [Rijksmonumentenregister 510918](https://monumentenregister.cultureelerfgoed.nl/monumenten/510918): bouwjaar, 32 m, spiraalband, scheefstand sinds 1934.
- RCE-foto [20321989](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_slanke_ronde_watertoren_met_een_reservoir_op_uitkragend_boogfries_-_Zuidlaren_-_20321989_-_RCE.jpg), frontaal met rechte verticalen: alle hoogtes en stralen, geschaald op het AHN (kroonlijst op 26,1 m, 45 px/m).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP +7,77, top NAP +37,22 (29,45 m boven maaiveld, het dakhuisje), dakrand op 26 tot 27 m, dakdoorsnede circa 6,2 m, verschuiving van de top ten opzichte van de voet.
- BAG-pand 1730100000012721: ligging (doorsnede 7,0 m, zie hierboven).
- [Zuidlaren Watertoren Dennenoord.JPG](https://commons.wikimedia.org/wiki/File:Zuidlaren_Watertoren_Dennenoord.JPG) en [Watertoren1 Dennenoord](https://commons.wikimedia.org/wiki/File:20191030_Watertoren1_Dennenoord.jpg): dakhuisje met piramidedak, windwijzer en antennes.

## Geschat en weggelaten

Geschat: de schaal van de foto (op het AHN, niet op de BAG), de vorm van de holle kroonlijst, de helling van het dak (uit het AHN), de maat van het dakhuisje, het aantal rondboogjes (zestien) en de plaats van de vensters op de niet gefotografeerde zijden en de draaiing van het vensterpatroon (de richting van de foto is niet bekend). De scheefstand is als rechte afschuiving gemodelleerd.

Weggelaten (kleiner dan 0,9 m of te dun): windwijzer en antennes, de gele spiraalband en ruitpatronen (alleen kleur), de dunne banden en raamroeden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 1 % en blijven de doorsneden op 2,3, 11,2, 16,7 en 23,1 m (door de vensters) gelijk. Een preview-export op 1:1000 (100 × 100 m) bevat geen ondersteuning voor de toren. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,2 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/53.08608/6.67406/200/1x1/0
