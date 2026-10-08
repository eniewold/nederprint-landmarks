# Naturalis (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `naturalis.glb` | Catalogusbron in meters: nodes `building:museum` (gebouw uit 1998, strata en atriumdoos) en `building:collectietoren` |
| `naturalis-1-1000.stl` | Het hele complex in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (88,0 × 120,4 × 65,2 mm) |
| `naturalis.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (92442,03, 464470,42), tussen de
collectietoren en de atriumdoos, op het maaiveld (NAP +0,5 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels van het gebouw uit 1998
(RD-richting 2,9 graden, net ten noorden van oost); +Y wijst naar het
noorden, naar de nieuwbouw. Het maaiveld wordt alleen op de straten ten
westen, noorden en noordoosten bemonsterd (`groundSamplePoints`, AHN NAP +0,5
m), niet in de sloot aan de oostkant (NAP -0,5 m) of het water aan de
zuidkant. `groundOffsetMetres` is 0, want alles begint al 0,5 m onder het
maaiveld. Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0546100000011596`,
het ene BAG-pand van het hele complex (de PDOK-versie heeft een spits op de
collectietoren).

Onderdelen (hoogtes in NAP; het maaiveld ligt op circa NAP +0,5 m), allemaal
binnen de BAG-contour en in vakken langs de gevels van 1998 uit het AHN-DSM:

- Het gebouw van Fons Verheijen (1998): de westvleugel tot +16,4 m, het
  middendeel tot +25,2 m met een strook op +22,5 m naar de toren, de
  kantoorschijf aan de oost- en zuidkant tot +21,4 m, de glazen kap tussen
  toren en atriumdoos op +20,0 m en de lage verbinding achter de binnenplaats
  aan de westkant op +9,6 m.
- De collectietoren (22,5 × 22,5 m) tot +61,6 m, met de lichte zuidhelft
  recht en de donkere noordhelft met afgeronde hoeken (straal 4 m), en de
  schacht van 3,5 m aan de oostkant tot +65,2 m, het hoogste punt.
- De nieuwbouw van Neutelings Riedijk (2019): de 'strata' van rode
  natuursteen tot +31,4 m, als vijf platen tot +10,8, +16,5, +22,5, +24,8 en
  +31,4 m. Langs de noord- en oostgevel springt elke plaat terug (de
  noordgevel ligt op elke hoogte evenwijdig, 0,13 m terug per meter hoogte),
  tot onder het dak 3,3 en 2 m. In de noordwesthoek heeft elke plaat een eigen
  westgevel, gemeten per hoogte in het AHN: de onderste volgt de geknikte
  BAG-gevel, de tweede staat circa 3 graden rechtsom gedraaid (aan de
  noordkant 1 m verder terug), de derde circa 3 graden linksom, de vierde
  ligt 2,3 m terug en het dak 4 m. Zo ontstaan de wigvormige lijsten van de
  verspringende verdiepingen.
  Aan de zuidkant lopen de strata in terrassen af: aan de westkant +24,8,
  +18,2 en +11,2 m, aan de oostkant +24,8 en +18,0 m en een lage doorgang op
  +9,6 m.
- De witte atriumdoos op de strata (49,3 × 42,5 m) tot +41,9 m, met in de
  noord-, west- en oostgevel boven de strata twee verspringende rijen blinde
  ruitnissen (2,4 × 3,6 m, 0,35 m diep, op 4 m) voor het opengewerkte
  gevelpatroon met de ronde vensters.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 86 % van
de circa 33.000 DSM-cellen binnen 2 m (79 % binnen 1 m, mediaan -0,33 m); de
afwijkingen zitten in randcellen langs de getrapte gevels, in de glazen kappen
en lichtstraten (geen AHN-punten) en aan de zuidrand van de kantoorschijf, waar
het DSM een lagere strook van 12 tot 17 m toont.

Printbaar op 1:1000 zonder steun: alles staat recht op of springt naar boven
toe terug (elke strataplaat ligt binnen de plaat eronder), er kraagt niets
uit, de smalste delen zijn de terrassen van 4 m en de schacht van 3,5 m naast
de toren, en de ruitnissen hebben flanken van 56 graden. Met
overhangopvulling blijft de STL op 257,5 cm³; er komt
niets bij. In de preview van
een uitsnede van circa 226 m rond het hart staat het model op het maaiveld
langs de gracht en zit het vervangen pand niet meer in de export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Naturalis_Biodiversity_Center)
(nieuwbouw 1998 van Fons Verheijen met de collectietoren van 62 m, nieuwbouw
2019 van Neutelings Riedijk met het atrium), PDOK BAG (de contour van het
complex), PDOK AHN (dsm en dtm 0,5 m via WCS: de hoogte per deel, het
gevel van elke strataplaat en het maaiveld), de PDOK luchtfoto en foto's op
Wikimedia Commons (de strata, de atriumdoos vanaf de Darwinweg en de toren
vanaf het Pesthuis). Geschat zijn de plaatgrenzen van de strata (uit de
plateaus in het AHN; de gevels van de platen zijn gemeten, maar uitkragingen
onder een hogere plaat ziet het AHN niet), de verdeling van de toren
in een rechte en een afgeronde helft en de straal van de afronding (foto's),
en het ruitpatroon van de nissen. Vereenvoudigd: elk deel heeft een plat dak,
de stenen banden, de zigzagkolommen onder de strata, de installaties op de
daken, de lichtstraten en de vensters zijn weggelaten.
