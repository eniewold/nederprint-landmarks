# 013 (Tilburg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `013.glb` | Catalogusbron in meters: één node `building:013` met de zwarte doos onder het gebogen dak, de toneeltoren, het oostdeel, de plint, de entreehoek, de schijven, de lage strook en de gang |
| `013-1-1000.stl` | 013 in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (72 × 94 × 18 mm) |
| `013.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (134610, 396578) op het maaiveld
(NAP +14,5 m) en de glTF-conventie Y omhoog. +X loopt langs de noordgevel
tegen de parkeergarage (RD-richting 7,4 graden linksom vanaf het oosten), +Y
naar het noorden. De schuine westgevel staat aan de Veemarktstraat, de
entreehoek ligt in het zuiden aan de Heuvel. Het maaiveld wordt op vier
punten rondom op straat bemonsterd (`groundSamplePoints`), niet op de
parkeergarage; `groundHeight` (58,19 m, ellipsoïdisch) is de laagste
PDOK-terreinhoogte op die punten. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0855100000132248`, de zaal van 1998. De parkeergarage aan de
noordkant (`0855100000132247`, met het adres Veemarktstraat 44 in de BAG)
blijft een PDOK-pand; de PDOK-hoogtes van de buurpanden kloppen met het AHN.

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN tenzij anders
vermeld):

- Zwarte doos op de BAG-contour onder een gebogen dak: een cilindersegment
  langs de noordgevel met een kromtestraal van 203 m (parabool door 270
  AHN-punten, rest 0,19 m), kruin 14,07 m op 20 m van de oorsprong, aan de
  entreehoek 8,85 m.
- Toneeltoren van 17,2 × 23,6 m, vlak op 16,6 m.
- Oostdeel van 11,6 m breed, vlak op 11,45 m, met twee installatieblokken tot
  12,6 m, een opbouw tot 13 m langs de zuidrand en een lagere hoek op 8 m.
- Dakopbouwen: een blok van 8,2 × 7,3 m tot 14,7 m tegen de toneeltoren en
  een lichtkap van 15 × 7 m die van 13,05 naar 14,1 m naar het zuiden oploopt.
- Lage strook van 3,8 m tussen het dak en de parkeergarage en een gang van
  6 m breed en 42 m lang langs de oostgevel van de parkeergarage tot 7,5 m.
- Plint van 3,4 m die 0,5 m terugligt onder een kraag van 45 graden, met
  verticale plooien om de 1,2 m langs de west- en zuidgevel.
- Entree in de zuidhoek onder de uitkragende doos: 1,6 m diep, 4 m langs de
  westgevel en 9 m langs de zuidgevel, plafond onder 45 graden en een ronde
  kolom van 0,9 m op de hoek; een café-pui van 13 m breed en 1 m diep in de
  westgevel bij de erker.
- Drie gouden schijven van 2,8 m doorsnede en 0,9 m dik boven aan het
  noordeinde van de westgevel, elk op een steun van 45 graden.
- Naden tussen de gevelpanelen om de 2,7 m (0,3 m breed en 0,15 m diep), een
  groot raam hoog in de westgevel en vier smalle ramen hoog in de zuidgevel als
  blinde nissen van 0,4 m.

De plint, de kraag, de plooien, de entree, de café-pui, de schijven, de ramen
en de naden zijn uit foto's geschat; de lichtpunten in de gevel, de luifel bij
het café, de lampen, de reclame en de zonnepanelen op de toneeltoren zijn
kleiner dan 0,9 m of te dun en zijn weggelaten.

Printbaarheid: alles staat op dezelfde onderkant en de schuine vlakken
(kraag, plafond van de entree, steunen onder de schijven) staan op 45 graden.
Met de optie ‘Printbare overhang’ vult de export op 1:1000 2,0 % en op 1:1500
3,0 % op (de ronde onderkant van de schijven en de kolomkop); dat kost circa
0,3 seconde.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/013) (geopend 1998,
verbouwd 2007 en 2016), PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via
WCS: gebogen dak, toneeltoren, oostdeel, dakopbouwen, lage strook, gang en
maaiveld), de PDOK luchtfoto en foto's van Wikimedia Commons
(`Tilburg poppodium 013.jpg`,
`013-Gebouw-02022017-JostijnLigtvoetFotografie-33.jpg`) voor de plint, de
entreehoek, de schijven en de gevel.

Licentie van het model: eigen werk op basis van open bronnen.
