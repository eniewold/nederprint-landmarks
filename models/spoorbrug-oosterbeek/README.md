# Spoorbrug Oosterbeek (Oosterbeek)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `spoorbrug-oosterbeek.glb` | Catalogusbron in meters met drie nodes: `road:spoor`, de bovenste 0,5 m van het dek op de twaalf BGT-wegdelen van de stalen brug van 1952 (spoorbaan), met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` gesloten verharding; `road:spoor-ballastbed`, idem op de twee BGT-wegdelen van het zuidelijke landhoofd en de aanbrug van 2004, met `bgt_fysiekvoorkomen` half verhard; en `building:spoorbrug-oosterbeek` met de rest van het kunstwerk: de stalen boogbrug met twee vakwerkbogen, windverband en hangers, de zes vakwerkaanbruggen van 1952, de aanbrug van 2004 op twee vakwerken, de pijlers en de landhoofden |
| `spoorbrug-oosterbeek-1-2500.stl` | De hele brug (constructie en spoor samen) op 1:2500 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (344,7 × 8,8 × 16,6 mm) |
| `spoorbrug-oosterbeek.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (187103,53, 442490,13) (WGS84
51,96990 N, 5,85438 O), op de as van het dek midden tussen de twee
rivierpijlers van de boog, op de waterspiegel van de Nederrijn zoals het
PDOK-terrein die legt (NAP +8,25 m) en de glTF-conventie Y omhoog. +X loopt
langs de brug naar het noordnoordoosten, naar Oosterbeek (`xAxis` (0,351617,
0,936144), 69,41 graden linksom vanaf het oosten), +Y stroomafwaarts naar het
westnoordwesten. Het zuidelijke landhoofd begint op x = -144,7, de
rivierpijlers van de boog liggen op x = -69,5 tot -63,1 (zuidoever, Arnhem-Zuid)
en 63,3 tot 69,4, de eindstijlen van de boog op x = ±66,3, de vier pijlers van
de noordelijke aanbruggen van 1952 op x = 125,0, 182,6, 240,2 en 297,7, de
overgangspijler met bordes op x = 352,7 tot 359,7 en het noordelijke landhoofd
op x = 714,1 tot 717. Het maaiveld wordt op zes punten bemonsterd
(`groundSamplePoints`), op de Nederrijn 20 m naast de as op x = -35, 0 en 35;
het PDOK-terrein legt het water daar op 51,79 m ellipsoïdisch.
`groundOffsetMetres` is 0. Omdat de brug 862 m lang is, staat die hoogte ook
als vaste terugval in `groundHeight` (51,79), zodat een uitsnede die alleen
een uiteinde raakt (de uiterwaarden en het spoortalud liggen hoger dan het
water) het model niet laat wegvallen of optilt. `replacesBuildings` is leeg:
onder en naast de brug ligt geen BAG-pand (PDOK-dump).

Wat er nu staat: de spoorbrug van de lijn Arnhem - Nijmegen in deze vorm sinds
1952 (de vijfde brug op deze plek): een stalen boogbrug over de rivier met aan
de zuidkant één en aan de noordkant vijf stalen vakwerkaanbruggen van circa
58 m. In 2004 zijn de oude aanbruggen over de uiterwaarden aan de noordkant
vervangen door zeven staalbetonbruggen van circa 50 m met een betonnen dek op
schuine buisvakwerken (Movares, architect Jos van den Hende); beide delen
zitten in het model.

Onderdelen in het model (hoogtes in NAP):

- Twee vakwerkbogen met het hart 4,75 m naast de as (AHN), als plaat van
  1,0 m dik met randen van 1,2 m breed en 1,0 m hoog. De bovenrand volgt
  z = 48,9 - 0,004174 x² + 7,0·10⁻⁸ x⁴ (top +48,9 m, op de eindstijlen
  +31,9 m; AHN, kleinste kwadraten op het maximum per 2 m); de onderrand ligt
  in de top 6,0 m lager (onderkant +42,9 m) en komt 6,5 m binnen de
  eindstijlen (x = ±59,8) op het dek. 24 velden van 5,525 m met een diagonaal
  per veld: onder de diagonaal een doorgaande driehoekige opening met een
  flank van minstens 50 graden tegen de stijl, erboven een blinde nis van
  0,35 m (24 openingen en 24 nissen per boog). Eindstijlen 1,2 m, stijlen
  0,9 m.
- 21 hangers van 0,9 m per boog op de knopen waar de onderrand minstens 2 m
  boven de trekbalk ligt, in een scherm met 20 spitse openingen (flanken van
  50 graden, toppen van +28,0 m bij de uiteinden tot +42,8 m in het midden)
  en aan beide uiteinden een driehoekige opening tussen de buitenste hanger
  en de plek waar de onderrand op het dek komt.
- Het windverband tussen de bovenranden: kruisende diagonalen van 1,0 m in
  twaalf velden (om de andere knoop) en een portaalregel van 1,2 m over de
  volle breedte op de eindstijlen (+31,9 m, AHN), 0,3 m onder de bovenrand,
  in het midden 0,9 m dik met de onderkant onder 47 graden naar de bogen.
- Het brugdek onder de boog: plaat tussen de bogen van 1,4 m, trekbalken in
  het vlak van de bogen van 2,2 m onder tot 0,9 m boven het spoor, en
  looppaden buiten de bogen tot 6,3 m naast de as (AHN) met een onder
  50 graden afgeschuinde onderkant. Spoor op +22,45 m.
- De twee rivierpijlers met ronde koppen (BGT, 6,1 tot 6,4 × 20,1 tot 20,9 m):
  metselwerk tot +12,5 m met een kraag van 0,5 m, daarboven een betonnen blok
  van 14 m breed en een kop van 15 m breed tot onder de trekbalk.
- Zes aanbruggen van 1952 (één zuid, vijf noord; 60,1, 58,1, 57,6, 57,6,
  57,5 en 58,5 m): een dekplaat van 0,8 m en 10,5 m breed op twee
  vakwerkliggers in het vlak van de bogen (plaat van 1,0 m, randen van
  1,2 × 1,0 m), van het spoor tot de onderrand op +16,25 m (AHN), met vijf
  V-velden per overspanning: doorgaande spitse openingen met de top in het
  midden van elk veld en blinde nissen naast de stijlen op de onderknopen.
- Vier pijlers van de noordelijke aanbruggen met spitse koppen (BGT, 4,5 tot
  4,7 × 16,1 tot 16,6 m) tot 1,2 m onder de onderrand, met een kop die 0,3 m
  uitkraagt.
- Het zuidelijke landhoofd (BGT, x = -144,7 tot -138,6, 10,4 m breed) met
  een kort veld van 9,4 m (dek 1,5 m dik, 10 m breed) en een brede pijler met
  bordes (x = -129,3 tot -124,8, BGT). Spoor op +22,3 m, over het korte veld
  oplopend naar +22,45 m.
- De overgangspijler met bordes tussen de stalen brug en de aanbrug van 2004
  (BGT, x = 352,7 tot 359,7, 18,3 m breed), tot het dek van 2004.
- De aanbrug van 2004 van x = 356,2 tot het noordelijke landhoofd: een
  betonnen dek van 12,15 m breed (BGT, looppaden tot 6,15 en 6,0 m naast de
  as), 1,8 m dik in het midden en 0,6 m aan de randen met schuine
  onderranden, op twee vakwerken 4,0 m naast de as als plaat van 0,9 m met
  een onderrand van 1,2 × 1,1 m op +16,5 m; per overspanning negen V-velden
  van 5,5 m (doorgaande spitse openingen en blinde nissen). Zeven velden van
  49,7 m: de eerste pijler uit de BGT (x = 364,0 tot 368,1), de zes
  tussenpijlers als betonnen schijven van 2,4 × 8,6 m met ronde koppen en een
  kop van 0,3 m (x = 415,8, 465,5, 515,2, 564,9, 614,7 en 664,4). Spoor op
  +22,2 m.
- Het noordelijke landhoofd (x = 713,8 tot 717, 13 m breed) tot het dek.
- Het spoor als twee eigen nodes. `road:spoor`: de bovenste 0,5 m van het dek
  op de twaalf actuele BGT-wegdelen van de stalen brug (per overspanning één
  per spoor, relatieve hoogteligging 1, spoorbaan, gesloten verharding, zonder
  plus-fysiek voorkomen): L0004.c954e297911b4030871af57d07c33606 en
  L0004.168a3ab0224d45d3944f3b6dfe5b8e5f (zuidelijke aanbrug),
  L0004.7780e531631142588d3c707d13940313 en
  L0004.3f49c83d8e79431bbf9d19d6657255b9 (boog),
  L0004.2e441329918e4df9b6b8a63b209bd782,
  L0004.58873a497d0c4bf18cba19cfcdc58037,
  L0004.a56e1199d7914ddc979daaa132b8447f,
  L0004.a8744700129c4f579d4de55fc6561782,
  L0004.2a98419da77d4d9d95d6e6bb6a780457,
  L0004.f57cca0f97f649f785528d0cf337c671,
  L0004.151e9b1ff5c040138ae80e653ea31d68,
  L0004.f3fba5fb646444eabb20fade6c160962,
  L0004.a6d559fdd5a8499094e000a4efd5a798 en
  L0004.cd0355d858e34d45a4e2b41864ab376e (noordelijke aanbruggen), met in de
  GLB `extras.attributes` `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen:
  "gesloten verharding" }`. Het zijn twee stroken van 0,7 tot 3,3 m naast de
  as (x = -125,35 tot 355,75); het midden tussen de sporen, de looppaden en
  de bogen zijn in de BGT geen wegdeel en blijven constructie.
  `road:spoor-ballastbed`: idem op de wegdelen spoorbaan, half verhard, van
  het zuidelijke landhoofd met het korte veld
  (L0004.abb9ac25dc6e495caf12d3732360ca91, 7,8 m breed) en van de aanbrug
  van 2004 (L0004.a86b2b334bfc49948b919d1c6178bb92, circa 8 m breed), met
  `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" }`, zodat
  de kleurregels van een thema (bijvoorbeeld spoor zwart) op de brug werken
  zoals op de BGT-wegdelen ernaast. De contouren zijn omgezet naar het lokale
  stelsel en vereenvoudigd tot 5 cm; de kopse kanten aan de uiteinden zijn
  0,5 m voorbij het zuidelijke landhoofd en tot voorbij het noordelijke
  landhoofd verlengd, zodat daar geen smalle reep constructie op het dek
  blijft staan. De bogen met hun randen blijven over hun hele strook
  constructie (2 cm vrij). De strook loopt over dezelfde knikken als het dek,
  van 0,5 m onder tot 1 m boven het spoor; spoor = strook ∩ brug,
  constructie = brug − strook (samen 31.952 m³: constructie 29.213, spoor
  1.190, ballastbed 1.549). Het script controleert dat de volumes optellen;
  `zfight.py` vindt geen samenvallende vlakken. Het spoor wordt pas na het
  printmodel uit de brug gesneden; de STL bevat de brug als geheel.

