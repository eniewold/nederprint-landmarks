# Watertoren Gorinchem (Gorinchem)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-gorinchem.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, band, schacht, kraag en fries zijn één omwentelingsprofiel (96 segmenten), de ommanteling en de goot achtkante prisma's en hulls, het tentdak een hull van de achthoek en de top, de dakkapellen prisma's met een zadeldakje, het entreegebouw blokken met een zadeldak en een trapgevel van treden, de vensters en nissen blinde nissen met een schuin plafond.

De watertoren aan de Visserlaan werd in 1886 gebouwd voor de Maatschappij tot exploitatie van Waterleidingen in Nederland, naar ontwerp van Jan Schotel. Hij is 31 m hoog en had een reservoir van 300 m³; in 1910 nam de gemeente het waterleidingbedrijf over en in 1985 is de toren verbouwd tot woningen. De toren staat er nog (luchtfoto en AHN 2026, foto 2006). Een ronde bakstenen toren met een onderbouw op een plint, een geprofileerde band, een licht verjongende schacht, een fries van spitsbogen op consoles, een achtkante ommanteling van het reservoir onder een zwaar overstekende goot en een achtkant tentdak met dakkapellen en een makelaar met windvaan. Aan de zuidzijde staat het entreegebouw met een trapgevel, een spitsboogdeur en een schoorsteen op de top; aan de noordzijde een plat aanbouwtje uit 1985.

## Bestanden

- `watertoren-gorinchem.glb`: één node, `building:watertoren-schacht-fries-ommanteling-tentdak-en-entreegebouw`.
- `watertoren-gorinchem.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-gorinchem-1-1000.stl`: het model op 1:1000 (12,5 × 15,9 × 31,9 mm).

## Oorsprong en oriëntatie

RD-oorsprong [127003.65, 426954.38] (51,830487 N, 4,981054 O): het hart van de cirkel in BAG-pand 0512100000038785 (kleinste-kwadratencirkel door 38 boogpunten, straal 5,39 m, afwijking 0,01 m), op het maaiveld: AHN-DTM NAP +3,7 (3,65 tot 3,8 rond de voet). De toren staat vlak, niet op een wal. De top van het tentdak in het AHN-DSM 0,5 m ligt binnen 0,3 m van dat hart.

De lokale X-as staat 16 graden rechtsom van RD-oost (`xAxis` [0.96126, -0.27564]). Daarmee hebben de acht dakvlakken van het tentdak hun normalen op k × 45 graden (fit op het DSM: 29 graden in RD) en ligt de voorgevel van het entreegebouw (BAG: -17,2 graden) evenwijdig aan de X-as, met de voorzijde naar -Y (zuidzuidwest). Hoeken hieronder in graden linksom vanaf de lokale X-as.

`groundSamplePoints` liggen op 8 m oost en west, 9 m noord (voorbij het aanbouwtje) en 10 m zuid (voor de stoep); `groundHeight` 46,691 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 46,691, west 47,045, noord 46,870, zuid 47,010, gemeten 2026-11-06). Het PDOK-pand staat op 46,61. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,7).

