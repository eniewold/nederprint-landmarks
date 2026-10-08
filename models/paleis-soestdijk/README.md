# Paleis Soestdijk (Baarn)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `paleis-soestdijk.glb` | Catalogusbron in meters: node `building:paleis` (corps de logis, tussenvleugels, hoekpaviljoens, de twee halfronde vleugels met colonnades, de eindpaviljoens en de lage aanbouwen aan de tuinzijde, uit dakvlakken en bouwdelen) |
| `paleis-soestdijk-1-1000.stl` | Het paleis op 1:1000 met de onderkant (1 m onder het nulpunt) op het printbed (172 × 64 × 24 mm) |
| `paleis-soestdijk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (147658,09, 467275,25), op de
symmetrieas midden op het voorplein, halverwege de middelpunten van de twee
halfronde vleugels, op NAP +3,3 m, en de glTF-conventie Y omhoog. +X loopt langs
de voorgevel naar het noordnoordwesten, naar de Baarnse vleugel (116,16 graden
linksom vanaf de RD-X-as: de lijn door de middelpunten van de twee kwartcirkels,
gefit op de BAG-gevels, gelijk met de symmetrieas van het AHN) en +Y loodrecht
daarop naar de tuin; de voorgevel van het corps de logis staat op y 34,6 m. Het
corps de logis, de tussenvleugels en de hoekpaviljoens zijn symmetrisch in x = 0
(op de daken van de tussenvleugels na, die verschillen); de halfronde vleugels
hebben elk een eigen middelpunt en straal (gemeten aan de randen van het platte
dak in het AHN: de Baarnse vleugel ligt 0,8 m verder naar buiten). Het maaiveld
wordt bemonsterd voor het corps de logis, voor beide colonnades, achter de
tussenvleugels en voor de eindpaviljoens (`groundSamplePoints`, NAP +3,1 tot
+3,5 m); als geen van die punten in de uitsnede valt, gebruikt de lader
`groundHeight` 46,35 m (de laagste ellipsoïdische PDOK-terreinhoogte op die
punten). Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0308100000022041`
(het hele paleis in één pand); andere PDOK-panden raken het model niet.

Onderdelen (hoogtes boven NAP +3,3 m; 172,1 bij 64 m en 24,4 m hoog met de
onderkant):

- Corps de logis (x -21,65 tot 21,65 m, y 34,6 tot 46 m): drie bouwlagen en een
  attiek tot de goot op +14,4 m met een kroonlijst, een plat dak van 2,4 m breed
  en daarachter een afgeknot schilddak van 53 graden tot het platte bovenvlak op
  +17,1 m; de belvedère van 13 bij 4,5 m tot +22,4 m met een kroonlijst, drie grote
  vensters aan de voorkant, een venster aan elke zijkant en twee schoorstenen op
  de hoeken tot +23,4 m; twee schoorstenen op de hoeken van het dak tot +19,7 m en
  zeven kleinere aan de achterkant; vier pilasters (op de hoeken en naast de
  middelste drie assen), een plint tot +1,9 m en vensternissen in vier rijen op
  dertien assen van 3,2 m; het portiek met balkon (6,4 m breed, tot +7,6 m) met
  vier zuilen en daartussen blinde doorgangen, deuren naar het balkon en het
  bordes met vijf treden tot +2,2 m aan voor- en zijkanten. Aan de tuinzijde de
  achterbouw (x -7,4 tot 7,4 m, tot y 55,4 m) met een mansardedak van 61 graden
  tot +18,9 m, de achterhoeken tot +14,4 m en de lage binnenplaatsdaken (+10,8 m
  aan de Soester, +7 m aan de Baarnse kant).
- Tussenvleugels (twee bouwlagen): aan de Soester kant (x -38,15 tot -21,65 m)
  een borstwering tot +8,1 m, een voorste dakvlak van 38 graden tot de nok op
  +10,6 m en daarachter een tweede zadeldak (nok +10,6 m); aan de Baarnse kant
  (x 21,65 tot 38,15 m) een borstwering tot +8 m, een mansarde van 52 graden tot
  het platte dak op +11,5 m met drie dakkapellen met een puntdak (+9,9 m) en het
  portaal met balkon (+4,9 m) voor de ingang; vensters in twee rijen.
- Hoekpaviljoens (x 38,15 tot 44,9 m aan beide kanten, y 30 tot 49,7 m): drie
  bouwlagen, zadeldak langs y met de goot op +12,7 m en de nok op +14,1 m (23
  graden), frontons met een lijst van 0,3 m aan voor- en achterzijde, hoeklisenen,
  een plint en vensters in drie rijen; aan het Baarnse paviljoen een dwarsvleugel
  (tot x 52,2 m, nok +14,1 m langs x, fronton aan de kop); schoorstenen tot +15,5 m.
