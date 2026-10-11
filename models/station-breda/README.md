# Station Breda

OV-terminal van Koen van Velsen, inclusief parkeerdak boven de perrons, hogere kantoor- en woonstroken, drie zuidelijke woonhoven, twee noordelijke hoven en negen daklichten. De volledige BAG-registratie wordt vervangen. De noordelijke ondergrondse contour loopt onder bus- en fietsvoorzieningen door en verschijnt uitsluitend als verborgen voet.

## Gemeten en geschat

RD-oorsprong `[112895.35854881468,400925.37260406057]`, as 4,5°, z=0 NAP +2,3 m, voet −1 m. BAG-contour 0758100000101539, AHN DSM/DTM 0,5 m en actuele ortho, 11 oktober 2026. PDOK/3D BAG geeft voor dit pand een LoD1-fallback zonder bruikbare dakdetails; de architectonische bouwdelen zijn daarom uit AHN, luchtfoto en schuine foto's gereconstrueerd.

Gemeten dakniveaus: parkeerdek NAP +19,64 m, noordelijke kantoorstrook +23,40 m, hogere halstroken +23,55 m en noordelijk oostvolume +22,9 m. De buitenvorm is exact aan de BAG-contour begrensd. Het model bestaat uit afzonderlijke bouwdelen, vlakke daken en gesloten daklichtprofielen; geen rasterhoogtelagen.

Geschat: precieze binnenhofranden en breedten van de halstroken (luchtfoto/DSM circa 1–2 m nauwkeurig), raamritme, installatieranden op +24,2 m en blinde nisdiepte 0,24–0,25 m. Daklichten en parkeerdakopeningen hebben dichte 45°-binnenwanden, deels hoger dan hun echte glazen bodem. Glazen halgevels blijven gesloten; brede doorgangen, auto's, dunne borstweringen, baksteenkleurpatroon, verlichting en bovenleiding zijn vereenvoudigd of weggelaten.

## Bronnen

- [BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0), BGT, [AHN DSM/DTM WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), [ortho](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0), EPSG:28992.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000101539): controle volledige pandregistratie en LoD1-fallback.
- [Koen van Velsen, treinstation Breda](https://koenvanvelsen.com/nl/projects/87/treinstation-breda): samenhangende stationsarchitectuur, programma, bouwperiode 2004–2016. [Parkeerdak](https://koenvanvelsen.com/nl/projects/77/parkeergarage): dak boven de perrons.
- [Octatube OV Terminal Breda](https://www.octatube.nl/nl_NL/project-item.html/projectitem/105): uitvoerder van de glasconstructies, negen daklichten en glazen gevels.
- G.Lanting, CC BY-SA 4.0: [centrumkant](https://commons.wikimedia.org/wiki/File:Station_Breda_Centrumkant_DSCF6075.jpg), [noordgevel](https://commons.wikimedia.org/wiki/File:Belcrumkant_Nieuwe_station_Breda_DSCF7168.jpg), [noordzijde bovenaanzicht](https://commons.wikimedia.org/wiki/File:Belcrumkant_Nieuwe_Station_Breda_DSCF7162.jpg).
- Steven Lek, CC BY-SA 4.0: [Breda station 2018](https://commons.wikimedia.org/wiki/File:Breda_station_2018.jpg), entree-overstek.
- Sneeuwvlakte, CC BY-SA 4.0: [Station Breda 2026-2](https://commons.wikimedia.org/wiki/File:Station_Breda_(2026)-2.jpg) en [2026-4](https://commons.wikimedia.org/wiki/File:Station_Breda_(2026)-4.jpg), kopgevels boven sporen en perronhal. Foto's uitsluitend voor controle buiten repositories.

## Controle

GLB en STL: Manifold NoError, één verbonden geheel, 4.198 driehoeken. STL 1:1000 circa 312,9 × 201,2 × 22,9 mm, inclusief verborgen voet. Dakranden minimaal 0,95 m; gesloten gevelnissen en 45°-daklichtprofielen vermijden los hangende delen.

Gerichte regressietest in `tests/landmark-models.test.ts` controleert de volledige breedte, parkeerdek, hoogteverschillen, daklichtverdiepingen, woonvleugels, verbondenheid, 45°-printgeometrie en grondplaatsing. Vier aanzichten naast werkelijke PDOK en schuine foto's, landmark uit/aan op de kaart en een volledige 360 × 360 m preview-export op 1:1000 gecontroleerd. Geen ontbrekende vleugels of dakbesmetting bij naastgelegen panden waargenomen. GLB/JSON/STL na herhaald genereren byte-identiek.

[Controlekaart](http://localhost:3000/kaart/51.5956499/4.7795429/550/1x1/85.5?theme=thema-polder-8&base=road&size=360&z=1). Nakijken: negen daklichten, lagere parkeerbanen en open woonhoven.

Reproduceren: `node scripts/generate-station-breda.mjs` in de landmarkrepo.
