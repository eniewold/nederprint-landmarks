# Domkerk (Utrecht)

De Domkerk of Sint-Maartenskathedraal aan het Domplein: het gotische koor (begonnen in 1254, gereed rond 1320) en het transept (15e eeuw). Het schip stortte in 1674 in; het Domplein ligt sindsdien tussen de kerk en de Domtoren. De Domtoren is een apart model (`domtoren`) en zit niet in dit model. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0344100000069167 (kerk met de aanbouwen in hetzelfde pand) en BAG-pand 0344100000046082 (de gerfkamer of sacristie ten noorden van het koor, zie hieronder).
- STL op 1:1000: circa 64,6 × 56,6 × 45,8 mm.
- Genereren: `node scripts/generate-domkerk-utrecht.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (136839,79; 455875,78), lat/lon 52,090842 / 5,122217, op het hart van de viering (de kruising van de nokken van koor en transept), op het laagste maaiveld rond de kerk (Achter de Dom, NAP +5,22 m). +X loopt langs de koornok naar het oosten, onder 18,5 graden in RD (`xAxis` [0,94832; 0,3173]): dezelfde as als de Domtoren, die 65,7 m westelijker op deze as staat. +Y wijst naar het noordtransept. De as is gemeten aan de nokken in het AHN-DSM (koornok 0,0 graden, transeptnok 0,4 graden afwijking).

`groundHeight` 48,67 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (oostzijde, Achter de Dom); `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld. Het Domplein aan de westkant ligt 0,5 tot 0,9 m hoger; daar staat de voet dus iets dieper in het terrein.

## Onderdelen

Hoogtes in NAP (AHN-DSM 0,5 m).

- **Transept**: 15,1 × 49,5 m, westgevel op 8,6 m en oostgevel op 6,5 m van de nok. Zadeldak met helling 1,48 (56 graden), nok +47,5 m, goot met galerij +38,8 m; aan de westzijde het vlakke dakterras op +40,9 m dat het DSM over beide armen laat zien. Kopgevels met topgevel tot +48,8 m en kruisbloem tot +50,6 m (hoogste DSM-punt), groot venster en (noord) portaal. Vier hoektorentjes (traptorens) van 2,8 m met achtkante spits tot +45,5 m. Drie traveeën per arm met grote lichtbeukvensters, wimbergen en pinakels op de goot, op de westgevel blinde bogen in de onderste zone.
- **Viering aan het Domplein**: het koordak loopt door tot de westgevel en eindigt daar in een bakstenen topgevel; daaronder de dichtgemetselde boog naar het verdwenen schip (met het glaskunstwerk) en de ingang.
- **Koor**: lichtbeuk 12,6 m breed, zadeldak met helling 1,58 (nok +47,5 m), vier rechte traveeën en een 5/10-sluiting (straal 6,3 m) met schilddak; lichtbeukvensters, wimbergen en pinakels op de goot.
- **Zijbeuken en kooromgang**: lessenaarsdaken van +27,3 m tegen de lichtbeuk naar +23,0 m; kooromgang met kapellenkrans (5/10, straal 13,3 m) en dakvlakken van +26,5 naar +23,0 m. Steunberen met pinakels (tot circa +34,5 m, DSM-pieken op u = 7,7 / 13,0 / 19,1 / 25,3 m en op de hoeken van de kapellenkrans) en luchtbogen naar de lichtbeuk en de sluiting.
- **Aanbouwen in BAG-pand 0344100000069167**: de zuidkapellen met plat dak (+23,3 m), de kapittelzaal onder een zadeldak (nok +22,4 m) met topgevel naar de pandhof, de noordvleugel van de kloostergang (+9,5 m) met lessenaar en halfronde uitbouw, de eerste travee van de westvleugel van de kloostergang tegen de zuidgevel (lessenaar +16,5 tot +12,5 m), twee kapellen aan het Domplein onder schilddaken (nokken +25,1 en +27,1 m, 3D BAG) en de lage platte aanbouw (+14,2 m) naast het noordtransept.
- **Gerfkamer (BAG 0344100000046082)**: lage strook (+18,0 m) langs de zijbeuk en drie schilddaken (goot +17,8, top +21,4 m) op de DSM-nokken. Dit is een eigen pand, maar de PDOK-reconstructie nam de pinakels van de kerk mee (een strook op +22,9 m en een kolom tot +28,5 m waar het AHN +18 m ziet) en zou als wand tegen het model blijven staan; daarom vervangt het model ook dit pand.

## Geschat

- Vensterbreedtes en -hoogtes, de dichtgemetselde vieringsboog, de portalen en de blinde bogen zijn uit foto's geschat, geschaald op de gemeten goten en nokken.
- De pinakels (0,9 m schacht, 1,5–2,5 m hoog, punt 2–4 m), wimbergen (3,4–3,6 m breed, 2,4 m boven de goot) en steunberen (1,3–1,4 m breed) zijn op foto's en DSM-pieken geschat. De sluitingen van koor en kooromgang zijn regelmatige 5/10-veelhoeken; de BAG-contour van de kapellenkrans is onregelmatiger.
- De zijbeukmuren (v = −15,5 en 13,5 m) en de dakhellingen van zijbeuken en kooromgang komen uit DSM en 3D BAG; de lessenaar van de kloostergangvleugel en de schilddaken van de gerfkamer zijn op het DSM ingepast.

## Weggelaten of vereenvoudigd

- Luchtbogen zijn dichte schoren van 0,9 m op de lagere daken, geen open bogen; de opengewerkte balustraden langs de goten zijn weggelaten (de galerij is een vlakke goot), alleen de pinakels staan erop.
- Vensters en portalen zijn spitse blinde nissen (58 graden) zonder maaswerk; kruisbloemen, hogels en het beeldhouwwerk zijn kleiner dan 0,9 m.
- De pandhof met de overige vleugels van de kloostergang, het Academiegebouw en de Domtoren zijn aparte panden en horen niet bij dit model. De 0,9 m hogere ligging van het Domplein zit in het PDOK-terrein, niet in het model.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden, de 45-gradensteuncontrole (geen opvulling) en dat het model geen pand van de Domtoren vervangt. Een export op 1:1000 met steun v2 van een uitsnede van 100 × 100 m bevat het model zonder de PDOK-panden van kerk en gerfkamer en zonder opvulling (volume gelijk aan de export zonder steun). Het model ligt minstens 34 m van het Domtorenmodel. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Dom van Utrecht](https://nl.wikipedia.org/wiki/Dom_van_Utrecht)
- [Rijksmonumentenregister 35973](https://monumentenregister.cultureelerfgoed.nl/monumenten/35973)
- [OpenStreetMap way 1159618262](https://www.openstreetmap.org/way/1159618262)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Utrecht_Dom_church) ("Domkerk 2024 gezien vanaf de Domtoren", "Uitzicht vanaf de Domtoren", "St Martin's Cathedral, Utrecht, buttresses as seen from SE", "Utrecht Dom Sint Martin Chor 1/5" en "Querschiff 1/3", RCE 20232137 en 20231821)
- BAG panden 0344100000069167 en 0344100000046082 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000069167) (dakvlakken van de aanbouwen)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
