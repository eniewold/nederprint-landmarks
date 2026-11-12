# Obadja Zorgvlied

Obadja is een houten kapel uit 1904; in 1968 werd zij verlengd. Het model bestaat uit de rechthoekige kapel met zadeldak, achterschild en gevelruiter. Het vervangt BAG-pand 1701100000205872 en steekt 0,3 m in de grond. Het BAG-bouwjaar 1840 wijkt af van de historische bronnen die de kapel in 1904 dateren.

## Bronnen en maatvoering

- [Historie van de evangelisatievereniging](https://www.gemeentediever.nl/religie/hervormde-evangelisatievereniging-obadja/index.html)
- [In Westerveld: bouw in 1904 en uitbreiding](https://www.inwesterveld.nl/obadja-kapel-in-zorgvlied/)
- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1701100000205872), PDOK 3D Basisvoorziening en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa NAP +8,12 m en nok circa +14,65 m.
- [Voorzijde](https://commons.wikimedia.org/wiki/File:Zorgvlied-Obadjakapeln.jpg) en [achterzijde](https://commons.wikimedia.org/wiki/File:Begraafplaats_in_Zorgvlied,_Drenthe.jpg).

Er zijn geen lege AHN-cellen in de voetafdruk, maar bomen verstoren sommige metingen; de hoogte van het geveltorentje is daarom geschat op circa NAP +16,92 m op basis van foto en nabijgelegen geldige punten. Het torentje en de raamnissen zijn iets verbreed tot minstens 0,9 m voor 1:1000; kleine geveldetails zijn weggelaten.

## Export en controle

De generator `scripts/generate-obadja-zorgvlied.mjs` schrijft GLB, catalogusmetadata en STL's voor 1:1000 en 1:100. Het model is uit bouwdelen en dakvlakken samengesteld en vormt één gesloten volume. De test controleert plaatsing, topologie en steunvrij printen bij 45 graden. Kaartcontrole: http://localhost:3000/kaart/52.92019/6.25703/200/1x1/0.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
