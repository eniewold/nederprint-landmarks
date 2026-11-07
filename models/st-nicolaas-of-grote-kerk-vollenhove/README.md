# Grote of Sint-Nicolaaskerk (Vollenhove)

Tweebeukige hallenkerk aan het Kerkplein, ook Bovenkerk genoemd: twee even brede beuken onder twee evenwijdige zadeldaken, eind 15de eeuw voltooid; de twee driezijdige koorsluitingen zijn uit de 14de eeuw. Tussen de sluitingen staan een achtkante traptoren en de sacristie (gerfkamer). Ten oosten van de kerk staat los de gedrongen klokkentoren van drie geledingen, die aan het voormalige stadhuis vastzit. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: twee nodes, `building:kerk` en `building:klokkentoren`, in meters; vervangt BAG-pand 1708100000010883 (kerk met portalen, sacristie en traptoren) en 1708100000014816 (klokkentoren). Het voormalige stadhuis (1708100000011487) blijft PDOK.
- STL op 1:1000: circa 65 × 28 × 23 mm (kerk en toren als twee losse delen).
- Genereren: `node scripts/generate-st-nicolaas-of-grote-kerk-vollenhove.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (192897; 521732), lat/lon 52,681703 / 5,947606, midden in de kerk op de lijn van de zuilenrij. +X loopt langs de nokken van west naar oost onder −13,9 graden in RD (`xAxis` [0,97072; −0,24023]), uit de noord- en zuidgevel in de BAG-contour en de nokken in de 3D BAG; +Y wijst naar het noorden. z = 0 ligt op NAP +4,6 m, het laagste maaiveld rond de voet van de klokkentoren (het plein zakt naar het oosten); de kerk staat op een verhoging van NAP +5,1 tot +5,6 m die al in het PDOK-terrein zit, de muren lopen daar het maaiveld in. `groundHeight` 47,04 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (oostzijde van de toren); `groundOffsetMetres` −0,1, onderkant 0,4 m onder z = 0.

## Onderdelen

- **Beuken**: zuidbeuk v −10,45 tot −0,4, noordbeuk −0,4 tot 10,15, westgevel op u = −22,85 (BAG). Zadeldaken met helling 1,48 (56 graden), nokken op NAP +24,2 m (3D BAG en AHN), goten op NAP +16,8 (zuid) en +16,4 (noord); tussen de daken een vlakke goot op NAP +17,4 m. Plint tot 1,6 m boven het maaiveld langs de kerk.
- **Koorsluitingen**: drie zijden per beuk, zuid tot u = 22,0 en noord tot u = 22,35 (BAG), met schilden op dezelfde helling als de daken (3D BAG 1,46).
- **Steunberen**: acht traveeën per lange gevel op de BAG-posities, 0,9 m breed en 1,35 m diep met één versnijding en een schuine kop onder de goot; diagonale hoeksteunberen op de westhoeken, steunberen op de hoeken van de sluitingen, de portalen en de sacristie.
- **Vensters en deuren** (blinde spitsboognissen): een hoog venster per travee (in de zuidgevel niet in de travee van het portaal), vensters in de zichtbare zijden van de sluitingen, een groot venster in de westgevel van de zuidbeuk, een lancet in beide westelijke topgevels, de dubbele noordingang onder het vierde venster en de deur in de westelijke travee van de zuidgevel.
- **Portalen**: zuidportaal met zadeldak dwars op de kerk (nok NAP +16,3, 3D BAG), deur en nis; westportaal voor de noordbeuk met nok langs de kerk (NAP +15,7), puntgevel met deur naar het westen en een lage aanbouw met lessenaarsdak aan de noordzijde.
- **Sacristie en traptoren**: sacristie tussen de sluitingen met zadeldak (nok NAP +17,1, helling 1,33) en een trapgevel van drie treden met pinakel naar het oosten, deur, venster en zijvensters; achtkante traptoren (2,6 m) met kraag en naaldspits tot NAP +27,0 m.
- **Klokkentoren**: 7,15 × 5,8 m (BAG), 25,5 graden gedraaid ten opzichte van de kerk. Plint, drie geledingen gescheiden door waterlijsten op 4,9 en 10,6 m, de bovenste iets ingesprongen; per zijde drie hoge blinde spitsboognissen in de middengeleding en drie galmgaten in de klokkenverdieping, spitsboogdeur in de zuidgevel. Gootlijst op NAP +18,1 en tentdak naar één top op NAP +22,8 m (3D BAG en AHN), met een dakkapel op de zuid- en oostzijde.

## Geschat

- De naaldspits van de traptoren: het AHN ziet NAP +25,2 m op 0,5 m; de top is geschat op NAP +27,0 m uit de helling van de spits in het DSM en de foto's. De schachthoogte (NAP +19,0) en diameter van de traptoren komen uit foto's en het DSM.
- De hoogtes van de geledingen van de klokkentoren (4,9 en 10,6 m), de nissen en galmgaten, en de dakkapellen zijn uit de RCE-foto's geschat, geschaald op de gemeten goot en top. Dakkapellen alleen waar foto's ze tonen (zuid en oost).
- Vensterbreedtes (2,2 m), borstweringshoogtes, de steunbeermaten boven de BAG-diepte en de trapgevel van de sacristie zijn uit foto's geschat.

## Weggelaten of vereenvoudigd

- Maaswerk, glas-in-lood en rondbogen: alle vensters, deuren en galmgaten zijn spitse blinde nissen (58 graden) voor print zonder steun.
- Windvanen, kruisen, de makelaar met bol op de klokkentoren en het uurwerk (kleiner dan 0,9 m).
- De lage muur met poort tussen sacristie en klokkentoren (geen deel van de BAG-panden van kerk of toren) en het voormalige stadhuis, dat als PDOK-pand blijft staan.
- Dakgoten, regenpijpen en de waterlijsten van de kerk (kleiner dan 0,9 m).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; beide nodes zijn één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 90 × 90 m bevat beide onderdelen, zonder de PDOK-panden van kerk en toren en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote of Sint-Nicolaaskerk (Vollenhove)](https://nl.wikipedia.org/wiki/Grote_of_Sint-Nicolaaskerk_(Vollenhove))
- [Rijksmonumentenregister 10555](https://monumentenregister.cultureelerfgoed.nl/monumenten/10555)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Nicolaaskerk_(Vollenhove)) (RCE 20378921, 20378919, 20350512, 20350516, 20244961, 20244972; "Vollenhove Netherlands Grote-of-Sint-Nicolaaskerk-01"; "Vollenhove, Grote- of Sint Nicolaaskerk, 07")
- BAG panden 1708100000010883 en 1708100000014816 en de 3D BAG ([kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000010883), [toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000014816)) voor dakvlakken
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m, de actuele luchtfoto en de PDOK-terreintegels
