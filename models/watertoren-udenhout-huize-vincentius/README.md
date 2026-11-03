# Watertoren Huize Vincentius (Udenhout)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-udenhout-huize-vincentius.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de daken zijn planvergelijkingen boven de BAG-contour (voorschild en achterschild van 45 graden, schilddaken van 33 graden met schilden van 45 graden aan de koppen), de toren bestaat uit geëxtrudeerde vierkanten met convexe consoles en kroonlijst, een tamboer en een halve bol; vensters, groeven en de spleet zijn nissen.

De watertoren van Huize Vincentius aan de Schoorstraat in Udenhout is in 1925 gebouwd naar ontwerp van J.J.M. van Halteren en is 35,5 m hoog (Wikipedia; AHN 37,4 m tot de top van de koepel). De inhoud van het reservoir is onbekend. De toren met uurwerk staat midden in de voorgevel van het hoofdgebouw van het voormalige internaat Huize Vincentius, nu een zorginstelling; het complex is rijksmonument. Omdat de toren in hetzelfde BAG-pand ligt als het hele hoofdgebouw (0855100000071049, 4064 m²), vervangt het model dat hele pand. De kapel achter de binnenhof is een eigen pand (0855100000701111) en blijft van PDOK.

## Bestanden

- `watertoren-udenhout-huize-vincentius.glb`: één node `building:hoofdgebouw-met-watertoren-en-koepel`, op het maaiveld.
- `watertoren-udenhout-huize-vincentius.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, maaiveldpunten en het vervangen BAG-pand.
- `watertoren-udenhout-huize-vincentius-1-1000.stl`: alles samen op 1:1000 (131 bij 65 mm, 37,8 mm hoog).

## Oorsprong en oriëntatie

RD-oorsprong [137767.58, 402714.61], het hart van de torenschacht uit het AHN-DSM (12,65 m achter de BAG-lijn van het bordes), op maaiveld (AHN-DTM NAP +9,5 tot +9,8 rondom; gebruikt +9,65). De voorgevel loopt in de BAG-contour onder -20,8 graden (RD): lokale +X loopt langs de voorgevel naar het oosten-zuidoosten (`xAxis` [0.93483, -0.35511]), de voorzijde ligt aan -Y. `groundHeight` 53,36 is NAP +9,65 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,71 m); de vijf `groundSamplePoints` liggen voor de voorgevel, waar het PDOK-maaiveld 53,35 tot 53,49 is. Het model vervangt pand 0855100000071049, zodat de PDOK-reconstructie verdwijnt (die heeft bovendien de binnenhof dicht).

## Onderdeel `building:hoofdgebouw-met-watertoren-en-koepel`

Maten in het gebouwstelsel: u langs de gevel vanaf de as, v vanaf de BAG-lijn van het bordes naar achteren (in het model v - 12,65).

- Toren:
  - Onderbouw boven het dak: 7,0 m breed, van v 9,0 tot 19,0, tot 20,0 m; achter het midden over 3 m verlaagd tot 17,5 m; in de voorkant een spleet van 0,9 m (14 tot 19 m, nis).
  - Schacht 5,3 m in het vierkant tot 33,7 m met hoekpilasters van 0,9 m (2,85 m uit het hart).
  - Hoekpijlers van 1,3 m tot 3,25 uit het hart, tot 23,2 m met een console die onder 45 graden 0,2 m uitkraagt (top 23,8 m).
  - Per vlak twee groeven van 0,6 m breed en 0,3 m diep van 24,2 tot 30,8 m (ribben van 0,9 m) en een uurwerkplaat van 1,7 m, 0,15 m voor de schacht, van 31,2 tot 33,05 m.
  - Kroonlijst onder 45 graden van de schacht tot 3,05 uit het hart (33,5 tot 34,3 m) met vier hoekposten van 0,9 m tot 34,9 m.
  - Tamboer r 2,2 tot 35,25 m en een halfbolvormige koepel tot 37,45 m (AHN-top NAP +47,08).
- Middendeel (u -27,5 tot 27,5, v 6,93 tot 22,4): voorschild onder 45 graden van de goot op 13,05 m tot de nok op 19,2 m (v 13,1), achterschild onder 45 graden tot het platte dak op 16,62 m dat tot de achtergevel aan de binnenhof loopt; vier dakkapellen van 3,6 m met een plat dak op 16,0 m.
- Middentravee tussen de traptorens (5,7 m breed) plat tot 13,05 m.
- Vierkante hoektorens aan de uiteinden van het middendeel: links 4,9 bij 12,2 m tot 20,35 m, rechts 4,1 bij 8,8 m tot 19,95 m, elk met een borstwering van 0,9 m rond een verdiept plat dak.
- Vier ronde traptorens, half voor de gevel en plat tot 13,95 m: twee naast de ingang (r 1,57) en twee op de hoeken van het middendeel (r 1,86).
- Bordes van 5,6 m breed tot 2,0 m met twee treden en een luifel tot 4,45 m met een onderkant onder 45 graden.
- Zijvleugels (links u -64,3 tot -27,5, rechts 27,5 tot 62,0; v 6,93 tot 15,0): schilddak van 33 graden van de goot op 12,6 m tot de nok op 15,2 m, schilden van 45 graden aan de koppen; de rechtervleugel springt voorbij u 58,2 in tot v 9,9 (BAG). Drie dakkapellen van 3,0 m per vleugel met een plat dak op 14,4 m.
- Lage aanbouwen van één laag tot 4,9 m achter de vleugels (tot v 17,4) en aan beide koppen, en een stoep tot 2,0 m bij de linker zijingang.
- Gangen rond de open binnenhof: zijgangen van 3 m tot 4,85 m (tot v 51) en 4,0 m, achtergang tot 4,0 m; het portaal naar de kapel (11 m breed) met een zadeldak van goot 4,9 tot nok 11,9 m.
- Vensters als nissen van 0,3 m: in de voorgevel travees van 3,3 m in vier rijen (vleugels en middendeel), boven de ingang drie smalle vensters; in de achtergevels de bovenste twee rijen van de vleugels en vier rijen van het middendeel aan de binnenhof.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Udenhout_Vincentius)): bouwjaar 1925, architect J.J.M. van Halteren, 35,5 m, reservoir onbekend, toren met uurwerk in het middendeel van het gebouw, rijksmonument (complex).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld NAP +9,5 tot +9,8; top koepel NAP +47,08 (37,43 m); omhullende van de schacht per hoogte (±3,2 m tot 22 m, ±2,8 m van 24 tot 34 m, koepel r 2,1 op 35 m); onderbouw 20,0 m; dwarsprofielen van het middendeel (goot 13, nok 19,2 op v 13,1, plat 16,62) en de vleugels (goot 12,6, nok 15,2 op v 11,0, schilden aan de koppen); hoektorens 19,95 en 20,35; traptorens 13,95; aanbouwen 4,9; gangen 4,85 en 4,0; portaal 4,9 tot 11,9.
- BAG-pand 0855100000071049 (contour met binnenring) en luchtfoto (PDOK): gevellijn onder -20,8 graden, traptorens, bordes, koppen, binnenhof, dakkapellen en de borstweringen op de hoek- en traptorens.
- RCE-foto's 20342745 en 20342746 (voorgevel met toren, traptorens en hoektorens), "Udenhout Watertoren 2010" en "Vincentius Udenhout" (Omroep Tilburg) op Wikimedia Commons: indeling van de schacht, consoles, groeven, uurwerken, kroonlijst, koepel, bordes, luifel, dakkapellen en vensterrijen, geschaald op de AHN-hoogtes.
- PDOK-gebouwtegels (LoD2.2) ter vergelijking: de reconstructie van het pand heeft de binnenhof als dichte plaat en de toren als smalle kolom.

## Geschat en weggelaten

Geschat: de hoogte van de consoles (23,2 tot 23,8 m) en de uurwerken (31,2 tot 33,05 m) uit foto's, de breedte van pilasters, pijlers en groeven (het DSM vervaagt ze), de diepte van alle nissen, het aantal en de plaats van de dakkapellen (luchtfoto en foto's), de vensterindeling (travees van 3,3 m, vier rijen, alleen voor- en achtergevels), de luifel en de treden van het bordes, en de rechterkop van de oostvleugel tussen u 58,2 en 62 (BAG en DSM spreken elkaar daar tegen; gevolgd is de BAG).

Weggelaten: de kapel (eigen pand), de ronde vensters en de vensters in de traptorens (gebogen gevel, kleiner dan 0,9 m), de letters "VINCENTIUS", het beeld boven de ingang, de wijzerplaten zelf, de borstweringen op de ronde traptorens (wand dunner dan 0,9 m), de trappen naast het bordes, schoorstenen en dakkapellen op de achterschilden (op het DSM niet herkenbaar, kleiner dan 0,9 m), de vensters in de gangen rond de binnenhof en de zonneschermen.

## Controle

Eén gesloten NoError-node met genus 1 (de open binnenhof). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet meetbaar: luifel, consoles, uurwerkplaten en kroonlijst staan onder 45 graden, de nisplafonds onder 56 en de koepel is een halve bol op de tamboer. Via `loadLocalLandmarkMeshes` op een uitsnede van 160 bij 100 m staat het model compleet op het laagste PDOK-maaiveldpunt voor de gevel (53,35). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie de koepel, kroonlijst, uurwerken, groeven en consoles van de toren, de ronde traptorens, het bordes met luifel, dakkapellen, vensternissen in voor- en achtergevels en een open binnenhof in plaats van een dichte plaat.

Controle-URL: http://localhost:3000/kaart/51.61305/5.13841/300/1x1/0
