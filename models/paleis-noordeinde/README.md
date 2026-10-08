# Paleis Noordeinde (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `paleis-noordeinde.glb` | Catalogusbron in meters: nodes `building:paleis` (het paleis uit dakvlakken en bouwdelen) en `building:hekpijlers` (de zes pijlers van het hek langs het Noordeinde) |
| `paleis-noordeinde-1-1000.stl` | Paleis en hekpijlers op 1:1000 met de onderkant (NAP 0 m) op het printbed (107 × 104 × 29 mm) |
| `paleis-noordeinde.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (80913,2, 455283,4), het zwaartepunt
van het BAG-pand midden in het paleis achter het hoofdgebouw, op het maaiveld
van de binnenplaats aan de tuinzijde (NAP +1,5 m), en de glTF-conventie Y
omhoog. +X loopt langs de voorgevel naar het zuidoosten (-54,36 graden vanaf de
RD-X-as, de richting van de BAG-gevels en van de nokken van de achtervleugels;
evenwijdig aan het Noordeinde) en +Y loodrecht daarop naar het Noordeinde. Het
maaiveld wordt op de binnenplaats aan de tuinzijde bemonsterd
(`groundSamplePoints`, NAP +1,5 m); het voorplein ligt op NAP +2,4 m en de tuin
ten westen van de linker achtervleugel op NAP +0,5 m, daarom begint het model
op NAP 0 m (1,5 m onder de binnenplaats). Als geen van die punten in de
uitsnede valt, gebruikt de lader `groundHeight` 44,9 m (de laagste
ellipsoïdische PDOK-terreinhoogte op die punten). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0518100000279145` (het hele paleis met
de achterbouw) en `NL.IMBAG.Pand.0518100001640004` (het rechter tuinpaviljoen,
1814, dat de rechter achtervleugel afsluit); de buurpanden aan weerszijden van
het voorplein, de Koninklijke Stallen en de Koepel van Fagel blijven PDOK.

Onderdelen (hoogtes in NAP, 107,2 bij 103,9 m en 29,3 m hoog met de onderkant):

- Hoofdgebouw aan het voorplein (twee bouwlagen, kroonlijst +14,8 m die 0,7 m
  uitkraagt): schilddak met de nok op +23,3 m (55 graden voor en achter, 59
  graden op de schilden, nok van u -18,75 tot 17,85 m), een fronton over de
  middelste drie traveeën (top +16,9 m), negen pilasters van 0,7 m op een ritme
  van 3,3 m, vensternissen in twee lagen met een spitse bekroning, het portiek
  met balkon (9,8 bij 4,7 m, dek +7,5 m, balustrade tot +8,6 m) met drie
  doorgangen, en twee schoorstenen tot +26,2 m.
- Vleugels om het voorplein (kroonlijst +14,8 m): links een zadeldak van 21
  graden (nok +16,4 m) en rechts vleugel A gespiegeld (nok +16,5 m), elk met
  arcadebogen op de begane grond, vensters erboven en een fronton aan de kop op
  het Noordeinde (+16,9 en +17,1 m); rechts daarnaast een breder deel met een
  plat dak (+16,7 m) en een blok met een schilddak (nok +16,85 m).
- Daarachter het platte dak op +19,45 m met een opbouw (+24,4 m) en de
  luchtbehandelingskasten, en het middenblok met een afgeknot schilddak van 53
  graden (links 70 graden) tot een plat vlak op +25,75 m met twee schoorstenen
  (+28,6 en +29,3 m, het hoogste punt).
- Achterbouw van vier bouwlagen (kroonlijst +19,45 m die 0,5 m uitkraagt) met
  afgeknotte schilddaken van 42,6 graden en een plat bovenvlak op +22,45 m: de
  dwarsvleugel, de linker en rechter achtervleugel, het linker tuinpaviljoen en
  het rechter tuinpaviljoen met een zadeldak (+22,4 m), de aanbouwen langs de
  binnenplaats, negen schoorstenen (+23,9 m) en vensternissen in vier lagen; de
  middenrisaliet aan de binnenplaats met vier reuzenpilasters en een attiek met
  drie balustradevelden (+22,0 m).
- Lage delen naast de rechter achtervleugel (+14,4, +8,8 en +7,5 m), de
  lichthof (+3,2 m) en een erker aan de tuinzijde (+14,3 m).
- Zes hekpijlers van 1,2 m langs het Noordeinde (tot 4,8 m boven het voorplein
  met een vaas als spits).

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 86,9 % ligt binnen 1 m en 93,0 % binnen 2 m. De afwijkingen zitten
in de smalle stroken op kroonlijsthoogte langs de binnenplaats en de buitenkant
van de rechter achtervleugel en in de schoorstenen en installaties.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
kroonlijsten (53 tot 58 graden) en de spitse bekroningen van de nissen (54 tot
60 graden) na. De export vult op 1:1000 en 1:1500 niets bij en op 1:2500 0,6 %
(de hekpijlers 2 %). De STL is 92,3 cm³ en heeft 9.902 driehoeken; het paleis is
één samenhangend deel (status NoError, geslacht 0), de hekpijlers zijn zes losse
delen. Dunste delen op 1:1000: de vazen op de pijlers 0,9 mm, de schoorstenen en
de zuilen van het portiek 1,0 mm en de pijlers 1,2 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Paleis_Noordeinde), PDOK
BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK
luchtfoto en foto's op Wikimedia Commons van het voorplein vanaf het Noordeinde
en schuin vanuit de noordhoek en van de binnenplaats aan de tuinzijde. Geschat
zijn de pilasters, vensternissen en arcadebogen (ritme van 3,3 m van de foto's
en de BAG-gevel), de reuzenpilasters en de velden van de attiek, de doorgangen
van het portiek, de frontons aan de koppen van de vleugels en de vorm van de
hekpijlers. Weggelaten: het ruiterstandbeeld van Willem van Oranje (staat op de
straat, niet bij het paleis), de hekken en de poort met de kroon tussen de
pijlers en de vazen op de balustrades (dunner dan 0,9 m), de schilderhuisjes
(los straatmeubilair van circa 1 m), de vlaggenmast, de luiken en de antennes
en dakramen op de platte daken.
