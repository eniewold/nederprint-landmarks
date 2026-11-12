# Bethelkerk Assen

Voormalige synagoge uit 1901 aan de Groningerstraat, ontworpen door J. Smallenbroek en later in gebruik genomen als Bethelkerk. Het gebouw is rijksmonument 469365. Het model vervangt BAG-pand 0106100000000974.

## Bronnen en maatvoering

- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/469365) en [huidige kerkgemeente](https://cgk-assen.nl/geschiedenis/): historische identiteit en architectuur.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000974): contour, kap en achteraanbouw. PDOK AHN DSM 0,5 m bevat bruikbare AHN4-metingen; in het onderzochte gebied zijn slechts vier verspreide cellen afwezig.
- [Commons](https://commons.wikimedia.org/wiki/Category:Bethelkerk_(Assen)): straatgevel, hoekpilasters en middenrisaliet.

De oorsprong is RD (234000, 557267), lokale X-as (0,9857, −0,1685), vanaf de straat richting achterbouw. Het gebruikte maaiveld is NAP +10,863 m. De nok is circa 14,98 m en de gevelbekroning circa 17,7 m boven maaiveld. Onderkant van het model −0,5 m; geen grondplaat.

## Interpretatie en printbaarheid

De maatvoering van de voorgevel, bekroningen en ramen is benaderd op basis van foto's en hoogtedata; dun metselwerk en raamroeden zijn weggelaten. De rondbogen zijn vereenvoudigd tot ondiepe drukbare nissen en de puntjes verbreed tot minstens 0,9 m. Het model is opgebouwd uit bouwdelen en dakvlakken. De 1:1000-export meet circa 44,3 × 12,3 × 18,2 mm en bestaat uit één gesloten volume; de generator controleert Float32-geslotenheid en onondersteunde vlakken.

## Genereren

```sh
node scripts/generate-christelijke-gereformeerde-kerk-bethelkerk-assen.mjs --scale 1000 --components
node scripts/generate-christelijke-gereformeerde-kerk-bethelkerk-assen.mjs --scale 100
```


## Bestanden en controle

De map bevat de GLB voor kaart en export, de catalogus-JSON en STL-bestanden op 1:100 en 1:1000. De vier modelaanzichten zijn vergeleken met de PDOK-gebouwreconstructie en beschikbare foto’s van de voorzijde. De modeltest controleert de catalogusplaatsing, één gesloten component, genus nul en overhangondersteuning. De kaartcontrole beoordeelt positie, oriëntatie, vervanging van het BAG-pand en aansluiting op het maaiveld.
