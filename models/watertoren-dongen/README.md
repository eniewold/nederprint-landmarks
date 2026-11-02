# Watertoren Dongen (Dongen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-dongen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, kraag, reservoirdeel en lisenen zijn geëxtrudeerde en verlopende achthoeken, het dak één convex omhulsel van achthoeken; vensters, deur en louvreband zijn nissen.

De watertoren aan de Watertorenstraat in Dongen is in 1923 gebouwd als eerste van dertien torens die H. Sangster (Hendrik Sangster) ontwierp voor de N.V. Waterleidingmaatschappij Noord-West-Brabant: 44,76 m hoog met een reservoir van 500 m³, in gebruik tot 1974. Een achtkante bakstenen schacht met brede betonnen hoeklisenen, op 27 m een kraag met een louvreband waarboven het reservoirdeel iets breder doorgaat, een kroonlijst en een achtkant koperen dak met een steile onderste band en een bolle kap. Bij de verbouwing tot woning en kantoor (afgerond 2024) kreeg de schacht vensterparen en hoge vensterkolommen, het dak acht dakkapellen en een lichtkap, en kwam er een stalen omloop om het reservoir.

## Bestanden

- `watertoren-dongen.glb`: één node `building:schacht-reservoir-en-koperen-dak`, op het maaiveld.
- `watertoren-dongen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-dongen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [123512.42, 406371.52], het zwaartepunt van de BAG-contour van pand 0766100000004972 (114,6 m², een achtkant met lisenen), op maaiveld (AHN-DTM NAP +2,70 m; 3D BAG 2,60). De hoeken van de achtkant (de lisenen) staan in de BAG-contour op 3 graden linksom van RD-oost: lokale +X is de oostelijke lisene (`xAxis` [0.9986, 0.0523]), de vlakken staan op 22,5 + 45k graden. `groundHeight` 46,49 is NAP +2,70 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,79 m). Het model vervangt het pand, zodat het PDOK-blok verdwijnt; de lage aanbouw uit 2024 aan de oostkant (pand 0766100000137393) blijft van PDOK.

## Onderdeel `building:schacht-reservoir-en-koperen-dak`

- Schacht: achthoek van 11,6 m over de vlakken aan de voet (BAG), 2,4 % taps tot 11,32 m op 27,0 m.
- Acht hoeklisenen (BAG-contour): voorvlak van 0,76 m op 6,55 m uit het hart met schuine wangen naar de muurvlakken, mee taps; op 27,0 tot 29,6 m knikken ze onder 13 graden naar buiten en lopen recht door tot de kroonlijst.
- Kraag: de muurvlakken springen van 27,0 tot 27,7 m 0,51 m uit (36 graden) naar het reservoirdeel van 12,34 m over de vlakken; daarin per vlak een louvreband van 2,6 × 0,6 m (28,2–28,8 m).
- Kroonlijst van 12,8 m over de vlakken op 39,3–39,9 m.
- Dak: steile onderste band (57 graden) van de dakvoet op 39,85 m tot 42,7 m, bolle kap in drie knikken (43, 30 en 16 graden) tot 44,75 m; acht dakkapellen van 1,3 m breed met een plat dak op 42,9 m; vierkante lichtkap van 1,6 m tot 45,9 m.
- Vensters (nissen van 0,3 m met plafonds van 56 graden), om en om per vlak: op de vier vlakken naar 25,5, 115,5, 205,5 en 295,5 graden (RD) vensterparen van 0,85 × 1,7 m op zeven verdiepingen van 3,4 m vanaf 3,6 m; op de andere vier een hoge vensterkolom van 1,6 × 9 m (17,0–26,0 m) en een lagere van 1,6 m breed (2,4–8,4 m). In het reservoirdeel per vlak een venster van 0,9 × 1,2 m op 32,6 m.
- Deur aan de west-noordwestkant (RD 160,5 graden, naar de oprit): 1,8 m breed met een spitse top op 3,7 m (50 graden), daarboven het lage hoge venster vanaf 4,0 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Dongen)): bouwjaar, ontwerper (H. Sangster, eerste van dertien torens voor de WNWB), 44,76 m, 500 m³, verbouwing 2003–2008 en later. De ontwerper staat zo in het artikel; de achtkante vorm met lisenen past bij de andere Sangstertorens.
- AHN5 DSM/DTM 0,5 m (PDOK, 2024, na de verbouwing; opgehaald 2026-11-02): maaiveld NAP +2,58 tot +2,82, dakrand NAP +42,1 tot +42,7, kap NAP +45,5 op r 4,5 en +47,06 op r 2, lichtkap NAP +48,56 (45,9 m boven maaiveld), omloop NAP +34 tot +35,1 tot r 9.
- 3D BAG (LoD2.2, AHN5) van pand 0766100000004972: maaiveld 2,60, dak 42,5 tot 47,6, nok 47,97 (NAP); ter controle.
- BAG-pand 0766100000004972 en luchtfoto (PDOK): het hart, de stand van de achtkant (3 graden), de lisenen, de dakkapellen en de omloop.
- Foto "Dongen Watertoren 2208" (Wikimedia Commons, 2005), frontaal over een lisene: tapsheid, kraag, reservoirdeel, kroonlijst en dakprofiel, geschaald op de breedte over de lisenen aan de voet (13,1 m, 31,7 px/m); de kap komt op 44,6 m.
- RCE-foto 20335210 (2003): kraag, louvreband, kroonlijst en dak van opzij.
- Foto's "Watertoren Dongen 4, 6, 8, 9 en 11" (Wikimedia Commons, 2024): vensterparen en hoge vensterkolommen om en om, de deur met de spitse rollaag, de dakkapellen, de lichtkap en de omloop.

## Geschat en weggelaten

Geschat: de tapsheid en de breedte van het reservoirdeel (uit één frontale foto), de hoogte van kraag, kroonlijst en dakband (foto, gecontroleerd tegen het AHN), het dakprofiel tussen de AHN-punten, de maat en stand van de dakkapellen en de lichtkap, de verdeling van vensterparen en hoge vensters over de vlakken (de foto's tonen ze om en om; welk vlak welk type heeft, komt uit de luchtfoto voor twee vlakken en is voor de rest doorgetrokken), de verdiepingshoogte (3,4 m), de plek van de deur (west-noordwest, naar de oprit) en de diepte van de nissen (0,3 m).

Weggelaten: de stalen omloop om het reservoir (ring van 17,8 m, circa 1 m breed, dek op circa 31,3 m) met zijn schoren en het bordes naar de deur in het reservoir. Hij hangt 1 tot 2,7 m vrij van de gevel; in een eerste versie met de ring als dichte band op acht schoren vulde de 45-gradenopvulling hem op tot een mantel tot de onderplaat (volume +37 %), net als bij de zwevende hotelring van Sint Jacobiparochie die op verzoek van de gebruiker is weggehaald. Verder weggelaten (kleiner dan 0,9 m of te dun): de horizontale sleuven onder de kroonlijst, de koperen graten en de dakramen in de kap, de afzonderlijke louvrelatten, de Franse balkons, de spitse baksteenomlijsting van de deur, antennes en de bliksemafleider.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,004 %: alleen een sliertje in de louvreband. De doorsneden van 1 tot 45,5 m blijven gelijk. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (3D BAG LoD2.2: een achtkante kolom met een grof, scheef dak) de tapse schacht, de kraag met louvreband en het bredere reservoirdeel, de kroonlijst, het achtkante dak met dakkapellen en lichtkap, en de vensters en de deur.

Controle-URL: http://localhost:3000/kaart/51.64532/4.93232/200/1x1/0
