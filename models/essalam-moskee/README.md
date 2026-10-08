# Essalam-moskee (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `essalam-moskee.glb` | Catalogusbron in meters: node `building:essalam-moskee` met de gebedszaal, de drie koepels en de twee minaretten |
| `essalam-moskee-1-1000.stl` | De moskee in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (48 × 27 × 50 mm) |
| `essalam-moskee.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong onder het hart van de hoofdkoepel op RD
(94880,4, 434824,33), op het maaiveld (NAP +1,5 m) en de glTF-conventie Y
omhoog. +X loopt langs de lengteas van het portaal naar de mihrab in het
zuidoosten (RD-richting -30,66 graden), +Y naar het noordoosten. Het maaiveld
wordt op vier punten rondom bemonsterd (`groundSamplePoints`, NAP +1,4 tot
+1,9 m). Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0599100000753081`.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel langs
de lengteas):

- De gebedszaal op de BAG-contour, inclusief de vierkante voeten van de
  minaretten, met een vlak dak op +16,5 m; het portaal aan de noordwestkant
  op +16,0 en +15,3 m en de zuidoostkant op +15,7 m.
- De hoofdkoepel boven de gebedszaal: een trommel met een straal van 6,6 m tot
  +22,0 m en een koepel tot +26,6 m, met het radiale profiel uit het DSM
  (Wikipedia: koepel 25 m hoog).
- De kleine koepel boven het portaal (straal 3,0 m, top +21,6 m) en de
  halfronde mihrab aan de zuidoostkant met zijn koepel (straal 2,7 m, top
  +19,5 m); de trommelhoogtes van beide zijn geschat.
- De twee minaretten aan weerszijden van het portaal, naar de omhullende per
  hoogte: een schacht van 5,8 m doorsnede tot +31,0 m, een trommel van 3,8 m
  tot +39,0 m en een van 3,0 m tot +45,5 m, met een spits tot +50,0 m (noord)
  en +49,3 m (west); Wikipedia noemt 50 m.

Printbaar op 1:1000 zonder steun: alles staat recht op of wordt naar boven toe
smaller, en het script controleert dat geen vlak boven de onderkant naar
beneden wijst. De export vult recht naar beneden op; de dunste delen zijn de
spitsen van de minaretten (3,0 mm aan de voet). De export van een uitsnede van
120 m op 1:1000 duurt circa 3 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Essalammoskee) (Wilfried van
Winden, in gebruik sinds 2010; koepel 25 m, minaretten 50 m), PDOK BAG
(contour), PDOK AHN (dsm en dtm 0,5 m via WCS: daken, koepelprofielen,
minaretten en maaiveld) en de PDOK luchtfoto. Geschat zijn de trommelhoogtes
van de kleine koepels en de vorm van de spitsen; de balkons van de
minaretten, de naalden met de halve maan, de borstweringen, de
zonnepanelen op het dak en de gevelindeling zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
