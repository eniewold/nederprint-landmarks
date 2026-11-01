# Watertoren Sint Jacobiparochie

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-sint-jacobiparochie.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: sokkel en reservoir zijn omwentelingsprofielen, schacht, kraag en lantaarn geëxtrudeerde veelhoeken, de ring een twaalfhoekig prisma; deur en ramen zijn nissen.

De watertoren aan de G. van Swietenstraat in Sint Jacobiparochie is in 1957 gebouwd naar ontwerp van A.P. Wesselman van Helmond, 41 m hoog met een reservoir van 515 m³, gelijk aan de toren van Nes bij Akkrum (`watertoren-akkrum-nes`). Sinds 2024 is hij hotel Wad Hoog: twee suites in het reservoir, met hoge ramen in de wand, en drie kamers in een ring om de voet die op circa 3 m hoogte zweeft en aan de voorzijde open is.

## Bestanden

- `watertoren-sint-jacobiparochie.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir of een losse ring zou een voet tot de grondplaat krijgen.
- `watertoren-sint-jacobiparochie.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-sint-jacobiparochie-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [169632.42, 587096.22], het hart van de toren, op maaiveld (NAP +0,6 m). Daar vallen het midden van de reservoirschijf in het AHN en het middelpunt van de ronde BAG-contour binnen 0,2 m samen. Assen in RD-richting (`xAxis` [1, 0]). De BAG-contour van pand 0063100000001159 (266 m², status verbouwing) is de nieuwe ring: een cirkel met straal 10,3 m met de open hoek in het noordwesten, begrensd door het rechte eindvlak x = 0,36 m en het westelijke eindvlak, met een binnenboog van 5,1 m. Deur en trap staan midden in die open hoek (132 graden), zoals de trap op de luchtfoto. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:sokkel-schacht-reservoir-lantaarn-en-ring`

- Roodpaarse sokkel van 9,3 m met een rechte rand tot +0,25 en een schuin bovenvlak tot r 3,4 op +0,9; voetring van blokken (zestienhoek van 6,6 m) tot +1,66.
- Schacht met zestien lisenen als zestienhoek van 6,14 m over de vlakken, met een vlak naar de deur. Deur (1,0 × 2,35 m) boven een bordes op +1,85 met een trap van 1,2 m breed naar het noordwesten.
- Kraag van 6,7 m van +28,3 tot +29,45 met een onderkant van 56 graden.
- Reservoir: nagenoeg vlakke onderkant van r 3,3 op +29,35 naar r 5,9 op +29,85, ronde onderrand tot de wand van 13,5 m op +30,85, wand tot +37,15, dakrand van 13,7 m tot het platte dak op +37,65. Tien hoge ramen (1,0 × 3,2 m) rondom van +33,2 tot +36,4, symmetrisch om de deur.
- Achtkante glazen lantaarn van 2,7 m over de vlakken tot +40,2 met een kap van 3,0 m tot +40,6.
- Ring met kamers: twaalfhoek van 21,0 m over de vlakken (vlakken op 8 + k·30 graden), binnen rond op 5,1 m, van +3,15 tot +7,0, met een raam (2,0 × 2,3 m) in elk van de acht volle vlakken. Hij rust op een liftkern van 1,6 × 2,2 m aan de achterzijde (zuidoost), die tot de sokkel doorloopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Sint_Jacobiparochie)): bouwjaar, architect, 41 m, 515 m³, hotel sinds 2024 met ramen in het reservoir.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +0,6 bij de toren, hoogste punt NAP +41,03 (40,6 m boven maaiveld, de lantaarn), reservoirschijf van 13,8 m (met randbloei) en het hart. Het reservoirdak geeft binnen de rand waarden van 10 tot 33 m (spiegelreflectie op een nat bitumendak); daarom komen de hoogtes uit de foto. De ring staat nog niet in het AHN.
- BAG-pand 0063100000001159 en luchtfoto (PDOK): de ring als twaalfhoek met plat dak en de open hoek naar het noordwesten, de trap naar de deur.
- RCE-foto [20423047](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Sint_Jacobiparochie_-_20423047_-_RCE.jpg), frontale telefoto: alle hoogtes en de stralen van schacht, voetring, sokkel en kraag, geschaald op de reservoirbreedte (13,5 m, 17,2 px/m); de zestien lisenen.
- RCE-foto [20423059](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Sint_Jacobiparochie_-_20423059_-_RCE.jpg) en de detailfoto's van de ingang: deur, trap en sokkel.
- Bestemmingsplan NL.IMRO.1949.BPStjGvSwiestr23-VAS1 (ruimtelijkeplannen.nl), toelichting en figuur 2.3 (voor- en achtergevel 1:200): de ring op circa 3 m hoogte, los van de toren en aan de voorzijde open, de liftkern, de hoogte van de ring en de langgerekte ramen in het reservoir.
- Foto van de ingang op [wadhoog.nl](https://wadhoog.nl/) na de verbouwing: het aantal en de stand van de ramen in het reservoir.

## Geschat en weggelaten

Geschat: de hoogte van de ring (vloer 3,15 m, dak 7,0 m, uit de bouwtekening geschaald op het reservoir; de tekening is niet maatvast en de ring staat niet in het AHN), de binnenstraal van de ring (de boog in de BAG-contour), de maat en plaats van de liftkern, de ramen in de ring (één per vol vlak), het aantal (tien) en de maat van de ramen in het reservoir (tekening en één foto), de vorm van de reservoirbodem en de kraag, de lantaarn (achtkant uit de luchtfoto, maat uit de foto), de diepte van de nissen (0,3 m).

Weggelaten (kleiner dan 0,9 m of te dun): de stalen schoren tussen de sokkel en de ring (alleen de liftkern draagt in het model), de groeven tussen de lisenen, het hekwerk op het reservoirdak, antennes en bliksemafleider, de leuningen van de trap (de trap zelf is een volle wig), de lichte stroken aan de eindvlakken van de ring op de luchtfoto (luifels of trappen, vorm onbekend) en de raamroeden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 14,3 %: onder de zwevende ring (een wig vanaf sokkel, trap en liftkern naar de vloer op 3,15 m) en onder de nagenoeg vlakke reservoirbodem, de echte vorm. De doorsneden op 5, 15, 34 en 39 m (ring, schacht, reservoirramen, lantaarn) blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) krijgt de zwevende ring een rok van ondersteuning tot het maaiveld, de reservoirbodem een wig en de groeven tussen de lisenen dunne schoren; het model zelf blijft open. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet gelijk aan het PDOK-maaiveld (binnen 5 cm).

Controle-URL: http://localhost:3000/kaart/53.27024/5.60649/200/1x1/0
