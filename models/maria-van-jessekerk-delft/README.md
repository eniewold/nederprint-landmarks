# Maria van Jessekerk, Delft

Neogotische driebeukige kruisbasiliek met hoog middenschip, lagere zijbeuken, dwarsschip, vijfzijdig gesloten koor en twee verschillend uitgevoerde fronttorens. Een dakruiter en een klein hoektorentje zijn afzonderlijk gemodelleerd. Het naastgelegen pastoriepand heeft een eigen BAG-identificatie en blijft in de kaart behouden.

## Bronnen en maatvoering

- [3D BAG pand 0503100000028802](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0503100000028802): ligging, grondvlak en dakvlakken. Maaiveld circa NAP +0,06 m; nok van schip en dwarsschip circa 28,7 m.
- PDOK AHN DSM 0,5 m: hoogste metingen aan de hoofdtorens circa NAP +66,6 m; dakruiter +38,6 m en hoektorentje +34,9 m. De smalste uiteinden van de torens zijn onvoldoende getroffen in de DSM. Voor de totale hoogte is de afzonderlijk gepubliceerde architecturale hoogte van [circa 72 m](https://www.skyscrapercenter.com/building/maria-van-jessekerk/7806) gebruikt en de laatste meters zijn naar foto's benaderd.
- [Rijksmonument 18279](https://monumentenregister.cultureelerfgoed.nl/monumenten/18279), [historische en actuele foto's](https://commons.wikimedia.org/wiki/Category:Maria_van_Jessekerk_(Delft)) en [kerkgeschiedenis](https://www.rkdelft.nl/parochie/kerken/maria-van-jessekerk/historie-maria-van-jessekerk): herkenbare torenverschillen, koor en gevels.

De precieze vormen en maten van de bovenste torengeledingen, de 1:1000 verdikte kleine hoektorens en de ondiepe gevelnissen zijn geschat uit foto's en AHN. Fijn maaswerk, beelden, kruisen en open balustrades zijn voor printbaarheid weggelaten.

## Genereren en controle

`node scripts/generate-maria-van-jessekerk-delft.mjs --scale 1000 --components` en `--scale 100 --components` produceren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
