# Willemswerf (Rotterdam)

## Bestanden en plaatsing

`willemswerf.glb` in meters met Y omhoog, `willemswerf.json` voor de catalogus en `willemswerf-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-willemswerf.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [93280, 436885], X-as [0.6845471059286887, 0.7289686274214114], Z=0 op NAP 3.69 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 47.04817914 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000612039.

## Bouwdelen, gemeten maten en aannames

De lange gevelas46,8graden volgt de echte dakranden. EÃ©n glasdakplan zNAP=-0,997765781522u-0,008076375547v+41,641796672768 beschrijft de diagonale knik van NAP91,2naar18,9m; de paneelvelden volgen dat vlak. Het hoofddak ligt op90,609m, de koprand op91,524m rond de open dakput88,344m, het terugliggende noordoostterras op84,859m. Techniek volgt91,542/91,578/94,888m. De lage noordelijke garages staan op19,202/19,203m en de afgeronde oostelijke hellingbaanvoet op19,058m. Het3,6m-gevelraster is gedocumenteerd; vensterafmetingen, glasverdeling, poorten, puien en kleine daklichten zijn geschat. De parkeeronderbouw blijft gesloten: de overstekte Hertekade is onder de eigen parkeerlagen gedeeltelijk gevuld voor de print. Het kleine noordterras heeft een geschatte vaste onderschaal van77naar84,859m NAP in plaats van een dun zwevend vloervlak.

## Weggelaten

Interieur en afzonderlijke parkeerhellingen, dunne roedes, ventilatieroosters, letters/reclame, antennes en apparatuur onder0,9m. De garageconstructie is tot gesloten onderbouw vereenvoudigd; de openbare kade naast het gebouw en de bruggen blijven PDOK.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 42,870 driehoeken. Printcontrole per node: NoError, 0.94% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Doorlopende schuine glasstrook, witte raamgevels, open dakput en entreenissen; 55 graden: Geleding van de achterkern, gemeten daklichten en afgeronde hellingbaanvoet; 145 graden: Vensters op alle achtergevels, beide volledige parkeervleugels; 235 graden: Duidelijke koprand, glasvlak met paneelreliÃ«f en terugliggend dakterras.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 249 objecten, 197,316 driehoeken, 127.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.qwa.nl/geschiedenis/ (architect,glas-trapezium)
- https://www.architectuur.org/bouwwerk/425/Kantoorgebouw_Willemswerf.html (gevelraster,garages,achterkern)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000612039 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:Gebouw_Willemswerf_Rotterdam.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Willemswerf_@_Rotterdam_(30465517922).jpg (Guilhem Vellut CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Willemswerf2.JPG (R08-42,publiekdomein)
