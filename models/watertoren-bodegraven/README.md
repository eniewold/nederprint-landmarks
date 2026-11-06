# Watertoren Bodegraven (Bodegraven)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bodegraven.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, plintband, fries, band, kraag, lijst, reservoir, dakrand en borstwering zijn één omwentelingsprofiel (96 segmenten), de steunberen hulls, de lisenen en penanten prisma's, de vensters, friesbogen en het open werk blinde nissen met een schuin of spits plafond.

De watertoren aan Rond de Watertoren werd in 1907 gebouwd naar ontwerp van Visser & Smit (Hanab). Hij is 34,15 m hoog en had een reservoir van 200 m³; in 1954 kreeg hij een nieuw reservoir, in 1980 werd hij verkocht aan de gemeente, in 1995 gerestaureerd en nu draagt hij een zendmast (Wikipedia). Gemeentelijk monument GM1901WN031. De toren staat er nog (luchtfoto en AHN 2026, foto 2017). Een ronde, licht taps toelopende bakstenen schacht staat op een onderbouw met acht betonnen steunberen en een betonnen plintband. Boven in de schacht loopt een rondboogfries onder een betonnen band; daarop draagt een kraag met consoles een bredere, gepleisterde reservoirmantel met acht betonnen lisenen en per travee drie vierkante vensters boven elkaar. Het platte dak heeft een betonnen borstwering met ruitvormig open werk tussen acht penanten.

## Bestanden

- `watertoren-bodegraven.glb`: één node, `building:watertoren-onderbouw-schacht-reservoir-en-borstwering`.
- `watertoren-bodegraven.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-bodegraven-1-1000.stl`: het model op 1:1000 (9,5 × 9,5 × 35,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [110766.51, 455691.93] (52,087721 N, 4,741807 O): het hart van de ronde BAG-voetafdruk van pand 0497100000000004 (cirkelfit, straal 4,25 m, afwijking 1,6 cm), op het maaiveld: AHN-DTM NAP −0,25 (−0,34 tot 0,0 tussen 5 en 9 m).

De lokale X-as staat 40 graden linksom van RD-oost (`xAxis` [0.76604, 0.64279]), op een steunbeer. De acht steunberen, de lisenen en de penanten staan op k × 45 graden, de reservoirvensters midden in de travees (22,5 + k × 45). De stand van de steunberen is gemeten op de luchtfoto (de voet van de toren met vier steunberen op −8, −47, −95 en −144 graden RD) en op de foto vanaf het noordoosten (camera-GPS); hij is op circa 5 graden nauwkeurig.

`groundSamplePoints` liggen op 7 m in de vier asrichtingen; `groundHeight` 43,315 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (noordoost 43,64, zuidwest 43,39, noordwest 43,60, zuidoost 43,315 op de weg, gemeten 2026-11-06). Het PDOK-pand staat op 43,14 met het dak op 76,72 (33,6 m hoog, een vlakke cilinder). `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP −0,25).

- Onderbouw: bakstenen cilinder met straal 3,95 m tot 5,2 m, met acht betonnen steunberen van 1,1 m breed, aan de voet tot de BAG-cirkel (4,25 m), naar boven iets terugliggend en schuin afgedekt onder de plintband. Lage rondboogvensters (nissen 0,9 × 0,8 m plus boog) in vier travees.
- Plintband: straal 4,15 m van 5,2 tot 5,7 m, onderkant 50 graden.
- Schacht: taps van straal 3,9 m op 5,7 m tot 3,6 m op 21,2 m, met drie smalle rondboogvensters boven elkaar in de travee aan de noordoostzijde (7,4, 12,6 en 17,4 m).
- Rondboogfries: zestien boognissen van 0,9 m breed met een spitse top, van 20,2 tot circa 21,3 m.
- Betonnen band: straal 3,95 m van 21,6 tot 22,4 m, onderkant 50 graden.
- Kraag en lijst: kraag van 50 graden van 3,95 m tot 4,75 m (22,4 tot 23,36 m), lijst met straal 4,75 m tot 24,1 m.
- Reservoir: straal 4,5 m van 24,1 tot 33,0 m, met acht lisenen van 0,9 m breed (0,18 m voor de mantel) en per travee drie vensters als nis van 0,9 × 1,1 m (midden op 25,8, 28,6 en 31,4 m).
- Dakrand en borstwering: dakrand met straal 4,65 m vanaf 33,18 m, borstwering van 0,9 m dik tot 34,45 m rond het platte dak op 33,55 m; het open werk als ondiepe nis tussen de penanten; acht penanten van 0,9 × 0,9 m tot 34,8 m boven de lisenen.

Nissen zijn 0,25 tot 0,3 m diep met een plafond dat naar binnen onder 55 à 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Bodegraven)): 1907, Visser & Smit Hanab, 34,15 m, 200 m³, nieuw reservoir in 1954, restauratie in 1995, zendmast.
- BAG-pand 0497100000000004 (PDOK, 2026-11-06): cirkel met straal 4,25 m, bouwjaar 1905 in de BAG.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP −0,25, dak NAP +33,3, borstwering NAP +34, reservoir tot 4,8 m van het hart, zendmast tot NAP +46,4.
- PDOK-luchtfoto (Actueel_orthoHR): voet met de steunberen, rond dak met borstwering.
- Foto's op Wikimedia Commons (categorie "Watertoren (Bodegraven)"): "Bodegraven, watertoren GM1901WN031 foto11 2017-07-09 09.26.jpg" (vanaf het noordoosten, verticaal recht), "Watertoren (Bodegraven).JPG" (vanaf de Oude Rijn), "Watertoren, voormalige - Bodegraven - 20374386 - RCE.jpg" en "Overzicht - Bodegraven - 20373708 - RCE.jpg".

## Geschat en weggelaten

Geschat: de hoogtes van de plintband (5,2–5,7 m), het fries, de band, de kraag, de onderkant van het reservoir (24,1 m) en de vensters komen uit de verticaal rechte foto van 2017, geschaald op het dak uit het AHN (0,0266 m per pixel); de stralen van schacht, band, reservoir en lijst uit dezelfde foto, geschaald op de BAG-cirkel en gecontroleerd tegen het AHN (reservoir tot 4,8 m). De borstwering is in het echt een dunne betonnen rand met ruitvormig open werk en ligt in het AHN op NAP +34; in het model is ze 0,9 m dik en dicht, met het open werk als nis. De stand van de steunberen is op circa 5 graden nauwkeurig. De consoles onder het reservoir zijn samengevoegd tot één kraag van 50 graden, en de kraag en banden hebben een onderkant van 50 graden waar ze in het echt recht uitkragen. Vensters zijn in het echt 0,4 tot 0,8 m breed en staan als nissen van 0,9 m in het model. Een deur heb ik op de foto's niet gevonden (de voet is aan de meeste kanten verborgen door bomen) en zit dus niet in het model.

Weggelaten: de zendmast van circa 12 m op het dak en de antennes aan de reservoirmantel (geen deel van het monument, vakwerk dunner dan 0,9 m), de flauwe lisenen in het metselwerk van de schacht (minder dan 0,1 m reliëf), de dunne spijlen van het open werk.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun (geen ondersteuningsobject) en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een vlakke cilinder tot 33,6 m) de steunberen en plintband, de taps toelopende schacht met vensters, het rondboogfries, de band en de kraag, het bredere reservoir met lisenen en vensters en de borstwering met penanten.

Controle-URL: http://localhost:3000/kaart/52.08772/4.74181/200/1x1/0
