# Watertoren Soestdijk (Baarn, park van Paleis Soestdijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:100. Generator: `scripts/generate-watertoren-soestdijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks (zonder `--scale` schrijft hij de STL op 1:100). Geen hoogteplakken: de toren is een 96-hoekig prisma met een plint, het rondboogfries en de dakrand als convexe omhullenden naar een twaalfhoek, de uitbouw is een prisma op de BAG-plattegrond met een kroonlijst als omhullende en een schilddak uit planvergelijkingen (per gootlijn een flauw en een steil vlak), en de vensters en deuren zijn nissen.

De watertoren is in 1680 gebouwd naar ontwerp van fontainier Willem Meesters als reservoir voor de fonteinen in de tuin van Willem III (rijksmonument 531294, onderdeel van het complex Paleis Soestdijk). Wikipedia noemt een hoogte van 10 m en een reservoir van 60 m³; op het platte dak stond oorspronkelijk een zeswiekige windmolen, met een rosmolen binnen als hulp. Rond 1884 is de toren verbouwd door L.H. Eberson. Het register beschrijft een cilindrische bakstenen toren op een natuurstenen plint met een twaalfzijdige uitkraging op een natuurstenen rondboogfries, een plat dak, hele en halve kruisvensters met natuurstenen omlijstingen, en aan de zuidwestzijde een uitbouw van één bouwlaag met een driezijdige beëindiging en een schilddak van leien. De hoofdingang zit in die uitbouw. De toren bestaat nog (BAG: pand in gebruik, nu museumwinkel).

## Bestanden

- `watertoren-soestdijk.glb`: één node `building:watertoren-met-twaalfzijdige-uitkraging-en-uitbouw-met-schilddak`, op maaiveld.
- `watertoren-soestdijk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-soestdijk-1-100.stl`: alles samen op 1:100 (10,2 × 15,4 × 10,3 cm).

## Oorsprong en oriëntatie

RD-oorsprong [147528.71, 467456.93] (52,19518 N, 5,27793 O), het hart van de toren: een cirkelfit op de tien boogpunten en de twee aansluitpunten van BAG-pand 0308100000001971 (straal 5,29 m, restfout 0,06 m). De BAG-contour is de dakrand: op de luchtfoto is de twaalfhoekige dakrand ook 10,6 m breed. Lokale -Y loopt langs de as van de uitbouw naar zijn deur (kompas 237 graden, westzuidwest; de zijgevels van de uitbouw liggen in de BAG op 32,8 graden in RD), dus +X wijst naar het zuidoosten (RD -57,2 graden) en +Y naar het noordoosten. In dat stelsel is de BAG-contour spiegelsymmetrisch.

`groundHeight` 49,00 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost op 6 m 49,00, noordoost 49,31, west 49,13, voor de deur van de uitbouw 49,08; gemeten 2026-11-06). Het PDOK-pand loopt van 48,81 tot 58,96 en het AHN-dak ligt op NAP +15,72, dus ellipsoïdisch is hier NAP + 43,24 en z = 0 ligt op NAP +5,76 (AHN-DTM rond de toren 5,7 tot 6,1). `groundOffsetMetres` is -0,1. Het model vervangt BAG-pand 0308100000001971, zodat de PDOK-reconstructie (een twaalfhoekig prisma met een blok voor de uitbouw) verdwijnt.

## Onderdeel `building:watertoren-met-twaalfzijdige-uitkraging-en-uitbouw-met-schilddak`

Hoogtes boven z = 0 (NAP +5,76).

