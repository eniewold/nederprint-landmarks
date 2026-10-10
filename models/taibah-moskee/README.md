# Taibah-moskee (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `taibah-moskee.glb` | Catalogusbron in meters: node `building:moskee` (de gebedszaal en de achterbouw met de koepels, de trapopbouw, de hoekkiosk en de vier minaretten) |
| `taibah-moskee-1-1000.stl` | De moskee op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (38 × 47 × 30 mm) |
| `taibah-moskee.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, maaiveld, hoofdmaten en bronnen |

De Djame Masjid Taibah aan de Karspeldreef bij metrostation Kraaiennest is in
1985 gebouwd naar een ontwerp van Paul Haffmans en in 1998 verbouwd (extra
koepels, verbouwde minaretten). De GLB is in meters met de oorsprong op RD
(127218,36, 480944,60), het hart van de grote koepel, op het maaiveld
(NAP −3,05 m), en de glTF-conventie Y omhoog. +X loopt langs de voorgevel naar
het noordoosten (46,3 graden tegen de klok in vanaf de RD-X-as, de richting van
de voor- en achtergevel in de BAG) en +Y loodrecht daarop naar het
noordwesten. De voorgevel aan de Karspeldreef staat aan de +Y-kant
(v = 20,33 m), de achterbouw aan de −Y-kant; de zaal is symmetrisch om u = 0.
Het maaiveld wordt op drie punten bemonsterd (`groundSamplePoints`: de straat
voor de voorgevel, het plein aan de zuidwestkant en de stoep achter de
achterbouw, AHN NAP −3,1 tot −2,95 m); `groundHeight` 39,85 m (ellipsoïdisch)
is de laagste PDOK-terreinhoogte op die punten, als terugval voor een uitsnede
die alleen een deel van de moskee raakt. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012125533` (één pand voor zaal, achterbouw, minaretten,
kiosk en trapopbouw).

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM op 0,5 m; geen
hoogteveld maar prisma's, rompen van achthoeken, omwentelingen en nissen):

- De gebedszaal, een vierkant van 30,5 m (u −15,3 tot 15,3, v −10,3 tot
  20,33), en de achterbouw (Tooba Islamic Centre, v −23,5 tot −10,3) met een
  vlak dak op +9,3 m (AHN 9,29 tot 9,34) en een afdekker van 0,45 m breed tot
  +9,6 m. De noordoostgevel loopt vanaf (15,9; 4,03) schuin langs de metrobaan
  (17,7 graden) tot de oosthoek van de achterbouw (7,12; −23,5), zoals in de
  BAG.
- Een opstand van 1 m breed tot +10,45 m op de grens van zaal en achterbouw
  (v −8,2 tot −7,2; AHN +10,4 tot +10,5 m).
- Het middenrisaliet van de voorgevel (7,2 m breed, tot v = 13,9 m met
  afgeschuinde achterhoeken) verhoogd tot +10,65 m, met het grote
  spitsboogvenster (4,4 m breed, top +8,3 m) als nis van 0,35 m. Daarop de kleine
  koepel: een achthoekige trommel (vlakken op 2,75 m van het hart (0; 17,2))
  tot +11,5 m en een halve ellips van 5,2 m doorsnee met de top op +14,4 m
  (AHN +14,3 m).
- De grote koepel om de oorsprong: een zestienhoekige trommel (vlakken op
  5,75 m) tot +11,5 m en de koepel van 11,2 m doorsnee met het gemeten radiale
  profiel (r = 5 m op +14,0, r = 3 m op +16,25, top +17,7 m; iets spitser dan
  een halve bol).
- Gevelreliëf: elke travee heeft een licht gevelvlak dat 0,15 m terugligt
  tussen bakstenen penanten, met een spitsboogvenster boven (2,0 m breed,
  +3,6 tot +7,9 m) en onder (1,9 m, +0,4 tot +2,6 m) als nissen van 0,35 m met
  een boog van 50 graden. Voorgevel: drie traveeën aan weerszijden van het
  risaliet; zuidwestgevel: zeven traveeën in de zaal en drie in de
  achterbouw (daar rechthoekige bovenvensters); achtergevel (achterbouw): zes
  spitsboogvensters boven, rechthoekige vensters in het midden, spitsbogen
  onder en de grote spitsboogingang (4,4 m, top +4,6 m) onder het vierde en
  vijfde venster; noordoostgevel: zeven traveeën langs de schuine gevel en één
  bij de noordhoek. Rechthoekige nissen hebben een plafond dat onder
  50 graden naar buiten oploopt.
