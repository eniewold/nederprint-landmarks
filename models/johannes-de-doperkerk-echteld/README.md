# Johannes de Doperkerk Echteld

Landmark voor de hervormde kerk in Echteld, BAG-pand `1740100000014412`. Het model toont het romaanse schip, het hogere gotische koor met sluiting en steunberen, de westtoren en de aanbouw. De grote vensters, galmgaten en deur zijn vereenvoudigd tot blinde nissen.

De kerk is ouder dan het BAG-bouwjaar 1835: na instorting van de toren werd het schip toen ingekort en de toren herbouwd. Kerk en toren zijn afzonderlijk als rijksmonument geregistreerd.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1740100000014412): maaiveld NAP +7,416 m en kerknok rond NAP +21,7 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): torenspits NAP +29,54 m, circa 22,12 m boven maaiveld.
- [Rijksmonument kerk 14267](https://monumentenregister.cultureelerfgoed.nl/monumenten/14267), [toren 14268](https://monumentenregister.cultureelerfgoed.nl/monumenten/14268), [geschiedenis](https://voorstraat-echteld.nl/de-hervormde-kerk/) en [foto's](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Echteld).

Dakhellingen, goot- en nokhoogten, maten van steunberen, aanbouw en vensternissen zijn geschat uit 3DBAG, AHN en foto's. De kleine spitstop is voor een 1:1000-print verbreed, de windvaan en het fijne maaswerk zijn weggelaten. De hoogste AHN-pixel kan het uiterste punt onderschatten.

## Controle

De generator maakt een gesloten, samenhangend volume met vlakke voet. Een test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m is met en zonder landmark als preview en 3MF geëxporteerd; daarvan zijn vier gelijke aanzichten met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer de plaatsing en aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.90901/5.49932/200/1x1/0).
