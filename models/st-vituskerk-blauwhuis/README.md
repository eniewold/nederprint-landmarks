# St. Vituskerk (Blauwhuis)

Rooms-katholieke St. Vituskerk aan de Vitusdijk (nr. 27) in Blauwhuis, gemeente Súdwest-Fryslân. P.J.H. Cuypers ontwierp de kerk op 30 oktober 1867 als zijn eerste opdracht in het noorden; ze is gebouwd van 1868 tot 1871 (opzichter C.H. Peters, aannemer O.H. Schuurmans uit IJlst) en ingewijd op 15 oktober 1872. Het is een driebeukige transeptbasiliek in neogotische stijl (het register noemt het Rijnlandse Romano-gotiek) met een voorstaande toren en een naaldspits tussen vier wimbergen. De toren is in 1969-1970 gerestaureerd, het exterieur in 1991-1993 (rijksmonument 515166). De pastorie aan de zuidkant hoort bij het complex van Cuypers; die en de sacristie en lage vleugels vallen in hetzelfde BAG-pand als de kerk en zitten daarom in het model. Het model bestaat uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0683100000292816 (kerk, pastorie, sacristie en vleugels zijn één pand). De twee schuurtjes ten oosten van de absis (0683100000289414, 1900100010086519) zijn eigen panden en blijven staan.
- STL op 1:1000: circa 51,9 × 41,0 × 51,6 mm.
- Genereren: `node scripts/generate-st-vituskerk-blauwhuis.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (164841,17; 559515,29), lat/lon 53,0224742 / 5,5338707, in het hart van de toren op de as van het schip, z = 0 op NAP circa -0,4 m. +X loopt langs de nok van schip en koor van de toren (zuidwest) naar de absis (noordoost), onder 33,9 graden in RD (`xAxis` [0,83001; 0,55775]); +Y wijst naar het noordwesten. De gevels van schip, zijbeuken, transept en pastorie lopen in de BAG-contour onder 33,9 graden, en de nok van schip en koor ligt in de 3D BAG en het AHN-DSM op dezelfde lijn als het hart van de toren.

`groundHeight` 41,31 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de voet: ten oosten van de sacristie 41,31, ten zuiden van de zuidvleugel 41,55, ten zuiden van de pastorie 41,57 en ten zuidwesten ervan 41,52 m. De kerk staat iets hoger dan dat: het plein voor de toren ligt in het PDOK-terrein op 42,1 m en de noordkant (kerkhof) op 42,5 m. Volgens de afspraak (z = 0 op het laagste maaiveld rond de voet) zakt de voet van de toren daardoor circa 0,9 m in het terrein. `groundOffsetMetres` −0,1, onderkant 0,6 m onder z = 0.

## Onderdelen

- **Westtoren**: kern van 6,0 m in het vierkant tot +28,6 m; aan elke hoek twee steunberen van 0,9 m breed die op +7,0, +14,2 en +24,5 m terugspringen (0,75, 0,55, 0,35 en 0,15 m diep) en als lisenen doorlopen tot de wimbergen (BAG: voet 7,36 m breed; AHN: 6,2 m tot +19 m, 6,0 m daarboven); lijsten op +14,2, +24,5 en +28,6 m. Portaalrisaliet van 3,4 m breed en 0,8 m voor de toren (BAG) met wimberg tot +9,1 m en een spitse portaalnis; roosvenster boven het portaal; per zijde twee keer twee lancetvormige galmgaten en een wijzerplaat (aan de oostkant alleen boven de nok van het schip); vier wimbergen tot +32,8 m met een venster, pinakels op de hoeken en een achtkante naaldspits van 5,0 m tot +51,0 m.
- **Traptoren**: rond (2,0 m) in de zuidoosthoek tussen toren en eerste travee, kegeldak tot +15,0 m.
- **Schip en koor**: één zadeldak met nok +19,3 m en goot +13,9 m (helling 1,17; 3D BAG 1,17 tot 1,20), met gootlijsten; twee kleine dakkapellen (één per dakvlak, register).
- **Eerste travee** (u = 3,5 tot 11,8 m): uitgebouwd tot een laag tweede transept van 19,3 m breed met dwarse zadeldaken (nok +12,8 m, helling 1,25); in beide kopgevels drie lancetten met een oculus en hoekpijlers, in de westgevels een deur met een venster erboven.
- **Zijbeuken**: lessenaarsdaken van +9,8 m tegen het schip tot +7,8 m aan de goot (3D BAG), vier lancetten per kant, steunberen tussen de vensters, gootlijsten; lichtbeuk met drie lancetten per travee.
- **Transept**: 8,5 × 24,0 m, nok +19,3 m, goot +14,2 m (helling 1,2); kopgevels met vier lancetten en een roosvenster, hoekpijlers met pinakels; een lancet in elke zijgevel.
- **Dakruiter** op de kruising: achtkante lantaarn van 1,8 m tot +23,0 m en een naald tot +29,0 m.
- **Kapellen naast het koor**: lessenaarsdaken van +10,0 m naar +8,0 (noord) en +7,2 m (zuid), het oostelijke deel lager (+6,8 naar +5,5 m), zoals in het AHN en de 3D BAG; twee lancetten in de lichtbeuk van het koor erboven.
- **Absis**: vijf zijden van een tienhoek (register: 5/10-sluiting, straal 4,6 m; past op de BAG-hoekpunten), dakvlakken met de helling van het koor, gootlijst, steunberen op de hoeken tot +12,4 m, een lancet in elke zijde.
- **Pastorie**: 13,05 × 13,4 m (BAG), goot +9,0 m, schilddak met nok +12,9 m langs de westgevel (helling 0,6; AHN 12,8 m) en afgewolfde einden, gootlijsten, twee schoorstenen, erker van twee bouwlagen aan de westkant, vensters op twee verdiepingen en de voordeur als nissen; serre aan de zuidkant (3D BAG +5,2 m) met een laag glazen schilddak.
- **Traptoren tussen pastorie en zuidtransept**: 3,3 m in het vierkant tot +16,5 m, vier wimbergen tot +19,0 m en een achtkante spits tot +24,5 m (AHN 23,4 m op 0,5 m).
- **Gang** tussen zuidbeuk en pastorie met plat dak +4,0 m; **zuidvleugel** langs transept en koor met lessenaarsdak van +7,2 naar +3,2 m en een topgevel aan de zuidkant (nok +5,0 m); **sacristie** aan de zuidoostkant met schilddak (goot +2,8 m, helling 0,9) en schoorsteen.
- **Plint** rondom de kerk tot +1,0 m.

## Geschat

- De hoogtes van de geledingen en lijsten van de toren, het portaal, het roosvenster, de galmgaten, de wijzerplaten en de wimbergen (+32,8 m) zijn uit de frontale foto's (2018, 2014) geschat, geschaald op de goothoogte van de toren (+28,6 m) uit de AHN-omhullende. De spitstop van +51,0 m is geëxtrapoleerd uit de omhullende (49,9 m in de hoogste cel van 0,5 m); kruis en windwijzer zitten er niet in.
- De dakruiter (lantaarn en naaldtop) is geschat uit foto's en het AHN (27,3 m in de hoogste cel); de traptoren tussen pastorie en transept uit het AHN (vorm en 23,4 m) en de foto vanuit het zuidoosten.
- De ronde traptoren bij de westtoren, de erker en de serre van de pastorie, de topgevel van de zuidvleugel en de dakkapellen zijn naar foto's, de tekeningen van 1877 en het AHN geplaatst en gemaakt. De sacristie heeft een eenvoudig schilddak gekregen.
- Vensterbreedtes en -hoogtes, deuren, steunberen, pijlers, pinakels, lijsten en de plint zijn uit de foto's geschat; het aantal vensters volgt het monumentenregister.

## Weggelaten of vereenvoudigd

- Vensters, deuren, galmgaten en wijzerplaten zijn blinde nissen met een spitse top (58 graden); roosvensters en wijzerplaten zijn ronde nissen met een punt van 50 graden aan de bovenkant. Maaswerk, roeden en wijzers zijn weggelaten.
- Kruisen, windwijzers, de klossen onder de goten, het keperfries in gele steen, regenpijpen en hekwerk (kleiner dan 0,9 m).
- De wimbergjes en galmopeningen van de dakruiter (kleiner dan 0,9 m); de dakruiter is een gesloten lantaarn met naald.
- De glazen wanden van de serre zijn een gesloten volume.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Rijksmonumentenregister 515166](https://monumentenregister.cultureelerfgoed.nl/monumenten/515166)
- [Wikipedia: Sint-Vituskerk (Blauwhuis)](https://nl.wikipedia.org/wiki/Sint-Vituskerk_(Blauwhuis)) en [Wikidata Q1899825](https://www.wikidata.org/wiki/Q1899825)
- [OpenStreetMap way 293329568](https://www.openstreetmap.org/way/293329568)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Saint_Vitus_Church_(Blauwhuis)) (tekeningen 1877; RCE 20424422, 20424418, 20345785, 20035384; 20180817 Sint Vituskerk Blauwhuis; 2023 Blauhûs, Sint-Fitustsjerke; Torenspits 2018; Vitus-2016)
- BAG pand 0683100000292816 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000292816) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
