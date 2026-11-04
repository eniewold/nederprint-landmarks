# Watertoren Heemstede (Heemstede)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-heemstede.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en kop zijn achtkante prisma's met verdiepte vlakken, banden, onderlijst en kroonlijst hebben schuine onderkanten, de consoles zijn convexe bouwdelen en het pomphuis heeft een zadeldak uit twee dakvlakken en een topgevel als profiel.

De watertoren aan de Nijverheidsweg, bij de noordelijke haven van Heemstede, is in 1910-1911 gebouwd naar ontwerp van A. Holmberg de Beckfelt. Volgens Wikipedia is hij 41,35 m hoog met één reservoir van 460 m³; hij is nog in gebruik voor de drinkwatervoorziening en is in 2006 gerestaureerd. Een achtkante, wit gepleisterde schacht met lisenen op de hoeken, vier horizontale banden en smalle vensterspleten draagt een bredere achtkante reservoirkop op acht schuine consoles, met een onderlijst, verdiepte gevelvlakken met een vensterspleet en een kroonlijst rond het platte dak. Tegen de zuidwestgevel staat het lage pomphuis met een zadeldak en een witte topgevel met hoekpijlers en een verhoogd middenrisaliet.

## Bestanden

- `watertoren-heemstede.glb`: één node `building:achtkante-schacht-reservoirkop-en-pomphuis`, op het maaiveld.
- `watertoren-heemstede.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-heemstede-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [103192.4, 484498.55] (52,34596 N, 4,62690 O), het hart van de achtkante kop: de kleinste omsluitende achthoek om het AHN-DSM boven 20 m (stand -122 tot -125 graden). De BGT-contour van het pand (met de lisenen op de hoeken) geeft een hart dat 0,2 m noordelijker ligt. Maaiveld AHN-DTM in een ring van 7 tot 13 m NAP +0,69 tot +0,96 (gebruikt +0,80). Lokale +X is de normaal van de gevel met het pomphuis, langs de lange as van het pomphuis uit de BGT (RD -122 graden, naar het zuidwesten; `xAxis` [-0.52992, -0.84805]); de acht gevelvlakken staan op 0, 45, ..., 315 graden. `groundHeight` 43,69 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (8 m rond de toren en 1,6 m voor het pomphuis; 43,69 tot 43,94). Het model vervangt BAG-pand 0397100000001556 (toren en pomphuis samen), zodat het PDOK-blok verdwijnt.

## Onderdeel `building:achtkante-schacht-reservoirkop-en-pomphuis`

- Plint: achthoek 4,15 m uit het hart tot 0,6 m, bovenkant onder 45 graden.
- Schacht: lisenen en banden 4,0 m uit het hart (8,0 m over de vlakken), 0,45 m langs het vlak aan weerszijden van elke hoek; daartussen het gevelvlak 0,25 m terug (3,75 m). Banden van 0,45 m op 5,6, 12,9, 20,4 en 27,5 m; het verdiepte vlak loopt onder elke band onder 45 graden op.
- Vensterspleten: in elk vlak drie boven elkaar (7,5-10,6, 15,3-18,2 en 22,2-25,0 m), 0,6 m breed als nis van 0,3 m met een plafond van 56 graden. Deur van 1,2 × 2,6 m in de zuidoostgevel (lokale +Y).
- Acht consoles van 1,0 m breed onder de hoeken: van de hoek van de lisene op 27,4 m (voet onder 53 graden) naar de hoek van de kop op 30,1 m (onderzijde 65 graden). Daartussen loopt de onderzijde van de kop onder 45 graden van het verdiepte vlak (28,75 m) naar het gevelvlak van de kop.
- Reservoirkop: achthoek 5,1 m uit het hart (10,2 m over de vlakken) van 30,1 m tot de kroonlijst; onderlijst 5,3 m van 31,3 tot 32,5 m; verdiepte vlakken (0,15 m) met een vensterspleet van 33,9 tot 37,4 m; kroonlijst 5,3 m van 39,1 m tot de borstwering op 40,95 m, beide met een onderkant van 45 graden.
- Dak op 40,5 m binnen een borstwering van 0,9 m, met een luik van 1,8 × 1,8 m tot 41,4 m in het midden en vier lichtkoepels van 1,1 m op 2,7 m van het hart (luchtfoto).
- Pomphuis: 9,7 m lang (van de schacht tot de voorgevel op 13,4 m uit het hart) en 7,1 m breed (BGT), plint met een schuine bovenkant, goot 4,575 m en nok 6,35 m (helling 0,5, AHN) langs de as. Topgevel met dekstenen 0,2 m boven het dak, hoekpijlers van 0,8 m tot 5,0 m, een middenrisaliet van 2,0 m met getrapte top (6,05 en 6,55 m) en een deur van 1,4 × 3,0 m, twee vensters in de voorgevel en drie in elke zijgevel als nissen.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Heemstede)): bouwjaar, ontwerper, 41,35 m, reservoir van 460 m³, nog in gebruik, restauratie 2006.
- BGT-pand G0397.9ff7f15494ed4cd8990029715aa6e4b8 en BAG-pand 0397100000001556 (PDOK, 2026-11-04): plattegrond van pomphuis en schacht, lisenen aan de voet, stand van het pomphuis.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP +0,80; dak NAP +41,3; luik NAP +42,2 (3D BAG `b3_h_dak_max` 42,22); omsluitende achthoek van de kop 10,5 m over de vlakken; pomphuis nok NAP +7,15, helling 0,5. Luchtfoto voor de borstwering, het luik en de lichtkoepels.
- Foto's op Wikimedia Commons: "Nijverheidsweg 5, heemstede" (van circa 80 m, vrijwel lineair: hoogtes van banden, consoles, onderlijst, kroonlijst en vensters, en de verhouding schacht/kop), "Heemstede, watertoren foto5 2011-06-12 10.41" en "Watertower Heemstede Nijverheidsweg 5" (consoles, kop en voorgevel van het pomphuis), "Watertoren Heemstede" (onderzijde van de kop).

## Geschat en weggelaten

Geschat: alle hoogtes van de geledingen (banden, consoles, onderlijst, kroonlijst, vensters) uit één foto met een lineaire schaal tussen maaiveld en kroonlijst; de dikte van schacht en lisenen uit de verhouding schacht/kop op die foto en de BGT (de schacht is recht gehouden, een lichte versmalling naar boven is op de foto's niet eenduidig); de hoogte van de borstwering (het AHN ziet het dak op 40,5 m, de rand van de kop niet scherp); de lichtkoepels en het luik uit de luchtfoto; de hellingen van de consoles (op de foto 58 tot 66 graden) en de onderzijde van de kop, die in het echt een vlak plafond tussen de consoles heeft en hier onder 45 graden loopt om zonder steun te printen; de topgevel van het pomphuis (hoogtes van risaliet en hoekpijlers uit één schuine foto en het AHN) en de plaats van zijn vensters; de deur van de toren.

Weggelaten: de ronde venstertjes (oculi) in de vlakken onder de kop en in de topgevel en de luchtroosters in de kroonlijst (kleiner dan 0,9 m), de lantaarnpaal en de antenne op het dak; de vensterspleten zijn 0,6 m in plaats van 0,3 tot 0,4 m breed.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: plint, banden, onderzijde van de kop, onderlijst en kroonlijst onder 45 graden, consoles onder 53 en 65 graden en nisplafonds onder 56 graden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export, de voet 0,3 tot 0,5 m in het PDOK-terrein, zonder ondersteuningsobject; de PDOK-reconstructie van het pand is verborgen. De buurpanden (0397100000007170, 0397100000007366, 0397100000015433) wijken in de PDOK-tegel niet meer dan 2 m af van het AHN binnen hun eigen contour en namen niets van de toren mee. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een achtkant prisma tot 41,5 m met een blokje voor het pomphuis) de bredere kop op consoles met onderlijst, verdiepte vlakken en kroonlijst, de lisenen, banden en vensterspleten van de schacht, de borstwering met luik en lichtkoepels, en het pomphuis met zadeldak en topgevel.

Controle-URL: http://localhost:3000/kaart/52.34596/4.62690/200/1x1/0
