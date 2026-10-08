# Kubuswoningen (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kubuswoningen.glb` | Catalogusbron in meters: één node `building:kubuswoningen` met onderbouw, pijlers en kubussen |
| `kubuswoningen-1-1000.stl` | Het complex in één stuk op 1:1000, met de onderkant (NAP +0,5 m) op het printbed (112 × 126 × 31 mm) |
| `kubuswoningen.json` | Catalogusitem met RD-georeferentie, twee vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93306,5, 437251,5), een punt van
Bloms raster, op straatniveau (NAP +3,8 m) en de glTF-conventie Y omhoog. Het
model is noord-georiënteerd (+X oost, +Y noord). Het maaiveld wordt op drie
punten op de straat langs de Blaak en de Hoogstraat bemonsterd
(`groundSamplePoints`), niet op de lagere kade aan de Oudehaven
(NAP +1,8 m).

Het catalogusitem vervangt de BAG-panden `NL.IMBAG.Pand.0599100000701291` (het
complex) en `NL.IMBAG.Pand.0599100000764949` (de onderbouw onder de
zuidoostelijke grote kubussen, die PDOK tot in die kubussen optrekt). Het
Potlood (Blaaktoren) is een apart pand en blijft staan.

Alles zit bewust in één node. Een kubus die op een punt staat heeft
ondervlakken die 35 graden uit het lood hangen; dat print zonder steun, maar een
object zonder enige steilere overhang krijgt in de export de verticale
opvulling (2,5D naar beneden geëxtrudeerd), waarbij elke kubus een zeshoekige
toren zou worden. Met onderbouw en pijlers in dezelfde node geeft de doorgang
onder het dek een vlakke onderkant, zodat de export het geheel laag voor laag
opvult; de doorgang zelf (40 m overspanning) wordt daarbij dichtgezet, de
kubussen blijven zoals ze zijn.

Onderdelen in het model (hoogtes in NAP):

- Bloms driehoeksraster: 8,66 m tussen buren, 2,2 graden gedraaid ten opzichte
  van RD, gefit op de AHN-toppen (afwijking per top meestal onder 0,3 m).
- 46 woningkubussen met ribbe 5,5 m en de lichaamsdiagonaal verticaal (wanden
  onder 54,7 graden), top op +24,8 m, de drie bovenste hoekpunten naar de buren
  in het raster (richtingen 30, 150 en 270 graden plus de draaiing, AHN:
  richels die tot 4,5 m uit het hart op +21,6 m lopen). Onderste punt op
  +15,3 m.
- Drie grote kubussen met ribbe 11 m: één aan de noordwestkant (top +30,8 m)
  en twee naast elkaar aan de zuidoostkant (+31,0 en +30,8 m).
- Zeshoekige pijlers van 3,1 m over de vlakken (de grote kubussen 4,6 m), van
  de onderbouw tot 2,6 m in de kubus.
- Onderbouw op de BAG-contouren: het lage deel op +7,1 m en het voetgangersdek
  op +10,3 m (AHN, buiten de kubussen gemeten en eronder doorgetrokken), met
  onder het BGT-dek de doorgang voor de Blaak tot +8,8 m.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Kubuswoningen_(Rotterdam))
(Piet Blom, 1982-1984, 38 woningkubussen, 13 bedrijfskubussen en 2
superkubussen), [Wikipedia (en)](https://en.wikipedia.org/wiki/Cube_house)
(wanden onder 54,7 graden, kubussen aan elkaar), PDOK BAG (contouren), PDOK
AHN (dsm en dtm 0,5 m via WCS: raster, toppen, ribbe, draaiing, dek en
onderbouw), PDOK BGT (`overbruggingsdeel`: dek over de Blaak), de PDOK
luchtfoto en Wikimedia Commons-foto's
(`Overzicht kubuswoningen - Rotterdam - 20359748 - RCE.jpg`,
`Cube Houses @ Oudehaven @ Rotterdam (29948985423).jpg`) voor pijlers en
opbouw. Raster, toppen, ribbe, draaiing en de niveaus van de onderbouw komen uit
het AHN; de ribbe van de grote kubussen (dubbel), de pijlerbreedte en de diepte
van de doorgang zijn geschat. In het AHN zijn 46 kubussen op woninghoogte te
onderscheiden; de bronnen noemen 51 woning- en bedrijfskubussen, dus enkele
lagere bedrijfskubussen ontbreken. Ramen, de piramidevormige daktuinen en de
trappen zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
