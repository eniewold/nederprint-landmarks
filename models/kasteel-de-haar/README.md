# Kasteel De Haar (Haarzuilens)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kasteel-de-haar.glb` | Catalogusbron in meters: nodes `building:kasteel`, `building:voorburcht`, `building:chatelet` en `road:bruggen` |
| `kasteel-de-haar-1-1000.stl` | Het kasteel met de voorburcht en de galerijbrug in één stuk, en het châtelet met zijn brug als tweede stuk, op 1:1000 met de onderkant (NAP -1,5 m) op het printbed (92 × 96 × 42 mm) |
| `kasteel-de-haar.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (127540, 459320), midden in het
kasteel, op het maaiveld van de voorhof (NAP +0,8 m) en de glTF-conventie Y
omhoog. +X loopt naar het oosten en +Y naar het noorden (de RD-assen). De
voorburcht ligt ten westen van het kasteel, het châtelet 64 tot 75 m naar
het noorden aan de rand van de voorhof, en de hoogste ronde toren op de
noordpunt van het kasteel. Het maaiveld wordt op drie punten bemonsterd
(`groundSamplePoints`, NAP +0,7 tot +0,8 m: de voorhof, het gazon ten oosten
en het pad ten westen van de voorburcht), zodat het water van de slotgracht
buiten beschouwing blijft. De gracht zelf zit in het PDOK-terrein; alle
onderdelen beginnen op NAP -1,5 m en rijzen daaruit op. Het catalogusitem
vervangt de BAG-panden `NL.IMBAG.Pand.0344100000022989` (kasteel),
`NL.IMBAG.Pand.0344100000037638` (voorburcht) en
`NL.IMBAG.Pand.0344100000100346`, `NL.IMBAG.Pand.0344100000104054` en
`NL.IMBAG.Pand.0344100000104055` (châtelet); de kapel ten zuidoosten blijft
als PDOK-reconstructie staan.

Onderdelen in het model (hoogtes in NAP; dakvormen uit het AHN-DSM, als
raster per 0,5 m bekeken in het stelsel van elke vleugel, de PDOK-luchtfoto
van 8 cm en luchtfoto's van alle kanten):

- Het kasteel binnen de BAG-contour, met een plint van 0,3 m rondom. De
  vleugels hebben elk een eigen zadeldak en raken elkaar in kilgoten op +18
  tot +19,5 m, zoals in het DSM:
  - de zuidvleugel langs de zuidgevel: nok +24,6 m op 5,75 m uit de gevel,
    dakvlakken van 56 graden, een schild aan de westkant en een trapgevel
    aan de oostkant (kroon +25,4 m), zeven dakkapellen op het zuidelijke
    dakvlak, een getrapte topgevel boven de zuidgevel (+23,4 m) en twee
    schoorstenen op de nok;
  - drie evenwijdige vleugels van noordnoordwest naar zuidzuidoost: de
    oostvleugel (nok +24,3 m, 52 graden, vier dakkapellen naar de
    oostgevel), het dak over de overdekte binnenplaats (nok +23,2 m, 37 en
    29 graden, een schild aan de noordkant en drie dakkapellen) en de smalle
    westvleugel (nok +24,6 m, 61 graden) die in het noorden eindigt in een
    trapgevel (kroon +25,8 m);
  - een lagere vleugel langs de westgevel (nok +22,2 m, goot +16 m) en de
    noordwestvleugel langs de voorhof (nok +24 m, drie dakkapellen; het deel
    ten zuidwesten van de vierkante toren tot +22 m).
- Kroonlijsten van 0,9 m op een schuine kraag onder de goot van de zuid-,
  oost- en noordwestgevel, en vensters als nissen van 0,35 m diep in drie
  rijen in die gevels.
- De drie ronde hoektorens met vensternissen in de romp en een borstwering
  van 1 m dik die op een schuine kraag 0,35 m uitkraagt, met nissen, rond
  een open weergang (de diepe ring in het DSM); daarbinnen een kern met een
  steile kegelspits: de noordtoren (11,6 m, weergang +24,1 m, borstwering
  tot +25,7 m, spits tot +40,3 m met vier dakkapelletjes), de zuidoosttoren
  (10,4 m, +22 m, spits tot +33,8 m) en de zuidwesttoren (9 m, +22,3 m,
  spits tot +31,5 m).
- Vier vierkante torens met een lijst op een schuine kraag onder het tentdak:
  in de noordwestgevel (6,5 m, tot +32,3 m), op de noordwesthoek (5 m, tot
  +27,3 m), aan de oostkant (6 m, tot +31,2 m) en bij de noordoosthoek
  (5,5 m, tot +30 m).
- Twee slanke traptorens met een spits (tot +26,8 en +28,3 m), een
  achtkantig torentje tegen de zuidgevel (tot +22 m) en schoorstenen van
  1,2 m tot +25,3 tot +26,3 m.
- De voorburcht ten westen van het kasteel binnen de BAG-contour, met de
  daken als hoogteveld naar het AHN: het zuidelijke deel met de nok op
  +15,5 m, het noordelijke deel tussen twee vierkante torens (met een lijst
  op een kraag onder het tentdak, tot +24,2 en +24 m) met de nok op +20 m,
  de ronde zuidtoren met een rand op een schuine kraag en een spits tot
  +21,6 m, een rond noordtorentje (tot +19,5 m), het achtkantige
  traptorentje met een geknikte spits, een lantaarn en een naald (tot
  +23,3 m), vier schoorstenen en de lage galerij langs de voorhof tot
  +6,5 m.
- De overdekte galerijbrug van de galerij naar het kasteel (2,6 m breed):
  goot +5 m, een zadeldak met schilden tot +6,5 m, vensternissen in de
  galerij en vier spitse doorgangen boven het water tussen de pijlers.
- Het châtelet, de toegangspoort aan de noordkant van de voorhof: het
  poortgebouw (4 bij 5,5 m) met de spitse doorgang op de as van de brug
  (2,2 m breed, top +5,5 m) in een spitse sponning van 3 m, drie
  vensternissen erboven, een borstwering op een schuine kraag tot de
  weergang op +7,9 m en zes kantelen van 0,9 m tot +8,8 m (drie op de voor-
  en drie op de achterkant, tussenruimtes 0,9 tot 1,2 m), de ronde
  zuidtoren (BAG, 2,6 m) en het noordtorentje, elk met een lijst op een
  kraag en een achtkantige spits tot +12,3 m.
- De brug naar het châtelet (dek +1,3 m, 5,3 m breed) met borstweringen van
  0,9 m breed en hoog aan beide zijden en drie spitse bogen tussen de
  BGT-pijlers (top +0,7 m), en de brug naar de oostingang, die van +2,6 m
  bij de deur afloopt naar +1,7 m op de oever, met borstweringen en een
  spitse boog.

Binnen de voetafdruk ligt 73 % van de DSM-cellen binnen 2 m van het model
(54 % binnen 1 m, mediaan +0,35 m; het vorige model met één dakprofiel per
gebouwdeel haalde 73 %, 47 % en +0,4 m). Zonder de cellen binnen 1 m van de
gevels, die half op het water vallen, is dat 81 % (61 % binnen 1 m, mediaan
+0,18 m). Langs de gevels zakt het naar 50 %: de kroonlijsten en de
borstweringen van de torens steken 0,3 tot 0,35 m buiten de BAG-contour. Rond
de ronde torens ligt 45 tot 63 % binnen 2 m; het DSM ziet de open weergang
dieper dan hij is. Tussen de zuidvleugel en de zuidoosttoren meet het DSM
een lagere strook (+9 tot +12 m) die in het model dicht is.

Printbaar op 1:1000 zonder steun: alle bouwdelen zijn minstens 0,9 m breed,
muren staan recht op, dakvlakken en spitsen lopen schuin omhoog, de
borstweringen van de torens en het châtelet, de lijsten en de kroonlijsten
rusten op een kraag van 51 graden en de doorgangen, bogen en de sponning
hebben een spitse top van 55 tot 60 graden. Alleen de vensternissen hebben
een vlakke bovenkant van 0,3 tot 0,35 m diep; het script controleert dat
geen ander vlak boven de onderkant vlakker dan 45 graden naar beneden wijst
(41 m² nisbovenkanten in het hele model; het vorige model had 45 m² vlakke
uitkragingen van 0,35 m onder de weergangen, de rand van de voorburchttoren
en de borstwering van het châtelet) en dat alle onderdelen op dezelfde
onderkant beginnen. Alle vier onderdelen gaan als gesloten solids met
overhangopvulling door de export: een uitsnede van 120 m op 1:1000 duurt
circa 6 seconden (kasteel 32,3 naar 32,7 cm³, voorburcht 8,7 naar 8,9 cm³,
châtelet 0,29 naar 0,30 cm³, bruggen 0,26 naar 0,30 cm³) en de vervangen
panden zitten niet in de export. Het PDOK-terrein ligt in de gracht 1 m
onder het maaiveld van het model en 1,3 m boven de onderkant; op de voorhof
en het gazon 0,3 tot 0,5 m boven het maaiveld van het model.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_de_Haar)
(neogotisch kasteel van Pierre en Joseph Cuypers, 1892-1912, op de ruïne van
het middeleeuwse kasteel), het
[Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/complexen/527891)
(complex 527891), PDOK BAG (contouren), PDOK BGT (dekken en pijlers van de
bruggen, water), PDOK AHN (dsm en dtm 0,5 m via WCS: nokken, kilgoten,
goten, trapgevels, schoorstenen, dakkapellen, torens per straal, maaiveld),
de PDOK-luchtfoto van 8 cm (dakplattegrond, het châtelet met de brug en
achtkantige spitsen) en foto's op Wikimedia Commons (Kasteel de Haar.
Luchtfoto 1 tot 8 van alle kanten, De Haar Castle Drone, het kasteel en de
voorburcht vanuit het zuidwesten, het châtelet met de brug, de voorburcht
vanaf de voorhof, de noordtoren en de galerijbrug). Geschat zijn de
hellingen en de nokposities waar het DSM gaten heeft (leien daken), de
plaats en maat van de dakkapellen, trapgevels en de topgevel (uit DSM-pieken
en luchtfoto's), de straal van de kernen onder de spitsen en de hoogtes van
de spitsen boven het hoogste AHN-punt, de maten van de vierkante torens en
de torentjes van het châtelet, de vensters (rijen en aantallen uit foto's,
geschaald op de goten), de hoogte van de galerijbrug en de doorgangen, en
het waterpeil van de gracht (NAP circa -0,5 m, het AHN heeft er geen
waarden). Vereenvoudigd: de doorgang van het châtelet is spits in plaats
van rond, de rode houten leuningen van de brug zijn gemetselde
borstweringen van 0,9 m, de vele kleine pinakels en dakruiters onder 0,9 m
en de houtbouw van de galerijen zijn weggelaten, en de daken van de
voorburcht blijven een hoogteveld naar het AHN.

Licentie van het model: eigen werk op basis van open bronnen.
