# Jan Blankenbrug (Vianen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `jan-blankenbrug.glb` | Catalogusbron in meters: node `road:rijbaan` (de bovenste 0,5 m van beide wegdekken met de BGT-attributen, zie hieronder) en `building:jan-blankenbrug` met de rest van het kunstwerk: de twee kokerliggers met hun dekplaten, 588 schoren, schampkanten en leuningkoppen, de vier rivierpijlers (poer met drie kolommen), de acht landpijlers (plint met twee kolommen) en de vier landhoofden |
| `jan-blankenbrug-1-1500.stl` | Beide bruggen (constructie en wegdek samen, ongewijzigd) op 1:1500 met een printvoet onder de dekken, met de onderkant (1,0 m onder de waterspiegel) op het printbed: twee losse stukken naast elkaar met de spleet ertussen (364 × 39 × 16 mm; met `--scale` een andere schaal, op 1:1000 is hij 546 mm lang) |
| `jan-blankenbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

De Jan Blankenbrug in de A2 over de Lek bestaat uit twee gelijke betonnen
uitbouwbruggen naast elkaar, ontworpen door Zwarts & Jansma: de oostelijke uit
1999 (rijrichting Utrecht) en de westelijke uit 2004 (rijrichting
's-Hertogenbosch), elk 532,9 m lang en 29 m breed. De stalen boogbrug van 1936
ten oosten ervan is in 2021 gesloopt; de pijlerresten in de rivier horen niet
bij het model.

De GLB is in meters met de oorsprong op RD (133752,26, 445509,28) (WGS84
51,99756 N, 5,07781 O, precies de controle-URL), op de spleet tussen de twee
dekken midden in de hoofdoverspanning, op de waterspiegel van de Lek zoals het
PDOK-terrein die legt (43,13 m ellipsoïdisch, NAP -0,27 m; PDOK = NAP + 43,40 m
op de uiterwaarden), en de glTF-conventie Y omhoog. +X loopt langs de brug naar
het noordnoordwesten, naar Nieuwegein (`xAxis` (-0,32215, 0,94669), 108,79
graden linksom vanaf het oosten, uit de BGT-dekranden), +Y naar het
westzuidwesten (stroomafwaarts): de westelijke brug ligt op +Y, de oostelijke
op -Y. De dekken lopen recht van x = -266,54 tot 266,39 (BGT), de landhoofden
tot ±272,8; de rivierpijlers staan op x = ±82,7 (BGT-poeren), de landpijlers
op ±182,7 en ±224,5 (geschat, zie hieronder). Het maaiveld wordt op zes
punten op de Lek bemonsterd (`groundSamplePoints`: x = -50, 0 en 50, 40 m
ten westen en 38 m ten oosten van de spleet, buiten de dekken en vóór de
oude pijlers); `groundOffsetMetres` is 0, want het PDOK-terrein legt het water
daar op 43,13 tot 43,14 m. `groundHeight` is 43,13 m, de PDOK-waterspiegel op
die punten, zodat een uitsnede die alleen een uiterwaard of een landhoofd
raakt (waar het terrein 2 tot 17 m hoger ligt) het model niet laat wegvallen
of optillen. `replacesBuildings` is leeg: onder de brug ligt geen BAG-pand, en
PDOK reconstrueert de brug niet (over de rivier staat in de PDOK-tegels
niets; de wegdelen op de opritten sluiten aan de dekeinden op NAP +17,1 tot
+17,6 m aan, het model ligt daar op +17,4 tot +17,6 m).

Wegdelen met PDOK-attributen: de bovenste 0,5 m van beide wegdekken is één
node van klasse `road` met de attributen van de actuele BGT-wegdelen erop
(relatieve hoogteligging 1, zonder `eind_registratie`) in
`extras.attributes`, zodat de kleurregels van een thema op de brug werken zoals
op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan autosnelweg | gesloten verharding | `L0002.5ce649185a5443b6afc575bd14beca14` (oost, BGT y = -28,1 tot -1,8), `L0002.777196270e7b47b69db04831ccb6e083` (west, 1,6 tot 28,6), `L0002.de11c0d4ea1f44a99e74c949ed8afd25` (strook langs de westrand, 28,3 tot 29,0) | per brug tussen de binnenste schampkant langs de spleet (y = ±1,6) en de buitenste (-28,4 en 28,3), van landhoofd tot landhoofd |

De BGT legt op het dek alleen rijbaan autosnelweg (de strook voor langzaam
verkeer die Wikipedia noemt, is in de BGT geen eigen wegdeel en
`plus_fysiekvoorkomen` is leeg). De laag is per brug een snijstrook van de
spleet tot 0,5 m buiten de dekrand en 0,5 m voorbij de landhoofden, van 0,5 m
onder tot 1 m boven het wegdek over de stations van het dek (om de 2 m); de
schampkanten en de leuningkoppen op de landhoofden blijven over hun hele
hoogte met 2 cm vrij constructie. De volumes tellen op tot die van de brug als
geheel (constructie 91.290 m³, rijbaan 14.614 m³, samen 105.904 m³, geen
overlap; het script controleert dat). Verticale stralen (`zfight.py`, 30.000
punten over het dek en over het hele model) vinden geen samenvallende
bovenvlakken en geen vlakken zonder dikte. De STL is ongewijzigd: het hele
brugmodel.

Onderdelen in het model (hoogtes in NAP):

- Twee dekken van 29,0 m breed (BGT; de oostelijke loopt van 28,8 naar
  29,4 m) met een spleet van 0,94 m aan de zuidkant en 0,48 m aan de
  noordkant. Het wegdek volgt het AHN-DSM als regelmatig, symmetrisch
  lengteprofiel: top +21,16 m midden boven de Lek, +20,79 m boven de
  rivierpijlers, +17,6 m aan de dekeinden (restfout 5 cm). Elk dek loopt
  2,5 % af van de spleet naar de buitenrand (AHN; de bruggen zijn elkaars
  spiegelbeeld). Dekplaat van 1,0 m.
- Per brug één koker van 13 m breed onder het midden van het dek. De
  onderkant ligt in het midden van de hoofdoverspanning 4,0 m onder het
  wegdek (+17,2 m) en loopt parabolisch naar 7,2 m boven de rivierpijlers
  (+13,6 m; aan de randen van de vaargeul van 147 m +14,3 m, RWS: +14,2 m); in
  de zijoverspanningen loopt de voute in 80 m terug naar 4,0 m, met een korte
  voute naar 5,0 m boven de eerste landpijler; over de aanbruggen 4,0 m.
- Onder de uitkragende dekplaat (8 m aan beide kanten van de koker) per brug
  aan beide kanten een rij schoren om de 3,6 m (588 in totaal), 1,0 × 1,0 m,
  van 1,0 m boven de onderkant van de koker tot 1,5 m van de dekrand, loodrecht
  op de as; ze eindigen in een kop met verticale zijden in de dekplaat. Door de
  voute zijn ze in het midden van de hoofdoverspanning circa 20 graden steil en
  bij de rivierpijlers circa 40 graden, zoals de "golvende beweging" van de rij
  schoren op de foto's.
- Twee rivierpijlers per brug (hoofdoverspanning 165,4 m, Structurae 165 m): op
  een poer volgens de BGT (21,1 × 3,3 m met ronde koppen, bovenkant +1,0 m)
  drie kegelvormige kolommen 7 m hart op hart; de buitenste lopen naar boven
  taps toe (3,2 naar 2,4 m), de middelste omgekeerd (2,2 naar 3,2 m).
- Vier landpijlers per brug (zijoverspanningen van 100 m, daarna twee velden
  van 41,8 m): twee kolommen 9 m hart op hart die naar boven taps toelopen (3,5
  naar 2,5 m), op een plint tot 0,8 m boven de uiterwaard (AHN: +3,6 en +3,4 m
  aan de zuidkant, +2,3 en +1,7 m aan de noordkant).
- De landhoofden als blokken onder de dekeinden in de dijken (BGT, 6,3 m), met
  op de buitenste schampkanten de koppen van de leuningen (1,5 m boven het
  wegdek, foto); schampkanten van 1,0 m breed en 0,6 m hoog langs de
  buitenranden en van 1,2 m breed en 0,8 m hoog langs de spleet.

Wat er niet in zit: de aluminium leuningen met dunne stijlen en de
geleiderails (kleiner dan 0,9 m), lantaarnpalen, de seinportalen boven de
rijbanen (open vakwerk met vrije overspanningen van 29 m dat op 1:1000 niet
zonder steun print), het looprooster in de spleet, de vierkante eindblokken
van de schoren op de koker (kleiner dan 0,9 m), dilatatievoegen en de
pijlerresten en landhoofden van de gesloopte boogbrug (niet van deze brug).

Printbaarheid: dragende delen zijn minstens 1,0 m (schoren) en 2,2 m
(kolommen). Vrij hangen de onderkant van de kokers en van de uitkragende
dekplaten en de schoren; samen 33.136 m². Het script controleert dat alles op
dezelfde onderkant begint en dat de printversie (met per dek een wig van 50
graden vanaf beide dekranden over de schoren heen en een scherm van 1,35 m (0,9 mm op
1:1500) onder het midden van de koker) geen overhang heeft (0 m²). In de
printcheck (gesloten solid met overhangopvulling, status `NoError` voor beide
nodes): de hele brug op 1:1500 (377 mm) +48,5 % opvulling, een uitsnede rond
de hoofdoverspanning op 1:1000 +45,3 %; het wegdek krijgt geen eigen
opvulling (0 %): de constructie draagt alles.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Jan_Blankenbrug_(Vianen))
(lengte 532 m, Zwarts & Jansma, uitbouwbrug, opening 1999 en 2004,
doorvaartbreedte 147 m, doorvaarthoogte NAP +14,2 m aan de randen); Structurae
(hoofdoverspanning 165 m, totale lengte 532,4 m, voorgespannen kokerligger in
vrije uitbouw); Bouwdienst Magazine maart 2003, "Spiegelbeeld" (29 m breed,
spleet van 94 cm, één koker met schoren van hogesterktebeton in plaats van
drie kokers, vier landpijlers van twee en twee rivierpijlers van drie
kegelvormige kolommen); Nederlandse Bruggenstichting, Bruggen 2021 nr. 4;
zja.nl (de middelste kolom van de rivierpijler loopt omgekeerd taps toe); PDOK
BGT overbruggingsdeel (dekken `L0002.2fa7ca7db0104aab9393b5deb0e26f83` en
`L0002.022e7942000f4293bb6c6d51e8ad026d`, poeren
`L0002.03b63d82a4784120a20e23aa9b2ce3e8`,
`L0002.837950b55290464c8146efd3113f7cfc`,
`L0002.eab6317ae15b440ebbbb5cd00e6cca6e` en
`L0002.ee8efc23227e4b72a87e4e7f9f65796c`, landhoofden) en wegdeel; AHN
DSM/DTM 0,5 m (PDOK WCS) voor het wegdek, het dwarsverval en de uiterwaarden;
PDOK-terrein voor de waterspiegel; Wikimedia Commons-foto's: *Nice shaped 2
new (1999 and 2006) concrete river bridges, with the old 153 m span steel
archbridge (1936) left - panoramio.jpg*, *Old steelbridge over the Lekriver
with the 2 new concrete ones in front - panoramio.jpg*, *VianenBrug01.JPG*,
*VianenBrug02.JPG*, *De Lek IJsselstein 01.JPG* en *A2 - Jan Blankenbrug,
Lekbrug - RWS 421287.jpg* en *421290.jpg*.

Geschat (foto's, verhoudingen tegen de hoofdoverspanning en de bekende
hoogtes van wegdek en water): de constructiehoogtes (4,0, 7,2 en 5,0 m) en de
lengte van de voutes; de plaats van de landpijlers (een zijoverspanning van
100 m en twee velden van 41,8 m: het aantal staat in de bronnen, de plaats
niet in de BGT en onder het dek niet in het AHN); de breedte van de koker
(13 m); de schoren (afstand 3,6 m, doorsnede, aanzet en eindpunt); de
dekplaat; de maten van de kolommen en plinten; de bovenkant van de poeren
(+1,0 m); de schampkanten en de leuningkoppen. De twee bruggen zijn gelijk
gemodelleerd (ze zijn volgens de bron elkaars spiegelbeeld).

Licentie van het model: eigen werk op basis van open bronnen.
