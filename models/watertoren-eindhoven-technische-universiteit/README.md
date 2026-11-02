# Watertoren Technische Universiteit (Eindhoven)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-eindhoven-technische-universiteit.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, trompetvoet, reservoir en dak zijn één omwentelingsprofiel (96 zijden), de plint is de BAG-contour, loopbrug en paviljoen zijn prisma's met een schuine dakrand (`hull`).

De watertoren van de TU Eindhoven staat op de campus tegen de oostkant van het voormalige ketelhuis Ceres (Groene Loper 7). Volgens Wikipedia is hij in 1967 gebouwd naar een ontwerp van OD 205, 24,4 m hoog met een reservoir van 110 m³; de BAG geeft het bouwjaar van het hele ketelhuiscomplex (1957). De gemeente Eindhoven noemt ketelhuis, schoorsteen, loopbrug en watertoren samen als gemeentelijk monument (ketelhuis 1957-1959, uitbreiding 1967-1968, S.J. van Embden, die OD 205 leidde). Het is een paddenstoelvormige betonnen toren: een slanke gladde schacht die onderaan trompetvormig uitloopt, een cilindrisch reservoir met een vlak kegelvormige bodem en een licht oplopend dak met een luik. Een glazen loopbrug met een rode vloerrand loopt van Ceres naar een glazen paviljoen rond de schacht; aan de oostkant daarvan zit het trappenhuis met een buitentrap.

## Bestanden

- `watertoren-eindhoven-technische-universiteit.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir of een losse loopbrug zou een eigen voet tot de grondplaat krijgen.
- `watertoren-eindhoven-technische-universiteit.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-eindhoven-technische-universiteit-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [162098.79, 384233.07], het midden van de achtkantige BAG-contour van pand 0772100000300497 (3,6 m, de plint), op het maaiveld (AHN-DTM NAP +16,16 m; tot 8 m rond de voet tussen +16,08 en +16,22). `xAxis` [1, 0]: +X wijst naar RD-oost, langs de loopbrug; de oostgevel van Ceres (BAG-pand 0772100000299963) loopt precies noord-zuid op x = -16,39.

De vier `groundSamplePoints` liggen 4 tot 6 m uit het hart op de bestrating, buiten de loopbrug. `groundHeight` 60,08 (NAP 16,16 + 43,92, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:watertoren-loopbrug-en-trappenhuis`

- Plint op de BAG-contour tot 0,4 m.
- Trompetvoet van 2,6 m doorsnede op de plint, hol (kwadratisch) versmallend tot de schacht op 4,2 m, net onder de vloer van het paviljoen.
- Gladde ronde schacht van 1,45 m doorsnede tot de reservoirbodem.
- Reservoir van 6,24 m doorsnede: een kegelvormige bodem van 14 graden van de schacht op 19,3 m naar de onderrand op 19,9 m, een rechte wand tot de dakrand op 23,3 m, een dak dat onder 13 graden oploopt tot 23,85 m en een rond luik van 1,4 m tot 24,3 m met een punt tot 24,6 m.
- Loopbrug van 2,6 m breed (y -1,4 tot 1,2) van 0,2 m in de oostgevel van Ceres (x -16,6) naar het paviljoen, van 4,4 tot 7,54 m: een vloerrand tot 4,9 m, glas dat 0,3 m terugligt tot 6,95 m en een dakrand die onder 45 graden naar de gevel terugloopt. Alleen de lange gevels liggen terug; het westeinde zit in Ceres.
- Paviljoen rond de schacht: een convexe achthoek van 6,5 × 4,1 m (x -3,1 tot 3,4, y -2,9 tot 1,2, afgeschuinde zuidhoeken), noordgevel in het verlengde van de loopbrug, met dezelfde vloerrand, glaslijn en dakrand.
- Trappenhuis: het deel van het paviljoen ten oosten van x = 0,9 loopt op de glaslijn door tot 2,1 m boven het maaiveld.
- Buitentrap van 1,0 m breed die van west naar oost onder 42 graden naar de onderkant van het trappenhuis oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(TU_Eindhoven)): OD 205, 1967, 24,4 m, 110 m³, verbonden met Ceres.
- Gemeente Eindhoven, gemeentelijk monument Ceres (Ketelhuis): ketelhuis, schoorsteen, loopbrug en watertoren, 1957-1959 en 1967-1968.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +16,16, dakrand reservoir NAP +39,4 tot +39,5 (23,3 m), dak tot +40,1 in het midden, luik tot +40,8 (24,6 m); dak van de loopbrug NAP +23,7 (7,54 m), breedte 2,6 tot 2,8 m. Het paviljoen geeft geen DSM-punten (glas) en ligt verder onder het reservoir.
- 3D BAG (LoD2.2, AHN5) van pand 0772100000300497: plat dak op NAP +40,03 (min 39,79, max 40,31) over de plint van 11,8 m²; ter controle.
- BAG-panden 0772100000300497 (plint, achthoek van 3,6 m) en 0772100000299963 (oostgevel Ceres) en de luchtfoto (PDOK, 4 cm): reservoir 6,24 m, schacht 1,45 m, dak met naden en het luik in het midden, loopbrug en paviljoen (scheefstand ca. 0,3 m per m hoogte naar het noorden gecorrigeerd).
- Foto "Eindhoven Watertoren TU 2010" (Wikimedia Commons): schacht 0,24 keer het reservoir, onderrand als ellips onder 33 graden kijkhoek (wand circa 3,4 m), bodem 0,6 m dieper dan de onderrand, trompetvoet 1,75 keer de schacht, plint, vloerrand op circa 4,4 tot 4,9 m, glas tot circa 7 m, trappenhuis tot circa 2,1 m en de buitentrap.

## Geschat en weggelaten

Geschat: de hoogte van de reservoirwand (3,4 m) en de diepte van de bodem (0,6 m), uit één foto van onderaf (±0,3 m); de vorm en hoogte van de trompetvoet (±0,3 m); de hoogte van de plint; de vloer- en glashoogtes van loopbrug en paviljoen (±0,3 m, alleen het dak is gemeten); de vorm van het paviljoen en de grens van het trappenhuis (uit de luchtfoto met scheefstandcorrectie en de foto, ±0,4 m); de plaats en helling van de buitentrap; het glas 0,3 m achter de randen (in het echt vrijwel vlak, als nis zodat het glas leest). De dakrand van het reservoir is recht; in het echt is de onderrand licht afgerond.

Weggelaten (kleiner dan 0,9 m of los van de toren): de leuning rond het luik, de voegen in de schacht en het reservoir, de stijlen van de puien, de leuningen van de buitentrap, de regenpijp naast de schacht, de lantaarnpaal. Ceres zelf en de schoorsteen staan in PDOK en horen niet bij dit model.

## Controle

Eén gesloten NoError-node (genus 2: de buitentrap, het trappenhuis en de voet vormen een lus). In de webshoptest vult de 45-gradenopvulling, zoals de export die doet, het volume met 32 % aan: een wig onder de reservoirbodem van 14 graden en wiggen en wanden onder de vrij overspannende loopbrug en het paviljoen. Glas, dakranden, schacht, reservoir en luik blijven zoals ze zijn. Vergeleken met de PDOK-reconstructie (een achtkantige kolom van 3,6 m tot de dakhoogte) heeft het model de slanke schacht met trompetvoet, het brede reservoir met bodem en luik, de loopbrug, het paviljoen, het trappenhuis en de buitentrap; controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.44713/5.48932/200/1x1/0
