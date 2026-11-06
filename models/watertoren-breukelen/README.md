# Watertoren Breukelen (Breukelen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-breukelen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw is een licht verjongende achthoek (convexe omhullende van twee achthoeken), de opbouw een zestienhoekig prisma met een schuine kraag, het dak een steile zestienhoekige voet met een zestienzijdige piramide erop, en de stroken en vensters zijn nissen.

De watertoren aan de Straatweg 187 staat ongeveer vijftig meter terug van de straat in het noorden van Breukelen. Hij is in 1927-1928 gebouwd voor de Stichting Drinkwaterleiding Noord-West Utrecht (DNWU), vermoedelijk naar ontwerp van de Bussumse architect J. Gerber, door Schäffer & Co. uit Duisburg, en is gemeentelijk monument. De toren is in dragend metselwerk uitgevoerd en sinds de restauratie van 1963 met kristalcement bespoten; het betonnen reservoir (holbodem, 10,2 m doorsnede, 400 m³) staat boven een lekvloer op 26 à 27 m. De onderbouw is achtkant; op twee derde van de hoogte verspringt de toren naar een zestienhoekige opbouw. De hoeken van de onderbouw grijpen als kantelen in die opbouw, terwijl de opbouw tussen de kantelen over de onderbouw kraagt. Om het andere vlak loopt een verticale, verdiepte strook tot onder de opbouw. Sinds 1963 heeft de toren een zestienzijdig puntdak met bitumineuze bedekking (de tekening van 1927 had een plat dak).

## Bestanden

