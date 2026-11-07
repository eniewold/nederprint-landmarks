# Grote of Sint-Janskerk (Montfoort)

Laatgotische kruisvormige pseudobasiliek aan de Kerkstraat in Montfoort (rijksmonument 30057): schip en koor met zijbeuken onder één geknikte kap, een dwarsschip met rechte kopgevels, een vijfzijdige koorsluiting, de Heilig Grafkapel aan de zuidkant, een achtkante dakruiter op de viering en een slanke westtoren met traptoren en de spits van 1877. Gebouwd vanaf circa 1490, na de brand van 1629 hersteld tot 1634. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0335100000317720 (kerk, toren en aanbouwen zijn één pand).
- STL op 1:1000: circa 59,4 × 38,6 × 47,9 mm.
- Genereren: `node scripts/generate-grote-of-sint-janskerk-montfoort.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (124899,37; 450842,62), lat/lon 52,045085 / 4,948435, op het hart van de viering (kruising van de nokken) op maaiveld (NAP +1,6 m). +X loopt langs de west-oostnok van toren naar koor, onder 3,0 graden in RD (`xAxis` [0,99863; 0,05234]); +Y wijst naar het noorden. De gevels lopen in de BAG-contour onder 3,0 graden, de nokken liggen er in het AHN-DSM en de 3D BAG op. `groundHeight` 45,03 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (ten zuiden van het dwarsschip); `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld. Aan de noordkant ligt het maaiveld circa 1 m hoger; de muren lopen daar het terrein in.

## Onderdelen

- **Schip en koor**: pseudobasiliek zonder lichtbeuk, dus één kap over middenbeuk en zijbeuken met een knik. Schip: nok +21,0 m, steile middenvlakken (helling 1,47) tot de knik op 5,2 m uit de as, flauwere zijbeukvlakken (0,89) tot de goot op +9,0 m; 20,1 m breed tot de westgevels naast de toren. Koor: nok +20,9 m, helling 1,43 tot de knik op 5,1 m, zijbeukvlakken 0,74 tot de goot op +9,06 m; 22,5 m breed. Hellingen en knikken uit de 3D BAG (LoD2.2), gecontroleerd in het AHN-DSM. De zijbeuken eindigen met rechte gevels (oost op u = 18,4 m, west naast de toren).
- **Dwarsschip**: 10,8 × 36,1 m, nok +20,9 m, helling 1,47, goot +13,0 m, rechte kopgevels met hoekberen en twee beren per zijgevel. In elke kopgevel twee lancetvensters, een oculus en een venstertje in de top, in de zijgevels een venster; deur in de zuidgevel.
- **Koorsluiting**: halve tienhoek van vijf zijden (BAG), goot +13,0 m, schilden naar het nokeinde op u = 17,7 m (3D BAG), radiale steunberen op de vier hoeken en drie hoge vensters.
- **Steunberen**: op de noordbeuk volgens de BAG-inkepingen (0,9 × 1,1 m), op de zuidbeuk van het schip op dezelfde travees (foto's), op de koorbeuken en de oosthoeken, met een schuine afdekking. Spitsboogvensters als blinde nissen tussen de beren.
- **Aanbouwen**: de Heilig Grafkapel (5,1 × 5,6 m, zadeldak noord-zuid, goot +6,6, nok +10,5 m, 3D BAG) met topgevel, venster en oculus; het noordportaal tussen twee beren met lessenaarsdak (+5,1 tot +3,6 m) en deur.
- **Ronde traptoren** in de noordoosthoek tussen koorsluiting en noordbeuk (BAG), r 1,35 m, kroonlijst +12,6 m, achtkant kegeldak tot +16,4 m.
- **Dakruiter** op de viering: achtkante voet, lantaarn (dicht, met acht nissen), uitkragende spitsvoet op 50 graden en spits tot +28,0 m (AHN-piek +27,4 m).
- **Toren**: 6,2 m in het vierkant, westdeur en venster in spitsboognissen met twee hoge smalle nissen ernaast, banden op +16,2 en +23,0 m, middelste en bovenste geleding met drie spitsboognissen per zijde (de middelste dieper als galmgat), kroonlijst op een kraag tot +28,7 m (AHN), balustrade als dichte borstwering met vier hoekposten (de vazen als punt). Achtkante leien spits van 1877 tot +47,5 m met vier wijzerplaatkapellen en vier kleine dakkapellen hogerop. Achtkante traptoren (3,0 m) tegen de zuidkant van de toren met band, kroonlijst op +24,0 m, tentdak tot +26,4 m en schietgaten.
- **Plint** van 0,8 m rond kerk, toren en kapel.

## Geschat

- De spitshoogte (+47,5 m, NAP circa +49 m) is uit de AHN-omhullende geëxtrapoleerd (1 m breed op +45 m, hoogste DSM-punt +45,6 m) en past bij de opgegeven 49 m inclusief kruis; de spitsvoet (3,9 m) en de kapellen komen van foto's.
- De hoogtes van de torenbanden (+16,2 en +23,0 m), de nissen en de traptorenkroonlijst zijn uit de verhoudingen op foto's van de zuid- en westzijde geschat, geschaald op de gemeten kroonlijst (+28,7 m) en het tentdak van de traptoren (3D BAG +25,9, AHN +26,1 m).
- De ronde traptoren bij het koor en de dakruiter zijn op maat van de foto's en de AHN-piek gemaakt; de steunberen op de zuidbeuk van het schip staan niet in de BAG en zijn op de noordelijke travees gezet. Vensterbreedtes (2,2 m beuken, 1,9 m koor, 2,0 m lancetten) zijn uit foto's geschat.

## Weggelaten of vereenvoudigd

- Rondbogen en maaswerk: alle vensters, galmgaten en deuren zijn spitse blinde nissen (58 graden); de open lantaarn van de dakruiter is dicht met nissen, de opengewerkte balustrade een dichte borstwering.
- Kruisen, windvanen, de bol op de spits, de wijzerplaten zelf, regenpijpen, de daklijsten en de afdekking van de topgevels (kleiner dan 0,9 m).
- Het hekwerk rond het kerkhof en de bestrating.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 90 × 90 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote of Sint-Janskerk (Montfoort)](https://nl.wikipedia.org/wiki/Grote_of_Sint-Janskerk_(Montfoort))
- [Rijksmonumentenregister 30057](https://monumentenregister.cultureelerfgoed.nl/monumenten/30057)
- [Archimon: Montfoort, hervormde kerk](https://archimon.nl/utrecht/montfoortherv.html)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Janskerk_(Montfoort)) (RCE 20160538, 20160545, 20160551, 20160552, 20160553, 20160566, 20160638, 20314221; "Montfoort 136", "Toren Grote of Sint-Janskerk Montfoort Koninginnedag 2012", "2010 Grote of Sint-Janskerk (Montfoort)")
- BAG pand 0335100000317720 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0335100000317720) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
