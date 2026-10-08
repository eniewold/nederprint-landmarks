# Beeld en Geluid (Hilversum)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `beeld-en-geluid.glb` | Catalogusbron in meters: node `building:kubus` (de kubus met de lage rand en de dakopstanden) |
| `beeld-en-geluid-1-1000.stl` | De kubus op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (57 × 57 × 31 mm) |
| `beeld-en-geluid.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (140373,47, 471950,63), het hart van
de kubus, op het maaiveld (NAP +5,1 m), en de glTF-conventie Y omhoog. +X loopt
langs de zuidgevel naar het oosten (15,4 graden tegen de klok in vanaf de
RD-X-as) en +Y loodrecht daarop. Het maaiveld wordt op vier punten in de
verdiepte tuin en op de gazons rond de voet bemonsterd (`groundSamplePoints`,
NAP +4,9 tot +5,2 m); het terrein loopt aan de noordkant op tot +7,9 m, dus
daar steekt de voet in het talud. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0402100001624069` (de kubus) en
`NL.IMBAG.Pand.0402100001617959` (het ondergrondse pand eromheen).

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM):

- De kubus op de BAG-contour: 55,2 bij 55,2 m met een vlak dak op +28,4 m
  (NAP +33,5 m).
- Een lage rand van 2 m breed tegen de zuidoosthoek (langs de oostgevel en
  langs de zuidgevel, BAG-contour buiten de kubus) op +9,2 m.
- Vier dakopstanden (installaties, 5 tot 35 m²) op +29,8 tot +30,4 m.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
91,1 % ligt binnen 1 m en 95,0 % binnen 2 m. De afwijkingen zitten in de
dakranden en de lichtstraten.

Printbaar op 1:1000: de kubus heeft rechte wanden en een vlak dak, dus de export
vult op 1:1000 en 1:1500 niets op (0,00 % volume); op 1:2500 komt er 0,4 % bij.
De STL is 89 cm³ en het model één samenhangend deel.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Nederlands_Instituut_voor_Beeld_en_Geluid),
PDOK BAG (de twee panden), PDOK AHN (dsm en dtm 0,5 m via WCS) en de PDOK
luchtfoto. Geschat zijn de afmetingen van de dakopstanden en de hoogte van de
lage rand (op 0,5 m afgelezen). Weggelaten: de verdiepte terrassen en vijvers
aan de zuidzijde (negatief reliëf, in het AHN zonder meetwaarden), de
ondergrondse museumdelen, de gekleurde gevelpanelen, de lichtstraten en de
installaties op het dak.