- Plint: straal 5,39 m (BAG) tot 0,7 m, schuine afzaat tot 5,29 m op 0,8 m.
- Onderbouw: straal 5,29 m tot 6,2 m, met een groot spitsboogvenster op −18 graden (oostzuidoost, 1,8 m breed, 1,0 tot 5,7 m) en een deur met spitsboogvenster erboven op 150 graden (1,6 m breed, tot 5,5 m).
- Band: kraag van 0,2 m onder 51 graden en een rechte band met straal 5,49 m tot 6,85 m.
- Schacht: verjongend van straal 5,12 m (6,85 m) tot 4,95 m (16,55 m), met vier verdiepingen vensters (7,5–8,8, 9,7–11,0, 12,1–13,5 en 14,6–16,0 m) in zes kolommen op 0, 60, …, 300 graden.
- Fries: kraag van 50 graden van 4,95 naar 5,75 m (16,55 tot 17,5 m), daarboven een ring met 24 spitsboognissen (0,9 m breed, 17,6 tot 19,0 m) tot 19,45 m.
- Ommanteling: achtkant met apothema 5,45 m (hoeken 5,90 m, 0,15 m buiten het fries met een schuine aanzet) van 19,65 tot 24,15 m. Per zijde in het midden een vensterstrook (1,0 m breed, 20,3 tot 23,5 m) en twee blinde spitsboognissen (0,9 m breed, op 1,4 m uit het midden, 20,6 tot 23,5 m).
- Goot: kraag van 50 graden tot een apothema van 6,25 m (24,15 tot 25,1 m) en een rechte rand tot 25,3 m (AHN: NAP +29,0 tot een apothema van 6,25 m).
- Tentdak: acht vlakken van 45 graden vanaf een apothema van 5,6 m op de goot tot de top op 30,9 m (AHN: helling 1,00, top NAP +34,59); makelaar als achtkante naald tot 31,6 m (AHN NAP +35,32).
- Vier dakkapellen op de vlakken 0, 90, 180 en 270 graden (AHN: verhogingen van circa 1 m op een apothema van 3 à 3,5 m): 1,6 m breed, voorvlak op een apothema van 4,1 m, goot 27,9 m, zadeldakje van 45 graden tot 28,7 m, met een venster als nis.
- Entreegebouw (zuid): BAG-contour 6,9 m breed (x −3,6 tot 3,3), voorgevel op y = −8,0, tot in de toren. Muren tot 4,0 m, zadeldak met de nok in het midden op 7,8 m (48 graden). Trapgevel van 0,9 m dik met drie treden per zijde (elk 0,3 m boven het dakvlak aan de binnenkant) en een top op 8,3 m met een schoorsteen van 0,9 × 0,9 m tot 9,2 m. Spitsboogdeur (1,6 m breed, 0,6 tot 3,7 m) en een tweelicht in de gevel (4,55 tot 6,9 m), een venster links en een dubbel venster rechts, twee vensters in de oostgevel en één in de westgevel. Stoep van twee treden (0,3 en 0,6 m) voor de deur, tot 0,9 m voor de gevel.
- Aanbouw (noord, 1985): BAG-contour x −2,05 tot 1,91, tot y = 7,04, plat dak op 3,3 m, één raam in de noordgevel.

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt; spitse toppen hebben zijden van 55 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Gorinchem)): 1886, Jan Schotel, 31,00 m, maximale breedte 10 m, 300 m³, in 1910 overgenomen door de gemeente, sinds 1985 woningen.
- BAG-pand 0512100000038785 (PDOK, 2026-11-06): cirkel met straal 5,39 m, het entreegebouw aan de zuidzijde en het aanbouwtje aan de noordzijde; bouwjaar in de BAG 1985 (de verbouwing).
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +3,7, tentdak met acht vlakken van helling 1,00 en top NAP +34,59, makelaar NAP +35,32, goot NAP +29,0, vier dakkapellen.
- PDOK-luchtfoto (Actueel_orthoHR): achtkant tentdak, het entreegebouw met zadeldak.
- Foto's op Wikimedia Commons (categorie "Watertoren (Gorinchem)"): "Gorinchem Watertoren 8497.JPG" (2006, vanaf het zuidzuidoosten), "Overzicht - Gorinchem - 20080593 - RCE.jpg" (vanaf het oostzuidoosten, shift-lens), "Exterieur NA UITBOUW WOONEENHEDEN - Gorinchem - 20316645 - RCE.jpg" (1985, vanaf het noordwesten), "Exterieur NA INBOUW APPARTEMENTEN - Gorinchem - 20316648 - RCE.jpg" (het entreegebouw), "Watertoren Gorinchem.jpg" (1901).

## Geschat en weggelaten

Geschat: het tentdak, de goot en de top komen uit het AHN; de rest boven de onderbouw uit de RCE-foto 20080593 (verticale lijnen evenwijdig), horizontaal geschaald op de BAG-cirkel en verticaal op de goot uit het AHN: de band (6,2 tot 6,85 m), de verjonging van de schacht, het fries (16,55 tot 19,65 m), de breedte van de ommanteling (apothema 5,45 m) en de vensterhoogtes (circa een halve meter onzeker). De Wikipedia-maat van 10 m breedte is te klein: de goot is 12,5 m over de vlakken. De richting van de vensterkolommen en van de twee grote spitsboogopeningen in de onderbouw komt uit de foto's en is circa 15 graden onzeker. Het entreegebouw is geschaald op de deur op foto 20316648 en de band van de toren; de nok staat in het midden van de BAG-contour (foto). In werkelijkheid valt het rechterdakvlak van het entreegebouw iets lager af over een smalle zijvleugel met een consolelijst; hier is het één symmetrisch zadeldak. De vensters zijn als nis 1,0 tot 1,2 m breed; de nissen in het fries 0,9 m.

Weggelaten: de windvaan en de kleine pinakels op de hoeken van de goot (dunner dan 0,9 m), de stenen consoles op de hoeken van de ommanteling en de kleine boogfriezen onder de goot en op de schacht (kleiner dan 0,9 m of als reliëf ondieper dan 0,3 m), de consolelijst van het entreegebouw, de regenpijpen en het hekwerk.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rond prisma met een tentdak en een blok met zadeldak) de plint, de band, de vensters, het spitsboogfries op zijn kraag, de achtkante ommanteling met nissen, de overstekende goot, de dakkapellen en de makelaar, en het entreegebouw met trapgevel, schoorsteen, deur en stoep.

Controle-URL: http://localhost:3000/kaart/51.83049/4.98104/200/1x1/0
