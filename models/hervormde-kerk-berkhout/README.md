# Hervormde Kerk (Berkhout)

Voormalige Nederlands Hervormde kerk aan Kerkebuurt 172, gebouwd in de jaren 1880; rijksmonument 502457. De kerk wordt beheerd door Stichting Berkhouter Kerk.

## Bestanden

- `hervormde-kerk-berkhout.glb` en `.json`: kaartmodel in meters met BAG-vervanging.
- `hervormde-kerk-berkhout-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-hervormde-kerk-berkhout.mjs`.

## Ligging en vorm

Oorsprong RD [128515, 516982.75] ligt midden op de westtoren; lokale X-as [0.9954, 0.0957] loopt langs het schip naar het oosten. Maaiveld circa NAP -1,27 m. Het model vervangt BAG-pand 1598100000013905. BAG, AHN5 en luchtfoto bepalen het T-vormige grondvlak, de daken en de nokhoogte circa NAP +16,76 m; AHN5 meet de toren tot circa NAP +36,58 m. De 3D BAG mist de torenspits.

Het model bevat de zaalkerk met zadeldak, hogere straatrisaliet met haakse kap, steunberen, dakkapellen en geïntegreerde westtoren met achtzijdige spits en torengeveltjes. Gevelvensters, toegang en galmgaten zijn blinde nissen. De exacte hoogte van torenschacht en topgeveltjes, dakramen en vensterafmetingen zijn geschat uit foto's en AHN. Kleine pinakels, roeden en windvaan zijn dunner dan 0,9 m en weggelaten.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, plaatsing en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's zijn gemaakt. De kaartcontrole gebeurt in de hoofdsessie.

## Bronnen

- [3D BAG pand 1598100000013905](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1598100000013905), plattegrond en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister 502457](https://monumentenregister.cultureelerfgoed.nl/monumenten/502457).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Berkhout)), voor-, zij- en achteraanzichten.
