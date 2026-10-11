# Gasuniegebouw (Groningen)

Hoofdkantoor van de Gasunie aan de Concourslaan, ontworpen door Alberts en Van Huut en geopend in april 1994. Het is een voorbeeld van organische architectuur ("weinig rechte hoeken") met de bijnaam de Apenrots. De hoogbouw is een geknikte schijf van twee smalle vleugels rond een hogere kern. De glazen koppen lopen schuin naar buiten uit, schuine bakstenen steunberen eindigen boven het dak in punten, en voor de kern hangt de glazen "stropdas" van de trappenhal. Eromheen ligt een laagbouw met zinken lessenaars- en schilddaken.

Het model bestaat uit benoemde bouwdelen in een eigen gebouwstelsel: prisma's, dakvlakken als planvergelijking boven een veelhoek, en geëxtrudeerde profielen voor de schuine koppen en steunberen. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-forum-groningen.mjs` (schuine vlakken), `generate-haagse-toren.mjs` en `generate-castalia.mjs`. Reproductie: `node scripts/generate-gasuniegebouw.mjs`.

## Bestanden en plaatsing

- `gasuniegebouw.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 14.072 driehoeken).
- `gasuniegebouw.json`: catalogusitem.
  - RD-oorsprong `[232800, 580010]`: in de kern.
  - `xAxis` 44,6°: langs de zuidwestvleugel naar de kern, dus naar het noordoosten. Een lijnfit op de dakranden in het AHN gaf 45,3° voor de zuidoostgevel en 43,9° voor de noordwestgevel.
  - +Y wijst naar het noordwesten, de entreezijde met de rotonde.
  - De noordvleugel staat op 80,9° in RD (fit: 80,6° en 81,2°), dus 36,3° gedraaid ten opzichte van het modelstelsel.
- `gasuniegebouw-1-1000.stl`: millimeters, Z omhoog, 149,5 × 80,3 × 86,7 mm, vlakke voet.

**Maaiveld.** z = 0 ligt op NAP −0,85 m, op het maaiveld aan de zuidoostkant (AHN-DTM −0,83 tot −0,92). Aan de westkant ligt het maaiveld op −0,1 tot −0,4, aan de oostkant op −1,2 tot −1,5. De voet loopt door tot −1,1 m (NAP −1,95), onder het laagste maaiveld. `groundOffsetMetres` is 0. De `groundSamplePoints` liggen aan de zuidoostkant: `[-20,-35] [0,-35] [40,-33]`.

**Vervangen pand.** Het model vervangt alleen BAG `0014100010929941` (bouwjaar 1994): de hoogbouw en de hele laagbouw, inclusief de daktuin aan de oostkant. Het kleine paviljoen ten zuidwesten (`0014100010960580`, 1994, achthoekig koperen dak) is een los pand op ruim 30 m afstand. Het hoort niet bij het model; daar blijft het PDOK-pand staan. Het pand `0014100040026256` (2023) bij de parkeerplaats hoort er ook niet bij. In de buurt staan geen andere landmarkmodellen; het dichtstbijzijnde is het station op 1,4 km.

## Onderdelen (hoogtes NAP, uit AHN en 3D BAG)

### Hoogbouw

- **Zuidwestvleugel**: 13,6 m breed bij de kop en 12,6 m bij de kern, plat dak op +76,0 (3D BAG 76,05).
  - Installatiestrook in het midden van het dak, tot +79,7 (3D BAG 79,6, AHN 80).
- **Noordvleugel**: 13,1 m breed, dak +67,0 (3D BAG 67,03; AHN 67,0 langs beide gevels).
  - In het midden de blauwe dakopbouw van 5 m breed op +68,4 (3D BAG 68,42).
  - Bij U 41–45,5 is die opbouw verhoogd tot +69,2 (AHN).
- **Kern op de knik**: dak op +82,0 (3D BAG 81,84) met een dakrand van 0,9 m tot +84,8 rondom en een dwarsmuur op het dak (AHN 84–85). Hoekpunten uit het AHN.
- **Oostpartij** tussen de kern en de noordvleugel: plat dak op +70,8 (3D BAG 70,80–70,89).
- **Glazen koppen**: beide vleugeleinden lopen schuin naar buiten, gemeten in AHN-doorsneden over de hele breedte.
  - Zuidwest: dakrand op X −50,5, dan −52,0 op +52, −54,0 op +29 en −56,5 op +15,5.
  - Noord: dakrand op U 55,5, dan 57,0 op +51, 59,0 op +29 en 62,0 op +14.
- **Gevelkammen**: de bovenkant van elke lange gevel is een wand van 0,9 m dik met een gebogen en geknikte bovenrand, geen trap van hoogtelagen. Het profiel komt uit het AHN-DSM: het maximum per 0,5 m in een strook tot 2 m binnen de gevel, regelmatig gemaakt.
  - De dakranden zwaaien op naar de kern. Zuidwestvleugel: +76,6 in het midden naar +78,5 bij de kern. Noordvleugel west: +67,6 naar +69,2 bij de kern; noordvleugel oost: een opgezet stuk tot +73,0 naast de oostpartij.
  - Bij de koppen lopen ze uit in een bolle kap met een spitse punt. Zuidwestvleugel: punten +82,0 (zuidoost, X −47,8; AHN 80–82) en +81,0 (noordwest, X −47,0; AHN 79,9). Noordvleugel: +70,6 (west) en +70,4 (oost) bij U 41,6–41,8, en een hoekpunt van +70,2 bij de noordkop.
  - Op de zuidoostgevel van de zuidwestvleugel staat een opgezet stuk van +80,4 bij X −36 tot −32 (AHN 80,5).
- **Kappen**: de donkere gebogen kappen naast de punten zijn gemodelleerd als bolle kwartellipsen van 2,5 m dik tegen de binnenkant van de gevel. Ze rijzen eerst steil en daarna vlak op van de borstwering naar de punt. Hun hoogte is begrensd door het AHN: in het midden van het dak geeft het AHN daar alleen +76/+77 (zuidwest) en +69,2 (noord). De vorm is geschat uit de foto's.
- **Steunberen**: schuine bakstenen beren op de grens tussen de baksteen en de glazen kop, aan beide lange gevels van beide vleugels. Ze lopen tot circa 7 m uit de gevel af naar de laagbouw en eindigen onder de gevelkam.
  - Zuidwestvleugel: X −40,6 (zuidoost; AHN +70 op 1 m, +22 op 5 m) en X −45,5 (noordwest).
  - Noordvleugel: U 46 (AHN +60 aan de gevel, +41 op 2 m, +13 op 6,5 m).
  - De punten staan in het AHN niet boven de beren maar bij de kappen.
- **Stropdas**: de glazen trappenhal voor de westgevel van de kern.
  - Schacht van 9 m breed en 3 m uit de gevel.
  - Een "knoop" van 11 m breed vanaf +49,5 tot de top op +63,5 (AHN 63–65), met een V-insnijding. De onderkant van de knoop is onder 34° ingesnoerd naar de schacht.
  - Een kraag die vanaf +30 uitwaaiert tot 17 m breed en 8 m uit op het dak van de entreehal.

### Gevels

- **Ponsgevels**: verdiepingen van 3,6 m vanaf NAP 0,0. Dubbele vensters van 2,0 × 1,6 m op 3,3 m, als blinde nissen van 0,35 m.
  - Op beide lange gevels van beide vleugels, van de laagbouw tot 1,4 m onder het dak.
  - Op de gevels van de oostpartij.
  - Twee rijen op de noord- en oostgevel van de kern.
- **Glazen koppen**: de lange gevels tussen beer en kop en de schuine kopgevels zelf hebben per laag een glasband van 2,6 m (0,3 m diep). De banden op de koppen volgen het schuine profiel.
- **Stropdas**: per laag een glasband op de voorkant.

### Laagbouw

- **Onderbouw**: de BAG-contour tot +6,5 (daktuin aan de oostkant, 3D BAG 6,1–6,5). Rondom loopt een rand van 45° af tot +3,5 aan de gevel (3D BAG-vlakken van 2,8–5,7 onder 41–45°).
- **Westvleugel rond de zuidwestkop**: schilddak.
  - Nok op Y 20, van +17,3 (X −62) tot +17,0 (X −33).
  - Goten op +12,8 (3D BAG 659/643/654/713/672: 11,8–18,3 onder 18–25°).
- **Zuidoostvleugel langs de zuidwestvleugel**, met het glazen atrium bij de knik.
  - Lessenaarsdak van +17,3 aan de gevel naar +13,0 (17°).
  - Ervoor een lagere strook van +8,0 naar +7,0.
- **Bij de knik**: het lessenaarsdak draait mee met de noordvleugel, van +15,5 naar +12,4.
- **Noordoostblok** (zeshoek op de luchtfoto): +13,0 naar +10,0.
- **Westkant van de noordvleugel**: +11,5 naar +9,0.
- **Strook tussen de westvleugel en de entreehal**: +11,0 naar +10,0.
- **Glazen entreehal op de knik aan de westkant**: dak oplopend van +10 aan de buitenkant naar +18 tegen de toren.
- **Entreeluifel aan de rotonde**: koperen plaat van 10 × 7 m tot +6,3 op vier gemetselde pijlers van 1,2 m.

## Geschat en weggelaten

Geschat:

- **Verdiepingen en vensters**:
  - De verdiepingshoogte van 3,6 m komt uit de foto's: 15 vensterrijen tussen de laagbouw op +12 en het dak van de noordvleugel.
  - De vensterbreedte en steek komen uit de 13 vensters per laag op de westgevel van de noordvleugel (foto RCE 20365637).
  - Het werkelijke, per verdieping verspringende patroon en de kleurvlakken in het metselwerk zijn regelmatig gemaakt.
- **Steunberen**: de positie en uitloop komen uit het AHN. Het profiel is als vier punten vereenvoudigd. In het AHN staan de zuidoost- en de noordwestbeer van de zuidwestvleugel niet op dezelfde X (−40,6 en −45,5); dat is zo overgenomen.
- **Gevelkammen**: de hoogtes komen uit het AHN. De bolle vorm van de kappen en de 2,5 m dikte komen uit de foto's (Commons "Gasuniegebouw Groningen", "20090623 Gasuniegebouw Groningen NL", RCE 20365637).
- **Waarom het opzwaaien op foto's sterker lijkt**: op de foto's lijken de dakranden veel sterker op te zwaaien dan in het AHN. Dat komt grotendeels door het perspectief van dichtbij en van onderaf: de vensterrijen lopen op dezelfde foto's mee schuin. Het AHN legt de hoogtes vast. Op RCE 20365637 en "Gasuniegebouw Groningen" staat de dakrand bij de kop wel 1 tot 2 lagen hoger boven de bovenste vensterrij dan bij de kern; dat zit in de kammen.
- **Stropdas**: breedte, uitsteek, knoop en kraag komen uit de frontale foto RCE 20365637; alleen de top komt uit het AHN.
- **Entreehal**: het glas geeft geen AHN-punten. De dakhelling is geschat (3D BAG 709 tot 19,3).
- **Luifel**: plaats uit de luchtfoto, maat en vorm uit de foto "Gasunie Luifel".
- **Laagbouw**: de dakvlakken zijn regelmatig gemaakt uit AHN en 3D BAG. Het werkelijke dakenlandschap is grilliger, met waaiers van zinken vlakken en glasstroken rond de entreehal. De onderbouw is één niveau op +6,5.

Weggelaten:

- **Glasroeden van het atrium en de entreehal**, vensterkozijnen, de gevelonderhoudsinstallaties en antennes op de kern: kleiner dan 0,9 m.
- **De bomen van de daktuin**: vegetatie, geen gebouw.
- **De schuine stand van de lange gevels**: Wikipedia noemt "scheve muren". Op de foto's vanaf het Vrijheidsplein (6043) en "Gasunie, Groningen (2012)" lijkt de hoogbouw naar boven te versmallen. Dat komt door de uitlopende glazen koppen en de beren, die wel gemodelleerd zijn. In het AHN ligt 1 m buiten de dakrand van de lange gevels direct het dak van de laagbouw of het maaiveld (noordvleugel oost: +6 op 0,8 m buiten de dakrand; zuidwestvleugel zuidoost: +17 op 1 m). Een helling van meer dan circa 1° zou daar schuine gevelpunten geven, dus de lange gevels zijn verticaal gemaakt.

Afwijking van de backlog-hint: de "puntige gele kop" is geen aparte kop. Het zijn de glazen vleugelkoppen met de spitse punten en kappen van de gevelkammen; de gele kleur is het bovenste metselwerk.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 221.569 m³. De ondervlakken zijn de bovenkanten van de nissen en glasbanden en de onderkant van de luifel.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 382 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet en top;
  - de daken van kern, oostpartij en beide vleugels;
  - de profielen van beide glazen koppen;
  - de punten van de gevelkammen, het opzwaaien naar de kern, een kap van 2,5 m dik en de top van de stropdas;
  - nok en lessenaarsdak van de laagbouw en de schuine rand;
  - 15 vensterrijen.
- **Printcheck** op 1:1000 bij 45°: 0,06 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[232695,579925,232875,580095]`, 180 × 180 mm. Duur 2,6 s, 107 objecten, 241.432 driehoeken, vijf vellen, modelhoogte 90,3 mm. Het model staat op het terrein en de opvulling blijft beperkt tot de luifel en de nissen.
- **Renders** naast de 3D BAG op −35°, 55°, 145°, 235°, 300°, 120° en 10° en van bovenaf. Daarnaast perspectiefrenders vanaf het maaiveld uit de hoeken van "20080129 Gasuniegebouw Groningen NL" (305°, nachtfoto) en "Gasuniegebouw Groningen" (322°); daarin zwaaien de dakranden op naar de punten bij de koppen en naar de kern zoals op de foto's. De 3D BAG heeft de juiste massa's, maar vlakke wanden en een grote schuine reconstructiefout (een wand tot +105 m) dwars door de knik. De laagbouw is daar een lappendeken van kleine vlakken. Het model heeft per kant meer:
  - **Noordwest (−35°, 300°)**, de entreezijde:
    - de stropdas met knoop en kraag;
    - de ponsgevels van beide vleugels;
    - de schuine glazen koppen met banden;
    - de steunberen en de gevelkammen met kappen en punten;
    - de entreehal en de luifel.
  - **Noordoost (55°)**:
    - de noordkop die schuin uitloopt;
    - de oostgevel van de noordvleugel met vensters;
    - de kern met vensters boven de oostpartij;
    - het noordoostblok.
  - **Zuidoost (145°, 120°)**:
    - beide vleugels met vensterrijen;
    - beide glazen koppen;
    - de gevelkammen met punten en het opgezette stuk bij X −36;
    - het lessenaarsdak met atrium;
    - de lagere strook en de schuine rand.
  - **Zuidwest (235°)**:
    - de schuine glazen zuidwestkop met beide beren, kappen en punten;
    - het schilddak van de westvleugel.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/53.20108/6.55149/350/1x1/0)): het model ligt op de plek van de PDOK-reconstructie (met de schuine reconstructiefout door de knik, zichtbaar zolang de catalogus nog de oude stand had) en vervangt die; vensterrijen, kern, koppen en gevelkammen zijn zichtbaar en de laagbouw sluit op het terrein aan.

