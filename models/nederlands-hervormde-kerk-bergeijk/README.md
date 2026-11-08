# Nederlands Hervormde Kerk, Bergeijk

Dit model vervangt BAG-pand `NL.IMBAG.Pand.1724100000003492`. Het langwerpige achthoekige zaalkerkje heeft aan beide uiteinden een schilddak, een klein portaal en een dakruiter. De voet ligt 0,5 m onder maaiveld. De open dakruiter heeft een massieve kern met ondiepe nissen, voor een print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1724100000003492): BAG-contour van 135,96 m², maaiveld NAP +30,386 m en nok rond NAP +42,15 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): hoogste punt binnen kerkcontour NAP +45,55 m op RD (153266,25; 370406,25); modeltop 15,05 m boven maaiveld. De hogere rasterpiek bij RD (153286,75; 370412,25) ligt buiten de kerk en hoort bij begroeiing.
- [Gemeente Bergeijk](https://www.bergeijk.nl/domineestraat-10) voor de achthoekige grondvorm en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Bergeijk)) voor foto's.

Portaal, raam- en lantaarnnissen zijn vereenvoudigd en geschat op basis van foto's en hoogtepunten; de zeer dunne windvaan is weggelaten. Oorsprong RD (153258,5, 370405,3), x-as (0,998, -0,05).

## Genereren

```sh
node scripts/generate-nederlands-hervormde-kerk-bergeijk.mjs --scale 1000
node scripts/generate-nederlands-hervormde-kerk-bergeijk.mjs --scale 100
```
