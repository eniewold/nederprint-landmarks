# Johanneskerk Feanwâlden

De Johanneskerk (1648, rijksmonument 11701) is een eenbeukige zaalkerk met een veelhoekig gesloten oostzijde en een ingebouwde westtoren met zadeldak. Het model bevat de hoofdvorm, afgeschuinde sluiting, spitsboogvensters, deuren en galmgaten; het vervangt BAG-pand 1891100001636219.

## Bronnen en maatvoering

- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1891100001636219): plattegrond en nokvlakken; maaiveld NAP +1,503 m en nok kerk circa NAP +12,9 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste punt bij de toren NAP +18,092 m. In een 6,5 × 6,5 m raster rond de toren ontbreken 14 van 169 cellen, vooral buiten de toren en langs één dakrand; de nok en overige dakvlakken zijn meetbaar.
- [Rijksmonument 11701](https://monumentenregister.cultureelerfgoed.nl/monumenten/11701) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Feanw%C3%A2lden): de contouren, vier gevels en ingebouwde zadeldaktoren.

Oorsprong RD (195349,5; 583794,3), +X-as (0,9985; 0,055) langs de kerk naar de sluiting, 0,5 m onder maaiveld. Modeltop circa 16,6 m boven het maaiveld. Venster- en deurbreedten, nisdiepten en de torendetails zijn naar foto's geschat en vereenvoudigd. Galmgaten zijn blinde nissen en windvaan, wijzers, glasroeden en kleine ornamenten zijn weggelaten.

## Genereren en controle

`node scripts/generate-johanneskerk-feanwalden.mjs --scale 1000` maakt GLB, JSON en STL op 1:1000. Met `--scale 100` kan ook de STL op 1:100 worden gemaakt. Eén gesloten component, genus 0; de steuncontrole op 45 graden gaf een volumeverhouding van 1,0000000012 en gelijke doorsneden. Volledige 150 × 150 m-uitsneden zijn met en zonder landmark geëxporteerd; vier aanzichten zijn naast PDOK en referentiefoto's beoordeeld.
