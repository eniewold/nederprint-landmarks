# Watertoren Neckardreef (Utrecht-Overvecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-utrecht-neckardreef-overvecht.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de band en de kroonlijst zijn achthoekige prisma's en omhullingen van achthoeken, de steunberen blokken, de koepel een omwenteling met acht segmenten, en de vensters, de ingang en de dichtgemetselde vensters blinde nissen.

De watertoren aan de Neckardreef 40 werd in 1934-1935 gebouwd voor de Drinkwaterleiding Noord-West-Utrecht (D.N.W.U.), in opdracht van de toenmalige gemeente Maartensdijk, naar ontwerp van bedrijfsleider J.L. Pateer, in de stijl van de Amsterdamse School. Hij is 48,6 m hoog (met de makelaar) en heeft een vlakbodemreservoir van 500 m³ (rijksmonument 514451). Sinds 2018 is hij van een particuliere eigenaar. De toren staat er nog (BAG-pand in gebruik, AHN, luchtfoto). Een achtkante toren met een betonskelet, bekleed met baksteen: vier gevels met velden van spleetvensters, vier gevels met een gemetselde steunbeer over de volle hoogte, een betonnen band op ruim 27 m, een betonnen kroonlijst met omgang en een achtkante koperen koepel.

## Bestanden

- `watertoren-utrecht-neckardreef-overvecht.glb`: één node, `building:watertoren-schacht-steunberen-vensters-band-kroonlijst-en-koepel`.
- `watertoren-utrecht-neckardreef-overvecht.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-utrecht-neckardreef-overvecht-1-1000.stl`: het model op 1:1000 (14,0 × 13,7 × 47,7 mm).

## Oorsprong en oriëntatie

RD-oorsprong [136725.69, 458761.485] (52,11678 N, 5,12040 O): het hart van de achthoek van BAG-pand 0344100000057728 (het midden van de vier paren tegenover elkaar liggende hoeken; omgeschreven straal 6,55 m, apothema 6,05 m), op het maaiveld: AHN-DTM NAP +1,36 (1,29 tot 1,53 tussen 7,5 en 12 m).

De achthoek staat 1,25 graden met de klok mee gedraaid ten opzichte van RD (gemiddelde van de acht hoeken in de BAG-contour). De lokale X-as wijst naar een hoek van de achthoek (`xAxis` = RD-oost −1,25 graden), Y 90 graden linksom. Hoeken hieronder in graden linksom vanaf de lokale X-as: de gevels staan op 22,5 + k × 45 graden, de steunberen op 22,5, 112,5, 202,5 en 292,5 (de BAG-contour heeft daar uitsprongen van 0,92 × 0,94 m), de vensterveldgevels op 67,5, 157,5, 247,5 en 337,5. De ingang ligt op 157,5 graden (west-noordwest): daar ligt het BGT-erf voor de gevel, en de tekening van Wout Heinen "uit het noordwesten" toont de ingang rechts van een steunbeergevel.

`groundSamplePoints` liggen op 9 m in de vier asrichtingen, buiten de steunberen; `groundHeight` 44,58 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 44,67, west 44,86, noord 44,92, zuid 44,58, gemeten 2026-11-06). Het PDOK-pand staat op 44,56. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +1,36).

