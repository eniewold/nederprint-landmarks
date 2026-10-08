# Rotterdam Ahoy (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ahoy.glb` | Catalogusbron in meters: node `building:complex` (de Arena met dakrand, goot en oostkop, de evenementenhallen met tonvormige beuken en holle dakvelden, de lange westhal, het nieuwe deel in het noordwesten, de lage bouwdelen en de zuidhal als tongewelf) |
| `ahoy-1-1000.stl` | Het complex op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (362 × 298 × 31 mm) |
| `ahoy.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93100,00, 433080,00), het hart van de
Arena, op het maaiveld (NAP −0,9 m), en de glTF-conventie Y omhoog. +X loopt
langs de hallen naar het oosten (2,25 graden met de klok mee vanaf de RD-X-as)
en +Y loodrecht daarop naar het noorden. Het maaiveld wordt op zes punten rond
het complex bemonsterd (`groundSamplePoints`, NAP −0,9 tot −0,5 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0599100000232364` (Arena, hallen en
zuidhal) en `NL.IMBAG.Pand.0599100100018688` (het nieuwe deel in het
noordwesten).

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM; de gebogen daken zijn
dwarsprofielen op 0,25 m die over de lengte van het bouwdeel zijn uitgetrokken,
geen hoogteveld; alles is afgesneden op de BAG-contouren):

- De evenementenhallen in het westen (u −212 tot −100 m, v −78,5 tot 60,5 m)
  hebben van west naar oost twee tonvormige beuken met ruggen en dakgoten
  ertussen:
  - Beuk A (u −198,4 tot −165,8 m, 32,6 m breed) en beuk C (u −145,7 tot
    −113,0 m, 32,7 m breed) zijn bolle parabolen (straal ongeveer 100 m) met een
    voet op +11,4 m en 1,2 m en 1,1 m steek (top +12,6 m op u −182,1 en
    −129,4 m). Het profiel wijkt over 95 % van de cellen minder dan 0,15 tot
    0,35 m van de AHN-mediaan af.
  - Tussen en naast de beuken liggen ruggen met flanken van 10 graden (0,17 tot
    0,19) die op +12,7 tot +12,85 m eindigen (u −206,6, −158,5, −153,0 en
    −105,8 m). Daartussen liggen smalle dakgoten (V-vormig, 3,4 tot 4 m breed
    aan de bovenkant, de bodem 1 m breed) op u −208,5 m (+11,7 m), −155,7 m
    (+11,6 m) en −103 m (+11,7 m).
  - In de middelste strook (v −11,4 tot 6,2 m, 17,6 m lang) liggen de beuken
    omgekeerd: een hol dakveld van 48 m breed (parabool van rug tot rug, bodem
    +10,05 m, 2,7 m onder de ruggen) met een verticale kopwand van 2,5 m. Aan de
    zuidkant (v < −71,8 m) en aan de noordkant van beuk A (v > 54,5 m) is het dak
    ook hol, met de bodem op +9,8 en +10,0 m (zuid) en +9,6 m (noord).
  - De lange westhal (u −264 tot −212 m, v −47,5 tot 42,7 m) ligt vlak op
    +12,45 m en is in v een flauwe boog (0,33 m steek over 79 m, kruin +12,78
    m). Hij loopt over een flank (u −235 tot −219 m) af naar een goot op +11,35 m
    en stijgt daarna naar de rug op u −211,5 m. Aan de lange zijden ligt een rand
    van 5 m op +9,6 m die richting de rug omhoog loopt.
- De zuidhal (145 bij 72 m) is een tongewelf met bolle schouders: het
  dwarsprofiel (22 punten uit het DSM) stijgt van +15,9 m bij de zuidgevel via
  +17,4 m op 4 m en +19,0 m op 12 m naar de nok van +19,98 m op v −104,5 m en
  daalt aan de noordkant naar +16,1 m; het is over de hele lengte gelijk. Twee
  entreeblokken (22 bij 5 m, +13,2 m) dragen elk vier ronde luchtkanalen (2,4 m
  doorsnede, tot +16,7 m); tegen de noordgevel staat een lage aanbouw van 29 bij
  7 m (+3,9 m).
