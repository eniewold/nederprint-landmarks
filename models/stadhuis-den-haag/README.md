# Stadhuis (IJspaleis), Den Haag

Volledig complex van Richard Meier: noordelijke en zuidelijke kantoorvleugel, glazen atrium, ronde bibliotheek met zijvleugel en trapkern, verbindingsvleugel en oostelijk Forum met ronde entree. De twee overlappende BAG-registraties worden vervangen; de grotere ondergrondse garagecontour is geen bovengronds podium.

## Maatvoering en opbouw

- RD-oorsprong `[81650.4103349324,454934.9118856987]`, +X RD 27°, z=0 NAP +0,55 m, verborgen voet −0,8 m. Maaiveld uit AHN DTM en drie straatmonsters uit de werkelijke PDOK-kaart; plaatsing met −0,3 m overlap.
- BAG-contour en benoemde dakvlakken uit 3D BAG LoD2.2, gecontroleerd met AHN DSM 0,5 m en luchtfoto. Contourvereenvoudiging maximaal 0,38 m; kleine technische uitsparingen in de dakvlakken gesloten.
- Noordvleugel NAP +42,35 m, zuidvleugel en Forum +49,16 m, verbinding +39,84 m, ronde bibliotheekfront +30,27 m, atrium circa +46,55 tot +46,98 m, hoogste witte eindschotten +53,17 m.
- Platte en licht hellende dakvlakken boven afzonderlijke bouwvolumes, plus gevelnissen, trapkern, dakroeden en technische opbouwen; geen gestapelde rasterhoogtelagen.
- Geschat: raamritme 5,2 × 3,65 m uit foto's, blinde nisdiepte 0,27 m, atriumroeden 1,1 m breed, trapbordesritme en precieze eindschotlengten. Glas blijft dicht; diepe passages, kleine balustrades, losse vlaggenmasten en kleurvlakken zijn vereenvoudigd of weggelaten voor 1:1000.

## Bronnen

- [PDOK BAG](https://service.pdok.nl/lv/bag/wfs/v2_0): panden 0518100000275247 en 0518100001774714, EPSG:28992, 11 oktober 2026; BGT-panden en straatcontouren.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0): 0,5 m; [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0), controle op vleugels, bibliotheek, atrium en installaties.
- [3D BAG hoofdcomplex](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000275247) en [overlappende registratie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001774714), LoD2.2 dakvlakken met semantische bouwdelen.
- [Atrium City Hall: 30 jaar stadhuis](https://atriumcityhall.nl/agenda/30-jaar-stadhuis-den-haag-x-atrium-city-hall/): architect, opening en samenhang met bibliotheek en Forum.
- [GraphyArchy 00815](https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00815.jpg), [00807](https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00807.jpg), [00806](https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00806.jpg): GraphyArchy, CC BY-SA 4.0, bibliotheekboog, ingang en lange vleugel.
- [Den Haag spring 2001 06](https://commons.wikimedia.org/wiki/File:Den_Haag;_spring_2001_06.jpg): Mark Ahsmann, CC BY-SA 4.0, atriumglas; [IJspaleis](https://commons.wikimedia.org/wiki/File:IJspaleis.jpg): Dedalus, CC BY-SA 3.0, buitenhoek bibliotheek.
- [Birds eye view April 2018](https://commons.wikimedia.org/wiki/File:Birds_eye_view_of_The_Hague_city_center,_Netherlands,_April,_2018.jpg): Dmitry Eliuseev, CC BY 2.0, totaalbeeld. Bronbeelden alleen voor controle, buiten beide repositories.

## Controles

Manifold NoError, één verbonden gesloten geheel, 30.048 driehoeken. STL 1:1000 circa 249,8 × 95,7 × 53,4 mm, inclusief verborgen voet. 45°-ondersteuningscontrole voegt circa 0,16% volume toe, uitsluitend in ondiepe geveldetails. Het model heeft geen vrijstaande dunne delen.

Regressietest in `tests/landmark-models.test.ts` controleert volledige omvang, bibliotheek, ongelijke dakhoogtes, verbinding, Forum, grondplaatsing en gesloten/verbonden printgeometrie. Werkelijke PDOK-plaatsing, vier schuine kanten naast PDOK en bronfoto's, kaart met landmark uit/aan en volledige 300 × 300 m preview-export op 1:1000 gecontroleerd. Het hele complex past in de uitsnede. Omringende daken visueel gecontroleerd; geen aparte correctie nodig. Generator herhaald en GLB/JSON/STL byte-identiek vergeleken.

[Controlekaart](http://localhost:3000/kaart/52.0778263/4.3172035/470/1x1/63?theme=thema-polder-8&base=road&size=300&z=1). Nakijken: ronde bibliotheek, glazen atrium en verbinding naar het Forum.

Reproduceren vanuit de landmarkrepo: `node scripts/generate-stadhuis-den-haag.mjs`.
