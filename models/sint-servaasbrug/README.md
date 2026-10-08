# Sint-Servaasbrug (Maastricht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `sint-servaasbrug.glb` | Catalogusbron in meters: node `building:sint-servaasbrug` met het stenen deel (zeven bogen, zes pijlers met ijsbrekers, borstwering), de grote pijler met het brugwachtershuis en het beeld, het stalen beweegbare deel en de landhoofden; de bovenste 0,5 m van het wegdek als `road:rijbaan`, `road:rijbaan-staal`, `road:fietspad` en `road:voetpad` met de BGT-attributen (zie hieronder) |
| `sint-servaasbrug-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder het stalen deel, met de onderkant (0,8 m onder de waterspiegel) op het printbed (187 × 43 × 14 mm) |
| `sint-servaasbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (176748,5, 317777,18), op de as
van het BGT-dek tussen de vierde en de vijfde pijler, op de waterspiegel van
de Maas (stuwpeil Borgharen, NAP +44,0 m) en de glTF-conventie Y omhoog. +X
loopt langs de brug naar Wyck (`xAxis` (0,99876, 0,04972), 2,85 graden
linksom vanaf het oosten), +Y stroomafwaarts naar het noorden. Het stenen
deel ligt aan de westkant (stadskant, x = -93,4 tot 35,5), de grote pijler
op x = 35,5 tot 40,1 en het stalen deel aan de Wyckse kant (x = 40,1 tot
90,6), met het oostelijke landhoofd tot x = 93,8. Het maaiveld wordt op acht
punten op het water naast de brug bemonsterd (`groundSamplePoints`, 14 m
naast de as onder de derde, vijfde en zesde boog en naast het stalen deel);
`groundOffsetMetres` is 0, zodat de waterspiegel van het model op het
PDOK-water ligt. Het model vervangt het brugwachtershuis op de grote pijler
(`NL.IMBAG.Pand.0935100000104552`, bouwjaar 1993).

Wegdek met PDOK-attributen: de bovenste 0,5 m van het wegdek is per
BGT-functie een eigen node met de attributen van het actuele BGT-wegdeel op
het dek (relatieve hoogteligging 1) in `extras.attributes`, zodat de
kleurregels van een thema op de brug werken:

| Node | `bgt_functie` | `bgt_fysiekvoorkomen` | `plus_fysiekvoorkomen` | BGT-wegdeel (`lokaal_id`) |
| --- | --- | --- | --- | --- |
| `road:rijbaan` | rijbaan lokale weg | open verharding | sierbestrating | L0002.ef0d68b3df2346f2a74499ccd7cbf599: het midden van het stenen deel, circa 4,1 m breed, tot halverwege de grote pijler (x = 37,0) |
| `road:rijbaan-staal` | rijbaan lokale weg | gesloten verharding | asfalt | L0002.ddc59588b2c64f9c9d9bc2e43bc6b86a: het midden van het stalen deel, 4,1 m breed, van x = 37,0 tot de kade (de BGT houdt op x = 92,8 op, doorgetrokken tot x = 93,8) |
| `road:fietspad` | fietspad | open verharding | (leeg in de BGT) | L0002.82b47aa4485647e3afb885dd611ba531 (noord) en L0002.bcbf444e559040489e552a178b0793f8 (zuid): naast de rijbaan tot de borstwering, op de grote pijler tot het platform |
| `road:voetpad` | voetpad | gesloten verharding | asfalt | L0002.2cb3ef8235ba4804a92a334ea93fbae8, L0002.56e79242eb654b0c9c84f7eca350ebe5, L0002.7737766851784db2955019416eb844f2, L0002.8c5bf5ed1737487dbf3033c104194145 (asfalt) en de strookjes L0002.9fdee0d5b43745468578b4590066396a en L0002.d4742e87321e466a9cfb1f2182bdfc85 (cementbeton, 0,25 × 1 m op het landhoofd): binnen en buiten de hoofdliggers |

De rijbaan heeft over het stenen en het stalen deel een ander fysiek
voorkomen en is daarom in twee nodes gesplitst (zoals `road:fietspad-viaduct`
bij de John Frostbrug). Het voetpad is op het stalen deel alles vanaf
x = 36,0 dat geen fietspad of rijbaan is: ook de randjes tussen de BGT-vlakken
en de hoofdliggers, tot de dekrand op 6,6 m (de BGT-voetpaden houden op
6,3 m op) en de twee strookjes cementbeton, die in de node met asfalt
opgaan. Contouren uit de BGT OGC API (`collections/wegdeel`), omgezet naar het
lokale stelsel en vereenvoudigd tot 5 cm. Het wegdek is een snijstrook van
0,5 m onder tot 1 m boven het wegdek over dezelfde loftstations als het dek;
de borstweringen, het platform van de grote pijler en de hoofdliggers blijven
met 2 cm marge constructie. Wegdeel = strook ∩ brug, constructie = brug −
strook; de volumes tellen op tot die van de brug als geheel (11 880,6 +
273,6 + 118,9 + 375,9 + 207,4 = 12 856,3 m³). Geen samenvallende vlakken
tussen de nodes (verticale stralen over het hele model). De STL is
ongewijzigd: het wegdek wordt pas na de printversie uitgesneden.

Onderdelen in het model (hoogtes in NAP):

- Het wegdek over 187 m van kade tot kade (BGT), volgens het AHN-DSM om de
  2 m: van +50,4 m aan de stadskant naar +52,3 m boven de vierde boog, +52,0 m
  bij de grote pijler en +51,4 m aan de kade in Wyck.
- Het stenen deel, 11,8 m breed (BGT), met een borstwering van 0,85 m (AHN)
  aan beide zijden.
