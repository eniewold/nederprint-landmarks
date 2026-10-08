# Spoorbrug Dordrecht (Dordrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `spoorbrug-dordrecht.glb` | Catalogusbron in meters met drie nodes: `road:spoor` en `road:spoor-halfverhard`, de bovenste 0,5 m van de twee dekken buiten de vakwerkliggers, geleidetorens en borstweringen, met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` gesloten verharding (over de rivier, de hefbrug en de Dordtse aanbrug) of half verhard (Zwijndrechtse aanbrug); en `building:spoorbrug-dordrecht` met de rest: de twee bruggen met hun vakwerkliggers, de hefbrug met het hemelbed (vier poten, twee dwarsbalken, vier geleidetorens, twee buizen), de betonnen aanbruggen op kolommen, de pijlers, landhoofden en remmingwerken |
| `spoorbrug-dordrecht-1-1250.stl` | De brug in één stuk (constructie en spoor samen) op 1:1250 met een printvoet onder de dekken en een scherm onder de buizen, met de onderkant (1 m onder de waterspiegel) op het printbed (375 × 65 × 58 mm) |
| `spoorbrug-dordrecht.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (104297,57, 424947,98) (WGS84
51,81085 N, 4,65197 O), midden op de hefbrug op de lijn midden tussen de twee
bruggen, met z = NAP-hoogte en de glTF-conventie Y omhoog. +X loopt langs de
brug naar het zuidoosten, naar Dordrecht (`xAxis` (0,82240, -0,56891), -34,68
graden vanaf het oosten, uit de randen van de BGT-hefdekken), +Y naar het
noordoosten (stroomopwaarts). De zuidwestelijke brug ligt op y = -14,7 tot
-3,2, de noordoostelijke op 3,2 tot 14,7. De Zwijndrechtse aanbrug begint op
x = -305,6 (zuidwest) en -310,1 (noordoost), de rivierpijlers staan op
x = -213,4 tot -199,1 en -125,8 tot -110,6, de hefbrugpijler aan de
Zwijndrechtse kant op -44,4 tot -25,5, de poten van het hemelbed op x = ±28,6,
y = ±24, en de Dordtse aanbrug eindigt op x = 150,9 en 158,1. Het maaiveld
wordt op zes punten op het water van de Oude Maas bemonsterd
(`groundSamplePoints`, 25 m naast de middenlijn aan beide kanten op x = -160,
-70 en 0); `groundOffsetMetres` is 0, want het PDOK-terrein legt de Oude Maas
op ellipsoïdisch 43,66 tot 43,70 m (NAP + 43,63 m, dus NAP 0). Omdat de brug
468 m lang is, staat de laagste PDOK-hoogte op die punten ook als vaste
terugval in `groundHeight` (43,66), zodat een uitsnede die alleen een
aanbrug raakt het model niet laat wegvallen. Geen BAG-pand onder de brug
(`replacesBuildings` leeg).

De brug van 1991-1994 ("Het Hemelbed") bestaat uit twee tweesporige
vakwerkbruggen naast elkaar en een hefbrug met twee hefbare dekken tussen
vier poten. Direct ten zuidwesten ligt de Stadsbrug Zwijndrecht (verkeersbrug
met basculebrug, een eigen model); die zit niet in dit model, en het model
blijft ten noordoosten van y = -36. Het ronde bedieningsgebouw tussen beide
bruggen (BAG-pand 0505100000067669, bouwjaar 1994, NAP +23 m) is niet
gemodelleerd en niet vervangen: de PDOK-reconstructie ervan klopt met het AHN
en raakt het model niet.

Onderdelen in het model (hoogtes in NAP):

- Twee dekken van 11,5 m breed (BGT 11 tot 12,6 m; middenlijnen op y = ±8,95,
  spleet van 6,4 m), met de spoorstaaf volgens het AHN: +11,45 m bij
  Zwijndrecht, +12,9 m over de rivier, +12,6 tot +12,2 m op de hefbrug en
  dalend naar +9,9 m bij Dordrecht. Het stalen dek is 1,5 m hoog.
- Per brug twee vakwerkliggers van 1,0 m dik op 4,4 en 13,5 m naast de
  middenlijn (AHN), bovenrand 8,4 m boven de spoorstaaf (NAP +21,3 m), als
  dichte plaat met een onderrand tot 0,6 m boven de spoorstaaf, een bovenrand
  en diagonalen van 0,9 m (W-vakwerk) en schuine eindstijlen. De vaste
  liggers lopen van x = -204 over de middelste rivierpijler (x = -118,2,
  85,8 m) tot x = -39,4 (zuidwest, 78,8 m) en -34,9 (noordoost, 83,3 m)
  volgens het AHN, met 8 en 7 vakken; Wikipedia noemt een langste
  overspanning van 88,2 m. De hefliggers lopen van x = -26,15 tot 26,15 met
  5 vakken. In alle liggers 80 doorgaande driehoekige openingen met de punt
  omhoog (flanken van 52,5 graden of steiler) en 72 blinde nissen van 0,35 m
  voor de driehoeken met een vlakke bovenkant (aan de buitenkant van de
  buitenste en aan de spoorkant van de binnenste liggers).
- Het hemelbed: vier witte poten met een ronde voet van 4,1 m (BGT, op
  y = ±24), naar boven verbreed tot 6 m met een ronde buitenkant (AHN: top
  van 5,5 × 6 m tot y = ±28,65), schuin afgesneden van +65,5 m aan de
  binnenkant tot +71,5 m aan de buitenkant (hoogste punt; Wikipedia noemt
  65 m), met vier groeven van 1,0 m hoog en 0,35 m diep op +42,5 tot +51 m;
  twee dwarsbalken van 6,16 m breed (BGT) van +57,5 tot +65 m tussen de
  poten; per portaal twee geleidetorens (een per brug, 10,1 × 6,16 m, tot
  onder de dwarsbalk) met onderin een doorgang voor de treinen met een spitse
  bovenkant, op de zijvlakken zes velden met een kruisverband waarvan de
  driehoeken eronder en ernaast doorgaande openingen zijn (plafonds van
  54 graden) en die erboven blinde nissen, op de kopse vlakken drie velden
  met kruisnissen; en tussen de portalen twee buizen van 5,5 m boven het
  midden van elke brug (top +65 m, AHN) met een kiel van 50 graden.
- Onder de dwarsbalk schoren van 50 graden tussen de geleidetorens en tussen
  toren en poot, zodat de openingen eronder een spitse bovenkant hebben in
  plaats van een vlak plafond (printbaar; in het echt is de onderkant vlak
  met een kraag).
- Twee rivierpijlers volgens de BGT met de kop op +5 m (AHN), daarop per brug
  een schacht tot +10 m (AHN) en een oplegblok tot onder het dek; de
  hefbrugpijler aan de Zwijndrechtse kant (19 × 58 m, kop +5 m, AHN) en de
  pijler onder het Dordtse portaal op de kade, beide met schachten tot onder
  het dek.
- De betonnen aanbruggen met een kokerligger van 6,4 m breed tot 2,6 m onder
  de spoorstaaf en borstweringen van 0,6 m breed en 1,2 m hoog langs beide
  randen: aan de Dordtse kant op de kolommen van 1,0 × 1,6 m uit de BGT (vier
  rechte rijen met kespen, een scheve rij langs de straat), de twee scheve
  pijlerwanden en de landhoofden (BGT); aan de Zwijndrechtse kant op twee
  geschatte rijen kolommen met kespen op de voegen (x = -282,9 en -235,4,
  luchtfoto) en een landhoofd van 6 m.
- Remmingwerken (AHN, luchtfoto, tot +3,5 m): aan de noordoostkant van elke
  pijler een A-vormig raamwerk van 1,5 m dik met dwarsregels en een spitse
  neus tot y = 40 (rivierpijlers) en 45 (hefbrugpijler); aan de
  zuidwestkant van de rivierpijlers twee wanden tot y = -36, naar de pijlers
  van de Stadsbrug toe.
- Het spoor als eigen nodes: de strook van 0,5 m onder tot 1 m boven de
  spoorstaaf over de hele dekbreedte, min de hele strook van de
  vakwerkliggers en de zijwanden van de geleidetorens (ook onder de
  openingen) en de borstweringen, met 2 cm vrij; spoor = strook ∩ brug,
  constructie = brug − strook. Op het dek liggen actuele BGT-wegdelen met
  functie spoorbaan (relatieve hoogteligging 1): gesloten verharding over de
  rivier (L0004 …e25494467883 zuidwest, …bf5f6a91c742 noordoost), op de
  hefdekken (…47b9927f1d26, …36893941177f) en op de Dordtse aanbrug
  (…66b05241b330, …9c2b89974516); half verhard op de Zwijndrechtse aanbrug
  (…bda42cd35582 zuidwest tot x = -275,7, …df1c01d7a86c noordoost tot
  x = -208,2). Omdat de BGT twee fysieke voorkomens geeft, zijn er twee
  nodes: `road:spoor` met `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen:
  "gesloten verharding" }` en `road:spoor-halfverhard` met `{ bgt_functie:
  "spoorbaan", bgt_fysiekvoorkomen: "half verhard" }`; geen van beide heeft
  een plus-fysiek voorkomen. De volumes tellen op (brug 72.659 m³:
  constructie 68.000, spoor 3.953, half verhard 706); de z-fightingcontrole
  (30.000 stralen over het dek) vindt geen samenvallende vlakken tussen de
  nodes; de 7 stralen die de controle als "vlak zonder dikte" in de
  constructie meldt, vallen in de spitse hoeken van de driehoekige openingen,
  waar tussen onderrand en flank minder dan 1 cm lucht zit (geen vlak zonder
  dikte, geen z-fighting).

Wat er niet in zit: de echte staven (circa 0,5 m, vervangen door platen met
openingen en nissen), de verticalen in het vakwerk, de windverbanden en
portalen boven het spoor (vrije horizontale overspanningen), de bovenleiding
en seinen, leuningen, loopbruggen en trappen aan de torens, de kabels en
contragewichten in de geleidetorens, de kraag en de schijvenkasten onder de
dwarsbalk (vervangen door de schoren), het bedieningsgebouw (eigen BAG-pand,
PDOK-reconstructie klopt) en de Stadsbrug ernaast (een eigen model). De
hefdekken staan gesloten.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar zijn de bruggen
alleen vlakke wegdekstroken met pijlerkoppen in het water; het hemelbed
ontbreekt helemaal. Het model heeft van noordoost en zuidwest de vier
vakwerkliggers met openingen en nissen, het hemelbed met de doorkijk door de
geleidetorens en de buizen tussen de poten, en de remmingwerken; van
zuidoost en noordwest (langs de brug) de twee bruggen met de spleet, de
portalen met dwarsbalk, schuin afgesneden poten en de geleidetorens met de
doorgang, en de betonnen aanbruggen op kolommen.

Pasvorm op het AHN: de spoorstaaf ligt in 68 van de 76 vakken van 10 m binnen
0,5 m van het AHN (25e percentiel tussen de liggers, mediaan -0,03 m). De
bovenrand van de liggers (NAP +21,3 m) ligt tussen het 75e percentiel en het
maximum van het DSM per 8 m op de vier vakwerklijnen (mediaan -1,1 en
+1,4 m; het AHN ziet door het open vakwerk en vangt de portalen van de
bovenleiding). Poten, dwarsbalken en buizen volgen de AHN-hoogtes (+71,5,
+65 en +65 m).

Printbaarheid op 1:1000: het vakwerk is een dichte plaat met openingen
waarvan de flanken minstens 52,5 graden steil zijn en nissen van 0,35 m; de
geleidetorens hebben doorgaande openingen met plafonds van 54 graden en de
doorgang een spitse bovenkant; onder de dwarsbalken zitten schoren van 50
graden; de buizen hebben een kiel van 50 graden. Vrij hangen alleen de
onderkant van de dekken en kespen (9746 m²), de plafonds van de nissen
(402 m²) en een paar randjes van de dwarsbalken naast de poten (19 m²). Met
468 m past de brug op 1:1000 niet in één uitsnede; in een uitsnede van 428 m
(1:1070, 400 mm) gaan alle drie de onderdelen in de printcheck als gesloten
solid met overhangopvulling door (status NoError, 78 s): de constructie van
115,7 cm³ met verticale opvulling naar 86,0 cm³ (-25,7 %), het spoor 3,20 cm³
en half verhard 0,56 cm³ zonder eigen opvulling (0 %). De export zet onder
elke buis een smal scherm tot het hefdek; dat scherm is in de printrender van
opzij als vlak tussen de poten te zien. De STL op 1:1250 heeft een printvoet
onder de dekken (wig van 50 graden met een scherm van 0,5 mm breed op
printschaal tot de onderplaat) en een scherm onder de buizen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Spoorbrug_Dordrecht)
(lengte circa 560 m, breedte 2 × 12,6 m, doorvaarthoogte 11,40 m,
doorvaartbreedte 44 m, langste overspanning 88,2 m, hoogste punt 65 m, bouw
1991-1994, architect P. v.d. Ree), PDOK BGT overbruggingsdeel en wegdeel,
PDOK AHN DSM 0,5 m (WCS), PDOK-luchtfoto (Actueel_orthoHR), BAG (pand
0505100000067669) en Wikimedia Commons-foto's: Dordrecht Spoorbrug
2026-04-22-1.jpg en -2.jpg, Het Hemelbed - Flickr - LeonardoDaQuirm.jpg,
Geheven spoorbrug in Dordrecht.jpg, Dordrecht Railway Bridge.jpg, Railway
Bridge Dordrecht Netherlands.jpg, Symmetrie, Spoorbrug over de Oude Maas,
Dordrecht (12171358784).jpg en Spoorbrug in Dordrecht gezien vanaf Veerplein
in Zwijndrecht I.jpg.

Geschat: de vakverdeling (8 en 7 vakken in de vaste liggers, 5 in de
hefliggers; W-vakwerk zonder verticalen), de constructiehoogtes (stalen dek
1,5 m, kokerligger 2,6 m), de onderkant van de dwarsbalken (+57,5 m, foto),
de geleidetorens (zo diep als de dwarsbalk, tot de dwarsbalk) en hun
kruisverbanden, de schoren van 50 graden, de groeven in de poten (foto's),
de buisdiameter (5,5 m, AHN en foto), de pijlerschachten en oplegblokken, de
Dordtse portaalpijler, de kolommen en kespen onder de Zwijndrechtse aanbrug
(niet in de BGT, onder het dek niet in het AHN), de kespen aan de Dordtse
kant en de hoogte van de remmingwerken (+3,5 m).

Gegenereerd met
[`scripts/generate-spoorbrug-dordrecht.mjs`](../../scripts/generate-spoorbrug-dordrecht.mjs).
De BGT, de BAG, het AHN en de luchtfoto zijn open data (CC0 / CC BY 4.0 via
PDOK); de Commons-foto's zijn alleen als referentie gebruikt.
