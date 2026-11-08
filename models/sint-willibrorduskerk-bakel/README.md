# Sint-Willibrorduskerk, Bakel

Het model vervangt BAG-pand `NL.IMBAG.Pand.1652100000000841`. De kerk is opgebouwd uit schip, zijbeuken, dwarsschip, koor en een zware westtoren met slanke spits en galmgaten. De voet ligt 0,5 m onder maaiveld. De spits is aan de top verbreed en kleine details zijn vereenvoudigd voor print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1652100000000841): BAG-contour 720,18 m² en maaiveld NAP +22,641 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): torenpiek NAP +75,16 m op RD (179581,25, 390654,75), circa 52,52 m boven maaiveld. Het raster heeft rond de top geen ontbrekende cellen. Het model eindigt op 52,4 m.
- Het PDOK-AHN-raster meet een piek op dezelfde plek van NAP +73,84 m, maar bevat gaten direct naast de top. De [plaatselijke heemkundekring](https://www.heemkundekringbakelenmilheeze.nl/de-kerk-van-bakel-03-de-kerk-van-st-willibrordus-te-bakel-door-de-eeuwen-heen) vermeldt een torenhoogte van 40 m zonder meetmethode; dit wijkt af van beide hoogtemetingen. Het model volgt de gemeten AHN5-piek.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/8592) voor de bouwgeschiedenis en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Willibrorduskerk,_Bakel) voor exterieurfoto's.

Galmgaten, steunberen, zijbeuken en de dikte van de spitstop zijn op grond van foto's en hoogtegegevens vereenvoudigd en geschat; de windvaan is weggelaten. Oorsprong RD (179581,25, 390654,75), x-as (0,93, 0,367).

## Genereren

```sh
node scripts/generate-sint-willibrorduskerk-bakel.mjs --scale 1000
node scripts/generate-sint-willibrorduskerk-bakel.mjs --scale 100
```
