# Wilhelminabrug (Deventer)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `wilhelminabrug-deventer.glb` | Catalogusbron in meters, zeven nodes: `building:wilhelminabrug-deventer` met de stalen aanbrug (hoofdliggers, consoles), de boogbrug (ribben met hangerscherm, portalen, windverband), de pijlers met opleggingen, de scheve oostelijke rivierpijler met de trapkoppen, de betonnen aanbrug met kolommen, de landhoofden en de toerit; `road:rijbaan` (`bgt_functie` rijbaan lokale weg, `plus_fysiekvoorkomen` asfalt), `road:fietspad` en `road:voetpad` (over de stalen brug, zonder materiaal), `road:fietspad-aanbrug` en `road:voetpad-aanbrug` (over de betonnen aanbrug, asfalt) en `road:trap` (`bgt_functie` voetpad op trap), alle met `bgt_fysiekvoorkomen` gesloten verharding: de bovenste 0,5 m van het wegdek en van de trappen met de attributen van het BGT-wegdeel eronder |
| `wilhelminabrug-deventer-1-1600.stl` | De brug in één stuk (alle zeven nodes samen) op 1:1600 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (391 × 25 × 19 mm) |
| `wilhelminabrug-deventer.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De Wilhelminabrug is de verkeersbrug (N344) over de IJssel tussen De Worp
(west) en de binnenstad van Deventer (oost), gebouwd van 1939 tot 1943, in
april 1945 opgeblazen en in 1948 volgens het oorspronkelijke ontwerp
herbouwd: een stalen boogbrug met natuurstenen rivierpijlers, een stalen
aanbrug over de uiterwaard en aan de stadskant een betonnen toerit op
modern vormgegeven pijlers boven de gedempte rivierhaven (met de
parkeergarage eronder, die niet in BAG of PDOK staat).

De GLB is in meters met de oorsprong op RD (207635,67, 473734,91), op de as
tussen de twee hoofdliggers midden tussen de opleggingen van de boog, op de
waterspiegel van de IJssel zoals het PDOK-terrein die legt (46,36 m
ellipsoïdisch, NAP +3,08 m; NAP = ellipsoïdisch - 43,28 m op het maaiveld
eromheen) en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
oostnoordoosten, naar de binnenstad (`xAxis` (0,82254, 0,56871), 34,66 graden
linksom vanaf het oosten, langs de randen van het BGT-dek), +Y stroomafwaarts
naar het noordnoordwesten. Vanaf x = 66,25 buigt de betonnen aanbrug met een
straal van 1300 m naar rechts af (naar -Y), zoals de randen van het BGT-dek
(restfout 0,3 m²); het script bouwt alles recht en buigt het aan het eind
(`Manifold.warp`). Het westelijke landhoofd ligt op x = -351,55 tot -340,35,
de aanbrugpijlers op x = -301,75, -261,65, -221,65, -181,7 en -141,8, de
westelijke rivierpijler op x = -60,5, de opleggingen van de boog op x = ±60,5,
de oostelijke rivierpijler aan de Welle op x = 51,9 tot 70,8 (scheef), het
einde van het BGT-dek op x = 233,45 en het einde van de toerit op x = 274,35
(langs de boog; aan het eind ligt de as 16,4 m zuidelijker dan de rechte
lijn). Het maaiveld wordt op twaalf punten alleen op het water bemonsterd
(`groundSamplePoints`): op de nevengeul (x = -241,25 en -201,25) en de IJssel
(x = -46,25, -21,25, 18,75 en 38,75), telkens 15 m ten zuiden van de zuidrand
(y = -24,425) en 11,2 m ten noorden van de noordrand van het dek
(y = 20,575); het PDOK-terrein legt daar 46,36 tot 46,47 m.
`groundOffsetMetres` is 0 en `groundHeight` 46,36 m (de nevengeul), zodat een
uitsnede die alleen een aanbrug raakt het model niet op de uiterwaard (NAP
+3,5 tot +4,5 m) of de kade (+7,5 m) laat zakken. Geen `replacesBuildings`:
het enige BAG-pand onder het model (0150100000059728, 1975, onder de
betonnen aanbrug) blijft in PDOK onder het dek (tot NAP +10,0 m, het dek
ligt daar op +12,6 m). Het hart van de boog ligt op 52,24914 N, 6,15798 O;
de controle-URL valt 51 m westelijker, bij de westelijke rivierpijler.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek volgens het AHN-DSM om de 5 m langs de (gebogen) as: +10,29 m
  aan het westelijke landhoofd (aansluitend op het PDOK-wegdek op de dijk,
  +10,22 m), +16,14 m onder de boog, +11,5 m aan het einde van het BGT-dek en
  +10,7 m aan het einde van de toerit. Het dek is 18,8 m breed (BGT).
- De stalen aanbrug en het dek van de boogbrug (x = -351,55 tot 63,65): twee
  doorgaande volwandige hoofdliggers op t = 4,4 en 14,45 m (AHN; 10,05 m uit
  elkaar, 1,0 m breed, de BGT-wegdelen laten er een strook voor vrij), met de
  bovenkant 1,0 m boven het wegdek (AHN) en de onderkant 2,4 m eronder (uit de
  doorvaarthoogte NAP +13,73 m); ertussen de rijvloer, erbuiten fietspad en
  voetpad op consoles van 0,7 m aan de rand die naar de onderkant van de ligger
  aflopen.
- De aanbrugpijlers (BGT): twee wandpijlers met ronde koppen (x = -301,75 en
  -141,8; 2,8 en 2,7 m dik, binnen de dekbreedte) en drie brede pijlers met
  ronde koppen in de nevengeul (8,9 × 28,8 m, tot 4,9 m buiten de dekranden).
  Het metselwerk houdt 1,6 m onder de liggers op; daarop onder elke ligger een
  betonnen oplegging van 1,6 × 1,8 m.
- De westelijke rivierpijler (BGT, 5,1 × 20,1 m met ronde koppen): metselwerk
  tot +11,0 m, een betonnen kap 0,3 m terug tot +12,6 m (AHN) en de
  opleggingen.
- De boogbrug van 121 m tussen de opleggingen: twee verticale boogribben van
  1,0 m breed op de hoofdliggers (AHN). De bovenrand is een parabool met de
  top op +33,3 m bij x = 0 (AHN, bovenomhullende van de DSM-cellen in de
  strook van elke rib), die bij x = ±58,9 de bovenkant van de ligger raakt;
  de rib is 1,6 m hoog. Vijftien velden van 8,07 m met een verticale hanger op
  elke knoop: tussen ligger en rib elf doorgaande openingen met een spitse top
  van 55 graden (de hangers als stijlen van 1,0 m; in de twee buitenste velden
  aan elke kant is de ruimte te laag). Portalen op de tweede knoop van elk
  eind (x = ±44,37): een dwarsregel onder de rib met een V-onderkant en
  knieschoren met een onderkant van 50 graden tegen de hangers, vrije hoogte
  5,8 m boven het wegdek. Het windverband tussen de toppen van de ribben van
  portaal tot portaal: twaalf dwarsstijlen op de knopen en twintig diagonalen
  over twee velden, zodat ruiten ontstaan zoals op de luchtfoto (32 staven
  van 0,9 m met een V-onderkant van 50 graden).
- De oostelijke rivierpijler aan de Welle (BGT, vereenvoudigd tot 15 cm):
  scheef op de brug (evenwijdig aan de stroming, 10,4 m dik), binnen de
  dekbreedte tot in het dek; op de koppen buiten de dekranden de twee trappen
  (AHN, BGT voetpad op trap): aan de noordkant van het wegdek bij x = 59,75
  dalend naar het westen tot een bordes op +12,2 m, aan de zuidkant van het
  wegdek bij x = 62,75 dalend naar het oosten tot een bordes op +12,9 m.
- De betonnen aanbrug (x = 63,65 tot 233,45, gebogen): een dekplaat van 0,9 m
  met een middenkoker tot 1,6 m onder het wegdek, op de plaats van de liggers
  lage scheidingen van 0,3 m tussen rijbaan en fietspaden (AHN), op acht ronde
  kolommen van 3 m met een kegelvormig kapiteel (49 graden, tot 2,7 m straal):
  drie uit de BGT (x = 77,53, 97,67 en 218,7), vijf daartussen op gelijke
  velden van 20,17 m.
- Het oostelijke landhoofd en de gesloten toerit tussen keermuren erachter
  (x = 233,45 tot 274,35, AHN: het wegdek ligt daar nog 4 tot 5 m boven het
  maaiveld), als blok tot het wegdek.
- Het wegdek als eigen onderdelen met PDOK-attributen (glTF
  `extras.attributes`), zodat de kleurregels van een thema (bijvoorbeeld
  fietspaden rood) op het brugdek werken zoals op de PDOK-wegdelen ernaast.
  Bron: de actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek, alle
  gesloten verharding. Over de stalen brug: de rijbaan (rijbaan lokale weg,
  asfalt; `G0150.5256211195af4e75b107c0645ef68828`,
  `G0150.71274d185de04a46af6e6eeec57083ca`,
  `G0150.00212fc6d9ed4122bc69fe5e5d628d8b`,
  `G0150.be13d1f35f30435095ff006379e521ed`,
  `G0150.c63171d7dbb440dea176d9797715d980`) tussen de liggers, de fietspaden
  (`G0150.ad8d20b40a064ccebf7e4ff4767f2d3c`,
  `G0150.723fca6c2af64d51afdec4668eb13d13`,
  `G0150.c61b0851c3554b28b0d5fce7ba6d53c7`,
  `G0150.6be8b84579074724bf2978ce0df92433`,
  `G0150.f3230c8a4de149a39e36c37911042b25`,
  `G0150.3d99295c9a634bf8ab6659e106bdf603`) en voetpaden
  (`G0150.30863e44e8a94338b0f7044da19977df`,
  `G0150.fae9f4c7c55c4f368b7a82474fb2cffc`,
  `G0150.603bc96e3dee41b9b8709c006693545b`,
  `G0150.b35b0c79d1124143a4dcd764414bf9c0`,
  `G0150.4d8f5f7abca74feaaee9474b04ca7d82`,
  `G0150.2d3deb4a612a475ebf3ac239ae3f809e`) zonder materiaal erbuiten. Over de
  betonnen aanbrug in het gebogen stelsel dezelfde indeling, alle met asfalt:
  rijbaan `G0150.7f65b23145c04ded98df9530f5ff09f3` en
  `G0150.1edbbe060dc64d49a5910dd79a86eaa6`, fietspad
  `G0150.1ce0f76c43214f15b098e3cba774551a` en
  `G0150.9d792d4b6749435fb08325d521387baf`, voetpad
  `G0150.66255cb6ea054c449937e1aa40934eb5` en
  `G0150.4652ad000ced4302bb377cf294f7c363`. Op de trappen voetpad op trap
  `L0002.d25a52d628d94496a070a9111ed08214` (noord) en
  `L0002.614bb539db8f4a518705e7f631106c11` (zuid). De grenzen volgen de
  constructie: de rijbaan tussen de liggers of scheidingen, de fietspaden tot
  1,45 m van de dekranden, de voetpaden langs de randen; het landhoofd en de
  toerit horen bij dezelfde nodes. De hoofdliggers met de ribben en het
  hangerscherm (de hele strook van de ligger) en de scheidingen blijven
  constructie, met 2 cm vrij; langs de trappen loopt de strook van het dek
  0,3 m over de trapkop door. De wegdeklaag is gesneden met een strook van
  0,5 m onder tot 1 m boven het wegdek over dezelfde loftstations als het dek;
  de constructie houdt zo nergens een vlak op het wegdek over. De zeven nodes
  tellen samen op tot het volume van de brug als geheel (40 201 m³:
  constructie 34 902, rijbaan 2 837, fietspad 1 019, voetpad 582,
  fietspad-aanbrug 537, voetpad-aanbrug 294, trap 25 m³); de STL bevat de brug
  als geheel.

Wat er niet in zit: leuningen, lantaarns en de lampen aan de boog (dunner dan
0,9 m); de onderhoudsbordessen en steigers onder het dek bij de westelijke
rivierpijler (stalen vakwerk van dunne staven); de afzonderlijke treden van de
trappen (dichte hellingen); de doorgang langs de kade door de oostelijke
rivierpijler; de kruisverbanden en dwarsdragers onder het dek (dichte
rijvloer); de parkeergarage onder de betonnen aanbrug (staat niet in BAG of
PDOK). De PDOK-reconstructie (`?landmarks=0`) heeft van de brug alleen een
vlakke wegstrook op dekhoogte over de stalen brug; over de betonnen aanbrug
ligt het PDOK-wegdek op het maaiveld en ontbreekt het dek helemaal.

Binnen de rijbaan (t = 5,2 tot 13,6 m, zonder de boog; AHN-DSM 0,5 m) ligt
99,3 % van de cellen binnen 1 m van het wegdek van het model (mediaan
+0,02 m). De ribben zijn in het DSM dun bezet: de hoogste cel per doorsnede
van 2 m ligt mediaan 1,9 m onder de bovenrand van het model (35 % binnen 1 m);
de parabool volgt de bovenomhullende (top +33,33 m in het DSM).

Printbaarheid op 1:1000: de hangers zijn niet als staven te printen; de ribben
zijn platen met doorgaande openingen met een spitse top (55 graden). De staven
van het windverband en de dwarsregels van de portalen hebben een V-onderkant
van 50 graden, de knieschoren een onderkant van 50 graden en de kapitelen van
de kolommen 49 graden. Vrij hangen de onderkant van het dek en de consoles
(10 601 m² in het model); de STL heeft daaronder een printvoet (een wig van 50
graden vanaf de randen die uitloopt in een scherm van 1,28 m tot de
onderplaat), waarna 0,3 m² aan kleine facetten overblijft. In de export
(printcheck, gesloten solid met overhangopvulling, status NoError voor alle
zeven nodes): de boog met de aangrenzende velden in een uitsnede van 190 m op
1:1000 in 51 s, de constructie -4,5 %, de wegdelen 0 tot 0,1 %; het hele model
past niet in 400 mm en gaat op 1:1406 (530 m, 15 s): de constructie 27,8 naar
34,2 cm³ (+23,1 %), alle wegdelen 0 %. Op die schaal zijn de ribben en hangers
(1,0 m) smaller dan 0,8 mm en vult de export de hangeropeningen dicht; op
1:1000 blijven ze open. Geen samenvallende vlakken tussen nodes (verticale
stralen op 30 000 punten over het wegdek en 60 000 over het hele model;
alleen langs de zijvlakken van het gebogen dek raakten drie stralen precies
een rand).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Wilhelminabrug_(Deventer))
(boogbrug, bouw 1939 tot 1943, herbouw 1948, natuurstenen landhoofden en
rivierpijlers, betonnen pijlers onder de toerit aan de stadskant,
doorvaarthoogte NAP +13,73 m in het midden), PDOK BGT (overbruggingsdeel: dek,
landhoofd, pijlers, kolommen; wegdeel: rijbaan, fietspad, voetpad, voetpad op
trap), PDOK BAG (pand 0150100000059728), PDOK AHN (dsm en dtm 0,5 m via WCS:
wegdek, hoofdliggers, boogribben, trappen, westelijke rivierpijler, toerit),
PDOK luchtfoto (Actueel_orthoHR: windverband, portalen, trapkoppen) en
Wikimedia Commons-foto's (Wilhelminabrug Deventer.jpg, Wilhelminabrug Deventer
2019.jpg, Wilhelminabrug Deventer, 2024.jpg, Wilhelminabrug - Deventer.jpg,
Deventer-Bridge.jpg, Deventer-Bridge-Structure.jpg, Deventer, de
Wilhelminabrug foto14 2013-08-01 12.58.jpg, Wilhelminabrugdeven.jpg, Molen
Bolwerksmolen Wilhelminabrug.jpg, Onderzijde van N344 over de uiterwaard -
Deventer - 20430074 - RCE.jpg, Detail van onderzijde van N344 over de
uiterwaard - Deventer - 20430073 - RCE.jpg). Geschat zijn de
constructiehoogte van het stalen dek (2,4 m, uit de doorvaarthoogte), de
consoles (0,7 m aan de rand), de ribhoogte (1,6 m), het aantal velden (15,
geteld op foto's), de vorm van de portalen (dwarsregel met knieschoren), de
hoogte van het metselwerk en de opleggingen van de aanbrugpijlers (1,6 m onder
de liggers), de kap van de westelijke rivierpijler (+11,0 tot +12,6 m), de
bovenkant van de oostelijke rivierpijler (in het dek), de doorsnede van de
betonnen aanbrug (plaat 0,9 m, koker 1,6 m), de vijf kolommen tussen x = 97,7
en 218,7 (niet in de BGT), de kapitelen, de breedte van de toerit (als het
dek) en de bocht (straal 1300 m vanaf x = 66,25, gefit op de BGT-dekranden).

Licentie van het model: eigen werk op basis van open bronnen.
