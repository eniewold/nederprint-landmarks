# De Oosterpoort (Groningen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `oosterpoort.glb` | Catalogusbron in meters: één node `building:oosterpoort` met de basismassa, de grote en de kleine zaal, het foyervolume, de binnenhof, de achterbouw, de entreehoek met het kunstwerk en de ramen in de voorgevel |
| `oosterpoort-1-1000.stl` | Het complex in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (97 × 135 × 20 mm) |
| `oosterpoort.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Muziekcentrum De Oosterpoort (1973) aan de Trompsingel. De GLB is in meters
met de oorsprong op RD (234420, 581465) op het maaiveld (NAP +3,85 m) en de
glTF-conventie Y omhoog. +X loopt langs de Trompsingel (RD-richting 43,7
graden linksom vanaf het oosten), +Y naar de straat aan de noordwestkant. Het
maaiveld wordt op drie punten rondom bemonsterd (`groundSamplePoints`);
`groundHeight` (44,53 m, ellipsoïdisch) is de laagste PDOK-terreinhoogte op
die punten. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0014100010925285`; de PDOK-hoogtes van de buurpanden kloppen
met het AHN.

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN tenzij anders
vermeld; alle daken zijn plat):

- Basismassa op de BAG-contour tot 8,15 m (NAP +12,0 m), met de holle
  voorgevel tussen de entreehoek en de oostvleugel.
- Grote zaal van 38,8 × 37,5 m tot 18,75 m.
- Foyervolume aan de Trompsingel, 45 graden gedraaid ten opzichte van het
  gebouw: dak op 9,85 m, met aan de westkant een schuine strook van 6,4 m breed
  tot 11,65 m.
- Kleine zaal van 30 × 25,7 m aan de achterkant tot 11,25 m.
- Binnenhof op maaiveld met de lage strook ervoor (3,8 m) en de glazen gang
  langs de westgevel (3,0 m).
- Lagere achterbouw op 4,05 m in het zuiden en een strook aan de oostkant.
- Gebogen glazen entreehoek, 0,6 m terug onder de dakrand, met het kunstwerk:
  een mast van 1 m tot 14 m, een naamschijf van 4,4 m doorsnede op 11 m met
  een kraag van 45 graden naar de mast, en een blauwe bol van 2,6 m op een
  voet (maten en hoogtes uit foto's geschat).
- Voorgevel: een glazen pui op de begane grond (0,6 m terug) en een rij ramen
  op de verdieping (geschat).

Weggelaten: het zwarte buisframe voor de voorgevel, de curve van het frame
naar de bol en het rode doek (te dun of geen vorm), de reclameborden en de
zonnepanelen. Van de zij- en achtergevels zijn geen foto's gevonden; die zijn
vlak gelaten.

Printbaarheid: alles staat op dezelfde onderkant. Onder de naamschijf en de
bol zet de export met de optie ‘Printbare overhang’ een kraag; op 1:1000 vult
hij 2,6 % op en op 1:1500 3,9 % (circa 0,2 seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/De_Oosterpoort), PDOK BAG
(contour), PDOK AHN (dsm en dtm 0,5 m via WCS: daken, zalen, foyervolume,
binnenhof, gang, achterbouw en maaiveld), de PDOK luchtfoto en foto's van
Wikimedia Commons (`De Oosterpoort Groningen.jpg`,
`Oosterpoort stad Groningen 2012 (1).jpg`,
`Oosterpoort stad Groningen 2012 (2).jpg`,
`20100617 Trompsingel 27 (Cultuurcentrum De Oosterpoort) Groningen NL.jpg`).

Licentie van het model: eigen werk op basis van open bronnen.
