# Brug bij Heusden (Heusden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `brug-bij-heusden.glb` | Catalogusbron in meters: nodes `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het dek tussen de verhoogde stroken, met de attributen van het BGT-wegdeel in `extras.attributes`: `bgt_functie` `rijbaan regionale weg` voor de rijbaan van de N267 en `fietspad` voor de twee fietspaden, beide `bgt_fysiekvoorkomen` `gesloten verharding` en `plus_fysiekvoorkomen` `asfalt`; zo werken de kleurregels van een thema op het brugdek) en `building:brug-bij-heusden` met het dek, de scheidingen en randen, de portaalpyloon met kop, verdiept vlak met spitse onderkant en rode kappen, de sloof met sokkels, vier tuiwaaiers, de overgangspijler, zes wandpijlers en twee landhoofden |
| `brug-bij-heusden-1-1500.stl` | De brug in één stuk op 1:1500 met een printvoet onder het dek, met de onderkant (NAP -0,17 m) op het printbed (375 × 20 × 34 mm) |
| `brug-bij-heusden.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (136424,26, 416375,78) (WGS84
51,73580 N, 5,11829 O), op de as van het BGT-dek midden op de sloof van de
pyloon, op de waterspiegel van de Bergsche Maas zoals het PDOK-terrein die
legt (z = 0 is NAP +0,63 m; het PDOK-terrein legt het water op 44,21 m
ellipsoïdisch, het verschil NAP-ellipsoïde is daar 43,58 m) en de
glTF-conventie Y omhoog. +X loopt langs de brug naar het noorden, naar
Hedikhuizen (`xAxis` (-0,286211, 0,958167), 106,63 graden linksom vanaf het
oosten, uit de evenwijdige randen van het BGT-overbruggingsdeel), +Y naar het
westen (stroomafwaarts). Het dek loopt van het zuidelijke landhoofd op
x = -127,9 tot het noordelijke op x = 435,0 (BGT); de pyloon staat op
x = -0,4. Het maaiveld wordt op achttien punten bemonsterd
(`groundSamplePoints`): 20 m aan beide kanten van de as op x = -95, -45, 0,
45, 90, 150, 220, 290 en 360 (zuidelijke uiterwaard, de rivier en de
noordelijke uiterwaard). `groundOffsetMetres` is 0; omdat de brug 563 m lang
is, staat de laagste PDOK-hoogte op die punten (44,21 m ellipsoïdisch, de
Bergsche Maas) ook als vaste terugval in `groundHeight`, zodat een uitsnede
die alleen de aanbrug raakt het model niet laat wegvallen. De onderkant ligt
op NAP -0,17 m, net onder de waterspiegel. Er ligt geen BAG-pand onder de
brug (de PDOK-dump van de uitsnede heeft geen gebouwen); `replacesBuildings`
ontbreekt.

De brug draagt de N267 over de Bergsche Maas tussen Heusden en Hedikhuizen.
Het is een tuibrug: één portaalpyloon in de rivier met
per kant twee waaiers van tuien naar een zuidoverspanning van 119 m tot het
landhoofd en een noordoverspanning van 113 m tot de overgangspijler, daarna
een aanbrug van 322 m over de noordelijke uiterwaard. De tuien liggen niet
langs de randen maar op de scheidingen tussen de rijbaan en de fietspaden.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek volgens het AHN-DSM om de 4 m (40e percentiel op de rijbaan,
  bij de pyloon lineair): +11,0 m bij het zuidelijke landhoofd, +11,46 m bij
  de pyloon en +8,9 m bij het noordelijke landhoofd.
- Het dek van 21,1 m breed (BGT): in de tuioverspanning een slanke ligger met
  een rand van 1,0 m en een schuine onderkant naar een bodem van 13 m breed,
  2,2 m onder het wegdek; op de aanbrug een kokerligger met een rand van
  0,8 m en een bodem van 10,4 m, 3,0 m onder het wegdek (foto's).
- Scheidingen van 0,9 m hoog (AHN) op de stroken cementbeton tussen rijbaan
  en fietspaden (|y| 4,45 tot 5,9, BGT) en randen van 0,5 m op de stroken
  cementbeton langs de buitenkant (|y| 9,4 tot 10,55) in plaats van de
  leuningen.
- De rijbaan van de N267 (|y| ≤ 4,43) en de twee fietspaden (5,92 ≤ |y| ≤
  9,38) als eigen `road:`-nodes, de bovenste 0,5 m van het dek tussen de
  verhoogde stroken.
- De portaalpyloon: twee betonnen poten van 2,8 m breed en 3,4 m langs de as,
  waarvan de buitenkant van 13,1 m naast de as op dekhoogte naar 9,1 m in de
  top loopt (circa 6 graden, AHN en foto's), van de sokkels (+5,5 m) tot de
  kop. De kop tussen de poten van +45,3 tot +49,7 m (AHN tussen de kappen,
  foto's). Onder de kop een afschuining van 50 graden naar een 0,35 m
  verdiept vlak van 2,7 m dik met een spitse onderkant van 50 graden vanaf de
  poten (top +44,83 m, tegen de poten +36,7 m), zoals bij de dwarsregel van de
  Molenbrug: met alleen een kiel onder de kop zette de export een wand van de
  kop tot het wegdek. Op de foto's heeft de doorgang alleen kleine schuine
  hoeken; de spitse top is een aanpassing voor het printen zonder steun.
  Erop twee rode kappen van 7,45 m breed en 3,0 m langs de as tot +51,4 m,
  met 3,2 m vrij in het midden (AHN 51,51 m, foto's).
- De sloof in de rivier volgens de BGT (5,2 m langs de as, tot 14,8 m naast
  de as met ronde koppen vanaf 12,7 m) tot +4,3 m, met onder de poten sokkels
  tot +5,5 m (AHN) vanaf 10 m naast de as.
- Per kant en per overspanning een waaier van acht tuien (foto's, geschat),
  verankerd in de kop op +46,0 tot +48,9 m (om de 0,42 m), op de scheiding
  21 tot 109,2 m van de pyloon om de 12,6 m, 5,175 m naast de as. Elke waaier
  is een verticale plaat van 0,9 m met de tuien als ribben van 1,0 m die
  0,25 m uitsteken en daartussen 67 doorgaande openingen per overspanning
  (verticale zijde aan de kant van de pyloon, bovenzijde van 55 graden, punt
  aan de dekkant afgeknot op 0,15 m). De eerste 8 m vanaf de pyloon is de
  omhulling van de ribben (een bundel van 1,4 m dik); onder de kortste tui
  (59 graden) is de doorgang open.
- De overgangspijler op x = 112,9 (3,75 m dik) en zes wandpijlers van
  1,65 × 11,8 m op x = 152,1, 199,6, 247,0, 294,4, 341,8 en 389,2 (BGT).
- Twee massieve landhoofden (BGT): x = -127,9 tot -119,2 en 425,4 tot 435,0.

Wat er niet in zit: de echte tuien van circa 0,2 m (vervangen door de
tuiplaten met ribben en openingen), de spreiding van de ankers over de
breedte van een kap (op de foto van voren een V-vormige waaier; hier ligt elke
waaier in één verticaal vlak), leuningen, geleiderails, lantaarns en de
witte beschermbuizen aan de voet van de tuien (dunner dan 0,9 m), de
bliksemafleiders op de kappen, de smalle geleidewerken van circa 25 m die
bij de pyloon de rivier in steken (dunner dan 0,9 m), de vleugelmuren van
het noordelijke landhoofd (die liggen in het dijklichaam dat PDOK al heeft)
en de kleine brug noordelijk van het landhoofd (een eigen BGT-dek, blijft
PDOK).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): PDOK heeft geen
gebouw op de brug; het dek is alleen een vlakke grijze wegstrook op
dekhoogte zonder pyloon, tuien, pijlers of ligger. Het model heeft van
noordwest en zuidoost (325 en 145 graden) de portaalpyloon met kop en kappen
en de vier tuiwaaiers met hun openingen, de sloof met sokkels in het water,
de zeven pijlers onder de aanbrug en de ligger met zijn schuine onderkant;
van noordoost en zuidwest (55 en 235 graden) het silhouet van de waaiers aan
beide kanten van de pyloon en de rij wandpijlers; van alle kanten de
scheidingen tussen rijbaan en fietspaden en de opstaande randen.

Pasvorm op het AHN: buiten 60 m van de pyloon ligt op de rijbaan 95,6 % van
de DSM-cellen binnen 1 m van het wegdek van het model (14 467 cellen, mediaan
+0,01 m; de rest zijn auto's en lantaarns), op de fietspaden 98 % (mediaan
-0,13 m: de fietspaden liggen iets lager dan de rijbaan). De hoogste
DSM-cel op de pyloon ligt op +51,51 m tegen +51,4 m in het model; tussen de
kappen ziet het AHN de kop op +49,7 m.

Printbaarheid op 1:1000: de tuien zijn te dun en hangen te flauw. De
tuiwaaiers zijn dichte platen van 0,9 m met ribben van 1,0 m; elke opening
heeft een bovenzijde van 55 graden, zodat boven het dek geen vlak flauwer dan
50 graden vrij hangt, en de kortste tui (59 graden) vormt de onderrand van de
plaat. De kop rust op het verdiepte vlak met de spitse onderkant. Alleen de
onderkant van het dek, de pijlers en de sokkels hangen vrij (11 702 m2,
allemaal onder het wegdek). De brug is 563 m lang en past op 1:1000 niet in
400 mm; de printcheck (`prepareMeshes` met de printbare overhangopvulling)
rekent daarom op 1:1439: status NoError voor alle drie de onderdelen,
constructie 27 767 mm3 zonder en 27 409 mm3 met opvulling (-1,3 %), rijbaan
en fietspad 0 % (de constructie draagt alles); op 1:1500 ook NoError
(-5,9 %, de wegdelen 0 %). Een verticale straal door de doorgang van de
pyloon raakt na het wegdek pas het verdiepte vlak onder de kop (met alleen
een kiel vulde de export de doorgang tot het wegdek). Onder het dek zet de
export een wig met een smal scherm tot de onderplaat, vast aan de pijlers en
de sloof; de STL heeft dezelfde printvoet. De wegdelen en de constructie
hebben geen samenvallende bovenvlakken (`zfight.py`, 30 000 stralen: geen
z-fighting tussen nodes; 2 tot 3 splinters in de constructie waar ribben
schuin door een scheiding of langs elkaar lopen, minder dan bij de
goedgekeurde Molenbrug en Eilandbrug).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Brug_bij_Heusden) (type,
lengte 540 m), PDOK BGT overbruggingsdeel (dek
P0030.00f6f96959eaf68ae050120a080440dd, landhoofden, sloof, pijlers) en
wegdeel (rijbaan regionale weg en fietspad, asfalt, relatieve hoogteligging
1), PDOK AHN DSM/DTM 0,5 m (WCS), PDOK-luchtfoto (Actueel_orthoHR) voor de
kappen, de tuivlakken en de indeling van het dek, en Wikimedia Commons-foto's
(`N267 bij Heusden.jpg`, `2007-10-07 12.42 Heusden, brug over de Bergse Maas
foto2.JPG`, `Heusden-Aalburg Bridge.JPG`, `Overzicht van de overgebleven
elementen van de oude brug over de Bergsche Maas, de nieuwe brug op de
achtergrond - Heusden - 20413539 - RCE.jpg`).

Geschat: het aantal tuien (acht per waaier), hun ankerhoogtes en
voetafstanden (de foto's laten de tuien zien maar niet scherp genoeg om ze
te tellen; de luchtfoto toont de ankerlijnen op de scheidingen), de diepte en
vorm van de ligger in de tuioverspanning (2,2 m) en van de kokerligger van
de aanbrug (3,0 m), de hoogte van de lagere sloof tussen de sokkels (+4,3 m),
de onderkant van de kop (+45,3 m, uit de foto's) en de dikte van de poten
langs de as (3,4 m). Geen bouwjaar of ontwerper in de gebruikte bronnen.

Licentie van het model: eigen werk op basis van open bronnen.
