# Patronaat (Haarlem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `patronaat.glb` | Catalogusbron in meters: één node `building:patronaat` met de voorbouw en de voorgevel, de grote zaal met de lichtstraat, de hoge strook met installaties en de lagere aanbouwen |
| `patronaat-1-1000.stl` | Patronaat in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (33 × 55 × 21 mm) |
| `patronaat.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Poppodium Patronaat (DiederenDirrix, 2005) aan de Zijlsingel. De GLB is in
meters met de oorsprong op RD (103345, 488623) op het maaiveld (NAP +1,0 m) en
de glTF-conventie Y omhoog. +X loopt langs de Zijlsingel (RD-richting 67,0
graden linksom vanaf het oosten), +Y naar de Ruychaverstraat. Het maaiveld
wordt op drie punten op de Zijlsingel bemonsterd (`groundSamplePoints`), niet
op de lagere Ruychaverstraat (NAP +0,4 m); `groundHeight` (43,95 m,
ellipsoïdisch) is de laagste PDOK-terreinhoogte op die punten. Het
catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0392100000029892`; het
woonblok in het zuiden en het hotel in het noorden blijven PDOK-panden en hun
hoogtes kloppen met het AHN.

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN tenzij anders
vermeld; alle daken zijn plat):

- Voorbouw aan de Zijlsingel van 14,5 m diep tot 17,3 m, met een hoger
  middendeel (18,2 m) en een opbouw (19,5 m).
- Voorgevel (foto): glazen begane grond 0,6 m terug, de entree 1 m terug, een
  glazen doos met een kader van 0,6 m die 0,8 m uitsteekt op de verdieping
  (6,4 tot 11,2 m, onderkant onder 45 graden), een glazen kolom ernaast en
  daarboven de gaasband met verticale naden om de 1,75 m. De gevel loopt 0,5 m
  schuin over 31 m; de gevelelementen draaien mee.
- Grote zaal tot 12,3 m met een lichtstraat van 4,5 m breed tot 12,9 m.
- Hoge strook langs de zaal tot 17,7 m met installaties tot 19,6 m.
- Lage aanbouw aan de noordoostkant (8,0 m), het achterdeel aan de
  Ruychaverstraat (7,5 m) en een lage strook in de noordhoek (2,2 m).

Weggelaten: de letters PATRONAAT in de gaasband (lijnen van circa 0,6 m), de
koperkleur van het kader, de zonnepanelen en de lichtkoepels; de zij- en
achtergevels zijn vlak gelaten (geen foto's).

Printbaarheid: alles staat op dezelfde onderkant; de glazen doos heeft een
onderkant van 45 graden. Met de optie ‘Printbare overhang’ vult de export op
1:1000 1,9 % op en op 1:1500 2,8 % (circa 0,1 seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Patronaat_(Haarlem)),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: voorbouw, zaal,
lichtstraat, hoge strook, installaties, aanbouwen en maaiveld), de PDOK
luchtfoto en de foto `Haarlem Patronaat.jpg` van Wikimedia Commons.

Licentie van het model: eigen werk op basis van open bronnen.
