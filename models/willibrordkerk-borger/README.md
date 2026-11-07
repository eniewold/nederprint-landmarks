# Willibrordkerk (Borger)

Hervormde kerk aan de Hoofdstraat 34 in Borger, sinds 2013 cultuurpodium (Vanslag, nu Podium34). De westtoren is van het begin van de veertiende eeuw: kloostermoppen op een fundering van veldkeien, twee geledingen, een rondboogingang in het westen en galmgaten in spitsboognissen, met een tentdak. De middeleeuwse kerk werd begin negentiende eeuw afgebroken; in 1826 kwam er een eenvoudige zaalkerk met driezijdige sluiting (Waterstaatskerk) voor in de plaats. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1681100000012160 (toren en kerk zijn één pand). Geen buurpand raakt de kerk (het dichtstbijzijnde ligt 15 m noordwestelijk).
- STL op 1:1000: circa 34,6 × 11,3 × 27,6 mm.
- Genereren: `node scripts/generate-willibrordkerk-borger.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (249387,89; 549516,38), lat/lon 52,924463 / 6,790778, op de nok van het schip midden tussen de langsgevels, op maaiveld aan de oostkant (NAP +18,05 m). +X loopt langs de nok van de toren naar de koorsluiting, onder 16,26 graden in RD (`xAxis` [0,96; 0,28]); +Y wijst naar de noordzijde. De richting komt uit de twee evenwijdige langsgevels in de BAG-contour; de nok ligt er in het AHN-DSM midden tussen. `groundHeight` 59,65 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (oost van de sluiting); het kerkhof loopt naar de toren toe 0,5 m op (west van de toren 60,14). `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip**: 9,92 m breed (BAG), van de westgevel achter de toren tot de driezijdige sluiting (symmetrisch gemaakt, de BAG wijkt tot 0,3 m af). Goot +7,15 m, nok +13,2 m, dakhelling 50,7 graden (AHN-DSM, tot 0,2 m nauwkeurig op de dakvlakken); schild over de sluiting vanaf het nokeinde op 12,3 m oost van de oorsprong. Het dak loopt in het midden tegen de toren; de smalle hoeken naast de toren hebben een klein schild vanaf de westgevel (foto's van noordoost en zuidwest).
- **Gevels**: plint, houten gootlijst met 0,4 m overstek op een kraag, lisenen tussen de vensters en op de hoeken (ook op de knikken van de sluiting), vijf hoge rondboogvensters per langsgevel en één in elke schuine zijde van de sluiting; de oostzijde is blind. In het midden van de zuidgevel de ingang met een korter venster erboven. Twee schoorstenen op de nok.
- **Toren**: voet 7,8 × 7,75 m (BAG) met een rand van veldkeien, onderste geleding verjongend tot een waterlijst op +12,3 m, bovenste geleding tot de goot op +19,35 m (op de goot 7,4 × 7,0 m, AHN), met per zijde twee spitsboognissen met daarin de galmgaten. Rondboogingang in een verdiepte omlijsting in het westen, klein venster in de zuidzijde. Gemetselde gootlijst met 0,3 m overstek, tentdak met leien tot +25,8 m en makelaar met bol tot +27,2 m (hoogste AHN-punt NAP +45,3 m = +27,25 m).

## Geschat

- De hoogte van de waterlijst (+12,3), de maten van de galmnissen, de deur en de vensters, de lisenen, de gootlijsten en de schoorstenen zijn uit de foto's op Reliwiki (Anton van Daal en Hans Bouma, 2016) geschat. De vensters van het schip zijn gelijk verdeeld over vijf traveeën.
- De top van het tentdak (+25,8) volgt uit de dakhelling in het AHN en een foto van opzij; het hoogste AHN-punt (+27,25) is de makelaar met bol. De verjonging van de toren is afgeleid uit het verschil tussen de BAG-voet en de dakrand in het AHN en klopt met de westfoto.

## Weggelaten of vereenvoudigd

- Rondbogen (vensters en westingang) zijn blinde nissen met een spitse top (58 graden) voor print zonder steun; de galmgaten (twee smalle openingen van circa 0,3 m per nis) zijn samen één diepere opening van 0,9 m.
- De wijzerplaten op de oostzijde van de toren, het dakluik in het tentdak, de windvaan, de vensterroeden, de sluitstenen, de steigergaten en de ankers (kleiner dan 0,9 m of zonder reliëf). De lisenen zijn in werkelijkheid ondieper dan de 0,3 m van het model.
- De ondergrondse gang naar het oude gemeentehuis en het grafmonument van Aaldert Stevens op het kerkhof.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0 en een volume van 3873 m³ (3D BAG LoD2.2: 3846 m³). In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Het dakoppervlak ligt op 92 % van een raster van 1 m binnen 1 m van het AHN-DSM (mediaan 0,20 m); de afwijkingen liggen op de dakranden. Een export op 1:1000 met steun v2 van een uitsnede van 100 × 100 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Willibrordkerk (Borger)](https://nl.wikipedia.org/wiki/Willibrordkerk_(Borger))
- [Reliwiki: Borger, Hoofdstraat 34 - Willibrordkerk](https://reliwiki.nl/index.php/Borger,_Hoofdstraat_34_-_Willibrordkerk) (foto's Anton van Daal en Hans Bouma, 2016)
- Rijksmonumentenregister: [9897 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/9897) en [9898 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/9898)
- BAG pand 1681100000012160 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1681100000012160)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de PDOK-terreintegels
