# Janninktoren (Enschede)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-enschede-janninktoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is een prisma met verdiepte vakken, banden en lijsten als lijsten met een onderkant van 45 graden, vensters en rondbogen als nissen, de topgevels als convexe omhullende van hun omtrek en het mansardedak als omhullende van de dakvoet en het platte dak; de rest van het fabrieksgebouw bestaat uit de dakvlakken van de 3D BAG.

De Janninktoren uit 1900 (Wikipedia, ontwerp H. Reijgers) hield het bluswater voor de sprinklerinstallatie van de spinnerij Gebr. Jannink & Zonen aan de Haaksbergerstraat; hoogte en inhoud van het reservoir zijn niet bekend. Het fabriekscomplex is rijksmonument 15299 (Haaksbergerstraat 147) en is nu een woon- en werkgebouw; de RCE noemt de toren "trappenhuis annex sprinklertoren". Het is een rechthoekige bakstenen toren in de straatgevel van de spinnerij: smal aan de straat, diep naar achteren, met hoekpenanten en lisenen, natuurstenen banden, vensters onder boogjes en in de brede zijgevels grote rondbogen boven een paar vensters. Boven de kroonlijst staan hoekpinakels, vier topgevels met een uurwerk of rozetvenster en een steil leien mansardedak met een plat dak en een smeedijzeren hek.

## Bestanden

- `watertoren-enschede-janninktoren.glb`: twee nodes, `building:watertoren-gevels-topgevels-en-mansardedak` en `building:spinnerij-jannink`, op maaiveld.
- `watertoren-enschede-janninktoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-enschede-janninktoren-1-1000.stl`: alles samen op 1:1000 (het gebouw is 86 × 75 m).

## Oorsprong en oriëntatie

RD-oorsprong [257461.04, 470578.07] (52,21376 N, 6,88647 O), het hart van de toren: de toren is in het AHN-DSM 8,2 m breed langs de straat en 10,7 m diep, met de voorgevel in de rooilijn van het BAG-pand. Maaiveld AHN-DTM op de stoep voor de toren NAP +36,65 (3D BAG-maaiveld van het hele pand 36,31). Lokale +X loopt langs de straatgevel naar het noordoosten (RD-richting 29,14 graden, de lange straatrand van het BAG-pand; `xAxis` [0.87343, 0.48695]), +Y naar de Haaksbergerstraat (noordwest). `groundHeight` 80,19 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de stoep voor de toren, gemeten op 6,5 en 8 m voor het hart (80,19 tot 80,35); de drie `groundSamplePoints` liggen daar op 7 m.

De toren is geen eigen BAG-pand: hij hoort bij pand 0153100000257537 (bouwjaar 1924 in de BAG, 4668 m², 127 verblijfsobjecten), het hele fabrieksgebouw. De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model dat pand en staat de rest ervan als tweede node in de GLB. De schoorsteen (pand 0153100000215066) en de panden ernaast blijven van PDOK.

## Onderdeel `building:watertoren-gevels-topgevels-en-mansardedak`

Maten als halve breedte vanaf het hart, hoogtes boven maaiveld.

- Romp: 4,1 × 5,33 m (8,2 × 10,66 m) van -0,3 tot 22,3 m. Hoekpenanten van 0,9 m en lisenen van 0,6 m (brede gevels: zijvak 2,15, middenvak 3,36; smalle gevels: twee vakken van 2,9 m), de vakken 0,2 m verdiept tot 21,0 m met een plafond van 45 graden; aan de straat vanaf 0,5 m, aan de zijgevels pas boven het dak van de vleugel ernaast (zuidwest 10,1, noordoost 15,4, achter 15,6 m), zodat er geen holtes tussen toren en fabriek ontstaan.
- Vier natuurstenen banden van 0,3 m (4,1, 8,2, 12,3 en 16,3 m), 0,08 m uit de gevel met een onderkant van 45 graden; waar een vleugel tegen de toren staat, vallen ze weg.
- Vensters als rondboognis van 0,9 m (0,3 m diep, plafond 63 graden) per vak en per geleding: 5,3-6,8, 9,4-10,9, 13,4-14,9 en 17,0-18,6 m (aanzet). In de brede zijgevels in de bovenste twee geledingen in het middenvak een verdiepte rondboog van 3,0 m (aanzet 14,05 en 19,0 m) met daarin twee vensters van 1,1 m. Aan de straat twee deuren van 1,3 m tot 3,0 m (0,4 m diep).
- Kroonlijst van 21,8 tot 22,3 m, 0,3 m uit (onderkant 45 graden). Hoekpinakels van 0,9 m tot 23,25 m met een kap die 0,1 m uitsteekt.
- Topgevels in het midden van elke gevel, 2,6 m diep het dak in: smal (straat en achter) 3,4 m breed met een ronde kop (halfrond op 24,3 tot 26,0 m) en een rond venster of uurwerk van 1,5 m, breed (zijgevels) 5,6 m met schouders onder 45 graden op 23,6-24,1 m, een segmentboog tot 26,0 m en een rozetvenster van 1,7 m; de ronde vensters als nis van 0,25 m met een plafond van 63 graden. Op elke top een pinakel van 0,9 m tot 27,0 m.
- Mansardedak van de dakvoet (3,9 × 5,13 op 22,25 m) naar een plat dak van 1,4 × 2,63 m (2,8 × 5,26 m) op 28,75 m, circa 69 graden.

