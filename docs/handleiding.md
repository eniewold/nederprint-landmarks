# Een landmarkmodel maken

Stappenplan en technische afspraken voor één nieuw model, geschreven zodat een
AI-assistent (Claude Code, Codex, Cursor en dergelijke) het van begin tot eind
kan volgen. Het resultaat is een generatorscript `scripts/generate-<slug>.mjs`
dat met manifold-3d een gesloten model bouwt en de map `models/<slug>/`
schrijft met een GLB, een catalogus-JSON, een STL om te printen en een README
met de beschrijving en de bronnen.

Het Nationaal Monument op de Dam
([`scripts/generate-dam-monument.mjs`](../scripts/generate-dam-monument.mjs)) is
het referentievoorbeeld. Andere voorbeelden per soort bouwwerk:

| Soort | Voorbeeldscripts |
| --- | --- |
| Toren | `generate-domtoren.mjs`, `generate-martinitoren.mjs` |
| Kerk | `generate-cunerakerk.mjs`, `generate-grote-kerk-den-haag.mjs` |
| Kasteel, paleis | `generate-muiderslot.mjs`, `generate-slot-loevestein.mjs`, `generate-koninklijk-paleis-amsterdam.mjs` |
| Brug | `generate-merwedebrug-papendrecht.mjs` (rijbaan en fietspad met BGT-attributen) |
| Station, hal | `generate-amsterdam-centraal.mjs` (perronkappen als geëxtrudeerd profiel) |
| Molen | `generate-molen-de-valk.mjs` |
| Pretparkattractie | `generate-efteling-*.mjs` met de bouwstenen uit `efteling-kit.mjs` |

## Startprompt

Vul het bouwwerk en de plaats in, en eventueel eigen bronnen of foto's:

```text
Maak een vereenvoudigd 3D-landmarkmodel van <bouwwerk> in <plaats>.
Volg docs/handleiding.md en docs/catalogus-formaat.md. Zoek zelf de plattegrond
via PDOK (Locatieserver, BAG, BGT, luchtfoto), de hoogtes via het AHN en de
opstand via schuine foto's (Wikimedia Commons). Bouw het model uit vlakken en
bouwdelen met manifold-3d in scripts/generate-<slug>.mjs, naar het voorbeeld van
scripts/generate-dam-monument.mjs, en schrijf models/<slug>/ met een GLB
(meters, Y omhoog, nodes `klasse:label`), een catalogus-JSON met RD-oorsprong
en xAxis, en een STL om te printen. Detailniveau: herkenbaar en printbaar op
1:1000 zonder steunconstructie. Controleer volgens §4 van de handleiding
en schrijf models/<slug>/README.md met maten, aannames, controle en bronnen.
```

## 1. Onderzoek

Alle diensten hieronder zijn open en hebben geen sleutel nodig. Coördinaten zijn
RD (EPSG:28992) in meters.

- **Positie**: de PDOK Locatieserver geeft een RD-punt bij een adres of straat:
  `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=<zoekterm>&fl=centroide_rd`.
- **Contouren**: de BGT OGC API geeft exacte vlakken, bijvoorbeeld
  `https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items?bbox=x1,y1,x2,y2&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/28992&crs=http://www.opengis.net/def/crs/EPSG/0/28992&f=json`.
  Nuttige collecties: `pand`, `wegdeel`, `onbegroeidterreindeel`,
  `overigbouwwerk`, `kunstwerkdeel_vlak` en `straatmeubilair` (type
  `herdenkingsmonument`). Fit cirkels of lijnen op die polygonen voor stralen
  en hoofdassen.
- **Panden**: de BAG-WFS geeft de pandcontour en de pand-id (veld
  `identificatie`):
  `https://service.pdok.nl/lv/bag/wfs/v2_0?service=WFS&version=2.0.0&request=GetFeature&typeNames=bag:pand&outputFormat=application/json&srsName=EPSG:28992&bbox=x1,y1,x2,y2,EPSG:28992`.
- **Luchtfoto**: PDOK-luchtfoto als WMS in RD, 8 cm per pixel:
  `https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=Actueel_orthoHR&CRS=EPSG:28992&BBOX=x1,y1,x2,y2&WIDTH=1250&HEIGHT=1250&FORMAT=image/png`.
  Meet afstanden in pixels maal de resolutie.
