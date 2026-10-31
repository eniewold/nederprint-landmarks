# De Entree II (Amsterdam)

Vereenvoudigd, printbaar model van de kantoortoren De Entree II (De Entree 230–266, 2002) bij station Bijlmer ArenA, in de hoogbouwlijst als "Entree II" (74 m, 18 lagen). Een glazen schijf van 27,5 × 32,2 m met afgeronde hoeken aan de zuidoostkop staat op kolommen boven een open onderbouw van twee lagen; aan de noordwestkop staat een witte kern die boven het dak uitsteekt. Op het dak staan een teruggezette installatiekast en twee groepen koelers, aan de noordoostgevel een laag entreepaviljoen met een ronde kop.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `entree-ii.glb` | Model in meters, Y omhoog, twee nodes: `building:entree-ii-toren` en `building:entree-ii-kern` |
| `entree-ii.json` | Catalogusitem |
| `entree-ii-1-1000.stl` | Los te printen op 1:1000 (31 × 39 × 78 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[124574.0, 480312.0]`, bij het hart van de schijf; de X-as loopt langs de zuidoostkop naar het oostnoordoosten (28,97° op RD-oost, BAG-randen evenwijdig binnen 0,1°), de Y-as langs de lange gevels naar het noordnoordwesten.

Lokaal z = 0 is NAP −3,3 m: het plein rondom, dat het AHN-DTM aan alle kanten op −3,1 tot −3,5 meet. De 3D BAG geeft −6,81 als maaiveld, maar dat is de bodem van de verdiepte ronde patio (BGT erf, AHN −6,6 tot −6,8) rond de kern, die binnen de BAG-contour valt. Die patio blijft maaiveld in het PDOK-terrein en zit niet in het model. Daarom lopen de schijf en de kern door tot 0,8 m onder de patiobodem (onderkant z = −4,3); onder het plein zit dat deel in het terrein. `groundSamplePoints` liggen op het plein aan de zuidwest-, zuidoost- en noordoostkant, buiten de patio, zodat het model niet naar de patiobodem zakt. `groundHeight` is 39,7 m (ellipsoïdisch, NAP −3,3 + 43,0 zoals bij Oval Tower en Arena Towers) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schijf (pand `0363100012138124`) | 27,46 × 32,15 m, hoeken zuidoostkop straal 2,7 m | dak +65,26 m | BAG-dakcontour, 3D BAG (65,25–65,27), AHN-DSM |
| Installatiekast | 12,7 × 20 m, met verbinding naar de kern | +69,29 m | 3D BAG-dakvlak (69,26–69,31), DSM |
| Koelers | 2,6 × 5,0 m en 2,3 × 5,1 m | +67,65 m | 3D BAG-dakvlakken (67,63–67,69) |
| Kern | 9,1 × 6,9 m, aan de noordwestkop in de patio | +70,4 m | BGT-pand, 3D BAG (70,38–70,44) |
| Onderbouw | onderkant schijf 8,1 m boven het plein | +4,8 m | foto (schaal op de dakhoogte), geschat |
| Kolommen zuidoostkop | twee, doorsnede 1,05 m | tot de schijf | BGT-panden |
| Entreepaviljoen | 5,8 × 7,3 m met ronde kop (straal 1,8 m) | +2,2 m | BAG/BGT, 3D BAG (2,08–2,33) |
| Patio | NAP −6,8 m | maaiveld, niet in het model | AHN-DTM, BGT erf |

Onderbouw: de schijf rust in werkelijkheid op twee rijen kolommen en een smalle kern van lobby's (BGT-pand op maaiveld). In het model ligt rondom een terugligging tot een achterwand van 3,6 m, met een plafond dat onder 45° of steiler naar de gevelrand loopt: 3,5 m diep aan de zuidwest- en noordoostgevel, 4,3 m aan de zuidoostkop, waar de twee voorste kolommen vrij staan.

Gevel: 16 kantoorlagen boven de onderbouw (15 van 3,75 m, de bovenste tot de dakrand). Per laag een glasband van 0,35 m diep achter een doorlopende borstwering, met een plafond onder 45°, rondom de afgeronde hoeken. De lichte vloerrand die per twee lagen terugkomt (onder laag 1, 2, 4, …, 16) is een borstwering van 1,3 m, de andere zijn 0,9 m. Het paviljoen heeft één glasband rondom zijn vrijstaande kop.

## Geschat en weggelaten

- Naam: De Entree II (Commons, verhuurders); de hoogbouwlijst noemt hem "Entree II". Architect volgens een bron Kohn Pedersen Fox, niet nagekeken.
- Hoogte van de onderbouw (+8,1 m boven het plein), verdiepingshoogte en de indeling van de glasbanden zijn geschat uit één frontale foto van de zuidwestgevel.
- De diepte van de terugligging onder de schijf en het schuine plafond zijn een printbare benadering van de open onderbouw: de kolommen langs de lange gevels staan 8 m achter de gevel, buiten bereik van een plafond onder 45°, en zitten daarom in het model in de achterwand.
- De gevel van de noordwestkop (naar de patio) heeft dezelfde glasbanden; daar is geen foto van.
- Weggelaten: verticale stijlen van de vliesgevel, de kapitelen van de kolommen, het lamellenrooster van de installatiekast, het paneelraster en de leuning op de kern, de antennes, het dakopbouwtje van de lift op de kern (0,8 m) en de kleine entreeluifel onder de schijf (allemaal kleiner dan 0,9 m of verborgen onder de schijf).

## Controle

`node scripts/generate-entree-ii.mjs` geeft per node `NoError` en één gesloten deel (de toren genus 2 door de twee vrijstaande kolommen). In de webshop controleert een test de daken, de installatiekast, de koelers, de kern en het paviljoen op hun NAP-hoogte, dat een glasband, de terugligging van de onderbouw en een kolom na de printcorrectie op 45° blijven, dat het volume daarbij minder dan 1 % groeit, en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto gelegd.

## Bronnen

- PDOK BAG, pand `0363100012138124` (bouwjaar 2002, De Entree 230–260); BGT pand, erf en scheiding (kolommen, patio); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG, `NL.IMBAG.Pand.0363100012138124` (LoD2.2, AHN5 2023).
- [Lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam).
- Foto op Wikimedia Commons (niet meegeleverd): [Kantoorgebouw De Entree II](https://commons.wikimedia.org/wiki/File:Kantoorgebouw_De_Entree_II.jpg).
