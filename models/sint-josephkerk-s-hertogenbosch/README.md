# Sint Josephkerk, 's-Hertogenbosch

Het model vervangt BAG-pand `NL.IMBAG.Pand.0796100000239427`. De voormalige kloosterkerk, nu Orangerie, heeft een breed schip met kruisende kappen, veelhoekig koor, karakteristieke gelede straatgevel en vieringsbekroning. De voet ligt 0,5 m onder maaiveld. Traceringen en kleine details zijn vereenvoudigd voor een print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0796100000239427): BAG-contour, oppervlak 1132,9 m² en maaiveld NAP +4,901 m; de kapnok ligt rond NAP +31,17 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): hoogste punt vieringsbekroning NAP +37,22 m; in het model 32,3 m boven maaiveld.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/21845) voor de omschrijving van de kerk en de voorgevel.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Josephkerk,_%27s_Hertogenbosch) voor gevel- en exterieurfoto's.

De geveldetaillering, diepte van spitsboognissen, koorvorm en breedte van de vieringsbekroning zijn naar foto's en hoogtegegevens geschat. Oorsprong RD (149532,7, 411290,7), x-as (0,9999, -0,015).

## Genereren

```sh
node scripts/generate-sint-josephkerk-s-hertogenbosch.mjs --scale 1000
node scripts/generate-sint-josephkerk-s-hertogenbosch.mjs --scale 100
```
