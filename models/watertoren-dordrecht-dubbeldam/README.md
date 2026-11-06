# Watertoren Dubbeldam (Dordrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-dordrecht-dubbeldam.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, trap en paviljoens zijn prisma's, band, balkon met kraag, goot, kap en lantaarn hulls van zeskanten (planvlakken), de velden, ruiten, deuren en vensters blinde nissen met een schuin plafond.

De watertoren aan de Kromme Zandweg in Dubbeldam (Dordrecht) werd in 1916 gebouwd door Visser & Smit Hanab en was een van de eerste geheel betonnen watertorens in Nederland. Hij is 36,40 m hoog met een reservoir van 200 m³ en een wenteltrap van 112 treden aan de buitenkant naar het uitzichtplatform (Wikipedia). Sinds 1973 is hij buiten gebruik; nu is het een hotel met een café-restaurant op de begane grond. De toren staat er nog (BAG "Pand in gebruik", luchtfoto's 2021 tot 2025, AHN). Een zeskantige betonnen schacht met lisenen op de hoeken en verdiepte velden met ruitvormige vensters, twee banden, een stalen balkon op schoren rond vier zijden, een bovenste verdieping met hoge vensters onder een overstekende goot, een geknikte zeskantige tentkap met een lantaarn en aan de westzijde de stalen wenteltrap. Aan de voet staan drie lage paviljoens die tot hetzelfde BAG-pand horen.

## Bestanden

- `watertoren-dordrecht-dubbeldam.glb`: één node, `building:watertoren-schacht-balkon-kap-trap-en-paviljoens`.
- `watertoren-dordrecht-dubbeldam.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-dordrecht-dubbeldam-1-1000.stl`: het model op 1:1000 (21,6 × 21,1 × 37,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [108698.5, 423108.1] (51,794698 N, 4,716026 O): het hart van de zeskantige kap (de top in het AHN-DSM, NAP +36,47), op het maaiveld NAP −0,3 (AHN-DTM −0,38 tot +0,3 rond de toren, 3D BAG −0,37).

De lokale X-as wijst naar een hoek van de zeskant, 16 graden linksom van RD-oost (`xAxis` [0.96126, 0.27564]); de hoeken in de luchtfoto 2021 liggen op 14 tot 19 graden plus een veelvoud van 60. De zijde met normaal −Y (zuidzuidoost) is de voorzijde op de foto van 2006.

`groundSamplePoints` liggen net buiten de paviljoens (zuid, zuidoost, oost, noord, west); `groundHeight` 43,443 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (zuid 43,443 op de Kromme Zandweg, west 43,533, noord 43,719, oost 43,750, noordoost 43,814, gemeten 2026-11-06). Het PDOK-pand staat op 43,34 met de top op 80,69. `groundOffsetMetres` is −0,1. Het model vervangt het hele BAG-pand 0505100000059591 (toren en paviljoens); geen ander PDOK-pand raakt het model (de dichtstbijzijnde liggen 35 m zuidelijk).

## Onderdelen

Hoogtes boven het maaiveld (NAP −0,3), maten als apothema (afstand hart–zijde) van de zeskant.

- Schacht: zeskant met apothema 3,8 m (zijde 4,39 m) tot de kraag onder de goot. Per zijde verdiepte velden van 3,0 m breed en 0,15 m diep van 0,8 tot 9,7 m en van 10,4 tot 20,5 m; de 0,7 m brede hoeken ertussen zijn de lisenen, de strook van 9,7 tot 10,4 m de onderste band.
- Ruitvensters: 1,1 × 1,5 m, 0,45 m diep, in zes rijen (5,3, 8,1, 11,9, 14,6, 17,3 en 19,7 m) midden op elke zijde. Op de zuidwestzijde zijn de rijen 5,3, 11,9 en 17,3 vervangen door deuren (0,9 × 2,2 m) naar de bordessen van de trap, op 4,3, 10,9 en 16,3 m.
- Bovenste band: 0,15 m uitspringend van 21,0 tot 21,4 m op een onderkant van 53 graden.
- Balkon: plaat van 23,45 tot 23,8 m (3D BAG NAP +23,5), 2,2 m uit de gevel rond de vier zijden van noordwest via zuid tot noordoost, op een kraag van 53 graden vanaf 20,5 m (in plaats van de schoren).
- Bovenste verdieping: hoog venster van 1,0 × 3,7 m (24,3 tot 27,9 m) midden op elke zijde.
- Goot en kap: kraag van 50 graden vanaf 28,45 m naar de goot op 29,8 tot 29,95 m (3D BAG NAP +29,5; hoekstraal 5,6 m); knik aan de goot tot apothema 4,4 m op 30,3 m; onderste kapvlak van 54 graden tot de knik (apothema 2,3 m) op 33,2 m; bovenste kapvlak van 61 graden tot de lantaarn op 35,8 m. De kap wordt naar boven steiler (zoals op de foto) en is daarom opgebouwd uit drie afgeknotte piramides.
- Lantaarn: zeskant van 0,8 m tot 36,45 m met een kap van 0,95 m tot 36,77 m (AHN NAP +36,47).
- Dakkapel: 1,4 m breed op de westzijde van de kap, bij de uitgang van de trap.
- Wenteltrap: trommel van 2,5 m middellijn (16 zijden) op 6 m uit het hart, 17 graden noordelijk van lokaal west, tot het bovenste bordes op 29,6 m, met een ligger van 1,0 m naar de gevel (de bordessen).
- Paviljoens: de drie dakvlakken uit de 3D BAG (LoD2.2) als prisma's: noordwest tot 5,8 m, noordoost tot 4,7 m met een lager daklicht (3,64 m), zuidwest tot 4,36 m met een lager daklicht (3,54 m). Hun contour is aangevuld tot tegen de schacht (de 3D BAG-contour houdt bij de goot op, 1 tot 2 m buiten de schacht).

Nissen hebben een plafond dat naar binnen onder 56 graden oploopt; de ruiten hebben bovenranden van 54 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Dubbeldam)): 1916, Visser & Smit Hanab, 36,40 m, 200 m³, wenteltrap van 112 treden, sinds 1973 buiten gebruik, nu hotel en café-restaurant; gemeentelijk monument.
- BAG-pand 0505100000059591 (PDOK, 2026-11-06): bouwjaar 1916, 221,7 m², één contour voor toren en paviljoens; de zijden rond de toren liggen op 3,6 tot 4,0 m van het hart.
- 3D BAG (LoD2.2) van dat pand: balkon NAP +23,5 aan de oost-, zuid- en zuidwestzijde, goot NAP +29,4 tot 29,6 op 5 à 6 m uit het hart, paviljoens op NAP +5,5, +4,4 en +4,1 met daklichten op +3,3 en +3,2.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP −0,4 tot +0,3, top NAP +36,47, kap 34,6 / 33,9 / 32,9 / 32,0 m NAP op 1,5 / 2 / 2,5 / 3 m van het hart.
- PDOK-luchtfoto's 2021 tot 2025 (orthoHR): zeskantige kap en lantaarn, trap aan de westzijde, balkonrand aan de oost- en zuidzijde, paviljoens; de top staat circa 2,4 m oostelijk verschoven door de scheefstand (2021).
- Foto op Wikimedia Commons: "Dubbeldamwatertoren.jpg" (2006, vanaf het zuidzuidwesten). Meer foto's waren niet op te halen (Commons-zoekfunctie overbelast).

