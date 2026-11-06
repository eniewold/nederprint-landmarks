# Watertoren Zeist (Bergweg)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zeist-bergweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, onderbouw, schacht, lijsten, reservoirband en -mantel zijn één omwentelingsprofiel (96 segmenten); de overkraging, de kroonlijst en het tentdak zijn zestienhoekige hulls; de ventilatiekap is een blok met een piramidedakje; deur, vensters, oculi en de velden tussen de lisenen zijn blinde nissen.

De watertoren aan de Bergweg 24 werd in 1896 gebouwd voor de Utrechtse Waterleiding Maatschappij, met neorenaissance-invloeden, en kostte 28.786 gulden. Hij is volgens Wikipedia en het register 37,5 m hoog en heeft een geklonken Intze-reservoir (type I) van 300 m³ (rijksmonument 510273). Het is een zuster van de torens aan de Lauwerhof in Utrecht (1896) en in Baarn (1903). De toren staat er nog (BAG-pand 0355100000723944, bouwjaar 1896, status "Verbouwing pand"; AHN, luchtfoto). Een ronde toren in baksteen: een onderbouw op een hardstenen plint met de dubbele deur naar de Bergweg en een kroonlijst, een verjongende schacht met smalle vensters en oculi, een gemetselde overkraging met velden tussen ijzeren ribben, en een reservoirbekroning met lisenen, een overstekende kroonlijst en een vlak puntdak met een ingekorte, lantaarnvormige ontluchting.

## Bestanden

- `watertoren-zeist-bergweg.glb`: één node, `building:watertoren-onderbouw-schacht-overkraging-reservoir-kroonlijst-en-dak`.
- `watertoren-zeist-bergweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-zeist-bergweg-1-1000.stl`: het model op 1:1000 (12,2 × 12,2 × 34,4 mm).

## Oorsprong en oriëntatie

RD-oorsprong [145031.75, 455843.89] (52,09077 N, 5,24175 O): het hart van de cirkel van BAG-pand 0355100000723944 (straal 4,84 m; de BAG-contour is de voet van de onderbouw), op het maaiveld: AHN-DTM NAP +5,35 (5,32 tot 5,37 tussen 4,5 en 10 m). Het hoogste DSM-punt (NAP +39,47) ligt 0,15 m van het hart.

De lokale X-as is RD-oost (`xAxis` [1, 0]), Y is noord. Hoeken hieronder in graden linksom vanaf oost: de deur op 186 graden (west, haaks op de Bergweg).

`groundSamplePoints` liggen op 6 m in de vier asrichtingen, buiten de plint; `groundHeight` 48,47 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 48,86, noord 48,85, west 48,71, zuid 48,47, gemeten 2026-11-06). Het PDOK-pand staat op 48,34. `groundOffsetMetres` is −0,1. Het PDOK-terrein loopt rond de toren 0,4 m op naar het noorden en oosten; het AHN-maaiveld is vlak, dus de voet zakt daar iets in het PDOK-terrein.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +5,35).

- Plint: straal 5,0 m tot 0,45 m, schuin afgedekt naar de voet (straal 4,84 m, BAG) op 0,6 m.
- Onderbouw: verjongt tot straal 4,7 m op 5,0 m; kroonlijst met een kraag tot straal 4,95 m (5,0 tot 5,6 m). Deur aan de westkant (186 graden): 1,4 m breed, 0,3 tot 2,35 m met een spitse boog tot 3,35 m.
- Schacht: verjongt van straal 4,53 m op 5,6 m tot 3,75 m op 19,8 m. Acht smalle vensters onderin (7,2 tot 8,6 m) en acht bovenin (17,4 tot 18,8 m) op 156 + k × 45 graden, vier oculi op 13,2 m op 156 + k × 90 graden.
- Dubbele lijst: kraag tot straal 4,05 m (19,8 tot 20,1 m), tot 20,9 m.
- Overkraging: zestienzijdig, van omgeschreven straal 4,13 m op 20,9 m tot 5,27 m op 23,4 m (hoeklijnen 25 graden uit het lood); de hoeken liggen op de lisenen van het reservoir (k × 22,5 graden).
- Reservoir: band met straal 5,27 m (23,4 tot 23,9 m), mantel met straal 5,15 m tot 28,75 m. Zestien velden van 1,15 m breed die 0,2 m terugliggen (24,05 tot 27,45 m) tussen lisenen van circa 0,9 m, met elk een rechthoekig venster (25,35 tot 26,55 m) en een vierkant venster (24,2 tot 24,85 m). Lijst met straal 5,3 m (27,6 tot 28,0 m), daarboven de vensterband tot 28,75 m.
- Kroonlijst: zestienhoek met omgeschreven straal 6,1 m; kraag van de ronde mantel naar de zestienhoek van 28,75 tot 29,75 m (hoeken 45 graden), goot tot 29,95 m (AHN-dakrand NAP +35,25).
- Dak: zestienzijdig tentdak met helling 0,52 op de hoeklijnen (AHN 0,54 gemiddeld) van 29,95 tot 32,65 m bij straal 0,9 m.
- Ventilatiekap: 1,2 × 1,2 m tot 33,5 m met een piramidedakje van 45 graden tot 34,1 m (AHN NAP +39,47).

