# De Adelaarshorst (Deventer)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `adelaarshorst.glb` | Catalogusbron in meters: node `building:stadion` (vier tribunes met de rangen onder de daken, het achtergebouw, de hoeken, vier vakwerk-lichtmasten en de muur aan de Vetkampstraat) |
| `adelaarshorst-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (156 × 149 × 43 mm, met losse delen) |
| `adelaarshorst-grondplaat-1-1000.stl` | Idem met een grondplaat van 1 mm, omdat de masten, de tribune aan de Vetkampstraat, de westhoek, de containerwand en de muur los van elkaar staan |
| `adelaarshorst.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (208622,10, 474998,60), in het hart
van de veldopening op het maaiveld (NAP +6,4 m), en de glTF-conventie Y omhoog.
+X loopt langs de lengteas van het veld naar het zuidoosten, naar de
Vetkampstraat (−44,68 graden vanaf de RD-X-as, uit de voorranden van de
tribunes en de BAG-contouren), en +Y dwars daarop naar het noordoosten, naar
de IJsseltribune. De hoofdtribune ligt aan de −Y-kant, de
Brinkgreverwegtribune aan de −X-kant. Het maaiveld wordt op vier punten
bemonsterd (`groundSamplePoints`): het plein achter de hoofdtribune, het plein
binnen de muur aan de Vetkampstraat en de paden achter de wal van de
Brinkgreverweg- en de IJsseltribune; `groundHeight` is de laagste
PDOK-terreinhoogte op die punten (49,34 m ellipsoïdisch, het pad achter de
IJsseltribune; het veld ligt op 49,63 m). Vervangt de PDOK-reconstructie van
drie BAG-panden: `NL.IMBAG.Pand.0150100000056207` (hoofdtribune met
achtergebouw), `…062379` (tribune aan de Vetkampstraat, 2015) en `…056456`
(gebouw in de westhoek, dat PDOK tot +12,3 m reconstrueert terwijl het AHN
+3 m ziet). De IJssel- en de Brinkgreverwegtribune zijn geen BAG-pand; PDOK
heeft ze niet, alleen hun aarden wal zit in het terrein.