## Geschat en weggelaten

Geschat: de oriëntatie en de hoekstraal van de goot komen uit de luchtfoto 2021 (gecorrigeerd voor de scheefstand), het apothema van de schacht uit de BAG-contour en de verhouding schacht/goot op de foto (1 : 1,23). De hoogtes van de banden, de ruiten, de deuren, de vensters, de knik in de kap en de lantaarn komen van de foto van 2006, geschaald tussen het balkon (3D BAG) en de top (AHN). De ruiten zijn in het echt circa 0,7 × 1,0 m en staan als 1,1 × 1,5 m in het model. De diepte van het balkon (2,2 m) is geschat uit de 3D BAG en de foto; op de foto steekt het aan de oostzijde verder uit. De schoren onder het balkon zijn samengevoegd tot een dichte kraag van 53 graden. De wenteltrap is een dichte trommel met een ligger naar de gevel; plaats en middellijn komen uit het AHN en de luchtfoto's. De dakkapel en de deuren staan op de foto, hun plaats is onzeker.

Weggelaten: de leuningen van balkon, bordessen en trap, de vlaggenmast, het fries van gekleurde tegeltjes onder de goot (circa 0,4 m), de lisenen en velden van de bovenste verdieping (de velden gaven daar in de printopvulling afgeschuinde hoeken), de lamellen van de lantaarn en het glazen terras aan de zuidzijde (geen BAG-pand). De gevels van de paviljoens zijn vlakke wanden.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet en blijven de doorsneden gelijk. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun (geen ondersteuningsobject) en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde geribde kolom met een spits dak en drie blokken) de zeskantige schacht met velden, ruiten, deuren en banden, het balkon, de bovenste verdieping met vensters, de overstekende goot, de geknikte kap met lantaarn en dakkapel en de wenteltrap.

Controle-URL: http://localhost:3000/kaart/51.79470/4.71603/200/1x1/0
