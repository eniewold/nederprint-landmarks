# Watertoren Scherpenisse (Scherpenisse)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-scherpenisse.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, lijst en schacht zijn achtkante prisma's en afgeknotte piramides (convexe omhullenden van twee achthoeken), het reservoir, de kroonlijst, het kegeldak en het kapje omwentelingsvormen van een radiaal profiel (96 segmenten), het bordes blokken, de omlijstingen en dakkapellen convexe omhullenden en de velden, vensters en de deur blinde nissen met een schuin plafond.

De watertoren aan de Langeweg 41 in Scherpenisse (gemeente Tholen) werd in 1922 tot 1923 gebouwd voor de N.V. Waterleidingmaatschappij Tholen, naar ontwerp van N.V. MABEG (Mobeg) uit Utrecht; aannemer was de Z.N. Beton Mij. uit 's-Hertogenbosch. Hij is rijksmonument 496127, volgens Wikipedia 52,4 m hoog, heeft een reservoir van 350 m³, ging in 1993 buiten gebruik en is sinds 1996 een woonhuis. De toren is geheel van beton, met invloed van het classicisme: een achtkante, taps toelopende schacht van acht betonnen kolommen met verdiepte velden ertussen, in vier geledingen door drie eenvoudige banden, een geprofileerde lijst tussen onderbouw en schacht, een ingang met een houten deur onder een gevelsteen (1911 en 1923) in een klassieke omlijsting met segmentvormig fronton, dezelfde omlijsting om de vensters van de onderbouw, een uitkragend rond reservoir met een brede overstekende kroonlijst en een kegeldak met dakkapellen.

## Bestanden

