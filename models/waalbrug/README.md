# Waalbrug (Nijmegen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `waalbrug.glb` | Catalogusbron in meters: node `road:rijbaan` met de bovenste 0,5 m van het wegdek en de attributen van het BGT-wegdeel (zie onder), en node `building:waalbrug` met de rest: het dek, de twee rivierpijlers, de hoofdboog met de hangers, de vier aanbruggen met hun tussenpijlers en de twee landhoofden |
| `waalbrug-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (655 × 32 × 52 mm; voor een gewoon printbed `--scale 2500`) |
| `waalbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (188352,47, 429309,98), op de as
van de brug midden tussen de twee rivierpijlers, op de waterspiegel van de
Waal (NAP +8,0 m, AHN) en de glTF-conventie Y omhoog. +X loopt langs de brug
naar het noorden, naar Lent (`xAxis` (-0,31158, 0,95022), 108,15 graden
linksom vanaf het oosten), +Y stroomafwaarts naar het westzuidwesten. Het
zuidelijke landhoofd aan het Keizer Traianusplein ligt op x = -332 tot -324,
de rivierpijlers op x = -131,5 tot -120,7 en 120,7 tot 131,7, de
aanbrugpijlers op x = -231,7 tot -223,3 (aan de Waalkade) en 223,6 tot 231,0
(in de uiterwaard van Veur-Lent) en het oude noordelijke landhoofd op
x = 315,9 tot 322,6. Het maaiveld wordt op zes punten op het water naast de
hoofdoverspanning bemonsterd (`groundSamplePoints`, 25 m naast de as op
x = -66, 0 en 64); `groundOffsetMetres` is 0, want het PDOK-terrein legt de
Waal binnen 0,02 m op de waterspiegel van het model. Geen BAG-pand onder de
brug.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 655 m van het Keizer Traianusplein tot het landhoofd op
  Veur-Lent, 24 m breed over de zuidelijke aanbruggen, 25,5 m over de
  hoofdoverspanning en 24 en 23 m over de noordelijke aanbruggen (BGT), met
  het wegdek volgens het AHN-DSM om de 2 m: +26,4 m aan het Keizer
  Traianusplein, +27,3 m in het midden en +24,4 m op het landhoofd van
  Veur-Lent. De constructiehoogte is 2,4 m, zodat de onderkant in het
  midden op +24,9 m ligt (doorvaarthoogte volgens Wikipedia +24,75 m).
- Twee rivierpijlers van 10,8 × 32 m met ronde koppen op 252 m hart op hart
  (BGT), tot onder het dek.
- De hoofdboog van 244,1 m tussen de opleggingen (Wikipedia): twee
  vakwerkbogen 7 m naast de as (AHN) als dichte banden van 1,2 m dik. De
  bovenrand is een cirkelboog (straal 202,7 m) met de top op +59,3 m (het
  hoogste punt, 51,3 m boven het water) die het wegdek 109 m uit het midden
  kruist (AHN); het vakwerk is in de top 6,5 m hoog en loopt naar de
  opleggingen op circa +18,5 m dicht. Onder het dek loopt de boog met een
  knie van 50 graden naar de pijler.
- De hangers op de 23 knopen van het vakwerk (22 velden van 11,1 m): tussen
  dek en boog een scherm van 1,2 m met veertien spitse openingen (zijden van
  55 graden) tot net onder de onderrand, de hoogste tot +52,7 m; in de twee
  velden bij de kruising met het dek is het scherm dicht.
- Vier aanbruggen van 85 tot 92,5 m (twee aan elke kant) met een boog onder het
  dek: de kruin net onder het dek, de aanzet bij de pijlers 9,4 m onder het
  wegdek; de ruimte tussen boog en dek is dicht. Aanbrugpijlers van 8,4 en
  7,4 m breed (BGT) met ronde koppen.
- Het zuidelijke landhoofd en het oude landhoofd op Veur-Lent (BGT) als
  blokken tot het wegdek.
- De rijbaan als eigen node `road:rijbaan`: de bovenste 0,5 m van het dek
  over de hele lengte (x = -332,2 tot 322,6) en breedte, behalve de strook
  van de twee bogen met hun hangerscherm (1,2 m plus 2 cm aan elke kant, van
  x = -111 tot 111, waar de bovenrand van de boog in de laag of erboven komt),
  die constructie blijft. In de GLB staan in `extras.attributes`
  `bgt_functie` rijbaan autoweg, `bgt_fysiekvoorkomen` gesloten verharding
  en `plus_fysiekvoorkomen` asfalt, zodat de kleurregels van een thema op de
  brug werken. Bron: het enige actuele BGT-wegdeel met relatieve
  hoogteligging 1 op het dek, `G0268.42ff08b49bbd5775e0530100007f0cc2`
  (rijbaan autoweg, x = -327,8 tot 323,9 over de volle breedte van 24 tot
  26 m, rond de rivierpijlers tot 31 m); de trottoirs en fietspaden
  op de brug zijn in de BGT geen eigen wegdeel, dus het model heeft geen
  `road:fietspad` of `road:voetpad`. De laag is een snijstrook over dezelfde
  stations als het dek van 0,5 m onder tot 1 m boven het wegdek (rijbaan =
  strook ∩ brug, constructie = brug − strook); de volumes tellen op tot die
  van de brug als geheel (80.710 + 7.724 = 88.434 m³) en geen twee
  bovenvlakken van de onderdelen vallen samen. De STL bevat de hele brug en
  is ongewijzigd.

