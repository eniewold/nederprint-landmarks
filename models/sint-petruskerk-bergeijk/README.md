# Sint-Petruskerk, Bergeijk-Loo

Het model vervangt BAG-pand `NL.IMBAG.Pand.1724100000000607`. De neogotische kerk is opgebouwd uit schip, koor, aanbouw en een hoge toren met gekoppelde galmgaten en naaldspits. De voet ligt 0,5 m onder maaiveld. De spits is aan de top verbreed en kleine details zijn vereenvoudigd voor print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1724100000000607): BAG-contour van 594,13 m², maaiveld NAP +32,501 m en daknok rond NAP +51,28 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): torenpiek NAP +77,74 m, dus circa 45,24 m boven maaiveld; het topgebied is vrij van gaten en het model eindigt op 45,15 m.
- [Parochiegeschiedenis](https://parochiebernardus.nl/de-kernen/bergeijk-t-loo-2/bergeijk-t-loo/historie-st-petrus-kerk-t-loo/) voor bouwgeschiedenis en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petruskerk_(Bergeijk)) voor foto's.

Galmgaten, zijramen en naastbouw zijn vereenvoudigd en geschat naar foto's en hoogtepunten; de windvaan is weggelaten. Oorsprong RD (151602,75, 368843,25), x-as (0,214, -0,977).

## Genereren

```sh
node scripts/generate-sint-petruskerk-bergeijk.mjs --scale 1000
node scripts/generate-sint-petruskerk-bergeijk.mjs --scale 100
```
