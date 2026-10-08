# Kunstmuseum Den Haag (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kunstmuseum-den-haag.glb` | Catalogusbron in meters: node `building:museum` (het hele museumcomplex uit dakvlakken: zadeldaken, walmdaken, lichtkap, platdaksblokken, schoorstenen) |
| `kunstmuseum-den-haag-1-1000.stl` | Het complex op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (139 × 115 × 27 mm) |
| `kunstmuseum-den-haag.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (79170,43, 456286,21), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP +2,8 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels van het hoofdgebouw naar het
oosten (15,7 graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht daarop
naar het noorden. Het maaiveld wordt op vier punten ten noorden en ten zuiden
van het complex bemonsterd (`groundSamplePoints`, NAP +2,8 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0518100001640602`, het hele
museumcomplex.

Het complex en de BAG-contour staan 2,1 graden gedraaid ten opzichte van die
as (gemiddelde richting van de gevelranden van de BAG-ring). Het script bouwt
daarom in een gebouwstelsel waarin gevels, goten en nokken precies evenwijdig
lopen en draait het geheel aan het eind om de oorsprong (`THETA`); de GLB, de
oorsprong en de as blijven ongewijzigd. De maten hieronder zijn in dat
gebouwstelsel (x langs de gevel, y dwars), hoogtes boven het maaiveld.

Het model is opgebouwd uit dakvlakken en blokken, niet uit hoogtegebieden van
het AHN: nok-, goot- en blokhoogtes zijn op 0,25 m uit het DSM gemeten (alleen
geldige cellen; op de glasdaken geeft het DSM een ruw beeld en is de mediaan
per beuk en het 75e percentiel gebruikt) en de indeling is uit de luchtfoto
afgelezen.

Onderdelen:

- Hoofdgebouw van Berlage (x -33 tot 39 m, y -6 tot 65 m): onderbouw tot de
  gootring op +10,8 m; daarin de platte glazen lichtkap van 42,3 bij 28,1 m op
  +12,45 m (vlak tot op 0,1 m). Eromheen vier beuken van glazen zadeldaken, elk
  8,6 m breed met de nok op +13,4 m, de kilgoot op +11,2 m (27 graden) en een
  plat gootdeel van +11,7 m (noord en zuid) of +11,4 m (west) langs de buitengevel:
  de noordbeuk heeft twee nokken (y 51,1 en 59,7), de zuidbeuk twee (y 6,9 en
  -1,7), de westbeuk een lange nok (x -28,5), de oostbeuk is lager (nok +12,9 m,
  goot +11,9 m). Waar nokken elkaar kruisen ontstaan kilgoten langs de
  diagonalen (vereniging van de zadeldaken); de noordwesthoek (waar de westnok en
  de buitenste noordnok elkaar ontmoeten) en het zuideinde van de westbeuk zijn
  afgewalmd.
- Twee dwarsdaken (lantaarns): aan de noordzijde 11,3 m breed met de nok op
  +15,2 m (steiler, 35 graden) en een afgewalmd noordeinde dat 3,4 m voor de
  gevel uitspringt, aan de zuidzijde 11,6 m breed met de nok op +14,6 m en een
  afgewalmd zuideinde.
- Aan de westkant van de lichtkap twee lage glaskappen (8 m breed, nok +11,9 m),
  en een dwarsvleugel van 8 bij 13,5 m op +12,5 m met een glasnok op +13,9 m,
  drie lantaarns met piramidedak (tot +15,5 m) en aan beide zijden een afhellend
  dakvlak. Verder het hoge blok van 6,4 bij 9,6 m op +17,2 m (met aflopende dakvlakken
  rondom), de binnenplaats met het lage dak (+9,5 en +8,3 m) en de lage aanbouwen
  in de noordwesthoek (+10,7, +10,3 en +7,0 m) en de zuidwesthoek (+9,5 en +10,8 m).
