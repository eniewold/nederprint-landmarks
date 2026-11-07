# Grote Kerk (Leerdam)

Laatgotische kruiskerk aan de Kerkstraat (rijksmonument 24039), gebruikt door de Protestantse Gemeente Leerdam. Onderbouw van de toren uit de tweede helft van de 13e eeuw (romaans), in de 15e eeuw verhoogd; koor, sacristie en zuidtransept uit de eerste helft van de 15e eeuw; een breder noordtransept begin 16e eeuw; het pseudobasilicale schip met drie beuken en het zuidportaal rond 1550. Bij de restauratie van 1954-1960 is de neogotische verbouwing van 1862-1865 teruggedraaid en kregen de toren een nieuwe spits en borstwering; het noordportaal en de traptoren naast het zuidportaal zijn toen gereconstrueerd. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0545100000345310 (kerk, toren, sacristie en portalen zijn één pand; er staan geen andere panden tegen de kerk).
- STL op 1:1000: circa 51,5 × 30,5 × 34,1 mm.
- Genereren: `node scripts/generate-grote-kerk-leerdam.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (134751,223; 433659,204), lat/lon 51,891086 / 5,093054, op de viering op de as van het schip, op maaiveld (NAP +2,4 m). +X loopt langs de nok van schip en koor van toren naar koor, onder 18,2 graden in RD (`xAxis` [0,94997; 0,31233]); +Y wijst naar het noordtransept. De noord- en zuidgevels van het schip lopen in de BAG-contour evenwijdig aan die as (18,1 en 18,3 graden) en de nok ligt er in het AHN-DSM recht op. `groundHeight` 45,75 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (aan de noordkant, bij het noordtransept; het marktplein aan de zuidkant ligt circa 0,8 m hoger). `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip (ca. 1550)**: 19,1 m breed (BAG), drie beuken onder één zadeldak: nok +18,8 m, helling 1,23 (51 graden; vlakfit op het AHN-DSM: zuid 1,247, noord 1,216), goot circa +7,0 m. Aan de zuidkant loopt het dak door tot het zuidtransept en is het daar afgewolfd. Westgevel als topgevel met een rand boven het dak aan weerszijden van de toren. Steunberen op de noord- en zuidgevel volgens de BAG-contour, vier spitsboogvensters per zijde, een venster in elke zijbeukgevel in het westen, plint.
- **Koor (15e eeuw)**: 9,7 m breed, vijfzijdige sluiting (5/10, straal 4,85 m), steiler en hoger dak dan het schip: nok +19,4 m, goot +12,0 m (helling 1,53; AHN 1,46 en 1,60), sluiting met dakvlakken van helling 1,60 (AHN 1,635) naar het nokeinde boven het midden van de sluiting. Hoge plint tot +2,6 m met een afzaat, getrapte steunberen op de vier hoeken van de sluiting en op de noordwand (BAG), vijf hoge spitsboogvensters in de sluiting, drie in de noordwand en twee boven de sacristie.
- **Noordtransept (begin 16e eeuw)**: 9,2 m breed tot 16,6 m uit de as, nok +15,2 m (helling 1,57), topgevel met verhoogde rand en groot spitsboogvenster, vensters in de zijwanden.
- **Zuidtransept (15e eeuw)**: 6,9 m breed, gevel op 12 m uit de as, nok +13,5 m (helling 1,58), topgevel met groot spitsboogvenster.
- **Zuidportaal (ca. 1550)** met topgevel (nok +10,8 m), spitsboogdeur en venstertje; ernaast de ronde **traptoren** (r 1,05 m) met kegeldak tot +8,65 m.
- **Noordportaal** (reconstructie) met topgevel tot +7,1 m en deur.
- **Sacristie (15e eeuw)** tegen de zuidkant van het koor: zadeldak met de nok dwars op het koor (+11,5 m, helling 1,6), topgevel met rand, diagonale hoeksteunberen, twee spitsboogvensters en een oculus in de gevel, een venster in de oostwand. Tussen sacristie en zuidtransept een lage platte tussenbouw (+3,3 m).
- **Toren**: ingebouwd in de westgevel, 6,55 × 7,45 m (AHN), met twee getrapte steunberen op de westgevel (BAG, 2,6 m diep, tot +14 m), spitsboogdeur, venster en een klein rechthoekig licht erboven. Boven het dak twee galmgaten naast elkaar op noord, west en zuid, een fries van vijf blinde rondbogen op elke zijde, een kraag en een borstwering met zes boogjes per zijde tot +24,2 m (AHN), daarbinnen een goot en het tentdak naar de vierkante lantaarn (2,4 m) met een uurwerk op vier zijden, kroonlijst en de vierzijdige naaldspits tot +33,7 m (hoogste AHN-punt NAP +36,1 m).

## Geschat

- Hoogtes van galmgaten, boogfries en borstwering (+17,8 tot +24,2 m) en de verdeling tentdak/lantaarn/spits (+26,9, +29,1, +29,45 m) zijn uit de verhoudingen op de foto "Toren Grote Kerk" en de RCE-foto's geschat, geschaald op de gemeten borstwering en spitstop. De torenbreedte komt uit het AHN-DSM (de bovenkant van de borstwering); de onderbouw is even breed aangenomen.
- Vensterbreedtes en -hoogtes (schip 1,9 m, koor 1,6 m, transepten 2,4 en 2,6 m), de steunbeerhoogtes en de trappen van de torensteunberen zijn uit foto's geschat. Het noordportaal (nok +7,1 m) en de traptoren zijn uit het AHN en de luchtfoto afgeleid, hun vorm uit foto's.
- Het nokeinde van de koorsluiting ligt op het middelpunt van de vijfzijdige sluiting; het AHN geeft daar u = 21,5 tot 21,7 m.

## Weggelaten of vereenvoudigd

- Rondbogen en spitsbogen zijn spitse blinde nissen (58 graden) voor print zonder steun; galmgaten en lantaarn zijn dicht.
- De natuurstenen speklagen van koor en sacristie (een kleur, geen reliëf), het maaswerk, de vier urnen op de hoeken van de borstwering, de bol en windvaan op de spits, de kruisjes en pinakels op de topgevels en de dakgoten en regenpijpen (alle kleiner dan 0,9 m).
- Het dak boven de viering is niet apart gemodelleerd: het koordak loopt tot de westwand van het noordtransept door, zoals de nokstap in het AHN laat zien.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 90 × 90 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject (modelvolume gelijk met en zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote Kerk (Leerdam)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Leerdam))
- [Rijksmonumentenregister 24039](https://monumentenregister.cultureelerfgoed.nl/monumenten/24039)
- [Reliwiki: Leerdam, Kerkstraat 32 - Grote Kerk](https://reliwiki.nl/index.php/Leerdam,_Kerkstraat_32_-_Grote_Kerk)
- [Archimon: Leerdam, hervormde kerk](https://archimon.nl/utrecht/leerdamherv.html)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Grote_Kerk,_Leerdam) (RCE 20129943 tot 20129973, 20129986, 20129987, 20376510; "Toren Grote Kerk"; WLM mchangsp)
- BAG pand 0545100000345310 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0545100000345310) (dakvlakken ter controle)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
