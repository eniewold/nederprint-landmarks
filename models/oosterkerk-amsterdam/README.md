# Oosterkerk (Amsterdam)

Zeventiende-eeuwse centraalbouw aan de Kleine Wittenburgerstraat 1, gebouwd in 1669-1671; rijksmonument 6444. Het in de BAG opgegeven jaar 1905 beschrijft niet de oorspronkelijke bouw van de kerk.

## Bestanden

- `oosterkerk-amsterdam.glb` en `.json`: kaartmodel in meters met BAG-vervanging.
- `oosterkerk-amsterdam-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-oosterkerk-amsterdam.mjs`.

## Ligging en vorm

Oorsprong RD [123134.1, 487003.7] ligt in het midden van de viering; lokale X-as [0.714, 0.7] loopt langs een van de gevels. Maaiveld circa NAP +1,87 m. Het model vervangt BAG-pand 0363100012170274. BAG, AHN5 en luchtfoto bepalen de plattegrond, de vier armen met nok op circa NAP +34,52 m en lagere hoekruimten. AHN ziet op het torentje punten tot circa NAP +48,94 m, inclusief zeer dunne bekroning.

Het model bestaat uit vier schilddakarmen, vier afzonderlijk aflopende hoekdaken, uitgebouwde portalen, schuine steunberen en een achthoekige dakruiter. Vensters en openingen in de dakruiter zijn blinde nissen voor een ondersteuningsvrije print. Exacte raamafmetingen, hoekdaken, torenvorm en bekroning zijn uit foto's geschat; de hoogste dunne windvaan en balustradedetails zijn kleiner dan 0,9 m en weggelaten.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, plaatsing en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's zijn gemaakt. De kaartcontrole gebeurt in de hoofdsessie.

## Bronnen

- [3D BAG pand 0363100012170274](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012170274), plattegrond en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister 6444](https://monumentenregister.cultureelerfgoed.nl/monumenten/6444), bouwgeschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Oosterkerk_(Amsterdam)), verschillende buitenaanzichten.
