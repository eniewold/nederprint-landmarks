# Nieuwe watertoren (Zevenbergen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zevenbergen-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een cilinder, de dakrand een kraag onder 45 graden, het dak één kegel, de aanbouw bestaat uit prisma's op de BAG-contour en rechthoekige blokken; vensters en lichtopeningen zijn nissen.

De watertoren aan De Meeren / Galgenweg in Zevenbergen is in 1947 gebouwd naar ontwerp van C.H. de Bever, ter vervanging van de toren die op 31 oktober 1944 werd opgeblazen: 39,6 m hoog met een reservoir van 600 m³. Een ronde bakstenen schacht met bovenin een ring van ronde lichtopeningen, daaronder acht hoge rondboogvensters en op de vier hoofdassen drie losse vensters boven elkaar, onder een licht uitkragende rand en een vlak koperen kegeldak met een kapje. Rond 2013 tot 2020 is de toren tot vijf appartementen verbouwd, met een aanbouw van twee lagen die naar de kruising met de Galgenweg oploopt tot drie. Toren en aanbouw zijn samen één BAG-pand.

## Bestanden

- `watertoren-zevenbergen-nieuwe-watertoren.glb`: één node `building:ronde-toren-kegeldak-en-aanbouw`, op het maaiveld.
- `watertoren-zevenbergen-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-zevenbergen-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [100340.65, 406641.07], het middelpunt van de cirkel door de BAG-contour van pand 1709100000045336 (r 6,49 m; het dak in het AHN5-DSM ligt er concentrisch op), op maaiveld NAP +1,3 (AHN5-DTM ten noorden en westen van de toren 1,3 tot 1,4). Lokale +X loopt langs de gevels van de aanbouw, 22,64 graden linksom vanaf RD-oost (`xAxis` [0,9229, 0,3849]). De maaiveldpunten liggen alleen ten noorden en westen van de toren; ten oosten zakt het maaiveld naar NAP +0,8, daarom staat `groundOffsetMetres` op -0,2. `groundHeight` 45,25 is NAP +1,3 plus de NLGEO2018-geoïdehoogte (43,95 m, geïnterpoleerd uit de watertorens van Etten-Leur, Stampersgat, Hooge Zwaluwe en Roosendaal; PDOK-terrein op het noordelijke punt 45,28). Het model vervangt het pand, zodat het PDOK-blok van toren en aanbouw verdwijnt.

## Onderdeel `building:ronde-toren-kegeldak-en-aanbouw`

- Schacht: cilinder van 13,0 m doorsnede tot 35,8 m.
- Dakrand: kraagt onder 45 graden uit tot 13,7 m doorsnede op 36,15 m, recht tot 36,6 m (AHN dakrand NAP +37,9).
- Dak: kegel van 25 graden tot 39,8 m (AHN NAP +38,3 op r 6, +39,2 op r 4, +40,2 op r 2), met een kapje van 1,0 m breed tot 40,7 m (AHN-top NAP +42,0).
- Zestien ronde lichtopeningen onder de dakrand (van 34,05 m tot een spitse top op 35,0 m), acht hoge rondboogvensters van 28,9 tot 32,6 m en op de vier hoofdassen drie losse vensters (8,3, 15,8 en 23,0 m), alle als nis van 0,9 m breed en 0,3 m diep met een spitse top onder 50 graden. De hoofdas ligt op de ingang onder het glazen portaal (8 graden vanaf +X).
- Aanbouw van twee lagen tot 7,35 m (NAP +8,65) op de BAG-contour om de zuid- en westzijde en langs de noordkant van de oostvleugel.
- Derde laag tot 10,4 m tegen de toren (x 5,0 tot 12,5) en tot 10,75 m naar de Galgenweg (x 12,5 tot 23,2, met de uitbouw tot y -11,7).
- Lage stroken: zuidwest tot 4,05 m (NAP +5,35), oostkop tot 4,2 m (NAP +5,5).
- Glazen portaal voor de ingang tot 5,7 m (NAP +7,0), 3,2 bij 2,1 m.
- Vensters in de zuid- en noordgevels van de aanbouw: nissen van 1,6 bij 1,8 m, 0,3 m diep, per laag, met een plafond onder 56 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Zevenbergen)): bouwjaar, ontwerper, 39,6 m, 600 m³.
- Bestemmingsplan Watertoren Zevenbergen (NL.IMRO.1709.WatertorenZvb-0401, ruimtelijkeplannen.nl, 2013): geschiedenis, de aanbouw (twee naar drie lagen, 8 en 11,5 m), het glazen portaal bij de bestaande ingang, de situatie en bestekstekening B-1 "bestaand" (vier gevels, doorsnede, dakaanzicht) voor de vensters, de lichtopeningen en het kegeldak.
- AHN5 DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld NAP +0,8 tot +1,9, dakrand +37,9, kegel, top +42,0, de dakhoogtes van de aanbouw (+8,65, +11,7, +12,05, +5,35, +5,5 en het portaal +7,0).
- BAG-pand 1709100000045336 (bouwjaar 1947, woonfunctie, vijf verblijfsobjecten) en luchtfoto (PDOK): de cirkel van de schacht, de contour van de aanbouw en de dakrand (13,6 tot 13,8 m).
- Foto "Zevenbergen Watertoren 5958.JPG" (2007, Willemjans, Wikimedia Commons, CC BY-SA 3.0): de oostzijde vóór de verbouwing met vensters, lichtopeningen, dakrand en ingang.

## Geschat en weggelaten

Geschat: de hoogtes van de vensters en lichtopeningen (bestekstekening, geschaald op de dakrand), hun stand rond de toren (hoofdas op het portaal, de lichtopeningen om de 22,5 graden en de hoge vensters daartussen), de breedte (0,9 m, in werkelijkheid circa 0,6 m) en de diepte van de nissen, de kraag onder de dakrand (0,35 m), het kapje, de geoïdehoogte (geïnterpoleerd) en het vensterraster van de aanbouw (naar het indicatieve gevelaanzicht in het bestemmingsplan, niet gemeten). De grenzen tussen de hoogtes van de aanbouw komen uit het DSM (0,5 m) en kunnen een halve meter afwijken.

Weggelaten: de kleine vensters op de begane grond van de toren en de ingang met boog (achter de aanbouw en het portaal), de leuningen, dakterrassen en installaties op de aanbouw (kleiner dan 0,9 m boven het dak), de balkons en de rondboogvorm van de vensters (kleiner dan 0,9 m), de baksteenlagen in de dakrand en het losse bijgebouw van 2020 ten westen (eigen BAG-pand, blijft van PDOK).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan een tienduizendste (gemeten 1,0000000003): de dakrand staat onder 45 graden, de nissen hebben een spitse top onder 50 of een plafond onder 56 graden en de kegel is convex. In een tijdelijke exporttest op een uitsnede van 90 m rond de toren kwam het model als één deel op het PDOK-maaiveld. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achtkante kolom met een gebroken puntdak en blokken voor de aanbouw) de ronde schacht met vensters en lichtopeningen, de uitkragende dakrand, het vlakke kegeldak met kapje, de derde laag en het portaal, en de vensters in de aanbouw.

Controle-URL: http://localhost:3000/kaart/51.64593/4.59742/200/1x1/0
