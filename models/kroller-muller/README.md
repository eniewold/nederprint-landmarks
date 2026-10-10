# Kröller-Müller Museum (Otterlo)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kroller-muller.glb` | Catalogusbron in meters: node `building:museum` (het hele museum uit bouwdelen en dakvlakken: Van de Velde, Quist en het depot) |
| `kroller-muller-1-1000.stl` | Het museum op 1:1000 met de vlakke onderkant (4,2 m onder z = 0) op het printbed (190 × 254 × 14 mm) |
| `kroller-muller.json` | Catalogusitem met RD-georeferentie, maaiveld, vervangen BAG-panden, hoofdmaten en bronnen |

Gegenereerd door `scripts/generate-kroller-muller.mjs`.

## Oorsprong, assen en maaiveld

De GLB is in meters met de oorsprong op RD (184490, 456500), een rond punt in
het hart van het complex (het plein tussen de oostkop van Van de Velde en de gang
van Quist), en de glTF-conventie Y omhoog. z = 0 ligt op NAP +37,8 m, het pad
langs de noordgevel van Van de Velde. +X (u) loopt langs de gevels van Van de
Velde naar het oost-noordoosten, 23,96 graden tegen de klok in vanaf de RD-X-as
(de lengtegewogen richting van alle BAG-randen; vrijwel alle randen van het pand
liggen op die as of haaks erop), +Y (v) loodrecht daarop naar het
noord-noordwesten, langs de gangen van Quist.

Het maaiveld wordt op vier punten op het pad langs de noordgevel bemonsterd
(`groundSamplePoints` op v = -2,5 m, u = -115, -95, -60 en -45 m). Het complex is
254 m lang; daarom staat er een vaste ellipsoïdische terugval `groundHeight`
81,17 m (de laagste PDOK-terreinhoogte op die punten), zodat een uitsnede die
alleen het depot of het paviljoen raakt het model niet laat wegvallen.

