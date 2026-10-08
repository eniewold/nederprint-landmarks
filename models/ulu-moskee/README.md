# Ulu Moskee (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ulu-moskee.glb` | Catalogusbron in meters: node `building:moskee` (de moskee met schilddak, koepel en twee minaretten) |
| `ulu-moskee-1-1000.stl` | De moskee op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (34 × 30 × 40 mm) |
| `ulu-moskee.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (135611,34, 456003,35), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP +1,95 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels naar het noordoosten (52,75
graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht daarop naar het
noordwesten; de minaretten staan aan de zuidkant van de zijvleugels. Het
maaiveld wordt op vier punten op het plein rond de moskee bemonsterd
(`groundSamplePoints`, NAP +1,7 tot +2,0 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0344100000084943`.

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM):

- De moskee op de BAG-contour (32 bij 30 m: de hoofdruimte van 24 m breed met
  twee zijvleugels van 4 m en de voorstrook) met vlakke lage daken op +14,5 m.
- Het schilddak: een vlakke rand op +17,4 m (23,4 bij 24,2 m) met daarbinnen
  een steile helling (60 tot 70 graden) naar de koepelvoet op +21 m (13 bij
  12,6 m).
- De koepel als bolkap met 12,4 m doorsnee en top op +24,1 m.
- Twee minaretten van +40 m op (−14,7; −2,8) en (14,7; −2,8) m: een schacht van
  2,8 m doorsnee, een balkon van 4,4 m doorsnee op 27,5 m (de onderkant helt
  onder 48 graden), een bovenschacht en een spits. Het AHN geeft +38,4 en
  +39,8 m, maar toont dunne pennen te laag.

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m):
78,3 % ligt binnen 1 m en 89,7 % binnen 2 m. De afwijkingen zitten in de
dakranden van het schilddak en de hoeken.

Printbaar op 1:1000: de koepel en het dak staan op de zaal, de balkons hellen
onder 48 graden, dus de export vult op 1:1000 en 1:1500 maar 0,01 % bij; op
1:2500 komt er 0,7 % bij. De STL is 16 cm³ en het model één samenhangend deel.
De minaretten zijn op 1:1000 2,8 mm dik.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Ulu-moskee_%28Utrecht%29),
PDOK BAG (het pand), PDOK AHN (dsm en dtm 0,5 m via WCS) en de PDOK luchtfoto.
Geschat zijn de doorsnede, het balkon en de spits van de minaretten, de hoogte
van de minaretten (40 m) en de straal van de koepel. Weggelaten: de dakranden en
installaties, de vensters en het gevelreliëf.
