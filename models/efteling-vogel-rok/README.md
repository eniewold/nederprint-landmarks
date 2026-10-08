# Vogel Rok (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-vogel-rok.glb` | Catalogusbron in meters: nodes `building:hal` (de D-vormige hal met de lage ring langs de ronde noordkant, het lagere zuidelijke deel met borstwering en dakopbouwen en de zuidwestvleugel), `building:koepel` (trommel, kegeldak met dakrand, aanbouw aan de zuidkant, kroon en mast), `building:entree` (decorwand met wolkenrand en wolkenreliëf, het schuine dak erachter, twee rotspieken, de vogel Rok en de tunnel als nis) en `building:wachtrij` (de "grot" achter de wand en de gang naar de hal) |
| `efteling-vogel-rok-1-1000.stl` | Het model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (88,8 × 110,9 × 28,3 mm) |
| `efteling-vogel-rok.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-vogel-rok.mjs`](../../scripts/generate-efteling-vogel-rok.mjs)
(met de gedeelde hulpfuncties uit `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131879,0, 407156,0), in het hart
van de koepel, op het maaiveld rond de hal (NAP +8,4 m), en de
glTF-conventie Y omhoog. +X loopt langs de zuidgevel naar het
oost-noordoosten (11,5 graden tegen de klok in vanaf de RD-X-as), +Y naar het
noord-noordwesten; de zuidgevel met de entree in de zuidwesthoek kijkt naar
−Y. Het maaiveld rond de hal ligt op NAP +8,3 tot +8,9 m en wordt op zes
punten rondom bemonsterd (`groundSamplePoints`: oost, noord, west en tussen
de hal en het restaurant), `groundOffsetMetres` 0; het plein voor de entree
ligt 1,1 m hoger (NAP +9,5 m) en wordt bewust niet bemonsterd. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0809100000017622` (de hal, bouwjaar
1998). Het pand `0809100000017620` (1980) ten zuiden is het restaurantgebouw
met terras en hoort niet bij de attractie, net als `0809100000017623` (1996)
aan de overkant van de weg buiten het park. De entreewand met de vogel en de
wachtrijgebouwen staan niet in de BAG. Carnaval Festival
(`efteling-carnaval-festival`) grenst aan de westgevel van het zuidelijke deel;
het model blijft daar 0,2–0,3 m van af.

Onderdelen (hoogtes boven het maaiveld rond de hal):

- De hal (circa 48 × 88 m): het noordelijke deel als D-vorm om de koepel
  (straal 24 m, plat dak op 9,3 m, AHN NAP +17,7 m), daaromheen een lage ring
  van circa 4 m breed op 5,4 m (AHN +13,8 m) met een uitbouw aan de noordkant;
  het zuidelijke deel plat op 7,9 m (AHN +16,3 m) met een borstwering van
  0,4 m tot 8,65 m langs de zuid- en oostrand, vier luchtbehandelingskasten
  (tot 9,7 m) en een ventilatiekap; de zuidwestvleugel (7,75 m) met een
  installatieplaats achter schermwanden en een opbouw tot 10,6 m.
- De koepel: een trommel met straal 17,3 m tot 13,1 m (AHN NAP +21,5 m), een
  dakrand van 0,3 m op een kraag van 45 graden, het kegeldak met helling 0,69
  (34,6 graden) tot circa 24,8 m, een kroon met vier punten over de kegel (tot
  25,45 m, AHN +33,85 m) en een vierkante mast tot 27,8 m (AHN +36,2 m); de
  rechthoekige aanbouw aan de zuidkant van de kegel tot 13,0 m (AHN +21,4 m).
- De entree in de zuidwesthoek: een decorwand van 21,9 m lang en 0,8 m dik
  langs het plein (naar het zuidwesten), met een bovenrand van wolkbollen die
  het AHN volgt (8,5 tot 11,4 m boven het plein, AHN NAP +18 tot +20,9 m) en
  wolken in reliëf van 0,35 m op de voorkant; daarachter het schuine dak over
  de wachtrij (20 graden) tot het vlakke deel op NAP +15,8 m; grijze
  rotspieken op beide hoeken (8,8 en 9,4 m boven het plein).
- De vogel Rok (spanwijdte circa 23 m, tot 3,4 m voor de wand), zoals hij
  sinds 2018 staat. De twee vleugels zijn wijd gespreid en hoog geheven: de
  linker (noordwest) schuin omhoog naar links, de rechter naar rechtsboven.
  Elke vleugel is een waaier van 9 of 7 brede, puntige slagpennen (platen van
  0,6 m die naar de punt toe tot 1,8 m uitwaaieren), met daarvoor een laag
  armpennen en een rij dekveren langs de bovenrand. De vleugels lopen bij de
  schouder 1,5 m voor de wand en bij de punten tegen de wand. Eén slagpen van
  de linkervleugel loopt tot op de grond. Het lijf is één schuin opgericht
  omhulsel van buik tot schouders. Om de nek zit een dikke veerkraag (een kern
  met een ring van 16 puntige plukken). De hals buigt naar rechts naar de kop,
  met een grote haaksnavel en een kuif van drie puntige veren. De poten zijn
  dikke "broek"-veren met plukken, een korte loop en vier klauwen op de grond,
  met een staartwaaier ertussen. Onder de linkervleugel ligt de tunnel naar de
  wachtrij als blinde nis van 0,5 m met een spitse boog.
- De wachtrijgebouwen: de "grot" achter het noordwestelijke deel van de wand
  (plat, 5,1 m, AHN +13,5 m) en de gang van de entree naar de hal: een blok
  van 4,6 m (AHN +13,0 m), een lessenaarsdak van 4,25 naar 3,3 m (AHN +12,65
  tot +11,7 m) en een lager deel van 3,1 m (AHN +11,5 m).

Printbaar op 1:1000 en 1:500 zonder steun: muren staan recht op, de kegel
loopt onder 35 graden op, de dakrand rust op een kraag van 45 graden, de
veren van de vogel en de wolken liggen tegen de wand of op de laag erachter
met randen van 45 graden en de rotspieken lopen taps toe. Alleen het lijf, de
kraag, de kop en de snavel van de vogel hangen deels vrij. De export vult op
1:1000 5,45 % van de entree op (op 1:500 2,95 %), de koepel 0,01 %, de hal en
de wachtrij niets. De STL
is 49,9 cm³ en één samenhangend deel.

Bronnen: PDOK BAG (het pand), PDOK AHN (DSM en DTM 0,5 m via WCS, als raster
per 0,5 m in het stelsel van de hal en langs de decorwand), de PDOK-luchtfoto
(8 cm), [Wikipedia](https://nl.wikipedia.org/wiki/Vogel_Rok) (gebouw 25 m
hoog) en foto's op
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Vogel_Rok)
(de entree van 1998 tot 2023). Uit het AHN: de voetafdrukken, alle
dakhoogtes, de kegel (hart, helling, rand, kroon en mast), de bovenrand en het
schuine dak van de entree en het maaiveld. Geschat uit foto's: de vorm en maten
van de vogel (vleugelwaaiers, lijf, kraag, kop, poten en staart), de wolkbollen tussen de AHN-punten, de rotspieken en de
tunnel. Het AHN ziet de vogel niet los van de wand (de voorkant van de wand
buigt er hooguit 1–2 m naar voren); in het model steekt hij daarom niet verder
dan 3,4 m uit. De gevels van de hal zijn vlak gelaten (geen foto's; de hal
staat achter bomen), de achtbaan en het ei in de wachtrij zitten binnen.
