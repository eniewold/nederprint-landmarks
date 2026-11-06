# Oude watertoren (Nijverdal)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-nijverdal-oude-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het gebouwtje is een prisma, de poten, koppelbalken en kern zijn convexe omhullenden van achthoeken en radiale prisma's, het reservoir is één omwentelingsprofiel, en de deur en vensters zijn blinde nissen.

De oude watertoren aan de P.C. Stamstraat 2d is in 1912 gebouwd voor het proceswater van de Nederlandsche Stoomblekerij, later Koninklijke Ten Cate. Hij is rijksmonument 512248 en is in 2010-2011 gerestaureerd. Volgens het register is het een betonskelet met een cilindrisch reservoir van het type Intze:

- een vierkant betonnen gebouwtje van één bouwlaag omsluit de voet, met een plat dak, een overstekende goot, een dubbele deur en drie vensters met een boogje;
- daarboven staan acht betonnen poten rond een standpijp, halverwege verbonden met koppelbalken;
- het uitkragende reservoir heeft een kegelvormige bodem en een cilindrische mantel met acht lisenen op een waterlijst en smalle gietijzeren rondboogvensters;
- aan één kant loopt een ijzeren wenteltrap omhoog.

Niet te verwarren met de nieuwe watertoren van Nijverdal (`watertoren-nijverdal-nieuwe-watertoren`), een bakstenen toren op het fabrieksterrein.

## Bestanden

- `watertoren-nijverdal-oude-watertoren.glb`: één node `building:watertoren-voetgebouw-poten-koppelbalken-en-reservoir`, op maaiveld.
- `watertoren-nijverdal-oude-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-nijverdal-oude-watertoren-1-1000.stl`: het model op 1:1000 (5,7 × 5,7 × 16,7 mm).

## Oorsprong en oriëntatie

De RD-oorsprong is [229174.472, 485970.391] (52,35661 N, 6,47603 O): het hart van het vierkante BAG-pand 0163100000533903 (5,25 × 5,25 m, het gebouwtje aan de voet). Het reservoir ligt er in het AHN-DSM binnen 0,3 m boven. Het maaiveld ligt op NAP +9,3: AHN-DTM in een ring van 4 tot 8 m geeft 9,15 tot 9,8, mediaan 9,29.

+X loopt langs de gevels van het gebouwtje, 6,5 graden linksom van RD-oost (gemeten op de BAG-gevels; `xAxis` [0.99357, 0.11320]). +Y wijst naar het noorden, naar de P.C. Stamstraat. De poten en lisenen staan op 0 + 45k graden, de vensters van het reservoir ertussen.

