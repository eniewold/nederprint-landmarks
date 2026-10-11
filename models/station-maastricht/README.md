# Station Maastricht

Het volledige BAG-pand met zuidkantoren, vestibule, klokkentoren, twee parallelle noordkappen, noordelijke dwarsvleugel en lage kopuitbouwen. De betonnen perronkap loopt circa 232 m door en is als gesloten kapvolume opgenomen. De moderne luchtbrug heeft een aparte registratie en blijft in PDOK staan.

## Maten en opbouw

RD `[177425.05411889977,317803.36070443224]`, +X naar noordnoordwest (RD 106°), z=0 NAP +47,4 m, voet −0,8 m. Maaiveld gemeten met AHN DTM en drie PDOK-straatpunten aan het Stationsplein; offset −0,3 m. BAG 0935100000025024, 11 oktober 2026.

AHN DSM en 3D BAG LoD2.2 geven perronkap NAP +52,42 m, lichtstrooknok +54,79 m, zuidkap +64,01 m, noordelijke hoofdkap +66,64 m, tweede kap +65,48 m, vestibulenok +72,18 m en torendak +82,82 m. Trapfronton +73,3 m en torentop +84,0 m volgen DSM-topwaarden en foto's. Zadeldakvlakken zijn vaste dwarsprofielen boven benoemde vleugels; trapgevels zijn gevelprofielen. Geen gestapelde rasterhoogtelagen.

De PDOK/3D BAG-rand van de zuidelijke lage kap is plaatselijk naar NAP +71 m getrokken door het naastgelegen hoge gebouw. Het model vervangt die complete registratie en herstelt de kap op +52,42 m; het hoge buurpand zelf blijft behouden.

Geschat/vereenvoudigd: geveltrapritme, dakkapelbreedte en plaatsing circa 1 m, raamverdeling, klokdiameters, luifeluitkraging en twee leeuwen als verbonden reliëf. Luifel heeft een gesloten 45°-onderzijde, glas en betonnen kap blijven dicht. Kleine sierankers, dakpannen, lettering, bovenleidingen en interieur zijn weggelaten; de kleine dakpionnen zijn in de getrapte geveltop opgenomen. Nissen 0,25–0,3 m diep, gevelprofielen minimaal 1,1 m dik.

## Bronnen

- [PDOK BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0), BGT, [AHN DSM/DTM WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), [actuele ortho](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0), EPSG:28992; [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000025024), dakvlakken en controle van kapbesmetting.
- [RCE monument 506688](https://monumentenregister.cultureelerfgoed.nl/monumenten/506688): L-vorm, trapgevels, parallelle daken, kopuitbouwen, dakkapellen, leeuwen en betonnen perronkappen. [Bureau Spoorbouwmeester](https://www.spoorbeeld.nl/databank/maastricht): vrije compositie, toren, hal en architect Van Heukelom.
- Hermann Luyken, publiek domein: [voorgevel 2010](https://commons.wikimedia.org/wiki/File:2010.07.20.154712_Bahnhof_Stationsstraat_Maastricht.jpg), [toren en zuidkantoren](https://commons.wikimedia.org/wiki/File:2010.07.20.155053_Bahnhof_Maastricht.jpg).
- Mark Ahsmann, CC BY-SA 4.0: [Station Maastricht 03](https://commons.wikimedia.org/wiki/File:20150312_Maastricht;_Station_Maastricht_03.jpg), [05](https://commons.wikimedia.org/wiki/File:20150312_Maastricht;_Station_Maastricht_05.jpg), [08](https://commons.wikimedia.org/wiki/File:20150312_Maastricht;_Station_Maastricht_08.jpg), kapgevels en entree.
- AarClaij, CC BY-SA 4.0: [stationsplein 2022](https://commons.wikimedia.org/wiki/File:Het_stationsplein_en_station_Maastricht_(2022).jpg); Kleon3, CC BY-SA 4.0: [2022 Station Maastricht 01](https://commons.wikimedia.org/wiki/File:2022_Station_Maastricht_(01).jpg), toren en dakkapellen. Foto's buiten repositories.

## Controle

Manifold NoError, één gesloten verbonden onderdeel, 3.608 driehoeken. STL 1:1000 circa 232,3 × 50,7 × 37,4 mm, inclusief verborgen voet. Regres­sietest in `tests/landmark-models.test.ts`: volledige lengte, daknokken, trapfronton, toren, lage onbesmette perronkap, grondplaatsing en 45°-printgeometrie.

Vier aanzichten naast PDOK en schuine foto's, werkelijke kaart met landmark uit/aan en volledige 260 × 260 m preview-export op 1:1000 gecontroleerd. Hele model past in de uitsnede, buurpand blijft zichtbaar. GLB/JSON/STL byte-identiek na herhaald genereren.

[Controlekaart](http://localhost:3000/kaart/50.8496260/5.7056140/420/1x1/344?theme=thema-polder-8&base=road&size=260&z=1). Nakijken: trapfronton, toren, parallelle kappen en lage perronkap.

Reproduceren: `node scripts/generate-station-maastricht.mjs` in de landmarkrepo.
