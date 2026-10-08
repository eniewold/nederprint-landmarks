# Python (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-python.glb` | Catalogusbron in meters: nodes `building:baan` (baan, steunwand, kolommen en voet) en `building:station` (station en geluidsschermen langs de remsectie) |
| `efteling-python-1-1000.stl` | De achtbaan op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (124 × 52,5 × 29,6 mm) |
| `efteling-python.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-python.mjs`](../../scripts/generate-efteling-python.mjs)
(gebruikt [`scripts/efteling-kit.mjs`](../../scripts/efteling-kit.mjs)).

De GLB is in meters met de oorsprong op RD (131906, 406497), het midden van
het station, op het maaiveld (NAP ca. +9,3 m), en de glTF-conventie Y omhoog.
+X loopt naar het noorden, langs de baan door het station, de lift en de
loopings, +Y naar het westen. Het maaiveld wordt op zes punten rond de baan
bemonsterd (`groundSamplePoints`: zuid van het station, tussen de loopings en
de kurkentrekkers, in de bocht onder de kurkentrekkers, midden in de helix,
tussen remsectie en lift en oost van de lift; DTM NAP +9,2 tot +9,6 m), niet
in de vijver bij de kurkentrekkers. Het station is geen BAG-pand, dus er is
geen PDOK-reconstructie om te vervangen (geen `replacesBuildings`). De
BAG-panden 0809100000016009 (ca. 120 m zuidelijker), 0809100000018245
(oostelijk van de keerbocht) en 0809100000017611 (aan het water westelijk van
de helix) horen niet bij de Python.

Onderdelen (hoogtes boven het maaiveld, bovenkant van de rails):

- De baan (676 m in het model, 750 m in het echt) als dichte band van 1,4 m
  breed met een driehoekige kiel tot 1,0 m eronder (zijvlakken onder 55°).
  In de loopings wijst de bovenkant naar het middelpunt, in de
  kurkentrekkers naar de as; in bochten helt hij tot 8°.
- Station (+1 m) en de bocht eronder naar het oosten, de lift (ca. 27°)
  langs RD-oost 131917,5 tot de top op +29 m, de keerbocht met straal 10 m
  op +24 m en de eerste val van 22 m langs RD-oost 131897,5.
- Twee verticale loopings in lijn naar het zuiden (druppelvorm, 10,4 en 10 m
  breed, top +18 en +17,5 m), met in- en uitloop 1,36 m naast elkaar.
- De bocht onder de loopings door (+5,5 m) en de dubbele kurkentrekker langs
  de vijver (twee volle rollen met straal 4 m over 29 en 26 m, top +13 m).
- De helix: aanloop langs de westkant op +5 m, een binnenring met straal
  10,5 m die tot +1,8 m zakt en weer stijgt, en de uitloop die de aanloop in
  het noordoosten op +8 m kruist en onder de val door naar de remsectie gaat.
- Steunen: onder de hoge, rechtop liggende baan een wand van 0,9 m met spitse
  openingen (poten van 1 m om de ~6 m, zijden onder 55°, top 1 m onder de
  kiel) als abstractie van het groene vakwerk onder lift en keerbocht en de
  kolommen elders; een zware kolom (1,1 m) tegen elke zijkant van de
  loopings; kolommen (1,0 m) onder de top en de zijlussen van de
  kurkentrekkers; een doorlopende voet onder de lage delen.
- Station: romp 9,5 × 20 m met plat dak op +8,1 m en een rood zadeldak boven
  het midden tot +9,6 m, aanbouw aan de westkant (+4,4 m), spitse nissen in
  de kopgevels waar de trein in- en uitrijdt en hoge vensternissen;
  geluidsschermen van 0,9 m dik en 3,9 m hoog aan weerszijden van de
  remsectie (36 m lang).

De luchtfoto is geen ware orthofoto: hoge delen staan er tot ca. 0,4 m per
meter hoogte naar het noorden verschoven (de keerbocht 9 m). De ligging van
alle baandelen komt daarom uit het AHN-DSM; de luchtfoto geeft het tracé en de
volgorde van de elementen.

Printbaar op 1:1000 en 1:500: de export vult alleen onder de ondersteboven
liggende delen op (de top van de loopings en kurkentrekkers krijgt een
spitse wig): +43 % volume op 1:1000, +23 % op 1:500; het station +0,01 %.
Een eerste versie op losse kolommen en portalen (zoals in het echt, nog op te
roepen met `--kolommen`) kreeg onder de hele baan een wand (+240 % op 1:1000)
en liep op 1:500 vast (terugval op verticale opvulling). De STL is 4,1 cm³ en
elk onderdeel één samenhangend deel.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Python_(Efteling))
(hoogte 29 m, valhoogte 22 m, 750 m baan, twee loopings en twee
kurkentrekkers, lay-out van de Carolina Cyclone),
[Wikipedia (en)](https://en.wikipedia.org/wiki/Python_(Efteling)), PDOK AHN
(dsm en dtm 0,5 m via WCS: ligging van de baan, hoogtes als maxima langs het
pad, station, maaiveld), de PDOK luchtfoto (8 cm) en foto's uit
[Commons](https://commons.wikimedia.org/wiki/Category:Python_(Efteling)).
Geschat zijn de loopinghoogte en -vorm (het DSM ziet 17-18 m), de straal en
de spoed van de kurkentrekkers, het verloop van de helix (in- en uitgang en
de kruising), de railhoogte in station en remsectie (+1 m), de kanteling in
de bochten en de steunafstanden; de steunwand is een abstractie. Weggelaten:
het water, de trein, de loopbruggen en leuningen langs de lift, de
wachtrijoverkapping oostelijk van het station.
