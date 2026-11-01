# Watertoren Oude Pekela

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oude-pekela.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een geëxtrudeerde achthoek met per vlak een uitgesneden terugsprong, de ronde wand, luifels, daklijst en opbouw zijn omwentelingsprofielen; vensters en deur zijn nissen.

De watertoren aan de Winschoterweg in Oude Pekela is in 1938 gebouwd naar ontwerp van H.F. Mertens (ook Bilthoven, Soest en Stadskanaal), 48 m hoog met één reservoir van 1000 m³. Hij is rijksmonument 520988, sinds 2008 buiten gebruik en sinds 2016 een woning.

## Bestanden

- `watertoren-oude-pekela.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een losse kop zou een eigen voet tot de grondplaat krijgen.
- `watertoren-oude-pekela.json`: catalogusitem met RD-oorsprong, `xAxis`, maaiveldpunten, `groundHeight` en het vervangen BAG-pand.
- `watertoren-oude-pekela-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [264469.0, 570703.35], het hart van de ronde wand in het AHN (omhullende boven 20 en 30 m en de randen van het dak), op maaiveld (NAP +1,17 m, het AHN-maaiveld rond de voet; de omgeving ligt lager, rond NAP +0,5 tot +0,8). De BAG-contour van pand 0765100000002849 (in gebruik, bouwjaar 1936) is grof: acht pieken op r 8,0 tot 8,5 op de hoeken en bochten op r 6,5 ertussen; het hart ervan ligt 0,5 m van de oorsprong. Assen in RD-richting (`xAxis` [1, 0]). De hoeken van de achthoek staan op 30,5 + k·45 graden linksom van RD-oost, uit de BAG-pieken (−14,4 + k·45, gemiddeld) en de AHN-sectoren met de penantkappen. Het vlak met de twee grote benedenvensters staat naar het zuidwesten (normaal op 233 graden), naar de bocht van de Winschoterweg waarvandaan de RCE-foto genomen is; de deur zit in het vlak links daarvan (west). `groundHeight` 42,14 is het ellipsoïdische maaiveld: NAP +1,17 plus de NLGEO2018-geoïdehoogte van 40,97 m op de oorsprong. Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde andere pand ligt circa 24 m verderop.

## Onderdeel `building:achtkante-schacht-met-penanten-reservoir-en-opbouw`

- Achtkante bakstenen schacht, 14,5 m over de vlakken (zijde 6,0 m), recht omhoog tot 32,7 m. In elk vlak een kolom smalle vensters (0,4 × 2,1 m) op 7,1, 13,0, 18,6 en 29,9 m en een rond venster van 1,5 m op 25,6 m.
- Boven 32,7 m springt het midden van elk vlak (4,0 m breed) terug tot de ronde wand; onder de terugsprong een gebogen luifel van 0,3 m dik, met de voorrand op r 7,6 (in het midden 0,35 m voor het vlak) en een onderkant onder 56 graden. Erboven in elke terugsprong nog een smal venster van 34,9 tot 37,1 m.
- De acht hoeken lopen als penanten (1,0 m langs elk vlak) door tot witte kappen van 35,4 tot 36,5 m, 0,1 m buiten de penant met een schuine onderkant.
- Ronde reservoirwand van 13,7 m tot de witte daklijst (r 6,97) van 45,35 tot 45,75 m, met boven elke penant een smal venster van 40,6 tot 42,3 m. Plat dak op 45,75 m (AHN).
- Teruggelegen ronde opbouw van 11,8 m met deklijst (r 6,0) en plat dak op 47,45 m (AHN-dak NAP +48,62).
- Aan de kant van de weg: deur (1,2 × 3,6 m) in het westvlak, een venster van 1,6 × 2,7 m in het zuidwestvlak en een van 1,2 × 2,7 m in het zuidvlak.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Oude_Pekela)): architect, bouwjaar, 48 m, 1000 m³, rijksmonument 520988, gebruik.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de voet NAP +1,17, plat dak binnen de opbouw NAP +48,62 (47,45 m boven de voet), ring rond de opbouw op NAP +46,94 (45,77 m), wand van circa 13,7 tot 14 m met randbloei, opbouw circa 11,8 m, penantkappen als pieken rond r 7,5 tot 8 op de hoeken.
- BAG-pand 0765100000002849 en luchtfoto (PDOK, 8 cm): ligging, de acht hoeken, de witte daklijst en opbouw met dakluik.
- Foto [Overzicht watertoren - Oude Pekela - 20365171 - RCE](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Oude_Pekela_-_20365171_-_RCE.jpg), van verder weg recht op het zuidwestvlak: alle hoogtes en breedtes, geschaald op het dak in het AHN (12,07 px/m); daklijst op de foto 45,6 m tegen 45,77 in het AHN. Dat de lage en hoge kappen even hoog zijn, volgt uit het perspectief: het hoogteverschil op de foto past bij het diepteverschil tussen de hoeken op ±22,5 en ±67,5 graden, net als bij de ronde daklijst.
- Foto's [Oude Pekela Watertoren 2006](https://commons.wikimedia.org/wiki/File:Oude_Pekela_Watertoren_2006.JPG), [Oude Pekela - watertoren](https://commons.wikimedia.org/wiki/File:Oude_Pekela_-_watertoren.JPG) en [2013 Watertoren](https://commons.wikimedia.org/wiki/File:2013_Watertoren.jpg): penanten, kappen, gebogen luifels en terugsprongen, vensterkolommen, deur en benedenvensters.

## Geschat en weggelaten

Geschat: de vlakken en vensters aan de noord- en oostkant (geen foto's; gelijk aan de zichtbare vlakken, zonder benedenvensters), de breedte van de penanten langs de vlakken (1,0 m, uit de breedte van de luifel), de dikte en uitsteek van luifels, kappen en daklijsten, de diepte van de nissen (0,25 tot 0,4 m), de hoogte van de onderste vensters die achter struiken en een boom vallen, en de exacte richting van het voorvlak (op de foto's, binnen de 45-gradenstappen van de BAG-hoeken).

Weggelaten (kleiner dan 0,9 m of te dun): de kleine vierkante vensters in de opbouw, het dakluik en het lage dakhuisje op het dak, de bliksemafleider, de windvaan en de antennes, de lichte schuinte aan de bovenkant van de kappen, de naad onder elk venster en het hek met de letters PG voor de toren (los op het maaiveld, geen deel van het pand).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,01 % (gemeten 1,00000): luifels, kappen en daklijsten hebben een onderkant onder 56 graden en de nissen een plafond dat onder 56 graden naar binnen oploopt. De doorsneden op 1,5, 8, 25,6, 32,55, 34, 36, 41,5 en 46,5 m (deur en vensters, vensterkolom, ronde vensters, luifels, penanten, kappen, vensters boven de penanten, opbouw) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,14–0,19 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/53.11186/7.02201/200/1x1/0
