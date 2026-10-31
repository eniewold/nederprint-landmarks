# Nimbus (Nijmegen)

Vereenvoudigd, printbaar model van woontoren Nimbus aan de Spoorstraat bij station Nijmegen (2016, Hoogte Twee Architecten, 76 m, begane grond plus 23 lagen), samen met de twee lage vleugels die in hetzelfde BAG-pand liggen. De toren is een vierkant van baksteen. Voor de westgevel staan twee lagere bakstenen schijven; daarboven is de westgevel met grijs-blauwe pixelpanelen bekleed. De dakrand loopt schuin af van west naar oost, en op het dak staat een installatieopbouw met zonnepanelen. De zuidoosthoek staat tot de bovenkant van de vleugels op één pijler, en daaronder lopen de balkons van de oostvleugel door. De westvleugel is van donkergrijze baksteen met een balkonstapel tegen de toren. De oostvleugel heeft aan de zuidkant een strook verspringende balkons en een teruggelegde bovenste laag.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `nimbus-nijmegen.glb` | Model in meters, Y omhoog, drie nodes: `building:nimbus-nijmegen-toren`, `building:nimbus-nijmegen-westvleugel` en `building:nimbus-nijmegen-oostvleugel` |
| `nimbus-nijmegen.json` | Catalogusitem |
| `nimbus-nijmegen-1-1000.stl` | Los te printen op 1:1000 (76 × 20 × 78 mm, inclusief 2 mm voet onder het maaiveld), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong `[187310.7, 428508.0]` ligt in het hart van de toren. De X-as loopt langs de zuidgevel (−2,52° op RD-oost; de BAG-randen zijn binnen 0,05° evenwijdig), de Y-as naar het noorden. Lokaal z = 0 is NAP +22,6 m, het maaiveld aan de Spoorstraat en op het parkeerdek (AHN-DTM 22,5–22,7). `groundHeight` is 66,33 m: NAP +22,6 plus de NLGEO2018-geoïde ter plekke (43,73 m). `groundOffsetMetres` is −0,15.

De onderkant ligt 2,0 m onder het maaiveld (`BASE` −2,0), want langs de noordgevel van de toren daalt de inrit van de parkeerkelder naar NAP +20,9. `groundSamplePoints` liggen aan de Spoorstraat en op het parkeerdek. Zonder die punten zou de lader de lage weg ten noorden van het dek (+20,2) nemen.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren | 19,8 × 19,6 m | dak +94,9 m | BAG, AHN-DSM (94,9), 3D BAG (94,91–94,94) |
| Schuine dakrand | 0,9 m breed rondom | van +98,0 m (west) tot het dak aan de oostgevel (8,9°) | 3D BAG (97,95–98,13 west, 96,43 halverwege de zuidgevel, vlak 8,6°), DSM, foto |
| Installatieopbouw | 13,4 × 13,3 m | +97,2 m (west) tot +98,9 m (oost) | AHN-DSM (97,2–98,8, gelijkmatig oplopend), 3D BAG, luchtfoto |
| Zuidelijke schijf voor de westgevel | 1,3 × 13,9 m | +74,15 m (17 lagen) | BAG, 3D BAG (74,07–74,18), foto |
| Noordelijke schijf voor de westgevel | 1,3 × 5,7 m | +59,35 m (12 lagen) | BAG, 3D BAG (59,30–59,41), foto |
| Open zuidoosthoek | 8,9 × 2,9 m, pijler van 1,0 m | tot +38,6 m, plafond onder 45° tot +41,5 m | BAG (inham op de begane grond), DSM (dak loopt door tot de gevellijn), foto |
| Westvleugel | BAG-contour, circa 16 × 13,5 m | +41,7 m (6 lagen) | BAG, AHN-DSM, 3D BAG (41,67) |
| Balkonstapel westvleugel | 5,2 × 2,3 m | +38,6 m | BAG (inham), AHN-DSM (38,6), foto |
| Oostvleugel | BAG-contour, circa 38 × 11 m | +41,7 m | BAG, AHN-DSM, 3D BAG (41,63–41,70) |
| Balkonstrook oostvleugel | 2,9 m diep over de hele zuidgevel | +38,6 m | AHN-DSM, 3D BAG (38,56–38,62), foto |
| Zonnepanelenvelden | 6,9 × 8,4 m (west) en 26,1 × 8,0 m (oost), 0,9 m hoog | +42,6 m | 3D BAG (42,55–42,65), luchtfoto |

