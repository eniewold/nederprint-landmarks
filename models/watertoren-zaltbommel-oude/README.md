# Oude watertoren (Zaltbommel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zaltbommel-oude.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, trompet en kop zijn één omwentelingsprofiel, de kantelen en ribben sectoren daarvan, de deuromlijsting een omhulsel; deur en vensters zijn spitsboognissen.

De oude watertoren van Zaltbommel staat aan de Stadsdijk (nummer 3-5), op de dijk ten oosten van de binnenstad. Hij is in 1905 gebouwd naar ontwerp van Jan Schotel, 21 m hoog met een reservoir van 50 m³. Na de buitengebruikstelling in 1960 is het reservoir uitgesloopt; in 1996 is de hele kop opnieuw opgemetseld (watertorenprijs 1996) en sinds 2000 is het een woning. Het is een gemeentelijk monument (0297/WN233).

## Bestanden

- `watertoren-zaltbommel-oude.glb`: één node van klasse `building`, op het maaiveld: plint, schacht, trompet, kop en kantelen samen. De export vult elke node apart op; een losse kop zou een eigen voet krijgen.
- `watertoren-zaltbommel-oude.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-zaltbommel-oude-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [145974.06, 425148.81], het middelpunt van de ronde BAG-contour van pand 0297100000003677 (straal 2,80 m; het gat in het AHN-DTM ligt op dezelfde plek), op maaiveld (NAP +8,85 m, het DTM direct rond de voet; de dijk loopt aan de oostkant op 4 m van het hart af naar NAP +7,7). Assen in RD-richting (`xAxis` [1, 0]).

De deur staat op kompas 172 graden, naar het hek aan het dijkpad (luchtfoto). Het onderste schachtvenster en één rib van de trompet staan erboven, de twee hogere schachtvensters 40 graden links en rechts daarvan; de acht kopvensters op 22,5 graden naast de deur en verder elke 45 graden, één kanteel boven de deur.

## Onderdeel `building:plint-schacht-trompet-en-kop-met-kantelen`

- Plint van 4,9 m (straal 2,45) tot +5,45 met een gemetselde band op +4,85 tot +5,15 (schuine onderkant) en een schuin waterlijst naar de schacht tot +5,8.
- Deuromlijsting van 1,9 m breed, 0,12 m voor de plint, met een spitse top tot +5,16 (56 graden); daarin de deur met bovenlicht, 1,0 m breed tot +3,5, als nis van 0,3 m in de plint.
- Ronde schacht van 4,2 m (straal 2,1) met een kraaglijst (straal 2,2) van +13,73 tot +14,46.
- Holle trompet (kwartellips, onderaan verticaal, bovenaan horizontaal) van straal 2,2 op +14,46 naar 3,4 op +15,94, met achttien witte ribben van 0,25 m breed en 0,12 m uit het vlak die onderaan schuin op de kraaglijst uitlopen.
- Kop van 6,6 m (straal 3,3) met een band (straal 3,4) van +15,94 tot +16,46, acht spitsboogvensters van 0,8 × 1,9 m (+17,45 tot +19,35) als nis van 0,3 m, een boogfries (straal 3,37) vanaf +19,73 en een kroonlijst (straal 3,45) vanaf +20,3, beide op een schuine onderkant.
- Plat dak op +20,9 binnen een borstwering van 0,8 m dik (straal 2,5 tot 3,3) tot +21,1, met tien kantelen van 18 graden (1,04 m buiten, 0,79 m binnen) tot +22,0.
- Drie rondboogvensters in de schacht als spitsboognis van 0,7 × 1,9 m: boven de deur van +7,05 tot +8,95, en 40 graden links en rechts daarvan van +10,3 tot +12,2.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Oude_watertoren_(Zaltbommel)): bouwjaar 1905, architect J. Schotel, hoogte 21 m, reservoir 50 m³, geschiedenis.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +8,8 tot +9,1 direct rond de voet, plat dak op NAP +29,6 tot +29,9 (3D BAG: dak 29,76, 20,9 m boven maaiveld). Het DSM ziet het dak maar 4,1 tot 5 m breed en mist de borstwering: de randcellen liggen tussen 16 en 26 m (boomkruinen rondom en het dak), dus voor de breedte van de kop is het niet bruikbaar.
- BAG-pand 0297100000003677 (in gebruik, bouwjaar in de BAG 1920): een cirkel van 2,80 m straal; de 3D BAG maakt er een cilinder van tot NAP +29,76.
- Luchtfoto (PDOK, 8 cm): de kop als cirkel van 6,6 tot 6,7 m met het lichte platte dak en de kantelen langs de rand, en het pad met het hek naar de deur.
- Foto [positie1 foto6](https://commons.wikimedia.org/wiki/File:Zaltbommel,_de_Oude_Watertoren_positie1_foto6_2015-08-06_11.04.jpg) (2015, van verder weg, bijna frontaal op de deur): de silhouetbreedtes per hoogte en alle hoogtes van de kop, de trompet, de kraaglijst en de vensters, op 26 px/m (kop van 6,6 m), verankerd op de bovenkant van de kroonlijst op het dak (20,9 m); de deurboog onderaan komt daarmee op 3,65 m, zoals op de RCE-foto.
- Foto [Oude watertoren, Zaltbommel](https://commons.wikimedia.org/wiki/File:Oude_watertoren,_Zaltbommel_-_panoramio.jpg) (telelens): de kantelen, de kroonlijst, de boogfries, de spitsboogvensters op 45 graden en de trompet met de witte ribben (op 20 graden) en de gemetselde band eronder.
- [RCE-foto 20339441](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_VOORZIJDE_-_Zaltbommel_-_20339441_-_RCE.jpg) (1999, voorzijde): de plint met band en waterlijst, de deuromlijsting met bovenlicht en de schachtvensters; de hoogte van de plint (5,45 tot 5,8 m) is op de deur geschaald.
- Foto [Zaltbommel watertoren 01](https://commons.wikimedia.org/wiki/File:Zaltbommel_watertoren_01.jpg): de kop van een andere kant met dezelfde vensters en kantelen.

## Geschat en weggelaten

Geschat: de bovenkant van de kantelen (22,0 m) volgt uit de foto's, omdat het AHN alleen het dak (20,9 m) ziet; Wikipedia noemt 21 m. De diameter van de kop komt uit de luchtfoto (6,6 tot 6,7 m), de verhoudingen daaronder uit de silhouetbreedtes op de foto (schacht 0,64 en plint 0,74 van de kop, plint 1,09 tot 1,17 maal de schacht); de plint is daarmee smaller dan de BAG-contour (4,9 tegen 5,6 m) maar past in het DTM-gat van 4,5 tot 5 m. De vorm van de trompet (kwartellips) en de diepte van de lijsten (0,07 tot 0,15 m) zijn geschat. De stand van de deur komt van de luchtfoto (het pad), de stand van de vensters van twee foto's vanaf de deurzijde; vensters op de noordkant van de schacht zijn niet bekend en dus niet gemodelleerd. Het dak staat in het DSM circa 1 m noordoostelijk van het BAG-middelpunt, maar de foto's laten geen scheefstand zien; de toren staat recht op het BAG-middelpunt.

Weggelaten: de ongeveer twintig kantelen van 0,5 m zijn tien van 1,04 m geworden (minimaal 0,9 m, met even brede tussenruimtes); de boogfries is een band op een schuine onderkant, de gele banden in het metselwerk hebben geen eigen vlak; de kleine glasbouwstenen in de vakken van de trompet, de steen boven de deur onder de trompet, de traptreden voor de deur, de vlaggenmast en de windvaan (onder 0,9 m); het hek en de bebouwing in de tuin (geen BAG-pand).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 1,2 % (gemeten 1,0120): dat is alleen de wig onder de holle trompet en haar ribben, die van 14,46 tot 15,94 m 1,2 m uitkraagt en bovenaan horizontaal loopt; op 15,2 m is de doorsnede na het opvullen groter. Lijsten, banden en ribvoeten hangen onder 34 tot 35 graden over, deur en vensters zijn spitsbogen onder 56 graden: de doorsneden op 1, 3, 5, 6, 8, 11, 13, 14, 16,2, 18,5, 20, 20,6 en 21,5 m blijven gelijk. Op de kaart hoort de toren op de plek van het verborgen PDOK-pand te staan, met de deur naar het pad aan de zuidkant. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt alleen een wig steun onder de holle trompet (14,6–15,9 m). Op de kaart staat de toren op de dijk met de voet 0,11–0,39 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.81486/5.25634/200/1x1/0
