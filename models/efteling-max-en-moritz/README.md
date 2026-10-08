# Max & Moritz (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-max-en-moritz.glb` | Catalogusbron in meters: nodes `building:baan` (beide banen met steunwand, kolommen en consoles), `building:station` (stationsgebouw rond het oude Bob-station met de school van meester Lämpel) en `building:wachtrij` (paviljoen, overkapte meandering, overkapping onder de banen) |
| `efteling-max-en-moritz-1-1000.stl` | Het hele model op 1:1000 met de onderkant (0,6 m onder het plein) op het printbed (82 × 67 × 13,8 mm, 5,8 cm³) |
| `efteling-max-en-moritz.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-max-en-moritz.mjs`](../../scripts/generate-efteling-max-en-moritz.mjs)
(gebruikt [`scripts/efteling-kit.mjs`](../../scripts/efteling-kit.mjs)).

De dubbele aangedreven familie-achtbaan (powered coaster) van MACK Rides uit
2020, op de plek van de Bob (1985-2019). De GLB is in meters met de oorsprong
op RD (131483, 406637), het midden van het stationsgebouw, op het maaiveld van
het Max & Moritz Plein (NAP +9,25 m), en de glTF-conventie Y omhoog. +X loopt
langs de lengteas van het station en de sporen erin naar het oost-zuidoosten
(16,5° rechtsom van RD-oost, `xAxis` [0,95882, -0,28402]), +Y naar de baankant.
Het maaiveld wordt op vijf punten op het plein voor het station en naast de
uitgang bemonsterd (`groundSamplePoints`, AHN-maaiveld NAP +9,2 tot +9,3 m),
niet op de heuvels in de baan (tot NAP +13 m); `groundOffsetMetres` is 0. Het
model vervangt BAG-pand 0809100000017602 (het oude Bob-station, 1985, 279 m²).
BAG-pand 0809100000017601 (1987, ca. 60 m west) is Frau Boltes Küche, het
voormalige restaurant De Steenbok met een plat dak: geen deel van de
attractie, het blijft als PDOK-pand staan. Bäckerei Krümel (2021) staat ca.
35 m zuidwestelijker en zit niet in dit model.

Onderdelen (hoogtes boven het plein):

- **Baan**: Max (blauw) en Moritz (groen), elk 275 m buiten het station (ca.
  305 m met het station; officieel 2 × 300 m), als dichte band van 1,3 m breed
  met een driehoekige kiel tot 0,9 m (zijvlakken onder 54°), in bochten tot
  9° gekanteld. Railhoogte in het station 2,25 m; hoogste punt van de rails
  5,2 m (Max, waar hij van de heuvel in het noordwesten over Moritz heen
  komt); veel stukken liggen 1-1,5 m boven de heuvels in de baan, Max ook
  vlak boven het maaiveld waar hij onder Moritz door duikt. Verloop Max: het
  rechte stuk west van het station langs de wachtrij, de keerbocht (onder
  Moritz door), de lus op de heuvel, omlaag over Moritz, de lus in het
  midden, twee keer onder Moritz door, de helix in het oosten (eerste gang
  1,5-2 m, tweede gang 4,2-4,6 m) en via de school het station in. Moritz:
  de bocht langs de overkapping naar het noorden (tot 4,3 m), de helix in het
  noordoosten (1,8 en 4,2-4,9 m), twee keer over Max, onder Max door naar het
  maaiveld, de helix in het westen (0,5-1 m en 4 m), langs de heuvel naar de
  grote keerbocht (4,7 m, over Max) en het rechte stuk terug.
- **Steunen**: een steunwand van 0,9 m dik met spitse openingen om de ~3 m
  (poten van 0,9 m, zijden onder 55°) als abstractie van de 212 groene
  kolommen; de wand stopt waar een andere baan eronder door loopt. De
  bovenste gang van de drie helixen staat op tien kolommen van 0,9 m, 1,65 m
  buiten de onderste gang, met een console onder 49°.
