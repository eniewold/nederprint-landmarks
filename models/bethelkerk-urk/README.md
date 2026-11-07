# Bethelkerk (Urk)

Gereformeerde kerk (PKN) aan het Wilhelminaplein, Wijk 3 nr. 3, rijksmonument 515906. Op deze plek stond sinds 1851 een klein kerkje; in 1867 kwam er aan de achterkant een uitbouw van twee bouwlagen met een dakruiter, en in 1885 werd het oude deel vervangen door de grote zaalkerk van A.T. van Wijngaarden die er nu staat. De uitbouw van 1867 is gebleven en is nog altijd consistorie en vergaderruimte. De huidige dakruiter is van 1910 en is in 2000 gerestaureerd. De kerk heeft geen toren. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0184100000002606 (zaal, consistorie en lage aanbouw zijn één pand, bouwjaar 1885). Geen ander PDOK-pand raakt de kerk.
- STL op 1:1000: circa 39,7 × 21,6 × 21,9 mm.
- Genereren: `node scripts/generate-bethelkerk-urk.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (169076,12; 519359,47), lat/lon 52,661520 / 5,595259, midden in de zaal. +X loopt langs de nok van de consistorie naar de voorgevel op het noorden, onder 77,6 graden in RD (`xAxis` [0,21474; 0,97667]); +Y wijst naar het westen. De lange gevels van de zaal liggen in de BAG-contour op deze hoek binnen 3 cm recht, en de nok in het AHN-DSM loopt er evenwijdig aan. z = 0 ligt op het laagste maaiveld rond de voet (zuidkant, NAP +6,45 m); het plein voor de noordgevel ligt op NAP +7,0 m, dus de deuren en vensters van de voorgevel liggen 0,45 m hoger. `groundHeight` 48,88 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (zuidkant). `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Zaal (1885)**: 27,9 × 20,7 m (BAG), zadeldak met de nok op +15,4 m (NAP +21,85) en een helling van 0,554 (29 graden) aan beide kanten (AHN-dwarsprofielen 0,552 en 0,555; 3D BAG-nok NAP +21,9), goot +9,67 m. Kroonlijst langs beide zijgevels die 0,45 m uitkraagt (onderkant 48 graden).
- **Zijgevels**: zes traveeën met lisenen van 1,0 m die 0,22 m uitspringen om de 4,55 m (BAG-uitsprongen), in elke travee een spitsboogvenster van 1,9 m breed van +2,8 tot +8,1 m. Op de vier hoeken penanten van 1 × 1 m tot +10,4 m met een piramidekapje.
- **Voorgevel (noord)**: tuitgevel met een deklijst 0,35 m boven het dakvlak en een blok op de top tot +16,4 m, drie deuren, twee groepjes van drie venstertjes erboven en het rondvenster (4 m) met het glas-in-lood, naar de foto's van het plein.
- **Achtergevel (zuid)**: tuitgevel met deklijst en een blok op de top tot +16,05 m (AHN NAP +22,5), een spitsboogvenster oostelijk van de consistorie.
- **Consistorie (1867)**: 11,3 × 11,7 m tegen de achtergevel, twee bouwlagen. De begane grond is rechthoekig; de verdieping heeft afgeschuinde zuidhoeken (benen 2,0 m) en eronder lopen de hoeken met een schuin dakje van +5,5 naar +3,9 m af, zoals op de foto's. Schilddak met nok +12,85 m (AHN NAP +19,35), helling 0,65 (33 graden), afgeschuind boven de hoeken, goot +9,05 m met een kroonlijst rondom. Ingang in de hoektravee van de oostgevel, drie grote vensters in het gepleisterde deel, een lisene, en boven paren venstertjes; in de zuidgevel drie spitsboogvensters beneden en drie smallere boven, en een venster in elke afschuining.
- **Dakruiter (1910)**: vierkante onderbouw van 2,4 m vanaf het dak tot +16,05 m met twee galmgaten per zijde en een kroonlijst, en een achtkante spits tot +21,45 m.
- **Lage aanbouw zuidwest**: 8,9 × 4,4 m (BAG), schilddak van 45 graden met nok +5,15 m (AHN NAP +11,7), en een tussenlid met plat dak op +3,05 m tegen de zaal.
- **Plint** van 0,15 m rondom tot +0,9 m.

## Geschat

- De hoogte van de dakruiter en de spits: het AHN ziet de spits maar tot NAP +27,1 m (één cel op de dakruiter). De onderbouw (+16,05 m) en de top van de spits (+21,45 m, NAP +27,9) komen uit de verhouding onderbouw/spits op foto RCE 20409919; de breedte van 2,4 m uit AHN en foto.
- De afschuining van de consistorie (2,0 m), de hoogtes van de schuine hoekdakjes en van de verdiepingsvloer zijn uit foto RCE 20409919 geschat. De hoekpenanten (+10,4 m), de deuren, de venstertjes en het rondvenster van de voorgevel uit de frontale foto van het plein (Bethelkerk Urk 2018), geschaald op de breedte van de gevel.
- Het blok op de top van de voorgevel staat op de foto's maar niet in het AHN; de hoogte (+16,4 m) is van de foto.
- Vensterbreedtes en -hoogtes van zaal en consistorie zijn uit de foto's geschat; de bovenvensters van de westgevel van de consistorie zijn gespiegeld van de oostgevel (die kant is maar deels gefotografeerd).

## Weggelaten of vereenvoudigd

- Vensters, deuren, galmgaten en het rondvenster zijn blinde nissen (spitse top van 58 graden, rechte openingen met een schuin plafond, het rondvenster als kegelvormige nis); de gietijzeren traceringen, tuimelraampjes en het glas-in-lood zijn weggelaten.
- De muizetandfriezen, de uitgemetselde kruisen in de gevels, de lijsten over de voorgevel, de witte omlijstingen van de deuren en de luifel boven de ingang van de consistorie (kleiner dan 0,9 m of zonder reliëf van 0,3 m).
- De haan en windvaan op de spits, de roeven op de spits, regenpijpen en het hekwerk (kleiner dan 0,9 m).
- Het venster in de achtergevel westelijk van de consistorie zit achter de lage aanbouw en is weggelaten; de begane grond van de westgevel van de consistorie ligt achter de aanbouw.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Bethelkerk (Urk)](https://nl.wikipedia.org/wiki/Bethelkerk_(Urk))
- [Reliwiki: Urk, Wijk 3 - 3 - Bethelkerk](https://reliwiki.nl/index.php/Urk,_Wijk_3_-_3_-_Bethelkerk)
- [Rijksmonumentenregister 515906](https://monumentenregister.cultureelerfgoed.nl/monumenten/515906)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Bethelkerk_(Urk)) (RCE 20409916, 20409919; Bethelkerk Urk 2018; Bethelkerk.jpg; Urk-Bethelkerk.jpg; Urk Bethelkerk -006, -008, -026; Urk 2021 2)
- BAG pand 0184100000002606 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0184100000002606) (nokhoogte)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
