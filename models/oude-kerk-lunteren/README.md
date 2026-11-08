# Oude Kerk (Lunteren)

Landmark voor de Oude Kerk aan de Dorpsstraat in Lunteren (rijksmonument 14480), BAG-pand `0228100000054819`. Het pand omvat de vijftiende-eeuwse toren, de kerkzaal van de vernieuwing van 1858 en de consistorie aan de oostzijde; het model vervangt het hele pand.

## Bestanden

- `oude-kerk-lunteren.glb`: één node `building:kerk`, meters, Y omhoog.
- `oude-kerk-lunteren.json`: catalogusitem.
- `oude-kerk-lunteren-1-1000.stl`: printbestand op 1:1000 in millimeters, Z omhoog.
- Generator: `scripts/generate-oude-kerk-lunteren.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (171075, 455085) op maaiveld NAP +15,05 m (3DBAG). Het lokale stelsel is RD min de oorsprong: X oost, Y noord (`xAxis` [1, 0]); nokken en gevels lopen op 0,3 graden na langs de RD-as. De voet ligt op -0,5 m.

## Onderdelen

- Kerkzaal van 24,5 × 21,3 m met goot op 7,0 m. Oost-west zadeldak (54,5 graden, nok 12,6 m) van de toren tot een afgeschild koortje; twee dwarse schilddaken (48 graden, nok 12,4 m) over de middelste traveeën; korte schilddaken (53 graden) op de westelijke hoektraveeën. Dakvlakken als planvergelijkingen uit de 3DBAG (LoD2.2), gecontroleerd tegen AHN-DSM en luchtfoto.
- Tien spitsboogvensters als blinde nissen van 0,35 m in de langsgevels, vier portalen met half schilddak en twee blindnissen in het front.
- Toren van 6,1 × 6,9 m in drie geledingen (7, 14 en 20 m) met kleine terugsprongen; westdeur en venster, spitsboognissen in de middelste geleding, twee galmgaten per zijde.
- Ingesnoerde naaldspits: uitlopende voet, vierkante klokzone die overgaat in een achtkante naald tot 38,5 m (hoogste AHN-punt van de spits).
- Traptoren op een halve achthoek tegen de noordmuur tot 15,2 m, met spits dak tot 17,9 m.
- Consistorie aan de oostzijde met schilddak (goot 4,75 m, nok 8,3 m) en een lage platte aanbouw (2,5 m) ten noorden van het koor.

## Geschat en weggelaten

De geledingshoogtes, nissen, galmgaten en portaalmaten zijn geschat uit foto's; de verhouding van de klokzone tot de naald uit foto's en het AHN, de spitshoogte uit het hoogste AHN-punt. De vensters en de portaalvorm aan de noordzijde zijn gelijk aan de zuidzijde aangenomen. Weggelaten: wijzerplaten, kruis en haan, ventilatiekapjes op de nokken, het lijstwerk onder de goot en vensters van de consistorie (geen bruikbare foto); de spitstop is verbreed tot 0,9 m.

## Controle

De generator maakt één gesloten volume (genus 0) met vlakke voet. Een test plaatst het model op een uitsnede en controleert dat de export op 1:1000 geen steun toevoegt (volumeverhouding 1,000). Het model is van vier kanten vergeleken met de 3DBAG-reconstructie en Commons-foto's.

## Bronnen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0228100000054819): contour, dakvlakken en maaiveld.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0) (DSM/DTM 0,5 m) en [PDOK-luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Rijksmonumentenregister 14480](https://monumentenregister.cultureelerfgoed.nl/monumenten/14480), [Reliwiki](https://reliwiki.nl/index.php/Lunteren,_Dorpsstraat_34_-_Oude_Kerk) en [Wikipedia](https://nl.wikipedia.org/wiki/Oude_Kerk_(Lunteren)).
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Oude_Kerk_(Lunteren)).
