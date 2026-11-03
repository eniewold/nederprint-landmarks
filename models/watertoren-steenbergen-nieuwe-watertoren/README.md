# Nieuwe watertoren (Steenbergen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-steenbergen-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de reservoirzone, de dakrand, het kegeldak en de lantaarn zijn prisma's en convexe omhulsels van cirkels; de vleugels zijn BAG-veelhoeken onder twee dakvlakken (planvergelijkingen uit het AHN); vensters zijn nissen.

De nieuwe watertoren aan de Watertorenweg in Steenbergen is in 1950 gebouwd naar ontwerp van J.M. (Jacques) Hurks, als vervanging van de oude toren die op 3 november 1944 werd opgeblazen: volgens Wikipedia 40,65 m hoog met één reservoir van 600 m³, in baksteen en beton. Van 1998 tot 2000 stond hij leeg; sinds de verbouwing zit er kinderopvang Toerdeloo in. Een ronde bakstenen schacht zonder geleding met een boogjesfries onder het reservoir, een krans van zestien kleine vierkante vensters onder de dakrand, een koperen kegeldak met een zware ronde rand en een ronde lantaarn met glasband, kap en makelaar. Tegen de zuidkant staan de dienstvleugels, die met de toren één BAG-pand vormen.

## Bestanden

- `watertoren-steenbergen-nieuwe-watertoren.glb`: één node `building:ronde-toren-met-kegeldak-en-vleugels`, op het maaiveld.
- `watertoren-steenbergen-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-steenbergen-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [81735.45, 400550.35], het hart van de toren uit het AHN-DSM (cellen boven NAP +20 m; de BAG-contour heeft de toren als ruwe cirkel van 6,6 tot 7,2 m straal), op maaiveld (AHN-DTM NAP +1,19 tot +1,27; gebruikt +1,23). Lokale +X is RD-oost, +Y RD-noord (`xAxis` [1, 0]). `groundHeight` 45,36 is NAP +1,23 plus de NLGEO2018-geoïdehoogte (44,13 m, lineair tussen de watertorens van Bergen op Zoom, Roosendaal, Stampersgat en Etten-Leur); de PDOK-terreintegels geven 45,37 tot 45,46 rond de toren. Het model vervangt pand 0851100000010832 (toren en vleugels), zodat het PDOK-blok verdwijnt.

## Onderdeel `building:ronde-toren-met-kegeldak-en-vleugels`

Toren (hoogtes boven maaiveld):

- Schacht: rond, 12,6 m doorsnede (RCE-foto: 195/208 van de dakrand), recht tot 34,3 m.
- Boogjesfries: op 25,0 m springt de reservoirzone 0,12 m uit onder 45 graden.
- Zestien vierkante vensters onder de dakrand, 0,9 m breed (foto's circa 0,8 m), van 32,5 tot 33,6 m, als nis van 0,3 m.
- Dakrand: kraag onder 45 graden tot 13,5 m doorsnede, rand recht op tot 35,55 m.
- Kegeldak met helling 0,46 (25 graden) tot r 2,65 op 37,45 m.
- Lantaarn: 4,8 m doorsnede, glasband met twaalf vakken van 0,9 m (nis 0,25 m) tot 38,75 m, kap 0,25 m uit onder 45 graden tot 39,1 m en een flauwe kegel tot 39,85 m (AHN NAP +41,1).

Vleugels (één BAG-pand met de toren; nokhoogtes en hellingen uit AHN-dwarsprofielen):

- Zuidwest: twee bouwlagen, 7,35 m breed, zadeldak met nok op 9,22 m en helling 0,69 (35 graden), goot op 6,7 m, schoorsteen op de westgevel tot 10,75 m.
- West: één laag, 6,5 m breed, tegen de westgevel van de zuidwestvleugel, nok 5,82 m, helling 0,67, schoorsteen op de westgevel tot 6,85 m.
- Zuidoost: één laag, 6,0 m breed tot het buurhuis (pand 0851100000010841), nok 5,84 m, helling 0,70, schoorsteen op de nok tot 7,3 m.
- Plat aanbouwtje tussen de zuidoostvleugel en de toren, dak op 2,87 m (AHN NAP +4,1).
- De grens tussen de zuidwest- en de zuidoostvleugel loopt van hun gezamenlijke BAG-hoekpunt naar het hart van de toren; de hogere zuidwestvleugel staat daar met een gevel boven de lage.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Steenbergen)): bouwjaar, ontwerper, 40,65 m, 600 m³, baksteen en beton, kinderopvang sinds 2000.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-03): maaiveld NAP +1,23, top van de kap NAP +41,1 (makelaar tot +41,6), kegeldak r 3,5 op 38,36 en r 6,0 op 37,13, dakrand 13 tot 13,5 m breed; dwarsprofielen van de vleugels (nokken 10,45, 7,05 en 7,07 NAP) en de schoorsteenpieken.
- BAG-pand 0851100000010832 en luchtfoto (PDOK): de gevellijnen van de vleugels, het aanbouwtje en de aansluiting op de buurpanden.
- RCE-foto 20346621 (van het zuiden, verticalen evenwijdig) en de foto's "2010-09-11 12.13 Steenbergen, watertoren foto1", "Steenbergen, watertoren foto4 2015-05-30" en "WatertorenSteenbergen" (2008) op Wikimedia Commons: verhouding dakrand/schacht, fries, vensterkrans, dakrand, lantaarn en de vleugels met hun schoorstenen.

## Geschat en weggelaten

Geschat: de doorsnede van de schacht (fotoverhouding op de AHN-dakrand), de hoogte van de fries en de vensterkrans (foto's, geschaald op de schachtbreedte), de dikte van de dakrand, de hoogte van de glasband en de kap van de lantaarn tussen de AHN-punten, de geoïdehoogte (interpolatie, ±0,03 m) en het dak van de vleugels onder de schaduw van de toren (het AHN heeft daar geen punten; de dakvlakken lopen door tot de toren). De vensters zijn iets groter gemaakt (0,9 m) dan op de foto's, zodat ze op 1:1000 een nis blijven.

Weggelaten: de makelaar en de antennes, schotels en kabelgoten (dunner dan 0,9 m), de smalle trappenhuisvensters in de schacht (circa 0,6 m breed), de opgebogen dakrand van de zuidwestvleugel bij de toren (minder dan 0,9 m hoogteverschil), de vensters en deuren in de vleugels (alleen schuin op één foto te zien, niet te plaatsen) en het buurhuis en de andere aanbouwen (eigen BAG-panden, blijven van PDOK).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume met minder dan een miljoenste (gemeten 1,0000000016): fries, kraag onder de dakrand en kap van de lantaarn staan onder 45 graden, de nisplafonds onder 56. Een exportcontrole via `loadLocalLandmarkMeshes` op een uitsnede rond de toren plaatste het hele model (40,15 m hoog) op het PDOK-maaiveld. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een veelhoekige kolom met een vlak, gefacetteerd dak en een blokje erop, en dezelfde vleugels) de ronde schacht met de frieslijn, de vensterkrans, de zware dakrand, het kegeldak, de lantaarn met glasband en kap en de drie schoorstenen.

Controle-URL: http://localhost:3000/kaart/51.58908/4.32998/200/1x1/0
