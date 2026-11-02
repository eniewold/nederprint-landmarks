# Watertoren Isover (Etten-Leur)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-etten-leur-isover.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de band en de rand zijn cilinders (72 zijden), de kuip en het dak zijn kegelstompen (`hull`), de kap is een lage trommel met een flauwe kegel, de vensters zijn nissen.

De watertoren van de glaswolfabriek Isover (Saint-Gobain) staat op het fabrieksterrein aan de Parallelweg, ten westen van het dorp Etten-Leur, tussen de leidingbruggen ten noorden van de productiehallen. Volgens de Wikipedia-lijst van watertorens in Noord-Brabant is hij in 1962 gebouwd; hoogte en reservoir staan er niet bij en er is geen eigen artikel. Het is een witte betonnen fabriekswatertoren: een ronde, rechte schacht met twee kolommen smalle trapvensters, een smalle band onder de kuip, een kuip in de vorm van een omgekeerde afgeknotte kegel met een rechte rand (met het Isover-logo), een flauw kegeldak en een donkere, verhoogde ronde kap in het midden. Hij staat nog: de actuele luchtfoto en het AHN tonen hem.

## Bestanden

- `watertoren-etten-leur-isover.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-etten-leur-isover.json`: catalogusitem met RD-oorsprong, `xAxis` en `groundHeight`. Geen `replacesBuildings`: de toren is geen BAG-pand en staat dus niet in de PDOK-gebouwen.
- `watertoren-etten-leur-isover-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [100699.38, 397811.86] (WGS84 51.56723, 4.60632), het middelpunt van de cirkel door de BGT-contour van het overig bouwwerk G0777.209723b0a9cb43d28cd78c2dd7df4fe5 (type opslagtank, 34 hoekpunten, straal 3,00 m); het middelpunt van het AHN-DSM boven 20 m ligt er 0,07 m vandaan. Op het maaiveld NAP +4,42 m (AHN-DTM in een ring van 9 tot 14 m: 4,37 tot 4,66, verhard terrein). `xAxis` [1, 0]: +X wijst naar RD-oost, want een ronde toren heeft geen hoofdas. `groundHeight` 48,52 (NAP 4,42 + 44,10, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:schacht-kuip-en-kap`

- Ronde schacht van 7,3 m doorsnede, recht tot de band.
- Band van 7,6 m doorsnede van 28,0 tot 29,6 m, op een kraag van 53 graden.
- Kuip: een korte kraag naar 7,9 m op 29,75 m, dan een kegelwand van 27 graden uit het lood tot 13,1 m op 34,7 m.
- Rechte rand van 13,7 m doorsnede (kraag van 50 graden) tot 37,0 m, afgeschuind naar de dakrand op 37,45 m.
- Kegeldak van 23 graden van de dakrand tot de kap.
- Kap van 6,7 m doorsnede: een trommel tot 39,35 m en een flauwe kegel (10 graden) tot 39,95 m.
- Trapvensters als nissen van 0,6 × 1,4 m, in twee kolommen van vier met 6 m steek die 3 m verspringen (een wenteltrap): op 6,6, 12,7, 18,7 en 24,6 m en op 3,4, 9,4, 15,5 en 21,4 m.

## Bronnen en maten

- [Wikipedia, Lijst van watertorens in Noord-Brabant](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Noord-Brabant): bouwjaar 1962, fabriekswatertoren van Isover; geen hoogte, reservoir of coördinaten.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +4,42, dakrand NAP +41,9 (37,45 m), dak 23 graden tot NAP +43,3 bij de kap, rand van de kap NAP +43,8, midden NAP +44,37 (39,95 m); de omtrek boven 20 m heeft een straal van 6,6 tot 6,9 m.
- Luchtfoto (PDOK, 8 cm): kuiprand 13,76 m, kap 6,7 m met een luik, de schacht schuin in beeld met een breedte van circa 7,6 m.
- BGT overig bouwwerk (opslagtank) G0777.209723b0a9cb43d28cd78c2dd7df4fe5: de positie. De cirkel is 6,0 m, smaller dan de schacht op de luchtfoto en de foto; het model volgt de foto.
- Foto [Etten Leur Watertoren 1228](https://commons.wikimedia.org/wiki/File:Etten_Leur_Watertoren_1228.JPG) (Willemjans, 2006, CC BY-SA 3.0): de hele toren boven de fabriekshallen; verhouding kuiprand/schacht 2,0 (diepte meegerekend 1,9), schaal 34,3 px/m op de rand en 32,7 px/m op de schacht; hoogtes van de band, de kuip, de rand en de vensters.
- 3D BAG: geen pand op deze plek, alleen de buurpanden 0777100000127759 en 0777100000144720.
- NLGEO2018-geoïdehoogte op de oorsprong (44,10 m) voor `groundHeight`.

## Geschat en weggelaten

Geschat: de doorsnede van de schacht (7,3 m, uit de verhouding op de foto en de luchtfoto, ±0,3 m; de BGT geeft 6,0 m); de hoogtes van de band, de kuipwand en de rand (±0,3 m, uit één foto geschaald op de AHN-hoogte van de dakrand); de vorm van de afgeronde rand als afschuining; de stand van de twee vensterkolommen (de foto heeft geen bekende kijkrichting; noordnoordwest en oost aangenomen); de vensters zijn vergroot van circa 0,4 tot 0,6 m breed zodat ze op 1:1000 zichtbaar blijven.

Weggelaten (kleiner dan 0,9 m of geen deel van de toren): de rij kleine ventilatiegaten onder de kuip (circa 0,3 m), het luik op de kap, het Isover-logo op de rand, de deur (op geen foto te zien; de voet gaat schuil achter lage gebouwen en leidingbruggen), en de leidingbruggen en koelers rond de voet.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, vrijwel niets op (volume minder dan 1,0005): de kragen onder de band en de kuip lopen onder 53 graden, de kuipwand onder 63 graden, de kraag onder de rand onder 50 graden en de plafonds van de vensters onder 56 graden; de kap staat op het dak. PDOK heeft op deze plek geen gebouw (geen BAG-pand), dus het model voegt de hele toren toe; controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.56723/4.60632/200/1x1/0
