# Watertoren Ouderkerk aan de Amstel (Ouderkerk aan de Amstel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-ouderkerk-aan-de-amstel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de romp is een licht verjongend rond prisma, uitkraging, ombouwing, overstek en dak zijn achthoekige prisma's en convexe omhullenden (acht vlakken, graten op de hoeken), de werkplaats is een geëxtrudeerd dwarsprofiel en de noordvleugel een prisma afgesneden door twee dakvlakken.

De watertoren van de voormalige buskruitfabriek De Oude Molen (De Oude Molen 1, gemeente Amstelveen) is in 1895 gebouwd (rijksmonument 511967, onderdeel van complex 511966). Volgens het register heeft hij een ronde bakstenen romp in koppenverband van circa twintig meter met gevelopeningen op verschillende hoogtes en op twee niveaus hardstenen consoles. De bovenbouw is een hoogreservoir in een achthoekige houten ombouwing onder een achtzijdig puntdak met flauwe dakvlakken dat over de ombouwing uitkraagt. Aan de noordzijde loopt een doorgang naar het laboratoriumgebouw, aan de zuidzijde naar de glazen corridor uit de jaren negentig.

## Bestanden

- `watertoren-ouderkerk-aan-de-amstel.glb`: drie nodes, `building:ronde-toren-achtkante-ombouwing-en-dak`, `building:werkplaats-aanbouw-en-hals` en `building:glazen-gang-en-noordvleugel`; de twee laatste zijn met de toren afgetrokken, zodat ze niet overlappen.
- `watertoren-ouderkerk-aan-de-amstel.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en de twee vervangen BAG-panden.
- `watertoren-ouderkerk-aan-de-amstel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [121076.93, 478595.80] (52,29430 N, 4,88995 O), het hart van de ronde toren: cirkelfit op de boog van BAG-pand 0362100001108621, straal 2,365 m. Maaiveld AHN-DTM NAP -0,85 rond de toren. Lokale +X is de lengteas van de werkplaats en de aanbouw: hun BAG-gevels staan alle vier op RD -6,29 graden (`xAxis` [0.99398, -0.10956]); de achthoekige ombouwing en het dak staan met hun vlakken langs dezelfde assen (graten op de luchtfoto). +Y wijst ongeveer naar het noorden.

De toren hoort in de BAG bij pand 0362100001108621, samen met de aanbouw ten zuiden ervan en de werkplaats met zadeldak; die zitten dus in het model. De noordkap van de ronde plattegrond valt in pand 0362100001108623 (glazen gang en noordvleugel), en de PDOK-reconstructie van dat pand heeft daardoor een wand tot 17,5 m op 4 tot 5 m ten noorden van het hart, buiten het dak van de toren. Daarom vervangt het model ook dat pand. De andere buurpanden (0362100001108620, -8622) raken de toren niet boven hun eigen hoogte.

`groundHeight` 42,13 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vijf `groundSamplePoints`, punten op open terrein rond de gebouwen (42,13 tot 42,36). Zonder die punten zou de bemonstering op de straal van de hele voetafdruk (circa 30 m) de sloot ten westen raken (41,1).

## Onderdeel `building:ronde-toren-achtkante-ombouwing-en-dak`

Hoogtes boven maaiveld; achthoeken als apothema (hart tot vlak).

- Romp: straal 2,365 m aan de voet (BAG), licht verjongend tot 2,29 m op 12,1 m.
- Nissen van 0,3 m diep: een venster van 1,1 × 2,2 m op de begane grond aan de westkant; vensters van 0,8 m op 9,7 tot 11,0 m (west en oost), op 5,5 tot 6,9 m (zuidwest), op 9,3 tot 10,6 m (zuidoost) en op 7,4 tot 8,7 m (noordwest, boven de glazen gang); de deur naar het voormalige bordes van 0,9 m op 9,8 tot 11,5 m (zuidwest).
- Uitkraging van rond naar achtkant van 12,1 tot 12,6 m onder 45 graden, bakstenen achtkante rand 2,52 m tot 13,2 m.
- Houten ombouwing 2,4 m (4,8 m over de vlakken) van 13,2 tot 15,95 m, met in elk vlak lamellen als nis van 1,3 m breed op 14,85 tot 15,5 m.
- Overstek met een onderkant onder 45 graden tot de dakrand van 3,25 m (6,5 m over de vlakken, AHN) op 16,9 m, boeiboord tot 17,27 m.
- Achtzijdig dak met helling 0,5 (27 graden, AHN-profiel) tot 18,9 m (NAP +18,05).

## Onderdeel `building:werkplaats-aanbouw-en-hals`

Rest van BAG-pand 0362100001108621; plattegronden uit de BAG in het modelstelsel.

