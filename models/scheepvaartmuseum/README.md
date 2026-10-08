# Het Scheepvaartmuseum (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `scheepvaartmuseum.glb` | Catalogusbron in meters: node `building:zeemagazijn` ('s Lands Zeemagazijn uit dakvlakken, risalieten, dakkapellen, bolle koepel en gevelreliëf) |
| `scheepvaartmuseum-1-1000.stl` | Het gebouw op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (70 × 64 × 23,5 mm) |
| `scheepvaartmuseum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (122829,07, 487196,97), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP +2,3 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels naar het noordoosten (27,75
graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht daarop naar het
noordwesten, het IJ in. De voorgevel met de ingang en de weg ligt aan de -Y-kant
(zuidoosten). Het gebouw staat aan drie zijden in het water; het
maaiveld wordt daarom op drie punten aan de landzijde bemonsterd
(`groundSamplePoints`, NAP +2,2 tot +2,5 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012170236`.

Het model is opgebouwd uit vlakken en blokken (hulls van rechthoeken op nok-,
goot- en voethoogte, prisma's), niet uit een hoogteveld of gestapelde lagen. De
maten komen uit vlakfits op het AHN-DSM (0,25 m geresampled; rms 0,01 m per
dakvlak). Onderdelen (hoogtes boven het maaiveld, u en v in het lokale stelsel):

- **Buitenste dakvlak**: vier steile vlakken met een helling van 1,33 (53 graden)
  van de kroonlijst op +15,5 m naar de nokken op +20,2 m, met graten op de
  hoeken (schilddak). De nokken liggen op u = -28,47 (west) en 28,07 (oost) en op
  v = -24,7 (zuid) en 24,85 (noord). De kroonlijst is een rand van 0,4 tot 0,8 m
  langs de gevel.
- **Goot tussen twee nokken** (noord-, west- en oostvleugel, 16 m diep): achter
  de nok loopt een geul van circa 5 m breed op +18,8 m (achterhelling 1,1,
  voorhelling 1,2) naar een tweede nok op +20,2 m (west -20,6 en oost 20,4; noord
  v = 17,2). De zuidvleugel is 9 m diep en heeft één nok.
- **Dakvlakken naar de binnenhof**: van de binnenste nok (helling 1,39, 54 graden)
  naar de goot rond het glas op +16,0 m (voet west -17,6, oost 17,4, zuid -21,4,
  noord 14,1).
- **Bolle glazen koepel** op de binnenhof (31,8 bij 31,8 m, midden u = -0,1,
  v = -3,7): het vlak z = 20,3 - 2,78 r² - 0,09 r⁴ (r de afstand tot het midden in
  een p-norm met p = 4,27, gedeeld door 15,5 m), gefit op de AHN-cellen die het
  glas wel zien (rms 0,07 m). Top +20,3 m in het midden, rand +17,3 m halverwege
  een zijde en +16,1 m in de hoeken (steek 3,0 tot 4,2 m). De koepel is als hull
  van een raster van 17 bij 17 punten gebouwd en staat op een massieve onderbouw
  (de hof is opgevuld tot de goot op +16,0 m; de export vult de overspanning
  anders toch op).
- **Vier risalieten** (noord 15,3 en zuid 15,5 m breed, 3,1 tot 3,2 m uitspringend;
  west en oost 12,6 m breed, 2,6 tot 2,8 m uitspringend) met een zadeldak met helling 0,455
  (24,5 graden): nok op +19,36 m (noord), +19,17 m (zuid), +18,66 m (west) en
  +18,71 m (oost), steeds op het hart van de risaliet, en een driehoekig
  fronton op de contour (Rijksmonument 2205: elke gevel heeft een door een
  fronton gedekte middenrisaliet). Op het oostfronton staat een sokkel van 2 bij 2 m
  met een piramidedakje tot +22,3 m.
- **Dakkapellen** (36): 24 aan de buitenzijde, zes per gevel, 2,2 m breed, voorvlak
  0,3 m achter de gevel, goot op +17,3 m en nok op +18,45 m (7,4 m hart op hart,
  naast de risalieten overgeslagen); 12 aan de binnenzijde (drie per zijde,
  1,9 m breed, goot +17,2 en nok +18,3 m). De plaatsen zijn de maxima van het
  verschil tussen het AHN-DSM en het vlakkenmodel.
- **Vier witte schoorstenen** van 1,8 bij 1,8 m op de nok, tot +23,0 m
  (noordelijk u = -17,1 en 17,2; zuidelijk u = -17,1 en 17,1).
- **Installatiekappen** op de goot: acht witte units (2,5 tot 3,8 m breed, 8 tot
  13 m lang, top +20,4 m: noord 2, west 3, oost 3) en twee leidingbundels van
  1,4 m breed (+19,9 m) tussen de units.
- **Gevel**: sokkel (rustica) tot +3,2 m op de BAG-contour; daarboven staat de gevel
  0,5 m terug, met een schuine onderkant (48 graden) onder de kroonlijst op
  +14,45 m; 246 vensternissen in 82 assen van 2,45 m (drie rijen, 1,2 bij 2,2 m,
  0,9 m diep, met een schuin hoofd van 48 graden). De assen houden 1,8 m gevel tot
  elke hoek vrij.

Alle dakdelen staan als massieve kolommen op de onderkant; alle ondervlakken zijn
verticaal of steiler dan 45 graden (het script controleert dat zonder
`--allow-overhang`).

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m):
93,5 % ligt binnen 1 m en 97,2 % binnen 2 m; voor alleen de dakcellen boven 12 m
89,2 % binnen 0,5 m, 94,9 % binnen 1 m en 98,6 % binnen 2 m (de vorige versie
met 1 m-gebieden: 79,5 % binnen 1 m). In de koepel, waar het AHN het glas ten
dele ziet (7300 cellen), ligt 99,4 % binnen 0,3 m en alles binnen 0,5 m.
Afwijkingen zijn er alleen langs de gevelrand (het AHN-gebouw eindigt halve
meters binnen de contour) en bij de leidingen tussen de units en de spleet rond
het glas.

