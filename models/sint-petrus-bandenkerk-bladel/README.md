# Sint-Petrus' Bandenkerk, Bladel

Het model vervangt BAG-pand `NL.IMBAG.Pand.1728100000000183`. De kruiskerk heeft twee korte fronttorens, een hogere vieringtoren, dwarse zijgevelkappen en een verbonden lage vleugel. De voet ligt 0,5 m onder maaiveld. De koepels en het open klokkenhuis zijn vereenvoudigd voor een print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1728100000000183): BAG-contour 1684,35 m², inclusief verbonden vleugel; maaiveld NAP +31,038 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): hoogste punt binnen kerkcontour NAP +61,67 m op RD (143400,25, 375481,75), 30,63 m boven maaiveld. De hoogste omliggende rasterpiek ligt buiten het pand. De modeltop is 30,5 m.
- [Parochie Petrus en Paulus](https://www.parochiepetruspaulus.nl/kerken/bladel-2/) vermeldt de bouw in 1925–1926 en de twee fronttorens; [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petrus%27_Bandenkerk_(Bladel)) toont foto's van gevels en vieringtoren.

De koepelvormen, klokkenhuisopeningen, vensters en connected vleugel zijn op basis van AHN en foto's vereenvoudigd en geschat. De zeer dunne kruisen zijn weggelaten. Oorsprong RD (143405,25, 375456), x-as (-0,19, 0,982).

## Genereren

```sh
node scripts/generate-sint-petrus-bandenkerk-bladel.mjs --scale 1000
node scripts/generate-sint-petrus-bandenkerk-bladel.mjs --scale 100
```
