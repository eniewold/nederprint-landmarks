# Hoge Brug (Maastricht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hoge-brug-maastricht.glb` | Catalogusbron in meters: node `building:hoge-brug` met het dek met romp, de boog met het kabelscherm, de dubbele kolommen, de twee liften, de luie trappen naar het Stadspark en Plein 1992 en de krul naar de Maasboulevard; de bovenste 0,5 m van dek, trappen en krul als nodes `road:voetpad`, `road:fietspad` en `road:voetpad-op-trap` met de BGT-attributen (zie hieronder) |
| `hoge-brug-maastricht-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder het dek en de krul, met de onderkant (0,8 m onder de waterspiegel) op het printbed (261 × 33 × 29 mm) |
| `hoge-brug-maastricht.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (176847,78, 317422,23), op de as
van het BGT-dek midden onder de top van de boog, op de waterspiegel van de
Maas (stuwpeil Borgharen, NAP +44,0 m) en de glTF-conventie Y omhoog. +X loopt
langs de brug naar Plein 1992 in Céramique (`xAxis` (0,98881, 0,14919), 8,58
graden linksom vanaf het oosten), +Y stroomafwaarts naar het
noordnoordwesten. De westtrap begint in het Stadspark op x = -139,4, de
Maasboulevard loopt onder het dek door op x = -110 tot -99, de kolommen staan
op x = -81,7 en 81,7, de liften op x = -88,5 en 88,7 en de oosttrap eindigt op
Plein 1992 op x = 121,3; de krul ligt ten noorden van de westtrap en reikt tot
y = 30. Het maaiveld wordt op acht punten op het water van de Maas bemonsterd
(`groundSamplePoints`, 15 m naast de as op x = -60, -20, 20 en 55);
`groundOffsetMetres` is 0, want het PDOK-water ligt op 89,9 m ellipsoïdisch,
de waterspiegel van het model. Dat is ook de `groundHeight`, als terugval voor
een uitsnede die alleen een oever raakt. Geen BAG-pand onder de brug.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 6,6 m breed (BGT; Wikipedia noemt 7,2 m) van de bovenkant van de
  westtrap (x = -112) tot die van de oosttrap (x = 92), met een romp: een rand
  van 0,5 m en dan schuin naar een vlakke onderkant van 2,8 m breed, 1,8 m
  onder het looppad. Het looppad volgt het AHN-DSM: +54,7 m boven de
  Maasboulevard, lineair naar +55,5 m op x = -80 en dan een verticale boog
  (z = 56,37 - 1,375e-4 x²) met de top op +56,4 m in het midden en +55,2 m bij
  de oosttrap.
- De stalen boog in het hart van het dek (AHN: de boog ligt op de as, niet
  ernaast): de bovenkant is een cirkel met een straal van 223,6 m en de top op
  +72,0 m (het hoogste punt, 28 m boven het water), die het dek 82,7 m uit het
  midden raakt, recht boven de kolommen (luchtfoto); de boog loopt daar in het
  dek. Doorsnede 2,0 m breed aan de bovenkant, 0,3 m recht en dan onder 61
  graden of steiler naar een onderkant van 0,9 m; hoogte 1,3 m in de top tot
  2,1 m bij de voeten.
