# Moerdijkspoorbrug (Moerdijk)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `moerdijkspoorbrug.glb` | Catalogusbron in meters met twee nodes: `road:spoor`, de bovenste 0,5 m van het dek onder de twee sporen, met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` gesloten verharding (de twee BGT-wegdelen op het dek, zie onder); en `building:moerdijkspoorbrug` met de rest: het dek, de vijf doorgaande vakwerkliggers (elk twee vakwerkplaten), de plaatbrug aan de noordkant, de tien pijlers met oplegblokken en de twee landhoofden |
| `moerdijkspoorbrug-1-3000.stl` | De hele brug (constructie en spoor samen) in één stuk op 1:3000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (364 × 5,5 × 7,9 mm; `--scale 5000` geeft 218 mm) |
| `moerdijkspoorbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

Dit is de spoorbrug van de lijn Breda - Dordrecht over het Hollandsch Diep.
De huidige stalen bovenbouw (ir. C.L. Wisse) werd tussen 1953 en 1955
overspanning voor overspanning ingevaren op de pijlers die na de oorlog
waren hersteld; het jaartal 1978 dat soms genoemd wordt, klopt niet voor deze
brug (Wikipedia: geheel in gebruik in 1955). Er is geen beweegbaar deel (de
draaibrug van 1871 bestaat niet meer). De HSL-brug (`brug-hollandsch-diep`)
ligt 47 m stroomafwaarts, de A16-brug stroomopwaarts; beide zitten niet in
het model, en tussen dit model en de HSL-brug blijft in de export 29 m vrij
(PDOK-dump: de HSL-brug begint op y = 37, dit model eindigt op y = 8). De
controle-URL valt op de brug, 45 m ten zuiden van de oorsprong, tussen de
4e en 5e pijler.

De GLB is in meters met de oorsprong op RD (103685,11, 414729,80) (WGS84
51,71896 N, 4,64460 O), op de as van het BGT-dek in het hart van de vijfde
rivierpijler vanaf het zuiden (de middelste pijler van de middelste ligger),
op de waterspiegel van het Hollandsch Diep (NAP +0,2 m) en de glTF-conventie
Y omhoog. +X loopt langs de brug naar het noordnoordwesten, naar Willemsdorp
(`xAxis` (-0,36896, 0,92945), 111,65 graden linksom vanaf het oosten; langs
de randen van het BGT-dek, 0,02 graden gedraaid ten opzichte van de HSL-brug),
+Y stroomafwaarts naar het westzuidwesten, naar de HSL-brug. Het zuidelijke
landhoofd ligt op x = -530,1 tot -521,6, de pijlers op x = -419,7, -314,5,
-209,9, -104,7, 0, 104,8, 209,6, 314,8, 420,3 en 525,3 en het noordelijke
landhoofd op x = 554,4 tot 561,6. Het maaiveld wordt op tien punten op het
water bemonsterd (`groundSamplePoints`, 20 m naast de as midden in het 2e,
4e, 6e, 8e en 10e veld, x = -367 tot 472,8); `groundOffsetMetres` is 0, want
het PDOK-terrein legt het water op 43,93 tot 43,98 m ellipsoïdisch, de
waterspiegel van het model (NAP = ellipsoïdisch - 43,77 m op de oevers).
Omdat de brug 1092 m lang is, staat de laagste waarde ook als vaste terugval
in `groundHeight` (43,93), zodat een uitsnede die alleen een uiteinde raakt
het model niet laat wegvallen. Geen BAG-pand onder de brug.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 1081 m van landhoofd tot landhoofd, 13,06 m breed (BGT, met de
  looppaden buiten de liggers), met het spoor volgens het AHN als twee rechte
  hellingen van +0,494 % en -0,500 % met een parabolische top van 205 m:
  +9,5 m bij Moerdijk, +11,85 m bij de middelste pijler en +9,3 m bij
  Willemsdorp (rms 0,01 m van het AHN). De onderkant van de dwarsdragers ligt
  1,6 m onder het spoor.
- Vijf doorgaande vakwerkliggers over twee velden (208,3 tot 209,3 m), met
  tussen de liggers een voeg van 1,2 m boven de 2e, 4e, 6e, 8e en 10e pijler;
  de 1e, 3e, 5e, 7e en 9e pijler zijn tussensteunpunten. Twee vakwerklijnen
  van 1,0 m dik, 4,7 m naast de as (AHN). Elke ligger is een dichte plaat met
  een onderrand tot 0,6 m boven het spoor, een bovenrand en diagonalen van
  0,9 m in een W-vakwerk zonder stijlen (16 vakken van 13,0 m; AHN:
  dwarsverbanden om de 13 m; foto's: geen stijlen) en schuine eindstijlen die
  bij de voegen een V-vormige insnijding geven.
- De bovenrand ligt overal 11,36 m boven het spoor (AHN, evenwijdige randen
  die de top in het spoor volgen): +20,85 m bij Moerdijk, +23,2 m in het
  midden.
- In de liggers 80 doorgaande driehoekige openingen met de punt omhoog per
  vakwerklijn (flanken van 58,6 graden of steiler) en 75 blinde nissen van
  0,35 m voor de driehoeken met een vlakke bovenkant, aan de buitenkant.
- Tien pijlers van 6,9 × 15,5 m met ronde koppen (BGT) tot 1,2 m onder het
  dek, met daarop oplegblokken van 1,6 × 1,4 m onder beide vakwerklijnen (bij
  de voegen 2,8 m lang). Overspanningen 104,0 tot 105,5 m (Wikipedia: langste
  104 m).
- Een plaatbrug van 31 m tussen de 10e pijler en het noordelijke landhoofd met
  twee plaatliggers van 0,9 m op de vakwerklijnen, de bovenkant 1,55 m boven
  het spoor (AHN).
- Het zuidelijke landhoofd met een ronde voorkant als een halve pijler (BGT)
  tot de pijlerkop en het blok erachter tot het spoor; het noordelijke als
  blok tot het spoor (aan de voorkant 0,5 m breder dan de BGT, zodat het dek
  er overal op rust).
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van het dek onder
  de twee BGT-wegdelen op het dek, met de attributen van die wegdelen in
  `extras.attributes` (`bgt_functie` spoorbaan, `bgt_fysiekvoorkomen`
  gesloten verharding; `plus_fysiek_voorkomen` is in de BGT leeg), zodat de
  kleurregels van een thema (bijvoorbeeld spoor zwart) op de brug werken zoals
  op de PDOK-wegdelen ernaast. Bron: de actuele BGT-wegdelen met relatieve
  hoogteligging 1 `L0004.70844bdc51de446aa0946f76ac7cc571` (westelijk spoor,
  y = 0,8 tot 3,5) en `L0004.b14fb6f3bb61412586ec37fd05b4faed` (oostelijk
  spoor, y = -3,3 tot -0,5), beide van x = -525,0 tot 557,4, als constanten
  in lokale coördinaten in het script (vereenvoudigd tot 5 cm). Er ligt dus
  een actueel wegdeel `spoorbaan` op het dek; de uitwijkregel (functie van de
  landhoofden) was niet nodig. De strook tussen en naast de sporen, de
  looppaden buiten de liggers en de vakwerkplaten blijven constructie. Het
  spoor is de snijstrook (over dezelfde loftstations als het dek, van 0,5 m
  onder tot 1 m boven het spoor, tussen de binnenkanten van de vakwerkplaten
  met 2 cm vrij, 0,2 m voor het dek tot 0,5 m over het noordelijke landhoofd)
  binnen de BGT-contouren, gesneden met de brug; de constructie is de brug
  min die strook. Volumes: brug 44389,6 m³ = constructie 41574,9 m³ + spoor
  2814,7 m³ (verschil 0). Het spoor loopt van x = -523,8 tot 557,35; de
  bovenkant ligt op het spoorniveau (NAP +9,3 tot +11,85 m).

Wat er niet in zit: de echte staven (geklonken diagonalen van circa 0,6 tot
0,8 m met bindplaten, vervangen door de plaat met openingen en nissen), de
windverbanden en dwarsportalen tussen de liggers boven het spoor en de
schuine eindportalen (vrije horizontale overspanningen van 9,4 m die op
1:1000 niet zonder steun printen), de bovenleiding, de leuningen langs de
looppaden, de stalen bordessen met trappen op de koppen van de pijlers (open
staalwerk; de BGT tekent ze als stukjes van 1,3 × 5 m naast het dek), de
vleugelmuren van het zuidelijke landhoofd (0,3 m dik) en de sloofbakken
onder water. Het talud waarop het spoor aan beide kanten verder loopt is
PDOK-terrein.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke strook op NAP +0 tot +4 m met losse plaatjes, zonder liggers en
pijlers. Het model heeft van oost en west de twee vakwerklijnen met de
openingen en nissen, de V-insnijdingen bij de vijf voegen en de pijlers met
oplegblokken, van noord en zuid de doorkijk tussen de twee liggers met de
schuine eindstijlen, de plaatbrug en de landhoofden, en van alle kanten het
licht gebogen spoor met de top in het midden. De PDOK-strook blijft overal
onder de onderkant van het dek.

Pasvorm op het AHN: de omhullende per 8 m (hoogste DSM-cel op de twee
vakwerklijnen, de voegen niet meegerekend) ligt in alle 125 vakken binnen
1 m van de bovenrand van het model (mediaan -0,02 m). Over het spoor ligt
72 % van de DSM-cellen binnen 1 m van het spoorniveau (mediaan +0,04 m); de
rest zijn de windverbanden boven het spoor en doorkijkjes door het open dek.

Printbaarheid op 1:1000: open vakwerk is op 1:1000 niet te printen, daarom
zijn de liggers dichte platen van 1,0 m met openingen waarvan de flanken
minstens 58,6 graden steil zijn en nissen van 0,35 m voor de driehoeken met
een vlakke bovenkant. Alleen de onderkant van het dek (14017 m²) en de
plafonds van de nissen (601 m²) hangen vrij; het script controleert dat
alleen die naar beneden wijzen, dat de openingen steil genoeg zijn, dat alles
op dezelfde onderkant begint en dat de printversie buiten de nissen geen
overhang heeft. Elke node is gesloten (status NoError; de constructie genus 171: 160
openingen en 11 lussen tussen pijler, oplegblokken en dek; het spoor twee
losse stroken). Met 1092 m past
de brug op 1:1000 niet in één uitsnede. Op een uitsnede van 400 × 400 m
(430 m brug met twee voegen) op 1:1000 ging het model vóór de opsplitsing in
constructie en spoor in de printcheck als gesloten solid met
overhangopvulling door (status NoError, 17,5 s, 75669 naar 37687 mm³ ten
opzichte van de rechte opvulling, -50 %). Met het spoor als eigen node kiest
de printcheck bij schaal 1000 de automatische uitsnede van 1050 m (1:2624):
alle onderdelen NoError (5,1 s), de constructie 10380 naar 5431 mm³ (-47,7 %),
het spoor 147 naar 147 mm³ (`extraPct` 0, geen eigen opvulling); samen
10527 naar 5578 mm³, gelijk aan het oude model (10529 naar 5581 mm³). Onder het dek komt een wig met een smal scherm tot de onderplaat;
de openingen in de liggers en de voegen blijven open. De STL op 1:3000 heeft
dezelfde printvoet (wig van 50 graden en een scherm van 1 mm).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Moerdijkspoorbrug)
(1040 m, tien overspanningen in plaats van veertien sinds het herstel van
1946, langste overspanning 104 m, breedte 10,5 m, twee sporen, vernieuwd
onder leiding van C.L. Wisse en in 1955 geheel in gebruik), PDOK BGT
(overbruggingsdeel: dek, pijlers, landhoofden), PDOK AHN (dsm en dtm 0,5 m
via WCS: spoorniveau, vakwerklijnen, bovenrand, voegen, dwarsverbanden en
plaatbrug), het PDOK-terrein (waterspiegel) en de Wikimedia Commons-foto's
Moerdijk spoorbrug 1990.jpg, Moerdijk spoorbrug 1990 1.jpg, 1990 2.jpg en
1990 3.jpg (zijaanzicht van het W-vakwerk zonder stijlen, de V bij de voegen,
de pijlers), Moerdijk brug.jpg (binnenkant: diagonalen met bindplaten),
IC-Direct op de Moerdijk.jpg, Sprinter op de Moerdijk.jpg, ICR op de
Moerdijk.jpg en Moerdijk rail bridges.jpg (de brug achter de HSL-brug, de
pijlers met opleggingen en de looppaden). Geschat zijn de waterspiegel
(NAP +0,2 m: PDOK-water 43,95 m ellipsoïdisch min 43,77 m, het verschil
tussen PDOK-terrein en AHN op de oevers), de diepte van het dek onder het
spoor (1,6 m), de staafbreedte (0,9 m), de dikte van de liggers (1,0 m), de
dikte van de plaatliggers (0,9 m), de hoogte van de pijlerkop (1,2 m onder het
dek), de maat van de oplegblokken, de breedte van de voegen (1,2 m) en de
ligging van de knopen (gelijke vakken per ligger, de eindstijl naar de eerste
bovenknoop; het AHN laat de bovenrand circa 0,8 m eerder beginnen).

Licentie van het model: eigen werk op basis van open bronnen.
