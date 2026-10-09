# Edithbrug (Ravenstein)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `edithbrug.glb` | Catalogusbron in meters met twee nodes: `road:spoor`, de bovenste 0,5 m van de dekplaat op het BGT-wegdeel spoorbaan van de brug, met `extras.attributes` `bgt_functie` spoorbaan en `bgt_fysiekvoorkomen` gesloten verharding; en `building:edithbrug` met de rest van het kunstwerk: de vier boogbruggen met verstijvingsliggers, hangers en windverband, de twee plaatliggerbruggen, de dekplaat en het looppad, de vijf pijlers en de twee landhoofden |
| `edithbrug-1-1000.stl` | De hele brug (constructie en spoor samen) op 1:1000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (341,3 × 29,1 × 21,8 mm) |
| `edithbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (173425,65, 423658,51) (WGS84
51,80126 N, 5,65433 O), op de spooras (BGT-spoorhartlijn) in het hart van de
middelste pijler, tussen de tweede en de derde boog, op de waterspiegel van de
Maas zoals het PDOK-terrein die legt (NAP +5,10 m) en de glTF-conventie Y
omhoog. +X loopt langs de brug naar het noordoosten, naar Niftrik (`xAxis`
(0,850152, 0,526537), 31,77 graden linksom vanaf het oosten), +Y naar het
noordwesten (stroomafwaarts). Het zuidelijke landhoofd bij Ravenstein ligt op
x = -126,9 tot -124,7, de pijlers op x = -63,25, 0, 63,34, 126,94 en 170,58
(harten), het noordelijke landhoofd bij Niftrik op x = 212,5 tot 214,4. Het
maaiveld wordt op zes punten bemonsterd (`groundSamplePoints`), op de Maas
20 m naast de as midden onder de eerste drie bogen (x = -94,42, -31,63 en
31,67); het PDOK-terrein legt het water daar op 48,80 m ellipsoïdisch.
`groundOffsetMetres` is 0. Omdat de brug 341 m lang is, staat die hoogte ook
als vaste terugval in `groundHeight` (48,80), zodat een uitsnede die alleen een
uiteinde raakt (de uiterwaard bij Niftrik ligt 2,4 m hoger dan het water, de
spoordijk bij Ravenstein nog hoger) het model niet laat wegvallen of optilt.
`replacesBuildings` is leeg: onder en naast de brug ligt geen BAG-pand
(PDOK-dump), en er ligt geen ander catalogusmodel in de buurt.

Wat er staat: de enkelsporige spoorbrug van de lijn 's-Hertogenbosch -
Nijmegen, vernoemd naar Anne Edith Brogden. De oorspronkelijke vakwerkbrug uit
1872 is in 1940 en 1944 opgeblazen; de huidige brug uit 1946 (definitief
hersteld in 1948) bestaat uit vier stalen boogbruggen achter elkaar, met aan de
noordoostkant twee plaatliggerbruggen over de uiterwaard. De backlog noemde
alleen "boog"; foto's en het AHN laten de vier bogen en de twee plaatliggers
zien. De pijlers zijn breed genoeg voor een tweede brug naast de bestaande en
steken aan de oostkant (stroomopwaarts, -Y) 10 m buiten het dek uit.

Onderdelen in het model (hoogtes in NAP):

- Vier boogbruggen met verstijvingsligger tussen de opleggingen op het
  zuidelijke landhoofd (x = -125,6) en de eerste vier pijlers (overspanningen
  62,4, 63,3, 63,3 en 63,6 m). Twee volle boogribben in het vlak 2,8 m naast
  de as (AHN), 0,9 m breed en 1,1 m hoog. De bovenrand is een parabool die in
  het midden 11,07 m boven de koorde van het spoor ligt en naar de opleggingen
  met 0,0107 x² daalt (AHN, op het maximum per 2 m langs de ribben); de toppen
  liggen op +26,09, +26,06, +25,78 en +25,28 m, omdat de derde en vierde boog
  het dalende spoor volgen.
- Per boog elf platte hangers van 0,9 m op twaalf gelijke velden
  (luchtfoto), met tussen de hangers openingen met verticale zijden en een
  spitse top met flanken van 50 graden onder de rib (bij de uiteinden, waar de
  rib schuin loopt, schuift de top naar de hoge kant) en tussen de oplegging
  en de eerste hanger een driehoekige opening met de top tegen de hanger
  (12 openingen per rib, toppen van +19,2 tot +24,9 m).
- De verstijvingsliggers in hetzelfde vlak, van 1,6 m onder tot 0,6 m boven
  het spoor, met verticale verstijvers van 0,9 × 0,25 m aan de buitenkant op
  elke hanger en aan de uiteinden.
- Het windverband tussen de ribben: dwarsregels van 0,9 m op de hangers waar
  de rib meer dan circa 6 m boven het spoor ligt (zeven per boog), de
  buitenste als portaal van 1,2 m breed en 1,3 m dik, met kruisende
  diagonalen ertussen (luchtfoto); bovenkant 0,3 m onder de bovenrand van de
  rib, in het midden 0,9 m dik, met de onderkant onder 47 graden naar de
  ribben.
- Twee plaatliggerbruggen over de uiterwaard (x = 127,4 tot 170,1 en 171,0
  tot 214,1, 42,7 en 43,1 m): twee doorgaande plaatliggers in hetzelfde vlak,
  van 2,0 m onder tot 1,2 m boven het spoor (bovenkant AHN), met verstijvers
  om de 3,6 m.
- De dekplaat tussen de liggers (1,0 m, tot het spoor) over de hele lengte en
  het looppad aan de westkant (+Y) buiten de ligger, tot 4,6 m naast de as en
  over de laatste plaatligger tot 5,0 m (BGT), 0,2 m boven het spoor (AHN),
  met een rand van 0,35 m en een onderkant onder 46 graden naar de ligger.
- Spoor op +15,02 tot +15,03 m over de eerste twee bogen, met een
  overgangsboog naar een helling van 8 promille tot +13,25 m bij Niftrik
  (AHN, 25e percentiel over de spoorstrook per 4 m).
- Vijf gemetselde pijlers met spitse koppen (BGT, 3,6 tot 4,4 m breed en
  19,1 tot 20,2 m lang): een plint 0,4 m breder tot +8,3 m met een
  afgeschuinde bovenkant, de schacht en een deklijst die 0,3 m uitkraagt, met
  de kop op +12,65, +12,70, +12,12, +11,58 en +10,75 m (AHN); oplegblokken
  van 1,4 × 1,2 m onder elk liggereinde.
- De landhoofden (BGT): de voorwand met vleugels bij Ravenstein tot +12,65 m
  en bij Niftrik tot +10,9 m (AHN), met oplegblokken.
- Het spoor als eigen node `road:spoor`: de bovenste 0,5 m van de dekplaat op
  het actuele BGT-wegdeel L0004.9833e74410604a149b4c432e714eec3b (spoorbaan,
  gesloten verharding, zonder plus-fysiek voorkomen, relatieve hoogteligging 1,
  van x = -126,56 tot 214,09 en van 1,5 m oost tot 1,3 m west van de as), met
  in de GLB `extras.attributes` `{ bgt_functie: "spoorbaan",
  bgt_fysiekvoorkomen: "gesloten verharding" }`, zodat de kleurregels van een
  thema (bijvoorbeeld spoor zwart) op de brug werken zoals op de
  BGT-wegdelen ernaast. De contour is omgezet naar het lokale stelsel en
  vereenvoudigd tot 5 cm; de kopse kanten zijn 0,5 m voorbij het dek
  verlengd. De strook loopt over dezelfde knikken als het spoor, van 0,5 m
  onder tot 1 m boven het spoor; de liggers blijven over hun hele strook
  constructie (2 cm vrij). Spoor = strook ∩ brug, constructie = brug − strook
  (samen 9.710 m³: constructie 9.253, spoor 457). Het script controleert dat
  de volumes optellen; `zfight.py` vindt geen samenvallende vlakken. Het spoor
  wordt pas na het printmodel uit de brug gesneden; de STL bevat de brug als
  geheel.

Wat er niet in zit: de bovenleiding met masten en draden, de leuningen op de
ribben en langs het looppad, de stalen bordessen en trappen op de pijlers, de
kabelgoten, seinen en de klinknagels (allemaal dunner dan 0,9 m); de
dwarsdragers, langsliggers en het onderste windverband onder het spoor (vanaf
de zijkant niet zichtbaar en als vrije staven niet printbaar); de schuine
schoren onder het looppad; de spoordijk achter de landhoofden (zit in het
PDOK-terrein).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke grijze strook op het water en de uiterwaard met losse pijlerstompjes,
zonder bogen en zonder liggers. Het model heeft van het noordwesten en het
zuidoosten (de lange zijden) de vier bogen met de hangers, de spitse
openingen en de verstijvers, de plaatliggers met verstijvers en de pijlers met
plint en deklijst; van het zuidwesten en noordoosten (langs de brug) de
ribben met het windverband en de portalen, het looppad aan de westkant en de
pijlers die aan de oostkant 10 m buiten de brug uitsteken.

Pasvorm op het AHN: de bovenrand van de ribben ligt in de toppen binnen 0,05 m
van het hoogste DSM-punt (+26,1, +26,1, +25,8 en +25,3 m) en volgt het
maximum per 2 m langs de ribben binnen circa 0,5 m; het spoor ligt binnen
0,03 m van het 25e percentiel van het DSM op de spoorstrook, de pijlerkoppen
binnen 0,05 m van de mediaan van het DSM op het deel buiten de brug.

Printbaarheid op 1:1000: de openingen tussen de hangers hebben spitse toppen
(flanken van 50 graden) of zijn driehoeken met de top tegen de hanger; het
windverband heeft een onderkant van 47 graden, de deklijsten van de pijlers
kragen onder 50 graden uit en het looppad heeft een onderkant van 46 graden.
Boven het dek hangt in het model niets vrij (0 m²). Alles begint op dezelfde
onderkant (0,8 m onder de waterspiegel) en elke node is een gesloten manifold
(constructie één component, genus 250; het spoor één component). Printcheck
op 1:1000 met een uitsnede van 332 m rond het hele model (332 mm): status
NoError voor beide nodes, 63 s; de constructie van 16,8 naar 16,0 cm³ ten
opzichte van de rechte opvulling (-4,6 %), het spoor 0,43 cm³ zonder eigen
opvulling (`extraPct` 0). Onder het dek komt een wig met een smal scherm tot de
onderplaat; de openingen tussen de hangers blijven open. De STL op 1:1000 heeft
dezelfde printvoet (wig van 50 graden en een scherm van 0,9 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Edithbrug) (vier
boogbruggen achter elkaar uit 1946, enkelsporig, pijlers breed genoeg voor een
tweede brug), PDOK BGT (overbruggingsdeel: dek L0004.0eae333b..., pijlers
L0002.e70d3745..., L0002.7487b1bd..., G0296.7da54c53..., G0296.a1ab83a2...,
G0296.097ba30d..., landhoofden L0004.0df7e834... en G0296.9f97297a...;
wegdeel: de spoorbaan op de brug voor het spoor en zijn attributen; spoor: de
hartlijn, as van het model), PDOK AHN (dsm en dtm 0,5 m via WCS: spoorhoogte,
bovenrand en ligging van de ribben, liggers, looppad, pijlerkoppen en
landhoofden), de PDOK-luchtfoto (hangers, windverband, looppad), het
PDOK-terrein (waterspiegel) en de Wikimedia Commons-foto's Edithbrug vanaf
Niftrik.JPG, Railway bridge Edithbrug on the Niftrik side.jpg, WLM -
23dingenvoormusea - Spoorbrug over de Maas bij Ravenstein.jpg en Tussen
Ravenstein en Niftrik, spoorbrug over de Maas foto5 2016-04-20 10.59.jpg voor
de volle ribben, de platte hangers, de plaatliggers met verstijvers, het
portaal en het windverband en de gemetselde pijlers. Geschat zijn de
waterspiegel (NAP +5,10 m: PDOK-water 48,80 m ellipsoïdisch min 43,70 m), de
ribhoogte (1,1 m), de staafmaten (ribben, hangers en liggers 0,9 m breed), de
hoogte van de verstijvingsliggers (2,2 m) en de plaatliggers (3,2 m), de
dekplaat (1,0 m), de oplegblokken, de plint (tot NAP +8,3 m) en de deklijst
van de pijlers, de ligging van de hangers (twaalf gelijke velden per boog) en
de maten van het windverband.

Licentie van het model: eigen werk op basis van open bronnen.
