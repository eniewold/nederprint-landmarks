# Watertoren Antoon Coolenlaan (Eindhoven)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-eindhoven-antoon-coolenlaan.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de bollen zijn echte bollen, de buizen en pijpen cilinders, de poten en stijlen prisma's en de kruisschoren en consoles `hull`-staven langs hun hartlijn.

De watertoren aan de Antoon Coolenlaan staat op het terrein van Brabant Water in Stratum, op de hoek met de Willem Elsschotlaan. Hij is in 1970 gebouwd naar ontwerp van W.G. (Wim) Quist en heet in de stad "de ballen van Quist". Drie stalen bollen van 10 m houden elk 500 m³; samen is dat de grootste watertoren van Nederland. Het rijksmonumentenregister (532557, ingeschreven in 2026; gemeentelijk monument sinds 1974) beschrijft drie witgeschilderde bolvormige reservoirs op een staalconstructie van slanke torens van verschillende hoogtes, met een schuilkelder eronder. De opdracht noemde "kuipen"; het zijn bollen.

## Bestanden

- `watertoren-eindhoven-antoon-coolenlaan.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse bol zou een eigen voet tot de grondplaat krijgen.
- `watertoren-eindhoven-antoon-coolenlaan.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en `groundSamplePoints`. Geen `replacesBuildings`: de toren is geen BAG-pand en staat dus niet in de PDOK-gebouwtegels.
- `watertoren-eindhoven-antoon-coolenlaan-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [161424.54, 380818.97], het zwaartepunt van de drie buisvoeten uit de BGT (overigbouwwerk, type opslagtank: drie cirkels van 1,25 m), op maaiveld (AHN-DTM NAP +18,22 m, rond de voeten 18,19 tot 18,26). Het hart van de driehoek van de drie trappentorenstijlen in de BGT (cirkels van 0,24 m) ligt daar binnen 3 cm naast. `xAxis` [1, 0]: +X wijst naar RD-oost. De vier `groundSamplePoints` liggen op het grasveld tussen en naast de voeten. `groundHeight` 62,21 (NAP 18,22 + 43,99, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:bollen-buizen-en-trappentoren`

- Drie bollen van 10 m in een gelijkzijdige driehoek met zijden van 14,0 tot 14,2 m (BGT): noord met de bovenkant op 41,65 m, zuidwest op 36,4 m en oost op 31,08 m.
- Onder elke bol een buis van 1,25 m (BGT) met vier poten van 0,9 m op een vierkant van 2,6 m buitenmaat, één vlak naar het hart van het complex. De poten lopen door tot in de bol.
- Boven elke bol loopt de buis door als pijp van 1,0 m tot 43,45 m: 1,8 m boven de noordbol, 7,05 m boven de zuidwestbol, 12,37 m boven de oostbol.
- In het midden een driehoekige trappentoren op de drie BGT-stijlen (zijde 5,57 m), met achtkantige stijlen van 0,9 m tot 37,0 m en per gevel kruisschoren van 0,9 m in vakken van 6 m (47 graden).
- Per bol een loopbrug als console van 0,9 m breed, met het dek 1 m onder het midden van de bol (35,65, 30,4 en 25,08 m). De console begint op een kruispunt van de schoren in de gevel die naar die bol wijst en loopt onder 46 graden naar de bol.

## Bronnen en maten

