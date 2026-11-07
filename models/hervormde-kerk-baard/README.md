# Hervormde kerk (Baard)

Hervormde kerk (Gertrudiskerk, Fries: Gertrudistsjerke) aan de Dekemawei 6 in Baard, gemeente Leeuwarden (Fryslân). Zaalkerk uit 1876 met een driezijdig gesloten koor en een westtoren van drie geledingen met een ingezwenkte spits. Het torenuurwerk van A.H. van Bergen is van 1876, het orgel van Bakker & Timmenga van 1888. Het rijksmonument (8468) geldt voor twee rode Bremer-stenen kinderzerken van het geslacht Dekema uit de 14e eeuw, het orgel en het uurwerk in de kerk. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0140100000166926 (schip, koor en toren zijn één pand, bouwjaar 1876). De buurpanden liggen 17 m of verder weg en raken het model niet.
- STL op 1:1000: circa 23,3 × 8,3 × 30,2 mm.
- Genereren: `node scripts/generate-hervormde-kerk-baard.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (173817,87; 572880,13), lat/lon 53,142329 / 5,668427, midden in het schip op maaiveld z = 0 (NAP circa +1,95 m, het laagste maaiveld rond de kerk aan de oostkant; het kerkhof aan de westkant ligt op NAP +2,3 tot +2,4 m). +X loopt langs de nok van de toren (west) naar het koor (oost), onder 3,8 graden in RD (`xAxis` [0,9978; 0,06627]); de lange gevels liggen in de BAG-contour onder 3,5 en 4,2 graden en de nok in het AHN-DSM evenwijdig. `groundHeight` 43,54 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rondom (bij de noordoosthoek van het koor; west 43,67 tot 43,90, zuid 44,05). `groundOffsetMetres` −0,1, onderkant 1,2 m onder z = 0.

## Onderdelen

- **Schip**: 15,15 × 7,68 m (BAG), zadeldak met nok +10,25 m (AHN NAP +12,2) en helling 1,33 (53 graden; AHN en 3D BAG 1,29 aan de zuid- en 1,40 aan de noordkant, gelijk gemaakt), goten +5,14 m (3D BAG 4,9 tot 5,2). Aan de westkant een rechte gevel achter de toren, met op beide hoeken een hoekstuk van 0,5 m tot 0,9 m boven de goot.
- **Koor**: driezijdig gesloten, schuine gevels van 3,6 m en een oostgevel van 3,84 m (BAG), schilddak met dezelfde helling als het schip (3D BAG 1,41 tot 1,56); de schilden komen bij u = 6,34 m op de nok samen.
- **Gevels**: plint tot +0,8 m (0,1 m), gootlijsten van 0,3 m met een ondervlak van 40 graden rondom, een lisene op de overgang van schip naar koor aan beide kanten. Zuidgevel: deur in de westelijke travee en vier rondboogvensters; noordgevel vijf vensters; een groot venster in elke schuine koorgevel; oostgevel blind.
- **Toren**: 4,24 × 4,81 m (BAG), plint, hoeklisenen, banden op +6,6 en +12,9 m (onderkant 34 graden), spitsboogportaal in de westgevel, een venster in de middelste geleding, twee galmgaten per zijde in de bovenste geleding, en een kroonlijst met fries van +15,6 tot +17,05 m die 0,6 m uitkraagt (AHN NAP +19,0, PDOK 17,1 m boven de voet).
- **Spits**: achtkant, ingezwenkt: 3,6 m breed op de kroonlijst, 2,9 m op +18,2, 1,93 m op +20,85, 1,18 m op +23,25, 0,7 m op +25,65 en punt op +29,0 m (AHN NAP +30,7 op de spits).

## Geschat

- De hoogtes van de torenbanden, de kroonlijst met fries en het spitsprofiel zijn gemeten op de RCE-foto van het zuidwesten (20026753), geschaald op de westgevel van de toren (4,81 m), met een correctie van 15 % voor het verkorten naar boven; het profiel is getoetst aan het AHN-DSM (straal circa 1,4 m op +17,5, 1,0 m op +20 en 0,6 m op +23, met 0,25 m rasterwaas). De punt (+29,0 m) ligt iets boven het hoogste AHN-punt (28,5 m boven maaiveld), omdat de naald smaller is dan het raster.
- Vensters, deur, portaal, galmgaten, lisenen, plint en gootlijsten zijn uit de foto's geschat. De noordgevel staat op geen enkele foto: daar zijn de vensters van de zuidgevel gespiegeld, met een venster op de plaats van de deur.
- De hoekstukken naast de toren (0,9 m boven de goot) zijn naar de RCE-foto's 20026750, 20026753 en 20026757 geschat.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden) in plaats van rondbogen; roeden, galmborden, de wijzerplaten en de boogfriezen onder de banden en de kroonlijst (kleiner dan 0,9 m) zijn weggelaten.
- De knop, bol en het kruis op de spits, het kruis op het koordak, regenpijpen, het hekwerk en het keermuurtje rond het kerkhof (kleiner dan 0,9 m of onderdeel van het terrein).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Rijksmonumentenregister 8468](https://monumentenregister.cultureelerfgoed.nl/monumenten/8468)
- [Wikipedia: Hervormde kerk (Baard)](https://nl.wikipedia.org/wiki/Hervormde_kerk_(Baard)) en [Wikidata Q2532035](https://www.wikidata.org/wiki/Q2532035)
- [OpenStreetMap way 292942029](https://www.openstreetmap.org/way/292942029)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Baard) (RCE 20026750, 20026753, 20026757; Baard, Gertrudistsjerke 1 en 2; BAARD HERVORMDE KERK)
- BAG pand 0140100000166926 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0140100000166926) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
