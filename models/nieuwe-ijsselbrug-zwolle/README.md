# Nieuwe IJsselbrug (Zwolle)

Vereenvoudigde betonnen A28-brug tussen Hattem en Zwolle. Het volledige actuele BGT-dek en beide landhoofden zijn opgenomen. Het model bestaat uit doorlopende dekvlakken, twee kokerlofts met verdiepingen boven de rivierpijlers en afzonderlijke steunpunten, zonder gestapelde AHN-hoogtelagen.

## Bestanden en regenereren

- `nieuwe-ijsselbrug-zwolle.glb`: meters, glTF met Y omhoog; twee BGT-autosnelwegdelen, dekranden en constructie als vier afzonderlijke nodes.
- `nieuwe-ijsselbrug-zwolle.json`: RD-plaatsing, watermonsters, vervangen dek-id, maten en bronnen.
- `nieuwe-ijsselbrug-zwolle-1-1000.stl`: millimeters, Z omhoog, circa 662,9 × 36,5 × 15,4 mm; geïntegreerde printvoet, geen afzonderlijke slicersteun nodig.

```sh
node scripts/generate-nieuwe-ijsselbrug-zwolle.mjs
node scripts/generate-nieuwe-ijsselbrug-zwolle.mjs --out /absolute/lege/controlemap --scale 1000
```

De generator bevat de broncontouren en maten en werkt zonder netwerk. `--out` is de modelmap zelf.

## Oorsprong, richting en hoogte

RD-oorsprong `[200268.2018913043, 501530.4764130435]`; +X naar Zwolle, `xAxis = [0.7557147313794453, 0.6549009427204185]`, +Y links daarvan naar het noordwesten. Z = 0 ligt op de waterspiegel. PDOK-watervertices naast de rivieroverspanning liggen overwegend rond 44,1012 m ellipsoïdisch; vier catalogusmonsters liggen naast het dek. De NAP-basis +1,35 m is geschat uit die PDOK-hoogte en de plaatselijke vergelijking tussen AHN en PDOK-wegen. De nabijgelegen bestaande IJsselbrug gebruikt NAP +1,3 m. De modelplaatsing blijft door de werkelijke PDOK-watermonsters bepaald.

## Onderdelen

Het BGT-dek heeft een plaat van 1,3 m. Twee kokerlofts hebben schuine flanken, een breedte van circa 16,85 m per koker en een diepte van 2,2 m in het veld tot 6,5 m boven de rivierpijlers. De verdieping loopt continu volgens een kwadratisch profiel. Landhoofden en de westelijke rivierpijler volgen de BGT-voetafdruk. De overige pijlers zijn als gesloten dwarse blokken gemodelleerd, met hun onderkant op Z = 0 zodat ze op de oevers in het bestaande terrein verankerd zijn.

De bovenste 0,5 m van het dek is afzonderlijk verdeeld over de twee BGT-wegdelen en de resterende dekranden. Alle drie hebben `bgt_functie = rijbaan autosnelweg` en `bgt_fysiekvoorkomen = gesloten verharding`; de bron specificeert geen `plus_fysiekvoorkomen`. Contouren zijn binnen 0,02 m vereenvoudigd om collineaire snijslivers te verwijderen. De constructie bevat geen coplanair bovenste wegvlak. De volumepartitie wijkt circa 1,1 × 10⁻⁸ m³ af van het geheel. `replacesTerrain` bevat het gemeten dek `L0002.b1b0e31a2cb546b09159ee675288a729`.

De losse STL heeft twee doorlopende wanden van minstens 1 mm en schouders van 43°. Waar de lage kokeronderrand onvoldoende hoogte voor een schouder biedt, verbreedt de voet. De smalle middennaad wordt gesloten. Deze printvoet ontbreekt in de GLB; de webshop maakt zijn eigen overhangopvulling aan de constructienode.

## Gemeten, geschat en weggelaten