- Plint: 96-hoek met straal 4,7 m tot 0,55 m, afzaat naar de cilinder.
- Cilinder: straal 4,6 m tot 8,0 m.
- Rondboogfries: uitkraging naar een twaalfhoek met omgeschreven straal 5,02 m op 8,5 m (op de hoeken 0,42 m over 0,5 m), hoekpunten op 15 + k × 30 graden vanaf +X, zoals de BAG-hoekpunten symmetrisch rond de as van de uitbouw liggen.
- Twaalfzijdige bovenwand tot 9,45 m, daarna de witte dakrand: onderkant naar omgeschreven straal 5,27 m (BAG) op 9,75 m, plat dak op 9,96 m (AHN-DSM NAP +15,72 binnen de hele dakrand; 3D BAG 50e percentiel 15,71).
- Vensters als nissen van 0,3 m met een plafond van 63 graden: drie op de verdieping (kompas 114, 137 en 159 graden; 0,8, 0,75 en 0,6 m breed, van 4,2 tot 6,0 m) en één op de begane grond (137 graden, 1,0 tot 2,9 m). Deur met bovenlicht naar het noordoosten (kompas 35 graden, 0,85 m breed, tot 3,0 m).
- Uitbouw: zijgevels op x = ±3,25 m tot y = -8,37, schuine gevels naar de voorgevel op y = -10,02 (2,54 m breed), gevels tot 2,8 m, kroonlijst (het rondboogfries van de uitbouw) 0,3 m naar buiten onder 47 graden tot de goot op 3,15 m (AHN-DSM circa NAP +9,0).
- Schilddak: de onderste 0,5 m van elk dakvlak loopt onder 28 graden uit naar de goot, daarboven 47 graden naar de nok op 6,64 m (AHN-DSM NAP +12,4; 3D BAG h_nok 12,39) langs de as van y = -8,0 tot de toren; de drie vlakken van de beëindiging lopen steiler (60 graden) naar de voorkant van de nok, zoals het AHN-DSM laat zien.
- Dakkapel op het voorste dakvlak: 1,0 m breed, voorkant op 4,3 m, wangen tot 5,25 m, schilddakje tot 5,8 m.
- Deur in de voorgevel van de uitbouw (1,05 m breed, tot 2,35 m) en venster in de zuidoostgevel (0,8 m breed, 1,15 tot 1,85 m), als nissen.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Soestdijk)): 1678 tot 1683, Willem Meesters, 10 m, 60 m³, windmolen op het platte dak, rosmolen, verbouwing door Eberson.
- [Rijksmonumentenregister 531294](https://monumentenregister.cultureelerfgoed.nl/monumenten/531294): cilinder van 8,20 m doorsnede en circa 9 m hoog, natuurstenen plint, twaalfzijdige uitkraging op een natuurstenen rondboogfries, plat dak, kruisvensters met natuurstenen omlijstingen, uitbouw met driezijdige beëindiging en leien schilddak aan de zuidwestzijde.
- BAG-pand 0308100000001971 (PDOK, bouwjaar 1680, 2026-11-06): dakrand en plattegrond van de uitbouw.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): plat dak, nok en goot van de uitbouw, maaiveld.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0308100000001971: dak- en nokhoogte, oppervlak van het platte dak (86,7 m²).
- PDOK-luchtfoto (Actueel_orthoHR): twaalfhoekige dakrand, leien dak van de uitbouw.
- PDOK-terrein (2026-11-06): maaiveld rond de voet.
- Foto's op Wikimedia Commons: "Overzicht van de watertoren - Soestdijk - 20423187 - RCE.jpg" (vanuit het zuidzuidoosten), "Overzicht van de achtergevel en zijgevel van de watertoren - Soestdijk - 20423404 - RCE.jpg" (vanuit het oosten), "Overzicht van de voorgevel van de watertoren - Soestdijk - 20423403 - RCE.jpg" (frontaal op de uitbouw), "Soestdijk Watertoren 0537.JPG" (vanuit het zuiden), "Watertoren aanzicht vanuit het noord-oosten - Soestdijk - 20202439 - RCE.jpg".

## Geschat en weggelaten

Geschat: de doorsnede van de cilinder (9,2 m). Op de foto's is de cilinder 0,81 tot 0,91 keer zo breed als hoog en de dakrand 1,04 tot 1,10 keer zo breed als de cilinder; met de dakrand uit BAG en luchtfoto (10,6 m) en de hoogte uit het AHN (9,96 m) komt dat op 8,9 tot 9,6 m. Het register noemt 8,20 m, maar dan zou de dakrand 1,2 m uitkragen, en dat is op geen enkele foto te zien. Verder uit foto's geschat: de hoogtes van de plint, het fries, de bovenwand en de dakrand (circa 0,2 m onzeker), de plaats en de maat van de vensters en deuren (hoeken circa 5 graden onzeker; het breedste venster staat 3 graden verder dan op de foto, zodat de penant naar het volgende venster ook achter in de nissen 0,9 m blijft), de knik in het dak van de uitbouw, de maat van de dakkapel, en de diepte van de nissen. De noordwestkant van de toren staat op geen enkele foto; daar zijn geen vensters aangenomen.

Weggelaten: de natuurstenen omlijstingen van de vensters en deuren, de lateien, de rondbogen van het fries als losse consoles, de rode banden in het metselwerk, de tandlijst onder de dakrand, de regenpijpen en goten, de kleine plint van de uitbouw, het daklicht en het luik op het platte dak (allemaal kleiner dan 0,9 m), en de klimop.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: het fries en de dakrand kragen uit onder 40 graden, de kroonlijst van de uitbouw onder 47 graden met een flauwe dakvoet erboven, en de nissen hebben een plafond van 63 graden. In een tegelexport op 1:1000 (80 m, ondersteuning v2, 45 graden) vervangt het model het PDOK-pand en eindigt het 0,1 mm lager dan dat pand (13,33 tegen 13,43 mm, de `groundOffsetMetres`); er komt geen ondersteuningsobject bij. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde twaalfhoek met een vlak dak en een blok met een plat schilddak) aan elke kant de plint, het fries met de uitkraging en de dakrand, aan de zuidoost- en oostkant de vensters, aan de noordoostkant de deur, en aan de westkant de uitbouw met de kroonlijst, het geknikte schilddak, de dakkapel en de deur.

Controle-URL: http://localhost:3000/kaart/52.19519/5.27790/200/1x1/0
