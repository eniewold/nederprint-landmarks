# Kleine Bartholomeuskerk, Beek

Het model omvat de westtoren met piramidespits, het schip met twee trapgevels, het lagere koor met driezijdige sluiting en de zuidelijke aanbouw. Het vervangt BAG-pand `0282100000000932`. De voet ligt op 18,428 m NAP; de torenspits is op circa 19,3 m boven maaiveld gemodelleerd op basis van AHN.

## Bronnen en aannames

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0282100000000932) voor ligging, plattegrond en dakhoogten.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0) voor de hoogte van de toren.
- [Wikimedia Commons: Bartholomeüskerk Beek](https://commons.wikimedia.org/wiki/Category:Bartholome%C3%BCs,_Beek_(Ubbergen)) voor dakvorm, trapgevels, vensters en aanbouw.
- [Monumentinformatie toren](https://allesover024.nl/monument/toren-van-de-kleine-bartholomeus-beek-35807/).

De precieze hoogte en profilering van trapgevels, torenspits, gevelopeningen en aanbouw zijn uit foto's en hoogtepunten geschat; kleine ornamenten zijn vereenvoudigd voor 1:1000. Het model is één gesloten verbonden volume. De test controleert plaatsing, topologie en benodigde ondersteuning; een uitsnede van 150 m met en zonder landmark is geëxporteerd en vanuit vier gelijke richtingen vergeleken met de PDOK-reconstructie en schuine foto's.

Genereren: `node scripts/generate-kleine-bartholomeuskerk-beek.mjs`.
