# Koornbrug (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `koornbrug-leiden.glb` | Catalogusbron in meters: nodes `road:rijbaan`, `road:rijbaan-klinkers`, `road:voetpad` (met BGT-attributen), `building:boogbrug`, `building:galerijen` |
| `koornbrug-leiden-1-100.stl` | Boogbrug, wegdek en beide galerijen in één stuk; de kadedelen hebben een massieve onderbouw tot de vlakke onderkant van de pijlers (254 × 198 × 103 mm) |
| `koornbrug-leiden.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

De STL is in millimeters met Z omhoog en de oorsprong in het hart van het
brugdek op de waterspiegel van de Nieuwe Rijn (circa NAP -0,6 m); de GLB
gebruikt dezelfde oorsprong in meters met de glTF-conventie Y omhoog. +X loopt
langs de overspanning naar de Burgsteeg (RD-richting (0,842, 0,539), azimut
57 graden), +Y langs het water naar het noordwesten (in de GLB richting -Z).
Omdat de lader het laagste maaiveld rond de voetafdruk neemt en dat hier het
water is, ligt z = 0 op de waterspiegel en is `groundOffsetMetres` 0; de
pijlers reiken 0,8 m onder water, de kades liggen op 2,45 m.

Onderdelen in het model:

- Stenen brug van 16,7 × 18,9 m volgens de BGT (`overbruggingsdeel`): twee
  landhoofden van 1,1 m, twee pijlers van 1,4 m en drie tongewelven van
  3,2, 5,3 en 3,1 m overspanning met de aanzet 0,3 m boven water; de
  middenboog is een korfboog met de kruin op 2,5 m, de zijbogen halfrond.
- Wegdek als parabool van 2,9 m boven de landhoofden tot 3,4 m op de kruin
  (AHN: NAP +2,8 m), met hellingen naar de kades (2,45 m) tussen de galerijen.
- De bovenste 0,5 m van het wegdek (dek en hellingen) is per BGT-wegdeel een
  eigen node met de attributen in `extras.attributes`, zodat de kleurregels
  van een thema op de brug werken zoals op de PDOK-wegdelen ernaast
  (contouren uit de BGT OGC API, actuele versies, vereenvoudigd tot 5 cm):
  - `road:rijbaan`: `bgt_functie` rijbaan lokale weg, `bgt_fysiekvoorkomen`
    open verharding, `plus_fysiekvoorkomen` sierbestrating; het midden van
    de rijweg en de strook langs de noordwestelijke galerij (G0546.55afdee0,
    G0546.20d2fd1b, hoogteligging 1) en het midden van de hellingen
    (G0546.d3209d0d, G0546.e05d0edd, hoogteligging 0).
  - `road:rijbaan-klinkers`: rijbaan lokale weg, open verharding, gebakken
    klinkers; de strook langs de zuidoostelijke galerij (G0546.ef356bbf,
    hoogteligging 1), de randen van de hellingen (G0546.992a05b8,
    G0546.47c938d5, G0546.dc1d0a30, G0546.2f90c016) en voorbij x = ±11,8 de
    kadestraten (G0546.4598eddb, G0546.cd445e68). Een eigen node omdat de BGT
    hier een ander materiaal geeft dan in het midden.
  - `road:voetpad`: voetpad, open verharding, gebakken klinkers; de vloer
    onder de galerijen (G0546.fede8693, G0546.500a897d, hoogteligging 1). De
    BGT spaart langs de rijweg zuilen uit die in het model iets anders staan;
    daar loopt het voetpad door.

  Zuilen, borstweringen en bordessen van de galerijen blijven met 2 cm
  rondom buiten de wegdelen, en de wegdelen houden 2 cm voor de borstwering
  op, de rand van het dek daarbuiten blijft steen. De laag is ook op deze
  kleine brug 0,5 m: boven de kruin van de middenboog blijft 0,4 m steen
  over, op de hellingen 0,35 m. In de GLB houden de bordessen van de
  galerijen op waar de brug begint (x = ±8,35); ze staken 0,3 m over het dek
  met hun bovenvlak (2,9 m) op het wegdek bij het landhoofd en gaven daar
  z-fighting. Wegdelen en constructie vullen samen precies de brug
  (764,35 m³: rijbaan 58,83, klinkers 11,33, voetpad 86,78, boogbrug
  607,42 m³); de STL is ongewijzigd.
- Twee galerijen van 24 × 7 m aan weerszijden van de 5 m brede rijweg, die
  4 m voorbij de brug doorlopen tot bordessen met twee treden op de kades.
  Per galerij achttien Toscaanse zuilen (diameter 0,5 m) op sokkels: per
  lange zijde hoekzuil, enkele zuil, gekoppeld paar, brede middentravee,
  gekoppeld paar, enkele zuil, hoekzuil; één middenzuil in elke kopse kant.
  De buitenste rij staat op een lage borstwering langs de dekrand.
- Hoofdgestel van 1 m (onderkant 6,1 m, kroonlijst 7,1 m boven water) met
  een 0,5 m uitspringend middenrisaliet van 7,4 m breed.
- Schilddak tot de nok op 9,5 m (AHN: NAP +8,9 m) met een dwarskap over het
  risaliet; frontons aan de wegzijde (stadswapen, schematisch blok) en aan de
  waterzijde (oculus).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Koornbrug),
[Rijksmonumentenregister 25673](https://monumentenregister.cultureelerfgoed.nl/monumenten/25673)
(brug met galerijen, drie bogen, 1642; galerijen Salomon van der Paauw 1825),
PDOK BGT (`overbruggingsdeel`: dek, landhoofden en pijlers voor plattegrond,
overspanning en oriëntatie; `wegdeel`: rijweg en voetpaden met functie en
fysiek voorkomen), PDOK AHN (dsm en dtm 0,5 m via WCS: kade, kruin
van het dek, kroonlijst, nok en dakvorm) en de PDOK luchtfoto (dakplattegrond
van de galerijen, risaliet en dwarskap), plus Wikimedia Commons-foto's
(`Leiden Koornbrug.jpg`, `Leiden - Koornbrug2.JPG`,
`Aanzicht - Leiden - 20137477 - RCE.jpg`,
`Overzicht exterieur - Leiden - 20134856 - RCE.jpg`, `Leiden - Koornbrug1.JPG`)
voor de opstand. Plattegrond, boogindeling, dek- en kadehoogte, kroonlijst en
nok komen uit BGT en AHN; boogvorm, zuilindeling, zuildikte, hoofdgestel,
risaliet, borstwering en bordessen zijn uit foto's geschat.

Printcheck op 1:1000 (uitsnede van 61 m, het hulpmiddel kiest 1:763, 80 mm,
3,5 s): alle onderdelen NoError; de wegdelen krijgen geen eigen opvulling
(`extraPct` 0), de boogbrug draagt de opvulling onder de gewelven (+44 %), de
galerijen 0 %.

Licentie van het model: eigen werk op basis van open bronnen.
