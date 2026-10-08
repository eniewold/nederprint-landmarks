# Olympisch Stadion (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `olympisch-stadion.glb` | Catalogusbron in meters: nodes `building:stadion` (kom, tribunes, hoekbouwdelen, entree en scorebord) en `building:marathontoren` |
| `olympisch-stadion-1-1000.stl` | Stadion en Marathontoren op 1:1000 als twee losse delen, met de onderkant (NAP +0,1 m) op het printbed (244 × 186 × 46 mm) |
| `olympisch-stadion-grondplaat-1-1000.stl` | Idem op een grondplaat van 2 mm die de toren met het stadion verbindt (248 × 189 × 48 mm) |
| `olympisch-stadion.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van het veld op straatniveau
(NAP +1,1 m) en de glTF-conventie Y omhoog. +X loopt langs de lengteas van het
veld naar het noordnoordwesten (RD-richting (-0,208, 0,978), 102 graden boven
het oosten), +Y dwars daarop naar het westzuidwesten, naar de hoofdtribune. De
Marathontoren staat aan de -Y-kant, 11 m voor de gevel van de Marathontribune.
Het maaiveld wordt op vier punten vlak langs de gevels bemonsterd
(`groundSamplePoints`), niet op de lagere kade aan het Noorder Amstelkanaal
ten westen van het stadion. Het catalogusitem vervangt de BAG-panden
`NL.IMBAG.Pand.0363100012076088` (stadion) en
`NL.IMBAG.Pand.0363100012250984` (Marathontoren).

Alle vormen zijn glad en op het AHN gefit (mediane afwijking van het
bovenvlak 0,13 m); het Mapbox-landmarkmodel is niet gebruikt. Het veld ligt op
straatniveau (NAP +1,1 m) en zit niet in het model: de kom is open en het
PDOK-terrein vormt het veld. De tweede ring van 1937 is bij de restauratie van
1998 tot 2000 weer verwijderd; het AHN en dit model tonen de kom van 1928.

Onderdelen in het model (hoogtes in NAP):

- Kom: binnenrand als even fourierreeks in de hoek (AHN, afwijking 0,15 m),
  205 × 120 m; gevel als superellips |x/121,0|^2,19 + |y/82,4|^2,19 = 1 (BAG);
  de tribunering als hellend vlak van de binnenrand naar de gevel, per hoek
  gefit (afwijking 0,15 m): van +4,8 m naar +13,4 m op de lange as en van
  +3,1 m naar +11,1 m in de bochten naast de tribunes.
- Hoofdtribune aan de westzijde (x -47,6 tot 47,9 m, y 60,2 tot 89,7 m): voorrand
  op +12 m, dak op +18,83 m tot y 68,5 m, daarna +19,5 m aflopend naar
  +19,25 m en een dakrand van +18,5 m aan de gevel.
- Marathontribune aan de oostzijde (y -60,3 tot -78,8 m): dak op +14,05 m,
  achterrand +13,72 m, met de entree tot +11,2 m in het midden.
- Hoekbouwdelen naast de hoofdtribune tot +11,1 m.
- Scorebord aan de noordkant, 29,6 m breed, tot +20,1 m.
- Marathontoren (46 m volgens Wikipedia, top van de bol op +45,9 m in het
  AHN): voet volgens de BAG-contour tot +13 m, schacht van 3,2 × 3,2 m,
  uitkragende balkonplaat (luifel) van 6 × 6 m met de bovenkant op +37 m,
  bovenbouw van 2,4 m tot +41,2 m, hals van 1,4 m en een schaal die onder 50
  graden uitloopt in een bol van 3,4 m doorsnede.

De luifel hangt in de GLB vrij uit, zoals in werkelijkheid. Daardoor heeft de
torennode een overhang en vult de export hem laag voor laag op met een kraag
van 45 graden (export van een uitsnede van 340 m met stadion en toren circa
1,2 seconde, de toren 0,08 seconde); zonder die overhang zou de toren de
verticale 2,5D-opvulling krijgen en de luifel als pijler tot de grond
doorlopen. De STL's hebben een console van 49 graden onder de luifel. Het
stadion zelf heeft alleen verticale wanden en bovenvlakken en krijgt de snelle
2,5D-opvulling.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Olympisch_Stadion_(Amsterdam))
(Jan Wils, 1928, tweede ring van 1937 in 1998 verwijderd, Marathontoren van
46 m met betonnen skelet, bakstenen platen en vier balkons met uitkragende
luifels), PDOK BAG (gevel van de kom en voet van de toren), PDOK AHN (dsm en
dtm 0,5 m via WCS: binnenrand en tribunering, tribunedaken, hoekbouwdelen,
entree, scorebord, hoogte van balkons en bol en straatniveau), foto's op
Wikimedia Commons (opbouw van de toren) en de PDOK luchtfoto. Geschat zijn de
hoogte van de voet van de toren, de breedte van schacht, luifel, bovenbouw en
bol, en de lage voorrand van de hoofdtribune (het AHN toont daar gemengde
waarden). De rand van de kom ligt in het AHN circa 1 m buiten de BAG-gevel
(dakrand en bomen); het model volgt de BAG. De trappenhuizen in de gevel, de
gevelindeling, de lichtstraat in de schacht van de toren en de olympische
ringen zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
