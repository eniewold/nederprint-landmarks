# Rotterdam Centraal (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `rotterdam-centraal.glb` | Catalogusbron in meters: node `building:station` (stationshal en perronkap uit vlakken, als gesloten solid) |
| `rotterdam-centraal-1-1000.stl` | Het model op 1:1000 met de onderkant (NAP -2,5 m) op het printbed (285 × 292 × 33 mm) |
| `rotterdam-centraal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (91911, 437670), midden in de
stationshal, op het maaiveld van het Stationsplein (NAP 0 m), en de
glTF-conventie Y omhoog; +X wijst naar het oosten en +Y naar het noorden (de
RD-assen). Het maaiveld wordt op het Stationsplein vlak voor de westkant van
de hal bemonsterd (`groundSamplePoints`, AHN NAP -0,2 tot 0 m); punten verder
op het plein vielen in de preview buiten de geladen terreintegels, waardoor
het model wegviel. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0599100100007430` (de stationshal) en
`NL.IMBAG.Pand.0599100000700024` (een klein pand onder de perronkap).

Opbouw (herzien: vlakken in plaats van het AHN-hoogteveld van 1 m): het model
is opgebouwd uit polygonen en planvergelijkingen die uit het AHN-DSM (0,5 m)
zijn afgelezen. Er zijn geen rastercellen meer in het model.

- De contour (17 punten) is het deel van het DSM boven NAP +4,5 m rond hal en
  perronkap, vereenvoudigd tot rechte randen (1,5 m) en aan de westkant
  afgesneden waar de lagere perronkappen beginnen; alles is erop afgesneden
  met rechte wanden.
- De perronkap is een rechthoek van 244 bij 156 m die 17,6 graden ten
  opzichte van de RD-assen draait (hoeken in het rasterstelsel (-190,5, 49,5),
  (42, 123,5), (91, -27) en (-146, -100)), met een zaagtand van schuine ramen
  dwars op de lange as: 45 ribben van 0,7 m hoog en 5,4 m breed boven een
  basis op NAP +16,6 m (de ribben uit een dwarsprofiel van het DSM op 0,25 m;
  de kap is geen golvend vlak). De zuidrand is 4 m breder dan de rechthoek en
  wordt op de contour afgesneden. De kap is dicht tot de onderkant.
- De hal is opgebouwd uit drie dakvlakken met een vlakke bovenkant, gefit met
  k-vlakken op het DSM (98 % van de cellen binnen 1 m): het westelijke vlak
  (z = -0,017 x + 0,058 y + 18,11 NAP, het lage vlak naast de kap), het grote
  middenvlak (z = 0,238 x + 0,041 y + 15,99) dat als een vlieger van de kap
  tot de punt op (92, -167) oploopt tot NAP +30,7 m, en het oostelijke vlak
  (z = 0,106 x + 0,175 y + 20,71, begrensd op +16,6 m, de hoogte van de kap),
  waar het middenvlak een steile rand van 5 tot 14 m heeft. Planvergelijkingen
  in het rasterstelsel (RD min (91871, 437790)); de grenzen van de vlakken zijn
  uit de k-vlakkenindeling afgelezen.
- In het middenvlak zitten zeven piramidevormige ramen (omgekeerde piramides
  van 3,6 bij 5,4 m, 1,3 m diep) op de plaatsen waar het DSM gaten had en waar
  de luchtfoto de ramen toont.

Vergelijking met het AHN-DSM: binnen de contour ligt 93 % van de circa 50.000
DSM-cellen van 1 m binnen 1 m en 99 % binnen 2 m (mediaan 0,05 m); de kap
heeft 92 % en de hal 95 % binnen 1 m. De afwijkingen zitten in de randen, de
lichtschachten in de kap en de glazen gevel van de hal, die als vlak zijn
gemodelleerd.

Printbaar op 1:1000 zonder steun: elk dakvlak is een prisma met een vlakke
bovenkant op een rechte onderkant en heeft geen ondervlakken (het script
controleert dat). De perronkap is daarvoor dicht tot de onderkant, zoals bij
Leiden Centraal; in werkelijkheid is hij open boven de sporen. Met
overhangopvulling op 1:1000 blijft het volume gelijk (966,0 cm³). In de kaart staan de hal en de perronkap op het
Stationsplein, en de preview van een uitsnede van 320 m rond het station
toont het hele model zonder de vervangen panden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Station_Rotterdam_Centraal)
(Team CS, 2014), PDOK BAG (de stationshal en het pand onder de perronkap),
PDOK AHN (dsm en dtm 0,5 m via WCS: de rechthoek, de ribben en de dakvlakken,
plein, sporen en straat) en de PDOK luchtfoto. Geschat zijn de contour (uit
het DSM, de westrand op het oog langs het einde van de grote kap), de
grenzen van de dakvlakken en de afmetingen van de piramideramen.
Vereenvoudigd: de perronkap is dicht, de ribben zijn een gelijkmatige
driehoekige zaagtand zonder zonnepanelen of dakramen, de glazen gevels en de
luifel langs het plein zijn vlak, de lage vlakken rond de hal zijn niet
gemodelleerd en de lagere perronkappen ten westen zijn weggelaten.
