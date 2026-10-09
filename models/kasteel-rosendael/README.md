# Kasteel Rosendael (Rozendaal)

Hoofdgebouw, ronde donjon en aangebouwde noordvleugel; oranjerie, park en losse bijgebouwen blijven PDOK-objecten.

## Bestanden en plaatsing

- `kasteel-rosendael.glb`: meters, glTF Y omhoog, één `building:kasteel, donjon en noordvleugel`.
- `kasteel-rosendael.json`: RD-plaatsing en BAG-vervanging.
- `kasteel-rosendael-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- Herbouw: `node scripts/generate-kasteel-rosendael.mjs --components` in nederprint-landmarks.

RD-oorsprong `[194570,446941]`, +X −11,67° langs de gevel, +Y linksom. BAG-pand `0277100000000922` wordt vervangen. Het hoofdgebouw is L-vormig, met een watergevulde uitsparing aan de westzijde; het is geen gevuld vierkant. De donjon heeft een gemeten diameter van 16,08 m.

Waterreferentie NAP +36,86 m, afgeleid uit de drie PDOK-watermetingen 80,351–80,368 m minus de lokale mediaan PDOK-LoD2/AHN 43,505 m. AHN geeft geen bruikbare waterretouren. Bemonstering `[-25,-13]`, `[0,-25]`, `[-7,10]`; terugval 80,36 m ellipsoïdaal. Geen extra plaatsingsverschuiving; voet 0,8 m onder water. Het PDOK-terrein blijft aanwezig.

## Bouwopbouw en maten

| Bouwdeel | Hoogte NAP | Bron |
| --- | --- | --- |
| Goot hoofdgebouw | 51,60 m | AHN en gevelbeelden |
| Omgaand hoofddak, vereenvoudigd binnenvlak | 53,95 m | AHN 0,5 m, luchtfoto |
| Vijf schoorstenen hoofdgebouw | 55,20–55,60 m | AHN/luchtfoto |
| Donjonwand | 55,85 m | AHN; RCE noemt 19 m hoogte |
| Conische donjonkap / balustrade | 58,30 / 59,25 m | AHN en recente foto's |
| Lichtlantaarn / koepeltop | 61,80 / 64,80 m | AHN; huidige koepel op foto 1999/2005 |
| Noordelijke lengtedaken | 48,30–48,45 m | AHN, plan en foto's |
| Klokkentorentje | 54,05 m | AHN onderste gedeelte; spits uit foto geschat |

Vlakken en afzonderlijke bouwdelen vormen de gevels en daken. Het hoofddak heeft vier schuine buitenvlakken met een vereenvoudigd horizontaal binnenvlak. De noordvleugel heeft twee lengtedaken met een lager verbindingsdal. De ronde torenwand is een 48-zijdige cilinder; de kap verloopt naar een achthoekige balustrade en lichtlantaarn met acht vensternissen. Daarboven staat een koepel uit twee schuine facetgroepen.

Aan de oostzijde liggen het driehoekige ingangsfronton, twee pilasters, bordes, vier vereenvoudigde traptreden en de veranda. De gevelnissen volgen vijf traveeën van het hoofdgebouw, minder regelmatige achtergevels en zeven vakken van de lage vleugel. Op het hoofddak staan vier kapellen. De donjon krijgt ongelijkmatig verdeelde vensternissen en het gemetselde restant van het gemak.

## Schattingen en printvereenvoudigingen

Het noordelijke dakeinde ligt in AHN onder boomkruinen; de vlakken lopen daar volgens de zichtbare daklijnen en foto's door. De precieze nokpositie, het centrale dakdal, de spits van het klokkentorentje, raamposities, kapellen en profiel van de koepel zijn vereenvoudigd of geschat. De historische foto uit 1979 toont de donjon nog zonder de huidige lichtlantaarn; gebruikt voor gevelindeling, niet voor de huidige torenbekroning.

Balustrade van de donjon is een gesloten ring van 0,9 m dik. Veranda heeft naar vaste volumes verdikte kolommen en vier smalle openingen met steile puntige bovenzijden in plaats van het fijne gietijzerwerk. De veranda-onderbouw loopt tot de modelvoet door. Vensternissen zijn 0,35 m diep. Roeden, persiennes, windwijzers, fijn houtsnijwerk en metalen balustrades vervallen. Schoorstenen zijn minimaal 1,1 m breed; pijlers minimaal 0,9 m. Het hoofdgebouw, de donjon en de lage vleugel zijn verbonden, zonder interne verborgen holtes.

Actuele BGT bevat rond het gebouw geen overbruggingsdeel; de ingangstrap sluit direct aan op het erf. Geen brugdek of wegklasse verzonnen; `replaces-terrain.mjs` vindt nul dekvlakken.

## Controle

- Generator en Float32-rondgang: `NoError`, genus 0, één positief verbonden volume, geen verborgen holte.
- STL 1:1000: 2.960 driehoeken, 15,19 cm³, 40,4 × 55,0 × 28,7 mm.
- Draagvlakken steiler dan 45°, behalve de ondiepe vensternisplafonds; werkelijke gedeelde printsteuncontrole +0,0313% volume door deze kleine nissen.
- AHN-vergelijking: 4.272 cellen, 59,5% binnen 1 m, 77,6% binnen 2 m; mediane afwijking 0,68 m. Boomkruinen aan het noordelijke uiteinde en vereenvoudigingen in het dakdal verklaren een deel van de afwijking.
- Vier gelijke schuine camera's naast PDOK en schuine RCE-foto's gecontroleerd; elke gevel heeft aanvullende nissen, dakdetails of ingang/veranda. Ronde donjon, uitsparing en lagere vleugel blijven herkenbaar.
- Echte preview/3MF van 110 × 110 m op 1:1000: 110 × 110 mm, hoogte 29,2 mm; volledig model en vijver vallen binnen de uitsnede.
- Beide landmarksuites: 302 tests groen. Permanente monumenttest controleert waterbemonstering, BAG-vervanging, toren/lantaarnhoogten, noorddak, L-uitsparing en ingangstrap.
- [Controlekaart](http://localhost:3063/kaart/52.0094240/5.9635460/220/1x1/0): controleer de lichtkoepel en gesloten balustrade, twee lage noorddaken, veranda en ingangstrap; `landmarks=0` toont PDOK.

## Bronnen

- [RCE hoofdgebouw 528472](https://monumentenregister.cultureelerfgoed.nl/monumenten/528472): L-vorm, donjon, omgaand dak, lichtlantaarn, veranda en klokkentorentje.
- [Commons Kasteel Rosendael](https://commons.wikimedia.org/wiki/Category:Kasteel_Rosendael): RCE 20339768 achterzijde (1999), 20363889 donjon (2005), 20339767 voor/rechterzijde (1999), 20193536 gevelbeeld (1979), Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0 volgens bestandspagina's.
- PDOK BAG WFS, BGT OGC API, AHN DSM/DTM 0,5 m, Actueel_orthoHR en 3D Basisvoorziening, 9 oktober 2026.
