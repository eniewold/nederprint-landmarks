# Spoorbrug Nijmegen (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `spoorbrug-nijmegen.glb` | Catalogusbron in meters: nodes `building:spoorbrug` (het boogvakwerk over de vaargeul met zijn vloer, de korte vloer op de Waalkade en de aanbruggen tot de dijk bij Lent), `building:snelbinder` (het dek van de fietsbrug over de hele lengte, de dwarsliggers naar het vakwerk, de witte buisboog en het hangerscherm) en `building:pijlers` (oplegpijler op de kade, rivierpijler, vier pijlers in de Waal en op het eiland Veur-Lent, drie poeren met pijlers in de Spiegelwaal, twee landhoofden), plus de wegdelen `road:spoor`, `road:fietspad` en `road:voetpad` (de bovenste 0,5 m van de dekken met de BGT-attributen in `extras.attributes`, zie hieronder) |
| `spoorbrug-nijmegen-1-2500.stl` | De hele brug in één stuk (alle onderdelen samen, ongewijzigd door de wegdelen) op 1:2500 met een printvoet onder de dekken, met de onderkant (0,8 m onder de waterspiegel) op het printbed (285 × 13 × 17 mm; `--scale 1000` geeft 712 mm) |
| `spoorbrug-nijmegen.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, hoofdmaten en bronnen |

De Spoorbrug Nijmegen is de dubbelsporige spoorbrug over de Waal tussen
Nijmegen en Lent. Over de vaargeul ligt sinds 1984 één stalen boogvakwerk
van 235,5 m tussen de opleggingen, met naar het noorden acht
aanbrugoverspanningen over de rest van de Waal, het eiland Veur-Lent en de
Spiegelwaal (de nevengeul van Ruimte voor de Waal) tot het landhoofd op de
dijk. Aan de oostkant ligt over de hele lengte de fietsbrug De Snelbinder
(2004); over de boog buigt zijn dek tot 12 m naar buiten en hangt het aan een
eigen witte buisboog naast het oostelijke vakwerk. De Snelbinder zit als
eigen node in het model, omdat hij aan de spoorbrug vastzit en samen met het
vakwerk het beeld van de brug bepaalt. De Waalbrug (1 km stroomafwaarts) en
De Oversteek zijn eigen modellen; de twee bruggenhoofdtorens op de Waalkade
zijn eigen BAG-panden en zitten er niet in.

De GLB is in meters met de oorsprong op RD (187336,55, 429364,15), midden
tussen de twee opleggingen van de boog op de as tussen de twee sporen, op de
waterspiegel van de Spiegelwaal volgens het PDOK-terrein (NAP +7,1 m) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar Lent (`xAxis`
(0,29279, 0,95618), 72,98 graden vanaf het oosten, langs de sporen in de
BGT), +Y stroomafwaarts naar het westen. De sporen liggen op y = ±2,04, de
vakwerkwanden op y = ±5,0 tot ±6,6 en de Snelbinder op y = -6,3 tot -18,6.
Het zuidelijke landhoofd (Waalkade) begint op x = -129,35, de opleggingen
van de boog staan op x = ±117,75, het noordelijke landhoofd op de dijk
eindigt op x = 582,25. Het maaiveld wordt op twaalf punten op het water naast
de brug bemonsterd (`groundSamplePoints`): op de Waal naast de boog
(x = -60, 0 en 60, 26 m west van het spoordek en 35 m oost, buiten de
Snelbinder), op de Waal tussen de pijlers van de noordelijke stroom
(x = 190) en op de Spiegelwaal tussen de poeren (x = 412 en 470), steeds
20 m west en 30 m oost. Het eiland en de uiterwaarden liggen hoger en zouden
het model optillen. `groundOffsetMetres` is 0; het PDOK-terrein legt de
Spiegelwaal op 50,81 m en de Waal op 50,98 tot 51,05 m ellipsoïdisch.
`groundHeight` 50,8 (ellipsoïdisch, de laagste PDOK-waterhoogte op die
punten) is de terugval voor een uitsnede die geen van de punten raakt. Geen
BAG-pand onder de brug; de oostelijke bruggenhoofdtoren
(`NL.IMBAG.Pand.0268100000007895`) staat in PDOK op NAP +37,5 m, 1,6 m boven
het hoogste AHN-punt (de torenspits, +35,9 m), en blijft staan.

Wegdelen met PDOK-attributen: de bovenste 0,5 m van elk dek is een eigen
node van klasse `road` met de attributen van het actuele BGT-wegdeel erop
(relatieve hoogteligging 1, zonder `eind_registratie`), zodat de
kleurregels van een thema (fietspaden rood, spoor zwart) op de brug werken
zoals op de PDOK-wegdelen ernaast:

| Node | Attributen | Waar | BGT-wegdelen (`lokaal_id`) |
| --- | --- | --- | --- |
| `road:spoor` | `bgt_functie` spoorbaan, `bgt_fysiekvoorkomen` gesloten verharding | het hele spoordek, over de boog tussen de vakwerkwanden | `L0004.9b3b3e430bc0490294ad2df626bfa16e`, gesloten verharding, x = -129,4 tot 558,4 (over de boog alleen de twee sporen, met een gat ertussen); `L0004.c2843aa38c7a4161a14a26dac0116c59`, half verhard, het landhoofd op de dijk |
| `road:fietspad` | `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | de binnenste strook van de Snelbinder, voorbij de trap bij de dijk (x = 559,7) tot de buitenrand | `G0268.42ff08b483f75775e0530100007f0cc2` |
| `road:voetpad` | `bgt_functie` voetpad, `bgt_fysiekvoorkomen` open verharding, `plus_fysiekvoorkomen` tegels | de buitenste strook van de Snelbinder (1 tot 4 m), over de boog de naar buiten gebogen strook langs de hangers | `G0268.42ff08b5a7eb5775e0530100007f0cc2` |

