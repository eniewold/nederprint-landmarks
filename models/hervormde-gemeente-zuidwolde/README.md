# Hervormde kerk (Zuidwolde)

Hervormde kerk aan de Hoofdstraat (nr. 98) in Zuidwolde, gemeente De Wolden (Drenthe). De kerk is in 1823 gebouwd als neoclassicistische zaalkerk, ter vervanging van een middeleeuwse voorganger. In 1856 liet jhr. H.G. van Holthe tot Echten het oostelijke deel vervangen door een dwarsschip met afgewolfd zadeldak (gevelsteen 11 aug. 1856), waardoor de kerk T-vormig werd. De dakruiter op de westgevel kreeg zijn huidige vorm in 1926. Daarin hangen twee klokken van Willem van Wou uit 1502: alleen die klokken zijn rijksmonument (526039). Het jaartal 1502 in de BAG komt van die klokken; het gebouw zelf is van 1823 en 1856. Aan de westkant liggen een glazen ontmoetingsruimte met plat dak en een zaal met schilddak, die in hetzelfde BAG-pand vallen. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1690100000007702 (kerk, glazen ruimte, entree en zaal zijn één pand). Geen buurpand raakt de kerk.
- STL op 1:1000: circa 45,0 × 30,3 × 23,5 mm.
- Genereren: `node scripts/generate-hervormde-gemeente-zuidwolde.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (225500; 521156), lat/lon 52,6732788 / 6,4295404, in het schip (de nok ligt 3,15 m noordelijker) op maaiveld z = 0 (NAP circa +9,6 m). +X loopt langs de nok van het schip van west naar oost, onder 2,2 graden in RD (`xAxis` [0,99926; 0,03839]); +Y wijst naar het noorden. De gevels van schip en dwarsschip lopen in de BAG-contour onder 2,2 en 91,4 graden, de nok van het schip ligt er in de 3D BAG en het AHN-DSM evenwijdig aan; het dwarsschip is haaks gemaakt (0,8 graden verschil). `groundHeight` 51,88 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de zaal (zuidkant). De kerk zelf staat op een terras met een keermuurtje (NAP +10,6 tot +11,1 m, PDOK 52,6 tot 53,1 m) aan de straat (NAP +10,3 m); dat terras zit in het PDOK-terrein en niet in het model. `groundOffsetMetres` −0,1, onderkant 1,2 m onder z = 0, zodat de voet ook in de verdiepte strook langs de westkant van de zaal (AHN NAP +8,4 m) en onder het terras doorloopt.

## Onderdelen

- **Schip (1823)**: 11,15 × 11,7 m (BAG), zadeldak met nok +13,92 m op de as (3D BAG en AHN 13,95 m; gelijk gemaakt met het dwarsschip) en helling 1,06 (46,7 graden), goten +7,8 m. Het dak loopt door tot de nok van het dwarsschip.
- **Westgevel**: middenrisaliet van 4,4 m breed en 0,3 m voor de gevel, tot een vlakke kroonlijst op +11,9 m (AHN 11,5 tot 12,0 m) waarop de dakruiter staat; daarachter loopt het dak met een klein schild op naar de nok, zoals op de westfoto. Hoog venster in het risaliet, vensters links en rechts.
- **Dwarsschip (1856)**: 12 × 23,2 m (BAG), zadeldak met nok +13,92 m en helling 1,04, goten +7,7 m; beide kopgevels afgewolfd, onderkant van het wolfseind +11,2 m en helling 1,42 (3D BAG 1,39 tot 1,44).
- **Gevels**: plint tot +2,1 m (0,15 m), lisenen van 0,9 m op de hoeken en tussen de vensters, gootlijsten van 0,25 m langs de lange gevels; rondboogvensters als nis met spitse top: drie in de noordgevel en twee in de zuidgevel van het schip, vijf in de oostgevel van het dwarsschip, één in elk deel van de westgevel van het dwarsschip naast het schip, en in de kopgevels drie vensters naast elkaar met de deur onder het middelste en een venster in de top.
- **Schoorsteen** op het noordelijke dakvlak bij de westgevel tot +10,8 m (AHN-piek 2,4 m boven het dakvlak; foto vanuit het noordwesten).
- **Dakruiter (1926)**: vierkant leien lichaam van 3,0 m tot +15,7 m, lijst, galmgeleding van 3,1 m met drie galmgaten per zijde tot +17,9 m, overstekende kroonlijst van 3,7 m op +18,2 m (AHN 18,2), ingesnoerde voet en achtkante naaldspits tot +22,3 m.
- **Glazen ontmoetingsruimte**: BAG-contour met de ronde westkant, plat dak +4,6 m (AHN), lichtkoepel op het dak; glazen entree aan de noordkant +4,1 m.
- **Zaal**: 19,0 × 9,4 m onder 8,7 graden met de kerk (BAG), schilddak met helling 1,0, goot +4,85 m en nok +9,57 m (3D BAG), gootlijst rondom, dakraam-opbouw op het westelijke schild.

## Geschat

- De maten van de dakruiter boven de kroonlijst (+18,2 m, AHN) en de lijst op +15,7 m zijn uit de verhoudingen op de foto's (west, noordwest, noordoost) geschat, geschaald op de breedte van de kroonlijst in het AHN (3,6 tot 3,7 m). De spits is 4,1 m hoog aangenomen; de PDOK-reconstructie komt tot +21,8 m, de foto's geven 3,6 tot 4,6 m boven de kroonlijst.
- Vensterbreedtes en -hoogtes, de deur, de lisenen, de plint en de gootlijsten zijn uit de foto's geschat. De vensters van de zuidgevel van het schip en de zuidelijke kopgevel van het dwarsschip zijn naar de noordkant en de oude foto (RCE 20225901) aangenomen.
- De lichtkoepel staat iets verschoven (0,7 m) ten opzichte van de luchtfoto, zodat hij los blijft van de goot van de zaal. De opbouw op het westelijke schild van de zaal is naar de luchtfoto en de foto vanuit het westen geplaatst en geschat.
- Waar de glazen ruimte tegen de zaal ligt, loopt haar contour 0,5 m de zaal in (in de BAG raken ze elkaar alleen langs een wand).

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden) in plaats van rondbogen; roeden, galmborden en wijzerplaten zijn weggelaten.
- Stijlen en daklijst van de glazen ruimte en de entree (kleiner dan 0,9 m); ze zijn een gesloten volume.
- De bol, het kruis en de windhaan op de spits, de regenpijpen, het hekwerk en de keermuur van het terras (kleiner dan 0,9 m of onderdeel van het terrein).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Rijksmonumentenregister 526039](https://monumentenregister.cultureelerfgoed.nl/monumenten/526039) (klokken in de dakruiter)
- [Monumenten in Nederland, Drenthe (DBNL): Zuidwolde](https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0109.php) (bouwgeschiedenis)
- [OpenStreetMap way 277380567](https://www.openstreetmap.org/way/277380567)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_(Zuidwolde,_Drenthe)) (RCE 20225901; Zuidwolde - Hervormde Kerk - 2014; Súdwâlde, protestantske tsjerke; IMG 3947 2018)
- BAG pand 1690100000007702 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1690100000007702) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
