# O.L. Vrouw Geboortekerk Gellicum

Landmark voor de rooms-katholieke kerk van Onze Lieve Vrouw Geboorte in Gellicum, BAG-pand `0236100000007176`. Het model omvat de twee beuken, het driezijdig gesloten koor, de sacristie, de toren en het tegen de toren aangebouwde voormalige rechthuis. Portaal, galmgaten en grote vensters zijn als blinde nissen vereenvoudigd.

De kerk heeft middeleeuwse oorsprong; het jaar 1636 is verbonden aan het rechthuis en geeft niet de ouderdom van de gehele kerk aan. Kerk, toren en rechthuis hebben afzonderlijke monumentnummers maar zijn in hetzelfde BAG-pand opgenomen.

## Bronnen en schattingen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000007176): maaiveld NAP +3,261 m en kerknok rond NAP +17,2 m.
- [AHN DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torenpixel NAP +30,22 m, ongeveer 26,96 m boven maaiveld.
- Rijksmonumentenregister [kerk 16506](https://monumentenregister.cultureelerfgoed.nl/monumenten/16506), [toren 16507](https://monumentenregister.cultureelerfgoed.nl/monumenten/16507) en [rechthuis 16505](https://monumentenregister.cultureelerfgoed.nl/monumenten/16505); [regionale geschiedenis](https://regionaalarchiefrivierenland.nl/gellicum) en [foto's rondom de kerk](https://commons.wikimedia.org/wiki/Category:O.L._Vrouw_Geboortekerk,_Gellicum).

De goothoogten, dakhellingen en precieze afmetingen van aanbouwen, steunberen en vensternissen zijn geschat uit 3DBAG, AHN en foto's. De torenspits is tot 27 m geschat en de kleine punt is voor de 1:1000-print verbreed; windvaan en maaswerk zijn weggelaten.

## Controle

De generator maakt één gesloten volume met vlakke voet. De test in `tests/landmark-models.test.ts` controleert plaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m met en zonder landmark is als preview en 3MF geëxporteerd en van vier gelijke richtingen met de PDOK-reconstructie en schuine foto's vergeleken.

Controleer de plaatsing en aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.87671/5.15631/200/1x1/0).
