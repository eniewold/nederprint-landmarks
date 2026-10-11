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

Manifold NoError, één gesloten verbonden onderdeel, 5.922 driehoeken. STL 1:1000 circa 232,3 × 50,7 × 37,4 mm, inclusief verborgen voet. Regres­sietest in `tests/landmark-models.test.ts`: volledige lengte, daknokken, trapfronton, toren, lage onbesmette perronkap, grondplaatsing en 45°-printgeometrie.

Vier aanzichten naast PDOK en schuine foto's, werkelijke kaart met landmark uit/aan en volledige 260 × 260 m preview-export op 1:1000 gecontroleerd. Hele model past in de uitsnede, buurpand blijft zichtbaar. GLB/JSON/STL byte-identiek na herhaald genereren.

[Controlekaart](http://localhost:3000/kaart/50.8496260/5.7056140/420/1x1/344?theme=thema-polder-8&base=road&size=260&z=1). Nakijken: spoorzijdige dakkapellen, raamreeksen, noordelijk trapfronton en het vereenvoudigde pijler-/raamritme van de perronkap.

Reproduceren: `node scripts/generate-station-maastricht.mjs` in de landmarkrepo.

## Hercontrole spoorzijde — 11 oktober 2026

De spoorzijde miste herkenbare dak- en geveldetails. Toegevoegd zijn negen dakkapellen aan de zuidkantoren, een platte en een puntvormige kapel op de overgang, drie noordelijke kapellen en het brede noordelijke dwarsdak met trapfronton. Posities, dakvlakken en nokhoogtes komen uit de kleine 3D BAG-roofsurfaces (ook vlakken onder 20 m²) en AHN DSM; Google Maps 3D, luchtfoto’s en perronfoto’s zijn als visuele kruiscontrole gebruikt. Er is geen Google-geometrie of Google-maatvoering overgenomen. De zuidelijke kapelnokken liggen op NAP +61,13 tot +61,66 m; de noordelijke dwarsnok op +64,90 m.

Boven de perronkap zijn raamreeksen als blinde nissen van 0,35 m diep toegevoegd, evenals glasvelden in de kapellen, hal en noordelijke trapgevel. Onder de gesloten kap geven ondiepe nissen het pijler-/raamritme aan: de echte vrije ruimte tussen kolommen is gevuld om de lange vlakke kap zonder steun te kunnen printen. Raamverdeling, dorpels, nisdiepte, pijlerafstand, schoorsteenbekroning en het trapritme met top NAP +65,80 m zijn geschat en vereenvoudigd. De kleine overgangskapel heeft een gesloten, versimpeld glasveld; dunne roedes, dakpannen en bovenleidingen blijven weggelaten.

Ook verborgen raamholtes achter de klokkentoren zijn verwijderd en torenvensters naar het werkelijke gevelvlak verplaatst. De generator controleert voortaan het volledige verschilvolume op één component en selecteert geen grootste component om losse details of holtes te verbergen. Manifold NoError, één component, genus 0; bij 45° bedraagt de volumetoename 0,0883%. De nieuwe regressietest controleert alle negen zuidelijke kapelnokken, het spoorfronton, geometrische raamnisachterwanden en de lage kap. Alle vier zijden zijn opnieuw naast PDOK en schuine foto’s bekeken; de volledige 260 × 260 m uitsnede is opnieuw geëxporteerd op 1:1000 (modelhoogte inclusief basis 39,4 mm). Softwarecontrole, geen fysieke proefprint.

Aanvullende referenties (uitsluitend controlebeelden buiten de repositories):

- Kleon3, CC BY-SA 4.0: [spoorzijde 2022](https://commons.wikimedia.org/wiki/File:2022_Station_Maastricht_(03).jpg), dakkapellen, raamreeksen en lichtstrook.
- Mark Ahsmann, CC BY-SA 4.0: [perrongevel 2015](https://commons.wikimedia.org/wiki/File:20150312_Maastricht;_Platforms_at_Station_Maastricht_03.jpg), glasvelden, betonnen kolommen en kap.
- Aerophoto-Schiphol, 14 juni 2021, rechten voorbehouden: [307075, zuidkant en sporen](https://www.aerophotostock.com/media/5f29b2cc-5392-4105-b249-a15a5e24ef5f-maastricht-luchtfoto-kantoorgebouw-de-colonel-en-station-maast) en [307074, station in Wyck](https://www.aerophotostock.com/media/7938f835-2f96-426d-8610-c575f647bd93-maastricht-luchtfoto-stadsdeel-wyck-met-station-maastricht), schuine dakcontrole.
- [Google Maps 3D, spoorzijde](https://www.google.com/maps/@50.8500603,5.7093281,310a,35y,270h,39.39t/data=!3m1!1e3), visuele cross-reference bekeken op 11 oktober 2026.
