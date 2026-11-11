# Onze Lieve Vrouw van Altijddurende Bijstand (Almelo)

Rooms-katholieke parochiekerk aan de Ootmarsumsestraat 494 in Mariaparochie (gemeente Almelo), naar ontwerp van J. Stuyt: een neogotische pseudobasilicale kruiskerk. Het oostdeel (1917–1918) is een centraliserende kerk in de vorm van een Grieks kruis met driezijdig gesloten koor en transeptarmen, veelhoekige kapellen in de oksels en een dakruiter op de viering. In 1923 volgden het schip met zijbeuken, waarvan elke travee een eigen dwarszadeldak heeft, en de ongelede toren naast de voorgevel met vier frontalen en een achtkante naaldspits. De L-vormige pastorie (1918) en de sacristie horen bij hetzelfde BAG-pand en zijn eenvoudig meegemodelleerd.

## Bestanden

- `onze-lieve-vrouw-van-altijddurende-bijstand-almelo.glb`: het model in meters, Y omhoog, één node `building:kerk`.
- `onze-lieve-vrouw-van-altijddurende-bijstand-almelo.json`: catalogusitem.
- `onze-lieve-vrouw-van-altijddurende-bijstand-almelo-1-1000.stl`: binaire STL in millimeters op 1:1000, Z omhoog.
- Generator: `scripts/generate-onze-lieve-vrouw-van-altijddurende-bijstand-almelo.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (244769,74; 488559,85) op de viering, op maaiveld (NAP +11,7 m). De X-as (0,77834; 0,62784) wijst langs de nok van schip en koor naar het noordoosten, naar het koor; +Y wijst naar het noordwesten. De richting (38,9 graden in RD) komt uit de nokken en hellingrichtingen in de 3D BAG en het AHN. Pastorie en sacristie staan op 8,6 graden (BAG-gevels) en worden in een eigen stelsel gebouwd en 30,3 graden rechtsom gedraaid.

Het maaiveld rond het pand is vlak (AHN-DTM NAP +11,5 tot +12,1 m op de negen bemonsteringspunten van de export), dus er zijn geen `groundSamplePoints` nodig.

## Onderdelen

- Koor en transeptarmen (9,5 m breed) onder zadeldaken van 52 graden met nok op 17,0 m, alle drie driezijdig (achtkant) gesloten met schilddakvlakken en spitsboogvensters.
- Twee veelhoekige kapellen in de oksels tussen koor en transept (BAG-contour), goot 8,1 m, piramidedak tot 13,0 m.
- Dakruiter op de viering: achtkante lantaarn met galmnissen en naaldspits tot 27,5 m.
- Schip (10 m breed) met hetzelfde dak, drie dakkapellen per zijde.
- Zijbeuken met muur tot 8,35 m en per travee een dwarszadeldak (nok 10,3 m) dat tegen het schipdak loopt, vier traveeën van 5 m, steunberen en een spitsboogvenster per travee.
- Voorgevel met topgevel boven het dak en kruisblok, steunberen, gekoppeld venster en nis voor het mozaïek, portaal met steil schilddak en lage zijvleugels.
- Ronde traptoren met kegeldak op de noordhoek van de voorgevel (tot 18,5 m).
- Toren op de zuidhoek: ongelede schacht van 5,5 m tot de lijst op 20,0 m, twee galmgaten per zijde, kruisdak met vier frontalen tot 28,8 m met de klok, achtkante naaldspits tot 45,6 m, lage driezijdige uitbouw tegen de zuidzijde.
- Sacristie: drie traveeën met zadeldak (nok 6,5 m) en driezijdige uitbouwen op het zuiden, platte verbinding (5,3 m) naar de zuidelijke transeptarm, lage gang langs kapel en koor.
- Pastorie: vleugel met nok langs de gevel en schild op het westen (nok 11,0 m), hoofdblok met zadeldak (nok 11,4 m) en twee schoorstenen, lage aanbouwen en een vleugel met zadeldak (nok 6,75 m) aan de noordkant. De open binnenplaats tussen sacristie, pastorie en vleugel blijft open (genus 1).

## Geschat en weggelaten

Geschat: de dakruiter (AHN alleen 25,4 m op 0,5 m; de spitspunt geschat op 27,5 m), de torengeledingen (galmgaten, frontalen en klok) uit foto's naast de AHN-hoogten van de lijst (19–20 m), frontalen (circa 29 m) en spits (NAP +57,2 m), de hoogte van de traptoren, de vensterverdeling, de dakkapellen en de vorm van sacristie en pastorie (3D BAG en AHN, geen foto van de achterkant). Weggelaten: tracering, kruisen en windwijzers (dunner dan 0,9 m), het mozaïek (alleen een nis), de witte siermetselwerkbanden en de vensters van de pastorie.

Het rijksmonumentnummer 10415 uit de opdracht hoort bij een boerderij in Breda; een registernummer voor deze kerk is niet gevonden.

## Controle

Generator: status NoError, genus 1 (de open binnenplaats), één samenhangende solid van 65,5 × 39,2 × 46,1 m. De test in `tests/landmark-models.test.ts` plaatst het model, controleert de enige node en vult op 1:1000 met de overhangcontrole op 45 graden zonder meer dan 3 % extra volume. Een tijdelijke plaatsingstest met het AHN-DTM als maaiveld legde de voetafdruk precies op de BAG-contour en de voet 0,3 tot 0,75 m onder het maaiveld (laagste punt NAP +11,55 m, offset −0,3 m). Renders van vijf kanten zijn naast de 3D BAG-reconstructie gelegd en vergeleken met de foto's op archimon.nl.

## Bronnen

- [Archimon, Mariaparochie O.L.V. van Altijddurende Bijstand](https://archimon.nl/overijssel/mariaparochieolv.html): architect, bouwfasen, opbouw en foto's van alle kanten.
- [Monumenten in Nederland: Overijssel (DBNL)](https://dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0068.php): pseudobasilicale kruiskerk, vijfzijdig gesloten koor, ongelede toren met achtkante spits.
- [OpenStreetMap way 288518499](https://www.openstreetmap.org/way/288518499).
- [PDOK BAG](https://service.pdok.nl/lv/bag/wfs/v2_0): pand `0141100000039905` (kerk, sacristie en pastorie) en de contour.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0141100000039905): LoD2.2-dakvlakken, hellingen en nokhoogtes.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) `dsm_05m` en `dtm_05m`: controle van nokken, goten, traveeën en torenomhullende.
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).

Controleer op de [kaart](http://localhost:3000/kaart/52.37750/6.70568/200/1x1/0) de toren op de zuidhoek, de dwarszadeldaken van de zijbeuken en de aansluiting van sacristie en pastorie op het transept.
