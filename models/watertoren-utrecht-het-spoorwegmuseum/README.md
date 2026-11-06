# Watertoren Het Spoorwegmuseum (Utrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-utrecht-het-spoorwegmuseum.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw is een prisma op de BAG-contour met blinde nissen, de poten en kruisverbanden zijn hulls van vierkanten, de leiding, de kraag, de omloop en het reservoir één omwentelingsprofiel, en het dak, het lantaarntje en de spits hulls van twaalf- en achthoeken.

Op het terrein van Het Spoorwegmuseum (het voormalige station Maliebaan) staat een kleine stalen spoorwegwatertoren: een cilindrisch reservoir met een omloop onder een breed twaalfzijdig dak met een laag achtkant lantaarntje en een spits, op een vakwerk van vier poten met kruisverbanden en een leiding in het midden. Volgens Wikipedia is hij bij de vernieuwing van het museum (rond 2005) nabij het seinhuis uit Hoogezand-Sappemeer geplaatst. Hij staat op de zuidpunt van een lage bakstenen onderbouw met blinde segmentboognissen, die vroeger een begroeid dak had. Bouwjaar, herkomst en hoogte van de toren zijn niet gepubliceerd; de Wikipedia-lijst van watertorens noemt alleen de naam. De toren staat er nog (AHN, luchtfoto 2025, foto's 2010 tot 2015).

De toren is geen eigen BAG-pand. Onderbouw en toren vormen samen BAG-pand 0344100000126836 (bouwjaar 1915, 207 m²; Wikidata Q135953949 verwijst naar hetzelfde pand). Het model vervangt dat hele pand.

## Bestanden

- `watertoren-utrecht-het-spoorwegmuseum.glb`: één node, `building:onderbouw-met-nissen-vakwerk-omloop-reservoir-dak-en-spits`.
- `watertoren-utrecht-het-spoorwegmuseum.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-utrecht-het-spoorwegmuseum-1-1000.stl`: het model op 1:1000 (27,3 × 7,8 × 12,6 mm).

## Oorsprong en oriëntatie

RD-oorsprong [137530.1, 455617.2] (52,08854 N, 5,13231 O): het hart van het reservoirdak in het AHN-DSM, op het maaiveld (AHN-DTM NAP +2,85). Op de luchtfoto staat het dak door de scheefstand 0,8 m noordelijker.

De lokale X-as loopt langs de lange zijden van de onderbouw naar het noordnoordoosten (72,3 graden vanaf RD-oost, `xAxis` [0.304033, 0.952661]); Y staat 90 graden linksom (westnoordwest). De toren staat op het zuideinde (X ≈ 0), de onderbouw loopt tot X = 22,2.

`groundSamplePoints` liggen rond de onderbouw: zuid (−6,5, 0), oost (8, −5,8), west (8, 5,5) en noord (24, 0). `groundHeight` 46,21 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (46,35, 46,23, 46,22 en 46,21, gemeten 2026-11-06). Het PDOK-pand staat op 46,11. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +2,85).

- Onderbouw: prisma op de BAG-contour (27,3 × 7,8 m, met een knik aan de oostkant van het zuiddeel en een schuine noordwesthoek) tot 2,35 m (AHN NAP +5,2). Blinde nissen van 2,75 m breed (aan de noordgevel 2,6 m) en 0,3 m diep van 0,2 tot 1,6 m, met een plafond dat onder 56 graden naar binnen oploopt tot 2,05 m: twee in de zuidgevel, één in de oostgevel van het zuiddeel, zes in de lange oostgevel, twee in de noordgevel, twee in de schuine noordwestgevel en vijf in de lange westgevel. Op het dak een opbouw van 3,0 × 1,8 m tot 4,0 m (AHN NAP +6,85).
- Vakwerk: vier poten van 0,9 m, hart op hart 3,3 m op de onderbouw en 1,7 m op 7,41 m, met één kruis per zijde (banden van 0,9 m onder 58 graden) van de voet van de ene poot naar de bovenkant van de volgende. In het midden de leiding van 0,9 m.
- Omloop: vloer van 4,95 m doorsnede van 7,85 tot 8,29 m, op een kraag van 46 graden vanaf de leiding.
- Reservoir: 3,46 m doorsnede vanaf 8,29 m.
- Dak: twaalfzijdig, 5,25 m breed (luchtfoto en DSM); onderkant van 47 graden van de reservoirwand (8,6 m) naar de dakrand op 9,62 m, dakrand tot 10,1 m, flauw dak tot 10,5 m bij het lantaarntje.
- Lantaarntje: achtkant van 1,4 m tot 10,9 m (AHN NAP +13,8). Spits: achtzijdig, 0,9 m aan de voet, tot 12,3 m.

