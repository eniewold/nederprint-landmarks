# Antonius Abtkerk, Bokhoven

Het model vervangt BAG-pand `NL.IMBAG.Pand.0796100000260670`. De laatgotische kruiskerk bestaat uit schip, dwarsschip, driezijdig koor, westtoren, dakruiter en aanbouw. De voet ligt 0,5 m onder het maaiveld. De open dakruiter en de spitsen zijn vereenvoudigd en verdikt voor een print op 1:1000 zonder steun.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0796100000260670): BAG-contour, oppervlak 338,28 m² en maaiveld NAP +5,40 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): hoogste meting hoofdtoren NAP +30,10 m, dakruiter NAP +22,87 m. Modeltoppen respectievelijk 24,7 m en 17,4 m boven maaiveld; zeer dunne topversieringen zijn weggelaten.
- [Kerk & Orgel](https://www.kerk-en-orgel.nl/record.php?action=display&id=8921) noemt de toren 27 m hoog; het verschil met het AHN is mede aanleiding de afgeknotte punt en weggelaten haan expliciet te vermelden.
- [BHIC](https://www.bhic.nl/ontdekken/verhalen/de-h-antonius-abtkerk-in-bokhoven) voor bouwgeschiedenis en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Antonius_Abtkerk_(Bokhoven)) voor foto's.

De topbreedte, vensternissen, dakruiter en kleine aansluiting van de aanbouw zijn voor printbaarheid en op basis van de foto's geschat. Oorsprong RD (144359,4, 416499,4), x-as (0,993, 0,117).

## Genereren

```sh
node scripts/generate-antonius-abtkerk-s-hertogenbosch.mjs --scale 1000
node scripts/generate-antonius-abtkerk-s-hertogenbosch.mjs --scale 100
```
