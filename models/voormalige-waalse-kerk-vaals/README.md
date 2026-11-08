# Voormalige Waalse kerk, Vaals

Dit model vervangt BAG-pand `NL.IMBAG.Pand.0981100000003264`. De voormalige kerk, tegenwoordig woongebouw, is vereenvoudigd tot een zaalgebouw met driezijdige sluiting en drie schuine dakvlakken. De voet ligt 0,5 m onder het maaiveld. In tegenstelling tot de algemene taakomschrijving heeft dit gebouw geen kerktoren.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0981100000003264): oppervlakte 178,81 m², maaiveld NAP +211,805 m, nok circa NAP +227,56 m en grondvorm.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): nok circa NAP +227,53 m. In het model is de nok 15,55 m boven het maaiveld.
- [Rijksdienst / Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu08_01/sten009monu08_01_0169.php): bouw omstreeks 1667, buiten gebruik gesteld rond 1800.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/vaals/waalse-kerk-voormalige) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Waalse_Kerk_(Vaals)): historische omschrijving en foto's; het gebouw ligt ingesloten en is beperkt zichtbaar.

De gevelvensters, hun diepte en de exacte detaillering van het dak zijn geschat op basis van beschikbare foto's. De kleine schoorsteen en voormalige windvaan zijn weggelaten voor printbaarheid. Oorsprong RD (199799, 308972), x-as (0,896, -0,444).

## Genereren

```sh
node scripts/generate-voormalige-waalse-kerk-vaals.mjs --scale 1000
node scripts/generate-voormalige-waalse-kerk-vaals.mjs --scale 100
```
