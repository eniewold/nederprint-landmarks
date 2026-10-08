# Muiderslot (Muiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `muiderslot.glb` | Catalogusbron in meters: nodes `building:slot` en `road:brug` |
| `muiderslot-1-1000.stl` | Het slot met de brug in één stuk, op 1:1000 met de onderkant (NAP -1,5 m) op het printbed (59 × 49 × 29 mm) |
| `muiderslot.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (133468, 482984), midden in het
slot, op het maaiveld van de oever (NAP +1,3 m) en de glTF-conventie Y
omhoog. +X loopt naar het oosten en +Y naar het noorden (de RD-assen). Het
slot staat circa 23 graden gedraaid: de hoogste ronde toren staat op de
zuidwesthoek, de hoge westvleugel langs de noordwestmuur, het poortgebouw
met de brug aan de oostkant. Het maaiveld wordt op drie punten bemonsterd
(`groundSamplePoints`, NAP +1,2 tot +1,3 m: de oever bij de brug en de paden
ten oosten en westen van de gracht), zodat het water van de slotgracht
buiten beschouwing blijft; `groundOffsetMetres` is 0, zodat het brugdek op
de oever aansluit en de binnenplaats boven het PDOK-terrein blijft. De
gracht zelf zit in het PDOK-terrein; alle onderdelen beginnen op NAP -1,5 m
en rijzen daaruit op. Het catalogusitem vervangt het BAG-pand
`NL.IMBAG.Pand.0424100000004154`.

Onderdelen in het model (hoogtes in NAP):

- Daken met de vormen uit het AHN-DSM (per 0,5 m in het stelsel van elke
  vleugel bekeken) en de foto's:
  - De westvleugel met een geknikt zadeldak: nok +22 m, een steil bovendak
    van 55 graden tot de knik op +18,1 m en een dakvoet van 39 graden tot de
    goot op +16,4 m. Aan de zuidkant een trapgevel en halverwege een
    trapgevel als brandmuur, elk 0,9 m dik met vier treden van 1,1 m per kant
    en bovenop een pinakel (+23,9 m) of de schoorsteen (+24 m); aan de
    noordkant een schild tegen de noordwesttoren.
  - De noordvleugel met een geknikt zadeldak: nok +15,4 m, bovendak van 58
    graden tot +13,3 m, dakvoet van 27 graden tot de goot op +12,2 m.
  - De oostvleugel met een zadeldak van 45 graden (nok +12,8 m) en in de
    hoek met de noordvleugel een vierkant traptorentje van 3 m met een
    tentdak tot +18,6 m.
  - Het poortgebouw met een tentdak met een korte nok (+19,2 m) en twee
    dakkapellen aan de voorkant.
  - De noordwest-, zuidwest- en zuidoosttoren met een geknikte kegelspits:
    een dakvoet van 32 graden van de goot tot 62 % van de straal en
    daarboven de spits (zuidwest tot +27,8 m, zuidoost +24,5 m, noordwest
    +23 m). Aan de zuidoostkant van de zuidwesttoren staat een traptorentje
    van 2,5 m met een eigen spits tot +25,6 m. De noordoosttoren heeft een
    rechte kegel tot +20,8 m binnen zijn kantelen.
  - Dakkapellen van 1 tot 1,2 m breed (drie aan de buitenkant en twee aan
    de binnenplaats van de westvleugel, drie en twee op de noordvleugel, twee
    op het poortgebouw) en vijf schoorstenen van 1 tot 1,2 m (+17,4 tot
    +20,6 m) waar het DSM pieken toont.
- Kantelen: de weermuren aan de zuidkant en tussen de zuidoosttoren en het
  poortgebouw hebben een weergang op +7,9 m met kantelen van 1,6 m breed,
  0,9 m diep en 1 m hoog (tot +8,9 m) op een borstwering die 0,3 m
  uitkraagt; 9 op de zuidmuur (tussenruimte 1,16 m) en 3 op de oostmuur
  (1,43 m). De noordoosttoren heeft 9 kantelen rond zijn kegeldak (+13,5 tot
  +14,5 m, tussenruimte aan de binnenkant 1 m). De foto's tonen bredere
  kantelen met smallere tussenruimtes; die zijn hier tot 0,9 m of meer
  verbreed, zodat ze op 1:1000 los blijven.
- De poortpartij: het poortgebouw (8 bij 7 m) springt 3,9 m voor de oostmuur
  uit, met in de voorgevel de spitse doorgang van 2,6 m breed (aanzet
  +4,4 m, top 60 graden, vloer +2,1 m) in een rechthoekige sponning van
  2,9 m breed tot +7,4 m, de hoge sleuf van de ophaalbrug (0,9 m, +2 tot
  +11 m) aan de zuidkant, een venster boven de poort en drie spitse nissen
  van 1,6 m onder de borstwering (top +12,4 m), alle 0,35 m diep. De
  borstwering kraagt 0,3 m uit van +12,8 tot +14,8 m.
- Gevelreliëf: een plint rondom (0,3 m uitspringend tot +0,7 m en 0,15 m tot
  +0,95 m), kroonlijsten van 0,9 m hoog die 0,3 m uitkragen aan de
  buitengevels van de west-, noord- en oostvleugel, schoorsteenlisenen van
  1,6 m breed en 0,4 m diep onder de brandmuur en de schoorsteen van de
  noordvleugel, borstweringen die 0,35 m uitkragen op de torens, en 85
  nissen van 0,35 m diep: vensters in de vleugels, de torens en het
  poortgebouw, de luiken in de borstweringen van de torens en het
  poortgebouw, en schietgaten in de weermuren.
- De binnenplaats op +2,1 m, met de hoek tussen de trapgevel, de zuidmuur
  en de zuidwesttoren (de toren is daar afgeplat).
- De brug van het poortgebouw naar de oostoever als dicht dek op +1,6 m, met
  op de twee vaste delen aan beide zijden een borstwering van 0,9 m breed en
  0,9 m hoog; het deel bij de poort (de ophaalbrug) zonder.

Binnen de voetafdruk ligt 88 % van de DSM-cellen binnen 2 m van het model
(79 % binnen 1 m, mediaan +0,4 m; de vorige versie 83 %, 64 % en +0,5 m);
bij de vleugels, torens en muren is dat 90 % (mediaan +0,2 m), op de
binnenplaats 85 % (mediaan +0,4 m, de vloer ligt bewust hoger). De grootste
afwijkingen zijn de tent en andere opstallen op de binnenplaats, de
dakoverstekken langs de binnenplaats (het model eindigt op de muur), de
randen van de torens en de gevels boven het water.

Printbaar op 1:1000 zonder steun: alle bouwdelen zijn minstens 0,9 m breed,
muren en vleugels staan recht op, dakvlakken lopen schuin omhoog, de
borstweringen, kroonlijsten en de borstwering van het poortgebouw rusten op
een kraag van 51 graden, de doorgang heeft een top van 60 graden en de
spitse nissen van 55 graden. Het script controleert dat alleen de vlakke
bovenkanten van de nissen (0,35 m diep, samen 26 m²) naar beneden wijzen;
de vorige versie had 29 m² aan vlakke onderkanten onder de borstweringen van
de torens. Beide onderdelen beginnen op dezelfde onderkant. Het slot gaat als
gesloten solid met overhangopvulling door de export, zodat de binnenplaats
en de poortdoorgang open blijven: een uitsnede van 150 m op 1:1000 duurt
circa 2,6 seconden (slot 14,9 naar 15,3 cm³, vooral de aansluiting op de
onderplaat) en het vervangen pand zit niet meer in de export. Bij de
vorige versie lag het PDOK-terrein in de gracht 1,6 m boven de onderkant
van het model, binnen de muren tot 0,17 m onder de vloer van de
binnenplaats en bij de brug 0,1 m onder het brugdek; de vloer, het brugdek
en de onderkant zijn niet veranderd.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Muiderslot) (vierkante
waterburcht met een ronde toren op elke hoek, aan de monding van de Vecht),
het [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/30107)
(monument 30107), PDOK BAG (contour en torencirkels), PDOK BGT (de brug),
PDOK AHN (dsm en dtm 0,5 m via WCS: dakprofielen met de knik, nokken,
trapgevels, schild, schoorstenen en dakkapellen, weermuren en kantelen,
torens per straal, poortgebouw, binnenplaats en maaiveld), de PDOK-luchtfoto
(8 cm) en foto's op Wikimedia Commons van alle kanten (vanuit het westen en
het zuidoosten 2014, de serie van 9 mei 2022, Muiderslot castle 2018, de
voorgevel met het poortgebouw van de RCE, vanuit de polder en vanuit het
noordwesten). Gemeten zijn de dakprofielen, nokken, knikken, goten en de
hoogtes van de trapgevels, schoorstenen, weermuren en kantelen (AHN), de
contouren (BAG en BGT) en de stand van het poortgebouw. Geschat zijn de
tredebreedtes van de trapgevels, de maten en plaatsen van de dakkapellen,
vensters, schietgaten en nissen (foto's, geschaald op de goten en de
BAG-gevellengtes), de kantelen (breedte en tussenruimte grover dan op de
foto's), de hoogtes van de kragen en borstweringen, de knik van de
torenspitsen en de spitsen zelf (boven het hoogste AHN-punt, naar de
foto's), het traptorentje van de zuidwesttoren, de poortpartij (foto RCE),
de vloer van de binnenplaats (0,45 m boven het AHN, zodat het gladdere
PDOK-terrein er niet doorheen steekt) en het waterpeil van de gracht (NAP
circa -0,4 m). De dakoverstekken, de luiken, de sierankers, de weergang
achter de kantelen met zijn leuning, de bogen onder de brug en de
ophaalbrug zelf zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
