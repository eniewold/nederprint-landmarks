# Watertoren Rhenen (Rhenen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-rhenen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: blok, schacht, onderbouw en rijtjeshuis zijn prisma's op de BAG-contouren, de lantaarn en het dak zijn achtkantige hulls, de naald een achtkantige loft; dakrand, portiek, balkon, brandtrapbordessen en vensters zijn losse bouwdelen.

De watertoren "De Koerheuvel" aan de Koerheuvelweg staat op de Koerheuvel aan de westkant van Rhenen. Ontworpen door H. van Hoogdalem en gebouwd in 1935, als watertoren in gebruik van 1937 tot 1989, met één reservoir van 600 m³; volgens Wikipedia 42,7 m hoog met negen verdiepingen. Daarna hotel Koerheuvel en sinds 9 december 1994 appartementen, met rijtjeshuizen ertegenaan. Een wit gepleisterd, bijna vierkant blok met aan de noordoosthoek een smalle schacht die 1,5 m uit de oostgevel steekt en boven het dak doorloopt, met daarop een achtkante glazen lantaarn onder een overstekend dak en een holle naaldspits. In de oostgevel van de schacht de ingang onder een gebogen luifel, een lange vensterstrook en hoog een balkonnetje; op de noordgevel een stalen brandtrap; tegen de west- en zuidzijde een lage onderbouw met dakterras.

## Bestanden

- `watertoren-rhenen.glb`: één node `building:watertoren-blok-schacht-lantaarn-spits-onderbouw-en-rijtjeshuis`, op maaiveld.
- `watertoren-rhenen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en de twee vervangen BAG-panden.
- `watertoren-rhenen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [167163.49, 441798.73] (51,96448 N, 5,56419 O), het hart van de schacht in BAG-pand 0340100000331993; de top van de spits in het AHN-DSM ligt 0,2 m ernaast. Maaiveld NAP +51,58 (3D BAG; AHN-DTM oost 51,55 tot 51,6, noord 52,0, west achter de onderbouw tot 53,3). Lokale +X wijst naar RD-richting -6,0 graden (oost, de ingang), +Y naar 84,0 graden (noord): evenwijdig aan de BAG-gevels (alle lange zijden op 84,0 graden). `groundHeight` 95,16 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost 95,16, oost bij de zuidgevel 95,29, zuidoost 95,42, noord tussen schacht en rijtjeshuis 95,20); het terrein loopt naar het westen op tot 96,7, de onderbouw zakt daar in het terrein.

Het model vervangt BAG-pand 0340100000331993 (toren met onderbouw) en het aangebouwde rijtjeshuis 0340100000331991 (1994). Dat laatste staat in het AHN op 7,9 m, maar PDOK reconstrueert het tot circa 26 m omdat de brandtrap van de toren boven zijn dak staat; het model zet het als plat blok van 7,95 m terug. De andere buurpanden (0340100000331992, 0340100000331989) kloppen met het AHN en blijven staan.

