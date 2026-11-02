# Watertoren Hooge Zwaluwe (Hooge Zwaluwe)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hooge-zwaluwe.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een kegelstomp (72 zijden), de dakrand een kraag met een rechte band, het dak een rechte kegel (`hull`), de dakkapellen zijn prisma's met een rondboogprofiel, de vensters en de deur zijn nissen.

De watertoren staat aan de Brandestraat (9) in Hooge Zwaluwe, net buiten Made, bij de rotonde met de Zuideindsestraat. Hij is in 1948 gebouwd naar een ontwerp van B. Oomen, is volgens Wikipedia 43,9 m hoog met een reservoir van 600 m³ en is een gemeentelijk monument van Drimmelen. Hij verving de watertoren van Hendrik Sangster uit 1925, die op 29 oktober 1944 werd opgeblazen. Het is een ronde bakstenen toren die naar boven toe licht versmalt, zonder zichtbaar reservoir: het reservoir zit binnen de schacht. Bovenaan zit een ring van twaalf kleine rondboogvensters met lichte bogen, daaronder kleine vierkante trapvensters in verticale rijen, en aan de straatkant een hoge rondboognis met de deur. Een koperen dakrand kraagt uit boven de schacht. Daarop staat een koperen kegeldak met acht kleine dakkapellen met een rondboogdak en een makelaar met bol en windvaan.

## Bestanden

- `watertoren-hooge-zwaluwe.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-hooge-zwaluwe.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 1719100000009568).
- `watertoren-hooge-zwaluwe-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [112632.6, 409602.8] (WGS84 51.67423, 4.77699), het zwaartepunt van de BAG-contour van pand 1719100000009568 (bouwjaar 1948): een cirkel met straal 6,52 m. Dat is de dakrand van bovenaf gezien. Op het maaiveld NAP +1,90 m (AHN-DTM in een ring van 8 tot 14 m: 1,66 tot 1,97; 3D BAG 1,58). `xAxis` [1, 0]: +X wijst naar RD-oost, want een ronde toren heeft geen hoofdas. De deur staat op -75 graden (zuidzuidoost), naar de inrit uit de BGT en de Brandestraat. `groundHeight` 45,73 (NAP 1,90 + 43,83, NLGEO2018-geoïde op de oorsprong) is de terugval als er geen maaiveld is.

De coördinaten op Wikipedia (51.67368, 4.77474) liggen 165 m westzuidwest van de toren; het model staat op de BAG-plek.

## Onderdeel `building:schacht-dakrand-en-kegeldak`

- Ronde schacht, licht taps: 12,6 m doorsnede op het maaiveld en 11,8 m op 37,5 m.
- Kraag van 45 graden naar de koperen dakrand van 13,0 m doorsnede, recht van 38,1 tot 38,8 m.
- Kegeldak van 36 graden (helling 0,732) van de dakrand tot 43,56 m.
- Acht dakkapellen op 15 + 45k graden, met één boven de deur: 1,2 m breed, de voorkant op 5,3 m uit het hart, zijwanden van 39,2 tot 40,4 m en een halfrond dak tot 41,0 m.
- Makelaar van 0,9 m met een bol tot 44,3 m.
- Twaalf rondboogvensters als nissen van 0,9 m breed, van 29,8 m tot de top op 31,45 m, om de 30 graden en één boven de deur.
- Trapvensters als nissen van 0,9 × 0,9 m op 7,0, 13,5, 19,8 en 25,5 m, in twee rijen: boven de deur en 60 graden verder naar het oosten.
- Hoge rondboognis van 2,3 m breed tot 5,8 m, met daarin de deur van 1,4 × 3,0 m, 0,3 m dieper.

## Bronnen en maten

