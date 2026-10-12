# FIRST Rotterdam

De Architekten Cie., 2015. Het model omvat de geknikte schacht met glazen
inspringingen, hoge gevelrasters, kroon, technische dakdelen, lange onderbouw,
lage glasdaken, oostserre, entree en omlijsting van het kunstpaneel.

## Bestanden en positie

- `first-rotterdam.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `first-rotterdam.json`: catalogus, RD-positie, maaiveld en bronhoogtes.
- `first-rotterdam-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- `node scripts/generate-first-rotterdam.mjs`: reproduceerbare generator
  met vaste bronmaten; per-rij voorbeeld `generate-hoftoren.mjs`.

Oorsprong **RD (91817, 437479)**, X op **16,3°** in RD. Z=0 is
**NAP −1,25 m**, onderkant −1 m. Drie expliciete voetpadpunten kiezen
het laagste PDOK-niveau **42,26031222 m ellipsoïdisch**, ook als terugval.
`groundOffsetMetres` is 0. De verdiepte Weenatunnel is geen maaiveldreferentie.
Vervangt uitsluitend **NL.IMBAG.Pand.0599100100006704**.

## Gemeten bouwdelen

| Onderdeel | m NAP |
|---|---:|
| Torendak | 120,067 |
| Kroon | 124,246 |
| Technische kern / hoge installatie | 124,526 / 126,175 |
| Lange onderbouw | 34,127 |
| Noordelijke rand / oostdeel | 34,293 / 34,097 |
| Westelijke techniek | 38,563 / 39,051 |
| Lage glasdaken en serre | 8,212 |

BAG, 3DBAG LoD2.2, AHN en ortho bepalen de bouwdelen en dakhoogtes.
De torencontour is vereenvoudigd uit de union van hoge dakvlakken en foto's;
de twee grote glazen inspringingen blijven herkenbaar. Benoemde prisma's,
gevelvelden en dakdelen, geen DSM-hoogtelagen. De zuidelijke BAG-uitloop
zonder bovengronds dak wordt niet als een acht meter hoge plaat opgebouwd;
de stadstuin en de ongefundeerde rand blijven vrij.

## Geschat en vereenvoudigd

Geveltraveeën van circa 2,35 m, 3,65 m laagritme en groepen van drie lagen
zijn uit foto's geschat. Nissen zijn blind: 0,22 m in de hoge rastervelden
en 0,45 m in de vensters. De kroon heeft een 1,3 m dikke rand met 0,35 m
blinde nissen; minstens 0,9 mm blijft over op 1:1000. De bovenrand is circa
1 m hoog. Glas in de inspringingen, serre en onderbouw heeft eigen reliëf.

Entree en kleine luifel zijn vereenvoudigd; de luifel krijgt een permanente
45°-ondersnede. Het Henry Moore-kunstpaneel krijgt een blinde omlijsting.
De individuele kleine bakstenen worden niet als een fictief patroon
gereconstrueerd. Naamletters, antennes, fijn dakhekwerk en dunne zonnepanelen
zijn weggelaten wegens hun doorsnede onder 0,9 m. Afgedekte nissen tussen
bouwdelen zijn gevuld volgens het Hoftoren-voorbeeld.

## Controle

GLTFLoader, kaart en volledige preview bekeken. Vier gelijke wereldgerichte
aanzichten naast echte PDOK LoD2.2-meshes en schuine foto's:
−35° voegt vensters, hoge rastervelden, kroon en glasplint toe;
55° de andere torengevel, onderbouwramen en serre;
145° de achtergevelvelden, westelijke techniek en onderbouw;
235° de glazen inspringing, beide kronendelen en lage glasdaken.

Manifold en STL: `NoError`, één verbonden volume, **53.084 driehoeken**;
**94,9 × 40,3 × 128,4 mm** op 1:1000. De normale 45°-printcorrectie voegt
**0,3986%** volume toe, zonder losse steun. Gehele export op exact 1:1000:
**180 × 180 mm**, 190 objecten, 121.504 driehoeken, 130,4 mm totale hoogte.
Permanente test `tests/landmark-models.test.ts`: plaatsing, gemeten daken,
glazen hoekinspringing, nissen en geen plaat over de stadstuin.

Controlekaart:
http://127.0.0.1:3011/kaart/51.9222001/4.4687826/680/1x1/0?size=180&bruggen=0

## Bronnen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100006704),
  TU Delft/3DGI, CC BY 4.0; [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0)
  en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0;
  [luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [De Architekten Cie.](https://www.cie.nl/first-rotterdam?lang=en),
  [Boele & van Eesteren](https://www.boele.nl/nl/projecten/first):
  schuine projectfoto's vanuit Weena, stad, westelijke buurten en achterkant;
  uitsluitend referentie, niet opgenomen in de repository.
- [FIRST Rotterdam](https://commons.wikimedia.org/wiki/File:FIRST_Rotterdam.jpg),
  Choinowski, CC BY-SA 4.0; foto's `FIRST Rotterdam aan de Weena, 2019`,
  `FIRST Rotterdam complex, 2019` en `FIRST Rotterdam en PS flatgebouw, 2019`,
  Marcel Douwe Dekker, CC BY-SA 4.0, via
  [Commons](https://commons.wikimedia.org/wiki/Category:FIRST_Tower,_Rotterdam).
