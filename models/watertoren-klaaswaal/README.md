# Watertoren Klaaswaal (Klaaswaal)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-klaaswaal.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een zeskante afgeknotte piramide met lisenen en banden als prisma's, het reservoir met voetlijst, kroonlijst, trommel, kegeldak, dopje en windvaan is één omwentelingsprofiel, en het ondervlak waarmee het ronde reservoir boven de vlakke gevels uitkraagt is een hull van de zeskant en de cirkel; vensters en deur zijn blinde nissen met een schuin plafond.

De watertoren van Klaaswaal (gemeente Hoeksche Waard) aan de Oranjestraat werd in 1929 gebouwd naar ontwerp van A. Visser; hij is 38 m hoog en heeft een reservoir van 400 m³ (Wikipedia). Hij is geen rijksmonument. De toren staat er nog (BAG "Pand in gebruik", AHN, luchtfoto en 3D BAG op AHN5 uit 2024) en draagt antennes van een zendmast. Een zeskante, sterk verjongende bakstenen schacht met betonnen lisenen op de hoeken en twee betonbanden draagt een rond reservoir met doorlopende lisenen, een betonnen voetlijst en een zware kroonlijst; daarboven staan een teruggezette trommel met kleine openingen, een flauw kegeldak, een dopje en een windvaan.

## Bestanden

- `watertoren-klaaswaal.glb`: één node, `building:watertoren-zeskante-schacht-reservoir-kroonlijst-en-kegeldak`.
- `watertoren-klaaswaal.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-klaaswaal-1-1000.stl`: het model op 1:1000 (11,3 × 10,3 × 41,0 mm).

## Oorsprong en oriëntatie

RD-oorsprong [90153.77, 420399.54] (51,768509 N, 4,447742 O): het middelpunt van een cirkelfit op de 36 hoekpunten van de ronde BAG-voetafdruk van pand 0611100000614296 (straal 5,64 m, alle punten tussen 5,56 en 5,72 m), op het maaiveld: AHN-DTM NAP +0,7 aan de west- en zuidkant. De windvaan ligt in het AHN-DSM in de pixel van het hart.

De BAG-cirkel gaat door de hoeken van de zeskant met hun lisenen. De lokale X-as wijst naar RD-oost (`xAxis` [1, 0]); de hoeken staan op 0, 60, 120, 180, 240 en 300 graden, de zijden op 30, 90 (noord), 150, 210, 270 (zuid) en 330 graden. De luchtfoto toont aan de noordkant een vlakke zijde met lisenen op ongeveer 30 graden links en rechts van het noorden.

`groundSamplePoints` liggen op 6,5 m naar het westen en zuiden en op 6,5 m diagonaal naar het noordwesten, zuidwesten en zuidoosten; `groundHeight` 44,491 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (west 44,635, zuidwest 44,602, zuid 44,542, noordwest 44,491, zuidoost 44,603, gemeten 2026-11-06). `groundOffsetMetres` is −0,1. Aan de noordoostkant ligt een verdiept stuk bestrating (AHN NAP 0,0, PDOK 43,80 tot 43,98); daar zijn geen bemonsteringspunten gekozen, en de onderkant van het model ligt daarom op −0,8 m in plaats van −0,3 m, zodat de voet ook daar in het terrein steekt. Het PDOK-pand staat op 44,03 met de top op 82,5. Het woonhuis ten oosten (0611100000409198) staat in PDOK op NAP +9,3, gelijk aan het AHN (NAP +9,27), en blijft van PDOK.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +0,7); stralen zijn hoekstralen van de zeskant.

