# Poldertoren (Emmeloord)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-emmeloord.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is het omhulsel van twee achthoeken, de lantaarn een geëxtrudeerde achthoek en het tentdak een omhulsel naar de top; vensters en galmgaten zijn nissen.

De Poldertoren is van 1957 tot 1959 gebouwd naar ontwerp van H. van Gent met J.W.H.C. Pot als watertoren met carillon en uitkijkplatform op het centrale plein van Emmeloord, 65,3 m hoog (70,5 m met windvaan), 1850 m³ in drie reservoirs, rijksmonument 532139. Volgens Wikipedia is hij aan de voet 14,0 m en bij het bezoekersplatform 13,4 m breed.

## Bestanden

- `watertoren-emmeloord.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse lantaarnnode zou een voet tot de grondplaat krijgen.
- `watertoren-emmeloord.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-emmeloord-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [179582.51, 524787.84], het hart van de achthoekige BAG-contour van pand 0171100000012589 (regelmatige achthoek, zijden 5,8 m, 14,0 m over de vlakken, vlaknormalen op 14,5 + k·45 graden linksom van RD-oost), op maaiveld (NAP -2,5 m). +X wijst naar het vlak op 14,5 graden (`xAxis` [0.9681, 0.2504]). De vier hoofdvlakken (lokaal 0, 90, 180, 270) dragen de klok en drie hoge vensters, de diagonale vlakken twee hoge smalle vensters en kleine vensterparen langs de trap. Welke vlakken de klok dragen is afgeleid uit de RCE-foto vanaf de noordzijde (klokvlakken om en om) samen met de lantaarnvorm in het AHN en op de frontale RCE-foto. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-lantaarn-en-tentdak`

- Bakstenen achthoek van 14,0 m over de vlakken aan de voet, verjongend tot 13,4 m op het bezoekersplatform op +48,5. Ingang en glaspui (2,6 × 4,25 m) in twee hoofdvlakken, twee hoge smalle vensters bij de voet in de diagonale vlakken.
- Klokzone van +30,0 tot +39,2: drie hoge vensters achter de wijzerplaat in elk hoofdvlak, twee in elk diagonaal vlak. Paren kleine vensters (0,6 × 0,9 m) op +12,5, +18,2, +24,0 en +43,9 in de diagonale vlakken.
- Lantaarn met het carillon: langwerpige achthoek, aan de oost- en westzijde (lokaal 0 en 180) 2 m ingesprongen (9,4 m), aan de andere zijden 0,5 m (12,4 m), tot +60,8. Drie hoge galmgaten (+49,8 tot +59,3, 0,9 m diep) in elk hoofdvlak, één breder galmgat in elk afgeschuind vlak.
- Koperen tentdak met 0,2 m overstek van +60,8 tot de top op +65,3 (Wikipedia zonder windvaan).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Poldertoren) en [Rijksmonumentenregister 532139](https://monumentenregister.cultureelerfgoed.nl/monumenten/532139): bouwjaren, architecten, 65,3 m, 70,5 m met windvaan, platform op 43,4 m, breedte 14,0 en 13,4 m, 1850 m³.
- BAG-pand 0171100000012589: regelmatige achthoek van 14,0 m, richting van de vlakken.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP -2,51, top NAP +64,41 (66,9 m, voet van de windvaan), oppervlakte per hoogte, het platform op 48 m dat alleen aan de oost- en westzijde van de lantaarn vrij ligt, de breedte van de lantaarn per richting (4,4 tot 4,8 m naar oost en west, 6,0 tot 6,3 m in de andere richtingen), dakvoet circa 60,5 m.
- RCE-foto [20413330](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren,_vanaf_de_Kampwal_-_Emmeloord_-_20413330_-_RCE.jpg), frontaal op een hoofdvlak: hoogtes van ingang, klokzone, vensterparen en galmgaten, geschaald op het platform in het AHN (21,2 px/m), breedte van de lantaarn (circa 10 m in die richting).
- RCE-foto's [20413332](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren,_gezien_vanaf_de_noordzijde,_Onder_de_Toren_-_Emmeloord_-_20413332_-_RCE.jpg) (klokvlakken om en om) en [20409639](https://commons.wikimedia.org/wiki/File:Zicht_op_opengewerkte_lantaarn_met_tentdak_en_carillon_-_Emmeloord_-_20409639_-_RCE.jpg) (opengewerkte lantaarn met klokken en tentdak).

## Geschat en weggelaten

Geschat: de hoogte van het platform (48,5 m volgens AHN en foto; Wikipedia noemt 43,4 m, mogelijk de vloer of gemeten vanaf een ander peil), de breedtes van de lantaarn per zijde (AHN, met randbloei en antennes), de dakvoet, de plaats van ingang en glaspui (lokaal 0 en 270), de breedte en diepte van de galmgaten. De galmgaten zijn nissen van 0,9 m diep met een oplopend plafond in plaats van open doorgangen naar de klokkenkamer; hun pijlers zijn minstens 0,9 m breed gehouden (de werkelijke pijlers zijn circa 0,7 m), omdat de export smallere pijlers dichtzet.

Weggelaten (kleiner dan 0,9 m of te dun): windvaan en vlaggenmast, antennes en schotels op de lantaarn, het hekwerk van het platform, de wijzerplaten (alleen reliëf van centimeters), de klokken zelf en raamroeden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,5 % en blijven de doorsneden op 2, 24, 35 en 55 m (door ingang, vensters en galmgaten) gelijk; de lantaarn is op 55 m 9,4 bij 12,4 m. In een preview-export op 1:1000 (100 × 100 m) is de ondersteuning 0,13 mm³ in de kleine vensterparen. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,2 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.70972/5.75083/200/1x1/0
