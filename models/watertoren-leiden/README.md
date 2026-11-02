# Watertoren Leiden (Leiden)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-leiden.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, ringbalk, reservoir, borstwering en opbouw zijn geëxtrudeerde en verlopende twaalfhoeken, de pilasters en consoles omhulsels van rechthoeken, het dak van de opbouw één convex omhulsel van twaalfhoeken; vensters, oculi en deur zijn nissen.

De watertoren van de Leidsche Duinwater Maatschappij aan de Hoge Rijndijk (156A), bij de Wilhelminabrug over het Rijn-Schiekanaal, is in 1908 gebouwd naar een ontwerp van W.C. van Manen: 29,5 m hoog met een reservoir van 1200 m³, buiten gebruik sinds 1993, rijksmonument 515106 en nu een woning. Volgens het register een vroeg voorbeeld van een toren met een zichtbaar skelet van gewapend beton, in een overgangsstijl. Een twaalfzijdige schacht met betonnen hoekpilasters en bakstenen vlakken, waarvan de pilasters bovenaan als gebogen consoles uitbuigen naar de ringbalk onder het bredere twaalfzijdige reservoir; daarop een borstwering met meanderband en een overstekende afdekking. Bij de verbouwing tot woning (vergunning 2013) kwam er op het dak een twaalfzijdige glazen opbouw met een dakterras.

## Bestanden

