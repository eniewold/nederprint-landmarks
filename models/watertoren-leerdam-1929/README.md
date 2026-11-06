# Watertoren Leerdam (1929) (Leerdam)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-leerdam-1929.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, reservoirverdieping en lantaarn zijn tienkante prisma's, de kraag onder de band en de afzaat van de plint hulls tussen twee tienhoeken, de kap een hull van een tienhoek en een kleinere tienhoek, de piek getrapte tienkante prisma's met een punt, de voeten en consoles van de lisenen hulls per hoek, de trappentoren een achtkant prisma met een dekplaat, het portaal een prisma op de BAG-contour, de velden en vensters blinde nissen met een schuin plafond.

De derde watertoren van Leerdam werd in 1929 gebouwd door Visser & Smit. Hij is volgens Wikipedia 50,25 m hoog en had een reservoir van 500 m³. Sinds mei 2009 is hij buiten gebruik; een plan uit 2012 om hem te slopen voor woningbouw ging niet door, en de toren is nu particulier bewoond. De toren staat er nog (luchtfoto en AHN, foto uit 2023 kort voor de verkoop). Een tienkante toren van donkere baksteen met betonnen lisenen op alle hoeken: een plint met uitgezette voeten onder de lisenen, een benedenverdieping met een vensterstrook onder een betonnen latei, een schacht met verdiepte bakstenen velden en kleine vensters langs de trap, een betonnen band op consoles, een iets bredere reservoirverdieping met verdiepte velden en een betonnen dakrand, een plat dak met een tienkante lantaarn met vensters, een tienkante spitse kap en een getrapte piek. Aan de noordnoordwestzijde staat een lagere trappentoren met een overstekende dekplaat, aan de zuidzuidoostzijde een laag portaal en hoog aan de noordwestzijde een uitbouwtje.

## Bestanden

- `watertoren-leerdam-1929.glb`: één node, `building:watertoren-tienkant-lisenen-band-lantaarn-kap-en-trappentoren`.
- `watertoren-leerdam-1929.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-leerdam-1929-1-1000.stl`: het model op 1:1000 (11,5 × 14,1 × 51,9 mm).

## Oorsprong en oriëntatie

RD-oorsprong [135152.59, 434026.52] (51,894402 N, 5,098863 O): het hart van de voetafdruk van BAG-pand 0545100000338731 (kleinste-kwadratencirkel door 21 punten van de toren zelf, straal 5,49 m, afwijking 0,04 m), op het maaiveld: AHN-DTM NAP +1,1 (1,0 tot 1,2 rond de voet). De piek in het AHN-DSM 0,5 m ligt binnen 0,3 m van dat hart.

De lokale X-as is RD-oost (`xAxis` [1, 0]). De toren, de lantaarn, de kap en de piek zijn tienhoeken met hoeken op k × 36 graden, dus met een zijde naar het zuiden en het noorden: op de luchtfoto ligt de onderste zijde van de lantaarn oost-west, en op de telefoto staat de lantaarn in dezelfde stand als de toren (de hoeken van beide liggen op dezelfde verticale lijnen). Hoeken hieronder in graden linksom vanaf RD-oost.

`groundSamplePoints` liggen op 7,5 m oost, west en zuid en 8,5 m noord (voorbij de trappentoren); `groundHeight` 44,616 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 44,656, west 44,632, noord 44,647, zuid 44,616, gemeten 2026-11-06). Het PDOK-pand staat op 44,40. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +1,1); stralen zijn hoekstralen van de tienhoek (apothema = 0,951 × hoekstraal).

- Plint: hoekstraal 5,4 m tot 0,5 m, afzaat van 50 graden tot de schacht op 0,9 m.
- Voeten van de lisenen: op elke hoek, 0,9 m breed, van 5,75 m uit het hart op 0,5 m schuin (75 graden) naar de hoek van de schacht op 3,0 m.
- Benedenverdieping: vensterstrook als nis (2,0 m breed, 1,4 tot 2,9 m, 0,3 m diep) in elk vlak behalve waar de trappentoren (vlakken 90 en 126 graden) en het portaal (306 graden) aansluiten; daarboven de latei als volle muur tot 3,6 m.
- Schacht: hoekstraal 5,05 m tot 27,3 m. Verdiepte velden tussen de lisenen (2,35 m breed, 0,2 m diep, 3,6 tot 26,4 m), zodat op elke hoek een lisene van circa 0,8 m blijft staan. Acht kleine vensters (1,0 × 1,4 m) in de velden op 162, 198 en 234 graden (6,0 tot 24,0 m, verspringend langs de trap) en op 18 en 342 graden.
- Consoles: onder elke lisene van 26,3 m (hoekstraal 5,05) tot 27,9 m (5,62), onderkant onder 70 graden.
- Band: kraag van 50 graden van de schacht naar hoekstraal 5,55 m (27,3 tot 27,9 m) en een volle band tot 29,0 m.
- Reservoirverdieping: hoekstraal 5,55 m tot het platte dak op 40,73 m (3D BAG/AHN NAP +41,83). Verdiepte velden (2,6 m breed, 0,2 m diep, 29,0 tot 39,6 m); de dakrand van 39,6 tot 40,73 m blijft vol.
- Uitbouwtje: op het vlak van 126 graden, 1,2 m breed, 0,85 m uit het vlak, 32,9 tot 34,4 m, onderkant onder 51 graden.
- Lantaarn: hoekstraal 2,9 m van het dak tot 46,4 m (3D BAG: rand NAP +47,55), met een venster als nis (1,0 × 0,9 m, 44,5 tot 45,4 m) in elk vlak.
- Kap: tien vlakken vanaf hoekstraal 2,47 m (binnen de rand van de lantaarn) op 46,4 m tot 0,63 m op 49,2 m, helling 1,6 (58 graden; AHN-DSM 0,8 m per halve meter).
- Piek: tienkante treden van hoekstraal 0,63 m tot 50,0 m en 0,5 m tot 50,7 m, daarboven een punt tot 51,6 m (AHN NAP +52,71).
- Trappentoren (noordnoordwest): achtkant met apothema 1,6 m om (−2,5; 5,4), met een zijde naar 114,8 graden (naar buiten); BAG: halfrond uitsteeksel tot 7,6 m uit het hart. Tot 11,2 m, kraag van 50 graden en een dekplaat met apothema 1,85 m van 11,5 tot 12,14 m (3D BAG NAP +13,24). Een deur (1,0 × 2,2 m) en twee vensters (0,9 × 1,2 m) naar buiten.
- Portaal (zuidzuidoost): BAG-contour (1,55; −5,25) (2,27; −6,66) (4,27; −5,76) (3,57; −4,23), tot in de toren doorgetrokken, plat dak op 3,18 m (3D BAG NAP +4,28), een deur (1,2 × 2,3 m) in de voorgevel.