Wat er niet in zit: de bovenleiding met portalen en masten, leuningen,
ladders, kabelgoten, seinen en de looprails op de bogen (allemaal dunner dan
0,9 m); het onderste windverband tussen de trekbalken en de dwarsdragers
onder het dek (vanaf de zijkant niet zichtbaar, en als vrije staven onder het
dek niet printbaar); de buisvorm en de schuine stand van de vakwerken van de
aanbrug van 2004 (hier rechte platen met V-openingen, want schuine staven van
circa 0,5 m zijn op 1:1000 niet printbaar); de klinknagels en knoopplaten; het
spoortalud achter de landhoofden (zit in het PDOK-terrein).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke grijze strook op het water en de uiterwaarden, zonder boog, zonder
pijlers en zonder liggers. Het model heeft van oost en west (stroomop- en
stroomafwaarts) de vakwerkboog met de velden, de diagonalen, de hangers en de
spitse openingen, de V-vakwerken van de aanbruggen van 1952 en de vakwerken
van de aanbrug van 2004 met hun ranke pijlers; van noord en zuid (langs de
brug) de twee bogen met het windverband en de portaalregel, het looppad
buiten de bogen en de pijlers met ronde en spitse koppen en kragen.

Pasvorm op het AHN: het AHN heeft op de dunne staalconstructie maar weinig
punten. De bovenrand van de bogen ligt per 8 m in 9 van de 16 vakken binnen
1 m en in 14 binnen 2 m van het hoogste DSM-punt op de booglijnen (mediaan:
AHN 0,8 m lager); over het middendeel (|x| < 40 m) liggen de hoogste
DSM-punten 0 tot 0,3 m onder de bovenrand (top AHN +48,8 m). Het spoor ligt
op de stalen brug binnen 0,1 m van het 90e percentiel van het DSM (op de open
dekken van de aanbruggen valt het AHN door tussen de dwarsliggers) en op de
aanbrug van 2004 0,1 m boven de mediaan (+22,1 m).

