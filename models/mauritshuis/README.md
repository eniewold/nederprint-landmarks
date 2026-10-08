# Mauritshuis (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `mauritshuis.glb` | Catalogusbron in meters: node `building:mauritshuis` (gevel met pilasters en baaien, kroonlijst, ingezwenkt schilddak met frontons, dakkapellen, schoorstenen en technische put, trap) |
| `mauritshuis-1-1000.stl` | Het gebouw op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (28 × 28 × 24 mm) |
| `mauritshuis.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (81461,19, 455227,58), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP +1,5 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevels naar het noordoosten (28,25
graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht daarop naar het
noordwesten, naar de Hofvijver. Het maaiveld wordt op drie punten langs de
straat aan de oostzijde bemonsterd (`groundSamplePoints`, NAP +1,5 m); aan de
vijverzijde is het DTM leeg (water). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0518100000300401`.

Onderdelen (hoogtes boven het maaiveld, NAP +1,5 m afgetrokken; alles uit
vlakken en blokken, geen hoogteveld):

- Gevel op de BAG-contour (26,3 bij 24,4 m): een sokkel tot +2,6 m, daarboven
  pilasters van 1,2 m breed die in het vlak van de BAG-gevel liggen en baaien
  ertussen die 0,6 m dieper liggen (de vensternissen), tot het hoofdgestel op
  +12,3 m. Op de lange gevels (noord en zuid) staan hoekpilasters, twee
  tussenpilasters op 8,2 m van de as en een middenrisaliet van 9,2 m breed in
  het vlak van de pilasters, met twee baaien van 3,0 en 3,15 m aan weerszijden;
  op de korte gevels (oost en west) zeven pilasters op 3,86 m en zes baaien van
  2,7 m. De baaien krijgen een plafond onder 50 graden, zodat er geen overhang
  ontstaat. Daarin zitten twee rijen vensternissen van 1,4 tot 1,6 m breed en
  0,4 m diep (+3,8 tot +6,1 m en +8,6 tot +10,6 m) met een spitse bovenkant van
  55 graden, drie per rij in het risaliet; de deur in het zuidrisaliet is een
  nis van 2,0 m breed en 0,5 m diep.
- De omlopende kroonlijst: vanaf +12,9 m onder 51 graden tot 0,65 m uit de
  gevel op +13,7 m, daarna verticaal tot de bovenkant op +14,6 m (NAP +16,1 m);
  aan de vijverzijde ligt de goot 0,6 m hoger (+15,2 m).
- De trap voor de ingang aan de straatzijde (zuidoost): zes treden van 0,43 m
  hoog en 0,45 m diep, 6,8 m breed, met aan weerszijden een wang van 1,5 m
  breed die oploopt tot +3,1 m; de trap steekt 2,7 m uit (de wangen 3,0 m).
- Het ingezwenkte schilddak als vlakken: een plat bovenvlak van 16,8 bij
  14,2 m op +20,6 m (NAP +22,1 m), per zijde een steil vlak naar de knik op
  +15,9 m (west en oost 3,3 m breed, 55 graden; noord 3,2 m, 56 graden; zuid
  2,7 m, 60 graden) en daaronder een flauwer dakvoetvlak naar de kroonlijst
  (west en oost 41 tot 43 graden, zuid 34 graden). Aan de noordzijde loopt het
  dakvoetvlak als een goot van 2,3 m breed vanaf +15,9 m af naar +15,2 m. De
  vier hoekkepers zijn de ribben waar de steile vlakken samenkomen.
- Een fronton boven het risaliet aan de zuid- en de noordzijde: een laag
  zadeldak met de nok loodrecht op de gevel op de as van het gebouw (nok op
  +17,1 m aan de straatzijde en +18,2 m aan de vijverzijde, basis 10,8 en 12 m
  breed, helling 25 en 27 graden) dat uit het steile dakvlak steekt tot de
  nok het dakvlak raakt (3,3 en 4,5 m van de voorkant).
- Vier dakkapellen van 2,5 m breed met een plat dak op +17,8 m (NAP +19,3 m),
  twee op de oost- en twee op de westhelling, met de voorkant op 0,75 m van de
  gevel en het midden op v = 5,15 en -6,35 m.
