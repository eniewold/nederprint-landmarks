# Villa Volta (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-villa-volta.glb` | Catalogusbron in meters: nodes `building:villa` (de villa met mansardedak, risaliet, portiek en balkon, dakkapellen, beeld, lijsten, vensternissen en de borstwering van het bordes met vazen), `building:hal` (de lage hal achter de villa en de ingangsoverkapping aan de oostkant) en `road:bordes` (bordes en trappen) |
| `efteling-villa-volta-1-1000.stl` | Het model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (21,5 × 36,8 × 15,1 mm) |
| `efteling-villa-volta.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-villa-volta.mjs`](../../scripts/generate-efteling-villa-volta.mjs)
(met de gedeelde hulpfuncties uit `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131477,90, 407200,02), op de
middenas van de villa midden in het hoge blok, op het maaiveld (NAP +8,4 m),
en de glTF-conventie Y omhoog. +X loopt langs de voorgevel naar het
oost-zuidoosten (11,5 graden met de klok mee vanaf de RD-X-as), +Y naar
achteren; de voorgevel met het bordes kijkt naar −Y (zuid-zuidwest), naar het
parterre met de zonnewijzer. Het maaiveld is vlak (NAP +8,35 tot +8,7 m) en
wordt op zes punten rondom bemonsterd (`groundSamplePoints`: het parterre,
naast het bordes, langs beide zijkanten en achter de hal), `groundOffsetMetres`
0. Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0809100000017595` (villa
en hal, bouwjaar 1996). De ingangsoverkapping staat niet in de BAG. Het pand
`0809100000017567` (2009) ten noorden ligt aan de overkant van de Europalaan,
buiten het park, en hoort niet bij de attractie.

Onderdelen (hoogtes boven het maaiveld):

- De villa (13,4 × 18,1 m): het hoge blok met de draaiende zaal, gevels tot de
  goot op 8,8 m (AHN NAP +17,2 m) en een mansardedak dat steil oploopt tot de
  knik (10,4 m, 0,8 m naar binnen) en flauw tot het platte bovenvlak op 10,9 m
  (AHN +19,3 m). Plint, cordonlijst op 5 m en kroonlijst op een kraag van 45
  graden, hoeklisenen van 1,2 m, vensters (0,9 × 1,6 m) als nissen van 0,3 m
  met driehoekige frontonnetjes: twee per verdieping in de voorgevel, vijf per
  verdieping in de zijgevels (beneden aan de oostkant alleen waar de
  overkapping niet staat) en drie boven de hal in de achtergevel.
- Het middenrisaliet (8,2 m breed, 3,1 m vooruit) met een eigen schild in het
  mansardedak, de balkondeuren als nis en de grote dakkapel met een gebogen
  fronton tot 12,3 m (AHN +20,7 m) dat 4 m diep het dak in loopt, voluten
  opzij, twee vazen en het beeld van Vrouwe Goeds (sokkel, gewaad, hoofd en
  armen schuin omhoog) tot 14,6 m.
- De portiek met het balkon (7,8 m breed, 2 m voor het risaliet): een dicht blok
  tot de balkonvloer op 5 m (AHN +13,4 m) met de zuilen op de voorhoeken, de
  ruimte tussen en naast de zuilen als nis van 0,4 m en de dubbele deur nog
  0,3 m dieper, kapitelen en balkonlijst op een kraag, een dichte borstwering
  tot 6 m (AHN +14,5 m) met vazen op de hoeken.
- Twee kleine dakkapellen (oeil-de-boeuf) op de voorkant van de zijtraveeën met
  een zadeldakje en een pinakel.
- Het bordes (17,2 m breed, 0,8 m hoog, AHN +9,2 m) met twee treden van 0,27 m
  ervoor, een dichte borstwering tot 1,7 m met drie vazen per kant en twee
  plantenvazen voor de portiek.
- De hal achter de villa (16,2 × 11,7 m, plat op 5 m, AHN +13,4 m) met een
  dakrand van 0,4 m breed tot 5,25 m.
- De ingangsoverkapping aan de oostkant (5,4 × 23,1 m, plat op 3,8 m, AHN
  +12,2 m): een dicht blok met de open zijden als nissen van 0,5 m tussen
  pijlers van 0,9 m.

Printbaar op 1:1000 en 1:500 zonder steun: muren staan recht op, daken lopen
schuin omhoog, lijsten, frontonnetjes, kapitelen en balkonlijst rusten op een
kraag van 45 graden, de voluten lopen onder 61 graden af en de armen van het
beeld onder 47 graden omhoog. Alleen de nissen (vensters, deuren, portiek,
bogen van de overkapping) hebben een vlakke bovenkant van 0,3–0,5 m diep. De
export vult op 1:1000 0,09 % (villa) en 0,17 % (hal) op, op 1:500 0,07 % en
0,16 %; het bordes niets. De STL is 4,8 cm³ en één samenhangend deel.

Bronnen: PDOK BAG (het pand), PDOK AHN (DSM en DTM 0,5 m via WCS, als raster
per 0,5 m in het stelsel van de villa), de PDOK-luchtfoto (8 cm) en foto's op
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Villa_Volta)
(frontaal en vanuit het zuidoosten). Uit het AHN: de voetafdrukken, de goot,
het dakvlak, het fronton, het balkon, de hal, de overkapping en het bordes.
Geschat uit foto's: de knik van het mansardedak, de vensters, de lijsten, de
vorm van fronton, voluten, vazen en beeld, en de pijlers van de overkapping.
Weggelaten: het smeedijzeren hek, de lantaarns, de balusters (dichte
borstweringen), het opschrift en de oprit naar de ingang. De villa heeft geen
torens of schoorstenen (het AHN toont geen pieken op het dak).