- De oostelijke aanbouw (x 39 tot 66 m): platte daken op +4,8 en +5,4 m, het
  platform op +6,1 m met twee rijen installaties (+6,5 en +6,7 m), een glaskap
  van 6 bij 23 m (nok +5,8 m, aan beide einden afgewalmd), het lage blok naast het
  hoofdgebouw (+11,7 en +12,9 m) met twee vijfhoekige vleugels met puntige
  oostkant (9,5 bij 6,2 m, plat dak op +15,8 m) en twee bakstenen schoorstenen
  (tapse schacht van 3,0 naar 1,9 m dikte met kraag, +26,7 m).
- Het zuidelijk deel (x -37 tot 13 m, y -46 tot -6 m): 24 aaneengeschakelde
  blokken met plat dak op eigen hoogte (+3,8 tot +13,9 m, achttien verschillende
  hoogtes: +13,87, +11,92, +11,67, +10,57, +9,5, +9,47, +9,1, +8,9, +8,85, +8,77,
  +8,57, +7,47, +6,37, +6,3, +5,8, +5,0, +4,3 en +3,8 m), met een getrapte oostrand
  (vier terrassen), een terras met pergola (+6,3 m), een ruggengraat met
  lichtstroken (+11,9 m) en drie kleine dakopbouwen (liftkoppen en trappenhuizen,
  1,6 tot 2,3 m breed, +0,8 tot +1,5 m boven het dak).
- De galerij over de vijver naar het westen (37 bij 5,4 m) met een licht hellend
  zadeldak: nok +5,15 m, goot +4,75 m (7 graden); massief tot het maaiveld.

Alles wordt op de BAG-contour afgesneden; de contour is op 0,1 m rechtgetrokken
(oppervlak 7425 m² tegenover 7428 m² in de BAG). Aangrenzende stukken overlappen
0,02 m (de blokken van het zuidelijk deel 0,15 m).

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, 118.000 cellen boven
3 m): 89,7 % ligt binnen 1 m en 96,3 % binnen 2 m. Per onderdeel (binnen 1 m /
binnen 2 m): lichtkap 99,9 % / 100 %, noordbeuk 84 % / 95 %, zuidbeuk 84 % / 93 %,
westbeuk 82 % / 99 %, oostbeuk 92 % / 98 %, zuidelijk deel 93 % / 97 %,
oostelijke aanbouw 88 % / 95 %, galerij 93 % / 99,5 %. De nokken liggen gemiddeld
0,2 tot 0,5 m boven de mediaan van het DSM (de roeden steken boven het glas uit; het DSM
heeft op glas ruis en gaten, vooral aan de oostzijde van de noord- en zuidbeuk).

Printbaar op 1:1000: alles staat op het maaiveld en geen vlak hangt flauwer dan 45
graden naar beneden, dus de export vult op 1:1000 en 1:1500 niets op (0,00 %
volume); op 1:2500 komt er 1,08 % bij. De STL is 85,9 cm³ (139 × 115 × 27 mm) en
het model één samenhangend deel (genus 3: de binnenhoven). Kleinste delen: de
schoorsteentop (1,9 mm dik), de lantaarns en dakopbouwen (1,6 tot 3,6 mm).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kunstmuseum_Den_Haag), PDOK
BAG (het pand), PDOK AHN (dsm en dtm 0,25 m en 0,5 m via WCS) en de PDOK
luchtfoto. Geschat zijn de nokhoogte van de glazen zadeldaken (DSM op glas is
onzeker, 13,4 m is de middenwaarde tussen mediaan en roeden), de ligging van de
hoek- en kilgoten in de kruisingen (uit de luchtfoto en het verloop van de nokken
in het DSM), de afwalmingen, de drie lantaarns op de dwarsvleugel en de dikte van
de schoorstenen. Weggelaten: de glasroeden en dakgoten, parapetten, de glazen
lichtstroken naast de ruggengraat, installaties (op de aanbouw alleen de twee
rijen), en alle gevelreliëf; de galerij en het terras met pergola zijn massief
tot het maaiveld (in het echt een gang boven het water, resp. een pergola).
