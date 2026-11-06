# Watertoren 's-Gravenpolderseweg (Goes)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-goes-s-gravenpolderseweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: kern, trechter, bodem, cilinder, rand en kegeldak zijn één omwentelingsprofiel, de poten en kruisen hulls van vierkanten, de begane grond een achtkant prisma, lantaarn en spits een achthoek en een achtzijdige omwenteling, vensters en luiken blinde nissen.

De watertoren aan de 's-Gravenpolderseweg is in 1912 gebouwd door de firma Carl Francke uit Bremen. Volgens het Rijksmonumentenregister (16286) is het de eerste stalen watertoren van Nederland: een open stalen constructie met daarop een stalen reservoir. Volgens Wikipedia is hij 63 m hoog, de hoogste van Zeeland, met een reservoir van 1250 m³; sinds 1999 zitten er kantoren in en sinds 2021 ook drie appartementen. De toren staat er nog (AHN, luchtfoto, foto 2024).

BAG-pand 0664100000008428 (bouwjaar 1999, kantoor- en woonfunctie) is de toren: een cirkel van 8,0 m straal. Het model vervangt dat pand. De buurpanden in de PDOK-tegel (onder andere 0664100000019802, de woningen ten zuidwesten) liggen buiten 9,5 m van het hart en staan binnen 1 m van hun AHN-hoogte; ze blijven staan.

## Bestanden

- `watertoren-goes-s-gravenpolderseweg.glb`: één node, `building:watertoren-vakwerk-kern-reservoir-rand-dak-lantaarn-en-spits`.
- `watertoren-goes-s-gravenpolderseweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-goes-s-gravenpolderseweg-1-1000.stl`: het model op 1:1000 (17,4 × 17,4 × 61,6 mm).

## Oorsprong en oriëntatie

RD-oorsprong [52118.3, 390488.25] (51,49401 N, 3,90566 O): het hart van het reservoir in het AHN-DSM (cirkelfit op de rand boven 20 en 30 m; de top van de spits valt in hetzelfde punt), op het maaiveld (AHN-DTM NAP +1,17). Het hart van de BAG-cirkel ligt 0,7 m noordelijker.

De lokale X-as wijst naar een poot op 7 graden vanaf RD-oost (`xAxis` [0.99255, 0.12187]); de acht poten staan op 7 + k·45 graden (luchtfoto: de voeten op 52 en 97 graden zijn het duidelijkst). De ingang met de luifel ligt tussen de poten op 52 en 97 graden, naar de straat (lokaal 67,5 graden).

`groundSamplePoints` liggen op 9 m van het hart in acht richtingen, buiten de poten. `groundHeight` 45,421 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (45,42 tot 45,56, gemeten 2026-11-06); het PDOK-pand staat op 45,41. Binnen de poten ligt in het PDOK-terrein een vlak op 45,9, dat binnen de begane grond valt. `groundOffsetMetres` is −0,1.

## Onderdelen

Hoogtes boven het maaiveld (NAP +1,17).

- Vakwerk: acht poten van 0,9 m, hart op 6,15 m van het hart aan de voet en 5,25 m bovenaan, tot in de bodem. In elk vak vijf verdiepingen van 5,95 m met een kruis van banden van 0,9 m (52 tot 57 graden); het onderste vak aan de ingang is open.
- Kern van 2,8 m (trap en lift) in het midden, van de voet tot de trechter.
- Begane grond: achtkant met apothema 5,0 m tot 3,6 m binnen de poten, met een deur van 1,8 × 1,9 m en daarboven een luifel van 3,6 m breed die 1,0 m uitsteekt (voorkant 3,3 tot 4,2 m, onderkant van 50 graden naar de gevel).
- Trechter van de kern naar de ring (5,8 m) op 30,6 m onder 46,5 graden, daarboven de bolle bodem tot de cilinder.
- Cilinder van 15,24 m van 35,8 tot 42,2 m, met acht groepen van twee vensterkolommen (0,95 m breed, 36,3 tot 40,7 m) en boven elke kolom een rond venster (0,9 m) op 41,55 m.
- Uitlopende rand naar 17,44 m op 43,71 m, rechte rand tot 44,25 m (AHN 44,2 à 44,3), vlakke bovenkant tot 7,9 m.
- Kegeldak tot 49,35 m bij 3,2 m (AHN, 43 graden), met twee dakkapelletjes van 1,4 m breed (nok 46,5 m) aan de west- en de zuidoostkant.
- Achtkante lantaarn (omgeschreven straal 2,7 m) tot 52,0 m met een lijst tot 52,4 m en een luik van 1,0 × 1,4 m op elke zijde.
- Holle achtzijdige spits van 4,0 m breed op de lantaarn tot 61,3 m.

