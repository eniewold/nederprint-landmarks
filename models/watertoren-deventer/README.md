# Watertoren Deventer (Deventer)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-deventer.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, onderbouw, schacht, reservoir, dak, lantaarn en koepel zijn omwentelingsvormen van een radiaal profiel (96 segmenten), de consoles, dakkapellen en trap convexe omhullenden en blokken, de velden, vensters en de deur blinde nissen met een schuin plafond.

De watertoren aan de Ceintuurbaan (bij nr. 401) staat in het Nieuwe Plantsoen op een van de hoogste plekken van Deventer. Hij werd in 1892 gebouwd (gedenksteen 31 mei 1892, BAG-bouwjaar 1893) naar ontwerp van stadsarchitect J.A. Mulock Houwer, in neorenaissancestijl, is rijksmonument 12706, 53 m hoog tot de windvaan, heeft een Intze-reservoir van 500 m³ en is nog in gebruik bij Vitens. Een ronde toren van paarsrode baksteen met lichte natuurstenen banden op een ronde voet van basaltblokken met een trap naar de ingang aan de noordkant. De gebatterde onderbouw heeft acht velden tussen lisenen met elk twee vensters onder een ontlastingsboog (in het noordelijke veld de deur), daarboven een kroonlijst en een taps toelopende schacht in vier geledingen. Op zestien consoles kraagt het reservoir uit: zware stenen lijst, tegelband, zestien rondboogvensters tussen lisenen, overstekende kroonlijst. Het kegeldak van leien heeft vier dakkapellen met gebogen topgevels en pinakels; daarop een rood lantaarnvoetstuk met een omgang, een lantaarn met een leien uikoepel en een windvaan met een zeemeermin.

## Bestanden