- Schacht: zeskant van hoekstraal 5,45 m (baksteenvlak) aan de voet, recht verjongend tot 4,6 m op 27,65 m. Lisenen van 0,9 m breed en 0,2 m buiten de hoek (aan de voet 5,675 m, de BAG-cirkel), doorlopend over het reservoir tot de kroonlijst. Onderste band van 4,4 tot 5,0 m en band van 24,5 tot 25,1 m, beide met een ondervlak van 45 graden; rij kleine vensters (vier per zijde, nissen 0,9 × 0,9 m) van 25,35 tot 26,25 m. Deur (nis 1,3 m, tot 2,5 m) in de zijde op 30 graden (oost-noordoost), vensters aan de voet (1,2 m breed, 1,2 tot 2,4 m) in de andere vijf zijden, trappenhuisvensters (nissen 0,9 × 2,0 m) om en om op 16,5–18,5 m en op 10,5–12,5 en 22,0–24,0 m.
- Reservoir: rond, straal 4,6 m (gelijk met de hoeken van de schacht). Midden in elke zijde kraagt het 0,8 m uit boven de vlakke gevel, met een ondervlak van 44 graden van 26,79 tot 27,65 m; voetlijst met straal 4,8 m van 27,65 tot 28,55 m; bakstenen wand tot 32,45 m.
- Kroonlijst: kraag van 45 graden naar straal 5,0 m (diameter 10 m, AHN 4,9 tot 5,0 m) op 32,85 m; kroonlijst tot 34,0 m (AHN rand NAP +35,2, 3D BAG dak min NAP +34,2).
- Dak: trommel met straal 4,3 m van 34,0 tot 35,45 m met twaalf openingen (nissen 0,9 × 0,3 m breed); kegeldak van 29 graden tot straal 0,7 m op 37,43 m (AHN NAP +36,6 op 3,5 m en +38,0 op 1 m); dopje tot 37,85 m; windvaan als naald vanaf straal 0,45 m op 38,0 m tot 40,2 m (AHN NAP +40,9).

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Klaaswaal)): 1929, A. Visser, 38 m, 400 m³.
- BAG-pand 0611100000614296 (PDOK, 2026-11-06): bouwjaar 1929, ronde voetafdruk van 36 hoekpunten, straal 5,64 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +0,7 (west en zuid), rand van de kroonlijst NAP +35,2 op 5 m, kegel van 29 graden (NAP +36,6 op 3,5 m, +38,0 op 1 m), dopje NAP +38,3, windvaan NAP +40,9.
- 3D BAG (AHN5, 2024): maaiveld NAP +0,22, dak min NAP +34,2, nok NAP +38,5.
- PDOK-luchtfoto (Actueel_orthoHR): rond dak met een donkere kroonlijstring, een lichte kegel met radiale naden en een punt in het midden; de schuin weergegeven schacht toont aan de noordkant een vlakke zijde tussen twee lisenen.
- Foto's op Wikimedia Commons: "Klaaswaal - watertoren van dichtbij.jpg" (Quistnix, 2009; rechte banden met een knik op de lisenen, het ondervlak van het reservoir dat midden in de zijden uitkraagt, vensters), "Overzicht met de watertoren en het verdeelstation - Klaaswaal - 20413818 - RCE.jpg" (van ver, bijna orthografisch: kroonlijst, trommel, kegel, windvaan en de hoogtes van reservoir, voetlijst en vensterrij) en "Klaaswaal - watertoren en omgeving.jpg" (silhouet).

## Geschat en weggelaten

Geschat: de zeskantige schacht volgt uit de foto's (rechte banden met een knik op elke lisene, het uitkragende reservoir midden in de zijden); de BAG tekent een cirkel, die hier als omgeschreven cirkel door de lisenen is genomen. De verjonging (5,45 naar 4,6 m) volgt uit de kroonlijst in het AHN en de verhoudingen op de foto's. De hoogtes van de banden, de vensterrij, de voetlijst, het reservoir, de kroonlijst en de trommel komen van de RCE-foto (19 pixels per meter, geschaald op de kroonlijst van 10 m) en de foto uit 2009; de band onder de vensterrij staat 0,9 m lager dan op de foto (24,5 in plaats van 25,45 m) zodat de vensternissen onder het ondervlak van het reservoir zonder steun te printen zijn. De kleine vensters onder het reservoir zijn in het echt zes per zijde van circa 0,5 m; in het model vier nissen van 0,9 m. De trappenhuisvensters zijn in het echt circa 0,45 m breed en hun hoogtes zijn alleen op twee zijden te zien; de rest is om en om aangenomen. De stand van de deur (oost-noordoost, bij de verdiepte stoep) staat op geen foto en is onzeker. De lisenen zijn dieper en verlopen aan de voet breder dan in het model. De kraag onder de kroonlijst is in het echt vrijwel vlak; in het model 45 graden.

Weggelaten: de antennes en kabelgoten van de zendmast op het reservoir (dunne panelen, kleiner dan 0,9 m), de dunne stang van de windvaan (de naald staat voor de vaan), de verdiepte voegen in het metselwerk, en de lage bijgebouwen, schuurtjes en het woonhuis ernaast (eigen BAG-panden, blijven van PDOK).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand; het ondersteuningsobject is 0,004 mm³. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde ronde kolom van 38 m met een flauw tentdak) de zeskante verjongende schacht met lisenen en banden, het uitkragende ronde reservoir met voetlijst, de kroonlijst, de trommel, het kegeldak met dopje en windvaan, en de vensters en deur.

Controle-URL: http://localhost:3000/kaart/51.76851/4.44774/200/1x1/0
