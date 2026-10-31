# Watertoren Akkrum-Nes

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-akkrum-nes.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voetplaat, kraag en reservoir zijn één omwentelingsprofiel, de schacht een geëxtrudeerde twintighoek en de lantaarn twee achthoeken; deur en ramen zijn nissen.

De watertoren van Nes bij Akkrum is in 1957 gebouwd naar ontwerp van A.P. Wesselman van Helmond, 41 m hoog met een reservoir van 515 m³, gelijk aan de toren van Sint Jacobiparochie. Sinds 2016 is het reservoir een hotel met twee kamers.

## Bestanden

- `watertoren-akkrum-nes.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-akkrum-nes.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-akkrum-nes-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [186264.59, 563191.05], het middelpunt van de ronde BAG-contour van pand 0055100000257787, op maaiveld (NAP -0,15 m). Assen in RD-richting (`xAxis` [1, 0]). De BAG-contour (10,33 m) is het bovenaanzicht van het reservoir, niet de voet. De deur boven de trap staat naar het zuidzuidoosten (lokaal -60 graden), zoals de trap op de luchtfoto. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:voetplaat-schacht-reservoir-en-lantaarn`

- Betonnen voetplaat van 7,7 m met afgeschuinde rand tot +1,0, voetring van 5,0 m tot +1,9; de deur (1,0 × 2,1 m) zit erboven in de schacht.
- Schacht met cannelures als twintighoek van 4,76 m over de lisenen tot de kraag op +29,6.
- Reservoir met vlakke onderkant van 8,2 m op +30,3, ronde onderrand tot +31,4, cilinder van 10,33 m (BAG) tot +38,2, dakrand van 10,44 m tot +38,45. Twaalf hoge hotelramen (0,9 × 3,1 m) rondom, van +33,6 tot +36,7.
- Kleine achthoekige lantaarn van 2,2 m tot +39,6 met een kap tot +39,8.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Akkrum)): bouwjaar, architect, 41 m, 515 m³, hotel.
- BAG-pand 0055100000257787 (PDOK, opgehaald 2026-10-31): ronde contour van 10,33 m, het reservoir.
- RCE-foto [20419892](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Akkrum_-_20419892_-_RCE.jpg), frontaal: alle hoogtes en stralen, geschaald op de reservoirbreedte (41,3 px/m).
- Foto [20181005 Watertoren1 van Nes](https://commons.wikimedia.org/wiki/File:20181005_Watertoren1_van_Nes.jpg) (na de verbouwing tot hotel): de twaalf ramen en de dakopbouw.
- RCE-foto [20419893](https://commons.wikimedia.org/wiki/File:Detail_watertoren,_ingangspartij_-_Akkrum_-_20419893_-_RCE.jpg): ingangspartij met trap.
- AHN DSM/DTM 0,5 m en luchtfoto (PDOK): maaiveld NAP -0,15, hoogste punt NAP +41,75 (antenne), richting van de trap.

## Geschat en weggelaten

Geschat: alle hoogtes en de schacht- en voetplaatmaten (uit één frontale foto, geschaald op de BAG-breedte; de reservoirtop komt zo op 38,4 m, de 41 m van Wikipedia is inclusief lantaarn en antenne), de breedte en hoogte van de hotelramen, de lantaarn, de plaats van de deur (uit de trap op de luchtfoto) en de diepte van de nissen (0,25 m).

Weggelaten (kleiner dan 0,9 m of te dun): de cannelures zelf (alleen de vlakke lisenen als twintighoek), antenne en bliksemafleider, de trap en het bordes voor de deur, de kleine vensters in de schacht, het hekwerk op het dak en raamroeden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 4,5 %: alleen de kegel onder de vlakke reservoirbodem, de echte vorm. De doorsneden op 3, 15, 27 en 35 m (deur, schacht, ramen) blijven gelijk. In een preview-export op 1:1000 (100 × 100 m) zit de ondersteuning alleen onder de reservoirbodem en als dunne randjes in de nissen. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0 tot 0,4 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/53.05473/5.85343/200/1x1/0