- `watertoren-breukelen.glb`: één node `building:watertoren-achtkant-kantelen-zestienhoek-en-puntdak`, op maaiveld.
- `watertoren-breukelen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-breukelen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [128846.05, 466420.24] (52,18529 N, 5,00477 O), het hart van BAG-pand 0311100000007807 (gemiddelde van de acht hoekpunten; apothema 5,61 tot 5,69 m, gemiddeld 5,65). Maaiveld AHN-DTM NAP -0,7 (ring van 6 tot 14 m: mediaan -0,70 tot -0,76). Lokale +X is de normaal van het oostvlak met de ingang (RD 7,43 graden, gemiddelde van de acht vlaknormalen modulo 45 graden; `xAxis` [0.9916, 0.12931]): tegen dat vlak ligt het BGT-erf van de stoep (2,6 × 4,9 m), daar staat de luifel in het AHN-DSM en daar komt de oprit van de Straatweg aan. `groundHeight` 42,5 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 8 m van het hart (noord 42,56, west 42,69, zuid 42,50, noordoost 42,59; gemeten 2026-11-06); het PDOK-pand begint op 42,29. Het model vervangt BAG-pand 0311100000007807, zodat het PDOK-blok verdwijnt; de buurpanden (het bijgebouw 0311100000007809, de bergingen) raken het model niet en staan in PDOK op hun eigen hoogte.

## Onderdeel `building:watertoren-achtkant-kantelen-zestienhoek-en-puntdak`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Onderbouw: achthoek met apothema 5,65 m op maaiveld tot 5,55 m op 27,5 m (vlaknormalen op 0, 45, ... graden).
- Verdiepte stroken van 1,05 m breed en 0,3 m diep op de vlakken op 0, 90, 180 en 270 graden, van 5,6 tot 26,8 m (plafond 56 graden).
- Vensters als nissen van 0,3 m: een vensterpaar (één nis van 1,5 m) van 4,1 tot 5,1 m boven de luifel en in de schuine vlakken naast de ingang; kleine trapvensters van 0,9 × 1,1 m in de vier schuine vlakken op 10,4, 16,9 en 23,8 m.
- Entree op het vlak +X: gemetselde stoep van 4,0 m breed tot 1,5 m voor de gevel op 0,9 m, met een trede van 3,4 m breed tot 2,2 m op 0,5 m; deur van 2,0 m breed van 0,9 tot 2,75 m (0,4 m diep); luifel van 3,6 m breed en 0,5 m diep met een onderzijde onder 48 graden van 3,1 tot 3,65 m en de bovenkant op 3,85 m.
- Kraag en kantelen: de zestienhoekige opbouw (apothema 5,66 m) begint op 27,25 m bij 5,49 m en kraagt onder 56 graden uit tot 27,5 m; de hoeken van de achthoek lopen tot 28,3 m door en steken tot 0,35 m buiten de zestienhoek (de kantelen).
- Opbouw: vensterparen (nis van 1,5 m) van 28,6 tot 29,7 m en van 37,6 tot 38,45 m op de vlakken op 0 en 180 graden, smalle vensters van 0,9 m op dezelfde hoogtes op 90 en 270 graden.
- Kroonlijst: 0,1 m uitstek onder 45 graden van 38,8 tot 38,9 m, bovenkant 39,3 m (muurkroon NAP +38,70 op de tekening van 1963).
- Dak: steile zestienhoekige voet van apothema 5,3 m op 39,3 m tot 5,05 m op 40,55 m, daarop een zestienzijdige piramide tot 43,9 m (helling 0,66, circa 33 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Breukelen)): bouwjaar 1927-1928, J. Gerber(?), circa 44 m, 400 m³.
- Vocus architecten, beschrijving gemeentelijk monument Straatweg 187 (bijlage 12 van het bestemmingsplan "Watertoren Breukelen", [ruimtelijkeplannen.nl](https://www.ruimtelijkeplannen.nl/documents/NL.IMRO.1904.PBwatertorenBKL-CC01/b_NL.IMRO.1904.PBwatertorenBKL-CC01_Bijlage12.Monument.pdf)): architectonische omschrijving (achthoek, zestienhoekige opbouw op twee derde van de hoogte, kantelen, kraag, strook om het andere vlak, vensters, luifel en stoep, restauratie 1963), foto's, en uit J.G. Bokma, "De watertoren van Breukelen", Tijdschrift Historische Kring Breukelen 1996-4, het ontwerp van 1927 en tekening T 07/9 van 1963 (vooraanzicht en doorsnede met muurkroon NAP +38,70 en top +43,50). Uit het vooraanzicht van 1963 (circa 37,8 px/m, geschaald op 43,9 m van maaiveld tot de top): kraag op 27,5 m, de strook vanaf circa 5,3 m, de vensterhoogtes, de luifel en de steile dakvoet; uit de tekening van 1927 de trapvensters op 10,4, 16,9 en 23,8 m.
- BAG-pand 0311100000007807 (PDOK, 2026-11-06): regelmatige achthoek van 11,3 m over de vlakken, bouwjaar 1928.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP -0,7, top NAP +43,21, dak met helling 0,65 tussen 1 en 4,5 m van het hart (NAP +40,5 op 4,25 m), muur tot circa 5,5 à 5,7 m van het hart, luifel op NAP +2,7 à +3,0 tot circa 1,3 m voor het oostvlak.
- BGT (PDOK, 2026-11-06): erf van de stoep tegen het oostvlak, oprit van de Straatweg aan de zuidoostkant.
- Luchtfoto (PDOK, 2026-11-06): puntdak met veel vlakken, top in het midden.
- Foto op Wikimedia Commons: "Breukelen Watertoren 4787" (2007, vanuit het oosten): kantelen en kraag, de stroken, vensterparen, trapvensters, luifel, deur en stoep, en de donkere steile dakvoet.

## Geschat en weggelaten

Geschat: de uitkraging van de opbouw (0,11 m over het midden van een vlak) en daarmee hoe ver de kantelen uitsteken (0,35 m), en hun hoogte (0,8 m, foto); de lichte verjonging van de onderbouw (vooraanzicht 1963); de breedte en diepte van de stroken; de vensters als nissen van minstens 0,9 m (in het echt kleiner en in paren) en op welke vlakken ze zitten (alleen de oost- en zuidkant staan op foto's; de trapvensters komen van de tekening van 1927 en zijn op alle vier de schuine vlakken gezet); de stoep op 0,9 m (het PDOK-terrein legt het erf van de stoep tot 0,87 m boven de onderkant van het model, in het echt circa drie treden); de luifel 0,5 m diep met een schuine onderzijde in plaats van een vlakke plaat van circa 1,3 m, en de deur daardoor 1,85 m hoog boven de stoep; de kroonlijst en de steile dakvoet (doorsnede 1963, foto); de helling en de top van het dak uit het AHN.

Weggelaten: betonnen lateien en onderdorpels, de deurlijsten en de plint (kleiner dan 0,9 m), antennes en kabelgoten aan de opbouw, het bijgebouw met plat dak (eigen BAG-pand, niet beschermd). Of de verbouwing tot vijf woningen (vergunning 2022) de gevels heeft veranderd, is op de luchtfoto niet te zien; het model volgt de toren van de foto's.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: kraag 56 graden, kroonlijst 45 graden met de dakvoet erboven, luifel 48 graden boven een latei, nissen met een plafond van 56 graden, dak verjongend. Een export op 1:1000 (100 × 100 m rond de toren) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde achthoek met een grove achtzijdige kap) de sprong naar de zestienhoekige opbouw met kraag en kantelen, de verdiepte stroken, de vensters, de kroonlijst met de steile dakvoet en het zestienzijdige puntdak, en aan de oostkant de stoep, deur en luifel.

Controle-URL: http://localhost:3000/kaart/52.18528/5.00482/200/1x1/0
