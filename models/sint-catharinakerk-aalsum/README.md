# Sint Catharinakerk Aalsum

Romaanse zaalkerk met versmald koor en halfronde apsis, in 1843 voorzien van een houten geveltoren. Het model vervangt BAG-pand 0058100000201649.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000201649): grondvorm, maaiveld NAP +4,819 m en nok NAP +14,262 m. De gebruikte AHN5-gegevens hebben geen ontbrekende cellen binnen het pand.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste cel bij de geveltoren NAP +18,73 m.
- [Schuine exterieurfoto](https://www.friesland.nl/nl/locaties/3852337548/sint-catharinakerk): herkenbare apsis, versmalling en houten lantaarn.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/31553) en [Noordelijk Oostergo](https://www.dbnl.org/tekst/berg229noor02_01/berg229noor02_01_0019.php): geschiedenis en beschrijving.

## Model en schattingen

Schip, koor en halfronde apsis zijn bouwdelen met dakvlakken; de toren bestaat uit een stevige, gesloten lantaarn met nissen en een kleine kap. De opengewerkte lantaarn en het sierwerk zijn wegens de schaal vereenvoudigd. Posities en vormen van de nissen en de dakruiter zijn geschat naar de foto en AHN. De vierzijdige vergelijking met PDOK en de schuine foto bevestigt de hoofdvorm; de PDOK-reconstructie geeft de toren zeer schematisch weer. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `sint-catharinakerk-aalsum.glb`: kaartmodel
- `sint-catharinakerk-aalsum.json`: catalogus en plaatsing
- `sint-catharinakerk-aalsum-1-100.stl`: printmodel 1:100
- `sint-catharinakerk-aalsum-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-sint-catharinakerk-aalsum.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
