# Watertoren Mijdrecht (Mijdrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-mijdrecht.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en zadeldak zijn één dwarsprofiel (gevels, gootlijst en twee dakvlakken) dat over de diepte van de toren is geëxtrudeerd, het portaal is een geëxtrudeerd profiel met lessenaardak, de steunbeer een hull met een schuin voorvlak, de balkons zijn omwentelingsvormen en de vensters en deuren blinde nissen.

De watertoren aan de Industrieweg 6 werd in 1937 gebouwd naar ontwerp van ingenieursbureau MABEG voor de Drinkwatervoorziening Noord-West-Utrecht en is in 2005 buiten gebruik gesteld; hij is rijksmonument 514700. Volgens Wikipedia en het register is hij 41 m hoog, met bovenin een betonnen vlakbodemreservoir van 500 m³ (circa 8 x 8 x 8 m). Het is een vierkante, rechte bakstenen schacht in de stijl van de Delftse School met een steil leien zadeldak als bij een kerktoren. Op de noord- en de zuidgevel (de topgevels) zit halverwege een rondboogdeur met een halfrond balkon met stalen balustrade; tegen de oostgevel staat een portaal met een leien lessenaardak en een dubbele rondboogdeur, met links ervan een verjongende steunbeer.

## Bestanden

- `watertoren-mijdrecht.glb`: één node, `building:watertoren-schacht-zadeldak-balkons-steunbeer-en-portaal`.
- `watertoren-mijdrecht.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-mijdrecht-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [119699.28, 468823.02] (52,20638 N, 4,87078 O): het hart van de rechthoekige schacht in BAG-pand 0736100000006955 (9,32 x 9,47 m), op het maaiveld: AHN-DTM NAP −5,05 (ring van 7 tot 15 m: −5,4 tot −4,7; 3D BAG −5,13).

+X wijst naar RD-richting 0,2 graden (`xAxis` [1, 0.0035], evenwijdig aan de BAG-gevels), +Y naar het noorden. De nok loopt noord-zuid, langs Y.

`groundSamplePoints` liggen op 7,5 tot 8 m in de vier asrichtingen, buiten het portaal; `groundHeight` 38,68 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (zuid 38,70, noord 38,73, west 38,79, oost 38,68, gemeten 2026-11-06). De PDOK-reconstructie van het pand staat op 38,46. `groundOffsetMetres` is −0,1.

## Onderdelen

Hoogtes boven het maaiveld (NAP −5,05), maten in het lokale stelsel.

- Schacht: 9,32 x 9,47 m (BAG), recht, tot de gootlijst.
- Zadeldak: twee dakvlakken van 53,5 graden (helling 1,35 uit het AHN-DSM, binnen 0,05 m over 3,5 m dakvlak) met de nok op 41,32 m (NAP +36,27; 3D BAG 36,32), over de hele diepte van de toren; de topgevels liggen gelijk met het dakvlak. Gootlijst 0,3 m buiten de oost- en westgevel, van 34,32 tot 34,62 m, met een onderkant van 50 graden.
- Balkons: op beide topgevels een halve schijf van 0,9 m straal, vloer op 20,7 m, met de balustrade als dichte rand tot 21,7 m en een kegelvormige onderkant van 50 graden; daarachter een rondboogdeur van 1,0 m breed van 20,7 tot 24,1 m (boog vanaf 23,2 m).
- Vensters als nissen van 0,3 m diep: twee kleine vensters bovenin elke topgevel (0,5 m breed, 35,6 tot 37,3 m); vier kleine vensters onder elke goot (0,45 m breed, 32,5 tot 33,4 m); in de oostgevel drie smalle hoge vensters (0,4 m breed, 21,5 tot 23,8 m, 1,9 m ten zuiden van het hart); in de noordgevel twee hoge vensters bij de oosthoek (0,45 m breed, 2,0 tot 5,0 m) en een klein venster (1,0 tot 2,0 m); in de zuidgevel een klein venster (1,3 tot 2,4 m).
- Steunbeer tegen de oostgevel: van 4,15 tot 2,9 m ten zuiden van het hart, aan de voet 1,16 m uit de gevel (BAG), met een voorvlak dat tot 30,5 m in de gevel verloopt.
- Portaal tegen de oostgevel: 1,16 x 5,45 m (BAG, van 2,9 m ten zuiden tot 2,55 m ten noorden van het hart), gevel tot 2,8 m, lessenaardak van 60 graden tot 4,81 m tegen de toren, met een dubbele rondboogdeur van 1,6 m breed als nis in het oostvlak.

Gootlijst en balkons hebben een onderkant van 50 graden, de nissen een plafond van 60 tot 63 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Mijdrecht)): Industrieweg, 1937, MABEG, 41 m, 500 m³, vierkant met een kerktoren-zadeldak, Delftse School, buiten gebruik sinds 18 april 2005.
- [Rijksmonumentenregister 514700](https://monumentenregister.cultureelerfgoed.nl/monumenten/514700): vierkante plattegrond, rode baksteen, leien zadeldak, portaal met leien lessenaardak en dubbele rondboogdeur tegen de oostgevel, verjongende steunbeer links van de ingang, rondboogdeur met halfrond balkon halverwege de noord- en zuidgevel, kleine vensters op verschillende hoogten (de meeste net onder het dak), reservoir circa 8 x 8 x 8 m.
- BAG-pand 0736100000006955 (PDOK, 2026-11-06): schacht, portaal en steunbeer.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06) en 3D BAG: maaiveld, dakvlakken, nok en goot.
- PDOK-luchtfoto: nokrichting en de dakvlakken.
- Foto's op Wikimedia Commons: "Mijdrecht Watertoren 7622.JPG" (zuidoost), "Mijdrecht, Industrieweg 6, watertoren 1937 - img5749.jpg" (noordgevel vanaf de Industrieweg), en de RCE-foto's 20530360 tot 20530369 in [Category:Watertoren (Mijdrecht)](https://commons.wikimedia.org/wiki/Category:Watertoren_(Mijdrecht)) (portaal en steunbeer vanuit het noordoosten, noordgevel, zuidgevel, overzicht vanuit het zuidoosten); hoogtes geschaald op de BAG-breedte en de goot uit het AHN.

## Geschat en weggelaten

Geschat: de hoogte van de balkons, de deuren en alle vensters, uit foto's vanaf de grond (onzekerheid circa een halve meter tot een meter in de hoogte); de plaats en de breedte van de vensters langs de gevels; de vier vensters onder de westgoot (gespiegeld naar de oostgevel, waar ze op de foto's staan); de verdeling van de BAG-uitbouw aan de oostgevel over steunbeer (1,25 m breed, aan de zuidkant) en portaal (5,45 m), uit de RCE-foto van het portaal en de foto vanuit het zuidoosten; de hoogte waarop de steunbeer in de gevel verloopt (30,5 m, foto van onderaf); de hoogte en helling van het lessenaardak van het portaal.

Weggelaten: de BAG-uitbouw van 2,15 m langs de zuidgevel (het AHN-DSM ziet daar op 0,8 m en verder van de gevel alleen maaiveld; vermoedelijk een verdiepte toegang langs de gevel, die op de foto van de zuidgevel tussen een laag muurtje ligt; de PDOK-reconstructie trekt hem ten onrechte tot de nok op), de dakramen (vlak in het dakvlak), de antenne op de nok, de stalen balustrades als losse spijlen (als dichte rand gemodelleerd), de vensterverdeling in kleinere ruitjes, de bakstenen muurtjes langs de oprit (lager dan 1 m en geen deel van het pand) en de geleding van de gevels door metselwerk.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steun v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een blok met een zadeldak dat aan de zuidkant over de verdiepte toegang doorloopt) de gootlijsten, de balkons met rondboogdeuren, de vensters, de steunbeer en het portaal met lessenaardak.

Controle-URL: http://localhost:3000/kaart/52.20638/4.87078/200/1x1/0
