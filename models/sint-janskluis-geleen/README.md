# Sint-Janskluis (Geleen)

Een model van de kluis uit 1699, met het lange zadeldak, de driezijdige sluiting en de met leien beklede dakruiter. Het model vervangt BAG-pand `1883100000039236`. De oorsprong is RD (186309,225; 330142,375) bij de zuidelijke kopgevel; de lokale X-as (0,392; 0,920) loopt naar de sluiting.

## Bronnen en aannames

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1883100000039236): BAG-voetafdruk 74,51 m² en daknok op ongeveer NAP +70,65 m.
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld ongeveer NAP +62,2 m, nok ongeveer 8,4 m en dakruiter tot ongeveer 11,3 m boven maaiveld. In het onderzochte dakruitergebied ontbreken geen rastercellen; de fijne top en kruis kunnen onder de rasterresolutie vallen.
- [Rijksmonumentenregister 16045](https://monumentenregister.cultureelerfgoed.nl/monumenten/16045) en [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/geleen/st-janskluis): geschiedenis, driezijdige sluiting en dakruiter.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Janskluis,_Geleen): schuine foto's van gevels en dakruiter.

De nok en voet volgen de meetgegevens; de vorm van het dak, de plaats en hoogte van de dakruiter zijn hierop en op foto's gebaseerd. De nauwkeurige dakruitervorm, ramen en deuropening zijn geschat en vereenvoudigd; het kruis en de fijne gevelbanden zijn op printschaal weggelaten. De spits is bovenaan verbreed voor 1:1000. De onderzijde is vlak en het model vormt één gesloten bouwdeel.

## Bestanden

De GLB en JSON dienen voor de kaart en de 3MF-export; de STL's zijn op schaal 1:1000 en 1:100. Maak ze opnieuw met `node scripts/generate-sint-janskluis-geleen.mjs --scale 1000` en `--scale 100`. Controleer na wijzigingen de plaatsing en de printondersteuning opnieuw.