- [Wikipedia, Watertoren (Hooge Zwaluwe)](https://nl.wikipedia.org/wiki/Watertoren_(Hooge_Zwaluwe)): B. Oomen, 1948, 43,9 m, 600 m³, gemeentelijk monument, de voorganger van Sangster.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): het dak is een rechte kegel. De mediaan per ring loopt van NAP +44,91 op r 0,75 m tot +41,23 op r 5,75 m, een helling van 0,733. De kegel komt uit op NAP +45,46 (43,56 m) en het maximum is NAP +46,23 (makelaar en windvaan, 44,3 m). De rand boven NAP +32 ligt op 6,0 tot 6,5 m uit het hart.
- BAG-pand 1719100000009568: een cirkel met straal 6,52 m, de dakrand.
- Luchtfoto (PDOK, 8 cm): acht dakkapellen op 15 + 45k graden (gemeten 7, 52, 103, 156, -156, -114, -74 en -34 graden) met het hart op 4,65 m uit het midden. De rand is 13,2 tot 13,5 m, door de perspectief iets vergroot. De toren hangt in de ortho ongeveer 13 m naar het zuiden over.
- BGT: pand met `bag_pnd` 1719100000009568 en een inrit (open verharding) aan de zuidzuidoostkant, voor de stand van de deur.
- Foto [Drimmelen-Made, watertoren IMG 0804](https://commons.wikimedia.org/wiki/File:Drimmelen-Made,_watertoren_IMG_0804_2022-03-28_15.29.jpg) (2022): vrijwel recht van voren. Daarop de versmalling van de schacht, de dakrand/schacht-verhouding 1,10, de rondboogvensters, een rij trapvensters en de dakkapellen. De hoogtes van de vensters zijn geschaald tussen het maaiveld en de onderkant van de dakrand.
- Foto [Made Watertoren 5924](https://commons.wikimedia.org/wiki/File:Made_Watertoren_5924.JPG) (2007): de deur met de hoge rondboognis en de vier trapvensters erboven, de koperen dakrand.
- RCE-foto's [20335208](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Made_-_20335208_-_RCE.jpg) en [20335209](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_graafwerkzaamheden_op_de_voorgrond_-_Made_-_20335209_-_RCE.jpg): twaalf rondboogvensters (om de 30 graden), twee rijen trapvensters, de verhouding van dakrand en schacht (1,10), de versmalling (circa 0,02 m per m per zijde), de dakkapellen en de makelaar met windvaan.
- 3D BAG (LoD2.2) van pand 1719100000009568: maaiveld 1,58, dak tot NAP +44,92, ter controle.
- NLGEO2018-geoïdehoogte op de oorsprong (43,83 m) voor `groundHeight`.

## Geschat en weggelaten

Geschat:

- De doorsnede van de schacht (12,6 m onder en 11,8 m boven, ±0,3 m). Die komt uit de verhoudingen op de foto's; de BAG geeft alleen de dakrand.
- De hoogte en dikte van de koperen rand (±0,2 m), de hoogtes van de vensters en de nis (±0,5 m, uit foto's die van onderen genomen zijn) en de vorm en grootte van de dakkapellen (±0,2 m).
- De stand van de tweede rij trapvensters. Die staat op de RCE-foto rechts, maar de kijkrichting is niet precies bekend.

De vensters zijn vergroot van circa 0,6 tot 0,9 m breed, zodat ze op 1:1000 zichtbaar blijven.

Weggelaten, omdat ze kleiner zijn dan 0,9 m of geen deel van het monument:

- de windvaan en de kleine bolletjes op de dakrand;
- de vensters in de dakkapellen;
- de antennes en kasten van de telecomopstelling op de schacht;
- de gemetselde hekpijlers en de beukenhaag rond de voet.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export dat doet, niets merkbaar op (volume 1,0000001). De kraag onder de dakrand loopt onder 45 graden, de dakkapellen staan met een verticale voorkant op het dak, en de plafonds van de nissen lopen onder 56 graden. PDOK toont de toren als een gladde cilinder tot de dakrand met een kegeldak. Het model voegt de versmalling, de uitkragende dakrand, de dakkapellen, de makelaar, de vensters en de deurnis toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.67423/4.77699/200/1x1/0
