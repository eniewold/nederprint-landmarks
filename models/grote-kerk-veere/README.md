# Grote of Onze-Lieve-Vrouwekerk (Veere)

Laatgotische kruisbasiliek aan de zuidrand van de binnenstad (rijksmonument 36967). De kerk is van 1479 tot 1521 gebouwd onder Antoon I en Rombout II Keldermans; daarna lag de bouw stil, waardoor de westtoren bij één geleding bleef en het geplande stenen gewelf nooit kwam. Na de brand van 1686 verdwenen de vieringtoren en de houten torenbekroning. Het oorspronkelijke koor is afgebroken; in het oosten staat de lage hallenkerk met twee driezijdig gesloten beuken uit de tweede helft van de 16e eeuw (gerestaureerd in 1950). De noordelijke koorbeuk is in 1837 gesloopt. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters, die BAG-pand 0717100000020522 vervangt (kerk, toren, hallenkerk en aanbouwen zijn één pand).
- STL op 1:1000: circa 83,1 × 55,2 × 47,1 mm.
- Genereren: `node scripts/generate-grote-kerk-veere.mjs --components`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (35729,39; 396766,97), lat/lon 51,547199 / 3,667615: het kruispunt van de nokken van schip en transept op maaiveld (NAP +2,2 m). +X loopt langs de nok van het schip van west naar oost, onder 25,6 graden in RD (`xAxis` [0,90183; 0,43209]); +Y wijst naar het noordtransept. Op die as liggen de nokken in de 3D BAG (LoD2.2) en de gevels van de BAG-contour. `groundHeight` is 46,54 m (ellipsoïdisch): de laagste PDOK-terreinhoogte op de `groundSamplePoints` (transept noord en zuid 46,54; west 46,88; rond de toren 46,64 en 46,99; zijbeuken 46,70 en 47,10; hallenkerk 46,60 en 46,65). `groundOffsetMetres` is −0,1 en de onderkant ligt 0,5 m onder maaiveld.

## Onderdelen

- **Westtoren**: kern van 14,7 × 15,8 m met een plat dak en omgang op +37,7 m (AHN-DSM 37,6 tot 37,8). Op de westhoeken staan de zware traptorens (BAG: 3 m voor de gevel) met versnijdingen op +21 en +30 m; op de oosthoeken hoeksteunberen tot circa +28 m. De westgevel heeft de grote spitsboognis van 1 m diep (BAG: de gevel tussen de traptorens ligt 1 m terug) met drie rijen vensters van de ingemetselde vulling en de ingang. West-, noord- en zuidgevel hebben in de bovengeleding een hoge blinde spitsboognis. Op de omgang staat de vierzijdige, bolle kap van 11,2 × 12,0 m tot een plateau op +44,2 m (DSM: voet +38,7, plateau +44,2 tot +44,5), met een lantaarntje en tentdakje tot +46,6 m.
- **Schip**: 13,8 m breed, zadeldak met nok +32,55 m en helling 1,25 (3D BAG), goot +23,9 m. De lichtbeuk heeft per travee een boogvenster en lisenen tussen de traveeën.
- **Zijbeuken met kapellen**: buitenmuren op 15,9 en −16,15 m van de as (BAG), elk met een eigen zadeldak langs de beuk (nok +17,2 m, helling 1,05, 3D BAG) en een schild aan de westkant (helling 1,0). Steunberen van 0,75 × 1,3 m om de 4,9 m (BAG). Per kapel een grote blinde boog met twee bovenvensters en daaronder twee vensters (foto noordzijde).
- **Transept**: 12,65 m breed en 50,9 m lang, nok +32,55 m, helling 1,35, met afgewolfde kopgevels (3D BAG). Op de vier hoeken staan achtkante torentjes met een spitsje tot +28,6 m, met hoeksteunberen (BAG). Tegen de oostwand van de noordarm staat een traptoren tot +28,3 m (DSM +28). De kopgevels hebben een hoog venster, de zijwanden vensters per travee en bovenvensters boven de zijbeuken.
- **Hallenkerk**: twee beuken van 8,6 en 9,0 m breed met elk een zadeldak (nok +16,9 m, helling 1,5, 3D BAG) en een driezijdige sluiting met schildvlakken. Spitsboogvensters in de sluitingen en de zijmuren, steunberen langs de muren en schuin op de hoeken van de sluitingen (BAG), en een schoorsteen in de kilgoot (foto oostzijde).
- **Aanbouwen**: tussen zuidtransept en hallenkerk een aanbouw met lessenaarsdak van +11,2 naar +7,5 m (3D BAG), een lage aanbouw (+2,8 tot +3,7 m) west van het zuidtransept en een lage aanbouw tegen de noordmuur van de hallenkerk (+3,5 tot +4,5 m). Rondom loopt een plint van 0,8 m.

## Geschat

- Breedte en hoogte van vensters, nissen en kapelbogen zijn geschat uit de RCE-foto's (noord-, zuidwest- en oostzijde, luchtfoto 20396704) en de foto's van 2022 en 2026, geschaald op de gemeten goten en nokken.
- De versnijdingen van de traptorens en hoeksteunberen zijn uit het DSM afgelezen (+30 tot +31 op de traptorens, +27 tot +31 naast het schip) en als schuine verjongingen van 45 graden gemodelleerd.
- Het profiel van de bolle torenkap komt uit het DSM-raster van 0,5 m; het lantaarntje (2 m breed, top +46,6 m) is geschat uit de foto's.
- De hoektorentjes van het transept (2,2 m breed, schacht tot +25,6, spits tot +28,6) zijn geschat uit de foto's van oost- en westzijde; het DSM ziet alleen de schacht rond de goot.
- De lage aanbouw tegen de noordmuur van de hallenkerk volgt de BAG-contour; de hoogte (+3,5 tot +4,5 m) komt uit het DSM.

## Weggelaten of vereenvoudigd

- Vensters en bogen zijn blinde spitse nissen (58 graden) voor print zonder steun; ook de rondboogvensters van de lichtbeuk. Het maaswerk, de vensterroeden en de kruisbloemen op de vensterbogen zijn weggelaten (dunner dan 0,9 m).
- De kruisen en windvaan op lantaarn en kopgevels, de bollen op de spitsjes van de hoektorentjes, de dakkapelletjes en ontluchtingen op de daken en de regenpijpen zijn weggelaten (kleiner dan 0,9 m).
- De smalle goot met borstwering langs de westkant van de noordarm van het transept (3D BAG-vlak op +24,8) valt binnen het dakvlak van het transept en is niet apart gemodelleerd.
- De lijsten en waterlijsten op de toren en de muren zijn weggelaten; de hoeksteunberen van de toren zijn als blokken met schuine versnijdingen gemodelleerd.

## Controle

De generator controleert de geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden. Het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 120 × 120 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject; het volume is gelijk aan dat van een export zonder steun. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote Kerk (Veere)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Veere))
- [Rijksmonumentenregister 36967](https://monumentenregister.cultureelerfgoed.nl/monumenten/36967)
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Grote_Kerk_(Veere)): RCE 20396704, 20270402, 20270405, 20270406, 20270407, 20270414, 20379806; "2022 Grote Kerk, Veere" (1 tot 3); "2026 Grote Kerk, Veere" (1 en 2); "Veere Grote Kerk 1" en "3"
- BAG-pand 0717100000020522 en de [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0717100000020522) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
