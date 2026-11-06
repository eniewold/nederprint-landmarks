# Watertoren Axel (Axel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-axel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht en de ommanteling zijn twaalfhoekige prisma's, de risalieten en pilasters losse prisma's, de band een omhulsel met een schuine onderkant, fries, goot en koepel één omwentelingsprofiel, en de vensters en de deur nissen.

De watertoren aan de Kinderdijk in Axel is in 1936 gebouwd naar ontwerp van C. van Eck. Volgens Wikipedia is hij 60,6 m hoog, met reservoirs van 500, 500 en 300 m³ (het register noemt een onderste reservoir van circa 300 m³ met een vlakke betonnen afdekking en een bovenste van circa 1000 m³ onder de koepel). Rijksmonument 508104; de toren heeft een slechtvalkenkast en is in de zomer te bezoeken. Een twaalfzijdige schacht van donkerrode baksteen met pilasters, een witte betonnen band, een iets bredere twaalfzijdige reservoirommanteling, een ronde witte goot en een koperen koepel met een vierzijdige lantaarn.

## Bestanden

- `watertoren-axel.glb`: één node `building:watertoren-schacht-band-ommanteling-koepel-en-lantaarn`, op maaiveld.
- `watertoren-axel.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-axel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [51850.48, 364317.38] (51,25879 N, 3,90944 O), het hart van de twaalfhoek uit BAG-pand 0715100000000842 (bouwjaar 1936; kleinste kwadraten op de acht schuine zijden, apothema 7,41 m, restfout tot 0,19 m). Het hart van de koepel in het AHN-DSM ligt er 0,3 m naast. Maaiveld AHN-DTM NAP +1,57 (verhard plateau van 7 tot 9 m rond de toren; daarbuiten zakt het terrein tot NAP 0). +X langs de BAG-zijden op RD 10,7 graden (alle as-evenwijdige zijden van de BAG), +Y 90 graden linksom daarop. De risalieten staan op de vier hoofdassen.

`groundHeight` 45,945 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de acht `groundSamplePoints` op 9,5 m van het hart: oost 46,18, west 46,03, noord 45,99, zuid 45,95, noordoost 46,07, noordwest 45,98, zuidoost 46,04, zuidwest 45,97. De PDOK-reconstructie van het pand is een twaalfzijdig prisma met een gefacetteerde koepel van 44,97 tot 106,93; er staan geen buurpanden tegen de toren.

## Onderdeel `building:watertoren-schacht-band-ommanteling-koepel-en-lantaarn`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Schacht: twaalfhoek met apothema 7,41 m (BAG), vlakken op 0, 30, ... graden, tot de band op 40,7 m.
- Risalieten: op de vier hoofdassen, 5,6 m breed (BAG 5,3 tot 6,1 m), voorkant per richting uit de BAG: oost 8,15, noord 7,6, west 8,35, zuid 8,6 m. Elk met een kolom van twaalf vensters (0,9 × 1,6 m, om de 2,93 m, de bovenste op 36,7 m); in de zuidelijke risaliet een deur van 1,6 × 2,7 m in plaats van het onderste venster.
- Pilasters: langs beide kanten van elke risaliet, 0,9 m breed en 0,3 m voor de risaliet, tot 42,0 m (0,7 m boven de band, de witte pilasterkoppen op de foto), met een voet van 1,4 m breed tot 4,4 m en een schuine kop. Op de hoek tussen de twee schuine zijden van elk kwadrant een pilaster van 0,9 m tot de band.
- Vensters onder de band: op elke schuine zijde één nis van 1,6 × 0,9 m (de groep van drie vensters op de foto), van 38,9 tot 39,8 m.
- Band: 0,6 m hoog (40,7 tot 41,3 m), 0,3 m voor de schacht en de risalieten, met een onderkant van 50 graden.
- Ommanteling: twaalfhoek met apothema 7,5 m van de band tot 49,7 m, op vier zijden (60, 150, 240 en 330 graden) drie kleine vensters boven elkaar (0,9 × 1,0 m).
- Fries: rond, straal 7,35 m, van 49,7 tot 50,45 m, ingesprongen onder de goot.
- Goot: rond, straal 7,85 m (luchtfoto 7,8 m), onderkant van 50 graden vanaf het fries, bovenkant 51,15 m (AHN).
- Koepel: omwentelingsprofiel uit het AHN-DSM (mediaan per ring van 0,5 m): 51,9 m op 7 m, 52,67 op 6,5, 53,48 op 6, 54,99 op 5, 56,21 op 4, 57,22 op 3, 58,07 op 2 m van het hart, onder de lantaarn doorgetrokken tot 58,85 m.
- Lantaarn: vierkant van 2,0 m tot 59,9 m, kap met 0,12 m overstek (onderkant 50 graden) en een afgeknotte piramide tot 60,4 m (AHN NAP +61,97).
- Hok op de goot: 1,6 × 2,2 m, tot 52,6 m, aan de westkant (RD 270 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Axel)): 1936, C. van Eck, 60,6 m, 500 + 500 + 300 m³.
- [Rijksmonumentenregister 508104](https://monumentenregister.cultureelerfgoed.nl/monumenten/508104): twaalfzijdige plattegrond, pilasterachtige elementen, betonnen band, goot en afdekkingen, ommanteling iets breder dan de schacht, koperen koepel met vierzijdige lantaarn, groepen van drie vensters onder de band, kleine vensters in de ommanteling.
- BAG-pand 0715100000000842 (PDOK, 2026-11-06): twaalfhoek, risalieten en hoofdas. Het id uit de taak klopt; het is het enige pand binnen 50 m.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, koepelprofiel, lantaarn, goot.
- PDOK-luchtfoto (2026-11-06): ronde goot en koepel, middellijn 15,6 m.
- PDOK-gebouw- en terreintegels (2026-11-06): reconstructie van het pand, terreinhoogtes op de bemonsteringspunten.
- Foto op Wikimedia Commons: "Axel Watertoren 4843.JPG" (2006, frontaal op een risaliet: vensterkolom, pilasters, band, ommanteling met vensters, fries, goot, koepel, lantaarn en hok). Er staat geen andere foto van de toren op Commons.

## Geschat en weggelaten

Geschat: de hoogtes van de band (40,7 m), de top van de ommanteling (49,7 m), het fries, de pilastervoeten en de vensters, uit één perspectivische foto, geschaald met de twaalf vensters van de vensterkolom (2,93 m per verdieping, aangenomen gelijk) op de AHN-hoogte van de goot (circa 0,5 m nauwkeurig); het apothema van de ommanteling (7,5 m, "iets breder"); welke zijden van de ommanteling vensters hebben en dat elke risaliet een vensterkolom heeft (er is maar één kant gefotografeerd); de deur in de zuidelijke risaliet (de diepste in de BAG); plaats en maat van het hok op de goot (foto, en een verhoging van 0,6 m in het AHN aan de westkant). De verschillende diepte van de risalieten komt uit de BAG en is niet op foto's gecontroleerd.

Weggelaten: de ramen in het fries (0,6 m hoog), het hekwerk op de goot en bij het hok, de antenne op de lantaarn, de ribben van de koepel, de witte afdekstenen op de pilastervoeten als apart onderdeel, de omlijsting van de deur, het hek aan de straat en de trap op het talud.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 (ondersteuning v2, 45 graden) van een uitsnede van 80 m bevat het model, niet meer het PDOK-pand, en geen ondersteuning onder het model. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een glad twaalfzijdig prisma met een gefacetteerde koepel) aan elke kant de risalieten met vensterkolommen, de pilasters met voeten, de band met pilasterkoppen, de bredere ommanteling met vensters, het fries, de goot, de ronde koepel en de lantaarn; aan de zuidkant ook de deur en aan de westkant het hok op de goot.

Controle-URL: http://localhost:3000/kaart/51.25879/3.90944/200/1x1/0