- De Arena (108 bij 98 m): het gewelfde dak is de romp van AHN-punten op een
  raster van 8 tot 9 m (top +30,7 m op u 3 m), in twee delen: het hoofddak (u
  −40 tot 46,3 m) en een lagere dakbox in het westen (u −54 tot −40 m, v −36 tot
  28 m, +22 tot +27,8 m). Eromheen loopt een dakrand (lip) van +22,1 tot +23,4 m
  met een verdiepte goot (4 m breed, 1 m diep, 3 tot 7 m van de muur); de muur
  heeft een knik (punt op u 6 m) en helt 3,3 m (zuid) en 2,3 m (noord) naar
  buiten tot de lage gevelband op +7,6 m. De oostkop (u 46 tot 56 m) is een hol
  dakveld (parabool, +17,65 m in het midden bij v −3 m tot +22 m aan de
  uiteinden). Aan de noordkant ligt een verdiept dakveld (trapezium met flanken
  van 16 graden, bodem +8,6 tot +9,05 m op u −13 tot 23,5 m, de hoge delen op
  +13 m) en een smalle spleet (2,5 m) naast de muur; daarachter loopt de
  noordneus aflopend van +9,0 naar +6,85 m (6,8 graden). Oostelijk ligt een
  lage dakrand (+8,3 m).
- Het nieuwe deel in het noordwesten: de hoge hal is in v een flauwe boog
  (0,5 m steek over 51 m, kruin +28,0 m in het westen en +28,5 m in het oosten),
  daarnaast de trapsgewijze koppen op +22,2, +20,9, +16,4, +14,0 en +6,3 m, de
  oostvleugel op +25,0 m en de strook met de luchtkanalen (+22,0 m met een band
  van +24,0 m).
- De lage bouwdelen tussen de hallen en de Arena: het blok van +15,1 m met een
  dakopbouw van 7 bij 32 m (+18,8 m), het blok van +7,4 m met een dakrug (+2,4
  m, 41 m lang) en vier technische kasten (+13,2 m), het blok van +14,0 m met
  een verhoogd veld (+14,5 m) en twee kopjes (+16,7 m), en de lage verbindingen
  (+7,0, +7,3 en +3,9 m) over de binnenhof, die 5 m breed open blijft.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m,
DSM op 0,25 m): 93,5 % ligt binnen 1 m en 96,3 % binnen 2 m (met het vorige,
vlakke model op dezelfde manier gemeten: 83,5 % en 92,9 %). Per deel (binnen 1
m, binnen 2 m; tussen haakjes het vorige model): de hallen 97,2 % en 98,3 %
(88,2 % en 95,8 %), de lange westhal 97,9 % en 98,8 % (82,3 % en 90,0 %), de
zuidhal 97,3 % en 98,4 % (81,1 % en 95,3 %), de Arena 91,7 % en 95,5 % (79,0 %
en 92,3 %), het nieuwe deel in het noordwesten 86,7 % en 92,8 % en de lage
middenblokken 89,4 % en 93,0 %. De afwijkingen zitten in de installaties op de
daken, de schuine muur en de lip van de Arena (tot 1 m) en de wagens ten oosten
van de Arena. Het DSM heeft gaten boven donkere daken met zonnepanelen; daar is
het model niet getoetst.

Printbaar op 1:1000: alle bouwdelen hebben rechte of omhoog hellende wanden en
omhoog gerichte daken (de schuine muur van de Arena is aan de voet breder), dus
de export vult op 1:1000 en 1:1500 niets op (0,00 % volume); op 1:2500 komt er
0,7 % bij. De dakgoten zijn 2,5 tot 4 m breed (minimaal 1,5 m), de holle
dakvelden hebben hun bodem op +9,6 m (ruim boven de onderkant) en de dunste
bouwdelen zijn de ronde luchtkanalen (2,4 m). De STL is 1132 cm³ (5584
driehoeken) en het model één samenhangend deel (genus 1: de open binnenhof).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Rotterdam_Ahoy), PDOK BAG
(de twee panden), PDOK AHN (dsm en dtm 0,5 m en 0,25 m via WCS) en de PDOK
luchtfoto. Geschat zijn de zone-grenzen in v (op 0,5 m afgelezen), de parabool
van de holle dakvelden en van de oostkop (gefit op het DSM), de helling van de
muur van de Arena, de ligging en hoogte van de ronde luchtkanalen (het DSM geeft
alleen de toppen) en het dakprofiel van de Arena tussen de meetpunten.
Weggelaten: de installaties, lichtstraten en dakkapjes, het stalen vakwerk
(luifel en kolommen) langs de zuidgevel van de zuidhal (te dun, in het DSM
alleen gedeeltelijk zichtbaar), de dunne luchtkanalen en de wagens bij de
Arena.
