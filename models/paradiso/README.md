# Paradiso (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `paradiso.glb` | Catalogusbron in meters: één node `building:paradiso` met voorgebouw, risaliet, portaal, zaal, dakruiters, halfronde achterzijde en aanbouwen |
| `paradiso-1-1000.stl` | Paradiso in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (40 × 27 × 22 mm) |
| `paradiso.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de BAG-contour (bbox langs
de as) op het maaiveld (NAP +1,4 m) en de glTF-conventie Y omhoog. +X loopt
langs de as van de zaal van de voorgevel aan de Weteringschans naar de
halfronde achterzijde aan de Singelgracht (RD-richting (-0,620, -0,785), 128,3
graden rechtsom vanaf het oosten), +Y naar de tuin aan de zuidoostkant. Het
maaiveld wordt op vier punten bemonsterd (`groundSamplePoints`): twee op de
Weteringschans voor de gevel, één op het pad aan de noordwestkant en één in de
tuin, niet op de lagere kade (NAP +0,5 m) en het water van de Singelgracht
achter het gebouw en niet in de verdiepte nachtingang naast de zaal, die in het
PDOK-terrein 0,6 tot 1,5 m lager ligt. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0363100012169473`; de buurpanden aan het Max Euweplein staan
9 m verderop en blijven staan.

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN tenzij anders
vermeld):

- Muren op de hele BAG-contour: voorgevel 20,6 m breed, zaal 20,3 m breed,
  van de voorgevel tot de achterzijde 38,6 m.
- Voorgebouw van 7,9 m diep: goot 17,9 m, schilddak met de nok dwars op de as
  tot 20 m.
- Middenrisaliet van 5,4 m breed met een topgevel en dwarskap tot de nok, twee
  pinakels van 1 m in het vierkant tot 19,6 m en een ronde blinde nis van 2,4 m
  (roosvenster en klok) met een kegelvormige wand onder 52 graden.
- Ingangsportaal van 3,8 m breed en 1,1 m voor de gevel met een zadeldakje tot
  6,9 m (uit foto's geschat).
- Grote zaal van 26 m lang: goot 12,9 m, dakvlakken onder 24 graden tot 3,6 m
  uit de as, daar een trede van 0,8 m naar de verhoogde middenstrook, nok
  18,15 m; twee dakruiters van 2,4 m in het vierkant tot 20,7 m.
- Halfronde achterzijde als cirkelsegment van de BAG-boog (straal 10,1 m):
  muur tot 12,6 m, kegeldak onder 42 graden tot 16,5 m tegen de kopgevel van de
  zaal.
- Lage aanbouwen aan de tuinzijde, buiten de BAG-contour: een lessenaar van
  2,6 m breed langs de zaal (6,6 tot 5,9 m) en een uitbouw met zadeldak tot
  6,95 m die 6,8 m de tuin in steekt.
- Vijf spitsboognissen van 1,6 m breed en 0,35 m diep per zijgevel van de zaal
  (uit foto's geschat).

Er hangt niets vrij over: de steilste naar beneden gerichte vlakken (de
bovenkant van de nissen) staan 52 graden of steiler. Met de optie ‘Printbare
overhang’ blijven de nissen daardoor open (op 1:1000 circa 3 % minder volume
dan met de verticale opvulling; de opvulling kost circa 0,1 seconde). Staat de
optie uit, dan vult de export verticaal op en worden de nissen dicht gezet.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Paradiso_(Amsterdam))
(G.B. en A. Salm, 1880), het [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/6400)
(nr. 6400: hoofdingang aan de Weteringschans, halfrond deel aan de
Singelgracht, driebeukige zaal), PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m
via WCS: goot- en nokhoogtes, middenstrook, dakruiters, kegeldak, aanbouwen en
maaiveld), de PDOK luchtfoto en foto's van Wikimedia Commons
(`Amsterdam_Paradiso.jpg`, `Voor_en_linker_zijgevel_-_Amsterdam_-_20021777_-_RCE.jpg`)
voor de gevelopbouw. Het portaal, de pinakels, de ronde nis en de
spitsboognissen zijn uit foto's geschat; de vensters, lisenen, rondboogfriezen,
schoorstenen en het gevelornament zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
