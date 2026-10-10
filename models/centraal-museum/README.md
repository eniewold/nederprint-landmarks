# Centraal Museum (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `centraal-museum.glb` | Catalogusbron in meters: nodes `building:agnietenklooster`, `building:agnietenstraat-3` en `building:stallen`, elk een gesloten solid |
| `centraal-museum-1-1000.stl` | Het hele complex in één stuk op 1:1000, met de onderkant (0,5 m onder het maaiveld) op het printbed (151,5 × 95,2 × 23,7 mm) |
| `centraal-museum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Het model wordt gemaakt door `scripts/generate-centraal-museum.mjs`.

## Oorsprong, assen en maaiveld

De GLB is in meters met de glTF-conventie Y omhoog. Na omzetting naar Z omhoog
ligt de oorsprong op RD (137085, 455070) in de kloostertuin, op het maaiveld
(NAP +3,1 m). +X loopt langs de Agnietenstraat naar het noordoosten (33 graden
tegen de klok in vanaf de RD-X-as, `xAxis` [0,838671, 0,544639]) en +Y
loodrecht daarop naar de straat. De westvleugel (-4,38 graden), de middenvleugel
(+6,76 graden) en de stallen (+20,9 graden) zijn elk in een eigen gedraaid
stelsel om dezelfde oorsprong opgebouwd, langs hun nokken en BAG-gevels.

Het maaiveld wordt bemonsterd op de Agnietenstraat, op het Nicolaaskerkhof en in
de kloostertuin (`groundSamplePoints`, AHN NAP +3,1 tot +3,2 m). `groundHeight`
46,36 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op die punten, als
terugval voor een uitsnede die maar een deel van het complex raakt.
`groundOffsetMetres` is 0: alle onderdelen beginnen 0,5 m onder het maaiveld,
zodat de stallen (terrein NAP +3,2 tot +3,5 m) en de lagere binnenplaats
(+3,0 m) er ook op staan.

Vervangt de PDOK-reconstructie van drie BAG-panden:
`NL.IMBAG.Pand.0344100000029906` (Agnietenstraat 1, het klooster met de kapel,
de traptoren en de glazen aanbouwen), `NL.IMBAG.Pand.0344100000081865`
(Agnietenstraat 3 met de glazen gebouwen erachter) en
`NL.IMBAG.Pand.0344100000081866` (de stallen, Nicolaasdwarsstraat 20).
Niet meegenomen, omdat het aparte gebouwen zijn: het nijntje museum
(Agnietenstraat 2, het voormalige Willem Arntsz Huis aan de overkant van de
straat), de Fundatie van Renswoude (Agnietenstraat 5) en de Nicolaikerk.

## Onderdelen

Hoogtes in NAP (maaiveld circa NAP +3,1 m). Elk dak is een vlak in het stelsel
van zijn vleugel; nokken en goten uit het AHN (0,5 m) en de LoD2.2-vlakken van
de 3D BAG (opname 2023), de muren op de BAG-contouren.

`building:agnietenklooster`:

- Straatvleugel: zadeldak van 57 graden met de nok op +20,0 m en de goot op
  +13,25 m, vier dakkapellen (zadeldakje tot +16,6 m) op elk dakvlak, twee
  rijen spitse vensternissen in zes traveeën aan de straat.
- Hoekpaviljoen aan het Nicolaaskerkhof: het westelijke dak van de westvleugel
  loopt als dwarsdak door tot de straat, zodat er aan de straat en aan het plein
  een steile topgevel staat, beide met een borstwering van 0,5 m boven het dak,
  een schoorsteen (+21,3 m) en vensternissen.
- Westvleugel: twee evenwijdige zadeldaken met steile buitenvlakken (61 graden,
  goot +13,4 m, nokken +20,0 m). In het zuidelijke deel ligt daartussen de
  kilgoot op +17,1 m (41 graden); in het noordelijke deel ligt sinds kort (3D
  BAG 2023, luchtfoto) een plat dak op +20,0 m tussen de nokken. Vier
  dakkapellen per dakvlak, zeven traveeën vensternissen in de westgevel. Het
  oostelijke dak loopt in het zuiden door tot de glazen schijf.
- Middenvleugel tussen de kloostertuin en de binnenplaats: zadeldak, nok +20,65
  m (bij de straat +20,0 m, de topgevel met de ingang), goot +14,1 m, vijf
  dakkapellen per dakvlak op een steek van 5,3 m, de lisenen van de BAG-contour
  (0,35 m) met een spitse vensternis in elke travee, de zuidgevel met
  borstwering en schoorsteen.
- Kloosterkapel langs de straat: zadeldak van 59 graden, goot +15,2 m, nok +23,6
  m, de schuine sluiting in het oosten als schild, het westeinde als steil schild
  op de middenvleugel, vier hoge spitsboogvensters en lage vensters aan de
  straat, twee kleine dakkapellen hoog op elk dakvlak (+21,7 m).
- Ronde traptoren (2,23 m straal) tot de kroonlijst op een kraag (+20,4 m),
  achtkante kap, lantaarn en spits tot +26,3 m.
- Glazen trapschijf (+17,0 m) en het lage glazen entreegebouw (+8,5 m) aan de
  zuidkant, en schoorstenen (+21,3 tot +21,5 m) uit het AHN.

`building:agnietenstraat-3`:

- Het hoge huis aan de straat met het lange achterhuis: mansardedak met een
  steil onderste vlak tot de knik op +19,3 m, een flauwer bovenste vlak en een
  plat dak op +21,2 m (aan de straat +21,4 m), een schild naar het zuiden,
  vijf dakkapellen met plat dak (+19,6 m), schoorstenen tot +23,6 m en
  vensternissen in vier verdiepingen aan de straat.
- Het lage achterhuis (+12,75 m), het glazen gebouw aan de binnenplaats (+7,3
  m) en de achtkante glazen paviljoenkap (+20,9 m).

`building:stallen`: de stallen van 1835 in vier blokken met schilddaken van 35
graden, nok +13,72 m, goot circa +10,2 m: het noordoostelijke blok met een
topgevel en de steilere glazen strook (58 graden, +9,6 tot +11,1 m) aan de
tuinkant, het verspringende middenblok, het hoekblok en de dwarsvleugel naar
het noordwesten, met rondboogvensters als nissen om de 3,6 m en een plint.

## Weggelaten

- Maaswerk, glas-in-lood, regenpijpen, smeedwerk en de kunstwerken in de tuin:
  kleiner dan 0,9 m.
- De lichtstraten op de platte daken: minder dan 0,9 m hoog.
- Het verdiepte glazen terras tussen de westvleugel en de glazen schijf: in
  het AHN op maaiveldhoogte, dus geen volume boven het maaiveld.
- De trapgeveltreden (schouderstukken) van de topgevels: als vlakke
  borstwering van 0,5 m gemodelleerd.

## Pasvorm op het AHN

Binnen de voetafdruk van het model ligt 84 % van de circa 13.400 DSM-cellen
binnen 1 m van het model (89 % binnen 2 m, mediaan -0,02 m). De afwijkingen
zitten in de bomen die over de stallen en de tuin hangen, de glazen daken (gaten
in het DSM), het platte dak in de noordelijke westvleugel (nieuwer dan het AHN)
en de randen van de dakkapellen en schoorstenen.

## Printbaarheid

Printbaar op 1:1000 zonder steun: de dakkapellen, schoorstenen en de lantaarn
staan op het dak, de kroonlijst van de traptoren staat op een kraag van 45
graden, de vensternissen hebben een spitse bovenkant (54 graden) en zijn 0,3
tot 0,4 m diep. Het script controleert dat geen ondervlak boven de onderkant
steiler dan 45 graden hangt. De printcontrole (`prepareMeshes` met
overhangopvulling op 1:1000, uitsnede van 185 m) geeft voor alle drie de nodes
status NoError en 0 % extra volume (19.851, 8.249 en 15.250 mm³).

## Geschat

- Ritme en maten van de vensternissen (foto's), de borstweringen van de
  topgevels (0,5 m) en de schoorsteen op de zuidgevel van de middenvleugel.
- De traptoren boven de kroonlijst: achtkante kap, lantaarn en spits (het AHN
  geeft +25,5 m op de as, de 3D BAG een te hoge kegel).
- De vensters van de stallen (alleen de tuingevel staat op foto's).
- De maten van de dakkapellen (breedte 1,2 tot 1,8 m, nok uit het AHN).

## Bronnen

[Wikipedia](https://nl.wikipedia.org/wiki/Centraal_Museum), PDOK BAG (contouren
van de drie panden, in het script als `bagOutlines()`), PDOK AHN (dsm en dtm 0,5
m via WCS: nokken, goten, dakkapellen, schoorstenen, traptoren en maaiveld), 3D
BAG LoD2.2 (api.3dbag.nl: hellingen, het platte dak van de westvleugel, de
glazen gebouwen en de paviljoenkap), de PDOK luchtfoto (indeling van de daken
en de dakkapellen) en foto's op Wikimedia Commons (straatgevel, kapel,
tuingevels, traptoren).
