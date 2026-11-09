# Hervormde Kerk (Abbekerk)

Het Witte Kerkje aan Dorpsstraat 42, eenbeukige witgepleisterde kerk met gemetselde toren en vijfzijdig koor. De kerk en toren zijn afzonderlijk rijksmonument 30655 en 30656.

## Bestanden

- `hervormde-kerk-abbekerk.glb` en `.json`: kaartmodel in meters, met BAG-vervanging.
- `hervormde-kerk-abbekerk-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-hervormde-kerk-abbekerk.mjs`.

## Ligging en vorm

Oorsprong RD [130163.765, 527299.025] ligt in het hart van de westtoren; lokale X-as [0.9705, 0.241] loopt naar het koor. Maaiveld circa NAP +0,37 m. Vervangen BAG-pand voor kerk en toren samen: 0420100000011815. Let op: 0420100000011735, genoemd in de oorspronkelijke taak, is een ander pand zuidelijk van de kerk en wordt niet vervangen.

BAG en AHN5 geven de voetafdruk, nok circa NAP +13,35 m, torenschacht circa NAP +21,2 m en de torenhoogte (AHN5 gemeten circa NAP +34,93 m). Het model omvat de zaalkerk met zadeldak, vijfzijdig koor met schildvlakken, steunberen, westtoren en achtzijdige bakstenen spits. De 3D BAG mist de spits. Blinde nissen duiden ramen, galmgaten en toegang aan; hun precieze maatvoering is geschat uit foto's. Open balustrade, fijne roeden en torenbekroning zijn kleiner dan 0,9 m en weggelaten.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, correcte BAG-vervanging, plaatsing en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's zijn gemaakt. De kaartcontrole gebeurt in de hoofdsessie.

## Bronnen

- [3D BAG pand 0420100000011815](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0420100000011815), plattegrond en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister kerk 30655](https://monumentenregister.cultureelerfgoed.nl/monumenten/30655) en [toren 30656](https://monumentenregister.cultureelerfgoed.nl/monumenten/30656).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Protestantse_Kerk_(Abbekerk)), voor-, zij- en achteraanzichten.
