# Hedelse brug (Hedel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hedelse-brug.glb` | Catalogusbron in meters, drie nodes: `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het dek en de landhoofden, met BGT-attributen), en `building:hedelse-brug` met de rest van het dek, de boog met trekband (twee boogribben met de hangers), de twee rivierpijlers, de zeven aanbruggen met hun pijlers en de twee landhoofden |
| `hedelse-brug-1-1250.stl` | De brug in één stuk op 1:1250 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (368 × 21 × 27 mm) |
| `hedelse-brug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (146802,10, 416790,88) (WGS84
51,73978 N, 5,26851 O), op de as van het BGT-dek midden onder de boog, op de
waterspiegel van de Maas (NAP +1,1 m) en de glTF-conventie Y omhoog. +X loopt
langs de brug naar het noorden, naar Hedel (`xAxis` (-0,16176, 0,98683),
99,31 graden linksom vanaf het oosten), +Y stroomafwaarts naar het westen.
Het zuidelijke landhoofd ligt op x = -163 tot -150,9, de rivierpijlers op
x = -64,1 tot -58,6 en 62,1 tot 67,6, de aanbrugpijlers op x = -106,1
(geschat) en 110,8, 153,9, 198,9 en 236,9 (BGT) en het noordelijke landhoofd
op x = 284,8 tot 297. Het maaiveld wordt op zes punten op het water naast de
boog bemonsterd (`groundSamplePoints`, 25 m naast de as op x = -40, 0 en 40);
`groundOffsetMetres` is 0, want het PDOK-terrein legt de Maas op 44,64 m
ellipsoïdisch, de waterspiegel van het model. Omdat de brug 460 m lang is,
staat die hoogte ook als vaste terugval in `groundHeight` (44,64), zodat een
uitsnede die alleen een aanbrug raakt het model niet laat wegvallen. Geen
BAG-pand onder de brug.

Er ligt hier één brug. De A2 liep tot 1970 over deze brug en kruist de Maas
nu elders; de Hedelse spoorbrug ligt 400 m stroomopwaarts en heeft een eigen
model (`hedelse-spoorbrug`). De twee modellen overlappen niet.

Onderdelen in het model (hoogtes in NAP):

- Rijbaan en fietspaden als eigen nodes van klasse `road`: de bovenste 0,5 m
  van het dek en de landhoofden, van x = -163 tot 297, met de attributen in
  `extras.attributes`, zodat de kleurregels van een thema (fietspaden rood)
  op de brug werken zoals op de PDOK-wegdelen ernaast:

  | Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | Ligging |
  | --- | --- | --- | --- | --- |
  | `road:rijbaan` | rijbaan lokale weg | gesloten verharding | asfalt | tussen de vangrails, y = -4,65 tot 4,9 |
  | `road:fietspad` | fietspad | gesloten verharding | asfalt | aan weerszijden van de dekrand (onder de boog de rib) tot de vangrails |

  Op het dek ligt in de BGT geen wegdeel: alleen het overbruggingsdeel
  `L0002.8e874d355c3a4490bc40c013d1b3c2d4` (dek, relatieve hoogteligging 1);
  de wegdelen van de gemeenten houden op bij de dekeinden. Volgens de
  uitwijkregel komen de functies daarom van de wegdelen op de landhoofden.
  Aan de zuidkant ('s-Hertogenbosch): `G0796.340be0875db3bf87e0538d1013ac73b0`
  (rijbaan lokale weg) met de fietspaden `G0796.340be086e04abf87e0538d1013ac73b0`
  (oost) en `G0796.31dfe31c4de52e23e0636a3013acf40e` (west), alle gesloten
  verharding, asfalt. Aan de noordkant (Maasdriel) staan dezelfde drie
  stroken alle als rijbaan lokale weg in de BGT
  (`G0263.c315b8673a284fbea79e2f98087a7223` midden,
  `G0263.e8c1245da627422980d225435066f793` oost,
  `G0263.61fa395127934899b3a63cfe5f060293` west). De PDOK-luchtfoto toont over
  de hele brug, ook onder de boog, rode fietspaden aan beide kanten tussen de
  dekrand en de vangrails (op y = -4,6 en 4,85); daarom zijn de buitenste
  stroken fietspad, met de attributen van de zuidelijke wegdelen. De
  boogribben blijven over hun hele strook (ook onder de openingen van het
  hangerscherm) constructie, met 2 cm vrij; de constructie houdt onder rijbaan
  en fietspad 0,5 m onder het wegdek op, zodat er geen samenvallende
  bovenvlakken zijn.

- Het dek van 435,7 m van landhoofd tot landhoofd (BGT), 16,5 m breed over de
  aanbruggen en 18,2 m onder de boog, met het wegdek volgens het AHN-DSM om de
  2 m: +13,1 m aan de zuidkant, +14,4 m in het midden van de boog en +12,9 m
  aan de noordkant.
- De boog met trekband van 124,76 m tussen de opleggingen (Structurae): twee
  boogribben van 1,2 m breed en 2,0 m hoog op de randen van het dek (AHN:
  8,75 m naast de as), met de bovenrand als parabool met de top op +34,1 m
  (20 m boven het wegdek) die het wegdek 60,5 m uit het midden kruist (AHN).
  De trekband loopt 2,8 m diep langs het dek; de onderkant ligt op +11,4 m
  (Wikipedia).
- De 11 hangers op velden van 10,4 m (de dwarsbalken van het windverband op
  de luchtfoto): tussen dek en rib een scherm van 1,2 m met tien spitse
  openingen (zijden van 55 graden) tot net onder de rib, de hoogste tot
  +31,9 m; in de twee buitenste velden is de opening versmald tot ze onder de
  lage rib past, in de velden bij de opleggingen is het scherm dicht.
- Twee rivierpijlers van 5,5 × 26 m met ronde koppen (BGT), tot onder het
  dek.
- Twee aanbruggen aan de zuidkant en vijf aan de noordkant (liggerbruggen,
  velden van 38 tot 48 m): een dekplaat van 1,0 m die 1,4 m buiten de liggers
  uitsteekt, liggers tot 2,5 m onder het wegdek, op pijlers van 4,7 × 17 m met
  ronde koppen (BGT; de zuidelijke tussenpijler is geschat).
- Twee landhoofden tot waar het AHN-maaiveld het wegdek bereikt.

Wat er niet in zit: het windverband en de portalen tussen de boogribben (een
vrije horizontale overspanning van 17 m, die op 1:1000 niet zonder steun
print), de echte hangers van circa 0,4 m (vervangen door het scherm),
leuningen, lantaarns en de bebording.

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke wegstrook zonder boog en zonder pijlers op dekhoogte. Het model heeft
van alle vier kanten de boog met hangers (van oost en west het scherm met de
spitse openingen, van noord en zuid de twee ribben achter elkaar), de
rivierpijlers met ronde koppen, de rij aanbrugpijlers en de teruggezette
liggers onder de dekrand.

Pasvorm op het AHN: over het wegdek ligt 91 % van de DSM-cellen binnen 2 m van
het model (86 % binnen 1 m, mediaan +0,03 m). Op de smalle boogribben ziet het
AHN per cel vaak het water ernaast; de omhullende per 8 m (hoogste DSM-cel op
beide ribben) ligt in 13 van de 14 vakken binnen 1 m van de bovenrand van het
model en in alle vakken binnen 2 m (mediaan 0,00 m).

Printbaarheid op 1:1000: de echte hangers en het windverband zijn te dun of
liggen horizontaal. De ribben zijn banden van 1,2 m die via het scherm met
spitse openingen op het dek staan, zodat de onderkant van de rib nergens vrij
hangt. Alleen de onderkant van het dek en van de dekranden langs de aanbruggen
hangt vrij (7028 m²); het script controleert dat alleen die naar beneden
wijzen, dat alles op dezelfde onderkant begint en dat de printversie geen
overhang heeft. Met 460 m past de brug op 1:1000 niet in één uitsnede; in een
uitsnede van 487 m (1:1217, 400 mm) gaat het model in de printcheck als
gesloten solid met overhangopvulling door (alle drie de onderdelen status
NoError, 2,7 s, samen 41,8 naar 32,1 cm³ ten opzichte van de rechte
opvulling): onder het dek komt een wig met een smal scherm tot de onderplaat,
de spitse openingen in het scherm blijven open. De opvulling gaat helemaal
naar de constructie (39,8 naar 30,1 cm³); rijbaan (1,2 cm³) en fietspad
(0,8 cm³) krijgen geen eigen opvulling. De STL op 1:1250 heeft dezelfde printvoet (wig van 50 graden en een
scherm van 0,9 m).

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Hedelse_brug) (1937,
boog- en liggerbrug, verwoest in 1940 en 1944 en herbouwd),
[Wikipedia (en)](https://en.wikipedia.org/wiki/Hedel_Bridge) (boog met
trekband, onderkant NAP +11,40 m, twee rivierpijlers en vijf kleinere
pijlers), [Structurae](https://structurae.net/structures/hedel-road-bridge)
(5 × 43,5 m, 124,76 m, 2 × 43,5 m, totaal 436 m), PDOK BGT
(overbruggingsdeel: dek, rivierpijlers, aanbrugpijlers; wegdelen op de
landhoofden voor de functies van rijbaan en fietspad), PDOK AHN (dsm en dtm
0,5 m via WCS: wegdek, boogribben, landhoofden), de PDOK-luchtfoto (hangers,
windverband en de ligging van de fietspaden op het dek) en het PDOK-terrein (waterspiegel), en de Wikimedia
Commons-foto Zichtopbrughedel.jpg voor de boogribben, de hangers en de liggers
van de aanbruggen. Geschat zijn de waterspiegel (NAP +1,1 m: PDOK-water 44,64 m
ellipsoïdisch min 43,55 m, het verschil tussen PDOK-terrein en AHN in de
uiterwaard), de doorsnede van de ribben (1,2 × 2,0 m), de dikte van de
dekplaat (1,0 m) en de diepte van de liggers van de aanbruggen (2,5 m), de
plaats van de zuidelijke tussenpijler (midden tussen rivierpijler en
landhoofd, niet in de BGT) en de achterkant van de landhoofden (waar het
AHN-maaiveld het wegdek bereikt).

Licentie van het model: eigen werk op basis van open bronnen.