Nissen zijn 0,3 m diep (de velden 0,2 m) met een plafond dat naar binnen onder 56 graden oploopt; de deur heeft een spits plafond van 55 graden; de oculi zijn ruiten met zijden van 53 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Zeist)): 1896, Utrechtse Waterleiding Maatschappij, neorenaissance-invloeden, 37,5 m, 300 m³, puntdak.
- [Rijksmonumentenregister 510273](https://monumentenregister.cultureelerfgoed.nl/monumenten/510273): Bergweg 24; ronde toren van 37,5 m met verjongende schacht en uitgekraagde reservoirbekroning; hardstenen plint en lekdorpel, vijf sierbanden en een lijst aan de onderbouw; dubbele houten deur naar de Bergweg met dichtgezet bovenlicht en gedenksteen; schacht met smalle en enkele rondboogvensters; sierwerk tussen profielijzers onder het reservoir; mantel met lisenen, per vak een vierkant en een langwerpig venster, bovenin vensters afgewisseld met sierankers; puntdak met na 1900 gewijzigde overstek en ingekorte lantaarnvormige ontluchting; gietijzeren hek en hekpijlers.
- BAG-pand 0355100000723944 (PDOK, 2026-11-06): cirkel met straal 4,84 m, bouwjaar 1896. Het id uit de taak klopt.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +5,35; dakrand NAP +35,25 op 5,5 tot 6 m; dak NAP +36,6 op 3,25 m en +37,6 op 1,5 m (helling 0,54); kap NAP +39,08 op 0,5 m, top +39,47.
- PDOK-luchtfoto (Actueel_orthoHR): zestienzijdig tentdak van circa 12,2 m doorsnede met een lichte, vierkante kap in het midden.
- Foto's op Wikimedia Commons (categorie "Watertoren (Zeist)"): "Overzicht Watertoren - Zeist - 20372027 - RCE.jpg" (vanaf de Bergweg, verticale lijnen evenwijdig) en "Zeist Watertoren 9161.JPG" (2006, vanaf de Bergweg onder een andere hoek).

## Geschat en weggelaten

Geschat: alles onder de kroonlijst. De hoogtes van onderbouw, schacht, lijsten, overkraging en reservoir komen uit de RCE-foto, geschaald per diepte (camera op circa 45 m van de as, met de voetstraal uit de BAG en de dakrand uit het AHN als ijkpunten; onzekerheid circa 0,5 m); de stralen van schacht, overkraging en mantel uit de breedtes op die foto (schaal uit de BAG-voet). De verdeling van de vensters in de schacht (acht en acht) en de oculi (vier) is geschat uit de twee foto's, die elk drie vensters per rij en één of twee oculi tonen; de richting van de deur uit de rooilijn van de Bergweg op de luchtfoto. De straal van de kroonlijst (6,1 m) komt uit luchtfoto en DSM; het aantal zijden (16) is geteld op de foto's en valt samen met de zestien lisenen. De gepubliceerde hoogte van 37,5 m is niet terug te vinden: het AHN geeft 34,1 m tot de top van de kap; mogelijk telt de oorspronkelijke, langere ontluchting mee. De overkraging loopt in werkelijkheid hol; hier is ze per veld vlak, zoals de velden tussen de ribben op de foto. Ronde bogen staan als spitse bogen in het model, oculi als ruiten. De vensters zijn 0,3 à 0,4 m breed; hier 0,9 m breed zodat ze op 1:1000 te zien zijn, en het vierkante venster per veld 0,9 × 0,65 m.

Weggelaten: de ijzeren ribben van de overkraging, de sierbanden in onderbouw en schacht (alleen kleur), de gedenksteen boven de deur, de kleine vensters en sierankers in de bovenste band van het reservoir (0,25 m), de goot en de onderkant van de overstek, het gietijzeren hek met hekpijlers en de lantaarnpaal (allemaal dunner dan 0,9 m of alleen kleur).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder met de straal van de BAG-voet van maaiveld tot dak, met een kegeldakje) de smallere onderbouw met plint, kroonlijst en deur, de verjongende schacht met vensters en oculi, de dubbele lijst, de zestienzijdige overkraging, het reservoir met band, velden, vensters en lijst, de overstekende zestienzijdige kroonlijst en het tentdak met de kap.

Controle-URL: http://localhost:3000/kaart/52.09077/5.24175/200/1x1/0
