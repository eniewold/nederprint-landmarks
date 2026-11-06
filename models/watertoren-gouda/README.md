# Watertoren Gouda (Gouda)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-gouda.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, schacht, fries, bovenbouw en lijsten zijn omwentelingsvormen, het overstek, het tentdak en de lantaarn hulls van tienhoeken (planvlakken), de aanbouw een prisma; velden, vensters, deuren en oculi zijn blinde nissen met een schuin plafond.

De watertoren aan de Schielands Hoge Zeedijk 20 in Gouda werd in 1883 gebouwd naar ontwerp van J. Schotel. Hij is 33,15 m hoog (Wikipedia; register: circa 33 m), het ijzeren vlakbodemreservoir heeft een middellijn van 11 m. Rijksmonument 517626. De toren staat er nog (BAG "Pand in gebruik", bouwjaar 1883; luchtfoto en AHN); hij is sinds 2003 bedrijfsruimte. Een ronde neoromaanse toren van baksteen in drie geledingen, gescheiden door zware waterlijsten: een vrij hoge onderbouw met tien rondboogvelden, de meeste met gekoppelde rondboogvensters, en de oorspronkelijke ingang aan de noordwestzijde (dubbele deur onder een bovenlicht, hardstenen stoep); een schacht met tien hoge spaarvelden tussen lisenen, elk onder een rondboog met twee kleinere boogjes en een oculus; en een iets uitkragende bovenbouw bij het reservoir op een rondboogfries, met gekoppelde venstertjes en een tandlijst. Daarop een vlak tienzijdig tentdak met overstek op houten klossen en een korte tienzijdige lantaarn, met koper bekleed. Aan de oostzijde staat in hetzelfde BAG-pand de kantooraanbouw (magazijn van 1974, in 1979 verbouwd; geen monument).

## Bestanden

- `watertoren-gouda.glb`: één node, `building:watertoren-onderbouw-schacht-bovenbouw-tentdak-lantaarn-en-aanbouw`.
- `watertoren-gouda.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-gouda-1-1000.stl`: het model op 1:1000 (29,1 × 19,8 × 33,2 mm).

## Oorsprong en oriëntatie

RD-oorsprong [108112.9, 446105.54] (52,001344 N, 4,704407 O): het hart van de ronde BAG-voetafdruk van pand 0513100011112774 (straal 6,89 m), op het maaiveld: AHN-DTM NAP +3,33 (3,26 tot 3,52 tussen 8 en 13 m). De toren staat op de kruin van de Schielands Hoge Zeedijk. Het hart van het dak in het AHN-DSM ligt binnen 0,1 m van dit punt.

De lokale X-as loopt langs de aanbouw, 44,1 graden linksom van RD-oost (`xAxis` [0.71813, 0.69591]). Daarmee ligt een hoek van het tienzijdige dak op de X-as (luchtfoto: een hoek op 8 graden van RD-oost, 44,1 − 36 = 8,1): lisenen en dakhoeken staan op 0, 36, 72 … graden, de velden ertussen op 18, 54, 90 … graden. De oorspronkelijke ingang staat op 90 graden lokaal (noordwest), de moderne deur op 18 graden (noordoost).

`groundSamplePoints` liggen rondom de toren op 8,5 m en rond de aanbouw; `groundHeight` 46,824 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (noord 46,824, zuidwest 46,833, oostzijde van de aanbouw 46,871, zuid 46,934, noordwest 46,992, einde van de aanbouw 47,081, noordzijde van de aanbouw 47,142; gemeten 2026-11-06). Het PDOK-pand staat op 46,79 met de top op 79,7 (een cilinder met de aanbouw als blok). `groundOffsetMetres` is −0,1. Geen ander PDOK-pand raakt het model (het dichtstbijzijnde ligt 22 m westelijk).

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,33).

