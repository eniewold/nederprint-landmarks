# Sint-Willibrorduskerk, Berkel-Enschot

Het model vervangt BAG-pand `NL.IMBAG.Pand.0855100000703581`. De kerk bestaat uit een basilicaal schip, koor, afzonderlijke dwarskappen boven de zijbeuken, lage aanbouwen en een vierkante toren met naaldspits. De voet ligt 0,5 m onder maaiveld. De spits is bovenaan verbreed voor een print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000703581): BAG-contour 684,06 m², maaiveld NAP +12,383 m en nok circa NAP +26,32 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): torenpiek NAP +50,50 m, circa 38,11 m boven maaiveld; het topgebied is vrij van gaten. Het model eindigt op 38,05 m.
- [BHIC](https://www.bhic.nl/ontdekken/verhalen/de-h-willibrorduskerk-in-berkel) voor de bouwgeschiedenis en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk,_Berkel-Enschot) voor foto's van toren en gevels.

Galmgaten, kleine aanbouwen en vensternissen zijn vereenvoudigd en geschat aan de hand van foto's en hoogtepunten; de windvaan is weggelaten. Oorsprong RD (138100,75, 400183,75), x-as (0,955, 0,296).

## Genereren

```sh
node scripts/generate-sint-willibrorduskerk-berkel-enschot.mjs --scale 1000
node scripts/generate-sint-willibrorduskerk-berkel-enschot.mjs --scale 100
```
