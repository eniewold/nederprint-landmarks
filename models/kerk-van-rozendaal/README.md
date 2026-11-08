# Kerk van Rozendaal

Model van de Kerk van Rozendaal en de direct aangebouwde pastorie, Kerklaan 15–17. De kerk werd in 1758 ingewijd en is rijksmonument 32951. De kerk heeft geen toren: kerk en pastorie vormen samen een hoog bouwvolume onder een afgeplat schilddak. De bron voor dit model is BAG-pand 0277100000000830.

## Bronnen en maten

- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/32951) en [geschiedenis van de kerk](https://www.dekerkvanrozendaal.nl/kerkgebouw/geschiedenis).
- [Wikimedia Commons: foto's van kerk en pastorie](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Rozendaal).
- BAG voor de grondvlakken, 3DBAG LoD2.2 voor dakvlakken en aanbouwen en AHN DSM voor de hoogtecontrole. Het maaiveld is circa NAP +40,42 m, de afgeplatte dakbovenkant circa NAP +56,64 m. Van 1030 AHN-cellen boven het hoofdgebouw zijn er 1001 geldig; de dakhoogte en hellingen zijn ondersteund door het 3DBAG-dak en foto's.

Het model bevat het hoofdvolume, het afgeplatte schilddak, twee schoorstenen, de lagere vleugels en achterentrees, steunberen, rondboogvensters en pastorievensters. Hoogten van de kleine aanbouwen, plaatsing van de ramen, schoorstenen en steunberen zijn geschat en vereenvoudigd. De zeer kleine klok en klokkenstoel aan de noordoosthoek, fijn raamwerk en dunne dakranden zijn wegens de schaal weggelaten. Het complex is circa 29,9 bij 22,4 m groot; de hoogste schoorsteen ligt circa 17,7 m boven het gebruikte maaiveld.

## Productie en controle

Het model is één gesloten volume voor afdruk op 1:1000 zonder steunmateriaal. Genereer GLB, catalogus-JSON en STL met `node scripts/generate-kerk-van-rozendaal.mjs` in de landmarks-repository. De webshop bevat een catalogus- en printtest in `tests/landmark-models.test.ts`. Een uitsnede van 150 bij 150 m is geëxporteerd en het model is van vier zijden met PDOK en foto's vergeleken. Controleer de ligging via [de kaart](http://localhost:3000/kaart/52.00752/5.96342/200/1x1/0).
