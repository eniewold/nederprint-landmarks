# Sint-Urbanuskerk (Nes aan de Amstel)

Neogotische kruiskerk aan Amsteldijk Zuid, ontworpen door Joseph Cuypers, rijksmonument 8142. Deze kerk staat in Nes aan de Amstel en is niet de gelijknamige Urbanuskerk in Bovenkerk.

## Bestanden

- `sint-urbanuskerk-amstelveen.glb` en `.json`: kaartmodel in meters met BAG-vervanging.
- `sint-urbanuskerk-amstelveen-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-sint-urbanuskerk-amstelveen.mjs`.

## Ligging en vorm

Oorsprong RD [119882.5, 474925.5] ligt bij de viering; lokale X-as [0.999, -0.04] loopt langs het schip naar het koor. Maaiveld circa NAP -1,29 m. Het BAG-pand 0362100001091256 omvat kerk en aangebouwde pastorie en wordt als geheel vervangen. BAG, AHN5 en luchtfoto bepalen de grondvorm en daknokken; de kerknok ligt circa NAP +18,86 m en de torenspits volgens de hoogtemeting circa NAP +49,15 m. De 3D BAG mist het grootste deel van de torenspits.

Het model omvat het langschip met vijf dwarskappen per zijbeuk, dwarsschip, veelhoekig koor, flankerende ruimtes, vieringtoren met vier hoektorentjes, en de schuin aangebouwde pastorie met dakkapellen. De vensters, galmgaten en toegang zijn als blinde nissen uitgevoerd. De precieze dak- en geveldetails van de pastorie, hoektorentjes en verdeling van de nissen zijn geschat uit foto's en AHN; de bovenste spits is aan de gemeten piek aangepast. Kruisen, balustrade en fijne details onder 0,9 m zijn weggelaten.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, plaatsing en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's zijn gemaakt. De kaartcontrole gebeurt in de hoofdsessie.

## Bronnen

- [3D BAG pand 0362100001091256](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0362100001091256), plattegrond en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister 8142](https://monumentenregister.cultureelerfgoed.nl/monumenten/8142).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:St-Urbanuskerk_(Nes_aan_de_Amstel)), voor-, zij- en achteraanzichten.