- `watertoren-leiden.glb`: één node `building:schacht-consoles-reservoir-en-opbouw`, op het maaiveld.
- `watertoren-leiden.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-leiden-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [95275.87, 463349.4], het zwaartepunt van de BAG-contour van pand 0546100000042902 (214,5 m², de twaalfhoek van ringbalk en afdekking met hoekpunten op 8,42 m uit het hart), op maaiveld (AHN-DTM NAP +0,65 m; 3D BAG 0,48). De hoeken van de twaalfhoek (de pilasters) staan in de BAG-contour op 7,5 + 30k graden van RD-oost: lokale +X is de oostelijke hoekpilaster (`xAxis` [0.9914, 0.1305]), de vlakken staan op 15 + 30k graden. `groundHeight` 44,01 is NAP +0,65 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,36 m). Het model vervangt het pand, zodat het PDOK-blok (een twaalfzijdige kolom ter breedte van het reservoir tot het maaiveld) verdwijnt.

## Onderdeel `building:schacht-consoles-reservoir-en-opbouw`

- Schacht: twaalfhoek van 10,7 m over de bakstenen vlakken, met twaalf hoekpilasters van 0,8 m breed tot 5,9 m uit het hart (11,8 m over de pilasters, 0,70 maal het reservoir op de foto). Op de begane grond zijn de pilasters 1,0 m breed en reiken ze tot 6,2 m, met een kop van 45 graden op 5,7–6,0 m.
- Banden van 0,25 m uit (kraag van 45 graden) op 5,7–6,25 m en 12,6–13,2 m.
- Consoles: boven de band buigt elke pilaster als rib van 0,9 m breed uit naar de ringbalk, door de punten (5,9 m; 13,2), (6,2; 15,5), (6,9; 17,0), (7,9; 18,2) en (8,35; 18,75), steilste stuk 45 graden.
- Ringbalk van 16,3 m over de vlakken (hoeken op 8,44 m, BAG 8,42) van 18,7 tot 19,5 m, met een schuine kraag naar het reservoir van 15,7 m over de vlakken (19,8 m).
- Reservoir met hoekpilasters van 0,7 m breed tot 8,3 m uit het hart, van de ringbalk tot de afdekking.
- Borstwering 0,1 m uit (kraag van 45 graden) van 26,9 tot 28,5 m en afdekking van 16,3 m over de vlakken (kraag van 45 graden) tot 29,3 m; dakterras op 28,55 m binnen een borstwering van circa 1 m dik.
- Opbouw: glazen twaalfhoek van 12,6 m over de vlakken tot 31,3 m, dakrand van 13,5 m tot 31,6 m, flauw piramidedak (14 graden) tot een kapje van 2,7 m op 32,95 m en de top op 33,8 m. Aan de west-noordwestkant (RD 152 graden) een dakterras van 4,4 m breed vanaf 2,6 m uit het hart.
- Nissen van 0,3 m met plafonds van 56 graden: per vlak op de begane grond een oculus van 1,0 m (midden 4,9 m), in het middenstuk een hoog venster van 0,7 × 5,7 m (6,6–12,3 m), in het consolestuk een oculus van 1,2 m (midden 16,4 m) en in het reservoir twee vensters van 0,6 × 4,2 m (22,2–26,4 m) op 0,8 m uit het midden van het vlak.
- Deur aan de zuidkant (RD 262,5 graden, naar de Hoge Rijndijk): 1,4 m breed met een spitse top op 3,2 m (50 graden), daarboven een oculus van 1,0 m op 4,6 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Leiden)): bouwjaar, ontwerper, 29,5 m, 1200 m³, betonskelet op twaalf palen, verbouwing tot woning met een twaalfzijdige opbouw.
- [Rijksmonumentenregister 515106](https://monumentenregister.cultureelerfgoed.nl/monumenten/515106): W.C. van Manen, 1908, twaalfzijdige schacht, zichtbaar betonskelet, overgangsstijl, de verdwenen pinakels boven de ingang. Ontwerper en vorm komen daarmee overeen met de opdracht.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +0,4 tot +1,2 (west, de parkeerplaats, het hoogst), afdekking NAP +29,6 tot +30,0, dakrand van de opbouw NAP +32,3, kapje NAP +34,48.
- 3D BAG (LoD2.2, AHN5 2023) van pand 0546100000042902: maaiveld 0,48, borstwering 29,6 tot 30,0, opbouw tot 34,35 (NAP), met de inham van het dakterras aan de noordwestkant; ter controle.
- BAG-pand 0546100000042902 en luchtfoto (PDOK): het hart, de stand en maat van de twaalfhoek, de opbouw met het piramidedak en het kapje, het dakterras.
- Foto "Leiden, Water Tower near Wilhelmina Bridge" (Wikimedia Commons), frontale telefoto van over het kanaal: verhouding schacht en reservoir, hoogtes van banden, consoles, ringbalk, borstwering en vensters, geschaald op het reservoirvlak tussen twee pilasters (4,36 m, 55,5 px/m); de afdekking komt zo op 29,4 m.
- Foto's "Watertoren-leiden", "Leiden215", "Watertoren Leiden 2017 1 en 2" en "Water tower Leiden (51283292069)" (Wikimedia Commons): de zuidkant met de deur, de oculi, de bredere pilastervoeten en de opbouw.
- Foto van de ingang rond 1908 (objectnummer PV103953, via Wikimedia Commons): deur, oculi en pilastervoeten.

## Geschat en weggelaten

Geschat: de breedte van de schacht (uit één frontale foto, 0,70 maal het reservoir), de vorm van de consoles (de werkelijke kromming wordt bovenaan vlakker dan 45 graden), de hoogtes van banden, consoles, ringbalk, borstwering en vensters (foto, gecontroleerd tegen AHN en 3D BAG), de breedte en diepte van pilasters, banden en kragen, de maat van de oculi en vensters, de hoogte van de glazen wand en de overstek van de dakrand van de opbouw, de vorm van het kapje, de plek en maat van het dakterras (luchtfoto) en de plek van de deur (zuid, naar de Hoge Rijndijk, uit de foto's en het adrespunt).

Weggelaten (kleiner dan 0,9 m of alleen vlakversiering): de meander in de borstwering, de tegelmotieven onder de reservoirvensters, de stervormige omlijsting van de oculi, de afzonderlijke vensterkozijnen en tussendorpels, de leuning rond het dakterras en op de borstwering, de verdwenen pinakels boven de ingang, de lantaarnpalen en het hekwerk.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 2,8 %: alleen de wiggen onder de vlakke onderkant van de ringbalk tussen de consoles (vanaf 15,9 m). Consoles, kragen, de dakrand van de opbouw en de nisplafonds krijgen geen opvulling. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (3D BAG LoD2.2: een twaalfzijdige kolom ter breedte van het reservoir tot het maaiveld met een grof dak) de smalle schacht met pilasters en bredere voeten, de banden, de consoles, de ringbalk en het bredere reservoir met pilasters, borstwering en afdekking, de opbouw met piramidedak, kapje en dakterras, en de vensters, oculi en de deur.

Controle-URL: http://localhost:3000/kaart/52.15509/4.51446/200/1x1/0
