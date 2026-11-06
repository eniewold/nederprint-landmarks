# Watertoren Oost-Souburg (Oost-Souburg)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oost-souburg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, banden, bovenbouw (achthoek met afgeschuinde hoeken), liseenen, lateiplaten, vensters en paviljoen zijn benoemde prisma's en hulls, de vensters en de deur blinde nissen.

De watertoren aan de Vlissingsestraat 239 werd in 1939 gebouwd in zakelijk-expressionistische stijl naar ontwerp van ir. J.H.J. Kording, voor de N.V. Waterleiding Maatschappij "Midden-Zeeland". Hij is 35 m hoog, heeft een rond betonnen vlakbodemreservoir van 450 m³ en is rijksmonument 508771. Tot 1966 lag hij in de gemeente Vlissingen; nu is het een expositieruimte (Buro Beeldende Kunst). De toren staat er nog (BAG-pand 0718100000008321 in gebruik, bouwjaar 1939; AHN en luchtfoto). Een betonskelet met een rode bakstenen mantel op een vierkante plattegrond; het bovenste deel ter hoogte van het reservoir verjongt zich en heeft afgeschuinde hoeken, tussen twee betonbanden. Op het platte dak staat sinds circa 2009 een glazen paviljoen met een overkapt terras (foto 2010, AHN, luchtfoto).

## Bestanden

- `watertoren-oost-souburg.glb`: één node, `building:watertoren-schacht-band-bovenbouw-liseen-en-paviljoen`.
- `watertoren-oost-souburg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-oost-souburg-1-1000.stl`: het model op 1:1000 (12,2 × 12,8 × 34,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [30678.03, 386900.38] (51,457453 N, 3,598311 O): het hart van de BAG-rechthoek van pand 0718100000008321 (11,40 × 11,62 m; het vijfde hoekpunt ligt op een zijde), op het maaiveld: AHN-DTM NAP −0,1 rond de voet, het pad voor de ingang NAP +0,3 tot +0,6. Het AHN-DSM ligt in het stelsel van de toren binnen ±5,7 m, dus de BAG-rechthoek is de buitenmaat van de onderbouw.

De lokale X-as loopt langs de BAG-zijde van 11,40 m naar het noordoosten (`xAxis` [0.55904, 0.82909], RD-hoek 56,01 graden): +X is de noordoostgevel, +Y de noordwestgevel, −X de zuidwestgevel en −Y de zuidoostgevel met de ingang.

`groundSamplePoints` liggen op 7,5 m in de vier asrichtingen; `groundHeight` 44,205 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (+X 44,25, −X 44,205, +Y 44,228, −Y 44,608 op het pad voor de ingang, gemeten 2026-11-06). PDOK-terrein min AHN-DTM is daar 44,27 tot 44,33, dus z = 0 ligt op NAP −0,08. `groundOffsetMetres` is −0,1. De buurpanden (2006 tot 2009) liggen 15 m en verder weg en raken het model niet.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP −0,08).

- Onderbouw: 11,40 × 11,62 m (BAG) tot 20,1 m.
- Betonband: 20,1 tot 20,85 m, 0,15 m uit de gevel, onderkant van 50 graden naar de gevel.
- Bovenbouw: 0,35 m terug (10,70 × 10,92 m) met afgeschuinde hoeken (benen van 1,5 m), van 20,85 m tot de dakrand.
- Dakrand: betonband van 29,25 tot 29,85 m (AHN NAP +29,77), 0,15 m uit de gevel en de afschuiningen, onderkant van 50 graden.
- Per gevel, in het midden: een overhoeks hoog venster als V van 1,2 m breed die 0,3 m uit de gevel steekt (3,7 tot 17,1 m, onderkant van 53 graden); een getrapte lateiplaat (2,55 m breed, 0,4 m uit de gevel, bovenkant 17,7 m) met een blok van 1,76 m tot 18,05 m; een liseen van 1,76 m breed met het buitenvlak gelijk aan de banden, van 18,05 m tot 0,3 m boven de dakrand (30,15 m); aan weerszijden van de liseen een kort venster onder de band (18,3 tot 19,85 m) en een hoog smal venster in de bovenbouw (20,95 tot 28,1 m), nissen van 0,6 m breed en 0,3 m diep.
- Ingang op de zuidoostgevel: deur als nis van 1,4 × 2,4 m, 0,4 m diep, onder een luifel van 2,2 m breed die 0,8 m uitsteekt (bovenkant 3,2 m).
- Glazen paviljoen op het dak: 9,2 × 9,5 m tot 33,78 m (AHN NAP +33,6 tot +33,7), met op de oosthoek een glazen kop die tot 5,25 / −5,35 m van het hart over de afgeschuinde hoek steekt, en aan de noordoostkant een terras van 1,1 m diep onder de doorlopende overkapping (glaswand tot 32,2 m).