- Onderbouw: rond, straal 6,89 m (BAG) tot 6,0 m. Tien rondboogvelden van 3,4 m breed en 0,15 m diep (kruin 5,7 m), met per veld twee rondboogvensters van 1,0 m (borstwering 1,0 m, kruin 3,7 m). In het noordwestelijke veld de oorspronkelijke ingang (nis 1,8 m breed, kruin 3,8 m) met een stoep van twee treden van 0,15 m; in het noordoostelijke veld de moderne deur (1,3 × 2,4 m).
- Waterlijst: tot straal 7,04 m van 6,0 tot 6,6 m, onderkant 50 graden, afzaat naar de schacht.
- Schacht: lisenen op straal 6,8 m tot het fries op 22,24 m. Tien spaarvelden van 3,3 m breed: tot 0,35 m diep van 7,0 tot 18,9 m met twee boogjes van 1,55 m bovenin (kruin 19,7 m), daarboven een boogveld van 0,12 m diep onder een rondboog met kruin 21,6 m en een oculus van 0,9 m op 20,75 m. In vijf velden een rondboogvenster van 1,0 m (11,0 tot 13,5 m).
- Fries: tot straal 7,1 m van 22,6 tot 23,5 m, onderkant 50 graden.
- Bovenbouw: straal 6,95 m tot 27,15 m, tien velden van 0,12 m diep (23,8 tot 26,5 m) met elk twee rondboogvenstertjes van 0,9 m (24,3 tot 25,75 m). Tandlijst tot straal 7,07 m op 26,75–27,15 m.
- Overstek: kraag van minstens 57 graden van de bovenbouw naar de tienhoek met hoekstraal 7,5 m op 28,0 m (de klossen), boeiboord tot 28,4 m (AHN NAP +31,7).
- Tentdak: tien vlakken van 22 graden tot de lantaarn (hoekstraal 1,6 m) op 30,75 m (AHN NAP +34,1).
- Lantaarn: tienhoek met hoekstraal 1,35 m tot 31,84 m, kap van 1,47 m op 31,97 m tot de top op 32,93 m (AHN NAP +36,26; Wikipedia 33,15 m met de windvaan).
- Aanbouw: 19,96 × 6,09 m (BAG) langs de lokale X-as, plat dak op 7,8 m (AHN NAP +11,1), twee rijen vensters (1,4 × 1,5 m) op de lange gevels en de kopgevel. Langs de noordwestgevel een lage strook van 0,9 m breed en 0,6 m hoog (BAG-contour, AHN circa 1 m boven het maaiveld).

Nissen zijn 0,12 tot 0,4 m diep met een plafond dat naar binnen onder 56 graden oploopt; buiten het nisvlak zakt het plafond onder 63 graden, zodat de nis ook bij de hoeken van de ronde gevel geen vlak plafond krijgt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Gouda)): 1883, J. Schotel, 33,15 m, 300 m³, rijksmonument 517626.
- [Rijksmonumentenregister 517626](https://monumentenregister.cultureelerfgoed.nl/monumenten/517626): ronde neoromaanse toren in drie geledingen met waterlijsten, tien spaarvelden in onderbouw en schacht, tienzijdig tentdak met overstek op klossen en tienzijdige lantaarn, ingang noordwest, moderne deur noordoost, reservoir 11 m, aanbouw van 1974/1979 aan de oostzijde niet beschermd.
- BAG-pand 0513100011112774 (PDOK, 2026-11-06): ronde toren met straal 6,89 m en de rechthoekige aanbouw, samen 278 m², bouwjaar 1883.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +3,33, dakrand NAP +31,3 tot 31,9 op 7,0 m uit het hart, dak 0,4 m per m (22 graden) tot NAP +34,0 op 1,5 m, lantaarnkap NAP +35,6 tot 36,26; aanbouw plat op NAP +11,1.
- PDOK-luchtfoto (Actueel_orthoHR): tienzijdig dak met een hoek op 8 graden van RD-oost, lantaarn in het midden, de aanbouw aan de oostzijde.
- Foto's op Wikimedia Commons (categorie "Watertoren (Gouda)"): "Watertoren Gouda.jpg" (2007) en "Watertoren (Gouda, 1998).jpg" (G. Dukker, recht van voren, verticalen evenwijdig).

## Geschat en weggelaten

Geschat: de stralen van schacht (6,8 m over de lisenen) en bovenbouw (6,95 m), de hoogtes van waterlijst, fries en tandlijst, de afmetingen van velden, boogjes, oculi en vensters en de breedte van de lisenen komen uit de foto van 1998, geschaald op de dakrand uit het AHN (0,041 m per pixel op de voorgevel). Welke velden van de schacht een venster hebben, is op de twee foto's maar voor drie zijden te zien; het model zet er een in elk tweede veld. De hoekstraal van het overstek (7,5 m) komt uit de luchtfoto (15,4 m over de hoeken) en het AHN (7,1 tot 7,4 m). De stand van de moderne deur (noordoost) volgt het register. De vensters van de aanbouw zijn naar de foto van 1998 ingedeeld. De lage strook langs de aanbouw staat als 0,9 m breed in het model (BAG 0,75 m).

Weggelaten: de windvaan (dunner dan 0,9 m), de halfronde verhogingen van de goot op de hoeken en de losse klossen onder het overstek (samengevoegd tot één kraag), de vensters van de lantaarn (vlakken van 0,83 m), de getoogde boogfriezen en tandjes als losse stenen (kleiner dan 0,9 m), de roeden en het bovenlicht van de deur, en het ketelhuis van 1906 (geen eigen BAG-pand en niet zichtbaar in het AHN of op de luchtfoto naast de aanbouw).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume met minder dan 0,001 %. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder het PDOK-pand; het ondersteuningsobject is 0,002 mm³. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een vlakke kegel en een blokje als lantaarn, de aanbouw als blok) de geledingen met waterlijst, fries en tandlijst, de lisenen en spaarvelden met boogjes en oculi, de vensters en deuren, het tienzijdige overstek met het tentdak, de lantaarn en de vensters van de aanbouw.

Controle-URL: http://localhost:3000/kaart/52.00134/4.70441/200/1x1/0
