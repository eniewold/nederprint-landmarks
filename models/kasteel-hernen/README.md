# Kasteel Hernen (Hernen)

Vereenvoudigd model van de huidige toestand: vier overdekte vleugels rond een open hof, de ronde zuidwesttoren, twee arkeltorens en de lage resten van de verdwenen zuidoostelijke donjon. Geen reconstructie van de verdwenen donjon.

## Bestanden en hergenereren

- `kasteel-hernen.glb`: meters, Y omhoog, node `building:kasteel en donjonrest`, scherpe vertexnormalen.
- `kasteel-hernen.json`: catalogus, BAG-vervanging en expliciete hofbemonstering.
- `kasteel-hernen-1-1000.stl`: millimeters, Z omhoog; één verbonden volume, geen grondplaat nodig.
- Generator: `node scripts/generate-kasteel-hernen.mjs --components` vanuit nederprint-landmarks; `--out` wijst naar een catalogusmap.

## Maten en plaatsing

RD-oorsprong `[174926, 427378]`, +X op −10,9° in RD, +Y 90° linksom. De westmuur volgt de hoofdas; de oostvleugel heeft een afzonderlijke scheve nokas. BAG-pand `0296100000025272` wordt vervangen. De hofcontour is open en volgt de binnenring van BAG.

Het AHN geeft in het hof NAP +8,41 m. `groundSamplePoints` `[0,0]`, `[0,5]`, `[0,-5]` houden de plaatsing op dat hofniveau; de omliggende gracht is geen hoogteanker. PDOK-terrein op die punten: 52,110 / 52,063 / 52,137 m ellipsoïdisch; terugval 52,06 m. De muren lopen 3 m onder de referentie door tot NAP +5,41 m, zodat de voet ook aan de lagere gracht aansluit. Geen dubbel terrein of gemodelleerde hofvloer.

| Bouwdeel | Gebruikte NAP-hoogte | Herkomst |
| --- | --- | --- |
| Westelijke weergang, nok | 19,65 m | AHN 0,5 m |
| Noordvleugel, nok | 23,45 m | AHN 0,5 m |
| Oostvleugel, nok | 26,05 m | AHN 0,5 m |
| Zuidvleugel, nok | 20,65 m | AHN 0,5 m |
| Ronde zuidwesttoren, spits | 26,55 m | AHN maximaal 26,37 m; punt uit foto geschat |
| Noordwest- / noordoostarkel, spits | 23,70 / 23,65 m | AHN maximaal 23,52 / 23,49 m; punt uit foto geschat |
| Hoogste schoorsteen | 29,00 m | AHN en foto, vereenvoudigd |
| Restmuur donjon | 10,45 m | Lage vorm luchtfoto / AHN; randhoogte geschat |

## Onderdelen, schattingen en printbaarheid

Elk vleugeldak bestaat uit twee echte schuine vlakken boven een eigen planveelhoek. De trapgevels zijn vlakke verticale gevelprofielen, geen gestapelde hoogtelagen. De ronde toren en arkels bestaan uit ronde schachten en convexe geledingen. Arkels en erker hebben afgeschuinde onderkanten boven 45°. De hoftraptoren, schoorstenen, kapellen, erker, vensternissen en entreepoort zijn afzonderlijke bouwdelen vóór de eind-union.

Foto's bepalen de verdeling van vensters, kapellen en schoorstenen, de trapgevelgeleding, de console en de lage donjonrand; hun fijne maten zijn geschat. Vensters zijn 0,35 m diepe blinde puntnissen. De entree heeft een vereenvoudigde spits van 55° zodat de doorgang zonder steun kan worden geprint. De donjonrand is 0,95 m dik. Kapellen blijven binnen de gevelcontour. Fijn metselwerk, roeden, schietgaten kleiner dan 0,9 m, kruisbloemen en metalen windvanen zijn weggelaten. Er is aan de entree een landverbinding; geen brugdek toegevoegd.

## Controles

- Generator: `NoError`, één verbonden stuk, genus 1 (hof / doorgang), geen interne losse holtes; Float32-rondgang gesloten en volumeverandering binnen 0,2%.
- Alle neerwaartse vlakken buiten de onderkant voldoen aan 45°, zonder uitzonderingen. Gezamenlijke printsteuncontrole: `extraPct = 0`.
- STL 1:1000: 2.584 driehoeken, 11,09 cm³, 33,0 × 43,7 × 23,6 mm.
- AHN-controle op 3.052 geldige gebouwcellen: 77,2% binnen 1 m, 91,7% binnen 2 m, mediane afwijking 0,65 m. Kleine details en nokpunten zijn niet rastermatig gereconstrueerd.
- Vier gelijke schuine camera's naast de PDOK-reconstructie en vier RCE-referentiefoto's gecontroleerd: elke kant heeft extra gevel- en dakdetails; spitsen, kapellen en donjonrest ontbreken of zijn grof in PDOK.
- Echte preview / 3MF van 100 × 100 m op 1:1000: geheel binnen de uitsnede, 100 × 100 mm, hoogte 23,9 mm. Het hofterrein blijft zichtbaar; voet sluit aan op gracht en hof.
- Webshoptest controleert plaatsing, BAG-vervanging, hofbemonstering, open hof, drie torenpunten, verschillende nokhoogten en lage donjonrest. Beide landmarksuites groen.
- Kaart: [Hernen controleren](http://localhost:3063/kaart/51.8346400/5.6762990/200/1x1/0). Controleer de poort bij de landverbinding en de lage donjonrest; `landmarks=0` toont het oorspronkelijke PDOK-pand.

## Bronnen

- [Rijksmonumentenregister, 9318](https://monumentenregister.cultureelerfgoed.nl/monumenten/9318): bouwdelen en lage donjonrest.
- [Wikimedia Commons, Hernen Castle](https://commons.wikimedia.org/wiki/Category:Hernen_Castle): RCE-foto's `20108963`, `20108962`, `20326590` en `20108956` (Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 3.0 NL; precieze licentie op de bestandspagina).
- [Kasteel Hernen](https://nl.wikipedia.org/wiki/Kasteel_Hernen): context en overdekte weergangen.
- PDOK BAG WFS v2.0, Actueel_orthoHR, AHN DSM / DTM 0,5 m en 3D Basisvoorziening, geraadpleegd 9 oktober 2026.