- Werkplaats u -10,52 tot 4,62 (15,1 m), v -15,87 tot -9,52 (6,35 m): gevels tot de goot op 5,04 m, overstek van 0,4 m met een onderkant onder 45 graden, dakvlakken met helling 1,2 (50 graden, AHN) tot de nok op 8,85 m (NAP +8,0). Schoorsteen op de nok bij de oostgevel tot 9,8 m.
- Nissen: zuidgevel drie smalle vensters (0,8 m), een deur en drie brede vensters (1,2 m); oostgevel deur, twee vensters en een deur op de verdieping (de stalen trap ervoor is weggelaten); westgevel twee vensters en een venster op de verdieping; noordgevel twee vensters naast de aanbouw.
- Aanbouw u -4,0 tot 4,62, v -9,75 tot -5,4, plat dak op 3,85 m (AHN NAP +3,0), met vensters en een deur als nis en een koelinstallatie van 5,8 × 1,4 m tot 5,9 m (AHN).
- Hals naar de toren u -1,84 tot 1,72 tot 4,25 m (AHN NAP +3,4).

## Onderdeel `building:glazen-gang-en-noordvleugel`

BAG-pand 0362100001108623, in een eigen stelsel langs de BAG-gevels (RD +4,2 graden) en daarna gedraaid.

- Glazen gang u -10,2 tot 26,95, v 3,95 tot 6,5, plat dak op 5,2 m (AHN NAP +4,35); in het westelijke deel verdiepte glasvlakken tussen stijlen van 0,4 m. Lagere strook langs de zuidrand tot 4,0 m en een westelijke uitbouw tot 3,6 m.
- Noordvleugel v 6,3 tot 14,23, zadeldak met helling 0,87 (41 graden) tot de nok op v 10,35 op 7,75 m (AHN NAP +6,9); twaalf lisenen van 0,43 × 0,22 m op de noordgevel uit de BAG-contour; twee schoorstenen of uitbouwen op het zuidvlak tot 6,3 en 6,0 m (AHN-pieken).
- Doorgang van de gang naar de toren tot 5,2 m.

## Bronnen en maten

- [Rijksmonumentenregister 511967](https://monumentenregister.cultureelerfgoed.nl/monumenten/511967): bouwjaar, ronde romp, consoles, achthoekige houten ombouwing, achtzijdig uitkragend dak, doorgangen.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Ouderkerk_aan_de_Amstel)): bouwjaar en ligging.
- BAG-panden 0362100001108621 en 0362100001108623 (PDOK, 2026-11-04): romp, plattegronden en stand.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP -0,85; dak van de toren (rand op 3,25 m, NAP +16,4 tot +17,05 op 2 m, top +18,05, makelaar tot +18,6); dakvlakken van de werkplaats en de noordvleugel in een stelsel langs hun gevels; aanbouw, hals, koelinstallatie en glazen gang. Luchtfoto voor de stand van de achthoek en de koelinstallatie.
- Foto's op Wikimedia Commons: "Exterieur DETAIL WATERTOREN" (RCE 20301549: uitkraging, ombouwing, overstek, deur en vensters), "Exterieur WATERTOREN" (RCE 20301548), "Laboratorium en watertoren KNSF" en "Salpeter- en Katoenmagazijn en watertoren" (WLM 2011: geledingen, lamellen, oostgevel en zuidgevel van de werkplaats), "Ouderkerk aan de Amstel - Kruitfabriek De Oude Molen" en "... - Watertoren Kruitfabriek De Oude Molen" (rompbreedte als schaal, glazen gang), en de overzichtsfoto's van de RCE.

## Geschat en weggelaten

Geschat: de hoogtes van de uitkraging, de rand en de onderkant van de ombouwing uit foto's met de rompbreedte en de dakrand in het AHN als schaal (onzekerheid circa een halve meter); de verjonging van de romp; de diepte van de overstek (de onderkant is een schuine kraag in plaats van een vlak plafond met klossen); plaats en maat van de vensters en de deur in de romp (de foto's tonen ze van een paar kanten); de lamellen als één nis per vlak; de vensters en deuren van de werkplaats (de westgevel en de noordgevel zonder goede foto); de koelinstallatie als één blok; de noordvleugel en de glazen gang als eenvoudige blokken met zadeldak op de AHN-hoogtes.

Weggelaten: de makelaar met windvaan op het dak (dunner dan 0,9 m), de hardstenen consoles op twee niveaus (circa 0,3 m), de hoeklijsten van de houten ombouwing, de regenpijpen, de stalen trap tegen de oostgevel van de werkplaats, de overstek van de werkplaats langs de topgevels (zou zonder steun boven de gevel hangen), de dakramen (vlak in het dakvlak) en de luifel bij de westelijke ingang van de glazen gang. Het bordes en de ladder op oude foto's bestaan niet meer.

## Controle

Drie gesloten NoError-nodes, elk één component met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume vrijwel niet (minder dan 0,0005 %): uitkraging en overstek onder 45 graden, nissen met een plafond van 56 graden, lamellen 68 graden, goten van de werkplaats met een onderkant van 45 graden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export zonder ondersteuningsobject; de voet staat 0,15 tot 0,35 m in het PDOK-terrein rond de toren en de PDOK-reconstructies van beide panden zijn verborgen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een vlakke kap, samengegroeid met een wand tot 17,5 m uit het noordelijke pand) de achtkante uitkraging en ombouwing met lamellen, het overstekende achtzijdige dak, de vensternissen in de romp, de werkplaats met vensters, deuren en schoorsteen, de aanbouw met koelinstallatie, en de glazen gang met verdiepte glasvlakken en de noordvleugel met lisenen en schoorstenen.

Controle-URL: http://localhost:3000/kaart/52.29430/4.88995/200/1x1/0
