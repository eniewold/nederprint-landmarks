# Pieterskerk (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `pieterskerk-leiden.glb` | Catalogusbron in meters: node `building:kerk` (de hele kerk als gesloten solid) |
| `pieterskerk-leiden-1-1000.stl` | De kerk in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (90,1 × 62,0 × 45,6 mm) |
| `pieterskerk-leiden.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93462,30, 463655,35), het hart van
de kruising, op het maaiveld (NAP +1,9 m), en de glTF-conventie Y omhoog. +X
loopt langs de as van de westgevel naar het koor (RD-richting 10,2 graden, net
ten noorden van oost); +Y wijst naar het noorden. Het maaiveld wordt op het
Pieterskerkplein voor de westgevel en op de Pieterskerkhof ten noorden, zuiden
en oosten bemonsterd (`groundSamplePoints`, AHN NAP +1,8 tot +2,2 m).
`groundOffsetMetres` is 0, want alles begint al 0,5 m onder het maaiveld.
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0546100000040806`.

Onderdelen (hoogtes in NAP; het maaiveld ligt op circa NAP +1,9 m), allemaal
binnen de BAG-contour:

- Schip en koor onder één zadeldak: muren op 6,75 m van de as, goot +26,6 m,
  nok +35,4 m (52 graden), van de westgevel tot de koorsluiting, een halve
  achthoek met een schilddak.
- De dwarsbeuk (13,8 m breed) met topgevels aan de noord- en zuidkant, goot
  +26,3 m en nok +35,2 m.
- De dubbele zijbeuken met per travee van 6 m een dwars dak met de nok op
  +19,4 m, de goten op +16,0 m en een schild naar de buitenmuur, vijf aan
  elke kant, en tussen de zijbeuken en de dwarsbeuk lessenaarsdaken van
  +16,2 tot +19,6 m.
- De kooromgang rond koor en koorsluiting (7,6 m breed) met een lessenaarsdak
  van +20,3 m tegen het koor tot +15,8 m buiten, de kapel ten zuiden van het
  koor (plat dak +18,6 m) en de lage aanbouwen ten noorden en zuiden van het
  koor (+6 m).
- Het portaal voor de westgevel (lessenaarsdak tot +20,6 m) met de twee ronde
  traptorens (achtkant, 3 m breed) tot +29 m en een spits tot +35 m.
- De dakruiter net ten oosten van de kruising: een achtkante lantaarn van
  2,5 m tot +38 m en een spits tot +47 m, het hoogste punt.
- Steunberen tot +13 m waar de BAG-contour uitspringt, en vensters als
  spitsboognissen van 0,5 m diep: het grote venster in beide dwarsbeukgevels,
  het westvenster boven het portaal en één venster per travee in de
  zijbeuken.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 92 % van
de circa 13.300 DSM-cellen binnen 2 m (81 % binnen 1 m, mediaan +0,21 m); de
afwijkingen zitten in randcellen langs de gevels en goten, in de lagere
kapellen aan de oostkant van de kooromgang (+8 tot +12 m) en in het DSM-gat op
de zuidhelling van het schip.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken van
schip, dwarsbeuk en zijbeuken lopen onder 48 tot 63 graden omhoog, de
lessenaarsdaken en de kooromgang flauwer maar naar boven, de torentjes en de
dakruiter zijn minstens 2,5 m breed met spitsen die naar boven smaller
worden, en de vensters hebben een spitse bovenkant van 60 graden. Met
overhangopvulling op een uitsnede van 200 m op 1:1000 blijft het volume
gelijk (79,5 cm³ tegen 80,9 cm³ bij verticale opvulling, die de nissen
dichtzet). In de preview van de controle-uitsnede (132 m) staat de kerk op het
maaiveld en zit het vervangen pand niet meer in de export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Pieterskerk_%28Leiden%29)
(laatgotische kruiskerk vanaf 1390, toren ingestort in 1512, zijbeuken na
1465 verdubbeld), PDOK BAG (de contour met steunberen, traptorens en
aanbouwen), PDOK AHN (dsm en dtm 0,5 m via WCS: de dwarsprofielen van schip,
koor en dwarsbeuk, de daken van de zijbeuken en de kooromgang, de dakruiter,
de traptorens en het maaiveld), de PDOK luchtfoto en foto's op Wikimedia
Commons (de westgevel met de traptorens, de zuid- en noordkant). Geschat zijn
de hoogte van de lantaarn en de spits van de dakruiter (het DSM mist de dunne
punt), de hoogtes en de vorm van de traptorens (foto), het lessenaarsdak van
het portaal en de maten van de vensters. Vereenvoudigd: de lagere kapellen
aan de oostkant van de kooromgang liggen onder het doorlopende dak van de
omgang, de kapel ten zuiden van het koor heeft een plat dak, de pinakels en
traptorentjes van de dwarsbeukgevels, de dakkapellen en de dakvensters zijn
weggelaten.
