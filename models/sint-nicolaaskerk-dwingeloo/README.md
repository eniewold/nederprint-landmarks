# Sint-Nicolaaskerk (Dwingeloo)

Hervormde dorpskerk aan de Brink (nr. 29), gotisch en uit de tweede helft van de vijftiende eeuw: een eenbeukig schip en een smaller koor met driezijdige sluiting onder één zadeldak, en een westtoren die mogelijk de oudste gotische toren van Drenthe is. De uivormige spits ('siepel') kwam er in 1631, op initiatief van drost Rutger van den Boetzelaer van de havezate Batinge, nadat de vorige spits was ingestort. Na de dorpsbrand van 1923 is de kerk hersteld onder Jans Boelens. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1701100000203584 (schip, koor, toren en noordelijke aanbouw zijn één pand). Geen buurpand raakt de kerk.
- STL op 1:1000: circa 34,4 × 16,6 × 35,0 mm.
- Genereren: `node scripts/generate-sint-nicolaaskerk-dwingeloo.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (220922; 539080), lat/lon 52,834912 / 6,365453, op de as van het schip op maaiveld (NAP +9,8 m). +X loopt langs de nok van de toren naar het koor, onder 11 graden in RD (`xAxis` [0,98163; 0,19081]); +Y wijst naar de noordzijde. De gevels van schip en koor lopen in de BAG-contour onder 10,9 tot 11,2 graden en de nok ligt er in de 3D BAG en het AHN-DSM evenwijdig aan. `groundHeight` 51,73 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (oostkant); aan de west- en noordkant ligt het maaiveld tot 0,45 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip en koor**: één zadeldak, nok +15,75 m op 0,85 m ten noorden van de as, helling 1,40 (54,5 graden) aan beide zijden (AHN-dwarsprofielen; 3D BAG 1,41 tot 1,43). Het schip is 11,4 m breed (zuidgevel tot naast de toren, noordgevel tot de oostwand van de toren), goten +7,4 m (zuid) en +8,1 m (noord). Het koor is smaller (9,1 m) onder hetzelfde dakvlak, dus met hogere goten (+8,9 en +9,9 m, zoals op de foto's), en sluit driezijdig onder 45 graden met de dakvlakken van de sluiting vanaf +9,3 m.
- **Steunberen**: de zeven uitsprongen van de BAG langs de gevels en de diagonale hoekberen van schip, sluiting en aanbouw, 0,9 m breed, met een waterlijst op +2,4 m en een leien kapje (zadeldakje haaks op de gevel) dat boven de goot uitsteekt, zoals op de foto's.
- **Vensters en deuren**: spitsboogvensters tussen de steunberen (drie in de zuidgevel van het schip, twee in de zuidgevel van het koor, één in elk vlak van de sluiting, twee per noordgevel van schip en koor), de zuidingang aan de westkant met een spitsboognis erboven, en de deur in de zuidwand van het koor.
- **Noordelijke aanbouw** (kapel/consistorie, BAG en 3D BAG): 5,9 × 3,6 m tegen de noordgevel, zadeldak dwars op het schip met nok +11,3 m die in het dakvlak van het schip doorloopt, noordeinde afgewolfd, diagonale hoekberen.
- **Dakkapel** met zadeldakje op de noordkant van het koordak (foto's uit het noordoosten en zuidoosten, luchtfoto).
- **Plint** van 0,2 m rondom tot +0,7 m.
- **Toren**: 5,1 × 5,9 m (BAG), drie geledingen met terugsprongen van 0,1 m op +10,0 en +16,4 m, westdeur, hoge spitsboognis in de middelste geleding (west, zuid en noord), galmgaten in de bovenste geleding aan alle vier de zijden, kroonlijst en plat dak met loodrand op +22,15 m (AHN 22,0 tot 22,3 m).
- **Spits (1631)**: achtkante, ingezwenkte voet van 3,9 m breed tot de hals (1,7 m) op +26,4 m, de ui tot 4,0 m breed op +29 m en tot +33,0 m (hoogste AHN-punt van de ui), en een spil van 0,9 m met een punt tot +34,6 m.

## Geschat

- De hoogtes van de banden van de toren (+10,0 en +16,4 m), de voet en hals van de spits en het profiel van de ui zijn uit de verhoudingen op de westfoto (RCE 20065531) en foto's van onderaf geschat, geschaald op de gemeten breedte van de toren (BAG) en het dak (+22,15 m) en de top van de ui (+33,0 m) in het AHN.
- Vensterbreedtes en -hoogtes, de deuren, de waterlijsten en kapjes van de steunberen zijn uit de foto's geschat; de noordvensters zijn aangenomen naar het patroon van de zuidgevel (geen goede foto van de noordgevel).
- De sluiting van het koor is symmetrisch gemaakt rond de as van het koor; de BAG wijkt tot 0,4 m af. De dakkapel is geplaatst naar foto's en luchtfoto (circa 1,2 m breed).

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden); het maaswerk en de galmborden zijn weggelaten.
- De vier dakkapelletjes op de voet van de spits en de bol, het kruis en de windhaan op de spil (kleiner dan 0,9 m), de wijzerplaten, de smeedijzeren muurankers, de schoorsteen op de dakkapel, het kruis op het koordak en regenpijpen (kleiner dan 0,9 m of zonder reliëf). De spil is verbreed tot 0,9 m.
- Een vierkant bouwsel met plat glazen dak ten noorden van het schip (luchtfoto, west van de aanbouw) staat niet in de BAG en niet in het AHN en is weggelaten; het hoort niet bij het pand van de kerk.
- De openingen van de noordelijke aanbouw (op de foto's niet goed te zien).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Sint-Nicolaaskerk (Dwingeloo)](https://nl.wikipedia.org/wiki/Sint-Nicolaaskerk_(Dwingeloo))
- [Reliwiki: Dwingeloo, Brink 29 - Sint Nicolaas](https://reliwiki.nl/index.php/Dwingeloo,_Brink_29_-_Sint_Nicolaas)
- Rijksmonumentenregister: [14228 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/14228) en [14229 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/14229)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Nicolaaskerk_(Dwingeloo)) (RCE 20065531, 20065532, 20065533, 20065541, 20065546, 20324951, 20326693; Dwingelo-NH-kerk 1 tot 13; Dwingeloo St. Nicolaaskerk 2005)
- BAG pand 1701100000203584 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1701100000203584) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
