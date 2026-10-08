# Waterpoort (Sneek)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `waterpoort-sneek.glb` | Catalogusbron in meters: node `building:poort` (torens, middendeel en daken als gesloten solid) |
| `waterpoort-sneek-1-1000.stl` | De poort in één stuk op 1:1000, met de onderkant (NAP -2,0 m, onder het water) op het printbed (16 × 10 × 26 mm) |
| `waterpoort-sneek.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (173239,79, 560300,33), midden
tussen de twee torens, op het maaiveld van de kades (NAP +1,0 m), en de
glTF-conventie Y omhoog. +X loopt langs de torens naar het zuidzuidoosten
(RD-richting -60,05 graden, van de noordelijke naar de zuidelijke toren); +Y
wijst naar het oostnoordoosten, de stadszijde met de brug over de gracht, en
-Y naar De Kolk. Het maaiveld wordt alleen op de kade aan De Kolk en op de
straat ten zuiden van de poort bemonsterd (`groundSamplePoints`, AHN NAP +1
tot +2 m), niet in het water. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0091100000004105`.

Onderdelen (hoogtes in NAP; het water staat op circa NAP -0,5 m):

- Twee achtkante torens (omgeschreven straal 2,27 m, uit de BAG-contour, de
  middelpunten 10,7 m uit elkaar) met blinde vensters van 0,8 m breed en
  0,35 m diep in de vier buitenste vlakken op twee verdiepingen, een kraag
  die op +11,6 m onder 45 graden 0,33 m uitloopt, een rechte rand tot +12,0 m
  en een achtkante spits tot +24,0 m.
- Het middendeel tussen de torens (BAG-contour, de achtergevel scheef) met de
  waterboog van 4,2 m breed tot de onderkant open (spitse top op +2,9 m), de
  doorloop van het looppad over de waterboog (herzien op een straatfoto): twee
  bogen van 1,8 m breed met een middenpijler van 0,9 m, vloer +3,8 m, top
  +7,4 m, evenwijdig aan de scheve achtergevel dwars door het middendeel
  achter de torens, dus aan beide zijgevels te zien en te doorlopen. De
  stadszijde (de scheve achtermuur) is ook open: twee bogen van 1,8 m breed
  (vloer +3,8 m, top +7,4 m) loodrecht door de muur, op 1,25 m weerszijden van
  het midden, in lijn met de doorloop. Het galerijniveau is zo aan vier kanten
  open: de waterzijde, de stadszijde en de twee uiteinden van de doorloop (het
  script controleert dat met een doorsnede op +5,5 m). Aan de
  waterzijde de galerij met twee kleinere bogen van 1,5 m boven de
  waterboog (borstwering +4,6 m, top +7,0 m, pijler 1,0 m) die in de doorloop
  uitkomen, en de poortwachterswoning met een steil zadeldak met de nok
  dwars op de torens (goot +8,8 m, nok +13,6 m).
- Trapgevels van 1,0 m dik aan de waterzijde en de stadszijde, met vier
  treden van 1 m tot +15,2 m.

Vergelijking met het AHN-DSM: het middendeel ligt binnen 1 tot 3 m (de
gevels en de rand van het dak); het DSM mist de steile spitsen grotendeels
(op 0,5 m alleen een piek van NAP +21,9 m in het midden van elke toren, op
1 m ernaast nog +12 m), zodat de spitsen naar de foto's zijn gemaakt en
binnen de torens 2 tot 6 m boven het DSM liggen.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de spitsen en het
dak lopen schuin omhoog, de waterboog, de doorloop en de galerijbogen hebben
een spitse top (de ronde boog gaat op 40 graden over in rechte stukken onder
50 graden), de kraag loopt onder 45 graden uit en de trapgevels springen
telkens 1 m in; alleen de vensternissen hebben een vlakke bovenkant van
0,35 m diep. Het script controleert dat er buiten die nissen geen vlak
vlakker dan 45 graden naar beneden wijst. Let op: de overhangopvulling van de
export vult een lange doorgang vanaf beide uiteinden onder
45 graden op, ook als het plafond zelf printbaar is. Daardoor is de waterboog
van 4,2 m in het midden van de poort tot ongeveer 2 mm boven het bed gevuld
en blijven de bogen van de doorloop vooral aan de uiteinden open (gemeten op de
STL; dit gold ook voor de eerste versie). Dat is een beperking van de
opvulling, niet van het model. In de kaart staat de poort aan de rand van De Kolk met de bogen naar
het water, en de preview van een uitsnede van 250 m rond de poort toont het
model zonder het vervangen pand.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Waterpoort_(Sneek))
(twee achtkante torens met daartussen een brug en de poortwachterswoning,
circa 1492, verbouwd in 1613 en gerestaureerd door Gosschalk in 1877), PDOK
BAG (het pand met beide torens), PDOK AHN (dsm en dtm 0,5 m via WCS: nok,
torenranden, kades en water), de PDOK luchtfoto en foto's op Wikimedia
Commons (waterzijde en stadszijde). Geschat zijn de hoogte van de spitsen en
de kraag, de breedte en hoogte van de waterboog en de galerijbogen (uit
frontale foto's), het aantal treden van de gevels en de waterstand.
Vereenvoudigd: de galerijbogen zijn spits in plaats van rond, de gevels
hebben geen klok, voluten of pinakels, de spitsen geen dakkapelletjes en de
brug over de gracht aan de stadszijde is weggelaten.
