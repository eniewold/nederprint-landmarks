# Joris en de Draak (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-joris-en-de-draak.glb` | Catalogusbron in meters: nodes `building:baan` (de banen Water en Vuur met hun houten draagconstructie), `building:station` (station Tuyghuys en de overkapte remise) en `building:draak` (de draak Edna in haar vijvertje) |
| `efteling-joris-en-de-draak-1-1000.stl` | Het hele model op 1:1000 met de onderkant (NAP +7,3 m, onder het water van de Kanovijver) op het printbed (174 × 147 × 24 mm) |
| `efteling-joris-en-de-draak.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

Gegenereerd met `node scripts/generate-efteling-joris-en-de-draak.mjs`
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131780, 406490), midden tussen de
twee lift-heuvels, op het maaiveld (NAP +9,0 m), en de glTF-conventie Y
omhoog. +X loopt langs de lifts naar het oost-noordoosten (15,5° linksom van
de RD-X-as, de richting van station en remise) en +Y 90° linksom daarop. Het
maaiveld wordt bemonsterd rond de remise, bij de eindremmen en op het pad ten
westen van de lifts (`groundSamplePoints`, AHN-maaiveld NAP +9,0 tot +9,1 m),
niet in de vijvers of de lagere wachtrij (NAP +7,9 m); `groundOffsetMetres`
is 0. De onderkant ligt op Z = -1,7 m (NAP +7,3 m), onder het water van de
Kanovijver (NAP ca. +7,9 m), omdat de keerbochten op palen in het water
staan. Het water zelf zit niet in het model (PDOK-water). Station en remise
zijn geen BAG-panden, dus er wordt geen PDOK-reconstructie vervangen.

Onderdelen (hoogtes boven het maaiveld):

- **Baan**: Water en Vuur (elk ca. 790 m in het model, officieel 810 m) als
  dichte band van 1,6 m breed en 0,8 m dik langs een gladde spline door
  controlepunten, in bochten gekanteld tot 55° (de keerbochten). Daaronder het
  houten vakwerk als dichte wand: 1,0 m breed onder de baan, per kant 0,12 m
  per meter hoogte breder naar onderen, met om de 4 m een portaal dat 0,45 m
  uitsteekt. Elk vak tussen twee portalen heeft per verdieping (ca. 4,2 m)
  vakwerkreliëf op beide zijvlakken: een kruis van schoren met regels en
  staanders van 0,5 m die op het buitenvlak blijven, en blinde nissen van
  0,35 m diep in de driehoeken ertussen (in het bovenste vak een ruit). Alle
  nisbovenranden lopen onder minstens 50° naar een punt, dus geen vlakke
  plafonds; ook de liftblokken en de trommels onder de keerbochten. Verloop: de twee perrons (3,0 m) aan weerskanten van het
  station, de lifts naast elkaar (9 m uit elkaar) tot +22,2 en +22,4 m, de
  keerbochten boven op de lift (Water linksom, straal 8,0 m; Vuur rechtsom,
  8,2 m; +17 tot +21 m), de first drops tussen de lifts door (laagste punt
  ca. +1,4 m, onder de twee latere doorgangen door) en over het station
  (+11,5 m), de grote bocht bij de Python (+6 tot +11 m, Vuur twee keer over
  Water heen), de doorgang door de lift (+5 m), Water langs de draak en Vuur
  onder Water door langs het vijvertje (0 m), de twee keerbochten op palen in
  de Kanovijver (+1,6 tot +5,8 m), de diagonaal terug, de terugweg onder de
  keerbochten door (+2 m), de eindremmen (+4,3 m), de remise en de keerlus
  het station in.
- **Station** (Tuyghuys): 15,5 × 18,5 m, gevels tot +7,0 m, flauw zadeldak tot
  +8,8 m met de nok langs de sporen (AHN: dakranden NAP +16,0 tot +17,4 m),
  galerij aan de vijverkant tot +3,6 m, lisenen, een spitsboogpoort en blinde
  spitsboognissen op de zuidgevel, ronde drakenschilden, nissen waar de sporen
  in- en uitrijden. De drops lopen er ca. 2,5 m boven de nok overheen.
- **Remise**: 20 × 12 m op RD 131811–131831 × 406457,5–406469,5, gevels
  +7,2 m, nok +8,4 m (AHN NAP +16,1 tot +17,4 m), lisenen en spitse nissen
  waar de sporen in- en uitrijden.
- **Draak** Edna: romp en staart op het water van haar vijvertje tussen de
  banen, hals schuin omhoog en de kop met open bek ca. 9,6 m boven het water,
  rugstekels als kleine piramides.

Tracé: de PDOK-luchtfoto is geen ware orthofoto; hoge delen staan ca. 0,3 m
per meter hoogte naar het noorden verschoven (de keerbochten boven op de lift
ca. 5 m). De ligging van de lifts en de keerbochten komt daarom uit het
AHN-DSM (cirkelfit op de keerbochten, nokken van de twee lifts); de lage
delen uit de luchtfoto, gecontroleerd door het tracé met de verschuiving
terug op de luchtfoto te leggen. De volgorde van de baandelen komt uit
OpenStreetMap en de ritbeschrijving op Eftepedia. Hoogtes zijn maxima van het
DSM langs het pad waar de baan bovenop ligt; waar een baan onder een andere
door loopt is de hoogte geschat met minstens ca. 2,5 m verschil.

Printbaar op 1:1000: alle wanden staan op de onderkant en lopen naar onderen
uit; de export vult alleen de lip onder de baan, de dakranden, de
drakenschilden en de kop van de draak op (baan +0,3 % op 1:1000 en +0,4 % op 1:500, station +0,1 %, draak
+26 % van een klein volume op 1:1000 en +16 % op 1:500). De STL is 32 cm³; de
baan is één massief deel.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Joris_en_de_Draak),
[Eftepedia](https://www.eftepedia.nl/lemma/Joris_en_de_Draak) (25 m hoog,
2 × 810 m, ritverloop, draak van 9 m), PDOK AHN (dsm en dtm 0,5 m via WCS),
de PDOK-luchtfoto, OpenStreetMap (ODbL; volgorde van de baandelen) en
Wikimedia Commons (Category:Joris en de Draak). Geschat zijn de hoogtes van
de baandelen die onder andere door lopen, de railhoogte in station, remise en
keerlus (3,0 m), de kanteling, de breedte van het vakwerk (in werkelijkheid
een open vakwerk, hier een dichte wand met portalen en vakwerkreliëf), de gevelindeling van
station en remise en de vorm van de draak. Weggelaten: de stalen Titan
Track-bocht als apart materiaal, de finishbanier, de wachtrij en de stenen
muurtjes rond het vijvertje van de draak.
