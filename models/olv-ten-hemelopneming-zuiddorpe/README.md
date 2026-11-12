# O.L.V. ten Hemelopneming, Zuiddorpe

Neogotische kruisbasiliek naar ontwerp van P.J. van Genk, met hoge middenbeuk, lagere zijbeuken, dwarsbeuk, recht gesloten koor en een zijdelings geplaatste toren met ingesnoerde vierzijdige spits. Naast het voorportaal staat een kleine traptoren.

## Bronnen en maatvoering

- [3D BAG pand 0715100000008194](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0715100000008194): positie, contour en dakvlakken. Maaiveld NAP +2,70 m en hoofdnok circa 15,4 m boven maaiveld.
- PDOK AHN DSM 0,5 m: hoogste torensteekproef NAP +40,44 m, circa 37,7 m boven maaiveld; de bovenste spits is in de PDOK-reconstructie niet volledig aanwezig.
- [Rijksmonument 508091](https://monumentenregister.cultureelerfgoed.nl/monumenten/508091) en [historische en actuele foto's](https://commons.wikimedia.org/wiki/Category:Maria_Hemelvaartkerk_(Zuiddorpe)): hoofdvorm, ligging van de toren, lichtbeuk en voorzijde.

Maat en aansluiting van de traptoren, de vorm en hoogte van de spits, en de positie en grootte van de ondiepe nissen zijn uit AHN en foto's benaderd. Klein maaswerk en het torenkruis zijn weggelaten op printschaal. De beschikbare foto's tonen vooral voor- en zijaanzicht; de vorm van de achterzijde volgt hoofdzakelijk 3D BAG en PDOK.

## Genereren en controle

`node scripts/generate-olv-ten-hemelopneming-zuiddorpe.mjs --scale 1000 --components` en `--scale 100 --components` genereren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en de beschikbare schuine foto's; kaartcontrole en preview-export volgen bij afronding.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
