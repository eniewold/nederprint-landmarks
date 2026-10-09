# John F. Kennedybrug (Maastricht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kennedybrug-maastricht.glb` | Catalogusbron in meters: zeven `road:`-nodes (de bovenste 0,5 m van het wegdek met de BGT-attributen, zie hieronder) en `building:kennedybrug-maastricht` met de rest van het kunstwerk: dekplaat en twee kokerliggers van het hoofddek, de aanzetten van de twee krullen met dekplaat en koker, de twee U-vormige rivierpijlers, 56 ronde kolommen, vier landhoofden, de doorlopen naar het PDOK-wegvlak aan alle vier de einden, schampkanten, verkeerseilanden en de middenberm |
| `kennedybrug-maastricht-1-1750.stl` | De brug als geheel in één stuk (constructie en wegdelen samen) op 1:1750 met een printvoet onder het dek en dichtgezette doorgangen in de rivierpijlers, met de onderkant (0,8 m onder de waterspiegel) op het printbed (372 × 123 × 8 mm; met `--scale` een andere schaal, op 1:1000 is hij 652 mm lang) |
| `kennedybrug-maastricht.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (177017,00, 316930,76) (WGS84
50,84180 N, 5,69977 O, 45 m oostzuidoost van de controle-URL), op de as van
het dek midden tussen de rivierpijlers, op de waterspiegel van de Maas
(stuwpeil Borgharen, NAP +44,0 m; PDOK-terrein 89,89 m ellipsoïdisch) en de
glTF-conventie Y omhoog. +X loopt langs het rechte oostelijke deel van de
brug naar Céramique (`xAxis` (0,9407, -0,33924), 19,83 graden rechtsom vanaf
het oosten, uit de BGT-randen van het dek), +Y stroomafwaarts naar het
noordnoordoosten. Het dek is recht vanaf x = -202,7 en buigt westelijk
daarvan in een boog met een straal van 396 m naar -Y (fit op de
BGT-dekranden, restfout 7 cm); dek, kolommen en het westelijke landhoofd
volgen die boog. Rivierpijlers op x = ±56,05 (BGT), kolomrijen op -329,2,
-296,3, -260,3, -224,4, -188,5, -152,4 en -116,5 (west) en 115,8, 151,9,
188,0 en 223,8 (oost); het dek eindigt op x = 264,4 (oost) en op de BGT-lijn
rond x = -331,6 (west), de doorlopen (zie hieronder) op x = 279,4 en -371,6. Het maaiveld wordt op acht punten op de Maas
bemonsterd (`groundSamplePoints`: 24 m naast de as op x = -65, -20, 20 en
45, naast de rivierpijlers); `groundOffsetMetres` is 0 en `groundHeight`
89,89 m, de PDOK-waterspiegel op die punten, zodat een uitsnede die alleen
een aanbrug raakt (waar de kades 4 tot 5 m hoger liggen) het model niet laat
wegvallen of optillen. `replacesBuildings` is leeg: onder de brug ligt alleen
een deel van BAG-pand `0935100000023841` (de Céramique-bebouwing aan beide
kanten van de brug, x = 131 tot 170); PDOK reconstrueert dat deel onder het
dek tot NAP +53,0 m, onder de onderkant van de kokers (+53,7 m), en het pand
zelf blijft staan. PDOK legt de brug zelf als BGT-wegdek plat op de
waterspiegel en de kades; `replacesTerrain` verbergt de twee
overbruggingsdelen (`L0002.119b2bf7ea9640f3ba164b9d9b20246e` en
`G0935.f71ef2ef35924cea9e25a03913abc6c5`) zolang het model zichtbaar is.

Aansluiting op het PDOK-wegvlak (doorlopen). Het model volgt het AHN, maar
PDOK legt de wegen voorbij de BGT-einden van de brug op het maaiveld, terwijl
ze in werkelijkheid op een aarden lichaam met keerwanden verder lopen (het
AHN-DTM heeft daar geen maaiveld). Gemeten in een PDOK-dump (PDOK = NAP +
45,76 m op de kades en de straten, NAP + 45,89 m op de Maas; het model staat
op de PDOK-waterspiegel) lag het wegdek van het model op de BGT-eindlijnen
3,5 tot 4,6 m boven het PDOK-wegvlak aan de westkant, 4,0 tot 4,4 m aan het
einde van beide krullen, en aan de oostkant 0,4 m boven de stoepen en
fietspaden maar 1,5 tot 4,0 m boven de rijstroken (die daar in PDOK onderling
2,5 m verschillen). Een verticale verschuiving van het hele model zou dat niet
oplossen: de verschillen zijn per einde anders, en de waterspiegel en de kades
hebben op 0,13 m na dezelfde PDOK-NAP-verschuiving. Daarom loopt het wegdek
vanaf 10 m binnen de eindlijn lineair naar een punt 0,3 tot 0,5 m onder het
PDOK-wegvlak, op een massief blok dat de lijn van de brug volgt:

| Einde | Doorloop | Wegdek 10 m binnen de eindlijn → einde doorloop (NAP) | Helling | Verschil met PDOK aan het einde |
| --- | --- | --- | --- | --- |
| west | 40 m langs de boog tot x = -371,6 | +52,1 tot +53,0 → +47,9 tot +48,6 (dwarshelling naar PDOK) | circa 8 % | 0,28 tot 0,33 m eronder |
| oost | 15 m tot x = 279,4 | +53,7 → +52,55 | 4,6 % | stoepen en fietspaden 0,22 tot 0,24 m eronder; de PDOK-rijstroken liggen 0,6 tot 2,9 m lager (PDOK-fout, zie onder) |
| krul noord | 50 m langs de lus (tot 41,9 graden) | +52,5 → +47,0 | circa 9 % | 0,25 tot 0,30 m eronder |
| krul zuid | 50 m langs de lus (tot 308,9 graden) | +52,3 → +47,5 | circa 8 % | 0,35 tot 0,37 m eronder |

Over het grootste deel van de doorloop ligt het wegdek boven het PDOK-wegvlak
en pas in de laatste 5 tot 10 m eronder, zodat er geen trede of spleet
overblijft. De laatste 10 m van de brug zelf zakken daardoor tot 1 m onder het
werkelijke wegdek; de brug boven de Maas blijft op het AHN (wegdek +57,0 m,
onderkant +54,0 m midden in het hoofdveld, doorvaarthoogte 9,9 m boven de
waterspiegel van +44,1 m). Op de doorlopen dragen de wegdelen de attributen
van de BGT-wegdelen op het maaiveld eronder (zie de tabel); schampkanten,
verkeerseilanden en middenberm stoppen op de BGT-eindlijn. Aan de oostkant
blijft een verschil met de PDOK-rijstroken staan: PDOK legt de vier
rijstroken daar 1 tot 3,7 m lager dan de stoepen ernaast en dan het AHN
(NAP +53,3 m), en één vlak wegdek kan daar niet op alle vier aansluiten.

Waar krul en hoofddek nog aan elkaar vastzitten (x = -196 tot -112) ligt het
wegdek in het AHN zonder trede; in de eerste versie stond daar een trede van
tot 0,48 m (de krul volgde alleen zijn eigen helling). De hoogte van de krul
loopt nu over 10 m vanaf de rand van het hoofddek naar die van het hoofddek op
(gemeten trede op de grens: hoogstens 2 cm).

Op 300 tot 800 m stroomafwaarts liggen de Hoge Brug (`hoge-brug-maastricht`)
en de Sint-Servaasbrug (`sint-servaasbrug`); de modellen overlappen niet (de
noordelijke krul eindigt op RD y = 317094, het zuidelijkste punt van de Hoge
Brug ligt op y = 317398, 304 m noordelijker).

Wegdelen met PDOK-attributen: de bovenste 0,5 m van het wegdek is per
combinatie van BGT-attributen een eigen node van klasse `road` met de
attributen van de actuele BGT-wegdelen erop (relatieve hoogteligging 1,
zonder `eind_registratie`) in `extras.attributes`, zodat de kleurregels van
een thema op de brug werken zoals op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan lokale weg | gesloten verharding | – | `L0002.1746f279e7104d6c8b618d1aedf51c34`, `L0002.b45b03e32a184d058cccb0b7e28533e9` | de rest van het wegdek tussen schampkanten, verkeerseilanden en middenberm: twee rijstroken per richting en de rijbanen van beide krullen |
| `road:fietspad` | fietspad | gesloten verharding | – | `L0002.453728fe380e4663b6e717f233115ceb`, `L0002.a39b742a62bb45db885ffcec8fc46add`, `L0002.c09291dad1264b279507ebe929e05a96`, `L0002.f9da20ae99264df9b048a476d282861f` | aan beide kanten tussen verkeerseiland en voetpad (y = ±9,1 tot ±11,4), ook de krullen op |
| `road:voetpad` | voetpad | gesloten verharding | – | `L0002.3534fe3667a94b89a44628a8245e1474`, `L0002.77d9475db6d24ffa8245d17880619597`, `L0002.2e68d7b43a64451a99fd32fb2bf1dbc9`, `L0002.35277d9207a94e80b78792f8c5669bc9`, `L0002.5a0c5ae0f5de473b8e75cde3f2880028` | langs beide randen (BGT 2 m, binnen de schampkant 1,1 m) en rond de binnenkant van de noordelijke krul |
| `road:voetpad-open-verharding` | voetpad | open verharding | – | `L0002.4f1f861ca7144865bf775239d385262d`, `L0002.6596fbc110e647c7a6720e377a392923`, `L0002.9f876b3b95884987b5dd00aebab26e9c` | langs de randen van het westelijke deel (x < -178) |
| `road:fietspad-asfalt` | fietspad | gesloten verharding | asfalt | `G0935.26e202459246434692a7fe5bb1940ffe`; op de doorlopen `G0935.7947f3c72e494613adf2f6f89163b243`, `G0935.0e537edc6466474dbf49bacc5031c587`, `G0935.efa2208b76c84801a0466c3ae9238331`, `G0935.f0b45dddda1a48e8b97dcd1f2f629a1b`, `G0935.f27a825530e246df84d67fca414a7115` | op het dek van de zuidelijke krul (eigen BGT-vlak van de gemeente) en de fietspaden op de doorlopen west en oost |
| `road:rijbaan-asfalt` | rijbaan lokale weg | gesloten verharding | asfalt | `G0935.facfa8e368434c3e9b32422dcbdd403b`; op de doorlopen `G0935.39b9986aae514aa9b3bf79d6d8a561bc`, `G0935.bc4128a087474c1fa074ce54b501c347`, `G0935.e8c112cab03a43d491a559c088aa0e80`, `G0935.f8cf47d73579415182fd6a7c50409d6c`, `G0935.483e9120be7d45a1b94e15b7837a34b7`, `G0935.b21ba741483c4b348595ecb51a8b0e19` | idem, en de rijbanen van de doorlopen (west en de krullen) |
| `road:voetpad-tegels` | voetpad | open verharding | tegels | op de doorlopen `G0935.cd48b4cc31b54862955c72568aaff17e`, `G0935.cb1a062342d74f77bfd19c4f3266cca8`, `G0935.4b8d94f3ab67497299f7077626b49ab0`, `G0935.a98fccf9a6ef4154a21a86d29ddc11a8`, `G0935.1a74e9bc723b472fa9325109148e3318` | de stoepen op de doorlopen west en oost |

Eén node per attribuutcombinatie: de voetpaden in open verharding en in
tegels en het asfalt van de gemeente (dek van de zuidelijke krul en de
doorlopen) hebben elk een eigen node; de rest van een doorloop (waar de
lus-doorlopen over parkeervakken of straatstenen van de echte lus vallen) is
`road:rijbaan`. Fietspaden en voetpaden komen uit de BGT-contouren (lokaal,
vereenvoudigd tot 5 cm, 6 cm groter genomen zodat de naden tussen de
contouren geen reepjes rijbaan opleveren); de rest van de strook is rijbaan.
De schampkanten met leuningvoet langs alle randen (0,9 m breed, 0,6 m boven
het wegdek; niet over de eindlijnen), de verkeerseilanden tussen fietspad en
rijbaan (BGT ondersteunend wegdeel, 0,3 m) en de middenberm met de dubbele
geleiderail (BGT berm, 0,8 m) blijven constructie. De laag is een snijstrook
per gebied (hoofddek langs de as om de 2 m, krullen rond hun middelpunt om de
1,5 graad), van 0,5 m onder tot 1 m boven het wegdek en tot 1 m buiten de
brug; schampkanten, verkeerseilanden en middenberm blijven over hun hele
hoogte met 2 cm vrij constructie. De volumes tellen op tot die van de brug als
geheel (constructie 47.493 m³, rijbaan 5.683 m³, rijbaan asfalt 611 m³,
fietspad 1.489 m³, fietspad asfalt 232 m³, voetpad 591 m³, voetpad open
verharding 185 m³, voetpad tegels 50 m³, samen 56.335 m³, geen overlap; het
script controleert dat). Verticale stralen (`zfight.py`, 30.000 punten) vinden geen
samenvallende bovenvlakken en geen vlakken zonder dikte.

Onderdelen in het model (hoogtes in NAP):

- Het hoofddek van 596 m tussen de BGT-einden, 26,7 tot 27,2 m breed. Het
  wegdek volgt het AHN-DSM als regelmatig lengteprofiel: horizontaal op
  +57,01 m tussen x = -40,8 en 41,8, topbogen met een straal van 4300 m en
  daarbuiten 1,85 % naar het westen (+52,4 m aan het westeinde) en 1,94 %
  naar het oosten (+53,5 m), in de laatste 10 m naar de doorlopen; in de boog is het dwarsprofiel 3,6 % verkant
  (noordrand hoger), tussen x = -215 en -175 teruglopend naar vlak.
- Twee kokerliggers naast elkaar, één per rijrichting, hart op y = ±6,8
  (tussen de BGT-kolommen op ±4,3 en ±9,3): onderkant 6,2 m breed, schuine
  lijven tot 9,2 m bovenaan; een gezamenlijke dekplaat van 0,75 m boven de
  lijven die naar de randen dunner wordt (0,6 m op de dekrand, schuine
  onderkant van de uitkraging).
- De toog: de onderkant van de kokers ligt boven de rivierpijlers 5,6 m onder
  het wegdek (+51,4 m), loopt in het hoofdveld van 112,1 m parabolisch op naar
  3,0 m in het midden (+54,0 m) en in de zijvelden van 60,5 m terug naar 2,2 m
  bij de eerste kolomrij; de aanbruggen hebben 2,2 m.
- De twee rivierpijlers volgens de BGT (24 × 5 m met spitse koppen,
  evenwijdig aan de stroom, 20,3 graden uit de dwarsrichting): een muur tot
  +46,4 m met aan beide einden een taps toelopende kolom onder een koker
  (onderaan van 5,0 tot 12,5 m uit het hart, bovenaan van 5,6 tot 10,6 m) en
  daartussen de doorgang onder het dek, zoals op de foto's.
- 56 ronde kolommen van 1,2 m (BGT): vier per rij onder het hoofddek, vijf op
  x = -152,4 waar de krullen aftakken, en paren onder de krullen.
- De aanzetten van de twee krullen naar de Maasboulevard op de westoever,
  zoals de BGT ze als overbrugging registreert (tot de lijn waar de baan op
  een aarden lichaam verder loopt): dekplaat van 0,6 m en een koker van 1,8 m
  3 m binnen de randen; het wegdek daalt met de hoek rond het middelpunt van
  de lus (AHN, circa 3 %) van de hoogte van het hoofddek bij de splitsing
  (x = -112) naar +52,2 tot +52,4 m aan het einde. Waar krul en hoofddek nog
  samen lopen, is de grens de lijn waar de rijbaan van de krul begint; daar
  loopt de krul over 10 m naar de hoogte van het hoofddek op.
- Vier landhoofden: massieve blokken van 3 m onder de dekeinden (oost, west
  en de einden van beide krullen), en daarachter de doorlopen als massief
  blok tot het wegdek (zie boven).

Wat er niet in zit: lantaarnpalen, leuningen en geleiderails als staaf
(kleiner dan 0,9 m; de middenberm en de verkeerseilanden staan er als
verhoogde strook in), de smalle voeg tussen de twee kokers (0,3 m),
bebording, dilatatievoegen en afwatering, en het verdere vervolg van de wegen
op het aarden lichaam met keerwanden voorbij de doorlopen (PDOK-terrein en
BGT-wegdelen op hoogteligging 0). De doorlopen van de krullen volgen een
cirkel rond het middelpunt van de lus, niet de precieze lijn van de echte lus. In de PDOK-wegdelen ligt bij RD (176820, 317012) een kapotte driehoek van
de rijbaan tot 121 m ellipsoïdisch (spits door het dek); dat is een fout in de
PDOK-tegel, niet in het model.

Pasvorm: binnen de brug (BGT-overbrugging, 76.205 cellen van het AHN-DSM
0,5 m) ligt 94 % van de cellen binnen 1 m van het wegdek van het model (97 %
binnen 2 m, mediaan -0,02 m; de rest is verkeer, lantaarns en de verhoogde
stroken).

Printbaarheid: dragende delen zijn minstens 1,2 m (kolommen); de kolommen van
de rivierpijlers hellen aan de binnenkant 6 graden. Vrij hangen de onderkant
van de kokers, de uitkragende dekplaat en de krullen (samen 15.945 m²). Het
script controleert dat alles op dezelfde onderkant begint; de printversie (wig
van 50 graden vanaf de dekrand onder de kokerhoeken door tot een scherm van
0,9 mm op printschaal, onder de krullen rond het midden van de krul, en
dichtgezette doorgangen in de rivierpijlers) houdt 32 m² overhang aan losse
facetjes over. Met 652 m (met de doorlopen) past de brug op 1:1000 niet in
één uitsnede. In de printcheck (gesloten solids met overhangopvulling, status
`NoError` voor alle acht nodes): de hele brug op 1:1638 (400 mm) +29 %
opvulling voor de constructie (wig en scherm onder het dek en de krullen); de
wegdelen krijgen vrijwel geen eigen opvulling (0 tot 1,3 %): de constructie
draagt alles.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/John_F._Kennedybrug_(Maastricht))
(geschiedenis, geopend op 6 mei 1968, twee rijstroken per richting met
vrijliggend fiets- en voetpad, de krullen naar de Maasboulevard); PDOK BGT
overbruggingsdeel (`L0002.119b2bf7ea9640f3ba164b9d9b20246e`, het dek van de
zuidelijke krul `G0935.f71ef2ef35924cea9e25a03913abc6c5`, de rivierpijlers
`L0002.ae2b86e8782248d49886fc70dc31e098` en
`L0002.36d49b8a2a994f659127fac11cad90d6` en 56 kolommen), wegdeel en
ondersteunend wegdeel; AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel, de
verkanting en de hellingen van de krullen; PDOK-luchtfoto voor het
dwarsprofiel; PDOK-terrein voor de waterspiegel (PDOK = NAP + 45,89 m) en
PDOK-wegvlakken voorbij de einden voor de doorlopen; BGT-wegdelen op het
maaiveld voor de attributen op de doorlopen;
Wikimedia Commons-foto's: *John F. Kennedybrug Maastricht.jpg*
(Rijkswaterstaat/Joop van Houdt, CC BY-SA 4.0), *Meuse in Maastricht with
Kennedybrug and Gouvernement.JPG* en *20130504 Maastricht Kennedybrug 01, 03,
05 en 07.JPG* (Mark Ahsmann, CC BY-SA 3.0), *2020 Maastricht, Maaspuntweg,
Kennedybrug.jpg* (Kleon3, CC BY-SA 4.0) en *Maastricht, krul Kennedybrug, GAM
6830.jpg* (Gemeente Maastricht, CC BY 4.0).

Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek en
waterspiegel): de constructiehoogtes (5,6, 3,0, 2,2 en onder de krullen 1,8
m), de breedte van de kokers (6,2 m onder, 9,2 m boven) en de dikte van de
dekplaat, de hoogte van de muur tussen de kolommen van de rivierpijlers
(+46,4 m) en de vorm van die kolommen, de landhoofden, en de hoogtes van
schampkanten (0,6 m), verkeerseilanden (0,3 m) en middenberm (0,8 m). Het
hoogteverloop van de krullen is lineair tussen knopen uit het AHN (mediaan per
6 graden). De doorlopen (lengte 15 tot 50 m, eindhoogte 0,3 tot 0,5 m onder
PDOK) en de overgang van 10 m tussen krul en hoofddek zijn eigen keuzes om op
PDOK aan te sluiten, geen gemeten vormen.

Licentie van het model: eigen werk op basis van open bronnen.
