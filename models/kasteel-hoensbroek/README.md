# Kasteel Hoensbroek (Hoensbroek)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-hoensbroek.glb` | Catalogusbron in meters: nodes `building:kasteel` (de hoofdburcht met de brug naar de voorhof) en `building:voorburcht` (de vleugels om de twee pleinen met de buitenste poorttoren en brug), uit dakvlakken en bouwdelen |
| `kasteel-hoensbroek-1-1000.stl` | Hoofdburcht en voorburcht op 1:1000 met de onderkant (1 m onder het water van de gracht) op het printbed (127 × 85 × 46 mm, twee losse delen) |
| `kasteel-hoensbroek-grondplaat-1-1000.stl` | Idem op een grondplaat van 1 mm, zodat de twee delen één print zijn |
| `kasteel-hoensbroek.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (192348, 325340), midden in de
hoofdburcht, op het water van de slotgracht (NAP +69,2 m), en de glTF-conventie
Y omhoog. +X loopt langs de noordoostgevel van de hoofdburcht naar het
oostzuidoosten (38,8 graden rechtsom vanaf de RD-X-as, gemeten aan de nokken en
de LoD2.2-dakvlakken, die op 1 graad na langs deze assen liggen) en +Y
loodrecht daarop naar de voorburcht. Het maaiveld wordt op het water van de
gracht ten zuiden, westen en oosten van de hoofdburcht bemonsterd
(`groundSamplePoints`, PDOK-water op 114,7 m ellipsoïdisch); de hoofdburcht
staat rondom in de gracht en het model begint 1 m onder het water. De pleinen
van de voorburcht liggen op +2 m en de binnenplaats van de hoofdburcht op +3 m;
de vleugels van de voorburcht lopen daar 3 m onder het PDOK-terrein door. Als
geen van de punten in de uitsnede valt, gebruikt de lader `groundHeight` 114,7
m. Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0917100000006365` (de
hoofdburcht), `NL.IMBAG.Pand.0917100000006362` (beide U-vormige voorburchten) en
`NL.IMBAG.Pand.0917100000006363` (de zuidvleugel van de buitenste voorburcht).
De BAG-contour van de hoofdburcht ligt tot 2 m naast het AHN en de luchtfoto
(de zuidwestgevel op v -8,4 in plaats van -10,6 m); het model volgt het AHN. De
losse wachttoren aan de westkant (`0917100000006361`) blijft PDOK-model.

Onderdelen (hoogtes boven het water op NAP +69,2 m, 126,9 bij 85 m en 45,5 m
hoog met de onderkant):

- Hoofdburcht (u -32 tot 22,9 m, v -17,7 tot 13 m): het westpaviljoen (13,4 bij
  19,9 m) met een schilddak tot +21,8 m (46 graden), de oostvleugel (16,5 bij
  20,7 m) met een schilddak tot +22,2 m, de noordoostvleugel tussen de
  poorttorens (nok +16,2 m, 52 graden) en de zuidwestvleugel (nok +15,3 m) om de
  binnenplaats (+3 m); dakkapellen op vier dakvlakken, zeven schoorstenen en
  vensternissen in drie rijen.
- De ronde toren (straal 5,3 m) met muren tot +26,3 m, een klokvormige spits
  (knik op +28,4 m, spits tot +40,8 m) met vier dakkapelletjes, een lantaarn en
  een uitje tot +44,5 m; het lage ronde torentje aan de zuidwestgevel (straal
  3,9 m, kegeldak tot +11,6 m).
- De vierkante zuidtoren (9,6 bij 9 m) met muren tot +22 m, een geknikte spits
  tot +35,6 m, een lantaarn en een uitje tot +39,6 m, vensters in vier rijen en
  een schoorsteen.
- De twee gedrongen poorttorens (8,6 m) aan weerszijden van de ingang met muren
  tot +17,6 m, een laag tentdak, een klokvormige koepel tot +23,5 m, een
  lantaarn en een uitje tot +28 m; daartussen het portaal met een stenen
  omlijsting, fronton en poortnis, en de brug naar de voorhof (dek +3 m,
  borstweringen van 0,9 m, drie blinde bogen per flank).
- Voorburcht: de westvleugel (nok +15,4 m) en de noordvleugel (nok +17,4 m,
  schild aan de westkant) van de buitenste voorburcht, de lage doorgang (nok
  +10,3 m, 32 graden, twee bogen), de noordvleugel van de binnenste voorburcht
  (nok +18,4 m, schilden aan beide kanten), de middenvleugel (nok +15,9 m,
  topgevel aan de gracht) met de poorttoren (schilddak tot +21,8 m, lantaarn en
  uitje tot +26,8 m, doorgangsnissen), de oostvleugel (nok +15,6 m, schilden),
  de 8,3 graden gedraaide zuidvleugel (nok +10,9 m, schild aan de oostkant), de
  poorttoren op de zuidwesthoek (muren +11,6 m, geknikte tentspits tot +17,9 m)
  met de buitenste brug; dakkapellen aan de pleinkant, negen schoorstenen en
  vensternissen in twee rijen.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 67,9 % ligt binnen 1 m en 90,9 % binnen 2 m. De afwijkingen zitten
in de steile leien spitsen en koepels (weinig AHN-punten), de knikken in de
torendaken en de binnenhoeken van de vleugels.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
nissen na. De export vult op 1:1000 en 1:1500 niets bij en op 1:2500 0,8 %
(hoofdburcht) en 0,9 % (voorburcht). De STL is 54,9 cm³ en heeft 8.862
driehoeken (status NoError); hoofdburcht en voorburcht zijn elk één samenhangend
deel. Dunste delen op 1:1000: de borstweringen, dakkapellen en schoorstenen 0,9
mm en de uitjes 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Hoensbroek), PDOK
BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK
luchtfoto en foto's op Wikimedia Commons vanaf de zuidwest-, zuid-, oost-,
noordoost- en noordkant en van de pleinen. Geschat zijn de vormen van de
spitsen, koepels, lantaarns en uitjes (hoogtes uit het AHN, profiel van de
foto's), de dakkapellen, schoorstenen, vensternissen, poortbogen en de bogen
onder de bruggen. Weggelaten: de losse wachttoren (eigen pand), de kademuren
en borstweringen langs de pleinen (lager dan 0,9 m boven het terrein), de luiken,
vensterkruisen en windvanen (dunner dan 0,9 m).
