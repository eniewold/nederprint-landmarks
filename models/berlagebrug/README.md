# Berlagebrug (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `berlagebrug.glb` | Catalogusbron in meters: nodes `road:rijbaan`, `road:ov-baan`, `road:fietspad`, `road:voetpad`, `road:voetpad-open` (met BGT-attributen), `building:brug`, `building:basculeklep`, `building:brugwachtershuis` |
| `berlagebrug-1-1000.stl` | Brug met toren in één stuk op 1:1000, met de onderkant van de pijlers op het printbed (73,7 × 33,4 × 15,1 mm) |
| `berlagebrug.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op de as van het dek (de tramsporen,
RD 122668,00 484486,30), 3,2 m ten westen van het hart van de
basculedoorvaart, op de waterspiegel van de Amstel (NAP -0,4 m), en de
glTF-conventie Y omhoog; de STL ligt 0,8 m hoger, zodat de onderkant van de
onderbouw op z = 0 staat. +X loopt langs de brug naar de oostoever bij de
Mr. Treublaan (RD-richting (0,976, 0,218), azimut 77,43 graden, uit de
dekranden, de pijlers en de tramsporen in de BGT), +Y stroomafwaarts naar het
noorden, de stadszijde met de toren. Net als bij de Magere Brug ligt z = 0 op
het water en is `groundOffsetMetres` 0; het maaiveld wordt op zes punten op
het water bemonsterd, 5 m buiten de dekranden in de doorvaarten
(`groundSamplePoints` op y = ±17), en `groundHeight` is de PDOK-waterspiegel
(ellipsoïdisch 42,69 m) als terugval. `replacesBuildings` bevat het
brugwachtershuis (`NL.IMBAG.Pand.0363100012197554`), dat PDOK als blok van
NAP +3,2 tot +13,8 m op het dek zet; andere panden liggen niet onder het
model.

Het model is vereenvoudigd zodat het op 1:1000 zonder losse steunconstructie
print. In werkelijkheid zijn de vijf doorvaarten open onder een vlak dek. Een
eerste versie met open doorvaarten liet de export op 1:1000 opvullen met een
gestreepte wig onder elk dek (`building:brug` +110 %). Daarom is de ruimte
onder het dek dicht en heeft elke doorvaart aan beide gevels een diepe nis
met een plafond dat onder 50 graden naar binnen afloopt. Leuningen en
lichtmasten ontbreken. Printcheck op 1:1000 (uitsnede 107 mm): alle
onderdelen NoError en vrijwel geen opvulling (`building:brug` 7893 →
7896 mm³, +0,04 %; wegdelen, klep en toren 0 %), samen 9292 → 9295 mm³, in
1,7 s.

Onderdelen in het model (hoogtes boven de waterspiegel, NAP = z - 0,4):

- Dek van 73,66 × 24,2 m volgens de BGT (`overbruggingsdeel` dek), van de
  westkade (x = -36,98) tot de oostkade (x = 36,68). Het wegdek volgt het
  AHN als hyperbool met de top boven het hart van de doorvaart (x = 3,25):
  NAP +3,30 m aan de westkade, +4,10 m in het midden en +3,45 m aan de
  oostkade (6 mm RMS). De constructiehoogte is 1,5 m: een rand van 0,9 m (de
  band met groene tegels) en daaronder de liggers, 0,3 m terug.
- Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek, uitgesneden met
  een strook van 0,5 m onder tot 1 m boven het wegdek over dezelfde
  lengtestations als het dek. De BGT deelt het dek in drie stukken
  (x = -5,05 en 9,9) met per stuk dezelfde functies (`relatieve_hoogteligging`
  1, overal gesloten verharding behalve de oostelijke voetpaden, geen
  `plus_fysiek_voorkomen`); per functie is het één node:
  - `road:ov-baan` (`bgt_functie` OV-baan): de vrije trambaan van lijn 4 in
    het midden (|y| < 3,3), BGT-wegdelen `G0363.1ba784a6…`, `G0363.bab20121…`,
    `G0363.f3fdf0ce…`, `G0363.0ac0dd86…`, `G0363.15b03284…`,
    `G0363.ce4b9793…`.
  - `road:rijbaan` (`bgt_functie` rijbaan regionale weg): de twee rijbanen
    (`G0363.84a2d60c…`, `G0363.bb1608d3…`, `G0363.bfc8293e…`,
    `G0363.79275a1f…`, `G0363.e22088b9…`, `G0363.75e1338c…`) plus de strook
    van 0,4 m tussen de noordelijke rijbaan en het fietspad (de band, niet in
    de BGT).
  - `road:fietspad` (`bgt_functie` fietspad): beide fietspaden
    (`G0363.c33a9271…`, `G0363.86bc25f1…`, `G0363.4ac5ad92…`,
    `G0363.c414a33e…`, `G0363.29bda179…`, `G0363.40dc72f9…`).
  - `road:voetpad` (`bgt_functie` voetpad, `bgt_fysiekvoorkomen` gesloten
    verharding): de voetpaden ten westen van x = 11,46 (`G0363.7d1f0395…`,
    `G0363.48b9e3df…`, `G0363.d1b590f5…`, `G0363.99febca1…`,
    `G0363.cef14279…`, `G0363.76782d02…`), tot de dekrand.
  - `road:voetpad-open` (`bgt_functie` voetpad, `bgt_fysiekvoorkomen` open
    verharding): de oostelijke voetpaden (`G0363.a29bafc5…`,
    `G0363.0c5dc990…`), tot de dekrand.

  De toren, de pijlerkoppen en het balkon steken door het wegdek en blijven
  met 2 cm vrij constructie. `building:brug` is de vaste brug onder het
  wegdek, `building:basculeklep` de klep onder het wegdek,
  `building:brugwachtershuis` de toren. Samen vormen de acht onderdelen
  precies de brug als geheel (8603,4 m³, geen overlap); verticale stralen op
  30.000 punten over het dek vinden geen samenvallende bovenvlakken.
- Basculeklep van 11,86 × 23,2 m (0,5 m smaller dan het vaste dek) tussen de
  middenpijler en pijler E1, in gesloten stand.
- Vier bakstenen pijlers volgens de BGT: W1 (x = -26,25 .. -23,74), de
  middenpijler met de basculekelder (-13,04 .. -2,76), E1 (9,1 .. 12,69) en
  E2 (23,46 .. 26,0), met hun puntige granieten voorkoppen tot NAP +0,3 m en
  op W1 en E2 granieten pilasters van 0,7 m op de hoeken van de kopse
  kanten. Landhoofden als eindwanden van 0,5 m tegen de kades.
- Vijf doorvaarten van 10,2 tot 11,9 m als nissen in beide gevels: het
  plafond loopt van de onderkant van de liggers (z = 2,2 tot 2,9 m) onder
  50 graden naar binnen af tot onder water, 1,9 tot 2,5 m diep op de
  waterlijn.
- Pijlerkoppen boven het dek (AHN NAP +5,3 tot +5,5 m): op E1 aan beide zijden
  (3,6 × 1,4 m, 1,2 m boven het wegdek) en op de middenpijler aan de
  zuidzijde naast de klep (4 × 1,4 m, 1,3 m boven het wegdek).
- Aan de noordzijde van de middenpijler, ten westen van de toren: een balkon
  op dekhoogte (0,3 m boven het wegdek) met eronder de keldermuur met deur
  (nis van 1,6 × 2,2 m) en een granieten bordes op NAP +0,8 m aan het water.
- Brugwachtershuis op de BAG-voetafdruk (4,2 m breed, aan de waterzijde twee
  schuine hoeken), van het water tot NAP +11,5 m, met een kern van 2,45 m
  breed over de hele diepte tot NAP +13,9 m (AHN). Ramen als nissen van
  0,3 m op NAP +8,6 .. +9,9 m (middenraam in de noordgevel, ramen in de
  schuine gevels, de zijgevels en de zuidgevel), galmgaten boven de ramen in
  de schuine gevels, en de Genius van Amsterdam van Hildo Krop als reliëf van
  1,25 × 3,4 m en 0,2 m diep boven het middenraam.

Weggelaten: de leuningen (open smeedwerk met staven van enkele centimeters),
de rood-zwarte lichtmasten en de masten van de bovenleiding (circa 0,4 m
dik), de vlaggenmasten op de toren, de trappen op het bordes (treden van
0,3 m), de lage granieten stootblokken op de kadehoeken (horen bij de
kademuur, 0,5 m boven water) en de basculekelder en het contragewicht in de
middenpijler (onzichtbaar). De doorvaarten zijn geen open ruimte maar
nissen, zie boven.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Berlagebrug_(Amsterdam))
(brug 423, 1929-1932, 80 × 24 m, Genius van 4 m),
[Rijksmonumentenregister 530055](https://monumentenregister.cultureelerfgoed.nl/monumenten/530055),
PDOK BGT (`overbruggingsdeel`: dek, klep en pijlers; `wegdeel`: de wegdelen
op het dek; `spoor`: de tramsporen voor de hoofdas), BAG-pand
0363100012197554, PDOK AHN (dsm 0,5 m via WCS: wegdek, toren, pijlerkoppen,
bordes en voorkoppen, in een stelsel langs de brug), PDOK luchtfoto en
Wikimedia Commons-foto's (`Amsterdam Berlagebrug 001.JPG`, `002.JPG`,
`Berlagebrug opened.JPG`, `Berlagebrug.jpg`,
`2023 Genius van Amsterdam, Berlagebrug, Asd.jpg`,
`Overzicht Berlagebrug over de Amstel en een bedieningshuisje - Amsterdam - 20409346 - RCE.jpg`,
`2023 Berlagebrug, Asd (05).jpg`) voor de opstand. Plattegrond, pijlers, klep,
wegdelen, wegdekhoogte en de hoogtes van toren, pijlerkoppen en bordes komen
uit BGT, BAG en AHN; geschat op foto's zijn de constructiehoogte van het dek
(1,5 m, waarvan 0,9 m rand), de pilasters, de lengte van de pijlerkoppen, de
breedte van de torenkern, de ramen en galmgaten en de maat van de Genius.

Licentie van het model: eigen werk op basis van open bronnen.
