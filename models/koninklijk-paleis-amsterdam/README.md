# Koninklijk Paleis (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `koninklijk-paleis-amsterdam.glb` | Catalogusbron in meters: node `building:paleis` met het blok met gevelreliëf, de daken, de frontons met de beelden en de koepeltoren |
| `koninklijk-paleis-amsterdam-1-1000.stl` | Het paleis in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (66 × 81 × 60 mm) |
| `koninklijk-paleis-amsterdam.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121232,11, 487368,47), in het
midden van de BAG-contour (midden in de Burgerzaal), op het maaiveld (NAP
+1,8 m) en de glTF-conventie Y omhoog. +X loopt naar de voorgevel aan de Dam
(`xAxis` (0,99939, -0,0349), RD-richting -2,0 graden, net ten zuiden van
oost, de richting van de BAG-gevels), +Y naar het noorden, naar de Nieuwe
Kerk. De koepeltoren staat aan de Damzijde boven de voorgevel, Atlas op het
fronton van de achtergevel aan de Nieuwezijds Voorburgwal. Het maaiveld
wordt op vier punten bemonsterd (`groundSamplePoints`, NAP +1,8 tot +2,4 m:
de Dam, de Nieuwezijds Voorburgwal en de straten langs de noord- en
zuidgevel); `groundOffsetMetres` is -0,3. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0363100012167579`.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel
langs de gevels):

- Het blok van 80,2 bij 57,4 m binnen de BAG-contour, met de hoekpaviljoens
  die 1,1 m voor de gevels springen en de middenrisalieten van 25,3 m breed
  aan de Dam en de Nieuwezijds Voorburgwal (5 m voor de gevel), tot de
  kroonlijst op +28,3 m die rondom 0,3 m uitkraagt.
- Het rondgaande schilddak van de vier vleugels met de nokken op +33,7 m
  (4,8 m achter de oost- en westgevel, 6,1 m achter de noord- en zuidgevel),
  achttien schoorstenen tot +37,4 m (vijf op de noord- en de zuidnok, vier
  op de oost- en de westnok) en de kroonornamenten op de vier hoeken tot
  +39 m.
- De Burgerzaal tussen de binnenplaatsen: muren tot +30 m en een gebroken
  zadeldak (knik op +33,7 m, 6 m uit de as, nok op +35,8 m) van de
  dwarsvleugel aan de achterkant tot de koepeltoren, met de galerijen ernaast
  tot +28,3 m; de dwarsvleugel naar de achtergevel tot +33,75 m.
- Lessenaarsdaken rond de twee binnenplaatsen van +22 m naar +17,5 m; de
  binnenplaatsen (20,5 bij 12 m) zijn open tot een vloer op +2,75 m, na de
  verschuiving van -0,3 m 0,45 m boven het AHN-maaiveld (NAP +2,0 m).
- De frontons op beide risalieten met de top op +33,3 m, de Vrede tot +37 m
  aan de Dam, Atlas met de hemelbol tot +41,4 m aan de achterzijde en de
  hoekbeelden tot +31,8 m.
- Gevelreliëf rondom, uit frontale foto's van de Damgevel, de achtergevel en
  de zijgevels geschaald op de kroonlijst en de BAG-gevellengtes: pilasters
  van 1 m (0,9 m in de smallere geveldelen) op de gevellijn van de
  BAG-contour, met de velden ertussen 0,3 m terug in twee ordes boven de plint
  (+7,6 tot +17,3 m en +18,6 tot +26,6 m, bovenkant onder 53 graden); de
  tussenlijst (+17,3 tot +18,6 m) springt 0,3 m uit met een schuine
  onderkant van 53 graden. Per travee zijn de vensters blinde nissen van
  0,35 m diep met een vlakke bovenkant: een kelderraam in de plint (+4,4 tot
  +6,6 m), en per orde een hoog venster (+8,7 tot +12 m en +19,3 tot
  +22,4 m, 1,5 tot 1,7 m breed) en een mezzaninevenster (+13,9 tot +15,4 m en
  +24 tot +25,4 m, 1,6 m breed). De Dam en de achtergevel hebben elk 23
  traveeën (hoekpaviljoen 3, gevel 5, risaliet 7, gevel 5, hoekpaviljoen 3),
  de zijgevels 15 (hoekpaviljoen 3, smal tussenstuk 1, middendeel 7,
  tussenstuk 1, hoekpaviljoen 3), met in elk tussenstuk een smal venster en
  twee ronde vensters (oeils-de-boeuf) met een spitse bovenkant van 50
  graden. Samen 373 vensternissen en 8 ronde vensters; in de risaliet aan de
  Dam zitten in plaats van kelderramen de zeven poortbogen, 1,7 m breed en
  0,6 m diep met een spitse bovenkant van 60 graden. Op 1:1000 is dat 0,3
  mm voor de velden en de tussenlijst en 0,65 mm voor de vensters.