Wat er niet in zit: de Verlengde Waalbrug over de Spiegelwaal (2013-2015),
die vanaf het landhoofd op Veur-Lent met een bocht naar Lent doorloopt (het
model houdt daar op met een kopvlak van circa 8 m boven het maaiveld), de
windverbanden en portalen tussen de twee bogen, het open vakwerk zelf, de
stijlen boven de bogen van de aanbruggen, leuningen en lantaarns.

Binnen de voetafdruk ligt 84 % van de DSM-cellen binnen 2 m van het model
(81 % binnen 1 m, mediaan +0,07 m, mediaan absoluut 0,25 m); zonder de
stroken van de bogen 89 %, over de aanbruggen 90 % en over het dek van de
hoofdoverspanning 87 %. Op de bogen zelf ziet het AHN door het open vakwerk
heen (de DSM-cellen liggen daar meestal tussen dek en bovenrand); de
omhullende per 8 m (hoogste DSM-cel op beide bogen) ligt in 17 van 27
vakken binnen 2 m van de bovenrand van het model, en elders tot 3 m lager.

Printbaarheid op 1:1000: het open vakwerk en de hangers (circa 0,5 m) zijn op
1:1000 niet te printen. De bogen zijn daarom dichte banden van 1,2 m en de
hangers stijlen van 1,2 m in een scherm met spitse openingen, zodat de
onderrand van de boog nergens vrij hangt. Onder het dek zou de boog met een
helling van circa 20 graden naar de pijler lopen; een knie van 50 graden
vanaf de kruising met het dek ondersteunt hem. Alleen de onderkant van het
dek (6123 m² over de hoofdoverspanning, plus stroken naast de ronde
pijlerkoppen) en de bogen van de aanbruggen hangen vrij (samen 14849 m²);
het script controleert dat alleen die naar beneden wijzen, dat alles op
dezelfde onderkant begint en dat de printversie geen overhang heeft. Met
655 m past de brug op 1:1000 niet in één uitsnede (de langste zijde is
hoogstens 400 mm); in een uitsnede van 720 × 360 m langs de brug
(1:1800, 400 × 200 mm) gaat het model als gesloten solid met
overhangopvulling door (circa 37 seconden, 18,7 naar 45,9 cm³): onder het
dek en de aanbruggen komt een wig van 45 graden met een smal scherm tot de
onderplaat, die over de rivier tot dicht bij het water reikt. De STL heeft
dezelfde printvoet (wig van 50 graden en een scherm van 0,9 m). Met de
rijbaan als eigen onderdeel vult de export de onderdelen samen op: in een
vierkante uitsnede van 659 m rond het model (1:1648, 400 mm) gaan beide
onderdelen als gesloten solid door (6,4 seconden), de rijbaan zonder eigen
opvulling (1,73 cm³, `extraPct` 0) en de constructie met 38,0 cm³, samen
gelijk aan de brug als één node vóór de opsplitsing (39,8 cm³). Het
PDOK-terrein ligt op het water op de waterspiegel van het model, onder de
zuidelijke aanbrug (Waalkade) 5,4 m en onder de noordelijke 7 m hoger, op
het Keizer Traianusplein 0,3 m boven het wegdek (het dek loopt het terrein
in) en op Veur-Lent 8,5 m boven het water, 7,9 m onder het wegdek.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Waalbrug_Nijmegen)
(1936, 604 m lang, boog van 244,1 m tussen de opleggingen, top circa
NAP +60 m, doorvaarthoogte NAP +24,75 m, breedte 26,5 m), het
[Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/523067),
PDOK BGT (overbruggingsdeel: dek, rivierpijlers, aanbrugpijlers, landhoofd
Veur-Lent; wegdeel: de rijbaan op het dek), PDOK AHN (dsm en dtm 0,5 m
via WCS: wegdek, bogen, waterspiegel, maaiveld) en Wikimedia Commons-foto's
(Waalbrug Nijmegen.jpg; Overzicht van de Waalbrug over de Waal - Nijmegen -
20425649 - RCE.jpg; Waalbrug, Nijmegen.jpg) voor het vakwerk, de hangers en
de bogen van de aanbruggen.
Geschat zijn de hoogte van het vakwerk (6,5 m in de top), de hoogte van de
opleggingen (circa NAP +18,5 m), het aantal velden (22), de
constructiehoogte van het dek (2,4 m), de pijlertoppen (onder het dek), de
pijl van de aanbrugbogen (7 m) en de plaats van het zuidelijke landhoofd
(x = -332 tot -324, waar het wegdek het terrein bereikt); de waterspiegel
is de AHN-waarde van NAP +8,0 m, die met de rivierstand meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
