# Watertoren Villa Augustus (Dordrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-dordrecht-villa-augustus.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is een prisma op de BAG-gevels met uitgesneden middenvelden, lijsten als hellende randen, een zestienhoekige reservoirverdieping met een kegeldak, achtkante torentjes, spitsen en een lantaarn als omwentelingsvormen (hulls van veelhoeken); de rest van het pand bestaat uit blokken en dakvlakken (hulls van goot en nok) op de hoogtes uit het AHN.

De eerste watertoren van Dordrecht staat aan het Wantij bij de Oranjelaan. Hij is in 1882 gebouwd naar ontwerp van stadsarchitect J.A. van der Kloes, is volgens Wikipedia 33 m hoog met een reservoir van 500 m³, en is rijksmonument 526400. In 1938 zijn de hoektorentjes deels afgebroken voor een verbouwing van het reservoir; de toren verloor zijn functie in 1965. Na de restauratie van 2006-2007 zit er hotel-restaurant Villa Augustus in, met open spitsen van staal en glas op de torentjes, een glazen lift en een stalen trappenhuis.

De toren is geen eigen BAG-pand. Hij staat in pand 0505100000025142 (bouwjaar 1882) samen met de hotelvleugel aan de noordoostkant. Het model vervangt daarom het hele pand. Het pompgebouw (1941-1942) en de andere bijgebouwen zijn eigen panden en staan er niet in.

## Bestanden

