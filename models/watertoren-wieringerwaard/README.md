# Watertoren Wieringerwaard (Wieringerwaard)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-wieringerwaard.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, reservoirommanteling en lijsten zijn twaalfhoekige prisma's en afgeknotte piramides met verdiepte vlakken tussen de kolommen, de lijsten en consoles hebben schuine onderkanten, en de kap is de convexe omhullende van twaalfhoekige ringen (twaalf vlakken per ring, graten op de hoeken).

De watertoren ten westen van de Molenweg is in 1927-1928 gebouwd voor het Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. B.F. van Nievelt en ir. W. Mensert (rijksmonument 512096; Wikipedia schrijft "Van Nieveld"), in de stijl van de Amsterdamse School en de art deco. Volgens het register is hij 49,30 m hoog (Wikipedia: 51,3 m, de hoogste watertoren van Noord-Holland), met een twaalfhoekige schacht op een betonskelet van twaalf binnen- en twaalf buitenkolommen, deels in het zicht en deels in rode baksteen. De voet is tot 3,81 m extra zwaar uitgevoerd: gebatterde hoekpenanten, granieten banden, een dubbele ingangsdeur met vensters in de vlakken ernaast. In vier vlakken van de schacht zit een smalle lichtopening van circa 16 m. De iets uitkragende reservoirommanteling (dubbel reservoir van 600 + 400 m³, diameter 12,00 m) staat op consoles en een zware granieten lijst; het lage deel heeft twee smalle spleten per vlak, boven een granieten band staan 24 kolommen, twee aan weerszijden van de circa 9,50 m hoge lichtopeningen op de hoeken. Daarop een kroonlijst met hoekblokken, een twaalfzijdige kap met een steile betonnen voet en een leien bovendeel, en een art-deco-makelaar. Sinds 1996 is hij buiten gebruik.

## Bestanden

- `watertoren-wieringerwaard.glb`: één node `building:twaalfkante-schacht-reservoir-kap-en-ingang`, op maaiveld.
- `watertoren-wieringerwaard.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-wieringerwaard-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [119502.76, 539373.85] (52,84041 N, 4,86039 O), het hart van het twaalfhoekige BAG-pand (cirkelfit op de twaalf hoekpunten; straal 7,34 m, apothema uit het oppervlak 7,09 m); de top in het AHN-DSM ligt 0,1 m ernaast. Maaiveld AHN-DTM NAP -0,9 (ring van 7,5 tot 9 m: -1,2 tot -0,8, mediaan -0,96; voor de ingang -0,9). De hoekpunten van het BAG-pand staan op RD 5,26 + 30k graden (gemiddelde van de twaalf); lokale +X is de normaal van een gevelvlak (RD 80,26 graden; `xAxis` [0.16918, 0.98559]) en de ingang zit in het vlak met normaal -Y (RD -9,74 graden, naar het pad en het erf aan de oostkant; luchtfoto en de foto's met het pompgebouw uit 1950 rechts van de toren). `groundHeight` 41,22 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de drie `groundSamplePoints` op 8,5 m van het hart (noord 41,34, west 41,22, oost voor de ingang 41,34); het punt aan de zuidkant (41,11, het terrein zakt daar naar de vijver) telt niet mee, anders verdwijnen de treden in het terrein. Het model vervangt BAG-pand 0366100000001644, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:twaalfkante-schacht-reservoir-kap-en-ingang`

Alle twaalfhoeken staan met hun hoekpunten op 15 + 30k graden; maten als apothema (hart tot gevelvlak), hoogtes boven maaiveld.

- Voet: muurwerk 6,85 m tot 3,85 m; hoekpenanten (0,8 m langs het vlak aan weerszijden van elke hoek) gebatterd van 7,3 m aan de voet naar 7,05 m op 2,6 m, met een schuine bovenkant. Granieten banden van 7,0 m van 1,25 tot 1,55 m, van 2,6 tot 2,9 m en van 3,45 tot 3,85 m, met een onderkant van 45 graden.
- Ingang (vlak -Y): granieten omlijsting 0,15 m voor het vlak, 2,3 m breed tot 3,3 m; dubbele deur 1,5 m breed van 0,5 tot 2,95 m als nis van 0,5 m; twee treden van 2,4 m breed tot 0,25 en 0,5 m. In de twee vlakken ernaast een venster van 1,0 m van 1,65 tot 2,35 m als nis.
- Schacht: kolommen van 6,75 m (13,5 m over de vlakken) van 3,85 tot 24,4 m, 0,7 m langs het vlak aan weerszijden van elke hoek; het muurwerk ertussen 0,3 m terug, met een plafond van 45 graden. Granieten blokken van 6,95 m aan de voet van de kolommen tot 4,6 m. Lichtopeningen van 0,4 m van 7,0 tot 23,0 m in de vier vlakken op 0, 90, 180 en 270 graden (ook boven de ingang).
- Consoles: 6,95 m op elke kolom van 23,4 tot 24,4 m, onderkant onder 45 graden.
- Reservoirlijst: 7,35 m van 24,4 tot 25,5 m met een onderkant van 45 graden vanaf de schacht.
- Reservoirommanteling: 7,1 m (14,2 m over de vlakken) van 25,5 tot 37,6 m. Laag deel met twee spleten van 0,35 m per vlak (0,95 m naast het midden, 26,0 tot 27,5 m); granieten band van 7,25 m van 28,0 tot 28,5 m met blokken aan de voet van de kolommen tot 29,0 m; hoog deel met kolommen van 0,8 m langs het vlak vanaf elke hoek, het vlak ertussen 0,2 m terug, en op elke hoek tussen de twee kolommen een lichtopening van 0,4 m breed en 0,45 m diep van 29,0 tot 37,0 m.
- Kroonlijst: 7,25 m van 37,6 tot 38,3 m met een onderkant van 45 graden; op elke hoek een hoekblok (0,6 m langs het vlak aan weerszijden) tot 38,8 m.
- Kap: twaalfzijdig, apothema 6,6 m op 38,3 m, 6,3 op 39,0, 5,3 op 41,2 (steile betonnen voet, circa 64 graden) en 0,35 m op 46,4 m (leien, circa 47 graden).
- Makelaar: twaalfzijdig in treden, 0,55 m van 46,0 tot 47,3 m, 0,45 m tot 48,3 m en een punt op 49,3 m.