- Zeven bogen van 11,4 tot 13,3 m tussen het westelijke landhoofd, de zes
  pijlers en de grote pijler (BGT). De openingen hebben een spitse top van 50
  graden 1,05 m onder het wegdek (+50,1 tot +51,2 m) en rechte zijden die
  onder of net boven het water op de pijlers aansluiten.
- Zes pijlers van 4,7 tot 5,0 m breed (BGT), met een spitse ijsbreker
  stroomopwaarts (zuid, punt 9,4 m uit de as) en een ronde stroomafwaarts
  (noord, 7,7 m uit de as), recht tot +48,9 m en daarboven een kap die naar de
  gevel oploopt tot +50,9 m (zuid) en +50,2 m (noord) (AHN).
- De grote pijler van 4,6 × 43 m dwars door de rivier (BGT), met een
  platform op +52,3 m naast het wegdek tot 15,5 m uit de as en kappen naar de
  koppen; op de zuidkant het brugwachtershuis (BAG) als stenen blok tot
  +55,5 m met het glazen huisje tot +57,3 m (AHN, het hoogste punt) en het
  beeld van Sint-Servaas als zuil tot +55,8 m.
- Het stalen beweegbare deel van 50,5 m, 13,2 m breed (BGT), met twee
  hoofdliggers van 0,9 m die 1,35 m boven het wegdek uitsteken (AHN) en een
  onderkant 1,4 m onder het wegdek.
- Het oostelijke landhoofd (BGT) tot het wegdek.

Binnen de voetafdruk ligt 97 % van de DSM-cellen binnen 2 m van het model
(93 % binnen 1 m, mediaan +0,05 m, mediaan absoluut 0,11 m); over het stenen
deel 97 %, over het stalen deel 99 % en over de grote pijler 86 %, waar het
AHN de lantaarns en de randen van het brugwachtershuis ziet.

Printbaarheid op 1:1000: de echte rondbogen hebben een vlakke kruin die
zonder steun niet print. Een spitse top van 50 graden onder de kruin past in
de 7 tot 8 m tussen water en wegdek alleen als driehoek, dus de openingen zijn
spitsbogen met rechte zijden; daarboven blijft 1,05 m metselwerk. Pijlers,
borstwering (0,9 m) en hoofdliggers (0,9 m) zijn dik genoeg om te dragen; de
lantaarns en de leuningen van het stalen deel zijn weggelaten. Alleen de
onderkant van het stalen deel hangt vrij (667 m²); het script controleert dat
alleen die naar beneden wijst, dat alles op dezelfde onderkant begint en dat
de printversie geen overhang heeft. In de export gaat het model als gesloten
solid met overhangopvulling door (een uitsnede van 240 × 120 m op 1:1000
duurt circa 2 seconden met de PDOK-tegels in de cache, 12,0 naar 15,3 cm³):
onder het stalen deel komt een wig met een smal scherm tot de onderplaat, en
omdat de opvulling elke laag onder 45 graden vanaf de gevels laat inkrimpen,
dicht ze de gewelven in het midden van de 11,8 m brede brug onder de top; aan
beide gevels blijven de spitsbogen open. Met het hulpmiddel van de
printcheck (uitsnede van 218 m rond het model op 1:1000, 2,1 s) gaan alle
onderdelen met status NoError door; de wegdelen krijgen geen eigen opvulling
(`extraPct` 0), de constructie gaat van 17,28 naar 14,49 cm³ (samen
18,26 naar 15,46 cm³, zoals het model in één node: 18,25 naar 15,46 cm³). De STL heeft dezelfde printvoet
(wig van 50 graden en een scherm van 0,9 m) en open gewelven, die zonder steun
printen. Het brugwachtershuis van PDOK zit niet meer in de export. Het
PDOK-terrein ligt op het water naast de brug op de waterspiegel van het
model, onder de bogen 0,7 tot 1 m hoger, onder het westelijke landhoofd circa
2 m boven het water (binnen het model) en sluit in Wyck binnen 0,4 m op het
wegdek aan.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Sint_Servaasbrug)
(1280-1298, in 1932-1934 geheel herbouwd en verbreed, zeven rondbogen, het
stalen beweegbare deel aan de Wyckse kant in plaats van twee bogen, beeld van
Charles Vos), het [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/28026),
PDOK BGT (overbruggingsdeel: dek, pijlers, grote pijler, landhoofd), PDOK BAG
(brugwachtershuis), PDOK AHN (dsm 0,5 m via WCS: wegdek, borstwering,
ijsbrekers, hoofdliggers, brugwachtershuis), Rijkswaterstaat (stuwpeil
Borgharen, NAP +44,0 m) en Wikimedia Commons-foto's (Sint-Servaasbrug
Maastricht.jpg; Sint Servaasbrug 2007.JPG; Beweegbaar deel Sint-Servaasbrug
1.jpg; Sint-Servaasbrug Maastricht Maas.jpg) voor de bogen, de ijsbrekers en
het stalen deel. Geschat zijn de waterspiegel (stuwpeil), de hoogte van de
kruin van de bogen (circa 1,1 m onder het wegdek, op foto's), de hoogte
waarop de ijsbrekers overgaan in hun kap, de onderkant van het stalen deel
(1,4 m onder het wegdek) en de maten van het stenen blok en het beeld naast
het glazen huisje; de rondbogen zijn spitsbogen, het westelijke landhoofd is
recht zonder de verbreding aan de zuidwestkant, de trottoirs liggen op
wegdekhoogte en de lantaarns en leuningen zijn weggelaten.

Licentie van het model: eigen werk op basis van open bronnen.
