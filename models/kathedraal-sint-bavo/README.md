# Kathedrale Basiliek Sint Bavo (Haarlem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kathedraal-sint-bavo.glb` | Catalogusbron in meters: node `building:kathedraal` (schip, dwarsschip en koor onder zadeldaken, de koepel als omwentelingslichaam, de westtorens, de apsis met zeven straalkapellen en het bisschoppelijk huis, opgebouwd uit dakvlakken en bouwdelen) |
| `kathedraal-sint-bavo-1-1000.stl` | De kathedraal op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (109,5 × 69,0 × 58,8 mm) |
| `kathedraal-sint-bavo.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (102902,83, 487903,14), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP +0,5 m), en de
glTF-conventie Y omhoog. +X loopt langs de as van het schip naar het
oostzuidoosten (11 graden met de klok mee vanaf de RD-X-as) en +Y loodrecht
daarop naar het noordnoordoosten. De vorige versie gebruikte -24 graden (de
minimale rechthoek van het BAG-pand, vertekend door de straalkapellen), maar de
nokken en goten in het AHN-DSM liggen op -11 graden: de kerk staat zo recht op
de assen en de bouwdelen volgen de rechte vlakken. De as van het schip ligt op
Y = 3,05 m en de kerk is spiegelsymmetrisch om die lijn (in het script is
y = Y - 3,05). De torens staan in het westen (X -45 tot -35 m), het dwarsschip
op X = 1,97 m en de apsis in het oosten rond X = 30 m (de kapellen tot
X = 54 m). Het maaiveld (NAP +0,4 tot +0,5 m) wordt op vier punten op open grond
bemonsterd (`groundSamplePoints`: west, zuid, noord en oost, op 38 tot 62 m van
de oorsprong; de oude punten lagen in de nieuwe assen op een boom en op het dak
van het bijgebouw). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0392100000020499`.

