# Grote of Maria Magdalenakerk (Goes)

Laatgotische kruisbasiliek aan de Grote Markt en de Korte Kerkstraat (rijksmonument 16375). Het koor is van 1455 tot 1470 gebouwd als basilicaal koor met drie bijna gelijke apsissen. De transepten zijn in 1506 voltooid. Na de brand van 1618 kwam er van 1619 tot 1621 een nieuw vijfbeukig schip naar ontwerp van Marcus Antonius, en in 1620 de open achtkante dakruiter op de viering. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: twee nodes in meters. `building:kerk` vervangt BAG-pand 0664100000008055: kerk, sacristie en aanbouwen zijn één pand. `building:huizen-tegen-het-koor` vervangt de panden 0664100000015497 en 0664100000015314, zie "Buurpanden".
- STL op 1:1000 (alleen de kerk): circa 66,7 × 53,7 × 55,4 mm.
- Genereren: `node scripts/generate-grote-kerk-goes.mjs --components`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (51076,47; 391530,40), lat/lon 51,503189 / 3,890355. Dat is het hart van de viering op maaiveld (NAP +1,9 m). +X loopt langs de nok van schip en koor van west naar oost, onder 7,7 graden in RD (`xAxis` [0,99098; 0,13399]). +Y wijst naar het noordtransept. Op die as liggen de nokken van schip, koor en transept in de 3D BAG (LoD2.2), en de gevels van de BAG-contour lopen ermee evenwijdig. `groundHeight` is 46,04 m (ellipsoïdisch): de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (west 46,17, noordwest 46,44, zuidwest 46,35, noord en zuid 46,04). `groundOffsetMetres` is −0,1 en de onderkant ligt 0,4 m onder maaiveld.

## Onderdelen