Printbaarheid op 1:1000: de openingen in de bogen, het hangerscherm en de
vakwerken hebben spitse toppen (flanken van minstens 50 graden) of zijn
blinde nissen van 0,3 tot 0,35 m met een vlakke bovenkant; het windverband
heeft een onderkant van 47 graden, kragen en pijlerkoppen kragen onder
50 graden uit, en de looppaden en de dekranden van 2004 hebben een
afgeschuinde onderkant. Alles begint op dezelfde onderkant (0,8 m onder de
waterspiegel) en elke node is een gesloten manifold (genus 329 voor de
constructie, één component; het spoor en het ballastbed elk twee stukken).
Vrij hangend blijven in de printversie alleen smalle randen (1.003 m²): de
0,1 m brede onderkant van de randen van 1,2 m langs de platen van 1,0 m (bogen
en liggers van 1952) en de vlakke bovenkant van de blinde nissen in de
vakwerken van 2004. Printcheck op 1:1000 met een uitsnede van 241 m rond de
boog: status NoError voor alle drie de nodes, 51 s; de constructie van 16,0
naar 23,6 cm³ ten opzichte van de rechte opvulling (+47 %), het spoor
0,49 cm³ en het ballastbed 0,06 cm³ zonder eigen opvulling (`extraPct` 0);
onder de dekken komt een wig met een smal scherm tot de onderplaat, de
openingen in de bogen, het hangerscherm en de vakwerken blijven open. Het
hele model past op 1:1000 niet in 400 mm; in een uitsnede van 841 m (1:2102)
gaat het ook als gesloten solid door (NoError, 54 s): de constructie van 16,9
naar 10,7 cm³ (-36,9 %), het spoor 0,13 cm³ en het ballastbed 0,17 cm³ met
`extraPct` 0. De STL op 1:2500 heeft dezelfde printvoet (wig van 50 graden en
een scherm van 0,9 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Spoorbrug_Oosterbeek)
(boogbrug met één aanbrug aan de zuidzijde en vijf aan de noordzijde,
hoofdoverspanning 132 m, aanbruggen van 56 m, nieuwe aanbruggen van 2004 als
zeven staalbetonbruggen met stalen vakwerk), PDOK BGT (overbruggingsdeel: dek
van 1952 en van 2004, pijlers met ronde en spitse koppen, het zuidelijke
landhoofd en de brede pijlers met bordes; wegdeel: de spoorbaan op de brug
voor het spoor en zijn attributen; spoor: de as van de twee sporen, 4,06 m uit
elkaar), PDOK AHN (dsm en dtm 0,5 m via WCS: spoorhoogte, bovenrand van de
bogen, portaal, plaats van de bogen, looppaden, onderkant van de
aanbruggen), de PDOK-luchtfoto (plattegrond, windverband), het PDOK-terrein
(waterspiegel) en de Wikimedia Commons-foto's Spoorbrug over de Nederrijn ter
hoogte van Oosterbeek.jpg, Arnhem-Meinerswijk, Spoorbrug Oosterbeek tijdens
hoogwater en ijs IMG 8164 2021-02-14 09.05.jpg, Railway bridge Arnhem (2).JPG
en (3).JPG, 2007-01-14 12.14 Arnhem, spoorbrug.JPG, Arnhem-Zuid Neder-Rijn NS
1764 met DD-AR 7374 Sprinter 7635 Zutphen (29423434454).jpg, Modern
railwaybridge architecture gives rather nice shaped structures -
panoramio.jpg en VIRM Rijnbrug Oosterbeek.JPG voor de vakwerkbogen, de
velden, de hangers, de aanbruggen en de pijlers. Geschat zijn de waterspiegel
(NAP +8,25 m: PDOK-water 51,79 m ellipsoïdisch min 43,54 m), de onderrand van
de boog (6,0 m onder de bovenrand in de top, op het dek 6,5 m binnen de
eindstijlen; uit foto's), de 24 velden van 5,525 m, de staafmaten (randen
1,0 m hoog en 1,2 m breed, stijlen en hangers 0,9 m, plaat 1,0 m), de hoogte
van het brugdek en de trekbalk (2,2 m), de vakwerkliggers van de aanbruggen
van 1952 (6,2 m hoog vanaf het spoor, vijf V-velden), de aanbrug van 2004
(dek 1,8 m, vakwerken recht in plaats van schuin, velden van 5,5 m,
tussenpijlers op gelijke afstanden van 49,7 m omdat ze niet in de BGT staan)
en de hoogte van het metselwerk en de koppen van de pijlers.

Licentie van het model: eigen werk op basis van open bronnen.