De BGT tekent het spoor over de boog als twee stroken van 1,5 m met een gat
tussen de sporen; het spoor-onderdeel neemt daar het hele dek tussen de
wanden, en de 24 m half verharde spoorbaan op het landhoofd krijgt hetzelfde
fysieke voorkomen als de rest (één node per functie). Het script controleert
dat beide sporen over de hele lengte in een spoorbaan liggen. Fietspad en
voetpad volgen de grens uit de BGT-contouren (vereenvoudigd tot 5 cm). De
wegdelen zijn een snijstrook van 0,5 m onder tot 1 m boven het dek over de
stations van het dek; de vakwerkwanden (de hele strook, ook onder de
openingen), het hangerscherm (een verticaal blok tot 2 cm voorbij de
binnenkant van het scherm op 1 m boven het dek) en de buisboog waar hij bij
de opleggingen in de strook zakt, blijven met 2 cm vrij constructie. Daardoor
houdt het voetpad over de boog op y = -17,3 op; de buitenste 1,3 m is daar de
voet van het hangerscherm. Constructie en wegdeel tellen per onderdeel op tot
het geheel (spoorbrug 23.068 + 3.710 m³, Snelbinder 5.574 + 1.474 + 746 m³,
de pijlers ongewijzigd 17.717 m³) en de stroken raken geen ander onderdeel.
De stralencontrole (30.000 punten over de dekken) vindt geen samenvallende
bovenvlakken tussen de onderdelen en geen vlak zonder dikte in een wegdeel;
de negen treffers "vlak zonder dikte" in de constructie (acht in het
hangerscherm, één in een vakwerkwand) liggen in de spitse hoeken van
openingen, waar de opening op het geraakte punt nog 4 tot 7 mm hoog is.

Onderdelen in het model (hoogtes in NAP):

- Het boogvakwerk van 235,5 m tussen de opleggingen (oplegpijler op de kade
  en rivierpijler, BGT): twee verticale wanden van 1,6 m dik (buitenkant op
  y = ±6,6, BGT en AHN) met een veelhoekige bovenrand die op de
  bovenknopen een parabool volgt met de top op +49,7 m in het midden (AHN)
  en met rechte eindstijlen van de opleggingen (+25,0 m) naar de eerste
  bovenknoop (+36,5 m). Twintig velden van 11,775 m met verticalen: elke Λ
  van twee diagonalen beslaat twee velden met de top op een oneven
  bovenknoop; daaronder twee doorgaande driehoekige openingen met de punt
  omhoog naast de verticaal (20 per wand), en tussen twee Λ's een
  doorgaande ruit met een spitse top van 55 graden onder de bovenregel
  (9 per wand). De vloer met trekband is 2,1 m hoog, het spoor ligt op
  +24,35 m op de opleggingen en +24,86 m in het midden (AHN).
