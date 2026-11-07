# Grote Kerk (Vianen)

Protestantse kruiskerk aan de Voorstraat, gewijd aan Maria ten Hemelopneming. De westtoren is van de eerste helft van de veertiende eeuw en werd rond 1540 met een vijfde geleding verhoogd; de koren zijn van de veertiende en vijftiende eeuw. Na de stadsbrand van 1540 herbouwde Cornelis Frederiksz. van der Gouwe schip en dwarsschip volgens het Haagse halletype: een langskap over het middenschip en per zijbeuk drie dwarskappen met een topgevel naar buiten. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0620100000008628 (kerk, toren, koren, consistorie en portaal zijn één pand). Geen buurpand raakt de kerk.
- STL op 1:1000: circa 62,9 × 44,7 × 40,7 mm.
- Genereren: `node scripts/generate-grote-kerk-vianen.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (134835,83; 444931,62), lat/lon 51,992407 / 5,093622, op de kruising van de nokken van schip en dwarsschip op maaiveld (NAP +3,5 m). +X loopt langs de nok van de toren naar het koor, onder 15,5 graden in RD (`xAxis` [0,96363; 0,26724]); +Y wijst naar de noordzijde. De gevels lopen in de BAG-contour evenwijdig aan die as en de nokken liggen er in de 3D BAG en het AHN-DSM op. `groundHeight` 46,82 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (west van de toren); naar het oosten en zuiden loopt het maaiveld tot 0,5 m op. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip (Haags halletype)**: langskap over het middenschip van de toren tot de koorsluiting, 9,9 m breed, nok +19,35 m, goot circa +13,5 m (3D BAG en AHN). Per zijbeuk drie dwarskappen van 7,85 m breed (kilgoten op gelijke afstand, de 3D BAG-nokken liggen er tot 0,35 m naast), nok +19,3 en goot +13,6 m, met een topgevel naar buiten: iets verhoogde gevelrand, topstuk, groot tweelichtvenster en oculus. De westelijke traveeën (korter dan een travee) hebben een langsnok met een topgevel naar het westen naast de toren, met venster, en een venster in de langsgevel. Dakkapel op beide westdaken. Steunberen tussen de traveeën en op de westhoeken.
- **Dwarsschip**: 10,2 × 42,7 m, nok +19,3 m langs de kruisarmen, kopgevels noord en zuid met verhoogde rand, topstuk, groot venster en oculus, hoeksteunberen op beide gevelhoeken, vensters in de vrije delen van de west- en oostwanden en de schoorsteen tegen de oostwand van de zuidarm.
- **Hoofdkoor**: zelfde langskap als het schip, vijfzijdige sluiting (BAG) met schilddakvlakken vanaf het nokeinde op 18,8 m oost van de oorsprong, steunberen op de hoeken en vensters in elke zijde van de sluiting en in de vrije noordwand.
- **Zijkoren (XV B)**: lager, nok +13,5 m, met veelhoekige sluiting onder een schilddak (de hoekpunten uit de BAG), vensters en steunberen. Het noordelijke dakvlak van het noordkoor loopt door over de lage aanbouw ernaast (goot +5,4 m, 3D BAG).
- **Consistorie**: in de hoek tussen zuidkoor en hoofdkoor, schilddak met goot +5,2 en nok +9,3 m tegen de koormuur, twee vensters.
- **Noordportaal (midden XIV)**: zadeldak met nok +8,4 m en een trapgevel naar het noorden (treden van 0,8 m), deur en venster.
- **Toren**: 7,6 × 7,75 m (BAG), vijf geledingen met waterlijsten (0,1 m terugliggend per geleding) en een fries van blinde boogjes onder elke lijst (vergroot tot 1 m), in de bovenste geleding drie hoge spitsboognissen per zijde (de middelste dieper, als galmgat). Westingang, de bogen van het torenportaal in de noord- en zuidwand en een venster in de tweede geleding. Kroonlijst, plat dak +29,5 m (3D BAG), gesloten borstwering tot +30,9 m met acht pinakels tot +32,6 m, achtkante leien helm tot +34,7 m, lantaarn met kroonlijst en koepeltje, makelaar tot +40,3 m (hoogste AHN-punt +40,1 m; Reliwiki geeft 41 m met windvaan).

## Geschat

- Vensterbreedtes en -hoogtes, oculi, steunberen (1,0 × 1,0 tot 1,1 m, tot +9 m), de trapgevel van het portaal en de topstukken zijn uit de foto's van de RCE en Commons geschat. De dakkapellen zijn uit de foto van de noordgevel en de luchtfoto geplaatst.
- De hoogtes van de geledingen van de toren (+7,4, +12,6, +18,0, +23,6 m) en de friezen zijn uit de verhoudingen op de foto's geschat, geschaald op het gemeten dak (+29,5) en de borstwering (AHN +30,5 tot +31). De helm (achtkant, 5,0 m breed aan de voet), de lantaarn (1,5 m) en het koepeltje komen uit foto's van onderaf; de vlaggenmasten rond de lantaarn vertekenen het AHN daar.
- De sluiting van het hoofdkoor is symmetrisch gemaakt; de BAG-contour wijkt aan de noordkant tot 0,4 m af.

## Weggelaten of vereenvoudigd

- Vensters, deuren, boogfriezen en galmgaten zijn blinde nissen met een spitse top (58 graden) of een ruitvormige oculus voor print zonder steun; het maaswerk, de opengewerkte borstwering van de toren (dicht gemodelleerd) en de open lantaarn (dicht) zijn vereenvoudigd.
- De kleine boogjes van de rondboogfriezen (circa 0,6 m) zijn vergroot tot nissen van 1 m; de wijzerplaten, de windhaan, de vlaggen, de bol op de makelaar (hals onder 0,9 m), regenpijpen en de natuurstenen hoekblokken (kleiner dan 0,9 m of zonder reliëf).
- Een dakruiter die op een oude RCE-foto op het schip lijkt te staan, is niet op recente foto's en niet in het AHN te zien (niets boven +19,5 m op de nokken) en is weggelaten.
- Het torenportaal is niet doorgaand: de bogen in de noord- en zuidwand zijn diepe nissen (0,9 m).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Het dakoppervlak ligt op 90 % van een raster van 1 m binnen 1 m van het AHN-DSM (mediaan 0,24 m); de afwijkingen liggen op gevellijnen en bij de vlaggen op de toren. Een export op 1:1000 met steun v2 van een uitsnede van 100 × 100 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia (de): Grote Kerk (Vianen)](https://de.wikipedia.org/wiki/Grote_Kerk_(Vianen))
- [Reliwiki: Vianen, Voorstraat 110 - Grote Kerk](https://reliwiki.nl/index.php/Vianen,_Voorstraat_110_-_Grote_Kerk)
- Rijksmonumentenregister: [37389 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/37389) en [37388 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/37388)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Vianen) (RCE 20300603, 20300604, 20300607, 20300610, 20300611, 20300613, 20241799; DSCF8567 tot DSCF8573; panoramio 2015)
- BAG pand 0620100000008628 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0620100000008628) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
