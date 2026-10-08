# Paleis Huis ten Bosch (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `huis-ten-bosch.glb` | Catalogusbron in meters: node `building:paleis` (het paleis uit dakvlakken en bouwdelen) |
| `huis-ten-bosch-1-1000.stl` | Het paleis op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (116 × 44 × 29 mm) |
| `huis-ten-bosch.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (83497,4, 456603,5), het hart van de
koepel boven de Oranjezaal, op het maaiveld aan de tuinzijde (NAP +0,3 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels van het hoofdgebouw naar het
oostnoordoosten (27,6 graden linksom vanaf de RD-X-as, gemeten aan de nokken en
goten van de vleugels en de LoD2.2-dakvlakken) en +Y loodrecht daarop naar het
voorplein. Het maaiveld wordt aan de tuinzijde en naast de zijkamers bemonsterd
(`groundSamplePoints`, NAP +0,2 tot +0,5 m); het voorplein ligt 0,8 m hoger (NAP
+1,1 m), daar zakt de voet van het voorhuis en de vleugels in het terrein. Als
geen van die punten in de uitsnede valt, gebruikt de lader `groundHeight` 43,6 m
(de ellipsoïdische PDOK-terreinhoogte). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0518100000204917` (het hele paleis met beide vleugels); de
Pieter Posthuizen en de bijgebouwen zijn eigen BAG-panden en blijven als
PDOK-model staan. Geen buurpand steekt in PDOK meer dan 2 m boven het AHN uit.

Onderdelen (hoogtes boven het maaiveld op NAP +0,3 m, 116,1 bij 43,6 m en 28,9 m
hoog met de onderkant):

- Hoofdgebouw van Post (u -15,2 tot 15,2 m, v -7,9 tot 12,6 m): goot +12,7 m,
  dakvlakken van 50 graden naar een dakplat om de koepel op +18,7 m (NAP +19,0
  m) met vier schoorstenen van 1,8 bij 1,4 m tot +22,4 m; aan de tuinzijde twee
  hoekrisalieten (u ±5,2 tot ±15,2 m, tot v -11,6 m) met schilddaken (nok
  +18,5 m) en een dakkapel, daartussen een kroonlijst, een fronton (top +15,1 m)
  en vier pilasters; aan de voorkant twee schilddaken (nok +17,6 m) met een
  dakkapel naast het voorhuis; vensternissen in drie rijen.
- Koepel boven de Oranjezaal: achtkantige trommel met apothema 4,1 m tot +21,9
  m met acht vensternissen, een kraag van 0,3 m, een achtkantige koepel tot
  +24,9 m, lantaarn (1,9 m) tot +26 m, kroon met kraag tot +27,5 m en een spits
  tot +28,4 m.
- Voorhuis (u ±7,1 m, tot v 18,4 m): wanden tot +14,6 m met vier pilasters van 1
  m, een kroonlijst die 0,55 m uitkraagt (tot +15,5 m), een balustrade van 0,9 m
  tot +16,3 m aan voorkant en zijkanten, daarachter een dak met plat op +17,7 m;
  drie vensters per verdieping (de deur in het midden); de bordestrap van 9,2 m
  breed met acht treden tot +3,7 m en twee wangen.
- Bordes aan de tuinzijde (10 bij 2,5 m, +3,6 m) met twee trappen naar de tuin.
- Zijkamers naast het hoofdgebouw (u ±15,2 tot ±18,7 m) met een flauw zadeldak
  (24 graden, nok +15 m) en een schild naar buiten, en een verbindingsstuk met
  lessenaarsdak naar de binnenpaviljoens.
- Binnenpaviljoens (u ±14,5 tot ±25,8 m, v 8,8 tot 20,6 m): zadeldak met de nok op
  +15,5 m en een schild naar het hoofdgebouw, schoorsteen tot +17,8 m, een
  dakkapel aan voor- en achterkant.
- Schuine vleugels (Haagse en Wassenaarse vleugel): 10,2 m breed, onder 20,5
  graden naar voren, 23 m tot het eindpaviljoen, zadeldak van 53 graden met de nok
  op +15,5 m, vijf dakkapellen aan de voorkant en een aan de achterkant, twee
  schoorstenen op de nok, een platte uitbouw aan de achterkant (+13 m) en twee
  rijen vensternissen; het verstek met het binnenpaviljoen ligt op de bissectrice
  van de knik.
- Eindpaviljoens (u ±46,55 tot ±57,75 m, v 11,6 tot 29,7 m): schilddak met de nok
  in de lengte op +15,5 m, waar de nok van de vleugel op uitkomt, schoorstenen
  aan beide einden van de nok (+18,2 m), drie dakkapellen aan de buitenkant en een
  aan voor- en achterkant, vensternissen aan drie zijden.
- Platte aanbouw achter het oostelijke eindpaviljoen (+8,75 m, AHN NAP +8,8 m),
  alleen aan de oostkant.
- Kroonlijsten van 0,3 m met een kraag van 50 graden onder de goten van alle
  bouwdelen.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 76,7 % ligt binnen 1 m en 90,3 % binnen 2 m. De leien daken van het
hoofdgebouw en de koepel hebben grote gaten in het AHN (daar zijn de hellingen uit
de 3D BAG); de afwijkingen zitten vooral aan de gevelranden (kroonlijsten), rond
de trommel en bij de bomen achter de westvleugel.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
kraag onder de kroonlijsten en de koepel na (50 graden). De export vult op
1:1000 en 1:1500 niets bij en op 1:2500 0,9 %. De STL is 30,0 cm³, heeft 6.064
driehoeken en is één samenhangend deel (status NoError, geslacht 0). Dunste
delen op 1:1000: de balustrade en de pilasters 0,9 mm, de spits bovenop de kroon.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Paleis_Huis_ten_Bosch) (Post
1645, vleugels van Marot 1733-1737 met een schuine vleugel van 23 m per kant),
PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl), de
PDOK luchtfoto en foto's op Wikimedia Commons van het voorplein (frontaal en
schuin), de tuinzijde en de koepel. Geschat zijn de koepel boven de trommel
(leien en lood, in het AHN grotendeels zonder meting), de lantaarn en de kroon,
de lage dakvlakken rond het voorhuis, de dakkapellen (plaats uit het AHN, maat
van foto's), de vensternissen, pilasters en kroonlijsten, de trappen en de
bordes. Weggelaten: de vazen, beelden en hekken op trappen en balustrade, het
alliantiewapen en de ornamenten, de luiken, de windvaan en de vlaggenmast
(kleiner dan 0,9 m), de Pieter Posthuizen en de bijgebouwen (eigen BAG-panden)
en de glazen kas naast de westvleugel (geen apart bouwdeel).
