# Sint-Lambertuskerk, Neeritter

Het model vervangt BAG-pand `NL.IMBAG.Pand.1640100000053033`. De ligging en omtrek volgen BAG en de PDOK 3D-reconstructie; de volumes bestaan uit toren, lantaarn, schip, zijbeuken, koor en steunberen. De opbouw is vereenvoudigd voor een print op 1:1000 zonder ondersteuning. Het model heeft een ingegraven voet van 0,5 m.

## Bronnen en maten

- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/neeritter/lambertus): beschrijving en foto's van de kerk en toren.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Lambertus,_Neeritter): foto's van verschillende zijden.
- PDOK 3D Basisvoorziening en BAG: positie, grondvorm en dakvlakken.
- AHN5, officiële [WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): hoogste gemeten punt bij de toren NAP +62,26 m; terrein rond NAP +28,74 m. Het model eindigt op 33,15 m boven het terrein. De kleine hoogste versiering is voor printbaarheid vereenvoudigd.

Dakvlakken, ramen, steunberen en de achthoekige lantaarn zijn op grond van hoogtepunten en foto's benaderd; diepte van nissen en kleine aanbouwen zijn geschat. Het kruis en andere zeer dunne details zijn weggelaten. De grondpositie is RD (184204, 352736,5), met een lokale oost-as van ongeveer (0,999, 0,045).

## Genereren

```sh
node scripts/generate-sint-lambertuskerk-neeritter.mjs --scale 1:1000
node scripts/generate-sint-lambertuskerk-neeritter.mjs --scale 1:100
```
