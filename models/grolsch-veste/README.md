# De Grolsch Veste (Enschede)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `grolsch-veste.glb` | Catalogusbron in meters: node `building:stadion` (hoefijzerdak met spanten, de tribunes eronder, noordoosttribune, hoektribunes, twee loopbruggen en zes torens) |
| `grolsch-veste-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (218 × 161 × 38 mm) |
| `grolsch-veste.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (254087,70, 473044,70), in het hart
van de veldopening op het maaiveld (NAP +27,5 m), en de glTF-conventie Y
omhoog. +X loopt langs de lengteas van het veld naar het zuidoosten (−44,36
graden vanaf de RD-X-as) en +Y dwars daarop naar het noordoosten, naar de lage
tribune. Het maaiveld wordt op vier punten op het parkeerterrein rond het
stadion bemonsterd (`groundSamplePoints`, NAP +27,4 tot +28,0 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0153100000257703` (het stadion).

Het model is sinds 2026-10-06 geen massief blok onder het dak meer: de daken
zijn dakplaten die over de zitrangen uitkragen en de tribunes eronder zijn
getrapt gemodelleerd (in een eerdere versie ontbraken de tribunes onder de daken en was
de noordoosttribune een massief V-blok). In vlakken, dwarsprofielen en
polygonen, geen hoogteveld. Hoogtes boven het maaiveld; het veld ligt op +1,7 m.

Onderdelen, met wat uit het AHN-DSM komt (daken, spanten, randen) en wat
geschat is (alles onder het dak, want het AHN ziet alleen het dak):

- Het hoge dak als hoefijzer over de westkop, de zuidkant en de oostkop: een
  dakplaat van 2 m dik waarvan de bovenkant van +30,8 m aan de veldkant over
  39 m naar buiten oploopt tot +33,8 m (de onderkant van +28,8 tot +31,8 m),
  met verticale wanden. De koppen eindigen aan de noordkant in een schuine rand
  en lopen aan de zuidkant over in twee waaiers van acht driehoeken rond de
  binnenhoeken van de kom; de buitenrand van de waaiers ligt op 37 tot 39 m
  van de binnenhoek (op het DSM knikt de rand in de hoeken 1,5 m naar binnen).
- De dakspanten als ribben op het dak, op de plaats uit het DSM: 1,1 m breed,
  elke 10,8 tot 11 m (zuidkant u = ±5,2, ±16,2, ±27,2, ±38 en ±49 m; koppen
  v = −29 tot 25,2 m; in elke waaier vier spanten op 18,8, 41,9, 65 en 88,1
  graden vanaf de kop; plus het schuine eerste spant van elke kop) en een
  langsligger van 1 m breed op 29 tot 31,5 m van de dakrand die ze verbindt.
  De ribben stijgen van 0 aan de dakrand tot +4,2 m op 30 m afstand en dalen
  naar +1,2 m aan de buitenrand (mediaan van tien spanten in het DSM); het
  hoogste punt van het model is +37,3 m. De echte spanten zijn vakwerk, hier
  zijn het massieve ribben.
- De tribunes onder dat dak (geschat): tredenrangen van 2,4 m diep, elke trede
  drie rijen van 0,8 m, vanaf 1,5 m achter de dakrand. De onderring heeft 21
  rijen (zeven treden van +2,6 tot +9,8 m, 27 graden), daarachter ligt de gang
  (promenade en skyboxen) van 6 m breed op +10,8 m en de bovenring heeft 15
  rijen (vijf treden van +12,6 tot +19 m, 33 graden). Rond de waaiers lopen de
  rangen in bogen om de binnenhoek van de kom. Achter de bovenste rang staat een
  achterwand van 2,2 m dik tot onder de dakplaat, die het dak draagt; tussen de
  bovenste rang en de dakplaat blijft de ruimte open, dus de rangen zijn van
  opzij en bovenaf te zien. De koppen lopen aan de noordkant door tot de
  schuine dakrand, waar de rangen in doorsnede eindigen. De spanten rusten in
  het echt op de betonnen tribune (TNO-rapport over de instorting van 2011) en
  kragen naar het veld uit, zoals de dakplaat hier.
- De noordoosttribune (de oorspronkelijke tribune met één ring; de tweede ring
  is alleen langs west-, noord- en zuidkant gebouwd), 121,5 m lang: een
  V-dak van 2 m dik op +19,45 m aan de veldkant (v = 40,6 m), +17,27 m op
  v = 58 m en +18,83 m aan de achterkant (v = 70,6 m), uit het DSM en de
  luchtfoto (twee dakvlakken met masten en kabels). Eronder een rang van negen
  treden (+2,6 tot +11,8 m, geschat), daarachter een gang op +11,8 m, waar de
  loopbruggen op aansluiten, en een achterwand van 1,6 m.
- De twee hoektribunes tussen die tribune en de koppen (u −80 tot −60,5 m en
  60,5 tot 79,7 m, v 34 tot 57 m, de oostelijke met een afgeschuinde hoek): een
  schilddak van 1,6 m dik op de laagste van twee vlakken uit het DSM
  (z = 0,0242 u − 0,1049 v + 23,15 en z = 0,127 (u + 79) + 15,6, in het oosten
  gespiegeld), van +17,5 m bij de noordoosttribune aflopend naar +14 m achter
  de rang, op zeven kolommen van 1,6 m langs de achterranden, boven een rang van
  zeven treden (+2,6 tot +8,6 m, geschat) in bogen om de hoek van de veldopening.
- Twee loopbruggen rond de noordhoeken, uit de luchtfoto en het DSM: een dek
  van 2,6 m breed en 1,4 m dik langs de bogen, van het einde van de bovenring op
  +11 m naar de achterkant van de noordoosttribune op +12,6 m, op twee pijlers
  van 1,4 m (de pijlers en de hoogte van het dek zijn geschat).
- Zes torens aan de buitenrand van het dak (de zes trappenhuizen naar de
  promenade van de tweede ring en lichtbakken), op het DSM 10 tot 15 m bij 8 tot
  14 m en +22,3 tot +22,4 m (mediaan van het DSM), tegen de achterwand.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
83,0 % ligt binnen 1 m en 88,4 % binnen 2 m (de vorige versie 82,7 en 88,0 %).
Per deel (binnen 1 m / 2 m): zuidkant 86 / 91 %, koppen 83 tot 85 / 88 tot 90 %,
noordoosttribune 91 / 95 %, westelijke hoektribune 92 / 94 %, oostelijke 77 /
84 %, waaiers 69 / 77 % en torens 33 / 43 %. De afwijkingen zitten in de
spanten (vakwerk tegenover massieve ribben), de goot langs de buitenrand van de
waaiers (op het DSM 6 m lager), de lichtbakken en trappen van de torens en de
onregelmatige noordrand van de oostelijke hoektribune. De rangen onder het dak zijn voor het
DSM onzichtbaar en dus niet te vergelijken.

Printbaar op 1:1000: alle vlakken boven de onderkant wijzen omhoog of staan
verticaal, behalve de onderkanten van de dakplaten (vanaf +13,3 m; tot 39 m
uitkraging boven de rangen van het hoefijzer) en van het dek van de
loopbruggen; die staat het script toe (`OVERHANG_OK`), het draait zonder
`--allow-overhang`. De export vult de uitkragingen op met een kraag onder 45
graden: de STL van 257,6 cm³ wordt 437 cm³ (+69,6 % op 1:1000, +70,0 % op
1:1500 en +70,8 % op 1:2500; de vorige massieve STL was 539 cm³), geen fout. Op
de print blijft de onderring onder die schuine kraag zichtbaar, de gang en de
bovenring zijn opgevuld; in de GLB (kaart en voorbeeld) staan de rangen er
volledig onder. Dakplaten zijn 1,6 tot 2 m dik, de ribben 1 tot 1,1 m breed en
de kolommen en pijlers 1,4 tot 1,6 m. De STL (12.466 driehoeken) is één
samenhangend deel met de veldopening als gat.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/De_Grolsch_Veste) (30.205
plaatsen, tweede ring in 2008 en 2011, zes trappenhuizen) en stadiumdb (welke
zijde één ring houdt), het TNO-rapport over de instorting van het dak in 2011
(spanten op circa 10 m h.o.h. op de betonnen tribune), PDOK BAG (het
stadionpand), PDOK AHN (dsm en dtm 0,5 en 0,25 m via WCS) en de PDOK luchtfoto.
Geschat zijn de zitrangen (aantal rijen, hoogtes, hellingen, gang), de
achterwand en de dikte van de dakplaten, de rang van de noordoosttribune en de
hoektribunes, de pijlers van de loopbruggen en de hoogte van de ribben. Er
waren geen doorsneden of foto's met maten van de tribunes beschikbaar. Weggelaten:
de windverbanden en het vakwerk van de spanten, de kabels en masten van de
noordoosttribune, de goot langs de dakrand en de lichtbakken aan de buitenrand.
