# Watertoren Vogelenzang (Bennebroek)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-bennebroek-watertoren-vogelenzang.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een prisma, consoles, hoekconsoles, kraag en dakplaat zijn convexe bouwdelen met schuine onderkanten, het tentdak bestaat uit vlakken met een knik, en de rest van het complex bestaat uit prisma's onder de dakvlakken van de 3D BAG.

De watertoren staat op het terrein van de voormalige psychiatrische inrichting Vogelenzang (nu GGZ inGeest) en is in 1927 gebouwd naar ontwerp van A.T. Kraan (sr), in een vorm van de Amsterdamse School; reservoir van 70 m³, gemeentelijk monument van Bloemendaal. Een vierkante bakstenen schacht met per gevel twee verdiepte vensterstroken, bovenaan betonnen consoles en uitgebouwde hoekconsoles onder een rondom overstekende betonnen dakplaat met hekwerk, en daarop een tentdak met een steile, geknikte voet en een lange lage dakkapel per zijde. De toren staat midden in het complex van de Centrale Keuken met de brandweergarage.

## Bestanden

- `watertoren-bennebroek-watertoren-vogelenzang.glb`: twee nodes, `building:schacht-consoles-dakplaat-en-tentdak` (de toren) en `building:centrale-keuken` (de rest van het pand).
- `watertoren-bennebroek-watertoren-vogelenzang.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-bennebroek-watertoren-vogelenzang-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [100474.5, 481774.45] (52,32121 N, 4,58746 O), het hart van de schacht: tussen de BAG-gevels van de toren en het midden van de dakplaat en de mast in het AHN-DSM (verschil 0,2 m). Het complex en de toren staan 7 graden linksom op RD (BAG-gevels 6,9 tot 7,7 graden): lokale +X is de normaal van de oostgevel van de toren (`xAxis` [0.99255, 0.12187]), +Y die van de noordgevel.

Lokaal z = 0 ligt op NAP +1,95: het maaiveld van de 3D BAG voor dit pand en de vloer van de PDOK-reconstructie (ellipsoïdisch 45,07; PDOK ligt hier 43,12 m boven NAP). Het AHN-DTM rond het complex loopt van NAP +1,2 (oostkant) via +2,3 (voor de noordgevel van de toren) tot +3,9 (voorplein); het PDOK-terrein heeft voor de noordgevel bovendien een pad op 46,9 (1,5 m boven het AHN). Het model staat daarom net als het PDOK-pand op de vloer en zakt aan de hogere kanten in het terrein; de onderkant ligt 1 m lager (z = -1), zodat het ook boven de laagste PDOK-terreinpunten (44,4) niet zweeft. De `groundSamplePoints` liggen in de inham aan de oostkant, waar het PDOK-terrein op de hoogte van de vloer ligt (45,10 tot 45,21); `groundHeight` 45,1 is daar de laagste PDOK-terreinhoogte, `groundOffsetMetres` 0. Een punt voor de noordgevel zou het hele complex 1,8 m optillen.

Het model vervangt BAG-pand 0377100000002980. Dat pand is het hele complex (1500 m²), dus de toren alleen kan niet: de rest komt als tweede node uit de 3D BAG. Geen buurpand raakt de toren (het dichtstbijzijnde, 0377100000000106, ligt 30 m noordelijker).

## Onderdeel `building:schacht-consoles-dakplaat-en-tentdak`

- Schacht van 6,6 m (BAG: de vrije noordgevel van 6,61 m) van -1 tot de dakplaat.
- Per gevel twee verdiepte vensterstroken van 1,0 m breed en 0,3 m diep, met het hart op 1,3 m uit het midden van de gevel, van 8,0 m (boven de daken van het complex) tot 0,6 m onder de consoles, met een plafond onder 56 graden.
- Per gevel twee consoles van 1,7 m breed, 0,35 m uit de gevel, van 21,05 m tot de dakplaat, onderkant onder 50 graden.
- Vier hoekconsoles: van de schacht op 20,45 m (0,45 m langs elke gevel vanaf de hoek) verlopend tot de rand van de dakplaat (21 graden uit het lood).
- Dakplaat van 8,3 m, 0,35 m dik, bovenkant 23,05 m (AHN NAP +25,0), op een kraag van 45 graden vanaf de schacht.
- Tentdak: steile voet (69 graden) van de schacht tot de knik op 0,75 m binnen de gevel op 25,05 m, dan 46,6 graden tot de top op 27,75 m (AHN NAP +29,7).
- Per zijde een dakkapel van 2,8 m breed met de voorgevel recht boven de knik, 0,9 m hoog, plat dak tot in het dakvlak.

## Onderdeel `building:centrale-keuken`

De 45 LoD2.2-dakvlakken van 3D BAG-pand NL.IMBAG.Pand.0377100000002980 als prisma's van -1 tot hun eigen dakvlak (kleinste-kwadratenvlak door de hoekpunten, 2 cm verbreed), zoals bij `generate-watertoren-kweekschool-maastricht.mjs`: de keukenvleugels en de brandweergarage met schilddaken en dakruiters aan de voorkant (tot 14,85 m), de platte tussenleden (5,17 m) en de hal ten oosten van de toren. De negen dakvlakken van de toren liggen als plat dak op 5,17 m (NAP +7,12, het dak rondom de toren), en de schacht is eruit gesneden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_Vogelenzang): bouwjaar, ontwerper, reservoir, gemeentelijk monument, coördinaten.
- BAG-pand 0377100000002980 (PDOK, 2026-11-04): de gevels van de toren in de contour van het complex, stand van 7 graden.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): dakplaat NAP +25,0 (8,3 tot 8,4 m breed), tentdak 45 graden tot de top NAP +29,7, mast tot +33,3, de knik uit +27,2 op 0,5 m binnen de gevel; maaiveld rond het complex. Luchtfoto voor de plattegrond.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0377100000002980, LoD2.2-dakvlakken, opgehaald 2026-11-04.
- PDOK-gebouwtegel en terreintegels (2026-11-04): vloer van het pand (45,07) en de terreinhoogtes voor `groundSamplePoints` en `groundHeight`.
- Foto's op Wikimedia Commons: RCE-foto 20407250 "Overzicht watertoren en brandweergarage" (frontaal op de zuidgevel: consoles, hoekconsoles, dakplaat 1,24 keer de schacht, tentdak met knik en dakkapel) en "Watertoren-bennebroek.jpg" (schuin op de noord- en westgevel: vensterstroken, consoles, dakkapellen).

## Geschat en weggelaten

Geschat: de breedte van de dakplaat uit de foto (1,24 keer de schacht, past bij het AHN); de knik in het tentdak (foto's: 0,9 tot 1,1 m binnen de gevel, AHN-DSM: 0,5 m; gebruikt 0,75 m); de hoogtes en breedtes van consoles, hoekconsoles en dakkapellen uit de foto's, geschaald op de schacht van 6,6 m; de dakkapellen op alle vier de zijden (op foto's zichtbaar op het zuiden, noorden en westen); de vensterstroken als gelijke nissen op alle vier de gevels, ook waar het complex ervoor staat (daar beginnen ze pas op 8 m). De kraag van 45 graden onder de dakplaat is er in het echt niet (vlakke onderkant met consoles); hij maakt de plaat printbaar. Het hart van de schacht ligt 0,2 m tussen BAG en AHN in.

Weggelaten: de antennemast op de top, het hekwerk op de dakplaat, de regenpijpen en antennekabels langs de gevels en de vensters zelf (kleiner dan 0,9 m), de smalle middenlisene tussen de vensterstroken en de dubbele consoles als losse blokjes (0,3 m; als één console per vensterstrook). Het complex is niet verder gedetailleerd dan de 3D BAG.

## Controle

Twee gesloten NoError-nodes met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,0000000): kraag onder 45, consoles onder 50 graden op het volle gevelvlak, hoekconsoles 21 graden uit het lood, nisplafonds onder 56 graden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 vervangt het model het PDOK-pand, staan toren en complex op dezelfde plek als het PDOK-pand, komt de top op NAP +29,7 en vult de export alleen tot de onderplaat aan; geen onderdeel zweeft boven het terrein. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft de toren tegenover de PDOK-reconstructie (een schacht met een grof, puntig dakblok, zonder overstek) de overstekende dakplaat op de kraag met hoekconsoles en consoles, de vensterstroken, het tentdak met knik en de dakkapellen; het complex is gelijk aan de 3D BAG.

Controle-URL: http://localhost:3000/kaart/52.32121/4.58746/200/1x1/0
