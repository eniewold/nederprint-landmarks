# Euroborg (Groningen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `euroborg.glb` | Catalogusbron in meters: nodes `building:stadion` (achthoekige kom met dak en lichtramen) en `building:torens` (de twee kantoortorens) |
| `euroborg-1-1000.stl` | Stadion en torens op 1:1000 met de onderkant (0,5 m onder het plein) op het printbed (206 × 249 × 72 mm) |
| `euroborg-grondplaat-1-1000.stl` | Idem met een grondplaat van 1 mm, omdat de torens los van het stadion staan |
| `euroborg.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (235474,50, 580618,30), in het hart
van de veldopening op het niveau van het plein rond het stadion (NAP +7,2 m),
en de glTF-conventie Y omhoog; +X wijst naar het oosten en +Y naar het
noorden (het veld van 90 bij 125 m ligt precies noord-zuid). Het stadion staat
op een plein dat 5 m boven de omgeving ligt en in het PDOK-terrein zit; het
maaiveld wordt daarom op vier punten op dat plein bemonsterd
(`groundSamplePoints`). Het veld ligt 6,3 m lager dan het plein: de
binnenrand van het model eindigt op het plein, het terrein daalt zelf naar het
veld. Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0014100010953806`
(het stadion, een pand dat het veld als vlak meeneemt),
`NL.IMBAG.Pand.0014100010940730` en `NL.IMBAG.Pand.0014100010982616` (de torens).

Onderdelen (hoogtes boven het plein, uit het AHN-DSM):

- Het dak: negen vlakke facetten tussen de binnenrand (rechthoek van 89,7 bij
  124,2 m met afgeschuinde hoeken, dak op +18,5 m) en de buitenrand (achthoek
  van 206 bij 197 m met een vleugel aan de oostkant, dak op +14 tot +14,6 m,
  +12,7 m aan de noordoosthoek). Het dak daalt dus over 36 tot 67 m met 0,07
  tot 0,13 m per meter naar buiten, met rechte wanden naar het plein.
- Acht lichtramen op de binnenrand van het dak, vier aan elke lange zijde:
  platen van 1,4 m breed en 9 m lang tot +24,3 m (AHN).
- Twee kantoortorens achter het zuideinde op de BAG-contouren van circa 40 bij 35 m
  en 37 bij 20 m, 71,2 m hoog (AHN), met verticale raamstroken van 1,5 m breed
  en 0,35 m diep om de 6 m in de lange gevels (van +3 tot +68 m).

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
85,6 % ligt binnen 1 m en 98,0 % binnen 2 m. De afwijkingen zitten in de
dakrand, de trappenhuizen op het dak, de opbouw op de torens en de plaatsen
waar het DSM op het dak steilere stukken heeft.

Printbaar op 1:1000: alle vlakken boven de onderkant wijzen omhoog of staan
verticaal; alleen de bovenkant van de raamstroken (0,35 m) is vlak. De export
vult op 1:1000 en 1:1500 niets op (0,00 % volume); op 1:2500 komt er 0,75 %
bij rond de lichtramen en 0,17 % bij de torens. Het stadion is één
samenhangend deel met de veldopening als gat (STL 390 cm³), de torens zijn twee
losse delen (47 cm³ elk).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Euroborg) (22.500 plaatsen),
PDOK BAG (de drie panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK
luchtfoto en Wikimedia Commons-foto's. Geschat zijn de breedte en onderlinge
afstand van de raamstroken in de torens (uit foto's). Weggelaten: het plein
zelf, de dakspanten, de trappenhuizen en lichtbakken op het dak, de opbouw op
de torens en de gevelbekleding van het stadion.
