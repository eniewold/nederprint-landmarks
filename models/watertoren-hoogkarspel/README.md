# Watertoren Hoogkarspel (Hoogkarspel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hoogkarspel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, lijsten en reservoirdeel zijn twaalfhoekige prisma's en afgeknotte piramides met verdiepte vlakken tussen de kolommen, de lijsten hebben schuine onderkanten, en kap en spits zijn convexe omhullenden van twaalfhoekige ringen (twaalf vlakken per ring, graten op de hoeken).

De watertoren aan de Streekweg 235 is in 1930 gebouwd voor het Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. B.F. van Nievelt en ir. W. Mensert (rijksmonument 495633). Volgens het register is hij 49,10 m hoog, twaalfhoekig, in rode baksteen rond een betonskelet van 24 kolommen, met reservoirs van 600 en 400 m³; hij is niet meer in gebruik. De schacht is verticaal geleed door de twaalf buitenste kolommen en horizontaal in drie delen met zware granieten lijsten: onder liggen muurwerk en kolommen in één vlak (granieten plint, per vlak twee smalle vensters), in het midden is het muurwerk tussen de kolommen sterk teruggemetseld (lichtspleten in zes vlakken, bovenaan per vlak een borstwering op een console), en het reservoirdeel is licht teruggemetseld met een lichtspleet per vlak. Daarop staat een sterk verjongende twaalfzijdige kap met leien en een gelijkvormige lantaarn met twaalf vierkante ramen. De toren staat op een aangeaarde sokkel; de ingang met dubbele deur, granieten latei en twee leeuwen kijkt naar het zuid-zuidoosten, naar de oprijlaan vanaf de Streekweg.

## Bestanden

- `watertoren-hoogkarspel.glb`: één node `building:twaalfkante-schacht-kap-lantaarn-en-ingang`, op de sokkel.
- `watertoren-hoogkarspel.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hoogkarspel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [140625.89, 523079.94] (52,69495 N, 5,17459 O), het hart van het twaalfhoekige BAG-pand (cirkelfit op de twaalf hoekpunten; straal 7,34 m, apothema uit het oppervlak 7,09 m). Het hart van het AHN-DSM boven 30 m ligt 0,1 m ernaast. Maaiveld op de sokkel AHN-DTM NAP +0,69 tot +0,87 in een ring van 7,5 tot 9 m (gebruikt +0,8); het bordes voor de ingang ligt op +0,72, het plein onder de trap op -0,4 en de omgeving rond de sokkel op -1,2. De hoekpunten van het BAG-pand staan op RD 1,75 + 30k graden; lokale +X is de normaal van een gevelvlak (RD 16,75 graden; `xAxis` [0.95757, 0.28820]) en de ingang zit in het vlak met normaal -Y (RD -73,25 graden, naar het bordes). `groundHeight` 43,12 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 8 m van het hart (43,12 tot 43,16), zodat het model op de sokkel staat en niet naar de voet van de aarden heuvel zakt; de heuvel zelf zit in het PDOK-terrein en niet in de GLB. Het model vervangt BAG-pand 0498100000000708, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:twaalfkante-schacht-kap-lantaarn-en-ingang`

Alle twaalfhoeken staan met hun hoekpunten op 15 + 30k graden; maten als apothema (hart tot gevelvlak), hoogtes boven de sokkel.

- Plint: 7,05 m tot 1,1 m, bovenkant onder 45 graden naar het onderste deel.
- Onderste deel: 6,85 m (13,7 m over de vlakken) tot 7,9 m. In elk vlak behalve de ingang een nis van 1,3 × 2,0 m (2,1 tot 4,1 m) voor het paar vensters. Granieten lijsten van 7,0 m van 4,7 tot 5,5 m en van 7,0 tot 7,9 m, met een onderkant van 45 graden.
- Middendeel: kolommen van 6,5 m op 7,9 m, verjongend tot 6,2 m op 24,6 m; tussen de kolommen (0,55 m langs het vlak aan weerszijden van elke hoek) ligt het muurwerk 0,45 m terug, met een plafond van 45 graden. Granieten basementen van 6,65 m om elke kolom (0,75 m langs het vlak) tot 8,7 m. Lichtspleten van 0,6 m van 9,2 tot 20,3 m in de zes vlakken op 0, 60, ..., 300 graden. Per vlak een borstwering van 21,8 tot 23,2 m, het voorvlak 0,1 m achter de kolommen en de onderkant onder 51 graden, met in het midden een console van 0,9 m vanaf 20,9 m.
- Overkragende granieten lijst tussen midden- en reservoirdeel: 6,5 m van 24,9 tot 26,0 m, onderkant onder 45 graden.
- Reservoirdeel: kolommen 6,15 m (12,3 m over de vlakken), recht, van 26,0 tot 33,6 m; muurwerk 0,2 m terug, in elk vlak een lichtspleet van 0,6 m van 27,4 tot 32,4 m.
- Kroonlijst: 6,35 m van 33,6 tot 34,9 m met een onderkant van 45 graden; op elke hoek een granieten hoekblok (0,6 m langs het vlak aan weerszijden) tot 35,8 m.
- Kap: twaalfzijdig en bol, apothema 5,45 m op 34,9 m, 5,17 op 37,0, 4,42 op 38,9, 2,96 op 40,85 en 2,23 m op 41,9 m.
- Lantaarn: voetring 2,05 m van 41,6 tot 42,3 m, trommel 1,8 m tot 43,7 m met twaalf raamnissen van 0,55 m (42,7 tot 43,25 m), lijst 2,0 m tot 44,0 m; twaalfzijdige spits van 1,75 m op 44,0 m tot 0,3 m op 46,2 m, met een makelaar tot 47,1 m.
- Ingang (vlak -Y): gemetselde omlijsting 0,4 m voor het vlak, 3,2 m breed tot 3,4 m, granieten latei 3,6 m breed tot 3,9 m (0,5 m voor het vlak); dubbele deur 1,6 × 2,7 m als nis; treden van 2,8 × 1,0 m tot 0,3 m; aan weerszijden een postament van 1,0 m met een leeuw als blok tot 1,9 m.

