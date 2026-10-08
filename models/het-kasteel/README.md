# Het Kasteel (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `het-kasteel.glb` | Catalogusbron in meters: node `building:stadion` (ring van tribunes met dakplaten boven de zitrang, het Kasteel, het clubgebouw en vier vakwerk-lichtmasten) |
| `het-kasteel-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (187 × 136 × 25 mm, met de losse masten) |
| `het-kasteel-grondplaat-1-1000.stl` | Idem met een grondplaat van 1 mm, omdat de vier masten los van de ring staan |
| `het-kasteel.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (89395,20, 437202,80), in het hart
van de veldopening op het maaiveld (NAP -1,2 m), en de glTF-conventie Y omhoog.
+X loopt langs de lengteas van het veld naar het noordoosten (29,4 graden
vanaf de RD-X-as) en +Y dwars daarop naar het noordwesten, naar de
clubgebouwen. Het maaiveld wordt op vier punten op de pleinen en straten rond
het stadion bemonsterd (`groundSamplePoints`, NAP -1,2 tot -1,4 m). Vervangt
de PDOK-reconstructie van de vier BAG-panden van het stadion:
`NL.IMBAG.Pand.0599100000675996`, `…675997`, `…675998` en `…676003`.

Onderdelen (hoogtes boven het maaiveld; AHN-DSM op 0,5 m en op 0,25 m,
luchtfoto en foto's; alles in blokken, prisma's en convexe rompen van vlakken,
geen hoogteveld):

- De ring van tribunes (voorrand 127 bij 87 m, achterwand 152 bij 115 m, uit
  het DSM: voorrand oost 63,35 m, west −63,3 m, noord 43,95 m en zuid −42,8 m,
  achterwand 76,2, −76,1, 58,9 en −55,9 m). Per zijde een eigen doorsnede die
  langs de zijde is uitgetrokken en uit de volgende delen bestaat: de
  zitrang in zes treden (1,8 m diep, 1,1 m hoog, van +1,1 tot +6,8 m, noord
  tot +5,6 m en zuid tot +6,4 m) die onder het dak open blijft, de achterwand
  (1,9 tot 2,0 m dik, aan de noordkant 7,5 m dik als massieve glazen boxen), een
  glazen band van 0,6 m diep in de achterwand en een dakplaat die over de
  zitrang uitkraagt. De dakplaat is 1,7 tot 3,2 m dik: een voorlip (oost
  +8,4 m, west +7,9 m, zuid +7,8 m, noord +10,3 m en 3 m diep), een schuine
  neus naar de ruglijn (oost en west +11,8 m op 3,9 m achter de voorrand, zuid
  +11,7 m op 4,3 m, noord +15,1 m op 6 m) en een zacht aflopend dak naar de
  achterrand (+10,9, +10,35 en +14,3 m); het dak van de noordtribune is dus
  trapsgewijs met de lip op +10,3 m en de rug op +15,1 m. De achterwand loopt
  aan de buitenzijde 1,3 m schuin uit naar de grond (AHN), met steunberen
  (1,0 × 1,0 m) tegen de voorkant en consoles (1,3 m breed, tot 1,25 m buiten
  de wand, tot +10,5 m) op de scheidingen van de dakvakken (9 m).
- De hoeken: de voorrand is schuin afgesneden (45 graden, benen van 4,5 m in
  het noorden en 5,7 m in het zuiden), de achterwand heeft hoekstraal 20,5 m en
  elke hoek heeft vijf waaiervormige dakvakken (luchtfoto) zonder voorlip: de
  ruglijn ligt direct achter de voorrand en loopt lineair van de ene zijde naar
  de volgende.
- De nis van 28 m breed (u −13,8 tot 14,2 m) in de zuidtribune met de hal
  erachter (+9,5 m, v −48 tot −58,2 m, met een schuine voorkant) en een lagere
  buitenstrook (+8,65 m, u ±41 m).
