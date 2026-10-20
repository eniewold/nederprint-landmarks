# Hefbrug Waddinxveen (Waddinxveen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hefbrug-waddinxveen.glb` | Catalogusbron in meters met vijf nodes: `road:rijbaan`, `road:fietspad`, `road:voetpad` en `road:voetpad-tegels`, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in `extras.attributes`, en `building:hefbrug-waddinxveen` met de rest van het kunstwerk: de twee heftorens van open vakwerk met kop, kabelwielen en ballastblok, het val met de vakwerkliggers en het bovenwindverband, de landhoofden en het brugwachtershuisje |
| `hefbrug-waddinxveen-1-1000.stl` | De brug in één stuk op 1:1000 in een printvorm (zie onder), met de onderkant (1,0 m onder de waterspiegel) op het printbed (51 × 22 × 45 mm) |
| `hefbrug-waddinxveen.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, de vervangen BAG-panden en het vervangen BGT-dek, hoofdmaten en bronnen |

Het model is de hefbrug voor het wegverkeer uit 1935-1936 (rijksmonument
512003, met het brugwachtershuisje). De spoorbrug over de Gouwe ten zuiden
ervan hoort er niet bij. Volgens het register is de brug identiek aan de
Hefbrug Boskoop; die van Gouwesluis in Alphen is breder en hoger. Sinds 2012
liggen er voetpaden aan weerszijden van het val en fietsstroken op de rijbaan.

De GLB is in meters met de oorsprong op RD (105089,30, 450869,40) (WGS84
52,0439 N, 4,6597 O), op de as van de rijbaan midden tussen de twee heftorens,
op de waterspiegel van de Gouwe zoals het PDOK-terrein die legt (ellipsoïdisch
43,13 m; met NAP = ellipsoïdisch - 43,50 m op de wegen naast de brug is dat
NAP -0,37 m; z = NAP + 0,37) en de glTF-conventie Y omhoog. +X loopt langs de
brug naar het oosten, naar de Henegouwerweg (`xAxis` (0,98444, -0,17571),
-10,12 graden vanaf het oosten), +Y naar het noorden, stroomafwaarts. Het dek
loopt van x = -25,6 (het westelijke landhoofd aan de Kerkweg-Oost) tot 25,5
(het oostelijke landhoofd), 51,1 m (Wikipedia: 51 m); het val ligt tussen de
voegen op x = ±12,5, de binnenstijlen van de torens op x = ±12,6. Het maaiveld
wordt op zes punten op het water bemonsterd (`groundSamplePoints`, 14 m naast
de as op x = -8, 0 en 8); `groundOffsetMetres` is 0 en `groundHeight` 43,13 m
(de PDOK-hoogte van de Gouwe) is de terugval voor een uitsnede die alleen een
landhoofd raakt. `replacesBuildings` bevat het westelijke landhoofd (BAG-pand
0627100000017571, een betonnen landhoofd met ruimtes, in PDOK een lage plaat
op NAP -0,5 tot 0 m) en het brugwachtershuisje (BAG-pand 0627100000002866, in
PDOK een blok tot NAP +7,46 m). `replacesTerrain` bevat het BGT-dek
P0028.b2d16c6b8d754da7ba2dd43cb4a2d63e (`scripts/replaces-terrain.mjs`).

Onderdelen in het model (hoogtes in NAP):

- Het wegdek, bijna vlak: +2,70 m aan de Kerkweg-Oost, +2,76 m bij de
  torens, +2,81 m midden op het val (AHN-DSM) en +2,84 m aan de
  Henegouwerweg. Daar geeft het AHN +2,67 m, maar het PDOK-vlak van het
  oostelijke BGT-landhoofd (hoogteligging 0, blijft zichtbaar) ligt tot
  +2,78 m en stak 0,1 m door het wegdek; het dek eindigt nu 5 cm daarboven en
  0,14 m boven de PDOK-weg erachter. Het dek volgt het BGT-vlak, met het
  voetpad naar het huisje en het verbrede voetpad aan de noordoostkant.
- Het val van 25,0 m (doorvaartwijdte 25 m) in de laagste, gesloten stand:
  een rijvloer van 0,9 m (doorvaarthoogte gesloten circa 2,5 m), twee
  vakwerkhoofdliggers van 0,9 m dik op y = ±4,45 tot ±5,35 (AHN), bovenkant
  +7,2 m (AHN, 4,4 m boven het wegdek), 8 vakken van 3,125 m met stijlen en
  wisselende diagonalen, en daartussen het bovenwindverband op de hoogte van
  de bovenrand (dwarsregels bij elke stijl en een diagonaal per vak). De
  voetpaden liggen buiten de liggers (y = ±5,35 tot ±6,95, naar de
  uiteinden breder volgens de BGT). Voegen van 0,3 × 0,3 m over het dek op
  x = ±12,5.
- Twee heftorens. Elke toren heeft twee poten van 1,6 m dwars (y = ±4,6 tot
  ±6,2), elk een vlak vakwerk: een verticale binnenstijl langs het val
  (x = ±12,6 tot ±13,6) en een schuine buitenstijl van 1,0 m (buitenkant van
  x = ±23,6 op het wegdek naar ±16,9 onder de kop, 10 graden; AHN: binnenzijde
  ±12,4, voet ±23,3, kop tussen ±12,3 en ±16,8), met een voetregel, regels
  van 0,9 m op +9,0, 13,5, 18,0, 22,5, 27,1, 31,6 en 36,1 m en wisselende
  diagonalen. Tussen de poten twee vlakken met dezelfde regels en
  kruisverbanden: bij de binnenstijlen (verticaal) en bij de buitenstijlen
  (schuin), met onderin een portaal met knieschoren vanaf +6,6 m boven de
  rijbaan. Bovenop de kop van 1,3 m (+40,6 tot +41,9 m, x = ±12,25 tot ±17,2,
  12,8 m breed) met een onderkant onder 49 graden, met boven elke poot een
  kabelwiel van 2,0 m tot +43,3 m (het hoogste AHN-punt). Onder de kop het
  betonnen ballastblok tussen de poten (1,6 × 9,3 m, +32,7 tot +37,7 m), in de
  hoogste stand omdat de brug dicht is; het raakt de poten waar het in
  werkelijkheid in geleiders loopt.
- De landhoofden: het westelijke op de BAG-contour (x = -25,6 tot -12,5,
  13 m breed, met afgeronde hoeken aan de waterkant), het oostelijke op het
  BGT-landhoofd (x = 12,45 tot 25,5); beide als blok tot 5 cm onder het
  wegdek, met een dek van 0,6 m erop. Langs het westelijke landhoofd kragen de
  voetpaden (y = ±6,5 tot ±7,9) uit.
- Het brugwachtershuisje (BAG) aan de zuidkant van de oostoever: de onderbouw
  op de BAG-contour (5,8 × 6,0 m) tot +3,1 m, een achthoekige kabine van 3,8 m
  met de vensterband als nis van 0,3 m (+4,6 tot +6,0 m), een dakrand onder
  45 graden tot een straal van 2,35 m en een lage koperen koepel tot +7,4 m
  (AHN; PDOK +7,46 m), middelpunt x = 15,8, y = -10,1 (AHN en luchtfoto).

Wegdek met PDOK-attributen: op het dek liggen vijftien actuele BGT-wegdelen
met relatieve hoogteligging 1, gesplitst op x = -13,5 en 13,4:
rijbaan regionale weg (P0028.125eddb8ed5e403c92699baf8cc4f17c,
P0028.d53da91fb013498687761edfd53fd962, P0028.e699ef47c2fd40f882063158e3a186c2;
gesloten verharding, asfalt), fietspad (P0028.990108f2c46448259921e78a78e9b7be,
P0028.4b528ca668564da596a20bdcbabb38fc, P0028.776aa07d073c4d5f9693a5721f82a8b1
aan de noordkant, P0028.95a81527157a4313b9118a37fdcda3f8,
P0028.9cd8bc959629427b91a68c531966fd32, P0028.a2721c0301a645fc85f1a6826e687b5b
aan de zuidkant; gesloten verharding, asfalt), voetpad van asfalt
(P0028.7a868b7dd4d64c458e7f1ca22746c7ae, P0028.2e4bb630e8e1453aab522b29d5b5ef72,
P0028.7576d4f696734f018019c0d9ae564f1a, P0028.6700020fc1cc40d5b0f4120ad5b65f4d)
en voetpad van tegels (P0028.0a0ae7d7ae4f45048d0d5e9b27cee1c5 aan de
noordwestkant, P0028.7ad498ace4e947c282d5e083320ca174 aan de noordoostkant;
open verharding). Het model maakt daarvan de nodes `road:rijbaan`,
`road:fietspad`, `road:voetpad` en `road:voetpad-tegels` met in
`extras.attributes` `bgt_functie`, `bgt_fysiekvoorkomen` en
`plus_fysiekvoorkomen`. Elk wegdeel is de laag van 0,5 m onder het wegdek: een
snijstrook van 0,5 m onder tot 1 m boven het wegdek ∩ de BGT-vlakken (lokaal,
vereenvoudigd tot 5 cm; de uiteinden lopen door tot voorbij het dekeinde) ∩ de
brug. De vakwerkliggers, de poten van de torens en de voegen blijven met 2 cm
vrij constructie; waar de BGT geen wegdeel heeft (de strook langs het huisje,
smalle naden tussen de vlakken) blijft het dek constructie. Volumes: brug
4190 m³, constructie 3894 m³, rijbaan 155 m³, fietspad 69 m³, voetpad 62 m³,
voetpad van tegels 10 m³; samen precies de brug (het script controleert het).
De verticale-stralencontrole (77.000 punten om de 0,1 m over het hele model)
vindt geen samenvallende bovenvlakken van verschillende nodes en geen vlak
zonder dikte in een wegdeel; alleen in de torens geven de spitse hoeken waar
staven elkaar onder een kleine hoek raken stralen met een boven- en ondervlak
binnen 1 cm.

Wat er niet in zit: de leuningen met de cirkels en de naam van de brug, de
lantaarns (één oorspronkelijke), verkeerslichten, slagbomen en matrixborden,
de staalkabels, de ladders met kooi en de bordessen langs de torens, de
geleiders van het val, de railing op de kop (alle dunner dan 0,9 m), de
remmingwerken van houten palen langs het water (losse palen en gordingen van
0,3 tot 0,5 m) en de open stand van het val. Ook niet in het model: het
viaduct onder de Kerkweg-Oost aan de westkant (over de verbinding tussen
Noordkade en Zuidkade) en de lange aanbrug met gemetselde muurtjes; die horen
bij het rijksmonument, maar niet bij het BGT-brugdek. Op het viaduct heeft het
AHN-DTM geen punten, waardoor het PDOK-terrein daar tot 2,2 m onder het wegdek
zakt: aan het westelijke landhoofd staat het model een kopvlak hoger dan de
PDOK-weg erachter. De kasten halverwege de torens (aandrijving) zijn op de
foto's niet goed te onderscheiden en zijn weggelaten; de kleine kast aan de
kant van het val bij de kop ook (het AHN ziet niets voorbij x = ±12,25).

Pasvorm op het AHN: het wegdek volgt het DSM binnen 0,05 m (behalve de
verhoging aan de Henegouwerweg, zie boven), de bovenrand van de liggers
(+7,2 m) en de hoogste punten van de torens (+43,3 m) vallen op de hoogste
cellen, de torens vullen de DSM-cellen boven +8 m tussen x = ±12,4 en ±23,3
(de buitenstijl op +21 m bij x = ±20), het dak van het huisje valt op de
cellen van +7,0 tot +7,4 m.

Printbaarheid op 1:1000: de GLB toont de echte, open vorm; staven en balken
zijn minstens 0,9 m. Wat zonder steun niet print, laat het model aan de
export over: de regels, kruisverbanden en knieschoren van de torens, het
ballastblok, de onderkant van de kop, het windverband en de vlakke bovenkant
van de openingen in de liggers en de onderkant van het val. In de meettest
(`supportedSolid` op 1:1000, gedeelde opvulling) gaat het volume met
"Ondersteuning v2.0" van 4190 naar 6734 mm³ (+61 %, v1.0: 6738 mm³); de
wegdelen krijgen geen eigen opvulling (extraPct 0,00), de constructie draagt
alles. In een export van 100 × 100 m op 1:1000 is het landmark 4,1 cm³ en de
ondersteuning 2,5 cm³ (73 s); de opvulling zet het inwendige van de torens
grotendeels dicht. De STL, die zonder export wordt geprint, heeft een
printvorm: elke toren als dicht lichaam tussen de vier vlakken met een spitse
doorgang van 55 graden voor de rijbaan en de openingen van het vakwerk als
nissen van 0,35 m op de zijvlakken van de poten en op beide eindvlakken, de
liggers als dichte platen met nissen aan de buitenkant, zonder windverband en
ballastblok, de landhoofden over de hele breedte van het dek tot het printbed,
en onder het val een wig van 50 graden met een scherm tot het printbed
(8,8 cm³ in totaal).

Bronnen: [Rijksmonumentenregister 512003](https://monumentenregister.cultureelerfgoed.nl/monumenten/512003)
(geklonken stalen hefbrug met brugwachtershuisje uit 1935-1936, De Vries
Robbé & Co. Gorinchem; twee konisch toelopende heftorens van open geklonken
vakwerk; het val met rijvloer, twee vakwerkhoofdliggers en een
bovenwindverband; betonnen ballastblokken in de torens, via kabelwielen
bovenin aan het val; doorvaartwijdte 25 m, 9 m tussen de leuningen,
doorvaarthoogte gesloten 2,5 m en geopend 35 m; betonnen landhoofden met gele
baksteen; betonnen veelhoekig brugwachtershuisje onder koperen dak aan de
zuidzijde), [Wikipedia](https://nl.wikipedia.org/wiki/Hefbrug_Waddinxveen)
(lengte 51 m, breedte 9 m, hoogte 45 m, hefdeel van 100 ton, ballastblok van
60 ton, renovatie 2012 met voetpaden langs het val en fietsstroken), PDOK BGT
(overbruggingsdeel P0028.b2d16c6b8d754da7ba2dd43cb4a2d63e voor het dek,
P0028.ce75b06875de44c090e30e83ec1dbcf7 voor het oostelijke landhoofd; de
wegdelen hierboven), PDOK BAG (panden 0627100000017571 en 0627100000002866),
PDOK AHN (dsm en dtm 0,5 m via WCS: wegdek, liggers, torens, huisje), de
PDOK-luchtfoto (8 cm: windverband, kop, dak van het huisje), het PDOK-terrein
(waterspiegel, aansluitende wegen) en Wikimedia Commons-foto's (200518 Hefbrug
Waddinxveen (2), (3), (7), (8), (9), (10) en (11); 200307 Hefbrug Waddinxveen -
Geopend; 120901 Hefbrug Waddinxveen - Heftorens en - Feestelijke heropening na
renovatie; 2004010 Hefbrug Waddinxveen - Brugwachtershuisje met matrixbord;
Detail hefbrug met veelhoekig bedieningshuis met koperen dak - Waddinxveen -
20375886 - RCE; Val van de Waddinxveen hefbrug te Waddinxveen - Rijksmonument
(22714876091); Hefbrug Waddinxveen - panoramio; HefbrugWveen; Waddixveen,
hefbrug Waddixveen RM512003 IMG 0472 2019-07-01 15.54) voor het vakwerk van de
torens, het val, de kop met de wielen, het ballastblok en het huisje. Geschat
zijn de doorsnede van de poten (1,6 m dwars) en de staven (0,9 tot 1,0 m), de
hoogtes van de regels (om de 4,5 m) en het patroon van de diagonalen en
kruisverbanden, het portaal, het ballastblok (+32,7 tot +37,7 m, 1,6 m dik,
uit foto's van de gesloten brug), de kop (1,3 m) en de wielen (2,0 m), de
constructiehoogte van het val (0,9 m) en van de dekken op de landhoofden
(0,6 m), de vakverdeling van de liggers (8 vakken) en het windverband, en de
vorm van het brugwachtershuisje (achthoekige kabine, vensterband, dakrand);
de waterspiegel is die van het PDOK-terrein (NAP -0,37 m).

Licentie van het model: eigen werk op basis van open bronnen.
