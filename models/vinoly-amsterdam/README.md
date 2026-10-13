# Viñoly (Amsterdam)

## Bestanden en plaatsing

`vinoly-amsterdam.glb` in meters met Y omhoog, `vinoly-amsterdam.json` voor de catalogus en `vinoly-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-vinoly-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119914, 483442], X-as [0.998440764181981, 0.0558215049931638], Z=0 op NAP 0.15 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.182419 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012107681.

## Bouwdelen, gemeten maten en aannames

De volledige Viñoly/Mahler 4 in BAG 0363100012107681 heeft een circa 90 bij 32 m brede voet. Het lage kantoor-/winkelpodium en de oostelijke kantoorvleugel liggen op NAP 26.497 m, de zuidelijke middenschouder op 62.528 m, de hoofdkop op 91.271 m en de grote dakinstallatie op 95.119 m. De lage dakkoppen liggen op 29.771 en 29.254 m. Dit zijn afzonderlijke architectonische bouwdelen met gemeten dakvlakken, geen gestapelde AHN-hoogtelagen. De gevelvlakken zijn verschillend geknikt/gedraaid in het gebouwstelsel langs de gemeten 3.2-graden as. De bovenbouw begint op geschatte NAP 60.9 m, overlappend met de dragende schouder.

De buitentrap slingert volgens de architect rondom de drie volumes. In het model is zij herkenbaar als doorlopende schuine blinde groef langs de lage zuidgevel en de oost-, noord-, west- en bovenste zuidgevels van de toren. De route volgt de daadwerkelijke gevelknikken, zodat de nissen nergens verborgen luchtkamers of aan twee zijden open raamwanden maken. Route, bordeshoogtes en exacte draaipunten zijn uit schuine foto's geschat, met circa 1-3 m onzekerheid. Iedere schuine trapband is circa 3.4 m hoog en maximaal 2.2 m diep, met een gesloten achtervlak en doorgaande schuine bodem. Fijne treden en leuningen zijn niet als los open frame geprint.

De verticale aluminiumvinnen zijn tot circa 1.1 m brede gesloten banden tussen de glasnissen vereenvoudigd. Het geschatte raster heeft een horizontale steek van 3.1 m en verdiepingssteek van 3.8 m. Vensters zijn 2 m breed, 2.9 m hoog en 0.35 m blind; circa 0.9 m gesloten vloerband blijft tussen de rijen. Alle glasnissen komen na de trapgroeven en iedere ingreep behoudt een genus-0 gebouw. Er zijn geen losse dunne stijlen of grote open glasramen aan beide gevelzijden.

Maaiveld NAP 0.15 m en drie gecontroleerde straatpunten leveren een ellipsoïdische terugval van 43.182419 m. De transparante winkel-/foyerplint is een blinde nis van maximaal circa 0.55 m. De twee verdiepingen hoge glaspatio blijft inwendig massief onder het gesloten podiumdak. Er is geen publieke plein-/straatplaat onder de toren. De afzonderlijke Ito- en SOM-panden blijven als hun eigen bestaande modellen behouden.

## Weggelaten

Dunne echte aluminiumvinnen, losse glazen roedes, leuningen, antennes, leidingen en individuele traptreden kleiner dan 0.9 m zijn samengevoegd of weggelaten. De buitentrap heeft gesloten achtervlakken en schuine bodems, geen vrijstaand open trappenhuis. Binnenpatio, liften en winkelinterieurs zijn niet uitgehold. Kleine dakinstallaties zijn met de grotere gemeten koppen samengevoegd. De traproute en nisdikte zijn vereenvoudigd voor een gesloten print.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 17,170 driehoeken. Printcontrole per node: NoError, 0.46% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De lage kantoorvleugel en volledige podiumvoet krijgen glasreliëf en de schuine beginnende trapgroef, samen met de drie herkenbare bouwdelen.; 55 graden: De grote noordelijke schuine trapbanden verbinden de gedraaide torenvolumes; de complete lage vleugel blijft behouden.; 145 graden: De westelijke trapgroef en gemeten middenschouder volgen doorlopende gevelvlakken; techniek blijft een eigen gesloten bouwdeel.; 235 graden: De omwikkelende trap en verticale glasvinnen maken de voorheen vlakke toren herkenbaar; alle bordes-/trapparts blijven blind en verbonden..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 200 bij 200 mm, 181 objecten, 108,182 driehoeken, 102.1 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.rvapc.com/works/mahler-4-office-tower/ (architect,drie volumes en buitenomtrap)
- https://zuidas.nl/en/construction-project/mahler-4-vinoly/ (gemeenteAmsterdam,2005,91m hoofdtoren)
- https://www.studioseilern.com/portfolio/mahler-4/ (ontwerpteam)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012107681 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Kantoortoren_Vi%C3%B1oly_in_Amsterdam-Zuid.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Vi%C3%B1oly_Tower.jpg (Steven Lek CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Vi%C3%B1oly_Tower_6.jpg (Steven Lek CC BY-SA4.0)
