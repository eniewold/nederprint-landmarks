# Maartenskerk, Sint-Maartensdijk

Pseudobasilicale kerk met hoge middenbeuk, lagere zijbeuken, vijfzijdig gesloten hoofdkoor, noordelijke kapel en een gedeeltelijk ingebouwde westtoren. De torenbekroning heeft een ingesnoerde kap en een lantaarn; de open lantaarn is voor schaal 1:1000 als gesloten bouwdeel met ondiepe nissen weergegeven.

## Bronnen en maatvoering

- [3D BAG pand 0716100000177131](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0716100000177131): plattegrond, dakvlakken en ligging. Maaiveld NAP +1,28 m; nok circa 21,1 m boven maaiveld.
- PDOK AHN DSM 0,5 m: bij de toren is NAP +42,38 m gemeten; het model eindigt circa 40,9 m boven maaiveld. Kleine meetverschillen kunnen door het kruis en meetresolutie ontstaan.
- [Rijksmonument 35410](https://monumentenregister.cultureelerfgoed.nl/monumenten/35410), [foto's](https://commons.wikimedia.org/wiki/Category:Maartenskerk_(Sint_Maartensdijk)) en [Monumenten in Nederland, Zeeland](https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0094.php): vorm van koor, kapel, steunberen en toren.

De hoogte en breedte van de lantaarn, profielen van de steunberen en de maten van gevelnissen zijn benaderd. Klein sierwerk en het kruis zijn weggelaten voor printbaarheid.

## Genereren en controle

`node scripts/generate-maartenskerk-sint-maartensdijk.mjs --scale 1000 --components` en `--scale 100 --components` genereren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
