# Kloosterkerk (Rottum)

De eenvoudige zaalkerk uit 1889 heeft een afgeschuinde koorsluiting en een dakruiter met ingesnoerde spits boven de voorgevel. Zij staat op een verhoogd kerkhof en is rijksmonument 515316. Het model vervangt BAG-pand 1651100000009942 en bestaat uit één gesloten onderdeel voor afdruk op 1:1000 zonder steun.

## Plaats, maten en aannames

De oorsprong is RD (237099,979; 600373,032); de lokale +X-as (0,954721; 0,297504) loopt van de voorgevel naar het koor. Monsterpunten op het kerkterrein geven circa NAP +4,22 tot +4,62 m; het referentiemaaiveld is NAP +4,3 m. De reeds in het terrein aanwezige wierde is niet meegemodelleerd.

BAG en 3DBAG geven de plattegrond en de dakvlakken. Voor de dakruiter meet AHN4 één hoogste cel NAP +21,621 m en direct daarnaast maximaal circa +18,35 m; AHN3 meet op ongeveer dezelfde plek hooguit +18,35 m. Beide rasters zijn daar gevuld, maar door de geringe breedte van de spits zijn er geen afzonderlijke meetpunten voor de hele hoogte tussen deze waarden. De hoogste AHN4-cel kan de naald of een deel van het topornament omvatten; AHN3 kan het smalle bovenstuk missen. De printbare dakpunt is naar fotoverhoudingen en beide meetjaren geschat op circa 16,5 m boven het referentiemaaiveld (NAP +20,8 m). De werkelijke dakpunt kan enkele meters afwijken. De dunne windvaan en bol zijn weggelaten.

De afmetingen van de dakruiter, galmgat- en vensternissen, het roosvenster en de ingang zijn naar foto's geschat en vereenvoudigd tot blinde nissen. De uitkragende dakruiterkap heeft een schuine overgang voor printbaarheid. Fijn maaswerk en grafstenen zijn weggelaten.

## Bronnen en controle

- [Rijksmonumentenregister 515316](https://monumentenregister.cultureelerfgoed.nl/monumenten/515316)
- [Monumenten.nl: beschrijving kerk en dakruiter](https://www.monumenten.nl/monument/515316)
- [3DBAG gebouwgegevens](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000009942)
- [PDOK AHN4 WCS, DSM en DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [AHN3 DSM WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/94037eea-4196-48db-9f83-0ef330a7655e?request=getCapabilities&version=1.0.0&requestedEpsg=28992)
- [Foto voorgevel](https://commons.wikimedia.org/wiki/File:Hervormde_kerk_Rottum.JPG), [schuine foto](https://commons.wikimedia.org/wiki/File:Rottum_-_Kloosterkerk.jpg), [noord- en oostgevel](https://commons.wikimedia.org/wiki/File:Overzicht_noordgevel_en_oostgevel_-_Rottum_-_20372411_-_RCE.jpg) en [zuidgevel](https://commons.wikimedia.org/wiki/File:Overzicht_zuidgevel_-_Rottum_-_20372412_-_RCE.jpg).

Bestanden: GLB en JSON voor de kaart en STL op 1:100 en 1:1000 voor de afdruk. Genereer met `node scripts/generate-kloosterkerk-rottum.mjs` en met `--scale 100` voor het grotere printbestand. Controleer de plaatsing, dakruiter, ingang en aansluiting op de wierde op [de kaart](http://localhost:3000/kaart/53.38336/6.62101/200/1x1/0).
