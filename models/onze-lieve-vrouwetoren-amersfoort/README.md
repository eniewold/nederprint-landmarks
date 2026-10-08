# Onze-Lieve-Vrouwetoren (Amersfoort)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `onze-lieve-vrouwetoren-amersfoort.glb` | Catalogusbron in meters: node `building:toren` (de vrijstaande toren met lantaarn en houten bekroning als gesloten solid) |
| `onze-lieve-vrouwetoren-amersfoort-1-1000.stl` | De toren in één stuk op 1:1000, met de onderkant (1,5 m onder het maaiveld) op het printbed (16 × 16 × 100 mm) |
| `onze-lieve-vrouwetoren-amersfoort.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (154999,97, 463000,13), in het hart
van de vierkante onderbouw (BAG) op het maaiveld ten noorden en zuiden van de
toren (NAP +3,4 m), en de glTF-conventie Y omhoog. Het hart ligt op 13 cm van
het nulpunt van het RD-stelsel, dat vroeger op de spits van deze toren lag.
+X staat loodrecht op de gevel met het portaal aan het Lieve Vrouwekerkhof,
waar tot 1787 de kerk stond (RD-richting 25,5 graden, oostnoordoost); +Y wijst
naar het noordnoordwesten. Het maaiveld loopt over de toren heen van NAP
+4,2 m op het Lieve Vrouwekerkhof naar +2,2 m aan de westkant; het wordt
daarom alleen 12 m ten noorden en ten zuiden van het hart bemonsterd
(`groundSamplePoints`), en de vlakke onderkant ligt 1,5 m onder de oorsprong
zodat de voet ook aan de lage westkant in het maaiveld staat. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0307100000333887`.

Onderdelen (hoogtes boven het maaiveld ten noorden en zuiden):

- De vierkante onderbouw van 14 × 14 m (BAG) tot de band met de omgang op
  31,1 m, met het spitsboogportaal van 4,4 m breed aan het Lieve
  Vrouwekerkhof (vanaf 1,1 m, het niveau van het plein) en in elke gevel een
  hoge nis van 4 m, een smalle nis van 2,4 m en twee hoge blinde vensters van
  2,6 m.
- Acht hoeksteunberen, twee op elke hoek in het verlengde van de gevels,
  1,45 m breed en 1,17 m diep (BAG), met waterslagen op 12 en 22 m en een
  schuine kap van 28,9 tot 30 m.
- De tweede geleding van 12,4 × 12,4 m tot 49,4 m met per gevel een galmgat
  van 2,2 m en twee blinde vensters van 1,7 m, en hoeksteunberen van 1,2 m
  breed en 0,6 m diep; daarop een schuine kraag en de omgang van 13,2 × 13,2 m
  tot 52,6 m (de vloer in het AHN-DSM op NAP +55 m) met vier hoekpinakels
  tot 56,6 m.
- De achtkantige zandstenen lantaarn (apothema 5,1 m onderaan en 4,9 m
  bovenaan) tot 73,5 m, met een hoge nis in elk vlak op de assen, smallere op
  de diagonalen, en steunberen op de diagonalen met pinakels tot 76,5 m.
- De houten bekroning als omwentelingslichaam: de omgang (straal 3,4 m) tot
  75,2 m, de open lantaarn (dicht, straal 2,6 m) tot 80 m, de peer (straal
  2,8 m) tot 86,2 m, de bovenste lantaarn (straal 1,3 m) tot 89,8 m, de kroon
  tot 93,4 m, de bol en de spits met de haan tot 98,33 m (NAP +101,4 m).

Vergelijking met het AHN-DSM: het DSM heeft een grote strook zonder punten
langs de oostgevel en op de gevels vooral schuin getroffen punten, dus
binnen de voetafdruk van het model ligt maar 39 % van de DSM-cellen binnen
2 m (58 % binnen 5 m, mediaan +0,55 m). Op de bovenvlakken (DSM-cellen boven
NAP +43 m) ligt 48 % binnen 2 m en 69 % binnen 5 m, met een mediane afwijking
van +0,26 m; per hoogte: omgang en tweede geleding +0,5 m, lantaarn +0,2 m,
bekroning -0,1 m. Het model dekt alle 293 DSM-cellen boven NAP +60 m. De
bekroning is op het DSM afgesteld (straal per hoogte: 2,0 m op 85 m, 1,5 m op
89 m, 1 m op 92,5 m, het hoogste punt van het DSM op NAP +98,1 m bij de bol).

Printbaar op 1:1000 zonder steun: elke geleding springt naar boven terug, de
steunberen hebben waterslagen die steiler zijn dan 45 graden, de omgang rust
op een kraag van 56 graden, de bekroning wordt alleen via schuine randen
breder en de nissen zijn blind met een spitse top; het script controleert
dat de massa zonder nissen geen vlak heeft dat vlakker dan 45 graden naar
beneden wijst en dat alles op dezelfde onderkant begint. De export van een
uitsnede van 150 m op 1:1000 duurt circa 1,5 seconden; de toren gaat er als
gesloten solid met overhangopvulling doorheen (11,91 naar 12,10 cm³, vooral
de voet tot de onderplaat en de toppen van de nissen) en het vervangen pand
zit niet meer in de export. De voet staat overal 0,5 tot 2,7 m in het
PDOK-maaiveld (0,5 tot 0,9 m aan de westkant, 2,6 m aan het Lieve
Vrouwekerkhof).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Onze_Lieve_Vrouwetoren_%28Amersfoort%29)
(98,33 m tot de haan, twee vierkante geledingen met steunberen, een
achtkantige zandstenen lantaarn en een houten bekroning, circa 1444-1470),
[Rijksmonumentenregister 7940](https://monumentenregister.cultureelerfgoed.nl/monumenten/7940)
(laatgotische toren, bekroning van 1655 die bij de restauratie in de 19e
eeuw lager werd), PDOK BAG (voetafdruk met de steunberen), PDOK AHN (dsm en
dtm 0,5 m via WCS: breedte per hoogte, omgang, lantaarn, bekroning,
maaiveld) en foto's op Wikimedia Commons. Geschat zijn de hoogtes van de
geledingen, banden en waterslagen en de maten van de nissen (uit een foto
vanaf het Lieve Vrouwekerkhof, met een perspectieffit op het maaiveld, de
omgang uit het DSM en de top), de diepte van de steunberen op de tweede
geleding en de lantaarn, en de vorm van de bekroning (op het DSM afgesteld).
De open lantaarns en de kroon zijn dicht, het traptorentje tegen de
lantaarn, de borstweringen, de tracering, de uurwerken en de haan zelf zijn
weggelaten, en de 98,33 m is vanaf het maaiveld ten noorden en zuiden
genomen.

Licentie van het model: eigen werk op basis van open bronnen.
