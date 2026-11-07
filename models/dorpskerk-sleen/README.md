# Dorpskerk (Sleen)

Hervormde kerk, ook Grote Kerk genoemd, aan de Brink (nr. 7) in Sleen: een driebeukige gotische hallenkerk uit 1420-1450 met kruisgewelven en een vijfzijdig gesloten koor, dat het oudste deel is en rond 1500 werd verhoogd. De westtoren met zijn naaldspits is met circa 64 m de hoogste toren van Drenthe; de spits werd in 1703 vernieuwd en stortte in 1705 in. In 1880 stortte het dak deels in, waarna C.H. Peters de kerk in 1882-1883 restaureerde; bij de restauratie van 1962-1966 kwam de consistorie aan de zuidkant erbij. Kerk (33779) en toren (33780) zijn rijksmonumenten. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0109100000000807 (schip, koor, toren, consistorie en tussenlid zijn één pand). Geen buurpand raakt de kerk.
- STL op 1:1000: circa 39,9 × 23,8 × 59,9 mm.
- Genereren: `node scripts/generate-dorpskerk-sleen.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (250516; 533017), lat/lon 52,776029 / 6,802740, op de as van het schip op maaiveld (NAP +18,3 m). +X loopt van de toren naar het koor, onder 23,75 graden in RD (`xAxis` [0,91531; 0,40275]); +Y wijst naar de noordzijde. De gevels van schip, koor en toren lopen in de BAG-contour onder 23,7 tot 23,8 graden. `groundHeight` 60,18 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (de weg ten westen van de toren); elders ligt het PDOK-maaiveld tot 0,5 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip en koor**: één zadeldak over de hallenkerk en het koor, nok +18,15 m op 0,17 m ten zuiden van de as, helling 1,335 (53 graden) aan beide zijden (3D BAG-dakvlakken 1,33 en 1,34, nok NAP +36,45; AHN-dwarsprofielen). Het schip is 14,25 m breed met goten op +8,4 m (zuid) en +8,9 m (noord); het koor is smaller (11,0 m) onder hetzelfde dakvlak, dus met hogere goten (+11,1 en +10,5 m). De vijfzijdige sluiting (twee zijwanden en drie vlakken, oostwand 6 m breed) heeft drie schilden met helling 1,45 vanaf +10,6 m (3D BAG 1,43 tot 1,47).
- **Steunberen**: de BAG-uitsprongen langs schip en koor (drie per zijde en één op de overgang naar het koor aan de noordkant), de diagonale hoekberen aan de westkant van het schip en op de hoeken van de sluiting, 1,0 tot 1,2 m breed, met twee waterlijsten van 45 graden en een schuin afgedekte top tot 0,6 m onder de goot.
- **Vensters**: spitsboogvensters tussen de steunberen (vier per langsgevel van het schip, één per zijwand van het koor, één in elk vlak van de sluiting).
- **Dakkapellen en schoorsteen**: een dakkapel met zadeldakje op het zuidelijke dakvlak en een op het oostschild van het koor, en de schoorsteen op de nok (foto's uit het zuidwesten, oosten en noordoosten; luchtfoto).
- **Consistorie** (1962-1966, BAG en 3D BAG): 4,4 × 5,9 m ten zuiden van het koor, zadeldak noord-zuid met nok +6,5 m en puntgevels, deur in de zuidgevel en een venster in elke zijgevel; verbonden met het schip door een smal tussenlid onder het doorgezette dakvlak van het schip.
- **Plint** van 0,2 m rondom tot +0,6 m.
- **Toren**: 8,5 × 9,5 m (BAG), drie geledingen met terugsprongen van 0,15 m op +10,5 en +19,6 m, westdeur met een groot spitsboogvenster erboven, drie hoge blindnissen per geleding op elke zijde (oostkant alleen boven het dak), een galmgat in de middelste nis van de bovenste geleding, en een kraag van 45 graden onder de muurplaat op +29,0 m (AHN-randen 29 tot 31 m met de voet van de spits).
- **Spits**: ingezwenkte voet van de muurplaat naar een achtkant van 7,0 m op +30,6 m, dan de achtkante naald tot +59,5 m. Op de voet staan vier uurwerkfrontjes (2,0 m breed, zadeldakje tot +32,9 m) in het vlak van de muurplaat, zoals op de foto's.

## Geschat

- De hoogtes van de banden van de toren (+10,5 en +19,6 m) en de muurplaat (+29,0 m) zijn uit de verhoudingen op de westfoto (RM 33780 Kerktoren van Sleen) geschat en tegen de AHN-randen van de torenkop gecontroleerd.
- De top van de naald (+59,5 m) is geëxtrapoleerd: het AHN-DSM meet +56,5 m op 0,35 m van de as bij een helling van circa 10; Wikipedia noemt 64 m inclusief kruis en haan. Het profiel van de ingezwenkte voet is uit de foto's geschat en tegen het DSM gelegd.
- Vensterbreedtes en -hoogtes, de deuren, de waterlijsten van de steunberen, de nissen van de toren, de uurwerkfrontjes en de maten van de dakkapellen (1,2 en 1,4 m breed) en de schoorsteen zijn uit foto's geschat.
- De sluiting van het koor is symmetrisch gemaakt rond de as; de BAG wijkt tot 0,5 m af.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden); maaswerk, galmborden en wijzerplaten zijn weggelaten.
- Kruis en windhaan op de naald (kleiner dan 0,9 m), het kruis op het koordak, regenpijpen, goten en muurankers.
- Dakramen op het noordelijke dakvlak (op de luchtfoto vage lichte vlekken, kleiner dan 0,9 m en zonder reliëf in het AHN).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Kerk van Sleen](https://nl.wikipedia.org/wiki/Kerk_van_Sleen)
- Rijksmonumentenregister: [33779 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/33779) en [33780 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/33780)
- [Wikidata Q17440827](https://www.wikidata.org/wiki/Q17440827)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Sleen) (RCE 20200481 tot 20200493 en 20322183; Kerk Sleen, Kerk Sleen2, 33779 Hervormde Kerk, 33780-Hervormde kerk toren, RM 33780 Kerktoren van Sleen, Sleen Hervormde kerk 2014)
- BAG pand 0109100000000807 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000000807) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
