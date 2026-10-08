# Goffertstadion (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `goffertstadion.glb` | Catalogusbron in meters: node `building:stadion` (ring van het dak, vier lichtmasten en het hoofdgebouw) |
| `goffertstadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het veld) op het printbed (159 × 147 × 40 mm) |
| `goffertstadion.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (186026,60, 426077,50), in het hart
van de veldopening op het niveau van het veld (NAP +17,4 m), en de
glTF-conventie Y omhoog. +X loopt langs de lengteas van het veld naar het
zuidoosten (−43,07 graden vanaf de RD-X-as) en +Y dwars daarop naar het
noordoosten; het hoofdgebouw ligt aan de −Y-kant. Het stadion ligt in een
kuil in het Goffertpark: het veld en het park ten westen ervan liggen 4 tot
8 m lager dan het park ten noorden en zuiden. Het maaiveld wordt daarom op het
veld en ten westen van het stadion bemonsterd (`groundSamplePoints`, het
laagste punt telt), zodat de wanden aan de westkant op het terrein staan en
aan de hoge kant het terrein in komen. Het stadion zelf is geen BAG-pand (er
is geen PDOK-reconstructie van); vervangt alleen het hoofdgebouw
`NL.IMBAG.Pand.0268100000026111`.

Onderdelen (hoogtes boven het veld, uit het AHN-DSM):

- De ring van het dak tussen twee afgeronde rechthoeken: de binnenrand (122
  bij 82 m, hoekstraal 8 m) op +13,0 m en de buitenrand (159 bij 117 m,
  hoekstraal 24 m) op +11,3 m, opgebouwd uit 28 vlakke stroken met verticale
  wanden (het dak daalt dus over 17,5 tot 18,5 m met 0,09 m per meter naar
  buiten).
- Vier lichtmasten op de buitenhoeken als pilaren van 2,6 × 2,6 m vanaf het dak
  tot +39,2 m (noordwest), +32,8 m (noordoost), +33,7 m (zuidoost) en +35,2 m
  (zuidwest) (AHN).
- Het hoofdgebouw op de BAG-contour (66 bij 37 m): de noordelijke vleugel
  tegen het stadion op +11,6 m en de zuidelijke vleugel op +13,2 m, met de
  liftopbouw van 8 bij 6 m tot +21,7 m.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, alleen waar model en
DSM allebei een waarde geven): 78,8 % ligt binnen 1 m en 84,9 % binnen 2 m. De
afwijkingen zitten in de dakranden, de dakribben, de bomen die tegen het
stadion staan en de lage voorrand van het dak langs het veld.

Printbaar op 1:1000: alle vlakken boven de onderkant wijzen omhoog of staan
verticaal, dus de export vult op 1:1000 en 1:1500 niets op (0,00 % volume); op
1:2500 komt er 1,0 % bij rond de masten. De STL is 128 cm³ en het model één
samenhangend deel met de veldopening als gat.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Goffertstadion) (12.500
plaatsen), PDOK BAG (het hoofdgebouw), PDOK AHN (dsm en dtm 0,5 m via WCS) en de
PDOK luchtfoto. Geschat zijn de doorsnede van de lichtmasten en de straal van de
hoeken van de ring. Weggelaten: de tribunes onder het dak, de dakribben, de
loopbrug en het gebouw ten oosten van het stadion (aparte BAG-panden).
