# Museum Het Valkhof (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `museum-het-valkhof.glb` | Catalogusbron in meters: node `building:museum` (de uitkragende glazen doos op de teruggezette begane grond, met gevelbanden, erkers, installatieblok en dakputten) en `road:trap` (de brede trap naar de ingang) |
| `museum-het-valkhof-1-1000.stl` | Het museum met de trap op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (80 × 41 × 14 mm) |
| `museum-het-valkhof.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen BAG-pand, hoofdmaten en bronnen |

Gemaakt met `scripts/generate-museum-het-valkhof.mjs`.

## Oorsprong, assen en maaiveld

De GLB is in meters met de glTF-conventie Y omhoog. Na omzetting naar Z omhoog
ligt de oorsprong op RD (188364,75, 428777,5), het hart van het BAG-pand, op
het maaiveld van het Kelfkensbos (NAP +33,93 m). +X loopt langs de
achtergevel naar de zuidkop (RD-richting 251,0 graden) en +Y loodrecht
daarop naar het park; de voorgevel aan het plein ligt aan de −Y-kant.

Het gebouw staat op de flank naar het Valkhofpark: het plein voor de
voorgevel ligt op NAP +33,9 tot +34,4 m, het pad langs de achtergevel op
+35,4 tot +36,5 m en het park erachter, boven een talud, op circa +41 m; aan
de noordkop ligt een verdiepte strook op +34,8 tot +35,7 m met daarachter
terrein tot +38,5 m. Het maaiveld wordt daarom alleen op het plein en bij de
zuidkop bemonsterd (`groundSamplePoints` (−30, −29), (0, −30), (30, −31) en
(45, −10), 8 tot 10 m van de gevel), met `groundHeight` 77,66 m
(ellipsoïdisch, het laagste PDOK-terreinpunt op die punten) als terugval. Aan
de park- en noordzijde verdwijnt de voet zo 1,5 tot 2,5 m in het PDOK-terrein,
zoals in het echt. `groundOffsetMetres` is 0.

Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0268100000045512`. Het
pand uit 1670 ten zuiden van de zuidkop (`0268100000045509`), de
Sint-Nicolaaskapel, de Barbarossaruïne en het park blijven PDOK.

## Onderdelen

Hoogtes boven het maaiveld van het plein (NAP +33,93 m).

- **De doos**: plat dak op +11,77 m (NAP +45,7 m, AHN). Achtergevel en
  zuidkop liggen op de BAG-lijnen; de voorgevel staat 3,2 graden gedraaid
  (gemeten op de dakrand in het AHN: v = −21,09 − 0,0562 u, resten 0,2 m), dus
  de doos is aan de zuidkop 40,6 m en aan de noordkop 38,7 m breed, 80,2 m
  lang. De noordkop staat haaks op de voorgevel.
- **Uitkraging**: de begane grond volgt de BAG-contour (met twee
  terugsprongen aan de pleinzijde) en de doos kraagt daarover 2,8 tot 5,2 m
  uit aan het plein en 2,6 tot 4,4 m aan de noordkop; de onderkant op
  +4,07 m (NAP +38,0 m) is vlak, de export vult daaronder op.
- **Gevelbanden**: twee groeven van 0,6 m hoog en 0,35 m diep op +6,87 en
  +9,37 m in de voorgevel en beide koppen, met de bovenkant onder 47 graden.
- **Erkers aan de parkzijde**: 17 glazen erkers op 3,09 m (u −40,4 tot
  12,1), elk met het glas schuin van de buitenrand na een vin van 0,9 m naar
  1,8 m achter de gevel (zaagtand in plattegrond), vanaf +4,67 m tot het dak
  open. Het zuidelijke deel van de achtergevel is dicht.
- **Dak**: installatieblok van 8,5 × 2 m tot +13,07 m (NAP +47,0 m) en twee
  dakputten van 1,8 × 4 m aan de zuidkop tot +10,37 m (NAP +44,3 m), alles
  uit het AHN.
- **Trap** (`road:trap`): de brede trap voor de ingang in het noordelijke
  deel van de voorgevel (u −35 tot −22, 13 m), vier treden van 0,15 m en 0,6 m
  tot de vloer van de begane grond (+1,0 m), van de teruggezette gevel tot
  1,2 m voor de doos. Het PDOK-terrein ligt hier op +0,3 tot +0,6 m; de
  onderste trede (+0,55 m) blijft erboven, de lagere treden van de echte trap
  zitten in het terrein.

## Weggelaten

- De schuine zuil van het Noviomagusmonument op het plein: geen deel van het
  museum (en circa 1 m dik).
- De borstwering op het dak (0,2 tot 0,3 m), de zonnepanelen en de lamellen
  en voegen tussen de banden: kleiner dan 0,9 m.
- De gebogen plantenbak naast de trap (rand circa 0,5 m) en de letters op de
  gevel.
- Het glazen deel van de noordkop en de witte vinnen tussen de erkers zijn
  in hetzelfde materiaal; de vinnen zijn 0,9 m dik in plaats van circa 0,3 m.
- De witte plintmuur met "museum het valkhof" van vóór de verbouwing
  (2022–2026) bestaat niet meer.

## Printbaarheid

Elke node is een gesloten manifold. Alle vlakken wijzen omhoog of staan
verticaal, behalve de vlakke onderkant van de uitkraging. De printcheck op
1:1000 (`prepareMeshes` met de printbare overhangopvulling) geeft het museum
2,4 % extra volume (de wig onder de uitkraging) en de trap 0 %; status
NoError. De STL is 35 cm³ en één samenhangend deel.

## Geschat

- De hoogte van de onderkant van de uitkraging (NAP +38,0 m) uit foto's van
  de voorgevel.
- De hoogte van de gevelbanden (NAP +40,8 en +43,3 m) uit foto's van vóór de
  verbouwing; de banden zijn een vereenvoudiging van de horizontale lamellen.
- De vorm van de erkers (diepte 1,8 m en aantal uit de luchtfoto, de richting
  van het schuine glas uit foto's van de achtergevel).
- De plaats, breedte en hoogte van de trap (foto na de verbouwing).

## Bronnen

- [Wikipedia: Valkhof Museum](https://nl.wikipedia.org/wiki/Valkhof_Museum)
- PDOK BAG, pand 0268100000045512 (contour van de begane grond)
- PDOK AHN, DSM en DTM 0,5 m via WCS (dak, dakranden, installatieblok,
  dakputten, maaiveld)
- PDOK luchtfoto (Actueel_orthoHR): erkers en dakindeling
- Foto's op Wikimedia Commons van de voorgevel, de achtergevel en de
  noordkop, voor en na de verbouwing (alleen gebruikt om te meten, niet in
  deze repo)
