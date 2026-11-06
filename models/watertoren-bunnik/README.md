# Watertoren Bunnik (Bunnik)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bunnik.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is een prisma op de BAG-gevels, het schilddak een piramide uit de dakhelling in het AHN, de aanbouw een lessenaarsdak als planvlak; plint, lijst, vensters, deur en bolletje zijn losse bouwdelen.

De watertoren aan de Watertorenweg, in de polder tussen Bunnik en Werkhoven (ook "watertoren van Werkhoven"), is in 1937 gebouwd, is volgens Wikipedia 43,30 m hoog en heeft een reservoir van 306 m³. Sinds 2008 is hij gemeentelijk monument; hij is nu woning, horeca en atelier. Een slanke, bijna vierkante betonnen toren zonder uitkragend reservoir: een roze gepleisterde onderbouw van circa 12 m met een smalle lijst, daarboven een gladde schacht (tot circa 2013 grijs beton, daarna wit gepleisterd) met enkele spleetvensters en een hoog venster op elke gevel vlak onder de goot, en een overstekend schilddak met pannen en een bolletje op de top. Bij de verbouwing kwam in de westgevel een lange vensterstrook. Tegen de westgevel staat een lage aanbouw met een donker (glazen) dak, die in hetzelfde BAG-pand zit.

## Bestanden