- De korte vloer van het zuidelijke landhoofd tot de oplegging (spoor
  +24,32 m) en de aanbruggen van 2,6 m hoog van de rivierpijler tot het
  landhoofd op de dijk, met het spoor aflopend van +24,36 m naar +21,98 m
  (AHN, mediaan per 10 m tot 40 m).
- De Snelbinder: een dek van 1,2 m over de hele lengte van x = -126,5 tot
  575 tussen de binnenrand (0,9 tot 1,2 m naast het spoordek) en de
  buitenrand uit de BGT, met het fietspad op +23,6 m bij de kade, +24,35 m
  midden op de boog en +21,0 m bij de dijk (AHN, mediaan per 10 m). Over de
  boog buigt het dek naar buiten tot y = -18,6 en hangt het met negentien
  dwarsliggers (1 × 1 m, op de knopen van het vakwerk) aan de oostelijke
  vakwerkwand; over de aanbruggen sluit een lijf tot 0,6 m onder het
  fietspad aan op het spoordek. De witte buisboog (1 × 1 m) loopt van
  oplegging tot oplegging met de top op +49,2 m, 0,5 m onder het vakwerk en
  3,5 m erbuiten (as op y = -9), en zakt naar de opleggingen naar buiten tot
  y = -12 op het dek (AHN). Het hangerscherm van 0,9 m staat op de
  buitenrand van het dek en helt naar de buisboog; het heeft achttien
  doorgaande driehoeken met de punt omhoog en zeventien ruiten (de schuine
  hangers als Warren zonder verticalen).
- De pijlers: de oplegpijler op de kade (4,8 × 24,1 m) en de rivierpijler
  (7,3 × 27,1 m) met ronde koppen, vier pijlers in de Waal, op de oever en op
  het eiland (4,6 tot 5,5 m breed, tot y = -15 onder de Snelbinder), drie
  poeren in de Spiegelwaal (5 × 22,5 m met ronde koppen tot +9,0 m) met een
  pijler van 3 m tot onder beide dekken, en twee landhoofden bij de dijk
  (BGT). Elke pijler reikt tot onder het spoordek en onder de Snelbinder tot
  de onderkant van zijn dek.

Wat er niet in zit: de windverbanden (X-verbanden tussen de bovenregels) en
de eindportalen tussen de vakwerkwanden, omdat het horizontale vrije
overspanningen van 10 m zijn die op 1:1000 niet zonder steun printen (de
export zou ze tot op de vloer opvullen); de bovenleiding met portalen en
masten, de leuningen, de staven van de hangers als losse buizen (één
scherm), en de open stalen trappen van de Snelbinder naar de kade, het
eiland en de dijk (circa 2 m brede trapbomen met leuningen, op 1:1000 een
vrijhangende schuine strook naast het dek); de bruggenhoofdtorens op de
kade (eigen BAG-panden, de Snelbinder loopt door een poort in de oostelijke
toren); de spoordijk en de dijk achter de landhoofden (PDOK-terrein). Het
PDOK-terrein heeft onder de brug een vlakke wegstrook over het water; die
blijft onder het model zichtbaar.

Pasvorm op het AHN (DSM 0,5 m): op het spoordek van de aanbruggen ligt 80 %
van de cellen binnen 1 m van de bovenkant van het model (89 % binnen 2 m,
mediaan -0,06 m), tussen de vakwerkwanden over de boog 76 % (mediaan
+0,03 m; de rest zijn de diagonalen en windverbanden erboven), op de
Snelbinder over de aanbruggen 86 % (90 %, mediaan 0,00 m) en op het fietspad
over de boog 90 % (mediaan 0,00 m). Het AHN ziet de smalle bovenregel van het
vakwerk met gaten: het hoogste DSM-punt per 2 m (west- of oostwand) ligt
in 69 van 118 stappen binnen 1 m van de bovenrand van het model en komt
nergens meer dan 0,7 m erboven; op de buisboog ligt het hoogste DSM-punt per
3 m in 50 van 70 vakken binnen 1,5 m (mediaan -0,02 m).

