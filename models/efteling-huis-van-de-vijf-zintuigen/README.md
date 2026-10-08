# Huis van de Vijf Zintuigen (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-huis-van-de-vijf-zintuigen.glb` | Catalogusbron in meters: node `building:entreegebouw` (het rieten dak met het middenschip, de voor- en achterpunt en de twee hoorns, de muren met rondboognissen, de ingang met de houten boom en de glazen puntgevel) en node `building:winkel` (de ronde winkel met de vijfde punt en de dakkapellen, en de verbindingsvleugel) |
| `efteling-huis-van-de-vijf-zintuigen-1-1000.stl` | Het gebouw op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (61 × 74 × 33 mm) |
| `efteling-huis-van-de-vijf-zintuigen.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Generator: `scripts/generate-efteling-huis-van-de-vijf-zintuigen.mjs` (met de
gedeelde hulpen uit `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131227,3, 406805,1), op het
snijpunt van de hoofdas (van de achterpunt naar de voorpunt) met de lijn
tussen de twee hoorns, op het maaiveld (NAP +8,9 m), en de glTF-conventie Y
omhoog. +X loopt dwars op de hoofdas naar de oosthoorn (9,5 graden tegen de
klok in vanaf de RD-X-as) en +Y langs de hoofdas naar de ingang aan de
parkeerkant (noord-noordwest). Het maaiveld wordt op zeven punten op de
pleinen rond het gebouw bemonsterd (`groundSamplePoints`, 3 m buiten de
dakrand aan de parkeer- en de parkkant en naast de winkel; niet in de vijvers
ten westen en oosten van de hoorns). Vervangt de PDOK-reconstructie van de
winkel (`NL.IMBAG.Pand.0809100000017169`, 1994) en van de vijf kassa- en
poorthuisjes onder het dak (`0809100000017876`, `-17878`, `-17880`, `-17882`
en `-17883`, 8 tot 82 m², 1994), die PDOK als kolommen tot NAP +24 à +34 m
reconstrueert omdat het AHN er het dak boven ziet. Voor het dak zelf staat
geen pand in de BAG of de PDOK-gebouwtegel.

Onderdelen (hoogtes boven het maaiveld):

- Het rieten dak (61 × 37 m, 4500 m² riet volgens Wikipedia). Alle rietvlakken
  zijn hol: vanaf de dakrand eerst bijna vlak, dan steeds steiler naar de
  punten. Het middenschip is een zadeldak uit stroken (per station langs de
  as een hol dwarsprofiel z = 1 + (h - 1)(1 - (|u|/w)^p)); de nok zakt van de
  voorpunt (+32,2 m, 1,6 m overhellend boven de ingang) door tot +18,9 m en
  zwiept weer op naar de achterpunt boven de glasgevel (+27,2 m). In het
  midden p 0,8 (het AHN wijkt op u = 0 tot 10 m hooguit 1 m af; het
  AHN-profiel is daar bijna recht), aan de voorkant de holle kap van de
  foto's (p 0,5 à 0,75). Links en rechts de hoorns (west +31,9 m, oost +28,4
  m): holle kegels met r(z) = r0 (1 - z/h)^2,2, waarvan de ringen van de
  dakrand naar de top krimpen, boven de eerste rietband rond, met de punt iets
  naar buiten gekruld; langs vier richtingen per hoorn binnen 1 à 2 m van het
  AHN (aan de rand en vlak onder de top meet het DSM 1 à 3 m hoger door de
  dikke rietrand en de cellen van 0,5 m). Elke hoorn heeft twee rietbanden
  van 0,25 à 0,35 m (op +14,5/+13,7 m waar de steile kegel begint en op
  +23,6/+22,5 m onder de donkere metalen pin). Schip en hoorns snijden elkaar
  in de kilgoten op +12 à +13 m; voor- en achterpunt zijn holle kegels die
  vanuit de kap opzwiepen.
- De dakrand ligt rondom op +4,4 m; de witte muren staan 1 m terug op een
  kraag van 45 graden, met om de 7,5 m een blinde rondboognis (3,2 m breed en
  hoog, 0,5 m diep) voor de arcade.
- De ingang aan de parkeerkant: een spitse opening onder de holle kap tot
  +19,7 m (de rand van de kap 0,8 m horizontaal en 0,7 m verticaal), 3 m diep in de
  overhellende voorgevel, met de houten "boom" (stam en drie paar takken van
  0,6 m) en het balkon (kraag van 45 graden). De glazen puntgevel aan de
  parkkant is een nis van 0,7 m onder de holle kap (van +8 tot +20,8 m) met
  drie stijlen en een schuine regel; ook die gevel helt naar buiten.
- De winkel (BAG 0809100000017169): muur r 12,6 m (de BAG-contour), dakrand r
  13,5 m op +4,4 m met een kraag, holle rieten kegel tot +25,2 m (de vijfde
  punt), zeven oogvormige dakkapellen (drie hoog op r 5,6 m, vier laag op r
  10,3 m, uit de luchtfoto) en tien raamnissen.
- De verbindingsvleugel tussen het entreegebouw en de winkel (15,4 m breed):
  zadeldak met de nok op +10,9 m, een lange dakkapel aan de oostkant (foto) en
  rondboognissen voor de doorgangen.

Printbaar op 1:1000 en 1:500: de punten hellen hooguit 26 graden over, de
hoorns krullen binnen hun voet, de dakranden rusten op een kraag van 45 graden
en het plafond van de ingang blijft overal steiler dan 46 graden. De export
vult alleen de getrapte kraag, de bovenkant van de nissen en de onderkant van
de rietbanden op: `building:entreegebouw` +0,49 % op 1:1000 en +0,35 % op
1:500, `building:winkel` +0,33 % en +0,39 %. De STL is 29,4 cm³.

Bronnen: PDOK AHN (dsm en dtm 0,5 m via WCS: de vijf toppen op NAP +41,1 /
+40,8 / +37,3 / +36,1 / +34,1 m, de dakrand per 5 graden, de dwarsprofielen
van het schip, de profielen van de hoorns en de winkel, de vleugel; maaiveld
NAP +8,9 m), de PDOK luchtfoto (nok, glasgevel, dakkapellen), PDOK BAG en de
PDOK-gebouwtegel (de zes panden),
[Wikipedia (nl)](https://nl.wikipedia.org/wiki/Huis_van_de_Vijf_Zintuigen)
(4500 m² riet, vijf punten, kassa's, gastenservice en winkel; ontwerp Ton van
de Ven, geopend 1996) en foto's op Wikimedia Commons (Category:The House of
the Five Senses). Geschat uit foto's: de dakrandhoogte en de muren 1 m terug,
de ingangsopening en de boom, de holle kap aan de voorkant, de glasgevel, de hoogtes van de rietbanden, de
kromming van de punten, de holheid van de hoorns (exponent 2,2), de plaats en
maat van de nissen en de dakkapellen. De toppen zijn het AHN-maximum; de dunne
metalen pinnen kunnen een halve meter hoger reiken. Weggelaten: de platte
goten met hekwerk in de kilgoten, het "EFTELING"-opschrift, de lantaarns en de
toegangspoortjes.
