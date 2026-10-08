# GelreDome (Arnhem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `gelredome.glb` | Catalogusbron in meters: één node `building:stadion` met tribunes, schuifdak, rails, spanten, hoekbouwdelen en uitbouw |
| `gelredome-1-1000.stl` | Het stadion in één stuk op 1:1000, met de onderkant (NAP +9,6 m) op het printbed (202 × 174 × 44 mm) |
| `gelredome.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van het veld op straatniveau
(NAP +10,6 m) en de glTF-conventie Y omhoog. +X loopt langs de lengteas van het
veld en de tongewelven naar het noordnoordoosten (RD-richting (0,337, 0,941),
70,3 graden boven het oosten), +Y dwars daarop naar het westnoordwesten; de
zuidtribune, waaronder het veld naar buiten rijdt, ligt aan de -X-kant. Het
maaiveld wordt op vier punten vlak langs de gevels bemonsterd
(`groundSamplePoints`), niet in de sleuf van circa 1 m rond het uitgereden veld
voor de zuidtribune. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0202100000222215`.

Het AHN toont het schuifdak dicht: beide gewelven liggen boven het veld. De
PDOK-luchtfoto toont het open, met de gewelven boven de lange tribunes en het
veld buiten het stadion. Het model volgt het AHN, zodat alle hoogtes gemeten
zijn; een veldopening is er daardoor niet. Het uitgereden veld ligt in het AHN
op maaiveldhoogte (NAP +10,7 m, gelijk met de omgeving) en is niet
gemodelleerd. Alle vormen zijn glad en op het AHN gefit (mediane afwijking van
het dakvlak 4 cm); het Mapbox-landmarkmodel is niet gebruikt.

Onderdelen in het model (hoogtes in NAP):

- Hoekbouwdelen: de hele BAG-contour met afgeschuinde hoeken tot +21,8 m.
- Twee lange tribunes (|y| 45,5 tot 81,6 m, tot |x| 61 m): dak hellend van
  +37,21 m aan de veldkant naar +36,27 m, daarna een schuine dakrand tot
  +29,5 m aan de gevel.
- Twee korte tribunes (|x| 64,8 tot 101 m, |y| tot 41 m): dak van +37,35 m
  naar +36,27 m, dakrand als bij de lange tribunes; op de zuidtribune een
  lichtstraat tot +37,7 m.
- Schuifdak: twee tongewelven van 124 m lang en 37,7 m breed als cirkelboog
  (middelpunt 22,95 m naast de as op +32,22 m, straal 21,13 m, top +53,35 m,
  afwijking 2 cm), met een goot op +41,8 m en een naad tot +42,8 m ertussen
  en een schuine rand naar de lange tribunes.
- Rails onder de gewelfuiteinden: 2,8 m breed tot +41,8 m over het veld en
  daarbuiten tot +36,5 m boven de hoekbouwdelen, aflopend tot +27 m op 84 m
  uit de as.
- Vakwerkspanten langs de zijkanten van de korte tribunes: 3,8 m breed tot
  +38,3 m.
- Halfronde uitbouw aan de westnoordwestkant (BAG) tot +29,4 m, met een
  trappenhuis tot +36,5 m tegen de lange tribune.

Alles begint op dezelfde onderkant en heeft verticale wanden; er hangt niets
over, dus de export kiest de snelle 2,5D-opvulling (een uitsnede van 290 m met
het hele stadion duurt circa een seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/GelreDome) (Alynia
Architecten, 1998, veld 105 × 68 m, schuifdak van twee koepels op rails, veld
rijdt onder de zuidtribune naar buiten), PDOK BAG (contour), PDOK AHN (dsm en
dtm 0,5 m via WCS: gewelven, tribunedaken, dakranden, rails, spanten,
hoekbouwdelen, uitbouw en straatniveau) en de PDOK luchtfoto. Geschat zijn de
breedte van de rails en spanten (vakwerk, massief gemaakt op de 90e percentiel
van het AHN) en hoe ver ze aan de uiteinden doorlopen. De tribunes onder het
dak, de gevelindeling en een kleine luifel buiten de BAG-contour aan de
oostzuidoostkant zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
