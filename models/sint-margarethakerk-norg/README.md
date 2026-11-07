# Sint-Margarethakerk (Norg)

Protestantse kerk aan de Kerkbrink in Norg (gemeente Noordenveld), rijksmonument 30783, gewijd aan Margaretha van Antiochië. De romaanse westtoren met zadeldak is halverwege de dertiende eeuw (circa 1260) als eerste gebouwd; daarna volgde in fasen de rest: een eenbeukig schip in dezelfde stijl (lisenen en kleine rondboogvensters), later verhoogd, en een romanogotisch koor met meloengewelf en vijfzijdige sluiting dat altijd in de oorspronkelijke staat is gebleven. De negentiende-eeuwse spitsboogvensters zijn bij de restauratie van 1969 tot 1971 weer rondboogvensters geworden. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1699100000028356 (toren, schip, koor en de kleine noordelijke aanbouw zijn één pand). Geen buurpand raakt de kerk.
- STL op 1:1000: circa 35,2 × 14,6 × 24,5 mm.
- Genereren: `node scripts/generate-sint-margarethakerk-norg.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (227008; 564920,5), lat/lon 53,066314 / 6,461460, midden in het schip op maaiveld (NAP +10,15 m). +X loopt langs de nok van de toren naar het koor, onder 2 graden in RD (`xAxis` [0,99939; 0,0349]); +Y wijst naar de noordzijde. De lange gevels van schip en koor lopen in de BAG-contour onder 1,3 tot 2,3 graden; de nok ligt in het AHN-DSM en de 3D BAG evenwijdig aan die as. `groundHeight` 51,36 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (zuidkant); aan de noordkant ligt het maaiveld tot 0,35 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip, koor en sluiting**: één doorlopend zadeldak, nok +13,9 m (NAP +24,05) op 0,1 m ten noorden van de as, helling 1,08 (47 graden) aan beide zijden (AHN-dwarsprofielen; 3D BAG 1,07 tot 1,11). Het schip (BAG 17,2 × 12,3 m) heeft goten op +7,3 m; het koor is smaller (8,9 m) onder hetzelfde dakvlak en heeft dus hogere goten (+9,2 m). De sluiting is een halve regelmatige achtkant (de BAG-hoekpunten liggen op 0,1 tot 0,2 m van die vorm) met drie dakschilden tot het nokeinde op u = 14 m, zoals in de 3D BAG en op de oostfoto.
- **Goten** met een kraag van 47 graden langs schip, koor, sluiting en toren.
- **Schip, romaans westdeel**: hoeklisenen en drie smalle lisenen per zijgevel met een versnijding op +2,2 m en tussen de lisenen hoge smalle nissen; aan de oostkant van dat deel een zware steunbeer (zuid op 4,45 m, noord op 1,6 m ten westen van de oorsprong) met een schuine afdekking. In het oostdeel van het schip per zijgevel een rondboogvenster in een omlijsting en een deur (zuid, naar het pad op de luchtfoto; noord tegen het koor). De westgevel naast de toren heeft aan beide kanten een hoekbeer en een klein venster.
- **Koor en sluiting**: één hoog rondboogvenster in een omlijsting in elke zijgevel en in elk van de drie vlakken van de sluiting; platte steunberen met een versnijding op de vier hoeken van de sluiting.
- **Noordelijke aanbouw** (BAG): 1,7 × 1,5 m tegen de noordgevel, plat dak op +2,55 m (AHN 2,5 tot 2,6), deur aan de oostkant.
- **Plint** van 0,15 m rondom tot +0,5 m.
- **Toren**: 5,5 × 5,65 m (BAG); onderste geleding tot +5,4 m springt 0,12 m voor; zadeldak met de nok langs de as op +23,75 m (AHN 23,5 tot 23,8 m, 3D BAG NAP +34,1) en een helling van 1,95 (63 graden), goten op +18,25 m; topgevels aan de west- en oostkant 0,45 m dik en 0,3 m boven het dak tot +24,05 m, met schouderstukken die 0,3 m buiten de zijgevels steken. Westdeur met boogomlijsting, het witte tweelingvenster als nis aan de west-, noord- en zuidkant, galmgaten aan alle vier de zijden en een spleet in beide topgevels.

## Geschat

- De hoogtes van de versnijding van de toren (+5,4 m), het tweelingvenster (+10,6 tot +13,3 m), de galmgaten (+15,0 tot +16,9 m) en de deuren zijn uit de westfoto's (2017, 2020) geschat, geschaald op de nok en goot van de toren in het AHN; door het perspectief van onderaf zijn ze hooguit een halve meter onzeker.
- Plaats en aantal van de lisenen, de nissen ertussen en de zware steunberen zijn uit schuine foto's geschat (geen frontale foto van de zijgevels, en de 0,5 m-AHN ziet ze niet); de lisenen zijn 0,5 m breed en 0,35 m diep. De zuiddeur staat op de plek van het tuinpad op de luchtfoto.
- Vensterbreedtes, sluithoogtes en omlijstingen uit de foto's. De toren is gecentreerd op de BAG-gevels; het AHN legt de nok tot 0,3 m zuidelijker.
- De sluiting is symmetrisch rond de as van het koor gemaakt.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (51 graden) in plaats van een ronde boog, voor print zonder steun; de zuiltjes van de tweelingvensters, glas-in-lood en galmborden zijn weggelaten.
- De wijzerplaten, de makelaar met bol en windhaan op de westgevel, het dakraam in de sluiting, een ventilatiepijp op het schipdak, muurankers en regenpijpen (kleiner dan 0,9 m of zonder reliëf).
- De lage driehoekige steunbeer naast het venster in de noordgevel en de versnijdingen in de westgevel van het schip (kleiner dan 0,5 m reliëf).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Sint-Margaretakerk (Norg)](https://nl.wikipedia.org/wiki/Sint-Margaretakerk_(Norg))
- [Rijksmonumentenregister 30783](https://monumentenregister.cultureelerfgoed.nl/monumenten/30783)
- [Wikidata Q2259829](https://www.wikidata.org/wiki/Q2259829) en [OpenStreetMap way 272777554](https://www.openstreetmap.org/way/272777554)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Margaretakerk_(Norg)) (20171016 Sint-Margaretakerk Norg 1 en 2, 20201125 Sint-Margaretakerk 1 en 2 Norg, RCE 20169934, 20169946, 20169951, 20321855, Margarethakerk Norg2, Norg Kerk, NorgChurch)
- BAG pand 1699100000028356 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1699100000028356) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