## Bronnen en maten

- [Rijksmonumentenregister 512096](https://monumentenregister.cultureelerfgoed.nl/monumenten/512096): bouwjaren, ontwerpers, aannemer, 49,30 m, twaalfhoekige schacht met 12 + 12 kolommen, zware voet tot 3,81 m, vier lichtopeningen van circa 16 m, reservoir van 12,00 m met 24 kolommen en lichtopeningen van circa 9,50 m, kap van beton en hout met leien, dubbele ingangsdeur.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Wieringerwaard)): hoogte 51,3 m, reservoirs en buitengebruikstelling.
- BAG-pand 0366100000001644 (PDOK, 2026-11-04): twaalfhoekige plattegrond, hart en stand.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP -0,9, het profiel van de kap (apothema 5,9 tot 6,3 op NAP +38, 5,3 op +40, 4,5 op +41, 3,7 op +42, 2,9 op +43, 2,1 op +44, 1,2 op +45), top van de kap NAP +45,8, makelaar +47,8, ommanteling tot circa 7,15 m. Luchtfoto voor de ingang (bestrating aan de oostkant) en de graten van de kap.
- Foto's op Wikimedia Commons: "Watertoren van Wieringerwaard vanaf Veerweg" (telelens van circa 2 km, vrijwel orthografisch; schaal 39,5 px/m uit de kap op het AHN: hoogtes van alle geledingen en de breedtes van schacht en ommanteling; de lichtopeningen op de hoeken meten er 9,6 m), "2024 Wieringerwaard, wettertoer" (telelens: kap met steile voet, spleten en banden), "Wieringerwaard - Watertoren" (frontaal op de ingang: voet, penanten, banden, deur, vensters, consoles, lijst, spleten en hoekopeningen), "Watertoren Wieringerwaard" en "Wieringerwaardva.walingsweg".

## Geschat en weggelaten

Geschat: de hoogtes van alle geledingen uit één telefoto met een schaal die op het AHN-profiel van de kap en de registerhoogte past (onzekerheid circa een halve meter); de maten van de voet, de banden, de deur en de vensters uit een schuine frontale foto; de breedte van schacht en ommanteling (6,75 en 7,1 m) uit de telefoto en het DSM; de kolombreedtes en de diepte van de verdiepte vlakken (0,3 en 0,2 m); welke vier vlakken een lichtopening van 16 m hebben (hier die boven de ingang en de drie op 90 graden daarvan); de vorm van de makelaar en de hoogte van de punt (49,3 m, de registerhoogte; het DSM ziet de dunne top tot 48,7 m boven maaiveld).

Weggelaten: de lantaarns naast de deur, de antenne en de luikjes op de kap, de goot tussen kroonlijst en kap (kleiner dan 0,9 m), de vensters in de overige vlakken van de voet (op de foto's niet te zien), en het pompgebouw uit 1950 ten noorden van de toren (eigen BAG-pand, PDOK-reconstructie op de AHN-hoogte). De lichtopeningen zijn 0,4 m in plaats van circa 0,25 m breed en de spleten in het lage reservoirdeel 0,35 m in plaats van circa 0,15 m.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: banden, consoles, reservoirlijst en kroonlijst met een onderkant van 45 graden, verdiepte vlakken met een plafond van 45 graden, nissen en hoekopeningen met een plafond van 56 graden, kap en makelaar verjongend. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export, de voet 0,1 tot 0,35 m in het PDOK-terrein en de treden voor de ingang erboven, zonder ondersteuningsobject; de PDOK-reconstructie van het pand is verborgen. Het pompgebouw ten noorden staat in PDOK op de AHN-hoogte (NAP +5,2 tegen AHN p90 +5,0), dus geen buurpand nam PDOK-hoogte van de toren mee. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde twaalfkant met een grove, scheve kap tot 48,2 m) de voet met penanten, banden, deur en vensters, de kolommen met verdiepte vlakken en lichtopeningen, de consoles en de overkragende reservoirlijst, het lage reservoirdeel met spleten, de band, de kolommen met hoekopeningen, de kroonlijst met hoekblokken, de kap met steile voet en de makelaar.

Controle-URL: http://localhost:3000/kaart/52.84041/4.86039/200/1x1/0
