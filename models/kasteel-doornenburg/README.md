# Kasteel Doornenburg (Doornenburg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-doornenburg.glb` | Catalogusbron in meters: node `building:kasteel` (de hoofdburcht met de twee bruggen uit dakvlakken en bouwdelen) |
| `kasteel-doornenburg-1-1000.stl` | De hoofdburcht op 1:1000 met de onderkant (1 m onder het kasteeleiland) op het printbed (31 × 39 × 34 mm) |
| `kasteel-doornenburg.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (197103,2, 434088,0), midden in de
hoofdburcht, op het maaiveld van het kasteeleiland (NAP +9,1 m), en de
glTF-conventie Y omhoog. +X loopt langs de zuidgevel naar het oosten (16 graden
rechtsom vanaf de RD-X-as, gemeten aan de nokken van de dwarsvleugel en de twee
noordelijke daken) en +Y loodrecht daarop naar de voorburcht. Het eiland ligt
vrijwel op het water van de slotgracht; het maaiveld wordt op het eiland rond de
muren bemonsterd (`groundSamplePoints`, NAP +9,0 tot +9,4 m) en het model begint
1 m daaronder. Als geen van die punten in de uitsnede valt, gebruikt de lader
`groundHeight` 52,9 m (de laagste ellipsoïdische PDOK-terreinhoogte op die
punten). Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.1705100000019617`; de
voorburcht met de kapel en de boerderij is een eigen BAG-pand en blijft als
PDOK-model staan. Geen buurpand steekt in PDOK meer dan 2 m boven het AHN uit.

Onderdelen (hoogtes boven het eiland op NAP +9,1 m, 30,7 bij 38,8 m met de
bruggen en 33,9 m hoog met de onderkant; de hoofdburcht zelf is 18,3 bij 22,1 m):

- Muren (u -9,25 tot 9,0 m, v -11,0 tot 11,1 m) tot de weergang op +17,4 m.
  Borstweringen van 0,9 m tot +18,5 m met kantelen van 2 m breed en
  tussenruimtes van 0,9 m tot +19,5 m aan de zuid-, noord- en oostkant; aan de
  noord- en oostkant kraagt de borstwering 0,4 m uit op een schuine kraag
  (de rondboogfries, vanaf +15,3 m). De westgevel heeft geen kantelen; de daken
  lopen daar tot op de muur (+18,3 m).
- Zuidelijke dwarsvleugel met de nok langs u op v = -5,85 m (+25,2 m, 62
  graden), een schild aan de oostkant (63 graden) en aan de westkant een
  trapgevel met vijf treden naar het zuiden en drie naar de toren, met een
  schoorsteen tot +26,5 m.
- Twee schilddaken op het noordelijke deel met de nokken langs v op u = -4,87 en
  4,1 m (+24,1 m, 57 tot 62 graden) en een kilgoot ertussen.
- Rechthoekige toren in de westgevel (4,0 bij 2,9 m) tot +28,3 m, een
  uitzwenkende voet en een steil schilddak (68 graden) met een korte nok tot
  +32,9 m.
- Drie ronde hoektorentjes met achtkantige spitsen: zuidoost (straal 1,7 m) op
  een kraag vanaf +14,2 m, goot +23,1 m, spits tot +27,5 m; noordoost (1,75 m) op
  een kraag, goot +20,7 m, spits tot +26,1 m; noordwest (1,75 m) vanaf het
  eiland, goot +20,9 m, spits tot +26,3 m.
- Zes dakkapellen met een spitsje (twee op de zuidhelling van de dwarsvleugel,
  twee op de noordschilden, een op de oost- en een op de westhelling), vier
  schoorstenen, twee erkers in de zuidgevel en een erker en de privaatschacht in
  de oostgevel op een kraag, vensternissen in twee rijen in vier gevels en in de
  torentjes.
- De toegang: de noordbrug naar de voorburcht (2 m breed, dek op +5,9 m, 0,9 m
  dik, op drie jukken en een landhoofd) met de deur in de noordgevel, en de
  lagere oostbrug naar het park (1,2 m breed, dek van +3,8 naar +2,8 m, drie
  jukken) met de deur in de oostgevel.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 79,5 % van de hoofdburcht ligt binnen 1 m en 87,6 % binnen 2 m
(met de bruggen 80,3 en 88,1 %). De afwijkingen zitten in de randen van de
borstweringen en kantelen, de dakkapellen en de steile leien vlakken van de toren
en de spitsen (gaten in het DSM).

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
(spitse top) en de onderkant van de brugdekken na; de kragen onder de
borstwering, de hoektorentjes en de erkers hangen 38 tot 45 graden uit het
lood. De export vult op 1:1000 1,1 % bij (de jukken onder de brugdekken), op
1:1500 1,4 % en op 1:2500 2,3 %. De STL is 9,0 cm³, heeft 2.394 driehoeken en is
één samenhangend deel (status NoError, geslacht 0). Dunste delen op 1:1000: de
kantelen, de borstwering en de jukken 0,9 mm, de schoorstenen 0,85 mm en de
spitsen 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Doornenburg), PDOK
BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK
luchtfoto en foto's op Wikimedia Commons vanaf de west-, zuidoost-, oost- en
noordkant. Geschat zijn de hoogte van de torenschacht en de spitsen van de
hoektorentjes (het AHN mist de punten), de trapgevel, de kantelen, de kraag
onder de borstwering, de dakkapellen, schoorstenen, erkers en vensternissen, en
de jukken onder de bruggen (op de foto's houten bokken). Weggelaten: de houten
leuningen van de bruggen en de luiken (dunner dan 0,9 m), de windvanen en
makelaars op de spitsen en de toren (kleiner dan 0,9 m).
