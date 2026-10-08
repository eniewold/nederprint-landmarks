# Brandaris (West-Terschelling)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `brandaris.glb` | Catalogusbron in meters: node `building:toren` (de vuurtoren met de verkeerspost en de lantaarn als gesloten solid) |
| `brandaris-1-1000.stl` | De toren in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (10 × 10 × 55 mm) |
| `brandaris.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (143484,02, 597117,75), in het hart
van de vierkante BAG-voetafdruk op het maaiveld ten noorden en zuiden van de
toren (NAP +5,5 m), en de glTF-conventie Y omhoog. +X loopt evenwijdig aan de
gevels (RD-richting -8,43 graden, oost-zuidoost); +Y wijst naar het
noord-noordoosten, het portaal zit in de zuidgevel. Het maaiveld ligt ten
noorden, westen en zuiden op NAP +5,3 tot +5,6 m en aan de oostkant op
+4,9 m; het wordt daarom alleen 8 m ten noorden en ten zuiden van het hart
bemonsterd (`groundSamplePoints`), en de vlakke onderkant ligt 1 m onder de
oorsprong. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0093100000215019`.

Onderdelen (hoogtes boven het maaiveld ten noorden en zuiden):

- De vierkante bakstenen toren van vier geledingen met banden op 13,2, 25,2
  en 37 m; elke geleding springt 8 cm terug. De gevels volgen de
  AHN-omhullende: de oost- en zuidgevel staan vrijwel loodrecht, de west- en
  noordgevel lopen taps toe, van 10,5 × 10,2 m bij de voet (BAG 10,1 ×
  10,15 m) naar 8,9 × 8,6 m onder het dak.
- Het rondboogportaal in de zuidgevel als blinde spitsboognis van 4,2 m
  breed en 6,2 m hoog, en in elke gevel zes kleine vensters (0,8 × 1,4 m)
  boven elkaar in de bovenste drie geledingen.
- Het dak met het open terras op 46,1 m (NAP +51,6 m) en daarop de glazen
  verkeerspost van de Kustwacht tot 49,15 m (NAP +54,65 m), 0,2 m binnen de
  rand en zonder de zuidoosthoek, waar het terras open ligt.
- De lantaarn (straal 1,9 m) tot 50,6 m met de koepel tot 53,7 m (NAP
  +59,2 m, het hoogste DSM-punt, met de radar), 0,2 m ten oosten van het hart.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 67 % van
de 419 DSM-cellen binnen 2 m (mediaan -0,02 m, mediane absolute afwijking
0,34 m); zonder de randcellen, die door de taps toelopende gevels half op de
toren vallen, 76 %. Op de bovenvlakken (DSM-cellen boven NAP +50 m) ligt 78 %
binnen 2 m, met de dakvloer van de verkeerspost 87 % (mediaan 0,00 m), de
lantaarn 89 % (-0,16 m) en het terras met de randen 49 % (-0,36 m, de
reling en de antennes ontbreken). Het model dekt 400 van de 410 DSM-cellen
boven NAP +15 m.

Printbaar op 1:1000 zonder steun: elke geleding springt naar boven terug, de
verkeerspost staat binnen de rand van de toren, de lantaarn en de koepel
worden alleen smaller naar boven en het portaal en de vensters zijn blinde
nissen met een spitse top; het script controleert dat de massa zonder nissen
geen vlak heeft dat vlakker dan 45 graden naar beneden wijst en dat alles op
dezelfde onderkant begint. De export van een uitsnede van 120 m op 1:1000
duurt circa 1,3 seconden; de toren gaat er als gesloten solid met
overhangopvulling doorheen (4,47 naar 4,50 cm³, de voet tot de onderplaat en
de toppen van de nissen) en het vervangen pand zit niet meer in de export. De
voet staat overal 0,8 tot 1,4 m in het PDOK-maaiveld.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Brandaris_%28vuurtoren%29)
(52,5 m hoog, vierkant, lichthoogte 55 m, gebouwd in 1594),
[Rijksmonumentenregister 35032](https://monumentenregister.cultureelerfgoed.nl/monumenten/35032)
("zware bakstenen toren van vier geledingen"), PDOK BAG (vierkante
voetafdruk van 10,1 × 10,15 m), PDOK AHN (dsm en dtm 0,5 m via WCS: breedte
per hoogte, terras, verkeerspost, lantaarn, maaiveld) en foto's op Wikimedia
Commons. Geschat zijn de hoogtes van de banden en de plaats en maat van de
vensters en het portaal (uit frontale foto's van de zuidgevel), de
terugsprong per geleding en het profiel van de lantaarn en de koepel (op het
DSM afgesteld). De reling, de radar, de antennes, de gevelstenen, het
ronde venster boven het portaal en de stoep zijn weggelaten, het portaal is
een spitse in plaats van een ronde boog, de vensters zitten in alle vier
gevels op dezelfde hoogtes, en het verloop van de gevels volgt het AHN, ook
waar dat de toren iets naar het zuidoosten laat hellen (0,4 m over 40 m).

Licentie van het model: eigen werk op basis van open bronnen.
