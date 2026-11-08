# Sint-Lambertuskerk (Lemiers)

Model van de H.H. Lambertus en Genovevakerk in Holset, met postadres Lemiers. Het kerkgebouw heeft middeleeuwse onderdelen; de toren is in 1736 herbouwd en de noordelijke Genovevakapel in 1916 toegevoegd.

## Bestanden en plaatsing

- `sint-lambertuskerk-lemiers.glb` en `.json`: kaartmodel en catalogusplaatsing; vervangt BAG-pand `0981100000015856`.
- `sint-lambertuskerk-lemiers-1-100.stl` en `sint-lambertuskerk-lemiers-1-1000.stl`: gesloten printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-sint-lambertuskerk-lemiers.mjs`.

Oorsprong RD `[197324.25, 309653.25]` bij de toren, X-as `[0.975, 0.222]` naar het koor. Richtmaaiveld NAP +195,8 m. De kerk ligt op een heuvel: `groundSamplePoints` nemen punten op het kerkhof rond het gebouw en het model is 0,8 m ingegraven.

## Vorm en aannames

De drie in hoogte aflopende delen van het schip, het koor en de aanbouw zijn afzonderlijke zadeldaken; de noordelijke kapel heeft een ronde sluiting. De vierkante toren heeft een onderaan uitgezwenkte vierkante naaldspits. De 3D BAG mist de spits. Het AHN4 meet tot NAP +220,95 m maar heeft lege pixels rond de top. Het onafhankelijke AHN5-DSM heeft daar samenhangende waarden zonder gat, met een topwaarde NAP +221,07 m; bij maaiveld NAP +195,41 m is dit circa 25,7 m. Een andere rasteruitlijning interpoleert de piek tot NAP +219,64 m, dus kleine verschillen door rasterresampling blijven mogelijk. De modelpunt is afgeknot op 25,7 m. Vensternissen, toegang, kapelvorm en dakovergangen zijn vereenvoudigd; het dunne kruis is weggelaten. De onderkant is vlak en de gesloten geometrie is getoetst voor 1:1000 met overhangopvulling.

## Controle en bronnen

Controlekaart: http://localhost:3000/kaart/50.77528/5.98734/200/1x1/0. Controleer de aansluiting op het kerkhof en de verhouding van de naaldspits.

- [3D BAG, pand 0981100000015856](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0981100000015856): footprint en dakvlakken.
- [AHN dataroom](https://www.ahn.nl/dataroom): AHN5-DSM en AHN4-DSM/DTM.
- [Meertens Instituut](https://bedevaart.meertens.knaw.nl/plaats/343): bouwgeschiedenis en Genovevakapel.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:HH._Lambertus_en_Genovevakerk): exterieurfoto's.
