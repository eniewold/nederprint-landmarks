# Slauerhoffbrug (Leeuwarden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `slauerhoffbrug.glb` | Catalogusbron in meters: nodes `road:rijbaan`, `road:fietspad`, `road:voetpad` (met BGT-attributen), `building:brug`, `building:ophaalbrug`, `building:pyloon` |
| `slauerhoffbrug-1-1000.stl` | Brug met arm, trommel en pyloon in één stuk op 1:1000, met de onderkant van pijlers, landhoofden en pyloon op het printbed (54 × 42 × 14 mm) |
| `slauerhoffbrug.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

Vliegende ophaalbrug (staartbrug, 2000) over de Harlingervaart, in gesloten
stand. Het brugdek wordt niet om een as onder het wegdek gedraaid, maar met
een gebogen ladderarm aan een pyloon op de zuidwestoever opgetild: de
horizontale scharnieras staat 45 graden scheef op de weg, zodat de klep over
haar zuidwesthoek omhoog draait en open als een ruit naast de pyloon staat.
Gesloten loopt de arm vanaf het contragewicht (een liggende trommel met gele
randen, hoog achter de pyloon) over het scharnier omlaag tot op dekhoogte
naast de zuidelijke vaste overspanning; de voorarmen liggen dan in het wegdek.

De GLB is in meters met de oorsprong op de as van het dek midden op de klep
(RD 180304,75, 579176,50) en de glTF-conventie Y omhoog; z = 0 is de
waterspiegel zoals het PDOK-terrein die legt (ellipsoïdisch 40,96 m; het
PDOK-terrein ligt hier 41,32 m boven het AHN, dus z = NAP + 0,36 m). De STL
ligt 1,5 m hoger, zodat de onderkant op z = 0 staat. +X loopt langs de brug
naar het noorden (RD-richting (0,0344, 0,9994), langs de randen van het
BGT-dek), +Y naar het westen. Alle dwarslijnen van het BGT-dek (landhoofden,
pijlers, voegen van de klep) staan 5,2 graden scheef (x = c + 0,091 y); het
model volgt dat. `groundOffsetMetres` is 0; het maaiveld wordt op vier punten
op het water aan beide zijden van de klep bemonsterd, tussen de geleidewerken
(`groundSamplePoints` (0, ±13), (-3, 13), (3, -13)), en `groundHeight` 40,96
is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. De brug en de
pyloon zijn geen BAG-pand (BAG-WFS leeg, geen PDOK-gebouw in de uitsnede), dus
`replacesBuildings` blijft leeg. De PDOK-reconstructie (`?landmarks=0`) legt
het wegdek over de vaart op de waterspiegel en heeft geen brug, arm of pyloon;
de opritten lopen in het PDOK-terrein af naar die waterhoogte, zodat de
uiteinden van het dek (NAP +3,9 m volgens het AHN) tot 0,7 m boven de
PDOK-weg uitkomen.

Onderdelen in het model (hoogtes boven de waterspiegel, NAP = z − 0,36):

- Dek van 44,6 m (landhoofd tot landhoofd) × 16,55 m volgens de BGT, wegdek
  vlak op 4,25 m (NAP +3,89 m; AHN 3,8 tot 3,95 m): de zuidelijke en
  noordelijke vaste overspanning van 13,3 m (1,3 m dik), twee pijlers van
  1,8 m over de volle breedte en de klep van 14,6 m tussen de pijlers (1,2 m
  dik, `building:ophaalbrug`).
- Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek, uitgesneden met
  een strook van 0,5 m onder tot 1 m boven het wegdek over het hele dek, ook
  over de klep. De BGT heeft op het dek (`relatieve_hoogteligging` 1, actueel,
  zonder `plus_fysiek_voorkomen`), van oost naar west:
  - `road:voetpad` (`bgt_functie` voetpad, `bgt_fysiekvoorkomen` gesloten
    verharding): `G0080.24e907aaed683789e0530d0957918266` (zuid),
    `G0080.24e907a7c8523789e0530d0957918266` (klep),
    `G0080.24e907a7c8513789e0530d0957918266` (noord);
  - `road:fietspad` (fietspad, gesloten verharding):
    `G0080.24e907a892683789e0530d0957918266`,
    `G0080.24e907a956de3789e0530d0957918266`,
    `G0080.24e907a5f3043789e0530d0957918266`;
  - `road:rijbaan` (rijbaan lokale weg, gesloten verharding):
    `G0080.24e907a6fe543789e0530d0957918266`,
    `G0080.24e907a5f3053789e0530d0957918266`,
    `G0080.24e907a892693789e0530d0957918266`.

  De grenzen voetpad|fietspad en fietspad|rijbaan liggen over de drie
  dekdelen op één rechte (BGT tot op 5 cm). De berm en het verkeerseiland
  tussen fietspad en rijbaan (ondersteunend wegdeel) horen bij de rijbaan; de
  bermen langs de dekranden zijn de schampkanten. Schampkanten, de landing van
  de arm en de noordelijke voorarm blijven met 2 cm vrij constructie. Samen
  vormen de zes onderdelen precies de brug als geheel (2203,3 m³, geen
  overlap); verticale stralen (`zfight.py`, 30 000 punten over het dek) vinden
  geen samenvallende vlakken.
- Schampkanten van 0,9 m breed en 0,25 m hoog op de bermen langs beide
  dekranden (in plaats van de leuningen).
- Landhoofden van 1,5 m onder de dekeinden en vier vleugelmuren van 0,5 m dik
  en circa 4 m lang (BGT landhoofd) tot de hoogte van de schampkanten.
- Vier geleidewerken (remmingwerk) van circa 10 m langs de doorvaart, 1,2 m
  breed met de bovenkant op 1,9 m (NAP +1,55 m), volgens de luchtfoto.
- `building:pyloon`: twee betonnen poten aan weerszijden van de arm, 1,5 m
  dik, aan de voet 6,8 m breed, aan de brugzijde vanaf dekhoogte onder 62
  graden versmald tot de top van 1,8 m op 10 m, aan de trommelzijde verticaal
  met een schuine voet, elk met een rond venster (1,5 m) als blinde nis van
  0,3 m; daartussen de fundering tot NAP +3,8 m (AHN).
- `building:ophaalbrug`, naast de klep: de ladderarm in een eigen stelsel (45
  graden op de as): twee zijliggers van 1,5 m breed, 7 m uit elkaar, met drie
  dwarsdragers (bij het scharnier, halverwege de bocht en bij de landing) en
  daartussen open vakken (zoals in het AHN en op de luchtfoto). De bovenrand
  loopt van de trommel via het scharnier (10,75 m) in een bocht omlaag tot de
  landing op dekhoogte naast de westrand van de zuidelijke overspanning; de
  onderrand loopt vanaf het scharnier onder 45 tot 47 graden naar de landing.
  De noordelijke voorarm (1,5 × 1,0 m) loopt over het water door tot de
  westrand van de klep. De scharnieras (straal 0,8 m, op NAP +8,6 m) steekt
  als lagerdeksel 0,3 m buiten de poten uit. Het contragewicht: een liggende
  trommel van 7,4 m lang, kern 3,0 m, gele randen van 3,8 m met de bovenkant
  op 12,5 m (NAP +12,1 m, AHN), de naaf 0,3 m buiten de randen.

Niet in het model: de leuningen, lantaarns, slagbomen, verkeerslichten en
seinen (dunner dan 0,9 m), de hydraulische cilinders tussen fundering en arm
(circa 0,5 m dik en gesloten tussen de poten verborgen), de zuidelijke
voorarm (ligt gesloten verzonken in een sleuf in het wegdek), de beschildering
(geel-blauwe onderkant van de klep) en de open stand.

Pasvorm op het AHN: wegdek binnen 0,1 m van het DSM (NAP +3,8 tot +3,95 m),
de bovenkant van de trommel op het DSM-maximum (NAP +12,1 m), de arm boven
het scharnier op NAP +10 m en aflopend tot dekhoogte op 12 m van de trommel,
de fundering op NAP +3,8 m. Het DSM is op het staal van arm en trommel erg
onrustig (veel gaten); de vorm komt daarom uit de luchtfoto en de foto's, de
hoogtes uit de DSM-maxima.

Printbaarheid op 1:1000: dragende delen ≥ 0,9 m, de onderrand van de arm vanaf
het scharnier ≥ 45 graden, de vensters als blinde nis. Klep, arm en trommel
hangen vrij boven water en oever; de export vult eronder op. Printcheck op
1:1000 (uitsnede 85 mm): alle onderdelen NoError, de opvulling gaat geheel
naar de vaste brug (`building:brug` +203,6 %, 1122 → 3408 mm³: onder het
16,5 m brede dek, dat maar 4,4 m boven de onderplaat ligt, groeien de wiggen
van 45 graden vrijwel tot een dicht blok; daarnaast een wig met wand onder de
trommel), de wegdelen, de ophaalbrug en de pyloon 0 %, in 2,2 s.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Slauerhoffbrug) (werking als
staartbrug); PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden) en
wegdeel/ondersteunend wegdeel op het dek (OGC API); PDOK AHN DSM/DTM 0,5 m
(WCS); PDOK luchtfoto (Actueel_orthoHR) voor de plattegrond van de arm, de
trommel, de poten en de geleidewerken; Wikimedia Commons-foto's
`20190419 Slauerhoffbrug1 Leeuwarden.jpg`, `20190419 Slauerhoffbrug2 Leeuwarden.jpg`,
`De Slauwerhoffbrug Leeuwarden.JPG`, `Slauerhoffbrug - wegaanzicht - Bert Kaufmann.jpg`,
`Slauerhoffbrug.JPG` en `Slauerhoffbrug “Flying” Drawbridge by Hindrik 1.jpg`/`2.jpg`.

Geschat: de dikte en de bocht van de arm (2,75 m bij het scharnier, 1,0 m bij
de landing), de diameter van de trommel (3,8 m over de randen, kern 3,0 m), de
plaats van het scharnier (5,5 m voor de trommel), de vorm en dikte van de
pyloonpoten, de dekdiktes (1,3 en 1,2 m), de schampkanten en de hoogte van de
geleidewerken.

Licentie van het model: eigen werk op basis van open bronnen.
