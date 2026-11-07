# Koepelkerk (Berltsum)

Protestantse kerk op het kerkhof op de terp van Berltsum (Berlikum, gemeente Waadhoeke), rijksmonument 28576. De kerk is in 1777-1779 gebouwd op de fundamenten van de middeleeuwse kruiskerk, waarvan de zadeldaktoren niet meer te herstellen was. Het ontwerp is van Willem Douwes, oud-stadsbouwmeester van Harlingen, naar een plattegrond uit het leerboek van Simon Bosboom. Het is een centraalbouw met een achtkante koepel en een open klokkenlantaarn. Het fronton boven de ingang draagt het jaartal 1778, het uurwerk 1779. In de lantaarn hangt de klok van 1593 uit de oude kerk. Het model is opgebouwd uit bouwdelen, omwentelings- en hullvormen, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters. Vervangt BAG-pand 0083100000001644 (kerk en aanbouw zijn één pand, bouwjaar 1778). Het dichtstbijzijnde andere PDOK-pand staat 37 m verderop.
- STL op 1:1000: circa 21,1 × 22,2 × 33,8 mm.
- Genereren: `node scripts/generate-koepelkerk-berltsum.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (172148,08; 584070,76), lat/lon 53,242939 / 5,644070, in het hart van de centraalbouw onder de lantaarn. +X wijst naar de ingang op het oosten, onder 4,44 graden in RD (`xAxis` [0,997; 0,07742]); +Y wijst naar het noorden. De vier rechte gevels in de BAG-contour liggen op deze hoek binnen 0,1 graad van elkaar. z = 0 ligt op het laagste maaiveld rond de voet (noordkant, NAP +3,85 m); de zuid- en westkant van de terp liggen tot 0,45 m hoger. `groundHeight` 45,08 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (noordkant). `groundOffsetMetres` is −0,1 en de onderkant ligt 0,4 m onder het maaiveld.

## Onderdelen

- **Romp**: een vierkant met rechte gevels op 9,42 m van het hart (BAG: 9,38 tot 9,50 m). De hoeken zijn een cirkelboog met een straal van 9,93 m, die 0,05 m buiten de koorde uitsteekt. Op de acht aansluitingen staan lisenen van 1,2 m die 0,21 m uitspringen. De muur loopt tot +11,05 m, daarboven komt een fries van 0,12 m uit tot +12,55 m en een kroonlijst die 0,72 m uitkraagt tot de goot op +13,15 m (NAP +17,0, 3D BAG). Rondom een plint tot +0,5 m.
- **Gevels**: hoge rondboogvensters van 2,0 m breed (+3,2 tot +8,6 m) in de vier hoeken en in de noord- en westgevel. Onder het westvenster zit de dichtgemetselde deur. De oostgevel heeft de ingang: een stoep van drie treden, een omlijsting van 4,2 m met hoofdgestel en driehoekig fronton tot +6,7 m, een deur van 1,7 m, en erboven het ovale venster van 3,2 × 2,2 m (midden +9,0 m).
- **Koepel**: achtkant en opgebouwd als convexe huls van ringen, van de goot (+13,15 m, apothema 9,42 m) tot het dek van de lantaarn (+20,05 m, NAP +23,9, apothema 3,8 m). De schuine zijden staan aan de voet 5 % verder uit, zodat de koepel daar de afgeronde hoeken volgt (AHN). Naar boven toe lopen ze in tot een regelmatige achtkant. Op het noordelijke en het westelijke vlak staat een dakkapel van 1,5 m breed met een zadeldakje tot +16,35 m.
- **Lantaarn**: een omgang met een dichte balustrade (apothema 3,8 m, tot +21,4 m) en een achtkante opbouw (apothema 3,0 m). In de schuine zijden zitten rondbogen, in de rechte zijden rechthoekige openingen met de wijzerplaten erboven. Hoofdgestel tot +27,35 m, kroonlijst tot apothema 3,6 m op +28,0 m (NAP +31,85; 3D BAG 31,83). Daarop een klokvormig kapje tot +30,75 m (NAP +34,6), een bol van 1,3 m op +31,65 m en een makelaar tot +33,35 m (NAP +37,2, hoogste DSM-punt).
- **Aanbouw zuid**: 6,2 m breed en 2,5 m diep (BAG), met hoeken van 0,93 m afgeschuind. De muur loopt tot +3,6 m, met een lijstje tot +4,0 m (DSM-goot NAP +7,9). Erop een klokvormig dakje tegen de zuidgevel tot +6,65 m, met twee rondboogvensters in de voorkant.

## Geschat

- **Koepelprofiel**: tussen de goot en het dek ligt het AHN-DSM (pixels van 0,5 m, mediaan over 5 m breedte) aan de steile voet tot 0,9 m onder een kwartellips door die twee punten. De foto's tonen een vollere koepel. Het model neemt per ring het gemiddelde (op 8,0 m van het hart +16,65 m tegen DSM +16,2 en ellips +17,1).
- **Lantaarn**: de verhoudingen (balustrade 1,35 m, kapiteel van de stijlen, wijzerplaten, kroonlijst, kapje en bol) komen van de telelensfoto '20191023 torenspits koepelkerk van Berlikum'. De schaal komt uit de DSM-hoogtes van het dek en de kroonlijst; de breedte uit de foto en de DSM-vlek van circa 7 m.
- **Muurhoogte en hoofdgestel**: ongeveer 2 m volgens foto RCE 20033958. De vensters, de deur, de omlijsting, het fronton en het ovale venster komen uit dezelfde frontale foto, geschaald op de breedte van de oostgevel.
- **Aanbouw**: de muurhoogte en de vorm van het dak komen uit foto RCE 20033961 en de foto van 2023; het dak heeft geen DSM-punten (leien).
- **Dakkapellen**: de plaats (noord- en westvlak) en de maat zijn uit foto's van 2010 en van RCE geschat.
- **Inspringing**: in de BAG-contour springt de gevel naast elke lisene 0,55 m in voordat de boog begint. Het model volgt daar de convexe omhullende, zodat de lijst erboven niet vlak overhangt; de hoekvlakken zijn daardoor vrijwel vlak, zoals ze ook op de foto's ogen.

## Weggelaten of vereenvoudigd

- De vensters, de deur, de lantaarnopeningen en de wijzerplaten zijn blinde nissen: spitse top van 58 graden in plaats van een rondboog, rechte openingen met een schuin plafond, het ovaal en de wijzerplaten als kegelnis. Roedeverdeling, glas-in-lood en de traceringen van het ovaal zijn weggelaten.
- De spijlen van de balustrade (dicht gemaakt), de stijlen en bogen van de open lantaarn (dicht met nissen), de triglyfen en tandlijst in het fries, de verkroppingen van het hoofdgestel boven de lisenen, de ribben op de koepel en de ontluchtingskapjes zijn weggelaten: ze zijn kleiner dan 0,9 m of zouden op 1:1000 dunne stijlen of vrije overhang geven.
- De windvaan is een makelaar (kegel) tot de hoogste DSM-hoogte; de vaan zelf en de krullen zijn weggelaten.
- Grafzerken, het hekwerk en de lantaarns naast de deur zijn weggelaten.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en met de foto's.

## Bronnen

- [Wikipedia: Koepelkerk (Berlikum)](https://nl.wikipedia.org/wiki/Koepelkerk_(Berlikum))
- [Rijksmonumentenregister 28576](https://monumentenregister.cultureelerfgoed.nl/monumenten/28576)
- [Wikidata Q2526688](https://www.wikidata.org/wiki/Q2526688)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Koepelkerk,_Berltsum) (RCE 20033957, 20033958, 20033959, 20033961; 20191023 koepelkerk van Berlikum; 20191023 torenspits koepelkerk van Berlikum; 2023 Berltsum, Koepeltsjerke; Koepeltsjerke, Berltsum; Berlikum, kerk foto5 2010)
- BAG-pand 0083100000001644 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000001644) (goot, lantaarn)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
