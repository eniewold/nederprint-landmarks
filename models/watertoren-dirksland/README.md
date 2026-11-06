# Watertoren Dirksland (Dirksland)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-dirksland.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de hele toren is één omwentelingsprofiel (schacht, kraag, boeiboord, kegel, lantaarn, kraag, spits, knop en naald); vensters, deur en lantaarnopeningen zijn blinde nissen met een schuin plafond.

De watertoren van Dirksland (ook wel de watertoren van Sommelsdijk) werd van 1939 tot 1941 gebouwd naar ontwerp van J. Gerber in de stijl van de Delftse School. Hij is 62,50 m hoog en heeft een reservoir van 575 m³ dat op acht buiten- en vier binnenkolommen rust; de Duitsers legden er in 1944 springstof in die in mei 1945 ongebruikt werd verwijderd. In 1993 kreeg hij een nieuw dak; van 2007 tot 2009 zat er een restaurant in, sindsdien staat hij leeg (Wikipedia). Rijksmonument 525002. De toren staat er nog (BAG "Pand in gebruik", AHN en luchtfoto). Een slanke, licht verjongende ronde bakstenen schacht zonder geledingen draagt een breed, plat uitkragend "hoeddak" met een dikke boeiboord en een flauwe koperen kegel, met daarop een open lantaarntje en een slanke koperen spits met een knop en een naald.

## Bestanden

- `watertoren-dirksland.glb`: één node, `building:watertoren-schacht-hoeddak-lantaarn-en-spits`.
- `watertoren-dirksland.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-dirksland-1-1000.stl`: het model op 1:1000 (15,4 × 15,4 × 62,3 mm).

## Oorsprong en oriëntatie

RD-oorsprong [67535.25, 418699.23] (51,750146 N, 4,120551 O): het middelpunt van een cirkelfit op de 28 hoekpunten van de ronde BAG-voetafdruk van pand 0504100001641890 (straal 5,93 m, afwijking hooguit 0,05 m), op het maaiveld: AHN-DTM NAP +0,52 (0,50 tot 0,59 tussen 6 en 8 m). De top van de spits ligt in het AHN-DSM in de pixel van het hart.

De toren is rond; de lokale X-as wijst naar RD-oost (`xAxis` [1, 0]).

`groundSamplePoints` liggen op 7,5 m in de vier asrichtingen, op de bestrating rond de voet; `groundHeight` 44,398 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (noord 44,398, west 44,399, oost 44,423, zuid 44,423, gemeten 2026-11-06). Het PDOK-pand staat op 44,36 met de top op 91,78 (een ronde kolom met een flauw dak en een blok erop). `groundOffsetMetres` is −0,1. Het enige andere pand in de buurt (0504100001646117, een klein gebouwtje uit 2003) ligt 17 m noordwestelijk en raakt het model niet.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +0,52).

- Schacht: straal 5,93 m (BAG) aan de voet, recht verjongend tot 5,55 m op 36,95 m. Twaalf kleine vensters aan de voet (nissen 0,9 × 0,9 m, 0,5 tot 1,4 m, de plek bij de deur overgeslagen), een deur met een ronde boog (nis 1,3 m breed, aanzet van de boog op 2,2 m) aan de oost-zuidoostkant, vier kolommen spleetvensters op 45, 135, 225 en 315 graden op 6,8–8,8, 13,4–15,4 en 20,0–22,0 m, acht vensters van 27,0 tot 28,4 m en twaalf kleine vensters van 35,2 tot 36,2 m onder het dak.
- Hoeddak: kraag van 45 graden van de schacht op 36,95 m naar de boeiboord met straal 7,7 m (AHN, diameter 15,4 m) op 39,15 m; boeiboord tot 40,1 m (AHN NAP +40,5); koperen kegel van 28 graden van straal 7,35 tot 1,7 m op 43,15 m (AHN NAP +42,4 op 4 m en +43,7 op 2 m).
- Lantaarn: straal 1,3 m van 43,15 tot 44,9 m met zes openingen tussen de kolommetjes (nissen van 0,9 m); kraag van 45 graden tot straal 1,75 m, tot 45,75 m (AHN NAP +45,9 op 1,5 m).
- Spits: uitlopende voet van straal 1,15 m naar 0,7 m op 47,0 m (AHN NAP +47,4 op 1 m), slanke kegel tot 0,45 m op 56,5 m, knop van 0,62 m van 56,75 tot 57,05 m, naald vanaf 0,3 m op 57,45 m tot de top op 62,0 m (NAP +62,5; Wikipedia 62,50 m; het AHN ziet de spits nog op NAP +59,6).

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Dirksland)): 1939–1941, J. Gerber, Delftse School, 62,50 m, 575 m³, nieuw dak 1993.
- [Rijksmonumentenregister 525002](https://monumentenregister.cultureelerfgoed.nl/monumenten/525002).
- BAG-pand 0504100001641890 (PDOK, 2026-11-06): ronde voetafdruk van 28 hoekpunten, straal 5,93 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +0,52, dakrand NAP +40,5 op 7,7 m, kegel van 28 graden tot NAP +43,7 op 2 m, lantaarnkraag NAP +45,9, voet van de spits NAP +47,4, spits NAP +59,6.
- PDOK-luchtfoto (Actueel_orthoHR): rond koperen kegeldak met radiale naden en een dakluik aan de oostkant, de ronde bestrating rond de voet met een pad vanaf het westen, een stoep aan de oost-zuidoostkant.
- Foto's op Wikimedia Commons: "Overzicht met omgeving - Dirksland - 20338063 - RCE.jpg" (kleur, frontaal, 0,071 m per pixel op de schacht), "Overzicht watertoren met omgeving - Dirksland - 20353450 - RCE.jpg" (zwart-wit, van ver, bijna orthografisch), "Dirksland - Watertoren.jpg", "Watertoren Dirksland.jpg" en "Netherlands-Dirksland-watertower.jpg".

## Geschat en weggelaten

Geschat: de verjonging van de schacht (5,93 naar 5,55 m, uit de verhouding van voet en top op de frontale RCE-foto's), de onderkant van het hoeddak (37,0 tot 37,6 m op de foto's), de dikte van de boeiboord, de maten van de lantaarn, de kraag, de knop en de naald, en de hoogtes, breedtes en aantallen van de vensters komen uit de foto's, geschaald op de BAG-diameter en het AHN. De spleetvensters zijn in het echt circa 0,3 m breed en de kleine vensters circa 0,5 m; ze staan als nissen van 0,9 m in het model. De stand van de deur (oost-zuidoost, bij de stoep op de luchtfoto) en van de vensterkolommen is onzeker. De onderkant van het hoeddak is in het echt vrijwel vlak; in het model is het een kraag van 45 graden, zodat het zonder steun te printen is. De lantaarn is open met dunne kolommetjes; in het model is het een dichte trommel met zes nissen.

Weggelaten: het dakluik op de kegel (kleiner dan 0,9 m), de radiale naden van het koperen dak, de hekjes en lantaarnpalen rond de voet en het kleine gebouwtje noordwestelijk (eigen BAG-pand, blijft van PDOK).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde ronde kolom van 47 m met een flauw dak en een blokje erop) het hoeddak met de boeiboord, de kegel, de lantaarn, de spits met knop en naald, de verjonging en de vensters en deur.

Controle-URL: http://localhost:3000/kaart/51.75015/4.12055/200/1x1/0
