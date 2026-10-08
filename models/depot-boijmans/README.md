# Depot Boijmans Van Beuningen (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `depot-boijmans.glb` | Catalogusbron in meters: node `building:depot-boijmans` met de spiegelende kom, de borstwering, het kruisvormige dakpaviljoen met lichtkap en installatiekasten en de insnijding van de hoofdingang, en node `vegetation:depot-boijmans-daktuin` met de plantvakken van de daktuin (zonder bomen) op een verborgen kern binnen de kom |
| `depot-boijmans-1-1000.stl` | Het depot met de daktuin in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (60 × 60 × 43 mm) |
| `depot-boijmans.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de kom (het
gemeenschappelijke middelpunt van de BGT-voetcirkel en de BAG-contour, die op
2 cm na samenvallen) op het maaiveld van het Museumpark (NAP -1,1 m) en de
glTF-conventie Y omhoog. +X loopt langs de lange balk van het kruisvormige
dakpaviljoen naar het oostnoordoosten (RD-richting (0,94609, 0,32392), 18,9 graden
linksom vanaf het oosten), +Y naar het noordnoordwesten. Het maaiveld wordt op
vier punten bemonsterd (`groundSamplePoints`), op de bestrating rondom, 3 m
buiten de grootste omtrek (NAP -1,2 tot -1,0 m), en niet in de verdiepte
straat aan de westkant (NAP -3,4 m). Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0599100100015964`; de ondergrondse parkeergarage Museumpark
(`0599100000423762`) ligt ernaast en raakt de omtrek over 11 m², andere panden
liggen niet onder het model. De Rotterdamse 3D-tegels in
`assets/landmarks/rotterdam-3d` bevatten alleen bruggen, niet het depot. In de
PDOK-gebouwtegels rond het depot staat verder alleen een pand op 75 m afstand;
geen buurpand raakt het model.

Onderdelen in het model (hoogtes boven het maaiveld):

- De kom als omwentelingslichaam: de voet op de BGT-cirkel (straal 20,80 m,
  41,6 m doorsnee), uitbollend volgens r(z) = 30,05 - 9,25 (1 - z/40)^3,3 tot
  de BAG-contour (straal 30,05 m, 60,1 m doorsnee) onder de borstwering. Op 10 m
  is de straal 26,5 m, op 20 m 29,1 m. De gevel helt aan de voet 37,4 graden uit
  het lood (52,6 graden boven de horizon) en wordt naar boven toe vrijwel
  loodrecht. BAG en BGT zijn allebei zuivere cirkels. De dakrand in het AHN is
  rond, maar ligt aan de noordkant tot 1,8 m binnen de BAG-cirkel (een cirkel
  van 29,4 m straal, 1,1 m naar het zuidzuidoosten verschoven) en is daar
  rommelig, waarschijnlijk door spiegelingen in de glazen balustrade; de
  BAG-cirkel is leidend.
- De borstwering van 1 m dik tot 35,3 m (AHN NAP +34,2 m) rond het platte dak
  op 34,05 m (AHN NAP +32,95 m).
- Het kruisvormige dakpaviljoen met het restaurant en de tentoonstellingszaal
  (AHN, randen waar het DSM door 37 m gaat): de balk van 45,8 × 16,5 m langs +X
  en de armen van 14,35 m breed tot 22,4 m uit het hart, tot 40,05 m (NAP
  +38,95 m). De glazen gevel staat 0,4 m terug onder een dakrand van 1 m (de
  rand rondom is op de luchtfoto zichtbaar; de diepte is geschat). Op het dak
  de lichtkap boven het atrium (29,25 × 7,5 m) als lessenaarsdak van 40,5 m
  aan de noordkant naar 40,95 m aan de zuidkant (AHN-mediaan per halve meter
  40,53 tot 40,89 m) en vijf installatiekasten van 41,4 tot 41,9 m: de
  trappenhuis- en liftkast op de noordarm, de ventilatoren op de zuidarm, de
  witte kast op het oosteinde (het hoogste punt), de kasten op het westeinde
  en het luchtbehandelingsblok ten zuiden van de lichtkap.
- De daktuin als aparte node met klasse `vegetation`: plantvakken 0,5 m boven
  het dak (762 m²), zonder bomen. Een rand van 25 m uit het hart tot de
  borstwering, open voor het bestrate terras aan de zuidoostkant (−80 tot −30
  graden vanaf +X), het terras en het pad aan de noordoostkant en het pad aan
  de noordkant, plus drie grote vakken in het noordwestelijke,
  noordoostelijke en zuidwestelijke kwadrant, alles 1,5 m vrij van het
  paviljoen (luchtfoto, 1,0 en 1,7 m verschoven tegen het AHN omdat het dak
  scheef in beeld staat). De berken staan bewust niet in het model.
