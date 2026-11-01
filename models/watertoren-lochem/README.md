# Watertoren Lochem

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-lochem.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: hoofdtoren en trappentorentje zijn geëxtrudeerde achthoeken, plint, banden, afdeklijst en kroonlijst omhulsels van twee achthoeken, het dak van het torentje een achtkante piramide; middenvelden, deuren, roosters en vensters zijn nissen.

De watertoren van Lochem is in 1924 gebouwd naar ontwerp van architect H. Wessel, 18,6 m hoog met een reservoir van 250 m³. Hij staat op de beboste heuveltop aan de oostkant van Lochem (maaiveld NAP +36 m). Op het dak staan een vakwerkmast voor telecom en installatiekasten. De BAG noemt bouwjaar 1936.

## Bestanden

- `watertoren-lochem.glb`: één node van klasse `building`, op het maaiveld: toren, trappentorentje, ingang en installatiekasten samen. De export vult elke node apart op; een los torentje of los dakblok zou een eigen voet krijgen.
- `watertoren-lochem.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-lochem-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [225180.92, 463264.8], het hart van de achthoek in de BAG-contour van pand 0262100000008034, op maaiveld (NAP +35,98 m, mediaan van het DTM op 6 tot 8 m van het hart; het maaiveld op de heuveltop is vlak binnen 0,1 m). De gevels van de BAG-contour en de randen in het AHN liggen binnen 0,1 m van een regelmatige achthoek met apothema 5,4 m. +X staat loodrecht op de oostgevel, 14,4 graden linksom van RD-oost (`xAxis` [0.96858, 0.24869]); +Y wijst naar het trappentorentje aan de noordkant. De hoofdingang staat in het noordoostvlak (deur, omlijsting en torentje rechts ervan op de foto; het pad en de open plek op de luchtfoto liggen aan die kant). Er liggen geen andere panden binnen 35 m.

## Onderdeel `building:achtkante-toren-met-trappentorentje`

- Achtkante bakstenen toren van 10,8 m over de vlakken (zijden 4,47 m) op een plint die 0,15 m uitsteekt tot +1,0 met een schuine bovenkant tot +1,25. Plat dak op +13,7 achter een borstwering van 1,2 m dik tot +14,7.
- In elk vlak (behalve het noordvlak achter het torentje) een middenveld van 2,4 m breed en 0,2 m diep van +7,0 (de tandlijst) tot +12,3 (de natuurstenen kap), met het plafond onder 56 graden.
- Witte natuurstenen banden, 0,12 m uit op een schuine onderkant (56 graden): op +10,9 tot +11,2 (onderbroken door de middenvelden) en op +13,35 tot +13,65 op dakhoogte; afdeklijst van de borstwering 0,1 m uit, +14,45 tot +14,7.
- Ventilatieroosters als nissen van 0,9 × 0,5 m: op +9,35 in elk middenveld, op +5,75 eronder en op +2,6 in elk vlak behalve het ingangsvlak.
- Borstwering: in de schuine vlakken drie openingen van 0,55 m, in de rechte vlakken drie spleten van 0,3 m, als nissen van +13,85 tot +14,25.
- Hoofdingang in het noordoostvlak: deur van 1,4 × 2,4 m (vanaf +0,3) in een gemetselde omlijsting van 2,8 m breed, 0,2 m uit de gevel, met een puntige bovenkant tot +4,3; twee treden van 2,2 m breed ervoor (+0,3 en +0,15).
- Installatiekasten bij de voet van de mast: blok van 2,2 × 3,2 m tot +15,4 (AHN 1,2 tot 2,3 m boven het dak).
- Trappentorentje: achthoek van 3,2 m over de vlakken, hart 5,9 m ten noorden van het hart van de toren (half in de noordgevel), met plint, de banden van de hoofdtoren (0,1 m uit) en een band ter hoogte van de afdeklijst, kroonlijst 0,15 m uit van +17,4 tot +17,75 en een laag achtkant koperen dak tot +18,7. Deur van 1,0 × 2,25 m naar het noorden, spleetvensters van 0,45 × 1,0 m op +5,6 en +8,8 in de drie vrije vlakken, kleine vensters van 0,5 m op +12,3 (oost, noord, west) en op +15,9 in de vijf vlakken boven de borstwering.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Lochem)): architect, bouwjaar 1924, hoogte 18,6 m, reservoir 250 m³.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +35,98, plat dak +13,7 met borstwering tot +14,7, de randen van de achthoek op 5,25 tot 5,5 m van het hart, het torentje van v +4,3 tot +7,4 en u -1,5 tot +1,5 met de top op +18,7 en randen op +17,3 tot +18,1, de installatiekasten (+14,9 tot +16,0) en de vakwerkmast (pieken tot +23,8) op het dak.
- BAG-pand 0262100000008034 (bouwjaar 1936, in gebruik): de achthoek (zijden 4,2 tot 4,7 m) en het torentje (3,2 m breed, 2,3 m voor de noordgevel).
- Luchtfoto (PDOK): plat dak met witte afdeklijst, mast en kasten in het midden, het torentje met een groen koperen achtkant dak aan de noordkant, het pad naar de toren uit het noordoosten.
- Foto [Lochem Watertoren 2006](https://commons.wikimedia.org/wiki/File:Lochem_Watertoren_2006.JPG) (noordoostvlak met de ingang en het torentje, het oostvlak schuin links): plint, banden, middenvelden met tandlijst en kap, roosters, de borstwering met openingen en spleten, de deur met puntige omlijsting en treden, de deur, vensters en banden van het torentje, geschaald op de borstwering in het AHN (circa 64 px/m).

## Geschat en weggelaten

Geschat: er is maar één foto (het noordoost- en het oostvlak); de andere zes vlakken hebben dezelfde indeling gekregen (middenveld, banden, roosters, borstwering), want de toren is regelmatig. De hoogtes van banden, middenvelden, roosters en vensters komen van die schuine foto (circa 0,3 m nauwkeurig), het uitsteken van plint, banden en lijsten (0,1 tot 0,2 m) en de diepte van de nissen (0,2 tot 0,5 m) zijn geschat. De dikte van de borstwering (1,2 m) is groter dan in het echt, zodat er achter de nissen 1,0 m muur blijft. De installatiekasten zijn één blok op de plek van de verhoging in het AHN. De puntige bovenkant van de deur zelf is een nis met een schuin plafond.

Weggelaten: de vakwerkmast voor telecom (open vakwerk, staven ver onder 0,9 m) en de antennes op het torentje; de tandlijsten en de kanneluren van de hoekstroken (reliëf onder 0,1 m); de doorgaande openingen in de borstwering (de stijlen ertussen zijn 0,3 m; als nis gemodelleerd); de regenpijp, de lamp en het kozijnwerk.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet meetbaar (gemeten 1,0000000): banden, afdeklijst en kroonlijst hangen onder 56 graden en de nissen hebben een plafond onder 56 graden. Bij een borstwering van 0,9 m bleef achter de nissen 0,7 m over en verdikte de export die tot de nissen dicht waren; vandaar 1,2 m. De doorsneden op 1,1, 2,85, 6, 9,6, 11, 13,5, 14, 14,2, 14,4, 14,6, 16,1, 17,6 en 18,2 m blijven gelijk. Op de kaart hoort de toren op de plek van het verborgen PDOK-pand te staan, de voet 0,1 tot 0,2 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen alleen splinters steun in de roosternissen; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,07–0,23 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.15314/6.41267/200/1x1/0