- [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Watertoren_(Eindhoven_Antoon_Coolenlaan)): 1970, W.G. Quist, 43,45 m, 3 × 500 m³, gemeentelijk monument sinds 1974.
- [Wikipedia (en)](https://en.wikipedia.org/wiki/Eindhoven_Water_Towers): bollen van 10 m (een bol van 10 m houdt 524 m³).
- [Rijksmonumentenregister 532557](https://monumentenregister.cultureelerfgoed.nl/monumenten/532557): omschrijving.
- BGT (PDOK OGC API, opgehaald 2026-11-02): zeven overigbouwwerken van type opslagtank, de drie buisvoeten en de drie stijlen van de trappentoren; de middelpunten staan als constanten in de generator.
- BAG (PDOK WFS): geen pand onder de toren; het dichtstbijzijnde pand (0772100000258362, aan de oostkant) ligt bijna 30 m van de oostbol.
- AHN DSM/DTM 0,5 m (PDOK): maaiveld NAP +18,22; de oostbol is glad gemeten met de bovenkant op NAP +49,3 (31,08 m); de top van de noordpijp op NAP +61,28 (43,1 m, gepubliceerd 43,45). De noord- en zuidwestbol geven in het DSM rommelige hoogtes tussen 15 en 40 m. Hun hoogte komt daarom niet uit het AHN.
- Luchtfoto (PDOK, 8 cm): de driehoek van de bollen, de trappentoren met loopbruggen, de schaduwen van de oost- en zuidwestbol en de scheefstand van de bollen.
- Foto's op Commons: [Waterbollen Eindhoven-02](https://commons.wikimedia.org/wiki/File:Waterbollen_Eindhoven-02.jpg) (alle drie de bollen, trappentoren en loopbruggen, hoogteverschil noord-zuidwest), [Watertoren Eindhoven](https://commons.wikimedia.org/wiki/File:Watertoren_Eindhoven.jpeg) (buis 1,2 m, pijp 1,0 m, poten op 2,2 m, kruisschoren, loopbrug naar de noordbol), [Watertoren Eindhoven 1](https://commons.wikimedia.org/wiki/File:Watertoren_Eindhoven_1.jpeg) (pijplengtes, loopbrug) en [20051110 Eindhoven Watertoren 0204](https://commons.wikimedia.org/wiki/File:20051110_Eindhoven_Watertoren_0204.jpg).

## Geschat en weggelaten

Geschat: de hoogte van de noord- en zuidwestbol (±1 m). Die volgt uit de pijplengtes op drie foto's (noord 1,7 tot 1,9 m, zuidwest 6,6 tot 7,0 m, oost circa 11 m), met alle pijpen tot de gepubliceerde 43,45 m. Het hoogteverschil op de foto vanaf het westen, de schaduwen en de scheefstand op de luchtfoto passen daarbij. Samen geven ze een gelijke stap van 5,3 m vanaf de oostbol. De schaduwen alleen gaven voor de zuidwestbol 2,5 m lager. Verder geschat: dat de drie pijpen even hoog zijn, de hoogte van de trappentoren en de loopbruggen (foto's, ±0,5 m), en de stand van het pootvierkant. De poten zijn verdikt van circa 0,2 tot 0,9 m en staan daardoor tegen de buis, en het pootvierkant is 2,6 in plaats van 2,2 m. De stijlen van de trappentoren zijn verdikt van 0,24 tot 0,9 m en de schoren van circa 0,15 tot 0,9 m, met minder vakken dan in het echt (6 m, zodat ze onder 47 graden lopen). De loopbruggen zijn consoles met een schuine onderkant in plaats van vlakke roosters.

Weggelaten, omdat ze kleiner zijn dan 0,9 m: de trap in de toren, het bordes en de leuningen bovenop, de lantaarnmast op de toren, de leuningen van de loopbruggen, de ladders en de ring van ankerpunten op de bollen, de naad onder de bollen en de kap op de pijpen. De horizontale trekstangen tussen de buizen en de trappentoren (circa 0,2 m) zijn ook weggelaten: als vlakke overspanning zou de export er een wand tot de grondplaat onder zetten. Verder weggelaten: de schuilkelder, die ondergronds ligt. Ook de verzonken kelderingang ten zuiden van de toren is weggelaten, want die zit in het PDOK-terrein.

## Controle

Eén gesloten NoError-node (genus 52, door de kruisschoren). In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, 1,85 % op: een kegel van 45 graden onder de onderkap van elke bol naar de buis en de poten (de echte overhang), en een strookje onder de consoles. De kruisschoren, stijlen, buizen, pijpen, de bovenste helft van de bollen en de consoles blijven gelijk. PDOK heeft hier geen pand, dus op de kaart zonder landmarkmodellen staat er niets. Vergeleken daarmee voegt het model de hele toren toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.41651/5.47949/200/1x1/0