- **Hoogtes**: het AHN via WCS,
  `https://service.pdok.nl/rws/ahn/wcs/v1_0` met `COVERAGE=dsm_05m` (oppervlak,
  inclusief daken) of `dtm_05m` (maaiveld) en `FORMAT=GEOTIFF`; nodata is
  3,4e38. Hoogtes zijn NAP.
- **Dakvlakken**: de 3D BAG (LoD2.2) geeft per pand de dakvlakken als
  CityJSON: `https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.<id>`
  (`metadata.transform` voor de coördinaten, per vlak de semantiek
  `RoofSurface`). Handig waar het AHN gaten heeft (zie §2).
- **Opstand en maten**: Wikipedia, het Rijksmonumentenregister
  (`monumentenregister.cultureelerfgoed.nl/monumenten/<nummer>`) en foto's van
  Wikimedia Commons (`Special:FilePath/<bestand>&width=1400`). Leg vast welke
  maten uit bronnen komen en welke uit foto's zijn geschat.
- **Schuine foto's van alle kanten**, niet alleen de luchtfoto: een model wordt
  beoordeeld in een schuine 3D-weergave. Haal die beelden op voordat je bouwt;
  wat het AHN en de luchtfoto missen, staat in
  [Wat het AHN niet laat zien](#wat-het-ahn-niet-laat-zien).
- **Oriëntatie**: bepaal de hoofdas in RD uit nokken, goten of gevels (niet uit
  de kleinste omhullende rechthoek van de BAG-contour) en leid daaruit `xAxis`
  af. De lokale +Y-as staat 90 graden linksom op de X-as.
- **Vervangen panden**: is het bouwwerk een BAG-pand (een toren, een gebouw),
  dan staat er in de 3D-kaart al een automatisch PDOK-blokmodel dat anders door
  het nieuwe model heen steekt. Zet de pand-id als `NL.IMBAG.Pand.<id>` in
  `replacesBuildings`. Bij een complex liggen vaak meer panden onder het model
  (bij Amsterdam Centraal acht, waaronder tunnels): neem elk pand op waarvan de
  contour vrijwel helemaal binnen de voetafdruk van het model valt. Een beeld
  of brug die geen BAG-pand is, heeft dit niet nodig.
- **Lange, gelijkvormige daken** (perronkappen, hallen): meet het dwarsprofiel
  in het AHN-DSM in een stelsel langs de hoofdas (90e percentiel per meter over
  een lang stuk, zodat gaten door glas wegvallen), controleer per blok van 20 m
  dat het profiel constant is en extrudeer het langs de as.
- **Torens en koepels uit de AHN-omhullende**: kantel het DSM in een stelsel
  langs de hoofdas (de hoek waarbij de omhullende boven de schouderhoogte het
  kleinst is) en lees per hoogte het 1e en 99e percentiel van beide assen af.
  Print bij nodata-stroken het raster zelf in plaats van alleen percentielen.
  Vertrouw de omhullende voor het silhouet en de BGT voor doorgangen; sluit een
  zijde uit waar een aangebouwde kerk het DSM vervuilt. Meet
  breedteverhoudingen alleen op frontale foto's: schuine foto's laten gevels tot
  25 % te smal lijken. Deze methode is alleen voor silhouetten van torens en
  koepels en voor platte blokken, nooit voor hellende daken (zie §2).
- Neem geen geometrie of maten over uit bronnen zonder open licentie (Google,
  Mapbox, modelplatforms). Kijken mag, overnemen niet.

## 2. Modelleren

- Bouw in meters op ware grootte met `manifold-3d`: primitieven, `extrude`,
  `revolve`, `hull`, `union`, `subtract` en `trimByPlane`. Alleen gesloten
  geometrie; controleer `status()` op `NoError`.
- Oorsprong op een herkenbaar hart op maaiveldniveau, Z omhoog. Leg de
  oriëntatie vast in de JSON (`xAxis`) en beschrijf haar in `description`.
- Verdeel het model in onderdelen per materiaalklasse: `building` voor het
  bouwwerk, `road` voor bestrating, treden en wegdek, en waar nodig `water`,
  `terrain` of `vegetation`. Elk onderdeel wordt één node `klasse:label` in de
  GLB en moet op zichzelf gesloten zijn.
- De bouwstenen in [`scripts/efteling-kit.mjs`](../scripts/efteling-kit.mjs)
  (`prism`, `box`, `gableRoof`, `hipRoof`, `spire`, `dome`, `toGlb`, `toStl`,
  `writeLandmark`) zijn ook buiten de Efteling-modellen bruikbaar.

### Printbaar op 1:1000

Stadskaarten worden op 1:1000 of grover geprint, en dan is 1 m op ware grootte
1 mm in de print. Ontwerp daarom:

- dragende en vrijstaande delen van minstens 0,9 m dik;
- geen overhang steiler dan 45 graden zonder ondersteuning: kragen onder
  uitkragingen, spitse tops van minstens 50 graden in openingen, of een
  opening als blinde nis van 0,3 tot 0,4 m diep;
- horizontale overspanningen dicht: een open boog onder een plat dek, een
  leuning of een balk van een halve meter wordt bij het printen een dichte
  wand met strepen;
- tussenruimtes (kantelen, travees) van minstens 0,9 m.

De export van NederPrint vult overhang onder een gesloten onderdeel automatisch
op tot 45 graden, maar alleen als elke node gesloten is. Een doorgang of boog
waarvan het plafond steiler loopt dan 45 graden blijft open; onder een vlak
plafond groeit een wig naar binnen. Ontwerp toch zo dat er zo weinig mogelijk
op te vullen valt.

### Modelopbouw: vlakken, geen lagen

Een model bestaat uit vlakken en benoemde bouwdelen: planvergelijkingen,
prisma's, omwentelingsvormen en polygonen, met de maten als constanten. Dit is
het belangrijkste kwaliteitscriterium; modellen uit gestapelde hoogtelagen
worden afgewezen als "lego-blokjes".

**Niet doen voor daken en wanden:**

- Het DSM per meter hoogte in plakken snijden en stapelen (hoogtegebieden, een
  pixelraster). Een dakhelling wordt dan een trap van treden van 1 m, een spits
  een stapel schijven, een schilddak van 22 graden over 7 m twee treden en een
  glazen dak een vlak blok. Zo'n trap volgt het DSM wel binnen 1 m, dus een
  hoge overeenkomst met het AHN zegt niets over herkenbaarheid.
- Nok-, goot- of frontonhoogtes afronden op hele of halve meters.
- De kleinste omhullende rechthoek van de BAG-contour als hoofdas nemen. Meet
  de richting van nokken en goten: bij Sint Bavo in Haarlem scheelde dat 13
  graden.

**Wel doen:**

1. **Bouw in een eigen gebouwstelsel** waarin gevels, goten en nokken
   evenwijdig of haaks lopen, en draai pas aan het eind naar het modelstelsel.
   Dan zijn nokken recht, travees gelijk en is het geheel symmetrisch waar het
   gebouw symmetrisch is.
2. **Dakvlak = planvergelijking** z = a u + b v + c boven een polygoon (u, v):
   ```js
   const roofPlane = (poly, a, b, c) => {
     const n = Math.hypot(a, b, 1);
     return prism(poly, BASE, 120).trimByPlane([a / n, b / n, -1 / n], -c / n);
   };
   ```
   Zadeldak: twee spiegelvlakken tot de nok. Schilddak: vier vlakken. Kilgoot:
   twee dwarsdaken die elkaar doorsnijden (`union`). Kegel of spits:
   `Manifold.hull` van de veelhoek op de goot en het topje, met het werkelijke
   aantal zijden. Torens, koepels en apsissen: `Manifold.revolve` van een
   radiaal profiel.
3. **Gaten in het DSM** (steile, donkere, glazen of leien daken): nokken en
   goten zijn wel meetbaar. Interpoleer daartussen lineair, of haal de
   dakvlakken uit de 3D BAG. Controleer die tegen het AHN waar dat wel ziet,
   want de 3D BAG kan een boomkruin of aanbouw verkeerd hebben.
4. **Regelmaat boven ruis**: gelijke helling per beuk, gelijke travee-afstand,
   spiegelsymmetrie. Een automatische vlaksegmentatie van het DSM is analyse,
   geen model: lees er planvergelijkingen uit en bouw de regelmatige versie met
   de hand.
5. **Platte daken en installatieblokken** mogen wel als blokken op een hoogte.
   Het verbod geldt alleen voor hellende en gebogen vlakken.

### Wat het AHN niet laat zien

Het AHN is een goede maat voor hoogtes en nokken, maar mist veel details. Zoek
ze op foto's, haal ze uit de 3D BAG of meet ze in het DSM per 0,25 m:

- **Steile leien of zinken daken en glas**: gaten in het DSM. Nokken en goten
  zijn meetbaar, de vlakken ertussen niet.
- **Dakramen, dakkapellen en schoorstenen**: op 0,5 m verdwijnen ze, op 0,25 m
  staan ze er als regelmatige verhogingen.
- **Luifels, kroonlijsten en overstekken**: dunne platen. Meet de bovenkant in
  het AHN en lees de dikte (minimaal 1,5 m op ware grootte) en de uitkraging
  van foto's.
- **Wat onder een dak zit**: tribunes onder stadiondaken, kooromgangen, glas
  boven een binnenhof. Het DSM ziet alleen het dak; een stadiondak is geen
  massieve kolom tot het maaiveld.
- **Nieuwer dan het AHN** (opname circa 2020 tot 2022): vergelijk het DSM altijd
  met de nieuwste luchtfoto en recente foto's.
- **Scheefstand van de luchtfoto**: hoge objecten staan er ongeveer 0,17 m per
  meter hoogte te ver naar het noorden. Plaats uit het AHN, vorm uit foto's.

### Detailniveau

"Herkenbaar op 1:1000" betekent meer dan een silhouet: de 3D-kaart belicht elk
vlak apart, dus elk geprint detail is ook te zien. Modellen met alleen massa en
hoofddaken zijn te eenvoudig. Neem vanaf de eerste versie mee:

- **Daken per vleugel**, niet één profiel per gebouwdeel: zadeldaken met
  kilgoten, schilden, topgevels of trapgevels (treden ≥ 0,9 m), knikken in
  torendaken, dakkapellen en schoorstenen (≥ 0,9 m).
- **Spitsen met het echte aantal vlakken**: een ronde toren heeft vaak een
  achtkante spits. Tel de graten op foto en luchtfoto; gebruik geen gladde kegel
  waar het dak hoekig is.
- **Gevelreliëf**: vensters en schietgaten als blinde nissen van 0,3 tot
  0,4 m, pilasters, lisenen en risalieten van 0,3 tot 0,5 m, lijsten en
  borstweringen als schuine kraag (45 tot 53 graden), een plint.
- **De toegang**: poortgebouw, poortboog (spits ≥ 50 graden of als nis), brug
  met borstweringen. Daar kijkt iedereen als eerste naar.
- **Kantelen en weergangen** bij kastelen: blokken van ≥ 0,9 m breed en hoog
  met tussenruimtes ≥ 0,9 m. Grover dan in het echt mag, vrije overhang niet.
- **Het hele gebouw**, niet alleen het hoofdvolume: aanbouwen, lagere vleugels,
  torentjes, de ingang met luifel of portaal, en bij een complex van kleine
  panden elk pand met een eigen hoogte en dakvorm.

Spreken een aanwijzing in de opdracht en de metingen elkaar tegen, volg dan de
metingen en meld het.

### Veelgemaakte fouten

| Fout | Gevolg | Zo wel |
| --- | --- | --- |
| DSM per meter gestapeld | trappen in plaats van dakvlakken | planvergelijkingen per dakvlak |
| Stadiondak als massief blok tot het maaiveld | tribunes ontbreken, geen onderhang | dak als plaat, tribunes eronder van foto's |
| Tonvormige daken en installaties als vlak blok | minder detail dan de automatische PDOK-reconstructie | bolle en holle vormen met `revolve` of `hull`, installaties als blokken |
| Raster van 0,5 m voor dakramen | dakramen verdwijnen | DSM op 0,25 m of foto's |
| Schilddak in stappen van 1,5 m | twee treden, luifel valt weg | vier dakvlakken, luifel als plaat |
| "Staat niet in het AHN" als reden om weg te laten | dakkapellen en aanbouwen ontbreken | wat op de foto ≥ 0,9 m is, komt erin |
| Dakvorm of ontwerper uit de opdracht overgenomen | verkeerde vorm | controleer tegen register en foto's |

### Bruggen: wegdek met BGT-attributen

Bij een brug is elk wegdeel op het dek (rijbaan, fietspad, voetpad, spoor) een
eigen node van klasse `road` met de BGT-attributen, zodat de kleurregels van de
3D-kaart (fietspaden rood, spoor zwart) ook op de brug werken. Voorbeeld:
[`scripts/generate-merwedebrug-papendrecht.mjs`](../scripts/generate-merwedebrug-papendrecht.mjs).

1. **Haal de BGT-wegdelen op het dek op** (`collections/wegdeel/items`, zie §1).
   Neem alleen actuele versies (zonder `eind_registratie`) met
   `relatieve_hoogteligging` ≥ 1 (op de brug, niet eronder). Zet de contouren
   om naar het lokale stelsel, vereenvoudig ze tot circa 5 cm en zet ze met
   hun `lokaal_id` als constanten in het script.
2. **Eén node per functie**: `road:rijbaan`, `road:fietspad`, `road:voetpad`,
   `road:spoor`. Elke node krijgt in de GLB `extras.attributes` met de
   BGT-waarden: `functie` als `bgt_functie`, `fysiek_voorkomen` als
   `bgt_fysiekvoorkomen` en, als de BGT hem vult, `plus_fysiek_voorkomen` als
   `plus_fysiekvoorkomen`. Gangbare waarden: `rijbaan regionale weg`,
   `rijbaan autoweg`, `rijbaan lokale weg`, `fietspad`, `voetpad`,
   `spoorbaan`; `gesloten verharding`, `open verharding`; `asfalt`. In de
   GLB-schrijver: `nodes.push({ name, mesh, extras: { attributes } })`. Heeft
   het dek geen BGT-wegdeel (komt voor bij spoorbruggen), neem dan de functie
   van het wegdeel op de aansluitende landhoofden en vermeld dat.
3. **Het wegdek is een laag van 0,5 m bovenop de constructie**, geen tweede
   volume in of op het dek. Bouw per dekdeel een snijstrook over hetzelfde
   wegprofiel als het dek, van 0,5 m onder tot 1 m boven het wegdek:
   - fietspad, voetpad of spoor = strook ∩ prisma's van de BGT-contouren;
     rijbaan = de rest van de strook tussen de schampkanten;
   - trek uit de strook alles wat boven het dek uitsteekt en constructie
     blijft (schampkanten, boogribben met hun hangerscherm, portalen,
     torens), met 2 cm speling;
   - wegdeel = strook ∩ brug; constructie = brug − strook.

   Zo liggen er nooit twee bovenvlakken van verschillende onderdelen op
   dezelfde hoogte; dat geeft in de 3D-kaart flikkering (z-fighting).
4. **Controleer**: de volumes van de onderdelen tellen op tot het volume van de
   brug als geheel (geen overlap), en nergens liggen twee bovenvlakken van
   verschillende onderdelen binnen 1 cm van elkaar. Schiet daarvoor verticale
   stralen over het hele dek en vergelijk per punt de treffers van alle nodes.
   Ook een boven- en ondervlak van hetzelfde wegdeel op dezelfde hoogte (een
   vlak zonder dikte) is fout.
5. **Verberg het PDOK-brugdek**: PDOK legt het BGT-overbruggingsdeel van het
   dek plat op het water of de uiterwaard. Draai na het genereren
   `node scripts/replaces-terrain.mjs <slug> --write`: dat zet de
   `lokaal_id`'s van de overbruggingsdelen met `relatieve_hoogteligging` ≥ 1
   die voor minstens 90 % onder het model liggen in `replacesTerrain` (JSON
   én generator), zodat kaart en export ze verbergen. Het maaiveld eronder
   (water, terrein, pijlervoeten op hoogteligging 0) blijft staan. Meldt het
   script een deel dat maar half onder het model ligt, laat het model dan tot
   het einde van dat dek doorlopen of laat het deel staan.

Een brug zonder leuningen maar met schampkanten is printbaar; onder een zwevend
dek hoort de steun een doorlopende wand te worden, geen kam van losse lamellen.

## 3. Bestanden schrijven

Elk model krijgt een eigen map `models/<slug>/`. Het generatorscript schrijft
daar naartoe met

```js
const outDir = path.join(
  path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))),
  "<slug>",
);
```

`--out` wijst de catalogusmap aan (relatief aan de huidige map); zonder `--out`
vindt het script `models/` vanuit zijn eigen locatie.

Vaste invoer (BGT- en BAG-contouren, hoogtes uit het AHN, een PDOK-mesh) staat
als constante in het script zelf, niet in een los databestand, en niets wordt
tijdens het genereren van internet gehaald. Een grote tabel komt in een functie
onderaan het script (zie `arnhemData()` in `generate-arnhem-centraal.mjs`).
Vermeld bij data onder een licentie met naamsvermelding (zoals CC BY) de bron
en licentie in het commentaar erboven.

| Bestand | Inhoud |
| --- | --- |
| `<slug>.glb` | glTF 2.0 in meters, Y omhoog (van Z omhoog: `(x, y, z) -> (x, z, -y)`), één node per onderdeel met naam `klasse:label`, posities plus normalen (`calculateNormals(0, 40)` in manifold), uint32-indices, `min`/`max` op de positie-accessor |
| `<slug>.json` | Catalogusitem, zie [het catalogusformaat](catalogus-formaat.md) |
| `<slug>-1-<schaal>.stl` | Binaire STL in millimeters, Z omhoog, om los te printen: 1:100 voor kleine monumenten, 1:1000 voor gebouwen groter dan circa 20 m, grover voor lange bruggen |
| `<slug>-grondplaat-1-<schaal>.stl` | Optioneel: idem met een grondplaat als losse delen anders niet verbonden zijn |
| `README.md` | Beschrijving, maten, controle en bronnen; met de hand geschreven, zie §4 |

`toGlb` en `toStl` in `efteling-kit.mjs` of `generate-dam-monument.mjs` doen dit
al; kopieer ze in plaats van een eigen schrijver te maken.

Aandachtspunten voor de JSON (volledig formaat in
[catalogus-formaat.md](catalogus-formaat.md)):

- `description` beschrijft in één alinea de oorsprong, de oriëntatie, de
  onderdelen en wat is weggelaten; `realWorld` bevat de gebruikte hoofdmaten en
  `sources` de bronnen, inclusief gebruikte foto's met auteur en licentie.
- `groundOffsetMetres` laat het model iets in het maaiveld zakken zodat de
  onderkant aansluit; -0,3 werkt meestal goed. Een model op een plateau dat al
  in het terrein zit, kan beter op 0 staan.
- `groundSamplePoints` (punten in modelcoördinaten) laat de plaatsing het
  maaiveld op precies die punten bemonsteren in plaats van rond de voetafdruk.
  Nodig voor een bouwwerk op een eigen heuvel of kade (zie Valkuilen).
- `groundHeight` is een vaste terugvalhoogte als er geen maaiveld te
  bemonsteren is, bijvoorbeeld boven water. Let op: de PDOK-terreinhoogtes in
  de 3D-kaart zijn ellipsoïdisch (circa NAP + 43 m), niet NAP.

## 4. Controleren

1. **Genereren**: `node scripts/generate-<slug>.mjs` schrijft alle bestanden en
   print per onderdeel status, genus, driehoeken en afmetingen. Elke node moet
   `NoError` geven; een negatief genus betekent dat een onderdeel uit losse
   stukken bestaat.
2. **Reproduceerbaar**: draai het script nog een keer; `git status` mag daarna
   geen verschillen in `models/<slug>/` tonen.
3. **Vier kanten**: render de GLB schuin vanuit vier richtingen (bijvoorbeeld
   azimut -35, 55, 145 en 235 graden, elevatie 30 graden), met three.js, Blender
   of een andere glTF-viewer, en zet elke render naast een foto vanuit dezelfde
   hoek en naast de automatische PDOK-reconstructie (de 3D BAG-viewer op
   3dbag.nl). Het model moet aan elke kant méér laten zien dan PDOK. Let op:
   three.js haalt de dubbele punt uit nodenamen; dat is alleen weergave.
4. **Elk zichtbaar onderdeel van ≥ 0,9 m** op de luchtfoto en op schuine foto's
   staat in het model, of staat in `models/<slug>/README.md` onder
   "weggelaten" met een reden.
   "Kleiner dan 0,9 m" is een reden, "staat niet in het AHN" niet.
5. **Plaatsing**: zet de voetafdruk van het model met `origin` en `xAxis` om
   naar RD en leg hem over de BAG-contour en de luchtfoto. Gevels en hoeken
   moeten binnen enkele decimeters samenvallen.
6. **Printbaar**: open de STL in een slicer op de schaal van het bestand en
   controleer dat er geen steunmateriaal nodig is en dat geen wand dunner is
   dan 0,9 mm op 1:1000. Snijd niets onder de vlakke onderkant uit.
7. **Bruggen**: de controles uit
   [Bruggen: wegdek met BGT-attributen](#bruggen-wegdek-met-bgt-attributen).
8. **README**: schrijf `models/<slug>/README.md` naar het voorbeeld van
   [`models/nationaal-monument-dam/README.md`](../models/nationaal-monument-dam/README.md):
   een kop `# Naam (Plaats)`, de bestanden, oorsprong en oriëntatie, de
   onderdelen, wat geschat en wat weggelaten is, de controle en de bronnen.

Controlebeelden (renders, vergelijkingen met foto's) horen in je eigen
werkmap, niet in de repo. Foto's van Wikimedia Commons hebben een eigen
licentie (meestal CC BY-SA) en mogen niet mee in de repo; vermeld ze alleen in
`sources`.

## Valkuilen

- Manifold `revolve` draait rond de Y-as van het profiel en zet die als Z;
  `extrude` met `scaleTop` maakt conische vormen; `hull` van bollen geeft
  gladde rompen. Geef `scaleTop` als paar `[s, s]`: een enkel getal schaalt in
  deze versie van manifold-3d alleen X.
- Bij plaatsing komt z = 0 op de laagste maaiveldhoogte rond de voetafdruk.
  Houd de onderkant van het model vlak, en laat niets onder die onderkant
  uitsteken (bijvoorbeeld diep doorlopende trapblokken): de STL met grondplaat
  krijgt anders een bobbel aan de onderkant.
- Hoe groter de voetafdruk, hoe groter de kans dat de laagste maaiveldhoogte
  een gracht, kade of lagere straat is. Een model op een eigen heuvel of kade
  zakt dan weg in het terrein. Gebruik `groundSamplePoints` op het niveau waar
  het bouwwerk werkelijk staat.
- Zet geen talud, plateau of kade in de GLB die het terrein dubbelt, ook niet
  iets verlaagd: het PDOK-terrein in de kaart is grover dan het AHN en het
  meegemodelleerde deel steekt er dan plaatselijk als losse rand doorheen. Zo'n
  heuvel hoort alleen in een losse STL om zelf te printen.
- Onderdelen die een helling volgen (trappen, paden, sokkels op een talud)
  moeten circa 0,5 tot 1 m boven het gemeten AHN-maaiveld liggen en enkele
  meters doorlopen naar beneden, anders prikt het terrein er plaatselijk
  doorheen of zweven ze. Meet het profiel langs de eigen lijn van zo'n
  onderdeel (`dtm_05m`), niet alleen rond het hart.
- Steekt de automatische PDOK-reconstructie van een buurpand ver boven het AHN
  uit (omdat ze punten van het monument heeft meegenomen), neem dat pand dan op
  in `replacesBuildings` en modelleer het als eenvoudig blok op de AHN-hoogte.
- De GLB is de bron voor de 3D-kaart; slicers lezen alleen de STL. Wijzig
  nooit alleen de STL: pas het script aan en genereer opnieuw.