- **Station**: het oude Bob-station (west) met begane grond, verdieping,
  balkon op consoles van 45° langs zuid- en westgevel, posten en een flauw,
  ver overstekend zadeldak (goot 7,9 m, nok 9,4 m, sierpunten); de lange hal
  aan de baankant (plat dak 6,1 m) met vakwerk (stijlen, regel, schoren),
  kroonlijst, vensternissen en een siergeveltje; het middendeel met
  schilddak (8,5 m) en schoorsteen; de lange pleingevel ("Frau Schmetterling")
  met vakwerk, vensters, de twee kleine Bob-vensters en de verhoogde rotstuin
  met muurtje (1,2 m); de steile Schmetterling-puntgevel (51°, nok 9,4 m) met
  verdiepte geveldriehoek, blauwe erker op een kraag, deur in een stenen
  omlijsting en de vogel op de top (10,4 m); het vakwerkblok in het oosten
  (6,0 m) met de achthoekige uitrit van Moritz; de groene school van meester
  Lämpel (nok 9,8 m) met de uitrit van Max, het balkon met het bord "Schule"
  en het klokkentorentje (lantaarn met galmgaten, vierkante spits tot 13,2 m).
  De in- en uitritten zijn spitse nissen van 1,5 m diep; de banen lopen erin.
- **Wachtrij**: het paviljoen met schilddak ten noordwesten van het station
  (4,3 m), de overkapte meandering achter het station (platte kap op 2,5 m,
  open zijden als spitse nissen) en de overkapping met zadeldak (3,2 m) onder
  de banen ten oosten van het station.

De luchtfoto is geen ware orthofoto: hoge delen staan hier ca. 0,35 m per
meter hoogte naar het zuiden (en 0,1 m naar het oosten) verschoven. Het tracé
is op de luchtfoto (kleur en volgorde aan de kruisingen) gedigitaliseerd, per
punt met die factor teruggezet en tegen de railruggen in het AHN-DSM
gecontroleerd. Het AHN is van na 2020: de banen van Max & Moritz staan erin
en de bomen van de oude Bob-heuvel zijn gekapt.

Printbaar op 1:1000 en 1:500 zonder steun: de export vult onder de
kruisingen (overspanningen van 3-5 m boven de onderste baan), tussen de
helixkolommen, onder het dak en het balkon van het oude station en onder de
wachtrijkappen op. Printcontrole: baan +14,4 % op 1:1000
en +8,0 % op 1:500, station +1,6 % en +1,9 %, wachtrij +0,3 %.

Bronnen: [Eftepedia: Max & Moritz](https://www.eftepedia.nl/lemma/Max_%26_Moritz)
(2 × 300 m, hoogste punt 6 m, 212 kolommen, verloop van de rit, hergebruikt
Bob-station, school, torentje en gevels),
[Eftepedia: Max & Moritz Plein](https://www.eftepedia.nl/lemma/Max_%26_Moritz_Plein),
[Wikipedia (nl)](https://nl.wikipedia.org/wiki/Max_%26_Moritz_(Efteling)), PDOK
AHN (dsm en dtm 0,5 m via WCS: ligging van alle baandelen, railhoogtes als
maxima langs het pad, maaiveld en heuvels, daken van station en wachtrij), de
PDOK luchtfoto (8 cm), BAG en foto's uit
[Commons](https://commons.wikimedia.org/wiki/Category:Max_%26_Moritz_(Efteling)).
Geschat zijn de railhoogte in en bij het station, de hoogte van de onderste
gang in de helixen (het AHN ziet alleen de bovenste) en van stukken waar het
DSM de rails mist, de kanteling, de steunafstand, de gevelindeling, vensters
en balkons, het torentje (het DSM meet 11 m aan de voet van de spits) en de
hoogte van de wachtrijkappen. Weggelaten: de treinen, leuningen, de
schuttingen, de entreepoort, het lage wachtrijdak tussen de twee rechte
stukken west van het station, de kiosken en het transformatorhuisje op het
plein.
