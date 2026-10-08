# Kasteel Heeswijk (Heeswijk)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-heeswijk.glb` | Catalogusbron in meters: node `building:kasteel` (de hoofdburcht met de brug, uit dakvlakken en bouwdelen) |
| `kasteel-heeswijk-1-1000.stl` | De hoofdburcht met de brug op 1:1000 met de onderkant (1 m onder het water) op het printbed (55 × 41 × 32 mm) |
| `kasteel-heeswijk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (158752, 407454), midden in het
hoofdgebouw, op het water van de slotgracht (NAP +5,6 m), en de glTF-conventie
Y omhoog. +X loopt langs de nokken van het hoofdgebouw naar het oostnoordoosten
(13 graden linksom vanaf de RD-X-as, gemeten aan de twee nokken in het AHN) en
+Y loodrecht daarop. Het kasteel staat rondom in de gracht; het maaiveld wordt
op het water bemonsterd (`groundSamplePoints` ten zuiden, westen, oosten en
noorden van het kasteel) en het model begint 1 m onder het water. Als geen van
die punten in de uitsnede valt, gebruikt de lader `groundHeight` 49,59 m (de
ellipsoïdische PDOK-terreinhoogte van het water). Vervangt de PDOK-reconstructie
van `NL.IMBAG.Pand.1721100000001582`; de voorburcht met het poortgebouw en de
trapgevel (`NL.IMBAG.Pand.1721100000001579`) heeft een redelijke LoD2.2-
reconstructie en blijft als PDOK-model staan, net als het torentje op het
voorplein.

Onderdelen (hoogtes in NAP, het water op +5,6 m; 54,5 bij 41,4 m en 32,4 m hoog
met de onderkant):

- Hoofdgebouw in twee evenwijdige delen onder schilddaken: voor (aan de
  binnenplaats, v 2 tot 8,6 m) de nok op v = 5,4 m op +27,0 m, achter de nok op
  v = 15,15 m op +30,5 m (53 graden) met een schild aan de westkant, en
  daartussen een vlakke goot op +23 m. Langs de schuine noordoostgevel een vlak
  van 62 graden en een arm met een dwarsnok naar de noordoosttoren. Vier
  schoorstenen, zeven dakkapellen (op beide delen, op de schuine zijde en op het
  westschild), vensternissen in drie rijen in de west-, noord- en schuine gevel
  en de gevel aan de binnenplaats, en een deur van het terras.
- De ronde noordwesttoren (straal 2,6 m) tot +28,2 m met een kraag en een
  kegelspits van 70 graden tot +37 m; de ronde noordoosttoren (straal 2,3 m)
  tot +27,2 m met een spits tot +35 m.
- De IJzertoren op de zuidwesthoek: een ronde voet (straal 3,8 m) tot +12,6 m,
  een zeskante schacht (apothema 3,25 m), een kraag van 0,8 m onder de dakvoet
  (+25,2 m) en een zeskante spits van 67 graden tot +35,4 m, met een rond
  traptorentje op de noordwesthoek tot +30 m en een spits tot +34 m;
  spitsboognissen in vier zijden.
- Vijf torentjes met een kegelspits: op beide hoeken van het voorste deel en op
  de hoek van de oostvleugel op een kraag, op de noordgevel en aan de oostkant
  vanaf het water.
- De oostvleugel (u 6,3 tot 14,8 m) met de nok op u = 10,5 m (+20,7 m), schilden
  aan beide einden, een lager dwarsdak aan de noordkant (+18,4 m), een erker van
  2,7 m op een kraag aan de zuidgevel, vensternissen en een lage weergang (+7,2
  m) langs de oost- en zuidoostgevel.
- De galerij op de zuidmuur van de binnenplaats: acht traveeën met
  spitsboognissen aan beide kanten en een topgeveltje per travee tot +17 m.
- Het kasteeleiland: de binnenplaats (+11,2 m), het terras aan de brug en de hof
  bij de noordoosttoren, met borstweringen van 0,9 m tot +12,1 m.
- De gemetselde toegangsbrug naar het voorplein (u -37 tot -20,4 m): drie
  spitse bogen dwars door de brug, een dek dat oploopt van +9,6 tot +11,0 m met
  borstweringen van 1 m en het smallere laatste stuk aan de kasteelkant.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde, inclusief de brug): 80,6 % ligt binnen 1 m en 87,7 % binnen 2 m. De
afwijkingen zitten in de punten van de spitsen (het AHN mist ze), de dakkapellen
en de randen van de torens.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal; de kragen
onder de torentjes, de IJzertorenspits en de erker hangen steiler dan 45 graden
en de bogen van de brug hebben een spitse top. De export vult op 1:1000 niets
bij, op 1:1500 0,03 % en op 1:2500 1,2 %. De STL is 16,5 cm³, heeft 4.302
driehoeken en is één samenhangend deel (status NoError, geslacht 0). Dunste
delen op 1:1000: de borstweringen 0,9 mm, de schoorstenen en de brugpijlers
1 mm en de torentjes 1,9 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Heeswijk), PDOK BAG,
PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl; hellingen,
richting en de zeskante spits van de IJzertoren), de PDOK luchtfoto en foto's op
Wikimedia Commons vanaf de zuid-, zuidwest-, zuidoost-, west- en noordwestkant.
Geschat zijn de punten van de spitsen van de torens en torentjes, de plaats van
de torentjes op de hoeken van het voorste deel en de oostvleugel, de erker, de
dakkapellen, de galerij (traveeën en geveltjes), de bogen van de brug en de
vensternissen. Weggelaten: de houten loopbrug aan de oostkant en het houten
balkon aan de brug (dunne planken op palen), de zuilen en pinakels van de
galerij (kleiner dan 0,9 m), de windvanen en de luiken; de voorburcht blijft
PDOK-model.
