# Jacobikerk (Uithuizen)

De middeleeuwse Jacobikerk heeft een polygonale koorsluiting, noordelijke zijbeuk en een toren met tentdak en open lantaarn; rijksmonument 21303. Het model vervangt BAG-pand 1651100000010395 en bestaat uit één gesloten onderdeel voor afdruk op 1:1000 zonder steun.

## Plaats, maten en aannames

De oorsprong is RD (240554,771; 603105,223); de lokale +X-as (-0,988804; 0,149217) loopt van het koor naar de toren. De terreinmonsters rond de kerk variëren in AHN-DTM van ongeveer NAP +2,4 tot +3,5 m; het referentiemaaiveld in de catalogus is NAP +2,8 m. Controleer de aansluiting op de bestaande terreinhelling bij de kerk; de wierde is niet meegemodelleerd.

De contour en dakvlakken komen uit BAG en 3DBAG. AHN4 meet bij de torenlantaarn een aaneengesloten cluster tot NAP +31,623 m; AHN3 meet circa +31,21 m met enkele ontbrekende cellen ernaast. De bron van de orgelcommissies geeft 33,5 m inclusief de meermin op de windvaan; de hoogte zonder deze fijne bekroning wordt daar niet afzonderlijk genoemd. De gesloten, printbare lantaarn is geschat op circa 28,5 m boven het referentiemaaiveld en kan door terreinvariatie en de fijnheid van de bekroning afwijken van de precieze werkelijke hoogte. De meermin, fijne kroon en windvaan zijn weggelaten.

De zijbeuk, lantaarn, vensters, galmgaten, toegangsnis en schuine steunberen zijn naar 3DBAG en foto's vereenvoudigd en hun exacte afmetingen zijn geschat. Openingen zijn blinde nissen; de open lantaarn is voor printbaarheid als gesloten volume weergegeven.

## Bronnen en controle

- [Rijksmonumentenregister 21303](https://monumentenregister.cultureelerfgoed.nl/monumenten/21303)
- [Orgelcommissies Het Hogeland: hoogte inclusief meermin](https://www.orgelshogeland.nl/?page_id=17)
- [3DBAG gebouwgegevens](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000010395)
- [PDOK AHN4 WCS, DSM en DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [AHN3 DSM WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/94037eea-4196-48db-9f83-0ef330a7655e?request=getCapabilities&version=1.0.0&requestedEpsg=28992)
- [Foto zuidzijde](https://commons.wikimedia.org/wiki/File:Jacobikerk_Uithuizen.jpg), [zuidwestzijde](https://commons.wikimedia.org/wiki/File:Kerk_vanuit_het_zuid-westen_-_Uithuizen_-_20211153_-_RCE.jpg), [noordzijde](https://commons.wikimedia.org/wiki/File:Kerk_vanuit_het_noorden_-_Uithuizen_-_20211155_-_RCE.jpg) en [zuidoostzijde](https://commons.wikimedia.org/wiki/File:Kerk_vanuit_het_zuid-oosten_-_Uithuizen_-_20211156_-_RCE.jpg).

Bestanden: GLB en JSON voor de kaart en STL op 1:100 en 1:1000 voor de afdruk. Genereer met `node scripts/generate-jacobikerk-uithuizen.mjs` en met `--scale 100` voor het grotere printbestand. Controleer de terreinhelling, toren, koorsluiting en zijbeuk op [de kaart](http://localhost:3000/kaart/53.40737/6.67367/200/1x1/0).
