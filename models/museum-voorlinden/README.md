# Museum Voorlinden (Wassenaar)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `museum-voorlinden.glb` | Catalogusbron in meters: node `building:museum` (zonnedak, colonnade, het gesloten volume en de Skyspace) en node `road:terras` (het stenen terras onder het overstek) |
| `museum-voorlinden-1-1000.stl` | Het museum met terras op 1:1000, onderkant (0,5 m onder het maaiveld) op het printbed (122 × 55 × 10 mm) |
| `museum-voorlinden.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, maaiveld, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (83800,53, 459510,86), het hart van
het BAG-pand (dat de dakrand volgt), op het maaiveld (NAP +1,95 m), en de
glTF-conventie Y omhoog. +X loopt langs de lange gevels naar het noordoosten
(48,55 graden tegen de klok in vanaf de RD-X-as, de richting van de BAG-randen
en van de hoofdliggers op de luchtfoto) en +Y loodrecht daarop naar het
noordwesten, naar het landhuis. Het maaiveld wordt op vier punten op het gras
9 m buiten de dakrand bemonsterd (`groundSamplePoints`); `groundHeight` 45,41 m
(ellipsoïdisch) is de laagste PDOK-terreinhoogte op die punten. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0629100000021915`. Het landhuis
Voorlinden (het restaurant, pand 0629100000003560), het paviljoen bij Buurtweg
90B en de koetshuizen zijn eigen BAG-panden en horen niet bij het model.

Onderdelen (hoogtes boven het maaiveld):

- Zonnedak op de BAG-contour van 122,2 bij 54,7 m, bovenkant +8,35 m (AHN NAP
  +10,28 tot +10,31 m), dakrand 1,5 m dik (onderkant +6,85 m). Boven de grote
  zaal aan de noordoostkop ligt het dak 0,8 m hoger: +9,13 m van u 22,8 m tot
  de kop, v −14,6 tot 14,4 m (AHN NAP +11,08 m).
- Lamellenvelden in het dak: vakken van 0,3 m diep tussen een dakrand van
  1,0 m, de vier hoofdliggers langs de lengteas (v 13,4, 4,7, −4,1 en −12,9 m,
  op de luchtfoto) en dwarsribben van 0,9 m op een steek van 4,8 m (twee keer
  het raster van 2,4 m op de luchtfoto).
- Colonnade: 34 pijlers van 0,9 m, 0,8 m binnen de dakrand: 13 per lange zijde
  (12 gelijke vakken van 10,05 m) en op de koppen onder de hoofdliggers. Elke
  pijler staat voor een paar slanke witte kolommen.
- Gesloten volume van natuursteen en glas, 112,6 bij 44 m (5,3 m terug van de
  lange dakranden, 4,8 m van de koppen), wanden tot +6,0 m; daarboven de zone
  van het glazen dak en de holte tot het zonnedak als kern die 1,5 m
  terugligt. Glazen vakken 1,2 m terug achter de stenen wandvlakken: zes aan
  elke lange zijde, drie aan de zuidwestkop en twee aan de noordoostkop tussen
  de wandkoppen van 1,5 m.
- Entree aan de noordwestzijde, waar het pad van het landhuis aankomt: 12 m
  breed en 4 m diep tussen twee stenen wanden (u −24 tot −12 m).
- Skyspace van James Turrell: een opening van 13,5 bij 7,4 m in het dak aan de
  zuidoostkant (u 30,5 tot 44 m) met daarin de zaal (plat dak +6,65 m, AHN NAP
  +8,6 m) en een afgeknotte piramidekap tot +7,95 m (AHN NAP +9,9 m) met het
  oculus als nis van 1,2 m. De zaal steekt 3,2 m buiten de gevellijn uit.
- Terras van natuursteen onder het hele overstek, +0,15 m, als `road:terras`.

Weggelaten: de buisjes en lamellen van het zonnedak zelf (12,5 cm; hier als
vakken), de liggers onder het dak als losse balken (zitten in de dakrand van
1,5 m), de kolommen als paren van circa 0,2 m (kleiner dan 0,9 m; hier één
pijler per paar), de draaideuren en kozijnen, het donkere installatieblok aan
een van de koppen en de doorgang naar de tuin (plaats en maat niet uit de
beschikbare foto's vast te stellen), het souterrain en de tuin van Piet
Oudolf.

Pasvorm op het AHN: dak, verhoogde kop en Skyspace volgen het DSM op 0,1 m; de
lamellenvakken liggen 0,3 m onder het DSM (in het echt één vlak). Onder het
dak ziet het AHN niets (ook het DTM heeft daar geen punten): de gevellijn, de
wandhoogte en de kolommen komen uit foto's.

Printbaarheid op 1:1000: elke node is een gesloten manifold. Het vlakke
plafond van het overstek hangt vrij; de pijlers dragen de dakrand en de export
vult daaronder een wig van 45 graden naar het volume op. Printcontrole op
1:1000: museum 11,9 % extra volume, terras 0 %. De STL is 46 cm³.

Geschat (foto's): de gevellijn van het gesloten volume (5,3 en 4,8 m terug),
de wandhoogte (6,0 m), de plaats en breedte van de glazen vakken en de
entree, de kolomafstand langs de lange zijden, de dikte van de dakrand (1,5 m
printminimum; in het echt een open roosterdak met liggers van circa 1 m) en de
diepte van de lamellenvakken.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Museum_Voorlinden),
[building.co.uk](https://building.co.uk/buildings/voorlinden-museum-a-light-touch/5084715.article)
(zonnedak 2 m boven het glazen dak, zes evenwijdige wanden), PDOK BAG (het
pand), PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG (dak- en maaiveldhoogte),
de PDOK luchtfoto en foto's op Wikimedia Commons (Category:Museum Voorlinden).