Nissen zijn 0,2 tot 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Leerdam_1929)): 1929, Visser & Smit, 50,25 m, 500 m³, buiten gebruik sinds mei 2009, sloopplan 2012 afgewezen, nu particulier bewoond.
- BAG-pand 0545100000338731 (PDOK, 2026-11-06): ronde voetafdruk (straal 5,49 m) met de trappentoren en het portaal; bouwjaar 1929.
- 3D BAG (LoD2.2): dak NAP +41,83, rand van de lantaarn NAP +47,55, top van de kap NAP +51,0, trappentoren NAP +13,24, portaal NAP +4,28, maaiveld NAP +0,88.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +1,0 tot 1,2 rond de voet, plat dak NAP +41,8 tot een straal van circa 5 m, kap met een helling van circa 1,6, piek NAP +52,71.
- PDOK-luchtfoto (Actueel_orthoHR): tienkante lantaarn (5,8 m over de hoeken) met een zijde naar het zuiden, de dakrand.
- Foto's op Wikimedia Commons: "Leerdam - Watertoren bouwjaar 1929 met huizen.jpg" (telefoto, de breedtes en de stand van de lantaarn), "Leerdam - Watertoren bouwjaar 1929.jpg", "Leerdam, watertoren foto3 2010-06-27 10.42.JPG" (band, consoles en uitbouwtje van dichtbij), "Exterieur OVERZICHT - Leerdam - 20300699 - RCE.jpg" (de voet, de trappentoren en het uitbouwtje), "Watertoren Leerdam De Landerije Makelaars.jpg" (2023, schuin van boven).

## Geschat en weggelaten

Geschat: de hoogtes van dak, lantaarn, kap en piek, de trappentoren en het portaal komen uit het AHN en de 3D BAG. De breedtes komen uit de telefoto vanuit de stad, geschaald op de lantaarn op de luchtfoto (5,8 m over de hoeken): de reservoirverdieping is 1,91 keer zo breed als de lantaarn (hoekstraal 5,55 m) en de schacht 0,91 keer de reservoirverdieping (5,05 m); dat is circa 0,15 m onzeker. De BAG-straal van 5,49 m ligt daartussen. Het aantal zijden (tien) volgt uit de stand van de lisenen op de telefoto (vijf vlakken zichtbaar, hoeken op sin −0,76, −0,22, 0,40 en 0,85 van de halve breedte, precies een tienhoek) en de luchtfoto. De stand (een zijde naar het zuiden) is circa 3 graden onzeker. De hoogte van de band (27,3 tot 29,0 m) en van het uitbouwtje komt uit de telefoto en de RCE-foto (circa een halve meter onzeker); de hoogte van de lantaarn uit het AHN, want op de foto's vanaf de grond valt de voet van de lantaarn achter de dakrand weg. De vensters in de schacht zijn naar de foto's verdeeld; hun richting is niet overal vast te stellen. Het uitbouwtje staat op de foto's steeds aan dezelfde kant als de trappentoren; het vlak (126 graden) is circa 36 graden onzeker. De trappentoren is als achtkant gemodelleerd op de BAG-contour; de lisenen op zijn hoeken zijn weggelaten.

Weggelaten: de smalle verticale vensterspleten in de velden van de reservoirverdieping en de regenpijp (smaller dan 0,9 m), het kastje op de dakrand, de lisenen op de hoeken van de trappentoren en de kleine lijsten van de lantaarn (ondieper dan 0,3 m), de antennes (op de RCE-foto, niet meer op recente foto's), het hekwerk.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rond prisma met een rond blok erop en een strook langs de trappentoren) de tienkante vorm met lisenen, voeten, velden en vensters, de band op consoles, de bredere reservoirverdieping met het uitbouwtje, de tienkante lantaarn met vensters, de spitse kap met de piek, en de trappentoren met dekplaat en het portaal met deur.

Controle-URL: http://localhost:3000/kaart/51.89440/5.09886/200/1x1/0
