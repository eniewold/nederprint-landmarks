# Domtoren (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `domtoren.glb` | Catalogusbron in meters: node `building:toren` |
| `domtoren-1-1000.stl` | Toren in één stuk op 1:1000 (25 × 25 × 112 mm) |
| `domtoren.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De STL is in millimeters met Z omhoog en de oorsprong in het hart van de toren
op het maaiveld van het Domplein (circa NAP +5,4 m). +X loopt langs de
doorgang (RD-richting 18,5 graden boven het oosten, `xAxis` in het
catalogusitem), +Y staat daar 90 graden linksom op. Het maaiveld wordt op 15 m
uit het hart bemonsterd (`groundSamplePoints`).

Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0344100000039864`
(`replacesBuildings`) en drie kleine aanbouwen die de omhullende van 24,8 m
raken: `0344100000051237` (geheel binnen de omhullende), `0344100000039778` en
`0344100000005581`. PDOK trekt hun daken met het AHN omhoog tot de hoogte van
de steunberen (AHN-mediaan binnen de omhullende 28 tot 41 m), wat verticale
vlakken langs de toren gaf. De PDOK-reconstructie van de toren zelf is een blok
op de voetafdruk met een dakvorm, zonder doorgang, nissen, lantaarn of spits.
Omdat de twee aanbouwen die deels buiten de omhullende liggen (`0344100000039778`
en `0344100000005581`) echte gebouwen zijn, staan ze als model met zadeldaken op
hun BAG-voetafdruk (zonder het deel onder de toren) in de node
`building:aanbouwen`. Nokhoogte, dakrand en nokrichting komen uit het AHN
(39778: nok 15,4 m langs X, dakrand 10 m, lagere vleugel van 7 m; 5581:
noordvleugel nok 9 m langs Y, zuidvleugel nok 11,6 m langs X). Dakvoeten,
dakkapellen en schoorstenen ontbreken.

Onderdelen in het model (hoogtes boven het maaiveld):

- Eerste vierkant tot 38,6 m met de doorgang van 4,1 m breed (spitsboog tot
  13 m), een portaalnis aan beide gevels en blinde spitsbogen; 24,8 m breed
  onderaan, afnemend tot 22,6 m.
- Tweede vierkant tot 68,1 m (29,48 m hoog) met twee hoge spitsboognissen per
  gevel, gescheiden door een kroonlijst op 38,6 m.
- Open achthoekige lantaarn tot 98,4 m (26 m plus een dakplatform), 18,8 m
  afnemend tot 16,6 m over de vlakken, met een spitsboognis per vlak (in het
  echt open, hier voor de printbaarheid een nis van 1,3 m diep).
- Laag achthoekig dak tot 101,2 m met spits tot 106,75 m en windvaan tot
  112,32 m.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Domtoren_(Utrecht)),
[erfgoed.utrecht.nl](https://erfgoed.utrecht.nl/de-bouw-van-de-domtoren),
[Rijksmonumenten.nl](https://rijksmonumenten.nl/monument/36075/domtoren/utrecht/),
PDOK BAG en BGT (muren van 19,5 m, doorgang als sierbestrating), PDOK AHN (dsm
0,5 m via WCS: omhullende per hoogte in een stelsel langs de doorgang,
dakplatform op NAP +103,8 m, daktop) en Wikimedia Commons-foto's
(`Domtoren Utrecht - 1.jpg`, `Utrecht, domtoren 01.jpg`,
`Domtoren Utrecht - 2.jpg`). Geledingen, totale hoogte en de doorgangsbreedte
zijn gedocumenteerd; de omhullende (inclusief steunberen), het dakplatform en
de daktop komen uit het AHN; de vorm en plaats van nissen, portaal, kroonlijsten
en het dak zijn uit foto's geschat. De steunberen en topversieringen zijn niet
afzonderlijk gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