- `watertoren-deventer.glb`: één node, `building:watertoren-voet-schacht-reservoir-dak-en-lantaarn`.
- `watertoren-deventer.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-deventer-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [206913.5, 475726.94] (52,26711 N, 6,14772 O), het hart van het ronde BAG-pand 0150100000017040 (72 punten, straal 7,10 m; de top in het AHN-DSM ligt 0,3 m ernaast), op het maaiveld rond de basaltvoet: AHN-DTM NAP +10,9 (10,7 tot 11,0 tussen 8,5 en 10 m; de heuvel zakt naar NAP +9,8 op 17 m). Lokale +X wijst naar RD-richting -4 graden (oost), +Y naar 86 graden (noord): daar ligt de trap in de basaltvoet (AHN-DSM: een helling van NAP +11,0 naar +12,2 tussen 9,4 en 7,8 m van het hart, 3,5 m breed) met de ingang erboven. De vier dakkapellen staan op 0, 90, 180 en 270 graden lokaal (luchtfoto; in het DSM is alleen de westelijke te zien, op RD 176 graden).

`groundSamplePoints` liggen op 9 m oost en west en op 9 m zuidoost en zuidwest; `groundHeight` 54,05 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (54,05 tot 54,15, gemeten 2026-11-05). Recht ten zuiden ligt op 9 m een smal verdiept pad (PDOK 53,43, AHN NAP +10,2); daar staat bewust geen punt, anders zakt de toren 0,6 m weg. `groundOffsetMetres` is -0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +10,9).

- Basaltvoet: cilinder van 8,05 m tot 1,3 m (AHN NAP +12,2). Trap naar het noorden: zes treden van 2,8 m breed van 9,7 m tot de voet, met wangen van 0,45 m; drie treden van 2,5 m breed op het terras voor de deur tot 2,05 m.
- Onderbouw: plint 7,05 m tot 2,0 m, schuin naar de gebatterde gevel van 6,85 m op 2,2 m tot 6,35 m op 12,9 m (BAG-cirkel 7,10 m). Acht velden van 3,9 m breed en 0,25 m diep tussen lisenen van circa 1,3 m, met een rondboog tot 12,05 m. Per veld vensters van 1,3 m breed van 3,0 tot 6,4 en van 7,4 tot 10,0 m; in het noordelijke veld de deur van 1,6 m (2,05 tot 4,7 m) en het bovenste venster.
- Kroonlijst van de onderbouw: 6,6 m van 12,9 tot 13,5 m, met een afzaat naar de schacht.
- Schacht: taps van 5,35 m op 13,5 m tot 4,85 m op 26,6 m, natuurstenen banden 0,12 m uit op 17,4, 20,7 en 24,0 m (0,35 m hoog). Rondboogvensters van 0,9 m als nis: vier op 14,6 tot 16,45 m (45 + 90k graden), vier hoge op 18,2 tot 20,25 m (90k), vier op 21,6 tot 23,45 m en acht kleine op 24,8 tot 26,05 m.
- Consoles en bodem: zestien consoles van 0,9 m breed (onder 49 graden) van 26,4 tot 29,45 m tot 7,0 m, daartussen de schuine Intze-bodem onder 50 graden van 4,85 m op 26,75 m tot 7,1 m op 29,43 m.
- Reservoir: zware lijst 7,1 m tot 30,2 m, trommel 6,95 m tot de kroonlijst, zestien verdiepte velden van 1,8 m (0,25 m diep) van 31,2 m met een rondboog tot 33,4 m, in elk veld een rondboogvenster van 0,9 m van 31,4 tot 32,45 m. Kroonlijst 7,35 m van 34,3 tot 34,75 m (AHN NAP +45,6).
- Dak: rechte kegel z = 34,66 + 1,17 (6,75 - r) uit het AHN-DSM (circa 50 graden) tot 2,6 m op 39,5 m.
- Dakkapellen: vier, voorgevel op 6,6 m, 2,2 m breed, goot 36,9 m, topgevel met gebogen schouders (0,6 m dik) tot 38,2 m met een pinakel tot 38,8 m (AHN NAP +49,6), zadeldakje tot 37,9 m in het dak, rondboogvenster van 0,9 m als nis.
- Lantaarnvoetstuk (rood): 2,6 m tot 40,8 m, schuin uitlopend tot de omgang van 3,0 m op 41,2 m (AHN NAP +52,08).
- Lantaarn: 1,15 m van 41,2 tot 43,5 m, kraag 1,5 m tot 43,85 m, uikoepel tot 1,45 m breed en 47,0 m hoog, makelaar 0,9 m dik tot 48,7 m (AHN-piek NAP +59,6).

Alle banden, lijsten en kraag hebben een onderkant van 50 graden, de nissen en velden een plafond dat naar binnen onder 56 tot 63 graden oploopt en onder de kroonlijsten blijft.

## Bronnen en maten

- [Rijksmonumentenregister 12706](https://monumentenregister.cultureelerfgoed.nl/monumenten/12706): 1892, J.A. Mulock Houwer, 53 m, basaltvoet, Intze-reservoir, natuursteen banden, sluitstenen en consoles, spits dak met dakkapellen, koepellantaarn met balustrade, windvaan met zeemeermin.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Deventer)): 53 m, 500 m³, Ceintuurbaan, Vitens, nog in gebruik.
- BAG-pand 0150100000017040 (PDOK, 2026-11-05): ronde voetafdruk, straal 7,10 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-05): maaiveld, basaltvoet (NAP +12,2 tot 8,05 m), trap (noord), kroonlijst (NAP +45,6 tot 7,0 à 7,4 m), dakprofiel per halve meter straal (p90), omgang (NAP +52,08 tot 3,0 m), koepel en piek (NAP +58,2 en +59,6), de westelijke dakkapel (tot NAP +49,6). Een groot deel van het DSM rond de schacht is leeg of laag (schaduw van de reservoirrand); alleen de west- en zuidwestkant meten het dak.
- PDOK-luchtfoto: vier dakkapellen en de richting.
- Foto's op Wikimedia Commons: "DvntrWatertorenWest.jpg" (vanaf het westen; 36,6 px/m tussen de kroonlijst van de onderbouw en de tegelfries, verankerd op de kroonlijst uit het AHN: hoogtes van onderbouw, banden, vensters, consoles, lijst, vensterzone en kroonlijst), "Overzicht - Deventer - 20054378 - RCE.jpg" (ingang met trap en basaltvoet), "Aanzicht - Deventer - 20054380 - RCE.jpg" en "20054379" (onderbouw met velden en vensters, consoles), "Reservoir gedeelte - Deventer - 20054381 - RCE.jpg" (reservoir, dakkapellen, lantaarn), "Deventer Watertoren.JPG" en "Watertoren Deventer uit 1892.jpg" (dak, dakkapellen, omgang, lantaarn en koepel).

## Geschat en weggelaten

Geschat: de stralen van onderbouw (6,85 tot 6,35 m), schacht (5,35 tot 4,85 m) en reservoir (6,95 m) uit breedteverhoudingen op schuin omhoog genomen foto's, verankerd op de BAG-cirkel en de kroonlijst in het AHN (onzekerheid circa 0,3 m); de hoogtes van alle geledingen tussen de basaltvoet en de kroonlijst uit één foto met een vaste schaal (circa een halve meter); het aantal en de plaats van de vensters in de schacht (vier, vier, vier en acht); zestien consoles en zestien velden in het reservoir (op de foto's acht zichtbaar per helft); de vorm en maten van de dakkapellen, de lantaarn en de koepel uit foto's; de trap (zes treden) uit het DSM en de RCE-foto.

Weggelaten: het smeedijzeren hek van de omgang (een leuning, te dun voor 1:1000), de windvaan met de zeemeermin en de vlaggenmast (dunner dan 0,9 m), de kleine pinakels op de schouders van de dakkapellen, de kapitelen en ankers op de lisenen, de sluitstenen, de tegel- en ruitpatronen (vlak, alleen kleur), de gedenksteen, de ventilatieroosters in de plint, de schuine omranding van de voet aan de voet van de heuvel en het verdiepte pad ten zuiden van de toren (terrein).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; precies 45 graden en plafonds die boven de onderkant van een kroonlijst uitkwamen werden eerst wel opgevuld, daarom 50 graden en lagere boogkruinen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK- en 3D BAG-reconstructie (een rechte achthoekige zuil met een punt) de basaltvoet met trap, de gebatterde onderbouw met acht boogvelden, vensters en deur, de kroonlijst, de taps toelopende schacht met banden en vensters, de uitkragende consoles en schuine bodem, het bredere reservoir met lijst, vensters en kroonlijst, het kegeldak met vier dakkapellen, het lantaarnvoetstuk met de omgang, de lantaarn en de uikoepel.

Controle-URL: http://localhost:3000/kaart/52.26712/6.14768/200/1x1/0
