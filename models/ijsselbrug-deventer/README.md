# IJsselbrug (Deventer)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ijsselbrug-deventer.glb` | Catalogusbron in meters: node `road:rijbaan` (de bovenste 0,5 m van beide rijbanen met de BGT-attributen, zie hieronder) en `building:ijsselbrug-deventer` met de rest van het kunstwerk: de dekplaat op twee kokers met schampkanten en middenberm, de twee rivierpijlers, de 22 wanden van de elf aanbrugpijlers en de twee landhoofden |
| `ijsselbrug-deventer-1-3000.stl` | De brug als geheel in één stuk (constructie en rijbaan samen, ongewijzigd) op 1:3000 met een printvoet onder het dek, met de onderkant (1,0 m onder de waterspiegel) op het printbed (369 × 13 × 6 mm; met `--scale` een andere schaal, op 1:1000 is hij 1108 mm lang) |
| `ijsselbrug-deventer.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De IJsselbrug is de brug van de A1 over de IJssel ten zuiden van Deventer,
tussen Twello (west) en Deventer (oost), opengesteld op 21 november 1972 en
in 2020 heringericht van 2 × 2 rijstroken met vluchtstrook naar 2 × 4
rijstroken. Op deze plek ligt één brug: de BGT heeft één dekvlak van 34,6 m
breed voor beide rijrichtingen, en de luchtfoto toont één doorlopend dek met
een middenberm. De Wilhelminabrug in de stad ligt ruim 2 km noordelijker en
is een eigen catalogusitem; de modellen raken elkaar niet.

De GLB is in meters met de oorsprong op RD (208202,12, 471751,05) (WGS84
52,23126 N, 6,16597 O, circa 110 m ten oosten van de controle-URL), op de as
van het dek midden in de hoofdoverspanning, op de waterspiegel van de IJssel
zoals het PDOK-terrein die legt (46,68 m ellipsoïdisch, NAP +3,36 m; PDOK =
NAP + 43,32 m) en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
oostnoordoosten, naar Deventer (`xAxis` (0,92841, 0,37155), 21,81 graden
linksom vanaf het oosten, uit de BGT-dekranden, die over 1100 m recht en
evenwijdig zijn), +Y naar het noordnoordwesten (de rijbaan richting
Apeldoorn). Het westelijke landhoofd ligt op x = -664,9 tot -655,74, het
oostelijke op 433,86 tot 442,65 (BGT). Het maaiveld wordt op zeven punten op
het water bemonsterd (`groundSamplePoints`: vijf op de IJssel 25 tot 35 m
naast de as tussen x = -40 en 60, twee op de strang in de westelijke
uiterwaard op x = -360); `groundOffsetMetres` is 0, want het PDOK-terrein legt
de IJssel op 46,68 tot 46,73 m en de strang op 46,85 m. `groundHeight` is
46,68 m, de PDOK-waterspiegel, zodat een uitsnede die alleen een aanbrug raakt
(de uiterwaarden liggen in PDOK op 47,2 tot 50,7 m) het model niet laat
wegvallen. `replacesBuildings` is leeg: onder de brug ligt geen BAG-pand. PDOK
reconstrueert de brug zelf niet; het BGT-dekvlak ligt daar als vlak op het
maaiveld en de voetafdrukken van de pijlers als vlakjes in het gras.

Wegdelen met PDOK-attributen: de bovenste 0,5 m van het wegdek is een eigen
node van klasse `road` met de attributen van de actuele BGT-wegdelen erop
(relatieve hoogteligging 1, zonder `eind_registratie`) in
`extras.attributes`, zodat de kleurregels van een thema op de brug werken
zoals op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan autosnelweg | gesloten verharding | asfalt | `L0002.073cc8ca61de4e57a8e39958ae2b6d92` (zuidelijke rijbaan, richting Deventer), `L0002.c495665a0da444429f3aeb5469e56ff6` (noordelijke rijbaan, richting Apeldoorn) | tussen de zuidelijke schampkant (y = -15,8) en de middenberm (-0,8), en tussen de middenberm (0,8) en de noordelijke schampkant (15,7); BGT -15,8 tot -0,8 en 0,8 tot 15,7 m naast de as, van landhoofd tot landhoofd |

De randen buiten de rijbanen (1,5 m) en de middenberm (1,56 m) hebben in de
BGT geen eigen wegdeel; ze blijven als schampkanten (0,6 m hoog) en als
geleider (0,8 m) constructie. De laag is een snijstrook over de volle breedte
en 0,5 m voorbij de landhoofden, van 0,5 m onder tot 1 m boven het wegdek over
de stations van het dek (om de 2 m); de schampkanten en de middenberm blijven
over hun hele hoogte met 2 cm vrij constructie. De volumes tellen op tot die
van de brug als geheel (constructie 128.075 m³, rijbaan 16.569 m³, samen
144.644 m³, geen overlap; het script controleert dat). De rijbaan bestaat uit
twee stukken (de middenberm scheidt de rijrichtingen). Verticale stralen
(`zfight.py`, 30.000 punten over het dek) vinden geen samenvallende
bovenvlakken en geen vlakken zonder dikte. De STL is ongewijzigd: het hele
brugmodel in één stuk.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 1107,6 m tussen de achterkanten van de landhoofden, 34,6 m
  breed: een dekplaat van 0,6 m aan de randen en 1,0 m vanaf de lijven en
  tussen de kokers, op twee kokers naast elkaar, elk zo breed als de wand
  eronder (10,9 m onderaan, de lijven 0,5 m naar buiten hellend), met 6,4 m
  tussenruimte. Het wegdek volgt het AHN-DSM als lengteprofiel om de 10 m:
  +17,47 m aan het westelijke landhoofd, oplopend tot +19,3 m boven de
  rivierpijlers, +18,79 m in het midden van de hoofdoverspanning (die ruim
  een halve meter is doorgezakt door kruip van het beton) en +18,37 m aan het
  oostelijke landhoofd.
- De toog: boven de rivierpijlers zijn de kokers 7,5 m hoog (onderkant
  +11,8 m, vlak over 2,5 m aan weerszijden van het pijlerhart), in de
  hoofdoverspanning loopt de onderkant parabolisch op naar 4,2 m in het
  midden (+14,59 m), in de zijoverspanningen in 50 m terug naar de 4,2 m van
  de aanbruggen.
- De hoofdoverspanning van 150,5 m op twee rivierpijlers (BGT, x = ±75,27):
  wanden van 4,3 m dik en 38,2 m lang (30,2 m recht met spitse koppen, die
  naast het dek uitsteken), tot 0,3 m in de kokers.
- Zijoverspanningen van 80,5 m, daarbuiten aanbrugvelden van 74,0 m (zes aan
  de westkant, drie aan de oostkant) en eindvelden van 56,0 m; per pijler twee
  wanden van 2,0 × 10,9 m met ronde einden (BGT), 3,2 tot 14,12 m naast de as,
  één onder elke koker, op x = -155,79 - 74 k (k = 0..6) en 155,79 + 74 k
  (k = 0..3).
- De twee landhoofden als blokken onder het dekeinde in de dijken.
- Op het dek de schampkanten met de borstwering aan beide randen (1,5 m
  breed, 0,6 m hoog) en de middenberm met de dubbele geleiderail als geleider
  van 1,56 m breed en 0,8 m hoog.

Wat er niet in zit: lantaarnpalen, leuningen en geleiderails op palen
(kleiner dan 0,9 m), het seinportaal boven de rijbanen bij de westelijke
rivierpijler (een vrije overspanning van 35 m van buizen en een vakwerkligger
die op 1:1000 niet zonder steun print; de export zou er een wand tot het dek
onder zetten), dilatatievoegen, afwatering en de bekleding van de
dijktaluds onder de landhoofden (PDOK-terrein).

Pasvorm op het AHN: het wegdek is het gemeten lengteprofiel (25e percentiel
van het AHN-DSM over beide rijbanen, gladgestreken over 25 m); de afwijking
per rijbaan is hooguit 0,1 m (de noordelijke rijbaan ligt aan de oostkant
tot 8 cm lager). De rijbanen liggen in de BGT 1,4 tot 1,5 m binnen de
dekranden en 0,8 m naast de as, wat de schampkanten en de middenberm geeft.

Printbaarheid: dragende delen zijn minstens 2,0 m (wanden) en 4,3 m
(rivierpijlers). Vrij hangen alleen de onderkant van de kokers en van de
uitkragende dekplaat (samen 34.978 m²). Het script controleert dat alles op
dezelfde onderkant begint en dat de printversie (met een wig van minstens 50
graden vanaf de dekrand onder de buitenste kokerhoeken door en een scherm van
1,35 m tussen de kokers) geen overhang heeft (0,52 m² aan losse facetjes). In
de printcheck (gesloten solid met overhangopvulling, status `NoError` voor
beide nodes): de hele brug op 1:3000 (357 mm) -9 %, op de grootste uitsnede
(400 mm, 1:2678) -5,9 %, en een uitsnede van 390 m rond de hoofdoverspanning
op 1:1000 -8 % (de opvulling valt binnen het al gevulde volume onder het
dek). De rijbaan krijgt geen eigen opvulling (0 %): de constructie draagt
alles.

Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek en
maaiveld): de constructiehoogtes (4,2 m over de aanbruggen en in het midden
van de hoofdoverspanning, 7,5 m boven de rivierpijlers) en de lengte van de
toog in de zijoverspanningen (50 m), de breedte van de kokers (gelijk aan de
wanden), de tussenruimte en de dikte van de dekplaat, de hoogte van de
schampkanten (0,6 m) en de middenberm (0,8 m), en de bovenkant van de
pijlers (0,3 m in de koker). De rivierpijlers zijn symmetrisch gemaakt (de
BGT-contouren wijken 0,1 tot 0,3 m af).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/IJsselbrug_(Deventer))
(opening 21 november 1972, verbreding naar 2 × 4 rijstroken in 2020); PDOK
BGT overbruggingsdeel (dek `L0002.e82d5e2f3b1e48e0891ee13f8d58154c`,
landhoofden `L0002.2cfbb201efd2499898cd2636880153fc` en
`L0002.91a9f7c3ec70424fbfadb5707dbcdb25`, rivierpijlers
`L0002.3c0a668f97a24b08b80780e50add1d14` en
`L0002.5401d8f1da534a9b84df892568fe85c1`, 22 wanden van de aanbrugpijlers)
en wegdeel; AHN DSM/DTM 0,5 m (PDOK WCS) voor het wegdek en de uiterwaarden;
PDOK-luchtfoto voor de indeling van het dek; PDOK-terrein voor de
waterspiegel; Wikimedia Commons-foto's: *IJsselbrug A1 bij Deventer.jpg*,
*IJsselbrug A1 bij Deventer (2).jpg*, *IJsselbrug A1.jpg* en *A1 bij
Deventer.jpg*.

Licentie van het model: eigen werk op basis van open bronnen.
