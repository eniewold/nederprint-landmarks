# Kruiskerk Buitenpost

De voormalige gereformeerde kerk aan de Voorstraat werd in 1887 in gebruik genomen. Het model bestaat uit de torenloze zaalkerk, een zijvleugel en de lagere aansluitende bouwdelen van het huidige kerkcentrum. Het vervangt BAG-pand 0059100000821712 en steekt 0,3 m in de grond.

## Bronnen en maten

- [Historie van de Gereformeerde Kerk te Buitenpost](https://gereformeerdekerken.info/2022/07/05/de-gereformeerde-kerk-te-buitenpost-2/)
- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000821712), PDOK 3D Basisvoorziening en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa NAP +1,48 m en kerknok +14,89 m.
- [Foto voorgevel](https://commons.wikimedia.org/wiki/File:B%C3%BBtenpost,_Kr%C3%BAstsjerke.jpg).

De geometrie van de moderne achterbouw en het dak van de zijvleugel is vereenvoudigd op basis van 3DBAG en AHN; de hoogtes en plaats van deur- en raamnissen zijn geschat uit foto's. Een opname van de achterzijde ontbreekt; het daklandschap van de aanbouw is daardoor met lagere nauwkeurigheid gemodelleerd. Fijne gevelversiering en het dunne kruis zijn voor 1:1000 weggelaten.

## Export en controle

De generator `scripts/generate-kruiskerk-buitenpost.mjs` schrijft GLB, metadata en STL's voor 1:1000 en 1:100. Het model is opgebouwd uit bouwdelen en dakvlakken en vormt één gesloten volume. De test controleert plaatsing, topologie en steunvrij printen bij 45 graden. Kaartcontrole: http://localhost:3000/kaart/53.25417/6.14086/200/1x1/0.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
