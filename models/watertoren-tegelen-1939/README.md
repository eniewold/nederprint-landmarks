# Watertoren Tegelen-Egypte (Venlo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-tegelen-1939.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: onderbouw, schacht, kroonlijst en kop zijn achthoekige prisma's (de schacht met afgeschuinde hoeken), de lijst en de kroonlijst staan op schuine kragen (`hull`), de deur en de trapvensters zijn nissen.

De watertoren in de buurtschap Egypte bij Tegelen (gemeente Venlo) is in 1938-1939 gebouwd naar ontwerp van architect E. Noorman uit Amersfoort, volgens Wikipedia 32,1 m hoog met een reservoir van 500 m³. Hij is sinds 2003 rijksmonument (524690) en sinds 2005 buiten gebruik. Hij staat in het bos bij de bron van de Wijlderbeek, naast het voormalige pompstation.

## Bestanden

- `watertoren-tegelen-1939.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse kroonlijst of kop zou een eigen voet tot de grondplaat krijgen.
- `watertoren-tegelen-1939.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-tegelen-1939-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [208560.1, 372591.5], het middelpunt van de achtkantige BAG-contour van pand 0983100000019604 (zijden van 4,8 m, 11,6 m over de vlakken), op maaiveld (NAP +32,88 m; het AHN-maaiveld rond de voet ligt vlak tussen +32,8 en +32,95). De BAG-contour is de onderbouw; de kop ligt in het AHN 0,2 m westelijker, binnen een pixel. `xAxis` [0.9455, -0.3256]: +X wijst naar het vlak op -19 graden van RD-oost (richting van de BAG-zijden en de dakrand op de luchtfoto); de vlakken staan op 0, 45, ... graden in het modelstelsel, de afschuiningen op 22,5 + k·45. De ingang staat op -45 graden (zuidzuidoost), waar op de luchtfoto de stoep ligt.

De vier `groundSamplePoints` liggen 7,5 m uit het hart (1,5 m buiten de onderbouw, naast de stoep). `groundHeight` 77,61 (NAP 32,88 + 44,73, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld. Er staan geen andere panden binnen 35 m.

## Onderdeel `building:onderbouw-schacht-kroonlijst-en-kop`

- Onderbouw van 11,6 m over de vlakken tot +3,15, met een lijstplaat van 12,0 m tot +3,4 op een schuine kraag (56 graden).
- Ingang naar het zuidzuidoosten: deur van 2,7 × 2,45 m (vanaf +0,3) als nis tussen twee penanten van 0,45 m breed die 0,2 m uit de onderbouw steken, en een stoep van twee treden (4,0 × 1,3 m en 3,6 × 0,7 m, bovenkant +0,15 en +0,3).
- Schacht van 10,9 m over de vlakken met afgeschuinde hoeken van 0,82 m; in elke afschuining vijf smalle trapvensters (0,5 m breed, 2,0 tot 2,6 m hoog, 0,3 m diep) op +3,8, +7,2, +12,3, +17,0 en +22,2 m.
- Kroonlijst van 12,9 m over de vlakken: een schuine kraag van de schacht (+25,15) naar de rand (+26,75), onder 58 graden midden op een vlak en 52 graden boven de afschuiningen, en een rechte rand van 0,6 m tot +27,35.
- Reservoirkop van 10,9 m over de vlakken (scherpe hoeken) tot het platte dak op +31,1, met een dakrand van 0,5 m breed tot +31,3.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Tegelen_Egypte)): architect, bouwjaren, 32,1 m, 500 m³, monument, buiten gebruik sinds 2005.
- [Rijksmonument 524690](https://monumentenregister.cultureelerfgoed.nl/monumenten/524690).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +32,88, plat dak op NAP +64,02 (31,14 m boven maaiveld), dakrand tot NAP +64,17 (31,29 m), rand van het dak op 5,4 m uit het hart (kop 10,9 m), kroonlijst tot circa 6,5 m uit het hart. De wanden geven in het DSM een schuine rok van interpolatie; de onderbouw en de kroonlijst zijn daarin niet te scheiden. De gepubliceerde 32,1 m is 1 m meer dan het AHN; het model volgt het AHN.
- BAG-pand 0983100000019604 en luchtfoto (PDOK, 8 cm): achtkant van 11,6 m over de vlakken, stand van de vlakken (-19 graden), één afschuining van 0,8 m in de contour, trapvensters op de hoeken, stoep voor het zuidzuidoostvlak.
- Foto [Watertoren](https://commons.wikimedia.org/wiki/File:Watertoren.jpg), van voren en van onderen: onderbouw met lijst, deur tussen twee penanten met de stoep, de trapvensters in smalle afschuiningen naast het vlak met de ingang.
- Foto [Watertoren Tegelen](https://commons.wikimedia.org/wiki/File:Watertoren_Tegelen.jpg), van ver: kop even breed als de schacht, kroonlijst 1,18 keer zo breed, kop circa 3,8 m hoog boven de kroonlijst, rechte rand van de kroonlijst circa 0,6 m.
- Foto [1951 Het voetbalveld van Sportclub Irene bij de Watertoren](https://commons.wikimedia.org/wiki/File:1951_Het_voetbalveld_van_Sportclub_Irene_bij_de_Watertoren.jpg), van ver: de hele toren, afschuiningen als donkere lijnen, vensterrijen om de circa 5 m (geschaald op de schachtbreedte, 13,6 px/m).
- Foto [1952 Het Pompstation met de Watertoren, Tegelen](https://commons.wikimedia.org/wiki/File:1952_Het_Pompstation_met_de_Watertoren,_Tegelen.jpg): hoogte van de kop ten opzichte van de breedte.

## Geschat en weggelaten

Geschat: de hoogte van de onderbouw (3,4 m, uit de deur op de foto van onderen) en hoeveel hij uitsteekt (0,35 m; de foto overdrijft het door het perspectief, het AHN laat hooguit 0,4 m zien); de hoogte van de kop (3,8 m) en de kroonlijst uit verhoudingen op twee foto's (±0,3 m); de breedte van de afschuiningen (0,82 m, uit de BAG-contour) en dat alle acht hoeken van de schacht afgeschuind zijn met vensters (op foto's en de luchtfoto zijn er vier te zien); de hoogtes van de vensterrijen (±0,5 m, op elke afschuining gelijk aangenomen); de schuine kragen onder de lijst en de kroonlijst, die in het echt een vlakke onderkant hebben en zo zonder steun printbaar blijven.

Weggelaten (kleiner dan 0,9 m): de kleine vensters in de kop (0,55 m hoog) en in de onderbouw, de regenpijpen langs de kop, het dakluik, de antennes en het kozijn en hekwerk van de deur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, niets op (volume 1,0000): de kragen onder de lijst en de kroonlijst lopen onder 52 tot 58 graden en de plafonds van de deur en de vensters onder 56 graden. De doorsneden van de voet tot de dakrand blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,15–0,20 m in het bosmaaiveld.

Controle-URL: http://localhost:3000/kaart/51.34000/6.15583/200/1x1/0
