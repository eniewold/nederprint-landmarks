# Sint-Pancratiuskerk (Diever)

Protestantse kerk aan de Hoofdstraat in Diever (gemeente Westerveld), rijksmonument 12902 en een van de oudste kerken van Drenthe. Op de plek van een houten kerk kwam een tufstenen romaanse kerk met een vrijstaande toren; later volgden een bakstenen kerk tegen de toren, in de veertiende eeuw het gotische veelhoekige koor en in de zestiende eeuw de zijbeuken, waardoor de romaanse (later verhoogde) toren aan drie zijden werd ingebouwd. Na een blikseminslag in 1759 werd de kerk hersteld (gedenksteen boven de zuidingang); in 1959 volgde een grondige restauratie. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-panden 1701100000210598 (kerk, bouwjaar 1790 in de BAG) en 1701100000237458 (toren). Geen buurpand raakt de kerk.
- STL op 1:1000: circa 38,9 × 20,3 × 38,0 mm.
- Genereren: `node scripts/generate-sint-pancratiuskerk-diever.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (217622,89; 541346,97), lat/lon 52,855674 / 6,316935, op de hoofdnok halverwege het schip op maaiveld (NAP +11,25 m volgens het AHN-DTM rond de kerk). +X loopt langs de nok van de toren naar het koor, onder 6,1 graden in RD (`xAxis` [0,99434; 0,10626]); +Y wijst naar het noorden. De zuid- en noordgevel lopen in de BAG-contour op 0,05 m na evenwijdig aan die as. `groundHeight` 53,05 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (zuidwest); de andere punten liggen tot 0,14 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Middenschip en noordbeuk**: één zadelkap met de nok op +16,82 m; het zuidvlak loopt onder 50 graden naar de kilgoot met de zuidbeuk (+11,1 m), het noordvlak onder 48 graden door over de noordbeuk tot de lage goot op +6,5 m (hellingen met kleinste kwadraten uit het AHN-DSM). Vier steunberen en twee schuine hoeksteunberen tegen de noordgevel, vensters tot onder de goot en de noordingang.
- **Zuidbeuk (XVI)**: eigen zadeldak evenwijdig aan de hoofdkap, nok +13,35 m, goot +11,1 m, met de westgevel als topgevel met groot spitsboogvenster en pinakel. Vijf steunberen (BAG) tot vlak onder de goot, hoge spitsboogvensters en in de derde travee het portaal met de dubbele deur en een korter venster erboven. De oostsluiting (Mariakapel) is driezijdig met een schilddak, steunberen op de hoeken en smalle vensters.
- **Koor (XIV-XV)**: de hoofdkap loopt door tot het nokeinde op 14,6 m oost van de oorsprong; driezijdige sluiting (BAG, symmetrisch gemaakt) met schilddakvlakken van 57 graden vanaf de goot op +11,1 m, een dakkapel in het oostvlak, steunberen op de zijwanden en de hoeken en hoge vensters in de zuidwand en de drie zijden van de sluiting. Schoorsteen op het noordvlak bij het koor.
- **Aanbouw tegen het koor**: lessenaarsdak van +8,3 m tegen de noordwand van het koor tot +3,2 m (AHN).
- **Toren**: 6,76 × 6,56 m (BAG), onderbouw tot een waterlijst op +17,7 m en een 0,15 m teruggelegde bovengeleding tot +21,8 m. Westzijde met deur en hoog rondboogvenster; in de bovengeleding per zijde een galmgat en op de west-, zuid- en oostzijde een uurwerk. Traptoren tegen de noordoosthoek (BAG) met een lessenaarsdak tot +14,4 m. De leien spits staat op een goot van +22,2 m (kraag van 49 graden onder het overstek), zwenkt uit tot een knik op +23,0 m en loopt met vier vlakken naar de top op +36,0 m; de makelaar reikt tot +37,6 m (hoogste AHN-punt +37,65 m).
- **Plint** van 0,15 m rondom tot +0,9 m.

## Geschat

- De hoogtes van de waterlijst (+17,7 m), de goot van de spits en de knik zijn uit de verhoudingen op de westfoto van de RCE geschaald op het AHN (torenrand +22,0 tot +22,4 m). De top van de leien spits (+36,0 m) volgt uit de helling van de spitsvlakken in het AHN; de makelaar erboven is een stang van 0,9 m tot het hoogste AHN-punt.
- Vensterbreedtes en -hoogtes, de deuren, de galmgaten, de uurwerken, de steunberen (0,8 tot 1,0 m breed, hoogte uit de foto's), de pinakel, de dakkapel en de schoorsteen zijn uit foto's van Commons en de RCE geschat. De noordingang is uit de oude RCE-foto van de noordgevel geplaatst.
- De sluitingen van koor en Mariakapel zijn symmetrisch gemaakt; de BAG-contour wijkt tot 0,3 m af.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden), de uurwerken en de oculus in de westgevel van de noordbeuk ruitvormige nissen, voor print zonder steun. Het maaswerk, de wijzerplaten zelf, het windhaantje en kruis, het luikje in de spits, regenpijpen, lantaarns en de dakgoten zijn weggelaten (kleiner dan 0,9 m).
- Het rechthoekige venster van de aanbouw (vlak plafond) is weggelaten.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Het dakoppervlak ligt op 92 % van een raster van 1 m binnen 1 m van het AHN-DSM (mediaan 0,20 m). Een export op 1:1000 met steun v2 van een uitsnede van 100 × 100 m bevat het model, zonder de twee PDOK-panden en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Sint-Pancratiuskerk (Diever)](https://nl.wikipedia.org/wiki/Sint-Pancratiuskerk_(Diever))
- [Rijksmonumentenregister 12902](https://monumentenregister.cultureelerfgoed.nl/monumenten/12902)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Pancratiuskerk_(Diever)) (RCE 20397439, 20322637, 20057411, 20057442; 20210419 Sint Pancratiuskerk1/2 Diever; P1020296)
- BAG panden 1701100000210598 en 1701100000237458 (voetafdruk)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
