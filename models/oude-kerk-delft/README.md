# Oude Kerk (Delft)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `oude-kerk-delft.glb` | Catalogusbron in meters: node `building:kerk` (de kerk met de scheve toren, uit dakvlakken en bouwdelen) |
| `oude-kerk-delft-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (85 × 62 × 77 mm) |
| `oude-kerk-delft.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (84192,5, 447635,2), in het schip,
op het maaiveld (NAP +1,7 m), en de glTF-conventie Y omhoog. +X loopt langs de
nok van schip en koor naar het oosten (8,3 graden linksom vanaf de RD-X-as,
gemeten aan de normalen van de LoD2.2-dakvlakken) en +Y loodrecht daarop naar
het noorden; de toren staat in het westen aan de Oude Delft. Het maaiveld wordt
bemonsterd aan de Oude Delft, aan de noordzijde en achter het koor
(`groundSamplePoints`, NAP +1,6 tot +1,7 m; aan de Heilige Geestkerkhof aan de
zuidkant ligt het 0,35 m hoger). Als geen van die punten in de uitsnede valt,
gebruikt de lader `groundHeight` 45,19 m (de ellipsoïdische PDOK-terreinhoogte op
die punten). Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0503100000022523`
(kerk en toren in één pand; de PDOK-toren is daar een bundel losse zuilen).

Onderdelen (hoogtes boven het maaiveld op NAP +1,7 m, 84,6 bij 61,7 m en 76,6 m
hoog met de onderkant), opgebouwd uit bouwdelen met rechte dakvlakken
z = a u + b v + c (nokken, goten en hellingen uit het AHN en de 3D BAG):

- Schip en koor: één zadeldak met de nok op +31,8 m (v = 0,15 m, 56 graden),
  15,5 m breed tussen de muren, van de toren (u = -19,6 m) tot de sluiting: vijf
  zijden van een tienhoek rond (42, 0,15) met dezelfde goot, dus de nok eindigt
  op u = 42 m. Een borstwering van 0,8 m tot +22 m langs de goot en vier
  steunberen op de hoeken van de sluiting tot +20,1 m.
- Viering: een dwarsdak met de nok langs v op u = 16,7 m (+31,8 m), dat met het
  schip kilgoten in een kruis vormt, een topgevel aan de zuidkant (+32,6 m) en
  een achtkantige dakruiter van 2,6 m met een spits tot +39,8 m (het AHN-maximum
  daar).
- Zijbeuken met elk een eigen zadeldak en een topgevel naar de Oude Delft:
  noord (v 7,8 tot 21,1 m) met de nok op +21,5 m op v = 13,5 m (58 graden), zuid
  (v -16,9 tot -7,5 m) met de nok op +18,8 m op v = -11,75 m (60 graden); de
  noksporen liggen niet in het midden, zoals in het AHN. Steunberen (1,0 m) per
  travee langs beide gevels.
- Noorderzijbeuk van het koor (nok +22 m op v = 12,3 m) met een driezijdige
  sluiting naar het oosten, een kapel ten noordoosten (nok +19 m, hoge noordmuur
  +17,7 m), de zuiderzijbeuk van het koor (nok +17,2 m op v = -9,6 m) met een
  buitenmuur die schuin naar de sluiting loopt, een lage aanbouw ten zuiden van
  het koor (+6 m) en de noordkapel tegen het dwarsschip (zadeldak +12,4 m).
- Noordelijk dwarsschip (u 9,8 tot 23,6 m, tot v = 33,7 m): het onvoltooide
  natuurstenen dwarsschip van Keldermans met een plat dak op +27 m, een
  verhoogde rand aan de noordgevel en twee steunberen met pinakels tot +27,3 m.
- Het achtkantige portaal tegen de zuidwesthoek met een tentdak tot +9,7 m.
- De toren: een onderbouw van 14,8 m in het vierkant (hart van de voet u = -24,8
  m) met getrapte steunberen op de westhoeken en een westportaal, die tot de
  knik op +33 m 0,8 m naar het westen helt (afschuiving); daarboven recht
  doorgebouwd tot +46 m met twee galmgaten per zijde, een bovenste geleding van
  12,8 m tot +51,5 m, vier achtkantige hoektorentjes van 3,0 m met spitsen tot
  +61 m en een gemetselde achtkantige spits van 9,0 m tot +76,1 m (het hoogste
  AHN-punt), waarvan de top 2,1 m ten westen van het hart van de voet staat
  (Wikipedia: 1,96 m uit het lood), met vier pinakels aan de voet.
- Vensternissen als spitsbogen, 0,5 m diep: per travee in beide zijbeuken, in de
  westgevels van de zijbeuken, de noordgevel en de zijgevels van het dwarsschip,
  in de vijf zijden van de koorsluiting, en blinde bogen op de onderbouw van de
  toren.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 71,6 % ligt binnen 1 m en 82,1 % binnen 2 m. De grootste
afwijkingen zitten in de toren (de spitsen en torentjes zijn voor het AHN te
dun, de galmgaten en de klokken geven gaten), op de gevelranden en in de
noordoosthoek, waar de zijbeuk van het koor in het AHN lager ligt.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal (de
scheefstand van de onderbouw is 1,4 graden), op de spitsbogen van de vensters
na (steiler dan 45 graden), en alles staat op het maaiveld. De export vult op
1:1000 en 1:1500 niets bij en op 1:2500 0,5 %. De STL is 73,6 cm³, heeft 2.470
driehoeken en is één samenhangend deel (status NoError). Dunste delen op 1:1000:
de spitsen van de hoektorentjes en de toren 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Oude_Kerk_%28Delft%29)
(toren van 75 m, 1,96 m uit het lood, knik doordat recht is doorgebouwd, het
onvoltooide noordelijke dwarsschip), PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via
WCS), 3D BAG LoD2.2 (api.3dbag.nl), de PDOK luchtfoto en foto's op Wikimedia
Commons van alle zijden. Geschat zijn de hoogte van de knik en de verdeling van
de scheefstand over onder- en bovenbouw, de geledingen van de toren en de
hoektorentjes, de dakruiter, de steunberen, de portalen en de vensternissen en
galmgaten. Weggelaten: maaswerk, de wijzerplaten, kruisbloemen, de klokkenstoel
en de dakramen.