- `watertoren-bunnik.glb`: één node `building:watertoren-onderbouw-schacht-schilddak-en-aanbouw`, op maaiveld.
- `watertoren-bunnik.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-bunnik-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [146531.42, 446175.98] (52,00389 N, 5,26387 O), het midden van de vier torenhoeken van BAG-pand 0312100000004667; de top van het dak in het AHN-DSM ligt 0,04 m ernaast. Maaiveld AHN NAP +3,42 (DTM rondom 3,39 tot 3,49, een vlak erf). Lokale +X wijst naar RD-richting 4,63 graden (oost, de ingang), +Y naar 94,63 graden (noord): evenwijdig aan de BAG-gevels. `groundHeight` 46,83 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost op 8 m 46,83, west voorbij de aanbouw op 12 m 46,86, noord 46,90, zuid 46,91).

Het model vervangt BAG-pand 0312100000004667, inclusief de aanbouw aan de westkant (de PDOK-reconstructie van dat pand bevat alleen de toren, een blok met een piramidedak tot NAP +46,2). De buurpanden 0312100000011117 (2013, ten noorden, PDOK tot NAP +7,7, AHN +7 à +8) en 0312100000013607 (2025, ten zuiden) staan los van de toren en kloppen met het AHN.

## Onderdeel `building:watertoren-onderbouw-schacht-schilddak-en-aanbouw`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Toren: 10,65 m (X) × 10,30 m (Y) uit de BAG, tot 37,9 m.
- Plint: 0,08 m voor de gevel tot 0,9 m, met een schuine afdekking.
- Onderbouw: tot de lijst op 11,9 tot 12,15 m (0,12 m uit, onderkant 50 graden). Vensters in twee rijen (4,8–6,4 en 8,0–9,6 m, 1,0 tot 1,4 m breed): west twee per rij, zuid een boven en een onder plus het hoge trappenhuisvenster (1,0 m breed, 4,4–9,6 m), oost twee per rij en de deur (1,1 × 2,3 m, bij de zuidoosthoek), noord twee per rij.
- Schacht: in het westen de vensterstrook van 1,2 m breed in drie delen (12,5–15,6, 16,5–20,0 en 20,9–24,6 m) met daarboven een spleetvenster (26,3–28,0 m); in het zuiden een spleetvenster (14,1–15,7 m); in het oosten een rondboogvenster van 1,0 m (29,0 m tot de kruin op 31,1 m); op elke gevel een hoog venster van 1,2 m onder de goot (35,3–37,2 m). Spleetvensters als nis van 0,4 m breed.
- Schilddak: piramide z = 42,85 − 0,574 · max(|x|, |y|) (29,9 graden, uit het AHN: de vier dakvlakken hebben hellingen van 0,573 tot 0,576 en een gemeenschappelijke top op NAP +46,27), dakrand op 6,05 m van het hart (12,1 m breed, overstek 0,7 tot 0,9 m) op 39,38 m, boeiboord van 0,3 m, en een schuine overstek van de onderkant van het boeiboord naar de gevel op 37,9 m (53 tot 59 graden).
- Bolletje: 0,9 m doorsnede tot 43,3 m (Wikipedia 43,30 m), met een hals van 45 graden in de top.
- Aanbouw: van de westgevel tot X = −10,33 over de hele breedte van de toren (BAG), lessenaarsdak van 2,6 m tegen de toren naar 2,0 m aan de westkant, dakrand van 0,9 m breed tot 2,1 m; de glazen gevels als nissen van 0,2 m (drie in het westen, twee aan elke zijkant).
- Vensters en deur zijn nissen van 0,2 tot 0,35 m diep met een plafond van 63 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Bunnik)): 1937, 43,30 m, 306 m³, Watertorenweg, gemeentelijk monument sinds 2008.
- BAG-pand 0312100000004667 (PDOK, 2026-11-06): toren van 10,65 × 10,30 m op 4,63 graden, aanbouw van 5,0 m aan de westkant.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, dakhelling, top en dakrand van het schilddak, hoogte van de aanbouw (NAP +4,8 tot +6,0, glas).
- Luchtfoto (PDOK, 2026-11-06): schilddak met pannen, donker dak van de aanbouw.
- PDOK-gebouwtegel (2026-11-06): blok met een piramidedak, zonder overstek en zonder de aanbouw.
- BGT-waterdeel: de waterloop ten westzuidwesten van de toren, waarlangs de meeste foto's genomen zijn (richting van de gevels op de foto's).
- Foto's op Wikimedia Commons: "Old watertower with nice reflections near Werkhoven - panoramio" (2014, west- en zuidgevel; geledingen en vensters, 25,2 px/m, op de AHN-dakrand gezet), "Werkhoven, watertoren foto6 2012-05-29 10.54" (2012, dezelfde richting, voor de vensterstrook; 36 px/m), "Werkhoven Watertoren 8896" (zuid- en oostgevel, rondboogvenster, deur), "WatertorenWerkhoven", "Watertoren Werkhoven sloot", "Watertoren Werkhoven landschap", "Watertoren Werkhoven" en "Werkhoven." (silhouet, dak, bolletje, wit gepleisterd na de verbouwing).

## Geschat en weggelaten

Geschat: alle hoogtes van de geveldelen (plint, lijst, vensters, deur) uit twee foto's vanuit het westzuidwesten, geschaald op de AHN-dakrand (op circa 0,3 tot 0,5 m nauwkeurig); de plaats van de vensters langs de gevel; de oost- en zuidgevel uit een sterk perspectivische foto (het rondboogvenster op circa 30 m en de deur bij de zuidoosthoek op circa 1 m nauwkeurig); de noordgevel (op geen foto te zien; twee vensters per rij aangenomen, zoals in het zuiden en oosten); de dikte van het boeiboord en de helling van de overstek (in het echt een vlakke onderkant, hier 53 tot 59 graden zodat hij zonder steun print); de hoge vensters onder de goot iets lager (35,3–37,2 m in plaats van circa 36,5–38,7 m) zodat de nis onder de schuine overstek blijft; het lessenaarsdak van de aanbouw (het glas geeft in het DSM een rommelig beeld van NAP +4,4 tot +6,0).

Weggelaten: de kleine ventilatieopeningen onder de goot (circa 0,3 m), de stijlen en roeden van de vensters, de regenpijpen en de ladderbeugels op de hoeken (kleiner dan 0,9 m), de kleurverdeling (roze onderbouw, witte schacht) en het bijgebouw uit 2013 ten noorden en het nieuwe pand uit 2025 ten zuiden (aparte panden).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 van een uitsnede van 80 m bevat het model, niet meer het PDOK-pand, en geen extra opvulling. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een glad blok met een piramidedak zonder overstek) aan elke kant de plint, de vensters, de lijst tussen onderbouw en schacht, het overstekende dak met boeiboord en het bolletje; in het westen ook de vensterstrook en de aanbouw, in het oosten de deur en het rondboogvenster, in het zuiden het trappenhuisvenster.

Controle-URL: http://localhost:3000/kaart/52.00391/5.26385/200/1x1/0
