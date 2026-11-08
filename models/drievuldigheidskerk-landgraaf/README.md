# Drievuldigheidskerk (Rimburg, Landgraaf)

De eenbeukige kruiskerk heeft een schip uit 1726, lagere kruisarmen, een driezijdig koor en een getrapt torenfront met vier topgevels. Het model vervangt BAG-pand `0882100000006960`. De oorsprong is RD (204265; 325350); de lokale X-as (0,625; 0,781) loopt van het zuidwestelijke koor naar het noordoostelijke torenfront.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0882100000006960): BAG-voetafdruk, dakvlakken en maaiveld NAP +85,506 m. De reconstructie mist het bovenste deel van de torenspits.
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): dakvormen en hoogten. De hoogste cel nabij de torenas ligt 27,76 m boven maaiveld; er zijn zes ontbrekende cellen binnen het torendak, maar rondom de as is een oplopend dakprofiel te zien. De top van het model op 28,4 m is een kleine extrapolatie; kruis en windvaan ontbreken.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/rimburg/h-drievuldigheid), [Kerkramen in de Mijnstreek](https://www.kerkramenindemijnstreek.nl/kerken/rimburg-h-drievuldigheidskerk/) en [Rijksmonumentenregister 23855](https://monumentenregister.cultureelerfgoed.nl/monumenten/23855): geschiedenis en foto's van het schip, kruisarmen en torenfront.

De exacte verdeling en diepte van ramen en galmgaten, de dakdetails en het profiel van de torenspits zijn geschat en op 1:1000 vereenvoudigd. De top is verbreed voor printbaarheid; beelden, kruis, windvaan en fijn metselwerk zijn weggelaten. Het model bestaat uit één gesloten bouwdeel met een vlakke onderkant.

## Bestanden

De GLB en JSON dienen voor de kaart en 3MF-export; de STL's zijn op 1:1000 en 1:100. Genereer met `node scripts/generate-drievuldigheidskerk-landgraaf.mjs --scale 1000` en `--scale 100`. Controleer na wijzigingen opnieuw plaatsing en printondersteuning.

Vier eigen maaiveldpunten vlak naast de kerk beperken de meting tot de directe omgeving en vermijden een meetpunt nabij de grens; AHN geeft daar circa NAP +85,59 tot +85,71 m.
