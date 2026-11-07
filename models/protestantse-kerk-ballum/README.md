# Protestantse kerk (Ballum)

De protestantse (hervormde) kerk aan de Camminghastraat in Ballum op Ameland. Het is een sobere zaalkerk uit 1832, gebouwd ter vervanging van de middeleeuwse kerk op het kerkhof aan de Smitteweg, die in 1838 werd gesloopt. De kerk is van baksteen onder een schilddak van rode pannen, met een gootlijst rondom en rondboogvensters. De ingang met een waaiervormig bovenlicht staat in de westgevel tussen twee vensters, met een gedenksteen erboven. Op het westelijke schild zit een kleine dakkapel. Tegen de oostgevel staat een lage aanbouw met een plat dak. De kerk is rijksmonument 7652, vooral om de rijk gesneden preekstoel van 1604 uit Harlingen. De vrijstaande klokkentoren ten zuidwesten (1755, verhoogd in 1870, rijksmonument 7647) is een eigen BAG-pand en hoort niet bij dit model. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters. Het model vervangt BAG-pand 0060100000127831: schip en oostelijke aanbouw zijn samen één pand. Het buurpand in het oosten (0060100000127852) en de klokkentoren (0060100000124515) blijven PDOK; hun PDOK-hoogtes kloppen met het AHN.
- STL op 1:1000: circa 25,5 × 9,7 × 10,0 mm.
- Genereren: `node scripts/generate-protestantse-kerk-ballum.mjs --components`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (174914,56; 606466,66), lat/lon 53,444072 / 5,686907, in het hart van het schip. z = 0 is het laagste maaiveld rond de voet (NAP +3,30 m, aan de zuid- en westkant); aan de noordkant ligt het terrein 0,25 m hoger. +X loopt langs de nok van de westgevel naar de oostgevel, onder 6,81 graden in RD (`xAxis` [0,99294; 0,11858]); +Y wijst naar het noorden. In dat stelsel lopen de BAG-gevels van het schip binnen 3 cm evenwijdig of haaks, en de nok ligt in het AHN op y = 0,01.

`groundHeight` 44,20 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints`, aan de zuidkant. `groundOffsetMetres` is −0,1, de onderkant ligt 0,4 m onder het maaiveld.

## Onderdelen

- **Schip**: 19,4 × 9,0 m (BAG).
- **Schilddak**: vier vlakken, gepast op het AHN-DSM (rms 3 tot 8 cm) en gelijk aan de 3D BAG-dakvlakken. De nok ligt op +9,61 m (NAP 12,91) en loopt van x = −6,77 tot 6,31. De goot ligt op +4,65 m (NAP 7,95) aan alle vier de gevels. De lange dakvlakken hellen 47,7 graden, het westschild 59,5 en het oostschild 55,6 graden: de nok eindigt in AHN en 3D BAG aan de oostkant 0,46 m dichter bij het midden dan aan de westkant.
- **Gootlijst** rondom: een bak 0,35 m buiten de gevels met de bovenkant op +4,5 m (AHN 0,4 m buiten de gevel: NAP 7,8) en een onderkant van 47 graden vanaf +3,78 m tegen de gevel.
- **Vensters**: vier rondboogvensters in elke lange gevel (x = ±2,1 en ±6,3) en twee in de westgevel (y = ±2,45), 1,1 m breed, borstwering +1,4 m, kämpfer +3,1 m, als blinde nissen van 0,35 m met een spitse top tot +3,98 m.
- **Ingang** midden in de westgevel: een nis van 1,4 m breed met een spitse top tot +3,57 m.
- **Dakkapel** op het westschild: 1,0 m breed, de voorkant van +6,3 tot +7,2 m, met een zadeldakje (helling 1,1) en de nok op +7,75 m.
- **Aanbouw** tegen de oostgevel (BAG, 3D BAG en AHN): 5,8 × 4,0 m met een plat dak op +2,93 m (NAP 6,23).

## Geschat

- De vensters, de deur en de dakkapel komen uit de foto's van noordwest (RCE 20345660), zuidwest (RCE 20276225) en de recente foto's op Commons. De hoogtes zijn geschaald op de goot (+4,65 m uit het AHN), de breedtes op de westgevel (9,04 m). De afstand tussen de vensters in de lange gevels (4,2 m, regelmatig verdeeld) is uit de schuine foto's afgeleid.
- De vorm van de gootlijst (uitsteek en onderkant) komt uit de foto's en het AHN-randje buiten de gevel.
- Over de oostgevel en de aanbouw zijn geen goede foto's gevonden. De aanbouw volgt BAG en AHN als een blok met een plat dak; vensters in de oostgevel zijn niet gemodelleerd.

## Weggelaten of vereenvoudigd

- De ronde bogen van de vensters en het bovenlicht van de deur zijn spits gemaakt (58 graden) voor print zonder steun.
- Weggelaten omdat ze kleiner zijn dan 0,9 m of geen reliëf hebben: de twee makelaars (dunne pinnen met een bol) op de nokeinden, het halfronde venster in de dakkapel, de gedenksteen boven de ingang, de tandlijst onder de goot, de regenpijpen, de roeden en het hek met gemetselde pijlers voor de westgevel.
- Een strook van 0,9 m aan de oostkant van het pand die in de 3D BAG bij het dak van het buurpand hoort (tot NAP 10), is in het model het platte dak van de aanbouw; in het AHN ligt daar ook het platte dak.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden. Het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten, doorsneden en de controle op steun onder 45 graden; er komt geen opvulling bij.

Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model. Het PDOK-pand ontbreekt erin, en er is geen opvulling: het volume is gelijk aan dat zonder steun. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's. PDOK heeft hetzelfde schilddak maar geen gootlijst, vensters, ingang en dakkapel.

## Bronnen

- [Rijksmonumentenregister 7652](https://monumentenregister.cultureelerfgoed.nl/monumenten/7652)
- [Wikidata Q4011696](https://www.wikidata.org/wiki/Q4011696)
- [OpenStreetMap way 267926158](https://www.openstreetmap.org/way/267926158)
- [Monumenten in Nederland, Fryslân: Ballum](https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0021.php)
- Foto's op Wikimedia Commons: RCE 20345660 en 20276225, 'Hervormde kerk in Ballum (Ameland).jpg', '2021-10-12-Hervormde kerk Ballum-4911.jpg', 'Ballum Ameland toren kerk.jpg', 'Hervormde kerk Ballum.jpg'
- BAG pand 0060100000127831 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0060100000127831) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m
