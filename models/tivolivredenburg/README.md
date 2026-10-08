# TivoliVredenburg (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `tivolivredenburg.glb` | Catalogusbron in meters: één node `building:tivolivredenburg` met de doos en de twee noppengevels, het dakoverstek met het witte zaalvolume, de cilinderzaal en de buitentrap, de uitkragende zalen, de Ronda, de dakinstallaties en de onderbouw van het oude Vredenburg |
| `tivolivredenburg-1-1000.stl` | TivoliVredenburg in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (91 × 68 × 49 mm) |
| `tivolivredenburg.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de BAG-contour (bbox langs
de as) op het maaiveld (NAP +3,7 m) en de glTF-conventie Y omhoog. +X loopt
langs de westgevel aan de Catharijnesingel van het Vredenburg naar Hoog
Catharijne (RD-richting (0,494, -0,869), 60,4 graden rechtsom vanaf het
oosten), +Y naar het Vredenburgplein. Het maaiveld wordt op vier punten
bemonsterd (`groundSamplePoints`): op het Vredenburg voor de noordgevel, op het
terras aan de Catharijnesingel, op het Vredenburgplein en op de straat naar Hoog
Catharijne, niet op de trappen naar het water en de Catharijnesingel zelf, die
10 m ten westen van de westgevel liggen. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0344100000047923`, dat het hele complex omvat, ook de bewaarde
onderbouw van Muziekcentrum Vredenburg; andere panden liggen niet onder het
model (het smalle pand 0344100000149169 langs de singel grenst er alleen aan).

Onderdelen in het model (hoogtes boven het maaiveld, uit het AHN tenzij anders
vermeld):

- De doos met de gestapelde zalen: een parallellogram van 66,45 m breed tussen
  de westgevel en de oostgevel, met de noordgevel aan het Vredenburg en de
  dakrand aan de zuidkant evenwijdig onder 19,7 graden op de as (48,2 m uit
  elkaar langs de as), dak op 45 m (NAP +48,7 m). Op het dak de installaties
  en luchtkanalen uit het AHN-raster per 0,5 m, opgeschoond tot 74 rechthoeken
  van minstens 0,9 m, op drie hoogtes: 46,3, 47,2 en 47,8 m.
- De twee noppengevels aan de Catharijnesingel en aan de oostkant: schijven
  van 1,5 m dik die van de noordgevel tot de dakhoek aan de zuidkant
  doorlopen, met ronde schotels van 1,3 m doorsnede en 0,35 m diep in een
  vierkant raster van 1,72 × 1,7 m (uit foto's: 28 kolommen; 18 rijen aan de
  singel vanaf 14,4 m, 15 aan de oostkant vanaf 18,4 m; 924 schotels). De rand
  van elke schotel staat 41 graden uit het lood, zodat de bovenkant zonder
  steun print. De
  ronde vensters tussen de schotels zijn niet apart gemodelleerd.
- De glazen noordgevel tussen de noppengevels ligt 1 m terug onder een dakrand
  van 1,5 m met een onderkant onder 45 graden (de rode band op foto's; diepte
  geschat), vanaf de kraag van de plint op 7,4 m.
- Het dakoverstek aan de zuidkant: de glazen gevel 6 m achter de dakrand
  (geschat), de dakrand 1,5 m dik en de onderkant 1,2 m per meter schuin terug
  tot 36,3 m bij de gevel; in werkelijkheid een vlakke rode onderkant boven de
  foyers met de zalen.