## Bronnen en maten

- [Rijksmonumentenregister 495633](https://monumentenregister.cultureelerfgoed.nl/monumenten/495633): ontwerpers, 49,10 m, twaalfhoekig grondplan, 24 kolommen, de drie delen van de schacht met hun mate van terugmetseling, lichtspleten (zes in het middendeel, twaalf in het reservoirdeel), borstweringen op consoles, granieten lijsten en basementen, de kap en de lantaarn met twaalf ramen, de aangeaarde sokkel met trap.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Hoogkarspel)): bouwjaar, hoogte en reservoirs.
- BAG-pand 0498100000000708 en BGT-pand G0388.f787b31f05eb47979d6bd14e792a84ae (PDOK, 2026-11-04): twaalfhoekige plattegrond, hart en stand.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): sokkel NAP +0,8, top NAP +47,7; het radiale profiel van de kap (r 5,0 m: NAP +38,8; 4,0: +40,3; 3,0: +41,6; 2,5: +42,1); gevelpunten in het DSM geven de verjonging van de schacht (circa 6,9 m onder, 6,6 midden, 6,3 m boven). Luchtfoto voor het bordes voor de ingang en de graten van de kap.
- Foto's op Wikimedia Commons: "WatertorenHoogkarspel" (van circa 90 m; perspectief gefit op de voet, de kroonlijst en de breedtes: hoogtes van plint, vensters, lijsten, basementen, spleten, borstweringen, consoles en de overkragende lijst), "Watertoren Hoogkarspel 20180712" (telelens, vrijwel orthografisch: breedte van het reservoirdeel, de kroonlijst, het profiel van de kap, de lantaarn en de spits; de schaal past op het AHN-profiel van de kap), "Ingang watertoren Hoogkarspel" (omlijsting, latei, deur, treden en leeuwen), "Watertoren Hoogkarspel" en "Hoogkarspel with water tower".

## Geschat en weggelaten

Geschat: de hoogtes van alle geledingen uit één foto met een perspectieffit (onzekerheid circa een halve meter), en de hoogte van de kroonlijst (35,8 m boven de sokkel) uit de telefoto en het AHN-profiel van de kap, omdat het DSM de rand van de kroonlijst niet scherp ziet; de verjonging van het middendeel (6,5 naar 6,2 m) uit gevelpunten in het DSM en de foto's, terwijl het reservoirdeel recht is gehouden; de kolombreedte en de diepte van de verdiepte vlakken (0,45 en 0,2 m, naar de omschrijving "sterk" en "licht" teruggemetseld); welke zes vlakken van het middendeel een lichtspleet hebben (hier de vlakken op 0, 60, ..., 300 graden, de ingang niet); de vorm van borstweringen, consoles, hoekblokken en de leeuwen; de treden en de omlijsting van de ingang uit één frontale foto.

Weggelaten: de brede bakstenen trap van het bordes naar het plein (op 15 m van het hart, ligt in het PDOK-terrein), de bloembakken op de zuilen naast die trap, de aarden sokkel zelf (terrein), de stalen deuren met een ruitje achter de borstweringen (boven de borstwering minder dan 0,9 m zichtbaar; een nis daar liet de export de ruimte onder de lijst opvullen), de penanten tussen de vensterparen (kleiner dan 0,9 m: één nis per vlak), de lantaarns naast de deur, de antenne en de luikjes op de kap. De lichtspleten zijn 0,6 m in plaats van circa 0,3 m breed.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: plint en lijsten met schuine onder- of bovenkant, basementen met een schuine bovenkant, verdiepte vlakken met een plafond van 45 graden, borstweringen onder 51 graden, consoles onder 69 graden, nissen met een plafond van 56 graden, kap en spits verjongend. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export, de voet 0,2 tot 0,5 m in het PDOK-terrein van de sokkel, zonder ondersteuningsobject; de PDOK-reconstructie van het pand is verborgen. Binnen 20 m van de toren staan geen andere panden (de schuurtjes op 21 m zijn geen BAG-pand), dus geen buurpand nam PDOK-hoogte van de toren mee. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde twaalfkant met een rand op 34,5 tot 36,2 m en een grove, scheve kap tot 47,1 m) de plint, de vensternissen en lijsten van het onderste deel, de kolommen met basementen, verdiepte vlakken, lichtspleten en borstweringen op consoles, de overkragende lijst, het reservoirdeel met spleten, de kroonlijst met hoekblokken, de bolle twaalfzijdige kap met lantaarn, ramen en spits, en aan de zuid-zuidoostkant de ingang met latei, treden en leeuwen.

Controle-URL: http://localhost:3000/kaart/52.69495/5.17459/200/1x1/0
