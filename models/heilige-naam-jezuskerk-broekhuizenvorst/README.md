# Heilige Naam Jezuskerk, Broekhuizenvorst

Landmarkmodel van de gotische kruiskerk aan de Hoogstraat, met schip, lagere zijbeuk, koor, kruisarmen en westtoren met naoorlogse spits. Vervangt BAG-pand `1507100000009631`. De plaatsing gebruikt RD-oorsprong (208484.8, 389855.1) en een lokale lengteas (0.967, 0.255).

## Bronnen en aannames

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1507100000009631): voetafdruk, plaatsing en globale dakvlakken.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld ongeveer NAP +17,3 m en globale dakhoogten. De spits zelf valt in een AHN-gat; de omringende meetpunten zijn onvolledig.
- [Historisch verslag van de wederopbouw, Info LGOG 57](https://www.lgogterhorst.nl/info_lgog/INFOLGOG%20no%2057.pdf): torenhoogte 47 m. Het model benadert deze hoogte met 46,55 m boven lokaal maaiveld; de ontbrekende windvaan is niet gemodelleerd.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/broekhuizenvorst/h-naam-jezus) en [beeldmateriaal Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Heilige_Naam_Jezuskerk_(Broekhuizenvorst)): verschijningsvorm en naoorlogse wederopbouw.

De fijne plaats, diepte en afmetingen van vensters, nissen en steunberen, het profiel van de torenhelm, de exacte beëindiging van het koordak en de kleinere aanbouwen zijn geschat en voor schaal 1:1000 vereenvoudigd. De spits is bovenaan verbreed voor een bruikbare print; kruis en windvaan ontbreken. Het maaiveld is lokaal geschat. De geometrie is één gesloten bouwdeel; de STL heeft een vlakke onderzijde en is bedoeld om rechtop zonder steun te printen.

## Bestanden genereren

`node scripts/generate-heilige-naam-jezuskerk-broekhuizenvorst.mjs --scale 1000` maakt GLB, metadata en STL op schaal 1:1000; gebruik `--scale 100` voor de grotere STL. Controleer bij gewijzigde geometrie de plaatsing en ondersteuning opnieuw.
