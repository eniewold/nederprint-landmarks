# De Fontein Schoonoord

De voormalige hervormde Waterstaatskerk uit 1866 is rijksmonument 33785. Sinds 2019 is het gebouw buiten gebruik als kerk en later tot woningen verbouwd. Het model toont het schilddak, de middenrisaliet en de naar het dak verplaatste klokkenruiter. Het vervangt BAG-pand 0109100000015114 en steekt 0,3 m in de grond.

## Bronnen en maatvoering

- [Monumenten.nl: geschiedenis en rijksmonument](https://www.monumenten.nl/monument/33785)
- [Geheugen van Drenthe: kerk en verplaatsing toren](https://www.geheugenvandrenthe.nl/encyclopedie-drenthe/schoonoord)
- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000015114), PDOK 3D Basisvoorziening en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa NAP +19,21 m, nok +31,74 m, ruiterpiek +37,47 m; geen ontbrekende AHN-cellen binnen de voetafdruk.
- [Exterieurfoto](https://commons.wikimedia.org/wiki/File:Hervormde_kerk_in_Schoonoord_v1.jpg).

Afmetingen van de dakruiter, het fronton en de raam- en deurnissen zijn geschat op basis van de foto en hoogtemeting. Het open klokkenhuis is voor printbaarheid als gesloten bouwdeel met blinde nissen uitgevoerd; dunne hekken en windvaan zijn weggelaten.

## Export en controle

De generator `scripts/generate-de-fontein-schoonoord.mjs` schrijft GLB, catalogusmetadata en STL's voor 1:1000 en 1:100. De geometrie bestaat uit bouwdelen en dakvlakken en vormt één gesloten volume. De test controleert de plaatsing, topologie en steunvrij printen bij 45 graden. Kaartcontrole: http://localhost:3000/kaart/52.84682/6.75991/200/1x1/0.


De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