- De hoofdingang aan de noordkant, naar Het Nieuwe Instituut (RD-azimut 95
  graden): een nis van 10 m breed met evenwijdige zijwanden, 0,8 m diep tot
  4 m hoog en daarboven een trede van 0,4 m diep tot 4,4 m (foto's: de deuren
  en de uitklappende panelen staan in een vlakke insnijding met een vlakke
  bovenkant op circa 4 m). In het echt staan de deuren loodrecht en is de
  bovenkant circa 3 m diep; die zou vrij overhangen, en een schuine bovenkant
  van 45 graden komt onder de naar buiten hellende gevel pas op bijna 10 m uit
  (geprobeerd, oogde als een poort van 10 m hoog). De vorige versie had een nis
  van 0,4 m.

Printbaar op 1:1000 zonder steun: alle onderdelen beginnen op dezelfde
onderkant, 1 m onder het maaiveld, en het script controleert dat geen
ondervlak flauwer hangt dan 45 graden, op de vlakke bovenkanten van 0,4 m diep
na: de onderkant van de dakrand van het paviljoen (72 m²) en de twee treden
boven de hoofdingang (elk 4 m²). Het flauwste ondervlak is de kern van de
daktuin, 45 graden; de gevel helt aan de voet 52,9 graden boven de horizon
in het model (52,6 graden volgens de formule). De export vult de kom
laag voor laag op onder de printbare hoek (een gesloten node met een naar
buiten hellende gevel krijgt sinds 2026-10-05 de overhangopvulling; de vlakke
nis die de vorige versie daarvoor nodig had, is vervallen).

De daktuin kan geen losse plaat op het dak zijn: de export zet de onderkant
van een gesloten node recht door tot de onderplaat (of laat een wig van 45
graden uitlopen in een wand tot de onderplaat), en die zou onder de dakrand
buiten de kom uitsteken. Daarom draagt de groene node zichzelf met een
verborgen kern binnen de kom: een cilinder van 19,8 m straal vanaf de
onderkant die vanaf 8 m onder 45 graden verbreedt tot 0,5 m binnen de gevel,
tot 0,5 m onder het dak. Het script controleert dat de kern helemaal in het
gebouw zit, en in de export blijft de groene node op elke hoogte binnen het
gebouw (gemeten op 1:1000). De gebouwnode staat in de GLB en in de 3MF vóór de
groene node; een slicer die overlappende delen op volgorde afknipt (Bambu
Studio en Orca doen dat) geeft de kern dan aan het gebouw en print alleen de
plantvakken groen. Dat is niet in een slicer nagekeken. Met de optie ‘bomen’
en neutrale bomen aan zet de export ook bomen op de plantvakken, net als op
ander groen.

Export op 1:1000 (uitsnede van 150 m met het depot): het
gebouw 89 990 mm³ voor en 90 350 mm³ na de opvulling, de daktuin met kern
72 350 en 72 770 mm³ (binnen het gebouw, op de plantvakken boven het dak na);
de export duurt circa 4,2 seconden (de vorige versie 92 620 en 92 970 mm³,
3,8 seconden).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Depot_Boijmans_Van_Beuningen)
(MVRDV, 2017 tot 2021; 39,5 m hoog en 60 m in doorsnee, 1664 spiegelende
glaspanelen), [MVRDV](https://www.mvrdv.com/projects/10/depot-boijmans-van-beuningen)
(40 m aan de voet, dakbos van berken op circa 35 m, restaurant op het dak),
PDOK BAG (grootste omtrek) en BGT (voet), PDOK AHN (dsm en dtm 0,5 m via WCS:
dak, borstwering, dakpaviljoen met lichtkap en installatiekasten, de richting
van het kruis en het maaiveld), de PDOK luchtfoto (plantvakken, terrassen,
paden, de dakrand en de kasten op het paviljoen) en foto's van Wikimedia
Commons (`Depot Boijmans van Beuningen 2025 (Osten).jpg` voor het silhouet van
de gevel, `2025DepotBoijmans.jpg`, `Rotterdam Depot Boijmans Van Beuningen
seen from the south.jpg`, `Depot Boijmans van Beuningen von Westen 2025.jpg`,
`Boijmans Depot, Rotterdam, September 2024 01.jpg` en `… 06.jpg` voor de
hoofdingang, `Depot Boijmans Van Beuningen in aanbouw 08.jpg`). Geschat zijn
het verloop van de gevel tussen voet en dakrand (gefit op het silhouet), de
hoogte van de plantvakken en hun grenzen (op een halve meter), de nis en de
dakrand van het paviljoen en de maat van de hoofdingang. Niet gemodelleerd:
de berken, de glazen balustrade, de spiegelpanelen en de vensters erin, de
zonnepanelen, de uitklappende deurpanelen, de nooduitgangen en de laaddeur
aan de zuidkant (plaats niet bekend) en de lichtkunst.

Licentie van het model: eigen werk op basis van open bronnen.
