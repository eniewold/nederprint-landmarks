# Sint-Corneliuskerk, Lamswaarde

Neogotische pseudobasilicale kruiskerk met een voorgebouwde toren, vieringsruiter, zijbeuken, koor en zijkapellen, gemodelleerd in echte meters uit afzonderlijke bouwdelen en dakvlakken.

## Bronnen en maten

- [3D BAG pand 0677100000602254](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0677100000602254) geeft plattegrond, dakvlakken en een maaiveld van NAP −0,239 m; de nok van het middenschip ligt ongeveer op NAP +17,2 m.
- PDOK AHN DSM 0,5 m bevat op de torenspits meetpunten tot NAP +41,7 m; de bovenste top en kruis zijn deels niet gemeten. Het model eindigt op 42,0 m boven maaiveld.
- [Rijksmonument 509223](https://monumentenregister.cultureelerfgoed.nl/monumenten/509223) en [RCE-beschrijving](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/509223) beschrijven de kruisvorm en kapellen.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Corneliuskerk_(Lamswaarde)) toont de toren en één lange zijde schuin; een betrouwbaar vrij aanzicht van de achterzijde is niet gevonden en die zijde volgt BAG en PDOK.

De laatste meters van de spits, hoogte van de vieringsruiter, kapellen, koorsteunberen en raam- en deurnissen en de vlakke of lage achteraanbouwen zijn deels geschat. De torenvensters zijn blinde nissen; uurwerken, kruis, fijne lijsten en open lantaarns zijn wegens schaal vereenvoudigd of weggelaten.

## Bestanden en controles

De GLB heeft één bouwdeel `building:kerk` en vervangt BAG-pand `NL.IMBAG.Pand.0677100000602254`; oorsprong RD (62218, 373692), X-as (0,966, 0,2585). STL's zijn op 1:100 en 1:1000 beschikbaar. Regenereer met `node scripts/generate-sint-corneliuskerk-lamswaarde.mjs --scale 100` en daarna `--scale 1000`.

Het model is één gesloten manifold zonder onprintbare ondervlakken; de gerichte test controleert componenten en ondersteuning op 1:1000. Vier renders zijn vergeleken met de PDOK-reconstructie; de beschikbare schuine foto's tonen alleen de toren en dezelfde lange zijde. De koorsluiting en zijkapellen hebben steunberen en vensternissen op basis van de PDOK-reconstructie, waarvan de exacte afmetingen geschat zijn. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd. Nabijgelegen panden zijn afzonderlijk in de PDOK-tegels bekeken.
