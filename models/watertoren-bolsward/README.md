# Watertoren Bolsward

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bolsward.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voetrand, schacht en bovendeel zijn geëxtrudeerde achthoeken, de band en de kap omhulsels tussen achthoeken; deur en vensters zijn nissen.

De watertoren van Bolsward is in 1929 gebouwd door de Bredasche Beton Mij. v/h H. Vriens, 37,4 m hoog met twee reservoirs van 200 m³. Hij is eind 2007 buiten gebruik gesteld en in 2015 gekocht door Sonnema Berenburg.

## Bestanden

- `watertoren-bolsward.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-bolsward.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-bolsward-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [162941.65, 564082.56], het hart van de achthoekige BAG-contour van pand 0064100000129055, op maaiveld (NAP +0,5 m). De contour is een onregelmatige achthoek: vier brede vlakken van 5,3 m (apothema 4,95) en vier smalle van 3,3 m (apothema 5,39), dus 9,9 m over de brede en 10,8 m over de smalle vlakken. +X wijst naar het smalle vlak op 1,65 graden linksom van RD-oost (`xAxis` [0.99959, 0.02879]); de brede vlakken kijken naar NO, NW, ZW en ZO. Vervangt alleen het BAG-pand van de toren, niet het bijgebouw ten noordoosten.

## Onderdeel `building:schacht-bovendeel-en-kap`

- Voetrand tot +1,4, 0,1 m ingesprongen ten opzichte van de BAG-contour.
- Schacht tot +21,0, 0,2 m ingesprongen, met een dubbele deur (1,8 × 2,4 m, 0,3 m diep) in het brede vlak naar het noordwesten.
- Band met schuine onderkant van +21,0 tot +21,6, daarboven het bovendeel met de reservoirs op de BAG-contour tot de dakrand op +35,0. Vensterstrook (2,4 × 1,0 m) van +33,5 tot +34,5 in elk breed vlak.
- Koperen achtzijdige kap, 0,3 m binnen de dakrand: steil tot de knik op +36,2, dan flauw naar een kleine vlakke top op +37,3.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Bolsward)): bouwjaar, bouwer, 37,4 m, 2 × 200 m³, buitengebruikstelling en verkoop.
- BAG-panden 0064100000129055 (toren) en 0064100000129086 (bijgebouw), PDOK, opgehaald 2026-10-31: de achthoek en de richting van de vlakken; het bijgebouw voor de plaats van de deur.
- AHN DSM/DTM 0,5 m (PDOK): maaiveld NAP +0,49, hoogste punt NAP +37,68 (37,2 m boven maaiveld), de dakrand rond 35 m waar de omhullende versmalt.
- Luchtfoto (PDOK): achtzijdige kap met graten tot een kleine top.
- Foto [20190821 Bolsward watertoren2](https://commons.wikimedia.org/wiki/File:20190821_Bolsward_watertoren2.jpg), frontaal op het brede vlak met de deur, bijgebouw links erachter: band op 0,63 van de dakrandhoogte, vensterstrook, deur, voetrand.
- Foto [Industrieel Erfgoed in Beeld 54992](https://commons.wikimedia.org/wiki/File:Watertoren_Bolsward_Industrieel_Erfgoed_in_Beeld,_18-03-1996,_signatuur_54992.jpg) (1996, van verder weg): het bovendeel is circa 4 % breder dan de schacht onder de band.

## Geschat en weggelaten

Geschat: de hoogtes van band, vensterstrook en dakrand (uit de verhoudingen op twee foto's met schuin omhoog kijkende camera, op de AHN-top geschaald), de insprong van de schacht (0,2 m) en de voetrand, de vorm van de kap (knik en top), de maten van deur en vensters, en de richting van de deur: op de foto's van 2019 staat hij in het noordwestvlak, de RCE-foto van 1996 vanaf het hek in het zuidwesten laat mogelijk een tweede deur zien die niet is gemodelleerd.

Weggelaten (kleiner dan 0,9 m of te ondiep): de verdiepte panelen in de brede vlakken (centimeters), de ronde patrijspoorten onder de band, de groef boven de vensterstrook, de camera's en het rooster naast de deur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,5 % en blijven de doorsneden op 1, 10, 21,3 en 34 m (deur, schacht, band, vensters) gelijk; de apothema's op 10 en 28 m zijn 5,19 en 5,39. In een preview-export op 1:1000 (100 × 100 m) zit alleen een beetje ondersteuning in de vensterstrook. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,7 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/53.06333/5.50556/200/1x1/0