Onderdelen (hoogtes boven het maaiveld; AHN-DSM/DTM op 0,5 m, luchtfoto en
foto's; doorsneden per tribune die langs de tribune zijn uitgetrokken,
blokken, prisma's en convexe rompen van vlakken, geen hoogteveld):

- De veldopening van x = −58,2 tot 57,95 m en y = −38,8 tot 38,65 m (AHN,
  voorranden van de vier daken; de tribunes staan kort op het veld).
- De hoofdtribune (zuidwest, x −48,5 tot 49,25 m): een vakwerkdak als dakplaat
  met de bovenkant op +11,25 m aan de veldkant, de nok op +12,45 m 8,7 m
  achter de rand en +10,95 m aan de achterrand (y = −61,75 m), 1,5 tot 3,3 m
  dik, met blinde driehoeken in de kopse kanten (de open vakwerkspanten op de
  foto's). Midden op de dakrand het driehoekige frontje (6,6 m breed, tot
  +13,3 m) met een nok die 7,7 m naar achteren in het dak verdwijnt. Onder het
  dak een zitrang van tien treden van +0,9 tot +6,9 m (18,2 m diep) tussen
  getrapte bakstenen eindwanden (1,1 m boven de treden, op de BAG-contour
  x = −43,7 en 44,4 m) met een kopblok tot de dakplaat en drie raamnissen per
  kant; de dakeinden kragen 4,8 m uit boven een kolom van 0,9 m. Achter het
  midden (x −20 tot 17,5 m) ontbreekt de dakhuid: zes open spanten op 7,5 m
  (platen van 0,9 m met een driehoekige opening, zijden van 52 graden) en een
  randligger boven het achtergebouw.
- Het achtergebouw van de hoofdtribune: plat dak op +8,45 m tot y = −72,25 m
  met schuine zijkanten (AHN), en een entree met omlijsting (14 m breed, tot
  +9,4 m) met een deurnis en een raamband in het midden van de achtergevel.
- De tribune aan de Vetkampstraat (zuidoost, 2015, y −36 tot 37,5 m): een
  vakwerkdak met de bovenkant op +13,2 m aan de veldkant, +14,6 m op 1,6 m, de
  nok op +16,1 m op 6,65 m en +14,9 m aan de achterrand (x = 81,35 m), met
  blinde driehoeken in de kopse kanten; daaronder een steile zitrang van
  twaalf treden van +0,8 tot +9,8 m (17 m diep), getrapte eindwanden met drie
  stijlen van het glazen windscherm, en een achterblok vanaf de BAG-achtergevel
  (x = 73,65 m) tot het dak, met aan de straatkant een schuin onderstek van
  3,8 m diep (van +4,0 naar +6,0 m).
- De IJsseltribune (noordoost, x −61 tot 60,1 m) en de Brinkgreverwegtribune
  (noordwest, y −36 tot 40 m): lessenaarsdaken van 1,5 m dik van +8,3 m aan de
  veldkant naar +7,0 m achter (y = 54,3 en x = −73,8 m), met een verlaagde
  voorrand (het reclamebord) op dertien en negen kolommen van 0,9 m; daaronder
  een staanrang van tien treden die naar achteren steiler oploopt (+1,15 tot
  +5,2 m), een achterwand van 0,9 m en een getrapte eindwand aan het open
  uiteinde. De aarden wal achter de tribunes (tot +4,4 m, DTM) zit in het
  PDOK-terrein en staat niet in de GLB; de treden blijven overal minstens
  0,25 m boven dat terrein (gemeten in de PDOK-tegel).
- De noordhoek: dicht, met een schuine achterkant en een dakstuk waar de twee
  daken samenkomen (luchtfoto en AHN).
- De westhoek: het lage gebouw van BAG-pand 0150100000056456 (+3,0 m) met een
  tent tot +5,2 m (AHN).
- De oosthoek: een wand van 1,8 m breed, 32 m lang en +5,7 m hoog (AHN en
  luchtfoto; vermoedelijk gestapelde containers) van de hoek naar het
  trainingsveld.
- De muur aan de Vetkampstraat (x = 80 m, y −80 tot −36 m, 0,9 m dik, +2,6 m)
  met drie kiosken (2,4 m met een kap tot +3,6 m) en de poort van 5,4 m
  tussen twee pijlers (+3,4 m).
- Vier vakwerk-lichtmasten (de oude hoogspanningsmasten): vier poten van
  0,9 m die van 4,4 naar 2,0 m versmallen, ringbalken en kruisdiagonalen van
  0,9 m, een dichte voet en de lampkop van 2015 (5,2 × 2,0 m met een lampnis,
  naar het veld gericht), tot +41,6 m (west), +40,3 m (zuid), +42,1 m (oost,
  AHN) en +41,5 m (noord).

Geschat zijn de treden van alle rangen (het AHN ziet alleen de daken), de
onderkant van de dakplaten, de plaats van de kolommen en de schermstijlen, de
doorsnede van de masten en de lampkoppen, de noordmast (die in het AHN
ontbreekt maar op de luchtfoto en op de foto's staat; plaats uit de
luchtfoto, hoogte als de andere drie), het onderstek aan de Vetkampstraat, de
raamnissen en de plaats en vorm van de entree. Weggelaten: het glas van de
windschermen op de eindwanden (de rang blijft van opzij zichtbaar), de
stoeltjes, hekken, leuningen en reclameborden, de zonnepanelen, de tijdelijke
tent en de unit in de oosthoek, losse containers en schuurtjes, de antennes op
de zuidmast, het smeedijzeren hek van de poort en het beeld van Han Hollander
(kleiner dan 0,9 m of tijdelijk).

Pasvorm: de voorranden van de vier daken liggen binnen 0,3 m van de rand in
het AHN, de dakprofielen volgen de doorsneden (hoofdtribune 11,3 / 12,4 / 11,0
m, Vetkampstraat 13,8 / 16,1 / 14,9 m, noordtribunes 8,3 / 7,0 m) binnen 0,2
m, alleen de lip aan de veldkant van de Vetkampstraat tot 0,4 m; het model
staat op 49,34 m, 0,29 m onder het veld; de voet staat rondom in het
PDOK-terrein (dat 0,25 tot 0,6 m hoger ligt onder de tribunes) en zweeft
nergens.

Printbaar op 1:1000: onder +4 m wijst geen vlak onder 45 graden naar beneden
(de deurnis van de entree heeft een plafond van 54 graden, de kappen van de
kiosken lopen steil uit); daarboven hangen de dakplaten, het frontje, de
spanten, het onderstek en de lampkoppen bedoeld uit (`OVERHANG_OK`). De
printcontrole (`prepareMeshes` met de printbare overhangopvulling, 1:1000)
geeft status NoError en vult 24,2 % volume op (67,0 naar 83,2 cm³) onder de
dakplaten, het onderstek en de lampkoppen; de rangen blijven onder de daken
zichtbaar. De STL is 60,5 cm³ (14.122 driehoeken, status NoError) in elf
losse delen die elk op de grond staan.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/De_Adelaarshorst) (10.400
plaatsen, overdekte tribunes van 1933, 1963 en 1968, verbouwing in 2015 naar
ontwerp van I'M Architecten, lichtmasten in 2015 met een nieuwe kop), PDOK BAG
(de drie panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto
(plattegrond, noordhoek, dakspanten, noordmast, muur en kiosken) en Wikimedia
Commons-foto's (De Adelaarshorst, Deventer (2019) 01, 02 en 05, Stadion de
Adelaarshorst, Adelaarshorst-uitvak, De Adelaarshorst in Deventer (Detail):
vakwerkdaken met open kopse kanten, getrapte eindwanden, windschermen,
kolommen onder de noordtribunes, masten met lampkop, muur met kiosken en
poort, rode achtergevel met entree).

