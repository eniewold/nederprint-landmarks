# Watertoren uit 1924 (Almelo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-almelo-1924.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, reservoirverdieping en bovenkamer zijn achthoekige prisma's die evenwijdig aan elkaar liggen, balkonband, lijst en goot hebben een onderkant van 45 graden, en het dak is de convexe omhullende van de gootlijst en een korte nok (acht dakvlakken).

De watertoren aan de Sluiskade Noordzijde staat op het voormalige fabrieksterrein van Ten Cate (het Indië-terrein) en is in 1924 gebouwd voor bluswater voor de textielfabriek; in de buurt heet hij ook de "stoftoren". Volgens Wikipedia heeft hij drie reservoirs; hoogte en inhoud zijn onbekend. Na de sloop van de sheds bleef hij als enige over; sinds 2023-2024 wordt hij verbouwd tot woning (BAG-status "Verbouwing pand", zaak Z/23/138121) en ernaast komen nieuwe woningen. De toren is overal een langgerekte achthoek, langer oost-west dan noord-zuid: een bakstenen schacht met hoge smalle vensters, een betonnen balkon met een leuning van stijlen en buizen, een witgepleisterde reservoirverdieping met hoekpenanten, een witte lijst op consoles, een bakstenen bovenkamer met twee vensters per gevel, een overstekende witte goot en een achtzijdig schilddak met rode pannen en een korte nok.

Deze toren is niet de oudere Almelose watertoren uit 1914.

## Bestanden

- `watertoren-almelo-1924.glb`: één node `building:achtkante-schacht-balkon-reservoir-bovenkamer-en-dak`, op maaiveld.
- `watertoren-almelo-1924.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-almelo-1924-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [241402.4, 486687.6] (52,36127 N, 6,65567 O), het hart van BAG-pand 0141100000089114 (de schacht, 6,3 × 4,8 m met afgeschuinde hoeken) en van de dakomhullende in het AHN-DSM (8,5 × 7,25 m boven NAP +27); de Wikidata-coördinaat ligt 9 m ernaast. Maaiveld NAP +11,15 (AHN-DTM rond de toren 11,0 tot 11,4; 3D BAG 11,03). Lokale +X wijst naar het oosten langs de nok, RD-richting -1,5 graden (`xAxis` [0.99966, -0.02618]; gemiddelde van de BAG-gevels en de 3D BAG-nok: -1,2, -0,2, -2,5 en -1,9 graden), +Y naar het noorden.

`groundHeight` 54,23 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` aan de oost-, zuid- en westkant (54,28, 54,23, 54,54 en 54,53, gemeten 2026-11-05). Ten noorden van de toren ligt het PDOK-terrein tot 2 m lager, op de plek van de nieuwe aanbouw (BAG-pand 0141100000097393, "Bouw gestart"); daar staat bewust geen punt, anders zakt de toren 2 m mee. Het model vervangt BAG-pand 0141100000089114, zodat het PDOK-blok verdwijnt; de aanbouw en de nieuwe woningen eromheen zijn eigen panden en blijven staan.

## Onderdeel `building:achtkante-schacht-balkon-reservoir-bovenkamer-en-dak`

Alle achthoeken zijn evenwijdige verschuivingen van de bovenkamer (8,0 × 6,4 m; zuid- en noordgevel 2,8 m, oost- en westgevel 3,2 m, schuine gevels 3,05 m). Hoogtes boven maaiveld.