Printbaar op 1:1000: één samenhangend deel (genus 0, status NoError, 6012
driehoeken, 72,1 cm³ op 1:1000). De export vult op 1:1000 en 1:1500 vrijwel niets
op (0,03 % en 0,04 % volume) en op 1:2500 0,7 %. Alle details zijn minstens 0,9 m
(vensternissen 1,2 bij 0,9 m, dakkapellen 1,9 tot 2,2 m, schoorstenen 1,8 m,
pijlers tussen de vensters 1,25 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Het_Scheepvaartmuseum),
[Rijksmonument 2205](https://monumentenregister.cultureelerfgoed.nl/monumenten/2205)
(vier door een omlopend schilddak gedekte vleugels, per gevel een middenrisaliet
met fronton), [Dok Architecten](https://dokarchitecten.nl/project/pdf/56f2ae76332fa6082c23c219.en.pdf/Maritime-Museum-Amsterdam)
en Ney & Partners (glazen koepel van 30 bij 30 m, 2011), PDOK BAG (het pand), PDOK
AHN (dsm en dtm 0,5 m via WCS, op 0,25 m geresampled) en de PDOK luchtfoto (de
nieuwste opname, waarin het dak 1 tot 3 m verschoven staat; de plaatsen komen
daarom uit het AHN en de foto geeft de vormen). Geschat zijn de sokkelhoogte, de
terugligging van de gevel, de vensterassen (2,45 m uit de foto) en vensternissen
(groter en dieper dan werkelijk, zodat ze op 1:1000 zichtbaar zijn), de
vorm van de dakkapellen, de bekroning van het oostfronton en de kroonlijst
(+15,5 m). Weggelaten: de vlaggenmasten op de frontons, de glasstroken langs de
goot, de kleine glaskappen en techniek, de spleet rond het glas, het
netwerk van spanten in de koepel, de ankerplaats en de steigers rond het gebouw.
Een trapgevel is niet gemodelleerd: het DSM en het monumentenregister geven een
driehoekig fronton; de getrapte rand op de foto zijn de leien langs de
dakkeper tussen het fronton en het hoofddak. Ook de hoekpaviljoentjes zijn
niet gemodelleerd: de contour en het DSM hebben op de hoeken alleen de graten
van het schilddak.