- De kabels (foto's): acht ankers op de boog, 18 m uit elkaar, elk met twee
  kabels naar het dek, 18 m links en rechts ervan, zodat ze elkaar halverwege
  kruisen. Tussen dek en boog staat een scherm van 0,94 m dik met de kabels als
  banden van 0,9 m: de driehoeken onder de kruisingen en de ruiten onder de
  ankers zijn dertien doorgaande openingen (de hoogste tot +69,9 m), de
  driehoeken onder de boog met een vlakke bovenkant negen blinde nissen van
  0,3 m aan beide zijden.
- Op elke oever twee ronde kolommen van 2,0 m naast elkaar (BGT, foto's) met
  een kop die onder 50 graden naar de onderkant van het dek uitloopt.
- Twee glazen liften van 2,6 × 2,6 m op de as (luchtfoto), van het maaiveld
  door het dek tot +61,2 m (AHN), met een ronde machinekap van 1,2 m.
- De luie trappen (BGT, AHN), dicht tot de onderkant en met wangen van
  0,9 × 0,9 m: de westtrap van +54,7 m naar het Stadspark (voet +48,25 m, zie
  hieronder) en de oosttrap van +55,2 m naar Plein 1992 (+49,95 m), die aan
  het eind 0,6 m naar het noorden draait.
- De krul naar de Maasboulevard (BGT, AHN): een rechte oprit van 3,0 m breed
  die onder 13,3 graden naar het noordwesten van het dek aftakt (+55,2 m), en
  een boog van 152 graden met de klok mee met een straal van 10,2 m en 2,5 m
  breed naar de stoep op +48,2 m; romp 1,0 m, op twee kolommen van 1,0 m
  (BGT).

Wegdelen met PDOK-attributen: de bovenste 0,5 m van dek, trappen en krul is
per BGT-functie een eigen `road:`-node met de attributen van het actuele
BGT-wegdeel (relatieve hoogteligging 1) in `extras.attributes`, zodat de
kleurregels van een thema op de brug werken zoals op de wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | BGT-wegdeel (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- | --- |
| `road:voetpad` | voetpad | gesloten verharding | asfalt | G0935.8507e7891ad740d28b7b200f822495a0 | het dek van x = -112,2 tot 90,7: de noordelijke helft tussen de voeten van de boog, daarbuiten de hele breedte, en het rechte deel van de krul tot x = -112,7 (de BGT spaart de liften uit; die zijn constructie) |
| `road:fietspad` | fietspad | gesloten verharding | asfalt | G0935.86ca0cd4da954494b1dbd5fd39f106ff | de zuidelijke helft van het dek tussen de voeten van de boog (x = -82,6 tot 82,4) |
| `road:voetpad-op-trap` | voetpad op trap | open verharding | beton element | G0935.987436e5cae346a68e11c643f1ae6bc5, G0935.b87ac6f0b6994ee6945e3682f5b68273, G0935.dc981a4083aa400db55dde5513b67868 | de westtrap, de boog van de krul vanaf x = -112,7 en de oosttrap vanaf x = 90,7 |

De grenzen tussen de wegdelen zijn de dwarsgrenzen van de BGT-vlakken
(vereenvoudigd tot 5 cm). De BGT legt de grens tussen fietspad en voetpad 0,6
tot 0,8 m ten zuiden van de as, op de flank van de boog; in het model ligt hij
op de as, binnen het scherm en de boog, zodat er geen strook voetpad van 0,2 m
tussen boog en fietspad overblijft. De laag is een snijstrook over dezelfde
loftstations als dek, trappen en krul, van 0,5 m onder tot 1 m boven het
looppad; de boog (zolang hij boven het dek uitkomt, met een rechte strook naar
beneden waar zijn flank door de laag loopt), het hele scherm, de liften en de
wangen van de trappen blijven met 2 tot 5 cm marge constructie. Langs de
randen van het dek gaat de strook 0,3 m breed tot 0,8 m onder het looppad: de
rand van de romp is precies 0,5 m hoog en loopt daaronder schuin naar binnen,
zodat een laag van 0,5 m de constructie aan de dekrand op een mes had laten
eindigen; nu houdt die daar met een staande kant van 0,2 m op en krijgt het
wegdeel de hoek van de romp. De volumes tellen op tot die van de brug als
geheel (constructie 6253 m³, voetpad 374 m³, fietspad 236 m³, voetpad op trap
188 m³, samen 7051 m³). Verticale stralen over het hele model vinden geen
samenvallende bovenvlakken tussen de onderdelen; alleen de lucht onder de
flank van de boog waar die op het dek komt en twee punten in het scherm, die
al in het model als één geheel zaten. De STL is ongewijzigd: het hele
brugmodel in één stuk.

Wat er niet in zit: de kabels zelf (circa 0,1 m; ze zijn het scherm met
openingen), de leuningen langs dek, trappen en krul, de fietsgoten langs de
trappen, de lantaarns en de trapjes en bordessen rond de liften.

Pasvorm op het AHN: het looppad volgt het DSM binnen 0,1 m (mediaan naast de
as, om de 2 m), de bovenkant van de boog ligt op x = -60, -40, 40 en 60 binnen
0,4 m van de bovenste DSM-cellen op de as (68,4 en 63,8 m tegen 68,6 tot 68,8
en 63,4 tot 63,9 m), de liften op de hoogste DSM-cel. De oosttrap volgt het DSM binnen 0,2 m; de westtrap, die op +48,25 m
eindigt, ligt naar de voet toe tot 1,1 m boven het DSM.

Printbaarheid op 1:1000: de kabels zijn op 1:1000 niet te printen. Het scherm
draagt de onderkant van de boog over de hele lengte, en de openingen hebben
een top van 52 graden (de kabels zelf lopen onder 19 tot 39 graden, dus de
openingen zijn smaller dan de velden tussen de kabels); de blinde nissen
hebben een vlakke bovenkant van 0,3 m diep. De boog, de kolommen (2,0 m), de
wangen (0,9 m) en de liften zijn dik genoeg om te dragen. Alleen de onderkant
van het dek en de krul en de nisbovenkanten hangen vrij (1677 m²); het script
controleert dat alles op dezelfde onderkant begint en dat de printversie
buiten de nissen geen overhang heeft (0,07 m²). In de printcontrole gaat het
model met overhangopvulling door (uitsnede van 289 m op 1:1000, 10 seconden,
status NoError voor alle onderdelen, samen 13,0 naar 10,7 cm³ tegen de
verticale opvulling, -17 %; de constructie 12,2 naar 9,9 cm³, -18,6 %, de
wegdelen voetpad, fietspad en voetpad op trap zonder eigen opvulling,
`extraPct` 0,1, 0 en 0): onder het dek en de krul komt een wig met een smal scherm
tot de onderplaat en de spitse openingen in het scherm blijven open. De STL
heeft dezelfde printvoet (wig van 50 graden vanaf de rand van het dek en een
scherm van 0,9 m). PDOK tekent het BGT-dek van de brug als een vlakke weg die
van +48,0 m in het Stadspark recht over de Maas naar +49,4 m op de oostkade
loopt (4 tot 5,4 m boven het water); die strook blijft onder de brug zichtbaar.
De westtrap eindigt daarom op +48,25 m in plaats van op het AHN-maaiveld van
+47,1 m, zodat de strook niet door de voet van de trap steekt; de oosttrap en
de krul komen 0,1 tot 0,2 m boven die strook uit.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Hoge_Brug_%28Maastricht%29)
(2003, bureau René Greisch, 261 m lang, 7,2 m breed, stalen boogbrug zonder
pijlers in de Maas met het dek aan diagonaal gespannen kabels, luie trappen,
liften, aanlanding op Plein 1992 en in het Stadspark met een krulvormige trap
naar de Maasboulevard), PDOK BGT (overbruggingsdeel: dek met trappen en krul,
kolommen; wegdeel: voetpad, fietspad en voetpad op trap op de brug), PDOK AHN (dsm en dtm 0,5 m via WCS: looppad, trappen, krul, boog,
liften, maaiveld), de PDOK-luchtfoto (liften, voeten van de boog),
Rijkswaterstaat (stuwpeil Borgharen, NAP +44,0 m) en Wikimedia Commons-foto's
(Maastricht - Hoge Brug en Céramique - 2022-11-11.jpg; Hoge Brug two from SW
Maastricht the Netherlands August 10 2024.jpg; Maastricht, Maasboulevard, lift
Hoge Brug.jpg; 20130504 Maastricht Céramique 04 Hoge Brug stairs.JPG;
Maastricht - trap naar Hoge Brug in stadspark (De Boompjes) 20200607.jpg;
20130504 Maastricht Céramique 26 Underside of Hoge Brug.JPG) voor de kabels,
de romp, de kolommen en de trappen. Geschat zijn de waterspiegel (stuwpeil),
de diepte en vorm van de romp (1,8 m), de doorsnede van de boog (2,0 m breed,
1,3 tot 2,1 m hoog), de plaats van de kabelankers (18 m uit elkaar, uit een
zijaanzicht), de maat van de kolommen (2,0 m; de BGT tekent ze als cirkels van
1 m) en hun kop, de romp van de krul (1,0 m) en de wangen van de trappen
(dikker dan in het echt); de westtrap eindigt 1,1 m boven het AHN-maaiveld.

Licentie van het model: eigen werk op basis van open bronnen.
