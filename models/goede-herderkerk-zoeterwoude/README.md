# Goede Herderkerk, Zoeterwoude

Vereenvoudigd model van de neoromaanse kruisbasiliek aan de Hoge Rijndijk (1895–1896), ook bekend als Meerburgkerk. Het bestaat uit het middenschip met langsdak, lagere zijbeuken, een dwarsschip met topgevels, koor met sluiting, een achthoekige vieringtoren, twee klokkentorens en latere aanbouwen. De afmetingen zijn in meters op ware grootte; de STL-bestanden zijn op 1:1000 en 1:100.

## Herkomst en plaatsing

- BAG-pand `0638100000364404`, via [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0638100000364404), voor de omtrek en dakvlakken; dit pand wordt vervangen.
- AHN5-DSM 0,5 m via PDOK WCS voor hoogten en vorm: de nok van het schip ligt rond NAP +17,4 m en de top rond NAP +41,2 m. Als maaiveld is circa NAP +0,5 m gekozen.
- [Rijksmonumentenregister 41040](https://monumentenregister.cultureelerfgoed.nl/monumenten/41040) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Goede_Herderkerk,_Zoeterwoude) voor de bouwdelen en opstand.
- Oorsprong RD (95906,25, 462239,75), +X langs de kerkas naar het zuidoosten, +Y links daarop. Onderkant op −0,5 m ten opzichte van het maaiveld.

## Schattingen en vereenvoudiging

De posities, afmetingen en vorm van de blinde vensternissen, steunberen, geveltoppen rond de koepel, lantaarn en spitsen zijn vereenvoudigd naar de foto's en het AHN. Het maaiveld is indicatief. De laagbouw is op de BAG-contour en het AHN vereenvoudigd. Bij 42 verspreide ontbrekende DSM-cellen zijn naastliggende metingen, de 3D BAG en foto's gebruikt; het grootste groepje bevat zeven cellen. Smal maaswerk, kruisen en onderdelen kleiner dan 0,9 m zijn weggelaten. Nissen hebben een printbare spitse bovenzijde; ramen zijn niet opengewerkt.

## Genereren

`node scripts/generate-goede-herderkerk-zoeterwoude.mjs --components` schrijft de GLB, catalogus-JSON en binaire STL op 1:1000. De generator controleert manifoldstatus, neerwaartse vlakken en een Float32-rondgang.

## Bestanden en controle

- `goede-herderkerk-zoeterwoude.glb` en `.json`: catalogusmodel en plaatsing.
- `goede-herderkerk-zoeterwoude-1-1000.stl` en `goede-herderkerk-zoeterwoude-1-100.stl`: losse printmodellen op 1:1000 en 1:100.
- De generator controleert één gesloten onderdeel, manifoldstatus en overhang; de gerichte catalogus- en printtest controleert plaatsing en 45-gradenondersteuning. Vier aanzichten zijn vergeleken met de PDOK-reconstructie en schuine foto's.
