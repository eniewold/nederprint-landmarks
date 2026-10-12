# De Admirant (Eindhoven)

Dam & Partners, 2006. Het landmark omvat de geknikte woontoren, kantoorplint,
De Bruine Heer met noordkop en kern, twee zadeldaklichten, technische opbouwen,
glazen winkelstrook en beide entrees. Het gehele BAG-pand wordt vervangen.

## Bestanden en generatie

- `de-admirant.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `de-admirant.json`: RD-positie, bronmaten, maaiveldpunten en vervanging.
- `de-admirant-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- `node scripts/generate-de-admirant.mjs`: reproduceerbare generator zonder
  netwerkafhankelijkheid, volgens het voorbeeld `generate-vestedatoren.mjs`.

## Positie en bronmaten

Oorsprong RD **(161135, 383385)**; lokale X staat **−40,4°** in RD.
Z=0 is **NAP +16,55 m**; onderkant z=−1 m. Vier PDOK-straatpunten buiten
het gebouw kiezen het laagste ellipsoïdische niveau **60,5967063 m**,
ook als vaste terugval. `groundOffsetMetres` is 0. Vervangt uitsluitend
**NL.IMBAG.Pand.0772100000288644**.

| Onderdeel | Gemeten hoogte in m NAP |
|---|---:|
| Schuin torendak | 112,312–121,108 |
| De Bruine Heer | 42,733 |
| Hoge kern | 46,710 |
| Noordkop | 40,445 |
| Noordelijke verbinding / verhoogde strook | 42,215 / 44,239 |
| Twee daklichtnokken | 44,045 |
| Glazen winkelstrook | 22,423–23,454 |
| Noordelijke winkel | 22,109 |

Het torendak is één doorlopend vlak:
`NAP = 0.262424129*(RDx−161135) + 0.0659441442*(RDy−383385) + 115.714908`.
De winkelstrook heeft eveneens een eigen hellend dakvlak. De volumes zijn
prisma's, getrimde vlakken, gevelnissen en echte bouwdelen; geen DSM-lagen.
De gemeten volledige BAG-voet vormt een lage winkelplint tot +20,009 m NAP
en verbindt de bovengrondse bouwdelen. Open terrein en de naastgelegen Blob
en Lichttoren horen niet bij dit pand en blijven in PDOK.

## Geschat en vereenvoudigd

Gevelvensters zijn uit schuine foto's gereconstrueerd: verschillende breedtes
en enkele hogere vensters, woonlaagritme circa 3,02 m. Nissen zijn blind,
0,35–0,4 m diep; glas is reliëf en geen textuur. De glazen hoekbanden hebben
een eigen raster. Transparante verbinding op +23,454 m is geschat tussen
aangrenzende daken: AHN ziet deels door het glas; het steile 3DBAG-vlak
tot +56,997 m correspondeert niet met de foto's of AHN en is verworpen.

Entrees, luifels en beeld zijn uit foto's geschat. Luifels hebben permanente
45°-ondersneden; het schematische beeld heeft een lichaam van 1 m breed
en een hoofd van 0,9 m. Dakinstallaties en onderhoudswagen zijn vereenvoudigd.
De onderhoudsgiek, antennes, letters en fijne kozijnen zijn weggelaten:
hun vrijstaande doorsnede is kleiner dan 0,9 m op ware grootte. De twee
lange daklichten zijn continue zadeldakvlakken, geen trappen.

## Controles

GLTFLoader toont het volledige model; vier wereldgerichte aanzichten zijn
vergeleken met echte PDOK LoD2.2-meshes en schuine foto's van verschillende
zijden. −35°: vensters, glazen hoek en winkelgevel; 55°: noordkop, historische
entree en daklichten; 145°: achtergevelnissen, installaties en doorlopend dak;
235°: tweede torengevel, glashoekband en kantoorplint.

Manifold: `NoError`, één verbonden volume, 24.478 driehoeken; STL circa
**74,4 × 106,8 × 105,6 mm** op 1:1000. De normale 45°-printcorrectie voegt
**0,1094%** volume toe, zonder losse steunconstructies. Een volledige
kaartuitsnede van 180 m is als **180 × 180 mm** preview-export op exact
1:1000 gecontroleerd: 243 objecten, 90.600 driehoeken, 106,2 mm totale hoogte.
Permanente test: `tests/landmark-models.test.ts`, inclusief plaatsing,
historische dakhoogtes en raycasts op het continue hellende torendak.

Controlekaart:
http://127.0.0.1:3006/kaart/51.4399169/5.4756541/680/1x1/0?size=180&bruggen=0

## Bronnen en rechten

- [Dam & Partners — Rond de Admirant](https://damenpartners.com/projecten/rond-de-admirant/):
  schuine foto's Luuk Kramer en Mathieu van Ek; uitsluitend referentie,
  foto's niet opgenomen in de repository.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000288644):
  TU Delft/3DGI, CC BY 4.0; dakvlakken en gebouwgeometrie.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0) en
  [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): CC0;
  [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [De Admirant (2025)](https://commons.wikimedia.org/wiki/File:De_Admirant_(2025).jpg)
  en [Emmasingel (2024)](https://commons.wikimedia.org/wiki/File:Emmasingel,_Eindhoven_(2024).jpg):
  S. Perquin, CC BY-SA 4.0.
- [Admirant1](https://commons.wikimedia.org/wiki/File:Admirant1.jpg):
  Lempkesfabriek, CC BY-SA 3.0. Foto's alleen als referentie gebruikt.