## Bronnen en maten

- [Wikipedia, Spoorwegmuseum (Utrecht)](https://nl.wikipedia.org/wiki/Spoorwegmuseum_(Utrecht)): bij de vernieuwing is nabij het seinhuis uit Hoogezand-Sappemeer een watertoren geplaatst.
- [Lijst van watertorens in Nederland](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Nederland): "Utrecht, Het Spoorwegmuseum", zonder bouwjaar, hoogte of inhoud.
- [Wikidata Q135953949](https://www.wikidata.org/wiki/Q135953949): Watertoren Spoorwegmuseum, BAG-pand 0344100000126836, 52,08853 N, 5,13230 O.
- BAG-pand 0344100000126836 (PDOK, 2026-11-06): contour van de onderbouw, bouwjaar 1915.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +2,85; dak van de onderbouw NAP +5,2; opbouw NAP +6,7 tot +6,9; reservoirdak NAP +13,4 tot +13,7 binnen een cirkel van circa 5 m; lantaarntje NAP +13,8; de spits in één cel tot NAP +14,5.
- PDOK-luchtfoto (Actueel_orthoHR, 8 cm): twaalfzijdig dak van 5,25 m, onderbouw met een plat dak.
- Foto's op Wikimedia Commons (categorie "Water tower (Spoorwegmuseum Utrecht)"): "Spoorwegmuseum water tower.JPG" (2015, close-up van reservoir, omloop en dak), "Utrecht - 2015 - panoramio (3).jpg" (2015, toren en westgevel van de onderbouw met nissen), "Spoorwegmuseum - Watertoren.jpg" (2010, vakwerk met de rood-wit geschilderde leiding) en "Spoorwegmuseum - Parte I - 15669901336.jpg" (2011, zuidpunt van de onderbouw).

## Geschat en weggelaten

Geschat: alle maten van de toren onder het dak. De verhoudingen komen uit de foto van 2015 (bijna recht van opzij), geschaald op de dakdiameter (80 px/m) en gecontroleerd tegen het AHN (dak en lantaarntje vallen binnen 0,2 m). De breedte van het vakwerk (4,2 m onderaan, 2,6 m bovenaan) komt uit de foto's van 2010 en 2015. Drie ronde vlekken op het dak van de onderbouw rond de toren (hart op hart 4,8 m) zijn geen poten, want het vakwerk is op de foto's smaller. De nissen (aantal, breedte en hoogte) komen uit de foto's van de west- en zuidgevel; die van de oost- en noordgevel zijn verondersteld gelijk. De opbouw op het dak komt uit het AHN en de luchtfoto; wat het is, is niet bekend. Het vakwerk heeft in werkelijkheid twee verdiepingen kruisen naar knoopplaten midden op elke zijde; één kruis per zijde houdt de banden steiler dan 45 graden. De omloop rust in werkelijkheid op consoles onder een vlakke vloer en de dakrand steekt flauwer uit (circa 25 graden); hier zijn het een kraag van 46 en een onderkant van 47 graden, zodat ze zonder steun te printen zijn. Daardoor is het reservoir tussen omloop en dak maar 0,3 m zichtbaar in plaats van circa 1 m. Poten, kruisen en leiding zijn 0,9 m dik, de printgrens; in werkelijkheid zijn ze 0,2 à 0,3 m.

Weggelaten: de leuning van de omloop, de kooiladder langs het vakwerk, de bol op de spits, de horizontale regels van het vakwerk (vrije horizontale overspanningen), de leuning en het vroegere groen op het dak van de onderbouw, de afdeklijst van de onderbouw (dunner dan 0,9 m) en het hek met gemetselde penanten tegen de zuidgevel (geen deel van het pand).

## Controle

Eén gesloten NoError-node, één component (genus 12 door het vakwerk). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; de doorsneden van het model in de export zijn gelijk aan die van de GLB. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de onderbouw als blok met een vierkant blok van circa 4 m tot 10,8 m op de zuidpunt) de nissen rondom, de opbouw op het dak, het open vakwerk met kruisen en leiding, de omloop, het reservoir, het brede twaalfzijdige dak, het lantaarntje en de spits.

Controle-URL: http://localhost:3000/kaart/52.08854/5.13231/200/1x1/0
