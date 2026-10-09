# Maasbrug bij Gennep (Gennep)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `maasbrug-gennep.glb` | Catalogusbron in meters met vier nodes: `road:rijbaan` (`bgt_functie` rijbaan regionale weg, gesloten verharding, asfalt), `road:fietspad` (fietspad, gesloten verharding, asfalt: het Limburgse deel vanaf x = 32,7) en `road:fietspad-cementbeton` (fietspad, gesloten verharding, cementbeton: het Brabantse deel), de bovenste 0,5 m van het dek met de attributen in `extras.attributes`; en `building:maasbrug-gennep` met de rest: het dek met de band en de schampkant, de vijf vakwerkliggers, de vier pijlers van de oude spoorbrug en de landhoofden |
| `maasbrug-gennep-1-1000.stl` | De brug in één stuk (constructie en wegdek samen) op 1:1000 met een printvoet onder het dek, met de onderkant (1 m onder de waterspiegel) op het printbed (315 × 24 × 18 mm) |
| `maasbrug-gennep.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vaste maaiveldhoogte, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (194494,52, 411755,37) (WGS84
51,69318 N, 5,95842 O, 8 m ten westen van de controle-URL), midden op de brug
(midden tussen de uiteinden van de vakwerken, in het middelste veld) op de as
tussen de twee liggers, met z = 0 op de waterspiegel van de Maas (NAP
+8,13 m) en de glTF-conventie Y omhoog. +X loopt langs de brug naar het
oosten, naar Gennep (`xAxis` (0,99402, 0,10921), 6,27 graden vanaf het
oosten, langs de randen van het BGT-dek), +Y naar het noorden
(stroomafwaarts). De liggers staan op y = ±4,05, het dek loopt van y = -4,6
tot 7,02 en van x = -157,03 (landhoofd bij Oeffelt, BGT) tot 158,02 (einde
van het BGT-dek bij Gennep). De pijlers staan op x = -93,3, -30,6, 32,1 en
94,8. Het maaiveld wordt op zes punten op het water van de Maas bemonsterd
(`groundSamplePoints`: 20 m ten zuiden en 14 m ten noorden van de as, op
x = -15, 12 en 60); `groundOffsetMetres` is 0, want het PDOK-terrein legt de
Maas daar op ellipsoïdisch 52,05 tot 52,07 m (NAP +8,13 m; de uiterwaard
ligt in PDOK 43,93 m boven het AHN). Omdat de brug 315 m lang is, staat de
laagste PDOK-hoogte op die punten ook als vaste terugval in `groundHeight`
(52,05), zodat een uitsnede die alleen een uiteinde raakt het model niet
laat wegvallen. Er ligt geen BAG-pand onder de brug; `replacesBuildings`
ontbreekt. Er ligt geen ander catalogusmodel in de buurt.

De verkeersbrug van 1955 (N264) ligt op de noordkant van de gemetselde
pijlers van de spoorbrug van het Duits Lijntje (1873, in 1944 opgeblazen,
1950 hersteld, 1973-1974 afgebroken). Het zuidelijke deel van de pijlers,
waar de spoorbrug lag, steekt nog 8 m naast het dek uit.

Onderdelen in het model (hoogtes in NAP):

- Het dek van 11,6 m breed (BGT), de rijbaan volgens het AHN in een flauwe
  bolling: +20,24 m in het midden, +19,45 m bij de landhoofden (aan de
  oostkant is het AHN boven x = 125 verstoord; het profiel is symmetrisch
  genomen). Tussen de liggers de rijbaan van 6,7 m met een band van 0,4 m
  breed en 0,25 m hoog tegen de noordelijke ligger (BGT berm, beton
  element), buiten de noordelijke ligger het fietspad 0,17 m hoger (AHN) op
  een uitkraging (onderkant van 1,2 m onder het fietspad aan de ligger tot
  0,6 m aan de rand), langs de rand een schampkant van 0,7 m breed en
  0,45 m hoog in plaats van de leuning. Constructiehoogte onder de rijbaan
  1,5 m (geschat).
- Vijf losse vakwerkliggers met evenwijdige randen, per lijn een plaat van
  1,0 m dik op y = ±4,05 (AHN), bovenrand 5,1 m boven de rijbaan (AHN: NAP
  +24,9 m bij de landhoofden tot +25,3 m in het midden), langs het
  lengteprofiel gebogen. De onderste uiteinden liggen op x = ±156,4 (AHN)
  en boven de pijlers 0,5 m uit elkaar (de onderranden raken elkaar daar);
  de bovenranden houden boven elke pijler een spleet van 7,9 m
  (luchtfoto: losse overspanningen met elk een eindportaal). Per
  overspanning acht vakken Warren zonder verticalen (foto's; vakken van 7,7
  tot 7,9 m, het windverband op de luchtfoto heeft een steek van 7,8 m),
  schuine eindstijlen en diagonalen van 49 graden. Overspanningen 62,8,
  62,2, 62,2, 62,2 en 61,4 m. Per ligger acht doorgaande driehoekige
  openingen met de punt omhoog per overspanning (spitse top van 52 graden
  onder de diagonalen, de diagonalen worden naar onderen breder; onderaan
  een verticaal stukje van 0,1 m) en zeven blinde nissen van 0,35 m aan de
  buitenkant voor de driehoeken met een vlakke bovenkant; onderrand tot
  0,6 m boven het wegdek.
- Vier gemetselde pijlers met ronde koppen volgens de BGT (x = -30,6, 32,1
  en 94,8; 4,7 tot 7,6 m breed en 19,4 tot 23 m lang); de pijler op x = -93,3
  staat niet in de BGT en is die op x = -30,6, 62,7 m verschoven (AHN:
  bovenkant op dezelfde plek). Bovenkant van het metselwerk NAP +17,6,
  +17,9, +18,0 en +17,6 m (AHN), 1,2 m daaronder een kraag van 50 graden
  met een band van 0,35 m die 0,25 m uitsteekt (foto). Op het zuidelijke
  deel de oude oplegblokken van de spoorbrug: twee blokken van 1,0 m breed
  en 0,6 m hoog dwars over de pijler op y = -10,65 en -5,65 (AHN). Onder het
  dek een betonnen oplegging tot in het dek (foto, maten geschat).
- De landhoofden: bij Oeffelt het BGT-landhoofd van x = -157,03 tot -154,3,
  bij Gennep gespiegeld van 154,3 tot het einde van het dek, tot in het dek.
- Het wegdek als eigen nodes: de strook van 0,5 m onder tot 1 m boven het dek
  (rijbaan en fietspad elk op hun eigen hoogte), min de hele strook van de
  liggers (ook onder de openingen en boven de pijlers, en de zuidelijke tot
  voorbij de dekrand), de band en de schampkant met 2 cm vrij; wegdeel =
  strook ∩ brug, constructie = brug − strook. Rijbaan = de strook tussen de
  liggers; fietspad = de strook buiten de noordelijke ligger, gesplitst op de
  gedeelde rand van de BGT-fietspaden. De volumes tellen op tot de brug als
  geheel. Actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek:

  | Functie | Fysiek voorkomen | lokaal_id | Node |
  | --- | --- | --- | --- |
  | rijbaan regionale weg | gesloten verharding, asfalt | P0030.2ebda7e4884a4c74928bc24e0d6d6893, P0030.5edde800f2a34347bfd7b442983f2412, P0030.00f6f96862f1f68ae050120a080440dd, P0030.00f6f96862f2f68ae050120a080440dd, P0031.4aadda9114d22225e053160d000a34f1, P0031.4aadda9114d32225e053160d000a34f1 | `road:rijbaan` |
  | rijbaan regionale weg | gesloten verharding, cementbeton (goot van 0,2 m langs de zuidelijke ligger) | P0030.46c0ed933c5e46afb5452f674beec6af, P0030.00f6f968d85df68ae050120a080440dd | bij `road:rijbaan` genomen (asfalt) |
  | fietspad | gesloten verharding, cementbeton | P0030.00f6f96898d3f68ae050120a080440dd, P0030.c801b770d04c4653a65e0e021401d917 | `road:fietspad-cementbeton` |
  | fietspad | gesloten verharding, asfalt | P0031.4aadda9114d42225e053160d000a34f1 | `road:fietspad` |
  | berm (ondersteunend wegdeel) | cementbeton, beton element | P0030.00f6f968fabdf68ae050120a080440dd, P0030.630087c93a1b45e68ee5f282494f318d, G0907.63971cd1b0c24d2e9d30f6d285a8688b, P0030.3e1e1a1ae93d4097b1ce8e430044ba40, P0030.6a5f236feb124e55b6a0f9454bdd6fc3 | constructie (band en noordelijke ligger) |

Wat er niet in zit: het windverband en de eindportalen boven de rijbaan
(horizontale staven vrij over 7,1 m op 5 m boven het wegdek; op 1:1000 vult
de export daaronder dwars over de rijbaan op, dus weggelaten), leuningen,
lantaarns en borden (dunner dan 0,9 m), de dwarsdragers, consoles en het
onderste windverband onder het dek (de export vult onder het dek op), de
beschildering van de portalen (kleur, geen vorm), de bouwplaats en de
steigers bij het oostelijke landhoofd (BGT kunstwerkdeel steiger, tijdelijk
of op maaiveld) en de dijken achter de landhoofden (PDOK-terrein).

Vergelijking met de PDOK-reconstructie (`?landmarks=0`): daar is de brug een
vlakke grijze wegstrook die van de dijken naar het water afloopt, zonder
vakwerk, pijlers of dek in de lucht. Het model heeft van het noordwesten en
noordoosten (325 en 55 graden) de noordelijke ligger met de uitkraging en het
fietspad, de vijf losse overspanningen met schuine eindstijlen en de spleten
boven de pijlers, de openingen en nissen en de ronde pijlerkoppen onder het
dek; van het zuidoosten en zuidwesten (145 en 235 graden) de zuidelijke
ligger op de dekrand en de pijlers die met de oude oplegblokken 8 m naast het
dek uitsteken, zoals op de foto's van de pijlers in de uiterwaard.

Pasvorm op het AHN: op de rijbaan ligt 68,6 % van de DSM-cellen binnen 1 m
van het wegdek van het model (7690 cellen, mediaan +0,02 m; de rest zijn het
windverband en de liggers boven de rijbaan, auto's en het verstoorde stuk
aan de oostkant), op het fietspad 69,6 % binnen 0,5 m (mediaan 0,00 m; de
rest zijn de leuning en gaten in het AHN). De bovenrand staat in het DSM op
NAP +24,9 tot +25,5 m (98e tot 99,5e percentiel per veld) tegen +24,7 tot
+25,3 m in het model.

Printbaarheid op 1:1000: elke ligger is een dichte plaat van 1,0 m met staven
van 0,9 m; elke doorgaande opening heeft een plafond van 52 graden (het script
controleert dat), de driehoeken met een vlakke bovenkant zijn blinde nissen.
Alleen het ondervlak van het dek hangt vrij; in de printversie met voet
blijven alleen de nisplafonds van 138 m² over (0,35 m diep, op de wand).
Alles begint op dezelfde onderkant. Printcheck op 1:1000 (uitsnede van
344 m): status NoError voor alle vier onderdelen, de constructie van 37,5
naar 21,6 cm³ (de printbare opvulling is 42,5 % minder dan de rechte
opvulling tot de onderplaat), de `road:`-onderdelen zonder eigen opvulling
(`extraPct` 0), 21,2 s; de vakwerkopeningen blijven open. De STL heeft een
printvoet: een wig van 50 graden onder beide dekranden op een scherm van
0,9 m tot de onderplaat. Controle op samenvallende vlakken (30 000 verticale
stralen over het dek en 60 000 over het hele model): geen samenvallende
vlakken.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Maasbrug_bij_Gennep)
(bouwjaar 1955, vijf overspanningen van circa 62 m, 313 m lang, 11 m breed,
de spoorbrug op de zuidkant van de pijlers); PDOK BGT overbruggingsdeel,
wegdeel en ondersteunend wegdeel; PDOK AHN DSM en DTM 0,5 m (WCS);
PDOK-luchtfoto (Actueel_orthoHR); Wikimedia Commons: Bridgegennepbrabant.jpg,
Bridgegenneplimburg.jpg, Gennep brug N264.jpg, Oeffelt Rijksmonument 518572
brugpijlers Maasbrug.JPG, Oeffelt, RM 518573 brugkazemat noord, positie ten
opzichte van de brug.JPG, Opening nieuwe brug over Maas bij Gennep,
Bestanddeelnr 907-1390.jpg.

Geschat: de vakverdeling (acht vakken per overspanning, uit het windverband
op de luchtfoto en de verhouding vak/hoogte op de foto van onderen), de
breedte van de staven (0,9 m) en de dikte van de liggerplaten (1,0 m), de
onderrand tot 0,6 m boven het wegdek, de constructiehoogte van het dek
(1,5 m, uitkraging 1,2 tot 0,6 m), de vorm van de pijler op x = -93,3, de
kraag om de pijlers, de betonnen oplegging onder het dek, het oostelijke
landhoofd (gespiegeld) en de schampkant langs het fietspad.

Gegevens: BGT, AHN en luchtfoto van PDOK (CC0/CC BY 4.0); foto's van
Wikimedia Commons alleen als referentie, niet in het model opgenomen.
