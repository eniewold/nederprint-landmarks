# Watertoren De Adelaar (Wormerveer)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-wormerveer-de-adelaar.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en ommanteling zijn rechthoekige prisma's, de consoles, de boogjes, de lijst en de ezelsrug convexe omhullenden met schuine onderkanten, het dak een schilddak van vier vlakken, de vakken en de deur blinde nissen, de adelaar convexe vormen, en de rest van de fabriek bestaat uit de dakvlakken van de 3D BAG als prisma's onder hun eigen vlak.

De watertoren van zeepziederij De Adelaar aan de Zaandijkerweg 5 is in 1908 gebouwd, toen de fabriek na de brand van 1906 werd herbouwd naar ontwerp van de Amsterdamse architecten J.P.F. van Rossem en W.J. Vuijk (rijksmonument 526437). Hij staat op de hoek van het fabrieksgebouw aan de Zaankant en bestaat nog (RCE-opnamen, Commons-foto's, AHN en luchtfoto van 2025). Boven het platte dak van de fabriek (vier bouwlagen, bijna 13 m) staat een bakstenen opbouw van circa 7 m (Wikipedia) met een stalen tank. De schacht heeft lisenen met dubbele gele speklagen (zeven op de noord- en zuidgevel, zes op de oost- en westgevel) en een deur naar het dak; op elke lisene staat een console van baksteen en hardsteen, met boogjes ertussen, die de uitkragende rechthoekige reservoirommanteling dragen. Daarop staat in witte steen "ZEEPZIEDERIJ" (noord en zuid) en "DE ADELAAR" (oost en west). De ommanteling wordt afgesloten door een ezelsrug met hardstenen hoeken; binnen die rand ligt een laag zinken schilddak. Op de top staat een betonnen adelaar met gespreide vleugels (spanwijdte 6,75 m) die naar de Zaan kijkt, een replica van het bronzen beeld dat bij de brand van 1906 in de Zaan viel.

## Bestanden

- `watertoren-wormerveer-de-adelaar.glb`: drie nodes, `building:watertoren-schacht-consoles-ommanteling-en-dak` (de toren tot het maaiveld), `building:adelaar` (het beeld) en `building:zeepziederij-de-adelaar` (de rest van het BAG-pand).
- `watertoren-wormerveer-de-adelaar.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-wormerveer-de-adelaar-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [115769.27, 499933.83] (52,48572 N, 4,80966 O), het hart van de reservoirommanteling, op het maaiveld NAP +0,45 (AHN-DTM op de kade en de straat 0,13 tot 0,53). Lokale +X wijst naar de Zaan (RD-richting 30,8 graden, uit de gevels van het BAG-pand, 29,7 tot 32,1 graden, en de kleinste omhullende van de ommanteling in het AHN-DSM; `xAxis` [0.85896, 0.51204]), +Y naar het noordwesten, het fabrieksdak op. De oost- en zuidgevel van de ommanteling komen uit de BAG (de hoek van de toren steekt daar 0,1 tot 0,2 m buiten de fabrieksgevels), de breedtes uit het AHN-DSM boven NAP +21,5 (dat ten opzichte van de BAG circa 0,3 m naar het westen en zuiden ligt, ook bij de fabrieksgevels). `groundHeight` 43,2 is de terugval (NAP +0,45 plus een geoïdehoogte van circa 42,75 m, als bij de Hollandia-toren in Wormer op 1,3 km). `groundOffsetMetres` is -0,1.

De toren is geen eigen BAG-pand: hij hoort bij pand 0479100000000687 (de zeepziederij met de aanbouw uit 1915). De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model het hele pand, en `building:zeepziederij-de-adelaar` neemt de rest ervan over uit de 3D BAG (zie hieronder), zoals bij de Hollandia-toren in Wormer.

## Onderdeel `building:watertoren-schacht-consoles-ommanteling-en-dak`

Maten als hele breedtes langs x × y, hoogtes boven het maaiveld (NAP +0,45).

- Schacht: 5,6 × 5,3 m van -0,3 tot de consoles. Onder het fabrieksdak (13,65 m, AHN NAP +14,1) zit hij in de fabriek; aan de oost- en zuidkant loopt de fabrieksgevel tot het dak door en staat de schacht erboven 0,65 m terug.
- Boven het dak: lisenen van 0,45 m (zeven op de noord- en zuidgevel, zes op de oost- en westgevel, gelijk verdeeld met de buitenste op de hoeken) met verdiepte vakken van 0,2 m ertussen van 13,75 tot 16,3 m; in het midden van de westgevel een deur van 1,0 m breed van 13,75 tot 15,95 m als nis van 0,35 m.
- Consoles: op elke lisene één, van de gevel op 16,6 m tot 0,65 m ervoor op 18,05 m (66 graden), met een kopje tot onder de ommanteling.
- Boogjes: tussen de consoles een kraag van 17,2 m aan de gevel tot de ommanteling op 18,3 m (59 graden), 0,2 m achter de voorkant van de consoles.
- Ommanteling: 6,9 × 6,6 m van 18,3 tot 20,65 m.
- Lijst: 0,12 m uit van 20,45 tot 20,65 m met een onderkant van 45 graden.
- Ezelsrug: een rand van 0,55 m breed met een schuine buitenkant tot 20,95 m (AHN NAP +21,3 tot 21,5 op de rand).
- Schilddak: binnen de rand vanaf 20,6 m (een goot van 0,35 m) tot een korte nok van 0,3 m langs x op 22,1 m (circa 28 graden; 3D BAG NAP +22,7).
- Voetstuk van de adelaar: 1,1 × 1,1 m, 0,1 m naar de Zaan, tot 22,9 m met een afgeschuinde bovenrand.

## Onderdeel `building:adelaar`

Kop naar de Zaan (+X), vleugels langs y tot 3,375 m van het hart (spanwijdte 6,75 m, register). Romp van 22,85 tot 24,5 m (circa 1,4 × 0,9 m), staart naar achteren met een onderkant van 47 graden, kop met snavel tot 24,95 m. Elke vleugel bestaat uit een arm van de schouder (0,3 m van het hart, 23,5 tot 24,55 m) tot de pols (1,7 m, 23,85 tot 24,9 m) en een hand met gespreide slagpennen tot de top (24,55 tot 25,45 m, AHN-DSM NAP +25,9); koord 1,2 tot 1,3 m, dikte 1,05 tot 0,9 m. De vleugels hangen vrij, zoals in het echt: de export vult er een wig van 45 graden onder (samen circa 6 m³, op het dak en de rand van de toren).

## Onderdeel `building:zeepziederij-de-adelaar`

De 24 dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0479100000000687 staan als constante in de generator (`adelaarBag3d()`): per vlak een prisma vanaf de onderkant tot het vlak z = a x + b y + c (kleinste kwadraten door de hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen; gaten in de vlakken zijn weggelaten. De zes dakvlakken van de watertoren liggen als vlak op het fabrieksdak (13,65 m), en de schacht is eruit gesneden, zodat de fabriek als ring om de toren ligt (genus 1). De liftopbouw op het dak (tot 17,77 m) en de aanbouw uit 1915 komen zo uit de 3D BAG.

## Bronnen en maten

- [Rijksmonumentenregister 526437](https://monumentenregister.cultureelerfgoed.nl/monumenten/526437): bouwjaar, architecten, ligging aan de Zaankant, toren van één bij twee traveeën met zes en zeven lisenen met dubbele speklagen, consoles van baksteen en hardsteen, uitkragende ommanteling met ezelsrug en letters, betonnen adelaar met 6,75 m spanwijdte naar de Zaan; fabriek bijna 13 m.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Wormerveer)): 1908, stalen tank op een bakstenen opbouw van 7 m.
- BAG-pand 0479100000000687 (PDOK, 2026-11-05): plattegrond, richting en de hoek van de toren.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0479100000000687, opgehaald 2026-11-05: dakvlakken van de fabriek, toren tot NAP +22,7.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): fabrieksdak NAP +14,0 tot 14,3, rand van de ommanteling +21,3 tot 21,5, schilddak tot circa +22,6, vleugels van de adelaar +25,5 tot 25,9 over 5,7 m (de dunne toppen ziet het DSM niet), ommanteling 6,9 × 6,6 m, maaiveld 0,13 tot 0,53. Tussen NAP +15 en +20 ligt rond de zuid-, oost- en westgevel van de schacht een band van 1 tot 1,5 m: steigerwerk tijdens de opname, niet de toren. Luchtfoto voor het schilddak binnen de rand en de stand van de adelaar.
- Foto's op Wikimedia Commons: "Gevel van liftopbouw en toren met adelaar - Wormerveer - 20356385 - RCE" (noordgevel vrijwel frontaal vanaf het dak; 100,7 px/m verticaal uit dak tot rand = 7,25 m: hoogtes van vakken, consoles, ommanteling en lijst, schacht 0,8 × de ommanteling, zeven lisenen), "Watertoren van zeepziederij met adelaar op dak - 20356378 - RCE" en "Gevel van toren, met adelaar - 20356381 - RCE" (westgevel met deur, consoles en boogjes, ezelsrug, adelaar), "Overzicht met ligging, oostzijde - 20356361 - RCE" en "Wormerveer Watertoren 5358" (Zaankant: de fabrieksgevel loopt onder de toren door tot het dak, adelaar frontaal), "Detail, adelaar op dak - 20356375 - RCE".

## Geschat en weggelaten

Geschat: de hoogtes van de geledingen uit één frontale foto met een schaal uit de hoogte boven het dak (onzekerheid circa een halve meter); de breedte van de schacht (0,8 × de ommanteling, in beide richtingen 0,65 m uitkraging); de breedte van de lisenen (0,45 m) en de diepte van de vakken (0,2 m); de plaats en maat van de deur; het profiel van de boogjes als één schuine kraag; de breedte van de ezelsrug; de dakhelling (circa 28 graden tussen rand en top); de vorm van de adelaar (romp, staart, kop, de knik bij de pols) uit foto's, met de toppen uit het DSM en de spanwijdte uit het register; de richting (30,8 graden, de BAG-gevels geven 29,7 tot 32,1).

Weggelaten: de letters "ZEEPZIEDERIJ" en "DE ADELAAR" en de witte banden (vlak in het metselwerk), het kleine boogvenster in de ommanteling (circa 0,75 × 0,65 m, kleiner dan 0,9 m), de gele speklagen, de hardstenen hoekstukken van de ezelsrug, de veren van de adelaar. De rest van de fabriek is niet verfijnd ten opzichte van de 3D BAG; de silo's en het lage pand ten zuiden zijn eigen BAG-panden en blijven PDOK.

## Controle

Drie gesloten NoError-nodes met elk één component: de toren en de adelaar genus 0, de fabriek genus 1 (ring om de schacht); toren en fabriek raken elkaar zonder overlap, de adelaar zit 5 cm in het voetstuk. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume van toren en fabriek niet; onder de vleugels van de adelaar komt samen circa 6 m³ (6 mm³ op 1:1000), als wiggen op het dak en de rand van de toren, niets lager dan 20 m. De kaart en de preview-export zijn in deze ronde niet bekeken (geen dev-server). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de 3D BAG-reconstructie van de toren (een gekartelde kolom met steigerwerk en een hobbelige top tot NAP +22,7) de schacht met lisenen en vakken, de deur, de consoles met boogjes, de uitkragende ommanteling met lijst, de ezelsrug, het schilddak en de adelaar met gespreide vleugels.

Controle-URL: http://localhost:3000/kaart/52.48572/4.80966/200/1x1/0
