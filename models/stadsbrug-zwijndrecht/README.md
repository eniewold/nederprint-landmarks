# Stadsbrug Zwijndrecht (Zwijndrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadsbrug-zwijndrecht.glb` | Catalogusbron in meters met vijf nodes: `road:rijbaan` (`bgt_functie` rijbaan lokale weg, gesloten verharding, asfalt), `road:fietspad` (fietspad, gesloten verharding, asfalt: het Zwijndrechtse deel tot x = -109,5), `road:fietspad-cementbeton` (fietspad, gesloten verharding, cementbeton: het Dordtse deel) en `road:voetpad` (voetpad, gesloten verharding, cementbeton: alleen het Dordtse deel), de bovenste 0,5 m van het dek binnen de BGT-wegdelen met de attributen in `extras.attributes`; en `building:stadsbrug-zwijndrecht` met de rest: het dek met trottoirs en schampkanten, de twee vakwerkliggers, de dubbele basculebrug met de klepliggers, de basculepijler met bordes, kraag en huisje, de Dordtse basculekelder met het machinehuis, de pijlers en de aanbrug met geleiders |
| `stadsbrug-zwijndrecht-1-1000.stl` | De brug in één stuk (constructie en wegdek samen) op 1:1000 met een printvoet onder het dek, met de onderkant (1 m onder de waterspiegel) op het printbed (308 × 36 × 22 mm) |
| `stadsbrug-zwijndrecht.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, het vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (104264,74, 424905,05) (WGS84
51,81046 N, 4,65150 O, precies de controle-URL), midden in de basculebrug
waar de twee kleppen elkaar raken, op de as tussen de vakwerkliggers, met
z = NAP-hoogte en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
zuidoosten, naar Dordrecht (`xAxis` (0,80479, -0,59356), -36,41 graden vanaf
het oosten, uit de vakwerklijnen in het AHN), +Y naar het noordoosten
(stroomopwaarts, naar de spoorbrug). De vakwerkliggers staan op y = ±6,45,
het dek loopt van y = -11,8 tot 11,4. Het model loopt van x = -263,35 (een
voeg in de aanbrug bij Zwijndrecht, luchtfoto) tot 44,8 (einde van het
BGT-brugdek bij Dordrecht; daarna begint de gebogen fly-over over het spoor).
De pijlers staan op x = -239 (aanbrug), -204,6 (Zwijndrechtse oever) en -115
(midden in de rivier), de basculepijler op x = -37,8 tot -25,1, de Dordtse
kademuur en basculekelder vanaf x = 23,75. Het maaiveld wordt op zes punten
op het water van de Oude Maas bemonsterd (`groundSamplePoints`: 22 m ten
zuidwesten en 17 m ten noordoosten van de as, tussen de twee bruggen, op
x = -160, -80 en -5); `groundOffsetMetres` is 0, want het PDOK-terrein legt de
Oude Maas op ellipsoïdisch circa 43,66 m (NAP 0). Omdat de brug 308 m lang is,
staat de laagste PDOK-hoogte op die punten ook als vaste terugval in
`groundHeight` (43,66), zodat een uitsnede die alleen een uiteinde raakt het
model niet laat wegvallen. `replacesBuildings` bevat BAG-pand
0505100000013841 (bouwjaar 1932): het huisje op het bordes van de
basculepijler, dat in het model zit en waarvan de PDOK-reconstructie 0,4 m
in de dekrand stak.

De verkeersbrug van 1939 (Rijkswaterstaat: Verkeersbrug Dordrecht; in
Zwijndrecht de Dordtse brug, in Dordrecht de Zwijndrechtse brug) was tot 1977
deel van de A16. Direct ten noordoosten ligt de Spoorbrug Dordrecht met het
hemelbed (eigen model); die zit hier niet in en het model raakt hem nergens:
de remmingwerken van de spoorbrug komen tot 11,7 m van de as (NAP +3,5 m),
de pijlerschachten van de Stadsbrug houden op bij 10,9 m. Het ronde
bedieningsgebouw tussen beide bruggen ("de koffiefilter", BAG-pand
0505100000067669) is niet gemodelleerd en niet vervangen; de noordoostkop van
de basculepijler eronder is afgesneden op y = 12,8, zodat het model het pand
(vanaf y = 13,3) niet raakt.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 23,2 m breed (BGT), de rijbaan volgens het AHN: +13,5 m aan het
  westeinde, +13,8 tot +13,9 m over de rivier en op de basculebrug, +13,85 m
  bij Dordrecht. Tussen de buitenkanten van de liggers (|y| ≤ 6,95) de
  rijbaan en de stroken waarin de liggers staan op wegdekhoogte, daarbuiten
  de trottoirs met fiets- en voetpad 0,17 m hoger (AHN). Constructiehoogte
  1,6 m, aan de rand 0,7 m (schuin ondervlak). Langs beide randen een
  schampkant van 0,9 m breed en 0,6 m hoog in plaats van de leuning,
  onderbroken bij de bordessen en het machinehuis.
- Twee vakwerkliggers met evenwijdige randen van 1,0 m dik op y = ±6,45
  (AHN), bovenrand NAP +21,4 m (AHN, 99e percentiel), onderrand van x = -204,5
  tot -40,5 met schuine eindstijlen tot de bovenrand van x = -199 tot -46
  (AHN). Tien vakken van 15,3 m (windverband op de luchtfoto) met een
  verticaal op elke knoop en in het midden van elk vak en diagonalen in een
  W (Warren met verticalen, foto vanaf het dek); het steunpunt op de
  middenpijler valt op een onderknoop. Als dichte plaat: per ligger 22
  doorgaande driehoekige openingen (de vakken met een verticaal en de
  diagonaal als plafond, met een spitse top van 52 graden onder de
  diagonaal, zodat de diagonaal naar onderen breder wordt; de eindvelden
  onder de eindstijlen van 54 graden) en 20 blinde nissen van 0,35 m aan de
  buitenkant voor de driehoeken met een vlakke bovenkant.
- De dubbele basculebrug in gesloten stand: twee klepliggers van 1,0 m op
  y = ±6,45 van x = -34,5 tot 35,3 (BGT), 2,05 m boven het wegdek bij de
  draaipunten (x = -30,5 en 31,5), aflopend naar 1,4 m midden op de klep,
  2,45 m over 8 m waar de kleppen elkaar raken (AHN) en met schuine
  uiteinden (foto vanaf het dek). Doorvaartwijdte tussen pijler en kade
  circa 47 m.
- De basculepijler aan de Zwijndrechtse kant (BGT muur): 12,7 m langs de brug
  over de hele dekbreedte, met een halfronde kop en een bordes op
  trottoirhoogte aan de zuidwestkant (BGT overbruggingsdeel), een kraag om de
  kop tot +5,5 m (BGT kademuur, AHN), het huisje op het bordes (BAG, 4,5 ×
  2,8 m tot +17,7 m, AHN) en aan de noordoostkant een bordes tot y = 12,8.
- De basculekelder op de Dordtse kade van x = 23,75 tot het einde van het
  model, met aan de noordoostkant het machinehuis (7,1 × 5 m tot +20,7 m,
  AHN; geen BAG-pand).
- Pijlers met ronde koppen volgens de BGT (muren onder het dek): x = -239
  (4,1 m), -204,6 (5,1 m) en -115 (4,3 m), tot in het dek; aan de
  zuidwestkant van de rivierpijlers driehoekige neuzen tot +3,4 m (AHN,
  luchtfoto; 8 m en 14 m breed). Aan het westeinde een eindpijler van 1,5 m
  (geschat).
- Op de aanbrug geleiders van 0,9 m breed en 0,8 m hoog (AHN) op y = ±6,45,
  in het verlengde van de liggers.
- Het wegdek als eigen nodes: per BGT-wegdeel de strook van 0,5 m onder tot
  1 m boven het dek (rijbaan en trottoirs elk op hun eigen hoogte), min de
  hele strook van de vakwerk- en klepliggers (ook onder de openingen), de
  geleiders, de schampkanten, het huisje en het machinehuis met 2 cm vrij;
  wegdeel = strook ∩ brug, constructie = brug − strook. De stroken waarin de
  liggers staan (BGT ondersteunend wegdeel verkeerseiland en berm) zijn geen
  wegdeel en blijven constructie. Op het Zwijndrechtse deel (BGT G0642) is
  het trottoir één fietspad in asfalt, op het Dordtse deel (G0505) een
  fietspad en een voetpad in cementbeton.

Wat er niet in zit: het windverband en de eindportalen boven de rijbaan
(horizontale staven vrij over 12,9 m op 21 m hoogte; op 1:1000 vult de export
daaronder dwars over de rijbaan op, dus weggelaten), leuningen, lantaarns en
verkeersborden (dunner dan 0,9 m), de koffiefilter (BAG-pand, blijft de
PDOK-reconstructie), de trappen naast de Dordtse kelder (loop niet uit de
bronnen af te leiden, ze lopen deels onder de fly-over buiten het model), de
rest van de Zwijndrechtse aanbrug en de Dordtse fly-over (die liggen in PDOK
als wegdeel op maaiveldhoogte), de voegen (vlak in het wegdek) en de
dwarsdragers onder het dek.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke grijze wegstrook op het water, zonder vakwerk, pijlers of
basculebrug; alleen het huisje en de koffiefilter staan als blok op de
pijler. Het model heeft van het zuidwesten en noordoosten (235 en 55 graden)
de twee vakwerkliggers met openingen en nissen, de pijlers met neuzen, de
blauwe klepliggers en het verhoogde dek op 13,8 m; van het noordwesten (325
graden, uit Zwijndrecht) de aanbrug met geleiders, de eindstijlen en de
basculepijler met het halfronde bordes en het huisje; van het zuidoosten
(145 graden, uit Dordrecht) de kelder met het machinehuis, de klepliggers met
de verhoging in het midden en de eindstijlen van het vakwerk.

Pasvorm op het AHN: op de rijbaan ligt 90,0 % van de DSM-cellen binnen 1 m
van het wegdek van het model (45 399 cellen, mediaan 0,00 m; de rest zijn het
windverband boven de rijbaan, auto's en lantaarns), op de trottoirs 89,5 %
binnen 0,5 m (mediaan -0,02 m). De bovenrand van de liggers staat in het DSM
op +21,37 m (99e percentiel) tegen +21,4 m in het model.

Printbaarheid op 1:1000: het vakwerk is een dichte plaat van 1,0 m met staven
van 0,9 m; elke doorgaande opening heeft een plafond van 52 graden of
steiler (het script controleert dat), de driehoeken met een vlakke bovenkant
zijn blinde nissen. Alleen het ondervlak van het dek en van de bordessen
hangt vrij; in de printversie met voet blijft daarvan 2,5 m² over (de
nissen en daken van 84 m² zijn ondiep of horizontaal op een wand). Alles
begint op dezelfde onderkant. Printcheck op 1:1000 in een uitsnede van 280 m
rond het model: status NoError voor alle vijf onderdelen, de constructie van
75,5 naar 59,4 cm³ (de printbare opvulling is 21 % minder dan de rechte
opvulling tot de onderplaat), de `road:`-onderdelen zonder eigen opvulling
(`extraPct` 0), 11,6 s; de vakwerkopeningen blijven open. De STL heeft een
printvoet: een wig van 50 graden onder de dekrand met een scherm van 0,9 m
tot de onderplaat. Controle op samenvallende vlakken (30 000 en 100 000
verticale stralen over het dek): geen z-fighting tussen nodes en geen vlak
zonder dikte in de `road:`-nodes.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Stadsbrug_Zwijndrecht)
(naam, bouwjaar 1939, A16 tot 1977, dubbele basculebrug); PDOK BGT
overbruggingsdeel, scheiding, wegdeel en ondersteunend wegdeel; PDOK BAG
(panden 0505100000013841 en 0505100000067669); PDOK AHN DSM 0,5 m (WCS);
PDOK-luchtfoto (Actueel_orthoHR); Wikimedia Commons: Brugweg in Dordrecht
rijbaan.jpg, Autobrug over de Oude Maas, Zwijndrechtsebrug, Dordtsebrug,
Dordrecht (12171579566).jpg, Brug in A16 tussen Zwijndrecht en Dordrecht -
luchtfoto.jpg, Brugwachter Oude Maas (Koffiefilter) , Zwijndrechtsebrug,
Dordtsebrug bij Dordrecht (12171172804).jpg, Dordrecht Maas.JPG, Dordrecht
View Spoorbrug 017 9686.jpg.

Geschat: de vakverdeling (tien vakken van 15,3 m met verticalen, uit het
windverband op de luchtfoto; de zijaanzichten van het vakwerk zijn op Commons
vrijwel overal verborgen achter de spoorbrug), de constructiehoogte van het
dek (1,6 m, rand 0,7 m), de vorm van de pijlerneuzen (driehoekig tot +3,4 m;
aan de noordoostkant liggen de remmingwerken van de spoorbrug), de
pijlerschachten tot in het dek, de eindpijler op x = -263,35, de diepte van
de basculekelders, de draaipunten van de kleppen en de kraag om de pijlerkop.

Gegevens: BGT, BAG, AHN en luchtfoto van PDOK (CC0/CC BY 4.0); foto's van
Wikimedia Commons alleen als referentie, niet in het model opgenomen.