## Bronnen

- PDOK BAG `0014100010929941`, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026. Op de luchtfoto staat de toren door het perspectief circa 0,43 m per meter hoogte naar het noorden verschoven. Plaats en vorm komen daarom uit het AHN.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010929941), CC BY 4.0: dakhoogtes van kern, vleugels en oostpartij en de dakvlakken van de laagbouw.
- [Wikipedia: Gasuniegebouw](https://nl.wikipedia.org/wiki/Gasuniegebouw): Alberts en Van Huut, 1994, organische architectuur, 18 verdiepingen, trappenkolom achter een scheve glazen gevel.
- Commons, alleen als visuele referentie:
  - [Overzicht voorgevel – RCE 20365637](https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_-_Groningen_-_20365637_-_RCE.jpg) (westgevel frontaal)
  - [Overzicht voorgevel – RCE 20365462](https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_-_Groningen_-_20365462_-_RCE.jpg)
  - [Gasuniegebouw Groningen](https://commons.wikimedia.org/wiki/File:Gasuniegebouw_Groningen.jpg) (noordwest)
  - [Gasuniegebouw](https://commons.wikimedia.org/wiki/File:Gasuniegebouw.jpg) (westzuidwest, zuidwestkop)
  - [20090623 Gasuniegebouw Groningen NL](https://commons.wikimedia.org/wiki/File:20090623_Gasuniegebouw_Groningen_NL.jpg)
  - [6043 Gasunie Rotonde Vrijheidsplein](https://commons.wikimedia.org/wiki/File:6043_Gasunie.Rotonde.VrijheidsPlein.Aanpak.Zuidring.Ring.Zuid.Plan.west.jpg) (zuidoost)
  - [Gasunie, Groningen (2012)](https://commons.wikimedia.org/wiki/File:Gasunie,_Groningen_(2012).jpg)
  - [Gasunie Luifel](https://commons.wikimedia.org/wiki/File:Gasunie_Luifel.jpg)
  - [20080129 Gasuniegebouw Groningen NL](https://commons.wikimedia.org/wiki/File:20080129_Gasuniegebouw_Groningen_NL.jpg) (nachtfoto vanaf het noordwesten)
