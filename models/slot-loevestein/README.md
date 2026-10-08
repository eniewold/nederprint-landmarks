# Slot Loevestein (Poederoijen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `slot-loevestein.glb` | Catalogusbron in meters: nodes `building:slot` en `road:bruggen` |
| `slot-loevestein-1-1000.stl` | Het slot met de twee bruggen in één stuk, op 1:1000 met de onderkant (NAP 0 m) op het printbed (38 × 61 × 37 mm) |
| `slot-loevestein.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (129774, 425374), midden in het
slot, op het maaiveld van de vesting (NAP +3,8 m) en de glTF-conventie Y
omhoog. +X loopt langs de zaalbouw naar het noordoosten (`xAxis`
(0,6435, 0,7655), 49,95 graden linksom vanaf het oosten, de richting van de
BAG-gevels) en +Y naar het noordwesten. De Riddertoren staat aan de
noordoostkant, de Keukentoren aan de zuidwestkant, de poorttoren met de
brug naar de voorburcht aan de zuidoostkant en de lage aanbouw met de brug
naar het pad aan de noordwestgevel. Het maaiveld wordt op drie punten
bemonsterd (`groundSamplePoints`, NAP +3,8 tot +4,1 m: bij de brug naar de
voorburcht en op het terrein ten zuidwesten en ten noorden van de
binnengracht), zodat het water en de lage oevers buiten beschouwing
blijven; `groundOffsetMetres` is 0. De binnengracht, de wallen, de
bastions en de andere gebouwen van de vesting (de kazerne, het
arsenaal, de Kruittoren en de nieuwe paviljoens) zitten in PDOK en niet in
het model; alle onderdelen beginnen op NAP 0 m, onder het water van de
binnengracht, en rijzen daaruit op. Het catalogusitem vervangt het BAG-pand
`NL.IMBAG.Pand.0297100000000371`.

Onderdelen in het model (hoogtes in NAP):

- De zaalbouw van 32,6 bij 11,3 m (Wikipedia: 11 bij 34 m) met een
  zadeldak van 54 graden, nok op +29,8 m boven de lengteas (AHN-DSM 29,6
  tot 29,8 m), goten op +21,3 m aan de binnenplaats en +22,5 m aan de
  noordwestgevel en een schild tegen de Riddertoren. Aan de zuidwestkant
  een rechte topgevel (geen trapgevel) waarvan de afdekking 0,4 m boven het
  dakvlak uitsteekt, met op de top een schoorsteen van 1,2 m tot +32 m en
  een puntig kapje tot +32,7 m; op de nok een schoorsteen van 1,4 m tot
  +32 m (DSM 31,6 tot 32,3 m) en op elk dakvlak een dakkapel van 1,4 m
  breed met een zadeldakje van 45 graden (nok +25,7 m aan de noordwestkant,
  +24,6 m aan de binnenplaats).
- De Riddertoren (12,4 bij 13,4 m) met een tentdak met een knik: de dakvoet
  loopt van de goot op +26 m (overstek 0,3 m) tot +27,4 m op 1,5 m binnen de
  gevels, daarboven het tentdak van 61 tot 63 graden tot +36,75 m, het
  hoogste punt van het slot; vier dakkapellen van 1,2 m op de hoekkepers
  (nok +29,7 m) en schoorstenen aan de noord- en oostzijde tot +33,3 en
  +33,5 m met kapjes van 0,7 m.
- De Keukentoren (10 bij 10,5 m) met dezelfde dakvoet tot de knik op
  +27,4 m (1,2 m binnen de gevels) en daarboven een achtkantige spits van 62
  tot 63 graden tot +35 m, met driehoekige hoekschilden tussen de vierkante
  dakvoet en de achtkant; een dakkapel midden op de zuidwestzijde (nok
  +28,7 m), schoorstenen aan de oostzijde (+31,8 m) en de zuidzijde (+31 m)
  en een dwarskap van 45 graden met een nok op +28,3 m van de noordgevel van
  de toren tot in het zaaldak.
- De poorttoren aan de zuidoostkant (8,8 bij 10,6 m) met een zadeldak van
  55 graden langs de doorgang (nok +28,4 m boven x = 2, goten +21,9 en
  +22,2 m), topgevels voor en achter, een dakruiter van 1,2 m midden op de
  nok tot +29,9 m met een tentdakje tot +30,7 m, een schoorsteen op de top
  van de voorgevel (+29,4 m) en twee schoorstenen van 0,9 m aan de oostkant
  achteraan (+29,6 m), en de spitse doorgang van 2,4 m breed van het
  brugdek (+4,4 m) naar de binnenplaats in een spitse nis van 3,6 m breed,
  0,35 m diep en tot +10,5 m hoog (de sponning van de ophaalbrug).
- De lage muur langs de binnenplaats tot +20,5 m, de aansluiting van de
  poorttoren op de Riddertoren (ten oosten van de poorttoren) tot +26 m en
  de open binnenplaats op +4,6 m.
- De aanbouw aan de noordwestgevel (5,3 bij 4,5 m) met een zadeldak van 58
  graden (nok +26,5 m) dat doorloopt tot in het zaaldak, een topgevel naar
  buiten en een pinakel van 0,9 m op de top tot +28,5 m.
- Gevelreliëf: 90 vensters als blinde nissen van 0,35 m diep met een vlakke
  bovenkant. In de zaalbouw de grote kruisvensters (1,3 m breed, +8,8 tot
  +12 m) en twee rijen kleinere vensters (0,9 m, +15,6 tot +17 m en +19,4
  tot +20,6 m) in zes traveeën in de noordwestgevel, twee in de
  noordoostgevel en twee in de zuidwestgevel, met twee vensters in de
  topgevel; in de torens vijf lagen van 0,9 tot 1 m breed (+6 tot +23,8 m) in
  twee kolommen per vrije gevel; in de poorttoren drie vensters boven de
  poort en één kolom in de zijgevels; in de aanbouw een deur en drie
  vensters boven elkaar.
- De brug naar de voorburcht als dicht dek op +4,4 m en de brug naar het
  pad in het noordwesten als dicht dek op +2,6 m.

Gemeten en geschat: de hoogtes van de nokken, goten, de knik in de
torendaken (dakvoet circa 43 graden over 1,2 tot 1,5 m, daarboven 61 tot
64 graden), de dwarskap, het dak van de aanbouw en de schoorstenen op de
nok en de torens komen uit het AHN-DSM, per 0,5 m als raster in het lokale
stelsel bekeken; de vormen (achtkantige spits met hoekschilden op de
Keukentoren, vierkant tentdak met hoekdakkapellen op de Riddertoren,
topgevels zonder trappen, dakruiter, dakkapellen) uit de foto's van alle
kanten en de graten op de luchtfoto. Geschat zijn de maten van de
dakkapellen, de dakruiter en de kapjes, de hoogte van de schoorsteen op de
zuidzijde van de Keukentoren (DSM 29,4 m, foto circa 31 m) en van de
schoorstenen van de poorttoren, en de rijen en breedtes van de vensters.
Het AHN toont het oostvlak van de poorttoren als vlak op +27,2 m; de foto's
van 2024 en de luchtfoto tonen daar een gewoon zadeldak, dat het model
volgt. Kantelen, weergangen en hoektorentjes heeft het slot niet; de
ophaalbrug, de leuningen, de windvanen, de open stijlen van de dakruiter,
de tandlijsten onder de goten en de luiken zijn weggelaten.

Binnen de voetafdruk van het slot ligt 84,1 % van de DSM-cellen binnen 2 m
van het model (70 % binnen 1 m, mediaan model 0,4 m boven het DSM; de
vorige versie met gladde daken 79,5 % en 55 %, +0,7 m). De grootste
afwijkingen zitten aan de randen (gemengde cellen boven het water, de
dakoverstekken) en op het oostvlak van de poorttoren.

Printbaar op 1:1000 zonder steun: de muren staan recht op, alle dakvlakken
lopen schuin omhoog (hoekschilden 21 tot 46 graden, dakvoeten 38 tot 49,
dakkapellen en dwarskap 45, daken 54 tot 64 graden), schoorstenen,
dakkapellen en de dakruiter zijn 0,9 tot 1,5 m breed en lopen door tot in
de massa eronder, en de poortdoorgang en de poortnis hebben een spitse
bovenkant van 60 graden. Het script controleert dat alleen de dakgoten van
de twee torens (17,3 m², 0,3 m vlak uitkragend) en de vlakke bovenkanten van
de vensternissen (30,4 m², per nis hooguit breedte maal 0,4 m) naar beneden
wijzen, en dat beide onderdelen op dezelfde onderkant beginnen; de vorige
versie had alleen de 17,3 m² dakgoot. De GLB is 120 kB (2502 driehoeken in
het slot). Door de dakgoten gaat het slot als gesloten solid met
overhangopvulling door de export, zodat de binnenplaats, de poortdoorgang
en de vensternissen open blijven: een uitsnede van 170 m op 1:1000 duurt
circa 2,5 seconden (slot 18,76 naar 19,01 cm³; het verschil is vooral de
aansluiting op de onderplaat), het vervangen pand zit niet meer in de
export en de andere vestingpanden blijven staan. Het PDOK-terrein ligt in
de binnengracht als water op NAP +2,3 m (2,3 m boven de onderkant van het
model), op de binnenplaats en in de poortdoorgang op NAP +2,4 m (onder de
vloer van +4,6 m), onder de brug naar de voorburcht 0,4 tot 1 m onder het
dek en onder de noordwestbrug 0,16 m onder het dek; op de drie
bemonsteringspunten ligt het op 0 tot 0,3 m boven het modelmaaiveld.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Slot_Loevestein)
(compact zaaltorenkasteel, U-vorm met zaalbouw van 11 bij 34 m,
Riddertoren, Keukentoren en poorttoren), het
[Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/10081)
(monument 10081), PDOK BAG (contour en richting van de gevels), PDOK BGT
(de twee bruggen), PDOK AHN (dsm en dtm 0,5 m via WCS: nokken, goten,
knikken en toppen van de daken, schoorstenen, binnenplaats, brugdekken en
maaiveld), PDOK luchtfoto 8 cm (graten van de torendaken, dakkapellen,
schoorstenen, nok van de poorttoren) en foto's op Wikimedia Commons van
alle kanten (10081 slot loevestein (2) en (3), 2024-08-14 Slot Loevestein
ZvD 31, 40, 49, 52, 55 en 58, panoramio 22 van de poorttoren vanuit het
oosten).

Licentie van het model: eigen werk op basis van open bronnen.
