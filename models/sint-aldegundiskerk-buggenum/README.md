# Sint-Aldegundiskerk (Buggenum)

De huidige kerk bestaat uit het na de verwoesting in 1944 herbouwde driebeukige schip (1948–1949), de naoorlogse toren (1959) en het behouden oudere, driezijdig gesloten koor. De GLB vervangt BAG-pand `1640100000035611`. De oorsprong is RD (196449,6; 360424,6), met de X-as (0,9998; 0,022) vanaf de toren naar het koor.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1640100000035611): BAG-voetafdruk, dakvlakken en maaiveld NAP +18,94 m. De reconstructie mist de hoge spits.
- [Officieel AHN5 DSM via WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): een raster van 0,5 m toont in het torentopgebied een aaneengesloten hoogteprofiel met piek NAP +65,65 m, circa 46,7 m boven het maaiveld. De uiterst dunne top en windvaan kunnen boven de rastermeting uitsteken.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/buggenum/aldegundis) en [Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu08_01/sten009monu08_01_0032.php): geschiedenis en foto's van de huidige kerk. Vooroorlogse afbeeldingen van de in 1944 vernielde kerk zijn niet als huidige toestand gebruikt.

De exacte vorm van de bovenste spits, de venster- en galmgatdiepte, kleine aanbouwen en details van steunberen zijn geschat en vereenvoudigd; de top is verbreed om op 1:1000 te printen. Kruis, windvaan en fijne geveldetails zijn weggelaten. Het model is één gesloten bouwdeel met vlakke onderzijde.

## Bestanden

GLB en JSON dienen voor de kaart en export; STL's zijn op 1:1000 en 1:100. Genereer met `node scripts/generate-sint-aldegundiskerk-buggenum.mjs --scale 1000` en `--scale 100`. Controleer na wijzigingen opnieuw de plaatsing en ondersteuning.