`groundHeight` 52,32 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints`: noord 52,32 (de stoep langs de straat), oost 52,35, zuid 52,55 en west 52,65. Gemeten met de terreintegels van de export.

Het model vervangt BAG-pand 0163100000533903. In de PDOK-tegel is dat pand een blok van 5,25 m tot 16,4 m boven het maaiveld. Andere panden raken het model niet: het dichtstbijzijnde pand (0163100000588155) staat circa 30 m naar het zuidoosten.

## Onderdeel `building:watertoren-voetgebouw-poten-koppelbalken-en-reservoir`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- **Gebouwtje**: 5,25 × 5,25 m tot 2,75 m. Een goot steekt 0,22 m uit met een onderkant van 45 graden; het platte dak ligt op 3,22 m.
  - Dubbele deur van 1,5 m breed tot 2,3 m in de noordgevel (+Y).
  - In de drie andere gevels een venster van 0,6 m breed van 1,0 tot 1,9 m, met een schuin plafond.
- **Poten**: acht radiale prisma's van 0,7 m breed. Het buitenvlak loopt naar binnen, van 2,44 m uit het hart op het dak (3,22 m) tot 1,98 m onder de kraag (10,1 m).
- **Kern en vakken**: de vakken tussen de poten zijn in het echt open. Hier zijn het vakken van 0,8 m diep (midden op een vak) voor een achtkante kern die de standpijp voorstelt.
- **Koppelbalken**: een achthoek door de buitenvlakken van de poten van 6,22 tot 6,73 m. Het ondervlak loopt onder 48 graden de kern in, zoals de schoren op de foto's. Bovenaan loopt dezelfde schuine overgang van de kern naar de kraag.
- **Reservoir** (één omwenteling):
  - kraag van 2,04 m van 10,0 tot 10,45 m, met een onderkant van 51 graden;
  - kegelvormige bodem onder 57 graden tot 2,62 m op 11,35 m;
  - waterlijst van 2,74 m van 11,47 tot 11,7 m, met een onderkant van 45 graden en een schuine bovenkant naar de mantel;
  - mantel van 2,52 m (5,04 m doorsnede) tot 15,62 m;
  - band van 2,67 m tot 15,98 m, met een onderkant van 45 graden;
  - dakrand van 2,77 m van 16,08 tot 16,22 m, met een onderkant van 45 graden;
  - een licht bol dak tot 16,35 m (NAP +25,65).
- **Lisenen**: acht stuks boven de poten, 0,6 m breed, tot 2,67 m uit het hart (0,15 m uit de mantel), van de waterlijst tot in de band.
- **Vensters**: acht smalle rondboogvensters, één per vak tussen de lisenen. Ze zijn blinde nissen van 0,5 m breed en 0,25 m diep, van 13,1 tot 14,75 m, met een plafond van 56 graden.

## Bronnen en maten

- [Rijksmonumentenregister 512248](https://monumentenregister.cultureelerfgoed.nl/monumenten/512248): betonskelet met Intze-reservoir, het gebouwtje met plat dak en overstekende goot, dubbele deur en drie vensters, acht poten met koppelbalken, mantel met acht lisenen op een waterlijst, gietijzeren rondboogvensters, ijzeren wenteltrap. Het register geeft geen maten.
- [Wikipedia](https://nl.wikipedia.org/wiki/Oude_watertoren_(Nijverdal)): 1912, proceswater van de Stoomblekerij, restauratie 2010-2011. Geen hoogte of inhoud.
- BAG-pand 0163100000533903 (PDOK, 2026-11-06): vierkant van 5,25 m, gevels onder 6,5 graden.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06):
  - dak van het reservoir NAP +25,55 aan de rand tot +25,65 in het midden;
  - buitenrand van het reservoir op straal 2,6 tot 2,75 m;
  - maaiveld NAP +9,3.
- Luchtfoto (PDOK, 2026-11-06): het ronde dak met een lichte rand, het gebouwtje eronder en de straat aan de noordkant.
- Foto's op Wikimedia Commons:
  - "Exterieur OVERZICHT WATERTOREN - Nijverdal - 20297259 - RCE" (waterpas): hoogtes van het gebouwtje, de koppelbalken, de poten, de bodem, de waterlijst, de vensters en de dakrand, en de breedte over de poten en het reservoir. Schaal 39 px/m uit de AHN-hoogte.
  - "Nijverdal Watertoren 8314": de poten met de schoren onder de koppelbalken, de lisenen, de vensters en het gebouwtje.
  - "Watertoren, Nijverdal": mantel, lisenen, vensters en wenteltrap.

## Geschat en weggelaten

**Geschat**, uit foto's op schaal van de AHN-hoogte:

- de hoogtes van de goot, de koppelbalken, de kraag, de bodem, de waterlijst, de band, de dakrand en de vensters;
- de breedte en de helling van de poten;
- de stand van de poten en lisenen ten opzichte van de gevels van het gebouwtje (op de foto's staat een poot midden boven een gevel);
- de gevel met de deur: aangenomen is de noordgevel, naar de straat. De vensters met een boogje zitten in de andere drie gevels, midden in de gevel.

**Vergroot voor 1:1000**:

- poten 0,7 m breed (in het echt circa 0,58 m);
- vensters in het reservoir 0,5 m breed (in het echt circa 0,45 m);
- vensters in het gebouwtje 0,6 m breed (in het echt circa 0,35 m).

**Dicht gemaakt**: de open ruimte tussen de poten is een kern met vakken van 0,8 m diep. Open zou het reservoir boven een plat plafond zweven en zouden de koppelbalken vrij overspannen; dat is niet zonder steun te printen.

**Weggelaten**:

- de ijzeren wenteltrap: open ijzerwerk met treden en een spil dunner dan 0,9 m. Als dichte cilinder zou hij een kolom tonen die er niet is;
- de standpijp, die in de kern zit;
- het hekwerk rond het gebouwtje;
- de roeden in de vensters en de randen van de vlakken tussen de lisenen.

## Controle

- `npx vitest run tests/landmark-models.test.ts -t "old Nijverdal water tower"` in de webshop. De test controleert de catalogus, de node, hoekpunten, doorsneden en dat `supportedSolid` op 45 graden niets toevoegt.
- Renders van vier kanten naast de PDOK-reconstructie: PDOK heeft een blok van 5,25 m tot 16,4 m. Het model heeft daarnaast het gebouwtje met goot, deur en vensters, de poten met de koppelbalken, de uitkragende bodem met waterlijst, de lisenen, de vensters en de dakrand.
