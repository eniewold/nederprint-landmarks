# Watertoren (Katwijk)

Vereenvoudigd gesloten model van de watertoren uit 1878 en de twee aangebouwde lage vleugels, die samen één BAG-pand vormen. De achthoekige schacht heeft verdiepte vensterparen, daarboven een rond reservoir met schuine onderlijst, tentdak en achtkantige lantaarn. De vleugels zijn opgebouwd uit muren en zadeldakvlakken.

- `watertoren-katwijk.glb`: één gesloten node `building:watertoren-en-aanbouwen`, meters.
- `watertoren-katwijk.json`: RD-plaatsing en vervanging van BAG-pand `0537100000025991`.
- `watertoren-katwijk-1-1000.stl` en `watertoren-katwijk-1-100.stl`: Z omhoog, millimeters. Genereer beide met `node scripts/generate-watertoren-katwijk.mjs --scale 100` en vervolgens `--scale 1000`.

Oorsprong op RD (88259,9; 467043,4), lokale X-as langs de grote vleugel op -29,4° vanaf RD-oost. Het 3D-BAG maaiveld is NAP +6,897 m; AHN DSM meet de top op NAP +40,947 m. Het model eindigt op 34,05 m boven maaiveld. De torenvoet, vleugels en dakvlakken zijn afgeleid van de BAG- en 3D-BAG-contouren en het AHN; de geometrie heeft één component, genus 0 en een onderkant 0,5 m onder maaiveld.

Geschat zijn de afmetingen, diepte en plaatsing van de vensters en toegang, de details van de lantaarn en de afwerking van de aangebouwde gevels. De boogfriezen, slanke reling, dakvensters en antennes zijn bij deze schaal vereenvoudigd of weggelaten. De hoogte van de borstweringen en aanzet van de ronde reservoirrand zijn van foto's benaderd. De 1:1000-print meet circa 30,1 × 36,0 × 34,55 mm. De plaatsingstest en 45°-steuncontrole slagen; proefuitsneden van 150 × 150 m zijn met en zonder landmark geëxporteerd en vier kanten zijn vergeleken met PDOK en foto's.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0537100000025991), [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonument 508787](https://monumentenregister.cultureelerfgoed.nl/monumenten/508787), [Wikimedia Commons, watertoren Katwijk](https://commons.wikimedia.org/wiki/Category:Water_tower_in_Katwijk).
