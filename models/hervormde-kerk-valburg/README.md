# Hervormde Kerk (Valburg)

De Hervormde kerk van Valburg bestaat uit een romaanse westtoren, een lager eenbeukig schip en een hoger gotisch koor met driezijdige sluiting en zijkapellen. De kerk en toren zijn afzonderlijke rijksmonumenten binnen hetzelfde BAG-pand.

## Bestanden

- `hervormde-kerk-valburg.glb`: gesloten kaartmodel in meters.
- `hervormde-kerk-valburg.json`: catalogusgegevens en bronverwijzingen.
- `hervormde-kerk-valburg-1-1000.stl`: printmodel in millimeters op schaal 1:1000.
- Generator: `scripts/generate-hervormde-kerk-valburg.mjs`.

## Ligging en model

De oorsprong ligt in de toren op RD (182675,543375; 435860,59725); lokale +X wijst naar het koor met richting (0,981174; 0,193127). Het model vervangt BAG-pand 1734101000026739. Het maaiveld is circa NAP +10,847 m, met een vlakke modelvoet 0,5 m daaronder. Het model is circa 29,3 bij 15,4 m, inclusief steunberen. Footprint en dakvlakken komen uit 3DBAG en het AHN. Het lagere schip heeft een nok rond NAP +21,8 m, het koor rond NAP +25,1 m. De 3DBAG-reconstructie kapt de spits af op NAP +26,83 m; het DSM bevat punten tot NAP +32,11 m. Hoewel enkele cellen op een torenflank ontbreken, zijn de andere flank en de punt meetbaar. Het uiterste uiteinde is circa een halve meter doorgetrokken en voor printbaarheid verbreed; de modelhoogte is 21,8 m boven maaiveld.

Het model bevat een steunbeerpatroon, een zuidelijke aanbouw met lessenaarsdak, een noordelijke kapel met dwars zadeldak, en de romaanse toren met achthoekige spits. Vensters, galmgaten, wijzerplaten en steunberen zijn vereenvoudigd naar foto's en geschat. Het kruis, dunne wijzers, ramenroeden en klein metselwerk zijn op 1:1000 weggelaten.

## Controle

De generator controleert een vlakke voet en één gesloten manifold. De catalogustest controleert positie, BAG-vervanging en volume en doorsneden na overhangopvulling op 1:1000. Een volledige uitsnede is met en zonder landmark geëxporteerd en vanuit vier hoeken naast de bestaande PDOK-reconstructie en vier gevelbeelden gelegd. Controleer op de kaart vooral de torenspits, de twee zijkapellen en de aansluiting van het koor.

## Bronnen

- [3DBAG pand 1734101000026739](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1734101000026739): footprint, maaiveld, dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor dak- en torenhoogte.
- [Rijksmonument kerk 36722](https://monumentenregister.cultureelerfgoed.nl/monumenten/36722) en [toren 36723](https://monumentenregister.cultureelerfgoed.nl/monumenten/36723).
- [Valburg – Hervormde kerk](https://www.spannendegeschiedenis.nl/locatie/valburg-hervormde-kerk/): bouwgeschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Christoffel,_Valburg): gevels en bouwdelen.
