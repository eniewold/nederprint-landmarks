# Hervormde Gemeente Tuil (Tuil)

De Hervormde kerk aan de Langstraat is een zaalkerk met een middeleeuwse westtoren, een in 1810 herbouwd schip en een aangebouwde consistorie uit circa 1850.

## Bestanden

- `hervormde-gemeente-tuil.glb`: model in meters voor de kaart.
- `hervormde-gemeente-tuil.json`: catalogusgegevens en bronverwijzingen.
- `hervormde-gemeente-tuil-1-1000.stl`: printmodel in millimeters op schaal 1:1000.
- Generator: `scripts/generate-hervormde-gemeente-tuil.mjs`.

## Ligging en model

De oorsprong ligt in de toren op RD (144789,73725; 426013,11), de lokale +X-as loopt langs het schip naar de consistorie met richting (0,967969; 0,251069). Het maaiveld is circa NAP +4,469 m en de vlakke modelvoet ligt 0,5 m daaronder. Het model vervangt BAG-pand 0304100000009486 en omvat schip, koor, toren en de aan de oostzijde aangebouwde consistorie. De footprint is circa 33,3 bij 9,7 m. De plattegrond, goten en dakvlakken zijn gebaseerd op 3DBAG en gecontroleerd aan het AHN. De 3DBAG-reconstructie kapt de torenspits af op circa NAP +22,9 m, terwijl het DSM waarden tot NAP +28,92 m toont. De spits is daarom met een gemeten hoogte van circa 24,45 m boven het maaiveld hersteld en bovenaan voor printbaarheid verbreed.

Schip en driezijdig gesloten koor hebben een doorlopend zadeldak en schildvlakken, de consistorie heeft een eigen zadeldak met dwarse toegangstopgevel. De toren bestaat uit een vierkant volume met een geknikte overgang naar de achtkante spits. Steunberen, venster- en galmgatnissen, wijzerplaten en de toegangspartij zijn vereenvoudigd naar foto's en geschat. Dunne wijzers, glazen traceringen, windvaan en hekwerk zijn op 1:1000 weggelaten.

## Controle

De generator controleert een vlakke voet en één gesloten manifold. De catalogustest controleert plaatsing, BAG-vervanging en verandering door overhangopvulling bij 1:1000 met volume en doorsneden. Een volledige uitsnede is met en zonder landmark geëxporteerd en vanuit vier hoeken naast de PDOK-reconstructie en foto's gelegd. Controleer op de kaart de plek van de consistorie en de torenspits.

## Bronnen

- [3DBAG pand 0304100000009486](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0304100000009486): BAG-contour, maaiveld en dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor de torenspits en daken.
- [Rijksmonument kerk 30342](https://monumentenregister.cultureelerfgoed.nl/monumenten/30342), [toren 30343](https://monumentenregister.cultureelerfgoed.nl/monumenten/30343) en [consistorie 522051](https://monumentenregister.cultureelerfgoed.nl/monumenten/522051).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Tuil)): gevels, consistorie en toren.
