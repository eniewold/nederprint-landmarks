# Protestantse kerk (Blankenham)

Een printbaar model van de Hervormde (PKN-)kerk aan de Kerkbuurt in Blankenham: een eenbeukige zaalkerk van vijf traveeën met een driezijdige koorsluiting, in 1892 gebouwd in eclectisch-neorenaissancistische trant naar ontwerp van W. Duiks de Jong, op de fundamenten van een voorganger die dat jaar door blikseminslag afbrandde. De westgevel heeft hoeklisenen en een middenrisaliet die overgaat in een vierkant, deels houten torentje met een achtzijdige leien spits. Rijksmonument 387546. (De BAG noemt 1910 als bouwjaar; het register en de gevelsteen noemen 1892.)

## Bestanden

- `protestantse-kerk-blankenham.glb`: gesloten model in meters, Y omhoog, één node `building:kerk`.
- `protestantse-kerk-blankenham.json`: catalogusitem; vervangt BAG-pand 1708100000027665.
- `protestantse-kerk-blankenham-1-100.stl` en `protestantse-kerk-blankenham-1-1000.stl`: printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-protestantse-kerk-blankenham.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (189456.97, 531036.05) midden in de zaal, op maaiveld (NAP +0,85 m). De lokale X-as (0,98618; 0,16568) loopt langs de nok naar het oosten (9,5 graden, gelijk aan beide lange muren in de BAG); Y wijst naar het noorden. De onderkant ligt vlak op −0,5 m. De kerk ligt op een kleine verhoging aan een kolk, en de laagste grond in de bbox ligt buiten de kerk (NAP +0,41 m); daarom staan er `groundSamplePoints` op 1 m buiten de muren (AHN-DTM NAP +0,64 tot +1,05 m) en is `groundOffsetMetres` 0.

## Onderdelen

- Zaal en koorsluiting: muren tot de muurplaat op NAP +8,55 m, zadeldak van 46 graden tot de nok op NAP +13,95 m, als schild met drie vlakken over de koorsluiting (dakvlakken als planvergelijkingen met dezelfde helling per muur). Overstek van 0,35 m met een kraag van 45 graden eronder.
- Westgevel als topgevel met een verhoogde gevelrand, hoeklisenen tot 1 m boven de muurplaat met piramidevormige bekroning; lisenen op de hoeken van de koorsluiting; plint met schuine kraag.
- Toren: middenrisaliet (3,2 m breed, 0,25 m voor de gevel) tot NAP +13,6 m met een kraaglijst, houten klokkenverdieping van 2,9 m met twee galmgaten per zijde, kroonlijst op een schuine kraag tot NAP +17,45 m, achtzijdige naaldspits tot NAP +24,5 m.
- Zuidportaal (gepleisterde omlijsting, 2,2 m breed) in de westelijke travee, met deurnis, oculus en een zadeltje van 45 graden.
- Blinde nissen (0,25–0,35 m) voor de rondboogvensters van de vier (zuid) en vijf (noord) traveeën, het grote venster in de zuidoostzijde, de blinde boog in de oostwand, deur en oculus in de noordoostzijde, en op de westgevel twee hoge vensters met rozetten, het gekoppelde venster en de oculus in het risaliet en gekoppelde vensters in de toren.

## Geschat en weggelaten

Gemeten: voetafdruk uit de BAG (symmetrisch gemaakt op 10,33 m breed), muurplaat, nok en dakhelling uit 3D BAG en AHN-DSM, torenpositie en spitshoogte uit het AHN-DSM (24,1 m op het 0,5 m-raster, de punt iets hoger geschat). Geschat uit foto's (RCE 20277084 t/m 20277087 en Commons 2011): de hoogtes van risaliet, klokkenverdieping en kroonlijst, de spitsbreedte, het portaal en alle venster- en nismaten. Weggelaten (kleiner dan 0,9 m of plat): de opgekrulde hoeken van de kroonlijst, de sierelementen aan de voet van de toren, gootklosjes en speklagen, gietijzeren tracering, de smeedijzeren bekroning op het oostschild, torenhaan en kruis. Het houten schuurtje tegen de oostzijde is een eigen BAG-pand en blijft PDOK.

## Controle

De generator levert één gesloten component met genus 0. De catalogus- en printtest (`Protestantse kerk Blankenham catalogue and print test` in de webshop) slaagt: plaatsing via de catalogus, één solid en minder dan 3 % extra volume bij 45 graden printbare overhang. Een tijdelijke plaatsingstest met het AHN-DTM als maaiveld zette de voet op NAP +0,14 m (maaiveld van het model op +0,64 m). Renders van vier kanten zijn naast de 3D BAG-reconstructie en de RCE- en Commons-foto's gelegd. Op de kaart nakijken: de hoogte van de voet tegenover het maaiveld op de verhoging en de hoogte van de spits.

## Bronnen

- [BAG / 3D BAG pand 1708100000027665](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000027665)
- [Rijksmonumentenregister 387546](https://monumentenregister.cultureelerfgoed.nl/monumenten/387546)
- [Wikimedia Commons, RCE-foto westgevel en zuidgevel](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT,_WESTGEVEL,_ZUIDGEVEL_-_Blankenham_-_20277084_-_RCE.jpg)
- [OpenStreetMap way 267317784](https://www.openstreetmap.org/way/267317784)
- [AHN hoogtegegevens](https://www.ahn.nl/dataroom) (DSM als controle van nok en spits, DTM voor het maaiveld)
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0)
