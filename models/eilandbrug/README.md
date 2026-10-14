# Eilandbrug (Kampen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `eilandbrug.glb` | Catalogusbron in meters met twee nodes: `road:rijbaan`, de bovenste 0,5 m van het dek tussen de schampkanten met de attributen van het BGT-wegdeel op de brug (`bgt_functie` rijbaan autoweg, `bgt_fysiekvoorkomen` gesloten verharding), en `building:eilandbrug` met de rest van het kunstwerk: het dek, de aanbruggen met hun pijlers, de basculepijler met de aandrijving, de basculeklep, de steunpijler, de pyloon met kop en dwarsdrager, de elf tuien per vlak van de hoofdoverspanning en de vier achtertuien per vlak als losse staven, het zuidelijke landhoofd en het ankerblok |
| `eilandbrug-1-1500.stl` | De brug in één stuk op 1:1500 met een printvoet onder het dek en printvormen voor de aandrijfcilinders, de steunpijler, de kop en de tuien (zie Printbaarheid), met de onderkant (0,8 m onder de waterspiegel) op het printbed (280 × 22 × 61 mm; op 1:1000 is hij 420 mm lang: `--scale 1000`) |
| `eilandbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, ellipsoïdische terugvalhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (186982,81, 510702,83) (WGS84
52,58297 N, 5,85909 O), op de as van het BGT-dek midden tussen de twee
landhoofden, op de waterspiegel van de IJssel zoals het PDOK-terrein die legt
(ellipsoïdisch 42,18 m, NAP -0,47 m) en de glTF-conventie Y omhoog. +X loopt
langs de brug naar het noorden, naar Ramspol (`xAxis` (-0,13639, 0,99066),
97,84 graden linksom vanaf het oosten), +Y naar het westen, stroomafwaarts.
Het script rekent langs de as ook met s (s = 0 op de zuidkant van de
basculepijler, x = s - 71,3). Het zuidelijke landhoofd op de Kamper dijk ligt
op x = -209,9 tot -203,3, de aanbrugpijlers op x = -161,4 en -113,8, de
basculepijler op x = -70,9 tot -66,9, de steunpijler op x = -46,4 tot -42,4,
de pyloonpoten op de noordelijke uiterwaard op x = 99,6 tot 106,2 (voet) en
118,0 tot 120,6 (top), de pijler in de achteroverspanning op x = 144,7 en het
ankerblok op de noordelijke dijk op x = 187,7 tot 209,9. Het maaiveld wordt op
zes punten op het water naast de brug bemonsterd (`groundSamplePoints`, 25 m
naast de as op x = -81,3, -11,3 en 58,7); `groundOffsetMetres` is 0, want het
PDOK-terrein legt de IJssel binnen 0,03 m op de waterspiegel van het model.
Omdat de brug 420 m lang is, staat er een ellipsoïdische `groundHeight` van
42,15 m (de laagste PDOK-terreinhoogte op die punten) als terugval voor een
uitsnede die alleen een uiteinde raakt. Geen BAG-pand onder de brug: de brug
wordt op afstand bediend ("afstand bediende brug") en heeft geen
brugwachtershuis; de bedieningsruimte met het glazen trappenhuis zit in de
basculepijler.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 419,8 m van landhoofd tot ankerblok, 18,8 m breed (BGT), met
  het wegdek volgens het AHN-DSM om de 4 m: +16,7 m op de zuidelijke dijk,
  +18,5 m midden in de hoofdoverspanning en +16,6 m op het ankerblok. Een
  kokerligger met schuine onderzijde: rand 0,6 m, bodem 10 m breed en 2,4 m
  onder het wegdek. Langs beide randen een schampkant van 0,9 × 0,5 m in plaats
  van de leuningen.
- Drie aanbruggen van 41 tot 46 m over de zuidelijke uiterwaard op twee
  wandpijlers van 1,7 m dik, onder 8,8 m breed (BGT) en onder het dek 11 m
  (foto's).
- De basculepijler (BGT, 4 × 19,2 m) als blok met verticale sleuven en het
  trappenhuis als blinde nissen van 0,4 m, en aan beide randen de liggende
  ronde aandrijfcilinder van 2,5 m onder het dek, 7,4 m naar het zuiden
  (foto's, luchtfoto).
- De stalen basculeklep van 20,5 m in gesloten stand, 1,8 m hoog, met een voeg
  van 0,5 × 0,3 m over het wegdek bij het draaipunt en bij de punt. In het AHN
  staat de klep open (top +42 m, dus 23,5 m vanaf het draaipunt).
- De steunpijler (BGT, 4 × 18,8 m) als portaal van twee kolommen met een
  bovenregel; de opening van 10,8 m breed loopt dwars door de pijler, tot
  2,5 m onder de bovenkant.
- De hoofdoverspanning van 148,5 m tussen de steunpijler en de pyloon
  (Wikipedia: 150 m).
- De pyloon van twee betonnen poten die naar boven toe naar elkaar toe lopen
  (±14,3 m naast de as op de uiterwaard, ±3,4 m in de top) en 10,3 graden
  achterover (noordwaarts, van de hoofdoverspanning af) hellen, met de top op
  +90,7 m (AHN, het hoogste punt; Wikipedia 93 m), 6,7 m dik aan de voet en
  2,6 m in de top, 3,6 tot 2,2 m breed. Tussen de poten de kop van +71 tot
  +84 m met een vlakke onderkant, waarin de tuien verankerd zijn, met
  daarboven de vrije poottoppen.
  Onder het dek een dwarsdrager met schoren van 50 graden naar de poten.
- Twee vlakken van elf tuien in de hoofdoverspanning, 3 m naast de as in het
  midden van het wegdek (AHN), met de voeten van s = 70 tot 163 om de 9,3 m
  en verankerd in de kop van +83 tot +72 m (29 tot 66 graden). Elke tui is
  een losse rechte staaf van 0,9 × 0,9 m (doorsnede loodrecht op de tui) van
  0,3 m onder het wegdek naar het hart van de kop; de ruimte tussen de tuien
  en tussen tuien, dek en pyloon is open.
- Vier achtertuien per vlak van de kop (+81 tot +75 m, 3 m naast de as) naar
  het ankerblok (s = 262 tot 271, 8,9 m naast de as), 38 graden, ook als
  losse staven van 0,9 m.
- De pijler in de achteroverspanning aan de dijkvoet (3 m dik, 8,8 tot 11 m
  breed).
- Het zuidelijke landhoofd (BGT) tot het wegdek en het ankerblok van 23,8 m
  breed (BGT) met aan beide zijden een afgeschuinde wand tot 1,2 m boven het
  wegdek, waarin de achtertuien eindigen.

Rijbaan met PDOK-attributen: op het dek ligt één actueel BGT-wegdeel met
relatieve hoogteligging 1, `L0002.c250d163ad614c63a74aaa92630445cf`
(functie `rijbaan autoweg`, fysiek voorkomen `gesloten verharding`, geen plus
fysiek voorkomen), de rijbaan van de N50 van x = -206,6 tot 206,9 en tot 8,2 m
naast de as; geen fietspad, voetpad of ondersteunend wegdeel op de brug. Het
model maakt daarvan de node `road:rijbaan` met in `extras.attributes`
`bgt_functie` rijbaan autoweg en `bgt_fysiekvoorkomen` gesloten verharding,
zodat de kleurregels van een thema op het dek werken zoals op de PDOK-wegdelen
ernaast. De rijbaan is de laag van 0,5 m onder het wegdek over het hele dek
tussen de schampkanten (2 cm vrij van de schampkant, dus 8,48 m naast de as),
met dezelfde hoogte als het dek; de snijstrook loopt tot 1 m boven het wegdek
en 0,5 m voorbij de uiteinden van het dek. De tuien blijven constructie: per
tui het stuk waar hij in de laag zit, met 2 cm vrij (rond elke voet in de
hoofdoverspanning een sleuf van 2,53 tot 3,47 m naast de as en 1,7 tot 4,5 m
lang, van x = -2,4 tot 92,8; bij de achtertuien, die met hun binnenkant net
in de rijbaan steken, houdt de rijbaan van x = 188,3 tot 200,2 op 8,24 m naast
de as op); de voegen van de klep (sleuven van 0,3 m) horen bij de rijbaan.
Volumes: brug 35.290 m³, rijbaan 3519 m³, constructie 31.770 m³; samen
precies de brug (het script controleert het). De STL bevat de brug als geheel
met de printvormen en is ongewijzigd.

Tuien op 1:1000: een tui van circa 0,15 m is niet te printen; in het model
is elke tui een staaf van 0,9 m, de minimale dikte, los van de andere, met de
ruimte ertussen open zoals bij de echte brug. Bij de kop liggen de ankers
1,1 m (hoofdoverspanning) en 2 m (achtertuien) boven elkaar; daar lopen de
staven van de hoofdoverspanning uiteen met een spleet die bij de kop
smaller is dan 0,1 m.
De STL, die zonder export wordt geprint, heeft als printvorm per vlak een
dichte plaat van 0,9 m dik tussen de buitenste tui, het dek en een lijn van
50 graden van het dek (s = 140,8 in de hoofdoverspanning, 234,2 in de
achteroverspanning) naar de kop, met de tuien als ribben van 1,0 m breed die
0,3 m uitsteken (flanken van 45 graden), en de drie binnenste tuien van de
hoofdoverspanning (52, 58 en 66 graden) als vrijstaande staven van
1,0 × 1,0 m.

Wat er niet in zit: leuningen, lantaarnpalen, de portalen met verkeerslichten
en de slagbomen bij de klep (dunner dan 0,9 m), het remmingwerk langs de
vaargeul (het staat als terreinstrook in het PDOK-terrein; een eigen versie
zou dat dubbelen), de steigers naast de pijlers, de open stand van de klep, de
contragewichtkelder (onder water) en de dwarsdragers onder het stalen dek.

Pasvorm op het AHN: het wegdek volgt het DSM binnen 0,1 m (40e percentiel per
4 m tussen de tuien door); de pyloontop ligt op de hoogste DSM-cel (+90,7 m
op s = 190,8, 2 m naast de as), de poten volgen de DSM-cellen per hoogte tot
op circa 1 m dwars en tot 2 m langs de as (het zuidvlak ligt op halve hoogte
in het DSM iets noordelijker). Tussen s = 160 en 256 ligt het DSM aan de
buitenste 3 m van het dek 2 tot 4 m lager dan het wegdek; de BGT en de
luchtfoto tonen daar het volle dek, dus het model houdt 18,8 m aan.

Printbaarheid op 1:1000: het model toont de echte vorm en laat het dichtmaken
aan de export over. De pyloonpoten hellen 6 tot 11,5 graden uit het lood en
de schoren van de dwarsdrager staan op 50 graden. Vrij hangen de onderkant
van het dek (7365 m², inclusief de schuine randen en de klep), de vlakke
onderkant van de dwarsdrager (40 m²), de onderkant van de cilinders, de
bovenregel van de steunpijler en de bovenkant van de blinde nissen in de
basculepijler (samen 76 m²), de vlakke onderkant van de kop (28 m²) en de
onderkant van de tuien (2015 m²: alle tuien flauwer dan 45 graden, dus alle
achtertuien en zeven van de elf tuien per vlak in de hoofdoverspanning); het
script controleert dat er boven het dek verder niets vrij hangt, dat alles
op dezelfde onderkant begint en dat de printversie buiten de nissen geen
overhang heeft. In de meettest van de webshop (`scripts/overhang-lab`, het
model op 1:1000) gaat het volume met "Ondersteuning v2.0" van 35,29 naar
64,52 cm³ (v1.0: 67,41 cm³), zonder ongedragen lagen, in 23 s (v1.0 49 s,
met 4,7 mm² ongedragen in stukjes waar geen printlijn in past); het vorige
model met de tuivlakken en de V-onderkant ging van 41,31 naar 70,48 cm³. Het
meeste daarvan is de opvulling onder het dek, waar ook de opening van de
steunpijler in valt. Waar de export nog vult: onder de vlakke onderkant van
de kop een wig tussen de poten (de vorm van de oude V-onderkant, geen wand
tot het dek), onder elke flauwe tui een smalle strook en tussen de staven
bij de kop de spleten; de ruimte tussen de tuien, het dek en de pyloon
blijft open. De STL, die zonder export wordt geprint, heeft als printvormen
aandrijfcilinders van een halve zeshoek met een kiel van 55 graden, in de
steunpijler aan beide kanten een blinde nis van 0,4 m, een V-onderkant van
50 graden onder de kop en de tuivlakken als platen met ribben (zie hierboven),
en is ongewijzigd. De printcheck hieronder is gemeten aan de eerdere versie
met die printvormen in de GLB. In de export gaan de constructie (genus 13: de vrije tuien,
de tuivlakken, de pyloonlus en de twee aandrijfcilinders) en de rijbaan
(genus 2: de gaten van de tuivlakken) samen met overhangopvulling door, die
naar de constructie gaat: de printcheck op 1:1000 neemt voor de uitsnede van
449 m 1:1122 (400 mm), status NoError voor beide onderdelen, constructie
48,6 cm³ tegen 67,6 cm³ met verticale opvulling (-28 %), rijbaan 2,3 cm³
(+0,5 %), samen 50,9 tegen 69,9 cm³, 12 tot 18 seconden; op 1:1500 (299 mm)
NoError, constructie 20,6 tegen 24,5 cm³, rijbaan 1,0 cm³ (+0,6 %), samen
21,6 tegen 25,5 cm³, 11 seconden. In het huidige model heeft de constructie
genus 34 en de rijbaan genus 22 (de sleuven rond de voeten van de tuien). Onder het dek komt een wig met een smal scherm tot de
onderplaat. De STL heeft dezelfde printvoet (wig van 50 graden vanaf de
dekrand en een scherm van 0,9 m). Het PDOK-terrein ligt op het water op de
waterspiegel van het model; op de dijken sluit het wegdek binnen 0,2 m op de
PDOK-weg aan. Het PDOK-weglint van de N50 hangt in de reconstructie als een
lint over de rivier door (tot 1 m onder het water) en blijft onder het dek
zichtbaar; dat is geen pand en wordt niet vervangen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Eilandbrug_(Overijssel))
(geopend 21 januari 2003, asymmetrische tuibrug met beweegbaar deel, 412 m
lang, 93 m hoog, hoofdoverspanning 150 m, doorvaarthoogte 14 m, Bouwdienst
Rijkswaterstaat met Hans van Heeswijk), PDOK BGT (overbruggingsdeel: dek,
landhoofd, aanbrugpijlers, basculepijler, steunpijler, ankerblok; wegdeel
L0002.c250d163ad614c63a74aaa92630445cf voor de rijbaan), PDOK AHN
(dsm en dtm 0,5 m via WCS: wegdek, pyloon, tuivlakken, basculeklep,
maaiveld), de PDOK-luchtfoto (klep, aandrijving, ankerblok), het PDOK-terrein
(waterspiegel) en Wikimedia Commons-foto's (Eilandbrug (Overijssel)
02-03-2021 (actm.) 02, 08 en 09.jpg; Eilandbrug Kampen Panorama.jpg;
Eilandbrug.jpg; 20140606 Eilandbrug bij Kampen.jpg; The new IJsselbridge near
Kampen from the West at 31 Januari 2015 - panoramio.jpg; Artistic cable
stayed bridge at Kampen North over the IJsselriver - panoramio.jpg) voor de
pyloon, de kop, het aantal tuien, de pijlers en het ankerblok. Geschat zijn
het aantal en de plaats van de tuivoeten (11 per vlak om de 9,3 m, s = 70 tot
163) en de ankerhoogtes in de kop, de plaats van de achtertuien (s = 262 tot
271, op het dek 8,9 m naast de as in plaats van op de rand van het ankerblok),
de dikte en breedte van de pyloonpoten, de hoogte van de kop, de pijler in de
achteroverspanning (plaats s = 216 en maten), de verbreding van de
wandpijlers, de constructiehoogte van dek (2,4 m) en klep (1,8 m), de
aandrijfcilinders en de schampkanten; de waterspiegel is die van het
PDOK-terrein (NAP -0,47 m), die met de stand van de IJssel meebeweegt. De
sleuven en het trappenhuis in de basculepijler zijn blinde nissen; de dikte
van de tuien (0,9 m in plaats van circa 0,15 m) is de minimale dikte op
1:1000.

Licentie van het model: eigen werk op basis van open bronnen.