- De koepeltoren boven de voorgevel (hart 22,9 m voor het midden): de
  vierkante voet van 11,5 bij 11 m tot +36,2 m, de achtkantige omgang tot
  +41 m, de achtkantige trommel van 9,8 m met de bogen van het klokkenspel
  als nissen tot +49,6 m, de kroonlijst tot +50,4 m, de koepel tot +53,2 m,
  de lantaarn tot +56,2 m en de naald met de windvaan (de kogge) tot
  +61,2 m, 59,4 m boven het modelmaaiveld en 58,8 m boven de Dam.

Binnen de voetafdruk ligt 85,6 % van de DSM-cellen binnen 2 m van het model
(77,2 % binnen 1 m, mediaan +0,07 m); buiten de binnenplaatsen 87,4 %, in de
binnenplaatsen 70,2 % (mediaan +0,7 m, de vloer; de afwijkingen zitten in de
randcellen langs de lessenaarsdaken). De koepeltoren
ligt voor 69,5 % binnen 2 m (mediaan 0 m); het DSM van de open trommel, de
omgang met beelden en de lantaarn verspringt per cel. Het hoogste AHN-punt
ligt op +61,4 m bij de windvaan. Het gevelreliëf verandert
dat niet (opnieuw gemeten: 85,4 % binnen 2 m, mediaan +0,08 m).

Printbaar op 1:1000 zonder steun: de gevels staan recht op, de daken lopen
onder 33 tot 50 graden omhoog, elke geleding van de toren is smaller dan de
vorige, de schoorstenen en beelden zijn minstens 1 m dik, de naald 0,9 m,
en de poortbogen en de bogen in de trommel zijn nissen met een spitse
bovenkant van 60 graden; de bovenkant van de velden en de onderkant van de
tussenlijst lopen onder 53 graden. Alleen de kroonlijst kraagt rondom 0,3 m
vlak uit en de vensternissen hebben een vlakke bovenkant van 0,35 m diep;
het script controleert dat geen ander vlak boven de onderkant naar beneden
wijst, dat de nisbovenkanten per hoogte niet groter zijn dan breedte maal
0,4 m per nis en dat alles op dezelfde onderkant begint. Het ondervlak
groeide door het gevelreliëf van 92 m² (alleen de kroonlijst) naar 298 m²
(206 m² nisbovenkanten op vijf hoogtes). Het paleis gaat als gesloten solid
met overhangopvulling door de export, zodat de nissen en de open
binnenplaatsen behouden blijven: een uitsnede van 200 m op 1:1000 duurt
circa 3,3 seconden, waarvan 1,7 voor de opvulling van het paleis (121,8 naar
126,0 cm³, vooral de voet tot de onderplaat, de strook onder de kroonlijst
en wiggen van 0,35 mm onder de nisbovenkanten; zonder reliëf 1,7 seconden
en 123,1 naar 127,3 cm³), en het vervangen pand zit niet meer in de
export. Het maaiveld van het model ligt 0,3 m (noord, zuid
en west) tot 0,8 m (Dam) onder het PDOK-maaiveld rondom, de onderkant 1,3
tot 1,8 m; de vloer van de binnenplaatsen ligt 0,3 tot 0,6 m boven het
PDOK-terrein daar.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Paleis_op_de_Dam)
(stadhuis van Jacob van Campen, 1648-1665, met twee binnenplaatsen, de
Burgerzaal, Atlas en de koepel met de windvaan in de vorm van een kogge),
het [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/5941)
(monument 5941), PDOK BAG (contour met de twee binnenplaatsen), PDOK AHN (dsm
en dtm 0,5 m via WCS: goot en nokken van de daken, de Burgerzaal, de
frontons, de beelden, de schoorstenen, de omhullende van de koepeltoren per
hoogte en het maaiveld), de PDOK-luchtfoto, een frontale foto van de
voorgevel op Wikimedia Commons (Royal Palace of Amsterdam.jpg) en foto's van
de achtergevel en de zijgevels van de RCE op Wikimedia Commons (20528557,
20011607 en 20011608). Geschat zijn de vloer van de binnenplaatsen
(0,45 m boven het AHN), de lessenaarsdaken, de grenzen tussen voet, omgang en trommel van de toren en
de vorm van de koepel en de lantaarn (uit het AHN en de verhoudingen op de
foto), de naald boven de windvaan, de maten van de beelden, schoorstenen en
kroonornamenten, de poortbogen, en het gevelreliëf: de hoogtes en breedtes
van de vensters, de plint, de tussenlijst en de pilasters uit de frontale
foto van de Damgevel (op de achter- en zijgevels overgenomen), de indeling
van de zijgevels uit twee schuine foto's, de diepte van de velden (0,3 m) en
de nissen (0,35 m) als printbare maat, niet gemeten; dakkapellen, de
balustrades, de kapitelen en guirlandes, de klokken, de ingang aan de
achtergevel en de beeldhouwwerken in de frontons zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