Nissen hebben een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Oost-Souburg)): 1939, J.H.J. Kording, 35 m, 450 m³; stukje Vlissingsestraat in 1976 afgesloten; expositieruimte.
- [Rijksmonumentenregister 508771](https://monumentenregister.cultureelerfgoed.nl/monumenten/508771): vierkante plattegrond, 35 m; betonskelet met een niet-dragende rode bakstenen mantel; zuidoostgevel met ingangspartij, eenvoudige luifel en blankhouten deur; daarboven een hoog, overhoeks geplaatst stalen venster en een liseenachtig element tot de dakrand met aan weerszijden een smal hoog venster; het bovenste deel verjongt zich met afgeschuinde hoeken, met een betonnen band aan het begin van de verjonging en bovenaan; de andere drie gevels gelijk zonder ingang; plat dak.
- BAG-pand 0718100000008321 (PDOK, 2026-11-06): bouwjaar 1939, rechthoek 11,40 × 11,62 m; het id uit de taak klopt.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP −0,1; dakrand NAP +29,7 tot +29,9 op de randcellen; dak van het paviljoen NAP +33,6 tot +33,7 over 9 × 9 m, op de oosthoek tot 5,3 m van het hart; hoogste cel 34,3.
- PDOK-luchtfoto (Actueel_orthoHR): paviljoen met terras en hekwerk, ommuurd vak met een lage betonwand tegen de noordoostgevel.
- Foto's op Wikimedia Commons (categorie "Watertoren (Oost-Souburg)"): "Oost-Souburg-Vlissingsestraat 239-ro3253.jpg" (2010, van het noordoosten, met paviljoen), "Oost-Souburg-Vlissingsestraat 239-detail-ro3251.jpg" (detail van de noordoostgevel: band, korte vensters, lateiplaat, overhoeks venster) en "Overzicht watertoren - Oost-Souburg - 20342496 - RCE.jpg" (van het oosten met het maaiveld, voor het paviljoen).

## Geschat en weggelaten

Geschat: alle hoogtes onder de dakrand (band, vensters, lateiplaat, luifel, deur) en de terugsprong (0,35 m), de afschuining (1,5 m, uit de verhouding van schuine en rechte zijde op de RCE-foto: 0,28), de breedte van de liseen (1,76 m) en de lateiplaat (2,55 m), uit de drie foto's geschaald op de BAG-breedte en de dakrand uit het AHN. Het overhoekse venster is 1,2 m breed en steekt 0,3 m uit; de smalle vensters (in het echt 0,35 à 0,4 m) zijn nissen van 0,6 m. De vorm van het paviljoen komt uit het AHN en de foto van 2010; de diepte van het terras (1,1 m) en de hoogte van de glaswand zijn geschat.

Aangepast voor het printen zonder steun: de banden, de lateiplaat, de luifel en de overkapping van het terras zijn in het echt vlakke platen; hier hebben ze een onderkant van 50 graden. De glazen kop van het paviljoen is boven de afgeschuinde oosthoek onder 50 graden afgeschuind in plaats van vlak uitkragend.

Weggelaten: het hekwerk van het terras en de dunne stijlen van het paviljoen (onder 0,9 m), de regenpijpen, de kleine ventilatieopeningen aan de voet (circa 0,3 × 0,5 m), het betonnen kapje op de liseenen, en het ommuurde vak met een lage betonwand (circa 1,5 m) tegen de noordoostgevel (geen BAG-pand, staat niet in de opdracht; het PDOK-terrein heeft daar maaiveld).

## Controle

Eén gesloten NoError-node, één component, genus 0, geen ondervlakken steiler dan 45 graden. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand en zonder ondersteuningsobject. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een doos met een blok erop) de betonband met de terugspringende, afgeschuinde bovenbouw, de dakrand, per gevel de liseen, het overhoekse venster, de lateiplaat en de korte en hoge smalle vensters, de ingang met luifel, en het paviljoen met terras en kop.

Controle-URL: http://localhost:3000/kaart/51.45745/3.59832/200/1x1/0
