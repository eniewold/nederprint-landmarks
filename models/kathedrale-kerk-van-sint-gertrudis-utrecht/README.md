# Sint-Gertrudiskathedraal (Utrecht)

Oud-katholieke kathedraal (Kathedrale Kerk van Sint-Gertrudis) aan het Willemsplantsoen, adres Mariahoek 9, gebouwd 1912-1914 naar ontwerp van E.G. Wentink jr. in neoromaanse stijl, ter vervanging van de afgebroken Mariakerk. Niet te verwarren met de achttiende-eeuwse schuilkerk (Gertrudiskapel, rijksmonument 36346) die erachter in het bouwblok ligt: dat monumentnummer staat in de opdracht, maar hoort bij de schuilkerk. De kathedraal zelf is een vrijstaande, van buiten goed zichtbare kerk met een eigen BAG-pand (bouwjaar 1912). Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kathedraal` in meters; vervangt BAG-pand 0344100000049117 (kerk, torens, traptorens, portalen en de lage aanbouwen zijn één pand). De buurpanden steken in de PDOK-tegel niet boven het AHN uit.
- STL op 1:1000: circa 47,1 × 29,7 × 29,5 mm.
- Genereren: `node scripts/generate-kathedrale-kerk-van-sint-gertrudis-utrecht.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (136463,54; 455645,77), lat/lon 52,088763 / 5,116740, op de as van het schip (onder de nok) op het maaiveld aan de oostzijde (Mariahoek, NAP +2,92 m). +X loopt langs de nok van de westgevel naar de apsis, onder 30,7 graden in RD (`xAxis` [0,85985; 0,51054]); +Y wijst naar het noordwesten. De BAG-gevels lopen binnen 0,3 graden evenwijdig aan die as en de nok ligt in het AHN-DSM precies op Y = 0. `groundHeight` 46,28 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (noordoosthoek, Mariahoek); `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld. Het Willemsplantsoen voor de westgevel ligt 1,16 m hoger (NAP +4,08); de westgevel staat daar dus 1,2 m in het PDOK-terrein, en deuren en portaal beginnen op die hoogte.

## Onderdelen

- **Schip**: 10,5 m breed, zadeldak met helling 1,32 (53 graden) en nok +20,15 m over de hele lengte (AHN-DSM per 0,25 m dwars op de as), goot +13,2 m met een gootlijst tot 0,35 m buiten de muur (DSM: vlakke rand op +13,5). Vier gezadelde dakkapellen per dakschild op 7,9 m onderlinge afstand (luchtfoto, pieken in het DSM, foto ca. 1914). Lichtbeuk met rondboogvensters per travee van 3,95 m. Oostgevel van het schip op u = 18,3 m, net boven de apsis.
- **Zijbeuken**: lessenaarsdak van +9,5 tegen het schip naar +7,56 aan de buitenmuur (helling 0,68), buitenmuur op 8,1 m uit de as (BAG), lisenen en rondboogvensters per travee.
- **Kapellen bij het koor**: aan beide zijden een eigen zadeldak evenwijdig aan het schip, nok +11,2 m op 7,4 m uit de as, helling 0,8 (DSM en 3D BAG), met vensters in de zijmuur en de oostelijke topgevel.
- **Apsis**: veelhoekige sluiting tot u = 25,25 m (BAG), goot +12,5, alle dakvlakken helling 1,3 (3D BAG 52 graden), nokeinde +19,26 m (DSM 19,2 tot 19,4); vlakke steunberen op de vier hoeken (BAG-uitsprongen), hoge vensters en een roosvenster in de oostwand.
- **Dubbeltorenfront**: twee torens van 4,0 × 4,0 m (BAG) met hoeklisenen, rondboogfries en lijst op +17,4 m, iets ingesprongen klokverdieping met een tweelicht per zijde, kroonlijst op +24,4 m en tentdak van vier vlakken (helling 2,0) tot +29,1 m (hoogste AHN-punt NAP +32,03; 3D BAG-nok 31,91). Deuren in beide torens, vensters boven elkaar in de westzijde.
- **Westgevel tussen de torens**: zandstenen portaalomlijsting met rondboogdeur, twee vensters ernaast, lijst op +7,0, dwerggalerij van zeven bogen, drie vensters, rondboogfries op +14,2, verhoogde topgevel met deklijst, tweelicht, roosvenster en de bol met kruis op de top (+21,8, DSM 21,8).
- **Traptorens**: twee achtkante traptorens naast de westtorens (BAG, kap van +13,8 tot +15,8 volgens de 3D BAG) en twee naast de apsis met koperen naaldspits van +15,0 tot +18,2 m (3D BAG, foto Mariahoek).
- **Portalen en aanbouwen**: zij-ingangen midden in beide zijbeuken met een zadeldak dwars op het schip (nok +7,1 en +7,6, 3D BAG); de lage zuidelijke aanbouw met lessenaarsdak (+6,6 naar +5,5) en een plat deel op +3,2; de noordelijke aanbouw met plat dak op +6,2 tussen zijbeuk en Mariahoek.

## Geschat

- De hoogtes van de torengeledingen (+7,0, +17,4), de dwerggalerij, de vensters en de gevelonderdelen zijn uit de verhoudingen op de foto ca. 1914 (Het Utrechts Archief / SFA) en de frontale Commons-foto (Sint-Gertrudiskathedraal.JPG) geschat, geschaald op de gemeten torentop (+29,1) en de nok (+20,15). De kroonlijst van de torens (+24,4) volgt de 3D BAG (dakvlakken vanaf +24,4 tot +25,1).
- Vensterbreedtes (0,9 tot 1,3 m), de lisenen (0,9 m), de steunberen (0,9 × 0,7 m) en de dakkapellen (1,5 m breed, nok +16,3) zijn uit foto's geschat. De apsis is symmetrisch gemaakt (BAG: −4,9 en +5,3 m uit de as).
- De dakkapellen aan de noordzijde staan in het schaduwdeel van de luchtfoto; ze zijn gespiegeld van de zuidzijde, zoals de foto van ca. 1914 ze toont.

## Weggelaten of vereenvoudigd

- Rondbogen (vensters, deuren, galerij) zijn spitse blinde nissen (58 graden) voor print zonder steun; de zuiltjes van de galerij en de vensters zijn niet apart gemodelleerd.
- Rondboogfriezen onder de goten en lijsten zijn als doorgaande lijst met een schuine onderkant gemodelleerd (de boogjes zijn kleiner dan 0,9 m); windhanen, kruisen en het kruisje op de oostgevel van het schip (kleiner dan 0,9 m), het mozaïek, regenpijpen en het hekwerk langs het plantsoen.
- Kleine knikken en uitsprongen van minder dan 0,5 m in de BAG-contour; het lichthof tussen het noordportaal en de noordelijke aanbouw blijft open.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Sint-Gertrudiskathedraal](https://nl.wikipedia.org/wiki/Sint-Gertrudiskathedraal), [Wikidata Q2395780](https://www.wikidata.org/wiki/Q2395780), [OSM way 237386428](https://www.openstreetmap.org/way/237386428)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Gertrudiskathedraal,_Utrecht) (Sint-Gertrudiskathedraal.JPG, Gertrudiskathedraal Oudkatholiek 9586 en 9587, SFA022825602 ca. 1914, Lange Elisabethstraat Mariaplaats panoramio)
- BAG pand 0344100000049117 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000049117) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
