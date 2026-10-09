# Haringvlietbrug (Numansdorp)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `haringvlietbrug.glb` | Catalogusbron in meters, drie nodes: `road:rijbaan` en `road:rijbaan-lokaal`, de bovenste 0,5 m van het dek tussen de schampkanten met in `extras.attributes` `bgt_functie` `rijbaan autosnelweg` of `rijbaan lokale weg` en `bgt_fysiekvoorkomen` `gesloten verharding`; en `building:haringvlietbrug` met de rest: de kokerliggers met schoren, schampkanten en geleiderails, pijlers, klep, basculekelder met toren en landhoofden |
| `haringvlietbrug-1-3500.stl` | De brug in één stuk op 1:3500 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (351 × 9,7 × 6,7 mm; `--scale 2500` geeft 491 mm) |
| `haringvlietbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, vervangen BAG-pand, hoofdmaten en bronnen |

De Haringvlietbrug (A29, geopend op 20 juli 1964) verbindt de Hoeksche Waard
bij Numansdorp met de Hellegatsdam (knooppunt Hellegatsplein). De backlog
noemde hem "alleen als deelmodel"; het model bevat toch de hele brug, om drie
redenen. De brug bestaat uit tien gelijke velden van 106 m (in 1962-1963 als
complete overspanningen ingevaren) op negen gelijke pijlers, dus één veld en
één pijler in een lus; het model blijft daardoor klein (54 000 driehoeken,
generatie in 4 s, printcheck 13 s). Een deelmodel zou halverwege het water
overgaan in de PDOK-reconstructie, en die legt het wegdek van de brug plat op
het water (PDOK-wegdelen op ellipsoïdisch 44,6 m): de brug zou daar
verdwijnen. En de herkenbare delen (het lange rechte dek, de pijlers, de klep
met kelder en toren) liggen aan de twee uiteinden en ertussen, niet op één
plek. Vergelijkbaar: de Merwedebrug Papendrecht (1051 m) en de Brug
Hollandsch Diep (1908 m) staan ook in hun geheel in de catalogus.

## Oorsprong, assen en maaiveld

De GLB is in meters met de oorsprong op RD (86831,685, 414573,372), op de as
van het dek in het hart van de middelste (zesde) rivierpijler, op de
waterspiegel van het Haringvliet (NAP +0,7 m) en de glTF-conventie Y omhoog.
+X loopt langs de brug naar het noordnoordoosten, naar Numansdorp (`xAxis`
(0,37436, 0,92728), 68,01 graden linksom vanaf het oosten; de as is gefit op de
tien pijlercaissons van de BGT, die er hooguit 1,0 m naast liggen), +Y naar
het westnoordwesten, naar het Haringvliet. Het zuidelijke landhoofd ligt op
x = -648,2 tot -636,8, de rivierpijlers om de 106,13 m op x = -530,65 tot
424,52 (de BGT geeft 104,1 tot 108,0 m; de velden zijn als gelijke
overspanningen gebouwd), de klep van x = 425,4 tot 463,5, de basculekelder
van 463,5 tot 487,9 en het noordelijke landhoofd van 569,1 tot 580,2. De
controle-URL valt op het dek, 68 m ten noorden van de oorsprong.

Het maaiveld wordt op veertien punten op het water bemonsterd
(`groundSamplePoints`, 25 m naast de as midden in zeven velden van x = -583,7
tot 515). `groundOffsetMetres` is 0. Het PDOK-terrein legt het water op
ellipsoïdisch 44,41 tot 44,60 m in de zuidelijke velden en 44,04 tot 44,15 m in
de noordelijke; met de afwijking van 43,85 m tussen PDOK-wegen en AHN bij de
landhoofden is dat NAP +0,2 tot +0,75 m. Het model gebruikt NAP +0,7 m als
z = 0; de lader neemt de laagste waarde, zodat de brug tot 0,5 m lager kan
staan dan in NAP. `groundHeight` is 44,04 (ellipsoïdisch, de laagste
PDOK-waterhoogte op die punten) als terugval voor een uitsnede die alleen
een landhoofd raakt.

`replacesBuildings`: BAG-pand 0611100000614366, de toren van het
bedieningsgebouw (PDOK reconstrueert hem als blok vanaf het water tot NAP
+19 m). Andere panden liggen niet onder de brug; de windturbine en de panden
bij Numansdorp vallen erbuiten. Er ligt geen ander catalogusmodel in de buurt.

## Onderdelen (hoogtes in NAP)

- **Wegdek** volgens het AHN-DSM om de 10 m (35e percentiel over |y| < 9 m,
  gemiddeld over 50 m): +14,3 m op het zuidelijke landhoofd, +19,4 m van
  x = -100 tot 0, +16,1 m op de rustpijler, +15,1 m op de kelder en +13,6 m op
  het noordelijke landhoofd. Het dek is 25,6 m breed (BGT).
- **Vaste velden** (tien van 106,13 m en het noordelijke van 81,2 m): een
  stalen koker van 11,8 m breed met verticale lijven en de onderkant 5,6 m
  onder het wegdek (NAP +10,4 m bij de oevers, +13,8 m in het midden; de
  doorvaarthoogtes zijn NAP +10,7 tot +13,89 m), de rijvloer van 1,0 m met de
  randbalk, en daaronder het vlak van de schuine schoren van de lijven (4,6 m
  onder het wegdek) naar de dekrand. Onder dat vlak om de 6,63 m (zestien
  vakken per veld, zoals op de bouwfoto's) een schoor als rib van 0,9 m breed
  die 0,4 m uitsteekt.
- **Schampkanten** van 0,9 × 0,6 m langs beide dekranden in plaats van de
  leuningen en geleiderails; **geleiderails** in de middenberm (y = 2,6 tot
  3,5) en tussen de rijbaan lokale weg en de snelweg (y = -6,65 tot -5,75) als
  stroken van 0,9 × 0,5 m, waar de BGT een berm heeft (niet op de klep en de
  kelder).
- **Negen rivierpijlers**: een caisson van 3,5 × 24,6 m met halfronde koppen
  (BGT) tot NAP +6,0 m, met daarop twee schachten onder de lijven
  (y = ±4,4) die verlopen van 3,0 × 3,6 m tot 2,4 × 3,0 m, tot de onderkant van
  de koker.
- **Rustpijler van de klep** (x = 424,52): caisson van 3,5 × 31,4 m tot NAP
  +6,0 m (BGT, AHN op de koppen naast het dek), daarop een wand van 3,5 × 22 m
  tot onder de rijvloer, waar de koker van het tiende veld en de punt van de
  klep op rusten.
- **Basculeklep** van 38,1 m in gesloten stand: de rijvloer met twee
  hoofdliggers van 2,0 m breed op 5,0 tot 7,0 m uit de as, 4,0 m diep aan de
  punt en 5,6 m bij het draaipunt (doorvaarthoogte NAP +9,88 m), dwarsdragers
  tot 1,8 m onder het wegdek, en voegen van 0,4 × 0,3 m over het wegdek bij de
  punt en het draaipunt.
- **Basculekelder** van 24,4 × 27,9 m (BGT) tot onder het wegdek, met een
  betonnen plint die 0,8 m uitsteekt tot NAP +2,5 m, in de west- en oostgevel
  verdiepte vakken metselwerk van 3,4 m breed en 0,35 m diep tussen penanten
  van 1,2 m (van NAP +4,5 m tot 2,5 m onder het wegdek; in de oostgevel niet
  achter de toren), en in de zuidgevel twee sleuven van 2,4 × 0,4 m onder de
  hoofdliggers van de klep.
- **Toren van het bedieningsgebouw** (BAG-pand, 7,0 × 4,5 m) aan de
  zuidoosthoek van de kelder, met de bedieningscabine van 8,6 × 5,4 m (AHN) en
  3,0 m hoog onder het dak op NAP +23,35 m (AHN), op een kraag van 45 graden,
  met een raamband als nis van 0,35 m rond de cabine.
- **Landhoofden**: zuid van x = -648,2 tot -636,8 en noord van 569,1 tot
  580,2 (BGT), massief onder de rijvloer.

## Wegdelen op het dek

Elk wegdeel is de bovenste 0,5 m van het dek, uitgesneden met een strook van
0,5 m onder tot 1 m boven het wegdek; de schampkanten, de geleiderails en de
voegen houden 2 cm vrij en blijven constructie. Op het dek liggen BGT-wegdelen
met relatieve hoogteligging 1, alle gesloten verharding zonder
plus_fysiek_voorkomen:

| Node | Functie | BGT-wegdelen |
| --- | --- | --- |
| `road:rijbaan` | rijbaan autosnelweg (westelijke rijbaan y = 3,5 tot 11,9, oostelijke y = -5,75 tot 2,6; op de klep y = -5,2 tot 11,9; op de kelder de hele breedte) | actueel: L0002.298fef633fc54846b4e289a2ca29ce58, L0002.d5003a7c5f1848e9abcbd387b023bf44, L0002.d4a0f4dfc13944e89619a7286b3395ba, L0002.13cc667e6d9840b0b065c79ffcd5d9c7, L0002.a70e56148fe34fc09173f9449f76ce23, L0002.71f74910edb344a7ad0d673f27b34490; beëindigd 2025: L0002.a1887637064d403888c37f474a496ef2, L0002.2b169b2ed1304982b5e27d323322af26, L0002.7bd6ef584bf7428db0c5ba7ece8f5022, L0002.3a49898dcddb4307a8ca9d6e134317a7, L0002.8ecb68d03ca148eda9f5da5e0cbd235c, L0002.35762d8af20845e2a978ceb0613f59f3 |
| `road:rijbaan-lokaal` | rijbaan lokale weg aan de oostkant (y = -11,9 tot -6,65; op de klep tot -5,2) | actueel: L0002.724125374ffa424c8624a09ca20afdac, L0002.3906f22442b443c884ba390a36b4dcd7, L0002.36353446a1b044688e3ebb8540bba5e3; beëindigd 2025: L0002.729a44fee26e40a2854b437f8f521422, L0002.5927e7146492477cbb32e681f3d65659, L0002.dc7a7658f91d4ca1887663df081c99a9 |

Ten noorden van x = 217,3 (de laatste twee vaste velden, de klep, de kelder
en het noordelijke veld) heeft de BGT op dit moment geen actuele wegdelen op
het dek: de laatste versies zijn op 4 juni 2025 beëindigd zonder opvolger.
Daar gelden die laatste versies, met dezelfde indeling als het zuidelijke
deel. Op de landhoofden liggen dezelfde functies op hoogteligging 0
(L0002.db4f6e6dbe5a44e3a901bef5191a337e en G1924.8abeacd5439b75760000000a0219ace0
in het zuiden, L0002.8abeacd54afb7500047bb9e21bef2291 en
G1963.9f777798457446d7952bfadf7382f876 in het noorden). Smalle BGT-stroken onder
de schampkanten (rijbaan lokale weg L0002.33ba3c70a9e548bdb086b5db89327b54 van
1,1 m, voetpad L0002.77b1de4ec7a54898a4245bfc07bf0d4e van 0,2 m op de kelder)
en de bermen (ondersteunend wegdeel, berm gesloten verharding) zijn
constructie. De laag loopt onder de schampkanten en geleiderails door, zoals
bij de andere bruggen. De volumes van de drie nodes tellen op tot het volume
van de brug als geheel (150 819 m3, verschil 0).

## Weggelaten

- Lantaarns, portalen met verkeerslichten en borden, slagbomen, seinen en de
  leuningen: dunner dan 0,9 m (de leuningen zitten in de schampkanten).
- De gele stalen werkbordessen en vergrendelingen op de rustpijler: open
  staalwerk.
- Het remmingwerk en de dukdalven in de vaargeul: losse palen naast de brug,
  geen deel van het kunstwerk (geen BGT-overbruggingsdeel).
- De open stand van de klep en de contragewichten in de kelder.
- De vakwerkverstijvers van de lijven: achter het vlak van de schoren, op
  1:1000 niet te printen; het ritme staat in de schoorribben.
- De patrijspoorten in de toren (0,6 m) en de reling op de kelder.
- De voegen tussen de afzonderlijke kokers op de pijlers (enkele cm).

## Pasvorm op het AHN

Het wegdek volgt het AHN binnen 0,1 m (gladgestreken over 50 m). De dekranden
liggen in het AHN 0,7 tot 0,8 m boven de rijbaan (leuningen en geleiderails),
in het model 0,6 m (schampkanten). De toren staat binnen 0,2 m op de AHN-hoogte
van het cabinedak (NAP +23,35 m, 50e percentiel), de koppen van de rustpijler
op NAP +6,0 m. De koker, de schachten en de caissons van de andere pijlers
liggen onder het dek en staan niet in het AHN.

## Printbaarheid

Printcheck (`prepareMeshes` met de printbare overhangopvulling): op de hele
brug (uitsnede van 1179 m, effectief 1:2947) constructie NoError met -2,3 %
(de rand van de uitsnede snijdt meer weg dan de opvulling toevoegt), de twee
wegdelen 0 %; op 1:1000 rond de klep en de kelder (uitsnede van 380 m)
constructie NoError met +8,7 %, de wegdelen 0 %. Het vlak van de schoren helt
26 graden en het dek hangt tussen de pijlers vrij: de export zet onder de
dekrand een wig met een smal scherm tot de onderplaat, de STL heeft een
printvoet van dezelfde vorm (wig van 50 graden vanaf de dekrand, scherm van
3,5 m = 1 mm op 1:3500). De nissen in de kelder en de cabine zijn blind (0,35 m),
de kraag onder de cabine helt 45 graden. Dragende delen zijn minstens 0,9 m.

## Geschat

- De kokerbreedte (11,8 m) en de aansluiting van de schoren (4,6 m onder het
  wegdek), van de bouwfoto's.
- De constructiehoogte (5,6 m onder het wegdek), uit de doorvaarthoogtes.
- De afstand van de schoren (16 vakken per veld), van de bouwfoto's.
- De caissons van de rivierpijlers tot NAP +6,0 m, zoals de rustpijler.
- De schachten (3,0 × 3,6 tot 2,4 × 3,0 m, op y = ±4,4), van foto's.
- De wand op de rustpijler (3,5 × 22 m).
- De hoofdliggers en dwarsdragers van de klep.
- De plint, de vakken en de sleuven van de kelder; de cabinehoogte (3,0 m).
- De geleiderails als stroken van 0,9 × 0,5 m.
- De waterspiegel (NAP +0,7 m) uit de PDOK-waterhoogte min 43,85 m.

## Bronnen

- Wikipedia (nl), Haringvlietbrug: lengte 1220 m, breedte 26 m, overspanning,
  doorvaarthoogtes en -breedtes, opening 1964.
- PDOK BGT: overbruggingsdeel (dekranden, landhoofden, pijlercaissons,
  basculekelder met torenuitbouw), wegdeel en ondersteunend wegdeel.
- PDOK BAG: pand 0611100000614366 (toren van het bedieningsgebouw).
- PDOK AHN DSM 0,5 m via WCS: wegdek, rustpijler, toren en cabine.
- PDOK luchtfoto (Actueel_orthoHR): klep, kelder, toren, portalen.
- PDOK 3D-terrein voor de waterspiegel.
- Nationaal Archief / Anefo: "Brug over het Haringvliet bij Numansdorp",
  bestanddeelnummers 914-3033, 914-3034, 914-3038 en 914-3040 (bouw, 1962):
  de kokerligger met schoren en de velden van 106 m.
- Wikimedia Commons: Haringvlietbrug (48566257631).jpg,
  Haringvlietbrug (48566259211).jpg, Haringvlietbrug (48566259466).jpg,
  Haringvlietbrug (48566401637).jpg en 2009-09-05 Route A29 at the bridge over
  Haringvliet 03.jpg: pijlers, kelder, toren en klep.
