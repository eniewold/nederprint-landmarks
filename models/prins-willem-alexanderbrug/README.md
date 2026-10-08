# Prins Willem-Alexanderbrug (Tiel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `prins-willem-alexanderbrug.glb` | Catalogusbron in meters met drie nodes: `road:rijbaan`, de bovenste 0,5 m van het dek over de 2 × 2 rijstroken van de N323 met de attributen van de BGT-wegdelen (`bgt_functie` rijbaan regionale weg, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt); `road:rijbaan-lokaal`, idem over de parallelle rijbanen langs beide randen (`bgt_functie` rijbaan lokale weg, gesloten verharding, asfalt); en `building:prins-willem-alexanderbrug` met de rest van het kunstwerk: het dek met schampkanten en kokers, de twee pylonen met kap en dwarsregel, de acht tuivlakken met tuien en ankerblokken, de pijlers met caissons, de aanbrugpijlers en de landhoofden |
| `prins-willem-alexanderbrug-1-3600.stl` | De brug in één stuk op 1:3600 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (393 × 24 × 18 mm; op 1:1000 is hij 1416 mm lang: `--scale 1000`) |
| `prins-willem-alexanderbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (162596,26, 433401,25) (WGS84
51,88914 N, 5,49755 O), op de as van het BGT-dek midden tussen de twee
pylonen, op de waterspiegel van de Waal zoals het PDOK-terrein die legt
(ellipsoïdisch 48,06 m, NAP +4,46 m) en de glTF-conventie Y omhoog. +X loopt
langs het rechte deel van de brug naar het noorden, naar Echteld (`xAxis`
(-0,009425, 0,999956), 90,54 graden linksom vanaf het oosten), +Y naar het
westen, stroomafwaarts. Vanaf de overgangspijler op x = 306 buigt de aanbrug
in een boog met een straal van 5970 m naar het westen af
(y = (x - 306)² / 11940; op het noordelijke landhoofd 53,7 m). Het zuidelijke
landhoofd op de dijk bij Wamel ligt op x = -306,4 tot -303,6, de zijpijlers op
x = -228,4 en 228,6, de pylonen op x = ±133,5, de overgangspijler op x = 306,
de tien steunpunten van de aanbrug om de 78,2 m van x = 384,8 tot 1088,5 en
het noordelijke landhoofd bij Echteld (haaks op de boog) op x = 1104 tot 1110.
Het maaiveld wordt op tien punten op de Waal bemonsterd (`groundSamplePoints`,
30 m naast de as op x = -100, -50, 0, 50 en 100, 14 m naast de dekrand);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de Waal binnen 0,02 m
op de waterspiegel van het model. Omdat de brug 1416 m lang is, staat er een
ellipsoïdische `groundHeight` van 48,06 m (de laagste PDOK-terreinhoogte op
die punten) als terugval voor een uitsnede die alleen een uiteinde raakt. De
punten liggen bewust niet op de uiterwaarden: die liggen 1,5 tot 3 m hoger
dan het water en zouden het model in een uitsnede zonder rivier te hoog
zetten. Geen BAG-pand onder de brug. Op de landhoofden sluit het wegdek binnen
0,4 m (zuid, NAP +21,4 m) en 0,1 m (noord, NAP +15,1 m) aan op de PDOK-weg op
de dijk.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 1416 m van landhoofd tot landhoofd, 31,2 m breed op het
  tuibruggedeelte en via een versmalling tussen x = 230 en 306 27,3 m breed
  op de aanbrug (BGT), met het wegdek volgens het AHN-DSM om de 10 m: +21,4 m
  op de zuidelijke dijk, +23,5 m midden in de hoofdoverspanning en +15,1 m op
  de noordelijke dijk. Doorsnede: een plaat met een gevelrand van 0,9 m en een
  schuine onderkant naar de koker, op het tuibruggedeelte één koker (onder
  15 m, boven 17 m breed), op de aanbrug twee kokers boven de twee
  pijlerwanden, 3,6 m onder het wegdek (onder de doorvaarthoogte van NAP
  +19,6 m bij de pylonen). Langs beide randen een schampkant van 0,9 × 0,5 m
  in plaats van de leuningen.
- Overspanningen 77,5 - 95 - 267 - 95 - 77,5 m (Wikipedia, BGT-pijlers).
- Twee pylonen van elk twee betonnen kolommen van 5,0 × 2,6 m, 10,7 m naast de
  as in de berm tussen de rijbaan en de lokale weg (BGT, luchtfoto), met een
  afgeronde kap waarin de tuien over zadels lopen (tot 3,0 m naast het hart
  uitwijkend) en de top op +69,0 m (AHN). Tussen de kolommen een dwarsregel van
  4,5 m dik van +50,0 tot +54,5 m (AHN, luchtfoto); de onderkant heeft een
  spitse groef van 50 graden zodat hij zonder steun print. Onder het dek zijn
  de poten 6,0 × 5,4 m (6,6 tot 12,0 m naast de as, foto's) en staan ze op het
  caisson van de pylonpijler (BGT-vorm 7,1 × 37,2 m met ronde koppen, tot
  +13 m).
- Per kolom vier tuien in het vlak van de kolom, van de kap (+67,2 m) naar
  ankerblokken op het dek op 45,9 m (binnenste, 44,5 graden) en 92,6 m
  (buitenste, 25,5 graden) van de pylon, naar de hoofdoverspanning en naar de
  zijoverspanning; de buitenste achtertuien komen uit boven de zijpijlers. De
  ankerblokken (BGT) zijn 5 × 2 m (buitenste) en 2 × 2 m (binnenste), 1,2 m
  boven het wegdek. Tussen x = -38 en 38 staan geen tuien.
- De zijpijlers en de overgangspijler: wanden met ronde koppen (BGT, 3,0 ×
  29,5 m en 3,0 × 25,6 m) tot +13 m, daarop twee kolommen van 3,0 × 6,0 m
  (8,9 en 7,6 m naast de as, foto's) tot onder het dek.
- De aanbrug over de noordelijke uiterwaard: tien steunpunten om de 78,2 m met
  elk twee wandpijlers van 2,1 × 9,2 m met ronde koppen (BGT), 6,85 m naast de
  as en haaks op de boog.
- Het zuidelijke landhoofd (BGT, 2,8 m) en het noordelijke (BGT, 1,6 m, haaks
  op de boog), tot het wegdek.

Rijbanen met PDOK-attributen: op het dek liggen alleen actuele BGT-wegdelen met
relatieve hoogteligging 1 met functie `rijbaan regionale weg` (46 vlakken van
100 m, zoals `P0025.30c9750d51164914b71dd04bf6a136cd`, samen tot 8,8 m naast de
as, op de aanbrug 9,1 m) en `rijbaan lokale weg` (28 vlakken, zoals
`P0025.48a92572f3d348168549c0e952823f0d`, aan beide kanten van 12,0 tot 15,15 m
naast de as op het tuibruggedeelte en van 9,6 tot 13,1 m op de aanbrug), alle
gesloten verharding en asfalt, met daartussen bermen (ondersteunend wegdeel:
middenberm en geleiderails in cementbeton, en op het tuibruggedeelte een
asfaltberm van 9,3 tot 12 m naast de as waarin kolommen en tuien staan); geen
fietspad of voetpad. Eén node per functie: `road:rijbaan` met `bgt_functie`
rijbaan regionale weg en `road:rijbaan-lokaal` met `bgt_functie` rijbaan lokale
weg, beide met `bgt_fysiekvoorkomen` gesloten verharding en
`plus_fysiekvoorkomen` asfalt. De bermen horen bij de aangrenzende rijbaan,
met de grens in het midden van de berm: 10,7 m naast de as tot x = 230, 9,4 m
vanaf x = 306 en lineair daartussen. De laag is 0,5 m dik over het hele dek
tussen de schampkanten (2 cm vrij, dus tot 14,70 m naast de as op het
tuibruggedeelte); de snijstrook loopt tot 1 m boven het wegdek en 0,5 m voorbij
de landhoofden, over dezelfde stations als het dek. De kolommen en de
tuivlakken met hun ankerblokken (de strook 9,9 tot 11,5 m naast de as van de
kolom tot het buitenste anker) blijven met 2 cm vrij constructie. Volumes:
brug 135.969 m³, rijbaan 13.670 m³, lokale weg 4710 m³, constructie 117.589 m³;
samen precies de brug (het script controleert het). De z-fightingcontrole
(`zfight.py`, 30.000 stralen) vindt geen samenvallende vlakken. De STL bevat
de brug als geheel.

Niet in het model:

- Leuningen, geleiderails, lantaarns en bebording: dunner dan 0,9 m.
- De voegen in het wegdek (bij de overgangspijler en de landhoofden):
  smaller dan 0,9 m.
- Vrijstaande tuien: een tui van circa 1,2 m die 25 tot 45 graden helt is op
  1:1000 niet zonder steun te printen (zie hieronder).

Pasvorm op het AHN: het wegdek volgt het DSM-profiel binnen 0,1 m (95 % binnen
0,015 m); de kappen van de kolommen liggen op de hoogste DSM-cellen (NAP
+69,0 m), de dwarsregel op de bovenkant die het DSM tussen de kolommen ziet
(+54,5 m), en de tuien op de lijnen die het DSM in de vlakken 10,7 m naast de
as laat zien, tussen de kappen en de BGT-ankers.

Printbaarheid op 1:1000: elk tuivlak (per kolom en per kant, acht in totaal)
is een plaat van 0,9 m dik tussen kolom, dek en buitenste tui, met de tuien
als ribben van 1,1 m die 0,3 m uitsteken, en met negen doorgaande openingen:
onder de binnenste tui een rechthoekige driehoek tegen de kolom met een
schuine zijde van 50 graden (tot NAP +64 m), en daarnaast, daarboven en
daarbuiten driehoeken met de punt omhoog (zijden van 50 graden) en een vlakke
vloer; tussen de openingen stijlen van minstens 0,9 m en langs het dek een
strook van 1 m (de leuning). De dwarsregel heeft een spitse groef van 50
graden, de kap wordt naar boven smaller. Boven het wegdek hangt niets vrij;
alleen het dek met de kokers hangt tussen de pijlers vrij, en daar zet de
export een wig met een scherm onder (de STL heeft dezelfde printvoet). De
printcheck past het model op 400 mm in op 1:3614: constructie `NoError`,
8391 mm³ zonder en 7699 mm³ met de printbare overhangopvulling (-8,2 %, de
opvulling is kleiner dan de rechte 2,5D-opvulling), rijbaan en lokale weg
`NoError` met 0 en 0,1 % (de wegdelen krijgen geen eigen opvulling), in 7,3 s.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Prins_Willem-Alexanderbrug)
(bouwjaar, lengte 1419 m, breedte 31 m, overspanningen, doorvaarthoogte en
-breedte); PDOK BGT overbruggingsdeel (dek, landhoofden, pylonkolommen,
tuiankers, pijlers), wegdeel en ondersteunend wegdeel; AHN DSM/DTM 0,5 m via
WCS (wegdek, kolommen, dwarsregel, tuien, uiterwaarden); PDOK-luchtfoto
(kolommen, dwarsregel, ronde koppen van de pijlers, voegen); PDOK-terrein
(waterspiegel, NAP-ellipsoïde 43,59 m); Wikimedia Commons: Alexanderbrug
073.jpg, Alexanderbrug 075.jpg, Bij Beneden Leeuwen, brug foto10
2010-08-01 15.17.JPG, Bij Beneden Leeuwen, de Prins Willem Alexanderbrug IMG
2693 2019-10-26 13.07.jpg, Detailview of the Prins (since 2013, King^^)
Willem Alexander bridge (built 1973) near Tiel - panoramio.jpg, The first all
concrete cable stayed bridge (1973) of Holland over the Waal river -
panoramio.jpg.

Geschat (foto's): de hoogte van de caissons (NAP +13 m), de doorsnede van het
dek (koker 3,6 m hoog, één koker van 15 tot 17 m breed op het
tuibruggedeelte, twee onder de aanbrug), de poten van de pylonen onder het dek
(6,0 × 5,4 m, 6,6 tot 12,0 m naast de as), de kolommen op de zij- en
overgangspijlers (3,0 × 6,0 m), de vorm van de kap, de hoogte van de
ankerblokken (1,2 m) en de dikte van de dwarsregel (4,5 m, onderkant +50 m).

Licentie van het model: eigen werk op basis van open bronnen.