- `watertoren-dordrecht-villa-augustus.glb`: één node `building:watertoren-met-hotelvleugel`, op maaiveld.
- `watertoren-dordrecht-villa-augustus.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-dordrecht-villa-augustus-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [106564.4, 425436.0] (51,81544 N, 4,68477 O), het hart van de vierkante toren volgens de BAG. Maaiveld AHN NAP +3,60 (vlak, 3,55 tot 3,63 rond het pand). Lokale +X wijst naar RD-richting 45 graden (noordoost, langs de vleugel), +Y naar 135 graden (noordwest): evenwijdig aan de BAG-gevels (44,3 tot 45,4 graden). `groundHeight` 47,19 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de zes `groundSamplePoints` (47,19 bij de kop van de vleugel, elders 47,21 tot 47,28).

Het model vervangt BAG-pand 0505100000025142 (in de PDOK-gebouwtegel een toren met losse pieken tot ellipsoïdisch 80,0 en een vleugel met een zadeldak). De buurpanden (pompgebouw 0505100000026001, de bijgebouwen en de nieuwbouw van 2019) staan los.

## Onderdeel `building:watertoren-met-hotelvleugel`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Schacht: 14,8 × 14,8 m (BAG), hoekrisalieten van 3,45 m; de middenvelden van 7,9 m liggen 0,5 m terug (BAG) tot 18,95 m en worden daarboven onder 52 graden weer tot de gevel dichtgezet (de bogen); in elk middenveld een pilaster van 0,9 m, 0,3 m uit de gevel.
- Waterlijst rond de schacht op 6,3–6,6 m, 0,15 m uit; kroonlijst van 20,75 tot 21,4 m, 0,3 m uit, daarop het terras.
- Vensters per verdieping (7,5–9,9, 11,3–13,7 en 15,1–17,5 m): één venster van 0,9 m per risaliet en de gekoppelde vensters (samen 1,9 m) per middenveld; boven in de risalieten de oculi als vierkante nis op 18,15–19,05 m; op de begane grond deuren en hoge vensters (1,2 m tot 4,4 m in de risalieten, 1,9 m tot 4,6 m in de middenvelden). Op de noordoostgevel staan de vleugel, de lift en het trappenhuis; daar alleen de vensters van de noordelijke risaliet.
- Reservoirverdieping: zestienhoek met apothema 6,1 m van 21,4 tot 25,1 m, twee vensters van 0,7 m per zijde in twee rijen (21,9–23,0 en 23,7–24,6 m), kroonlijst 0,3 m uit tot de goot op 25,5 m (AHN NAP +29,1), kegeldak naar straal 1,9 m op 27,6 m (AHN: NAP +31,0 op straal 2,5 m).
- Hoektorentjes: achtkant (omgeschreven straal 1,35 m) op (±5,7, ±5,6) van 21,4 tot 25,5 m met een kroonlijst en een verbinding met de reservoirverdieping, smalle vensters op de buitenzijden.
- Spitsen (staal en glas, gesloten weergegeven): opstaande rand van 0,8 m, dan twee naalden (zuidwest en zuidoost) en een fles met hals en bol (noordwest) tot 33,0 m, en een vaas met een taille tot 31,2 m (noordoost).
- Vier schoorstenen van 1,0 m op het kegeldak tot 27,5 m.
- Lantaarn: achtkant, glazen onderste geleding (apothema 1,7 m) tot 29,9 m, overstekend dak tot 30,85 m, bovenste geleding (apothema 1,45 m) tot 31,5 m en een spits dak tot 32,85 m (AHN NAP +36,45).
- Glazen liftschacht tegen de noordoostgevel tot 26,9 m (AHN NAP +30,5) en het stalen trappenhuis ernaast tot 23,4 m, met verdiepte velden tussen de bordessen boven het dak van de vleugel.
- Vleugel: plat dak van 6,35 m aan de gevels tot 6,75 m in het midden (AHN NAP +10,0 en +10,3) met een middenopbouw van 4,6 m breed tot 7,7 m en een nok op 8,0 m (NAP +11,6) met bovenlichten; vensters en een deur in beide lange gevels.
- Zadeldakgebouw: nok dwars op de vleugel, goot 5,6 m (NAP +9,2), nok 8,4 m (NAP +12,0), topgevels 0,35 m boven het dak, schoorsteen op de zuidoostelijke top tot 9,6 m, een venster in elke topgevel en drie vensters op de begane grond.
- Aanbouw aan de kop: lessenaarsdak van 4,5 m naar 3,3 m (NAP +8,1 tot +6,9), vensters en een deur.
- Vensters en deuren zijn nissen van 0,12 tot 0,4 m diep met een plafond van minstens 56 graden; lijsten, kroonlijsten en lantaarndaken hebben een onderkant van 49 tot 53 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Dordrecht)): 1882, J.A. van der Kloes, 33 m, 500 m³, torentjes deels afgebroken in 1938, hotel sinds 2007.
- [Rijksmonumentenregister 526400](https://monumentenregister.cultureelerfgoed.nl/monumenten/526400).
- BAG-pand 0505100000025142 (PDOK, 2026-11-06): de hele plattegrond met risalieten en middenvelden.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, goot en kegeldak, torentjes, lantaarn, lift, trappenhuis en de daken van de vleugel.
- Luchtfoto (PDOK, 2026-11-06): kegeldak, spitsen, lift en de daken van de vleugel.
- PDOK-gebouwtegel (2026-11-06): toren als blok met losse pieken, vleugel met zadeldak.
- Foto's op Wikimedia Commons: "Dordrecht - watertoren vooraanzicht 2011-02-06" (zuidwestgevel frontaal: risalieten, middenvelden, vensters, lijsten, torentjes, spitsen, lantaarn, schoorstenen; 51,7 px/m), "Watertoren aan het Wantij - WLM 2011 - ednl" (bovenbouw van het noordwesten: reservoirverdieping, kegeldak, lantaarn in twee geledingen, vormen van de spitsen), "Watertower, Dordrecht (9733967598)" (zuidoostzijde: trappenhuis, vleugel en zadeldakgebouw met topgevel en schoorsteen) en de RCE-foto's van voor de restauratie.

## Geschat en weggelaten

Geschat: de hoogtes van de vensters, lijsten, bogen en deuren uit de frontale foto van de zuidwestgevel, op alle vier de gevels aangenomen; de reservoirverdieping als regelmatige zestienhoek met twee vensters per zijde (op de foto's een veelhoek met twee rijen kleine vensters); de plaats en maat van de torentjes uit de pieken in het AHN en de foto's; de vormen en de toewijzing van de spitsen uit twee foto's, met een hals van de fles van 0,9 m (in het echt slanker) en zonder knop op de naalden, zodat de export ze niet verdikt; de schoorstenen (plaats aan weerszijden van de lantaarn, hoogte uit de foto); de lantaarnmaten uit de foto, geschaald op de AHN-top; de omvang van lift en trappenhuis uit het AHN (het trappenhuis is een open stalen constructie en staat hier gesloten); de vensters van de vleugel en het zadeldakgebouw (alleen de zuidoostzijde staat op een foto).

Weggelaten: de hekwerken rond het terras en de torentjes, de balkons, de regenpijpen, de windvaan, de stijlen en roeden van de vensters, de ronde bogen boven vensters en middenvelden (hier rechte nissen en een schuine aanzet), de consoles onder de kroonlijst, de lisenes van 0,55 m op de vleugel (smaller dan 0,9 m), het traliewerk van de spitsen en het trappenhuis (dunner dan 0,9 m; als dichte vorm weergegeven), de glazen luifel langs de zuidoostgevel en de kleurverdeling (lichte banden in het metselwerk, donkere daken, glas).

## Controle

Eén gesloten NoError-node met genus 0; de doorsnede op 0,5 m is 665 m², gelijk aan het BAG-pand. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 (ondersteuning v2, 45 graden) van een uitsnede van 80 m bevat het model, niet meer het PDOK-pand, en geen ondersteuningsobject (volume gelijk aan de export zonder ondersteuning). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een blok met losse pieken bovenop en een vleugel) aan elke kant de risalieten en middenvelden met vensters, de waterlijst, de kroonlijst, de reservoirverdieping met vensters en kegeldak, de torentjes met spitsen, de schoorstenen en de lantaarn; aan de noordoostkant de lift en het trappenhuis, en bij de vleugel de middenopbouw, de topgevels met schoorsteen en de vensters.

Controle-URL: http://localhost:3000/kaart/51.81544/4.68477/200/1x1/0
