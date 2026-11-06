# Watertoren Maarsbergen (Maarsbergen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-maarsbergen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is een prisma op de BAG-gevels met kroon, lijn, dekzerk, klokken en een achtkante lantaarn als losse bouwdelen; de rest van het pand bestaat uit blokken en dakvlakken (planvergelijkingen) op de hoogtes uit het AHN en de 3D BAG, het museum met een mansardedak (hull van goot, knik en nok).

De watertoren van Maarsbergen staat op het terrein van Valkenheide, een jeugdinrichting in de bossen bij Maarsbergen. Hij is in 1960 gebouwd naar ontwerp van N.B. Goudzwaard, is volgens Wikipedia 30 m hoog en heeft één reservoir van 40 m³; op Commons staat hij als gemeentelijk monument van Utrechtse Heuvelrug. Een slanke vierkante bakstenen schacht zonder uitkragend reservoir, met een blauwe klok op de gevels, een kroon met lichte (wit geblokte) velden tussen bakstenen penanten en een dekzerk, en op het dak een achtkante glazen lantaarn met rood kozijnwerk en een koperen kapje, waaraan nu antennes hangen.

De toren is geen eigen BAG-pand. Hij staat in pand 1581100000011158 (bouwjaar 1912), samen met een laag blok rond zijn voet, een verbindingsgang, een lange lage vleugel naar het oosten en het museumgebouw van Valkenheide (wit gepleisterd, mansardedak met dakkapellen). Het model vervangt daarom het hele pand.

## Bestanden

