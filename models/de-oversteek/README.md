# De Oversteek (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `de-oversteek.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het dek met BGT-attributen) en `building:de-oversteek` met de rest van het dek, de netwerkboog met de twee poten aan elk einde, de hangers als staand scherm op de as, de twee rivierpijlers, de 21 aanbrugoverspanningen met spitse bogen op elliptische kegelkolommen, de verbredingen van het fietspad, de lifttoren en de twee landhoofden |
| `de-oversteek-1-3500.stl` | De brug in één stuk op 1:3500 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (366 × 34 × 21 mm; met `--scale` een andere schaal, op 1:1000 is hij 1281 mm lang) |
| `de-oversteek.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (186278,14, 430048,05), op de as
van het dek midden tussen de twee rivierpijlers, op de waterspiegel van de
Waal zoals het PDOK-terrein die legt (NAP +7,2 m) en de glTF-conventie Y
omhoog. +X loopt langs de rechte hoofdoverspanning naar het noorden, naar Lent
(`xAxis` (0,39227, 0,91985), 66,9 graden linksom vanaf het oosten), +Y
stroomafwaarts naar het westnoordwesten. Het dek is alleen tussen x = -296 en
x = 333 recht; daarbuiten buigt het naar rechts, aan de zuidkant tot 11 m en
aan de noordkant tot 85 m naast de rechte as (BGT-westrand, een
overgangsboog en een bocht met een straal van circa 800 m). Het script bouwt
het dek en de aanbruggen daarom in een stelsel (u, v) langs die as en zet de
hoekpunten pas aan het eind om. Het zuidelijke landhoofd aan de Weurtseweg
ligt op de as op x = -420 tot -413, de rivierpijlers op x = -148 tot -137 en
137 tot 148 en het noordelijke landhoofd aan de dijk bij Lent op x = 814 tot
843. Het maaiveld wordt op tien punten op het water bemonsterd
(`groundSamplePoints`: zes 32 m naast de hoofdoverspanning op x = -60, 0 en
60, vier 35 m naast de noordelijke aanbrug op de Spiegelwaal);
`groundOffsetMetres` is 0, want het PDOK-terrein legt beide op NAP +7,2 m
(ellipsoïdisch 50,81 tot 50,91 m). `groundHeight` is 50,81 m, de laagste
PDOK-hoogte op die punten, zodat een uitsnede die alleen een aanbrug raakt
het model niet laat wegvallen. Geen BAG-pand onder de brug (het pandje van
3 × 3 m onder de zuidelijke aanbrug, `NL.IMBAG.Pand.0268100000105922`, ligt
plat op het maaiveld onder het dek en blijft staan).

Onderdelen in het model (hoogtes in NAP):

- Het dek van 25,1 m breed (BGT), 1275 m langs de as van einde tot einde,
  met het wegdek volgens het AHN-DSM om de 4 m: +19,5 m bij de Weurtseweg,
  +25,75 m bij de rivierpijlers, +26,36 m in het midden, +24,9 m bij de
  noordelijke steunlijnen van de uiterwaard, +22,0 m bij het noordelijke
  landhoofd en +19,7 m op het einde. Over de rivier een stalen kokerdek van
  3,5 m (onderkant +22,9 m in het midden, doorvaarthoogte volgens Wikipedia
  14,5 m boven de waterspiegel); de uiteinden van het dek zijn scheef
  (BGT).
- De boog: één stalen koker boven de as van het dek, 4,4 m breed, met
  zijwanden van 1,6 m en een onderkant als V van 50 graden (4,2 m hoog). De
  bovenkant is een parabool met de top op +81,0 m (het hoogste punt, 73,8 m
  boven het water) die bij x = ±110 op +52,5 m ligt (AHN, bovenste
  DSM-cellen). Bij x = ±108 (+53,5 m) splitst de boog als een omgekeerde Y in
  twee poten die schuin naar de randen van het dek lopen en 10,7 m naast de as
  op het dek staan, op x = -134,0 en -139,0 (zuid) en 134,0 en 139,0 (noord):
  6 m binnen de steunlijn van de rivierpijler en net als die 13 graden scheef
  (AHN). De poten worden naar beneden smaller (3,4 m) en lopen met een gebogen
  bovenkant naar het dek.
- De kruisende hangers (netwerkboog) als één staand scherm van 1,1 m dik op
  de as onder de boog, zoals bij de Waalbrug: stijlen van 1 m langs de hangers
  (twee families onder 68 graden, ankers om de 18 m, circa dertig hangers) met
  27 doorgaande ruitvormige openingen met zijden van 68 graden, tot 0,3 m onder
  de zichtbare onderkant van de boog; waar een ruit niet meer past is hij
  verkleind of weggelaten, zodat het scherm bij de uiteinden dicht is. Het
  scherm loopt tot x = ±110, waar de twee poten nog boven de as liggen;
  daarbuiten is de ruimte tussen de poten open. In werkelijkheid lopen de
  kabels als twee schuine vlakken van de boog naar de randen van de rijbaan
  (oostkant tussen fietspad en rijbaan, westkant langs de rand van de
  rijbaan); zie printbaarheid waarom ze hier op de as staan.
- De twee rivierpijlers als gebogen lenzen van 37,5 m dwars op de brug en 4,6
  tot 7 m dik (BGT), naar boven iets smaller, tot onder het kokerdek.
- De aanbruggen: vijf overspanningen aan de zuidkant (steunlijnen op
  x = -360,3, -317,0, -273,4, -229,8 en -185,0, BGT) en zestien aan de
  noordkant (186,1 en 229,7 uit de BGT, daarna gelijke velden van 42,3 m tot
  het landhoofd op 821,9 langs de as). Onder het dek spitse ellipsbogen met
  de kruin 1,6 m en de aanzet 7,0 m onder het wegdek; op elke steunlijn twee
  afgeknotte elliptische kegels 10,1 m naast de as, 1,4 × 3,8 m onder de
  aanzet en per meter lager 0,12 m breder en 0,36 m langer (BGT op het
  maaiveld 2,0 × 5,6 m). Alle steunlijnen staan evenwijdig aan de stroming,
  13 graden scheef op de rechte as (BGT); in de bochten draaien ze mee.
- Negen verbredingen van het fietspad aan de oostkant (BGT, 2 tot 4,5 m
  breed) als balkons op dekhoogte met een console van 50 graden eronder; in de
  twee grootste (x = -274 tot -190 aan de Waalkade en 274 tot 355 naar de
  uiterwaard) liggen in werkelijkheid trappen naar het maaiveld.
- De lifttoren aan de Waalkade (3,4 × 3,4 m, tot +30,0 m, AHN) naast de
  zuidelijke trap.
- De landhoofden als blokken tot het wegdek: het zuidelijke evenwijdig aan
  het scheve einde van het dek langs de Weurtseweg, het noordelijke vanaf de
  laatste steunlijn tot het einde van het dek.
- Het wegdek als twee eigen nodes van klasse `road`, de bovenste 0,5 m van
  het dek en de verbredingen, met de attributen van het BGT-wegdeel eronder
  in `extras.attributes`, zodat de kleurregels van een thema (fietspaden
  rood) op de brug werken zoals op de PDOK-wegdelen ernaast:
  - `road:rijbaan`: `bgt_functie` rijbaan regionale weg,
    `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt;
    de rest van het dek (BGT-wegdelen G0268.492db63d5e3f4433b063ea03df154333,
    G0268.2ba309144941480c963844a194e08395,
    G0268.233bb3d93c35480081dceb3a596f028a en
    G0268.7da79ca211e7476aa48510d74f933409, relatieve hoogteligging 1);
  - `road:fietspad`: `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten
    verharding, `plus_fysiekvoorkomen` asfalt; de BGT-vlakken
    G0268.d3a98e379bb54be18db26f791919f440 (zuidelijk landhoofd),
    G0268.52fd9ca17a62413d8d4638a8ed068cbc (zuidelijke aanbrug tot het
    boogmidden), G0268.339b8df6578e48dd85e3c89120a056df (boogmidden tot
    x = 621) en G0268.10a412a369314a168d1d5c8c6b8623f8 (de bocht naar Lent),
    in lokale coördinaten vereenvoudigd tot 5 cm: het tweerichtingsfietspad
    van circa 4 m aan de oostkant met alle verbredingen. Omdat de BGT-rand
    van het fietspad niet precies op de rand van het dek en de verbredingen
    van het model (uit het overbruggingsdeel) valt, hoort langs de oostrand
    alles buiten 12,2 m van de as bij het fietspad; zo blijven er geen reepjes
    rijbaan langs de rand over.

  Het dek heeft geen schampkanten. De snijstrook loopt over dezelfde rijen en
  kolommen als het dek van 0,5 m onder tot 1 m boven het wegdek; de vier
  poten van de boog (hun voetafdruk boven het wegdek), het hele hangerscherm
  op de as en de lifttoren blijven met 2 cm vrij constructie, zodat de
  rijbaan om het scherm en de poten heen ligt. De constructie houdt binnen de
  wegdelen op 0,5 m onder het wegdek op; de volumes van de drie nodes tellen
  op tot dat van de brug als geheel (125 373 m³: constructie 109 132,
  rijbaan 13 401, fietspad 2 840 m³). Geen samenvallende bovenvlakken
  (verticale stralen over het hele model). De STL is ongewijzigd.

Wat er niet in zit: de toeritten op een dijklichaam achter de landhoofden
(die zitten in het PDOK-terrein), de trappen zelf in de twee grote
verbredingen (als balkon op dekhoogte; de bordessen liggen volgens het DSM 4
tot 7 m onder het wegdek), leuningen en glazen windschermen, de 48
lichtmasten, de hangerankers op het dek en de dwarsdragers onder het
kokerdek; alle kleiner dan 0,9 m of glas. De hangers zelf zijn kabels van
circa 0,1 m en zitten alleen als scherm op de as in het model, niet als twee
schuine vlakken naar de randen van de rijbaan.

Binnen het dek (25 m brede strook, AHN-DSM 0,5 m) ligt 87 % van de cellen
binnen 1 m van het wegdek van het model (89 % binnen 2 m, mediaan +0,06 m);
over de aanbruggen 89 %, over de hoofdoverspanning 79 %, waar het DSM de
hangers, poten en lichtmasten ziet. De bovenrand van de boog ligt voor
|x| < 110 binnen circa 2 m van de bovenste DSM-cellen; in de top is het DSM
dun bezet (het hoogste punt +81,8 m). De schaduw van de boog op de luchtfoto
geeft een top van circa +79 m.

Printbaarheid op 1:1000: de hangers (kabels) zijn niet te printen; ze zijn
één staand scherm van 1,1 m met stijlen van 1 m en doorgaande ruitvormige
openingen met een spitse top (zijden van 68 graden). Eerst waren het twee
schuine schermen op de echte plaats, van de boog naar de randen van de
rijbaan. Met doorgaande openingen liep de overhangopvulling van de export
daarin vast (een uitsnede van 400 m rond de boog op 1:1000 vulde na 2 tot 3
minuten het geheugen van de WASM-module, 4 GB; met ankers om de 36 m 107 s,
met een scherm van 1,6 m 64 s), en met blinde nissen lazen ze op de kaart als
een massieve tent onder de boog, terwijl de brug op foto's juist open is. Het
staande scherm op de as houdt de brug open en print snel; de prijs is dat de
hangers op het dek in de middenberm staan in plaats van aan de randen van de
rijbaan. De boog heeft een V-onderkant van 50 graden en rust tot x = ±110 op
het scherm; de poten hangen met hun V-onderkant nergens steiler dan 45
graden, alleen hun onderste rib loopt flauwer dan 45 graden. Vrij hangen alleen de onderkant van het
kokerdek, de bogen van de aanbruggen en de consoles van de verbredingen
(samen circa 31 000 m²); de STL heeft daaronder een printvoet (een wig van
50 graden vanaf de randen van het dek die uitloopt in een scherm van 0,9 m
tot de onderplaat, de bovenkant volgt de bogen), waarna in de printversie
7,9 m² aan kleine schuine facetten bij het zuidelijke landhoofd overblijft.
Met 1281 m past de brug op 1:1000 niet in één uitsnede. In de export
(printcheck, gesloten solid met overhangopvulling, status NoError voor alle
drie de onderdelen; de opvulling gaat naar de constructie, rijbaan en
fietspad krijgen niets extra): een uitsnede van 400 × 400 m rond de boog op
1:1000 in 31 s (samen 94,7 naar 117,5 cm³, +24 %; constructie 89,3 naar
112,1 cm³, rijbaan 4,5 en fietspad 0,9 cm³ zonder opvulling; de openingen in
het scherm blijven open), een uitsnede van 400 × 400 m over de noordelijke
aanbrug en de Spiegelwaal op 1:1000 in 24 s (samen 34,8 naar 100,9 cm³,
+190 %: onder de spitse bogen komen wiggen met een scherm tot de
onderplaat; rijbaan 4,8 en fietspad 1,1 cm³ zonder opvulling) en de hele
brug in één uitsnede op 1:2921 in 25 s (constructie +31 %, wegdelen 0 %). Het PDOK-terrein ligt op het water
op de waterspiegel van het model; onder de aanbruggen ligt het maaiveld 4 tot
8 m onder de aanzet van de bogen (in de uiterwaard NAP +9 tot +11,7 m). Aan
het noordeinde sluit het dek binnen 0,5 m op de PDOK-weg op de dijk aan; aan
het zuideinde ligt de PDOK-toerit 4,6 m lager dan het wegdek, zodat daar het
kopvlak van het landhoofd zichtbaar is.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/De_Oversteek_(brug))
(2013, Ney & Poulissen, lengte 1195 m, overspanning 285 m, hoogte 60 m,
breedte 25 tot 32,5 m, doorvaarthoogte 14,5 m, twintig bogen van 42,5 m,
zuidelijke aanbrug 230 m, noordelijke 680 m, 48 lichtpunten), PDOK BGT
(overbruggingsdeel: dek, verbredingen, rivierpijlers, kolomparen; wegdeel:
rijbaan en fietspad op het dek), PDOK AHN
(dsm en dtm 0,5 m via WCS: as en lengteprofiel van het dek, boog, splitsing en
landing van de poten, trappen, lifttoren), PDOK luchtfoto (kolommen in de
uiterwaard, verbredingen, schaduw van de boog), het PDOK-terrein (waterspiegel)
en Wikimedia Commons-foto's (Nijmegen, de Oversteek IMG 3245 2020-03-17
10.58.jpg; De Oversteek 01.jpg; De Oversteek 02.jpg; Waal river crossing
bridge "de oversteek" at Nijmegen, as seen from the North-East en
North-West - panoramio.jpg; Nijmegen - Waal - De Oversteek
(26223244138).jpg; Spiegelwaal 05 met brug De Oversteek.JPG; Brug De
Oversteek vanaf Stadseiland Nijmegen gezien.JPG) voor de Y-vorm van de boog,
de hangers, de spitse bogen en de kegelkolommen. Geschat zijn de doorsnede
van de boog en de poten (4,4 en 3,4 m breed, 4,2 m hoog), de top van de boog
(AHN +81,0 m; de schaduw wijst op circa +79 m), de constructiehoogte van het
kokerdek (3,5 m), de diepte van de aanbrugbogen (kruin 1,6 m, aanzet 7,0 m
onder het wegdek, op foto's 6,3 tot 7,9 m), de maten van de kegelkolommen, de
plaats van de noordelijke steunlijnen na x = 230 (gelijke velden van 42,3 m;
de luchtfoto wijkt tot 5 m af), de scheefstand van de steunlijnen in de
bochten, het zuidelijke landhoofd (8 m vóór het scheve einde van het dek), het
hangerpatroon (ankers om de 18 m, 68 graden); de waterspiegel is de PDOK-
waarde van NAP +7,2 m, die met de rivierstand meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