- Onder het overstek (uit foto's geschat): het witte zaalvolume aan de
  zuidwestkant, van de noppengevel tot 13,4 m oostelijker, tot 1,5 m achter de
  dakrand, dat vanaf 29,5 m hangt met een onderkant die 1,2 m per meter terug
  loopt naar de glazen gevel; een buitentrap van 1,5 m diep die voor de glazen
  gevel van het dak van de onderbouw (15,3 m) schuin omhoog loopt naar de
  westkant (28 m), met een schuine onderkant naar de gevel.
- Een terugliggende glazen plint onder de doos (uit foto's geschat): aan de
  westkant tot 12 m en 2 m diep met een schuine kraag tot de noppengevel op
  14,4 m, aan de oostkant tot 16 m (noppengevel vanaf 18,4 m), aan de noordkant
  tot 5 m en 2,5 m diep met een kraag tot 7,4 m. Op de zuidelijke hoeken
  lopen de noppengevels als pijler van 1,5 × 1,5 m tot het maaiveld.
- Twee witte zalen die 2,5 m voor de noordgevel uitkragen, tot 43 en 42 m, met
  een onderkant die 1,3 m per meter schuin terugloopt (uit foto's geschat, de
  AHN-rand komt tot 43 m).
- De groene cilinderzaal onder het dakoverstek: straal 7 m, van 25 tot 39 m,
  met een kegelvormige onderkant onder 50 graden naar een kern van 4 m straal
  (uit foto's geschat).
- De Ronda aan het Vredenburg, tussen de noordgevel en de BAG-boog (cirkel met
  straal 34,48 m), tot 21 m. De BAG-boog is de bovenrand (AHN: binnen 0,5 m);
  de gevel helt naar buiten boven de terugliggende glazen pui (foto's): de pui
  staat tot 5 m 3 m binnen de boog, de onderkant loopt onder 50 graden naar
  1,5 m binnen de boog op 6,8 m en de gevel helt van daar naar de boog.
- De bewaarde onderbouw van het oude Vredenburg (Hertzberger, 1979): de strook
  langs de Catharijnesingel tot 14 m met een lichtsleuf van 2 m breed tot 7 m,
  het blok van de Grote Zaal tot 15,3 m met een piramidedak (0,26 m per meter)
  tot 18,5 m en de glazen lantaarn (vierkant op de punt, 9,2 m zijde) tot 22 m
  met een lage piramide tot 23,2 m, de lage vleugel aan de zuidoostkant tot
  7,2 m en het terras aan de singel tot 4,5 m.

Er hangt niets vrij over: de steilste naar beneden gerichte vlakken (het
dakoverstek, de dakrand boven de noordgevel, de kragen van de plint, het
witte zaalvolume, de buitentrap, de onderkant van de Ronda, de uitkragende
zalen en de kegel onder de cilinderzaal) staan 45 graden of steiler, de randen
van de schotels 49 graden (41 graden uit het lood); een scriptcontrole op de
STL vindt geen ondervlakken boven de onderkant die vlakker hangen dan 45
graden. Met de optie ‘Printbare overhang’ blijven ze
daardoor vrij; op 1:1000 groeit het volume door de opvulling van 165,9 tot
174,6 cm³. Door de schotels (46.800 driehoeken) kost de opvulling 12 tot
19 seconden in plaats van 2. Staat de optie uit, dan vult de export verticaal
op en worden het overstek en de plint dicht gezet.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/TivoliVredenburg)
(Architectuurstudio HH met Jo Coenen, NL Architects en Thijs Asselbergs, 2014;
47 m hoog, negen verdiepingen, vijf gestapelde zalen; voor- en achtergevel in
glas met uitstekende zalen, zijgevels als noppenstructuur met hier en daar
ronde ramen; de Grote Zaal van het oude Muziekcentrum Vredenburg bewaard), PDOK
BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dakhoogte en dakranden,
installaties en kanalen op het dak, Ronda-volume, piramidedak, lantaarn,
lichtsleuf, terras, lage vleugel en maaiveld), de PDOK luchtfoto en foto's van
Wikimedia Commons (`TivoliVredenburg-2014-08.JPG`, `TivoliVredenburg.jpg`,
`TivoliVredenburg-20160810.jpg`, `TivoliVredenburg-westzijde.jpg`,
`TivoliVredenburg from Utrecht Dom Tower.JPG`,
`TivoliVredenburg in Utrecht (34278259525).jpg`,
`TivoliVredenburg in Utrecht (33894441310).jpg`, `Utrecht (08.08.2025) 10.jpg`
en `11.jpg`) voor de gevelopbouw. Het raster en de maat van de schotels, de
plint, de terugligging van de noordgevel, de hellende Ronda-gevel, de ligging
van de glazen zuidgevel, het witte zaalvolume, de buitentrap, de cilinderzaal
en de witte zalen zijn uit foto's geschat. Welke zaal achter welk volume zit,
is uit de foto's niet met zekerheid te zeggen; het model benoemt de volumes
naar hun uiterlijk. In het AHN is het dak tussen de glazen zuidgevel en de
dakrand grotendeels doorzichtig (hoogtes van 25 tot 45 m door elkaar); het
model houdt het dak daar dicht, zoals het van de straat en op de luchtfoto
oogt. De ronde vensters, de tegelpatronen op de Ronda, de kaders in de
noordgevel, de tweede trap en de roltrappen onder het overstek, de kolommen
onder de plint en de muurschildering op de onderbouw zijn niet gemodelleerd.
Panden rond het model in de PDOK-gebouwtegels (2026-10-06): de buren aan het
Vredenburgplein en aan de zuidkant liggen hooguit 1,5 m boven het AHN; geen
opgeblazen pand raakt het model.

Licentie van het model: eigen werk op basis van open bronnen.
