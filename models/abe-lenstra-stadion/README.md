# Abe Lenstra Stadion (Heerenveen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `abe-lenstra-stadion.glb` | Catalogusbron in meters: node `building:stadion` (kom met vier tribunes, vier hoeken, lichtmasten en de aangebouwde hallen) |
| `abe-lenstra-stadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (297 × 161 × 39 mm) |
| `abe-lenstra-stadion.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (191883,55, 552546,00), in het
hart van de veldopening op het maaiveld (NAP +0,1 m), en de glTF-conventie Y
omhoog. +X loopt langs de lengteas van het veld naar het zuidoosten
(−53,7 graden vanaf de RD-X-as) en +Y dwars daarop naar het noordoosten, naar
de hoofdtribune. Het maaiveld wordt op vier punten rond het stadion
bemonsterd (`groundSamplePoints`, polder op NAP 0,0 tot +0,2 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0074100000349206`,
`NL.IMBAG.Pand.0074100000355314`, `NL.IMBAG.Pand.0074100000342112` (hallen en
oostkop) en `NL.IMBAG.Pand.0074100000335067`.

Onderdelen (hoogtes boven het maaiveld, uit het AHN-DSM, in vlakken en
dwarsprofielen, geen hoogteveld):

- Veldopening van 116,5 bij 81 m (u −58 tot 58,5 m, v −40 tot 41 m).
- Noordoost- of hoofdtribune: één dwarsprofiel langs 115 m: verticale gevel
  aan het veld tot +12,3 m, schuine voorkant naar de dakrand op +24,8 m, het
  dak daalt over 25 m naar +22,3 m en blijft dan vlak tot de achtergevel op
  v = 83 m. Drie raamstroken van 2,4 m hoog als nissen van 0,35 m diep.
- Zuidwesttribune: dak van +18,4 m aan de buitenkant tot +20,5 m aan het veld,
  met twee raamstroken en de entreehal (+14,1 m) in het midden van de gevel.
- Kopse tribunes: zadeldak met de nok op u −76 m (west) en u 78 m (oost) op
  +26,4 m, aan de veldkant van de westtribune schuin aflopend tot +12,7 m, aan
  de buitenkant een lagere aanbouw (+14 m) en één raamstrook.
- Vier hoeken met een vlak dak op +20,0 m (noord) en +18,5 m (zuid), afgesneden
  op de afgeschuinde buitenomtrek.
- Vier lichtmasten op de binnenhoeken als schuine staven van 2 × 2 m (top
  +31,8, +38,7, +32,9 en +36,0 m uit het AHN, voet op het hoekdak langs de
  diagonaal, niet flauwer dan 50 graden).
- Aangebouwde hallen aan de zuidoostkant: hal A (u 96 tot 134 m, gewelfd dak
  +14,2 tot +16,5 m), een lage verbinding (+10,7 m), hal B (u 142 tot 199 m,
  boogdak tot +17,4 m) en de lage aanbouwen binnen het BAG-pand (+4,7 en +7 m).

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
85,5 % ligt binnen 1 m en 90,9 % binnen 2 m. Het dwarsprofiel van de hoofd-
en de zuidwesttribune is per blok van 20 m gemeten: het verschil met het eerste
blok is hooguit 1,1 m (95e percentiel) bij de hoofdtribune en 1,8 m bij de
zuidwesttribune (entreehal en dakopbouw). De afwijkingen zitten in de dakspanten
boven de hoofdtribune, de technische opbouw op het dak, de kabels en de randen.

Printbaar op 1:1000: alle vlakken boven de onderkant wijzen omhoog of staan
verticaal (de voorkanten van de tribunes zijn hellingen naar het veld), de
lichtmasten leunen onder minstens 50 graden en alleen de bovenkant van de
raamstroken (0,35 m) is vlak. De export vult op 1:1000 en 1:1500 niets op
(−0,01 % volume); op 1:2500 komt er 0,6 % bij rond de masten. De STL is
574 cm³ en het model één samenhangend deel met de veldopening als gat.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Abe_Lenstra_Stadion)
(26.800 plaatsen, veld 105 × 68 m), PDOK BAG (de vier panden), PDOK AHN (dsm
en dtm 0,5 m via WCS), de PDOK luchtfoto en Wikimedia Commons-foto's. Geschat
zijn de hoogtes en diepte van de raamstroken, de doorsnede van de lichtmasten
en hun voet, de hoogte van de lage aanbouwen en de grenzen tussen tribunes en
hoeken (op 0,5 m afgelezen). Weggelaten: de dakspanten boven de hoofdtribune,
de zuilengang eronder, de technische opbouw op het dak en de loopbrug vanaf de
noordoosthoek.
