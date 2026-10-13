# StadsHeer (Tilburg)

## Bestanden en plaatsing

`stadsheer.glb` in meters met Y omhoog, `stadsheer.json` voor de catalogus en `stadsheer-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-stadsheer.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [133574, 396870], X-as [0.990652851696501, -0.13640721177998827], Z=0 op NAP 15.2 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 58.34388678 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0855100000394673.

## Bouwdelen, gemeten maten en aannames

StadsHeer (EGM,2007) met 85 serreboxen, gescheiden west- en oostschijf, penthouse-/trappenkern, glasplint en entree. Hetzelfde BAG-pand omvat vier kantoorvolumes, de lagere glazen verbindingen, de foyer, de lange noordelijke parkeerschijf en beide ronde parkeerhellingen; deze zijn allemaal meegenomen en de twee binnentuinen blijven open. Dakhoogtes uit 3D BAG en gecontroleerd in AHN: toren97,953/106,913/115,233m NAP, techniek117,1m (AHNmax117,76), westkantoor61,514/67,017m, overige kantoren39,93/39,981/39,994m met hogere koppen45,54/45,401/45,436m, parkeerdek30,795m en verbindingsdak32,772m. Drie echte foyer-kappen als vlakke zadeldakprofielen van21,14naar22,56m. Geen DSM-hoogteplakken. Serreposities,3,25m breedte,2,1m diepte,2,65m hoogte en woonlaagsteek2,8m uit schuine foto geschat, circa0,5–1m onzeker; 85woningen volgen ontwikkelaarsbron maar de boxposities zijn vereenvoudigd. Iedere box heeft een vaste45-graden onderschaal. Vensterritme, glasplint en de ronde parkeerspiralen (7,1m straal,1,1m borstwering) zijn geschat; gevelnissen0,38m diep. Gesloten interne nissen achter aansluitende volumes zijn gevuld, zonder het zichtbare gevelreliëf te veranderen.

## Weggelaten

Kozijnen, dunne glasstijlen, leuningen, zonpanelen en losse lamellen kleiner dan0,9m. De binnenkant van de parkeerspiralen is vereenvoudigd tot verbonden ronde bouwvolumes met open dakput. Pleinen en binnentuinen blijven PDOK-terrein; geen dubbele vloerplaatoverhetmaaiveld. Naburige spoor- en woongebouwen blijven behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 35,334 driehoeken. Printcontrole per node: NoError, 0.13% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Serres met printonderschalen, glasplint en drie afzonderlijke gemeten torenkoppen.; 55 graden: Vensterrasters op alle kantoorvleugels, dakinstallaties en open parkeerrand.; 145 graden: Glazen foyer onder drie doorlopende zadeldakvlakken, binnenhoven en kantoorritme.; 235 graden: Serres aan beide torengevels, westelijk kantoor met gemeten hogere kop en complete plint..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 660 objecten, 234,668 driehoeken, 104.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://factor-s.com/Ontwikkeling/referentieprojecten/de-stadsheer.aspx (ontwikkelaar,85woningen/6kantoorlagen/25woonlagen)
- https://www.skyscrapercenter.com/building/de-stadsheer/5856 (CVU,101m,EGM,2007)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000394673 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:Stadsheer_Tilburg_DSCF9463.jpg (G.Lanting,CC BY4.0)
- https://commons.wikimedia.org/wiki/File:Stadsheer_Tilburg_DSCF9465.jpg (G.Lanting,CC BY4.0)
- https://commons.wikimedia.org/wiki/File:Stadsheer_Tilburg_P1160983.jpg (G.Lanting,CC BY4.0)
- https://commons.wikimedia.org/wiki/File:UPC0511-Unnatural-7_(5772263355).jpg (Joris Leermakers,CC BY-SA2.0)
