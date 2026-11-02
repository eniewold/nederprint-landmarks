# Watertoren Torenstraat (Helmond)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-helmond-torenstraat.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is de geëxtrudeerde BAG-contour, reservoir, lijst, afdekking en lichtkap zijn (verlopende) twaalfhoeken, de kraag onder het reservoir en het kegeldak omhulsels van twaalfhoeken, erkers, consoles, luifel en sierstukken omhulsels van rechthoeken; sleuven, vensterstroken en de glasstrook van de erkers zijn uitsparingen.

De watertoren aan de Torenstraat is in 1941 ontworpen door J.H.J. Kording en door de oorlog pas in november 1948 in gebruik genomen: 47,3 m hoog met een reservoir van 1200 m³, gemeentelijk monument (WN269). Hij staat leeg en draagt zendantennes. Een bakstenen schacht in de vorm van een kruis: vier vleugels van 4,2 m breed met getrapte binnenhoeken. In elke vleugel loopt een hoge vensterstrook in een getrapte sleuf, bovenaan een erker met een witte betonnen plaat en latei. Daarop staat het twaalfzijdige reservoir, met een hoek boven elke vleugel, op een witte lijst; in de binnenhoeken van de schacht rust het op een schuine betonnen kraag. Over elke hoek boven een vleugel staat een wit sierstuk: twee lisenen met een dwarsbalk boven en onder, een stompje eronder en een middenlijn tot de afdekking. Op het dak een teruggezette glazen lichtkap met een flauw kegeldak.

## Bestanden

