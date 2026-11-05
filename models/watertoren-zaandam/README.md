# Watertoren Zaandam (Zaandam)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zaandam.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een prisma op de (scheve) plattegrond, lijsten en banden zijn convexe omhullenden met een onderkant van 45 graden, de vensters, laaddeuren en spleten blinde nissen, de bekroningen cilinders, het dak twee omhullenden (dakvoet en schilddak) met vier dakkapellen, en de rest van de fabriek bestaat uit de dakvlakken van de 3D BAG als prisma's onder hun eigen vlak.

De watertoren van de Verkadefabriek staat aan de Zaan, tegen de noordoosthoek van het fabrieksgebouw uit 1904, naast een insteek in de kade, en bevat het reservoir van de sprinklerinstallatie. Wikipedia geeft 1880 als bouwjaar. Het rijksmonumentenregister beschrijft hem onder monument 518046 (Westzijde 168): rechthoekig, vijf bouwlagen, vlakke bakstenen gevels met hoeklisenen op zware gebosseerde blokken natuursteen, ronde arkelachtige bekroningen op de hoeken, de letters BESCHUIT, VERKADE en KOEKFABRIEK op de attiek (zuid, oost, noord), in de bovenste laag smalle lichtspleten tussen hangende lisenen, en een steil schilddak met rode kruispannen, een korte nok haaks op de Zaan, een dakkapel met steekkap op elk dakvlak en een smeedijzeren bekroning met een windvaan (ruiter). Aan de Zaanzijde zitten de laaddeuren: op de begane grond, een deur in een grote rondboog op de derde laag, een laaddeur met halfrond bovenlicht op de vierde en daarboven een oculus. De toren bestaat nog (luchtfoto, AHN, foto's tot 2016).

Let op: monument 518048, dat de werklijst en Wikidata bij deze toren noemen, is de nieuw-zakelijke watertoren uit 1931 van de biscuitfabriek aan het Hollandse Pad (gele baksteen, balkon met VERKADE). Dit model is de bakstenen toren aan de Zaan uit het Wikipedia-artikel.

## Bestanden

- `watertoren-zaandam.glb`: twee nodes, `building:watertoren-schacht-bekroningen-en-schilddak` (de toren tot het maaiveld) en `building:fabriek-verkade` (de rest van het BAG-pand).
- `watertoren-zaandam.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-zaandam-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [116435.09, 495575.94] (52,44660 N, 4,81996 O), het midden van de torenplattegrond, op het maaiveld NAP +0,3 (AHN-DTM op de kade 0,3 tot 0,4; 3D BAG-maaiveld 0,14). De plattegrond is geen rechthoek: de noordgevel (7,44 m) en de zuidgevel (7,91 m) lopen op RD 3,2 en 2,3 graden, de oostgevel (6,30 m) volgt de kadelijn op 8 graden uit het noorden, de westgevel (6,16 m) loopt vrijwel noord-zuid. De hoekpunten komen uit het BAG-pand (noord- en oostgevel) en de dakvlakken van de 3D BAG (zuid- en westgevel), gecontroleerd op de rand van het AHN-DSM. Lokale +X ligt op RD 3 graden (`xAxis` [0.99863, 0.05234]), +Y wijst naar het noorden (de insteek); de oostgevel staat aan de Zaan.

`groundSamplePoints` liggen op de kade ten oosten (8, 0) en zuidoosten (9, -16) van de toren en op de insteek ten noorden ervan (0, 6,5). `groundHeight` 43,13 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (43,13 oost, 43,28 noord, 43,17 zuidoost, gemeten 2026-11-05 met de terreintegels van de export; aan de Westzijde 42,95). `groundOffsetMetres` is -0,1.

De toren is geen eigen BAG-pand: hij hoort bij pand 0479100000000085 (bouwjaar 1920), het hele fabriekscomplex tussen Westzijde en Zaan. De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model het hele pand, en `building:fabriek-verkade` neemt de rest ervan over uit de 3D BAG, zoals bij de watertoren van Hollandia in Wormer.

## Onderdeel `building:watertoren-schacht-bekroningen-en-schilddak`

Hoogtes boven het maaiveld (NAP +0,3).

- Schacht: de plattegrond van -0,3 tot 22,95 m.
- Gebosseerde blokken natuursteen op de vier hoeken: 0,75 m langs elke gevel, 0,12 m uit, tot 2,5 m, bovenkant 45 graden.
- Natuurstenen band 0,1 m uit van 2,4 tot 2,6 m.
- Hoeklisenen 0,6 m langs elke gevel, 0,12 m uit, van 2,5 tot 20,0 m; middenlisene van 0,5 m (0,1 m uit) op de noord- en zuidgevel.
- Noordgevel (insteek), 1,7 m links en rechts van het midden: begane grond een breed venster van 1,9 m (oost) en een deur van 1,0 m (west), tot 2,2 m; rondboogvensters van 1,7 m van 2,75 tot 4,1 m; vensters van 1,3 m van 5,6 tot 7,5 m; vensters van 1,75 m van 9,4 tot 11,0 m; kleine rondboogvensters van 0,6 m van 13,6 tot 14,7 m.
- Oostgevel (Zaan), op het midden: rondboogopening van 1,5 m van 1,45 tot 3,8 m; grote rondboog van 4,4 m van 7,3 tot 10,1 m (deur met zijlichten op de derde laag); laaddeur met halfrond bovenlicht van 1,1 m van 11,7 tot 13,9 m; oculus van 0,8 m op 15,05 m.
- Bovenste laag op alle vier gevels: verdiepte vakken (0,15 m) tussen de hangende lisenen van 16,3 tot 19,0 m, zes op de noord- en zuidgevel (drie aan weerszijden van de middenpijler), vijf op de oost- en westgevel, met in elk vak een lichtspleet van 0,35 m (0,4 m diep) van 17,1 tot 18,7 m.
- Rollagenfries 0,15 m uit van 20,0 tot 20,35 m, attiek tot 22,7 m, lijst 0,2 m uit van 22,7 tot 22,95 m.
- Ronde bekroningen op de hoeken: 1,3 m, 0,12 m buiten beide gevels (op de hoeklisenen), met een kraag van 45 graden vanaf 19,6 m, tot 23,6 m (AHN-DSM NAP +23,8 tot +24,0).
- Dak: opgelichte dakvoet van de lijst tot 23,55 m (circa 47 graden), daarboven een steil schilddak (circa 60 graden) tot een korte vlakke nok van 1,8 × 0,4 m op 28,25 m (3D BAG NAP +28,55, AHN-DSM +28,4 tot +28,7).
- Vier dakkapellen midden op de dakvlakken: 1,15 m breed tot 24,3 m, steekkap tot 25,9 m, venster als nis van 0,6 m.

Alle nissen hebben een plafond dat naar binnen onder 56 graden oploopt, alle lijsten en kragen een onderkant van 45 graden.

## Onderdeel `building:fabriek-verkade`

De 72 dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0479100000000085 zonder de vier dakvlakken van de toren staan als constante in de generator (`verkadeBag3d()`): per vlak een prisma vanaf de onderkant tot het vlak z = a x + b y + c (kleinste kwadraten door de hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen; binnenringen blijven open. De toren is eruit gesneden, zodat beide nodes elkaar alleen raken. Het complex heeft een binnenplaats (genus 1). Hoogste punt buiten de toren is 22,96 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Zaandam)): 1880, in het fabrieksgebouw van Verkade.
- [Rijksmonumentenregister 518046](https://monumentenregister.cultureelerfgoed.nl/monumenten/518046): beschrijving van de toren (vorm, bouwlagen, lisenen, bekroningen, letters, spleten, dak, dakkapellen, laaddeuren, rondboog, oculus, sprinklerreservoir).
- BAG-pand 0479100000000085 (PDOK, 2026-11-05): noord- en oostgevel van de toren.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0479100000000085, opgehaald 2026-11-05: dakvlakken van de fabriek, zuid- en westgevel van de toren, nok NAP +28,55.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): bovenkant van de bekroningen, nok, maaiveld; luchtfoto voor de ligging.
- Foto's op Wikimedia Commons: "WLM - Minke Wagenaar - 09-09-04 De Zaan 132" (telelens vanaf de Oostzijde, vrijwel orthografisch; schaal 30 px/m uit de afstand tussen nok en bekroningen in het AHN: dakvoet, lijst, letters, fries, bekroningen, vakken en spleten, dakkapellen), "De Zaan 137" (noord- en oostgevel vanaf de kade; vensterhoogtes met een projectieve fit door maaiveld, lisene-einden, fries en lijst), "De Zaan 139" (oostgevel: vijf spleten, oculus, laaddeur, grote rondboog), en de RCE-opnamen 20425100 (zuidgevel, bekroningen, dak en dakkapel), 20425103 (zuid- en westgevel boven de fabriek) en 20425107 (gebosseerde hoek).

## Geschat en weggelaten

Geschat: alle hoogtes onder de bekroningen uit foto's (onzekerheid circa een halve meter; de twee fotometingen van de spleten verschillen 0,6 m), de breedtes en posities van vensters, laaddeuren en rondbogen (op 1,7 m uit het midden en op het midden van de oostgevel), de maat van de bekroningen (1,3 m) en de uitsprong van lisenen, band, fries en lijst, de dakvoet en de nok als vlakke strook van 0,4 m, de maat van de dakkapellen, de plattegrond van de zuid- en westgevel (3D BAG, in de fabriek), en de gevels onder het fabrieksdak (zuid en west: alleen de bovenste laag met vakken en spleten).

Weggelaten: de letters BESCHUIT, VERKADE en KOEKFABRIEK (losse letters met halen van circa 0,2 m), de smeedijzeren bekroning met de windvaan op de nok (staven dunner dan 0,9 m, tot circa 2 m boven de nok), de pironnen op de hoekkepers en dakkapellen, de luiken, de hijsbalk, de rollagen en sierverbanden in het metselwerk, de banden in de bekroningen, de regenpijpen en de glasindeling. De fabriek is niet verfijnd ten opzichte van de 3D BAG.

## Controle

Twee gesloten NoError-nodes met elk één component: de toren genus 0, de fabriek genus 1; ze raken elkaar zonder overlap. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet. De PDOK-reconstructie van het pand is een blok met een eenvoudig schilddak tot 28,3 m boven het maaiveld; in renders van vier kanten heeft het model daartegenover de gebosseerde hoekblokken, de band, de lisenen, de vensters en rondbogen op de noordgevel, de laaddeuren, de grote rondboog en het oculus op de oostgevel, de verdiepte vakken met spleten op alle vier gevels, het fries, de lijst, de ronde bekroningen, de opgelichte dakvoet en de vier dakkapellen. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.44660/4.81996/200/1x1/0
