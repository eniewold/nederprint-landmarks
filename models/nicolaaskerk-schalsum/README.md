# Nicolaaskerk (Schalsum)

Middeleeuwse zaalkerk met halfronde koorsluiting en westtoren, vereenvoudigd voor de kaart en een steunvrije print op 1:1000.

## Bestanden

- `nicolaaskerk-schalsum.glb`: gesloten gebouwonderdeel in meters, glTF Y omhoog.
- `nicolaaskerk-schalsum.json`: plaatsing en broninformatie.
- `nicolaaskerk-schalsum-1-1000.stl`: printmodel op 1:1000, millimeters en Z omhoog.
- Generator: `scripts/generate-nicolaaskerk-schalsum.mjs`.

## Plaatsing en bouwdelen

Oorsprong RD (167252,4; 579129,5), in de westtoren; de X-as loopt ongeveer oostwaarts langs het schip, [0,99985; −0,0173]. Het model vervangt BAG-pand 0070100000324295. Schip met zadeldak, halfronde apsis met kegeldak, twee zuidelijke steunberen en toren met achtzijdige spits zijn uit vlakken en afzonderlijke bouwdelen opgebouwd. Vensters en galmgaten zijn blinde nissen.

## Maten, schattingen en weglatingen

De BAG-contour geeft lengte, breedte en oriëntatie; de dakvlakken van 3D BAG geven de nok en goten. Het AHN geeft de top van de gemeten spits op NAP +27,05 m, bij een maaiveld van ongeveer NAP +2,71 m. De uiterste top is uit het foto- en rasterbeeld geëxtrapoleerd naar 25,6 m boven maaiveld. De vensternissen, steunberen en posities zijn op foto's geschat. Het dunne torenhek, windwijzers, dakornamenten en raamtracering zijn op deze schaal weggelaten; het houten hok op een historische noordfoto is niet op de actuele luchtfoto zichtbaar.

## Controle

De generator controleert geslotenheid en schrijft een STL; controleer de positie, het dak, de toren en maaiveldaansluiting daarnaast op de kaart en in een preview-export. De modeltest controleert selectie en printbaarheid.

## Bronnen

- [3D BAG, pand 0070100000324295](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000324295).
- [PDOK AHN DSM en DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), hoogtebeeld 0,5 m; [actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Rijksmonument 15867](https://monumentenregister.cultureelerfgoed.nl/monumenten/15867).
- [Wikimedia Commons: Nicolaaskerk Schalsum](https://commons.wikimedia.org/wiki/Category:Nicolaaskerk,_Schalsum), met recente zuidgevel en historische noord-, oost- en westfoto's.
- [Alde Fryske Tsjerken: Schalsum](https://aldefrysketsjerken.nl/schalsum).