- Halfronde vleugels (kwartcirkels van 96 graden van het eindpaviljoen tot in het
  hoekpaviljoen; Soester vleugel straal 30,1 tot 39,8 m rond (-45,4, 0,1), Baarnse
  vleugel 30,9 tot 40,6 m rond (45,5, 0,1)): goot +8 m aan beide gevels met
  kroonlijsten, dakvlakken van 45 graden tot het platte dak op +10,8 m; aan het
  voorplein de colonnade als achtkantige zuilen van 1 m om de circa 3 m (15 velden aan
  de Soester, 16 aan de Baarnse kant) voor een 0,6 m terugliggende gevel van +1 m tot +4,6 m (bovenkant schuin
  onder 51 graden), daarboven kleine vensters tussen de zuilen; aan de tuinzijde
  een plint en vensters in twee rijen; zes schoorstenen uit het AHN (vier op de
  Soester, twee op de Baarnse vleugel).
- Eindpaviljoens (x -85,2 tot -75,3 m en 76,4 tot 86,1 m, y -7,8 tot -0,8 m):
  drie bouwlagen, zadeldak langs x (goot +12,75 m, nok +14,1 m) met frontons aan
  beide kopse kanten, hoeklisenen, plint, vensters in drie rijen en een schoorsteen
  (+15,5 en +14,9 m).
- Lage aanbouwen aan de tuinzijde (in het BAG-pand): het terras achter het corps
  de logis en de Baarnse tussenvleugel (+2,2 m) en achter de Baarnse vleugel een
  terras met afgeronde kop (+2,2 m) met een blok van +7 m tegen de gevel.

Het AHN en de nieuwste luchtfoto tonen het paleis zoals het nu staat: de
nieuwbouwplannen van MeyerBergman Erfgoed Groep (hotel en woningen rond het
paleis) zijn na de vernietiging van het bestemmingsplan in 2024 vervallen en het
gebouw wordt gerestaureerd; het model is dus het bestaande paleis. De koetshuizen,
stallen en overige bijgebouwen op het landgoed staan los en zijn eigen panden; ze
blijven PDOK. De lage terrassen aan de tuinzijde zijn wel meegenomen omdat ze in
het BAG-pand van het paleis liggen en tegen de gevels aan staan.

PDOK reconstrueert het paleis als vlakke blokken met facetten op de bochten: de
halfronde vleugels als veelhoeken van platte dozen zonder dakvlakken, het corps de
logis als één blok met een kleine verhoging, geen belvedère-vorm, geen frontons,
geen schoorstenen. Het PDOK-terrein heeft een heuveltje op de plek van het bordes;
de treden van het model zakken daar grotendeels in.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen,
de kroonlijsten, de frontonlijsten en de bovenkant van de colonnades na (51 tot 58
graden). De printcheck (`prepareMeshes` met de printbare overhangopvulling op
1:1000, uitsnede van 192 m) geeft status NoError en 0 % extra volume (37.632 mm³
zonder en 37.633 mm³ met opvulling, 1,8 s). De STL is 36,8 cm³, heeft 24.368
driehoeken en is één samenhangend deel (status NoError, geslacht 0). Dunste delen
op 1:1000: de zuilen van de colonnades 1 mm, de schoorstenen op de belvedère
1 mm, de dakkapellen 1,5 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Paleis_Soestdijk), PDOK BAG,
PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto en foto's op Wikimedia
Commons van het voorplein (recht van voren en schuin van beide kanten), het
corps de logis met het portiek, de colonnade van een halfronde vleugel, een
hoekpaviljoen en de tuinzijde vanaf de vijver. De cirkels van de halfronde
vleugels zijn gefit op de BAG-gevels en op de randen van het platte dak in het
AHN. Geschat zijn de kroonlijsten, de pilasters en lisenen, de vensternissen
(ritme van de foto's), het aantal zuilen en de diepte van de colonnades, de
frontonlijsten, de breedte van de dakkapellen, de vensters van de belvedère en de
treden van het bordes. Weggelaten: de vlaggenmast op de belvedère (dunner dan
0,9 m), de vazen en lantaarns bij het bordes, de balusters van het balkon en de
borstweringen (als dichte borstwering), de luiken, de trapjes naar de colonnades,
de hagen en struiken langs de colonnades, het zonnescherm aan de tuinzijde, het
terras achter de Soester vleugel (geen deel van het BAG-pand) en de bijgebouwen op
het landgoed (eigen panden).

Licentie van het model: eigen werk op basis van open bronnen.