- **Schip (1619–1621)**: middenschip van 11,8 m breed met een zadeldak. De nok ligt op +31,5 m, de goot op +22,35 m, de helling is 1,55 (3D BAG: nok 31,3 tot 31,7). Elke lichtbeuk heeft vijf vensters. Aan beide kanten staan twee zijbeuken onder één lessenaarsdak, van +16,55 m tegen de lichtbeuk naar +12,0 m aan de buitenmuur (helling 0,585, 3D BAG), met vijf traveeën vensters en steunberen om de 5 m (BAG). De westgevel heeft een groot venster en een deur, een topvenstertje, twee hoge steunberen met pinakels naast de schipgevel en een venster per zijbeuk. Op de westhoeken staan de achtkante traptorentjes met loden koepeltjes, tot circa +16,6 m (DSM +16).
- **Transepten (voltooid 1506)**: 10,3 m breed. De nok ligt op +31,5 m, de helling is 1,63 en de goot ligt op +23,1 m (3D BAG). De kopgevels hebben een groot venster, een portaal (het dubbele portaal aan de marktzijde in het noorden) en een borstwering op gootniveau. De topgevel ligt 0,6 m daarachter, met drie spitsboognissen in het noorden en één venster in het zuiden, en een makelaar. Op de hoeken staan steunberen met pinakels (BAG). De westwanden hebben per travee een bovenvenster boven een grote blinde boog (foto's zuidwest).
- **Koor (1455–1470)**: het middenkoor heeft hetzelfde profiel als het schip en een vijfzijdige sluiting met schildvlakken; het nokeinde ligt op u = 28,5. Er zijn vijf lichtbeukvensters per kant en drie hoge vensters in de sluiting, met blinde bogen eronder. De zijkoren hebben een goot op +12,2 m, vijf dwarse zadeldaken met de nok op +16,0 m om de 4,3 m (3D BAG: nokken op u = 9,75 / 14,1 / 18,4 / 22,75) en een lessenaar tegen de lichtbeuk. Ze sluiten af met een driezijdige apsis met een tentdak tot +19,2 m (noord) en +18,7 m (zuid). Op elke dwarsnok staat een luchtboogpijler met pinakel, met een dichte boog naar de lichtbeuk (foto's noord- en zuidzijde). Steunberen en vensters zitten tussen de dwarskappen.
- **Dakruiter (1620)**: een loden achtkante voet van 3,6 m tot +32,85 m en een omgang van 5,0 m met een dichte balustrade op een kraag van 45 graden. Daarboven de klokkenverdieping van 4,3 m met boognissen, een kroonlijst, de klokvormige voet van de spits en de naald tot +55 m (AHN-DSM: ring van +36 tot +39 op 1,5 tot 2,5 m van het hart, naald +54 op een cel van 0,5 m).
- **Aanbouwen**: een ronde traptoren tussen het noordtransept en het noordelijke zijkoor (DSM-top +27,5). De kapel tegen het zuidtransept heeft een lessenaarsdak van +17,1 naar +11,0 m (3D BAG). Verder een smalle aanbouw (+6,0), de sacristie van circa 1520 met een plat dak (+4,5) en in het noordoosten de lage aanbouw (+3,0) met de consistorie onder een zadeldak (goot +3,8, nok +6,9). Rondom loopt een plint van 0,8 m.

## Buurpanden

De PDOK-reconstructie van de twee huizen tegen de koorsluiting (BAG 0664100000015497 en 0664100000015314) heeft punten van het koor meegenomen en staat tot 17,6 m boven het maaiveld. Het AHN-DSM toont er een plat dak op circa +9 m (mediaan 9,5 en 8,5 m). Daarom vervangt het model ook die twee panden, met een blok op +9,0 m binnen hun BAG-contour, zonder de kerk. De overige buurpanden wijken minder dan 2 m van het AHN af en blijven staan.

## Geschat

- De vensterhoogtes en -breedtes zijn uit de RCE-foto's van zuid-, zuidwest-, noord- en zuidoostzijde geschat, geschaald op de gemeten goten en nokken. Dat geldt ook voor de portalen, de hoogte van de steunberen (circa +10,6 m), de pinakels en de borstweringen.
- Van de dakruiter zijn alleen de breedte (circa 5 m) en de bovenkant van de omgang en de kroonlijst (+34 tot +37) in het DSM te zien. De verdeling van voet, omgang en klokkenverdieping en het profiel van de klokvormige spitsvoet komen uit de foto's. De top van +55 m is het hoogste DSM-punt (+54) plus de punt van de naald.
- De sacristie en de lage aanbouwen zijn als platte blokken op de DSM-hoogte gemodelleerd. De dakvlakken ervan in de 3D BAG zijn te klein en tegenstrijdig.
- De traptorentjes zijn regelmatige achthoeken (2,7 m) op de BAG-hoeken. De luchtboogpijlers zijn 1,0 × 1,2 m, met de top op +19,6 m en een pinakel tot +21,6 (DSM +18 tot +21).

## Weggelaten of vereenvoudigd

- Rondbogen en spitsbogen zijn blinde spitse nissen (58 graden) voor print zonder steun. De klokkenverdieping van de dakruiter is dicht en de balustrades zijn dichte borstweringen. De luchtbogen zijn dichte schijven van 0,9 m.
- Het maaswerk en de opengewerkte topgevel van het noordtransept, de hogels, de windvaan met haan en kruis, de bol, de vier wijzerplaten aan de spitsvoet, de dakkapelletjes, de regenpijpen en de kruisbloemen zijn weggelaten (dunner dan 0,9 m of vrijhangend).
- De korte, smalle verbinding tussen het zuidelijke zijschip en het zuidtransept (3D BAG-vlak op +17) is weggelaten.

## Controle

De generator controleert de geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden. Het resultaat is per node één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 90 × 90 m bevat het model, zonder de drie PDOK-panden en zonder ondersteuningsobject. Het volume is gelijk aan dat van een export zonder steun. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote of Maria Magdalenakerk](https://nl.wikipedia.org/wiki/Grote_of_Maria_Magdalenakerk)
- [Rijksmonumentenregister 16375](https://monumentenregister.cultureelerfgoed.nl/monumenten/16375)
- [Archimon: Goes, Grote of Maria Magdalenakerk](https://archimon.nl/zeeland/goesherv.html)
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Maria_Magdalenakerk_(Goes)): RCE 20079413, 20079415, 20079416, 20079417, 20079420, 20079422, 20307124, 20352790; "2019 Maria Magdalenakerk (Goes) (1)"; "Goes Grote Kerk Sint Maria Magdalena Vierungsturm 1"
- BAG-panden 0664100000008055, 0664100000015497 en 0664100000015314, en de [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0664100000008055) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
