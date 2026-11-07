# Sint Joriskerk Bredevoort

Printbaar landmark van de Sint Joriskerk (monument 6869). Het model vervangt BAG-pand `0197100000014789`. Het omvat de bakstenen kerk met koorsluiting, twee lage zijvleugels, een vierkant klokkenhuis en de ingesnoerde spits. De deur, koorvensters en galmgaten zijn als blinde nissen weergegeven. De fragiele windvanen en fijne kozijnen zijn weggelaten.

## Bronnen en schattingen

- [3DBAG: pand en maaiveld](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0197100000014789), met maaiveld NAP +28,097 m en dakpunten tot ongeveer NAP +43,64 m.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM nabij de toren bereikt NAP +60,15 m, ongeveer 32,05 m boven maaiveld.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/6869) en [foto's vanuit verschillende richtingen](https://commons.wikimedia.org/wiki/Category:Sint-Joriskerk,_Bredevoort) voor de hoofdvorm en zichtbare gevels.

De precieze goot-, nok- en torenmaten, dakhellingen, galmgaten en afmetingen van de vensters en zijvleugels zijn geschat op basis van deze bronnen. De bovenste spits is verbreed tot ongeveer 1 mm op schaal 1:1000. Ook de blinde nissen zijn voor zichtbaarheid vereenvoudigd. De hoogte van het hoogste AHN-punt is een benadering, geen inmeting van de windvaan.

## Controle

De generator maakt een gesloten, samenhangend volume met vlakke onderzijde. De test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, mesh en printbaarheid zonder extra steun op schaal 1:1000. Een uitsnede van 150 × 150 m met en zonder landmark is als 3MF en preview geëxporteerd; daarvan zijn vier gelijke aanzichten naast de PDOK-reconstructie en schuine bronfoto's vergeleken.

Controleer de plaatsing en de aansluiting op het maaiveld op [de kaart](http://localhost:3000/kaart/51.94310/6.61752/200/1x1/0).
