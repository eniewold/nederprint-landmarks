# Watertoren Olst (Olst)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-olst.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, banden, klokkenstoel en boeiboord zijn afgeknotte achtkante piramides (convexe omhullende van achthoeken), het dak een achtkante piramide, vensters en openingen zijn nissen, liftkoker en loopbruggen zijn blokken.

De watertoren aan de Watertorenstraat is in 1962 gebouwd naar ontwerp van P.J. de Gruyter en C. Poederoyen. Volgens Wikipedia is hij 41,55 m hoog met één reservoir van 900 m³; hij was ook klokkentoren van de katholieke kerk ernaast. Vitens verkocht hem in 2004; vanaf 2006 is hij verbouwd tot vijf appartementen van twee verdiepingen, met aan de oostkant een vrijstaande liftkoker en loopbruggen naar de toren. De klokken en het kruis op de top zijn in 2016 verwijderd. Het is geen betonnen toren, zoals de opdracht vermoedde, maar een achtkante toren van rode baksteen die naar boven iets verjongt, met een gemetselde voet onder een natuurstenen waterlijst, drie natuurstenen banden, een vierde band onder de klokkenstoel en tien rijen vensters. Bovenin staat een open natuurstenen klokkenstoel: per zijde twee openingen tussen hoekpijlers met één zuil in het midden, een hoofdgestel, een koperen boeiboord en een vlak achtkant dak.

## Bestanden

