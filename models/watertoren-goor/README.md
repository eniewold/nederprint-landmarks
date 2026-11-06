# Watertoren Goor (Goor)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-goor.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is opgebouwd uit omwentelingsvormen (prisma's en convexe omhullenden van cirkels), de aanbouw uit twee prisma's van de BAG-contour met een schuine dakrand, en de vensters en kantelen zijn nissen en uitsparingen.

De watertoren aan de Markeloseweg is in 1915 gebouwd; volgens Wikipedia is hij 29 m hoog met een reservoir van 125 m³. Het is een ronde bakstenen toren: een lage onderbouw met rondboogvensters onder een gepleisterde band, een licht verjongende schacht met vier kolommen vensters, een dunne band, een kort stuk metselwerk met kleine vensters, een holle gepleisterde overgang naar de bredere ronde reservoirommanteling met smalle hoge vensters, een gepleisterde kroonlijst en een gekanteelde borstwering. Aan de zuidkant staat een lage aanbouw met een plat dak, die in de BAG bij hetzelfde pand hoort.

## Bestanden

- `watertoren-goor.glb`: één node `building:watertoren-onderbouw-schacht-reservoirommanteling-kantelen-en-aanbouw`, op maaiveld.
- `watertoren-goor.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-goor-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [235743.6, 472420.48] (52,23393 N, 6,56920 O), het middelpunt van een cirkelpassing op de 26 boogpunten van BAG-pand 1735100000057191 (straal 3,73 m, spreiding 3,66 tot 3,80: de reservoirommanteling van bovenaf; het hoogste deel van het AHN-DSM ligt erop). Maaiveld NAP +12,1 (3D BAG 12,10; AHN-DTM in een ring van 6 tot 12 m: 12,04 tot 12,9, mediaan 12,24). +X naar het oosten, +Y naar het noorden (`xAxis` [1, 0]). `groundHeight` 55,56 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vijf `groundSamplePoints` (noord 55,60, west 56,12, oost 55,59, oost van de aanbouw 55,56, west van de aanbouw 55,80), gemeten met de terreintegels van de export. Het model vervangt BAG-pand 1735100000057191 (toren met aanbouw), zodat het PDOK-blok verdwijnt. Andere panden raken het model niet (het dichtstbijzijnde, een huisje van 10 m², staat 8 m ten noordwesten).

## Onderdeel `building:watertoren-onderbouw-schacht-reservoirommanteling-kantelen-en-aanbouw`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Onderbouw: cilinder van 5,8 m tot 3,8 m, met twee rondboogvensters van 0,9 m breed van 1,45 tot 2,75 m (spitse top tot 3,25 m) aan de westnoordwest- en noordoostkant.
- Gepleisterde band: 6,1 m, onderkant 45 graden van 3,8 tot 3,95 m, tot 4,6 m.
- Schacht: verjongt van 5,7 m op 4,6 m naar 4,9 m op 18,4 m; vier kolommen vensters (op 15, 105, 195 en 285 graden linksom vanaf oost) met elk vier vensters van 0,6 m breed: 4,75 tot 5,55, 8,7 tot 10,0, 12,2 tot 13,5 en 16,0 tot 17,2 m.
- Dunne band van 5,1 m van 18,4 tot 18,75 m; daarboven metselwerk van 4,84 m tot 19,4 m met vier kleine vensters (18,85 tot 19,4 m), verschoven ten opzichte van de kolommen.
- Holle overgang: kegelstuk van 32 graden uit het lood tot 19,95 m, daarna 45 graden tot de band van 7,64 m op 21,0 m; band tot 21,7 m.
- Reservoirommanteling: cilinder van 7,46 m van 21,7 tot 27,1 m met vier smalle vensters van 0,6 m breed van 22,9 tot 24,9 m boven de vensterkolommen.
- Kroonlijst van 7,68 m, onderkant 45 graden, van 27,1 tot 27,8 m.
- Borstwering van 7,56 m, 0,93 m dik, met twaalf kantelen van 1,03 m en inkepingen van 0,95 m van 27,8 tot 28,72 m (NAP +40,82).
- Binnen de borstwering een ring van 0,75 m breed tot 26,95 m en een rond reservoirdak van 4,2 m op 28,45 m (NAP +40,55) met een dakluik van 1,0 × 1,0 m tot 29,07 m (NAP +41,17).
- Aanbouw: de BAG-contour als een breed deel in het zuiden (circa 9,1 × 5,6 m, 3,7 graden gedraaid) en een hals naar de toren; wanden 0,3 m binnen de contour tot 3,15 m, dakrand met een onderkant van 45 graden tot de contour op 3,45 m, plat dak op 3,5 m (NAP +15,6). Een rondboogvenster in de oostgevel van de hals.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Goor)): bouwjaar 1915, hoogte 29 m, reservoir 125 m³.
- BAG-pand 1735100000057191 (PDOK, 2026-11-06): de ronde ommanteling (cirkel 7,46 m) en de aanbouw.
- 3D BAG (CC BY 4.0, TU Delft 3D geoinformation en 3DGI): maaiveld 12,10, h_dak_max 40,71, aanbouwdak circa 15,5.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): kantelen NAP +40,6 tot +40,87, reservoirdak +40,55, dakluik +41,17, binnen de borstwering een ring waar het DSM tot NAP +19 à +26 naar binnen kijkt, aanbouwdak +15,5 tot +15,7.
- Luchtfoto (PDOK, 2026-11-06): borstwering met kantelen, donker rond dak met het luik aan de zuidrand, zwarte sikkels langs de binnenrand, de aanbouw met hals en breed deel.
- Foto's op Wikimedia Commons: "Goor Watertoren 8803" (6 december 2006, vanuit het westen, met de aanbouw rechts) voor de geledingen en breedtes (verticaal 70,2 px/m tussen het aanbouwdak op 3,5 m en de kantelen op 28,7 m, horizontaal circa 66 px/m uit de ommanteling), en "Goor-markeloseweg-208095" (28 juni 2020, vanuit het westnoordwesten) ter controle.

## Geschat en weggelaten

Geschat: alle hoogtes van de banden, de overgang, de vensters en de kroonlijst en alle diameters behalve die van de ommanteling, uit één frontale foto (schaal uit de AHN-hoogtes en de BAG-cirkel); de stand van de vensterkolommen en de vensters van de ommanteling (op beide foto's niet eenduidig, hier op 15 + 90k graden en boven elkaar) en van de kleine vensters en de rondboogvensters in de onderbouw; de holle overgang als twee kegelstukken; de ring binnen de borstwering (uit het DSM en de zwarte sikkels op de luchtfoto, als blinde ring van 0,75 m breed en 1,5 m diep) en de plaats van het dakluik; de wanden en de dakrand van de aanbouw (contour = dakrand) en het venster in de hals. Vergroot voor 1:1000: kantelen 0,92 m hoog (in het echt circa 0,5 m) met inkepingen van 0,95 m (circa 0,55 m), vensters 0,6 m breed (circa 0,5 m).

Weggelaten: de vlaggenmast, de verticale pleisterlijnen op de ommanteling, de ventilatieroosters boven de vensters in de onderbouw, de regenpijpen en het hoogteverschil van circa 0,3 m tussen de oostelijke en westelijke helft van het aanbouwdak (kleiner dan 0,9 m), en de schoorsteen en de bijgebouwen verderop (eigen panden).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: banden, kroonlijst en dakrand met een onderkant van 45 graden, overgang van 32 en 45 graden, nissen met een plafond van 56 graden of een spitse top. Een export op 1:1000 van een uitsnede van 80 × 80 m rond de toren neemt het model op, met de voet op het PDOK-maaiveld. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de 3D BAG-reconstructie (een cilinder van 7,46 m met een plat dak op circa 40,7 m en de aanbouw) de smallere, verjongende schacht onder de bredere ommanteling, de banden en de holle overgang, de kroonlijst en kantelen, het verdiepte reservoirdak met luik, en de vensters aan alle kanten.

Controle-URL: http://localhost:3000/kaart/52.23382/6.56955/200/1x1/0
