# Janskerk (Haarlem)

Middeleeuwse kerk aan Jansstraat 40-42, met een vijftiende-eeuws koor, tegenwoordig onderdeel van het Noord-Hollands Archief; rijksmonument 19332.

## Bestanden

- `janskerk-haarlem.glb` en `.json`: kaartmodel in meters met BAG-vervanging.
- `janskerk-haarlem-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-janskerk-haarlem.mjs`.

## Ligging en vorm

Oorsprong RD [103952, 488643] ligt bij de westgevel; lokale X-as [0.975, -0.222] loopt naar het koor. Maaiveld circa NAP +2,24 m. BAG-pand 0392100000064921 omvat kerk en aangebouwde historische gebouwen en wordt vervangen. BAG, AHN5 en luchtfoto bepalen de plattegrond en hoofdvorm; de kerknok ligt circa NAP +24,1 m en de dakruiter bereikt volgens AHN5 circa NAP +35,2 m.

Het model bevat het hoge schip met zadeldak, de vijfzijdige koorsluiting, zuidkapel met dwarskap, lagere langsbouw, historische kosterswoning en archiefaanbouwen met eigen kappen en de dakruiter. Grote vensters, het westvenster en de openingen in de dakruiter zijn blinde nissen. De exacte dakvormen en hoogtes van de aaneengeschakelde kleine aanbouwen en de afmetingen van de gevelnissen zijn op foto's geschat. Kleine pinakels, glasroeden en de windvaan zijn dunner dan 0,9 m en weggelaten.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, plaatsing en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's zijn gemaakt. De foto van de noordzijde is historisch en toont de kerk vóór de bouw van het aangrenzende archief. De kaartcontrole gebeurt in de hoofdsessie.

## Bronnen

- [3D BAG pand 0392100000064921](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0392100000064921), plattegrond en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister 19332](https://monumentenregister.cultureelerfgoed.nl/monumenten/19332).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Janskerk,_Haarlem), actuele en historische voor-, zij- en achteraanzichten.
