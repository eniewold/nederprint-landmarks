# Eye Filmmuseum (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `eye-filmmuseum.glb` | Catalogusbron in meters: node `building:eye-filmmuseum` met het witte volume, het gefacetteerde dak, het terras op de sokkel, de glazen band en de uitkragende kop, en node `road:entreetrappen` met de trappen onder de kop |
| `eye-filmmuseum-1-1000.stl` | Museum en trappen in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (110 × 97 × 25 mm) |
| `eye-filmmuseum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121895, 488615), midden in de
dakomtrek, op het maaiveld van terras en plein (NAP +1,6 m) en de
glTF-conventie Y omhoog. +X loopt naar het oosten (de kop), +Y naar het
noorden. Het maaiveld wordt op vier punten bemonsterd (`groundSamplePoints`):
op het terras aan de IJ-zijde, op het plein ten zuidoosten en oosten van de kop
en op het gazon ten noordoosten (NAP +1,6 tot +1,9 m), niet op de lagere kade
aan de westkant (NAP +1,0 m) en niet op het IJ. Het catalogusitem vervangt
BAG-pand `NL.IMBAG.Pand.0363100012237838` (dakomtrek inclusief de
entreetrappen); de BAG-WFS toont geen andere panden onder het model, ook geen
ondergrondse.

Onderdelen in het model (hoogtes in NAP):

- Het dak als twaalf vlakken uit het AHN-DSM (RANSAC, rms 0,01 tot 0,13 m),
  samengevoegd als min/max-combinatie van halfruimtes zodat graten en kilen
  scherp zijn: het grote noordwestvlak (5,7 graden, tot +16 m aan de
  westkant), het zuidwestvlak, het zuid-, noordoost- en zuidoostvlak die naar
  de kop oplopen, een knik tussen noordoost- en zuidoostvlak en de vlakke top
  van de kop op +25,7 m. Binnen de dakomtrek ligt 96 % van het AHN binnen
  0,5 m van het model.
- De steile randvlakken van het AHN waarmee de gevels vanaf de dakrand naar
  buiten aflopen: de zuidgevel boven de glazen band (39,6 graden), de westgevel
  (67,6 graden), de zuidgevel van de kop en de noordgevel (75,6 graden).
- Het terras op de sokkel op +5,44 m (AHN): open aan de zuidwesthoek, als
  smalle rand langs de westpunt.
- Onder de dakomtrek (BAG) wijken de gevels terug naar de voet op het
  maaiveld: een rand van 0,3 m recht onder de dakrand, daaronder schuin naar
  binnen tot de voetafdruk van het BGT-pand, of verder naar buiten waar die
  gevel anders flauwer dan 46 graden zou hangen. De onderrand ligt op +8,1 m
  aan de noordhoek, +9,0 m in de noordwesthoek, +5,1 m langs de westpunt,
  +9,9 tot +16,0 m langs de zuidgevel en +25,3 m in de noordoosthoek van de kop.
- De kop: een eindgevel van 8,7 m onder de vlakke top (onderrand op +17,2 m,
  foto's vanaf het IJ), daaronder een onderkant die onder 46 graden naar de
  voet 15 m achter de kop loopt. In werkelijkheid kraagt de kop circa 31,5 m
  uit boven de glazen entree en loopt de onderkant onder circa 15 graden op;
  op 1:1000 is dat niet zonder steun te printen.
- De glazen band aan de IJ-zijde: 2,5 m diep, van de terrasborstwering op
  +6,6 m tot onder het witte volume, waarvan de onderkant onder 46 graden
  terugwijkt en de laatste 0,4 m vlak is.
- De entreetrappen onder de kop (AHN, BGT overbruggingsdeel): een rug van de
  glazen entree (+5,0 m) naar het zuidzuidoosten (+3,3 m), met aan beide
  kanten vier treden naar het plein.

Printbaar op 1:1000 zonder steun: alle onderdelen beginnen op dezelfde
onderkant, 1 m onder het maaiveld, en het script controleert dat geen
ondervlak flauwer hangt dan 45,5 graden (het flauwste is 46,2 graden), op de
vlakke bovenkant van de glazen band na. Die bovenkant van 21 m² is bewust
vlak: zonder zo'n vlak krijgt de node in de export de verticale opvulling en
worden de schuine gevels en de kop rechte wanden tot de grond (valkuil
Kubuswoningen). Met de band vult de export de node laag voor laag op onder de
printbare hoek (gesloten, volume 78 184 mm³ voor en
80 869 mm³ na op 1:1000; het verschil is de voet die tot de grondplaat
doorloopt, de doorsneden erboven zijn gelijk op 2 mm² na). De trappen hebben
geen overhang en krijgen de gewone opvulling. De export van een uitsnede van
180 m op 1:1000 met het museum duurt circa 1 seconde.

De terrastrappen van het plein aan de IJ-zijde (treden van 0,3 tot 0,5 m tussen
NAP +1,7 en +0,2 m) zitten in het PDOK-terrein en zijn niet gemodelleerd, om
het terrein niet te dubbelen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Eye_Filmmuseum) (Delugan
Meissl Associated Architects, geopend in 2012), PDOK BAG (dakomtrek) en BGT
(voetafdruk op het maaiveld, overbruggingsdeel en verharding bij de trappen),
PDOK AHN (dsm en dtm 0,5 m via WCS: dakvlakken, randvlakken, terras, trappen en
maaiveld), de PDOK luchtfoto (terras, trappen en terrastrappen) en foto's van
Wikimedia Commons (`EYE Film Institute Amsterdam from tour boat
2016-09-12-6548.jpg` en `Eye Amsterdam 2014.JPG` voor de zuidgevel, de glazen
band en de eindgevel van de kop, `EYE museum building 20180701.jpg` voor de kop
boven de entreetrappen, `Eye film instituut 1.JPG`, `Eye film instituut
2.JPG`, `Amsterdam-overhoeks Eye Film Institute IMG 8011.JPG` en `Eye met
constructie op de achtergrond.JPG`). Geschat zijn de onderrand van de kop, de
diepte en hoogte van de glazen band, de voet van de schuine gevels waar die
buiten de BGT-voetafdruk ligt, de treden van de trappen en de rand van 0,3 m
onder de dakrand; de lip en het glas van de westpunt (het ‘oog’), de
terugliggende begane grond onder het terras, de schuine kolom onder de kop en
de gevelindeling zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
