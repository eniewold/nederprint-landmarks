# Sint-Petruskerk (Gulpen)

Vereenvoudigde neoromaanse kruisbasiliek, gebouwd in 1924 naar ontwerp van Caspar Franssen. Het model toont de vierkante westtoren met ruitdak, driebeukig schip, dwarsbeuk, ronde hoofdapsis en kleinere nevenapsissen.

## Bestanden en plaatsing

- `sint-petruskerk-gulpen.glb` en `.json`: kaartmodel en catalogusplaatsing; vervangt BAG-pand `1729100001035357`.
- `sint-petruskerk-gulpen-1-100.stl` en `sint-petruskerk-gulpen-1-1000.stl`: gesloten printbestanden in millimeters, Z omhoog.
- Generator: `scripts/generate-sint-petruskerk-gulpen.mjs`.

De oorsprong is RD `[190355.25, 314001.25]` bij de westtoren. De X-as `[0.936, -0.352]` loopt naar het koor. Richtmaaiveld NAP +95 m, onderkant 0,6 m ingegraven om op het terrein aan te sluiten.

## Modellering en aannames

De kerk is opgebouwd uit dakvlakken en afzonderlijke bouwdelen. Het AHN toont bij de toren hoogten tot NAP +143,5 m, ongeveer 48,5 m boven het richtmaaiveld. Het model heeft een afgeknotte, printbare top op 47,8 m; het dunne kruis is weggelaten. De 3D BAG-reconstructie mist de torenspits en is daarom voor de toren niet als hoogtereferentie gebruikt. Het schip, de dwarsbeuk en de aanbouwen zijn op dakvlakken uit de 3D BAG gebaseerd. De vensternissen, wijzerplaten, zijapsissen, kleine aanbouwen en sierdetails zijn aan de hand van foto's vereenvoudigd of geschat. Het model is één gesloten manifold en is op 1:1000 getoetst met de overhangopvulling.

## Controle en bronnen

Controlekaart: http://localhost:3000/kaart/50.81471/5.88918/200/1x1/0. Bekijk vooral de ruitdakvorm en de aansluiting op het hellende maaiveld.

- [3D BAG, pand 1729100001035357](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1729100001035357), voetafdruk en kerkdaken.
- [AHN via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM en DTM.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/491684), bouwjaar en gebouwbeschrijving.
- [Monumenten.nl](https://www.monumenten.nl/monument/491684), beschrijving drie apsissen en toren.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petruskerk_(Gulpen)), foto's van kerk en toren.