- `watertoren-olst.glb`: één node `building:watertoren-schacht-klokkenstoel-dak-en-liftkoker`, op maaiveld.
- `watertoren-olst.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-olst-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [204454.35, 483752.09] (52,33946 N, 6,11287 O), het hart van het achtkant van BAG-pand 1773100000011750 (gemiddelde van de acht hoekpunten: omgeschreven straal 5,52 m, apothema 5,10 m; de top in het AHN-DSM ligt er 0,2 m naast). Maaiveld AHN-DTM NAP +4,25 (ring van 6 tot 8 m: 4,1 tot 4,4). Lokale +X is de normaal van de oostelijke zijde van het achtkant (RD 8,95 graden, uit de acht hoekpunten; `xAxis` [0.98782, 0.15557]); daar staat de liftkoker. +Y wijst naar het noorden (98,95 graden); de deur zit in de zuidzijde (-Y). `groundHeight` 47,3 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (noord 47,32, zuid 47,34, noordwest 47,32, zuidwest 47,30); de weg ten westen ligt op 7 m op 47,17, het PDOK-pand begint op 46,94. Het model vervangt BAG-pand 1773100000011750 (toren en liftkoker in één pand); de buurpanden liggen op 18 m en meer.

## Onderdeel `building:watertoren-schacht-klokkenstoel-dak-en-liftkoker`

Maten in het lokale stelsel (apothema's van het achtkant), hoogtes boven maaiveld.

- Voet: apothema 5,10 tot 5,0 m, met een natuurstenen waterlijst van 5,0 tot 5,36 m (apothema 5,18, onderkant 50 graden). In de zuidzijde een natuurstenen deuromlijsting van 2,25 m breed tot onder de waterlijst, 0,12 m voor de voet, met een deur van 1,6 × 2,9 m als nis van 0,35 m.
- Schacht: verjongt van apothema 4,98 boven de waterlijst tot 4,72 op 34,7 m. Drie natuurstenen banden van 0,7 m (12,2, 19,8 en 27,35 m) en een band onder de klokkenstoel (34,7 tot 35,2 m), 0,12 m uitstekend met een onderkant van 50 graden.
- Vensters: tien rijen, één venster per zijde in alle zijden behalve de oostzijde (daar de loopbruggen), 1,25 m breed en 1,3 m hoog (de onderste rij 1,0 m), als nissen van 0,3 m met een plafond van 56 graden; bovenkanten op 6,45, 9,0, 11,85, 14,55, 18,9, 22,0, 24,75, 27,05, 31,55 en 34,25 m.
- Klokkenstoel: apothema 4,72 tot 39,67 m. Per zijde één verdiepte opening van 2,7 m breed tussen de hoekpijlers, van 35,5 tot 38,8 m, 0,5 m diep met een plafond van 56 graden, met in het midden een zuil van 0,5 m tegen de achterwand en een kapiteel van 0,74 m.
- Boeiboord: 0,33 m uit de gevel (apothema 5,05), onderkant van 52 graden vanaf 39,25 m, tot 40,05 m (AHN-DSM NAP +44,3).
- Dak: vlakke achtkante piramide tot 41,3 m (AHN-DSM NAP +45,55), circa 14 graden.
- Liftkoker (2006): witte koker op de BAG-rechthoek (lokaal x 7,12 tot 10,0, y -2,22 tot 2,78) tot 35,3 m (AHN-DSM NAP +39,5), aan de torenzijde een donker beklede strook van 0,7 m tot 34,6 m.
- Loopbruggen: drie blokken tussen toren en koker (y -1,25 tot 2,25 uit het AHN-DSM) van 6,4 tot 9,3 m, 11,65 tot 18,9 m en 23,6 tot 32,5 m (AHN-DSM: bovenste NAP +36,5). Ertussen is het open; de onderkant loopt vanaf toren en koker onder 50 graden op naar het midden, zodat de doorgang zonder steun print.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Olst)): bouwjaar, architecten, hoogte 41,55 m, reservoir 900 m³, verkoop in 2004, appartementen sinds 2006, klokken en kruis verwijderd in 2016.
- BAG-pand 1773100000011750 (PDOK, 2026-11-06): achtkant met de liftkoker als rechthoek aan de oostkant.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +4,25, dakrand NAP +44,3, top NAP +45,55, liftkoker NAP +39,5, bovenste loopbrug NAP +36,5; dak tot circa 5,0 m uit het hart.
- Foto's op Wikimedia Commons: "Olst, de watertoren IMG 2025 2018-04-07 11.43" (telelens vanuit het zuiden, 88,8 px/m, verankerd op de dakrand uit het AHN): hoogtes van de waterlijst, de banden, de vensterrijen, de klokkenstoel en de loopbruggen, en de verjonging; "20150716 Watertoren Olst", "Olst Watertoren" en "Watertoren Olst" (klokkenstoel met zuilen, boeiboord, dak, liftkoker); "Olst Watertoren 8280" (2006, vóór de liftkoker: de deur met natuurstenen omlijsting).

## Geschat en weggelaten

Geschat: alle hoogtes van banden, vensters, klokkenstoel en loopbruggen uit één foto (schaal uit de dakrand in het AHN); de verjonging (0,26 m in de apothema) uit de breedte onder en boven op dezelfde foto; de vensters in alle zijden behalve de oostzijde en op dezelfde hoogte in elke zijde; dat de deur in de zuidzijde zit (uit de standplaats van de foto van 2006); de maten van de deuromlijsting; de diepte van de koker in y en de donkere strook aan de torenzijde (foto en AHN-DSM, de BAG-rechthoek begint pas op 7,12 m); de breedte van de loopbruggen uit het AHN-DSM (de BAG geeft y -1,92 tot 1,24).

Weggelaten: het kruis met de bol op de top (verwijderd in 2016), de antenne, de glazen balustrades in de klokkenstoel, de leuning op de bovenste loopbrug, het kleine raam boven de deur en het tekstreliëf ernaast (kleiner dan 0,9 m), het lage gemetselde bergingetje naast de liftkoker (circa 1,5 m) en de kozijnen. De zuilen zijn 0,5 m in plaats van circa 0,45 m en staan tegen de achterwand van een opening van 0,5 m diep: in het echt is de klokkenstoel open, maar een diepere opening liet de export onder het boeiboord de hele opening opvullen.

## Controle

Eén gesloten NoError-node met genus 2 (de twee lussen door de loopbruggen tussen toren en koker). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: waterlijst en banden 50 graden, nissen en openingen met een plafond van 56 graden, kapitelen 63 graden, boeiboord 52 graden, loopbruggen met een onderkant van 50 graden. Een export op 1:1000 van een uitsnede van 80 m rond de toren bevat het model met hetzelfde volume (plus de voet tot de onderplaat). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een glad achtkant prisma met een scheve kap en een blok voor de koker) de waterlijst, de vier banden, de verjonging, de vensterrijen, de open klokkenstoel met zuilen, het overstekende boeiboord en het puntige dak, de deuromlijsting en de losse liftkoker met de loopbruggen en de open ruimtes ertussen.

Controle-URL: http://localhost:3000/kaart/52.33940/6.11271/200/1x1/0
