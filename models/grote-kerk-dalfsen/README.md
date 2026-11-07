# Grote Kerk (Dalfsen)

Hervormde kerk aan het Kerkplein, voorheen gewijd aan Sint-Cyriacus: een laatgotische pseudobasiliek waarvan schip en zijbeuken onder één kap liggen, het laatgotische koor van circa 1455 met een driezijdige sluiting, een sacristie, en de nooit voltooide westtoren uit de 16e eeuw met tufstenen onderbouw en tentdak. Na de brand van 1517 kwamen schip en koor onder één dak. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0148100000025043 (kerk, toren en sacristie zijn één pand).
- STL op 1:1000: circa 48,5 × 22,4 × 40,6 mm.
- Genereren: `node scripts/generate-grote-kerk-dalfsen.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (214349,50; 502259,00), lat/lon 52,504796 / 6,261325, midden in het schip op maaiveld (NAP +4,5 m). +X loopt langs de nok van de toren naar het koor, onder 1,3 graden in RD (`xAxis` [0,99974; 0,02269]); +Y wijst naar het noorden. De noord- en zuidgevel van de BAG-contour lopen evenwijdig aan die as en de nok ligt er in het AHN-DSM op. `groundHeight` 47,28 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk; `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip en zijbeuken**: 29,6 × 20 m (BAG). Middenkap met nok +20,6 m en helling 1,42 (55 graden, 3D BAG-vlakken 20,56 − 1,43 v en 20,65 + 1,41 v); vanaf 6,5 m uit de nok lopen de zijbeukdaken flauwer door (helling 1,05; 3D BAG 1,02 en 1,10) tot de goot op +7,7 m (AHN +8). De westgevels van de zijbeuken tegen de toren en de oostgevels naast het koor zijn halve topgevels onder die daklijn. Steunberen volgens de BAG-contour: vier op de noordgevel, drie op de zuidgevel en twee lagere bij de grafkapel Van Rechteren (de twee oostelijke traveeën van de zuidbeuk), diagonale hoekberen op de vier hoeken, alle met een schuine afdekking. Spitsboogvensters in elke travee, de noordingang onder het middelste noordvenster, en in beide westgevels een deur met rondboogvenster en een luik erboven. Een schoorsteen op de noordelijke dakhelling.
- **Koor (ca. 1455)**: 9,8 m breed onder dezelfde kap (goot +13,6 m, AHN +13,5), sluiting van drie zijden van een achthoek tot de oostgevel op u = 22,5 m, schild met nokeinde op u = 18,8 m (3D BAG-vlak 56,57 − 1,91 u). Steunberen op de vier hoeken van de sluiting (BAG), hoge spitsboogvensters in de sluiting, de zuidwand en boven de sacristie in de noordwand.
- **Sacristie**: tegen de noordkant van het koor, lessenaarsdak van +7,3 naar +2,8 m (3D BAG-vlak 10,8 − 0,72 v), vensters in oost- en noordgevel.
- **Toren**: onderbouw volgens de BAG-contour (9,3 × 10,8 m) tot de waterlijst op +5,0 m met het spitsboogportaal in het westen; daarboven een vierkante schacht van 8,9 m (AHN-kruin 9,5 m inclusief de dakoverstek), lijsten op +14,8 en +23,8 m. Tweede geleding met een groot venster tussen twee blinde nissen in het westen en drie blinde nissen op noord en zuid; derde geleding met drie hoge blinde spitsboognissen per zijde; klokkenverdieping met een galmgat en twee lisenenvelden per zijde tot de goot op +31,0 m. Tentdak met een overstek op een kraag, een flauwe voet en de top op +40,2 m (3D BAG en AHN).

## Geschat

- De hoogtes van de waterlijst (+5,0), de torenlijsten (+14,8 en +23,8) en de torengoot (+31,0, AHN-kruin +31) zijn uit de verhoudingen op de RCE-foto's van west en noordwest geschat; de knik tussen middenkap en zijbeukdak is symmetrisch op 6,5 m gelegd (3D BAG 6,1 noord en 7,4 zuid).
- Vensterbreedtes en -hoogtes, de nissen van de toren, de steunbeerhoogtes (+6,4 schip, +11,2 koor) en de plaats van de schoorsteen en de noordingang zijn uit foto's geschat. De koorsluiting is als regelmatige halve achthoek gemodelleerd (BAG-contour wijkt tot 0,4 m af).
- De onderbouw van de toren volgt de BAG-contour; de schacht erboven staat op het hart van de AHN-kruin, waardoor de waterlijst aan de zuidzijde breder is (1,05 m) dan aan de westzijde (0,65 m).

## Weggelaten of vereenvoudigd

- Rondbogen zijn spitse blinde nissen (58 graden) voor print zonder steun; maaswerk, galmborden en vensterroeden zijn weggelaten.
- Haan, bol en windvaan op de torenspits, het kruis op het koordak, de wijzerplaten, de kleine dakkapellen op het koorschild, de middenkap en het tentdak, regenpijpen, de muurankers en de lage kerkhofmuur (alle kleiner dan 0,9 m of geen deel van het pand).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (volume gelijk aan de export zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- Rijksmonumentenregister: [11653 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/11653) en [11654 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/11654)
- [Monumenten in Nederland, Overijssel: Dalfsen, Herv. kerk](https://www.dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0023.php)
- Foto's Wikimedia Commons: [kerk](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Dalfsen) en [toren](https://commons.wikimedia.org/wiki/Category:Tower_of_Grote_Kerk,_Dalfsen) (RCE 20047379, 20047380, 20047382, 20047385, 20047387, 20047391, 20047392, 20350653; "Dalfsen grote kerk - rm 11653")
- BAG pand 0148100000025043 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0148100000025043) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
