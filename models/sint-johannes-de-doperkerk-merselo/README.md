# Sint-Johannes de Doperkerk (Merselo)

De kerk heeft een neogotisch eenbeukig schip met trapgevels, een ouder driezijdig gesloten koor en aan de zuidwestzijde een achthoekige traptoren met naaldspits. Het model vervangt BAG-pand `0984100000410749`. De oorsprong is RD (192676,25; 393548,35), de lokale X-as (0,998; −0,065) loopt van de toren naar het koor.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0984100000410749): gebouwomtrek, daken en lokaal maaiveld NAP +25,78 m. De 3D-reconstructie mist de torenspits.
- [AHN5 DSM](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): raster van 0,5 m toont een aaneengesloten hoogteprofiel zonder ontbrekende cellen rond de top en een piek op NAP +58,61 m. De gemodelleerde top is circa 32,8 m boven het maaiveld; kruis en windvaan vallen mogelijk buiten de rastermeting.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/merselo/johannes-de-doper), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Johannes_de_Doperkerk_(Merselo)) en [Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu08_01/sten009monu08_01.pdf): de huidige verschijningsvorm, naoorlogs herstel van de toren, trapgevels, koor en steunberen.

De exacte spitsvorm, de diepte van vensters en galmgaten, het trapgevelprofiel, kleine aanbouwen en steunberen zijn geschat en voor printschaal vereenvoudigd. De torenpunt is verbreed voor 1:1000; kruisen, windvaan en fijn maaswerk ontbreken. Het model vormt één gesloten bouwdeel met vlakke onderkant.

## Bestanden

GLB en JSON zijn voor kaart en export; STL's zijn op 1:1000 en 1:100. Genereer met `node scripts/generate-sint-johannes-de-doperkerk-merselo.mjs --scale 1000` en `--scale 100`. Controleer na wijzigingen de plaatsing en printondersteuning opnieuw.
