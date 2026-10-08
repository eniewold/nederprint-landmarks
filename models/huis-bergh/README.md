# Huis Bergh ('s-Heerenberg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `huis-bergh.glb` | Catalogusbron in meters: node `building:kasteel` (het hoofdkasteel uit dakvlakken en bouwdelen) |
| `huis-bergh-1-1000.stl` | Het hoofdkasteel op 1:1000 met de onderkant (6,2 m onder het eiland, in de gracht) op het printbed (37 × 53 × 35 mm) |
| `huis-bergh.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (213827, 432079), midden in het
hoofdkasteel, op het maaiveld van het kasteeleiland (NAP +19,8 m), en de
glTF-conventie Y omhoog. +X loopt langs de noordvleugel naar het oostnoordoosten
(21 graden linksom vanaf de RD-X-as, gemeten aan de normalen van de
LoD2.2-dakvlakken) en +Y loodrecht daarop. Het maaiveld wordt op het eiland
bemonsterd (`groundSamplePoints`, NAP +19,8 m); de gevels aan de oost- en
noordkant staan in de slotgracht (water NAP +13,8 tot +14,4 m), daarom begint
het model 6,2 m onder het eiland. Als geen van die punten in de uitsnede valt,
gebruikt de lader `groundHeight` 63,6 m (de ellipsoïdische PDOK-terreinhoogte).
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.1955100000024260`; de
voorburcht, de ronde torens op het voorplein en de grachtmuren zijn eigen
BAG-panden of geen pand en blijven als PDOK-model of -terrein staan.

Onderdelen (hoogtes boven het eiland op NAP +19,8 m, 37,3 bij 52,7 m en 35,2 m
hoog met de onderkant):

- Donjon (u -18,4 tot -7,6 m, v 8,4 tot 21,2 m): muren tot +21,4 m, een
  borstwering van 0,9 m met kantelen (1 m breed, tussenruimtes 1,2 m, tot +23,6
  m) en vier hoektorentjes van 2,8 m op een kraag (vanaf +18,4 m) met een koepel
  en een pinakel tot +26,4 m; vensternissen in drie zijden.
- Westvleugel met de nok langs v op u = -1 m (+18 m, 50 graden) en een schild aan
  de zuidkant, noordvleugel met de nok langs u op v = 16,6 m (+17,5 m),
  oostvleugel met de nok op u = 14,6 m (+17,8 m), een schild aan de zuidkant en
  een topgevel aan de noordkant; dakkapellen op de west- en noordvleugel en drie
  schoorstenen; vensternissen in twee rijen in de buitengevels.
- De schuine zuidoostvleugel langs de gracht met een nok van (6, -21) naar (14,5,
  -8) op +16,5 m; de binnenplaats met een glazen dak (+12,8 m) en een achtkantig
  traptorentje van 3 m tot +22,2 m met een spits, een uitje en een spits tot +29 m.
- Lage zuidvleugel (+10,5 m) met een vierkant traptorentje (2,8 m, tentdak tot
  +21 m) op de hoek.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 52,1 % ligt binnen 1 m en 75,7 % binnen 2 m. De vleugels hebben in
het AHN onregelmatige daken met verspringende goten; de afwijkingen zitten vooral
in de binnenhoeken, de zuidoostvleugel en de binnenplaats.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
en de kraag onder de hoektorentjes na (steiler dan 45 graden). De export vult op
1:1000 en 1:1500 niets bij en op 1:2500 0,6 %. De STL is 28,4 cm³, heeft 1.916
driehoeken en is één samenhangend deel (status NoError, geslacht 0). Dunste
delen op 1:1000: de kantelen 0,9 mm en de spitsen 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Huis_Bergh) (grootste
waterburcht van Nederland), PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG
LoD2.2 (api.3dbag.nl), de PDOK luchtfoto en foto's op Wikimedia Commons vanaf de
zuid- en westkant. Geschat zijn de kantelen, de hoektorentjes en hun koepels, het
achtkantige traptorentje (op de foto's te zien, in het AHN niet: plaats en hoogte
geschat), de dakkapellen, schoorstenen en vensternissen en de hellingen van de
zuidoostvleugel. Weggelaten: de borstweringsmuur langs de gracht aan de zuidkant
(geen pand), de trap aan de oostgevel en de luiken.