- Het Kasteel (u ±14,2 m, v −63 tot −58 m): een bakstenen poortgebouw met de
  dakrand op +8,7 m en een steil zadeldak met de nok op +11,1 m, twee erkers
  (7,4 × 5,5 m) onder tentdaken tot +14,0 m met een schoorsteen tot +14,9 m,
  twee achthoekige torentjes (straal 1,9 m) met een kegeldak tot +11,9 m, een
  spits (+13,0 m) en een poorttoren (u −2,9 tot 3,3 m, tot v = −65 m, +7,0 m)
  met een poort van 2,6 m breed en 4,2 m hoog en drie kantelen van 1,0 m
  (+8,0 m). Het poortgebouw heeft op de dakrand zelf geen kantelen.
- Het clubgebouw aan de noordkant (v = 58,0 tot 68,95 m): de vleugels (u ±18 tot
  ±40,7 m) op +19,4 m, het midden (u ±18 m) op +22,7 m met een schuin dak van
  v = 59,4 tot 61,4 m; het houten volume steekt 2,75 m uit boven de glazen
  onderbouw (overstek op +8,0 m, glazen vlak op v = 66,2 m) en rust op vier
  kolommen van 1,0 m; een glazen toren (u ±7 m, tot v = 71,4 m, +22,7 m), de
  entreehal (u ±15 m, tot v = 70,2 m, +8,0 m), 28 raamnissen (2,0 × 2,4 m,
  0,5 m diep, in twee rijen vanaf +10,8 en +14,4 m), dakranden van 0,9 m,
  twee trappenhuizen tegen de uiteinden (+13,5 en +13,0 m, AHN) en de
  dakopbouwen (lichtkap +1,4 m, koelinstallatie +1,6 m).
- Vier vakwerk-lichtmasten buiten de hoeken: vier poten van 0,9 m (3,6 m
  breed onderaan, 2,8 m bovenaan), ringbalken en kruisdiagonalen van 0,9 m en
  een lampenbank van 6,2 × 2,6 m die naar het veld wijst, tot +24,2, +23,9,
  +23,9 en +22,1 m (AHN), los van de ring.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, 29.724 cellen met DSM
boven 3 m en model boven 1 m): 79,5 % ligt binnen 1 m en 90,3 % binnen 2 m
(was 58 % en 77 %). De rest zit in de voorlip (lampen en reclameborden langs
de dakrand geven ruis van ±1 m), de goot van 1,5 m breed op +10 m langs de
buitenrand van de noordhoeken, de gevel van de glazen toren, de bomen langs
de noordgevel en de dakvlakken van de vleugels waar het DSM leeg is. Dwarsdoorsneden
door oost, noord en zuid en door het Kasteel vallen op de ruglijn en op de
schuine voet binnen 0,3 m samen met het DSM.

Printbaar op 1:1000: onder +4 m wijst geen vlak onder 45 graden naar beneden;
daarboven hangen de dakplaten, de overstek van het clubgebouw, de kappen van
het Kasteel en de lampenbanken bedoeld uit (circa 3,6 duizend m², `OVERHANG_OK`
accepteert ze boven die hoogte). De export vult op 1:1000 17,6 % volume op
(77,4 naar 91,0 cm³), op 1:1500 18,0 % en op 1:2500 19,4 %, zonder fout. De STL
is 77,4 cm³ (19.120 driehoeken, status NoError): één ring met clubgebouw en
Kasteel en vier losse masten die elk op de grond staan.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Spartastadion_Het_Kasteel)
(11.000 plaatsen), PDOK BAG (de vier panden), PDOK AHN (dsm en dtm 0,5 m via WCS,
ook op 0,25 m opgevraagd: een interpolatie van het 0,5 m-raster), de PDOK
luchtfoto (dakvakken, hoekvakken, dakopbouwen) en Wikimedia Commons-foto's
(Sparta Stadion Het Kasteel 01 tot 05, Sparta stadion Spangen 2020: zitrang onder
het dak, glazen band, poortgebouw, houten gevel, consoles). Geschat zijn de
plaats en hoogte van de treden van de zitrang, de onderkant van de dakplaten
(dikte 1,7 tot 3,2 m), de steunberen, de doorsnede van de masten en de bouw
van de entreehal en van de onderbouw van het clubgebouw. Weggelaten: de
dakgoten tussen de vakken, de zonnepanelen, de reclameborden, het veldhek, de
stoelen, de leuningen en trappen op de zitrang en het tegelwerk en de leeuwen
op het poortgebouw.