Lagen: begane grond 4,0 m, daarboven lagen van 2,97 m. Dat geeft het dak op 72,31 m boven het maaiveld (+94,91), en de schijven en vleugels eindigen dan precies op een laag.

Gevelreliëf: alle vensters zijn blinde nissen van 0,35 m diep met een plafond onder 45°.

- **Baksteengevels van de toren**: vensters van 1,2 of 1,8 m op een travee van 2,4 m, per laag verspringend zoals op de foto's.
- **Pixelgevel boven de schijven**: vijf kolommen in een raster.
- **Begane grond**: hoge puien op de begane grond.
- **Glazen hoekloggia's**: 0,6 m diep, in de zuidwesthoek op laag 17–20 en in de zuidoosthoek op laag 12–14.
- **Balkons van de oostvleugel**: per laag open balkons van 2,7 m breed en 0,9 m diep, die per laag een halve travee verspringen.
- **Balkonstapel van de westvleugel**: per laag één open balkon tussen zijwanden van 0,9 m.

## Geschat en weggelaten

- De verdiepingshoogte is afgeleid uit het dak en de schijfhoogtes. Het vensterpatroon en de vensterbreedtes zijn geschat: het verspringende patroon is nagebootst en niet per venster overgenomen.
- De hoogte van de open zuidoosthoek is geschat uit één foto (tot de bovenkant van de balkonstrook). De BAG toont alleen de inham op de begane grond. Het DSM ziet de toren erboven tot aan de gevellijn.
- De installatieopbouw heeft een schuin vlak volgens het DSM. Of het om een hellend dak gaat of om zonnepanelen op een frame, is niet te zien.
- De dakrand is 0,9 m dik gemaakt (printminimum). In werkelijkheid is het een dunner scherm met kleine openingen in de bovenste anderhalve laag van de westgevel.
- De plaats en hoogte van de hoekloggia's, en de breedte en het ritme van de balkons, zijn uit foto's geschat.
- Het onderscheid tussen baksteen en pixelpanelen is alleen een materiaalverschil en zit niet in de geometrie.
- Weggelaten:
  - de parkeerkelder in het noordelijke deel van de BAG-contour, waarvan het dek op maaiveldhoogte ligt (+22,6; ook niet in de 3D BAG);
  - de stalen pergola op de oostvleugel, balkonhekken, de spiltrap en de witte kozijnkaders van de westvleugel (kleiner dan 0,9 m);
  - een smalle spleet tussen de toren en de oostvleugel boven de begane grond (DSM nodata, breedte onzeker; de vleugel sluit aan op de toren).

## Controle

`node scripts/generate-nimbus-nijmegen.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de volgende punten:

- de dakhoogtes van toren, dakrand, opbouw, schijven, vleugels, zonnepanelenvelden en balkonstrook;
- dat de toren boven de open zuidoosthoek doorloopt;
- dat een open balkon van de oostvleugel en de zuidwestelijke hoekloggia na de printcorrectie op 45° blijven staan;
- dat het volume na de printcorrectie per node minder dan 1 % groeit;
- de plaatsing op het maaiveld.

Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0268100000087616` (bouwjaar 2016); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG LoD2.2 `NL.IMBAG.Pand.0268100000087616` (puntwolk AHN4, 2021).
- NLGEO2018-geoïde.
- [Nimbus (Nijmegen)](https://nl.wikipedia.org/wiki/Nimbus_(Nijmegen)) op Wikipedia; [PSS-archi](https://www.pss-archi.eu/immeubles/NL-268-70281.html) (architect, R+23, 76 m).
- Foto's op Wikimedia Commons (niet meegeleverd): [Nimbus Nijmegen 2016](https://commons.wikimedia.org/wiki/File:Nimbus_Nijmegen_2016.jpg), [Nimbus Nijmegen](https://commons.wikimedia.org/wiki/File:Nimbus_Nijmegen.jpg), [Nimbus en het voormalige Belastingkantoor](https://commons.wikimedia.org/wiki/File:Nimbus_Nijmegen_voormalig_Belastingkantoor.jpg).
