# Alexander Ver Huellbrug (Doesburg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `alexander-ver-huellbrug.glb` | Catalogusbron in meters met drie nodes: `road:rijbaan` en `road:fietspad` (de bovenste 0,5 m van het dek met de BGT-attributen, zie hieronder) en `building:alexander-ver-huellbrug` met de rest: het dek (hoofdliggers, consoles, randbalken), de twee bogen met de hangers, de twee rivierpijlers en de twee landhoofden |
| `alexander-ver-huellbrug-1-1000.stl` | De brug in één stuk op 1:1000 met een printvoet onder het dek, met de onderkant (0,8 m onder de waterspiegel) op het printbed (141 × 17 × 27 mm) |
| `alexander-ver-huellbrug.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, terugvalhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (205964,41, 448145,60) (WGS84
52,01932 N, 6,12967 O), op de as van het BGT-dek midden tussen de twee
rivierpijlers, op de waterspiegel van de IJssel zoals het AHN hem zag
(NAP +6,25 m), en de glTF-conventie Y omhoog. +X loopt langs de brug naar
Doesburg (`xAxis` (0,88248, -0,47034), -28,06 graden vanaf het oosten, dus naar
het oostzuidoosten), +Y stroomafwaarts naar het noordnoordoosten. Het
westelijke landhoofd (Ellecom) ligt op x = -70,6 tot -68,4, de pijlers op
x = -46,6 tot -42,6 en 42,6 tot 46,6 en het oostelijke landhoofd (Doesburg) op
x = 68,5 tot 70,2. Het maaiveld wordt op zes punten op het water naast de
hoofdoverspanning bemonsterd (`groundSamplePoints`, 15 m naast de as op
x = -30, 0 en 30). Het PDOK-terrein legt de IJssel daar op 50,23 tot 50,25 m
(ellipsoïdisch), circa 0,3 m boven de AHN-waterspiegel; `groundOffsetMetres`
-0,3 zet het wegdek daardoor op zijn NAP-hoogte, zodat het op de dijkweg
achter de landhoofden aansluit (PDOK 62,0 m, wegdek 62,1 m). Een uitsnede
zonder die punten valt terug op `groundHeight` 50,23, de laagste PDOK-hoogte
op die punten. De brug is geen BAG-pand en vervangt niets.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 140,9 m tussen de landhoofden en 16,2 m breed (BGT; 138 m en
  15,5 m volgens Structurae), met het wegdek volgens het AHN-DSM om de 2 m:
  +18,43 m aan beide landhoofden en +19,34 m in het midden. De rijbaan ligt
  tussen de twee hoofdliggers (7,7 m), de fiets- en voetpaden daarbuiten zijn
  3,3 m breed en 0,16 m lager (AHN). De constructiehoogte is 1,9 m onder het
  wegdek; onder de paden lopen de consoles schuin van de onderkant van de
  hoofdligger naar een randbalk van 0,6 m.
- De twee hoofdliggers 4,35 m naast de as (AHN), 1 m breed en 0,9 m boven
  het wegdek, over de hele lengte van landhoofd tot landhoofd (foto 1951).
- De twee bogen van de hoofdoverspanning (89,2 m hart op hart van de pijlers,
  89,32 m volgens Structurae) als kokers van 1 × 1,4 m op de hoofdliggers. De
  bovenrand is een veelhoek door de knopen van elf velden van 8,11 m op een
  cirkel met straal 85,5 m (AHN), met het middelste veld vlak op +32,2 m (het
  hoogste punt, 12,9 m boven het wegdek); aan de pijlers komt hij op de
  bovenkant van de ligger uit (+19,73 m).
- De tien hangers per boog op de knopen (afstand gemeten op de luchtfoto aan
  de dwarsstijlen van het windverband): tussen ligger en boog een scherm met
  stijlen van 1 m en elf spitse openingen (zijden van 52 graden) tot net onder
  de boog, in het middenveld tot +30,75 m; in de twee eindvelden, waar de boog
  naar de pijler zakt, een kleinere opening met de top tegen de eerste hanger.
- Twee rivierpijlers met een gemetselde voet van 4,0 × 16,8 m met ronde
  koppen (BGT) tot +11,3 m, en daarop onder elke hoofdligger een betonnen
  kolom van 2,8 × 3,4 m met een afgeschuind oplegblok van 2,0 × 2,6 m tot onder
  het dek.
- De twee landhoofden (BGT, 2,3 en 1,7 m diep) als blokken onder het dek.

Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek is in twee eigen
nodes van klasse `road` gelegd, met de attributen van de actuele BGT-wegdelen
op het dek (`relatieve_hoogteligging` 1, zonder `eind_registratie`) in
`extras.attributes`, zodat de kleurregels van een thema (fietspaden rood) op
de brug werken zoals op de wegdelen ernaast:

| Node | Attributen | BGT-wegdelen (lokaal_id) |
| --- | --- | --- |
| `road:rijbaan` | `bgt_functie` rijbaan regionale weg, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | P0025.fd1d608569ec48c2e04014ac0e2861a4 (zuidelijke helft) en P0025.fd1d608569ed48c2e04014ac0e2861a4 (noordelijke helft) |
| `road:fietspad` | `bgt_functie` fietspad, `bgt_fysiekvoorkomen` gesloten verharding, `plus_fysiekvoorkomen` asfalt | P0025.fd1d608569e748c2e04014ac0e2861a4 (noordzijde) en P0025.fd1d608569da48c2e04014ac0e2861a4 (zuidzijde) |

De rijbaan is de laag tussen de hoofdliggers (7,66 m breed, met 2 cm vrij
langs de liggers; de BGT-rijbaan is 7,2 m breed). De fietspaden lopen van de
hoofdligger (2 cm vrij) tot de buitenrand van het BGT-fietspad, 7,6 m
(noord) en 7,6 tot 7,76 m (zuid) naast de as, 0,16 m lager dan de rijbaan;
de strook van 0,35 tot 0,5 m daarbuiten tot de dekrand blijft constructie
(randbalk met leuning). De BGT legt de binnenrand van de fietspaden 0 tot
0,1 m naast de hoofdligger en de einden tot 0,2 m binnen het dekeinde; daar
volgt het model de ligger en het dekeinde. De lagen zijn een snijstrook van
0,5 m onder tot 1 m boven het wegdek over dezelfde loftstations als het dek:
wegdeel = strook ∩ brug, constructie = brug − strook. De hoofdliggers met de
bogen en het hangerscherm erop blijven met 2 cm marge constructie. Volumes:
constructie 5358 m³, rijbaan 539 m³, fietspaden 389 m³, samen precies de
6287 m³ van de brug als geheel (geen overlap; het script controleert dat).
Geen samenvallende bovenvlakken tussen de onderdelen (verticale stralen over
het dek). De STL bevat de brug als geheel en is ongewijzigd.

Wat er niet in zit: het windverband (kruisverband tussen de bogen over de
middelste zeven velden) en de twee eindportalen met knieschoren. Het zijn
horizontale staven van 0,5 tot 0,8 m die 7,7 m tussen de bogen overspannen, 7
tot 13 m boven de rijbaan; als dichte plaat of balk zou de overhangopvulling
van de export er een wand of vulling onder hangen tot op het wegdek, en een
spits alternatief zou als driehoekige gevel tot 2,8 m boven de rijbaan
reiken. Verder ontbreken de leuningen en lantaarns (dunner dan 0,9 m) en het
gemetselde gedenkmuurtje met de plaquette van de opening (26 januari 1952)
naast de oprit, dat geen deel van de brug is.

Pasvorm op het AHN: de bovenrand van de bogen volgt de omhullende van het DSM
op de bogen binnen circa 0,3 m (bijvoorbeeld +29,7 m op 21 m en +23,8 m op 37 m
uit het midden); het wegdek is het gladgestreken 25e percentiel en de paden
liggen er 0,16 m onder, zoals gemeten. De hoofdliggers zijn in het DSM tot
0,75 m boven het wegdek te zien (op 0,5 m vervaagt een ligger van 0,5 m); de
foto uit 1951 toont circa 1 m, het model gebruikt 0,9 m.

Printbaarheid op 1:1000: bogen, hangers, liggers en randbalken zijn 1 m breed
of meer, de openingen in het scherm hebben een spitse top van 52 graden en de
kolomkoppen een afschuining van 51 graden. Alleen de onderkant van het dek en
de consoles hangen vrij (2255 m²); het script controleert dat alleen die naar
beneden wijzen, dat alles op dezelfde onderkant begint en dat de printversie
geen overhang heeft. Printcheck op 1:1000 (uitsnede van 162 m, 162 mm):
status NoError voor alle drie onderdelen, 1,6 s, opvulling samen 13,9 cm³
tegen 20,2 cm³ bij verticale opvulling (-31 %; constructie 13,0 tegen
19,3 cm³, -32,5 %; rijbaan 0,54 en fietspaden 0,39 cm³ zonder eigen
opvulling, `extraPct` 0): onder het dek komt een wig van 45 graden met een
smal scherm tot de onderplaat, en de openingen tussen de hangers blijven open. De
STL heeft dezelfde printvoet (wig van 50 graden vanaf de randbalken en een
scherm van 0,9 m; 15,3 cm³). Het PDOK-terrein ligt op het water naast de brug
0,3 m boven de waterspiegel van het model, onder de zijoverspanningen 1,6 tot
4,6 m hoger (de oevers), en zakt bij de landhoofden naar 55 tot 58 m, zodat
daar 4 tot 7 m van de landhoofdblokken boven het terrein uitkomt; de dijkweg
erachter sluit binnen 0,1 m op het wegdek aan. PDOK zelf heeft op de plek van
de brug alleen een wegvlak op circa 56 m (6 m boven het water, onder het dek
van het model), dat niet als pand te vervangen is.

Bronnen: [Lijst van oeververbindingen over de (Gelderse) IJssel](https://nl.wikipedia.org/wiki/Lijst_van_oeververbindingen_over_de_%28Gelderse%29_IJssel)
(boogbrug, N317 Ellecom - Doetinchem), [Alexander Ver Huell](https://nl.wikipedia.org/wiki/Alexander_Ver_Huell)
(brug 1951, in 2016 naar hem vernoemd), [Structurae](https://structurae.net/en/structures/doesburg-bridge)
(1951, boogbrug met trekband, hoofdoverspanning 89,32 m, breedte 15,5 m,
lengte 138 m), PDOK BGT (overbruggingsdeel: dek, pijlers, landhoofden), PDOK
AHN (dsm en dtm 0,5 m via WCS: wegdek, paden, liggers, bogen, waterspiegel),
PDOK BGT wegdeel (rijbaan en fietspaden op het dek, attributen),
de PDOK-luchtfoto (hangerafstand) en Wikimedia Commons-foto's (IJsselbrug
Doesburg.jpg; Brug Doesburg.jpg; Provinciale weg 317 (brug Doesburg).jpg;
Nieuwe brug in Doesburg, Bestanddeelnr 904-9107.jpg en 904-9110.jpg) voor
het brugtype, de hangers, de liggers boven het dek, de consoles, de pijlers
en de doorvaarthoogteschaal op de pijler. Geschat zijn de constructiehoogte
van het dek (1,9 m), de hoogte van de hoofdliggers boven het wegdek (0,9 m),
de boogdiepte (1,4 m, foto), de breedte van bogen en hangers (1 m, de
printminimum), de bovenkant van het metselwerk van de pijlers (+11,3 m, uit de
doorvaarthoogteschaal van 7 tot 11 m) en de maten van de kolommen; de
waterspiegel is de AHN-waarde van NAP +6,25 m, die met de rivierstand
meebeweegt.

Licentie van het model: eigen werk op basis van open bronnen.
