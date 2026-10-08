# Kasteel van Breda (Breda)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-van-breda.glb` | Catalogusbron in meters: nodes `building:paleis` (het paleis rond de binnenplaats), `building:voorgebouw` (het voorgebouw met de Stadhouderspoort, de vierkante toren, de schuine vleugel en het hoekpaviljoen) en `building:torentje` (het achtkantige torentje op de hoek van de Parade) |
| `kasteel-van-breda-1-1000.stl` | De drie delen op 1:1000 met de onderkant (NAP -0,5 m, onder het water van de gracht) op het printbed (165 × 119 × 28 mm) |
| `kasteel-van-breda-grondplaat-1-1000.stl` | Idem op een grondplaat van 1 mm, zodat de losse delen één print zijn |
| `kasteel-van-breda.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (112576, 400456), midden op de
binnenplaats, op het maaiveld van het voorplein tussen de westvleugels (NAP
+2,3 m), en de glTF-conventie Y omhoog. +X loopt langs de noord- en zuidvleugel
naar het oostnoordoosten (11,5 graden linksom vanaf de RD-X-as, gemeten aan de
nokken en goten; de BAG-contour wijkt 0,8 graden af) en +Y loodrecht daarop.
Het maaiveld wordt op het voorplein tussen de westvleugels en ten zuiden van
het paleis bemonsterd (`groundSamplePoints`); de binnenplaats ligt hoger (NAP
+3,75 m), de Parade op +2,7 m, het pad ten zuiden op +1,8 m en het water van de
gracht op +0,3 m. Het voorgebouw en het hoekpaviljoen staan in de gracht,
daarom begint het hele model op NAP -0,5 m. Als geen van die punten in de
uitsnede valt, gebruikt de lader `groundHeight` 46,2 m (de ellipsoïdische
PDOK-terreinhoogte van het voorplein). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0758100000023912` (paleis), `...23913` (voorgebouw; PDOK tot NAP
+25 m tegen +16 m in het AHN), `...23914` (toren en schuine vleugel),
`...24029` (hoekpaviljoen) en `...24027` (achtkantig torentje). De latere
KMA-gebouwen eromheen en het pand uit 1790 tegen de schuine vleugel
(`...23915`, PDOK binnen 1 m van het AHN) blijven als PDOK-model staan. De brug
naar de Stadhouderspoort zit als dek op NAP +3,4 m in het PDOK-terrein.

Onderdelen (hoogtes in NAP, 164,7 bij 118,8 m en 27,9 m hoog met de
onderkant):

- Paleis (89,4 bij 58 m): vier vleugels van 13,3 tot 15,2 m breed rond de open
  binnenplaats (39 bij 28 m); de noord- en zuidvleugel lopen 21 m door naar het
  westen en eindigen daar in een schild. Schilddaken van 45 graden met de nokken
  op +24,25 m (noord en oost), +24,15 m (zuid) en +24,1 m (westvleugel, 41
  graden), een opgewipte dakvoet van 30 graden tot de goot op +18,45 m buiten en
  +18 m aan de binnenplaats, kilgoten in de binnenhoeken en schilden op de
  buitenhoeken; een kroonlijst van 0,5 m op een kraag van 42 graden en een plint
  van 0,3 m tot +4,3 m. Negen schoorstenen op de nokken (+26 m, de twee bij de
  westvleugel +27,4 m).
- De twee achtkantige hoektorentjes aan de Parade (4,4 m) tot +22,1 m met een
  lijst op een kraag, een achtkantige spits, een bol en een pinakel tot +27,3 m.
- De Henricuspoort midden in de oostgevel: een poortpartij van 6 m breed die 0,6
  m voor de gevel staat tot +8,3 m, met een diepe spitse poortnis; de doorgang
  komt uit in een nis in de oostgevel van de binnenplaats.
- Vensternissen (1,3 m, 0,35 m diep) in drie rijen op een traveemaat van 2,97 m
  in alle buitengevels en in de hoektorentjes; op de binnenplaats arcaden met
  spitse bogen (2,6 m breed, 3,96 m hart op hart) langs de noord-, zuid- en
  westkant met twee vensterrijen erboven.
- Voorgebouw langs de zuidelijke gracht (55 bij 10 m): gevels tot +11,95 m met een
  looprand van 1 m en een zadeldak van 43 graden tot +15,75 m, een rij vensters
  aan beide kanten. De Stadhouderspoort aan de brug: een stenen poortpartij van
  7,4 m met twee pilasterbundels van 1 m, een fronton tot +11,6 m, een diepe spitse
  poortopening vanaf het brugdek (+3,4 m), de doorgang aan de achterkant en een
  dakkapel tot +14,6 m.
- Vierkante toren op de westhoek (5,5 m) tot +19,8 m met een tentdak tot +24 m
  en vensters, een lage aansluiting met een plat dak (+12,1 m) en de schuine
  vleugel naar het noordwesten (21 bij 9,2 m) met een steil zadeldak (59 graden,
  nok +20,3 m), een topgevel en twee vensterrijen.
- Hoekpaviljoen in de gracht (22 bij 21 m): een kroonlijst op een kraag, een dak
  rond een lichthof (goot +12,6 m, omgang +15,7 m, lichthof +12,7 m met een
  glazen lantaarn), zes dakkapellen, twee schoorstenen en twee vensterrijen.
- Achtkantig torentje op de hoek van de Parade (5,1 m) tot +6,1 m met een
  klokvormig dak, een lantaarn en een uitje tot +12,7 m.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 91,4 % ligt binnen 1 m en 94,4 % binnen 2 m (het paleis alleen
90,7 en 93,0 %). De afwijkingen zitten in de gootlijnen (de kroonlijst ligt tot
0,5 m buiten de gevel) en rond de toren van het voorgebouw.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
en de kraag onder de kroonlijst na. De export vult op 1:1000 en 1:1500 niets
bij (het torentje 0,07 %) en op 1:2500 0,6 % (paleis), 0,85 % (voorgebouw) en
1,4 % (torentje). De STL is 82,5 cm³ en heeft 12.986 driehoeken in drie losse
delen (status NoError); de STL met grondplaat is één deel. Dunste delen op
1:1000: de bollen, de lantaarn en het uitje 0,9 tot 1 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_van_Breda) (sinds 1826
de Koninklijke Militaire Academie), PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via
WCS), de PDOK luchtfoto en foto's op Wikimedia Commons vanaf de Parade
(oostgevel met de hoektorentjes en de Henricuspoort), de binnenplaats, het
Kasteelplein (Stadhouderspoort, brug en hoekpaviljoen) en de westelijke gracht
(toren en schuine vleugel). Geschat zijn de spitsen en bollen van de
hoektorentjes boven +26,6 m (het AHN mist de top), de vensternissen en arcaden
(traveemaat van foto's), de poortpartijen, de dakkapellen, de lantaarn op het
paviljoen en het dak van het achtkantige torentje. Weggelaten: de brug (zit in
het PDOK-terrein), het Spanjaardsgat (de watertoegang met twee zevenhoekige
torens, 130 m naar het westzuidwesten, los van het kasteel), de latere
KMA-gebouwen, een strook op +14,5 m langs de noordwestvleugel die alleen in het
AHN staat (een steiger: niet op de luchtfoto of foto's), de trap voor de
Henricuspoort, schoorsteenpotten kleiner dan 0,9 m en de luiken.
