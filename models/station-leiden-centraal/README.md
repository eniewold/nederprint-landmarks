# Station Leiden Centraal (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `station-leiden-centraal.glb` | Catalogusbron in meters: nodes `building:stationshal`, `building:perronkappen` en `building:spanten` |
| `station-leiden-centraal-1-2000.stl` | Hal, spanten en perronkappen in één stuk op 1:2000, met de onderkant (0,5 m onder het maaiveld) op het printbed (175,0 × 54,0 × 11,1 mm) |
| `station-leiden-centraal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93084,9, 464616,2), het
zwaartepunt van de BAG-contour van de stationshal, op het maaiveld van het
Stationsplein (NAP +0,9 m), en de glTF-conventie Y omhoog. +X loopt langs de
sporen naar het noordoosten (RD-richting 50 graden, richting Haarlem); +Y
wijst naar het noordwesten, naar de zeezijde. Het maaiveld wordt op het
Stationsplein aan de centrumzijde bemonsterd (`groundSamplePoints`, AHN NAP
+0,8 tot +1,0 m). `groundOffsetMetres` is 0, want alles begint al 0,5 m onder
het maaiveld. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0546100000051298` (de stationshal).

Onderdelen (hoogtes in NAP; het spoor ligt op circa NAP +5,3 m):

- De stationshal binnen de BAG-contour: de grote glazen kap over de sporen
  als flauw zadeldak met de nok dwars op de sporen (+19,2 m) en de goten op
  +13,0 en +13,5 m, 56 m breed langs de sporen; het deel aan de centrumzijde
  met de gebogen gevel, plat op +13,3 m met een middenstrook van 8 m tot
  +16 m; de lage delen ernaast tot +6 m.
- De acht vakwerkspanten boven de glazen kap (AHN en luchtfoto), 1,8 m
  breed: aan beide kanten van de hal twee paar als pijlpunten vanaf de punten
  van de perronkappen van spoor 4-5 en 8-9 (35,6 m ten zuidwesten en 42,5 m
  ten noordoosten van de oorsprong) schuin omhoog naar weerszijden van de nok,
  van +11 m bij de punt tot +22,5 m; ze steken 2 tot 3 m boven het glas uit.
- De drie perronkappen langs de sporen (profiel, per blok van 20 m in het AHN
  gelijk): langs spoor 1 en 2 (7 m breed, +10,4 m) van 150 m ten zuidwesten
  van de hal tot de hal, langs spoor 4 en 5 (12 m breed, +10,3 m) van 150 m
  ten zuidwesten tot 200 m ten noordoosten, en langs spoor 8 en 9 (11 m
  breed, +10,5 m) tot 153 m ten noordoosten; de lengtes zijn ook op de
  luchtfoto nagemeten. De kappen zijn geen BAG-pand en staan dus niet in de
  PDOK-gebouwtegels. Buiten de hal hebben ze een parapluprofiel: een dak van
  0,6 m op een middenwand van 1,8 m (de kolommen), met de onderkant onder 45
  graden naar de wand.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 90 % van
de circa 54.000 DSM-cellen binnen 2 m (80 % binnen 1 m, mediaan -0,04 m); de
afwijkingen zitten in de randen van de kappen, de spanten en glasribben van de
kap over de sporen en de gebogen gevel aan de centrumzijde.

Printbaar zonder steun: de hal is dicht tot de onderkant (de kap over de
sporen is in werkelijkheid open), de spanten staan op de kap en de
perronkappen, de onderkant van de perronkappen loopt onder 45 graden naar de
middenwand en er kraagt niets uit. Met overhangopvulling
komt er niets bij: de STL op 1:2000 blijft 15,0 cm³ (de middenwand is daar
0,9 mm, net boven de minimale steunbreedte van 0,8 mm) en op 1:1000
119,9 cm³. In de preview van de
controle-uitsnede (226 m) en van een uitsnede van 377 m rond het hele model
staan hal en kappen op het maaiveld en zit het vervangen pand niet meer in de
export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Station_Leiden_Centraal)
(stationshal van 1996 met de hoger gelegen perrons), PDOK BAG (de contour van
de stationshal), PDOK AHN (dsm en dtm 0,5 m via WCS: het dwarsprofiel van de
kap over de sporen, het deel aan de centrumzijde, de perronkappen per blok,
het spoorniveau en het maaiveld) en de PDOK luchtfoto. Geschat zijn de
grenzen van de delen binnen de hal en de breedte van de spanten.
Vereenvoudigd: de kap over de sporen is een dicht zadeldak zonder de
glasribben, de spanten zijn dichte wanden in plaats van vakwerk en lopen
recht, de kolommen van de perronkappen zijn één doorgaande wand, de perrons
zijn weggelaten en de gebogen gevel met de overkapping aan het Stationsplein
volgt de BAG-contour.