## Onderdeel `building:watertoren-blok-schacht-lantaarn-spits-onderbouw-en-rijtjeshuis`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Blok met het reservoir: X -12,3 tot 1,09, Y -10,64 tot 2,35 (13,4 × 13,0 m; BAG en DSM), dak op 26,29 m (AHN NAP +77,87), dakrand van 0,9 m breed tot 27,57 m (AHN-rand +79,15 op alle vier de zijden). Negen verdiepingen van 2,92 m.
- Schacht: X -2,55 tot 2,63, Y -2,61 tot 2,61 (5,2 m, BAG) tot 31,47 m (AHN +83,05).
- Lantaarn: achtkant met apothema 1,65 m van 31,47 tot 32,9 m, glas als acht nissen van 0,9 m; overstekend achtkant dak (apothema 2,2 m) met een onderkant van 50 graden, boeirand 33,55 tot 33,9 m (AHN +85,45).
- Naald: achtkant, hol verlopend van apothema 0,95 m op 33,9 m via 0,55 (35,7), 0,4 (37,5), 0,26 (39,9) en 0,12 m (42,9) naar de top op 44,9 m.
- Ingang: portiek van 2,6 × 1,4 m tegen de oostgevel van de schacht, wanden tot 2,9 m en een halfronde kap tot 4,2 m, met een rondboognis als deur; daarboven een vensterstrook van 0,5 m (4,8 tot 11,4 m).
- Balkon: halve trommel van 0,9 m straal op 28,9 m met een kegel van 50 graden eronder, en een rondboogdeur van 0,9 m (tot 30,6 m).
- Brandtrap op de noordgevel (X -10,9 tot -6,6): zes bordessen op de verdiepingen 3 tot en met 8 (8,8 tot 23,4 m), 1,6 m diep en 0,9 m dik met een onderkant van 50 graden naar de gevel.
- Vensters (nissen van 0,3 m, sponning 0,9 tot 2,2 m boven elke vloer): oostgevel twee vensters en een spleetvenster per verdieping; noordgevel van de schacht spleetvensters van het trappenhuis en twee hoge smalle vensters onderin; noordgevel van het blok één venster per verdieping; westgevel vijf vensters per verdieping boven de onderbouw; zuidgevel drie per verdieping en op de bovenste een breed venster van 3,2 m; een klein venster in de zuidgevel van de schacht boven het dak.
- Onderbouw: de hele BAG-contour (afgeronde zuidwesthoek) tot 5,1 m (AHN +56,68), met een rand van 0,9 m breed en 1,0 m hoog langs het dakterras.
- Rijtjeshuis 0340100000331991: BAG-contour tot 7,95 m (AHN +59,5).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Rhenen)): 1935, H. van Hoogdalem, 42,7 m, negen verdiepingen, 600 m³, Koerheuvelweg, appartementen sinds 1994.
- BAG-panden 0340100000331993 en 0340100000331991 (PDOK, 2026-11-06): contouren en richting van de gevels.
- 3D BAG (2026-11-06): maaiveld NAP +51,58, dak 77,85, onderbouw 56,64, hoogste dakpunt 85,45.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): hoogtes van blok, dakrand, schacht, lantaarndak, onderbouw, rijtjeshuis en brandtrap (tot circa 25 m), en de plaats van de spits.
- Luchtfoto (PDOK, 2026-11-06): dakterras van de onderbouw, lantaarn op de noordoosthoek.
- PDOK-gebouwtegel (2026-11-06): toren als blok met een trap naar de schacht, zonder lantaarn of spits; rijtjeshuis 0340100000331991 tot circa 26 m.
- Foto's op Wikimedia Commons: "Watertoren - Rhenen - 20371381 - RCE" (1998, vanuit het noordoosten, verticaal gecorrigeerd: ingang, schacht, brandtrap, lantaarn en verhoudingen van de naald), "Watertoren Rhenen" (2009, noordoost van dichtbij: vensters, balkon, luifel) en "Koerheuvel met Watertoren Rhenen" (2014, van ver uit het zuidwesten: west- en zuidgevel, lantaarnglas, naald).

## Geschat en weggelaten

Geschat: de hoogte van de naald. Het AHN raakt de dunne punt niet (hoogste cel NAP +94,73 = 43,15 m is een ondergrens); de foto's geven een naald van circa 10 m (RCE) tot 12 m (verre foto) boven het lantaarndak, gekozen is 11 m met de top op 44,9 m (Wikipedia noemt 42,7 m voor de toren). Verder geschat uit foto's: het verloop van de naald, de maten van de lantaarn (apothema 1,65 en 2,2 m; in het echt een bijna vlakke overstek, hier met een onderkant van 50 graden zodat hij zonder steun print), de portiek (in het echt een open gebogen luifel boven de deur, hier een dichte portiek), het balkon (op circa 0,5 m), de bordessen van de brandtrap (stalen roosters, hier dichte platen met een schuine onderkant), de plaats en het aantal vensters per gevel (op circa 0,5 m; de zuidgevel alleen van de verre foto, de onderste verdiepingen en de onderbouw op geen foto te zien) en de rand van het dakterras.

Weggelaten: de stalen trappen en hekken van de brandtrap, de deuren naar de brandtrap (achter de bordessen), het hek om het balkon, de roeden en kozijnen, de klokcijfers in het lantaarnglas, de naam "De Koerheuvel" boven de ingang en de traptreden bij de ingang (kleiner dan 0,9 m), de vensters van de onderbouw en van het rijtjeshuis (niet op de foto's te zien of te klein), en de beplanting op het dakterras.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 van een uitsnede van 80 m bevat het model, niet meer de PDOK-panden 0340100000331993 en 0340100000331991, en geen ondersteuningsobject. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een glad blok met een getrapte schacht, zonder lantaarn of spits, en een te hoog rijtjeshuis) aan elke kant de vensters, de dakrand, de lantaarn met overstekend dak en de naald; in het oosten ook de portiek, de vensterstrook en het balkon, in het noorden de brandtrap en de spleetvensters, in het zuiden en westen de onderbouw met het terras en de afgeronde hoek.

Controle-URL: http://localhost:3000/kaart/51.96448/5.56413/200/1x1/0
