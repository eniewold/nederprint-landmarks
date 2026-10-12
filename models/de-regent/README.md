# De Regent (Eindhoven)

Woontoren van Van Aken, opgeleverd in 1999 aan het Clausplein. Het model
omvat het gehele BAG-pand: hoge middenstrook, beide lagere witte vleugels,
zes hoge loggia's per eindgevel, glaslagen bovenin, kolomplint, dakrand,
installaties, zuidelijke lage uitbouw en gebogen winkelvoet met luifel.

## Bestanden

- `de-regent.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `de-regent.json`: catalogus, positie, maaiveldpunten en bronhoogtes.
- `de-regent-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- `node scripts/generate-de-regent.mjs`: reproduceerbare generator met vaste
  bronmaten; per-rij voorbeeld `generate-vestedatoren.mjs`.

## Positie en maten

Oorsprong **RD (161058, 383266)**; X op **−17,78°** in RD.
Z=0 is **NAP +16,8 m**, onderkant −1 m. Vier expliciete straatpunten kiezen
het laagste PDOK-niveau, **60,75296294 m ellipsoïdisch**, ook als terugval.
`groundOffsetMetres` is 0. Vervangt uitsluitend
**NL.IMBAG.Pand.0772100000286298**. Het Clausplein blijft PDOK-terrein.

| Bouwdeel | m NAP |
|---|---:|
| Witte zijvleugels | 107,445 / 107,466 |
| Middenstrook, dak | 110,444 |
| Middenstrook, rand | 112,965 |
| Technische dakdelen | 111,789 / 111,820 / 116,080 |
| Gebogen winkelplint | 24,520 |
| Lage zuidelijke uitbouw | 33,475 |

BAG levert de gebogen volledige voet, 3DBAG LoD2.2 en AHN de dakniveaus.
De toren bestaat uit continue prisma's en benoemde bouwdelen, niet uit
gestapelde DSM-lagen. Alleen de werkelijke loggia's hebben vloerplaten.

## Schattingen en printaanpassingen

Venstermaat en ritme zijn uit schuine foto's geschat; laaghoogte circa 2,9 m.
Vensters zijn blinde nissen van 0,35 m, de zes hoge loggia's per eindgevel
1,3 m diep met platen van 0,9 m. Bovenste glaslagen hebben eigen brede nissen.
De hoofdgevels en hoge middenstrook behouden verschillende ritmes.

De open plint staat op geschatte 1,2 m brede kolommen. Korte permanente
45°-verbredingen onder de witte vleugels zijn binnen de gevelvlakken begrensd.
Winkelglas en luifel zijn vereenvoudigd; de luifel heeft 45°-ondersneden.
Dakinstallatie en onderhoudswagen zijn vereenvoudigd op de gemeten hoogtes.
De onderhoudsgiek, antennes, hekwerk en letters zijn weggelaten omdat hun
vrijstaande doorsnede kleiner dan 0,9 m is; glas blijft blind reliëf.

## Controle

GLTFLoader en controlekaart zijn bekeken. Vier wereldgerichte renders zijn
naast echte PDOK-meshes en schuine foto's vergeleken:
−35° voegt vensters, middenstrook en winkelglas toe; 55° de zes hoge loggia's,
glaslagen en kolomopeningen; 145° de andere middengevel en dakrand;
235° de tegenoverliggende loggia's, lage uitbouw en gebogen luifel.

Manifold en STL: `NoError`, één verbonden volume, 9.122 driehoeken,
**48,4 × 26,3 × 100,3 mm** op 1:1000. De gewone 45°-printcorrectie voegt
**1,4662%** volume toe onder de plint en loggia's; geen losse steun.
Volledige uitsnede van 130 m, exact **130 × 130 mm** op 1:1000:
206 objecten, 77.280 driehoeken en 101,1 mm totale hoogte.
Permanente test `tests/landmark-models.test.ts` controleert positie,
bronhoogtes, beide reeksen loggia's en de open ruimte tussen kolommen.

Controlekaart:
http://127.0.0.1:3007/kaart/51.4384617/5.4743281/500/1x1/0?size=130&bruggen=0

## Bronnen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000286298),
  TU Delft/3DGI, CC BY 4.0; [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0)
  en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0;
  [luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Willemstraat](https://commons.wikimedia.org/wiki/File:De_Regent_vanaf_de_Willemstraat_Eindhoven.JPG),
  Rosemoon, CC BY-SA 3.0; [Deregenteindhoven](https://commons.wikimedia.org/wiki/File:Deregenteindhoven.jpg),
  Migdejong, CC BY-SA 3.0.
- [Keizersgracht, 2019](https://commons.wikimedia.org/wiki/File:Eindhoven,_woontoren_De_Regent_vanaf_de_Keizersgracht_IMG_8522_2019-01-20_09.19.jpg)
  en [Willemstraat, 2019](https://commons.wikimedia.org/wiki/File:Eindhoven,_woontoren_De_Regent_vanaf_de_Willemstraat_IMG_8605_2019-01-20_11.31.jpg),
  Michielverbeek, CC BY-SA 4.0. Foto's alleen als referentie gebruikt.
- [Architectuurcentrum Eindhoven](https://www.architectuurcentrumeindhoven.nl/wp-content/uploads/2018/04/ACE-DvdA-2017-Staalkaart-Wonen.pdf):
  architect, opleveringsjaar en nominale hoogte van 96 m.
