# Oldehove (Leeuwarden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `oldehove.glb` | Catalogusbron in meters: node `building:toren` (de scheve toren met de uitkijkpost en de mast als gesloten solid) |
| `oldehove-1-1000.stl` | De toren in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (19 × 19 × 46 mm) |
| `oldehove.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (181895,64, 579667,21), in het hart
van de vierkante onderbouw (BAG) op het maaiveld ten noorden en zuiden van de
toren (NAP +2,75 m), en de glTF-conventie Y omhoog. +X staat loodrecht op de
oostgevel met de ingang aan het Oldehoofsterkerkhof (RD-richting -5 graden,
net ten zuiden van oost); +Y wijst naar het noordnoordoosten. Het maaiveld
loopt van NAP +3,1 m aan het plein (oost) naar +2,3 m aan de westkant; het
wordt daarom alleen 12 m ten noorden en ten zuiden van het hart bemonsterd
(`groundSamplePoints`). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0080100000356999`.

Onderdelen (hoogtes boven het maaiveld, halve maten langs X en Y):

- De vierkante onderbouw van 13,5 × 13,75 m (BAG) tot 11,6 m, met een
  spitsboogportaal van 4,9 m breed aan de oost- en westgevel, en na een
  waterslag de middengeleding (12,9 × 13,2 m) tot 26,4 m met een hoge
  spitsboognis van 6 m breed in elke gevel.
- De klokkengeleding van 11,7 × 11,5 m (het bovenvlak in het AHN-DSM) tot het
  vlakke dak op 39,05 m (NAP +41,8 m), met per gevel een galmgat van 2,4 m en
  twee smallere blinde bogen, en vierkante hoekpijlers van 3 m die 0,5 m
  buiten de gevels staan, met schuine kappen tot 38,6 m.
- Acht steunberen, twee op elke hoek loodrecht op de gevels, 2,3 m breed en
  tot 9,4 m (oost en west) en 9,53 m (noord en zuid) uit het hart (BAG), met
  waterslagen op 11 en 24 m en een schuine kap van 29 tot 31,6 m.
- De glazen uitkijkpost op het dak als blok van 2 × 2 × 2,4 m en de mast met
  de windvaan tot 45,7 m (NAP +48,5 m, de top van het DSM).
- De scheefstand als lineaire afschuiving: het hart van het dak ligt 0,9 m
  naar -X en 0,9 m naar +Y (1,27 m naar het noordwesten, 1,9 graden) ten
  opzichte van de onderbouw, zoals het bovenvlak in het DSM tegen de
  BAG-voetafdruk.

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 66 % van
de DSM-cellen binnen 2 m en 80 % binnen 5 m van het model, met een mediane
afwijking van -0,35 m (het DSM iets lager). Op het dak (567 cellen boven
NAP +40 m in het model) ligt 88 % binnen 1 m, en het model dekt 98 % van de
DSM-cellen boven NAP +40,5 m: de scheefstand valt dus samen met het DSM. De
afwijkingen zitten aan de randen van de steunberen en in een strook zonder
AHN-punten langs de zuidgevel (136 cellen).

Printbaar op 1:1000 zonder steun: elke geleding en steunbeer springt naar
boven terug met waterslagen die steiler zijn dan 45 graden, de scheefstand is
1,9 graden en de nissen zijn blind met een spitse top; het script controleert
dat de massa zonder nissen geen vlak heeft dat vlakker dan 45 graden naar
beneden wijst en dat alles op dezelfde onderkant begint. De export van een
uitsnede van 200 m op 1:1000 duurt circa 1,5 seconden; de toren gaat er als
gesloten solid met overhangopvulling doorheen (7,71 naar 8,32 cm³, vooral de
voet tot de onderplaat en de toppen van de nissen) en het vervangen pand zit
niet meer in de export. De voet staat 0,3 tot 1,1 m in het PDOK-maaiveld; aan
de westkant ligt het modelmaaiveld 0,2 m boven het PDOK-terrein, maar de
onderkant nog 0,3 m eronder.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Oldehove_%28gebouw%29)
(40 m, 4,2 graden scheef, 1529-1533),
[Engelse Wikipedia](https://en.wikipedia.org/wiki/Oldehove_%28tower%29) (39 m,
top 2 m uit het lood, scheefstand al tijdens de bouw),
[Rijksmonumentenregister 24331](https://monumentenregister.cultureelerfgoed.nl/monumenten/24331)
(onvoltooide laatgotische toren), PDOK BAG (voetafdruk met de steunberen),
PDOK AHN (dsm en dtm 0,5 m via WCS: dakhoogte, bovenvlak en scheefstand, mast,
maaiveld) en foto's op Wikimedia Commons. Geschat zijn de hoogtes van de
geledingen, waterslagen en hoekpijlers en de maten van de nissen (uit een
frontale foto vanaf het plein, met het dak als maatstok), de uitkijkpost en de
dikte van de mast. De scheefstand komt uit het AHN (1,27 m op het dak) en is
kleiner dan de 2 m uit de literatuur; de knik die de bouwers in de toren
legden om de helling te compenseren is als rechte afschuiving vereenvoudigd,
en de kleine vensters, de uurwerken, de borstwering en de bliksemafleiders op
het dak zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
