# Adagio (Den Haag)

## Bestanden en plaatsing

`adagio-den-haag.glb` in meters met Y omhoog, `adagio-den-haag.json` voor de catalogus en `adagio-den-haag-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-adagio-den-haag.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [81804, 454926], X-as [0.6004202253258841, -0.7996846584870905], Z=0 op NAP 0.6 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.109611 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100001756996.

## Bouwdelen, gemeten maten en aannames

Adagio heeft een eigen BAG-pand, los van Bolero. Twee afgeronde bakstenen kopvleugels en een terugliggende centrale glasbeuk vormen de doorgaande woonconstructie; de laatste penthouseverdiepingen staan terug op hun gemeten grote dakcontour. Hoofddak89,863NAP, hoge westelijke dakschouder89,519NAP, lagere terrassen77,532/77,47NAP, hoofdservicekap92,002NAP en machinebanken tot92,452/92,364/91,528/91,552NAP. De gehele eigen commerciële/fietsenplint heeft dak11,214NAP en de aparte lage westentree7,539NAP. Geen bovengrondse kopie van de oude Turfmarktgarage.

De afgeronde kopvleugels zijn uit BAG/ortho tot1m hoekradius en rechte lokale gevels vereenvoudigd; de lange glasgevel ligt ongeveer1,6–1,9m terug. Terras-/penthousegrenzen rond77,5NAP volgen3DBAG en de architectdoorsneden; kleine open glas-/hoekvlakken zijn tot gesloten bouwdelen vereenvoudigd, circa1–2m onzeker. Gevelritme3,4m, verdieping3,02m en2,05m hoge/.35m blinde vensters zijn uit de foto's geschat. Balkons blijven dikke gesloten bouwdelen: vloer minimaal.95m, frontband1,05m hoog,1,2m uitkraging en45graden onderzijde. De hoge commerciële puien en het tweedeverdiepingsscherm zijn gesloten glasnissen en.22m ondiepe sleuven. Smalle echt vrije roedes zijn niet als los frame opgenomen.

## Weggelaten

Losse glasbalustrades, metaalroedes, raamroedes, fijn tegelreliëf, zonnepanelen, antennes en machinerasters onder.9m zijn weg of gesloten vereenvoudigd. De ondergrondse Turfmarktgarage en publieke straat/pleinplaat zijn niet meegemodelleerd; naastgelegen Bolero, Amare en de Jubi-omgeving blijven behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 22,424 driehoeken. Printcontrole per node: NoError, 0.32% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: afgeronde woonkoppen en terugliggende lange glasbeuk; 55 graden: volledige eigen plint met schermreliëf en afzonderlijke lage westentree; 145 graden: gesloten balkons met45graden onderzijde, zichtbare penthousekroon; 235 graden: gemeten dakmachines en terrasranden, zonder oude garageplaat.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 180 bij 180 mm, 238 objecten, 120,798 driehoeken, 95.3 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://mvsa-architects.com/en/projects/sonate-adagio/ (architect,90m,2023,afgerondegevels/centralesetback/doorsneden)
- https://www.boele.nl/nl/projecten/sonate (aannemer,2023,aparteAdagio/Bolero enoudeparkeergarage)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001756996 (TU Delft/3DGI CC BY4.0,AHN52023)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://www.ahn.nl/ahn5 (AHN5DSM2023 CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- MVSA-projectpagina: Ronald Tilleman2024 headerfotos enarchitectdoorsneden, auteursrecht, alleenvisueelreferentiemateriaal buitenrepo; modelmaten uit BAG/3DBAG/AHN5
