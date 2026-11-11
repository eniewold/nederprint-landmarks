# Dorpskerk (Staphorst)

Vereenvoudigd model van de Hersteld Hervormde Dorpskerk aan Gemeenteweg 52. De toren hoort bij de kerk van 1753; het oude kerkgebouw is in 1952 vervangen en het huidige gebouw is rond 1990 uitgebreid.

## Onderdelen en maten

Het model omvat de bakstenen toren met achtzijdige spits, centrale kap met twee lagere langskappen, vier dwarskappen per zijde, lagere entrees en twee dakinstallaties. De grote vensters, torenopeningen, wijzerplaten en toegang zijn ondiepe nissen. De voet ligt 0,5 m onder maaiveld. De oorsprong is RD (210500, 517860), +X loopt langs de hoofdnok in richting (0,621727, -0,783234). Het vervangt BAG-pand `NL.IMBAG.Pand.0180100000001058`.

Het 3D BAG-maaiveld is NAP +2,176 m; de hoogste nok van het schip ligt circa 17,68 m daarboven. AHN4 ziet de dunne torenspits tot circa 30,9 m boven maaiveld; de top van het model op 32 m en de precieze knik in het spitsdak zijn geschat. Torenvensters, de entree en de posities en hoogtes van de nissen zijn naar foto's geschat. De twee dakinstallaties volgen de posities en globale omtrek op 3D BAG en de luchtfoto, maar hun detaillering is vereenvoudigd. Glasroeden, wijzers, windvaan en kleine onderdelen onder 0,9 m zijn weggelaten. De achtergevel is niet met een afzonderlijke schuine foto geverifieerd en is vereenvoudigd.

## Bestanden en controle

De GLB is de bron voor kaart en export (meters, Y omhoog). De STL-bestanden zijn in millimeters op schaal 1:100 en 1:1000. Genereer met `node scripts/generate-dorpskerk-staphorst.mjs`.

De gerichte catalogus- en printtest controleert positie, één gesloten component en het resultaat van 45°-overhangopvulling op 1:1000. De generator meldt `NoError`, één component en genus 0. De PDOK-gebouwmesh is met het model vanuit vier schuine richtingen vergeleken: het model reconstrueert de in PDOK afgeknotte spits en voegt gevelopeningen toe, terwijl de langskappen, dwarskappen en dakinstallaties behouden blijven. Er zijn geen andere PDOK-panden binnen 10 m van de modelvoet. De kaart en een volledige uitsnede in de preview op 1:1000 zijn gecontroleerd.

## Bronnen

- [Rijksmonument 34246](https://monumentenregister.cultureelerfgoed.nl/monumenten/34246) en [Monumenten in Nederland: Overijssel](https://www.dbnl.org/tekst/sten009monu03_01/sten009monu03_01.pdf): toren en kerkgeschiedenis.
- [3D BAG, pand 0180100000001058](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0180100000001058): voetafdruk, dakvlakken en maaiveld. AHN4 heeft hier 23,5% nodata; 3D BAG koos AHN3 als dakbron.
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): hoogte en dakdetails.
- [Dorpskerk, Commons 2010](https://commons.wikimedia.org/wiki/File:Dorpskerk-Staphorst.jpg), [voorzijde, Commons 2021](https://commons.wikimedia.org/wiki/File:Staphorst_Hersteld_Hervormde_Kerk.jpg) en [noord- en westgevel, RCE 1992](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_NOORDGEVEL,_WESTGEVEL_-_Staphorst_-_20276820_-_RCE.jpg).
