# Watertoren Hillegom

Het model toont de achthoekige betonnen watertoren uit 1925 met verticale hoekribben, vensternissen, reservoirkop en de huidige lage aanbouw die in hetzelfde BAG-pand is opgenomen. Het gebouw is opgebouwd uit vlakke achthoekige prisma's en schuine aansluitvlakken.

- `watertoren-hillegom.glb`: één gesloten node `building:watertoren`, in meters.
- `watertoren-hillegom.json`: plaatsing en vervanging van BAG-pand `0534100000011918`.
- `watertoren-hillegom-1-1000.stl`: Z omhoog, circa 40 × 47 × 44,95 mm.
- Generator: `node scripts/generate-watertoren-hillegom.mjs --components`.

Oorsprong RD (99220,73, 476528,65), X naar het oosten en Y naar het noorden. De onderkant is 0,5 m onder maaiveld. BAG geeft maaiveld NAP +0,424 m, bovenste dak NAP +44,878 m en de lage aanbouw circa NAP +5,28 m. Het AHN-DSM meet de dakoppervlakte grotendeels rond NAP +44–45 m; een uitschieter +47,74 m betreft vermoedelijk een installatie. De vaak genoemde hoogte is 45,25 m.

De maten van ribben, vensters en de achthoekige reservoirkop zijn op basis van BAG, AHN en foto's geschat; de lage aanbouw is vereenvoudigd als gesloten volume met vlak dak. De glazen overkapping is vereenvoudigd; de open vluchttrap is weergegeven als verbonden verticale strook met zes blinde nissen. De zijde, maat en nisverdeling zijn naar de luchtfoto geschat. Fijne lijsten en antennes zijn weggelaten. De recente buitenfoto’s tonen een achthoekige kop en vernieuwde gevelvensters.

Het model is één gesloten volume met genus 0. De 45°-ondersteuningstest geeft geen relevante volumetoename; doorsneden zijn gelijk. Een volledige uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd. Vier aanzichten staan naast PDOK en bronfoto's; fotohoeken zijn benaderend.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0534100000011918), [AHN-DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), [foto en herontwikkeling](https://www.pieters.net/nieuws/meelfabriek-en-watertoren-winnaars-rap-leiden-2023/), [luchtfoto actuele situatie](https://www.hillegomonline.nl/2025/05/08/open-dag-bij-watertoren-bollenstreek/), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Watertoren,_Hillegom).