- Schacht: achthoek met apothema 6,05 m (BAG) tot de band; erboven 0,15 m terug (apothema 5,9 m), het register noemt de toren "versmald na ruim 30 m".
- Steunberen: 0,92 m breed en 0,94 m voor de gevel (BAG), van het maaiveld tot de bovenkant van de kroonlijst (39,2 m); boven de band 0,15 m terug zoals de gevel, op de band een betonnen kraag van 0,15 m rondom.
- Band: betonnen band van 27,07 tot 28,5 m die 0,3 m uitsteekt (apothema 6,35 m), met een schuine onderkant van 48 graden.
- Vensterveldgevels: een veld van vier spleetvensters (0,45 m breed, 0,35 m diep, penanten van 0,35 m, samen 2,85 m) van 5,2 tot 24,6 m onder de band en van 29,75 tot 37,2 m erboven, met spitse koppen; drie kleine vensters van 0,47 × 1,0 m (0,9 m hart op hart) van 25,9 tot 26,9 m vlak onder de band.
- Ingang op 157,5 graden: een nis van 3,3 m breed en 0,3 m diep onder een betonnen luifel over de hele gevelbreedte die 0,5 m uitsteekt. Het nisplafond en de onderkant van de luifel vormen één vlak van 48 graden, van 2,04 m aan de achterwand tot 2,92 m aan de voorrand; de luifel is 3,12 m hoog. Ervoor een stoep van 3,6 × 1,2 m en 0,2 m hoog.
- Dichtgemetselde dubbele vensters: 1,0 × 1,0 m van 1,1 tot 2,1 m, op de steunbeergevels aan weerszijden van de steunbeer (1,6 m uit het midden), op de drie andere vensterveldgevels als paar (1,0 m uit het midden).
- Kroonlijst: betonnen kroonlijst van 38,0 tot 39,2 m die 0,45 m voor de bovenste gevel uitsteekt (apothema 6,35 m), met een schuine onderkant van 48 graden en een omgang op de bovenkant.
- Koepel: achtkant, vlakken boven de gevels en graten boven de hoeken; apothema 5,45 m aan de voet, profiel uit het AHN-DSM: 40,2 m bij 5,45 m, 42,05 m bij 5,0 m, 43,95 m bij 4,0 m, 45,25 m bij 3,0 m, 46,2 m bij 2,0 m, 46,95 m bij 1,0 m en de top op 47,4 m.

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt; spleetvensters zijn 0,35 m diep met een spitse kop van 55 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Neckardreef)): 1934-1935 (Stenvert e.a. noemen 1927), J.L. Pateer, Amsterdamse School, achtzijdig, 48,6 m, vlakbodemreservoir van 500 m³; tot 1954 in de gemeente Maartensdijk, nu in Park de Watertoren; in 2018 door Vitens verkocht.
- [Rijksmonumentenregister 514451](https://monumentenregister.cultureelerfgoed.nl/monumenten/514451): achtzijdige toren met een betonskelet en baksteen, ruim 49 m, versmalt na ruim 30 m, koperen koepeldak; spleetvensters op vier zijden, gemetselde steunberen over de volle hoogte op de andere vier; verdiepte ingang met betonnen luifel, stalen deur en betonplaat "D.N.W.U."; dichtgemetselde dubbele vensters onderin; gebogen lage muurtjes bij de ingang.
- BAG-pand 0344100000057728 (PDOK, 2026-11-06): regelmatige achthoek met vier uitsprongen (de steunberen); de BAG noemt bouwjaar 1956, wat niet klopt met register en Wikipedia.
- BGT (PDOK, 2026-11-06): een erf van 3 × 4,6 m voor de west-noordwestgevel.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +1,36; kroonlijst NAP +40,6 (39,2 m) tot apothema 6,4 m; koepel per 0,25 m apothema (mediaan) tot NAP +48,8 (47,4 m).
- PDOK-luchtfoto (Actueel_orthoHR): koperen achtkante koepel met graten naar de hoeken, steunberen op de diagonale gevels.
- Foto's op Wikimedia Commons: de RCE-foto's "Overzicht - Utrecht - 20235329 - RCE.jpg" (frontaal op de ingangsgevel), "Aanzicht - Utrecht - 20235330 - RCE.jpg" en "Ingang - Utrecht - 20235331 - RCE.jpg", "Watertoren Utrecht Overvecht.JPG", "Overvecht Watertoren Vijver.JPG" en de tekening "HUA-28754-Gezicht op de watertoren Overvecht aan de Neckardreef te Utrecht uit het noordwesten.jpg".

## Geschat en weggelaten

Geschat: de hoogtes van de band, de vensterveldgevels, de kleine vensters, de kroonlijstdikte en de luifel komen uit de frontale RCE-foto, geschaald op de gevelbreedte (5,0 m uit de BAG) en gecontroleerd op de kroonlijst uit het AHN (de foto gaf 39,9 m, het AHN 39,2 m; alle fotomaten zijn met die factor gecorrigeerd). De breedte van de spleetvensters en penanten, de maat van de kleine vensters en de ingang (nis 3,3 m breed, 0,3 m diep) komen uit dezelfde foto en de foto van de ingang. Het terugspringen van de bovenste gevel (0,15 m) is geschat: op de foto's is het verschil klein. Waar de dichtgemetselde vensters op de drie vensterveldgevels zonder ingang zitten, is niet gefotografeerd; ze staan als paar naast het midden. Het koepelprofiel komt uit het DSM, dat op 0,5 m de overgang van de steile voet naar het bolle bovendeel iets afvlakt. De ingang is dieper dan 0,3 m en heeft een vlak plafond; hier lopen nisplafond en luifel in één vlak van 48 graden, zodat de luifel zonder steun te printen is.

Weggelaten: de makelaar op de koepel (dun, tot 48,6 m), het hekwerk op de omgang, de koperen ribben op de koepel, de getande hoeken van het metselwerk, de V-vormige onderdorpels en koppen van de spleetvensters als aparte vormen (ze zijn hier spitse koppen), de betonnen lateien en dorpels van de vensters, de plaat "D.N.W.U." (reliëf van circa 0,1 m), de gebogen lage muurtjes en leuningen bij de ingang (smaller dan 0,9 m) en de plint in een andere steenkleur.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achthoekig prisma met smalle steunberen en een grove, hoekige kap) de spleetvensterveldgevels onder en boven de band, de band en de kragen om de steunberen, de kleine vensters, de verdiepte ingang met luifel, de dichtgemetselde vensters, de kroonlijst met omgang en de regelmatige achtkante koepel.

Controle-URL: http://localhost:3000/kaart/52.11678/5.12040/200/1x1/0
