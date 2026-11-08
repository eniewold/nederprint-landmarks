# Sint-Willibrorduskerk, Berghem

Het model vervangt BAG-pand `NL.IMBAG.Pand.0828100001484075`. Deze grote kruiskerk bestaat uit schip, lagere zijbeuken, dwarsschip, koor, aanbouwen, een oude zware toren en een ranke vieringsruiter. De voet ligt 0,5 m onder maaiveld; de twee spitsen zijn bovenaan verbreed voor print op 1:1000 zonder ondersteuning.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001484075): BAG-contour 1273,67 m², maaiveld NAP +8,057 m en daknok rond NAP +32,16 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): torenpiek NAP +79,94 m, circa 71,88 m boven maaiveld, en vieringsruiter circa NAP +46,63 m. Het topgebied rond de toren is vrij van gaten; het model eindigt op 71,7 m.
- [BHIC](https://beta.bhic.nl/verhalen/de-h-willibrorduskerk-in-berghem) voor de geschiedenis en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Berghem)) voor foto's van de voorgevel, de kruisarmen en de vieringsruiter.

Details van ramen, galmgaten, hoek-/traptorentje en lage aanbouwen zijn naar foto's en hoogtepunten geschat; de open vieringsruiter is vereenvoudigd en de zeer dunne windvaan weggelaten. Oorsprong RD (167410,25, 420155,25), x-as (-0,996, -0,09).

## Genereren

```sh
node scripts/generate-sint-willibrorduskerk-berghem.mjs --scale 1000
node scripts/generate-sint-willibrorduskerk-berghem.mjs --scale 100
```
