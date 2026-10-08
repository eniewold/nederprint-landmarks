# Hagesteinsebrug (Vianen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `hagesteinsebrug.glb` | Catalogusbron in meters: node `road:rijbaan` (de bovenste 0,5 m van beide rijbanen van de A27 met de BGT-attributen, zie hieronder) en `building:hagesteinsebrug` met de rest van het kunstwerk: de twee stalen liggers met dekplaat, schampkanten, middengeleiders en de afdekking van de middenberm, de konsoles en verstijvingen, de pijlers en de twee landhoofden |
| `hagesteinsebrug-1-2000.stl` | De brug als geheel in één stuk (constructie en rijbaan samen) op 1:2000 met een printvoet onder het dek, met de onderkant (1 m onder de waterspiegel) op het printbed (373 × 19 × 10,5 mm; met `--scale` een andere schaal, op 1:1000 is hij 746 mm lang) |
| `hagesteinsebrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terughoogte, hoofdmaten en bronnen |

Welke brug: de Hagesteinsebrug van 1981 (Lekbrug bij Hagestein, A27). Tussen
2023 en 2031 komt er volgens Wikipedia een betonnen vervanger, waarna deze
brug wordt gesloopt. Op de luchtfoto zijn alleen de grondwerken aan de
westkant bij beide dijken te zien; een tweede brug staat er nog niet. Dit
model is de bestaande stalen brug; de nieuwe brug zit er niet in.

De GLB is in meters met de oorsprong op RD (136272,20, 445943,97) (WGS84
52,00156 N, 5,11448 O), op de as van het dek midden in de hoofdoverspanning
boven de Lek, op de waterspiegel zoals het PDOK-terrein die legt (43,69 m
ellipsoïdisch, NAP +0,22 m) en de glTF-conventie Y omhoog. +X loopt langs
de brug naar het noordnoordoosten, naar Nieuwegein (`xAxis` (0,22985,
0,97323), 76,71 graden linksom vanaf het oosten, uit de BGT-dekranden: recht
binnen 0,5 m), +Y naar het westnoordwesten (stroomafwaarts). Het hart van het
model (x = -123) ligt op de controle-URL. Het dek loopt van het zuidelijke
landhoofd bij Hagestein (x = -496,4) tot het noordelijke bij Nieuwegein
(x = 249,8). Het maaiveld wordt op acht punten op de Lek bemonsterd
(`groundSamplePoints`: 25 m naast de as op x = -60, -30, 0 en 30, tussen de
rivierpijlers); `groundOffsetMetres` is 0. `groundHeight` is 43,69 m, de
laagste PDOK-waterspiegel op die punten, zodat een uitsnede die alleen een
aanbrug raakt (waar de uiterwaarden 2 tot 3 m hoger liggen en de nevengeul
op 43,56 m) het model niet laat wegvallen of optillen. Het PDOK-terrein ligt
in de uiterwaarden 43,47 m boven het AHN (mediaan over 18.500 punten), de
waterspiegel is dus NAP +0,22 m; daarmee staan alle NAP-hoogtes uit het AHN
op het PDOK-terrein. `replacesBuildings` is leeg: onder de brug ligt geen
BAG-pand, en PDOK reconstrueert de brug niet (het BGT-wegdek ligt daar op het
maaiveld en over het water).

Wegdelen met PDOK-attributen: de bovenste 0,5 m van de rijbanen is een eigen
node van klasse `road` met de attributen van de actuele BGT-wegdelen erop
(relatieve hoogteligging 1, zonder `eind_registratie`) in
`extras.attributes`, zodat de kleurregels van een thema op de brug werken
zoals op de PDOK-wegdelen ernaast:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | BGT-wegdelen (`lokaal_id`) | Waar |
| --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan autosnelweg | gesloten verharding | `L0002.0dca8817e62249809a1d55c0b43482cb` (west, richting Utrecht), `L0002.15a961ae64fb406baeb484e8c4f9f361` (oost, richting Gorinchem) | tussen de oostelijke schampkant en de middengeleider (y = -14,4 tot -1,9) en tussen de middengeleider en de westelijke schampkant (2,2 tot 14,6) |

De BGT vult `plus_fysiek_voorkomen` op deze wegdelen niet en legt op het dek
geen ondersteunend wegdeel. Eén node voor beide rijbanen (zelfde functie). De
schampkanten aan beide randen (BGT-rijbaan tot 14,4 en 14,6 m naast de as,
in het model 1,1 en 0,9 m breed en 0,7 m hoog), de middengeleiders (1,05 m
breed, 0,8 m hoog), de afdekking van de middenberm op het middendeel (0,3 m
onder het wegdek) en de dekvoegen blijven constructie. De laag is een
snijstrook over de rijbanen van het ene dekeinde tot het andere, van 0,5 m
onder tot 1 m boven het wegdek over hetzelfde stationsraster als het dek (om
de 2 m plus de knikken; het wegdek is lineair tussen die stations); de
schampkanten, de geleiders en de dekvoegen blijven met 2 cm vrij
constructie. De volumes tellen op tot die van de brug als geheel
(constructie 68.647 m³, rijbaan 9.246 m³, samen 77.893 m³, geen overlap; het
script controleert dat). Verticale stralen (`zfight.py`, 30.000 punten over
het dek) vinden geen samenvallende vlakken en geen vlakken zonder dikte.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 746 m (BGT x = -496,4 tot 249,8), 30,98 m breed, per
  rijrichting een eigen dekplaat van 0,8 m op een stalen ligger. Op de
  aanbruggen ligt tussen de twee dekken een open voeg van 2,0 m (luchtfoto;
  in het AHN ziet de DTM de uiterwaard erdoorheen); op het middendeel tussen
  de voegen op x = -175,7 en 175,5 is de middenberm dicht. Het wegdek volgt
  het AHN-DSM als regelmatig lengteprofiel: +14,3 m bij Hagestein, 1,42 %
  omhoog, een topboog van 439 m met de top +19,5 m boven de Lek en -1,00 %
  naar +17,9 m bij Nieuwegein (restfout 3 cm).
- De liggers: per dek een gesloten ligger tussen de lijven, 2,8 m achter de
  dekrand en 1,85 m van de middenvoeg, met een constructiehoogte van 3,4 m
  onder het wegdek (onderkant +16,1 m midden in de hoofdoverspanning). Boven
  de rivierpijlers 6,8 m diep (onderkant +12,5 m) over een vlak stuk van 6 m,
  met rechte voutes van 38 m in de hoofdoverspanning en 28 m in de
  zijoverspanningen (foto's: de ligger is boven de pijler twee keer zo hoog,
  de onderrand loopt recht schuin op en knikt dan).
- Aan de buitenlijven om de circa 5 m een driehoekige konsole onder de
  uitkraging (1,0 m dik, 2,0 m hoog aan het lijf, 1,6 m breed, onderkant 51
  graden) met daaronder een verticale verstijving van 0,9 × 0,3 m tot de
  onderkant van de ligger, en boven elke pijler een drukverstijving van
  2,4 m; 274 konsoles.
- Het middendeel over drie overspanningen van 94,7, 162,0 en 94,5 m: de
  rivierpijlers op x = -81,0 (BGT-pijler, hart x = -80,98) en 81,0 (AHN naast
  het dek) met elk een poer volgens de BGT (3,7 × 34,4 m, tot +5,0 m) en drie
  taps toelopende kolommen (3,0 m dik, onder 5,4 en boven 3,6 m breed) met een
  stalen dwarsdrager tussen de liggers boven de middelste; de voegpijlers op
  x = -175,7 en 175,5 met dezelfde kolommen en een dwarsdrager van 5,5 m (de
  DTM ziet bij de zuidelijke voegpijler 5,5 m lang niets door de voeg).
- De zuidelijke aanbrug van zes velden (53,8, 52,7, 52,2, 52,6, 52,9 en
  52,0 m) op vijf pijlers (x = -438,1, -385,4, -333,2, -280,6 en -227,7, uit
  de jukken die de DTM in de open voeg ziet) met elk een juk van 2,4 m dik en
  2,0 m hoog met schuine koppen (57 graden) op drie kolommen van 2,6 × 2,6 m.
  Aan de noordkant één veld van 64,8 m van de voegpijler naar het landhoofd
  (geen juk in de voeg, luchtfoto en foto's).
- De dekvoegen op x = -491,9, -175,7, 175,5 en 240,3 als sleuven van
  0,4 × 0,3 m over de rijbanen.
- De twee landhoofden (BGT) als blokken onder het dekeinde in de dijk, met
  de voorwand over de volle breedte van de BGT-muur (37,8 en 38,0 m, 1,0 m
  dik), als aanzet van de vleugels.

Wat er niet in zit: lantaarnpalen (om de 16 m aan de westrand), leiderails en
leuningen (kleiner dan 0,9 m; de schampkanten en geleiders staan ervoor in
de plaats), de steiger en het onderhoudsbordes bij de rivierpijlers, de
dwarsdragers en het windverband onder het dek tussen de liggers (vrije
horizontale overspanningen die op 1:1000 niet zonder steun printen; de
liggers zijn als gesloten kokers gemodelleerd), de dunne vleugelwanden langs
de dijk (BGT-lijnen) en de taluds van de dijken (PDOK-terrein). De
grondwerken voor de nieuwe brug aan de westkant zijn geen kunstwerk en zitten
er niet in.

Pasvorm op het AHN: het wegdek van het model wijkt over de hele lengte 3 cm
(rms) en hoogstens 11 cm af van het 30e percentiel van het AHN-DSM over de
rijstroken. De PDOK-dijk ligt bij de landhoofden 1 tot 2 m lager dan de
AHN-dijk (het PDOK-terrein is daar afgevlakt), zodat het dekeinde boven het
PDOK-wegdek op de dijk uitkomt; het landhoofdblok vult dat tot de onderkant.

Printbaarheid: dragende delen zijn minstens 2,6 m (kolommen), het juk heeft
schuine koppen van 57 graden en de konsoles een onderkant van 51 graden. Vrij
hangen alleen de onderkant van dek en liggers, juk en dwarsdragers (21.309 m²
in het model, niets boven het wegdek). Het script controleert dat alles op
dezelfde onderkant begint en dat de printversie (een wig van minstens 50
graden vanaf de dekrand onder de liggerhoek door, uitlopend in een scherm van
0,8 mm op printschaal) geen overhang heeft (0,76 m² aan losse facetjes). In
de printcheck (gesloten solid met overhangopvulling, status `NoError` voor
beide nodes): de hele brug op 1:2000 (382 mm) +11,9 % opvulling; een
uitsnede van 380 m rond de hoofdoverspanning op 1:1000 -27 % en een uitsnede
van 380 m over de zuidelijke aanbrug op 1:1000 -47 % (de opvulling valt binnen
het al gevulde volume onder het dek). De rijbaan krijgt geen eigen opvulling
(0 %): de constructie draagt alles.

Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek, water en
uiterwaard): de constructiehoogtes (3,4 en 6,8 m) en de lengte van de voutes
(38 en 28 m), de ligging van de liggerlijven, de dekplaat (0,8 m), maat en
steek van de konsoles en verstijvingen, de kolommen (aanbrug 2,6 m; voeg- en
rivierpijlers 3,0 m dik, 5,4 naar 3,6 m breed, drie per pijler op y = -10,2,
0,15 en 10,5) en het juk van de aanbrugpijlers, de bovenkant van de poeren
(+5,0 m) en de poer van de noordelijke rivierpijler (gelijk aan de BGT-poer van
de zuidelijke), de schampkanten en geleiders. De open voeg en de dekvoegen
komen van de luchtfoto; de pijlerposities van de aanbrug uit de jukken in de
DTM (binnen circa 0,5 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Hagesteinsebrug) (lengte
740 m, breedte 31 m, stalen liggerbrug, gebouwd 1975 tot 1981, geopend op
24 juni 1981, vervanging gepland); PDOK BGT overbruggingsdeel (dek
`L0002.467068b379c34ad18d312cab62092ab1`, landhoofden
`L0002.e165a1ce0d5b4f989263ce9ae1c07491` en
`L0002.b29c608fe05240148017abb0f919d851`, rivierpijler
`L0002.e53beb12ca3e41b2a6d9633d337954c3`), scheiding (muur
`L0002.34311e7273744d988fd068011d6e5a44` en
`L0002.b213fecdf5ed473793d9dca43a3b4cfb`) en wegdeel; AHN DSM/DTM 0,5 m (PDOK
WCS); PDOK-luchtfoto (Actueel_orthoHR); PDOK-terrein voor de waterspiegel;
Wikimedia Commons-foto's: *Hagesteinsebrug A27.jpg*, *Hagesteinsebrug gezien
vanaf de Lekdijk oost in Nieuwegein- Vreeswijk.jpg*, *Hagesteinsebrug -
Rijksweg A27 - Flickr - Frans Berkelaar.jpg*, *We zien de Hagesteinsebrug in
de A27. Over de Lek.jpg*, *Lekbrug in de A27 bij Hagestein.jpg*, *Steelgirder
with concrete deck over the Lek river at Hagestein in the A27 motorway -
panoramio.jpg* en de foto's van het Nationaal Archief bij de opening (*Morgen
opent gedeelte snelweg A27 tussen Vianen en nieuwe verkeersplein Lunetten de
nieuwe brug over de Lek*, bestanddeelnummers 931-5578 en 931-5579).

Licentie van het model: eigen werk op basis van open bronnen.
