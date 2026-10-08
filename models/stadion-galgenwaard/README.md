# Stadion Galgenwaard (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadion-galgenwaard.glb` | Catalogusbron in meters: node `building:stadion` (vier dakplaten met de tribunes eronder, de vakwerkbogen, vier hoekgebouwen met overhangende daktippen en het gewelfde dak van het hoofdgebouw) |
| `stadion-galgenwaard-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (209 × 210 × 36 mm) |
| `stadion-galgenwaard.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (138454,90, 454482,70), in het hart
van de veldopening op het maaiveld (NAP +2,0 m), en de glTF-conventie Y omhoog.
+X loopt langs de lengteas van het veld naar het oostzuidoosten (−22,18 graden
vanaf de RD-X-as) en +Y dwars daarop naar het noordnoordoosten; het
hoofdgebouw ligt aan de −Y-kant. Het maaiveld wordt op vier punten rond het
stadion bemonsterd (`groundSamplePoints`, NAP +1,9 tot +2,0 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0344100000056854` (het stadion met het
hoofdgebouw en de hoekgebouwen: het BAG kent hier één pand van 312 punten).

Onderdelen (hoogtes boven het maaiveld; de daken uit het AHN-DSM, de rang eronder
geschat uit foto's; in vlakken, profielen en blokken, geen hoogteveld):

- De vier daken zijn nu een gewelfde plaat in plaats van een kolom tot het
  maaiveld. De bovenkant is het dwarsprofiel uit het AHN (+27,0 tot +29,1 m in
  het noorddak, +28,5 tot +31,2 m in het zuiddak, +27,6 tot +30,9 m in de
  koppen, oplopend naar buiten), dwars op de tribune gewelfd (het dak daalt met
  0,0007 tot 0,0022 · t² m naar de uiteinden) en geknipt op de plattegrond met
  de afgeronde buitenranden. De onderkant ligt aan de veldkant 1,6 m onder de
  bovenkant en vanaf 10 m naar achteren 3,2 m (de spantdiepte, geschat uit de
  foto's), dus er zit open ruimte tussen de rang en de plaat: 23 m aan de
  veldkant en 2 tot 6 m boven de achterste rij. De zuidrand van het zuiddak is aangepast: het AHN zakt daar van
  +31,2 m naar +24,4 m (het dak van het hoofdgebouw), niet naar +29,0 m.
- Het noorddak heeft een rand van +31,1 en +31,3 m aan de buitenkant en een
  verzonken dakveld van 105 bij 14,5 m dat 3,5 m lager ligt: een bak van 2 m
  dik op +25,5 m met randen van 1,5 m die onder het dak hangen.
- De tribunes onder de daken (alleen de rang is geschat; hoogtes van het
  veld af): een onderrang van 14 m diep van +1,0 tot +9,0 m in 8 treden
  (stuit 1,0 m, trede 1,75 m) die 3 m vóór de dakrand begint (v = ±40 m in het
  noorden en zuiden, u = ±59 m in de koppen), een gang van 3 m op +9,0 m en
  een bovenrang van 20 m diep in 11 of 13 treden tot +20,5 m (zuid) of +22,0 m
  (west en oost). De noordtribune (de hoofdtribune) heeft in plaats daarvan
  een glazen blok met drie terugspringende niveaus (+13, +17 en +20 m, treden
  van 3 m). Daarachter staat de achterwand (de gevel): een ring van 3 m dik
  langs de buitenrand van het dak, tot de bovenkant van het dak, die de plaat
  draagt. De tribunes eindigen in eindwanden: noord en zuid op u = ±57 m
  (114 m lang), west en oost op v = ±45,5 m.
- De witte vakwerkbogen langs de veldkant van het zuid-, west- en oostdak (het
  noorddak heeft er geen): een boogvormige bovenstreng van 1,5 m met
  diagonalen van 1,0 m (vakken van 12 m) die op het dak staan. Positie en kruin
  uit het AHN: zuid op v = −51,1 m (8 m van de dakrand, kruin +35,6 m, 7 m
  boven het dak, ±68,7 m lang), west op u = −69,6 m en oost op u = +69,3 m
  (kruin +34,8 m, ±50,8 m lang).
- Vier lagere hoekgebouwen met een plat dak: noordwest +14,6 m, de andere drie
  +11,2 m, elk met een installatieruimte van 3,2 m hoog (AHN). Het AHN toont
  alleen het deel tot de dakranden; de plattegrond loopt nu door onder de
  daktippen tot de eindwanden van de twee tribunes ernaast (u = ±56,5 m en
  v = ±45 m) en houdt die samen.
- De daktippen hangen als overhang boven de hoekgebouwen: de platen van het
  noord- en zuiddak steken tot 12 m voorbij de eindwanden (u = ±57 m), die van
  de koppen tot 5,5 m (v = ±45,5 m), samen circa 1.200 m² (noordoost 287,
  noordwest 297, zuidoost 313, zuidwest 308 m²) met 10 tot 12 m open ruimte
  tussen de onderkant van de plaat (+21 tot +23 m) en het dak eronder. De
  platen dragen op de tribunegevel, niet op de hoekgebouwen; de tippen worden
  gesteund door vier schuine hoekzuilen van 1,8 m (u = ±62,8 m, v = ±44,2 m
  naar de plek waar twee daken elkaar raken, +22,5 m; op de foto's twee witte
  buizen) en een blokje van 3,8 m op elk raakpunt (+20,5 tot +25,5 m) dat de
  spleet dicht en de boogeinden draagt. Het BAG kent het stadion met de
  hoeken en het hoofdgebouw als één pand, dus de contouren scheiden daar
  niets; de overhang volgt uit het AHN (de daktippen eindigen op de
  hoekranden met een stap van 13 tot 14 m naar de hoekgebouwen) en de foto's.
- Twee trappentorens tegen de noordgevel (u = −41,2 tot −36,2 m en +36,2 tot
  +40,8 m, v tot +88,6 m): een helling van +21 m bij de gevel naar +14 m
  aan de buitenkant (AHN).
- Het hoofdgebouw aan de zuidkant op de BAG-contour (98 bij 35 m): een
  gewelfd dak (dwarsboog van 3,6 m) dat van +24,2 m bij de tribune naar +20,6 m
  aan het eind daalt.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
86,7 % ligt binnen 1 m en 94,2 % binnen 2 m (het model met massieve kolommen:
86,3 % en 93,0 %); op de daken boven 20 m 87,2 % en 95,2 %. De bogen liggen binnen 2 m van
het AHN (gemiddeld 1 m erboven: de bovenstreng is smaller dan een AHN-cel). De rang, de onderkant van de platen en de ruimte
onder de daktippen zijn voor het AHN onzichtbaar en dus niet te vergelijken. De
afwijkingen zitten in de kabels langs de binnenrand van de daken, de
lichtmasten op de binnenhoeken (+36 tot +40 m, weggelaten), het verzonken
dakveld (rooster) en de randen van de afgeronde daken.

Printbaar op 1:1000: de dakplaten (≥ 1,6 m), de bogen (1,5 en 1,0 m), de
achterwand (3 m), de treden (stuit 1,0 m) en de hoekzuilen (≥ 1,6 m) zijn dikker
dan 0,9 m; 0,07 % van het volume is dunner dan 0,9 m (randen van het
verzonken dakveld). Alle ondervlakken boven +8,5 m (platen, bogen, daktippen)
mogen onder 45° hangen (`OVERHANG_OK`); eronder wijzen alle vlakken omhoog of
staan verticaal. Het script slaagt zonder `--allow-overhang`. De export vult de
open ruimte onder de platen op met een kraag van 45°: 32,7 % volume erbij op
1:1000 (376 naar 499 cm³), 32,9 % op 1:1500 en 33,6 % op 1:2500, zonder
fout. De STL is 376 cm³ (5.474 driehoeken) en het model één samenhangend deel
met de veldopening als gat.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Stadion_Galgenwaard)
(23.750 plaatsen, hoofdtribune naar de noordkant verplaatst),
[ZJA](https://www.zja.nl/en/Stadion-Galgenwaard-Utrecht) (architect;
vakwerkligger van 100 m, open hoeken), PDOK BAG (het stadionpand), PDOK AHN
(dsm en dtm 0,5 m via WCS) en de PDOK luchtfoto, plus foto's op Wikimedia
Commons (Galgenwaard hoek, vanuit de lucht, van boven, Grandstand, Cityside,
2009, 2025) om de verhoudingen van rang, gang, glazen blok en daktippen af te
lezen. Afgeleid uit het AHN: de daken, de bogen, de hoekgebouwen met hun
installatieruimten, de trappentorens en het hoofdgebouw. Geschat: de rang
(hoogtes, hellingen, gang, treden, achterwand), de plaatdikte van 1,6 tot 3,2 m,
de eindwanden en daarmee de overhang van de daktippen, de lengte van de
vakwerkdiagonalen en de kromming van de daken (een parabool op drie plaatsen
per dak afgelezen). Weggelaten: de kabels langs de binnenrand van de daken, de
lichtmasten op de binnenhoeken, de kleine trappen aan de oost- en westkant, de
zonnepanelen, het gevelreliëf en de kantoortorens ten noordwesten van het
stadion (aparte BAG-panden).
