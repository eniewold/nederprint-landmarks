# Watertoren Stramproy

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-stramproy.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een prisma, de kroonlijst een omhulsel met een schuine onderkant, het dak een afgeknot schilddak (omhulsel van dakvoet en plat bovenvlak), deur en vensters zijn nissen; de woning ernaast is een prisma met twee dakvlakken.

De watertoren in Stramproy (gemeente Weert) leverde water aan de naastgelegen bierbrouwerij. In 2004 is hij gerenoveerd en opgenomen in een nieuwbouwblok: de vierkante bakstenen toren staat nu tussen twee witte woonvleugels van drie lagen met zadeldaken, aan de pleinzijde 2,7 m en aan de tuinzijde 1,3 m terug ten opzichte van hun gevels. Donkere baksteen, een witte kroonlijst en een steil afgeknot schilddak met een plat bovenvlak.

## Bestanden

- `watertoren-stramproy.glb`: twee nodes van klasse `building`, op het maaiveld: de toren en de woning uit hetzelfde BAG-pand. De toren is één node; de export vult elke node apart op.
- `watertoren-stramproy.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-stramproy-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [178466.12, 356383.36], het hart van de BAG-rechthoek van de toren (4,40 × 5,78 m), op maaiveld (AHN-DTM NAP +32,17 m). De assen lopen langs de gevels: +Y wijst naar de tuinzijde op 54,2 graden in RD (noordoost), +X langs de vleugels naar de woning (zuidoost, `xAxis` [0.8111, -0.585]). De pleinzijde met de deur ligt op -Y. Het platte bovenvlak van het dak ligt in het AHN en de 3D BAG binnen 0,1 m midden op de BAG-rechthoek.

BAG-pand 0988100000025603 (bouwjaar 2003, in gebruik) is de toren samen met de aangrenzende woning in de zuidoostelijke vleugel. Het model vervangt het hele pand; de woning staat daarom als eenvoudig blok in een eigen node. De noordwestelijke vleugel (pand 0988100000025604) blijft PDOK: in de 3D BAG is die op zijn hoogste punt 10,25 m, gelijk aan het AHN.

`groundSamplePoints` liggen voor en achter de toren in de open stroken tussen de vleugels (AHN-DTM NAP +32,16 tot +32,19). `groundHeight` 76,73 is het ellipsoïdische maaiveld: NAP +32,17 plus de NLGEO2018-geoïdehoogte op de oorsprong (44,56 m).

## Onderdeel `building:schacht-kroonlijst-en-schilddak`

- Bakstenen schacht van 4,40 × 5,78 m tot +10,4.
- Witte kroonlijst die 0,25 m uitkraagt onder 54 graden van +10,4 tot +10,75, met een rand tot +10,85.
- Afgeknot schilddak van circa 63 graden van de dakvoet op de kroonlijst (4,90 × 6,28 m, +10,85) naar een plat bovenvlak van 1,7 × 3,1 m op +14,0.
- Pleinzijde: deur (0,95 × 2,2 m) en drie vensters van 1,3 m breed boven elkaar (+3,45 tot +4,9, +6,0 tot +7,25 en +8,65 tot +9,65), als nissen van 0,3 m met een plafond van 56 graden.
- Tuinzijde: dezelfde drie vensters, zonder deur.

## Onderdeel `building:woning-naast-de-toren`

De woning in hetzelfde BAG-pand (4,52 × 9,70 m, x 2,2 tot 6,72, y -5,55 tot 4,15) met het zadeldak van de vleugel, zonder overstek: nok evenwijdig aan de vleugel op y -3,9 en +10,1, een korte voorhelling van 50 graden naar de goot op +8,1 aan de pleinzijde en een lange achterhelling van 36 graden naar de goot op +4,15 aan de tuinzijde. Nok en goten uit het AHN en de 3D BAG (nok AHN 10,0, 3D BAG 10,2; goten 3D BAG 8,1 en 4,15), gelijk aan de rest van de vleugel. De zijgevel naar de toren loopt in het vlak van de schacht.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Stramproy)): functie (watervoorziening van de brouwerij), renovatie en opname in nieuwbouw in 2004, gemeente Weert sinds 1998.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +32,17, hoogste punt NAP +46,32 (14,1 m boven maaiveld), plat bovenvlak op 14,0 m van circa 1,6 × 3,0 m, dakhelling circa 2:1 (63 graden), dakvoet tussen 10,8 en 11 m; vleugelprofiel met de nok op 10,0 m.
- 3D BAG (LoD2.2) van panden 0988100000025603 en 0988100000025604: plat bovenvlak 1,85 × 3,2 m, nok en goten van de vleugels.
- BAG-pand 0988100000025603 (2003, in gebruik, 13 hoekpunten): rechthoek van de toren en de woning; richting van de gevels 54,2 graden.
- Luchtfoto 8 cm (PDOK): afgeknot schilddak met vier graten en een donker plat bovenvlak, langgerekt in de diepte van de toren.
- Foto [Stramproy Watertoren 7544](https://commons.wikimedia.org/wiki/File:Stramproy_Watertoren_7544.JPG), recht op de pleinzijde: kroonlijst, deur en vensters, geschaald op de schacht tot de kroonlijst (43 px/m).

## Geschat en weggelaten

Geschat: de hoogtes van kroonlijst, deur en vensters en de breedte van de vensters (van de enige foto, geschaald op de hoogte van de schacht; de linkerrand van de toren valt daar achter de vleugel), de uitkraging van de kroonlijst (0,25 m), de diepte van de nissen (0,3 m). De vensters aan de tuinzijde zijn aangenomen gelijk aan die aan de pleinzijde: er is geen foto van die kant. De zijgevels boven de vleugeldaken zijn blind gelaten, ook daar is geen foto van.

Weggelaten (kleiner dan 0,9 m of te dun): kozijnen, rolluiken en dorpels, de dakgoot en hemelwaterafvoer, eventuele dakbedekking of lichtkoepel op het platte bovenvlak.

## Controle

Beide nodes zijn gesloten NoError-solids met genus 0. In de webshoptest verandert de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,0000): de kroonlijst kraagt onder 54 graden uit en de nissen hebben plafonds van 56 graden. De doorsneden op 1,5, 4, 6,6, 9,2, 10,6 en 12,5 m (deur, vensters, kroonlijst, dak) blijven gelijk, de woning blijft ongewijzigd. Naast de 3D BAG, die de toren als afgeknot schilddak zonder gevelreliëf heeft, heeft het model van voren en van achteren deur en vensters, rondom de kroonlijst en een dakvoet die 1,3 m lager ligt dan in de 3D BAG (zoals de foto en het AHN tonen). Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen toren en woning zonder steun en sluiten ze aan op de PDOK-vleugels. Op de kaart staat de toren tussen de vleugels met de voet 0,13–0,19 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.19639/5.72278/200/1x1/0
