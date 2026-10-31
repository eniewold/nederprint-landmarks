# Watertoren (Meppel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-meppel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: één omwentelingsprofiel voor voet, schacht, fries, lijst, trommel, reservoir en kroonlijst; consoles en lantaarn als omhulsels en prisma's, vensters als ondiepe nissen.

De watertoren is in 1893 gebouwd naar ontwerp van H.P.N. Halbertsma, 31,5 m hoog met een reservoir van 230 m³, en staat aan het begin van de Steenwijkerstraatweg. Bij de renovatie van 1955 verdween de sierlijke opbouw op het dak (zie de oude foto op Wikipedia) en kreeg de toren zijn witte pleisterlaag; in 2004 kocht de gemeente hem.

## Bestanden

- `watertoren-meppel.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse reservoir- of lantaarnnode zou een voet tot de grondplaat krijgen.
- `watertoren-meppel.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-meppel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [208752.1, 524541.3]: het middelpunt van de ronde BAG-contour van pand 0119100000007291 (doorsnede 9,07 m), 0,3 m naar het zuiden geschoven naar het hart van de lantaarn in het AHN. Maaiveld NAP +2,5 m. Assen in RD-richting (`xAxis` [1, 0]). De toren is rond; alleen de plaats van de vensters hangt van de draaiing af en die is geschat. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:voet-schacht-reservoir-en-lantaarn`

- Verjongende voet van 9,07 m (BAG) naar 8,26 m tot +5,6, met een band van 8,4 m tot +5,85 en zes rondboogvensters (nis van 0,8 m met spitse top, +2,0 tot +3,2).
- Verjongende schacht van 7,0 naar 6,76 m tot +15,9, met smalle vensters (nissen van 0,6 m) verspringend langs de trap.
- Fries van 7,2 m (onder 45 graden uitkragend) tot +17,2, lijst van 7,4 m tot +18,0 en een trommel van 6,9 m tot +19,5 met twaalf consoles van 0,6 m (helling circa 47 graden) onder het reservoir.
- Reservoir van 9,7 m met een bolle onderrand (kwart ellips van +19,5 tot +20,3) tot +28,0, kroonlijst van 10,0 m tot +28,4 en een laag aflopend dak naar het dakterras van 7,4 m op +28,8.
- Lantaarn van 4,7 m (zestienhoek) tot +31,0 met een overstekende kap tot +31,7.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Meppel)): bouwjaar, architect, 31,5 m, 230 m³, renovatie 1955.
- BAG-pand 0119100000007291: ronde contour van 9,07 m (28 hoekpunten, straal 4,44 tot 4,58 m).
- [Meppel, watertoren foto7](https://commons.wikimedia.org/wiki/File:Meppel,_watertoren_foto7_2011-05-21_12.27.JPG): frontaal genomen, rechte verticalen. Stralen geschaald op de BAG-voet (45,5 px/m), hoogtes op het AHN-terras (47 px/m; de onderkant van de voet gaat achter een haag schuil). Verder [PM1-0171](https://commons.wikimedia.org/wiki/File:Meppel,_de_watertoren_PM1-0171_IMG_2121_2018-04-07_16.35.jpg) en [Watertoren Meppel.jpg](https://commons.wikimedia.org/wiki/File:Watertoren_Meppel.jpg) voor de vorm van fries, consoles en lantaarn.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP +2,5, top NAP +34,27 (31,8 m boven maaiveld), dakterras op 28,8 m, lantaarn met straal 2,3 m vanaf circa 30,5 m. Ten zuiden van de toren is het DSM leeg (schaduw van de scan) en ten noorden vervuild door bomen; de straal per hoogte is daarom niet uit het AHN gehaald.
- Luchtfoto 8 cm (PDOK): ronde toren met dakterras en lantaarn.

## Geschat en weggelaten

Geschat: de hoogtes van banden, fries, lijst, consoles en reservoir (één schaalfactor op de foto), de vorm van de bolle onderrand (kwart ellips), het aantal consoles (twaalf) en de plaats en het aantal vensters op de niet gefotografeerde zijden, de draaiing van het vensterpatroon (zes voetvensters om de 60 graden), de helling van het dak tussen kroonlijst en terras. De deur is op de foto's niet te zien en is weggelaten.

Weggelaten (kleiner dan 0,9 m of te dun): het hekwerk rond het dakterras, de makelaar op de lantaarn, de rondboogjes in het fries (als gesloten band), de kleine vensters in de trommel, de ruitvormige ankers op het reservoir, de dunne banden in de voet en raamroeden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 1 % (onder het reservoir tussen de consoles, het fries en de kroonlijst) en blijven de doorsneden op 2,6, 10, 12,5 en 24 m gelijk. In een preview-export op 1:1000 (100 × 100 m) staat alleen onder het reservoir tussen de consoles ondersteuning. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,5 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.70556/6.18222/200/1x1/0