## Onderdeel `building:spinnerij-jannink`

De rest van BAG-pand 0153100000257537 uit de 3D BAG (LoD2.2, CC BY 4.0): 19 dakvlakken als prisma's vanaf de onderkant onder hun eigen dakvlak (kleinste kwadraten door de hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen; binnenringen blijven open. De acht dakvlakken van de toren in de 3D BAG staan er niet in; de stroken die ze naast de toren beslaan krijgen de dakhoogte van de vleugel ernaast (zuidwest 10,1, achter 15,6, noordoost 15,4 m). De toren is eruit gesneden; toren en fabriek raken elkaar alleen. Hierin zitten de lagere zuidwestvleugel (10,1 tot 12,6 m), de hoge noordoostvleugel met de sheddaken (15,4 tot 17,05 m) en de lage delen op de binnenplaats.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Enschede_Janninktoren)): 1900, H. Reijgers, sprinklerinstallatie van de spinnerij Jannink, rijksmonument; hoogte en inhoud onbekend.
- [Rijksmonumentenregister 15299](https://monumentenregister.cultureelerfgoed.nl/monumenten/15299): fabriekscomplex Jannink, Haaksbergerstraat 147.
- BAG-pand 0153100000257537 (PDOK, 2026-11-06): de straatrand (rooilijn en richting) en de omtrek van het fabrieksgebouw.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +36,65 voor de toren; toren x -4,25 tot 4,0 en y -5,6 tot 5,6 inclusief de kroonlijst; rand en dakvoet NAP +58,6 tot +59,7 (22,0 tot 23,0 m); topgevels tot NAP +62,5 (25,8 tot 26,0 m) aan alle vier de kanten; plat dak NAP +65,4 (28,75 m), x -0,75 tot 1,75, y -2,75 tot 2,75; vleugels ernaast 10,1 en 15,4 tot 16,3 m. Luchtfoto: rechthoekig dak met het platte deel en vier topgevels.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0153100000257537, LoD2.2-dakvlakken, opgehaald 2026-11-06 (plat dak 28,71 tot 28,75 m).
- Foto's op Wikimedia Commons: "Overzicht voorgevel met trappenhuis annex sprinklertoren - Enschede - 20351267 - RCE" (vanaf de straat in het zuidwesten: de smalle straatgevel met deuren en de brede zuidwestgevel boven de lage vleugel; schaal circa 45 px/m op 1280 px bij de westhoek, verankerd op de kroonlijst: banden, vensters, rondbogen, kroonlijst), "- 20351730 -" (de toren in de voorgevel), "Watertoren jannink 1900" (topgevels met schouders, rozetvensters, pinakels, mansardedak met hek), "RM15299 - Enschede - Haaksbergerstraat 147 (1)" en "Aerial - Fabriekscomplex Jannink (6929512021)" (uurwerk, de toren in het complex).

## Geschat en weggelaten

Geschat: de hoogtes van de banden, vensters en rondbogen uit één schuine foto met een schaal op de kroonlijst (onzekerheid circa een halve meter), en een regelmatige indeling van vier geledingen ook waar de foto's ze niet laten zien (de lage delen van de zij- en achtergevels zitten achter de vleugels); de breedtes van penanten, lisenen en vakken en de diepte van de vakken (0,2 m); de maten van de deuren; de breedtes en vormen van de topgevels (foto) en hun hoogte (AHN); dat de twee brede topgevels een rozetvenster en de smalle een uurwerk of rozetvenster hebben (beide als dezelfde ronde nis); de pinakels op de hoeken en de topgevels (0,9 m, in het echt slanker); de dakvoet en de helling van het mansardedak (één vlak van circa 69 graden); het platte dak symmetrisch om het hart (het AHN legt het 0,5 m naar het noordoosten); de dakhoogtes van de stroken naast de toren.

Weggelaten: het smeedijzeren hek op het platte dak (open), de boogjes en sluitstenen boven de vensters en de consoles en tandjes onder de kroonlijst (kleiner dan 0,9 m), de regenpijpen, de stalen steiger op het dak van de zuidwestvleugel, en de gevelindeling van het fabrieksgebouw (pilasters, vensters, de tandlijst onder de dakrand: de 3D BAG geeft alleen de massa, net als PDOK).

## Controle

Twee gesloten NoError-nodes met genus 0, die elkaar alleen raken. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: banden, kroonlijst en pinakelkappen onder 45 graden, vakken met een plafond van 45 graden, vensters, rondbogen en ronde vensters met een plafond van 63 graden, topgevels en mansardedak verjongend, en de dakvlakken van de 3D BAG staan op de grond. Een 1:1000-export van 120 × 120 m rond het pand bevat beide onderdelen, zonder het PDOK-pand; de voet van de toren staat 0,1 m in het terrein. Niet gecontroleerd op de kaart (geen dev-server in deze sessie). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een blok met een grove, scheve kap tot circa 29 m) de hoekpenanten, lisenen en vakken, de banden, vensters, deuren en rondbogen, de kroonlijst, de hoekpinakels, de vier topgevels met ronde vensters en pinakels en het regelmatige mansardedak met plat dak.

Controle-URL: http://localhost:3000/kaart/52.21374/6.88632/200/1x1/0
