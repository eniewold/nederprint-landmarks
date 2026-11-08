# Kerk van Marum (Marum)

Romaanse zaalkerk met inspringend koor, vijfzijdige sluiting en aangebouwde westtoren, rijksmonument 28286. Het model vervangt BAG-pand 0025100000007244 en vormt één gesloten onderdeel dat zonder steun op 1:1000 is ontworpen.

## Plaats, maten en aannames

De oorsprong is RD (212922,458; 573520,971); de lokale +X-as (-0,9559; -0,2937) loopt van het koor naar de toren. Het maaiveld bedraagt rond het gebouw ongeveer NAP +3,2 m. Grondmonsterpunten liggen op het kerkterrein; de heuvel zelf is geen onderdeel van het model.

De BAG-contour en 3DBAG-dakvlakken bepalen de hoofdmaten. AHN4 geeft aan de top van de spits een maximale waarde NAP +27,854 m en een aaneengesloten raster met oplopende waarden eromheen; AHN3 geeft op dezelfde plaats circa +27,49 m. De printbare top is afgerond 24,65 m boven maaiveld, en de kerknok circa 11,05 m. De rasterresolutie en het fijne topornament beperken de nauwkeurigheid van de spitsmeting. Windvaan en bollen zijn weggelaten.

De precieze vorm van de kap, de afmetingen van venster- en galmgatnissen en de schuine steunberen zijn naar foto's geschat en vereenvoudigd voor afdruk; de openingen zijn blinde nissen. De omliggende graven en het oorlogsgedenkteken zijn geen onderdeel van dit model.

## Bronnen en controle

- [Rijksmonumentenregister 28286](https://monumentenregister.cultureelerfgoed.nl/monumenten/28286)
- [3DBAG gebouwgegevens](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0025100000007244)
- [PDOK AHN4 WCS, DSM en DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [AHN3 DSM WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/94037eea-4196-48db-9f83-0ef330a7655e?request=getCapabilities&version=1.0.0&requestedEpsg=28992)
- [Foto zuidzijde](https://commons.wikimedia.org/wiki/File:Marum_-_kerk_van_zuid.jpg), [schuin aanzicht](https://commons.wikimedia.org/wiki/File:Marum,_de_Hervormde_kerk_RM28286_foto2_2015-05-10_15.11.jpg), [koorzijde](https://commons.wikimedia.org/wiki/File:Exterieur_vanuit_het_oosten_-_Marum_-_20151224_-_RCE.jpg), [zijaanzicht](https://commons.wikimedia.org/wiki/File:Exterieur_vanuit_het_zuid-oosten_en_vanuit_het_noord-oosten_-_Marum_-_20151225_-_RCE.jpg).

Bestanden: GLB en JSON voor de kaart en STL op 1:100 en 1:1000 voor de afdruk. Genereer met `node scripts/generate-de-protestantse-gemeente-marum-noordwijk.mjs` en met `--scale 100` voor het grotere printbestand. Controleer oriëntatie, koor, spits en terreinaansluiting op [de kaart](http://localhost:3000/kaart/53.14528/6.25289/200/1x1/0).

