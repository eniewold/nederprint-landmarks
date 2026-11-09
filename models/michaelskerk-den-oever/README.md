# Michaëlskerk (Oosterland, Den Oever)

Romaanse kerk aan Kerkweg 22 op het voormalige eiland Wieringen; het huidige tufstenen kerkgebouw dateert uit de vroege twaalfde eeuw. Kerk en toren zijn afzonderlijk beschermd; het kerkmonument is nummer 38933.

## Bestanden

- `michaelskerk-den-oever.glb` en `.json`: kaartmodel in meters met BAG-vervanging.
- `michaelskerk-den-oever-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-michaelskerk-den-oever.mjs`.

## Ligging en vorm

Oorsprong RD [129670.8, 549434.75] ligt in de westtoren; lokale X-as [0.979, 0.203] loopt naar de apsis. Maaiveld op de wierde circa NAP +7,0 m; de vijf `groundSamplePoints` liggen op het hoge terrein rond de kerk, zodat het lager gelegen buitengebied de plaatsing niet omlaag trekt. Het model vervangt BAG-pand 0462100000005002. BAG en AHN5 geven de voetafdruk, nok circa NAP +21,29 m en torenspits circa NAP +41,35 m.

Het model omvat de tufstenen zaalkerk met zadeldak, de lagere kooraanloop met halfronde apsis en kegelvormig dak, en een westtoren met achtzijdige gemetselde spits. Ramen en galmgaten zijn blinde nissen om zonder steun te printen. Torenprofiel, hoogte apsisdak en vensterafmetingen zijn deels geschat uit foto's. De lage heuvel en begraafplaats zijn onderdeel van PDOK-terrein en daarom niet dubbel gemodelleerd; windvaan en kleine details zijn dunner dan 0,9 m en weggelaten.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, plaatsing, terreinsamplepunten en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's zijn gemaakt. De kaartcontrole gebeurt in de hoofdsessie, met aandacht voor de aansluiting op de wierde.

## Bronnen

- [3D BAG pand 0462100000005002](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0462100000005002), plattegrond en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister 38933](https://monumentenregister.cultureelerfgoed.nl/monumenten/38933).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Micha%C3%ABlskerk_(Oosterland)), voor-, zij- en achteraanzichten.