- `watertoren-helmond-torenstraat.glb`: één node `building:schacht-erkers-reservoir-en-lichtkap`, op het maaiveld.
- `watertoren-helmond-torenstraat.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-helmond-torenstraat-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [173593.55, 388423.2], het hart van de BAG-contour van pand 0794100000353661 (145,9 m²): het midden tussen de voorvlakken van de tegenover elkaar liggende vleugels, 3 cm van het zwaartepunt. Op maaiveld (AHN-DTM NAP +17,08 m; 3D BAG 17,05). De vleugels staan in de BAG op 24,75 + 90k graden van RD-oost: lokale +X is de vleugel aan de oost-noordoostkant (`xAxis` [0.9081, 0.4187]). `groundHeight` 61,02 is NAP +17,08 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,94 m). Het model vervangt het pand, zodat het PDOK-blok (de kruisvormige BAG-contour als kolom tot circa 46 m met een grof dak) verdwijnt.

## Onderdeel `building:schacht-erkers-reservoir-en-lichtkap`

- Schacht: de BAG-contour, symmetrisch gemaakt. Vier vleugels van 4,2 m breed met het voorvlak op 8,55 m uit het hart; de binnenhoeken trappen in twee stappen van 0,67 m terug naar een schuin vlak van 0,87 m op 5,28 m uit het hart. De binnenhoek aan de oost-zuidoostkant (lokaal -45 graden, RD 340) is in de BAG niet getrapt maar recht afgeschuind (één vlak op 5,31 m) en staat zo in het model.
- Sleuf in elke vleugel: 2,8 m breed en 0,3 m diep vanaf het maaiveld, daarin de vensterstrook van 1,4 m breed en 0,6 m diep van 3,6 m tot onder de erker (25,4 m), plafonds onder 45 graden. In de deurvleugel (zuid-zuidwest, RD 205) loopt de strook door tot de grond, met een luifel van 5,7 m breed en 1,0 m diep op 2,2 tot 2,55 m (ondervlak onder 45 graden).
- Erker bovenaan elke vleugel: console van de vleugel naar de witte plaat (6,5 m breed, 1,0 m voor de vleugel) van 25,7 tot 26,9 m, plaat tot 27,5 m, borstwering, glasstrook (28,7 tot 30,5 m, 0,25 m terug) en latei 6,0 m breed tot 9,35 m uit het hart; de witte lijst springt boven de erker mee uit tot 9,55 m.
- Schuine kraag (41,8 graden uit het lood) van de binnenhoeken (vanaf 28,75 m) naar de onderkant van het reservoir.
- Witte lijst van 31,05 tot 32,4 m, 0,4 m uit het reservoir met een ondervlak van 45 graden.
- Reservoir: twaalfhoek van 16,2 m over de vlakken (hoeken op 8,4 m) van 32,4 tot 43,2 m, afdekking 0,2 m uit tot 43,75 m, met een goot van 1,0 m breed en 0,45 m diep rond de lichtkap.
- Sierstuk over elke reservoirhoek boven een vleugel, reliëf van 0,25 m: lisenen van 0,4 m op 0,6 m uit de hoek van 34,4 tot 41,75 m, dwarsbalken van 2,3 m breed op 34,15 en 41,6 m, een stompje van 0,5 m tot 33,3 m en een middenlijn van 0,4 m tot de afdekking.
- Lichtkap: twaalfhoek van 12,8 m over de vlakken tot 44,7 m, dakrand van 13,8 m tot 45,5 m en een kegeldak tot een twaalfhoek van 4 m op 46,7 m en de top op 47,05 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Helmond_Torenstraat)): ontwerper J.H.J. Kording, ontwerp 1941, in gebruik november 1948, 47,3 m, 1200 m³, nu leeg met zendantennes. Ontwerper en vorm komen overeen met de opdracht.
- BAG-pand 0794100000353661 (PDOK, bouwjaar 1948): de kruisvormige contour met de vleugels, de getrapte binnenhoeken en de afgeschuinde oost-zuidoosthoek.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +17,05 tot +17,19, afdekking NAP +60,9 (43,8 m), dakrand van de lichtkap NAP +62,6, top NAP +64,12 (47,0 m); de rand van het reservoir op 8,0 tot 8,4 m uit het hart, de erkers tot circa 9 m.
- 3D BAG (LoD2.2, AHN5) van pand 0794100000353661: maaiveld 17,05, dak 59,9 tot 63,9 (NAP), ter controle.
- Luchtfoto (PDOK): de lichtkap met kegeldak en goot, en de daken van de erkers die naast het reservoir uitsteken boven de vleugels.
- Foto "0794 WN269 Helmond Watertoren 2" (Wikimedia Commons), frontaal op een vleugel en perspectief gecorrigeerd: 25,3 px/m op het vleugelvlak, geschaald op de afdekking. Daaruit de hoogtes van lijst, erker, console, vensterstrook, luifel en sierstuk, de breedte van erker en sleuf, en dat het reservoir twaalfzijdig is met een hoek boven elke vleugel en even breed als de schacht.
- Foto's "0794 WN269 Helmond Watertoren", "Watertoren Helmond in 2022", "Helmond Watertoren 2483" en "Watertoren Torenstraat, Helmond" (1) en (2) (Wikimedia Commons): de erkers aan de zijkanten, de witte kraag in de binnenhoeken, de deur met luifel en de sleuven.

## Geschat en weggelaten

Geschat: de hoogtes en breedtes van erker, console, lijst, sierstuk, sleuf en luifel (uit één frontale foto, gecontroleerd tegen het AHN), de diepte van de erkers (luchtfoto en DSM, circa 0,8 m voor de vleugel), de vorm en helling van de kraag in de binnenhoeken (op de foto's wit en vlakker; in het model 41,8 graden uit het lood, zodat hij zonder steun print), de maat van het reservoir (DSM en foto: hoeken op 8,4 m), de diepte van de sleuven, de maat van de lichtkap en de goot, de plek van de deur (zuid-zuidwest, uit de lichtval op de foto "Helmond Watertoren 2483"; de andere vleugels hebben in het model geen deur), en de hoogte van de afgeschuinde binnenhoek (in het model over de hele schacht, zoals de BAG-contour).

Weggelaten: de vakwerkmast en de zendantennes op het dak en aan de gevels (later toegevoegd, geen deel van het monument), de kozijnen en roeden van de vensterstroken en de erkers, de witte banden naast de deur, de leuningen op het dak en de hekken rond het terrein.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,69 %: wiggen in de vier binnenhoeken onder de kraag naar het reservoir (27,8 tot 31 m), smalle randjes onder de consoles van de erkers en onder de luifel. Schacht, reservoir, sierstukken en lichtkap krijgen geen opvulling. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de kruisvormige BAG-contour als kolom tot het dak) het bredere twaalfzijdige reservoir met lijst, afdekking en sierstukken, de kraag in de binnenhoeken, de erkers met console en glasstrook, de sleuven met vensterstroken, de luifel boven de deur en de lichtkap met kegeldak.

Controle-URL: http://localhost:3000/kaart/51.48451/5.65483/200/1x1/0
