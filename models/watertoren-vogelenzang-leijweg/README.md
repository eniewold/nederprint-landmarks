# Watertoren Leijweg (Vogelenzang)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-vogelenzang-leijweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een regelmatige achthoek (prisma) met verdiepte vlakken als hulls, het dak is plat (AHN).

De watertoren aan de 1e Leijweg in Vogelenzang (gemeente Bloemendaal) is omstreeks 1957 gebouwd naar ontwerp van J.P. Kloos (Wikipedia, Lijst van watertorens in Noord-Holland; geen eigen artikel, geen monument). Hij staat in het bos van de Amsterdamse Waterleidingduinen tussen de ingang Oranjekom (1e Leijweg 2) en het bezoekerscentrum (1e Leijweg 6), op het adres 1e Leijweg 4, en is BAG-pand 0377100000015288 (bouwjaar 1957, in gebruik). Het is een andere toren dan de "Watertoren Vogelenzang" van 1927 in Bennebroek (A.T. Kraan, model `watertoren-bennebroek-watertoren-vogelenzang`, BAG 0377100000002980, 2,8 km zuidelijker). Wikipedia, Wikidata en OSM geven geen coördinaten; de plek is gevonden als het enige hoge pand uit 1957 in de 3D BAG rond de Leijwegen (33,5 m boven maaiveld, plat dak).

## Bestanden

- `watertoren-vogelenzang-leijweg.glb`: één node `building:achtkante-schacht-dakrand-en-apparatuur`, op het maaiveld.
- `watertoren-vogelenzang-leijweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-vogelenzang-leijweg-1-1000.stl`: de toren op 1:1000 (6,2 × 6,2 × 34,9 mm).

## Oorsprong en oriëntatie

RD-oorsprong [100046.3, 484651.75] (52,34703 N, 4,58071 O), het hart van de regelmatige achthoek die het best op de dakcellen van het AHN-DSM past (IoU 0,97). De BAG-contour ligt circa 1 m westelijker en is onregelmatig getekend (zijden van 1,6 tot 3,9 m); de luchtfoto's volgen het AHN. Maaiveld AHN-DTM NAP +4,0 tot +4,2 (gebruikt +4,05). Lokale +X is de normaal van de oostgevel (RD -7,5 graden, `xAxis` [0.99144, -0.13053]), de andere gevels per 45 graden. `groundHeight` 47,13 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost, noord, west, zuidoost op 5 m); recht ten zuiden ligt een smalle laagte langs het pad (PDOK 46,87, AHN NAP +3,7) die niet meetelt. Het model vervangt BAG-pand 0377100000015288; er staan geen andere panden binnen 30 m.

## Onderdeel `building:achtkante-schacht-dakrand-en-apparatuur`

- Schacht: regelmatige achthoek van 6,2 m over de vlakken (AHN 6,0, BAG 6,4), van het maaiveld tot de dakrand op 33,35 m (AHN NAP +37,3 tot +37,4), zonder verbrede kuip (de schacht is op de schuine luchtfoto's en in het AHN over de hele hoogte even breed).
- Gevels: per vlak een hoekrib van 0,45 m aan beide kanten en daartussen een 0,3 m verdiept vlak van 0,6 m (voet) tot de dakband op 32,6 m, met een plafond onder 45 graden.
- Plat dak op 33,1 m (AHN NAP +37,2) binnen een lichte dakrand van 0,35 m.
- Apparatuurkast van 1,6 × 1,5 m in het zuidwestelijke deel van het dak tot 34,6 m (AHN NAP +38,1 tot +39,7).
- Deur van 1,2 × 2,4 m onder aan de zuidoostgevel (wit vlak op de luchtfoto van 2025), als nis van 0,3 m achter het verdiepte vlak.

## Bronnen en maten

- [Wikipedia, Lijst van watertorens in Noord-Holland](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Noord-Holland): Vogelenzang, Leijweg, ca. 1957, J.P. Kloos; hoogte en inhoud onbekend.
- BAG-pand 0377100000015288 (PDOK, 2026-11-04): bouwjaar 1957, status in gebruik, adres 1e Leijweg 4.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0377100000015288: plat dak NAP +37,2, maaiveld +3,9.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld, dakrand, dak, apparatuur en antennes (tot NAP +42,0), achthoek-fit op de dakcellen.
- PDOK-luchtfoto's 2021, 2022, 2023, 2024 en 2025 (orthoHR, 8 cm): door de scheefstand schuin zicht op de zuidwest- (2021), zuid- (2022) en zuidoostgevels (2025): achthoek, lichte hoekribben, liggende bekistingsstrepen, dakrand rond een donker dak met zendapparatuur, wit vlak onder aan de zuidoostgevel.

## Geschat en weggelaten

Geschat: er zijn geen foto's van opzij gevonden (Commons, Wikidata, Flickr), dus de geleding komt alleen uit de schuine luchtfoto's op 8 cm. Geschat zijn de breedte en diepte van de hoekribben en verdiepte vlakken, de hoogte van de voet en de dakband, de plaats en maat van de deur (wit vlak op één luchtfoto, kan ook een bord of kast zijn) en de maat van de apparatuurkast. De doorsnede is een compromis tussen AHN (6,0) en BAG (6,4).

Weggelaten: de antennes en masten op het dak (dunner dan 0,9 m, AHN tot NAP +42,0), de liggende bekistingsstrepen (enkele centimeters), eventuele kleine vensters (op de luchtfoto's niet te zien), de lage betonplaat circa 6 m ten zuidwesten van de toren (geen BAG-pand, vrijwel op maaiveld) en het pad.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet (verhouding < 1,00001). Via `createModelBundle` op een uitsnede van 80 m staat het model op het PDOK-maaiveld (voet 0,1 tot 0,7 m in het terrein, aan de zuidkant boven de laagte langs het pad 0,15 m erin) en is het PDOK-pand weg. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een onregelmatig achtkant blok met een plat dak) de regelmatige achthoek met hoekribben en verdiepte vlakken, de dakband en dakrand rond het verdiepte dak, de apparatuurkast en (zuidoost) de deur.

Controle-URL: http://localhost:3000/kaart/52.34703/4.58071/200/1x1/0
