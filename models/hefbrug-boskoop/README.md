# Hefbrug Boskoop (Boskoop)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hefbrug-boskoop.glb` | Catalogusbron in meters: nodes `building:hefbrug-boskoop` (de hefbrug zelf: landhoofden, val, heftorens, brugwachtershuisje), `road:rijbaan`, `road:rijbaan-cementbeton` en `road:voetpad` (de bovenste laag van het dek met BGT-attributen) |
| `hefbrug-boskoop-1-1000.stl` | De brug in één stuk op 1:1000 met printvormen (zie onder) en een printvoet onder het val, met de onderkant (0,8 m onder de waterspiegel) op het printbed (54,9 × 21,8 × 44,5 mm) |
| `hefbrug-boskoop.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, vervangen BAG-panden en BGT-dekken, hoofdmaten en bronnen |

Gemaakt met `scripts/generate-hefbrug-boskoop.mjs` (alle maten als constanten
in het script).

De GLB is in meters met de oorsprong op RD (105158,52, 454245,78) (WGS84
52,07425 N, 4,66020 O), op de as van de weg midden tussen de twee heftorens,
op de waterspiegel van de Gouwe zoals het PDOK-terrein die legt (ellipsoïdisch
43,12 tot 43,17 m; met de geoïdehoogte van 43,46 m (NLGEO2018) NAP -0,31 m), en
de glTF-conventie Y omhoog. +X loopt langs de brug naar het oosten (`xAxis`
(0,99768, -0,06802), 3,90 graden rechtsom vanaf het oosten, uit de randen van
de BGT-rijbaan op het val), +Y naar het noorden. Het westelijke landhoofd ligt
op x = -29,39 tot -12,55, het val op x = -12,5 tot 12,5, het oostelijke
landhoofd op x = 12,55 tot 25,48. Het maaiveld wordt op vier punten op het
water bemonsterd (`groundSamplePoints`, x = ±6 op 20 m naast de as);
`groundOffsetMetres` is 0 en `groundHeight` (43,12, de laagste
PDOK-waterhoogte) is de terugval als een uitsnede alleen een uiteinde raakt.

Het model vervangt twee BAG-panden: het brugwachtershuisje
(`NL.IMBAG.Pand.0499100002021238`, PDOK reconstrueert het als een kolom tot
NAP +7,1 m) en het pand onder de westelijke toren
(`NL.IMBAG.Pand.0484100002028378`, bouwjaar 1935, in PDOK een plaat op
maaiveld; volgens het register de transformatorruimte in het landhoofd). Het
verbergt de drie BGT-dekken (`replacesTerrain`, met
`node scripts/replaces-terrain.mjs hefbrug-boskoop --write`):
`P0028.4b31246ddcb946078ab15fad54ac18c0` (het beweegbare dek),
`P0028.cc0d1124896b4bf4883f591816d5288c` en
`P0028.da325a82c4c34ba5a24152818cf1e3ac` (de dekken op de landhoofden); PDOK
legt ze als grijze plaat op het water.

Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek is per BGT-functie
een eigen node met de attributen van het BGT-wegdeel eronder in
`extras.attributes`, zodat de kleurregels van een thema op het brugdek werken
zoals op de PDOK-wegdelen ernaast:

| Node | Attributen | BGT-wegdelen (relatieve hoogteligging 1) |
| --- | --- | --- |
| `road:rijbaan` | `bgt_functie` rijbaan regionale weg, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | `P0028.0da21e8abb3443ebbd619e0f7776f163` (het val), in het model tussen de hoofdliggers (y = ±4,13) |
| `road:rijbaan-cementbeton` | idem met `plus_fysiekvoorkomen` cementbeton | `P0028.eb6bd6c5852a4bbe906ddee27eb33717` (west) en `P0028.4e2dc2d8038241779557f5aebd803730` (oost), in het model tussen y = ±4,45 |
| `road:voetpad` | `bgt_functie` voetpad, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | `P0028.b7f5a29853624be19cecdd2ef814955c` en `P0028.1b9136d90ac844c6a4c884b0239ad2c0` (val), `P0028.5a35462518db42068f36335818c0138f`, `P0028.810fc9896bdf414c9907e132e6babe70`, `P0028.5f13196bb3674178beb74782eacd4f65`, `P0028.d5b1939abbba4cdf9b02c62bcc66cfbc` en `P0028.f8784e1a1d634a5386ff0891b59102d2` (landhoofden) |
| `building:hefbrug-boskoop` | geen | de rest van het kunstwerk |

De grens tussen asfalt en cementbeton ligt in de voeg tussen val en landhoofd
(x = ±12,525; BGT -12,55 en 13,45, zie onder). De rijbaan op de landhoofden is
in het model een rechthoek tussen y = ±4,45 (BGT 4,3 tot 4,5, aan de kop van de
westelijke oprit versmallend tot -3,74 en 4,25). Op de landhoofden is de
onderkant van de wegdeklaag per stuk van het lengteprofiel horizontaal (0,5 m
onder het laagste punt van dat stuk, dus 0,5 tot 0,6 m dik), en de grenzen met
de torens en het huisje zijn rechthoekige blokken langs de assen: zo blijven
alle grensvlakken tussen wegdeel en constructie ook in float32 exact vlak. Met
een laag die de helling volgde en schuine grensvlakken om de torenpoten gaf het
inlezen van de samengevoegde GLB spleetjes, waardoor de opvulling van de export
een stuk wegdek onder de westelijke toren verloor. Wat boven het dek uitsteekt
blijft constructie, met 2 cm vrij: de hoofdliggers (de hele strook), de
zijvlakken van de torens (een blok om elk zijvlak, dus ook de strook van 0,9 m
onder het vakwerk) en het huisje. De volumes tellen op tot die van de brug als
geheel (3189,25 + 103,25 + 140,49 + 132,14 m³ = 3565,14 m³).

Onderdelen in het model (hoogtes in NAP):

- Wegdek volgens het AHN-DSM: +2,72 m op het val en aan de koppen van de
  landhoofden, naar de opritten aflopend tot +2,35 m aan de westkant (x =
  -29,4) en +2,53 m aan de oostkant (lengteprofiel met knikken op de
  meetpunten, per stuk vlak).
- Het westelijke landhoofd (BGT-dek met de pilonen aan beide zijden) tot het
  wegdek, met onder de kop van het dek de lage doorgang van de kade-weg
  (register: viaduct met een heel flauw tudorgewelf; BGT-wegdeel
  `G0484.2e036f5913bd123ce06346f8200a77e4` op maaiveld, x = -29,0 tot -25,5): in
  het model 3,0 m breed tussen een kopmuur van 0,9 m onder de kop van het dek
  en het landhoofd, met een gewelf van +1,40 m op de zijkanten tot +1,80 m in
  het midden.
- Het oostelijke landhoofd (BGT-dek) tot het wegdek, aan de zuidkant tot in het
  brugwachtershuisje en met het bordes ernaast.
- Het val in de laagste stand: 25,0 m tussen twee voegen van 5 cm (de
  landhoofden staan 25,1 m uit elkaar; register: doorvaartwijdte 25 m), op
  opleggingen die 0,3 m in elk landhoofd doorlopen. Een rijdek van 8,3 m
  tussen de hoofdliggers (register: 9 m tussen de leuningen) met de onderkant
  op +1,90 m (register: doorvaarthoogte gesloten 2,5 m, boven het boezempeil van
  NAP -0,61 m), twee geklonken vakwerkhoofdliggers van 0,9 m dik met het hart
  4,6 m naast de as (AHN) en de bovenrand op +7,22 m (AHN), met verticale
  eindstijlen, een onderrand tot 0,6 m boven het wegdek, zes vakken van 4,02 m
  met stijlen op alle knopen en diagonalen als W (foto's): alle twaalf
  vakwerkdriehoeken per ligger zijn doorgaande openingen. Het bovenwindverband
  (register, luchtfoto): zeven regels tussen de liggers, een langsligger op de
  as en per vak twee schoren van de liggers naar de as, zodat ruiten ontstaan,
  staven van 0,9 × 1,0 m tot 0,05 m onder de bovenrand. Buiten de liggers de
  voetpaden van 1990 (Wikipedia) op +2,35 m (AHN, 0,37 m lager dan de rijbaan),
  tot 6,9 m naast de as in het midden en 7,7 m bij de einden (BGT).
- Twee heftorens met per toren twee zijvlakken van open vakwerk (hart 5,6 m
  naast de as, 0,9 m dik; AHN): een verticale binnenpoot op de kop van het
  landhoofd (x = ±12,6 tot ±13,5, AHN), een tweede verticaal 2,75 m verder (de
  schacht van het contragewicht, foto's) en een schuine buitenpoot van x = ±24,3
  op het dek naar ±16,4 bovenin (de buitenste DSM-cellen per 2 m hoogte, schuin
  onder circa 12 graden), in zes vakken van 6,48 m met horizontale regels; in
  de schacht één diagonaal per vak, daarbuiten kruisen waar het vak onderaan
  breder is dan 4,5 m (de onderste vier) en daarboven één diagonaal. De voet
  van elk zijvlak zit 0,9 m in het landhoofd en de openingen beginnen op het
  dek. Tussen de zijvlakken regels van 1,0 × 1,0 m op de tweede verticaal en op
  de buitenpoot vanaf het eerste niveau (6,5 m boven de weg), in het vlak van de
  buitenpoten kruisen en onder de kop een bok (foto's vanaf de weg). De
  binnenkant naar het val is tot de kop open, want daar gaat het val omhoog.
  De kop met het machinebordes tot +41,6 m (AHN; register: torens van meer dan
  dertig meter, open doorvaarthoogte 35 m) en daarop boven de liggers twee
  kabelwielen van 2,2 m tot +43,4 m (AHN +43,0 tot +43,9 m). Het contragewicht
  hangt in gesloten stand bovenin de schacht, over de hele breedte tussen de
  zijvlakken, van +33,7 tot +36,2 m (foto's).
- Het brugwachtershuisje (BGT/BAG, register: betonnen veelhoekig huisje onder
  een met koper bekleed dak aan de zuidzijde tegen de oostelijke oever): een
  twaalfhoek van 4,46 m tussen de zijden van het water tot +6,3 m, met de
  raamband (+4,4 tot +6,0 m) als nis van 0,3 m, een kroonlijst die onder
  50 graden 0,5 m uitkraagt, een rand tot +7,05 m en een plat kegeldak tot
  +7,36 m (3D BAG).

Geschat: de waterspiegel (NAP -0,31 m: PDOK-water min de geoïdehoogte), de
onderkant van het val (+1,90 m uit de doorvaarthoogte van het register en het
boezempeil van Rijnland), de onderrand en de staafbreedte van de hoofdliggers,
het aantal vakken en het patroon van het vakwerk (foto's), de vorm van het
windverband (luchtfoto), de plaats van de tweede verticaal in de torens
(2,75 m, foto's), het aantal vakken van de torens (zes, foto's), de kruisen en
de bok tussen de zijvlakken, de kop (+41,6 m, tussen de DSM-cellen van de
leuningen en de wielen), de maat en plaats van de wielen en het contragewicht,
de doorgang onder het westelijke dek (breedte, kopmuur en gewelf; het AHN ziet
er niet onder) en de hoogtes van het huisje onder het dak (raamband,
kroonlijst). De BGT legt het val 0,45 m oostelijker (voegen op x = -12,55 en
13,45) dan het AHN de torens en de luchtfoto de regels van het windverband;
het model zet val en torens symmetrisch rond x = 0 en wijkt daarmee 0,45 m af
van de BGT-voegen. De koppen van de landhoofden en de kop van de westelijke
oprit staan haaks op de as (BGT wijkt tot 6 cm af).

Weggelaten: leuningen (met de sierlijke cirkels en de naam van de brug),
lantaarns, slagbomen, verkeerslichten, de kabels, de ladders en trappen langs
de buitenpoten, de balkons en bordessen halverwege de torens en de
machinekasten op de kop (allemaal dunner dan 0,9 m of los), de trappen van de
kade naar de brug (buiten de BGT-dekken), het houten remmingwerk in het water
(balken van circa 0,4 m, geen deel van het monument), het steigertje bij het
huisje (BGT-kunstwerkdeel `P0028.a0afebaf0d124cbc948f600719846232`, een plaat
op het water), en de aanbruggen met de bakstenen muurtjes en de viaducten
verder van de brug (PDOK-terrein).

Controle:

- `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts` in
  de webshop.
- De onderdelen zijn gesloten manifolds (NoError); de volumes tellen op tot de
  brug als geheel (verschil 0), zonder overlap. Na opslaan als GLB (float32) en
  opnieuw inlezen met samenvoegen van hoekpunten is elk onderdeel en het geheel
  ongewijzigd (geen samenvallende maar losse hoekpunten).
- Geen samenvallende vlakken: 13 628 verticale stralen om de 0,25 m over het
  hele model, geen twee bovenvlakken van verschillende onderdelen binnen 1 cm
  en geen wegdeel of dekconstructie zonder dikte.
- In het model hangen vrij (vlakker dan 45 graden): de onderkant van het val
  (354 m²), het gewelf van de doorgang (49 m²), de vlakke kanten van de
  openingen in de liggers (64 m²) en de torens (149 m²), het windverband
  (120 m²), de regels en kruisen tussen de zijvlakken (335 m²), de onderkant
  van de kop (73 m²) en van het contragewicht (36 m²), de opleggingen in de
  voeg (1,5 m²) en de raamband en de kroonlijst van het huisje (4 m²). Dat
  vult de export op.
- Printcontrole van de catalogus (`shareModelSupport` met `supportedSolid`,
  45 graden, het model op 1:1000): de wegdelen krijgen geen eigen opvulling
  (`extraPct` 0 voor rijbaan, cementbeton en voetpad), de constructie draagt
  alles (3189 naar 5373 m³, +68 %). Onder het val vult de export de doorvaart
  tot de onderplaat (het val ligt 3,0 m boven de onderkant; doorsnede 243 m² op
  het water, 344 m² onder het val); in de torens komt er onder de regels en
  kruisen opvulling bij (doorsneden van 9 tot 15 m² naar 18 tot 28 m²).
- De STL, die zonder export wordt geprint, heeft printvormen: in de liggers en
  in de schacht van de torens blinde nissen van 0,35 m aan de buitenkant, in
  de buitenvakken van de torens alleen de openingen met steile plafonds (12 van
  108) doorgaand, in elke toren een kern in de schacht tussen de zijvlakken met
  een spitse doorgang (zijden van 55 graden) over de weg en een console van
  50 graden onder het bordes, geen windverband of dwarsverband, een dichte
  doorgang onder het westelijke dek en onder het val een printvoet (wig van
  50 graden die als trapezium op de onderplaat uitkomt). Het script controleert
  dat de printversie geen andere overhang heeft dan nissen, de wielen, de
  raamband en de opleggingen.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
grijze plaat op het water met het huisje als kolom en zonder torens. Het model
heeft van alle vier kanten de twee torens met hun open vakwerk: van zuid en
noord de zijvlakken met de schuine buitenpoot en de schacht, van oost en west
de regels met kruisen boven de weg en het contragewicht onder de kop; verder
het val met de vakwerkliggers en het windverband, de voetpaden buiten de
liggers, de landhoofden met de doorgang aan de westkant en het huisje met
raamband en kroonlijst.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Hefbrug_Boskoop)
(gebouwd 1935-1936 door De Vries Robbé, val van 100 ton, in 1990 verbreed met
twee voetpaden, hefhoogtes 12, 24 en 34 m),
[Rijksmonumentenregister 512076](https://monumentenregister.cultureelerfgoed.nl/monumenten/512076)
(twee konisch toelopende heftorens van open geklonken vakwerk, val met twee
vakwerkhoofdliggers en een bovenwindverband, betonnen ballastblokken en
kabelwielen bovenin de torens, doorvaartwijdte 25 m, 9 m tussen de leuningen,
doorvaarthoogte 2,5 m gesloten en 35 m open, betonnen landhoofden met gele
baksteen, het veelhoekige brugwachtershuisje, het viaduct en de
transformatorruimte op de westelijke oever; 512003 is de Hefbrug Waddinxveen,
516141 de Hefbrug Gouwesluis), PDOK BGT (overbruggingsdeel: dekken en
landhoofden; wegdeel: rijbaan en voetpaden op het dek en de lokale weg door de
doorgang; pand: het brugwachtershuisje), PDOK AHN (dsm 0,5 m via WCS: wegdek,
liggers, torens, wielen), de PDOK-luchtfoto (windverband, ligging), het
PDOK-terrein (waterspiegel), de 3D BAG (dak van het huisje) en de Wikimedia
Commons-foto's 200408 Hefbrug Boskoop.jpg, Boskoop hefbrug1.jpg, Boskoop
hefbrug2.jpg, De Stella Maris voor de Hefbrug Boskoop.jpg, Hefbrug Boskoop -
Beweegbaar deel van de hefbrug.jpg, Hefbrug Boskoop - Brugopening.jpg, Hefbrug
Boskoop - Voetpad en brugwachtershuisje.jpg, Hefbrug Boskoop - Zuidkant
brug.jpg, Hefbrug Boskoop 2019 1 tot en met 4.jpg en de RCE-foto's 20342360,
20353274, 20353275 en 20366689 voor het vakwerk van torens en val, het
windverband, de wielen, het contragewicht en het huisje.

Licentie van het model: eigen werk op basis van open bronnen.