- Schacht: 6,3 × 4,8 m (verschuiving -0,85; zuidgevel 2,3 m zoals in de BAG) tot 8,2 m. Per gevel twee hoge smalle vensters van 0,45 m (hart op hart 1,0 m) van 4,6 tot 7,8 m als nis van 0,3 m; in de zuidgevel een deur van 1,1 × 2,1 m.
- Balkon: band met een onderkant van 45 graden van de schacht (8,2 m) tot 9,0 m, plaat tot 9,6 m, 7,9 × 6,3 m.
- Reservoirverdieping: 6,5 × 4,9 m (verschuiving -0,75) van 9,6 tot 12,5 m; per gevel een verdiept vlak van 0,2 m tussen hoekpenanten van 0,45 m, van 9,9 tot 11,3 m.
- Lijst: onderkant van 45 graden van 11,65 m (de consoles) tot 12,5 m, bovenkant 12,9 m, 0,1 m buiten de bovenkamer.
- Bovenkamer: van 12,9 tot 15,45 m, per gevel twee vensters van 0,6 × 1,2 m (hart op hart 0,95 m) van 14,1 tot 15,3 m als nis van 0,3 m.
- Goot: onderkant van 45 graden van de gevel (15,45 m) tot de gootlijst op 15,85 m, 0,4 m overstek (8,8 × 7,2 m), bovenkant 16,05 m.
- Dak: achtzijdig schilddak tot een nok van 3,0 m oost-west op 18,6 m (NAP +29,75); zuid- en noordvlak 35 graden (3D BAG 35,6), oost- en westvlak 41 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Almelo_Sluiskade)): 1924, drie reservoirs, Sluiskade Noordzijde.
- BAG-pand 0141100000089114 (PDOK, 2026-11-05): voetafdruk van de schacht, hart en stand; status "Verbouwing pand" (2024), woonfunctie.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): maaiveld NAP +11,15, nok NAP +29,72, dakomhullende 8,5 × 7,25 m.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0141100000089114: nok NAP +29,77 en 3,1 m lang, zuiddakvlak 35,6 graden, maaiveld 11,03.
- PDOK-luchtfoto (Actueel_orthoHR): achtkantige gootlijst 8,8 × 7,1 m, nok oost-west.
- Foto's op Wikimedia Commons: "Watertoren Sluiskade Almelo 1924" (2007, 57 m ten zuiden van de toren, vrijwel frontaal op de zuidgevel; 115 px/m uit de breedte van de goot: breedtes van bovenkamer, reservoirverdieping, balkon en schacht, vensters, lijst, consoles) en "Indieterrein Almelo" (vanaf het zuidwesten: hele toren, geledingen, deur).

## Geschat en weggelaten

Geschat: de hoogtes van balkon, reservoirverdieping, lijst en bovenkamer uit twee foto's (onzekerheid circa een halve meter), met de goot en de nok uit het AHN en de 3D BAG; de vorm van de achthoeken (de schuine gevels uit de zuidfoto en de luchtfoto, de schacht uit de BAG); de nok van 3,0 m (3D BAG 3,1 m); de diepte van nissen en verdiepte vlakken; de vensters in de gevels die op de foto's niet te zien zijn (noord, noordoost, noordwest: zoals de andere gevels twee per gevel); de plaats van de deur (zuidgevel; op de foto van het zuidwesten zit een deur in de gevel naar de camera); de stand van de toren na de verbouwing tot woning (de foto's zijn van 2007 en circa 2018).

Weggelaten: de balkonleuning (dunne stijlen en buizen), de ladder, de regenpijpen, de ballen op de nok en de antenne, de consoles als losse blokken, de tandlijst onder de goot en de lateien boven de vensters (kleiner dan 0,9 m), de kleine vensters in de reservoirverdieping (0,35 m), de pleisterresten van de gesloopte fabrieksaanbouw aan de schacht, en de nieuwe aanbouw ten noorden (eigen BAG-pand).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: balkonband, lijst en goot met een onderkant van 45 graden, nissen met een plafond van 56 graden, dak verjongend. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een recht prisma op de voetafdruk van de schacht tot de dakvoet met een vierzijdig dak) het balkon, de smallere reservoirverdieping met penanten en verdiepte vlakken, de lijst, de overstekende bovenkamer met vensters, de goot met overstek en het achtzijdige dak, en aan de schacht de hoge vensters en de deur.

Controle-URL: http://localhost:3000/kaart/52.36127/6.65567/200/1x1/0