Onderdelen (hoogtes boven het maaiveld, alle maten uit vlakfits op het AHN-DSM
0,5 m en de radiale hoogteprofielen; het model is geen hoogteveld maar een
opbouw uit dakvlakken, prisma's, omwentelingslichamen en convexe omhullenden):

- Schip, dwarsschip en koor: drie gelijke zadeldaken met een helling van 50,5
  graden (1,21 m per m; vlakfits geven 1,206 tot 1,225 op de schip- en
  dwarsschipvlakken, rms 0,04 tot 0,16 m), een nok op +32,15 m en goten op
  +22,5 m (halve breedte 7,95 m; de zuidgoot ligt 0,35 m verder). Het schip loopt
  van X -43,5 m (westgevel) tot X 30,05 m (oostgevel boven de apsis), het
  dwarsschip van X -6,0 tot 10,1 m en van Y -20,3 tot 24,55 m, met de nok op de
  as X = 1,97 m. De nok ligt over de hele lengte horizontaal (32,15 m).
- Zijbeuken: vaste halve dwarsprofielen als lessenaarsdaken. De binnenbeuk heeft
  een plat stuk op +18 m (3,4 m breed) en een dak dat tot de goot op +16,4 m
  loopt; de buitenbeuk hangt daaronder van +10,7 m naar de goot op +7,1 m
  (helling 31 graden, vlakfit rms 0,07 m). In het koor loopt de noordzijde met
  een lang lessenaarsdak (+18 tot +15,6 m) door tot Y 24,2 m, de zuidzijde heeft
  een lagere buitenbeuk (+11,4 tot +10 m).
- Twee westtorens van 10 m breed tot +30 m die daarboven versmallen tot 8,8 m
  onder een platte top op +53,5 m (AHN: 53,4 m, tot 9 m vlak); hun hartlijnen
  liggen op Y = 3,05 +/- 11 m. Ertussen een portaalwand met een omloop op +21,5 m
  en de wand tot de topgevel op +26,8 m, daarvoor het westwerk: een zadeldak
  langs Y (nok +8,9 m) met drie dwarsdaken (middelste nok +10,1 m, de zijdaken
  +8,9 m op de torenassen) en twee hoektorentjes (+9,4 m). Ten zuiden van de
  zuidtoren staat een portaal met een zadeldak (nok +11,2 m), ten noorden de
  ronde doopkapel (straal 4,7 m, kegeldak tot +15,2 m) en de lage verbindingsbouw
  (+3,7 m).
- Koepel boven de viering: een omwentelingsprofiel uit het gemiddelde radiale
  DSM-profiel (mediaan over de hoeken, de torentjes uitgezonderd) met een
  voetstuk van 8,5 m straal op +30,5 m, de trommel van 7,65 m straal tot +41,6
  m, het spitsboogvormige gewelf (6,5 m straal op +44,75 m, 4 m op +50,5 m, 2 m
  op +53,9 m) en de lantaarn met de bol op +58,3 m (afgeknot op 0,9 m breed; het
  AHN geeft met het kruis +59,8 m). Rond de koepel vier torentjes (straal 1,9
  m, kap tot +36,4 m) op de hoeken van de viering.
- Torentjes met een bolle kap op de vier hoeken van de dwarsschipgevels (straal
  2,0 m, kap tot +31,4 m) en vier slanke torens aan de oostgevel van het
  schip (straal 1,55 tot 1,8 m, tot +25,4 m en +30,7 m). Voor de noordgevel van
  het dwarsschip een voorportaal met een steil dak (van +8,9 tot +22 m tegen de
  gevel), aan de zuidzijde twee zadeldaken (nokken +10,3 m en +10,4 m) en een
  zuidvleugel met een zadeldak langs X (nok +10,2 m).
- Apsis: een halve cilinder van 8 m straal tot +20 m onder een kegeldak met een
  helling van 47,7 graden (z = 28,8 - 1,1 r, vlakke fout 0,02 tot 0,04 m rond
  X = 30,0 m) en een spits tot +31,4 m. Daaromheen zeven straalkapellen (hartlijnen
  elke 25,7 graden) met een horizontale nok op +13,3 m, dakvlakken onder 45 graden
  naar de goten (+12,3 tot +9,7 m) en een kegelvormig uiteinde (straal 3,8 m,
  tot +8,7 m); de middelste is langer (nok tot X = 50,6 m, de andere tot 16,4 m
  van de apsisas). Tussen de kapellen zes steunberen van 2,2 m breed met een
  kop die van +20,2 m naar +13,2 m afloopt en een pinakel op +16,3 m, en twee
  hoektorentjes met een kegeldak (+17,9 m) naast de middelste kapel.
- Bisschoppelijk huis (zuidoostelijk deel van hetzelfde BAG-pand): een hoofdvolume
  met een plat dak op +14,3 m en een schuine zuidrand, een westvleugel met een
  zadeldak (nok +15,2 m), een schilddak met een nok op +17,1 m, een ronde hoektoren
  (straal 2,5 m, +18,1 m) en lagere delen op +4,4 tot +12,4 m.

Het gebouw ligt op 6 m² na binnen 0,3 m van de BAG-contour (5114 m²), dus een
afsnijding met het contourprisma is niet nodig.

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m
waar beide een waarde hebben): 85,2 % ligt binnen 1 m en 92 % binnen 2 m; op de
dakvlakken zelf (helling onder 3, dus zonder wanden en randcellen) 96,2 %
binnen 1 m en 99,3 % binnen 2 m. De afwijkingen zitten in de randcellen langs
wanden (torens, beukwanden: de goot is op 0,5 m cellen een halve cel onscherp)
en bij de steunberen en pinakels, die voor het AHN te dun zijn.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal (de controle
op ondervlakken onder 45 graden slaagt zonder `--allow-overhang`), alle
onderdelen staan op dezelfde onderkant (-0,5 m) en er zijn geen smalle spleten
meer tot op de bodem (de doorsnede op 2 m hoogte heeft geen gaten). De export
vult op 1:1000 en 1:1500 niets op (0,00 % volume); op 1:2500 komt er 0,6 % bij.
De STL is 102,4 cm³ en het model één samenhangend deel (genus 0).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kathedrale_basiliek_Sint_Bavo)
(kruiskoepelkerk, halfronde apsis met straalkapellen, torenkruinen nooit
voltooid), foto's op Wikimedia Commons (RCE, de westgevel, het koor en de
dwarsschipgevels), PDOK BAG (het pand), PDOK AHN (dsm en dtm 0,5 m via WCS) en
de PDOK luchtfoto. Geschat zijn de kapel- en torenkappen, de steunbeerhoogtes
en het voorportaal van het dwarsschip (het DSM heeft op de leien daken en de
steile wanden gaten) en de lagere delen van het bijgebouw. Weggelaten: de
dakkapellen, de kantelen en nissen van de torens (de middenvlakken van de
torenwanden zijn tot 1,3 m teruggezet), de vensters, de nokkammen, de steunberen
van de buitenbeuken (0,6 tot 1,2 m breed) en alle gevelreliëf onder 0,9 m.