Gemeten: volledige BGT-dekcontour, beide landhoofden, de westelijke rivierpijler op lokale x ≈ −38,48 m, de hoofdas, de verkeersfuncties en het AHN-dekprofiel. Het dek stijgt van circa NAP +13,8 m naar +16,8 m, heeft een lichte doorbuiging boven de hoofdoverspanning en daalt naar +14,8 m. Het profiel volgt medianen van dwarsmetingen op de verkeersbanen, zonder auto's en leuningen als dekhoogte te gebruiken.

Geschat uit de twee schuine foto's en de luchtfoto: de tegenoverliggende rivierpijler op x ≈ +111,5 m, de overige pijlers op x ≈ −275, −220, −165, −110, +166,5, +221,5 en +276,5 m; plaatdikte, kokerbreedten, schuine flanken, kokerdiepten en pijlerdikten. Dit zijn vereenvoudigde buitenvormen, geen constructietekeningen. Het waterspiegelniveau in NAP is eveneens geschat. De BGT-buitencontour inclusief landhoofden is circa 663 m lang; de gepubliceerde totale bruglengte is 675 m.

Dunne leuningen, geluidsschermen, lichtmasten, verkeersportalen, dilataties en interne kokercellen zijn weggelaten voor 1:1000. Omliggende taluds en toegangswegen blijven onderdeel van PDOK.

## Controle

Alle vier GLB-nodes en de STL hebben Manifold-status `NoError`. De STL is één verbonden deel met vlakke onderkant; de resterende numerieke overhangsnijslivers zijn minder dan 0,000002 mm breed. Vier schuine renders zijn naast dezelfde PDOK-richtingen en de bronfoto's bekeken. Vanuit elke richting voegt het model het verhoogde dek, de kokeronderranden en de rivier- en aanbrugpijlers toe aan de vlakke PDOK-brugreconstructie.

De test in `tests/landmark-models.test.ts` controleert volledige lengte, RD-plaatsing en verticale ray-hits op beide autosnelwegdelen bij vier AHN-meetstations: de constructie eindigt daar minstens 0,49 m onder het verkeersvlak. De vaste model- en API-suites: 343 tests geslaagd. Een tijdelijke Vitest heeft `createModelBundle` op 1:1000 uitgevoerd voor de volledige RD-uitsnede `[199870,501131]`–`[200670,501931]`; de vier matrixtegels van 300 mm omvatten het volledige model. De preview is bekeken. `shareModelSupport` en `supportedSolid` slagen; de wegdelen krijgen geen voetsteun, en doorsneden tussen de rivierpijlers vormen één of twee doorlopende wanden van minstens 0,8 mm. Controlebestanden staan buiten de repo.

[Kaartcontrole](http://localhost:3000/kaart/52.49960/6.05384/1200/1x1/0): controleer vooral de geschatte aanbrugpijlers, de tegenoverliggende rivierpijler en de kokerverdiepingen. Voor de browsercontrole is dezelfde lokale server ook via `127.0.0.1` geopend om de eerder gecachete catalogus te vernieuwen.

## Bronnen

- [Wikipedia: Nieuwe IJsselbrug (Zwolle)](https://nl.wikipedia.org/wiki/Nieuwe_IJsselbrug_(Zwolle)): brugtype en gepubliceerde lengte.
- [PDOK BGT](https://api.pdok.nl/lv/bgt/ogc/v1/collections): actuele `overbruggingsdeel` en `wegdeel`, 10 oktober 2026, EPSG:28992.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m, dekprofiel.
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): actuele ortho, plattegrond en oevers.
- [Nieuwe IJsselbrug.jpg](https://commons.wikimedia.org/wiki/File:Nieuwe_IJsselbrug.jpg), Apdency, CC0: hoofdoverspanning, kokeronderrand en landpijlers.
- [New (1974) concrete archbridge](https://commons.wikimedia.org/wiki/File:%22New%22_(1974)_concrete_archbridge_in_the_A28_motorway_Zwolle._Just_like_the_Deventer_bridge_(A1)_it_has_a_lot_of_creepdeflection_-_panoramio.jpg), Henk Monster, CC BY 3.0: andere schuine richting, kokerverdiepingen en oostelijke pijlers.