Printbaarheid op 1:1000: het open vakwerk is op 1:1000 niet te printen. Elke
vakwerkwand is daarom een dichte plaat van 1,6 m met staven van 1,45 m,
doorgaande openingen met zijden van minstens 55 graden en een spitse top,
en ruiten met een spitse top onder de bovenregel; het hangerscherm is een
plaat van 0,9 m met dezelfde openingen, die ook gekanteld steiler blijven
dan 50 graden. Alle nodes zijn gesloten manifolds (genus 58 voor de
spoorbrug en 37 voor de Snelbinder door de openingen; de pijlers zijn 11
losse delen; van de wegdelen heeft het voetpad genus 1, omdat de voet van de
buisboog bij de zuidelijke oplegging er als gat doorheen gaat). De dekken hangen tussen de pijlers vrij. Met 712 m past de brug op
1:1000 niet in één uitsnede; de printcontrole op de hele brug kiest 1:1784
(400 mm, 150 seconden): alle zes nodes gaan als gesloten solid door (status
NoError). De export vult de onderdelen samen op en geeft de opvulling aan de
eerste constructienode (spoorbrug 25,2 naar 17,7 cm³ met de opvulling van
de hele brug; Snelbinder 0,98 en pijlers 3,1 cm³ ongewijzigd); de wegdelen
krijgen geen eigen opvulling (`extraPct` 0 tot 0,8: spoor 0,65, fietspad
0,25 en voetpad 0,13 cm³). Op 1:1000 over de boog (uitsnede van 270 m,
78 seconden): spoorbrug 67,2 naar 38,5 cm³, Snelbinder 3,4, pijlers 4,8,
spoor 1,36, fietspad 0,52 en voetpad 0,34 cm³, alles NoError en `extraPct`
0 voor de wegdelen. Onder de dekken komt een wig van 45 graden met een smal
scherm tot de onderplaat; de openingen in de vakwerkwanden blijven open,
die in het schuine hangerscherm groeien in de export voor een deel dicht
tot V-vormige sleuven. De STL op 1:2500 heeft dezelfde printvoet per dek
(wig van 50 graden en een scherm van 0,8 mm); wat daarin nog vlak hangt
(626 m² op ware grootte), zijn de dwarsliggers onder de Snelbinder en de
toppen van de openingen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Spoorbrug_Nijmegen)
(boog van 235 m sinds 1984, doorvaarthoogte NAP +22,8 m, Snelbinder 2004 aan
de oostkant), PDOK BGT (overbruggingsdeel: dekken van spoor en Snelbinder,
oplegpijler, rivierpijler, pijlers, poeren en landhoofden; spoor: de sporen;
wegdeel: functie en verharding van de dekken), PDOK AHN (dsm en dtm 0,5 m via
WCS: lengteprofielen van spoor en Snelbinder, bovenrand van het vakwerk,
buisboog, ligging van de wanden), het PDOK-terrein voor de waterspiegel,
PDOK Luchtfoto (8 cm) voor de plattegrond en Wikimedia Commons-foto's
(Nijmegen railway bridge. River Waal. in the back the Oversteek bridge Seen
from the Stevenskerk.jpg; Railwaybridge with bikeway, Nijmegen, The
Netherlands.jpg; Railway bridge nijmegen.JPG; Snelbinder bridge.jpg;
Spoorbrug Nijmegen Snelbinder onderzijde.jpg; Spiegelwaal 18 met deel
spoorbrug en brug Lent - Stadseiland erachter.JPG; Nijmegen aan de Waal in
2019 09.jpg; Spoorbrug Nijmegen 001.jpg) voor het vakwerkpatroon, de
buisboog en de hangers van de Snelbinder, de aanbruggen en de poeren.
Geschat zijn de constructiehoogtes van de dekken (boog 2,1 m, aanbruggen
2,6 m, Snelbinder 1,2 m), het aantal velden (twintig van 11,8 m, uit de
windverbanden in het AHN en foto's), de staafbreedtes (1,45 m), de
doorsnede van de buisboog (1 m), de dikte van het hangerscherm (0,9 m), de
dwarsliggers onder de Snelbinder en de pijlers op de poeren in de
Spiegelwaal (3 m breed).

Licentie van het model: eigen werk op basis van open bronnen.
