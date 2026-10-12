# Erasmusgebouw (Nijmegen)

Het landmark omvat het volledige BAG-pand: toren met horizontale glasbanden,
centrale dakrug en twee hoge liftkernen, entree, lage zaal met gebogen dak,
zuidelijke onderwijsstrip, hogere oostvleugel en westkop. De binnenhof blijft
open. Refter, Gymnasion en hun afzonderlijke loopbruggen blijven in PDOK.

## Bestanden en positie

- `erasmusgebouw.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `erasmusgebouw.json`: catalogus, bronmaten, RD-positie en maaiveldpunten.
- `erasmusgebouw-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- `node scripts/generate-erasmusgebouw.mjs`: reproduceerbare generator met
  vaste bronmaten; per-rij voorbeeld `generate-achmeatoren.mjs`.

Oorsprong **RD (188020, 425726)**, X op **−7,85°** in RD. Z=0 is
**NAP +24,1 m**, onderkant −1 m. Vier expliciete straatpunten kiezen het
laagste PDOK-niveau **67,79057763 m** ellipsoïdisch, ook als terugval;
`groundOffsetMetres` is 0. Vervangt **NL.IMBAG.Pand.0268100000087407**.

## Gemeten maten

| Onderdeel | m NAP |
|---|---:|
| Torendak, 25,06 × 48,76 m | 102,455 |
| Centrale dakrug | 111,367 |
| Twee hoge liftkernen | 113,388 / 113,368 |
| Gebogen zaal, rand / boog / rand | circa 32,01 / 33,73 / 33,15 |
| Lage westkop | 29,934 |
| Verbindingsdeel | 32,635 |
| Zuidstrip / oostdeel | 36,684 / 36,696 |
| Hogere oostvleugel | 40,564 |
| Zuidelijke techniek | 39,776 / 40,502 / 40,842 |

BAG levert de volledige voet; 3DBAG LoD2.2 en AHN leveren de dakniveaus.
De smalle westelijke uitloop tot +28,61, verbinding +28,727, ronde westdeur
en trappenhuisstrook tot +37,271 zijn opgenomen. Open terrein krijgt geen
landmarkplaat. De zaal is een geëxtrudeerd convex boogprofiel: één continu
gebogen dak, geen hoogtetrap. Alle andere volumes zijn benoemde bouwdelen.

## Geschat en vereenvoudigd

21 glasbanden op circa 3,65 m laagritme zijn uit foto's geschat. De band is
een blinde nis van 0,32 m en de venstervakken zijn 0,45 m diep; de betonnen
banden blijven massief. De lage gevels, roosterbanden op de dakrug, ronde
westdeur, entreeprofiel en kleine installatievormen zijn vereenvoudigd.
Het gebogen zaaldak benadert de gemeten profielhoogtes met een glad profiel.

Glas binnen de eigen BAG-voet blijft blind reliëf; afzonderlijke loopbruggen
worden niet vervangen. Letters, antennes en fijn hekwerk zijn weggelaten:
hun vrijstaande doorsnede is kleiner dan 0,9 m. Een volledig verborgen nis
tussen westkop en zuidstrip is gevuld, zoals in het Achmeatoren-voorbeeld;
het buitenoppervlak en de verbonden-volumecontrole blijven behouden.

## Controle

GLTFLoader, kaart en volledige preview bekeken. Vier gelijke wereldgerichte
renders vergeleken met echte PDOK LoD2.2-meshes en schuine foto's:
−35° voegt glasbanden, dakrugreliëf en zuidelijke ramen toe;
55° de kopgevelbanden, zaalboog en westkop;
145° de tegenoverliggende glasbanden, entree en zaaldak;
235° de andere kopgevel en de gehele zuidstrip met ramen en techniek.

Manifold en STL: `NoError`, één verbonden volume, **44.992 driehoeken**;
**103,2 × 76,8 × 90,3 mm** op 1:1000. De gewone 45°-correctie voegt
**1,0471%** volume toe, zonder losse steun. Gehele export op exact 1:1000:
**180 × 180 mm**, 144 objecten, 115.954 driehoeken, 92,6 mm totale hoogte.
De permanente test in `tests/landmark-models.test.ts` controleert de volledige
voet, lage dakniveaus, open hof, glasnissen en de continue dakboog.

Controlekaart:
http://127.0.0.1:3009/kaart/51.8190283/5.8655289/680/1x1/0?size=180&bruggen=0

## Bronnen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000087407),
  TU Delft/3DGI, CC BY 4.0; [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0)
  en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0;
  [luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Radboud Universiteit](https://www.ru.nl/over-ons/de-campus/gebouwen-en-ruimtes/erasmusgebouw).
- [Commons-categorie](https://commons.wikimedia.org/wiki/Category:Erasmusgebouw,_Nijmegen):
  `Erasmusgebouw Nijmegen 01`, `02`, `05` en `07`, Hanno Lans, CC BY 4.0.
  Foto's uitsluitend referentie; niet opgenomen in de repository.