- Vier schoorstenen van 1,8 m vierkant op de hoeken van het platte deel
  (u = -14,9 en 1,9 m, v = 3,05 en -4,45 m) tot +23,6 m (NAP +25,1 m), met een
  kap van 2,2 m die boven verbreedt; zij zijn het hoogste punt.
- De technische put van 4,6 bij 7,5 m in het platte deel: de vloer ligt op
  +19,4 m (1,2 m diep), met twee units van 2,8 bij 1,8 m tot +20,4 m en een
  lager middenstuk (lichtstraat en kanalen) op +19,9 m.

Waar de maten vandaan komen: het AHN-DSM (0,5 m, op 0,25 m geresampled) geeft
het platte vlak, de hellingen van de steile vlakken, de frontonnok, de
dakkapellen, de schoorstenen en de put; de LoD2.2-vlakken van de 3D BAG
(`api.3dbag.nl`, pand 0518100000300401) bevestigen de top (NAP +22,2 m), de
hellingen en de hoogte aan de dakvoet (NAP +15,6 tot +15,9 m); de luchtfoto
laat de plattegrond van de dakdelen zien (de frontons als driehoek, de vier
dakkapellen op de oost- en westhelling, de put met zijn units en de vier
schoorstenen). De PDOK-luchtfoto is niet waar-orthogonaal: hoge delen schuiven
circa 0,06 m per meter hoogte naar het zuiden en 0,02 m naar het oosten
(gemeten aan de vier schoorstenen en de rand van het platte vlak, die in AHN en
foto beide zichtbaar zijn); daarmee is de foto teruggerekend naar het AHN. De kroonlijst staat dan 0,6 tot 0,7 m buiten de
BAG-contour. Het ritme van pilasters en baaien (zeven assen op de lange gevel:
2 + 3 + 2, pilasters op 4,0, 8,2 en 12,6 m van de as) is van foto's op
Wikimedia Commons (onder meer de RCE-opname van de voorgevel) afgemeten en de
verhoudingen (sokkel, hoofdgestel 2,3 m, vensters) zijn daaraan geschat.

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m):
binnen de BAG-contour ligt 83,7 % binnen 1 m en 88,1 % binnen 2 m (het vorige
model, het blok met schilddak: 72,4 % en 87,0 %); op de dakvlakken zelf (rand
van 1,5 m langs de contour buiten beschouwing, n = 7484) is dat 94,6 % binnen
1 m en 97,9 % binnen 2 m, 88,0 % zelfs binnen 0,5 m. De afwijking zit in de
rand: het AHN ziet het steile leien dak bij de dakvoet niet (op de oost-,
west- en noordzijde zakt het DSM daar naar NAP +10 tot +13,5 m, onder de
kroonlijst van +16,1 m die op de foto's duidelijk is), in de schoorstenen (het
DSM is daar 0,5 m resolutie en smeert) en in de put (het AHN geeft de bovenkant
van de installaties, niet de vloer).

Printbaar op 1:1000: de gevelreliëfs liggen binnen de 0,6 m diepte, de
kroonlijst en de baaien hangen niet vlakker dan 50 graden, de rest rust op de
muren; de export vult op 1:1000 0,04 % bij, op 1:1500 0,06 % en op 1:2500
0,8 % (het script slaagt zonder `--allow-overhang`). De STL is 12 cm³ en het
model één samenhangend deel (genus 0).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Mauritshuis), PDOK BAG (het
pand), PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2, de PDOK luchtfoto en
foto's op Wikimedia Commons. Geschat zijn de breedte en diepte van de
pilasters, de sokkel (+2,6 m), de hoogte van het hoofdgestel, de
vensternissen, de trap (de AHN-cellen voor het gebouw zijn leeg) en de hoogte
van de put. Weggelaten: de gevelornamenten (guirlandes, kapitelen, de reliëfs
in de frontons), de vensters zelf, de sierknoppen op de hoeken van het platte
deel, de glazen lichtkoker en de lage muur op het voorplein (plat glas op
maaiveldhoogte) en het ondergrondse bezoekerscentrum.
