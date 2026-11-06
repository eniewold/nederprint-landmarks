# Watertoren Bilthoven (Bilthoven)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bilthoven.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, reservoir en dakrand zijn omwentelingsvormen van een radiaal profiel (96 segmenten), de steunberen, het portaal en de blokken convexe omhullenden en blokken, de vensters, de deur en de trapvensters blinde nissen met een schuin plafond.

De watertoren aan de Burgemeester van der Borchlaan werd in 1926-1927 gebouwd naar ontwerp van H.F. Mertens, die er later ook de torens van Soest, Stadskanaal en Oude Pekela op baseerde, naar een idee uit 1912 van Michel de Klerk. Hij is 42,00 m hoog, heeft een reservoir van 300 m³, is sinds 2008 gemeentelijk monument en werd in 2006 door Vitens gerenoveerd; hij is buiten gebruik. Een slanke ronde toren van baksteen met vier steunberen op de diagonalen die in twee treden van het maaiveld tot vlak onder de top lopen. Onderaan een iets bredere voet met vensters en aan de straatzijde een portaal tegen de voet van een steunbeer. Boven een lichte betonnen ring kraagt het reservoir iets uit; het draagt twee banden van uitstekende blokken met kleine vensters ertussen en een derde band vlak onder de betonnen dakrand, die met een opstaande, afgeronde rand een vlak dak omsluit.

## Bestanden

- `watertoren-bilthoven.glb`: één node, `building:watertoren-voet-schacht-steunberen-reservoir-en-dakrand`.
- `watertoren-bilthoven.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en de vervangen BAG-panden.
- `watertoren-bilthoven-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [143477.67, 460403.47] (52,13171 N, 5,21892 O), het hart van het ronde BAG-pand 0310100000657245 (cirkel door 38 punten, straal 4,69 m), op het maaiveld: AHN-DTM NAP +5,2 (5,1 tot 5,26 tussen 6 en 10 m). De steunberen staan in de BAG als vier stompjes van circa 1,7 m breed tot 5,35 m van het hart, op RD-richtingen 40, 129, 220 en 310 graden; drie zijn eigen panden (0310100000657246, -247, -248), de noordoostelijke hoort bij het hoofdpand. Lokale +X wijst naar RD-richting -5 graden (oost), zodat de steunberen op 45 + 90k graden lokaal staan. Het portaal staat tegen de zuidwestelijke steunbeer (lokaal 225 graden), aan de kant van de straat en het toegangspad.

`groundSamplePoints` liggen op 7 m oost, west, noord en zuid; `groundHeight` 48,49 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (48,49 tot 48,61, gemeten 2026-11-06). `groundOffsetMetres` is -0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +5,2).

- Voet: 4,69 m (BAG) tot 4,3 m, schouder van 50 graden naar de schacht. Per veld tussen de steunberen twee vensters van 1,0 m breed van 0,9 tot 2,5 m.
- Schacht: 3,95 m van 4,3 tot 30,9 m.
- Steunberen: vier, binnenste trede 2,4 m breed tot 4,9 m van het hart, voorste trede 1,6 m breed tot 5,35 m. Bovenkant tegen het reservoir op 39,8 m (voorste trede 39,2 m), onder 45 graden naar buiten aflopend. In de voorste trede zes lange nissen van 0,6 m breed en 3 m hoog (trapvensters) van 5,6 tot 34,6 m.
- Portaal: tegen de zuidwestelijke steunbeer, 3,2 m breed tot 5,6 m van het hart en 3,6 m hoog, met een smallere opstand tot 4,0 m; deur van 1,1 m breed tot 2,4 m als nis.
- Betonnen ring: 4,42 m van 30,9 tot 31,35 m, onderkant van 50 graden vanaf de schacht.
- Reservoir: 4,28 m van 31,35 m tot de dakrand.
- Banden: twintig blokken van 0,8 m breed en 0,6 m hoog die 0,25 m uitsteken, op 34,45, 38,2 en 40,8 m; in de onderste twee banden tussen de blokken een venster van 0,5 bij 0,45 m als nis.
- Dakrand: 4,45 m van 41,75 tot 42,15 m (onderkant 50 graden), afgerond tot de opstaande rand op 42,5 m (AHN tot NAP +47,9), vlak dak op 42,3 m (AHN NAP +47,5).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Bilthoven)): 1926-1927, H.F. Mertens, 42,00 m, 300 m³, Burgemeester van der Borchlaan, Vitens, renovatie 2006, gemeentelijk monument 2008.
- BAG-panden 0310100000657245 tot -248 (PDOK, 2026-11-06): ronde voetafdruk (straal 4,69 m) en de vier steunbeerstompjes.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +5,2, vlak dak NAP +47,5 (188 cellen, straal 3,9 à 4,0 m), rand tot +47,9.
- PDOK-luchtfoto: dakrand en richting van de steunberen.
- Foto's op Wikimedia Commons: "Bakstenen watertoren met vier steunberen - Bilthoven - 20370893 - RCE.jpg" (1998, gepleisterd, perspectiefgecorrigeerd; 41,8 px/m tussen maaiveld en dakrand: voet tot 4,3 m, ring op 30,9 m, top van de steunberen op 39,2 m, silhouet 8,4 m breed), "Watertoren-bilthoven-2012.jpg" en "Watertoren Bilthoven.jpg" (banden van blokken en vensters, steunberen in twee treden met nissen, dakrand, voet met vensters en portaal).

## Geschat en weggelaten

Geschat: de stralen van schacht (3,95 m) en reservoir (4,28 m) uit de silhouetbreedte op de RCE-foto en de omvang van het vlakke dak in het AHN (onzekerheid circa 0,2 m); de hoogtes van voet, ring en steunberen uit één foto met een vaste schaal (circa een halve meter); de hoogtes van de drie banden uit hun verhouding op de kleurenfoto's; de breedtes van de treden van de steunberen (de BAG geeft alleen de buitenmaat); aantal en plaats van de blokken (twintig per band) en de trapvensters; het portaal (maten en plaats van de deur alleen van schuine foto's, het staat niet in BAG of AHN).

Weggelaten: de antennemast op het dak (geen deel van het monument, dunner dan 0,9 m), de vensternissen in de bovenste band (de strook metselwerk tot de dakrand is te dun; de export vulde de nissen op), het hekwerk rond het terrein en de trapjes bij het portaal.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (120 × 120 m) bevat het model zonder ondersteuningsobject en zonder de PDOK-panden 0310100000657245 tot -248. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde zuil met een plat dak) de bredere voet met vensters en portaal, de vier getrapte steunberen met nissen, de betonnen ring, het bredere reservoir met drie banden van blokken en vensters en de dakrand met opstaande rand.

Controle-URL: http://localhost:3000/kaart/52.13171/5.21892/200/1x1/0
