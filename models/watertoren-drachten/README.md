# Watertoren Drachten

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-drachten.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de kern is een geëxtrudeerde achthoek met acht losse ribben, het reservoir één omwentelingsprofiel, de lantaarn een zeshoek met per vlak een gevelwig; deur en glaspuien zijn nissen.

De watertoren aan de Noorderhogeweg in Drachten is in 1959 gebouwd naar ontwerp van rijksbouwmeester J.J.M. (Jo) Vegter, 42 m hoog met reservoirs van 500 en 1000 m³. Hij is nog in gebruik, in oorspronkelijke staat en gemeentelijk monument. Zustertoren van de watertoren van Dokkum (`watertoren-dokkum`).

## Bestanden

- `watertoren-drachten.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-drachten.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-drachten-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [201400.2, 570187.2], het hart van het reservoir in het AHN, op maaiveld (NAP +1,55 m). De BAG-contour van pand 0090100000606260 is grof (23 punten, straal 7,4 tot 8,6 m) en ligt 0,6 m daarvandaan. Assen in RD-richting (`xAxis` [1, 0]). De zeshoekige lantaarn heeft zijn hoeken op 45 + k·60 graden (AHN per sector); de stand van de achthoekige kern is niet bekend en staat met de vlakken op de RD-assen. De deur staat naar het zuidoosten, aan het plein op de luchtfoto. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-met-ribben-reservoir-en-lantaarn`

- Achthoekige betonnen kern (apothema 2,93) tot +22,2 met op elke hoek een rib van 0,9 m breed tot 4,5 m uit het hart (9,0 m over de ribben), tot in de onderkant van het reservoir. Deur (2,0 × 2,6 m) in het vlak naar het zuidoosten.
- Reservoir: kegelvormige onderkant van r 3,2 op +22,0 naar de onderrand op +24,0, cilinder met tegelbekleding van 15,2 m tot +34,5, ronde dakrand tot r 6,8 op +35,3 en licht bol dak tot +36,0 bij de lantaarn.
- Zeszijdige uitkijklantaarn van 5,0 m over de vlakken (zijden 2,9 m) tot de gevelvoet op +40,3, met een hoge glaspui (2,0 m breed) in elk vlak tussen de hoekpijlers. Op elk vlak een puntgevel tot +41,0; de kilgoten lopen van de hoeken naar de nok in het midden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Drachten)): architect, bouwjaar, 42 m, 500 + 1000 m³, monument.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP +1,55, hoogste punt NAP +43,54 (42,0 m boven maaiveld), reservoirbreedte (15,0 tot 15,5 m met randbloei), dakrand rond 35 m, lantaarn van circa 5 m met de hoeken per sector, top van de lantaarn tussen 41 en 42 m.
- BAG-pand 0090100000606260 en luchtfoto (PDOK): ligging, zeshoekige lantaarn met stervormig dak, plein en pad ten zuidoosten.
- Foto [Watertoren Drachten 12w](https://commons.wikimedia.org/wiki/File:Watertoren_Drachten_12w.JPG), frontaal met de deur: hoogtes van onderrand, tegelbekleding en dakrand op de raakpunten aan de zijkant, breedte van de schacht, de deur, geschaald op de dakrand in het AHN (15,0 px/m).
- Foto [De top van de watertoren](https://commons.wikimedia.org/wiki/File:De_top_van_de_watertoren._Drachten.JPG): zeszijdige glazen lantaarn met puntgevels, hoekpijlers en dakrand.

## Geschat en weggelaten

Geschat: de stand van de achthoekige kern (op de RD-assen) en de maten van kern en ribben (gelijk aan Dokkum, op de foto 9 m breed), de richting van de deur (naar het plein), de kegelhelling van de onderkant, de ronding van de dakrand en de bolling van het dak, de hoogte van gevelvoet (40,3 m) en gevels (0,7 m; de foto geeft een lage gevel, het AHN een iets hogere top, mogelijk door de antennes en de ladder), de breedte en diepte van de glaspuien.

Weggelaten (kleiner dan 0,9 m of te dun): antennes en bliksemafleiders, de ladder en het hekwerk rond de lantaarn, de dichte borstweringen tussen de twee glazen verdiepingen, het luifeltje boven de deur, de radiale balken onder het reservoir en de tegelstructuur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 5 %: alleen onder de kegelvormige onderkant, de echte vorm. De doorsneden op 1,5, 15, 30 en 38 m (deur, ribben, reservoir, lantaarn) blijven gelijk. In een preview-export op 1:1000 (100 × 100 m) zit de ondersteuning onder de kegel en als dunne schoren in de groeven tussen de ribben; lantaarn en gevels zijn vrij. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,1 tot 0,2 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/53.11647/6.08020/200/1x1/0