## Bronnen en maten

- [Wikipedia, Watertoren (Goes 's Gravenpolderseweg)](https://nl.wikipedia.org/wiki/Watertoren_(Goes_%27s_Gravenpolderseweg)): 1912, Carl Francke, 63,00 m, 1250 m³, kantoor sinds 1999, appartementen sinds 2021.
- [Rijksmonumentenregister 16286](https://monumentenregister.cultureelerfgoed.nl/monumenten/16286): eerste stalen watertoren, open stalen constructie met stalen reservoir.
- BAG-pand 0664100000008428 (PDOK, 2026-11-06): cirkel van 8,0 m straal.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +1,15 à 1,2; rand 8,75 m op 44,2 à 44,3 m, vlak tot 8,0 m; kegeldak 45,6 m bij 7,25 m tot 49,3 m bij 3,2 m; lantaarn tot 52,3 à 52,6 m bij 2,5 à 3 m; spits in één cel tot NAP +62,32 (61,2 m).
- Luchtfoto (PDOK, Actueel_orthoHR): ronde dakvorm met circa twintig dakramen, twee dakkapelletjes, de koperen spits, de voeten van het vakwerk aan de noordkant (de toren helt op de luchtfoto naar het zuiden).
- Foto's op Wikimedia Commons (categorie "Watertoren, Goes"): "Watertoren - Goes - 20079328 - RCE.jpg" (rechte verticalen, voor de maten), "Goes, de Watertoren RM16286 IMG 3581 2024-07-14 11.31.jpg" (2024, begane grond, luifel, kern en vensters), "Goes, de watertoren RM18286 foto5 2012-05-17 17.28.JPG", "Watertoren van Goes.jpg", "Ready for lift-off (52823742489).jpg" (onderkant van het reservoir) en "Watertoren, detail - Goes - 20079330 - RCE.jpg".

## Geschat en weggelaten

Geschat: alle maten onder het dak. De breedtes komen uit de RCE-foto met rechte verticalen (19,9 px/m in het vlak door de as, geschaald op de randbreedte en gecontroleerd met de top: 61,3 m tegen 61,2 m in het AHN). De hoogtes van ring (30,6 m), cilinder (35,8 tot 42,2 m) en rand komen uit de voorste punten van hun cirkels op die foto, omgerekend met een camera-afstand van circa 87 m die volgt uit de voor- en zijkant van de bovenrand; de omtrek aan de zijkant gaf 1 à 2 m lager, maar ligt bij een onderkant die je van onderaf ziet te laag. De stand van de poten (7 + k·45 graden) komt uit twee voeten op de luchtfoto. Aantal en plaats van de vensterkolommen, ronde vensters en dakkapellen, de kern, de begane grond (3,6 m) en de luifel komen uit foto's van 2008 tot 2024 en de luchtfoto en zijn bij benadering. De echte bodem is vlak op een ringbalk met radiale liggers; hier een trechter van 46,5 graden van de kern naar de ring, zodat het zonder steun te printen is. Bodem en rand lopen in werkelijkheid flauwer uit; ze zijn begrensd op 46,5 à 47 graden. Het vakwerk heeft in werkelijkheid circa zeven verdiepingen kruisen met horizontale ringen; hier vijf verdiepingen kruisen zonder ringen, zodat elke band steiler dan 50 graden loopt. Poten, kruisen en kern zijn verdikt tot de printgrens van 0,9 m.

Weggelaten: de horizontale ringen van het vakwerk (vrije horizontale overspanningen), de wenteltrap rond de kern, de leuning rond de cilinder (een buis op beugels), de dunne stempels onder de luifel, de kleine vierkante vensters in de bodem en de dakramen (kleiner dan 0,9 m of vlak in het dak), de bol op de spits (0,65 m), de antennes aan de poten en het naamwerk.

## Controle

Eén gesloten NoError-node, één component (genus 119 door het vakwerk). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een dichte cilinder van 16 m tot 44 m met een spitse kegel) het open vakwerk met kruisen en kern, de begane grond met luifel, de bolle bodem, de vensters en ronde vensters, de uitlopende rand, het kegeldak met dakkapellen, de lantaarn met luiken en de holle spits.

Controle-URL: http://localhost:3000/kaart/51.49401/3.90566/200/1x1/0
