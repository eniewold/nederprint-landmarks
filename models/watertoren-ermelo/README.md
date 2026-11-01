# Watertoren Oud Groevenbeek (Ermelo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-ermelo.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het blok is een prisma met schuin aangezette lijsten en een verdiept dak binnen de borstwering, de hoektoren één omwentelingsprofiel; kantelen zijn blokken, vensters, deur en friezen nissen.

De watertoren op landgoed Oud Groevenbeek in Ermelo is in 1912 gebouwd bij de omvorming van het landgoed, op een aangelegde heuvel. Hij leverde drinkwater en bevloeiingswater voor de tuin met kassen; in de toren zat ook een gasfabriekje. Een folly in kasteelstijl: een vierkant grondplan met een aangebouwde ronde toren, kantelen en een uitkijkgedeelte. Sinds 1950 buiten gebruik, in 1994 gerestaureerd, sinds 2005 rijksmonument (523878). Onder de toren liggen kelders met vleermuizen.

## Bestanden

- `watertoren-ermelo.glb`: één node van klasse `building`, op het maaiveld van de heuveltop. De export vult modellen zonder attributen per node op; een losse toren zou een eigen voet krijgen.
- `watertoren-ermelo.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints` op de heuveltop en het vervangen BAG-pand.
- `watertoren-ermelo-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [170581.99, 476780.20], het hart van de rechthoekige BAG-contour van pand 0233100000009678, op het maaiveld van de heuveltop (DTM NAP +23,1 m, vlak binnen 0,2 m tot 5 m rond de toren). +X loopt langs de noordgevel, 3,2 graden rechtsom van RD-oost (`xAxis` [0.99844, -0.05583], de zijden van de BAG-rechthoek); +Y wijst naar het noorden. De BAG-contour is het bovenaanzicht: de rechthoek van 4,03 × 4,60 m is de borstwering, de cirkel van 2,72 m de kanteelkrans van de toren. De toren staat met zijn hart op (1,9, -1,9), op de zuidoosthoek (BAG-cirkel en AHN binnen 0,25 m). De heuvel zelf zit in het PDOK-terrein en staat niet in de GLB. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:blok-en-hoektoren-met-kantelen`

- Blok: muren van 3,67 × 4,24 m op een plint van veldkeien (0,1 m uit, tot +0,72 met een schuine afdekking). Witte waterlijst op de verdiepingsvloer (+2,85 tot +3,1, 0,1 m uit op een schuine onderkant).
- Westgevel: rondboogdeur van 1,0 × 2,25 m in het midden met twee rechte vensters erboven. Noord-, zuid- en oostgevel: twee rondboogvensters (0,5 m, +1,05 tot +2,38) onder twee rechte vensters (+3,37 tot +4,42); in de zuid- en oostgevel naast de toren.
- Rondboogfries van blinde bogen (+5,05 tot +5,6): vier op de noord- en westgevel, drie op de zuid- en oostgevel.
- Tandlijst van +5,9 die 0,18 m uitkraagt naar de borstwering van 4,03 × 4,60 m, tot +6,65; daarop kantelen van 0,8 m tot +7,3 (hoeken, één in het midden van noord- en westgevel, één tegen de toren in zuid- en oostgevel). Binnen de borstwering van 0,9 m ligt het platte dak verdiept op +5,95.
- Ronde toren van 2,34 m op een plint van 2,54 m, met dezelfde waterlijst, vier smalle trapvensters, een tandlijst op +6,25 tot +6,6 en een fries van zes blinde bogen (+8,1 tot +8,7). Kraag van +9,05 naar de kanteelkrans van 2,72 m (vanaf +9,335), dicht tot +10,2, met zes kantelen tot +10,8.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Ermelo)) en het [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/523878): bouwjaar, folly op een heuvel, vierkant grondplan met ronde toren, kantelen.
- BAG-pand 0233100000009678 (bouwjaar 1961 in de BAG, in gebruik): rechthoek van 4,03 × 4,60 m, 3,2 graden gedraaid, met een cirkel van 1,36 m straal op de zuidoosthoek.
- AHN DSM/DTM 0,5 m en 3D BAG (PDOK en api.3dbag.nl, AHN5, opgehaald 2026-11-01): maaiveld NAP +23,1, plat dak van het blok NAP +29,05 tot 29,1, kantelen langs de noordrand NAP +30,3, binnenkant van de torenkrans NAP +32,0 tot 32,3; de toren in het DSM op de zuidoosthoek.
- Foto [RCE 20339656](https://commons.wikimedia.org/wiki/File:Exterieur_WATERTOREN,_OVERZICHT_VOORZIJDE_-_Ermelo_-_20339656_-_RCE.jpg), frontaal vanuit het zuidoosten met de toren in het midden: alle hoogtes, de torendiameter en de uitkraging, geschaald op de kantelen van het blok in het AHN (30,1 px/m; de breedte over het blok klopt dan binnen 5 % met de BAG).
- Foto's [RCE 20313754](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Ermelo_-_20313754_-_RCE.jpg) en [RCE 20375910](https://commons.wikimedia.org/wiki/File:Watertoren_-_Ermelo_-_20375910_-_RCE.jpg) vanuit het zuidwesten: deur in de westgevel, vensters en fries van de zuidgevel, trapvensters en fries van de toren.
- Foto [Ermelo Watertoren 2007](https://commons.wikimedia.org/wiki/File:Ermelo_Watertoren_2007.JPG) vanuit het noordwesten op de hoek (de toren erachter in het midden): noordgevel met twee rondboogvensters, westgevel met de deur, de brede hoekkantelen.

## Geschat en weggelaten

Geschat: de uitkraging van borstwering en krans (0,18 m, uit de foto's, zodat de muren binnen de BAG-contour vallen), de stand van de toren (tussen BAG-cirkel en AHN), de plaats van de vensterparen op de zuid- en oostgevel, de breedte van vensters en friesbogen, en de hoogte van het looppad van de toren: het AHN ziet binnen de krans +9,2, het model is daar dicht tot de kanteelopeningen op +10,2 (een kuil van 0,9 m doorsnede print niet). Rondbogen zijn nissen met een plafond van 56 graden. De kantelen zijn grover dan in het echt: 0,8 m breed over de volle 0,9 m van de borstwering, met openingen van 0,6 tot 1,1 m (in het echt vier tot vijf smalle kantelen per gevel en circa acht op de toren, en een borstwering van één steen).

Weggelaten: de witte consolestenen onder de friezen, de bakstenen boog rond de deur en de regenpijp (kleiner dan 0,9 m), de rotspartij naast de westgevel (geen bouwwerk), de betonnen kelderingang in de heuvelflank ten noorden van de toren (in het PDOK-terrein, geen deel van het pand) en de heuvel zelf.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,0000000): waterlijst, tandlijst en kraag hangen op schuine onderkanten van 56 graden en alle nissen hebben plafonds van 56 graden. De doorsneden op 1,5, 2,95, 4, 5,3, 6,1, 7, 8,4, 9,2 en 10,5 m (vensters, waterlijst, fries, tandlijst, kantelen, torenfries, kraag en torenkantelen) blijven gelijk. Controlebeelden blijven buiten de repo. De preview-export (1:1000, support v2) heeft geen steun; op de kaart staat de folly op de heuveltop met de voet 0,1–0,4 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.27881/5.61553/200/1x1/0