Het terrein loopt van circa NAP +40 m (de heuvel ten zuiden van de dienstvleugel en
de oostkant van het depot) tot NAP +34,2 m (de noordkant van het depot). Alle
onderdelen beginnen daarom op dezelfde vlakke onderkant 4,2 m onder z = 0; die
ligt overal onder het PDOK-terrein (laagste terrein langs de contour 77,56 m
ellipsoïdisch, de onderkant 76,97 m), zodat niets zweeft. Er zit geen talud of
plateau in de GLB.

Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0228100000019793` (het hele
museum: Van de Velde, de uitbreidingen van Quist en het depot, één BAG-pand) en
van `NL.IMBAG.Pand.0228100000055941`, het pandje in de hof naast de hoge zaal van
Quist: PDOK zet daar een blok van 3,6 m neer dat boven het dak van de gangen
uitsteekt, terwijl het AHN (+0,35 m) en de luchtfoto (grasveld) een open hof
tonen. Die hof is in het model open.

## Onderdelen

Alle maten in het lokale stelsel (u, v), hoogtes boven z = 0. Het script bouwt
elk deel als zone (rechthoeken binnen de BAG-contour) met een eigen hoogte en
dakvorm; de BAG-contour is haaks rechtgetrokken op 0,05 m (oppervlak 10.978 m²,
BAG 10.979 m²) en het script controleert dat de zones haar helemaal dekken.

Museum van Henry van de Velde (1937-1938, u -125 tot -12 m), gesloten bakstenen
zalen met elk een eigen hoogte:

- Westvleugel (u -124,85 tot -115,6 m): lessenaarsdak van +4,2 m aan de westgevel
  naar +4,9 m tegen de eerste zaal; daarachter lage zalen met een plat dak en een
  borstwering tot +4,25 m.
- Zaal 1 (u -115,6 tot -90,45 m) en zaal 2 (u -64,3 tot -39,75 m): een flauw glazen
  zadeldak tussen de borstweringen, goot +5,3 en +5,4 m, nok +5,88 en +6,0 m midden
  in de zaal (gemeten als mediaan over 15 m lengte in profielen dwars op de zaal),
  met zes en negen lichtkappen van 3 × 1,6 tot 2 m en een smalle lichtstrook aan de
  westkant.
- Het vierkante zalenblok rond de open binnenhof met de vijver (u -90,45 tot
  -64,3 m, de hof 10,6 × 20 m): plat dak +5,85 m, borstwering +6,15 m, lichtstroken
  in de noord-, zuid- en westarm, de uitspringende armen en hoekpaviljoens uit de
  BAG-contour.
- Oostelijk lessenaarsdak (u -39,75 tot -30,05 m) van +5,35 m naar +4,38 m met twee
  lichtstroken, de lage strook (+4,45 m) ten noorden ervan en de lage zalen (+4,35 m)
  ten zuiden van zaal 2.
- Het hoge zalenblok (u -30,05 tot -12,05 m, v -28,6 tot -16,3 m): goot +6,2 m,
  afgeknot schilddak (12 tot 16 graden) naar een plateau van 9,5 × 3,2 m op +7,4 m
  met een glazen lichtkap tot +7,7 m.
- De zuidvleugel (u -30 tot -12 m, v -64 tot -28,6 m): het noordelijke deel met een
  plat dak (+5,85 m, borstwering +6,1 m) en drie lichtstraten als smalle
  zadeldakjes (1,6 m breed, nok +6,25 m); het zuidelijke deel een lage rand
  (+5,5 m) rond de hoge zaal van 11,5 × 14 m (goot +8,0 m, schilddak met een nok
  van 6 m op +8,6 m), met de afgeschuinde kop van de BAG-contour.

Uitbreiding van Wim Quist (1969-1977) en later:

- De glazen gangen (de verbinding met Van de Velde, de entreehal, de gang naar
  het noorden tot het depot, de gang naar het zuiden langs de hoge zaal en naar
  het paviljoen): dakvlak +3,75 m met een dakrand van 0,6 m breed tot +4,15 m
  (AHN 4,0 tot 4,4 m langs de randen). Langs de buitenrand van het complex staat
  de gevel 0,6 m terug onder een dakplaat van 0,9 m met een kraag van 43 graden
  eronder (de dunne platte daken boven de glasgevels).
- De hoge zaal met het witte dak (u 12,6 tot 32,7 m, v -84,65 tot -40,25 m): +8,3 m,
  met een goot van 1,4 m breed tot +6,6 m tussen het witte dak en het donkere
  dakdeel, en de open hof van 7,8 × 11,5 m ernaast.
- Het paviljoen in het zuidoosten (26,2 × 25 m): +9,5 m, plat glasdak.
- De zaal met het glasdak in het noorden (21,9 × 22,3 m): +7,6 m.
- De dienstvleugel (u -64 tot 5,5 m): plat dak +4,0 m met borstwering +4,3 m, en een
  hoge strook van 4 × 25 m op +7,6 m.
- Het depot in het noorden (38 × 38 m): plat dak +4,5 m met twee velden van negen
  rijen zonnepanelen (1,1 m diep op 1,55 m afstand, naar het zuiden hellend van
  +4,6 naar +4,85 m).

## Wat er niet in zit

- De beeldentuin, het Rietveldpaviljoen en de andere paviljoens en
  beelden: eigen panden of geen pand, geen deel van het museum.
- De bomen rond en boven het gebouw (het museum staat in het bos; het AHN heeft
  boomkruinen boven delen van de gangen, die zijn genegeerd).
- Gevelreliëf: de gevels van Van de Velde zijn gesloten baksteen zonder vensters,
  met alleen een smalle natuurstenen afdekking (minder dan 0,3 m uitstek); de
  glasgevels van Quist staan onder de dakplaat. Opschriften en het logo zijn
  weggelaten.
- Een aparte luifel of portaal bij de entree: op de luchtfoto en in het AHN valt
  de entree samen met de dakplaat van de glazen verbinding.
- Kleine installaties op het dak van de dienstvleugel en het installatieterrein
  ernaast (onder 0,9 m of buiten de BAG-contour), glasroeden, de golfplaat van het
  witte dak en de balk over het glasdak van de noordzaal (vlak in het AHN).

## Pasvorm op het AHN

Hoogtes uit het AHN-DSM 0,5 m (PDOK WCS), als mediaan per zone; de zadeldaken uit
profielen dwars op de zalen (goot en nok tot op 0,05 m), het schilddak van het hoge
zalenblok uit het verloop in beide richtingen, de hoge zaal van de zuidvleugel uit
een rij van 0,5 m-cellen. De hof van Quist ligt in het AHN tot 4,6 m oostelijker dan
het gat in de BAG-ring; het model volgt het AHN en de luchtfoto. Het terrein is uit het DTM en uit
de PDOK-terreintegels gecontroleerd.

## Printbaarheid

Printcontrole op 1:1000 (uitsnede van 281 m): status NoError, 68.491 mm³ zonder en
met de printbare overhangopvulling, dus 0 % extra: alle vlakken wijzen omhoog,
staan verticaal of hangen onder hoogstens 43 graden (de kraag onder de dakplaten
van Quist). De STL is 99,2 cm³ (190 × 254 × 14 mm), één samenhangend deel met
genus 2 (de twee open hoven). Kleinste delen: de lichtstraten (1,6 mm), de dakranden
en borstweringen (0,6 mm breed, 0,3 tot 0,4 mm hoog) en de rijen zonnepanelen.

## Geschat

- De maten en plaatsen van de lichtkappen en lichtstroken (luchtfoto 8 cm) en hun
  hoogte boven het dak (0,3 m).
- De borstweringen (0,3 m) en de dakranden van Quist (0,4 m boven het dak).
- De kraag onder de dakplaten van Quist: de gevel 0,6 m terug onder een plaat van
  0,9 m (foto's; het AHN ziet de gevel niet).
- De lichtstraten op de zuidvleugel als zadeldakjes van 1,6 m breed.
- De rijen zonnepanelen (aantal en afstand van de luchtfoto, helling geschat).
- De hoogte van de gangen onder de bomen (3,75 m, gelijk aan de vrije delen).

## Bronnen

[Wikipedia](https://nl.wikipedia.org/wiki/Kr%C3%B6ller-M%C3%BCller_Museum) (Van de
Velde 1938, uitbreiding 1953, uitbreiding van Wim Quist 1969-1977, renovatie
2005), PDOK BAG (de panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK
luchtfoto en foto's op Wikimedia Commons (categorie Kröller-Müller Museum; alleen
bekeken, niet opgenomen).