- `watertoren-scherpenisse.glb`: één node, `building:watertoren-onderbouw-schacht-reservoir-dak-en-dakkapellen`.
- `watertoren-scherpenisse.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-scherpenisse-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [66490.16, 396239.29] (51,54814 N, 4,11112 O), het hart van BAG-pand 0716100000106925, een regelmatige achthoek met apothema 5,63 tot 5,67 m en zijden van 4,62 tot 4,75 m; het hart van het dak in het AHN-DSM ligt er minder dan 0,1 m naast. Het pand is in BAG en PDOK alleen de toren. Lokale +X wijst naar RD-richting 3,5 graden: de gevels staan op 3,5 + 45k graden (gemiddelde normaal van de acht BAG-zijden, 3,2 tot 3,9 graden). De ingang zit in de zuidgevel (lokaal -Y), waar in het AHN een bordes van NAP circa +1,1 tot +1,6 tot 7,2 m van het hart ligt en op de luchtfoto het pad naar de Langeweg. De vier dakkapellen staan op de gevelrichtingen 0, 90, 180 en 270 graden lokaal (luchtfoto).

`groundSamplePoints` liggen op 8 m oost, 8 m noord, 9,5 m west (voorbij de lage aanbouw) en 8,5 m zuid (voor het bordes); `groundHeight` 44,209 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (44,21 tot 44,75, gemeten 2026-11-06). Het laagste punt rond de toren, noordwest op 8 m, ligt op 43,98; dat valt binnen de 0,3 m die de voet onder z = 0 doorloopt. Ellipsoïdisch min NAP is hier circa 44,2, dus z = 0 ligt op NAP +0,01 (AHN-DTM rond de voet NAP -0,3 tot +0,6; 3D BAG-maaiveld -0,13). `groundOffsetMetres` is -0,1.

## Onderdelen

Apothema's (achthoek) en stralen (rond), hoogtes boven z = 0 (ongeveer NAP).

- Onderbouw: achthoek met apothema 5,65 m (BAG) tot 6,5 m. Bordes aan de zuidkant van 3,6 m breed, bovenkant 1,2 m tot 6,4 m van het hart, drie treden tot 7,2 m. Ingang: omlijsting van 2,6 m breed, 0,3 m uit de gevel, van het bordes tot 4,6 m met een segmentfronton tot 5,4 m; deur van 1,3 m tot 3,5 m met een segmentboog tot 3,85 m, als nis van 0,4 m in de omlijsting. Vensters aan de oost-, noord- en westkant: omlijsting van 2,0 m van 1,8 tot 4,4 m met fronton tot 4,9 m (onderkant onder 50 graden), venster van 1,0 m van 2,1 tot 3,9 m met segmentboog.
- Lijst: 5,9 m van 6,5 tot 7,0 m met een onderkant van 50 graden.
- Schacht: afgeknotte achtkante piramide van apothema 5,4 m op 7,0 m tot 4,55 m op 29,6 m. Per gevel en geleding (grenzen 7,0, 12,7, 18,6, 24,25 en 29,6 m) een verdiept veld van 0,3 m tussen hoekkolommen van 0,8 m per gevel en banden van 0,45 m boven en onder elke grens; de bovenste velden tot 28,3 m met een segmentboog tot 28,85 m. Vensters van 1,0 m (nis van 0,3 m in het veld): in de onderste en derde geleding op de schuine gevels, in de tweede en bovenste op de hoofdrichtingen.
- Uitkraging: kegel van 58 graden van 4,4 m op 29,55 m naar de onderste ring van het reservoir, 5,4 m op 31,0 m.
- Reservoir: onderste ring 5,4 m tot 32,9 m, band 5,65 m van 32,9 tot 33,5 m (onderkant 50 graden), bovenste ring 5,3 m tot 40,9 m.
- Kroonlijst: onderkant onder 50 graden van 5,3 m op 40,9 m tot 6,1 m op 41,85 m, rand tot 42,9 m (3D BAG NAP +42,9; luchtfoto 12,1 m breed), bovenkant vlak tot de dakvoet.
- Dak: rechte kegel z = 50,55 - 1,58 r (58 graden) uit het AHN-DSM, van 4,85 m op 42,9 m tot het kapje.
- Dakkapellen: vier, voorgevel op 5,1 m, 1,8 m breed, van de kroonlijst tot 44,4 m met een segmentfronton tot 45,05 m en een dak met dezelfde boog tot in de kegel; venster van 0,9 m met segmentboog als nis.
- Kapje: 0,75 m van het dak tot 51,6 m, met een punt van 45 graden tot 52,35 m (AHN-piek NAP +52,44, Wikipedia 52,4 m).

Lijst, band en kroonlijst hebben een onderkant van 50 graden, de uitkraging 58 graden; de nissen en velden hebben een plafond dat naar binnen onder 56 graden of steiler oploopt.

## Bronnen en maten

- [Rijksmonumentenregister 496127](https://monumentenregister.cultureelerfgoed.nl/monumenten/496127): 1922-1923, N.V. Mobeg Utrecht, Z.N. Beton Mij. 's-Hertogenbosch, beton, achtkant op acht kolommen met verdiepte velden, drie banden, geprofileerde lijst, ingang en vensters met een omlijsting met segmentfronton, uitkragend reservoir van 350 m³ met overstekende kroonlijst, kegeldak met dakkapellen.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Scherpenisse)): 1922, MABEG, 52,4 m, 350 m³, buiten gebruik 1993, woonhuis sinds 1996.
- BAG-pand 0716100000106925 (PDOK, 2026-11-06): achthoekige voetafdruk, bouwjaar 1923.
- 3D BAG (LoD2.2 uit AHN5, 2024): platte ring op NAP +42,9 rond de kegel, kegel tot NAP +50,6, maaiveld NAP -0,13.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): dakprofiel per halve meter straal (3,0 m +45,73, 2,0 m +47,31, 1,0 m +48,95), piek NAP +52,44, bordes (NAP +1,1 tot +1,6), maaiveld. Het DSM ziet de buitenste meter van de kroonlijst niet (koperen afdekking).
- PDOK-luchtfoto (Actueel_orthoHR): kroonlijst 12,1 m breed, vier dakkapellen, kapje, pad naar de ingang.
- Foto's: "Karakteristieke landschappen, watertorens, Bestanddeelnr 164-0197.jpg" (Nationaal Archief op Wikimedia Commons, bijna recht van opzij; 0,035 m per pixel, geschaald op de kroonlijst en verankerd op de bovenkant van de kroonlijst uit het AHN: hoogtes van lijst, banden, schachttop, uitkraging, band en kroonlijst, breedtes van schacht en reservoir, velden met segmentbogen in de bovenste geleding, dakkapellen), "Scherpenisse Watertoren 6921.JPG" (2008, recht voor de ingang: bordes, deur met omlijsting en fronton, lijst, vensters, uitkraging, kroonlijst, kapje) en "Scherpenisse - molen De Korenbloem kaalgezet.jpg" (silhouet van verre).

## Geschat en weggelaten

Geschat: de hoogtes van lijst, banden, schachttop, uitkraging, band van het reservoir en onderkant van de kroonlijst uit één foto met een vaste schaal (circa een halve meter); de apothema's van de schacht (5,4 tot 4,55 m) en de stralen van het reservoir (5,4 en 5,3 m) uit breedteverhoudingen op die foto (circa 0,3 m); de breedte van de hoekkolommen en de maat van de velden; welke velden een venster hebben (de foto's tonen twee kanten, de rest is in hetzelfde verspringende patroon aangevuld); de plaats van de vensters in de onderbouw (oost, noord, west; het register noemt ze, de foto's tonen ze niet); de maten van bordes, omlijsting, deur, dakkapellen en kapje uit foto's en luchtfoto.

Weggelaten: de smalle spleetvensters in de bovenste ring en de ronde venstertjes in de onderste ring van het reservoir (smaller dan 0,9 m), de roeden en kozijnen, de gevelsteen met de jaartallen, de lijstjes in de velden, de stalen leuning en het hek voor de ingang, antennes en de dunne makelaar op het kapje (de oude spits is er niet meer: het AHN meet een kapje tot NAP +52,4), en de lage aanbouwen buiten het BAG-pand: aan de westkant een strook van circa 2 m hoog (in het AHN NAP +2,2) en aan de zuidwestkant een schuur met zonnepanelen (alleen op de nieuwste luchtfoto; in het AHN maaiveld), allebei zonder BAG-pand en met een onzekere vorm.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) voegt de 45-gradenopvulling, zoals de export die doet, alleen splinters van samen 0,04 m³ toe in de schouders van de segmentbogen van de bovenste velden (ook een hogere of ronde boog hield ze). Een preview-export op 1:1000 (uitsnede van 80 m rond de toren, steun v2, 45 graden) bevat het model met hetzelfde volume als zonder steun en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte achtkante zuil met een punt) de taps toelopende schacht, de onderbouw met lijst, bordes, ingang en vensters in omlijstingen, de velden tussen de hoekkolommen met vensters, de uitkraging naar het smallere ronde reservoir met band en overstekende kroonlijst, het kegeldak met vier dakkapellen en het kapje.

Controle-URL: http://localhost:3000/kaart/51.54814/4.11112/200/1x1/0