- Vier achtkante minaretten op de hoeken van de zaal, de vlakken langs de
  gevels (BAG-voeten van 3,15 m tussen de vlakken): een voet tot +11,3 m met
  twee smalle spitsboognissen (0,9 m) in elk buitenvlak, een schuin uitkragende
  kraag (63 graden) naar het eerste balkon van 4,4 m op +12,8 m (AHN: 4,4 tot
  5 m breed tot +12,5 à +13 m), een schacht en een lantaarn onder een
  achtkante uivormige bekroning. De twee voorste (op (±15,25; 20,22)) hebben
  een schacht van 2,0 m tot +18,9 m, een tweede balkon (3,3 m) op +19,95 m, een
  bovenschacht van 1,6 m, een derde balkon (2,7 m) op +24,55 m, een lantaarn
  van 1,7 m tot +26,5 m met een lijst en de bekroning tot +29,2 m (AHN +29,4 en
  +28,4 m). De twee achterste (op (−15,19; −10,3) en (10,23; −10,28)) hebben een
  schacht van 1,8 m, een tweede balkon (3,0 m) op +17,45 m, een lantaarn van
  1,6 m en de bekroning tot +21,9 m (AHN +22,4 en +21,9 m).
- De hoekkiosk op de zuidhoek: een achtkante hoekpijler (BAG 2,82 m) tot de
  afdekker, een gesloten achtkante lantaarn van 1,8 m tot +11,0 m en een
  koepeltje tot +11,85 m (in werkelijkheid een open lantaarn van staal en glas).
- De ronde trapopbouw aan de metrozijde (BAG-boog, straal 2,55 m om
  (17,78; 6,23)) tot +8,5 m (AHN +8,5 m), lager dan het dak.
- Op het dak van de achterbouw een installatieblok (3,1 × 2,4 m, tot +10,8 m)
  en twee piramidevormige daklichten (2,0 m, 1,1 m hoog), waar het AHN
  verhogingen van 1,0 tot 1,5 m toont.

Weggelaten: de halvemaantjes en pinakels op de koepels, de minaretten en de
kiosk (dunner dan 0,9 m), de open balkonhekken van de minaretten (open
spijlwerk), de ribben van de koepels, de groene raampjes in de kragen en
lantaarns (kleiner dan 0,9 m), de zonnepanelen, kleine dakinstallaties en de
kleuren. De noordoostelijke buurman (BAG 0363100012101255, het gebouw langs de
metro) blijft de PDOK-reconstructie (+8 m, lager dan de moskee); hij steekt
niet door het model.

Printbaar op 1:1000: alle vlakken staan verticaal of hellen minder dan
45 graden (de kragen onder 51 tot 63 graden, de nissen met een boog of
plafond onder 50 graden); er is geen `OVERHANG_OK` nodig. De printcheck van
de export op 1:1000 vult 0 % bij (14 395 mm³, status NoError). De STL is
13,4 cm³ en het model één samenhangend deel (genus 0, 6 316 driehoeken). De
dunste dragende delen zijn de bovenschachten van de minaretten (1,6 mm op
1:1000) en de lantaarns (1,6 tot 1,7 mm).

Geschat: de hoogtes van het tweede en derde balkon, de lantaarns en de
uivormige bekroningen (verhoudingen uit foto's, geschaald op de AHN-toppen),
de doorsneden van de schachten (2,0, 1,8 en 1,6 m), de vorm van de kleine
koepel (halve ellips), de vensters, gevelvlakken en nissen, de kiosk en de
plaats van de daklichten. De koepels zijn op foto's donker brons (niet groen).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Moskee_Taibah) (1985,
architect Paul Haffmans, verbouwd in 1998), PDOK BAG (het pand), PDOK AHN (dsm
en dtm 0,5 m via WCS), de PDOK luchtfoto (achtkante trommels en minaretten,
geribde koepels) en foto's op Wikimedia Commons van de voorgevel, de
zuidwestgevel en de achterbouw.
