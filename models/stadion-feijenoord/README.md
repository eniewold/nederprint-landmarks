# Stadion Feijenoord (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadion-feijenoord.glb` | Catalogusbron in meters: node `building:stadion` met de kom, de tribuneringen, het ringdak en de gevel met trappentorens, node `building:lichtmasten` met de vier masten |
| `stadion-feijenoord-1-1000.stl` | Stadion en lichtmasten op 1:1000, met de onderkant (NAP +1,0 m) op het printbed (214 × 176 × 53 mm) |
| `stadion-feijenoord.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van het veld (het midden van
de veldomranding in het AHN) op straatniveau (NAP +2,0 m) en de
glTF-conventie Y omhoog. +X loopt langs de lengteas van het veld naar het
zuidzuidoosten (RD-richting (0,453, -0,891), 63,06 graden onder het oosten),
+Y dwars daarop naar het noordnoordoosten, naar de kant met de loopbruggen
naar het gebouw naast het stadion. Het maaiveld wordt op vier punten vlak voor
de gevel bemonsterd (`groundSamplePoints`, NAP +1,9 tot +2,1 m), niet op het
veld of in de gracht eromheen. De kom zelf is geen BAG-pand; het catalogusitem
vervangt de twee panden die onder het model liggen:
`NL.IMBAG.Pand.0599100100005153` (een bouwdeel onder de noordnoordoostelijke
tribune) en `NL.IMBAG.Pand.0599100110026028` (een klein pand uit 2026 tegen de
gevel).

Alle vormen zijn op het AHN gefit, dat als raster per 0,5 m in het stelsel van
het stadion is bekeken (dak binnen 2 m van het AHN: 96 %; het hele model
86 % binnen 2 m, 82 % binnen 1 m, mediaan -0,02 m; de eerste versie 84 %,
80 % en +0,15 m). Het Mapbox-landmarkmodel is niet gebruikt. Het veld
(NAP +2,3 m) en de gracht eromheen zitten niet in het model: de kom is open
en het PDOK-terrein vormt het veld.

Onderdelen in het model (hoogtes in NAP):

- Onderste ring vanaf de veldomranding, een rechthoek van 128 × 88 m met
  hoeken van 6 m straal, in treden van 2 m diep en 0,38 m hoog vanaf +2,2 m
  (helling 0,19 zoals in het AHN), tot onder de tweede ring.
- Ringgang van 2 m breed op +2,2 m tussen de onderste ring en de voorkant van
  de tweede ring, langs de rechte lange zijden (|x| < 42 m); het AHN toont
  hem daar als doorlopende strook op straatniveau, op de kopse kanten niet.
- Tweede ring: voorkant van +14 tot +17 m, per richting uit het AHN 4 tot
  4,5 m voor de binnenrand van het dak op de kopse kanten, 1,5 tot 2 m op de
  lange zijden en 0,9 m in de hoeken (tabel per 5 graden). Daarachter treden
  van 1,2 × 0,8 m tot onder het dak. De onderkant loopt onder 45 graden terug
  tot op de onderste ring: de loshangende ring zonder kolommen blijft zo
  zichtbaar als donkere spleet zonder vrije overhang.
- Ringdak met drie superellipsen rond het hart: binnenrand
  |u/80,6|^3 + |v/60,2|^3 = 1, nok |u/95|^3 + |v/77,45|^3 = 1 en buitenrand
  |u/102,1|^2,88 + |v/85,3|^2,88 = 1. De nok ligt rondom op +34,45 m; naar
  binnen zakt het dak 0,583 m per meter tot +26,05 m aan de kopse kanten en
  +23,4 m in de hoeken, met een dakrand van 2 m en een onderkant die onder
  50 graden terugwijkt tot op de treden van de tweede ring. Naar buiten zakt
  het dak 0,9 m per meter tot de dakgoot.
- Dakgoot per richting uit het AHN (waar het dak onder +25,5 m zakt, tabel per
  2,5 graden, gladgestreken): 205 × 167 m, tot 3 m binnen de
  buitenrand-superellips; op de kopse kanten en in de hoeken steekt het dak
  2 tot 3 m verder uit dan ernaast. De goot is 1,2 m hoog met een schuine
  onderkant van 45 graden.
- Gevel in lagen: een glazen band van 3 m onder de goot, 1,1 m terug, de
  grijze band 0,8 m terug, de buitengalerij op +19,5 m die 1,2 m voor de goot
  uitsteekt (AHN) met een borstwering van 1,2 m en een schuine onderkant tot
  de onderbouw 1,5 m achter de goot.
- 60 kolommen van het dak (1 × 1 m) om de 10,4 m langs de goot, van de
  onderkant tot in de goot, met een kolom op elke as.
- Grote kruisverbanden in de twee traveeën aan weerszijden van elke hoek
  (acht traveeën, diagonalen van 0,9 m onder circa 67 graden).
- 22 trappentorens, om de drie traveeën midden in een travee (AHN): bordessen
  om de 3,4 m met een schuine onderkant van 45 graden, hoekstijlen en de
  trappen als schuine richels (onderkant 60 graden) op de drie buitenvlakken.
  De bordessen treden naar boven toe terug naar de gevel, zoals het AHN toont:
  bij de kopse kanten 7 m breed, bovenste bordes +16,1 m tot 4 m buiten de
  goot, onderste tot 5,5 m; midden op de kopse kanten 8 m breed en korter
  (2 tot 4,5 m); midden op de lange zijden 5,5 m breed tot +12,7 m.
- Vier vakwerklichtmasten (aparte node) op (±91,4, ±63,7) m: een afgeknotte
  piramide van 4 m aan de voet tot 1,6 m op +46 m en een kop van 9 × 2 m tot
  +53,5 m, gericht op het hart, met een onderkant van 45 graden (AHN: koppen
  tot +54,3 m).

Alles begint op dezelfde onderkant. Naar beneden gerichte vlakken zijn alleen
de bedoelde schuine onderkanten van 45 graden (holte onder de tweede ring,
galerij, goot, bordessen, kop van de masten), 50 graden (dak) en 60 graden
(trappen); vlakker dan 43 graden is er niets (0 m², voor en na). Met de optie
‘Printbare overhang’ laat de export die holtes open: op 1:1000 gaat het
stadion van 361,7 naar 366,9 cm³ (de eerste versie 370,4 naar 375,5 cm³) en
duurt de hele export van een uitsnede van 260 m circa 27 s (eerst 10 s). De
masten (1,9 cm³) zijn op 1:1000 1,6 tot 4 mm dik.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Stadion_Feijenoord)
(Brinkman en Van der Vlugt, 1937, veld 105 × 68 m, loshangende tweede ring,
vrij dragend ringvormig dak uit 1994), PDOK AHN (dsm en dtm 0,5 m via WCS:
veldomranding, dakranden, nok, dakhoogte, dakgoot, voorkant van de tweede
ring, onderste ring, ringgang, galerij, trappentorens, lichtmasten en
straatniveau), PDOK BAG (panden onder het model), de PDOK luchtfoto en foto's
op Wikimedia Commons (gevel met kolommen, kruisverbanden, galerij en trappen,
de trappentoren van vak DD uit 1937, het interieur met beide ringen).
Geschat zijn de hoogtes van de voorkant en de treden van de tweede ring, de
dikte van dakrand en goot, de hoogtes van de glazen band en de galerij, de
kolommaat, de bordessen en de maten van de lichtmasten; de vier trappentorens
midden op de lange noordnoordoostzijde zijn gespiegeld van de overkant (daar
vervuilen de loopbruggen het AHN). Het AHN onder de binnenrand van het dak en
buiten de goot geeft gemengde waarden (dakvakwerk, open trappen). Niet
gemodelleerd: de loopbruggen naar het gebouw ernaast (vrije overspanningen),
de skyboxen in de tweede ring, de vakwerkstructuur van de masten en de
toegangshekken op straatniveau.

Licentie van het model: eigen werk op basis van open bronnen.
