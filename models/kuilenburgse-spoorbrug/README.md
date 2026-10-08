# Kuilenburgse spoorbrug (Culemborg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kuilenburgse-spoorbrug.glb` | Catalogusbron in meters met drie nodes: `road:spoor`, de bovenste 0,5 m van het dek op het BGT-wegdeel van de brug (spoorbaan), met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` gesloten verharding; `building:kuilenburgse-spoorbrug` met de rest van het stalen dek en de twee kokerbogen van de hoofdoverspanning (hangerscherm en windverband), de betonnen aanbrug, de gemetselde pijlers met betonnen koppen en de twee landhoofden, en node `building:monument-oude-spoorbrug` met het monument van 1983 (stuk van de vakwerkligger uit 1868 op een kolom) |
| `kuilenburgse-spoorbrug-1-2000.stl` | De brug (constructie en spoor samen) en het monument op 1:2000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (346 × 22 × 20 mm) |
| `kuilenburgse-spoorbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, het vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (143059,41, 441367,07) (WGS84
51,96061 N, 5,21348 O), op de as van het dek midden tussen de twee
rivierpijlers, op de waterspiegel van de Lek zoals het PDOK-terrein die legt
(NAP +2,8 m) en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
noorden, naar Schalkwijk (`xAxis` (-0,51024, 0,86003), 120,68 graden linksom
vanaf het oosten), +Y stroomafwaarts naar het westzuidwesten. Het
zuidelijke landhoofd begint op x = -100,4, de rivierpijlers liggen op
x = -83,1 tot -73,4 (oever bij Culemborg) en 73,8 tot 82,2, de acht pijlers
van de aanbrug op x = 118,3 tot 534,4 en het noordelijke landhoofd op
x = 589,3 tot 592,2. Het monument staat op (-77,4, -26,95), oostelijk naast
de zuidelijke rivierpijler. Het maaiveld wordt op acht punten bemonsterd
(`groundSamplePoints`): zes op de Lek naast de hoofdoverspanning (25 m naast
de as op x = -40, 0 en 40) en twee op de geul die bij x = 501,6 onder de
aanbrug door loopt (16,6 en 18,4 m naast de as). `groundOffsetMetres` is 0;
het PDOK-terrein legt de Lek op 46,43 m en de geul op 46,26 m ellipsoïdisch,
en het model staat met z = 0 op NAP +2,8 m, tussen beide in. Omdat de brug
693 m lang is, staat de laagste hoogte ook als vaste terugval in
`groundHeight` (46,26), zodat een uitsnede die alleen een uiteinde raakt het
model niet laat wegvallen. `replacesBuildings` bevat het BAG-pand van het
monument (0216100000016391, de ronde kolom van 5 m), dat PDOK als blok tot
NAP +26,5 m reconstrueert; onder de brug zelf ligt geen pand.

Wat er nu staat: de brug van 1868 (vakwerkligger van 154 m, destijds de
grootste overspanning ter wereld) is in 1981-1983 vervangen door een stalen
boogbrug van 155 m met betonnen aanbruggen; de nieuwe aanbrug ligt op de
gemetselde pijlers van de oude brug, die daarvoor betonnen koppen kregen. Een
stuk van de oude vakwerkligger staat als monument naast het zuidelijke
landhoofd, niet elders; het model bevat het als tweede node.

Onderdelen in het model (hoogtes in NAP):

- Het stalen dek van de hoofdoverspanning, 14 m breed (BGT) met de looppaden
  buiten de bogen, 2,4 m constructiehoogte en een onder 50 graden afgeschuinde
  onderkant van de looppaden. De spoorstaaf ligt op +17,5 m boven de
  rivierpijlers en met een zeeg op +17,8 m in het midden (AHN).
- Twee kokerbogen van 2 m breed, 4,85 m naast de as (AHN), van oplegging tot
  oplegging 152,8 m. De bovenkant volgt z = 42,8 - 0,00418 x² + 5,2·10⁻⁸ x⁴
  (top +42,8 m, bij de opleggingen +20,2 m); de koker is in de top 3,0 m hoog
  en loopt naar de opleggingen op tot 5,0 m, met een afgeschuinde onderrand
  aan de buitenkant.
- Twaalf hangers per boog op de knopen van het windverband (om de 11,18 m,
  x = -61,5 tot 61,5) als stijlen van 1,0 m in een scherm van 1,0 m dik tegen
  het binnenvlak van de boog, met elf spitse openingen per boog (flanken van
  50 graden, toppen van +26,9 tot +39,8 m). Tussen de laatste hanger en de
  oplegging is het scherm dicht, zoals de koker daar op de foto's een diepe
  plaat wordt.
- Het windverband tussen de bogen (AHN, luchtfoto): kruisende diagonalen van
  1,0 m in elf velden met een eindregel van 1,5 m aan beide kanten, 0,4 m
  onder de bovenkant van de boog en in het midden 0,9 m dik; de onderkant
  loopt onder 47 graden naar de bogen en eindigt bij elke hanger binnen het
  dichte deel van het scherm.
- De betonnen kokerligger van de aanbrug over tien velden (43,1, 42,6, 61,5,
  61,0, 61,2, 61,1, 60,9, 61,0 en 60,0 m), 10,8 m breed (BGT), 4,0 m hoog
  vanaf de spoorstaaf met een kraaglijst van 0,6 m en een afgeschuinde
  onderrand. De spoorstaaf daalt met 0,893 % van +17,5 m naar +12,9 m bij het
  noordelijke landhoofd (AHN, afwijking hoogstens 0,15 m).
- De twee rivierpijlers met ronde koppen (BGT, 9,7 × 28,3 en 8,4 × 29 m):
  metselwerk tot +9,0 m met een zware kraag die 0,8 m uitkraagt, een smaller
  blok (baksteen aan de zuidkant, beton aan de noordkant) en een oplegbank van
  17,2 m breed onder het dek.
- Acht pijlers van de aanbrug met spitse koppen (BGT, 5,3 tot 7,2 × 20 tot
  22,7 m; de laatste twee met rechte koppen en neuzen): metselwerk tot 4,0 m
  onder de ligger met een kraag van 0,3 m, een betonnen blok en een kop van
  12,8 m breed die 1,2 m langs de ligger omhoog steekt.
- Het gemetselde zuidelijke landhoofd (x = -100,4 tot -82,6, 13,6 m breed) en
  het noordelijke landhoofd (BGT), tot de spoorstaaf.
- Het monument "Een monument van steen en staal" (onthuld 18 oktober 1983):
  een kolom van 5 m doorsnede tot +13,0 m, een stalen paal van 1,2 m tot
  +16,0 m en het stuk ligger als plaat van 0,9 m, 10,6 m lang evenwijdig aan
  de brug (AHN), met twee stijlen van 2,6 m, een spitse spleet, vier spitse
  ruitvormige openingen, een V-vormige onderkant naar de paal en aan de
  buitenkant de afgezaagde diagonalen als vleugels tot +24,5 m.
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van het dek op het
  actuele BGT-wegdeel van de brug, L0004.fdf547dd99eb49ae993f3f716cf44ea0
  (spoorbaan, gesloten verharding, zonder plus-fysiek voorkomen, relatieve
  hoogteligging 1, van x = -100,4 tot 592,2), met in de GLB
  `extras.attributes` `{ bgt_functie: "spoorbaan", bgt_fysiekvoorkomen:
  "gesloten verharding" }`, zodat de kleurregels van een thema (bijvoorbeeld
  spoor zwart) op de brug werken zoals op de BGT-wegdelen ernaast. Het
  BGT-vlak (contour in lokale coördinaten, vereenvoudigd tot 5 cm) is op het
  zuidelijke landhoofd 11,1 m breed (y = -5,43 tot 5,71), over de boog twee
  stroken van 1,9 m (de twee sporen, 1,05 tot 2,95 m naast de as; het gat
  ertussen hoort in de BGT niet bij het wegdeel) en over de aanbrug 7,9 m
  (y = -3,9 tot 4,1). De bogen met het hangerscherm blijven over hun hele
  strook (y = 3,81 tot 5,87 naast de as, 2 cm vrij) en over de hele lengte
  van de boog constructie, net als het gat tussen de sporen, de looppaden
  buiten de bogen en de randen van de aanbrug (in de BGT onbegroeid
  terreindeel, geen wegdeel). De kopse kanten van het BGT-vlak liggen tot
  12 cm binnen de uiteinden van het dek; ze zijn 0,5 m voorbij het dek
  verlengd, zodat daar geen smalle reep constructie blijft staan. De strook
  loopt over dezelfde loftstations als het dek, van 0,5 m onder tot 1 m boven
  de spoorstaaf; spoor = strook ∩ brug, constructie = brug − strook (samen
  45.272 m³: constructie 42.782, spoor 2.489). Het script controleert dat de
  volumes optellen; er liggen geen samenvallende bovenvlakken van de nodes op
  het dek. Het spoor wordt pas na het printmodel uit de brug gesneden; de STL
  is ongewijzigd.

Wat er niet in zit: de bovenleiding met portalen en masten, seinen, leuningen,
de looprails op de bogen en de schuine schoren in de eindportalen (allemaal
dunner dan 0,9 m); de echte hangers zijn circa 0,6 m (op 1:1000 stijlen van
1,0 m); de geribde afwerking van de monumentkolom, de afzonderlijke staven
van de vleugels en de klinknagels (kleiner dan 0,9 m); de verdikking aan de
onderkant van de kokerligger midden in de velden (circa 0,3 m) en het
spoortalud achter de landhoofden (zit in het PDOK-terrein).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke grijze strook op het water zonder boog en zonder pijlers, en het
monument een grijs blok tot NAP +26,5 m. Het model heeft van oost en west de
boog met de hangers en spitse openingen, het windverband tussen de bogen en de
diepe eindplaten, van noord en zuid de twee bogen met het windverband
ertussen, en van alle kanten de gemetselde pijlers met kragen en betonnen
koppen, de kokerligger van de aanbrug met kraaglijst en het monument met het
stuk vakwerkligger.

Pasvorm op het AHN: de bovenkant van de bogen ligt per 4 m in 67 % van de 72
vakken binnen 1 m en in 97 % binnen 2 m van het hoogste DSM-punt op de
booglijnen (mediaan: AHN 0,48 m hoger, door de looprail en leuning op de
boog). De spoorstaaf van de aanbrug wijkt per 10 m hoogstens 0,15 m af van
het 75e percentiel van het DSM.

Printbaarheid op 1:1000: de hangers zijn een scherm met spitse openingen
(50 graden) tot onder de boog, de boog heeft een afgeschuinde onderrand en
het windverband een onderkant van 47 graden die bij elke hanger in het dichte
deel van het scherm eindigt (het script controleert dat per knoop: de staaf
hangt 2,0 tot 2,5 m onder de boog, het scherm is daar 2,9 tot 5,5 m dicht).
Kragen, pijlerkoppen en het monument kragen onder 50 graden uit. Alleen de
onderkant van het dek (5815 m²) hangt vrij; het script controleert dat er
verder niets naar beneden wijst (0 m² in de brug, 0,02 m² in het monument en
de printversie), dat alles op dezelfde onderkant begint en dat elke node een
gesloten manifold is (genus 58, 5 en 1 voor het spoor). Printcheck op 1:1000 met een uitsnede
van 300 m rond de hoofdoverspanning en het monument: status NoError voor
alle drie de nodes, 60 s; de constructie van 50,2 naar 33,9 cm³ ten opzichte
van de rechte opvulling (-32,5 %), het spoor 0,8 cm³ en het monument 0,3 cm³
zonder eigen opvulling (`extraPct` 0), samen 35,0 cm³ zoals voor de
opsplitsing; onder het dek komt een wig met een smal scherm tot de
onderplaat, de openingen in het hangerscherm en het windverband blijven open.
Het hele model past op 1:1000 niet in 400 mm; in een uitsnede van 633 m
(1:1582) gaat het ook als gesloten solid door (NoError, 15 s): de constructie
van 23,5 naar 17,6 cm³ (-25,2 %), het spoor 0,6 cm³ en het monument 0,07 cm³
met `extraPct` 0. De STL op 1:2000 heeft
dezelfde printvoet (wig van 50 graden en een scherm van 0,9 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kuilenburgse_spoorbrug)
(stalen boogbrug, hoofdoverspanning 155 m, lengte 667 m, breedte 10 m,
hoogte 25 m, doorvaarthoogte 16,2 m, betonnen aanbruggen, bouw april 1981 tot
december 1983, deel van de oude brug als monument naast de nieuwe), PDOK BGT
(overbruggingsdeel: dek, pijlers, noordelijk landhoofd; wegdeel: de spoorbaan
op de brug voor het spoor en zijn attributen), PDOK AHN (dsm en dtm
0,5 m via WCS: spoorstaaf, bogen, windverband, monument), PDOK BAG (pand
0216100000016391), de PDOK-luchtfoto (windverband, monument), het
PDOK-terrein (waterspiegel) en de Wikimedia Commons-foto's Kuilenburgse
spoorbrug 1 t/m 9.jpg, Culemborg - Kuilenburgse spoorbrug 2018
(42943756821).jpg en (28083500957).jpg, Spoorbrug Culemborg1.jpg, NS 1757;
Lekbrug Culemborg.jpg en Oude Kuilenburge spoorbrug monument 1 t/m 3.jpg voor
de kokerbogen, de hangers, de doorsnede van de aanbrug, de pijlers en het
monument. Geschat zijn de waterspiegel (NAP +2,8 m: PDOK-water 46,43 en
46,26 m ellipsoïdisch min 43,55 m), de kokerhoogte van de boog (3,0 m in de
top, 5,0 m bij de opleggingen), de top op NAP +42,8 m (Wikipedia 25 m boven
het spoor; het AHN geeft 42,4 m met uitschieters tot 43,8 m), de
constructiehoogte van het stalen dek (2,4 m) en van de kokerligger (4,0 m),
de hoogte van het metselwerk (+9,0 m bij de rivierpijlers, 4,0 m onder de
ligger bij de aanbrug), de maten van de betonnen blokken en koppen, de hoogte
van het windverband (0,4 m onder de bovenkant van de boog), de hangers op de
knopen van het windverband en de maten van het monument (kolom tot +13,0 m,
paal tot +16,0 m, ligger 9,5 m hoog).

Licentie van het model: eigen werk op basis van open bronnen.