- `watertoren-maarsbergen.glb`: één node `building:watertoren-met-museum-en-laagbouw`, op maaiveld.
- `watertoren-maarsbergen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-maarsbergen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [157151.89, 450247.48] (52,04055 N, 5,41857 O), het hart van de toren: de west- en zuidgevel van de toren zijn hoeken van het BAG-pand, de noord- en oostgevel komen uit het AHN-DSM en de luchtfoto (5,4 m breed). Maaiveld AHN NAP +8,33 (erf vlak, 8,31 tot 8,51). Lokale +X wijst naar RD-richting 17,47 graden, +Y naar 107,47 graden: evenwijdig aan de BAG-gevels. `groundHeight` 51,59 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (zuidwest van de toren 51,59, zuid van het museum 51,60, zuid van de toren 51,78, zuid van het lage blok 51,84).

Het model vervangt BAG-pand 1581100000011158 (in de PDOK-tegel een blok met de toren tot ellipsoïdisch 85,6, het lage deel en het museum als blok met schilddak). Het buurpand 1581100000011161 (1955, ten noordoosten, circa 5 m hoog) staat los en klopt met het AHN.

## Onderdeel `building:watertoren-met-museum-en-laagbouw`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Toren: 5,4 × 5,4 m, borstwering tot 30,3 m (AHN NAP +38,65), dak binnen de borstwering op 29,3 m (NAP +37,65).
- Kroon: dekzerk van 30,02 tot 30,3 m, 0,06 m uit; zeven lichte velden per gevel (0,4 m breed op 0,72 m steek, 29,05–29,95 m, 0,12 m diep); lichte lijn op 28,57–28,96 m, 0,06 m uit.
- Klokken: op elke gevel een schijf van 1,7 m doorsnede op 23,3 m, 0,1 m voor de gevel.
- Deur: zuidgevel, 1,0 × 2,2 m, 0,6 m west van het midden.
- Lantaarn: achtkant (omgeschreven straal 1,55 m) van 29,3 tot 33,0 m, glasvlakken als nissen tussen de stijlen, kroonlijst van 0,1 m, kapje tot 33,5 m (AHN NAP +41,85).
- Laag blok rond de voet van de toren: plat dak op 4,97 m (AHN NAP +13,30) met een opstaande rand, schoorsteen tot 5,9 m, vier vensters en een deur in de noordgevel, deur en vensters in de zuid- en oostgevel.
- Klein blok tussen laag blok en gang: 2,87 m.
- Verbindingsgang naar het museum: plat dak van 3,37 m (zuid) naar 2,37 m (noord), drie vensters.
- Oostvleugel: 20,6 m lang, plat dak van 2,88 m (zuid) naar 3,28 m (noord), vijf vensters en een deur.
- Museum: gevels op de BAG (15,6 × 19,2 m) tot de goot op 5,0 m (overstek 0,4 m); onderste dakvlakken naar de knik op 9,9 m, 1,0 m binnen de gevel; schilddak met nok op 14,15 m (3D BAG NAP +22,51), zijvlakken van 32 graden en eindschilden van 55 graden; oostelijke opbouw van twee lagen tot 8,2 m over bijna de hele lengte (3D BAG NAP +16,8) met de erker op de zuidoosthoek; brede dakkapel met vier vensters in het westen; kleine dakkapel op het zuidschild tot 11,3 m; deuren bij de noordwesthoek en vensters rondom.
- Vensters en deuren zijn nissen van 0,15 tot 0,3 m diep met een plafond van 63 graden; goot, dekzerk, lijn, klokken en lantaarnkroonlijst hebben een onderkant van 52 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Maarsbergen)): 1960, N.B. Goudzwaard, 30 m, 40 m³.
- BAG-pand 1581100000011158 (PDOK, 2026-11-06): de hele plattegrond, de west- en zuidgevel van de toren.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, borstwering, dak en lantaarn van de toren, torenbreedte, hoogtes van de lage delen en het museumdak.
- 3D BAG NL.IMBAG.Pand.1581100000011158: dakvlakken van het museum (knik, nok) en de lage delen.
- Luchtfoto (PDOK, 2026-11-06): torenbreedte, lantaarn, witte dakranden van het lage blok, museumdak met pannen.
- PDOK-gebouwtegel (2026-11-06): blok met een kale toren en een museum als blok met schilddak.
- Foto's op Wikimedia Commons: "Maarsbergen Watertoren 9588" (2006; kroon, klok, lantaarn, deur en het witte lage blok; 52 px/m in de kroon), "Maarsbergen Valkenheide Watertoren" (2016, vanaf het binnenterrein in het noorden; lage vleugel met vensters, schoorsteen, klok, kroon) en "Maarsbergen Valkenheide Museum" (2016; mansardedak, dakkapel, ingang, erker).

## Geschat en weggelaten

Geschat: de noord- en oostgevel van de toren (AHN en luchtfoto geven 5,3 tot 5,8 m, aangenomen is een vierkant van 5,4 m op de BAG-hoeken); de kroon, de lijn, de klok (hoogte op circa 0,5 m, op alle vier de gevels aangenomen; op de foto's zijn er twee te zien) en de deur uit de foto van 2006; de lantaarn (breedte 3,0 m uit de foto, hoogte uit AHN en foto, recht boven het hart gezet); de borstwering is 0,95 m dik in plaats van circa 0,4 m, zodat ze achter de velden nog 0,8 m breed is en de export haar niet verdikt (van buiten niet te zien); de onderkanten van dekzerk, lijn, klok, lantaarnkroonlijst en goot onder 52 graden (in het echt vlakker); het museum: goothoogte, knik en overstek uit foto en DSM (op circa 0,5 m), de dakkapellen en de oostelijke opbouw (die volgens de 3D BAG tot 1 m buiten de BAG-gevel reikt; hier 0,4 m, tot de goot), en de plaats en het aantal vensters en deuren van alle lage delen (alleen de noordgevel van het lage blok, de zuidgevel bij de toren en de west- en zuidgevel van het museum staan op een foto).

Weggelaten: de antennes en de windvaan op de lantaarn (dunner dan 0,9 m), de stijlen en roeden van de vensters, de luifel boven de ingang aan het binnenterrein (een vrije plaat), de regenpijpen, de kleurverdeling (bakstenen toren, wit museum en wit blok, pannendak) en het bijgebouw van 1955 ten noordoosten (eigen pand).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 (ondersteuning v2, 45 graden) van een uitsnede van 100 m bevat het model, niet meer het PDOK-pand, en geen ondersteuningsobject. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (kale toren met een paal, lage blokken en een museum als blok met schilddak) aan elke kant de kroon met velden, lijn en dekzerk, de klok, de lantaarn, de dakranden van de lage delen en de vensters; het museum heeft het mansardedak met knik, de dakkapellen en de oostelijke opbouw; in het zuiden de deur van de toren.

Controle-URL: http://localhost:3000/kaart/52.04055/5.41854/200/1x1/0
