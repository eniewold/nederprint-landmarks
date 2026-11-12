# Hervormde Kerk Ooltgensplaat

De Hervormde Kerk is een zaalkerk uit 1847 met een haakse zijvleugel en een gepleisterde klassieke voorgevel die in de toren overgaat. Het model vervangt BAG-pand `0580100000248384`.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0580100000248384): contour en dakvlakken, nok rond 14,07 m NAP en bovenzijde van de torenschacht rond 18 m NAP.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa 0,45 m NAP en hoogste geregistreerde punt circa 22,41 m NAP. De smalle spitspunt is waarschijnlijk niet volledig bemonsterd.
- [Rijksmonument kerk 31697](https://monumentenregister.cultureelerfgoed.nl/monumenten/31697) en [toren 31698](https://monumentenregister.cultureelerfgoed.nl/monumenten/31698): identificatie en karakteristiek van de voorgevel.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Ooltgensplaat): actuele foto's van toren en historische schuine beelden van zij- en achtergevels.

De spits is circa 24,7 m boven maaiveld geschat uit de verhoudingen op de foto's; de top is voor 1:1000 verbreed tot 1 mm. Gevelschouders, portaal, nissen, galmgaten en aanbouw zijn naar foto's en BAG vereenvoudigd en geschat. Dunne dakrandhekken, wijzerplaat, kozijnen en windvaan zijn weggelaten. Oorsprong RD (83253; 411041,4), lokale x-as (0,12; 0,9928); de onderkant zakt 0,5 m in de terreinplaat.

## Productie en controle

Met `node scripts/generate-hervormde-kerk-ooltgensplaat.mjs` worden GLB, JSON en STL's voor 1:100 en 1:1000 gegenereerd. De gerichte test in `tests/landmark-models.test.ts` controleert catalogusplaatsing, één gesloten volume, ondersteuning en doorsneden. Het model is van vier kanten vergeleken met de PDOK-reconstructie en schuine foto's; PDOK kapt de spits af.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
