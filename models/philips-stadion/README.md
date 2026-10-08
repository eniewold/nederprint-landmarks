# Philips Stadion (Eindhoven)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `philips-stadion.glb` | Catalogusbron in meters: één node `building:stadion` met dak, tribunes, hoeken, spanten en lagere bouwdelen |
| `philips-stadion-1-1000.stl` | Het stadion in één stuk op 1:1000, met de onderkant (NAP +16,6 m) op het printbed (216 × 166 × 35 mm) |
| `philips-stadion.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van het veld (het midden van
de veldopening in de BAG-contour) op straatniveau (NAP +17,6 m) en de
glTF-conventie Y omhoog. +X loopt langs de lengteas van het veld naar het
zuidoosten (RD-richting (0,8, -0,6), 36,87 graden onder het oosten), +Y dwars
daarop naar het noordoosten, naar de tribune met de spanten langs het spoor.
Het maaiveld wordt op vier punten vlak langs de gevels bemonsterd
(`groundSamplePoints`, NAP +17,5 tot +17,9 m). Het catalogusitem vervangt
BAG-pand `NL.IMBAG.Pand.0772100000950002`; andere panden liggen niet onder het
model.

Alle vormen zijn glad en op het AHN gefit (mediane afwijking van het
bovenvlak 0,11 m; dakvlakken van tribunes en hoeken enkele centimeters); het
Mapbox-landmarkmodel is niet gebruikt. Het veld (NAP +18,0 m) zit niet in het
model: de veldopening is open en het PDOK-terrein vormt het veld. Onder het dak
loopt alles massief door tot de onderkant; de tribunes zelf zijn niet
gemodelleerd.

Onderdelen in het model (hoogtes in NAP):

- Veldopening in het dak als afgeronde rechthoek van 126,3 × 73,2 m met hoeken
  van 5 m (u -62,5 tot 63,75 m, |v| tot 36,6 m); de dakrand loopt over 3,5 m
  schuin af tot 4,5 m onder het dakvlak.
- Noordoosttribune (|u| tot circa 60 m, v tot 78,5 m): vrijwel vlak dak van
  +47,0 m aan de veldkant tot +47,5 m aan de achterkant, met een schuine rand
  van 2 m.
- Zuidwesttribune: dak stijgend van +47,3 m op 40 m uit de as tot +50,35 m op
  71 m, daarna een rand van 45 graden tot 80,5 m uit de as.
- Korte tribunes aan de noordwest- en zuidoostkant: zadeldak met de nok op
  79,2 m uit het hart op +44,95 m, aflopend tot circa +44 m, met een schuine
  rand tot 93,5 en 94,5 m uit het hart.
- Vier hoeken als lage koepels rond (±58,6, ±31,6) m: een parabool in de
  straal met de top van +51,12 m op 32,5 m (rms 0,1 m), hoger dan de
  tribunedaken; een schuine rand die eerst steil tot +41 m en dan flauw tot
  +37 m zakt, tot 46 m straal naar de korte tribunes en 47,5 m naar de lange.
- Zestien vakwerkspanten op de noordoosttribune om de 7 m, 1,2 m breed, top
  van +47,8 m aan de veldkant oplopend tot +50,25 m.
- Lagere bouwdelen: achter de korte tribunes tot +30,7 m (aan de zuidoostkant
  deels +34,6 m), aan de zuidwestkant twee blokken tot +36,9 en +40,2 m, en
  twee lage uitbouwen uit de BAG-contour tot +22,1 m.

Alles begint op dezelfde onderkant en heeft verticale wanden en naar boven
gerichte vlakken; er hangt niets over, dus de export kiest de snelle
2,5D-opvulling (een uitsnede van 300 m met het hele stadion duurt circa 1,6
seconde).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Philips_Stadion) (veld
105 × 68 m, 35.000 plaatsen), PDOK BAG (contour, veldopening, lagere bouwdelen),
PDOK AHN (dsm en dtm 0,5 m via WCS: veldopening, dakvlakken, hoeken,
dakranden, spanten, lagere bouwdelen en straatniveau) en de PDOK luchtfoto.
Geschat zijn de breedte van de spanten (vakwerk, massief gemaakt) en het
verloop van de schuine dakranden en de dakrand langs het veld (het AHN toont
daar gemengde waarden). De uiteinden van de spanten die buiten de
noordoostgevel in de lucht hangen, zijn weggelaten, omdat de export ze tot de
grond zou opvullen; ook de lichtstraten in het zuidwestdak, de gevelindeling en
de masten op de hoeken zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
