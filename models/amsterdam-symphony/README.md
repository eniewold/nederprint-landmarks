# Amsterdam Symphony (Amsterdam)

## Bestanden en plaatsing

`amsterdam-symphony.glb` in meters met Y omhoog, `amsterdam-symphony.json` voor de catalogus en `amsterdam-symphony-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-amsterdam-symphony.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [120000, 483225], X-as [1, 0], Z=0 op NAP -0.75 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.44917 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012128931.

## Bouwdelen, gemeten maten en aannames

Vijf bovengrondse groepen van BAG0363100012128931: woontoren, kantoortoren met lager L-deel en drie hofvleugels, hotel en twee westelijke laagbouwgroepen. De garagecontour bevat ook het openbare Mahlerplein, maar die ondergrondse plaat wordt niet als landmark gemodelleerd. Daken/kernen van de woontoren liggen op NAP101,885/104,179m, kantoor102,004/104,236m met schouder73,247m en dakput72,349m; hotel38,666/43,263m. Laagbouwdaken volgen de afzonderlijke vlakken30,563/30,567/10,571/3,930/40,956/27,799/11,020/0,272m. De torens hebben bakstenen rastergevels, geen glazen koppen zoals de backlog zei. Contouren zijn uit3DBAG/AHN tot regelmatige vleugels vereenvoudigd, circa0,3–0,8m onzeker; de schuine pleinrand van de kantoorplint volgt het dakvlak. Venstersteek, verspringing van het metselwerk, entreepuien en lokale nisplaatsing zijn geschat. Rondere technische kappen zijn massieve ellipsoïden tussen gemeten voet en kruin; het witte noordscherm heeft een vereenvoudigde gebogen L-contour uit de ortho. De vijf delen staan afzonderlijk op het printbed; de gezamenlijke STL meet167,2bij115,9mm op1:1000. De exportcorrectie voegt per node circa0,07–0,12% materiaal toe.

## Weggelaten

Individuele bakstenen, kleur van de gevelsteen, glazen balustrades, losse koelapparaten kleiner dan0,9m, kunstwerk op het Mahlerplein, bomen en garage onder het maaiveld. De werkelijke dubbelgekromde installatieschermen zijn tot gesloten kapvolumes vereenvoudigd; de noordkap heeft een vlak bovenvlak op de gemeten techniekhoogte.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 84,116 driehoeken. Printcontrole per node: NoError, 0.12% extra volume; NoError, 0.08% extra volume; NoError, 0.07% extra volume; NoError, 0.07% extra volume; NoError, 0.10% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Twee volledige bakstenen torengevels met raamritme en afzonderlijke dakkernen; 55 graden: Hotel, geknikte plintrand, laagbouwramen en open binnenhoven; 145 graden: Ronde technische kappen en gebogen noordelijk scherm boven de laagbouw; 235 graden: Getrapte kantoorvleugels, blinde vensternissen en vrije openbare pleinruimte.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 240 bij 240 mm, 377 objecten, 205,316 driehoeken, 108.2 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.cie.nl/Amsterdam-Symphony?lang=nl (architect)
- https://www.boele.nl/nl/projecten/symphony (bouwer)
- https://www.verhoeven.nl/nl/projecten/symphony-amsterdam (gevelelementen)
- https://zuidas.nl/en/threesixty_info/amsterdam-symphony/ (gemeente)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012128931 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Amsterdam_-_Symphony_Office_Tower_%26_Symphony_Amsterdam_(30214043291).jpg (Fred Romero CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Amsterdam_Symphony_Towers.jpg (Choinowski CC BY-SA4.0)

## Standalone printvariant met grondplaat

`amsterdam-symphony-grondplaat-1-1000.stl` verbindt de vijf echte bovengrondse gebouwgroepen met een 1 mm dikke grondplaat. Dit bestand is één gesloten printdeel en wordt in de permanente test gecontroleerd. De gewone STL houdt de vijf losse bouwmassa’s; de grondplaat staat uitsluitend in de extra STL, niet in GLB of kaart, zodat openbare pleinruimten vrij blijven. Reproduceer met dezelfde generator.
