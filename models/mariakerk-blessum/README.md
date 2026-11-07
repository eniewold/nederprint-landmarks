# Mariakerk (Blessum)

Protestantse kerk op de terp van Blessum (gemeente Waadhoeke), oorspronkelijk gewijd aan Maria. Een eenbeukige gotische kerk, wellicht nog uit de veertiende eeuw, met een driezijdig gesloten koor onder een doorlopend schilddak. De noordingang kreeg omstreeks 1500 een omlijsting van rode en gele steen met een gewrongen kraal; in 1860 is de zuidgevel vernieuwd met rondboogvensters. De westtoren van drie geledingen werd in 1879 ommetseld en kreeg een ingesnoerde spits; tegen de zuidkant van de toren staat een laag aanbouwtje. Restauratie 1978, eigendom van de Stichting Alde Fryske Tsjerken. Rijksmonument 28581. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0083100000007588 (schip, koor, toren en aanbouw zijn één pand). Er staan geen andere panden tegen de kerk; het dichtstbijzijnde pand (0083100000007587) ligt circa 25 m naar het oosten.
- STL op 1:1000: circa 25,4 × 9,5 × 23,6 mm.
- Genereren: `node scripts/generate-mariakerk-blessum.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (176612,77; 577191,75), lat/lon 53,180967 / 5,710484, in het midden van het schip op maaiveld (NAP +2,85 m). +X loopt langs de nok van de toren naar het koor, onder 4,7 graden in RD (`xAxis` [0,99664; 0,08194]); +Y wijst naar de noordgevel. De zuidgevel van het schip loopt in de BAG-contour onder 4,70 graden, de noordgevel onder 4,2 graden; de nok ligt in de 3D BAG en het AHN-DSM evenwijdig aan de zuidgevel. `groundHeight` 43,98 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (noordoostkant van het koor); aan de zuidkant (pad) ligt het maaiveld tot 0,4 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip** (BAG 17,0 × 8,4 m): zadeldak met de nok op +10,65 m (AHN NAP +13,5 m) boven de as en een helling van 1,24 (51 graden) aan beide zijden (3D BAG 1,20 en 1,28, AHN-profiel 1,15 tot 1,35), goten op de muur op +5,44 m. De westgevel is een rechte topgevel waar de toren tegenaan staat.
- **Koor**: driezijdig gesloten (oostwand 3,3 m breed op u = 11,4 m, schuine wanden vanaf de hoeken van het schip, BAG). Het schilddak loopt van het schip door: de nok eindigt op u = 8,35 m, het oostschild heeft een helling van 1,71 (3D BAG 1,71) en de schuine schilden 1,60 (3D BAG 1,51 tot 1,63).
- **Goot**: rondom (behalve tegen de toren) loopt het dak 0,35 m over de muur, met een bakgoot met een onderkant van 47 graden.
- **Plint** van 0,12 m tot +1,6 m met een afgeschuinde bovenkant, rondom schip en koor.
- **Steunberen** (0,9 m breed): drie schuine beren langs de noordgevel, een op de noordoosthoek van schip en koor en twee op de oosthoeken van het koor (die drie staan ook in de BAG-contour), 0,6 tot 0,7 m diep aan de voet en schuin teruglopend tot +4,3 m.
- **Noordingang**: omlijsting van 2,4 m breed en 0,15 m diep tot +3,05 m met een spitsboogdeur, een venster erboven en een klein rondboogvenster ten westen ervan; daarnaast drie smalle spitsboogvensters tussen de steunberen.
- **Zuidgevel** (1860): rondboogdeur bij de westhoek, twee kleine vensters boven elkaar en drie hoge rondboogvensters (1,5 tot 1,7 m breed).
- **Koorvensters**: grote rondboogvensters (1,8 m breed) in beide schuine wanden en een hoge blinde spitsboognis in de oostwand.
- **Schoorsteen** op het noordschild bij de nok, tot +11,3 m.
- **Toren** (BAG en 3D BAG 4,9 × 4,9 m): plint, westdeur en een venster erboven, witte banden op +6,4 en +10,5 m, wijzerplaten aan de west-, zuid- en oostzijde, aan elke zijde twee galmgaten (+12,4 tot +14,0 m) en de kroonlijst 0,42 m uitstekend tot +16,15 m (AHN NAP +18,9 tot +19,0 m).
- **Spits**: ingesnoerde leien spits met een vierkante voet over de kroonlijst die na 0,85 m overgaat in een achtkant van 2,9 m breed, met de punt op +23,2 m.
- **Aanbouw** tegen de zuidkant van de toren (BAG en 3D BAG 4,2 × 1,9 m): lessenaarsdak van +2,35 m (zuid) tot +3,06 m (tegen de toren), met een deur in de westgevel.

## Geschat

- De hoogte van de spits (+23,2 m) is geschat uit de westfoto RCE 20035577 en de zuidfoto RCE 20035584 (spits circa 1,45 keer de torenbreedte); de AHN-piek van NAP +29,3 m (26,45 m boven maaiveld) valt op het kruis boven de bol, de leien spits zelf geeft gaten in het DSM.
- De hoogtes van de torenbanden, galmgaten, wijzerplaten, deur en het venster komen uit de foto's Blessum, Marijetsjerke (2021) en RCE 20035577 met een schaal uit de torenhoogte tot de kroonlijst (AHN). De ingesnoerde overgang (0,85 m hoog, achtkant 2,9 m breed) is geschat uit RCE 20035584 en 20035583.
- De plaatsen en maten van de vensters, deuren, portaalomlijsting en steunberen zijn geschat uit schuine foto's (RCE 20035572, 20035578, 20035583, 20035584; Kerkje van Blessum, 2009; Blessum, Mariatsjerke, 2017) met een perspectiefschatting langs de gevel; de plaatsen langs de noordgevel zijn het minst zeker.
- Het dak van de aanbouw is als lessenaarsdak gemodelleerd naar het 3D BAG-dakvlak; op de foto's lijkt het een laag dakje met een witte boeiboord.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (50 graden voor rondbogen, 58 graden voor spitsbogen); de wijzerplaten zijn druppelvormige nissen. Roedeverdeling, tracering, galmborden en de gemetselde ontlastingsbogen zijn weggelaten.
- De consoles onder de torenkroonlijst en de gootklossen (kleiner dan 0,9 m), de bol, het kruis en de windvaan op de spits, de windvaan op de koornok, het dakluikje in de spits, de muurankers, de gewrongen kraal van de noordingang en de regenpijpen.
- De wisseling van rood en geel metselwerk en de natuursteenblokken van de noordingang.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Mariakerk (Blessum)](https://nl.wikipedia.org/wiki/Mariakerk_(Blessum))
- [Rijksmonumentenregister 28581](https://monumentenregister.cultureelerfgoed.nl/monumenten/28581)
- [OpenStreetMap way 292883509](https://www.openstreetmap.org/way/292883509)
- Foto's Wikimedia Commons: Blessum, Mariatsjerke (2017); Blessum, Marijetsjerke; Kerkje van Blessum (2009); RCE 20035572, 20035577, 20035578, 20035583, 20035584
- BAG pand 0083100000007588 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000007588) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
