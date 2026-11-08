# Heilig Hartkerk, Breda

Neogotische kruiskerk met asymmetrische westtoren en hoge naaldspits, gemodelleerd als één gesloten bouwdeel voor 1:1000. Het model vervangt BAG-pand 0758100000039086. De generator staat in `scripts/generate-heilig-hartkerk-breda.mjs`.

## Bronnen en maatvoering

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000039086): ligging, omtrek en maaiveldhoogte +1,54 m NAP.
- [AHN5 via officiële WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec): hoogste rasterpunt binnen de pandomtrek +59,58 m NAP, ongeveer 58,04 m boven maaiveld. Enkele cellen bij de spits ontbreken; de onafhankelijke [hoogtevermelding](https://www.skydb.net/overview/908956617/breda/) van 58 m bevestigt de orde van grootte.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Heilige_Hart_(Breda)): foto's voor de hoofdvorm, de voorgevel en toren.

Het kruis, de zijbeuken, entree, raam- en galmgatnissen en de kleine hoektorentjes zijn naar foto en raster geschat en vereenvoudigd. Het ronde roosvenster is als steunvrije spitsvormige nis geïnterpreteerd; fijne traceringen, kruisen en ornamenten zijn weggelaten of voor de schaal vereenvoudigd. De voeten en dakvlakken zijn voor printbaarheid aangepast.

## Controle

De generator maakt GLB en STL op 1:100 en 1:1000. Het volume is gesloten, bestaat uit één component en heeft genus nul. Een gerichte test controleert de catalogus, modelgrenzen en geometrie. Voor de kaartvergelijking zijn exports van dezelfde ruime uitsnede met en zonder landmark gemaakt; vergelijk ook de torenpositie, voorgevel en aansluiting op het terrein op de controlekaart.
