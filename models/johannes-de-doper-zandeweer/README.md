# Johannes de Doper (Zandeweer)

Middeleeuwse zaalkerk met halfronde koorsluiting en een vrijstaande zadeldaktoren met kleine dakruiter. Kerk en toren zijn afzonderlijke bouwdelen en rijksmonument 23471; zij vervangen respectievelijk BAG-panden 1651100000009258 en 1651100000009271.

## Plaats, maten en aannames

De oorsprong is RD (241126,977; 600924,280); de lokale +X-as (-0,999513; -0,031219) loopt vanaf het koor westwaarts. De toren staat zuidelijk van en los van de kerk. Het terrein rond de toren ligt volgens AHN-DTM ongeveer NAP +1,4 tot +1,8 m, rond de kerk circa +2,7 m. De catalogus bemonstert op punten bij de toren en het model plaatst de kerkvoet circa 1,3 m hoger dan de torenvoet. Controleer beide aansluitingen aan het terrein in kaart en preview; een terreinheuvel is niet meegemodelleerd.

BAG en 3DBAG geven de contouren en dakvlakken van beide panden. AHN4 meet boven de dakruiter aangrenzende cellen NAP +25,408 en +25,077 m zonder NoData direct eromheen; AHN3 bevestigt +24,817 en +24,303 m. De printbare dakpunt is gekozen op circa 24,0 m boven het referentiemaaiveld NAP +1,4 m. Het fijne topornament en de windvaan zijn weggelaten; de rasterresolutie begrenst de nauwkeurigheid.

De halfronde sluiting, vensters en de galmgaten en dakruiter van de toren zijn naar foto's vereenvoudigd en hun exacte afmetingen zijn geschat. De kleine open dakruiter is voor printbaarheid als gesloten bouwdeel weergegeven; muuropeningen zijn blinde nissen.

## Bestanden, bronnen en controle

GLB en JSON bevatten twee afzonderlijke gesloten onderdelen met hun werkelijke hoogteverschil. De gewone STL's plaatsen beide losse delen op dezelfde printvloer; de aparte STL's met grondplaat verbinden ze voor een gezamenlijke afdruk. Beide varianten zijn beschikbaar op 1:100 en 1:1000. Genereer met `node scripts/generate-johannes-de-doper-zandeweer.mjs` en met `--scale 100` voor de grotere afdruk.

- [Rijksmonumentenregister 23471](https://monumentenregister.cultureelerfgoed.nl/monumenten/23471)
- [Groninger Encyclopedie: kerk en vrijstaande toren](https://groningen.erfgoedcms.nl/groningen/plaats/zandeweer)
- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000009258) en [3DBAG toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000009271)
- [PDOK AHN4 WCS, DSM en DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [AHN3 DSM WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/94037eea-4196-48db-9f83-0ef330a7655e?request=getCapabilities&version=1.0.0&requestedEpsg=28992)
- [Foto kerk](https://commons.wikimedia.org/wiki/File:Kerk_van_Zandeweer.JPG), [toren](https://commons.wikimedia.org/wiki/File:Kerk_van_Zandeweer_-_toren.JPG), [noordoostzijde](https://commons.wikimedia.org/wiki/File:Kerk_vanuit_het_noord-oosten_en_vanuit_het_zuid-oosten_-_Zandeweer_-_20220661_-_RCE.jpg) en [zuidoostzijde](https://commons.wikimedia.org/wiki/File:Kerk_vanuit_het_noordoosten_en_vanuit_het_zuidoosten_-_Zandeweer_-_20220662_-_RCE.jpg).

Controleer plaatsing van beide onderdelen en de aansluiting op het hoogteverschil van het terrein op [de kaart](http://localhost:3000/kaart/53.38768/6.68159/200/1x1/0).
