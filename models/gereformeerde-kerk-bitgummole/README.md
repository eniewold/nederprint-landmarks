# Gereformeerde Kerk (Bitgummole)

Protestantse (PKN) kerk aan de J.H. van Aismawei 11 in Bitgummole (Beetgumermolen, gemeente Waadhoeke), rijksmonument 508683. De kerk werd in 1924-1925 gebouwd naar ontwerp van A. Nauta uit Leeuwarden, in een stijl verwant aan de Amsterdamse School: een kruiskerk met een centraal gerichte, waaiervormige plattegrond, twee bouwlagen hoog, onder een samengesteld zadeldak dat oorspronkelijk met zwarte pannen en nu met zwarte golfplaten is gedekt. Voor de zuidgevel staat, ten oosten van de as, de vierkante toren van circa 24 m met vier geveltopjes, uurwerk, galmgaten en een leien spits. De lage kerklokalen aan de oostkant horen bij hetzelfde BAG-pand maar niet bij het monument. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0083100000002267 (kerk, toren, portalen en kerklokalen zijn één pand, bouwjaar 1924). Geen ander PDOK-pand raakt de kerk; het dichtstbijzijnde (0083100000002321) staat 3,5 m ten zuidoosten van de toren.
- STL op 1:1000: circa 23,7 × 31,4 × 25,7 mm.
- Genereren: `node scripts/generate-gereformeerde-kerk-bitgummole.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (176188,73; 583285,51), lat/lon 53,235739 / 5,704543, op de kruising van de twee nokken. +X loopt langs de nok van het schip van de zuidgevel naar de achtergevel, onder 77,9 graden in RD (`xAxis` [0,20962; 0,97778]); +Y wijst naar het westen. De BAG-gevels liggen op deze hoek binnen 0,05 m recht en de nokken in het AHN-DSM lopen er evenwijdig aan. z = 0 ligt op het laagste maaiveld rond de voet (oostkant, NAP +1,46 m); het voorplein ligt op NAP +1,6 m. `groundHeight` 42,67 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (oostkant). `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip en dwarsarmen**: twee zadeldaken die elkaar op de kruising snijden, met kilgoten in de oksels. Schip (zuid- en noordarm) u = −11,44 .. 7,64, 11,25 m breed; dwarsarmen v = −9,86 .. 9,82, 11,30 m breed (BAG). Nok +13,95 m (AHN NAP +15,35 .. 15,47 langs beide nokken), helling 1,25 (51,3 graden; 3D BAG-dakvlakken 1,244 .. 1,276), goot +6,92 m. Gootkraag van 0,3 m met een onderkant van 47 graden langs alle zijgevels.
- **Topgevels**: vier tuitgevels met een deklijst 0,25 m boven het dakvlak. Zuidgevel met het roosvenster (3,6 m, middelpunt +8,2 m); noord-, west- en oostgevel met een vierdelig venster in de top en vier vensters eronder.
- **Zijgevels**: driedelige vensters in de zijgevels van schip en dwarsarmen, een venster in de westgevel van de noordarm.
- **Voorportaal**: voor de zuidgevel, u = −13,88 .. −11,44 met de afgeschuinde westhoek (BAG), lessenaarsdak van 43 graden van +3,05 m tegen de gevel op (3D BAG NAP +4,5), en daarvoor de spitse portaalgevel (top +5,0 m) met deklijst, dubbele deur en het driehoekige tympaan.
- **Portaaltjes in de oksels** van schip en dwarsarmen (BAG), lessenaarsdak van 40 graden van +5,05 naar +3,35 m, met een deur in de zuidgevel.
- **Toren**: 3,65 m in het vierkant (BAG) voor de zuidgevel, schacht tot +15,8 m met deur, twee rijen vensterspleten, een venstertje en twee galmgaten per zijde, een lijst van 0,15 m (onderkant 47 graden), vier geveltopjes tot +18,35 m, leien hoekstukken tot +17,5 m en een vierkante naaldspits tot +25,25 m (AHN-top NAP +26,69).
- **Kerklokalen**: L-vormig onder schilddaken van 32 graden met nok +5,9 m (AHN NAP +7,35), goot +4,1 m: een vleugel langs de oostkant met topgevel op het zuiden en een vleugel langs de noordkant tot de oostgevel van de dwarsarm, met de noordoosthoek afgewolfd (luchtfoto). Plat dak op +3,05 m ten westen van de oostvleugel en een tussenlid met plat dak op +2,85 m in de oksel noordoost (3D BAG). Vensters en deuren als nissen.
- **Plint** van 0,12 m rondom tot +0,8 m.

## Geschat

- De toren: de schacht (+15,8 m), de geveltopjes (+18,35 m), de hoekstukken en de vorm van de spits (2,2 m breed op de geveltoppen, 1,1 m op +22,75 m) zijn gemeten op de frontale foto van 2023, geschaald op de BAG-breedte van 3,65 m; de top van de spits komt uit het AHN. De geveltopjes staan in het AHN tussen NAP +19,6 en +19,8.
- De portaalgevel (breedte 4,0 m, top +5,0 m, iets oostelijk van de as) en het tympaan zijn van de foto's van 1989 en 2023; het 3D BAG ziet alleen het lessenaarsdak erachter.
- Het roosvenster (straal 1,8 m, middelpunt +8,2 m), de vensterreeksen in de topgevels en de driedelige zijvensters zijn uit de foto's geschat; de vensters in de oostgevel en de gevels van de kerklokalen zijn alleen deels gefotografeerd en naar analogie geplaatst.

## Weggelaten of vereenvoudigd

- Vensters, deuren, galmgaten en het roosvenster zijn blinde nissen (spitse top van 58 graden, rechte openingen met een schuin plafond, het roosvenster als kegelvormige nis); de halfronde bovenkanten van de topgevelvensters zijn spits gemaakt, het maaswerk en het glas-in-lood zijn weggelaten.
- De pironvormige waterspuwers op de hoeken van de torenlijst, de wijzerplaten, de haan en het kruis op de spits, de gevelsteen en het hekwerk (kleiner dan 0,9 m of zonder reliëf).
- De korte schoorsteenstomp in de oksel noordoost en het schoorsteentje op de nok van de kerklokalen (luchtfoto, kleiner dan 0,9 m); de hoge schoorsteen op de foto van 1996 staat niet meer op de luchtfoto.
- De gemetselde stoep voor de ingang en de golfplaten van het dak.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 60 × 60 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Rijksmonumentenregister 508683](https://monumentenregister.cultureelerfgoed.nl/monumenten/508683)
- [Wikidata Q7478040](https://www.wikidata.org/wiki/Q7478040) en [OpenStreetMap way 302818711](https://www.openstreetmap.org/way/302818711)
- Foto's op Wikimedia Commons: Bitgummole, Grifformearde tsjerke; 2023 Bitgummole, griff. tsjerke (PKN); 2023 Bitgummole, tsjerke en pastorij; 2023 Bitgummole, grifformearde tsjerke (PKN); RCE-foto's 1989 en 1996 (signaturen 54186, 54188, 54189, 54192, 54198, 54199)
- BAG pand 0083100000002267 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000002267) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
