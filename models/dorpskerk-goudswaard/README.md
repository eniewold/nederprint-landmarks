# Dorpskerk, Goudswaard

Achttiende-eeuwse rechthoekige zaalkerk met een ingesnoerde naaldspits en een kleine aangebouwde ruimte aan de achterzijde. De achteraanbouw valt binnen hetzelfde BAG-pand en is meegenomen.

## Bronnen en maatvoering

- [3D BAG pand 0588100001019137](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0588100001019137): ligging, contour en dakvlakken. Maaiveld circa NAP +1,01 m; nok circa 12,3 m boven maaiveld.
- PDOK AHN DSM 0,5 m: hoogste steekproef bij de toren NAP +24,03 m, circa 23,0 m boven maaiveld. Het bovenste deel van de spits ontbreekt in de PDOK-reconstructie en is op basis van AHN en foto's hersteld.
- [Rijksmonument 17050](https://monumentenregister.cultureelerfgoed.nl/monumenten/17050) en [historische en actuele foto's](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Goudswaard)): hoofdvorm, toren, zijgevel en achteraanbouw.

De precieze maten en aansluitingen van de spits, galmgaten en ondiepe gevelnissen zijn uit foto's en AHN benaderd. Het kleine kruis en de windvaan zijn weggelaten op printschaal.

## Genereren en controle

`node scripts/generate-dorpskerk-goudswaard.mjs --scale 1000 --components` en `--scale 100 --components` leveren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
