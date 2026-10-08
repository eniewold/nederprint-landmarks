# Cunerakerk (Rhenen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `cunerakerk.glb` | Catalogusbron in meters: node `building:kerk` (de kerk uit dakvlakken en bouwdelen, met de Cuneratoren) |
| `cunerakerk-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (62 × 36 × 82 mm) |
| `cunerakerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (167186,79, 440957,91), het
gezamenlijke zwaartepunt van kerk en toren, op het maaiveld aan de zuidzijde
(NAP +11,5 m), en de glTF-conventie Y omhoog. +X loopt langs de as van het
schip naar het oosten (5,75 graden met de klok mee vanaf de RD-X-as) en +Y
loodrecht daarop naar het noorden; de toren staat in het westen. Het maaiveld
wordt op vier punten aan de zuidzijde bemonsterd (`groundSamplePoints`, NAP
+11,5 tot +11,8 m); aan de noordzijde ligt het terrein 2 m hoger, dus daar zit
de voet iets in de grond. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0340100000331050` (de kerk) en `NL.IMBAG.Pand.0340100000332237`
(de toren).

Onderdelen (hoogtes boven het maaiveld op NAP +11,5 m, 61,8 bij 36,1 m en
82,3 m hoog met de onderkant): het model is een laatgotische hallenkerk met een
dwarsschip en een enkel koor, opgebouwd uit bouwdelen met rechte dakvlakken
z = a u + b v + c. Nokken, goten en hellingen komen uit het AHN en uit de
LoD2.2-vlakken van de 3D BAG (die op de leien daken, waar het DSM gaten heeft,
de hoogtes en de hellingen van 55 en 60 graden geven); de bouwdelen worden
met Manifold verenigd, zodat de dalen en de schilden vanzelf ontstaan.

- Middenschip en koor: één langsdak met de nok op v = 0,26 m (+21,1 m, NAP
  +32,6 m) en vlakken van 60 graden, van de toren (u -18 m) tot de sluiting
  (u 29,8 m). Het schip is 7,4 m breed op de dalgoot (+14,7 m), het koor 9,2 m
  breed (v -4,35 tot +4,87 m) met de gootrand op +13,1 m. De driezijdige
  sluiting (oostmuur 2,8 m, schuine zijden 4,1 m) heeft drie vlakken van 60
  graden vanaf een gootrand op +14,2 m; de nok eindigt op u = 25,8 m.
- Zijbeuken (zuid v -16,4 tot -3,3 m, noord v 3,3 tot 13,4 m, u -17,1 tot 7,84
  m): per kant drie dwarsdaken met de nok langs v op u = -13,2, -6,28 en +2,6 m,
  op +18,4, +19,9 en +21,1 m en 55 graden helling (de beide zijden zijn gelijk).
  Ze eindigen in een schild tegen de buitengevel: het vlak rijst vanaf een
  vlakke goot van 0,8 m langs de gevel op +14,7 m, de hoogste nok eindigt op
  v = -11,16 en +8,16 m. Tegen elkaar en tegen het schip liggen vlakke
  dalgoten van 0,7 tot 0,9 m op +14,7 m.
- Dwarsschip (u 7,6 tot 16,15 m): nok langs v op u = 11,5 m (+21,1 m), 60 graden,
  met topgevels op v = -16,4 en +17,3 m (de nok loopt door tot aan de gevel); aan
  de oostkant loopt het dak langs het koor door tot u = 17,4 m. Op de viering
  staat een dakruiter: achtkant van 4,0 m breed op +18 m, 2,4 m op +24 m,
  spits tot +29 m.
- Steunberen (1,1 m breed, 1,8 m diep, bovenkant +14,2 m tegen de muur en
  +12,7 m aan de buitenkant) op de dalgoten van de zuid- en noordgevel (u =
  -10,25, -2,25 en +7,25 m), elk met een pinakel van 1,0 m tot +17,4 m;
  hoeksteunberen op de zuidwesthoek, de zuidoosthoek van het dwarsschip en
  tegen de westmuur (2), en vijf kleinere (tot +11,8 m) rond het koor en de
  sluiting. Het zuidportaal (4,8 bij 2,4 m, zadeldak langs v met de nok op
  +7,8 m, 60 graden) staat voor de eerste travee.
- Aanbouwen: de sacristie in het zuidoosten (u 16 tot 23,1 m, nok langs u op
  +6,8 m) met een bijgebouwtje, de aanbouw in het noordoosten (nok +13,4 m, 60
  graden) met een achtkantige trapspil van 3,2 m en een spits tot +17,7 m, en
  de trapspil in de noordwesthoek met een lessenaarsdak.
- Cuneratoren (u -29,35 tot -16,9 m, v -5,5 tot +7,2 m, op de torenas u = -23,1
  m, v = 0,75 m): onderbouw van 12,45 bij 12,7 m tot +22,5 m; vier diagonale
  hoeksteunberen (ruiten van 3,1 m die in vier stappen terugtrappen tot 1,8 m
  en in een spits op +29,5 m eindigen); een tweede geleding van 11,6 bij 11,1 m
  tot +44,7 m met vier hoekpinakels (1,5 m, tot +52,2 m); een achtkantige
  lantaarn van 10,0 m (+44,6 tot +54 m) en 9,0 m (tot +62 m) over de platte
  zijden; en een naaldspits die van 8,5 m op +62,8 m via 5,0 m op +68 m, 2,8 m op
  +72 m en 1,5 m op +76 m versmalt tot 0,9 m op +81,8 m (volgens Wikipedia is de
  toren 81,8 m).
- Vensternissen als spitsbogen, 0,9 m diep: 12 in de tweede geleding (1,4 m
  breed, +27 tot +40,5 m), 2 in de onderbouw (3,0 m), 4 (2,6 m) en 8 (1,4 m) in
  de lantaarn, en 10 in de kerk (de gevels van de tweede en derde travee, de
  topgevels, het koor en de sluiting).

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): voor de kerk (u > -16,5 m, 3.000 cellen) ligt 84,4 % binnen 1 m en
90,3 % binnen 2 m; zonder de randcellen langs gevels en nokken 92,6 % en 96,2 %.
Tegen de LoD2.2-dakvlakken van de 3D BAG, die ook de leien daken dekken (4.900
cellen op 0,5 m): 91,7 % binnen 1 m en 93,8 % binnen 2 m. Het model dekt 94 %
(kerk) en 99 % (toren) van de BAG-contouren; de rest is vooral het verhoogde
terras langs de noordgevel (74 m²), dat niet is gemodelleerd. Op de toren is
het DSM te vol gaten en te onzeker op de randen voor een celvergelijking; de
omtrek per hoogte komt binnen 0,5 m overeen (lantaarn 10,0 en 9,0 m, spits 8,5
m op +62,8 m en 5,0 m op +68 m) en het AHN-maximum van +77 m valt in de spits,
die tot +81,8 m doorloopt (de naald is voor het AHN te dun).

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen van de vensternissen na (59 graden, dus steiler dan 45 graden), en
alles staat op het maaiveld. De export vult op 1:1000 en 1:1500 0,02 % bij en op
1:2500 0,63 %. De STL is 29,5 cm³, heeft 2.254 driehoeken en is één samenhangend
deel (status NoError, geslacht 0). Dunste delen op 1:1000: pinakels en
steunberen 1,0 mm, de nissen 1,4 mm breed en 0,9 mm diep, de spits 1,5 mm op +76
m en 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Cunerakerk_%28Rhenen%29)
(torenhoogte 81,8 m, hallenkerk met dwarsschip en enkel koor), PDOK BAG (de twee
panden), PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl) en de
PDOK luchtfoto (die door de scheefstand alleen de bouwdelen en hun volgorde
geeft, de maten komen uit het DSM en de 3D BAG). Geschat zijn de geledingen en
niveaus van de toren boven +22,5 m (de niveaus +44,7 en +62 m volgen de
LoD2.2-vlakken, de breedtes het DSM), de aanbouwen, de steunberen en pinakels,
de dakruiter (+29 m) en de vensternissen. Weggelaten: het maaswerk, vensters
onder 0,9 m, de gootlijsten, de trappen en het terras langs de noordgevel.
